export class APIFeatures {
  // Setting initial query and queryStr when object is created using this class
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  /*
  eg:
    query = Products.find()
    queryStr = {
        page: '1',
        sort: 'price',
        limit: '5',
        fields: "title, description, price, stock"
    }
  */

  // Searching for products
  search() {
    const searchQuery = this.queryStr?.search?.trim();

    // Searches product based on product title (or) product category
    const filteredSearch = searchQuery
      ? {
          $or: [
            {
              title: {
                $regex: searchQuery,
                $options: "i",
              },
            },
            {
              category: {
                $regex: searchQuery,
                $options: "i",
              },
            },
          ],
        }
      : {};

    // Searching for products only when search query is given by user
    if (searchQuery) {
      this.query = this.query.find({ ...filteredSearch });
    }

    // Returning the searched products query
    return this;
  }

  // Applying filters to the above searched products
  filter() {
    // here we only handle normal queries and not page, sort, limit and fields as we are handling them separately.
    const queryObj = { ...this.queryStr };

    const excludedFields = ["page", "sort", "limit", "fields", "search"];
    excludedFields.forEach((field) => delete queryObj[field]);

    // Updating the query to add correct form for 'gte, gt, lt, lte'
    let addDollarSymbol = JSON.stringify(queryObj);
    addDollarSymbol = addDollarSymbol.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`
    );

    // Finding the products after applying all the filters
    this.query = this.query.find(JSON.parse(addDollarSymbol));

    // Returning the filtered products query
    return this;
  }

  // Sorting the above filtered products
  sortBy() {
    const sortQuery = this.queryStr?.sort?.trim();

    // If sort is provided in query
    if (sortQuery) {
      const sortFields = sortQuery.split(",").join(" ");

      // Sorting the products based on provided sort query
      this.query = this.query.sort(sortFields);
    } else {
      // if sort is not provided then we sort products in descending order according to their date of creation
      this.query = this.query.sort("-createdAt");
    }

    // Returning the sorted products query
    return this;
  }

  // Limiting the fields of above sorted products
  limitFields() {
    const fieldsQuery = this.queryStr?.fields?.trim();

    // Only returning particular fields in each document if fieldsQuery is provided by user
    if (fieldsQuery) {
      const requiredFields = fieldsQuery.split(",").join(" ");

      this.query = this.query.select(requiredFields);
    }

    // Returning the sorted products with limited fields.
    return this;
  }

  // Paginating the above limited fields, sorted products
  paginate() {
    const pageQuery = this.queryStr?.page?.trim(),
      limitQuery = this.queryStr?.limit?.trim();

    // Returning all products without no pagination
    if (pageQuery === "all") {
      return this;
    }

    const perPage = Number(pageQuery) * 1 || 1;
    const pageLimit = Number(limitQuery) * 1 || 9;

    // Returning only 9 products per page
    this.query = this.query.skip((perPage - 1) * pageLimit).limit(pageLimit);

    // Returning the paginated products query
    return this;
  }
}

export class APIFeatures {
  // Setting initial query and queryStr when object is created using this class
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // Searching for products
  search() {
    const searchQuery = this.queryStr?.search?.trim();

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
      this.query.push({ $match: { ...filteredSearch } });
    }

    // Returning the searched products query
    return this;
  }

  // Applying filters to the above searched products
  filter() {
    // here we only handle normal queries and not page, sort, limit and fields as we are handling them separately.
    const queryObj = JSON.parse(JSON.stringify(this.queryStr));

    const excludedFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "search",
      "placeOfUse",
    ];
    excludedFields.forEach((field) => delete queryObj[field]);

    // Updating the query to add correct form for 'gte, gt, lt, lte'
    const fieldsOfTypeNum = [
      "discountPrice",
      "price",
      "rating",
      "stock",
      "numOfReviews",
      "discount",
    ];

    // Converting the numbers present in string format to actual number format
    for (let item in queryObj) {
      if (fieldsOfTypeNum.includes(item)) {
        const fieldFilters = queryObj[item];
        for (let filter in fieldFilters) {
          fieldFilters[filter] = parseInt(fieldFilters[filter]);
        }
      }
    }

    let addDollarSymbol = JSON.stringify(queryObj);

    addDollarSymbol = addDollarSymbol.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`
    );

    // Finding the products after applying all the filters
    if (!this.queryStr?.search) {
      this.query.push({ $match: JSON.parse(addDollarSymbol) });
    }

    // Returning the filtered products query
    return this;
  }

  // Sorting the above filtered products
  sortBy() {
    const sortQuery = this.queryStr?.sort?.trim();

    // If sort is provided in query
    if (sortQuery) {
      const sortFields = sortQuery.split(",");

      const sortedFieldsObj = sortFields.reduce((acc, item) => {
        const trimmedFilter = item.trim();
        if (trimmedFilter.includes("-")) {
          acc[trimmedFilter.slice(1)] = -1;
        } else {
          acc[trimmedFilter] = 1;
        }
        return acc;
      }, {});

      // Sorting the products based on provided sort query
      this.query.push({ $sort: sortedFieldsObj });
    } else {
      // if sort is not provided then we sort products in descending order according to their date of creation
      this.query.push({ $sort: { createdAt: -1 } });
    }

    // Returning the sorted products query
    return this;
  }

  // Limiting the fields of above sorted products
  limitFields() {
    const fieldsQuery = this.queryStr?.fields?.trim();

    // Only returning particular fields in each document if fieldsQuery is provided by user
    if (fieldsQuery) {
      const requiredFields = fieldsQuery.split(",");

      const fieldsObj = requiredFields.reduce((acc, item) => {
        if (item.trim() === "description") {
          acc[item.trim()] = { $substr: ["$description", 0, 165] };
        } else {
          acc[item.trim()] = `$${item.trim()}`;
        }
        return acc;
      }, {});

      fieldsObj._id = "$_id";
      fieldsObj.images = { $slice: ["$images", 1] };

      this.query.push({ $project: fieldsObj });
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
    this.query.push({ $skip: (perPage - 1) * pageLimit });
    this.query.push({ $limit: pageLimit });

    // Returning the paginated products query
    return this;
  }
}

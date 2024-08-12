export class APIFeatures {
  // Setting initial query and queryStr when object is created using this class
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  /*
     const queryForSearch = [
      { 
        $match: {
          $or: [
            { title: { $regex: 'women', $options: 'i'} },
            { category: { $regex: 'women', $options: 'i'} },
          ]
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: 1 },
      { $limit: 9 },
      { $project: {
          _id: '$_id',
          title: '$title',
          description: '$description',
          price: '$price',
          createdAt: '$createdAt',
          numOfReviews: '$numOfReviews',
          rating: '$rating',
          discount: '$discount',
          discountPrice: '$discountPrice',
          images: { $slice: ['$images', 1] }
        } 
      } 
    ];
  
  */

  /*
    eg for search products case:
      query = []
      queryStr = {
        search: 'women'
      }
  */

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

    // console.log("Query in search(): ", this.query);

    // Returning the searched products query
    return this;
  }

  // Applying filters to the above searched products
  filter() {
    // here we only handle normal queries and not page, sort, limit and fields as we are handling them separately.
    const queryObj = JSON.parse(JSON.stringify(this.queryStr));

    const excludedFields = ["page", "sort", "limit", "fields", "search"];
    excludedFields.forEach((field) => delete queryObj[field]);

    // console.log("Before QueryObj: ", queryObj);

    // Updating the query to add correct form for 'gte, gt, lt, lte'

    const fieldsOfTypeNum = [
      "discountPrice",
      "price",
      "rating",
      "stock",
      "numOfReviews",
      "discount",
    ];

    for (let item in queryObj) {
      if (fieldsOfTypeNum.includes(item)) {
        const fieldFilters = queryObj[item];
        for (let filter in fieldFilters) {
          fieldFilters[filter] = parseInt(fieldFilters[filter]);
        }
      }
    }

    // console.log("After QueryObj: ", queryObj);

    let addDollarSymbol = JSON.stringify(queryObj);

    // console.log("Stringified Filters: ", addDollarSymbol);

    addDollarSymbol = addDollarSymbol.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`
    );

    // console.log("Parsed Filters: ", JSON.parse(addDollarSymbol));

    // Finding the products after applying all the filters
    if (!this.queryStr?.search) {
      this.query.push({ $match: JSON.parse(addDollarSymbol) });
    }

    // console.log("Query in filter(): ", this.query);

    // Returning the filtered products query
    return this;
  }

  // Sorting the above filtered products
  sortBy() {
    const sortQuery = this.queryStr?.sort?.trim();

    // If sort is provided in query
    if (sortQuery) {
      const sortFields = sortQuery.split(",");

      // console.log("sortFields: ", sortFields);

      const sortedFieldsObj = sortFields.reduce((acc, item) => {
        const trimmedFilter = item.trim();
        if (trimmedFilter.includes("-")) {
          acc[trimmedFilter.slice(1)] = -1;
        } else {
          acc[trimmedFilter] = 1;
        }
        return acc;
      }, {});

      // console.log("sortedFieldsObj", sortedFieldsObj);

      // Sorting the products based on provided sort query
      this.query.push({ $sort: sortedFieldsObj });
    } else {
      // if sort is not provided then we sort products in descending order according to their date of creation
      // this.query = this.query.sort("-createdAt");
      this.query.push({ $sort: { createdAt: -1 } });
    }

    // console.log("Query in sortBy(): ", this.query);

    // Returning the sorted products query
    return this;
  }

  // Limiting the fields of above sorted products
  limitFields() {
    const fieldsQuery = this.queryStr?.fields?.trim();

    // Only returning particular fields in each document if fieldsQuery is provided by user
    if (fieldsQuery) {
      const requiredFields = fieldsQuery.split(",");

      // console.log("requiredFields: ", requiredFields);

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

      // console.log("fieldsObj: ", fieldsObj);
      // this.query = this.query.select(requiredFields);
      this.query.push({ $project: fieldsObj });
    }

    // console.log("Query in limitFields(): ", this.query);

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
    // this.query = this.query.skip((perPage - 1) * pageLimit).limit(pageLimit);
    this.query.push({ $skip: (perPage - 1) * pageLimit });
    this.query.push({ $limit: pageLimit });

    // console.log("Query in paginate(): ", this.query);

    // Returning the paginated products query
    return this;
  }
}

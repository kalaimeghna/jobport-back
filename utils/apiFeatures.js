class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Search
  search() {
    const keyword = this.queryString.keyword
      ? {
          $or: [
            {
              title: {
                $regex: this.queryString.keyword,
                $options: "i",
              },
            },
            {
              description: {
                $regex: this.queryString.keyword,
                $options: "i",
              },
            },
            {
              location: {
                $regex: this.queryString.keyword,
                $options: "i",
              },
            },
            {
              category: {
                $regex: this.queryString.keyword,
                $options: "i",
              },
            },
          ],
        }
      : {};

    this.query = this.query.find(keyword);

    return this;
  }

  // Filter
  filter() {
    const queryObj = { ...this.queryString };

    const removeFields = [
      "keyword",
      "page",
      "limit",
      "sort",
      "fields",
    ];

    removeFields.forEach((key) => delete queryObj[key]);

    // Salary filtering
    if (queryObj.minSalary || queryObj.maxSalary) {
      queryObj.salary = {};

      if (queryObj.minSalary) {
        queryObj.salary.$gte = Number(queryObj.minSalary);
      }

      if (queryObj.maxSalary) {
        queryObj.salary.$lte = Number(queryObj.maxSalary);
      }

      delete queryObj.minSalary;
      delete queryObj.maxSalary;
    }

    this.query = this.query.find(queryObj);

    return this;
  }

  // Sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  // Select specific fields
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");

      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  // Pagination
  paginate() {
    const page = Number(this.queryString.page) || 1;

    const limit = Number(this.queryString.limit) || 10;

    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
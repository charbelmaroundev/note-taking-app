class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // filter
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["sort"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // sort
  sort() {
    if (this.queryString.sort === "latest") {
      this.query = this.query.sort("-updatedAt");
    } else if (this.queryString.sort === "oldest") {
      this.query = this.query.sort("updatedAt");
    }

    return this;
  }
}
module.exports = APIFeatures;

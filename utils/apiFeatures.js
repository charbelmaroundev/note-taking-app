class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  sort() {
    this.query = this.query.sort("-updatedAt");
    return this;
  }
}
module.exports = APIFeatures;

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

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

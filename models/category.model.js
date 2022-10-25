const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name for category"],
  },

  notes_id: {
    type: mongoose.Schema.Types.ObjectId,
  },

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: "User",
    required: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;

const mongoose = require("mongoose");
const { Schema } = mongoose;

const BasicSchema = new Schema({
  semanticValue: {
    type: String,
    required: true,
  },
  dataApp: {
    type: [{type: Schema.ObjectId}],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: String,
  },
});
module.exports = mongoose.model("Note", NoteSchema);

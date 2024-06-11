const mongoose = require("mongoose");
const { date } = require("yup");

const RequestSchema = mongoose.Schema({
  create_date: {
    type: String,
    required: true,
  },
  client: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const RequestClient = mongoose.model("Request", RequestSchema);

module.exports = RequestClient;

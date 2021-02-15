var aMongoose = global.theMongoose;

let vehicleSchema = new aMongoose.Schema(
  {
    no: { type: String, required: true, unique: true },
    make: { type: String, required: true },
    model: { type: String, required: true},
    year: { type: String, required: true},
    price: { type: String, required: true},
    status: { type: String, required: true},
  },
  {
    collection: "vehicle"
  }
);

var self = (module.exports = aMongoose.model("vehicle", vehicleSchema));

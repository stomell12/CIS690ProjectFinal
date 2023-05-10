const mongoose = require('mongoose');

const { Schema } = mongoose;

const patientSchema = new Schema({
  //CreatorId: { type: String, required: true },
  //CreatorName: { type: String, required: true },
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  Birthdate: { type: Date, required: true },
  Zipcode: { type: String, required: true },
  State: { type: String, required: true },
  PhoneNumber: { type: String, required: true },
  //CreateDate: { type: Date, required: true },
  InsuranceType: { type: String, required: true },
  TestType: { type: String, required: true },
  DoctorService: { type: String, required: true },
  LabName: { type: String, required: true },
  SampleStatus: { type: String, required: true },
  timeline: [
    {
      checkpoint: String,
      date: Date,
    },
  ],
  comments: [
    {
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});


const patient = mongoose.model('patient', patientSchema);

module.exports = patient;
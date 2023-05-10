const Patient = require('../models/patientModel');
const excel = require('exceljs');

exports.exportExcel = async function(req, res) {
  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet('Patients')

  let patients = await Patient.find({});
  patients = patients.map((patient) => {
    const sortedTimeline = patient.timeline.sort((a, b) => new Date(b.date) - new Date(a.date));
    const latestCheckpoint = sortedTimeline.length > 0 ? sortedTimeline[0].checkpoint : "Not completed";
    return {
      ...patient._doc,
      SampleStatus: latestCheckpoint,
    };
  });

  
  worksheet.columns = [
    { header: 'First Name', key: 'FirstName', width: 15 },
    { header: 'Last Name', key: 'LastName', width: 15 },
    { header: 'Birth Date', key: 'Birthdate', width: 15 },
    { header: 'State', key: 'State', width: 10 },
    { header: 'Phone Number', key: 'PhoneNumber', width: 15 },
    { header: 'Insurance Type', key: 'InsuranceType', width: 15 },
    { header: 'Test Type', key: 'TestType', width: 10 },
    { header: 'Doctor Service', key: 'DoctorService', width: 15 },
    { header: 'Lab Name', key: 'LabName', width: 10 },
    { header: 'Sample Status', key: 'SampleStatus', width: 15 },
  ];
  const fileName = 'patients.xlsx';
  worksheet.addRows(patients);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);

  // Write the workbook to the response and send it
  return workbook.xlsx.write(res).then(() => {
    res.status(200).end();
  });
}




exports.create = async function(req, res) {
  let patient = new Patient({
    //CreatorId: req.body.creatorId,
    //CreatorName: req.body.creatorName,
    FirstName: req.body.firstName,
    LastName: req.body.lastName,
    Birthdate: req.body.birthdate,
    Zipcode: req.body.zipcode,
    State: req.body.state,
    PhoneNumber: req.body.phoneNumber,
    //CreateDate: req.body.createDate,
    InsuranceType: req.body.insuranceType,
    TestType: req.body.testType,
    DoctorService: req.body.doctorService,
    LabName: req.body.labName,
    SampleStatus: req.body.sampleStatus,
  });

  try {
    await patient.save();
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
};

exports.getall = async function(req, res) {
  try {
    var returnedPatient = await Patient.find({});
    console.log(returnedPatient);
    res.render('./dashboard/list', { patient: returnedPatient, loggedInUser: req.user });
  } catch (err) {
    console.log(err);
  }
};

exports.delete = async function(req, res) {
  const deletedPatient = await Patient.findOneAndDelete({ _id: req.query.id });
  console.log("Deleted patient:", deletedPatient);
  res.redirect('/patient/list');
};

exports.update = async function(req, res) {
  console.log('req.body:', req.body);
  const updatedPatient = await Patient.findOneAndUpdate({ _id: req.query.id }, { $set: req.body }, { new: true });
  console.log("Updated patient:", updatedPatient);
  res.redirect('/patient/list');
};

exports.showUpdateForm = async function(req, res) {
  const patient = await Patient.findById(req.query.id);
  console.log("Patient data:", patient.toObject());
  res.render('patient/update', { patient: patient.toObject(), loggedInUser: req.user });
};

exports.showTimeline = async function(req, res) {
  const patient = await Patient.findById(req.query.id);
  if (patient) {
    res.render('patient/timeline', { patient: patient.toObject(), loggedInUser: req.user, patientId: patient._id });
  } else {
    res.status(404).send('Patient not found');
  }
};

exports.addCheckpoint = async function(req, res) {
  console.log('Adding checkpoint with data:', req.body);
  const patientId = req.body.patientId;
  const checkpoint = req.body.checkpoint;
  const date = req.body.date;
  const completed = true; // Set the completed property to true
  const loggedInUser = req.user;

  const updatedPatient = await Patient.findByIdAndUpdate(
    patientId,
    {
      $push: { timeline: { checkpoint, date, completed } },
    },
    { new: true }
  );
  console.log('Updated patient after adding checkpoint:', updatedPatient.toObject());
  res.redirect(`/patient/timeline?id=${patientId}`);
};

exports.deleteCheckpoint = async function(req, res) {
  console.log('Deleting checkpoint with data:', req.body);
  const patientId = req.body.patientId;
  const checkpointId = req.body.checkpointId;

  const updatedPatient = await Patient.findByIdAndUpdate(
    patientId,
    {
      $pull: { timeline: { _id: checkpointId } },
    },
    { new: true }
  );

  console.log('Updated patient after deleting checkpoint:', updatedPatient.toObject());
  res.redirect(`/patient/timeline?id=${patientId}`);
};
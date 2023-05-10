var express = require('express');
var router = express.Router();
const patientController = require('../controllers/patientController');
const Patient = require('../models/patientModel');
const excel = require('exceljs');
const { ensureAuthenticated, roleAuthorization } = require('../middleware/auth');


router.get('/create', ensureAuthenticated, roleAuthorization(['Data Entry Specialist', 'Admin']), function(req, res, next) {
  res.render('patient/create', { loggedInUser: req.user });
});
router.get('/list', ensureAuthenticated, roleAuthorization(['Data Entry Specialist', 'Admin', 'Quality Control']), patientController.getall);

router.get('/delete', ensureAuthenticated, roleAuthorization(['Data Entry Specialist', 'Admin']), patientController.delete);

router.post('/create', ensureAuthenticated, roleAuthorization(['Data Entry Specialist', 'Admin']), async function(req, res, next) {
  const patientData = new Patient({
    //CreatorId: req.user.id,
    //CreatorName: req.user.firstName + ' ' + req.user.lastName,
    FirstName: req.body.firstName,
    LastName: req.body.lastName,
    Birthdate: req.body.dateOfBirth,
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
    await patientData.save();
    res.redirect('/dashboard/list');
  } catch (err) {
    console.log(err);
    res.render('error');
  }
});

router.get('/update', ensureAuthenticated, roleAuthorization(['Data Entry Specialist', 'Admin']), patientController.showUpdateForm);
router.post('/update', ensureAuthenticated, roleAuthorization(['Data Entry Specialist', 'Admin']), patientController.update);

router.get('/exportExcel', ensureAuthenticated, function(req, res, next) {
  patientController.exportExcel(req, res);
});

router.get('/timeline', ensureAuthenticated, function(req, res, next) {
  patientController.showTimeline(req, res);
});

router.post('/addCheckpoint', ensureAuthenticated, patientController.addCheckpoint);

router.post('/deleteCheckpoint', patientController.deleteCheckpoint);

// Add a comment
router.post('/comment', async (req, res) => {
  const patientId = req.body.patientId;
  const commentContent = req.body.commentContent;

  try {
    await Patient.findByIdAndUpdate(patientId, {
      $push: {
        comments: {
          content: commentContent,
        },
      },
    });
    res.redirect(`/patient/timeline?id=${patientId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding comment');
  }
});

// Get comments for a patient
router.get('/comments/:patientId', async (req, res) => {
  const patientId = req.params.patientId;

  try {
    const patient = await Patient.findById(patientId);
    res.json(patient.comments);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching comments');
  }
});

module.exports = router;
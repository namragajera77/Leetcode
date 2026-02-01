const express = require('express');
const usermiddleware = require('../middleware/usermiddleware')
const {usersubmission,runCode,getUserSubmissions} = require('../controllers/usersubmission');

const submitrouter = express.Router();

submitrouter.post('/submit/:id',usermiddleware,usersubmission);
submitrouter.post("/run/:id",usermiddleware,runCode);
submitrouter.get("/userSubmission",usermiddleware,getUserSubmissions);

module.exports = submitrouter;

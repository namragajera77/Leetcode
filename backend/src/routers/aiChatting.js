const express = require('express');
const aiRouter =  express.Router();
const usermiddleware = require("../middleware/usermiddleware");
const solveDoubt = require('../controllers/solveDoubt');
const generateHint = require('../controllers/aiHint');
const reviewCode = require('../controllers/aiReview');

aiRouter.post('/chat', usermiddleware, solveDoubt);
aiRouter.post('/hint', usermiddleware, generateHint);
aiRouter.post('/review', usermiddleware, reviewCode);

module.exports = aiRouter;
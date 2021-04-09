const express = require('express');

const issuesController = require('../controllers/issues');

const router = express.Router();

router.patch('/update-status/:id', issuesController.updateIssueStatus);

module.exports = router;

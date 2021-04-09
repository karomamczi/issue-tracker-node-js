const Issue = require('../models/issue');

exports.getIssueTracker = (req, res, next) => {
  Issue.fetchAll().then((issues) => {
    res.render('issue-tracker', {
      issues,
    });
  });
};

exports.updateIssueStatus = (req, res, next) => {};

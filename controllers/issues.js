const Issue = require('../models/issue');

exports.getIssues = (req, res, next) => {
  Issue.fetchAll().then((issues) => {
    res.render('issue-tracker', {
      issues,
    });
  });
};

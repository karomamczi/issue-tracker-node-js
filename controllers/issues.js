const Issue = require('../models/issue');

exports.getIssueTracker = async (req, res) => {
  const issues = await Issue.fetchAll();
  res.render('issue-tracker', {
    issues,
    pageTitle: 'Issue Tracker',
  });
};

exports.updateIssueStatus = async (req, res) => {
  const body = req.body;
  const id = req.params.id;

  try {
    await Issue.saveNewStatus(id, body.status);
  } catch (e) {
    res.status(e.code).send(e.errors.join(','));
  } finally {
    res.end();
  }
};

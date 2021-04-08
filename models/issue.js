const fs = require('fs');
const path = require('path');

const dataPath = path.join(
  path.dirname(require.main.filename),
  'data',
  'issues.json'
);

const Issue = {};

Issue.resolveDataResponse = (err, data, resolve) => {
  resolve(err ? [] : JSON.parse(data));
};

Issue.getIssuesFromFile = async () => {
  return new Promise((resolve, reject) => {
    fs.readFile(dataPath, (err, data) => {
      Issue.resolveDataResponse(err, data, resolve);
    });
  });
};

Issue.fetchAll = async () => await Issue.getIssuesFromFile();

Issue.getIndex = async (id) => {
  const issues = await Issue.getIssuesFromFile();

  return Promise.resolve(issues.findIndex((issue) => issue.id === id));
};

const STATUS = {
  OPEN: 'open',
  PENDING: 'pending',
  CLOSED: 'closed',
};

Issue.STATUS = STATUS;

Issue.isValidStatusChange = (oldStatus, newStatus) => {
  const validChange = {
    [STATUS.OPEN]: [STATUS.PENDING, STATUS.CLOSED],
    [STATUS.PENDING]: [STATUS.CLOSED],
    [STATUS.CLOSED]: [],
  };

  return validChange[oldStatus].includes(newStatus);
};

Issue.saveIssues = (issues) => {
  fs.writeFile(dataPath, JSON.stringify(issues));
};

Issue.saveNewStatus = async (id, newStatus) => {
  const index = await Issue.getIndex(id);
  if (index === -1) {
    return Promise.reject('Issue of id: ' + id + " doesn't exist!");
  }

  const issues = await Issue.getIssuesFromFile();
  const issue = issues[index];
  const isValid = Issue.isValidStatusChange(issue.status, newStatus);

  if (!isValid) {
    return Promise.reject(
      'Invalid status change from ' + issue.status + ' to ' + newStatus + '!'
    );
  }

  issue.status = newStatus;

  Issue.saveIssues(issues);

  return Promise.resolve('Status ' + newStatus + ' set successfully!');
};

module.exports = Issue;

const fs = require('fs');
const path = require('path');
const ServerResponse = require('./server-message');

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
  return new Promise((resolve, reject) => {
    fs.writeFile(dataPath, JSON.stringify(issues), (err) => {
      reject(err);
    });
    resolve();
  });
};

Issue.saveNewStatus = async (id, newStatus) => {
  const index = await Issue.getIndex(id);
  if (index === -1) {
    return Promise.reject(
      new ServerResponse(
        404,
        ['Issue of id: ' + id + " doesn't exist!"],
        ServerResponse.STATUS.FAILURE
      )
    );
  }

  const issues = await Issue.getIssuesFromFile();
  const issue = issues[index];
  const isValid = Issue.isValidStatusChange(issue.status, newStatus);

  if (!isValid) {
    return Promise.reject(
      new ServerResponse(
        422,
        [
          'Invalid status change from ' +
            issue.status +
            ' to ' +
            newStatus +
            '!',
        ],
        ServerResponse.STATUS.FAILURE
      )
    );
  }

  issue.status = newStatus;

  try {
    await Issue.saveIssues(issues);
  } catch (e) {
    return Promise.reject(
      new ServerResponse(422, [e], ServerResponse.STATUS.FAILURE)
    );
  }

  return Promise.resolve(
    new ServerResponse(200, [], ServerResponse.STATUS.SUCCESS)
  );
};

module.exports = Issue;

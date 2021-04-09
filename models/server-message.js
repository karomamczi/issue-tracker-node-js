function ServerResponse(code, errors, status) {
  this.code = code;
  this.errors = errors;
  this.status = status;
}

ServerResponse.STATUS = {
  SUCCESS: 'success',
  FAILURE: 'failure',
};

module.exports = ServerResponse;

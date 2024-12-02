function sendJSONResponse(res, statusCode, status, msg, data = null) {
  return res.status(statusCode).json({
    status,
    msg,
    data,
  });
}

module.exports = {
  sendJSONResponse,
};

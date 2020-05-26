const responseBadRequest = (res, message) => {
  return res.status(400).json({
    success: false,
    message,
  });
};

const responseNotFound = (res, message, data = []) => {
  return res.status(404).json({
    success: false,
    message,
    data
  });
};

const responseOkCreated = (res, data) => {
  return res.status(201).json({
    success: true,
    message: "added",
    data,
  });
};

const responseOk = (res, data) => {
  return res.status(200).json({
    success: true,
    data,
  });
};
const responseConflict = (res) => {
  return res.status(409).json({
    success: false,
    message: "user name exist",
  });
};
const responseBadAuth = (res) => {
  return res.status(401).json({
    success: false,
    message: "auth failed",
  });
};

const responseOkUserCreated = (res, userdata) => {
  return res.status(201).json({
    success: true,
    message: "user successfully added",
    userdata,
  });
};

const responseServerError = (res) => {
  return res.status(500).json({
    success: false,
    message: "internal server error",
  });
};
const responseValidationError = (res, message) => {
  return res.status(400).json({
    success: false,
    message,
  });
};

export {
  responseBadRequest,
  responseNotFound,
  responseOkCreated,
  responseOk,
  responseConflict,
  responseBadAuth,
  responseOkUserCreated,
  responseServerError,
  responseValidationError,
};

//Avoid Repetitive try catch block in route controller/handler

const RouteError = (message, status = 400) => {
  return Object.assign(new Error(message), { status: status });
};
const errorHandlers = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandlers, RouteError };

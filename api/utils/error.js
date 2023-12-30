    const errorHandler = (statusCode, message) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message || "empty";
    return error;
}

export default errorHandler;
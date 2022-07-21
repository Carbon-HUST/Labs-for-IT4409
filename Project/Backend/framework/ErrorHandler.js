const errorHandler = (req, res, next, err) => {
    let customError = {
        // set default
        statusCode: err.statusCode || 500,
        msg: err.message || 'Something went wrong try again later',
    }   

    res.statusCode = customError.statusCode;
    //res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        msg: customError.msg
    }));
}

module.exports = errorHandler
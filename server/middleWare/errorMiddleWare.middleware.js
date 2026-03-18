function ErrorMiddleWare(err,req,res,next){
    if(res.headersSent){
        return next(err);
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong';

    res.status(statusCode).json({
        success: false,
        message:message,
        stack : err.stack
    })

}

export default ErrorMiddleWare;
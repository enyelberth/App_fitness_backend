export const success = (req,res,message='',status=200)=>{
    // const statusCode = status || 200;
    // const messageOk = message || '';
    res.status(status).send({
      error: false,
      status: status,
      body: message
    });
};
export const error = (req, res, message='Error interno', status=500) => {
    //   const statusCode = status || 500;
    //   const messageError = message || 'Error interno';
    res.status(status).send({
    error: true,
    status: status,
    body: message,
  });
};
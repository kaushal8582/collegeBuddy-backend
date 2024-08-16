class ApiError extends Error{
  constructor(statusCode,message ="something went wrong",errors =[],stack =""){
    super(message)
    this.message = message
    this.errors = errors
    this.statusCode = statusCode

    if(stack){
      this.stack = stack
    }else{
      Error.captureStackTrace(this,this.constructor)
    }

  }
}


export {ApiError}
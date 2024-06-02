
import Joi, { ObjectSchema } from "joi";
import { Request,Response,NextFunction,RequestHandler } from "express";

const validationOptions = {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: false,
};

interface ValidationError {
    message: string;
    type: string;
  }
  
  interface JoiError {
    status: string;
    error: {
      original: unknown;
      details: ValidationError[];
    };
  }
  
  interface CustomError {
    status: string;
    error: string;
  }

const schemaValidatorMiddleware = (path: string,schema:ObjectSchema, useJoiError = true): RequestHandler => {
  
    if (!schema) {
      throw new Error(`Schema not found for path: ${path}`);
    }
  
    return (req:Request, res:Response, next:NextFunction) => {
      const method = req.method.toLowerCase();
  
  
      const { error, value } = schema.validate(req.body, validationOptions);
  
      if (error) {
        console.log("errorr",error);
        const customError: CustomError = {
          status: "failed",
          error: "Invalid request. Please review request and try again.",
        };
  
        const joiError: JoiError = {
          status: "failed",
          error: {
            original: error._original,
            details: error.details.map(({ message, type }: ValidationError) => ({
              message: message.replace(/['"]/g, ""),
              type,
            })),
          },
        };
  
        return res.status(422).json(useJoiError ? joiError : customError);
      }
  
      // validation successful
      req.body = value;
      return next();
    };
  };
  
  export default schemaValidatorMiddleware;
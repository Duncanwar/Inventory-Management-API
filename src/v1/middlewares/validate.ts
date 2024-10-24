import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

// Middleware to validate schema
const validate =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message.slice() });
    }
    next();
  };

export default validate;

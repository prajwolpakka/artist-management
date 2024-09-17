import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export function validate<T>(schema: z.ZodSchema<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body.authUser ? req.body.data : req.body;
    console.log(body);
    const parsed = schema.safeParse(body);
    if (parsed.success) {
      if (req.body.authUser) {
        req.body.data = parsed.data;
      } else {
        req.body = parsed.data;
      }
      return next();
    } else {
      res.status(400).send(parsed.error);
    }
  };
}

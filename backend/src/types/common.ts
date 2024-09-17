import { Request } from "express";
import { ZodSchema, z } from "zod";

const anySchema = z.record(z.string(), z.any());

export type AnySchema = typeof anySchema;

export type InferredType<T> = T extends ZodSchema ? z.infer<T> : T;

export type TypedRequest<BodySchema = unknown, QuerySchema = unknown> = Request<
	any,
	unknown,
	InferredType<BodySchema>,
	InferredType<QuerySchema>
>;

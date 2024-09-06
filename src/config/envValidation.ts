import { z, ZodError, ZodSchema } from 'zod';
import { ValidationIssuesError } from '../utils/ValidationIssuesError';

const validateEnv = <TSchema extends ZodSchema>(
  schema: TSchema,
  configName: string
) => {
  return (): z.infer<TSchema> => {
    try {
      return schema.parse(import.meta.env);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationIssuesError(
          error,
          `Validation error in ${configName} config`
        );
      } else {
        throw error;
      }
    }
  };
};

const apiConfigSchema = z.object({
  VITE_SERVER_URL: z.string().url()
});

export const validateApiConfig = validateEnv(apiConfigSchema, 'api');

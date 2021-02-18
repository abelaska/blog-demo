import Ajv, { Schema } from 'ajv';
import addFormats from 'ajv-formats';
import addKeywords from 'ajv-keywords';
import { isDev } from '@/common/env';

export type EndpointSchema = Schema & {
  $id: string;
};

const ajv = new Ajv({ allErrors: isDev });

addFormats(ajv);
addKeywords(ajv);

const registerSchema = (schema: EndpointSchema) => {
  if (!ajv.getSchema(schema.$id)) {
    ajv.addSchema(schema);
  }
};

type ValidateResult = {
  valid: boolean;
  error?: string;
};

export const validateSchema = (schema: EndpointSchema, data: any): ValidateResult => {
  registerSchema(schema);
  const valid = ajv.validate(schema, data);
  if (valid) {
    return { valid };
  }
  const error = ajv.errorsText();
  return { valid, error };
};

import { NextApiRequest, NextApiResponse } from 'next';
import { validateSchema, EndpointSchema, replyWithError } from '@/common/api';

const validate = (obj: any, res: NextApiResponse, schema: EndpointSchema): boolean => {
  const { valid, error } = validateSchema(schema, obj);
  if (valid) {
    return false;
  }
  replyWithError(res, 'INVALID_REQUEST', error);
  return true;
};

export const isNotValidRequestBody = (req: NextApiRequest, res: NextApiResponse, schema: EndpointSchema): boolean =>
  validate(req.body, res, schema);

export const isNotValidRequestQuery = (req: NextApiRequest, res: NextApiResponse, schema: EndpointSchema): boolean =>
  validate(req.query, res, schema);

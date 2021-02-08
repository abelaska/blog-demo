import { fetch, Response } from '@/common/client/common';
import { apiAuthTokenUrl } from '@/common/urls';

type LoginRequest = {
  password: string;
};

type LoginResponse = {
  access_token: string;
};

export const login = async (payload: LoginRequest): Promise<Response<LoginResponse>> =>
  fetch('POST', apiAuthTokenUrl, payload);

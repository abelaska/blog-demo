import React, { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { client, errorToMessage } from '@/browser/client';
import { PrimaryButton } from '@/components/Button';

export const Login = () => {
  const { login } = useUser();
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [submiting, setSubmiting] = useState(false);

  const handlePwdChange = (e: any) => {
    setPassword(e.target.value);
    setDisabled(!e.target.value);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (!disabled) {
      setSubmiting(true);
      try {
        const reply = await client.auth.login({ password });
        if (reply.ok) {
          login(reply.access_token);
        } else {
          setErrorMsg(errorToMessage(reply.error.code));
        }
      } finally {
        setSubmiting(false);
      }
    }
    return false;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div>
          <h2 className="mt-6 text-center text-3xl leading-9 text-gray-900">
            Login to <span className="font-bold">Blog</span> administration
          </h2>
        </div>
        <form className="mt-8" onSubmit={onSubmit}>
          <div className="rounded-md shadow-sm">
            <div className="-mt-px">
              <input
                required
                autoFocus
                data-cy="input-pwd"
                aria-label="Password"
                placeholder="Password"
                name="password"
                type="password"
                value={password}
                disabled={submiting}
                onChange={handlePwdChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
              />
            </div>
          </div>

          {errorMsg ? <p className="mt-2 text-xs text-red-500">{errorMsg}</p> : null}

          <PrimaryButton
            data-cy="btn-login"
            type="submit"
            disabled={disabled}
            progress={submiting}
            label={submiting ? 'Logging in...' : 'Log In'}
            className="w-full justify-center mt-6"
          />
        </form>
        <div className="mt-6 text-center text-gray-400 text-sm hover:underline">
          <Link href="/">
            <a>Go back</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

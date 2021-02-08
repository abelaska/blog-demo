import React, { useContext, useReducer, useEffect } from 'react';
import { useRouter } from 'next/router';
import { loadToken, saveToken } from '@/common/client/token';

interface State {
  token: string | null;
}

type UserContext = State & {
  login: (token: string) => void;
  logout: () => void;
};

type Action = { type: 'LOGOUT'; payload: void } | { type: 'LOGIN'; payload: string };

const UserContext = React.createContext<UserContext>(null);

export const useUser = (): UserContext => useContext(UserContext);

export const UserProvider = ({ children }: { children?: JSX.Element }) => {
  const router = useRouter();

  const [state, dispatch] = useReducer(
    (state: State, action: Action) => {
      switch (action.type) {
        case 'LOGOUT':
          saveToken(null);
          return { ...state, token: null };
        case 'LOGIN':
          saveToken(action.payload);
          return { ...state, token: action.payload };
        default:
          return state;
      }
    },
    { token: null },
  );

  const login = (token: string) => dispatch({ type: 'LOGIN', payload: token });

  const logout = () => dispatch({ type: 'LOGOUT', payload: null });

  useEffect(() => {
    login(loadToken());
  }, []);

  return <UserContext.Provider value={{ token: state.token, login, logout }}>{children}</UserContext.Provider>;
};

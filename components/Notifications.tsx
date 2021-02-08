import React, { useState, useContext } from 'react';
import { Transition } from '@headlessui/react';
import { IconX } from '@/components/Icons';

const notifyCloseTimeout = 3000;

export type NotificationLevel = 'info' | 'success' | 'warn' | 'error';

const colors: Record<NotificationLevel, string> = {
  info: 'blue',
  success: 'green',
  warn: 'yellow',
  error: 'red',
};

const icons: Record<NotificationLevel, JSX.Element> = {
  // Heroicon name: information-circle
  info: (
    <svg
      className="h-6 w-6"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  // Heroicon name: check-circle
  success: (
    <svg
      className="h-6 w-6"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  // Heroicon name: exclamation
  warn: (
    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  // Heroicon name: exclamation-circle
  error: (
    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

type Notification = {
  level: NotificationLevel;
  title?: string;
  message: string;
};

type Notify = (notification: Notification) => void;

type UseNotify = {
  notify: Notify;
  notifySuccess: (message?: string, title?: string) => void;
  notifyError: (message?: string, title?: string) => void;
  notifyWarn: (message?: string, title?: string) => void;
  notifyInfo: (message?: string, title?: string) => void;
};

const NotificationsContext = React.createContext<UseNotify>(null);

export const useNotify = (): UseNotify => useContext(NotificationsContext);

const Notification = ({
  onClose,
  open,
  notification,
}: {
  onClose: () => void;
  open: boolean;
  notification: Notification | null;
}) => {
  const { level, title, message } = notification || {};

  const onCloseClick = (e: any) => {
    e.preventDefault();
    onClose();
  };

  return (
    <Transition
      show={open}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      className="max-w-sm w-full"
    >
      <div
        onClick={onCloseClick}
        className={`max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden bg-${colors[level]}-50 cursor-pointer`}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className={`flex-shrink-0 text-${colors[level]}-400`}>{icons[level]}</div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              {title ? <p className="text-sm font-medium text-gray-900">{title}</p> : null}
              {message ? <p className="mt-1 text-sm text-gray-500">{message}</p> : null}
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className={`rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                <span className="sr-only">Close</span>
                <IconX className="h-5 w-5" width={2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export const NotificationsProvider = ({ children }: { children?: JSX.Element }) => {
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState<Notification>(null);

  let timer;

  const onClose = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    setOpen(false);
  };

  const notify = (notification: Notification) => {
    setNotification(notification);
    setOpen(!!notification);

    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(onClose, notifyCloseTimeout);
  };

  const notifySuccess = (message?: string, title?: string) => notify({ level: 'success', message, title });
  const notifyError = (message?: string, title?: string) => notify({ level: 'error', message, title });
  const notifyWarn = (message?: string, title?: string) => notify({ level: 'warn', message, title });
  const notifyInfo = (message?: string, title?: string) => notify({ level: 'info', message, title });

  return (
    <NotificationsContext.Provider value={{ notify, notifySuccess, notifyError, notifyWarn, notifyInfo }}>
      {children}
      <div className="fixed inset-0 flex flex-col items-end px-4 py-6 pointer-events-none sm:p-6 space-y-2 z-50">
        <Notification open={open} notification={notification} onClose={onClose} />
      </div>
    </NotificationsContext.Provider>
  );
};

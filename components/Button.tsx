import React from 'react';
import { useRouter } from 'next/router';
import { IconSpiner } from '@/components/Icons';

export type ButtonColor = 'gray' | 'red' | 'amber' | 'emerald' | 'blue' | 'indigo' | 'violet' | 'pink' | 'green';

export type ButtonProps = {
  onClick?: (e: any) => boolean | void | Promise<boolean | void>;
  disabled?: boolean;
  active?: boolean;
  progress?: boolean;
  border?: boolean;
  rounded?: boolean;
  invert?: boolean;
  roundedFull?: boolean;
  className?: string;
  color?: ButtonColor;
  leftIcon?: JSX.Element;
  label: string;
  rightIcon?: JSX.Element;
  type?: 'button' | 'submit';
  href?: string;
};

type BaseButton = Omit<ButtonProps, 'color'> & {
  className?: string;
  classColor: string;
  classColorHover: string;
  classColorActive: string;
};

const Button = ({
  href,
  disabled,
  active,
  progress,
  onClick,
  leftIcon,
  label,
  rightIcon,
  className,
  classColor,
  classColorHover,
  classColorActive,
  roundedFull,
  rounded = true,
  border = true,
  type = 'button',
  ...props
}: BaseButton) => {
  const classBase = `inline-flex items-center justify-center py-2 border border-transparent text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 select-none`;

  const router = useRouter();
  if (href) {
    onClick = (e: any) => {
      e.preventDefault();
      router.push(href);
    };
  }

  if (progress) {
    disabled = true;
    onClick = undefined;
  }
  return (
    <>
      <button
        {...props}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${classBase}
      ${border ? 'shadow-sm' : ''}
      ${rounded && !roundedFull ? 'rounded-md' : ''}
      ${roundedFull ? 'rounded-full px-2' : 'px-4'}
      ${
        disabled
          ? `opacity-50 ${classColor}`
          : `transition duration-150 ease-in-out ${active ? classColorActive : `${classColor} ${classColorHover}`}`
      } ${className}`}
      >
        {progress ? <IconSpiner className={`-ml-1 mr-2 h-5 w-5 ${classColor}`} /> : leftIcon}
        {label}
        {rightIcon}
      </button>
    </>
  );
};

export const LinkButton = ({
  color = 'blue',
  hoverColor = color,
  ...props
}: ButtonProps & { hoverColor?: ButtonColor }) => {
  const classColor = `text-${color}-500 focus:ring-${color}-400`;
  const classColorHover = `hover:text-${hoverColor || color}-600`;
  const classColorActive = `text-${color}-600`;
  return (
    <Button
      {...props}
      border={false}
      classColor={classColor}
      classColorHover={classColorHover}
      classColorActive={classColorActive}
    />
  );
};

export const PrimaryButton = ({ color = 'blue', ...props }: ButtonProps) => {
  const classColor = `text-white bg-${color}-500 focus:ring-${color}-400`;
  const classColorHover = `hover:bg-${color}-600`;
  const classColorActive = `text-white bg-${color}-600`;
  return (
    <Button {...props} classColor={classColor} classColorHover={classColorHover} classColorActive={classColorActive} />
  );
};

export const SecondaryButton = ({ color = 'blue', ...props }: ButtonProps) => {
  const classColor = `text-${color}-500 bg-${color}-100 focus:ring-${color}-400`;
  const classColorHover = `hover:bg-${color}-200`;
  const classColorActive = `text-${color}-500 bg-${color}-200`;
  return (
    <Button {...props} classColor={classColor} classColorHover={classColorHover} classColorActive={classColorActive} />
  );
};

export const WhiteButton = ({ className, ...props }: ButtonProps) => {
  const classColor = 'text-gray-700 bg-white focus:ring-blue-500';
  const classColorHover = 'hover:bg-gray-50';
  const classColorActive = 'text-gray-700 bg-gray-50';
  return (
    <Button
      {...props}
      className={`border border-gray-300 ${className}`}
      classColor={classColor}
      classColorHover={classColorHover}
      classColorActive={classColorActive}
    />
  );
};

export const IconButton = ({ className, invert, ...props }: ButtonProps) => {
  const classColor = `text-gray-700 ${invert ? 'bg-gray-50' : 'bg-white'} focus:ring-blue-500`;
  const classColorHover = `hover:${invert ? 'bg-white' : 'bg-gray-50'}`;
  const classColorActive = `text-gray-700 ${invert ? 'bg-white' : 'bg-gray-50'}`;
  return (
    <Button
      {...props}
      border={false}
      roundedFull={true}
      className={`rounded-full ${className}`}
      classColor={classColor}
      classColorHover={classColorHover}
      classColorActive={classColorActive}
    />
  );
};

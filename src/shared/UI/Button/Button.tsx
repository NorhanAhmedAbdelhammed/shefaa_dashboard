import classNames from 'classnames';
import React from 'react';
import { ReactComponent as LoadingIcon } from '@assets/icons/loading.svg';

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'warning';
  loading?: boolean;
  disable?: boolean;
  className?: string;
  [x: string]: any;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading = false,
  disable = false,
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={classNames(
        'cursor-pointer select-none whitespace-nowrap',
        'flex w-full flex-row items-center justify-center gap-3 rounded-lg px-3 py-2 disabled:cursor-default',
        {
          'border-primary bg-primary/80 text-white hover:bg-primary/90 active:bg-primary disabled:bg-gray-light-4':
            variant === 'primary',
          'border border-blue-1 bg-white text-blue-1 active:bg-gray-bright disabled:bg-gray-light-4':
            variant === 'secondary',
          'text-blue-1 underline': variant === 'tertiary',
          'bg-danger/80 text-white hover:bg-danger/90 active:bg-danger disabled:bg-gray-light-4':
            variant === 'danger',
          'bg-success/80 text-white hover:bg-success/90 active:bg-success disabled:bg-gray-light-4':
            variant === 'success',
          'bg-warning/80 text-white hover:bg-warning/90 active:bg-warning disabled:bg-gray-light-4':
            variant === 'warning',
          'pointer-events-none opacity-70': loading || disable,
        },
        className
      )}
      {...props}>
      {!!loading && (
        <span className="animate-spin">
          <LoadingIcon className={classNames({ 'stroke-blue-1': variant !== 'primary' })} />
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;

import classNames from 'classnames';
import { FC, HTMLAttributes, InputHTMLAttributes, useState } from 'react';
import { Control, FieldValues, UseFormRegisterReturn, useFormState } from 'react-hook-form';
import { HiEye, HiEyeOff } from 'react-icons/hi';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: HTMLAttributes<HTMLInputElement>['className'];
  register?: UseFormRegisterReturn;
  control: Control<FieldValues, any>;
}

// this input is designed to work with react hook form
const Input: FC<InputProps> = ({ control, label, type, register, className, ...rest }) => {
  const [showPassword, setShowPassword] = useState(false);

  const { errors } = useFormState({ control });

  const error = errors[register?.name ?? '']?.message?.toString();

  const inputClassNames: HTMLAttributes<HTMLInputElement>['className'] = classNames(
    'border-0 ring-0 focus:ring-0 outline-0 w-full p-2 h-9 text-lg',
    'read-only:bg-primary/5',
    { 'min-h-[5rem] resize-none': type === 'textarea' }
  );

  let inputElement;
  switch (type) {
    case 'password':
      inputElement = (
        <>
          <input
            type={showPassword ? 'text' : type}
            {...register}
            {...rest}
            className={inputClassNames}
          />
          <button
            type="button"
            className={classNames(
              'absolute inset-y-0 right-0 flex cursor-pointer flex-col justify-center  bg-slate-200 px-2 transition-colors duration-300 hover:bg-slate-100',
              {
                'text-primary': showPassword,
                'text-gray-900': !showPassword,
              }
            )}
            onClick={() => setShowPassword((state) => !state)}>
            {showPassword ? <HiEyeOff /> : <HiEye />}
          </button>
        </>
      );
      break;
    case 'textarea':
      inputElement = (
        <textarea
          className={inputClassNames}
          {...register}
          cols={1}
          rows={3}
          wrap=""
          {...rest}></textarea>
      );
      break;

    case 'date':
      inputElement = <input type={type} className={inputClassNames} {...register} {...rest} />;
      break;
    case 'file':
      inputElement = (
        <>
          <input
            className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
            type={type}
            {...register}
            {...rest}
          />
        </>
      );
      break;

    default:
      inputElement = <input type={type} className={inputClassNames} {...register} {...rest} />;
  }

  return (
    <div className={classNames(className, 'w-full')}>
      {label && <label className="mb-2 block capitalize">{label}</label>}
      <div
        className={classNames(
          'relative w-full overflow-hidden rounded-md ring-2 ring-gray-300 focus-within:ring-blue-500',
          {
            'ring-danger/75 [&>*]:!text-danger/70': !!error,
          }
        )}>
        {inputElement}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;

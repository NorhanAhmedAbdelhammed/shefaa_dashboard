import * as Yup from 'yup';

export const $email = Yup.string().email('Invalid email format').required('Email is required');
export const $password = Yup.string()
  .min(8, 'Password must be at least 8 characters')
  .required('Password is required');
export const $date = Yup.date().required().typeError('Please select a valid date');

export const createFormFields: IFormField[] = [
  {
    name: 'email',
    title: 'Enter email',
    placeholder: 'pharmacy@domain.com',
    autoComplete: 'off',
  },
  {
    name: 'password',
    title: 'Enter password',
    placeholder: 'Enter password',
    type: 'password',
    autoComplete: 'new-password',
  },
  {
    name: 'username',
    title: 'Enter username',
    placeholder: 'Pharmacy username',
    autoComplete: 'off',
  },
  {
    name: 'nameEn',
    title: 'Enter name in English',
    placeholder: 'Pharmacy',
    wrapperClassName: 'col-start-1',
    autoComplete: 'off',
  },
  {
    name: 'nameAr',
    title: 'Enter name in Arabic',
    placeholder: 'اسم الصيدلية',
    autoComplete: 'off',
  },
  { name: 'startOfContract', title: 'Contract start date', placeholder: '', type: 'date' },
  { name: 'endOfContract', title: 'Contract end date', placeholder: '', type: 'date' },
];

export const editFormFields: IFormField[] = [
  { name: 'email', title: 'Enter the new email', placeholder: 'pharmacy@domain.com' },
  {
    name: 'nameEn',
    title: 'Enter the new English name',
    placeholder: 'Pharmacy',
  },
  {
    name: 'nameAr',
    title: 'Enter the new Arabic name',
    placeholder: 'اسم الصيدلية',
  },
  {
    name: 'reason',
    title: 'Enter reasons for this action',
    placeholder: 'Reasons for editing the pharamcy details',
    type: 'textarea',
  },
  {
    name: 'password',
    title: 'Enter your password to proceed',
    placeholder: 'Enter password',
    autoComplete: 'off',
    type: 'password',
  },
];

export const renewContractFormFields: IFormField[] = [
  { name: 'startOfContract', title: 'Contract start date', placeholder: '', type: 'date' },
  { name: 'endOfContract', title: 'Contract end date', placeholder: '', type: 'date' },
  {
    name: 'reason',
    title: 'Enter reasons for this action',
    placeholder: 'Reasons / Notes',
    type: 'textarea',
  },
  {
    name: 'password',
    title: 'Enter password',
    placeholder: 'Enter password',
    autoComplete: 'new-password',
    type: 'password',
  },
];

export const suspendFormFields: IFormField[] = [
  {
    name: 'reason',
    title: 'Enter reasons for this action',
    placeholder: 'Reasons for suspending the pharamcy',
    type: 'textarea',
    wrapperClassName: 'col-span-2',
  },

  {
    name: 'password',
    title: 'Enter password',
    placeholder: 'Enter password',
    type: 'password',
    autoComplete: 'new-password',
    wrapperClassName: 'col-span-2',
  },
];

export const resetLocationFormFields: IFormField[] = [
  {
    name: 'reason',
    title: 'Enter reasons for this action',
    placeholder: 'Reasons',
    type: 'textarea',
    wrapperClassName: 'col-span-2',
  },
  {
    name: 'password',
    title: 'Enter password',
    placeholder: 'Enter password',
    type: 'password',
    autoComplete: 'new-password',
    wrapperClassName: 'col-span-2',
  },
];

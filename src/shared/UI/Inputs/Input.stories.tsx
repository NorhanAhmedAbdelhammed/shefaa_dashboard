import type { Meta, Story } from '@storybook/react';
import { useForm } from 'react-hook-form';
import Input, { InputProps } from './Input';

const meta: Meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'radio', options: ['text', 'password'] },
  },
  decorators: [
    (Story) => {
      return (
        <div className="m-12 mx-auto max-w-[20rem]">
          <Story />
        </div>
      );
    },
  ],
};
const Template: Story<Omit<InputProps, 'control'>> = ({ type, label, placeholder, ...args }) => {
  const { control } = useForm({ mode: 'onBlur' });

  return (
    <Input
      name="input"
      label={label}
      placeholder={placeholder}
      type={type}
      control={control} // Pass `control` as a prop to the `Input` component
      {...args}
    />
  );
};
export const Text = Template.bind({});
Text.args = {
  type: 'text',
  label: 'Text Input',
  placeholder: 'Enter text',
};

export const Password = Template.bind({});
Password.args = {
  type: 'password',
  label: 'Password Input',
  placeholder: 'Enter password',
};

export default meta;

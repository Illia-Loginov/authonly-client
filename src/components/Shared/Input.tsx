import { ComponentPropsWithoutRef } from 'react';

const Input = (props: ComponentPropsWithoutRef<'input'>) => {
  return (
    <input
      {...props}
      className={`bg-green-200 py-1 px-2 outline-none ${props.className || ''}`}
    />
  );
};

export default Input;

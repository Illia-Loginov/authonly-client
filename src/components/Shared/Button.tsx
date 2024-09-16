import { MouseEvent } from 'react';

interface ButtonProps {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  children?: string;
  className?: string;
  disabled?: boolean;
}

const Button = ({
  onClick,
  children: text,
  className: externalStyles,
  disabled
}: ButtonProps) => {
  return (
    <button
      className={`bg-green-300 py-1 px-2 uppercase ${
        disabled
          ? 'text-green-500 cursor-not-allowed'
          : 'hover:bg-green-700 hover:text-green-200'
      } ${externalStyles || ''}`}
      onClick={onClick}
      {...{ disabled }}
    >
      {text}
    </button>
  );
};

export default Button;

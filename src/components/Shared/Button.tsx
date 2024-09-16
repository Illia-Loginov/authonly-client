import { MouseEvent } from 'react';

interface ButtonProps {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  children?: string;
  className?: string;
}

const Button = ({
  onClick,
  children: text,
  className: externalStyles
}: ButtonProps) => {
  return (
    <button
      className={`bg-green-300 py-1 px-2 uppercase hover:bg-green-700 hover:text-green-200 ${externalStyles}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;

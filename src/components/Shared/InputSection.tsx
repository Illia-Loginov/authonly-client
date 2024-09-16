import { ComponentPropsWithoutRef } from 'react';
import Input from './Input';

type InputSectionProps = ComponentPropsWithoutRef<'input'> & {
  label: string;
  issue?: string;
};

const InputSection = ({ label, issue, ...inputProps }: InputSectionProps) => {
  return (
    <div>
      <div className="flex flex-row justify-between items-center gap-4">
        <label htmlFor={inputProps.id}>{label}</label>
        <Input className="w-60" {...inputProps} />
      </div>
      {issue && <p className="text-green-600 text-sm">{issue}</p>}
    </div>
  );
};

export default InputSection;

import { ChangeEvent, FormEvent } from 'react';
import { Input } from '@/components/forms';
import { Spinner } from '@/components/common';

interface Config {
  labelText: string;
  labelId: string;
  type: string;
  placeholder?: string;
  value: string;
  link?: {
    linkText: string;
    linkUrl: string;
  }
  required?: boolean;
};

interface Props {
  config: Config[];
  isLoading: boolean;
  btnText: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function Form({ 
  config,
  isLoading, 
  btnText, 
  onChange, 
  onSubmit
}: Props) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {config.map(input => (
        <Input
          key={input.labelId}
          labelId={input.labelId}
          type={input.type}
          placeholder={input.placeholder}
          onChange={onChange}
          value={input.value}
          link={input.link}
          required={input.required}
        >
          {input.labelText}
        </Input>
      ))}
      <div>
        <button
          type="submit"
          className="flex w-full mt-8 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
          disabled={isLoading}
        >
          { isLoading ? <Spinner sm /> : `${btnText}`}
        </button>
      </div>
    </form>
  );
}
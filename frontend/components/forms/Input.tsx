import { ChangeEvent } from "react";
import Link from "next/link";

interface Props {
  labelId: string;
  type: string;
  placeholder?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  children: React.ReactNode;
  link?: {
    linkText: string;
    linkUrl: string;
  },
  required?: boolean;
}


export default function Input({ 
  labelId, 
  type, 
  placeholder = '',
  onChange,
  value,
  children,
  link,
  required = false,
}: Props) {
  
  return (
    <div>
      <div className="flex justify-between align-center">
        <label 
          htmlFor={labelId}
          className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
          >
          {children}
        </label>
        {link && (
          <div className="text-sm">
            <Link 
              className='font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'
              href={link.linkUrl}
              >
              {link.linkText}
            </Link>
          </div>
        )}
      </div>
      <div className="mt-0">
        <input
          key={labelId}
          id={labelId}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-2 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"                  
          name={labelId}
          placeholder={placeholder}
          type={type}
          onChange={onChange}
          value={value}
          required={required}
          />
      </div>
    </div>
  )
}


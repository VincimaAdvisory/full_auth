import { Spinner } from '@/components/common';

interface Config {
  label: string;
  value: string | undefined;
}

interface ListProps {
  items: Config[];
}

export default function List({ items }: ListProps) {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {items.map((item, index) => (
        <li 
          key={index}
          className="flex justify-between gap-x-6 py-5"
        >
          <div>
            <p className='text-sm font-semibold leading-6 text-gray-900'>
              {item.label}
            </p>
          </div>
          <div>
            <p className='text-sm leading-6 text-gray-700'>
              {item.value || <Spinner sm />}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
import React from 'react';
import { useRouter } from 'next/router';
import { Menu } from '@headlessui/react';

export type MenuItemProps = {
  label: string;
  href?: string;
  selected: boolean;
};

export const MenuItem = ({ label, href, selected = false }: MenuItemProps) => {
  const router = useRouter();
  return (
    <Menu.Item>
      {({ active }) => (
        <div
          onClick={() => router.push(href)}
          className={`${selected ? 'font-semibold text-gray-900' : ''} ${
            active ? 'bg-gray-100 text-gray-900' : 'text-gray-600'
          }
            flex justify-between w-full px-4 py-2 text-sm leading-5 text-left cursor-pointer`}
        >
          {label}
        </div>
      )}
    </Menu.Item>
  );
};

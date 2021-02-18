import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { IconSelector } from '@/components/Icons';
import { MenuItem, MenuItemProps } from './MenuItem';

export const MenuFilter = ({ menu }: { menu: Array<Array<MenuItemProps>> }) => {
  const title = menu.reduce((r, v) => r.concat(v), []).find((i) => i.selected)?.label;
  return (
    <span className="block relative">
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button
              as="div"
              className="no-button -ml-px relative group block border-none focus:outline-none"
              aria-label="User menu"
              aria-haspopup="true"
            >
              <div className="text-gray-600 flex items-center cursor-pointer">
                <div>{title}</div>
                <IconSelector className="ml-0.5 -mb-0.5 w-4 h-4 text-gray-500" width={2} />
              </div>
            </Menu.Button>
            <Transition
              show={open}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute z-30 left-0 w-56 mt-1 origin-top-right bg-white border border-gray-100 rounded-md shadow-lg outline-none divide-y divide-gray-100"
              >
                {menu.map((g, gi) => (
                  <div className="py-1" key={`menu-group-${gi}`}>
                    {g.map((i, ii) => (
                      <MenuItem {...i} key={`menu-group-${gi}-${ii}`} />
                    ))}
                  </div>
                ))}
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </span>
  );
};

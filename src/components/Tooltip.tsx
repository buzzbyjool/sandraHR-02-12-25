import React, { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

export function Tooltip({ children, content }: TooltipProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <Transition
        as={Fragment}
        show={isHovered}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded-md 
          transition-opacity duration-300
          bottom-full left-1/2 transform -translate-x-1/2 mb-1 whitespace-nowrap">
          {content}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 
            border-4 border-transparent border-t-gray-900" />
        </div>
      </Transition>
    </div>
  );
}
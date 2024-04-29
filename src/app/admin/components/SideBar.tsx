"use client";

import Link from 'next/link';
import HomeIcon from '@/app/assets/HomeIcon';
import SubjectIcon from '@/app/assets/SubjectIcon';
import PackageIcon from '@/app/assets/PackageIcon';
import LineChartIcon from '@/app/assets/LineChartIcon';

type AdminSideBarProps = {
  activePage: string,
  setActivePage: (pageName: string) => void;
}

export default function AdminSideBar({activePage, setActivePage}: AdminSideBarProps) {
  
  const handleSetActivePage = (pageName: string) => {
    setActivePage(pageName);
  };

  return (
    <div className="flex">
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          <Link
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
              activePage === 'home'
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
                : 'text-gray-500 dark:text-gray-400'
            } transition-all hover:text-gray-900 dark:hover:text-gray-50`}
            href="#"
            onClick={() => handleSetActivePage('home')}
          >
            <HomeIcon className="h-4 w-4" />
            Preview
          </Link>
          <Link
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
              activePage === 'forms'
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
                : 'text-gray-500 dark:text-gray-400'
            } transition-all hover:text-gray-900 dark:hover:text-gray-50`}
            href="#"
            onClick={() => handleSetActivePage('forms')}
          >
            <PackageIcon className="h-4 w-4" />
            Directory
          </Link>
        </nav>
      </div>
    </div>
  );
};

'use client';
import { useState } from 'react'; // Import useState to manage dropdown visibility
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({}); // Object to track the visibility of each dropdown

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label], // Toggle the specific dropdown's visibility
    }));
  };

  return (
    <section className="sticky top-0 left-0 flex h-screen flex-col justify-between bg-gradient-to-b from-purple-700 via-indigo-600 to-blue-700 p-6 pt-28 text-white max-sm:hidden lg:w-[264px] shadow-lg">
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);

          return item.dropdown ? (
            <div key={item.label} className="mt-auto">
              {/* Dropdown Button */}
              <button
                onClick={() => toggleDropdown(item.label)} // Toggle dropdown visibility based on its label
                className="flex items-center justify-between w-full p-4 mt-6 bg-blue-800 rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out"
              >
                <span className="text-lg font-semibold">{item.label}</span>
                <span className={`transform transition-transform ${openDropdowns[item.label] ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {/* Dropdown Content */}
              {openDropdowns[item.label] && (
                <div className="mt-2 space-y-2 bg-blue-900 p-4 rounded-lg">
                  {item.teamMembers.map((member) => (
                    <a
                      key={member.name}
                      href={member.linkedinURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-2 hover:bg-blue-700 rounded-lg transition-all duration-300"
                    >
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <p className="text-lg">{member.name}</p>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              href={item.route}
              key={item.label}
              className={cn(
                'flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-500 hover:scale-105',
                {
                  'bg-blue-800': pathname === item.route || pathname.startsWith(`${item.route}/`),
                }
              )}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={24}
                height={24}
              />
              <p className="text-lg font-semibold">{item.label}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar;

import Image from 'next/image';
import Link from 'next/link';
import { SignedIn, UserButton } from '@clerk/nextjs';

import MobileNav from './MobileNav';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center fixed top-0 z-50 w-full px-6 py-4 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 shadow-lg">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/icons/logo.svg"
          width={32}
          height={32}
          alt="yoom logo"
          className="transition-transform transform hover:scale-110"
        />
        <p className="text-[28px] font-extrabold text-white hidden sm:block">
          SpeakFlow
        </p>
      </Link>

      <div className="flex items-center gap-6">
        <SignedIn>
          <UserButton afterSignOutUrl="/sign-in" />
        </SignedIn>

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;

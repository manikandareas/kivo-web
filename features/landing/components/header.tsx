import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <header className="w-full">
      <div className="mx-auto p-6 w-full flex items-center justify-between">
        <Link href={'/'}>
          <Image src={'/logo.svg'} width={100} height={40} alt="Kivo" />
        </Link>
        <UserButton />
      </div>
    </header>
  );
}

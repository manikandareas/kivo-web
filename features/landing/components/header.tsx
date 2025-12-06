import { buttonVariants } from '@/features/shared';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full">
      <div className="mx-auto container py-6 w-full flex items-center justify-between">
        <Link href={'/'}>
          <Image src={'/logo.svg'} width={100} height={40} alt="Kivo" />
        </Link>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Link
            href={'/sign-in'}
            className={buttonVariants({
              className: 'w-fit',
              size: 'sm',
              variant: 'ghost',
            })}
          >
            Masuk / Daftar <LogIn />
          </Link>
        </SignedOut>
      </div>
    </header>
  );
}

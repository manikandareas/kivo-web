import { buttonVariants } from '@/features/shared';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full shrink-0">
      <div className="container mx-auto flex w-full items-center justify-between px-3 py-3 md:px-4 md:py-6">
        <Link href={'/'}>
          <Image
            src={'/logo.svg'}
            width={100}
            height={40}
            alt="Kivo"
            className="h-8 w-auto md:h-10"
          />
        </Link>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Link
            href={'/sign-in'}
            className={buttonVariants({
              className: 'w-fit text-xs md:text-sm',
              size: 'sm',
              variant: 'ghost',
            })}
          >
            Masuk / Daftar <LogIn className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Link>
        </SignedOut>
      </div>
    </header>
  );
}

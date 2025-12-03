import Image from 'next/image';

export function Header() {
  return (
    <header className="w-full">
      <div className="mx-auto p-6 w-full">
        <Image src={'/logo.svg'} width={100} height={40} alt="Kivo" />
      </div>
    </header>
  );
}

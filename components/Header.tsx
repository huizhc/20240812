
import Image from "next/image";

export default function Header () {
  return (
    <header>
      <div className="leftBox">
        <Image src="/logo.svg" alt="logo" width={32} height={18} priority />
        PDF.ai
      </div>
      <div className="rightBox">
        <a className="hover:underline">Pricing</a>
        <a className="hover:underline">Chrome extension</a>
        <a className="hover:underline">Use cases</a>
        <a className="hover:underline">Get started →</a>
      </div>
    </header>
  );
};

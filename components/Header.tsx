"use client";

import Image from "next/image";
import HamburgerSvg from "../public/Hamburger.svg";
import CloseSvg from "../public/close.svg";
import { useState } from "react";

export default function Header() {
  const [visibled, setVisibled] = useState(false);

  const handleVisible = () => {
    setVisibled(!visibled);
  };

  return (
    <header>
      <div className="leftBox">
        <Image src="/logo.svg" alt="logo" width={32} height={18} priority />
        PDF.ai
      </div>
      <div className="rightBox hide-mobile">
        <a className="hover:underline" href="/pricing">
          Pricing
        </a>
        <a className="hover:underline" href="/chrome-extension">
          Chrome extension
        </a>
        <a className="hover:underline" href="/use-cases">
          Use cases
        </a>
        <a className="hover:underline" href="/auth/sign-in">
          Get started →
        </a>
      </div>
      <button className="ml-auto p-2.5 hide-desktop" onClick={handleVisible}>
        {visibled ? (
          <CloseSvg width={20} height={20} />
        ) : (
          <HamburgerSvg width={20} height={20} />
        )}
      </button>
      {visibled && (
        <div className="foldBox hide-desktop">
          <a href="/pricing">Pricing</a>
          <a href="/chrome-extension">Chrome extension</a>
          <a href="/use-cases">Use cases</a>
          <a href="/auth/sign-in">Get started →</a>
        </div>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface HeaderProps {
  propertyName: string;
  logo: string | null;
}

export default function Header({ propertyName, logo }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Property Name */}
          <Link href="#top" className="flex items-center">
            {logo ? (
              <Image
                src={logo}
                alt={propertyName}
                width={120}
                height={48}
                className="h-12 w-auto object-contain"
              />
            ) : (
              <span className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
                {propertyName}
              </span>
            )}
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#about"
              className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors tracking-wide uppercase"
            >
              About
            </Link>
            <Link
              href="#amenities"
              className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors tracking-wide uppercase"
            >
              Amenities
            </Link>
            <Link
              href="#accommodation"
              className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors tracking-wide uppercase"
            >
              Rooms
            </Link>
            <Link
              href="#gallery"
              className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors tracking-wide uppercase"
            >
              Gallery
            </Link>
            <Link
              href="#booking"
              className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors tracking-wide uppercase"
            >
              Book Now
            </Link>
            <Link
              href="#contact"
              className="px-6 py-2 bg-stone-900 text-white text-sm font-medium rounded-none hover:bg-stone-800 transition-colors tracking-wide uppercase"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-stone-600 hover:text-stone-900"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav
          className={`${mobileMenuOpen ? "block" : "hidden"} md:hidden pb-4 border-t border-stone-200 mt-2`}
        >
          <div className="flex flex-col gap-3 pt-4">
            <Link
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors tracking-wide uppercase py-2"
            >
              About
            </Link>
            <Link
              href="#amenities"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors tracking-wide uppercase py-2"
            >
              Amenities
            </Link>
            <Link
              href="#accommodation"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors tracking-wide uppercase py-2"
            >
              Rooms
            </Link>
            <Link
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors tracking-wide uppercase py-2"
            >
              Gallery
            </Link>
            <Link
              href="#booking"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors tracking-wide uppercase py-2"
            >
              Book Now
            </Link>
            <Link
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-6 py-3 bg-stone-900 text-white text-sm font-medium rounded-none hover:bg-stone-800 transition-colors tracking-wide uppercase text-center"
            >
              Contact
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

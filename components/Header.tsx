"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-lg">
          Test HEXACOMM
        </Link>

        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/"
                className={`hover:text-foreground/80 ${
                  pathname === "/"
                    ? "font-medium text-foreground"
                    : "text-foreground/60"
                }`}
              >
                Accueil
              </Link>
            </li>
            <li>
              <Link
                href="/quiz"
                className={`hover:text-foreground/80 ${
                  pathname === "/quiz"
                    ? "font-medium text-foreground"
                    : "text-foreground/60"
                }`}
              >
                Test
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

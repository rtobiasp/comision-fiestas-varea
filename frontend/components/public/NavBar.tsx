"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, Search, X } from "lucide-react";

type SubItem = {
  label: string;
  href: string;
};

type NavItem = {
  label: string;
  href: string;
  children?: SubItem[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Inicio", href: "/" },
  {
    label: "Varea",
    href: "/varea",
    children: [
      { label: "Historia del barrio", href: "/varea/historia" },
      { label: "La comisión", href: "/varea/comision" },
      { label: "Cómo llegar", href: "/varea/como-llegar" },
    ],
  },
  {
    label: "Fiestas",
    href: "/fiestas",
    children: [
      { label: "Programa", href: "/programa" },
      { label: "Eventos", href: "/eventos" },
    ],
  },
  { label: "Noticias", href: "/noticias" },
  { label: "Avisos", href: "/avisos" },
  { label: "Hazte socio", href: "/hazte-socio" },
];

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M13.5 21v-7h2.6l.4-3h-3V9.1c0-.9.3-1.5 1.6-1.5h1.5V4.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4V11H8v3h2.4v7h3.1Z" />
    </svg>
  );
}

function XSocialIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.8 4h2.7l-6 6.8L21.5 20h-5.6l-4.3-5.6L6.6 20H3.9l6.4-7.3L3.5 4H9l3.9 5.1L17.8 4Zm-1 14.3h1.5L8.1 5.6H6.5l10.3 12.7Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-varea-primary text-varea-text-on-dark shadow-md">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-center py-4 sm:py-5">
          <Link
            href="/"
            className="rounded-sm text-center font-heading text-3xl font-black lowercase leading-none tracking-tighter focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-varea-focus sm:text-4xl lg:text-5xl"
          >
            comisionfiestasvarea
          </Link>
        </div>
      </div>

      <div>
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            className="rounded-sm p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-varea-focus lg:hidden"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <nav aria-label="Navegación principal" className="hidden lg:block">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 xl:gap-x-6">
              {NAV_ITEMS.map((item) => (
                <li key={item.label} className="group relative">
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 whitespace-nowrap py-3 text-[13px] font-semibold uppercase tracking-wide underline-offset-8 hover:underline hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-varea-focus"
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown size={12} aria-hidden="true" />
                    )}
                  </Link>
                  {item.children && (
                    <ul className="invisible absolute left-0 top-full z-50 min-w-52 rounded-b-lg border border-varea-border bg-varea-surface py-2 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            href={child.href}
                            className="block whitespace-nowrap px-4 py-2 text-left text-[13px] font-medium normal-case tracking-normal text-varea-text-main hover:bg-varea-bg-alt hover:text-varea-primary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-varea-focus"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-expanded={searchOpen}
              aria-label="Buscar"
              className="rounded-sm p-2.5 hover:bg-varea-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-varea-focus"
            >
              <Search size={20} />
            </button>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="rounded-sm p-2.5 hover:bg-varea-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-varea-focus"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              className="rounded-sm p-2.5 hover:bg-varea-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-varea-focus"
            >
              <XSocialIcon className="h-4 w-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="rounded-sm p-2.5 hover:bg-varea-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-varea-focus"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        {searchOpen && (
          <div>
            <form
              role="search"
              action="/buscar"
              method="get"
              className="mx-auto flex w-full max-w-7xl items-center gap-2 px-4 py-2.5 sm:px-6"
            >
              <Search size={18} aria-hidden="true" className="shrink-0" />
              <input
                type="search"
                name="q"
                placeholder="Buscar en la web…"
                autoFocus
                className="w-full rounded-md border border-white/25 bg-white/10 px-3 py-1.5 text-sm text-varea-text-on-dark placeholder:text-white/60 focus:border-white focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-md bg-varea-surface px-3 py-1.5 text-sm font-semibold text-varea-primary hover:bg-varea-bg-alt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-varea-focus"
              >
                Buscar
              </button>
            </form>
          </div>
        )}

        {mobileOpen && (
          <nav
            aria-label="Navegación móvil"
            className="border-t border-white/15 lg:hidden"
          >
            <ul className="mx-auto max-h-[70vh] w-full max-w-7xl overflow-y-auto px-4 py-2 sm:px-6">
              {NAV_ITEMS.map((item) => (
                <li
                  key={item.label}
                  className="border-b border-white/10 last:border-0"
                >
                  {item.children ? (
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenSection(
                            openSection === item.label ? null : item.label,
                          )
                        }
                        aria-expanded={openSection === item.label}
                        className="flex w-full items-center justify-between py-3 text-left text-sm font-semibold uppercase tracking-wide focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-varea-focus"
                      >
                        {item.label}
                        <ChevronDown
                          size={16}
                          aria-hidden="true"
                          className={
                            openSection === item.label
                              ? "rotate-180 transition-transform"
                              : "transition-transform"
                          }
                        />
                      </button>
                      {openSection === item.label && (
                        <ul className="pb-3 pl-3">
                          <li>
                            <Link
                              href={item.href}
                              className="block py-2 text-sm text-white/80 hover:underline hover:underline-offset-4"
                            >
                              Ver todo
                            </Link>
                          </li>
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <Link
                                href={child.href}
                                className="block py-2 text-sm text-white/80 hover:underline hover:underline-offset-4"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="block py-3 text-sm font-semibold uppercase tracking-wide focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-varea-focus"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}

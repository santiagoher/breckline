"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";

import { ChevronIcon, CloseIcon, iconComponents, MenuIcon } from "@/components/icons";
import { navigationGroups, navigationLinks } from "@/data/site";

function NavDropdown({ children }: { children: ReactNode }) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const dropdown = dropdownRef.current;
    if (!dropdown) return;

    const keepWithinViewport = () => {
      dropdown.style.marginLeft = "0px";
      const bounds = dropdown.getBoundingClientRect();
      const rightEdge = document.documentElement.clientWidth - 16;
      const offset = Math.max(16 - bounds.left, Math.min(0, rightEdge - bounds.right));
      dropdown.style.marginLeft = `${offset}px`;
    };

    keepWithinViewport();
    window.addEventListener("resize", keepWithinViewport);
    return () => window.removeEventListener("resize", keepWithinViewport);
  }, []);

  return (
    <div
      className="absolute left-1/2 top-full w-[min(42rem,calc(100vw-2rem))] -translate-x-1/2 pt-3"
      ref={dropdownRef}
    >
      {children}
    </div>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>("web");
  const [desktopGroup, setDesktopGroup] = useState<string | null>(null);
  const desktopCloseTimer = useRef<number | null>(null);

  const cancelDesktopClose = () => {
    if (desktopCloseTimer.current !== null) {
      window.clearTimeout(desktopCloseTimer.current);
      desktopCloseTimer.current = null;
    }
  };

  const openDesktopGroup = (groupId: string) => {
    cancelDesktopClose();
    setDesktopGroup(groupId);
  };

  const scheduleDesktopClose = () => {
    cancelDesktopClose();
    desktopCloseTimer.current = window.setTimeout(() => {
      setDesktopGroup(null);
      desktopCloseTimer.current = null;
    }, 180);
  };

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setDesktopGroup(null);
      }
    };

    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileOpen(false);
    };

    const desktopQuery = window.matchMedia("(min-width: 1200px)");
    const previousOverflow = document.body.style.overflow;

    if (mobileOpen) document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    desktopQuery.addEventListener("change", closeAtDesktop);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
      desktopQuery.removeEventListener("change", closeAtDesktop);
    };
  }, [mobileOpen]);

  useEffect(
    () => () => {
      if (desktopCloseTimer.current !== null) {
        window.clearTimeout(desktopCloseTimer.current);
      }
    },
    [],
  );

  const closeNavigation = () => {
    cancelDesktopClose();
    setMobileOpen(false);
    setDesktopGroup(null);
  };

  return (
    <>
      <a
        className="focus-ring fixed left-4 top-3 z-[100] -translate-y-24 rounded-xl bg-white px-4 py-2 font-bold text-[#080811] shadow-xl transition focus:translate-y-0"
        href="#contenido"
      >
        Ir al contenido
      </a>

      <header className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:sticky lg:bottom-auto lg:top-0 lg:px-4 lg:pb-0 lg:pt-4">
        <div className="relative z-10 mx-auto max-w-sm lg:max-w-7xl">
          <div className="glass-panel pointer-events-auto flex min-h-16 items-center justify-between gap-3 rounded-[1.4rem] border border-white/10 bg-[#0d0d1a]/85 px-3 py-2 shadow-[0_18px_60px_rgba(0,0,0,0.42)] backdrop-blur-2xl lg:min-h-[4.5rem] lg:rounded-2xl lg:px-4">
            <Link
              aria-label="Breckline, inicio"
              className="focus-ring shrink-0 rounded-lg px-1 py-2"
              href="/"
              onClick={closeNavigation}
            >
              <Image
                alt="Breckline"
                className="h-auto w-32 brightness-0 invert sm:w-36 lg:w-32 xl:w-36"
                height={64}
                loading="eager"
                src="/assets/logos/Breckline%20logo.svg"
                unoptimized
                width={190}
              />
            </Link>

            <nav aria-label="Navegación principal" className="hidden items-center justify-end gap-0.5 min-[1200px]:flex xl:gap-1">
              {navigationGroups.map((group) => {
                const available = group.availability === "available";
                const open = desktopGroup === group.id;
                const triggerId = `desktop-group-trigger-${group.id}`;
                const menuId = `desktop-group-${group.id}`;

                return (
                  <div
                    className="relative"
                    key={group.id}
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) {
                        cancelDesktopClose();
                        setDesktopGroup(null);
                      }
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Escape" && open) {
                        event.stopPropagation();
                        setDesktopGroup(null);
                        document.getElementById(triggerId)?.focus();
                      }
                    }}
                    onMouseEnter={() => available && openDesktopGroup(group.id)}
                    onMouseLeave={scheduleDesktopClose}
                  >
                    <button
                      aria-controls={available ? menuId : undefined}
                      aria-expanded={available ? open : undefined}
                      className={`focus-ring flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-2 text-xs font-semibold transition xl:px-3 xl:text-sm ${
                        available
                          ? `text-violet-100 hover:bg-white/10 hover:text-white ${open ? "bg-white/10" : ""}`
                          : "cursor-not-allowed text-violet-200/45"
                      }`}
                      disabled={!available}
                      id={triggerId}
                      onClick={() => available && setDesktopGroup(open ? null : group.id)}
                      onKeyDown={(event) => {
                        if (available && event.key === "ArrowDown") {
                          event.preventDefault();
                          setDesktopGroup(group.id);
                          window.requestAnimationFrame(() => {
                            document.querySelector<HTMLAnchorElement>(`#${menuId} a`)?.focus();
                          });
                        }
                      }}
                      type="button"
                    >
                      {group.label}
                      {group.badge ? (
                        <span className="rounded-full border border-violet-300/20 bg-violet-400/10 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-violet-200">
                          {group.badge}
                        </span>
                      ) : null}
                      {available ? (
                        <ChevronIcon
                          className={`size-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                        />
                      ) : null}
                    </button>

                    {available && open ? (
                      <NavDropdown>
                        <div
                          aria-labelledby={triggerId}
                          className="glass-panel hero-reveal rounded-2xl border border-violet-300/15 bg-[#101020]/95 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl motion-reduce:animate-none"
                          id={menuId}
                          style={{
                            background:
                              "linear-gradient(145deg, rgb(20 18 38 / 98%), rgb(10 9 24 / 98%))",
                          }}
                        >
                          <div className="px-2 pb-3 pt-1">
                            <p className="font-display text-lg font-bold text-white">{group.heading}</p>
                            <p className="text-lavender mt-1 max-w-xl text-xs leading-5">
                              {group.description}
                            </p>
                          </div>
                          <ul className="grid grid-cols-2 gap-1.5">
                            {group.items.map((item) => {
                              const Icon = iconComponents[item.icon];

                              return item.href ? (
                                <li key={item.id}>
                                  <Link
                                    className="focus-ring group flex h-full min-h-24 items-start gap-3 rounded-xl border border-transparent p-3 transition duration-300 hover:border-violet-300/15 hover:bg-violet-400/[0.08] focus-visible:border-violet-300/25 focus-visible:bg-violet-400/10"
                                    href={item.href}
                                    onClick={closeNavigation}
                                  >
                                    <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-violet-300/15 bg-violet-400/10 text-violet-200 transition duration-300 group-hover:border-violet-300/30 group-hover:bg-violet-400/20 group-hover:text-white">
                                      <Icon className="size-[1.125rem]" />
                                    </span>
                                    <span className="min-w-0">
                                      <span className="block text-sm font-bold leading-5 text-white">
                                        {item.label}
                                      </span>
                                      <span className="text-lavender mt-1 block text-xs leading-[1.125rem]">
                                        {item.description}
                                      </span>
                                    </span>
                                  </Link>
                                </li>
                              ) : null;
                            })}
                          </ul>
                        </div>
                      </NavDropdown>
                    ) : null}
                  </div>
                );
              })}

              {navigationLinks.map((link) => (
                <Link
                  className="focus-ring ml-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-3 text-xs font-bold text-white shadow-[0_10px_28px_rgba(109,40,217,0.28)] transition duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-400 xl:px-5 xl:text-sm"
                  href={link.href}
                  key={link.href}
                  onClick={closeNavigation}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <button
              aria-controls="mobile-navigation"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              className="focus-ring flex min-h-11 items-center gap-2 rounded-xl border border-violet-300/20 bg-violet-400/10 px-3 text-sm font-bold text-violet-100 transition hover:border-violet-300/40 hover:bg-violet-400/20 hover:text-white min-[1200px]:hidden"
              onClick={() => setMobileOpen((value) => !value)}
              type="button"
            >
              {mobileOpen ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
              <span>{mobileOpen ? "Cerrar" : "Menú"}</span>
            </button>
          </div>

          {mobileOpen ? (
            <nav
              aria-label="Navegación móvil"
              className="glass-panel hero-reveal pointer-events-auto absolute inset-x-0 bottom-[calc(100%+0.75rem)] max-h-[calc(100dvh-6.75rem)] origin-bottom overflow-y-auto overscroll-contain rounded-[1.4rem] border border-violet-300/15 bg-[#0d0d1a]/95 p-3 shadow-[0_-24px_80px_rgba(0,0,0,0.58)] backdrop-blur-2xl motion-reduce:animate-none lg:bottom-auto lg:top-[calc(100%+0.75rem)] lg:origin-top min-[1200px]:hidden"
              id="mobile-navigation"
            >
              <div className="space-y-2">
                {navigationGroups.map((group) => {
                  const available = group.availability === "available";
                  const open = mobileGroup === group.id;
                  const panelId = `mobile-group-${group.id}`;

                  return (
                    <div
                      className="overflow-hidden rounded-2xl border border-violet-300/10 bg-white/[0.035]"
                      key={group.id}
                    >
                      <button
                        aria-controls={available ? panelId : undefined}
                        aria-expanded={available ? open : undefined}
                        className={`focus-ring flex w-full items-center justify-between gap-3 p-4 text-left font-bold ${
                          available ? "text-white" : "cursor-not-allowed text-violet-200/45"
                        }`}
                        disabled={!available}
                        onClick={() => available && setMobileGroup(open ? null : group.id)}
                        type="button"
                      >
                        <span>{group.label}</span>
                        {group.badge ? (
                          <span className="ml-auto rounded-full border border-violet-300/15 bg-violet-400/10 px-2 py-1 text-[10px] uppercase tracking-wide text-violet-200">
                            {group.badge}
                          </span>
                        ) : null}
                        {available ? (
                          <ChevronIcon
                            className={`size-5 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                          />
                        ) : null}
                      </button>

                      {available && open ? (
                        <div className="border-t border-violet-300/10 p-2" id={panelId}>
                          <div className="px-3 pb-3 pt-2">
                            <p className="font-display text-base font-bold text-white">{group.heading}</p>
                            <p className="text-lavender mt-1 text-xs leading-5">{group.description}</p>
                          </div>
                          <ul className="space-y-1">
                            {group.items.map((item) => {
                              const Icon = iconComponents[item.icon];

                              return item.href ? (
                                <li key={item.id}>
                                  <Link
                                    className="focus-ring group flex min-h-16 items-start gap-3 rounded-xl border border-transparent px-3 py-3 transition duration-300 hover:border-violet-300/15 hover:bg-violet-400/10 focus-visible:border-violet-300/25 focus-visible:bg-violet-400/10"
                                    href={item.href}
                                    onClick={closeNavigation}
                                  >
                                    <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg border border-violet-300/10 bg-violet-400/10 text-violet-200">
                                      <Icon className="size-4" />
                                    </span>
                                    <span className="min-w-0">
                                      <span className="block text-sm font-bold text-white">{item.label}</span>
                                      <span className="text-lavender mt-1 block text-xs leading-5">
                                        {item.description}
                                      </span>
                                    </span>
                                  </Link>
                                </li>
                              ) : null;
                            })}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  );
                })}

                {navigationLinks.map((link) => (
                  <Link
                    className="focus-ring mt-3 flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 font-bold text-white shadow-[0_12px_32px_rgba(109,40,217,0.28)]"
                    href={link.href}
                    key={link.href}
                    onClick={closeNavigation}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          ) : null}
        </div>

        {mobileOpen ? (
          <button
            aria-label="Cerrar menú"
            className="pointer-events-auto fixed inset-0 -z-10 cursor-default bg-[#080811]/75 backdrop-blur-sm min-[1200px]:hidden"
            onClick={() => setMobileOpen(false)}
            tabIndex={-1}
            type="button"
          />
        ) : null}
      </header>
    </>
  );
}

'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Globe, Menu, X } from 'lucide-react';
import type { MenuItem } from '@/content/types';
import { localePath } from '@/lib/routes';
import styles from './Header.module.css';

type Props = {
  locale: string;
  locales: { code: string; label: string; name: string }[];
  logo: { src: string; width: number; height: number; alt: string };
  menu: MenuItem[];
  contact: { label: string; href: string };
  ui: { menuOpen: string; menuClose: string; mainNav: string; language: string; home: string; tagline: string; brand: string };
};

export function Header({ locale, locales, logo, menu, contact, ui }: Props) {
  const pathname = usePathname() || `/${locale}/`;
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const here = (href?: string) => {
    if (!href || href.startsWith('#')) return false;
    const target = localePath(locale, href);
    return pathname === target || pathname.startsWith(target);
  };
  const current = locales.find((l) => l.code === locale);
  const groupActive = (item: MenuItem) => here(item.href) || Boolean(item.children?.some((c) => here(c.href)));

  /* the same page in another language */
  const switchTo = (code: string) => pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${code}`) || `/${code}/`;

  const close = () => {
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 280);
  };

  useEffect(() => {
    setOpen(false);
    setDropdown(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setDropdown(null);
      if (open) close();
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setDropdown(null);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [open]);

  const Logo = ({ className }: { className: string }) => (
    <NextLink href={localePath(locale, '/')} className={className} aria-label={`${ui.brand} — ${ui.home}`}>
      <img src={logo.src} width={logo.width} height={logo.height} alt={logo.alt} />
    </NextLink>
  );

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Logo className={styles.logo} />

        <nav ref={navRef} className={styles.nav} aria-label={ui.mainNav}>
          <ul className={styles.links}>
            {menu.map((item) =>
              item.children ? (
                <li
                  key={item.id}
                  className={styles.item}
                  data-open={dropdown === item.id}
                  onMouseEnter={() => setDropdown(item.id)}
                  onMouseLeave={() => setDropdown((d) => (d === item.id ? null : d))}
                >
                  <button
                    type="button"
                    className={styles.link}
                    data-active={groupActive(item)}
                    aria-expanded={dropdown === item.id}
                    aria-controls={`menu-${item.id}`}
                    onClick={() => setDropdown((d) => (d === item.id ? null : item.id))}
                  >
                    {item.label}
                    <ChevronDown size={16} aria-hidden />
                  </button>
                  <div className={styles.panel} id={`menu-${item.id}`}>
                    {item.caption && <p className={styles.caption}>{item.caption}</p>}
                    <ul>
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <NextLink href={localePath(locale, c.href)} className={styles.panelLink} aria-current={here(c.href) ? 'page' : undefined}>
                            {c.label}
                          </NextLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={item.id} className={styles.item}>
                  <NextLink href={localePath(locale, item.href ?? '/')} className={styles.link} data-active={here(item.href)} aria-current={here(item.href) ? 'page' : undefined}>
                    {item.label}
                  </NextLink>
                </li>
              ),
            )}
          </ul>

          <div
            className={`${styles.item} ${styles.langItem}`}
            data-open={dropdown === 'lang'}
            onMouseEnter={() => setDropdown('lang')}
            onMouseLeave={() => setDropdown((d) => (d === 'lang' ? null : d))}
          >
            <button
              type="button"
              className={styles.langButton}
              aria-expanded={dropdown === 'lang'}
              aria-controls="menu-lang"
              aria-label={`${ui.language}: ${current?.name ?? locale}`}
              onClick={() => setDropdown((d) => (d === 'lang' ? null : 'lang'))}
            >
              <Globe size={18} aria-hidden />
              <span>{current?.label ?? locale.toUpperCase()}</span>
              <ChevronDown size={14} aria-hidden />
            </button>
            <div className={`${styles.panel} ${styles.langPanel}`} id="menu-lang">
              <p className={styles.caption}>{ui.language}</p>
              <ul>
                {locales.map((l) => (
                  <li key={l.code}>
                    <NextLink href={switchTo(l.code)} hrefLang={l.code} lang={l.code} className={styles.panelLink} aria-current={l.code === locale ? 'true' : undefined}>
                      <span>{l.name}</span>
                      {l.code === locale && <Check size={16} aria-hidden />}
                    </NextLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <NextLink href={localePath(locale, contact.href)} className={`btn btn-primary ${styles.cta}`}>
            {contact.label}
          </NextLink>
        </nav>

        <button type="button" className={styles.burger} aria-label={ui.menuOpen} aria-expanded={open} aria-controls="drawer" onClick={() => setOpen(true)}>
          <Menu size={34} strokeWidth={2} aria-hidden />
        </button>
      </div>

      {open && (
        <>
          <div className={styles.overlay} data-closing={closing} onClick={close} aria-hidden />
          <div className={styles.drawer} id="drawer" data-closing={closing} role="dialog" aria-modal="true" aria-label={ui.mainNav}>
            <div className={styles.drawerHead}>
              <Logo className={styles.drawerLogo} />
              <button type="button" className={styles.close} aria-label={ui.menuClose} onClick={close}>
                <X size={30} aria-hidden />
              </button>
            </div>

            <nav className={styles.drawerNav} aria-label={ui.mainNav}>
              {menu.map((item) =>
                item.children ? (
                  <details key={item.id} className={styles.group} open={groupActive(item)}>
                    <summary className={styles.drawerLink} data-active={groupActive(item)}>
                      {item.label}
                      <ChevronDown size={18} aria-hidden />
                    </summary>
                    <ul>
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <NextLink href={localePath(locale, c.href)} className={styles.subLink} data-active={here(c.href)} onClick={close}>
                            {c.label}
                          </NextLink>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <NextLink key={item.id} href={localePath(locale, item.href ?? '/')} className={styles.drawerLink} data-active={here(item.href)} onClick={close}>
                    {item.label}
                  </NextLink>
                ),
              )}
            </nav>

            <div className={styles.drawerFoot}>
              <ul className={styles.drawerLangs} aria-label={ui.language}>
                <li aria-hidden>
                  <Globe size={18} />
                </li>
                {locales.map((l) => (
                  <li key={l.code}>
                    <NextLink href={switchTo(l.code)} hrefLang={l.code} lang={l.code} aria-current={l.code === locale ? 'true' : undefined}>
                      {l.name}
                    </NextLink>
                  </li>
                ))}
              </ul>
              <NextLink href={localePath(locale, contact.href)} className="btn btn-primary" onClick={close}>
                {contact.label}
              </NextLink>
              <div className={styles.brand}>
                <strong>{ui.brand}</strong>
                <span>{ui.tagline}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

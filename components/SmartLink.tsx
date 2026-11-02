import NextLink from 'next/link';
import type { ReactNode } from 'react';
import { isExternal, localePath } from '@/lib/routes';

type Props = {
  locale: string;
  /** A site path without the language, an anchor, or an absolute URL. */
  href: string;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
  'aria-current'?: 'page' | undefined;
  onClick?: () => void;
};

/** One link for every case: in-site paths get the language, the rest open as they are. */
export function SmartLink({ locale, href, children, ...rest }: Props) {
  if (isExternal(href)) {
    const web = href.startsWith('http');
    return (
      <a href={href} {...(web ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {children}
      </a>
    );
  }
  if (href.startsWith('#')) return <a href={href} {...rest}>{children}</a>;
  return (
    <NextLink href={localePath(locale, href)} {...rest}>
      {children}
    </NextLink>
  );
}

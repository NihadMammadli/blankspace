/** `fill('{n} guests', { n: 40 })` → '40 guests'. Unknown placeholders are left as they are. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

/** 590 → "€590" (en), "590 €" (fr), "€ 590" (nl). */
export function money(locale: string, amount: number, currency: string): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

/** "2023-10-20" → "20 October 2023", in the page's language. */
export function longDate(locale: string, iso: string): string {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));
}

/** "+32 470 93 75 68" → "tel:+32470937568" */
export const tel = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

/** Country names in the page's language, from ISO codes in the content. */
export function countryName(locale: string, code: string): string {
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(code) ?? code;
  } catch {
    return code;
  }
}

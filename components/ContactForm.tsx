'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { fill } from '@/lib/format';
import styles from './ContactForm.module.css';

type Strings = {
  title: string; intro: string; firstName: string; lastName: string; country: string; countryPlaceholder: string;
  phone: string; phonePlaceholder: string; email: string; emailPlaceholder: string; message: string; messagePlaceholder: string;
  required: { firstName: string; lastName: string; email: string; message: string };
  invalidEmail: string; requiredNote: string; submit: string; sending: string; success: string; error: string; mailtoNote: string; mailSubject: string;
};

type Props = {
  locale: string;
  strings: Strings;
  /** Where requests go. Empty: the visitor's email app opens with the request filled in. */
  endpoint: string;
  email: string;
  countries: { code: string; name: string }[];
  defaultCountry: string;
  logo: { src: string; alt: string };
};

type Field = 'firstName' | 'lastName' | 'email' | 'message';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Damla's request form: the brand on the left, the form on the right. */
export function ContactForm({ locale, strings: s, endpoint, email, countries, defaultCountry, logo }: Props) {
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const next: Partial<Record<Field, string>> = {};
    (['firstName', 'lastName', 'email', 'message'] as Field[]).forEach((f) => {
      if (!data[f]?.trim()) next[f] = s.required[f];
    });
    if (!next.email && !EMAIL.test(data.email)) next.email = s.invalidEmail;
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

    const name = `${data.firstName} ${data.lastName}`.trim();
    if (!endpoint) {
      const lines = [data.message, '', `${name}`, data.email, [data.phone, data.country].filter(Boolean).join(' · ')];
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(fill(s.mailSubject, { name }))}&body=${encodeURIComponent(lines.join('\n'))}`;
      return;
    }

    setState('sending');
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, name, locale }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState('sent');
      form.reset();
    } catch {
      setState('failed');
    }
  };

  const err = (f: Field) =>
    errors[f] ? (
      <span id={`${f}-error`} className={styles.error}>
        {errors[f]}
      </span>
    ) : null;
  const a11y = (f: Field) => ({ 'aria-invalid': Boolean(errors[f]) || undefined, 'aria-describedby': errors[f] ? `${f}-error` : undefined });

  return (
    <section className={styles.section} id="request">
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand} data-reveal="left">
          <img src={logo.src} alt={logo.alt} width={512} height={95} loading="lazy" />
        </div>

        <div className={styles.body} data-reveal="right">
          <h2 className="title">{s.title}</h2>
          <p className="body">{s.intro}</p>

          <form className={styles.form} onSubmit={submit} noValidate>
            {state === 'sent' && <p className={styles.success} role="status">{s.success}</p>}
            {state === 'failed' && <p className={styles.failure} role="alert">{fill(s.error, { email })}</p>}

            <div className={styles.row}>
              <label className={styles.field}>
                <span className={styles.label}>{s.firstName} <span className={styles.req}>*</span></span>
                <input name="firstName" autoComplete="given-name" className={styles.input} placeholder={s.firstName} {...a11y('firstName')} />
                {err('firstName')}
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{s.lastName} <span className={styles.req}>*</span></span>
                <input name="lastName" autoComplete="family-name" className={styles.input} placeholder={s.lastName} {...a11y('lastName')} />
                {err('lastName')}
              </label>
            </div>

            <div className={styles.row}>
              <label className={styles.field}>
                <span className={styles.label}>{s.country}</span>
                <select name="country" className={styles.input} defaultValue={countries.find((c) => c.code === defaultCountry)?.name ?? ''} autoComplete="country-name">
                  <option value="">{s.countryPlaceholder}</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{s.phone}</span>
                <input name="phone" type="tel" autoComplete="tel" className={styles.input} placeholder={s.phonePlaceholder} />
              </label>
            </div>

            <label className={styles.field}>
              <span className={styles.label}>{s.email} <span className={styles.req}>*</span></span>
              <input name="email" type="email" autoComplete="email" className={styles.input} placeholder={s.emailPlaceholder} {...a11y('email')} />
              {err('email')}
            </label>

            <label className={styles.field}>
              <span className={styles.label}>{s.message} <span className={styles.req}>*</span></span>
              <textarea name="message" rows={5} className={styles.input} placeholder={s.messagePlaceholder} {...a11y('message')} />
              {err('message')}
            </label>

            <p className={styles.note}>{s.requiredNote}</p>
            <button type="submit" className={`btn btn-primary ${styles.submit}`} disabled={state === 'sending'}>
              {state === 'sending' ? s.sending : s.submit}
              <ArrowRight size={18} aria-hidden />
            </button>
            {!endpoint && <p className={styles.note}>{fill(s.mailtoNote, { email })}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}

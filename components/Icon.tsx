import {
  Armchair, ArrowRight, Award, Building2, CalendarClock, ChevronDown, ClipboardList, Coffee, Croissant, CupSoda, GlassWater,
  Handshake, KeyRound, Mail, MapPin, Maximize, Mic, MonitorPlay, MonitorSpeaker, Phone, Presentation, Projector, Quote,
  Sparkles, Speaker, Sun, Table2, Train, Tv, UserCheck, Users, UtensilsCrossed, Wifi, Wrench, MessageSquareText, Car,
  type LucideProps,
} from 'lucide-react';
import type { ComponentType } from 'react';

/** Brand marks lucide does not carry. 24 × 24, filled. */
const Instagram = (p: LucideProps) => (
  <svg viewBox="0 0 24 24" width={p.size ?? 24} height={p.size ?? 24} fill="currentColor" aria-hidden className={p.className}>
    <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.2.8-.4.4-.6.7-.8 1.2-.2.4-.3 1-.4 2.1C2.7 9.8 2.7 10.2 2.7 12s0 2.2.1 3.4c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.2.4.4.7.6 1.2.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.2-.8.4-.4.6-.7.8-1.2.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-3.4s0-2.2-.1-3.4c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.2-.4-.4-.7-.6-1.2-.8-.4-.2-1-.3-2.1-.4C15.5 4 15.1 4 12 4zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8zm0 8.1a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zm6.2-8.3a1.1 1.1 0 1 1-2.3 0 1.1 1.1 0 0 1 2.3 0z" />
  </svg>
);

const Linkedin = (p: LucideProps) => (
  <svg viewBox="0 0 24 24" width={p.size ?? 24} height={p.size ?? 24} fill="currentColor" aria-hidden className={p.className}>
    <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.5H3.6V9h3.5v11.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z" />
  </svg>
);

/**
 * Icons are named in the content ("Coffee", "Tv", …), so a new feature can pick
 * one without touching code. Only the icons listed here are bundled.
 */
const ICONS: Record<string, ComponentType<LucideProps>> = {
  Armchair, ArrowRight, Award, Building2, CalendarClock, Car, ChevronDown, ClipboardList, Coffee, Croissant, CupSoda, GlassWater,
  Handshake, Instagram, KeyRound, Linkedin, Mail, MapPin, Maximize, MessageSquareText, Mic, MonitorPlay, MonitorSpeaker, Phone,
  Presentation, Projector, Quote, Sparkles, Speaker, Sun, Table2, Train, Tv, UserCheck, Users, UtensilsCrossed, Wifi, Wrench,
};

export function Icon({ name, size = 24, strokeWidth = 1.6, className }: { name: string; size?: number; strokeWidth?: number; className?: string }) {
  const C = ICONS[name] ?? Sparkles;
  return <C size={size} strokeWidth={strokeWidth} className={className} aria-hidden />;
}

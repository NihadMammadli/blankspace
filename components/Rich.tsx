import type { Block } from '@/content/types';

/**
 * The only formatting the content understands, on purpose:
 *   *stars*      → the bronze accent inside a heading
 *   blank lines  → paragraphs
 *   email / URL  → links, inside long-form blocks
 */
export function Em({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*([^*]+)\*/g).map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part))}
    </>
  );
}

export function Paragraphs({ items, className }: { items: string[]; className?: string }) {
  return (
    <div className={className}>
      {items.filter(Boolean).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

const LINKABLE = /([\w.+-]+@[\w-]+\.[\w.]+|https?:\/\/\S+)/g;

function Linked({ text }: { text: string }) {
  return (
    <>
      {text.split(LINKABLE).map((part, i) => {
        if (i % 2 === 0) return part;
        const email = part.includes('@') && !part.startsWith('http');
        const clean = part.replace(/[.,]$/, '');
        return (
          <a key={i} href={email ? `mailto:${clean}` : clean} className="text-link" rel={email ? undefined : 'noopener'}>
            {clean}
          </a>
        );
      })}
    </>
  );
}

/** Long-form text: legal pages and blog posts. */
export function Blocks({ blocks, className }: { blocks: Block[]; className?: string }) {
  return (
    <div className={className}>
      {blocks.map((b, i) => {
        if (b.type === 'h2') return <h2 key={i}>{b.text}</h2>;
        if (b.type === 'h3') return <h3 key={i}>{b.text}</h3>;
        if (b.type === 'list')
          return (
            <ul key={i}>
              {b.items.map((it, j) => (
                <li key={j}>
                  {it.label && <strong>{it.label}: </strong>}
                  <Linked text={it.text} />
                </li>
              ))}
            </ul>
          );
        return (
          <p key={i}>
            <Linked text={b.text} />
          </p>
        );
      })}
    </div>
  );
}

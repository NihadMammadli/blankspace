import type { Picture } from '@/lib/media';

type Props = {
  picture: Picture | null;
  /** How wide the picture is drawn, so a phone takes the small file. */
  sizes: string;
  className?: string;
  /** The picture that is the page's first impression: load it first. */
  priority?: boolean;
};

export function Photo({ picture, sizes, className, priority }: Props) {
  if (!picture) return null;
  return (
    <img
      className={className}
      src={picture.src}
      srcSet={picture.srcSet}
      sizes={picture.srcSet ? sizes : undefined}
      width={picture.width}
      height={picture.height}
      alt={picture.alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
    />
  );
}

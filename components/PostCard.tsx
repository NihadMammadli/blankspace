import type { Post, Site } from '@/content/types';
import { picture } from '@/lib/media';
import { longDate } from '@/lib/format';
import { routes } from '@/lib/routes';
import { Photo } from './Photo';
import { SmartLink } from './SmartLink';
import { Icon } from './Icon';
import styles from './PostCard.module.css';

export function PostCard({ site, post }: { site: Site; post: Post }) {
  const href = routes.post(post.slug);
  return (
    <article className={styles.card}>
      <SmartLink locale={site.locale} href={href} className={styles.media} aria-label={post.title}>
        <Photo picture={picture(post.image)} sizes="(max-width: 640px) 92vw, (max-width: 1100px) 45vw, 380px" />
      </SmartLink>
      <div className={styles.body}>
        <p className={styles.meta}>
          <span>{site.blog.categories[post.category] ?? post.category}</span>
          <time dateTime={post.date}>{longDate(site.locale, post.date)}</time>
        </p>
        <h3 className={styles.title} lang={post.lang !== site.locale ? post.lang : undefined}>
          <SmartLink locale={site.locale} href={href}>
            {post.title}
          </SmartLink>
        </h3>
        <p className={styles.excerpt} lang={post.lang !== site.locale ? post.lang : undefined}>
          {post.excerpt}
        </p>
        <SmartLink locale={site.locale} href={href} className="text-link">
          {site.ui.readMore} <Icon name="ArrowRight" size={16} strokeWidth={2} />
        </SmartLink>
      </div>
    </article>
  );
}

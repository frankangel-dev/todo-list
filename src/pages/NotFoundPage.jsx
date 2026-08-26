import {Link} from "react-router";

export default function NotFoundPage() {
  return (
    <div className={'mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-20 text-center'}>
      <p className={'font-heading text-7xl text-accent sm:text-8xl'}>404</p>
      <h2 className={'font-heading text-2xl text-text-primary'}>Page not found</h2>
      <p className={'max-w-xs text-body-sm text-text-muted'}>The page you're looking for doesn't exist or was moved.</p>
      <div className={'mt-2 flex gap-2.5'}>
        <Link
          to={'/todos'}
          className={'flex min-h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-accent-text transition-colors duration-150 hover:bg-accent-hover'}
        >
          Go to to-dos
        </Link>
        <Link
          to={'/about'}
          className={'flex min-h-11 items-center rounded-full border border-border px-5 text-sm font-semibold text-text-muted transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/10'}
        >
          About
        </Link>
      </div>
    </div>
  );
}

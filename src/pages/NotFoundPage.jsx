import {Link} from "react-router";

export default function NotFoundPage() {
    return (
        <div className={'mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-20 text-center'}>
            <p className={'text-8xl font-extrabold text-accent'}>404</p>
            <h2 className={'text-2xl font-extrabold text-text-primary'}>Page not found</h2>
            <p className={'text-text-muted'}>The page you're looking for doesn't exist or was moved.</p>
            <div className={'flex gap-3'}>
                <Link
                    to={'/todos'}
                    className={'cursor-pointer rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-text transition-opacity duration-150 hover:opacity-80'}
                >
                    Go to To-dos
                </Link>
                <Link
                    to={'/about'}
                    className={'cursor-pointer rounded-full border border-border px-5 py-2 text-sm font-semibold text-text-muted transition-all duration-150 hover:bg-border'}
                >
                    About
                </Link>
            </div>
        </div>
    );
}

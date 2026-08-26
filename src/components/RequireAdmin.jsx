import {useAuth} from "../contexts/AuthContext.jsx";

export default function RequireAdmin({children}) {
  const {isAdmin} = useAuth();

  if (!isAdmin) {
    return (
      <div className={'mx-auto flex max-w-3xl flex-col items-center gap-4 px-5 py-16 text-center sm:px-8'}>
        <span className={'flex h-20 w-20 items-center justify-center rounded-full bg-accent-soft text-accent'}>
          <svg className={'h-9 w-9'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="18" height="11" x="3" y="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </span>
        <h2 className={'font-heading text-2xl text-text-primary'}>Admin only</h2>
        <p className={'max-w-sm text-body-sm text-text-muted'}>
          This page shows tasks from every account, so only admins can open it. If you need to get
          in, ask an admin to add the role to your account.
        </p>
      </div>
    );
  }

  return children;
}

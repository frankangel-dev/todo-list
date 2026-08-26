import {useState} from "react";

// asks first since emptying the trash cannot be undone
export default function EmptyTrashButton({onEmptyTrash, disabled = false}) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = () => {
    setIsConfirming(false);
    onEmptyTrash();
  };

  if (isConfirming) {
    return (
      <div className={'flex items-center gap-2 self-start'}>
        <span className={'text-sm text-text-muted'}>This cannot be undone. Sure?</span>
        <button
          className={'min-h-10 cursor-pointer rounded-full border border-border bg-transparent px-4 text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/10'}
          type={'button'}
          onClick={() => setIsConfirming(false)}
        >
          Keep
        </button>
        <button
          className={'min-h-10 cursor-pointer rounded-full border-none bg-accent px-4 text-sm font-semibold text-accent-text transition-colors duration-150 hover:bg-accent-hover'}
          type={'button'}
          onClick={handleConfirm}
        >
          Delete them
        </button>
      </div>
    );
  }

  return (
    <button
      className={'flex min-h-10 cursor-pointer items-center gap-2 self-start rounded-full border border-border bg-transparent px-4 text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-45 dark:hover:bg-white/10'}
      type={'button'}
      onClick={() => setIsConfirming(true)}
      disabled={disabled}
    >
      <svg className={'h-4 w-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 6h18"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      </svg>
      Empty trash
    </button>
  );
}

// turns the checkboxes on and off so the list stays clean
export default function SelectModeToggle({isSelecting, onToggle}) {
  return (
    <button
      className={`flex min-h-10 cursor-pointer items-center gap-2.5 self-start rounded-full border px-4 text-sm font-semibold transition-colors duration-150 ${isSelecting ? 'border-accent bg-accent text-accent-text' : 'border-border bg-transparent text-text-muted hover:bg-black/5 dark:hover:bg-white/10'}`}
      type={'button'}
      onClick={onToggle}
      aria-pressed={isSelecting}
    >
      <svg className={'h-4 w-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
      {isSelecting ? 'Done selecting' : 'Select'}
    </button>
  );
}

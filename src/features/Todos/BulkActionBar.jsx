import {useFolders} from "../../contexts/FolderContext.jsx";

// shows up once you tick at least one task
export default function BulkActionBar({
                                        selectedCount,
                                        onBulkComplete,
                                        onBulkMove,
                                        onBulkDelete,
                                        onClearSelection
                                      }) {
  const {folders} = useFolders();

  if (selectedCount === 0) return null;

  // this select is a menu not a value, so it resets to the placeholder every time
  const handleMove = (value) => {
    if (value === '') return;
    onBulkMove(value === 'none' ? null : Number(value));
  };

  return (
    <div className={'flex flex-col gap-3 rounded-card bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between'}
         role={'region'} aria-label={'Bulk actions'}>
      <span className={'text-body-sm font-semibold text-text-primary'}>
        {selectedCount} selected
      </span>

      <div className={'flex flex-wrap items-center gap-2'}>
        <button
          className={'flex min-h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-border bg-transparent px-4 text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-black/5 sm:flex-none dark:hover:bg-white/10'}
          type={'button'}
          onClick={() => onBulkComplete(true)}
        >
          <svg className={'h-4 w-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
          Done
        </button>

        <button
          className={'flex min-h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-border bg-transparent px-4 text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-black/5 sm:flex-none dark:hover:bg-white/10'}
          type={'button'}
          onClick={() => onBulkComplete(false)}
        >
          {/* an empty circle, same as the unchecked circle on each row */}
          <svg className={'h-4 w-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9"/>
          </svg>
          Not done
        </button>

        <label htmlFor={'bulkMoveTo'} className={'sr-only'}>Move selected to folder</label>
        <select
          className={'min-h-10 flex-1 cursor-pointer rounded-full border border-border bg-bg pr-8 pl-4 text-sm font-semibold text-text-primary sm:flex-none'}
          id={'bulkMoveTo'}
          value={''}
          onChange={(e) => handleMove(e.target.value)}
        >
          <option value={''}>Move to...</option>
          <option value={'none'}>No folder</option>
          {folders.map(folder => (
            <option key={folder.id} value={folder.id}>{folder.name}</option>
          ))}
        </select>

        <button
          className={'flex min-h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-border bg-transparent px-4 text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-black/5 sm:flex-none dark:hover:bg-white/10'}
          type={'button'}
          onClick={onBulkDelete}
        >
          <svg className={'h-4 w-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 6h18"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          Trash
        </button>

        <button
          className={'flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-text-muted transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/10'}
          type={'button'}
          onClick={onClearSelection}
          aria-label={'Clear selection'}
        >
          <svg className={'h-4 w-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

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

  const actionButton = 'flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-bg px-4 text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/10';

  return (
    <div className={'flex flex-col gap-3 rounded-card bg-surface p-4 shadow-sm'}
         role={'region'} aria-label={'Bulk actions'}>

      {/* the count and the clear button share the top line */}
      <div className={'flex items-center justify-between gap-3'}>
        <span className={'text-body-sm font-semibold text-text-primary'}>
          {selectedCount} selected
        </span>
        <button
          className={'flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full border-none bg-transparent px-3 text-sm font-semibold text-text-muted transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/10'}
          type={'button'}
          onClick={onClearSelection}
        >
          <svg className={'h-4 w-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
          Clear
        </button>
      </div>

      <div className={'grid grid-cols-2 gap-2 sm:grid-cols-4'}>
        <button
          className={actionButton}
          type={'button'}
          onClick={() => onBulkComplete(true)}
        >
          <svg className={'h-4 w-4 shrink-0'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
          Done
        </button>

        <button
          className={actionButton}
          type={'button'}
          onClick={() => onBulkComplete(false)}
        >
          {/* an empty circle, same as the unchecked circle on each row */}
          <svg className={'h-4 w-4 shrink-0'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9"/>
          </svg>
          Not done
        </button>

        <div className={'relative flex min-w-0 items-center'}>
          <label htmlFor={'bulkMoveTo'} className={'sr-only'}>Move selected to folder</label>
          <select
            className={'min-h-12 w-full min-w-0 cursor-pointer appearance-none truncate rounded-full border border-border bg-bg py-3 pr-9 pl-4 text-sm font-semibold text-text-primary'}
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
          <svg className={'pointer-events-none absolute right-3.5 h-4 w-4 text-text-muted'} viewBox="0 0 24 24"
               fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round"
               aria-hidden="true">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>

        <button
          className={actionButton}
          type={'button'}
          onClick={onBulkDelete}
        >
          <svg className={'h-4 w-4 shrink-0'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 6h18"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          Trash
        </button>
      </div>
    </div>
  );
}

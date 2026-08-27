import {useSearchParams} from "react-router";

export default function TrashToggle() {
  const [searchParams, setSearchParams] = useSearchParams();
  const inTrash = searchParams.get('trash') === 'true';

  const handleViewChange = (showTrash) => {
    if (showTrash) {
      searchParams.set('trash', 'true');
      // the trash view hides the status and folder controls
      searchParams.delete('status');
      searchParams.delete('folder');
    } else {
      searchParams.delete('trash');
    }

    setSearchParams(searchParams);
  };

  return (
    <div className={'flex min-h-13 flex-1 overflow-hidden rounded-full border border-border sm:flex-none'}
         role={'group'} aria-label={'Switch between tasks and trash'}>
      <button
        className={`flex min-w-0 flex-1 basis-0 cursor-pointer items-center justify-center gap-1.5 px-2 text-sm transition-colors duration-150 sm:flex-none sm:basis-auto sm:px-4 ${!inTrash ? 'bg-accent font-semibold text-accent-text' : 'bg-transparent text-text-muted hover:bg-black/5 dark:hover:bg-white/10'}`}
        onClick={() => handleViewChange(false)}
        aria-pressed={!inTrash}
      >
        Tasks
      </button>
      <button
        className={`flex min-w-0 flex-1 basis-0 cursor-pointer items-center justify-center gap-1.5 border-l border-border px-2 text-sm transition-colors duration-150 sm:flex-none sm:basis-auto sm:px-4 ${inTrash ? 'bg-accent font-semibold text-accent-text' : 'bg-transparent text-text-muted hover:bg-black/5 dark:hover:bg-white/10'}`}
        onClick={() => handleViewChange(true)}
        aria-pressed={inTrash}
      >
        Trash
      </button>
    </div>
  );
}

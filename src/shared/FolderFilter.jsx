import {useSearchParams} from "react-router";
import {useFolders} from "../contexts/FolderContext.jsx";

export default function FolderFilter({onManageFolders}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const {folders} = useFolders();
  const currentFolder = searchParams.get('folder') || 'all';

  const handleFolderChange = (value) => {
    if (value === 'all') {
      searchParams.delete('folder');
    } else {
      searchParams.set('folder', value);
    }

    setSearchParams(searchParams);
  };

  return (
    <div className={'flex min-w-0 flex-1 items-center gap-2 sm:flex-none sm:gap-3'}>
      {/* appearance-none stops iOS from ignoring the height */}
      <div className={'relative flex min-w-0 flex-1 items-center sm:flex-none'}>
        <label htmlFor={'folderSelect'} className={'sr-only'}>Filter by folder</label>
        <select
          className={'min-h-13 w-full min-w-0 cursor-pointer appearance-none truncate rounded-full border border-border bg-surface py-3 pr-10 pl-4 text-body-sm text-text-primary sm:max-w-40 sm:text-sm'}
          id={'folderSelect'}
          value={currentFolder}
          onChange={(e) => handleFolderChange(e.target.value)}
        >
          <option value={'all'}>All folders</option>
          <option value={'none'}>No folder</option>
          {folders.map(folder => (
            <option key={folder.id} value={folder.id}>{folder.name}</option>
          ))}
        </select>
        <svg className={'pointer-events-none absolute right-4 h-4 w-4 text-text-muted'} viewBox="0 0 24 24"
             fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round"
             aria-hidden="true">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </div>

      <button
        className={'flex h-13 w-13 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-text-primary transition-colors duration-150 hover:bg-black/5 sm:h-auto sm:min-h-13 sm:w-auto sm:gap-2 sm:px-4 sm:text-sm sm:font-semibold dark:hover:bg-white/10'}
        type={'button'}
        onClick={onManageFolders}
        aria-label={'Edit folders'}
      >
        <svg className={'h-5 w-5 sm:h-4 sm:w-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 20h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-7.5l-2-2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2Z"/>
          <path d="M12 11v5"/>
          <path d="M9.5 13.5h5"/>
        </svg>
        <span className={'hidden sm:inline'}>Edit folders</span>
      </button>
    </div>
  );
}

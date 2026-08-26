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
    <div className={'flex min-w-0 items-center gap-3'}>
      <label htmlFor={'folderSelect'} className={'sr-only'}>Filter by folder</label>
      <select
        className={'min-h-11 min-w-0 max-w-[10rem] cursor-pointer truncate rounded-full border border-border bg-surface pr-8 pl-4 text-sm text-text-primary'}
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

      <button
        className={'flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/10'}
        type={'button'}
        onClick={onManageFolders}
      >
        <svg className={'h-4 w-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
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

import {useState} from "react";
import {useSearchParams} from "react-router";
import {useFolders} from "../../contexts/FolderContext.jsx";
import {sanitizeInput} from "../../utils/sanitize.js";

// create, rename and delete all in one modal
export default function FolderManager({onClose, onFoldersChanged}) {
  const {folders, error, createFolder, renameFolder, deleteFolder, clearError} = useFolders();
  const [searchParams, setSearchParams] = useSearchParams();
  const [newName, setNewName] = useState('');
  // only one row can be editing or confirming at a time
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [confirmingId, setConfirmingId] = useState(null);

  const isValidName = (value) => value.trim().length >= 3 && value.trim().length <= 30;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!isValidName(newName)) return;

    const result = await createFolder(sanitizeInput(newName.trim()));

    if (result?.success) {
      setNewName('');
      onFoldersChanged?.();
    }
  };

  const handleRename = async (id) => {
    if (!isValidName(editingName)) return;

    const result = await renameFolder(id, sanitizeInput(editingName.trim()));

    if (result?.success) {
      setEditingId(null);
      onFoldersChanged?.();
    }
  };

  const handleDelete = async (id) => {
    const result = await deleteFolder(id);
    setConfirmingId(null);

    if (result?.success) {
      if (searchParams.get('folder') === String(id)) {
        searchParams.delete('folder');
        setSearchParams(searchParams);
      }
      onFoldersChanged?.();
    }
  };

  return (
    <div className={'fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'}
         role={'dialog'} aria-modal={'true'} aria-label={'Manage folders'}
         onClick={onClose}>
      <div className={'flex max-h-[80vh] w-full max-w-md flex-col gap-5 overflow-y-auto rounded-card bg-bg p-6 shadow-lg'}
           onClick={(e) => e.stopPropagation()}>

        <div className={'flex items-start justify-between gap-4'}>
          <div className={'flex flex-col gap-1'}>
            <h2 className={'font-heading text-2xl text-text-primary'}>Folders</h2>
            <p className={'text-body-sm text-text-muted'}>Deleting a folder will not delete its tasks. They just end
              up with no folder.</p>
          </div>
          <button
            className={'flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-text-muted transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/10'}
            type={'button'}
            onClick={onClose}
            aria-label={'Close folder manager'}
          >
            <svg className={'h-4 w-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        {error &&
          <div className={'flex items-center justify-between gap-2 rounded-card bg-accent-soft p-3 text-body-sm text-error'}
               role={'alert'}>
            <span>{error}</span>
            <button className={'cursor-pointer border-none bg-transparent text-xs font-semibold underline'}
                    type={'button'} onClick={clearError}>
              Dismiss
            </button>
          </div>
        }

        <form className={'flex items-center gap-2'} onSubmit={handleCreate}>
          <label htmlFor={'newFolderName'} className={'sr-only'}>New folder name</label>
          <input
            className={'min-h-12 min-w-0 flex-1 rounded-full border border-border bg-surface px-4 text-body text-text-primary'}
            id={'newFolderName'}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={'New folder'}
            maxLength={30}
            autoComplete={'off'}
          />
          <button
            className={'flex min-h-12 shrink-0 cursor-pointer items-center gap-2 rounded-full border-none bg-accent px-5 font-semibold text-accent-text transition-colors duration-150 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-45'}
            type={'submit'}
            disabled={!isValidName(newName)}
          >
            <svg className={'h-4 w-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14"/>
              <path d="M12 5v14"/>
            </svg>
            Add
          </button>
        </form>

        <div className={'flex flex-col gap-2.5'}>
          {folders.length === 0 &&
            <p className={'py-4 text-center text-body-sm text-text-muted'}>You have not made any folders yet.</p>
          }

          {folders.map(folder => (
            <div key={folder.id}
                 className={'flex items-center gap-2 rounded-card bg-surface p-2.5 pl-4'}>

              {editingId === folder.id ? (
                <>
                  <label htmlFor={`renameFolder-${folder.id}`} className={'sr-only'}>Rename folder</label>
                  <input
                    className={'min-h-11 min-w-0 flex-1 rounded-full border border-text-primary/60 bg-bg px-4 text-body text-text-primary'}
                    id={`renameFolder-${folder.id}`}
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    maxLength={30}
                    autoComplete={'off'}
                    autoFocus
                  />
                  <button
                    className={'min-h-10 shrink-0 cursor-pointer rounded-full border border-border bg-transparent px-4 text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/10'}
                    type={'button'}
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className={'min-h-10 shrink-0 cursor-pointer rounded-full border-none bg-accent px-4 text-sm font-semibold text-accent-text transition-colors duration-150 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-45'}
                    type={'button'}
                    onClick={() => handleRename(folder.id)}
                    disabled={!isValidName(editingName)}
                  >
                    Save
                  </button>
                </>
              ) : confirmingId === folder.id ? (
                <>
                  <span className={'flex-1 text-body text-text-muted'}>Delete "{folder.name}"?</span>
                  <button
                    className={'min-h-10 shrink-0 cursor-pointer rounded-full border border-border bg-transparent px-4 text-sm font-semibold text-text-primary transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/10'}
                    type={'button'}
                    onClick={() => setConfirmingId(null)}
                  >
                    Keep
                  </button>
                  <button
                    className={'min-h-10 shrink-0 cursor-pointer rounded-full border-none bg-accent px-4 text-sm font-semibold text-accent-text transition-colors duration-150 hover:bg-accent-hover'}
                    type={'button'}
                    onClick={() => handleDelete(folder.id)}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <span className={'flex-1 text-body font-medium text-text-primary'}>{folder.name}</span>
                  <button
                    className={'flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-text-muted transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/10'}
                    type={'button'}
                    onClick={() => {
                      setEditingId(folder.id);
                      setEditingName(folder.name);
                      setConfirmingId(null);
                    }}
                    aria-label={`Rename ${folder.name}`}
                  >
                    <svg className={'h-4 w-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 20h9"/>
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                    </svg>
                  </button>
                  <button
                    className={'flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-text-muted transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/10'}
                    type={'button'}
                    onClick={() => {
                      setConfirmingId(folder.id);
                      setEditingId(null);
                    }}
                    aria-label={`Delete ${folder.name}`}
                  >
                    <svg className={'h-4 w-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 6h18"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

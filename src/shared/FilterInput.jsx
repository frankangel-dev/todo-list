export default function FilterInput({filterTerm, onFilterChange}) {
  return (
    <div className={'relative flex min-w-0 flex-1 items-center'}>
      <svg className={'pointer-events-none absolute left-4 h-4 w-4 text-text-muted'} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.3-4.3"/>
      </svg>
      <label htmlFor={'filterInput'} className={'sr-only'}>Search todos:</label>
      <input
        className={'min-h-13 w-full rounded-full border border-border bg-surface pl-11 pr-4 text-body-sm text-text-primary outline-none placeholder:text-text-muted'}
        id={'filterInput'}
        type={'text'}
        value={filterTerm}
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder={'Search by title'}
        autoComplete={'off'}
      />
    </div>
  );
}

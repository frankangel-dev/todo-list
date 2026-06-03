export default function FilterInput({filterTerm, onFilterChange}) {
    return (
        <div className={'flex items-center gap-3 rounded-full border border-border bg-glass backdrop-blur-md px-4 py-3'}>
            <svg className={'h-5 w-5 text-text-muted'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-Hidden="true" data-slot="icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
            </svg>
            <label htmlFor={'filterInput'} className={'sr-only'}>Search todos:</label>
            <input
                className={'flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-muted'}
                id={'filterInput'}
                type={'text'}
                value={filterTerm}
                onChange={(e) => onFilterChange(e.target.value)}
                placeholder={'Search by title'}
            />
        </div>
    );
}
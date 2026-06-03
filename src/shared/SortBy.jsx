export default function SortBy({sortBy, sortDirection, onSortByChange, onSortDirectionChange}) {
    const labelStyle = 'text-sm font-bold text-text-muted mr-1';
    const selectStyle = 'bg-glass backdrop-blur-md border border-border outline-none rounded-lg py-2 pl-3 pr-8 text-sm text-text-primary cursor-pointer';
    const containerStyle = 'flex flex-col items-center gap-2';
    
    return (
        <div className={'flex flex-wrap justify-center gap-4'}>
            <div className={containerStyle}>
                <label htmlFor={'sortBySelect'} className={labelStyle}>Sort By</label>
                <select
                    className={selectStyle}
                    id={'sortBySelect'}
                    value={sortBy}
                    onChange={(e) => onSortByChange(e.target.value)}
                    aria-label={'Sort by'}
                >
                    <option value={'createdDate'}>Created Date</option>
                    <option value={'title'}>Title</option>
                </select>
            </div>
            <div className={containerStyle}>
                <label htmlFor={'sortDirectionSelect'} className={labelStyle}>Order By</label>
                <select
                    className={selectStyle}
                    id={'sortDirectionSelect'}
                    value={sortDirection}
                    onChange={(e) => onSortDirectionChange(e.target.value)}
                    aria-label={'Sort Direction'}
                >
                    <option value={'desc'}>Descending</option>
                    <option value={'asc'}>Ascending</option>
                </select>
            </div>
        </div>
    );
}
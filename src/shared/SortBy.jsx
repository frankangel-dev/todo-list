export default function SortBy({sortBy, sortDirection, onSortByChange, onSortDirectionChange}) {
    return (
        <div>
            <label htmlFor={'sortBySelect'}>Sort By</label>
            <select 
                id={'sortBySelect'}
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value)}
            >
                <option value={'createdDate'}>Created Date</option>
                <option value={'title'}>Title</option>
            </select>

            <label htmlFor={'sortDirectionSelect'}>Order By</label>
            <select 
                id={'sortDirectionSelect'}
                value={sortDirection}
                onChange={(e) => onSortDirectionChange(e.target.value)}
            >
                <option value={'desc'}>Descending</option>
                <option value={'asc'}>Ascending</option>
            </select>
        </div>
    );
}
export default function SortBy({sortBy, sortDirection, onSortByChange, onSortDirectionChange}) {
  // one control instead of two options, the value carries both field and direction
  const value = `${sortBy}:${sortDirection}`;

  const handleChange = (next) => {
    const [nextSortBy, nextDirection] = next.split(':');
    if (nextSortBy !== sortBy) onSortByChange(nextSortBy);
    if (nextDirection !== sortDirection) onSortDirectionChange(nextDirection);
  };

  return (
    // on mobile the select is stretched invisibly over the circular icon button;
    // sm and up returns to a normal text dropdown
    <div
      className={'relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent sm:h-auto sm:min-h-11 sm:w-auto sm:focus-within:outline-none'}>
      <svg className={'pointer-events-none h-4 w-4 text-text-primary sm:hidden'} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 6h13M4 12h9M4 18h5"/>
        <path d="M19 20V11m0 0-2.5 2.5M19 11l2.5 2.5"/>
      </svg>
      <label htmlFor={'sortSelect'} className={'sr-only'}>Sort todos</label>
      <select
        className={'absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-full bg-transparent opacity-0 outline-none sm:static sm:h-auto sm:min-h-11 sm:w-auto sm:appearance-auto sm:bg-surface sm:pr-8 sm:pl-4 sm:text-sm sm:text-text-primary sm:opacity-100'}
        id={'sortSelect'}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        aria-label={'Sort todos'}
      >
        <option value={'createdAt:desc'}>Newest first</option>
        <option value={'createdAt:asc'}>Oldest first</option>
        <option value={'title:asc'}>Title A–Z</option>
        <option value={'title:desc'}>Title Z–A</option>
      </select>
    </div>
  );
}

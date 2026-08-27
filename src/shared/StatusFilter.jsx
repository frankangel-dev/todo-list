import {useSearchParams} from "react-router";

export default function StatusFilter({counts = {}}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus = searchParams.get('status') || 'all';
  const options = [
    {value: 'all', label: 'All'},
    {value: 'active', label: 'Active'},
    {value: 'completed', label: 'Done'}
  ];

  const handleStatusChange = (status) => {
    // remove the param entirely for 'all' so the URL stays clean
    if (status === 'all') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', status);
    }

    setSearchParams(searchParams);
  };

  return (
    <div className={'flex min-h-13 flex-1 overflow-hidden rounded-full border border-border sm:flex-none'}
         role={'group'} aria-label={'Filter todos by status'}>
      {options.map((option, index) => (
        <button
          key={option.value}
          className={`flex min-w-0 flex-1 basis-0 cursor-pointer items-center justify-center gap-1.5 px-2 text-sm transition-colors duration-150 sm:flex-none sm:basis-auto sm:px-4 ${index > 0 ? 'border-l border-border' : ''} ${currentStatus === option.value ? 'bg-accent font-semibold text-accent-text' : 'bg-transparent text-text-muted hover:bg-black/5 dark:hover:bg-white/10'}`}
          onClick={() => handleStatusChange(option.value)}
          aria-pressed={currentStatus === option.value}
        >
          {option.label}
          {counts[option.value] !== undefined &&
            <span className={'hidden opacity-70 sm:inline'}>{counts[option.value]}</span>}
        </button>
      ))}
    </div>
  );
}

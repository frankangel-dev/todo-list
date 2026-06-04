import {useSearchParams} from "react-router";

export default function StatusFilter() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentStatus = searchParams.get('status') || 'all';
    const baseStyle = 'px-5 py-2 min-h-11 rounded-full text-sm font-semibold cursor-pointer transition-all duration-150 border border-border';

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
        <div className={'flex justify-center gap-4'} role={'group'} aria-label={'Filter todos by status'}>
            <button
                className={`${baseStyle} ${currentStatus === 'all' ? 'bg-accent text-accent-text' : 'bg-surface text-text-muted'} border-border`}
                onClick={() => handleStatusChange('all')}
                aria-pressed={currentStatus === 'all'}
            >
                All
            </button>
            <button
                className={`${baseStyle} ${currentStatus === 'active' ? 'bg-accent text-accent-text' : 'bg-surface text-text-muted'} border-border`}
                onClick={() => handleStatusChange('active')}
                aria-pressed={currentStatus === 'active'}
            >
                Active
            </button>
            <button
                className={`${baseStyle} ${currentStatus === 'completed' ? 'bg-accent text-accent-text' : 'bg-surface text-text-muted'} border-border`}
                onClick={() => handleStatusChange('completed')}
                aria-pressed={currentStatus === 'completed'}
            >
                Completed
            </button>
        </div>
    );
}
export default function AboutPage() {
    const titleStyle = 'text-xl font-bold text-text-primary';
    const cardStyle = 'bg-glass backdrop-blur-md border border-border rounded-2xl px-5 py-4 text-text-primary font-semibold';
    const pillStyle = 'px-3 py-1 bg-glass backdrop-blur-md rounded-full border border-border font-semibold text-text-primary';
    return (
        <div className={'mx-auto flex max-w-2xl flex-col gap-6 px-6 py-6'}>
            <h2 className={'flex justify-center text-3xl font-extrabold wrap-break-word text-text-primary'}>About To-Do
                App</h2>
            <p className={'flex justify-center text-text-muted'}>A to-do app built with React 19</p>

            <h3 className={titleStyle}>Features</h3>
            <ul className={'grid grid-cols-1 gap-4 sm:grid-cols-2'}>
                <li className={cardStyle}>Add, edit, and complete todos</li>
                <li className={cardStyle}>Filter todos by status</li>
                <li className={cardStyle}>Sort todos by date or title</li>
                <li className={cardStyle}>Search todos by keyword</li>
            </ul>

            <h3 className={titleStyle}>Technologies</h3>
            <ul className={'flex flex-wrap gap-2'}>
                <li className={pillStyle}>React</li>
                <li className={pillStyle}>React Router</li>
                <li className={pillStyle}>Vite</li>
                <li className={pillStyle}>Tailwind</li>
            </ul>
        </div>
    );
}
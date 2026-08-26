export default function AboutPage() {
  const features = [
    {title: 'Add and edit', body: 'Click a title to change it. Click the circle to mark it done.'},
    {title: 'Folders', body: 'Put tasks into folders, rename them, and filter to see one folder at a time.'},
    {title: 'Trash', body: 'Deleting a task sends it to the trash first, so you can get it back if you change your mind.'},
    {title: 'Bulk actions', body: 'Pick a few tasks and finish, reopen, move, or trash all of them in one go.'},
    {title: 'Filter and search', body: 'Narrow the list by status, folder, or a search term. The URL keeps your filters if you refresh.'},
    {title: 'Swipe to delete', body: 'On a phone, swipe a task to the left to get rid of it.'}
  ];

  const accountFeatures = [
    {title: 'Sign up or log in', body: 'Use an email and password, or just log in with your Google account.'},
    {title: 'Bot check', body: 'Signing up runs a reCAPTCHA check so bots cannot spam the sign up form.'},
    {title: 'Admin view', body: 'Admin accounts get an extra page showing task activity for everyone.'}
  ];

  const frontEndTech = ['React 19', 'React Router 7', 'Vite', 'Tailwind v4', 'DOMPurify'];
  const backEndTech = ['Node', 'Express 5', 'PostgreSQL', 'Prisma', 'JWT', 'Joi'];

  return (
    <div className={'mx-auto flex max-w-3xl flex-col gap-7 px-5 py-8 sm:px-8'}>
      <div className={'flex flex-col gap-2'}>
        <h2 className={'font-heading text-3xl wrap-break-word text-text-primary sm:text-4xl'}>About this app</h2>
        <p className={'max-w-lg text-base text-text-muted'}>
          A to-do app I built for my Node class. The React front end talks to my own Express API,
          which stores everything in a Postgres database. You only ever see your own tasks.
        </p>
      </div>

      <div className={'flex flex-col gap-3.5'}>
        <h3 className={'font-heading text-xl text-text-primary'}>What you can do</h3>
        <ul className={'grid list-none grid-cols-1 gap-3.5 p-0 sm:grid-cols-2'}>
          {features.map(feature => (
            <li key={feature.title} className={'flex flex-col gap-1.5 rounded-card bg-surface p-5 shadow-sm'}>
              <h4 className={'font-heading text-lg text-text-primary'}>{feature.title}</h4>
              <p className={'text-sm text-text-muted'}>{feature.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className={'flex flex-col gap-3.5'}>
        <h3 className={'font-heading text-xl text-text-primary'}>Accounts</h3>
        <ul className={'grid list-none grid-cols-1 gap-3.5 p-0 sm:grid-cols-2'}>
          {accountFeatures.map(feature => (
            <li key={feature.title} className={'flex flex-col gap-1.5 rounded-card bg-surface p-5 shadow-sm'}>
              <h4 className={'font-heading text-lg text-text-primary'}>{feature.title}</h4>
              <p className={'text-sm text-text-muted'}>{feature.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className={'flex flex-col gap-3.5 rounded-card bg-surface p-5 shadow-sm'}>
        <h3 className={'font-heading text-lg text-text-primary'}>How your account stays safe</h3>
        <p className={'text-sm text-text-muted'}>
          When you log in, your session gets stored in a cookie that JavaScript on the page cannot
          read, so a bad script cannot steal it. Anything that changes your data also has to send a
          second token, which stops other sites from making requests as you. Every task and folder
          is looked up by whoever is logged in, so there is no way to see someone else's stuff.
        </p>
      </div>

      <div className={'flex flex-col gap-3'}>
        <h3 className={'font-heading text-lg text-text-primary'}>Built with</h3>
        <div className={'flex flex-col gap-2.5'}>
          <div className={'flex flex-wrap items-center gap-2'}>
            <span className={'w-20 text-xs font-bold uppercase tracking-wider text-text-muted'}>Front end</span>
            <ul className={'flex list-none flex-wrap gap-2 p-0'}>
              {frontEndTech.map(item => (
                <li key={item}
                    className={'rounded-full bg-accent-soft px-3.5 py-1 text-xs font-semibold text-accent'}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={'flex flex-wrap items-center gap-2'}>
            <span className={'w-20 text-xs font-bold uppercase tracking-wider text-text-muted'}>Back end</span>
            <ul className={'flex list-none flex-wrap gap-2 p-0'}>
              {backEndTech.map(item => (
                <li key={item}
                    className={'rounded-full bg-accent-2-soft px-3.5 py-1 text-xs font-semibold text-accent-2'}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

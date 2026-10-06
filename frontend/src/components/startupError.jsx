// Shown instead of a blank page when the app cannot start at all. In practice
// that means the Supabase environment variables are missing, which is a setup
// problem rather than something the person using the site can fix.
export default function StartupError({ missing = [], error }) {
  const isConfig = missing.length > 0

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: '#f5f3ee',
        color: '#1b2a44',
        fontFamily: "'Albert Sans', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: '34rem',
          width: '100%',
          background: '#ffffff',
          border: '1px solid #ddd8cd',
          borderRadius: '10px',
          padding: '1.75rem',
        }}
      >
        <h1 style={{ margin: '0 0 .5rem', fontSize: '1.25rem', fontWeight: 700 }}>
          {isConfig ? 'This site is not configured yet' : 'Something went wrong starting the site'}
        </h1>

        {isConfig ? (
          <>
            <p style={{ margin: '0 0 1rem', fontSize: '.9375rem', lineHeight: 1.55, color: '#5b6676' }}>
              If you are a student or parent, nothing is wrong on your end. Please try again later.
            </p>
            <p style={{ margin: '0 0 .5rem', fontSize: '.875rem', fontWeight: 600 }}>
              If you are running this locally:
            </p>
            <p style={{ margin: '0 0 .75rem', fontSize: '.875rem', lineHeight: 1.55, color: '#5b6676' }}>
              {missing.length === 1 ? 'This variable is' : 'These variables are'} missing from{' '}
              <code>frontend/.env</code>:
            </p>
            <ul style={{ margin: '0 0 1rem', paddingLeft: '1.25rem', fontSize: '.875rem', lineHeight: 1.7 }}>
              {missing.map((key) => (
                <li key={key}>
                  <code>{key}</code>
                </li>
              ))}
            </ul>
            <pre
              style={{
                margin: 0,
                padding: '.75rem',
                background: '#f5f3ee',
                border: '1px solid #ddd8cd',
                borderRadius: '6px',
                fontSize: '.8125rem',
                lineHeight: 1.6,
                overflowX: 'auto',
              }}
            >
{`# frontend/.env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here`}
            </pre>
          </>
        ) : (
          <>
            <p style={{ margin: '0 0 1rem', fontSize: '.9375rem', lineHeight: 1.55, color: '#5b6676' }}>
              Try reloading the page. If it keeps happening, the details are in the browser console.
            </p>
            {error?.message && (
              <pre
                style={{
                  margin: 0,
                  padding: '.75rem',
                  background: '#f5f3ee',
                  border: '1px solid #ddd8cd',
                  borderRadius: '6px',
                  fontSize: '.8125rem',
                  overflowX: 'auto',
                }}
              >
                {error.message}
              </pre>
            )}
          </>
        )}
      </div>
    </div>
  )
}

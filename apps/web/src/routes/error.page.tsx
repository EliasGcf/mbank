import { Button } from '@/components/ui/button';
import { Link, useRouteError } from 'react-router-dom';

export function ErrorPage() {
  const error = useRouteError();

  const isInstanceError = error instanceof Error;
  const isUnauthorizedError = isInstanceError && error.message === 'Unauthorized';

  if (isUnauthorizedError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2">
        <h1 className="text-4xl font-bold">You have been logged out</h1>
        <p>Please log in again to continue.</p>
        <p>
          Go back to{' '}
          <Link
            className="text-destructive underline hover:underline-offset-2"
            to="/sign-in"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.reload();
            }}
          >
            Login
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Whoops, something went wrong...</h1>
        <p>An error occurred in the application, below you can find more details:</p>
      </div>
      {isInstanceError ? (
        <pre className="bg-gray-200 p-4 rounded-md">{error.message}</pre>
      ) : (
        <pre className="bg-gray-200 p-4 rounded-md">{JSON.stringify(error, null, 2)}</pre>
      )}
      <div className="flex items-center gap-2">
        <p>
          Go back to{' '}
          <Link className="underline" to="/">
            Dashboard
          </Link>{' '}
          or
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            localStorage.removeItem('token');
            window.location.reload();
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

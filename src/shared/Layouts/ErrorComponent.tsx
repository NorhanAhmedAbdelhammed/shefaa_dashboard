import { Button } from '@UI/index';
import { IoCodeWorkingSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

interface IErrorComponent {
  error?: 'not-found' | 'server-error' | 'auth-error' | 'soon';
}
const ErrorComponent: React.FC<IErrorComponent> = ({ error }) => {
  const navigate = useNavigate();

  let errorText: JSX.Element;

  switch (error) {
    case 'not-found':
      errorText = (
        <>
          <span className="px-3 font-medium text-info">404</span>
          <span className="px-3">This page doesn&apos;t exist!</span>
        </>
      );
      break;

    case 'auth-error':
      errorText = <div>You aren&apos;t authorized to see this</div>;
      break;

    case 'server-error':
      errorText = <div>Looks like our API is down</div>;
      break;

    case 'soon':
      errorText = (
        <>
          <span className="flex items-center px-3 font-medium text-info">
            <IoCodeWorkingSharp className="animate-pulse" />
          </span>
          <span className="px-3">Coming soon ...</span>
        </>
      );
      break;

    default:
      errorText = (
        <>
          <span className="px-3 font-medium text-warning">⚠️</span>
          <span className="px-3">Something went wrong</span>
        </>
      );
  }

  return (
    <div className={'flex h-full w-full flex-col items-center justify-center gap-6'}>
      <div className="flex flex-row gap-1 divide-x-2 text-3xl">{errorText}</div>
      <div className="flex w-fit flex-row gap-3">
        {error !== 'soon' && (
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Go back
          </Button>
        )}
        <Button onClick={() => navigate('/')}>Go home</Button>
      </div>
    </div>
  );
};

export default ErrorComponent;

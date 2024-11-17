import { useEffect } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';

export const ErrorPage = () => {
  const error = useRouteError() as { status?: number; message?: string };
  const navigate = useNavigate();

  console.log(error);

  useEffect(() => {
    if (error?.status === 403) {
      navigate('/login');
    }
  }, [error]);

  return <div>Error page!</div>;
};

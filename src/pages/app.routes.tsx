import { ErrorPage } from './error';
import { HomeRoutes } from './home/route';
import { CommonPage, RawPage } from './index';
import { RouteObject } from 'react-router-dom';

export const appRoutes: RouteObject = {
  element: <RawPage />,
  errorElement: <ErrorPage />,
  children: [
    {
      path: '/',
      id: 'root',
      element: <CommonPage />,
      shouldRevalidate: ({ currentUrl }) => {
        return false;
      },
      children: [HomeRoutes],
    },
  ],
};

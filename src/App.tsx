import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { appRoutes } from './pages/app.routes';

const router = createBrowserRouter([appRoutes]);

const App = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default App;

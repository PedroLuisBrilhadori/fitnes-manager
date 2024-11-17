import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/navbar/navbar';
import { useEffect } from 'react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/sidebar';

export const CommonPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname != '/home') {
      navigate('/home');
    }
  }, [location]);

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <main className="flex flex-col">
          <Navbar></Navbar>
          <Outlet></Outlet>
          <Toaster />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export const RawPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname != '/home') {
      navigate('/home');
    }
  }, [location]);

  return (
    <div>
      <Outlet></Outlet>
      <Toaster />
    </div>
  );
};

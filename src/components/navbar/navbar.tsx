import { AvatarActions } from './avatar';
import { SidebarTrigger } from '../ui/sidebar';

export const Navbar = () => {
  return (
    <div className="flex w-full justify-between p-2 border-slate-200 border-2 drop-shadow-sm">
      <div className="w-[40px] h-[40px]">
        <SidebarTrigger className="w-full h-full" />
      </div>

      <AvatarActions />
    </div>
  );
};

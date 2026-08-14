import { Outlet } from 'react-router-dom';
import AnnouncementBar from '@/sections/AnnouncementBar';
import Navbar from '@/sections/Navbar';
import Footer from '@/sections/Footer';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

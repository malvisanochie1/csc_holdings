import Navbar from "@/components/sections/navs/navbar";
import Sidebar from "@/components/sections/navs/sidebar";
import NotificationsFeed from "@/components/sections/notifications/notifications-feed";

export default function NotificationsPage() {
  return (
    <>
      <Navbar />
      <div className="flex home-bg min-h-screen">
        <div className="max-w-[240px] w-full hidden xl:flex flex-shrink-0">
          <Sidebar active="notifications" />
        </div>
        <div className="w-full">
          <div className="w-full p-3 sm:p-5 h-screen overflow-y-auto">
            <header className="mb-6">
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
                Notifications
              </h1>
            </header>
            <NotificationsFeed />
          </div>
        </div>
      </div>
    </>
  );
}

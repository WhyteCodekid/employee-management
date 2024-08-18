import Sidebar from "~/components/ui/sidebar";

export default function ConsoleLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen dark:bg-slate-950 bg-slate-300/30 gap-6">
      <Sidebar />

      {/* main page content */}
      <div className="flex-1 flex flex-col pt-2 gap-6 h-screen overflow-y-auto relative pr-4">
        <div className="border-b border-white/10 sticky top-0 dark:bg-slate-900/10 py-3 flex items-center justify-between backdrop-blur-md z-50 px-4 rounded-xl">
          <h3 className="font-montserrat font-bold text-xl">{title}</h3>
        </div>

        <div className="px-4 flex-1">{children}</div>
      </div>
    </div>
  );
}

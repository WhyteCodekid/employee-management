import ThemeSwitcher from "./theme-switcher";
import UserDropdown from "./user-dropdown";

export default function Header({
  title,
  hideUserDropdown = false,
}: {
  title: string;
  hideUserDropdown?: boolean;
}) {
  return (
    <div className="flex items-center justify-between h-16 bg-white dark:bg-content2 border-b dark:border-white/10 px-4 transition-colors duration-400">
      <h2 className="font-montserrat font-bold text-xl ml-2">{title}</h2>

      {/* items to the right */}
      <div className="flex items-center gap-2">
        <ThemeSwitcher />

        {!hideUserDropdown && <UserDropdown />}
      </div>
    </div>
  );
}

import {
  Dropdown,
  DropdownTrigger,
  User,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useNavigate } from "@remix-run/react";

export default function UserDropdown({
  user,
  profilePath = "/admin/profile",
}: {
  user?: {
    name: string;
    email: string;
  };
  profilePath: string;
}) {
  const navigate = useNavigate();

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <User
          as="button"
          avatarProps={{
            isBordered: true,
            src: user?.image,
            size: "sm",
            color: "success",
          }}
          className="transition-transform"
          classNames={{
            name: "font-montserrat font-semibold text-gray-900 dark:text-white",
            description: "font-nunito text-gray-600 dark:text-gray-500",
          }}
          description={user?.email}
          name={user?.firstName}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem key="settings" onClick={() => navigate(profilePath)}>
          Profile
        </DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          onClick={() => navigate("/logout")}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

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
}: {
  user?: {
    name: string;
    email: string;
  };
}) {
  const navigate = useNavigate();

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <User
          as="button"
          avatarProps={{
            isBordered: true,
            src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
            size: "sm",
            color: "success",
          }}
          className="transition-transform"
          classNames={{
            name: "font-montserrat font-semibold text-gray-900 dark:text-white",
            description: "font-nunito text-gray-600 dark:text-gray-500",
          }}
          description={user?.email}
          name={user?.name}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem key="settings">Profile</DropdownItem>
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

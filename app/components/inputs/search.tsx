import { Input } from "@nextui-org/react";
import { useNavigate, useSearchParams } from "@remix-run/react";

export default function SearchInput() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchText = searchParams.get("search_term");

  return (
    <Input
      classNames={{
        base: "max-w-xs font-nunito text-sm",
        inputWrapper:
          "bg-opacity-90 dark:bg-slate-900 dark:border border-white/20",
      }}
      variant="flat"
      radius="md"
      placeholder="Search here..."
      onValueChange={(text: string) => navigate(`?search_term=${text}`)}
      defaultValue={searchText}
      isClearable
      aria-labelledby="Search input"
    />
  );
}

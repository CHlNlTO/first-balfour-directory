import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import avatar from "@/app/assets/faith-logo.png";

export function AccountDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-800"
          size="icon"
          variant="ghost"
        >
          <Image
            alt="Avatar"
            className="rounded-full"
            height="32"
            src={avatar}
            style={{
              aspectRatio: "32/32",
              objectFit: "cover",
            }}
            width="24"
          />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem>Toggle Dark Mode</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

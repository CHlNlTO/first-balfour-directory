import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import AddIcon from "@/app/assets/AddIcon"

export function AddDataDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <Button className="ml-auto h-8 w-8" size="icon" variant="outline">
        <AddIcon className="h-4 w-4" />
        <span className="sr-only">Add data</span>
      </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Add an item</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Person</DropdownMenuItem>
        <DropdownMenuItem>Worksheet</DropdownMenuItem>
        <DropdownMenuItem>Spreadsheet</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

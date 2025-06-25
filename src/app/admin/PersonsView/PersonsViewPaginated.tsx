// src/app/admin/PersonsView/PersonsViewPaginated.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowDownNarrowWide,
  ArrowUpDown,
  Check,
  CheckCircle2Icon,
  CircleX,
  Filter,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddPersonCard } from "@/app/admin/components/AddPersonCard";
import { LoadingButton } from "@/components/ui/loading-button";
import { EditPersonCard } from "../components/EditPersonCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { ReorderTable } from "../components/ReorderTable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import SearchIcon from "@/app/assets/SearchIcon";
import PencilIcon from "@/app/assets/PencilIcon";
import { Button } from "@/components/ui/button";
import TrashIcon from "@/app/assets/TrashIcon";
import { Input } from "@/components/ui/input";
import {
  deletePerson,
  fetchDepartments,
  fetchPersons,
  fetchPositions,
} from "@/lib/api";
import { Departments, Persons, Positions } from "@/lib/types";
import { useState, useEffect, useMemo } from "react";
import { useServerPagination } from "@/hooks/useServerPagination";
import { generatePageNumbers } from "@/lib/pagination";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";

export function PersonsViewPaginated({
  positions,
  departments,
  setPositions,
  setDepartments,
  maxId: _maxId,
  setRefetchData,
}: {
  positions: Positions[];
  departments: Departments[];
  setPositions: (positions: Positions[]) => void;
  setDepartments: (departments: Departments[]) => void;
  maxId: number;
  setRefetchData: (refetch: boolean) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<string>("");
  const [filterPosition, setFilterPosition] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [openReorder, setOpenReorder] = useState(false);
  const [openAddCard, setOpenAddCard] = useState(false);
  const [openEditId, setOpenEditId] = useState<string | null>(null);
  const [openDeleteId, setOpenDeleteId] = useState<string | null>(null);
  const [loadDelete, setLoadDelete] = useState<boolean>(false);
  const [maxId, setMaxId] = useState(0);

  const { toast } = useToast();

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Server-side pagination hook
  const {
    data: persons,
    loading,
    error,
    pagination,
    goToPage,
    goToNextPage,
    goToPrevPage,
    changePageSize,
    refetch,
  } = useServerPagination({
    initialPageSize: 10,
    search: debouncedSearch,
    department: filterDepartment,
    position: filterPosition,
    sortBy,
    sortOrder,
  });

  // Calculate maxId from all persons (need to fetch all for this)
  useEffect(() => {
    const calculateMaxId = async () => {
      try {
        const allPersons = await fetchPersons(); // Get all persons
        const calculatedMaxId = allPersons.reduce((max, person) => {
          const idNumber = parseInt(person.id, 10);
          return !isNaN(idNumber) && idNumber > max ? idNumber : max;
        }, 0);
        setMaxId(calculatedMaxId);
      } catch (error) {
        console.error("Error calculating maxId:", error);
        setMaxId(0);
      }
    };

    calculateMaxId();
  }, []);

  // Refresh data when operations complete
  useEffect(() => {
    if (setRefetchData) {
      setRefetchData(false); // Reset the refetch flag
      refetch();
    }
  }, [setRefetchData, refetch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterDepartment = (department: string) => {
    setFilterDepartment(department);
  };

  const handleFilterPosition = (position: string) => {
    setFilterPosition(position);
  };

  const handleSort = (option: string) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(option);
      setSortOrder("asc");
    }
  };

  const handleOpenEditDialog = (personId: string) => {
    setOpenEditId(personId);
  };

  const handleCloseEditDialog = () => {
    setOpenEditId(null);
  };

  const handleOpenDeleteDialog = (personId: string) => {
    setOpenDeleteId(personId);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteId(null);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilterDepartment("");
    setFilterPosition("");
    setSortBy("id");
    setSortOrder("asc");
  };

  const handleToast = () => {
    toast({
      description: "Copied to clipboard.",
    });
  };

  async function handleDelete(person: Persons) {
    setLoadDelete(true);
    try {
      await deletePerson(person);
      refetch(); // Refresh the current page
      toast({ description: "Person removed successfully" });
    } catch (error) {
      toast({
        description: "Failed to delete person",
        variant: "destructive",
      });
    } finally {
      setLoadDelete(false);
      setOpenDeleteId(null);
    }
  }

  const isFiltered =
    searchTerm || filterDepartment || filterPosition || sortBy !== "id";

  // Generate page numbers for pagination
  const pageNumbers = generatePageNumbers(
    pagination.page,
    pagination.totalPages
  );

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading data: {error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-6 overflow-x-auto">
      {/* Search and Filter Controls */}
      <div className="flex items-center justify-around gap-3 p-1">
        <div className="w-full flex flex-col sm:flex-row ml-0 sm:ml-0 items-center gap-3 ">
          {/*Search Input*/}
          <div className="relative w-full sm:max-w-72">
            <SearchIcon className="absolute left-2.5 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              className="w-full appearance-none bg-white pl-8 shadow-none dark:bg-gray-950"
              placeholder={`Search from ${pagination.total} persons...`}
              type="text"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="flex flex-row justify-around gap-3 w-full">
            {/*Filter Dropdown*/}
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  {positions.length === 0 && departments.length === 0 ? (
                    <LoadingButton
                      variant="outline"
                      loading={true}
                      className="h-10 px-4 py-2"
                    >
                      Filter
                    </LoadingButton>
                  ) : (
                    <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                      <Filter className="flex sm:absolute sm:left-3 sm:top-3 h-4 w-4 text-primary dark:text-secondary" />
                      <div className="pl-5 hidden sm:flex">Filter</div>
                    </div>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <DropdownMenuLabel className="text-start">
                          Department
                        </DropdownMenuLabel>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <ScrollArea className="h-72 rounded-md">
                          <DropdownMenuItem
                            className="flex flex-row items-center pl-1 gap-1"
                            onClick={() => handleFilterDepartment("")}
                          >
                            {filterDepartment === "" ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <div className="w-[13px]"></div>
                            )}
                            All Departments
                          </DropdownMenuItem>
                          {departments.map((department) => (
                            <DropdownMenuItem
                              className="flex flex-row items-center pl-1 gap-1"
                              key={department.name}
                              onClick={() =>
                                handleFilterDepartment(department.name)
                              }
                            >
                              {filterDepartment === department.name ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <div className="w-[13px]"></div>
                              )}
                              {department.name}
                            </DropdownMenuItem>
                          ))}
                        </ScrollArea>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <DropdownMenuLabel className="text-start">
                          Position
                        </DropdownMenuLabel>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <ScrollArea className="h-72 rounded-md">
                          <DropdownMenuItem
                            className="flex flex-row items-center pl-1 gap-1"
                            onClick={() => handleFilterPosition("")}
                          >
                            {filterPosition === "" ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <div className="w-[13px]"></div>
                            )}
                            All Positions
                          </DropdownMenuItem>
                          {positions.map((position) => (
                            <DropdownMenuItem
                              className="flex flex-row items-center pl-1 gap-1"
                              key={position.name}
                              onClick={() =>
                                handleFilterPosition(position.name)
                              }
                            >
                              {filterPosition === position.name ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <div className="w-[13px]"></div>
                              )}
                              {position.name}
                            </DropdownMenuItem>
                          ))}
                        </ScrollArea>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/*Sort Button*/}
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                    <ArrowDownNarrowWide className="flex sm:absolute sm:left-3 sm:top-3 h-4 w-4 text-primary dark:text-secondary" />
                    <div className="pl-5 hidden sm:flex">Sort</div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="font-semibold "
                      onClick={() => handleSort("id")}
                    >
                      ID {sortBy === "id" && (sortOrder === "asc" ? "↑" : "↓")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="font-semibold "
                      onClick={() => handleSort("name")}
                    >
                      A-Z{" "}
                      {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="font-semibold "
                      onClick={() => handleSort("department")}
                    >
                      Department{" "}
                      {sortBy === "department" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="font-semibold "
                      onClick={() => handleSort("position")}
                    >
                      Position{" "}
                      {sortBy === "position" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/*Reset Button*/}
            <div>
              {isFiltered ? (
                <Button variant="outline" onClick={handleReset}>
                  <X className="flex mr-0 sm:mr-2 h-4 w-4 text-primary dark:text-secondary px-0" />
                  <span className="hidden sm:flex">Reset</span>
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  <X className="flex mr-0 sm:mr-2 h-4 w-4 text-primary dark:text-secondary px-0" />
                  <span className="hidden sm:flex">Reset</span>
                </Button>
              )}
            </div>
            {/*Add Person Card*/}
            <Dialog open={openAddCard} onOpenChange={setOpenAddCard}>
              <DialogTrigger asChild>
                <Button className="hidden sm:flex ml-auto" size="sm">
                  Add Person
                </Button>
              </DialogTrigger>
              <DialogTrigger asChild>
                <Button className="flex sm:hidden ml-auto rounded-lg" size="sm">
                  <Plus className="w-3 h-3" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <AddPersonCard
                  maxId={maxId}
                  setRefetchData={() => refetch()}
                  open={openAddCard}
                  setOpen={setOpenAddCard}
                  positions={positions}
                  departments={departments}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Pagination Info and Page Size Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            {pagination.total === 0
              ? 0
              : (pagination.page - 1) * pagination.pageSize + 1}{" "}
            to{" "}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)}{" "}
            of {pagination.total} entries
            {isFiltered && (
              <span className="ml-1 text-blue-600">(filtered)</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="pageSize" className="text-sm">
            Rows per page:
          </Label>
          <Select
            value={pagination.pageSize.toString()}
            onValueChange={(value) => changePageSize(parseInt(value))}
          >
            <SelectTrigger className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/*Table View*/}
      <div className="border shadow-sm rounded-lg overflow-auto">
        <Table className="overflow-x-auto">
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Nickname</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Photo</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <>
                {[...Array(pagination.pageSize)].map((_, index) => (
                  <TableRow key={index}>
                    {[...Array(9)].map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <LoadingSkeleton />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : persons.length !== 0 ? (
              persons.map((person: Persons, index: number) => (
                <TableRow key={person.id}>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        person.firstName + " " + person.lastName
                      );
                      handleToast();
                    }}
                  >
                    {person.firstName}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        person.firstName + " " + person.lastName
                      );
                      handleToast();
                    }}
                  >
                    {person.lastName}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(person.nickName);
                      handleToast();
                    }}
                  >
                    {person.nickName}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(person.position);
                      handleToast();
                    }}
                  >
                    {person.position}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(person.department);
                      handleToast();
                    }}
                  >
                    {person.department}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(`mailto:${person.email}`);
                      handleToast();
                    }}
                  >
                    {person.email}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(`tel:0${person.phone}`);
                      handleToast();
                    }}
                  >
                    {person.phone.length !== 0
                      ? "0" + person.phone.toString()
                      : ""}
                  </TableCell>
                  <TableCell className="h-full flex justify-center items-center cursor-pointer">
                    {person.url === "" ? (
                      <CircleX className="text-red-600 w-5 h-6" />
                    ) : (
                      <Link href={`${person.url}`}>
                        <CheckCircle2Icon className="text-green-600 w-5 h-6" />
                      </Link>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {/*Edit Card*/}
                      <Dialog
                        key={person.id}
                        open={openEditId === person.id}
                        onOpenChange={(isOpen) =>
                          isOpen
                            ? handleOpenEditDialog(person.id)
                            : handleCloseEditDialog()
                        }
                      >
                        <DialogTrigger asChild>
                          <PencilIcon className="w-4 h-4 hover:text-yellow-600 cursor-pointer" />
                        </DialogTrigger>
                        <DialogContent>
                          <EditPersonCard
                            person={person}
                            setRefetchData={() => refetch()}
                            setOpen={setOpenEditId}
                            positions={positions}
                            departments={departments}
                          />
                        </DialogContent>
                      </Dialog>
                      {/*Delete Card*/}
                      <Dialog
                        open={openDeleteId === person.id}
                        onOpenChange={(isOpen) =>
                          isOpen
                            ? handleOpenDeleteDialog(person.id)
                            : handleCloseDeleteDialog()
                        }
                      >
                        <DialogTrigger asChild>
                          <TrashIcon className="w-4 h-4 hover:text-red-600 cursor-pointer" />
                        </DialogTrigger>
                        <DialogContent className="p-4">
                          <DialogHeader>
                            <DialogTitle>Delete Person</DialogTitle>
                          </DialogHeader>
                          <DialogDescription>
                            Are you sure you want to delete this person?
                          </DialogDescription>
                          <DialogFooter className="flex flex-row justify-end gap-1">
                            <LoadingButton
                              loading={loadDelete}
                              onClick={() => handleDelete(person)}
                            >
                              Delete
                            </LoadingButton>
                            <DialogTrigger asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogTrigger>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    goToPrevPage();
                  }}
                  className={
                    !pagination.hasPrev
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {pageNumbers.map((pageNumber, index) => (
                <PaginationItem key={index}>
                  {pageNumber === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(pageNumber as number);
                      }}
                      isActive={pagination.page === pageNumber}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault();
                    goToNextPage();
                  }}
                  className={
                    !pagination.hasNext
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

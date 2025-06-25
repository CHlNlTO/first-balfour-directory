// src/app/admin/components/DirectoryPreviewPaginated.tsx - Final Fixed Version
"use client";

import Image from "next/image";
import { Departments, Persons, Positions } from "@/lib/types";
import React, { useState, useEffect } from "react";
import {
  ArrowDownNarrowWide,
  Check,
  Filter,
  MailIcon,
  Phone,
  User,
  UserRound,
  X,
} from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
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
import SearchIcon from "@/app/assets/SearchIcon";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useServerPagination } from "@/hooks/useServerPagination";
import { generatePageNumbers } from "@/lib/pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { LoadingButton } from "@/components/ui/loading-button";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverClose, PopoverTrigger } from "@radix-ui/react-popover";

export function DirectoryPreviewPaginated({
  positions,
  departments,
  setPositions,
  setDepartments,
}: {
  positions: Positions[];
  departments: Departments[];
  setPositions: (positions: Positions[]) => void;
  setDepartments: (departments: Departments[]) => void;
}) {
  const { toast } = useToast();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<string>("");
  const [filterPosition, setFilterPosition] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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
  } = useServerPagination({
    initialPageSize: 12,
    search: debouncedSearch,
    department: filterDepartment,
    position: filterPosition,
    sortBy,
    sortOrder,
  });

  // Event handlers
  const handleToast = () => {
    toast({
      description: "Copied to clipboard.",
    });
  };

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

  const handleReset = () => {
    setSearchTerm("");
    setFilterDepartment("");
    setFilterPosition("");
    setSortBy("id");
    setSortOrder("asc");
  };

  // Computed values
  const isFiltered =
    searchTerm || filterDepartment || filterPosition || sortBy !== "id";
  const pageNumbers = generatePageNumbers(
    pagination.page,
    pagination.totalPages
  );

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading data: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search and Filter Controls */}
      <div className="w-full flex flex-row ml-0 sm:ml-6 items-center gap-3">
        <div className="relative">
          <SearchIcon className="absolute left-2.5 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            className="w-full appearance-none bg-white pl-8 shadow-none dark:bg-gray-950"
            placeholder="Search a person..."
            type="text"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {positions.length === 0 && departments.length === 0 ? (
                <LoadingButton
                  variant="outline"
                  loading={true}
                  className="h-10 px-4 py-2"
                >
                  Filter
                </LoadingButton>
              ) : (
                <Button variant="outline" className="h-10 px-4 py-2">
                  <Filter className="flex mr-0 sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:flex">Filter</span>
                </Button>
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
                          onClick={() => handleFilterPosition(position.name)}
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

        {/* Sort Dropdown */}
        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {positions.length === 0 && departments.length === 0 ? (
                <LoadingButton
                  variant="outline"
                  loading={true}
                  className="h-10 px-4 py-2"
                >
                  Sort
                </LoadingButton>
              ) : (
                <Button variant="outline" className="h-10 px-4 py-2">
                  <ArrowDownNarrowWide className="flex mr-0 sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:flex">Sort</span>
                </Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="font-semibold"
                  onClick={() => handleSort("id")}
                >
                  ID {sortBy === "id" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="font-semibold"
                  onClick={() => handleSort("name")}
                >
                  A-Z {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="font-semibold"
                  onClick={() => handleSort("department")}
                >
                  Department{" "}
                  {sortBy === "department" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="font-semibold"
                  onClick={() => handleSort("position")}
                >
                  Position{" "}
                  {sortBy === "position" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Reset Button */}
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
      </div>

      {/* Pagination Info and Page Size Selector */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          {pagination.total === 0
            ? 0
            : (pagination.page - 1) * pagination.pageSize + 1}{" "}
          to {Math.min(pagination.page * pagination.pageSize, pagination.total)}{" "}
          of {pagination.total} people
          {isFiltered && <span className="ml-1 text-blue-600">(filtered)</span>}
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="pageSize" className="text-sm">
            Cards per page:
          </Label>
          <Select
            value={pagination.pageSize.toString()}
            onValueChange={(value) => changePageSize(parseInt(value))}
          >
            <SelectTrigger className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="48">48</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="flex flex-wrap gap-3 sm:gap-6 max-w-full overflow-y-auto justify-around py-4">
        {loading ? (
          // Loading skeletons
          [...Array(pagination.pageSize)].map((_, index) => (
            <Card
              key={index}
              className="w-[210px] sm:w-[250px] md:w-[300px] p-3 flex flex-col gap-2 hover:shadow-xl transition duration-200 shadow-input"
            >
              <Skeleton className="w-full h-48 bg-gray-100" />
              <div className="flex flex-col gap-1">
                <Skeleton className="w-36 h-8" />
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-28 h-4" />
                <Skeleton className="w-20 h-4" />
              </div>
            </Card>
          ))
        ) : persons.length > 0 ? (
          // Person cards with simple click handlers (no Popover to avoid nested buttons)
          persons.map((person: Persons) => (
            <Popover key={person.id}>
              <PopoverTrigger asChild>
                <Card className="w-[210px] sm:w-[250px] md:w-[300px] p-3 flex flex-col gap-2 hover:shadow-xl transition duration-200 shadow-input cursor-pointer">
                  {person.url === "" ? (
                    <div className="relative">
                      <UserRound
                        size={100}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <div className="w-full h-48 bg-gray-100"></div>
                    </div>
                  ) : (
                    <Image
                      width={200}
                      height={300}
                      src={person.url}
                      alt={`${person.firstName} ${person.lastName}`}
                      className="w-full h-48 object-cover bg-gray-100"
                      style={{
                        objectPosition: "50% 20%",
                        objectFit: "contain",
                      }}
                    />
                  )}
                  <div className="flex flex-col">
                    <CardTitle className="text-[10px] sm:text-lg">
                      {person.firstName} {person.lastName}
                    </CardTitle>
                    <CardDescription className="text-[8px] sm:text-sm">
                      {person.nickName}
                    </CardDescription>
                    <CardDescription className="text-[8px] sm:text-sm">
                      {person.position}
                    </CardDescription>
                    <CardDescription className="text-[8px] sm:text-sm">
                      {person.department}
                    </CardDescription>
                    <CardDescription className="text-[8px] sm:text-sm">
                      {person.email}
                    </CardDescription>
                    <CardDescription className="text-[8px] sm:text-sm">
                      {person.phone.length !== 0
                        ? "0" + person.phone.toString()
                        : ""}
                    </CardDescription>
                  </div>
                </Card>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <Label className="px-2 py-1.5 text-sm font-semibold">
                  Click to copy
                </Label>
                <Separator className="-mx-1 my-1 h-px bg-muted" />
                <div>
                  <button
                    className="flex flex-row justify-start items-center w-full cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        person.firstName + " " + person.lastName
                      );
                      handleToast();
                    }}
                  >
                    <PopoverClose className="flex flex-row justify-start items-center w-full cursor-pointer">
                      <div className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Name
                      </div>
                    </PopoverClose>
                  </button>
                  <button
                    className="flex flex-row justify-center items-center w-full cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(person.email);
                      handleToast();
                    }}
                  >
                    <PopoverClose className="flex flex-row justify-start items-center w-full cursor-pointer">
                      <div className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full cursor-pointer">
                        <MailIcon className="mr-2 h-4 w-4" />
                        Email
                      </div>
                    </PopoverClose>
                  </button>
                  <button
                    className="flex flex-row justify-center items-center w-full cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        person.phone.length !== 0
                          ? "0" + person.phone.toString()
                          : ""
                      );
                      handleToast();
                    }}
                  >
                    <PopoverClose className="flex flex-row justify-start items-center w-full cursor-pointer">
                      <div className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full cursor-pointer">
                        <Phone className="mr-2 h-4 w-4" />
                        Phone
                      </div>
                    </PopoverClose>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ))
        ) : (
          // No data state
          <div className="w-full text-center py-8">
            <p className="text-muted-foreground">No people found.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
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

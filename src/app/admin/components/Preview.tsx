"use client";

import Image from "next/image";
import { Departments, Persons, Positions } from "@/lib/types";
import React, { useState } from "react";
import {
  ArrowDownNarrowWide,
  Check,
  Filter,
  Loader2,
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
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchIcon from "@/app/assets/SearchIcon";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PopoverClose } from "@radix-ui/react-popover";
import { LoadingButton } from "@/components/ui/loading-button";

export function DirectoryPreview({
  persons,
  loading,
  positions,
  departments,
  setPositions,
  setDepartments,
}: {
  persons: Persons[];
  loading: boolean;
  positions: Positions[];
  departments: Departments[];
  setPositions: (positions: Positions[]) => void;
  setDepartments: (departments: Departments[]) => void;
}) {
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<
    "id" | "name" | "department" | "position" | null
  >(null);
  const [filterPosition, setFilterPosition] = useState<string | null>(null);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);

  const handleToast = () => {
    toast({
      description: "Copied to clipboard.",
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (
      e.target.value === "" &&
      !filterDepartment &&
      !filterPosition &&
      !sortOrder
    ) {
      setIsFiltered(false);
    } else setIsFiltered(true);
  };

  const handleFilterDepartment = (department: string | null) => {
    setFilterDepartment(department);
    setIsFiltered(true);
  };

  const handleFilterPosition = (position: string | null) => {
    setFilterPosition(position);
    setIsFiltered(true);
  };

  const handleSort = (
    option: "id" | "name" | "department" | "position" | null
  ) => {
    setSortOrder(option);
    setIsFiltered(true);
  };

  const filteredPersons = persons.filter((person) => {
    const searchTerms = searchTerm.trim().toLowerCase().split(" ");
    const fullName = `${person.firstName.toLowerCase()} ${person.lastName.toLowerCase()}`;
    const matchesFirstName = searchTerms.every((term) =>
      person.firstName.toLowerCase().includes(term)
    );
    const matchesLastName = searchTerms.every((term) =>
      person.lastName.toLowerCase().includes(term)
    );
    const matchesFullName = searchTerms.every((term) =>
      fullName.includes(term)
    );
    const matchesDepartment =
      !filterDepartment || person.department === filterDepartment;
    const matchesPosition =
      !filterPosition || person.position === filterPosition;
    return (
      (matchesFirstName || matchesLastName || matchesFullName) &&
      matchesDepartment &&
      matchesPosition
    );
  });

  const sortedPersons = filteredPersons.slice().sort((a, b) => {
    if (sortOrder === "name") {
      return a.firstName.localeCompare(b.firstName);
    } else if (sortOrder === "department") {
      return a.department.localeCompare(b.department);
    } else if (sortOrder === "position") {
      return a.position.localeCompare(b.position);
    } else {
      return parseInt(a.id) - parseInt(b.id);
    }
  });

  const handleReset = () => {
    setSearchTerm("");
    setFilterDepartment(null);
    setFilterPosition(null);
    setSortOrder(null);
    setIsFiltered(false);
  };

  return (
    <div>
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
        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger>
              {positions.length === 0 && departments.length === 0 ? (
                <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pointer-events-none opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Filter
                </div>
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
                      {departments.map((department) => (
                        <DropdownMenuItem
                          className="flex flex-row items-center pl-1 gap-1"
                          key={department.name}
                          onClick={() =>
                            handleFilterDepartment(department.name)
                          }
                        >
                          {filterDepartment === department.name ? (
                            <>
                              <Check className="h-3 w-3" />
                            </>
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
                      {positions.map((position) => (
                        <DropdownMenuItem
                          className="flex flex-row items-center pl-1 gap-1"
                          key={position.name}
                          onClick={() => handleFilterPosition(position.name)}
                        >
                          {filterPosition === position.name ? (
                            <>
                              <Check className="h-3 w-3" />
                            </>
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
        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger>
              {positions.length === 0 && departments.length === 0 ? (
                <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pointer-events-none opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Sort
                </div>
              ) : (
                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                  <ArrowDownNarrowWide className="flex sm:absolute sm:left-3 sm:top-3 h-4 w-4 text-primary dark:text-secondary" />
                  <div className="pl-5 hidden sm:flex">Sort</div>
                </div>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="font-semibold "
                  onClick={() => handleSort("id")}
                >
                  ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="font-semibold "
                  onClick={() => handleSort("name")}
                >
                  A-Z
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="font-semibold "
                  onClick={() => handleSort("department")}
                >
                  Department
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="font-semibold "
                  onClick={() => handleSort("position")}
                >
                  Position
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {isFiltered ? (
          <div className="">
            <Button variant="outline" onClick={handleReset}>
              <X className="flex mr-0 sm:mr-2 h-4 w-4 text-primary dark:text-secondary px-0" />
              <span className="hidden sm:flex">Reset</span>
            </Button>
          </div>
        ) : (
          <div className="">
            <Button variant="outline" disabled>
              <X className="flex mr-0 sm:mr-2 h-4 w-4 text-primary dark:text-secondary px-0" />
              <span className="hidden sm:flex">Reset</span>
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3 sm:gap-6 max-w-full overflow-y-auto justify-around py-4">
        {loading ? (
          <>
            {[...Array(10)].map((_, index) => (
              <Card
                key={index}
                className="w-[210px] sm:w-[250px] md:w-[300px] p-3 flex flex-col gap-2 hover:shadow-xl transition duration-200 shadow-input"
              >
                <Skeleton className="w-full h-48 bg-gray-100" />
                <div className="flex flex-col gap-1">
                  <div className="flex flex-row gap-1">
                    <Skeleton className="w-36 h-8" />
                  </div>
                  <Skeleton className="w-16 h-4" />
                  <Skeleton className="w-20 h-4" />
                  <Skeleton className="w-28 h-4" />
                  <Skeleton className="w-20 h-4" />
                </div>
              </Card>
            ))}
          </>
        ) : (
          sortedPersons.map((person: Persons, index: number) => (
            <Popover key={index}>
              <PopoverTrigger asChild>
                <Card
                  key={index}
                  className="w-[210px] sm:w-[250px] md:w-[300px] p-3 flex flex-col gap-2 hover:shadow-xl transition duration-200 shadow-input m-auto"
                >
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
                      alt=""
                      className="w-full h-48 object-cover bg-gray-100"
                      style={{
                        objectPosition: "50% 20%",
                        objectFit: "contain",
                      }}
                    />
                  )}
                  <div className="flex flex-col">
                    <div className="flex flex-row gap-1">
                      <CardTitle className="text-[10px] sm:text-lg">
                        {person.firstName} {person.lastName}
                      </CardTitle>
                    </div>
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
                      {"0" + person.phone}
                    </CardDescription>
                  </div>
                </Card>
              </PopoverTrigger>
              <PopoverContent className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-56">
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
                      <div
                        className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full cursor-pointer"
                        tabIndex={-1}
                      >
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
                      <div
                        className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full cursor-pointer"
                        tabIndex={-1}
                      >
                        <MailIcon className="mr-2 h-4 w-4" />
                        Email
                      </div>
                    </PopoverClose>
                  </button>
                  <button
                    className="flex flex-row justify-center items-center w-full cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText("0" + person.phone);
                      handleToast();
                    }}
                  >
                    <PopoverClose className="flex flex-row justify-start items-center w-full cursor-pointer">
                      <div
                        className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full cursor-pointer"
                        tabIndex={-1}
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Phone
                      </div>
                    </PopoverClose>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ))
        )}
      </div>
    </div>
  );
}

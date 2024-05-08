"use client"

import Image from "next/image";
import { Persons } from "@/lib/types";
import React, { useEffect, useState } from "react";
import { departments, positions } from "@/lib/const";
import { ArrowDown01, ArrowDownAZ, Filter, MailIcon, Phone, User, UserRound, X } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/dropdown-menu"
import SearchIcon from "@/app/assets/SearchIcon";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export function DirectoryPreview({ persons, loading }: { persons: Persons[], loading: boolean}) {
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'id' | 'name' | null>(null);
  const [filterPosition, setFilterPosition] = useState<string | null>(null);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);

  const handleToast = () => {
    toast({
      description: "Copied to clipboard.",
    })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsFiltered(true);
  }

  const handleFilterDepartment = (department: string | null) => {
    setFilterDepartment(department);
    setIsFiltered(true);
  }

  const handleFilterPosition = (position: string | null) => {
    setFilterPosition(position);
    setIsFiltered(true);
  }

  const handleSort = () => {
    setSortOrder(order => (order === 'name' ? 'id' : 'name'));
    setIsFiltered(true);
  }

  console.log("persons: ", persons)

  const filteredPersons = persons.filter(person => {
    const searchTerms = searchTerm.trim().toLowerCase().split(" ");
    const fullName = `${person.firstName.toLowerCase()} ${person.lastName.toLowerCase()}`;
    const matchesFirstName = searchTerms.every(term => person.firstName.toLowerCase().includes(term));
    const matchesLastName = searchTerms.every(term => person.lastName.toLowerCase().includes(term));
    const matchesFullName = searchTerms.every(term => fullName.includes(term));
    const matchesDepartment = !filterDepartment || person.department === filterDepartment;
    const matchesPosition = !filterPosition || person.position === filterPosition;
    return (matchesFirstName || matchesLastName || matchesFullName) && matchesDepartment && matchesPosition;
  });

  const sortedPersons = sortOrder === 'name' ?
    filteredPersons.sort((a, b) => a.firstName.localeCompare(b.firstName)) :
    filteredPersons.sort((a, b) => parseInt(a.id) - parseInt(b.id));

  useEffect(() => {
    console.log("sortedPersons: ", sortedPersons)
  }, [sortedPersons])


  const handleReset = () => {
    setSearchTerm('');
    setFilterDepartment(null);
    setFilterPosition(null);
    setSortOrder(null);
    setIsFiltered(false);
  }

  return(
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
            <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              <DropdownMenuTrigger>
                <Filter className="flex sm:absolute sm:left-3 sm:top-3 h-4 w-4 text-primary dark:text-secondary" />
                <div className="pl-5 hidden sm:flex">Filter</div>
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <DropdownMenuLabel className="text-start">Department</DropdownMenuLabel>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <ScrollArea className="h-[240px] w-full rounded-md">
                      {departments.map(department => (
                        <DropdownMenuItem key={department} onClick={() => handleFilterDepartment(department)}>{department}</DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <DropdownMenuLabel className="text-start">Position</DropdownMenuLabel>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <ScrollArea className="h-[240px] w-full rounded-md">
                      {positions.map(position => (
                        <DropdownMenuItem key={position} onClick={() => handleFilterPosition(position)}>{position}</DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <Button variant="outline" onClick={handleSort}>
            {sortOrder === 'name' ? 
              (
              <>
                <ArrowDown01 className="flex mr-0 sm:mr-2 h-4 w-4 text-primary dark:text-secondary" />
                <span className="hidden sm:flex">Sort by ID</span>
              </>
              )
              :
              (
              <>
                <ArrowDownAZ className="flex mr-0 sm:mr-2 h-4 w-4 text-primary dark:text-secondary" />
                <span className="hidden sm:flex">Sort A-Z</span>
              </>
              )
            }     
          </Button>
        </div>
        {isFiltered ? 
          (
            <div className="">
              <Button variant="outline" onClick={handleReset}>
                <X className="flex mr-0 sm:mr-2 h-4 w-4 text-primary dark:text-secondary px-0" />
                <span className="hidden sm:flex">Reset</span>
              </Button>
            </div>
          )
          :
          (
            <div className="">
              <Button variant="outline" disabled>
                <X className="flex mr-0 sm:mr-2 h-4 w-4 text-primary dark:text-secondary px-0" />
                <span className="hidden sm:flex">Reset</span>
              </Button>
            </div>
          )
        }
      </div>
      <div className="flex flex-wrap gap-3 sm:gap-6 max-w-full overflow-y-auto justify-around py-4">
        {
          loading ? 
            (
              <>
                {[...Array(10)].map((_, index) => (
                  <Card key={index} className="w-[210px] sm:w-[250px] md:w-[300px] p-3 flex flex-col gap-2 hover:shadow-xl transition duration-200 shadow-input">
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
            )
            
            :
          sortedPersons.map((person: Persons, index: number) => 
            (
              <DropdownMenu key={index}>
                <DropdownMenuTrigger asChild>
                  <Card key={index} className="w-[210px] sm:w-[250px] md:w-[300px] p-3 flex flex-col gap-2 hover:shadow-xl transition duration-200 shadow-input m-auto">
                  {
                  
                    person.url === "" ? 
                    (
                      <div className="relative">
                        <UserRound size={100} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                        <div className="w-full h-48 bg-gray-100"></div>
                      </div>
                    )
                    :
                    (
                      <Image 
                      width={200}
                      height={300}
                      src={person.url} 
                      alt="" 
                      className="w-full h-48 object-cover bg-gray-100"
                      style={{ objectPosition: '50% 20%', objectFit: 'contain' }}
                      />
                    )
                  }
                  <div className="flex flex-col">
                    <div className="flex flex-row gap-1">
                      <CardTitle className="text-[10px] sm:text-lg">
                        {person.firstName}
                          {" "} 
                        {person.lastName}
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
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Click to copy</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup> 
                      <button className="flex flex-row justify-start items-center w-full cursor-pointer" onClick={() => {
                          navigator.clipboard.writeText(person.firstName + " " + person.lastName)
                          handleToast()
                        }
                        }>
                        <DropdownMenuItem className="w-full cursor-pointer"> 
                          <User className="mr-2 h-4 w-4" />
                          Name
                        </DropdownMenuItem>
                      </button>
                      <button className="flex flex-row justify-center items-center w-full cursor-pointer" onClick={() => {
                          navigator.clipboard.writeText(person.email)
                          handleToast()
                        }
                        }>
                        <DropdownMenuItem className="w-full cursor-pointer"> 
                          <MailIcon className="mr-2 h-4 w-4" />
                          Email
                        </DropdownMenuItem>
                      </button>  
                      <button className="flex flex-row justify-center items-center w-full cursor-pointer" onClick={() => {
                          navigator.clipboard.writeText("0" + person.phone)
                          handleToast()
                        }
                        }>
                        <DropdownMenuItem className="w-full cursor-pointer">
                          <Phone className="mr-2 h-4 w-4" />
                          Phone
                        </DropdownMenuItem>
                      </button>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          )
        }
      </div>
    </div>
  )

}
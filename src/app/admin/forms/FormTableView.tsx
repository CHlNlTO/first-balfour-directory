import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import PencilIcon from "@/app/assets/PencilIcon"
import TrashIcon from "@/app/assets/TrashIcon"
import LoadingSpinner from "./FomLoading"
import { AddPersonCard } from "@/app/admin/components/AddPersonCard"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
//import { Checkbox } from "@/components/ui/checkbox"
import { EditPersonCard } from "../components/EditPersonCard"
import { Persons } from "@/lib/types" 
import { ArrowDown01, ArrowDownAZ, CheckCircle2Icon, CircleX, Filter, Plus, X } from "lucide-react"
import { LoadingButton } from "@/components/ui/loading-button"
import SearchIcon from "@/app/assets/SearchIcon"
import { Input } from "@/components/ui/input"
import { departments, positions } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { deletePerson } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export function calculateMaxId(persons: Persons[]) {

  if (!persons || persons.length === 0) {
      return null;
  }

  let maxId = -Infinity;
  for (const person of persons) {
      const idNumber = parseInt(person.id, 10);
      if (!isNaN(idNumber) && idNumber > maxId) {
          maxId = idNumber;
      }
  }

  return maxId !== -Infinity ? maxId : null;
}

export function FormTableView({ persons, setPersons, loading, setLoading, maxId, setMaxId, setRefetchData }: { persons: Persons[], setPersons: (persons: Persons[]) => void, loading: boolean, setLoading: (loading: boolean) => void, maxId: number, setMaxId: (maxId: number) => void, setRefetchData: (refetch: boolean) => void} ) {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'id' | 'name' | null>(null);
  const [filterPosition, setFilterPosition] = useState<string | null>(null);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [loadDelete, setLoadDelete] = useState<boolean>(false);

  const { toast } = useToast();

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

  const handleReset = () => {
    setSearchTerm('');
    setFilterDepartment(null);
    setFilterPosition(null);
    setSortOrder(null);
    setIsFiltered(false);
  }

  async function handleDelete(person: Persons) {
    setLoadDelete(true);
    const response = await deletePerson(person);
    setRefetchData(true);
    setLoadDelete(false);
    console.log("Final Delete Response: ", response)
    toast({ description: "Person deleted from earth successfully" });
  }

  return (
    <div className="relative flex flex-col gap-6 overflow-x-auto">
      <div className="flex items-center justify-around gap-3 p-1">
      <div className="w-full flex flex-row ml-0 sm:ml-0 items-center gap-3 ">
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
                    {departments.map(department => (
                      <DropdownMenuItem key={department} onClick={() => handleFilterDepartment(department)}>{department}</DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <DropdownMenuLabel className="text-start">Position</DropdownMenuLabel>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <ScrollArea className="h-72 w-48 rounded-md">
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
        <Dialog>
          <DialogTrigger asChild>
            {
              loading ? 
                (
                  <LoadingButton className="ml-auto" loading={loading} >Loading...</LoadingButton>
                ) 
              :
                (
                  <>
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
                  </>
                )
            }
          </DialogTrigger>
          <DialogContent>
            <AddPersonCard maxId={maxId} persons={persons} setPersons={setPersons} setRefetchData={setRefetchData} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="border shadow-sm rounded-lg overflow-auto">
      <Table className="overflow-x-auto">
        <TableHeader>
          <TableRow>
            {/* <TableHead className="flex justify-center items-center"><Checkbox checked={checkAll} onCheckedChange={toggleAllChecks} /></TableHead> */}
            <TableHead className="w-[10px]">ID</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Photo</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {loading ? 
              (<>
                {[...Array(10)].map((_, index) => (
                  <TableRow key={index}>
                    {[...Array(10)].map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <LoadingSpinner />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                </>
              ) :
              sortedPersons.map((person: Persons, index: number) => (
                <TableRow key={index} className="">
                  {/* <TableCell>
                    <Checkbox 
                      checked={individualChecks[index]}
                      onCheckedChange={() => toggleIndividualCheck(index)} />
                  </TableCell> */}
                  <TableCell className="font-medium">{person.id}</TableCell>
                  <TableCell>{person.firstName}</TableCell>
                  <TableCell>{person.lastName}</TableCell>
                  <TableCell>{person.position}</TableCell>
                  <TableCell>{person.department}</TableCell>
                  <TableCell>
                    <button onClick={() => navigator.clipboard.writeText(`mailto:${person.email}`)}>
                      {person.email}
                    </button>
                  </TableCell>
                  <TableCell>
                    <button onClick={() => navigator.clipboard.writeText(`tel:0${person.phone}`)}>
                      {"0" + person.phone}
                    </button>
                  </TableCell>
                  <TableCell className="h-full flex  justify-center items-center ">
                    {
                      person.profile === "" ? 
                        (
                          <CircleX className="text-red-600 w-5 h-6" />
                        )
                      :
                        (
                          <Link href={`${person.profile}`}>
                            <CheckCircle2Icon className="text-green-600 w-5 h-6" />
                          </Link>
                        )
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <PencilIcon className="w-4 h-4 hover:text-yellow-600" />
                        </DialogTrigger>
                        <DialogContent>
                          <EditPersonCard person={person} setPersons={setPersons}/>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <TrashIcon className="w-4 h-4 hover:text-red-600" />
                        </DialogTrigger>
                        <DialogContent className="p-4">
                          <DialogHeader>
                            <DialogTitle>Delete Person</DialogTitle>
                          </DialogHeader>
                          <DialogDescription>
                            Are you sure you want to delete this person?
                          </DialogDescription>
                          <DialogFooter className="flex flex-row gap-1">
                            <LoadingButton loading={loadDelete} onClick={() => handleDelete(person)}>Delete</LoadingButton>
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
            }
        </TableBody>
      </Table>
    </div>

    </div>
  );
};

// const [checkAll, setCheckAll] = useState(false);
  // const [individualChecks, setIndividualChecks] = useState<boolean[]>(new Array(persons.length).fill(false));

  // const toggleIndividualCheck = (index: number): void => {
  //   const newIndividualChecks = [...individualChecks];
  //   newIndividualChecks[index] = !newIndividualChecks[index];
  //   setIndividualChecks(newIndividualChecks);
  // };

  // const toggleAllChecks = (): void => {
  //   const newCheckAll = !checkAll;
  //   setCheckAll(newCheckAll);
  //   setIndividualChecks(new Array(persons.length).fill(newCheckAll));
  // };

  // useEffect(() => {
  //   const url = "https://script.google.com/macros/s/AKfycbxLVjwE57WHNXEPPa5mTtRsMnRc-JL1Rn6YEG_1drOvkWcdSVJXTqfrC7wlpbqQuOh0vg/exec";

  //   const getPersons = async () => {
  //     try {
  //       const response = await fetch(url);
  //       const values = await response.json();
  //       sessionStorage.setItem("persons", JSON.stringify(values));
  //       setPersons(values);
  //       setLoading(false);
  //       const maxId = calculateMaxId(persons);
  //       setMaxId(maxId !== null ? maxId : 0);
  //       console.log("Persons: ", values)
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setLoading(false);
  //     }
  //   };

  //   if (loading && persons.length === 0) {
  //     getPersons();
  //   }
  // }, [persons, loading]);

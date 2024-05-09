import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowDown01, ArrowDownAZ, ArrowUpDown, Check, CheckCircle2Icon, CircleX, Filter, Plus, X } from "lucide-react"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { AddPersonCard } from "@/app/admin/components/AddPersonCard"
import { LoadingButton } from "@/components/ui/loading-button"
import { EditPersonCard } from "../components/EditPersonCard"
import { ReorderTable } from "../components/ReorderTable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { departments, positions } from "@/lib/const"
import { useToast } from "@/components/ui/use-toast"
import SearchIcon from "@/app/assets/SearchIcon"
import PencilIcon from "@/app/assets/PencilIcon"
import { Button } from "@/components/ui/button"
import TrashIcon from "@/app/assets/TrashIcon"
import { Input } from "@/components/ui/input"
import LoadingSkeleton from "./LoadingSkeleton"
import { deletePerson } from "@/lib/api"
import { Persons } from "@/lib/types"
import { useState } from "react"
import Link from "next/link"

export function PersonsView({ persons, setPersons, loading, maxId, setRefetchData }: { persons: Persons[], setPersons: (persons: Persons[]) => void, loading: boolean, maxId: number, setRefetchData: (refetch: boolean) => void} ) {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'id' | 'name' | null>(null);
  const [filterPosition, setFilterPosition] = useState<string | null>(null);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [loadDelete, setLoadDelete] = useState<boolean>(false);
  const [openAddCard, setOpenAddCard] = useState(false);
  const [openEditCard, setOpenEditCard] = useState(false);
  const [openReorder, setOpenReorder] = useState(false);

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
    toast({ description: "Person removed successfully" });
  }

  return (
    <div className="relative flex flex-col gap-6 overflow-x-auto">
      <div className="flex items-center justify-around gap-3 p-1">
      <div className="w-full flex flex-col sm:flex-row ml-0 sm:ml-0 items-center gap-3 ">
        {/*Search Input*/}
        <div className="relative w-full sm:max-w-72">
          <SearchIcon className="absolute left-2.5 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            className="w-full appearance-none bg-white pl-8 shadow-none dark:bg-gray-950"
            placeholder="Search a person..."
            type="text"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex flex-row justify-around gap-3 w-full">
          {/*Filter Dropdown*/}
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
                          <DropdownMenuItem className="flex flex-row items-center pl-1 gap-1" key={department} onClick={() => handleFilterDepartment(department)}>
                            {
                              filterDepartment === department ? 
                              ( <>
                                  <Check className="h-3 w-3"/>
                                </>
                              ) 
                              :
                              (
                                <div className="w-[13px]"></div>
                              )
                            }
                            {department}
                          </DropdownMenuItem>
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
                          <DropdownMenuItem className="flex flex-row items-center pl-1 gap-1" key={position} onClick={() => handleFilterPosition(position)}>
                          {
                            filterPosition === position ? 
                            ( <>
                                <Check className="h-3 w-3"/>
                              </>
                            ) 
                            :
                            (
                              <div className="w-[13px]"></div>
                            )
                          }
                          {position}
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
          {/*Reorder Table*/}
          <div>
              <Dialog open={openReorder} onOpenChange={setOpenReorder}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <ArrowUpDown className="flex mr-0 sm:mr-2 h-4 w-4 text-primary dark:text-secondary" />
                    <span className="hidden sm:flex">Reorder</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="flex justify-center items-center w-full max-w-[700px]">
                  <ReorderTable persons={persons} setPersons={setPersons} openReorder={openReorder} setOpenReorder={setOpenReorder} setRefetchData={setRefetchData} />
                </DialogContent>
              </Dialog>
          </div>
          {/*Reset Button*/}
          <div>
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
          {/*Add Person Card*/}
          <Dialog open={openAddCard} onOpenChange={setOpenAddCard}>
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
              <AddPersonCard maxId={maxId} setRefetchData={setRefetchData} open={openAddCard} setOpen={setOpenAddCard} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      </div>
      {/*Table View*/}
      <div className="border shadow-sm rounded-lg overflow-auto">
      <Table className="overflow-x-auto">
        <TableHeader>
          <TableRow>
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
                        <LoadingSkeleton />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                </>
              ) :
              sortedPersons.length !== 0 || sortedPersons !== undefined || sortedPersons !== null ?
              sortedPersons.map((person: Persons, index: number) => (
                <TableRow key={index} className="">
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
                      person.url === "" ? 
                        (
                          <CircleX className="text-red-600 w-5 h-6" />
                        )
                      :
                        (
                          <Link href={`${person.url}`}>
                            <CheckCircle2Icon className="text-green-600 w-5 h-6" />
                          </Link>
                        )
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog key={person.id}>
                        <DialogTrigger asChild>
                          <PencilIcon className="w-4 h-4 hover:text-yellow-600" />
                        </DialogTrigger>
                        <DialogContent>
                          <EditPersonCard person={person} setRefetchData={setRefetchData}open={openEditCard} setOpen={setOpenEditCard} />
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
                          <DialogFooter className="flex flex-row justify-end gap-1">
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
              )) :
              (
                <TableRow>
                  <TableCell colSpan={10} className="text-center">No data found.</TableCell>
                </TableRow>
              )
            }
        </TableBody>
      </Table>
    </div>

    </div>
  );
};
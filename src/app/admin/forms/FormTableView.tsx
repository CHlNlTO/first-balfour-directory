import { Button } from "@/components/ui/button"
import PencilIcon from "@/app/assets/PencilIcon"
import TrashIcon from "@/app/assets/TrashIcon"
import { useEffect, useState } from "react"
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
import { EditPersonCard } from "../components/EditPersonCard"
import { Checkbox } from "@/components/ui/checkbox"
import { Persons } from "@/lib/types" 
import Link from "next/link"
import { BadgeCheck, CheckCheck, CheckCircle2Icon, CheckCircleIcon, CheckIcon, CircleX } from "lucide-react"
import { LoadingButton } from "@/components/ui/loading-button"

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

export function FormTableView({ persons, setPersons, loading, setLoading, maxId, setMaxId }: { persons: Persons[], setPersons: (persons: Persons[]) => void, loading: boolean, setLoading: (loading: boolean) => void, maxId: number, setMaxId: (maxId: number) => void}) {
  
  const [checkAll, setCheckAll] = useState(false);
  const [individualChecks, setIndividualChecks] = useState<boolean[]>(new Array(persons.length).fill(false));

  const toggleIndividualCheck = (index: number): void => {
    const newIndividualChecks = [...individualChecks];
    newIndividualChecks[index] = !newIndividualChecks[index];
    setIndividualChecks(newIndividualChecks);
  };

  const toggleAllChecks = (): void => {
    const newCheckAll = !checkAll;
    setCheckAll(newCheckAll);
    setIndividualChecks(new Array(persons.length).fill(newCheckAll));
  };

  useEffect(() => {
    const url = "https://script.google.com/macros/s/AKfycbxLVjwE57WHNXEPPa5mTtRsMnRc-JL1Rn6YEG_1drOvkWcdSVJXTqfrC7wlpbqQuOh0vg/exec";

    const getPersons = async () => {
      try {
        const response = await fetch(url);
        const values = await response.json();
        sessionStorage.setItem("persons", JSON.stringify(values));
        setPersons(values);
        setLoading(false);
        const maxId = calculateMaxId(persons);
        setMaxId(maxId !== null ? maxId : 0);
        console.log("Persons: ", values)
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    if (loading && persons.length === 0) {
      getPersons();
    }
  }, [persons, loading]);

  return (
    <div className="relative flex flex-col gap-6 overflow-x-auto">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Directory</h1>
        <Dialog>
          <DialogTrigger asChild>
            {
              loading ? 
                (
                  <LoadingButton className="ml-auto" loading={loading} >Loading...</LoadingButton>
                ) 
              :
                (
                  <Button className="ml-auto" size="sm">Add Person</Button>
                )
            }
          </DialogTrigger>
          <DialogContent>
            <AddPersonCard maxId={maxId} persons={persons} setPersons={setPersons} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="border shadow-sm rounded-lg overflow-auto">
      <Table className="overflow-x-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="flex justify-center items-center"><Checkbox checked={checkAll} onCheckedChange={toggleAllChecks} /></TableHead>
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
              Array.isArray(persons) && persons.map((person: Persons, index: number) => (
                <TableRow key={parseInt(person.id)} className="">
                  <TableCell>
                    <Checkbox 
                      checked={individualChecks[index]}
                      onCheckedChange={() => toggleIndividualCheck(index)} />
                  </TableCell>
                  <TableCell className="font-medium">{person.id}</TableCell>
                  <TableCell>{person.firstName}</TableCell>
                  <TableCell>{person.lastName}</TableCell>
                  <TableCell>{person.position}</TableCell>
                  <TableCell>{person.department}</TableCell>
                  <TableCell>{person.email}</TableCell>
                  <TableCell>{person.phone}</TableCell>
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
                          <DialogFooter>
                            <Button>Delete</Button>
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
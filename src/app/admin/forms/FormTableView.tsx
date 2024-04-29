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

export interface Persons {
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  email: string;
  phone: string;
}

export function FormTableView() {
  
  const [data, setData] = useState<Persons[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = "https://script.google.com/macros/s/AKfycbx6VNmWi9VtM3ZX8cpCftDyh8nRdVL3UZJGq57prOk3JI6uJ2E_eiC0DyE5OzSUJG9aHQ/exec"
    const getPersons = async () => {
      const response = await fetch(url);
      const values = await response.json();
      sessionStorage.setItem("data", JSON.stringify(values))
      setData(values)
      console.log(values)
      setLoading(false);
    }
    getPersons();

  }, [])

  return (
    <div className="relative flex flex-col gap-6 overflow-x-auto">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Directory</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="ml-auto" size="sm">Add Person</Button>
          </DialogTrigger>
          <DialogContent>
            <AddPersonCard setData={setData} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="border shadow-sm rounded-lg overflow-auto">
      <Table className="overflow-x-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="flex justify-center items-center"><Checkbox /></TableHead>
            <TableHead className="w-[10px]">ID</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Profile</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {loading ? 
              (<>
                <TableRow>
                  <TableCell >
                    <LoadingSpinner />
                  </TableCell>
                  <TableCell >
                    <LoadingSpinner />
                  </TableCell>  
                  <TableCell >
                    <LoadingSpinner />
                  </TableCell>  
                  <TableCell >
                    <LoadingSpinner />
                  </TableCell>  
                  <TableCell >
                    <LoadingSpinner />
                  </TableCell>  
                  <TableCell >
                    <LoadingSpinner />
                  </TableCell>  
                  <TableCell >
                    <LoadingSpinner />
                  </TableCell>  
                  <TableCell >
                    <LoadingSpinner />
                  </TableCell>  
                  <TableCell >
                    <LoadingSpinner />
                  </TableCell>
                  <TableCell >
                    <LoadingSpinner />
                  </TableCell>  
                </TableRow>

                </>
              ) :
              Array.isArray(data) && data.map((person: Persons, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-medium">{`00${index+1}`}</TableCell>
                  <TableCell>{person.firstName}</TableCell>
                  <TableCell>{person.lastName}</TableCell>
                  <TableCell>{person.position}</TableCell>
                  <TableCell>{person.department}</TableCell>
                  <TableCell>{person.email}</TableCell>
                  <TableCell>{`0${person.phone}`}</TableCell>
                  <TableCell>Uploaded</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <PencilIcon className="w-4 h-4 hover:text-yellow-600" />
                        </DialogTrigger>
                        <DialogContent>
                          <EditPersonCard person={person} setData={setData}/>
                        </DialogContent>
                      </Dialog>
                      <Dialog >
                        <DialogTrigger asChild>
                          <TrashIcon className="w-4 h-4 hover:text-red-600" />
                        </DialogTrigger>
                        <DialogContent>
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
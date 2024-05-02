import { z } from "zod"
import { formSchema } from "./validation";

export interface Persons {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  profile: string;
}

export interface AddPerson {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  profile: File;
}

export const departments = [ 
  "IT",
  "Finance",
  "Engineering",
  "Marketing",
  "HR",
  "Sales",
  "Operations",
  "Design",
] as const;

export const positions = [ 
  "CEO",
  "CFO",
  "CTO",
  "COO",
  "HR Manager",
  "Marketing",
  "Engineer",
  "Sales Rep",
  "Analyst",
  "Manager",
  "Developer",
  "Accountant",
  "Designer",
  "IT Manager",
] as const;




export type formType = z.infer<typeof formSchema>;
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
  "Customer Service", 
  "Finance and Accounting", 
  "Human Resources", 
  "IT", 
  "Operations", 
  "Quality Assurance", 
  "Legal", 
  "Sales" 
] as const;

export const positions = [
  "CEO",
  "President",
  "Vice President",
  "Secretary",
  "Manager",
] as const;

export type formType = z.infer<typeof formSchema>;
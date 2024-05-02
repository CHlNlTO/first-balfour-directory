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

export type formType = z.infer<typeof formSchema>;
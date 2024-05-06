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
  metadata: CellData | undefined;
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

interface CellData {
  value: string;
  row: number;
  column: number;
  cell: string;
}

export type formType = z.infer<typeof formSchema>;
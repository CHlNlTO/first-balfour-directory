import { Metadata } from "next";
import { Admin } from "@/app/admin/Admin";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin Page",
  keywords: "Admin, Directory",
};

export default function Page() {
  return (
    <Admin />
  );
}

import { Metadata } from "next";
import { Admin } from "@/app/admin/Admin";

export const metadata: Metadata = {
  title: "Admin",
};

export default function Page() {
  return (
    <Admin />
  );
}

"use client"

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { AccountDropdown } from "@/app/admin/components/AccountDropdown";
import { AddDataDropdown } from "./components/AddDataDropdown";
import Package2Icon from "@/app/assets/Package2Icon";
import AdminSideBar from "./components/SideBar";
import MainContainer from "./components/Main";
import { useState, useEffect } from "react";
import { LucideMenu } from "lucide-react";
import { Persons } from "@/lib/types";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import HomeIcon from "../assets/HomeIcon";
import PackageIcon from "../assets/PackageIcon";

interface IconProps {
  className?: string;
}

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

export function Admin() {
  const [activePage, setActivePage] = useState('')
  const [persons, setPersons] = useState<Persons[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxId, setMaxId] = useState(0);

  const handleSetActivePage = (pageName: string) => {
    setActivePage(pageName);
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
        console.log("Values: ", values)
        const maxId = calculateMaxId(values);
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
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 dark:bg-gray-800/40 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="#">
              <Package2Icon className="hidden sm:flex h-6 w-6" />
              <span >Admin</span>
            </Link>
            <AddDataDropdown />
          </div>
          <AdminSideBar activePage={activePage} setActivePage={setActivePage}/>
        </div>
      </div>
      <div className="flex flex-col overflow-x-auto">
        <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 lg:h-[60px]">
          <Link className="lg:hidden" href="#">
            <Sheet >
              <SheetTrigger>
                <LucideMenu className="flex lg:hidden h-6 w-6" />
              </SheetTrigger>
              <SheetContent side={'left'} className="flex flex-col gap-4">
                <SheetHeader>
                  <SheetTitle>
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <SheetClose className="flex flex-row gap-4 justify-start items-center" onClick={() => handleSetActivePage('preview')}>
                  <HomeIcon className="h-4 w-4" />
                  Preview
                </SheetClose>
                <SheetClose className="flex flex-row gap-4 justify-start items-center" onClick={() => handleSetActivePage('forms')}>
                  <PackageIcon className="h-4 w-4" />
                  Directory
                </SheetClose>
              </SheetContent>
            </Sheet>
            <Package2Icon className="hidden lg:flex h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  className="w-full appearance-none bg-white pl-8 shadow-none dark:bg-gray-950 md:w-2/3 lg:w-1/3"
                  placeholder="Search a person..."
                  type="search"
                />
              </div>
            </form>
          </div>
          <AccountDropdown />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <MainContainer activePage={activePage} persons={persons} setPersons={setPersons} loading={loading} setLoading={setLoading} maxId={maxId} setMaxId={setMaxId} />
        </main>
      </div>
    </div>
  );
}

function SearchIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
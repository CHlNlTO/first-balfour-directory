"use client"

import Link from "next/link";
import { Persons } from "@/lib/types";
import { fetchPersons } from "@/lib/api";
import { useState, useEffect } from "react";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AccountDropdown, handleLogout } from "@/app/admin/components/AccountDropdown";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import AdminSideBar from "@/app/admin/components/SideBar";
import MainContainer from "@/app/admin/components/Main";
import Package2Icon from "@/app/assets/Package2Icon";
import PackageIcon from "../assets/PackageIcon";
import HomeIcon from "../assets/HomeIcon";
import { LogOut, LucideMenu } from "lucide-react";
import { authorize } from "@/lib/login";

export function Admin() {
  const auth = authorize();

  const [activePage, setActivePage] = useState('preview')
  const [persons, setPersons] = useState<Persons[]>([]);
  const [loading, setLoading] = useState(true);
  const [refetchData, setRefetchData] = useState(true);
  const [maxId, setMaxId] = useState(0);

  const handleSetActivePage = (pageName: string) => {
    setActivePage(pageName);
  };

  function calculateMaxId(persons: Persons[]) {
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

  useEffect(() => {
    const getPersons = async (): Promise<Persons[]> => {
      try {
        const response: Persons[] = await fetchPersons();

        setPersons(response);
        setLoading(false);
        setRefetchData(false);

        const maxId = calculateMaxId(response);
        setMaxId(maxId !== null ? maxId : response.length);

        return response;
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        setRefetchData(false);
        return [];
      }
    };

    if (refetchData) {
      getPersons();
    }
  }, [persons, loading, refetchData]);

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 dark:bg-gray-800/40 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="/admin">
              <Package2Icon className="hidden sm:flex h-6 w-6" />
              <span>Admin</span>
            </Link>
          </div>
          <AdminSideBar activePage={activePage} setActivePage={setActivePage}/>
        </div>
      </div>
      <div className="flex flex-col overflow-x-auto">
        <header className="flex h-14 items-center justify-end gap-4 border-b bg-gray-100/40 px-3 lg:px-6 dark:bg-gray-800/40 lg:h-[60px]">
          <Sheet>
            <SheetTrigger>
              <LucideMenu className="flex lg:hidden h-6 w-6 mr-1" />
            </SheetTrigger>
            <SheetContent className="flex flex-col gap-4">
              <SheetHeader className="text-left">
                <SheetTitle>
                  <span>
                    Menu
                  </span>
                </SheetTitle>
              </SheetHeader>
              <SheetClose className="flex flex-row gap-4 justify-start items-center" onClick={() => handleSetActivePage('preview')}>
                <HomeIcon className="h-4 w-4" />
                  <span>
                    Preview
                  </span>
              </SheetClose>
              <SheetClose className="flex flex-row gap-4 justify-start items-center" onClick={() => handleSetActivePage('forms')}>
                <PackageIcon className="h-4 w-4" />
                  <span>
                    Directory
                  </span>
              </SheetClose>
              <DropdownMenuSeparator />
              <SheetClose className="flex flex-row gap-4 justify-start items-center" onClick={() => handleLogout()}>
                <LogOut className="h-4 w-4" />
                  <span>
                    Logout
                  </span>
              </SheetClose>
            </SheetContent>
          </Sheet>
            <span className="sr-only">
              Home
            </span>
          <div className="hidden lg:flex">
            <AccountDropdown />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <MainContainer activePage={activePage} persons={persons} setPersons={setPersons} loading={loading} maxId={maxId} refetchData={refetchData} setRefetchData={setRefetchData} />
        </main>
      </div>
    </div>
  );
}
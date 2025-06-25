"use client";

import Link from "next/link";
import { Persons, Positions, Departments } from "@/lib/types";
import { fetchDepartments, fetchPositions } from "@/lib/api";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AccountDropdown,
  handleLogout,
} from "@/app/admin/components/AccountDropdown";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import AdminSideBar from "@/app/admin/components/SideBar";
import MainContainer from "@/app/admin/components/Main";
import Package2Icon from "@/app/assets/Package2Icon";
import PackageIcon from "../assets/PackageIcon";
import HomeIcon from "../assets/HomeIcon";
import { LogOut, LucideMenu } from "lucide-react";
import { authorize } from "@/lib/login";

export function Admin() {
  // All hooks must be declared at the top level, before any conditional logic
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [activePage, setActivePage] = useState("preview");
  const [positions, setPositions] = useState<Positions[]>([]);
  const [departments, setDepartments] = useState<Departments[]>([]);
  const [loading, setLoading] = useState(false);
  const [refetchData, setRefetchData] = useState(false);

  const handleSetActivePage = (pageName: string) => {
    setActivePage(pageName);
  };

  // Handle client-side mounting and authorization
  useEffect(() => {
    setMounted(true);

    const checkAuth = async () => {
      try {
        const isAuthorized = await authorize();
        setAuthorized(isAuthorized);
      } catch (error) {
        console.error("Authorization check failed:", error);
        setAuthorized(false);
      }
    };

    checkAuth();
  }, []);

  // Only fetch positions and departments when authorized
  useEffect(() => {
    if (!authorized) return;

    const fetchFilters = async () => {
      try {
        const [positionsData, departmentsData] = await Promise.all([
          fetchPositions(),
          fetchDepartments(),
        ]);
        setPositions(positionsData);
        setDepartments(departmentsData);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    fetchFilters();
  }, [authorized]);

  // Don't render anything during SSR or while checking auth
  if (!mounted) {
    return null;
  }

  // Show loading or redirect if not authorized
  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Checking authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 dark:bg-gray-800/40 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link
              className="flex items-center gap-2 font-semibold"
              href="/admin"
            >
              <Package2Icon className="hidden sm:flex h-6 w-6" />
              <span>Admin</span>
            </Link>
          </div>
          <AdminSideBar activePage={activePage} setActivePage={setActivePage} />
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
                  <span>Menu</span>
                </SheetTitle>
              </SheetHeader>
              <SheetClose
                className="flex flex-row gap-4 justify-start items-center"
                onClick={() => handleSetActivePage("preview")}
              >
                <HomeIcon className="h-4 w-4" />
                <span>Preview</span>
              </SheetClose>
              <SheetClose
                className="flex flex-row gap-4 justify-start items-center"
                onClick={() => handleSetActivePage("forms")}
              >
                <PackageIcon className="h-4 w-4" />
                <span>Directory</span>
              </SheetClose>
              <DropdownMenuSeparator />
              <SheetClose
                className="flex flex-row gap-4 justify-start items-center"
                onClick={() => handleLogout()}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </SheetClose>
            </SheetContent>
          </Sheet>
          <span className="sr-only">Home</span>
          <div className="hidden lg:flex">
            <AccountDropdown />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <MainContainer
            activePage={activePage}
            positions={positions}
            departments={departments}
            setPositions={setPositions}
            setDepartments={setDepartments}
            loading={loading}
            maxId={0} // This will be calculated in the paginated components
            refetchData={refetchData}
            setRefetchData={setRefetchData}
          />
        </main>
      </div>
    </div>
  );
}

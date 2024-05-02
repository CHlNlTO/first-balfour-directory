import Link from "next/link"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AppWindow, BookUser, Home, LucideMenu, Phone } from "lucide-react";
import HomeIcon from "@/app/assets/HomeIcon";
import PackageIcon from "@/app/assets/PackageIcon";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white backdrop-blur-sm w-full">
      <h1 className="text-2xl font-bold cursor-pointer">First Balfour</h1>
      <nav className="flex items-center justify-center align-middle">
        <ul className="hidden md:flex items-center justify-center space-x-4">
          <Link href="/" className="flex justify-center items-center">
            <li className="flex justify-center items-center hover:underline">
              Home
            </li> 
          </Link>
          <Link href="/">
            <li className="hover:underline">
              About
            </li> 
          </Link>
          <Link href="/">
            <li className="hover:underline">
              Contact
            </li> 
          </Link>
          <Link href="/admin">
            <li className="hover:underline">
              Admin
            </li> 
          </Link>
        </ul>
        <Sheet>
          <SheetTrigger>
            <LucideMenu className="flex md:hidden h-6 w-6" />
          </SheetTrigger>
          <SheetContent className="flex flex-col gap-4">
            <SheetHeader>
              <SheetTitle>
                Menu
              </SheetTitle>
            </SheetHeader>
            <Link href="/" className="flex flex-row gap-4 justify-start items-center">
              <SheetClose className="flex flex-row gap-4 justify-start items-center">
                <Home className="h-4 w-4" />
                Home
              </SheetClose>
            </Link>
            <Link href="/" className="flex flex-row gap-4 justify-start items-center">
              <SheetClose className="flex flex-row gap-4 justify-start items-center">
                <BookUser className="h-4 w-4" />
                About
              </SheetClose>
            </Link>
            <Link href="/" className="flex flex-row gap-4 justify-start items-center">
              <SheetClose className="flex flex-row gap-4 justify-start items-center">
                <Phone className="h-4 w-4" />
                Contact
              </SheetClose>
            </Link>
            <Link href="/admin" className="flex flex-row gap-4 justify-start items-center">
              <SheetClose className="flex flex-row gap-4 justify-start items-center">
                <AppWindow className="h-4 w-4" />
                Admin
              </SheetClose>
            </Link>
            
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
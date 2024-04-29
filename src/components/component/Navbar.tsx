import Link from "next/link"

export default function Navbar() {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white backdrop-blur-sm w-full">
      <h1 className="text-2xl font-bold cursor-pointer">First Balfour</h1>
      <nav>
        <ul className="flex space-x-4">
          <Link href="/">
            <li className="hover:underline">
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
      </nav>
    </header>
  )
}
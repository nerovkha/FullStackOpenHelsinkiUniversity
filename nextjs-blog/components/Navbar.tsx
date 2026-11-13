import Link from "next/link"
import { auth, signOut } from "@/auth"

const Navbar = async () => {
  const session = await auth()

  return (
    <nav
      data-testid="navbar"
      className="flex items-center gap-4 bg-slate-800 px-6 py-3 text-slate-100"
    >
      <Link className="font-bold hover:underline" href="/">
        home
      </Link>
      <Link className="hover:underline" href="/blogs">
        blogs
      </Link>
      <Link className="hover:underline" href="/users">
        users
      </Link>
      {session?.user ? (
        <>
          <Link className="hover:underline" href="/me">
            me
          </Link>
          <form action={async () => {
            "use server"
            await signOut({ redirectTo: "/" })
          }}>
            <button className="hover:underline" type="submit">
              logout
            </button>
          </form>
        </>
      ) : (
        <>
          <Link className="hover:underline" href="/login">
            login
          </Link>
          <Link className="hover:underline" href="/register">
            register
          </Link>
        </>
      )}
    </nav>
  )
}

export default Navbar

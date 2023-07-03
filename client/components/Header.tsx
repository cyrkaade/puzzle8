import Link from "next/link";
import useRegisterModal from "../hooks/useRegisterModal";
import { User } from "@prisma/client";

interface HeaderProps {
  currentUser?: User | null
}

const Header: React.FC<HeaderProps> = ({
  currentUser,
}) => {
  const registerModal = useRegisterModal();
  console.log(currentUser)
  return (
    <header className="flex justify-between items-center w-full mt-5 border-b-2 pb-7 sm:px-4 px-2">
      <Link href="/" className="flex space-x-3">
        <img
          alt="header text"
          src="/writingIcon.png"
          className="sm:w-12 sm:h-12 w-8 h-8"
          width={32}
          height={32}
        />
        <h1 className="sm:text-4xl text-2xl font-bold ml-2 tracking-tight">
          puzzle8.me
        </h1>
      </Link>
      <button className="bg-black text-white rounded py-2 px-4" onClick={registerModal.onOpen}>
        Sign Up
      </button>
    </header>
  );
}

export default Header

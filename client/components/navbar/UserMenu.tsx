'use client';

import { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import useLoginModal from "../../hooks//useLoginModal";
import useRegisterModal from "../../hooks/useRegisterModal";

import MenuItem from "./MenuItem";
import { User } from "@prisma/client";
import Avatar from "../Avatar";

interface UserMenuProps {
    currentUser?: User | null
  }

  const UserMenu: React.FC<UserMenuProps> = ({
    currentUser
  }) => {
  const router = useRouter();

  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  return ( 
    <div className="relative">
      <div className="flex flex-row items-center gap-3 w-[200px] justify-end">

        <div 
        onClick={toggleOpen}
        className="
          p-4
          md:py-1
          md:px-2
          border-[1px] 
          border-neutral-200 
          flex 
          flex-row 
          items-center 
          gap-3 
          rounded-full 
          cursor-pointer 
          hover:shadow-md 
          transition
          "
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>
      {isOpen && (
        <div 
          className="
            absolute 
            rounded-xl 
            shadow-md
            w-[40vw]
            md:w-3/4 
            bg-white 
            overflow-hidden 
            right-0 
            top-12 
            text-sm
          "
        >
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
              <>
              <MenuItem
              label="Explore"
              onClick={() => router.push('/explore')}
            />
            <hr />
            <MenuItem
              label="Ranked"
              onClick={() => router.push('/ranked')}
            />
            <hr />

                <MenuItem 
                  label="My favorites" 
                  onClick={() => router.push('/favorites')}
                />
                <hr />
                <MenuItem 
                  label="Logout" 
                  onClick={() => signOut()}
                />
              </>
            ) : (
              <>
                <MenuItem 
                  label="Login" 
                  onClick={loginModal.onOpen}
                />
                <MenuItem 
                  label="Sign up" 
                  onClick={registerModal.onOpen}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
   );
}
 
export default UserMenu;
// import React, { useEffect, useState } from 'react';
// import { NextPage } from 'next';
// import Head from 'next/head';
// import { FaRegHeart } from 'react-icons/fa';

// interface FavoriteItemProps {
//   favorite: {
//     user_id: string;
//     puzzle: string;
//     created_at: string;
//   };
// }

// const FavoriteItem: React.FC<FavoriteItemProps> = ({ favorite }) => {
//   return (
//     <div className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border flex items-center">
//       <p>{favorite.puzzle}</p>
//     </div>
//   );
// };

// const Favorites: NextPage = () => {
//   const [favorites, setFavorites] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const API_URL = 'http://localhost:8000';

//   useEffect(() => {
//     fetch('/api/currentUser')
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.user) {
//           setCurrentUser(data.user);
//         } else {
//           console.error(data.error);
//         }
//       });
//   }, []);

//   useEffect(() => {
//     if (currentUser) {
//       //@ts-ignore
//       fetch(`${API_URL}/favorites/${currentUser.email}`)
//         .then((res) => res.json())
//         .then((data) => {
//           setFavorites(data);
//         });
//     }
// }, [currentUser]);

//   return (
    
//     <div className="flex flex-col items-center justify-center min-h-screen py-2">
//       <Head>
//         <title>Favorite Puzzles</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
//         Your Favorite Puzzles
//       </h1>
//       <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
//         {favorites.map((favorite, index) => (
//           <FavoriteItem favorite={favorite} key={index} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Favorites;


"use client"

import * as React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "../@/components/ui/button"
import { Checkbox } from "../@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../@/components/ui/dropdown-menu"
import { Input } from "../@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../@/components/ui/table"

import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import axios from "axios"
import Header from "../components/navbar/Header"
import { useTranslation } from "react-i18next"
import { GetServerSideProps } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"


interface FavoriteItemProps {
  favorite: {
    user_id: string;
    puzzle: string;
    puzzle_type: string;
  };
}

export type Favorite = {
  _id: string;
  user_id: string;
  puzzle: string;
  puzzle_type: string;
}


const API_URL = 'http://localhost:8000'; 

import { withClientSideRendering } from "../actions/withClientSideRendering"
import withUsername from "../actions/withUsername"
// import withUsername from "../actions/withUsername"
 
// export const columns: ColumnDef<Favorite>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={table.getIsAllPageRowsSelected()}
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => {
          
//           row.toggleSelected(!!value)
//         }}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   // {
//   //   accessorKey: "_id",
//   //   id: "_id",
//   //   header: "ID",
//   //   cell: ({ row }) => <div>{row.getValue("_id")}</div>,
//   // },
//     {
//       accessorKey: "puzzle_type",
//       header: t('puzzle_type'),
//       cell: ({ row }) => <div className="capitalize">{row.getValue("puzzle_type")}</div>,
//     },
//     {
//       accessorKey: "puzzle",
//       id: t('puzzle'),
//       header: "Puzzle",
//       cell: ({ row }) => <div>{row.getValue("puzzle")}</div>,
//     },
//   {
//     id: "actions",
//     enableHiding: false,
//     cell: ({ row }) => {
//       const puzzle = row.original
 
//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="bg-white">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(puzzle.puzzle)}
//             >
//               Copy puzzle
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     },
//   },
// ]
 
export function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [selectedRows, setSelectedRows] = useState<Favorite[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    username: string | null;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    hashedPassword: string | null;
    createdAt: Date;
    updatedAt: Date;
    rating: number;
    favoriteIds: string[];
    isUsernameSet: boolean | null;
    provider: string | null;
  } | null>(null);
  const [dataChanged, setDataChanged] = useState(false);
  let [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation('common');


  const columns: ColumnDef<Favorite>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            
            row.toggleSelected(!!value)
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    // {
    //   accessorKey: "_id",
    //   id: "_id",
    //   header: "ID",
    //   cell: ({ row }) => <div>{row.getValue("_id")}</div>,
    // },
      {
        accessorKey: "puzzle_type",
        header: t('puzzle_type'),
        cell: ({ row }) => <div className="capitalize">{row.getValue("puzzle_type")}</div>,
      },
      {
        accessorKey: "puzzle",
        id: 'puzzle',
        header: t('puzzle'),
        cell: ({ row }) => <div>{row.getValue("puzzle")}</div>,
      },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const puzzle = row.original
   
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t('open_menu')}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(puzzle.puzzle)}
              >
                {t('copy_puzzle')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  


  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }
  

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Log the rowSelection state to understand its structure
    console.log('rowSelection:', rowSelection);
    console.log(rowSelection)
  
    // Assuming rowSelection is an array of selected row objects
    setSelectedRows(Object.values(rowSelection));
  }, [rowSelection]);


  useEffect(() => {
    fetch('/api/currentUser')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
          // console.log
        } else {
          console.error(data.error);
        }
      });
  }, []);

  useEffect(() => {
    if (currentUser) {
      //@ts-ignore
      fetch(`${API_URL}/favorites/${currentUser.email}`)
        .then((res) => res.json())
        .then((data) => {
          setFavorites(data);
        });
    }
}, [currentUser, dataChanged]);




const deleteFavorites = async () => {
  const selectedFavoritesIds = Object.keys(rowSelection).map(index => favorites[+index]._id);

  for (let favoriteId of selectedFavoritesIds) {
    const response = await fetch(`${API_URL}/favorites/${favoriteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete favorite with ID ${favoriteId}`);
    }
  }
  closeModal();
  setDataChanged(!dataChanged);
}




  const table = useReactTable({
    data: favorites,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
 
  return (
    <div>
      {/* @ts-ignore */}
      <Header currentUser={currentUser}/>
    <div className="w-full">
      <div className="flex items-center py-4">
        {isMounted && (
          <Input
            placeholder={t('search')}
            value={(table.getColumn("puzzle")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("puzzle")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
        <Button variant="outline" 
        className={`ml-auto mr-20 sm:mr-80 ${selectedRows.length === 0 ? 'bg-black text-white cursor-not-allowed bg-opacity-60' : 'bg-black text-white hover:bg-opacity-80'}`} 
        onClick={selectedRows.length > 0 ? openModal : undefined}
        disabled={selectedRows.length === 0}>
              {t('delete')}
          </Button>
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {t('sure')}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {t('unreversible')}
                    </p>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-yellow-800 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"
                      onClick={deleteFavorites}
                    >
                      {t('delete')}
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black hover:bg-opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      {t('cancel')}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
        
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t('no_results')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} {t('of')}{" "}
          {table.getFilteredRowModel().rows.length} {t('rows_selected')}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t('previous')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t('next')}
          </Button>
        </div>
      </div>
    </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale as string, ['common']),
  },
});

const DataTableDemoWithClientSideRendering = withClientSideRendering(DataTableDemo);

export default withUsername(DataTableDemoWithClientSideRendering);
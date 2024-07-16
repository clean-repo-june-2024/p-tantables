'use client'

import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import data from '@/data/tracks.json' 
import { BiFilter } from "react-icons/bi";
import { rankItem } from "@tanstack/match-sorter-utils";

interface Track {
  name: string;
  artists: { name: string }[];
  album: string;
  umbrellaGenres?: string[];
  subGenres?: string[];
}

interface RowData {
  track: Track;
}

const App = () => {
  const [filterValue, setFilterValue] = useState('');

  const columns = useMemo<ColumnDef<RowData>[]>(
    () => [
      {
        accessorKey: 'track.name',
        header: 'Track',
        cell: ({ row }) => {
          const { name, artists, album } = row.original.track;
          return (
            <div>
              <div className='text-lg font-bold'>{name}</div>
              <div className='text-sm text-gray-500'>{artists.map(artist => artist.name).join(', ')}</div>
            </div>
          );
        },
      },
      {
        id: 'umbrellaGenres',
        accessorFn: row => row.track.umbrellaGenres?.join(', ') || '',
        header: ({ column }) => (
          <div className="flex items-center">
            Umbrella Genres
          </div>
        ),
        cell: ({ row }) => {
          const genres = row.original.track.umbrellaGenres || [];
          return <div>{genres.join(', ')}</div>;
        },
      },
      {
        id: 'subGenres',
        accessorFn: row => row.track.subGenres?.join(', ') || '',
        header: (data) => {
          console.log("data", data);
          return (
            <div className="flex items-center">
              Subgenres
            </div>
          )
        },
        cell: ({ row }) => {
          const subGenres = row.original.track.subGenres || [];
          return <div>{subGenres.join(', ')}</div>;
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn:'includesString',
    state: {
      globalFilter: filterValue,
    },
    onGlobalFilterChange: setFilterValue,
  });

  return (
    <div>
      <h1 className='text-4xl font-bold mb-4'>Track List</h1>
      <input
        type="text"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        placeholder="Filter tracks..."
        className="w-full p-2 mb-4 border border-gray-300 rounded text-background"
      />
      <div className="max-h-[70vh] overflow-y-auto">
        <table className="w-full table-fixed">
          <thead>
            <tr>
              <th className="w-1/3 text-left py-2 px-4">Track</th>
              <th className="w-1/3 text-left py-2 px-4">Umbrella Genres</th>
              <th className="w-1/3 text-left py-2 px-4">Subgenres</th>
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="py-2 px-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
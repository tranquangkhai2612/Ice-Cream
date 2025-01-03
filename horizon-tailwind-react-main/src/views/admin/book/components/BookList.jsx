import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "components/card";
import { Link } from "react-router-dom";
import {
  createColumnHelper,
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

const BookList = () => {
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

  const truncateStyle = {
    // whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100px",
    maxHeight: "60px",
    display: "inline-block",
  };

  const [sorting, setSorting] = React.useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/Book`);
      console.log(response.data);
      setData(response.data);
    };
    fetchData();
  }, []);
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this book?"
  );

  if (confirmDelete) {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/api/Book/${id}`
      );
      console.log("Book deleted:", response.data);
      // Remove the deleted order from the state
      setData(data.filter((order) => order.id !== id)); // Update the state with the remaining orders
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  }
};

  const columnHelper = createColumnHelper();
  const columns = [

    columnHelper.accessor("bookName", {
      id: "bookName",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">Book Name</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white" style={truncateStyle}>
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("bookDescription", {
      id: "bookDescription",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Book Description
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white" style={truncateStyle}>
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("price", {
        id: "price",
        header: () => (
          <p className="text-sm font-bold text-gray-600 dark:text-white">
            Price
          </p>
        ),
        cell: (info) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white" style={truncateStyle}>
            {info.getValue()}
          </p>
        ),
      }),
    columnHelper.accessor("bookDate", {
        id: "bookDate",
        header: () => (
          <p className="text-sm font-bold text-gray-600 dark:text-white">
            CreateAt
          </p>
        ),
        cell: (info) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {new Date(info.getValue()).toLocaleDateString()}
          </p>
        ),
      }),
    columnHelper.display({
      id: "actions",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Actions
        </p>
      ),
      cell: (info) => {
        const rowId = info.row.original.id;
        return (
          <div className="flex space-x-2">
            <Link to={`/admin/edit-book/${rowId}`}>
              <button className="rounded bg-blue-500 px-4 py-2 text-white">
                Edit
              </button>
            </Link>
            <button
              className="rounded bg-red-500 px-2 py-1 text-white"
              onClick={() => handleDelete(rowId)} // Pass rowId to handleDelete
            >
              Delete
            </button>
          </div>
        );
      },
    }),
  ];

  const [data, setData] = useState([]);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination: {
        pageIndex: currentPage,
        pageSize,
      },
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, data.length);


  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>{error}</p>;


  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Book Table
        </div>
        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setCurrentPage(0); // Reset to first page when changing page size
            }}
            className="p-2 border rounded text-sm"
          >
            {[5, 10, 20, 30, 40, 50].map(size => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="mt-8 overflow-x-scroll">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer border-b-[1px] border-gray-200 pb-2 pr-4 pt-4 text-start"
                  >
                    <div className="items-center justify-between text-xs text-gray-200">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " ↑",
                        desc: " ↓",
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows
              .map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="min-w-[150px] border-white/0 py-3 pr-4"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between gap-2 py-4">
        <div className="text-sm text-gray-600">
          Showing {startIndex} to {endIndex} of {data.length} entries
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(0)}
            disabled={currentPage === 0}
            className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            {"<<"}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            {"<"}
          </button>
          
          {/* Page Numbers */}
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`px-3 py-1 rounded border ${
                  currentPage === i ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            {">"}
          </button>
          <button
            onClick={() => setCurrentPage(totalPages - 1)}
            disabled={currentPage === totalPages - 1}
            className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            {">>"}
          </button>
        </div>

        {/* Page Jump */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Go to page:</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              setCurrentPage(Math.min(Math.max(0, page), totalPages - 1));
            }}
            className="w-16 p-1 border rounded text-sm"
          />
        </div>
      </div>
    </Card>
  );
}

export default BookList;
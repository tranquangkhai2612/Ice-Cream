// import CardMenu from "components/card/CardMenu";


// import {
//   createColumnHelper,
//   flexRender,
//   getCoreRowModel,
  
//   useReactTable,
// } from "@tanstack/react-table";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "components/card";
// import { getOrders } from "services/orderService";
import {
  createColumnHelper,
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

// export const fetchOrders = async () => {
//   const response = await axios.get(API_URL);
//   return response.data;
// };


function CheckTable() {
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [sorting, setSorting] = React.useState([]);
  

useEffect(() => {
  const fetchData = async () => {
    // try {
      // const data = await getOrders();
      // setData(data);
    // } catch (err) {
    //   console.error(err);
    //   setError("Failed to fetch data");
    // } finally {
    //   setLoading(false);
    // }
    const response = await axios.get("http://localhost:5099/api/Orders");
    setData(response.data);
  };
  fetchData();
}, []);

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("id", {
      id: "id",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">ID</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("email", {
      id: "email",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">Email</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("contactDetails", {
      id: "contactDetails",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Contact Details
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("address", {
      id: "address",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Address
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("orderType", {
      id: "orderType",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Order Type
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("orderAmount", {
      id: "orderAmount",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Order Amount
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("orderPrice", {
      id: "orderPrice",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Order Price
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          ${info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("createdAt", {
      id: "createdAt",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          Created At
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {new Date(info.getValue()).toLocaleDateString()}
        </p>
      ),
    }),
  ];
  const [data, setData] = useState([]);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>{error}</p>;


return (
  <Card extra={"w-full h-full sm:overflow-auto px-6"}>
    <header className="relative flex items-center justify-between pt-4">
      <div className="text-xl font-bold text-navy-700 dark:text-white">
        Orders Table
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
                      asc: "",
                      desc: "",
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
            .rows.slice(0, 5) // Adjust for pagination or remove for all rows
            .map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="min-w-[150px] border-white/0 py-3 pr-4"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </Card>
);
}

export default CheckTable;

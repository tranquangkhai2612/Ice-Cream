import React from "react";
import Progress from "components/progress";
import Card from "components/card";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

function CheckTable(props) {
  const { tableData } = props;
  const [sorting, setSorting] = React.useState([]);
  let defaultData = tableData;
  const columns = [
    columnHelper.accessor("name", {
      id: "name",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">NAME</p>
      ),
      cell: (info) => (
        <div className="flex items-center gap-2">
          <div className="h-[30px] w-[30px] rounded-full">
            <img
              src={info.getValue()[1]}
              className="h-full w-full rounded-full"
              alt=""
            />
          </div>
          <p className="text-sm font-medium text-navy-700 dark:text-white">
            {info.getValue()[0]}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("artworks", {
      id: "artworks",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          ARTWORKS
        </p>
      ),
      cell: (info) => (
        <p className="text-md font-medium text-gray-600 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("rating", {
      id: "rating",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          RATING
        </p>
      ),
      cell: (info) => (
        <div className="mx-2 flex font-bold">
          <Progress width="w-16" value={info.getValue()} />
        </div>
      ),
    }),
  ]; // eslint-disable-next-line
  const [data, setData] = React.useState(() => [...defaultData]);
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
  return (
    <></>
  );
}

export default CheckTable;
const columnHelper = createColumnHelper();

import React from "react";
import { Link } from "react-router-dom";
import TableList from "./components/TableList";

const Recipe = () => {
  return (
    <div>
      <div>
        <Link to="../create-recipe" className="inline-block">
          <button className="linear mt-4 flex items-center justify-center rounded-xl bg-brand-500 px-2 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
            Create New Recipe
          </button>
        </Link>
      </div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-1">
        <TableList />
      </div>
    </div>
  );
};

export default Recipe;

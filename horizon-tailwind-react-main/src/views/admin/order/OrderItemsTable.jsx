import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "components/card";

function OrderItemsTable() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  // Fetching data
  const fetchData = async (query = "") => {
    try {
      const response = await axios.get(
        `http://localhost:5099/api/OrderItem/all-orderitems?search=${query}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching order items:", error);
    }
  };

  useEffect(() => {
    fetchData(search);
  }, [search]);

  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6 py-4"}>
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Order Items Table
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded border p-2"
        />
      </header>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="px-4 py-2 text-left text-sm font-bold text-gray-600 dark:text-white">
                ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-bold text-gray-600 dark:text-white">
                Subscription ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-bold text-gray-600 dark:text-white">
                Quantity
              </th>
              <th className="px-4 py-2 text-left text-sm font-bold text-gray-600 dark:text-white">
                Subscription Type
              </th>
              <th className="px-4 py-2 text-left text-sm font-bold text-gray-600 dark:text-white">
                Subscription Price
              </th>
              {/* Grouping Book related fields */}
              <th className="px-4 py-2 text-left text-sm font-bold text-gray-600 dark:text-white">
                Book ID
              </th>
              <th className="px-4 py-2 text-left text-sm font-bold text-gray-600 dark:text-white">
                Book Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-bold text-gray-600 dark:text-white">
                Book Date
              </th>
              <th className="px-4 py-2 text-left text-sm font-bold text-gray-600 dark:text-white">
                Book Price
              </th>
              {/* Added Order Price column */}
              <th className="px-4 py-2 text-left text-sm font-bold text-gray-600 dark:text-white">
                Order Price
              </th>
              <th className="px-4 py-2 text-left text-sm font-bold text-gray-600 dark:text-white">
                Order ID
              </th>
            </tr>
          </thead>
          <tbody style={{ maxHeight: "400px" }}>
            {data.slice(0, 7).map((item) => (
              <tr
                key={item.id}
                className="transition hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-2 text-sm text-navy-700 dark:text-white">
                  {item.id}
                </td>
                <td className="px-4 py-2 text-sm text-navy-700 dark:text-white">
                  {item.subscriptionId || "N/A"}
                </td>
                <td className="px-4 py-2 text-sm text-navy-700 dark:text-white">
                  {item.quantity}
                </td>
                <td className="px-4 py-2 text-sm text-navy-700 dark:text-white">
                  {item.subscription?.subType || "N/A"}
                </td>
                <td className="px-4 py-2 text-sm text-navy-700 dark:text-white">
                  {item.subscription?.subPrice || "N/A"}
                </td>
                {/* Grouped Book related fields */}
                <td className="px-4 py-2 text-sm text-navy-700 dark:text-white">
                  {item.bookId || "N/A"}
                </td>
                <td className="px-4 py-2 text-sm text-navy-700 dark:text-white">
                  {item.book?.bookName || "N/A"}
                </td>
                <td className="px-4 py-2 text-sm text-navy-700 dark:text-white">
                  {item.book?.bookDate
                    ? new Date(item.book.bookDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="px-4 py-2 text-sm text-navy-700 dark:text-white">
                  {item.book?.price || "N/A"}
                </td>
                {/* Added Order Price column */}
                <td className="px-4 py-2 text-sm text-navy-700 dark:text-white">
                  {item.orderPrice || "N/A"}
                </td>
                <td className="px-4 py-2 text-sm text-navy-700 dark:text-white">
                  {item.orderId || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default OrderItemsTable;

import DevelopmentTable from "./DevelopmentTable"
import DevTable from "./DevTable"
import OrderItemsTable from "./OrderItemsTable";


const Tables = () => {
  return (
    <div>
      <div>
      </div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-1">
        <OrderItemsTable />
      </div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-1">
        <DevelopmentTable />

        <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-1">
          <DevTable />
        </div>
      </div>
    </div>
  );
};

export default Tables;

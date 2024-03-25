import DataTable from "react-data-table-component";
import { INSUREDS_DUMMY_DATA } from "../data";

export const InsuredsTable = ({ selectedRowsChange }) => {
  return (
    <div className="flex flex-col relative gap-y-2.5 mt-5">
      <DataTable
        noDataComponent={false}
        noHeader={true}
        columns={INSUREDS_DUMMY_DATA.columns3}
        selectableRows={true}
        onSelectedRowsChange={selectedRowsChange}
        data={INSUREDS_DUMMY_DATA.insureds}
        selectableRowsVisibleOnly
        className="insured-exit-table !rounded-lg shadow-md"
      />
    </div>
  );
};

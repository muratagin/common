import { useState } from "react";
import { InsuredsTable } from "./insured.table";

function EndorsementExit() {
  const [selectedRows, setSelectedRows] = useState([]);
  const selectedRowsChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  const formSubmit = () => {
    console.log("selectedRows", selectedRows);
  };

  return (
    <div className="my-5 flex flex-col justify-center items-center gap-y-2.5">
      <div className="container flex flex-col gap-y-2.5">
        <div className="flex flex-col gap-y-2 py-4 lg:p-0 flex-shrink-0">
          <h5 className="font-bold text-xl text-primary">Sigortalılar</h5>
          <span className="font-normal text-matter-horn">
            Poliçeye ait sigortalı listesi aşağıdaki gibidir. Çıkarmak
            istediğiniz sigortalı veya sigortalıları seçip işlem yapabilirsiniz.
          </span>
        </div>
        <InsuredsTable selectedRowsChange={selectedRowsChange} />
        <div className="flex justify-end w-full mt-5">
          <button
            type="button"
            onClick={formSubmit}
            className="btn btn-primary py-2.5 px-5"
          >
            Zeyil Oluştur
          </button>
        </div>
      </div>
    </div>
  );
}

export default EndorsementExit;

import { InputBase } from "@components/Inputs/InputBase";
import ReactSelect from "@components/Inputs/ReactSelect";
import { Form, Formik } from "formik";
import { useState } from "react";
import { DATA_TYPES, DATE_RANGE, TABLE_DATA } from "./data";
import PieChart from "./pie.chart";
import ReactTable from "./react.table";

export default function Index() {
  const [formValues, setFormValues] = useState({
    DataType: null,
    DateRange: null,
  });

  return (
    <div className="flex lg:justify-center flex-col">
      <div className="w-full page-container bg-transparent mx-auto container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col gap-y-2">
            <h5 className="font-bold text-xl text-primary">
              Hoş geldiniz, TEST USER
            </h5>
            <span className="font-normal text-matter-horn">Genel Bakış</span>
          </div>
          <div className="">
            <Formik initialValues={formValues}>
              {({ setFieldValue }) => (
                <Form className="flex flex-col lg:flex-row items-center w-full mt-2.5 lg:mt-0 gap-y-2.5 gap-x-5">
                  <InputBase
                    component={ReactSelect}
                    options={DATA_TYPES}
                    inputClassName="min-h-[40px] rounded-md w-64"
                    name="DataType"
                    placeholder="Veri türü seçiniz."
                    setFieldValue={setFieldValue}
                    isClearable
                  />
                  <InputBase
                    component={ReactSelect}
                    options={DATE_RANGE}
                    inputClassName="min-h-[40px] rounded-md w-64"
                    name="DateRange"
                    placeholder="Tarih aralığı seçiniz."
                    setFieldValue={setFieldValue}
                    isClearable
                  />
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <div className="mt-10 flex items-center flex-col-reverse lg:flex-row lg:items-start gap-5 px-2.5 lg:px-0">
          <div className="rounded-2xl shadow-md flex-[1.5]">
            <ReactTable data={TABLE_DATA.data} columns={TABLE_DATA.columns} />
          </div>
          <div className="rounded-2xl shadow-md bg-white flex-1 flex justify-center items-center">
            <PieChart />
          </div>
        </div>
      </div>
    </div>
  );
}

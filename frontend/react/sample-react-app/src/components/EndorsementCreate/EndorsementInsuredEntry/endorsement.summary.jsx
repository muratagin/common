import { InputBase } from "@components/Inputs/InputBase";
import ReactSelect from "@components/Inputs/ReactSelect";
import Icon from "@components/icon";
import { useEndorsementContext } from "@contexts/EndorsementCreateProvider";
import { currencyFormat } from "@libs/utils";
import { Table } from "@radix-ui/themes";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { DISCOUNT_RATE_OPTIONS, INSUREDS_DUMMY_DATA, tabNames } from "../data";

function EndorsementSummary() {
  const { handleChangeTab } = useEndorsementContext();
  const [formValues, setFormValues] = useState({
    DiscountRate: "",
  });

  return (
    <div className="my-5 flex flex-col justify-center items-center gap-y-2.5">
      <div className="container flex flex-col gap-y-2.5">
        <div className="flex flex-col gap-y-2 py-4 lg:p-0 flex-shrink-0">
          <h5 className="font-bold text-xl text-primary">Zeyil Özet</h5>
          <span className="font-normal text-matter-horn">
            Oluşturmuş olduğunuz zeyile ait bilgiler aşağıdaki gibidir.
            Sigortalıların beyan onayları sonrası devam edebilirsiniz.
          </span>
        </div>

        {/*Genel Bilgiler */}
        <GeneralInfo />

        {/*Sigorta Ettiren Bilgileri */}
        <InsurerInfo />

        {/*Sigortalı Bilgileri Başlangıç */}
        <InsuredsInfo />

        {/*Sigortalı Bilgileri Bitiş */}
        <div>
          <button
            onClick={() => handleChangeTab(tabNames[0])}
            type="button"
            className="btn btn-success rounded-md text-white py-2 px-3.5 font-semibold mt-2.5"
          >
            Sigortalı Ekle
          </button>
        </div>

        {/*Otorizasyona Takılan Sigortalı Uyarı */}
        <AuthorizationInsuredInfo />

        <div className="flex justify-end w-full mt-5">
          <button
            onClick={() => handleChangeTab(tabNames[3])}
            className="btn btn-primary py-2.5 px-5"
          >
            Ödeme Ekranına İlerle
          </button>
        </div>
      </div>
    </div>
  );
}

const TextView = ({ title, content }) => {
  return (
    <div className="gap-x-2 w-full items-center grid grid-cols-2">
      <span className="font-semibold">{title}:</span>
      <span>{content}</span>
    </div>
  );
};

const GeneralInfo = () => {
  const [formValues, setFormValues] = useState({
    DiscountRate: "",
  });
  return (
    <div className="flex flex-col relative gap-y-2.5">
      <span className="group-title text-xl">Genel Bilgiler</span>
      <div className="row group-summary group grid grid-cols-1 lg:grid-cols-3 items-center justify-items-between">
        <div>
          <TextView title="Zeyil No" content="34" />
          <TextView title="Ürün" content="Aveon TSS" />
          <TextView title="Brüt Prim" content={currencyFormat(15000)} />
          <TextView title="Acente Komisyonu" content={currencyFormat(1500)} />
          <TextView title="Net Prim" content={currencyFormat(1500)} />
        </div>
        <div className="col-span-1 w-full">
          <Formik className="" initialValues={formValues}>
            {({ setFieldValue }) => (
              <Form>
                <InputBase
                  label="İndirim Oranı"
                  component={ReactSelect}
                  options={DISCOUNT_RATE_OPTIONS}
                  isClearable
                  inputClassName="min-h-[40px] rounded-md border"
                  name="DiscountRate"
                  placeholder="İndirim oranı seçiniz."
                  setFieldValue={setFieldValue}
                />
              </Form>
            )}
          </Formik>
        </div>
        <div className="mt-5 flex w-full justify-center">
          <button className="btn btn-success">
            <span>Zeyil Basım</span>
            <Icon icon="FaFilePdf" />
          </button>
        </div>
      </div>
    </div>
  );
};

const InsurerInfo = () => {
  return (
    <div className="flex flex-col relative gap-y-2.5">
      <span className="group-title text-xl">Sigorta Ettiren Bilgileri</span>
      <div className="row group-summary group grid grid-cols-1 lg:grid-cols-3">
        <div className="col-span-1">
          <TextView title="Ad Soyad" content="Ahmet Erol" />
          <TextView
            title="Ticari Unvan"
            content="IMC Sigorta ve Reasürans Brokerliği"
          />
          <TextView title="VKN" content="6674748" />
          <TextView title="Vergi Dairesi" content="Zincirlikuyu" />
        </div>
      </div>
    </div>
  );
};

const InsuredsInfo = () => {
  return (
    <div className="flex flex-col relative gap-y-2.5 mt-5">
      <div className="flex flex-col gap-y-2 p-4 lg:p-0 flex-shrink-0">
        <span className="group-title text-xl">Sigortalılar</span>
      </div>

      <Table.Root variant="surface" className="border-none bg-white shadow-md">
        <Table.Header className="bg-white-smoke">
          <Table.Row align="center" className="text-primary">
            {INSUREDS_DUMMY_DATA.columns2.map((column, index) => (
              <React.Fragment key={index}>
                <Table.ColumnHeaderCell>{column.name}</Table.ColumnHeaderCell>
              </React.Fragment>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {INSUREDS_DUMMY_DATA.insureds.map((insured, index) => (
            <Table.Row key={index}>
              {INSUREDS_DUMMY_DATA.columns2.map((column, index) => (
                <Table.Cell key={index}>
                  <TableCellSelector
                    column={column}
                    key={index}
                    insured={insured}
                    value={column.selector && column.selector(insured)}
                  />
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

const AuthorizationInsuredInfo = () => {
  return (
    <div className="flex flex-col relative gap-y-2.5">
      <span className="group-title text-xl">Sigortalı Durumu</span>
      <div className="row group-summary group items-center justify-items-center !bg-danger !border-none">
        <li className="list-disc text-white font-medium">
          Ahmet Erol 65 yaş ve üstü kategorisinde olduğu için zeyil otorizasyona
          düşmüştür. Zeyil listesi ekranından kontrol edebilirsiniz.
        </li>
      </div>
    </div>
  );
};

const TableCellSelector = ({ column, value, insured }) => {
  switch (column.key) {
    case "PhoneNumber":
      return <PhoneNumberView value={value} insured={insured} />;
    case "DeclarationApprovalStatusText":
      return <DeclarationApprovalStatusView value={value} insured={insured} />;
    case "actions":
      return <ActionsView value={value} insured={insured} />;
    default:
      return value;
  }
};

const PhoneNumberView = ({ value, insured }) => {
  return (
    <div className="flex items-center gap-x-1">
      <span>{value}</span>
      <button
        type="button"
        className="btn btn-primary p-2 rounded-full text-white"
      >
        <Icon icon="HiOutlineRefresh" className="size-3" />
      </button>
      <button
        type="button"
        className="btn btn-primary p-2 rounded-full text-white"
      >
        <Icon icon="FaEdit" className="size-3" />
      </button>
    </div>
  );
};

const DeclarationApprovalStatusView = ({ value, insured }) => {
  return (
    <div className="flex items-center gap-x-1">
      <span>{value}</span>
      <button
        type="button"
        className="btn btn-success p-2 rounded-full text-white"
      >
        <Icon icon="FaFilePdf" className="size-3" />
      </button>
    </div>
  );
};

const ActionsView = () => {
  return (
    <div className="flex items-center gap-x-1">
      <button
        type="button"
        className="btn btn-danger p-2 rounded-full text-white"
      >
        <Icon icon="FaTrash" className="size-3" />
      </button>
    </div>
  );
};

export default EndorsementSummary;

import Icon from "@components/icon";
import { useEndorsementContext } from "@contexts/EndorsementCreateProvider";
import { currencyFormat } from "@libs/utils";
import { Table } from "@radix-ui/themes";
import classNames from "classnames";
import _ from "lodash";
import { useState } from "react";
import { INSUREDS_DUMMY_DATA, PACKAGES_DUMMY_DATA, tabNames } from "../data";

function PackageSelection() {
  const { handleChangeTab } = useEndorsementContext();
  return (
    <div className="my-5 flex flex-col justify-center items-center">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full container">
        {PACKAGES_DUMMY_DATA.map((pck, index) => (
          <PackageView key={index} pck={pck} />
        ))}
      </div>
      <div className="w-full container">
        <InsuredsView />
        <div className="flex justify-end w-full mt-5">
          <button
            onClick={() => handleChangeTab(tabNames[2])}
            className="btn btn-primary py-2.5 px-5"
          >
            Zeyil Özetine İlerle
          </button>
        </div>
      </div>
    </div>
  );
}

const PackageView = ({ pck }) => {
  const [showDetail, setShowDetail] = useState(false);
  return (
    <div
      className={classNames({
        "max-w-[450px] rounded-2xl": true,
        "bg-white shadow-sm": showDetail,
      })}
    >
      <button
        onClick={() => setShowDetail(!showDetail)}
        className="h-16 w-full btn bg-primary flex flex-col items-center justify-center  text-white rounded-2xl relative"
      >
        <h4 className="text-xl font-semibold">{pck.title}</h4>
        <span className="font-medium">{currencyFormat(pck.price)}</span>
        <div className="absolute right-10">
          <Icon
            icon="TfiAngleDown"
            size="1.5em"
            className={classNames({
              "transition-all duration-300": true,
              "rotate-180": showDetail,
              "rotate-0": !showDetail,
            })}
          />
        </div>
      </button>
      <div
        className={classNames({
          "w-full rounded-b-2xl flex px-5 py-2.5 flex-col gap-y-2.5": true,
          hidden: !showDetail,
          visible: showDetail,
        })}
      >
        {pck.content.map((content, index) => (
          <Table.Root key={index} variant="ghost">
            <Table.Header className="">
              <Table.Row align="center" className="text-primary">
                <Table.ColumnHeaderCell className="p-1">
                  {content.treatmentText}
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="p-1" align="center">
                  {content.countText}
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {content.medicalExaminations.map((cell, index) => (
                <Table.Row key={index}>
                  <Table.Cell className="p-1 max-w-12">{cell.text}</Table.Cell>
                  <Table.Cell align="center" className="p-1 max-w-12">
                    {cell.count}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        ))}
      </div>
    </div>
  );
};

const InsuredsView = () => {
  const [selectedPackages, setSelectedPackages] = useState([]);

  const isSelectedPackage = (insured, pck) => {
    let result = false;
    result = selectedPackages.some(
      (x) => x.InsuredId === insured.Id && x.Package.id === pck.id
    );
    return result;
  };

  const handleSelectPackage = (insured, pck) => {
    const existingPackageIndex = selectedPackages.findIndex(
      (item) => item.InsuredId === insured.Id
    );
    if (existingPackageIndex !== -1) {
      const updatedPackages = [...selectedPackages];
      updatedPackages[existingPackageIndex] = {
        InsuredId: insured.Id,
        Package: { ...pck },
      };
      setSelectedPackages(updatedPackages);
    } else {
      setSelectedPackages([
        ...selectedPackages,
        {
          InsuredId: insured.Id,
          Package: { ...pck },
        },
      ]);
    }
  };

  const totalPrice = _.sum(_.map(selectedPackages, (d) => d.Package.price));

  return (
    <div className="flex flex-col relative gap-y-2.5 mt-5">
      <div className="flex flex-col gap-y-2 p-4 lg:p-0 flex-shrink-0">
        <h5 className="font-bold text-xl text-primary">Sigortalılar</h5>
        <span className="font-normal text-matter-horn">
          Lütfen sigortalılar için paket seçiminde bulununuz.
        </span>
      </div>

      <Table.Root variant="surface" className="border-none bg-white shadow-md">
        <Table.Header className="bg-white-smoke">
          <Table.Row align="center" className="text-primary">
            {INSUREDS_DUMMY_DATA.columns.map((column, index) => (
              <Table.ColumnHeaderCell key={index}>
                {column.name}
              </Table.ColumnHeaderCell>
            ))}
            {PACKAGES_DUMMY_DATA.map((pck, index) => (
              <Table.ColumnHeaderCell key={index}>
                {pck.title}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {INSUREDS_DUMMY_DATA.insureds.map((insured, index) => (
            <Table.Row key={index}>
              {INSUREDS_DUMMY_DATA.columns.map((column, index) => (
                <Table.Cell key={index}>{column.selector(insured)}</Table.Cell>
              ))}

              {PACKAGES_DUMMY_DATA.map((pck, index) => (
                <Table.Cell key={index}>
                  <button
                    onClick={() => handleSelectPackage(insured, pck)}
                    className={classNames({
                      "btn btn-light text-matter-horn font-normal px-5 rounded-xl hover:bg-success hover:text-white": true,
                      "bg-success text-white": isSelectedPackage(insured, pck),
                    })}
                  >
                    {currencyFormat(pck.price)}
                  </button>
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <div className="relative">
        <span className="font-bold text-lg">
          Brüt Prim: {currencyFormat(totalPrice)}
        </span>{" "}
      </div>
    </div>
  );
};

export default PackageSelection;

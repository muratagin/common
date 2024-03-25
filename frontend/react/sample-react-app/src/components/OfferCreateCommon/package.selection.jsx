import { Requests } from "@app/api";
import { OfferStatus } from "@app/enum";
import Icon from "@components/icon";
import { useOfferContext } from "@contexts/OfferCreateProvider";
import { MySwalData } from "@libs/myswaldata";
import { getEntityUrl } from "@libs/parser";
import { currencyFormat, isJsonString, resErrorMessage } from "@libs/utils";
import { Table } from "@radix-ui/themes";
import { setLoading } from "@slices/dynamicStyleSlice";
import classNames from "classnames";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { tabNames } from "./data";

function PackageSelection() {
  const { handleChangeTab, offer, setOffer } = useOfferContext();

  const [insureds, setInsureds] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const dispatch = useDispatch();
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    if (offer && offer?.Id) {
      getInsuredWithPackagesForOffer(offer?.Id);
    }
  }, [offer]);

  const getInsuredWithPackagesForOffer = async () => {
    try {
      const url = getEntityUrl({
        api: {
          port: 8141,
          url: `Offers/GetInsuredWithPackagesForOffer?OfferId=${offer?.Id}`,
        },
      });
      dispatch(setLoading(true));
      const response = await Requests().CommonRequest.get({
        url,
      });
      if (response && response.data) {
        setInsureds(response.data);
        const selecteds = getSelectedPackages(response.data);
        setSelectedPackages(selecteds);
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
    }
  };

  const updateOfferBySelectingPackage = async () => {
    try {
      const url = getEntityUrl({
        api: {
          port: 8141,
          url: `Offers/UpdateOfferBySelectingPackage`,
        },
      });

      if (selectedPackages.length !== insureds.length) {
        MySwal.fire(
          MySwalData("warning", {
            text: "Tüm sigortalılar için prim seçimi yapınız.",
          })
        );
        return false;
      }

      const content = {
        OfferId: offer?.Id,
        InsuredInformationList: selectedPackages,
      };
      dispatch(setLoading(true));
      const response = await Requests().CommonRequest.put({
        url,
        content,
      });
      if (response && response.data && response?.data?.IsSuccess) {
        handleChangeTab(tabNames[2]);
        setOffer({ ...offer, Status: OfferStatus.OFFER_DECLARATION });
      }
      dispatch(setLoading(false));
    } catch (error) {
      const errorMessage = resErrorMessage(error);
      MySwal.fire(
        MySwalData("error", {
          text: errorMessage,
        })
      );
      dispatch(setLoading(false));
    }
  };

  function getSelectedPackages(insureds) {
    const selectedPackages = [];

    insureds &&
      insureds.forEach((insured) => {
        if (
          insured.PackageInformationList &&
          Array.isArray(insured.PackageInformationList)
        ) {
          insured.PackageInformationList.forEach((packageInfo) => {
            if (packageInfo.IsSelected) {
              selectedPackages.push({
                InsuredId: insured.InsuredId,
                PackageId: packageInfo.PackageId,
                Premium: packageInfo.Premium,
              });
            }
          });
        }
      });

    return selectedPackages;
  }

  return (
    <div className="my-5 flex flex-col justify-center items-center">
      <PackageSelectionView
        insureds={insureds}
        setSelectedPackages={setSelectedPackages}
        selectedPackages={selectedPackages}
      />
      <div className="w-full container">
        <div className="flex justify-end w-full mt-5">
          <button
            onClick={() => updateOfferBySelectingPackage()}
            className="btn btn-primary py-2.5 px-5"
          >
            Teklif Özetine İlerle
          </button>
        </div>
      </div>
    </div>
  );
}

export const PackageSelectionView = ({
  insureds,
  selectedPackages,
  setSelectedPackages,
  customTitleComponent,
  isShowTotalPremium = true,
}) => {
  const { offer } = useOfferContext();

  const [packages, setPackages] = useState([]);

  useEffect(() => {
    if (offer && offer?.Id) {
      getPackagesForOffer(offer?.Id);
    }
  }, [offer]);

  const getPackagesForOffer = async () => {
    try {
      const url = getEntityUrl({
        api: {
          port: 8141,
          url: `Offers/GetPackagesForOffer?OfferId=${offer?.Id}`,
        },
      });

      const response = await Requests().CommonRequest.get({
        url,
      });
      if (response && response.data) {
        setPackages(response.data);
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full container">
        {packages &&
          packages.map((pck, index) => <PackageView key={index} pck={pck} />)}
      </div>
      <div className="w-full container">
        <InsuredsView
          insureds={insureds}
          selectedPackages={selectedPackages}
          setSelectedPackages={setSelectedPackages}
          customTitleComponent={customTitleComponent}
          isShowTotalPremium={isShowTotalPremium}
        />
      </div>
    </>
  );
};

const PackageView = ({ pck }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [content, setContent] = useState([]);

  useEffect(() => {
    if (pck && pck.Content && isJsonString(pck.Content)) {
      const parsedContent = JSON.parse(pck.Content);
      setContent(parsedContent);
    }
  }, [pck]);

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
        <h4 className="text-base font-semibold max-w-44 lg:max-w-64">
          {pck.PackageName}
        </h4>
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
        {content &&
          content.map((data, index) => (
            <Table.Root key={index} variant="ghost">
              <Table.Header className="">
                <Table.Row align="center" className="text-primary">
                  <Table.ColumnHeaderCell className="p-1">
                    {data.CoverageName}
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="p-1" align="center">
                    {data.Limit}
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data?.SubCoverages.map((cell, index) => (
                  <Table.Row key={index}>
                    <Table.Cell className="p-1 max-w-12">
                      {cell.CoverageName}
                    </Table.Cell>
                    <Table.Cell align="center" className="p-1 max-w-12">
                      {cell.Limit}
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

const InsuredsView = ({
  insureds,
  selectedPackages,
  setSelectedPackages,
  customTitleComponent,
  isShowTotalPremium,
}) => {
  const columns = [
    {
      name: "Kimlik No",
      selector: (row) => row.IdentityNumber,
    },
    {
      name: "Adı Soyadı",
      selector: (row) => row.FullName,
      key: "TotalCount",
    },
    {
      name: "Cinsiyet",
      selector: (row) => row.Gender,
      key: "TotalPremium",
    },
    {
      name: "Birey Tipi",
      selector: (row) => row.IndividualType,
      key: "TotalCommission",
    },
  ];

  const isSelectedPackage = (insured, pck) => {
    let result = false;
    result = selectedPackages.some(
      (x) => x.InsuredId === insured.InsuredId && x.PackageId === pck.PackageId
    );
    return result;
  };

  const handleSelectPackage = (insured, pck) => {
    const existingPackageIndex = selectedPackages.findIndex(
      (item) => item.InsuredId === insured.InsuredId
    );
    if (existingPackageIndex !== -1) {
      const updatedPackages = [...selectedPackages];
      updatedPackages[existingPackageIndex] = {
        InsuredId: insured.InsuredId,
        PackageId: pck?.PackageId,
        Premium: pck?.Premium,
      };
      setSelectedPackages(updatedPackages);
    } else {
      setSelectedPackages([
        ...selectedPackages,
        {
          InsuredId: insured.InsuredId,
          PackageId: pck?.PackageId,
          Premium: pck?.Premium,
        },
      ]);
    }
  };

  const totalPrice = _.sum(_.map(selectedPackages, (d) => d.Premium));

  return (
    <div className="flex flex-col relative gap-y-2.5 mt-5">
      <div className="flex flex-col gap-y-2 p-4 lg:p-0 flex-shrink-0">
        {customTitleComponent ? (
          customTitleComponent
        ) : (
          <>
            <h5 className="font-bold text-xl text-primary">Sigortalılar</h5>
            <span className="font-normal text-matter-horn">
              Lütfen sigortalılar için paket seçiminde bulununuz.
            </span>
          </>
        )}
      </div>

      <Table.Root variant="surface" className="border-none bg-white shadow-md">
        <Table.Header className="bg-white-smoke">
          <Table.Row align="center" className="text-primary">
            {columns.map((column, index) => (
              <Table.ColumnHeaderCell key={index}>
                {column.name}
              </Table.ColumnHeaderCell>
            ))}
            {insureds &&
              insureds[0]?.PackageInformationList?.map((pck, index) => (
                <Table.ColumnHeaderCell key={index}>
                  {pck.PackageName}
                </Table.ColumnHeaderCell>
              ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {insureds &&
            insureds.map((insured, index) => (
              <Table.Row key={index}>
                {columns.map((column, index) => (
                  <Table.Cell key={index}>
                    {column.selector(insured)}
                  </Table.Cell>
                ))}
                {insured?.PackageInformationList &&
                  insured?.PackageInformationList?.map((pck, index) => (
                    <Table.Cell key={index}>
                      <button
                        onClick={() => handleSelectPackage(insured, pck)}
                        className={classNames({
                          "btn btn-light text-matter-horn font-normal px-5 rounded-xl hover:bg-success hover:text-white": true,
                          "bg-success text-white": isSelectedPackage(
                            insured,
                            pck
                          ),
                        })}
                      >
                        {currencyFormat(pck.Premium)}
                      </button>
                    </Table.Cell>
                  ))}
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
      {isShowTotalPremium && (
        <div className="relative">
          <span className="font-bold text-lg">
            Brüt Prim: {currencyFormat(totalPrice)}
          </span>
        </div>
      )}
    </div>
  );
};

export default PackageSelection;

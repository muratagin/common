import { checkIfIsEmpty, currencyFormat } from "@libs/utils";
import SaleChannelCommissionForm from "./salechannel.commission.form";
import { TextView } from "./text.view";

export const GeneralInfo = ({
  generalInformation,
  discounts,
  getOfferDiscounts,
  getPageData,
}) => {
  return (
    <div className="flex flex-col relative gap-y-2.5">
      <span className="group-title text-xl">Genel Bilgiler</span>
      <div className="row group-summary !p-0 group grid grid-cols-1 lg:grid-cols-3 items-center justify-items-between gap-x-10">
        <div className="p-6">
          <TextView title="Teklif No" content={generalInformation?.Id} />
          <TextView title="Ürün" content={generalInformation?.ProductName} />
          <TextView
            title="Brüt Prim"
            content={
              checkIfIsEmpty(generalInformation?.GrossPremium) &&
              currencyFormat(generalInformation?.GrossPremium)
            }
          />
          <TextView
            title="Acente Komisyonu"
            content={
              checkIfIsEmpty(generalInformation?.SaleChannelCommission) &&
              currencyFormat(generalInformation?.SaleChannelCommission)
            }
          />
          <TextView
            title="Net Prim"
            content={
              checkIfIsEmpty(generalInformation?.NetPremium) &&
              currencyFormat(generalInformation?.NetPremium)
            }
          />
        </div>
        <div className="col-span-2 w-full flex flex-col justify-around items-center  h-full  border-success border-x-[1px] px-2.5">
          <SaleChannelCommissionForm
            discounts={discounts}
            generalInformation={generalInformation}
            getOfferDiscounts={getOfferDiscounts}
            getPageData={getPageData}
          />
        </div>
      </div>
    </div>
  );
};

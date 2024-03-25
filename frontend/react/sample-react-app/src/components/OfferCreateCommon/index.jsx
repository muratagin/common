import { OfferStatus } from "@app/enum";
import { useOfferContext } from "@contexts/OfferCreateProvider";
import { checkIf, checkIfIsEmpty } from "@libs/utils";
import { Tabs } from "@radix-ui/themes";
import { useEffect } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import OfferSummary from "./OfferSummary/offer.summary";
import { tabNames } from "./data";
import OfferCreateForm from "./offer.create.form";
import OfferPaymentForm from "./offer.payment.form";
import PackageSelection from "./package.selection";

function Index() {
  const { productId, offerId } = useParams();
  const { state } = useLocation();
  const {
    offer,
    activeTab,
    handleChangeTab,
    setCurrentProductId,
    handleChangeProductType,
    currentProductType,
  } = useOfferContext();
  const productType = state?.productType;

  if (!checkIf(productType) && !checkIfIsEmpty(offerId)) {
    return <Navigate to="/offer/product-selection" />;
  }

  useEffect(() => {
    setCurrentProductId(productId);
    handleChangeProductType(productType);
  }, [productId, productType]);

  const isTabDisabled = (currentTab) => {
    if (checkIfIsEmpty(offer)) {
      if (currentTab === tabNames[0] || currentTab === tabNames[1]) {
        return offer.Status !== OfferStatus.OFFER_REQUEST;
      } else if (currentTab === tabNames[2]) {
        return (
          offer.Status !== OfferStatus.OFFER_DECLARATION &&
          offer.Status !== OfferStatus.PAYMENT_WAITING
        );
      } else if (currentTab === tabNames[3]) {
        return offer.Status !== OfferStatus.PAYMENT_WAITING;
      }
    } else {
      return currentTab !== tabNames[0];
    }
  };

  return (
    <div className="flex justify-center">
      <div className="page-container">
        <h3 className="page-header flex flex-col">
          <span>Ürün Adı</span>
          <span className="text-sm">Yeni Teklif</span>
        </h3>
        <div className="page-content">
          <Tabs.Root
            className="tabs"
            value={activeTab}
            defaultValue={activeTab || tabNames[0]}
            onValueChange={handleChangeTab}
          >
            <Tabs.List className="tab-list">
              {tabNames.map((tab, index) => (
                <Tabs.Trigger
                  key={index}
                  className="tab-trigger"
                  value={tab}
                  disabled={isTabDisabled(tab)}
                >
                  {tab}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            <div>
              <Tabs.Content className="TabsContent" value="Teklif Oluşturma">
                {checkIfIsEmpty(currentProductType) && <OfferCreateForm />}
              </Tabs.Content>
              <Tabs.Content className="TabsContent" value="Paket Seçimi">
                <PackageSelection />
              </Tabs.Content>
              <Tabs.Content className="TabsContent" value="Teklif Özet">
                <OfferSummary />
              </Tabs.Content>
              <Tabs.Content className="TabsContent" value="Poliçeleştir">
                <OfferPaymentForm />
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </div>
      </div>
    </div>
  );
}

export default Index;

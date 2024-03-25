import { ENDORSEMENT_TYPE } from "@app/enum";
import { useEndorsementContext } from "@contexts/EndorsementCreateProvider";
import { Tabs } from "@radix-ui/themes";
import { useParams } from "react-router-dom";
import EndorsementExit from "./EndorsementExit/endorsement.exit";
import EndorsementCreateForm from "./EndorsementInsuredEntry/endorsement.create.form";
import EndorsementPaymentForm from "./EndorsementInsuredEntry/endorsement.payment.form";
import EndorsementSummary from "./EndorsementInsuredEntry/endorsement.summary";
import PackageSelection from "./EndorsementInsuredEntry/package.selection";
import { tabNames } from "./data";

function Index() {
  const { offerId } = useParams();

  const endorsementType = new URLSearchParams(location.search).get("type");

  return (
    <div className="flex justify-center">
      <div className="page-container">
        <h3 className="page-header flex flex-col">
          <span>123456789 Nolu Poliçe</span>
          <span className="text-sm">Zeyil - Sigortalı</span>
        </h3>
        <div className="page-content">
          {endorsementType === ENDORSEMENT_TYPE.SIGORTALI_GIRIS && (
            <EndorsementInsuredEntryView />
          )}
          {endorsementType === ENDORSEMENT_TYPE.SIGORTALI_CIKIS && (
            <EndorsementExitView />
          )}
        </div>
      </div>
    </div>
  );
}

const EndorsementInsuredEntryView = () => {
  const { activeTab, handleChangeTab } = useEndorsementContext();
  return (
    <Tabs.Root
      className="tabs"
      value={activeTab}
      defaultValue={activeTab || tabNames[0]}
      onValueChange={handleChangeTab}
    >
      <Tabs.List className="tab-list">
        {tabNames.map((tab, index) => (
          <Tabs.Trigger key={index} className="tab-trigger" value={tab}>
            {tab}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      <div>
        <Tabs.Content className="TabsContent" value="Zeyil Oluşturma">
          <EndorsementCreateForm />
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="Paket Seçimi">
          <PackageSelection />
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="Zeyil Özet">
          <EndorsementSummary />
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="Poliçeleştir">
          <EndorsementPaymentForm />
        </Tabs.Content>
      </div>
    </Tabs.Root>
  );
};

const EndorsementExitView = () => {
  return <EndorsementExit />;
};

export default Index;

import Index from "@components/OfferCreateCommon";
import { OfferCreateProvider } from "@contexts/OfferCreateProvider";

function OfferCreate() {
  return (
    <OfferCreateProvider>
      <Index />
    </OfferCreateProvider>
  );
}

export default OfferCreate;

import { createElement } from "react";
import OfferCancelModalButton from "./Offers/offer.cancel.modal.button";
import { PrintOfferButton } from "./Offers/print.offer.button";
import PlanViewTab from "./PackagesView/plan.view.tab";
import EndorsementTypeSelectionModal from "./Policies/endorsement.type.selection.modal";
import { EndorsementViewTab } from "./Policies/endorsement.view.tab";
import { InsuredViewTab } from "./Policies/insured.view.tab";
import { PaymentViewTab } from "./Policies/payment.view.tab";
import PrintsViewTab from "./Policies/prints.view.tab";
import ApprovalContentDetails from "./approval.content.detail";

export default function DynamicComponent(props) {
  const Components = {
    PrintOfferButton: PrintOfferButton,
    OfferCancelModalButton: OfferCancelModalButton,
    EndorsementViewTab: EndorsementViewTab,
    EndorsementTypeSelectionModal: EndorsementTypeSelectionModal,
    InsuredViewTab: InsuredViewTab,
    PaymentViewTab: PaymentViewTab,
    PrintsViewTab: PrintsViewTab,
    PlanViewTab: PlanViewTab,
    ApprovalContentDetails: ApprovalContentDetails,
  };
  return createElement(Components[props.component.name], props);
}

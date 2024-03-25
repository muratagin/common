import { AssetIndex } from "@components/asset.index";

export const PaymentViewTab = (props) => {
  return (
    <AssetIndex asset={"payment"} id={props.boundId} isBoundEntity={true} />
  );
};

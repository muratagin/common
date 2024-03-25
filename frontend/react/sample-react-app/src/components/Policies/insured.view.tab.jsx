import { AssetIndex } from "@components/asset.index";

export const InsuredViewTab = (props) => {
  return (
    <AssetIndex asset={"insured"} id={props.boundId} isBoundEntity={true} />
  );
};

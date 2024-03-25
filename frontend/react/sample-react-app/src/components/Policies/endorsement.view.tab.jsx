import { AssetIndex } from "@components/asset.index";

export const EndorsementViewTab = (props) => {
  return (
    <AssetIndex asset={"endorsement"} id={props.boundId} isBoundEntity={true} />
  );
};

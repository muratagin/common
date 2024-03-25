import { useParams } from 'react-router-dom';
import { AssetEdit } from './asset.edit';

export function AssetDisplay(props) {
  const paramsObject = useParams();
  const id = paramsObject.id;
  const asset = props.asset;
  return <AssetEdit display={true} id={id} asset={asset} disabled={true} />;
}

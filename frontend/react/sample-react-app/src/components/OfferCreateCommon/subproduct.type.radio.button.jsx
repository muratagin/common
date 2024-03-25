import { Requests } from "@app/api";
import { SubProductType } from "@app/enum";
import { useOfferContext } from "@contexts/OfferCreateProvider";
import { getEntityUrl } from "@libs/parser";
import { checkIfIsEmpty } from "@libs/utils";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

function SubProductTypeRadioButton({
  handleChange,
  value,
  setFormValues,
  formValues,
}) {
  const { currentProductId, offer } = useOfferContext();
  const [loading, setLoading] = useState(true);
  const [productInfo, setProductInfo] = useState(true);
  const disabled = offer?.Id;

  useEffect(() => {
    if (checkIfIsEmpty(currentProductId))
      getSubProductInformationForOffer(currentProductId);
  }, [currentProductId]);

  const getSubProductInformationForOffer = async (productId) => {
    try {
      const url = getEntityUrl({
        api: {
          port: 8141,
          url: `Offers/GetSubProductInformationForOffer?productId=${productId}`,
        },
      });

      setLoading(true);
      const response = await Requests().CommonRequest.get({
        url,
      });

      if (response && response.data) {
        setProductInfo(response.data);
        setFormValues({
          ...formValues,
          SubProductType: response.data?.SubProductType,
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <div className="w-full flex flex-col lg:flex-row gap-x-2 gap-y-2.5 mt-2.5 lg:mt-0">
      {loading ? (
        <CircularProgress size={25} />
      ) : (
        <>
          {(productInfo?.IsBoth ||
            productInfo?.SubProductType == SubProductType.FERDI) && (
            <div className="w-full flex justify-center lg:w-auto">
              <input
                className="hidden"
                type="radio"
                id="Ferdi"
                name="SubProductType"
                onChange={handleChange}
                value={0}
                defaultChecked={
                  offer
                    ? offer?.SubProductType == SubProductType.FERDI
                    : value == SubProductType.FERDI
                }
                disabled={disabled}
              />
              <label htmlFor="Ferdi" className="input-radio">
                Ferdi
              </label>
            </div>
          )}
          {(productInfo?.IsBoth ||
            productInfo?.SubProductType == SubProductType.GRUP) && (
            <div className="w-full flex justify-center lg:w-auto">
              <input
                className="hidden"
                type="radio"
                id="Grup"
                onChange={handleChange}
                name="SubProductType"
                value={1}
                defaultChecked={
                  offer
                    ? offer?.SubProductType == SubProductType.GRUP
                    : value == SubProductType.GRUP
                }
                disabled={disabled}
              />
              <label htmlFor="Grup" className="input-radio">
                Grup
              </label>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SubProductTypeRadioButton;

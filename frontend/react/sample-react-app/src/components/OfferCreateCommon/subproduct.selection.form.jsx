import { InputBase } from "@components/Inputs/InputBase";
import ReactSelect from "@components/Inputs/ReactSelect";
import { useOfferContext } from "@contexts/OfferCreateProvider";
import { MySwalData } from "@libs/myswaldata";
import { checkIfIsEmpty, resErrorMessage } from "@libs/utils";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getSubProductForOffer } from "./service";

function SubproductSelectionForm({ values, setFieldValue }) {
  const [loading, setLoading] = useState(false);
  const { offer } = useOfferContext();
  const MySwal = withReactContent(Swal);
  const [subProductOptions, setSubProductOptions] = useState([]);
  const disabled = offer?.Id;
  useEffect(() => {
    if (checkIfIsEmpty(values.SubProductType)) {
      getSubProducts();
    }
  }, [values.SubProductType]);

  const getSubProducts = async () => {
    try {
      const content = {
        ProductId: values.ProductId,
        SubProductType: offer?.SubProductType || values.SubProductType,
      };
      setLoading(true);
      const response = await getSubProductForOffer(content);
      setLoading(false);
      if (response) setSubProductOptions(response);
    } catch (error) {
      const errorMessage = resErrorMessage(error);
      MySwal.fire(
        MySwalData("warning", {
          text: errorMessage,
        })
      );
      setLoading(false);
    }
  };

  return (
    <>
      <span className="group-title text-xl">Ürün Seçeneği</span>
      <div className="row group-summary group flex flex-col items-center gap-4 gap-y-2 !py-3 md:grid md:grid-cols-3 lg:grid-cols-4">
        {
          <InputBase
            label="*Ürün"
            component={ReactSelect}
            isClearable
            inputClassName="!h-10"
            name="SubProductId"
            placeholder="Ürün seçiniz"
            options={subProductOptions}
            setFieldValue={setFieldValue}
            disabled={disabled}
            isLoading={loading}
          />
        }
      </div>
    </>
  );
}

export default SubproductSelectionForm;

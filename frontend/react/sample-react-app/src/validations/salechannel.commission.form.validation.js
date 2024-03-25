import { CommissionType } from "@app/enum";
import * as Yup from "yup";

export const SaleChannelCommissionFormSchema = Yup.object().shape({
  DiscountType: Yup.string().required("Bu alan zorunludur."),
  DiscountValue: Yup.number()
    .required("Bu alan zorunludur.")
    .when(["DiscountType"], {
      is: (discountType) => Number(discountType) === CommissionType.ORAN,
      then: (schema) =>
        schema.max(
          100,
          "Komisyon tipi oran için en fazla 100 değer girilebilir."
        ),
      otherwise: (schema) => schema.required("Bu alan zorunludur."),
    }),
});

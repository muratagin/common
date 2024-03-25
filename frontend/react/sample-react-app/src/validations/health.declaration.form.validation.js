import * as Yup from "yup";

export const HealthDeclarationFormSchema = Yup.object().shape({
  IsAllAproved: Yup.bool().oneOf(
    [true],
    "Bu alanının onaylanması gerekmektedir."
  ),
  DeclarationApprovalList: Yup.array().of(
    Yup.object().shape({
      IsApproval: Yup.boolean().required("Seçim yapılması gerekmektedir."),
    })
  ),
});

export const HealthDeclarationModalFormSchema = Yup.object().shape({
  InsuredDescription: Yup.string().required("Bu alan zorunludur."),
});

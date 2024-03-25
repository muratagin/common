import * as Yup from "yup";

export const KvkkDeclarationFormSchema = Yup.object().shape({
  DeclarationApprovalList: Yup.array().of(
    Yup.object().shape({
      IsApproval: Yup.bool().oneOf(
        [true],
        "Bu alanının onaylanması gerekmektedir."
      ),
    })
  ),
});

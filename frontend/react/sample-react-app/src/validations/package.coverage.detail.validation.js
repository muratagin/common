import * as Yup from "yup";

export const PackageCoverageDetailFormSchema = Yup.object().shape({
  Limit: Yup.string().required("Limit zorunludur"),
});

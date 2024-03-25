import * as Yup from "yup";

export const PackageCoverageFormSchema = Yup.object().shape({
  CoverageName: Yup.string().required("Teminat adı zorunludur"),
});

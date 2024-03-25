import * as Yup from "yup";
import { InsuredInformationListSchema } from "./offer.create.form.validation";

export const AddNewInsuredModalFormSchema = Yup.object().shape({
  InsuredInformationList: InsuredInformationListSchema,
});

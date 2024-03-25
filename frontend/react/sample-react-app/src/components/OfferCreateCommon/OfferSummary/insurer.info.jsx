import { ContactType } from "@app/enum";
import { checkIfIsEmpty } from "@libs/utils";
import moment from "moment";
import { TextView } from "./text.view";

export const InsurerInfo = ({ generalInformation }) => {
  const contactType = generalInformation?.ContactType;

  return (
    <div className="flex flex-col relative gap-y-2.5">
      <span className="group-title text-xl">Sigorta Ettiren Bilgileri</span>
      <div className="row group-summary group grid grid-cols-1 lg:grid-cols-3">
        {contactType === ContactType.GERCEK && (
          <>
            <div className="col-span-1">
              <TextView title="Adı" content={generalInformation?.FirstName} />
              <TextView title="Soyadı" content={generalInformation?.LastName} />
              <TextView
                title="T.C. Kimlik No"
                content={generalInformation?.IdentityNumber}
              />
              <TextView
                title="Doğum Tarihi"
                content={
                  checkIfIsEmpty(generalInformation?.DateOfBirth) &&
                  moment(generalInformation?.DateOfBirth).format("DD/MM/YYYY")
                }
              />
              <TextView
                title="Cep Telefonu"
                content={generalInformation?.MobileNumber}
              />
              <TextView
                title="E-posta Adresi"
                content={generalInformation?.EmailAddress}
              />
              <TextView
                title="Adres"
                content={generalInformation?.AddressDetail}
              />
            </div>
          </>
        )}
        {contactType === ContactType.TUZEL && (
          <>
            <div className="col-span-1">
              <TextView title="Unvan" content={generalInformation?.Title} />
              <TextView
                title="Vergi Kimlik No"
                content={generalInformation?.TaxNumber}
              />
              <TextView
                title="Cep Telefonu"
                content={generalInformation?.MobileNumber}
              />
              <TextView
                title="E-posta Adresi"
                content={generalInformation?.EmailAddress}
              />
              <TextView
                title="Adres"
                content={generalInformation?.AddressDetail}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

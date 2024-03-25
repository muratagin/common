import { ContactType, IdentityType, ProductType } from "@app/enum";
import moment from "moment";
import * as Yup from "yup";

export const InsuredInformationListSchema = Yup.array()
  .of(
    Yup.object().shape({
      IdentityType: Yup.string().required("Bu alan zorunludur."),
      IsSearch: Yup.bool().oneOf([true], "Lütfen sorgulama yapınız."),
      IdentityNumber: Yup.string().when(["IdentityType"], {
        is: (identityType) => Number(identityType) !== IdentityType.PASSPORT,
        then: (schema) =>
          schema
            .matches(/^[0-9]{11}$/, "Geçerli bir kimlik numarası giriniz.")
            .required("Bu alan zorunludur."),
        otherwise: (schema) => schema.notRequired(),
      }),

      //Kimlik tipi pasaport seçili ise
      PassportNo: Yup.string().when(["IdentityType"], {
        is: (identityType) => Number(identityType) === IdentityType.PASSPORT,
        then: (schema) =>
          schema
            .matches(
              /^(?!^0+$)[a-zA-Z0-9]{3,20}$/,
              "Geçerli pasaport no giriniz."
            )
            .required("Bu alan zorunludur."),
        otherwise: (schema) => schema.notRequired(),
      }),
      CountryId: Yup.string().when(["IdentityType"], {
        is: (identityType) => Number(identityType) === IdentityType.PASSPORT,
        then: (schema) => schema.required("Bu alan zorunludur."),
        otherwise: (schema) => schema.notRequired(),
      }),
      DateOfBirth: Yup.string()
        .required("Bu alan zorunludur.")
        .test("date-of-birth", "Geçersiz tarih formatı.", (value) => {
          return (
            moment(value, "YYYY-MM-DD", true).isValid() ||
            moment(value, "YYYY-MM-DDTHH:mm:ss", true).isValid()
          );
        }),
      FirstName: Yup.string().when(["IdentityType"], {
        is: (identityType) => Number(identityType) === IdentityType.PASSPORT,
        then: (schema) => schema.required("Bu alan zorunludur."),
        otherwise: (schema) => schema.notRequired(),
      }),
      LastName: Yup.string().when(["IdentityType"], {
        is: (identityType) => Number(identityType) === IdentityType.PASSPORT,
        then: (schema) => schema.required("Bu alan zorunludur."),
        otherwise: (schema) => schema.notRequired(),
      }),
      Gender: Yup.string().when(["IdentityType"], {
        is: (identityType) => Number(identityType) === IdentityType.PASSPORT,
        then: (schema) => schema.required("Bu alan zorunludur."),
        otherwise: (schema) => schema.notRequired(),
      }),
      CityId: Yup.string().when(["IdentityType"], {
        is: (identityType) => Number(identityType) === IdentityType.PASSPORT,
        then: (schema) => schema.required("Bu alan zorunludur."),
        otherwise: (schema) => schema.notRequired(),
      }),
      CountyId: Yup.string().when(["IdentityType"], {
        is: (identityType) => Number(identityType) === IdentityType.PASSPORT,
        then: (schema) => schema.required("Bu alan zorunludur."),
        otherwise: (schema) => schema.notRequired(),
      }),
      AddressDetail: Yup.string().when(["IdentityType"], {
        is: (identityType) => Number(identityType) === IdentityType.PASSPORT,
        then: (schema) => schema.required("Bu alan zorunludur."),
        otherwise: (schema) => schema.notRequired(),
      }),
      Height: Yup.number()
        .required("Bu alan zorunludur.")
        .max(300, "En fazla 300cm girilebilir."),
      Weight: Yup.number()
        .required("Bu alan zorunludur.")
        .max(300, "En fazla 300kg girilebilir."),
      MobileNumber: Yup.string()
        .matches(
          /^(\d{10}|\d{1}\s?\d{3}\s?\d{3}\s?\d{2}\s?\d{2})$/,
          "Lütfen geçerli bir telefon numarası giriniz."
        )
        .required("Bu alan zorunludur."),
      EmailAddress: Yup.string().email("Geçerli bir e-posta adresi giriniz."),
      IndividualType: Yup.string().when(["ProductType"], {
        is: (productType) => Number(productType) !== ProductType.YBU,
        then: (schema) => schema.required("Bu alan zorunludur."),
        otherwise: (schema) => schema.notRequired(),
      }),
      TransitionCompanyId: Yup.string().when(["IsTransition"], {
        is: (isTransition) => Boolean(isTransition) === true,
        then: (schema) => schema.required("Bu alan zorunludur."),
        otherwise: (schema) => schema.notRequired(),
      }),
    })
  )
  .required("Sigortalı eklenmelidir.")
  .min(1, "En az bir sigortalı girişi yapılmalıdır.");

export const OfferCreateFormSchema = Yup.object().shape({
  KvkkApproval: Yup.bool().oneOf(
    [true],
    "Bu alanının onaylanması gerekmektedir."
  ),
  SubProductId: Yup.string().required("Bu alan zorunludur."),
  Insurer: Yup.object().shape({
    IsSearch: Yup.bool().oneOf([true], "Lütfen sorgulama yapınız."),
    ContactType: Yup.string().required("Bu alan zorunludur."),
    IdentityNumber: Yup.string().when(["ContactType"], {
      is: (contactType) => Number(contactType) === ContactType.GERCEK,
      then: (schema) =>
        schema
          .matches(/^[0-9]{11}$/, "Geçerli bir kimlik numarası giriniz.")
          .required("Bu alan zorunludur."),
      otherwise: (schema) => schema.notRequired(),
    }),
    DateOfBirth: Yup.string().when(["ContactType"], {
      is: (contactType) => Number(contactType) === ContactType.GERCEK,
      then: (schema) =>
        schema
          .required("Bu alan zorunludur.")
          .test("date-of-birth", "Geçersiz tarih formatı.", (value) => {
            return (
              moment(value, "YYYY-MM-DD", true).isValid() ||
              moment(value, "YYYY-MM-DDTHH:mm:ss", true).isValid()
            );
          }),
      otherwise: (schema) => schema.notRequired(),
    }),
    TaxNumber: Yup.string().when(["ContactType"], {
      is: (contactType) => Number(contactType) === ContactType.TUZEL,
      then: (schema) => schema.required("Bu alan zorunludur."),
      otherwise: (schema) => schema.notRequired(),
    }),
    TaxOffice: Yup.string().when(["ContactType"], {
      is: (contactType) => Number(contactType) === ContactType.TUZEL,
      then: (schema) => schema.required("Bu alan zorunludur."),
      otherwise: (schema) => schema.notRequired(),
    }),
    FirstName: Yup.string().when(["ContactType"], {
      is: (contactType) => Number(contactType) === ContactType.TUZEL,
      then: (schema) => schema.required("Bu alan zorunludur."),
      otherwise: (schema) => schema.notRequired(),
    }),
    LastName: Yup.string().when(["ContactType"], {
      is: (contactType) => Number(contactType) === ContactType.TUZEL,
      then: (schema) => schema.required("Bu alan zorunludur."),
      otherwise: (schema) => schema.notRequired(),
    }),
    CityId: Yup.string().when(["ContactType"], {
      is: (contactType) => Number(contactType) === ContactType.TUZEL,
      then: (schema) => schema.required("Bu alan zorunludur."),
      otherwise: (schema) => schema.notRequired(),
    }),
    CountyId: Yup.string().when(["ContactType"], {
      is: (contactType) => Number(contactType) === ContactType.TUZEL,
      then: (schema) => schema.required("Bu alan zorunludur."),
      otherwise: (schema) => schema.notRequired(),
    }),
    AddressDetail: Yup.string().when(["ContactType"], {
      is: (contactType) => Number(contactType) === ContactType.TUZEL,
      then: (schema) => schema.required("Bu alan zorunludur."),
      otherwise: (schema) => schema.notRequired(),
    }),
    MobileNumber: Yup.string()
      .matches(
        /^(\d{10}|\d{1}\s?\d{3}\s?\d{3}\s?\d{2}\s?\d{2})$/,
        "Lütfen geçerli bir telefon numarası giriniz."
      )
      .required("Bu alan zorunludur."),
    EmailAddress: Yup.string().email("Geçerli bir e-posta adresi giriniz."),
  }),
  InsuredInformationList: InsuredInformationListSchema,
});

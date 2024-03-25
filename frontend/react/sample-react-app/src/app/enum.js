export const ProductType = {
  TSS: 0, // SUT
  OSS: 1, // TTB
  YBU: 2, // TTB
  MDP: 3, // SUT
  AVS: 4, // ADD
  SEY: 5, //
  TSS_OSS: 6, // ContractType'a göre TSS ise sut , OSS ise TTB
  TBS: 7, //
  TSU: 8, // SUT
};

export const SubProductType = {
  FERDI: 0,
  GRUP: 1,
};

export const IdentityType = {
  TC_IDENTITY_NUMBER: 0,
  FOREIGN_IDENTITY_NUMBER: 1,
  BLUE_CARD_NUMBER: 2,
  PASSPORT: 3,
  VKN: 4,
};

export const ContactType = {
  TUZEL: 0,
  GERCEK: 1,
};

export const IndividualType = {
  FERT: 1,
  ES: 2,
  COCUK: 3,
  ANNESI: 4,
  BABASI: 5,
  DIGER: 6,
};
export const ApprovalType = {
  HEALTH_DECLARATION: 0,
  KVKK_DECLARATION: 1,
  OFFER: 2,
  POLICY: 3,
};

export const CommissionType = {
  ORAN: 0,
  TUTAR: 1,
};

export const DiscountCategory = {
  SALE_CHANNEL_COMMISSION_DISCOUNT: 0,
  HEAD_OFFICE_DISCOUNT: 1,
};

export const PaymentType = {
  CACH: 0,
  CREDIT_CARD: 1,
  CREDIT: 2,
  MONEY_ORDER: 3,
  MAIL_ORDER: 4,
};

export const ApprovalStatus = {
  PENDING: 0,
  APPROVED: 1,
  NOT_APPROVED: 2,
  AUTHORIZATION: 3,
};

export const OfferStatus = {
  OFFER_REQUEST: 0, //Teklif istek
  OFFER_DECLARATION: 1, //Beyan onayı
  PAYMENT_WAITING: 2, //Ödeme bekliyor
  POLICY_CREATED: 3, //Ödeme tamamlandı poliçe oluşturuldu
  OFFER_AUTH: 4, //teklif otorizasyon
  POLICY_CANCEL: 5, //poliçe iptal
  POLICY_TIMED_OUT: 6, //
  PAYMENT_PROCESSING: 7, //ödeme işlem
  PAYMENT_ERROR: 8, //ödeme hata
  OFFER_CANCEL: 9, //teklif iptal
  OFFER_EXPIRED: 10, //teklif süresi doldu
  OFFER_PROCESSING: 11, //teklif işlemde
  OFFER_FIRST_PACKAGE_SET: 12, //
};

export const TransitionStatus = {
  COMPLETED: 0,
  PENDING: 1,
  NOT_COMPLETED: 2,
};

export const INSURER_TYPE = {
  TUZEL: 0,
  GERCEK: 1,
};

export const ENDORSEMENT_TYPE = {
  SIGORTALI_GIRIS: "1",
  SIGORTALI_CIKIS: "2",
  IPTAL: "3",
};

export const IDENTITY_TYPE = {
  TC: 1,
  YABANCI: 2,
  MAVIKART: 3,
  PASAPORT: 4,
};

export const FIELD_TYPES = [
  "checkbox",
  "radio",
  "select",
  "checkboxButton",
  "payrollStatusButton",
  "instantReportTypeView",
  "StatusText",
  "TooltipText",
  "TooltipView",
  "date",
  "datetime",
  "MediaName",
  "downloadMedia",
  "checkboxAction",
  "action",
  "onHoverAction",
  "imageFile",
  "openToSaleCheckboxButton",
  "currencyFormatter",
  "printOfferButton",
];

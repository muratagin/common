// export const MASTER_IDENTIFIER = "1c73d884-f6ac-41ae-af9b-06fec3abc4f0";  //gerçek master identifer
// export const MASTER_IDENTIFIER = "6341a50b-23b3-44a6-a985-2d02f707a559"; //nippon
export const MASTER_IDENTIFIER = "dfea988b-13d4-4a9f-9cc4-053aa5ac4bb5"; //aveon

export const IMC_IDENTIFIER = "e92287f5-e48b-4f2f-aac8-07eb01f53262";

export const NETWORK_ERROR =
  "IT birimi ile iletişime geçiniz. ErrorCode:ERRUI0001";

/* ------ NIPPONHEALTH DEPLOY------ */
export const PROTOCOL = "https://";
export const URL = "nipponhealth.affinitybox.com";
export const APP_NAME = "api";
export const API_URL = `${PROTOCOL}${URL}`;
export const FILE_SERVER = "https://files.imecedestek.com/v3/preprod";
export const PRINTS_SERVER = "http://192.168.51.4:8081";
export const ENV = "preProd";

/* ------ AVEON DEPLOY------ */
// export const PROTOCOL = "http://";
// export const URL = "10.77.5.44";
// export const APP_NAME = "api";
// export const API_URL = `${PROTOCOL}${URL}`;
// export const FILE_SERVER = "https://files.imecedestek.com/v3/preprod";
// export const PRINTS_SERVER = "http://192.168.51.4:8081";
// export const ENV = "preProd";

/*Protein canlı ve test dosya sunucusu basic auth bilgileri  */
export const FILE_SERVER_USERNAME = "protein";
export const FILE_SERVER_PASSWORD = "3X1Dkbp9#0UaKc4Ee9pY";

export const FOOTER = {
  link: "http://affinitybox.com",
  title: "AffinityBox",
  text: "© 2024, Powered By",
  version: " - v1.25030830", //version.dd.MM.hh:mm
};

export const API_BASE_NAME = {
  8081: "/v3/production", //8081
  8082: "/v3/tpa", //8082π
  6083: "/v3/common", //6083
  8083: "/v3/common", //8083
  8086: "/v3/serviceapp", //8086
  8087: "/v3/companycommon", //8087
  8088: "/v3/provider", //8088
  8089: "/v3/claim", //8089
  8090: "/v3/report", //8090
  8091: "/v3/webservice", //8091
  8141: "/v3/salesbox", //nipponhealth deploy
  // 8141: "8141", //aveon deploy
};

export const currencyType = "₺";

import { MASTER_IDENTIFIER } from "./constant";

export const settings = {
  isTpa: false,
  companyIdentifier: MASTER_IDENTIFIER,
  baseLogo: "/base-logo.svg",
  login: {
    logo: "/login-logo.svg",
    // backgroundColor: "#3ab1e6",
  },
  header: {
    logo: "/company-white-logo.svg",
    backgroundColor: "white",
    icon: {
      userBarBg: "bg-blue-400/10",
      styles: "bg-blue-300/40 text-blue-400 hover:bg-blue-400 hover:text-white",
    },
  },
  sidebar: {
    backgroundColor: "#FEFEFE",
    activeItem: "bg-blue-300/50 text-blue-500",
    activeSubItem: "bg-blue-200/20 !text-blue-400",
    iconColor: "#575757",
  },
};

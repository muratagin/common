import { IdentityType, ProductType } from "@app/enum";

export const identityTypeOptions = (options, currentProductType) => {
  if (currentProductType === ProductType.YBU) {
    return [
      ...options.identityType?.filter(
        (option) =>
          option.value !== IdentityType.BLUE_CARD_NUMBER &&
          option.value !== IdentityType.TC_IDENTITY_NUMBER &&
          option.value !== IdentityType.VKN
      ),
    ];
  } else if (currentProductType === ProductType.OSS) {
    return [
      ...options.identityType?.filter(
        (option) => option.value !== IdentityType.VKN
      ),
    ];
  } else {
    return [];
  }
};

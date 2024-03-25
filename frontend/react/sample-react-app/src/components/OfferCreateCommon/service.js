import { Requests } from "@app/api";
import { getEntityUrl } from "@libs/parser";

export const offerCreate = async (url, content) => {
  const response = await Requests().CommonRequest.post({
    url,
    content,
  });
  return response;
};

export const offerUpdate = async (url, content) => {
  const response = await Requests().CommonRequest.put({
    url,
    content,
  });
  return response;
};

export const getIndividualInformationFromKPS = async (content) => {
  const url = getEntityUrl({
    api: {
      port: 8141,
      url: `Offers/GetIndividualInformationFromKPS?identityNumber=${content?.identityNumber}&birthDate=${content?.birthDate}&identityType=${content?.identityType}`,
    },
  });

  return await Requests().CommonRequest.get({
    url,
  });
};

export const getVknInformationFromKPS = async (taxNumber) => {
  const url = getEntityUrl({
    api: {
      port: 8141,
      url: `Offers/GetVknInformationFromKPS?taxNumber=${taxNumber}`,
    },
  });

  return await Requests().CommonRequest.get({
    url,
  });
};

export const getSubProductForOffer = async (content) => {
  let result;
  const url = getEntityUrl({
    api: {
      port: 8141,
      url: `Offers/GetSubProductForOffer?subProductType=${content?.SubProductType}&productId=${content?.ProductId}`,
    },
  });

  const response = await Requests().CommonRequest.get({
    url,
  });
  if (response && response.data) {
    result = response.data?.map((res) => {
      return { label: res?.Name, value: res?.Ordinal || res?.Id };
    });
  }

  return result;
};

export const getApprovalByType = async (approvalType) => {
  const url = getEntityUrl({
    api: {
      url: `Approvals?filters=Type==${approvalType}&page=1&pageSize=10`,
      port: 8141,
    },
  });

  return await Requests().CommonRequest.get({ url });
};

export const getLookupFromGetByName = async (lookupClassName) => {
  let result = [];
  const url = getEntityUrl({
    api: {
      port: 8141,
      url: `Lookups/GetByName?lookupClassName=${lookupClassName}`,
    },
  });

  const response = await Requests().CommonRequest.get({
    url,
  });

  if (response && response.data && Array.isArray(response.data)) {
    result = response.data.map((res) => {
      return { label: res.Name, value: res.Ordinal };
    });
  }
  return result;
};

export const getCities = async () => {
  let result = [];
  const url = getEntityUrl({
    api: {
      port: 8141,
      url: `Cities`,
    },
  });

  const response = await Requests().CommonRequest.get({
    url,
  });
  if (response && response.data && Array.isArray(response.data)) {
    result = response.data.map((res) => {
      return { label: res.Name, value: res.Ordinal || res.Id };
    });
  }
  return result;
};

export const getCountries = async () => {
  let result = [];
  const url = getEntityUrl({
    api: {
      port: 8141,
      url: `Countries`,
    },
  });

  const response = await Requests().CommonRequest.get({
    url,
  });
  if (response && response.data && Array.isArray(response.data)) {
    result = response.data.map((res) => {
      return { label: res.Name, value: res.Ordinal || res.Id };
    });
  }
  return result;
};

export const getCountiesFilterByCityId = async (cityId) => {
  let result = [];
  const url = getEntityUrl({
    api: {
      port: 8141,
      url: `Counties?filters=CityId==${cityId}`,
    },
  });

  const response = await Requests().CommonRequest.get({
    url,
  });

  if (response && response.data && Array.isArray(response.data)) {
    result = response.data.map((res) => {
      return { label: res.Name, value: res.Ordinal || res.Id };
    });
  }
  return result;
};

export const getTransitionCompanyInformations = async () => {
  let result = [];
  const url = getEntityUrl({
    api: {
      port: 8141,
      url: `TransitionCompanyInformations`,
    },
  });

  const response = await Requests().CommonRequest.get({
    url,
  });
  if (response && response.data && Array.isArray(response.data)) {
    result = response.data.map((res) => {
      return { label: res.CompanyName, value: res.Ordinal || res.Id };
    });
  }
  return result;
};

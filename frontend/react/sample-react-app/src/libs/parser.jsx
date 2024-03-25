import { API_BASE_NAME, API_URL, APP_NAME } from "@app/constant";
import { FEED } from "@app/feed";
import { SIDEBAR } from "@app/sidebar";

export const getFirstEntity = () => {
  let feedData = FEED;
  return feedData?.[0].name;
};
export const getEntityById = (id) => {
  let feedData = FEED;
  return id ? feedData?.find((asset) => asset.id === id) : feedData[0];
};
export const getEntityIdByName = (name) => {
  let feedData = FEED;
  return name ? feedData?.find((asset) => asset.name === name) : feedData[0];
};
export const getAsset = (assetName) => {
  let feedData = FEED;
  return feedData?.find((asset) => asset.name === assetName);
};

export const getEntityUrl = (asset) => {
  if (asset?.api?.port === 8086) {
    return `${API_URL}:${API_BASE_NAME[asset?.api?.port]}/${asset?.api?.url}`;
  } else {
    return `${API_URL}:${API_BASE_NAME[asset?.api?.port]}/${APP_NAME}/${
      asset?.api?.url
    }`;
  }
};

export const getSidebarByAssetId = (assetId) => {
  let findObject;
  let sidebar = SIDEBAR;
  let index = 0;
  while (index < sidebar.length) {
    if (sidebar[index]["children"]) {
      let childrens = sidebar[index]["children"];
      let find = childrens.find((x) => x === assetId);
      if (find) {
        findObject = sidebar[index];
        break;
      }
    }
    index++;
  }
  return findObject;
};

export const getServiceUrl = (service) => {
  if (service.port === 8086) {
    return `${API_URL}:${API_BASE_NAME[service?.port]}/${service.url}`;
  } else {
    return `${API_URL}:${API_BASE_NAME[service?.port]}/${APP_NAME}/${
      service.url
    }`;
  }
};

export const getImportTableComponentUrl = (asset) =>
  `${API_URL}:${asset.group.service.port}/${APP_NAME}/${
    asset.group.importName || asset.group.service.url
  }`; //table.component içerisinde asset farklı oludğu için klonlandı
export const getImportUrl = (asset) =>
  `${API_URL}/${API_BASE_NAME[asset.api.port]}/${APP_NAME}/${
    asset.importName || asset.api.url
  }`;
export const getHistoryUrl = (asset, rowId) => {
  return `${API_URL}/${API_BASE_NAME[6083]}/${APP_NAME}/history/${
    asset.historyName || asset.api.url
  }/${rowId}`;
};
export const getCloneUrl = (asset, rowId) =>
  `${API_URL}/${API_BASE_NAME[6083]}/${APP_NAME}/clone/${asset.name}/${rowId}`;

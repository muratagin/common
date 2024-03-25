import { setup } from "axios-cache-adapter";
import localforage from "localforage";

export const localForageStoreConfig = localforage.createInstance({
  driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
  name: "SalesboxCacheDB",
});

const LocalForageStore = async (key) => {
  let token = localStorage.getItem("token");
  return setup({
    cache: {
      store: localForageStoreConfig,
      maxAge: 1000 * 60 * 20, // 20 min
      key: (req, config) => {
        return key;
      },
    },
    headers: {
      ["Authorization"]: `Bearer ${token}`,
    },
  });
};

export default LocalForageStore;

import { MASTER_IDENTIFIER } from "@app/constant";
import useAppContext from "@libs/context";
import Loading from "@libs/loading";
import LocalForageStore, { localForageStoreConfig } from "@libs/local.forage";
import { getEntityUrl } from "@libs/parser";
import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";

/* 
    Projenin ayağa kaldırılabilmesi için gerekli bilgilerin(feed,sidebar gibi) ve
    hız kaynaklı olarak verilerin bir kere çekilmesi istenen bilgilerin(lookup,companies gibi)
    kullanıcının oturum sürecinde bu veriler ile ilgili işlemlerin yapılabilmesi için yazılmış hook
*/

const ResourcesContext = createContext();

const fetchLookups = async () => {
  const response = await fetchResources(
    { port: 8141, url: "Lookups" },
    { CompanyIdentifier: MASTER_IDENTIFIER },
    "lookups"
  );
  return response;
};

const fetchResources = async (service, headers, key) => {
  let url = getEntityUrl({ api: { port: service.port, url: service.url } });
  const response = await LocalForageStore(key).then(async (api) => {
    return await api.get(url, { headers });
  });
  return response;
};

const ResourcesProvider = ({ children }) => {
  const { isAuthenticated } = useAppContext();
  const initialResource = { loading: false };
  const [resource, setResource] = useState(initialResource);
  const [loading, setLoading] = useState(false);

  const lookupsQuery = useQuery("lookups", fetchLookups, {
    retry: false,
    refetchOnWindowFocus: false,
    enabled: isAuthenticated.result,
  });

  useEffect(() => {
    if (isAuthenticated.result) {
      (async () => {
        await getLocalIndexedDb();
        await Promise.all([lookupsQuery]).then((response) => {
          setLoading(response.some((x) => x.isLoading === true));
        });
        setLoading(false);
      })();
    }
  }, [isAuthenticated.result]);

  useEffect(() => {
    if (!loading && isAuthenticated.result) {
      (async () => {
        setResource({
          lookups: {
            response: {
              ...lookupsQuery.data,
            },
            loading: lookupsQuery.isLoading,
          },
          loading: isAuthenticated.result ? loading : false,
        });
      })();
    }
  }, [loading]);

  const getLocalIndexedDb = async () => {
    try {
      const lookups =
        (await localForageStoreConfig.getItem("lookups")) || lookupsQuery;

      setResource({
        lookups: {
          response: { ...lookups.data },
          loading: lookups.isLoading,
        },
        loading: isAuthenticated.result ? loading : false,
        complete: true,
      });
    } catch (error) {}
  };

  const value = {
    resource,
  };

  return (
    <ResourcesContext.Provider value={value}>
      {loading ? <Loading /> : children}
    </ResourcesContext.Provider>
  );
};

export default ResourcesProvider;

export const useResourcesContext = () => useContext(ResourcesContext);

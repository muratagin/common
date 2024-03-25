import { AxiosInstance } from "./axios.instance";

/* Projede yapılacak crud işlemleri için kullanılan yardımcı fonksiyon */

export const Requests = () => {
  const axiosInstance = AxiosInstance();

  return {
    CommonRequest: {
      async get(data) {
        let result;
        const response = await axiosInstance.get(data.url, {
          params: { ...data.content },
          headers: data.headers,
          loading: data.loading,
        });
        if (response && response.data && response.data?.Data) {
          result = { ...response, data: response.data.Data };
        }

        return result || response;
      },
      async post(data, settings) {
        return await axiosInstance.post(data.url, data.content, {
          ...settings,
          headers: data.headers,
          loading: data.loading,
        });
      },
      async put(data) {
        return await axiosInstance.put(data.url, data.content, {
          headers: data.headers,
          loading: data.loading,
        });
      },
      async delete(data) {
        return await axiosInstance.delete(`${data.url}/${data.content.id}`, {
          headers: data.headers,
          loading: data.loading,
        });
      },
      async getById(data) {
        return await axiosInstance.get(`${data.url}/${data.content.id}`, {
          headers: data.headers,
          loading: data.loading,
        });
      },
    },
  };
};

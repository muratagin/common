import { Requests } from "@app/api";
import { getEntityUrl } from "@libs/parser";
import { checkIfIsEmpty } from "@libs/utils";
import { setLoading } from "@slices/dynamicStyleSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function Shortener() {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [redirectUrl, setRedirectUrl] = useState(null);

  useEffect(() => {
    if (checkIfIsEmpty(params.guidId)) {
      getNavigateUrlFromGuidId(params.guidId);
    } else {
    }
  }, []);

  const getNavigateUrlFromGuidId = async (guidId) => {
    try {
      const url = getEntityUrl({
        api: {
          url: `UrlShorteners/GetByGuid?guid=${guidId}`,
          port: 8141,
        },
      });

      dispatch(setLoading(true));
      const response = await Requests().CommonRequest.get({ url });
      if (response && checkIfIsEmpty(response.data)) {
        setRedirectUrl(response.data?.Content);
      } else {
        navigate("/");
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
    }
  };

  if (checkIfIsEmpty(redirectUrl)) {
    window.open(redirectUrl, "_self");
  } else if (location.state && location.state?.isFormSubmit) {
    return (
      <div className="text-xl font-medium my-12">
        Form başarıyla gönderildi.
      </div>
    );
  } else
    return (
      <div className="text-xl font-medium my-12">
        Bağlantı hatalı veya bağlantı süresi dolmuş.
      </div>
    );
}

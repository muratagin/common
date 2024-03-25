import { getAsset } from "@libs/parser";
import { checkIf } from "@libs/utils";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

const MetaTitle = () => {
  const { pathname } = useLocation();
  const [asset, setAsset] = useState();

  const timeoutModalChannel = new BroadcastChannel("timeoutModal");
  timeoutModalChannel.onmessage = (event) => {
    if (event?.data == false) {
      document.title = checkIf(asset?.label) ? asset?.label : "Salesbox";
    }
  };

  useEffect(() => {
    let splitPathname = window.location.pathname.split("/");
    if (splitPathname.length > 0) {
      let currentAsset = getAsset(splitPathname[1]);
      setAsset(currentAsset);
    }
  }, [pathname]);

  return (
    <Helmet>
      <title>{checkIf(asset?.label) ? asset?.label : "Salesbox"}</title>
    </Helmet>
  );
};

export default MetaTitle;

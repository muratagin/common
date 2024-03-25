import { ENV, FOOTER } from "@app/constant";
import { getBrowserInfo, getCloudflareJSON } from "@libs/utils";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import chromeIcon from "/chrome-icon.png";
import ieIcon from "/ie-icon.png";

export default function Footer() {
  const [whoIs, setWhoIs] = useState(null);

  useEffect(() => {
    (async () => {
      let res = await getCloudflareJSON();
      setWhoIs(res?.ip);
    })();
  }, []);

  return (
    <>
      <footer className="h-16 w-full bg-white p-1 text-center font-montserrat">
        <div className="flex flex-col justify-between text-black lg:flex-row lg:items-center">
          <div className="flex flex-col lg:flex-row lg:space-x-2">
            <span className="text-black">
              <strong>Önerilen Tarayıcı ve Versiyon Bilgileri:</strong>
            </span>
            <div className="flex flex-col lg:flex-row">
              <div className="flex items-center justify-center space-x-2 text-dodger-blue">
                <img className="h-5 w-5" alt="Chrome icon" src={chromeIcon} />
                <Link
                  className="no-underline hover:underline"
                  to={{
                    pathname: "https://www.google.com.tr/intl/tr/chrome/",
                  }}
                  target="_blank"
                >
                  <span>Google Chrome 78+</span>
                </Link>
              </div>
              <div className="flex items-center justify-center space-x-2  text-dodger-blue">
                <img className=" h-5 w-5" alt="IE icon" src={ieIcon} />
                <Link
                  className="no-underline hover:underline"
                  to={{
                    pathname:
                      "https://support.microsoft.com/tr-tr/help/17621/internet-explorer-downloads",
                  }}
                  target="_blank"
                >
                  <span>Internet Explorer 11</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center space-x-2 lg:flex-row">
            <span>
              <strong>Ortam Bilgisi:</strong>
            </span>
            <span className="text-persian-red">
              <strong>{ENV.toLocaleUpperCase()}</strong>
            </span>
          </div>
        </div>
        <hr className="m-1 border-[0.5px] opacity-25" />
        <div className="flex w-full flex-col justify-between text-black lg:flex-row">
          <div className="flex flex-col space-x-1 lg:flex-row">
            <span>
              <strong>IP Adresi:</strong>
            </span>
            <span className="text-green-700">{whoIs ? whoIs : <div />}</span>
            <span variant="subtitle1" display="block">
              <strong>Tarayıcı:</strong>
            </span>
            <span>{getBrowserInfo()}</span>
          </div>
          <span className="font-medium text-navy-blue">
            Salesbox{FOOTER.version}
          </span>
        </div>
      </footer>
    </>
  );
}

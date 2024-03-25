import { ENV, FOOTER } from '@app/constant';
import { getBrowserInfo, getCloudflareJSON } from '@libs/utils';
import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';

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
      <div className="mt-auto flex flex-col items-center justify-between gap-y-2.5 px-5 text-center text-sm text-gray-600 lg:flex-row">
        <div className="flex flex-col gap-2.5 text-sm md:flex-row">
          <div>
            <strong>IP Adresi:</strong>
            {whoIs ? (
              <span className="ml-1 text-success">{whoIs}</span>
            ) : (
              <CircularProgress size={20} />
            )}
          </div>
          <div>
            <strong>Tarayıcı:</strong>
            <span className="ml-1 text-danger">{getBrowserInfo()}</span>
          </div>
        </div>
        <div>
          {FOOTER.text}
          <a href={FOOTER.link} className="ml-1" target="_blank">
            {FOOTER.title}
          </a>
          {FOOTER.version}
        </div>
        <div className="text-sm">
          <div>
            <strong>Ortam Bilgisi:</strong>
            <span className="ml-1 text-danger">{ENV.toLocaleUpperCase()}</span>
          </div>
        </div>
      </div>
    </>
  );
}

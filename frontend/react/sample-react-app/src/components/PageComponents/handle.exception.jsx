import { settings } from '@app/settings';

function HandleException({ error, resetErrorBoundary }) {
  return (
    <div className="mx-auto w-full">
      <div className="flex  items-center justify-center">
        <img
          className="wrongImg"
          width="250"
          src="https://jira-frontend-static.prod.public.atl-paas.net/assets/svg-error-window.364a0f6f985178021e206735ab77fe9c.8.svg"
        ></img>
      </div>
      <div className="p-2. mt-4 text-center font-medium text-black">
        <h2 className="mb-3">Beklenmeyen bir hata oluştu!</h2>
        <span style={{ fontSize: '17px', marginTop: '10px' }}>
          Sayfa bulunamadı veya bir hata oluştu.
          <br></br>Sayfayı yenileyebilir veya daha sonra tekrar
          deneyebilirsiniz.
        </span>
      </div>
      <div className="col flex items-center justify-center">
        <img
          width="240"
          height="100"
          className="object-contain"
          src={settings.baseLogo}
        ></img>
      </div>
      <div className="flex items-center justify-center">
        <button
          onClick={() => (window.location.href = '/')}
          className="btn btn-success"
        >
          Ana Sayfaya Dön
        </button>
      </div>
    </div>
  );
}

export default HandleException;

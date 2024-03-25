export const AuthorizationInsuredInfo = ({ insureds }) => {
  return (
    <div className="flex flex-col relative gap-y-2.5">
      <span className="group-title text-xl">Sigortalı Durumu</span>
      <div className="row group-summary group items-center justify-items-center !bg-danger !border-none">
        {insureds &&
          insureds.map((insured, index) => (
            <li className="list-disc text-white font-medium" key={index}>
              {insured.Result}
            </li>
          ))}
      </div>
    </div>
  );
};

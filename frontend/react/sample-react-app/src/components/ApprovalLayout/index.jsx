import { Outlet } from "react-router-dom";
import Header from "./header";

function ApprovalLayout() {
  return (
    <div className="flex flex-col w-full">
      <Header />
      <div className="container mx-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default ApprovalLayout;

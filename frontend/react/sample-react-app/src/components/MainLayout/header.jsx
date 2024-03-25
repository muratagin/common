import { settings } from "@app/settings";
import Icon from "@components/icon";
import useAppContext from "@libs/context";
import { MySwalData } from "@libs/myswaldata";
import TableComponent from "@libs/table.component";
import { IconButton } from "@mui/material";
import { setIsOpen } from "@slices/dynamicStyleSlice";
import { reset } from "@slices/userSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { AssetCreate } from "../asset.create";
import { AssetEdit } from "../asset.edit";
import { AssetIndex } from "../asset.index";
import DynamicComponent from "../dynamic.component";
import Modal from "../modal";

export default function Header() {
  const dispatch = useDispatch();
  const { setAuthenticated } = useAppContext();
  const { isOpen } = useSelector((state) => state.dynamicStyle);
  const [modalItem, setModalItem] = useState({ show: false, item: undefined });
  const MySwal = withReactContent(Swal);
  const { user } = useSelector((state) => state.user);

  const handleClick = () => {
    MySwal.fire(
      MySwalData("custom", {
        title: "Çıkış Yap",
        icon: "info",
        html: "Çıkış yapılsın mı?",
        allowOutsideClick: false,
        timer: 5000,
        timerProgressBar: true,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Çıkış Yap",
        cancelButtonText: "Vazgeç",
      })
    ).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  const logout = () => {
    setAuthenticated({ progress: false, result: false });
    localStorage.clear("token");
    localStorage.clear("user");
    dispatch(reset());
  };

  const handleClose = () => {
    setModalItem({ show: false, item: undefined });
  };

  const handleSidebar = () => {
    dispatch(setIsOpen(!isOpen));
  };

  return (
    <header
      // style={{
      //   backgroundColor: settings.header.backgroundColor,
      // }}
      className="px-4 flex h-16 items-center justify-between gap-3 border-b-[1px] bg-company-primary"
    >
      <Link to="/" className="flex h-full items-center justify-center">
        <img
          className="w-full max-w-32 bg-contain"
          src={settings.header.logo}
        />
      </Link>
      {/* <Navbar /> */}
      <div className="flex items-center justify-end gap-x-1 text-white lg:grow">
        <div
          className={`lg:bg-company-secondary flex gap-x-2.5 items-center lg:gap-x-2.5 rounded-lg lg:pl-2`}
        >
          <span className="whitespace-break-spaces text-sm font-semibold hidden lg:flex">
            {user && user?.UserName + " - " + user?.SaleChannelName}
          </span>
          <IconButton
            id="user-menu-button"
            aria-haspopup="true"
            onClick={() => handleSidebar()}
            className={`${settings.header.icon.styles} lg:ml-1 h-full cursor-pointer items-center rounded-lg border-none p-2 text-center flex lg:hidden bg-success text-white`}
          >
            <Icon icon="CiMenuFries" className="text-lg" />
          </IconButton>
          <IconButton
            id="user-menu-button"
            aria-haspopup="true"
            onClick={() => handleClick()}
            className={`${settings.header.icon.styles} lg:ml-1 flex h-full cursor-pointer items-center lg:rounded-s-none rounded-lg border-none p-2 text-center bg-success text-white`}
          >
            <Icon icon="MdLogout" className="text-lg text-white" />
          </IconButton>
        </div>
      </div>
      {modalItem.show && (
        <ActionModal data={modalItem} onClose={handleClose}></ActionModal>
      )}
    </header>
  );
}

function ActionModal({ data, onClose }) {
  const [actionModal, setActionModal] = useState(true);
  return (
    <Modal
      className="actionModal"
      size="xl"
      open={actionModal}
      onClose={() => {
        setActionModal(false);
        onClose();
      }}
      title={data.item.label || data.item.name}
    >
      {data.item.mode === "create" && (
        <AssetCreate
          isModal={true}
          asset={data.item.entityName}
          id={data.item.boundId}
        />
      )}
      {data.item.mode === "edit" && (
        <AssetEdit
          isModal={true}
          asset={data.item.entityName}
          id={data.item.boundId}
        />
      )}
      {data.item.mode === "index" && (
        <AssetIndex
          isModal={true}
          asset={data.item.entityName}
          id={data.item.boundId}
          boundCI={data.item.companyIdentifier}
          isBoundEntity={true}
        />
      )}
      {data.item.mode === "component" && (
        <DynamicComponent
          component={{ name: data.item.entityName }}
          boundId={data.item.boundId}
          boundCI={data.item.companyIdentifier}
        />
      )}
      {data.item.mode === "table" && (
        <TableComponent
          boundId={data.item.boundId}
          boundCI={data.item.companyIdentifier}
          entityName={data.item.entityName}
          {...data.item}
        />
      )}
    </Modal>
  );
}
const LinkButton = ({ icon = "FaUserAlt", href }) => {
  return (
    <NavLink
      to={href}
      className={`${settings.header.icon.styles} flex max-h-10 cursor-pointer items-center rounded-lg border-none p-2 text-center text-lg`}
    >
      <Icon icon={icon} />
    </NavLink>
  );
};

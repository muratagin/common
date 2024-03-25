import { settings } from "@app/settings";
import { SIDEBAR } from "@app/sidebar";
import { getAsset } from "@libs/parser";
import { checkIf, checkPrivilegeInRoles } from "@libs/utils";
import { List } from "@mui/material";
import { setIsOpen } from "@slices/dynamicStyleSlice";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Icon from "../icon";
import NavCollapse from "./nav.collapse";

function Sidebar() {
  const windowSize = useRef([window.innerWidth, window.innerHeight]);
  const isMobileSize = windowSize.current[0] >= 768;

  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(null);
  const [activeUrl, setActiveUrl] = useState();
  const { user } = useSelector((state) => state.user);
  const { isOpen: open } = useSelector((state) => state.dynamicStyle);
  const userRoles = user?.Roles;

  let sidebar =
    checkIf(SIDEBAR) &&
    Array.isArray(SIDEBAR) &&
    SIDEBAR.filter((item) => {
      if (checkIf(item.privilege)) {
        if (checkPrivilegeInRoles(item.privilege.id, userRoles)) return item;
      } else return item;
    });

  const handleDrawerClose = () => {
    dispatch(setIsOpen(!open));
  };

  useEffect(() => {
    let getFirstPath = window.location.pathname.split("/");
    setActiveUrl(getAsset(getFirstPath[1])?.name);

    if (!isMobileSize) {
      dispatch(setIsOpen(false));
    }
  }, [pathname]);

  return (
    <div
      style={{
        color: settings.sidebar.textColor,
        backgroundColor: settings.sidebar.backgroundColor,
      }}
      className={classNames({
        "no-scrollbar flex-shrink-0 overflow-y-scroll text-matter-horn transition-all duration-500 fixed h-full lg:static lg:h-auto z-50 top-0": true,
        "!w-0 lg:!w-14 overflow-hidden": !open,
        "w-72 2xl:w-80": open,
      })}
    >
      <div
        className={classNames({
          "flex w-full items-center justify-between p-3": true,
          "px-5": open,
          "px-1.5": !open,
        })}
      >
        <span
          className={classNames({
            "flex flex-shrink-0 font-bold transition-all duration-500": true,
            "visible flex": open,
            "invisible hidden": !open,
          })}
        >
          {user?.UserName}
        </span>
        <button
          style={{ color: settings.sidebar.iconColor }}
          onClick={() => handleDrawerClose()}
          className={classNames({
            "rounded-full h-10 w-10 flex justify-center items-center hover:bg-blue-100 transition-all duration-300": true,
          })}
          type="button"
        >
          <Icon
            icon="TfiAngleLeft"
            subs={3}
            className={classNames({
              "h-5 w-5 transition-all duration-500": true,
              "rotate-180": !open,
            })}
          />
        </button>
      </div>
      <nav
        className={classNames({
          "!w-14 overflow-hidden": !open,
          " w-72 2xl:w-80": open,
        })}
      >
        <List component="nav">
          {sidebar &&
            sidebar.length > 0 &&
            sidebar?.map((item, index) => (
              <NavCollapse
                isShowFavorites={index === 0}
                key={index}
                menu={item}
                level={1}
                isOpen={open}
                activeUrl={activeUrl}
                selected={selected}
                setSelected={(id) => setSelected(id !== selected ? id : null)}
              />
            ))}
        </List>
      </nav>
    </div>
  );
}

export default Sidebar;

import { settings } from "@app/settings";
import { getEntityById, getEntityIdByName } from "@libs/parser";
import { checkIf, checkPrivilegeInRoles } from "@libs/utils";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Icon from "../icon";
import NavItem from "./nav";

const NavCollapse = ({
  menu,
  level,
  isOpen,
  selected,
  setSelected,
  activeUrl,
  isShowFavorites,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [isSubItemSelected, setIsSubItemSelected] = useState(false);
  const { user } = useSelector((state) => state.user);
  const userRoles = user?.Roles;

  const menus =
    menu &&
    menu?.children &&
    menu.children.length > 0 &&
    menu?.children.filter((item) => {
      const entity = getEntityById(item);
      if (
        !checkIf(entity?.privilege) ||
        (checkIf(entity?.privilege) &&
          checkPrivilegeInRoles(entity?.privilege.id, userRoles))
      )
        return item;
    });

  const handleClick = () => {
    if (menu && !menu.children) {
      navigate(menu.href);
    } else {
      setSelected(menu.name);
    }
  };

  const handlePopoverClick = (event) => {
    setAnchorEl(event.currentTarget);
    selected !== menu.name && setSelected(menu.name);
  };

  const popoverOpen = Boolean(anchorEl);
  const popoverId = popoverOpen ? "simple-popover" : undefined;

  useEffect(() => {
    setActiveItem(getEntityIdByName(activeUrl)?.id);
    menus?.find((id) => getEntityById(id)?.name === activeUrl)
      ? setIsSubItemSelected(true)
      : setIsSubItemSelected(false);
  }, [activeUrl]);

  return (
    <>
      <div key={menu.name} className="cursor-pointer">
        <ListItemButton
          className={classNames({
            "gap-x-2 rounded-xl rounded-l-none": true,
            "h-11 !justify-center": !isOpen,
            "!bg-transparent": level > 1,
          })}
          selected={selected === menu.name}
          aria-describedby={popoverId}
          onClick={(e) => {
            isOpen || !menu.children ? handleClick() : handlePopoverClick(e);
          }}
        >
          <Icon
            style={{
              color: settings.sidebar.iconColor,
            }}
            icon={menu.icon}
            className={classNames({
              "ml-0 mr-3 flex h-5 w-5 flex-shrink-0 ": true,
              "ml-3": !isOpen,
              "text-blue-600": isSubItemSelected && menus,
            })}
          />
          <ListItemText
            primary={
              <Typography
                color="inherit"
                className={classNames({
                  "text-blue-600": isSubItemSelected && menus,
                })}
                sx={{ fontSize: "14px", my: "auto", opacity: isOpen ? 1 : 0 }}
              >
                {menu.name}
              </Typography>
            }
          />
          {menu && menu.children ? (
            isOpen && (
              <Icon
                icon="TfiAngleDown"
                className={classNames({
                  "h-3.5 w-3.5 transition-all duration-500": true,
                  "rotate-180": selected === menu.name,
                  "text-blue-600": isSubItemSelected && menus,
                })}
                subs={3}
              />
            )
          ) : (
            <></>
          )}
        </ListItemButton>

        <Collapse
          in={isOpen && selected === menu.name}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding>
            {menus &&
              menus.map((item) => (
                <NavItem
                  activeUrl={activeUrl}
                  key={item}
                  level={level + 1}
                  item={getEntityById(item)}
                  isOpen={isOpen}
                  anchorEl={anchorEl}
                  activeItem={activeItem}
                  handleClose={() => setAnchorEl(null)}
                />
              ))}
          </List>
        </Collapse>
      </div>
      <Popover
        id={popoverId}
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
          setSelected(null);
        }}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
      >
        <List disablePadding>
          {menus &&
            menus.map((item) => (
              <NavItem
                activeUrl={activeUrl}
                key={item}
                level={level + 1}
                item={getEntityById(item)}
                isOpen={isOpen}
                anchorEl={anchorEl}
                activeItem={activeItem}
                handleClose={() => setAnchorEl(null)}
              />
            ))}
        </List>
      </Popover>
    </>
  );
};

export default NavCollapse;

import { ListItem, ListItemText, Stack, Typography } from "@mui/material";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NavItem = ({ activeUrl, item, level, handleClose }) => {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  const refresh = () => {
    handleClose();
    if (item.redirect) {
      navigate(`/${item?.redirect?.route}/${user?.SaleChannelId}`);
    } else {
      navigate(`/${item?.name}`);
    }
  };

  return (
    <ListItem
      key={item?.id}
      disablePadding
      sx={{ display: "block" }}
      className={classNames({
        "bg-[#E6EFF9]/50": activeUrl === item?.name,
        "cursor-pointer rounded-xl rounded-l-none": true,
        "hover:bg-[#E6EFF9]": true,
      })}
    >
      <Stack direction="row" justifyContent="start" alignItems="center" px={1}>
        <div
          onClick={refresh}
          className={classNames({
            "w-full items-start rounded-sm px-2 py-0.5 pl-12": true,
            "bg-transparent": level > 1,
            "hover:bg-[#E6EFF9]": true,
          })}
        >
          <ListItemText
            primary={
              <Typography variant="overline" sx={{ fontSize: "10px" }}>
                {item?.label}
              </Typography>
            }
          />
        </div>
      </Stack>
    </ListItem>
  );
};

export default NavItem;

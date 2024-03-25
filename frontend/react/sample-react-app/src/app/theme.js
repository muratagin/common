import { createTheme } from "@mui/material";

export const theme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: () => ({
          ...{
            borderBottomLeftRadius: "0px",
            borderBottomRightRadius: "0px",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            // boxShadow: '0px -10px 20px rgba(0, 0, 0, 0.1)',
            header: {
              display: "none",
            },
            ".rdt_Table": {
              //   maxWidth: ownerState?.currenttablewidth,
              top: "-10px",
              overflowX: "auto",
              minHeight: "50px",
              maxHeight: "80vh",
              // maxHeight: "450px",
            },
            ".rdt_TableCol": {
              //   minWidth: `${100 / ownerState?.datacolumncount}%`,
              fontSize: "12px",
              margin: "1px",
              wordBreak: "break-word",
              color: "#FF5800",
              padding: "10px",
              fontWeight: "600",
              "div>div": {
                overflow: "visible",
                whiteSpace: "normal",
              },
              border: "none",
            },
            ".rdt_TableCell": {
              //   minWidth: `${100 / ownerState?.datacolumncount}%`,
              "div:first-child": {
                whiteSpace: "normal",
                display: "flex",
              },
              ":first-of-type": {
                whiteSpace: "normal",
                paddingLeft: "18px",
              },
              verticalAlign: "middle",
              button: {
                margin: "1px",
              },
              borderBottom: "none !important",
              fontSize: "12px !important",
              color: "#333",
              backgroundColor: "#f4f4f4 !important",
              fontWeight: "400 !important",
            },
            ".rdt_TableRow": {
              border: "0px",
              minHeight: "70px",
              justifyContent: "space-between",
            },
            ".rdt_TableHeadRow": {
              minHeight: "60px",
              justifyContent: "space-between",
              backgroundColor: "#fff !important",
              border: "none !important",
              marginTop: "0.5rem !important",
              marginBottom: "0.5rem !important",
              '[data-column-id="1"]': {
                paddingLeft: "8px",
              },
            },
            ".rdt_TableBody": {
              backgroundColor: "#f4f4f4 !important",
            },
            ".rdt_Pagination": {
              border: "none !important",
              borderBottomLeftRadius: "10px !important",
              borderBottomRightRadius: "10px !important",
              borderTopLeftRadius: "0px !important",
              borderTopRightRadius: "0px !important",
              backgroundColor: "white !important",
              paddingTop: "1rem !important",
              paddingBottom: "1rem !important",
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
            },
          },
        }),
      },
    },
  },
});

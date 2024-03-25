import { Requests } from "@app/api";
import Icon from "@components/icon";
import { MySwalData } from "@libs/myswaldata";
import { getEntityUrl } from "@libs/parser";
import { checkIfIsEmpty, currencyFormat, resErrorMessage } from "@libs/utils";
import { Table } from "@radix-ui/themes";
import { setLoading } from "@slices/dynamicStyleSlice";
import moment from "moment";
import React from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const DiscountsTable = ({ discounts, setDiscounts, getPageData }) => {
  const dispatch = useDispatch();
  const MySwal = withReactContent(Swal);

  const columns = [
    {
      name: "İndirim Türü",
      selector: (row) => row.Category,
    },
    {
      name: "İndirim Oranı",
      selector: (row) => <span>%{row.Rate}</span>,
    },
    {
      name: "İndirim Tutarı",
      selector: (row) => (
        <span>{checkIfIsEmpty(row.Amount) && currencyFormat(row.Amount)}</span>
      ),
    },
    {
      name: "Uygulayan Kişi",
      selector: (row) => row.CreatedByName,
    },
    {
      name: "Uygulama Tarihi",
      selector: (row) => (
        <span>
          {checkIfIsEmpty(row.CreatedDate) &&
            moment(row.CreatedDate).format("DD-MM-yyyy HH:mm")}
        </span>
      ),
    },
    {
      name: "İşlemler",
      key: "actions",
    },
  ];

  const handleRemove = async (discount) => {
    try {
      const url = getEntityUrl({
        api: { port: 8141, url: "Discounts" },
      });

      MySwal.fire(MySwalData("delete")).then(async (result) => {
        if (result.isConfirmed) {
          dispatch(setLoading(true));
          const response = await Requests().CommonRequest.delete({
            url,
            content: { id: discount.Id },
          });
          if (response && response.data && response.data?.IsSuccess) {
            const newDiscounts = discounts.filter(
              (currentDiscount) => currentDiscount.Id !== discount.Id
            );
            setDiscounts(newDiscounts);
            getPageData && getPageData();
          }
          dispatch(setLoading(false));
        }
      });
    } catch (error) {
      const errorMessage = resErrorMessage(error);
      MySwal.fire(
        MySwalData("error", {
          text: errorMessage,
        })
      );
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      {discounts && discounts.length > 0 && (
        <div className="flex flex-col relative gap-y-2.5 mt-5">
          <div className="flex flex-col gap-y-2 p-4 lg:p-0 flex-shrink-0">
            <span className="group-title text-xl">Uygulanan İndirimler</span>
          </div>

          <Table.Root
            variant="surface"
            className="border-none bg-white shadow-md"
          >
            <Table.Header className="bg-white-smoke">
              <Table.Row align="center" className="text-primary">
                {columns.map((column, index) => (
                  <React.Fragment key={index}>
                    <Table.ColumnHeaderCell>
                      {column.name}
                    </Table.ColumnHeaderCell>
                  </React.Fragment>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {discounts &&
                discounts.map((discount, index) => (
                  <Table.Row key={index}>
                    {columns.map((column, index) => (
                      <Table.Cell key={index}>
                        <TableCellSelector
                          column={column}
                          key={index}
                          handleClick={() => handleRemove(discount)}
                          value={column.selector && column.selector(discount)}
                        />
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
            </Table.Body>
          </Table.Root>
        </div>
      )}
    </>
  );
};

const TableCellSelector = ({ column, value, handleClick }) => {
  switch (column.key) {
    case "actions":
      return <ActionsView handleClick={handleClick} />;
    default:
      return <div className="flex items-center h-full">{value}</div>;
  }
};

const ActionsView = ({ handleClick }) => {
  return (
    <div className="flex items-center gap-x-1">
      <button
        onClick={handleClick}
        type="button"
        className="btn btn-danger p-2 rounded-full text-white"
      >
        <Icon icon="FaTrash" className="size-3" />
      </button>
    </div>
  );
};

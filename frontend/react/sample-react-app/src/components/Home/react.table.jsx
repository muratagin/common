import { Table } from "@radix-ui/themes";
import _ from "lodash";

function ReactTable({ data = [], columns = [] }) {
  return (
    <Table.Root variant="surface" className="border-none bg-white">
      <Table.Header className="">
        <Table.Row className="text-primary">
          {columns.map((column, index) => (
            <Table.ColumnHeaderCell key={index}>
              {column.name}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map((currentData, index) => (
          <Table.Row key={index}>
            {columns.map((column, index) => (
              <Table.Cell key={index}>
                {column.selector(currentData)}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
        {data.length > 0 && columns.length > 0 && (
          <Table.Row className="bg-success bg-opacity-60">
            <Table.Cell className="font-bold">TOPLAM</Table.Cell>
            {columns.slice(1).map((column, index) => (
              <Table.Cell key={index} className="font-bold">
                {_.sum(_.map(data, (d) => d[column.key]))}
              </Table.Cell>
            ))}
          </Table.Row>
        )}
      </Table.Body>
    </Table.Root>
  );
}

export default ReactTable;

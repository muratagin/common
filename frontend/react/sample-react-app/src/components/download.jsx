import { getValues } from '@libs/utils';
import { useEffect } from 'react';
import { utils, writeFileXLSX } from 'xlsx';

export const DownloadExcel = ({
  show,
  onClose,
  disabled,
  dataset,
  filename,
  columns,
  displayName,
  type,
}) => {
  const getData = () => {
    const columnsRefactored =
      type === 'remaining'
        ? columns.slice(2, columns.length)
        : type === 'getAllColumns'
        ? columns
        : columns.slice(0, columns.length - 1);
    if (type === 'remaining') {
      columnsRefactored.push({
        index: columnsRefactored.length,
        name: 'RESULT',
        selector: 'progress.error',
      });
    }
    let data = dataset.map(x => {
      let obj = {};
      columnsRefactored.map(column => {
        obj[column.name] = getValues('.', column?.selector, x);
      });
      return obj;
    });
    return data;
  };

  const exportFile = () => {
    const ws = utils.json_to_sheet(getData());
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Data');
    writeFileXLSX(wb, `${filename}.xlsx`);
  };
  useEffect(() => {
    if (show === true) {
      exportFile();
      onClose();
    }
  }, [show]);

  return (
    <button
      className="btn btn-primary text-sm"
      disabled={disabled}
      onClick={exportFile}
    >
      {displayName}
    </button>
  );
};

import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
const FirstPage = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
      role="presentation"
    >
      <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z" />
      <path fill="none" d="M24 24H0V0h24v24z" />
    </svg>
  );
};
const LastPage = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
      role="presentation"
    >
      <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" />
      <path fill="none" d="M0 0h24v24H0V0z" />
    </svg>
  );
};
const Left = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
      role="presentation"
    >
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  );
};
const Right = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
      role="presentation"
    >
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  );
};
const DropDownIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M7 10l5 5 5-5z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  );
};
const SMALL = 599;
const MEDIUM = 959;
const LARGE = 1280;
const media = {
  sm: (literals, ...args) => css`
    @media screen and (max-width: ${SMALL}px) {
      ${css(literals, ...args)}
    }
  `,
  md: (literals, ...args) => css`
    @media screen and (max-width: ${MEDIUM}px) {
      ${css(literals, ...args)}
    }
  `,
  lg: (literals, ...args) => css`
    @media screen and (max-width: ${LARGE}px) {
      ${css(literals, ...args)}
    }
  `,
  custom:
    value =>
    (literals, ...args) =>
      css`
        @media screen and (max-width: ${value}px) {
          ${css(literals, ...args)}
        }
      `,
};
const PaginationWrapper = styled.nav`
  display: flex;
  flex: 1 1 auto;
  justify-content: flex-end;
  align-items: center;
  box-sizing: border-box;
  // padding-right: 8px;
  padding-left: 8px;
  width: 100%;
  ${({ theme }) => theme.pagination.style};
`;
const InfoPaginationWrapper = styled.nav`
  display: flex;
  flex: 1 1 auto;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  // padding-right: 8px;
  padding-left: 8px;
  width: 100%;
  ${({ theme }) => theme.pagination.style};
`;
const Button = styled.button`
  position: relative;
  display: block;
  user-select: none;
  border: none;
  ${({ theme }) => theme.pagination.pageButtonsStyle};
`;
const PageList = styled.div`
  display: flex;
  align-items: center;
  border-radius: 4px;
  white-space: nowrap;
  ${media.sm`
    width: 100%;
    justify-content: space-around;
  `};
`;
const defaultComponentOptions = {
  rowsPerPageText: 'Rows per page:',
  rowsPerPageLeftText: 'Satır Sayısı:',
  rowsPerPageRightText: 'adet kayıt göster.',
  rangeSeparatorText: 'of',
  rangeSeparatorLeftText: 'Toplam',
  rangeSeparatorMiddleText: 'kayıt içerisinden',
  rangeSeparatorEndText: 'Kayıt Bulunmaktadır',
  rangeSeparatorRightText: 'arasındakileri görüntülemektesiniz.',
  noRowsPerPage: false,
  selectAllRowsItem: false,
  selectAllRowsItemText: 'All',
};
const Span = styled.span`
  flex-shrink: 1;
  user-select: none;
`;
const Range = styled(Span)`
  font-size: 10px;
  margin: 0 4px;
`;
const InfoRange = styled(Span)`
  font-size: 14px;
  margin: 0 4px;
`;
const RowLabel = styled(Span)`
  font-size: 10px;
  margin: 0 4px;
`;
const SelectControl = styled.select`
  cursor: pointer;
  height: 24px;
  max-width: 100%;
  user-select: none;
  padding-left: 8px;
  padding-right: 24px;
  box-sizing: content-box;
  font-size: inherit;
  color: inherit;
  border: none;
  background-color: transparent;
  appearance: none;
  direction: ltr;
  flex-shrink: 0;

  &::-ms-expand {
    display: none;
  }

  &:disabled::-ms-expand {
    background: #f60;
  }

  option {
    color: initial;
  }
`;
const SelectWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
  font-size: 10px;
  color: inherit;

  svg {
    top: 0;
    right: 0;
    color: inherit;
    position: absolute;
    fill: currentColor;
    width: 24px;
    height: 24px;
    display: inline-block;
    user-select: none;
    pointer-events: none;
  }
`;
const Select = ({ defaultValue, onChange, ...rest }) => (
  <SelectWrapper>
    <SelectControl onChange={onChange} defaultValue={defaultValue} {...rest} />
    <DropDownIcon />
  </SelectWrapper>
);
const useWindowSize = () => {
  const isClient = typeof window === 'object';

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return () => null;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};
export const DataTablePaginationComponent = ({
  currentPage,
  rowCount,
  rowsPerPage,
  onChangePage,
  onChangeRowsPerPage,
}) => {
  function getNumberOfPages(rowCount, rowsPerPage) {
    return Math.ceil(rowCount / rowsPerPage);
  }
  const windowSize = useWindowSize();
  const shouldShow = windowSize.width && windowSize.width > SMALL;
  const paginationRowsPerPageOptions = [10, 15, 20, 25, 30];
  const options = { ...defaultComponentOptions };
  const numPages = getNumberOfPages(rowCount, rowsPerPage);
  const disabledLesser = currentPage === 1;
  const disabledGreater = currentPage === numPages;

  const lastIndex = currentPage * rowsPerPage;
  const firstIndex = lastIndex - rowsPerPage + 1;
  const range =
    currentPage === numPages
      ? `${options.rangeSeparatorLeftText} ${rowCount} ${options.rangeSeparatorMiddleText} ${firstIndex}-${rowCount} ${options.rangeSeparatorRightText} `
      : `${options.rangeSeparatorLeftText} ${rowCount} ${options.rangeSeparatorMiddleText} ${firstIndex}-${lastIndex} ${options.rangeSeparatorRightText}`;

  const selectOptions = paginationRowsPerPageOptions.map(num => (
    <option key={num} value={num}>
      {num}
    </option>
  ));

  const select = (
    <Select
      onChange={e => onChangeRowsPerPage(Number(e.target.value), currentPage)}
      defaultValue={rowsPerPage}
      aria-label={options.rowsPerPageLeftText}
    >
      {selectOptions}
    </Select>
  );
  return (
    <PaginationWrapper className="rdt_Pagination">
      {!options.noRowsPerPage && shouldShow && (
        <>
          <RowLabel>{options.rowsPerPageLeftText}</RowLabel>
          {select}
          {/* <RowLabel>{options.rowsPerPageRightText}</RowLabel> */}
        </>
      )}
      {shouldShow && <Range>{range}</Range>}
      <PageList>
        <Button
          id="pagination-first-page"
          type="button"
          aria-label="First Page"
          aria-disabled={disabledLesser}
          onClick={() => onChangePage(1)}
          disabled={disabledLesser}
        >
          <FirstPage />
        </Button>
        <Button
          id="pagination-previous-pagee"
          type="button"
          aria-label="Previous Page"
          aria-disabled={disabledLesser}
          onClick={() => onChangePage(currentPage - 1)}
          disabled={disabledLesser}
        >
          <Left />
        </Button>
        <Button
          id="pagination-next-page"
          type="button"
          aria-label="Last Page"
          aria-disabled={disabledGreater}
          onClick={() => onChangePage(currentPage + 1)}
          disabled={disabledGreater}
        >
          <Right />
        </Button>
        <Button
          id="pagination-last-page"
          type="button"
          aria-label="First Page"
          aria-disabled={disabledGreater}
          onClick={() => onChangePage(getNumberOfPages(rowCount, rowsPerPage))}
          disabled={disabledGreater}
        >
          <LastPage />
        </Button>
      </PageList>
    </PaginationWrapper>
  );
};
export const DataTableInfoComponent = ({
  currentPage,
  rowCount,
  rowsPerPage,
  onChangePage,
  onChangeRowsPerPage,
}) => {
  function getNumberOfPages(rowCount, rowsPerPage) {
    return Math.ceil(rowCount / rowsPerPage);
  }
  const windowSize = useWindowSize();
  const shouldShow = windowSize.width && windowSize.width > SMALL;
  const options = { ...defaultComponentOptions };
  const numPages = getNumberOfPages(rowCount, rowsPerPage);
  const range =
    currentPage === numPages
      ? `${options.rangeSeparatorLeftText} ${rowCount} ${options.rangeSeparatorEndText} `
      : `${options.rangeSeparatorLeftText} ${rowCount} ${options.rangeSeparatorEndText} `;

  return (
    <InfoPaginationWrapper className="rdt_Pagination">
      {shouldShow && <InfoRange>{range}</InfoRange>}
    </InfoPaginationWrapper>
  );
};

// export default DataTablePaginationComponent;

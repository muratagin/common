import { Requests } from '@app/api';
import { IMC_IDENTIFIER } from '@app/constant';
import { AssetCreate } from '@components/asset.create';
import { AssetDisplay } from '@components/asset.display';
import { AssetEdit } from '@components/asset.edit';
import { AssetIndex } from '@components/asset.index';
import {
  checkIf,
  checkIfCompanyIdentifierFoundUrl,
  checkIfIsEmpty,
  checkUrlPageSizeController,
  compareValues,
  getFilterArray,
  getFilterString,
  isObjectIsNotEmpty,
  trimIf,
} from '@libs/utils';
import { setCurrentEntity, setIdentifier } from '@slices/selectionSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes, useParams } from 'react-router-dom';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const useObservable = (observable, setter) => {
  useEffect(() => {
    let subscription = observable.subscribe(result => setter(result));
    return () => subscription.unsubscribe();
  }, [observable, setter]);
};

export const fetchAsync = async (data, setTableData) => {
  if (data.url) {
    let loading = true;
    let {
      filterData,
      url,
      params,
      page,
      pageSize,
      identifier,
      headers,
      orderBy,
      returnModel,
    } = data;
    let checkAnyFilterProp =
      checkIf(filterData) &&
      Object.values(filterData).some(
        param =>
          trimIf(param.value) !== '' &&
          param.value !== null &&
          param.value !== undefined
      );
    let filters = '';

    if (checkAnyFilterProp) {
      filters = getFilterString(filterData, '?');
    }
    params = { ...params, page, pageSize };
    let isUrlFilters;
    if (
      isObjectIsNotEmpty(params) &&
      checkIfIsEmpty(params?.filters) &&
      checkIfIsEmpty(filters)
    ) {
      filters += ',' + params.filters;
      isUrlFilters = true;
    }
    if (checkUrlPageSizeController(data.url)) {
      params = {};
    } else {
      params = { ...params, page, pageSize };
    }
    if (checkIf(orderBy)) {
      if (checkAnyFilterProp) {
        filters += `&Sorts=${orderBy}`;
      } else {
        filters += `?Sorts=${orderBy}`;
      }
    }
    try {
      if (!checkIf(headers)) {
        headers = {};
      }
      headers['CompanyIdentifier'] = identifier;
      checkIf(setTableData) &&
        setTableData(state => ({ ...state, loading: true }));

      let response = await Requests().CommonRequest.get({
        url: url + filters,
        content: !isUrlFilters && params,
        headers,
      });
      let totalRows = Number(response.headers['x-total-count']);
      loading = false;
      if (
        checkIf(response.data) &&
        response.data.length >= 1 &&
        response.data[0].hasOwnProperty('JsonData')
      ) {
        response.data = response.data.map(x =>
          x.hasOwnProperty('JsonData') ? { ...x, ...JSON.parse(x.JsonData) } : x
        );
      }
      if (checkIf(data?.sortExceptional) && checkIf(response?.data)) {
        let sorttedArray;
        let isDesc = data?.sortExceptional.charAt(0) == '-';
        sorttedArray = response.data.sort(
          compareValues(data.sortExceptional, isDesc ? 'desc' : 'asc')
        );
        response.data = sorttedArray;
      }
      return {
        loading,
        data: returnModel ? response.data?.[returnModel] : response?.data,
        totalRows,
        isFiltering: true,
      };
    } catch (error) {
      checkIf(setTableData) &&
        setTableData(state => ({
          ...state,
          loading: false,
        }));
      loading = false;
      if (
        error.response?.status === 404 &&
        (url.endsWith('/insuredexclusions') ||
          url.endsWith('/contactnotes') ||
          url.endsWith('/insurednotes'))
      ) {
        return { loading, data: [], totalRows: 0 };
      } else {
        return {
          loading,
          data: [],
          totalRows: 0,
          error,
          filterDetails: getFilterArray(filterData),
          isFiltering: true,
        };
      }
    }
  }
};

const behaviorSubj = {};
const resultObservable = {};

export const useBehaviorSubject = model => {
  if (!behaviorSubj[model]) {
    behaviorSubj[model] = {
      searchSubject: new BehaviorSubject(),
      refreshSubject: new BehaviorSubject(),
    };
    resultObservable[model] = combineLatest(
      behaviorSubj[model].searchSubject,
      behaviorSubj[model].refreshSubject
    ).pipe(
      switchMap(([searchSubject]) => {
        return fetchAsync({ ...searchSubject });
      })
    );
  }
  return { ...behaviorSubj[model], combined: resultObservable[model] };
};

export default function Asset() {
  const { asset } = useParams();
  const dispatch = useDispatch();

  //SIDEBAR : IMC modülü sayfaları IMC_IDENTIFIER ile çalışmaktadır. PRO-2010
  if (asset === 'imc' || asset === 'networkImc' || asset === 'tbsSellChannel') {
    dispatch(setIdentifier(IMC_IDENTIFIER));
  } else {
    let companyIdentifier = checkIfCompanyIdentifierFoundUrl();
    companyIdentifier && dispatch(setIdentifier(companyIdentifier));
  }

  useEffect(() => {
    dispatch(setCurrentEntity());
  }, [asset]);

  return (
    <Routes>
      <Route path="/" element={<AssetIndex asset={asset} />} />
      <Route path="create" element={<AssetCreate asset={asset} />} />
      <Route path="edit/:id" element={<AssetEdit asset={asset} />} />
      <Route path="view/:id" element={<AssetDisplay asset={asset} />} />
      <Route path="*" element={<div>boş sayfa</div>} />
    </Routes>
  );
}

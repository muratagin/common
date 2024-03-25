import { Requests } from "@app/api";
import { CILIST } from "@app/ci.list";
import {
  FILE_SERVER_PASSWORD,
  FILE_SERVER_USERNAME,
  MASTER_IDENTIFIER,
  NETWORK_ERROR,
  currencyType,
} from "@app/constant";
import { settings } from "@app/settings";
import _ from "lodash";
import moment from "moment";
import { getImportModel, sortingImportModel } from "./import.model";
import { getAsset } from "./parser";

export const checkIf = (data) => typeof data !== "undefined" && data !== null;
export const checkIfIsEmpty = (data) =>
  typeof data !== "undefined" && data !== null && data !== "";
export const trimIf = (data) => (typeof data === "string" ? data.trim() : data);
export const isObject = (data) =>
  data != null && data.constructor.name === "Object";
export const isObjectIsNotEmpty = (value) =>
  typeof value === "object" && Object.keys(value).length > 0;
export const toFixed = (value) =>
  typeof value !== "undefined" && value !== null ? value.toFixed(2) : value;

// extracts curly braced statement
export const extract = (string) => {
  let regex = /{[a-zA-Z0-9_.]*}/g;
  let match = string.match(regex);
  return match
    ? string.replace(regex, match[0].substr(1, match[0].length - 2))
    : string;
};

// interpolates curly braces within a string
export const interpolate = (string, replacement) => {
  let regex = /{[a-zA-Z0-9_.]*}/g;
  let match = string?.match(regex);
  return match
    ? string.replace(
        regex,
        match[0].substr(1, match[0].length - 2) + "==" + replacement
      )
    : string;
};

// interpolates curly braces within a string as value
export const interpolateValue = (string, replacement) => {
  let regex = /{[a-zA-Z0-9_.]*}/g;
  let match = string?.match(regex);
  return match ? string.replace(regex, replacement) : string;
};

// interpolates a general url for either query or route param
export const interpolateUrl = (string, replacement) => {
  let regexForQueryParam = /\?{[a-zA-Z0-9_.]*}/g;
  let regexForRouteParam = /\/{[a-zA-Z0-9_.]*}/g;
  let regex = /{[a-zA-Z0-9_.]*}/g;

  let matchCommon = string.match(regex);
  let matchQ = string.match(regexForQueryParam);
  let matchR = string.match(regexForRouteParam);
  let matchWord = matchCommon?.[0].substr(1, matchCommon[0].length - 2);

  if (matchQ) {
    if (isObject(replacement)) {
      return string.replace(
        regexForQueryParam,
        `?${matchWord}==${
          checkIf(replacement[matchWord])
            ? replacement[matchWord]
            : replacement.Id
        }`
      );
    } else {
      return string.replace(
        regexForQueryParam,
        `?${matchQ[0].substr(2, matchQ[0].length - 3)}==${replacement}`
      );
    }
  }
  if (matchR) {
    if (isObject(replacement)) {
      return string.replace(
        regexForRouteParam,
        `/${
          checkIf(replacement[matchWord])
            ? replacement[matchWord]
            : replacement.Id
        }`
      );
    } else {
      return string.replace(regexForRouteParam, `/${replacement}`);
    }
  }
  return string;
};

// interpolates curly braces for either query or route param
export const interpolateHeaderUrl = (item, replacementObject) => {
  let string = item.url;
  let omitCI = item.type === "download";

  let regexForQueryParam = /\?{[a-zA-Z0-9_.]*}/g;
  let regexForRouteParam = /\/{[a-zA-Z0-9_.]*}/g;
  let regex = /{[a-zA-Z0-9_.]*}/g;

  let matchCommon = string.match(regex);
  let matchQ = string.match(regexForQueryParam);
  let matchR = string.match(regexForRouteParam);
  let matchWord = matchCommon[0].substr(1, matchCommon[0].length - 2);
  let extracted = objIndex(replacementObject, matchWord);
  let replacement = checkIf(extracted) ? extracted : replacementObject.Id;
  let CI = findCompanyIdentifier(replacementObject);

  if (matchQ) {
    return string.replace(
      regexForQueryParam,
      `?${matchQ[0].substr(2, matchQ[0].length - 3)}=${replacement}${
        CI && !omitCI ? "&CI=" + CI : ""
      }`
    );
  }
  if (matchR) {
    return string.replace(
      regexForRouteParam,
      `/${replacement}${CI && !omitCI ? "?CI=" + CI : ""}`
    );
  }
};

// interpolates curly braces within an object
export const objectInterpolate = (object, replacement) => {
  //let regex = /{[a-zA-Z0-9_.]*}/g
  let copy = { ...object };
  Object.keys(copy).forEach((key) => {
    copy[key] = interpolate(copy[key], replacement);
  });
  return copy;
};

// produces interpolated object key : value
export const interpolatedObject = (object, replacement) => {
  if (checkIf(object)) {
    let regex = /{[a-zA-Z0-9_.]*}/g;
    let produced = {};
    Object.keys(object).forEach((key) => {
      let match = object[key].match(regex);
      if (match) produced[extract(match[0])] = replacement;
    });
    return produced;
  }
};

// produces interpolated object produced from url
export const interpolatedObjectV2 = (object, replacement) => {
  let regex = /{[a-zA-Z0-9_.]*}/g;
  let match = object.url.match(regex);
  return checkIf(match) ? { [extract(match[0])]: replacement } : undefined;
};

// converts object to filter compatible form
export const filterPrepObj = (object) => {
  let temp = {};
  Object.keys(object).forEach((key) => {
    if (object[key].hasOwnProperty("value")) {
      temp = { ...temp, ...{ [key]: object[key] } };
    } else {
      Object.keys(object[key]).forEach((inner) => {
        temp = { ...temp, ...{ [key + "." + inner]: object[key][inner] } };
      });
    }
  });
  return temp;
};

export const filterArrayByObject = (array, filterObj) => {
  if (checkIf(filterObj) && isObjectIsNotEmpty(filterObj)) {
    return Object.keys(filterObj).reduce((result, key) => {
      return [...result, ...array.filter((x) => x[key] === filterObj[key])];
    }, []);
  }
};

// groups object subproperties with same parent names into same level
export const groupObjProperties = (object) => {
  let base = {};
  Object.keys(object).forEach((key) => {
    let levels = key.split(".");
    let level1 = levels[0];
    let level2 = levels[1];

    if (base[level1]) {
      if (level2) {
        base[level1][level2] = object[key];
      } else {
        base[level1] = object[key];
      }
    } else {
      if (level2) {
        base[level1] = {
          [level2]: object[key],
        };
      } else {
        base[level1] = object[key];
      }
    }
  });

  return base;
};

//Gönderilen obje içerisinde bulunan her bir eleman boş veya undefined ise obje null olarak set etmektedir.
const refactorGroupObj = (object) => {
  let isAllEmptyOrUndefined = true;
  let base = object;
  Object.keys(object).forEach((key) => {
    let value = object[key];
    if (checkIf(value) && value !== "") {
      isAllEmptyOrUndefined = false;
    }
  });
  if (isAllEmptyOrUndefined === true) {
    base = null;
  }
  return base;
};

export const formDataRefactorWithObjGrouping = (formData) => {
  let transmit = {};
  Object.keys(formData).forEach((key) => {
    if (key === "Media" || key === "MediaLink") {
      let media;
      const isMediaVal = formData["Media"] || formData["MediaLink"];
      if (checkIfIsEmpty(isMediaVal)) {
        if (isObjectIsNotEmpty(isMediaVal)) {
          media = { ...isMediaVal };
        } else {
          media = {
            MediaLink: isMediaVal,
          };
        }
      }
      if (checkIfIsEmpty(media) && isObjectIsNotEmpty(media)) {
        transmit = { ...transmit, ...media };
      }
    } else {
      transmit[key] = formData[key];
    }
  });
  return transmit;
};

export const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// finds a string evaluated subobject in a object

export const objIndex = (obj, is, value) => {
  if (typeof is === "string") return objIndex(obj, is.split("."), value);
  else if (is?.length === 1 && value !== undefined && isObjectIsNotEmpty(obj))
    return obj ? (obj[is[0]] = value) : undefined;
  else if (is?.length === 0) return obj;
  else return objIndex(obj ? obj[is[0]] : undefined, is.slice(1), value);
};

// produces error object
export const errorData = (error) => {
  let data = {
    class: "",
    message: { title: "", body: "" },
    logId: null,
  };
  data.message.title =
    (error?.response?.status === 404 || error?.response?.status === 400) &&
    !error.response?.data?.CorrelationId
      ? "UYARI"
      : "HATA OLUŞTU";
  data.class =
    (error?.response?.status === 404 || error?.response?.status === 400) &&
    !error.response?.data?.CorrelationId
      ? "warning"
      : "danger";
  data.message.body = error.response?.data?.ErrorMessage
    ? error.response?.data?.LogId
      ? error.response?.data?.ErrorMessage?.join(" ") +
        "<br/> LogId: " +
        error.response?.data?.LogId
      : error.response?.data?.ErrorMessage?.join(" ")
    : error?.response?.status === 404
    ? "Aradığınız kriterlere uygun kayıt bulunamamıştır."
    : `İşleminiz gerçekleşirken hata oluştu.  ${NETWORK_ERROR}`;

  data.logId = error.response?.data?.LogId;

  return data;
};

export const resErrorMessage = (error) => {
  let message;

  message =
    error.response?.data?.ErrorMessage || error.response?.data?.Error?.Message
      ? error.response?.data?.LogId
        ? error.response?.data?.ErrorMessage?.join(" ") +
          "<br/> LogId: " +
          error.response?.data?.LogId
        : error.response?.data?.ErrorMessage?.join(" ") ||
          error.response?.data?.Error?.Message
      : error?.response?.status === 404
      ? "Aradığınız kriterlere uygun kayıt bulunamamıştır."
      : `İşleminiz gerçekleşirken hata oluştu. - ${NETWORK_ERROR}`;
  return message;
};

// maps form field value to options
export const mapValueToOption = (value) => {
  return value?.map((item) => ({ value: item.value, label: item.key }));
};

// checks if a group consists of visible fields, utilized when generating form data
export const checkVisible = (fields, mode) => {
  return fields.some((field) =>
    mode === "filter" ? field.visibility.filter?.show : field.visibility[mode]
  );
};

// splits parent and children
export const splitParentChild = (string) => {
  let pieces = string.split(".");
  return [pieces[0], pieces[1]];
};

// finds a company by search criteria
export const findCompany = (search, value) =>
  CILIST.find((item) => item[search] === value);

// gets company as select2
export const findCompanyProps = (search, value) =>
  CILIST.filter((item) => item[search] === value).map((item) => ({
    label: item.CompanyName,
    value: item.CompanyId,
  }))[0];

// checks if a field is related to company
export const checkCompanyRelated = (field) =>
  field.model.create?.match(/CompanyId$/) ||
  field.model.create?.match(/CompanyIdentifier$/) ||
  field.model.edit?.match(/CompanyId$/) ||
  field.model.edit?.match(/CompanyIdentifier$/);

// returns CI if a row data contains company related data
export const findCompanyIdentifier = (data) => {
  if (data.hasOwnProperty("CompanyId")) {
    return findCompany("CompanyId", data.CompanyId).CompanyIdentifier;
  }
  if (data.hasOwnProperty("CompanyIdentifier")) {
    return data.CompanyIdentifier;
  }
};

export const htmlDecode = (input) => {
  return input
    .replaceAll("%20", " ")
    .replaceAll("%C4%B0", "İ")
    .replaceAll("%C3%96", "Ö")
    .replaceAll("%C3%87", "Ç")
    .replaceAll("%C3%9C", "Ü")
    .replaceAll("%C5%9E", "Ş")
    .replaceAll("%C4%9E", "Ğ");
};

// reads a file from local folder, imported in definitions
export const readFile = (importedFile) =>
  fetch(importedFile)
    .then((response) => response.blob())
    .then((data) => {});

// converts imported data to datatable compatible data
export const generateImportTableInfo = (
  data,
  assetName,
  clickedRow,
  importModel
) => {
  let asset;
  let tableData = [...data];
  let columnsTemp = tableData.shift();
  let columns = [];
  //importModel => aynı sayfada birden fazla import olduğu senaryolarda dolu olarak gelmektedir.
  //isAsset sayfada tıklanan importun kendi kolon eşleştirmeleri kullanıcak ise feed.js'te true olarak tanımlanmaktadır.
  //isAsset Tanımlanmazsa sayfadaki entity'nin kolon eşleştirmeleri kullanılmaktadır.
  if (
    Object.keys(importModel).length === 0 ||
    (Object.keys(importModel).length !== 0 && !checkIf(importModel.isAsset))
  ) {
    asset = getAsset(assetName);
  } else if (checkIf(importModel.isAsset) && checkIf(importModel.assetName)) {
    asset = { tabs: [...getImportModel(importModel.assetName)] };
  } else {
    asset = importModel;
  }

  if (checkIf(importModel) && checkIf(importModel.sorting)) {
    let newTableData = sortingImportModel(data, importModel.sorting);
    tableData = newTableData;
    columnsTemp = newTableData.shift();
  }

  columnsTemp.forEach((col) => {
    let found = {};
    asset.tabs.forEach((tab) => {
      tab.content.forEach((cont) => {
        cont.fields.forEach((field) => {
          if (field.model.import?.name == col) {
            found = {
              name: col,
              index: field.model.import.index,
              //selector: cont.group?.model ? cont.group.model + '.' + field.model.view : field.model.view,
              selector: cont.group?.model
                ? cont.group.model + "." + field.model.create
                : field.model.excelImportName || field.model.create,
              model: field.model,
              parent: cont.group?.model,
            };
            columns.push(found);
          }
        });
      });
    });
  });

  if (asset.importExportModel?.importFields) {
    let found = {};
    asset.importExportModel.importFields.forEach((field) => {
      found = {
        name: field.rowData,
        index: field.index,
        selector: field.postData,
        // model: field.model,
        // parent: cont.group?.model
      };
      columns.push(found);
      tableData.forEach((row) => row.push(clickedRow[field.rowData]));
    });
  }
  let dateColumns = [];
  columns.map(
    (x) => x.name.match(/TARIH|tarih/gi) && dateColumns.push(x?.selector)
  );
  let tableDataImport = tableData.map((row) => {
    let output = {};
    let updatedRow = {};
    columns.forEach((col) => {
      let rowValue = row[col.index];
      if (
        col.name.match(/TARIH|tarih/gi) &&
        moment(row[col.index]).isValid() &&
        !moment(row[col.index], allowedDateFormats, true).isValid()
      ) {
        let newDate = moment.utc(parseDateExcel(row[col.index]));
        rowValue = newDate.format("DD/MM/YYYY HH:mm");
      }
      if (Object.prototype.toString.call(rowValue) === "[object Date]") {
        updatedRow[col.selector] = moment(rowValue).format("DD.MM.YYYY");
      } else {
        updatedRow[col.selector] = rowValue;
      }
    });
    updatedRow.progress = {};
    output = { ...uniteObjectProperties(updatedRow) };
    return output;
  });

  let tableDataTransmit = tableData.map((row) => {
    let output = {};
    let updatedRow = {};
    columns.forEach((col) => {
      let rowValue = row[col.index];
      if (Object.prototype.toString.call(rowValue) === "[object Date]") {
        updatedRow[col.selector] = moment(rowValue).format("YYYY-MM-DD");
      }
      // else if (col.selector.match(/CompanyId/)) {
      //   let foundCompany = findCompany('CompanyId', rowValue)
      //   updatedRow[col.selector] = foundCompany ? foundCompany.CompanyIdentifier : undefined
      // }
      else {
        updatedRow[col.selector] = rowValue;
      }
    });
    updatedRow.progress = {};
    output = { ...uniteObjectProperties(updatedRow) };
    if (checkIf(output.ContactModel)) {
      output.ContactModel = { ...output.ContactModel, type: { ordinal: 1 } };
      output.ContactModel.CorporateModel.Title = output.Name;
    }

    if (asset.name == "agency") {
      //CityId ve CountyId alanları ContactModel içerisinde set ediliyor.
      if (
        checkIf(output.ContactModel.ContactAddressModel) &&
        output.ContactModel.ContactAddressModel.CountryId == null
      ) {
        //excel içerisinde ülke alanı boş gönderilmesine karşın
        output.ContactModel.ContactAddressModel = {
          ...output.ContactModel.ContactAddressModel,
          CountryId: "222",
        };
      }
      output.ContactModel.ContactAddressModel = {
        ...output.ContactModel.ContactAddressModel,
        CityId: output.ContactModel.CityId,
        CountyId: output.ContactModel.CountyId,
      };
    }
    return output;
  });
  return { columns, tableDataImport, tableDataTransmit };
};

//table.component içerisinde asset-data farklılaştığı için klonlandı
export const generateImportTableComponentInfo = (data, assetName) => {
  let asset = getAsset(assetName) || assetName;
  let tableData = [...data];
  let columnsTemp = tableData.shift();
  let columns = [];

  columnsTemp.forEach((col) => {
    let found = {};
    asset.fields.forEach((field) => {
      if (field.model.import?.name == col) {
        found = {
          name: col,
          index: field.model.import.index,
          //selector: cont.group?.model ? cont.group.model + '.' + field.model.view : field.model.view,
          selector: field.model.create,
          model: field.model,
          parent: field.model,
        };
        columns.push(found);
      }
    });
  });

  let tableDataImport = tableData.map((row) => {
    let output = {};
    let updatedRow = {};
    columns.forEach((col) => {
      let rowValue = row[col.index];
      if (Object.prototype.toString.call(rowValue) === "[object Date]") {
        updatedRow[col.selector] = moment(rowValue).format("DD.MM.YYYY");
      } else {
        updatedRow[col.selector] = rowValue;
      }
    });
    updatedRow.progress = {};
    output = { ...uniteObjectProperties(updatedRow) };
    return output;
  });
  let tableDataTransmit = tableData.map((row) => {
    let output = {};
    let updatedRow = {};
    columns.forEach((col) => {
      let rowValue = row[col.index];
      if (Object.prototype.toString.call(rowValue) === "[object Date]") {
        updatedRow[col.selector] = moment(rowValue).format("YYYY-MM-DD");
      } else {
        updatedRow[col.selector] = rowValue;
      }
    });
    updatedRow.progress = {};
    output = { ...uniteObjectProperties(updatedRow) };
    if (checkIf(output.ContactModel)) {
      output.ContactModel = { ...output.ContactModel, type: { ordinal: 1 } };
      output.ContactModel.CorporateModel.Title = output.Name;
    }
    return output;
  });
  return { columns, tableDataImport, tableDataTransmit };
};

// interpolates a dot notation single key value pair
/*
 * {"ContactModel.ContactAddressModel.CityId": 34 }
 * returns to
 * { ContactModel : { ContactAddressModel : { CityId : 34 } } }
 */
export const singleLineObj = (obj) => {
  let key = Object.keys(obj)[0];
  let pieces = key.split(".");
  let rest = pieces.slice(1).join(".");
  if (pieces.length > 1) {
    return { [pieces[0]]: singleLineObj({ [rest]: obj[key] }) };
  } else {
    return obj;
  }
};

// deep merge two objects
export const mergeDeep = (target, source) => {
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    });
  }
  return target;
};

// unite all the common properties of an object
export const uniteObjectProperties = (obj) =>
  Object.keys(obj).reduce(
    (acc, val) => ({ ...mergeDeep(acc, singleLineObj({ [val]: obj[val] })) }),
    {}
  );

// get location search string
export const addIdentifierLocationSearch = (row) => {
  let CI = findCompanyIdentifier(row);
  if (CI) {
    let locationSrc = window.location.search;
    if (locationSrc.trim() === "") {
      locationSrc = "?CI=" + CI;
    } else {
      if (!locationSrc.includes("?CI=") && !locationSrc.includes("&CI=")) {
        locationSrc += "&CI=" + CI;
      }
    }
    return locationSrc;
  } else {
    return window.location.search;
  }
};

// check if url includes company identifier query param
export const checkIdentifierUrl = () => {
  let companyIdentifier;
  let locationSearch = window.location.search.split("CI=");
  if (locationSearch.length === 1) {
    companyIdentifier = MASTER_IDENTIFIER;
  } else {
    companyIdentifier =
      settings.isTpa === false
        ? settings.companyIdentifier
        : locationSearch.pop();
  }
  return companyIdentifier;
};

export const checkIfCompanyIdentifierFoundUrl = () => {
  let companyIdentifier;
  let locationSearch = window.location.search.split("CI=");
  if (locationSearch.length > 1) {
    companyIdentifier =
      settings.isTpa === false
        ? settings.companyIdentifier
        : locationSearch.pop();
  }
  return companyIdentifier;
};

// get query string as parameters
export const getQueryParameterValue = (paramName) => {
  let searchString = window.location.search.substring(1);
  let val,
    params = searchString.split("&");
  for (let i = 0; i < params.length; i++) {
    val = params[i].split("=");
    if (val[0] == paramName) {
      return val[1];
    }
  }
  return null;
};

// get first parameter in query string params
export const getFirstQueryParameter = () => {
  let regex = /\?[A-Za-z]+=/g;
  let match = window.location.search.match(regex);
  return match ? match[0].substr(1, match[0].length - 2) : "";
};
// get query string as parameter name array
export const getQueryParameterNames = (search) => {
  let queryName = [];
  let query = search.substring(1);
  let vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    queryName.push(pair[0]);
  }
  return queryName;
};
// get parameter name array as object
export const initialDataObject = (search) => {
  let obj = {};
  let paramNames = getQueryParameterNames(search);
  for (let index = 0; index < paramNames.length; index++) {
    let name = paramNames[index];
    let parent = name?.split(".");
    let newObj = {};
    if (parent.length > 1) {
      let parentName = parent[0];
      let childName = parent[1];
      let isObj = obj[parentName];
      let parentObj = {};
      if (checkIf(isObj)) {
        obj[parentName] = Object.assign(
          { ...obj[parentName] },
          { [childName]: htmlDecode(getQueryParameterValue(name)) }
        );
      } else {
        parentObj = {
          [parentName]: {
            [childName]: htmlDecode(getQueryParameterValue(name)),
          },
        };
      }
      obj = Object.assign({ ...obj }, parentObj);
    } else {
      newObj = { [name]: htmlDecode(getQueryParameterValue(name)) };
    }
    obj = Object.assign({ ...obj }, newObj);
  }
  return obj;
};

//produces filter string
export const getFilterString = (filterData, seperator) => {
  let filterString = Object.keys(filterData).reduce((acc, val, index) => {
    let temp = trimIf(filterData[val].value);
    let type = filterData[val].type;
    let likeSearch = ["text", "textarea"];
    let comparisonSign = filterData[val].compSign;
    let string = "";
    if (Array.isArray(temp)) {
      let acc = temp.reduce((acc, val) => `${acc}${val.value}|`, "");
      acc = acc.length > 0 ? acc.substring(0, acc.length - 1) : "";
      string = `${val}${comparisonSign || "=="}${acc}`;
    } else if (likeSearch.includes(type)) {
      string = `${val}${comparisonSign || "@="}${temp}`;
    } else if (type === "date") {
      string = `${val.replace(/(_Higher)|(_Lower)/g, "")}${
        comparisonSign || "=="
      }${moment(temp, "DD/MM/YYYY").format("YYYY-MM-DD")}`;
    } else if (type === "datetime") {
      string = `${val.replace(/(_Higher)|(_Lower)/g, "")}${
        comparisonSign || "=="
      }${moment(temp, "DD/MM/YYYY HH:mm").format("YYYY-MM-DDTHH:mm:ss")}`;
    } else if (type === "textTagged") {
      string = `${val}${comparisonSign || "=="}${temp.split(",").join("|")}`;
    } else {
      string = `${val}${comparisonSign || "=="}${temp}`;
    }
    string = string.replace(/,$/g, "");
    return acc + `${checkIf(temp) && temp !== "" ? string + "," : ""}`;
  }, "");
  return filterString
    ? seperator + "filters=" + filterString.replace(/,$/g, "")
    : "";
};

export const getFilterArray = (filterData) => {
  if (filterData) {
    let filters = Object.entries(filterData).reduce(
      (result, [key, value], index) => {
        let likeSearch = ["text", "textarea"];

        let type = filterData[key].type;
        let inputLabel = filterData[key].inputLabel;
        let comparisonSign = filterData[key].compSign;
        let val = trimIf(filterData[key].value);
        if (val && checkIfIsEmpty(val)) {
          if (Array.isArray(val)) {
            let acc = val.reduce((res, val) => {
              return res + `${val.value},`;
            }, "");
            result = [
              ...result,
              {
                key: inputLabel,
                value: acc.length > 0 ? acc.substring(0, acc.length - 1) : "",
                comparisonSign: comparisonSign || "|",
              },
            ];
          } else if (likeSearch.includes(type)) {
            result = [
              ...result,
              {
                key: inputLabel,
                value: val,
                comparisonSign: comparisonSign || "@=",
              },
            ];
          } else if (type === "textTagged") {
            result = [
              ...result,
              {
                key: inputLabel,
                value: val.split(",").join("|"),
                comparisonSign: comparisonSign || "==",
              },
            ];
          } else {
            result = [
              ...result,
              {
                key: inputLabel,
                value: val,
                comparisonSign: comparisonSign || "==",
              },
            ];
          }
        }
        return result;
      },
      []
    );
    return filters;
  } else {
    return null;
  }
};

// privilege related functions
export const checkPrivilege = (id, privilegeArray) =>
  privilegeArray?.find((item) => item.Id === id);

export const checkArrayPrivilege = (privilegeIds, privilegeArray) => {
  let result = true;
  let i = 0;
  while (i < privilegeIds.length) {
    result =
      result && privilegeArray.some((item) => item.Id === privilegeIds[i]);
    if (result === false) {
      break;
    }
    i++;
  }
  return result;
};

export const checkPrivilegeInRoles = (id, roles) => {
  let result = true;
  if (checkIf(id) && checkIf(roles)) {
    let i = 0;
    while (i < roles.length) {
      result = roles[i].Privileges.some((item) => item.Id === id);
      if (result === true) {
        break;
      }
      i++;
    }
  }
  return result;
};

export const checkPrivilegesInRoles = (ids, roles) => {
  let result = true;
  if (Array.isArray(ids) && Array.isArray(roles)) {
    let j = 0;
    while (j < ids.length) {
      let i = 0;
      while (i < roles.length) {
        result = roles[i].Privileges.some((item) => item.Id === ids[j]);
        if (result === true) {
          break;
        }
        i++;
      }
      if (result === true) {
        break;
      }
      j++;
    }
  }
  return result;
};

export const checkFormData = (event) => {
  if (event.target.elements) {
    const invalidElements = Object.entries(event.target.elements).filter(
      (element) =>
        element[1].className?.includes("valid") &&
        (!checkIf(element[1].value) || element[1].value === "")
    );
    invalidElements.forEach((element) => {
      element[1].classList.add("input-invalid");
    });
    return invalidElements.length === 0 ? true : false;
  } else {
    let isValid = event.target.className.indexOf("valid");
    let value = event.target.value;
    if (
      isValid > 0 &&
      (!checkIf(event.target.value) || event.target.value === "")
    ) {
      event.target.classList.add("input-invalid");
      return false;
    } else {
      event.target.classList.remove("input-invalid");
      return true;
    }
  }
};

export const getDownload = (e, item, loading) => {
  loading(true);
  e.preventDefault();
  e.stopPropagation();
  Requests()
    .CommonRequest.get({
      url: item.url,
      headers: {
        CompanyIdentifier: item.companyIdentifier,
        IsLazyLoading: checkIf(item?.IsLazyLoading)
          ? item?.IsLazyLoading
          : true,
      },
      loading: true,
    })
    .then(({ data }) => {
      getDownloadRedirect(data);
      loading(false);
    })
    .catch((error) => {
      loading(false, error);
    });
};

export const getDownloadRedirect = async (datas, loading) => {
  loading && loading(true);
  if (Array.isArray(datas)) {
    datas.forEach((data) => {
      (async () => {
        let splitUrl =
          data?.PrintResponse?.ExternalFileLink ||
          data.Value?.PrintResponse?.ExternalFileLink
            ? data.Value?.PrintResponse?.ExternalFileLink.split("/")
            : data?.split("/");
        let lastElement = splitUrl[splitUrl.length - 1];
        let fileName = htmlDecode(lastElement);
        let blob = await getBase64FromUrl(
          data.Value?.PrintResponse?.ExternalFileLink || data
        );
        await createLinkAndDownload(
          blob,
          fileName,
          data?.PrintResponse?.ExternalFileLink ||
            data.Value?.PrintResponse?.ExternalFileLink ||
            data
        );
        loading && loading(false);
      })();
    });
  } else {
    if (datas) {
      let splitUrl = datas?.PrintResponse?.ExternalFileLink
        ? datas?.PrintResponse?.ExternalFileLink.split("/")
        : datas?.split("/");
      let fileName = htmlDecode(splitUrl[splitUrl.length - 1]);
      let blob = await getBase64FromUrl(
        datas.PrintResponse?.ExternalFileLink || datas
      );
      await createLinkAndDownload(
        blob,
        fileName,
        datas?.PrintResponse?.ExternalFileLink || datas
      );
      loading && loading(false);
    }
  }
};

export const exportDownLoadRedirect = async (datas) => {
  if (datas) {
    let splitUrl = datas?.PrintResponse?.ExternalFileLink
      ? datas?.PrintResponse?.ExternalFileLink.split("/")
      : datas?.split("/");
    let fileName = htmlDecode(splitUrl[splitUrl.length - 1]);

    await createLinkAndDownload(
      null,
      fileName,
      datas?.PrintResponse?.ExternalFileLink || datas
    );
  }
};

export const createLinkAndDownload = (blob, fileName, url) => {
  try {
    const link = document.createElement("a");
    if (checkIf(url) && url.match(/pdf/gi)) {
      link.target = "_blank";
    }
    link.href = blob ? window.URL.createObjectURL(blob) : url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blob || url);
  } catch (error) {
    const link = document.createElement("a");
    link.target = "_blank";
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const getBase64FromUrl = async (url) => {
  let headers = {
    Authorization:
      "Basic " + btoa(FILE_SERVER_USERNAME + ":" + FILE_SERVER_PASSWORD),
  };
  try {
    if (checkIfIsEmpty(url)) {
      const data = await fetch(url, { headers });
      const blob = await data.blob();
      return new Promise((resolve) => {
        resolve(blob);
      });
    }
  } catch (error) {
    console.log("err 2", error);
  }
};

export const getBase64 = (file, callback) => {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function (readerEvent) {
    let fileExtension = reader.result.split(";")[0].split("/")[1];
    let fileBase64 = reader.result.split(",")[1];
    callback({
      fileExtension,
      fileBase64,
      fileName: file?.name,
      fileSize: file?.size,
    });
  };
  reader.onerror = function (error) {
    console.log("Error: ", error);
  };
};

export const getModel = (e, item, completed) => {
  completed(true);
  e.preventDefault();
  e.stopPropagation();
  Requests()
    .CommonRequest.get({
      url: item.url,
      headers: { CompanyIdentifier: item.companyIdentifier },
    })
    .then((response) => {
      completed(false, true);
    })
    .catch((error) => {
      completed(false, true, errorData(error));
    });
};

export const combineData = async (columns, data) => {
  let array = [];
  await data.forEach((value) => {
    refactorTableData(columns, value).then((result) => {
      array.push(result);
    });
  });
  await columns.map((column) => {
    if (column?.conditionalView) {
      array = array.map((value) =>
        conditionalViewFunctions(column?.conditionalView, value)
      );
    }
  });
  return array;
};

export const refactorTableData = async (columns, value) => {
  let newObject = { ...value };
  if (checkIf(columns) && isObjectIsNotEmpty(newObject)) {
    let selectors = columns.reduce((result, column) => {
      if (column.selector && typeof column.selector !== "function") {
        result = [...result, column.selector];
      }
      return result;
    }, []);

    let feed = selectors.reduce((object, selector) => {
      let objectParts = selector.split(".");
      if (objectParts?.length > 1) {
        object = _.merge(object, createObject(objectParts));
      } else {
        object = { ...object, [selector]: "" };
      }
      return object;
    }, {});
    newObject = _.merge(feed, newObject);
  }
  return newObject;
};

const createObject = (objectParts) => {
  let object = {};
  objectParts.forEach((element, index) => {
    object = recursiveCreateObject(
      object,
      element,
      objectParts[objectParts.length - 1] === element
    );
  });
  return object;
};

const recursiveCreateObject = (object, element, lastElement) => {
  if (isObjectIsNotEmpty(object)) {
    Object.keys(object).forEach((key) => {
      return { ...recursiveCreateObject(object[key], element, lastElement) };
    });
  } else {
    if (lastElement) {
      lastElement = false;
      object[element] = "";
    } else {
      object[element] = {};
    }
  }
  return object;
};

//obje dizisini key ve order değerine göre sıralar.
export const compareValues =
  (key, order = "asc") =>
  (a, b) => {
    try {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        throw new Error("Lütfen doğru format kullanın!");
      }

      let comparison = 0;
      if (typeof a[key] === "string" && typeof b[key] === "string") {
        comparison = a[key]
          .toLocaleLowerCase()
          .localeCompare(b[key].toLocaleLowerCase());
      } else {
        if (a[key] > b[key]) {
          comparison = 1;
        } else if (a[key] < b[key]) {
          comparison = -1;
        }
      }
      return order === "desc" ? comparison * -1 : comparison;
    } catch (error) {
      console.error("Hata:", error.message);
      return 0;
    }
  };

export const handleKeyDown = (event) => {
  //number bug
  //69 --> "e"
  //189 --> "-"
  if (event.keyCode === 69 || event.keyCode === 189) {
    event.preventDefault();
  }
};

export const roundToTwoDigitsAfterComma = (number, limit) => {
  let isComma = number.toString().match(",");

  if (isComma != null) {
    let arrayNumber = number.split(",");
    let beforeComma = arrayNumber[0];
    let afterComma = arrayNumber[1];
    if (afterComma.length > 2) {
      let newNumber = beforeComma + "," + afterComma.slice(0, limit);
      return newNumber;
    } else {
      return number;
    }
  } else {
    return number;
  }
};

export const checkUrlPageSizeController = (url) => {
  let isController = false;

  if (
    url.match("/tablecolumnheaders") ||
    url.match("/TableColumnHeaderHistories")
  ) {
    isController = true;
  } else {
    isController = false;
  }
  return isController;
};

let allowedDateFormats = [
  "DD/MM/YYYY",
  "D/M/YYYY",
  "DD.MM.YYYY",
  "D.M.YYYY",
  "DD.MM.YYYY",
  "D.M.YYYY",
  "DD-MM-YYYY",
  "D-M-YYYY",
];

export const importProcessDateValidator = (value) => {
  isObject(value) &&
    Object.keys(value).map((x) =>
      moment(value[x], allowedDateFormats, true).isValid()
        ? (value[x] = moment(value[x], allowedDateFormats).format(
            "YYYY-MM-DDTHH:mm:ss"
          ))
        : value[x]
    );
  if (moment(value, allowedDateFormats, true).isValid()) {
    return moment(value, allowedDateFormats).format("YYYY-MM-DDTHH:mm:ss");
  } else return value;
};
export function duplicates(arr, property) {
  if (!Array.isArray(arr))
    throw new Error(
      `Please provide a valid Array, this could either be because you used an invalid array, or you provided a value which is not of type Array`
    );
  if (!property) throw new Error(`The property parameter cannot be empty`);
  const clone = [...arr];
  if (!Object.prototype.hasOwnProperty.call(clone[0], property))
    throw new Error(`Could not find property [${property}] in Object Array`);

  const duplicates = [
    ...new Set(
      clone
        .map((val) => val[property])
        .filter((item, index, iteratee) => iteratee.indexOf(item) !== index)
    ),
  ];

  const flattenedDupes = duplicates
    .map((val) => clone.filter((item) => item[property] === val))
    .flat();

  return {
    single: () => flattenedDupes[0],
    all: () => flattenedDupes,
    modify: (cb) => cb(flattenedDupes),
    map: (cb) => flattenedDupes.map(cb),
    filter: (cb) => flattenedDupes.filter(cb),
    find: (cb) => flattenedDupes.find(cb),
  };
}
export const importModelCheckDuplicate = (
  nonDuplicateColumnn,
  tableDataTransmit
) => {
  let idx = nonDuplicateColumnn.length;
  function duplicateData(array) {
    if (idx <= 0 || array.length < 1) {
      return array.length > 1 ? true : false;
    } else {
      let duplicated = duplicates(array, nonDuplicateColumnn[idx - 1]).all();
      array = [...duplicated];
      idx -= 1;
      return duplicateData(array);
    }
  }
  return duplicateData(tableDataTransmit);
};

export const parseDateExcel = (excelTimestamp) => {
  const utcDays = Math.floor(excelTimestamp - 25569);
  const utcValue = utcDays * 86400;
  const dateInfo = new Date(utcValue * 1000);
  const fractionalDay = excelTimestamp - Math.floor(excelTimestamp) + 0.0000001;
  let totalSeconds = Math.floor(86400 * fractionalDay);
  const seconds = totalSeconds % 60;
  totalSeconds -= seconds;
  const hours = Math.floor(totalSeconds / (60 * 60));
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const newData = Date.UTC(
    dateInfo.getFullYear(),
    dateInfo.getMonth(),
    dateInfo.getDate(),
    hours,
    minutes,
    seconds
  );
  return isNaN(newData) ? null : newData;
};
export const checkExcelDateFormat = (dateColumns, row) => {
  dateColumns.length > 0 &&
    dateColumns.map((column) =>
      Object.keys(row).map((key) => {
        if (column.includes(".")) {
          let obj = column.split(".");
          let value = obj[obj.length - 1];
          if (
            row[key].hasOwnProperty(value) &&
            !moment(row[key]?.[value], allowedDateFormats, true).isValid() &&
            moment(row[key]?.[value]).isValid()
          ) {
            let newDate =
              typeof row[key][value] === "number"
                ? moment.utc(parseDateExcel(row[key][value]))
                : row[key][value];
            return (row[key][obj[obj.length - 1]] = moment(newDate).format(
              "YYYY-MM-DDTHH:mm:ss"
            ));
          }
        }
        if (
          key === column &&
          moment(row[key]).isValid() &&
          typeof row[key] === "number"
        ) {
          // excel type number olarak veriyor, kullnıcı excel de tarih alanının formatını date yerine text olarak girmişse buraya takılmamalıdır.
          let newDate = moment.utc(parseDateExcel(row[key]));
          return (row[key] = newDate.format("YYYY-MM-DDTHH:mm:ss"));
        }
      })
    );
};

export const conditionalViewFunctions = (condition, value) => {
  switch (condition) {
    case "PolicyStartDate":
      return moment(value?.PolicyStartDate) > moment() &&
        value?.PolicyStatus?.Ordinal === 2 // PolicyStatusu Tanzim olanlar
        ? {
            ...value,
            PolicyStatus: { ...value?.PolicyStatus, Text: "Süresi Başlamamış" },
          }
        : value;
      break;
    default:
      break;
  }
};

export const randomString = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
export const getColumnCount = (data, visibleColumn) => {
  let columnCount = data?.actionsDisplay === false ? 0 : 1;
  data?.selectableRows === true && columnCount++;
  columnCount +=
    checkIf(data?.importExportModel) &&
    Object.values(data?.importExportModel).filter((x) => x === true).length;
  if (visibleColumn) {
    visibleColumn.map((column) => {
      column?.omit === false && columnCount++;
    });
  } else {
    data.tabs[0].content.map((content) => {
      content.fields.map((field) => {
        field.visibility.view === true && columnCount++;
      });
    });
  }
  return columnCount;
};
export const getVisibleColumns = (data) => {
  let visibleColumn = [];
  data.tabs[0].content.map((content) => {
    content.fields.map((field, index) => {
      field?.visibility?.view === true &&
        visibleColumn.push({
          id: index,
          label: field.label,
          value: field.label,
        });
    });
  });
  return visibleColumn;
};
export const getBrowserInfo = () => {
  var ua = navigator.userAgent;
  var tem;
  var M =
    ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) ||
    [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return "IE " + (tem[1] || "");
  }
  if (M[1] === "Chrome") {
    tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
    if (tem != null) return tem.slice(1).join(" ").replace("OPR", "Opera");
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
  return M.join(" ");
};

export const getCloudflareJSON = async () => {
  let data = await fetch("https://www.cloudflare.com/cdn-cgi/trace").then(
    (res) => res.text()
  );
  let arr = data
    .trim()
    .split("\n")
    .map((e) => e.split("="));
  return Object.fromEntries(arr);
};

export const getValues = (separator, key, state) => {
  if (!key.includes(separator)) {
    return state[key];
  }
  const keyArr = key.split(separator);
  if (keyArr.length > 1) {
    let newState = state;
    for (const element of keyArr) {
      newState = newState?.[element];
    }
    return newState;
  }
};
export const checkPrivilegeWithType = (privilege, type, roles) => {
  return checkIf(privilege) && privilege?.type === type
    ? checkPrivilegeInRoles(privilege.id, roles)
    : true;
};

export const excelValidation = (type, value, item, feedData) => {
  if (type === "isAfterDateFromToday") {
    return moment(value).isAfter(moment()) ? false : true;
  }
  if (type === "required") {
    return checkIf(value);
  }
  if (type === "conditional") {
    const conditionValue = feedData?.model?.import?.conditionValue;
    const itemValue = getValues(".", feedData?.model?.import?.condition, item);
    const isValid = Array.isArray(conditionValue)
      ? conditionValue.includes(itemValue)
      : itemValue == conditionValue;
    return isValid ? checkIf(value) : true;
  }
  if (type === "validDate") {
    return moment(value).isAfter(moment("1900-01-01"));
  }
  return true;
};

export const optionFiltererByPermission = (props, roles, options, state) => {
  let objTemp;
  if (!checkPrivilegeInRoles(props?.optionsPrivilege?.id, roles)) {
    let filteredOptions = options.filter(
      (obj) => !props?.optionsPrivilege?.disabledOptions.includes(obj.value)
    );
    objTemp = {
      ...state,
      options: filteredOptions,
      value: null,
    };
  } else {
    objTemp = {
      ...state,
      options: options,
      value: null,
    };
  }
  return objTemp;
};

export const generateAcceptString = (fileTypes) => {
  const formattedFileTypes = fileTypes.map((type) => `.${type}`);
  const acceptString = formattedFileTypes.join(", ");
  return acceptString;
};

export const getMediaDownloadByBase64 = async (file) => {
  try {
    if (file.fileBase64) {
      const byteCharacters = atob(file.fileBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: file.extension });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = file.fileName;
      link.click();
    }
  } catch (error) {}
};

export const formatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  minimumFractionDigits: 2,
});

export const currencyFormat = (value) => {
  let stringValue = value?.toString().replace(",", ".");
  value = parseFloat(stringValue);
  let currencyValue =
    formatter.format(value).replace(currencyType, "") + `${currencyType}`;
  return currencyValue;
};

export const getPartsOfSubObject = (row, view) => {
  const splitArr = view.split(".");

  return splitArr.reduce((acc, key) => {
    return acc ? acc[key] : undefined;
  }, row);
};

export const isJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (error) {
    return false;
  }
  return true;
};

export const isLabelPrefix = (isValidate, label) => {
  return isValidate ? "*" + label : label;
};

//Form gönderilmeden önce content içerisinde bulunan null veya boş nesneleri temizlemek için yazılan fonksiyon
export const cleanEmptyFields = (obj) => {
  for (const key in obj) {
    if (obj[key] && typeof obj[key] === "object") {
      obj[key] = cleanEmptyFields(obj[key]);
      // Eğer nesne boş ise, ana nesneden çıkar
      if (
        Object.keys(obj[key]).length === 0 &&
        obj[key].constructor === Object
      ) {
        delete obj[key];
      }
    } else if (obj[key] === "" || obj[key] === null || obj[key] === undefined) {
      // Eğer alan boş ise, ana nesneden çıkar
      delete obj[key];
    } else if (Array.isArray(obj[key])) {
      // Eğer alan bir dizi ise, boş nesneleri temizle
      obj[key] = obj[key].filter((item) => {
        if (typeof item === "object") {
          cleanEmptyFields(item);
          return Object.keys(item).length > 0 || item instanceof Array;
        } else {
          return item !== "" && item !== null && item !== undefined;
        }
      });

      // Eğer dizi boş ise, ana nesneden çıkar
      if (obj[key].length === 0) {
        delete obj[key];
      }
    }
  }
  return obj;
};

export const removeWhitespaceFromMobileNumbers = (data, clearZero, addZero) => {
  const cleanedData = data; // Deep copy

  if (cleanedData.Insurer && cleanedData.Insurer.MobileNumber) {
    cleanedData.Insurer.MobileNumber = cleanedData.Insurer.MobileNumber.replace(
      /\s/g,
      ""
    );
    if (clearZero)
      cleanedData.Insurer.MobileNumber =
        cleanedData.Insurer.MobileNumber.replace(/^0+/, "");

    if (addZero) {
      cleanedData.Insurer.MobileNumber =
        !cleanedData.Insurer.MobileNumber.startsWith("0")
          ? `0${cleanedData.Insurer.MobileNumber}`
          : cleanedData.Insurer.MobileNumber;
    }
  }
  if (
    cleanedData.InsuredInformationList &&
    cleanedData.InsuredInformationList.length > 0
  ) {
    cleanedData.InsuredInformationList.forEach((insured) => {
      if (insured.MobileNumber) {
        insured.MobileNumber = insured.MobileNumber.replace(/\s/g, "");
        if (clearZero)
          insured.MobileNumber = insured.MobileNumber.replace(/^0+/, "");

        if (addZero)
          insured.MobileNumber = !insured.MobileNumber.startsWith("0")
            ? `0${insured.MobileNumber}`
            : insured.MobileNumber;
      }
    });
  }

  return cleanedData;
};

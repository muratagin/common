import { Requests } from "@app/api";
import { OfferStatus, ProductType } from "@app/enum";
import { tabNames } from "@components/OfferCreateCommon/data";
import {
  getCities,
  getCountries,
  getLookupFromGetByName,
  getTransitionCompanyInformations,
} from "@components/OfferCreateCommon/service";
import { getEntityUrl } from "@libs/parser";
import { checkIfIsEmpty, removeWhitespaceFromMobileNumbers } from "@libs/utils";
import { setLoading } from "@slices/dynamicStyleSlice";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
const OfferCreateContext = createContext(null);

export function OfferCreateProvider({ children }) {
  const { offerId } = useParams();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(tabNames[0]);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [offer, setOffer] = useState(null);
  const [currentProductType, setCurrentProductType] = useState(null);

  const [options, setOptions] = useState({
    contactType: [],
    maritalStatus: [],
    genderType: [],
    countries: [],
    cities: [],
    individualType: [],
    transitionCompanies: [],
    identityType: [],
  });

  const handleChangeTab = (tabName) => {
    setActiveTab(tabName);
  };

  const handleChangeTabForStatus = (offerStatus) => {
    if (offerStatus === OfferStatus.OFFER_REQUEST) {
      setActiveTab(tabNames[1]);
    } else if (offerStatus === OfferStatus.OFFER_DECLARATION) {
      setActiveTab(tabNames[2]);
    } else if (offerStatus === OfferStatus.PAYMENT_WAITING) {
      setActiveTab(tabNames[3]);
    }
  };

  const handleChangeProductType = (productType) => {
    setCurrentProductType(productType);
  };

  useEffect(() => {
    getLookups();
  }, []);

  useEffect(() => {
    if (checkIfIsEmpty(offerId)) {
      getOfferById();
    }
  }, [offerId]);

  const getOfferById = async () => {
    try {
      const url = getEntityUrl({
        api: {
          port: 8141,
          url: `Offers`,
        },
      });

      dispatch(setLoading(true));
      const response = await Requests().CommonRequest.getById({
        url,
        content: { id: offerId },
      });

      if (response && response.data && response.data?.IsSuccess) {
        const data = removeWhitespaceFromMobileNumbers(
          response.data?.Data,
          true
        );
        setOffer(data);
        setCurrentProductId(data?.ProductId);
        setCurrentProductType(ProductType.TSS);
        handleChangeTabForStatus(data.Status);
      }
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
    }
  };

  const getLookups = async () => {
    try {
      setOptions({
        contactType: await getLookupFromGetByName("ContactType"),
        maritalStatus: await getLookupFromGetByName("MaritalStatus"),
        genderType: await getLookupFromGetByName("GenderType"),
        individualType: await getLookupFromGetByName("IndividualType"),
        identityType: await getLookupFromGetByName("IdentityType"),
        cities: await getCities(),
        countries: await getCountries(),
        transitionCompanies: await getTransitionCompanyInformations(),
      });
    } catch (error) {}
  };

  const value = {
    activeTab,
    handleChangeTab,
    offer,
    setOffer,
    currentProductId,
    setCurrentProductId,
    options,
    currentProductType,
    handleChangeProductType,
  };

  return (
    <OfferCreateContext.Provider value={value}>
      {children}
    </OfferCreateContext.Provider>
  );
}

export function useOfferContext() {
  return useContext(OfferCreateContext);
}

import { Requests } from "@app/api";
import Input from "@components/Inputs/Input";
import { InputBase } from "@components/Inputs/InputBase";
import Icon from "@components/icon";
import Modal from "@components/modal";
import Loading from "@libs/loading";
import { MySwalData } from "@libs/myswaldata";
import { getEntityUrl } from "@libs/parser";
import { isJsonString } from "@libs/utils";
import { PackageCoverageDetailFormSchema } from "@validations/package.coverage.detail.validation";
import { PackageCoverageFormSchema } from "@validations/package.coverage.validation";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { v4 as uuidv4 } from "uuid";
import PlanAccordionView from "./plan.accordion.view";

function PlanViewTab() {
  const MySwal = withReactContent(Swal);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [coverageFormModalShow, setCoverageFormModalShow] = useState({
    show: false,
    isEdit: false,
  });
  const currentEntity = useSelector((state) => state.selection.currentEntity);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [selectedCoverage, setSelectedCoverage] = useState(null);
  const [coverages, setCoverages] = useState([]);

  const handleAdd = (coverage, isParent) => {
    if (coverage) {
      setSelectedCoverage(coverage);
    } else {
      setSelectedCoverage(null);
    }
    setCoverageFormModalShow({ show: true, isEdit: false, isParent });
  };

  const handleEdit = (coverage, isParent) => {
    setSelectedCoverage(coverage);
    setCoverageFormModalShow({ show: true, isEdit: true, coverage, isParent });
  };

  const handleDelete = (coverage) => {
    setSelectedCoverage(coverage);
    MySwal.fire(MySwalData("delete")).then((result) => {
      if (result.isConfirmed) {
        let currentCoverages = [...coverages];
        const checkParent = coverage && !coverage.ParentId;

        if (checkParent) {
          currentCoverages = coverages.filter((cv) => cv.Id !== coverage.Id);
        } else {
          let parentCoverage = currentCoverages.find(
            (current) => current.Id === coverage.ParentId
          );
          let parentCoverageIndex = currentCoverages.findIndex(
            (current) => current.Id === coverage.ParentId
          );
          parentCoverage.SubCoverages = parentCoverage.SubCoverages.filter(
            (x) => x.Id !== coverage.Id
          );
          currentCoverages[parentCoverageIndex] = parentCoverage;
        }
        formSubmit(currentCoverages, true);
      }
    });
  };

  const handleSelectCoverage = (coverage) => {
    setSelectedCoverage(coverage);
  };

  const formSubmit = async (values, isDelete) => {
    try {
      const url = getEntityUrl({
        api: { port: 8141, url: "Packages" },
      });

      const jsonContent = isDelete ? values : refactorSubmit(values);
      setLoading(true);
      const response = await Requests().CommonRequest.put({
        url,
        content: {
          ...currentPackage,
          Content: JSON.stringify(jsonContent),
        },
      });
      if (response && response.data && response.data.IsSuccess) {
        setCoverages(jsonContent);
        setCoverageFormModalShow({ show: false });
        isDelete && setSelectedCoverage(null);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const refactorSubmit = (values) => {
    let currentCoverages = [...coverages];
    const checkParent = values && !values.ParentId;
    if (checkParent) {
      const currentCoverageIndex = currentCoverages.findIndex(
        (coverage) => coverage.Id === values.Id
      );
      if (currentCoverageIndex > -1) {
        currentCoverages[currentCoverageIndex] = values;
      } else {
        currentCoverages = [...currentCoverages, values];
      }
    } else {
      let parentCoverage = currentCoverages.find(
        (current) => current.Id === values.ParentId
      );

      let parentCoverageIndex = currentCoverages.findIndex(
        (current) => current.Id === values.ParentId
      );
      const checkCurrentSubCoverages =
        parentCoverage.SubCoverages &&
        Array.isArray(parentCoverage.SubCoverages) &&
        parentCoverage.SubCoverages.length > 0;

      if (checkCurrentSubCoverages) {
        let currentChildIndex = parentCoverage.SubCoverages.findIndex(
          (child) => child.Id === values.Id
        );

        if (currentChildIndex > -1) {
          parentCoverage.SubCoverages[currentChildIndex] = values;
        } else {
          parentCoverage.SubCoverages = [
            ...parentCoverage.SubCoverages,
            values,
          ];
        }
      } else {
        parentCoverage = {
          ...parentCoverage,
          SubCoverages: [{ ...values }],
        };
      }
      currentCoverages[parentCoverageIndex] = parentCoverage;
    }

    return currentCoverages;
  };

  const getPackagesGetById = async (id) => {
    try {
      const url = getEntityUrl({
        api: { port: 8141, url: "Packages" },
      });

      const response = await Requests().CommonRequest.getById({
        url,
        content: { id },
        loading: true,
      });
      if (response && response.data && response.data.IsSuccess) {
        const pck = response.data?.Data;
        setCurrentPackage(pck);
        if (pck.Content && isJsonString(pck.Content)) {
          const content = JSON.parse(pck?.Content);
          setCoverages(content);
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    const checkId = currentEntity?.Data?.Id || currentEntity?.Id;
    if (checkId) {
      getPackagesGetById(currentEntity?.Data?.Id || currentEntity?.Id);
    }
  }, [currentEntity]);

  return (
    <div className="mt-5 container mx-auto">
      {loading && <Loading />}
      <div className="flex justify-between h-12 pl-5 items-center bg-primary">
        <h3 className="rounded-none bg-transparent font-semibold text-lg text-white">
          Teminat Ekleme
        </h3>
        <button
          onClick={() => handleAdd(null, false)}
          className="btn btn-success rounded-none h-full w-12"
        >
          <Icon icon="FaPlus" />
        </button>
      </div>
      <div className="page-content p-0 lg:p-2.5 flex flex-col lg:flex-row justify-around py-5 h-full gap-y-10">
        <div className="flex flex-col flex-1 lg:px-6 min-w-72">
          {coverages &&
            coverages.map((coverage) => (
              <PlanAccordionView
                coverage={coverage}
                handleAdd={handleAdd}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                selectedCoverage={selectedCoverage}
                handleSelectCoverage={handleSelectCoverage}
              />
            ))}
        </div>
        <div className="flex-1 min-w-72">
          {selectedCoverage && (
            <CoverageDetailForm
              selectedCoverage={selectedCoverage}
              formSubmit={formSubmit}
            />
          )}
        </div>
      </div>
      {coverageFormModalShow.show && (
        <CoverageFormModal
          open={coverageFormModalShow.show}
          onHide={() => setCoverageFormModalShow({ show: false })}
          formSubmit={formSubmit}
          selectedCoverage={selectedCoverage || coverageFormModalShow.coverage}
          isEdit={coverageFormModalShow.isEdit}
          isParent={coverageFormModalShow.isParent}
        />
      )}
    </div>
  );
}

const CoverageFormModal = ({
  open,
  onHide,
  formSubmit,
  selectedCoverage,
  isEdit,
  isParent,
}) => {
  const [formValues, setFormValues] = useState({
    Id: "",
    CoverageName: "",
  });

  const onSave = (values) => {
    const newId = uuidv4();
    let content;

    if (!isParent) {
      content = {
        ...values,
        Id: selectedCoverage?.Id ? selectedCoverage.Id : newId,
      };
    } else {
      content = {
        ...values,
        Id: newId,
        ParentId: selectedCoverage.Id,
      };
    }

    formSubmit(content);
  };

  useEffect(() => {
    if (isEdit && selectedCoverage) {
      setFormValues({
        ...selectedCoverage,
        CoverageName: selectedCoverage?.CoverageName
          ? selectedCoverage.CoverageName
          : "",
      });
    }
  }, [selectedCoverage, isEdit]);

  return (
    <Modal open={open} onClose={onHide} title="Teminat Ekleme">
      <Formik
        initialValues={formValues}
        validationSchema={PackageCoverageFormSchema}
        onSubmit={(values) => onSave(values)}
        enableReinitialize
      >
        {({ setFieldValue, values, handleSubmit }) => (
          <Form className="flex flex-col gap-y-2.5" onSubmit={handleSubmit}>
            <InputBase
              label="*Teminat Adı"
              component={Input}
              inputClassName="min-h-[40px] rounded-md border placeholder:normal-case"
              name="CoverageName"
              placeholder="Teminat adını giriniz"
            />
            <button className="btn btn-success mx-auto mt-2.5">Kaydet</button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

const CoverageDetailForm = ({ selectedCoverage, formSubmit }) => {
  const [formValues, setFormValues] = useState({
    Limit: "",
  });

  const onSave = (values) => {
    const content = {
      ...selectedCoverage,
      ...values,
    };
    formSubmit(content);
  };

  useEffect(() => {
    setFormValues({
      ...selectedCoverage,
      Limit: selectedCoverage?.Limit ? selectedCoverage.Limit : "",
    });
  }, [selectedCoverage]);

  return (
    <Formik
      validationSchema={PackageCoverageDetailFormSchema}
      initialValues={formValues}
      onSubmit={onSave}
      enableReinitialize
    >
      {({ values, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-x-2.5 mx-auto">
            <InputBase
              label="*Limit"
              component={Input}
              inputClassName="!h-10"
              type="text"
              name="Limit"
              placeholder="Limit giriniz"
            />
          </div>
          <button className="btn btn-primary mx-auto mt-2.5">Kaydet</button>
        </Form>
      )}
    </Formik>
  );
};

export default PlanViewTab;

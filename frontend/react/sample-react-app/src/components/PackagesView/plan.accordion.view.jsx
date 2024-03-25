import Icon from "@components/icon";
import classNames from "classnames";
import { useState } from "react";

function PlanAccordionView({
  coverage,
  handleAdd,
  handleEdit,
  handleDelete,
  selectedCoverage,
  handleSelectCoverage,
}) {
  const [expanded, setExpanded] = useState(false);

  const isExpanded = expanded.Id === coverage.Id;

  const isSelected = (coverage) => selectedCoverage?.Id === coverage?.Id;

  const handleExpanded = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className="flex flex-col py-0.5">
      <div className=" w-full h-12 flex items-center justify-between">
        <div className="flex h-full items-center w-full">
          <button
            onClick={() => handleExpanded(coverage)(null, !isExpanded)}
            className="btn btn-success h-full w-12 rounded-none"
          >
            <Icon
              icon="FaAngleRight"
              className={classNames({
                "rotate-0": !isExpanded,
                "rotate-90": isExpanded,
              })}
            />
          </button>
          <button
            onClick={() => handleSelectCoverage(coverage)}
            className={classNames({
              "rounded-none btn flex justify-start text-matter-horn bg-gray-200 px-2.5 w-full h-full flex-1": true,
              "bg-gray-400 text-white": isSelected(coverage),
            })}
          >
            <span>{coverage.CoverageName}</span>
          </button>
        </div>
        <div className="flex h-full">
          <button
            onClick={() => handleAdd(coverage, true)}
            className="btn btn-primary h-full w-12 rounded-none"
          >
            <Icon icon="FaPlus" />
          </button>
          <button
            onClick={() => handleEdit(coverage, false)}
            className="btn btn-warning h-full w-12 rounded-none"
          >
            <Icon icon="FaEdit" />
          </button>
          <button
            onClick={() => handleDelete(coverage)}
            className="btn btn-danger h-full w-12 rounded-none"
          >
            <Icon icon="FaTrash" />
          </button>
        </div>
      </div>
      {expanded &&
        expanded.Id === coverage.Id &&
        coverage.SubCoverages &&
        coverage.SubCoverages.length > 0 &&
        coverage.SubCoverages.map((child) => (
          <div className="w-full h-12 flex items-center justify-between mt-0.5">
            <div className="flex h-full items-center w-full pl-12">
              <button
                onClick={() => handleSelectCoverage(child)}
                className={classNames({
                  "rounded-none btn flex justify-start text-matter-horn bg-gray-200 px-2.5 w-full h-full flex-1": true,
                  "bg-gray-400 text-white": isSelected(child),
                })}
              >
                <span>{child.CoverageName}</span>
              </button>
            </div>
            <div className="flex h-full">
              <button
                onClick={() => handleEdit(child, false)}
                className="btn btn-warning h-full w-12 rounded-none"
              >
                <Icon icon="FaEdit" />
              </button>
              <button
                onClick={() => handleDelete(child, false)}
                className="btn btn-danger h-full w-12 rounded-none"
              >
                <Icon icon="FaTrash" />
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

export default PlanAccordionView;

import { ApprovalModal } from "@components/Approvals/kvkk.approval";
import { Checkbox } from "@components/Inputs/Checkbox";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { getApprovalByType } from "./service";

function ApprovalCheckboxInput({ setFieldValue, name, approvalType }) {
  const [approval, setApproval] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getApprovalByOffer();
  }, []);

  const getApprovalByOffer = async () => {
    try {
      setLoading(true);
      const response = await getApprovalByType(approvalType);

      if (response && response.data && Array.isArray(response.data)) {
        setApproval(response.data[0]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <CircularProgress size={25} />
      ) : (
        <Checkbox
          setFieldValue={setFieldValue}
          name={name}
          label={approval?.Name}
          ModalComponent={approval?.Content && ApprovalModal}
          modal={{
            title: approval?.Name,
            content: approval?.Content,
          }}
          showModal={true}
        />
      )}
    </>
  );
}

export default ApprovalCheckboxInput;

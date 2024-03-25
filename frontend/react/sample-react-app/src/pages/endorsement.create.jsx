import Index from "@components/EndorsementCreate";
import { EndorsementCreateProvider } from "@contexts/EndorsementCreateProvider";

function EndrosementCreate() {
  return (
    <EndorsementCreateProvider>
      <Index />
    </EndorsementCreateProvider>
  );
}

export default EndrosementCreate;

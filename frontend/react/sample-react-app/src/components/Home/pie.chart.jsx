import { PieChart } from "@mui/x-charts/PieChart";

import { Stack } from "@mui/material";
import { useRef } from "react";

const data = [
  { label: "ÖSS", value: 400, color: "#0088FE" },
  { label: "TSS", value: 300, color: "#00C49F" },
  { label: "YSS", value: 300, color: "#FFBB28" },
  { label: "TSU", value: 200, color: "#FF8042" },
];

const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);

const getArcLabel = (params) => {
  const percent = params.value / TOTAL;
  return `${(percent * 100).toFixed(0)}%`;
};

export default function OnSeriesItemClick() {
  const windowSize = useRef([window.innerWidth, window.innerHeight]);

  const isMobileSize = windowSize.current[0] >= 768;
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      alignItems={{ xs: "flex-start", md: "center" }}
      justifyContent="space-between"
      sx={{ width: "100%" }}
    >
      <PieChart
        series={[
          {
            data: data,
            arcLabel: getArcLabel,
          },
        ]}
        width={!isMobileSize ? 300 : 400}
        height={!isMobileSize ? 300 : 400}
        margin={{ right: 100 }}
      />
    </Stack>
  );
}

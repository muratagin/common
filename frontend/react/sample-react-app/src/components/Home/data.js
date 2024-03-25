export const DATA_TYPES = [
  {
    value: 1,
    label: "Üretim",
  },
  {
    value: 2,
    label: "Statü",
  },
  {
    value: 3,
    label: "Yenileme",
  },
  {
    value: 4,
    label: "Bölgesel Sıralama",
  },
];

export const DATE_RANGE = [
  {
    value: 1,
    label: "Bugün",
  },
  {
    value: 2,
    label: "Haftalık (Pazartesinden itibaren)",
  },
  {
    value: 3,
    label: "Aylık (Ayın ilk gününden itibaren)",
  },
];

export const TABLE_DATA = {
  columns: [
    {
      name: "Ürün Adı",
      selector: (row) => row.Name,
    },
    {
      name: "Poliçe Adedi",
      selector: (row) => row.TotalCount,
      key: "TotalCount",
    },
    {
      name: "Toplam Prim",
      selector: (row) => row.TotalPremium,
      key: "TotalPremium",
    },
    {
      name: "Toplam Komisyon",
      selector: (row) => row.TotalCommission,
      key: "TotalCommission",
    },
  ],
  data: [
    {
      Id: 1,
      Name: "TSS",
      TotalCount: 25,
      TotalPremium: 2495,
      TotalCommission: 500,
    },
    {
      Id: 2,
      Name: "ÖSS",
      TotalCount: 10,
      TotalPremium: 1812,
      TotalCommission: 700,
    },
    {
      Id: 3,
      Name: "YSS",
      TotalCount: 12,
      TotalPremium: 2782,
      TotalCommission: 342,
    },
  ],
};

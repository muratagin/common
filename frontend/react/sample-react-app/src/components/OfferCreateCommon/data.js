export const tabNames = [
  "Teklif Oluşturma",
  "Paket Seçimi",
  "Teklif Özet",
  "Poliçeleştir",
];

export const APPROVAL_INFO = {
  Label: "Acente Bilgilendirme Formu",
  Content:
    '<ul className="font-light px-5"> <li className="list-disc"> Bu kampanya IMC Sigorta & Reasürans Brokerliği AŞ. ‘ye ait 0212 700 17 88 numaralı İLKSAN sigorta destek hattından alınan Kasko ve/veya Trafik Sigortası poliçelerinde geçerlidir. </li> <li className="list-disc"> Kampanyaya katılmak için İlksan mensubu ve/veya yakını olunması gerekmektedir. </li> <li className="list-disc"> Satın alınan her Kasko sigortası için 500 TL değerinde A101 Alişveriş Hediye Kodu , Trafik Sigortası için 150 TL değerinde A101 Alişveriş Hediye Kodu kazanılacaktır. </li> <li className="list-disc"> Alışverişe götüren sigortaya katılabilmek ve A101 Alışveriş Hediye Kodu kazanabilmek için &nbsp; <a href="www.tambenimsigortam.com/ilksankampanya" target="_blank" className="underline" > www.tambenimsigortam.com/ilksankampanya </a> &nbsp; katılımcı bilgilerinin bırakılması ve dijital onayların tamamlanması gerekmektedir. </li> <li className="list-disc"> Kampanyaya katılım sağlayan müşterilere IMC Brokerlik tarafından poliçe tanzim tarihinden 60 gün sonra kampanya kodu maili/SMS’i gönderilecektir. Akabinde hediye kodu 81 ilde bulunan tüm A101 mağazalarında kullanabilecektir. </li> <li className="list-disc"> Hediye kodları ile tüm indirim ve kampanyalardan faydalanabilir. (Aldın Aldın, Haftanın Yıldızları v.b) </li> <li className="list-disc"> Hediye kodları, cep telefonu kontörü, Tütün ve tütün mamulleri, elektronik eşya, bebek maması ve mobilya ürünlerinde kullanılamaz. </li> <li className="list-disc"> Gönderilen kodların 1 yıl geçerlilik süresi vardır. Süre sonunda hediye kodu geçerliliğini kaybedecektir. </li> <li className="list-disc"> Hediye kodları online alışveriş için kullanılamaz. </li> <li className="list-disc"> Kampanya diğer kampanyalarla birleştirilemez. </li> <li className="list-disc"> IMC Sigorta & Reasürans Brokerliği ve İlksan, kampanyayı dilediği zaman durdurma ve/veya kampanya koşullarını değiştirme yetkisine sahiptir. </li> <li className="list-disc"> Kampanyaya ait detaylı bilgiye 0212 700 17 88 no’lu İLKSAN sigorta destek hattından ve{" "} <a href="www.tambenimsigortam.com/ilksankampanya" target="_blank" className="underline" > www.tambenimsigortam.com/ilksankampanya </a>{" "} web adresinden ulaşılabilir. </li> </ul>',
};

export const APPROVAL_KVKK_INFO = {
  Label: "Mesafeli Satış Sözleşmesi",
  Content:
    '<ul className="font-light px-5"> <li className="list-disc"> Bu kampanya IMC Sigorta & Reasürans Brokerliği AŞ. ‘ye ait 0212 700 17 88 numaralı İLKSAN sigorta destek hattından alınan Kasko ve/veya Trafik Sigortası poliçelerinde geçerlidir. </li> <li className="list-disc"> Kampanyaya katılmak için İlksan mensubu ve/veya yakını olunması gerekmektedir. </li> <li className="list-disc"> Satın alınan her Kasko sigortası için 500 TL değerinde A101 Alişveriş Hediye Kodu , Trafik Sigortası için 150 TL değerinde A101 Alişveriş Hediye Kodu kazanılacaktır. </li> <li className="list-disc"> Alışverişe götüren sigortaya katılabilmek ve A101 Alışveriş Hediye Kodu kazanabilmek için &nbsp; <a href="www.tambenimsigortam.com/ilksankampanya" target="_blank" className="underline" > www.tambenimsigortam.com/ilksankampanya </a> &nbsp; katılımcı bilgilerinin bırakılması ve dijital onayların tamamlanması gerekmektedir. </li> <li className="list-disc"> Kampanyaya katılım sağlayan müşterilere IMC Brokerlik tarafından poliçe tanzim tarihinden 60 gün sonra kampanya kodu maili/SMS’i gönderilecektir. Akabinde hediye kodu 81 ilde bulunan tüm A101 mağazalarında kullanabilecektir. </li> <li className="list-disc"> Hediye kodları ile tüm indirim ve kampanyalardan faydalanabilir. (Aldın Aldın, Haftanın Yıldızları v.b) </li> <li className="list-disc"> Hediye kodları, cep telefonu kontörü, Tütün ve tütün mamulleri, elektronik eşya, bebek maması ve mobilya ürünlerinde kullanılamaz. </li> <li className="list-disc"> Gönderilen kodların 1 yıl geçerlilik süresi vardır. Süre sonunda hediye kodu geçerliliğini kaybedecektir. </li> <li className="list-disc"> Hediye kodları online alışveriş için kullanılamaz. </li> <li className="list-disc"> Kampanya diğer kampanyalarla birleştirilemez. </li> <li className="list-disc"> IMC Sigorta & Reasürans Brokerliği ve İlksan, kampanyayı dilediği zaman durdurma ve/veya kampanya koşullarını değiştirme yetkisine sahiptir. </li> <li className="list-disc"> Kampanyaya ait detaylı bilgiye 0212 700 17 88 no’lu İLKSAN sigorta destek hattından ve{" "} <a href="www.tambenimsigortam.com/ilksankampanya" target="_blank" className="underline" > www.tambenimsigortam.com/ilksankampanya </a>{" "} web adresinden ulaşılabilir. </li> </ul>',
};

export const PACKAGES_DUMMY_DATA = [
  {
    id: 1,
    title: "PAKET A",
    price: 1250,
    content: [
      {
        treatmentText: "Ayakta Tedavi",
        countText: "Yıllık Limit",
        medicalExaminations: [
          {
            text: "Doktor Muayene",
            count: "5 Adet",
          },
          {
            text: "Endoskopik İşlemler & İleri Tanı Yönetimleri",
            count: "5 Adet",
          },
          {
            text: "Tahlil - Röntgen",
            count: "5 Adet",
          },
          {
            text: "Fizik Tedavi ve Rehab.",
            count: "5 Adet",
          },
          {
            text: "Küçük Müdahale Ayakta",
            count: "5 Adet",
          },
        ],
      },
      {
        treatmentText: "Yatarak Tedavi",
        countText: "Yıllık Limit",
        medicalExaminations: [
          {
            text: "Diyaliz",
            count: "5 Adet",
          },
          {
            text: "Yoğun Bakım",
            count: "5 Adet",
          },
          {
            text: "Cerrahi Yatış",
            count: "5 Adet",
          },
          {
            text: "Kemoterapi",
            count: "5 Adet",
          },
          {
            text: "Radyoterapi",
            count: "5 Adet",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "PAKET B",
    price: 1800,
    content: [
      {
        treatmentText: "Ayakta Tedavi",
        countText: "Yıllık Limit",
        medicalExaminations: [
          {
            text: "Doktor Muayene",
            count: "10 Adet",
          },
          {
            text: "Endoskopik İşlemler & İleri Tanı Yönetimleri",
            count: "10 Adet",
          },
          {
            text: "Tahlil - Röntgen",
            count: "10 Adet",
          },
          {
            text: "Fizik Tedavi ve Rehab.",
            count: "10 Adet",
          },
          {
            text: "Küçük Müdahale Ayakta",
            count: "10 Adet",
          },
        ],
      },
      {
        treatmentText: "Yatarak Tedavi",
        countText: "Yıllık Limit",
        medicalExaminations: [
          {
            text: "Diyaliz",
            count: "10 Adet",
          },
          {
            text: "Yoğun Bakım",
            count: "10 Adet",
          },
          {
            text: "Cerrahi Yatış",
            count: "10 Adet",
          },
          {
            text: "Kemoterapi",
            count: "10 Adet",
          },
          {
            text: "Radyoterapi",
            count: "10 Adet",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "PAKET C",
    price: 1950,
    content: [
      {
        treatmentText: "Ayakta Tedavi",
        countText: "Yıllık Limit",
        medicalExaminations: [
          {
            text: "Doktor Muayene",
            count: "LİMİTSİZ",
          },
          {
            text: "Endoskopik İşlemler & İleri Tanı Yönetimleri",
            count: "LİMİTSİZ",
          },
          {
            text: "Tahlil - Röntgen",
            count: "LİMİTSİZ",
          },
          {
            text: "Fizik Tedavi ve Rehab.",
            count: "LİMİTSİZ",
          },
          {
            text: "Küçük Müdahale Ayakta",
            count: "LİMİTSİZ",
          },
        ],
      },
      {
        treatmentText: "Yatarak Tedavi",
        countText: "Yıllık Limit",
        medicalExaminations: [
          {
            text: "Diyaliz",
            count: "LİMİTSİZ",
          },
          {
            text: "Yoğun Bakım",
            count: "LİMİTSİZ",
          },
          {
            text: "Cerrahi Yatış",
            count: "LİMİTSİZ",
          },
          {
            text: "Kemoterapi",
            count: "LİMİTSİZ",
          },
          {
            text: "Radyoterapi",
            count: "LİMİTSİZ",
          },
        ],
      },
    ],
  },
];

export const INSUREDS_DUMMY_DATA = {
  columns: [
    {
      name: "T.C. Kimlik No",
      selector: (row) => row.IdentityNo,
    },
    {
      name: "Adı Soyadı",
      selector: (row) => row.FullName,
      key: "TotalCount",
    },
    {
      name: "Cinsiyet",
      selector: (row) => row.GenderText,
      key: "TotalPremium",
    },
    {
      name: "Birey Tipi",
      selector: (row) => row.IndividualTypeText,
      key: "TotalCommission",
    },
  ],
  columns2: [
    {
      name: "T.C. Kimlik No",
      selector: (row) => row.IdentityNo,
    },
    {
      name: "Adı Soyadı",
      selector: (row) => row.FullName,
    },
    {
      name: "Cep Telefonu",
      selector: (row) => row.PhoneNumber,
      key: "PhoneNumber",
    },
    {
      name: "Paket Adı",
      selector: (row) => row.PackageName,
    },
    {
      name: "Prim",
      selector: (row) => row.Premium,
    },
    {
      name: "Sürprim",
      selector: (row) => row.SurPremium,
    },
    {
      name: "Beyan Onay Durumu",
      selector: (row) => row.DeclarationApprovalStatusText,
      key: "DeclarationApprovalStatusText",
    },
    {
      name: "KVKK Onay Durumu",
      selector: (row) => row.KVKKApprovalStatusText,
      key: "KVKKApprovalStatusText",
    },
    {
      name: "Geçiş Durumu",
      selector: (row) => row.IsTransition,
      key: "IsTransition",
    },
    {
      name: "Sonuç",
      selector: (row) => row.Result,
      key: "Result",
    },
    {
      name: "İşlemler",
      key: "actions",
    },
  ],
  insureds: [
    {
      Id: 1,
      IdentityNo: "0000000000",
      FullName: "Ahmet Erol",
      GenderText: "Erkek",
      IndividualTypeText: "Fert",
      PhoneNumber: "05070380000",
      PackageName: "PAKET A",
      DeclarationApprovalStatusText: "Onaylandı",
      KVKKApprovalStatusText: "Bekliyor",
      IsTransition: "Tamamlanmadı",
      Result: "65 yaş ve üstü bireylere teklif verilmemektedir.",
    },
    {
      Id: 2,
      IdentityNo: "0000000000",
      FullName: "Serdar Güneş",
      GenderText: "Erkek",
      IndividualTypeText: "Fert",
      PhoneNumber: "05070380000",
      PackageName: "PAKET B",
      DeclarationApprovalStatusText: "Onaylandı",
      KVKKApprovalStatusText: "Onaylandı",
      IsTransition: "Tamamlanmadı",
      Result: "Teklif Oluşturuldu",
    },
    {
      Id: 3,
      IdentityNo: "0000000000",
      FullName: "Orçun Nazım Kibar",
      GenderText: "Erkek",
      IndividualTypeText: "Fert",
      PhoneNumber: "05070380000",
      PackageName: "PAKET B",
      DeclarationApprovalStatusText: "Onaylandı",
      KVKKApprovalStatusText: "Onaylandı",
      IsTransition: "Tamamlanmadı",
      Result: "Teklif Oluşturuldu",
    },
  ],
};

export const DISCOUNT_RATE_OPTIONS = [
  {
    value: 1,
    label: "%2",
  },
  {
    value: 2,
    label: "%3",
  },
  {
    value: 4,
    label: "%4",
  },
  {
    value: 5,
    label: "%5",
  },
];

export const DISCOUNT_RATE_TYPE = [
  {
    value: 1,
    label: "Oran",
  },
  {
    value: 2,
    label: "Tutar",
  },
];

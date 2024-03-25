import { compareValues } from './utils';
import { v4 as uuidv4 } from 'uuid';

const policyTransferImportModel = [
  {
    content: [
      {
        fields: [
          {
            model: {
              create: 'SirketKod',
              edit: 'SirketKod',
              view: 'SirketKod',
              import: {
                index: 0,
                name: 'SirketKod',
              },
            },
          },
          {
            model: {
              create: 'PoliceNo',
              edit: 'PoliceNo',
              view: 'PoliceNo',
              import: {
                index: 1,
                name: 'PoliceNo',
              },
            },
          },
          {
            model: {
              create: 'YenilemeNo',
              edit: 'YenilemeNo',
              view: 'YenilemeNo',
              import: {
                index: 2,
                name: 'YenilemeNo',
              },
            },
          },
          {
            model: {
              create: 'PolBitisTarih',
              edit: 'PolBitisTarih',
              view: 'PolBitisTarih',
              import: {
                index: 3,
                name: 'PolBitisTarih',
              },
            },
          },
          {
            model: {
              create: 'GrupFerdi',
              edit: 'GrupFerdi',
              view: 'GrupFerdi',
              import: {
                index: 4,
                name: 'GrupFerdi',
              },
            },
          },
          {
            model: {
              create: 'AcenteKod',
              edit: 'AcenteKod',
              view: 'AcenteKod',
              import: {
                index: 5,
                name: 'AcenteKod',
              },
            },
          },
          {
            model: {
              create: 'OdemeSekli',
              edit: 'OdemeSekli',
              view: 'OdemeSekli',
              import: {
                index: 6,
                name: 'OdemeSekli',
              },
            },
          },
          {
            model: {
              create: 'BaslamaTarih',
              edit: 'BaslamaTarih',
              view: 'BaslamaTarih',
              import: {
                index: 7,
                name: 'BaslamaTarih',
              },
            },
          },
          {
            model: {
              create: 'TanzimTarih',
              edit: 'TanzimTarih',
              view: 'TanzimTarih',
              import: {
                index: 8,
                name: 'TanzimTarih',
              },
            },
          },
          {
            model: {
              create: 'MuhasebeTarih',
              edit: 'MuhasebeTarih',
              view: 'MuhasebeTarih',
              import: {
                index: 9,
                name: 'MuhasebeTarih',
              },
            },
          },
          {
            model: {
              create: 'ZeyilTip',
              edit: 'ZeyilTip',
              view: 'ZeyilTip',
              import: {
                index: 10,
                name: 'ZeyilTip',
              },
            },
          },
          {
            model: {
              create: 'ZeyilNo',
              edit: 'ZeyilNo',
              view: 'ZeyilNo',
              import: {
                index: 11,
                name: 'ZeyilNo',
              },
            },
          },
          {
            model: {
              create: 'VadeAdet',
              edit: 'VadeAdet',
              view: 'VadeAdet',
              import: {
                index: 12,
                name: 'VadeAdet',
              },
            },
          },
          {
            model: {
              create: 'SigEttiren_GercekTuzel',
              edit: 'SigEttiren_GercekTuzel',
              view: 'SigEttiren_GercekTuzel',
              import: {
                index: 13,
                name: 'SigEttiren_GercekTuzel',
              },
            },
          },
          {
            model: {
              create: 'SigEttiren_SirketAd',
              edit: 'SigEttiren_SirketAd',
              view: 'SigEttiren_SirketAd',
              import: {
                index: 14,
                name: 'SigEttiren_SirketAd',
              },
            },
          },
          {
            model: {
              create: 'SigEttiren_Ad',
              edit: 'SigEttiren_Ad',
              view: 'SigEttiren_Ad',
              import: {
                index: 15,
                name: 'SigEttiren_Ad',
              },
            },
          },
          {
            model: {
              create: 'SigEttiren_Soyad',
              edit: 'SigEttiren_Soyad',
              view: 'SigEttiren_Soyad',
              import: {
                index: 16,
                name: 'SigEttiren_Soyad',
              },
            },
          },
          {
            model: {
              create: 'SigEttiren_Cinsiyet',
              edit: 'SigEttiren_Cinsiyet',
              view: 'SigEttiren_Cinsiyet',
              import: {
                index: 17,
                name: 'SigEttiren_Cinsiyet',
              },
            },
          },
          {
            model: {
              create: 'SigEttiren_DogumTarihi',
              edit: 'SigEttiren_DogumTarihi',
              view: 'SigEttiren_DogumTarihi',
              import: {
                index: 18,
                name: 'SigEttiren_DogumTarihi',
              },
            },
          },
          {
            model: {
              create: 'SigEttiren_DogumYeri',
              edit: 'SigEttiren_DogumYeri',
              view: 'SigEttiren_DogumYeri',
              import: {
                index: 19,
                name: 'SigEttiren_DogumYeri',
              },
            },
          },
          {
            model: {
              create: 'SigEttiren_BabaAd',
              edit: 'SigEttiren_BabaAd',
              view: 'SigEttiren_BabaAd',
              import: {
                index: 20,
                name: 'SigEttiren_BabaAd',
              },
            },
          },
          {
            model: {
              create: 'SigEttiren_Uyruk',
              edit: 'SigEttiren_Uyruk',
              view: 'SigEttiren_Uyruk',
              import: {
                index: 21,
                name: 'SigEttiren_Uyruk',
              },
            },
          },
          {
            model: {
              create: 'SigEttiren_VKN',
              edit: 'SigEttiren_VKN',
              view: 'SigEttiren_VKN',
              import: {
                index: 22,
                name: 'SigEttiren_VKN',
              },
            },
          },
          {
            model: {
              create: 'SigEttiren_PasaportNo',
              edit: 'SigEttiren_PasaportNo',
              view: 'SigEttiren_PasaportNo',
              import: {
                index: 23,
                name: 'SigEttiren_PasaportNo',
              },
            },
          },
          {
            model: {
              create: 'SigEttiren_TCKN',
              edit: 'SigEttiren_TCKN',
              view: 'SigEttiren_TCKN',
              import: {
                index: 24,
                name: 'SigEttiren_TCKN',
              },
            },
          },
          {
            model: {
              create: 'SigEttiren_IlKod',
              edit: 'SigEttiren_IlKod',
              view: 'SigEttiren_IlKod',
              import: {
                index: 25,
                name: 'SigEttiren_IlKod',
              },
            },
          },
          {
            model: {
              create: 'SigEttiren_IlceKod',
              edit: 'SigEttiren_IlceKod',
              view: 'SigEttiren_IlceKod',
              import: {
                index: 26,
                name: 'SigEttiren_IlceKod',
              },
            },
          },
          {
            model: {
              create: 'SigEttiren_UlkeKod',
              edit: 'SigEttiren_UlkeKod',
              view: 'SigEttiren_UlkeKod',
              import: {
                index: 27,
                name: 'SigEttiren_UlkeKod',
              },
            },
          },
          {
            model: {
              create: 'SigEttiren_AdresTarif',
              edit: 'SigEttiren_AdresTarif',
              view: 'SigEttiren_AdresTarif',
              import: {
                index: 28,
                name: 'SigEttiren_AdresTarif',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_No',
              edit: 'Sigortali_No',
              view: 'Sigortali_No',
              import: {
                index: 29,
                name: 'Sigortali_No',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_IlkKayitTarihi',
              edit: 'Sigortali_IlkKayitTarihi',
              view: 'Sigortali_IlkKayitTarihi',
              import: {
                index: 30,
                name: 'Sigortali_IlkKayitTarihi',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_IlkSigortalanmaTarihi',
              edit: 'Sigortali_IlkSigortalanmaTarihi',
              view: 'Sigortali_IlkSigortalanmaTarihi',
              import: {
                index: 31,
                name: 'Sigortali_IlkSigortalanmaTarihi',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_PaketNo',
              edit: 'Sigortali_PaketNo',
              view: 'Sigortali_PaketNo',
              import: {
                index: 32,
                name: 'Sigortali_PaketNo',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_BireyTip',
              edit: 'Sigortali_BireyTip',
              view: 'Sigortali_BireyTip',
              import: {
                index: 33,
                name: 'Sigortali_BireyTip',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_PrimTL',
              edit: 'Sigortali_PrimTL',
              view: 'Sigortali_PrimTL',
              import: {
                index: 34,
                name: 'Sigortali_PrimTL',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_AileNo',
              edit: 'Sigortali_AileNo',
              view: 'Sigortali_AileNo',
              import: {
                index: 35,
                name: 'Sigortali_AileNo',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_Ad',
              edit: 'Sigortali_Ad',
              view: 'Sigortali_Ad',
              import: {
                index: 36,
                name: 'Sigortali_Ad',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_Soyad',
              edit: 'Sigortali_Soyad',
              view: 'Sigortali_Soyad',
              import: {
                index: 37,
                name: 'Sigortali_Soyad',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_Cinsiyet',
              edit: 'Sigortali_Cinsiyet',
              view: 'Sigortali_Cinsiyet',
              import: {
                index: 38,
                name: 'Sigortali_Cinsiyet',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_DogumTarihi',
              edit: 'Sigortali_DogumTarihi',
              view: 'Sigortali_DogumTarihi',
              import: {
                index: 39,
                name: 'Sigortali_DogumTarihi',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_DogumYeri',
              edit: 'Sigortali_DogumYeri',
              view: 'Sigortali_DogumYeri',
              import: {
                index: 40,
                name: 'Sigortali_DogumYeri',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_BabaAd',
              edit: 'Sigortali_BabaAd',
              view: 'Sigortali_BabaAd',
              import: {
                index: 41,
                name: 'Sigortali_BabaAd',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_Uyruk',
              edit: 'Sigortali_Uyruk',
              view: 'Sigortali_Uyruk',
              import: {
                index: 42,
                name: 'Sigortali_Uyruk',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_VKN',
              edit: 'Sigortali_VKN',
              view: 'Sigortali_VKN',
              import: {
                index: 43,
                name: 'Sigortali_VKN',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_PasaportNo',
              edit: 'Sigortali_PasaportNo',
              view: 'Sigortali_PasaportNo',
              import: {
                index: 44,
                name: 'Sigortali_PasaportNo',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_TCKN',
              edit: 'Sigortali_TCKN',
              view: 'Sigortali_TCKN',
              import: {
                index: 45,
                name: 'Sigortali_TCKN',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_IlKod',
              edit: 'Sigortali_IlKod',
              view: 'Sigortali_IlKod',
              import: {
                index: 46,
                name: 'Sigortali_IlKod',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_IlceKod',
              edit: 'Sigortali_IlceKod',
              view: 'Sigortali_IlceKod',
              import: {
                index: 47,
                name: 'Sigortali_IlceKod',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_UlkeKod',
              edit: 'Sigortali_UlkeKod',
              view: 'Sigortali_UlkeKod',
              import: {
                index: 48,
                name: 'Sigortali_UlkeKod',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_AdresTarif',
              edit: 'Sigortali_AdresTarif',
              view: 'Sigortali_AdresTarif',
              import: {
                index: 49,
                name: 'Sigortali_AdresTarif',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_TelefonNo',
              edit: 'Sigortali_TelefonNo',
              view: 'Sigortali_TelefonNo',
              import: {
                index: 50,
                name: 'Sigortali_TelefonNo',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_Email',
              edit: 'Sigortali_Email',
              view: 'Sigortali_Email',
              import: {
                index: 51,
                name: 'Sigortali_Email',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_CepTel',
              edit: 'Sigortali_CepTel',
              view: 'Sigortali_CepTel',
              import: {
                index: 52,
                name: 'Sigortali_CepTel',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_BankaKod',
              edit: 'Sigortali_BankaKod',
              view: 'Sigortali_BankaKod',
              import: {
                index: 53,
                name: 'Sigortali_BankaKod',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_BankaAd',
              edit: 'Sigortali_BankaAd',
              view: 'Sigortali_BankaAd',
              import: {
                index: 54,
                name: 'Sigortali_BankaAd',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_SubeKod',
              edit: 'Sigortali_SubeKod',
              view: 'Sigortali_SubeKod',
              import: {
                index: 55,
                name: 'Sigortali_SubeKod',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_SubeAd',
              edit: 'Sigortali_SubeAd',
              view: 'Sigortali_SubeAd',
              import: {
                index: 56,
                name: 'Sigortali_SubeAd',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_',
              edit: 'Sigortali_',
              view: 'Sigortali_',
              import: {
                index: 57,
                name: 'Sigortali_',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_HesapSahip',
              edit: 'Sigortali_HesapSahip',
              view: 'Sigortali_HesapSahip',
              import: {
                index: 58,
                name: 'Sigortali_HesapSahip',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_HesapNo',
              edit: 'Sigortali_HesapNo',
              view: 'Sigortali_HesapNo',
              import: {
                index: 59,
                name: 'Sigortali_HesapNo',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_Iban',
              edit: 'Sigortali_Iban',
              view: 'Sigortali_Iban',
              import: {
                index: 60,
                name: 'Sigortali_Iban',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_Istisna',
              edit: 'Sigortali_Istisna',
              view: 'Sigortali_Istisna',
              import: {
                index: 61,
                name: 'Sigortali_Istisna',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_Beyan',
              edit: 'Sigortali_Beyan',
              view: 'Sigortali_Beyan',
              import: {
                index: 62,
                name: 'Sigortali_Beyan',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_GecisNotu',
              edit: 'Sigortali_GecisNotu',
              view: 'Sigortali_GecisNotu',
              import: {
                index: 63,
                name: 'Sigortali_GecisNotu',
              },
            },
          },
          {
            model: {
              create: 'Sigortali_BilgiNotu',
              edit: 'Sigortali_BilgiNotu',
              view: 'Sigortali_BilgiNotu',
              import: {
                index: 64,
                name: 'Sigortali_BilgiNotu',
              },
            },
          },
          {
            model: {
              create: 'PoliceOtorizasyonKodu',
              edit: 'PoliceOtorizasyonKodu',
              view: 'PoliceOtorizasyonKodu',
              import: {
                index: 65,
                name: 'PoliceOtorizasyonKodu',
              },
            },
          },
          {
            model: {
              create: 'Count',
              edit: 'Count',
              view: 'Count',
              import: {
                index: 66,
                name: 'Toplam_Sayi',
              },
            },
          },
          {
            model: {
              create: 'CorrelationId',
              edit: 'CorrelationId',
              view: 'CorrelationId',
              import: {
                index: 67,
                name: 'KorelasyonId',
              },
            },
          },
        ],
      },
    ],
  },
];

export const getImportModel = assetName => {
  let tabs = [];
  switch (assetName) {
    case 'policyTransfer':
      tabs = [...policyTransferImportModel];
      break;
    default:
      break;
  }
  return tabs;
};

//import(excel) dizi modelini kolon başlıklarına göre obje dizisine çevirir.
const importModelArrayToObjectArray = datas => {
  let [firstElement, ...remainingElements] = datas;
  let array = [];
  let object;

  remainingElements.forEach(element => {
    element.forEach((value, index) => {
      object = { ...object, [firstElement[index]]: value };
    });
    array.push(object);
  });
  return array;
};

//import(excel) obje dizi modelini sıraladıktan sonra dizi modeline çevirir.
const importModelObjectArrayToArray = datas => {
  let array = [...datas];
  let firstData = array.shift();
  let columns = [];
  let result = [];

  Object.keys(firstData).forEach(key => {
    columns.push(key);
  });
  result.push(columns);
  datas.forEach(data => {
    let values = [];
    Object.entries(data).forEach(([, value]) => {
      values.push(value);
    });
    result.push(values);
  });

  return result;
};

const groupBy = (key, arr) =>
  arr.reduce((cache, object) => {
    let property = object[key];
    if (property in cache) {
      return { ...cache, [property]: cache[property].concat(object) };
    }
    return { ...cache, [property]: [object] };
  }, {});

const groupingAndSorting = objectArray => {
  let result = [];
  let group = groupBy('SirketKod', objectArray);
  Object.values(group).forEach((groupItem, companyIndex) => {
    let policyGroup = groupBy('PoliceNo', groupItem);
    Object.entries(policyGroup).forEach(([key, policyGroupItem], polIndex) => {
      let sortedRenewalNo = policyGroupItem.sort(compareValues('YenilemeNo'));
      let renewalNoGroup = groupBy('YenilemeNo', sortedRenewalNo);
      Object.values(renewalNoGroup).forEach(renewalNoGroupItem => {
        let sortedEndorsementNo = renewalNoGroupItem.sort(
          compareValues('ZeyilNo')
        );
        let endorsementNoGroup = groupBy('ZeyilNo', sortedEndorsementNo);
        Object.values(endorsementNoGroup).forEach(endorsementNoGroupItem => {
          let correlationId = uuidv4();
          endorsementNoGroupItem.forEach((value, index) => {
            // if (value === endorsementNoGroupItem[endorsementNoGroupItem.length - 1]) {
            //     // son kayit -> evet
            //     value["Son_Kayit"] = true
            // } else {
            //     value["Son_Kayit"] = false
            //     // son kayit -> hayir
            // }
            value['Toplam_Sayi'] = endorsementNoGroupItem.length;
            value['KorelasyonId'] = correlationId;
            result = [...result, value];
          });
        });
      });
    });
  });
  return result;
};

export const sortingImportModel = (datas, sortingDatas) => {
  let result = [];
  let objectArray = [...importModelArrayToObjectArray(datas)];

  let completed = groupingAndSorting(objectArray, sortingDatas);

  return (result = [...importModelObjectArrayToArray(completed)]);
};

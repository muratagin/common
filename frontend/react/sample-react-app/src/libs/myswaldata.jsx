export const MySwalData = (type, swal) => {
  if (type === "success") {
    return {
      title: "BAŞARILI İŞLEM",
      html: swal?.text || "İşleminiz başarıyla tamamlandı.",
      icon: "success",
      confirmButtonText: "TAMAM",
    };
  } else if (type === "warning") {
    return {
      title: "UYARI",
      html: swal?.text || "İşleminiz gerçekleştirilemedi.",
      icon: "warning",
      confirmButtonText: "TAMAM",
    };
  } else if (type === "error") {
    return {
      title: "HATA OLUŞTU",
      html: swal?.text || "İşleminiz gerçekleşirken hata oluştu.",
      icon: "error",
      confirmButtonText: "TAMAM",
    };
  } else if (type === "delete") {
    return {
      title: "SİLME İSTEĞİ",
      html: swal?.text || "Bu kaydı silmek istediğinize emin misiniz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ONAYLA",
      cancelButtonText: "VAZGEÇ",
    };
  } else if (type === "clone") {
    return {
      title: "KLONLAMA İSTEĞİ",
      text: "Klonlama yapmak istediğinize emin misiniz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ONAYLA",
      cancelButtonText: "VAZGEÇ",
    };
  } else if (type === "confirm") {
    return {
      title: swal?.title || "İŞLEM ONAYI",
      text: swal?.text || "Devam etmek için lütfen onaylayınız!",
      icon: swal?.icon || "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ONAYLA",
      cancelButtonText: "VAZGEÇ",
    };
  } else {
    return {
      title: swal?.title || null,
      html: swal?.text || null,
      icon: swal?.icon || null,
      showCancelButton: swal?.showCancelButton || false,
      confirmButtonColor: swal?.confirmButtonColor || null,
      cancelButtonColor: swal?.cancelButtonColor || null,
      confirmButtonText: swal?.confirmButtonText || null,
      cancelButtonText: swal?.cancelButtonText || null,
      ...swal,
    };
  }
};

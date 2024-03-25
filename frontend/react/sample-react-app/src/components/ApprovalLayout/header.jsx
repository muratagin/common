function Header() {
  return (
    <header className="h-16 bg-orange flex gap-x-3 px-2">
      <div className="container mx-auto flex justify-between items-center ">
        <span className="text-white font-medium text-left text-sm">
          Tamamlayıcı Sağlık Sigortası <br />
          Beyan Onayı
        </span>
        <img
          src="/company-white-logo.svg"
          className="object-contain w-28 text-white"
        />
      </div>
    </header>
  );
}

export default Header;

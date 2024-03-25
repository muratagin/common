import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { CiMenuFries } from "react-icons/ci";
import {
  FaAddressCard,
  FaAngleDown,
  FaAngleRight,
  FaAudible,
  FaBell,
  FaBuilding,
  FaBuromobelexperte,
  FaCalendarAlt,
  FaCaretDown,
  FaCaretRight,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaClone,
  FaCloudUploadAlt,
  FaCog,
  FaCopy,
  FaDownload,
  FaEdit,
  FaEnvelopeOpenText,
  FaEraser,
  FaFax,
  FaFile,
  FaFileExcel,
  FaFileExport,
  FaFileImport,
  FaFilePdf,
  FaFolderOpen,
  FaGlobe,
  FaGlobeEurope,
  FaGraduationCap,
  FaHandHolding,
  FaHeading,
  FaHistory,
  FaHotel,
  FaHourglassHalf,
  FaInfo,
  FaInfoCircle,
  FaList,
  FaListUl,
  FaPaste,
  FaPause,
  FaPencilRuler,
  FaPhoneAlt,
  FaPlay,
  FaPlus,
  FaPowerOff,
  FaProcedures,
  FaProductHunt,
  FaQrcode,
  FaRedo,
  FaRev,
  FaSearch,
  FaSignOutAlt,
  FaSort,
  FaStethoscope,
  FaStickyNote,
  FaSync,
  FaTasks,
  FaTimes,
  FaTimesCircle,
  FaTools,
  FaTrash,
  FaTrashAlt,
  FaUnlock,
  FaUpload,
  FaUserAlt,
  FaUserMd,
  FaUserTie,
} from "react-icons/fa";
import { GrClose, GrSystem, GrUserSettings } from "react-icons/gr";
import {
  HiOutlineChevronDown,
  HiOutlineDocumentAdd,
  HiOutlineDocumentText,
  HiOutlineMail,
  HiOutlineRefresh,
} from "react-icons/hi";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { IoMdMegaphone } from "react-icons/io";
import { LuBellPlus } from "react-icons/lu";
import {
  MdCampaign,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdLogout,
  MdOutlineArrowBack,
  MdOutlineKeyboardBackspace,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { PiCaretDownThin } from "react-icons/pi";
import { RiUserSettingsFill } from "react-icons/ri";
import { SiPowerbi } from "react-icons/si";
import { TfiAngleDown, TfiAngleLeft } from "react-icons/tfi";

const Icon = ({ icon = "FaUserAlt", className, style, ...props }) => {
  const icons = {
    FaEdit: FaEdit,
    FaCog: FaCog,
    FaFileExcel: FaFileExcel,
    FaPlus: FaPlus,
    FaFile: FaFile,
    FaFolderOpen: FaFolderOpen,
    FaStickyNote: FaStickyNote,
    FaDownload: FaDownload,
    FaFileExport: FaFileExport,
    FaFileImport: FaFileImport,
    FaTrashAlt: FaTrashAlt,
    FaHourglassHalf: FaHourglassHalf,
    FaPaste: FaPaste,
    FaCopy: FaCopy,
    FaSearch: FaSearch,
    FaClone: FaClone,
    FaSort: FaSort,
    FaAngleDown: FaAngleDown,
    FaAngleRight: FaAngleRight,
    FaEraser: FaEraser,
    FaFilePdf: FaFilePdf,
    FaTimes: FaTimes,
    FaTrash: FaTrash,
    FaSync: FaSync,
    FaBuilding: FaBuilding,
    FaTasks: FaTasks,
    FaCheck: FaCheck,
    FaRedo: FaRedo,
    FaInfo: FaInfo,
    FaUserAlt: FaUserAlt,
    FaUserMd: FaUserMd,
    FaBell: FaBell,
    FaEnvelopeOpenText: FaEnvelopeOpenText,
    FaProductHunt: FaProductHunt,
    FaProcedures: FaProcedures,
    FaPencilRuler: FaPencilRuler,
    FaHistory: FaHistory,
    TfiAngleLeft: TfiAngleLeft,
    TfiAngleDown: TfiAngleDown,
    SiPowerbi: SiPowerbi,
    AiFillStar: AiFillStar,
    AiOutlineStar: AiOutlineStar,
    GrSystem: GrSystem,
    FaSignOutAlt: FaSignOutAlt,
    FaListUl: FaListUl,
    BsThreeDots: BsThreeDots,
    FaChevronLeft: FaChevronLeft,
    FaChevronRight: FaChevronRight,
    FaPause: FaPause,
    FaPlay: FaPlay,
    FaCloudUploadAlt: FaCloudUploadAlt,
    FaCaretRight: FaCaretRight,
    FaCaretDown: FaCaretDown,
    FaList: FaList,
    FaTimesCircle: FaTimesCircle,
    FaAudible: FaAudible,
    FaRev: FaRev,
    FaFax: FaFax,
    FaHotel: FaHotel,
    FaCalendarAlt: FaCalendarAlt,
    FaTools: FaTools,
    FaBuromobelexperte: FaBuromobelexperte,
    FaAddressCard: FaAddressCard,
    FaQrcode: FaQrcode,
    FaStethoscope: FaStethoscope,
    FaGraduationCap: FaGraduationCap,
    FaHeading: FaHeading,
    FaUserTie: FaUserTie,
    FaGlobeEurope: FaGlobeEurope,
    FaGlobe: FaGlobe,
    FaPhoneAlt: FaPhoneAlt,
    MdVisibilityOff: MdVisibilityOff,
    MdVisibility: MdVisibility,
    HiOutlineChevronDown: HiOutlineChevronDown,
    HiOutlineMail: HiOutlineMail,
    HiOutlineRefresh: HiOutlineRefresh,
    FaPowerOff: FaPowerOff,
    PiCaretDownThin: PiCaretDownThin,
    MdCampaign: MdCampaign,
    MdKeyboardArrowDown: MdKeyboardArrowDown,
    MdKeyboardArrowUp: MdKeyboardArrowUp,
    MdOutlineArrowBack: MdOutlineArrowBack,
    FaInfoCircle: FaInfoCircle,
    MdOutlineKeyboardBackspace: MdOutlineKeyboardBackspace,
    CiMenuFries: CiMenuFries,
    GrClose: GrClose,
    LuBellPlus: LuBellPlus,
    IoMdMegaphone: IoMdMegaphone,
    FaHandHolding: FaHandHolding,
    HiOutlineDocumentAdd: HiOutlineDocumentAdd,
    HiOutlineClipboardDocumentCheck: HiOutlineClipboardDocumentCheck,
    HiOutlineDocumentText: HiOutlineDocumentText,
    FaUnlock: FaUnlock,
    MdLogout: MdLogout,
    FaUpload: FaUpload,
    GrUserSettings: GrUserSettings,
    RiUserSettingsFill: RiUserSettingsFill,
  };

  const IconComponent = icons[icon];
  return (
    <>
      {IconComponent ? (
        <IconComponent className={className} style={style} {...props} />
      ) : (
        <span className="text-xs">{icon}</span>
      )}
    </>
  );
};

export default Icon;

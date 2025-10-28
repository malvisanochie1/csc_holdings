import { BsFillLightbulbFill } from "react-icons/bs";
import { BsBank2 } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { FaCommentsDollar } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { IoSettings } from "react-icons/io5";

export type NavKey =
  | "dashboard"
  | "profile"
  | "transactions"
  | "notifications"
  | "settings"
  | "logout";

interface AccountAssets {
  img: string;
  currency: string;
  amount: number;
  option: string;
  className?: string;
}
interface AccountCurrency {
  img: string;
  currency: string;
  amount: number;
  option: string;
  className?: string;
}
export const account_assets: AccountAssets[] = [
  {
    img: "/dashboard/account_overview/gold.png",
    currency: "Gold",
    amount: 10000,
    option: "convert",
  },
  {
    img: "/dashboard/account_overview/solana.png",
    currency: "Solana",
    amount: 0,
    option: "convert",
  },
  {
    img: "/dashboard/account_overview/XRP.png",
    currency: "XRP",
    amount: 0,
    option: "convert",
  },
  {
    img: "/dashboard/account_overview/Etherum.png",
    currency: "Etherum",
    amount: 0,
    option: "convert",
    className: "lg:!col-span-2",
  },
  {
    img: "/dashboard/account_overview/btc.png",
    currency: "Bitcoin",
    amount: 0,
    option: "convert",
    className: "!col-span-2",
  },
];

export const account_currency: AccountCurrency[] = [
  {
    img: "/dashboard/account_overview/dollar-symbol.png",
    currency: "USD",
    amount: 0,
    option: "withdraw",
  },
  {
    img: "/dashboard/account_overview/euro.png",
    currency: "Euro",
    amount: 0,
    option: "withdraw",
  },
  {
    img: "/dashboard/account_overview/pound-sterling.png",
    currency: "Pounds",
    amount: 0,
    option: "withdraw",
  },
  {
    img: "/dashboard/account_overview/yen.png",
    currency: "Yen",
    amount: 0,
    option: "withdraw",
    className: "lg:col-span-2",
  },
  {
    img: "/dashboard/account_overview/Bahraini.png",
    currency: "Bahraini Dinar",
    amount: 0,
    option: "withdraw",
    className: "col-span-2",
  },
];

export const steps = [
  {
    title: "Recovery Initiated",
    desc: "Commence Of Recovery, Engaging Trade Company And Serving Claims Notices",
    bg: "bg-[#292E4F]",
    icon: <BsFillLightbulbFill size={14} className="text-white" />,
  },
  {
    title: "Processing Request",
    desc: "Processing Proof Of Claim With Trade Company",
    bg: "bg-[#EC3A51]",
    icon: <BsFillLightbulbFill size={14} className="text-white" />,
  },
  {
    title: "Legal Process Initiated",
    desc: "Filing Legal Documents And Processing For Solicit And Litigation",
    bg: "bg-[#219AFE]",
    icon: <BsFillLightbulbFill size={14} className="text-white" />,
  },
  {
    title: "Litigation In Process",
    desc: "Engaging Trade Company In Conversation And Settlements",
    bg: "bg-[#F98B36]",
    icon: <BsFillLightbulbFill size={14} className="text-white" />,
  },
  {
    title: "Funds Re-claim In Progress",
    desc: "Receiving Settled Claim Funds From Trade Company",
    bg: "bg-[#B915A6]",
    icon: <BsFillLightbulbFill size={14} className="text-white" />,
  },
  {
    title: "Recovery Complete",
    desc: "Confirmation Of Reception Of Funds To Company Account",
    bg: "bg-[#73CD2C]",
    icon: <BsFillLightbulbFill size={14} className="text-white" />,
  },
];

export const navItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: <BsBank2 size={15} className="mx-auto" />,
  },
  {
    key: "profile",
    label: "Profile",
    href: "/profile",
    icon: <FaUser size={15} className="mx-auto" />,
  },
  {
    key: "transactions",
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: <FaCommentsDollar size={15} className="mx-auto" />,
  },
  {
    key: "notifications",
    label: "Notifications",
    href: "/notification",
    icon: <FaBell size={15} className="mx-auto" />,
  },
  {
    key: "settings",
    label: "Settings",
    href: "/settings",
    icon: <IoSettings size={15} className="mx-auto" />,
  },
  {
    key: "logout",
    label: "Logout",
    href: "/login",
    icon: <TbLogout2 size={15} className="mx-auto text-" />,
  },
];

export const Incoming_funds_reclaim_history = [
  {
    date: "2025-10-09 13:16:58",
    entity: "NB LTD",
    assets: "Gold",
    status: "completed",
    value: "10,000",
  },
  {
    date: "2025-10-09 04:16:58",
    entity: "NB LTD",
    assets: "solana",
    status: "completed",
    value: "1,000",
  },
  {
    date: "2025-10-08 13:16:58",
    entity: "NB LTD",
    assets: "Etherum",
    status: "pending",
    value: "5,000",
  },
  {
    date: "2025-10-07 13:16:58",
    entity: "NB LTD",
    assets: "Bitcoin",
    status: "failed",
    value: "2,500",
  },
];

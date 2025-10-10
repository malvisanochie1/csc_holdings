import { BsFillLightbulbFill } from "react-icons/bs";

interface AccountOverviewItem {
  img: string;
  currency: string;
  amount: number;
  option: { option1: string; option2: string }[];
  className?: string;
}

export const account_overview: AccountOverviewItem[] = [
  {
    img: "/dashboard/account_overview/gold.png",
    currency: "Gold",
    amount: 10000,
    option: [
      {
        option1: "convert",
        option2: "withdraw",
      },
    ],
    className: "",
  },
  {
    img: "/dashboard/account_overview/silver.png",
    currency: "Silver",
    amount: 0,
    option: [
      {
        option1: "convert",
        option2: "withdraw",
      },
    ],
    className: "",
  },
  {
    img: "/dashboard/account_overview/platinum.png",
    currency: "Platinum",
    amount: 0,
    option: [
      {
        option1: "convert",
        option2: "withdraw",
      },
    ],
    className: "",
  },
  {
    img: "/dashboard/account_overview/stock.webp",
    currency: "Stocks",
    amount: 0,
    option: [
      {
        option1: "convert",
        option2: "withdraw",
      },
    ],
    className: "lg:!col-span-2",
  },
  {
    img: "/dashboard/account_overview/btc.png",
    currency: "Bitcoin",
    amount: 0,
    option: [
      {
        option1: "convert",
        option2: "withdraw",
      },
    ],
    className: "lg:!col-span-2",
  },
  {
    img: "/dashboard/account_overview/dollar-symbol.png",
    currency: "USD",
    amount: 0,
    option: [
      {
        option1: "convert",
        option2: "withdraw",
      },
    ],
    className: "",
  },
  {
    img: "/dashboard/account_overview/euro.png",
    currency: "Euro",
    amount: 0,
    option: [
      {
        option1: "convert",
        option2: "withdraw",
      },
    ],
    className: "",
  },
  {
    img: "/dashboard/account_overview/pound-sterling.png",
    currency: "Pounds",
    amount: 0,
    option: [
      {
        option1: "convert",
        option2: "withdraw",
      },
    ],
    className: "",
  },
  {
    img: "/dashboard/account_overview/yen.png",
    currency: "Yen",
    amount: 0,
    option: [
      {
        option1: "convert",
        option2: "withdraw",
      },
    ],
    className: "lg:col-span-2",
  },
  {
    img: "/dashboard/account_overview/Bahraini.png",
    currency: "Bahraini Dinar",
    amount: 0,
    option: [
      {
        option1: "convert",
        option2: "withdraw",
      },
    ],
    className: "lg:col-span-2",
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

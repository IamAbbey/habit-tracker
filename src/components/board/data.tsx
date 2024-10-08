import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon
} from "@radix-ui/react-icons";
import { Priority } from "./schema";


export const priorities: Priority[] = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
];

export const weekColors = [
  "#FF6F61",
  "#FFB74D",
  "#37b289",
  "#5285F5",
  "#AB47BC",
];

export const weekTaskColors = [
  "#FFB3AC",
  "#FFD699",
  "#A7DED7",
  "#90CAF9",
  "#D7A8E1",
];

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";

export function YearPicker() {
  const setSelectedDate = useAppStore((state) => state.setSelectedDate);
  const selectedDate = useAppStore((state) => state.selectedDate);
  const minYear = 2000;
  const maxYear = new Date().getFullYear();

  const onValueChange = (value: string) => {
    setSelectedDate(selectedDate.year(Number(value)));
  };

  return (
    <Select
      onValueChange={onValueChange}
      defaultValue={`${selectedDate.year()}`}
    >
      <SelectTrigger className="min-w-[150px]">
        <SelectValue placeholder={`${selectedDate.year()}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Year</SelectLabel>
          {Array.from(
            { length: maxYear - minYear + 1 },
            (_, i) => minYear + i,
          ).map((year) => (
            <SelectItem key={year} value={`${year}`}>
              {year}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function MonthPicker() {
  const setSelectedDate = useAppStore((state) => state.setSelectedDate);
  const selectedDate = useAppStore((state) => state.selectedDate);

  const onValueChange = (value: string) => {
    setSelectedDate(selectedDate.month(months.indexOf(value)));
  };

  return (
    <Select
      onValueChange={onValueChange}
      defaultValue={`${selectedDate.format("MMMM")}`}
    >
      <SelectTrigger className="min-w-[150px]">
        <SelectValue placeholder={`${selectedDate.format("MMMM")}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Month</SelectLabel>
          {months.map((month) => (
            <SelectItem key={month} value={`${month}`}>
              {month}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

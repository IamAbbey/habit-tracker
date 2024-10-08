import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppStore } from "@/lib/store";
import { BannerDailyProgressChart } from "./daily-progress-chart";
import { MonthPicker, YearPicker } from "./date-picker";
import { BannerTotalProgressChart } from "./total-progress-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const BoardBanner = () => {
  const selectedDate = useAppStore((state) => state.selectedDate);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 md:gap-2 mt-5">
      <Card className="rounded-sm">
      <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader>
        <CardContent>
          <div className="min-w-60">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold font-['Kaushan_Script']">
                {selectedDate.format("MMMM-YYYY")}
              </h1>
              <p className="my-2">HABIT TRACKER</p>
            </div>
            <Table className="border">
              <TableHeader>
                <TableRow className="border">
                  <TableHead colSpan={2} className="text-center">
                    Overview
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium border-r-2">Year</TableCell>
                  <TableCell>
                    <YearPicker />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium border-r-2">
                    Month
                  </TableCell>
                  <TableCell>
                    <MonthPicker />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="col-span-3 my-3 md:my-0">
        <BannerDailyProgressChart />
      </div>
      <BannerTotalProgressChart />
    </div>
  );
};

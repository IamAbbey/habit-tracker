"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAppStore } from "@/lib/store";

export const description = "A linear area chart";

export function BannerDailyProgressChart() {
  const tasks = useAppStore((state) => state.tasks);

  const selectedDate = useAppStore((state) => state.selectedDate);

  const chartData = Array(selectedDate.daysInMonth())
    .fill(0)
    .map((_, index) => {
      return {
        taskDate: selectedDate.date(index + 1).format("DD/MM/YYYY"),
        taskDone: 0,
      };
    });

  for (const task of tasks) {
    // number of days in a month will always be less than or equal to taskState count (31)
    for (let index = 0; index < selectedDate.daysInMonth(); index++) {
      const taskState = task.taskState[index];
      if (taskState) {
        chartData[index].taskDone += 1;
      }
    }
  }

  const chartConfig = {
    taskDone: {
      label: "Task Done",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="rounded-sm">
      <CardHeader>
        <CardTitle>Area Chart - Daily Progress</CardTitle>
        <CardDescription>
          Showing daily progress for the selected month of{" "}
          {selectedDate.format("MMMM")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-auto h-[200px] w-75">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[200px] w-50"
          >
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <YAxis
                domain={tasks.length == 0 ? undefined : [0, tasks.length]}
                hide
              />
              <XAxis
                dataKey="taskDate"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 2)} // only show the day - DD
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="taskDone"
                type="linear"
                fill="var(--color-taskDone)"
                fillOpacity={0.4}
                stroke="var(--color-taskDone)"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

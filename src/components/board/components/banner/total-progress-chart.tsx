import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useAppStore } from "@/lib/store";

export const description = "A radar chart with dots";

const chartConfig = {
  totalActual: {
    label: "Completed Goals",
    color: "hsl(var(--chart-2))",
  }
} satisfies ChartConfig;

export function BannerTotalProgressChart() {
  const tasks = useAppStore((state) => state.tasks);

  let totalActual = 0;
  let totalGoal = 0;
  for (let index = 0; index < tasks.length; index++) {
    const task = tasks[index];
    const actual = task.taskState
      ? task.taskState.filter((value: unknown) => value).length
      : 0;

    totalActual += actual;
    totalGoal += task.goal;
  }

  const chartData = [{ totalActual: totalActual, fill: "var(--color-totalActual)" }];

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Radar Chart - Dots</CardTitle>
        <CardDescription>Last 6 months January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="aspect-auto h-[200px]">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-[200px]"
          >
            <RadialBarChart
              data={chartData}
              startAngle={0}
              endAngle={(totalActual / totalGoal) * 360}
              innerRadius={80}
              outerRadius={110}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[86, 74]}
              />
              <RadialBar dataKey="totalActual" background cornerRadius={10} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-4xl font-bold"
                          >
                            {chartData[0].totalActual.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Completed
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

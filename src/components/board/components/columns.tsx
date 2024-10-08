"use client";

import { Checkbox } from "@/components/ui/checkbox";

import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { priorities } from "../data";
import { Task } from "../schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

dayjs.extend(isToday);
dayjs.extend(weekOfYear);

export const buildColumnDef = (currentDate: dayjs.Dayjs): ColumnDef<Task>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="min-w-32"
        column={column}
        title="Tasks"
      />
    ),
    cell: ({ row }) => <div className="w-full">{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    // accessorKey: "priority",
    id: "priority",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    accessorFn: (originalRow: any) => {
      return originalRow.priority.value;
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue("priority")
      );

      if (!priority) {
        return null;
      }

      return (
        <div className="flex items-center">
          {priority.icon && (
            <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          {/* <span>{priority.label}</span> */}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  ...Array(currentDate.daysInMonth())
    .fill("")
    .map((_, index) => {
      const date = currentDate.date(index + 1);
      return {
        id: `checkbox-date-${index}`,
        meta: {
          date: date,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        header: ({ column }: any) => (
          <DataTableColumnHeader
            className={cn("text-center text-xs text-white")}
            column={column}
            title={date.format("ddd") + "\n" + date.format("D")}
          />
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cell: ({ row }: any) => (
          <div className="flex justify-center">
            <Checkbox
              onCheckedChange={(value) => {
                useAppStore.getState().markTask({
                  id: row.original.id,
                  state: !!value,
                  date: date,
                });
              }}
              aria-label="Select row"
              disabled={index > currentDate.date() - 1}
              className={cn("translate-y-[1px] data-[state=checked]:bg-[var(--primary)]" )}
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      };
    }),
  {
    accessorKey: "goal",
    header: ({ column }) => (
      <div className="-rotate-90 text-center uppercase text-xs">
        <DataTableColumnHeader column={column} title="Goal" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("goal")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: `actual`,
    header: ({ column }) => (
      <div className="-rotate-90 text-center my-5 uppercase text-xs">
        <DataTableColumnHeader column={column} title="Actual" />
      </div>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cell: ({ row }: any) => (
      <div className="text-center">
        {row.original.taskState
          ? row.original.taskState.filter((value: unknown) => value).length
          : 0}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: `total`,
    header: ({ column, table }) => {
      let totalActual = 0;
      let totalGoal = 0;
      for (let index = 0; index < table.getRowModel().rows.length; index++) {
        const row = table.getRowModel().rows[index];
        const actual = row.original.taskState
          ? row.original.taskState.filter((value: unknown) => value).length
          : 0;
        const goal = Number(row.getValue("goal"));

        totalActual += actual;
        totalGoal += goal;
      }

      return (
        <div className="text-center text-xs">
          <DataTableColumnHeader
            className="min-w-12"
            column={column}
            title={`${totalActual} / ${totalGoal}`}
          />
        </div>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cell: ({ row }: any) => {
      const actual = row.original.taskState
        ? row.original.taskState.filter((value: unknown) => value).length
        : 0;
      const goal = row.getValue("goal");
      return <Progress value={(Number(actual) / Number(goal)) * 100} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

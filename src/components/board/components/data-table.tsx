import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { getWeekOfMonth } from "../utils";
import { weekColors, weekTaskColors } from "../data";
import { cn } from "@/lib/utils";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup, index) => {
              let weekList: number[] = [];
              return (
                <React.Fragment key={`week-count-${index}`}>
                  <TableRow key={`week-count-${headerGroup.id}`}>
                    {headerGroup.headers.map((header) => {
                      const date = header.column.columnDef.meta?.date;
                      const isCheckBoxDate =
                        header.id.includes("checkbox-date");

                      if (header.id == "name") {
                        return (
                          <TableHead
                            key={`week-count-${header.id}`}
                            colSpan={header.colSpan}
                          >
                            DAILY HABITS
                          </TableHead>
                        );
                      } else if (header.id == "priority") {
                        return (
                          <TableHead
                            key={`task-priority-${header.id}`}
                            colSpan={header.colSpan}
                          ></TableHead>
                        );
                      } else if (isCheckBoxDate) {
                        let permit =
                          date.daysInMonth() - 29 == weekList.length &&
                          weekList[0] == 5;
                        permit =
                          date.daysInMonth() <= 29 && weekList[0] == 4
                            ? true
                            : permit;
                        // console.log(permit);

                        if (
                          (weekList.length != 0 &&
                            !weekList.includes(getWeekOfMonth(date))) ||
                          permit
                        ) {
                          // if (!(weekList.length == 1 && getWeekOfMonth(date) == weekList[weekList.length - 1] )) {
                          //   return
                          // }
                          // console.log(permit);
                          // console.log(date.daysInMonth() - 28);

                          const color = date
                            ? weekColors[weekList[0] - 1].toLowerCase()
                            : "";

                          if (permit && date.daysInMonth() <= 29) {
                            console.log(weekList);

                            if (weekList.length == 1) {
                              const tableHead = (
                                <TableHead
                                  key={`week-count-${header.id}`}
                                  colSpan={date.daysInMonth() - 21}
                                  style={{
                                    backgroundColor: color,
                                  }}
                                  className="text-center text-white"
                                >
                                  {`Week ${weekList[0]}`}
                                </TableHead>
                              );
                              weekList.push(getWeekOfMonth(date));
                              return tableHead;
                            }
                            weekList.push(getWeekOfMonth(date));
                            return;
                          }

                          const tableHead = (
                            <TableHead
                              key={`week-count-${header.id}`}
                              colSpan={
                                permit
                                  ? date.daysInMonth() - 28
                                  : weekList.length
                              }
                              style={{
                                backgroundColor: color,
                              }}
                              className="text-center text-white"
                            >
                              {`Week ${weekList[0]}`}
                            </TableHead>
                          );
                          weekList = [getWeekOfMonth(date)];
                          return tableHead;
                        } else {
                          weekList.push(getWeekOfMonth(date));
                        }
                      } else if (header.id == "actions") {
                        return (
                          <TableHead
                            key={`week-count-${header.id}`}
                            colSpan={data.length == 0 ? 3 : 4}
                            className="text-center"
                          >
                            {data.length == 0 ? "" : "TOTAL"}
                          </TableHead>
                        );
                      }
                      return null;
                    })}
                  </TableRow>
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const date = header.column.columnDef.meta?.date;

                      const color = date
                        ? weekColors[getWeekOfMonth(date) - 1].toLowerCase()
                        : "";

                      if (data.length == 0 && header.id == "actions") {
                        return (
                          <TableHead
                            key={`week-count-${header.id}`}
                            colSpan={header.colSpan}
                          >
                            &nbsp;
                          </TableHead>
                        );
                      }

                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          style={{
                            backgroundColor: color,
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    const date = cell.column.columnDef.meta?.date;

                    const color = date
                      ? weekTaskColors[getWeekOfMonth(date) - 1].toLowerCase()
                      : "";
                    const isCheckBoxDate = cell.id.includes("checkbox-date");

                    return (
                      <TableCell
                        key={cell.id}
                        style={{
                          "--primary": color,
                          background:
                            date && date.isToday()
                              ? weekColors[
                                  getWeekOfMonth(date) - 1
                                ].toLowerCase()
                              : "",
                        }}
                        className={cn(isCheckBoxDate ? "p-0" : "")}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { TASK_ACTION, useAppStore, useModalStore } from "@/lib/store";
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const setCurrentActionTask = useAppStore(
    (state) => state.setCurrentActionTask,
  );
  const tasks = useAppStore((state) => state.tasks);
  const found = tasks.findIndex((value) => row.original.id == value.id);
  const { toast } = useToast();
  const setOpenConfirmBox = useModalStore((state) => state.setOpenConfirmBox);

  const setAction = useCallback(
    (action: TASK_ACTION) => {
      if (found != -1) {
        const result = setCurrentActionTask({
          action: action,
          task: tasks[found],
        });
        if (action != TASK_ACTION.EDIT) {
          toast({
            title: "Result",
            variant: result.success ? "default" : "destructive",
            description: result.message,
          });
        }
      } else {
        toast({
          title: "Result",
          variant: "destructive",
          description: "Something went wrong",
        });
      }
    },
    [found, setCurrentActionTask, tasks, toast],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => setAction(TASK_ACTION.EDIT)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setAction(TASK_ACTION.MAKE_COPY)}>
          Make a copy
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setAction(TASK_ACTION.FAVORITE)}>
          Favorite
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-700 font-semibold"
          onClick={() => {
            setOpenConfirmBox({
              onConfirm: () => setAction(TASK_ACTION.DELETE),
              open: true,
              description: "This action is irreversible",
              onCancel: () => {},
            });
          }}
        >
          Delete
          <DropdownMenuShortcut className="text-red-700 font-medium">
            ⌘⌫
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { buildColumnDef } from "@/components/board/components/columns";
import { Task, TaskSchema } from "@/components/board/schema";
import { ColumnDef } from "@tanstack/react-table";
import dayjs, { Dayjs } from "dayjs";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import tasks from "@/components/board/tasks.json";
import { z } from "zod";
import { nanoid } from "nanoid";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UpsertTaskSchema = TaskSchema.omit({ taskState: true });
type IUpsertTask = z.infer<typeof UpsertTaskSchema>;

interface IMarkTask {
  id: string;
  state: boolean;
  date: dayjs.Dayjs;
}

export enum TASK_ACTION {
  EDIT = "EDIT",
  MAKE_COPY = "MAKE_COPY",
  FAVORITE = "FAVORITE",
  DELETE = "DELETE",
}

interface ICurrentTaskAction {
  task: Task;
  action: TASK_ACTION;
}

export interface IActionResult {
  success: boolean;
  message: string;
}

interface AppStoreState {
  tasks: Task[];
  currentActionTask: ICurrentTaskAction | null;
  selectedDate: Dayjs;
  setSelectedDate: (date: Dayjs) => void;
  setCurrentActionTask: (
    currentActionTask: ICurrentTaskAction,
  ) => IActionResult;
  columns: ColumnDef<Task>[];
  upsertTask: (task: IUpsertTask) => IActionResult;
  markTask: (markTask: IMarkTask) => void;
}

export const useAppStore = create<AppStoreState>()(
  immer((set) => ({
    // tasks: [],
    tasks: z.array(TaskSchema).parse(tasks),
    currentActionTask: null,
    selectedDate: dayjs(),
    setSelectedDate: (date: Dayjs) => {
      set({
        selectedDate: date,
        columns: buildColumnDef(date),
      });
    },
    setCurrentActionTask: (currentActionTask: ICurrentTaskAction) => {
      set({
        currentActionTask: currentActionTask,
      });
      if (currentActionTask.action == TASK_ACTION.DELETE) {
        set((state) => {
          const index = state.tasks.findIndex(
            (task) => task.id === currentActionTask.task.id,
          );
          if (index !== -1) state.tasks.splice(index, 1);
        });
        return {
          success: true,
          message: "Task deleted successfully",
        };
      } else if (currentActionTask.action == TASK_ACTION.MAKE_COPY) {
        set((state) => {
          const index = state.tasks.findIndex(
            (task) => task.id === currentActionTask.task.id,
          );
          if (index !== -1) {
            state.tasks.splice(index + 1, 0, {
              ...state.tasks[index],
              id: nanoid()
            });
          }
        });
        return {
          success: true,
          message: "Task duplicated successfully",
        };
      } else if (currentActionTask.action == TASK_ACTION.EDIT) {
        return {
          success: true,
          message: "",
        };
      }
      return {
        success: false,
        message: "Invalid Action",
      };
    },
    upsertTask: (task: IUpsertTask) => {
      let status: "ADD" | "EDIT" | null = null;
      set((state) => {
        const found = state.tasks.findIndex((value) => task.id == value.id);

        if (found != -1) {
          state.tasks[found].name = task.name;
          state.tasks[found].goal = task.goal;
          status = "EDIT";
        } else {
          state.tasks.splice(0, 0,
            TaskSchema.parse({
              ...task,
              taskState: Array(31).fill(false),
            }),
          );
          status = "ADD";
        }
      });
      if (status == "ADD") {
        return {
          success: true,
          message: "New task added successfully",
        };
      } else if (status == "EDIT") {
        return {
          success: true,
          message: "Task updated successfully",
        };
      }

      return {
        success: false,
        message: "Something went wrong, please try again",
      };
    },
    markTask: (markTask: IMarkTask) => {
      set((state) => {
        const found = state.tasks.findIndex((value) => markTask.id == value.id);

        if (found != -1) {
          state.tasks[found].taskState[markTask.date.date() - 1] =
            markTask.state;
        }
      });
    },
    columns: buildColumnDef(dayjs()),
  })),
);

interface IComfirmBox {
  title?: string;
  description?: string;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export type ModalState = {
  openConfirmBox: IComfirmBox | null;
  setOpenConfirmBox: (option: IComfirmBox | null) => void;
};

export const useModalStore = create<ModalState>()(
  immer((set) => ({
    openConfirmBox: null,
    setOpenConfirmBox: (option: IComfirmBox | null) => {
      set((state) => {
        state.openConfirmBox = option;
      });
    },
  })),
);

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { AddNewTaskForm } from "../task/new-task";
import { buttonVariants } from "../ui/button";
import { BoardBanner } from "./components/banner/banner";
import { DataTable } from "./components/data-table";

// Simulate a database read for tasks.
export async function getTasks() {
  return [];
}

export default function TaskHistoryPage() {
  // const tasks = await getTasks()
  // const { tasks } = useLoaderData() as { tasks: Task[] };
  const columns = useAppStore((state) => state.columns);
  const tasks = useAppStore((state) => state.tasks);
  const selectedDate = useAppStore((state) => state.selectedDate);

  const [openGraph, setOpenGraph] = useState(false);

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 md:flex">
        <div className="flex items-center justify-center space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-center">
              Welcome back!
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Collapsible
            open={openGraph}
            onOpenChange={setOpenGraph}
            className="mb-4"
          >
            <div className="flex justify-end">
              <CollapsibleTrigger>
                <div className={cn(buttonVariants({variant: "outline"}))}>
                {openGraph ? <EyeOffIcon className="h-[1.2rem] w-[1.2rem] mr-1" /> : <EyeIcon className="h-[1.2rem] w-[1.2rem] mr-1" />}
                  
                  <p>{openGraph ? 'Hide' : 'Show'} Graphs</p>
                  <span className="sr-only">{openGraph ? 'Hide' : 'Show'} Graphs</span>
                </div>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <BoardBanner />
            </CollapsibleContent>
          </Collapsible>
          <AddNewTaskForm />
          {!openGraph && (
            <h1 className="mx-auto my-4 text-3xl font-bold font-['Kaushan_Script']">
              {selectedDate.format("MMMM-YYYY")}
            </h1>
          )}
          <DataTable data={tasks} columns={columns} />
        </div>
      </div>
    </>
  );
}

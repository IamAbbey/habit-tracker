import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TASK_ACTION, useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { priorities } from "../board/data";
import { Priority } from "../board/schema";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Task name must be at least 2 characters.",
  }),
});

export function AddNewTaskForm() {
  const upsertTask = useAppStore((state) => state.upsertTask);
  const selectedDate = useAppStore((state) => state.selectedDate);
  const currentActionTask = useAppStore((state) => state.currentActionTask);

  const DEFAULT_GOAL = 0;
  // const DEFAULT_GOAL = selectedDate.daysInMonth() - 5;
  // const DEFAULT_PRIORITY = priorities.find(
  //   (priority) => priority.value === "high"
  // )!;

  const { toast } = useToast();
  const [goal, setGoal] = useState(DEFAULT_GOAL);

  const [selectedPriority, setSelectedPriority] =
    useState<Priority | null>(null);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (
      currentActionTask != null &&
      currentActionTask.action == TASK_ACTION.EDIT
    ) {
      form.setValue("name", currentActionTask.task.name);
      setGoal(currentActionTask.task.goal);
      setSelectedPriority(currentActionTask.task.priority);
    }
  }, [currentActionTask, form]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    if (!selectedPriority) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "You need to set a priority",
      });
      return
    }
    if (goal == 0) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "You need to set a goal greater than 0",
      });
      return
    }


    const result = upsertTask({
      id:
        currentActionTask != null &&
        currentActionTask.action == TASK_ACTION.EDIT
          ? currentActionTask.task.id
          : nanoid(),
      name: values.name,
      goal: goal,
      priority: selectedPriority,
    });
    toast({
      title: "Result",
      variant: result.success ? "default" : "destructive",
      description: result.message,
    });
    if (result.success) {
      form.reset();
      setGoal(DEFAULT_GOAL);
      setSelectedPriority(null);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-4 items-stretch justify-center"
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="name"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    <p>New Task</p>
                    <p>Goal: {goal} days</p>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="md:min-w-96"
                      placeholder="Add new task"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Slider
            value={[goal]}
            onValueChange={(value) => setGoal(value[0])}
            max={selectedDate.daysInMonth()}
            step={1}
          />
        </div>
        <div
          style={{
            marginTop: "1.40rem",
          }}
        >
          <PrioritySelectPopover
            selectedPriority={selectedPriority}
            setSelectedPriority={setSelectedPriority}
          />
        </div>
        <div
          style={{
            marginTop: "1.40rem",
          }}
        >
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}

interface IPrioritySelectPopover {
  selectedPriority: Priority | null;
  setSelectedPriority: React.Dispatch<React.SetStateAction<Priority | null>>;
}

export function PrioritySelectPopover(props: IPrioritySelectPopover) {
  const [open, setOpen] = useState(false);
  const { selectedPriority, setSelectedPriority } = props;

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="px-2 w-[100px] justify-start">
            {selectedPriority ? (
              <>{selectedPriority.label}</>
            ) : (
              <>+ Set priority</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="Change status..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {priorities.map((priority) => (
                  <CommandItem
                    key={priority.value}
                    value={priority.value}
                    onSelect={(value) => {
                      setSelectedPriority(
                        priorities.find((priority) => priority.value === value)!
                      );
                      setOpen(false);
                    }}
                  >
                    {priority.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router-dom";
import { AlertConfirmDialog } from "./components/confirm-box";
import { Icons } from "./components/icons";
import { Toaster } from "./components/ui/toaster";
import { ThemeModeToggle } from "./theming/mode-toggle";
import { ThemeProvider } from "./theming/theme-provider";
function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen pt-6 lg:px-12 px-3 py-4">
        <main className="w-full mx-auto max-w-screen-2xl">
          <nav className="w-full flex flex-row gap-2 justify-end">
            <a
              href={"https://github.com/IamAbbey/github-star-history"}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: "outline",
                  }),
                  "w-[40px] px-0",
                )}
              >
                <Icons.gitHub className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </div>
            </a>
            <ThemeModeToggle />
          </nav>
          <Outlet />
        </main>
      </div>
      <Toaster />
      <AlertConfirmDialog />
    </ThemeProvider>
  );
}

export default App;

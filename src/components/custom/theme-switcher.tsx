"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

const ThemeSwitcher = () => {
  const { setTheme } = useTheme();

  const ICON_SIZE = 16;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"icon"}>
          <Sun
            size={ICON_SIZE}
            className={"scale-100 transition-all dark:scale-0 text-muted-foreground"}
          />
          <Moon
            size={ICON_SIZE}
            className={"absolute scale-0 transition-all dark:scale-100 text-muted-foreground"}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-content" align="start">
        <DropdownMenuItem className="flex gap-2" onClick={() => setTheme("dark")}>
          <Moon size={ICON_SIZE} className="text-muted-foreground" />{" "}
          <span>Dark (recommended)</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex gap-2" onClick={() => setTheme("light")}>
          <Sun size={ICON_SIZE} className="text-muted-foreground" />{" "}
          <span>Light</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };

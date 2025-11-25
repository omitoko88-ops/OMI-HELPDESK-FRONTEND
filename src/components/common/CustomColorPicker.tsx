"use client";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ColorPickerProps {
  typeComponent?: "dialog" | "dropdown";
  value?: string;
  onChange?: (color: string) => void;
}

export default function ColorPicker({
  typeComponent = "dialog",
  value = "#00767a",
  onChange,
}: ColorPickerProps) {
  const [color, setColor] = useState<string>(value);

  const handleChange = (newColor: string) => {
    setColor(newColor);
    onChange?.(newColor);
  };

  const Picker = (
    <div className="flex flex-col items-center space-y-2 p-2">
      <HexColorPicker color={color} onChange={handleChange} />
      <div
        className="w-10 h-10 rounded border shadow"
        style={{ backgroundColor: color }}
      />
      {/* <span className="text-sm">{color}</span> */}
    </div>
  );

  if (typeComponent === "dialog") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            Pilih Warna
            <div
              className="ml-2 w-4 h-4 rounded border"
              style={{ backgroundColor: color }}
            />
          </Button>
        </DialogTrigger>
        <DialogContent className="flex justify-center bg-black/40">
          {Picker}
        </DialogContent>
      </Dialog>
    );
  }

  if (typeComponent === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={"sm"} className="bg-transparent">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: color }}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2">{Picker}</DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return null;
}

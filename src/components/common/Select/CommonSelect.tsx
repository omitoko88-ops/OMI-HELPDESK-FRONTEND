import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { CommonSelectProps } from "@/interfaces/CommonSelectProps";
import { cn } from "@/lib/utils";
import { FieldValues } from "react-hook-form";

export default function CommonSelect<
  T extends FieldValues,
  K extends keyof any = "id",
  L extends keyof any = "name"
>({
  side,
  headerLabel,
  identifier,
  collection,
  value,
  setValue,
  error,
  placeholder = "Select",
  disabled = false,
  valueKey = "id" as K,
  labelKey = "name" as L,
  cnSelect,
  useLabelAsValue = false, // NEW OPTION
}: CommonSelectProps<T, K, L>) {
  const displayValue = useLabelAsValue
    ? value
    : collection.find((item) => String(item[valueKey]) === String(value))?.[
        labelKey
      ] ?? "";

  return (
    <div className="flex flex-col space-y-1.5 pb-2">
      {headerLabel && <Label htmlFor={String(identifier)}>{headerLabel}</Label>}
      <Select
        value={String(displayValue)}
        disabled={disabled}
        onValueChange={(selectedLabel) => {
          if (useLabelAsValue) {
            // Simpan langsung label (name) ke form/state
            if (setValue.length === 2) {
              setValue(identifier, selectedLabel);
            } else {
              setValue(selectedLabel);
            }
          } else {
            // Simpan id berdasarkan label
            const selectedItem = collection.find(
              (item) => String(item[labelKey]) === String(selectedLabel)
            );
            const selectedId = selectedItem?.[valueKey];
            if (selectedId !== undefined) {
              if (setValue.length === 2) {
                setValue(identifier, String(selectedId));
              } else {
                setValue(String(selectedId));
              }
            }
          }
        }}
      >
        <SelectTrigger className={cnSelect} id={String(identifier)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          position="popper"
          avoidCollisions={false}
          side={side ?? "bottom"}
        >
          {collection.map((item, idx) => (
            <SelectItem
              key={item[valueKey] ?? idx}
              value={String(item[labelKey])}
            >
              {item[labelKey]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <span className="text-sm text-red-500">{error.message}</span>}
    </div>
  );
}

interface CommonSelectSkeletonProps {
  headerStyle?: string;
  headerContent?: string;
  header?: boolean;
}

export function CommonSelectSkeleton({
  headerStyle,
  headerContent,
  header = false,
}: CommonSelectSkeletonProps) {
  return (
    <div className="space-y-1.5">
      {header && <Skeleton className={cn("h-4 w-[150px]", headerStyle)} />}
      <Skeleton className={cn("h-8 w-22 rounded-lg", headerContent)} />
    </div>
  );
}

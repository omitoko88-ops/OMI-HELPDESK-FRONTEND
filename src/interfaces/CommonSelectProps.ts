import { FieldError, FieldValues, Path } from "react-hook-form";

export interface CommonSelectProps<
  T extends FieldValues,
  K extends keyof any = "id",
  L extends keyof any = "name"
> {
  side?: "top" | "bottom" | "left" | "right";
  headerLabel?: string;
  identifier: Path<T>;
  collection: Array<Record<K, string | number> & Record<L, string>>;
  value: string | number;
  useLabelAsValue?: boolean; // Optional, default false
  setValue: (value: any, name?: string) => void;
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
  valueKey?: K; // default "id"
  labelKey?: L; // default "name"
  cnSelect?: string;
}

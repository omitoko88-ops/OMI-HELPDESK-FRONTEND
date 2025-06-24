import {
  FieldError,
  FieldValues,
  Path,
  UseFormSetValue,
} from "react-hook-form";

export interface CommonSelectProps<
  T extends FieldValues,
  K extends keyof any = "id",
  L extends keyof any = "name"
> {
  headerLabel?: string;
  identifier: Path<T>;
  collection: Array<Record<K, string | number> & Record<L, string>>;
  value: string;
  // setValue: UseFormSetValue<T>;
  setValue: (value: any, name?: string) => void;
  error?: FieldError;
  placeholder?: string;
  disabled?: boolean;
  valueKey?: K; // default "id"
  labelKey?: L; // default "name"
  cnSelect?: string; 
}

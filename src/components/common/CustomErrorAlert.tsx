// src/components/common/ErrorAlert.tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ApiError } from "@/lib/ApiError";
import { Dialog, DialogContent } from "../ui/dialog";

interface ErrorAlertProps {
  error: ApiError;
}

export const ErrorAlert = ({ error }: ErrorAlertProps) => {
  return (
    <Dialog>
      <DialogContent>
        <Alert variant="destructive">
          <AlertTitle>Error {error.code}</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
          {error.fields && (
            <ul className="mt-2 space-y-1 text-sm text-destructive">
              {Object.entries(error.fields).map(([field, messages]) => (
                <li key={field} className="whitespace-nowrap">
                  <strong>{field}</strong>: {messages[0]}
                </li>
              ))}
            </ul>
          )}
        </Alert>
      </DialogContent>
    </Dialog>
  );
};

// src/components/common/ErrorAlert.tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ApiError } from "@/lib/ApiError";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

interface ErrorAlertProps {
  error: ApiError;
}

export const ErrorAlert = ({ error }: ErrorAlertProps) => {
  return (
    <Dialog>
      <DialogContent>
          <DialogTitle>Request error</DialogTitle>
        <Alert variant="destructive">
          <AlertTitle>Error {error.status}</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
          {error.errors && (
            <ul className="mt-2 space-y-1 text-sm text-destructive">
              {Object.entries(error.errors).map(([field, messages]) => (
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

export interface IGlobalDialogProps {
  title?: "Success" | "Error" | "Alert" | any;
  message?: string;
  button?: string;
  shouldOffsetDrawerWidth?: boolean;
}

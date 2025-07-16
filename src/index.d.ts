import { ChipProps } from "@mui/material/Chip";
import { DialogProps } from "@mui/material/Dialog";
import { GridProps } from "@mui/material/Grid";
import { SnackbarProps } from "@mui/material/Snackbar";
import * as React from "react";
import {
  DropEvent,
  DropzoneProps,
  FileRejection,
  Accept,
} from "react-dropzone";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface FileObject {
  readonly file: File;
  readonly data: string | ArrayBuffer | null;
}

export interface PreviewIconProps {
  readonly classes: string;
}

export type AlertType = "error" | "success" | "info";

// DropzoneAreaBase

export type DropzoneAreaBaseProps = {
  acceptedFiles?: Accept;
  fileObjects: FileObject[];
  filesLimit?: number;
  Icon?: React.ComponentType;
  maxFileSize?: number;
  dropzoneText?: string;
  previewText?: string;
  showPreviews?: boolean;
  showPreviewsInDropzone?: boolean;
  showFileNamesInPreview?: boolean;
  showFileNames?: boolean;
  useChipsForPreview?: boolean;
  previewChipProps?: ChipProps;
  previewGridProps?: {
    container?: GridProps;
    item?: GridProps;
  };
  showAlerts?: boolean | AlertType[];
  alertSnackbarProps?: SnackbarProps;
  dropzoneProps?: DropzoneProps;
  inputProps?: React.HTMLProps<HTMLInputElement>;
  clearOnUnmount?: boolean;
  dropzoneClass?: string;
  dropzoneParagraphClass?: string;
  disableRejectionFeedback?: boolean;
  onAdd?: (newFiles: FileObject[]) => void;
  onDelete?: (deletedFileObject: FileObject, index: number) => void;
  onDrop?: (files: File[], event: DropEvent) => void;
  onDropRejected?: (files: FileRejection[], event: DropEvent) => void;
  onAlert?: (message: string, variant: AlertType) => void;
  getFileLimitExceedMessage?: (filesLimit: number) => string;
  getFileAddedMessage?: (fileName: string) => string;
  getFileRemovedMessage?: (fileName: string) => string;
  getDropRejectMessage?: (
    fileRejection: FileRejection,
    maxFileSize: number,
  ) => string;
  getPreviewIcon?: (
    file: FileObject,
    classes: PreviewIconProps,
  ) => React.ReactElement;
};

export const DropzoneAreaBase: React.ComponentType<DropzoneAreaBaseProps>;

// DropzoneArea

export type DropzoneAreaProps = Omit<
  DropzoneAreaBaseProps,
  "fileObjects" | "onAdd" | "onDelete"
> & {
  clearOnUnmount?: boolean;
  initialFiles?: (File | string)[];
  onChange?: (files: File[]) => void;
  onDelete?: (file: File) => void;
};

export const DropzoneArea: React.ComponentType<DropzoneAreaProps>;

// DropzoneDialogBase

export type DropzoneDialogBaseProps = DropzoneAreaBaseProps & {
  cancelButtonText?: string;
  dialogProps?: DialogProps;
  dialogTitle?: string | JSX.Element;
  fullWidth?: boolean;
  maxWidth?: string;
  onClose?: (event: React.SyntheticEvent) => void;
  onSave?: (event: React.SyntheticEvent) => void;
  open?: boolean;
  submitButtonText?: string;
};

export const DropzoneDialogBase: React.ComponentType<DropzoneDialogBaseProps>;

// DropzoneDialog

export type DropzoneDialogProps = Omit<
  DropzoneDialogBaseProps,
  "fileObjects" | "onAdd" | "onDelete" | "onSave"
> & {
  clearOnUnmount?: boolean;
  initialFiles?: (File | string)[];
  onSave?: (files: File[], event: React.SyntheticEvent) => void;
  onDelete?: (file: File) => void;
};

export const DropzoneDialog: React.ComponentType<DropzoneDialogProps>;

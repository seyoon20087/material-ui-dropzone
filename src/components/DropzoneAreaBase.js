import Snackbar from "@mui/material/Snackbar";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import clsx from "clsx";
import PropTypes from "prop-types";
import * as React from "react";
import { Fragment } from "react";
import Dropzone from "react-dropzone";
import { convertBytesToMbsOrKbs, isImage, readFile } from "../helpers";
import PreviewList from "./PreviewList";
import SnackbarContentWrapper from "./SnackbarContentWrapper";

import { keyframes } from "@mui/styled-engine";
import deepmerge from "@mui/utils/deepmerge";

const PREFIX = "MuiDropzoneArea";

const classes = {
  root: `${PREFIX}-root`,
  active: `${PREFIX}-active`,
  invalid: `${PREFIX}-invalid`,
  textContainer: `${PREFIX}-textContainer`,
  text: `${PREFIX}-text`,
  icon: `${PREFIX}-icon`,
  resetButton: `${PREFIX}-resetButton`,
};

const progress = keyframes({
  "0%": {
    backgroundPosition: "0 0",
  },
  "100%": {
    backgroundPosition: "-70px 0",
  },
});

const StyledDropzoneRoot = styled("div")(
  ({ theme: { palette, shape, spacing, components } }) => ({
    [`&.${classes.root}`]: deepmerge(
      {
        position: "relative",
        width: "100%",
        minHeight: "250px",
        backgroundColor: palette.background.paper,
        border: "dashed",
        borderColor: palette.divider,
        borderRadius: shape.borderRadius,
        boxSizing: "border-box",
        cursor: "pointer",
        overflow: "hidden",
      },
      components[PREFIX]?.styleOverrides?.root,
    ),

    [`&.${classes.active}`]: deepmerge(
      {
        animation: `${progress} 2s linear infinite !important`,
        // eslint-disable-next-line max-len
        backgroundImage: `repeating-linear-gradient(-45deg, ${palette.background.paper}, ${palette.background.paper} 25px, ${palette.divider} 25px, ${palette.divider} 50px)`,
        backgroundSize: "150% 100%",
        border: "solid",
        borderColor: palette.primary.light,
      },
      components[PREFIX]?.styleOverrides?.active,
    ),

    [`&.${classes.invalid}`]: deepmerge(
      {
        // eslint-disable-next-line max-len
        backgroundImage: `repeating-linear-gradient(-45deg, ${palette.error.light}, ${palette.error.light} 25px, ${palette.error.dark} 25px, ${palette.error.dark} 50px)`,
        borderColor: palette.error.main,
      },
      components[PREFIX]?.styleOverrides?.invalid,
    ),

    [`& .${classes.textContainer}`]: deepmerge(
      {
        textAlign: "center",
      },
      components[PREFIX]?.styleOverrides?.textContainer,
    ),

    [`& .${classes.text}`]: deepmerge(
      {
        marginBottom: spacing(3),
        marginTop: spacing(3),
      },
      components[PREFIX]?.styleOverrides?.text,
    ),

    [`& .${classes.icon}`]: deepmerge(
      {
        width: 51,
        height: 51,
        color: palette.text.primary,
      },
      components[PREFIX]?.styleOverrides?.icon,
    ),
  }),
);

const StyledResetButton = styled(Button)(({ theme }) => ({
  [`&.${classes.resetButton}`]: deepmerge(
    {
      display: "block",
      margin: "10px 0",
    },
    theme.components[PREFIX]?.styleOverrides?.resetButton,
  ),
}));

const defaultSnackbarAnchorOrigin = {
  horizontal: "left",
  vertical: "bottom",
};

const defaultGetPreviewIcon = (fileObject, classes) => {
  if (isImage(fileObject.file)) {
    return (
      <img
        className={classes.image}
        role="presentation"
        src={fileObject.data}
      />
    );
  }

  return <AttachFileIcon className={classes.image} />;
};

/**
 * This components creates a Material-UI Dropzone, with previews and snackbar notifications.
 */
class DropzoneAreaBase extends React.PureComponent {
  state = {
    openSnackBar: false,
    snackbarMessage: "",
    snackbarVariant: "success",
  };

  notifyAlert() {
    const { onAlert } = this.props;
    const { openSnackBar, snackbarMessage, snackbarVariant } = this.state;
    if (openSnackBar && onAlert) {
      onAlert(snackbarMessage, snackbarVariant);
    }
  }

  handleDropAccepted = async (acceptedFiles, evt) => {
    const {
      fileObjects,
      filesLimit,
      getFileAddedMessage,
      getFileLimitExceedMessage,
      onAdd,
      onDrop,
    } = this.props;

    if (
      filesLimit > 1 &&
      fileObjects.length + acceptedFiles.length > filesLimit
    ) {
      this.setState(
        {
          openSnackBar: true,
          snackbarMessage: getFileLimitExceedMessage(filesLimit),
          snackbarVariant: "error",
        },
        this.notifyAlert,
      );
      return;
    }

    // Notify Drop event
    if (onDrop) {
      onDrop(acceptedFiles, evt);
    }

    // Retrieve fileObjects data
    const fileObjs = await Promise.all(
      acceptedFiles.map(async (file) => {
        const data = await readFile(file);
        return {
          file,
          data,
        };
      }),
    );

    // Notify added files
    if (onAdd) {
      onAdd(fileObjs);
    }

    // Display message
    const message = fileObjs.reduce(
      (msg, fileObj) => msg + getFileAddedMessage(fileObj.file.name),
      "",
    );
    this.setState(
      {
        openSnackBar: true,
        snackbarMessage: message,
        snackbarVariant: "success",
      },
      this.notifyAlert,
    );
  };

  dropzoneRootRef = React.createRef();

  handleDropRejected = (fileRejections, evt) => {
    const {
      filesLimit,
      fileObjects,
      getDropRejectMessage,
      getFileLimitExceedMessage,
      maxFileSize,
      onDropRejected,
    } = this.props;

    let message = "";
    if (fileObjects.length + fileRejections.length > filesLimit) {
      message = getFileLimitExceedMessage(filesLimit);
    } else {
      fileRejections.forEach((fileRejection) => {
        message = getDropRejectMessage(fileRejection, maxFileSize);
      });
    }

    if (onDropRejected) {
      onDropRejected(rejectedFiles, evt);
    }

    this.setState(
      {
        openSnackBar: true,
        snackbarMessage: message,
        snackbarVariant: "error",
      },
      this.notifyAlert,
    );

    this.dropzoneRootRef.current.dispatchEvent(
      new Event("dragleave", { bubbles: true }),
    );
  };

  handleRemove = (fileIndex) => (event) => {
    event.stopPropagation();

    const { fileObjects, getFileRemovedMessage, onDelete } = this.props;

    // Find removed fileObject
    const removedFileObj = fileObjects[fileIndex];

    // Notify removed file
    if (onDelete) {
      onDelete(removedFileObj, fileIndex);
    }

    this.setState(
      {
        openSnackBar: true,
        snackbarMessage: getFileRemovedMessage(removedFileObj.file.name),
        snackbarVariant: "info",
      },
      this.notifyAlert,
    );
  };

  handleCloseSnackbar = () => {
    this.setState({
      openSnackBar: false,
    });
  };

  render() {
    const {
      acceptedFiles,
      alertSnackbarProps,
      //classes,
      disableRejectionFeedback,
      dropzoneClass,
      dropzoneParagraphClass,
      dropzoneProps,
      dropzoneText,
      fileObjects,
      filesLimit,
      getPreviewIcon,
      Icon,
      inputProps,
      maxFileSize,
      previewChipProps,
      previewGridProps,
      previewText,
      showAlerts,
      showFileNames,
      showFileNamesInPreview,
      showPreviews,
      showPreviewsInDropzone,
      useChipsForPreview,
      reset,
    } = this.props;
    const { openSnackBar, snackbarMessage, snackbarVariant } = this.state;

    //const acceptFiles = acceptedFiles?.join();
    const isMultiple = filesLimit > 1;
    const previewsVisible = showPreviews && fileObjects.length > 0;
    const previewsInDropzoneVisible =
      showPreviewsInDropzone && fileObjects.length > 0;

    return (
      <Fragment>
        <Dropzone
          {...dropzoneProps}
          accept={acceptedFiles}
          onDropAccepted={this.handleDropAccepted}
          onDropRejected={this.handleDropRejected}
          maxSize={maxFileSize}
          multiple={isMultiple}
        >
          {({
            getRootProps,
            getInputProps,
            isDragActive,
            isDragReject,
            rootRef,
          }) => (
            <StyledDropzoneRoot
              {...getRootProps({
                className: clsx(
                  classes.root,
                  dropzoneClass,
                  isDragActive && classes.active,
                  !disableRejectionFeedback && isDragReject && classes.invalid,
                ),
              })}
              ref={function () {
                this.dropzoneRootRef = rootRef;
                return rootRef;
              }.apply(this)}
            >
              <input {...getInputProps(inputProps)} />

              <div className={classes.textContainer}>
                <Typography
                  variant="h5"
                  component="p"
                  className={clsx(classes.text, dropzoneParagraphClass)}
                >
                  {dropzoneText}
                </Typography>
                {Icon ? (
                  <Icon className={classes.icon} />
                ) : (
                  <CloudUploadIcon className={classes.icon} />
                )}
              </div>

              {previewsInDropzoneVisible && (
                <PreviewList
                  fileObjects={fileObjects}
                  handleRemove={this.handleRemove}
                  getPreviewIcon={getPreviewIcon}
                  showFileNames={showFileNames}
                  useChipsForPreview={useChipsForPreview}
                  previewChipProps={previewChipProps}
                  previewGridProps={previewGridProps}
                />
              )}
            </StyledDropzoneRoot>
          )}
        </Dropzone>

        {reset &&
          (React.isValidElement(reset) ? (
            reset
          ) : (
            <StyledResetButton
              onClick={reset.onClick}
              variant="outlined"
              className={classes.resetButton}
            >
              {reset.text || "reset"}
            </StyledResetButton>
          ))}

        {previewsVisible && (
          <Fragment>
            <Typography variant="subtitle1" component="span">
              {previewText}
            </Typography>

            <PreviewList
              fileObjects={fileObjects}
              handleRemove={this.handleRemove}
              getPreviewIcon={getPreviewIcon}
              showFileNames={showFileNamesInPreview}
              useChipsForPreview={useChipsForPreview}
              previewChipProps={previewChipProps}
              previewGridProps={previewGridProps}
            />
          </Fragment>
        )}

        {((typeof showAlerts === "boolean" && showAlerts) ||
          (Array.isArray(showAlerts) &&
            showAlerts.includes(snackbarVariant))) && (
          <Snackbar
            anchorOrigin={defaultSnackbarAnchorOrigin}
            autoHideDuration={6000}
            {...alertSnackbarProps}
            open={openSnackBar}
            onClose={this.handleCloseSnackbar}
          >
            <SnackbarContentWrapper
              onClose={this.handleCloseSnackbar}
              variant={snackbarVariant}
              message={snackbarMessage}
            />
          </Snackbar>
        )}
      </Fragment>
    );
  }
}

DropzoneAreaBase.defaultProps = {
  acceptedFiles: [],
  filesLimit: 3,
  fileObjects: [],
  maxFileSize: 3000000,
  dropzoneText: "Drag and drop a file here or click",
  previewText: "Preview:",
  disableRejectionFeedback: false,
  showPreviews: false, // By default previews show up under in the dialog and inside in the standalone
  showPreviewsInDropzone: true,
  showFileNames: false,
  showFileNamesInPreview: false,
  useChipsForPreview: false,
  previewChipProps: {},
  previewGridProps: {},
  reset: undefined,
  showAlerts: true,
  alertSnackbarProps: {
    anchorOrigin: {
      horizontal: "left",
      vertical: "bottom",
    },
    autoHideDuration: 6000,
  },
  getFileLimitExceedMessage: (filesLimit) =>
    `Maximum allowed number of files exceeded. Only ${filesLimit} allowed`,
  getFileAddedMessage: (fileName) => `File ${fileName} successfully added.`,
  getPreviewIcon: defaultGetPreviewIcon,
  getFileRemovedMessage: (fileName) => `File ${fileName} removed.`,
  getDropRejectMessage: (fileRejection, maxFileSize) => {
    let message = `File ${fileRejection.file.name} was rejected. `;
    fileRejection.errors.forEach(({ code }) => {
      switch (code) {
        case "file-invalid-type":
          message += "File type not supported. ";
          break;
        case "file-too-large":
          message +=
            "File is too big. Size limit is " +
            convertBytesToMbsOrKbs(maxFileSize) +
            ". ";
          break;
      }
    });
    return message;
  },
};

export const FileObjectShape = PropTypes.shape({
  file: PropTypes.object,
  data: PropTypes.any,
});

DropzoneAreaBase.propTypes = {
  /** A list of file types to accept.
   * @see See [here](https://react-dropzone.js.org/#section-accepting-specific-file-types) for more details.
   */
  acceptedFiles: PropTypes.object,
  /** Maximum number of files that can be loaded into the dropzone. */
  filesLimit: PropTypes.number,
  /** Icon to be displayed inside the dropzone area. */
  Icon: PropTypes.elementType,
  /** Currently loaded files. */
  fileObjects: PropTypes.arrayOf(FileObjectShape),
  /** Maximum file size (in bytes) that the dropzone will accept. */
  maxFileSize: PropTypes.number,
  /** Text inside the dropzone. */
  dropzoneText: PropTypes.string,
  /** Custom CSS class name for dropzone container. */
  dropzoneClass: PropTypes.string,
  /** Custom CSS class name for text inside the container. */
  dropzoneParagraphClass: PropTypes.string,
  /** Disable feedback effect when dropping rejected files. */
  disableRejectionFeedback: PropTypes.bool,
  /** Shows previews **BELOW** the dropzone. */
  showPreviews: PropTypes.bool,
  /** Shows preview **INSIDE** the dropzone area. */
  showPreviewsInDropzone: PropTypes.bool,
  /** Shows file name under the dropzone image. */
  showFileNames: PropTypes.bool,
  /** Shows file name under the image. */
  showFileNamesInPreview: PropTypes.bool,
  /** Uses deletable Material-UI Chip components to display file names. */
  useChipsForPreview: PropTypes.bool,
  /**
   * Props to pass to the Material-UI Chip components.<br/>Requires `useChipsForPreview` prop to be `true`.
   *
   * @see See [Material-UI Chip](https://mui.com/material-ui/api/chip/#props) for available values.
   */
  previewChipProps: PropTypes.object,
  /**
   * Props to pass to the Material-UI Grid components.<br/>
   * Should be in the form {container: GridProps, item: GridProps}.
   *
   * @see See [Material-UI Grid](https://mui.com/material-ui/api/grid/#props) for available GridProps values.
   */
  previewGridProps: PropTypes.object,
  /** The label for the file preview section. */
  previewText: PropTypes.string,
  /**
   * The node of button to clear dropzone.
   *
   * - can be a node to mount in a placeholder.
   * - can be an object:
   *  - text (string) - text of the button
   *  - onClick (function) - callback fired when reset button clicked
   */
  reset: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.shape({
      text: PropTypes.string,
      onClick: PropTypes.func,
    }),
  ]),
  /**
   * Shows styled Material-UI Snackbar when files are dropped, deleted or rejected.
   *
   * - can be a boolean ("global" `true` or `false` for all alerts).
   * - can be an array, with values 'error', 'info', 'success' to select to view only certain alerts:
   *  - showAlerts={['error']} for only errors.
   *  - showAlerts={['error', 'info']} for both errors and info.
   *  - showAlerts={['error', 'success', 'info']} is same as showAlerts={true}.
   *  - showAlerts={[]} is same as showAlerts={false}.
   */
  showAlerts: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.oneOf(["error", "success", "info"])),
  ]),
  /**
   * Props to pass to the Material-UI Snackbar components.<br/>Requires `showAlerts` prop to be `true`.
   *
   * @see See [Material-UI Snackbar](https://mui.com/material-ui/api/snackbar/#props) for available values.
   */
  alertSnackbarProps: PropTypes.object,
  /**
   * Props to pass to the Dropzone component.
   *
   * @see See [Dropzone props](https://react-dropzone.js.org/#src) for available values.
   */
  dropzoneProps: PropTypes.object,
  /**
   * Attributes applied to the input element.
   *
   * @see See [MDN Input File attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Additional_attributes) for available values.
   */
  inputProps: PropTypes.object,
  /**
   * Get alert message to display when files limit is exceed.
   *
   * *Default*: "Maximum allowed number of files exceeded. Only ${filesLimit} allowed"
   *
   * @param {number} filesLimit The `filesLimit` currently set for the component.
   */
  getFileLimitExceedMessage: PropTypes.func,
  /**
   * Get alert message to display when a new file is added.
   *
   * *Default*: "File ${fileName} successfully added."
   *
   * @param {string} fileName The newly added file name.
   */
  getFileAddedMessage: PropTypes.func,
  /**
   * Get alert message to display when a file is removed.
   *
   * *Default*: "File ${fileName} removed."
   *
   * @param {string} fileName The name of the removed file.
   */
  getFileRemovedMessage: PropTypes.func,
  /**
   * Get alert message to display when a file is rejected onDrop.
   *
   * *Default*: "File ${fileRejection.file.name} was rejected."
   *
   * @param {FileRejection} fileRejection The file rejection object
   * @param {number} maxFileSize The `maxFileSize` prop currently set for the component
   */
  getDropRejectMessage: PropTypes.func,
  /**
   * A function which determines which icon to display for a file preview.
   *
   * *Default*: If its an image then displays a preview the image, otherwise it will display an attachment icon
   *
   * @param {FileObject} objectFile The file which the preview will belong to
   * @param {Object} classes The classes for the file preview icon, in the default case we use the 'image' className.
   */
  getPreviewIcon: PropTypes.func,
  /**
   * Fired when new files are added to dropzone.
   *
   * @param {FileObject[]} newFiles The new files added to the dropzone.
   */
  onAdd: PropTypes.func,
  /**
   * Fired when a file is deleted from the previews panel.
   *
   * @param {FileObject} deletedFileObject The file that was removed.
   * @param {number} index The index of the removed file object.
   */
  onDelete: PropTypes.func,
  /**
   * Fired when the user drops files into the dropzone.
   *
   * @param {File[]} droppedFiles All the files dropped into the dropzone.
   * @param {Event} event The react-dropzone drop event.
   */
  onDrop: PropTypes.func,
  /**
   * Fired when a file is rejected because of wrong file type, size or goes beyond the filesLimit.
   *
   * @param {FileRejection[]} fileRejections All the file rejections.
   * @param {Event} event The react-dropzone drop event.
   */
  onDropRejected: PropTypes.func,
  /**
   * Fired when an alert is triggered.
   *
   * @param {string} message Alert message.
   * @param {string} variant One of "error", "info", "success".
   */
  onAlert: PropTypes.func,
};

export default DropzoneAreaBase;

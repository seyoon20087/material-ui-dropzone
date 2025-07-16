import PropTypes from 'prop-types';
import * as React from 'react';
import { createElement, Fragment } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import clsx from 'clsx';
import Dropzone from 'react-dropzone';
import Chip from '@mui/material/Chip';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import deepmerge from '@mui/utils/deepmerge';
import { jsx, jsxs } from 'react/jsx-runtime';
import IconButton from '@mui/material/IconButton';
import SnackbarContent from '@mui/material/SnackbarContent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { keyframes } from '@mui/styled-engine';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

function isImage(file) {
  if (file.type.split("/")[0] === "image") {
    return true;
  }
}
function convertBytesToMbsOrKbs(filesize) {
  let size = "";
  if (filesize >= 1048576) {
    size = filesize / 1048576 + " megabytes";
  } else if (filesize >= 1024) {
    size = filesize / 1024 + " kilobytes";
  } else {
    size = filesize + " bytes";
  }
  return size;
}
async function createFileFromUrl(url) {
  const response = await fetch(url);
  const data = await response.blob();
  const metadata = {
    type: data.type
  };
  const filename = url.replace(/\?.+/, "").split("/").pop();
  return new File([data], filename, metadata);
}
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => {
      resolve(event?.target?.result);
    };
    reader.onerror = event => {
      reader.abort();
      reject(event);
    };
    reader.readAsDataURL(file);
  });
}

var _DeleteIcon;
const PREFIX$2 = "MuiDropzonePreviewList";
const classes$2 = {
  root: `${PREFIX$2}-root`,
  imageContainer: `${PREFIX$2}-imageContainer`,
  image: `${PREFIX$2}-image`,
  removeButton: `${PREFIX$2}-removeButton`
};
const StyledGrid = styled(Grid)(({
  theme: {
    palette,
    shape,
    spacing,
    components
  }
}) => ({
  [`&.${classes$2.root}`]: deepmerge({}, components[PREFIX$2]?.styleOverrides?.root),
  [`& .${classes$2.imageContainer}`]: deepmerge({
    position: "relative",
    zIndex: 10,
    textAlign: "center",
    [`&:hover .${classes$2.image}`]: {
      opacity: 0.3
    },
    [`&:hover .${classes$2.removeButton}`]: {
      opacity: 1
    }
  }, components[PREFIX$2]?.styleOverrides?.imageContainer),
  [`& .${classes$2.image}`]: deepmerge({
    height: 100,
    width: "initial",
    maxWidth: "100%",
    color: palette.text.primary,
    transition: "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
    boxSizing: "border-box",
    boxShadow: "rgba(0, 0, 0, 0.12) 0 1px 6px, rgba(0, 0, 0, 0.12) 0 1px 4px",
    borderRadius: shape.borderRadius,
    zIndex: 5,
    opacity: 1
  }, components[PREFIX$2]?.styleOverrides?.image),
  [`& .${classes$2.removeButton}`]: deepmerge({
    transition: ".5s ease",
    position: "absolute",
    opacity: 0,
    top: spacing(-1),
    right: spacing(-1),
    width: 40,
    height: 40,
    "&:focus": {
      opacity: 1
    }
  }, components[PREFIX$2]?.styleOverrides?.removeButton)
}));
function PreviewList({
  fileObjects,
  handleRemove,
  showFileNames,
  useChipsForPreview,
  previewChipProps,
  previewGridProps,
  //classes,
  getPreviewIcon
}) {
  if (useChipsForPreview) {
    return /*#__PURE__*/jsx(StyledGrid, {
      spacing: 1,
      direction: "row",
      ...previewGridProps.container,
      container: true,
      className: clsx(classes$2.root),
      children: fileObjects.map((fileObject, i) => {
        return /*#__PURE__*/createElement(Grid, {
          ...previewGridProps.item,
          item: true,
          key: `${fileObject.file?.name ?? "file"}-${i}`,
          className: classes$2.imageContainer
        }, /*#__PURE__*/jsx(Chip, {
          variant: "outlined",
          ...previewChipProps,
          label: fileObject.file.name,
          onDelete: handleRemove(i)
        }));
      })
    });
  }
  return /*#__PURE__*/jsx(StyledGrid, {
    spacing: 8,
    ...previewGridProps.container,
    container: true,
    className: clsx(classes$2.root),
    children: fileObjects.map((fileObject, i) => {
      return /*#__PURE__*/createElement(Grid, {
        xs: 4,
        ...previewGridProps.item,
        item: true,
        key: `${fileObject.file?.name ?? "file"}-${i}`,
        className: clsx(classes$2.imageContainer)
      }, getPreviewIcon(fileObject, classes$2), showFileNames && /*#__PURE__*/jsx(Typography, {
        variant: "body1",
        component: "p",
        children: fileObject.file.name
      }), /*#__PURE__*/jsx(Fab, {
        onClick: handleRemove(i),
        "aria-label": "Delete",
        className: classes$2.removeButton,
        children: _DeleteIcon || (_DeleteIcon = /*#__PURE__*/jsx(DeleteIcon, {}))
      }));
    })
  });
}
process.env.NODE_ENV !== "production" ? PreviewList.propTypes = {
  fileObjects: PropTypes.arrayOf(PropTypes.object).isRequired,
  getPreviewIcon: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  previewChipProps: PropTypes.object,
  previewGridProps: PropTypes.object,
  showFileNames: PropTypes.bool,
  useChipsForPreview: PropTypes.bool
} : void 0;

const PREFIX$1 = "MuiDropzoneSnackbar";
const classes$1 = {
  successAlert: `${PREFIX$1}-successAlert`,
  errorAlert: `${PREFIX$1}-errorAlert`,
  infoAlert: `${PREFIX$1}-infoAlert`,
  warningAlert: `${PREFIX$1}-warningAlert`,
  message: `${PREFIX$1}-message`,
  icon: `${PREFIX$1}-icon`,
  closeButton: `${PREFIX$1}-closeButton`
};
const StyledSnackbarContent = styled(SnackbarContent)(({
  theme
}) => ({
  [`&.${classes$1.successAlert}`]: deepmerge({
    backgroundColor: theme.palette.success.main
  }, theme.components[PREFIX$1]?.styleOverrides?.successAlert),
  [`&.${classes$1.errorAlert}`]: deepmerge({
    backgroundColor: theme.palette.error.main
  }, theme.components[PREFIX$1]?.styleOverrides?.errorAlert),
  [`&.${classes$1.infoAlert}`]: deepmerge({
    backgroundColor: theme.palette.info.main
  }, theme.components[PREFIX$1]?.styleOverrides?.infoAlert),
  [`&.${classes$1.warningAlert}`]: deepmerge({
    backgroundColor: theme.palette.warning.main
  }, theme.components[PREFIX$1]?.styleOverrides?.warningAlert),
  [`& .${classes$1.message}`]: deepmerge({
    display: "flex",
    alignItems: "center",
    "& > svg": {
      marginRight: theme.spacing(1)
    }
  }, theme.components[PREFIX$1]?.styleOverrides?.message),
  [`& .${classes$1.icon}`]: deepmerge({
    fontSize: 20,
    opacity: 0.9
  }, theme.components[PREFIX$1]?.styleOverrides?.icon),
  [`& .${classes$1.closeButton}`]: deepmerge({}, theme.components[PREFIX$1]?.styleOverrides?.closeButton)
}));
const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};
function SnackbarContentWrapper(props) {
  const {
    className,
    message,
    onClose,
    variant,
    ...other
  } = props;
  const Icon = variantIcon[variant];
  return /*#__PURE__*/jsx(StyledSnackbarContent, {
    className: clsx(classes$1[`${variant}Alert`], className),
    "aria-describedby": "client-snackbar",
    message: /*#__PURE__*/jsxs("span", {
      id: "client-snackbar",
      className: classes$1.message,
      children: [/*#__PURE__*/jsx(Icon, {
        className: classes$1.icon
      }), message]
    }),
    action: [/*#__PURE__*/jsx(IconButton, {
      "aria-label": "Close",
      color: "inherit",
      className: classes$1.closeButton,
      onClick: onClose,
      children: /*#__PURE__*/jsx(CloseIcon, {
        className: classes$1.icon
      })
    }, "close")],
    ...other
  });
}
process.env.NODE_ENV !== "production" ? SnackbarContentWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(["success", "warning", "error", "info"]).isRequired
} : void 0;

const PREFIX = "MuiDropzoneArea";
const classes = {
  root: `${PREFIX}-root`,
  active: `${PREFIX}-active`,
  invalid: `${PREFIX}-invalid`,
  textContainer: `${PREFIX}-textContainer`,
  text: `${PREFIX}-text`,
  icon: `${PREFIX}-icon`,
  resetButton: `${PREFIX}-resetButton`
};
const progress = keyframes({
  "0%": {
    backgroundPosition: "0 0"
  },
  "100%": {
    backgroundPosition: "-70px 0"
  }
});
const StyledDropzoneRoot = styled("div")(({
  theme: {
    palette,
    shape,
    spacing,
    components
  }
}) => ({
  [`&.${classes.root}`]: deepmerge({
    position: "relative",
    width: "100%",
    minHeight: "250px",
    backgroundColor: palette.background.paper,
    border: "dashed",
    borderColor: palette.divider,
    borderRadius: shape.borderRadius,
    boxSizing: "border-box",
    cursor: "pointer",
    overflow: "hidden"
  }, components[PREFIX]?.styleOverrides?.root),
  [`&.${classes.active}`]: deepmerge({
    animation: `${progress} 2s linear infinite !important`,
    // eslint-disable-next-line max-len
    backgroundImage: `repeating-linear-gradient(-45deg, ${palette.background.paper}, ${palette.background.paper} 25px, ${palette.divider} 25px, ${palette.divider} 50px)`,
    backgroundSize: "150% 100%",
    border: "solid",
    borderColor: palette.primary.light
  }, components[PREFIX]?.styleOverrides?.active),
  [`&.${classes.invalid}`]: deepmerge({
    // eslint-disable-next-line max-len
    backgroundImage: `repeating-linear-gradient(-45deg, ${palette.error.light}, ${palette.error.light} 25px, ${palette.error.dark} 25px, ${palette.error.dark} 50px)`,
    borderColor: palette.error.main
  }, components[PREFIX]?.styleOverrides?.invalid),
  [`& .${classes.textContainer}`]: deepmerge({
    textAlign: "center"
  }, components[PREFIX]?.styleOverrides?.textContainer),
  [`& .${classes.text}`]: deepmerge({
    marginBottom: spacing(3),
    marginTop: spacing(3)
  }, components[PREFIX]?.styleOverrides?.text),
  [`& .${classes.icon}`]: deepmerge({
    width: 51,
    height: 51,
    color: palette.text.primary
  }, components[PREFIX]?.styleOverrides?.icon)
}));
const StyledResetButton = styled(Button)(({
  theme
}) => ({
  [`&.${classes.resetButton}`]: deepmerge({
    display: "block",
    margin: "10px 0"
  }, theme.components[PREFIX]?.styleOverrides?.resetButton)
}));
const defaultSnackbarAnchorOrigin = {
  horizontal: "left",
  vertical: "bottom"
};
const defaultGetPreviewIcon = (fileObject, classes) => {
  if (isImage(fileObject.file)) {
    return /*#__PURE__*/jsx("img", {
      className: classes.image,
      role: "presentation",
      src: fileObject.data
    });
  }
  return /*#__PURE__*/jsx(AttachFileIcon, {
    className: classes.image
  });
};

/**
 * This components creates a Material-UI Dropzone, with previews and snackbar notifications.
 */
class DropzoneAreaBase extends React.PureComponent {
  state = {
    openSnackBar: false,
    snackbarMessage: "",
    snackbarVariant: "success"
  };
  notifyAlert() {
    const {
      onAlert
    } = this.props;
    const {
      openSnackBar,
      snackbarMessage,
      snackbarVariant
    } = this.state;
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
      onDrop
    } = this.props;
    if (filesLimit > 1 && fileObjects.length + acceptedFiles.length > filesLimit) {
      this.setState({
        openSnackBar: true,
        snackbarMessage: getFileLimitExceedMessage(filesLimit),
        snackbarVariant: "error"
      }, this.notifyAlert);
      return;
    }

    // Notify Drop event
    if (onDrop) {
      onDrop(acceptedFiles, evt);
    }

    // Retrieve fileObjects data
    const fileObjs = await Promise.all(acceptedFiles.map(async file => {
      const data = await readFile(file);
      return {
        file,
        data
      };
    }));

    // Notify added files
    if (onAdd) {
      onAdd(fileObjs);
    }

    // Display message
    const message = fileObjs.reduce((msg, fileObj) => msg + getFileAddedMessage(fileObj.file.name), "");
    this.setState({
      openSnackBar: true,
      snackbarMessage: message,
      snackbarVariant: "success"
    }, this.notifyAlert);
  };
  dropzoneRootRef = /*#__PURE__*/React.createRef();
  handleDropRejected = (fileRejections, evt) => {
    const {
      filesLimit,
      fileObjects,
      getDropRejectMessage,
      getFileLimitExceedMessage,
      maxFileSize,
      onDropRejected
    } = this.props;
    let message = "";
    if (fileObjects.length + fileRejections.length > filesLimit) {
      message = getFileLimitExceedMessage(filesLimit);
    } else {
      fileRejections.forEach(fileRejection => {
        message = getDropRejectMessage(fileRejection, maxFileSize);
      });
    }
    if (onDropRejected) {
      onDropRejected(rejectedFiles, evt);
    }
    this.setState({
      openSnackBar: true,
      snackbarMessage: message,
      snackbarVariant: "error"
    }, this.notifyAlert);
    this.dropzoneRootRef.current.dispatchEvent(new Event("dragleave", {
      bubbles: true
    }));
  };
  handleRemove = fileIndex => event => {
    event.stopPropagation();
    const {
      fileObjects,
      getFileRemovedMessage,
      onDelete
    } = this.props;

    // Find removed fileObject
    const removedFileObj = fileObjects[fileIndex];

    // Notify removed file
    if (onDelete) {
      onDelete(removedFileObj, fileIndex);
    }
    this.setState({
      openSnackBar: true,
      snackbarMessage: getFileRemovedMessage(removedFileObj.file.name),
      snackbarVariant: "info"
    }, this.notifyAlert);
  };
  handleCloseSnackbar = () => {
    this.setState({
      openSnackBar: false
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
      reset
    } = this.props;
    const {
      openSnackBar,
      snackbarMessage,
      snackbarVariant
    } = this.state;

    //const acceptFiles = acceptedFiles?.join();
    const isMultiple = filesLimit > 1;
    const previewsVisible = showPreviews && fileObjects.length > 0;
    const previewsInDropzoneVisible = showPreviewsInDropzone && fileObjects.length > 0;
    return /*#__PURE__*/jsxs(Fragment, {
      children: [/*#__PURE__*/jsx(Dropzone, {
        ...dropzoneProps,
        accept: acceptedFiles,
        onDropAccepted: this.handleDropAccepted,
        onDropRejected: this.handleDropRejected,
        maxSize: maxFileSize,
        multiple: isMultiple,
        children: ({
          getRootProps,
          getInputProps,
          isDragActive,
          isDragReject,
          rootRef
        }) => /*#__PURE__*/jsxs(StyledDropzoneRoot, {
          ...getRootProps({
            className: clsx(classes.root, dropzoneClass, isDragActive && classes.active, !disableRejectionFeedback && isDragReject && classes.invalid)
          }),
          ref: function () {
            this.dropzoneRootRef = rootRef;
            return rootRef;
          }.apply(this),
          children: [/*#__PURE__*/jsx("input", {
            ...getInputProps(inputProps)
          }), /*#__PURE__*/jsxs("div", {
            className: classes.textContainer,
            children: [/*#__PURE__*/jsx(Typography, {
              variant: "h5",
              component: "p",
              className: clsx(classes.text, dropzoneParagraphClass),
              children: dropzoneText
            }), Icon ? /*#__PURE__*/jsx(Icon, {
              className: classes.icon
            }) : /*#__PURE__*/jsx(CloudUploadIcon, {
              className: classes.icon
            })]
          }), previewsInDropzoneVisible && /*#__PURE__*/jsx(PreviewList, {
            fileObjects: fileObjects,
            handleRemove: this.handleRemove,
            getPreviewIcon: getPreviewIcon,
            showFileNames: showFileNames,
            useChipsForPreview: useChipsForPreview,
            previewChipProps: previewChipProps,
            previewGridProps: previewGridProps
          })]
        })
      }), reset && (/*#__PURE__*/React.isValidElement(reset) ? reset : /*#__PURE__*/jsx(StyledResetButton, {
        onClick: reset.onClick,
        variant: "outlined",
        className: classes.resetButton,
        children: reset.text || "reset"
      })), previewsVisible && /*#__PURE__*/jsxs(Fragment, {
        children: [/*#__PURE__*/jsx(Typography, {
          variant: "subtitle1",
          component: "span",
          children: previewText
        }), /*#__PURE__*/jsx(PreviewList, {
          fileObjects: fileObjects,
          handleRemove: this.handleRemove,
          getPreviewIcon: getPreviewIcon,
          showFileNames: showFileNamesInPreview,
          useChipsForPreview: useChipsForPreview,
          previewChipProps: previewChipProps,
          previewGridProps: previewGridProps
        })]
      }), (typeof showAlerts === "boolean" && showAlerts || Array.isArray(showAlerts) && showAlerts.includes(snackbarVariant)) && /*#__PURE__*/jsx(Snackbar, {
        anchorOrigin: defaultSnackbarAnchorOrigin,
        autoHideDuration: 6000,
        ...alertSnackbarProps,
        open: openSnackBar,
        onClose: this.handleCloseSnackbar,
        children: /*#__PURE__*/jsx(SnackbarContentWrapper, {
          onClose: this.handleCloseSnackbar,
          variant: snackbarVariant,
          message: snackbarMessage
        })
      })]
    });
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
  showPreviews: false,
  // By default previews show up under in the dialog and inside in the standalone
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
      vertical: "bottom"
    },
    autoHideDuration: 6000
  },
  getFileLimitExceedMessage: filesLimit => `Maximum allowed number of files exceeded. Only ${filesLimit} allowed`,
  getFileAddedMessage: fileName => `File ${fileName} successfully added.`,
  getPreviewIcon: defaultGetPreviewIcon,
  getFileRemovedMessage: fileName => `File ${fileName} removed.`,
  getDropRejectMessage: (fileRejection, maxFileSize) => {
    let message = `File ${fileRejection.file.name} was rejected. `;
    fileRejection.errors.forEach(({
      code
    }) => {
      switch (code) {
        case "file-invalid-type":
          message += "File type not supported. ";
          break;
        case "file-too-large":
          message += "File is too big. Size limit is " + convertBytesToMbsOrKbs(maxFileSize) + ". ";
          break;
      }
    });
    return message;
  }
};
const FileObjectShape = PropTypes.shape({
  file: PropTypes.object,
  data: PropTypes.any
});
process.env.NODE_ENV !== "production" ? DropzoneAreaBase.propTypes = {
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
  reset: PropTypes.oneOfType([PropTypes.node, PropTypes.shape({
    text: PropTypes.string,
    onClick: PropTypes.func
  })]),
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
  showAlerts: PropTypes.oneOfType([PropTypes.bool, PropTypes.arrayOf(PropTypes.oneOf(["error", "success", "info"]))]),
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
  onAlert: PropTypes.func
} : void 0;

const splitDropzoneAreaProps = props => {
  const {
    clearOnUnmount,
    initialFiles,
    onChange,
    onDelete,
    ...dropzoneAreaProps
  } = props;
  return [{
    clearOnUnmount,
    initialFiles,
    onChange,
    onDelete
  }, dropzoneAreaProps];
};

/**
 * This components creates an uncontrolled Material-UI Dropzone, with previews and snackbar notifications.
 *
 * It supports all props of `DropzoneAreaBase` but keeps the files state internally.
 *
 * **Note** To listen to file changes use `onChange` event handler and notice that `onDelete` returns a `File` instance instead of `FileObject`.
 */
class DropzoneArea extends React.PureComponent {
  state = {
    fileObjects: []
  };
  componentDidMount() {
    this.loadInitialFiles();
  }
  componentWillUnmount() {
    const {
      clearOnUnmount
    } = this.props;
    if (clearOnUnmount) {
      this.setState({
        fileObjects: []
      }, this.notifyFileChange);
    }
  }
  notifyFileChange = () => {
    const {
      onChange
    } = this.props;
    const {
      fileObjects
    } = this.state;
    if (onChange) {
      onChange(fileObjects.map(fileObject => fileObject.file));
    }
  };
  loadInitialFiles = async () => {
    const {
      initialFiles
    } = this.props;
    try {
      const fileObjs = await Promise.all(initialFiles.map(async initialFile => {
        let file;
        if (typeof initialFile === "string") {
          file = await createFileFromUrl(initialFile);
        } else {
          file = initialFile;
        }
        const data = await readFile(file);
        return {
          file,
          data
        };
      }));
      this.setState(state => ({
        fileObjects: [].concat(state.fileObjects, fileObjs)
      }), this.notifyFileChange);
    } catch (err) {
      console.log(err);
    }
  };
  addFiles = async newFileObjects => {
    const {
      filesLimit
    } = this.props;
    // Update component state
    this.setState(state => {
      // Handle a single file
      if (filesLimit <= 1) {
        return {
          fileObjects: [].concat(newFileObjects[0])
        };
      }

      // Handle multiple files
      return {
        fileObjects: [].concat(state.fileObjects, newFileObjects)
      };
    }, this.notifyFileChange);
  };
  deleteFile = (removedFileObj, removedFileObjIdx) => {
    event.stopPropagation();
    const {
      onDelete
    } = this.props;
    const {
      fileObjects
    } = this.state;

    // Calculate remaining fileObjects array
    const remainingFileObjs = fileObjects.filter((fileObject, i) => {
      return i !== removedFileObjIdx;
    });

    // Notify removed file
    if (onDelete) {
      onDelete(removedFileObj.file, removedFileObjIdx);
    }

    // Update local state
    this.setState({
      fileObjects: remainingFileObjs
    }, this.notifyFileChange);
  };
  render() {
    const [, dropzoneAreaProps] = splitDropzoneAreaProps(this.props);
    const {
      fileObjects
    } = this.state;
    return /*#__PURE__*/jsx(DropzoneAreaBase, {
      ...dropzoneAreaProps,
      fileObjects: fileObjects,
      onAdd: this.addFiles,
      onDelete: this.deleteFile
    });
  }
}
DropzoneArea.defaultProps = {
  clearOnUnmount: true,
  filesLimit: 3,
  initialFiles: []
};
process.env.NODE_ENV !== "production" ? DropzoneArea.propTypes = {
  ...DropzoneAreaBase.propTypes,
  /** Clear uploaded files when component is unmounted. */
  clearOnUnmount: PropTypes.bool,
  /** List containing File objects or URL strings.<br/>
   * **Note:** Please take care of CORS.
   */
  initialFiles: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.any])),
  /** Maximum number of files that can be loaded into the dropzone. */
  filesLimit: PropTypes.number,
  /**
   * Fired when the files inside dropzone change.
   *
   * @param {File[]} loadedFiles All the files currently loaded into the dropzone.
   */
  onChange: PropTypes.func,
  /**
   * Fired when a file is deleted from the previews panel.
   *
   * @param {File} deletedFile The file that was removed.
   * @param {number} index The index of the removed file object.
   */
  onDelete: PropTypes.func
} : void 0;

function splitDropzoneDialogProps(allProps) {
  const {
    cancelButtonText,
    dialogProps,
    dialogTitle,
    fullWidth,
    maxWidth,
    onClose,
    onSave,
    open,
    submitButtonText,
    ...dropzoneAreaProps
  } = allProps;
  return [{
    cancelButtonText,
    dialogProps,
    dialogTitle,
    fullWidth,
    maxWidth,
    onClose,
    onSave,
    open,
    submitButtonText
  }, dropzoneAreaProps];
}

/**
 * This component provides the DropzoneArea inside of a Material-UI Dialog.
 *
 * It supports all the Props and Methods from `DropzoneAreaBase`.
 */
class DropzoneDialogBase extends React.PureComponent {
  render() {
    const [dropzoneDialogProps, dropzoneAreaProps] = splitDropzoneDialogProps(this.props);
    const {
      cancelButtonText,
      dialogProps,
      dialogTitle,
      fullWidth,
      maxWidth,
      onClose,
      onSave,
      open,
      submitButtonText
    } = dropzoneDialogProps;

    // Submit button state
    const submitDisabled = dropzoneAreaProps.fileObjects.length === 0;
    return /*#__PURE__*/jsxs(Dialog, {
      ...dialogProps,
      fullWidth: fullWidth,
      maxWidth: maxWidth,
      onClose: onClose,
      open: open,
      children: [/*#__PURE__*/jsx(DialogTitle, {
        children: dialogTitle
      }), /*#__PURE__*/jsx(DialogContent, {
        children: /*#__PURE__*/jsx(DropzoneAreaBase, {
          ...dropzoneAreaProps
        })
      }), /*#__PURE__*/jsxs(DialogActions, {
        children: [/*#__PURE__*/jsx(Button, {
          color: "primary",
          onClick: onClose,
          children: cancelButtonText
        }), /*#__PURE__*/jsx(Button, {
          color: "primary",
          disabled: submitDisabled,
          onClick: onSave,
          children: submitButtonText
        })]
      })]
    });
  }
}
DropzoneDialogBase.defaultProps = {
  open: false,
  dialogTitle: "Upload file",
  dialogProps: {},
  fullWidth: true,
  maxWidth: "sm",
  cancelButtonText: "Cancel",
  submitButtonText: "Submit",
  showPreviews: true,
  showPreviewsInDropzone: false,
  showFileNamesInPreview: true
};
process.env.NODE_ENV !== "production" ? DropzoneDialogBase.propTypes = {
  ...DropzoneAreaBase.propTypes,
  /** Sets whether the dialog is open or closed. */
  open: PropTypes.bool,
  /** The Dialog title. */
  dialogTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  /**
   * Props to pass to the Material-UI Dialog components.
   * @see See [Material-UI Dialog](https://mui.com/material-ui/api/dialog/#props) for available values.
   */
  dialogProps: PropTypes.object,
  /**
   * If `true`, the dialog stretches to `maxWidth`.<br/>
   * Notice that the dialog width grow is limited by the default margin.
   */
  fullWidth: PropTypes.bool,
  /**
   * Determine the max-width of the dialog. The dialog width grows with the size of the screen.<br/>
   * Set to `false` to disable `maxWidth`.
   */
  maxWidth: PropTypes.string,
  /** Cancel button text in dialog. */
  cancelButtonText: PropTypes.string,
  /** Submit button text in dialog. */
  submitButtonText: PropTypes.string,
  /**
   * Fired when the modal is closed.
   *
   * @param {SyntheticEvent} event The react `SyntheticEvent`
   */
  onClose: PropTypes.func,
  /**
   * Fired when the user clicks the Submit button.
   *
   * @param {SyntheticEvent} event The react `SyntheticEvent`
   */
  onSave: PropTypes.func,
  /**
   * Shows previews **BELOW** the dropzone.<br/>
   * **Note:** By default previews show up under in the Dialog and inside in the standalone.
   */
  showPreviews: PropTypes.bool,
  /** Shows preview **INSIDE** the dropzone area. */
  showPreviewsInDropzone: PropTypes.bool,
  /** Shows file name under the image. */
  showFileNamesInPreview: PropTypes.bool
} : void 0;

class DropzoneDialog extends React.PureComponent {
  state = {
    fileObjects: []
  };
  componentDidMount() {
    this.loadInitialFiles();
  }
  componentWillUnmount() {
    const {
      clearOnUnmount
    } = this.props;
    if (clearOnUnmount) {
      this.setState({
        fileObjects: []
      }, this.notifyFileChange);
    }
  }
  notifyFileChange = () => {
    const {
      onChange
    } = this.props;
    const {
      fileObjects
    } = this.state;
    if (onChange) {
      onChange(fileObjects.map(fileObject => fileObject.file));
    }
  };
  loadInitialFiles = async () => {
    const {
      initialFiles
    } = this.props;
    try {
      const fileObjs = await Promise.all(initialFiles.map(async initialFile => {
        let file;
        if (typeof initialFile === "string") {
          file = await createFileFromUrl(initialFile);
        } else {
          file = initialFile;
        }
        const data = await readFile(file);
        return {
          file,
          data
        };
      }));
      this.setState(state => ({
        fileObjects: [].concat(state.fileObjects, fileObjs)
      }), this.notifyFileChange);
    } catch (err) {
      console.log(err);
    }
  };
  addFiles = async newFileObjects => {
    const {
      filesLimit
    } = this.props;
    // Update component state
    this.setState(state => {
      // Handle a single file
      if (filesLimit <= 1) {
        return {
          fileObjects: [].concat(newFileObjects[0])
        };
      }

      // Handle multiple files
      return {
        fileObjects: [].concat(state.fileObjects, newFileObjects)
      };
    }, this.notifyFileChange);
  };
  deleteFile = (removedFileObj, removedFileObjIdx) => {
    event.stopPropagation();
    const {
      onDelete
    } = this.props;
    const {
      fileObjects
    } = this.state;

    // Calculate remaining fileObjects array
    const remainingFileObjs = fileObjects.filter((fileObject, i) => {
      return i !== removedFileObjIdx;
    });

    // Notify removed file
    if (onDelete) {
      onDelete(removedFileObj.file);
    }

    // Update local state
    this.setState({
      fileObjects: remainingFileObjs
    }, this.notifyFileChange);
  };
  handleClose = evt => {
    const {
      clearOnUnmount,
      onClose
    } = this.props;
    if (onClose) {
      onClose(evt);
    }
    if (clearOnUnmount) {
      this.setState({
        fileObjects: []
      }, this.notifyFileChange);
    }
  };
  handleSave = evt => {
    const {
      clearOnUnmount,
      onSave
    } = this.props;
    const {
      fileObjects
    } = this.state;
    if (onSave) {
      onSave(fileObjects.map(fileObject => fileObject.file), evt);
    }
    if (clearOnUnmount) {
      this.setState({
        fileObjects: []
      }, this.notifyFileChange);
    }
  };
  render() {
    const {
      fileObjects
    } = this.state;
    return /*#__PURE__*/jsx(DropzoneDialogBase, {
      ...this.props,
      fileObjects: fileObjects,
      onAdd: this.addFiles,
      onDelete: this.deleteFile,
      onClose: this.handleClose,
      onSave: this.handleSave
    });
  }
}
DropzoneDialog.defaultProps = {
  clearOnUnmount: true,
  filesLimit: 3,
  initialFiles: []
};
process.env.NODE_ENV !== "production" ? DropzoneDialog.propTypes = {
  ...DropzoneDialogBase.propTypes,
  /** Clear uploaded files when component is unmounted. */
  clearOnUnmount: PropTypes.bool,
  /** Maximum number of files that can be loaded into the dropzone. */
  filesLimit: PropTypes.number,
  /** List containing File objects or URL strings.<br/>
   * **Note:** Please take care of CORS.
   */
  initialFiles: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.any])),
  /**
   * Fired when the user clicks the Submit button.
   *
   * @param {File[]} files All the files currently inside the Dropzone.
   * @param {SyntheticEvent} event The react `SyntheticEvent`.
   */
  onSave: PropTypes.func
} : void 0;

export { DropzoneArea, DropzoneAreaBase, DropzoneDialog, DropzoneDialogBase };
//# sourceMappingURL=index.es.js.map

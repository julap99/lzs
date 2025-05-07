// Create some re-useable definitions because
// many input types are identical in how
// we want to style them.
const textClassification = {
  label: "formkit-outer-text",
  inner: "formkit-inner-text",
  input: "formkit-input-text",
  prefix: "formkit-prefix-text",
  message: "formkit-message-text",
};
const boxClassification = {
  inner: "formkit-inner-box",
  fieldset: "formkit-fieldset-box",
  legend: "formkit-legend-box",
  wrapper: "formkit-wrapper-box",
  help: "formkit-help-box",
  input: "formkit-input-box",
  label: "formkit-label-box",
  message: "formkit-message-box",
};
const buttonClassification = {
  wrapper: "formkit-wrapper-button",
  input: "formkit-input-button",
};
const OtpClassification = {
  label: "formkit-label-otp",
  inner: "formkit-inner-otp",
  digit: "formkit-digit-otp",
  message: "formkit-message-otp",
};

const colorClassification = {
  label: "formkit-label-color",
  input: "formkit-input-color",
};

const fileClassification = {
  label: "formkit-label-file",
  inner: "formkit-inner-file",
  input: "formkit-input-file",
};

const rangeClassification = {
  input: "formkit-input-range",
};

// export our definitions using our above
// templates and declare one-offs and
// overrides as needed.
export default {
  // the global key will apply to all inputs
  global: {
    label: "formkit-label-global",
    outer: "formkit-outer-global",
    help: "formkit-help-global",
    messages: "formkit-messages-global",
    message: "formkit-message-global",
    wrapper: "formkit-wrapper-global",
  },
  button: buttonClassification,
  color: colorClassification,
  date: textClassification,
  "datetime-local": textClassification,
  checkbox: boxClassification,
  email: textClassification,
  file: fileClassification,
  month: textClassification,
  number: textClassification,
  password: textClassification,
  radio: {
    ...boxClassification,
    input: "formkit-input-radio",
  },
  range: rangeClassification,
  search: textClassification,
  select: { ...textClassification, option: "p-2" },
  submit: buttonClassification,
  tel: textClassification,
  text: textClassification,
  textarea: {
    ...textClassification,
    input: "formkit-input-textarea",
  },
  time: textClassification,
  url: textClassification,
  week: textClassification,
  otp: OtpClassification,
  mask: textClassification,
  dropzone: {
    ...textClassification,
    inner: "formkit-inner-dropzone",
    dropzone: "formkit-dropzone",
  },
};

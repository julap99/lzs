import { createInput } from "@formkit/vue";
import OneTimePassword from "~/components/formkit/OneTimePassword.vue";
import MaskText from "~/components/formkit/TextMask.vue";
import FileDropzone from "~/components/formkit/FileDropzone.vue";
import Toggle from "~/components/formkit/Toggle.vue";

export default {
  otp: createInput(OneTimePassword, {
    props: ["digits"],
  }),
  mask: createInput(MaskText, {
    props: ["mask"],
  }),
  dropzone: createInput(FileDropzone, {
    props: ["accept", "multiple", "maxSize", "minSize", "maxFiles", "disabled"],
  }),
  toggle: createInput(Toggle, {
    props: ["onLabel", "offLabel"],
  }),
};

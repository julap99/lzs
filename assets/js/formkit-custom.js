import { createInput } from "@formkit/vue";
import OneTimePassword from "~/components/formkit/OneTimePassword.vue";
import MaskText from "~/components/formkit/TextMask.vue";
import FileDropzone from "~/components/formkit/FileDropzone.vue";
import Toggle from "~/components/formkit/Toggle.vue";
import Checkbox from "~/components/formkit/Checkbox.vue";
import Radio from "~/components/formkit/Radio.vue";
import Money from "~/components/formkit/Money.vue";
import DateTimePicker from "~/components/formkit/DateTimePicker.vue";

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
  checkbox: createInput(Checkbox, {
    props: ["options"],
  }),
  radio: createInput(Radio, {
    props: ["options"],
  }),
  money: createInput(Money, {
    props: ["disabled", "readonly"],
  }),
  date: createInput(DateTimePicker, {
    props: ["minDate", "maxDate", "disabled", "placeholder"],
  }),
};

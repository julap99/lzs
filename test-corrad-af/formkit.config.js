import { generateClasses } from "@formkit/themes";
import defaultTheme from "@/assets/js/formkit-theme.js";
import customInput from "@/assets/js/formkit-custom.js";

// ----------------- Addons --------------------------- //

// https://formkit.com/plugins/auto-animate
import { createAutoAnimatePlugin } from "@formkit/addons";

// https://formkit.com/plugins/floating-labels
import { createFloatingLabelsPlugin } from "@formkit/addons";
import "@formkit/addons/css/floatingLabels";

// https://formkit.com/plugins/multi-step
import { createMultiStepPlugin } from "@formkit/addons";
import "@formkit/addons/css/multistep";

// https://formkit.com/plugins/auto-height-textarea
import { createAutoHeightTextareaPlugin } from "@formkit/addons";

// https://formkit.com/plugins/local-storage
import { createLocalStoragePlugin } from "@formkit/addons";

export default {
  plugins: [
    createFloatingLabelsPlugin({
      useAsDefault: false, // defaults to false
    }),
    createAutoAnimatePlugin({
      // optional config
    }),
    createMultiStepPlugin(),
    createAutoHeightTextareaPlugin(),
    createLocalStoragePlugin({
      // plugin defaults:
      prefix: "formkit",
      key: undefined,
      control: undefined,
      maxAge: 3600000, // 1 hour
      debounce: 200,
      beforeSave: undefined,
      beforeLoad: undefined,
    }),
  ],
  config: {
    classes: generateClasses(defaultTheme),
  },
  inputs: customInput,
};

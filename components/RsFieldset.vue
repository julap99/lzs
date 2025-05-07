<script setup>
// const props = defineProps({
//   context: Object,
// });

// const label = props.context.label || "";
// const border = props.context.border || true;
// const borderColour = props.context.borderColour || "gray";
// const borderWidth = props.context.borderWidth || "1px";
// const borderRadius = props.context.borderRadius || "0.375rem";

const props = defineProps({
  label: String,
  border: {
    type: Boolean,
    default: true,
  },
  borderColour: {
    type: String,
    default: "rgb(226 232 240)",
  },
  borderWidth: {
    type: String,
    default: "1px",
  },
  borderRadius: {
    type: String,
    default: "0.375rem",
  },
});
</script>

<template>
  <fieldset
    class="p-3"
    :style="{
      border: border ? '1px solid ' + borderColour : 'none',
      borderRadius: borderRadius,
      borderWidth: borderWidth,
    }"
  >
    <legend class="font-bold text-sm">{{ label }}</legend>
    <slot></slot>
  </fieldset>
</template>

<script setup>
const props = defineProps({
  context: Object,
});

function handleChange(event) {
  props.context.node.input(event.target.checked);
}
</script>

<template>
  <label
    :class="context.classes.toggle"
    class="inline-flex items-center mb-5 cursor-pointer mt-1"
  >
    <input
      type="checkbox"
      :checked="context.value"
      :disabled="context.disabled"
      class="sr-only peer"
      @change="handleChange"
    />
    <div
      class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all peer-checked:bg-blue-600"
    ></div>
    <span class="ms-3 text-sm font-medium text-gray-900">
      {{
        context.onLabel || context.offLabel
          ? context.value
            ? context.onLabel
            : context.offLabel
          : context.label
      }}
    </span>
  </label>
</template>

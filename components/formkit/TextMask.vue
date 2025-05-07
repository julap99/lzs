<script setup>
/* eslint-disable */
const props = defineProps({
  context: Object,
});

const mask = String(props.context.mask);
// console.log(props.context);

function handleInput(e) {
  props.context.node.input(e.target.value);
}
</script>

<template>
  <input
    @input="handleInput"
    :class="context.classes.input"
    :value="props.context._value"
    :placeholder="props.context.attrs.placeholder"
    v-maska="mask"
  />
</template>

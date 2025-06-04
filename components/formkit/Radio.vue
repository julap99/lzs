<script setup>
const props = defineProps({
  context: Object,
});

function handleInput(e) {
  props.context.node.input(e.target.value);
}
</script>

<template>
  <div class="radio-group">
    <div
      v-for="(option, index) in context.options"
      :key="index"
      class="radio-option"
    >
      <div class="radio-container">
        <input
          :id="`${context.node.name}-${index}`"
          type="radio"
          :name="context.node.name"
          :value="option.value"
          :checked="context.value === option.value"
          :disabled="context.disabled"
          class="custom-radio"
          @input="handleInput"
        />
        <span class="radio-mark"></span>
      </div>
      <label :for="`${context.node.name}-${index}`" class="radio-label">
        {{ option.label }}
      </label>
    </div>
  </div>
</template>

<style scoped>
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.radio-option {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-container {
  position: relative;
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.radio-label {
  cursor: pointer;
  user-select: none;
  font-size: 0.875rem;
}

.custom-radio {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 2;
}

.radio-mark {
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #fff;
  border: 2px solid rgb(var(--fk-border-color, 209, 213, 219));
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-option:hover .radio-mark {
  border-color: rgb(var(--color-primary, 37, 99, 235));
}

.custom-radio:checked ~ .radio-mark {
  border-color: rgb(var(--color-primary, 37, 99, 235));
}

.custom-radio:checked ~ .radio-mark::after {
  content: "";
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgb(var(--color-primary, 37, 99, 235));
}

.custom-radio:focus ~ .radio-mark {
  box-shadow: 0 0 0 2px rgba(var(--color-primary, 37, 99, 235), 0.3);
}

.custom-radio:disabled ~ .radio-mark {
  opacity: 0.5;
  cursor: not-allowed;
}

.custom-radio:disabled ~ .radio-mark + .radio-label {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Hide FormKit's default label */
:deep(.formkit-label) {
  display: none;
}
</style> 
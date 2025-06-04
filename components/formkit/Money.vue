<script setup>
const props = defineProps({
  context: Object,
});

function handleInput(e) {
  const value = e.target.value;
  // Allow only numbers and decimal points
  const numericValue = value.replace(/[^0-9.]/g, '');
  
  // Prevent multiple decimal points
  const parts = numericValue.split('.');
  if (parts.length > 2) {
    parts.splice(2);
  }
  
  const cleanValue = parts.join('.');
  props.context.node.input(cleanValue);
}

function handleBlur(e) {
  const value = e.target.value;
  if (value && !isNaN(parseFloat(value))) {
    // Format to 2 decimal places on blur
    const formatted = parseFloat(value).toFixed(2);
    props.context.node.input(formatted);
  }
}
</script>

<template>
  <div class="formkit-money-wrapper">
    <span class="formkit-money-prefix">RM</span>
    <input
      :class="context.classes.input"
      :value="context._value"
      :placeholder="context.attrs.placeholder"
      :disabled="context.disabled"
      :readonly="context.attrs.readonly"
      :aria-invalid="context.state.invalid"
      :aria-describedby="context.describedBy"
      type="text"
      inputmode="decimal"
      @input="handleInput"
      @blur="handleBlur"
    />
  </div>
</template>

<style scoped>
.formkit-money-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.formkit-money-prefix {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  background-color: #ffffff;
  padding: 2px 4px;
  border-radius: 4px;
  z-index: 1;
  pointer-events: none;
}

:deep(.formkit-input-text) {
  padding-left: 56px !important;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-weight: 600;
}

/* Read-only state */
.formkit-money-wrapper:has(input:read-only) .formkit-money-prefix {
  color: #9ca3af;
}

.formkit-money-wrapper:has(input:disabled) .formkit-money-prefix {
  color: #9ca3af;
}

/* Focus state */
.formkit-money-wrapper:has(input:focus) .formkit-money-prefix {
  color: #005aad;
}
</style> 
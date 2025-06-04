<script setup>
const props = defineProps({
  context: Object,
  options: Array,
});

function handleInput(e) {
  const isArray = Array.isArray(props.context.value);
  const newValue = e.target.value;

  if (isArray) {
    // Handle multiple checkboxes with options
    const currentValue = [...(props.context.value || [])];
    const valueIndex = currentValue.indexOf(newValue);

    if (e.target.checked && valueIndex === -1) {
      currentValue.push(newValue);
    } else if (!e.target.checked && valueIndex !== -1) {
      currentValue.splice(valueIndex, 1);
    }

    props.context.node.input(currentValue);
  } else {
    // Handle single checkbox
    props.context.node.input(e.target.checked);
  }
}
</script>

<template>
  <div v-if="context.options" class="checkbox-group">
    <!-- Multiple checkboxes with options -->
    <div
      v-for="(option, index) in context.options"
      :key="index"
      class="checkbox-option"
    >
      <div class="checkbox-container">
        <input
          :id="`${context.node.name}-${index}`"
          type="checkbox"
          :name="context.node.name"
          :value="option.value"
          :checked="
            Array.isArray(context.value) && context.value.includes(option.value)
          "
          :disabled="context.disabled"
          class="custom-checkbox"
          @input="handleInput"
        />
        <span class="checkmark">
          <svg
            class="check-icon"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 6L9 17L4 12"
              fill="none"
              stroke="white"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
      <label :for="`${context.node.name}-${index}`" class="checkbox-label">
        {{ option.label }}
      </label>
    </div>
  </div>
  <div v-else class="checkbox-single-wrapper">
    <!-- Single checkbox -->
    <div class="checkbox-option">
      <div class="checkbox-container">
        <input
          :id="context.node.name"
          type="checkbox"
          :name="context.node.name"
          :value="context.node.props.value || 'on'"
          :checked="
            context.value === true ||
            context.value === 'true' ||
            context.value === context.node.props.value
          "
          :disabled="context.disabled"
          class="custom-checkbox"
          @input="handleInput"
        />
        <span class="checkmark">
          <svg
            class="check-icon"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 6L9 17L4 12"
              fill="none"
              stroke="white"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
      <label :for="context.node.name" class="checkbox-label">
        {{ context.label }}
      </label>
    </div>
  </div>
</template>

<style scoped>
.checkbox-group,
.checkbox-single-wrapper {
  display: flex;
  flex-direction: column;
}

.checkbox-option {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  cursor: pointer;
}

.checkbox-container {
  position: relative;
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.checkbox-label {
  cursor: pointer;
  user-select: none;
  font-size: 0.875rem;
}

.custom-checkbox {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 2;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  border-radius: 10px;
  background-color: #fff;
  border: 1px solid #d1d5db;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-checkbox:checked ~ .checkmark {
  background-color: #2563eb;
  border-color: #2563eb;
}

.check-icon {
  width: 16px;
  height: 16px;
  display: none;
}

.custom-checkbox:checked ~ .checkmark .check-icon {
  display: block;
}

.custom-checkbox:focus ~ .checkmark {
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
}

.custom-checkbox:disabled ~ .checkmark {
  opacity: 0.5;
  cursor: not-allowed;
}

.custom-checkbox:disabled ~ .checkmark + label {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Hide FormKit's default label */
:deep(.formkit-label) {
  display: none;
}
</style>

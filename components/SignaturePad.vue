<template>
  <div class="signature-pad-container">
    <div class="signature-pad-wrapper">
      <VueSignaturePad
        ref="signaturePad"
        :options="options"
        @end="onEnd"
        class="signature-pad"
      />
    </div>
    <div class="signature-pad-actions">
      <rs-button
        variant="primary-outline"
        size="sm"
        @click="clear"
        class="mr-2"
      >
        Padam
      </rs-button>
      <rs-button
        variant="primary"
        size="sm"
        @click="save"
        :disabled="!hasSignature"
      >
        Simpan
      </rs-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import VueSignaturePad from 'vue3-signature-pad';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const signaturePad = ref(null);
const hasSignature = ref(false);

const options = {
  penColor: '#000000',
  backgroundColor: '#ffffff',
  velocityFilterWeight: 0.7,
  minWidth: 0.5,
  maxWidth: 2.5,
  throttle: 16
};

const clear = () => {
  signaturePad.value?.clearSignature();
  hasSignature.value = false;
  emit('update:modelValue', '');
};

const save = () => {
  if (!signaturePad.value) return;
  
  const { isEmpty, data } = signaturePad.value.saveSignature();
  if (!isEmpty) {
    emit('update:modelValue', data);
  }
};

const onEnd = () => {
  hasSignature.value = !signaturePad.value?.isEmpty();
};
</script>

<style lang="scss" scoped>
.signature-pad-container {
  @apply border rounded-lg p-4 bg-white;
}

.signature-pad-wrapper {
  @apply border rounded-lg overflow-hidden mb-4;
}

.signature-pad {
  @apply w-full h-48;
}

.signature-pad-actions {
  @apply flex justify-end;
}
</style> 
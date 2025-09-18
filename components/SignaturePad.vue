<template>
  <div class="signature-pad-container">
    <div ref="signaturePadContainer" class="signature-pad-wrapper">
      <VueSignaturePad
        ref="signaturePad"
        :options="options"
        @end="onEnd"
        @ready="resizeSignaturePad"
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
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import VueSignaturePad from 'vue3-signature-pad';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'error']);

const signaturePad = ref(null);
const signaturePadContainer = ref(null);
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
  
  try {
    const { isEmpty, data } = signaturePad.value.saveSignature();
    if (!isEmpty) {
      emit('update:modelValue', data);
    } else {
      emit('error', 'Signature is empty');
    }
  } catch (error) {
    console.error('Error saving signature:', error);
    emit('error', error.message || 'Failed to save signature');
  }
};

const onEnd = () => {
  hasSignature.value = !signaturePad.value?.isEmpty();
};

// Resize signature pad to fit container
const resizeSignaturePad = async () => {
  await nextTick();
  
  if (signaturePad.value && signaturePadContainer.value) {
    try {
      const container = signaturePadContainer.value;
      const canvas = container.querySelector('canvas');
      
      if (canvas) {
        // Get container dimensions
        const containerWidth = container.clientWidth;
        const containerHeight = 200; // Fixed height
        
        // Set canvas size
        canvas.width = containerWidth;
        canvas.height = containerHeight;
        
        // Update canvas style
        canvas.style.width = containerWidth + 'px';
        canvas.style.height = containerHeight + 'px';
        
        // Trigger resize on the signature pad
        if (signaturePad.value.resizeCanvas) {
          signaturePad.value.resizeCanvas();
        }
      }
    } catch (error) {
      console.error('Error resizing signature pad:', error);
    }
  }
};

// Initialize signature pad
onMounted(() => {
  setTimeout(() => {
    resizeSignaturePad();
  }, 100);
  
  // Listen for window resize
  window.addEventListener('resize', resizeSignaturePad);
});

// Cleanup
onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeSignaturePad);
});
</script>

<style lang="scss" scoped>
.signature-pad-container {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: #ffffff;
  width: 100%;
}

.signature-pad-wrapper {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 1rem;
  position: relative;
  width: 100%;
  min-height: 200px;
}

.signature-pad {
  width: 100%;
  height: 200px;
  display: block;
}

:deep(canvas) {
  width: 100% !important;
  height: 200px !important;
  display: block;
  border-radius: 0.5rem;
}

.signature-pad-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

// Ensure proper sizing on mobile
@media (max-width: 768px) {
  .signature-pad-container {
    padding: 0.75rem;
  }
  
  .signature-pad-wrapper {
    min-height: 180px;
  }
  
  .signature-pad {
    height: 180px;
  }
  
  :deep(canvas) {
    height: 180px !important;
  }
}
</style> 
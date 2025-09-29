<template>
  <FormKit
    type="form"
    @submit="$emit('next-step')"
    :actions="false"
    id="sectionB6"
  >
    <!-- VI. Maklumat Kemahiran Tanggungan -->
    <div class="mb-6">
      <h4 class="font-medium mb-3">6. Maklumat Kemahiran</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-black-700"
            >Kemahiran</label
          >
          <FormKit
            type="checkbox"
            name="kemahiran_tanggungan"
            :options="[
              'Nelayan',
              'Penternakan',
              'Pertanian',
              'Menjahit',
              'Kraftangan',
              'Memasak',
              'Mengasuh',
              'Perkhidmatan',
              'Pertukangan',
              'Perniagaan',
              'Lain-lain',
            ]"
            validation="required"
            :disabled="readOnly"
            v-model="getCurrentTanggungan().kemahiran_tanggungan"
          />
        </div>
      </div>
    </div>

    <FormKit
      type="text"
      name="lain_kemahiran_tanggungan"
      label="Lain-lain Kemahiran"
      placeholder="Sila nyatakan kemahiran lain"
      v-if="
        getCurrentTanggungan().kemahiran_tanggungan &&
        getCurrentTanggungan().kemahiran_tanggungan.includes('Lain-lain')
      "
      :disabled="readOnly"
      v-model="getCurrentTanggungan().lain_kemahiran_tanggungan"
    />

    <div class="flex justify-between gap-3 mt-6" v-if="showFooterButtons">
      <rs-button
        type="button"
        variant="primary-outline"
        @click="$emit('prev-step')"
        >Kembali</rs-button
      >
      <div class="flex gap-3">
        <rs-button
          type="button"
          variant="secondary"
          @click="$emit('save-step')"
          >Simpan</rs-button
        >
        <rs-button type="button" variant="primary" @click="$emit('next-step')"
          >Pemilikan Aset</rs-button
        >
      </div>
    </div>
  </FormKit>
</template>

<script setup>
// Props
const props = defineProps({
  getCurrentTanggungan: {
    type: Function,
    required: true
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  showFooterButtons: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['next-step', 'prev-step', 'save-step'])
</script>

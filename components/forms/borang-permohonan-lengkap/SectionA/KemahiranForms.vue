<template>
  <FormKit
    type="form"
    @submit="$emit('next-step')"
    :actions="false"
    id="sectionA7"
  >
    <h3 class="text-lg font-semibold mb-4">7. Kemahiran</h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-black-700"
          >Kemahiran</label
        >
        <FormKit
          type="checkbox"
          name="kemahiran"
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
          v-model="formData.kemahiran"
          placeholder="Pilih kemahiran"
          :validation-messages="{
            required: 'Sila pilih kemahiran',
          }"
        />
      </div>
    </div>

    <FormKit
      type="text"
      name="lain_lain_kemahiran"
      label="Lain-lain Kemahiran"
      validation="required"
      v-if="
        formData.kemahiran && formData.kemahiran.includes('Lain-lain')
      "
      placeholder="Nyatakan kemahiran lain"
      v-model="formData.lain_lain_kemahiran"
    />

    <div class="flex justify-between gap-3 mt-6">
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
          >Maklumat Pinjaman Harta</rs-button
        >
      </div>
    </div>
  </FormKit>
</template>

<script setup>
// Props
const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['next-step', 'prev-step', 'save-step'])
</script>

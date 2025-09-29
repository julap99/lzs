<template>
  <FormKit
    type="form"
    @submit="$emit('next-step')"
    :actions="false"
    id="sectionA4"
  >
    <h3 class="text-lg font-semibold mb-4">4. Maklumat Pengislaman</h3>

    <!-- Adakah anda seorang Muallaf? -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-black-700"
          >Adakah anda seorang Muallaf?</label
        >
        <FormKit
          type="radio"
          name="adakah_muallaf"
          :options="[
            { label: 'Ya', value: 'Y' },
            { label: 'Tidak', value: 'T' },
          ]"
          validation="required"
          validation-label="Status Muallaf"
          :validation-messages="{
            required:
              'Sila pilih sama ada anda seorang muallaf atau tidak',
          }"
          :disabled="readOnly"
          v-model="formData.adakah_muallaf"
        />
      </div>
    </div>

    <!-- Tarikh Masuk Islam -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-if="formData.adakah_muallaf === 'Y'">
        <FormKit
          type="date"
          name="tarikh_masuk_islam"
          label="Tarikh Masuk Islam"
          placeholder="DD/MM/YYYY"
          validation-label="Tarikh Masuk Islam"
          :validation-messages="{
            required: 'Sila masukkan tarikh masuk Islam',
            matches:
              'Format tarikh tidak sah. Sila gunakan format DD/MM/YYYY',
          }"
          :disabled="readOnly"
          v-model="formData.tarikh_masuk_islam"
        />
      </div>

      <!-- Tarikh Masuk Kelas Fardu Ain Muallaf (KFAM) -->
      <div v-if="formData.adakah_muallaf === 'Y'">
        <FormKit
          type="date"
          name="tarikh_masuk_kfam"
          label="Tarikh Masuk Kelas Fardu Ain Muallaf (KFAM)"
          placeholder="DD/MM/YYYY"
          validation-label="Tarikh Masuk KFAM"
          :validation-messages="{
            required:
              'Sila masukkan tarikh masuk Kelas Fardu Ain Muallaf (KFAM)',
            matches:
              'Format tarikh tidak sah. Sila gunakan format DD/MM/YYYY',
          }"
          :disabled="readOnly"
          v-model="formData.tarikh_masuk_kfam"
        />
      </div>

      <!-- Validation error message for Islamic dates -->
      <div
        v-if="
          formData.adakah_muallaf === 'Y' &&
          !islamicDatesValidation.isValid
        "
        class="md:col-span-2 p-3 bg-red-50 border border-red-200 rounded"
      >
        <div class="text-red-600 text-sm">
          <strong>Ralat:</strong> {{ islamicDatesValidation.message }}
        </div>
      </div>

      <!-- Nama Lain -->
      <div v-if="formData.adakah_muallaf === 'Y'">
        <FormKit
          type="text"
          name="nama_lain"
          label="Nama Lain"
          validation="required"
          validation-label="Nama Lain"
          :validation-messages="{
            required: 'Sila masukkan nama lain',
          }"
          :disabled="readOnly"
          v-model="formData.nama_lain"
        />
      </div>

      <!-- Dokumen Pengislaman -->
      <div v-if="formData.adakah_muallaf === 'Y'">
        <FormKit
          type="file"
          name="dokumen_pengislaman"
          label="Dokumen Pengislaman"
          help="Salinan dokumen rasmi pengislaman. Format: PDF, JPG, PNG. Saiz maksimum: 5MB"
          accept=".pdf,.jpg,.jpeg,.png"
          validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
          multiple
          validation-label="Dokumen Pengislaman"
          :validation-messages="{
            required: 'Sila muat naik dokumen pengislaman',
            max: 'Saiz fail tidak boleh melebihi 5MB',
            mime: 'Format fail tidak sah. Sila pilih fail PDF, JPG, atau PNG',
          }"
          :disabled="readOnly"
          v-model="formData.dokumen_pengislaman"
        />
      </div>
    </div>

    <div class="flex justify-between gap-3 mt-6" v-if="showFooterButtons">
      <rs-button
        type="button"
        variant="primary-outline"
        @click="$emit('prev-step')"
        :disabled="readOnly"
      >
        Kembali
      </rs-button>
      <div class="flex gap-3">
        <rs-button
          type="button"
          variant="secondary"
          @click="$emit('save-step')"
          :disabled="readOnly"
        >
          Simpan
        </rs-button>
        <rs-button type="button" variant="primary" @click="$emit('next-step')" :disabled="readOnly">
          Maklumat Perbankan
        </rs-button>
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
  },
  showFooterButtons: {
    type: Boolean,
    default: true
  },
  readOnly: {
    type: Boolean,
    default: false
  }
})

// Islamic dates validation - moved from parent component
const islamicDatesValidation = { isValid: true, message: "" };

// Emits
const emit = defineEmits(['next-step', 'prev-step', 'save-step'])
</script>

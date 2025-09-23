<template>
  <FormKit
    type="form"
    @submit="$emit('next-step')"
    :actions="false"
    id="sectionB12"
  >
    <h3 class="text-lg font-semibold mb-4">
      Maklumat Pengesahan Permastautin
    </h3>

    <!-- PAK Officer Information (Readonly) -->
    <h4 class="font-medium mb-3">
      Maklumat Pegawai/Penolong Amil yang Mengesahkan
    </h4>

    <!-- Original Form Fields (Hidden/Readonly) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormKit
        type="select"
        name="kariah_bermastautin"
        label="Kariah"
        :options="kariahOptions"
        placeholder="Pilih kariah"
        v-model="formData.pengesahan.kariah_bermastautin"
        disabled
      />

      <FormKit
        type="text"
        name="nama_pengesah"
        label="Nama"
        validation="required"
        v-model="formData.pengesahan.nama_pengesah"
        disabled
      />

      <FormKit
        type="text"
        name="jawatan_pengesah"
        label="Jawatan"
        validation="required"
        v-model="formData.pengesahan.jawatan_pengesah"
        disabled
      />

      <FormKit
        type="number"
        name="no_telefon_pengesah"
        label="No Telefon"
        validation="required"
        v-model="formData.pengesahan.no_telefon_pengesah"
        disabled
      />

      <FormKit
        type="date"
        name="tarikh_pengesahan_permastautin"
        label="Tarikh Pengesahan"
        validation="required"
        v-model="formData.pengesahan.tarikh_pengesahan_permastautin"
        disabled
      />

      <!-- Document Information (Readonly) -->
      <div class="mb-6">
        <h4 class="font-medium mb-3">Dokumen yang Dimuat Naik</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="(doc, index) in uploadedDocuments"
            :key="index"
            class="p-4 border rounded-lg flex items-center justify-between bg-white"
          >
            <div>
              <p class="font-medium">{{ doc.name }}</p>
              <p class="text-sm text-gray-500">{{ doc.type }}</p>
              <p class="text-xs text-gray-400">{{ doc.size }}</p>
            </div>
            <rs-button
              variant="primary-outline"
              size="sm"
              @click="$emit('download-document', doc)"
            >
              <Icon name="mdi:download" class="mr-1" />
              Muat Turun
            </rs-button>
          </div>
        </div>
      </div>

      <div class="md:col-span-2">
        <FormKit
          type="file"
          name="surat_pengesahan_bermastautin"
          label="Muat naik dokumen pengesahan bermastautin"
          accept=".pdf,.jpg,.jpeg,.png"
          v-model="formData.pengesahan.surat_pengesahan_bermastautin"
          help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
          validation="required"
          validation-messages="{
            required: 'Dokumen pengesahan bermastautin adalah wajib'
          }"
        />
      </div>
    </div>

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
          >Pegawai Pendaftar</rs-button
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
  },
  kariahOptions: {
    type: Array,
    default: () => []
  },
  uploadedDocuments: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['next-step', 'prev-step', 'save-step', 'download-document'])
</script>

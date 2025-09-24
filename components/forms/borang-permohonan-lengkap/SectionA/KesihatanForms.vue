<template>
  <FormKit
    type="form"
    @submit="$emit('next-step')"
    :actions="false"
    id="sectionA6">
    <h3 class="text-lg font-semibold mb-4">6. Maklumat Kesihatan</h3>

    <!-- Tahap Kesihatan -->
    <div class="mb-6">
      <FormKit
        type="select"
        name="tahap_kesihatan"
        label="Tahap Kesihatan "
        :options="['Sihat', 'Sakit Kronik', 'OKU', 'Uzur']"
        validation="required"
        v-model="formData.tahap_kesihatan"
        placeholder="Pilih tahap kesihatan"
        help="Pilih status kesihatan semasa"
        :disabled="readOnly" />
    </div>

    <!-- A. Jika Tahap Kesihatan = "Sakit Kronik" -->
    <div v-if="formData.tahap_kesihatan === 'Sakit Kronik'" class="mb-8">
      <h5 class="text-lg font-semibold mb-4">Maklumat Sakit Kronik</h5>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Keadaan Kesihatan -->
        <FormKit
          type="select"
          name="keadaan_kesihatan_sakit"
          label="Keadaan Kesihatan "
          :options="['Terlantar', 'Tidak Terlantar']"
          validation="required"
          v-model="formData.keadaan_kesihatan_sakit"
          placeholder="Pilih keadaan kesihatan"
          help="Nyatakan keupayaan fizikal harian"
          :disabled="readOnly" />

        <!-- Kos Penjagaan -->
        <FormKit
          type="select"
          name="kos_penjagaan_sakit"
          label="Kos Penjagaan "
          :options="['Berbayar', 'Tidak Berbayar']"
          validation="required"
          v-model="formData.kos_penjagaan_sakit"
          placeholder="Pilih kos penjagaan"
          help="Adakah kos penjagaan bulanan dibayar?"
          :disabled="readOnly" />
      </div>

      <!-- Jumlah Perbelanjaan Bulanan -->
      <div class="mt-4">
        <FormKit
          type="text"
          name="perbelanjaan_bulanan_sakit"
          label="Jumlah Perbelanjaan Bulanan (RM) "
          validation="required"
          placeholder="9999.99"
          v-model="formData.perbelanjaan_bulanan_sakit"
          help="Format: 9999.99"
          :disabled="readOnly" />
      </div>
    </div>

    <!-- B. Jika Tahap Kesihatan = "OKU" -->
    <div v-if="formData.tahap_kesihatan === 'OKU'" class="mb-8">
      <h5 class="text-lg font-semibold mb-4">Maklumat OKU</h5>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Kesempurnaan Fizikal -->
        <FormKit
          type="select"
          name="kesempurnaan_fizikal"
          label="Kesempurnaan Fizikal "
          :options="['Sempurna', 'Cacat Mental', 'Cacat Fizikal']"
          validation="required"
          v-model="formData.kesempurnaan_fizikal"
          placeholder="Pilih kesempurnaan fizikal"
          help="Pilih kategori OKU"
          :disabled="readOnly" />

        <!-- Sebab Kecacatan -->
        <FormKit
          type="select"
          name="sebab_kecacatan"
          label="Sebab Kecacatan (Jika Cacat) "
          :options="['Sejak Lahir', 'Musibah']"
          validation="required"
          v-model="formData.sebab_kecacatan"
          placeholder="Pilih sebab kecacatan"
          help="Jika cacat, punca kecacatan"
          :disabled="readOnly" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <!-- Tahap Kecacatan -->
        <FormKit
          type="select"
          name="tahap_kecacatan"
          label="Tahap Kecacatan "
          :options="['Terlantar', 'Tidak Terlantar']"
          validation="required"
          v-model="formData.tahap_kecacatan"
          placeholder="Pilih tahap kecacatan"
          help="Tahap kebergantungan"
          :disabled="readOnly" />

        <!-- Jumlah Perbelanjaan Bulanan -->
        <FormKit
          type="text"
          name="perbelanjaan_bulanan_oku"
          label="Jumlah Perbelanjaan Bulanan (RM) "
          validation="required"
          placeholder="9999.99"
          v-model="formData.perbelanjaan_bulanan_oku"
          help="Format: 9999.99"
          :disabled="readOnly" />
      </div>
    </div>

    <!-- C. Jika Tahap Kesihatan = "Uzur" -->
    <div v-if="formData.tahap_kesihatan === 'Uzur'" class="mb-8">
      <h5 class="text-lg font-semibold mb-4">Maklumat Uzur</h5>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Keadaan Kesihatan -->
        <FormKit
          type="select"
          name="keadaan_kesihatan_uzur"
          label="Keadaan Kesihatan "
          :options="['Terlantar', 'Tidak Terlantar']"
          validation="required"
          v-model="formData.keadaan_kesihatan_uzur"
          placeholder="Pilih keadaan kesihatan"
          help="Nyatakan keupayaan fizikal harian"
          :disabled="readOnly" />

        <!-- Kos Penjagaan -->
        <FormKit
          type="select"
          name="kos_penjagaan_uzur"
          label="Kos Penjagaan "
          :options="['Berbayar', 'Tidak Berbayar']"
          validation="required"
          v-model="formData.kos_penjagaan_uzur"
          placeholder="Pilih kos penjagaan"
          help="Adakah kos penjagaan bulanan dibayar?"
          :disabled="readOnly" />
      </div>

      <!-- Jumlah Perbelanjaan Bulanan -->
      <div class="mt-4">
        <FormKit
          type="text"
          name="perbelanjaan_bulanan_uzur"
          label="Jumlah Perbelanjaan Bulanan (RM) "
          validation="required"
          placeholder="9999.99"
          v-model="formData.perbelanjaan_bulanan_uzur"
          help="Format: 9999.99"
          :disabled="readOnly" />
      </div>
    </div>

    <!-- D. Upload Dokumen Sokongan (Jika Tahap Kesihatan ≠ "Sihat") -->
    <div
      v-if="formData.tahap_kesihatan && formData.tahap_kesihatan !== 'Sihat'"
      class="mb-6">
      <h5 class="text-lg font-semibold mb-4">Dokumen Sokongan</h5>

      <FormKit
        type="file"
        name="dokumen_sokongan_kesihatan"
        label="Upload Dokumen Sokongan Berkaitan Kesihatan "
        accept=".pdf,.jpg,.jpeg,.png"
        multiple="true"
        help="Format yang dibenarkan: PDF, JPG, JPEG, PNG. Saiz maksimum: 5MB"
        validation="required"
        v-model="formData.dokumen_sokongan_kesihatan"
        :disabled="readOnly" />
    </div>

    <div class="flex justify-between gap-3 mt-6" v-if="showFooterButtons">
      <rs-button
        type="button"
        variant="primary-outline"
        @click="$emit('prev-step')"
        :disabled="readOnly"
        >Kembali</rs-button
      >
      <div class="flex gap-3">
        <rs-button
          type="button"
          variant="secondary"
          @click="$emit('save-step')"
          :disabled="readOnly"
          >Simpan</rs-button
        >
        <rs-button
          type="button"
          variant="primary"
          @click="$emit('next-step')"
          :disabled="readOnly"
          >Maklumat Kemahiran</rs-button
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
    required: true,
  },
  showFooterButtons: {
    type: Boolean,
    default: true,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(["next-step", "prev-step", "save-step"]);
</script>

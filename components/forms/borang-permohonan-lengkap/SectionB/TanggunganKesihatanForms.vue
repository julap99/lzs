<template>
  <FormKit
    type="form"
    @submit="$emit('next-step')"
    :actions="false"
    id="sectionB5"
  >
    <!-- V. Maklumat Kesihatan Tanggungan -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-4">5. Maklumat Kesihatan</h3>

      <!-- Tahap Kesihatan -->
      <div class="mb-6">
        <FormKit
          type="select"
          name="tahap_kesihatan_tanggungan"
          label="Tahap Kesihatan "
          :options="['Sihat', 'Sakit Kronik', 'OKU', 'Uzur']"
          validation="required"
          :disabled="readOnly"
          v-model="getCurrentTanggungan().tahap_kesihatan_tanggungan"
          placeholder="Pilih tahap kesihatan"
          help="Pilih status kesihatan tanggungan"
        />
      </div>

      <!-- A. Jika Tahap Kesihatan = "Sakit Kronik" -->
      <div
        v-if="
          getCurrentTanggungan().tahap_kesihatan_tanggungan ===
          'Sakit Kronik'
        "
        class="mb-8"
      >
        <h5 class="text-lg font-semibold mb-4">Maklumat Sakit Kronik</h5>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Keadaan Kesihatan -->
          <FormKit
            type="select"
            name="keadaan_kesihatan_sakit_tanggungan"
            label="Keadaan Kesihatan "
            :options="['Terlantar', 'Tidak Terlantar']"
            validation="required"
            :disabled="readOnly"
            v-model="
              getCurrentTanggungan().keadaan_kesihatan_sakit_tanggungan
            "
            placeholder="Pilih keadaan kesihatan"
            help="Nyatakan keupayaan fizikal harian"
          />

          <!-- Kos Penjagaan -->
          <FormKit
            type="select"
            name="kos_penjagaan_sakit_tanggungan"
            label="Kos Penjagaan "
            :options="['Berbayar', 'Tidak Berbayar']"
            validation="required"
            v-model="
              getCurrentTanggungan().kos_penjagaan_sakit_tanggungan
            "
            placeholder="Pilih kos penjagaan"
            help="Adakah kos penjagaan bulanan dibayar?"
          />
        </div>

        <!-- Jumlah Perbelanjaan Bulanan -->
        <div class="mt-4">
          <FormKit
            type="text"
            name="perbelanjaan_bulanan_sakit_tanggungan"
            label="Jumlah Perbelanjaan Bulanan (RM) "
            validation="required"
            placeholder="9999.99"
            v-model="
              getCurrentTanggungan().perbelanjaan_bulanan_sakit_tanggungan
            "
            help="Format: 9999.99"
          />
        </div>
      </div>

      <!-- B. Jika Tahap Kesihatan = "OKU" -->
      <div
        v-if="getCurrentTanggungan().tahap_kesihatan_tanggungan === 'OKU'"
        class="mb-8"
      >
        <h5 class="text-lg font-semibold mb-4">Maklumat OKU</h5>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Kesempurnaan Fizikal -->
          <FormKit
            type="select"
            name="kesempurnaan_fizikal_tanggungan"
            label="Kesempurnaan Fizikal "
            :options="['Sempurna', 'Cacat Mental', 'Cacat Fizikal']"
            validation="required"
            v-model="
              getCurrentTanggungan().kesempurnaan_fizikal_tanggungan
            "
            placeholder="Pilih kesempurnaan fizikal"
            help="Pilih kategori OKU"
          />

          <!-- Sebab Kecacatan -->
          <FormKit
            type="select"
            name="sebab_kecacatan_tanggungan"
            label="Sebab Kecacatan (Jika Cacat) "
            :options="['Sejak Lahir', 'Musibah']"
            validation="required"
            v-model="getCurrentTanggungan().sebab_kecacatan_tanggungan"
            placeholder="Pilih sebab kecacatan"
            help="Jika cacat, punca kecacatan"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <!-- Tahap Kecacatan -->
          <FormKit
            type="select"
            name="tahap_kecacatan_tanggungan"
            label="Tahap Kecacatan "
            :options="['Terlantar', 'Tidak Terlantar']"
            validation="required"
            v-model="getCurrentTanggungan().tahap_kecacatan_tanggungan"
            placeholder="Pilih tahap kecacatan"
            help="Tahap kebergantungan"
          />

          <!-- Jumlah Perbelanjaan Bulanan -->
          <FormKit
            type="text"
            name="perbelanjaan_bulanan_oku_tanggungan"
            label="Jumlah Perbelanjaan Bulanan (RM) "
            validation="required"
            placeholder="9999.99"
            v-model="
              getCurrentTanggungan().perbelanjaan_bulanan_oku_tanggungan
            "
            help="Format: 9999.99"
          />
        </div>
      </div>

      <!-- C. Jika Tahap Kesihatan = "Uzur" -->
      <div
        v-if="
          getCurrentTanggungan().tahap_kesihatan_tanggungan === 'Uzur'
        "
        class="mb-8"
      >
        <h5 class="text-lg font-semibold mb-4">Maklumat Uzur</h5>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Keadaan Kesihatan -->
          <FormKit
            type="select"
            name="keadaan_kesihatan_uzur_tanggungan"
            label="Keadaan Kesihatan "
            :options="['Terlantar', 'Tidak Terlantar']"
            validation="required"
            v-model="
              getCurrentTanggungan().keadaan_kesihatan_uzur_tanggungan
            "
            placeholder="Pilih keadaan kesihatan"
            help="Nyatakan keupayaan fizikal harian"
          />

          <!-- Kos Penjagaan -->
          <FormKit
            type="select"
            name="kos_penjagaan_uzur_tanggungan"
            label="Kos Penjagaan "
            :options="['Berbayar', 'Tidak Berbayar']"
            validation="required"
            v-model="getCurrentTanggungan().kos_penjagaan_uzur_tanggungan"
            placeholder="Pilih kos penjagaan"
            help="Adakah kos penjagaan bulanan dibayar?"
          />
        </div>

        <!-- Jumlah Perbelanjaan Bulanan -->
        <div class="mt-4">
          <FormKit
            type="text"
            name="perbelanjaan_bulanan_uzur_tanggungan"
            label="Jumlah Perbelanjaan Bulanan (RM) "
            validation="required"
            placeholder="9999.99"
            v-model="
              getCurrentTanggungan().perbelanjaan_bulanan_uzur_tanggungan
            "
            help="Format: 9999.99"
          />
        </div>
      </div>

      <!-- D. Upload Dokumen Sokongan (Jika Tahap Kesihatan ≠ "Sihat") -->
      <div
        v-if="
          getCurrentTanggungan().tahap_kesihatan_tanggungan &&
          getCurrentTanggungan().tahap_kesihatan_tanggungan !== 'Sihat'
        "
        class="mb-6"
      >
        <h5 class="text-lg font-semibold mb-4">Dokumen Sokongan</h5>

        <FormKit
          type="file"
          name="dokumen_sokongan_kesihatan"
          label="Upload Dokumen Sokongan Berkaitan Kesihatan "
          accept=".pdf,.jpg,.jpeg,.png"
          multiple="true"
          help="Format yang dibenarkan: PDF, JPG, JPEG, PNG. Saiz maksimum: 5MB"
          validation="required"
          v-model="getCurrentTanggungan().dokumen_sokongan_kesihatan"
        />
      </div>
    </div>

    <div v-if="showFooterButtons" class="flex justify-between gap-3 mt-6">
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
          >{{ nextLabel || 'Maklumat Kemahiran' }}</rs-button
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
  nextLabel: {
    type: String,
    default: ''
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
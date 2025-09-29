<template>
  <FormKit
    type="form"
    @submit="$emit('next-step')"
    :actions="false"
    id="sectionA9">
    <h3 class="text-lg font-semibold mb-4">8. Maklumat Pinjaman Harta</h3>

    <div class="mb-6">
      <h4 class="text-md font-medium mb-3">Maklumat Pinjaman</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Row 1: Jenis Pinjaman | Nama Institusi / Individu -->
        <FormKit
          type="select"
          name="jenis_pinjaman"
          label="Jenis Pinjaman"
          :options="jenisPinjamanOptions"
          placeholder="Sila Pilih Jenis Pinjaman"
          v-model="formData.jenis_pinjaman"
          :disabled="readOnly" />

        <FormKit
          type="text"
          name="nama_institusi_pemberi_pinjaman"
          label="Nama Institusi / Individu Pemberi Pinjaman"
          placeholder="Sila masukkan nama institusi atau individu"
          v-model="formData.nama_institusi_pemberi_pinjaman"
          :disabled="readOnly" />

        <!-- Row 2: Tarikh Mula | Tarikh Akhir -->
        <FormKit
          type="date"
          name="tahun_mula_pinjaman"
          label="Tarikh Mula Pinjaman"
          validation="required"
          v-model="formData.tahun_mula_pinjaman"
          :validation-messages="{
            required: 'Tahun mula pinjaman adalah wajib',
          }"
          :disabled="readOnly" />

        <FormKit
          type="date"
          name="tahun_akhir_pinjaman"
          label="Tarikh Akhir Pinjaman"
          validation="required"
          v-model="formData.tahun_akhir_pinjaman"
          :validation-messages="{
            required: 'Tahun akhir pinjaman adalah wajib',
          }"
          :disabled="readOnly" />

        <!-- Row 3: Amaun Bulanan | Jumlah Keseluruhan -->
        <FormKit
          type="number"
          name="amaun_bayaran_bulanan"
          label="Amaun Bayaran Bulanan (RM)"
          step="0.01"
          min="0"
          placeholder="0.00"
          v-model="formData.amaun_bayaran_bulanan"
          :disabled="readOnly" />

        <FormKit
          type="number"
          name="jumlah_keseluruhan_perbelanjaan"
          label="Jumlah Keseluruhan Pinjaman (RM)"
          step="0.01"
          min="0"
          validation="required"
          placeholder="0.00"
          v-model="formData.jumlah_keseluruhan_perbelanjaan"
          :validation-messages="{
            required: 'Jumlah keseluruhan pinjaman adalah wajib',
          }"
          :disabled="readOnly" />

        <!-- Row 4: Dokumen (full width) -->
        <div class="md:col-span-2">
          <FormKit
            type="file"
            name="dokumen_perjanjian_pinjaman"
            label="Dokumen Perjanjian Pinjaman"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
            validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
            v-model="formData.dokumen_perjanjian_pinjaman"
            :validation-messages="{
              required: 'Dokumen perjanjian pinjaman adalah wajib',
              max: 'Saiz fail tidak boleh melebihi 5MB',
              mime: 'Format fail tidak dibenarkan',
            }"
            :disabled="readOnly" />
        </div>
      </div>
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
          >Maklumat Pemilikan Aset</rs-button
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

// Loan type options - moved from parent component
const jenisPinjamanOptions = [
  { label: "Pinjaman Peribadi", value: "pinjaman-peribadi" },
  { label: "Pinjaman Kereta", value: "pinjaman-kereta" },
  { label: "Pinjaman Rumah", value: "pinjaman-rumah" },
  { label: "Pinjaman Pendidikan", value: "pinjaman-pendidikan" },
  { label: "Pinjaman Perniagaan", value: "pinjaman-perniagaan" },
  { label: "Pinjaman Pertanian", value: "pinjaman-pertanian" },
  { label: "Pinjaman Koperasi", value: "pinjaman-koperasi" },
  { label: "Pinjaman Islamik", value: "pinjaman-islamik" },
];

// Emits
const emit = defineEmits(["next-step", "prev-step", "save-step"]);
</script>

<template>
  <FormKit
    type="form"
    @submit="$emit('next-step')"
    :actions="false"
    id="sectionB11"
  >
    <h3 class="text-lg font-semibold mb-4">Pengesahan Pendapatan</h3>

    <!--Maklumat Penolong Amil yang membuat pengesahan pendapatan -->
    <div class="mb-6">
      <h4 class="font-medium mb-3">
        Maklumat Penolong Amil yang membuat pengesahan pendapatan(pemohon)
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormKit
          type="text"
          name="nama_penolong_amil_pendapatan"
          label="Nama "
          validation="required"
          v-model="formData.pengesahan_pendapatan.nama_penolong_amil"
        />

        <FormKit
          type="text"
          name="jawatan_penolong_amil_pendapatan"
          label="Jawatan"
          validation="required"
          v-model="formData.pengesahan_pendapatan.jawatan_penolong_amil"
        />

        <FormKit
          type="number"
          name="no_telefon_penolong_amil_pendapatan"
          label="No Telefon"
          validation="required"
          v-model="
            formData.pengesahan_pendapatan.no_telefon_penolong_amil
          "
        />

        <FormKit
          type="date"
          name="tarikh_pengesahan_pendapatan"
          label="Tarikh Pengesahan"
          validation="required"
          v-model="
            formData.pengesahan_pendapatan.tarikh_pengesahan_pendapatan
          "
        />

        <FormKit
          type="file"
          name="dokumen_pengesahan_pendapatan"
          label="Dokumen pengesahan yang diupload"
          accept=".pdf,.jpg,.jpeg,.png"
          help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
          validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
          v-model="
            formData.pengesahan_pendapatan.dokumen_pengesahan_pendapatan
          "
        />
      </div>
    </div>

    <!-- Pegawai LZS yang membuat pengesahan pendapatan -->
    <div class="mb-6">
      <h4 class="font-medium mb-3">
        Pegawai LZS perlu memasukkan nama pegawai yang membuat pengesahan
        pendapatan(pendaftar)
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormKit
          type="text"
          name="nama_pegawai_lzs_pendapatan"
          label="Nama"
          validation="required"
          v-model="formData.pengesahan_pendapatan.nama_pegawai_lzs"
        />

        <FormKit
          type="text"
          name="jawatan_pegawai_lzs_pendapatan"
          label="Jawatan"
          validation="required"
          v-model="formData.pengesahan_pendapatan.jawatan_pegawai_lzs"
        />

        <FormKit
          type="number"
          name="no_telefon_pegawai_lzs_pendapatan"
          label="No Telefon"
          validation="required"
          v-model="formData.pengesahan_pendapatan.no_telefon_pegawai_lzs"
        />

        <FormKit
          type="date"
          name="tarikh_pengesahan_pegawai_lzs_pendapatan"
          label="Tarikh Pengesahan"
          validation="required"
          v-model="
            formData.pengesahan_pendapatan.tarikh_pengesahan_pegawai_lzs
          "
        />

        <FormKit
          type="file"
          name="dokumen_pengesahan_pegawai_lzs_pendapatan"
          label="Upload Dokumen pengesahan"
          accept=".pdf,.jpg,.jpeg,.png"
          help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
          validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
          v-model="
            formData.pengesahan_pendapatan.dokumen_pengesahan_pegawai_lzs
          "
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
          >Pengesahan Bermastautin</rs-button
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

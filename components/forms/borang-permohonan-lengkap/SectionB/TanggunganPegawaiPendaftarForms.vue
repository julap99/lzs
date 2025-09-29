<template>
  <FormKit
    type="form"
    @submit="$emit('submit-form')"
    :actions="false"
    id="sectionB13"
  >
    <h3 class="text-lg font-semibold mb-4">Maklumat Pegawai Pendaftar</h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormKit
        type="text"
        name="nama_penolong_amil"
        label="Nama "
        value="Ahmad bin Abi"
        validation="required"
        disabled
      />

      <FormKit
        type="text"
        name="jenis_permohonan"
        label="Jenis Permohonan"
        value="Kemaskini"
        validation="required"
        disabled
      />
      <FormKit
        type="text"
        name="kategori"
        label="Kategori"
        value="kaunter"
        disabled
      />

      <FormKit
        type="date"
        name="tarikh_proses"
        label="Tarikh Proses"
        validation="required"
        :value="new Date().toISOString().split('T')[0]"
        disabled
      />
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
        <rs-button type="button" variant="primary" @click="$emit('submit-form')"
          >Hantar Permohonan</rs-button
        >
      </div>
    </div>
  </FormKit>
</template>

<script setup>
// Props - none needed for this simple step

// Emits
const emit = defineEmits(['prev-step', 'save-step', 'submit-form'])
</script>

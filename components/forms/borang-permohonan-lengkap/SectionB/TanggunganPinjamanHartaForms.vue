<template>
  <FormKit
    type="form"
    @submit="$emit('next-step')"
    :actions="false"
    id="sectionB9"
  >
    <h3 class="text-lg font-semibold mb-4">9. Maklumat Pinjaman Harta</h3>

    <div class="mb-6">
      <h4 class="text-md font-medium mb-3">Maklumat Pinjaman</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormKit
          type="text"
          name="nama_institusi_pemberi_pinjaman_tanggungan"
          label="Nama Institusi / Individu Pemberi Pinjaman"
          placeholder="Sila masukkan nama institusi atau individu"
          v-model="getCurrentTanggungan().nama_institusi_pemberi_pinjaman"
        />

        <div
          v-if="getCurrentTanggungan().nama_institusi_pemberi_pinjaman"
          class="md:col-span-2"
        >
          <h4 class="text-md font-medium mb-3">Maklumat Pinjaman</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="select"
              name="jenis_pinjaman_tanggungan"
              label="Jenis Pinjaman"
              :options="jenisPinjamanOptions"
              placeholder="Sila Pilih Jenis Pinjaman"
              v-model="getCurrentTanggungan().jenis_pinjaman"
            />

            <FormKit
              type="number"
              name="amaun_bayaran_bulanan_tanggungan"
              label="Amaun Bayaran Bulanan (RM)"
              step="0.01"
              min="0"
              v-model="getCurrentTanggungan().amaun_bayaran_bulanan"
            />

            <FormKit
              type="number"
              name="jumlah_keseluruhan_perbelanjaan_tanggungan"
              label="Jumlah Keseluruhan Pinjaman (RM)"
              step="0.01"
              min="0"
              v-model="
                getCurrentTanggungan().jumlah_keseluruhan_perbelanjaan
              "
            />

            <FormKit
              type="date"
              name="tahun_mula_pinjaman_tanggungan"
              label="Tahun Mula Pinjaman"
              v-model="getCurrentTanggungan().tahun_mula_pinjaman"
            />

            <FormKit
              type="date"
              name="tahun_akhir_pinjaman_tanggungan"
              label="Tahun Akhir Pinjaman"
              v-model="getCurrentTanggungan().tahun_akhir_pinjaman"
            />

            <div class="md:col-span-2">
              <FormKit
                type="file"
                name="dokumen_perjanjian_pinjaman_tanggungan"
                label="Dokumen Perjanjian Pinjaman"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                validation="max:5|mime:application/pdf,image/jpeg,image/png"
                v-model="
                  getCurrentTanggungan().dokumen_perjanjian_pinjaman
                "
              />
            </div>
          </div>
        </div>
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
          >Pengesahan</rs-button
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
  }
})

// Emits
const emit = defineEmits(['next-step', 'prev-step', 'save-step'])

// Local options: jenis pinjaman
const jenisPinjamanOptions = [
  { label: 'Pinjaman Rumah', value: 'Pinjaman Rumah' },
  { label: 'Pinjaman Kereta', value: 'Pinjaman Kereta' },
  { label: 'Pinjaman Peribadi', value: 'Pinjaman Peribadi' },
  { label: 'Sewa Beli', value: 'Sewa Beli' },
  { label: 'Pinjaman Pendidikan', value: 'Pinjaman Pendidikan' },
  { label: 'Lain-lain', value: 'Lain-lain' }
]
</script>

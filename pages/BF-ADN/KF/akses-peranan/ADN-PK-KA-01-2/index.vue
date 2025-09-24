<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Icon name="ic:outline-add-box" class="mr-2" />
            Tambah Akses Peranan
          </div>
        </div>
      </template>

      <template #body>
        <form @submit.prevent="onSubmit" class="space-y-6">

          <!-- Status Tugasan -->
          <div>
            <label class="block font-semibold mb-1">Status Tugasan</label>
            <FormKit
              type="select"
              v-model="form.statusTugasan"
              :options="statusTugasanOptions"
              placeholder="-- Pilih Status --"
              validation="required"
            />
          </div>

          <!-- Mod Akses -->
          <div>
            <label class="block font-semibold mb-1">Mod Akses</label>
            <FormKit
              type="select"
              v-model="form.modAkses"
              :options="modAksesOptions"
              placeholder="-- Pilih Mod Akses --"
              validation="required"
            />
          </div>

          <!-- Senarai Peranan (bila Kumpulan) -->
          <div v-if="form.modAkses === 'group'">
            <label class="block font-semibold mb-1">Senarai Peranan</label>
            <FormKit
              type="select"
              v-model="form.senaraiPeranan"
              :options="senaraiPerananOptions"
              :multiple="true"
              placeholder="Contoh: KOAD, EPOAD, SSU"
              validation="required"
            />
          </div>

          <!-- Senarai Pegawai (bila Per Individu) -->
          <div v-else>
            <label class="block font-semibold mb-1">Senarai Pegawai</label>
            <FormKit
              type="select"
              v-model="form.senaraiPegawai"
              :options="senaraiPegawaiOptions"
              :multiple="true"
              placeholder="Contoh: Ahmad Zaki, Noraini Musa"
              validation="required"
            />
          </div>

          <!-- Catatan Konfigurasi -->
          <div>
            <label class="block font-semibold mb-1">Catatan Konfigurasi</label>
            <textarea
              v-model="form.catatanKonfigurasi"
              rows="4"
              class="w-full border rounded px-3 py-2"
              placeholder="Contoh: Ditambah bagi membolehkan tugasan diberi kepada EPOAD kerana perubahan skop."
            />
          </div>

          <!-- Tarikh + Status -->
          <div class="grid grid-cols-1 md:grid-cols-2 md:gap-8">
            <div>
              <label class="block font-semibold mb-1">Tarikh Mula Kuasa</label>
              <FormKit
                type="date"
                v-model="form.tarikhMulaKuasa"
                validation="required"
              />
            </div>

            <div>
              <label class="block font-semibold mb-1">Status Konfigurasi</label>
              <FormKit
                type="select"
                v-model="form.statusKonfigurasi"
                :options="statusKonfigurasiOptions"
                placeholder="Pilih Status"
                validation="required"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3 pt-2">
            <rs-button type="button" variant="secondary" @click="onReset">
              Set Semula
            </rs-button>
            <rs-button type="submit" variant="primary">
              Hantar untuk Kelulusan
            </rs-button>
          </div>

        </form>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const breadcrumb = [
  { name: 'Mengurus Konfigurasi', type: 'link', path: '/BF-ADN/KF' },
  { name: 'Tambah Akses Peranan', type: 'text', path: '/BF-ADN/KF/akses-peranan/ADN-PK-KA-01-2' },
]

/* Options */
const statusTugasanOptions = [
  'Siasatan Ringkas',
  'Siasatan Lapangan',
  'Pengesahan Penutupan Aduan',
  'Quick Assessment',
  'Pengesahan Pemastautin',
].map(v => ({ label: v, value: v }))

const modAksesOptions = [
  { label: 'Kumpulan', value: 'group' },
  { label: 'Per Individu', value: 'person' },
]

const senaraiPerananOptions = ['KOAD', 'EPOAD', 'SSU', 'EOAD Daerah', 'Tech Team']
  .map(v => ({ label: v, value: v }))

const senaraiPegawaiOptions = ['Ahmad Zaki', 'Noraini Musa', 'Syafiq Rahman', 'Jamilah Liza', 'Hafiz Zahar']
  .map(v => ({ label: v, value: v }))

const statusKonfigurasiOptions = [
  { label: 'Aktif', value: 'Aktif' },
  { label: 'Tidak Aktif', value: 'Tidak Aktif' },
]

/* Form state */
const form = reactive({
  statusTugasan: '',
  modAkses: 'group',
  senaraiPeranan: [],
  senaraiPegawai: [],
  catatanKonfigurasi: '',
  tarikhMulaKuasa: '',
  statusKonfigurasi: 'Aktif',
})

/* Bila mod tukar, kosongkan list dan fokus pada list yang relevan */
watch(() => form.modAkses, (val) => {
  form.senaraiPeranan = []
  form.senaraiPegawai = []
})

function onReset() {
  form.statusTugasan = ''
  form.modAkses = 'group'
  form.senaraiPeranan = []
  form.senaraiPegawai = []
  form.catatanKonfigurasi = ''
  form.tarikhMulaKuasa = ''
  form.statusKonfigurasi = 'Aktif'
}

function onSubmit() {
  const payload = {
    statusTugasan: form.statusTugasan,
    modAkses: form.modAkses,
    senarai: form.modAkses === 'group' ? form.senaraiPeranan : form.senaraiPegawai,
    catatanKonfigurasi: form.catatanKonfigurasi,
    tarikhMulaKuasa: form.tarikhMulaKuasa,
    statusKonfigurasi: form.statusKonfigurasi,
    statusPermohonan: 'Menunggu Kelulusan',
  }
  // TODO: panggil API simpan
  console.log('Tambah Akses Peranan:', payload)
}
</script>

<style scoped>
/* optional: kekalkan spacing kemas */
</style>

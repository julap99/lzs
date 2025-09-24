<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <h1 class="text-2xl font-semibold">Kemaskini Akses Peranan</h1>
      </template>

      <template #body>
        <form class="space-y-6" @submit.prevent="onSubmit">
          <!-- Status Tugasan -->
          <div>
            <label class="block font-medium mb-1">Status Tugasan</label>
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
            <label class="block font-medium mb-1">Mod Akses</label>
            <FormKit
              type="select"
              v-model="form.modAkses"
              :options="modAksesOptions"
              placeholder="-- Pilih Mod Akses --"
              validation="required"
            />
          </div>

          <!-- Senarai Peranan (Kumpulan) -->
          <div v-if="form.modAkses === 'group'">
            <label class="block font-medium mb-1">Senarai Peranan</label>
            <FormKit
              type="select"
              v-model="form.senaraiPeranan"
              :options="senaraiPerananOptions"
              :multiple="true"
              placeholder="Pilih peranan"
              validation="required"
            />
          </div>

          <!-- Senarai Pegawai (Per Individu) -->
          <div v-else>
            <label class="block font-medium mb-5">Senarai Pegawai</label>
            <FormKit
              type="select"
              v-model="form.senaraiIndividu"
              :options="senaraiIndividuOptions"
              :multiple="true"
              placeholder="Pilih pegawai"
              validation="required"
            />
          </div>

          <!-- Tarikh Berkuatkuasa (Calendar) -->
          <div>
            <label class="block font-medium mb-1">Tarikh Berkuatkuasa</label>
            <FormKit
              type="date"
              v-model="form.tarikhBerkuatkuasa"
              validation="required"
            />
          </div>

          <!-- Status Konfigurasi (Select + Badge preview) -->
          <div>
            <label class="block font-medium mb-1">Status Konfigurasi</label>
            <div class="flex items-center gap-3">
              <FormKit
                type="select"
                v-model="form.statusKonfigurasi"
                :options="statusKonfigurasiOptions"
                validation="required"
              />
              <rs-badge :variant="form.statusKonfigurasi === 'Aktif' ? 'success' : 'danger'">
                {{ form.statusKonfigurasi || '—' }}
              </rs-badge>
            </div>
          </div>

          <!-- Catatan Kemaskini -->
          <div>
            <label class="block font-medium mb-1">Catatan Kemaskini</label>
            <textarea
              v-model="form.catatan"
              rows="3"
              class="w-full border rounded p-2"
              placeholder="Contoh: Tambah akses kepada individu baru kerana pertambahan kes."
            />
          </div>

          <div class="flex justify-end">
            <rs-button type="submit" variant="primary" class="whitespace-nowrap">
              Kemaskini Konfigurasi
            </rs-button>
          </div>
        </form>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

definePageMeta({
  title: 'Kemaskini Akses Peranan',
})

const breadcrumb = [
  { name: 'Mengurus Konfigurasi', type: 'link', path: '/BF-ADN/KF' },
  { name: 'Senarai Akses Peranan', type: 'link', path: '/BF-ADN/KF/akses-peranan' },
  { name: 'Butiran Akses Peranan', type: 'link', path: '/BF-ADN/KF/akses-peranan/ADN-PK-KA-01-3' },
  { name: 'Kemaskini Akses Peranan', type: 'text', path: '/BF-ADN/KF/akses-peranan/ADN-PK-KA-01-4' },
]

/** ===== Mock sumber data ikut ID ===== */
const DATA = {
  1: {
    statusTugasan: 'Siasatan Ringkas',
    modAkses: 'group',
    senaraiPeranan: ['KOAD', 'EPOAD', 'SSU'],
    senaraiIndividu: [],
    tarikhBerkuatkuasa: '2025-08-01',
    statusKonfigurasi: 'Aktif',
    catatan: '',
  },
  2: {
    statusTugasan: 'Semakan Bantuan',
    modAkses: 'person',
    senaraiPeranan: [],
    senaraiIndividu: ['Ahmad Zaki', 'Noraini Musa'],
    tarikhBerkuatkuasa: '2025-09-01',
    statusKonfigurasi: 'Tidak Aktif',
    catatan: '',
  },
}

const id = computed(() => Number(route.query.id ?? NaN))

/** Options (FormKit) */
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

const senaraiIndividuOptions = ['Ahmad Zaki', 'Noraini Musa', 'Syafiq Rahman', 'Jamilah Liza', 'Hafiz Zahar']
  .map(v => ({ label: v, value: v }))

const statusKonfigurasiOptions = [
  { label: 'Aktif', value: 'Aktif' },
  { label: 'Tidak Aktif', value: 'Tidak Aktif' },
]

/** Prefill form dari DATA[id] */
const source = DATA[id.value] ?? {
  statusTugasan: '',
  modAkses: 'group',
  senaraiPeranan: [],
  senaraiIndividu: [],
  tarikhBerkuatkuasa: '',
  statusKonfigurasi: 'Aktif',
  catatan: '',
}

const form = reactive({
  statusTugasan: source.statusTugasan,
  modAkses: source.modAkses,
  senaraiPeranan: [...source.senaraiPeranan],
  senaraiIndividu: [...source.senaraiIndividu],
  tarikhBerkuatkuasa: source.tarikhBerkuatkuasa,
  statusKonfigurasi: source.statusKonfigurasi,
  catatan: source.catatan,
})

/** Submit → simpan (mock) kemudian kembali ke butiran id yang sama */
async function onSubmit() {
  // TODO: panggil service API sebenar untuk simpan
  await router.push({
    path: '/BF-ADN/KF/akses-peranan/ADN-PK-KA-01-3',
    query: { id: String(id.value), updated: '1' },
  })
}
</script>

<style scoped>
/* spacing konsisten dengan komponen lain */
</style>

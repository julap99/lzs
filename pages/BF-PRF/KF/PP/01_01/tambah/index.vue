<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <h2 class="text-xl font-semibold">Tambah Proses Profiling</h2>
      </template>

      <template #body>
        <form @submit.prevent="onSubmit" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Kod Proses<span class="text-red-500">*</span></label>
              <input
                v-model.trim="form.kodProses"
                type="text"
                class="rs-input w-full border border-gray-300 rounded"
                placeholder="cth: PP001"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Nama Proses<span class="text-red-500">*</span></label>
              <input
                v-model.trim="form.namaProses"
                type="text"
                class="rs-input w-full border border-gray-300 rounded"
                placeholder="cth: Proses Profiling Utama"
                required
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium mb-1">Keterangan</label>
              <textarea
                v-model.trim="form.keterangan"
                rows="4"
                class="rs-input w-full border border-gray-300 rounded"
                placeholder="Masukkan keterangan ringkas"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Status</label>
              <div class="flex items-center gap-6">
                <label class="inline-flex items-center gap-2">
                  <input type="radio" class="accent-primary" value="Aktif" v-model="form.status" />
                  <span>Aktif</span>
                </label>
                <label class="inline-flex items-center gap-2">
                  <input type="radio" class="accent-primary" value="Tidak Aktif" v-model="form.status" />
                  <span>Tidak Aktif</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Status Data</label>
              <select v-model="form.statusData" class="rs-input w-full border border-gray-300 rounded">
                <option value="Draf">Draf</option>
                <option value="Menunggu Kelulusan">Menunggu Kelulusan</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Tarikh Mula<span class="text-red-500">*</span></label>
              <input
                v-model="form.tarikhMula"
                type="date"
                class="rs-input w-full border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Tarikh Tamat</label>
              <input
                v-model="form.tarikhTamat"
                type="date"
                class="rs-input w-full border border-gray-300 rounded"
              />
            </div>
          </div>

          <div class="flex justify-end items-center pt-2">
            <rs-button btnType="submit" variant="primary">
              <Icon name="mdi:content-save" class="mr-1" /> Simpan
            </rs-button>
          </div>
          <div class="pt-3">
            <rs-button btnType="button" variant="secondary" @click="onCancel">
              <Icon name="mdi:arrow-left" class="mr-1" /> Kembali
            </rs-button>
          </div>
        </form>
      </template>
    </rs-card>
  </div>
  
</template>

<script setup>
import { ref } from 'vue'
function cryptoRandomId() {
  // simple random id; fine for mock
  return 'PP-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

definePageMeta({
  title: 'Tambah Proses Profiling',
})

const breadcrumb = ref([
  { name: 'Profiling', type: 'link', path: '/BF-PRF/KF/HK/admin' },
  { name: 'Konfigurasi Proses Profiling', type: 'link', path: '/BF-PRF/KF/PP/01_01' },
  { name: 'Tambah', type: 'current', path: '/BF-PRF/KF/PP/01_01/tambah' },
])

const todayStr = new Date().toISOString().slice(0, 10)

const form = ref({
  kodProses: '',
  namaProses: '',
  keterangan: '',
  tarikhMula: todayStr,
  statusData: 'Draf',
  status: 'Aktif',
  tarikhTamat: '',
})

const STORAGE_KEY = 'prosesProfiling'

function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.error('Fail to read localStorage', e)
    return []
  }
}

function writeLocal(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch (e) {
    console.error('Fail to write localStorage', e)
  }
}

function onCancel() {
  navigateTo('/BF-PRF/KF/PP/01_01')
}

function onSubmit() {
  // Basic validation
  if (!form.value.kodProses || !form.value.namaProses || !form.value.tarikhMula) {
    alert('Sila lengkapkan medan wajib.')
    return
  }

  const newItem = {
    // Primary fields used by listing
    idPP: form.value.kodProses || cryptoRandomId(),
    kodProses: form.value.kodProses,
    namaProses: form.value.namaProses,
    keterangan: form.value.keterangan,
    tarikhMula: form.value.tarikhMula,
    tarikhTamat: form.value.tarikhTamat,
    statusData: form.value.statusData,
    status: form.value.status,

    // Compatibility fields used elsewhere in list/actions
    idHadKifayah: form.value.kodProses, // reuse as unique id
    namaHadKifayah: form.value.namaProses,
    // keep status field synchronized
  }

  const list = readLocal()

  // If same kodProses exists, replace; otherwise append
  const idx = list.findIndex((x) => (x.idPP || x.kodProses || x.idHadKifayah) === newItem.idPP)
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...newItem }
  } else {
    list.push(newItem)
  }

  writeLocal(list)
  const { $toast } = useNuxtApp()
  if ($toast) {
    $toast.success('Data berjaya disimpan')
  } else {
    alert('Data berjaya disimpan')
  }
  navigateTo('/BF-PRF/KF/PP/01_01')
}
</script>

<style scoped>
/* Rely on global rs-input styles; add minimal spacing helpers if needed */
</style>



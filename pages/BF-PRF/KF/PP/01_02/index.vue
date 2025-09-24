<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <h2 class="text-xl font-semibold">Kemaskini Proses Profiling</h2>
      </template>

      <template #body>
        <div v-if="loading" class="py-6 text-gray-500">Memuatkan...</div>
        <div v-else-if="!record" class="py-6 text-red-600">Rekod tidak ditemui.</div>
        <form v-else @submit.prevent="onSubmit" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium mb-1">Kod Proses<span class="text-red-500">*</span></label>
              <div class="space-y-2">
                <div v-for="(kod, index) in form.kodProsesList" :key="index" class="flex items-center gap-2">
                  <input
                    v-model.trim="kod.value"
                    type="text"
                    class="rs-input flex-1 border border-gray-300 rounded"
                    placeholder="cth: PP001"
                    required
                  />
                  <rs-button
                    v-if="form.kodProsesList.length > 1"
                    type="button"
                    variant="danger"
                    size="sm"
                    @click="removeKodProses(index)"
                    class="!px-2 !py-1"
                  >
                    <Icon name="mdi:delete" size="1rem" />
                  </rs-button>
                </div>
                <rs-button
                  type="button"
                  variant="secondary"
                  size="sm"
                  @click="addKodProses"
                  class="!px-3 !py-1"
                >
                  <Icon name="mdi:plus" class="mr-1" size="1rem" /> Tambah Kod Proses
                </rs-button>
              </div>
            </div>
            <div class="md:col-span-2">
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
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
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

          <div class="flex justify-between items-center pt-4">
            <rs-button btnType="button" variant="secondary" @click="onCancel">
              <Icon name="mdi:arrow-left" class="mr-1" /> Kembali
            </rs-button>
            <rs-button btnType="submit" variant="primary">
              <Icon name="mdi:content-save" class="mr-1" /> Kemaskini
            </rs-button>
          </div>
        </form>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  title: 'Kemaskini Proses Profiling',
})

const breadcrumb = ref([
  { name: 'Profiling', type: 'link', path: '/BF-PRF/KF/HK/admin' },
  { name: 'Konfigurasi Proses Profiling', type: 'link', path: '/BF-PRF/KF/PP/01_01' },
  { name: 'Kemaskini', type: 'current', path: '/BF-PRF/KF/PP/01_02' },
])

const loading = ref(true)
const record = ref(null)
const STORAGE_KEY = 'prosesProfiling'

// Form data
const form = ref({
  kodProsesList: [{ value: '' }], // Array of kod proses
  namaProses: '',
  keterangan: '',
  tarikhMula: '',
  tarikhTamat: '',
  statusData: 'Draf',
  status: 'Aktif',
})

// Default data (same as listing fallback)
const defaultData = [
  {
    idHadKifayah: 'HK001',
    idPP: 'PP-0001',
    kodProses: 'PP001',
    namaProses: 'Proses Profiling Utama',
    namaHadKifayah: 'Ketua Keluarga',
    keterangan: 'Proses profiling untuk ketua keluarga',
    kategori: 'Utama',
    jenisIsiRumah: 'Ketua Keluarga',
    kadarBerbayar: 1215.0,
    kadarPercuma: 780.0,
    tarikhMula: '2025-01-01',
    status: 'Aktif',
    statusData: 'Draf',
  },
]

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

function formatDate(dateString) {
  if (!dateString) return ''
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10) // Return YYYY-MM-DD format for input[type="date"]
}

function addKodProses() {
  form.value.kodProsesList.push({ value: '' })
}

function removeKodProses(index) {
  if (form.value.kodProsesList.length > 1) {
    form.value.kodProsesList.splice(index, 1)
  }
}

function onCancel() {
  navigateTo('/BF-PRF/KF/PP/01_01')
}

function onSubmit() {
  // Basic validation
  const hasValidKodProses = form.value.kodProsesList.some(kod => kod.value.trim())
  if (!hasValidKodProses || !form.value.namaProses || !form.value.tarikhMula) {
    alert('Sila lengkapkan medan wajib.')
    return
  }

  // Get the first valid kod proses as primary
  const primaryKodProses = form.value.kodProsesList.find(kod => kod.value.trim())?.value || form.value.kodProsesList[0].value

  const updatedItem = {
    // Primary fields used by listing
    idPP: primaryKodProses,
    kodProses: primaryKodProses,
    kodProsesList: form.value.kodProsesList.filter(kod => kod.value.trim()), // Store all valid kod proses
    namaProses: form.value.namaProses,
    keterangan: form.value.keterangan,
    tarikhMula: form.value.tarikhMula,
    tarikhTamat: form.value.tarikhTamat,
    statusData: form.value.statusData,
    status: form.value.status,

    // Compatibility fields used elsewhere in list/actions
    idHadKifayah: primaryKodProses, // reuse as unique id
    namaHadKifayah: form.value.namaProses,
  }

  const list = readLocal()
  const merged = [...defaultData, ...list]
  
  // Find the item to update
  const itemIndex = merged.findIndex((x) => x.idPP === record.value.idPP || x.kodProses === record.value.idPP || x.idHadKifayah === record.value.idPP)
  
  if (itemIndex >= 0) {
    // Update the item
    merged[itemIndex] = { ...merged[itemIndex], ...updatedItem }
    
    // Save back to localStorage (only the non-default items)
    const nonDefaultItems = merged.filter(item => !defaultData.some(defaultItem => defaultItem.idHadKifayah === item.idHadKifayah))
    writeLocal(nonDefaultItems)
    
    const { $toast } = useNuxtApp()
    if ($toast) {
      $toast.success('Data berjaya dikemaskini')
    } else {
      alert('Data berjaya dikemaskini')
    }
    navigateTo('/BF-PRF/KF/PP/01_01')
  } else {
    alert('Rekod tidak ditemui untuk dikemaskini.')
  }
}

onMounted(() => {
  const route = useRoute()
  const id = route.query.id
  
  if (!id) {
    loading.value = false
    return
  }
  
  const localList = readLocal()
  const merged = [...defaultData, ...localList]
  const foundRecord = merged.find((x) => x.idPP === id || x.kodProses === id || x.idHadKifayah === id)
  
  if (foundRecord) {
    record.value = foundRecord
    
    // Populate form with existing data
    form.value = {
      kodProsesList: foundRecord.kodProsesList && foundRecord.kodProsesList.length > 0 
        ? foundRecord.kodProsesList.map(kod => ({ value: kod.value || kod }))
        : [{ value: foundRecord.kodProses || foundRecord.idHadKifayah || '' }],
      namaProses: foundRecord.namaProses || foundRecord.namaHadKifayah || '',
      keterangan: foundRecord.keterangan || '',
      tarikhMula: formatDate(foundRecord.tarikhMula),
      tarikhTamat: formatDate(foundRecord.tarikhTamat),
      statusData: foundRecord.statusData || foundRecord.status || 'Draf',
      status: foundRecord.status || 'Aktif',
    }
  }
  
  loading.value = false
})
</script>

<style scoped>
/* Rely on global rs-input styles; add minimal spacing helpers if needed */
</style>

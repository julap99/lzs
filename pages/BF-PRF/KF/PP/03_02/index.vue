<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <h2 class="text-xl font-semibold">Tambah Komponen Profiling</h2>
      </template>

      <template #body>
        <form @submit.prevent="onSubmit" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- 3.6.2 Nama Pendaftaran (Dropdown, Query only) -->
            <div>
              <label class="block text-sm font-medium mb-1">Nama Pendaftaran<span class="text-red-500">*</span></label>
              <FormKit
                v-model="form.namaPendaftaran"
                type="text"
                class="rs-input w-full"
                validation="required"
              />
            </div>

            <!-- 3.6.3 Kod Proses (Text, Query only) -->
            <div>
              <label class="block text-sm font-medium mb-1">Kod Proses<span class="text-red-500">*</span></label>
              <FormKit
                v-model="form.kodProses"
                type="text"
                class="rs-input w-full"
                placeholder="cth: KP001"
                validation="required"
              />
            </div>

            <!-- 3.6.4 ID Menu (Text, Query only) -->
            <div>
              <label class="block text-sm font-medium mb-1">ID Menu<span class="text-red-500">*</span></label>
              <FormKit
                v-model="form.idMenu"
                type="text"
                class="rs-input w-full"
                placeholder="cth: 1"
                validation="required"
              />
            </div>

            <!-- 3.6.5 Tarikh Mula (Date, Query only) -->
            <div>
              <label class="block text-sm font-medium mb-1">Tarikh Mula<span class="text-red-500">*</span></label>
              <FormKit
                v-model="form.tarikhMula"
                type="date"
                class="rs-input w-full"
                validation="required"
              />
            </div>

            <!-- 3.6.6 Status Data (Text, Query only) -->
            <div>
              <label class="block text-sm font-medium mb-1">Status Data<span class="text-red-500">*</span></label>
              <FormKit
                v-model="form.statusData"
                type="select"
                :options="['Draf', 'Menunggu Kelulusan']"
                class="rs-input w-full"
                validation="required"
              />
            </div>

            <!-- Extra (not in 3.6.x but kept): Status & Tarikh Tamat -->
            <div>
              <label class="block text-sm font-medium mb-2">Status</label>
              <FormKit
                v-model="form.status"
                type="radio"
                :options="[
                  { label: 'Aktif', value: 'Aktif' },
                  { label: 'Tidak Aktif', value: 'Tidak Aktif' }
                ]"
                name="status"
                validation="required"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Tarikh Tamat</label>
              <FormKit
                v-model="form.tarikhTamat"
                type="date"
                class="rs-input w-full"
              />
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 w-full">
            <rs-button btnType="button" variant="secondary" @click="onCancel">
              <Icon name="mdi:arrow-left" class="mr-1" /> Kembali
            </rs-button>

            <rs-button btnType="submit" variant="primary">
              <Icon name="mdi:content-save" class="mr-1" /> Simpan
            </rs-button>
          </div>

        </form>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { FormKit } from '@formkit/vue'

function cryptoRandomId() {
  return 'PP-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

definePageMeta({
  title: 'Tambah Komponen Profiling',
})

const breadcrumb = ref([
  { name: 'Profiling', type: 'link', path: '/BF-PRF/KF/HK/admin' },
  { name: 'Konfigurasi Komponen Profiling', type: 'link', path: '/BF-PRF/KF/PP/03_01' },
  { name: 'Tambah', type: 'current', path: '/BF-PRF/KF/PP/03_02' },
])

const todayStr = new Date().toISOString().slice(0, 10)

const form = ref({
  // 3.6.2
  namaPendaftaran: 'Pendaftaran Lengkap',
  // 3.6.3
  kodProses: '',
  // 3.6.4
  idMenu: '1',
  // 3.6.5
  tarikhMula: todayStr,
  // 3.6.6
  statusData: 'Draf',

  // Extra
  status: 'Aktif',
  tarikhTamat: '',
})

// Storage
const STORAGE_KEY = 'prosesKomponen'

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
  navigateTo('/BF-PRF/KF/PP/03_01')
}

function onSubmit() {
  // Validate required fields (3.6.2, 3.6.3, 3.6.4, 3.6.5, 3.6.6)
  if (!form.value.namaPendaftaran || !form.value.kodProses || !form.value.idMenu || !form.value.tarikhMula || !form.value.statusData) {
    alert('Sila lengkapkan medan wajib.')
    return
  }

  // 3.6.1 Id Komponen Profiling (Hidden)
  const idKomponenProfiling = form.value.kodProses?.trim() || cryptoRandomId()

  const newItem = {
    // === Fields expected by the listing ===
    idKomponenProfiling,                 // 3.6.1 (hidden)
    namaPendaftaran: form.value.namaPendaftaran, // 3.6.2
    kodProses: form.value.kodProses,     // 3.6.3
    idMenu: form.value.idMenu,           // 3.6.4
    tarikhMula: form.value.tarikhMula,   // 3.6.5
    statusData: form.value.statusData,   // 3.6.6

    // Optional/extras (kept for future use)
    status: form.value.status,
    tarikhTamat: form.value.tarikhTamat,
  }

  const list = readLocal()

  // De-duplicate by idKomponenProfiling
  const idx = list.findIndex((x) => (x.idKomponenProfiling) === idKomponenProfiling)
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
  navigateTo('/BF-PRF/KF/PP/03_01')
}
</script>

<style scoped>
/* Rely on global rs-input styles */
</style>

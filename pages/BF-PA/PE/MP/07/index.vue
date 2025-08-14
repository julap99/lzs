<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <h2 class="text-xl font-semibold">Kemaskini Nombor Akaun Penolong Amil</h2>
      </template>

      <template #body>
        <!-- Maklumat Peribadi -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormKit type="text" label="Nama Penolong Amil" :value="nama" disabled />
          <FormKit type="text" label="Alamat Terkini" :value="alamat" disabled />
          <FormKit
            type="text"
            label="Nombor Telefon (Mudah Alih)"
            :value="telefon"
            disabled
          />
          <FormKit
            type="select"
            label="Nama Bank"
            :options="senaraiBank"
            :value="namaBank"
            disabled
          />
          <FormKit
            type="text"
            label="Nombor Akaun Bank"
            v-model="noAkaun"
            :validation="`required|length:${getMinDigit(namaBank)}`"
            placeholder="Isikan nombor akaun lengkap"
          />
          <FormKit
            type="file"
            label="Muat Naik Dokumen Sokongan"
            disabled
          />
        </div>

        <!-- Status & Tindakan -->
        <div class="mt-6">
          <FormKit type="text" label="Status Kemaskini" :value="statusKemaskini" disabled />
        </div>

        <div class="flex justify-end mt-6">
          <rs-button
            variant="primary"
            :disabled="!isFormLengkap"
            @click="hantarKemaskini"
          >
            Hantar Kemaskini
          </rs-button>
        </div>

        <!-- Log Tindakan -->
        <div class="mt-10">
          <h3 class="font-semibold mb-2">Log Tindakan</h3>
          <table class="min-w-full divide-y divide-gray-200 text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left">Tarikh</th>
                <th class="px-4 py-2 text-left">Tindakan</th>
                <th class="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in logTindakan" :key="log.tarikh" class="border-t">
                <td class="px-4 py-2">{{ log.tarikh }}</td>
                <td class="px-4 py-2">{{ log.tindakan }}</td>
                <td class="px-4 py-2">{{ log.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const router = useRouter()
const toast = useToast()

// Breadcrumb
const breadcrumb = ref([
  { name: 'Pengurusan Elaun', type: 'link', path: '/BF-PA/PE/MP' },
  { name: 'Kemaskini Maklumat', type: 'current', path: '/BF-PA/PE/MP/07' }
])

// Dummy data
const nama = 'Hasan bin Omar'
const alamat = 'No 10, Jalan Aman, Shah Alam'
const telefon = '012-3456789'
const namaBank = 'Maybank'
const noAkaun = ref('')
const statusKemaskini = ref('Menunggu Sokongan')

// Senarai bank
const senaraiBank = [
  { label: 'Maybank', value: 'Maybank' },
  { label: 'Bank Islam', value: 'Bank Islam' },
  { label: 'CIMB', value: 'CIMB' },
  { label: 'Bank Rakyat', value: 'Bank Rakyat' },
]

// Minimum digit ikut bank
const getMinDigit = (bank) => {
  if (bank === 'Maybank') return 12
  if (bank === 'Bank Islam') return 14
  if (bank === 'CIMB') return 10
  return 10
}

// Semakan form lengkap
const isFormLengkap = computed(() => {
  return noAkaun.value && noAkaun.value.length >= getMinDigit(namaBank)
})

// Dummy log
const logTindakan = ref([
  { tarikh: '2025-07-15 10:30AM', tindakan: 'Sistem hantar notifikasi kepada Penolong Amil', status: 'PERLU DIKEMASKINI SEMULA' },
  { tarikh: '2025-07-30 09:00AM', tindakan: 'Pengguna akses skrin kemaskini', status: 'DALAM PROSES' }
])

// Submit & redirect
const hantarKemaskini = () => {
  toast.success('Nombor akaun berjaya dikemaskini. Menunggu sokongan.')
  statusKemaskini.value = 'Menunggu Sokongan'
  router.push('/BF-PA/PE/MP/08')
}
</script>

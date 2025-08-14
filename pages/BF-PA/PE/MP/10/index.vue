<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <h2 class="text-xl font-semibold">Status Lulus dan Pemberitahuan Sedang Menunggu Pembayaran</h2>
      </template>

      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormKit type="text" label="Nama Penolong Amil" :value="nama" disabled />
          <FormKit type="text" label="Alamat Terkini" :value="alamat" disabled />
          <FormKit type="text" label="Nombor Telefon" :value="telefon" disabled />
          <FormKit type="select" label="Nama Bank" :options="senaraiBank" :value="namaBank" disabled />
          <FormKit type="text" label="Nombor Akaun Bank" :value="noAkaun" disabled />
        </div>

        <!-- Status Paparan -->
        <div class="mt-6">
          <FormKit type="text" label="Status Terkini" :value="statusTindakan" disabled />
        </div>

        <!-- Notifikasi Visual -->
        <div class="mt-6 p-4 border rounded bg-yellow-50 text-yellow-800">
          <strong>Notifikasi:</strong>
          Permohonan telah <span class="font-semibold">diluluskan</span> dan kini <span class="font-semibold">menunggu proses pembayaran</span> oleh pihak berkaitan.
        </div>

        <!-- Log Ringkas -->
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
import { ref } from 'vue'

const breadcrumb = ref([
  { name: 'Pengurusan Elaun', type: 'link', path: '/BF-PA/PE/MP' },
  { name: 'Status Menunggu Bayaran', type: 'current', path: '/BF-PA/PE/MP/10' }
])

const nama = 'Hasan bin Omar'
const alamat = 'Lot 333, Kampung Aman'
const telefon = '012-3456789'
const namaBank = 'Bank Islam'
const noAkaun = '12345678901234'
const statusTindakan = ref('SEDANG MENUNGGU PROSES UNTUK BAYARAN')

const senaraiBank = [
  { label: 'Maybank', value: 'Maybank' },
  { label: 'Bank Islam', value: 'Bank Islam' },
  { label: 'CIMB', value: 'CIMB' },
  { label: 'Bank Rakyat', value: 'Bank Rakyat' }
]

const logTindakan = ref([
  { tarikh: '2025-07-30 11:15AM', tindakan: 'Ketua Jabatan luluskan permohonan', status: 'DILULUSKAN' },
  { tarikh: '2025-07-30 11:20AM', tindakan: 'Status dikemaskini ke "Menunggu Bayaran"', status: 'SEDANG MENUNGGU PROSES UNTUK BAYARAN' }
])
</script>

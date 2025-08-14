<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <h2 class="text-xl font-semibold">Kelulusan Ketua Jabatan - Kemaskini Maklumat</h2>
      </template>

      <template #body>
        <!-- Maklumat Peribadi -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormKit type="text" label="Nama Penolong Amil" :value="nama" disabled />
          <FormKit type="text" label="Alamat Terkini" :value="alamat" disabled />
          <FormKit type="text" label="Nombor Telefon (Mudah Alih)" :value="telefon" disabled />
          <FormKit type="select" label="Nama Bank" :options="senaraiBank" :value="namaBank" disabled />
          <FormKit type="text" label="Nombor Akaun Bank" :value="noAkaun" disabled />

          <!-- Lampiran Dokumen -->
          <div class="md:col-span-2">
            <label class="font-medium">Lampiran Dokumen</label>
            <div class="mt-2 border p-4 rounded bg-gray-50">
              <iframe
                v-if="dokumenURL"
                :src="dokumenURL"
                class="w-full h-80 border rounded"
              ></iframe>
              <div v-else class="text-gray-500">Tiada dokumen dilampirkan.</div>
            </div>
          </div>
        </div>

        <!-- Pilihan Kelulusan -->
        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormKit
            type="radio"
            label="Pilihan"
            v-model="pilihan"
            :options="[ { label: 'Lulus', value: 'Lulus' }, { label: 'Tolak', value: 'Tolak' } ]"
            validation="required"
          />

          <FormKit
            type="textarea"
            label="Ulasan Ketua Jabatan"
            v-model="ulasanKJ"
            :validation="pilihan === 'Tolak' ? 'required' : ''"
            placeholder="Wajib isi jika pilih 'Tolak'"
          />
        </div>

        <!-- Status -->
        <div class="mt-6">
          <FormKit type="text" label="Status Tindakan" :value="statusTindakan" disabled />
        </div>

        <!-- Butang Hantar -->
        <div class="flex justify-end mt-6">
          <rs-button
            variant="primary"
            :disabled="!pilihan || (pilihan === 'Tolak' && !ulasanKJ)"
            @click="hantarKelulusan"
          >
            Hantar Keputusan
          </rs-button>
        </div>

        <!-- Log Tindakan Ketua Jabatan -->
        <div class="mt-10">
          <h3 class="font-semibold mb-2">Log Tindakan Ketua Jabatan</h3>
          <table class="min-w-full divide-y divide-gray-200 text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left">Tarikh</th>
                <th class="px-4 py-2 text-left">Nama Pegawai</th>
                <th class="px-4 py-2 text-left">Tindakan</th>
                <th class="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in logTindakan" :key="log.tarikh" class="border-t">
                <td class="px-4 py-2">{{ log.tarikh }}</td>
                <td class="px-4 py-2">{{ log.namaPegawai }}</td>
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
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const router = useRouter()
const toast = useToast()

// Breadcrumb
const breadcrumb = ref([
  { name: 'Pengurusan Elaun', type: 'link', path: '/BF-PA/PE/MP' },
  { name: 'Kelulusan Ketua Jabatan', type: 'current', path: '/BF-PA/PE/MP/09' }
])

// Dummy Data
const nama = 'Hasan bin Omar'
const alamat = 'Lot 333, Kampung Aman'
const telefon = '012-3456789'
const namaBank = 'Bank Islam'
const noAkaun = '12345678901234'
const dokumenURL = '/dummy-dokumen.pdf'

const pilihan = ref('')
const ulasanKJ = ref('')
const statusTindakan = ref('DALAM SEMAKAN')

const senaraiBank = [
  { label: 'Maybank', value: 'Maybank' },
  { label: 'Bank Islam', value: 'Bank Islam' },
  { label: 'CIMB', value: 'CIMB' },
  { label: 'Bank Rakyat', value: 'Bank Rakyat' }
]

const logTindakan = ref([
  {
    tarikh: '2025-07-30 10:00AM',
    namaPegawai: 'En. Ali',
    tindakan: 'Akses skrin semakan',
    status: 'DALAM SEMAKAN'
  }
])

// Fungsi utama
const hantarKelulusan = () => {
  const status = pilihan.value === 'Lulus' ? 'Diluluskan' : 'Perlu Kemaskini Semula'
  statusTindakan.value = status

  logTindakan.value.push({
    tarikh: new Date().toLocaleString(),
    namaPegawai: 'En. Ali',
    tindakan: `Ketua Jabatan pilih "${pilihan.value}"`,
    status: status
  })

  toast.success('Keputusan telah dihantar')

  // Redirect ke skrin status menunggu bayaran jika Lulus
  if (pilihan.value === 'Lulus') {
    router.push('/BF-PA/PE/MP/10')
  }
}
</script>

<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <h2 class="text-xl font-semibold">Semakan & Sokongan Maklumat Kemaskini</h2>
      </template>

      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormKit type="text" label="Nama Penolong Amil" :value="nama" disabled />
          <FormKit type="text" label="Alamat Terkini" :value="alamat" disabled />
          <FormKit type="text" label="Nombor Telefon (Mudah Alih)" :value="telefon" disabled />
          <FormKit type="select" label="Nama Bank" :options="senaraiBank" :value="namaBank" disabled />
          <FormKit type="text" label="Nombor Akaun Bank" :value="noAkaun" disabled />

          <!-- Viewer untuk dokumen sokongan -->
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

        <!-- Sokongan -->
        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormKit
            type="select"
            label="Pilihan Sokongan"
            :options="[
              { label: 'Sokong', value: 'Sokong' },
              { label: 'Hantar Semula', value: 'Hantar Semula' }
            ]"
            v-model="pilihanSokongan"
            validation="required"
          />

          <FormKit
            type="textarea"
            label="Ulasan Eksekutif"
            v-model="ulasan"
            :validation="pilihanSokongan === 'Hantar Semula' ? 'required' : ''"
            placeholder="Tulis ulasan jika hantar semula"
          />
        </div>

        <!-- Status -->
        <div class="mt-6">
          <FormKit type="text" label="Status Tindakan" :value="statusTindakan" disabled />
        </div>

        <!-- Submit -->
        <div class="flex justify-end mt-6">
          <rs-button
            variant="primary"
            :disabled="!pilihanSokongan || (pilihanSokongan === 'Hantar Semula' && !ulasan)"
            @click="hantarKeputusan"
          >
            Hantar Keputusan
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const router = useRouter()

const breadcrumb = ref([
  { name: 'Pengurusan Elaun', type: 'link', path: '/BF-PA/PE/MP' },
  { name: 'Semakan & Sokongan Maklumat', type: 'current', path: '/BF-PA/PE/MP/09' }
])

const nama = 'Hasan bin Omar'
const alamat = 'Lot 333, Kampung Aman'
const telefon = '012-3456789'
const namaBank = 'Bank Islam'
const noAkaun = '12345678901234'
const dokumenURL = '/dummy-dokumen.pdf'

const pilihanSokongan = ref('')
const ulasan = ref('')
const statusTindakan = ref('DALAM SEMAKAN')

const senaraiBank = [
  { label: 'Maybank', value: 'Maybank' },
  { label: 'Bank Islam', value: 'Bank Islam' },
  { label: 'CIMB', value: 'CIMB' },
  { label: 'Bank Rakyat', value: 'Bank Rakyat' }
]

const logTindakan = ref([
  { tarikh: '2025-07-30 09:10AM', tindakan: 'Kemaskini dihantar oleh Penolong Amil', status: 'Menunggu Sokongan' },
  { tarikh: '2025-07-30 09:30AM', tindakan: 'Eksekutif akses skrin semakan', status: 'DALAM SEMAKAN' }
])

const hantarKeputusan = () => {
  const status = pilihanSokongan.value === 'Sokong' ? 'Disokong' : 'Perlu Kemaskini Semula'
  statusTindakan.value = status

  logTindakan.value.push({
    tarikh: new Date().toLocaleString(),
    tindakan: `Eksekutif pilih "${pilihanSokongan.value}"`,
    status: status
  })

  toast.success('Keputusan telah dihantar')

  // Redirect ke skrin baharu (Kelulusan KJ)
  router.push('/BF-PA/PE/MP/09')
}
</script>

<template>
  <div class="p-4 space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">Maklumat Penerima (Paparan)</h2>
      <div class="text-xs text-gray-500">Status: <b>{{ statusLabel }}</b></div>
    </div>

    <div class="overflow-x-auto rounded-lg border bg-white">
      <table class="min-w-full text-sm divide-y">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left">Nama</th>
            <th class="px-4 py-3 text-left">No. KP</th>
            <th class="px-4 py-3 text-left">Kategori</th>
            <th class="px-4 py-3 text-left">Elaun (RM)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="penerima in penerimaDipilih" :key="penerima.id" class="border-t">
            <td class="px-4 py-2 font-medium">{{ penerima.nama }}</td>
            <td class="px-4 py-2">{{ penerima.ic }}</td>
            <td class="px-4 py-2">{{ penerima.kategori }}</td>
            <td class="px-4 py-2 w-40">
              <input
                type="number"
                v-model.number="penerima.elaun"
                min="0"
                step="0.01"
                class="w-full border rounded px-2 py-1"
                placeholder="0.00"
              />
            </td>
          </tr>
          <tr v-if="!penerimaDipilih.length">
            <td colspan="4" class="px-4 py-6 text-center text-gray-500">
              Tiada penerima dipilih lagi. Tandakan dan klik "Pilih".
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-50 border-t">
          <tr>
            <td colspan="3" class="px-4 py-3 text-right font-medium">Jumlah (RM)</td>
            <td class="px-4 py-3 font-semibold">{{ jumlahElaun.toFixed(2) }}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div class="flex items-center justify-between">
      <button @click="goBack" type="button" class="px-4 py-2 rounded-lg border hover:bg-gray-50">Kembali</button>
      <div class="flex items-center gap-2">
        <button @click="simpanDraf" type="button" class="px-4 py-2 rounded-lg border hover:bg-gray-50" :disabled="saving">Simpan Draf</button>
        <button @click="hantarKelulusan" type="button" class="px-4 py-2 rounded-lg text-white disabled:opacity-50" :class="canSubmit ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-400'" :disabled="!canSubmit || saving">Hantar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// MOCK: Senarai penerima dipilih
const penerimaDipilih = ref([
  { id: 1, nama: 'Ali Bin Abu', ic: '800101-14-1234', kategori: 'KPAK', elaun: 0 },
  { id: 2, nama: 'Ahmad Bin Bakar', ic: '800102-10-5678', kategori: 'PAK', elaun: 0 }
])

// Status paparan
const status = ref('DRAF') // DRAF | MENUNGGU KELULUSAN | DITOLAK | DILULUSKAN
const statusLabel = computed(() => status.value.replace('_', ' ').toLowerCase())

// Kiraan jumlah elaun
const jumlahElaun = computed(() => penerimaDipilih.value.reduce((sum, r) => sum + (Number(r.elaun) || 0), 0))
const canSubmit = computed(() => penerimaDipilih.value.length > 0 && penerimaDipilih.value.every(r => Number(r.elaun) >= 0))

const saving = ref(false)

function goBack(){
  router.back()
}

async function simpanDraf(){
  saving.value = true
  try{
    // TODO: panggil API sebenar: POST /api/et/paparan/draf
    await wait(400)
    status.value = 'DRAF'
    alert('Draf disimpan.')
  } finally { saving.value = false }
}

async function hantarKelulusan(){
  if(!canSubmit.value) return
  saving.value = true
  try{
    // TODO: panggil API sebenar: POST /api/et/paparan/hantar
    await wait(600)
    status.value = 'MENUNGGU KELULUSAN'
    alert('Senarai dihantar untuk kelulusan Ketua Jabatan.')
  } finally { saving.value = false }
}

function wait(ms){ return new Promise(res => setTimeout(res, ms)) }
</script>

<style scoped>
/* Gaya ringkas; gunakan Tailwind utiliti dalam template */
</style>

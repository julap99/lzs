<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Status Kelulusan & Pembayaran</h2>
          <rs-badge variant="success">DILULUSKAN</rs-badge>
        </div>
      </template>

      <template #body>
        <!-- Ringkasan Maklumat -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormKit type="text" label="ID Rujukan" :value="details.id" disabled />
          <FormKit type="text" label="Nama Aktiviti" :value="details.nama" disabled />
          <FormKit type="text" label="Jenis Elaun" :value="details.jenis" disabled />
          <FormKit type="text" label="Tarikh Kelulusan" :value="details.tarikhKelulusan" disabled />
        </div>

        <!-- Notis Menunggu Pembayaran -->
        <div class="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded-md">
          💡 <strong>Pemberitahuan:</strong> Permohonan ini telah diluluskan dan sedang menunggu proses bayaran.
        </div>

        <!-- Senarai Penolong Amil -->
        <div class="mt-6">
          <h3 class="text-md font-medium mb-2">Senarai Penolong Amil & Amaun Elaun</h3>
          <rs-table
            :data="details.peserta"
            :pageSize="5"
            :columns="[
              { key: 'nama', label: 'Nama' },
              { key: 'noKP', label: 'No KP' },
              { key: 'jawatan', label: 'Jawatan' },
              { key: 'status', label: 'Status Kehadiran' },
              { key: 'elaun', label: 'Elaun (RM)' }
            ]"
          >
            <template #elaun="data">RM {{ parseFloat(data.text).toFixed(2) }}</template>
          </rs-table>

          <div class="text-right mt-4 font-semibold text-lg">
            Jumlah Keseluruhan: RM {{ jumlahKeseluruhan.toFixed(2) }}
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const breadcrumb = [
  { name: "Pengurusan Elaun", type: "link", path: "/BF-PA/PE/MP" },
  { name: "Status Kelulusan", type: "current", path: "/BF-PA/PE/MP/06" }
]

// Dummy data untuk preview
const details = ref({
  id: "MP/2025/002",
  nama: "Program Tazkirah Khas",
  jenis: "Elaun Tugasan",
  tarikhKelulusan: "2025-07-30",
  peserta: [
    { nama: "Ahmad bin Ali", noKP: "800101-01-1111", jawatan: "PAK", status: "Hadir", elaun: 90 },
    { nama: "Siti binti Abu", noKP: "820202-02-2222", jawatan: "PAF", status: "Hadir", elaun: 100 }
  ]
})

const jumlahKeseluruhan = computed(() => {
  return details.value.peserta.reduce((sum, p) => sum + parseFloat(p.elaun || 0), 0)
})
</script>

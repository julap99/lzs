<template>
  <div>
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Title -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">Butiran Konfigurasi Penutupan Aduan</h2>
      <NuxtLink
        to="/BF-ADN/PK/KP/01/04"
        class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow"
      >
        Kemaskini
      </NuxtLink>
    </div>

    <!-- Konfigurasi Semasa -->
    <div class="border rounded p-4 mb-6 bg-white shadow">
      <h3 class="font-semibold text-lg mb-3">Konfigurasi Semasa</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><span class="font-medium">Sebab Penutupan:</span> Bantuan telah diterima daripada agensi lain</p>
          <p>
            <span class="font-medium">Status:</span>
            <span
              class="ml-2 px-2 py-1 rounded text-white text-sm"
              :class="form.status === 'Aktif' ? 'bg-green-600' : 'bg-red-600'"
            >
              {{ form.status }}
            </span>
          </p>
        </div>
        <div>
          <p><span class="font-medium">Tarikh Mula Kuasa:</span> 05/10/2025</p>
          <p><span class="font-medium">Catatan:</span> Konfigurasi ini digunakan untuk situasi bantuan luar diterima.</p>
        </div>
      </div>
    </div>

    <!-- Senarai Sejarah Perubahan -->
    <div class="border rounded p-4 bg-white shadow">
      <h3 class="font-semibold text-lg mb-3">Senarai Sejarah Perubahan</h3>
      <div class="overflow-x-auto">
        <table class="w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead>
            <tr class="bg-gray-200 text-left">
              <th class="px-3 py-2 border">No</th>
              <th class="px-3 py-2 border">Sebab Penutupan</th>
              <th class="px-3 py-2 border">Tarikh Mula Kuasa</th>
              <th class="px-3 py-2 border">Status Konfigurasi</th>
              <th class="px-3 py-2 border">Dikemaskini Oleh</th>
              <th class="px-3 py-2 border">Tarikh Kemaskini</th>
              <th class="px-3 py-2 border">Catatan Kemaskini</th>
              <th class="px-3 py-2 border">Status Kelulusan</th>
              <th class="px-3 py-2 border">Diluluskan Oleh</th>
              <th class="px-3 py-2 border">Tarikh Diluluskan</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in sejarahList"
              :key="index"
              class="hover:bg-gray-50"
            >
              <td class="px-3 py-2 border">{{ index + 1 }}</td>
              <td class="px-3 py-2 border">{{ item.sebab }}</td>
              <td class="px-3 py-2 border">{{ item.tarikhMula }}</td>
              <td class="px-3 py-2 border">
                <span
                  class="px-2 py-1 text-sm rounded text-white"
                  :class="{
                    'bg-green-600': item.statusKonfigurasi === 'Aktif',
                    'bg-red-600': item.statusKonfigurasi === 'Tidak Aktif',
                    'bg-yellow-500': item.statusKonfigurasi === 'Menunggu Kelulusan'
                  }"
                >
                  {{ item.statusKonfigurasi }}
                </span>
              </td>
              <td class="px-3 py-2 border">{{ item.dikemaskiniOleh }}</td>
              <td class="px-3 py-2 border">{{ item.tarikhKemaskini }}</td>
              <td class="px-3 py-2 border">{{ item.catatan }}</td>
              <td class="px-3 py-2 border">
                <span
                  class="px-2 py-1 text-sm rounded text-white"
                  :class="{
                    'bg-green-600': item.statusKelulusan === 'Diluluskan',
                    'bg-yellow-500': item.statusKelulusan === 'Dalam Proses',
                    'bg-red-600': item.statusKelulusan === 'Ditolak'
                  }"
                >
                  {{ item.statusKelulusan }}
                </span>
              </td>
              <td class="px-3 py-2 border">{{ item.diluluskanOleh }}</td>
              <td class="px-3 py-2 border">{{ item.tarikhDiluluskan }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Butiran Konfigurasi Penutupan Aduan",
  path: "/BF-ADN/PK/KP/01/03",
});

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: "/BF-ADN/SLA" },
  { name: "Senarai Konfigurasi Penutupan Aduan", type: "link", path: "/BF-ADN/PK/KP/01/01" },
  { name: "Butiran Konfigurasi", type: "current", path: "/BF-ADN/PK/KP/01/03" },
]);

const form = ref({
  status: "Aktif",
});

const sejarahList = ref([
  {
    sebab: "Bantuan telah diterima daripada agensi lain",
    tarikhMula: "01/09/2025",
    statusKonfigurasi: "Tidak Aktif",
    dikemaskiniOleh: "admin1",
    tarikhKemaskini: "30/08/2025",
    catatan: "Kemaskini ulasan tambahan diperlukan",
    statusKelulusan: "Diluluskan",
    diluluskanOleh: "Ketua Jabatan",
    tarikhDiluluskan: "01/09/2025",
  },
  {
    sebab: "Masalah telah diselesaikan oleh pengadu sendiri",
    tarikhMula: "15/08/2025",
    statusKonfigurasi: "Tidak Aktif",
    dikemaskiniOleh: "admin2",
    tarikhKemaskini: "10/08/2025",
    catatan: "Menambah konfigurasi baru untuk keselesaan pengadu",
    statusKelulusan: "Diluluskan",
    diluluskanOleh: "Pengarah",
    tarikhDiluluskan: "12/08/2025",
  },
  {
    sebab: "Maklumat tidak lengkap atau tidak tepat",
    tarikhMula: "20/07/2025",
    statusKonfigurasi: "Menunggu Kelulusan",
    dikemaskiniOleh: "admin3",
    tarikhKemaskini: "18/07/2025",
    catatan: "Kemaskini format catatan untuk lebih terperinci",
    statusKelulusan: "Dalam Proses",
    diluluskanOleh: "-",
    tarikhDiluluskan: "-",
  },
  {
    sebab: "Permohonan di luar bidang kuasa",
    tarikhMula: "07/07/2025",
    statusKonfigurasi: "Tidak Aktif",
    dikemaskiniOleh: "admin1",
    tarikhKemaskini: "01/07/2025",
    catatan: "Menambah konfigurasi untuk kes di luar bidang kuasa",
    statusKelulusan: "Diluluskan",
    diluluskanOleh: "Ketua Jabatan",
    tarikhDiluluskan: "03/07/2025",
  },
  {
    sebab: "Pengadu menarik balik aduan",
    tarikhMula: "25/06/2025",
    statusKonfigurasi: "Tidak Aktif",
    dikemaskiniOleh: "admin4",
    tarikhKemaskini: "20/06/2025",
    catatan: "Kemaskini status untuk kes penarikan balik",
    statusKelulusan: "Diluluskan",
    diluluskanOleh: "Ketua Unit",
    tarikhDiluluskan: "22/06/2025",
  },
  {
    sebab: "Dokumen sokongan tidak mencukupi",
    tarikhMula: "10/06/2025",
    statusKonfigurasi: "Tidak Aktif",
    dikemaskiniOleh: "admin2",
    tarikhKemaskini: "05/06/2025",
    catatan: "Menambah konfigurasi untuk kes dokumen tidak lengkap",
    statusKelulusan: "Diluluskan",
    diluluskanOleh: "Pengarah",
    tarikhDiluluskan: "08/06/2025",
  },
]);
</script>

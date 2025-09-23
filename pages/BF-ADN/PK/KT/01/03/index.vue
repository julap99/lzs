<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Butiran Kategori -->
    <rs-card class="mb-6">
      <template #header>Butiran Konfigurasi Kategori Masalah Semasa</template>
      <template #body>
        <div class="p-4">
          <h3 class="text-lg font-bold mb-4">{{ kategori.nama }}</h3>
          <p class="mb-2">
            <span class="font-medium">Tahap Aduan:</span>
            {{ kategori.tahap }}
          </p>
          <p class="mb-2">
            <span class="font-medium">Nama Kategori:</span>
            {{ kategori.nama }}
          </p>
          <p class="mb-2">
            <span class="font-medium">Status:</span>
            <rs-badge :variant="getBadgeVariant(kategori.status)">
              {{ kategori.status }}
            </rs-badge>
          </p>
        </div>
      </template>
    </rs-card>

    <!-- Senarai Perubahan -->
    <rs-card>
      <template #header>Senarai Perubahan</template>
      <template #body>
        <div class="overflow-x-auto">
          <table class="table-auto w-full border-collapse border">
            <thead>
              <tr class="bg-gray-100 text-left">
                <th class="px-3 py-2 border">#</th>
                <th class="px-3 py-2 border">Kategori Masalah</th>
                <th class="px-3 py-2 border">Tahap Aduan</th>
                <th class="px-3 py-2 border">Status</th>
                <th class="px-3 py-2 border">Dikemaskini Oleh</th>
                <th class="px-3 py-2 border">Tarikh Kemaskini</th>
                <th class="px-3 py-2 border">Catatan Kemaskini</th>
                <th class="px-3 py-2 border">Status Permohonan</th>
                <th class="px-3 py-2 border">Diluluskan Oleh</th>
                <th class="px-3 py-2 border">Tarikh Kelulusan</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in perubahanList"
                :key="index"
                class="hover:bg-gray-50"
              >
                <td class="px-3 py-2 border">{{ row.id }}</td>
                <td class="px-3 py-2 border">{{ row.kategori }}</td>
                <td class="px-3 py-2 border">{{ row.tahap }}</td>
                <td class="px-3 py-2 border">
                  <rs-badge :variant="getBadgeVariant(row.status)">
                    {{ row.status }}
                  </rs-badge>
                </td>
                <td class="px-3 py-2 border">{{ row.dikemaskiniOleh }}</td>
                <td class="px-3 py-2 border">{{ row.tarikhKemaskini }}</td>
                <td class="px-3 py-2 border">{{ row.catatan }}</td>
                <td class="px-3 py-2 border">
                  <rs-badge variant="success">{{ row.statusPermohonan }}</rs-badge>
                </td>
                <td class="px-3 py-2 border">{{ row.diluluskanOleh }}</td>
                <td class="px-3 py-2 border">{{ row.tarikhKelulusan }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Butiran Kategori Masalah",
  path: "/BF-ADN/PK/KT/01/03",
});

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: `/BF-ADN/SLA` },
  { name: "Senarai Kategori Masalah", type: "link", path: `/BF-ADN/PK/KT/01/01` },
  { name: "Butiran Kategori Masalah", type: "current", path: "/BF-ADN/PK/KT/01/03" },
]);

// Example detail (top card)
const kategori = ref({
  nama: "Tiada Tempat Tinggal",
  tahap: "Kelas 1 (Merah)",
  status: "Aktif",
});

// Example perubahan data (table)
const perubahanList = ref([
  {
    id: 1,
    kategori: "Tiada Tempat Tinggal",
    tahap: "Kelas 1 (Merah)",
    status: "Aktif",
    dikemaskiniOleh: "Eksekutif_A",
    tarikhKemaskini: "2025-09-10",
    catatan: "Kemaskini tahap aduan dan penerangan",
    statusPermohonan: "Diluluskan",
    diluluskanOleh: "Ketua Jabatan",
    tarikhKelulusan: "2025-09-12",
  },
  {
    id: "KM-V1-0002",
    kategori: "Tiada Makanan",
    tahap: "Kelas 1 (Merah)",
    status: "Aktif",
    dikemaskiniOleh: "Eksekutif_B",
    tarikhKemaskini: "2025-09-06",
    catatan: "Penetapan semula label kategori",
    statusPermohonan: "Diluluskan",
    diluluskanOleh: "Ketua Jabatan",
    tarikhKelulusan: "2025-09-08",
  },
  {
    id: "KM-V1-0003",
    kategori: "Kekurangan Sumber Pendapatan",
    tahap: "Kelas 2 (Kuning)",
    status: "Tidak Aktif",
    dikemaskiniOleh: "Eksekutif_C",
    tarikhKemaskini: "2025-08-30",
    catatan: "Dinonaktifkan sementara untuk semakan",
    statusPermohonan: "Diluluskan",
    diluluskanOleh: "Ketua Jabatan",
    tarikhKelulusan: "2025-09-01",
  },
]);

// Badge color logic
const getBadgeVariant = (status) => {
  if (status === "Aktif") return "success";
  if (status === "Tidak Aktif") return "danger";
  return "secondary";
};
</script>

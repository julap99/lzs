<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />
    <!-- Multi-dimensional Merit Breakdown -->
    <rs-card class="mt-4">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-800">
          Perincian Pengiraan Merit Multidimensi Keluarga
        </h3>
      </template>

      <div v-for="(member, idx) in family" :key="member.ic" class="mb-8">
        <div class="mr-4">
          <h4 class="text-lg font-semibold text-blue-800 mb-2">
            {{ member.nama }} ({{ member.ic }})
          </h4>
        </div>

        <rs-table
          :data="meritBreakdown[idx]"
          :field="[
            'kriteria',
            'nilai',
            'skor',
            'maxSkor',
            'pemberat',
            'formula',
            'merit',
          ]"
          :columns="[
            { key: 'kriteria', label: 'Kriteria' },
            { key: 'nilai', label: 'Nilai' },
            { key: 'skor', label: 'Skor LOV' },
            { key: 'maxSkor', label: 'Skor Tertinggi' },
            { key: 'pemberat', label: 'Pemberat' },
            { key: 'formula', label: 'Formula' },
            { key: 'merit', label: 'Merit' },
          ]"
          :options="{
            variant: 'default',
            striped: true,
            bordered: false,
            hover: true,
          }"
          class="mb-2">
          <template #merit="{ text }">
            <span class="font-bold">{{ text }}</span>
          </template>
        </rs-table>

        <div class="text-sm text-gray-700 mb-2">
          Merit Individu:
          <span class="font-bold text-blue-700">{{
            merits[idx].toFixed(2)
          }}</span>
        </div>
        <div class="text-sm text-gray-700 mb-2">
          Status Multidimensi:
          <span class="font-bold text-green-700">{{
            getStatus(merits[idx])
          }}</span>
        </div>
        <div class="text-sm text-gray-700 mb-2">
          Quadrant:
          <span class="font-bold text-purple-700">{{
            getQuadrant(merits[idx])
          }}</span>
        </div>
      </div>
    </rs-card>

    <!-- Household Merit & Status Summary -->
    <rs-card class="mb-6">
      <template #header>
        <h2 class="text-xl font-semibold text-blue-900">
          Ringkasan Merit Keluarga
        </h2>
      </template>

      <div class="mb-2">
        Merit Keluarga:
        <span class="font-bold text-blue-700">{{ householdMerit }}</span>
      </div>
      <div class="mb-2">
        Status Multidimensi:
        <span class="font-bold text-green-700">{{
          getStatus(householdMerit)
        }}</span>
      </div>
      <div class="mb-2">
        Quadrant:
        <span class="font-bold text-purple-700">{{
          getQuadrant(householdMerit)
        }}</span>
      </div>

      <div class="flex justify-between items-center mt-6">
        <rs-button
          variant="primary-outline"
          @click="navigateTo('/BF-PRF/AS/FR/04')">
          Kembali
        </rs-button>

        <rs-button
          variant="primary"
          @click="navigateTo('/BF-PRF/AS/FR/05_01')"
          :disabled="processing">
          <span v-if="processing">
            <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
          </span>
          <span v-else>Seterusnya</span>
        </rs-button>
      </div>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Multidimensi",
});

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/AS/FR/05",
  },
  {
    name: "Multidimensi",
    type: "current",
    path: "/BF-PRF/AS/FR/05_01",
  },
]);

const processing = ref(false);

const family = [
  {
    ic: "770319035991",
    nama: "ADNAN BIN ABU",
    umur: 48,
    pendidikan: "SRP/PMR",
    kesihatan: "Sihat",
    pekerjaan: "Tidak Bekerja",
    kecacatan: "Tiada",
    pengalaman: "Ya",
    kemahiran: "Ya",
    aset: "Ada",
  },
  {
    ic: "801004035672",
    nama: "ROHANA BINTI AHMAD",
    umur: 45,
    pendidikan: "Peringkat Rendah",
    kesihatan: "Sihat",
    pekerjaan: "Tidak Bekerja",
    kecacatan: "Tiada",
    pengalaman: "No",
    kemahiran: "Ya",
    aset: "Ada",
  },
  {
    ic: "060802030272",
    nama: "NUR NAJWA BINTI ADNAN",
    umur: 19,
    pendidikan: "SPM",
    kesihatan: "Sihat",
    pekerjaan: "Tidak Bekerja",
    kecacatan: "Tiada",
    pengalaman: "No",
    kemahiran: "Tiada",
    aset: "Ada",
  },
  {
    ic: "091108030442",
    nama: "NUR QISTINA BINTI ADNAN",
    umur: 16,
    pendidikan: "Peringkat Rendah",
    kesihatan: "Sihat",
    pekerjaan: "Tidak Bekerja",
    kecacatan: "Tiada",
    pengalaman: "No",
    kemahiran: "Tiada",
    aset: "Ada",
  },
];

const LOV_UMUR = [
  { range: [1, 20.99], skor: 0 },
  { range: [21, 40.99], skor: 4 },
  { range: [41, 50.99], skor: 3 },
  { range: [51, 60.99], skor: 2 },
  { range: [61, 70.99], skor: 1 },
  { range: [71, 100.99], skor: -4 },
];
const LOV_Pendidikan = [
  { kategori: "Tidak Bersekolah", skor: 0 },
  { kategori: "Tadika", skor: 0 },
  { kategori: "Peringkat Rendah", skor: 1 },
  { kategori: "SRP/PMR", skor: 1 },
  { kategori: "SPM", skor: 2 },
  { kategori: "STPM", skor: 2 },
  { kategori: "Certificate", skor: 3 },
  { kategori: "Diploma", skor: 4 },
  { kategori: "Ijazah", skor: 4 },
  { kategori: "Ijazah Sarjana", skor: 5 },
  { kategori: "Lain-lain", skor: 0 },
];
const LOV_Kesihatan = [
  { kategori: "Sihat", skor: 2 },
  { kategori: "Sakit Kronik", skor: 1 },
  { kategori: "Uzur", skor: 0 },
];
const LOV_Pekerjaan = [
  { kategori: "Bekerja", skor: 1 },
  { kategori: "Tidak Bekerja", skor: 0 },
];
const LOV_Kecacatan = [
  { kategori: "OKU", skor: 0 },
  { kategori: "Tiada", skor: 1 },
];
const LOV_Pengalaman = [
  { kategori: "Ya", skor: 1 },
  { kategori: "No", skor: 0 },
];
const LOV_Kemahiran = [
  { kategori: "Ya", skor: 1 },
  { kategori: "Tiada", skor: 0 },
];
const LOV_Aset = [
  { kategori: "Ada", skor: 1 },
  { kategori: "No", skor: 0 },
];

const weights = {
  umur: 6,
  pendidikan: 3,
  kesihatan: 4,
  pekerjaan: 2,
  kecacatan: 1,
  pengalaman: 1,
  kemahiran: 1,
  aset: 1,
};

function getSkorUmur(umur) {
  for (const item of LOV_UMUR) {
    if (umur >= item.range[0] && umur <= item.range[1]) return item.skor;
  }
  return 0;
}
function getSkorLOV(lov, value) {
  const found = lov.find((item) => item.kategori === value);
  return found ? found.skor : 0;
}

function getMeritBreakdown(member) {
  // For <18: (Umur+Pendidikan+Kesihatan+Kecacatan)/14
  // For >=18: (Umur+Pendidikan+Kesihatan+Pekerjaan+Kecacatan+Pengalaman+Kemahiran+Aset)/19
  const breakdown = [];
  // Umur
  const skorUmur = getSkorUmur(member.umur);
  breakdown.push({
    kriteria: "Umur",
    nilai: member.umur,
    skor: skorUmur,
    maxSkor: 4,
    pemberat: weights.umur,
    formula: `${skorUmur}/4*${weights.umur}`,
    merit: ((skorUmur / 4) * weights.umur).toFixed(2),
  });
  // Pendidikan
  const skorPendidikan = getSkorLOV(LOV_Pendidikan, member.pendidikan);
  breakdown.push({
    kriteria: "Pendidikan",
    nilai: member.pendidikan,
    skor: skorPendidikan,
    maxSkor: 5,
    pemberat: weights.pendidikan,
    formula: `${skorPendidikan}/5*${weights.pendidikan}`,
    merit: ((skorPendidikan / 5) * weights.pendidikan).toFixed(2),
  });
  // Kesihatan
  const skorKesihatan = getSkorLOV(LOV_Kesihatan, member.kesihatan);
  breakdown.push({
    kriteria: "Kesihatan",
    nilai: member.kesihatan,
    skor: skorKesihatan,
    maxSkor: 2,
    pemberat: weights.kesihatan,
    formula: `${skorKesihatan}/2*${weights.kesihatan}`,
    merit: ((skorKesihatan / 2) * weights.kesihatan).toFixed(2),
  });
  // Pekerjaan
  const skorPekerjaan = getSkorLOV(LOV_Pekerjaan, member.pekerjaan);
  breakdown.push({
    kriteria: "Pekerjaan",
    nilai: member.pekerjaan,
    skor: skorPekerjaan,
    maxSkor: 1,
    pemberat: weights.pekerjaan,
    formula: `${skorPekerjaan}/1*${weights.pekerjaan}`,
    merit: ((skorPekerjaan / 1) * weights.pekerjaan).toFixed(2),
  });
  // Kecacatan
  const skorKecacatan = getSkorLOV(LOV_Kecacatan, member.kecacatan);
  breakdown.push({
    kriteria: "Kecacatan",
    nilai: member.kecacatan,
    skor: skorKecacatan,
    maxSkor: 1,
    pemberat: weights.kecacatan,
    formula: `${skorKecacatan}/1*${weights.kecacatan}`,
    merit: ((skorKecacatan / 1) * weights.kecacatan).toFixed(2),
  });
  // Pengalaman
  const skorPengalaman = getSkorLOV(LOV_Pengalaman, member.pengalaman);
  breakdown.push({
    kriteria: "Pengalaman",
    nilai: member.pengalaman,
    skor: skorPengalaman,
    maxSkor: 1,
    pemberat: weights.pengalaman,
    formula: `${skorPengalaman}/1*${weights.pengalaman}`,
    merit: ((skorPengalaman / 1) * weights.pengalaman).toFixed(2),
  });
  // Kemahiran
  const skorKemahiran = getSkorLOV(LOV_Kemahiran, member.kemahiran);
  breakdown.push({
    kriteria: "Kemahiran",
    nilai: member.kemahiran,
    skor: skorKemahiran,
    maxSkor: 1,
    pemberat: weights.kemahiran,
    formula: `${skorKemahiran}/1*${weights.kemahiran}`,
    merit: ((skorKemahiran / 1) * weights.kemahiran).toFixed(2),
  });
  // Aset
  const skorAset = getSkorLOV(LOV_Aset, member.aset);
  breakdown.push({
    kriteria: "Aset",
    nilai: member.aset,
    skor: skorAset,
    maxSkor: 1,
    pemberat: weights.aset,
    formula: `${skorAset}/1*${weights.aset}`,
    merit: ((skorAset / 1) * weights.aset).toFixed(2),
  });
  return breakdown;
}

const meritBreakdown = family.map(getMeritBreakdown);

const merits = family.map((member, idx) => {
  // For <18: (Umur+Pendidikan+Kesihatan+Kecacatan)/14
  // For >=18: (Umur+Pendidikan+Kesihatan+Pekerjaan+Kecacatan+Pengalaman+Kemahiran+Aset)/19
  const b = meritBreakdown[idx];
  if (member.umur < 18) {
    return (
      (Number(b[0].merit) +
        Number(b[1].merit) +
        Number(b[2].merit) +
        Number(b[4].merit)) /
      14
    );
  } else {
    return (
      (Number(b[0].merit) +
        Number(b[1].merit) +
        Number(b[2].merit) +
        Number(b[3].merit) +
        Number(b[4].merit) +
        Number(b[5].merit) +
        Number(b[6].merit) +
        Number(b[7].merit)) /
      19
    );
  }
});

function getStatus(merit) {
  if (merit >= 0 && merit <= 0.24) return "Tegar";
  if (merit >= 0.25 && merit <= 0.49) return "Tidak Produktif";
  if (merit >= 0.5 && merit <= 0.74) return "Produktif C";
  if (merit >= 0.75 && merit <= 0.99) return "Produktif B";
  if (merit >= 1) return "Produktif A";
  return "Tidak Diketahui";
}
function getQuadrant(merit) {
  if (merit >= 0 && merit <= 0.24) return "Asnaf Tegar";
  if (merit >= 0.25 && merit <= 0.49) return "Asnaf Tidak Produktif";
  if (merit >= 0.5 && merit <= 0.99) return "Asnaf Produktif Sementara";
  if (merit >= 1) return "Asnaf Produktif";
  return "-";
}

const householdMerit = (
  (merits[0] + merits[1] + merits[2] + merits[3]) /
  4
).toFixed(2);
</script>

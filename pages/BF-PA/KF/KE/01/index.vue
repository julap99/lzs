<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Tambah / Kemaskini Maklumat Jawatan
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <p class="mb-4 text-gray-700">
            Sila isi maklumat kadar elaun bagi Penolong Amil berdasarkan kategori dan jenis elaun:
          </p>

          <!-- FormKit Form -->
          <FormKit
            type="form"
            id="allowanceForm"
            :actions="false"
            v-model="form"
          >
            <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
              <!-- Kategori Amil -->
              <FormKit
                type="select"
                name="kategoriAmil"
                label="Kategori Amil"
                placeholder="Pilih Kategori Amil"
                :options="kategoriAmilOptions"
                validation="required"
                :validation-messages="{
                  required: 'Sila pilih kategori amil',
                }"
              />

              <!-- Jenis Elaun -->
              <FormKit
                type="select"
                name="jenisElaun"
                label="Jenis Elaun"
                placeholder="Pilih Jenis Elaun"
                :options="jenisElaunOptions"
                validation="required"
                :validation-messages="{
                  required: 'Jenis elaun diperlukan',
                }"
                v-model="form.jenisElaun"
              />

              <!-- Anugerah Penolong Amil Dropdown -->
              <FormKit
                v-if="showAnugerahDropdown"
                type="select"
                name="anugerahType"
                label="Jenis Anugerah Penolong Amil"
                placeholder="Pilih Jenis Anugerah"
                :options="anugerahOptions"
                validation="required"
                :validation-messages="{
                  required: 'Jenis anugerah diperlukan',
                }"
                v-model="form.anugerahType"
              />

              <!-- Jenis Elaun Lain-lain -->
              <FormKit
                v-if="showJenisElaunLain"
                type="text"
                name="jenisElaunLain"
                label="Nyatakan Jenis Elaun"
                placeholder="Sila nyatakan jenis elaun"
                validation="required"
                :validation-messages="{
                  required: 'Jenis elaun diperlukan',
                }"
                v-model="form.jenisElaunLain"
              />

              <!-- Jenis Jawatan -->
              <FormKit
                type="select"
                name="jenisJawatan"
                label="Jenis Jawatan"
                placeholder="Pilih Jenis Jawatan"
                :options="jenisJawatanOptions"
                validation="required"
                :validation-messages="{
                  required: 'Jenis jawatan diperlukan',
                }"
                v-model="form.jenisJawatan"
              />

              <!-- Jenis Jawatan Lain-lain -->
              <FormKit
                v-if="showJenisJawatanLain"
                type="text"
                name="jenisJawatanLain"
                label="Nyatakan Jenis Jawatan"
                placeholder="Sila nyatakan jenis jawatan"
                validation="required"
                :validation-messages="{
                  required: 'Jenis jawatan diperlukan',
                }"
                v-model="form.jenisJawatanLain"
              />

              <!-- Kadar Elaun -->
              <FormKit
                type="number"
                name="kadarElaun"
                label="Kadar Elaun (RM)"
                placeholder="0.00"
                :value="kadarElaunValue"
                :disabled="isKadarElaunReadonly"
                validation="required|number|min:0"
                :validation-messages="{
                  required: 'Kadar elaun diperlukan',
                  number: 'Sila masukkan nilai yang sah',
                  min: 'Kadar elaun tidak boleh negatif',
                }"
                v-model="kadarElaunValue"
              />

              <!-- Note for Elaun Khas -->
              <div v-if="showKhasNote" class="md:col-span-2 text-blue-700 text-sm font-semibold">
                * Elaun Khas: Layak jika mencapai 48 aktiviti setahun
              </div>
            </div>

            <!-- Submit Button -->
            <div class="mt-6 flex justify-end space-x-3">
              <rs-button
                variant="primary"
                @click="handleClick"
              >
                Hantar
              </rs-button>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

definePageMeta({
  title: "Tambah / Kemaskini Maklumat Jawatan",
  description: "Konfigurasi kadar elaun bagi Penolong Amil",
});

const breadcrumb = ref([
  {
    name: "Konfigurasi",
    type: "link",
    path: "/BF-PA/KF",
  },
  {
    name: "Elaun",
    type: "link",
    path: "/BF-PA/KF/KE",
  },
  {
    name: "Tambah / Kemaskini Maklumat Jawatan",
    type: "current",
    path: "/BF-PA/KF/KE/01",
  },
]);

// Kategori Amil options
const kategoriAmilOptions = [
  { label: 'Fitrah', value: 'FITRAH' },
  { label: 'Padi', value: 'PADI' },
  { label: 'Kariah', value: 'KARIAH' },
  { label: 'Komuniti', value: 'KOMUNITI' },
];

// Jenis Elaun options
const jenisElaunOptions = [
  { label: 'Elaun Bancian Baru', value: 'BANCIAN_BARU' },
  { label: 'Elaun Kemaskini', value: 'KEMASKINI' },
  { label: 'Elaun Permohonan Bantuan', value: 'PERMOHONAN_BANTUAN' },
  { label: 'Elaun Khas', value: 'KHAS' },
  { label: 'Elaun Tahunan KPAK', value: 'TAHUNAN_KPAK' },
  { label: 'Elaun Tahunan KPAF', value: 'TAHUNAN_KPAF' },
  { label: 'Anugerah Penolong Amil', value: 'ANUGERAH_PA' },
  { label: 'Lain-lain', value: 'LAIN_LAIN' },
];

// Anugerah Penolong Amil sub-options
const anugerahOptions = [
  { label: 'Ketua Penolong Amil Kariah (KPAK) Terbaik', value: 'KPAK_TERBAIK' },
  { label: 'Penolong Amil Kariah (PAK) Terbaik', value: 'PAK_TERBAIK' },
  { label: 'Ketua Penolong Amil Fitrah (KPAF) Terbaik', value: 'KPAF_TERBAIK' },
  { label: 'Penolong Amil Fitrah (PAF) Terbaik', value: 'PAF_TERBAIK' },
  { label: 'Penolong Amil Padi (PAP) Terbaik', value: 'PAP_TERBAIK' },
  { label: 'Penolong Amil Komuniti (PAK+) Terbaik', value: 'PAK_PLUS_TERBAIK' },
];

// Jenis Jawatan options
const jenisJawatanOptions = [
  { label: 'Ketua Penolong Amil', value: 'KPA' },
  { label: 'Penolong Amil', value: 'PA' },
  { label: 'Lain-lain', value: 'LAIN_LAIN' },
];

const form = ref({
  kategoriAmil: '',
  jenisElaun: '',
  anugerahType: '',
  jenisElaunLain: '',
  jenisJawatan: '',
  jenisJawatanLain: '',
  kadarElaun: '',
});

const kadarElaunValue = computed({
  get() {
    switch (form.value.jenisElaun) {
      case 'BANCIAN_BARU':
        return 30;
      case 'KEMASKINI':
        return 20;
      case 'PERMOHONAN_BANTUAN':
        return 20;
      case 'KHAS':
        return 400;
      case 'TAHUNAN_KPAK':
        return 500;
      case 'TAHUNAN_KPAF':
        return 300;
      case 'ANUGERAH_PA':
      case 'LAIN_LAIN':
        return form.value.kadarElaun;
      default:
        return '';
    }
  },
  set(val) {
    form.value.kadarElaun = val;
  }
});

const isKadarElaunReadonly = computed(() => {
  return !['ANUGERAH_PA', 'LAIN_LAIN'].includes(form.value.jenisElaun);
});

const showAnugerahDropdown = computed(() => form.value.jenisElaun === 'ANUGERAH_PA');
const showJenisElaunLain = computed(() => form.value.jenisElaun === 'LAIN_LAIN');
const showJenisJawatanLain = computed(() => form.value.jenisJawatan === 'LAIN_LAIN');
const showKhasNote = computed(() => form.value.jenisElaun === 'KHAS');

watch(() => form.value.jenisElaun, (val) => {
  if (!['ANUGERAH_PA', 'LAIN_LAIN'].includes(val)) {
    form.value.kadarElaun = '';
  }
});

// Simple click handler
const handleClick = () => {
  alert("Maklumat Elaun Sudah berjaya Dihantar");
  navigateTo("/BF-PA/KF/KE");
};
</script> 
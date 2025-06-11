<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold">Siasatan Ringkas</h1>
          <rs-badge :variant="getStatusVariant(aduanData.status)" size="lg">
            {{ aduanData.status }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <div class="space-y-8">
          <!-- Maklumat Aduan -->
          <div class="bg-white p-6 rounded-lg border border-gray-200">
            <h2 class="text-lg font-semibold mb-4">Maklumat Aduan</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-gray-500">No. Aduan</p>
                <p class="font-medium">{{ aduanData.noAduan }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Tarikh Aduan</p>
                <p class="font-medium">
                  {{ formatDate(aduanData.tarikhAduan) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Nama Aduan</p>
                <p class="font-medium">{{ aduanData.namaAduan }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Pernyataan Masalah</p>
                <rs-badge
                  :variant="
                    getPernyataanMasalahVariant(aduanData.pernyataanMasalah)
                  "
                  size="sm"
                >
                  {{ aduanData.pernyataanMasalah }}
                </rs-badge>
              </div>
            </div>
          </div>

          <!-- Maklumat Individu Dibantu -->
          <div class="p-6 rounded-lg border">
            <h2 class="text-lg font-semibold mb-4">
              Maklumat Individu Dibantu
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-gray-500">Nama Penuh</p>
                <p class="font-medium">{{ aduanData.namaPenuh }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">No. Kad Pengenalan</p>
                <p class="font-medium">{{ aduanData.noKadPengenalan }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Emel</p>
                <p class="font-medium">{{ aduanData.emel }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">No. Telefon</p>
                <p class="font-medium">{{ aduanData.noTelefon }}</p>
              </div>
            </div>

            <div class="mt-6">
              <h3 class="text-md font-medium text-gray-700 mb-4">Alamat</h3>
              <div class="space-y-2">
                <p class="font-medium">{{ aduanData.alamatBaris1 }}</p>
                <p class="font-medium">{{ aduanData.alamatBaris2 }}</p>
                <p class="font-medium">{{ aduanData.daerah }}</p>
                <p class="font-medium">{{ aduanData.kariah }}</p>
              </div>
            </div>
          </div>

          <!-- Siasatan Ringkas -->
          <div class="p-6 rounded-lg border">
            <h2 class="text-lg font-semibold mb-4">Siasatan Ringkas</h2>
            <FormKit
              type="form"
              @submit="handleSubmit"
              :actions="false"
            >
              <div class="space-y-6">
                <!-- Verifikasi Maklumat -->
                <div class="space-y-4">
                  <h3 class="text-md font-medium text-gray-700">
                    Verifikasi Maklumat
                  </h3>
                  <FormKit
                    v-model="siasatanData.verifikasiStatus"
                    type="radio"
                    :options="[
                      { label: 'Maklumat Sah', value: 'sah' },
                      { label: 'Maklumat Tidak Sah', value: 'tidak_sah' },
                    ]"
                    validation="required"
                    validation-visibility="dirty"
                    :classes="{
                      fieldset: 'border-0 !p-0',
                      legend: '!font-semibold !text-sm mb-0',
                      options: '!flex !flex-col gap-4 mt-3',
                    }"
                  />

                  <FormKit
                    v-if="siasatanData.verifikasiStatus === 'tidak_sah'"
                    v-model="siasatanData.catatanVerifikasi"
                    label="Catatan Verifikasi"
                    type="textarea"
                    rows="3"
                    validation="required"
                    validation-visibility="dirty"
                  />
                </div>

                <!-- Kemaskini Tahap Keperluan -->
                <div class="space-y-4">
                  <h3 class="text-md font-medium text-gray-700">
                    Kemaskini Tahap Keperluan
                  </h3>
                  <FormKit
                    v-model="siasatanData.perluKemaskini"
                    type="radio"
                    :options="[
                      { label: 'Tidak Perlu', value: 'tidak_perlu' },
                      { label: 'Perlu', value: 'perlu' },
                    ]"
                    validation="required"
                    validation-visibility="dirty"
                    :classes="{
                      fieldset: 'border-0 !p-0',
                      legend: '!font-semibold !text-sm mb-0',
                      options: '!flex !flex-col gap-4 mt-3',
                    }"
                  />

                  <FormKit
                    v-if="siasatanData.perluKemaskini === 'perlu'"
                    v-model="siasatanData.tahapKeperluanBaru"
                    type="select"
                    label="Tahap Keperluan Baru"
                    :options="tahapKeperluanOptions"
                    validation="required"
                    validation-visibility="dirty"
                  />

                  <FormKit
                    v-if="siasatanData.perluKemaskini === 'perlu'"
                    v-model="siasatanData.catatanKemaskini"
                    label="Catatan Kemaskini"
                    type="textarea"
                    rows="3"
                    validation="required"
                    validation-visibility="dirty"
                  />

                  <FormKit
                    v-if="siasatanData.perluKemaskini === 'perlu'"
                    v-model="siasatanData.pegawaiBaru"
                    type="select"
                    label="Pegawai Baru"
                    :options="senaraiPegawai"
                    validation="required"
                    validation-visibility="dirty"
                  />
                </div>

                <!-- Buttons -->
                <div class="flex justify-end gap-4 mt-8">
                  <rs-button
                    type="button"
                    variant="secondary"
                    @click="router.back()"
                  >
                    Kembali
                  </rs-button>
                  <rs-button type="submit" variant="primary" @click="handleSubmit">
                    Simpan & Teruskan
                  </rs-button>
                </div>
              </div>
            </FormKit>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Pengesahan"
      position="center"
      :actions="false"
    >
      <template #body>
        <p class="text-gray-700">
          Adakah anda pasti untuk menyimpan dan meneruskan siasatan ringkas ini?
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-4">
          <rs-button
            variant="secondary"
            @click="showConfirmationModal = false"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="confirmSubmit"
          >
            Ya, Teruskan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

definePageMeta({
  title: "Siasatan Ringkas",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Aduan",
    type: "link",
    path: "/BF-ADN/PA/TS/01",
  },
  {
    name: "Siasatan Ringkas",
    type: "current",
    path: "/BF-ADN/PA/TS/02",
  },
]);

// Sample data - In real application, this would come from an API
const aduanData = ref({
  noAduan: "ADN-2024-001",
  namaAduan: "Aduan Keselamatan",
  pernyataanMasalah:
    "Terputus Bekalan Makanan/Tiada Tempat Tinggal (Kelas 1/Merah)",
  tarikhAduan: "2024-03-15",
  status: "Sedang Diproses",
  namaPenuh: "Ahmad bin Abdullah",
  noKadPengenalan: "800101-01-1234",
  emel: "ahmad@email.com",
  noTelefon: "0123456789",
  alamatBaris1: "No. 123, Jalan Merdeka",
  alamatBaris2: "Taman Seri Indah",
  daerah: "Kuala Lumpur",
  kariah: "Masjid Jamek",
});

const siasatanData = ref({
  verifikasiStatus: "",
  catatanVerifikasi: "",
  perluKemaskini: "",
  tahapKeperluanBaru: "",
  catatanKemaskini: "",
  pegawaiBaru: "",
});

const tahapKeperluanOptions = computed(() => {
  // If current level is Kelas 1, show options for Kelas 2 and 3
  if (aduanData.value.pernyataanMasalah.includes("Kelas 1/Merah")) {
    return [
      {
        label:
          "Masih Ada Bekalan Makanan/Mempunyai Tempat Tinggal/Tiada Sumber Pendapatan (Kelas 2/Kuning)",
        value: "kelas_2",
      },
      {
        label: "Pendapatan Berkurangan/Keperluan Lain (Kelas 3/Hijau)",
        value: "kelas_3",
      },
    ];
  }
  return [];
});

const getStatusVariant = (status) => {
  const variants = {
    "Belum Selesai": "warning",
    "Sedang Diproses": "info",
    Selesai: "success",
  };
  return variants[status] || "default";
};

const getPernyataanMasalahVariant = (pernyataan) => {
  if (pernyataan.includes("Kelas 1/Merah")) return "danger";
  if (pernyataan.includes("Kelas 2/Kuning")) return "warning";
  if (pernyataan.includes("Kelas 3/Hijau")) return "success";
  return "default";
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ms-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const showConfirmationModal = ref(false);

const handleSubmit = async () => {
  showConfirmationModal.value = true;
};

const confirmSubmit = async () => {
  showConfirmationModal.value = false;
  
  // Update status to "Sedang Diproses" if not already
  if (aduanData.value.status === "Belum Selesai") {
    aduanData.value.status = "Sedang Diproses";
  }

  // If pernyataan masalah was updated
  if (siasatanData.value.perluKemaskini === 'perlu' && siasatanData.value.tahapKeperluanBaru) {
    const selectedOption = tahapKeperluanOptions.value.find(
      (opt) => opt.value === siasatanData.value.tahapKeperluanBaru
    );
    if (selectedOption) {
      aduanData.value.pernyataanMasalah = selectedOption.label;
    }
  }

  // Navigate to next step
  router.push("/BF-ADN/PA/TS/04");
};

// Add officer list data
const senaraiPegawai = [
  { label: "En Ali - EOAD", value: "ali_eoad" },
  { label: "Pn Aliah - EOAD", value: "aliah_eoad" },
  { label: "En Abu - SSU", value: "abu_ssu" },
  { label: "En Ahmad - EJ", value: "ahmad_ej" },
];
</script>

<style lang="scss" scoped></style>

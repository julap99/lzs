<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Semak & Lulus / Tidak Lulus Permohonan
          </h2>
          <rs-badge
            v-if="formData.status"
            :variant="getStatusVariant(formData.status)"
          >
            {{ formData.status }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleSubmit"
          v-model="formData"
        >
          <!-- Section 1: Maklumat Permohonan -->
          <rs-fieldset class="mb-6">
            <template #legend>
              <h3 class="text-lg font-medium">Maklumat Permohonan</h3>
            </template>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="idPermohonan"
                label="ID & Nama Pemohon"
                readonly
              />
              <FormKit
                type="text"
                name="jenisBantuan"
                label="Jenis Bantuan, Nilai"
                readonly
              />
              <FormKit
                type="text"
                name="kategoriAsnaf"
                label="Kategori Asnaf"
                readonly
              />
            </div>
          </rs-fieldset>

          <!-- Section 2: Hasil Siasatan -->
          <rs-fieldset class="mb-6">
            <template #legend>
              <h3 class="text-lg font-medium">Hasil Siasatan</h3>
            </template>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Laporan Siasatan EOAD
                </label>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm text-gray-600">
                    {{ formData.laporanSiasatan }}
                  </p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Catatan Sokongan
                </label>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm text-gray-600">
                    {{ formData.catatanSokongan }}
                  </p>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Gambar Bukti / Lokasi
                </label>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div
                    v-for="(image, index) in formData.gambarBukti"
                    :key="index"
                    class="relative aspect-square"
                  >
                    <img
                      :src="image.url"
                      :alt="image.description"
                      class="w-full h-full object-cover rounded-lg cursor-pointer"
                      @click="viewImage(image)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </rs-fieldset>

          <!-- Section 3: Perbandingan dengan Manual Kuasa -->
          <!-- <rs-fieldset class="mb-6">
            <template #legend>
              <h3 class="text-lg font-medium">
                Perbandingan dengan Manual Kuasa
              </h3>
            </template>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Rujukan Manual Kuasa
                </label>
                <a
                  :href="formData.manualKuasaUrl"
                  target="_blank"
                  class="text-primary hover:underline"
                >
                  Lihat Manual Kuasa
                </a>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Validasi Jumlah Bantuan
                </label>
                <div
                  :class="[
                    'p-4 rounded-lg',
                    formData.isJumlahValid
                      ? 'bg-success-50 text-success-700'
                      : 'bg-warning-50 text-warning-700',
                  ]"
                >
                  <p class="text-sm">
                    {{ formData.validasiJumlah }}
                  </p>
                </div>
              </div>

              <div v-if="formData.notaTambahan">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nota Tambahan
                </label>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm text-gray-600">
                    {{ formData.notaTambahan }}
                  </p>
                </div>
              </div>
            </div>
          </rs-fieldset> -->

          <!-- Section 4: Keputusan -->
          <rs-fieldset class="mb-6">
            <template #legend>
              <h3 class="text-lg font-medium">Keputusan</h3>
            </template>

            <div class="space-y-4">
              <FormKit
                type="textarea"
                name="catatanSemakan"
                label="Catatan Semakan"
                placeholder="Masukkan catatan semakan (jika ada)..."
                :rows="4"
              />

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Tarikh & Masa Keputusan
                  </label>
                  <p class="mt-1 text-sm text-gray-600">
                    {{ formatDateTime(formData.tarikhKeputusan) }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Nama Pegawai Penyemak
                  </label>
                  <p class="mt-1 text-sm text-gray-600">
                    {{ formData.namaPegawaiPenyemak }}
                  </p>
                </div>
              </div>
            </div>
          </rs-fieldset>

          <!-- Section 5: Action Buttons -->
          <div class="flex justify-end gap-3 mt-6">
            <rs-button variant="primary-outline" @click="handleCancel">
              Kembali
            </rs-button>
            <rs-button variant="danger" @click="showTidakLulusConfirm = true">
              Tidak Lulus
            </rs-button>
            <rs-button variant="success" @click="showLulusConfirm = true">
              Lulus
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Lulus Confirmation Modal -->
    <rs-modal
      v-model="showLulusConfirm"
      title="Sahkan Kelulusan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-4">
          <div class="text-center">
            <Icon
              name="ph:check-circle"
              class="mx-auto text-success"
              size="3rem"
            />
            <h3 class="mt-4 text-lg font-medium text-gray-900">
              Sahkan Kelulusan Permohonan
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              Adakah anda pasti untuk meluluskan permohonan ini?
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="font-medium">ID Permohonan:</span>
              <span>{{ formData.idPermohonan }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Nama Pemohon:</span>
              <span>{{ formData.namaPemohon }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Status Semasa:</span>
              <span>{{ formData.status }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Status Selepas:</span>
              <span class="text-success">Lulus - Untuk Proses Bayaran</span>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="primary-outline"
            @click="showLulusConfirm = false"
            :disabled="processing"
          >
            Batal
          </rs-button>
          <rs-button
            variant="success"
            @click="handleLulus"
            :loading="processing"
          >
            Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Tidak Lulus Confirmation Modal -->
    <rs-modal
      v-model="showTidakLulusConfirm"
      title="Sahkan Penolakan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-4">
          <div class="text-center">
            <Icon name="ph:x-circle" class="mx-auto text-danger" size="3rem" />
            <h3 class="mt-4 text-lg font-medium text-gray-900">
              Sahkan Penolakan Permohonan
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              Adakah anda pasti untuk menolak permohonan ini?
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="font-medium">ID Permohonan:</span>
              <span>{{ formData.idPermohonan }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Nama Pemohon:</span>
              <span>{{ formData.namaPemohon }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Status Semasa:</span>
              <span>{{ formData.status }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Status Selepas:</span>
              <span class="text-danger">Tidak Lulus - Ditutup</span>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="primary-outline"
            @click="showTidakLulusConfirm = false"
            :disabled="processing"
          >
            Batal
          </rs-button>
          <rs-button
            variant="danger"
            @click="handleTidakLulus"
            :loading="processing"
          >
            Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

definePageMeta({
  title: "Semak & Lulus / Tidak Lulus Permohonan",
});

const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/PB/senarai",
  },
  {
    name: "Sedia Untuk Semakan",
    type: "link",
    path: "/BF-BTN/PB/senarai-sedia-semakan",
  },
  {
    name: "Semak Permohonan",
    type: "current",
    path: `/BF-BTN/PB/senarai-sedia-semakan/${route.params.id}/semak`,
  },
]);

// State
const processing = ref(false);
const showLulusConfirm = ref(false);
const showTidakLulusConfirm = ref(false);

// Form data
const formData = ref({
  idPermohonan: "NAS-2025-0001",
  namaPemohon: "Ahmad bin Abdullah",
  jenisBantuan: "Bantuan Kecemasan - RM 1,000",
  kategoriAsnaf: "Fakir",
  status: "Sedia Untuk Semakan",
  laporanSiasatan:
    "Laporan siasatan menunjukkan pemohon memenuhi kriteria bantuan kecemasan...",
  catatanSokongan: "Pemohon telah menyediakan semua dokumen yang diperlukan...",
  gambarBukti: [
    {
      url: "https://example.com/image1.jpg",
      description: "Gambar premis",
    },
    {
      url: "https://example.com/image2.jpg",
      description: "Gambar lokasi",
    },
  ],
  manualKuasaUrl: "https://example.com/manual-kuasa.pdf",
  isJumlahValid: true,
  validasiJumlah: "Jumlah bantuan dalam had kuasa pegawai",
  notaTambahan: "Pemohon pernah menerima bantuan pada tahun 2023",
  catatanSemakan: "",
  tarikhKeputusan: new Date().toISOString(),
  namaPegawaiPenyemak: "Siti binti Ali",
});

// Methods
const getStatusVariant = (status) => {
  const variants = {
    sedia_untuk_semakan: "warning",
    lulus: "success",
    tidak_lulus: "danger",
  };
  return variants[status.toLowerCase()] || "default";
};

const formatDateTime = (date) => {
  return new Date(date).toLocaleString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const viewImage = (image) => {
  // Implement image viewing logic
  console.log("Viewing image:", image);
};

const handleCancel = () => {
  router.push("/BF-BTN/PB/senarai-sedia-semakan");
};

const handleLulus = async () => {
  try {
    processing.value = true;
    // Implement API call to update status
    formData.value.status = "Lulus - Untuk Proses Bayaran";
    // toast.success("Permohonan telah diluluskan");
    router.push("/BF-BTN/PB/senarai-sedia-semakan");
  } catch (error) {
    // toast.error("Ralat semasa meluluskan permohonan");
    console.error(error);
  } finally {
    processing.value = false;
    showLulusConfirm.value = false;
  }
};

const handleTidakLulus = async () => {
  try {
    processing.value = true;
    // Implement API call to update status
    formData.value.status = "Tidak Lulus - Ditutup";
    // toast.success("Permohonan telah ditolak");
    navigateTo("/BF-BTN/PB/senarai-sedia-semakan");
  } catch (error) {
    // toast.error("Ralat semasa menolak permohonan");
    console.error(error);
  } finally {
    processing.value = false;
    showTidakLulusConfirm.value = false;
  }
};
</script>

<style lang="scss" scoped></style>

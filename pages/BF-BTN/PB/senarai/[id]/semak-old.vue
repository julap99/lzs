<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Lihat / Semak Permohonan & Dokumen
          </h2>
          <rs-badge :variant="getStatusVariant(permohonanData.status)">
            {{ permohonanData.status }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <!-- Section 1: Maklumat Pemohon -->
        <rs-card class="mb-6">
          <template #header>
            <div class="flex items-center">
              <Icon name="heroicons:user" class="mr-2 text-primary" />
              <h3 class="text-lg font-semibold">Maklumat Pemohon</h3>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Nama Pemohon</label
                >
                <p class="mt-1">{{ permohonanData.namaPemohon }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >No Kad Pengenalan</label
                >
                <p class="mt-1">{{ permohonanData.noKP }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Alamat Premis / Lokasi</label
                >
                <p class="mt-1">{{ permohonanData.alamat }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Nombor Telefon / Emel</label
                >
                <p class="mt-1">{{ permohonanData.telefon }}</p>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Section 2: Dokumen Sokongan -->
        <rs-card class="mb-6">
          <template #header>
            <div class="flex items-center">
              <Icon name="heroicons:document" class="mr-2 text-primary" />
              <h3 class="text-lg font-semibold">Dokumen Sokongan</h3>
            </div>
          </template>

          <template #body>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Borang Permohonan Rasmi</label
                  >
                  <div class="mt-1 flex items-center gap-2">
                    <rs-button
                      variant="primary-outline"
                      size="sm"
                      @click="viewDocument('borang')"
                    >
                      <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                      Lihat
                    </rs-button>
                    <rs-button
                      variant="secondary-outline"
                      size="sm"
                      @click="downloadDocument('borang')"
                    >
                      <Icon name="ph:download" class="w-4 h-4 mr-1" />
                      Muat Turun
                    </rs-button>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Surat Kelulusan</label
                  >
                  <div class="mt-1 flex items-center gap-2">
                    <rs-button
                      variant="primary-outline"
                      size="sm"
                      @click="viewDocument('surat')"
                    >
                      <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                      Lihat
                    </rs-button>
                    <rs-button
                      variant="secondary-outline"
                      size="sm"
                      @click="downloadDocument('surat')"
                    >
                      <Icon name="ph:download" class="w-4 h-4 mr-1" />
                      Muat Turun
                    </rs-button>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Sebutharga / Invois</label
                  >
                  <div class="mt-1 flex items-center gap-2">
                    <rs-button
                      variant="primary-outline"
                      size="sm"
                      @click="viewDocument('sebutharga')"
                    >
                      <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                      Lihat
                    </rs-button>
                    <rs-button
                      variant="secondary-outline"
                      size="sm"
                      @click="downloadDocument('sebutharga')"
                    >
                      <Icon name="ph:download" class="w-4 h-4 mr-1" />
                      Muat Turun
                    </rs-button>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Salinan Geran / Hak Milik Premis</label
                  >
                  <div class="mt-1 flex items-center gap-2">
                    <rs-button
                      variant="primary-outline"
                      size="sm"
                      @click="viewDocument('geran')"
                    >
                      <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                      Lihat
                    </rs-button>
                    <rs-button
                      variant="secondary-outline"
                      size="sm"
                      @click="downloadDocument('geran')"
                    >
                      <Icon name="ph:download" class="w-4 h-4 mr-1" />
                      Muat Turun
                    </rs-button>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Gambar Premis</label
                  >
                  <div class="mt-1 flex items-center gap-2">
                    <rs-button
                      variant="primary-outline"
                      size="sm"
                      @click="viewDocument('gambar')"
                    >
                      <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                      Lihat
                    </rs-button>
                    <rs-button
                      variant="secondary-outline"
                      size="sm"
                      @click="downloadDocument('gambar')"
                    >
                      <Icon name="ph:download" class="w-4 h-4 mr-1" />
                      Muat Turun
                    </rs-button>
                  </div>
                </div>
              </div>

              <div class="mt-4">
                <FormKit
                  v-model="dokumenLengkap"
                  type="select"
                  label="Dokumen Lengkap?"
                  :options="[
                    { label: 'Ya', value: true },
                    { label: 'Tidak', value: false },
                  ]"
                />
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Section 3: Maklumat Permohonan Terdahulu -->
        <rs-card class="mb-6">
          <template #header>
            <div class="flex items-center">
              <Icon name="heroicons:clock" class="mr-2 text-primary" />
              <h3 class="text-lg font-semibold">
                Maklumat Permohonan Terdahulu
              </h3>
            </div>
          </template>

          <template #body>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >ID Permohonan</label
                >
                <p class="mt-1">{{ permohonanData.idPermohonan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Sejarah Permohonan Bantuan</label
                >
                <div class="mt-2">
                  <rs-table
                    :data="permohonanData.sejarahPermohonan"
                    :columns="[
                      { key: 'id', label: 'ID Permohonan' },
                      { key: 'tarikh', label: 'Tarikh' },
                      { key: 'status', label: 'Status' },
                    ]"
                    :options="{
                      variant: 'default',
                      hover: true,
                    }"
                  >
                    <template v-slot:status="{ text }">
                      <rs-badge :variant="getStatusVariant(text)">
                        {{ text }}
                      </rs-badge>
                    </template>
                  </rs-table>
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Section 4: Action & Status -->
        <rs-card class="mb-6">
          <template #header>
            <div class="flex items-center">
              <Icon
                name="heroicons:clipboard-document-check"
                class="mr-2 text-primary"
              />
              <h3 class="text-lg font-semibold">Action & Status</h3>
            </div>
          </template>

          <template #body>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Status Permohonan</label
                >
                <FormKit
                  v-model="statusPermohonan"
                  type="select"
                  :options="statusOptions"
                  :classes="{
                    input:
                      'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm',
                  }"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Catatan Pegawai</label
                >
                <FormKit
                  v-model="catatanPegawai"
                  type="textarea"
                  :classes="{
                    input:
                      'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm',
                  }"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Tarikh Semak</label
                >
                <p class="mt-1">
                  {{ formatDateTime(permohonanData.tarikhSemak) }}
                </p>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Section 5: Action Buttons -->
        <div class="flex justify-end gap-4 mt-6">
          <rs-button variant="secondary" @click="handleCancel">
            Batal / Kembali
          </rs-button>
          <rs-button
            variant="danger"
            :disabled="!dokumenLengkap"
            @click="showTidakLengkapConfirmation = true"
          >
            Tandakan Tidak Lengkap
          </rs-button>
          <rs-button
            variant="primary"
            :disabled="!dokumenLengkap"
            @click="showLengkapConfirmation = true"
          >
            Simpan & Tandakan Lengkap
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Confirmation Modals -->
    <rs-modal
      v-model="showTidakLengkapConfirmation"
      title="Sahkan Tindakan"
      position="center"
    >
      <template #body>
        <p>
          Adakah anda pasti untuk menandakan permohonan ini sebagai tidak
          lengkap?
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button
            variant="secondary"
            @click="showTidakLengkapConfirmation = false"
          >
            Batal
          </rs-button>
          <rs-button variant="primary" @click="confirmTidakLengkap">
            Ya, Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <rs-modal
      v-model="showLengkapConfirmation"
      title="Sahkan Tindakan"
      position="center"

    >
      <template #body>
        <p>
          Adakah anda pasti untuk menandakan permohonan ini sebagai lengkap?
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button
            variant="secondary"
            @click="showLengkapConfirmation = false"
          >
            Batal
          </rs-button>
          <rs-button variant="primary" @click="confirmLengkap">
            Ya, Sahkan
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
  title: "Lihat / Semak Permohonan & Dokumen",
});

const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/PB/senarai",
  },
  {
    name: "Senarai untuk Disemak",
    type: "link",
    path: "/BF-BTN/PB/senarai",
  },
  {
    name: "Semak Permohonan",
    type: "current",
    path: `/BF-BTN/PB/senarai/${route.params.id}/semak`,
  },
]);

// Mock data - would be replaced with API call
const permohonanData = ref({
  idPermohonan: "NAS-2025-0001",
  namaPemohon: "Ahmad bin Abdullah",
  noKP: "800101-01-1234",
  alamat: "No. 123, Jalan ABC, Taman XYZ, 50000 Kuala Lumpur",
  telefon: "012-3456789",
  status: "Dalam Semakan",
  tarikhSemak: new Date().toISOString(),
  sejarahPermohonan: [
    {
      id: "NAS-2024-0001",
      tarikh: "2024-01-15",
      status: "Lulus",
    },
    {
      id: "NAS-2023-0001",
      tarikh: "2023-06-20",
      status: "Lulus",
    },
  ],
});

// State
const dokumenLengkap = ref(false);
const statusPermohonan = ref("dalam_semakan");
const catatanPegawai = ref("");

// Status options
const statusOptions = [
  { label: "Lengkap", value: "lengkap" },
  { label: "Tidak Lengkap", value: "tidak_lengkap" },
];

// Confirmation states
const showTidakLengkapConfirmation = ref(false);
const showLengkapConfirmation = ref(false);

// Methods
const getStatusVariant = (status) => {
  const variants = {
    baru: "info",
    dalam_semakan: "warning",
    tidak_lengkap: "danger",
    untuk_siasatan: "secondary",
    lulus: "success",
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

const viewDocument = (type) => {
  // Implement document viewing logic
  console.log(`Viewing document: ${type}`);
};

const downloadDocument = (type) => {
  // Implement document download logic
  console.log(`Downloading document: ${type}`);
};

const handleLengkap = () => {
  // Implement complete action
  router.push("/BF-BTN/PB/senarai");
};

const handleTidakLengkap = () => {
  // Implement incomplete action
  router.push("/BF-BTN/PB/senarai");
};

const handleCancel = () => {
  router.push("/BF-BTN/PB/senarai");
};

const confirmLengkap = () => {
  showLengkapConfirmation.value = false;
  handleLengkap();
};

const confirmTidakLengkap = () => {
  showTidakLengkapConfirmation.value = false;
  handleTidakLengkap();
};
</script>

<style lang="scss" scoped></style>

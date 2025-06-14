# Complete TDS-02 page implementation
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="space-y-6">
      <!-- Section 1: Maklumat Tuntutan -->
      <rs-card>
        <template #header>
          <div class="flex items-center">
            <h2 class="text-xl font-semibold">Maklumat Tuntutan</h2>
          </div>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                ID Permohonan Tuntutan
              </label>
              <p class="text-gray-900">{{ tuntutanData.idTuntutan }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                No. GL
              </label>
              <p class="text-gray-900">{{ tuntutanData.noGL }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Amaun Tuntutan
              </label>
              <p class="text-gray-900">
                RM {{ formatNumber(tuntutanData.amaunTuntutan) }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tarikh Hantar Notifikasi
              </label>
              <p class="text-gray-900">
                {{ formatDate(tuntutanData.tarikhNotifikasi) }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Pegawai ETD/EOAD
              </label>
              <p class="text-gray-900">{{ pegawaiInfo }}</p>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Section 2: Maklumat GL / Invoice -->
      <rs-card>
        <template #header>
          <div class="flex items-center">
            <h2 class="text-xl font-semibold">Maklumat GL / Invoice</h2>
          </div>
        </template>
        <template #body>
          <div class="space-y-6">
            <!-- GL/Invoice Documents -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Maklumat GL / Invoice
              </label>
              <div class="flex items-center space-x-2">
                <rs-button
                  variant="secondary"
                  size="sm"
                  @click="viewDocument(tuntutanData.dokumenGL)"
                >
                  <Icon name="material-symbols:visibility" class="mr-1" />
                  Lihat
                </rs-button>
                <rs-button
                  variant="secondary"
                  size="sm"
                  @click="downloadDocument(tuntutanData.dokumenGL)"
                >
                  <Icon name="material-symbols:download" class="mr-1" />
                  Muat Turun
                </rs-button>
              </div>
            </div>

            <!-- Project/Institution Background -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Latar Belakang Projek/Institusi
              </label>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-gray-900">{{ tuntutanData.latarBelakang }}</p>
              </div>
            </div>

            <!-- Supporting Documents -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Dokumen Sokongan
              </label>
              <div class="space-y-2">
                <div
                  v-for="doc in tuntutanData.dokumenSokongan"
                  :key="doc.id"
                  class="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <span class="text-gray-900">{{ doc.nama }}</span>
                  <div class="flex space-x-2">
                    <rs-button
                      variant="secondary"
                      size="sm"
                      @click="viewDocument(doc)"
                    >
                      <Icon name="material-symbols:visibility" class="mr-1" />
                      Lihat
                    </rs-button>
                    <rs-button
                      variant="secondary"
                      size="sm"
                      @click="downloadDocument(doc)"
                    >
                      <Icon name="material-symbols:download" class="mr-1" />
                      Muat Turun
                    </rs-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Section 3: Dapatan & Pengesahan -->
      <rs-card>
        <template #header>
          <div class="flex items-center">
            <h2 class="text-xl font-semibold">Dapatan & Pengesahan</h2>
          </div>
        </template>
        <template #body>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Perlu Lawatan Tapak?
              </label>

              <FormKit
                type="select"
                v-model="perluLawatanTapak"
                :options="[
                  { label: 'Ya', value: true },
                  { label: 'Tidak', value: false }
                ]"
                placeholder="Sila pilih..."
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Catatan Laporan Pengesahan
              </label>
              <FormKit
                type="textarea"
                v-model="catatanPengesahan"
                validation="required"
                :validation-messages="{
                  required:
                    'Catatan diperlukan jika tidak menyokong permohonan',
                }"
                placeholder="Sila masukkan catatan pengesahan..."
                rows="4"
              />
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Section 4: Action & Status -->
      <rs-card>
        <template #body>
          <div class="flex justify-end space-x-4">
            <rs-button
              variant="danger"
              @click="showTidakSokongModal = true"
              :disabled="processing"
            >
              <Icon name="material-symbols:close" class="mr-1" />
              Tidak Sokong — Kembali ke Pemohon
            </rs-button>
            <rs-button
              variant="primary"
              @click="showSokongModal = true"
              :disabled="processing"
            >
              <Icon name="material-symbols:check" class="mr-1" />
              Sokong & Hantar ke Pelulus
            </rs-button>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Sokong Confirmation Modal -->
    <rs-modal
      v-model="showSokongModal"
      title="Pengesahan Sokong"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-4">
          <div class="text-center">
            <Icon
              name="ph:warning-circle"
              class="mx-auto text-warning"
              size="3rem"
            />
            <h3 class="mt-4 text-lg font-medium text-gray-900">
              Sahkan Sokongan Tuntutan
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              Adakah anda pasti untuk menyokong tuntutan ini dan menghantar ke pelulus?
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="font-medium">ID Tuntutan:</span>
              <span>{{ tuntutanData.idTuntutan }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">No. GL:</span>
              <span>{{ tuntutanData.noGL }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Amaun Tuntutan:</span>
              <span>RM {{ formatNumber(tuntutanData.amaunTuntutan) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Perlu Lawatan Tapak:</span>
              <span>{{ perluLawatanTapak ? 'Ya' : 'Tidak' }}</span>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="primary-outline"
            @click="showSokongModal = false"
            :disabled="processing"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="handleSokong"
            :loading="processing"
          >
            Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Tidak Sokong Confirmation Modal -->
    <rs-modal
      v-model="showTidakSokongModal"
      title="Pengesahan Tidak Sokong"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-4">
          <div class="text-center">
            <Icon
              name="ph:warning-circle"
              class="mx-auto text-warning"
              size="3rem"
            />
            <h3 class="mt-4 text-lg font-medium text-gray-900">
              Sahkan Tidak Sokong Tuntutan
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              Adakah anda pasti untuk tidak menyokong tuntutan ini dan mengembalikan kepada pemohon?
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="font-medium">ID Tuntutan:</span>
              <span>{{ tuntutanData.idTuntutan }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">No. GL:</span>
              <span>{{ tuntutanData.noGL }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Amaun Tuntutan:</span>
              <span>RM {{ formatNumber(tuntutanData.amaunTuntutan) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Catatan:</span>
              <span>{{ catatanPengesahan || '-' }}</span>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="primary-outline"
            @click="showTidakSokongModal = false"
            :disabled="processing"
          >
            Batal
          </rs-button>
          <rs-button
            variant="danger"
            @click="handleTidakSokong"
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
import { ref, computed } from "vue";

const route = useRoute();

definePageMeta({
  title: "Pengesahan Tuntutan",
});

const breadcrumb = ref([
  {
    name: "Tuntutan",
    type: "link",
    path: "/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad",
  },
  {
    name: "Senarai Tuntutan EOAD",
    type: "link",
    path: "/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad",
  },
  {
    name: "Pengesahan",
    type: "current",
    path: `/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad/${route.params.id}/pengesahan`,
  },
]);

// Form state
const perluLawatanTapak = ref(false);
const catatanPengesahan = ref("");

// Add modal state variables
const showSokongModal = ref(false);
const showTidakSokongModal = ref(false);
const processing = ref(false);

// Sample data - in real app, this would be fetched from API
const tuntutanData = ref({
  idTuntutan: "TUN-2024-001",
  noGL: "GL-001-2024",
  amaunTuntutan: 5000.0,
  tarikhNotifikasi: new Date().toISOString(),
  latarBelakang: "Projek pembangunan komuniti di kawasan...",
  dokumenGL: {
    id: "DOC-001",
    nama: "GL_Report_2024.pdf",
    url: "/documents/gl_report.pdf",
  },
  dokumenSokongan: [
    {
      id: "DOC-002",
      nama: "Invoice_Jan2024.pdf",
      url: "/documents/invoice.pdf",
    },
    {
      id: "DOC-003",
      nama: "Quotation_2024.pdf",
      url: "/documents/quotation.pdf",
    },
  ],
});

// Get current user info - in real app, this would come from auth state
const pegawaiInfo = computed(() => {
  return "Siti Aminah binti Abdullah (ETD)";
});

// Computed properties
const isFormValid = computed(() => {
  if (!perluLawatanTapak.value) {
    return catatanPengesahan.value.length > 0;
  }
  return true;
});

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("ms-MY");
};

const formatNumber = (number) => {
  return new Intl.NumberFormat("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

const viewDocument = (doc) => {
  // Implement document viewing logic
  window.open(doc.url, "_blank");
};

const downloadDocument = (doc) => {
  // Implement document download logic
  const link = document.createElement("a");
  link.href = doc.url;
  link.download = doc.nama;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const handleSokong = async () => {
  try {
    processing.value = true;
    // Implement approval logic here
    // Record in audit trail
    await recordAuditTrail({
      pegawai: pegawaiInfo.value,
      tindakan: "Sokong",
      catatan: catatanPengesahan.value,
    });

    // Navigate back to listing with success message
    navigateTo("/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad", {
      query: {
        success: "Tuntutan telah disokong dan dihantar ke pelulus",
      },
    });
  } catch (error) {
    console.error("Error processing approval:", error);
  } finally {
    processing.value = false;
    showSokongModal.value = false;
  }
};

const handleTidakSokong = async () => {
  try {
    processing.value = true;
    // Implement rejection logic here
    // Record in audit trail
    await recordAuditTrail({
      pegawai: pegawaiInfo.value,
      tindakan: "Tidak Sokong",
      catatan: catatanPengesahan.value,
    });

    // Navigate back to listing with info message
    navigateTo("/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad", {
      query: {
        info: "Tuntutan telah dikembalikan kepada pemohon untuk penambahbaikan",
      },
    });
  } catch (error) {
    console.error("Error processing rejection:", error);
  } finally {
    processing.value = false;
    showTidakSokongModal.value = false;
  }
};

const recordAuditTrail = async (data) => {
  // Implement audit trail recording logic
  console.log("Recording audit trail:", data);
};
</script>

<style lang="scss" scoped>
// Add any custom styles here if needed
</style>

# Complete TDS-02 page implementation
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="space-y-6">
      <!-- Section 1: Maklumat Bantuan -->
      <rs-card>
        <template #header>
          <div class="flex items-center">
            <h2 class="text-xl font-semibold">Maklumat Bantuan</h2>
          </div>
        </template>
        <template #body>
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 class="text-md font-medium mb-4">Butiran Asas Jenis Bantuan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Kod Bantuan
                </label>
                <p class="text-gray-900">{{ bantuanData.kodBantuan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Bantuan
                </label>
                <p class="text-gray-900">{{ bantuanData.jenisBantuan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Bahan Bantuan
                </label>
                <p class="text-gray-900">{{ bantuanData.bahanBantuan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Pakej Bantuan
                </label>
                <p class="text-gray-900">{{ bantuanData.pakejBantuan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Kelayakan Bantuan
                </label>
                <p class="text-gray-900">{{ bantuanData.kelayakanBantuan }}</p>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Section 2: Maklumat Tuntutan -->
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

      <!-- Section 3: Maklumat GL / Invoice -->
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

      <!-- Section 4: Kaedah Siasatan -->
      <rs-card>
        <template #header>
          <div class="flex items-center">
            <h2 class="text-xl font-semibold">Kaedah Siasatan</h2>
          </div>
        </template>
        <template #body>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Cara Siasatan
              </label>
              <FormKit
                type="select"
                v-model="perluLawatanTapak"
                :options="[
                  { label: 'Lapangan', value: true },
                  { label: 'Telefon', value: false },
                  { label: 'Semak Dokumen Sahaja', value: false }
                ]"
                placeholder="Sila pilih..."
              />
              <div v-if="perluLawatanTapak" class="mt-4 space-y-4">
                <FormKit
                  type="date"
                  v-model="tarikhLawatanTapak"
                  label="Tarikh Lawatan Tapak"
                  validation="required"
                  :validation-messages="{ required: 'Sila pilih tarikh lawatan tapak' }"
                />
                <FormKit
                  type="time"
                  v-model="masaLawatanTapak"
                  label="Masa Lawatan Tapak"
                  validation="required"
                  :validation-messages="{ required: 'Sila pilih masa lawatan tapak' }"
                  format="24hr"
                />
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Section 5: Pengesahan EOAD & Action -->
      <rs-card>
        <template #header>
          <div class="flex items-center">
            <h2 class="text-xl font-semibold">Pengesahan EOAD</h2>
          </div>
        </template>
        <template #body>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Keputusan Pengesahan
              </label>
              <div class="space-x-4">
                <FormKit
                  type="radio"
                  name="keputusan"
                  v-model="form.keputusan"
                  :options="[
                    { label: 'Sokong', value: 'Sokong' },
                    { label: 'Tidak Sokong', value: 'Tidak Sokong' },
                  ]"
                  :validation="[['required']]"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Catatan Laporan Pengesahan (EOAD)
              </label>
              <FormKit
                type="textarea"
                v-model="form.catatan"
                placeholder="Sila masukkan catatan pengesahan..."
                validation="required_if:keputusan,Tidak Sokong"
                :validation-messages="{
                  required_if: 'Catatan diperlukan untuk keputusan Tidak Sokong',
                }"
                rows="4"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tarikh Pengesahan
                </label>
                <div class="text-gray-900">{{ formatDate(new Date()) }}</div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Pegawai EOAD
                </label>
                <div class="text-gray-900">{{ pegawaiInfo }}</div>
              </div>
            </div>

            <div class="flex justify-end space-x-4 pt-4">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleCancel"
                :disabled="processing"
              >
                Batal
              </rs-button>
              <rs-button
                type="submit"
                :variant="form.keputusan === 'Sokong' ? 'primary' : 'danger'"
                :disabled="processing || !form.keputusan"
                @click="handleSubmit"
              >
                {{ form.keputusan === "Sokong" ? "Sokong & Hantar" : "Tidak Sokong" }}
              </rs-button>
            </div>
          </form>
        </template>
      </rs-card>
    </div>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      :title="
        form.keputusan === 'Sokong'
          ? 'Pengesahan Sokong'
          : 'Pengesahan Tidak Sokong'
      "
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
              {{ form.keputusan === 'Sokong' ? 'Sahkan Sokongan Tuntutan' : 'Sahkan Tidak Sokong Tuntutan' }}
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              {{ form.keputusan === 'Sokong' 
                ? 'Adakah anda pasti untuk menyokong tuntutan ini dan menghantar ke pelulus?' 
                : 'Adakah anda pasti untuk tidak menyokong tuntutan ini dan mengembalikan kepada pemohon?' 
              }}
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
            <div class="flex justify-between">
              <span class="font-medium">Catatan:</span>
              <span>{{ form.catatan || '-' }}</span>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="primary-outline"
            @click="showConfirmationModal = false"
            :disabled="processing"
          >
            Batal
          </rs-button>
          <rs-button
            :variant="form.keputusan === 'Sokong' ? 'primary' : 'danger'"
            @click="handleConfirm"
            :loading="processing"
          >
            {{ form.keputusan === 'Sokong' ? 'Sahkan' : 'Sahkan' }}
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
    name: "Senarai Tuntutan",
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
const form = ref({
  keputusan: "",
  catatan: "",
});

const perluLawatanTapak = ref(false);
const tarikhLawatanTapak = ref("");
const masaLawatanTapak = ref("");

// Modal state variables
const showConfirmationModal = ref(false);
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

// Sample bantuan data - in real app, this would be fetched from API based on GL
const bantuanData = ref({
  kodBantuan: "B400",
  jenisBantuan: "(HQ) BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA",
  bahanBantuan: "(HQ) BANTUAN SUMBANGAN PERALATAN INSTITUSI AGAMA",
  pakejBantuan: "(GL) (HQ) BANTUAN SUMBANGAN KARPET INSTITUSI AGAMA",
  kelayakanBantuan: "(GL) (HQ) BANTUAN SUMBANGAN KARPET INSTITUSI AGAMA",
});

// Get current user info - in real app, this would come from auth state
const pegawaiInfo = computed(() => {
  return "Siti Aminah binti Abdullah (ETD)";
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

const handleSubmit = () => {
  if (!form.value.keputusan) {
    return;
  }
  showConfirmationModal.value = true;
};

const handleConfirm = async () => {
  try {
    processing.value = true;
    
    if (form.value.keputusan === 'Sokong') {
      // Implement approval logic here
      await recordAuditTrail({
        pegawai: pegawaiInfo.value,
        tindakan: "Sokong",
        catatan: form.value.catatan,
      });

      // Navigate back to listing with success message
      navigateTo("/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad", {
        query: {
          success: "Tuntutan telah disokong dan dihantar ke pelulus",
        },
      });
    } else {
      // Implement rejection logic here
      await recordAuditTrail({
        pegawai: pegawaiInfo.value,
        tindakan: "Tidak Sokong",
        catatan: form.value.catatan,
      });

      // Navigate back to listing with info message
      navigateTo("/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad", {
        query: {
          info: "Tuntutan telah dikembalikan kepada pemohon untuk penambahbaikan",
        },
      });
    }
  } catch (error) {
    console.error("Error processing decision:", error);
  } finally {
    processing.value = false;
    showConfirmationModal.value = false;
  }
};

const handleCancel = () => {
  navigateTo("/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad");
};

const recordAuditTrail = async (data) => {
  // Implement audit trail recording logic
  console.log("Recording audit trail:", data);
};
</script>

<style lang="scss" scoped>
// Add any custom styles here if needed
</style>

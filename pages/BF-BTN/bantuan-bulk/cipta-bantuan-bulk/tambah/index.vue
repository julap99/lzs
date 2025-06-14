<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="space-y-4 mt-4">
      <!-- Maklumat Umum Section -->
      <rs-card>
        <template #header>
          <h2 class="text-xl font-semibold">Maklumat Umum</h2>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Kod BP -->
            <FormKit
              type="text"
              name="kodBP"
              label="Kod BP"
              placeholder="BP-2025-00004"
              disabled
              help="Auto-generate selepas simpan"
              v-model="formData.kodBP"
            />

            <!-- Tajuk -->
            <FormKit
              type="text"
              name="tajuk"
              label="Tajuk"
              placeholder="cth: Wang Saku Fakir Mac 2025"
              validation="required"
              v-model="formData.tajuk"
            />

            <!-- Kategori Asnaf -->
            <FormKit
              type="select"
              name="kategoriAsnaf"
              label="Kategori Asnaf"
              :options="kategoriAsnafOptions"
              placeholder="Pilih kategori asnaf"
              validation="required"
              v-model="formData.kategoriAsnaf"
            />

            <!-- Status -->
            <FormKit
              type="text"
              name="status"
              label="Status"
              v-model="formData.status"
              disabled
            />

            <!-- Jumlah Amaun -->
            <FormKit
              type="text"
              name="jumlahAmaun"
              label="Jumlah Amaun (RM)"
              v-model="formData.jumlahAmaun"
              disabled
              help="Auto-calculate selepas import Excel"
            />

            <!-- Catatan -->
            <FormKit
              type="textarea"
              name="catatan"
              label="Catatan"
              placeholder="cth: Tuntutan wang saku pelajar..."
              validation="required"
              v-model="formData.catatan"
              :classes="{
                input: 'h-24',
              }"
            />

            <!-- Tarikh Mohon -->
            <FormKit
              type="text"
              name="tarikhMohon"
              label="Tarikh Mohon"
              v-model="formData.tarikhMohon"
              disabled
            />

            <!-- Dicipta Oleh -->
            <FormKit
              type="text"
              name="diciptaOleh"
              label="Dicipta Oleh"
              v-model="formData.diciptaOleh"
              disabled
              help="Auto-fill selepas simpan"
            />

            <!-- Dicipta Pada -->
            <FormKit
              type="text"
              name="diciptaPada"
              label="Dicipta Pada"
              v-model="formData.diciptaPada"
              disabled
              help="Auto-fill selepas simpan"
            />
          </div>
        </template>
      </rs-card>

      <!-- Maklumat Bantuan Section -->
      <rs-card>
        <template #header>
          <h2 class="text-xl font-semibold">Maklumat Bantuan</h2>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Kategori Bantuan -->
            <FormKit
              type="text"
              name="kategoriBantuan"
              label="Kategori Bantuan"
              v-model="formData.kategoriBantuan"
              disabled
            />

            <!-- Sub-Kategori -->
            <FormKit
              type="text"
              name="subKategori"
              label="Sub-Kategori"
              v-model="formData.subKategori"
              disabled
            />

            <!-- Bantuan -->
            <FormKit
              type="select"
              name="bantuan"
              label="Bantuan"
              :options="bantuanOptions"
              placeholder="Pilih bantuan"
              validation="required"
              v-model="formData.bantuan"
            />

            <!-- Kod Bantuan -->
            <FormKit
              type="text"
              name="kodBantuan"
              label="Kod Bantuan"
              v-model="formData.kodBantuan"
              disabled
              help="Auto-generate berdasarkan bantuan"
            />

            <!-- Produk Bantuan -->
            <FormKit
              type="select"
              name="produkBantuan"
              label="Produk Bantuan"
              :options="produkBantuanOptions"
              placeholder="Pilih produk bantuan"
              validation="required"
              v-model="formData.produkBantuan"
            />

            <!-- Penyiasat -->
            <FormKit
              type="select"
              name="penyiasat"
              label="Penyiasat"
              :options="penyiasatOptions"
              placeholder="Pilih penyiasat"
              validation="required"
              v-model="formData.penyiasat"
            />

            <!-- Cawangan -->
            <FormKit
              type="select"
              name="cawangan"
              label="Cawangan"
              :options="cawanganOptions"
              placeholder="Pilih cawangan"
              validation="required"
              v-model="formData.cawangan"
            />
          </div>
        </template>
      </rs-card>

      <!-- Import Data Section -->
      <rs-card>
        <template #header>
          <h2 class="text-xl font-semibold">Import Data</h2>
        </template>
        <template #body>
          <div class="space-y-4" :class="{ loading: isLoading }">
            <!-- File Upload -->
            <FormKit
              type="file"
              name="importFile"
              label="Muat Naik Fail"
              accept=".xlsx,.xls"
              help="Format fail: Excel (.xlsx, .xls)"
              validation="required"
              @change="handleFileUpload"
            />

            <!-- Import Button -->
            <rs-button
              variant="primary"
              :disabled="!selectedFile || isLoading"
              @click="handleImport"
            >
              <Icon name="material-symbols:upload" class="mr-1" />
              {{ isLoading ? "Sedang Import..." : "Import" }}
            </rs-button>
          </div>
        </template>
      </rs-card>

      <!-- Maklumat Bayaran Kepada Section -->
      <rs-card>
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Maklumat Bayaran Kepada</h2>
            <rs-button variant="primary" @click="handleAddPayment">
              <Icon name="material-symbols:add" class="mr-1" /> Tambah
            </rs-button>
          </div>
        </template>
        <template #body>
          <!-- Debug info -->
          <div class="mb-4 p-2 bg-gray-100 text-sm">
            Debug: Payment list length: {{ paymentList.length }}
          </div>

          <!-- Payment List -->
          <div
            v-if="paymentList.length === 0"
            class="text-center py-8 text-gray-500"
          >
            Tiada maklumat bayaran. Klik "Tambah" untuk menambah maklumat
            bayaran.
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="(payment, index) in paymentList"
              :key="payment.kod"
              class="border rounded-lg p-4 bg-white shadow-sm flex justify-between items-center"
            >
              <div class="flex-1">
                <div class="font-semibold text-lg text-gray-900">
                  {{ payment.bayaranKepada || "Tiada Maklumat" }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ payment.kod }} • RM {{ formatNumber(payment.amaun) }}
                </div>
              </div>

              <div class="flex space-x-2">
                <rs-button
                  variant="info"
                  size="sm"
                  class="flex gap-2"
                  @click="handleEditPaymentModal(payment)"
                >
                  <Icon name="material-symbols:visibility" class="h-4 w-4" />
                  Lebih
                </rs-button>
                <rs-button
                  variant="danger"
                  size="sm"
                  @click="handleDeletePayment(payment)"
                >
                  <Icon name="material-symbols:delete" class="h-4 w-4" />
                </rs-button>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Senarai Penerima Section -->
      <rs-card>
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Senarai Penerima</h2>
            <rs-button variant="primary" @click="handleAddRecipient">
              <Icon name="material-symbols:add" class="mr-1" /> Tambah
            </rs-button>
          </div>
        </template>
        <template #body>
          <!-- Debug info -->
          <div class="mb-4 p-2 bg-gray-100 text-sm">
            Debug: Recipient list length: {{ recipientList.length }}
          </div>

          <!-- Recipient List -->
          <div
            v-if="recipientList.length === 0"
            class="text-center py-8 text-gray-500"
          >
            Tiada maklumat penerima. Klik "Tambah" untuk menambah maklumat
            penerima.
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="(recipient, index) in recipientList"
              :key="recipient.id || recipient.namaPenuh + index"
              class="border rounded-lg p-4 bg-white shadow-sm flex justify-between items-center"
            >
              <div class="flex-1">
                <div class="font-semibold text-lg text-gray-900">
                  {{ recipient.namaPenuh || "Penerima " + (index + 1) }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ recipient.kategoriAsnaf }} • RM
                  {{ formatNumber(recipient.amaun) }}
                </div>
              </div>

              <div class="flex space-x-2">
                <rs-button
                  variant="info"
                  size="sm"
                  class="flex gap-2"
                  @click="handleEditRecipientModal(recipient)"
                >
                  <Icon name="material-symbols:visibility" class="h-4 w-4" />
                  Lebih
                </rs-button>
                <rs-button
                  variant="danger"
                  size="sm"
                  @click="handleDeleteRecipient(recipient)"
                >
                  <Icon name="material-symbols:delete" class="h-4 w-4" />
                </rs-button>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Muat Naik Dokumen Section -->
      <rs-card>
        <template #header>
          <h2 class="text-xl font-semibold">Muat Naik Dokumen</h2>
        </template>
        <template #body>
          <div class="space-y-4" :class="{ loading: isLoading }">
            <FormKit
              type="file"
              name="documentFile"
              label="Muat Naik Fail"
              accept=".pdf,.doc,.docx"
              help="Format fail: PDF, Word (.pdf, .doc, .docx)"
              @change="handleDocumentUpload"
            />
            <rs-button
              variant="primary"
              :disabled="!selectedDocument || isLoading"
              @click="handleDocumentImport"
            >
              <Icon name="material-symbols:upload" class="mr-1" />
              {{ isLoading ? "Sedang Muat Naik..." : "Import" }}
            </rs-button>
          </div>
        </template>
      </rs-card>

      <!-- Action Buttons -->
      <div class="form-actions">
        <div class="flex justify-end space-x-4">
          <rs-button
            variant="secondary"
            @click="navigateBack"
            :disabled="isSubmitting"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="handleSave"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Sedang Simpan..." : "Simpan" }}
          </rs-button>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <rs-modal
      v-model="showPaymentModal"
      :title="
        paymentModalMode === 'add'
          ? 'Tambah Maklumat Bayaran'
          : 'Edit Maklumat Bayaran'
      "
      size="lg"
    >
      <div class="space-y-4">
        <!-- Kod BP -->
        <FormKit
          type="text"
          name="kod"
          label="Kod"
          v-model="paymentForm.kod"
          disabled
        />

        <!-- Bayaran Kepada -->
        <FormKit
          type="text"
          name="bayaranKepada"
          label="Bayaran Kepada"
          v-model="paymentForm.bayaranKepada"
          placeholder="Masukkan bayaran kepada"
          validation="required"
        />

        <!-- Asnaf -->
        <FormKit
          type="select"
          name="asnaf"
          label="Asnaf"
          v-model="paymentForm.asnaf"
          :options="kategoriAsnafOptions"
          placeholder="Pilih asnaf"
          validation="required"
        />

        <!-- Contributor -->
        <FormKit
          type="text"
          name="contributor"
          label="Contributor"
          v-model="paymentForm.contributor"
          placeholder="Masukkan contributor"
        />

        <!-- Recipient -->
        <FormKit
          type="text"
          name="recipient"
          label="Recipient"
          v-model="paymentForm.recipient"
          placeholder="Masukkan recipient"
        />

        <!-- Organization -->
        <FormKit
          type="text"
          name="organization"
          label="Organization"
          v-model="paymentForm.organization"
          placeholder="Masukkan organization"
        />

        <!-- Amaun -->
        <FormKit
          type="number"
          name="amaun"
          label="Amaun (RM)"
          v-model="paymentForm.amaun"
          placeholder="0.00"
          step="0.01"
          validation="required|min:0"
        />

        <!-- Tarikh Bayaran -->
        <FormKit
          type="date"
          name="tarikhBayaran"
          label="Tarikh Bayaran"
          v-model="paymentForm.tarikhBayaran"
          validation="required"
        />
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <rs-button variant="secondary" @click="handleClosePaymentModal">
            Batal
          </rs-button>
          <rs-button variant="primary" @click="handleSavePaymentModal">
            {{ paymentModalMode === "add" ? "Tambah" : "Kemaskini" }}
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Recipient Modal -->
    <rs-modal
      v-model="showRecipientModal"
      :title="
        recipientModalMode === 'add'
          ? 'Tambah Maklumat Penerima'
          : 'Edit Maklumat Penerima'
      "
      size="lg"
    >
      <div class="space-y-4">
        <!-- Nama Penuh -->
        <FormKit
          type="text"
          name="namaPenuh"
          label="Nama Penuh"
          v-model="recipientForm.namaPenuh"
          placeholder="Masukkan nama penuh"
          validation="required"
        />

        <!-- Amaun -->
        <FormKit
          type="number"
          name="amaun"
          label="Amaun (RM)"
          v-model="recipientForm.amaun"
          placeholder="0.00"
          step="0.01"
          validation="required|min:0"
        />

        <!-- Agihan Semula -->
        <FormKit
          type="select"
          name="agihanSemula"
          label="Agihan Semula"
          v-model="recipientForm.agihanSemula"
          :options="[
            { label: 'Ya', value: 'Ya' },
            { label: 'Tidak', value: 'Tidak' },
          ]"
          validation="required"
        />

        <!-- Bulk Processing -->
        <FormKit
          type="select"
          name="bulkProcessing"
          label="Bulk Processing"
          v-model="recipientForm.bulkProcessing"
          :options="[
            { label: 'Ya', value: 'Ya' },
            { label: 'Tidak', value: 'Tidak' },
          ]"
          validation="required"
        />

        <!-- Kategori Asnaf -->
        <FormKit
          type="select"
          name="kategoriAsnaf"
          label="Kategori Asnaf"
          v-model="recipientForm.kategoriAsnaf"
          :options="kategoriAsnafOptions"
          placeholder="Pilih kategori asnaf"
          validation="required"
        />

        <!-- Bayaran Kepada -->
        <FormKit
          type="select"
          name="bayaranKepada"
          label="Bayaran Kepada"
          v-model="recipientForm.bayaranKepada"
          :options="[
            { label: 'Individu', value: 'Individu' },
            { label: 'Organisasi', value: 'Organisasi' },
          ]"
          validation="required"
        />

        <!-- Negeri -->
        <FormKit
          type="text"
          name="negeri"
          label="Negeri"
          v-model="recipientForm.negeri"
          placeholder="Masukkan negeri"
          validation="required"
        />

        <!-- Negara -->
        <FormKit
          type="text"
          name="negara"
          label="Negara"
          v-model="recipientForm.negara"
          placeholder="Masukkan negara"
          validation="required"
        />
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <rs-button variant="secondary" @click="handleCloseRecipientModal">
            Batal
          </rs-button>
          <rs-button variant="primary" @click="handleSaveRecipientModal">
            {{ recipientModalMode === "add" ? "Tambah" : "Kemaskini" }}
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

definePageMeta({
  title: "Tambah Bantuan Bulk",
});

// Simple alert function to replace toast
const alert = (type, message) => {
  console.log(`${type.toUpperCase()}: ${message}`);
  // You can replace this with your preferred notification system
  window.alert(message);
};

// Form state
const formData = ref({
  kodBP: "",
  tajuk: "",
  kategoriAsnaf: "",
  status: "Dalam Proses",
  jumlahAmaun: "0.00",
  catatan: "",
  tarikhMohon: computed(() => new Date().toLocaleDateString("ms-MY")),
  diciptaOleh: "",
  diciptaPada: "",
  kategoriBantuan: "Pendidikan Fakir",
  subKategori: "Pendidikan IPT",
  bantuan: "",
  kodBantuan: "",
  produkBantuan: "",
  penyiasat: "",
  cawangan: "",
});

const breadcrumb = ref([
  {
    name: "Bantuan",
    type: "link",
    path: "/BF-BTN/bantuan-bulk",
  },
  {
    name: "Bantuan Bulk",
    type: "link",
    path: "/BF-BTN/bantuan-bulk",
  },
  {
    name: "Cipta Bantuan Bulk",
    type: "link",
    path: "/BF-BTN/bantuan-bulk/cipta-bantuan-bulk",
  },
  {
    name: "Tambah",
    type: "current",
    path: "/BF-BTN/bantuan-bulk/cipta-bantuan-bulk/tambah",
  },
]);

// Form Options
const kategoriAsnafOptions = [
  { label: "Fakir", value: "fakir" },
  { label: "Miskin", value: "miskin" },
  { label: "Amil", value: "amil" },
  { label: "Muallaf", value: "muallaf" },
  { label: "Gharimin", value: "gharimin" },
  { label: "Fisabilillah", value: "fisabilillah" },
  { label: "Ibnu Sabil", value: "ibnu_sabil" },
];

const bantuanOptions = [
  { label: "Bantuan Pendidikan", value: "bantuan_pendidikan" },
  { label: "Bantuan Perubatan", value: "bantuan_perubatan" },
  { label: "Bantuan Sara Hidup", value: "bantuan_sara_hidup" },
  { label: "Bantuan Kecemasan", value: "bantuan_kecemasan" },
];

const produkBantuanOptions = [
  { label: "Wang Saku", value: "wang_saku" },
  { label: "Yuran Pengajian", value: "yuran_pengajian" },
  { label: "Bantuan Persekolahan", value: "bantuan_persekolahan" },
  { label: "Bantuan Kos Sara Hidup", value: "bantuan_kos_sara_hidup" },
];

const penyiasatOptions = [
  { label: "Ahmad bin Abdullah", value: "ahmad_abdullah" },
  { label: "Siti binti Ali", value: "siti_ali" },
  { label: "Mohamed bin Hassan", value: "mohamed_hassan" },
];

const cawanganOptions = [
  { label: "Cawangan Kuala Lumpur", value: "kl" },
  { label: "Cawangan Selangor", value: "selangor" },
  { label: "Cawangan Putrajaya", value: "putrajaya" },
  { label: "Cawangan Johor", value: "johor" },
];

// Payment Table Configuration
const paymentColumns = [
  { key: "kod", label: "Kod" },
  { key: "bayaranKepada", label: "Bayaran Kepada" },
  { key: "asnaf", label: "Asnaf" },
  { key: "contributor", label: "Contributor" },
  { key: "recipient", label: "Recipient" },
  { key: "organization", label: "Organization" },
  { key: "amaun", label: "Amaun" },
  { key: "tarikhBayaran", label: "Tarikh Bayaran" },
  {
    key: "actions",
    label: "Tindakan",
    sortable: false,
    align: "center",
  },
];

// Recipient Table Configuration
const recipientColumns = [
  { key: "namaPenuh", label: "Nama Penuh" },
  { key: "amaun", label: "Amaun" },
  { key: "agihanSemula", label: "Agihan Semula" },
  { key: "bulkProcessing", label: "Bulk Processing" },
  { key: "kategoriAsnaf", label: "Kategori Asnaf" },
  { key: "bayaranKepada", label: "Bayaran Kepada" },
  { key: "negeri", label: "Negeri" },
  { key: "negara", label: "Negara" },
  {
    key: "actions",
    label: "Tindakan",
    sortable: false,
    align: "center",
  },
];

// State Management
const selectedFile = ref(null);
const selectedDocument = ref(null);
const paymentList = ref([]);
const recipientList = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);

// State for editing
const editingPayment = ref(null);
const editingRecipient = ref(null);

// Modal states
const showPaymentModal = ref(false);
const showRecipientModal = ref(false);
const paymentModalMode = ref("add"); // 'add' or 'edit'
const recipientModalMode = ref("add"); // 'add' or 'edit'

// Form data for modals
const paymentForm = ref({
  kod: "",
  bayaranKepada: "",
  asnaf: "",
  contributor: "",
  recipient: "",
  organization: "",
  amaun: 0,
  tarikhBayaran: new Date().toLocaleDateString("ms-MY"),
});

const recipientForm = ref({
  id: "",
  namaPenuh: "",
  amaun: 0,
  agihanSemula: "Tidak",
  bulkProcessing: "Tidak",
  kategoriAsnaf: "",
  bayaranKepada: "Individu",
  negeri: "",
  negara: "Malaysia",
});

// Computed Properties
const currentDate = computed(() => {
  return new Date().toLocaleDateString("ms-MY");
});

const totalAmount = computed(() => {
  return recipientList.value.reduce(
    (sum, recipient) => sum + (parseFloat(recipient.amaun) || 0),
    0
  );
});

// Watch for changes in bantuan to update kodBantuan
watch(
  () => formData.value.bantuan,
  (newValue) => {
    if (newValue) {
      // Generate a unique kod bantuan based on the selected bantuan
      formData.value.kodBantuan = `BTN-${newValue.toUpperCase()}-${Date.now()
        .toString()
        .slice(-6)}`;
    }
  }
);

// Watch for changes in payment and recipient lists for debugging
watch(
  paymentList,
  (newValue) => {
    console.log("Payment list changed:", newValue);
  },
  { deep: true }
);

watch(
  recipientList,
  (newValue) => {
    console.log("Recipient list changed:", newValue);
  },
  { deep: true }
);

// Methods
const formatNumber = (number) => {
  return new Intl.NumberFormat("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel"
    ) {
      selectedFile.value = file;
    } else {
      alert("error", "Sila pilih fail Excel yang sah (.xlsx atau .xls)");
      event.target.value = "";
    }
  }
};

const handleDocumentUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (
      file.type === "application/pdf" ||
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      selectedDocument.value = file;
    } else {
      alert("error", "Sila pilih fail PDF atau Word yang sah");
      event.target.value = "";
    }
  }
};

const handleImport = async () => {
  try {
    isLoading.value = true;
    // Here you would typically:
    // 1. Create FormData and append the file
    const formData = new FormData();
    formData.append("file", selectedFile.value);

    // 2. Make API call to backend
    // const response = await $fetch('/api/bantuan-bulk/import', {
    //   method: 'POST',
    //   body: formData
    // });

    // 3. Update recipientList with the imported data
    // recipientList.value = response.data;

    // For demo, adding dummy data
    recipientList.value.push({
      namaPenuh: "Ali bin Abu",
      amaun: 1000.0,
      agihanSemula: "Ya",
      bulkProcessing: "Tidak",
      kategoriAsnaf: "Fakir",
      bayaranKepada: "Individu",
      negeri: "Selangor",
      negara: "Malaysia",
    });

    // Update total amount
    formData.value.jumlahAmaun = formatNumber(totalAmount.value);

    alert("success", "Fail berjaya diimport");
  } catch (error) {
    console.error("Error importing file:", error);
    alert("error", "Gagal mengimport fail");
  } finally {
    isLoading.value = false;
  }
};

const handleDocumentImport = async () => {
  try {
    isLoading.value = true;
    // Here you would typically:
    // 1. Create FormData and append the file
    const formData = new FormData();
    formData.append("document", selectedDocument.value);

    // 2. Make API call to backend
    // const response = await $fetch('/api/bantuan-bulk/upload-document', {
    //   method: 'POST',
    //   body: formData
    // });

    alert("success", "Dokumen berjaya dimuat naik");
  } catch (error) {
    console.error("Error importing document:", error);
    alert("error", "Gagal memuat naik dokumen");
  } finally {
    isLoading.value = false;
  }
};

// Helper function to generate unique ID
const generateUniqueId = (prefix) => {
  return `${prefix}-${Date.now().toString().slice(-6)}-${Math.random()
    .toString(36)
    .slice(-4)}`;
};

const handleAddPayment = () => {
  console.log("handleAddPayment called");

  // Reset form and open modal
  paymentForm.value = {
    kod: generateUniqueId("PMT"),
    bayaranKepada: "",
    asnaf: formData.value.kategoriAsnaf || "",
    contributor: "",
    recipient: "",
    organization: "",
    amaun: 0,
    tarikhBayaran: new Date().toLocaleDateString("ms-MY"),
  };

  paymentModalMode.value = "add";
  showPaymentModal.value = true;
};

const handleAddRecipient = () => {
  console.log("handleAddRecipient called");

  // Reset form and open modal
  recipientForm.value = {
    id: generateUniqueId("RCP"),
    namaPenuh: "",
    amaun: 0,
    agihanSemula: "Tidak",
    bulkProcessing: "Tidak",
    kategoriAsnaf: formData.value.kategoriAsnaf || "",
    bayaranKepada: "Individu",
    negeri: "",
    negara: "Malaysia",
  };

  recipientModalMode.value = "add";
  showRecipientModal.value = true;
};

const handleDeletePayment = async (payment) => {
  try {
    if (confirm("Adakah anda pasti untuk memadam maklumat bayaran ini?")) {
      const index = paymentList.value.findIndex((p) => p.kod === payment.kod);
      if (index !== -1) {
        paymentList.value.splice(index, 1);
        alert("success", "Maklumat bayaran berjaya dipadam");
      }
    }
  } catch (error) {
    console.error("Error deleting payment:", error);
    alert("error", "Gagal memadam maklumat bayaran");
  }
};

const handleDeleteRecipient = async (recipient) => {
  try {
    if (confirm("Adakah anda pasti untuk memadam maklumat penerima ini?")) {
      const index = recipientList.value.findIndex(
        (r) => r.id === recipient.id || r.namaPenuh === recipient.namaPenuh
      );
      if (index !== -1) {
        recipientList.value.splice(index, 1);
        // Update total amount
        formData.value.jumlahAmaun = formatNumber(totalAmount.value);
        alert("success", "Maklumat penerima berjaya dipadam");
      }
    }
  } catch (error) {
    console.error("Error deleting recipient:", error);
    alert("error", "Gagal memadam maklumat penerima");
  }
};

const handleEditPayment = (payment) => {
  editingPayment.value = { ...payment };
};

const handleSavePayment = () => {
  if (!editingPayment.value) return;

  const index = paymentList.value.findIndex(
    (p) => p.kod === editingPayment.value.kod
  );

  if (index !== -1) {
    paymentList.value[index] = { ...editingPayment.value };
    editingPayment.value = null;
    alert("success", "Maklumat bayaran berjaya dikemaskini");
  }
};

const handleCancelPaymentEdit = () => {
  editingPayment.value = null;
};

const handleEditRecipient = (recipient) => {
  editingRecipient.value = { ...recipient };
};

const handleSaveRecipient = () => {
  if (!editingRecipient.value) return;

  const index = recipientList.value.findIndex(
    (r) =>
      r.id === editingRecipient.value.id ||
      r.namaPenuh === editingRecipient.value.namaPenuh
  );

  if (index !== -1) {
    recipientList.value[index] = { ...editingRecipient.value };
    // Update total amount
    formData.value.jumlahAmaun = formatNumber(totalAmount.value);
    editingRecipient.value = null;
    alert("success", "Maklumat penerima berjaya dikemaskini");
  }
};

const handleCancelRecipientEdit = () => {
  editingRecipient.value = null;
};

const navigateBack = () => {
  navigateTo("/BF-BTN/bantuan-bulk/cipta-bantuan-bulk");
};

const validateForm = () => {
  // Add your validation logic here
  if (!formData.value.tajuk) {
    alert("error", "Sila isi tajuk bantuan");
    return false;
  }
  if (!formData.value.kategoriAsnaf) {
    alert("error", "Sila pilih kategori asnaf");
    return false;
  }
  if (!formData.value.bantuan) {
    alert("error", "Sila pilih bantuan");
    return false;
  }
  if (!formData.value.produkBantuan) {
    alert("error", "Sila pilih produk bantuan");
    return false;
  }
  if (!formData.value.penyiasat) {
    alert("error", "Sila pilih penyiasat");
    return false;
  }
  if (!formData.value.cawangan) {
    alert("error", "Sila pilih cawangan");
    return false;
  }
  if (recipientList.value.length === 0) {
    alert("error", "Sila tambah sekurang-kurangnya seorang penerima");
    return false;
  }
  return true;
};

const handleSave = async () => {
  try {
    // if (!validateForm()) return;

    isSubmitting.value = true;
    // Here you would typically:
    // 1. Prepare the data
    const payload = {
      ...formData.value,
      recipients: recipientList.value,
      payments: paymentList.value,
    };

    // 2. Make API call to backend
    // const response = await $fetch('/api/bantuan-bulk', {
    //   method: 'POST',
    //   body: payload
    // });

    alert("success", "Bantuan bulk berjaya disimpan");
    // Navigate back after successful save
    navigateBack();
  } catch (error) {
    console.error("Error saving bantuan bulk:", error);
    alert("error", "Gagal menyimpan bantuan bulk");
  } finally {
    isSubmitting.value = false;
  }
};

// Modal functions
const handleSavePaymentModal = () => {
  if (paymentModalMode.value === "add") {
    // Add new payment
    paymentList.value.push({ ...paymentForm.value });
    alert("success", "Maklumat bayaran baru ditambah");
  } else {
    // Update existing payment
    const index = paymentList.value.findIndex(
      (p) => p.kod === paymentForm.value.kod
    );
    if (index !== -1) {
      paymentList.value[index] = { ...paymentForm.value };
      alert("success", "Maklumat bayaran berjaya dikemaskini");
    }
  }

  showPaymentModal.value = false;
};

const handleSaveRecipientModal = () => {
  if (recipientModalMode.value === "add") {
    // Add new recipient
    recipientList.value.push({ ...recipientForm.value });
    alert("success", "Maklumat penerima baru ditambah");
  } else {
    // Update existing recipient
    const index = recipientList.value.findIndex(
      (r) => r.id === recipientForm.value.id
    );
    if (index !== -1) {
      recipientList.value[index] = { ...recipientForm.value };
      alert("success", "Maklumat penerima berjaya dikemaskini");
    }
  }

  // Update total amount
  formData.value.jumlahAmaun = formatNumber(totalAmount.value);
  showRecipientModal.value = false;
};

const handleEditPaymentModal = (payment) => {
  paymentForm.value = { ...payment };
  paymentModalMode.value = "edit";
  showPaymentModal.value = true;
};

const handleEditRecipientModal = (recipient) => {
  recipientForm.value = { ...recipient };
  recipientModalMode.value = "edit";
  showRecipientModal.value = true;
};

const handleClosePaymentModal = () => {
  showPaymentModal.value = false;
};

const handleCloseRecipientModal = () => {
  showRecipientModal.value = false;
};
</script>

<style lang="scss" scoped>
.rs-table {
  :deep(th) {
    @apply bg-gray-50 text-gray-600 font-medium;
  }
}

.loading {
  @apply opacity-50 pointer-events-none;
}

.form-actions {
  @apply sticky bottom-0 bg-white shadow-lg p-4 z-10;
}
</style>

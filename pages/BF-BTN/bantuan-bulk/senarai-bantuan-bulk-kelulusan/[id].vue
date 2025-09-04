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
              v-model="bantuanDetail.kodBP"
              disabled
            />

            <!-- Tajuk -->
            <FormKit
              type="text"
              name="tajuk"
              label="Tajuk"
              v-model="bantuanDetail.tajuk"
              disabled
            />

            <!-- Kategori Asnaf -->
            <FormKit
              type="text"
              name="kategoriAsnaf"
              label="Kategori Asnaf"
              v-model="bantuanDetail.kategoriAsnaf"
              disabled
            />

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Status</label
              >
              <rs-badge :variant="getStatusVariant(bantuanDetail.status)">
                {{ bantuanDetail.status }}
              </rs-badge>
            </div>

            <!-- Jumlah Amaun -->
            <FormKit
              type="text"
              name="jumlahAmaun"
              label="Jumlah Amaun (RM)"
              v-model="bantuanDetail.jumlahAmaun"
              disabled
            />

            <!-- Tarikh Mohon -->
            <FormKit
              type="text"
              name="tarikhMohon"
              label="Tarikh Mohon"
              v-model="bantuanDetail.tarikhMohon"
              disabled
            />

            <!-- Catatan -->
            <FormKit
              type="textarea"
              name="catatan"
              label="Catatan"
              v-model="bantuanDetail.catatan"
              disabled
              :classes="{
                input: 'h-24',
              }"
            />

            <!-- Dicipta Oleh -->
            <FormKit
              type="text"
              name="diciptaOleh"
              label="Dicipta Oleh"
              v-model="bantuanDetail.diciptaOleh"
              disabled
            />

            <!-- Dicipta Pada -->
            <FormKit
              type="text"
              name="diciptaPada"
              label="Dicipta Pada"
              v-model="bantuanDetail.diciptaPada"
              disabled
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
              v-model="bantuanDetail.kategoriBantuan"
              disabled
            />

            <!-- Sub-Kategori -->
            <FormKit
              type="text"
              name="subKategori"
              label="Sub-Kategori"
              v-model="bantuanDetail.subKategori"
              disabled
            />

            <!-- Bantuan -->
            <FormKit
              type="text"
              name="bantuan"
              label="Bantuan *"
              v-model="bantuanDetail.bantuan"
              disabled
            />

            <!-- Kod Bantuan -->
            <FormKit
              type="text"
              name="kodBantuan"
              label="Kod Bantuan"
              v-model="bantuanDetail.kodBantuan"
              disabled
            />

            <!-- Produk Bantuan -->
            <FormKit
              type="text"
              name="produkBantuan"
              label="Produk Bantuan *"
              v-model="bantuanDetail.produkBantuan"
              disabled
            />

            <!-- Penyiasat -->
            <FormKit
              type="text"
              name="penyiasat"
              label="Penyiasat"
              v-model="bantuanDetail.penyiasat"
              disabled
            />

            <!-- Cawangan -->
            <FormKit
              type="text"
              name="cawangan"
              label="Cawangan *"
              v-model="bantuanDetail.cawangan"
              disabled
              :classes="{
                outer: 'md:col-span-2',
              }"
            />
          </div>
        </template>
      </rs-card>

      <!-- Maklumat Bayaran Kepada Section -->
      <rs-card>
        <template #header>
          <h2 class="text-xl font-semibold">Maklumat Bayaran Kepada</h2>
        </template>
        <template #body>
          <div
            v-if="bayaranKepadaList.length === 0"
            class="text-center py-8 text-gray-500"
          >
            Tiada maklumat bayaran.
          </div>

          <div v-else class="space-y-3">
            <rs-table
              :data="bayaranKepadaList"
              :columns="recipientColumns"
              :pageSize="5"
              :showNoColumn="true"
              :options="{ variant: 'default', hover: true, striped: true }"
              :options-advanced="{ sortable: true, filterable: false }"
              advanced
            >
              <template v-slot:actions="{ row }">
                <div class="flex space-x-2 justify-center">
                  <rs-button
                    variant="info"
                    size="sm"
                    class="flex gap-2"
                    @click="handleLihatBayaran(payment)"
                  >
                    <Icon name="ph:eye" class="h-4 w-4" />
                    Lihat
                  </rs-button>
                </div>
              </template>
            </rs-table>
          </div>
        </template>
      </rs-card>

      <!-- Senarai Penerima Section -->
      <rs-card>
        <template #header>
          <h2 class="text-xl font-semibold">Senarai Penerima</h2>
        </template>
        <template #body>
          <div
            v-if="penerimaList.length === 0"
            class="text-center py-8 text-gray-500"
          >
            Tiada maklumat penerima.
          </div>

          <div v-else class="space-y-3">
            <rs-table
              :data="penerimaList"
              :columns="recipientColumns"
              :pageSize="5"
              :showNoColumn="true"
              :options="{ variant: 'default', hover: true, striped: true }"
              :options-advanced="{ sortable: true, filterable: false }"
              advanced
            >
              <template v-slot:actions="{ row }">
                <div class="flex space-x-2 justify-center">
                  <rs-button
                    variant="info"
                    size="sm"
                    class="flex gap-2"
                    @click="handleLihatPenerima(recipient)"
                  >
                    <Icon name="ph:eye" class="h-4 w-4" />
                    Lihat
                  </rs-button>
                </div>
              </template>
            </rs-table>
          </div>
        </template>
      </rs-card>

      <!-- Dokumen Section -->
      <rs-card>
        <template #header>
          <h2 class="text-xl font-semibold">Dokumen Berkaitan</h2>
        </template>
        <template #body>
          <div
            v-if="documentList.length === 0"
            class="text-center py-8 text-gray-500"
          >
            Tiada dokumen dimuat naik.
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="(document, index) in documentList"
              :key="index"
              class="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
            >
              <div class="flex items-center space-x-3">
                <Icon
                  name="material-symbols:description"
                  class="w-8 h-8 text-blue-500"
                />
                <div>
                  <p class="font-medium text-gray-900">{{ document.name }}</p>
                  <p class="text-sm text-gray-500">
                    {{ document.size }} • {{ document.uploadDate }}
                  </p>
                </div>
              </div>
              <rs-button variant="primary-outline" size="sm">
                <Icon name="material-symbols:download" class="w-4 h-4 mr-1" />
                Muat Turun
              </rs-button>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Maklumat Sokongan Section -->
      <rs-card>
        <template #header>
          <h2 class="text-xl font-semibold">Maklumat Sokongan</h2>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Status Semakan -->
            <FormKit
              v-model="sokonganForm.statusSemakan"
              type="select"
              label="Status Semakan *"
              :options="statusSemakanOptions"
              required
              :classes="{
                input: '!py-2',
              }"
              disabled
            />

            <!-- Nama Pegawai -->
            <FormKit
              type="text"
              name="namaPegawai"
              label="Nama Pegawai"
              v-model="sokonganForm.namaPegawai"
              disabled
            />

            <!-- Catatan -->
            <FormKit
              v-model="sokonganForm.catatan"
              type="textarea"
              label="Catatan"
              placeholder="Masukkan catatan sokongan..."
              :classes="{
                input: '!py-2 min-h-[100px]',
                outer: 'md:col-span-2'
              }"
              disabled
            />

            <!-- Tarikh -->
            <FormKit
              type="text"
              name="tarikh"
              label="Tarikh"
              v-model="sokonganForm.tarikh"
              disabled
            />
          </div>
        </template>
      </rs-card>

      <!-- Maklumat Sokongan Section -->
      <rs-card>
        <template #header>
          <h2 class="text-xl font-semibold">Maklumat Pelulus</h2>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Status Semakan -->
            <FormKit
              v-model="pelulusForm.statusSemakan"
              type="select"
              label="Status Semakan *"
              :options="statusSemakanOptions"
              required
              :classes="{
                input: '!py-2',
              }"
            />

            <!-- Nama Pegawai -->
            <FormKit
              type="text"
              name="namaPegawai"
              label="Nama Pegawai"
              v-model="pelulusForm.namaPegawai"
              disabled
            />

            <!-- Catatan -->
            <FormKit
              v-model="pelulusForm.catatan"
              type="textarea"
              label="Catatan"
              placeholder="Masukkan catatan sokongan..."
              :classes="{
                input: '!py-2 min-h-[100px]',
                outer: 'md:col-span-2'
              }"
            />

            <!-- Tarikh -->
            <FormKit
              type="text"
              name="tarikh"
              label="Tarikh"
              v-model="pelulusForm.tarikh"
              disabled
            />
          </div>
        </template>
      </rs-card>

      <!-- Action Buttons -->
       <div class="">
        <div class="flex justify-between space-x-4">
          <rs-button variant="secondary" @click="handleKembali">
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
            Kembali
          </rs-button>
          <div class="flex space-x-2">
            <rs-button
              variant="info"
              @click="handleSimpan"
              :disabled="!pelulusForm.statusSemakan"
            >
              <Icon name="ph:floppy-disk" class="w-4 h-4 mr-1" />
              Simpan
            </rs-button>
            <rs-button
              variant="primary"
              @click="handleHantar"
              :disabled="!pelulusForm.statusSemakan"
            >
              <Icon name="ph:paper-plane-tilt" class="w-4 h-4 mr-1" />
              Hantar
            </rs-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Detail Modal -->
    <rs-modal
      v-model="showPaymentModal"
      title="Maklumat Bayaran Kepada"
      size="lg"
      position="center"
    >
      <div v-if="selectedPayment" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kod</label>
            <p class="text-gray-900">{{ selectedPayment.kod }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bayaran Kepada</label>
            <p class="text-gray-900">{{ selectedPayment.bayaranKepada }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Asnaf</label>
            <p class="text-gray-900">{{ selectedPayment.asnaf }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Amaun</label>
            <p class="text-gray-900 font-semibold">{{ selectedPayment.amaun }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Bayaran</label>
            <p class="text-gray-900">{{ selectedPayment.tarikhBayaran }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contributor</label>
            <p class="text-gray-900">{{ selectedPayment.contributor || '-' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
            <p class="text-gray-900">{{ selectedPayment.recipient || '-' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Organization</label>
            <p class="text-gray-900">{{ selectedPayment.organization || '-' }}</p>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <rs-button variant="secondary" @click="showPaymentModal = false">
            Tutup
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Recipient Detail Modal -->
    <rs-modal
      v-model="showRecipientModal"
      title="Maklumat Penerima"
      size="lg"
      position="center"
    >
      <div v-if="selectedRecipient" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Penuh</label>
            <p class="text-gray-900 font-semibold">{{ selectedRecipient.namaPenuh }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Amaun</label>
            <p class="text-gray-900 font-semibold">{{ selectedRecipient.amaun }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kategori Asnaf</label>
            <p class="text-gray-900">{{ selectedRecipient.kategoriAsnaf }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bayaran Kepada</label>
            <p class="text-gray-900">{{ selectedRecipient.bayaranKepada }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Agihan Semula</label>
            <p class="text-gray-900">{{ selectedRecipient.agihanSemula || '-' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bulk Processing</label>
            <p class="text-gray-900">{{ selectedRecipient.bulkProcessing }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Negeri</label>
            <p class="text-gray-900">{{ selectedRecipient.negeri }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Negara</label>
            <p class="text-gray-900">{{ selectedRecipient.negara }}</p>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <rs-button variant="secondary" @click="showRecipientModal = false">
            Tutup
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
  title: "Maklumat Bantuan Bulk - Sokongan",
});

const breadcrumb = ref([
  {
    name: "Bantuan",
    type: "link",
    path: "/BF-BTN",
  },
  {
    name: "Bantuan Bulk",
    type: "link",
    path: "/BF-BTN/bantuan-bulk",
  },
  {
    name: "Kelulusan",
    type: "link",
    path: "/BF-BTN/bantuan-bulk/senarai-bantuan-bulk-kelulusan",
  },
  {
    name: `Maklumat ${route.params.id}`,
    type: "current",
    path: `/BF-BTN/bantuan-bulk/senarai-bantuan-bulk-kelulusan/${route.params.id}`,
  },
]);

// Mock detail data - would be replaced with API call based on route.params.id
const bantuanDetail = ref({
  kodBP: route.params.id,
  tajuk: "Wang Saku Fakir Mac 2025",
  kategoriAsnaf: "Fakir",
  status: "Dalam Proses",
  jumlahAmaun: "RM 191,200.00",
  catatan:
    "Tuntutan wang saku pelajar batch 3\nJumlah Pelajar: 50\nJumlah Bayaran: RM 191,200.00",
  tarikhMohon: "14/03/2025",
  diciptaOleh: "Norlida Binti Mat Nor",
  diciptaPada: "17/02/2025 3:17pm",
  kategoriBantuan: "Pendidikan Fakir",
  subKategori: "Pendidikan IPT - Kewangan (Fakir - Pendidikan)",
  bantuan: "B314 - (HQ) Bantuan Keperluan Pendidikan IPT",
  kodBantuan: "B314",
  produkBantuan: "(HQ) KPIPT (Fakir) - Bantuan Wang Saku",
  penyiasat: "Siti Aisyah Binti Ahmad",
  cawangan: "Cawangan Ibu Pejabat LZS",
});

// Removed bayaran columns as we're using card layout now

// Mock bayaran kepada data
const bayaranKepadaList = ref([
  {
    kod: "PT-2025-30371",
    bayaranKepada: "Nur Hazimah Binti Mohd Hafiz",
    asnaf: "Fakir",
    contributor: "",
    recipient: "",
    organization: "",
    amaun: "RM2,400.00",
    tarikhBayaran: "17/04/2025",
  },
  {
    kod: "PT-2025-30372",
    bayaranKepada: "Nur safiyya Binti Rosly",
    asnaf: "Fakir",
    contributor: "",
    recipient: "",
    organization: "",
    amaun: "RM2,400.00",
    tarikhBayaran: "17/04/2025",
  },
  {
    kod: "PT-2025-30373",
    bayaranKepada: "Mohd Nazrin Bin Mokhtar",
    asnaf: "Fakir",
    contributor: "",
    recipient: "",
    organization: "",
    amaun: "RM2,400.00",
    tarikhBayaran: "17/04/2025",
  },
  {
    kod: "PT-2025-30374",
    bayaranKepada: "Intan Nadia Binti Mohd Zamri",
    asnaf: "Fakir",
    contributor: "",
    recipient: "",
    organization: "",
    amaun: "RM2,400.00",
    tarikhBayaran: "17/04/2025",
  },
]);

// Removed penerima columns as we're using card layout now

// Mock penerima data
const penerimaList = ref([
  {
    namaPenuh: "Nur Hazimah Binti Mohd Hafiz",
    amaun: "RM2,400.00",
    agihanSemula: "",
    bulkProcessing: "BP-2025-00004",
    kategoriAsnaf: "Fakir",
    bayaranKepada: "Asnaf",
    negeri: "Selangor",
    negara: "Malaysia",
  },
  {
    namaPenuh: "Nur safiyya Binti Rosly",
    amaun: "RM2,400.00",
    agihanSemula: "",
    bulkProcessing: "BP-2025-00004",
    kategoriAsnaf: "Fakir",
    bayaranKepada: "Asnaf",
    negeri: "Selangor",
    negara: "Malaysia",
  },
  {
    namaPenuh: "Mohd Nazrin Bin Mokhtar",
    amaun: "RM2,400.00",
    agihanSemula: "",
    bulkProcessing: "BP-2025-00004",
    kategoriAsnaf: "Fakir",
    bayaranKepada: "Asnaf",
    negeri: "Selangor",
    negara: "Malaysia",
  },
  {
    namaPenuh: "Intan Nadia Binti Mohd Zamri",
    amaun: "RM2,400.00",
    agihanSemula: "",
    bulkProcessing: "BP-2025-00004",
    kategoriAsnaf: "Fakir",
    bayaranKepada: "Asnaf",
    negeri: "Selangor",
    negara: "Malaysia",
  },
]);

// Dokumen columns
const dokumenColumns = [
  { key: "namaDokumen", label: "Nama Dokumen", sortable: false },
  { key: "tindakan", label: "Tindakan", sortable: false },
];

const documentList = ref([
  {
    name: "Surat Permohonan Bantuan.pdf",
    size: "2.5 MB",
    uploadDate: "15/01/2025",
  },
  {
    name: "Senarai Penerima.xlsx",
    size: "1.2 MB",
    uploadDate: "15/01/2025",
  },
]);

// Sokongan form data
const sokonganForm = ref({
  statusSemakan: "Disokong",
  catatan: "Tiada",
  namaPegawai: "Siti Aisyah Binti Ahmad",
  tarikh: "10/07/2025",
});

// Sokongan form data
const pelulusForm = ref({
  statusSemakan: "",
  catatan: "",
  namaPegawai: "Abu bin Ali",
  tarikh: "14/07/2025",
});

// Status semakan options
const statusSemakanOptions = [
  { label: "Pilih Status", value: "" },
  { label: "Disokong", value: "Disokong" },
  { label: "Tidak Disokong", value: "Tidak Disokong" },
  { label: "Perlu Kajian Semula", value: "Perlu Kajian Semula" },
];

// Modal states
const showPaymentModal = ref(false);
const showRecipientModal = ref(false);
const selectedPayment = ref(null);
const selectedRecipient = ref(null);

// Methods
const handleKembali = () => {
  navigateTo("/BF-BTN/bantuan-bulk/senarai-bantuan-bulk-sokongan");
};

const handleHantar = async () => {
  if (!pelulusForm.value.statusSemakan) {
    alert("Sila pilih Status Semakan");
    return;
  }

  try {
    // Here you would make API call to submit the sokongan
    console.log("Submitting sokongan:", pelulusForm.value);

    // Show success message
    alert("Sokongan berjaya dihantar!");

    // Navigate back to listing
    await navigateTo("/BF-BTN/bantuan-bulk/senarai-bantuan-bulk-sokongan");
  } catch (error) {
    console.error("Error submitting sokongan:", error);
    alert("Ralat semasa menghantar sokongan. Sila cuba lagi.");
  }
};

const handleLihatDokumen = (filename) => {
  // Here you would implement document viewing logic
  console.log("Viewing document:", filename);
  // For now, just show an alert
  alert(`Membuka dokumen: ${filename}`);
};

const handleLihatBayaran = (payment) => {
  // Set the selected payment and open modal
  selectedPayment.value = payment;
  showPaymentModal.value = true;
};

const handleLihatPenerima = (recipient) => {
  // Set the selected recipient and open modal
  selectedRecipient.value = recipient;
  showRecipientModal.value = true;
};

const getStatusVariant = (status) => {
  const variants = {
    "Dalam Proses": "warning",
    Selesai: "success",
    Ditolak: "danger",
  };
  return variants[status] || "default";
};
</script>

<style lang="scss" scoped>
.form-actions {
  @apply sticky bottom-0 bg-white shadow-lg p-4 z-10;
}

@media print {
  .form-actions {
    @apply hidden;
  }

  .rs-card {
    @apply shadow-none border-gray-300;
  }
}
</style>

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
              v-model="formData.kodBP"
              disabled
            />

            <!-- Tajuk -->
            <FormKit
              type="text"
              name="tajuk"
              label="Tajuk"
              v-model="formData.tajuk"
              disabled
            />

            <!-- Kategori Asnaf -->
            <FormKit
              type="text"
              name="kategoriAsnaf"
              label="Kategori Asnaf"
              v-model="formData.kategoriAsnaf"
              disabled
            />

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Status</label
              >
              <rs-badge :variant="getStatusVariant(formData.status)">
                {{ formData.status }}
              </rs-badge>
            </div>

            <!-- Jumlah Amaun -->
            <FormKit
              type="text"
              name="jumlahAmaun"
              label="Jumlah Amaun (RM)"
              v-model="formData.jumlahAmaun"
              disabled
            />

            <!-- Catatan -->
            <FormKit
              type="textarea"
              name="catatan"
              label="Catatan"
              v-model="formData.catatan"
              disabled
              :classes="{
                input: 'h-24',
              }"
            />

            <!-- Nama Pegawai -->
            <FormKit
              type="text"
              name="namaPegawai"
              label="Nama Pegawai"
              v-model="formData.namaPegawai"
              disabled
              help="Auto-fill selepas simpan"
            />

            <!-- Tarikh Mohon -->
            <FormKit
              type="text"
              name="tarikhMohon"
              label="Tarikh Mohon"
              v-model="formData.tarikhMohon"
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
              type="text"
              name="bantuan"
              label="Bantuan"
              v-model="formData.bantuan"
              disabled
            />

            <!-- Kod Bantuan -->
            <FormKit
              type="text"
              name="kodBantuan"
              label="Kod Bantuan"
              v-model="formData.kodBantuan"
              disabled
            />

            <!-- Produk Bantuan -->
            <FormKit
              type="text"
              name="produkBantuan"
              label="Produk Bantuan"
              v-model="formData.produkBantuan"
              disabled
            />

            <!-- Penyiasat -->
            <FormKit
              type="text"
              name="penyiasat"
              label="Penyiasat"
              v-model="formData.penyiasat"
              disabled
            />

            <!-- Cawangan -->
            <FormKit
              type="text"
              name="cawangan"
              label="Cawangan"
              v-model="formData.cawangan"
              disabled
            />
          </div>
        </template>
      </rs-card>

      <!-- Maklumat Bayaran Kepada Section -->
      <rs-card>
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Maklumat Bayaran Kepada</h2>
          </div>
        </template>
        <template #body>

          <!-- Payment List -->
          <div
            v-if="paymentList.length === 0"
            class="text-center py-8 text-gray-500"
          >
            Tiada maklumat bayaran. Klik "Tambah" untuk menambah maklumat
            bayaran.
          </div>

          <div v-else class="space-y-3">
            <rs-table
              :data="paymentList"
              :columns="paymentColumns"
              :pageSize="5"
              :showNoColumn="true"
              :options="{ variant: 'default', hover: true, striped: true }"
              :options-advanced="{ sortable: true, filterable: false }"
              advanced
            >
              <template v-slot:actions="{ row }">
                <div class="flex space-x-2 justify-center">
                  <rs-button variant="info" size="sm" @click="handleEditPaymentModal(row)">
                    <Icon name="material-symbols:visibility" class="w-4 h-4 mr-1" /> Lihat
                  </rs-button>
                  <rs-button variant="danger" size="sm" @click="handleDeletePayment(row)">
                    <Icon name="material-symbols:delete" class="w-4 h-4" />
                  </rs-button>
                </div>
              </template>
            </rs-table>
          </div>
        </template>
      </rs-card>


      <!-- Maklumat Senarai Penerima Section -->
      <rs-card>
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Maklumat Senarai Penerima</h2>
          </div>
        </template>
        <template #body>
          <!-- Recipient List -->
          <div
            v-if="recipientList.length === 0"
            class="text-center py-8 text-gray-500"
          >
            Tiada maklumat penerima. Klik "Tambah" untuk menambah maklumat
            penerima.
          </div>

          <div v-else class="space-y-3">
            <rs-table
              :data="recipientList"
              :columns="recipientColumns"
              :pageSize="5"
              :showNoColumn="true"
              :options="{ variant: 'default', hover: true, striped: true }"
              :options-advanced="{ sortable: true, filterable: false }"
              advanced
            >
              <template v-slot:actions="{ row }">
                <div class="flex space-x-2 justify-center">
                  <rs-button variant="info" size="sm" @click="handleEditRecipientModal(row)">
                    <Icon name="material-symbols:visibility" class="w-4 h-4 mr-1" /> Lihat
                  </rs-button>
                  <rs-button variant="danger" size="sm" @click="handleDeleteRecipient(row)">
                    <Icon name="material-symbols:delete" class="w-4 h-4" />
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
          <h2 class="text-xl font-semibold">Maklumat Dokumen Sokongan</h2>
        </template>
        <template #body>
          <div v-if="documentList.length === 0" class="text-center py-8 text-gray-500">
            Tiada dokumen dimuat naik.
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="(document, index) in documentList"
              :key="index"
              class="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
            >
              <div class="flex items-center space-x-3">
                <Icon name="material-symbols:description" class="w-8 h-8 text-blue-500" />
                <div>
                  <p class="font-medium text-gray-900">{{ document.name }}</p>
                  <p class="text-sm text-gray-500">{{ document.size }} • {{ document.uploadDate }}</p>
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

      <!-- Action Buttons -->
      <div class="form-actions">
        <div class="flex justify-between space-x-4">
          <rs-button
            variant="secondary"
            @click="navigateBack"
          >
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
            Kembali
          </rs-button>
          <div class="flex space-x-2">
            <rs-button
              variant="info"
              @click="editBantuan"
            >
              <Icon name="ph:floppy-disk" class="w-4 h-4 mr-1" />
              Simpan
            </rs-button>
            <rs-button
              variant="primary"
              @click="submitBantuan"
            >
              <Icon name="ph:paper-plane-tilt" class="w-4 h-4 mr-1" />
              Hantar
            </rs-button>
          </div>
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
import { ref, computed, onMounted, watch } from 'vue';

definePageMeta({
  title: 'Lihat Bantuan Bulk',
});

// Route parameter
const route = useRoute();
const id = route.params.id;

const breadcrumb = ref([
  {
    name: 'Bantuan',
    type: 'link',
    path: '/BF-BTN/bantuan-bulk',
  },
  {
    name: 'Bantuan Bulk',
    type: 'link',
    path: '/BF-BTN/bantuan-bulk',
  },
  {
    name: 'Cipta Bantuan Bulk',
    type: 'link',
    path: '/BF-BTN/bantuan-bulk/cipta-bantuan-bulk',
  },
  {
    name: `Lihat ${id}`,
    type: 'current',
    path: `/BF-BTN/bantuan-bulk/cipta-bantuan-bulk/${id}`,
  },
]);

// Mock data based on bantuan ID
const getBantuanData = (id) => {
  const data = {
    'BP-2025-00001': {
      kodBP: 'BP-2025-00001',
      tajuk: 'Wang Saku Fakir Mac 2025',
      kategoriAsnaf: 'Fakir',
      status: 'Draf',
      jumlahAmaun: 'RM20,000.00',
      catatan: 'Tuntutan wang saku pelajar untuk bulan Mac 2025. Program ini bertujuan membantu pelajar fakir dalam memenuhi keperluan asas mereka.',
      namaPegawai: 'Ahmad bin Ali',
      tarikhMohon: '01/03/2025',
      kategoriBantuan: 'Bantuan Pendidikan',
      subKategori: 'Wang Saku',
      bantuan: 'Bantuan Pendidikan',
      kodBantuan: 'B314 - Bantuan Keperluan Pendidikan IPT (Fakir)',
      produkBantuan: '(HQ) KPIPT (Fakir) - Bantuan Wang Saku',
      penyiasat: 'Ahmad bin Hassan',
      cawangan: 'Cawangan Ibu Pejabat LZS'
    },
    'BP-2025-00002': {
      kodBP: 'BP-2025-00002',
      tajuk: 'Wang Saku Fakir Feb 2025',
      kategoriAsnaf: 'Fakir',
      status: 'Draf',
      jumlahAmaun: 'RM23,000.00',
      catatan: 'Tuntutan wang saku pelajar untuk bulan Feb 2025. Program ini bertujuan membantu pelajar fakir dalam memenuhi keperluan asas mereka.',
      namaPegawai: 'Ahmad bin Ali',
      tarikhMohon: '01/02/2025',
      kategoriBantuan: 'Bantuan Pendidikan',
      subKategori: 'Wang Saku',
      bantuan: 'Bantuan Pendidikan',
      kodBantuan: 'B314 - Bantuan Keperluan Pendidikan IPT (Fakir)',
      produkBantuan: '(HQ) KPIPT (Fakir) - Bantuan Wang Saku',
      penyiasat: 'Ahmad bin Hassan',
      cawangan: 'Cawangan Ibu Pejabat LZS'
    },
    'BP-2025-00003': {
      kodBP: 'BP-2025-00003',
      tajuk: 'Wang Saku Miskin Feb 2025',
      kategoriAsnaf: 'Miskin',
      status: 'Dalam Proses',
      jumlahAmaun: 'RM28,000.00',
      catatan: 'Tuntutan wang saku pelajar untuk bulan Feb 2025. Program ini bertujuan membantu pelajar miskin dalam memenuhi keperluan asas mereka.',
      namaPegawai: 'Ahmad bin Ali',
      tarikhMohon: '02/02/2025',
      kategoriBantuan: 'Bantuan Pendidikan',
      subKategori: 'Wang Saku',
      bantuan: 'Bantuan Pendidikan',
      kodBantuan: 'B314 - Bantuan Keperluan Pendidikan IPT (Fakir)',
      produkBantuan: '(HQ) KPIPT (Fakir) - Bantuan Wang Saku',
      penyiasat: 'Ahmad bin Hassan',
      cawangan: 'Cawangan Ibu Pejabat LZS'
    },
    'BP-2025-00004': {
      kodBP: 'BP-2025-00004',
      tajuk: 'Bantuan bencana Feb 2025',
      kategoriAsnaf: 'Fakir',
      status: 'Dalam Proses',
      jumlahAmaun: 'RM35,000.00',
      catatan: 'Tuntutan bantuan bencana untuk bulan Feb 2025. Program ini bertujuan membantu mangsa bencana fakir dalam memenuhi keperluan asas mereka.',
      namaPegawai: 'Ahmad bin Ali',
      tarikhMohon: '25/02/2025',
      kategoriBantuan: 'Bantuan Bencana',
      subKategori: 'Bantuan Banjir',
      bantuan: 'Bantuan Bencana',
      kodBantuan: 'B146 - (HQ) BANTUAN BENCANA (FAKIR)',
      produkBantuan: '(HQ) BANTUAN BANJIR (FAKIR)',
      penyiasat: 'Ahmad bin Hassan',
      cawangan: 'Cawangan Ibu Pejabat LZS'
    },
    'BP-2025-00005': {
      kodBP: 'BP-2025-00005',
      tajuk: 'Bantuan Pendidikan Mac 2025',
      kategoriAsnaf: 'Miskin',
      status: 'Lulus',
      jumlahAmaun: 'RM45,000.00',
      catatan: 'Tuntutan bantuan pendidikan untuk bulan Mac 2025. Program ini bertujuan membantu pelajar miskin dalam memenuhi keperluan asas mereka.',
      namaPegawai: 'Ahmad bin Ali',
      tarikhMohon: '15/03/2025',
      kategoriBantuan: 'Bantuan Pendidikan',
      subKategori: 'Wang Saku',
      bantuan: 'Bantuan Pendidikan',
      kodBantuan: 'B315 - Bantuan Keperluan Pendidikan IPT (Miskin)',
      produkBantuan: '(HQ) KPIPT (Miskin) - Bantuan Wang Saku',
      penyiasat: 'Ahmad bin Hassan',
      cawangan: 'Cawangan Ibu Pejabat LZS'
    },
    'BP-2025-00006': {
      kodBP: 'BP-2025-00006',
      tajuk: 'Bantuan Kesihatan Feb 2025',
      kategoriAsnaf: 'Fakir',
      status: 'Lulus',
      jumlahAmaun: 'RM30,000.00',
      catatan: 'Tuntutan bantuan kesihatan untuk bulan Feb 2025. Program ini bertujuan membantu pesakit fakir dalam memenuhi keperluan asas mereka.',
      namaPegawai: 'Ahmad bin Ali',
      tarikhMohon: '10/02/2025',
      kategoriBantuan: 'Bantuan Kesihatan',
      subKategori: 'Bantuan Kesihatan',
      bantuan: 'Bantuan Kesihatan',
      kodBantuan: 'B200 - Bantuan Kesihatan',
      produkBantuan: '(HQ) BANTUAN KESIHATAN',
      penyiasat: 'Ahmad bin Hassan',
      cawangan: 'Cawangan Ibu Pejabat LZS'
    },
    'BP-2025-00007': {
      kodBP: 'BP-2025-00007',
      tajuk: 'Bantuan Rumah Jan 2025',
      kategoriAsnaf: 'Fakir',
      status: 'Ditolak',
      jumlahAmaun: 'RM50,000.00',
      catatan: 'Tuntutan bantuan rumah untuk bulan Jan 2025. Program ini bertujuan membantu keluarga fakir dalam memenuhi keperluan asas mereka.',
      namaPegawai: 'Ahmad bin Ali',
      tarikhMohon: '05/01/2025',
      kategoriBantuan: 'Bantuan Rumah',
      subKategori: 'Bantuan Rumah',
      bantuan: 'Bantuan Rumah',
      kodBantuan: 'B100 - Bantuan Rumah',
      produkBantuan: '(HQ) BANTUAN RUMAH',
      penyiasat: 'Ahmad bin Hassan',
      cawangan: 'Cawangan Ibu Pejabat LZS'
    },
    'BP-2025-00008': {
      kodBP: 'BP-2025-00008',
      tajuk: 'Bantuan Makanan Feb 2025',
      kategoriAsnaf: 'Fakir',
      status: 'Ditolak',
      jumlahAmaun: 'RM15,000.00',
      catatan: 'Tuntutan bantuan makanan untuk bulan Feb 2025. Program ini bertujuan membantu keluarga fakir dalam memenuhi keperluan asas mereka.',
      namaPegawai: 'Ahmad bin Ali',
      tarikhMohon: '20/02/2025',
      kategoriBantuan: 'Bantuan Makanan',
      subKategori: 'Bantuan Makanan',
      bantuan: 'Bantuan Makanan',
      kodBantuan: 'B150 - Bantuan Makanan',
      produkBantuan: '(HQ) BANTUAN MAKANAN',
      penyiasat: 'Ahmad bin Hassan',
      cawangan: 'Cawangan Ibu Pejabat LZS'
    }
  };
  
  return data[id] || data['BP-2025-00001']; // Default to first record if ID not found
};

// Form data state (populated with data based on ID)
const formData = ref(getBantuanData(id));

// Options
const kategoriAsnafOptions = [
  { label: "Fakir", value: "Fakir" },
  { label: "Miskin", value: "Miskin" },
  { label: "Amil", value: "Amil" },
  { label: "Muallaf", value: "Muallaf" },
  { label: "Riqab", value: "Riqab" },
  { label: "Gharimin", value: "Gharimin" },
  { label: "Fi Sabilillah", value: "Fi Sabilillah" },
  { label: "Ibnus Sabil", value: "Ibnus Sabil" },
];

// Mock data for payments and recipients
const paymentList = ref([
  {
    kod: "PMT-001",
    bayaranKepada: "Individu",
    asnaf: "Fakir",
    contributor: "Zakat Selangor",
    recipient: "Ali bin Abu",
    organization: "-",
    amaun: 1000.00,
    tarikhBayaran: "2025-03-01"
  },
  {
    kod: "PMT-002",
    bayaranKepada: "Individu",
    asnaf: "Fakir",
    contributor: "Zakat Selangor",
    recipient: "Siti binti Ahmad",
    organization: "-",
    amaun: 1000.00,
    tarikhBayaran: "2025-03-01"
  }
]);

const recipientList = ref([
  {
    id: "RCP-001",
    namaPenuh: "Ali bin Abu",
    amaun: 1000.00,
    agihanSemula: "Ya",
    bulkProcessing: "Tidak",
    kategoriAsnaf: "Fakir",
    bayaranKepada: "Individu"
  },
  {
    id: "RCP-002",
    namaPenuh: "Siti binti Ahmad",
    amaun: 1000.00,
    agihanSemula: "Ya",
    bulkProcessing: "Tidak",
    kategoriAsnaf: "Fakir",
    bayaranKepada: "Individu"
  },
  {
    id: "RCP-003",
    namaPenuh: "Hassan bin Omar",
    amaun: 1500.00,
    agihanSemula: "Tidak",
    bulkProcessing: "Ya",
    kategoriAsnaf: "Fakir",
    bayaranKepada: "Individu"
  }
]);

const documentList = ref([
  {
    name: "Surat Permohonan Bantuan.pdf",
    size: "2.5 MB",
    uploadDate: "15/01/2025"
  },
  {
    name: "Senarai Penerima.xlsx",
    size: "1.2 MB",
    uploadDate: "15/01/2025"
  }
]);

// Modal states
const showPaymentModal = ref(false);
const showRecipientModal = ref(false);
const paymentModalMode = ref("add"); // 'add' or 'edit'
const recipientModalMode = ref("add"); // 'add' or 'edit'

// Methods
const getStatusVariant = (status) => {
  switch (status) {
    case 'Draf':
      return 'warning';
    case 'Sedang Diproses':
    case 'Dalam Proses':
      return 'info';
    case 'Ditolak':
      return 'danger';
    case 'Baru':
      return 'primary';
    case 'Selesai':
      return 'success';
    default:
      return 'secondary';
  }
};

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
  bayaranKepada: "Individu"
});

// Computed Properties
const totalAmount = computed(() => {
  return recipientList.value.reduce(
    (sum, recipient) => sum + (parseFloat(recipient.amaun) || 0),
    0
  );
});

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
    // Update total amount
    formData.value.jumlahAmaun = formatNumber(totalAmount.value);
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

const navigateBack = () => {
  navigateTo("/BF-BTN/bantuan-bulk/cipta-bantuan-bulk");
};

const editBantuan = () => {
  navigateTo(`/BF-BTN/bantuan-bulk/cipta-bantuan-bulk/${id}/edit`);
};

const printDetails = () => {
  window.print();
};

// Helper function to generate unique ID
const generateUniqueId = (prefix) => {
  return `${prefix}-${Date.now().toString().slice(-6)}-${Math.random()
    .toString(36)
    .slice(-4)}`;
};

// Payment methods
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

const handleEditPaymentModal = (payment) => {
  paymentForm.value = { ...payment };
  paymentModalMode.value = "edit";
  showPaymentModal.value = true;
};

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

const handleClosePaymentModal = () => {
  showPaymentModal.value = false;
};

// Recipient methods
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
    bayaranKepada: "Individu"
  };

  recipientModalMode.value = "add";
  showRecipientModal.value = true;
};

const handleEditRecipientModal = (recipient) => {
  recipientForm.value = { ...recipient };
  recipientModalMode.value = "edit";
  showRecipientModal.value = true;
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

const handleCloseRecipientModal = () => {
  showRecipientModal.value = false;
};

// Helper alert function (replace with your actual notification system)
const alert = (type, message) => {
  console.log(`${type.toUpperCase()}: ${message}`);
  // In a real application, you would use a toast notification system
  if (type === 'success') {
    // Success notification
  } else if (type === 'error') {
    // Error notification
  }
};

// Load data on component mount
onMounted(async () => {
  try {
    // In a real application, you would fetch data from API
    // const response = await $fetch(`/api/bantuan-bulk/${bantuanId}`);
    // formData.value = response.data;
    // paymentList.value = response.payments;
    // recipientList.value = response.recipients;
    // documentList.value = response.documents;
    
    console.log(`Loading bantuan details for ID: ${id}`);
  } catch (error) {
    console.error('Error loading bantuan details:', error);
  }
});

// Damaged Data Table Configuration
const damagedDataColumns = [
  { key: "namaPenerima", label: "Nama Penerima" },
  { key: "catatan", label: "Catatan" },
  {
     key: "actions",
    label: "Tindakan",
    sortable: false,
    align: "center",
  },
];

// Sample data for damaged data list (you can replace this with your actual data)
const damagedDataList = ref([
  { namaPenerima: "Ali bin Abu", catatan: "Data tidak lengkap"},
  { namaPenerima: "Siti binti Ali", catatan: "Dokumen hilang" },
]);

const handleEditDamagedData = (data) => {
  // Logic to handle editing damaged data
  console.log("Editing damaged data for:", data.namaPenerima);
  // Implement the logic to open the edit modal or navigate to the edit page
};

// Methods for Damaged Data
const handleAddDamagedData = () => {
  // Logic to add new damaged data
  const newDamagedData = {
    no: damagedDataList.value.length + 1,
    namaPenerima: "Contoh Penerima",
    catatan: "Contoh catatan untuk data rosak",
  };
  damagedDataList.value.push(newDamagedData);
  alert("success", "Maklumat data rosak berjaya ditambah");
};

const handleDeleteDamagedData = (data) => {
  const index = damagedDataList.value.findIndex(d => d.no === data.no);
  if (index !== -1) {
    damagedDataList.value.splice(index, 1);
    alert("success", "Data rosak berjaya dipadam");
  }
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
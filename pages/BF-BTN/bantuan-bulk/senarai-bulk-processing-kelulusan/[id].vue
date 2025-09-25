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
            <!-- Tarikh Jangkaan Bayaran -->
            <FormKit
              type="date"
              name="tarikhJangkaanBayaran"
              label="Tarikh Jangkaan Bayaran"
              v-model="bantuanDetail.tarikhJangkaanBayaran"
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
          <h2 class="text-xl font-semibold">Maklumat Bayaran Kepada (Payable To)</h2>
        </template>
        <template #body>
          <div
            v-if="paymentList.length === 0"
            class="text-center py-8 text-gray-500"
          >
            Tiada maklumat bayaran.
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
              <template v-slot:amaun="{ text }">
                {{ formatCurrency(text) }}
              </template>
              <template v-slot:actions="{ row }">
                <div class="flex space-x-2 justify-center">
                  <rs-button
                    variant="info"
                    size="sm"
                    class="flex gap-2"
                    @click="handleLihatBayaran(row)"
                  >
                    <Icon name="ph:eye" class="h-4 w-4" />
                    Lihat
                  </rs-button>
                </div>
              </template>
            </rs-table>
            <div class="flex justify-end text-sm text-gray-700 mt-2">
              <div class="font-medium">Jumlah Amaun (Bayaran):&nbsp;</div>
              <div>{{ formatCurrency(paymentTotal) }}</div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Senarai Penerima Section -->
      <rs-card>
        <template #header>
          <h2 class="text-xl font-semibold">Senarai Penerima (Beneficiary List)</h2>
        </template>
        <template #body>
          <div
            v-if="recipientList.length === 0"
            class="text-center py-8 text-gray-500"
          >
            Tiada maklumat penerima.
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
              <template v-slot:amaun="{ text }">
                {{ formatCurrency(text) }}
              </template>
              <template v-slot:actions="{ row }">
                <div class="flex space-x-2 justify-center">
                  <rs-button
                    variant="info"
                    size="sm"
                    class="flex gap-2"
                    @click="handleLihatPenerima(row)"
                  >
                    <Icon name="ph:eye" class="h-4 w-4" />
                    Lihat
                  </rs-button>
                </div>
              </template>
            </rs-table>
            <div class="flex justify-end text-sm text-gray-700 mt-2">
              <div class="font-medium">Jumlah Amaun (Penerima):&nbsp;</div>
              <div>{{ formatCurrency(totalAmount) }}</div>
            </div>
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
            <p class="text-gray-900">{{ selectedRecipient.state }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Negara</label>
            <p class="text-gray-900">{{ selectedRecipient.country }}</p>
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
    name: "Bulk Processing",
    type: "link",
    path: "/BF-BTN/bantuan-bulk",
  },
  {
    name: "Kelulusan",
    type: "link",
    path: "/BF-BTN/bantuan-bulk/senarai-bulk-processing-kelulusan",
  },
  {
    name: `Maklumat ${route.params.id}`,
    type: "current",
    path: `/BF-BTN/bantuan-bulk/senarai-bulk-processing-kelulusan/${route.params.id}`,
  },
]);

// Mock data based on bantuan ID
const getBantuanData = (id) => {
  const data = {
    'BP-2025-00001': {
      kodBP: 'BP-2025-00001',
      tajuk: 'Wang Saku Fakir Mac 2025',
      kategoriAsnaf: 'Fakir',
      status: 'Lulus',
      jumlahAmaun: 'RM20,000.00',
      catatan: 'Tuntutan wang saku pelajar untuk bulan Mac 2025. Program ini bertujuan membantu pelajar fakir dalam memenuhi keperluan asas mereka.',
      tarikhMohon: '01/03/2025',
      diciptaOleh: 'Ahmad bin Ali',
      diciptaPada: '17/02/2025 3:17pm',
      kategoriBantuan: 'Bantuan Pendidikan',
      subKategori: 'Wang Saku',
      bantuan: 'Bantuan Pendidikan',
      kodBantuan: 'B314 - Bantuan Keperluan Pendidikan IPT (Fakir)',
      produkBantuan: '(HQ) KPIPT (Fakir) - Bantuan Wang Saku',
      penyiasat: 'Ahmad bin Hassan',
      cawangan: 'Cawangan Ibu Pejabat LZS',
      tarikhJangkaanBayaran: '2025-05-04'
    },
    'BP-2025-00002': {
      kodBP: 'BP-2025-00002',
      tajuk: 'Wang Saku Fakir Feb 2025',
      kategoriAsnaf: 'Fakir',
      status: 'Dalam Proses',
      jumlahAmaun: 'RM23,000.00',
      catatan: 'Tuntutan wang saku pelajar untuk bulan Feb 2025. Program ini bertujuan membantu pelajar fakir dalam memenuhi keperluan asas mereka.',
      tarikhMohon: '01/02/2025',
      diciptaOleh: 'Ahmad bin Ali',
      diciptaPada: '17/02/2025 3:17pm',
      kategoriBantuan: 'Bantuan Pendidikan',
      subKategori: 'Wang Saku',
      bantuan: 'Bantuan Pendidikan',
      kodBantuan: 'B314 - Bantuan Keperluan Pendidikan IPT (Fakir)',
      produkBantuan: '(HQ) KPIPT (Fakir) - Bantuan Wang Saku',
      penyiasat: 'Ahmad bin Hassan',
      cawangan: 'Cawangan Ibu Pejabat LZS',
      tarikhJangkaanBayaran: '2025-05-04'
    },
    'BP-2025-00003': {
      kodBP: 'BP-2025-00003',
      tajuk: 'Wang Saku Miskin Feb 2025',
      kategoriAsnaf: 'Miskin',
      status: 'Dalam Proses',
      jumlahAmaun: 'RM28,000.00',
      catatan: 'Tuntutan wang saku pelajar untuk bulan Feb 2025. Program ini bertujuan membantu pelajar miskin dalam memenuhi keperluan asas mereka.',
      tarikhMohon: '02/02/2025',
      diciptaOleh: 'Ahmad bin Ali',
      diciptaPada: '17/02/2025 3:17pm',
      kategoriBantuan: 'Bantuan Pendidikan',
      subKategori: 'Wang Saku',
      bantuan: 'Bantuan Pendidikan',
      kodBantuan: 'B314 - Bantuan Keperluan Pendidikan IPT (Fakir)',
      produkBantuan: '(HQ) KPIPT (Fakir) - Bantuan Wang Saku',
      penyiasat: 'Ahmad bin Hassan',
      cawangan: 'Cawangan Ibu Pejabat LZS',
      tarikhJangkaanBayaran: '2025-05-04'
    },
    'BP-2025-00004': {
      kodBP: 'BP-2025-00004',
      tajuk: 'Bantuan bencana Feb 2025',
      kategoriAsnaf: 'Fakir',
      status: 'Dalam Proses',
      jumlahAmaun: 'RM35,000.00',
      catatan: 'Tuntutan bantuan bencana untuk bulan Feb 2025. Program ini bertujuan membantu mangsa bencana fakir dalam memenuhi keperluan asas mereka.',
      tarikhMohon: '25/02/2025',
      diciptaOleh: 'Ahmad bin Ali',
      diciptaPada: '17/02/2025 3:17pm',
      kategoriBantuan: 'Bantuan Bencana',
      subKategori: 'Bantuan Banjir',
      bantuan: 'Bantuan Bencana',
      kodBantuan: 'B146 - (HQ) BANTUAN BENCANA (FAKIR)',
      produkBantuan: '(HQ) BANTUAN BANJIR (FAKIR)',
      penyiasat: 'Ahmad bin Hassan',
      cawangan: 'Cawangan Ibu Pejabat LZS',
      tarikhJangkaanBayaran: '2025-05-04'
    },
    'BP-2025-01617': {
      kodBP: 'BP-2025-01617',
      tajuk: 'TUNTUTAN KFAM APRIL 2025 - PELAJAR',
      kategoriAsnaf: 'Muallaf',
      status: 'Lulus',
      jumlahAmaun: 'RM44,390.00',
      catatan: '',
      tarikhMohon: '04/05/2025',
      diciptaOleh: 'Ahmad bin Ali',
      diciptaPada: '17/02/2025 3:17pm',
      kategoriBantuan: 'Pendidikan (Muallaf)',
      subKategori: 'Elaun/Imbuhan (Muallaf - Pendidikan)',
      bantuan: '(HQ) ELAUN KEHADIRAN KELAS AGAM ASAS (MUALLAF)',
      kodBantuan: 'B309',
      produkBantuan: '(HQ) ELAUN KEHADIRAN KELAS AGAM ASAS (MUALLAF)',
      penyiasat: 'Muhammad Yazid Bin Abdullah',
      cawangan: 'Cawangan Ibu Pejabat LZS',
      tarikhJangkaanBayaran: '2025-05-04'

    },
    'BP-2025-01589': {
      kodBP: 'BP-2025-01589',
      tajuk: 'TUNTUTAN KFAM APRIL 2025 - GURU',
      kategoriAsnaf: 'Muallaf',
      status: 'Lulus',
      jumlahAmaun: 'RM54,710.00',
      catatan: '',
      tarikhMohon: '30/04/2025',
      diciptaOleh: 'Ahmad bin Ali',
      diciptaPada: '17/02/2025 3:17pm',
      kategoriBantuan: 'Sosial (Muallaf)',
      subKategori: 'Elaun/Imbuhan (Muallaf - Sosial)',
      bantuan: '(HQ) ELAUN GURU PEMBIMBING ASNAF (MUALLAF)',
      kodBantuan: 'B117',
      produkBantuan: '(HQ) ELAUN GURU PEMBIMBING ASNAF (MUALLAF)',
      penyiasat: 'Muhammad Yazid Bin Abdullah',
      cawangan: 'Cawangan Ibu Pejabat LZS',
      tarikhJangkaanBayaran: '2025-05-04'

    },
    'BP-2025-00007': {
      kodBP: 'BP-2025-00007',
      tajuk: 'Bantuan Rumah Jan 2025',
      kategoriAsnaf: 'Fakir',
      status: 'Ditolak',
      jumlahAmaun: 'RM50,000.00',
      catatan: 'Tuntutan bantuan rumah untuk bulan Jan 2025. Program ini bertujuan membantu keluarga fakir dalam memenuhi keperluan asas mereka.',
      tarikhMohon: '05/01/2025',
      diciptaOleh: 'Ahmad bin Ali',
      diciptaPada: '17/02/2025 3:17pm',
      kategoriBantuan: 'Bantuan Rumah',
      subKategori: 'Bantuan Rumah',
      bantuan: 'Bantuan Rumah',
      kodBantuan: 'B100 - Bantuan Rumah',
      produkBantuan: '(HQ) BANTUAN RUMAH',
      penyiasat: 'Ahmad bin Hassan',
      cawangan: 'Cawangan Ibu Pejabat LZS',
      tarikhJangkaanBayaran: '2025-05-04'
      
    },
    'BP-2025-00008': {
      kodBP: 'BP-2025-00008',
      tajuk: 'Bantuan Makanan Feb 2025',
      kategoriAsnaf: 'Fakir',
      status: 'Ditolak',
      jumlahAmaun: 'RM15,000.00',
      catatan: 'Tuntutan bantuan makanan untuk bulan Feb 2025. Program ini bertujuan membantu keluarga fakir dalam memenuhi keperluan asas mereka.',
      tarikhMohon: '20/02/2025',
      diciptaOleh: 'Ahmad bin Ali',
      diciptaPada: '17/02/2025 3:17pm',
      kategoriBantuan: 'Bantuan Makanan',
      subKategori: 'Bantuan Makanan',
      bantuan: 'Bantuan Makanan',
      kodBantuan: 'B150 - Bantuan Makanan',
      produkBantuan: '(HQ) BANTUAN MAKANAN',
      penyiasat: 'Ahmad bin Hassan',
      cawangan: 'Cawangan Ibu Pejabat LZS',
      tarikhJangkaanBayaran: '2025-05-04'
    }
  };
  
  return data[id] || data['BP-2025-00001']; // Default to first record if ID not found
};

// Form data state (populated with data based on ID)
const bantuanDetail = ref(getBantuanData(route.params.id));


// Removed bayaran columns as we're using card layout now

// Mock bayaran kepada data
const paymentDataByBp = {
  "BP-2025-01617": [
    {
      kod: "PT-2025-36330",
      idPermohonan: "",
      bayaranKepada: "asnaf",
      asnaf: "WOO MENG LEONG",
      recipient: "",
      organization: "",
      amaun: 250.0,
      tarikhBayaran: "2025-05-04",
      bankName: "",
      bankAccount: "",
      checkbox: ""
    },
    {
      kod: "PT-2025-36331",
      idPermohonan: "",
      bayaranKepada: "asnaf",
      asnaf: "EUNIKE VALBORG BOLDVIK",
      recipient: "",
      organization: "",
      amaun: 250.0,
      tarikhBayaran: "2025-05-04",
      bankName: "",
      bankAccount: "",
      checkbox: ""
    },
    {
      kod: "PT-2025-36332",
      idPermohonan: "",
      bayaranKepada: "asnaf",
      asnaf: "JULIE ANN BACLAS EBIO",
      recipient: "",
      organization: "",
      amaun: 550.0,
      tarikhBayaran: "2025-05-04",
      bankName: "",
      bankAccount: "",
      checkbox: ""
    },
    {
      kod: "PT-2025-36333",
      idPermohonan: "",
      bayaranKepada: "asnaf",
      asnaf: "CHU KEAN HENG",
      recipient: "",
      organization: "",
      amaun: 650.0,
      tarikhBayaran: "2025-05-04",
      bankName: "",
      bankAccount: "",
      checkbox: ""
    }
  ],
  "BP-2025-01589": [
    {
      kod: "PT-2025-34488",
      idPermohonan: "",
      bayaranKepada: "recipient",
      asnaf: "",
      recipient: "AHMAD FIRDAUS BIN MUHAM...",
      organization: "",
      amaun: 1950.0,
      tarikhBayaran: "2025-04-30",
      bankName: "",
      bankAccount: "",
      checkbox: ""
    },
    {
      kod: "PT-2025-34489",
      idPermohonan: "",
      bayaranKepada: "recipient",
      asnaf: "",
      recipient: "CHE NORHAYATI BINTI CHE MA...",
      organization: "",
      amaun: 1950.0,
      tarikhBayaran: "2025-04-30",
      bankName: "",
      bankAccount: "",
      checkbox: ""
    },
    {
      kod: "PT-2025-34490",
      idPermohonan: "",
      bayaranKepada: "recipient",
      asnaf: "",
      recipient: "FIRDAUZ BIN NOH",
      organization: "",
      amaun: 1950.0,
      tarikhBayaran: "2025-04-30",
      bankName: "",
      bankAccount: "",
      checkbox: ""
    },
    {
      kod: "PT-2025-34491",
      idPermohonan: "",
      bayaranKepada: "recipient",
      asnaf: "",
      recipient: "I.JANNAH BINTI ALI",
      organization: "",
      amaun: 1950.0,
      tarikhBayaran: "2025-04-30",
      bankName: "",
      bankAccount: "",
      checkbox: ""
    }
  ]
};

const paymentList = ref([...(paymentDataByBp[route.params.id] || [])]);

// Removed penerima columns as we're using card layout now

const paymentColumns = [
  { key: "kod", label: "Kod" },
  { key: "idPermohonan", label: "ID Permohonan" },
  { key: "bayaranKepada", label: "Bayaran Kepada" },
  { key: "asnaf", label: "Kategori Asnaf" },
  { key: "contributor", label: "Contributor" },
  { key: "recipient", label: "Recipient" },
  { key: "organization", label: "Organization" },
  { key: "amaun", label: "Amaun" },
  { key: "tarikhBayaran", label: "Tarikh Bayaran" },
  { key: "bankName", label: "Bank" },
  { key: "bankAccount", label: "No. Akaun" },
];

const recipientColumns = [
  { key: "namaPenuh", label: "Nama Penuh" },
  { key: "amaun", label: "Amaun" },
  { key: "agihanSemula", label: "Agihan Semula" },
  { key: "bulkProcessing", label: "Bulk Processing" },
  { key: "kategoriAsnaf", label: "Kategori Asnaf" },
  { key: "bayaranKepada", label: "Bayaran Kepada" },
  { key: "state", label: "Negeri" },
  { key: "country", label: "Negara" },
];

// Recipient data by BP id (mock)
const recipientsByBP = {
  "BP-2025-01617": [
    {
      id: "RCP-BP-2025-01617-001",
      namaPenuh: "AARON ALEXANDRE R.JOHN",
      amaun: 360.0,
      agihanSemula: "",
      bulkProcessing: "BP-2025-01617",
      kategoriAsnaf: "Muallaf",
      bayaranKepada: "Asnaf",
      state: "Selangor",
      country: "Malaysia"
    },
    {
      id: "RCP-BP-2025-01617-002",
      namaPenuh: "AISYAH LINY BINTI TEGEK",
      amaun: 650.0,
      agihanSemula: "",
      bulkProcessing: "BP-2025-01617",
      kategoriAsnaf: "Muallaf",
      bayaranKepada: "Asnaf",
      state: "Selangor",
      country: "Malaysia"
    },
    {
      id: "RCP-BP-2025-01617-003",
      namaPenuh: "AJANANI A/P ARUMUGAM",
      amaun: 650.0,
      agihanSemula: "",
      bulkProcessing: "BP-2025-01617",
      kategoriAsnaf: "Muallaf",
      bayaranKepada: "Asnaf",
      state: "Selangor",
      country: "Malaysia"
    },
    {
      id: "RCP-BP-2025-01617-004",
      namaPenuh: "ALYSSA LEONG JIYAN",
      amaun: 300.0,
      agihanSemula: "",
      bulkProcessing: "BP-2025-01617",
      kategoriAsnaf: "Muallaf",
      bayaranKepada: "Asnaf",
      state: "Selangor",
      country: "Malaysia"
    }
  ],
  "BP-2025-01589": [
    {
      id: "RCP-BP-2025-01589-001",
      namaPenuh: "ABDUL RAHIM BIN MOHD ALI",
      amaun: 1950.0,
      agihanSemula: "",
      bulkProcessing: "BP-2025-01589",
      kategoriAsnaf: "Muallaf",
      bayaranKepada: "Recipient",
      state: "Selangor",
      country: "Malaysia"
    },
    {
      id: "RCP-BP-2025-01589-002",
      namaPenuh: "ABDUL RAHIM BIN MOHD ALI",
      amaun: 1950.0,
      agihanSemula: "",
      bulkProcessing: "BP-2025-01589",
      kategoriAsnaf: "Muallaf",
      bayaranKepada: "Recipient",
      state: "Selangor",
      country: "Malaysia"
    },
    {
      id: "RCP-BP-2025-01589-003",
      namaPenuh: "AHMAD FIRDAUS BIN MUHAMMAD",
      amaun: 1950.0,
      agihanSemula: "",
      bulkProcessing: "BP-2025-01589",
      kategoriAsnaf: "Muallaf",
      bayaranKepada: "Recipient",
      state: "Selangor",
      country: "Malaysia"
    },
    {
      id: "RCP-BP-2025-01589-004",
      namaPenuh: "CHE NORHAYATI BINTI CHE MAHMOOD",
      amaun: 1950.0,
      agihanSemula: "",
      bulkProcessing: "BP-2025-01589",
      kategoriAsnaf: "Muallaf",
      bayaranKepada: "Recipient",
      state: "Selangor",
      country: "Malaysia"
    }
  ]
};

const recipientList = ref([...(recipientsByBP[route.params.id] || [])]);


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
  navigateTo("/BF-BTN/bantuan-bulk/senarai-bulk-processing-kelulusan");
};

const handleSimpan = async () => {
  if (!pelulusForm.value.statusSemakan) {
    alert("Sila pilih Status Semakan");
    return;
  }

  try {
    // Here you would make API call to save the pelulus
    console.log("Saving pelulus:", pelulusForm.value);
    alert("Maklumat pelulus berjaya disimpan!");
  } catch (error) {
    console.error("Error saving pelulus:", error);
    alert("Ralat semasa menyimpan maklumat pelulus. Sila cuba lagi.");
  }
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
    await navigateTo("/BF-BTN/bantuan-bulk/senarai-bulk-processing-kelulusan");
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
    "Lulus": "success",
    "Selesai": "success",
    "Ditolak": "danger",
  };
  return variants[status] || "default";
};

// Computed properties
const totalAmount = computed(() => {
  return recipientList.value.reduce(
    (sum, recipient) => sum + (parseFloat(recipient.amaun) || 0),
    0
  );
});

const paymentTotal = computed(() => {
  return paymentList.value.reduce(
    (sum, payment) => sum + (parseFloat(payment.amaun) || 0),
    0
  );
});

// Currency display helper
const formatCurrency = (n) => {
  const num = parseFloat(n);
  if (isNaN(num) || num === null || num === undefined) return 'RM0.00';
  return new Intl.NumberFormat("ms-MY", {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 2,
  }).format(num);
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

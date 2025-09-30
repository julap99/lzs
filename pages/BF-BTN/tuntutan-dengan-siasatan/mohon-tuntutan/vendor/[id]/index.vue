<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #body>
        <RsTab variant="primary" type="default">
          <RsTabItem title="Maklumat Pemohon" :active="true">
            <h3 class="text-lg font-medium mb-4">Maklumat Pemohon</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nama</label>
                <p class="mt-1 text-gray-600">{{ formData.namaPemohon }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">No. Kad Pengenalan</label>
                <p class="mt-1 text-gray-600">{{ formData.noPengenalan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">No. Telefon</label>
                <p class="mt-1 text-gray-600">{{ formData.noTelefonPemohon }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Emel</label>
                <p class="mt-1 text-gray-600">{{ formData.emailPemohon }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Status Household</label>
                <rs-badge :variant="getStatusVariant(formData.statusHousehold)">{{ formData.statusHousehold }}</rs-badge>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Status Individu</label>
                <rs-badge :variant="getStatusVariant(formData.statusIndividu)">{{ formData.statusIndividu }}</rs-badge>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Status Multidimensi</label>
                <rs-badge :variant="getStatusVariant(formData.statusMultidimensi)">{{ formData.statusMultidimensi }}</rs-badge>
              </div>
            </div>
          </RsTabItem>

          <RsTabItem title="Maklumat Bantuan">
            <h3 class="text-lg font-medium mb-4">Maklumat Bantuan</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit v-model="formData.noBtn" type="text" label="No. Bantuan" readonly :classes="{ input: 'bg-gray-100 cursor-not-allowed' }" />
              <FormKit v-model="formData.aidProduct" type="text" label="Jenis Bantuan" readonly :classes="{ input: 'bg-gray-100 cursor-not-allowed' }" />
            </div>

            <div class="bg-gray-50 p-4 rounded-lg mb-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit v-model="formData.tarikhMula" type="date" label="Tarikh Mula" readonly />
                <FormKit v-model="formData.tarikhAkhir" type="date" label="Tarikh Akhir" readonly />
              </div>
            </div>

            <h3 class="text-lg font-medium mt-6 mb-4">Senarai Distribution Item (DI)</h3>
            <RsTable :data="distributionItems" :field="fieldsDI" :columns="columnsDI" advanced :showSearch="false" :showFilter="false" :options="{ variant: 'default', striped: true, bordered: false, borderless: false, hover: true }" :optionsAdvanced="{ sortable: true, filterable: false, responsive: true, outsideBorder: true }" :pageSize="10" :showNoColumn="true" :sort="{ column: 'tahun', direction: 'desc' }">
              <template #amaun="{ text }">RM {{ toMYR(text) }}</template>
              <template #status="{ text }"><rs-badge :variant="text === 'Aktif' ? 'success' : 'danger'">{{ text }}</rs-badge></template>
            </RsTable>
          </RsTabItem>

          <RsTabItem title="Maklumat Tuntutan">
            <h3 class="text-lg font-medium mb-4">Maklumat Tuntutan</h3>
            <h3 class="text-lg font-medium mt-6 mb-4">Senarai Guarantee Letter (GL)</h3>
            <RsTable :data="glRows" :field="fieldsGL" :columns="columnsGL" :showSearch="false" :showFilter="false" advanced :options="{ variant: 'default', striped: true, bordered: false, borderless: false, hover: true }" :optionsAdvanced="{ sortable: true, filterable: false, responsive: true, outsideBorder: true }" :pageSize="10" :showNoColumn="true" :sort="{ column: 'createdDate', direction: 'desc' }">
              <template #amaun="{ text }">RM {{ toMYR(text) }}</template>
              <template #invoiceTotal="{ text }">RM {{ toMYR(text) }}</template>
              <template #currentBalance="{ text }">RM {{ toMYR(text) }}</template>
              <template #status="{ text }"><rs-badge :variant="text === 'AKTIF' ? 'success' : 'secondary'">{{ text }}</rs-badge></template>
              <template #row="{ row }">
                <tr @click="applyGlFilter(row.glNo)" class="cursor-pointer hover:bg-gray-50">
                  <td v-for="col in columnsGL" :key="col.key">
                    <slot :name="col.key" :text="row[col.key]" :value="row" v-if="$slots[col.key]" />
                    <template v-else>{{ row[col.key] }}</template>
                  </td>
                </tr>
              </template>
              <template #tindakan="{ value }">
                <div class="flex items-center gap-2">
                  <rs-button variant="ghost" size="sm" class="group relative p-1 bg-transparent border-0 shadow-none text-blue-600 hover:text-blue-800" @click.stop="openInvoiceModal(value.glNo)" title="Cipta Invoice">
                    <Icon name="material-symbols:add" size="22" />
                  </rs-button>
                </div>
              </template>
            </RsTable>

            <h3 class="text-lg font-medium mt-6 mb-4">Senarai Invoice</h3>
            <RsTable :data="filteredInvoices" :key="filteredInvoices.length" :field="fieldsInv" :columns="columnsInv" advanced :autoFields="false" :showSearch="false" :showFilter="false" :options="{ variant: 'default', striped: true, bordered: false, borderless: false, hover: true }" :optionsAdvanced="{ sortable: true, filterable: false, responsive: true, outsideBorder: true }" :pageSize="10" :showNoColumn="true" :sort="{ column: 'tahun', direction: 'desc' }">
              <template #title="{ text }"><span class="font-medium">{{ text || '—' }}</span></template>
              <template #tahun="{ text }">{{ text || '—' }}</template>
              <template #semester="{ text }">{{ formatSemester(text) }}</template>
              <template #invoiceNo="{ text }"><span class="font-mono">{{ text || '—' }}</span></template>
              <template #diNo="{ text }"><span class="font-mono">{{ text || '—' }}</span></template>
              <template #glNo="{ text }"><span class="font-mono">{{ text || '—' }}</span></template>
              <template #paNo="{ text }"><span class="font-mono">{{ text || '—' }}</span></template>
              <template #amaun="{ text }">RM {{ toMYR(text) }}</template>
              <template #statusKelulusan="{ text }">
                <rs-badge :variant="text === 'APPROVED' ? 'success' : text === 'REJECTED' ? 'danger' : 'warning'">{{ text || 'Menunggu Kelulusan' }}</rs-badge>
              </template>
            </RsTable>
          </RsTabItem>

          <RsTabItem title="Payment Advice">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-lg font-medium">Payment Advice</h3>
            </div>
            <RsTable :data="[]" :field="fieldsPA" :columns="columnsPA" advanced :showSearch="false" :showFilter="false" :options="{ variant: 'default', striped: true, bordered: false, borderless: false, hover: true }" :optionsAdvanced="{ sortable: true, filterable: false, responsive: true, outsideBorder: true }" :pageSize="10" :showNoColumn="true" :sort="{ column: 'createdDate', direction: 'desc' }">
              <template #amaun="{ text }">RM {{ toMYR(text) }}</template>
              <template #status="{ text }"><rs-badge :variant="text === 'SAH' ? 'success' : text === 'DITOLAK' ? 'danger' : 'warning'">{{ text || '—' }}</rs-badge></template>
            </RsTable>
          </RsTabItem>

          <RsTabItem title="Dokumen Sokongan">
            <h3 class="text-lg font-medium mb-4">Dokumen Sokongan</h3>
            <RsTable :data="documents" :field="fieldsDoc" :columns="columnsDoc" advanced :showSearch="true" :showFilter="false" :options="{ variant: 'default', striped: true, bordered: false, borderless: false, hover: true }" :optionsAdvanced="{ sortable: true, filterable: true, responsive: true, outsideBorder: true }" :pageSize="10" :showNoColumn="true" :sort="{ column: 'uploadDate', direction: 'desc' }" :autoFields="false">
              <template #tindakan="{ value }">
                <div class="text-center">
                  <rs-button variant="ghost" size="sm" class="!px-2 !py-1 text-blue-600 hover:text-blue-800" @click="viewDocument(value)" title="Lihat Dokumen">
                    <Icon name="material-symbols:visibility" class="w-5 h-5" />
                  </rs-button>
                </div>
              </template>
            </RsTable>
          </RsTabItem>
        </RsTab>

        <div class="border-t border-gray-200 my-6"></div>
        <div class="flex items-center justify-between mt-4">
          <div>
            <rs-button type="button" variant="primary-outline" @click="navigateTo('/BF-BTN/tuntutan-dengan-siasatan/carian-tuntutan/')">
              
              <Icon name="material-symbols:arrow-back" class="w-4 h-4 mr-1" /> Kembali
            </rs-button>
          </div>
          <div class="flex gap-4">
            <rs-button type="button" variant="secondary" @click="handleSaveDraft"><Icon name="material-symbols:save" class="w-4 h-4 mr-1" /> Simpan</rs-button>
            <rs-button type="button" variant="primary" @click="handleSubmit"><Icon name="material-symbols:send" class="w-4 h-4 mr-1" /> Hantar Tuntutan</rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Modal: Cipta Invoice -->
    <RsModal v-model="showInvoiceModal" title="Cipta Invoice" size="lr">
      <template #body>
        <div class="grid grid-cols-1 gap-6">
          <FormKit v-model="newInvoice.invoiceNo" type="text" label="No. Invois" disabled />
          <FormKit v-model="newInvoice.noInvoisPelanggan" type="text" label="Customer Invoice No" />
          <FormKit v-model="newInvoice.tahun" type="text" label="Tahun" readonly />
          <FormKit v-if="isIPT" v-model="newInvoice.semester" type="select" label="Semester" :options="semesterOptions" validation="required" :validation-messages="{ required: 'Sila pilih Semester' }" />
          <FormKit v-model="newInvoice.tajuk" type="text" label="Tajuk" required />
          <FormKit v-if="isIPT" v-model="newInvoice.cgpa" type="number" label="CGPA" validation="required|number|min:0|max:4" :validation-messages="{ required: 'Sila masukkan CGPA', number: 'Sila masukkan nilai yang sah', min: 'CGPA tidak boleh kurang dari 0', max: 'CGPA tidak boleh lebih dari 4' }" step="0.01" min="0" max="4" />
          <FormKit v-model="newInvoice.penerimaBayaran" type="text" label="Penerima Bayaran" readonly />
          <FormKit v-model="newInvoice.mop" type="text" label="MOP" readonly />
          <FormKit v-model="newInvoice.namaPenerima" type="text" label="Nama Penerima" readonly />
          <FormKit v-model="newInvoice.bank" type="text" label="Bank" readonly />
          <FormKit v-model="newInvoice.noAkaun" type="text" label="No. Akaun" readonly />
          <FormKit v-model="newInvoice.tarikhJangkaanPembayaran" type="date" label="Expected Payment Date" />
          <FormKit v-model="newInvoice.amaun" type="number" label="Amaun (RM)" validation="required|number|min:0" :validation-messages="{ required: 'Sila masukkan amaun', number: 'Sila masukkan nilai yang sah', min: 'Amaun tidak boleh negatif' }" step="0.01" min="0" />
          <div v-if="amountExceedsGL" class="text-sm text-red-600 -mt-2">Amaun (RM) telah melebihi Amaun GL (RM).</div>
          <FormKit v-model="newInvoice.lampiran" type="file" label="Muat Naik Lampiran" accept=".pdf,.doc,.docx" multiple help="Lampiran apa yang perlu dimasukkan (boleh muat naik berbilang fail)" />
          <div v-if="newInvoice.lampiran && newInvoice.lampiran.length > 0" class="mt-2">
            <p class="text-sm text-gray-600 mb-2">Fail yang dipilih ({{ newInvoice.lampiran.length }}):</p>
            <div class="space-y-1">
              <div v-for="(file, index) in newInvoice.lampiran" :key="index" class="flex items-center text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded">
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                {{ file.name }}
              </div>
            </div>
          </div>
          <FormKit v-model="newInvoice.catatan" type="textarea" label="Catatan" rows="3" placeholder="Masukkan catatan tambahan jika perlu..." />
        </div>
      </template>
      <template #footer>
        <rs-button @click="showInvoiceModal = false">Batal</rs-button>
        <rs-button :disabled="getGlBalance(selectedGlNo) <= 0 || !newInvoice.amaun || Number(newInvoice.amaun) <= 0 || amountExceedsGL" @click="createInvoice">Simpan</rs-button>
      </template>
    </RsModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNuxtApp, navigateTo, useRoute } from '#app'

definePageMeta({ title: 'Mohon Tuntutan (Vendor)' })

const { $swal } = useNuxtApp()

const breadcrumb = ref([
  { name: 'Pengurusan Bantuan', type: 'link', path: '/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-vendor' },
  { name: 'Tuntutan', type: 'link', path: '/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-vendor' },
  { name: 'Mohon Tuntutan (Vendor)', type: 'current', path: '/BF-BTN/tuntutan-dengan-siasatan/mohon-tuntutan/vendor' }
])

const route = useRoute()

// Form data
const formData = ref({
  namaPemohon: 'Ahmad bin Abdullah',
  noPengenalan: '800101-10-1111',
  emailPemohon: 'ahmad.abdullah@email.com',
  noTelefonPemohon: '012-3456789',
  kategoriAsnaf: 'Fakir',
  statusHousehold: 'Fakir',
  statusIndividu: 'Fakir',
  statusMultidimensi: 'Produktif',
  noBtn: 'BTN-2025-00012',
  noGL: '',
  noInvois: 'INV-2025-00124',
  kodBantuan: '',
  aid: 'B307 - (HQ) BANTUAN DERMASISWA IPT DALAM NEGARA (FAKIR) - IPTA/IPTS',
  aidProduct: 'Dermasiswa IPT Dalam Negara (Fakir) ',
  productPackage: '',
  entitlementProduct: '',
  amaunTuntutan: '',
  tarikh: '',
  catatan: '',
  dokumenSokongan: [],
  tarikhMula: '2025-09-22',
  tarikhAkhir: '2026-09-22',
  penerimaBayaran: '',
  mop: '',
  namaPenerima: '',
  bank: '',
  noAkaun: '',
  tarikhJangkaanPembayaran: '',
  tarikhDicipta: '04/04/2025 03:45 PM'
})

// DI table schema
const fieldsDI = ['diNo', 'entitlementProduct', 'penerima', 'bulan', 'tahun', 'status', 'amaun']
const columnsDI = [
  { key: 'diNo', label: 'DI No' },
  { key: 'entitlementProduct', label: 'Entitlement Product' },
  { key: 'penerima', label: 'Penerima' },
  { key: 'bulan', label: 'Bulan' },
  { key: 'tahun', label: 'Tahun' },
  { key: 'status', label: 'Status' },
  { key: 'amaun', label: 'Amaun (RM)' }
]

// GL table schema
const fieldsGL = ['glNo', 'diNo', 'createdDate', 'penerimaBayaran', 'status', 'bulan', 'tahun', 'amaun', 'invoiceCount', 'invoiceTotal', 'currentBalance', 'tindakan']
const columnsGL = [
  { key: 'glNo', label: 'GL No' },
  { key: 'diNo', label: 'DI No' },
  { key: 'createdDate', label: 'Tarikh Dicipta' },
  { key: 'penerimaBayaran', label: 'Penerima Bayaran' },
  { key: 'status', label: 'Status' },
  { key: 'bulan', label: 'Bulan' },
  { key: 'tahun', label: 'Tahun' },
  { key: 'amaun', label: 'Amaun (RM)' },
  { key: 'invoiceCount', label: 'Bil Invois' },
  { key: 'invoiceTotal', label: 'Jumlah Invois (RM)' },
  { key: 'currentBalance', label: 'Baki (RM)' },
  { key: 'tindakan', label: 'Tindakan' }
]

// Invoice table schema
const fieldsInv = [
  'invoiceNo',
  'title',
  'tahun',
  'semester',
  'diNo',
  'glNo',
  'paNo',
  'statusKelulusan',
  'amaun'
]

const columnsInv = [
  { key: 'invoiceNo', label: 'Invoice No' },
  { key: 'title', label: 'Tajuk' },
  { key: 'tahun', label: 'Tahun' },
  { key: 'semester', label: 'Semester' },
  { key: 'diNo', label: 'DI No' },
  { key: 'glNo', label: 'GL No' },
  { key: 'paNo', label: 'PA No' },
  { key: 'statusKelulusan', label: 'Status Kelulusan' },
  { key: 'amaun', label: 'Amaun (RM)' }
]

// Payment Advice table schema
const fieldsPA = ['paNo', 'createdDate', 'penerimaBayaran', 'status', 'bulan', 'tahun', 'amaun']
const columnsPA = [
  { key: 'paNo', label: 'PA No' },
  { key: 'createdDate', label: 'Tarikh Dicipta' },
  { key: 'penerimaBayaran', label: 'Penerima Bayaran' },
  { key: 'status', label: 'Status' },
  { key: 'bulan', label: 'Bulan' },
  { key: 'tahun', label: 'Tahun' },
  { key: 'amaun', label: 'Amaun (RM)' }
]

// Dokumen table schema
const fieldsDoc = ['name', 'nameFile', 'uploadDate', 'tindakan']
const columnsDoc = [
  { key: 'name', label: 'Nama Dokumen' },
  { key: 'nameFile', label: 'Nama File' },
  { key: 'uploadDate', label: 'Tarikh Muat Naik' },
  { key: 'tindakan', label: 'Tindakan' }
]

const noBtnOptions = ref([
  { label: 'NAS-2025-00012', value: 'NAS-2025-00012' },
  { label: 'NAS-2025-00014', value: 'NAS-2025-00014' }
])

const distributionItems = ref([
  {
    diNo: 'DI-001',
    entitlementProduct: '(HQ) DERMASISWA IPT DALAM NEGARA (FAKIR) - IPTA/IPTS',
    penerima: 'IPTA',
    bulan: 'MAC',
    tahun: '2025',
    status: 'Aktif',
    amaun: '1500.00'
  }
])

const documents = ref([
  { 
    name: 'Lampiran Invoice 1', 
    nameFile: 'Lampiran_Invoice_INV-2025-00124.pdf', 
    uploadDate: '22/09/2025',
    tindakan: 1
  },
  { 
    name: 'Lampiran Invoice 2', 
    nameFile: 'Lampiran_Invoice_INV-2025-00125.pdf', 
    uploadDate: '21/09/2025',
    tindakan: 2
  },
  { 
    name: 'Lampiran Invoice 3', 
    nameFile: 'Lampiran_Invoice_INV-2025-00126.pdf', 
    uploadDate: '20/09/2025',
    tindakan: 3
  },
  { 
    name: 'Lampiran Invoice 4', 
    nameFile: 'Lampiran_Invoice_INV-2025-00127.pdf', 
    uploadDate: '19/09/2025',
    tindakan: 4
  }
])

// GL state
const guaranteeLetters = ref([
  {
    glNo: 'GL-001',
    diNo: 'DI-001',
    createdDate: '15/01/2025',
    penerimaBayaran: 'IPTA',
    status: 'AKTIF',
    bulan: 'MAC',
    tahun: '2025',
    amaun: '1500.00'
  }
])

const invoices = ref([])

// Modal state
const showInvoiceModal = ref(false)
const selectedGlNo = ref('')
const newInvoice = ref({
  invoiceNo: 'INV-2025-00124',
  noInvoisPelanggan: '',
  tahun: '2025',
  semester: '',
  tajuk: '',
  cgpa: '',
  penerimaBayaran: 'IPTA',
  mop: 'EFT',
  namaPenerima: 'IPTA',
  bank: 'CIMB',
  noAkaun: '8001234567',
  tarikhJangkaanPembayaran: '',
  amaun: '',
  lampiran: [],
  catatan: ''
})

const semesterOptions = [
  { label: 'Semester 1', value: '1' },
  { label: 'Semester 2', value: '2' },
  { label: 'Semester 3', value: '3' }
]

// Mock data based by noBantuan 
const mockData = {
  'APP-2025-001481': {
    pemohon: 'ALI BIN MOHAMED',
    noKPPemohon: '940511146045',
    maklumatBantuan: '(HQ) DERMASISWA IPT DALAM NEGARA (FAKIR) - IPTA/IPTS',
    namaPenerimaManfaat: 'MOHD FARHAN BIN ALI',
    namaPenerima: 'UPM'
  },
  'APP-2025-001482': {
    pemohon: 'ALI BIN MOHAMED',
    noKPPemohon: '940511146045',
    maklumatBantuan: '(HQ) DERMASISWA IPT DALAM NEGARA (FAKIR) - IPTA/IPTS',
    namaPenerimaManfaat: 'MOHD FARHAN BIN ALI',
    namaPenerima: 'MOHD FARHAN BIN ALI'
  },
  'APP-2025-001483': {
    pemohon: 'ALI BIN MOHAMED',
    noKPPemohon: '920511146555',
    maklumatBantuan: '(HQ) BANTUAN DERMASISWA SEKOLAH ASRAMA (FAKIR)',
    namaPenerimaManfaat: 'ZAINAB BINTI ALI',
    namaPenerima: 'SEKOLAH MENENGAH SAINS BANTING'
  },
  'APP-2025-001484': {
    pemohon: 'ALI BIN MOHAMED',
    noKPPemohon: '920511146555',
    maklumatBantuan: '(HQ) BANTUAN DERMASISWA SEKOLAH ASRAMA (FAKIR)',
    namaPenerimaManfaat: 'ZAINAB BINTI ALI',
    namaPenerima: 'ALI BIN MOHAMED'
  },
  'APP-2025-001485': {
    pemohon: 'ALI BIN MOHAMED',
    noKPPemohon: '850315123456',
    maklumatBantuan: '(HQ) BANTUAN PERUBATAN DIALISIS (FAKIR)',
    namaPenerimaManfaat: 'AHMAD BIN HASSAN',
    namaPenerima: 'HOSPITAL SELAYANG'
  },
  'APP-2025-001486': {
    pemohon: 'ALI BIN MOHAMED',
    noKPPemohon: '880420234567',
    maklumatBantuan: '(HQ) BANTUAN PERUBATAN DIALISIS (FAKIR)',
    namaPenerimaManfaat: 'FATIMAH BINTI MOHAMED',
    namaPenerima: 'HOSPITAL KUALA LUMPUR'
  }
}

// Computed properties
const glRows = computed(() =>
  guaranteeLetters.value.map((gl) => {
    const glTotal = toNum(gl.amaun)
    const invTotal = sumInvoicesByGL(gl.glNo)
    const balance = Math.max(glTotal - invTotal, 0)
    return {
      ...gl,
      invoiceCount: invoices.value.filter((i) => i.glNo === gl.glNo).length,
      invoiceTotal: invTotal.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      currentBalance: balance.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  })
)

const filteredInvoices = computed(() => {
  if (!selectedGlNo.value) return invoices.value
  return invoices.value.filter(inv => inv.glNo === selectedGlNo.value)
})

// Helper functions
const toMYR = (n) => {
  if (n == null || n === '') return '0.00'
  const num = typeof n === 'number' ? n : Number(String(n).replace(/,/g, ''))
  return isNaN(num) ? '0.00' : num.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const toNum = (n) => {
  if (n == null || n === '') return 0
  const num = typeof n === 'number' ? n : Number(String(n).replace(/,/g, ''))
  return isNaN(num) ? 0 : num
}

const sumInvoicesByGL = (glNo) => {
  return invoices.value
    .filter(inv => inv.glNo === glNo)
    .reduce((sum, inv) => sum + toNum(inv.amaun), 0)
}

const getGlBalance = (glNo) => {
  const gl = guaranteeLetters.value.find(g => g.glNo === glNo)
  if (!gl) return 0
  const glTotal = toNum(gl.amaun)
  const invTotal = sumInvoicesByGL(glNo)
  return Math.max(glTotal - invTotal, 0)
}

const formatSemester = (sem) => {
  const map = { '1': 'Semester 1', '2': 'Semester 2', '3': 'Semester 3' }
  return map[sem] || sem
}

// Derived flags & validations
const isIPT = computed(() => {
  const p = (formData.value.aidProduct || '').toUpperCase()
  return p.includes('IPT')
})
const amountExceedsGL = computed(() => {
  const amt = Number(newInvoice.value.amaun || 0)
  const bal = getGlBalance(selectedGlNo.value)
  return Number.isFinite(amt) && Number.isFinite(bal) && amt > bal
})

const getStatusVariant = (status) => {
  const variants = {
    'Fakir': 'danger',
    'Miskin': 'warning', 
    'Non-Fakir Miskin': 'success',
    'Produktif': 'success',
    'Tidak Produktif': 'danger',
    'Produktif Sementara': 'warning',
    'Produktif Tegar': 'info'
  }
  return variants[status] || 'secondary'
}

const hydrateFromSelectedBantuan = (selected) => {
  if (selected.pemohon) formData.value.namaPemohon = selected.pemohon
  if (selected.noKPPemohon) formData.value.noPengenalan = selected.noKPPemohon
  if (selected.maklumatBantuan) formData.value.aidProduct = selected.maklumatBantuan
  if (selected.namaPenerimaManfaat) formData.value.namaPenerimaManfaat = selected.namaPenerimaManfaat
  if (selected.namaPenerima) formData.value.namaPenerima = selected.namaPenerima
}

const populateFormDataFromSession = () => {
  // Default mock data if no preset found
  formData.value.namaPemohon = 'ALI BIN MOHAMED'
  formData.value.noPengenalan = '940511146045'
  formData.value.emailPemohon = 'ali.mohamed@email.com'
  formData.value.noTelefonPemohon = '0123456789'
  formData.value.kategoriAsnaf = 'Fakir'
  formData.value.statusHousehold = 'Fakir'
  formData.value.statusIndividu = 'Fakir'
  formData.value.statusMultidimensi = 'Produktif'
}

const applyGlFilter = (glNo) => {
  selectedGlNo.value = glNo
}

const openInvoiceModal = (glNo) => {
  selectedGlNo.value = glNo
  showInvoiceModal.value = true
  newInvoice.value.glNo = glNo
}

const createInvoice = () => {
  const invoice = {
    invoiceNo: newInvoice.value.invoiceNo,
    title: newInvoice.value.tajuk,
    tahun: newInvoice.value.tahun,
    semester: newInvoice.value.semester,
    diNo: 'DI-001',
    glNo: selectedGlNo.value,
    paNo: '',
    statusKelulusan: '',
    amaun: newInvoice.value.amaun
  }

  invoices.value.push(invoice)

  // Add uploaded files to documents
  if (newInvoice.value.lampiran && newInvoice.value.lampiran.length > 0) {
    newInvoice.value.lampiran.forEach((file, index) => {
      documents.value.push({
        name: `Lampiran Invoice ${documents.value.length + 1}`,
        nameFile: file.name,
        uploadDate: new Date().toLocaleDateString('ms-MY'),
        tindakan: documents.value.length + 1
      })
    })
  }
  
  showInvoiceModal.value = false
  newInvoice.value = {
    invoiceNo: 'INV-2025-00124',
    tahun: '2025',
    semester: '',
    tajuk: '',
    cgpa: '',
    penerimaBayaran: 'IPTA',
    mop: 'EFT',
    namaPenerima: 'IPTA',
    bank: 'CIMB',
    noAkaun: '8001234567',
    amaun: '',
    lampiran: [],
    catatan: ''
  }
}

const viewDocument = (doc) => {
  console.log('View document:', doc)
}

const handleSaveDraft = () => {
  $swal.fire({
    title: 'Draf Disimpan',
    text: 'Tuntutan telah disimpan sebagai draf.',
    icon: 'success',
    confirmButtonText: 'OK'
  })
}

function handleSubmit() {
  $swal.fire({
    icon: 'success',
    title: 'Permohonan tuntutan berjaya dihantar',
    showConfirmButton: true,
  }).then(() => {
    navigateTo('/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/vendor')
  })
}
</script>



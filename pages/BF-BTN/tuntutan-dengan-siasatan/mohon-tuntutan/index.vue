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
                <label class="block text-sm font-medium text-gray-700">No. Kad Pengenalan / No. Vendor</label>
                <p class="mt-1 text-gray-600">{{ formData.noPengenalan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">No. Telefon</label>
                <p class="mt-1 text-gray-600">{{ formData.noTelefonPemohon }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Kategori Asnaf</label>
                <p class="mt-1 text-gray-600">{{ formData.kategoriAsnaf }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Status Household</label>
                <rs-badge :variant="getStatusVariant(formData.statusHousehold)">
                  {{ formData.statusHousehold }}
                </rs-badge>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Status Individu</label>
                <rs-badge :variant="getStatusVariant(formData.statusIndividu)">
                  {{ formData.statusIndividu }}
                </rs-badge>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Status Multidimensi</label>
                <rs-badge :variant="getStatusVariant(formData.statusMultidimensi)">
                  {{ formData.statusMultidimensi }}
                </rs-badge>
              </div>
            </div>
          </RsTabItem>

          
          <RsTabItem title="Maklumat Bantuan">
            <h3 class="text-lg font-medium mb-4">Maklumat Bantuan</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                v-model="formData.aidProduct"
                type="text"
                label="Jenis Bantuan"
                readonly
                :classes="{ input: 'bg-gray-100 cursor-not-allowed' }"
              />
            </div>

            <div class="bg-gray-50 p-4 rounded-lg mb-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit v-model="formData.tarikhMula" type="date" label="Tarikh Mula" readonly />
                <FormKit v-model="formData.tarikhAkhir" type="date" label="Tarikh Akhir" readonly />
              </div>
            </div>

            <h3 class="text-lg font-medium mt-6 mb-4">Senarai Distribution Item (DI)</h3>
            <RsTable
              :data="distributionItems"
              :field="fieldsDI"
              :columns="columnsDI"
              advanced
              :showSearch="false"
              :showFilter="false"
              :options="{
                variant: 'default',
                striped: true,
                bordered: false,
                borderless: false,
                hover: true
              }"
              :optionsAdvanced="{
                sortable: true,
                filterable: false,
                responsive: true,
                outsideBorder: true
              }"
              :pageSize="10"
              :showNoColumn="true"
              :sort="{ column: 'tahun', direction: 'desc' }"
            >
              <template #amaun="{ text }">RM {{ toMYR(text) }}</template>
              <template #status="{ text }">
                <rs-badge :variant="text === 'Aktif' ? 'success' : 'danger'">{{ text }}</rs-badge>
              </template>
            </RsTable>
          </RsTabItem>

          
          <RsTabItem title="Maklumat Tuntutan">
            <h3 class="text-lg font-medium mb-4">Maklumat Tuntutan</h3>

            <h3 class="text-lg font-medium mt-6 mb-4">Senarai Guarantee Letter (GL)</h3>
            <RsTable
              :data="glRows"
              :field="fieldsGL"
              :columns="columnsGL"
              :showSearch="false"
              :showFilter="false"
              advanced
              :options="{
                variant: 'default',
                striped: true,
                bordered: false,
                borderless: false,
                hover: true
              }"
              :optionsAdvanced="{
                sortable: true,
                filterable: false,
                responsive: true,
                outsideBorder: true
              }"
              :pageSize="10"
              :showNoColumn="true"
              :sort="{ column: 'createdDate', direction: 'desc' }"
            >
              <template #amaun="{ text }">RM {{ toMYR(text) }}</template>
              <template #invoiceTotal="{ text }">RM {{ toMYR(text) }}</template>
              <template #currentBalance="{ text }">RM {{ toMYR(text) }}</template>
              <template #status="{ text }">
                <rs-badge :variant="text === 'AKTIF' ? 'success' : 'secondary'">{{ text }}</rs-badge>
              </template>

              <!-- Row click to filter (integration) -->
              <template #row="{ row }">
                <tr @click="applyGlFilter(row.glNo)" class="cursor-pointer hover:bg-gray-50">
                  <td v-for="col in columnsGL" :key="col.key">
                    <slot :name="col.key" :text="row[col.key]" :value="row" v-if="$slots[col.key]" />
                    <template v-else>{{ row[col.key] }}</template>
                  </td>
                </tr>
              </template>

              <!-- Tindakan: create invoice + view related items -->
              <template #tindakan="{ value }">
                <div class="flex items-center gap-2">
                  <rs-button
                    variant="ghost"
                    size="sm"
                    class="group relative p-1 bg-transparent border-0 shadow-none text-blue-600 hover:text-blue-800"
                    @click.stop="openInvoiceModal(value.glNo)"
                    title="Cipta Invoice"
                  >
                    <Icon name="material-symbols:add" size="22" />
                  </rs-button>

                </div>
              </template>
            </RsTable>
            
            <h3 class="text-lg font-medium mt-6 mb-4">Senarai Invoice</h3>

            <RsTable
              :data="filteredInvoices"
              :key="filteredInvoices.length"
              :field="fieldsInv"
              :columns="columnsInv"
              advanced
              :showSearch="false"
              :showFilter="false"
              :options="{
                variant: 'default',
                striped: true,
                bordered: false,
                borderless: false,
                hover: true
              }"
              :optionsAdvanced="{
                sortable: true,
                filterable: false,
                responsive: true,
                outsideBorder: true
              }"
              :pageSize="10"
              :showNoColumn="true"
              :sort="{ column: 'tahun', direction: 'desc' }"
            >
              <!-- strong title -->
              <template #title="{ text }">
                <span class="font-medium">{{ text || '—' }}</span>
              </template>

              <!-- Tahun -->
              <template #tahun="{ text }">
                {{ text || '—' }}
              </template>

              <!-- Semester => 'Semester 1/2' -->
              <template #semester="{ text }">
                {{ formatSemester(text) }}
              </template>

              <!-- IDs -->
              <template #invoiceNo="{ text }"><span class="font-mono">{{ text || '—' }}</span></template>
              <template #diNo="{ text }"><span class="font-mono">{{ text || '—' }}</span></template>
              <template #glNo="{ text }"><span class="font-mono">{{ text || '—' }}</span></template>
              <template #paNo="{ text }"><span class="font-mono">{{ text || '—' }}</span></template>

              <!-- Payment details -->
              <!-- <template #mop="{ text }">{{ uc(text) }}</template>
              <template #namaPenerima="{ text }">{{ text || '—' }}</template>
              <template #bank="{ text }">{{ uc(text) }}</template>
              <template #noAkaun="{ text }">{{ maskAcc(text) }}</template> -->

              <!-- In Senarai Invoice table -->
              <template #amaun="{ text }">RM {{ toMYR(text) }}</template>


              <!-- Badge for status -->
              <template #statusKelulusan="{ text }">
                <rs-badge
                  :variant="text === 'APPROVED'
                    ? 'success'
                    : text === 'REJECTED'
                    ? 'danger'
                    : 'warning'">
                  {{ text || 'Menunggu Kelulusan' }}
                </rs-badge>
              </template>

            </RsTable>


          </RsTabItem>

          
          <RsTabItem title="Payment Advice">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-lg font-medium">Payment Advice</h3>
            </div>

            <RsTable
              :data="[]"
              :field="fieldsPA"
              :columns="columnsPA"
              advanced
              :showSearch="false"
              :showFilter="false"
              :options="{
                variant: 'default',
                striped: true,
                bordered: false,
                borderless: false,
                hover: true
              }"
              :optionsAdvanced="{
                sortable: true,
                filterable: false,
                responsive: true,
                outsideBorder: true
              }"
              :pageSize="10"
              :showNoColumn="true"
              :sort="{ column: 'createdDate', direction: 'desc' }"
            >
              <template #amaun="{ text }">RM {{ toMYR(text) }}</template>
              <template #status="{ text }">
                <rs-badge :variant="text === 'SAH' ? 'success' : text === 'DITOLAK' ? 'danger' : 'warning'">
                  {{ text || '—' }}
                </rs-badge>
              </template>
            </RsTable>
          </RsTabItem>

          
          <RsTabItem title="Dokumen Sokongan">
            <h3 class="text-lg font-medium mb-4">Dokumen Sokongan</h3>

            <RsTable
              :data="documents"
              :field="fieldsDoc"
              :columns="columnsDoc"
              advanced
              :showSearch="true"
              :showFilter="false"
              :options="{
                variant: 'default',
                striped: true,
                bordered: false,
                borderless: false,
                hover: true
              }"
              :optionsAdvanced="{
                sortable: true,
                filterable: true,
                responsive: true,
                outsideBorder: true
              }"
              :pageSize="10"
              :showNoColumn="true"
              :sort="{ column: 'uploadDate', direction: 'desc' }"
              :autoFields="false"
            >
              <template #tindakan="{ value }">
                <div class="text-center">
                  <rs-button
                    variant="ghost"
                    size="sm"
                    class="!px-2 !py-1 text-blue-600 hover:text-blue-800"
                    @click="viewDocument(value)"
                    title="Lihat Dokumen"
                  >
                    <Icon name="material-symbols:visibility" class="w-5 h-5" />
                  </rs-button>
                </div>
              </template>
            </RsTable>
          </RsTabItem>
        </RsTab>

        <!-- Actions -->
        <div class="flex justify-end gap-4 mt-6">
          <rs-button type="button" variant="secondary" @click="handleSaveDraft">
            <Icon name="material-symbols:save" class="w-4 h-4 mr-1" /> Simpan
          </rs-button>
          <rs-button type="button" variant="primary" @click="handleSubmit">
            <Icon name="material-symbols:send" class="w-4 h-4 mr-1" /> Hantar Tuntutan
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Modal: Cipta Invoice -->
    <RsModal v-model="showInvoiceModal" title="Cipta Invoice" size="lr">
      <template #body>
        <div class="grid grid-cols-1 gap-6">
          <FormKit v-model="newInvoice.invoiceNo" type="text" label="No. Invois" disabled />

          <FormKit v-model="newInvoice.tahun" type="text" label="Tahun" readonly />

          <FormKit
            v-model="newInvoice.semester"
            type="select"
            label="Semester"
            :options="semesterOptions"
            validation="required"
            :validation-messages="{ required: 'Sila pilih Semester' }"
          />

          <FormKit v-model="newInvoice.tajuk" type="text" label="Tajuk" required />

          <FormKit
            v-model="newInvoice.cgpa"
            type="number"
            label="CGPA"
            validation="required|number|min:0|max:4"
            :validation-messages="{
              required: 'Sila masukkan CGPA',
              number: 'Sila masukkan nilai yang sah',
              min: 'CGPA tidak boleh kurang dari 0',
              max: 'CGPA tidak boleh lebih dari 4'
            }"
            step="0.01" min="0" max="4"
          />

          <FormKit v-model="newInvoice.penerimaBayaran" type="text" label="Penerima Bayaran" readonly />
          <FormKit v-model="newInvoice.mop" type="text" label="MOP" readonly />
          <FormKit v-model="newInvoice.namaPenerima" type="text" label="Nama Penerima" readonly />
          <FormKit v-model="newInvoice.bank" type="text" label="Bank" readonly />
          <FormKit v-model="newInvoice.noAkaun" type="text" label="No. Akaun" readonly />

          <FormKit
            v-model="newInvoice.amaun"
            type="number"
            label="Amaun (RM)"
            validation="required|number|min:0"
            :validation-messages="{
              required: 'Sila masukkan amaun',
              number: 'Sila masukkan nilai yang sah',
              min: 'Amaun tidak boleh negatif'
            }"
            step="0.01" min="0"
          />

          <FormKit
            v-model="newInvoice.lampiran"
            type="file"
            label="Muat Naik Lampiran"
            accept=".pdf,.doc,.docx"
            multiple
            :classes="{
              input: 'file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
            }"
            help="Lampiran apa yang perlu dimasukkan (boleh muat naik berbilang fail)"
          />
          
          <!-- Display selected files -->
          <div v-if="newInvoice.lampiran && newInvoice.lampiran.length > 0" class="mt-2">
            <p class="text-sm text-gray-600 mb-2">Fail yang dipilih ({{ newInvoice.lampiran.length }}):</p>
            <div class="space-y-1">
              <div 
                v-for="(file, index) in newInvoice.lampiran" 
                :key="index"
                class="flex items-center text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded"
              >
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                {{ file.name }}
              </div>
            </div>
          </div>

          <FormKit v-model="newInvoice.catatan" type="textarea" label="Catatan" rows="3" placeholder="Masukkan catatan tambahan jika perlu..." />
        </div>
      </template>
      <template #footer>
        <rs-button @click="showInvoiceModal = false">Batal</rs-button>
        <rs-button :disabled="getGlBalance(selectedGlNo) <= 0 || !newInvoice.amaun || Number(newInvoice.amaun) <= 0" @click="createInvoice">
          Simpan
        </rs-button>
      </template>
    </RsModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNuxtApp, navigateTo, useRoute } from '#app'
import RsTable from '~/components/RsTable.vue'

definePageMeta({ title: 'Mohon Tuntutan (TDS-01)' })
const { $swal } = useNuxtApp()

const breadcrumb = ref([
  { name: 'Pengurusan Bantuan', type: 'link', path: '/BF-BTN/tuntutan-dengan-siasatan' },
  { name: 'Tuntutan', type: 'link', path: '/BF-BTN/tuntutan-dengan-siasatan' },
  { name: 'Mohon Tuntutan', type: 'current', path: '/BF-BTN/tuntutan-dengan-siasatan/mohon-tuntutan' }
])

const formData = ref({
  namaPemohon: '',
  noPengenalan: '',
  emailPemohon: '',
  noTelefonPemohon: '',
  kategoriAsnaf: 'Fakir',
  statusHousehold: 'Fakir',
  statusIndividu: 'Fakir',
  statusMultidimensi: 'Produktif',
  noBtn: '',
  noGL: '',
  noInvois: 'INV-2025-00124',
  kodBantuan: '',

  // Default yang diminta:
  aid: 'B307 - (HQ) BANTUAN DERMASISWA IPT DALAM NEGARA (FAKIR) - IPTA/IPTS',
  aidProduct: 'Dermasiswa IPT Dalam Negara (Fakir) ',

  // Masih wujud di data (diguna oleh jadual DI), tapi tiada lagi field input di UI:
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

// Invoice table schema — selepas buang 4 kolum
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

// Derived GL rows
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

const invoices = ref([])

// Helpers
const toMYR = (n) => {
  if (n == null || n === '') return '0.00'
  const num = typeof n === 'number' ? n : Number(String(n).replace(/,/g, ''))
  return isNaN(num) ? '0.00' : num.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const toNum = (v) => {
  if (v == null || v === '') return 0
  const n = typeof v === 'number' ? v : Number(String(v).replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}

const sumInvoicesByGL = (glNo) => invoices.value.filter((i) => i.glNo === glNo).reduce((s, r) => s + toNum(r.amaun), 0)

const getGlBalance = (glNo) => {
  const gl = guaranteeLetters.value.find((g) => g.glNo === glNo)
  if (!gl) return 0
  const glTotal = toNum(gl.amaun)
  const invTotal = sumInvoicesByGL(glNo)
  return Math.max(glTotal - invTotal, 0)
}

// Modal state
const showInvoiceModal = ref(false)
const selectedGlNo = ref(null)

const semesterOptions = [
  { label: 'Semester 1', value: '1' },
  { label: 'Semester 2', value: '2' }
]

const newInvoice = ref({
  invoiceNo: 'AUTO',
  noInvoisPelanggan: '',
  tajuk: '',
  semester: '1',
  cgpa: null,
  tahun: '',
  catatan: '',
  penerimaBayaran: '',
  mop: '',
  namaPenerima: '',
  bank: '',
  noAkaun: '',
  amaun: null,
  lampiran: []
})
const formatSemester = (v) => (v ? `Semester ${v}` : '—')
const maskAcc = (v) => {
  const s = (v ?? '').toString().replace(/\s+/g, '')
  if (!s) return '—'
  const last = s.slice(-4)
  return s.length > 4 ? '••••••' + last : s
}
const uc = (v) => (v ? String(v).toUpperCase() : '—')




function openInvoiceModal(glNo) {
  selectedGlNo.value = glNo
  const gl = guaranteeLetters.value.find((g) => g.glNo === glNo)

  const fallbackPenerima = formData.value.penerimaBayaran || 'VENDOR / INSTITUSI'
  const defaultMop = formData.value.mop || 'EFT'
  const defaultBank = formData.value.bank || 'CIMB'
  const defaultAcc = formData.value.noAkaun || '8001234567'

  const base = {
    invoiceNo: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`,
    tahun: String(new Date().getFullYear()),
    semester: newInvoice.value.semester || '', // keep user choice if they reopen
    tajuk: '',
    cgpa: newInvoice.value.cgpa ?? null,
    penerimaBayaran: fallbackPenerima,
    mop: defaultMop,
    namaPenerima: formData.value.namaPenerima || fallbackPenerima,
    bank: defaultBank,
    noAkaun: defaultAcc,
    amaun: null,
    lampiran: null,
    catatan: newInvoice.value.catatan || ''
  }

  if (gl) {
 const remaining = Math.max(getGlBalance(gl.glNo), 0)
newInvoice.value = {
  ...base,
  tajuk: `Invoice untuk ${gl.glNo}`,
  tahun: gl.tahun || base.tahun,
  penerimaBayaran: gl.penerimaBayaran || base.penerimaBayaran,
  namaPenerima: gl.penerimaBayaran || base.namaPenerima,
  amaun: Number.isFinite(remaining) ? remaining : 0   // ⬅ ensure number
}
  } else {
    newInvoice.value = { ...base }
  }

  showInvoiceModal.value = true
}


function createInvoice() {
  const gl = guaranteeLetters.value.find((g) => g.glNo === selectedGlNo.value) || {}

  if (!gl.glNo) {
    $swal.fire({ icon: 'error', title: 'Ralat', text: 'GL tidak sah/tiada. Sila cuba lagi.' })
    return
  }

  const balanceBefore = getGlBalance(gl.glNo)
  const amount = Number(newInvoice.value.amaun ?? 0)

  if (balanceBefore <= 0) {
    $swal.fire({ icon: 'error', title: 'Baki Habis', text: 'Tidak boleh cipta invois kerana Baki (RM) = 0.' })
    return
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    $swal.fire({ icon: 'error', title: 'Amaun Tidak Sah', text: 'Amaun invois mesti lebih besar daripada 0.' })
    return
  }
  if (amount > balanceBefore) {
    $swal.fire({
      icon: 'error',
      title: 'Lebih Had Baki',
      html: `Amaun invois (RM ${toMYR(amount)}) melebihi Baki (RM ${toMYR(balanceBefore)}).`
    })
    return
  }
  if (!newInvoice.value.semester) {
    $swal.fire({ icon: 'error', title: 'Semester Diperlukan', text: 'Sila pilih Semester.' })
    return
  }

  // 1) Generate PA No once
  const paNumber = `PA-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`

  // 2) Create the invoice row using EXACT modal values/derived GL values
  const invRow = {
    invoiceNo: newInvoice.value.invoiceNo,                            // modal
    title: newInvoice.value.tajuk,                                    // modal
    tahun: newInvoice.value.tahun || String(new Date().getFullYear()),// modal
    semester: newInvoice.value.semester,                              // modal
    diNo: gl.diNo || '',                                              // from GL
    glNo: gl.glNo || '',                                              // from GL
    paNo: paNumber,                                                   // generated
    mop: newInvoice.value.mop || formData.value.mop || 'EFT',         // modal or defaults
    namaPenerima: newInvoice.value.namaPenerima || formData.value.namaPenerima || (gl.penerimaBayaran || 'VENDOR / INSTITUSI'),
    bank: newInvoice.value.bank || formData.value.bank || 'CIMB',     // modal or defaults
    noAkaun: newInvoice.value.noAkaun || formData.value.noAkaun || '8001234567',
    statusKelulusan: 'Menunggu Kelulusan',                            // initial status
    amaun: amount                       // modal
  }
  invoices.value = [invRow, ...invoices.value]

  // 3) Create the PA row tied to the same modal+GL values
  const paRow = {
    paNo: paNumber,
    diNo: gl.diNo || '',
    createdDate: new Date().toLocaleDateString('ms-MY'),
    penerimaBayaran: newInvoice.value.penerimaBayaran || gl.penerimaBayaran || formData.value.penerimaBayaran || '',
    status: 'DRAF',
    invoiceNo: newInvoice.value.invoiceNo,
    amaun: Number(newInvoice.value.amaun ?? 0)
  }
  paymentAdvices.value = [...paymentAdvices.value, paRow]

  // 3.5) Add uploaded lampiran files to documents array
  if (newInvoice.value.lampiran && newInvoice.value.lampiran.length > 0) {
    const newDocuments = newInvoice.value.lampiran.map((file, index) => ({
      name: `Lampiran Invoice ${documents.value.length + index + 1}`,
      nameFile: file.name || `Lampiran_Invoice_${newInvoice.value.invoiceNo}_${index + 1}.pdf`,
      uploadDate: new Date().toLocaleDateString('ms-MY'),
      tindakan: documents.value.length + index + 1
    }))
    documents.value = [...documents.value, ...newDocuments]
  }

  // 4) Mark GL SELESAI when fully invoiced
  const totalInv = sumInvoicesByGL(gl.glNo)
  const glTotal = toNum(gl.amaun)
  if (glTotal > 0 && totalInv >= glTotal) {
    const idx = guaranteeLetters.value.findIndex((g) => g.glNo === gl.glNo)
    if (idx > -1) guaranteeLetters.value[idx].status = 'SELESAI'
  }

  // 5) Focus invoice/PA lists on this GL (integration)
  activeGlFilter.value = gl.glNo || null

  // 6) Clear the lampiran files and close modal + toast
  newInvoice.value.lampiran = []
  showInvoiceModal.value = false
  $swal.fire({ icon: 'success', title: 'Berjaya!', text: 'Invois telah dicipta' })
}



function viewDocument(id) {
  console.log('View doc id:', id)
  $swal.fire({ icon: 'info', title: 'Dokumen', text: `Buka dokumen ID: ${id}` })
}

const handlenoBtnChange = async (value) => {
  formData.value.aid = ''
  formData.value.aidProduct = ''
  formData.value.productPackage = ''
  formData.value.entitlementProduct = ''
  formData.value.amaunTuntutan = ''
  formData.value.dokumenSokongan = []
  formData.value.penerimaBayaran = ''
  formData.value.bulan = ''
  formData.value.tahun = ''
  formData.value.mop = ''
  formData.value.namaPenerima = ''
  formData.value.bank = ''
  formData.value.noAkaun = ''

  const noBtnDataMapping = {
    'NAS-2025-00012': {
      aid: 'AID-0012',
      aidProduct: 'Dialisis',
      productPackage: 'PKG-01',
      entitlementProduct: 'BANTUAN PERUBATAN DIALISIS',
      amaunTuntutan: '1500.00',
      penerimaBayaran: 'VENDOR B',
      bulan: 'MAC',
      tahun: '2025',
      mop: 'EFT',
      namaPenerima: 'VENDOR B',
      bank: 'CIMB',
      noAkaun: '8001234567',
      dokumenDefault: 'contoh.pdf'
    }
  }

  if (value && noBtnDataMapping[value]) {
    const noBtnData = noBtnDataMapping[value]
    formData.value = { ...formData.value, ...noBtnData }
    formData.value.tarikhMula = new Date().toISOString().split('T')[0]
    formData.value.tarikhAkhir = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]

    distributionItems.value = [
      {
        diNo: `DI-${value.slice(-3)}`,
        entitlementProduct: noBtnData.entitlementProduct,
        penerima: 'VENDOR',
        bulan: noBtnData.bulan,
        tahun: noBtnData.tahun,
        status: 'Aktif',
        amaun: noBtnData.amaunTuntutan
      }
    ]

    guaranteeLetters.value = [
      {
        glNo: `GL-${value.slice(-3)}`,
        diNo: distributionItems.value[0].diNo,
        createdDate: new Date().toLocaleDateString('ms-MY'),
        penerimaBayaran: noBtnData.penerimaBayaran,
        status: 'AKTIF',
        bulan: noBtnData.bulan,
        tahun: noBtnData.tahun,
        amaun: noBtnData.amaunTuntutan,
        balance: '0.00'
      }
    ]

    if (noBtnData.dokumenDefault) {
      const defaultFile = new File([''], noBtnData.dokumenDefault, { type: 'application/pdf' })
      formData.value.dokumenSokongan = [defaultFile]
    }
  }

  formData.value.noBtn = value || ''
}

const validateForm = async () => {
  if (!formData.value.noBtn) {
    alert('Sila pilih No. Bantuan')
    return false
  }
  return true
}

const handleSubmit = async () => {
  try {
    const isValid = await validateForm()
    if (!isValid) return

    const formDataToSubmit = { ...formData.value, status: 'Dalam Semakan', tarikhTuntutan: new Date().toISOString() }
    console.log('Submitting form:', formDataToSubmit)

    await $swal.fire({ icon: 'success', title: 'Berjaya!', text: 'Permohonan tuntutan anda telah berjaya dihantar', confirmButtonText: 'OK' })
    navigateTo('/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan')
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}

const handleSaveDraft = async () => {
  try {
    const draftData = { ...formData.value, status: 'Draf', tarikhTuntutan: new Date().toISOString() }
    console.log('Saving draft:', draftData)

    await $swal.fire({ icon: 'success', title: 'Berjaya!', text: 'Permohonan tuntutan anda telah berjaya disimpan sebagai "Draf"', confirmButtonText: 'OK' })
    navigateTo('/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan')
  } catch (error) {
    console.error('Error saving draft:', error)
  }
}

function populateFormDataFromSession() {
  formData.value.namaPemohon = 'John Doe'
  formData.value.noPengenalan = '123456-78-9012'
  formData.value.emailPemohon = 'john.doe@example.com'
  formData.value.noTelefonPemohon = '012-3456789'
}
populateFormDataFromSession()

// PA table schema
const fieldsPA = ['paNo', 'diNo', 'createdDate', 'penerimaBayaran', 'status', 'invoiceNo', 'amaun']
const columnsPA = [
  { key: 'paNo', label: 'PA No' },
  { key: 'diNo', label: 'DI No' },
  { key: 'createdDate', label: 'Created Date' },
  { key: 'penerimaBayaran', label: 'Penerima Bayaran' },
  { key: 'status', label: 'Status' },
  { key: 'invoiceNo', label: 'Invoice No' },
  { key: 'amaun', label: 'Amaun (RM)' }
]

const paymentAdvices = ref([])

// PA table data with trailing TOTAL row
const paTableData = computed(() => {
  const rows = filteredPAs.value
  if (!rows.length) return []
  const total = rows.reduce((sum, r) => sum + toNum(r.amaun), 0)
  return [...rows, { paNo: 'TOTAL', diNo: '', createdDate: '', penerimaBayaran: '', status: '', invoiceNo: '', amaun: total }]
})

function hydrateFromSelectedBantuan(row) {
  if (!row) return

  formData.value.namaPemohon = row.pemohon || row.namaPemohon || formData.value.namaPemohon
  formData.value.noPengenalan = row.noKPPemohon || formData.value.noPengenalan
  formData.value.noTelefonPemohon = formData.value.noTelefonPemohon || ''
  formData.value.kategoriAsnaf = formData.value.kategoriAsnaf || 'Fakir'
  // Kekalkan default jika tiada nilai dari sumber
  formData.value.aid ||= 'B307 - (HQ) BANTUAN DERMASISWA IPT DALAM NEGARA (FAKIR) - IPTA/IPTS'
  formData.value.aidProduct ||= 'Dermasiswa IPT Dalam Negara (Fakir) '

  // (pilihan) Jika mahu, anda boleh set entitlementProduct default untuk table DI:
  formData.value.entitlementProduct ||= 'DERMASISWA IPT DALAM NEGARA (FAKIR)'

  const nb = row.noBantuan || ''
  if (nb && !noBtnOptions.value.some((o) => o.value === nb)) {
    noBtnOptions.value.unshift({ label: nb, value: nb })
  }
  formData.value.noBtn = nb

  formData.value.kodBantuan = row.maklumatBantuan || formData.value.kodBantuan

  const penerima = row.namaPenerima || row.namaPenerimaManfaat || ''
  formData.value.penerimaBayaran = formData.value.penerimaBayaran || penerima || 'VENDOR / INSTITUSI'
  formData.value.namaPenerima = formData.value.namaPenerima || penerima

  formData.value.aid = formData.value.aid || 'AID-AUTO'
  formData.value.aidProduct = formData.value.aidProduct || 'Dermasiswa'
  formData.value.productPackage = formData.value.productPackage || 'PKG-01'
  formData.value.entitlementProduct = formData.value.entitlementProduct || 'DERMASISWA'

  if (!formData.value.tarikhMula) formData.value.tarikhMula = new Date().toISOString().slice(0, 10)
  if (!formData.value.tarikhAkhir) formData.value.tarikhAkhir = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10)

  const diNo = `DI-${(nb || '').slice(-3) || '001'}`
  if (!distributionItems.value.length) {
    distributionItems.value = [
      {
        diNo,
        entitlementProduct: formData.value.entitlementProduct,
        penerima: row.namaPenerima ? 'PENERIMA' : 'VENDOR',
        bulan: new Date().toLocaleString('ms-MY', { month: 'long' }).toUpperCase(),
        tahun: String(new Date().getFullYear()),
        status: 'Aktif',
        amaun: '1500.00'
      }
    ]
  }

  if (!guaranteeLetters.value.length) {
    guaranteeLetters.value = [
      {
        glNo: `GL-${(nb || '').slice(-3) || '001'}`,
        diNo,
        createdDate: new Date().toLocaleDateString('ms-MY'),
        penerimaBayaran: formData.value.penerimaBayaran,
        status: 'AKTIF',
        bulan: new Date().toLocaleString('ms-MY', { month: 'long' }).toUpperCase(),
        tahun: String(new Date().getFullYear()),
        amaun: '1500.00'
      }
    ]
  }
}

const route = useRoute()

onMounted(() => {
  let selected = null
  try {
    const raw = sessionStorage.getItem('NAS_SELECTED_BANTUAN')
    if (raw) selected = JSON.parse(raw)
  } catch (e) {
    console.warn('Cannot parse NAS_SELECTED_BANTUAN', e)
  }

  if (!selected && (route.query?.noBantuan || route.query?.namaPemohon || route.query?.pemohon)) {
    selected = {
      noBantuan: route.query.noBantuan,
      pemohon: route.query.pemohon,
      namaPemohon: route.query.namaPemohon,
      noKPPemohon: route.query.noKPPemohon,
      maklumatBantuan: route.query.maklumatBantuan,
      namaPenerimaManfaat: route.query.namaPenerimaManfaat,
      namaPenerima: route.query.namaPenerima,
      status: route.query.status
    }
  }

  if (selected) {
    hydrateFromSelectedBantuan(selected)
  }

  if (!formData.value.namaPemohon) {
    populateFormDataFromSession()
  }
})

const getStatusVariant = (status) => {
  const variants = {
    'Fakir': 'danger',
    'Miskin': 'warning', 
    'Non-Fakir Miskin': 'secondary',
    'Produktif': 'success',
    'Tidak Produktif': 'danger',
    'Produktif Sementara': 'warning',
    'Produktif Tegar': 'primary'
  }
  return variants[status] || 'default'
}

// Shared GL filter
const activeGlFilter = ref(null)
const applyGlFilter = (glNo) => {
  activeGlFilter.value = glNo
}
const clearGlFilter = () => {
  activeGlFilter.value = null
}

// Filtered tables
const filteredInvoices = computed(() => (activeGlFilter.value ? invoices.value.filter((r) => r.glNo === activeGlFilter.value) : invoices.value))

const filteredPAs = computed(() =>
  activeGlFilter.value
    ? paymentAdvices.value.filter((r) => {
        const inv = invoices.value.find((i) => i.invoiceNo === r.invoiceNo)
        return inv?.glNo === activeGlFilter.value
      })
    : paymentAdvices.value
)
</script>

<style lang="scss" scoped>
/* Add component-scoped styles here if needed */
</style>

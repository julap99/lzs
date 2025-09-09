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
            </div>
          </RsTabItem>

 
          <RsTabItem title="Maklumat Bantuan">
            <h3 class="text-lg font-medium mb-4">Maklumat Bantuan</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                v-model="formData.noBtn"
                type="text"
                label="No. Bantuan"
                readonly
                :classes="{
                  input: 'bg-gray-100 cursor-not-allowed',
                }"
              />
            </div>


            <div class="bg-gray-50 p-4 rounded-lg mb-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit v-model="formData.aid" type="text" label="Aid" disabled />
                <FormKit v-model="formData.aidProduct" type="text" label="Aid Product" disabled />
                <FormKit v-model="formData.productPackage" type="text" label="Product Package" disabled />
                <FormKit v-model="formData.entitlementProduct" type="text" label="Entitlement Product" disabled />
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
              <template #amaun="{ text }">
                RM {{ toMYR(text) }}
              </template>
              <template #status="{ text }">
                <rs-badge :variant="text === 'Aktif' ? 'success' : 'danger'">
                  {{ text }}
                </rs-badge>
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
              <template #amaun="{ text }">
                RM {{ toMYR(text) }}
              </template>
              <template #invoiceTotal="{ text }">
                RM {{ toMYR(text) }}
              </template>
              <template #currentBalance="{ text }">
                RM {{ toMYR(text) }}
              </template>
              <template #status="{ text }">
                <rs-badge :variant="text === 'AKTIF' ? 'success' : 'secondary'">
                  {{ text }}
                </rs-badge>
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

                  <rs-button
                    variant="ghost"
                    size="sm"
                    class="p-1 text-blue-600 hover:text-blue-800"
                    @click.stop="applyGlFilter(value.glNo)"
                    title="Lihat Invois & PA"
                  >
                    <Icon name="material-symbols:visibility" size="22" />
                  </rs-button>
                </div>
              </template>
            </RsTable>


            <div class="flex items-center justify-between mb-2">
              <h3 class="text-lg font-medium mt-6">Senarai Invoice</h3>
              <div v-if="activeGlFilter" class="flex items-center gap-2">
                <span class="text-sm">Ditapis GL:</span>
                <rs-badge variant="info">{{ activeGlFilter }}</rs-badge>
                <rs-button variant="ghost" size="xs" @click="clearGlFilter">
                  Buang Tapis
                </rs-button>
              </div>
            </div>
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
              :sort="{ column: 'expectedPaymentDate', direction: 'desc' }"
            >
              <template #amaun="{ text }">
                RM {{ toMYR(text) }}
              </template>
              <template #title="{ text }">
                <span class="font-medium">{{ text }}</span>
              </template>
              <template #approverStatus="{ text }">
                <rs-badge
                  :variant="text === 'APPROVED'
                    ? 'success'
                    : text === 'REJECTED'
                    ? 'danger'
                    : 'warning'"
                >
                  {{ text }}
                </rs-badge>
              </template>
            </RsTable>
          </RsTabItem>

          <RsTabItem title="Maklumat Bayaran">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-lg font-medium">Maklumat Bayaran</h3>
              <div v-if="activeGlFilter" class="flex items-center gap-2">
                <span class="text-sm">Ditapis GL:</span>
                <rs-badge variant="info">{{ activeGlFilter }}</rs-badge>
                <rs-button variant="ghost" size="xs" @click="clearGlFilter">
                  Buang Tapis
                </rs-button>
              </div>
            </div>

            <RsTable
              :data="paTableData"
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
              <template #amaun="{ text }">
                RM {{ toMYR(text) }}
              </template>

              <template #status="{ text }">
                <rs-badge
                  :variant="text === 'SAH' ? 'success' : text === 'DITOLAK' ? 'danger' : 'warning'"
                >
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
            >
              <template #status="{ text }">
                <rs-badge :variant="text === 'SAH' ? 'success' : 'warning'">
                  {{ text }}
                </rs-badge>
              </template>
              <template #tindakan="{ value }">
                <div class="text-center">
                  <rs-button
                    variant="ghost"
                    size="sm"
                    class="!px-2 !py-1 text-blue-600 hover:text-blue-800"
                    @click="viewDocument(value.id)"
                    title="Lihat Dokumen"
                  >
                    <Icon name="material-symbols:visibility" class="w-5 h-5" />
                  </rs-button>
                </div>
              </template>

            </RsTable>
          </RsTabItem>
        </RsTab>


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


    <RsModal v-model="showInvoiceModal" title="Cipta Invoice" size="lr">
      <template #body>
        <div class="grid grid-cols-1 gap-6">
          <FormKit v-model="newInvoice.invoiceNo" type="text" label="No. Invois" disabled />
          <FormKit v-model="newInvoice.noInvoisPelanggan" type="text" label="No. Invois Pelanggan" required />
          <FormKit v-model="newInvoice.tajuk" type="text" label="Tajuk" required />
          <FormKit v-model="newInvoice.semester" type="text" label="Semester" required />
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
          <FormKit v-model="newInvoice.bulan" type="text" label="Bulan" readonly />
          <FormKit v-model="newInvoice.tahun" type="text" label="Tahun" readonly />
          <FormKit v-model="newInvoice.catatan" type="textarea" label="Catatan" rows="3" placeholder="Masukkan catatan tambahan jika perlu..." />
          <FormKit v-model="newInvoice.penerimaBayaran" type="text" label="Penerima Bayaran" readonly />
          <FormKit v-model="newInvoice.mop" type="text" label="MOP" readonly />
          <FormKit v-model="newInvoice.namaPenerima" type="text" label="Nama Penerima" readonly />
          <FormKit v-model="newInvoice.bank" type="text" label="Bank" readonly />
          <FormKit v-model="newInvoice.noAkaun" type="text" label="No. Akaun" readonly />
          <FormKit v-model="newInvoice.tarikhJangkaanPembayaran" type="date" label="Tarikh Jangkaan Pembayaran" required />
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
          <FormKit v-model="newInvoice.lampiran" type="file" label="Muat Naik Lampiran" accept=".pdf,.doc,.docx" />
        </div>
      </template>
      <template #footer>
        <rs-button @click="showInvoiceModal = false">Batal</rs-button>
        <rs-button :disabled="getGlBalance(selectedGlNo) <= 0 || !newInvoice.amaun || Number(newInvoice.amaun) <= 0"
              @click="createInvoice">
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
  { name: 'Mohon Tuntutan', type: 'current', path: '/BF-BTN/tuntutan-dengan-siasatan/mohon-tuntutan' },
])

const formData = ref({
  namaPemohon: '',
  noPengenalan: '',
  emailPemohon: '',
  noTelefonPemohon: '',
  kategoriAsnaf: 'Fakir',
  noBtn: '',
  noGL: '',
  noInvois: 'INV-2025-00124',
  kodBantuan: '',
  aid: '',
  aidProduct: '',
  productPackage: '',
  entitlementProduct: '',
  amaunTuntutan: '',
  tarikh: '',
  catatan: '',
  dokumenSokongan: [],
  tarikhMula: '',
  tarikhAkhir: '',
  penerimaBayaran: '',
  mop: '',
  namaPenerima: '',
  bank: '',
  noAkaun: '',
  tarikhJangkaanPembayaran: '',
  tarikhDicipta: '04/04/2025 03:45 PM',
})

const fieldsDI = ['diNo', 'entitlementProduct', 'penerima', 'bulan', 'tahun', 'status', 'amaun']
const columnsDI = [
  { key: 'diNo', label: 'DI No' },
  { key: 'entitlementProduct', label: 'Entitlement Product' },
  { key: 'penerima', label: 'Penerima' },
  { key: 'bulan', label: 'Bulan' },
  { key: 'tahun', label: 'Tahun' },
  { key: 'status', label: 'Status' },
  { key: 'amaun', label: 'Amaun (RM)' },
]

// --- GL columns: add invoiceCount, invoiceTotal, currentBalance ---
const fieldsGL = [
  'glNo', 'diNo', 'createdDate', 'penerimaBayaran',
  'status', 'bulan', 'tahun', 'amaun',
  'invoiceCount', 'invoiceTotal', 'currentBalance', 'tindakan'
]

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
  { key: 'tindakan', label: 'Tindakan' },
]


const fieldsInv = [
  'invoiceNo', 'title', 'expectedPaymentDate', 'diNo', 'glNo', 'paNo', 'approverStatus', 'amaun'
]
const columnsInv = [
  { key: 'invoiceNo', label: 'Invoice No' },
  { key: 'title', label: 'Title' },
  { key: 'expectedPaymentDate', label: 'Tarikh Jangkaan Pembayaran' },
  { key: 'diNo', label: 'DI No' },
  { key: 'glNo', label: 'GL No' },
  { key: 'paNo', label: 'PA No' },
  { key: 'approverStatus', label: 'Approver Status' },
  { key: 'amaun', label: 'Amaun (RM)' },
]

const fieldsDoc = ['name', 'nameFile', 'uploadDate', 'tindakan']
const columnsDoc = [
  { key: 'name', label: 'Nama Dokumen' },
  { key: 'nameFile', label: 'Nama File' },
  { key: 'uploadDate', label: 'Tarikh Muat Naik' },
  { key: 'tindakan', label: 'Tindakan' },
]

const noBtnOptions = ref([
  { label: 'NAS-2025-00012', value: 'NAS-2025-00012' },
  { label: 'NAS-2025-00014', value: 'NAS-2025-00014' },
])

const distributionItems = ref([
  {
    diNo: 'DI-002',
    entitlementProduct: 'BANTUAN PERUBATAN DIALISIS',
    penerima: 'VENDOR',
    bulan: 'MAC',
    tahun: '2025',
    status: 'Aktif',
    amaun: '1500.00',
  },
])

const documents = ref([
  { id: 1, name: 'Invoice 940411145465', nameFile: 'Invoice 940411145465.pdf', uploadDate: '04/04/2025' },
])

// --- GL state + derived values (keep your guaranteeLetters, add a computed mapper) ---
const guaranteeLetters = ref([
  {
    glNo: 'GL-002',
    diNo: 'DI-002',
    createdDate: '15/01/2025',
    penerimaBayaran: 'VENDOR B',
    status: 'AKTIF',        // will auto-switch to 'SELESAI' if fully invoiced
    bulan: 'MAC',
    tahun: '2025',
    amaun: '1500.00',
    // balance field no longer stored; derived below
  },
])

// rows with live metrics
const glRows = computed(() =>
  guaranteeLetters.value.map(gl => {
    const glTotal = toNum(gl.amaun)
    const invTotal = sumInvoicesByGL(gl.glNo)
    const balance = Math.max(glTotal - invTotal, 0)
    return {
      ...gl,
      invoiceCount: invoices.value.filter(i => i.glNo === gl.glNo).length,
      invoiceTotal: invTotal.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      currentBalance: balance.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    }
  })
)


const invoices = ref([
  // { invoiceNo: 'INV-2025-1001', title: 'Dialisis Mac', expectedPaymentDate: '2025-03-30', diNo: 'DI-002', glNo: 'GL-002', paNo: 'PA-001', approverStatus: 'APPROVED', amaun: '1500.00' }
])

const toMYR = (n) => {
  if (n == null || n === '') return '0.00'
  const num = typeof n === 'number' ? n : Number(String(n).replace(/,/g, ''))
  return isNaN(num) ? '0.00' : num.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// --- NEW: utility helpers ---
const toNum = (v) => {
  if (v == null || v === '') return 0
  const n = typeof v === 'number' ? v : Number(String(v).replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}
const sumInvoicesByGL = (glNo) =>
  invoices.value.filter(i => i.glNo === glNo)
    .reduce((s, r) => s + toNum(r.amaun), 0)

// put near your other helpers
const getGlBalance = (glNo) => {
  const gl = guaranteeLetters.value.find(g => g.glNo === glNo)
  if (!gl) return 0
  const glTotal = toNum(gl.amaun)
  const invTotal = sumInvoicesByGL(glNo)
  return Math.max(glTotal - invTotal, 0)
}


const showInvoiceModal = ref(false)
const selectedGlNo = ref(null)

const newInvoice = ref({
  invoiceNo: 'AUTO',
  noInvoisPelanggan: '',
  tajuk: '',
  semester: '',
  cgpa: null,
  bulan: '',
  tahun: '',
  catatan: '',
  penerimaBayaran: '',
  mop: '',
  namaPenerima: '',
  bank: '',
  noAkaun: '',
  tarikhJangkaanPembayaran: '',
  amaun: null,
  lampiran: null,
})

function openInvoiceModal(glNo) {
  selectedGlNo.value = glNo
  const gl = guaranteeLetters.value.find(g => g.glNo === glNo)
  if (gl) {
    const remaining = getGlBalance(gl.glNo)
    newInvoice.value = {
      ...newInvoice.value,
      invoiceNo: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`,
      tajuk: `Invoice untuk ${gl.glNo}`,
      bulan: gl.bulan,
      tahun: gl.tahun,
      penerimaBayaran: gl.penerimaBayaran,
      amaun: remaining, // prefill with balance left
    }
  }
  showInvoiceModal.value = true
}

function createInvoice() {
  const gl = guaranteeLetters.value.find(g => g.glNo === selectedGlNo.value) || {}

  if (!gl.glNo) {
   $swal.fire({ icon: 'error', title: 'Ralat', text: 'GL tidak sah/tiada. Sila cuba lagi.' })
   return
 }

 // VALIDATIONS
 const balanceBefore = getGlBalance(gl.glNo)
 const amount = Number(newInvoice.value.amaun ?? 0)
 if (balanceBefore <= 0) {
   $swal.fire({
     icon: 'error',
     title: 'Baki Habis',
     text: 'Tidak boleh cipta invois kerana Baki (RM) = 0.',
     confirmButtonText: 'OK'
   })
   return
 }
 if (!Number.isFinite(amount) || amount <= 0) {
   $swal.fire({
     icon: 'error',
     title: 'Amaun Tidak Sah',
     text: 'Amaun invois mesti lebih besar daripada 0.',
     confirmButtonText: 'OK'
   })
   return
 }
 if (amount > balanceBefore) {
   $swal.fire({
     icon: 'error',
     title: 'Lebih Had Baki',
     html: `Amaun invois (RM ${toMYR(amount)}) melebihi Baki (RM ${toMYR(balanceBefore)}).`,
     confirmButtonText: 'OK'
   })
   return
 }

 // 1) Generate PA number sekali saja
const paNumber = `PA-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`

// 2) Create newInv
const newInv = {
  invoiceNo: newInvoice.value.invoiceNo,
  title: newInvoice.value.tajuk,
  expectedPaymentDate: newInvoice.value.tarikhJangkaanPembayaran,
  diNo: gl.diNo || '',
  glNo: gl.glNo || '',
  paNo: paNumber, // guna paNumber
  approverStatus: 'PENDING',
  amaun: String(newInvoice.value.amaun ?? ''),
}
invoices.value = [newInv, ...invoices.value]   // new array ref ✨

// 3) Auto-create newPa
const newPa = {
  paNo: paNumber, // guna paNumber yang sama
  diNo: gl.diNo || '',
  createdDate: new Date().toLocaleDateString('ms-MY'),
  penerimaBayaran: newInvoice.value.penerimaBayaran || gl.penerimaBayaran || formData.value.penerimaBayaran || '',
  status: 'DRAF',
  invoiceNo: newInvoice.value.invoiceNo,
  amaun: Number(newInvoice.value.amaun ?? 0),
}
paymentAdvices.value = [...paymentAdvices.value, newPa]  // new array ref ✨


  // 3) (Optional) auto-mark GL as complete when fully invoiced
  const totalInv = sumInvoicesByGL(gl.glNo)
  const glTotal = toNum(gl.amaun)
  if (glTotal > 0 && totalInv >= glTotal) {
    const idx = guaranteeLetters.value.findIndex(g => g.glNo === gl.glNo)
    if (idx > -1) guaranteeLetters.value[idx].status = 'SELESAI'
  }

  // 4) Focus the filter on this GL for convenience
  activeGlFilter.value = gl.glNo || null

  showInvoiceModal.value = false
  $swal.fire({ icon: 'success', title: 'Berjaya!', text: 'Invois telah dicipta', confirmButtonText: 'OK' })
}



function viewDocument(id) {
  console.log('View doc id:', id)
  $swal.fire({ icon: 'info', title: 'Dokumen', text: `Buka dokumen ID: ${id}` })
}

const handlenoBtnChange = async (value) => {
  // reset fields first (keep your existing clears)
  formData.value.aid = '';
  formData.value.aidProduct = '';
  formData.value.productPackage = '';
  formData.value.entitlementProduct = '';
  formData.value.amaunTuntutan = '';
  formData.value.dokumenSokongan = [];
  formData.value.penerimaBayaran = '';
  formData.value.bulan = '';
  formData.value.tahun = '';
  formData.value.mop = '';
  formData.value.namaPenerima = '';
  formData.value.bank = '';
  formData.value.noAkaun = '';

  const noBtnDataMapping = {
    'NAS-2025-00012': {
      aid: 'AID-0012', aidProduct: 'Dialisis', productPackage: 'PKG-01',
      entitlementProduct: 'BANTUAN PERUBATAN DIALISIS', amaunTuntutan: '1500.00',
      penerimaBayaran: 'VENDOR B', bulan: 'MAC', tahun: '2025',
      mop: 'EFT', namaPenerima: 'VENDOR B', bank: 'CIMB', noAkaun: '8000xxxxxx',
      dokumenDefault: 'contoh.pdf',
    },
  };

  if (value && noBtnDataMapping[value]) {
    const noBtnData = noBtnDataMapping[value];
    formData.value = { ...formData.value, ...noBtnData };
    formData.value.tarikhMula = new Date().toISOString().split('T')[0];
    formData.value.tarikhAkhir = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];

    // seed DI/GL when user changes dropdown
    distributionItems.value = [{
      diNo: `DI-${value.slice(-3)}`,
      entitlementProduct: noBtnData.entitlementProduct,
      penerima: 'VENDOR',
      bulan: noBtnData.bulan,
      tahun: noBtnData.tahun,
      status: 'Aktif',
      amaun: noBtnData.amaunTuntutan,
    }];

    guaranteeLetters.value = [{
      glNo: `GL-${value.slice(-3)}`,
      diNo: distributionItems.value[0].diNo,
      createdDate: new Date().toLocaleDateString('ms-MY'),
      penerimaBayaran: noBtnData.penerimaBayaran,
      status: 'AKTIF',
      bulan: noBtnData.bulan,
      tahun: noBtnData.tahun,
      amaun: noBtnData.amaunTuntutan,
      balance: '0.00',
    }];

    if (noBtnData.dokumenDefault) {
      const defaultFile = new File([''], noBtnData.dokumenDefault, { type: 'application/pdf' });
      formData.value.dokumenSokongan = [defaultFile];
    }
  }

  // Always keep the selected dropdown value
  formData.value.noBtn = value || '';
};



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


// --- PA (Payment Advice) table schema ---
const fieldsPA = ['paNo', 'diNo', 'createdDate', 'penerimaBayaran', 'status', 'invoiceNo', 'amaun']
const columnsPA = [
  { key: 'paNo', label: 'PA No' },
  { key: 'diNo', label: 'DI No' },
  { key: 'createdDate', label: 'Created Date' },
  { key: 'penerimaBayaran', label: 'Penerima Bayaran' },
  { key: 'status', label: 'Status' },
  { key: 'invoiceNo', label: 'Invoice No' },
  { key: 'amaun', label: 'Amaun (RM)' },
]

// Holds PA rows generated after invoices are created
const paymentAdvices = ref([])

// Table data with a final "TOTAL" row
// Replace paTableData with one that uses filteredPAs
const paTableData = computed(() => {
  const rows = filteredPAs.value
  if (!rows.length) return []
  const total = rows.reduce((sum, r) => sum + toNum(r.amaun), 0)
  return [
    ...rows,
    { paNo: 'TOTAL', diNo: '', createdDate: '', penerimaBayaran: '', status: '', invoiceNo: '', amaun: total },
  ]
})


function hydrateFromSelectedBantuan(row) {
  if (!row) return;

  // 1) Base identity
  formData.value.namaPemohon = row.namaPemohon || formData.value.namaPemohon;
  formData.value.noPengenalan = row.noKPPemohon || formData.value.noPengenalan;
  formData.value.noTelefonPemohon = formData.value.noTelefonPemohon || '';
  formData.value.kategoriAsnaf = formData.value.kategoriAsnaf || 'Fakir';

  // 2) No. Bantuan options + selection
  const nb = row.noBantuan || '';
  if (nb && !noBtnOptions.value.some(o => o.value === nb)) {
    noBtnOptions.value.unshift({ label: nb, value: nb });
  }
  formData.value.noBtn = nb;

  // 3) Map "Maklumat Bantuan" basics
  formData.value.kodBantuan = row.maklumatBantuan || '';
  // sensible defaults (you can replace with real API mapping later)
  formData.value.aid = formData.value.aid || 'AID-AUTO';
  formData.value.aidProduct = formData.value.aidProduct || 'Dialisis';
  formData.value.productPackage = formData.value.productPackage || 'PKG-01';
  formData.value.entitlementProduct = formData.value.entitlementProduct || 'BANTUAN PERUBATAN DIALISIS';

  // Validity window (1 year from today as placeholder)
  formData.value.tarikhMula = formData.value.tarikhMula || new Date().toISOString().slice(0,10);
  formData.value.tarikhAkhir = formData.value.tarikhAkhir || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0,10);

  // 4) DI (Distribution Items) — keep existing, but ensure it ties to bantuan
  // If you have many DI per bantuan, replace this with a real fetch later.
  if (!distributionItems.value.length) {
    distributionItems.value = [{
      diNo: `DI-${nb?.slice(-3) || '001'}`,
      entitlementProduct: formData.value.entitlementProduct,
      penerima: 'VENDOR',
      bulan: 'MAC',
      tahun: '2025',
      status: 'Aktif',
      amaun: '1500.00',
    }];
  }

  // 5) GL (Guarantee Letters) — seed from DI if empty
  if (!guaranteeLetters.value.length) {
    const di = distributionItems.value[0];
    guaranteeLetters.value = [{
      glNo: `GL-${nb?.slice(-3) || '001'}`,
      diNo: di.diNo,
      createdDate: new Date().toLocaleDateString('ms-MY'),
      penerimaBayaran: 'VENDOR B',
      status: 'AKTIF',
      bulan: di.bulan,
      tahun: di.tahun,
      amaun: di.amaun,
      balance: '0.00',
    }];
  }

  // 6) Default payer / MOP details
  formData.value.penerimaBayaran = formData.value.penerimaBayaran || 'VENDOR B';
  formData.value.mop = formData.value.mop || 'EFT';
  formData.value.namaPenerima = formData.value.namaPenerima || 'VENDOR B';
  formData.value.bank = formData.value.bank || 'CIMB';
  formData.value.noAkaun = formData.value.noAkaun || '8000xxxxxx';
}


const route = useRoute();

onMounted(() => {
  // 1) Session payload from list page
  let selected = null;
  try {
    const raw = sessionStorage.getItem('NAS_SELECTED_BANTUAN');
    if (raw) selected = JSON.parse(raw);
  } catch (e) {
    console.warn('Cannot parse NAS_SELECTED_BANTUAN', e);
  }

  // 2) Fallback from query params if you decide to also send them
  if (!selected && (route.query?.noBantuan || route.query?.namaPemohon)) {
    selected = {
      noBantuan: route.query.noBantuan,
      namaPemohon: route.query.namaPemohon,
      noKPPemohon: route.query.noKPPemohon,
      maklumatBantuan: route.query.maklumatBantuan,
      status: route.query.status,
      pemohon: route.query.pemohon,
    };
  }

  if (selected) {
    hydrateFromSelectedBantuan(selected);
  }

  // keep your earlier demo defaults if nothing came in
  if (!formData.value.namaPemohon) {
    populateFormDataFromSession();
  }
});

// --- NEW: active GL filter shared by Invoices and Payment Advice ---
const activeGlFilter = ref(null)
const applyGlFilter = (glNo) => { activeGlFilter.value = glNo }
const clearGlFilter = () => { activeGlFilter.value = null }

// Filtered data used by the tables below
const filteredInvoices = computed(() =>
  activeGlFilter.value
    ? invoices.value.filter(r => r.glNo === activeGlFilter.value)
    : invoices.value
)

const filteredPAs = computed(() =>
  activeGlFilter.value
    ? paymentAdvices.value.filter(r => {
        // join by invoice → glNo (robust when PA does not carry glNo)
        const inv = invoices.value.find(i => i.invoiceNo === r.invoiceNo)
        return inv?.glNo === activeGlFilter.value
      })
    : paymentAdvices.value
)


</script>

<style lang="scss" scoped>
/* Add component-scoped styles here if needed */
</style>

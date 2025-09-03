<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">

      <template #body>
        <RsTab variant="primary" type="default"> 
         
          <RsTabItem title="Maklumat Pemohon":active>
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
                type="select"
                label="No. Bantuan"
                :options="[{ label: 'Sila Pilih...', value: '' }, ...noBtnOptions]"
                validation="required"
                :validation-messages="{ required: 'Sila pilih No. Bantuan' }"
                @input="handlenoBtnChange"
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
              :showSearch="true"
              :showFilter="true"
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
              :data="guaranteeLetters"
              :field="fieldsGL"
              :columns="columnsGL"
              :showSearch="true"
              :showFilter="true"
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
                filterable: true,
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
              <template #balance="{ text }">
                RM {{ toMYR(text) }}
              </template>
              <template #status="{ text }">
                <rs-badge :variant="text === 'AKTIF' ? 'success' : 'danger'">
                  {{ text }}
                </rs-badge>
              </template>
              <template #tindakan="{ value }">
                <div class="text-center">
                  <rs-button @click="openInvoiceModal(value.glNo)">Cipta Invoice</rs-button>
                </div>
              </template>
            </RsTable>

            <h3 class="text-lg font-medium mt-6 mb-4">Senarai Invoice</h3>
            <RsTable
              :data="invoices"
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
                filterable: true,
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

          
          <RsTabItem title="Dokumen Sokongan">
            <h3 class="text-lg font-medium mb-4">Dokumen Sokongan</h3>

            
          <RsTable
            :data="documents"
            :field="fieldsDoc"
            :columns="columnsDoc"
            advanced
            :showSearch="true"
            :showFilter="true"
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
                <rs-button variant="primary" size="sm" class="!px-2 !py-1" @click="viewDocument(value.id)">
                  <Icon name="material-symbols:visibility" class="w-4 h-4 mr-1" /> Lihat
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
  </div>

  
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
      <rs-button @click="createInvoice">Simpan</rs-button>
    </template>
  </RsModal>
</template>

<script setup>
import { ref } from 'vue'
import { useNuxtApp, navigateTo } from '#app'
import RsTable from '~/components/RsTable.vue' // Reusable table

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


const fieldsGL = [
  'glNo', 'diNo', 'createdDate', 'penerimaBayaran', 'status', 'bulan', 'tahun', 'amaun', 'balance', 'tindakan'
]
const columnsGL = [
  { key: 'glNo', label: 'GL No' },
  { key: 'diNo', label: 'DI No' },
  { key: 'createdDate', label: 'Created Date' },
  { key: 'penerimaBayaran', label: 'Penerima Bayaran' },
  { key: 'status', label: 'Status' },
  { key: 'bulan', label: 'Bulan' },
  { key: 'tahun', label: 'Tahun' },
  { key: 'amaun', label: 'Amaun (RM)' },
  { key: 'balance', label: 'Balance (RM)' },
  { key: 'tindakan', label: 'Tindakan' },
]


const fieldsInv = [
  'invoiceNo', 'title', 'expectedPaymentDate', 'diNo', 'glNo', 'paNo', 'approverStatus', 'amaun'
]
const columnsInv = [
  { key: 'invoiceNo', label: 'Invoice No' },
  { key: 'title', label: 'Title' },
  { key: 'expectedPaymentDate', label: 'Expected Payment Date' },
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

const guaranteeLetters = ref([
  {
    glNo: 'GL-002',
    diNo: 'DI-002',
    createdDate: '15/01/2025',
    penerimaBayaran: 'VENDOR B',
    status: 'AKTIF',
    bulan: 'MAC',
    tahun: '2025',
    amaun: '1500.00',
    balance: '0.00',
  },
])

const invoices = ref([
  
  // { invoiceNo: 'INV-2025-1001', title: 'Dialisis Mac', expectedPaymentDate: '2025-03-30', diNo: 'DI-002', glNo: 'GL-002', paNo: 'PA-001', approverStatus: 'APPROVED', amaun: '1500.00' }
])


const toMYR = (n) => {
  if (n == null || n === '') return '0.00'
  const num = typeof n === 'number' ? n : Number(String(n).replace(/,/g, ''))
  return isNaN(num) ? '0.00' : num.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
    newInvoice.value = {
      ...newInvoice.value,
      invoiceNo: `INV-${new Date().getFullYear()}-${Math.floor(Math.random()*90000+10000)}`,
      tajuk: `Invoice untuk ${gl.glNo}`,
      bulan: gl.bulan,
      tahun: gl.tahun,
      penerimaBayaran: gl.penerimaBayaran,
      amaun: Number(gl.amaun),
    }
  }
  showInvoiceModal.value = true
}

function createInvoice() {
  const gl = guaranteeLetters.value.find(g => g.glNo === selectedGlNo.value) || {}
  invoices.value.unshift({
    invoiceNo: newInvoice.value.invoiceNo,
    title: newInvoice.value.tajuk,
    expectedPaymentDate: newInvoice.value.tarikhJangkaanPembayaran,
    diNo: gl.diNo || '',
    glNo: gl.glNo || '',
    paNo: '—',
    approverStatus: 'PENDING',
    amaun: String(newInvoice.value.amaun ?? ''),
  })
  showInvoiceModal.value = false
  $swal.fire({ icon: 'success', title: 'Berjaya!', text: 'Invois telah dicipta', confirmButtonText: 'OK' })
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
      aid: 'AID-0012', aidProduct: 'Dialisis', productPackage: 'PKG-01',
      entitlementProduct: 'BANTUAN PERUBATAN DIALISIS', amaunTuntutan: '1500.00',
      penerimaBayaran: 'VENDOR B', bulan: 'MAC', tahun: '2025',
      mop: 'EFT', namaPenerima: 'VENDOR B', bank: 'CIMB', noAkaun: '8000xxxxxx',
      dokumenDefault: 'contoh.pdf',
    },
  }

  if (value && noBtnDataMapping[value]) {
    const noBtnData = noBtnDataMapping[value]
    formData.value = { ...formData.value, ...noBtnData }
    formData.value.tarikhMula = new Date().toISOString().split('T')[0]
    formData.value.tarikhAkhir = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    if (noBtnData.dokumenDefault) {
      const defaultFile = new File([''], noBtnData.dokumenDefault, { type: 'application/pdf' })
      formData.value.dokumenSokongan = [defaultFile]
    }
  }
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
</script>

<style lang="scss" scoped>

</style>

<!-- File: pages/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-pelulus/[id]/semak-kelulusan.vue -->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- success banners (3–5s auto-hide) -->
    <transition name="fade">
      <rs-alert
        v-if="banner.type==='save' && banner.visible"
        variant="success"
        class="mt-4"
        title="Maklumat telah berjaya disimpan!" />
    </transition>
    <transition name="fade">
      <rs-alert
        v-if="banner.type==='send' && banner.visible"
        variant="success"
        class="mt-4"
        title="Maklumat telah berjaya dihantar!" />
    </transition>

    <div class="space-y-6 mt-4" v-if="row">
      <!-- Section 0: Maklumat Pemohon (3.1) -->
      <rs-card>
        <template #header>
          <div class="flex items-center">
            Maklumat Pemohon
          </div>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormKit type="text" label="Nama Pemohon" :modelValue="pemohonView.nama" :disabled="true" />
            <FormKit type="text" label="No. Kad Pengenalan" :modelValue="pemohonView.noId" :disabled="true" />
            <FormKit type="text" label="Emel" :modelValue="pemohonView.email" :disabled="true" />
            <FormKit type="text" label="No. Telefon" :modelValue="pemohonView.telefon" :disabled="true" />
            <FormKit type="text" label="No. Kad Pengenalan / No. Institusi" :modelValue="pemohonView.noId" :disabled="true" />
            <FormKit type="text" label="Status Household" :modelValue="pemohonView.statusHousehold" :disabled="true" />
            <FormKit type="text" label="Status Individu" :modelValue="pemohonView.statusIndividu" :disabled="true" />
            <FormKit type="text" label="Status Multidimensi" :modelValue="pemohonView.statusMultidimensi" :disabled="true" />
          </div>
        </template>
      </rs-card>

      <!-- Section 1: Maklumat Bantuan (3.2) -->
      <rs-card>
        <template #header>
          <div class="flex items-center">
            Maklumat Bantuan
          </div>
        </template>
        <template #body>
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <!-- Removed the heading -->
            <!-- <h4 class="text-md font-medium mb-4">Butiran Asas Jenis Bantuan</h4> -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit type="text" label="No. Bantuan" :modelValue="row.bantuanData?.kodBantuan || '-'" :disabled="true" />
              <FormKit type="text" label="Aid" :modelValue="row.bantuanData?.jenisBantuan || '-'" :disabled="true" />
              <FormKit type="text" label="Product Package" :modelValue="row.bantuanData?.pakejBantuan || '-'" :disabled="true" />
              <FormKit type="text" label="Entitlement Product" :modelValue="row.bantuanData?.kelayakanBantuan || '-'" :disabled="true" />
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Section 2: Maklumat Tuntutan (3.3) -->
      <rs-card>
        <template #header>
          <div class="flex items-center">
            Maklumat Tuntutan
          </div>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormKit type="text" label="Nombor GL" :modelValue="row.noGL" :disabled="true" />
            <FormKit type="text" label="Nombor Invoice" :modelValue="noInvois" :disabled="true" />
            <FormKit type="text" label="Amaun GL (RM)" :modelValue="`RM ${formatNumber(row.amaunGL)}`" :disabled="true" />
            <FormKit type="text" label="Amaun Tuntutan (RM)" :modelValue="`RM ${formatNumber(row.amaunTuntutan)}`" :disabled="true" />
            <FormKit type="text" label="Baki Amaun (RM)" :modelValue="`RM ${formatNumber(row.bakiAmaun)}`" :disabled="true" />
            <FormKit type="text" label="Tarikh Mohon Tuntutan" :modelValue="formatDate(row.tarikhPermohonan)" :disabled="true" />
            <FormKit type="text" label="Catatan Tambahan" :modelValue="catatanTambahan" :disabled="true" />
          </div>
        </template>
      </rs-card>

      <!-- Section 3: Maklumat Dokumen Sokongan (3.4) -->
      <!-- Ensure the document links display the same way -->
      <rs-card>
        <template #header>
          <div class="flex items-center">
            Maklumat Dokumen Sokongan
          </div>
        </template>
        <template #body>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dokumen</label>
              <div class="flex items-center flex-wrap gap-2">
                <a v-for="(doc, i) in row.dokumenSokongan" :key="i" :href="doc.url" target="_blank"
                   class="text-primary-600 hover:text-primary-800 flex items-center">
                  <Icon name="material-symbols:file-present-outline" class="mr-1" />
                  {{ doc.name }}
                </a>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Section 4: Keputusan Siasatan (3.5, Read-Only) -->
      <rs-card v-if="row?.siasatan">
        <template #header>
          <div class="flex items-center">
            Keputusan Siasatan
          </div>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormKit type="text" label="Kaedah Siasatan" :modelValue="siasatan.kaedah || '-'" :disabled="true" />
            <FormKit type="text" label="Status Sokongan" :modelValue="siasatan.status || '-'" :disabled="true" />
            <FormKit type="text" label="Catatan" :modelValue="siasatan.catatan || '-'" :disabled="true" />
            <FormKit type="text" label="Nama Pegawai" :modelValue="siasatan.namaPegawai" :disabled="true" />
            <FormKit type="text" label="Tarikh" :modelValue="siasatan.tarikh ? formatDate(siasatan.tarikh) : '-'" :disabled="true" />
          </div>
        </template>
      </rs-card>

      <!-- Section 5: Semakan Maklumat (removed per backlog) -->

      <!-- Section 6: Maklumat Kelulusan (3.6) -->
      <rs-card>
        <template #header>
          <div class="flex items-center">
            Maklumat Kelulusan
          </div>
        </template>
        <template #body>
          <form @submit.prevent>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit type="select" label="Status" v-model="form.keputusan" :options="statusOptions" :validation="[['required']]" />
              <FormKit type="text" label="Nama Pegawai" :modelValue="currentUser.name" :disabled="true" />
              <div class="md:col-span-2">
                <FormKit type="textarea" label="Catatan" v-model="form.catatan" :disabled="form.keputusan !== 'Tidak Lulus'" validation="required_if:keputusan,Tidak Lulus" :validation-messages="{ required_if: 'Catatan diperlukan untuk keputusan Tidak Lulus' }" placeholder="Masukkan catatan semakan..." />
              </div>
              <FormKit type="text" label="Tarikh" :modelValue="today" :disabled="true" />
            </div>
            <div class="flex justify-end gap-3 pt-6">
              <rs-button type="button" variant="secondary" @click="handleCancel">Batal</rs-button>
              <rs-button type="button" variant="default" :disabled="isSubmitting || !form.keputusan" @click="handleSave">Simpan</rs-button>
              <rs-button type="button" :variant="form.keputusan === 'Lulus' ? 'primary' : 'danger'" :disabled="isSubmitting || !form.keputusan" @click="handleSubmit">Hantar Tuntutan</rs-button>
            </div>
          </form>
        </template>
      </rs-card>
    </div>

    <div v-else class="mt-8">
      <rs-empty title="Rekod tidak dijumpai" text="Sila kembali ke senarai tuntutan.">
        <template #actions>
          <rs-button variant="secondary" @click="navigateTo('/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-pelulus')">Kembali</rs-button>
        </template>
      </rs-empty>
    </div>

    <!-- Confirmation Modal (for 2.2) -->
    <rs-modal v-model="showConfirmationModal" :title="form.keputusan === 'Lulus' ? 'Pengesahan Kelulusan' : 'Pengesahan Tidak Lulus'" size="md" position="center">
      <template #body>
        <div class="space-y-4">
          <p class="mb-4">Adakah anda pasti untuk {{ form.keputusan === 'Lulus' ? 'meluluskan' : 'tidak meluluskan' }} tuntutan ini?</p>
          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between"><span class="font-medium">ID Permohonan:</span><span>{{ row?.idPermohonan }}</span></div>
            <div class="flex justify-between"><span class="font-medium">No. GL:</span><span>{{ row?.noGL }}</span></div>
            <div class="flex justify-between"><span class="font-medium">Amaun Tuntutan:</span><span>RM {{ formatNumber(row?.amaunTuntutan || 0) }}</span></div>
            <div class="flex justify-between"><span class="font-medium">Amaun GL:</span><span>RM {{ formatNumber(row?.amaunGL || 0) }}</span></div>
            <div class="flex justify-between"><span class="font-medium">Baki Amaun:</span><span>RM {{ formatNumber(row?.bakiAmaun || 0) }}</span></div>
            <div class="flex justify-between"><span class="font-medium">Status GL:</span><span>{{ row?.statusGL }}</span></div>
            <div class="flex justify-between"><span class="font-medium">Catatan:</span><span>{{ form.catatan || '-' }}</span></div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button variant="secondary" @click="showConfirmationModal = false" :disabled="isSubmitting">Batal</rs-button>
          <rs-button :variant="form.keputusan === 'Lulus' ? 'primary' : 'danger'" @click="handleConfirmSend" :disabled="isSubmitting">
            <span v-if="isSubmitting"><Icon name="eos-icons:loading" class="ml-1" size="1rem" /></span>
            <span v-else>{{ form.keputusan === 'Lulus' ? 'Sahkan Lulus' : 'Sahkan Tidak Lulus' }}</span>
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineComponent, h } from 'vue'
import { navigateTo } from '#app'

// =====================================
// Inline Types (from former mock module)
// =====================================
type Dok = { name: string; url: string }

type Pemohon = {
  nama: string
  noId: string
  telefon: string
  email: string
  alamat: string
  statusHousehold?: string
  statusIndividu?: string
  statusMultidimensi?: string
}

type SiasatanInfoStrict = {
  kaedah: 'Semak Dokumen Sahaja' | 'Telefon' | 'Lapangan'
  status: 'Sokong' | 'Tidak Sokong'
  catatan?: string
  tarikh?: string
  namaPegawai?: string
}
// View-friendly version with all fields optional for safely handling missing data
type SiasatanInfoView = Partial<SiasatanInfoStrict>

type TuntutanItem = {
  id: string            // route id
  idPermohonan: string
  noBantuan?: string
  noGL: string
  noInvois?: string
  amaunTuntutan: number
  amaunGL: number
  bakiAmaun: number
  tarikhPermohonan: string
  pegawaiETD: string
  statusGL: 'Lulus' | 'Tidak Lulus'
  tarikhPerkhidmatan: string
  dokumenSokongan: Dok[]
  dokumenPerkhidmatan: Dok[]
  lampiranLain: Dok[]
  bantuanData: {
    kodBantuan: string
    jenisBantuan: string
    bahanBantuan: string
    pakejBantuan: string
    kelayakanBantuan: string
  }
  pemohon: Pemohon
  catatan?: string
  catatanTambahan?: string
  siasatan?: SiasatanInfoStrict
  statusKelulusan?: 'Lulus' | 'Tidak Lulus' | 'Belum Diputus'
}

// =============================
// Inline Mock Store (self-contained)
// =============================
const pemohonMockTemplate: Pemohon = { nama: '-', noId: '-', telefon: '-', email: '-', alamat: '-' }
const createPemohonMock = (overrides: Partial<Pemohon> = {}): Pemohon => ({ ...pemohonMockTemplate, ...overrides })

const _items = ref<TuntutanItem[]>([
  {
    id: 'TDS-2024-001', idPermohonan: 'TDS-2024-001', noGL: 'GL-2024-001', noInvois: 'INV-2024-001',
    amaunTuntutan: 5000, amaunGL: 6000, bakiAmaun: 1000, tarikhPermohonan: '2024-03-20T09:30:00', pegawaiETD: 'Sarah binti Omar', statusGL: 'Lulus', tarikhPerkhidmatan: '2024-03-15T00:00:00',
    dokumenSokongan: [{ name: 'GL_Report_2024.pdf', url: '#' }, { name: 'Invoice_INV-2024-001.pdf', url: '#' }],
    dokumenPerkhidmatan: [{ name: 'Surat Pengesahan Perkhidmatan.pdf', url: '#' }], lampiranLain: [{ name: 'Gambar Lokasi.jpg', url: '#' }],
    bantuanData: { kodBantuan: 'B400', jenisBantuan: '(HQ) BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA', bahanBantuan: '(HQ) BANTUAN SUMBANGAN PERALATAN INSTITUSI AGAMA', pakejBantuan: '(GL) (HQ) BANTUAN SUMBANGAN KARPET INSTITUSI AGAMA', kelayakanBantuan: '(GL) (HQ) BANTUAN SUMBANGAN KARPET INSTITUSI AGAMA' },
    pemohon: createPemohonMock({ nama: 'Masjid As-Salam', noId: 'VND-10001', telefon: '03-1234 5678', email: 'admin@assalam.my', alamat: 'Lot 12, Jalan Masjid, 43000 Kajang, Selangor' }),
    siasatan: { kaedah: 'Semak Dokumen Sahaja', status: 'Sokong', catatan: 'Dokumen lengkap dan sah.', tarikh: '2024-03-18T10:00:00' },
    catatanTambahan: 'Pembelian karpet dewan solat utama.', statusKelulusan: 'Belum Diputus',
  },
  {
    id: 'TDS-2024-002', idPermohonan: 'TDS-2024-002', noGL: 'GL-2024-002', noInvois: 'INV-2024-145',
    amaunTuntutan: 3000, amaunGL: 2500, bakiAmaun: -500, tarikhPermohonan: '2024-04-02T11:00:00', pegawaiETD: 'Ahmad Faiz', statusGL: 'Tidak Lulus', tarikhPerkhidmatan: '2024-03-29T00:00:00',
    dokumenSokongan: [{ name: 'Resit Pembelian.pdf', url: '#' }], dokumenPerkhidmatan: [], lampiranLain: [],
    bantuanData: { kodBantuan: 'B210', jenisBantuan: '(HQ) BANTUAN TUNAI KECEMASAN', bahanBantuan: '(HQ) BANTUAN WANG TUNAI', pakejBantuan: 'Pakej Tunai', kelayakanBantuan: 'Kecemasan - Maks RM2500' },
    pemohon: createPemohonMock({ nama: 'Syarikat Berkat Niaga', noId: 'VND-20002', telefon: '012-345 6789', email: 'akaun@berkatniaga.com', alamat: 'No. 8, Jalan Perniagaan 3, 81200 Johor Bahru, Johor' }),
    siasatan: { kaedah: 'Telefon', status: 'Tidak Sokong', catatan: 'Amaun tuntutan melebihi amaun GL.', tarikh: '2024-04-01T16:30:00' },
    catatan: 'Amaun tuntutan melebihi amaun GL.', catatanTambahan: 'Kecemasan tidak dibuktikan mencukupi.', statusKelulusan: 'Tidak Lulus',
  },
  {
    id: 'TDS-2024-003', idPermohonan: 'TDS-2024-003', noGL: 'GL-2024-003', noInvois: 'INV-2024-223',
    amaunTuntutan: 2000, amaunGL: 2000, bakiAmaun: 0, tarikhPermohonan: '2024-04-10T14:30:00', pegawaiETD: 'Noraini Zulkifli', statusGL: 'Lulus', tarikhPerkhidmatan: '2024-04-05T00:00:00',
    dokumenSokongan: [{ name: 'Invoice Barang.pdf', url: '#' }], dokumenPerkhidmatan: [{ name: 'Surat Syor.pdf', url: '#' }], lampiranLain: [],
    bantuanData: { kodBantuan: 'B330', jenisBantuan: '(HQ) BANTUAN BARANGAN KEGUNAAN HARIAN', bahanBantuan: 'BARANGAN DAPUR', pakejBantuan: 'Pakej Barangan RM2000', kelayakanBantuan: 'Isi Rumah' },
    pemohon: createPemohonMock({ nama: 'Ali bin Ahmad', noId: '910101-14-5677', telefon: '013-888 1122', email: 'ali.ahmad@example.com', alamat: 'No. 21, Jalan Mawar 2, Taman Mawar, 40400 Shah Alam, Selangor' }),
    siasatan: { kaedah: 'Lapangan', status: 'Sokong', catatan: 'Lawatan lapangan: keadaan memerlukan.', tarikh: '2024-04-07T09:15:00' },
    catatan: 'Diluluskan penuh.', catatanTambahan: 'Barang dapur asas selama sebulan.', statusKelulusan: 'Lulus',
  },
  {
    id: 'TDS-2024-004', idPermohonan: 'TDS-2024-004', noGL: 'GL-2024-004', noInvois: 'INV-2024-417',
    amaunTuntutan: 8000, amaunGL: 10000, bakiAmaun: 2000, tarikhPermohonan: '2024-05-05T10:15:00', pegawaiETD: 'Mohd Yazid', statusGL: 'Lulus', tarikhPerkhidmatan: '2024-05-01T00:00:00',
    dokumenSokongan: [{ name: 'Quotation Peralatan.pdf', url: '#' }], dokumenPerkhidmatan: [{ name: 'Surat Pengesahan.pdf', url: '#' }], lampiranLain: [{ name: 'Gambar Lokasi.jpg', url: '#' }],
    bantuanData: { kodBantuan: 'B500', jenisBantuan: '(HQ) BANTUAN PEMBINAAN RUMAH', bahanBantuan: 'BAHAN BINAAN', pakejBantuan: 'Pakej Rumah Asnaf', kelayakanBantuan: 'Keluarga Asnaf Fakir Miskin' },
    pemohon: createPemohonMock({ nama: 'Keluarga Pn. Zainab', noId: '800202-10-2233', telefon: '017-222 3344', email: 'zainab.keluarga@example.com', alamat: 'Kg. Seri Makmur, 27000 Jerantut, Pahang' }),
    siasatan: { kaedah: 'Lapangan', status: 'Sokong', catatan: 'Penilaian struktur asas memadai untuk bina baharu.', tarikh: '2024-05-03T15:45:00' },
    catatanTambahan: 'Permohonan bina semula ruang dapur.', statusKelulusan: 'Belum Diputus',
  },
  {
    id: 'TDS-2024-005', idPermohonan: 'TDS-2024-005', noGL: 'GL-2024-005', noInvois: 'INV-2024-590',
    amaunTuntutan: 1200, amaunGL: 1500, bakiAmaun: 300, tarikhPermohonan: '2024-05-15T09:00:00', pegawaiETD: 'Siti Aminah', statusGL: 'Lulus', tarikhPerkhidmatan: '2024-05-12T00:00:00',
    dokumenSokongan: [], dokumenPerkhidmatan: [], lampiranLain: [],
    bantuanData: { kodBantuan: 'B110', jenisBantuan: '(HQ) BANTUAN PERUBATAN', bahanBantuan: 'RAWATAN KLINIK', pakejBantuan: 'Rawatan Kesihatan', kelayakanBantuan: 'Asnaf - Pesakit Kronik' },
    pemohon: createPemohonMock({ nama: 'Klinik Kasih', noId: 'VND-30005', telefon: '03-7788 9090', email: 'akaun@klinikkasih.my', alamat: '19, Jalan Sehat, 46050 Petaling Jaya, Selangor' }),
    siasatan: { kaedah: 'Semak Dokumen Sahaja', status: 'Sokong', catatan: 'Bill rawatan disahkan.', tarikh: '2024-05-13T11:20:00' },
    catatanTambahan: 'Pesakit perlu rawatan susulan.', statusKelulusan: 'Belum Diputus',
  },
])

// simple getter helpers
const getById = (id: string) => _items.value.find((x) => x.id === id) || null
const setDecision = (id: string, keputusan: 'Lulus' | 'Tidak Lulus', catatan?: string) => {
  const row = getById(id)
  if (row) { row.statusKelulusan = keputusan; row.catatan = catatan ?? '' }
}

// =============================
// Page Logic
// =============================

definePageMeta({ title: 'Semakan & Kelulusan Tuntutan' })

const nuxtApp = useNuxtApp()
const $swal = nuxtApp.$swal as any
const route = useRoute()
const paramId = computed<string>(() => {
  const p = route.params as Record<string, string | number | undefined>
  return String(p.id ?? p.rujukan ?? p.ref ?? p.slug ?? '')
})

const row = computed<TuntutanItem | null>(() => {
  const rowData = getById(paramId.value)
  if (rowData) {
    rowData.noBantuan = rowData.noBantuan || '-'  // Ensure noBantuan exists
  }
  return rowData
})

const pemohonView = computed(() => {
  const p = row.value?.pemohon
  return {
    nama: p?.nama ?? '-',
    noId: p?.noId ?? '-',
    telefon: p?.telefon ?? '-',
    email: p?.email ?? '-',
    alamat: p?.alamat ?? '-',
    statusHousehold: p?.statusHousehold ?? '-', // Add fallback
    statusIndividu: p?.statusIndividu ?? '-',   // Add fallback
    statusMultidimensi: p?.statusMultidimensi ?? '-', // Add fallback
  }
})

const breadcrumb = ref([
  { name: 'Pengurusan Bantuan', type: 'link', path: '/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/pelulus' },
  { name: 'Tuntutan', type: 'link', path: '/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/pelulus' },
  { name: 'Senarai Tuntutan', type: 'link', path: '/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/pelulus' },
  { name: 'Kelulusan Tuntutan', type: 'current', path: `/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/pelulus/${paramId.value}/semak-kelulusan` },
])

const currentUser = computed(() => ({ name: row.value?.pegawaiETD || '-', role: 'Pelulus' }))

const statusOptions = [ { label: 'Lulus', value: 'Lulus' }, { label: 'Tidak Lulus', value: 'Tidak Lulus' } ]
const form = ref<{ keputusan: 'Lulus' | 'Tidak Lulus' | ''; catatan: string }>({ keputusan: '', catatan: '' })

const isSubmitting = ref(false)
const showConfirmationModal = ref(false)

const banner = ref<{ visible: boolean; type: 'save' | 'send' | '' }>({ visible: false, type: '' })
function showBanner(type: 'save' | 'send') {
  banner.value = { visible: true, type }
  setTimeout(() => (banner.value.visible = false), 3500)
}

const formatNumber = (value: number) => new Intl.NumberFormat('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('ms-MY')
const today = computed(() => new Date().toLocaleDateString('ms-MY'))

const handleSave = async () => {
  if (!form.value.keputusan) return
  try {
    isSubmitting.value = true
    await new Promise((r) => setTimeout(r, 400))
    setDecision(paramId.value, form.value.keputusan as 'Lulus' | 'Tidak Lulus', form.value.catatan)

    // SweetAlert2 popup
    await $swal.fire({
      icon: 'success',
      title: 'Berjaya!',
      text: 'Permohanan Tuntutan telah berjaya "disemak/diluluskan"',
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleSubmit = () => { if (!form.value.keputusan) return; showConfirmationModal.value = true }

const handleConfirmSend = async () => {
  try {
    isSubmitting.value = true
    await new Promise((r) => setTimeout(r, 600))
    setDecision(paramId.value, form.value.keputusan as 'Lulus' | 'Tidak Lulus', form.value.catatan)

    // SweetAlert2 popup
    await $swal.fire({
      icon: 'success',
      title: 'Berjaya!',
      text: 'Permohanan Tuntutan telah berjaya "disemak/diluluskan"',
    })

    navigateTo('/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-pelulus')
  } finally {
    isSubmitting.value = false
    showConfirmationModal.value = false
  }
}

const handleCancel = () => navigateTo('/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-pelulus')

// ===== Local atoms (inline components) =====
// (Delete the entire FieldRow block if unused)
const FieldRow = defineComponent({
  name: 'FieldRow',
  props: { label: { type: String, required: true }, value: { type: [String, Number], required: true } },
  setup(props) {
    return () =>
      h('div', {}, [
        h('label', { class: 'block text-sm font-medium text-gray-700 mb-1' }, props.label),
        h('div', { class: 'text-gray-900' }, String(props.value)),
      ])
  },
})


const StatBox = defineComponent({
  name: 'StatBox',
  props: { title: { type: String, required: true }, value: { type: String, required: true }, classValue: { type: String, default: '' } },
  setup(props) {
    return () => h('div', { class: 'p-4 bg-gray-50 rounded-lg' }, [ h('div', { class: 'text-sm text-gray-500' }, props.title), h('div', { class: `text-lg font-semibold ${props.classValue}` }, props.value) ])
  },
})

const noInvois = computed(() => row.value?.noInvois ?? '-')
const catatanTambahan = computed(() => row.value?.catatanTambahan ?? '-')
const siasatan = computed<SiasatanInfoView>(() => row.value?.siasatan ?? {})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
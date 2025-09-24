<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="space-y-6">
      <h1 class="text-2xl font-semibold">Permohonan Tuntutan</h1>

      <!-- 3.1 Maklumat Pemohon -->
      <rs-card>
        <template #header><h2 class="text-xl font-semibold">Maklumat Pemohon</h2></template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label class="block text-sm font-medium text-gray-700 mb-1">Nama</label><p class="text-gray-900">{{ pemohon.nama }}</p></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-1">No. Kad Pengenalan / No. Vendor</label><p class="text-gray-900">{{ pemohon.noId }}</p></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-1">No. Telefon</label><p class="text-gray-900">{{ pemohon.noTelefon }}</p></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-1">Kategori Asnaf</label><p class="text-gray-900">{{ pemohon.kategoriAsnaf }}</p></div>
          </div>
        </template>
      </rs-card>

      <!-- 3.2 Maklumat Bantuan -->
      <rs-card>
        <template #header><h2 class="text-xl font-semibold">Maklumat Bantuan</h2></template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormKit type="select" label="No. Bantuan" :options="opsyenNoBantuan" v-model="bantuan.noBantuan" :disabled="true" />
            <FormKit type="select" label="No. GL" :options="opsyenNoGL" v-model="bantuan.noGL" :disabled="true" />
            <FormKit type="text" label="Aid" v-model="bantuan.aid" :disabled="true" />
            <FormKit type="text" label="Aid Product" v-model="bantuan.aidProduct" :disabled="true" />
            <FormKit type="text" label="Product Package" v-model="bantuan.productPackage" :disabled="true" />
            <FormKit type="text" label="Entitlement Product" v-model="bantuan.entitlementProduct" :disabled="true" />
          </div>
        </template>
      </rs-card>

      <!-- 3.3 Maklumat Tuntutan -->
      <rs-card>
        <template #header><h2 class="text-xl font-semibold">Maklumat Tuntutan</h2></template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormKit type="text" label="No. Invois" v-model="tuntutan.noInvois" :disabled="true" />
            <FormKit type="text" label="No. Invois Pelanggan" v-model="tuntutan.noInvoisPelanggan" :disabled="true" />
            <FormKit type="text" label="Tajuk" v-model="tuntutan.tajuk" :disabled="true" />
            <FormKit type="text" label="Tarikh" v-model="tuntutan.tarikh" :disabled="true" />
            <FormKit type="text" label="Catatan" v-model="tuntutan.catatan" :disabled="true" />
            <FormKit type="text" label="Penerima Bayaran" v-model="tuntutan.penerimaBayaran" :disabled="true" />
            <FormKit type="text" label="MOP" v-model="tuntutan.mop" :disabled="true" />
            <FormKit type="text" label="Nama Penerima" v-model="tuntutan.namaPenerima" :disabled="true" />
            <FormKit type="text" label="Bank" v-model="tuntutan.bank" :disabled="true" />
            <FormKit type="text" label="No. Akaun" v-model="tuntutan.noAkaun" :disabled="true" />
            <FormKit type="date" label="Tarikh Jangkaan Pembayaran" v-model="tuntutan.tarikhJangkaan" :disabled="true" />
            <FormKit type="text" label="Tarikh Dicipta" :value="formatDateTime(tuntutan.tarikhCipta)" :disabled="true" />
            <FormKit type="text" label="Amaun Tuntutan (RM)" :value="formatNumber(tuntutan.amaunRm)" :disabled="true" />
            <FormKit type="text" label="Amaun GL (RM)" :value="formatNumber(tuntutan.amaunGL)" :disabled="true" />
            <FormKit type="text" label="Baki Amaun (RM)" :value="formatNumber(tuntutan.bakiAmaun)" :disabled="true" />
          </div>
        </template>
      </rs-card>

      <!-- 3.4 Maklumat Dokumen Sokongan -->
      <rs-card>
        <template #header><h2 class="text-xl font-semibold">Maklumat Dokumen Sokongan</h2></template>
        <template #body>
          <div class="space-y-2">
            <div v-for="doc in dokumenSokongan" :key="doc.id" class="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span class="text-gray-900">{{ doc.nama }}</span>
              <div class="flex gap-2">
                <rs-button size="sm" variant="secondary" @click="viewDocument(doc)">Lihat</rs-button>
                <rs-button size="sm" variant="secondary" @click="downloadDocument(doc)">Muat Turun</rs-button>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- 3.5 Pengesahan Kaedah Siasatan -->
      <rs-card>
        <template #header><h2 class="text-xl font-semibold">Pengesahan Kaedah Siasatan</h2></template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormKit type="textarea" label="Catatan Penilaian Awal" v-model="penilaianAwal" :disabled="true" />

            <FormKit
              type="select"
              label="Kaedah Siasatan"
              placeholder="Sila pilih..."
              :options="KAEDAH_OPTIONS"
              v-model="form.kaedah"
              validation="required"
              :validation-messages="{ required: 'Sila pilih kaedah siasatan' }"
            />

            <FormKit
              v-if="isLapangan"
              type="date"
              label="Tarikh Lawatan"
              v-model="form.tarikhLawatan"
              :validation="validationTarikhLawatan"
              :validation-messages="{ required: 'Tarikh lawatan diperlukan' }"
            />

            <FormKit
              v-if="isLapangan"
              type="select"
              label="Masa Lawatan"
              v-model="form.masaLawatan"
              :options="masaSlots"
              :validation="validationMasaLawatan"
              :validation-messages="{ required: 'Masa lawatan diperlukan' }"
            />

            <!-- <FormKit
              type="textarea"
              label="Catatan"
              v-model="form.catatan"
              :validation="validationCatatan"
              :validation-messages="{ required: 'Catatan diperlukan jika Tidak Sokong' }"
            /> -->

            <div v-if="isLapangan">
              <label class="block text-sm font-medium text-gray-700 mb-1">Status Pengesahan Lawatan</label>
              <rs-badge :variant="statusLawatanVariant">{{ statusPengesahanLawatan }}</rs-badge>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- 3.6 Keputusan Siasatan -->
      <rs-card>
        <template #header><h2 class="text-xl font-semibold">Keputusan Siasatan</h2></template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormKit
              type="select"
              label="Status Sokongan"
              v-model="form.keputusan"
              :options="[
                { label: 'Sila Pilih...', value: '' },
                { label: 'Sokong', value: 'Sokong' },
                { label: 'Tidak Sokong', value: 'Tidak Sokong' },
              ]"
              validation="required"
              :validation-messages="{ required: 'Sila pilih status sokongan' }"
            />
            <FormKit type="textarea" label="Catatan" v-model="form.catatan" :validation="form.keputusan === 'Tidak Sokong' ? 'required' : ''" :validation-messages="{ required: 'Catatan diperlukan jika Tidak Sokong' }" />
            <FormKit type="text" label="Tarikh" :value="formatDate(form.tarikhKeputusan)" :disabled="true" />
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <rs-button :disabled="processing" :loading="processing" variant="primary-outline" @click="handleSimpan">Simpan</rs-button>
            <rs-button :disabled="processing || !canSubmit" :loading="processing" :variant="form.keputusan === 'Tidak Sokong' ? 'danger' : 'primary'" @click="handleSimpanHantar">
              Simpan &amp; Hantar
            </rs-button>
          </div>
        </template>
      </rs-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useNuxtApp, navigateTo } from '#app'

definePageMeta({ title: 'Permohonan Tuntutan (TDS-02_2)' })

/** ========== Local types ========== */
type Dokumen = { id: string; nama: string; url: string }
type TuntutanDetail = {
  noTuntutan: string
  pemohon: { nama: string; noId: string; noTelefon: string; kategoriAsnaf: string }
  bantuan: { noBantuan: string; noGL: string; aid: string; aidProduct: string; productPackage: string; entitlementProduct: string }
  tuntutan: {
    noInvois: string
    noInvoisPelanggan: string
    tajuk: string
    tarikh: string
    catatan: string
    penerimaBayaran: string
    mop: string
    namaPenerima: string
    bank: string
    noAkaun: string
    tarikhJangkaan: string
    tarikhCipta: string
    amaunRm: number
    amaunGL: number
    bakiAmaun: number
  }
  dokumenSokongan: Dokumen[]
}
type Kaedah = 'Semak Dokumen Sahaja' | 'Telefon' | 'Lapangan'
type Keputusan = 'Sokong' | 'Tidak Sokong'

/** ========== Inline seed details (local only to this file) ========== */
const detailsById: Record<string, TuntutanDetail> = {
  'TUN-2024-001': {
    noTuntutan: 'TUN-2024-001',
    pemohon: { nama: 'Ahmad bin Abdullah', noId: '800101-10-1111 / VND-9988', noTelefon: '012-3456789', kategoriAsnaf: 'Fakir' },
    bantuan: { noBantuan: 'B400', noGL: 'GL-001-2024', aid: 'BANTUAN PERALATAN INSTITUSI', aidProduct: 'KARPET MASJID', productPackage: 'PAKEJ KARPET HQ', entitlementProduct: 'ENTITLEMENT KARPET HQ' },
    tuntutan: { noInvois: 'INV-2024-001', noInvoisPelanggan: 'CUST-INV-7788', tajuk: 'Pembekalan Karpet', tarikh: '03/2024', catatan: '—', penerimaBayaran: 'Syarikat ABC Sdn Bhd', mop: 'EFT', namaPenerima: 'SYARIKAT ABC SDN BHD', bank: 'Maybank', noAkaun: '5123 4567 8910', tarikhJangkaan: '2025-08-15', tarikhCipta: new Date().toISOString(), amaunRm: 5000, amaunGL: 6000, bakiAmaun: 1000 },
    dokumenSokongan: [{ id: 'DOC-001', nama: 'GL_Report_2024.pdf', url: '/documents/gl_report.pdf' }, { id: 'DOC-002', nama: 'Invoice_Jan2024.pdf', url: '/documents/invoice.pdf' }],
  },
  'TUN-2024-002': {
    noTuntutan: 'TUN-2024-002',
    pemohon: { nama: 'Masjid Al-Hidayah', noId: 'VND-1122', noTelefon: '03-8888 1122', kategoriAsnaf: 'Fi Sabilillah' },
    bantuan: { noBantuan: 'B510', noGL: 'GL-002-2024', aid: 'BANTUAN PENAMBAHBAIKAN MASJID', aidProduct: 'KIPAS INDUSTRI', productPackage: 'PAKEJ KIPAS INDUSTRI X5', entitlementProduct: 'ENTITLEMENT PENAMBAHBAIKAN' },
    tuntutan: { noInvois: 'INV-2024-002', noInvoisPelanggan: 'CUST-INV-8899', tajuk: 'Pembekalan Kipas Industri', tarikh: '04/2024', catatan: 'Termasuk pemasangan.', penerimaBayaran: 'Syarikat Angin Sejuk Sdn Bhd', mop: 'EFT', namaPenerima: 'SYKT ANGIN SEJUK SDN BHD', bank: 'CIMB', noAkaun: '8600 2233 4455', tarikhJangkaan: '2025-09-20', tarikhCipta: new Date(Date.now() - 86400000).toISOString(), amaunRm: 8000, amaunGL: 8500, bakiAmaun: 500 },
    dokumenSokongan: [{ id: 'DOC-101', nama: 'Sebut_Harga_Kipas.pdf', url: '/documents/kipas_quote.pdf' }, { id: 'DOC-102', nama: 'GL_002_2024.pdf', url: '/documents/gl_002.pdf' }, { id: 'DOC-103', nama: 'Invoice_INV-2024-002.pdf', url: '/documents/inv_002.pdf' }],
  },
  'TUN-2024-003': {
    noTuntutan: 'TUN-2024-003',
    pemohon: { nama: 'PUSAT HEMODIALISIS PERMATA SDN. BHD.', noId: 'VND-2211', noTelefon: '03-7777 2211', kategoriAsnaf: 'Miskin' },
    bantuan: { noBantuan: 'B103', noGL: 'GL-003-2024', aid: 'BANTUAN PERUBATAN DIALISIS', aidProduct: 'HEMODIALISIS', productPackage: 'PAKEJ HEMODIALISIS DAN SUNTIKAN EPO', entitlementProduct: 'ENTITLEMENT HEMODIALISIS' },
    tuntutan: { noInvois: 'INV-2024-003', noInvoisPelanggan: 'CUST-INV-3344', tajuk: 'Pembekalan Peralatan Hemodialisis', tarikh: '04/2024', catatan: 'Termasuk pemasangan dan latihan.', penerimaBayaran: 'Pusat Hemodialisis Permata Sdn Bhd', mop: 'EFT', namaPenerima: 'PUSAT HEMODIALISIS PERMATA SDN BHD', bank: 'CIMB', noAkaun: '8001 2345 6789', tarikhJangkaan: '2025-07-10', tarikhCipta: new Date(Date.now() - 172800000).toISOString(), amaunRm: 12000, amaunGL: 12000, bakiAmaun: 0 },
    dokumenSokongan: [{ id: 'DOC-201', nama: 'GL_Dialisis_GL-003.pdf', url: '/documents/gl_dialisis_003.pdf' }, { id: 'DOC-202', nama: 'GL_003_2024.pdf', url: '/documents/gl_003.pdf' }, { id: 'DOC-203', nama: 'Invoice_Dialisis_INV-2024-003.pdf', url: '/documents/inv_dialisis_003.pdf' }],
  },
  'TUN-2024-004': {
    noTuntutan: 'TUN-2024-004',
    pemohon: { nama: 'Surau Kampung Baru', noId: 'VND-3344', noTelefon: '03-6666 3344', kategoriAsnaf: 'Fi Sabilillah' },
    bantuan: { noBantuan: 'B705', noGL: 'GL-004-2024', aid: 'BANTUAN PERALATAN SURAU', aidProduct: 'SISTEM PA', productPackage: 'PAKEJ PA SURAU', entitlementProduct: 'ENTITLEMENT PERALATAN' },
    tuntutan: { noInvois: 'INV-2024-004', noInvoisPelanggan: 'CUST-INV-5566', tajuk: 'Pembekalan Sistem PA', tarikh: '05/2024', catatan: 'Ujian bunyi selesai.', penerimaBayaran: 'Audio Harmoni Sdn Bhd', mop: 'EFT', namaPenerima: 'AUDIO HARMONI SDN BHD', bank: 'Bank Islam', noAkaun: '1200 5566 7788', tarikhJangkaan: '2025-06-30', tarikhCipta: new Date(Date.now() - 259200000).toISOString(), amaunRm: 3500, amaunGL: 4000, bakiAmaun: 500 },
    dokumenSokongan: [{ id: 'DOC-301', nama: 'GL_004_2024.pdf', url: '/documents/gl_004.pdf' }, { id: 'DOC-302', nama: 'Invoice_INV-2024-004.pdf', url: '/documents/inv_004.pdf' }, { id: 'DOC-303', nama: 'Picture_Setup_PA.jpg', url: '/documents/setup_pa.jpg' }],
  },
  'TUN-2024-005': {
    noTuntutan: 'TUN-2024-005',
    pemohon: { nama: 'Pusat Tahfiz Al-Quran', noId: 'VND-4455', noTelefon: '03-5555 4455', kategoriAsnaf: 'Fi Sabilillah' },
    bantuan: { noBantuan: 'B812', noGL: 'GL-005-2024', aid: 'BANTUAN PERALATAN ASRAMA', aidProduct: 'KATIL BERTERTIB', productPackage: 'PAKEJ KATIL BERTERTIB (20 UNIT)', entitlementProduct: 'ENTITLEMENT ASRAMA' },
    tuntutan: { noInvois: 'INV-2024-005', noInvoisPelanggan: 'CUST-INV-6677', tajuk: 'Pembekalan Katil Asrama', tarikh: '05/2024', catatan: '—', penerimaBayaran: 'Asrama Warna Sdn Bhd', mop: 'EFT', namaPenerima: 'ASRAMA WARNA SDN BHD', bank: 'Public Bank', noAkaun: '3333 7777 9999', tarikhJangkaan: '2025-10-05', tarikhCipta: new Date(Date.now() - 345600000).toISOString(), amaunRm: 15000, amaunGL: 15000, bakiAmaun: 0 },
    dokumenSokongan: [{ id: 'DOC-401', nama: 'GL_005_2024.pdf', url: '/documents/gl_005.pdf' }, { id: 'DOC-402', nama: 'Invoice_INV-2024-005.pdf', url: '/documents/inv_005.pdf' }, { id: 'DOC-403', nama: 'Sebut_Harga_Katil.pdf', url: '/documents/quote_katil.pdf' }],
  },
}

function getTuntutanDetail(noTuntutan: string): TuntutanDetail | null {
  const d = detailsById[noTuntutan]
  return d ? structuredClone(d) : null
}

/** ========== Page bootstrapping ========== */
const nuxtApp = useNuxtApp()
const $swal = nuxtApp.$swal as any
const route = useRoute()

const breadcrumb = ref([
  { name: 'Tuntutan', type: 'link', path: '/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad' },
  { name: 'Senarai Tuntutan', type: 'link', path: '/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad' },
  { name: 'Pengesahan', type: 'current', path: `/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad/${route.params.id}/pengesahan` },
])

const id = String(route.params.id || '')
const detail = getTuntutanDetail(id)
if (!detail) navigateTo('/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad')

const pemohon = ref(detail!.pemohon)
const bantuan = ref(detail!.bantuan)
const tuntutan = ref(detail!.tuntutan)
const dokumenSokongan = ref(detail!.dokumenSokongan)

/** ========== Form state ========== */
const form = ref<{
  kaedah: Kaedah | undefined
  tarikhLawatan: string
  masaLawatan: string
  keputusan: '' | Keputusan
  catatan: string
  tarikhKeputusan: string
}>({
  kaedah: undefined,
  tarikhLawatan: '',
  masaLawatan: '',
  keputusan: '',
  catatan: '',
  tarikhKeputusan: new Date().toISOString(),
})

const opsyenNoBantuan = computed(() => [{ label: bantuan.value.noBantuan || '—', value: bantuan.value.noBantuan || '' }])
const opsyenNoGL = computed(() => [{ label: bantuan.value.noGL || '—', value: bantuan.value.noGL || '' }])

const penilaianAwal = ref('Semakan awal dokumen oleh penyemak. Tiada isu kritikal ditemui.')

const KAEDAH_OPTIONS: { label: string; value: Kaedah }[] = [
  { label: 'Semak Dokumen Sahaja', value: 'Semak Dokumen Sahaja' },
  { label: 'Telefon', value: 'Telefon' },
  { label: 'Lapangan', value: 'Lapangan' },
]

const masaSlots: { label: string; value: string }[] = Array.from({ length: 48 }, (_, i) => {
  const hh = String(Math.floor(i / 2)).padStart(2, '0')
  const mm = i % 2 === 0 ? '00' : '30'
  const t = `${hh}:${mm}`
  return { label: t, value: t }
})

const isLapangan = computed<boolean>(() => form.value.kaedah === 'Lapangan')
const statusPengesahanLawatan = computed<string>(() => {
  if (!isLapangan.value) return '-'
  return (!!form.value.tarikhLawatan && !!form.value.masaLawatan) ? 'Sah' : 'Belum Sah'
})
const statusLawatanVariant = computed<'success' | 'warning' | 'secondary'>(() =>
  statusPengesahanLawatan.value === 'Sah' ? 'success' : statusPengesahanLawatan.value === 'Belum Sah' ? 'warning' : 'secondary'
)

const validationTarikhLawatan = computed<string>(() => (isLapangan.value ? 'required' : ''))
const validationMasaLawatan = computed<string>(() => (isLapangan.value ? 'required' : ''))
const validationCatatan = computed<string>(() => (form.value.keputusan === 'Tidak Sokong' ? 'required' : ''))

const canSubmit = computed<boolean>(() => {
  const kaedahOK = !!form.value.kaedah
  const lawatanOK = !isLapangan.value || (!!form.value.tarikhLawatan && !!form.value.masaLawatan)
  const keputusanOK = !!form.value.keputusan
  const catatanOK = form.value.keputusan !== 'Tidak Sokong' || form.value.catatan.trim().length > 0
  return kaedahOK && lawatanOK && keputusanOK && catatanOK
})

watch(() => form.value.kaedah, (v) => {
  if (v !== 'Lapangan') {
    form.value.tarikhLawatan = ''
    form.value.masaLawatan = ''
  }
})

/** ========== Utils ========== */
const formatDate = (d: string | number | Date) => new Date(d).toLocaleDateString('ms-MY')
const formatDateTime = (d: string | number | Date) => new Date(d).toLocaleString('ms-MY')
const formatNumber = (n: number) => new Intl.NumberFormat('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

const viewDocument = (doc: { url: string }) => window.open(doc.url, '_blank')
const downloadDocument = (doc: { url: string; nama: string }) => {
  const a = document.createElement('a')
  a.href = doc.url
  a.download = doc.nama
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

/** ========== Actions ========== */
const processing = ref(false)
const fakeDelay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const handleSimpan = async () => {
  try {
    processing.value = true
    await fakeDelay(600)
    await $swal.fire({ icon: 'success', title: 'Maklumat telah berjaya disimpan!', timer: 3000, showConfirmButton: false })
  } catch {
    await $swal.fire({ icon: 'error', title: 'Ralat', text: 'Gagal menyimpan maklumat.' })
  } finally {
    processing.value = false
  }
}

const handleSimpanHantar = async () => {
  if (!canSubmit.value) {
    await $swal.fire({
      icon: 'warning',
      title: 'Tidak Lengkap',
      text: 'Sila lengkapkan Kaedah/Butiran Lawatan (jika Lapangan) dan Keputusan.',
    })
    return
  }
  try {
    processing.value = true
    await fakeDelay(700)
    await $swal.fire({ icon: 'success', title: 'Maklumat telah berjaya dihantar!', timer: 3500, showConfirmButton: false })
    navigateTo('/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad')
  } catch {
    await $swal.fire({ icon: 'error', title: 'Ralat', text: 'Gagal menghantar maklumat.' })
  } finally {
    processing.value = false
  }
}
</script>

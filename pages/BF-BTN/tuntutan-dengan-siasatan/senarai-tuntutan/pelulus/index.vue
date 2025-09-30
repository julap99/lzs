<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Tuntutan</h2>
        </div>
      </template>

      <template #body>
        <!-- Main Table -->
        <rs-table
          :data="tableData"
          :columns="columns"
          :showNoColumn="true"
          :showSearch="true"
          :options="{ variant: 'default', hover: true, striped: true }"
          :options-advanced="{ sortable: true, filterable: true }"
          :show-filter="true"
          advanced
        >
          <!-- ID Permohonan: linkable -->
          <template #idPermohonan="{ text }">
            <a
              href="#" 
              class="text-primary-600 hover:text-primary-800" 
              @click.prevent="goSemak(String(text))"
              >
              {{ text }}
            </a>
          </template>

          <!-- Amaun Tuntutan -->
          <template #amaunTuntutan="{ text }">
            <div class="font-medium text-right">RM {{ formatNumber(Number(text)) }}</div>
          </template>

          <!-- Tarikh Permohonan -->
          <template #tarikhPermohonan="{ text }">
            <div>
              <div class="font-medium">{{ formatDate(String(text)) }}</div>
              <div class="text-sm text-gray-500">{{ formatTime(String(text)) }}</div>
            </div>
          </template>

          <!-- Status Kelulusan -->
          <template #statusKelulusan="{ text }">
            <rs-badge :variant="statusVariant(String(text))">{{ text || 'Belum Diputus' }}</rs-badge>
          </template>

          <!-- Tindakan -->
          <template #tindakan="{ value }">
            <div class="flex space-x-2">
              <rs-button
                variant="ghost"
                size="sm"
                class="!px-2 !py-1 text-blue-600 hover:text-blue-800"
                @click="goSemak(getAction(value).id)"
                title="Semak & Luluskan"
                aria-label="Semak & Luluskan"
              >
                <Icon name="material-symbols:fact-check-outline" class="w-5 h-5" />
              </rs-button>
            </div>
          </template>
        </rs-table>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-5 mt-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">Baris per halaman:</span>
            <FormKit
              v-model="pageSize"
              type="select"
              :options="[10, 25, 50]"
              :classes="{ wrapper: 'w-20', outer: 'mb-0', input: '!rounded-lg' }"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">
              Menunjukkan {{ paginationStart }} hingga {{ paginationEnd }} daripada {{ totalRows }} entri
            </span>
            <div class="flex gap-1">
              <rs-button
                variant="primary-outline"
                class="!p-1 !w-8 !h-8"
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                <Icon name="ic:round-keyboard-arrow-left" />
              </rs-button>
              <rs-button
                variant="primary-outline"
                class="!p-1 !w-8 !h-8"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                <Icon name="ic:round-keyboard-arrow-right" />
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({ title: 'Senarai Tuntutan Pelulus' })

/** ========= Types ========= */
type TableColumn = { key: string; label: string; sortable?: boolean }
type Dok = { name: string; url: string }
type Pemohon = { nama: string; noId: string; telefon: string; email: string; alamat: string }
type SiasatanInfo = {
  kaedah: 'Semak Dokumen Sahaja' | 'Telefon' | 'Lapangan'
  status: 'Sokong' | 'Tidak Sokong'
  catatan?: string
  tarikh?: string
}
type TuntutanItem = {
  id: string
  idPermohonan: string
  noGL: string
  noInvois?: string
  amaunTuntutan: number
  amaunGL: number
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
  siasatan?: SiasatanInfo
  statusKelulusan?: 'Lulus' | 'Tidak Lulus' | 'Belum Diputus'
}

/** ========= Inline seed data (kept in sync with semak-kelulusan.vue) ========= */
const createPemohonMock = (overrides: Partial<Pemohon> = {}): Pemohon => ({
  nama: '-', noId: '-', telefon: '-', email: '-', alamat: '-', ...overrides,
})

const items = ref<TuntutanItem[]>([
  {
    id: 'TDS-2024-001',
    idPermohonan: 'TDS-2024-001',
    noGL: 'GL-2024-001',
    noInvois: 'INV-2024-001',
    amaunTuntutan: 5000,
    amaunGL: 6000,
    tarikhPermohonan: '2024-03-20T09:30:00',
    pegawaiETD: 'Sarah binti Omar',
    statusGL: 'Lulus',
    tarikhPerkhidmatan: '2024-03-15T00:00:00',
    dokumenSokongan: [
      { name: 'GL_Report_2024.pdf', url: '#' },
      { name: 'Invoice_INV-2024-001.pdf', url: '#' },
    ],
    dokumenPerkhidmatan: [{ name: 'Surat Pengesahan Perkhidmatan.pdf', url: '#' }],
    lampiranLain: [{ name: 'Gambar Lokasi.jpg', url: '#' }],
    bantuanData: {
      kodBantuan: 'B400',
      jenisBantuan: '(HQ) BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA',
      bahanBantuan: '(HQ) BANTUAN SUMBANGAN PERALATAN INSTITUSI AGAMA',
      pakejBantuan: '(GL) (HQ) BANTUAN SUMBANGAN KARPET INSTITUSI AGAMA',
      kelayakanBantuan: '(GL) (HQ) BANTUAN SUMBANGAN KARPET INSTITUSI AGAMA',
    },
    pemohon: createPemohonMock({
      nama: 'Masjid As-Salam',
      noId: 'VND-10001',
      telefon: '03-1234 5678',
      email: 'admin@assalam.my',
      alamat: 'Lot 12, Jalan Masjid, 43000 Kajang, Selangor',
    }),
    siasatan: {
      kaedah: 'Semak Dokumen Sahaja',
      status: 'Sokong',
      catatan: 'Dokumen lengkap dan sah.',
      tarikh: '2024-03-18T10:00:00',
    },
    catatanTambahan: 'Pembelian karpet dewan solat utama.',
    statusKelulusan: 'Belum Diputus',
  },
  {
    id: 'TDS-2024-002',
    idPermohonan: 'TDS-2024-002',
    noGL: 'GL-2024-002',
    noInvois: 'INV-2024-145',
    amaunTuntutan: 3000,
    amaunGL: 2500,
    tarikhPermohonan: '2024-04-02T11:00:00',
    pegawaiETD: 'Ahmad Faiz',
    statusGL: 'Tidak Lulus',
    tarikhPerkhidmatan: '2024-03-29T00:00:00',
    dokumenSokongan: [{ name: 'Resit Pembelian.pdf', url: '#' }],
    dokumenPerkhidmatan: [],
    lampiranLain: [],
    bantuanData: {
      kodBantuan: 'B210',
      jenisBantuan: '(HQ) BANTUAN TUNAI KECEMASAN',
      bahanBantuan: '(HQ) BANTUAN WANG TUNAI',
      pakejBantuan: 'Pakej Tunai',
      kelayakanBantuan: 'Kecemasan - Maks RM2500',
    },
    pemohon: createPemohonMock({
      nama: 'Syarikat Berkat Niaga',
      noId: 'VND-20002',
      telefon: '012-345 6789',
      email: 'akaun@berkatniaga.com',
      alamat: 'No. 8, Jalan Perniagaan 3, 81200 Johor Bahru, Johor',
    }),
    siasatan: {
      kaedah: 'Telefon',
      status: 'Tidak Sokong',
      catatan: 'Amaun tuntutan melebihi amaun GL.',
      tarikh: '2024-04-01T16:30:00',
    },
    catatan: 'Amaun tuntutan melebihi amaun GL.',
    catatanTambahan: 'Kecemasan tidak dibuktikan mencukupi.',
    statusKelulusan: 'Tidak Lulus',
  },
  {
    id: 'TDS-2024-003',
    idPermohonan: 'TDS-2024-003',
    noGL: 'GL-2024-003',
    noInvois: 'INV-2024-223',
    amaunTuntutan: 2000,
    amaunGL: 2000,
    tarikhPermohonan: '2024-04-10T14:30:00',
    pegawaiETD: 'Noraini Zulkifli',
    statusGL: 'Lulus',
    tarikhPerkhidmatan: '2024-04-05T00:00:00',
    dokumenSokongan: [{ name: 'Invoice Barang.pdf', url: '#' }],
    dokumenPerkhidmatan: [{ name: 'Surat Syor.pdf', url: '#' }],
    lampiranLain: [],
    bantuanData: {
      kodBantuan: 'B330',
      jenisBantuan: '(HQ) BANTUAN BARANGAN KEGUNAAN HARIAN',
      bahanBantuan: 'BARANGAN DAPUR',
      pakejBantuan: 'Pakej Barangan RM2000',
      kelayakanBantuan: 'Isi Rumah',
    },
    pemohon: createPemohonMock({
      nama: 'Ali bin Ahmad',
      noId: '910101-14-5677',
      telefon: '013-888 1122',
      email: 'ali.ahmad@example.com',
      alamat: 'No. 21, Jalan Mawar 2, Taman Mawar, 40400 Shah Alam, Selangor',
    }),
    siasatan: {
      kaedah: 'Lapangan',
      status: 'Sokong',
      catatan: 'Lawatan lapangan: keadaan memerlukan.',
      tarikh: '2024-04-07T09:15:00',
    },
    catatan: 'Diluluskan penuh.',
    catatanTambahan: 'Barang dapur asas selama sebulan.',
    statusKelulusan: 'Lulus',
  },
  {
    id: 'TDS-2024-004',
    idPermohonan: 'TDS-2024-004',
    noGL: 'GL-2024-004',
    noInvois: 'INV-2024-417',
    amaunTuntutan: 8000,
    amaunGL: 10000,
    tarikhPermohonan: '2024-05-05T10:15:00',
    pegawaiETD: 'Mohd Yazid',
    statusGL: 'Lulus',
    tarikhPerkhidmatan: '2024-05-01T00:00:00',
    dokumenSokongan: [{ name: 'Quotation Peralatan.pdf', url: '#' }],
    dokumenPerkhidmatan: [{ name: 'Surat Pengesahan.pdf', url: '#' }],
    lampiranLain: [{ name: 'Gambar Lokasi.jpg', url: '#' }],
    bantuanData: {
      kodBantuan: 'B500',
      jenisBantuan: '(HQ) BANTUAN PEMBINAAN RUMAH',
      bahanBantuan: 'BAHAN BINAAN',
      pakejBantuan: 'Pakej Rumah Asnaf',
      kelayakanBantuan: 'Keluarga Asnaf Fakir Miskin',
    },
    pemohon: createPemohonMock({
      nama: 'Keluarga Pn. Zainab',
      noId: '800202-10-2233',
      telefon: '017-222 3344',
      email: 'zainab.keluarga@example.com',
      alamat: 'Kg. Seri Makmur, 27000 Jerantut, Pahang',
    }),
    siasatan: {
      kaedah: 'Lapangan',
      status: 'Sokong',
      catatan: 'Penilaian struktur asas memadai untuk bina baharu.',
      tarikh: '2024-05-03T15:45:00',
    },
    catatanTambahan: 'Permohonan bina semula ruang dapur.',
    statusKelulusan: 'Belum Diputus',
  },
  {
    id: 'TDS-2024-005',
    idPermohonan: 'TDS-2024-005',
    noGL: 'GL-2024-005',
    noInvois: 'INV-2024-590',
    amaunTuntutan: 1200,
    amaunGL: 1500,
    tarikhPermohonan: '2024-05-15T09:00:00',
    pegawaiETD: 'Siti Aminah',
    statusGL: 'Lulus',
    tarikhPerkhidmatan: '2024-05-12T00:00:00',
    dokumenSokongan: [],
    dokumenPerkhidmatan: [],
    lampiranLain: [],
    bantuanData: {
      kodBantuan: 'B110',
      jenisBantuan: '(HQ) BANTUAN PERUBATAN',
      bahanBantuan: 'RAWATAN KLINIK',
      pakejBantuan: 'Rawatan Kesihatan',
      kelayakanBantuan: 'Asnaf - Pesakit Kronik',
    },
    pemohon: createPemohonMock({
      nama: 'Klinik Kasih',
      noId: 'VND-30005',
      telefon: '03-7788 9090',
      email: 'akaun@klinikkasih.my',
      alamat: '19, Jalan Sehat, 46050 Petaling Jaya, Selangor',
    }),
    siasatan: {
      kaedah: 'Semak Dokumen Sahaja',
      status: 'Sokong',
      catatan: 'Bill rawatan disahkan.',
      tarikh: '2024-05-13T11:20:00',
    },
    catatanTambahan: 'Pesakit perlu rawatan susulan.',
    statusKelulusan: 'Belum Diputus',
  },
])

/** ========= Page ========= */
const breadcrumb = ref([
  { name: 'Pengurusan Bantuan', type: 'link', path: '/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/pelulus' },
  { name: 'Tuntutan', type: 'link', path: '/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/pelulus' },
  { name: 'Kelulusan Tuntutan', type: 'current', path: '/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/pelulus' },
])

/** Columns */
const columns: TableColumn[] = [
  { key: 'idPermohonan', label: 'No. Tuntutan', sortable: true },  // "ID Permohonan" changed to "No. Tuntutan"
  { key: 'noGL', label: 'No. GL', sortable: true },
  { key: 'maklumatBantuan', label: 'Maklumat Bantuan', sortable: true },
  { key: 'pegawaiETD', label: 'Pegawai ETD/EOAD', sortable: true },
  { key: 'tarikhPermohonan', label: 'Tarikh Permohonan', sortable: true },
  { key: 'amaunTuntutan', label: 'Amaun Tuntutan (RM)', sortable: true },
  { key: 'statusKelulusan', label: 'Status', sortable: true },
  { key: 'tindakan', label: 'Tindakan', sortable: false },
]

/** Search + Pagination */
const searchQuery = ref<string>('')
const pageSize = ref<number>(10)
const currentPage = ref<number>(1)

type Row = {
  id: string
  idPermohonan: string
  noGL: string
  maklumatBantuan: string
  pegawaiETD: string
  tarikhPermohonan: string
  amaunTuntutan: number
  statusKelulusan: string
  tindakan: { id: string }
}

/** Map to table rows */
const baseRows = computed<Row[]>(() =>
  items.value.map((x: TuntutanItem): Row => ({
    id: x.id,
    idPermohonan: x.idPermohonan,
    noGL: x.noGL,
    maklumatBantuan: x.bantuanData?.jenisBantuan || '-',
    pegawaiETD: x.pegawaiETD,
    tarikhPermohonan: x.tarikhPermohonan,
    amaunTuntutan: x.amaunTuntutan,
    statusKelulusan: x.statusKelulusan ?? 'Belum Diputus',
    tindakan: { id: x.id },
  }))
)

/** Filter */
const filteredRows = computed<Row[]>(() => {
  if (!searchQuery.value) return baseRows.value
  const q = searchQuery.value.toLowerCase()
  return baseRows.value.filter((r: Row) =>
    r.idPermohonan.toLowerCase().includes(q) ||
    r.noGL.toLowerCase().includes(q) ||
    r.pegawaiETD.toLowerCase().includes(q)
  )
})

/** Pagination */
const totalRows = computed<number>(() => filteredRows.value.length)
const totalPages = computed<number>(() => Math.max(1, Math.ceil(totalRows.value / pageSize.value)))
const paginationStart = computed<number>(() => (currentPage.value - 1) * pageSize.value + 1)
const paginationEnd = computed<number>(() => Math.min(currentPage.value * pageSize.value, totalRows.value))

const tableData = computed<Row[]>(() =>
  filteredRows.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
)

/** Helpers */
const formatDate = (s: string) => new Date(s).toLocaleDateString('ms-MY')
const formatTime = (s: string) => new Date(s).toLocaleTimeString('ms-MY')
const formatNumber = (n: number) =>
  new Intl.NumberFormat('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(Number.isFinite(n) ? n : 0)

const statusVariant = (status?: string) => {
  if (status === 'Lulus') return 'success'
  if (status === 'Tidak Lulus') return 'danger'
  return 'warning'
}

/** Action normalizer */
const getAction = (v: unknown): { id: string } => {
  const anyV = v as any
  if (anyV?.id) return { id: String(anyV.id) }
  if (anyV?.tindakan?.id) return { id: String(anyV.tindakan.id) }
  return { id: '' }
}

const goSemak = (id: string) => {
  if (!id) return
  navigateTo(`/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/pelulus/${id}/semak-kelulusan`)
}
</script>

<style scoped>
/* optional styling hooks */
</style>

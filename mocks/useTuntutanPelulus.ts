// ~/mocks/useTuntutanPelulus.ts
import { ref, computed } from 'vue'

/** =========================
 *  Types used by semak-kelulusan.vue
 *  ======================= */
export type Dok = { name: string; url: string }

export type Pemohon = {
  nama: string
  noId: string        // IC / Vendor
  telefon: string
  email: string
  alamat: string
}

export type SiasatanInfo = {
  kaedah: 'Semak Dokumen Sahaja' | 'Telefon' | 'Lapangan'
  status: 'Sokong' | 'Tidak Sokong'
  catatan?: string
  tarikh?: string // ISO string
}

export type TuntutanItem = {
  id: string            // route id
  idPermohonan: string
  noGL: string
  /** NEW: Nombor Invoice (optional) */
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

  /** NEW: Ringkasan keputusan/nota permohonan */
  catatan?: string
  /** NEW: Catatan tambahan (3.3.5) */
  catatanTambahan?: string
  /** NEW: Hasil siasatan (3.5) */
  siasatan?: SiasatanInfo

  statusKelulusan?: 'Lulus' | 'Tidak Lulus' | 'Belum Diputus'
}

/** =========================
 *  Helpers (optional)
 *  ======================= */
export const pemohonMockTemplate: Pemohon = {
  nama: '-',
  noId: '-',
  telefon: '-',
  email: '-',
  alamat: '-',
}

export function createPemohonMock(overrides: Partial<Pemohon> = {}): Pemohon {
  return { ...pemohonMockTemplate, ...overrides }
}

export function toPemohonCardView(p: Pemohon) {
  return [
    { label: 'Nama', value: p.nama },
    { label: 'No. Kad Pengenalan / No. Vendor', value: p.noId },
    { label: 'No. Telefon', value: p.telefon },
    { label: 'E-mel', value: p.email },
    { label: 'Alamat', value: p.alamat },
  ]
}

/** =========================
 *  Seed Data (mocks)
 *  ======================= */
const _items = ref<TuntutanItem[]>([
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

/** =========================
 *  API (used by semak-kelulusan.vue)
 *  ======================= */
export function useTuntutanPelulus() {
  const list = computed(() => _items.value)

  const getById = (id: string) => _items.value.find((x) => x.id === id)

  const getPemohonById = (id: string) => getById(id)?.pemohon

  const getPemohonCardById = (id: string) => {
    const p = getPemohonById(id) ?? pemohonMockTemplate
    return toPemohonCardView(p)
  }

  function setDecision(id: string, keputusan: 'Lulus' | 'Tidak Lulus', catatan?: string) {
    const row = getById(id)
    if (row) {
      row.statusKelulusan = keputusan
      row.catatan = catatan ?? ''
    }
  }

  return {
    list,
    getById,
    setDecision,
    // pemohon helpers
    getPemohonById,
    getPemohonCardById,
    createPemohonMock,
  }
}

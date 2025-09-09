// ~/mocks/tuntutan.ts
export type TuntutanListItem = {
  noTuntutan: string
  noGL: string
  namaPemohon: string
  tarikhTuntutan: string
  amaunTuntutan: number
  statusPermohonan: 'Dalam Semakan' | 'Untuk Kelulusan' | 'Perlu Penambahbaikan' | 'Diluluskan' | 'Ditolak'
}

export type Dokumen = { id: string; nama: string; url: string }

export type TuntutanDetail = {
  noTuntutan: string
  pemohon: { nama: string; noId: string; noTelefon: string; kategoriAsnaf: string }
  bantuan: { noBantuan: string; noGL: string; aid: string; aidProduct: string; productPackage: string; entitlementProduct: string }
  tuntutan: {
    noInvois: string
    noInvoisPelanggan: string
    tajuk: string
    tahun: string
    catatan: string
    penerimaBayaran: string
    mop: string
    namaPenerima: string
    bank: string
    noAkaun: string
    tarikhJangkaan: string
    tarikhCipta: string
    amaunRm: number
  }
  dokumenSokongan: Dokumen[]
}

export const tuntutanList: TuntutanListItem[] = [
  {
    noTuntutan: 'TUN-2024-001',
    noGL: 'GL-001-2024',
    namaPemohon: 'Ahmad bin Abdullah',
    tarikhTuntutan: new Date().toISOString(),
    amaunTuntutan: 5000.0,
    statusPermohonan: 'Dalam Semakan',
  },
  {
    noTuntutan: 'TUN-2024-002',
    noGL: 'GL-002-2024',
    namaPemohon: 'Masjid Al-Hidayah',
    tarikhTuntutan: new Date(Date.now() - 86400000).toISOString(),
    amaunTuntutan: 8000.0,
    statusPermohonan: 'Dalam Semakan',
  },
  {
    noTuntutan: 'TUN-2024-003',
    noGL: 'GL-003-2024',
    namaPemohon: 'Sekolah Agama Rakyat Al-Amin',
    tarikhTuntutan: new Date(Date.now() - 172800000).toISOString(),
    amaunTuntutan: 12000.0,
    statusPermohonan: 'Dalam Semakan',
  },
  {
    noTuntutan: 'TUN-2024-004',
    noGL: 'GL-004-2024',
    namaPemohon: 'Surau Kampung Baru',
    tarikhTuntutan: new Date(Date.now() - 259200000).toISOString(),
    amaunTuntutan: 3500.0,
    statusPermohonan: 'Dalam Semakan',
  },
  {
    noTuntutan: 'TUN-2024-005',
    noGL: 'GL-005-2024',
    namaPemohon: 'Pusat Tahfiz Al-Quran',
    tarikhTuntutan: new Date(Date.now() - 345600000).toISOString(),
    amaunTuntutan: 15000.0,
    statusPermohonan: 'Dalam Semakan',
  },
]

// Optional: enrich details per noTuntutan
// Optional: enrich details per noTuntutan
const detailsById: Record<string, TuntutanDetail> = {
  'TUN-2024-001': {
    noTuntutan: 'TUN-2024-001',
    pemohon: {
      nama: 'Ahmad bin Abdullah',           // selari dengan senarai
      noId: '800101-10-1111 / VND-9988',
      noTelefon: '012-3456789',
      kategoriAsnaf: 'Fakir',
    },
    bantuan: {
      noBantuan: 'B400',
      noGL: 'GL-001-2024',
      aid: 'BANTUAN PERALATAN INSTITUSI',
      aidProduct: 'KARPET MASJID',
      productPackage: 'PAKEJ KARPET HQ',
      entitlementProduct: 'ENTITLEMENT KARPET HQ',
    },
    tuntutan: {
      noInvois: 'INV-2024-001',
      noInvoisPelanggan: 'CUST-INV-7788',
      tajuk: 'Pembekalan Karpet',
      tahun: '2024',
      catatan: '—',
      penerimaBayaran: 'Syarikat ABC Sdn Bhd',
      mop: 'EFT',
      namaPenerima: 'SYARIKAT ABC SDN BHD',
      bank: 'Maybank',
      noAkaun: '5123 4567 8910',
      tarikhJangkaan: '2025-08-15',
      tarikhCipta: new Date().toISOString(),
      amaunRm: 5000,
    },
    dokumenSokongan: [
      { id: 'DOC-001', nama: 'GL_Report_2024.pdf', url: '/documents/gl_report.pdf' },
      { id: 'DOC-002', nama: 'Invoice_Jan2024.pdf', url: '/documents/invoice.pdf' },
    ],
  },

  'TUN-2024-002': {
    noTuntutan: 'TUN-2024-002',
    pemohon: {
      nama: 'Masjid Al-Hidayah',
      noId: 'VND-1122',
      noTelefon: '03-8888 1122',
      kategoriAsnaf: 'Fi Sabilillah',
    },
    bantuan: {
      noBantuan: 'B510',
      noGL: 'GL-002-2024',
      aid: 'BANTUAN PENAMBAHBAIKAN MASJID',
      aidProduct: 'KIPAS INDUSTRI',
      productPackage: 'PAKEJ KIPAS INDUSTRI X5',
      entitlementProduct: 'ENTITLEMENT PENAMBAHBAIKAN',
    },
    tuntutan: {
      noInvois: 'INV-2024-002',
      noInvoisPelanggan: 'CUST-INV-8899',
      tajuk: 'Pembekalan Kipas Industri',
      tahun: '2024',
      catatan: 'Termasuk pemasangan.',
      penerimaBayaran: 'Syarikat Angin Sejuk Sdn Bhd',
      mop: 'EFT',
      namaPenerima: 'SYKT ANGIN SEJUK SDN BHD',
      bank: 'CIMB',
      noAkaun: '8600 2233 4455',
      tarikhJangkaan: '2025-09-20',
      tarikhCipta: new Date(Date.now() - 86400000).toISOString(),
      amaunRm: 8000,
    },
    dokumenSokongan: [
      { id: 'DOC-101', nama: 'Sebut_Harga_Kipas.pdf', url: '/documents/kipas_quote.pdf' },
      { id: 'DOC-102', nama: 'GL_002_2024.pdf', url: '/documents/gl_002.pdf' },
      { id: 'DOC-103', nama: 'Invoice_INV-2024-002.pdf', url: '/documents/inv_002.pdf' },
    ],
  },

  'TUN-2024-003': {
    noTuntutan: 'TUN-2024-003',
    pemohon: {
      nama: 'Sekolah Agama Rakyat Al-Amin',
      noId: 'VND-2211',
      noTelefon: '03-7777 2211',
      kategoriAsnaf: 'Miskin',
    },
    bantuan: {
      noBantuan: 'B620',
      noGL: 'GL-003-2024',
      aid: 'BANTUAN PENDIDIKAN',
      aidProduct: 'MEJA & KERUSI PELAJAR',
      productPackage: 'PAKEJ PERABOT KELAS (30 SET)',
      entitlementProduct: 'ENTITLEMENT PENDIDIKAN',
    },
    tuntutan: {
      noInvois: 'INV-2024-003',
      noInvoisPelanggan: 'CUST-INV-3344',
      tajuk: 'Pembekalan Meja & Kerusi Pelajar',
      tahun: '2024',
      catatan: 'Penghantaran siap.',
      penerimaBayaran: 'Pendidikan Maju Enterprise',
      mop: 'EFT',
      namaPenerima: 'PENDIDIKAN MAJU ENTERPRISE',
      bank: 'RHB',
      noAkaun: '2121 3344 5566',
      tarikhJangkaan: '2025-07-10',
      tarikhCipta: new Date(Date.now() - 172800000).toISOString(),
      amaunRm: 12000,
    },
    dokumenSokongan: [
      { id: 'DOC-201', nama: 'DO_AlAmin.pdf', url: '/documents/do_alamin.pdf' },
      { id: 'DOC-202', nama: 'GL_003_2024.pdf', url: '/documents/gl_003.pdf' },
      { id: 'DOC-203', nama: 'Invoice_INV-2024-003.pdf', url: '/documents/inv_003.pdf' },
    ],
  },

  'TUN-2024-004': {
    noTuntutan: 'TUN-2024-004',
    pemohon: {
      nama: 'Surau Kampung Baru',
      noId: 'VND-3344',
      noTelefon: '03-6666 3344',
      kategoriAsnaf: 'Fi Sabilillah',
    },
    bantuan: {
      noBantuan: 'B705',
      noGL: 'GL-004-2024',
      aid: 'BANTUAN PERALATAN SURAU',
      aidProduct: 'SISTEM PA',
      productPackage: 'PAKEJ PA SURAU',
      entitlementProduct: 'ENTITLEMENT PERALATAN',
    },
    tuntutan: {
      noInvois: 'INV-2024-004',
      noInvoisPelanggan: 'CUST-INV-5566',
      tajuk: 'Pembekalan Sistem PA',
      tahun: '2024',
      catatan: 'Ujian bunyi selesai.',
      penerimaBayaran: 'Audio Harmoni Sdn Bhd',
      mop: 'EFT',
      namaPenerima: 'AUDIO HARMONI SDN BHD',
      bank: 'Bank Islam',
      noAkaun: '1200 5566 7788',
      tarikhJangkaan: '2025-06-30',
      tarikhCipta: new Date(Date.now() - 259200000).toISOString(),
      amaunRm: 3500,
    },
    dokumenSokongan: [
      { id: 'DOC-301', nama: 'GL_004_2024.pdf', url: '/documents/gl_004.pdf' },
      { id: 'DOC-302', nama: 'Invoice_INV-2024-004.pdf', url: '/documents/inv_004.pdf' },
      { id: 'DOC-303', nama: 'Picture_Setup_PA.jpg', url: '/documents/setup_pa.jpg' },
    ],
  },

  'TUN-2024-005': {
    noTuntutan: 'TUN-2024-005',
    pemohon: {
      nama: 'Pusat Tahfiz Al-Quran',
      noId: 'VND-4455',
      noTelefon: '03-5555 4455',
      kategoriAsnaf: 'Fi Sabilillah',
    },
    bantuan: {
      noBantuan: 'B812',
      noGL: 'GL-005-2024',
      aid: 'BANTUAN PERALATAN ASRAMA',
      aidProduct: 'KATIL BERTERTIB',
      productPackage: 'PAKEJ KATIL BERTERTIB (20 UNIT)',
      entitlementProduct: 'ENTITLEMENT ASRAMA',
    },
    tuntutan: {
      noInvois: 'INV-2024-005',
      noInvoisPelanggan: 'CUST-INV-6677',
      tajuk: 'Pembekalan Katil Asrama',
      tahun: '2024',
      catatan: '—',
      penerimaBayaran: 'Asrama Warna Sdn Bhd',
      mop: 'EFT',
      namaPenerima: 'ASRAMA WARNA SDN BHD',
      bank: 'Public Bank',
      noAkaun: '3333 7777 9999',
      tarikhJangkaan: '2025-10-05',
      tarikhCipta: new Date(Date.now() - 345600000).toISOString(),
      amaunRm: 15000,
    },
    dokumenSokongan: [
      { id: 'DOC-401', nama: 'GL_005_2024.pdf', url: '/documents/gl_005.pdf' },
      { id: 'DOC-402', nama: 'Invoice_INV-2024-005.pdf', url: '/documents/inv_005.pdf' },
      { id: 'DOC-403', nama: 'Sebut_Harga_Katil.pdf', url: '/documents/quote_katil.pdf' },
    ],
  },
}


// Fallback detail generator using the list row if no specific detail is preseeded above
export function getTuntutanDetail(noTuntutan: string): TuntutanDetail | null {
  if (detailsById[noTuntutan]) return structuredClone(detailsById[noTuntutan])
  const row = tuntutanList.find((r) => r.noTuntutan === noTuntutan)
  if (!row) return null
  return {
    noTuntutan,
    pemohon: {
      nama: row.namaPemohon,
      noId: '—',
      noTelefon: '—',
      kategoriAsnaf: '—',
    },
    bantuan: {
      noBantuan: '—',
      noGL: row.noGL,
      aid: '—',
      aidProduct: '—',
      productPackage: '—',
      entitlementProduct: '—',
    },
    tuntutan: {
      noInvois: '—',
      noInvoisPelanggan: '—',
      tajuk: `Tuntutan ${noTuntutan}`,
      tahun: new Date(row.tarikhTuntutan).getFullYear().toString(),
      catatan: '—',
      penerimaBayaran: '—',
      mop: '—',
      namaPenerima: '—',
      bank: '—',
      noAkaun: '—',
      tarikhJangkaan: new Date().toISOString().slice(0, 10),
      tarikhCipta: row.tarikhTuntutan,
      amaunRm: row.amaunTuntutan,
    },
    dokumenSokongan: [],
  }
}

export function statusVariant(s: string) {
  const map: Record<string, string> = {
    'Dalam Semakan': 'warning',
    'Untuk Kelulusan': 'info',
    'Perlu Penambahbaikan': 'danger',
    Diluluskan: 'success',
    Ditolak: 'danger',
  }
  return map[s] || 'default'
}

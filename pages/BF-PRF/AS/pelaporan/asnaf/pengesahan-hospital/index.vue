<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <layouts-breadcrumb :items="breadcrumb" />

    <!-- CARD: Filter Carian -->
    <rs-card class="mt-4">
      <template #header>
        <h1 class="text-xl font-bold">Carian Surat Pengesahan Asnaf – Hospital</h1>
      </template>

      <template #body>
        <!-- Susunan 2x2: dua di atas (KP), dua di bawah (organisasi) -->
        <FormKit type="form" :actions="false" id="carianForm" @submit.prevent="onJanaSurat">
          <div class="grid gap-6 md:grid-cols-2">
            <!-- Baris atas -->
            <FormKit
              type="text"
              label="No. K/P Asnaf"
              v-model="filters.noKpAsnaf"
              :classes="fkClasses"
              placeholder="Masukkan No. K/P Asnaf"
            />
            <FormKit
              type="text"
              label="No. K/P Tanggungan"
              v-model="filters.noKpTanggungan"
              :classes="fkClasses"
              placeholder="Masukkan No. K/P Tanggungan"
            />

            <!-- Baris bawah -->
            <FormKit
              type="text"
              label="Nama Organisasi"
              v-model="filters.namaOrganisasi"
              :classes="fkClasses"
              placeholder="Contoh: Hospital Sungai Buloh"
            />
            <FormKit
              type="textarea"
              label="Alamat Organisasi"
              v-model="filters.alamatOrganisasi"
              :classes="fkClasses"
              placeholder="Contoh: Jalan Hospital, 47000 Sungai Buloh, Selangor"
            />
          </div>

          <!-- Actions -->
          <div class="mt-6 flex items-center gap-3 justify-end">
            <!-- Butang Reset -->
            <rs-button
              variant="secondary-outline"
              size="sm"
              class="!h-9 !px-4 !py-2 !text-sm !rounded-xl !leading-none align-middle"
              @click="onReset"
            >
              Reset
            </rs-button>

            <!-- Butang Jana Surat (mockup: tekan terus keluar surat) -->
            <rs-button
              variant="primary"
              size="sm"
              class="!h-9 !px-4 !py-2 !text-sm !rounded-xl !leading-none align-middle"
              @click="onJanaSurat"
            >
              Jana Surat
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- RESULTS CARD: Surat -->
    <rs-card v-if="showSurat" class="mt-4">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold">Surat Pengesahan Status Asnaf – Hospital</h1>
          <rs-button variant="primary" @click="downloadSuratTawaran">
            <Icon name="ic:baseline-download" class="w-4 h-4 mr-2" />
            Muat Turun PDF
          </rs-button>
        </div>
      </template>

      <template #body>
        <div id="print-surat-hospital-modal" class="space-y-6 font-serif text-sm leading-relaxed print-page">

          <!-- Report Header Section -->
          <rs-card class="mb-6">
            <template #body>
              <div class="space-y-4">
                <!-- Logo LZS -->
                <div class="flex justify-start">
                  <img
                    src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png"
                    alt="LZS Logo"
                    class="h-16"
                  />
                </div>
                <!-- Report Details -->
                <div class="space-y-2">
                  <p class="text-sm font-bold">RP0004</p>
                  <p class="text-lg font-semibold">Surat Pengesahan Asnaf – Hospital</p>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Kepala Surat -->
          <rs-card class="mb-6">
            <template #body>
              <div class="text-left space-y-1">
                <div class="text-sm"><span class="font-semibold">Rujukan kami: </span><span class="font-semibold">{{ noRujukan }}</span></div>
                <div class="text-sm"><span class="font-semibold">Tarikh: </span><span class="font-semibold">{{ formatDate(generatedAt) }}</span></div>
                <div class="text-sm"><span class="font-semibold">{{ formatDateHijri(generatedAt) }}</span></div>
                <p class="text-xl text-gray-700 mb-3 arabic">اَلسَلامُ عَلَيْكُم وَرَحْمَةُ اَللهِ وَبَرَكَاتُهُ‎</p>
              </div>

              <div class="mt-6 text-left space-y-1">
                <div class="font-bold text-base">{{ orgHeader.name }}</div>
                <div v-for="(ln, i) in orgHeader.address" :key="i" class="text-sm">{{ ln }}</div>
                <div class="text-sm mt-2">Tel: {{ orgHeader.tel }}</div>
                <div class="text-sm">Faks: {{ orgHeader.fax }}</div>
              </div>
            </template>
          </rs-card>

          <!-- Kandungan Surat -->
          <rs-card class="mb-6">
            <template #body>
              <div class="space-y-4 text-sm text-[rgb(var(--text-color))]">
                <div>Tuan/Puan,</div>

                <div class="border-b-2 border-gray-800 py-2">
                  <p class="font-semibold uppercase tracking-wide">
                    PENGESAHAN STATUS ASNAF FAKIR MISKIN DAN MUALLAF BAGI MENDAPAT PENGECUALIAN PEMBAYARAN CAJ RAWATAN HOSPITAL
                    DAN KEMUDAHAN RAWATAN PERUBATAN PESAKIT LUAR DAN WAD KELAS 3
                  </p>
                </div>

                <p>1. Semoga surat ini menemui tuan/puan di dalam kemanisan iman serta memperoleh rahmat daripada Allah s.w.t. Amin.</p>

                <p>
                  2. Adalah dimaklumkan bahawa penama di bawah adalah merupakan seorang penerima bantuan Asnaf Fakir Miskin
                  dan Muallaf Daerah <span class="font-semibold">{{ suratView.daerah }}</span>. Untuk makluman pihak tuan/puan,
                  Lembaga Zakat Selangor (MAIS) (selepas ini dirujuk sebagai “LZS”) diberi kuasa oleh Majlis Agama Islam Selangor
                  untuk mengagihkan wang zakat kepada asnaf fakir miskin dan muallaf di Negeri Selangor.
                </p>

                <div>Berikut adalah maklumat asnaf :</div>

                <table class="w-full border border-gray-800 text-sm table-fixed report-table">
                  <tbody>
                    <tr>
                      <td class="w-1/3 p-2 border-r border-gray-800 font-medium align-top">Nama Asnaf / Kad Pengenalan (Ketua Keluarga)</td>
                      <td class="w-1/2 p-2 border-r border-gray-800 align-top">{{ suratView.ketua.nama }}</td>
                      <td class="w-1/6 p-2 align-top">{{ suratView.ketua.ic }}</td>
                    </tr>
                    <tr>
                      <td class="p-2 border-t border-r border-gray-800 font-medium align-top">Nama Pesakit / Kad Pengenalan</td>
                      <td class="p-2 border-t border-r border-gray-800 align-top">{{ suratView.pesakit.nama }}</td>
                      <td class="p-2 border-t border-gray-800 align-top">{{ suratView.pesakit.ic }}</td>
                    </tr>
                    <tr>
                      <td class="p-2 border-t border-r border-gray-800 font-medium align-top">Alamat</td>
                      <td class="p-2 border-t border-gray-800 whitespace-pre-line align-top" colspan="2">
                        NO. 21, JALAN ARQWAN 4B, TAMAN DESA ULU YAM, 44300 BATANG KALI, SELANGOR DARUL EHSAN
                      </td>
                    </tr>
                    <tr>
                      <td class="p-2 border-t border-r border-gray-800 font-medium align-top">Tempoh Status Asnaf</td>
                      <td class="p-2 border-t border-gray-800 align-top font-semibold" colspan="2">{{ suratView.tempohAsnaf }}</td>
                    </tr>
                  </tbody>
                </table>

                <p>
                  3. Dengan ini segala hormatnya kami merujuk kepada <span class="font-semibold">Surat Pekeliling Bahagian Kewangan
                  (Unit Pengurusan Hasil) Bilangan 14 Tahun 2004</span> yang menyatakan bahawa golongan fakir dan miskin yang menerima
                  bantuan bulanan di bawah peruntukan zakat dari Majlis Agama Islam Negeri merupakan golongan yang sama tarafnya dengan
                  golongan yang mendapat bantuan Jabatan Kebajikan Masyarakat.
                </p>

                <p>
                  4. Oleh yang demikian, golongan fakir dan miskin yang menerima bantuan bulanan dari Majlis Agama Islam Negeri adalah
                  <span class="font-semibold">dikecualikan</span> daripada bayaran caj rawatan hospital dan kemudahan perubatan pesakit luar
                  dan wad Kelas 3 di mana-mana Hospital/Klinik Kesihatan seperti yang dinyatakan dalam surat Kementerian Kewangan
                  <span class="font-semibold">Bil. KPK(PS) 096/28/2793 Jld.3 Sk. 6/2004(3)</span> bertarikh 5 Mei 2004.
                </p>

                <p>
                  5. Sehubungan itu, adalah dihargai agar pihak tuan/puan dapat <span class="font-semibold">mengecualikan</span> bayaran caj rawatan hospital
                  dan kemudahan rawatan perubatan pesakit luar dan wad Kelas 3 kepada penerima bantuan zakat yang dinyatakan di atas.
                  Sebarang pertanyaan berkaitan perkara di atas, sila hubungi Talian Zakat Selangor 1-300-88-4343.
                </p>

                <div>6. Sekian, <span class="text-xl text-gray-700 arabic">وَالسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللَّهِ وَبَرَكَاتُهُ</span></div>

                <div class="text-center font-semibold">“MENERAJU PERUBAHAN”</div>
              </div>

              <!-- Tandatangan -->
              <div class="space-y-4 mt-6">
                <div class="font-bold">Yang benar,</div>
                <div class="font-bold">LEMBAGA ZAKAT SELANGOR (MAIS)</div>
                <div class="h-12"></div>
                <div class="font-semibold">MOHD AQMAL BIN JAIS</div>
                <div class="text-sm">Ketua Operasi Agihan Daerah {{ suratView.daerah }}</div>
              </div>
            </template>
          </rs-card>
        </div>
      </template>
    </rs-card>
  </div>
</template>


<script setup>
// Data & Functions for Filter & Surat Generation
import { ref, computed } from 'vue'

const breadcrumb = [
  { name: 'Pelaporan', type: 'link', path: '/BF-PRF/AS/pelaporan' },
  { name: 'Surat Pengesahan Hospital', type: 'link', path: '/BF-PRF/AS/pelaporan/asnaf/pengesahan-hospital' },
]

const filters = ref({
  noKpAsnaf: '',
  noKpTanggungan: '',
  namaOrganisasi: '',
  alamatOrganisasi: ''
})

const showSurat = ref(false)

const orgHeader = {
  name: "Hospital Sungai Buloh",
  address: [
    "Jalan Hospital,",
    "47000 Sungai Buloh, Selangor",
  ],
  tel: "+603-6145 4333",
  fax: "+603-6145 2233/2244"
}

const today = new Date()
const generatedAt = today
const noRujukan = `RP0004/${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}/1234`

function formatDate(date) {
  return new Date(date).toLocaleDateString('ms-MY', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatDateHijri(date) {
  const opts = { day: '2-digit', month: 'long', year: 'numeric' }
  try { return new Intl.DateTimeFormat('ms-MY-u-ca-islamic', opts).format(date) }
  catch { return new Intl.DateTimeFormat('en-u-ca-islamic', opts).format(date) }
}

const suratView = computed(() => ({
  daerah: "Hulu Selangor",
  ketua: { nama: "MUHAMMAD NASMI BIN MOHD NASIR", ic: "104271140061" },
  pesakit: { nama: "MUHAMMAD SHAARNAS ANAQI BIN MUHAMMAD NASMI", ic: "211107101507" },
  alamat: [
    "NO. 21,",
    "JALAN ARQWAN 4B",
    "TAMAN DESA ULU YAM",
    "44300 BATANG KALI",
    "SELANGOR DARUL EHSAN"
  ],
  tempohAsnaf: "ASNAF MISKIN TAHUN 2025",

  alamatJoin: function() { return this.alamat.join('\n') }
}))

function downloadSuratTawaran () {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  doc.text("Surat Pengesahan Asnaf – Hospital", 10, 10)
  doc.save('Surat_Pengesahan_Asnaf_Hospital.pdf')
}

const onJanaSurat = () => { showSurat.value = true }

const onReset = () => {
  filters.value.noKpAsnaf = ''
  filters.value.noKpTanggungan = ''
  filters.value.namaOrganisasi = ''
  filters.value.alamatOrganisasi = ''
  showSurat.value = false
}

/* FormKit classes */
const fkClasses = {
  outer: 'space-y-1',
  label: 'text-sm font-medium text-gray-900',
  inner: 'mt-1 rounded-xl border bg-white focus-within:ring-2 focus-within:ring-blue-500',
  input: 'w-full rounded-xl border-0 px-3 py-2 text-sm placeholder-gray-400 focus:outline-none',
  help: 'text-xs text-gray-500 mt-1',
  messages: 'text-xs text-red-600 mt-1',
}
</script>

<style>
.report-table { border-collapse: collapse; }
.report-table th, .report-table td { border: 1px solid #000; padding: 8px; vertical-align: top; }
.report-table th { font-weight: 700; color: #000; text-align: left; }
.arabic { font-family: "Amiri", "Scheherazade New", "Noto Naskh Arabic", serif; letter-spacing: 0; }
.print-page { max-width: 200mm; margin: 0 auto; }
</style>

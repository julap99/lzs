<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <layouts-breadcrumb :items="breadcrumb" />

    <!-- CARD: Filter Carian -->
    <rs-card class="mt-4">
      <template #header>
        <h1 class="text-xl font-bold">Carian Surat Pengesahan Asnaf</h1>
      </template>

      <template #body>
        <FormKit type="form" :actions="false" id="carianForm" @submit="onJanaSurat">
          <!-- 2 atas (KP), 2 bawah (Organisasi) -->
          <div class="grid gap-6 md:grid-cols-2">
            <!-- No. K/P Asnaf -->
            <FormKit
              type="text"
              label="No. K/P Asnaf"
              v-model="filters.noKpAsnaf"
              :classes="fkClasses"
              placeholder="Masukkan No. K/P Asnaf"
            />

            <!-- No. K/P Tanggungan -->
            <FormKit
              type="text"
              label="No. K/P Tanggungan"
              v-model="filters.noKpTanggungan"
              :classes="fkClasses"
              placeholder="Masukkan No. K/P Tanggungan"
            />

            <!-- Nama Organisasi -->
            <FormKit
              type="text"
              label="Nama Organisasi"
              v-model="filters.namaOrganisasi"
              :classes="fkClasses"
              placeholder="Contoh: Sekolah Menengah Kebangsaan SHAH ALAM"
            />

            <!-- Alamat Organisasi -->
            <FormKit
              type="textarea"
              label="Alamat Organisasi"
              v-model="filters.alamatOrganisasi"
              :classes="fkClasses"
              placeholder="Contoh: Jalan Pendidikan 1, 40000 Shah Alam, Selangor"
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

            <!-- Butang Jana Surat -->
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
          <h1 class="text-2xl font-bold">Surat Pengesahan Status Asnaf-Sekolah/IPT</h1>
          <rs-button variant="primary" @click="downloadSuratTawaran">
            <Icon name="ic:baseline-download" class="w-4 h-4 mr-2" />
            Muat Turun PDF
          </rs-button>
        </div>
      </template>

      <template #body>
        <div id="print-surat-modal" class="space-y-6 font-serif text-sm leading-relaxed print-page">

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
                  <p class="text-sm font-bold">RP0003</p>
                  <p class="text-lg font-semibold">Surat Pengesahan Asnaf - Sekolah/IPT</p>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Kepala Surat -->
          <rs-card class="mb-6">
            <template #body>
              <div class="text-left space-y-1">
                <div class="text-sm">
                  <span class="font-semibold">Rujukan kami: </span>
                  <span class="font-semibold">{{ noRujukan }}</span>
                </div>
                <div class="text-sm">
                  <span class="font-semibold">Tarikh: </span>
                  <span class="font-semibold">{{ formatDate(generatedAt) }}</span>
                </div>
                <div class="text-sm">
                  <span class="font-semibold">{{ formatDateHijri(generatedAt) }}</span>
                </div>
                <p class="text-xl text-gray-700 mb-3 arabic">
                  اَلسَلامُ عَلَيْكُم وَرَحْمَةُ اَللهِ وَبَرَكاتُهُ‎
                </p>
              </div>
            </template>
          </rs-card>

          <!-- Surat Body -->
          <rs-card class="mb-6">
            <template #body>
              <div class="space-y-4 text-sm text-[rgb(var(--text-color))]">
                <div>Tuan/Puan,</div>

                <div class="border-b-2 border-gray-800 py-2">
                  <p class="font-semibold uppercase tracking-wide">
                    PENGESAHAN STATUS ASNAF FAKIR MISKIN DAN MUALLAF DI BAWAH BANTUAN LEMBAGA ZAKAT SELANGOR (MAIS)
                  </p>
                </div>

                <p>
                  Semoga surat ini menemui tuan/puan di dalam kemanisan iman serta memperoleh rahmat daripada Allah s.w.t. Amin.
                </p>

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
                      <td class="w-1/3 p-2 border-r border-gray-800 font-medium align-top">
                        Nama Asnaf / Kad Pengenalan (Ketua Keluarga)
                      </td>
                      <td class="w-1/2 p-2 border-r border-gray-800 align-top">AHMAD SUFI BIN ZAKARIA</td>
                      <td class="w-1/6 p-2 align-top">800701146041</td>
                    </tr>
                    <tr>
                      <td class="p-2 border-t border-r border-gray-800 font-medium align-top">
                        Nama Tanggungan / Kad Pengenalan
                      </td>
                      <td class="p-2 border-t border-r border-gray-800 whitespace-pre-line align-top">
                        SYADIATUL ALYA BINTI AHMAD SUFI
                      </td>
                      <td class="p-2 border-t border-gray-800 whitespace-pre-line align-top">
                        070122101672
                      </td>
                    </tr>
                    <tr>
                      <td class="p-2 border-t border-r border-gray-800 font-medium align-top">Alamat</td>
                      <td class="p-2 border-t border-gray-800 whitespace-pre-line align-top" colspan="2">
                        A-G-8, PANGSAPURI SERI KEMBANGAN, TAMAN TASIK TERATAI, 48200 SERENDAH, SELANGOR DARUL EHSAN
                      </td>
                    </tr>
                    <tr>
                      <td class="p-2 border-t border-r border-gray-800 font-medium align-top">Tempoh Status Asnaf</td>
                      <td class="p-2 border-t border-gray-800 align-top font-semibold" colspan="2">
                        ASNAF MISKIN TAHUN 2025
                      </td>
                    </tr>
                  </tbody>
                </table>

                <p>
                  3. Sehubungan itu, jika terdapat sebarang pertanyaan berkaitan perkara di atas, sila hubungi Talian Zakat Selangor
                  di talian 1-300-88-4343. Segala kerjasama yang diberikan dari pihak tuan/puan amat kami hargai dan diucapkan
                  ribuan terima kasih.
                </p>

                <div>
                  Sekian,
                  <span class="text-xl text-gray-700 arabic">اَلسَلامُ عَلَيْكُم وَرَحْمَةُ اَللهِ وَرَكاتُهُ‎</span>
                </div>

                <div class="text-center font-semibold">“MENERAJU PERUBAHAN”</div>
              </div>

              <div class="space-y-4 mt-6">
                <div class="font-bold">Yang benar,</div>
                <div class="font-bold">LEMBAGA ZAKAT SELANGOR (MAIS)</div>
                <div class="h-12"></div>
                <div class="font-semibold">MOHD AQMAL BIN JAIS</div>
                <div class="text-sm">Ketua Operasi Agihan Daerah Hulu Selangor</div>
              </div>
            </template>
          </rs-card>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { jsPDF } from 'jspdf'

// Data & Functions for Filter & Surat Generation
const breadcrumb = [
  { name: 'Pelaporan', type: 'link', path: '/BF-PRF/AS/pelaporan' },
  { name: 'Surat Pengesahan Asnaf Sekolah/IPT', type: 'current', path: '/BF-PRF/AS/pelaporan/asnaf/pengesahan-sekolah-ipt' },
]

const filters = ref({
  noKpAsnaf: '',
  noKpTanggungan: '',
  namaOrganisasi: '',
  alamatOrganisasi: ''
})

const showSurat = ref(false)

// Function for generating surat
const onJanaSurat = () => {
  showSurat.value = true
}

const suratView = computed(() => ({
  daerah: "Hulu Selangor",
}))

const today = new Date()
const generatedAt = today
const noRujukan = `RP0003/${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}/1234`

function formatDate(date) {
  return new Date(date).toLocaleDateString('ms-MY', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatDateHijri(date) {
  const opts = { day: '2-digit', month: 'long', year: 'numeric' }
  try { return new Intl.DateTimeFormat('ms-MY-u-ca-islamic', opts).format(date) }
  catch { return new Intl.DateTimeFormat('en-u-ca-islamic', opts).format(date) }
}

function downloadSuratTawaran () {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  doc.text("Surat Pengesahan Asnaf", 10, 10)
  doc.save('Surat_Pengesahan_Asnaf_Sekolah_IPT.pdf')
}

// Function for reset
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

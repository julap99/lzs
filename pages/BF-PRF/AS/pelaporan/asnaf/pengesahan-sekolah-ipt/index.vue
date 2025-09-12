<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

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

    <!-- Kepala Surat (auto ref no + dates) + Alamat LZS di kiri -->
    <rs-card class="mb-6">
      <template #body>
        <!-- Rujukan & Tarikh -->
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
          <p class="text-xl text-gray-700 mb-3">اَلسَلامُ عَلَيْكُم وَرَحْمَةُ اَللهِ وَبَرَكاتُهُ‎</p>
        </div>

        <!-- Alamat & Maklumat LZS -->
        <div class="mt-6 text-left space-y-1">
          <div class="font-bold text-base">{{ orgHeader.name }}</div>
          <div v-for="(ln, i) in orgHeader.address" :key="i" class="text-sm">
            {{ ln }}
          </div>
          <div class="text-sm mt-2">Tel: {{ orgHeader.tel }}</div>
          <div class="text-sm">Faks: {{ orgHeader.fax }}</div>
        </div>
      </template>
    </rs-card>

    <!-- Surat Body -->
    <rs-card class="mb-6">
      <template #body>
        <div class="space-y-4 text-sm text-[rgb(var(--text-color))]">

          <!-- Salam pembuka -->
          <div>Tuan/Puan,</div>

          <!-- Tajuk (garisan bawah sahaja) -->
          <div class="border-b-2 border-gray-800 py-2">
            <p class="font-semibold uppercase tracking-wide">
              PENGESAHAN STATUS ASNAF FAKIR MISKIN DAN MUALLAF DI BAWAH BANTUAN LEMBAGA ZAKAT SELANGOR (MAIS)
            </p>
          </div>

          <!-- Perenggan 1 -->
          <p>
            Semoga surat ini menemui tuan/puan di dalam kemanisan iman serta memperoleh rahmat daripada Allah s.w.t. Amin.
          </p>

          <!-- Perenggan 2 -->
          <p>
            2. Adalah dimaklumkan bahawa penama di bawah adalah merupakan seorang penerima bantuan Asnaf Fakir Miskin dan
            Muallaf Daerah <span class="font-semibold">{{ surat.daerah }}</span>. Untuk makluman pihak tuan/puan,
            Lembaga Zakat Selangor (MAIS) (selepas ini dirujuk sebagai “LZS”) diberi kuasa oleh Majlis Agama Islam
            Selangor untuk mengagihkan wang zakat kepada asnaf fakir miskin dan muallaf di Negeri Selangor.
          </p>

          <div>Berikut adalah maklumat asnaf :</div>

          <!-- Jadual Maklumat Asnaf -->
          <table class="w-full border border-gray-800 text-sm table-fixed">
            <tbody>
              <tr>
                <td class="w-1/3 p-2 border-r border-gray-800 font-medium align-top">
                  Nama Asnaf / Kad Pengenalan (Ketua Keluarga)
                </td>
                <td class="w-1/2 p-2 border-r border-gray-800 align-top">
                  {{ surat.ketua.nama }}
                </td>
                <td class="w-1/6 p-2 align-top">
                  {{ surat.ketua.ic }}
                </td>
              </tr>

              <tr>
                <td class="p-2 border-t border-r border-gray-800 font-medium align-top">
                  Nama Tanggungan / Kad Pengenalan
                </td>
                <td class="p-2 border-t border-r border-gray-800 whitespace-pre-line align-top">
                  {{ tanggunganNamaJoin }}
                </td>
                <td class="p-2 border-t border-gray-800 whitespace-pre-line align-top">
                  {{ tanggunganIcJoin }}
                </td>
              </tr>

              <!-- Alamat: penuh kanan -->
              <tr>
                <td class="p-2 border-t border-r border-gray-800 font-medium align-top">Alamat</td>
                <td class="p-2 border-t border-gray-800 whitespace-pre-line align-top" colspan="2">
                  {{ alamatJoin }}
                </td>
              </tr>

              <!-- Tempoh Status: penuh kanan -->
              <tr>
                <td class="p-2 border-t border-r border-gray-800 font-medium align-top">Tempoh Status Asnaf</td>
                <td class="p-2 border-t border-gray-800 align-top font-semibold" colspan="2">
                  {{ surat.tempohAsnaf }}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Perenggan 3 -->
          <p>
            3. Sehubungan itu, jika terdapat sebarang pertanyaan berkaitan perkara di atas, sila hubungi Talian Zakat Selangor
            di talian 1-300-88-4343. Segala kerjasama yang diberikan dari pihak tuan/puan amat kami hargai dan diucapkan ribuan terima kasih.
          </p>

          <!-- Penutup -->
          <div>
            Sekian, <span class="text-xl text-gray-700">اَلسَلامُ عَلَيْكُم وَرَحْمَةُ اَللهِ وَبَرَكاتُهُ‎</span>
          </div>

          <div class="text-center font-semibold">“MENERAJU PERUBAHAN”</div>

        </div>

        <!-- Tandatangan -->
        <div class="space-y-4 mt-6">
          <div class="font-bold">Yang benar,</div>
          <div class="font-bold">LEMBAGA ZAKAT SELANGOR (MAIS)</div>
          <div class="h-12"></div>
          <div class="font-semibold">MOHD AQMAL BIN JAIS</div>
          <div class="text-sm">Ketua Operasi Agihan Daerah Hulu Selangor</div>
        </div>
      </template>
    </rs-card>

    <!-- Modal -->
    <rs-modal v-model="showSurat" title="Surat Pengesahan Asnaf - Sekolah/IPT">
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button variant="secondary-outline" @click="showSurat = false">Tutup</rs-button>
          <rs-button variant="primary" @click="downloadSuratTawaran">
            <Icon name="ic:baseline-download" class="w-4 h-4 mr-2" />
            Muat Turun
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({ title: 'Surat Pengesahan Asnaf - Sekolah/IPT' })

const breadcrumb = [
  { name: 'Pelaporan', type: 'link', path: '/BF-PRF/AS/pelaporan' },
  { name: 'Surat Pengesahan Sekolah/IPT', type: 'link', path: '/BF-PRF/AS/pelaporan/asnaf/pengesahan-sekolah-ipt' },
]

// Alamat rasmi LZS
const orgHeader = {
  name: 'Lembaga Zakat Selangor (MAIS)',
  address: [
    'Menara Zakat Sultan Idris Shah,',
    'No. 1, Persiaran Bandar Raya, Seksyen 14,',
    '40000 Shah Alam, Selangor Darul Ehsan.',
  ],
  tel: '+603 8314 2222',
  fax: '+603 8314 2233/2244',
}

// Auto dates & reference number
const generatedAt = ref(new Date())
const noRujukan = ref(generateNoRujukan())

function formatDate(date) {
  return new Date(date).toLocaleDateString('ms-MY', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
function formatDateHijri(date) {
  const opts = { day: '2-digit', month: 'long', year: 'numeric' }
  try { return new Intl.DateTimeFormat('ms-MY-u-ca-islamic', opts).format(date) }
  catch { return new Intl.DateTimeFormat('en-u-ca-islamic', opts).format(date) }
}
function generateNoRujukan() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `RP0003/${yyyy}${mm}${dd}/${rand}`
}

// Data surat (boleh diganti dari API)
const surat = ref({
  daerah: 'Hulu Selangor',
  ketua: { nama: 'AHMAD SUFI BIN ZAKARIA', ic: '800701146041' },
  tanggungan: [
    { nama: 'SYADIATUL ALYA BINTI AHMAD SUFI', ic: '070122101672' },
  ],
  alamat: [
    'A-G-8',
    'PANGSAPURI SERI KEMBANGAN',
    'TAMAN TASIK TERATAI',
    '48200 SERENDAH',
    'SELANGOR DARUL EHSAN',
  ],
  tempohAsnaf: 'ASNAF MISKIN TAHUN 2025',
})

const tanggunganNamaJoin = computed(() =>
  surat.value.tanggungan.map(t => t.nama).join('\n')
)
const tanggunganIcJoin = computed(() =>
  surat.value.tanggungan.map(t => t.ic).join('\n')
)
const alamatJoin = computed(() => surat.value.alamat.join('\n'))

const showSurat = ref(false)
const downloadSuratTawaran = () => {
  alert('Muat turun Surat Pengesahan Asnaf - Sekolah/IPT...')
  showSurat.value = false
}
</script>

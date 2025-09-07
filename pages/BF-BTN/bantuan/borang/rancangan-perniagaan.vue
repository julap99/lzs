<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />
    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-semibold">Borang Rancangan Perniagaan</h1>
          <div class="flex gap-2">
            <rs-button variant="secondary-outline" @click="handlePrint">
              <Icon name="ph:printer" class="w-4 h-4 mr-1" /> Cetak
            </rs-button>
            <rs-button variant="primary" @click="handleSubmit">
              <Icon name="ph:check-circle" class="w-4 h-4 mr-1" /> Simpan
            </rs-button>
          </div>
        </div>
      </template>
      <template #body>
        <div class="p-6 space-y-8">
          <!-- 1. Tujuan Permohonan -->
          <section>
            <h3 class="font-semibold mb-3">1. Tujuan Permohonan</h3>
            <FormKit
              v-model="form.tujuanPermohonan"
              type="radio"
              :options="[
                { label: 'Bantuan Memulakan Perniagaan', value: 'mula' },
                { label: 'Bantuan Mengembangkan Perniagaan', value: 'kembang' }
              ]"
              :classes="radioClasses"
            />
          </section>

          <!-- 2. Jenis Perniagaan -->
          <section>
            <h3 class="font-semibold mb-3">2. Jenis Perniagaan</h3>
            <FormKit v-model="form.jenisPerniagaan" type="text" :classes="formkitClasses" placeholder="Contoh: Makanan & Minuman" />
          </section>

          <!-- 3. Maklumat Pengusaha -->
          <section>
            <h3 class="font-semibold mb-3">3. Maklumat Pengusaha (Jika berbeza daripada pemohon)</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit v-model="form.pengusaha.nama" type="text" label="Nama Pengusaha" :classes="formkitClasses" />
              <FormKit v-model="form.pengusaha.hubungan" type="text" label="Hubungan dengan Pemohon" :classes="formkitClasses" />
              <FormKit v-model="form.pengusaha.noKpBaru" type="text" label="No. Kad Pengenalan (Baru)" :classes="formkitClasses" />
              <FormKit v-model="form.pengusaha.noKpLama" type="text" label="No. Kad Pengenalan (Lama)" :classes="formkitClasses" />
            </div>
          </section>

          <!-- 4. Alamat Premis Perniagaan -->
          <section>
            <h3 class="font-semibold mb-3">4. Alamat Premis Perniagaan</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormKit v-model="form.alamatPremis.alamat" type="text" label="Alamat" :classes="formkitClasses" />
              <FormKit v-model="form.alamatPremis.poskod" type="text" label="Poskod" :classes="formkitClasses" />
              <FormKit v-model="form.alamatPremis.bandartaman" type="text" label="Bandar/Daerah" :classes="formkitClasses" />
            </div>
          </section>

          <!-- 5. Taraf Pendidikan Pengusaha -->
          <section>
            <h3 class="font-semibold mb-3">5. Taraf Pendidikan Pengusaha</h3>
            <FormKit
              v-model="form.tarafPendidikan"
              type="checkbox"
              :options="pilihanPendidikan"
              :classes="checkboxClasses"
            />
          </section>

          <!-- 6. Kemahiran -->
          <section>
            <h3 class="font-semibold mb-3">6. Kemahiran dalam Bidang Perniagaan</h3>
            <FormKit v-model="form.kemahiran" type="textarea" :classes="textareaClasses" rows="3" />
          </section>

          <!-- 7. Pengalaman -->
          <section>
            <h3 class="font-semibold mb-3">7. Pengalaman Perniagaan yang Dimiliki</h3>
            <FormKit v-model="form.pengalaman" type="textarea" :classes="textareaClasses" rows="3" />
          </section>

          <!-- 8. Kursus/Latihan -->
          <section>
            <h3 class="font-semibold mb-3">8. Kursus/Latihan Keusahawanan yang Pernah Dihadiri (Anjuran LZS dan Agensi Lain)</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full border border-gray-200 text-sm">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="border px-3 py-2 w-12 text-center">Bil</th>
                    <th class="border px-3 py-2">Tahun</th>
                    <th class="border px-3 py-2">Nama Kursus</th>
                    <th class="border px-3 py-2 w-48">Agensi</th>
                    <th class="border px-3 py-2 w-16 no-print">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(kursus, index) in form.kursus" :key="kursus.id">
                    <td class="border px-3 py-2 text-center">{{ index + 1 }}</td>
                    <td class="border px-3 py-2">
                      <FormKit v-model="kursus.tahun" type="number" :classes="inlineInputClasses" />
                    </td>
                    <td class="border px-3 py-2">
                      <FormKit v-model="kursus.nama" type="text" :classes="inlineInputClasses" />
                    </td>
                    <td class="border px-3 py-2">
                      <FormKit v-model="kursus.agensi" type="text" :classes="inlineInputClasses" />
                    </td>
                    <td class="border px-3 py-2 text-center no-print">
                      <rs-button size="sm" variant="danger-outline" @click="removeKursus(index)">Buang</rs-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="mt-3 no-print">
              <rs-button size="sm" variant="secondary-outline" @click="addKursus"><Icon name="ph:plus" class="w-4 h-4 mr-1" /> Tambah Kursus</rs-button>
            </div>
          </section>

          <!-- PEMASARAN -->
          <section>
            <div class="rounded-full border px-4 py-1 w-max mx-auto text-sm bg-gray-50">PEMASARAN</div>
            <div class="mt-4 space-y-6">
              <div>
                <h3 class="font-semibold mb-2">9. Sasaran Pelanggan (senaraikan secara terperinci)</h3>
                <FormKit v-model="form.sasaranPelanggan" type="textarea" :classes="textareaClasses" rows="4" />
              </div>
              <div>
                <h3 class="font-semibold mb-2">10. Pelanggan Sedia Ada</h3>
                <FormKit v-model="form.pelangganSediaAda" type="textarea" :classes="textareaClasses" rows="3" />
              </div>
              <div>
                <h3 class="font-semibold mb-2">11. Kekuatan/Kelebihan Perniagaan</h3>
                <FormKit v-model="form.kekuatan" type="textarea" :classes="textareaClasses" rows="3" />
              </div>
              <div>
                <h3 class="font-semibold mb-2">12. Kelemahan/Halangan Perniagaan</h3>
                <FormKit v-model="form.kelemahan" type="textarea" :classes="textareaClasses" rows="3" />
              </div>
            </div>
          </section>

          <!-- KEWANGAN -->
          <section>
            <div class="rounded-full border px-4 py-1 w-max mx-auto text-sm bg-gray-50">KEWANGAN</div>
            <!-- 13 -->
            <div class="mt-4">
              <h3 class="font-semibold mb-2">13. Hasil Pendapatan Sekarang - Harian/Bulanan (Jika Sedang Menjalankan Perniagaan)</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full border border-gray-200 text-sm">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="border px-3 py-2">Tempoh</th>
                      <th class="border px-3 py-2">Produk</th>
                      <th class="border px-3 py-2">Jualan Kuantiti</th>
                      <th class="border px-3 py-2">Jualan RM</th>
                      <th class="border px-3 py-2">Kos Kuantiti</th>
                      <th class="border px-3 py-2">Kos RM</th>
                      <th class="border px-3 py-2">Keuntungan (RM)</th>
                      <th class="border px-3 py-2 w-16 no-print">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, idx) in form.hasilSemasa" :key="row.id">
                      <td class="border px-3 py-2">
                        <FormKit v-model="row.tempoh" type="select" :options="tempohOptions" :classes="inlineInputClasses" />
                      </td>
                      <td class="border px-3 py-2">
                        <FormKit v-model="row.produk" type="text" :classes="inlineInputClasses" />
                      </td>
                      <td class="border px-3 py-2">
                        <FormKit v-model.number="row.jualanQty" type="number" :classes="inlineInputClasses" @input="recalc(row)" />
                      </td>
                      <td class="border px-3 py-2">
                        <FormKit v-model.number="row.jualanRm" type="number" step="0.01" :classes="inlineInputClasses" @input="recalc(row)" />
                      </td>
                      <td class="border px-3 py-2">
                        <FormKit v-model.number="row.kosQty" type="number" :classes="inlineInputClasses" @input="recalc(row)" />
                      </td>
                      <td class="border px-3 py-2">
                        <FormKit v-model.number="row.kosRm" type="number" step="0.01" :classes="inlineInputClasses" @input="recalc(row)" />
                      </td>
                      <td class="border px-3 py-2 text-right">{{ formatCurrency(row.keuntungan) }}</td>
                      <td class="border px-3 py-2 text-center no-print">
                        <rs-button size="sm" variant="danger-outline" @click="removeHasilSemasa(idx)">Buang</rs-button>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="bg-gray-50 font-semibold">
                      <td class="border px-3 py-2 text-right" colspan="6">Jumlah</td>
                      <td class="border px-3 py-2 text-right">{{ formatCurrency(totalKeuntunganSemasa) }}</td>
                      <td class="border px-3 py-2 no-print"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div class="mt-3 no-print">
                <rs-button size="sm" variant="secondary-outline" @click="addHasilSemasa"><Icon name="ph:plus" class="w-4 h-4 mr-1" /> Tambah Baris</rs-button>
              </div>
            </div>

            <!-- 14 -->
            <div class="mt-6">
              <h3 class="font-semibold mb-2">14. Anggaran Pendapatan yang bakal diperoleh (Jika Dibantu)</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full border border-gray-200 text-sm">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="border px-3 py-2">Tempoh</th>
                      <th class="border px-3 py-2">Produk</th>
                      <th class="border px-3 py-2">Jualan Kuantiti</th>
                      <th class="border px-3 py-2">Jualan RM</th>
                      <th class="border px-3 py-2">Kos Kuantiti</th>
                      <th class="border px-3 py-2">Kos RM</th>
                      <th class="border px-3 py-2">Keuntungan (RM)</th>
                      <th class="border px-3 py-2 w-16 no-print">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, idx) in form.hasilAnggaran" :key="row.id">
                      <td class="border px-3 py-2">
                        <FormKit v-model="row.tempoh" type="select" :options="tempohOptions" :classes="inlineInputClasses" />
                      </td>
                      <td class="border px-3 py-2">
                        <FormKit v-model="row.produk" type="text" :classes="inlineInputClasses" />
                      </td>
                      <td class="border px-3 py-2">
                        <FormKit v-model.number="row.jualanQty" type="number" :classes="inlineInputClasses" @input="recalc(row)" />
                      </td>
                      <td class="border px-3 py-2">
                        <FormKit v-model.number="row.jualanRm" type="number" step="0.01" :classes="inlineInputClasses" @input="recalc(row)" />
                      </td>
                      <td class="border px-3 py-2">
                        <FormKit v-model.number="row.kosQty" type="number" :classes="inlineInputClasses" @input="recalc(row)" />
                      </td>
                      <td class="border px-3 py-2">
                        <FormKit v-model.number="row.kosRm" type="number" step="0.01" :classes="inlineInputClasses" @input="recalc(row)" />
                      </td>
                      <td class="border px-3 py-2 text-right">{{ formatCurrency(row.keuntungan) }}</td>
                      <td class="border px-3 py-2 text-center no-print">
                        <rs-button size="sm" variant="danger-outline" @click="removeHasilAnggaran(idx)">Buang</rs-button>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="bg-gray-50 font-semibold">
                      <td class="border px-3 py-2 text-right" colspan="6">Jumlah</td>
                      <td class="border px-3 py-2 text-right">{{ formatCurrency(totalKeuntunganAnggaran) }}</td>
                      <td class="border px-3 py-2 no-print"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div class="mt-3 no-print">
                <rs-button size="sm" variant="secondary-outline" @click="addHasilAnggaran"><Icon name="ph:plus" class="w-4 h-4 mr-1" /> Tambah Baris</rs-button>
              </div>
            </div>
          </section>

          <!-- 15. Bentuk Bantuan -->
          <section>
            <h3 class="font-semibold mb-3">15. Bentuk Bantuan yang Diperlukan dan Kos yang Terlibat</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full border border-gray-200 text-sm">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="border px-3 py-2 w-12 text-center">Bil</th>
                    <th class="border px-3 py-2">Perkara dan Spesifikasi</th>
                    <th class="border px-3 py-2 w-40">Harga (RM)</th>
                    <th class="border px-3 py-2 w-16 no-print">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in form.bantuan" :key="item.id">
                    <td class="border px-3 py-2 text-center">{{ index + 1 }}</td>
                    <td class="border px-3 py-2">
                      <FormKit v-model="item.perkara" type="text" :classes="inlineInputClasses" />
                    </td>
                    <td class="border px-3 py-2">
                      <FormKit v-model.number="item.harga" type="number" step="0.01" :classes="inlineInputClasses" @input="noop" />
                    </td>
                    <td class="border px-3 py-2 text-center no-print">
                      <rs-button size="sm" variant="danger-outline" @click="removeBantuan(index)">Buang</rs-button>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="bg-gray-50 font-semibold">
                    <td class="border px-3 py-2 text-right" colspan="2">Jumlah (RM)</td>
                    <td class="border px-3 py-2 text-right">{{ formatCurrency(totalBantuan) }}</td>
                    <td class="border px-3 py-2 no-print"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div class="mt-3 no-print">
              <rs-button size="sm" variant="secondary-outline" @click="addBantuan"><Icon name="ph:plus" class="w-4 h-4 mr-1" /> Tambah Item</rs-button>
            </div>
            <p class="text-xs text-gray-500 mt-2">Sila berikan spesifikasi peralatan yang jelas beserta anggaran harga.</p>
          </section>

          <!-- 16. Pengesahan -->
          <section>
            <h3 class="font-semibold mb-3">16. Pengesahan</h3>
            <div class="space-y-3 text-sm leading-6">
              <p>
                Saya mengesahkan bahawa segala maklumat dan data Pemohon yang diberikan kepada LZS adalah <strong>BENAR, TEPAT, LENGKAP dan TERKINI</strong>.
                Saya telah bersetuju dengan Notis Privasi Zakat Selangor di
                <a href="https://www.zakatselangor.com.my" class="text-primary underline" target="_blank">www.zakatselangor.com.my</a>.
              </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormKit v-model="form.pengesahan.disediakanOleh" type="text" label="Disediakan oleh" :classes="formkitClasses" />
              <FormKit v-model="form.pengesahan.noKp" type="text" label="No. Kad Pengenalan" :classes="formkitClasses" />
              <FormKit v-model="form.pengesahan.tarikh" type="date" label="Tarikh" :classes="formkitClasses" />
              <FormKit v-model="form.pengesahan.tandatangan" type="text" label="Tandatangan" :classes="formkitClasses" />
            </div>
          </section>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default', middleware: 'auth' })
const breadcrumb = ref([
  { name: 'Bantuan', type: 'link', path: '/BF-BTN/bantuan' },
  { name: 'Borang', type: 'current', path: '/BF-BTN/bantuan/borang' },
  { name: 'Rancangan Perniagaan', type: 'current', path: '' }
])

const pilihanPendidikan = [
  { label: 'Tidak Bersekolah', value: 'tiada' },
  { label: 'Tamat Darjah Enam/UPSR', value: 'upsr' },
  { label: 'LCE/SRP/PMR', value: 'pmr' },
  { label: 'MCE/SPM/SPMV', value: 'spm' },
  { label: 'HSC/STP/STPM', value: 'stpm' },
  { label: 'Sijil Latihan/Sijil Kemahiran', value: 'sijil' },
  { label: 'Diploma', value: 'diploma' },
  { label: 'Ijazah', value: 'ijazah' },
  { label: 'Sarjana', value: 'sarjana' }
]

const tempohOptions = [
  { label: 'Sehari', value: 'sehari' },
  { label: 'Sebulan', value: 'sebulan' }
]

const form = reactive({
  tujuanPermohonan: 'mula',
  jenisPerniagaan: '',
  pengusaha: { nama: '', noKpBaru: '', noKpLama: '', hubungan: '' },
  alamatPremis: { alamat: '', poskod: '', bandartaman: '' },
  tarafPendidikan: [],
  kemahiran: '',
  pengalaman: '',
  kursus: [newKursus()],
  sasaranPelanggan: '',
  pelangganSediaAda: '',
  kekuatan: '',
  kelemahan: '',
  hasilSemasa: [newHasil()],
  hasilAnggaran: [newHasil()],
  bantuan: [newBantuan()],
  pengesahan: { disediakanOleh: '', noKp: '', tarikh: '', tandatangan: '' }
})

const formkitClasses = { outer: '', label: 'block text-sm font-medium text-gray-700 mb-1', input: '!rounded-lg !border-gray-300 !py-2', messages: 'text-xs text-red-600 mt-1' }
const radioClasses = { outer: '', legend: 'sr-only', options: 'flex flex-col md:flex-row gap-6', label: 'text-sm text-gray-700', input: '!rounded !border-gray-300' }
const checkboxClasses = { outer: '', legend: 'sr-only', options: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3', label: 'text-sm text-gray-700', input: '!rounded !border-gray-300' }
const textareaClasses = { outer: '', input: '!rounded-lg !border-gray-300 !py-2 min-h-[120px]' }
const inlineInputClasses = { outer: '', input: '!rounded-md !border-gray-300 !py-1 !text-sm w-full' }

function newKursus () { return { id: rid(), tahun: '', nama: '', agensi: '' } }
function newHasil () { return { id: rid(), tempoh: 'sehari', produk: '', jualanQty: 0, jualanRm: 0, kosQty: 0, kosRm: 0, keuntungan: 0 } }
function newBantuan () { return { id: rid(), perkara: '', harga: 0 } }
function rid () { try { return crypto.getRandomValues(new Uint32Array(1))[0].toString(36) } catch { return Math.random().toString(36).slice(2) } }

const addKursus = () => form.kursus.push(newKursus())
const removeKursus = (i) => form.kursus.splice(i, 1)
const addHasilSemasa = () => form.hasilSemasa.push(newHasil())
const removeHasilSemasa = (i) => form.hasilSemasa.splice(i, 1)
const addHasilAnggaran = () => form.hasilAnggaran.push(newHasil())
const removeHasilAnggaran = (i) => form.hasilAnggaran.splice(i, 1)
const addBantuan = () => form.bantuan.push(newBantuan())
const removeBantuan = (i) => form.bantuan.splice(i, 1)

const recalc = (row) => { const jualan = Number(row.jualanQty||0) * Number(row.jualanRm||0); const kos = Number(row.kosQty||0) * Number(row.kosRm||0); row.keuntungan = Math.max(0, jualan - kos) }

const totalKeuntunganSemasa = computed(() => form.hasilSemasa.reduce((s, r) => s + Number(r.keuntungan||0), 0))
const totalKeuntunganAnggaran = computed(() => form.hasilAnggaran.reduce((s, r) => s + Number(r.keuntungan||0), 0))
const totalBantuan = computed(() => form.bantuan.reduce((s, b) => s + Number(b.harga||0), 0))

const formatCurrency = (n) => (Number(n||0)).toLocaleString('ms-MY', { style: 'currency', currency: 'MYR' }).replace('MYR', 'RM')
const noop = () => {}
const handleSubmit = () => { console.log('Submit Rancangan Perniagaan:', JSON.parse(JSON.stringify(form))) }
const handlePrint = () => { window.print() }
</script>

<style lang="scss" scoped>
@media print { .no-print { display: none !important; } }
</style>

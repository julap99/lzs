<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-semibold">Borang Permohonan Pengangkutan Sekolah</h1>
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
          <!-- 1. Maklumat Pemohon -->
          <section>
            <h3 class="font-semibold mb-3">1. Maklumat Pemohon</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit v-model="form.pemohon.namaPenuh" type="text" label="Nama Penuh" :classes="formkitClasses" validation="required" />
              <FormKit v-model="form.pemohon.noKadPengenalan" type="text" label="No. Kad Pengenalan" :classes="formkitClasses" validation="required" />
              <FormKit v-model="form.pemohon.alamat" type="text" label="Alamat" :classes="formkitClasses" />
              <FormKit v-model="form.pemohon.noTelefon" type="text" label="No. Telefon" :classes="formkitClasses" />
            </div>
          </section>

          <!-- 2. Maklumat Pemandu/Pengusaha Bas Sekolah -->
          <section>
            <h3 class="font-semibold mb-3">2. Maklumat Pemandu/Pengusaha Bas Sekolah</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit v-model="form.pengusaha.namaPenuh" type="text" label="Nama Penuh/Nama Syarikat" :classes="formkitClasses" />
              <FormKit v-model="form.pengusaha.noKadPengenalan" type="text" label="No. Kad Pengenalan/No. Pendaftaran" :classes="formkitClasses" />
              <FormKit v-model="form.pengusaha.alamat" type="text" label="Alamat" :classes="formkitClasses" />
              <FormKit v-model="form.pengusaha.noTelefon" type="text" label="No. Telefon" :classes="formkitClasses" />
              <FormKit v-model="form.pengusaha.emel" type="email" label="E-mel" :classes="formkitClasses" />
              <FormKit v-model="form.pengusaha.namaBank" type="text" label="Nama Bank" :classes="formkitClasses" />
              <FormKit v-model="form.pengusaha.noAkaun" type="text" label="No. Akaun" :classes="formkitClasses" />
            </div>

            <!-- Akuan Konflik Kepentingan -->
            <div class="mt-6">
              <h4 class="font-semibold mb-3">Akuan Konflik Kepentingan</h4>
              <div class="mb-4">
                <p class="text-sm mb-2">Adakah anda mempunyai hubungan kekeluargaan dengan Kakitangan LZS?</p>
                <FormKit
                  v-model="form.pengusaha.hubunganKeluarga"
                  type="radio"
                  :options="[
                    { label: 'Ya', value: 'ya' },
                    { label: 'Tidak', value: 'tidak' }
                  ]"
                  :classes="radioClasses"
                />
              </div>
              
              <div v-if="form.pengusaha.hubunganKeluarga === 'ya'" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p class="text-sm text-yellow-800 mb-3">
                  <strong>Jika YA sila nyatakan seperti maklumat di bawah. Jika melebihi seorang, sila lampirkan borang tambahan.</strong>
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit v-model="form.pengusaha.kakitanganLZS.nama" type="text" label="Nama Kakitangan" :classes="formkitClasses" />
                  <FormKit v-model="form.pengusaha.kakitanganLZS.jawatan" type="text" label="Jawatan" :classes="formkitClasses" />
                  <FormKit v-model="form.pengusaha.kakitanganLZS.divisyen" type="text" label="Divisyen" :classes="formkitClasses" />
                  <FormKit v-model="form.pengusaha.kakitanganLZS.hubungan" type="text" label="Hubungan" :classes="formkitClasses" />
                </div>
              </div>
            </div>
          </section>

          <!-- 3. Maklumat Tanggungan dan Kadar Tambang -->
          <section>
            <h3 class="font-semibold mb-3">3. Maklumat Tanggungan dan Kadar Tambang</h3>
            <p class="text-sm text-gray-600 mb-4">(Boleh menggunakan helaian tambahan jika tidak mencukupi)</p>
            
            <div class="overflow-x-auto">
              <table class="min-w-full border border-gray-200 text-sm">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="border px-3 py-2 w-12 text-center">Bil</th>
                    <th class="border px-3 py-2">Butiran Tanggungan</th>
                    <th class="border px-3 py-2 w-48">Tandatangan & Cop Sek. Ren. Keb./Sek. Men. Keb.</th>
                    <th class="border px-3 py-2 w-48">Tandatangan & Cop Sek. Ren. Agama/KAFA</th>
                    <th class="border px-3 py-2 w-32">Kadar Tambang Sebulan (RM)</th>
                    <th class="border px-3 py-2 w-16 no-print">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(tanggungan, index) in form.tanggungan" :key="tanggungan.id">
                    <td class="border px-3 py-2 text-center">{{ index + 1 }}</td>
                    <td class="border px-3 py-2">
                      <div class="space-y-2">
                        <FormKit v-model="tanggungan.nama" type="text" placeholder="Nama" :classes="inlineInputClasses" />
                        <FormKit v-model="tanggungan.noKp" type="text" placeholder="No. KP/MyKid" :classes="inlineInputClasses" />
                        <FormKit v-model="tanggungan.tahunTingkatan" type="text" placeholder="Tahun/Tingkatan" :classes="inlineInputClasses" />
                      </div>
                    </td>
                    <td class="border px-3 py-2">
                      <FormKit v-model="tanggungan.copSekolahKebangsaan" type="text" placeholder="Tandatangan & Cop" :classes="inlineInputClasses" />
                    </td>
                    <td class="border px-3 py-2">
                      <FormKit v-model="tanggungan.copSekolahAgama" type="text" placeholder="Tandatangan & Cop" :classes="inlineInputClasses" />
                    </td>
                    <td class="border px-3 py-2">
                      <FormKit v-model.number="tanggungan.kadarTambang" type="number" step="0.01" placeholder="0.00" :classes="inlineInputClasses" @input="calculateTotal" />
                    </td>
                    <td class="border px-3 py-2 text-center no-print">
                      <rs-button size="sm" variant="danger-outline" @click="removeTanggungan(index)">Buang</rs-button>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="bg-gray-50 font-semibold">
                    <td class="border px-3 py-2 text-right" colspan="4">Jumlah (RM)</td>
                    <td class="border px-3 py-2 text-right">{{ formatCurrency(totalTambang) }}</td>
                    <td class="border px-3 py-2 no-print"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div class="mt-3 no-print">
              <rs-button size="sm" variant="secondary-outline" @click="addTanggungan">
                <Icon name="ph:plus" class="w-4 h-4 mr-1" /> Tambah Tanggungan
              </rs-button>
            </div>
          </section>

          <!-- Kebenaran Pemohon/Waris -->
          <section>
            <h3 class="font-semibold mb-3">Kebenaran Pemohon/Waris</h3>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p class="text-sm text-blue-800 leading-relaxed">
                Saya/Waris sedar bahawa perkhidmatan ini melibatkan risiko keselamatan pelajar tersebut. 
                Saya/Waris akan bertanggungjawab sepenuhnya ke atas risiko keselamatan dan saya/waris tidak akan mengambil sebarang tindakan jika sebarang kejadian yang tidak diingini berlaku.
              </p>
            </div>
          </section>

          <!-- Tanggungjawab Pemandu/Pengusaha Bas Sekolah -->
          <section>
            <h3 class="font-semibold mb-3">Tanggungjawab Pemandu/Pengusaha Bas Sekolah</h3>
            <div class="space-y-3 text-sm">
              <p>
                Pengusaha hendaklah mengembalikan semula lebihan caj perkhidmatan ke atas mana-mana penumpang yang tidak lagi menggunakan perkhidmatan.
              </p>
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p class="text-yellow-800">
                  <strong>Nota:</strong> Pihak LZS berhak membuat tuntutan kepada pengusaha sekiranya mendapati terdapat lebihan tambang pengangkutan sekolah bagi anak asnaf yang tidak lagi menggunakan perkhidmatan dengan pengusaha.
                </p>
              </div>
            </div>
          </section>

          <!-- Syarat-syarat Kelulusan LZS -->
          <section>
            <h3 class="font-semibold mb-3">Syarat-syarat Kelulusan LZS</h3>
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <p class="text-sm text-green-800">
                Tambang hendaklah mengikut kadar yang telah ditetapkan oleh LZS dan jika kadar tambang tersebut melebihi kadar yang ditetapkan, bakinya perlu ditanggung oleh pemohon.
              </p>
            </div>
          </section>

          <!-- Perakuan/Pengesahan -->
          <section>
            <h3 class="font-semibold mb-3">Perakuan/Pengesahan</h3>
            <div class="space-y-4">
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p class="text-sm leading-relaxed">
                  Saya mengesahkan bahawa segala maklumat dan data pemohon yang diberikan kepada LZS adalah 
                  <strong>BENAR, TEPAT, LENGKAP dan TERKINI</strong>. 
                  Saya telah bersetuju dengan Notis Privasi Zakat Selangor di 
                  <a href="https://www.zakatselangor.com.my" class="text-primary underline" target="_blank">www.zakatselangor.com.my</a>.
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Tandatangan Pemohon -->
                <div class="border border-gray-200 rounded-lg p-4">
                  <h4 class="font-semibold mb-3">Tandatangan dan Pengesahan Pemohon</h4>
                  <div class="space-y-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Tandatangan</label>
                      <div class="border-b border-gray-300 h-8"></div>
                    </div>
                    <FormKit v-model="form.pengesahanPemohon.tarikh" type="date" label="Tarikh" :classes="formkitClasses" />
                  </div>
                </div>

                <!-- Tandatangan Pengusaha -->
                <div class="border border-gray-200 rounded-lg p-4">
                  <h4 class="font-semibold mb-3">Tandatangan dan Pengesahan Pengusaha</h4>
                  <div class="space-y-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Tandatangan</label>
                      <div class="border-b border-gray-300 h-8"></div>
                    </div>
                    <FormKit v-model="form.pengesahanPengusaha.tarikh" type="date" label="Tarikh" :classes="formkitClasses" />
                  </div>
                </div>
              </div>
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
  { name: 'Permohonan Pengangkutan Sekolah', type: 'current', path: '' }
])

const form = reactive({
  pemohon: {
    namaPenuh: '',
    noKadPengenalan: '',
    alamat: '',
    noTelefon: ''
  },
  pengusaha: {
    namaPenuh: '',
    noKadPengenalan: '',
    alamat: '',
    noTelefon: '',
    emel: '',
    namaBank: '',
    noAkaun: '',
    hubunganKeluarga: 'tidak',
    kakitanganLZS: {
      nama: '',
      jawatan: '',
      divisyen: '',
      hubungan: ''
    }
  },
  tanggungan: [newTanggungan()],
  pengesahanPemohon: {
    tarikh: ''
  },
  pengesahanPengusaha: {
    tarikh: ''
  }
})

const formkitClasses = {
  outer: '',
  label: 'block text-sm font-medium text-gray-700 mb-1',
  input: '!rounded-lg !border-gray-300 !py-2',
  messages: 'text-xs text-red-600 mt-1'
}

const radioClasses = {
  outer: '',
  legend: 'sr-only',
  options: 'flex gap-6',
  label: 'text-sm text-gray-700',
  input: '!rounded !border-gray-300'
}

const inlineInputClasses = {
  outer: '',
  input: '!rounded-md !border-gray-300 !py-1 !text-sm w-full'
}

function newTanggungan() {
  return {
    id: rid(),
    nama: '',
    noKp: '',
    tahunTingkatan: '',
    copSekolahKebangsaan: '',
    copSekolahAgama: '',
    kadarTambang: 0
  }
}

function rid() {
  try {
    return crypto.getRandomValues(new Uint32Array(1))[0].toString(36)
  } catch {
    return Math.random().toString(36).slice(2)
  }
}

const addTanggungan = () => form.tanggungan.push(newTanggungan())
const removeTanggungan = (index) => form.tanggungan.splice(index, 1)

const totalTambang = computed(() => 
  form.tanggungan.reduce((total, tanggungan) => total + Number(tanggungan.kadarTambang || 0), 0)
)

const calculateTotal = () => {
  // Trigger reactivity for total calculation
  totalTambang.value
}

const formatCurrency = (n) => 
  (Number(n || 0)).toLocaleString('ms-MY', { 
    style: 'currency', 
    currency: 'MYR' 
  }).replace('MYR', 'RM')

const handleSubmit = () => {
  console.log('Submit Borang Permohonan Pengangkutan Sekolah:', JSON.parse(JSON.stringify(form)))
}

const handlePrint = () => {
  window.print()
}
</script>

<style lang="scss" scoped>
@media print {
  .no-print { 
    display: none !important; 
  }
}
</style>

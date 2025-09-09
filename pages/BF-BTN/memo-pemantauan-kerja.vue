<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />
    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-semibold">Memo Pemantauan Kerja</h1>
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
          <!-- Document Header Info -->
          <section class="bg-gray-50 p-4 rounded-lg">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-medium">NO. RUJUKAN DOKUMEN:</span> PRO/AZ/PKT-26
              </div>
              <div>
                <span class="font-medium">TERBITAN / TAHUN TERBITAN:</span> 4 (13 FEBRUARI 2017)
              </div>
              <div>
                <span class="font-medium">NO. PINDAAN / TAHUN:</span> 4/2025
              </div>
              <div>
                <span class="font-medium">TARIKH KUATKUASA:</span> 1 APRIL 2025
              </div>
              <div>
                <span class="font-medium">LAMPIRAN:</span> L5-MPK-4/2025
              </div>
            </div>
          </section>

          <!-- Peringatan Penting -->
          <section class="border-l-4 border-amber-400 bg-amber-50 p-4">
            <h3 class="font-semibold mb-2">Peringatan Penting</h3>
            <div class="text-sm space-y-2">
              <p>Memo ini tidak boleh dikeluarkan tanpa pemantauan tepat dilaksanakan dan jika terdapat sebarang kekurangan maka kerja kontraktork di lapak.</p>
              <p>Memo ini juga boleh digunakan sebagai sebarang arahan kerja, jika kekurangan yang perlu diamati lindalakan dan kontraktor.</p>
              <p>Penggunaan kontraktork memenuhi arahan di dalam memo ini boleh menyebabkan kontrak contractor direngsahkan/menaikan.</p>
              <p>Kontraktork dikehendaki menandatangani memo ini bagi penyelarahan penantauwan jika terdapat ketidakpuabhatan kerja di lapak.</p>
            </div>
          </section>

          <!-- Basic Information -->
          <section>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit v-model="form.kepada" type="text" label="KEPADA (Jika perlu)" :classes="formkitClasses" />
              <FormKit v-model="form.noTel" type="text" label="NO TEL" :classes="formkitClasses" />
              <FormKit v-model="form.tarikh" type="date" label="TARIKH" :classes="formkitClasses" />
              <FormKit v-model="form.pemohon" type="text" label="PEMOHON" :classes="formkitClasses" />
              <FormKit v-model="form.noWo" type="text" label="No WO" :classes="formkitClasses" />
              <FormKit v-model="form.tarikhSiasatan" type="date" label="TARIKH SIASATAN" :classes="formkitClasses" />
            </div>
          </section>

          <!-- A. Kategori Kerja yang Dilaksanakan -->
          <section>
            <h3 class="font-semibold mb-3">A. KATEGORI KERJA YANG DILAKSANAKAN</h3>
            <FormKit
              v-model="form.kategoriKerja"
              type="checkbox"
              :options="kategoriKerjaOptions"
              :classes="checkboxClasses"
            />
            <div class="mt-3">
              <FormKit v-model="form.kategoriKerjaLain" type="text" label="Lain-lain (sila nyatakan)" :classes="formkitClasses" />
            </div>
          </section>

          <!-- B. Catatan Ketidakpatuhan -->
          <section>
            <h3 class="font-semibold mb-3">B. CATATAN KETIDAKPATUHAN</h3>
            <FormKit v-model="form.catatanKetidakpatuhan" type="textarea" :classes="textareaClasses" rows="5" />
          </section>

          <!-- C. Tindakan Penambahbaikan / Penyelesaian -->
          <section>
            <h3 class="font-semibold mb-3">C. TINDAKAN PENAMBAHBAIKAN / PENYELESAIAN</h3>
            <FormKit
              v-model="form.tindakanPenyelesaian"
              type="checkbox"
              :options="tindakanOptions"
              :classes="checkboxClasses"
            />
            <div class="mt-3">
              <FormKit v-model="form.tindakanLain" type="text" label="Lain-lain (sila nyatakan)" :classes="formkitClasses" />
            </div>
          </section>

          <!-- D. Pengesahan Pembayaran -->
          <section>
            <h3 class="font-semibold mb-3">D. PENGESAHAN PEMBAYARAN</h3>
            <FormKit
              v-model="form.pengesahanPembayaran"
              type="checkbox"
              :options="pengesahanPembayaranOptions"
              :classes="checkboxClasses"
            />
            <div class="mt-3">
              <FormKit v-model="form.pengesahanLain" type="text" label="Lain-lain (sila nyatakan)" :classes="formkitClasses" />
            </div>
          </section>

          <!-- E. Adakah memo ini merupakan memo teguran? -->
          <section>
            <h3 class="font-semibold mb-3">E. ADAKAH MEMO INI MERUPAKAN MEMO TEGURAN?</h3>
            <FormKit
              v-model="form.memoTeguran"
              type="radio"
              :options="[
                { label: 'Ya', value: 'ya' },
                { label: 'Tidak', value: 'tidak' }
              ]"
              :classes="radioClasses"
            />
            <div class="mt-4 text-sm bg-blue-50 p-3 rounded-lg">
              <p><strong>PENTING</strong> - Sila rujuk Polisi Perlindungan Data Peribadi Kami ("Notis Privasi"). Dengan memberikan data peribadi anda serta menandatangani borang ini, anda menyatakan keberkahan dan persetujuan anda kepada kami terhadap terma-terma yang terkandung di dalam Notis tersebut. Notis tersebut boleh didapati di laman web kami di www.zakatselangor.com.my</p>
            </div>
          </section>

          <!-- F. Catatan Tambahan & Signatures -->
          <section>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 class="font-semibold mb-3">F. CATATAN TAMBAHAN:</h3>
                <FormKit v-model="form.catatanTambahan" type="textarea" :classes="textareaClasses" rows="8" />
              </div>
              <div class="space-y-6">
                <div>
                  <h4 class="font-medium mb-2">Dilaksanakan Oleh:</h4>
                  <div class="border border-gray-200 rounded-lg p-4 min-h-[100px] flex items-end justify-center text-sm text-gray-500">
                    (Tandatangan dan Cop Teknikal)
                  </div>
                </div>
                <div>
                  <h4 class="font-medium mb-2">Diterima Oleh (jika perlu):</h4>
                  <div class="border border-gray-200 rounded-lg p-4 min-h-[100px] flex items-end justify-center text-sm text-gray-500">
                    (Tandatangan dan Cop Kontraktor)
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
  { name: 'Memo Pemantauan Kerja', type: 'current', path: '' }
])

const kategoriKerjaOptions = [
  { label: 'Kerja-kerja tidak mengikut spesifikasi lukisan binaan.', value: 'spesifikasi' },
  { label: 'Kerja-kerja tidak memenuhi mutu yang ditetapkan.', value: 'mutu' },
  { label: 'Kerja-kerja gagal disempurnakan.', value: 'gagal' },
  { label: 'Kerja-kerja binaan berjalan seperti biasa.', value: 'biasa' },
  { label: 'Lain-lain (sila nyatakan)', value: 'lain' }
]

const tindakanOptions = [
  { label: 'Kerja-kerja pembaikan dalam masa 2 minggu', value: 'pembaikan_2minggu' },
  { label: 'Surat Jaminan Kontraktor dalam masa 1 minggu', value: 'surat_jaminan' },
  { label: 'Tiada arahan pembaikan yang perlu dijalankan', value: 'tiada_arahan' },
  { label: 'Lain-lain (sila nyatakan)', value: 'lain' }
]

const pengesahanPembayaranOptions = [
  { label: 'Pengesahan Pembayaran Sebahagian', value: 'sebahagian' },
  { label: 'Pengesahan Pembayaran dengan penahanan', value: 'penahanan' },
  { label: 'Pengesahan Pembayaran selepas kerja sempurna', value: 'sempurna' },
  { label: 'Lain-lain (sila nyatakan)', value: 'lain' }
]

const form = reactive({
  kepada: '',
  noTel: '',
  tarikh: '',
  pemohon: '',
  noWo: '',
  tarikhSiasatan: '',
  kategoriKerja: [],
  kategoriKerjaLain: '',
  catatanKetidakpatuhan: '',
  tindakanPenyelesaian: [],
  tindakanLain: '',
  pengesahanPembayaran: [],
  pengesahanLain: '',
  memoTeguran: '',
  catatanTambahan: ''
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
  options: 'flex flex-col md:flex-row gap-6',
  label: 'text-sm text-gray-700',
  input: '!rounded !border-gray-300'
}

const checkboxClasses = {
  outer: '',
  legend: 'sr-only',
  options: 'space-y-3',
  label: 'text-sm text-gray-700',
  input: '!rounded !border-gray-300'
}

const textareaClasses = {
  outer: '',
  input: '!rounded-lg !border-gray-300 !py-2 min-h-[120px]'
}

const handleSubmit = () => {
  console.log('Submit Memo Pemantauan Kerja:', JSON.parse(JSON.stringify(form)))
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

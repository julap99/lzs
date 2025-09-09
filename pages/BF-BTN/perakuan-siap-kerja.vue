<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />
    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-semibold">Perakuan Siap Kerja</h1>
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
                <span class="font-medium">LAMPIRAN:</span> L11- PSK-4/2025
              </div>
            </div>
          </section>

          <!-- Department Header -->
          <section class="text-center">
            <h2 class="text-lg font-semibold">JABATAN PENGURUSAN HARTANAH</h2>
            <div class="mt-2">
              <h3 class="text-lg font-semibold">PERAKUAN SIAP KERJA</h3>
              <p class="text-sm italic">CERTIFICATE OF PRACTICAL COMPLETION</p>
            </div>
          </section>

          <!-- Reference and Address Section -->
          <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <FormKit v-model="form.rujukan" type="text" label="Rujukan" :classes="formkitClasses" />
            </div>
            <div class="space-y-2">
              <div class="text-sm font-medium">
                Pejabat : Lembaga Zakat Selangor (MAIS)
              </div>
              <div class="text-sm">
                No.1, Persiaran Bandar Raya,<br>
                Seksyen 14,<br>
                40000 Shah Alam, Selangor.
              </div>
              <FormKit v-model="form.tarikh" type="date" label="Tarikh" :classes="formkitClasses" />
            </div>
          </section>

          <!-- Contractor Information -->
          <section>
            <div class="space-y-4">
              <FormKit v-model="form.kepada" type="textarea" label="Kepada" :classes="textareaClasses" rows="3" placeholder="Nama dan alamat kontraktor" />
              <FormKit v-model="form.berdaftarDalamKelas" type="text" label="Berdaftar dalam Kelas" :classes="formkitClasses" />
            </div>
          </section>

          <!-- Contract Information -->
          <section>
            <div class="space-y-4">
              <FormKit v-model="form.kontrakNo" type="text" label="Kontrak No. / WO No." :classes="formkitClasses" />
              <FormKit v-model="form.kontrakUntuk" type="textarea" label="Kontrak untuk" :classes="textareaClasses" rows="2" />
              <FormKit v-model="form.bahagian" type="text" label="Bahagian" :classes="formkitClasses" />
            </div>
          </section>

          <!-- Main Certificate Content -->
          <section class="bg-gray-50 p-6 rounded-lg">
            <div class="space-y-4 text-sm leading-relaxed">
              <p>
                Menurut Surat Setuju Terima (SST), dan tertakluk kepada penyiapan apa-apa kerja yang Belum disiapkan dan 
                pembaikan apa-apa kecacatan, ketidaksempurnaan, kesuaian atau apa-apa kerosakan lain apajuapun sebagaimana yang 
                dikehendaki didalam Surat Setuju Terima (SST) dan yang mungkin terzahir dalam Tempoh Tanggungan Kecacatan maka 
                adalah dengan ini diperakui bahawa seluruh Kerja-Kerja/ Sebahagian daripada Kerja-Kerja* seperti yang tersebut diatas 
                telah siap dengan memuaskan hati pada
              </p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit 
                  v-model="form.tarikhSiap" 
                  type="date" 
                  label="Tarikh Siap" 
                  :classes="formkitClasses" 
                />
                <FormKit 
                  v-model="form.masaPenyiapan" 
                  type="text" 
                  label="Masa Penyiapan" 
                  :classes="formkitClasses"
                  placeholder="cth: 2 bulan"
                />
              </div>

              <p class="mt-4">
                Tempoh Tanggungan Kecacatan untuk Kerja-Kerja / Sebahagian daripada Kerja- Kerja* tersebut bermula pada
              </p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit 
                  v-model="form.tarikhMulaTanggungan" 
                  type="date" 
                  label="Tarikh Mula Tanggungan" 
                  :classes="formkitClasses" 
                />
                <FormKit 
                  v-model="form.tarikhAkhirTanggungan" 
                  type="date" 
                  label="Dan akan berakhir pada" 
                  :classes="formkitClasses" 
                />
              </div>
            </div>
          </section>

          <!-- Signature Section -->
          <section class="mt-8">
            <div class="flex justify-end">
              <div class="w-full max-w-md">
                <div class="text-center mb-4">
                  <div class="border-b border-gray-300 pb-2 mb-2">
                    <span class="text-sm">LEMBAGA ZAKAT SELANGOR</span>
                  </div>
                </div>
                
                <div class="space-y-4">
                  <FormKit 
                    v-model="form.namaPenuh" 
                    type="text" 
                    label="Nama Penuh" 
                    :classes="formkitClasses" 
                  />
                  <div class="text-xs text-gray-500 italic text-center">Name in full</div>
                  
                  <FormKit 
                    v-model="form.namaJawatan" 
                    type="text" 
                    label="Nama Jawatan" 
                    :classes="formkitClasses" 
                  />
                  <div class="text-xs text-gray-500 italic text-center">Designation</div>
                </div>

                <!-- Signature area -->
                <div class="mt-6 border border-gray-200 rounded-lg p-4 min-h-[80px] flex items-end justify-center text-sm text-gray-500">
                  (Tandatangan dan Cop)
                </div>
              </div>
            </div>
          </section>

          <!-- Important Note -->
          <section class="text-xs text-gray-600 italic">
            <p>* Pilih mana-mana yang berkenaan</p>
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
  { name: 'Perakuan Siap Kerja', type: 'current', path: '' }
])

const form = reactive({
  rujukan: '',
  tarikh: '',
  kepada: '',
  berdaftarDalamKelas: '',
  kontrakNo: '',
  kontrakUntuk: 'CADANGAN UNTUK MEMBINA SEBUAH RUMAH KEDIAMAN 3 BILIK SERTA 3 BILIK AIR UNTUK TETUAN LEMBAGA ZAKAT SELANGOR.',
  bahagian: '',
  tarikhSiap: '',
  masaPenyiapan: '',
  tarikhMulaTanggungan: '',
  tarikhAkhirTanggungan: '',
  namaPenuh: '',
  namaJawatan: ''
})

const formkitClasses = {
  outer: '',
  label: 'block text-sm font-medium text-gray-700 mb-1',
  input: '!rounded-lg !border-gray-300 !py-2',
  messages: 'text-xs text-red-600 mt-1'
}

const textareaClasses = {
  outer: '',
  label: 'block text-sm font-medium text-gray-700 mb-1',
  input: '!rounded-lg !border-gray-300 !py-2 min-h-[80px]',
  messages: 'text-xs text-red-600 mt-1'
}

const handleSubmit = () => {
  console.log('Submit Perakuan Siap Kerja:', JSON.parse(JSON.stringify(form)))
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

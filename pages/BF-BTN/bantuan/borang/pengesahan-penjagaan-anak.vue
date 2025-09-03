<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-semibold">Borang Pengesahan Penjagaan Anak</h1>
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
        <div class="p-6 space-y-6">
          <!-- Syarat-syarat Jagaan -->
          <div class="bg-gray-50 border rounded-lg p-4 text-sm leading-6">
            <h3 class="font-semibold mb-2">Syarat-syarat Jagaan</h3>
            <ol class="list-decimal list-inside space-y-1">
              <li>Borang ini perlu diisi bagi mereka yang tidak mempunyai resit pembayaran penjagaan anak.</li>
              <li>Penjagaan anak ialah apa-apa usaha yang dilakukan untuk menjaga dan mengasuh anak kecil serta diberi upah.</li>
              <li>Tujuan penjagaan anak ialah bagi membolehkan ibu bapa/penjaga pergi bekerja dan mencari pendapatan keluarga.</li>
              <li>
                Asuhan kanak-kanak melibatkan:
                <ul class="list-disc list-inside ml-6 space-y-1">
                  <li>4.1 Taman/pusat asuhan institusi (swasta atau NGO);</li>
                  <li>4.2 Taman/pusat asuhan tempat kerja (inisiatif majikan);</li>
                  <li>4.3 Taman/pusat asuhan komuniti (bantuan kerajaan);</li>
                  <li>4.4 Taman/pusat asuhan di rumah (individu).</li>
                </ul>
              </li>
              <li>Penjagaan anak adalah bagi anak yang berumur 12 tahun ke bawah sahaja.</li>
            </ol>
          </div>

          <!-- A. Butiran Permohonan -->
          <div>
            <h3 class="font-semibold text-gray-900 mb-3">A. Butiran Permohonan</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                v-model="form.namaKetuaKeluarga"
                type="text"
                label="Nama Ketua Keluarga"
                :classes="formkitClasses"
                validation="required"
              />
              <FormKit
                v-model="form.noTelefon"
                type="text"
                label="No Telefon"
                :classes="formkitClasses"
              />
              <FormKit
                v-model="form.noKadPengenalan"
                type="text"
                label="No Kad Pengenalan"
                :classes="formkitClasses"
                validation="required"
              />
              <FormKit
                v-model="form.alamatKediaman"
                type="text"
                label="Alamat Kediaman"
                :classes="formkitClasses"
              />
            </div>
          </div>

          <!-- B. Butiran Pasangan -->
          <div>
            <h3 class="font-semibold text-gray-900 mb-3">B. Butiran Pasangan</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                v-model="form.namaPasangan"
                type="text"
                label="Nama Pasangan"
                :classes="formkitClasses"
              />
              <FormKit
                v-model="form.namaSyarikatPasangan"
                type="text"
                label="Nama dan Alamat Syarikat (Jika Pasangan Bekerja)"
                :classes="formkitClasses"
              />
              <FormKit
                v-model="form.noTelefonPasangan"
                type="text"
                label="No Telefon"
                :classes="formkitClasses"
              />
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status Pekerjaan</label>
                <div class="flex items-center gap-6">
                  <FormKit
                    v-model="form.statusPekerjaan"
                    type="radio"
                    :options="[
                      { label: 'Bekerja', value: 'bekerja' },
                      { label: 'Tidak Bekerja', value: 'tidak-bekerja' },
                    ]"
                    :classes="{ outer: '', fieldset: '', legend: 'sr-only', options: 'flex gap-6', option: '', label: 'text-sm text-gray-700', input: '!rounded !border-gray-300' }"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- C. Butiran Anak-anak -->
          <div>
            <h3 class="font-semibold text-gray-900 mb-3">C. Butiran Anak-anak</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full border border-gray-200 text-sm">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="border px-3 py-2 w-12 text-center">Bil</th>
                    <th class="border px-3 py-2">Nama Anak</th>
                    <th class="border px-3 py-2 w-24">Umur</th>
                    <th class="border px-3 py-2">Nama Taska/Tadika/Pengasuh-Rumah Individu (Nama, No KP & No Telefon)</th>
                    <th class="border px-3 py-2 w-40">Cop/Tandatangan</th>
                    <th class="border px-3 py-2 w-16 no-print">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(anak, index) in form.anakAnak" :key="anak.id">
                    <td class="border px-3 py-2 text-center">{{ index + 1 }}</td>
                    <td class="border px-3 py-2">
                      <FormKit v-model="anak.nama" type="text" :classes="inlineInputClasses" placeholder="Nama Anak" />
                    </td>
                    <td class="border px-3 py-2">
                      <FormKit v-model="anak.umur" type="number" :classes="inlineInputClasses" min="0" placeholder="Umur" />
                    </td>
                    <td class="border px-3 py-2">
                      <FormKit v-model="anak.maklumatPenjaga" type="text" :classes="inlineInputClasses" placeholder="Nama penjaga, No KP & telefon" />
                    </td>
                    <td class="border px-3 py-2">
                      <FormKit v-model="anak.tandatangan" type="text" :classes="inlineInputClasses" placeholder="Nama/Paraf" />
                    </td>
                    <td class="border px-3 py-2 text-center no-print">
                      <rs-button size="sm" variant="danger-outline" @click="removeRow(index)">Buang</rs-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="mt-3 no-print">
              <rs-button size="sm" variant="secondary-outline" @click="addRow">
                <Icon name="ph:plus" class="w-4 h-4 mr-1" /> Tambah Anak
              </rs-button>
              <p class="text-xs text-gray-500 mt-2">Sila gunakan lampiran tambahan jika ruangan tidak mencukupi.</p>
            </div>
          </div>

          <!-- D. Pengakuan Pemohon -->
          <div>
            <h3 class="font-semibold text-gray-900 mb-3">D. Pengakuan Pemohon</h3>
            <div class="space-y-4 text-sm leading-6">
              <p>
                Saya mengesahkan bahawa segala maklumat dan <strong>Data Pemohon</strong> yang diberikan kepada LZS adalah
                <strong>BENAR, TEPAT, LENGKAP dan TERKINI</strong>. Saya telah bersetuju dengan Notis Privasi Zakat Selangor di
                <a href="https://www.zakatselangor.com.my" target="_blank" class="text-primary underline">www.zakatselangor.com.my</a>.
              </p>
              <p>
                Saya faham dan bersetuju sekiranya saya memberi maklumat palsu dan tidak benar, pihak Lembaga Zakat Selangor berhak mengambil tindakan ke atas saya.
              </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormKit v-model="form.tarikhPengakuan" type="date" label="Tarikh" :classes="formkitClasses" />
              <FormKit v-model="form.tandatanganPemohon" type="text" label="Tandatangan" :classes="formkitClasses" />
            </div>
          </div>
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
  { name: 'Pengesahan Penjagaan Anak', type: 'current', path: '' }
])

const form = reactive({
  namaKetuaKeluarga: '',
  noTelefon: '',
  noKadPengenalan: '',
  alamatKediaman: '',
  namaPasangan: '',
  namaSyarikatPasangan: '',
  noTelefonPasangan: '',
  statusPekerjaan: 'bekerja',
  anakAnak: [
    { id: cryptoRandomId(), nama: '', umur: '', maklumatPenjaga: '', tandatangan: '' },
    { id: cryptoRandomId(), nama: '', umur: '', maklumatPenjaga: '', tandatangan: '' },
    { id: cryptoRandomId(), nama: '', umur: '', maklumatPenjaga: '', tandatangan: '' }
  ],
  tarikhPengakuan: '',
  tandatanganPemohon: ''
})

const formkitClasses = {
  outer: '',
  label: 'block text-sm font-medium text-gray-700 mb-1',
  input: '!rounded-lg !border-gray-300 !py-2',
  messages: 'text-xs text-red-600 mt-1'
}

const inlineInputClasses = {
  outer: '',
  input: '!rounded-md !border-gray-300 !py-1 !text-sm w-full'
}

const addRow = () => {
  form.anakAnak.push({ id: cryptoRandomId(), nama: '', umur: '', maklumatPenjaga: '', tandatangan: '' })
}

const removeRow = (index) => {
  form.anakAnak.splice(index, 1)
}

const handleSubmit = () => {
  // TODO integrate with backend when available
  console.log('Submit Borang Pengesahan Penjagaan Anak:', JSON.parse(JSON.stringify(form)))
}

const handlePrint = () => {
  window.print()
}

function cryptoRandomId () {
  try {
    return crypto.getRandomValues(new Uint32Array(1))[0].toString(36)
  } catch (_) {
    return Math.random().toString(36).slice(2)
  }
}
</script>

<style lang="scss" scoped>
@media print {
  .no-print { display: none !important; }
}
</style>

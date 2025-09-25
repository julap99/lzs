<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />


    <!-- Main Content Card -->
    <rs-card class="mt-4">
        <template #header>
          <h2 class="text-xl font-semibold">
            Semakan & Kelulusan (Manual Kuasa)
          </h2>
        </template>

        <template #body>
          <!-- Grid: main (left) + action (right) -->
          <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            <!-- LEFT: content sections -->
            <div class="space-y-6">
              <!-- 3.1 Maklumat Bantuan -->
              <rs-fieldset title="3.1 Maklumat Bantuan">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="text"
                    label="Aid"
                    v-model="form.maklumatBantuan.aid"
                    :classes="{
                      input: '!py-2 bg-gray-100',
                    }"
                    :disabled="true"
                  />
                  <FormKit
                    type="text"
                    label="Aid Product"
                    v-model="form.maklumatBantuan.aidProduct"
                    :classes="{
                      input: '!py-2 bg-gray-100',
                    }"
                    :disabled="true"
                  />
                  <FormKit
                    type="text"
                    label="Product Package"
                    v-model="form.maklumatBantuan.productPackage"
                    :classes="{
                      input: '!py-2 bg-gray-100',
                    }"
                    :disabled="true"
                  />
                  <FormKit
                    type="text"
                    label="Entitlement Product"
                    v-model="form.maklumatBantuan.entitlementProduct"
                    :classes="{
                      input: '!py-2 bg-gray-100',
                    }"
                    :disabled="true"
                  />
                  <div class="md:col-span-2">
                    <div class="flex items-center gap-6">
                      <label class="flex items-center">
                        <input 
                          type="checkbox" 
                          v-model="form.maklumatBantuan.segera" 
                          class="mr-2" 
                        />
                        <span class="text-sm font-medium">SEGERA</span>
                      </label>
                      <label class="flex items-center">
                        <input 
                          type="checkbox" 
                          v-model="form.maklumatBantuan.kelulusanKhas" 
                          class="mr-2" 
                        />
                        <span class="text-sm font-medium">Kelulusan Khas</span>
                      </label>
                    </div>
                  </div>
                  <FormKit
                    type="text"
                    label="Tarikh Permohonan"
                    v-model="form.maklumatBantuan.tarikhPermohonan"
                    :classes="{
                      input: '!py-2 bg-gray-100',
                    }"
                    :disabled="true"
                  />
                  <FormKit
                    type="text"
                    label="SLA"
                    v-model="form.maklumatBantuan.sla"
                    :classes="{
                      input: '!py-2 bg-gray-100',
                    }"
                    :disabled="true"
                  />
                  <div class="md:col-span-2">
                    <FormKit
                      type="textarea"
                      label="SITUASI"
                      :value="form.maklumatBantuan.situasi.join(', ')"
                      :classes="{
                        input: '!py-2 bg-gray-100 min-h-[80px]',
                      }"
                      :disabled="true"
                    />
                  </div>
                </div>
              </rs-fieldset>

              <!-- 3.2 Penerima Manfaat -->
              <rs-fieldset title="3.2 Maklumat Penerima Manfaat">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="select"
                    label="Nama Penerima Manfaat"
                    v-model="form.penerimaManfaat.nama"
                    :classes="{
                      input: '!py-2',
                    }"
                    :options="penerimaManfaatOptions"
                    placeholder="Pilih penerima manfaat..."
                    searchable
                  />
                  <FormKit
                    type="text"
                    label="No. Kad Pengenalan"
                    v-model="form.penerimaManfaat.noKp"
                    :classes="{
                      input: '!py-2 bg-gray-100',
                    }"
                    :disabled="true"
                  />
                  <FormKit
                    type="text"
                    label="Hubungan"
                    v-model="form.penerimaManfaat.hubungan"
                    :classes="{
                      input: '!py-2 bg-gray-100',
                    }"
                    :disabled="true"
                  />
                </div>
              </rs-fieldset>

              <!-- 3.3 Dokumen Sokongan -->
              <rs-fieldset title="3.3 Dokumen Sokongan">
                <div class="overflow-x-auto">
                  <table class="min-w-full border bg-white text-sm">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-3 py-2 text-left">No</th>
                        <th class="px-3 py-2 text-left">Dokumen</th>
                        <th class="px-3 py-2 text-left">Tindakan</th>
                        <th class="px-3 py-2 text-left">Status Dokumen</th>
                        <th class="px-3 py-2 text-left">Catatan</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="d in form.dokumenSokongan" :key="d.no" class="border-t">
                        <td class="px-3 py-2">{{ d.no }}</td>
                        <td class="px-3 py-2">{{ d.dokumen }}</td>
                        <td class="px-3 py-2">
                          <rs-button size="sm" variant="primary-outline" @click.prevent>
                            <Icon name="heroicons:eye" class="w-4 h-4 mr-1" />
                            View
                          </rs-button>
                        </td>
                        <td class="px-3 py-2">{{ d.status }}</td>
                        <td class="px-3 py-2">{{ d.catatan }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </rs-fieldset>

              <!-- 3.4 Maklumat Kadar Bantuan -->
              <rs-fieldset title="3.4 Maklumat Kadar Bantuan">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="number"
                    label="Kadar Bantuan (RM)"
                    v-model="form.kadarBantuan.kadar"
                    :classes="{
                      input: '!py-2',
                    }"
                    validation="required"
                  />
                  <FormKit
                    type="number"
                    label="Tempoh/Kekerapan (bulan)"
                    v-model="form.kadarBantuan.kekerapan"
                    :classes="{
                      input: '!py-2',
                    }"
                    validation="required"
                  />
                  <FormKit
                    type="date"
                    label="Tarikh Mula"
                    v-model="form.kadarBantuan.tarikhMula"
                    :classes="{
                      input: '!py-2',
                    }"
                    validation="required"
                  />
                  <FormKit
                    type="date"
                    label="Tarikh Tamat (auto)"
                    v-model="form.kadarBantuan.tarikhTamat"
                    :classes="{
                      input: '!py-2 bg-gray-100',
                    }"
                    :disabled="true"
                  />
                  <FormKit
                    type="number"
                    label="Jumlah Keseluruhan (auto)"
                    v-model="form.kadarBantuan.jumlahKeseluruhan"
                    :classes="{
                      input: '!py-2 bg-gray-100',
                    }"
                    :disabled="true"
                  />
                </div>
              </rs-fieldset>

              <!-- 3.5 Maklumat Penerima Bayaran -->
              <rs-fieldset title="3.5 Maklumat Penerima Bayaran">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="select"
                    label="Kaedah Pembayaran"
                    v-model="form.penerimaBayaran.kaedah"
                    :classes="{
                      input: '!py-2',
                    }"
                    :options="[
                      { label: 'EFT', value: 'EFT' },
                      { label: 'Vcash', value: 'Vcash' },
                      { label: 'Cheque', value: 'Cheque' },
                      { label: 'TT', value: 'TT' },
                      { label: 'eWallet', value: 'eWallet' },
                      { label: 'Tunai', value: 'Tunai' },
                      { label: 'Tunai (Kaunter Ekspres)', value: 'Tunai (Kaunter Ekspres)' },
                      { label: 'Tunai (Lapangan)', value: 'Tunai (Lapangan)' }
                    ]"
                    validation="required"
                  />
                  <FormKit
                    type="text"
                    label="No KP / No Pendaftaran"
                    v-model="form.penerimaBayaran.noKp"
                    :classes="{
                      input: '!py-2',
                    }"
                    validation="required"
                  />
                  <FormKit
                    type="text"
                    label="Nama Penerima/Institusi/Syarikat"
                    v-model="form.penerimaBayaran.namaPenerima"
                    :classes="{
                      input: '!py-2',
                    }"
                    validation="required"
                  />
                  <template v-if="form.penerimaBayaran.kaedah !== 'Tunai' && !form.penerimaBayaran.kaedah.startsWith('Tunai ')">
                    <FormKit
                      type="text"
                      label="Nama Pemegang Akaun"
                      v-model="form.penerimaBayaran.namaPemegangAkaun"
                      :classes="{
                        input: '!py-2',
                      }"
                      validation="required"
                    />
                    <FormKit
                      type="text"
                      label="Bank"
                      v-model="form.penerimaBayaran.bank"
                      :classes="{
                        input: '!py-2',
                      }"
                      validation="required"
                    />
                    <FormKit
                      type="text"
                      label="No. Akaun Bank"
                      v-model="form.penerimaBayaran.noAkaun"
                      :classes="{
                        input: '!py-2',
                      }"
                      validation="required"
                    />
                  </template>
                </div>
              </rs-fieldset>

              <!-- 3.6 Maklumat Lawatan & Keputusan Siasatan -->
              <rs-fieldset title="3.6 Maklumat Lawatan & Keputusan Siasatan">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="select"
                    label="Kaedah Siasatan (RO)"
                    v-model="form.lawatanSiasatan.kaedah"
                    :classes="{
                      input: '!py-2 bg-gray-100',
                    }"
                    :options="[
                      { label: 'Semak Dokumen Sahaja', value: 'Semak Dokumen Sahaja' },
                      { label: 'Telefon', value: 'Telefon' },
                      { label: 'Lapangan', value: 'Lapangan' }
                    ]"
                    :disabled="true"
                  />
                  <template v-if="form.lawatanSiasatan.kaedah === 'Lapangan'">
                    <FormKit
                      type="date"
                      label="Tarikh Lawatan"
                      v-model="form.lawatanSiasatan.tarikhLawatan"
                      :classes="{
                        input: '!py-2 bg-gray-100',
                      }"
                      :disabled="true"
                    />
                    <FormKit
                      type="time"
                      label="Masa Lawatan"
                      v-model="form.lawatanSiasatan.masaLawatan"
                      :classes="{
                        input: '!py-2 bg-gray-100',
                      }"
                      :disabled="true"
                    />
                  </template>
                  <div class="md:col-span-2">
                    <FormKit
                      type="textarea"
                      label="Catatan Penilaian Awal (RO)"
                      v-model="form.lawatanSiasatan.catatanAwal"
                      :classes="{
                        input: '!py-2 bg-gray-100 min-h-[80px]',
                      }"
                      :disabled="true"
                    />
                  </div>
                  <div class="md:col-span-2">
                    <FormKit
                      type="file"
                      label="Gambar Lokasi / Bukti"
                      multiple
                      :classes="{
                        input: '!py-2',
                      }"
                    />
                  </div>
                  <div class="md:col-span-2">
                    <FormKit
                      type="textarea"
                      label="Catatan Lawatan EOAD"
                      v-model="form.lawatanSiasatan.catatanEOAD"
                      :classes="{
                        input: '!py-2 min-h-[80px]',
                      }"
                    />
                  </div>
                  <FormKit
                    type="select"
                    label="Status Sokongan (RO)"
                    v-model="form.lawatanSiasatan.statusSokongan"
                    :classes="{
                      input: '!py-2 bg-gray-100',
                    }"
                    :options="[
                      { label: 'Sokong', value: 'Sokong' },
                      { label: 'Tidak Sokong', value: 'Tidak Sokong' }
                    ]"
                    :disabled="true"
                  />
                  <div class="md:col-span-2">
                    <FormKit
                      type="textarea"
                      label="Catatan Sokongan (RO)"
                      v-model="form.lawatanSiasatan.catatanSokongan"
                      :classes="{
                        input: '!py-2 bg-gray-100 min-h-[80px]',
                      }"
                      :disabled="true"
                    />
                  </div>
                  <FormKit
                    type="text"
                    label="Item Bantuan (jika berkaitan)"
                    v-model="form.lawatanSiasatan.itemBantuan"
                    :classes="{
                      input: '!py-2',
                    }"
                  />
                  <FormKit
                    type="text"
                    label="Tarikh Sokongan (RO)"
                    v-model="form.lawatanSiasatan.tarikhsokongan"
                    :classes="{
                      input: '!py-2 bg-gray-100',
                    }"
                    :disabled="true"
                  />
                  <FormKit
                    type="text"
                    label="Nama Pegawai (RO)"
                    v-model="form.lawatanSiasatan.namaPegawai"
                    :classes="{
                      input: '!py-2 bg-gray-100',
                    }"
                    :disabled="true"
                  />
                </div>
              </rs-fieldset>

              <!-- 3.7 Maklumat Bajet -->
              <rs-fieldset title="3.7 Maklumat Bajet">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="text"
                    label="Nama Bajet (RO)"
                    v-model="form.bajet.nama"
                    :classes="{
                      input: '!py-2 bg-gray-100',
                    }"
                    :disabled="true"
                  />
                  <FormKit
                    type="number"
                    label="Jumlah Bajet Semasa (RO)"
                    v-model="form.bajet.jumlahSemasa"
                    :classes="{
                      input: '!py-2 bg-gray-100',
                    }"
                    :disabled="true"
                  />
                </div>
              </rs-fieldset>

              <!-- 3.8 Maklumat Kelulusan -->
              <rs-fieldset title="3.8 Maklumat Kelulusan">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="select"
                    label="Keputusan Kelulusan"
                    v-model="form.kelulusan.keputusan"
                    :classes="{
                      input: '!py-2',
                    }"
                    :options="[
                      { label: 'Lulus', value: 'Lulus' },
                      { label: 'Tidak Lulus', value: 'Tidak Lulus' }
                    ]"
                    validation="required"
                  />
                  <FormKit
                    type="text"
                    label="Tarikh Kelulusan (RO)"
                    v-model="form.kelulusan.tarikhKelulusan"
                    :classes="{
                      input: '!py-2 bg-gray-100',
                    }"
                    :disabled="true"
                  />
                  <div class="md:col-span-2">
                    <FormKit
                      type="textarea"
                      label="Catatan Kelulusan"
                      v-model="form.kelulusan.catatan"
                      :classes="{
                        input: '!py-2 min-h-[80px]',
                      }"
                      :validation="form.kelulusan.keputusan === 'Tidak Lulus' ? 'required' : ''"
                    />
                  </div>
                </div>
              </rs-fieldset>
        </div>

            <!-- RIGHT: actions -->
            <aside class="space-y-4">
              <rs-card class="sticky top-6">
                <template #header>
                  <h3 class="text-lg font-semibold">Status & Tindakan</h3>
                </template>
                <template #body>
                  <div class="space-y-4">
                    <div>
                      <label class="text-sm font-medium text-gray-700 mb-2 block">Status Semasa:</label>
                      <rs-badge :variant="getStatusVariant(detail.status)">
                        {{ detail.status }}
                      </rs-badge>
                    </div>
                    
                    <div class="space-y-3">
                      <rs-button
                        variant="secondary"
                        class="w-full"
                        @click="saveDraft"
                      >
                        <Icon name="heroicons:document-arrow-down" class="w-4 h-4 mr-2" />
                        Simpan (Draft)
                      </rs-button>
                      
                      <rs-button
                        variant="primary"
                        class="w-full"
                        @click="openConfirm"
                      >
                        <Icon name="heroicons:paper-airplane" class="w-4 h-4 mr-2" />
                        Hantar (Sahkan Kelulusan)
                      </rs-button>
                      
                      <rs-button
                        variant="secondary-outline"
                        class="w-full"
                        @click="goBack"
                      >
                        <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
                        Kembali
                      </rs-button>
                    </div>
                  </div>
                </template>
              </rs-card>
            </aside>
          </div>
        </template>
      </rs-card>

    <!-- Confirm Modal -->
    <rs-modal
      v-model="showConfirm"
      title="Sahkan Hantar Kelulusan"
      size="md"
    >
      <template #body>
        <div class="space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="font-semibold text-blue-900 mb-2">Maklumat Kelulusan</h4>
            <ul class="text-sm text-blue-800 space-y-1">
              <li><strong>No Rujukan:</strong> <span class="font-mono">{{ route.params.id }}</span></li>
              <li><strong>Nama Bantuan:</strong> {{ form.maklumatBantuan.aid }}</li>
              <li><strong>Kekerapan:</strong> {{ form.kadarBantuan.kekerapan }} bulan</li>
              <li><strong>Status:</strong> {{ form.kelulusan.keputusan }}</li>
            </ul>
          </div>
          <p class="text-sm text-gray-600">
            Adakah anda pasti untuk menghantar kelulusan ini? Tindakan ini tidak boleh dibatalkan.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="secondary-outline"
            @click="showConfirm = false"
          >
            Tidak
          </rs-button>
          <rs-button
            variant="primary"
            @click="submitNow"
          >
            <Icon name="heroicons:check" class="w-4 h-4 mr-2" />
            Ya, Hantar
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Toasts -->
    <div class="fixed bottom-4 right-4 space-y-2 z-50">
      <div v-for="t in toasts" :key="t.id" class="px-4 py-2 rounded shadow bg-black text-white text-sm">
        {{ t.msg }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRoute, navigateTo } from '#app'

definePageMeta({
  title: "Semakan & Kelulusan (Manual Kuasa)",
  description: "Semakan dan kelulusan manual kuasa untuk permohonan kelulusan khas",
});

const route = useRoute()

const breadcrumb = ref([
  {
    name: "Bantuan",
    type: "link",
    path: "/BF-BTN",
  },
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/PB",
  },
  {
    name: "Kelulusan Khas",
    type: "link",
    path: "/BF-BTN/PB/KH/01",
  },
  {
    name: "Semakan & Kelulusan",
    type: "current",
    path: `/BF-BTN/PB/KH/02/${route.params.id}`,
  },
]);

// lightweight local components within the same file
const Field = {
  props: { label: String, modelValue: [String, Number], type: {default: 'text'}, readonly: Boolean, required: Boolean },
  emits: ['update:modelValue'],
  template: `
    <div>
      <label class="text-sm text-gray-600">{{ label }} <span v-if="required" class="text-red-600">*</span></label>
      <input :type="type" class="w-full border rounded px-3 py-2 mt-1"
             :readonly="readonly" :required="required"
             :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
    </div>
  `
}
const FieldCheckbox = {
  props: { label: String, modelValue: Boolean },
  emits: ['update:modelValue'],
  template: `
    <label class="flex items-center gap-2 text-sm text-gray-700">
      <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
      {{ label }}
    </label>
  `
}

// utils
function addMonths(yyyy_mm_dd, months) {
  if (!yyyy_mm_dd) return ''
  const [y,m,d] = yyyy_mm_dd.split('-').map(n=>parseInt(n,10))
  const dt = new Date(y, m-1, d)
  dt.setMonth(dt.getMonth() + (months||0))
  const yy = dt.getFullYear()
  const mm = String(dt.getMonth()+1).padStart(2,'0')
  const dd = String(dt.getDate()).padStart(2,'0')
  return `${yy}-${mm}-${dd}`
}
// Status badge variant helper
const getStatusVariant = (status) => {
  const variants = {
    'Lulus': 'success',
    'Tidak Lulus': 'danger',
    'Menunggu': 'warning',
  };
  return variants[status] || 'secondary';
}
let toastId = 1
const toasts = ref([])
function toast(msg) {
  const id = toastId++
  toasts.value.push({ id, msg })
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 3000)
}

// local mock details keyed by noRujukan
const details = [
  {
    noRujukan: 'B102',
    maklumatBantuan: {
      aid: 'Barangan Dapur Asas',
      aidProduct: 'Pakej Asas',
      productPackage: 'Pakej A',
      entitlementProduct: 'Entitlement A',
      segera: true,
      kelulusanKhas: true,
      tarikhPermohonan: '21-07-2025',
      situasi: ['Melebihi Had Kifayah'],
      sla: 'SLA-24h',
    },
    penerimaManfaat: { nama: 'Fatimah Bt Ali', noKp: '850101-10-1234', hubungan: 'Anak' },
    dokumenSokongan: [{ no:1, dokumen:'Kad Pengenalan', status:'Lengkap', catatan:'OK', url:'#' }],
    kadarBantuan: { kadar: 300, kekerapan: 6, tarikhMula: '2025-08-01', tarikhTamat: '2026-01-31', jumlahKeseluruhan: 1800 },
    penerimaBayaran: { kaedah:'EFT', noKp:'850101-10-1234', namaPenerima:'Ahmad Bin Ali', namaPemegangAkaun:'Ahmad Bin Ali', bank:'Maybank', noAkaun:'1234567890' },
    lawatanSiasatan: { kaedah:'Lapangan', tarikhLawatan:'2025-07-25', masaLawatan:'09:30', catatanAwal:'Kelayakan asas dipenuhi.', gambar:[], catatanEOAD:'Disyorkan Lulus', statusSokongan:'Sokong', catatanSokongan:'Layak mengikut siasatan', itemBantuan:'Beras 10kg x 2', tarikhsokongan:'2025-07-25T10:05:00', namaPegawai:'Zul' },
    bajet: { nama:'Bajet Operasi 2025', jumlahSemasa: 100000 },
    kelulusan: { keputusan:'Lulus', catatan:'', tarikhKelulusan:'2025-07-23T13:20:00' },
    status: 'Menunggu'
  },
  {
    noRujukan: 'B300',
    maklumatBantuan: {
      aid: 'Sewa Rumah',
      aidProduct: 'Sewa Bulanan',
      productPackage: 'Pakej B',
      entitlementProduct: 'Entitlement B',
      segera: false,
      kelulusanKhas: true,
      tarikhPermohonan: '22-07-2025',
      situasi: ['Tidak memenuhi syarat minimum'],
      sla: 'SLA-48h',
    },
    penerimaManfaat: { nama: 'Tiada', noKp: '', hubungan: '' },
    dokumenSokongan: [{ no:1, dokumen:'Penyata Gaji', status:'Tidak Lengkap', catatan:'Perlu salinan terkini', url:'#' }],
    kadarBantuan: { kadar: 500, kekerapan: 1, tarikhMula: '2025-08-05', tarikhTamat: '2025-08-05', jumlahKeseluruhan: 500 },
    penerimaBayaran: { kaedah:'Tunai', noKp:'900303-10-9999', namaPenerima:'Siti Aminah' },
    lawatanSiasatan: { kaedah:'Telefon', tarikhLawatan:'', masaLawatan:'', catatanAwal:'Semakan telefon.', gambar:[], catatanEOAD:'Perlu dokumen tambahan', statusSokongan:'Tidak Sokong', catatanSokongan:'Maklumat tidak lengkap', itemBantuan:'', tarikhsokongan:'2025-07-23T11:00:00', namaPegawai:'Hafiz' },
    bajet: { nama:'Bajet Kebajikan 2025', jumlahSemasa: 50000 },
    kelulusan: { keputusan:'Tidak Lulus', catatan:'Sila lengkapkan dokumen', tarikhKelulusan:'2025-07-24T09:00:00' },
    status: 'Menunggu'
  },
  {
    noRujukan: 'B307',
    maklumatBantuan: {
      aid: 'Bantuan Perubatan',
      aidProduct: 'Rawatan Khas',
      productPackage: 'Pakej C',
      entitlementProduct: 'Entitlement C',
      segera: true,
      kelulusanKhas: true,
      tarikhPermohonan: '23-07-2025',
      situasi: ['Kecemasan Perubatan'],
      sla: 'SLA-12h',
    },
    penerimaManfaat: { nama: 'Mohd Razak bin Ibrahim', noKp: '780315-08-5678', hubungan: 'Suami' },
    dokumenSokongan: [{ no:1, dokumen:'Laporan Perubatan', status:'Lengkap', catatan:'Dokumen lengkap', url:'#' }],
    kadarBantuan: { kadar: 1000, kekerapan: 1, tarikhMula: '2025-08-01', tarikhTamat: '2025-08-01', jumlahKeseluruhan: 1000 },
    penerimaBayaran: { kaedah:'EFT', noKp:'780315-08-5678', namaPenerima:'Mohd Razak bin Ibrahim', namaPemegangAkaun:'Mohd Razak bin Ibrahim', bank:'CIMB', noAkaun:'9876543210' },
    lawatanSiasatan: { kaedah:'Lapangan', tarikhLawatan:'2025-07-24', masaLawatan:'14:00', catatanAwal:'Keperluan perubatan disahkan.', gambar:[], catatanEOAD:'Disyorkan Lulus', statusSokongan:'Sokong', catatanSokongan:'Layak mengikut kriteria', itemBantuan:'Rawatan Hospital', tarikhsokongan:'2025-07-24T15:30:00', namaPegawai:'Aminah' },
    bajet: { nama:'Bajet Kesihatan 2025', jumlahSemasa: 75000 },
    kelulusan: { keputusan:'Lulus', catatan:'Diluluskan untuk rawatan kecemasan', tarikhKelulusan:'2025-07-24T16:00:00' },
    status: 'Lulus'
  },
  {
    noRujukan: 'B201',
    maklumatBantuan: {
      aid: 'Bantuan Pendidikan',
      aidProduct: 'Yuran Sekolah',
      productPackage: 'Pakej D',
      entitlementProduct: 'Entitlement D',
      segera: false,
      kelulusanKhas: true,
      tarikhPermohonan: '24-07-2025',
      situasi: ['Pendapatan tidak mencukupi'],
      sla: 'SLA-72h',
    },
    penerimaManfaat: { nama: 'Fatimah binti Omar', noKp: '920505-12-3456', hubungan: 'Anak' },
    dokumenSokongan: [{ no:1, dokumen:'Penyata Pendapatan', status:'Tidak Lengkap', catatan:'Perlu dokumen terkini', url:'#' }],
    kadarBantuan: { kadar: 200, kekerapan: 12, tarikhMula: '2025-08-01', tarikhTamat: '2026-07-31', jumlahKeseluruhan: 2400 },
    penerimaBayaran: { kaedah:'EFT', noKp:'920505-12-3456', namaPenerima:'Fatimah binti Omar', namaPemegangAkaun:'Fatimah binti Omar', bank:'RHB', noAkaun:'5555666677' },
    lawatanSiasatan: { kaedah:'Telefon', tarikhLawatan:'', masaLawatan:'', catatanAwal:'Semakan telefon.', gambar:[], catatanEOAD:'Perlu dokumen tambahan', statusSokongan:'Tidak Sokong', catatanSokongan:'Dokumen tidak lengkap', itemBantuan:'', tarikhsokongan:'2025-07-25T10:00:00', namaPegawai:'Zul' },
    bajet: { nama:'Bajet Pendidikan 2025', jumlahSemasa: 120000 },
    kelulusan: { keputusan:'Tidak Lulus', catatan:'Dokumen tidak lengkap', tarikhKelulusan:'2025-07-25T11:00:00' },
    status: 'Tidak Lulus'
  },
  {
    noRujukan: 'B305',
    maklumatBantuan: {
      aid: 'Bantuan Makanan',
      aidProduct: 'Pakej Makanan',
      productPackage: 'Pakej E',
      entitlementProduct: 'Entitlement E',
      segera: true,
      kelulusanKhas: true,
      tarikhPermohonan: '25-07-2025',
      situasi: ['Kehilangan pekerjaan'],
      sla: 'SLA-24h',
    },
    penerimaManfaat: { nama: 'Rashid Bin Omar', noKp: '880912-05-7890', hubungan: 'Suami' },
    dokumenSokongan: [{ no:1, dokumen:'Surat Pengesahan', status:'Lengkap', catatan:'OK', url:'#' }],
    kadarBantuan: { kadar: 150, kekerapan: 3, tarikhMula: '2025-08-01', tarikhTamat: '2025-10-31', jumlahKeseluruhan: 450 },
    penerimaBayaran: { kaedah:'Tunai', noKp:'880912-05-7890', namaPenerima:'Rashid Bin Omar' },
    lawatanSiasatan: { kaedah:'Lapangan', tarikhLawatan:'2025-07-26', masaLawatan:'10:00', catatanAwal:'Keperluan asas disahkan.', gambar:[], catatanEOAD:'Dalam proses', statusSokongan:'', catatanSokongan:'', itemBantuan:'', tarikhsokongan:'', namaPegawai:'' },
    bajet: { nama:'Bajet Makanan 2025', jumlahSemasa: 80000 },
    kelulusan: { keputusan:'', catatan:'', tarikhKelulusan:'' },
    status: 'Menunggu'
  },
  {
    noRujukan: 'B108',
    maklumatBantuan: {
      aid: 'Bantuan Rumah',
      aidProduct: 'Baik Pulih Rumah',
      productPackage: 'Pakej F',
      entitlementProduct: 'Entitlement F',
      segera: false,
      kelulusanKhas: true,
      tarikhPermohonan: '26-07-2025',
      situasi: ['Rumah rosak teruk'],
      sla: 'SLA-48h',
    },
    penerimaManfaat: { nama: 'Aishah Bt Abdullah', noKp: '850203-11-2468', hubungan: 'Isteri' },
    dokumenSokongan: [{ no:1, dokumen:'Laporan Kerosakan', status:'Lengkap', catatan:'Dokumen lengkap', url:'#' }],
    kadarBantuan: { kadar: 2000, kekerapan: 1, tarikhMula: '2025-08-01', tarikhTamat: '2025-08-01', jumlahKeseluruhan: 2000 },
    penerimaBayaran: { kaedah:'EFT', noKp:'850203-11-2468', namaPenerima:'Aishah Bt Abdullah', namaPemegangAkaun:'Aishah Bt Abdullah', bank:'Public Bank', noAkaun:'1122334455' },
    lawatanSiasatan: { kaedah:'Lapangan', tarikhLawatan:'2025-07-27', masaLawatan:'09:00', catatanAwal:'Kerosakan rumah disahkan.', gambar:[], catatanEOAD:'Disyorkan Lulus', statusSokongan:'Sokong', catatanSokongan:'Layak mengikut kriteria', itemBantuan:'Baik Pulih Asas', tarikhsokongan:'2025-07-27T11:00:00', namaPegawai:'Hafiz' },
    bajet: { nama:'Bajet Perumahan 2025', jumlahSemasa: 200000 },
    kelulusan: { keputusan:'Lulus', catatan:'Diluluskan untuk baik pulih', tarikhKelulusan:'2025-07-27T12:00:00' },
    status: 'Lulus'
  },
  {
    noRujukan: 'B402',
    maklumatBantuan: {
      aid: 'Bantuan Kenderaan',
      aidProduct: 'Baik Pulih Motor',
      productPackage: 'Pakej G',
      entitlementProduct: 'Entitlement G',
      segera: false,
      kelulusanKhas: true,
      tarikhPermohonan: '27-07-2025',
      situasi: ['Pendapatan tidak mencukupi'],
      sla: 'SLA-72h',
    },
    penerimaManfaat: { nama: 'Ismail Bin Ahmad', noKp: '900101-03-1357', hubungan: 'Suami' },
    dokumenSokongan: [{ no:1, dokumen:'Penyata Pendapatan', status:'Tidak Lengkap', catatan:'Perlu dokumen terkini', url:'#' }],
    kadarBantuan: { kadar: 800, kekerapan: 1, tarikhMula: '2025-08-01', tarikhTamat: '2025-08-01', jumlahKeseluruhan: 800 },
    penerimaBayaran: { kaedah:'EFT', noKp:'900101-03-1357', namaPenerima:'Ismail Bin Ahmad', namaPemegangAkaun:'Ismail Bin Ahmad', bank:'Hong Leong', noAkaun:'9988776655' },
    lawatanSiasatan: { kaedah:'Telefon', tarikhLawatan:'', masaLawatan:'', catatanAwal:'Semakan telefon.', gambar:[], catatanEOAD:'Perlu dokumen tambahan', statusSokongan:'Tidak Sokong', catatanSokongan:'Dokumen tidak lengkap', itemBantuan:'', tarikhsokongan:'2025-07-28T09:00:00', namaPegawai:'Zul' },
    bajet: { nama:'Bajet Kenderaan 2025', jumlahSemasa: 60000 },
    kelulusan: { keputusan:'Tidak Lulus', catatan:'Dokumen tidak lengkap', tarikhKelulusan:'2025-07-28T10:00:00' },
    status: 'Tidak Lulus'
  }
]

const detail = computed(() => details.find(d => d.noRujukan === String(route.params.id)) || null)
const form = reactive({})

// Penerima Manfaat options for dropdown with complete data
const penerimaManfaatOptions = ref([
  { 
    label: 'Fatimah Bt Ali', 
    value: 'Fatimah Bt Ali',
    noKp: '850101-10-1234',
    hubungan: 'Anak'
  },
  { 
    label: 'Ahmad Bin Hassan', 
    value: 'Ahmad Bin Hassan',
    noKp: '780315-08-5678',
    hubungan: 'Suami'
  },
  { 
    label: 'Siti Aminah Bt Omar', 
    value: 'Siti Aminah Bt Omar',
    noKp: '920503-12-9012',
    hubungan: 'Isteri'
  },
  { 
    label: 'Mohd Razak Bin Ibrahim', 
    value: 'Mohd Razak Bin Ibrahim',
    noKp: '670912-05-3456',
    hubungan: 'Bapa'
  },
  { 
    label: 'Norhayati Bt Abdullah', 
    value: 'Norhayati Bt Abdullah',
    noKp: '880207-14-7890',
    hubungan: 'Ibu'
  },
  { 
    label: 'Hassan Bin Ahmad', 
    value: 'Hassan Bin Ahmad',
    noKp: '750618-09-2345',
    hubungan: 'Adik'
  },
  { 
    label: 'Zainab Bt Mohd', 
    value: 'Zainab Bt Mohd',
    noKp: '930411-16-6789',
    hubungan: 'Kakak'
  },
  { 
    label: 'Ismail Bin Ali', 
    value: 'Ismail Bin Ali',
    noKp: '820325-11-0123',
    hubungan: 'Abang'
  },
  { 
    label: 'Rohani Bt Hassan', 
    value: 'Rohani Bt Hassan',
    noKp: '900108-18-4567',
    hubungan: 'Adik'
  },
  { 
    label: 'Abdul Rahman Bin Omar', 
    value: 'Abdul Rahman Bin Omar',
    noKp: '710623-07-8901',
    hubungan: 'Bapa Saudara'
  }
])

// Watch for detail changes and update form
watch(detail, (newDetail) => {
  if (newDetail) {
    Object.assign(form, JSON.parse(JSON.stringify(newDetail)))
  }
}, { immediate: true })

// Watch for nama penerima manfaat changes and update related fields
watch(() => form.penerimaManfaat?.nama, (newNama) => {
  if (newNama && form.penerimaManfaat) {
    const selectedPerson = penerimaManfaatOptions.value.find(person => person.value === newNama)
    if (selectedPerson) {
      form.penerimaManfaat.noKp = selectedPerson.noKp
      form.penerimaManfaat.hubungan = selectedPerson.hubungan
    }
  }
})

watch(() => [form?.kadarBantuan?.kadar, form?.kadarBantuan?.kekerapan, form?.kadarBantuan?.tarikhMula],
  () => {
    if (!form || !form.kadarBantuan) return
    const k = Number(form.kadarBantuan.kadar) || 0
    const n = Number(form.kadarBantuan.kekerapan) || 0
    form.kadarBantuan.jumlahKeseluruhan = k * n
    form.kadarBantuan.tarikhTamat = addMonths(form.kadarBantuan.tarikhMula, n-1) // inclusive span
  }, { immediate: true })

const showConfirm = ref(false)
function saveDraft() { toast('Maklumat telah berjaya disimpan!') }
function openConfirm() { showConfirm.value = true }
function submitNow() {
  showConfirm.value = false
  toast('Kelulusan dihantar. Mengalih ke Senarai…')
  setTimeout(() => navigateTo('/BF-BTN/PB/KH/01'), 650)
}
function goBack() { navigateTo('/BF-BTN/PB/KH/01') }
</script>

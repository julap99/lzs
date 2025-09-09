<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="space-y-6">
      <!-- Header Page: Permohonan Tuntutan -->
      <h1 class="text-2xl font-semibold">Permohonan Tuntutan</h1>

      <!-- 3.1 Maklumat Pemohon -->
      <rs-card>
        <template #header>
          <h2 class="text-xl font-semibold">Maklumat Pemohon</h2>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
              <p class="text-gray-900">{{ pemohon.nama }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">No. Kad Pengenalan / No. Vendor</label>
              <p class="text-gray-900">{{ pemohon.noId }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">No. Telefon</label>
              <p class="text-gray-900">{{ pemohon.noTelefon }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kategori Asnaf</label>
              <p class="text-gray-900">{{ pemohon.kategoriAsnaf }}</p>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- 3.2 Maklumat Bantuan -->
      <rs-card>
        <template #header>
          <h2 class="text-xl font-semibold">Maklumat Bantuan</h2>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Dropdown, Read-Only -->
            <FormKit
              type="select"
              label="No. Bantuan"
              :options="opsyenNoBantuan"
              v-model="bantuan.noBantuan"
              :disabled="true"
            />
            <FormKit
              type="select"
              label="No. GL"
              :options="opsyenNoGL"
              v-model="bantuan.noGL"
              :disabled="true"
            />
            <FormKit type="text" label="Aid" v-model="bantuan.aid" :disabled="true" />
            <FormKit type="text" label="Aid Product" v-model="bantuan.aidProduct" :disabled="true" />
            <FormKit type="text" label="Product Package" v-model="bantuan.productPackage" :disabled="true" />
            <FormKit type="text" label="Entitlement Product" v-model="bantuan.entitlementProduct" :disabled="true" />
          </div>
        </template>
      </rs-card>

      <!-- 3.3 Maklumat Tuntutan -->
      <rs-card>
        <template #header>
          <h2 class="text-xl font-semibold">Maklumat Tuntutan</h2>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormKit type="text" label="No. Invois" v-model="tuntutan.noInvois" :disabled="true" />
            <FormKit type="text" label="No. Invois Pelanggan" v-model="tuntutan.noInvoisPelanggan" :disabled="true" />
            <FormKit type="text" label="Tajuk" v-model="tuntutan.tajuk" :disabled="true" />
            <FormKit type="text" label="Tahun" v-model="tuntutan.tahun" :disabled="true" />
            <FormKit type="text" label="Catatan" v-model="tuntutan.catatan" :disabled="true" />
            <FormKit type="text" label="Penerima Bayaran" v-model="tuntutan.penerimaBayaran" :disabled="true" />
            <FormKit type="text" label="MOP" v-model="tuntutan.mop" :disabled="true" />
            <FormKit type="text" label="Nama Penerima" v-model="tuntutan.namaPenerima" :disabled="true" />
            <FormKit type="text" label="Bank" v-model="tuntutan.bank" :disabled="true" />
            <FormKit type="text" label="No. Akaun" v-model="tuntutan.noAkaun" :disabled="true" />
            <FormKit type="date" label="Tarikh Jangkaan Pembayaran" v-model="tuntutan.tarikhJangkaan" :disabled="true" />
            <FormKit type="text" label="Tarikh Dicipta" :value="formatDateTime(tuntutan.tarikhCipta)" :disabled="true" />
            <FormKit type="text" label="Amaun Tuntutan (RM)" :value="formatNumber(tuntutan.amaunRm)" :disabled="true" />
          </div>
        </template>
      </rs-card>

      <!-- 3.4 Maklumat Dokumen Sokongan -->
      <rs-card>
        <template #header>
          <h2 class="text-xl font-semibold">Maklumat Dokumen Sokongan</h2>
        </template>
        <template #body>
          <div class="space-y-2">
            <div
              v-for="doc in dokumenSokongan"
              :key="doc.id"
              class="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <span class="text-gray-900">{{ doc.nama }}</span>
              <div class="flex gap-2">
                <rs-button size="sm" variant="secondary" @click="viewDocument(doc)">Lihat</rs-button>
                <rs-button size="sm" variant="secondary" @click="downloadDocument(doc)">Muat Turun</rs-button>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- 3.5 Pengesahan Kaedah Siasatan -->
      <rs-card>
        <template #header>
          <h2 class="text-xl font-semibold">Pengesahan Kaedah Siasatan</h2>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormKit
              type="textarea"
              label="Catatan Penilaian Awal"
              v-model="penilaianAwal"
              :disabled="true"
            />
            <FormKit
              type="select"
              label="Kaedah Siasatan"
              placeholder="Sila pilih..."
              :options="KAEDAH_OPTIONS"
              v-model="form.kaedah"
              validation="required"
              :validation-messages="{ required: 'Sila pilih kaedah siasatan' }"
            />
            <FormKit
              type="date"
              label="Tarikh Lawatan"
              v-model="form.tarikhLawatan"
              :disabled="!isLapangan"
              :validation="isLapangan ? 'required' : ''"
              :validation-messages="{ required: 'Tarikh lawatan diperlukan' }"
            />
            <FormKit
              type="select"
              label="Masa Lawatan"
              v-model="form.masaLawatan"
              :options="masaSlots"
              :disabled="!isLapangan"
              :validation="isLapangan ? 'required' : ''"
              :validation-messages="{ required: 'Masa lawatan diperlukan' }"
            />

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status Pengesahan Lawatan</label>
              <rs-badge :variant="statusLawatanVariant">{{ statusPengesahanLawatan }}</rs-badge>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- 3.6 Keputusan Siasatan -->
      <rs-card>
        <template #header>
          <h2 class="text-xl font-semibold">Keputusan Siasatan</h2>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormKit
              type="select"
              label="Status Sokongan"
              v-model="form.keputusan"
              :options="[
                { label: 'Sila Pilih...', value: '' },
                { label: 'Sokong', value: 'Sokong' },
                { label: 'Tidak Sokong', value: 'Tidak Sokong' },
              ]"
              validation="required"
              :validation-messages="{ required: 'Sila pilih status sokongan' }"
            />
            <FormKit
              type="textarea"
              label="Catatan"
              v-model="form.catatan"
              :validation="form.keputusan === 'Tidak Sokong' ? 'required' : ''"
              :validation-messages="{ required: 'Catatan diperlukan jika Tidak Sokong' }"
            />
            <FormKit type="text" label="Tarikh" :value="formatDate(form.tarikhKeputusan)" :disabled="true" />
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <!-- 2.1 Simpan -->
            <rs-button :disabled="processing" :loading="processing" variant="primary-outline" @click="handleSimpan">
              Simpan
            </rs-button>
            <!-- 2.2 Simpan & Hantar -->
            <rs-button
              :disabled="processing || !canSubmit"
              :loading="processing"
              :variant="form.keputusan === 'Tidak Sokong' ? 'danger' : 'primary'"
              @click="handleSimpanHantar"
            >
              Simpan &amp; Hantar
            </rs-button>
          </div>
        </template>
      </rs-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useNuxtApp, navigateTo } from '#app'
import { getTuntutanDetail } from '~/mocks/tuntutan'   // buang mapStatusVariant

definePageMeta({ title: 'Permohonan Tuntutan (TDS-02_2)' })

const nuxtApp = useNuxtApp()
const $swal = nuxtApp.$swal as any

const route = useRoute()


const breadcrumb = ref([
  { name: 'Tuntutan', type: 'link', path: '/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad' },
  { name: 'Senarai Tuntutan', type: 'link', path: '/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad' },
  { name: 'Pengesahan', type: 'current', path: `/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad/${route.params.id}/pengesahan` },
])

// ---------- Load detail by ID ----------
const id = String(route.params.id || '')
const detail = getTuntutanDetail(id)
if (!detail) {
  // If not found, bounce back
  navigateTo('/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad')
}

const pemohon = ref(detail!.pemohon)
const bantuan = ref(detail!.bantuan)
const tuntutan = ref(detail!.tuntutan)
const dokumenSokongan = ref(detail!.dokumenSokongan)

// ---------- 3.5 & 3.6 Form State ----------
const form = ref({
  kaedah: '', // Semak Dokumen Sahaja | Telefon | Lapangan
  tarikhLawatan: '',
  masaLawatan: '',
  keputusan: '',
  catatan: '',
  tarikhKeputusan: new Date().toISOString(),
})
const opsyenNoBantuan = computed(() => [
  { label: bantuan.value.noBantuan || '—', value: bantuan.value.noBantuan || '' },
])
const opsyenNoGL = computed(() => [
  { label: bantuan.value.noGL || '—', value: bantuan.value.noGL || '' },
])


const penilaianAwal = ref('Semakan awal dokumen oleh penyemak. Tiada isu kritikal ditemui.')

// ---------- Options & Derived ----------
const KAEDAH_OPTIONS = [
  { label: 'Semak Dokumen Sahaja', value: 'Semak Dokumen Sahaja' },
  { label: 'Telefon', value: 'Telefon' },
  { label: 'Lapangan', value: 'Lapangan' },
]
const masaSlots = Array.from({ length: 48 }, (_, i) => {
  const hh = String(Math.floor(i / 2)).padStart(2, '0')
  const mm = i % 2 === 0 ? '00' : '30'
  const t = `${hh}:${mm}`
  return { label: t, value: t }
})

const isLapangan = computed(() => form.value.kaedah === 'Lapangan')
const statusPengesahanLawatan = computed(() => {
  if (!isLapangan.value) return '-'
  return form.value.tarikhLawatan && form.value.masaLawatan ? 'Sah' : 'Belum Sah'
})
const statusLawatanVariant = computed(() =>
  statusPengesahanLawatan.value === 'Sah' ? 'success'
  : statusPengesahanLawatan.value === 'Belum Sah' ? 'warning'
  : 'secondary'
)


const canSubmit = computed(() => {
  const kaedahOK = !!form.value.kaedah
  const lawatanOK = !isLapangan.value || (form.value.tarikhLawatan && form.value.masaLawatan)
  const keputusanOK = !!form.value.keputusan
  const catatanOK = form.value.keputusan !== 'Tidak Sokong' || (form.value.catatan || '').trim().length > 0
  return kaedahOK && lawatanOK && keputusanOK && catatanOK
})

watch(
  () => form.value.kaedah,
  (v, old) => {
    if (v !== 'Lapangan') {
      form.value.tarikhLawatan = ''
      form.value.masaLawatan = ''
    }
  }
) 

// ---------- Helpers ----------
const formatDate = (d: string | number | Date) => new Date(d).toLocaleDateString('ms-MY')
const formatDateTime = (d: string | number | Date) => new Date(d).toLocaleString('ms-MY')
const formatNumber = (n: number) => new Intl.NumberFormat('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

const viewDocument = (doc: { url: string }) => window.open(doc.url, '_blank')
const downloadDocument = (doc: { url: string; nama: string }) => {
  const a = document.createElement('a')
  a.href = doc.url
  a.download = doc.nama
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

// ---------- Actions ----------
const processing = ref(false)

const handleSimpan = async () => {
  try {
    processing.value = true
    await fakeDelay(600)
    await $swal.fire({ icon: 'success', title: 'Maklumat telah berjaya disimpan!', timer: 3000, showConfirmButton: false })
  } catch (e) {
    await $swal.fire({ icon: 'error', title: 'Ralat', text: 'Gagal menyimpan maklumat.' })
  } finally {
    processing.value = false
  }
}

const handleSimpanHantar = async () => {
  if (!canSubmit.value) {
    await $swal.fire({
      icon: 'warning',
      title: 'Tidak Lengkap',
      text: 'Sila lengkapkan Kaedah/Butiran Lawatan (jika Lapangan) dan Keputusan.',
    })
    return
  }
  try {
    processing.value = true
    await fakeDelay(700)
    await $swal.fire({ icon: 'success', title: 'Maklumat telah berjaya dihantar!', timer: 3500, showConfirmButton: false })
    navigateTo('/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-eoad')
  } catch (e) {
    await $swal.fire({ icon: 'error', title: 'Ralat', text: 'Gagal menghantar maklumat.' })
  } finally {
    processing.value = false
  }
}

const fakeDelay = (ms: number) => new Promise((r) => setTimeout(r, ms))

// expose to template (if using <script setup>, refs are auto-exposed)
</script>



<style lang="scss" scoped>
/* Tambah gaya jika perlu */
</style>

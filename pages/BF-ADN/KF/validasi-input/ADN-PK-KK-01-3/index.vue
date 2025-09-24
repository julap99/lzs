<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <h2 class="mt-2 text-xl font-semibold">Kemaskini Kawalan Validasi</h2>

    <rs-card class="mt-4">
      <template #header>
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center">
            <Icon name="ic:outline-edit" class="mr-2" />
            {{ headerTitle }}
          </div>
          <rs-badge v-if="submitState.status" variant="warning" class="!text-xs">
            {{ submitState.status }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <div class="space-y-8">
          <!-- ========== Komponen Mengikut Jenis ========== -->

          <!-- 3.1 Validasi IC - Semak Duplikasi -->
          <div v-if="isIC" class="rounded-md border p-4">
            <div class="text-sm text-gray-600 mb-4">Validasi IC - Semak Duplikasi</div>

            <div class="grid md:grid-cols-2 gap-6">
              <!-- 3.1.1 Tempoh Semakan (hari) - Required -->
              <div>
                <div class="text-sm text-gray-500">Tempoh Semakan (hari) <span class="text-red-500">*</span></div>
                <FormKit
                  type="number"
                  v-model="form.tempohSemakanHari"
                  min="1"
                  validation="required|number|min:1"
                  :validation-messages="{
                    required: 'Medan ini wajib.',
                    number: 'Masukkan nombor yang sah.',
                    min: 'Nilai sekurang-kurangnya 1.'
                  }"
                  placeholder="Contoh: 1"
                  outer-class="mt-1"
                />
              </div>

              <!-- 3.1.3 Status Kawalan (Toggle) - Required -->
              <div>
                <div class="text-sm text-gray-500">Status Kawalan <span class="text-red-500">*</span></div>
                <div class="mt-2">
                  <label class="inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="form.statusKawalan" />
                    <span>{{ form.statusKawalan ? 'Aktif' : 'Tidak Aktif' }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- 3.2 Validasi Warganegara -->
          <div v-else-if="isWarga" class="rounded-md border p-4">
            <div class="text-sm text-gray-600 mb-4">Validasi Warganegara</div>

            <div class="grid md:grid-cols-2 gap-6">
              <!-- 3.2.1 Status Kawalan (Toggle) - Required -->
              <div>
                <div class="text-sm text-gray-500">Status Kawalan <span class="text-red-500">*</span></div>
                <div class="mt-2">
                  <label class="inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="form.statusKawalan" />
                    <span>{{ form.statusKawalan ? 'Aktif' : 'Tidak Aktif' }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- 3.3 Validasi Negeri yang Dibenarkan -->
          <div v-else-if="isNegeri" class="rounded-md border p-4">
            <div class="text-sm text-gray-600 mb-4">Validasi Negeri yang Dibenarkan</div>

            <div class="grid md:grid-cols-2 gap-6">
              <!-- 3.3.1 List of negeri (Checkbox) - Required -->
              <div class="md:col-span-2">
                <div class="text-sm text-gray-500">List of negeri <span class="text-red-500">*</span></div>
                <div class="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  <label
                    v-for="n in semuaNegeri"
                    :key="n"
                    class="inline-flex items-center gap-2 p-2 rounded border bg-white cursor-pointer"
                  >
                    <input type="checkbox" :value="n" v-model="form.negeriDibenarkan" />
                    <span>{{ n }}</span>
                  </label>
                </div>
                <div v-if="errors.negeriDibenarkan" class="text-sm text-red-600 mt-1">{{ errors.negeriDibenarkan }}</div>
              </div>

              <!-- 3.3.2 Status Kawalan (Toggle) - Required -->
              <div>
                <div class="text-sm text-gray-500">Status Kawalan <span class="text-red-500">*</span></div>
                <div class="mt-2">
                  <label class="inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="form.statusKawalan" />
                    <span>{{ form.statusKawalan ? 'Aktif' : 'Tidak Aktif' }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- ========= Medan Umum (Semua Jenis) ========= -->
          <div class="rounded-md border p-4">
            <div class="grid md:grid-cols-2 gap-6">
              <!-- 3.1.5 Catatan Kemaskini (Textarea) -->
              <div class="md:col-span-2">
                <div class="text-sm text-gray-500">Catatan Kemaskini</div>
                <FormKit
                  type="textarea"
                  v-model="form.catatan"
                  rows="3"
                  placeholder="Masukkan catatan jika ada"
                  outer-class="mt-1"
                />
              </div>

              <!-- 3.1.6 Tarikh Mula Kuasa (Date) - Required -->
              <div>
                <div class="text-sm text-gray-500">Tarikh Mula Kuasa <span class="text-red-500">*</span></div>
                <FormKit
                  type="date"
                  v-model="form.tarikhMulaKuasa"
                  validation="required"
                  :validation-messages="{ required: 'Tarikh mula kuasa wajib diisi.' }"
                  outer-class="mt-1"
                />
              </div>
            </div>
          </div>

          <!-- ========== Butang Tindakan ========== -->
          <div class="flex flex-wrap gap-2">
            <rs-button variant="secondary" @click="onReset">
              Set Semula
            </rs-button>
            <rs-button variant="primary" :disabled="submitState.loading" @click="onSubmit">
              <Icon v-if="submitState.loading" name="svg-spinners:90-ring-with-bg" class="mr-1" />
              Hantar Permohonan
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  middleware: 'auth',
  layout: 'default',
  title: 'Kemaskini Kawalan Validasi',
})

const route  = useRoute()
const router = useRouter()

const breadcrumb = ref([
  { name: 'Mengurus Konfigurasi', type: 'link', path: '/BF-ADN/KF' },
  { name: 'Senarai Validasi Input', type: 'link', path: '/BF-ADN/KF/validasi-input' },
  { name: 'Kemaskini Kawalan Validasi', type: 'text', path: '/BF-ADN/KF/validasi-input/ADN-PK-KK-01-3' },
])

/** Robust: terima ?id=1 atau ?id=VI001 */
const activeId = computed(() => {
  const raw = String(route.query?.id ?? '1')
  const m = raw.match(/\d+/)
  const n = m ? Number(m[0]) : NaN
  return Number.isFinite(n) && n > 0 ? n : 1
})

/** Master rujukan (sama mapping dgn page 01-2) */
const master = ref([
  {
    id: 1,
    jenis: 'IC',
    header: 'Kemaskini Validasi IC',
    current: {
      tempohSemakanHari: 1,
      statusKawalan: true,
      tarikhMulaKuasa: '2025-08-15', // format yyyy-mm-dd utk input type=date
      catatan: 'Disemak harian oleh SSU',
    },
  },
  {
    id: 2,
    jenis: 'WARGA',
    header: 'Kemaskini Validasi Warganegara',
    current: {
      statusKawalan: true,
      tarikhMulaKuasa: '2025-08-12',
      catatan: 'Hanya MyKad',
    },
  },
  {
    id: 3,
    jenis: 'NEGERI',
    header: 'Kemaskini Validasi Negeri yang Dibenarkan',
    current: {
      negeriDibenarkan: ['Selangor', 'WP Kuala Lumpur'],
      statusKawalan: true,
      tarikhMulaKuasa: '2025-08-11',
      catatan: 'Selaras zon operasi',
    },
  },
])

const record   = computed(() => master.value.find(m => m.id === activeId.value) || master.value[0])
const isIC     = computed(() => record.value?.jenis === 'IC')
const isWarga  = computed(() => record.value?.jenis === 'WARGA')
const isNegeri = computed(() => record.value?.jenis === 'NEGERI')
const headerTitle = computed(() => record.value?.header || 'Kemaskini Kawalan Validasi')

/** Semua negeri untuk checkbox */
const semuaNegeri = [
  'Johor','Kedah','Kelantan','Melaka','Negeri Sembilan','Pahang','Perak','Perlis',
  'Pulau Pinang','Sabah','Sarawak','Selangor','Terengganu','WP Kuala Lumpur','WP Labuan','WP Putrajaya'
]

/** Model borang – diprefill dari current */
const form = ref(makeInitialForm())

function makeInitialForm() {
  const r = record.value || {}
  const cur = r.current || {}
  return {
    // IC only
    tempohSemakanHari: cur.tempohSemakanHari ?? 1,
    // Negeri only
    negeriDibenarkan: Array.isArray(cur.negeriDibenarkan) ? [...cur.negeriDibenarkan] : [],
    // Common/status
    statusKawalan: !!cur.statusKawalan,
    catatan: cur.catatan ?? '',
    tarikhMulaKuasa: cur.tarikhMulaKuasa ?? '',
  }
}

/** Reset borang kepada nilai asal current */
function onReset() {
  form.value = makeInitialForm()
  errors.negeriDibenarkan = ''
}

/** Validasi ringkas manual (di samping FormKit local validation) */
const errors = ref({
  negeriDibenarkan: '',
})
function validate() {
  let ok = true
  // IC: tempohSemakanHari required & >=1 -> sudah disemak oleh FormKit, cuma guard cepat:
  if (isIC.value) {
    const n = Number(form.value.tempohSemakanHari)
    if (!Number.isFinite(n) || n < 1) ok = false
  }
  // NEGERI: mesti pilih sekurang-kurangnya 1
  if (isNegeri.value) {
    if (!Array.isArray(form.value.negeriDibenarkan) || form.value.negeriDibenarkan.length < 1) {
      errors.value.negeriDibenarkan = 'Pilih sekurang-kurangnya satu negeri.'
      ok = false
    } else {
      errors.value.negeriDibenarkan = ''
    }
  }
  // Tarikh Mula Kuasa required
  if (!form.value.tarikhMulaKuasa) ok = false
  // Status Kawalan required (toggle boolean — tiada falsey dibenarkan? URS kata Required; kita terima true/false, just ensure boolean)
  if (typeof form.value.statusKawalan !== 'boolean') ok = false
  return ok
}

/** Submit */
const submitState = ref({ loading: false, status: '' })

async function onSubmit() {
  if (!validate()) {
    // boleh tambah noti kalau ada komponen notifikasi; buat masa ni log sahaja
    console.warn('Validasi gagal', { form: form.value, errors: errors.value })
    return
  }
  submitState.value.loading = true
  try {
    // Simulasi simpan & set status Menunggu Kelulusan
    submitState.value.status = 'Menunggu Kelulusan'

    // TODO: Call API di sini jika ada
    // await $fetch('/api/validasi/update', { method: 'POST', body: { id: activeId.value, ...form.value } })

    // Lepas submit, pergi semula ke halaman butiran (01-2)
    await router.push({
      path: '/BF-ADN/KF/validasi-input/ADN-PK-KK-01-2',
      query: { id: String(activeId.value) },
    })
  } finally {
    submitState.value.loading = false
  }
}
</script>

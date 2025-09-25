<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <h2 class="text-xl font-semibold">
          Notifikasi Keputusan - {{ route.params.id }}
        </h2>
      </template>

      <template #body>
        <div class="space-y-6">
          <!-- Form Section -->
          <rs-fieldset title="Konfigurasi Notifikasi">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                label="Keputusan"
                v-model="keputusan"
                :options="keputusanOptions"
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-if="keputusan === 'Tidak Lulus'"
                type="text"
                label="Sebab Penolakan"
                v-model="sebab"
                placeholder="Nyatakan sebab…"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
            
            <div class="mt-4">
              <rs-button
                variant="primary"
                @click="triggerToast"
              >
                <Icon name="heroicons:paper-airplane" class="w-4 h-4 mr-2" />
                Hantar Notifikasi
              </rs-button>
            </div>
          </rs-fieldset>

          <!-- Preview Section -->
          <rs-fieldset title="Pratonton Notifikasi">
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
              <template v-if="keputusan === 'Lulus'">
                <div class="space-y-2">
                  <div class="flex items-start gap-2">
                    <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div class="font-semibold text-gray-900">Keputusan Permohonan Bantuan Khas</div>
                      <div class="text-sm text-gray-600">Salam, permohonan bantuan <em>{{ detail?.aidName || '[Aid Name]' }}</em> telah <strong class="text-green-600">diluluskan</strong>. Sila hadir ke cawangan atau tunggu notifikasi pembayaran.</div>
                    </div>
                  </div>
                  <div class="text-sm text-gray-600 space-y-1">
                    <div><strong>No. Rujukan:</strong> {{ route.params.id }}</div>
                    <div><strong>Tarikh Keputusan:</strong> {{ formatDate(new Date()) }}</div>
                    <div><strong>Status:</strong> <span class="text-green-600 font-semibold">✅ Diluluskan</span></div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="space-y-2">
                  <div class="flex items-start gap-2">
                    <Icon name="heroicons:x-circle" class="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <div class="font-semibold text-gray-900">Permohonan Anda Tidak Diluluskan</div>
                      <div class="text-sm text-gray-600">Salam, permohonan bertarikh <em>{{ detail?.tarikhPermohonan || '[Tarikh]' }}</em> <strong class="text-red-600">tidak diluluskan</strong> setelah disemak oleh pelulus.</div>
                    </div>
                  </div>
                  <div class="text-sm text-gray-600 space-y-1">
                    <div v-if="sebab"><strong>Sebab:</strong> {{ sebab }}</div>
                    <div><strong>No. Rujukan:</strong> {{ route.params.id }}</div>
                    <div><strong>Tarikh Keputusan:</strong> {{ formatDate(new Date()) }}</div>
                  </div>
                </div>
              </template>
            </div>
          </rs-fieldset>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex justify-end mt-6 pt-4 border-t">
          <rs-button
            variant="secondary-outline"
            @click="goToList"
          >
            <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
            Ke Senarai
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Toasts -->
    <div class="fixed bottom-4 right-4 space-y-2 z-50">
      <div v-for="t in toasts" :key="t.id" class="px-4 py-2 rounded shadow bg-black text-white text-sm">
        {{ t.msg }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, navigateTo } from '#app'

definePageMeta({
  title: 'Notifikasi Keputusan',
  description: 'Hantar notifikasi keputusan permohonan bantuan khas'
})

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
    name: "Notifikasi Keputusan",
    type: "current",
    path: `/BF-BTN/PB/KH/03/${route.params.id}`,
  },
])

// Mock data - get details from KH-02 data
const details = [
  {
    noRujukan: 'B102',
    aidName: 'Barangan Dapur Asas',
    namaPemohon: 'Ahmad Bin Ali',
    tarikhPermohonan: '21-07-2025',
  },
  {
    noRujukan: 'B300',
    aidName: 'Sewa Rumah',
    namaPemohon: 'Siti Aminah',
    tarikhPermohonan: '22-07-2025',
  },
  {
    noRujukan: 'B307',
    aidName: 'Bantuan Perubatan',
    namaPemohon: 'Mohd Razak bin Ibrahim',
    tarikhPermohonan: '23-07-2025',
  },
  {
    noRujukan: 'B201',
    aidName: 'Bantuan Pendidikan',
    namaPemohon: 'Fatimah binti Omar',
    tarikhPermohonan: '24-07-2025',
  },
  {
    noRujukan: 'B305',
    aidName: 'Bantuan Makanan',
    namaPemohon: 'Rashid Bin Omar',
    tarikhPermohonan: '25-07-2025',
  },
  {
    noRujukan: 'B108',
    aidName: 'Bantuan Rumah',
    namaPemohon: 'Aishah Bt Abdullah',
    tarikhPermohonan: '26-07-2025',
  },
  {
    noRujukan: 'B402',
    aidName: 'Bantuan Kenderaan',
    namaPemohon: 'Ismail Bin Ahmad',
    tarikhPermohonan: '27-07-2025',
  }
]

const detail = computed(() => details.find(d => d.noRujukan === String(route.params.id)) || null)

const keputusan = ref('Lulus')
const sebab = ref('')

const keputusanOptions = [
  { label: 'Lulus', value: 'Lulus' },
  { label: 'Tidak Lulus', value: 'Tidak Lulus' }
]

const formatDate = (date) => {
  return date.toLocaleDateString('ms-MY', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

let toastId = 1
const toasts = ref([])

function toast(msg) {
  const id = toastId++
  toasts.value.push({ id, msg })
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 3000)
}

function triggerToast() {
  if (keputusan.value === 'Lulus') {
    toast('Keputusan telah dihantar kepada pemohon.')
  } else {
    toast('Keputusan ditolak telah dihantar kepada pemohon.')
  }
}

function goToList() { 
  navigateTo('/BF-BTN/PB/KH/01') 
}
</script>

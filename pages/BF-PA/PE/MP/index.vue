<!-- 
  RTMF SCREEN: PA-PE-MP-01_01
  PURPOSE: Unified Dashboard - Pengurusan Elaun bagi Mesyuarat/Program
  DESCRIPTION: Dynamic dashboard with role-based content for Meeting/Program allowance management
  ROUTE: /BF-PA/PE/MP
-->
<template>
  <div class="p-4 space-y-4">
    <!-- Breadcrumb ringkas -->
    <nav class="text-sm text-gray-500">
      Pengurusan Elaun › Elaun Tahunan › <span class="text-gray-900 font-medium">Isi Maklumat Penerima</span>
    </nav>

    <!-- KAD UTAMA -->
    <div class="rounded-xl border bg-white shadow-sm">
      <!-- Header -->
      <div class="px-5 py-4 border-b flex items-center justify-between">
        <h2 class="text-lg font-semibold">Borang Isi Maklumat Penerima Elaun Tahunan</h2>
        <span v-if="locked" class="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">Draft Terkunci</span>
      </div>

      <!-- Body -->
      <div class="p-5 space-y-5">

        <!-- Filter -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="text-sm font-medium">Tahun Elaun <span class="text-red-500">*</span></label>
            <select class="mt-1 w-full border rounded-lg px-3 py-2"
                    v-model="filters.year" :disabled="locked">
              <option value="" disabled>Pilih tahun…</option>
              <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Wajib dipilih; memandu skop data penerima & kawalan konflik tahun.</p>
          </div>

          <div>
            <label class="text-sm font-medium">Jawatan (pilihan)</label>
            <select class="mt-1 w-full border rounded-lg px-3 py-2"
                    v-model="filters.role" :disabled="locked">
              <option value="">Semua</option>
              <option value="Penolong Amil">Penolong Amil</option>
              <option value="Ketua Penolong Amil">Ketua Penolong Amil</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Menapis paparan jadual; tidak mengubah kelayakan asas.</p>
          </div>

          <div class="self-end">
            <div class="text-sm">
              <span class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border">
                <span class="font-medium">Dipilih:</span> {{ selectedCount }}
              </span>
            </div>
          </div>
        </template>

        <template #body>
          <!-- Smart Filter Section -->
            <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                v-model="filters.searchQuery"
                  type="text"
                  placeholder="Cari Kod Aktiviti atau Nama Aktiviti..."
                :classes="{
                  input: '!py-2',
                }"
              />
              <rs-button
                variant="primary"
                @click="performSearch"
                class="!py-2 !px-4"
              >
                <Icon name="ic:baseline-search" class="w-4 h-4 mr-2" />
                Cari
              </rs-button>
            </div>
            </div>

          <!-- Tabbed Table Section -->
          <rs-tab v-model="activeTab" class="mt-4">
            <rs-tab-item title="Sedang Proses">
              <div class="p-4">
                <rs-table
                  :key="`table-${tableKey}-pending`"
                  :data="getTableDataByStatus(['Sedang Proses'])"
                  :columns="ketuaJabatanColumns"
                  :pageSize="pageSize"
                  :options="{
                    variant: 'default',
                    hover: true,
                    striped: true,
                  }"
                  :options-advanced="{
                    sortable: true,
                    filterable: false,
                  }"
                  advanced
                >
                  <template v-slot:status="{ text }">
                    <rs-badge :variant="getStatusVariant(text)">
                      {{ getStatusLabel(text) }}
                    </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-1">
                      <button
                        @click="handleView(text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Lulus">
              <div class="p-4">
                <rs-table
                  :key="`table-${tableKey}-approved`"
                  :data="getTableDataByStatus(['Lulus'])"
                  :columns="ketuaJabatanApprovedColumns"
                  :pageSize="pageSize"
                  :options="{
                    variant: 'default',
                    hover: true,
                    striped: true,
                  }"
                  :options-advanced="{
                    sortable: true,
                    filterable: false,
                  }"
                  advanced
                >
                  <template v-slot:status="{ text }">
                    <rs-badge :variant="getStatusVariant(text)">
                      {{ getStatusLabel(text) }}
                    </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-1">
                      <button
                        @click="handleView(text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Ditolak">
              <div class="p-4">
                <rs-table
                  :key="`table-${tableKey}-rejected`"
                  :data="getTableDataByStatus(['Ditolak'])"
                  :columns="ketuaJabatanColumns"
                  :pageSize="pageSize"
                  :options="{
                    variant: 'default',
                    hover: true,
                    striped: true,
                  }"
                  :options-advanced="{
                    sortable: true,
                    filterable: false,
                  }"
                  advanced
                >
                  <template v-slot:status="{ text }">
                    <rs-badge :variant="getStatusVariant(text)">
                      {{ getStatusLabel(text) }}
                    </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-1">
                      <button
                        @click="handleView(text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>
          </rs-tab>
        </template>
      </rs-card>


    </div>

    <!-- Ketua Divisyen Dashboard Content -->
    <div v-if="currentRole === 'ketua-divisyen'">
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-xl font-semibold">
                Senarai Elaun Penolong Amil (Ketua Divisyen) - Mesyuarat/Program
              </h2>
            </div>
          </div>
        </template>

        <template #body>
          <!-- Smart Filter Section -->
            <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                v-model="filters.searchQuery"
                  type="text"
                  placeholder="Cari Kod Aktiviti atau Nama Aktiviti..."
                :classes="{
                  input: '!py-2',
                }"
              />
              <rs-button
                variant="primary"
                @click="performSearch"
                class="!py-2 !px-4"
              >
                <Icon name="ic:baseline-search" class="w-4 h-4 mr-2" />
                Cari
              </rs-button>
            </div>
            </div>

          <!-- Tabbed Table Section -->
          <rs-tab v-model="activeTab" class="mt-4">
            <rs-tab-item title="Sedang Proses">
              <div class="p-4">
                <rs-table
                  :key="`table-${tableKey}-pending`"
                  :data="getTableDataByStatus(['Sedang Proses'])"
                  :columns="ketuaDivisyenColumns"
                  :pageSize="pageSize"
                  :options="{
                    variant: 'default',
                    hover: true,
                    striped: true,
                  }"
                  :options-advanced="{
                    sortable: true,
                    filterable: false,
                  }"
                  advanced
                >
                  <template v-slot:status="{ text }">
                    <rs-badge :variant="getStatusVariant(text)">
                      {{ getStatusLabel(text) }}
                    </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-1">
                      <button
                        @click="handleView(text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Lulus">
              <div class="p-4">
                <rs-table
                  :key="`table-${tableKey}-approved`"
                  :data="getTableDataByStatus(['Lulus'])"
                  :columns="ketuaDivisyenApprovedColumns"
                  :pageSize="pageSize"
                  :options="{
                    variant: 'default',
                    hover: true,
                    striped: true,
                  }"
                  :options-advanced="{
                    sortable: true,
                    filterable: false,
                  }"
                  advanced
                >
                  <template v-slot:status="{ text }">
                    <rs-badge :variant="getStatusVariant(text)">
                      {{ getStatusLabel(text) }}
                    </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-1">
                      <button
                        @click="handleView(text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Ditolak">
              <div class="p-4">
                <rs-table
                  :key="`table-${tableKey}-rejected`"
                  :data="getTableDataByStatus(['Ditolak'])"
                  :columns="ketuaDivisyenColumns"
                  :pageSize="pageSize"
                  :options="{
                    variant: 'default',
                    hover: true,
                    striped: true,
                  }"
                  :options-advanced="{
                    sortable: true,
                    filterable: false,
                  }"
                  advanced
                >
                  <template v-slot:status="{ text }">
                    <rs-badge :variant="getStatusVariant(text)">
                      {{ getStatusLabel(text) }}
                    </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-1">
                      <button
                        @click="handleView(text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>
          </rs-tab>
        </template>
      </rs-card>


    </div>

    <!-- Modals -->
    <!-- Support Confirmation Modal -->
    <rs-modal
      v-model="showSupportModal"
      title="Sahkan Sokongan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <Icon
            name="ic:baseline-check-circle"
            class="text-green-500 text-5xl mb-4"
          />
          <p class="text-lg mb-2">
            Adakah anda pasti untuk memberikan sokongan kepada aktiviti ini?
          </p>
          <p class="text-gray-600">
            Aktiviti ini akan dihantar kepada Ketua Jabatan untuk kelulusan seterusnya.
          </p>
        </div>

        <!-- Jadual penerima -->
        <div class="overflow-x-auto rounded-lg border">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50">
              <tr class="text-left">
                <th class="px-4 py-3 w-10">
                  <input type="checkbox" :disabled="locked || !canBulkToggle"
                         :checked="allVisibleChecked" @change="toggleAll($event.target.checked)" />
                </th>
                <th class="px-4 py-3">Nama Penuh</th>
                <th class="px-4 py-3">ID Pengenalan</th>
                <th class="px-4 py-3">Jawatan</th>
                <th class="px-4 py-3">Tahun Elaun</th>
                <th class="px-4 py-3">Status Perkhidmatan</th>
                <th class="px-4 py-3">Kategori</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pa in visibleRows" :key="pa.id"
                  class="border-t">
                <td class="px-4 py-2">
                  <input type="checkbox" v-model="selectedIds"
                         :value="pa.id" :disabled="locked || !pa.isActive"/>
                </td>
                <td class="px-4 py-2">{{ pa.name }}</td>
                <td class="px-4 py-2">{{ pa.nric }}</td>
                <td class="px-4 py-2">{{ pa.role }}</td>
                <td class="px-4 py-2">{{ filters.year || '—' }}</td>
                <td class="px-4 py-2">
                  <span class="px-2 py-1 rounded-full text-xs"
                        :class="pa.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            : 'bg-rose-50 text-rose-700 border border-rose-200'">
                    {{ pa.isActive ? 'Aktif' : 'Tidak Aktif' }}
                  </span>
                </td>
                <td class="px-4 py-2">{{ pa.category }}</td>
              </tr>
              <tr v-if="visibleRows.length === 0">
                <td colspan="7" class="px-4 py-6 text-center text-gray-500">Tiada rekod untuk penapis semasa.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Nota kelayakan -->
        <div class="text-xs text-gray-600">
          <p>• Sumber data: rekod PA <b>Aktif</b> pada tarikh rujukan <i>Tahun Elaun</i>. PA tidak aktif disembunyikan daripada pemilihan.</p>
          <p>• Checkbox “Layak” menandakan penerima untuk batch tahun berkenaan (disahkan ketika Simpan).</p>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between pt-2">
          <button type="button" class="px-4 py-2 rounded-lg border hover:bg-gray-50"
                  @click="goBack" :disabled="saving">Kembali</button>

          <!-- Butang Simpan -->
          <button type="button"
                  class="px-4 py-2 rounded-lg text-white disabled:opacity-50"
                  :class="locked ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'"
                  :disabled="!canSave || locked || saving"
                  @click="saveBatch">
            <span v-if="!locked">Simpan</span>
            <span v-else>Draft Terkunci</span>
          </button>
        </div>

        <!-- Mesej berjaya -->
        <div v-if="toast" class="mt-2 text-sm px-3 py-2 rounded-md border bg-green-50 text-green-700">
          {{ toast }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ---------- MOCK DATA: Senarai PA aktif (contoh) ----------
const allCandidates = ref([
  { id: 'PA001', name: 'Ahmad bin Ismail', nric: '880101-14-1234', role: 'Penolong Amil', category: 'PAK', isActive: true },
  { id: 'PA002', name: 'Siti Aisyah binti Zainal', nric: '900202-10-5678', role: 'Penolong Amil', category: 'PAF', isActive: true },
  { id: 'PA003', name: 'Faizal bin Rahman', nric: '850909-01-1122', role: 'Ketua Penolong Amil', category: 'PAK+', isActive: true },
  { id: 'PA004', name: 'Noraini binti Omar', nric: '920606-08-7788', role: 'Penolong Amil', category: 'PAP', isActive: false }, // akan disorok
])

// ---------- State Filter ----------
const currentYear = new Date().getFullYear()
const yearOptions = Array.from({length: 5}, (_,i) => currentYear - 1 + i) // contoh: tahun semasa ±
const filters = ref({
  year: '',
  role: '' // '' | 'Penolong Amil' | 'Ketua Penolong Amil'
})

// ---------- Pemilihan ----------
const selectedIds = ref([]) // ID PA ditandakan 'Layak'

// ---------- Status Simpan / Kunci Draft ----------
const locked = ref(false)
const saving = ref(false)
const toast = ref('')

// ---------- Derivations ----------
const visibleRows = computed(() => {
  // hanya PA aktif, dan ikut filter jawatan
  return allCandidates.value
    .filter(pa => pa.isActive)
    .filter(pa => !filters.value.role || pa.role === filters.value.role)
})

const selectedCount = computed(() => selectedIds.value.length)

const canBulkToggle = computed(() => visibleRows.value.length > 0 && !locked.value)
const allVisibleChecked = computed(() => {
  if (visibleRows.value.length === 0) return false
  return visibleRows.value.every(pa => selectedIds.value.includes(pa.id))
})

const canSave = computed(() => {
  return !!filters.value.year && selectedIds.value.length > 0
})

// ---------- Actions ----------
function toggleAll(checked) {
  if (!canBulkToggle.value) return
  if (checked) {
    selectedIds.value = visibleRows.value.map(pa => pa.id)
  } else {
    selectedIds.value = []
  }
}

function goBack() {
  // letak routing sebenar jika ada
  console.info('Kembali ke senarai Elaun Tahunan')
}

function generateBatchId(year) {
  const rand = Math.floor(100000 + Math.random() * 900000)
  return `ET01-${year}-${rand}`
}

async function saveBatch() {
  if (!canSave.value || locked.value) return
  saving.value = true
  toast.value = ''

  try {
    // 1) Validasi server-side (disimulasikan)
    // - Pastikan semua PA masih aktif & tiada duplikasi pada tahun
    const chosen = allCandidates.value.filter(x => selectedIds.value.includes(x.id))
    const invalid = chosen.filter(x => !x.isActive)
    if (invalid.length) throw new Error('Terdapat calon tidak aktif.')

    // 2) Simpan dataset penerima + metadata batch
    const batchId = generateBatchId(filters.value.year)
    const payload = {
      batchId,
      year: filters.value.year,
      creator: 'LOGIN_USER_ID', // ganti dengan ID login sebenar
      timestamp: new Date().toISOString(),
      recipients: chosen.map(x => ({
        id: x.id, name: x.name, nric: x.nric, role: x.role, category: x.category
      }))
    }
    console.debug('SIMPAN ET-01 PAYLOAD', payload)

    // 3) Tetapkan status proses: Draft Terkunci
    locked.value = true

    // 4) Trigger ET-02 (asynchronous) — simulasi
    triggerET02(batchId)

    // 5) Mesej berjaya
    toast.value = 'Senarai penerima elaun tahunan berjaya disimpan dan dihantar untuk proses pengiraan.'
  } catch (e) {
    toast.value = e?.message || 'Ralat tidak dijangka semasa simpanan.'
  } finally {
    saving.value = false
    // auto-clear mesej
    setTimeout(() => (toast.value = ''), 5000)
  }
}

function triggerET02(batchId) {
  // Di dunia sebenar: panggil API /jobs/et02?batchId=...
  console.info(`Trigger ET-02 untuk batch: ${batchId}`)
}
</script>

<style scoped>
/* gaya ringkas; gantikan dengan design system projek jika ada */
</style>

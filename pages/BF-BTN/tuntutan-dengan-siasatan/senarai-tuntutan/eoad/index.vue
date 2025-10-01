<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Tuntutan</h2>
        </div>
      </template>

      <template #body>
        <!-- Main Table -->
        <rs-table
          :data="tableDataWithNo"
          :columns="columns"
          :showNoColumn="true"
          :showSearch="true"
          :options="{ variant: 'default', hover: true, striped: true }"
          :options-advanced="{ sortable: true, filterable: true }"
          :show-filter="true"
          advanced
        >
          <template #noTuntutan="{ text }">
            <a href="#" class="text-primary-600 hover:text-primary-800" @click.prevent="viewTuntutan(text)">
              {{ text }}
            </a>
          </template>

          <template #amaunTuntutan="{ text }">
            <div class="font-medium text-right">RM {{ formatNumber(Number(text)) }}</div>
          </template>

          <template #tarikhTuntutan="{ text }">
            <div>
              <div class="font-medium">{{ formatDate(text) }}</div>
              <div class="text-sm text-gray-500">{{ formatTime(text) }}</div>
            </div>
          </template>

          <template #statusPermohonan="{ text }">
            <rs-badge :variant="getStatusVariant(text)">{{ text }}</rs-badge>
          </template>

          <template #tindakan="{ value }">
            <div class="flex space-x-2">
              <rs-button
                v-if="getTindakanFrom(value).status === 'Dalam Semakan'"
                variant="ghost"
                size="sm"
                class="!px-2 !py-1 text-blue-600 hover:text-blue-800"
                @click="handleSemakPengesahan(getTindakanFrom(value).noTuntutan)"
                title="Semak"
                aria-label="Semak"
              >
                <Icon name="ph:check" class="w-5 h-5" />
              </rs-button>
            </div>
          </template>
        </rs-table>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-5 mt-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">Baris per halaman:</span>
            <FormKit
              v-model="pageSize"
              type="select"
              :options="[10, 25, 50]"
              :classes="{ wrapper: 'w-20', outer: 'mb-0', input: '!rounded-lg' }"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">
              Menunjukkan {{ paginationStart }} hingga {{ paginationEnd }} daripada {{ totalTuntutan }} entri
            </span>
            <div class="flex gap-1">
              <rs-button variant="primary-outline" class="!p-1 !w-8 !h-8" :disabled="currentPage === 1" @click="currentPage--">
                <Icon name="ic:round-keyboard-arrow-left" />
              </rs-button>
              <rs-button
                variant="primary-outline"
                class="!p-1 !w-8 !h-8"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                <Icon name="ic:round-keyboard-arrow-right" />
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Bulk Approval Button at Bottom -->
    <div v-if="selectedRows.length > 0" class="mt-4 flex justify-end">
      <rs-button variant="success" @click="handleBulkApproval" :disabled="processing">
        <Icon name="material-symbols:approval" class="w-4 h-4 mr-1" />
        Pengesahan (Bulk) ({{ selectedRows.length }})
      </rs-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNuxtApp, navigateTo } from '#app'

definePageMeta({ title: 'Senarai Semua Tuntutan (EOAD / ETD)' })

/** ========== Local Types & helpers (no external file) ========== */
type StatusPermohonan =
  | 'Dalam Semakan'
  | 'Untuk Kelulusan'
  | 'Perlu Penambahbaikan'
  | 'Diluluskan'
  | 'Ditolak'

const statusVariant = (s: StatusPermohonan): 'warning' | 'primary' | 'secondary' | 'success' | 'danger' => {
  switch (s) {
    case 'Dalam Semakan': return 'warning'
    case 'Untuk Kelulusan': return 'primary'
    case 'Perlu Penambahbaikan': return 'secondary'
    case 'Diluluskan': return 'success'
    case 'Ditolak': return 'danger'
    default: return 'secondary'
  }
}

type TuntutanListItem = {
  noTuntutan: string
  noGL: string
  namaPemohon: string
  tarikhTuntutan: string
  amaunTuntutan: number
  statusPermohonan: StatusPermohonan
}

type TindakanCell = { noTuntutan: string; status: string }
type Row = TuntutanListItem & { tindakan: TindakanCell }

const breadcrumb = ref([
  { name: 'Pengurusan Bantuan', type: 'link', path: '/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/eoad' },
  { name: 'Tuntutan', type: 'link', path: '/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/eoad' },
  { name: 'Semakan Tuntutan', type: 'current', path: '/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/eoad' },
])


/** ========== Seed list (local only to this file) ========== */
const baseList = ref<TuntutanListItem[]>([
  { noTuntutan: 'TUN-2024-001', noGL: 'GL-001-2024', namaPemohon: 'Masjid Al-Fatonah', tarikhTuntutan: new Date().toISOString(), amaunTuntutan: 5000.0, statusPermohonan: 'Dalam Semakan' },
  { noTuntutan: 'TUN-2024-002', noGL: 'GL-002-2024', namaPemohon: 'PUSAT HEMODIALISIS PERMATA SDN. BHD.', tarikhTuntutan: new Date(Date.now() - 86400000).toISOString(), amaunTuntutan: 8000.0, statusPermohonan: 'Dalam Semakan' },
  { noTuntutan: 'TUN-2024-003', noGL: 'GL-003-2024', namaPemohon: 'Mohd Fazlan bin Mohd Fazli', tarikhTuntutan: new Date(Date.now() - 172800000).toISOString(), amaunTuntutan: 12000.0, statusPermohonan: 'Dalam Semakan' },
  { noTuntutan: 'TUN-2024-004', noGL: 'GL-004-2024', namaPemohon: 'Surau Kampung Baru', tarikhTuntutan: new Date(Date.now() - 259200000).toISOString(), amaunTuntutan: 3500.0, statusPermohonan: 'Dalam Semakan' },
  { noTuntutan: 'TUN-2024-005', noGL: 'GL-005-2024', namaPemohon: 'Pusat Tahfiz Al-Quran', tarikhTuntutan: new Date(Date.now() - 345600000).toISOString(), amaunTuntutan: 15000.0, statusPermohonan: 'Dalam Semakan' },
])

const tuntutanList = ref<Row[]>(
  baseList.value.map((r, idx) => ({
    ...r,
    maklumatBantuan:
      r.noTuntutan === 'TUN-2024-004'
        ? 'BANTUAN PROGRAM PENERAPAN NILAI ISLAM (B134)'
        : idx % 2 === 0
        ? '(HQ) BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA (B400)'
        : '(HQ) BANTUAN PERUBATAN DIALISIS (FAKIR) (B103)',
    tindakan: { noTuntutan: r.noTuntutan, status: r.statusPermohonan },
  }))
)

/** ========== Table config ========== */
const columns = [
  { key: 'noTuntutan', label: 'No. Tuntutan', sortable: true },
  { key: 'namaPemohon', label: 'Nama Pemohon / Institusi', sortable: true },
  { key: 'tarikhTuntutan', label: 'Tarikh Tuntutan', sortable: true },
  { key: 'amaunTuntutan', label: 'Amaun Tuntutan (RM)', sortable: true },
  { key: 'statusPermohonan', label: 'Status Permohonan', sortable: true },
  { key: 'tindakan', label: 'Tindakan', sortable: false },
]

/** ========== Filters, pagination, selection ========== */
const searchQuery = ref('')
const filters = ref({ status: '' })
const pageSize = ref(10)
const currentPage = ref(1)
const selectedRows = ref<string[]>([])
const processing = ref(false)

const filteredTuntutan = computed(() => {
  let filtered = [...tuntutanList.value]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (i) =>
        i.noTuntutan.toLowerCase().includes(q) ||
        i.namaPemohon.toLowerCase().includes(q) ||
        i.noGL.toLowerCase().includes(q)
    )
  }
  if (filters.value.status) {
    filtered = filtered.filter((i) => i.statusPermohonan === filters.value.status)
  }
  return filtered
})

const totalTuntutan = computed(() => filteredTuntutan.value.length)
const totalPages = computed(() => Math.ceil(totalTuntutan.value / pageSize.value))
const paginationStart = computed(() => (currentPage.value - 1) * pageSize.value + 1)
const paginationEnd = computed(() => Math.min(currentPage.value * pageSize.value, totalTuntutan.value))

const tableDataWithNo = computed<Row[]>(() =>
  filteredTuntutan.value.map((row) => ({
    ...row,
    tindakan: { noTuntutan: row.noTuntutan, status: row.statusPermohonan },
  }) as Row)
)

/** ========== Utils ========== */
const formatDate = (s: string) => new Date(s).toLocaleDateString('ms-MY')
const formatTime = (s: string) => new Date(s).toLocaleTimeString('ms-MY')
const formatNumber = (n: number) =>
  new Intl.NumberFormat('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(Number.isFinite(n) ? n : 0)

const getStatusVariant = (status: string) => statusVariant(status as StatusPermohonan)
const asRow = (v: unknown) => v as Row
const getTindakanFrom = (slotValue: unknown): { noTuntutan: string; status: string } => {
  const v: any = slotValue
  if (v && typeof v === 'object') {
    if ('noTuntutan' in v && 'status' in v) return { noTuntutan: v.noTuntutan, status: v.status }
    if ('noTuntutan' in v && 'statusPermohonan' in v) return { noTuntutan: v.noTuntutan, status: v.statusPermohonan }
    if (v.tindakan && 'noTuntutan' in v.tindakan && 'status' in v.tindakan) return { noTuntutan: v.tindakan.noTuntutan, status: v.tindakan.status }
  }
  return { noTuntutan: '', status: '' }
}

/** ========== Actions ========== */
const { $swal } = useNuxtApp() as any

const viewTuntutan = (noTuntutan: string) => {
  navigateTo(`/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/eoad/${noTuntutan}/pengesahan`)
}
const handleSemakPengesahan = (noTuntutan: string) => viewTuntutan(noTuntutan)

const onCheckboxChange = (event: Event, row: any) => {
  const input = event.target as HTMLInputElement
  if (input.checked) {
    if (!selectedRows.value.includes(row.noTuntutan)) selectedRows.value.push(row.noTuntutan)
  } else {
    selectedRows.value = selectedRows.value.filter((id) => id !== row.noTuntutan)
  }
}

const handleBulkApproval = async () => {
  try {
    processing.value = true
    const result = await $swal.fire({
      icon: 'question',
      title: 'Pengesahan (Bulk)',
      text: `Adakah anda pasti untuk mengesahkan ${selectedRows.value.length} tuntutan yang dipilih?`,
      showCancelButton: true,
      confirmButtonText: 'Ya, Sahkan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#10b981',
    })
    if (result.isConfirmed) {
      await new Promise((r) => setTimeout(r, 800))
      await $swal.fire({ icon: 'success', title: 'Berjaya!', text: 'Semua permohonan yang dipilih telah berjaya disahkan' })
      selectedRows.value = []
    }
  } catch {
    await $swal.fire({ icon: 'error', title: 'Ralat', text: 'Ralat telah berlaku semasa memproses pengesahan bulk' })
  } finally {
    processing.value = false
  }
}
</script>

<style scoped lang="scss"></style>

<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Audit Trail Bantuan</h2>
          <rs-button
            variant="primary-outline"
            size="sm"
            @click="exportAuditTrail"
            :disabled="!auditTrails.length"
          >
            <Icon name="mdi:file-export" class="mr-1" size="1rem" />
            Eksport
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Filters -->
        <div class="mb-6 flex flex-wrap gap-4">
          <rs-select
            v-model="filters.status"
            placeholder="Filter by Status"
            class="w-48"
            clearable
          >
            <rs-option
              v-for="status in statusOptions"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </rs-select>

          <rs-date-picker
            v-model="filters.dateRange"
            type="daterange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            class="w-64"
          />
        </div>

        <!-- Audit Trail Table -->
        <rs-empty-state
          v-if="!filteredAuditTrails.length"
          label="Tiada sejarah perubahan"
        />

        <rs-table
          v-else
          :data="filteredAuditTrails"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:tarikh="data: TableData">
            {{ formatDate(new Date(data.text)) }}
          </template>

          <template v-slot:perubahan="data: TableData">
            <div class="grid grid-cols-1 gap-1">
              <div v-for="(change, index) in data.value.perubahan" :key="index">
                <span class="font-medium">{{ change.field }}:</span>
                <span class="line-through text-red-500 ml-1">{{
                  change.from || "-"
                }}</span>
                <span class="text-green-500 ml-1">{{
                  change.to || "-"
                }}</span>
              </div>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { format } from 'date-fns'

// Breadcrumb configuration
const breadcrumb = ref([
  {
    name: "Bantuan",
    type: "link",
    path: "/BF-BTN/KB/SB/01",
  },
  {
    name: "Audit Trail",
    type: "current",
    path: "/BF-BTN/KB/SB/05",
  },
])

interface AuditTrail {
  id: string
  tarikh: Date
  pengguna: string
  tindakan: string
  modul: string
  perubahan: Array<{
    field: string
    from: string | null
    to: string | null
  }>
}

interface Filters {
  status: string | null
  dateRange: [Date | null, Date | null]
}

interface Change {
  field: string
  from: string | null
  to: string | null
}

interface TableRow {
  tarikh: Date
  pengguna: string
  tindakan: string
  modul: string
  perubahan: Change[]
}

interface TableSlotProps {
  row: TableRow
}

interface TableData {
  text: string | Date
  value: {
    perubahan: Change[]
  }
}

const statusOptions = [
  { label: "Dicipta", value: "created" },
  { label: "Diluluskan", value: "approved" },
  { label: "Ditolak", value: "rejected" },
  { label: "Dikemaskini", value: "modified" },
]

const filters = ref<Filters>({
  status: null,
  dateRange: [null, null],
})

const auditTrails = ref<AuditTrail[]>([
  {
    id: "1",
    tarikh: new Date("2024-03-15T10:00:00"),
    pengguna: "admin.zakat",
    tindakan: "Tambah",
    modul: "Bantuan",
    perubahan: [
      { field: "Jumlah", from: null, to: "RM 1,000" },
      { field: "Tujuan", from: null, to: "Bantuan Pendidikan" },
      { field: "Status", from: null, to: "Dicipta" },
    ],
  },
  {
    id: "2",
    tarikh: new Date("2024-03-15T11:30:00"),
    pengguna: "supervisor.zakat",
    tindakan: "Kemaskini",
    modul: "Bantuan",
    perubahan: [
      { field: "Status", from: "Dicipta", to: "Diluluskan" },
      { field: "Catatan", from: null, to: "Diluluskan oleh supervisor" },
    ],
  },
  {
    id: "3",
    tarikh: new Date("2024-03-15T14:15:00"),
    pengguna: "admin.zakat",
    tindakan: "Kemaskini",
    modul: "Bantuan",
    perubahan: [
      { field: "Jumlah", from: "RM 1,000", to: "RM 1,500" },
      { field: "Tujuan", from: "Bantuan Pendidikan", to: "Bantuan Pendidikan & Perubatan" },
    ],
  },
])

const filteredAuditTrails = computed(() => {
  return auditTrails.value.filter(trail => {
    const matchesStatus = !filters.value.status || trail.tindakan.toLowerCase() === filters.value.status
    const matchesDate = !filters.value.dateRange[0] || !filters.value.dateRange[1] ||
      (trail.tarikh >= filters.value.dateRange[0]! && 
       trail.tarikh <= filters.value.dateRange[1]!)
    return matchesStatus && matchesDate
  })
})

const formatDate = (date: Date) => {
  return format(date, "dd/MM/yyyy HH:mm")
}

const exportAuditTrail = async () => {
  try {
    // Implement export logic here
    await new Promise(resolve => setTimeout(resolve, 800))
    alert("Audit trail telah berjaya dieksport")
  } catch (error) {
    alert("Gagal mengeksport audit trail. Sila cuba sebentar lagi.")
    console.error("Export error:", error)
  }
}
</script>

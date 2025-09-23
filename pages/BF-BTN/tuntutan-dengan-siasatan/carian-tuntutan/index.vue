<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="mt-2">
      <h3 class="text-lg font-semibold">Senarai Bantuan untuk Tuntutan</h3>
    </div>

    <!-- Card: Carian Bantuan -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Carian Bantuan</h2>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          :actions="false"
          class="max-w-2xl mx-auto"
          v-model="formData"
        >
          <div class="grid grid-cols-1 gap-4">
            <FormKit type="text" name="noBantuan" label="No. Bantuan" placeholder="Masukkan No. Bantuan" />
            <FormKit type="text" name="namaAsnaf" label="Nama Asnaf (Penerima Manfaat)" placeholder="Masukkan Nama Asnaf" />
            <FormKit type="text" name="noKpAsnaf" label="No. Kad Pengenalan Asnaf" placeholder="Masukkan No. Kad Pengenalan Asnaf" />
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <rs-button variant="secondary" @click.prevent="handleReset">Reset</rs-button>
            <!-- Use click handler instead of type=submit -->
            <rs-button variant="primary" :disabled="isFormBlank" @click.prevent="handleSubmit">
              Carian
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- ✅ Card: Senarai Bantuan only shows after clicking Carian -->
    <rs-card v-if="showResults" ref="resultsCard" class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Bantuan</h2>
        </div>
      </template>

      <template #body>
        <RsTable
          :data="pagedRows"
          :columns="columns"
          :showNoColumn="true"
          advanced
          :showSearch="true"
          :showFilter="true"
        >
          <template #maklumatBantuan="{ text }"><div>{{ text }}</div></template>
          <template #pemohon="{ text }"><div>{{ text || '-' }}</div></template>
          <template #namaPenerimaManfaat="{ text }"><div>{{ text }}</div></template>
          <template #noKPPemohon="{ text }"><div>{{ text }}</div></template>
          <template #namaPenerima="{ text }"><div>{{ text }}</div></template>
          <template #tarikhMohon="{ text }"><div>{{ formatDate(text) }}</div></template>
          <template #tindakan="{ text, value }">
            <rs-button
              variant="ghost"
              size="sm"
              class="text-blue-600 hover:text-blue-800"
              @click="navigateTo(`/BF-BTN/tuntutan-dengan-siasatan/mohon-tuntutan/${(value || text)?.noBantuan || value || text}`)"
              title="Mohon Tuntutan"
            >
              <Icon name="material-symbols:add" size="24" />
            </rs-button>
          </template>
        </RsTable>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-5 mt-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">Baris per halaman:</span>
            <FormKit v-model="pageSize" type="select" :options="[10,25,50]" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">
              Menunjukkan {{ paginationStart }} hingga {{ paginationEnd }} daripada {{ totalBantuan }} entri
            </span>
            <div class="flex gap-1">
              <rs-button variant="primary-outline" :disabled="currentPage===1" @click="currentPage--">
                <Icon name="ic:round-keyboard-arrow-left" />
              </rs-button>
              <rs-button variant="primary-outline" :disabled="currentPage===totalPages" @click="currentPage++">
                <Icon name="ic:round-keyboard-arrow-right" />
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { navigateTo } from '#app'

definePageMeta({
  title: 'Borang Tambah Carian',
  description: 'Tambah rekod carian baru',
})

const breadcrumb = ref([
  { name: 'Pengurusan Bantuan', type: 'link', path: '/BF-BTN/tuntutan-dengan-siasatan' },
  { name: 'Tuntutan', type: 'link', path: '/BF-BTN/tuntutan-dengan-siasatan/carian-tuntutan' },
  { name: 'Mohon Tuntutan', type: 'current', path: '/BF-BTN/tuntutan-dengan-siasatan/mohon-tuntutan-asnaf' },
])

/* ---------------- Form ---------------- */
const formData = ref({ noBantuan: '', namaAsnaf: '', noKpAsnaf: '' })

/* ✅ helper: blank form? */
const isFormBlank = computed(() => {
  const f = formData.value
  return !f.noBantuan?.trim() && !f.namaAsnaf?.trim() && !f.noKpAsnaf?.trim()
})

/* ---------------- Results visibility ---------------- */
const showResults = ref(false)
const resultsCard = ref(null)

/* ✅ only show results if NOT blank; else keep hidden */
const handleSubmit = async () => {
  if (isFormBlank.value) {
    showResults.value = false
    return
  }
  showResults.value = true
  await nextTick()
  try {
    resultsCard.value?.$el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } catch {}
}

/* ✅ Reset also hides results */
const handleReset = () => {
  formData.value = { noBantuan: '', namaAsnaf: '', noKpAsnaf: '' }
  showResults.value = false
}

/* ✅ Auto-hide table whenever form becomes blank */
watch(formData, () => {
  if (isFormBlank.value) showResults.value = false
}, { deep: true })

/* ---------------- Table ---------------- */
const columns = [
  { key: 'noBantuan', label: 'No. Bantuan', sortable: true },
  { key: 'maklumatBantuan', label: 'Maklumat Bantuan', sortable: true },
  { key: 'pemohon', label: 'Pemohon', sortable: true },
  { key: 'namaPenerimaManfaat', label: 'Nama Penerima Manfaat', sortable: true },
  { key: 'noKPPemohon', label: 'No. KP Pemohon', sortable: true },
  { key: 'namaPenerima', label: 'Nama Penerima', sortable: true },
  { key: 'tarikhMohon', label: 'Tarikh Mohon', sortable: true },
  { key: 'tindakan', label: 'Tindakan', sortable: false },
]

const AYAH = 'ALI BIN MOHAMED'
const TARIKH_NOW = new Date().toISOString()
const bantuanList = ref([
  { noBantuan:'APP-2025-001481', maklumatBantuan:'(HQ) DERMASISWA IPT DALAM NEGARA (FAKIR) - IPTA/IPTS', pemohon:AYAH, namaPenerimaManfaat:'MOHD FARHAN BIN ALI', noKPPemohon:'940511146045', namaPenerima:'UPM', tarikhMohon:TARIKH_NOW, tindakan:{ noBantuan:'APP-2025-001481' } },
  { noBantuan:'APP-2025-001482', maklumatBantuan:'(HQ) DERMASISWA IPT DALAM NEGARA (FAKIR) - IPTA/IPTS', pemohon:AYAH, namaPenerimaManfaat:'MOHD FARHAN BIN ALI', noKPPemohon:'940511146045', namaPenerima:'MOHD FARHAN BIN ALI', tarikhMohon:new Date(Date.now()-86400000).toISOString(), tindakan:{ noBantuan:'APP-2025-001482' } },
  { noBantuan:'APP-2025-001483', maklumatBantuan:'(HQ) BANTUAN DERMASISWA SEKOLAH ASRAMA (FAKIR)', pemohon:AYAH, namaPenerimaManfaat:'ZAINAB BINTI ALI', noKPPemohon:'920511146555', namaPenerima:'SEKOLAH MENENGAH SAINS BANTING', tarikhMohon:new Date(Date.now()-172800000).toISOString(), tindakan:{ noBantuan:'APP-2025-001483' } },
  { noBantuan:'APP-2025-001484', maklumatBantuan:'(HQ) BANTUAN DERMASISWA SEKOLAH ASRAMA (FAKIR)', pemohon:AYAH, namaPenerimaManfaat:'ZAINAB BINTI ALI', noKPPemohon:'920511146555', namaPenerima:'ALI BIN MOHAMED', tarikhMohon:new Date(Date.now()-259200000).toISOString(), tindakan:{ noBantuan:'APP-2025-001484' } },
  // Tuntutan Dialisis mock data
  { noBantuan:'APP-2025-001485', maklumatBantuan:'(HQ) BANTUAN PERUBATAN DIALISIS (FAKIR)', pemohon:AYAH, namaPenerimaManfaat:'AHMAD BIN HASSAN', noKPPemohon:'850315123456', namaPenerima:'HOSPITAL SELAYANG', tarikhMohon:new Date(Date.now()-345600000).toISOString(), tindakan:{ noBantuan:'APP-2025-001485' } },
  { noBantuan:'APP-2025-001486', maklumatBantuan:'(HQ) BANTUAN PERUBATAN DIALISIS (FAKIR)', pemohon:AYAH, namaPenerimaManfaat:'FATIMAH BINTI MOHAMED', noKPPemohon:'880420234567', namaPenerima:'HOSPITAL KUALA LUMPUR', tarikhMohon:new Date(Date.now()-432000000).toISOString(), tindakan:{ noBantuan:'APP-2025-001486' } },
])

const searchQuery = ref('')
const pageSize = ref(10)
const currentPage = ref(1)
const selectedRows = ref([])
const processing = ref(false)

const filteredBantuan = computed(() => {
  let base = bantuanList.value

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    base = base.filter(i =>
      i.noBantuan.toLowerCase().includes(q) ||
      (i.namaPenerimaManfaat||'').toLowerCase().includes(q) ||
      (i.namaPenerima||'').toLowerCase().includes(q) ||
      (i.pemohon||'').toLowerCase().includes(q)
    )
  }
  if (formData.value.noBantuan) {
    const q = formData.value.noBantuan.trim().toLowerCase()
    base = base.filter(x => x.noBantuan.toLowerCase().includes(q))
  }
  if (formData.value.namaAsnaf) {
    const q = formData.value.namaAsnaf.trim().toLowerCase()
    base = base.filter(x => (x.namaPenerimaManfaat||'').toLowerCase().includes(q))
  }
  if (formData.value.noKpAsnaf) {
    const q = formData.value.noKpAsnaf.trim().toLowerCase()
    base = base.filter(x => (x.noKPPemohon||'').toLowerCase().includes(q))
  }

  return base
})

const totalBantuan = computed(() => filteredBantuan.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalBantuan.value / pageSize.value)))
const paginationStart = computed(() => (totalBantuan.value===0 ? 0 : (currentPage.value-1)*pageSize.value+1))
const paginationEnd = computed(() => Math.min(currentPage.value*pageSize.value, totalBantuan.value))
const tableDataWithNo = computed(() => filteredBantuan.value.map((r,i)=>({ ...r, no:i+1 })))
const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredBantuan.value.slice(start, start + pageSize.value)
})

watch([pageSize, totalBantuan], () => {
  const maxPage = Math.max(1, Math.ceil(totalBantuan.value / pageSize.value))
  if (currentPage.value > maxPage) currentPage.value = maxPage
  if (currentPage.value < 1) currentPage.value = 1
})

const formatDate = d => new Date(d).toLocaleDateString('ms-MY')
</script>

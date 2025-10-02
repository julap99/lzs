<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="material-symbols:list" class="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Senarai Bulk Processing</h2>
              <p class="text-sm text-gray-500">Senarai bantuan bulk processing</p>
            </div>
          </div>
          <!-- <rs-button variant="primary" @click="navigateTo('cipta-bantuan-bulk/tambah')">
            <Icon name="material-symbols:add" class="mr-1" /> Tambah
          </rs-button> -->
        </div>
      </template>

      <template #body>
              <rs-table
                :data="filteredBantuanBulk"
                :columns="columns"
                :pageSize="pageSize"
                :showNoColumn="true"
                :show-filter="true"
                :show-search="true"
                :options="{
                  variant: 'default',
                  hover: true,
                  striped: true,
                }"
                advanced
              >
                <!-- inside <rs-table> -->
              <template v-slot:id="data">
                <a href="#" class="text-primary-600 hover:text-primary-800" @click.prevent="viewBantuan(data.text)">
                  {{ data.text }}
                </a>
              </template>

                <template v-slot:tarikhMohon="data">
                  {{ formatDate(data.text) }}
                </template>

                <template v-slot:jumlahAmaun="data">
                  <div class="font-medium text-left">
                    {{ data.text }}
                  </div>
                </template>

                <template v-slot:status="data">
                  <rs-badge :variant="getStatusVariant(data.text)">
                    {{ data.text }}
                  </rs-badge>
                </template>

                <!-- Tindakan: show Edit + Delete only for Draf, else View -->
                  <!-- BP code column (clickable) -->
                <!-- <template #id="{ text: kodBP }">
                  <a href="#" class="text-primary-600 hover:text-primary-800" @click.prevent="viewBantuan(kodBP)">
                    {{ kodBP }}
                  </a>
                </template> -->

                <!-- Actions column -->
                    <template v-slot:actions="{ text, row}">
                    <div  class="flex justify-center items-center gap-2">
                      <!-- Edit -->
                      <rs-button
                        variant="primary"
                        size="sm"
                        @click.stop.prevent="openReassign(row)"
                        title="Reassign"
                      >
                        <Icon name="ic:outline-person" class="w-4 h-4" />
                      </rs-button>

                      <rs-button
                        variant="info"
                        size="sm"
                        class="p-1 w-8 h-8"
                        @click="viewBantuan(text)"
                        title="Lihat"
                      >
                        <Icon name="ic:outline-visibility" class="ic:outline-visibility" size="18" />
                      </rs-button>

                      <!-- Delete -->
                      <!-- <rs-button
                        variant="danger"
                        size="sm"
                        @click="confirmDelete(text)"
                        title="Hapus"
                      >
                        <Icon name="ic:outline-delete" class="w-4 h-4" />
                      </rs-button> -->

                      
                    </div>
                  </template>
              </rs-table> 
      </template>
    </rs-card>
    <!-- Delete Confirmation Modal -->
    <!-- Re-Assign Modal -->
    <rs-modal
      v-model="showReassignModal"
      title="Re-Assign Tugasan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-3">
          <p>Sila pilih pegawai untuk ditugaskan.</p>

          <!-- If your design system has rs-select -->
          <!-- <FormKit
            label="Nama Pegawai"
            placeholder="Pilih pegawai…"
            :options="pegawaiOptions"
            v-model="selectedPegawai"
            track-by="value"
            label-by="label"
            :disabled="reassignLoading"
            required
          /> -->

         
          <label class="block text-sm font-medium">Nama Pegawai</label>
          <select
            v-model="selectedPegawai"
            class="w-full border rounded px-3 py-2"
            :disabled="reassignLoading"
          >
            <option value="" disabled>Pilih pegawai…</option>
            <option v-for="opt in pegawaiOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
         
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="secondary" @click="showReassignModal = false" :disabled="reassignLoading">
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            :loading="reassignLoading"
            :disabled="!selectedPegawai || reassignLoading"
            @click="handleReassign"
          >
            Tugaskan
          </rs-button>
        </div>
      </template>
    </rs-modal>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

definePageMeta({
  title: 'Senarai Bulk Processing',
});

const breadcrumb = ref([
  {
    name: 'Bantuan',
    type: 'link',
    path: '/BF-BTN/bantuan-bulk',
  },
  {
    name: 'Bulk Processing',
    type: 'link',
    path: '/BF-BTN/bantuan-bulk',
  },
  {
    name: 'Senarai Bulk Processing',
    type: 'current',
    path: '/BF-BTN/bantuan-bulk/senarai-bulk-processing',
  },
]);

// Table columns configuration
const columns = [
  {
    key: 'id',
    label: 'Kod BP',
    sortable: true,
  },
  {
    key: 'tajuk',
    label: 'Tajuk',
    sortable: true,
  },
  {
    key: 'aid',
    label: 'Aid',
    sortable: true,
  },
  {
    key: 'aidProduct',
    label: 'Aid Product',
    sortable: true,
  },
  {
    key: 'jumlahAmaun',
    label: 'Jumlah Amaun',
    sortable: true,
  },
  {
    key: 'tarikhMohon',
    label: 'Tarikh Mohon',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
  },
  {
    key: 'peringkatSemasa',
    label: 'Peringkat Semasa',
    sortable: true,
  },
  {
    key: "actions",
    label: "Tindakan",
    sortable: false,
    align: "center",
    width: "120px",
  },
];

const reassignIndex = ref(-1);
const showReassignModal = ref(false);
const selectedPegawai = ref('');          // will hold the selected user id/code
const reassignLoading = ref(false);

// Static or fetched options: [{ label: 'Nama', value: 'id' }]
const pegawaiOptions = ref([
  { label: '— Pilih —', value: '' },
  { label: 'Ali Bin Omar', value: 'ALI01' },
  { label: 'Siti Nurhaliza', value: 'SITI02' },
  { label: 'Farid Rahman', value: 'FARID03' },
]);

// Optional: preload from API
onMounted(async () => {
  // const list = await api.get('/pegawai'); // shape: [{id,name}]
  // pegawaiOptions.value = [{label:'— Pilih —', value:''}, ...list.map(x => ({label:x.name, value:x.id}))];
});

// async function handleReassign() {
//   if (!selectedPegawai.value) {
//     console.warn('[handleReassign] No pegawai selected');
//     return;
//   }
//   if (reassignIndex.value < 0) {
//     console.warn('[handleReassign] Invalid reassignIndex');
//     return;
//   }

//   try {
//     reassignLoading.value = true;

//     // Optional: await api.post('/bulk-processing/reassign', {...})

//     const current = bantuanList.value[reassignIndex.value];
//     const newName = pegawaiOptions.value.find(o => o.value === selectedPegawai.value)?.label || '';

//     const updated = {
//       ...current,
//       peringkatSemasa: buildPeringkatSemasa(current.peringkatSemasa ?? '', newName),
//     };

//     // Use splice so Vue sees the change
//     bantuanList.value.splice(reassignIndex.value, 1, updated);

//     // Cleanup UI
//     showReassignModal.value = false;
//     selectedPegawai.value   = '';
//     reassignIndex.value     = -1;
//   } catch (e) {
//     console.error('[handleReassign] error:', e);
//   } finally {
//     reassignLoading.value = false;
//   }
// }


// Put this in <script setup> with your other helpers
const isDrafByKod = (kod) => {
  const row = bantuanList.value.find(r => r.id === kod)
  return String(row?.status ?? '').trim().toLowerCase() === 'draf'
}

// which row are we reassigning?
const reassignContext = ref({ id: null });

// helper: get pegawai label from value
const getPegawaiLabel = (val) => {
  const found = pegawaiOptions.value.find(o => o.value === val);
  return found ? found.label : '';
};



// open modal for a specific row
// function openReassign(row) {
//   reassignContext.value = { id: row.id };
//   selectedPegawai.value = '';
//   showReassignModal.value = true;
// }

// function openReassign(row) {
//   try {
//     console.log('[openReassign] row =', row);
//     showReassignModal.value = true;              // ✅ open ASAP
//     selectedPegawai.value   = '';

//     // Prefer row.id; fall back to actions or text if your table sends that
//     const id = row?.id || row?.actions || row?.text || null;
//     if (!id) {
//       console.warn('[openReassign] No id found on row');
//     }
//     reassignContext.value = { id };
//   } catch (e) {
//     console.error('[openReassign] error:', e);
//     // still try to show the modal so you see the issue
//     showReassignModal.value = true;
//   }
// }
function openReassign(maybeRow) {
  try {
    const id = maybeRow?.id ?? maybeRow?.actions ?? maybeRow?.text ?? null;

    // open the modal first so you can SEE it even if id resolution fails
    showReassignModal.value = true;
    selectedPegawai.value   = '';

    reassignIndex.value = id
      ? bantuanList.value.findIndex(r => r.id === id)
      : -1;

    if (reassignIndex.value < 0) {
      console.warn('[openReassign] Could not resolve row id from:', maybeRow);
    }
  } catch (e) {
    console.error('[openReassign] error:', e);
    showReassignModal.value = true;
  }
}
// build new "peringkatSemasa" by preserving (Role) and SLA from the old string
// function buildPeringkatSemasa(oldStr, newName) {
//   const role = /\(([^)]+)\)/.exec(oldStr)?.[1] ?? 'Pemohon'; // keeps whatever is in (…)
//   const sla  = /SLA:\s*\d+/i.exec(oldStr)?.[0] ?? '';        // keeps "SLA: N" if any
//   return `${newName} (${role})${sla ? ' ' + sla : ''}`;
// }

// async function handleReassign() {
//   if (!selectedPegawai.value || !reassignContext.value.id) return;

//   try {
//     reassignLoading.value = true;

//     // 1) (Optional) call your API here
//     // await api.post('/bulk-processing/reassign', {
//     //   recordId: reassignContext.value.id,
//     //   pegawaiId: selectedPegawai.value
//     // });

//     // 2) Update local table row
//     const idx = bantuanList.value.findIndex(x => x.id === reassignContext.value.id);
//     if (idx > -1) {
//       const row = { ...bantuanList.value[idx] };
//       const newName = getPegawaiLabel(selectedPegawai.value);
//       row.peringkatSemasa = buildPeringkatSemasa(row.peringkatSemasa ?? '', newName);
//       bantuanList.value.splice(idx, 1, row);
//     }

//     // UX cleanup
//     showReassignModal.value = false;
//     selectedPegawai.value = '';
//     reassignContext.value = { id: null };
//     // showSuccess('Tugasan berjaya dikemas kini.');
//   } catch (e) {
//     console.error(e);
//     // showError('Gagal menugaskan semula. Sila cuba lagi.');
//   } finally {
//     reassignLoading.value = false;
//   }
// }

function buildPeringkatSemasa(oldStr, newName) {
  const role = /\(([^)]+)\)/.exec(oldStr)?.[1] ?? 'Pemohon';
  const sla  = /SLA:\s*\d+/i.exec(oldStr)?.[0] ?? '';
  return `${newName} (${role})${sla ? ' ' + sla : ''}`;
}
async function handleReassign() {
  if (!selectedPegawai.value) {
    console.warn('[handleReassign] No pegawai selected');
    return;
  }
  if (reassignIndex.value < 0) {
    console.warn('[handleReassign] Invalid reassignIndex');
    return;
  }

  try {
    reassignLoading.value = true;

    const current = bantuanList.value[reassignIndex.value];
    const newName = pegawaiOptions.value.find(o => o.value === selectedPegawai.value)?.label || '';

    const updated = {
      ...current,
      peringkatSemasa: buildPeringkatSemasa(current.peringkatSemasa ?? '', newName),
    };

    bantuanList.value.splice(reassignIndex.value, 1, updated);

    showReassignModal.value = false;
    selectedPegawai.value   = '';
    reassignIndex.value     = -1;
  } catch (e) {
    console.error('[handleReassign] error:', e);
  } finally {
    reassignLoading.value = false;
  }
}



// State management
const searchQuery = ref('');
const filters = ref({
  status: '',
});
const pageSize = ref(10);
const currentPage = ref(1);
const showDeleteModal = ref(false);
const selectedBantuanId = ref(null);
const tooltips = ref({});
// Mock data (replace with actual API calls)
const bantuanList = ref([
  {
    id: 'BP-2025-00001',
    tajuk: 'Wang Saku Fakir Mac 2025',
    aid: 'B314 - Bantuan Keperluan Pendidikan IPT (Fakir)',
    aidProduct: '(HQ) KPIPT (Fakir) - Bantuan Wang Saku',
    jumlahAmaun: 'RM20,000.00',
    tarikhMohon: '01/03/2025',
    status: 'Draf',
    peringkatSemasa: 'Abd Ghafar bin Ahmad (Pemohon) SLA: 3',
    actions: 'BP-2025-00001'
  },
  {
    id: 'BP-2025-00002',
    tajuk: 'Wang Saku Fakir Feb 2025',
    aid: 'B314 - Bantuan Keperluan Pendidikan IPT (Fakir)',
    aidProduct: '(HQ) KPIPT (Fakir) - Bantuan Wang Saku',
    jumlahAmaun: 'RM23,000.00',
    tarikhMohon: '01/02/2025',
    status: 'Draf',
    peringkatSemasa: 'Abd Ghafar bin Ahmad (Pemohon) SLA: 1',
    actions: 'BP-2025-00002'
  },
  {
    id: 'BP-2025-00003',
    tajuk: 'LZS menyerahkan bantuan sebanyak RM 43,200 kepada 114 keluarga mangsa banjir di daerah Hulu Langat. Selangor',
    aid: 'B146 - (HQ) BANTUAN BENCANA (FAKIR)',
    aidProduct: '(HQ) BANTUAN BANJIR (FAKIR)',
    jumlahAmaun: 'RM43,200.00',
    tarikhMohon: '02/02/2025',
    status: 'Dalam Proses',
    peringkatSemasa: ' Ahmad Azhar bin Abdullah (Penyemak)',
    actions: 'BP-2025-00003'
  },
  {
    id: 'BP-2025-00004',
    tajuk: 'Bantuan bencana Feb 2025',
    aid: 'B146 - (HQ) BANTUAN BENCANA (FAKIR)',
    aidProduct: '(HQ) BANTUAN BANJIR (FAKIR)',
    jumlahAmaun: 'RM35,000.00',
    tarikhMohon: '25/02/2025',
    status: 'Dalam Proses',
    peringkatSemasa: ' Ahmad Azhar bin Abdullah (Penyemak)',
    actions: 'BP-2025-00004'
  },
  {
    id: 'BP-2025-01617',
    tajuk: 'TUNTUTAN KFAM APRIL 2025 - PELAJAR',
    aid: '(HQ) ELAUN KEHADIRAN KELAS AGAM ASAS (MUALLAF)',
    aidProduct: '(HQ) ELAUN KEHADIRAN KELAS AGAM ASAS (MUALLAF)',
    jumlahAmaun: 'RM44,390.00',
    tarikhMohon: '04/05/2025',
    status: 'Lulus',
    peringkatSemasa: 'Mohd Rizal bin Mohd Fattah (Pelulus)',
    actions: 'BP-2025-01617'
  },
  {
    id: 'BP-2025-01589',
    tajuk: 'TUNTUTAN KFAM APRIL 2025 - GURU',
    aid: '(HQ) ELAUN GURU PEMBIMBING ASNAF (MUALLAF)',
    aidProduct: '(HQ) ELAUN GURU PEMBIMBING ASNAF (MUALLAF)',
    jumlahAmaun: 'RM54,710.00',
    tarikhMohon: '30/04/2025',
    status: 'Lulus',
    peringkatSemasa: 'Mohd Rizal bin Mohd Fattah (Pelulus)',
    actions: 'BP-2025-01589'
  },
  {
    id: 'BP-2025-00007',
    tajuk: 'Bantuan Rumah Jan 2025',
    aid: 'B100 - Bantuan Rumah',
    aidProduct: '(HQ) BANTUAN RUMAH',
    jumlahAmaun: 'RM50,000.00',
    tarikhMohon: '05/01/2025',
    status: 'Rework',
    peringkatSemasa: 'Abd Ghafar bin Ahmad (Pemohon)',
    actions: 'BP-2025-00007'
  },
  {
    id: 'BP-2025-00008',
    tajuk: 'Bantuan Makanan Feb 2025',
    aid: 'B150 - Bantuan Makanan',
    aidProduct: '(HQ) BANTUAN MAKANAN',
    jumlahAmaun: 'RM15,000.00',
    tarikhMohon: '20/02/2025',
    status: 'Rework',
    peringkatSemasa: 'Abd Ghafar bin Ahmad (Pemohon)',
    actions: 'BP-2025-00008'
  },
]);

// Options
const statusOptions = [
  { label: 'Semua', value: '' },
  { label: 'Draf', value: 'Draf' },
  { label: 'Aktif', value: 'Aktif' }
];

// Computed properties
const filteredBantuanBulk = computed(() => {
  let result = [...bantuanList.value]

  // Apply search (use existing fields on your rows)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (item) =>
        String(item.id).toLowerCase().includes(q) ||
        String(item.tajuk).toLowerCase().includes(q)
    )
  }

  // Apply filters
  if (filters.value.status) {
    result = result.filter((item) => item.status === filters.value.status)
  }

  // Apply pagination
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})


// Computed properties
const filteredBantuanList = (status) => {
  let filtered = [...bantuanList.value];
  
  // Filter by status if provided
  if (status) {
    filtered = filtered.filter(item => item.status === status);
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(item => 
      item.id.toLowerCase().includes(query) ||
      item.tajuk.toLowerCase().includes(query)
    );
  }

  if (filters.value.status) {
    filtered = filtered.filter(item => item.status === filters.value.status);
  }

  return filtered;
};

const totalBantuan = computed(() => bantuanList.value.length);
const totalPages = computed(() => Math.ceil(totalBantuan.value / pageSize.value));
const paginationStart = computed(() => ((currentPage.value - 1) * pageSize.value) + 1);
const paginationEnd = computed(() => Math.min(currentPage.value * pageSize.value, totalBantuan.value));

// Methods
const formatDate = (dateString) => {
  if (!dateString) return '';
  // Assuming dateString is in DD/MM/YYYY format
  return dateString;
};

const getStatusVariant = (status) => {
  switch (status) {
    case 'Draf':
      return 'disabled';
    case 'Lulus':
      return 'success';
    case 'Ditolak':
      return 'danger';
    case 'Rework':
      return 'danger';
    case 'Dalam Proses':
      return 'warning';
    case 'Baru':
      return 'primary';
    default:
      return 'secondary';
  }
};

const editBantuan = (id) => {
  navigateTo(`senarai-bulk-processing/${id}/edit`);
};

const viewBantuan = (id) => {
  navigateTo(`senarai-bulk-processing/${id}`);
};

const confirmDelete = (id) => {
  selectedBantuanId.value = id;
  showDeleteModal.value = true;
};

const canDeleteUser = (id) => {
  // Add logic to determine if user can delete this item
  return true;
};

const handleDelete = async () => {
  try {
    console.log('Deleting bantuan:', selectedBantuanId.value);
    bantuanList.value = bantuanList.value.filter(item => item.id !== selectedBantuanId.value);
    showDeleteModal.value = false;
    selectedBantuanId.value = null;
  } catch (error) {
    console.error('Error deleting bantuan:', error);
  }
};
</script>

<style lang="scss" scoped>
.rs-table {
  :deep(th) {
    @apply bg-gray-50 text-gray-600 font-medium;
  }
}
.tooltip-enter-active, .tooltip-leave-active {
  transition: opacity 0.2s;
}
.tooltip-enter-from, .tooltip-leave-to {
  opacity: 0;
}
</style>
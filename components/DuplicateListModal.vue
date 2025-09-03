<template>
  <rs-modal
    v-model="localOpen"
    size="lg"
    :closeable="true"
    role="dialog"
    :aria-labelledby="titleId"
    @close="handleClose"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <h3 :id="titleId" class="text-lg font-semibold">Senarai Data Duplicate</h3>
      </div>
    </template>

    <template #body>
      <div class="space-y-3">
        <!-- Search -->
        <div class="max-w-xs">
          <FormKit
            ref="searchRef"
            type="text"
            v-model="search"
            placeholder="Search"
            :classes="{ outer: 'mb-0' }"
            :suffix-icon="'mdi:magnify'"
          />
        </div>

        <!-- Table -->
        <div class="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table class="min-w-full bg-white">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-center text-xs font-semibold text-gray-600">No</th>
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">Id Permohonan</th>
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">Aid</th>
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">Aid Product</th>
                <th class="px-4 py-2 text-right text-xs font-semibold text-gray-600">Jumlah Amaun</th>
                <th class="px-4 py-2 text-center text-xs font-semibold text-gray-600">Tarikh Mohon</th>
                <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">Status Permohonan</th>
                <th class="px-4 py-2 text-center text-xs font-semibold text-gray-600">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r, i) in filteredRows" :key="r.id" class="border-t">
                <td class="px-4 py-2 text-sm">{{ i + 1 }}</td>
                <td class="px-4 py-2 text-sm">
                  <button
                    class="text-primary hover:underline"
                    @click="$emit('open-application', r.idPermohonan)"
                  >
                    {{ r.idPermohonan }}
                  </button>
                </td>
                <td class="px-4 py-2 text-sm">{{ r.aid }}</td>
                <td class="px-4 py-2 text-sm">{{ r.aidProduct }}</td>
                <td class="px-4 py-2 text-sm text-right">{{ formatCurrency(r.jumlahAmaun) }}</td>
                <td class="px-4 py-2 text-sm text-center">{{ formatDate(r.tarikhMohon) }}</td>
                <td class="px-4 py-2 text-sm">{{ r.status }}</td>
                <td class="px-4 py-2 text-sm">
                  <div class="flex justify-center">
                    <FormKit
                      type="checkbox"
                      :value="r.id"
                      :checked="selectedIdsSet.has(r.id)"
                      @change="toggleSelection(r.id, $event?.target?.checked)"
                    />
                  </div>
                </td>
              </tr>
              <tr v-if="filteredRows.length === 0">
                <td class="px-4 py-6 text-center text-sm text-gray-500" colspan="8">Tiada data</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <rs-button variant="secondary" @click="handleClose">Tutup</rs-button>
        <rs-button variant="primary" :disabled="selectedIdsSet.size === 0" @click="handleConfirm">
          Kemaskini
        </rs-button>
      </div>
    </template>
  </rs-modal>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  rows: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue', 'close', 'confirm', 'open-application']);

const localOpen = ref(props.modelValue);
watch(() => props.modelValue, v => (localOpen.value = v));
watch(localOpen, v => emit('update:modelValue', v));

// Search with debounce
const search = ref('');
const debounced = ref('');
let timer;
watch(search, (v) => {
  clearTimeout(timer);
  timer = setTimeout(() => (debounced.value = v), 250);
});

const filteredRows = computed(() => {
  const q = (debounced.value || '').toString().toLowerCase();
  if (!q) return props.rows;
  return props.rows.filter(r => {
     return (
       (r.idPermohonan || '').toString().toLowerCase().includes(q) ||
       (r.aid || '').toString().toLowerCase().includes(q) ||
       (r.aidProduct || '').toString().toLowerCase().includes(q) ||
       (r.status || '').toString().toLowerCase().includes(q) ||
       (r.tarikhMohon ? formatDate(r.tarikhMohon) : '').toLowerCase().includes(q)
     );
  });
});

// Selection
const selectedIdsSet = ref(new Set());
const toggleSelection = (id, checked) => {
  const s = new Set(selectedIdsSet.value);
  if (checked) s.add(id); else s.delete(id);
  selectedIdsSet.value = s;
};

// Currency
const formatCurrency = (n) => {
  try {
    return new Intl.NumberFormat('ms-MY', { minimumFractionDigits: 0 }).format(Number(n) || 0);
  } catch {
    return n;
  }
};

// Date formatter (accepts Date or string)
const formatDate = (d) => {
  try {
    const date = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('ms-MY', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
  } catch {
    return '';
  }
};

// Close/Confirm
const handleClose = () => {
  selectedIdsSet.value = new Set();
  localOpen.value = false;
  emit('close');
};

const handleConfirm = () => {
  const arr = Array.from(selectedIdsSet.value);
  emit('confirm', arr);
  selectedIdsSet.value = new Set();
  localOpen.value = false;
};

// Focus search on open; ESC closes; prevent outside close handled by modal prop
const searchRef = ref(null);
const onKeydown = (e) => {
  if (!localOpen.value) return;
  if (e.key === 'Escape') handleClose();
};
onMounted(() => {
  document.addEventListener('keydown', onKeydown);
});
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown);
});

watch(localOpen, (open) => {
  if (open) {
    requestAnimationFrame(() => {
      try { searchRef.value?.node?.querySelector('input')?.focus(); } catch {}
    });
  }
});

const titleId = `duplicate-modal-title-${Math.random().toString(36).slice(2,8)}`;
</script>

<style scoped>
.table-shadow {
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06);
}
</style>



<template>
  <div class="space-y-3 text-xs text-slate-600">
    <header class="space-y-1">
      <p class="font-semibold uppercase tracking-wide text-slate-500">Sejarah Semakan</p>
      <p class="text-[11px] text-slate-400">Jejak ringkas perjalanan semakan permohonan.</p>
    </header>

    <div v-if="hasItems" class="space-y-3">
      <ul class="space-y-3">
        <li
          v-for="item in items"
          :key="itemKey(item)"
          class="relative border-l border-slate-200 pl-3"
        >
          <span
            :class="['absolute left-[-5px] top-1 h-2 w-2 rounded-full', dotClasses(item)]"
          ></span>
          <div class="flex items-start justify-between gap-2">
            <div class="space-y-0.5">
              <p class="font-semibold text-slate-900">{{ item.role || '-' }}</p>
              <p class="text-slate-500">{{ item.tindakan || 'Tindakan tidak dinyatakan' }}</p>
              <p class="text-[11px] text-slate-500">{{ item.nama || '-' }}</p>
              <p v-if="item.catatan" class="text-[11px] text-slate-400">{{ item.catatan }}</p>
              <div v-if="hasDocuments(item)" class="flex flex-wrap gap-1 pt-1">
                <button
                  v-for="doc in item.dokumen"
                  :key="doc.key || doc.title || doc.nama"
                  type="button"
                  class="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-0.5 text-[11px] text-slate-500 hover:border-primary hover:text-primary"
                  @click="handlePreview(doc.key || doc)"
                >
                  <Icon name="ph:eye" class="h-3 w-3" />
                  <span>{{ doc.title || doc.nama || 'Lihat' }}</span>
                </button>
              </div>
            </div>
            <div class="text-right space-y-0.5">
              <rs-badge size="xs" :variant="statusVariant(item.status)">{{ item.status || '—' }}</rs-badge>
              <p class="text-[11px] text-slate-400">{{ item.tarikh || '-' }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div v-else class="rounded border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-[11px] text-slate-400">
      Tiada sejarah semakan direkodkan.
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const highlightStatuses = [
  'Dalam Proses',
  'Dalam Semakan',
  'Menunggu Kelulusan',
  'Menunggu Pengesahan Ketua Jabatan',
];

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['preview']);

const hasItems = computed(() => Array.isArray(props.items) && props.items.length > 0);

const itemKey = (item) => `${item?.role || 'role'}-${item?.tarikh || Math.random()}`;

const hasDocuments = (item) => Array.isArray(item?.dokumen) && item.dokumen.length > 0;

const handlePreview = (docKey) => {
  if (!docKey) return;
  emit('preview', docKey);
};

const dotClasses = (item) => {
  return highlightStatuses.includes(item?.status)
    ? 'bg-amber-500'
    : 'bg-slate-300';
};

const statusVariant = (status) => {
  const variants = {
    'Dalam Proses': 'warning',
    'Dalam Semakan': 'info',
    'Menunggu Kelulusan': 'warning',
    'Menunggu Pengesahan Ketua Jabatan': 'warning',
    'Disemak PT': 'info',
    'Disokong Eksekutif': 'success',
    'Disahkan Jabatan': 'success',
    'Diluluskan Divisyen': 'success',
    'Diluluskan': 'success',
    'Ditolak': 'danger',
    'Tidak Lulus': 'danger',
    'Selesai': 'success',
  };
  return variants[status] || 'secondary';
};
</script>


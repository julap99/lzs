<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex flex-wrap gap-3 items-center justify-between">
          <h2 class="text-xl font-semibold">Semua Notifikasi</h2>
          <div class="flex gap-3 items-center">
            <FormKit v-model="q" type="search" placeholder="Cari..." :classes="{ outer: 'mb-0 w-64' }" />
            <FormKit v-model="status" type="select" :options="statusOpsyen" :classes="{ outer: 'mb-0 w-44' }" />
            <rs-button variant="secondary" @click="markAllRead">Tandakan Semua Dibaca</rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <div class="divide-y">
          <div v-for="n in filtered" :key="n.id" class="py-4 flex items-start gap-4">
            <Icon name="ic:outline-circle" class="mt-1" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <NuxtLink :to="`/notifications/${n.id}`" class="font-medium truncate hover:underline">
                  {{ n.title }}
                </NuxtLink>
                <rs-badge :variant="n.status==='UNREAD' ? 'primary' : 'secondary'">
                  {{ n.status==='UNREAD' ? 'Baru' : 'Dibaca' }}
                </rs-badge>
                <span class="text-xs text-gray-500">{{ new Date(n.createdAt).toLocaleString('ms-MY') }}</span>
              </div>
              <p class="text-sm text-gray-600 mt-1 whitespace-pre-line">{{ n.message }}</p>

              <div class="flex gap-2 mt-3">
                <rs-button size="sm" variant="secondary" @click="open(n)">Buka</rs-button>
                <rs-button size="sm" :variant="n.status==='UNREAD' ? 'primary' : 'default'" @click="toggle(n)">
                  {{ n.status==='UNREAD' ? 'Tanda Dibaca' : 'Tanda Belum Dibaca' }}
                </rs-button>
              </div>
            </div>
          </div>

          <div v-if="filtered.length===0" class="py-12 text-center text-gray-500">Tiada notifikasi.</div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { notifications, latest, markRead, markAllRead } from '~/mocks/notifications'
import { navigateTo } from '#app'

definePageMeta({ title: 'Semua Notifikasi' })

const breadcrumb = ref([
  { name: 'Utama', type: 'link', path: '/' },
  { name: 'Notifikasi', type: 'current', path: '/notifications' },
])

const q = ref('')
const status = ref('all')
const statusOpsyen = [
  { label: 'Semua', value: 'all' },
  { label: 'Belum Dibaca', value: 'UNREAD' },
  { label: 'Telah Dibaca', value: 'READ' },
]

const filtered = computed(() => {
  const list = latest.value
  return list.filter(n => {
    const byStatus = status.value === 'all' ? true : n.status === status.value
    const byQ = q.value.trim() ? (n.title + n.message).toLowerCase().includes(q.value.toLowerCase()) : true
    return byStatus && byQ
  })
})

function open(n) {
  markRead(n.id)
  if (n.link) navigateTo(n.link)
}
function toggle(n) {
  n.status = n.status === 'UNREAD' ? 'READ' : 'UNREAD'
}
</script>
<style scoped>

</style>
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />
    <rs-card class="mt-4">
      <template #header>
        <h2 class="text-xl font-semibold">{{ item?.title || 'Notifikasi' }}</h2>
      </template>
      <template #body>
        <p class="text-gray-600 whitespace-pre-line">{{ item?.message }}</p>
        <p class="text-xs text-gray-500 mt-2">Tarikh: {{ dateStr }}</p>

        <div v-if="item?.email" class="mt-6">
          <h3 class="font-medium mb-2">Pratonton Emel</h3>
          <div class="border rounded-lg p-4 bg-[rgb(var(--bg-1))]">
            <p><b>Subjek:</b> Tuntutan bagi No. Tuntutan: {{ item.email.noTuntutan }} Tidak Lengkap</p>
            <p><b>Kepada:</b> {{ item.email.namaPemohon }}</p>
            <p><b>Daripada:</b> Unit Pengurusan Tuntutan</p>
            <p><b>Tarikh:</b> {{ item.email.tarikhMohon }}</p>
            <br />
            <p>Assalamualaikum dan Salam Sejahtera,</p>
            <p>Permohonan tuntutan anda tidak lengkap.</p>
            <p><b>Maklumat Tuntutan</b></p>
            <p>No. Tuntutan: {{ item.email.noTuntutan }}</p>
            <p>Amaun: {{ formatMYR(item.email.amaun) }}</p>
            <p>Tarikh Mohon: {{ item.email.tarikhMohon }}</p>
            <p>Catatan: {{ item.email.catatan }}</p>
            <br />
            <p>
              Sila log masuk ke sistem NAS untuk tindakan selanjutnya.
              <NuxtLink :to="item.email.linkNas" class="text-primary underline">[Link Sistem NAS]</NuxtLink>
            </p>
            <br />
            <p>Sekian, terima kasih.</p>
            <p>Unit Tuntutan<br/>Bahagian Pengurusan Bantuan</p>
          </div>
        </div>

        <div class="mt-6 flex gap-2">
          <rs-button variant="secondary" @click="goBack">Kembali</rs-button>
          <rs-button v-if="item?.link" variant="primary" @click="openLink">Buka Laman Berkaitan</rs-button>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, navigateTo } from '#app'
import { notifications, markRead } from '~/mocks/notifications'

definePageMeta({ title: 'Butiran Notifikasi' })
const route = useRoute()
const item = computed(() => notifications.value.find(n => n.id === route.params.id))
if (item.value) markRead(item.value.id)

const dateStr = computed(() => item.value ? new Date(item.value.createdAt).toLocaleString('ms-MY') : '')
const goBack = () => navigateTo('/notifications')
const openLink = () => item.value?.link && navigateTo(item.value.link)

const formatMYR = (n) => new Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR' }).format(n)
</script>

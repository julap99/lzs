<template>
  <div class="container">
    <layouts-breadcrumb :items="breadcrumb" />

    <!-- Header + Button Kembali -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Semakan & Kelulusan Kawalan Validasi</h1>

      <rs-button variant="secondary" @click="goBack" class="whitespace-nowrap">
        <Icon name="ic:round-arrow-back" class="mr-1" />
        Kembali
      </rs-button>
    </div>

    <!-- Grid utama: Kiri (2 kad), Kanan (Ulasan & Tindakan) -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Kiri: Konfigurasi Semasa + Permohonan Baharu -->
      <div class="space-y-6">
        <!-- Konfigurasi Semasa (READ TEXT ONLY) -->
        <rs-card>
          <template #header>
            <div class="text-lg font-semibold">Konfigurasi Semasa</div>
          </template>
          <template #body>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <div class="text-sm text-gray-500">Jenis Validasi</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ validasiJenis }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500">Status Konfigurasi</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ statusKonfigurasi }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500">Tarikh Mula Kuasa</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ tarikhMulaKuasa }}
                </div>
              </div>

              <div class="md:col-span-2">
                <div class="text-sm text-gray-500">Parameter Kawalan</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ parameterKawalan }}
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Permohonan Baharu (READ TEXT ONLY) -->
        <rs-card>
          <template #header>
            <div class="text-lg font-semibold">Butiran Permohonan</div>
          </template>
          <template #body>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <div class="text-sm text-gray-500">Jenis Validasi</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ validasiJenis }}
                </div>
              </div>

              <div class="md:col-span-2">
                <div class="text-sm text-gray-500">Catatan Permohonan</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50 whitespace-pre-line">
                  {{ catatanPermohonan }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500">Tarikh Permohonan</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ tarikhPermohonan }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-500">Dimohon Oleh</div>
                <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                  {{ dimohonOleh }}
                </div>
              </div>
            </div>
          </template>
        </rs-card>
      </div>

      <!-- Kanan: Ulasan & Tindakan -->
      <div>
        <rs-card class="xl:sticky xl:top-4">
          <template #header>
            <div class="text-lg font-semibold">Ulasan & Tindakan</div>
          </template>
          <template #body>
            <div class="space-y-4">
              <!-- 1) Keputusan (FormKit Select) -->
              <FormKit
                type="select"
                label="Status Permohonan"
                placeholder="Pilih status..."
                :options="[
                  { label: 'Lulus', value: 'approve' },
                  { label: 'Tidak Lulus', value: 'reject' }
                ]"
                v-model="keputusan"
              />

              <!-- 2) Ulasan -->
              <div>
                <label class="block font-medium mb-2">
                  Ulasan
                  <span v-if="keputusan === 'reject'" class="text-danger">*</span>
                </label>
                <textarea
                  v-model="ulasanPelulus"
                  class="w-full min-h-[140px] border rounded-md px-3 py-2 outline-none"
                  :placeholder="keputusan === 'reject' ? 'Nyatakan sebab tidak lulus...' : 'Masukkan catatan kelulusan...'"
                  :required="keputusan === 'reject'"
                />
              </div>

              <!-- 3) Tarikh Semakan (kalender) -->
              <FormKit
                type="date"
                label="Tarikh Semakan"
                v-model="tarikhSemakan"
                :max="today"
              />

              <!-- 4) Status Permohonan (kanan bawah) -->
              <div class="pt-2 text-right">
                <span class="mr-2 font-medium">Status Permohonan:</span>
                <rs-badge variant="warning">Sedang Menunggu</rs-badge>
              </div>
            </div>
          </template>
        </rs-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from '#imports'

definePageMeta({ title: 'Semakan & Kelulusan Akses Peranan' })

const router = useRouter()
const goBack = () => router.push('/BF-ADN/KF/senarai-permohonan-kelulusan-kawalan-validasi')

const breadcrumb = [
  { name: 'Mengurus Konfigurasi', type: 'link', path: '/BF-ADN/KF' },
  { name: 'Semakan & Kelulusan Akses Peranan', type: 'text', path: '/BF-ADN/KF/semakan-kelulusan-kawalan-validasi/ADN-PK-KK-02-2' },
]

/* Data sedia ada */
const validasiJenis = ref('Validasi IC - Semak Duplikasi')
const statusKonfigurasi = ref('Aktif')
const tarikhMulaKuasa = ref('01-08-2025')
const parameterKawalan = ref('1 IC hanya boleh digunakan 1 kali dalam 90 hari')

const catatanPermohonan = ref('Ubah kepada 60 hari berdasarkan polisi baru.')
const tarikhPermohonan = ref('15-09-2025')
const dimohonOleh = ref('Siti Norlia')

/* Ulasan & Tindakan */
const ulasanPelulus = ref('')

/* Tambahan untuk select & tarikh */
const keputusan = ref(null) // 'approve' | 'reject'
const tarikhSemakan = ref(todayISO())
const today = computed(() => todayISO())

/* Kekalkan fungsi asal (tidak digunakan oleh UI baharu, tetapi tidak diubah) */
function luluskan() { alert("Permohonan telah diluluskan.") }
function tolak() { alert("Permohonan telah ditolak.") }

/* Util ringkas */
function todayISO() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
</script>

<style scoped>
/* Kekalkan container; Tailwind uruskan yang lain */
.container { max-width: 1200px; margin: 0 auto; }
</style>

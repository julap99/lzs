<!-- 
  RTMF SCREEN: PA-PE-ET
  PURPOSE: Dashboard Elaun Tahunan — Pengurusan Berasaskan Peranan
  DESCRIPTION: Dashboard berasaskan peranan untuk pengurusan elaun tahunan dengan aliran kerja kelulusan
  ROUTE: /BF-PA/PE/ET
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Penukar Peranan Halaman Khusus -->
    <div class="px-4 py-2 mt-0">
      <div class="flex items-center space-x-3">
        <div class="flex items-center space-x-2">
          <Icon name="ic:baseline-account-circle" class="text-gray-600" size="20" />
          <span class="text-sm font-medium text-gray-700">Simulasi Peranan:</span>
        </div>
        <select
          v-model="currentRole"
          @change="handleRoleChange"
          class="py-1.5 px-3 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option 
            v-for="option in roleOptions" 
            :key="option.value" 
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold">Dashboard Elaun Tahunan</h2>
          </div>
          <rs-button
            v-if="currentRole === 'eksekutif'"
            variant="primary"
            @click="addNewAllowance"
          >
            <Icon name="ic:baseline-add-circle" class="mr-2" />
            Tambah Baru
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Bahagian Penapis Pintar -->
        <div class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              v-model="filters.searchQuery"
              type="text"
              placeholder="Cari rujukan, tahun, atau jenis elaun..."
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

        <!-- Bahagian Jadual Bertab -->
        <!-- Tab Eksekutif -->
        <div v-if="currentRole === 'eksekutif'">
          <rs-tab v-model="activeTab" class="mt-4">
            <rs-tab-item title="Draf">
              <div class="p-4">
                <div class="overflow-x-auto rounded-lg border">
                  <table class="min-w-full text-sm divide-y">
                    <thead class="bg-gray-50 text-left">
                      <tr>
                        <th class="px-4 py-3 font-medium text-gray-900">Rujukan</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Tahun</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Jenis Elaun</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Status</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Bilangan Penerima</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Jumlah Elaun (RM)</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y bg-white">
                      <tr v-for="item in getTableDataByStatus(['DRAF'])" :key="item.id" class="hover:bg-gray-50">
                        <td class="px-4 py-3 text-gray-900">{{ item.rujukan }}</td>
                        <td class="px-4 py-3 text-gray-900">{{ item.year }}</td>
                        <td class="px-4 py-3 text-gray-900">{{ item.typeLabel }}</td>
                        <td class="px-4 py-3">
                          <rs-badge :variant="getStatusVariant(item.status)">
                            {{ item.status }}
                          </rs-badge>
                        </td>
                        <td class="px-4 py-3 text-gray-900">{{ item.count }}</td>
                        <td class="px-4 py-3 text-gray-900 font-medium">RM {{ formatCurrency(item.totalAmount) }}</td>
                        <td class="px-4 py-3">
                          <div class="flex space-x-3">
                            <button
                              @click="viewAllowance(item)"
                              title="Lihat"
                              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                            </button>
                            <button
                              @click="editAllowance(item)"
                              title="Kemaskini"
                              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Icon name="ic:outline-edit" class="w-5 h-5 text-secondary" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="getTableDataByStatus(['DRAF']).length === 0" class="hover:bg-gray-50">
                        <td class="px-4 py-6 text-center text-gray-500" colspan="7">
                          Tiada elaun dalam draf.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Sedang Proses">
              <div class="p-4">
                <div class="overflow-x-auto rounded-lg border">
                  <table class="min-w-full text-sm divide-y">
                    <thead class="bg-gray-50 text-left">
                      <tr>
                        <th class="px-4 py-3 font-medium text-gray-900">Rujukan</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Tahun</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Jenis Elaun</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Status</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Bilangan Penerima</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Jumlah Elaun (RM)</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y bg-white">
                      <tr v-for="item in getTableDataByStatus(['SEDANG PROSES', 'MENUNGGU KELULUSAN'])" :key="item.id" class="hover:bg-gray-50">
                        <td class="px-4 py-3 text-gray-900">{{ item.rujukan }}</td>
                        <td class="px-4 py-3 text-gray-900">{{ item.year }}</td>
                        <td class="px-4 py-3 text-gray-900">{{ item.typeLabel }}</td>
                        <td class="px-4 py-3">
                          <rs-badge :variant="getStatusVariant(item.status)">
                            {{ item.status }}
                          </rs-badge>
                        </td>
                        <td class="px-4 py-3 text-gray-900">{{ item.count }}</td>
                        <td class="px-4 py-3 text-gray-900 font-medium">RM {{ formatCurrency(item.totalAmount) }}</td>
                        <td class="px-4 py-3">
                          <div class="flex space-x-3">
                            <button
                              @click="viewAllowance(item)"
                              title="Lihat"
                              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="getTableDataByStatus(['SEDANG PROSES', 'MENUNGGU KELULUSAN']).length === 0" class="hover:bg-gray-50">
                        <td class="px-4 py-6 text-center text-gray-500" colspan="7">
                          Tiada elaun dalam proses.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Lulus">
              <div class="p-4">
                <div class="overflow-x-auto rounded-lg border">
                  <table class="min-w-full text-sm divide-y">
                    <thead class="bg-gray-50 text-left">
                      <tr>
                        <th class="px-4 py-3 font-medium text-gray-900">Rujukan</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Tahun</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Jenis Elaun</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Status</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Bilangan Penerima</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Jumlah Elaun (RM)</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y bg-white">
                      <tr v-for="item in getTableDataByStatus(['LULUS'])" :key="item.id" class="hover:bg-gray-50">
                        <td class="px-4 py-3 text-gray-900">{{ item.rujukan }}</td>
                        <td class="px-4 py-3 text-gray-900">{{ item.year }}</td>
                        <td class="px-4 py-3 text-gray-900">{{ item.typeLabel }}</td>
                        <td class="px-4 py-3">
                          <rs-badge :variant="getStatusVariant(item.status)">
                            {{ item.status }}
                          </rs-badge>
                        </td>
                        <td class="px-4 py-3 text-gray-900">{{ item.count }}</td>
                        <td class="px-4 py-3 text-gray-900 font-medium">RM {{ formatCurrency(item.totalAmount) }}</td>
                        <td class="px-4 py-3">
                          <div class="flex space-x-3">
                            <button
                              @click="viewAllowance(item)"
                              title="Lihat"
                              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="getTableDataByStatus(['LULUS']).length === 0" class="hover:bg-gray-50">
                        <td class="px-4 py-6 text-center text-gray-500" colspan="7">
                          Tiada elaun yang diluluskan.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </rs-tab-item>
          </rs-tab>
        </div>

        <!-- Tab Ketua Jabatan -->
        <div v-if="currentRole === 'ketua-jabatan'">
          <rs-tab v-model="activeTab" class="mt-4">
            <rs-tab-item title="Sedang Proses">
              <div class="p-4">
                <div class="overflow-x-auto rounded-lg border">
                  <table class="min-w-full text-sm divide-y">
                    <thead class="bg-gray-50 text-left">
                      <tr>
                        <th class="px-4 py-3 font-medium text-gray-900">Rujukan</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Tahun</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Jenis Elaun</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Status</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Bilangan Penerima</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Jumlah Elaun (RM)</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y bg-white">
                      <tr v-for="item in getTableDataByStatus(['SEDANG PROSES'])" :key="item.id" class="hover:bg-gray-50">
                        <td class="px-4 py-3 text-gray-900">{{ item.rujukan }}</td>
                        <td class="px-4 py-3 text-gray-900">{{ item.year }}</td>
                        <td class="px-4 py-3 text-gray-900">{{ item.typeLabel }}</td>
                        <td class="px-4 py-3">
                          <rs-badge :variant="getStatusVariant(item.status)">
                            {{ item.status }}
                          </rs-badge>
                        </td>
                        <td class="px-4 py-3 text-gray-900">{{ item.count }}</td>
                        <td class="px-4 py-3 text-gray-900 font-medium">RM {{ formatCurrency(item.totalAmount) }}</td>
                        <td class="px-4 py-3">
                          <div class="flex space-x-3">
                            <button
                              @click="viewAllowance(item)"
                              title="Lihat"
                              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                            </button>
                            <button
                              @click="verifyExcessAllowance(item)"
                              title="Sahkan"
                              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Icon name="ic:baseline-check-circle" class="w-5 h-5 text-warning" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="getTableDataByStatus(['SEDANG PROSES']).length === 0" class="hover:bg-gray-50">
                        <td class="px-4 py-6 text-center text-gray-500" colspan="7">
                          Tiada elaun yang menunggu pengesahan.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Lulus">
              <div class="p-4">
                <div class="overflow-x-auto rounded-lg border">
                  <table class="min-w-full text-sm divide-y">
                    <thead class="bg-gray-50 text-left">
                      <tr>
                        <th class="px-4 py-3 font-medium text-gray-900">Rujukan</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Tahun</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Jenis Elaun</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Status</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Bilangan Penerima</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Jumlah Elaun (RM)</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y bg-white">
                      <tr v-for="item in getTableDataByStatus(['LULUS'])" :key="item.id" class="hover:bg-gray-50">
                        <td class="px-4 py-3 text-gray-900">{{ item.rujukan }}</td>
                        <td class="px-4 py-3 text-gray-900">{{ item.year }}</td>
                        <td class="px-4 py-3 text-gray-900">{{ item.typeLabel }}</td>
                        <td class="px-4 py-3">
                          <rs-badge :variant="getStatusVariant(item.status)">
                            {{ item.status }}
                          </rs-badge>
                        </td>
                        <td class="px-4 py-3 text-gray-900">{{ item.count }}</td>
                        <td class="px-4 py-3 text-gray-900 font-medium">RM {{ formatCurrency(item.totalAmount) }}</td>
                        <td class="px-4 py-3">
                          <div class="flex space-x-3">
                            <button
                              @click="viewAllowance(item)"
                              title="Lihat"
                              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="getTableDataByStatus(['LULUS']).length === 0" class="hover:bg-gray-50">
                        <td class="px-4 py-6 text-center text-gray-500" colspan="7">
                          Tiada elaun yang disahkan.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </rs-tab-item>
          </rs-tab>
        </div>

        <!-- Tab Ketua Divisyen -->
        <div v-if="currentRole === 'ketua-divisyen'">
          <rs-tab v-model="activeTab" class="mt-4">
            <rs-tab-item title="Menunggu Kelulusan">
              <div class="p-4">
                <div class="overflow-x-auto rounded-lg border">
                  <table class="min-w-full text-sm divide-y">
                    <thead class="bg-gray-50 text-left">
                      <tr>
                        <th class="px-4 py-3 font-medium text-gray-900">Rujukan</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Tahun</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Jenis Elaun</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Status</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Bilangan Penerima</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Jumlah Elaun (RM)</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y bg-white">
                      <tr v-for="item in getTableDataByStatus(['MENUNGGU KELULUSAN'])" :key="item.id" class="hover:bg-gray-50">
                        <td class="px-4 py-3 text-gray-900">{{ item.rujukan }}</td>
                        <td class="px-4 py-3 text-gray-900">{{ item.year }}</td>
                        <td class="px-4 py-3 text-gray-900">{{ item.typeLabel }}</td>
                        <td class="px-4 py-3">
                          <rs-badge :variant="getStatusVariant(item.status)">
                            {{ item.status }}
                          </rs-badge>
                        </td>
                        <td class="px-4 py-3 text-gray-900">{{ item.count }}</td>
                        <td class="px-4 py-3 text-gray-900 font-medium">RM {{ formatCurrency(item.totalAmount) }}</td>
                        <td class="px-4 py-3">
                          <div class="flex space-x-3">
                            <button
                              @click="viewAllowance(item)"
                              title="Lihat"
                              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                            </button>
                            <button
                              @click="approveAllowance(item)"
                              title="Luluskan"
                              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Icon name="ic:baseline-check-circle" class="w-5 h-5 text-success" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="getTableDataByStatus(['MENUNGGU KELULUSAN']).length === 0" class="hover:bg-gray-50">
                        <td class="px-4 py-6 text-center text-gray-500" colspan="7">
                          Tiada elaun menunggu kelulusan.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Lulus">
              <div class="p-4">
                <div class="overflow-x-auto rounded-lg border">
                  <table class="min-w-full text-sm divide-y">
                    <thead class="bg-gray-50 text-left">
                      <tr>
                        <th class="px-4 py-3 font-medium text-gray-900">Rujukan</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Tahun</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Jenis Elaun</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Status</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Bilangan Penerima</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Jumlah Elaun (RM)</th>
                        <th class="px-4 py-3 font-medium text-gray-900">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y bg-white">
                      <tr v-for="item in getTableDataByStatus(['LULUS'])" :key="item.id" class="hover:bg-gray-50">
                        <td class="px-4 py-3 text-gray-900">{{ item.rujukan }}</td>
                        <td class="px-4 py-3 text-gray-900">{{ item.year }}</td>
                        <td class="px-4 py-3 text-gray-900">{{ item.typeLabel }}</td>
                        <td class="px-4 py-3">
                          <rs-badge :variant="getStatusVariant(item.status)">
                            {{ item.status }}
                          </rs-badge>
                        </td>
                        <td class="px-4 py-3 text-gray-900">{{ item.count }}</td>
                        <td class="px-4 py-3 text-gray-900 font-medium">RM {{ formatCurrency(item.totalAmount) }}</td>
                        <td class="px-4 py-3">
                          <div class="flex space-x-3">
                            <button
                              @click="viewAllowance(item)"
                              title="Lihat"
                              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="getTableDataByStatus(['LULUS']).length === 0" class="hover:bg-gray-50">
                        <td class="px-4 py-6 text-center text-gray-500" colspan="7">
                          Tiada elaun yang diluluskan.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </rs-tab-item>
          </rs-tab>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, nextTick, computed, watch, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import { Icon } from "#components";
import { FormKit } from "@formkit/vue";
import LayoutsBreadcrumb from "~/components/layouts/Breadcrumb.vue";

const toast = useToast();
const router = useRouter();

definePageMeta({
  title: "Dashboard Elaun Tahunan",
});

const breadcrumb = [
  { name: 'Laman Utama', path: '/' },
  { name: 'Modul BF-PA', path: '/BF-PA' },
  { name: 'PE - Elaun Tahunan', path: '/BF-PA/PE' },
  { name: 'Dashboard', path: null }
];

// Role Simulator State
const currentRole = ref("eksekutif");
const activeTab = ref(0);

const roleOptions = [
  { label: "Eksekutif", value: "eksekutif" },
  { label: "Ketua Jabatan", value: "ketua-jabatan" },
  { label: "Ketua Divisyen", value: "ketua-divisyen" },
];

// Filters
const filters = ref({
  searchQuery: "",
});



// Table data and reactivity control
const tableKey = ref(0);

const allowancesList = ref([
  {
    id: 1,
    rujukan: "ET-2024-001",
    year: "2024",
    type: "tahunan",
    typeLabel: "Elaun Tahunan",
    status: "DRAF",
    count: 150,
    totalAmount: 45000,
  },
  {
    id: 2,
    rujukan: "ET-2024-002",
    year: "2024",
    type: "khas",
    typeLabel: "Elaun Khas",
    status: "SEDANG PROSES",
    count: 75,
    totalAmount: 22500,
  },
  {
    id: 3,
    rujukan: "ET-2024-003",
    year: "2024",
    type: "tambahan",
    typeLabel: "Elaun Tambahan",
    status: "MENUNGGU KELULUSAN",
    count: 100,
    totalAmount: 30000,
  },
  {
    id: 4,
    rujukan: "ET-2024-004",
    year: "2024",
    type: "tahunan",
    typeLabel: "Elaun Tahunan",
    status: "LULUS",
    count: 200,
    totalAmount: 60000,
  },
]);

// Helper functions
function getStatusVariant(status) {
  switch (status) {
    case 'DRAF': return 'secondary';
    case 'SEDANG PROSES': return 'info';
    case 'MENUNGGU KELULUSAN': return 'warning';
    case 'PERLU PENGESAHAN': return 'warning';
    case 'LULUS': return 'success';
    case 'DITOLAK': return 'danger';
    default: return 'secondary';
  }
}

function formatCurrency(amount) {
  return Number(amount || 0).toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function getTableDataByStatus(statuses) {
  let filteredData = allowancesList.value.filter(item => 
    statuses.includes(item.status)
  );

  // Apply search filters
  if (filters.value.searchQuery) {
    const query = filters.value.searchQuery.toLowerCase();
    filteredData = filteredData.filter(item =>
      item.rujukan.toLowerCase().includes(query) ||
      item.typeLabel.toLowerCase().includes(query)
    );
  }



  return filteredData;
}

function performSearch() {
  tableKey.value++;
  toast.success('Carian berjaya dilakukan');
}

function refreshTable() {
  tableKey.value++;
}

// Navigation functions
function addNewAllowance() {
  router.push('/BF-PA/PE/ET/01');
}

function viewAllowance(allowance) {
  router.push(`/BF-PA/PE/ET/03?id=${allowance.id}&year=${allowance.year}&type=${allowance.type}`);
}

function editAllowance(allowance) {
  router.push(`/BF-PA/PE/ET/04?id=${allowance.id}&year=${allowance.year}&type=${allowance.type}`);
}

function verifyExcessAllowance(allowance) {
  router.push(`/BF-PA/PE/ET/05/verify/${allowance.id}?year=${allowance.year}&type=${allowance.type}`);
}

function approveAllowance(allowance) {
  if (currentRole.value === 'ketua-jabatan') {
    router.push(`/BF-PA/PE/ET/05/approve/${allowance.id}?year=${allowance.year}&type=${allowance.type}`);
  } else if (currentRole.value === 'ketua-divisyen') {
    router.push(`/BF-PA/PE/ET/05/approve-kd/${allowance.id}?year=${allowance.year}&type=${allowance.type}`);
  }
}

// Watch for role changes
watch(currentRole, () => {
  activeTab.value = 0; // Reset to first tab when role changes
});

const handleRoleChange = () => {
  // Role change logic can be added here if needed
  console.log("Role changed to:", currentRole.value);
  
  // Reset to first available tab for the new role
  activeTab.value = 0;
  
  // Refresh table
  refreshTable();
};

const getRoleSpecificDescription = () => {
  const roleDescriptions = {
    eksekutif: "Urus permohonan elaun tahunan - Draf, Proses, dan Lulus",
    "ketua-jabatan": "Pengesahan elaun tahunan - Sahkan elaun dalam proses",
    "ketua-divisyen": "Kelulusan akhir elaun tahunan - Luluskan elaun yang telah disahkan",
  };
  return roleDescriptions[currentRole.value] || "Pilih peranan untuk melihat fungsi yang tersedia";
};
</script>

<style scoped>
/* Add any additional styles here */
</style> 
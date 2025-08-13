<!-- 
  RTMF SCREEN: PA-PP-PD-01_01
  PURPOSE: Main Dashboard - Senarai Permohonan Penolong Amil
  DESCRIPTION: Dynamic dashboard with role-based content for Penolong Amil applications
  ROUTE: /BF-PA/PP/pra-daftar-v3
-->
<template>
  <div>
    <!-- Page-specific Role Switcher -->
    <div class="bg-gray-100 border-b border-gray-200 px-4 py-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <Icon name="ph:user-circle" class="text-gray-600" size="20" />
          <span class="text-sm font-medium text-gray-700">Simulasi Peranan:</span>
        </div>
        <div class="flex items-center space-x-3">
          <div class="min-w-[200px]">
            <FormKit
              type="select"
              v-model="currentRole"
              :options="roleOptions"
              :classes="{ 
                input: '!py-1.5 !px-3 text-sm !rounded-md !border-gray-300',
                wrapper: '!min-w-0'
              }"
              @change="handleRoleChange"
            />
          </div>
          <rs-button
            variant="secondary-outline"
            size="sm"
            @click="toggleRoleInfo"
            :class="{ 'bg-blue-100 text-blue-700 border-blue-300': showRoleInfo }"
            class="!px-3 !py-1.5 !text-sm !whitespace-nowrap"
          >
            <Icon name="ph:eye" class="w-3 h-3 mr-1" />
            {{ showRoleInfo ? 'Sembunyi' : 'Tunjuk' }}
          </rs-button>
        </div>
      </div>
      
      <div v-if="showRoleInfo" class="mt-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-3">Peranan Semasa:</h4>
            <div class="flex items-center space-x-3">
              <rs-badge :variant="getRoleVariant(currentRole)" class="!text-xs">
                {{ getRoleLabel(currentRole) }}
              </rs-badge>
              <span class="text-xs text-gray-600">{{ getRoleDescription(currentRole) }}</span>
            </div>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-3">Kebolehan:</h4>
            <div class="flex flex-wrap gap-2">
              <rs-badge
                v-for="capability in getRoleCapabilities(currentRole)"
                :key="capability"
                variant="secondary"
                size="sm"
                class="!text-xs"
              >
                {{ capability }}
              </rs-badge>
            </div>
          </div>
        </div>
      </div>
    </div>

    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Dynamic Content Based on Role -->
    <div v-if="currentRole === 'eksekutif'">
      <!-- Eksekutif Content -->
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">
              Senarai Penolong Amil untuk Sokongan Eksekutif
            </h2>
          </div>
        </template>

        <template #body>
          <!-- Smart Filter Section -->
          <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormKit
                v-model="filters.searchQuery"
                type="text"
                placeholder="Cari nombor rujukan, nama calon..."
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-model="filters.statusPendaftaran"
                type="select"
                :options="statusPendaftaranOptions"
                placeholder="Status Pendaftaran"
                :classes="{
                  input: '!py-2',
                }"
              />
              <rs-button
                variant="primary"
                @click="handleSearch"
                class="!py-2 !px-4"
              >
                <Icon name="ph:magnifying-glass" class="w-4 h-4 mr-2" />
                Cari
              </rs-button>
            </div>
          </div>

          <!-- Applications Table -->
          <rs-table
            :data="filteredApplications"
            :columns="eksekutifColumnsWithoutStatusLantikan"
            :pageSize="pageSize"
            :show-search="false"
            :show-filter="false"
            :options="{
              variant: 'default',
              hover: true,
              striped: true,
            }"
            :options-advanced="{
              sortable: true,
              filterable: true,
            }"
            advanced
          >
            <template v-slot:statusPendaftaran="{ text }">
              <rs-badge :variant="getStatusPendaftaranVariant(text)">
                {{ text }}
              </rs-badge>
            </template>

            <template v-slot:tindakan="{ text }">
              <div class="flex justify-center items-center gap-1">
                <rs-button
                  variant="primary"
                  size="sm"
                  @click="handleView(text)"
                  title="Lihat"
                  class="!px-3 !py-1.5"
                >
                  <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                  Lihat
                </rs-button>
                <rs-button
                  variant="success"
                  size="sm"
                  @click="handleSupport(text)"
                  title="Sokong"
                  class="!px-3 !py-1.5"
                >
                  <Icon name="ph:thumbs-up" class="w-4 h-4 mr-1" />
                  Sokong
                </rs-button>
              </div>
            </template>
          </rs-table>
        </template>
      </rs-card>
    </div>

    <!-- Ketua Jabatan Content -->
    <div v-else-if="currentRole === 'ketua-jabatan'">
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">
              Senarai Penolong Amil untuk Pengesahan Ketua Jabatan
            </h2>
          </div>
        </template>

        <template #body>
          <!-- Smart Filter Section -->
          <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormKit
                v-model="filters.searchQuery"
                type="text"
                placeholder="Cari nombor rujukan, nama calon..."
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-model="filters.statusPendaftaran"
                type="select"
                :options="statusPendaftaranOptions"
                placeholder="Status Pendaftaran"
                :classes="{
                  input: '!py-2',
                }"
              />
              <rs-button
                variant="primary"
                @click="handleSearch"
                class="!py-2 !px-4"
              >
                <Icon name="ph:magnifying-glass" class="w-4 h-4 mr-2" />
                Cari
              </rs-button>
            </div>
          </div>

          <!-- Applications Table -->
          <rs-table
            :data="filteredApplications"
            :columns="eksekutifColumnsWithoutStatusLantikan"
            :pageSize="pageSize"
            :show-search="false"
            :show-filter="false"
            :options="{
              variant: 'default',
              hover: true,
              striped: true,
            }"
            :options-advanced="{
              sortable: true,
              filterable: true,
            }"
            advanced
          >
            <template v-slot:statusPendaftaran="{ text }">
              <rs-badge :variant="getStatusPendaftaranVariant(text)">
                {{ text }}
              </rs-badge>
            </template>

            <template v-slot:tindakan="{ text }">
              <div class="flex justify-center items-center gap-1">
                <rs-button
                  variant="primary"
                  size="sm"
                  @click="handleView(text)"
                  title="Lihat"
                  class="!px-3 !py-1.5"
                >
                  <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                  Lihat
                </rs-button>
                <rs-button
                  variant="success"
                  size="sm"
                  @click="handleConfirm(text)"
                  title="Sahkan"
                  class="!px-3 !py-1.5"
                >
                  <Icon name="ph:check-circle" class="w-4 h-4 mr-1" />
                  Sahkan
                </rs-button>
              </div>
            </template>
          </rs-table>
        </template>
      </rs-card>
    </div>

    <!-- Ketua Divisyen Content -->
    <div v-else-if="currentRole === 'ketua-divisyen'">
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">
              Senarai Penolong Amil untuk Kelulusan Akhir
            </h2>
          </div>
        </template>

        <template #body>
          <!-- Smart Filter Section -->
          <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormKit
                v-model="filters.searchQuery"
                type="text"
                placeholder="Cari nombor rujukan, nama calon..."
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-model="filters.statusPendaftaran"
                type="select"
                :options="statusPendaftaranOptions"
                placeholder="Status Pendaftaran"
                :classes="{
                  input: '!py-2',
                }"
              />
              <rs-button
                variant="primary"
                @click="handleSearch"
                class="!py-2 !px-4"
              >
                <Icon name="ph:magnifying-glass" class="w-4 h-4 mr-2" />
                Cari
              </rs-button>
            </div>
          </div>

          <!-- Applications Table -->
          <rs-table
            :data="filteredApplications"
            :columns="eksekutifColumnsWithoutStatusLantikan"
            :pageSize="pageSize"
            :show-search="false"
            :show-filter="false"
            :options="{
              variant: 'default',
              hover: true,
              striped: true,
            }"
            :options-advanced="{
              sortable: true,
              filterable: true,
            }"
            advanced
          >
            <template v-slot:statusPendaftaran="{ text }">
              <rs-badge :variant="getStatusPendaftaranVariant(text)">
                {{ text }}
              </rs-badge>
            </template>

            <template v-slot:tindakan="{ text }">
              <div class="flex justify-center items-center gap-1">
                <rs-button
                  variant="primary"
                  size="sm"
                  @click="handleView(text)"
                  title="Lihat"
                  class="!px-3 !py-1.5"
                >
                  <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                  Lihat
                </rs-button>
                <rs-button
                  variant="primary"
                  size="sm"
                  @click="handleApprove(text)"
                  title="Lulus"
                  class="!px-3 !py-1.5"
                >
                  <Icon name="ph:check-circle" class="w-4 h-4 mr-1" />
                  Lulus
                </rs-button>
              </div>
            </template>
          </rs-table>
        </template>
      </rs-card>
    </div>

    <!-- PT Content -->
    <div v-else-if="currentRole === 'pt'">
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">
              Senarai Penolong Amil untuk Semakan PT
            </h2>
          </div>
        </template>

        <template #body>
          <!-- Smart Filter Section -->
          <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormKit
                v-model="filters.searchQuery"
                type="text"
                placeholder="Cari nombor rujukan, nama calon..."
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-model="filters.statusPendaftaran"
                type="select"
                :options="statusPendaftaranOptions"
                placeholder="Status Pendaftaran"
                :classes="{
                  input: '!py-2',
                }"
              />
              <rs-button
                variant="primary"
                @click="handleSearch"
                class="!py-2 !px-4"
              >
                <Icon name="ph:magnifying-glass" class="w-4 h-4 mr-2" />
                Cari
              </rs-button>
            </div>
          </div>

          <!-- Applications Table -->
          <rs-table
            :data="filteredApplications"
            :columns="eksekutifColumnsWithoutStatusLantikan"
            :pageSize="pageSize"
            :show-search="false"
            :show-filter="false"
            :options="{
              variant: 'default',
              hover: true,
              striped: true,
            }"
            :options-advanced="{
              sortable: true,
              filterable: true,
            }"
            advanced
          >
            <template v-slot:statusPendaftaran="{ text }">
              <rs-badge :variant="getStatusPendaftaranVariant(text)">
                {{ text }}
              </rs-badge>
            </template>

            <template v-slot:tindakan="{ text }">
              <div class="flex justify-center items-center gap-1">
                <rs-button
                  variant="primary"
                  size="sm"
                  @click="handleView(text)"
                  title="Lihat"
                  class="!px-3 !py-1.5"
                >
                  <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                  Lihat
                </rs-button>
                <rs-button
                  variant="info"
                  size="sm"
                  @click="handleReview(text)"
                  title="Semak"
                  class="!px-3 !py-1.5"
                >
                  <Icon name="ph:clipboard-text" class="w-4 h-4 mr-1" />
                  Semak
                </rs-button>
              </div>
            </template>
          </rs-table>
        </template>
      </rs-card>
    </div>

    <!-- Eksekutif Pengurusan Risiko Content -->
    <div v-else-if="currentRole === 'eksekutif-pengurusan-risiko'">
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">
              Senarai Penolong Amil untuk Saringan Risiko
            </h2>
          </div>
        </template>

        <template #body>
          <!-- Smart Filter Section -->
          <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormKit
                v-model="filters.searchQuery"
                type="text"
                placeholder="Cari nombor rujukan, nama calon..."
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-model="filters.statusPendaftaran"
                type="select"
                :options="statusPendaftaranOptions"
                placeholder="Status Pendaftaran"
                :classes="{
                  input: '!py-2',
                }"
              />
              <rs-button
                variant="primary"
                @click="handleSearch"
                class="!py-2 !px-4"
              >
                <Icon name="ph:magnifying-glass" class="w-4 h-4 mr-2" />
                Cari
              </rs-button>
            </div>
          </div>

          <!-- Applications Table -->
          <rs-table
            :data="filteredApplications"
            :columns="eksekutifColumnsWithoutStatusLantikan"
            :pageSize="pageSize"
            :show-search="false"
            :show-filter="false"
            :options="{
              variant: 'default',
              hover: true,
              striped: true,
            }"
            :options-advanced="{
              sortable: true,
              filterable: true,
            }"
            advanced
          >
            <template v-slot:statusPendaftaran="{ text }">
              <rs-badge :variant="getStatusPendaftaranVariant(text)">
                {{ text }}
              </rs-badge>
            </template>

            <template v-slot:tindakan="{ text }">
              <div class="flex justify-center items-center gap-1">
                <rs-button
                  variant="primary"
                  size="sm"
                  @click="handleView(text)"
                  title="Lihat"
                  class="!px-3 !py-1.5"
                >
                  <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                  Lihat
                </rs-button>
                <rs-button
                  variant="info"
                  size="sm"
                  @click="handleRiskAnalysis(text)"
                  title="Saringan"
                  class="!px-3 !py-1.5"
                >
                  <Icon name="ph:shield-check" class="w-4 h-4 mr-1" />
                  Saringan
                </rs-button>
              </div>
            </template>
          </rs-table>
        </template>
      </rs-card>
    </div>

    <!-- Default Content for Other Roles -->
    <rs-card v-else class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Senarai Permohonan Penolong Amil Sedang Diproses
          </h2>
          <!-- PA-PP-PD-01_03: Registration Form - Borang Pendaftaran Calon Penolong Amil -->
          <rs-button
            v-if="currentRole !== 'eksekutif' && currentRole !== 'eksekutif-pengurusan-risiko'"
            variant="primary"
            @click="navigateTo('/BF-PA/PP/pra-daftar-v3/daftar-baharu')"
          >
            <Icon name="material-symbols:add-circle" class="mr-2" />
            Tambah Baru
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Smart Filter Section -->
        <div class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormKit
              v-model="filters.searchQuery"
              type="text"
              placeholder="Cari nombor rujukan, nama calon..."
              :classes="{
                input: '!py-2',
              }"
            />
            <FormKit
              v-model="filters.statusPendaftaran"
              type="select"
              :options="statusPendaftaranOptions"
              placeholder="Status Pendaftaran"
              :classes="{
                input: '!py-2',
              }"
            />
            <rs-button
              variant="primary"
              @click="handleSearch"
              class="!py-2 !px-4"
            >
              <Icon name="ph:magnifying-glass" class="w-4 h-4 mr-2" />
              Cari
            </rs-button>
          </div>
        </div>

        <!-- Applications Table -->
        <rs-table
          :data="filteredApplications"
          :columns="eksekutifColumnsWithoutStatusLantikan"
          :pageSize="pageSize"
          :show-search="false"
          :show-filter="false"
          :options="{
            variant: 'default',
            hover: true,
            striped: true,
          }"
          :options-advanced="{
            sortable: true,
            filterable: true,
          }"
          advanced
        >
          <template v-slot:statusPendaftaran="{ text }">
            <rs-badge :variant="getStatusPendaftaranVariant(text)">
              {{ text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="{ text }">
            <div class="flex justify-center items-center gap-1">
              <rs-button
                variant="primary"
                size="sm"
                @click="handleView(text)"
                title="Lihat"
                class="!px-3 !py-1.5"
              >
                <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                Lihat
              </rs-button>
              <rs-button
                variant="info"
                size="sm"
                @click="handleViewProcessTrace(text)"
                title="Jejak Proses"
                class="!px-3 !py-1.5"
              >
                <Icon name="ph:flow-arrow" class="w-4 h-4 mr-1" />
                Jejak
              </rs-button>
              <rs-button
                v-if="canEdit(text.statusPendaftaran)"
                variant="secondary"
                size="sm"
                @click="handleEdit(text)"
                title="Kemaskini"
                class="!px-3 !py-1.5"
              >
                <Icon name="ph:pencil" class="w-4 h-4 mr-1" />
                Kemaskini
              </rs-button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>

    <!-- Completed Penolong Amil Section - Show for all roles -->
    <div class="mt-8">
      <rs-card>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">
              Senarai Penolong Amil Lengkap
            </h3>
            <p v-if="currentRole === 'pyb'" class="text-sm text-gray-600 mt-1">
              Senarai Penolong Amil yang telah dilantik dan aktif di institusi anda.
            </p>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500">
                {{ completedApplications.length }} Penolong Amil Aktif
              </span>
            </div>
          </div>
        </template>

        <template #body>
          <!-- Smart Filter for Completed Applications -->
          <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormKit
                v-model="completedFilters.searchQuery"
                type="text"
                placeholder="Cari nama, no KP, institusi..."
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-model="completedFilters.kategoriPenolongAmil"
                type="select"
                :options="kategoriPenolongAmilOptions"
                placeholder="Kategori Penolong Amil"
                :classes="{
                  input: '!py-2',
                }"
              />

              <FormKit
                v-model="completedFilters.statusLantikan"
                type="select"
                :options="completedStatusLantikanOptions"
                placeholder="Status Lantikan"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
          </div>

          <!-- Completed Applications Table -->
          <rs-table
            :data="filteredCompletedApplications"
            :columns="completedColumns"
            :pageSize="pageSize"
            :show-search="false"
            :show-filter="false"
            :options="{
              variant: 'default',
              hover: true,
              striped: true,
            }"
            :options-advanced="{
              sortable: true,
              filterable: true,
            }"
            advanced
          >
            <template v-slot:statusLantikan="{ text }">
              <rs-badge :variant="getStatusLantikanVariant(text)">
                {{ text }}
              </rs-badge>
            </template>

            <template v-slot:tindakan="{ text }">
              <div class="flex justify-center items-center gap-1">
                <rs-button
                variant="primary"
                size="sm"
                @click="handleViewComplete(text)"
                title="Lihat Terperinci"
                class="!px-3 !py-1.5"
              >
                <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                Lihat
              </rs-button>
              <rs-button
                variant="secondary"
                size="sm"
                @click="handleViewServiceHistory(text)"
                title="Sejarah Perkhidmatan"
                class="!px-3 !py-1.5"
              >
                <Icon name="ph:clock" class="w-4 h-4 mr-1" />
                Jejak
              </rs-button>
              </div>
            </template>
          </rs-table>
        </template>
      </rs-card>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between px-5 mt-4">
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-700">Baris per halaman:</span>
        <FormKit
          v-model="pageSize"
          type="select"
          :options="[10, 25, 50]"
          :classes="{
            wrapper: 'w-20',
            outer: 'mb-0',
            input: '!rounded-lg',
          }"
        />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-700">
          Menunjukkan {{ paginationStart }} hingga
          {{ paginationEnd }} daripada {{ totalApplications }} entri
        </span>
        <div class="flex gap-1">
          <rs-button
            variant="primary-outline"
            class="!p-1 !w-8 !h-8"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
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
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

definePageMeta({
  title: "Senarai Permohonan Penolong Amil",
  description: "Senarai permohonan penolong amil untuk semakan dan kelulusan",
});

const breadcrumb = ref([
  {
    name: "Penolong Amil",
    type: "link",
    path: "/BF-PA/PP/PM/01",
  },
  {
    name: "Pendaftaran",
    type: "link",
    path: "/BF-PA/PP/PM/01",
  },
  {
    name: "Senarai Permohonan V3",
    type: "current",
    path: "/BF-PA/PP/pra-daftar-v3",
  },
]);

// Optimized Table Columns - Essential Information Only
const columns = [
  {
    key: "rujukan",
    label: "Rujukan",
    sortable: true,
  },
  {
    key: "nama",
    label: "Nama",
    sortable: true,
  },
  {
    key: "noKP",
    label: "ID Pengenalan",
    sortable: true,
  },
  {
    key: "kategoriPenolongAmil",
    label: "Kategori",
    sortable: true,
  },
  {
    key: "jawatan",
    label: "Jawatan",
    sortable: true,
  },
  {
    key: "institusiKariah",
    label: "Institusi",
    sortable: true,
  },
  {
    key: "statusPendaftaran",
    label: "Status",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
    width: "140px",
  },
];

// Use optimized columns for all roles
const eksekutifColumns = columns;

// Create specific columns for Eksekutif role (without Status Lantikan) - UPDATED LABELS
const eksekutifColumnsWithoutStatusLantikan = [
  {
    key: "rujukan",
    label: "Rujukan",
    sortable: true,
  },
  {
    key: "nama",
    label: "Nama",
    sortable: true,
  },
  {
    key: "noKP",
    label: "ID Pengenalan", // UPDATED: Changed from "No K P"
    sortable: true,
  },
  {
    key: "kategoriPenolongAmil",
    label: "Kategori", // UPDATED: Changed from "Kategori Penolong Amil"
    sortable: true,
  },
  {
    key: "jawatan",
    label: "Jawatan",
    sortable: true,
  },
  {
    key: "institusiKariah",
    label: "Institusi", // UPDATED: Changed from "Institusi Kariah"
    sortable: true,
  },
  {
    key: "statusPendaftaran",
    label: "Status",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
    width: "140px",
  },
];

// RTMF Required Filter Options
const statusPendaftaranOptions = [
  { label: "Semua Status Pendaftaran", value: "" },
  { label: "Draf", value: "Draft" },
  { label: "Dihantar", value: "Submitted" },
  { label: "Dalam Semakan", value: "Under Review" },
  { label: "Telah Disaring", value: "Screened" },
  { label: "Telah Disemak", value: "PT Reviewed" },
  { label: "Telah Disokong", value: "Executive Supported" },
  { label: "Telah Disahkan", value: "Department Confirmed" },
  { label: "Telah Diluluskan", value: "Division Approved" },
  { label: "Diluluskan", value: "Approved" },
  { label: "Ditolak", value: "Rejected" },
];

const sesiPerkhidmatanOptions = [
  { label: "Semua Sesi", value: "" },
  { label: "Sesi 1 - Januari-Mac", value: "Sesi 1" },
  { label: "Sesi 2 - April-Jun", value: "Sesi 2" },
  { label: "Sesi 3 - Julai-September", value: "Sesi 3" },
  { label: "Sesi 4 - Oktober-Disember", value: "Sesi 4" },
];

const kategoriPenolongAmilOptions = [
  { label: "Semua Kategori", value: "" },
  { label: "Fitrah", value: "Fitrah" },
  { label: "Padi", value: "Padi" },
  { label: "Kariah", value: "Kariah" },
  { label: "Komuniti", value: "Komuniti" },
];

const statusLantikanOptions = [
  { label: "Semua Status Lantikan", value: "" },
  { label: "Menunggu", value: "Pending" },
  { label: "Dilantik", value: "Appointed" },
  { label: "Aktif", value: "Active" },
  { label: "Tidak Aktif", value: "Inactive" },
  { label: "Ditamatkan", value: "Terminated" },
];

// Completed applications status options (only active statuses)
const completedStatusLantikanOptions = [
  { label: "Semua Status", value: "" },
  { label: "Aktif", value: "Aktif" },
  { label: "Tidak Aktif", value: "Tidak Aktif" },
  { label: "Ditamatkan", value: "Ditamatkan" },
];

// State
const filters = ref({
  searchQuery: "",
  statusPendaftaran: "",
  sesiPerkhidmatan: "",
});

// Search state to control when filters are applied
const isSearchTriggered = ref(false);

// Completed applications filters
const completedFilters = ref({
  searchQuery: "",
  kategoriPenolongAmil: "",
  sesiPerkhidmatan: "",
  statusLantikan: "",
});
const currentPage = ref(1);
const pageSize = ref(10);
const currentRole = ref("pyb");

// Role Simulator State
const showRoleInfo = ref(false);

// Page-specific role options for Pra Daftar V3
const roleOptions = [
  { label: "PYB Institusi", value: "pyb" },
  { label: "Eksekutif Pengurusan Risiko", value: "eksekutif-pengurusan-risiko" },
  { label: "PT", value: "pt" },
  { label: "Eksekutif", value: "eksekutif" },
  { label: "Ketua Jabatan", value: "ketua-jabatan" },
  { label: "Ketua Divisyen", value: "ketua-divisyen" },
];

// Role data for Pra Daftar V3
const roleData = {
  pyb: {
    label: "PYB Institusi",
    description: "Pendaftaran Calon Penolong Amil",
    capabilities: ["Daftar Calon", "Lihat Senarai", "Kemaskini Maklumat"],
  },
  "eksekutif-pengurusan-risiko": {
    label: "Eksekutif Pengurusan Risiko",
    description: "Saringan Risiko dan Pematuhan",
    capabilities: ["Saringan Risiko", "Pematuhan", "Pengesahan Saringan"],
  },
  pt: {
    label: "PT",
    description: "Semakan Dokumen PT",
    capabilities: ["Semakan PT", "Pengesahan Awal", "Hantar ke Eksekutif"],
  },
  eksekutif: {
    label: "Eksekutif",
    description: "Sokongan Eksekutif",
    capabilities: ["Sokongan", "Upload Surat Sokongan", "Hantar ke Ketua Jabatan"],
  },
  "ketua-jabatan": {
    label: "Ketua Jabatan",
    description: "Pengesahan Ketua Jabatan",
    capabilities: ["Pengesahan", "Kelulusan", "Hantar ke Ketua Divisyen"],
  },
  "ketua-divisyen": {
    label: "Ketua Divisyen",
    description: "Kelulusan Akhir",
    capabilities: ["Kelulusan Akhir", "Pelantikan", "Integrasi NAS"],
  },
};

// Role simulator helper functions
const getRoleVariant = (role) => {
  const variants = {
    pyb: "primary",
    "eksekutif-pengurusan-risiko": "warning",
    pt: "info",
    eksekutif: "success",
    "ketua-jabatan": "purple",
    "ketua-divisyen": "danger",
  };
  return variants[role] || "default";
};

const getRoleLabel = (role) => {
  return roleData[role]?.label || role;
};

const getRoleDescription = (role) => {
  return roleData[role]?.description || "";
};

const getRoleCapabilities = (role) => {
  return roleData[role]?.capabilities || [];
};

const handleRoleChange = () => {
  // Role change logic can be added here if needed
  console.log("Role changed to:", currentRole.value);
};

const handleSearch = () => {
  isSearchTriggered.value = true;
  currentPage.value = 1; // Reset to first page when searching
};

const handleReset = () => {
  filters.value.searchQuery = "";
  filters.value.statusPendaftaran = "";
  isSearchTriggered.value = false;
  currentPage.value = 1;
};

const toggleRoleInfo = () => {
  showRoleInfo.value = !showRoleInfo.value;
};

// RTMF Compliant Mock Data - Role-specific with Institution Filtering
const applications = ref([
  {
    no: 1,
    rujukan: "PA-2024-001",
    nama: "Ahmad bin Abdullah",
    noKP: "901231012345",
    kategoriPenolongAmil: "Fitrah",
    jawatan: "Penolong Amil Fitrah",
    institusiKariah: "Masjid Negeri Selangor",
    institusiId: "MASJID_NEGERI_SELANGOR_001",
    statusPendaftaran: "Dihantar",
    statusLantikan: "Menunggu",
    tindakan: { rujukan: "PA-2024-001", statusPendaftaran: "Dihantar" },
  },
  {
    no: 2,
    rujukan: "PA-2024-002",
    nama: "Siti binti Mohamed",
    noKP: "850515087654",
    kategoriPenolongAmil: "Kariah",
    jawatan: "Penolong Amil Kariah",
    institusiKariah: "Masjid Negeri Selangor",
    institusiId: "MASJID_NEGERI_SELANGOR_001",
    statusPendaftaran: "Dalam Semakan",
    statusLantikan: "Menunggu",
    tindakan: { rujukan: "PA-2024-002", statusPendaftaran: "Dalam Semakan" },
  },
  {
    no: 3,
    rujukan: "PA-2024-003",
    nama: "Mohd Razak bin Ibrahim",
    noKP: "880320056789",
    kategoriPenolongAmil: "Komuniti",
    jawatan: "Penolong Amil Komuniti",
    institusiKariah: "Masjid Al-Khairiyah",
    institusiId: "MASJID_AL_KHAIRIYAH_002",
    statusPendaftaran: "Diluluskan",
    statusLantikan: "Dilantik",
    tindakan: { rujukan: "PA-2024-003", statusPendaftaran: "Diluluskan" },
  },
  {
    no: 4,
    rujukan: "PA-2024-004",
    nama: "Nurul Huda binti Ali",
    noKP: "920810034567",
    kategoriPenolongAmil: "Padi",
    jawatan: "Penolong Amil Padi",
    institusiKariah: "Masjid Negeri Selangor",
    institusiId: "MASJID_NEGERI_SELANGOR_001",
    statusPendaftaran: "Ditolak",
    statusLantikan: "Ditamatkan",
    tindakan: { rujukan: "PA-2024-004", statusPendaftaran: "Ditolak" },
  },
  {
    no: 5,
    rujukan: "PA-2024-005",
    nama: "Abdul Rahman bin Hassan",
    noKP: "870625098765",
    kategoriPenolongAmil: "Fitrah",
    jawatan: "Penolong Amil Fitrah",
    institusiKariah: "Masjid Kg Delek",
    institusiId: "MASJID_KG_DELEK_003",
    statusPendaftaran: "Diluluskan",
    statusLantikan: "Aktif",
    tindakan: { rujukan: "PA-2024-005", statusPendaftaran: "Diluluskan" },
  },
]);

// Completed Penolong Amil Data (with full details and institution IDs)
const completedApplications = ref([
  {
    no: 1,
    rujukan: "PA-2023-001",
    nama: "Mohd Zulkifli bin Ahmad",
    noKP: "850315071234",
    kategoriPenolongAmil: "Fitrah",
    jawatan: "Penolong Amil Fitrah",
    institusiKariah: "Masjid Negeri Selangor",
    institusiId: "MASJID_NEGERI_SELANGOR_001",
    statusLantikan: "Aktif",
    tarikhLantikan: "01/01/2023",
    namaBank: "Maybank",
    noAkaunBank: "1234567890",
    namaPemegangAkaun: "Mohd Zulkifli bin Ahmad",
    namaWaris: "Siti Aminah binti Hassan",
    hubunganWaris: "Isteri",
    telefonWaris: "0123456789",
    tindakan: { rujukan: "PA-2023-001" },
  },
  {
    no: 2,
    rujukan: "PA-2023-002",
    nama: "Fatimah binti Omar",
    noKP: "880420082345",
    kategoriPenolongAmil: "Kariah",
    jawatan: "Penolong Amil Kariah",
    institusiKariah: "Masjid Negeri Selangor",
    institusiId: "MASJID_NEGERI_SELANGOR_001",
    statusLantikan: "Aktif",
    tarikhLantikan: "01/04/2023",
    namaBank: "CIMB Bank",
    noAkaunBank: "0987654321",
    namaPemegangAkaun: "Fatimah binti Omar",
    namaWaris: "Ahmad bin Omar",
    hubunganWaris: "Suami",
    telefonWaris: "0134567890",
    tindakan: { rujukan: "PA-2023-002" },
  },
  {
    no: 3,
    rujukan: "PA-2023-003",
    nama: "Abdul Hamid bin Ismail",
    noKP: "900525093456",
    kategoriPenolongAmil: "Padi",
    jawatan: "Penolong Amil Padi",
    institusiKariah: "Masjid Al-Khairiyah",
    institusiId: "MASJID_AL_KHAIRIYAH_002",
    statusLantikan: "Aktif",
    tarikhLantikan: "01/07/2023",
    namaBank: "Public Bank",
    noAkaunBank: "1122334455",
    namaPemegangAkaun: "Abdul Hamid bin Ismail",
    namaWaris: "Noraini binti Abdullah",
    hubunganWaris: "Isteri",
    telefonWaris: "0145678901",
    tindakan: { rujukan: "PA-2023-003" },
  },
]);

// Completed applications table columns
const completedColumns = [
  {
    key: "rujukan",
    label: "Rujukan",
    sortable: true,
  },
  {
    key: "nama",
    label: "Nama Penolong Amil",
    sortable: true,
  },
  {
    key: "noKP",
    label: "ID Pengenalan",
    sortable: true,
  },
  {
    key: "kategoriPenolongAmil",
    label: "Kategori",
    sortable: true,
  },
  {
    key: "jawatan",
    label: "Jawatan",
    sortable: true,
  },
  {
    key: "institusiKariah",
    label: "Institusi",
    sortable: true,
  },
  {
    key: "tarikhLantikan",
    label: "Tarikh Lantikan",
    sortable: true,
  },
  {
    key: "statusLantikan",
    label: "Status Lantikan/Perkhidmatan",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
  },
];

// Role-specific mock data for different views
const roleSpecificData = {
  pyb: [
    {
      no: 1,
      rujukan: "PA-2024-001",
      nama: "Ahmad bin Abdullah",
      noKP: "901231012345",
      kategoriPenolongAmil: "Fitrah",
      jawatan: "Penolong Amil Fitrah",
      institusiKariah: "Masjid Negeri Selangor",
      institusiId: "MASJID_NEGERI_SELANGOR_001",
      statusPendaftaran: "Dihantar",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-001", statusPendaftaran: "Dihantar" },
    },
    {
      no: 2,
      rujukan: "PA-2024-002",
      nama: "Siti binti Mohamed",
      noKP: "850515087654",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Negeri Selangor",
      statusPendaftaran: "Dalam Semakan",
      sesiPerkhidmatan: "Sesi 2",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-002", statusPendaftaran: "Dalam Semakan" },
    },
    {
      no: 3,
      rujukan: "PA-2024-003",
      nama: "Mohd Razak bin Ibrahim",
      noKP: "880320056789",
      kategoriPenolongAmil: "Komuniti",
      jawatan: "Penolong Amil Komuniti",
      institusiKariah: "Masjid Negeri Selangor",
      statusPendaftaran: "Telah Disaring",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-003", statusPendaftaran: "Telah Disaring" },
    },
    {
      no: 4,
      rujukan: "PA-2024-004",
      nama: "Nurul Huda binti Ali",
      noKP: "920810034567",
      kategoriPenolongAmil: "Padi",
      jawatan: "Penolong Amil Padi",
      institusiKariah: "Masjid Negeri Selangor",
      statusPendaftaran: "Telah Disemak",
      sesiPerkhidmatan: "Sesi 4",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-004", statusPendaftaran: "Telah Disemak" },
    },
    {
      no: 5,
      rujukan: "PA-2024-005",
      nama: "Abdul Rahman bin Hassan",
      noKP: "870625098765",
      kategoriPenolongAmil: "Fitrah",
      jawatan: "Penolong Amil Fitrah",
      institusiKariah: "Masjid Negeri Selangor",
      statusPendaftaran: "Telah Disokong",
      sesiPerkhidmatan: "Sesi 1",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-005", statusPendaftaran: "Telah Disokong" },
    },
    {
      no: 6,
      rujukan: "PA-2024-006",
      nama: "Fatimah binti Omar",
      noKP: "880420082345",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Negeri Selangor",
      statusPendaftaran: "Telah Disahkan",
      sesiPerkhidmatan: "Sesi 2",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-006", statusPendaftaran: "Telah Disahkan" },
    },
    {
      no: 7,
      rujukan: "PA-2024-007",
      nama: "Zulkifli bin Ahmad",
      noKP: "850315071234",
      kategoriPenolongAmil: "Padi",
      jawatan: "Penolong Amil Padi",
      institusiKariah: "Masjid Negeri Selangor",
      statusPendaftaran: "Telah Diluluskan",
      sesiPerkhidmatan: "Sesi 3",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-007", statusPendaftaran: "Telah Diluluskan" },
    },
    {
      no: 8,
      rujukan: "PA-2024-008",
      nama: "Noraini binti Abdullah",
      noKP: "900525093456",
      kategoriPenolongAmil: "Fitrah",
      jawatan: "Penolong Amil Fitrah",
      institusiKariah: "Masjid Negeri Selangor",
      statusPendaftaran: "Ditolak",
      sesiPerkhidmatan: "Sesi 4",
      statusLantikan: "Ditamatkan",
      tindakan: { rujukan: "PA-2024-008", statusPendaftaran: "Ditolak" },
    },
    {
      no: 9,
      rujukan: "PA-2024-009",
      nama: "Ismail bin Hassan",
      noKP: "870625098765",
      kategoriPenolongAmil: "Komuniti",
      jawatan: "Penolong Amil Komuniti",
      institusiKariah: "Masjid Negeri Selangor",
      statusPendaftaran: "Draf",
      sesiPerkhidmatan: "Sesi 1",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-009", statusPendaftaran: "Draf" },
    },
    {
      no: 10,
      rujukan: "PA-2024-010",
      nama: "Aminah binti Mohamed",
      noKP: "920810034567",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Negeri Selangor",
      statusPendaftaran: "Dalam Semakan",
      sesiPerkhidmatan: "Sesi 2",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-010", statusPendaftaran: "Dalam Semakan" },
    },
  ],
  "eksekutif-pengurusan-risiko": [
    {
      no: 1,
      rujukan: "PA-2024-001",
      nama: "Ahmad bin Abdullah",
      noKP: "901231012345",
      kategoriPenolongAmil: "Fitrah",
      jawatan: "Penolong Amil Fitrah",
      institusiKariah: "Masjid Negeri Selangor",
              statusPendaftaran: "Dihantar",
        sesiPerkhidmatan: "Sesi 1",
        statusLantikan: "Menunggu",
        tindakan: { rujukan: "PA-2024-001", statusPendaftaran: "Dihantar" },
    },
    {
      no: 2,
      rujukan: "PA-2024-002",
      nama: "Siti binti Mohamed",
      noKP: "850515087654",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Khairiyah",
              statusPendaftaran: "Dihantar",
        sesiPerkhidmatan: "Sesi 2",
        statusLantikan: "Menunggu",
        tindakan: { rujukan: "PA-2024-002", statusPendaftaran: "Dihantar" },
    },
    {
      no: 3,
      rujukan: "PA-2024-003",
      nama: "Mohd Razak bin Ibrahim",
      noKP: "880320056789",
      kategoriPenolongAmil: "Komuniti",
      jawatan: "Penolong Amil Komuniti",
      institusiKariah: "Masjid Kg Delek",
              statusPendaftaran: "Dihantar",
        sesiPerkhidmatan: "Sesi 3",
        statusLantikan: "Menunggu",
        tindakan: { rujukan: "PA-2024-003", statusPendaftaran: "Dihantar" },
    },
  ],
  pt: [
    {
      no: 1,
      rujukan: "PA-2024-001",
      nama: "Ahmad bin Abdullah",
      noKP: "901231012345",
      kategoriPenolongAmil: "Fitrah",
      jawatan: "Penolong Amil Fitrah",
      institusiKariah: "Masjid Negeri Selangor",
      statusPendaftaran: "Disaring",
      sesiPerkhidmatan: "Sesi 1",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-001", statusPendaftaran: "Telah Disaring" },
    },
    {
      no: 2,
      rujukan: "PA-2024-002",
      nama: "Siti binti Mohamed",
      noKP: "850515087654",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Khairiyah",
      statusPendaftaran: "Disaring",
      sesiPerkhidmatan: "Sesi 2",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-002", statusPendaftaran: "Telah Disaring" },
    },
  ],
  eksekutif: [
    {
      no: 1,
      rujukan: "PA-2024-001",
      nama: "Ahmad bin Abdullah",
      noKP: "901231012345",
      kategoriPenolongAmil: "Fitrah",
      jawatan: "Penolong Amil Fitrah",
      institusiKariah: "Masjid Negeri Selangor",
      statusPendaftaran: "Telah Disemak",
      sesiPerkhidmatan: "Sesi 1",
      tindakan: { rujukan: "PA-2024-001", statusPendaftaran: "Telah Disemak" },
    },
    {
      no: 2,
      rujukan: "PA-2024-002",
      nama: "Siti binti Mohamed",
      noKP: "850515087654",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Khairiyah",
      statusPendaftaran: "Telah Disemak",
      sesiPerkhidmatan: "Sesi 2",
      tindakan: { rujukan: "PA-2024-002", statusPendaftaran: "Telah Disemak" },
    },
  ],
  "ketua-jabatan": [
    {
      no: 1,
      rujukan: "PA-2024-001",
      nama: "Ahmad bin Abdullah",
      noKP: "901231012345",
      kategoriPenolongAmil: "Fitrah",
      jawatan: "Penolong Amil Fitrah",
      institusiKariah: "Masjid Negeri Selangor",
      statusPendaftaran: "Telah Disokong",
      sesiPerkhidmatan: "Sesi 1",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-001", statusPendaftaran: "Telah Disokong" },
    },
    {
      no: 2,
      rujukan: "PA-2024-002",
      nama: "Siti binti Mohamed",
      noKP: "850515087654",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Khairiyah",
      statusPendaftaran: "Telah Disokong",
      sesiPerkhidmatan: "Sesi 2",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-002", statusPendaftaran: "Telah Disokong" },
    },
  ],
  "ketua-divisyen": [
    {
      no: 1,
      rujukan: "PA-2024-001",
      nama: "Ahmad bin Abdullah",
      noKP: "901231012345",
      kategoriPenolongAmil: "Fitrah",
      jawatan: "Penolong Amil Fitrah",
      institusiKariah: "Masjid Negeri Selangor",
      statusPendaftaran: "Telah Disahkan",
      sesiPerkhidmatan: "Sesi 1",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-001", statusPendaftaran: "Telah Disahkan" },
    },
    {
      no: 2,
      rujukan: "PA-2024-002",
      nama: "Siti binti Mohamed",
      noKP: "850515087654",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Khairiyah",
      statusPendaftaran: "Telah Disahkan",
      sesiPerkhidmatan: "Sesi 2",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-002", statusPendaftaran: "Telah Disahkan" },
    },
  ],
};

// Computed properties
const filteredApplications = computed(() => {
  // Use role-specific data if available, otherwise use default data
  const dataSource = roleSpecificData[currentRole.value] || applications.value;
  let result = [...dataSource];

  // Apply institution filter for PYB role (only show applications from their institution)
  if (currentRole.value === 'pyb') {
    const currentInstitutionId = "MASJID_NEGERI_SELANGOR_001"; // Mock current user's institution
    result = result.filter((app) => app.institusiId === currentInstitutionId || !app.institusiId);
  }

  // Only apply filters if search button was clicked
  if (isSearchTriggered.value) {
    // Apply search filter
    if (filters.value.searchQuery) {
      const query = filters.value.searchQuery.toLowerCase();
      result = result.filter(
        (app) =>
          app.rujukan.toLowerCase().includes(query) ||
          app.nama.toLowerCase().includes(query) ||
          app.noKP.toLowerCase().includes(query)
      );
    }

    // Apply status filters
    if (filters.value.statusPendaftaran) {
      result = result.filter((app) => app.statusPendaftaran === filters.value.statusPendaftaran);
    }
  }

  // Remove sesiPerkhidmatan field from all objects to prevent it from showing in the table
  result = result.map(({ sesiPerkhidmatan, institusiId, ...rest }) => rest);
  
  // Remove statusLantikan field for all roles to hide the column
  result = result.map(({ statusLantikan, ...rest }) => rest);

  return result;
});

const totalApplications = computed(() => filteredApplications.value.length);

const totalPages = computed(() =>
  Math.ceil(totalApplications.value / pageSize.value)
);

const paginationStart = computed(() => {
  return totalApplications.value > 0
    ? (currentPage.value - 1) * pageSize.value + 1
    : 0;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalApplications.value);
});

// Completed applications computed properties
const filteredCompletedApplications = computed(() => {
  let result = [...completedApplications.value];

  // Apply institution filter for PYB role (only show completed applications from their institution)
  if (currentRole.value === 'pyb') {
    const currentInstitutionId = "MASJID_NEGERI_SELANGOR_001"; // Mock current user's institution
    result = result.filter((app) => app.institusiId === currentInstitutionId || !app.institusiId);
  }

  // Apply search filter
  if (completedFilters.value.searchQuery) {
    const query = completedFilters.value.searchQuery.toLowerCase();
    result = result.filter(
      (app) =>
        app.rujukan.toLowerCase().includes(query) ||
        app.nama.toLowerCase().includes(query) ||
        app.noKP.toLowerCase().includes(query) ||
        app.institusiKariah.toLowerCase().includes(query)
    );
  }

  // Apply category filter
  if (completedFilters.value.kategoriPenolongAmil) {
    result = result.filter((app) => app.kategoriPenolongAmil === completedFilters.value.kategoriPenolongAmil);
  }



  // Apply status filter
  if (completedFilters.value.statusLantikan) {
    result = result.filter((app) => app.statusLantikan === completedFilters.value.statusLantikan);
  }

  // Remove sesiPerkhidmatan field from all objects to prevent it from showing in the table
  result = result.map(({ sesiPerkhidmatan, institusiId, ...rest }) => rest);

  return result;
});

const totalCompletedApplications = computed(() => filteredCompletedApplications.value.length);

// Helper functions
const getStatusPendaftaranVariant = (status) => {
  const statusVariants = {
    Draft: "default",
    Draf: "default",
    Submitted: "warning",
    Dihantar: "warning",
    "Under Review": "info",
    "Dalam Semakan": "info",
    Screened: "info",
    Disaring: "info",
    "Telah Disaring": "info",
    "PT Reviewed": "info",
    "Disemak PT": "info",
    "Telah Disemak": "info",
    "Executive Supported": "success",
    "Disokong Eksekutif": "success",
    "Telah Disokong": "success",
    "Department Confirmed": "success",
    "Disahkan Jabatan": "success",
    "Telah Disahkan": "success",
    "Division Approved": "success",
    "Diluluskan Divisyen": "success",
    "Telah Diluluskan": "success",
    Approved: "success",
    Diluluskan: "success",
    Rejected: "danger",
    Ditolak: "danger",
  };
  return statusVariants[status] || "default";
};

const getStatusLantikanVariant = (status) => {
  const statusVariants = {
    Pending: "warning",
    Menunggu: "warning",
    Appointed: "info",
    Dilantik: "info",
    Active: "success",
    Aktif: "success",
    Inactive: "secondary",
    "Tidak Aktif": "secondary",
    Terminated: "danger",
    Ditamatkan: "danger",
  };
  return statusVariants[status] || "default";
};

const canEdit = (statusPendaftaran) => {
  return ["Draft", "Draf", "Submitted", "Dihantar"].includes(statusPendaftaran);
};

// Action handlers with RTMF screen references
// PA-PP-PD-01_02: Detail View - Maklumat Penolong Amil Terperinci
const handleView = (actionData) => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/detail/${actionData.rujukan}?role=${currentRole.value}`);
};

// PA-PP-PD-01_04: Edit Form - Borang Kemaskini Maklumat Penolong Amil
const handleEdit = (actionData) => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/edit/${actionData.rujukan}`);
};

// PA-PP-PD-04_02: Executive Detail - Paparan Terperinci Sokongan
const handleSupport = (actionData) => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/eksekutif/detail/${actionData.rujukan}`);
};

// PA-PP-PD-05_02: Department Head Detail - Paparan Terperinci Pengesahan
const handleConfirm = (actionData) => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/ketua-jabatan/detail/${actionData.rujukan}`);
};

// PA-PP-PD-06_02: Division Head Detail - Paparan Terperinci Kelulusan
const handleApprove = (actionData) => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/ketua-divisyen/detail/${actionData.rujukan}`);
};

// PA-PP-PD-03_02: PT Review Detail - Paparan Terperinci Semakan Dokumen
const handleReview = (actionData) => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/PT/detail/${actionData.rujukan}`);
};

// PA-PP-PD-04_02: Risk Analysis Detail - Paparan Terperinci Saringan Risiko
const handleRiskAnalysis = (actionData) => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/jabatan-risiko/detail/${actionData.rujukan}`);
};

// PA-PP-PD-01_02 (Complete): Complete Detail View - Maklumat Penolong Amil Lengkap
const handleViewComplete = (actionData) => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/detail-complete/${actionData.rujukan}`);
};

// PA-PP-PD-01_04: Process Trace - Jejak Proses Pendaftaran
const handleViewProcessTrace = (actionData) => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/process-trace/${actionData.rujukan}`);
};

// PA-PP-PD-01_05: Service History - Sejarah Perkhidmatan
const handleViewServiceHistory = (actionData) => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/service-history/${actionData.rujukan}`);
};

// Watch for page size changes to reset current page
watch(pageSize, () => {
  currentPage.value = 1;
});

</script>

<style scoped>
/* Custom styles for RTMF compliance */
</style> 

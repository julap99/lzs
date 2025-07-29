<!-- 
  RTMF SCREEN: PA-PP-PD-01_01
  PURPOSE: Main Dashboard - Senarai Permohonan Penolong Amil
  DESCRIPTION: Dynamic dashboard with role-based content for Penolong Amil applications
  ROUTE: /BF-PA/PP/pra-daftar-v3
-->
<template>
  <div>
    <RoleSimulator :initial-role="currentRole" @role-change="handleRoleChange" />
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
              <FormKit
                v-model="filters.statusLantikan"
                type="select"
                :options="statusLantikanOptions"
                placeholder="Status Lantikan"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
          </div>

          <!-- Applications Table -->
          <rs-table
            :data="filteredApplications"
            :columns="eksekutifColumns"
            :pageSize="pageSize"
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

            <template v-slot:statusLantikan="{ text }">
              <rs-badge :variant="getStatusLantikanVariant(text)">
                {{ text }}
              </rs-badge>
            </template>

            <template v-slot:tindakan="{ text }">
              <div class="flex justify-center items-center gap-2">
                <rs-button
                  variant="primary"
                  size="sm"
                  @click="handleView(text)"
                >
                  <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                  Lihat
                </rs-button>
                <rs-button
                  variant="secondary"
                  size="sm"
                  @click="handleSupport(text)"
                >
                  <Icon name="ph:hand-thumbs-up" class="w-4 h-4 mr-1" />
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
              <FormKit
                v-model="filters.statusLantikan"
                type="select"
                :options="statusLantikanOptions"
                placeholder="Status Lantikan"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
          </div>

          <!-- Applications Table -->
          <rs-table
            :data="filteredApplications"
            :columns="eksekutifColumns"
            :pageSize="pageSize"
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

            <template v-slot:statusLantikan="{ text }">
              <rs-badge :variant="getStatusLantikanVariant(text)">
                {{ text }}
              </rs-badge>
            </template>

            <template v-slot:tindakan="{ text }">
              <div class="flex justify-center items-center gap-2">
                <rs-button
                  variant="primary"
                  size="sm"
                  @click="handleView(text)"
                >
                  <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                  Lihat
                </rs-button>
                <rs-button
                  variant="success"
                  size="sm"
                  @click="handleConfirm(text)"
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
              <FormKit
                v-model="filters.statusLantikan"
                type="select"
                :options="statusLantikanOptions"
                placeholder="Status Lantikan"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
          </div>

          <!-- Applications Table -->
          <rs-table
            :data="filteredApplications"
            :columns="eksekutifColumns"
            :pageSize="pageSize"
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

            <template v-slot:statusLantikan="{ text }">
              <rs-badge :variant="getStatusLantikanVariant(text)">
                {{ text }}
              </rs-badge>
            </template>

            <template v-slot:tindakan="{ text }">
              <div class="flex justify-center items-center gap-2">
                <rs-button
                  variant="primary"
                  size="sm"
                  @click="handleView(text)"
                >
                  <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                  Lihat
                </rs-button>
                <rs-button
                  variant="danger"
                  size="sm"
                  @click="handleApprove(text)"
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
              <FormKit
                v-model="filters.statusLantikan"
                type="select"
                :options="statusLantikanOptions"
                placeholder="Status Lantikan"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
          </div>

          <!-- Applications Table -->
          <rs-table
            :data="filteredApplications"
            :columns="eksekutifColumns"
            :pageSize="pageSize"
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

            <template v-slot:statusLantikan="{ text }">
              <rs-badge :variant="getStatusLantikanVariant(text)">
                {{ text }}
              </rs-badge>
            </template>

            <template v-slot:tindakan="{ text }">
              <div class="flex justify-center items-center gap-2">
                <rs-button
                  variant="primary"
                  size="sm"
                  @click="handleView(text)"
                >
                  <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                  Lihat
                </rs-button>
                <rs-button
                  variant="info"
                  size="sm"
                  @click="handleReview(text)"
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
              Senarai Penolong Amil untuk Analisis Risiko
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
              <FormKit
                v-model="filters.statusLantikan"
                type="select"
                :options="statusLantikanOptions"
                placeholder="Status Lantikan"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
          </div>

          <!-- Applications Table -->
          <rs-table
            :data="filteredApplications"
            :columns="eksekutifColumns"
            :pageSize="pageSize"
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

            <template v-slot:statusLantikan="{ text }">
              <rs-badge :variant="getStatusLantikanVariant(text)">
                {{ text }}
              </rs-badge>
            </template>

            <template v-slot:tindakan="{ text }">
              <div class="flex justify-center items-center gap-2">
                <rs-button
                  variant="primary"
                  size="sm"
                  @click="handleView(text)"
                >
                  <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                  Lihat
                </rs-button>
                <rs-button
                  variant="warning"
                  size="sm"
                  @click="handleRiskAnalysis(text)"
                >
                  <Icon name="ph:warning" class="w-4 h-4 mr-1" />
                  Analisis Risiko
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
            Senarai Permohonan Penolong Amil
          </h2>
          <p v-if="currentRole === 'pyb'" class="text-sm text-gray-600 mt-1">
            Sebagai PYB Institusi, anda boleh mendaftar calon baru. Proses saringan akan diuruskan oleh Jabatan Pengurusan Risiko.
          </p>
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
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <FormKit
              v-model="filters.sesiPerkhidmatan"
              type="select"
              :options="sesiPerkhidmatanOptions"
              placeholder="Sesi Perkhidmatan"
              :classes="{
                input: '!py-2',
              }"
            />
            <FormKit
              v-model="filters.statusLantikan"
              type="select"
              :options="statusLantikanOptions"
              placeholder="Status Lantikan"
              :classes="{
                input: '!py-2',
              }"
            />
          </div>
        </div>

        <!-- Applications Table -->
        <rs-table
          :data="filteredApplications"
          :columns="columns"
          :pageSize="pageSize"
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

          <template v-slot:statusLantikan="{ text }">
            <rs-badge :variant="getStatusLantikanVariant(text)">
              {{ text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="{ text }">
            <div class="flex justify-center items-center gap-2">
              <rs-button
                variant="primary"
                size="sm"
                @click="handleView(text)"
              >
                <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                Lihat
              </rs-button>
              <rs-button
                variant="info"
                size="sm"
                @click="handleViewProcessTrace(text)"
                title="PA-PP-PD-01_04: Jejak Proses"
              >
                <Icon name="ph:timeline" class="w-4 h-4 mr-1" />
                Jejak
              </rs-button>
              <rs-button
                v-if="canEdit(text.statusPendaftaran)"
                variant="secondary"
                size="sm"
                @click="handleEdit(text)"
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
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                v-model="completedFilters.sesiPerkhidmatan"
                type="select"
                :options="sesiPerkhidmatanOptions"
                placeholder="Sesi Perkhidmatan"
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
              <div class="flex justify-center items-center gap-2">
                              <rs-button
                variant="primary"
                size="sm"
                @click="handleViewComplete(text)"
              >
                <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                Lihat Terperinci
              </rs-button>
              <rs-button
                variant="secondary"
                size="sm"
                @click="handleViewServiceHistory(text)"
                title="PA-PP-PD-01_05: Sejarah Perkhidmatan"
              >
                <Icon name="ph:clock" class="w-4 h-4 mr-1" />
                Sejarah
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

// RTMF Required Table Columns
const columns = [
  {
    key: "no",
    label: "No",
    sortable: true,
    width: "60px",
  },
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
    label: "No KP",
    sortable: true,
  },
  {
    key: "kategoriPenolongAmil",
    label: "Kategori Penolong Amil",
    sortable: true,
  },
  {
    key: "jawatan",
    label: "Jawatan",
    sortable: true,
  },
  {
    key: "institusiKariah",
    label: "Institusi/Kariah",
    sortable: true,
  },
  {
    key: "statusPendaftaran",
    label: "Status Pendaftaran",
    sortable: true,
  },
  {
    key: "sesiPerkhidmatan",
    label: "Sesi Perkhidmatan",
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

// Eksekutif-specific Table Columns
const eksekutifColumns = [
  {
    key: "no",
    label: "No",
    sortable: true,
    width: "60px",
  },
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
    label: "No KP",
    sortable: true,
  },
  {
    key: "kategoriPenolongAmil",
    label: "Kategori Penolong Amil",
    sortable: true,
  },
  {
    key: "jawatan",
    label: "Jawatan",
    sortable: true,
  },
  {
    key: "institusiKariah",
    label: "Institusi/Kariah",
    sortable: true,
  },
  {
    key: "statusPendaftaran",
    label: "Status Pendaftaran",
    sortable: true,
  },
  {
    key: "statusLantikan",
    label: "Status Lantikan",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
  },
];

// RTMF Required Filter Options
const statusPendaftaranOptions = [
  { label: "Semua Status", value: "" },
  { label: "Draft", value: "Draft" },
  { label: "Submitted", value: "Submitted" },
  { label: "Under Review", value: "Under Review" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
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
  { label: "Semua Status", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Appointed", value: "Appointed" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Terminated", value: "Terminated" },
];

// Completed applications status options (only active statuses)
const completedStatusLantikanOptions = [
  { label: "Semua Status", value: "" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Terminated", value: "Terminated" },
];

// State
const filters = ref({
  searchQuery: "",
  statusPendaftaran: "",
  sesiPerkhidmatan: "",
  statusLantikan: "",
});

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
    statusPendaftaran: "Submitted",
    sesiPerkhidmatan: "Sesi 1",
    statusLantikan: "Pending",
    tindakan: { rujukan: "PA-2024-001", statusPendaftaran: "Submitted" },
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
    statusPendaftaran: "Under Review",
    sesiPerkhidmatan: "Sesi 2",
    statusLantikan: "Pending",
    tindakan: { rujukan: "PA-2024-002", statusPendaftaran: "Under Review" },
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
    statusPendaftaran: "Approved",
    sesiPerkhidmatan: "Sesi 3",
    statusLantikan: "Appointed",
    tindakan: { rujukan: "PA-2024-003", statusPendaftaran: "Approved" },
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
    statusPendaftaran: "Rejected",
    sesiPerkhidmatan: "Sesi 4",
    statusLantikan: "Terminated",
    tindakan: { rujukan: "PA-2024-004", statusPendaftaran: "Rejected" },
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
    statusPendaftaran: "Approved",
    sesiPerkhidmatan: "Sesi 1",
    statusLantikan: "Active",
    tindakan: { rujukan: "PA-2024-005", statusPendaftaran: "Approved" },
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
    sesiPerkhidmatan: "Sesi 1",
    statusLantikan: "Active",
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
    sesiPerkhidmatan: "Sesi 2",
    statusLantikan: "Active",
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
    sesiPerkhidmatan: "Sesi 3",
    statusLantikan: "Active",
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
    key: "no",
    label: "No",
    sortable: true,
    width: "60px",
  },
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
    label: "No KP",
    sortable: true,
  },
  {
    key: "kategoriPenolongAmil",
    label: "Kategori Penolong Amil",
    sortable: true,
  },
  {
    key: "jawatan",
    label: "Jawatan",
    sortable: true,
  },
  {
    key: "institusiKariah",
    label: "Institusi/Kariah",
    sortable: true,
  },
  {
    key: "sesiPerkhidmatan",
    label: "Sesi Perkhidmatan",
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
      institusiKariah: "Masjid Wilayah Persekutuan",
      statusPendaftaran: "Draft",
      sesiPerkhidmatan: "Sesi 1",
      statusLantikan: "Pending",
      tindakan: { rujukan: "PA-2024-001", statusPendaftaran: "Draft" },
    },
    {
      no: 2,
      rujukan: "PA-2024-002",
      nama: "Siti binti Mohamed",
      noKP: "850515087654",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Khairiyah",
      statusPendaftaran: "Submitted",
      sesiPerkhidmatan: "Sesi 2",
      statusLantikan: "Pending",
      tindakan: { rujukan: "PA-2024-002", statusPendaftaran: "Submitted" },
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
      institusiKariah: "Masjid Wilayah Persekutuan",
      statusPendaftaran: "Submitted",
      sesiPerkhidmatan: "Sesi 1",
      statusLantikan: "Pending",
      tindakan: { rujukan: "PA-2024-001", statusPendaftaran: "Submitted" },
    },
    {
      no: 2,
      rujukan: "PA-2024-002",
      nama: "Siti binti Mohamed",
      noKP: "850515087654",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Khairiyah",
      statusPendaftaran: "Under Review",
      sesiPerkhidmatan: "Sesi 2",
      statusLantikan: "Pending",
      tindakan: { rujukan: "PA-2024-002", statusPendaftaran: "Under Review" },
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
      institusiKariah: "Masjid Wilayah Persekutuan",
      statusPendaftaran: "Under Review",
      sesiPerkhidmatan: "Sesi 1",
      statusLantikan: "Pending",
      tindakan: { rujukan: "PA-2024-001", statusPendaftaran: "Under Review" },
    },
    {
      no: 2,
      rujukan: "PA-2024-002",
      nama: "Siti binti Mohamed",
      noKP: "850515087654",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Khairiyah",
      statusPendaftaran: "Under Review",
      sesiPerkhidmatan: "Sesi 2",
      statusLantikan: "Pending",
      tindakan: { rujukan: "PA-2024-002", statusPendaftaran: "Under Review" },
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
      institusiKariah: "Masjid Wilayah Persekutuan",
      statusPendaftaran: "Under Review",
      sesiPerkhidmatan: "Sesi 1",
      statusLantikan: "Pending",
      tindakan: { rujukan: "PA-2024-001", statusPendaftaran: "Under Review" },
    },
    {
      no: 2,
      rujukan: "PA-2024-002",
      nama: "Siti binti Mohamed",
      noKP: "850515087654",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Khairiyah",
      statusPendaftaran: "Under Review",
      sesiPerkhidmatan: "Sesi 2",
      statusLantikan: "Pending",
      tindakan: { rujukan: "PA-2024-002", statusPendaftaran: "Under Review" },
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
      institusiKariah: "Masjid Wilayah Persekutuan",
      statusPendaftaran: "Approved",
      sesiPerkhidmatan: "Sesi 1",
      statusLantikan: "Pending",
      tindakan: { rujukan: "PA-2024-001", statusPendaftaran: "Approved" },
    },
    {
      no: 2,
      rujukan: "PA-2024-002",
      nama: "Siti binti Mohamed",
      noKP: "850515087654",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Khairiyah",
      statusPendaftaran: "Approved",
      sesiPerkhidmatan: "Sesi 2",
      statusLantikan: "Pending",
      tindakan: { rujukan: "PA-2024-002", statusPendaftaran: "Approved" },
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
      institusiKariah: "Masjid Wilayah Persekutuan",
      statusPendaftaran: "Approved",
      sesiPerkhidmatan: "Sesi 1",
      statusLantikan: "Pending",
      tindakan: { rujukan: "PA-2024-001", statusPendaftaran: "Approved" },
    },
    {
      no: 2,
      rujukan: "PA-2024-002",
      nama: "Siti binti Mohamed",
      noKP: "850515087654",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Khairiyah",
      statusPendaftaran: "Approved",
      sesiPerkhidmatan: "Sesi 2",
      statusLantikan: "Pending",
      tindakan: { rujukan: "PA-2024-002", statusPendaftaran: "Approved" },
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
    result = result.filter((app) => app.institusiId === currentInstitutionId);
  }

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

  if (filters.value.sesiPerkhidmatan) {
    result = result.filter((app) => app.sesiPerkhidmatan === filters.value.sesiPerkhidmatan);
  }

  if (filters.value.statusLantikan) {
    result = result.filter((app) => app.statusLantikan === filters.value.statusLantikan);
  }

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
    result = result.filter((app) => app.institusiId === currentInstitutionId);
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

  // Apply session filter
  if (completedFilters.value.sesiPerkhidmatan) {
    result = result.filter((app) => app.sesiPerkhidmatan === completedFilters.value.sesiPerkhidmatan);
  }

  // Apply status filter
  if (completedFilters.value.statusLantikan) {
    result = result.filter((app) => app.statusLantikan === completedFilters.value.statusLantikan);
  }

  return result;
});

const totalCompletedApplications = computed(() => filteredCompletedApplications.value.length);

// Helper functions
const getStatusPendaftaranVariant = (status) => {
  const statusVariants = {
    Draft: "default",
    Submitted: "warning",
    "Under Review": "info",
    Approved: "success",
    Rejected: "danger",
  };
  return statusVariants[status] || "default";
};

const getStatusLantikanVariant = (status) => {
  const statusVariants = {
    Pending: "warning",
    Appointed: "info",
    Active: "success",
    Inactive: "secondary",
    Terminated: "danger",
  };
  return statusVariants[status] || "default";
};

const canEdit = (statusPendaftaran) => {
  return ["Draft", "Submitted"].includes(statusPendaftaran);
};

// Action handlers with RTMF screen references
// PA-PP-PD-01_02: Detail View - Maklumat Penolong Amil Terperinci
const handleView = (actionData) => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/detail/${actionData.rujukan}`);
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

// PA-PP-PD-04_02: Executive Detail - Paparan Terperinci Sokongan (Risk Analysis)
const handleRiskAnalysis = (actionData) => {
  navigateTo(`/BF-PA/PP/pra-daftar-v3/eksekutif/detail/${actionData.rujukan}`);
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

const handleRoleChange = (newRole) => {
  currentRole.value = newRole;
};
</script>

<style scoped>
/* Custom styles for RTMF compliance */
</style> 

<!-- 
  RTMF SCREEN: PA-PE-MP-01_01
  PURPOSE: Unified Dashboard - Pengurusan Elaun bagi Mesyuarat/Program
  DESCRIPTION: Dynamic dashboard with role-based content for Meeting/Program allowance management
  ROUTE: /BF-PA/PE/MP
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
          <div class="flex items-center">
            <Icon name="ic:outline-assignment" class="mr-2" />
            <h2 class="text-xl font-semibold">
              Senarai Elaun Penolong Amil (Eksekutif) - Mesyuarat/Program
            </h2>
          </div>
        </div>
      </template>

      <template #body>
          <!-- Smart Filter Section -->
          <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormKit
                v-model="filters.searchQuery"
                type="text"
                placeholder="Cari ID Aktiviti atau Nama Aktiviti..."
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-model="filters.status"
                type="select"
                :options="eksekutifStatusOptions"
                placeholder="Status"
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-model="filters.jenisAktiviti"
                type="select"
                :options="jenisAktivitiOptions"
                placeholder="Jenis Aktiviti"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
          </div>

          <!-- Tabbed Table Section -->
          <rs-tab>
            <rs-tab-item title="Menunggu Sokongan" icon="heroicons:clock">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-yellow-700 flex items-center">
                  <Icon name="heroicons:clock" class="mr-2" size="20" />
                  Senarai aktiviti yang memerlukan sokongan
                </h3>
                <rs-table
                  :data="filteredEksekutifActivities"
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
                  <template v-slot:status="{ text }">
                    <rs-badge :variant="getStatusVariant(text)">
                      {{ getStatusLabel(text) }}
                          </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-1">
                            <rs-button
                              variant="primary"
                              size="sm"
                        @click="handleView(text)"
                        title="Lihat Butiran"
                        class="!px-3 !py-1.5"
                            >
                        <Icon name="ic:outline-remove-red-eye" class="w-4 h-4 mr-1" />
                              Lihat Butiran
                            </rs-button>
                            <rs-button
                              variant="success"
                              size="sm"
                        @click="handleSupport(text)"
                        title="Sokong"
                        class="!px-3 !py-1.5"
                            >
                        <Icon name="ic:outline-check-circle" class="w-4 h-4 mr-1" />
                              Sokong
                            </rs-button>
                          </div>
                  </template>
                </rs-table>
                          </div>
            </rs-tab-item>

            <rs-tab-item title="Telah Diluluskan" icon="heroicons:check-circle">
              <div class="p-4">
              <h3 class="text-lg font-semibold mb-4 text-green-700 flex items-center">
                <Icon name="heroicons:check-circle" class="mr-2" size="20" />
                Senarai elaun yang telah diluluskan
              </h3>
                <rs-table
                  :data="eksekutifApprovedActivities"
                  :columns="eksekutifApprovedColumns"
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
                  <template v-slot:status="{ text }">
                    <rs-badge :variant="getStatusVariant(text)">
                      {{ getStatusLabel(text) }}
                          </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-1">
                          <rs-button
                            variant="primary"
                            size="sm"
                        @click="handleView(text)"
                        title="Lihat Butiran"
                        class="!px-3 !py-1.5"
                          >
                        <Icon name="ic:outline-remove-red-eye" class="w-4 h-4 mr-1" />
                            Lihat Butiran
                          </rs-button>
                          </div>
                  </template>
                </rs-table>
                </div>
            </rs-tab-item>

            <rs-tab-item title="Telah Ditolak" icon="heroicons:x-circle">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-red-700 flex items-center">
                  <Icon name="heroicons:x-circle" class="mr-2" size="20" />
                  Senarai elaun yang telah ditolak
                </h3>
                <rs-table
                  :data="eksekutifRejectedActivities"
                  :columns="eksekutifApprovedColumns"
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
                  <template v-slot:status="{ text }">
                    <rs-badge :variant="getStatusVariant(text)">
                      {{ getStatusLabel(text) }}
                          </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-1">
                          <rs-button
                            variant="primary"
                            size="sm"
                        @click="handleView(text)"
                        title="Lihat Butiran"
                        class="!px-3 !py-1.5"
                          >
                        <Icon name="ic:outline-remove-red-eye" class="w-4 h-4 mr-1" />
                            Lihat Butiran
                          </rs-button>
                          </div>
                  </template>
                </rs-table>
                </div>
            </rs-tab-item>
          </rs-tab>
        </template>
      </rs-card>

      <!-- Bulk Approval Button at Bottom -->
      <div v-if="selectedRows.length > 0" class="mt-4 flex justify-end">
        <rs-button
          variant="success"
          @click="handleBulkSupport"
          :disabled="processing"
        >
          <Icon name="material-symbols:approval" class="w-4 h-4 mr-1" />
          Sokong (Bulk) ({{ selectedRows.length }})
        </rs-button>
      </div>
    </div>

    <!-- Ketua Jabatan Content -->
    <div v-else-if="currentRole === 'ketua-jabatan'">
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <Icon name="ic:outline-admin-panel-settings" class="mr-2" />
              <h2 class="text-xl font-semibold">
                Senarai Elaun Penolong Amil (Ketua Jabatan) - Mesyuarat/Program
              </h2>
            </div>
          </div>
        </template>

        <template #body>
          <!-- Smart Filter Section -->
            <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormKit
                v-model="filters.searchQuery"
                  type="text"
                  placeholder="Cari ID Aktiviti atau Nama Aktiviti..."
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-model="filters.status"
                type="select"
                :options="ketuaJabatanStatusOptions"
                placeholder="Status"
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-model="filters.jenisAktiviti"
                type="select"
                :options="jenisAktivitiOptions"
                placeholder="Jenis Aktiviti"
                :classes="{
                  input: '!py-2',
                }"
                />
              </div>
            </div>

          <!-- Tabbed Table Section -->
          <rs-tab>
            <rs-tab-item title="Menunggu Kelulusan" icon="heroicons:clock">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-blue-700 flex items-center">
                  <Icon name="heroicons:clock" class="mr-2" size="20" />
                  Senarai aktiviti yang memerlukan kelulusan
                </h3>
                <rs-table
                  :data="filteredKetuaJabatanActivities"
                  :columns="ketuaJabatanColumns"
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
                  <template v-slot:status="{ text }">
                    <rs-badge :variant="getStatusVariant(text)">
                      {{ getStatusLabel(text) }}
                          </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-1">
                            <rs-button
                              variant="primary"
                              size="sm"
                        @click="handleView(text)"
                        title="Lihat Butiran"
                        class="!px-3 !py-1.5"
                            >
                        <Icon name="ic:outline-remove-red-eye" class="w-4 h-4 mr-1" />
                              Lihat Butiran
                            </rs-button>
                            <rs-button
                              variant="success"
                              size="sm"
                        @click="handleApprove(text)"
                        title="Lulus"
                        class="!px-3 !py-1.5"
                            >
                        <Icon name="ic:outline-check-circle" class="w-4 h-4 mr-1" />
                              Lulus
                            </rs-button>
                          </div>
                  </template>
                </rs-table>
                          </div>
            </rs-tab-item>

            <rs-tab-item title="Telah Diluluskan" icon="heroicons:check-circle">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-green-700 flex items-center">
                  <Icon name="heroicons:check-circle" class="mr-2" size="20" />
                  Senarai elaun yang telah diluluskan
                </h3>
                <rs-table
                  :data="ketuaJabatanApprovedActivities"
                  :columns="ketuaJabatanApprovedColumns"
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
                  <template v-slot:status="{ text }">
                    <rs-badge :variant="getStatusVariant(text)">
                      {{ getStatusLabel(text) }}
                        </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-1">
                        <rs-button
                          variant="primary"
                          size="sm"
                        @click="handleView(text)"
                        title="Lihat Butiran"
                        class="!px-3 !py-1.5"
                        >
                        <Icon name="ic:outline-remove-red-eye" class="w-4 h-4 mr-1" />
                            Lihat Butiran
                        </rs-button>
                          </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Telah Ditolak" icon="heroicons:x-circle">
              <div class="p-4">
              <h3 class="text-lg font-semibold mb-4 text-red-700 flex items-center">
                <Icon name="heroicons:x-circle" class="mr-2" size="20" />
                Senarai elaun yang telah ditolak
              </h3>
                <rs-table
                  :data="ketuaJabatanRejectedActivities"
                  :columns="ketuaJabatanApprovedColumns"
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
                  <template v-slot:status="{ text }">
                    <rs-badge :variant="getStatusVariant(text)">
                      {{ getStatusLabel(text) }}
                          </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-1">
                          <rs-button
                            variant="primary"
                            size="sm"
                        @click="handleView(text)"
                        title="Lihat Butiran"
                        class="!px-3 !py-1.5"
                          >
                        <Icon name="ic:outline-remove-red-eye" class="w-4 h-4 mr-1" />
                            Lihat Butiran
                          </rs-button>
                          </div>
                  </template>
                </rs-table>
                </div>
            </rs-tab-item>
          </rs-tab>
        </template>
      </rs-card>

      <!-- Bulk Approval Button at Bottom -->
      <div v-if="selectedRows.length > 0" class="mt-4 flex justify-end">
        <rs-button
          variant="success"
          @click="handleBulkApproval"
          :disabled="processing"
        >
          <Icon name="material-symbols:approval" class="w-4 h-4 mr-1" />
          Lulus (Bulk) ({{ selectedRows.length }})
        </rs-button>
      </div>
    </div>

    <!-- PT Dashboard Content -->
    <div v-if="currentRole === 'pt'">
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <Icon name="ic:outline-verified-user" class="mr-2" />
              <h2 class="text-xl font-semibold">
                Senarai Elaun Penolong Amil (PT) - Mesyuarat/Program
              </h2>
            </div>
          </div>
        </template>

        <template #body>
          <!-- Smart Filter Section -->
            <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormKit
                v-model="filters.searchQuery"
                  type="text"
                  placeholder="Cari ID Aktiviti atau Nama Aktiviti..."
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-model="filters.status"
                type="select"
                :options="ptStatusOptions"
                placeholder="Status"
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-model="filters.jenisAktiviti"
                type="select"
                :options="jenisAktivitiOptions"
                placeholder="Jenis Aktiviti"
                :classes="{
                  input: '!py-2',
                }"
                />
              </div>
            </div>

          <!-- Tabbed Table Section -->
          <rs-tab>
            <rs-tab-item title="Menunggu Semakan" icon="heroicons:clock">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-yellow-700 flex items-center">
                  <Icon name="heroicons:clock" class="mr-2" size="20" />
                  Senarai aktiviti yang memerlukan semakan
                </h3>
                <rs-table
                  :data="pendingPtActivities"
                  :columns="ptColumns"
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
                  <template v-slot:status="{ text }">
                    <rs-badge :variant="getStatusVariant(text)">
                      {{ getStatusLabel(text) }}
                          </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-1">
                            <rs-button
                              variant="primary"
                              size="sm"
                        @click="handleView(text)"
                        title="Lihat Butiran"
                        class="!px-3 !py-1.5"
                            >
                        <Icon name="ic:outline-remove-red-eye" class="w-4 h-4 mr-1" />
                              Lihat Butiran
                            </rs-button>
                            <rs-button
                              variant="warning"
                              size="sm"
                        @click="handleSemak(text)"
                        title="Semak"
                        class="!px-3 !py-1.5"
                            >
                        <Icon name="ic:outline-search" class="w-4 h-4 mr-1" />
                              Semak
                            </rs-button>
                          </div>
                  </template>
                </rs-table>
                          </div>
            </rs-tab-item>

            <rs-tab-item title="Telah Diluluskan" icon="heroicons:check-circle">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-green-700 flex items-center">
                  <Icon name="heroicons:check-circle" class="mr-2" size="20" />
                  Senarai elaun yang telah diluluskan
                </h3>
                <rs-table
                  :data="ptApprovedActivities"
                  :columns="ptApprovedColumns"
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
                  <template v-slot:status="{ text }">
                    <rs-badge :variant="getStatusVariant(text)">
                      {{ getStatusLabel(text) }}
                          </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-1">
                          <rs-button
                            variant="primary"
                            size="sm"
                        @click="handleView(text)"
                        title="Lihat Butiran"
                        class="!px-3 !py-1.5"
                          >
                        <Icon name="ic:outline-remove-red-eye" class="w-4 h-4 mr-1" />
                            Lihat Butiran
                          </rs-button>
                          </div>
                  </template>
                </rs-table>
                </div>
            </rs-tab-item>

            <rs-tab-item title="Telah Ditolak" icon="heroicons:x-circle">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-red-700 flex items-center">
                  <Icon name="heroicons:x-circle" class="mr-2" size="20" />
                  Senarai elaun yang telah ditolak
                </h3>
                <rs-table
                  :data="ptRejectedActivities"
                  :columns="ptApprovedColumns"
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
                  <template v-slot:status="{ text }">
                    <rs-badge :variant="getStatusVariant(text)">
                      {{ getStatusLabel(text) }}
                        </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-1">
                        <rs-button
                          variant="primary"
                          size="sm"
                        @click="handleView(text)"
                        title="Lihat Butiran"
                        class="!px-3 !py-1.5"
                        >
                        <Icon name="ic:outline-remove-red-eye" class="w-4 h-4 mr-1" />
                            Lihat Butiran
                        </rs-button>
                          </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>
          </rs-tab>
        </template>
      </rs-card>

      <!-- Bulk Semak Button at Bottom -->
      <div v-if="selectedRows.length > 0" class="mt-4 flex justify-end">
        <rs-button
          variant="warning"
          @click="handleBulkSemak"
          :disabled="processing"
        >
          <Icon name="material-symbols:search" class="w-4 h-4 mr-1" />
          Semak (Bulk) ({{ selectedRows.length }})
        </rs-button>
      </div>
    </div>

    <!-- Modals -->
    <!-- Support Confirmation Modal -->
    <rs-modal
      v-model="showSupportModal"
      title="Sahkan Sokongan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <Icon
            name="material-symbols:check-circle-outline"
            class="text-green-500 text-5xl mb-4"
          />
          <p class="text-lg mb-2">
            Adakah anda pasti untuk memberikan sokongan kepada aktiviti ini?
          </p>
          <p class="text-gray-600">
            Aktiviti ini akan dihantar kepada Ketua Jabatan untuk kelulusan seterusnya.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center space-x-4">
          <rs-button
            variant="primary-outline"
            @click="showSupportModal = false"
          >
            Batal
          </rs-button>
          <rs-button variant="success" @click="confirmSupport">
            Ya, Sokong
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Reject Confirmation Modal -->
    <rs-modal
      v-model="showRejectModal"
      title="Sahkan Penolakan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <Icon
            name="material-symbols:cancel-outline"
            class="text-red-500 text-5xl mb-4"
          />
          <p class="text-lg mb-2">
            Adakah anda pasti untuk menolak aktiviti ini?
          </p>
          <p class="text-gray-600">
            Aktiviti ini akan dikembalikan kepada pemohon untuk pembetulan.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center space-x-4">
          <rs-button
            variant="primary-outline"
            @click="showRejectModal = false"
          >
            Batal
          </rs-button>
          <rs-button variant="danger" @click="confirmReject">
            Ya, Tolak
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Approve Confirmation Modal -->
    <rs-modal
      v-model="showApproveModal"
      title="Sahkan Kelulusan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <Icon
            name="material-symbols:check-circle-outline"
            class="text-green-500 text-5xl mb-4"
          />
          <p class="text-lg mb-2">
            Adakah anda pasti untuk meluluskan aktiviti ini?
          </p>
          <p class="text-gray-600">
            Aktiviti ini akan diluluskan dan Payment Advice akan dijana secara automatik.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center space-x-4">
          <rs-button
            variant="primary-outline"
            @click="showApproveModal = false"
          >
            Batal
          </rs-button>
          <rs-button variant="success" @click="confirmApprove">
            Ya, Lulus
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';

definePageMeta({
  title: "Pengurusan Elaun bagi Mesyuarat/Program",
  description: "Senarai aktiviti mesyuarat dan program untuk pengurusan elaun",
});

const toast = useToast();

const breadcrumb = ref([
  {
    name: "Pengurusan Elaun",
    type: "link",
    path: "/BF-PA/PE/MP",
  },
  {
    name: "Mesyuarat/Program",
    type: "current",
    path: "/BF-PA/PE/MP",
  },
]);

// Role Management
const currentRole = ref('pt');
const showRoleInfo = ref(false);

const roleOptions = [
  { label: 'PT', value: 'pt' },
  { label: 'Eksekutif', value: 'eksekutif' },
  { label: 'Ketua Jabatan', value: 'ketua-jabatan' },
];

const getRoleVariant = (role) => {
  const variants = {
    'pt': 'default',
    'eksekutif': 'warning',
    'ketua-jabatan': 'primary',
  };
  return variants[role] || 'default';
};

const getRoleLabel = (role) => {
  const labels = {
    'pt': 'PT',
    'eksekutif': 'Eksekutif',
    'ketua-jabatan': 'Ketua Jabatan',
  };
  return labels[role] || 'Unknown';
};

const getRoleDescription = (role) => {
  const descriptions = {
    'pt': 'Menyemak dan memilih aktiviti untuk pembayaran elaun',
    'eksekutif': 'Menyokong aktiviti elaun untuk kelulusan seterusnya',
    'ketua-jabatan': 'Meluluskan aktiviti elaun dan menjana Payment Advice',
  };
  return descriptions[role] || '';
};

const getRoleCapabilities = (role) => {
  const capabilities = {
    'pt': ['Lihat Semua Aktiviti', 'Semak Aktiviti', 'Pilih Aktiviti', 'Bulk Semak'],
    'eksekutif': ['Lihat Aktiviti', 'Sokong Aktiviti', 'Tolak Aktiviti', 'Bulk Support'],
    'ketua-jabatan': ['Lihat Aktiviti', 'Lulus Aktiviti', 'Tolak Aktiviti', 'Bulk Approval', 'Jana Payment Advice'],
  };
  return capabilities[role] || [];
};

const handleRoleChange = () => {
  // Reset filters when role changes
  filters.value.searchQuery = '';
  filters.value.status = '';
  filters.value.jenisAktiviti = '';
  selectedRows.value = [];
};

const toggleRoleInfo = () => {
  showRoleInfo.value = !showRoleInfo.value;
};

// Mock data for activities
const activities = ref([
  // PT specific activities - Belum Disemak
  {
    id: 'MP2024-001',
    name: 'Program Khidmat Masyarakat',
    date: '15/04/2024',
    location: 'Dewan Serbaguna Masjid Kg Delek',
    type: 'Program',
    status: 'Belum Disemak',
    allowanceRate: '50.00',
    jumlahElaun: '250.00'
  },
  {
    id: 'MP2024-002',
    name: 'Mesyuarat Perancangan Bulanan',
    date: '18/04/2024',
    location: 'Dewan Mesyuarat Eksekutif',
    type: 'Mesyuarat',
    status: 'Belum Disemak',
    allowanceRate: '40.00',
    jumlahElaun: '120.00'
  },
  {
    id: 'MP2024-003',
    name: 'Latihan Pengurusan Zakat',
    date: '20/04/2024',
    location: 'Dewan Latihan LZS',
    type: 'Latihan',
    status: 'Belum Disemak',
    allowanceRate: '60.00',
    jumlahElaun: '180.00'
  },
  // Activities awaiting Eksekutif support
  {
    id: 'MP2024-004',
    name: 'Mesyuarat Eksekutif Bulanan',
    date: '15/03/2024',
    location: 'Dewan Mesyuarat Eksekutif',
    type: 'Mesyuarat',
    status: 'Menunggu Sokongan Eksekutif',
    allowanceRate: '50.00',
    jumlahElaun: '200.00'
  },
  {
    id: 'MP2024-005',
    name: 'Latihan Pengurusan Zakat dan Fitrah',
    date: '20/03/2024',
    location: 'Dewan Latihan LZS, Kompleks Zakat Selangor',
    type: 'Latihan',
    status: 'Menunggu Sokongan Eksekutif',
    allowanceRate: '50.00',
    jumlahElaun: '200.00'
  },
  {
    id: 'MP2024-006',
    name: 'Latihan Sistem e-Zakat',
    date: '02/04/2024',
    location: 'Bilik Latihan IT, Pejabat Zakat Petaling Jaya',
    type: 'Latihan',
    status: 'Menunggu Sokongan Eksekutif',
    allowanceRate: '60.00',
    jumlahElaun: '120.00'
  },
  // Activities awaiting Ketua Jabatan approval
  {
    id: 'MP2024-007',
    name: 'Program Khidmat Masyarakat',
    date: '20/03/2024',
    location: 'Masjid Al-Hidayah',
    type: 'Program',
    status: 'Menunggu Kelulusan Ketua Jabatan',
    allowanceRate: '100.00',
    jumlahElaun: '300.00'
  },
  {
    id: 'MP2024-008',
    name: 'Latihan Pengurusan Aduan',
    date: '12/04/2024',
    location: 'Bilik Latihan, Pejabat Zakat Gombak',
    type: 'Latihan',
    status: 'Menunggu Kelulusan Ketua Jabatan',
    allowanceRate: '55.00',
    jumlahElaun: '110.00'
  },
  // Approved activities (for all roles to see)
  {
    id: 'MP2024-009',
    name: 'Latihan Pengurusan Zakat',
    date: '25/03/2024',
    location: 'Dewan Latihan',
    type: 'Latihan',
    status: 'Diluluskan',
    allowanceRate: '100.00',
    jumlahElaun: '400.00'
  },
  {
    id: 'MP2024-010',
    name: 'Mesyuarat Koordinasi',
    date: '30/03/2024',
    location: 'Pejabat Zakat',
    type: 'Mesyuarat',
    status: 'Diluluskan',
    allowanceRate: '50.00',
    jumlahElaun: '150.00'
  },
  {
    id: 'MP2024-013',
    name: 'Program Kesedaran Zakat',
    date: '28/03/2024',
    location: 'Masjid Al-Amin',
    type: 'Program',
    status: 'Diluluskan',
    allowanceRate: '75.00',
    jumlahElaun: '225.00'
  },
  {
    id: 'MP2024-014',
    name: 'Latihan Pengurusan Aduan',
    date: '22/03/2024',
    location: 'Bilik Latihan, Pejabat Zakat Shah Alam',
    type: 'Latihan',
    status: 'Diluluskan',
    allowanceRate: '65.00',
    jumlahElaun: '195.00'
  },
  {
    id: 'MP2024-015',
    name: 'Mesyuarat Perancangan Strategik',
    date: '18/03/2024',
    location: 'Dewan Mesyuarat Eksekutif',
    type: 'Mesyuarat',
    status: 'Diluluskan',
    allowanceRate: '45.00',
    jumlahElaun: '135.00'
  },
  // Rejected activities (for all roles to see)
  {
    id: 'MP2024-011',
    name: 'Program Latihan Amil',
    date: '10/04/2024',
    location: 'Dewan Serbaguna',
    type: 'Program',
    status: 'Ditolak',
    allowanceRate: '75.00',
    jumlahElaun: '225.00'
  },
  {
    id: 'MP2024-012',
    name: 'Mesyuarat Perancangan Q2',
    date: '05/04/2024',
    location: 'Bilik Mesyuarat',
    type: 'Mesyuarat',
    status: 'Ditolak',
    allowanceRate: '45.00',
    jumlahElaun: '135.00'
  },
  {
    id: 'MP2024-016',
    name: 'Latihan Pengurusan Kewangan',
    date: '08/04/2024',
    location: 'Bilik Latihan, Pejabat Zakat Klang',
    type: 'Latihan',
    status: 'Ditolak',
    allowanceRate: '80.00',
    jumlahElaun: '240.00'
  },
  {
    id: 'MP2024-017',
    name: 'Program Khidmat Masyarakat',
    date: '12/04/2024',
    location: 'Masjid Al-Ikhlas',
    type: 'Program',
    status: 'Ditolak',
    allowanceRate: '90.00',
    jumlahElaun: '270.00'
  },
  {
    id: 'MP2024-018',
    name: 'Mesyuarat Koordinasi Wilayah',
    date: '15/04/2024',
    location: 'Dewan Mesyuarat Wilayah',
    type: 'Mesyuarat',
    status: 'Ditolak',
    allowanceRate: '55.00',
    jumlahElaun: '165.00'
  }
]);

// Status options for different roles
const statusOptions = [
  { label: 'Semua', value: '' },
  { label: 'Diluluskan', value: 'Diluluskan' },
  { label: 'Ditolak', value: 'Ditolak' },
];

const eksekutifStatusOptions = [
  { label: 'Semua', value: '' },
  { label: 'Menunggu Sokongan Eksekutif', value: 'Menunggu Sokongan Eksekutif' },
];

const ptStatusOptions = [
  { label: 'Semua', value: '' },
  { label: 'Belum Disemak', value: 'Belum Disemak' },
  { label: 'Diluluskan', value: 'Diluluskan' },
  { label: 'Ditolak', value: 'Ditolak' },
];

const ketuaJabatanStatusOptions = [
  { label: 'Semua', value: '' },
  { label: 'Menunggu Kelulusan Ketua Jabatan', value: 'Menunggu Kelulusan Ketua Jabatan' },
];

// Jenis Aktiviti options
const jenisAktivitiOptions = [
  { label: 'Semua', value: '' },
  { label: 'Mesyuarat', value: 'Mesyuarat' },
  { label: 'Program', value: 'Program' },
  { label: 'Latihan', value: 'Latihan' },
];

// Search and filter state
const selectedRows = ref([]);
const processing = ref(false);
const showSupportModal = ref(false);
const showRejectModal = ref(false);
const showApproveModal = ref(false);
const selectedActivity = ref(null);

// Computed filtered activities based on role
const filteredActivities = computed(() => {
  return activities.value.filter(activity => {
    const matchesSearch = !searchQuery.value || 
      activity.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      activity.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = !selectedStatus.value || activity.status === selectedStatus.value;
    const matchesJenis = !selectedJenisAktiviti.value || activity.type === selectedJenisAktiviti.value;
    return matchesSearch && matchesStatus && matchesJenis;
  });
});

// Handler functions for table actions
const handleView = (activityId) => {
  navigateTo(`/BF-PA/PE/MP/${activityId}`);
};

const handleSupport = (activityId) => {
  // Update activity status to supported
  const activity = activities.value.find(a => a.id === activityId);
  if (activity) {
    activity.status = 'Menunggu Kelulusan Ketua Jabatan';
    toast.success('Aktiviti berjaya disokong');
  }
};

const handleApprove = (activityId) => {
  // Update activity status to approved
  const activity = activities.value.find(a => a.id === activityId);
  if (activity) {
    activity.status = 'Diluluskan';
    toast.success('Aktiviti berjaya diluluskan');
  }
};

const handleReject = (activityId) => {
  // Update activity status to rejected
  const activity = activities.value.find(a => a.id === activityId);
  if (activity) {
    activity.status = 'Ditolak';
    toast.success('Aktiviti telah ditolak');
  }
};

const handleSemak = (activityId) => {
  // Navigate to activity review page for PT role
  navigateTo(`/BF-PA/PE/MP/01?id=${activityId}`);
};

// Update computed properties to work with rs-table
const filteredEksekutifActivities = computed(() => {
  return activities.value.filter(activity => {
    const matchesSearch = !filters.value.searchQuery || 
      activity.id.toLowerCase().includes(filters.value.searchQuery.toLowerCase()) ||
      activity.name.toLowerCase().includes(filters.value.searchQuery.toLowerCase());
    const matchesStatus = !filters.value.status || activity.status === filters.value.status;
    const matchesJenis = !filters.value.jenisAktiviti || activity.type === filters.value.jenisAktiviti;
    const isEksekutifActivity = activity.status === 'Menunggu Sokongan Eksekutif';
    return matchesSearch && matchesStatus && matchesJenis && isEksekutifActivity;
  }).map(activity => ({
    ...activity,
    tindakan: activity.id // Pass activity ID for action buttons
  }));
});

const eksekutifApprovedActivities = computed(() => {
  return activities.value.filter(activity => {
    const matchesSearch = !filters.value.searchQuery || 
      activity.id.toLowerCase().includes(filters.value.searchQuery.toLowerCase()) ||
      activity.name.toLowerCase().includes(filters.value.searchQuery.toLowerCase());
    const matchesStatus = !filters.value.status || activity.status === filters.value.status;
    const matchesJenis = !filters.value.jenisAktiviti || activity.type === filters.value.jenisAktiviti;
    return matchesSearch && matchesStatus && matchesJenis && activity.status === 'Diluluskan';
  }).map(activity => ({
    ...activity,
    tindakan: activity.id
  }));
});

const eksekutifRejectedActivities = computed(() => {
  return activities.value.filter(activity => {
    const matchesSearch = !filters.value.searchQuery || 
      activity.id.toLowerCase().includes(filters.value.searchQuery.toLowerCase()) ||
      activity.name.toLowerCase().includes(filters.value.searchQuery.toLowerCase());
    const matchesStatus = !filters.value.status || activity.status === filters.value.status;
    const matchesJenis = !filters.value.jenisAktiviti || activity.type === filters.value.jenisAktiviti;
    return matchesSearch && matchesStatus && matchesJenis && activity.status === 'Ditolak';
  }).map(activity => ({
    ...activity,
    tindakan: activity.id
  }));
});

// Computed properties for separated tables
const approvedActivities = computed(() => {
  return filteredActivities.value.filter(activity => activity.status === 'Diluluskan');
});

const rejectedActivities = computed(() => {
  return filteredActivities.value.filter(activity => activity.status === 'Ditolak');
});

// Ketua Jabatan specific computed properties
const filteredKetuaJabatanActivities = computed(() => {
  return activities.value.filter(activity => {
    const matchesSearch = !filters.value.searchQuery || 
      activity.id.toLowerCase().includes(filters.value.searchQuery.toLowerCase()) ||
      activity.name.toLowerCase().includes(filters.value.searchQuery.toLowerCase());
    const matchesStatus = !filters.value.status || activity.status === filters.value.status;
    const matchesJenis = !filters.value.jenisAktiviti || activity.type === filters.value.jenisAktiviti;
    const isKetuaJabatanActivity = activity.status === 'Menunggu Kelulusan Ketua Jabatan';
    return matchesSearch && matchesStatus && matchesJenis && isKetuaJabatanActivity;
  }).map(activity => ({
    ...activity,
    tindakan: activity.id
  }));
});

const ketuaJabatanApprovedActivities = computed(() => {
  return activities.value.filter(activity => {
    const matchesSearch = !filters.value.searchQuery || 
      activity.id.toLowerCase().includes(filters.value.searchQuery.toLowerCase()) ||
      activity.name.toLowerCase().includes(filters.value.searchQuery.toLowerCase());
    const matchesStatus = !filters.value.status || activity.status === filters.value.status;
    const matchesJenis = !filters.value.jenisAktiviti || activity.type === filters.value.jenisAktiviti;
    return matchesSearch && matchesStatus && matchesJenis && activity.status === 'Diluluskan';
  }).map(activity => ({
    ...activity,
    tindakan: activity.id
  }));
});

const ketuaJabatanRejectedActivities = computed(() => {
  return activities.value.filter(activity => {
    const matchesSearch = !filters.value.searchQuery || 
      activity.id.toLowerCase().includes(filters.value.searchQuery.toLowerCase()) ||
      activity.name.toLowerCase().includes(filters.value.searchQuery.toLowerCase());
    const matchesStatus = !filters.value.status || activity.status === filters.value.status;
    const matchesJenis = !filters.value.jenisAktiviti || activity.type === filters.value.jenisAktiviti;
    return matchesSearch && matchesStatus && matchesJenis && activity.status === 'Ditolak';
  }).map(activity => ({
    ...activity,
    tindakan: activity.id
  }));
});

// PT specific computed properties
const filteredPtActivities = computed(() => {
  return activities.value.filter(activity => {
    const matchesSearch = !filters.value.searchQuery || 
      activity.id.toLowerCase().includes(filters.value.searchQuery.toLowerCase()) ||
      activity.name.toLowerCase().includes(filters.value.searchQuery.toLowerCase());
    const matchesStatus = !filters.value.status || activity.status === filters.value.status;
    const matchesJenis = !filters.value.jenisAktiviti || activity.type === filters.value.jenisAktiviti;
    // PT can only see activities that need their review or final results
    const isPtActivity = ['Belum Disemak', 'Diluluskan', 'Ditolak'].includes(activity.status);
    return matchesSearch && matchesStatus && matchesJenis && isPtActivity;
  }).map(activity => ({
    ...activity,
    tindakan: activity.id
  }));
});

const pendingPtActivities = computed(() => {
  return filteredPtActivities.value.filter(activity => 
    activity.status === 'Belum Disemak'
  ).map(activity => ({
    ...activity,
    tindakan: activity.id
  }));
});

const ptApprovedActivities = computed(() => {
  return filteredPtActivities.value.filter(activity => activity.status === 'Diluluskan')
    .map(activity => ({
      ...activity,
      tindakan: activity.id
    }));
});

const ptRejectedActivities = computed(() => {
  return filteredPtActivities.value.filter(activity => activity.status === 'Ditolak')
    .map(activity => ({
      ...activity,
      tindakan: activity.id
    }));
});

// Computed properties for bulk selection
const isAllSelected = computed(() => {
  if (currentRole.value === 'pt') {
    return pendingPtActivities.value.length > 0 && selectedRows.value.length === pendingPtActivities.value.length;
  } else if (currentRole.value === 'eksekutif') {
    return filteredEksekutifActivities.value.length > 0 && selectedRows.value.length === filteredEksekutifActivities.value.length;
  } else if (currentRole.value === 'ketua-jabatan') {
    return filteredKetuaJabatanActivities.value.length > 0 && selectedRows.value.length === filteredKetuaJabatanActivities.value.length;
  }
  return false;
});

// Helper functions
const getStatusColor = (status) => {
  switch (status) {
    case 'Belum Disemak':
      return 'bg-gray-100 text-gray-800'
    case 'Menunggu Sokongan Eksekutif':
      return 'bg-yellow-100 text-yellow-800'
    case 'Menunggu Kelulusan Ketua Jabatan':
      return 'bg-blue-100 text-blue-800'
    case 'Diluluskan':
      return 'bg-green-100 text-green-800'
    case 'Ditolak':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'Menunggu Sokongan Eksekutif':
      return 'Menunggu Sokongan Eksekutif'
    case 'Menunggu Kelulusan Ketua Jabatan':
      return 'Menunggu Kelulusan Ketua Jabatan'
    case 'Diluluskan':
      return 'Diluluskan'
    case 'Ditolak':
      return 'Ditolak'
    default:
      return status
  }
}

const getStatusVariant = (status) => {
  switch (status) {
    case 'Menunggu Sokongan Eksekutif':
      return 'warning'
    case 'Menunggu Kelulusan Ketua Jabatan':
      return 'info'
    case 'Diluluskan':
      return 'success'
    case 'Ditolak':
      return 'danger'
    default:
      return 'default'
  }
}

const getActionRoute = (status, activityId) => {
  switch (status) {
    case 'Menunggu Sokongan Eksekutif':
      return '/BF-PA/PE/MP/03'
    case 'Menunggu Kelulusan Ketua Jabatan':
      return '/BF-PA/PE/MP/04'
    case 'Diluluskan':
      return `/BF-PA/PE/MP/view-lulus`
    case 'Ditolak':
      return `/BF-PA/PE/MP/07`
    default:
      return '#'
  }
}

const getActionButtonText = (status) => {
  switch (status) {
    case 'Menunggu Sokongan Eksekutif':
    case 'Menunggu Kelulusan Ketua Jabatan':
      return 'Semak'
    case 'Diluluskan':
      return 'Lihat'
    case 'Ditolak':
      return 'Semak Semula'
    default:
      return 'Lihat'
  }
}

// Event handlers
const onCheckboxChange = (event, activity) => {
  if (event.target.checked) {
    selectedRows.value.push(activity.id);
  } else {
    selectedRows.value = selectedRows.value.filter(id => id !== activity.id);
  }
};

const toggleSelectAll = (event) => {
  if (event.target.checked) {
    if (currentRole.value === 'pt') {
      selectedRows.value = pendingPtActivities.value.map(activity => activity.id);
    } else if (currentRole.value === 'eksekutif') {
      selectedRows.value = filteredEksekutifActivities.value.map(activity => activity.id);
    } else if (currentRole.value === 'ketua-jabatan') {
      selectedRows.value = filteredKetuaJabatanActivities.value.map(activity => activity.id);
    }
  } else {
    selectedRows.value = [];
  }
};

// Bulk action handlers
const handleBulkSemak = async () => {
  if (selectedRows.value.length === 0) {
    toast.warning('Sila pilih aktiviti untuk disemak');
    return;
  }

  processing.value = true;
  
  try {
    // Navigate to activity selection for PT role
    navigateTo('/BF-PA/PE/MP/01');
  } catch (error) {
    toast.error('Ralat semasa memproses aktiviti');
    console.error('Error in bulk semak:', error);
  } finally {
    processing.value = false;
  }
};

const handleBulkSupport = async () => {
  if (selectedRows.value.length === 0) {
    toast.warning('Sila pilih aktiviti untuk disokong');
    return;
  }

  processing.value = true;
  
  try {
    // Update status for selected activities
    for (const activityId of selectedRows.value) {
      const activity = activities.value.find(a => a.id === activityId);
      if (activity) {
        activity.status = 'Menunggu Kelulusan Ketua Jabatan';
      }
    }
    
    toast.success(`${selectedRows.value.length} aktiviti berjaya disokong dan dihantar kepada Ketua Jabatan`);
    selectedRows.value = [];
  } catch (error) {
    toast.error('Ralat semasa menyokong aktiviti');
    console.error('Error in bulk support:', error);
  } finally {
    processing.value = false;
  }
};

const handleBulkApproval = async () => {
  if (selectedRows.value.length === 0) {
    toast.warning('Sila pilih aktiviti untuk diluluskan');
    return;
  }

  processing.value = true;
  
  try {
    // Update status for selected activities
    for (const activityId of selectedRows.value) {
      const activity = activities.value.find(a => a.id === activityId);
      if (activity) {
        activity.status = 'Lulus';
      }
    }
    
    toast.success(`${selectedRows.value.length} aktiviti berjaya diluluskan`);
    selectedRows.value = [];
  } catch (error) {
    toast.error('Ralat semasa meluluskan aktiviti');
    console.error('Error in bulk approval:', error);
  } finally {
    processing.value = false;
  }
};

// Individual action handlers
const openSupportModal = (activityId) => {
  selectedActivity.value = activityId;
  showSupportModal.value = true;
};

const openRejectModal = (activityId) => {
  selectedActivity.value = activityId;
  showRejectModal.value = true;
};

const openApproveModal = (activityId) => {
  selectedActivity.value = activityId;
  showApproveModal.value = true;
};

const confirmSupport = async () => {
  try {
    const activity = activities.value.find(a => a.id === selectedActivity.value);
    if (activity) {
      activity.status = 'Menunggu Kelulusan Ketua Jabatan';
    }
    showSupportModal.value = false;
    selectedActivity.value = null;
    toast.success('Aktiviti berjaya disokong dan dihantar kepada Ketua Jabatan');
  } catch (error) {
    toast.error('Ralat semasa menyokong aktiviti');
    console.error('Error supporting activity:', error);
  }
};

const confirmReject = async () => {
  try {
    const activity = activities.value.find(a => a.id === selectedActivity.value);
    if (activity) {
      activity.status = 'Ditolak';
    }
    showRejectModal.value = false;
    selectedActivity.value = null;
    toast.success('Aktiviti telah ditolak dan dikembalikan kepada pemohon');
  } catch (error) {
    toast.error('Ralat semasa menolak aktiviti');
    console.error('Error rejecting activity:', error);
  }
};

const confirmApprove = async () => {
  try {
    const activity = activities.value.find(a => a.id === selectedActivity.value);
    if (activity) {
      activity.status = 'Lulus';
    }
    showApproveModal.value = false;
    selectedActivity.value = null;
    toast.success('Aktiviti berjaya diluluskan dan Payment Advice akan dijana');
  } catch (error) {
    toast.error('Ralat semasa meluluskan aktiviti');
    console.error('Error approving activity:', error);
  }
};

// Table column definitions
const eksekutifColumns = [
  {
    key: "id",
    label: "ID Aktiviti",
    sortable: true,
  },
  {
    key: "name",
    label: "Nama Aktiviti",
    sortable: true,
  },
  {
    key: "date",
    label: "Tarikh",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
    width: "200px",
  },
];

const eksekutifApprovedColumns = [
  {
    key: "id",
    label: "ID Aktiviti",
    sortable: true,
  },
  {
    key: "name",
    label: "Nama Aktiviti",
    sortable: true,
  },
  {
    key: "date",
    label: "Tarikh",
    sortable: true,
  },
  {
    key: "status",
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

const ketuaJabatanColumns = [
  {
    key: "id",
    label: "ID Aktiviti",
    sortable: true,
  },
  {
    key: "name",
    label: "Nama Aktiviti",
    sortable: true,
  },
  {
    key: "date",
    label: "Tarikh",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
    width: "200px",
  },
];

const ketuaJabatanApprovedColumns = [
  {
    key: "id",
    label: "ID Aktiviti",
    sortable: true,
  },
  {
    key: "name",
    label: "Nama Aktiviti",
    sortable: true,
  },
  {
    key: "date",
    label: "Tarikh",
    sortable: true,
  },
  {
    key: "status",
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

const ptColumns = [
  {
    key: "id",
    label: "ID Aktiviti",
    sortable: true,
  },
  {
    key: "name",
    label: "Nama Aktiviti",
    sortable: true,
  },
  {
    key: "date",
    label: "Tarikh",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
    width: "200px",
  },
];

const ptApprovedColumns = [
  {
    key: "id",
    label: "ID Aktiviti",
    sortable: true,
  },
  {
    key: "name",
    label: "Nama Aktiviti",
    sortable: true,
  },
  {
    key: "date",
    label: "Tarikh",
    sortable: true,
  },
  {
    key: "status",
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

// Filters state
const filters = ref({
  searchQuery: "",
  status: "",
  jenisAktiviti: "",
});

const pageSize = ref(10);
</script>

<style scoped>
/* Add any additional styles here */
</style>
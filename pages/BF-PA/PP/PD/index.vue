<!-- 
  RTMF SCREEN: PA-PP-PD-01_01
  PURPOSE: Main Dashboard - Senarai Permohonan Penolong Amil
  DESCRIPTION: Dynamic dashboard with role-based content for Penolong Amil applications
  ROUTE: /BF-PA/PP/PD
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Page-specific Role Switcher -->
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

    <!-- Dynamic Content Based on Role -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold">
              Senarai Permohonan Penolong Amil
            </h2>
          </div>
          <!-- PA-PP-PD-01_03: Registration Form - Borang Pendaftaran Calon Penolong Amil -->
          <rs-button
            v-if="currentRole !== 'eksekutif' && currentRole !== 'eksekutif-pengurusan-risiko' && currentRole !== 'pt'"
            variant="primary"
            @click="navigateTo('/BF-PA/PP/PD/daftar-baharu')"
          >
            <Icon name="ic:baseline-add-circle" class="mr-2" />
            Tambah Baru
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Smart Filter Section -->
        <div class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              v-model="filters.searchQuery"
              type="text"
              placeholder="Cari nombor rujukan, nama calon..."
              :classes="{
                input: '!py-2',
              }"
            />
            <rs-button
              variant="primary"
              @click="handleSearch"
              class="!py-2 !px-4"
            >
              <Icon name="ic:baseline-search" class="w-4 h-4 mr-2" />
              Cari
            </rs-button>
          </div>
        </div>

        <!-- Tabbed Table Section -->
        <!-- PIC (formerly PYB) Role Tabs -->
        <div v-if="currentRole === 'pyb'">
          <rs-tab v-model="activeTab" class="mt-4">
            <rs-tab-item title="Draf">
              <div class="pt-2">
                <rs-table
                  :key="`table-${tableKey}-draft`"
                  :data="getTableDataByStatus(['Draf', 'Draft'])"
                  :columns="eksekutifColumnsWithoutStatusLantikan"
                  :pageSize="10"
                  :show-search="false"
                  :show-filter="false"
                  :options="{
                    variant: 'default',
                    hover: true,
                    striped: true,
                  }"
                  :options-advanced="{
                    sortable: true,
                    filterable: false,
                  }"
                  advanced
                >
                <template v-slot:select="{ row }">
  <input 
    type="checkbox" 
    v-model="selectedRows" 
    :value="row.rujukan" 
  />
</template>

                  <template v-slot:statusPendaftaran="{ text }">
                    <rs-badge :variant="getStatusPendaftaranVariant(text)">
                      {{ text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-3">
                      <button
                        @click="handleView(text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                      <button
                        @click="handleEdit(text)"
                        title="Kemaskini"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:outline-edit" class="w-5 h-5 text-secondary" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Sedang Proses">
              <div class="pt-2">
                <rs-table
                  :key="`table-${tableKey}-process`"
                  :data="getTableDataByStatus(['Dihantar', 'Belum Disaring', 'Menunggu Semakan', 'Menunggu Sokongan', 'Menunggu Pengesahan', 'Menunggu Kelulusan'])"
                  :columns="eksekutifColumnsWithoutStatusLantikan"
                  :pageSize="10"
                  :show-search="false"
                  :show-filter="false"
                  :options="{
                    variant: 'default',
                    hover: true,
                    striped: true,
                  }"
                  :options-advanced="{
                    sortable: true,
                    filterable: false,
                  }"
                  advanced
                >
                  <template v-slot:statusPendaftaran="{ text }">
                    <rs-badge :variant="getStatusPendaftaranVariant(text)">
                      {{ text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-3">
                      <button
                        @click="handleView(text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                      <button
                        @click="handleViewProcessTrace(text)"
                        title="Jejak Proses"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-timeline" class="w-5 h-5 text-info" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Lulus">
              <div class="pt-2">
                <rs-table
                  :key="`table-${tableKey}-approved`"
                  :data="getTableDataByStatus(['Diluluskan', 'Approved'])"
                  :columns="eksekutifColumnsWithoutStatusLantikan"
                  :pageSize="10"
                  :show-search="false"
                  :show-filter="false"
                  :options="{
                    variant: 'default',
                    hover: true,
                    striped: true,
                  }"
                  :options-advanced="{
                    sortable: true,
                    filterable: false,
                  }"
                  advanced
                >
                  <template v-slot:statusPendaftaran="{ text }">
                    <rs-badge :variant="getStatusPendaftaranVariant(text)">
                      {{ text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-3">
                      <button
                        @click="handleView(text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                      <button
                        @click="handleViewProcessTrace(text)"
                        title="Jejak Proses"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-timeline" class="w-5 h-5 text-info" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Ditolak">
              <div class="pt-2">
                <rs-table
                  :key="`table-${tableKey}-rejected`"
                  :data="getTableDataByStatus(['Ditolak', 'Rejected'])"
                  :columns="eksekutifColumnsWithoutStatusLantikan"
                  :pageSize="10"
                  :show-search="false"
                  :show-filter="false"
                  :options="{
                    variant: 'default',
                    hover: true,
                    striped: true,
                  }"
                  :options-advanced="{
                    sortable: true,
                    filterable: false,
                  }"
                  advanced
                >
                  <template v-slot:statusPendaftaran="{ text }">
                    <rs-badge :variant="getStatusPendaftaranVariant(text)">
                      {{ text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-3">
                      <button
                        @click="handleView(text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                      <button
                        @click="handleViewProcessTrace(text)"
                        title="Jejak Proses"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-timeline" class="w-5 h-5 text-info" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>
          </rs-tab>
        </div>

        <!-- Eksekutif Pengurusan Risiko Tabs -->
        <div v-if="currentRole === 'eksekutif-pengurusan-risiko'">
          <rs-tab v-model="activeTab" class="mt-4">
            <rs-tab-item title="Menunggu Saringan">
              <div class="pt-2">
                <!-- Bulk Operations Buttons - Right Aligned -->
                <div class="flex justify-end mb-4">
                  <div v-if="hasPendingScreening" class="flex space-x-3">
                    <rs-button
                      variant="warning"
                      @click="openBulkScreeningModal"
                      class="flex items-center"
                    >
                      Saring Bulk
                    </rs-button>
                  </div>
                </div>
                
                
                <!-- Simple table for screening -->
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rujukan</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pengenalan</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jawatan</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institusi</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="item in getTableDataByStatus(['Belum Disaring'])" :key="item.rujukan" class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {{ item.rujukan }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ item.nama }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ item.noKP }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ item.kategoriPenolongAmil }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ item.jawatan }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ item.institusiKariah }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <rs-badge :variant="getStatusPendaftaranVariant(item.statusPendaftaran)">
                            {{ item.statusPendaftaran }}
                          </rs-badge>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex justify-center items-center gap-3">
                      <button
                              @click="handleView(item.tindakan)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                      <button
                              @click="handleRiskAnalysis(item.tindakan)"
                        title="Saringan"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="iconamoon:arrow-right-2" class="w-5 h-5 text-info" />
                      </button>
                    </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Telah Disaring">
              <div class="pt-2">
                <!-- Export Button for Screened Applications -->
                <div class="flex justify-end mb-4">
                  <div v-if="getTableDataByStatus(['Telah Disaring']).length > 0" class="flex space-x-3">
                    <rs-button
                      variant="info"
                      @click="openBulkExportModal"
                      class="flex items-center"
                      :disabled="selectedRows.length === 0"
                    >
                      <Icon name="ic:baseline-download" class="w-4 h-4 mr-2" />
                      Export ({{ selectedRows.length }})
                    </rs-button>
                  </div>
                </div>
                
                <!-- Simple table for screened applications -->
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input 
                            type="checkbox" 
                            :checked="selectedRows.length === getTableDataByStatus(['Telah Disaring']).length && getTableDataByStatus(['Telah Disaring']).length > 0"
                            @change="toggleSelectAll"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rujukan</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pengenalan</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jawatan</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institusi</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="item in getTableDataByStatus(['Telah Disaring'])" :key="item.rujukan" class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <input 
                            type="checkbox" 
                            v-model="selectedRows" 
                            :value="item.rujukan"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {{ item.rujukan }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ item.nama }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ item.noKP }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ item.kategoriPenolongAmil }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ item.jawatan }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ item.institusiKariah }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <rs-badge :variant="getStatusPendaftaranVariant(item.statusPendaftaran)">
                            {{ item.statusPendaftaran }}
                          </rs-badge>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex justify-center items-center gap-3">
                      <button
                              @click="handleView(item.tindakan)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                            <button
                              @click="exportApplication(item.tindakan)"
                              title="Export Borang"
                              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Icon name="ic:baseline-download" class="w-5 h-5 text-success" />
                      </button>
                    </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </rs-tab-item>
          </rs-tab>
        </div>

        <!-- PT Tabs -->
        <div v-if="currentRole === 'pt'">
          <rs-tab v-model="activeTab" class="mt-4">
            <rs-tab-item title="Menunggu Semakan">
              <div class="pt-2">
                <rs-table
                  :key="`table-${tableKey}-pending-pt-review`"
                  :data="getTableDataByStatus(['Menunggu Semakan'])"
                  :columns="eksekutifColumnsWithoutStatusLantikan"
                  :pageSize="10"
                  :show-search="false"
                  :show-filter="false"
                  :options="{
                    variant: 'default',
                    hover: true,
                    striped: true,
                  }"
                  :options-advanced="{
                    sortable: true,
                    filterable: false,
                  }"
                  advanced
                >
                  <template v-slot:statusPendaftaran="{ text }">
                    <rs-badge :variant="getStatusPendaftaranVariant(text)">
                      {{ text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-3">
                      <button
                        @click="handleView(text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                      <button
                        @click="handleReview(text)"
                        title="Semak"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="iconamoon:arrow-right-2" class="w-5 h-5 text-info" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Telah Disemak">
              <div class="pt-2">
                <rs-table
                  :key="`table-${tableKey}-pt-reviewed`"
                  :data="getTableDataByStatus(['Telah Disemak'])"
                  :columns="eksekutifColumnsWithoutStatusLantikan"
                  :pageSize="10"
                  :show-search="false"
                  :show-filter="false"
                  :options="{
                    variant: 'default',
                    hover: true,
                    striped: true,
                  }"
                  :options-advanced="{
                    sortable: true,
                    filterable: false,
                  }"
                  advanced
                >
                  <template v-slot:statusPendaftaran="{ text }">
                    <rs-badge :variant="getStatusPendaftaranVariant(text)">
                      {{ text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-3">
                      <button
                        @click="handleView(text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>
          </rs-tab>
        </div>

        <!-- Eksekutif Tabs -->
        <div v-if="currentRole === 'eksekutif'">
          <rs-tab v-model="activeTab" class="mt-4">
            <rs-tab-item title="Menunggu Sokongan">
              <div class="pt-2">
                <rs-table
                  :key="`table-${tableKey}-pending-support`"
                  :data="getTableDataByStatus(['Menunggu Sokongan'])"
                  :columns="eksekutifColumnsWithoutStatusLantikan"
                  :pageSize="10"
                  :show-search="false"
                  :show-filter="false"
                  :options="{
                    variant: 'default',
                    hover: true,
                    striped: true,
                  }"
                  :options-advanced="{
                    sortable: true,
                    filterable: false,
                  }"
                  advanced
                >
                  <template v-slot:statusPendaftaran="{ text }">
                    <rs-badge :variant="getStatusPendaftaranVariant(text)">
                      {{ text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-3">
                      <button
                        @click="handleView(text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                      <button
                        @click="handleSupport(text)"
                        title="Sokong"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="iconamoon:arrow-right-2" class="w-5 h-5 text-success" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Telah Disokong">
              <div class="pt-2">
                <rs-table
                  :key="`table-${tableKey}-supported`"
                  :data="getTableDataByStatus(['Telah Disokong'])"
                  :columns="eksekutifColumnsWithoutStatusLantikan"
                  :pageSize="10"
                  :show-search="false"
                  :show-filter="false"
                  :options="{
                    variant: 'default',
                    hover: true,
                    striped: true,
                  }"
                  :options-advanced="{
                    sortable: true,
                    filterable: false,
                  }"
                  advanced
                >
                  <template v-slot:statusPendaftaran="{ text }">
                    <rs-badge :variant="getStatusPendaftaranVariant(text)">
                      {{ text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-3">
                      <button
                        @click="handleView(text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>
          </rs-tab>
        </div>

        <!-- Ketua Jabatan Tabs -->
        <div v-if="currentRole === 'ketua-jabatan'">
          <rs-tab v-model="activeTab" class="mt-4">
            <rs-tab-item title="Menunggu Pengesahan">
              <div class="pt-2">
                <rs-table
                  :key="`table-${tableKey}-pending-confirmation`"
                  :data="getTableDataByStatus(['Menunggu Pengesahan'])"
                  :columns="eksekutifColumnsWithoutStatusLantikan"
                  :pageSize="10"
                  :show-search="false"
                  :show-filter="false"
                  :options="{
                    variant: 'default',
                    hover: true,
                    striped: true,
                  }"
                  :options-advanced="{
                    sortable: true,
                    filterable: false,
                  }"
                  advanced
                >
                  <template v-slot:statusPendaftaran="{ text }">
                    <rs-badge :variant="getStatusPendaftaranVariant(text)">
                      {{ text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-3">
                      <button
                        @click="handleView(text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                      <button
                        @click="handleConfirm(text)"
                        title="Sahkan"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="iconamoon:arrow-right-2" class="w-5 h-5 text-success" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Telah Disahkan">
              <div class="pt-2">
                <rs-table
                  :key="`table-${tableKey}-confirmed`"
                  :data="getTableDataByStatus(['Telah Disahkan'])"
                  :columns="eksekutifColumnsWithoutStatusLantikan"
                  :pageSize="10"
                  :show-search="false"
                  :show-filter="false"
                  :options="{
                    variant: 'default',
                    hover: true,
                    striped: true,
                  }"
                  :options-advanced="{
                    sortable: true,
                    filterable: false,
                  }"
                  advanced
                >
                  <template v-slot:statusPendaftaran="{ text }">
                    <rs-badge :variant="getStatusPendaftaranVariant(text)">
                      {{ text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-3">
                      <button
                        @click="handleView(text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>
          </rs-tab>
        </div>

        <!-- Ketua Divisyen Tabs -->
        <div v-if="currentRole === 'ketua-divisyen'">
          <rs-tab v-model="activeTab" class="mt-4">
            <rs-tab-item title="Menunggu Kelulusan">
              <div class="pt-2">
                <!-- Bulk Approval Button - Right Aligned -->
                <div class="flex justify-end mb-4">
                  <div v-if="getTableDataByStatus(['Menunggu Kelulusan']).length > 0" class="flex space-x-3">
                    <rs-button
                      variant="success"
                      @click="openBulkApprovalModal"
                      class="flex items-center"
                    >
                      Kelulusan Bulk
                    </rs-button>
                  </div>
                </div>
                
                <rs-table
                  :key="`table-${tableKey}-pending-approval`"
                  :data="getTableDataByStatus(['Menunggu Kelulusan'])"
                  :columns="eksekutifColumnsWithoutStatusLantikan"
                  :pageSize="10"
                  :show-search="false"
                  :show-filter="false"
                  :options="{
                    variant: 'default',
                    hover: true,
                    striped: true,
                  }"
                  :options-advanced="{
                    sortable: true,
                    filterable: false,
                  }"
                  advanced
                >
                  <template v-slot:statusPendaftaran="{ text }">
                    <rs-badge :variant="getStatusPendaftaranVariant(text)">
                      {{ text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-3">
                      <button
                        @click="handleView(text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                      <button
                        @click="handleApprove(text)"
                        title="Lulus"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="iconamoon:arrow-right-2" class="w-5 h-5 text-primary" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Telah Diluluskan">
              <div class="pt-2">
                <rs-table
                  :key="`table-${tableKey}-approved`"
                  :data="getTableDataByStatus(['Diluluskan', 'Approved'])"
                  :columns="eksekutifColumnsWithoutStatusLantikan"
                  :pageSize="10"
                  :show-search="false"
                  :show-filter="false"
                  :options="{
                    variant: 'default',
                    hover: true,
                    striped: true,
                  }"
                  :options-advanced="{
                    sortable: true,
                    filterable: false,
                  }"
                  advanced
                >
                  <template v-slot:statusPendaftaran="{ text }">
                    <rs-badge :variant="getStatusPendaftaranVariant(text)">
                      {{ text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tindakan="{ text }">
                    <div class="flex justify-center items-center gap-3">
                      <button
                        @click="handleView(text)"
                        title="Lihat"
                        class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                      </button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>
          </rs-tab>
        </div>
      </template>
    </rs-card>

    <!-- Bulk Screening Modal -->
    <div v-if="showBulkScreeningModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ic:baseline-security" class="w-6 h-6 mr-3 text-warning" />
            Saring Bulk Permohonan
          </h3>
          <button
            @click="closeBulkScreeningModal"
            class="text-gray-400 hover:text-gray-600"
          >
            <Icon name="ic:baseline-close" class="w-6 h-6" />
          </button>
        </div>
        
        <div class="mb-4">
          <p class="text-gray-600 mb-2">
            Anda akan menyaring <strong> permohonan</strong> untuk analisis risiko.
          </p>
          
          <!-- Selected Items Table -->
          <div class="border rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3"></th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rujukan</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in selectedScreeningItems" :key="item.rujukan" class="hover:bg-gray-50">
                  <td class="px-4 py-3">
                    <input type="checkbox" v-model="selectedScreeningMap[item.rujukan]" class="w-4 h-4" />
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.rujukan }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.nama }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.kategoriPenolongAmil }}</td>
                  <td class="px-4 py-3">
                    <rs-badge variant="warning" size="sm">{{ item.statusPendaftaran }}</rs-badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Risk Assessment Notes -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Ulasan Saringan Risiko <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="bulkScreeningNotes"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Masukkan ulasan saringan risiko untuk permohonan ini..."
          ></textarea>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3">
          <rs-button
            variant="secondary-outline"
            @click="closeBulkScreeningModal"
          >
            Batal
          </rs-button>
          <rs-button
            variant="warning"
            @click="performBulkScreening"
            :loading="false"
          >
            <Icon name="ic:baseline-security" class="w-4 h-4 mr-2" />
            Saring Terpilih ({{ selectedScreeningCount }})
          </rs-button>
        </div>
      </div>
    </div>

    <!-- Bulk Export Modal -->
    <div v-if="showBulkExportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ic:baseline-download" class="w-6 h-6 mr-3 text-info" />
            Export Borang Permohonan Terpilih
          </h3>
          <button
            @click="closeBulkExportModal"
            class="text-gray-400 hover:text-gray-600"
          >
            <Icon name="ic:baseline-close" class="w-6 h-6" />
          </button>
        </div>
        
        <div class="mb-4">
          <p class="text-gray-600 mb-2">
            Anda akan mengeksport <strong>{{ selectedExportItems.length }} borang permohonan</strong>.
          </p>
          
          <!-- Export Format Selection -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Format Export <span class="text-red-500">*</span>
            </label>
            <select
              v-model="bulkExportFormat"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="PDF">PDF (Portable Document Format)</option>
              <option value="EXCEL">Excel (Microsoft Excel)</option>
              <option value="ZIP">ZIP (Multiple Files)</option>
            </select>
          </div>
          
          <!-- Selected Items Table -->
          <div class="border rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3"></th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rujukan</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in selectedExportItems" :key="item.rujukan" class="hover:bg-gray-50">
                  <td class="px-4 py-3">
                    <input type="checkbox" v-model="selectedExportMap[item.rujukan]" class="w-4 h-4" />
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.rujukan }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.nama }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.kategoriPenolongAmil }}</td>
                  <td class="px-4 py-3">
                    <rs-badge variant="info" size="sm">{{ item.statusPendaftaran }}</rs-badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3">
          <rs-button
            variant="secondary-outline"
            @click="closeBulkExportModal"
          >
            Batal
          </rs-button>
          <rs-button
            variant="info"
            @click="performBulkExport"
            :loading="false"
          >
            <Icon name="ic:baseline-download" class="w-4 h-4 mr-2" />
            Export Terpilih ({{ selectedExportCount }})
          </rs-button>
        </div>
      </div>
    </div>

    <!-- Bulk Approval Modal -->
    <div v-if="showBulkApprovalModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ic:baseline-check-circle" class="w-6 h-6 mr-3 text-success" />
            Kelulusan Semua Permohonan Terpilih
          </h3>
          <button
            @click="closeBulkApprovalModal"
            class="text-gray-400 hover:text-gray-600"
          >
            <Icon name="ic:baseline-close" class="w-6 h-6" />
          </button>
        </div>
        
        <div class="mb-4">
          <p class="text-gray-600 mb-2">
            Anda akan meluluskan <strong>{{ selectedScreeningItems.length }} permohonan</strong> untuk kelulusan.
          </p>
          
          <!-- Selected Items Table -->
          <div class="border rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3"></th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rujukan</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in selectedScreeningItems" :key="item.rujukan" class="hover:bg-gray-50">
                  <td class="px-4 py-3">
                    <input type="checkbox" v-model="selectedScreeningMap[item.rujukan]" class="w-4 h-4" />
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.rujukan }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.nama }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.kategoriPenolongAmil }}</td>
                  <td class="px-4 py-3">
                    <rs-badge variant="info" size="sm">{{ item.statusPendaftaran }}</rs-badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Approval Notes -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Ulasan Kelulusan <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="bulkScreeningNotes"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Masukkan ulasan kelulusan untuk permohonan ini..."
          ></textarea>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3">
          <rs-button
            variant="secondary-outline"
            @click="closeBulkApprovalModal"
          >
            Batal
          </rs-button>
          <rs-button
            variant="success"
            @click="performBulkApproval"
            :loading="false"
          >
            <Icon name="ic:baseline-check-circle" class="w-4 h-4 mr-2" />
            Lulus Terpilih ({{ selectedScreeningCount }})
          </rs-button>
        </div>
      </div>
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
          {{ paginationEnd }} daripada {{ getCurrentTabDataCount() }} entri
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
import { ref, computed, watch, nextTick, onMounted } from "vue";
import { navigateTo } from "#app";

definePageMeta({
  title: "Senarai Permohonan Penolong Amil",
  description: "Senarai permohonan penolong amil untuk semakan dan kelulusan",
});
const selectedRows = ref([]);

// Bulk operations state for eksekutif-pengurusan-risiko
const showBulkScreeningModal = ref(false);
const showBulkExportModal = ref(false);
const showBulkApprovalModal = ref(false);
const selectedScreeningItems = ref([]);
const selectedExportItems = ref([]);
const selectedScreeningMap = ref({});
const selectedExportMap = ref({});
const bulkScreeningNotes = ref("");
const bulkExportFormat = ref("PDF");

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
    name: "Senarai Permohonan",
    type: "current",
    path: "/BF-PA/PP/PD",
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



const sesiPerkhidmatanOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "Sesi 1 - Januari-Mac", value: "Sesi 1" },
  { label: "Sesi 2 - April-Jun", value: "Sesi 2" },
  { label: "Sesi 3 - Julai-September", value: "Sesi 3" },
  { label: "Sesi 4 - Oktober-Disember", value: "Sesi 4" },
];

const kategoriPenolongAmilOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "Fitrah", value: "Fitrah" },
  { label: "Padi", value: "Padi" },
  { label: "Kariah", value: "Kariah" },
  { label: "Komuniti", value: "Komuniti" },
];

const statusLantikanOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "Menunggu", value: "Pending" },
  { label: "Dilantik", value: "Appointed" },
  { label: "Aktif", value: "Active" },
  { label: "Tidak Aktif", value: "Inactive" },
  { label: "Ditamatkan", value: "Terminated" },
];

// Completed applications status options (only active statuses)
const completedStatusLantikanOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "Aktif", value: "Aktif" },
  { label: "Tidak Aktif", value: "Tidak Aktif" },
  { label: "Ditamatkan", value: "Ditamatkan" },
];

// State
const filters = ref({
  searchQuery: "",
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

// Tab management
const activeTab = ref("Draf");
const tableKey = ref(0);



// Page-specific role options for Pra Daftar
const roleOptions = [
  { label: "PIC", value: "pyb" },
  { label: "Eksekutif Pengurusan Risiko", value: "eksekutif-pengurusan-risiko" },
  { label: "PT", value: "pt" },
  { label: "Eksekutif", value: "eksekutif" },
  { label: "Ketua Jabatan", value: "ketua-jabatan" },
  { label: "Ketua Divisyen", value: "ketua-divisyen" },
];

// Role data for Pra Daftar
const roleData = {
  pyb: {
    label: "PIC",
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



const handleRoleChange = () => {
  // Role change logic can be added here if needed
  console.log("Role changed to:", currentRole.value);
  
  // Reset to first available tab for the new role
  const validTabs = getValidTabsForRole(currentRole.value);
  if (validTabs.length > 0) {
    activeTab.value = validTabs[0];
  }
  
  // Refresh table
  refreshTable();
};

// Tab management helper functions
const getValidTabsForRole = (role) => {
  const roleTabs = {
    pyb: ["Draf", "Sedang Proses", "Lulus", "Ditolak"],
    "eksekutif-pengurusan-risiko": ["Menunggu Saringan", "Telah Disaring"],
    pt: ["Menunggu Semakan", "Telah Disemak"],
    eksekutif: ["Menunggu Sokongan", "Telah Disokong"],
    "ketua-jabatan": ["Menunggu Pengesahan", "Telah Disahkan"],
    "ketua-divisyen": ["Menunggu Kelulusan", "Lulus"],
  };
  return roleTabs[role] || ["Draf"];
};

const refreshTable = () => {
  nextTick(() => {
    tableKey.value++; // Force table to re-render
  });
};

const getRoleSpecificDescription = () => {
  const roleDescriptions = {
    pyb: "Urus permohonan penolong amil oleh PIC - Draf, Proses, Lulus, Ditolak",
    "eksekutif-pengurusan-risiko": "Saringan risiko untuk permohonan penolong amil",
    pt: "Semakan dokumen PT untuk permohonan penolong amil",
    eksekutif: "Sokongan eksekutif untuk permohonan penolong amil",
    "ketua-jabatan": "Pengesahan ketua jabatan untuk permohonan penolong amil",
    "ketua-divisyen": "Kelulusan akhir untuk permohonan penolong amil",
  };
  return roleDescriptions[currentRole.value] || "Pilih peranan untuk melihat fungsi yang tersedia";
};

// Get current tab data count for pagination
const getCurrentTabDataCount = () => {
  const role = currentRole.value;
  const tab = activeTab.value;
  
  // Define status mappings for each tab
  const tabStatusMap = {
    pyb: {
      "Draf": ["Draf", "Draft"],
      "Sedang Proses": ["Dihantar", "Belum Disaring", "Menunggu Semakan", "Menunggu Sokongan", "Menunggu Pengesahan", "Menunggu Kelulusan"],
      "Lulus": ["Diluluskan", "Approved"],
      "Ditolak": ["Ditolak", "Rejected"],
    },
    "eksekutif-pengurusan-risiko": {
      "Menunggu Saringan": ["Belum Disaring"],
      "Telah Disaring": ["Telah Disaring"],
    },
    pt: {
      "Menunggu Semakan": ["Menunggu Semakan"],
      "Telah Disemak": ["Telah Disemak"],
    },
    eksekutif: {
      "Menunggu Sokongan": ["Menunggu Sokongan"],
      "Telah Disokong": ["Telah Disokong"],
    },
    "ketua-jabatan": {
      "Menunggu Pengesahan": ["Menunggu Pengesahan"],
      "Telah Disahkan": ["Telah Disahkan"],
    },
    "ketua-divisyen": {
      "Menunggu Kelulusan": ["Menunggu Kelulusan"],
      "Lulus": ["Diluluskan", "Approved"],
    },
  };
  
  const statuses = tabStatusMap[role]?.[tab] || [];
  if (statuses.length === 0) return 0;
  
  return getTableDataByStatus(statuses).length;
};

// Computed properties for eksekutif-pengurusan-risiko bulk operations
const hasPendingScreening = computed(() => {
  return getTableDataByStatus(['Belum Disaring']).length > 0;
});

const pendingScreeningCount = computed(() => {
  return getTableDataByStatus(['Belum Disaring']).length;
});

const selectedScreeningCount = computed(() => {
  return selectedScreeningItems.value.filter(item => selectedScreeningMap.value[item.rujukan]).length;
});

const selectedExportCount = computed(() => {
  return selectedExportItems.value.filter(item => selectedExportMap.value[item.rujukan]).length;
});

const handleSearch = () => {
  isSearchTriggered.value = true;
  currentPage.value = 1; // Reset to first page when searching
};

const handleReset = () => {
  filters.value.searchQuery = "";
  isSearchTriggered.value = false;
  currentPage.value = 1;
};



// RTMF Compliant Mock Data - Role-specific with Institution Filtering
const applications = ref([
  {
    no: 1,
    rujukan: "PA-2024-001",
    nama: "Ismail bin Hassan",
    noKP: "870625098765",
    kategoriPenolongAmil: "Kariah",
    jawatan: "Penolong Amil Kariah",
    institusiKariah: "Masjid Al-Amin",
    institusiId: "MASJID_NEGERI_SELANGOR_001",
    statusPendaftaran: "Belum Disaring",
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
    institusiKariah: "Masjid Al-Amin",
    institusiId: "MASJID_NEGERI_SELANGOR_001",
    statusPendaftaran: "Menunggu Kelulusan",
    statusLantikan: "Menunggu",
    tindakan: { rujukan: "PA-2024-002", statusPendaftaran: "Menunggu Kelulusan" },
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
    institusiKariah: "Masjid Al-Amin",
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
    kategoriPenolongAmil: "Komuniti",
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
    kategoriPenolongAmil: "Komuniti",
    jawatan: "Penolong Amil Fitrah",
    institusiKariah: "Masjid Al-Amin",
    institusiId: "MASJID_NEGERI_SELANGOR_001",
    statusLantikan: "Aktif",
          tarikhLantikan: "01-01-2023",
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
    institusiKariah: "Masjid Al-Amin",
    institusiId: "MASJID_NEGERI_SELANGOR_001",
    statusLantikan: "Aktif",
          tarikhLantikan: "01-04-2023",
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
          tarikhLantikan: "01-07-2023",
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
      nama: "Malik bin Husin",
      noKP: "700501010101",
      kategoriPenolongAmil: "Komuniti",
      jawatan: "Penolong Amil Fitrah",
      institusiKariah: "Masjid Al-Amin",
      institusiId: "MASJID_NEGERI_SELANGOR_001",
      statusPendaftaran: "Belum Disaring",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-001", statusPendaftaran: "Belum Disaring" },
    },
    {
      no: 2,
      rujukan: "PA-2024-002",
      nama: "Siti binti Mohamed",
      noKP: "850515087654",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Amin",
      statusPendaftaran: "Menunggu Kelulusan",
      sesiPerkhidmatan: "Sesi 2",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-002", statusPendaftaran: "Menunggu Kelulusan" },
    },
    {
      no: 3,
      rujukan: "PA-2024-003",
      nama: "Mohd Razak bin Ibrahim",
      noKP: "880320056789",
      kategoriPenolongAmil: "Komuniti",
      jawatan: "Penolong Amil Komuniti",
      institusiKariah: "Masjid Al-Amin",
      statusPendaftaran: "Menunggu Semakan",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-003", statusPendaftaran: "Menunggu Semakan" },
    },
    {
      no: 4,
      rujukan: "PA-2024-004",
      nama: "Nurul Huda binti Ali",
      noKP: "920810034567",
      kategoriPenolongAmil: "Padi",
      jawatan: "Penolong Amil Padi",
      institusiKariah: "Masjid Al-Amin",
      statusPendaftaran: "Menunggu Sokongan",
      sesiPerkhidmatan: "Sesi 4",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-004", statusPendaftaran: "Menunggu Sokongan" },
    },
    {
      no: 5,
      rujukan: "PA-2024-005",
      nama: "Abdul Rahman bin Hassan",
      noKP: "870625098765",
      kategoriPenolongAmil: "Fitrah",
      jawatan: "Penolong Amil Fitrah",
      institusiKariah: "Masjid Al-Amin",
      statusPendaftaran: "Menunggu Pengesahan",
      sesiPerkhidmatan: "Sesi 1",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-005", statusPendaftaran: "Menunggu Pengesahan" },
    },
    {
      no: 6,
      rujukan: "PA-2024-006",
      nama: "Fatimah binti Omar",
      noKP: "880420082345",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Amin",
      statusPendaftaran: "Menunggu Kelulusan",
      sesiPerkhidmatan: "Sesi 2",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-006", statusPendaftaran: "Menunggu Kelulusan" },
    },
    {
      no: 7,
      rujukan: "PA-2024-007",
      nama: "Zulkifli bin Ahmad",
      noKP: "850315071234",
      kategoriPenolongAmil: "Padi",
      jawatan: "Penolong Amil Padi",
      institusiKariah: "Masjid Al-Amin",
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
      institusiKariah: "Masjid Al-Amin",
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
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Amin",
      statusPendaftaran: "Draf",
      sesiPerkhidmatan: "Sesi 1",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-009", statusPendaftaran: "Draf" },
    },
    {
      no: 10,
      rujukan: "PA-2024-010",
      nama: "Ahmad bin Abdullah",
      noKP: "900315071234",
      kategoriPenolongAmil: "Fitrah",
      jawatan: "Penolong Amil Fitrah",
      institusiKariah: "Masjid Al-Hidayah",
      statusPendaftaran: "Draf",
      sesiPerkhidmatan: "Sesi 2",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-010", statusPendaftaran: "Draf" },
    },
    {
      no: 11,
      rujukan: "PA-2024-011",
      nama: "Siti Aminah binti Omar",
      noKP: "880420082345",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Nur",
      statusPendaftaran: "Diluluskan",
      sesiPerkhidmatan: "Sesi 3",
      statusLantikan: "Aktif",
      tindakan: { rujukan: "PA-2024-011", statusPendaftaran: "Diluluskan" },
    },
    {
      no: 12,
      rujukan: "PA-2024-012",
      nama: "Mohd Zain bin Ahmad",
      noKP: "850315071234",
      kategoriPenolongAmil: "Padi",
      jawatan: "Penolong Amil Padi",
      institusiKariah: "Masjid Al-Amin",
      statusPendaftaran: "Diluluskan",
      sesiPerkhidmatan: "Sesi 1",
      statusLantikan: "Aktif",
      tindakan: { rujukan: "PA-2024-012", statusPendaftaran: "Diluluskan" },
    },
    {
      no: 10,
      rujukan: "PA-2024-010",
      nama: "Aminah binti Mohamed",
      noKP: "920810034567",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Amin",
      statusPendaftaran: "Menunggu Kelulusan",
      sesiPerkhidmatan: "Sesi 2",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-010", statusPendaftaran: "Menunggu Kelulusan" },
    },
    // NEW: PYB "Lulus" data
    {
      no: 11,
      rujukan: "PA-2024-011",
      nama: "Mohd Hafiz bin Ismail",
      noKP: "890715045678",
      kategoriPenolongAmil: "Fitrah",
      jawatan: "Penolong Amil Fitrah",
      institusiKariah: "Masjid Al-Amin",
      statusPendaftaran: "Diluluskan",
      sesiPerkhidmatan: "Sesi 1",
      statusLantikan: "Dilantik",
      tindakan: { rujukan: "PA-2024-011", statusPendaftaran: "Diluluskan" },
    },
    {
      no: 12,
      rujukan: "PA-2024-012",
      nama: "Nurul Ain binti Ahmad",
      noKP: "910320056789",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Amin",
      statusPendaftaran: "Diluluskan",
      sesiPerkhidmatan: "Sesi 2",
      statusLantikan: "Dilantik",
      tindakan: { rujukan: "PA-2024-012", statusPendaftaran: "Diluluskan" },
    }
  ],
  "eksekutif-pengurusan-risiko": [
    {
      no: 1,
      rujukan: "PA-2024-001",
      nama: "Ismail bin Hassan",
      noKP: "870625098765",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Amin",
              statusPendaftaran: "Belum Disaring",
        sesiPerkhidmatan: "Sesi 1",
        statusLantikan: "Menunggu",
        tindakan: { rujukan: "PA-2024-001", statusPendaftaran: "Belum Disaring" },
    },
    {
      no: 2,
      rujukan: "PA-2024-002",
      nama: "Siti binti Mohamed",
      noKP: "850515087654",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Khairiyah",
              statusPendaftaran: "Belum Disaring",
        sesiPerkhidmatan: "Sesi 2",
        statusLantikan: "Menunggu",
        tindakan: { rujukan: "PA-2024-002", statusPendaftaran: "Belum Disaring" },
    },
    {
      no: 3,
      rujukan: "PA-2024-003",
      nama: "Mohd Razak bin Ibrahim",
      noKP: "880320056789",
      kategoriPenolongAmil: "Komuniti",
      jawatan: "Penolong Amil Komuniti",
      institusiKariah: "Masjid Kg Delek",
              statusPendaftaran: "Belum Disaring",
        sesiPerkhidmatan: "Sesi 3",
        statusLantikan: "Menunggu",
        tindakan: { rujukan: "PA-2024-003", statusPendaftaran: "Belum Disaring" },
    },
    // NEW: Eksekutif Pengurusan Risiko "Telah Disaring" data
    {
      no: 4,
      rujukan: "PA-2024-004",
      nama: "Nurul Huda binti Ali",
      noKP: "920810034567",
      kategoriPenolongAmil: "Padi",
      jawatan: "Penolong Amil Padi",
      institusiKariah: "Masjid Al-Amin",
      statusPendaftaran: "Telah Disaring",
      sesiPerkhidmatan: "Sesi 1",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-004", statusPendaftaran: "Telah Disaring" },
    },
    {
      no: 5,
      rujukan: "PA-2024-005",
      nama: "Abdul Rahman bin Hassan",
      noKP: "870625098765",
      kategoriPenolongAmil: "Fitrah",
      jawatan: "Penolong Amil Fitrah",
      institusiKariah: "Masjid Al-Khairiyah",
      statusPendaftaran: "Telah Disaring",
      sesiPerkhidmatan: "Sesi 2",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-005", statusPendaftaran: "Telah Disaring" },
    },
    {
      no: 6,
      rujukan: "PA-2024-006",
      nama: "Fatimah binti Omar",
      noKP: "880420082345",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Nur",
      statusPendaftaran: "Telah Disaring",
      sesiPerkhidmatan: "Sesi 3",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-006", statusPendaftaran: "Telah Disaring" },
    }
  ],
  pt: [
    {
      no: 1,
      rujukan: "PA-2024-001",
      nama: "Ismail bin Hassan",
      noKP: "870625098765",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Amin",
      statusPendaftaran: "Menunggu Semakan",
      sesiPerkhidmatan: "Sesi 1",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-001", statusPendaftaran: "Menunggu Semakan" },
    },
    {
      no: 2,
      rujukan: "PA-2024-002",
      nama: "Siti binti Mohamed",
      noKP: "850515087654",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Khairiyah",
      statusPendaftaran: "Menunggu Semakan",
      sesiPerkhidmatan: "Sesi 2",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-002", statusPendaftaran: "Menunggu Semakan" },
    },
    // Additional PT data for both tabs
    {
      no: 3,
      rujukan: "PA-2024-003",
      nama: "Mohd Razak bin Ibrahim",
      noKP: "880320056789",
      kategoriPenolongAmil: "Komuniti",
      jawatan: "Penolong Amil Komuniti",
      institusiKariah: "Masjid Kg Delek",
      statusPendaftaran: "Menunggu Semakan",
      sesiPerkhidmatan: "Sesi 3",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-003", statusPendaftaran: "Menunggu Semakan" },
    },
    {
      no: 4,
      rujukan: "PA-2024-004",
      nama: "Ahmad bin Abdullah",
      noKP: "900315071234",
      kategoriPenolongAmil: "Fitrah",
      jawatan: "Penolong Amil Fitrah",
      institusiKariah: "Masjid Al-Hidayah",
      statusPendaftaran: "Menunggu Semakan",
      sesiPerkhidmatan: "Sesi 1",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-004", statusPendaftaran: "Menunggu Semakan" },
    },
    {
      no: 5,
      rujukan: "PA-2024-005",
      nama: "Fatimah binti Omar",
      noKP: "880420082345",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Nur",
      statusPendaftaran: "Menunggu Semakan",
      sesiPerkhidmatan: "Sesi 2",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-005", statusPendaftaran: "Menunggu Semakan" },
    },
    {
      no: 4,
      rujukan: "PA-2024-004",
      nama: "Nurul Huda binti Ali",
      noKP: "920810034567",
      kategoriPenolongAmil: "Padi",
      jawatan: "Penolong Amil Padi",
      institusiKariah: "Masjid Al-Amin",
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
      institusiKariah: "Masjid Al-Khairiyah",
      statusPendaftaran: "Telah Disemak",
      sesiPerkhidmatan: "Sesi 1",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-005", statusPendaftaran: "Telah Disemak" },
    },
    {
      no: 6,
      rujukan: "PA-2024-006",
      nama: "Siti Aminah binti Omar",
      noKP: "880420082345",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Nur",
      statusPendaftaran: "Telah Disemak",
      sesiPerkhidmatan: "Sesi 2",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-006", statusPendaftaran: "Telah Disemak" },
    }
  ],
  eksekutif: [
    {
      no: 1,
      rujukan: "PA-2024-001",
      nama: "Ismail bin Hassan",
      noKP: "870625098765",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Amin",
      statusPendaftaran: "Menunggu Sokongan",
      sesiPerkhidmatan: "Sesi 1",
      tindakan: { rujukan: "PA-2024-001", statusPendaftaran: "Menunggu Sokongan" },
    },
    {
      no: 2,
      rujukan: "PA-2024-002",
      nama: "Siti binti Mohamed",
      noKP: "850515087654",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Khairiyah",
      statusPendaftaran: "Menunggu Sokongan",
      sesiPerkhidmatan: "Sesi 2",
      tindakan: { rujukan: "PA-2024-002", statusPendaftaran: "Menunggu Sokongan" },
    },
    {
      no: 3,
      rujukan: "PA-2024-003",
      nama: "Abdul Rahman bin Hassan",
      noKP: "870625098765",
      kategoriPenolongAmil: "Fitrah",
      jawatan: "Penolong Amil Fitrah",
      institusiKariah: "Masjid Al-Hidayah",
      statusPendaftaran: "Menunggu Sokongan",
      sesiPerkhidmatan: "Sesi 1",
      tindakan: { rujukan: "PA-2024-003", statusPendaftaran: "Menunggu Sokongan" },
    },
    {
      no: 4,
      rujukan: "PA-2024-004",
      nama: "Noraini binti Abdullah",
      noKP: "900525093456",
      kategoriPenolongAmil: "Padi",
      jawatan: "Penolong Amil Padi",
      institusiKariah: "Masjid Al-Nur",
      statusPendaftaran: "Menunggu Sokongan",
      sesiPerkhidmatan: "Sesi 3",
      tindakan: { rujukan: "PA-2024-004", statusPendaftaran: "Menunggu Sokongan" },
    },
    {
      no: 5,
      rujukan: "PA-2024-005",
      nama: "Zulkifli bin Ahmad",
      noKP: "850315071234",
      kategoriPenolongAmil: "Komuniti",
      jawatan: "Penolong Amil Komuniti",
      institusiKariah: "Masjid Al-Amin",
      statusPendaftaran: "Menunggu Sokongan",
      sesiPerkhidmatan: "Sesi 2",
      tindakan: { rujukan: "PA-2024-005", statusPendaftaran: "Menunggu Sokongan" },
    },
    // NEW: Eksekutif "Telah Disokong" data
    {
      no: 3,
      rujukan: "PA-2024-003",
      nama: "Mohd Razak bin Ibrahim",
      noKP: "880320056789",
      kategoriPenolongAmil: "Komuniti",
      jawatan: "Penolong Amil Komuniti",
      institusiKariah: "Masjid Kg Delek",
      statusPendaftaran: "Telah Disokong",
      sesiPerkhidmatan: "Sesi 3",
      tindakan: { rujukan: "PA-2024-003", statusPendaftaran: "Telah Disokong" },
    },
    {
      no: 4,
      rujukan: "PA-2024-004",
      nama: "Nurul Huda binti Ali",
      noKP: "920810034567",
      kategoriPenolongAmil: "Padi",
      jawatan: "Penolong Amil Padi",
      institusiKariah: "Masjid Al-Amin",
      statusPendaftaran: "Telah Disokong",
      sesiPerkhidmatan: "Sesi 4",
      tindakan: { rujukan: "PA-2024-004", statusPendaftaran: "Telah Disokong" },
    },
    {
      no: 5,
      rujukan: "PA-2024-005",
      nama: "Ahmad bin Abdullah",
      noKP: "900315071234",
      kategoriPenolongAmil: "Fitrah",
      jawatan: "Penolong Amil Fitrah",
      institusiKariah: "Masjid Al-Hidayah",
      statusPendaftaran: "Telah Disokong",
      sesiPerkhidmatan: "Sesi 1",
      tindakan: { rujukan: "PA-2024-005", statusPendaftaran: "Telah Disokong" },
    }
  ],
  "ketua-jabatan": [
    {
      no: 1,
      rujukan: "PA-2024-001",
      nama: "Ismail bin Hassan",
      noKP: "870625098765",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Amin",
      statusPendaftaran: "Menunggu Pengesahan",
      sesiPerkhidmatan: "Sesi 1",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-001", statusPendaftaran: "Menunggu Pengesahan" },
    },
    {
      no: 2,
      rujukan: "PA-2024-002",
      nama: "Siti binti Mohamed",
      noKP: "850515087654",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Khairiyah",
      statusPendaftaran: "Menunggu Pengesahan",
      sesiPerkhidmatan: "Sesi 2",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-002", statusPendaftaran: "Menunggu Pengesahan" },
    },
    // NEW: Ketua Jabatan "Telah Disahkan" data
    {
      no: 3,
      rujukan: "PA-2024-003",
      nama: "Mohd Razak bin Ibrahim",
      noKP: "880320056789",
      kategoriPenolongAmil: "Komuniti",
      jawatan: "Penolong Amil Komuniti",
      institusiKariah: "Masjid Kg Delek",
      statusPendaftaran: "Telah Disahkan",
      sesiPerkhidmatan: "Sesi 3",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-003", statusPendaftaran: "Telah Disahkan" },
    },
    {
      no: 4,
      rujukan: "PA-2024-004",
      nama: "Nurul Huda binti Ali",
      noKP: "920810034567",
      kategoriPenolongAmil: "Padi",
      jawatan: "Penolong Amil Padi",
      institusiKariah: "Masjid Al-Amin",
      statusPendaftaran: "Telah Disahkan",
      sesiPerkhidmatan: "Sesi 4",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-004", statusPendaftaran: "Telah Disahkan" },
    },
    {
      no: 5,
      rujukan: "PA-2024-005",
      nama: "Ahmad bin Abdullah",
      noKP: "900315071234",
      kategoriPenolongAmil: "Fitrah",
      jawatan: "Penolong Amil Fitrah",
      institusiKariah: "Masjid Al-Hidayah",
      statusPendaftaran: "Telah Disahkan",
      sesiPerkhidmatan: "Sesi 1",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-005", statusPendaftaran: "Telah Disahkan" },
    }
  ],
  "ketua-divisyen": [
    {
      no: 1,
      rujukan: "PA-2024-001",
      nama: "Ismail bin Hassan",
      noKP: "870625098765",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Amin",
      statusPendaftaran: "Menunggu Kelulusan",
      sesiPerkhidmatan: "Sesi 1",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-001", statusPendaftaran: "Menunggu Kelulusan" },
    },
    {
      no: 2,
      rujukan: "PA-2024-002",
      nama: "Siti binti Mohamed",
      noKP: "850515087654",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Khairiyah",
      statusPendaftaran: "Menunggu Kelulusan",
      sesiPerkhidmatan: "Sesi 2",
      statusLantikan: "Menunggu",
      tindakan: { rujukan: "PA-2024-002", statusPendaftaran: "Menunggu Kelulusan" },
    },
    // NEW: Ketua Divisyen "Telah Diluluskan" data
    {
      no: 3,
      rujukan: "PA-2024-003",
      nama: "Mohd Razak bin Ibrahim",
      noKP: "880320056789",
      kategoriPenolongAmil: "Komuniti",
      jawatan: "Penolong Amil Komuniti",
      institusiKariah: "Masjid Kg Delek",
      statusPendaftaran: "Diluluskan",
      sesiPerkhidmatan: "Sesi 3",
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
      institusiKariah: "Masjid Al-Amin",
      statusPendaftaran: "Diluluskan",
      sesiPerkhidmatan: "Sesi 4",
      statusLantikan: "Dilantik",
      tindakan: { rujukan: "PA-2024-004", statusPendaftaran: "Diluluskan" },
    },
    {
      no: 5,
      rujukan: "PA-2024-005",
      nama: "Farid bin Zainal",
      noKP: "860101011111",
      kategoriPenolongAmil: "Kariah",
      jawatan: "Penolong Amil Kariah",
      institusiKariah: "Masjid Al-Falah",
      statusPendaftaran: "Diluluskan",
      sesiPerkhidmatan: "Sesi 2",
      statusLantikan: "Dilantik",
      tindakan: { rujukan: "PA-2024-005", statusPendaftaran: "Diluluskan" },
    },
    {
      no: 6,
      rujukan: "PA-2024-006",
      nama: "Siti Aminah binti Omar",
      noKP: "880420082345",
      kategoriPenolongAmil: "Fitrah",
      jawatan: "Penolong Amil Fitrah",
      institusiKariah: "Masjid Al-Nur",
      statusPendaftaran: "Diluluskan",
      sesiPerkhidmatan: "Sesi 1",
      statusLantikan: "Dilantik",
      tindakan: { rujukan: "PA-2024-006", statusPendaftaran: "Diluluskan" },
    }
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
  }

  // Remove sesiPerkhidmatan field from all objects to prevent it from showing in the table
  result = result.map(({ sesiPerkhidmatan, institusiId, ...rest }) => rest);
  
  // Remove statusLantikan field for all roles to hide the column
  result = result.map(({ statusLantikan, ...rest }) => rest);

  // Remove no field to hide the No column and prevent rs-table display issues
  result = result.map(({ no, ...rest }) => rest);

  return result;
});

const totalApplications = computed(() => filteredApplications.value.length);

const totalPages = computed(() =>
  Math.ceil(getCurrentTabDataCount() / pageSize.value)
);

const paginationStart = computed(() => {
  return getCurrentTabDataCount() > 0
    ? (currentPage.value - 1) * pageSize.value + 1
    : 0;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * pageSize.value, getCurrentTabDataCount());
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

  // Remove no field to hide the No column and prevent rs-table display issues
  result = result.map(({ no, ...rest }) => rest);

  return result;
});

const totalCompletedApplications = computed(() => filteredCompletedApplications.value.length);

// Filter table data based on status for tabs
const getTableDataByStatus = (statuses) => {
  // Use role-specific data if available, otherwise use default data
  const dataSource = roleSpecificData[currentRole.value] || applications.value;
  let result = [...dataSource];

  // Apply institution filter for PYB role (only show applications from their institution)
  if (currentRole.value === 'pyb') {
    const currentInstitutionId = "MASJID_NEGERI_SELANGOR_001"; // Mock current user's institution
    result = result.filter((app) => app.institusiId === currentInstitutionId || !app.institusiId);
  }

  // Filter by status
  result = result.filter((app) => statuses.includes(app.statusPendaftaran));

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
  }

  // Remove sesiPerkhidmatan field from all objects to prevent it from showing in the table
  result = result.map(({ sesiPerkhidmatan, institusiId, ...rest }) => rest);
  
  // Remove statusLantikan field for all roles to hide the column
  result = result.map(({ statusLantikan, ...rest }) => rest);

  // Remove no field to hide the No column and prevent rs-table display issues
  result = result.map(({ no, ...rest }) => rest);

  return result;
};

// Helper functions for status badge variants
const getStatusPendaftaranVariant = (status) => {
  const statusVariants = {
    // Draft/Initial stages
    Draft: "disabled",
    Draf: "disabled",
    
    // Submitted/Under Review stages
    Submitted: "warning",
    Dihantar: "warning",
    "Under Review": "info",
    
    // Pending/Waiting stages (uniform warning)
    "Belum Disaring": "warning",
    "Menunggu Semakan": "warning",
    "Menunggu Sokongan": "warning",
    "Menunggu Pengesahan": "warning",
    "Menunggu Kelulusan": "warning",
    
    // Completed by current role (Telah ... → secondary)
    Screened: "secondary",
    Disaring: "secondary",
    "Telah Disaring": "secondary",
    "PT Reviewed": "secondary",
    "Disemak PT": "secondary",
    "Telah Disemak": "secondary",
    "Executive Supported": "secondary",
    "Disokong Eksekutif": "secondary",
    "Telah Disokong": "secondary",
    "Department Confirmed": "secondary",
    "Disahkan Jabatan": "secondary",
    "Telah Disahkan": "secondary",
    
    // Final approvals (primary)
    "Division Approved": "primary",
    "Diluluskan Divisyen": "primary",
    "Telah Diluluskan": "primary",
    Approved: "primary",
    Diluluskan: "primary",
    
    // Rejection (danger)
    Rejected: "danger",
    Ditolak: "danger",
  };
  return statusVariants[status] || "secondary"; // Use secondary instead of default
};

const getStatusLantikanVariant = (status) => {
  const statusVariants = {
    // Pending stages
    Pending: "warning",
    Menunggu: "warning",
    
    // Appointment stages
    Appointed: "info",
    Dilantik: "info",
    
    // Active stages
    Active: "success",
    Aktif: "success",
    
    // Inactive stages
    Inactive: "secondary",
    "Tidak Aktif": "secondary",
    
    // Termination
    Terminated: "danger",
    Ditamatkan: "danger",
  };
  return statusVariants[status] || "secondary"; // Use secondary instead of default
};

const canEdit = (statusPendaftaran) => {
  return ["Draft", "Draf", "Submitted", "Dihantar"].includes(statusPendaftaran);
};

// Action handlers with RTMF screen references
// PA-PP-PD-01_02: Detail View - Maklumat Penolong Amil Terperinci
const handleView = (actionData) => {
          navigateTo(`/BF-PA/PP/PD/detail/${actionData.rujukan}?role=${currentRole.value}`);
};

// PA-PP-PD-01_04: Edit Form - Borang Kemaskini Maklumat Penolong Amil
const handleEdit = (actionData) => {
          navigateTo(`/BF-PA/PP/PD/edit/${actionData.rujukan}`);
};

// PA-PP-PD-04_02: Executive Detail - Paparan Terperinci Sokongan
const handleSupport = (actionData) => {
          navigateTo(`/BF-PA/PP/PD/eksekutif/detail/${actionData.rujukan}`);
};

// PA-PP-PD-05_02: Department Head Detail - Paparan Terperinci Pengesahan
const handleConfirm = (actionData) => {
          navigateTo(`/BF-PA/PP/PD/ketua-jabatan/detail/${actionData.rujukan}`);
};

// PA-PP-PD-06_02: Division Head Detail - Paparan Terperinci Kelulusan
const handleApprove = (actionData) => {
          navigateTo(`/BF-PA/PP/PD/ketua-divisyen/detail/${actionData.rujukan}`);
};

// PA-PP-PD-03_02: PT Review Detail - Paparan Terperinci Semakan Dokumen
const handleReview = (actionData) => {
          navigateTo(`/BF-PA/PP/PD/PT/detail/${actionData.rujukan}`);
};

// PA-PP-PD-04_02: Risk Analysis Detail - Paparan Terperinci Saringan Risiko
const handleRiskAnalysis = (actionData) => {
          navigateTo(`/BF-PA/PP/PD/jabatan-risiko/detail/${actionData.rujukan}`);
};

// PA-PP-PD-01_02 (Complete): Complete Detail View - Maklumat Penolong Amil Lengkap
const handleViewComplete = (actionData) => {
          navigateTo(`/BF-PA/PP/PD/detail-complete/${actionData.rujukan}`);
};

// PA-PP-PD-01_04: Process Trace - Jejak Proses Pendaftaran
const handleViewProcessTrace = (actionData) => {
          navigateTo(`/BF-PA/PP/PD/process-trace/${actionData.rujukan}`);
};

// PA-PP-PD-01_05: Service History - Sejarah Perkhidmatan
const handleViewServiceHistory = (actionData) => {
          navigateTo(`/BF-PA/PP/PD/service-history/${actionData.rujukan}`);
};

// Watch for page size changes to reset current page
watch(pageSize, () => {
  currentPage.value = 1;
});

// Watch for role changes and adjust active tab
watch(currentRole, (newRole) => {
  const validTabs = getValidTabsForRole(newRole);
  if (validTabs.length > 0) {
    activeTab.value = validTabs[0];
  }
  currentPage.value = 1; // Reset to first page
  refreshTable();
});

// Watch for tab changes and reset pagination
watch(activeTab, () => {
  currentPage.value = 1; // Reset to first page when switching tabs
});

// Initialize with best available tab
onMounted(() => {
  const validTabs = getValidTabsForRole(currentRole.value);
  if (validTabs.length > 0) {
    activeTab.value = validTabs[0];
  }
});

// Bulk operations functions for eksekutif-pengurusan-risiko
const openBulkScreeningModal = () => {
  selectedScreeningItems.value = getTableDataByStatus(['Belum Disaring']);
  selectedScreeningMap.value = {};
  selectedScreeningItems.value.forEach(item => {
    selectedScreeningMap.value[item.rujukan] = true;
  });
  showBulkScreeningModal.value = true;
};

const closeBulkScreeningModal = () => {
  showBulkScreeningModal.value = false;
  selectedScreeningItems.value = [];
  selectedScreeningMap.value = {};
  bulkScreeningNotes.value = "";
};

const performBulkScreening = async () => {
  if (!bulkScreeningNotes.value.trim()) {
    return;
  }
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update only checked items
    const toScreen = selectedScreeningItems.value.filter(item => selectedScreeningMap.value[item.rujukan]);
    if (toScreen.length === 0) {
      return;
    }
    
    // Update status to "Telah Disaring" for selected items
    toScreen.forEach(item => {
      // Find and update the item in the role-specific data
      const roleData = roleSpecificData[currentRole.value] || [];
      const index = roleData.findIndex(app => app.rujukan === item.rujukan);
      if (index !== -1) {
        roleData[index].statusPendaftaran = "Telah Disaring";
      }
    });
    
    closeBulkScreeningModal();
    refreshTable();
  } catch (error) {
    // Handle error silently
  }
};

const openBulkExportModal = () => {
  selectedExportItems.value = getTableDataByStatus(['Telah Disaring']).filter(item => 
    selectedRows.value.includes(item.rujukan)
  );
  selectedExportMap.value = {};
  selectedExportItems.value.forEach(item => {
    selectedExportMap.value[item.rujukan] = true;
  });
  showBulkExportModal.value = true;
};

const closeBulkExportModal = () => {
  showBulkExportModal.value = false;
  selectedExportItems.value = [];
  selectedExportMap.value = {};
  bulkExportFormat.value = "PDF";
};

const performBulkExport = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get selected items for export
    const toExport = selectedExportItems.value.filter(item => selectedExportMap.value[item.rujukan]);
    if (toExport.length === 0) {
      return;
    }
    
    // Generate export URLs based on Rujukan ID
    toExport.forEach(item => {
      const exportUrl = `/export/application-form/${item.rujukan}?format=${bulkExportFormat.value}`;
      // Open export URL in new tab
      window.open(exportUrl, '_blank');
    });
    
    closeBulkExportModal();
  } catch (error) {
    // Handle error silently
  }
};

// Single export function
const exportApplication = (rujukanId) => {
  const exportUrl = `/export/application-form/${rujukanId}?format=PDF`;
  window.open(exportUrl, '_blank');
};

// Bulk approval functions for ketua-divisyen
const openBulkApprovalModal = () => {
  selectedScreeningItems.value = getTableDataByStatus(['Menunggu Kelulusan']);
  selectedScreeningMap.value = {};
  selectedScreeningItems.value.forEach(item => {
    selectedScreeningMap.value[item.rujukan] = true;
  });
  showBulkApprovalModal.value = true;
};

const closeBulkApprovalModal = () => {
  showBulkApprovalModal.value = false;
  selectedScreeningItems.value = [];
  selectedScreeningMap.value = {};
  bulkScreeningNotes.value = "";
};

const performBulkApproval = async () => {
  if (!bulkScreeningNotes.value.trim()) {
    return;
  }
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update only checked items
    const toApprove = selectedScreeningItems.value.filter(item => selectedScreeningMap.value[item.rujukan]);
    if (toApprove.length === 0) {
      return;
    }
    
    // Update status to "Lulus" for selected items
    toApprove.forEach(item => {
      // Find and update the item in the role-specific data
      const roleData = roleSpecificData[currentRole.value] || [];
      const index = roleData.findIndex(app => app.rujukan === item.rujukan);
      if (index !== -1) {
        roleData[index].statusPendaftaran = "Lulus";
      }
    });
    
    closeBulkApprovalModal();
    refreshTable();
  } catch (error) {
    // Handle error silently
  }
};

// Toggle select all function
const toggleSelectAll = () => {
  const allItems = getTableDataByStatus(['Belum Disaring']);
  if (selectedRows.value.length === allItems.length) {
    // If all are selected, deselect all
    selectedRows.value = [];
  } else {
    // If not all are selected, select all
    selectedRows.value = allItems.map(item => item.rujukan);
  }
};

</script>

<style scoped>
/* Custom styles for RTMF compliance */
</style> 

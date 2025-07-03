<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header Notice -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div class="flex items-center gap-2">
        <Icon name="ic:baseline-search" class="text-blue-600" />
        <div class="text-sm text-blue-800">
          <p class="font-medium">Carian Rekod Audit Trail</p>
          <p>Gunakan parameter carian di bawah untuk mencari rekod audit trail yang spesifik. Sekurang-kurangnya tarikh mula dan tamat diperlukan.</p>
        </div>
      </div>
    </div>

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <h2 class="text-xl font-semibold">Carian Rekod Audit Trail</h2>
            <rs-badge v-if="searchResults.length > 0" variant="success">{{ searchResults.length }} rekod ditemui</rs-badge>
          </div>
          <div class="flex gap-2">
            <rs-button
              variant="outline"
              @click="navigateToDashboard"
            >
              <Icon name="ic:baseline-home" class="mr-1" />
              Dashboard Utama
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Section 1: Parameter Carian Audit (Filter Panel) -->
        <div class="mb-6">
          <rs-card>
            <template #header>
              <div class="flex items-center gap-2">
                <rs-badge variant="info">Section 1</rs-badge>
                <h3 class="text-lg font-semibold">Parameter Carian Audit</h3>
                <rs-badge variant="warning" size="sm">Sekurang-kurangnya tarikh diperlukan</rs-badge>
              </div>
            </template>
            <template #body>
              <div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <!-- Required Date Range -->
                  <div class="col-span-1 md:col-span-2 lg:col-span-3">
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <p class="text-sm text-yellow-800 font-medium">Tempoh Carian (Wajib)</p>
                      <p class="text-xs text-yellow-700">Sila masukkan tarikh mula dan tamat untuk carian rekod audit trail.</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormKit
                        type="date"
                        name="tarikhMula"
                        label="Tarikh Mula *"
                        v-model="searchForm.tarikhMula"
                        validation="required"
                        help="Tarikh mula untuk carian rekod (Wajib)"
                        :validation-messages="{
                          required: 'Tarikh mula mesti diisi'
                        }"
                      />
                      <FormKit
                        type="date"
                        name="tarikhTamat"
                        label="Tarikh Tamat *"
                        v-model="searchForm.tarikhTamat"
                        validation="required"
                        help="Tarikh tamat mesti selepas atau sama dengan tarikh mula (Wajib)"
                        :validation-messages="{
                          required: 'Tarikh tamat mesti diisi'
                        }"
                      />
                    </div>
                  </div>

                  <!-- Optional Filters -->
                  <div class="col-span-1 md:col-span-2 lg:col-span-3">
                    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                      <p class="text-sm text-gray-700 font-medium">Penapis Tambahan (Pilihan)</p>
                      <p class="text-xs text-gray-600">Penapis di bawah adalah pilihan untuk memperhalusi hasil carian.</p>
                    </div>
                  </div>

                  <!-- User Search with Autocomplete Simulation -->
                  <FormKit
                    type="text"
                    name="namaPengguna"
                    label="Nama Pengguna"
                    v-model="searchForm.namaPengguna"
                    placeholder="Cari nama pengguna... (cth: AdminICT01)"
                    help="Cari berdasarkan nama pengguna (Pilihan)"
                    @input="onUserSearch"
                  />

                  <!-- MyKad / Foreign ID Search -->
                  <FormKit
                    type="text"
                    name="noKpForeignId"
                    label="No. MyKad / Foreign ID"
                    v-model="searchForm.noKpForeignId"
                    placeholder="Cari berdasarkan IC... (cth: 800101015432)"
                    help="Cari rekod berdasarkan No. MyKad atau Foreign ID pengguna (Pilihan)"
                    @input="onIdSearch"
                  />

                  <!-- Module Dropdown -->
                  <FormKit
                    type="select"
                    name="modul"
                    label="Modul Sistem"
                    v-model="searchForm.modul"
                    :options="moduleOptions"
                    @change="onModuleChange"
                    help="Pilih modul sistem untuk penapis"
                  />

                  <!-- Sub Module (Dependent Dropdown) -->
                  <FormKit
                    type="select"
                    name="subModul"
                    label="Sub Modul"
                    v-model="searchForm.subModul"
                    :options="subModuleOptions"
                    :disabled="!searchForm.modul"
                    help="Sub modul akan diisi berdasarkan modul yang dipilih"
                  />

                  <!-- Action Type -->
                  <FormKit
                    type="select"
                    name="jenisTindakan"
                    label="Jenis Tindakan"
                    v-model="searchForm.jenisTindakan"
                    :options="actionOptions"
                    help="Pilih jenis tindakan untuk penapis"
                  />
                </div>

                <!-- Section 2: Tindakan Carian (Button Actions) -->
                <div class="mt-8 border-t pt-6">
                  <div class="flex items-center gap-2 mb-4">
                    <rs-badge variant="success">Section 2</rs-badge>
                    <h4 class="font-medium">Tindakan Carian</h4>
                  </div>
                  
                  <div class="flex justify-between items-center">
                    <!-- Search Summary -->
                    <div class="text-sm text-gray-600">
                      <p>
                        <Icon name="ic:baseline-info" class="inline text-blue-500 mr-1" />
                        Klik "Cari" untuk melihat data audit trail
                      </p>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-3">
                      <rs-button
                        type="button"
                        variant="outline"
                        @click="resetSearch"
                        :disabled="isSearching"
                      >
                        <Icon name="ic:baseline-clear" class="mr-1" />
                        Reset
                      </rs-button>
                      <rs-button
                        type="button"
                        variant="primary"
                        :loading="isSearching"
                        @click="performSearch"
                      >
                        <Icon v-if="!isSearching" name="ic:baseline-search" class="mr-1" />
                        <Icon v-if="isSearching" name="ic:baseline-sync" class="mr-1 animate-spin" />
                        {{ isSearching ? 'Mencari...' : 'Cari' }}
                      </rs-button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </div>

        <!-- Section 3: Paparan Keputusan Audit Trail (Results Table) -->
        <div v-if="hasSearched && searchResults.length > 0" class="mb-6">
          <!-- Statistics Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg stats-card fade-in">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-blue-100 text-sm">Jumlah Rekod</p>
                  <p class="text-2xl font-bold">{{ searchResults.length }}</p>
                </div>
                <Icon name="ic:baseline-assessment" class="w-8 h-8 text-blue-200" />
              </div>
            </div>
            <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg stats-card fade-in">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-green-100 text-sm">Rekod Berjaya</p>
                  <p class="text-2xl font-bold">{{ successfulActions }}</p>
                </div>
                <Icon name="ic:baseline-check-circle" class="w-8 h-8 text-green-200" />
              </div>
            </div>
            <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg stats-card fade-in">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-orange-100 text-sm">Pengguna Unik</p>
                  <p class="text-2xl font-bold">{{ uniqueUsers }}</p>
                </div>
                <Icon name="ic:baseline-people" class="w-8 h-8 text-orange-200" />
              </div>
            </div>
            <div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg stats-card fade-in">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-purple-100 text-sm">Modul Aktif</p>
                  <p class="text-2xl font-bold">{{ activeModules }}</p>
                </div>
                <Icon name="ic:baseline-widgets" class="w-8 h-8 text-purple-200" />
              </div>
            </div>
          </div>

          <rs-card>
            <template #header>
              <div class="flex items-center gap-2">
                <rs-badge variant="success">Section 3</rs-badge>
                <h3 class="text-lg font-semibold">Paparan Keputusan Audit Trail</h3>
                <rs-badge variant="info" size="sm">{{ searchResults.length }} rekod</rs-badge>
                <div class="ml-auto flex gap-2">
                  <rs-button variant="outline" size="sm" @click="refreshResults">
                    <Icon name="ic:baseline-refresh" class="mr-1" />
                    Muat Semula
                  </rs-button>
                </div>
              </div>
            </template>
            <template #body>
              <!-- Search Criteria Summary -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div class="flex items-center gap-2 mb-3">
                  <rs-badge variant="info">Kriteria Carian</rs-badge>
                  <h4 class="font-medium">Parameter yang digunakan untuk carian ini:</h4>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span class="text-gray-600 font-medium">Tempoh:</span>
                    <p>{{ searchForm.tarikhMula }} hingga {{ searchForm.tarikhTamat }}</p>
                  </div>
                  <div v-if="searchForm.namaPengguna">
                    <span class="text-gray-600 font-medium">Pengguna:</span>
                    <p>{{ searchForm.namaPengguna }}</p>
                  </div>
                  <div v-if="searchForm.noKpForeignId">
                    <span class="text-gray-600 font-medium">MyKad/Foreign ID:</span>
                    <p>{{ searchForm.noKpForeignId }}</p>
                  </div>
                  <div v-if="searchForm.modul">
                    <span class="text-gray-600 font-medium">Modul:</span>
                    <p>{{ searchForm.modul }}</p>
                  </div>
                  <div v-if="searchForm.subModul">
                    <span class="text-gray-600 font-medium">Sub Modul:</span>
                    <p>{{ searchForm.subModul }}</p>
                  </div>
                  <div v-if="searchForm.jenisTindakan">
                    <span class="text-gray-600 font-medium">Tindakan:</span>
                    <p>{{ searchForm.jenisTindakan }}</p>
                  </div>
                </div>
              </div>

              <!-- Audit Trail Table -->
              <div class="overflow-x-auto">
                <table class="min-w-full table-auto border-collapse border border-gray-300">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="border border-gray-300 px-4 py-2 text-left cursor-pointer hover:bg-gray-100" @click="sortBy('timestamp')">
                        Tarikh & Masa Tindakan
                        <Icon name="ic:baseline-sort" class="inline ml-1" size="16" />
                      </th>
                      <th class="border border-gray-300 px-4 py-2 text-left">Nama Pengguna</th>
                      <th class="border border-gray-300 px-4 py-2 text-left">Modul Sistem</th>
                      <th class="border border-gray-300 px-4 py-2 text-left">Sub Modul</th>
                      <th class="border border-gray-300 px-4 py-2 text-left">Jenis Tindakan</th>
                      <th class="border border-gray-300 px-4 py-2 text-left">Ringkasan</th>
                      <th class="border border-gray-300 px-4 py-2 text-center">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(log, index) in paginatedResults" :key="log.recordId" class="table-row-hover">
                      <td class="border border-gray-300 px-4 py-2">{{ log.timestamp }}</td>
                      <td class="border border-gray-300 px-4 py-2">
                        <div class="flex items-center gap-2">
                          <span class="font-medium">{{ log.username }}</span>
                          <rs-badge :variant="getUserRoleBadgeVariant(log.userRole)" size="sm">{{ log.userRole }}</rs-badge>
                        </div>
                      </td>
                      <td class="border border-gray-300 px-4 py-2">{{ log.module }}</td>
                      <td class="border border-gray-300 px-4 py-2">{{ log.subModule }}</td>
                      <td class="border border-gray-300 px-4 py-2">
                        <rs-badge :variant="getActionBadgeVariant(log.action)">{{ log.action }}</rs-badge>
                      </td>
                      <td class="border border-gray-300 px-4 py-2">
                        <span class="text-sm">{{ truncateText(log.summary, 100) }}</span>
                      </td>
                      <td class="border border-gray-300 px-4 py-2 text-center">
                        <rs-button
                          variant="primary-outline"
                          size="sm"
                          @click="viewAuditDetail(log)"
                        >
                          Lihat Perincian
                        </rs-button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <div v-if="searchResults.length > 0" class="mt-6 flex justify-between items-center">
                <div class="text-sm text-gray-600">
                  Menunjukkan {{ ((currentPage - 1) * pageSize) + 1 }} hingga {{ Math.min(currentPage * pageSize, searchResults.length) }} daripada {{ searchResults.length }} rekod
                </div>
                <div class="flex gap-2">
                  <rs-button
                    variant="outline"
                    size="sm"
                    @click="currentPage--"
                    :disabled="currentPage === 1"
                  >
                    Sebelum
                  </rs-button>
                  <span class="px-4 py-2 text-sm">Halaman {{ currentPage }} daripada {{ totalPages }}</span>
                  <rs-button
                    variant="outline"
                    size="sm"
                    @click="currentPage++"
                    :disabled="currentPage === totalPages"
                  >
                    Seterusnya
                  </rs-button>
                </div>
              </div>

              <!-- Export Section -->
              <div v-if="searchResults.length > 0" class="border-t pt-6 mt-6">
                <div class="flex items-center gap-2 mb-4">
                  <rs-badge variant="warning">Cetakan & Eksport</rs-badge>
                  <h4 class="font-medium">Eksport Hasil Carian</h4>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm text-gray-700 mb-4">
                    Eksport hasil carian untuk tujuan audit ICT, laporan kepada Lembaga Tadbir Urus, atau dokumentasi insiden keselamatan.
                  </p>
                  <div class="flex gap-3">
                    <rs-button
                      variant="success-outline"
                      @click="exportToPDF"
                      :disabled="!canExport"
                    >
                      <Icon name="ic:baseline-picture-as-pdf" class="mr-1" />
                      Cetak PDF
                    </rs-button>
                    <rs-button
                      variant="info-outline"
                      @click="exportToExcel"
                      :disabled="!canExport"
                    >
                      <Icon name="ic:baseline-table-view" class="mr-1" />
                      Eksport Excel
                    </rs-button>
                  </div>
                  <p v-if="!canExport" class="text-xs text-red-600 mt-2">
                    <Icon name="ic:baseline-warning" class="inline mr-1" />
                    Eksport hanya dibenarkan untuk peranan Admin, NAS, atau Audit
                  </p>
                </div>
              </div>
            </template>
          </rs-card>
        </div>

        <!-- No Results Message -->
        <div v-if="hasSearched && searchResults.length === 0" class="text-center py-12">
          <rs-card class="max-w-md mx-auto">
            <template #body>
              <div class="py-8">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="ic:baseline-search-off" size="40" class="text-gray-400" />
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Tiada Rekod Ditemui</h3>
                <p class="text-gray-600 mb-6">Tiada rekod audit trail yang sepadan dengan kriteria carian yang diberikan.</p>
                
                <div class="bg-blue-50 p-4 rounded-lg mb-6 text-left">
                  <h4 class="font-semibold text-blue-900 mb-2">💡 Cadangan untuk carian:</h4>
                  <ul class="text-sm text-blue-800 space-y-1">
                    <li>• Luaskan julat tarikh carian</li>
                    <li>• Kurangkan penapis yang digunakan</li>
                    <li>• Semak ejaan nama pengguna</li>
                    <li>• Cuba cari menggunakan modul berbeza</li>
                  </ul>
                </div>
                
                <div class="flex gap-3 justify-center">
                  <rs-button variant="outline" @click="resetSearch">
                    <Icon name="ic:baseline-refresh" class="mr-1" />
                    Reset Carian
                  </rs-button>
                  <rs-button variant="primary" @click="performSearch">
                    <Icon name="ic:baseline-search" class="mr-1" />
                    Cuba Semula
                  </rs-button>
                </div>
              </div>
            </template>
          </rs-card>
        </div>

        <!-- Search Instructions (shown when no search has been performed) -->
        <div v-if="!hasSearched" class="text-center py-8 text-gray-500">
          <Icon name="ic:baseline-info" size="48" class="mx-auto mb-4 text-gray-300" />
          <p class="text-lg font-medium mb-2">Panduan Carian</p>
          <div class="text-sm space-y-1 max-w-md mx-auto">
            <p>1. Masukkan tarikh mula dan tamat (Wajib)</p>
            <p>2. Pilih penapis tambahan mengikut keperluan</p>
            <p>3. Klik "Cari" untuk melihat keputusan</p>
            <p>4. Keputusan akan dipaparkan di bawah</p>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Modal: Lihat Perincian Audit -->
    <rs-modal
      v-model="showDetailModal"
      title="Perincian Log Audit"
      size="xl"
      position="center"
    >
      <template #body>
        <div v-if="selectedAuditLog" class="space-y-6">
          <!-- Basic Information -->
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-medium mb-3 flex items-center">
              <Icon name="ic:baseline-info" class="mr-2" />
              Maklumat Asas
            </h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ID Rekod</label>
                <p class="font-mono text-sm bg-white p-2 rounded border">{{ selectedAuditLog.recordId }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh & Masa</label>
                <p class="bg-white p-2 rounded border">{{ selectedAuditLog.timestamp }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Pengguna</label>
                <div class="flex items-center gap-2 bg-white p-2 rounded border">
                  <span>{{ selectedAuditLog.username }}</span>
                  <rs-badge :variant="getUserRoleBadgeVariant(selectedAuditLog.userRole)">{{ selectedAuditLog.userRole }}</rs-badge>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">MyKad / Foreign ID</label>
                <p class="font-mono text-sm bg-white p-2 rounded border">{{ selectedAuditLog.userIdNumber }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Tindakan</label>
                <div class="bg-white p-2 rounded border">
                  <rs-badge :variant="getActionBadgeVariant(selectedAuditLog.action)">{{ selectedAuditLog.action }}</rs-badge>
                </div>
              </div>
            </div>
          </div>

          <!-- Module Information -->
          <div>
            <h4 class="font-medium mb-3 flex items-center">
              <Icon name="ic:baseline-widgets" class="mr-2" />
              Maklumat Modul
            </h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Modul</label>
                <p class="bg-gray-50 p-2 rounded border">{{ selectedAuditLog.module }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Sub Modul</label>
                <p class="bg-gray-50 p-2 rounded border">{{ selectedAuditLog.subModule }}</p>
              </div>
            </div>
          </div>

          <!-- Action Details -->
          <div>
            <h4 class="font-medium mb-3 flex items-center">
              <Icon name="ic:baseline-description" class="mr-2" />
              Perincian Tindakan
            </h4>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ringkasan Tindakan</label>
              <p class="text-sm bg-gray-50 p-3 rounded border">{{ selectedAuditLog.summary }}</p>
            </div>
          </div>

          <!-- Data Changes (Conditional Display) -->
          <div v-if="selectedAuditLog.dataBefore || selectedAuditLog.dataAfter">
            <h4 class="font-medium mb-3 flex items-center">
              <Icon name="ic:baseline-compare-arrows" class="mr-2" />
              Perubahan Data
            </h4>
            
            <!-- Data Sebelum (if applicable) -->
            <div v-if="selectedAuditLog.dataBefore && selectedAuditLog.action !== 'Tambah'" class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Data Sebelum</label>
              <pre class="text-xs bg-red-50 border border-red-200 p-3 rounded overflow-x-auto max-h-32">{{ formatJsonData(selectedAuditLog.dataBefore) }}</pre>
            </div>

            <!-- Data Selepas (if applicable) -->
            <div v-if="selectedAuditLog.dataAfter && selectedAuditLog.action !== 'Padam'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Data Selepas</label>
              <pre class="text-xs bg-green-50 border border-green-200 p-3 rounded overflow-x-auto max-h-32">{{ formatJsonData(selectedAuditLog.dataAfter) }}</pre>
            </div>
          </div>

          <!-- Technical Details -->
          <div class="border-t pt-4">
            <h4 class="font-medium mb-3 flex items-center">
              <Icon name="ic:baseline-computer" class="mr-2" />
              Maklumat Teknikal
            </h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label class="block text-gray-600 font-medium">IP Address</label>
                <p class="font-mono bg-gray-50 p-2 rounded border">{{ selectedAuditLog.ipAddress }}</p>
              </div>
              <div>
                <label class="block text-gray-600 font-medium">Session ID</label>
                <p class="font-mono bg-gray-50 p-2 rounded border">{{ selectedAuditLog.sessionId }}</p>
              </div>
              <div class="col-span-2">
                <label class="block text-gray-600 font-medium">User Agent</label>
                <p class="text-xs bg-gray-50 p-2 rounded border">{{ selectedAuditLog.userAgent }}</p>
              </div>
                              <div>
                  <label class="block text-gray-600 font-medium">Status</label>
                  <rs-badge :variant="selectedAuditLog.status === 'Success' ? 'success' : 'danger'">
                    {{ selectedAuditLog.status }}
                  </rs-badge>
                </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button 
            variant="primary-outline" 
            @click="showDetailModal = false"
          >
            Tutup
          </rs-button>
          <rs-button
            variant="primary" 
            @click="exportSingleRecord"
            :disabled="!canExport"
          >
            <Icon name="ic:baseline-download" class="mr-1" />
            Eksport Rekod
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Success Modal for Search Results -->
    <rs-modal
      v-model="showSearchSuccessModal"
      title="Carian Berjaya"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center py-6">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="ic:baseline-check-circle" class="w-8 h-8 text-green-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Carian Selesai!</h3>
          <p class="text-gray-600 mb-4">{{ searchResultMessage }}</p>
          <div class="bg-blue-50 p-3 rounded-lg text-sm">
            <p class="font-medium text-blue-900">Hasil carian ditunjukkan di bawah</p>
            <p class="text-blue-700">Klik "Lihat Perincian" untuk maklumat terperinci</p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="showSearchSuccessModal = false">
            <Icon name="ic:baseline-visibility" class="mr-1" />
            Lihat Keputusan
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Export Success Modal -->
    <rs-modal
      v-model="showExportModal"
      title="Eksport Berjaya"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center py-6">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="ic:baseline-download-done" class="w-8 h-8 text-blue-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ exportModalTitle }}</h3>
          <p class="text-gray-600 mb-4">{{ exportModalMessage }}</p>
          
          <!-- Mock Progress Bar -->
          <div class="bg-gray-200 rounded-full h-2 mb-4">
            <div class="bg-blue-600 h-2 rounded-full transition-all duration-1000" :style="{ width: exportProgress + '%' }"></div>
          </div>
          
          <div class="bg-green-50 p-3 rounded-lg text-sm">
            <p class="font-medium text-green-900">📄 Fail siap untuk dimuat turun</p>
            <p class="text-green-700">Format: {{ exportFormat }} | Saiz: ~{{ exportFileSize }}</p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center space-x-3">
          <rs-button variant="outline" @click="showExportModal = false">
            Tutup
          </rs-button>
          <rs-button variant="success" @click="simulateDownload">
            <Icon name="ic:baseline-download" class="mr-1" />
            Muat Turun
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Reset Confirmation Modal -->
    <rs-modal
      v-model="showResetModal"
      title="Pengesahan Reset"
      size="sm"
      position="center"
    >
      <template #body>
        <div class="text-center py-4">
          <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="ic:baseline-refresh" class="w-8 h-8 text-orange-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Reset Borang Carian</h3>
          <p class="text-gray-600 mb-4">Adakah anda pasti untuk mengosongkan semua parameter carian?</p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center space-x-3">
          <rs-button variant="outline" @click="showResetModal = false">
            Batal
          </rs-button>
          <rs-button variant="warning" @click="confirmReset">
            <Icon name="ic:baseline-clear-all" class="mr-1" />
            Ya, Reset
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Loading Overlay -->
    <div v-if="isSearching" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-sm mx-4">
        <div class="text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="ic:baseline-search" class="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Mencari Rekod Audit</h3>
          <p class="text-gray-600 mb-4">Sila tunggu sebentar...</p>
          
          <!-- Progress Steps -->
          <div class="space-y-2 text-left">
            <div class="flex items-center text-sm">
              <Icon name="ic:baseline-check-circle" class="w-4 h-4 text-green-500 mr-2" />
              <span class="text-green-700">Mengesahkan parameter carian</span>
            </div>
            <div class="flex items-center text-sm">
              <Icon name="ic:baseline-sync" class="w-4 h-4 text-blue-500 mr-2 animate-spin" />
              <span class="text-blue-700">Mencari dalam pangkalan data</span>
            </div>
            <div class="flex items-center text-sm text-gray-400">
              <Icon name="ic:baseline-radio-button-unchecked" class="w-4 h-4 mr-2" />
              <span>Menyusun keputusan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";

definePageMeta({
  title: "Carian Rekod Audit Trail",
});

// Composables
const { $toast } = useNuxtApp();

const breadcrumb = ref([
  {
    name: "Pentadbir Sistem",
    type: "link",
    path: "/BF-PS",
  },
  {
    name: "Carian Audit Trail",
    type: "current",
    path: "/BF-PS/CAT",
  },
]);

// State management
const searchForm = ref({
  tarikhMula: '',
  tarikhTamat: '',
  namaPengguna: '',
  noKpForeignId: '',
  modul: '',
  subModul: '',
  jenisTindakan: ''
});

const isSearching = ref(false);
const hasSearched = ref(false);
const searchResults = ref([]);
const selectedAuditLog = ref(null);
const showDetailModal = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const currentUserRole = ref('ADMIN');

// New modal state variables
const showSearchSuccessModal = ref(false);
const showExportModal = ref(false);
const showResetModal = ref(false);
const searchResultMessage = ref('');
const exportModalTitle = ref('');
const exportModalMessage = ref('');
const exportProgress = ref(0);
const exportFormat = ref('');
const exportFileSize = ref('');

// Options
const moduleOptions = [
  { label: "Semua Modul", value: "" },
  { label: "Profiling", value: "Profiling" },
  { label: "Pengurusan Bantuan", value: "Bantuan" },
  { label: "Pendaftaran", value: "Pendaftaran" },
  { label: "BDS", value: "BDS" },
  { label: "Pengurusan Tunai", value: "Tunai" },
  { label: "Pentadbir Sistem", value: "Pentadbir Sistem" }
];

const subModuleOptionsMap = {
  'Profiling': [
    { label: "Semua Sub Modul", value: "" },
    { label: "Pengguna", value: "Pengguna" },
    { label: "Maklumat Peribadi", value: "Maklumat Peribadi" },
    { label: "Dokumen", value: "Dokumen" }
  ],
  'Bantuan': [
    { label: "Semua Sub Modul", value: "" },
    { label: "Permohonan", value: "Permohonan" },
    { label: "Kelulusan", value: "Kelulusan" },
    { label: "Bayaran", value: "Bayaran" }
  ],
  'Pendaftaran': [
    { label: "Semua Sub Modul", value: "" },
    { label: "Pendaftaran Pantas", value: "Pendaftaran Pantas" },
    { label: "Pendaftaran Lengkap", value: "Pendaftaran Lengkap" },
    { label: "Kemaskini Data", value: "Kemaskini Data" }
  ],
  'BDS': [
    { label: "Semua Sub Modul", value: "" },
    { label: "Semakan Data", value: "Semakan Data" },
    { label: "Pengesahan", value: "Pengesahan" },
    { label: "Laporan", value: "Laporan" }
  ],
  'Tunai': [
    { label: "Semua Sub Modul", value: "" },
    { label: "Kutipan", value: "Kutipan" },
    { label: "Bayaran", value: "Bayaran" },
    { label: "Reconciliation", value: "Reconciliation" }
  ],
  'Pentadbir Sistem': [
    { label: "Semua Sub Modul", value: "" },
    { label: "Pengurusan Pengguna", value: "Pengurusan Pengguna" },
    { label: "Kebenaran", value: "Kebenaran" },
    { label: "Tetapan", value: "Tetapan" }
  ]
};

const actionOptions = [
  { label: "Semua Tindakan", value: "" },
  { label: "Tambah", value: "Tambah" },
  { label: "Kemaskini", value: "Kemaskini" },
  { label: "Padam", value: "Padam" },
  { label: "Lulus", value: "Lulus" },
  { label: "Tolak", value: "Tolak" }
];

// Computed properties
const subModuleOptions = computed(() => {
  return searchForm.value.modul 
    ? subModuleOptionsMap[searchForm.value.modul] || []
    : [{ label: "Pilih modul terlebih dahulu", value: "", disabled: true }];
});

const isSearchFormValid = computed(() => {
  return searchForm.value.tarikhMula && searchForm.value.tarikhTamat;
});

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return searchResults.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(searchResults.value.length / pageSize.value);
});

const canExport = computed(() => {
  return ['ADMIN', 'NAS', 'AUDIT'].includes(currentUserRole.value);
});

// Statistics computed properties for presentation
const successfulActions = computed(() => {
  return searchResults.value.filter(log => log.status === 'Success').length;
});

const uniqueUsers = computed(() => {
  const users = new Set(searchResults.value.map(log => log.username));
  return users.size;
});

const activeModules = computed(() => {
  const modules = new Set(searchResults.value.map(log => log.module));
  return modules.size;
});

// Methods
const generateMockAuditLogs = (criteria) => {
  const modules = ['Profiling', 'Bantuan', 'Pendaftaran', 'BDS', 'Tunai', 'Pentadbir Sistem'];
  const subModules = {
    'Profiling': ['Pengguna', 'Maklumat Peribadi', 'Dokumen'],
    'Bantuan': ['Permohonan', 'Kelulusan', 'Bayaran'],
    'Pendaftaran': ['Pendaftaran Pantas', 'Pendaftaran Lengkap', 'Kemaskini Data'],
    'BDS': ['Semakan Data', 'Pengesahan', 'Laporan'],
    'Tunai': ['Kutipan', 'Bayaran', 'Reconciliation'],
    'Pentadbir Sistem': ['Pengurusan Pengguna', 'Kebenaran', 'Tetapan']
  };
  const actions = ['Tambah', 'Kemaskini', 'Padam', 'Lulus', 'Tolak'];
  const users = [
    { name: 'AdminICT01', role: 'ADMIN', idNumber: '800101015432' },
    { name: 'NASAdmin02', role: 'NAS', idNumber: '850505025678' },
    { name: 'EKP03', role: 'EKP', idNumber: '820202036789' },
    { name: 'EOAD04', role: 'EOAD', idNumber: '870707047890' },
    { name: 'AuditOfficer01', role: 'AUDIT', idNumber: '830303038901' },
    { name: 'AhmadPentadbir', role: 'ADMIN', idNumber: '860606069012' },
    { name: 'SitiEKP', role: 'EKP', idNumber: 'A1234567B' }
  ];

  // Generate filtered logs based on criteria
  const allLogs = [];
  for (let i = 0; i < 50; i++) {
    const module = modules[Math.floor(Math.random() * modules.length)];
    const subModule = subModules[module][Math.floor(Math.random() * subModules[module].length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    date.setSeconds(Math.floor(Math.random() * 60));

    const recordId = `AT-${date.getFullYear()}-${String(1000 + i).padStart(4, '0')}`;

    // Generate realistic data changes for actions
    let dataBefore = null;
    let dataAfter = null;
    
    if (action === 'Kemaskini') {
      dataBefore = { status: 'Pending', amount: 1000, updatedBy: 'System' };
      dataAfter = { status: 'Approved', amount: 1200, updatedBy: user.name };
    } else if (action === 'Tambah') {
      dataAfter = { id: Math.floor(Math.random() * 1000), name: 'New Record', createdBy: user.name };
    } else if (action === 'Padam') {
      dataBefore = { id: Math.floor(Math.random() * 1000), name: 'Deleted Record', status: 'Active' };
    }

    allLogs.push({
      recordId,
      timestamp: date.toLocaleString('ms-MY'),
      timestampDate: date,
      username: user.name,
      userRole: user.role,
      userIdNumber: user.idNumber,
      module,
      subModule,
      action,
      summary: `${action} rekod dalam ${module} - ${subModule}. Tindakan dilakukan melalui sistem NAS oleh ${user.name}.`,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      sessionId: `sess_${Math.random().toString(36).substr(2, 16)}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: Math.random() > 0.1 ? 'Success' : 'Failed',
      dataBefore,
      dataAfter
    });
  }

  // Apply filters
  let filteredLogs = allLogs;

  // Filter by date range (required)
  if (criteria.tarikhMula && criteria.tarikhTamat) {
    const startDate = new Date(criteria.tarikhMula);
    const endDate = new Date(criteria.tarikhTamat);
    endDate.setHours(23, 59, 59, 999);
    
    filteredLogs = filteredLogs.filter(log => {
      const logDate = new Date(log.timestampDate);
      return logDate >= startDate && logDate <= endDate;
    });
  }

  // Filter by user name
  if (criteria.namaPengguna) {
    const query = criteria.namaPengguna.toLowerCase();
    filteredLogs = filteredLogs.filter(log => 
      log.username.toLowerCase().includes(query)
    );
  }

  // Filter by MyKad / Foreign ID
  if (criteria.noKpForeignId) {
    const query = criteria.noKpForeignId.toLowerCase();
    filteredLogs = filteredLogs.filter(log => 
      log.userIdNumber.toLowerCase().includes(query)
    );
  }

  // Filter by module
  if (criteria.modul) {
    filteredLogs = filteredLogs.filter(log => log.module === criteria.modul);
  }

  // Filter by sub module
  if (criteria.subModul) {
    filteredLogs = filteredLogs.filter(log => log.subModule === criteria.subModul);
  }

  // Filter by action type
  if (criteria.jenisTindakan) {
    filteredLogs = filteredLogs.filter(log => log.action === criteria.jenisTindakan);
  }

  return filteredLogs.sort((a, b) => new Date(b.timestampDate) - new Date(a.timestampDate));
};

const onModuleChange = () => {
  searchForm.value.subModul = '';
};

const onUserSearch = (value) => {
  // Mock autocomplete - in real implementation, this would fetch from API
  console.log('User search:', value);
};

const onIdSearch = (value) => {
  // Mock ID validation - in real implementation, this would validate format
  console.log('ID search:', value);
  
  // Basic validation feedback (optional enhancement)
  if (value && value.length > 0) {
    const isMyKadFormat = /^\d{12}$/.test(value);
    const isForeignIdFormat = /^[A-Z0-9]{6,}$/i.test(value);
    
    if (!isMyKadFormat && !isForeignIdFormat && value.length >= 6) {
      console.log('💡 Format hint: MyKad (12 digits) or Foreign ID (6+ alphanumeric)');
    }
  }
};

const resetSearch = () => {
  showResetModal.value = true;
};

const confirmReset = () => {
  searchForm.value = {
    tarikhMula: '',
    tarikhTamat: '',
    namaPengguna: '',
    noKpForeignId: '',
    modul: '',
    subModul: '',
    jenisTindakan: ''
  };
  
  searchResults.value = [];
  hasSearched.value = false;
  currentPage.value = 1;
  
  // Set default dates
  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  searchForm.value.tarikhTamat = today.toISOString().split('T')[0];
  searchForm.value.tarikhMula = weekAgo.toISOString().split('T')[0];
  
  showResetModal.value = false;
  
  console.log('📅 Form reset with default dates');
};

const performSearch = () => {
  console.log('🔍 Search button clicked - showing mock data!');
  
  // Set loading state with enhanced UX
  isSearching.value = true;
  
  // Simulate realistic search delay for presentation
  setTimeout(() => {
    // Generate mock data immediately
    const mockData = generateMockAuditLogs(searchForm.value);
    
    // Set results and show Section 3
    searchResults.value = mockData;
    hasSearched.value = true;
    currentPage.value = 1;
    
    // Prepare success message
    searchResultMessage.value = `${mockData.length} rekod audit trail ditemui berdasarkan kriteria carian yang ditetapkan.`;
    
    console.log('✅ Mock data loaded:', searchResultMessage.value);
    
    // Remove loading state and show success modal
    isSearching.value = false;
    showSearchSuccessModal.value = true;
  }, 1500); // Realistic delay for presentation effect
};

const sortBy = (field) => {
  console.log('Sorting by:', field);
  if (field === 'timestamp') {
    searchResults.value.sort((a, b) => new Date(b.timestampDate) - new Date(a.timestampDate));
  }
};

const truncateText = (text, length) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

const getUserRoleBadgeVariant = (role) => {
  const variants = {
    'ADMIN': 'danger',
    'NAS': 'primary',
    'EKP': 'info',
    'EOAD': 'success',
    'AUDIT': 'warning'
  };
  return variants[role] || 'default';
};

const getActionBadgeVariant = (action) => {
  const variants = {
    'Tambah': 'success',
    'Kemaskini': 'info',
    'Padam': 'danger',
    'Lulus': 'primary',
    'Tolak': 'warning'
  };
  return variants[action] || 'default';
};

const viewAuditDetail = (log) => {
  selectedAuditLog.value = log;
  showDetailModal.value = true;
  
  // Log modal access for audit purposes
  console.log('🔍 Modal opened for record:', log.recordId, 'by user:', currentUserRole.value);
};

const formatJsonData = (data) => {
  try {
    return JSON.stringify(data, null, 2);
  } catch (e) {
    return data;
  }
};

const exportToPDF = () => {
  if (!canExport.value) {
    exportModalTitle.value = 'Akses Ditolak';
    exportModalMessage.value = 'Eksport PDF hanya dibenarkan untuk peranan Admin, NAS, atau Audit.';
    showExportModal.value = true;
    return;
  }
  
  exportModalTitle.value = 'Eksport PDF Audit Trail';
  exportModalMessage.value = 'Laporan audit trail sedang dijana dalam format PDF untuk tujuan dokumentasi rasmi.';
  exportFormat.value = 'PDF';
  exportFileSize.value = '2.4 MB';
  
  // Simulate progress
  exportProgress.value = 0;
  showExportModal.value = true;
  
  const progressInterval = setInterval(() => {
    exportProgress.value += 20;
    if (exportProgress.value >= 100) {
      clearInterval(progressInterval);
    }
  }, 300);
  
  console.log('📄 PDF export initiated');
};

const exportToExcel = () => {
  if (!canExport.value) {
    exportModalTitle.value = 'Akses Ditolak';
    exportModalMessage.value = 'Eksport Excel hanya dibenarkan untuk peranan Admin, NAS, atau Audit.';
    showExportModal.value = true;
    return;
  }
  
  exportModalTitle.value = 'Eksport Excel Audit Trail';
  exportModalMessage.value = 'Data audit trail sedang dijana dalam format Excel untuk analisis lanjut.';
  exportFormat.value = 'XLSX';
  exportFileSize.value = '1.8 MB';
  
  // Simulate progress
  exportProgress.value = 0;
  showExportModal.value = true;
  
  const progressInterval = setInterval(() => {
    exportProgress.value += 25;
    if (exportProgress.value >= 100) {
      clearInterval(progressInterval);
    }
  }, 250);
  
  console.log('📊 Excel export initiated');
};

const exportSingleRecord = () => {
  if (!canExport.value) {
    exportModalTitle.value = 'Akses Ditolak';
    exportModalMessage.value = 'Eksport rekod hanya dibenarkan untuk peranan Admin, NAS, atau Audit.';
    showExportModal.value = true;
    return;
  }
  
  exportModalTitle.value = 'Eksport Rekod Tunggal';
  exportModalMessage.value = `Rekod audit ${selectedAuditLog.value.recordId} sedang dijana untuk eksport.`;
  exportFormat.value = 'PDF';
  exportFileSize.value = '245 KB';
  
  // Simulate progress
  exportProgress.value = 0;
  showDetailModal.value = false;
  showExportModal.value = true;
  
  const progressInterval = setInterval(() => {
    exportProgress.value += 33;
    if (exportProgress.value >= 100) {
      clearInterval(progressInterval);
    }
  }, 200);
  
  console.log('📄 Single record export:', selectedAuditLog.value.recordId);
};

const simulateDownload = () => {
  console.log(`💾 Simulating download: ${exportFormat.value} file (${exportFileSize.value})`);
  showExportModal.value = false;
  
  // Reset progress for next use
  exportProgress.value = 0;
};

const navigateToDashboard = () => {
  navigateTo('/BF-PS');
};

const refreshResults = () => {
  console.log('🔄 Refreshing search results...');
  
  // Brief loading state
  isSearching.value = true;
  
  setTimeout(() => {
    // Regenerate mock data with same criteria
    const refreshedData = generateMockAuditLogs(searchForm.value);
    searchResults.value = refreshedData;
    
    // Show success message
    searchResultMessage.value = `Data audit trail telah dimuat semula. ${refreshedData.length} rekod dikemaskini.`;
    showSearchSuccessModal.value = true;
    
    isSearching.value = false;
    console.log('✅ Results refreshed successfully');
  }, 1000);
};

// Initialize
onMounted(() => {
  console.log('📋 CAT Search component mounted');
  
  // Set default dates (last 7 days) for convenience
  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  searchForm.value.tarikhTamat = today.toISOString().split('T')[0];
  searchForm.value.tarikhMula = weekAgo.toISOString().split('T')[0];
  
  console.log('📅 Default dates set:', {
    tarikhMula: searchForm.value.tarikhMula,
    tarikhTamat: searchForm.value.tarikhTamat
  });
});
</script>

<style scoped>
.cursor-pointer:hover {
  background-color: #f3f4f6;
}

/* Form field focus states */
.formkit-outer[data-invalid] {
  border-color: #ef4444;
}

.formkit-outer[data-valid] {
  border-color: #10b981;
}

/* Presentation enhancements */
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.slide-up {
  animation: slideUp 0.6s ease-out;
}

.pulse-slow {
  animation: pulse 3s ease-in-out infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Statistics cards hover effects */
.stats-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Modal backdrop animation */
.modal-backdrop {
  backdrop-filter: blur(4px);
}

/* Button hover animations */
.btn-enhanced {
  transition: all 0.2s ease-in-out;
}

.btn-enhanced:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Progress bar animation */
.progress-bar {
  transition: width 0.3s ease-in-out;
}

/* Table row hover animation */
.table-row-hover {
  transition: all 0.2s ease-in-out;
}

.table-row-hover:hover {
  background-color: #f8fafc;
  transform: scale(1.002);
}
</style>
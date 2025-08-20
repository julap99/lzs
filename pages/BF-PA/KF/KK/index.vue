<!-- 
  RTMF SCREEN: PA-KF-KK-01_01 (Category List)
  PURPOSE: Senarai kategori penolong amil dengan workflow kelulusan
  DESCRIPTION: Category list with approval workflow for Penolong Amil categories
  ROUTE: /BF-PA/KF/KK
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

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold">Senarai Kategori Penolong Amil</h2>
            <p class="text-sm text-gray-600 mt-1">{{ getRoleSpecificDescription() }}</p>
          </div>
          <rs-button
            variant="primary"
            @click="navigateTo('/BF-PA/KF/KK/create')"
            v-if="canCreateCategory"
          >
            <Icon name="material-symbols:add" class="mr-1" /> Tambah Kategori Baru
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Smart Filter Section -->
        <div class="mb-6">
          <div class="flex flex-col md:flex-row gap-4 mb-4">
            <FormKit
              v-model="filters.searchQuery"
              type="text"
              placeholder="Cari kategori, kod singkatan, atau nama kategori..."
              :classes="{
                input: '!py-2',
              }"
              class="flex-1"
            />
            <FormKit
              v-model="filters.status"
              type="select"
              :options="statusOptions"
              placeholder="Status"
              :classes="{
                input: '!py-2',
              }"
              class="min-w-[200px]"
            />
            <FormKit
              v-model="filters.kategori"
              type="select"
              :options="kategoriOptions"
              placeholder="Kategori"
              :classes="{
                input: '!py-2',
              }"
              class="min-w-[200px]"
            />
            <rs-button
              variant="primary"
              @click="performSearch"
              class="flex items-center whitespace-nowrap"
            >
              <Icon name="ph:magnifying-glass" class="w-4 h-4 mr-2" />
              Cari
            </rs-button>
            <rs-button
              variant="secondary-outline"
              @click="clearSearch"
              class="flex items-center whitespace-nowrap"
            >
              <Icon name="ph:arrow-clockwise" class="w-4 h-4 mr-2" />
              Set Semula
            </rs-button>
          </div>
        </div>

        <!-- Tabbed Table Section -->
        <!-- Eksekutif Tabs -->
        <div v-if="currentRole === 'eksekutif'">
          <rs-tab v-model="activeTab" class="mt-4">
            <rs-tab-item title="Aktif">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-green-700 flex items-center">
                  <Icon name="ph:check-circle" class="mr-2" size="20" />
                  Senarai kategori yang telah aktif
                </h3>
                <rs-table
                  :key="`table-${tableKey}-active`"
                  :data="getTableDataByStatus(['Aktif'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
                  <template v-slot:status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">
                      {{ data.text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tarikhKuatkuasa="data">
                    <span v-if="data.text" class="text-sm text-gray-900">{{ data.text }}</span>
                    <span v-else class="text-sm text-gray-500 italic">Akan ditetapkan selepas kelulusan</span>
                  </template>

                  <template v-slot:tindakan="data">
                    <div class="flex space-x-2">
                      <rs-button
                        variant="primary"
                        size="sm"
                        class="!px-2 !py-1"
                        @click="viewCategory(data.text)"
                      >
                        Lihat
                      </rs-button>
                      <rs-button
                        v-if="canEditCategory(data.text)"
                        variant="secondary"
                        size="sm"
                        class="!px-2 !py-1"
                        @click="editCategory(data.text)"
                      >
                        Kemaskini
                      </rs-button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Sedang Proses">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-blue-700 flex items-center">
                  <Icon name="ph:clock" class="mr-2" size="20" />
                  Senarai kategori yang sedang dalam proses
                </h3>
                <rs-table
                  :key="`table-${tableKey}-process`"
                  :data="getTableDataByStatus(['Menunggu Pengesahan', 'Menunggu Kelulusan'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
                  <template v-slot:status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">
                      {{ data.text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tarikhKuatkuasa="data">
                    <span v-if="data.text" class="text-sm text-gray-900">{{ data.text }}</span>
                    <span v-else class="text-sm text-gray-500 italic">Akan ditetapkan selepas kelulusan</span>
                  </template>

                  <template v-slot:tindakan="data">
                    <div class="flex space-x-2">
                      <rs-button
                        variant="primary"
                        size="sm"
                        class="!px-2 !py-1"
                        @click="viewCategory(data.text)"
                      >
                        Lihat
                      </rs-button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Tidak Aktif">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-red-700 flex items-center">
                  <Icon name="ph:x-circle" class="mr-2" size="20" />
                  Senarai kategori yang tidak aktif
                </h3>
                <rs-table
                  :key="`table-${tableKey}-inactive`"
                  :data="getTableDataByStatus(['Tidak Aktif'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
                  <template v-slot:status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">
                      {{ data.text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tarikhKuatkuasa="data">
                    <span v-if="data.text" class="text-sm text-gray-900">{{ data.text }}</span>
                    <span v-else class="text-sm text-gray-500 italic">Akan ditetapkan selepas kelulusan</span>
                  </template>

                  <template v-slot:tindakan="data">
                    <div class="flex space-x-2">
                      <rs-button
                        variant="primary"
                        size="sm"
                        class="!px-2 !py-1"
                        @click="viewCategory(data.text)"
                      >
                        Lihat
                      </rs-button>
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
            <rs-tab-item title="Aktif">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-green-700 flex items-center">
                  <Icon name="ph:check-circle" class="mr-2" size="20" />
                  Senarai kategori yang telah aktif
                </h3>
                <rs-table
                  :key="`table-${tableKey}-active`"
                  :data="getTableDataByStatus(['Aktif'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
                  <template v-slot:status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">
                      {{ data.text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tarikhKuatkuasa="data">
                    <span v-if="data.text" class="text-sm text-gray-900">{{ data.text }}</span>
                    <span v-else class="text-sm text-gray-500 italic">Akan ditetapkan selepas kelulusan</span>
                  </template>

                  <template v-slot:tindakan="data">
                    <div class="flex space-x-2">
                      <rs-button
                        variant="primary"
                        size="sm"
                        class="!px-2 !py-1"
                        @click="viewCategory(data.text)"
                      >
                        Lihat
                      </rs-button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Menunggu Pengesahan">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-orange-700 flex items-center">
                  <Icon name="ph:clock" class="mr-2" size="20" />
                  Senarai kategori yang menunggu pengesahan
                </h3>
                <rs-table
                  :key="`table-${tableKey}-pending`"
                  :data="getTableDataByStatus(['Menunggu Pengesahan'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
                  <template v-slot:status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">
                      {{ data.text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tarikhKuatkuasa="data">
                    <span v-if="data.text" class="text-sm text-gray-900">{{ data.text }}</span>
                    <span v-else class="text-sm text-gray-500 italic">Akan ditetapkan selepas kelulusan</span>
                  </template>

                  <template v-slot:tindakan="data">
                    <div class="flex space-x-2">
                      <rs-button
                        variant="primary"
                        size="sm"
                        class="!px-2 !py-1"
                        @click="viewCategory(data.text)"
                      >
                        Lihat
                      </rs-button>
                      <rs-button
                        variant="warning"
                        size="sm"
                        class="!px-2 !py-1"
                        @click="navigateToVerification(data.text, 'verify')"
                      >
                        Sahkan
                      </rs-button>

                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Tidak Aktif">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-red-700 flex items-center">
                  <Icon name="ph:x-circle" class="mr-2" size="20" />
                  Senarai kategori yang tidak aktif
                </h3>
                <rs-table
                  :key="`table-${tableKey}-inactive`"
                  :data="getTableDataByStatus(['Tidak Aktif'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
                  <template v-slot:status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">
                      {{ data.text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tarikhKuatkuasa="data">
                    <span v-if="data.text" class="text-sm text-gray-900">{{ data.text }}</span>
                    <span v-else class="text-sm text-gray-500 italic">Akan ditetapkan selepas kelulusan</span>
                  </template>

                  <template v-slot:tindakan="data">
                    <div class="flex space-x-2">
                      <rs-button
                        variant="primary"
                        size="sm"
                        class="!px-2 !py-1"
                        @click="viewCategory(data.text)"
                      >
                        Lihat
                      </rs-button>
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
            <rs-tab-item title="Aktif">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-green-700 flex items-center">
                  <Icon name="ph:check-circle" class="mr-2" size="20" />
                  Senarai kategori yang telah aktif
                </h3>
                <rs-table
                  :key="`table-${tableKey}-active`"
                  :data="getTableDataByStatus(['Aktif'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
                  <template v-slot:status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">
                      {{ data.text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tarikhKuatkuasa="data">
                    <span v-if="data.text" class="text-sm text-gray-900">{{ data.text }}</span>
                    <span v-else class="text-sm text-gray-500 italic">Akan ditetapkan selepas kelulusan</span>
                  </template>

                  <template v-slot:tindakan="data">
                    <div class="flex space-x-2">
                      <rs-button
                        variant="primary"
                        size="sm"
                        class="!px-2 !py-1"
                        @click="viewCategory(data.text)"
                      >
                        Lihat
                      </rs-button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Sedang Proses - Lulus">
              <div class="p-4">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold text-green-700 flex items-center">
                    <Icon name="ph:check-circle" class="mr-2" size="20" />
                    Senarai kategori yang disahkan untuk kelulusan
                  </h3>
                  
                  <!-- Bulk Approval Button - Only in this tab -->
                  <div v-if="hasPendingApprovals" class="flex space-x-3">
                    <rs-button
                      variant="success"
                      @click="openBulkApprovalModal"
                      class="flex items-center"
                    >
                      <Icon name="ph:check-circle" class="w-4 h-4 mr-2" />
                      Lulus Semua ({{ pendingApprovalCount }})
                    </rs-button>
                  </div>
                </div>
                
                <rs-table
                  :key="`table-${tableKey}-approved-pending`"
                  :data="getTableDataByStatus(['Menunggu Kelulusan'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
                  <template v-slot:status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">
                      {{ data.text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tarikhKuatkuasa="data">
                    <span v-if="data.text" class="text-sm text-gray-900">{{ data.text }}</span>
                    <span v-else class="text-sm text-gray-500 italic">Akan ditetapkan selepas kelulusan</span>
                  </template>

                  <template v-slot:tindakan="data">
                    <div class="flex space-x-2">
                      <rs-button
                        variant="primary"
                        size="sm"
                        class="!px-2 !py-1"
                        @click="viewCategory(data.text)"
                      >
                        Lihat
                      </rs-button>
                      <rs-button
                        variant="success"
                        size="sm"
                        class="!px-2 !py-1"
                        @click="navigateToVerification(data.text, 'approve')"
                      >
                        Luluskan
                      </rs-button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Sedang Proses - Ditolak">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-orange-700 flex items-center">
                  <Icon name="ph:warning" class="mr-2" size="20" />
                  Senarai kategori yang ditolak oleh Ketua Jabatan
                </h3>
                
                <div class="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div class="flex items-start">
                    <Icon name="ph:info" class="w-5 h-5 text-orange-600 mr-3 mt-0.5" />
                    <div class="text-sm text-orange-800">
                      <p class="font-medium mb-1">Perhatian:</p>
                      <p>Sila semak setiap kategori yang ditolak secara individu untuk memahami sebab penolakan oleh Ketua Jabatan. Kelulusan beramai-ramai tidak disediakan untuk item yang telah ditolak.</p>
                    </div>
                  </div>
                </div>
                
                <rs-table
                  :key="`table-${tableKey}-rejected`"
                  :data="getTableDataByStatus(['Ditolak Ketua Jabatan'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
                  <template v-slot:status="data">
                    <rs-badge variant="warning">
                      {{ data.text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tarikhKuatkuasa="data">
                    <span v-if="data.text" class="text-sm text-gray-900">{{ data.text }}</span>
                    <span v-else class="text-sm text-gray-500 italic">Akan ditetapkan selepas kelulusan</span>
                  </template>

                  <template v-slot:tindakan="data">
                    <div class="flex space-x-2">
                      <rs-button
                        variant="primary"
                        size="sm"
                        class="!px-2 !py-1"
                        @click="viewCategory(data.text)"
                      >
                        Lihat
                      </rs-button>
                      <rs-button
                        variant="warning"
                        size="sm"
                        class="!px-2 !py-1"
                        @click="navigateToVerification(data.text, 'approve')"
                      >
                        Semak
                      </rs-button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Tidak Aktif">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-red-700 flex items-center">
                  <Icon name="ph:x-circle" class="mr-2" size="20" />
                  Senarai kategori yang tidak aktif
                </h3>
                <rs-table
                  :key="`table-${tableKey}-inactive`"
                  :data="getTableDataByStatus(['Tidak Aktif'])"
                  :pageSize="10"
                  :showNoColumn="false"
                  :columns="tableColumns"
                  :options="{
                    variant: 'default',
                    hover: true,
                  }"
                >
                  <template v-slot:status="data">
                    <rs-badge :variant="getStatusVariant(data.text)">
                      {{ data.text }}
                    </rs-badge>
                  </template>

                  <template v-slot:tarikhKuatkuasa="data">
                    <span v-if="data.text" class="text-sm text-gray-900">{{ data.text }}</span>
                    <span v-else class="text-sm text-gray-500 italic">Akan ditetapkan selepas kelulusan</span>
                  </template>

                  <template v-slot:tindakan="data">
                    <div class="flex space-x-2">
                      <rs-button
                        variant="primary"
                        size="sm"
                        class="!px-2 !py-1"
                        @click="viewCategory(data.text)"
                      >
                        Lihat
                      </rs-button>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>
          </rs-tab>
        </div>
      </template>
    </rs-card>
    
    <!-- Bulk Approval Modal -->
    <div v-if="showBulkApprovalModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ph:check-circle" class="w-6 h-6 mr-3 text-success" />
            Lulus Semua Kategori Yang Telah Disahkan
          </h3>
          <button
            @click="closeBulkApprovalModal"
            class="text-gray-400 hover:text-gray-600"
          >
            <Icon name="ph:x" class="w-6 h-6" />
          </button>
        </div>
        
        <div class="mb-4">
          <p class="text-gray-600 mb-2">
            Anda akan meluluskan <strong>{{ selectedItems.length }} kategori</strong> yang telah disahkan oleh Ketua Jabatan.
          </p>
          
          <!-- Selected Items Table -->
          <div class="border rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rujukan</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kategori</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kod Singkatan</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in selectedItems" :key="item.tindakan" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.rujukan }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.kategoriPenolongAmil }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.kodSingkatan }}</td>
                  <td class="px-4 py-3">
                    <rs-badge variant="info" size="sm">{{ item.status }}</rs-badge>
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
            v-model="bulkApprovalNotes"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Masukkan ulasan untuk kelulusan ini..."
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
            <Icon name="ph:check" class="w-4 h-4 mr-2" />
            Luluskan Semua ({{ selectedItems.length }})
          </rs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, computed, watch, onMounted } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();

definePageMeta({
  title: "Senarai Kategori Penolong Amil",
});

const breadcrumb = [
  { name: 'Laman Utama', path: '/' },
  { name: 'Modul BF-PA', path: '/BF-PA' },
  { name: 'Konfigurasi', path: '/BF-PA/KF' },
  { name: 'Maklumat Kategori', path: null }
];

// Role Simulator State
const currentRole = ref("eksekutif"); // Default role
const showRoleInfo = ref(false);

// Page-specific role options for KF/KK module
const roleOptions = [
  { name: "Eksekutif", value: "eksekutif" },
  { name: "Ketua Jabatan", value: "ketua-jabatan" },
  { name: "Ketua Divisyen", value: "ketua-divisyen" },
];

// Role data for KF/KK module
const roleData = {
  eksekutif: {
    name: "Eksekutif",
    description: "Tambah dan Kemaskini Kategori Penolong Amil",
    capabilities: ["Lihat Senarai", "Tambah Kategori", "Kemaskini Kategori", "Edit Penuh"],
  },
  "ketua-jabatan": {
    name: "Ketua Jabatan",
    description: "Pengesahan Kategori Penolong Amil",
    capabilities: ["Lihat Senarai", "Sahkan Kategori", "Monitor Progress"],
  },
  "ketua-divisyen": {
    name: "Ketua Divisyen",
    description: "Kelulusan Akhir Kategori Penolong Amil",
    capabilities: ["Lihat Senarai", "Luluskan Kategori", "Kelulusan Akhir"],
  },
};

// Role simulator helper functions
const getRoleVariant = (role) => {
  const variants = {
    eksekutif: "success",
    "ketua-jabatan": "warning",
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
  // Role changed
  
  // Show role change notification
  const roleLabel = getRoleLabel(currentRole.value);
  toast.info(`Peranan berubah kepada: ${roleLabel}`);
  
  // Refresh table to show role-specific data
  refreshTable();
};

const toggleRoleInfo = () => {
  showRoleInfo.value = !showRoleInfo.value;
};

// Filters
const filters = ref({
  searchQuery: "",
  status: "",
  kategori: "",
});

// Filter options
const statusOptions = [
  { name: "Sila pilih...", value: "" },
  { name: "Aktif", value: "Aktif" },
  { name: "Tidak Aktif", value: "Tidak Aktif" },
  { name: "Menunggu Pengesahan", value: "Menunggu Pengesahan" },
  { name: "Menunggu Kelulusan", value: "Menunggu Kelulusan" },
  { name: "Ditolak Ketua Jabatan", value: "Ditolak Ketua Jabatan" },
];

const kategoriOptions = [
  { name: "Sila pilih...", value: "" },
  { name: "Penolong Amil Fitrah", value: "Penolong Amil Fitrah" },
  { name: "Penolong Amil Padi", value: "Penolong Amil Padi" },
  { name: "Penolong Amil Kariah", value: "Penolong Amil Kariah" },
  { name: "Penolong Amil Komuniti", value: "Penolong Amil Komuniti" },
  { name: "Penolong Amil Wakaf", value: "Penolong Amil Wakaf" },
  { name: "Penolong Amil Zakat Perniagaan", value: "Penolong Amil Zakat Perniagaan" },
];

// Table data and reactivity control
const tableKey = ref(0);
const categoriesList = ref([
  {
    rujukan: "KK-2024-001",
    kategoriPenolongAmil: "Penolong Amil Fitrah",
    kodSingkatan: "PAF",
    status: "Aktif",
    tarikhKuatkuasa: "01-01-2024",
    tindakan: 1
  },
  {
    rujukan: "KK-2024-002",
    kategoriPenolongAmil: "Penolong Amil Padi",
    kodSingkatan: "PAP",
    status: "Aktif",
    tarikhKuatkuasa: "01-01-2024",
    tindakan: 2
  },
  {
    rujukan: "KK-2024-003",
    kategoriPenolongAmil: "Penolong Amil Kariah",
    kodSingkatan: "PAK",
    status: "Aktif",
    tarikhKuatkuasa: "01-01-2024",
    tindakan: 3
  },
  {
    rujukan: "KK-2024-004",
    kategoriPenolongAmil: "Penolong Amil Komuniti",
    kodSingkatan: "PK+",
    status: "Aktif",
    tarikhKuatkuasa: "01-01-2024",
    tindakan: 4
  },
  {
    rujukan: "KK-2024-005",
    kategoriPenolongAmil: "Penolong Amil Wakaf",
    kodSingkatan: "PAW",
    status: "Menunggu Kelulusan",
    tarikhKuatkuasa: "", // Empty - not yet approved
    tindakan: 5
  },
  {
    rujukan: "KK-2024-006",
    kategoriPenolongAmil: "Penolong Amil Zakat Perniagaan",
    kodSingkatan: "PAZP",
    status: "Tidak Aktif",
    tarikhKuatkuasa: "01-01-2024",
    tindakan: 6
  },
  // Additional items for "Sedang Proses - Lulus" to showcase bulk approval
  {
    rujukan: "KK-2024-007",
    kategoriPenolongAmil: "Penolong Amil Zakat Emas",
    kodSingkatan: "PAZE",
    status: "Menunggu Kelulusan",
    tarikhKuatkuasa: "", // Empty - not yet approved
    tindakan: 7
  },
  {
    rujukan: "KK-2024-008",
    kategoriPenolongAmil: "Penolong Amil Zakat Perkhidmatan",
    kodSingkatan: "PAZPH",
    status: "Menunggu Kelulusan",
    tarikhKuatkuasa: "", // Empty - not yet approved
    tindakan: 8
  },
  {
    rujukan: "KK-2024-009",
    kategoriPenolongAmil: "Penolong Amil Zakat Pelaburan",
    kodSingkatan: "PAZPL",
    status: "Menunggu Kelulusan",
    tarikhKuatkuasa: "", // Empty - not yet approved
    tindakan: 9
  },
  {
    rujukan: "KK-2024-010",
    kategoriPenolongAmil: "Penolong Amil Zakat Hartanah",
    kodSingkatan: "PAZH",
    status: "Menunggu Kelulusan",
    tarikhKuatkuasa: "", // Empty - not yet approved
    tindakan: 10
  },
  {
    rujukan: "KK-2024-011",
    kategoriPenolongAmil: "Penolong Amil Zakat Ternakan",
    kodSingkatan: "PAZT",
    status: "Menunggu Kelulusan",
    tarikhKuatkuasa: "", // Empty - not yet approved
    tindakan: 11
  }
]);

// Table columns
const tableColumns = [
  {
    key: 'rujukan',
    name: 'Rujukan',
    sortable: true,
  },
  {
    key: 'kategoriPenolongAmil',
    name: 'Kategori Penolong Amil',
    sortable: true,
  },
  {
    key: 'kodSingkatan',
    name: 'Kod Singkatan',
    sortable: true,
  },
  {
    key: 'status',
    name: 'Status',
    sortable: true,
  },
  {
    key: 'tarikhKuatkuasa',
    name: 'Tarikh Kuatkuasa',
    sortable: true,
  },
  {
    key: 'tindakan',
    name: 'Tindakan',
    sortable: false,
  },
];

// Tab management
const activeTab = ref("Aktif");

// Watch for role changes and adjust active tab
watch(currentRole, (newRole) => {
  const bestTab = getBestAvailableTabForRole.value;
  if (bestTab && isTabValidForRole(bestTab, newRole)) {
    activeTab.value = bestTab;
  } else {
    // Find first valid tab for the new role
    const validTabs = getValidTabsForRole(newRole);
    if (validTabs.length > 0) {
      activeTab.value = validTabs[0];
    }
  }
});

// Get the best available tab for the current role
const getBestAvailableTabForRole = computed(() => {
  const role = currentRole.value;
  
  if (role === 'ketua-jabatan') {
    // Ketua Jabatan can see: "Menunggu Pengesahan", "Aktif", "Tidak Aktif"
    // Priority: Aktif > Menunggu Pengesahan > Tidak Aktif
    if (getTableDataByStatus(['Aktif']).length > 0) {
      return "Aktif";
    } else if (getTableDataByStatus(['Menunggu Pengesahan']).length > 0) {
      return "Menunggu Pengesahan";
    } else {
      return "Tidak Aktif";
    }
  } else if (role === 'ketua-divisyen') {
    // Ketua Divisyen can see: "Sedang Proses - Lulus", "Aktif", "Sedang Proses - Ditolak", "Tidak Aktif"
    // Priority: Aktif > Sedang Proses - Lulus > Sedang Proses - Ditolak > Tidak Aktif
    if (getTableDataByStatus(['Aktif']).length > 0) {
      return "Aktif";
    } else if (getTableDataByStatus(['Menunggu Kelulusan']).length > 0) {
      return "Sedang Proses - Lulus";
    } else if (getTableDataByStatus(['Ditolak Ketua Jabatan']).length > 0) {
      return "Sedang Proses - Ditolak";
    } else {
      return "Tidak Aktif";
    }
  } else {
    // Eksekutif can see: "Aktif", "Sedang Proses", "Tidak Aktif"
    // Priority: Aktif > Sedang Proses > Tidak Aktif
    if (getTableDataByStatus(['Aktif']).length > 0) {
      return "Aktif";
    } else if (getTableDataByStatus(['Menunggu Pengesahan', 'Menunggu Kelulusan']).length > 0) {
      return "Sedang Proses";
    } else {
      return "Tidak Aktif";
    }
  }
});

// Check if a tab is valid for a specific role
const isTabValidForRole = (tab, role) => {
  switch (tab) {
    case "Sedang Proses":
      return role === 'eksekutif';
    case "Menunggu Pengesahan":
      return role === 'ketua-jabatan';
    case "Sedang Proses - Lulus":
      return role === 'ketua-divisyen';
    case "Sedang Proses - Ditolak":
      return role === 'ketua-divisyen';
    case "Aktif":
      return true; // All roles can see active items
    case "Tidak Aktif":
      return true; // All roles can see inactive items
    default:
      return false;
  }
};

// Get valid tabs for a specific role
const getValidTabsForRole = (role) => {
  if (role === 'eksekutif') {
    return ["Aktif", "Sedang Proses", "Tidak Aktif"];
  } else if (role === 'ketua-jabatan') {
    return ["Aktif", "Menunggu Pengesahan", "Tidak Aktif"];
  } else if (role === 'ketua-divisyen') {
    return ["Aktif", "Sedang Proses - Lulus", "Sedang Proses - Ditolak", "Tidak Aktif"];
  }
  return [];
};

// Filter table data based on status
const getTableDataByStatus = (statuses) => {
  let result = categoriesList.value.filter(category => 
    statuses.includes(category.status)
  );
  
  // Apply search filter
  if (filters.value.searchQuery) {
    const query = filters.value.searchQuery.toLowerCase();
    result = result.filter(category => 
      category.rujukan.toLowerCase().includes(query) ||
      category.kategoriPenolongAmil.toLowerCase().includes(query) ||
      category.kodSingkatan.toLowerCase().includes(query)
    );
  }
  
  // Apply status filter
  if (filters.value.status) {
    result = result.filter(category => 
      category.status === filters.value.status
    );
  }
  
  // Apply kategori filter
  if (filters.value.kategori) {
    result = result.filter(category => 
      category.kategoriPenolongAmil === filters.value.kategori
    );
  }
  
  return result;
};

// Role-based access control
const canCreateCategory = computed(() => {
  return currentRole.value === "eksekutif"; // Only Eksekutif can create
});

const canEditCategory = (categoryId) => {
  return currentRole.value === "eksekutif"; // Only Eksekutif can edit
};

const canVerifyCategory = (categoryId) => {
  return currentRole.value === "ketua-jabatan";
};

const canApproveCategory = (categoryId) => {
  return currentRole.value === "ketua-divisyen";
};

// Methods
const viewCategory = (categoryId) => {
  navigateTo(`/BF-PA/KF/KK/detail/${categoryId}`);
};

const editCategory = (categoryId) => {
  navigateTo(`/BF-PA/KF/KK/edit/${categoryId}`);
};

const verifyCategory = (categoryId) => {
  navigateTo(`/BF-PA/KF/KK/verify/${categoryId}`);
};

const approveCategory = (categoryId) => {
  navigateTo(`/BF-PA/KF/KK/approve/${categoryId}`);
};

const navigateToVerification = (categoryId, action) => {
  if (action === 'verify') {
    navigateTo(`/BF-PA/KF/KK/verify/${categoryId}`);
  } else if (action === 'approve') {
    navigateTo(`/BF-PA/KF/KK/approve/${categoryId}`);
  }
};

const refreshTable = () => {
  nextTick(() => {
    tableKey.value++; // Force table to re-render
  });
};

// Helper function to determine badge variant based on status
const getStatusVariant = (status) => {
  const variants = {
    'Aktif': 'success',
    'Tidak Aktif': 'danger',
    'Menunggu Pengesahan': 'warning',
    'Menunggu Kelulusan': 'info',
    'Ditolak Ketua Jabatan': 'danger',
  };
  return variants[status] || 'disabled';
};

const getRoleSpecificDescription = () => {
  const roleData = {
    eksekutif: "Tambah dan Kemaskini Kategori Penolong Amil - Edit Penuh",
    "ketua-jabatan": "Pengesahan Kategori Penolong Amil - Sahkan Kategori",
    "ketua-divisyen": "Kelulusan Akhir Kategori Penolong Amil - Lulus/Tolak dalam Borang",
  };
  return roleData[currentRole.value] || "Tidak Diketahui";
};

// Initialize with best available tab
onMounted(() => {
  const bestTab = getBestAvailableTabForRole.value;
  if (bestTab) {
    activeTab.value = bestTab;
  }
});

// Search functionality
const performSearch = () => {
  if (!filters.value.searchQuery && !filters.value.status && !filters.value.kategori) {
    toast.warning('Sila masukkan kriteria carian');
    return;
  }
  
  toast.success('Carian berjaya dilakukan');
  refreshTable();
};

const clearSearch = () => {
  filters.value.searchQuery = "";
  filters.value.status = "";
  filters.value.kategori = "";
  refreshTable();
  toast.info('Carian telah diset semula');
};

// Bulk approval functionality
const showBulkApprovalModal = ref(false);
const selectedItems = ref([]);
const bulkApprovalNotes = ref("");

const hasPendingApprovals = computed(() => {
  return categoriesList.value.filter(category => 
    category.status === 'Menunggu Kelulusan'
  ).length > 0;
});

const pendingApprovalCount = computed(() => {
  return categoriesList.value.filter(category => 
    category.status === 'Menunggu Kelulusan'
  ).length;
});

const openBulkApprovalModal = () => {
  selectedItems.value = categoriesList.value.filter(category => 
    category.status === 'Menunggu Kelulusan'
  );
  showBulkApprovalModal.value = true;
};

const closeBulkApprovalModal = () => {
  showBulkApprovalModal.value = false;
  selectedItems.value = [];
  bulkApprovalNotes.value = "";
};

const performBulkApproval = async () => {
  if (!bulkApprovalNotes.value.trim()) {
    toast.warning('Sila masukkan ulasan kelulusan');
    return;
  }
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get current date in DD-MM-YYYY format
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    
    // Update all selected items
    selectedItems.value.forEach(category => {
      category.status = 'Aktif';
      category.tarikhKuatkuasa = formattedDate;
    });
    
    toast.success(`${selectedItems.value.length} kategori berjaya diluluskan`);
    closeBulkApprovalModal();
    refreshTable();
  } catch (error) {
    toast.error('Ralat semasa meluluskan kategori');
  }
};
</script> 

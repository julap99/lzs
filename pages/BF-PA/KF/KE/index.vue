<!-- 
  RTMF SCREEN: PA-KF-KE-01_01 (Allowance List)
  PURPOSE: Senarai elaun penolong amil dengan workflow kelulusan
  DESCRIPTION: Allowance list with approval workflow for Penolong Amil allowances
  ROUTE: /BF-PA/KF/KE
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
            <h2 class="text-xl font-semibold">Senarai Elaun Penolong Amil</h2>
            <p class="text-sm text-gray-600 mt-1">{{ getRoleSpecificDescription() }}</p>
          </div>
          <!-- Create new allowance functionality removed - KF/KE only edits existing allowances linked to approved categories -->
        </div>
      </template>

      <template #body>
        <!-- Smart Filter Section -->
        <div class="mb-6">
          <div class="flex flex-col md:flex-row gap-4 mb-4">
            <FormKit
              v-model="filters.searchQuery"
              type="text"
              placeholder="Cari rujukan, kategori, atau jenis elaun..."
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
              v-model="filters.kategoriPenolongAmil"
              type="select"
              :options="kategoriOptions"
              placeholder="Kategori Penolong Amil"
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
                  Senarai elaun yang telah aktif
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
                        @click="viewAllowance(data.text)"
                      >
                        Lihat
                      </rs-button>
                      <rs-button
                        v-if="canEditAllowance(data.text)"
                        variant="secondary"
                        size="sm"
                        class="!px-2 !py-1"
                        @click="editAllowance(data.text)"
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
                  Senarai elaun yang sedang dalam proses
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
                        @click="viewAllowance(data.text)"
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
                  Senarai elaun yang tidak aktif
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
                        @click="viewAllowance(data.text)"
                      >
                        Lihat
                      </rs-button>
                      <rs-button
                        v-if="canEditAllowance(data.text)"
                        variant="secondary"
                        size="sm"
                        class="!px-2 !py-1"
                        @click="editAllowance(data.text)"
                      >
                        Kemaskini
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
                  Senarai elaun yang telah aktif
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
                        @click="viewAllowance(data.text)"
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
                  Senarai elaun yang menunggu pengesahan
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
                        @click="viewAllowance(data.text)"
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
                  Senarai elaun yang tidak aktif
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
                        @click="viewAllowance(data.text)"
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
                  Senarai elaun yang telah aktif
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
                        @click="viewAllowance(data.text)"
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
                    Senarai elaun yang disahkan untuk kelulusan
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
                        @click="viewAllowance(data.text)"
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
                  Senarai elaun yang ditolak oleh Ketua Jabatan
                </h3>
                
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
                        @click="viewAllowance(data.text)"
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
                  Senarai elaun yang tidak aktif
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
                        @click="viewAllowance(data.text)"
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
            Lulus Semua Elaun Yang Telah Disahkan
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
            Anda akan meluluskan <strong>{{ selectedItems.length }} elaun</strong> yang telah disahkan oleh Ketua Jabatan.
          </p>
          
          <!-- Selected Items Table -->
          <div class="border rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rujukan</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Elaun</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amaun</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in selectedItems" :key="item.tindakan" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.rujukan }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.kategoriPenolongAmil }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ item.jenisElaun }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">RM {{ item.amaun }}</td>
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
import { ref, nextTick, computed, watch } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();

definePageMeta({
  title: "Senarai Elaun Penolong Amil",
});

const breadcrumb = [
  { name: 'Laman Utama', path: '/' },
  { name: 'Modul BF-PA', path: '/BF-PA' },
  { name: 'Konfigurasi', path: '/BF-PA/KF' },
  { name: 'Maklumat Elaun', path: null }
];

// Role Simulator State
const currentRole = ref("eksekutif"); // Default role
const showRoleInfo = ref(false);

// Page-specific role options for KF/KE module
const roleOptions = [
  { name: "Eksekutif", value: "eksekutif" },
  { name: "Ketua Jabatan", value: "ketua-jabatan" },
  { name: "Ketua Divisyen", value: "ketua-divisyen" },
];

// Role data for KF/KE module
const roleData = {
      eksekutif: {
      name: "Eksekutif",
      description: "Kemaskini Elaun Penolong Amil",
      capabilities: ["Lihat Senarai", "Kemaskini Elaun", "Edit Penuh"],
  },
  "ketua-jabatan": {
    name: "Ketua Jabatan",
    description: "Pengesahan Elaun Penolong Amil",
    capabilities: ["Lihat Senarai", "Sahkan Elaun", "Monitor Progress"],
  },
  "ketua-divisyen": {
    name: "Ketua Divisyen",
    description: "Kelulusan Akhir Elaun Penolong Amil",
    capabilities: ["Lihat Senarai", "Sahkan/Tolak Elaun", "Kelulusan Akhir"],
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
  kategoriPenolongAmil: "",
});

// Search state
const isSearchPerformed = ref(false);
const searchResults = ref([]);

// Bulk approval state
const showBulkApprovalModal = ref(false);
const selectedItems = ref([]);
const bulkApprovalNotes = ref("");

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
];

// Table data and reactivity control
const tableKey = ref(0);
const allowancesList = ref([
  {
    rujukan: "KE-2024-001",
    kategoriPenolongAmil: "Penolong Amil Fitrah",
    jenisElaun: "Elaun Bancian Baru : per borang permohonan",
    amaun: 30,
    kodBajet: "B34106",
    status: "Aktif",
    tarikhKuatkuasa: "01-01-2024",
    tindakan: 1
  },
  {
    rujukan: "KE-2024-002",
    kategoriPenolongAmil: "Penolong Amil Padi",
    jenisElaun: "Elaun Bancian Semula : per borang permohonan",
    amaun: 25,
    kodBajet: "B34107",
    status: "Aktif",
    tarikhKuatkuasa: "01-01-2024",
    tindakan: 2
  },
  {
    rujukan: "KE-2024-003",
    kategoriPenolongAmil: "Penolong Amil Kariah",
    jenisElaun: "Elaun Bancian Pindah : per borang permohonan",
    amaun: 20,
    kodBajet: "B34108",
    status: "Aktif",
    tarikhKuatkuasa: "01-01-2024",
    tindakan: 3
  },
  {
    rujukan: "KE-2024-004",
    kategoriPenolongAmil: "Penolong Amil Komuniti",
    jenisElaun: "Elaun Bancian Khas : per borang permohonan",
    amaun: 35,
    kodBajet: "B34109",
    status: "Menunggu Kelulusan",
    tarikhKuatkuasa: "", // Empty - not yet approved
    tindakan: 4
  },
  {
    rujukan: "KE-2024-005",
    kategoriPenolongAmil: "Penolong Amil Wakaf",
    jenisElaun: "Elaun Bancian Luar Bandar : per borang permohonan",
    amaun: 40,
    kodBajet: "B34110",
    status: "Tidak Aktif",
    tarikhKuatkuasa: "01-01-2024",
    tindakan: 5
  },
  {
    rujukan: "KE-2024-006",
    kategoriPenolongAmil: "Penolong Amil Kariah",
    jenisElaun: "Elaun Kemaskini/permohonan bantuan : per borang",
    amaun: 45,
    kodBajet: "B34115",
    status: "Ditolak Ketua Jabatan",
    tarikhKuatkuasa: "", // Empty - rejected
    tindakan: 6
  },
  // Additional items for "Sedang Proses - Lulus" to showcase bulk approval
  {
    rujukan: "KE-2024-007",
    kategoriPenolongAmil: "Penolong Amil Fitrah",
    jenisElaun: "Elaun Bancian Khas : per borang permohonan",
    amaun: 50,
    kodBajet: "B34116",
    status: "Menunggu Kelulusan",
    tarikhKuatkuasa: "", // Empty - not yet approved
    tindakan: 7
  },
  {
    rujukan: "KE-2024-008",
    kategoriPenolongAmil: "Penolong Amil Padi",
    jenisElaun: "Elaun Bancian Semula : per borang permohonan",
    amaun: 55,
    kodBajet: "B34117",
    status: "Menunggu Kelulusan",
    tarikhKuatkuasa: "", // Empty - not yet approved
    tindakan: 8
  },
  {
    rujukan: "KE-2024-009",
    kategoriPenolongAmil: "Penolong Amil Komuniti",
    jenisElaun: "Elaun Bancian Pindah : per borang permohonan",
    amaun: 60,
    kodBajet: "B34118",
    status: "Menunggu Kelulusan",
    tarikhKuatkuasa: "", // Empty - not yet approved
    tindakan: 9
  },
  {
    rujukan: "KE-2024-010",
    kategoriPenolongAmil: "Penolong Amil Wakaf",
    jenisElaun: "Elaun Bancian Khas : per borang permohonan",
    amaun: 65,
    kodBajet: "B34119",
    status: "Menunggu Kelulusan",
    tarikhKuatkuasa: "", // Empty - not yet approved
    tindakan: 10
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
    name: 'Kategori',
    sortable: true,
  },
  {
    key: 'jenisElaun',
    name: 'Jenis Elaun',
    sortable: true,
  },
  {
    key: 'amaun',
    name: 'Amaun (RM)',
    sortable: true,
  },
  {
    key: 'kodBajet',
    name: 'Kod Bajet',
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
    // Ketua Divisyen can see: "Menunggu Kelulusan", "Aktif", "Tidak Aktif"
    // Priority: Aktif > Menunggu Kelulusan > Tidak Aktif
    if (getTableDataByStatus(['Aktif']).length > 0) {
      return "Aktif";
    } else if (getTableDataByStatus(['Menunggu Kelulusan']).length > 0) {
      return "Menunggu Kelulusan";
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
    case "Menunggu Kelulusan":
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
  const allTabs = ["Sedang Proses", "Menunggu Pengesahan", "Menunggu Kelulusan", "Aktif", "Tidak Aktif"];
  return allTabs.filter(tab => isTabValidForRole(tab, role));
};

// Filter table data based on status
const getTableDataByStatus = (statuses) => {
  let result = allowancesList.value.filter(allowance => 
    statuses.includes(allowance.status)
  );
  
  // Only apply filters if search has been performed
  if (isSearchPerformed.value) {
    // Apply search filter
    if (filters.value.searchQuery) {
      const query = filters.value.searchQuery.toLowerCase();
      result = result.filter(allowance => 
        allowance.rujukan.toLowerCase().includes(query) ||
        allowance.kategoriPenolongAmil.toLowerCase().includes(query) ||
        allowance.jenisElaun.toLowerCase().includes(query) ||
        allowance.kodBajet.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (filters.value.status) {
      result = result.filter(allowance => 
        allowance.status === filters.value.status
      );
    }
    
    // Apply kategori filter
    if (filters.value.kategoriPenolongAmil) {
      result = result.filter(allowance => 
        allowance.kategoriPenolongAmil === filters.value.kategoriPenolongAmil
      );
    }
  }
  
  return result;
};

// Role-based access control
// Create functionality removed - KF/KE only edits existing allowances linked to approved categories

const canEditAllowance = (allowanceId) => {
  return currentRole.value === "eksekutif"; // Only Eksekutif can edit
};

const canVerifyAllowance = (allowanceId) => {
  return currentRole.value === "ketua-jabatan";
};

const canApproveAllowance = (allowanceId) => {
  return currentRole.value === "ketua-divisyen";
};

// Methods
const viewAllowance = (allowanceId) => {
  navigateTo(`/BF-PA/KF/KE/detail/${allowanceId}`);
};

const editAllowance = (allowanceId) => {
  navigateTo(`/BF-PA/KF/KE/edit/${allowanceId}`);
};

const verifyAllowance = (allowanceId) => {
  // Update status to "Menunggu Kelulusan"
  const allowance = allowancesList.value.find(a => a.tindakan === allowanceId);
  if (allowance) {
    allowance.status = "Menunggu Kelulusan";
    refreshTable();
    toast.success("Elaun penolong amil berjaya disahkan oleh Ketua Jabatan");
  }
};

const approveAllowance = (allowanceId) => {
  // Update status to "Aktif"
  const allowance = allowancesList.value.find(a => a.tindakan === allowanceId);
  if (allowance) {
    allowance.status = "Aktif";
    refreshTable();
    toast.success("Elaun penolong amil berjaya diluluskan oleh Ketua Divisyen");
  }
};

const navigateToVerification = (allowanceId, action) => {
  if (action === 'verify') {
    navigateTo(`/BF-PA/KF/KE/verify/${allowanceId}`);
  } else if (action === 'approve') {
    navigateTo(`/BF-PA/KF/KE/approve/${allowanceId}`);
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
    'Ditolak Ketua Jabatan': 'warning',
  };
  return variants[status] || 'disabled';
};

const getRoleSpecificDescription = () => {
  const roleData = {
    eksekutif: "Kemaskini Elaun Penolong Amil - Edit Penuh",
    "ketua-jabatan": "Pengesahan Elaun Penolong Amil - Sahkan Elaun",
    "ketua-divisyen": "Kelulusan Akhir Elaun Penolong Amil - Sahkan/Tolak dalam Borang",
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
  if (!filters.value.searchQuery && !filters.value.status && !filters.value.kategoriPenolongAmil) {
    toast.warning('Sila masukkan kriteria carian');
    return;
  }
  
  isSearchPerformed.value = true;
  toast.success('Carian berjaya dilakukan');
  refreshTable();
};

const clearSearch = () => {
  filters.value.searchQuery = "";
  filters.value.status = "";
  filters.value.kategoriPenolongAmil = "";
  isSearchPerformed.value = false;
  refreshTable();
  toast.info('Carian telah diset semula');
};

// Bulk approval functionality
const hasPendingApprovals = computed(() => {
  return allowancesList.value.filter(allowance => 
    allowance.status === 'Menunggu Kelulusan'
  ).length > 0;
});

const pendingApprovalCount = computed(() => {
  return allowancesList.value.filter(allowance => 
    allowance.status === 'Menunggu Kelulusan'
  ).length;
});

const openBulkApprovalModal = () => {
  selectedItems.value = allowancesList.value.filter(allowance => 
    allowance.status === 'Menunggu Kelulusan'
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
    selectedItems.value.forEach(allowance => {
      allowance.status = 'Aktif';
      allowance.tarikhKuatkuasa = formattedDate;
    });
    
    toast.success(`${selectedItems.value.length} elaun berjaya diluluskan`);
    closeBulkApprovalModal();
    refreshTable();
  } catch (error) {
    toast.error('Ralat semasa meluluskan elaun');
  }
};
</script> 

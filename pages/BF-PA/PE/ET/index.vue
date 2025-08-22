<!-- 
  RTMF SCREEN: PA-PE-ET
  PURPOSE: Dashboard Elaun Tahunan — Pengurusan Berasaskan Peranan
  DESCRIPTION: Dashboard berasaskan peranan untuk pengurusan elaun tahunan dengan aliran kerja kelulusan
  ROUTE: /BF-PA/PE/ET
-->
<template>
  <div>
    <!-- Penukar Peranan Halaman Khusus -->
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
        <div>
          <h2 class="text-xl font-semibold">Dashboard Elaun Tahunan</h2>
          <p class="text-sm text-gray-600 mt-1">{{ getRoleSpecificDescription() }}</p>
        </div>
      </template>

      <template #body>
        <!-- Bahagian Penapis Pintar -->
        <div class="mb-6">
          <div class="flex flex-col md:flex-row gap-4 mb-4">
            <FormKit
              v-model="filters.searchQuery"
              type="text"
              placeholder="Cari rujukan, tahun, atau jenis elaun..."
              :classes="{
                input: '!py-2',
              }"
              class="flex-1"
            />
            <FormKit
              v-model="filters.year"
              type="select"
              :options="yearOptions"
              placeholder="Tahun"
              :classes="{
                input: '!py-2',
              }"
            />
            <FormKit
              v-model="filters.type"
              type="select"
              :options="typeOptions"
              placeholder="Jenis Elaun"
              :classes="{
                input: '!py-2',
              }"
            />
            <div class="flex gap-2">
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
          


          

        </div>



        <!-- Bahagian Jadual Bertab -->
        <!-- Tab Eksekutif -->
        <div v-if="currentRole === 'eksekutif'">
          <rs-tab v-model="activeTab" class="mt-4">
            <rs-tab-item title="Draf">
              <div class="p-4">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold text-gray-700 flex items-center">
                    <Icon name="ph:file-text" class="mr-2" size="20" />
                    Senarai elaun yang dalam draf
                  </h3>
                  <rs-button
                    variant="success"
                    @click="addNewAllowance"
                    class="flex items-center whitespace-nowrap"
                  >
                    <Icon name="ph:plus" class="w-4 h-4 mr-2" />
                    Tambah Maklumat Elaun Tahunan
                  </rs-button>
                </div>
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
                          <div class="flex space-x-2">
                            <rs-button
                              variant="primary"
                              size="sm"
                              class="!px-2 !py-1"
                              @click="viewAllowance(item)"
                            >
                              Lihat
                            </rs-button>
                            <rs-button
                              variant="secondary"
                              size="sm"
                              class="!px-2 !py-1"
                              @click="editAllowance(item)"
                            >
                              Kemaskini
                            </rs-button>
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
                <h3 class="text-lg font-semibold mb-4 text-blue-700 flex items-center">
                  <Icon name="ph:clock" class="mr-2" size="20" />
                  Senarai elaun yang sedang dalam proses
                </h3>
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
                          <div class="flex space-x-2">
                            <rs-button
                              variant="primary"
                              size="sm"
                              class="!px-2 !py-1"
                              @click="viewAllowance(item)"
                            >
                              Lihat
                            </rs-button>
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
                <h3 class="text-lg font-semibold mb-4 text-green-700 flex items-center">
                  <Icon name="ph:check-circle" class="mr-2" size="20" />
                  Senarai elaun yang telah diluluskan
                </h3>
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
                          <div class="flex space-x-2">
                            <rs-button
                              variant="primary"
                              size="sm"
                              class="!px-2 !py-1"
                              @click="viewAllowance(item)"
                            >
                              Lihat
                            </rs-button>
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
                <h3 class="text-lg font-semibold mb-4 text-blue-700 flex items-center">
                  <Icon name="ph:clock" class="mr-2" size="20" />
                  Senarai elaun yang menunggu pengesahan jabatan
                </h3>
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
                          <div class="flex space-x-2">
                            <rs-button
                              variant="primary"
                              size="sm"
                              class="!px-2 !py-1"
                              @click="viewAllowance(item)"
                            >
                              Lihat
                            </rs-button>
                            <rs-button
                              variant="success"
                              size="sm"
                              class="!px-2 !py-1"
                              @click="approveAllowance(item)"
                            >
                              Luluskan
                            </rs-button>
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

            <rs-tab-item title="Perlu Pengesahan">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-orange-700 flex items-center">
                  <Icon name="ph:warning" class="mr-2" size="20" />
                  Senarai elaun yang melebihi bajet dan memerlukan pengesahan
                </h3>
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
                      <tr v-for="item in getTableDataByStatus(['PERLU PENGESAHAN'])" :key="item.id" class="hover:bg-gray-50">
                        <td class="px-4 py-3 text-gray-900">{{ item.rujukan }}</td>
                        <td class="px-4 py-3 text-gray-900">{{ item.year }}</td>
                        <td class="px-4 py-3 text-gray-900">{{ item.typeLabel }}</td>
                        <td class="px-4 py-3">
                          <rs-badge :variant="getStatusVariant(item.status)">
                            {{ item.status }}
                          </rs-badge>
                        </td>
                        <td class="px-4 py-3 text-gray-900">{{ item.count }}</td>
                        <td class="px-4 py-3 text-red-600 font-medium">RM {{ formatCurrency(item.totalAmount) }}</td>
                        <td class="px-4 py-3">
                          <div class="flex space-x-2">
                            <rs-button
                              variant="primary"
                              size="sm"
                              class="!px-2 !py-1"
                              @click="viewAllowance(item)"
                            >
                              Lihat
                            </rs-button>
                            <rs-button
                              variant="warning"
                              size="sm"
                              class="!px-2 !py-1"
                              @click="verifyExcessAllowance(item)"
                            >
                              Sahkan
                            </rs-button>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="getTableDataByStatus(['PERLU PENGESAHAN']).length === 0" class="hover:bg-gray-50">
                        <td class="px-4 py-6 text-center text-gray-500" colspan="7">
                          Tiada elaun yang memerlukan pengesahan.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
          </div>
            </rs-tab-item>

            <rs-tab-item title="Lulus">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-green-700 flex items-center">
                  <Icon name="ph:check-circle" class="mr-2" size="20" />
                  Senarai elaun yang telah disahkan jabatan
                </h3>
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
                          <div class="flex space-x-2">
            <rs-button
              variant="primary"
              size="sm"
                              class="!px-2 !py-1"
                              @click="viewAllowance(item)"
            >
                              Lihat
            </rs-button>
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
            <rs-tab-item title="Sedang Proses">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-blue-700 flex items-center">
                  <Icon name="ph:clock" class="mr-2" size="20" />
                  Senarai elaun yang menunggu kelulusan akhir divisyen
                </h3>
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
                          <div class="flex space-x-2">
                            <rs-button
                              variant="primary"
                              size="sm"
                              class="!px-2 !py-1"
                              @click="viewAllowance(item)"
                            >
                              Lihat
                            </rs-button>
                            <rs-button
                              variant="success"
                              size="sm"
                              class="!px-2 !py-1"
                              @click="approveAllowance(item)"
                            >
                              Luluskan
                            </rs-button>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="getTableDataByStatus(['SEDANG PROSES']).length === 0" class="hover:bg-gray-50">
                        <td class="px-4 py-6 text-center text-gray-500" colspan="7">
                          Tiada elaun yang menunggu kelulusan.
                        </td>
                      </tr>
                    </tbody>
                  </table>
            </div>
          </div>
            </rs-tab-item>

            <rs-tab-item title="Lulus">
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-4 text-green-700 flex items-center">
                  <Icon name="ph:check-circle" class="mr-2" size="20" />
                  Senarai elaun yang telah diluluskan divisyen
                </h3>
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
                          <div class="flex space-x-2">
                  <rs-button
                    variant="primary"
                    size="sm"
                              class="!px-2 !py-1"
                              @click="viewAllowance(item)"
                  >
                              Lihat
                  </rs-button>
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
  { name: 'Pengurusan Elaun', path: '/BF-PA/PE' },
  { name: 'Elaun Tahunan', path: null }
];

// Role Simulator State
const currentRole = ref("eksekutif"); // Default role
const showRoleInfo = ref(false);

// Page-specific role options for ET module
const roleOptions = [
  { label: "Eksekutif", value: "eksekutif" },
  { label: "Ketua Jabatan", value: "ketua-jabatan" },
  { label: "Ketua Divisyen", value: "ketua-divisyen" },
];

// Role data for ET module
const roleData = {
  eksekutif: {
    name: "Eksekutif",
    description: "Pengurusan Elaun Tahunan",
    capabilities: ["Tambah Elaun", "Lihat Senarai", "Kemaskini Elaun", "Hantar untuk Kelulusan"],
  },
  "ketua-jabatan": {
    name: "Ketua Jabatan",
    description: "Pengesahan Elaun Tahunan",
    capabilities: ["Lihat Senarai", "Sahkan Elaun", "Monitor Progress", "Pengesahan Lebihan"],
  },
  "ketua-divisyen": {
    name: "Ketua Divisyen", 
    description: "Kelulusan Akhir Elaun Tahunan",
    capabilities: ["Lihat Senarai", "Kelulusan Akhir", "Monitor Keseluruhan"],
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
  return roleData[role]?.name || role;
};

const getRoleDescription = (role) => {
  return roleData[role]?.description || "";
};

const getRoleCapabilities = (role) => {
  return roleData[role]?.capabilities || [];
};

const handleRoleChange = () => {
  // Role changed
  const roleLabel = getRoleLabel(currentRole.value);
  toast.info(`Peranan berubah kepada: ${roleLabel}`);
  
  // Refresh table to show role-specific data
  refreshTable();
};

const toggleRoleInfo = () => {
  showRoleInfo.value = !showRoleInfo.value;
};

const getRoleSpecificDescription = () => {
  const role = currentRole.value;
  switch (role) {
    case 'eksekutif':
      return 'Urus elaun tahunan, tambah maklumat baru, dan kemaskini data sedia ada';
    case 'ketua-jabatan':
      return 'Sahkan elaun tahunan dan kelulusan untuk elaun yang melebihi bajet';
    case 'ketua-divisyen':
      return 'Kelulusan akhir untuk semua elaun tahunan';
    default:
      return 'Pilih peranan untuk melihat fungsi yang tersedia';
  }
};

// Filters
const filters = ref({
  searchQuery: "",
  year: "",
  type: "",
});

// Filter options
const currentYear = new Date().getFullYear();
const yearOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "2024", value: 2024 },
  { label: "2025", value: 2025 }
];

const typeOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "Elaun Tahunan KPAK", value: "ET-KPAK" },
  { label: "Elaun Tahunan KPAF", value: "ET-KPAF" },
  { label: "Anugerah Penolong Amil", value: "ET-ANUG" },
  { label: "Ketua Penolong Amil Kariah (KPAK) terbaik", value: "ANUG-KPAK" },
  { label: "Penolong Amil Kariah (PAK) terbaik", value: "ANUG-PAK" },
  { label: "Ketua Penolong Amil Fitrah (KPAF) terbaik", value: "ANUG-KPAF" },
  { label: "Penolong Amil Fitrah (PAF) terbaik", value: "ANUG-PAF" },
  { label: "Penolong Amil Padi (PAP) terbaik", value: "ANUG-PAP" },
  { label: "Penolong Amil Komuniti (PAK+) terbaik", value: "ANUG-PAKPLUS" }
];

// Table data and reactivity control
const tableKey = ref(0);
const activeTab = ref(0);

// Sample data for demonstration
const allowancesList = ref([
  {
    id: "ET-2024-001",
    rujukan: "ET-2024-001",
    year: 2024,
    type: "ET-KPAK",
    typeLabel: "Elaun Tahunan KPAK",
    status: "DRAF",
    count: 25,
    totalAmount: 12500.00,
    budget: 10000.00,
    excessAmount: 2500.00,
    createdBy: "eksekutif",
    createdAt: "2024-01-15T10:00:00Z",
    submittedAt: null,
    approvedByKJ: null,
    approvedAtKJ: null,
    approvedByKD: null,
    approvedAtKD: null,
    notes: ""
  },
  {
    id: "ET-2024-002",
    rujukan: "ET-2024-002",
    year: 2024,
    type: "ET-KPAF",
    typeLabel: "Elaun Tahunan KPAF",
    status: "SEDANG PROSES",
    count: 30,
    totalAmount: 9000.00,
    budget: 10000.00,
    excessAmount: 0.00,
    createdBy: "eksekutif",
    createdAt: "2024-01-16T14:30:00Z",
    submittedAt: "2024-01-16T15:00:00Z",
    approvedByKJ: null,
    approvedAtKJ: null,
    approvedByKD: null,
    approvedAtKD: null,
    notes: ""
  },
  {
    id: "ET-2024-003",
    rujukan: "ET-2024-003",
    year: 2024,
    type: "ET-ANUG",
    typeLabel: "Anugerah Penolong Amil",
    status: "PERLU PENGESAHAN",
    count: 15,
    totalAmount: 15000.00,
    budget: 10000.00,
    excessAmount: 5000.00,
    createdBy: "eksekutif",
    createdAt: "2024-01-17T09:15:00Z",
    submittedAt: "2024-01-17T10:00:00Z",
    approvedByKJ: null,
    approvedAtKJ: null,
    approvedByKD: null,
    approvedAtKD: null,
    notes: "Elaun melebihi bajet - memerlukan pengesahan"
  },
  {
    id: "ET-2024-004",
    rujukan: "ET-2024-004",
    year: 2024,
    type: "ANUG-KPAK",
    typeLabel: "Ketua Penolong Amil Kariah (KPAK) terbaik",
    status: "LULUS",
    count: 5,
    totalAmount: 5000.00,
    budget: 10000.00,
    excessAmount: 0.00,
    createdBy: "eksekutif",
    createdAt: "2024-01-18T11:00:00Z",
    submittedAt: "2024-01-18T12:00:00Z",
    approvedByKJ: "KJ001",
    approvedAtKJ: "2024-01-19T10:00:00Z",
    approvedByKD: "KD001",
    approvedAtKD: "2024-01-20T14:00:00Z",
    notes: "Diluluskan sepenuhnya"
  },
  {
    id: "ET-2024-005",
    rujukan: "ET-2024-005",
    year: 2024,
    type: "ET-KPAK",
    typeLabel: "Elaun Tahunan KPAK",
    status: "DRAF",
    count: 20,
    totalAmount: 10000.00,
    budget: 10000.00,
    excessAmount: 0.00,
    createdBy: "eksekutif",
    createdAt: "2024-01-20T08:00:00Z",
    submittedAt: null,
    approvedByKJ: null,
    approvedAtKJ: null,
    approvedByKD: null,
    approvedAtKD: null,
    notes: "Draf baru untuk KPAK"
  },
  {
    id: "ET-2024-006",
    rujukan: "ET-2024-006",
    year: 2024,
    type: "ET-KPAF",
    typeLabel: "Elaun Tahunan KPAF",
    status: "SEDANG PROSES",
    count: 18,
    totalAmount: 5400.00,
    budget: 10000.00,
    excessAmount: 0.00,
    createdBy: "eksekutif",
    createdAt: "2024-01-21T09:00:00Z",
    submittedAt: "2024-01-21T10:00:00Z",
    approvedByKJ: null,
    approvedAtKJ: null,
    approvedByKD: null,
    approvedAtKD: null,
    notes: "Dalam proses kelulusan"
  }
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

  if (filters.value.year) {
    filteredData = filteredData.filter(item => item.year === filters.value.year);
  }

  if (filters.value.type) {
    filteredData = filteredData.filter(item => item.type === filters.value.type);
  }

  return filteredData;
}

function performSearch() {
  tableKey.value++;
  toast.success('Carian berjaya dilakukan');
}

function clearSearch() {
  filters.value.searchQuery = "";
  filters.value.year = "";
  filters.value.type = "";
  tableKey.value++;
  toast.success('Filter telah diset semula');
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
</script>

<style scoped>
/* Add any additional styles here */
</style> 
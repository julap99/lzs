<template>
  <div class="min-h-screen bg-gray-50">
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center">
          <div class="flex items-center space-x-3">
            <Icon name="mdi:account-search" size="2rem" class="text-blue-600" />
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Carian Profil</h1>
              <p class="mt-2 text-gray-600">Cari dan kelola profil asnaf dalam sistem</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class=" py-8">
      <!-- Main Search Card -->
      <rs-card class="shadow-lg border-0">
        <template #header>
          <div class="flex items-center">
            <div class="flex items-center space-x-3">
              <Icon name="mdi:card-search" size="1.5rem" class="text-blue-600" />
              <h2 class="text-xl font-semibold text-gray-900">Carian Profil</h2>
            </div>
            <div class="ml-8 text-sm text-gray-500">
              <Icon name="mdi:information" size="1rem" class="inline mr-1" />
              Isi mana-mana maklumat untuk carian yang fleksibel. Semakin banyak maklumat, semakin tepat hasil carian.
            </div>
          </div>
        </template>

        <template #body>
          <!-- Form Section -->
          <div class="mb-8">
            <FormKit type="form" :actions="false" @submit="handleSubmit">
              <!-- Personal Information Section -->
              <div class="mb-8">
                <!-- <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Icon name="mdi:account" size="1.5rem" class="text-blue-600 mr-2" />
                  Maklumat Peribadi
                </h3> -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <!-- Jenis Pengenalan ID Field -->
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center">
                        <Icon name="mdi:card-account-details" size="1.2rem" class="text-blue-600 mr-2" />
                        <label class="text-sm font-medium text-gray-700">Jenis Pengenalan ID</label>
                      </div>
                      <div v-if="validationErrors.idType" class="text-xs text-red-500">
                        {{ validationErrors.idType }}
                      </div>
                    </div>
                    <FormKit
                      type="select"
                      name="idType"
                      :options="idTypeOptions" 
                      placeholder="Pilih jenis ID"
                      v-model="formData.idType"
                      input-class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      @change="validateField('idType')"
                    />
                  </div>

                  <!-- Pengenalan ID Field (conditional) -->
                  <div v-if="formData.idType">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center">
                        <Icon name="mdi:numeric" size="1.2rem" class="text-blue-600 mr-2" />
                        <label class="text-sm font-medium text-gray-700">Pengenalan ID</label>
                      </div>
                      <div v-if="validationErrors.idNumber" class="text-xs text-red-500">
                        {{ validationErrors.idNumber }}
                      </div>
                    </div>
                    <FormKit
                      type="text"
                      name="idNumber"
                      v-model="formData.idNumber"
                      :placeholder="getPlaceholder()"
                      input-class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      @input="debouncedValidateField('idNumber')"
                    />
                  </div>

                  <!-- Name Field -->
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center">
                        <Icon name="mdi:account" size="1.2rem" class="text-blue-600 mr-2" />
                        <label class="text-sm font-medium text-gray-700">Nama</label>
                      </div>
                      <div v-if="validationErrors.searchName" class="text-xs text-red-500">
                        {{ validationErrors.searchName }}
                      </div>
                    </div>
                    <FormKit
                      type="text"
                      name="searchName"
                      v-model="formData.searchName"
                      placeholder="Masukkan nama (sebarang bahagian nama)"
                      input-class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      @input="debouncedValidateField('searchName')"
                    />
                    <p class="mt-1 text-xs text-gray-500">Cari dengan nama pertama, nama bapa, atau nama penuh. Semua perkataan mesti ada dalam nama. Contoh: "nur . ahmad" untuk carian tepat atau "ahmad" untuk carian umum</p>
                  </div>
                </div>
              </div>

              <!-- Location Information Section -->
              <div class="mb-8">
                <!-- <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Icon name="mdi:map-marker" size="1.5rem" class="text-blue-600 mr-2" />
                  Maklumat Lokasi
                </h3> -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <!-- Daerah Field -->
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center">
                        <Icon name="mdi:map-marker" size="1.2rem" class="text-blue-600 mr-2" />
                        <label class="text-sm font-medium text-gray-700">Daerah</label>
                      </div>
                      <div v-if="validationErrors.searchDaerah" class="text-xs text-red-500">
                        {{ validationErrors.searchDaerah }}
                      </div>
                    </div>
                    <FormKit
                      type="select"
                      name="searchDaerah"
                      :options="daerahOptions"
                      placeholder="Pilih daerah"
                      v-model="formData.searchDaerah"
                      input-class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      @change="handleDaerahChange"
                    />
                    <p class="mt-1 text-xs text-gray-500">Pilih daerah untuk menapis kariah yang tersedia</p>
                  </div>

                  <!-- Kariah Field -->
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center">
                        <Icon name="mdi:mosque" size="1.2rem" class="text-blue-600 mr-2" />
                        <label class="text-sm font-medium text-gray-700">Kariah</label>
                      </div>
                      <div v-if="validationErrors.searchKariah" class="text-xs text-red-500">
                        {{ validationErrors.searchKariah }}
                      </div>
                    </div>
                    <FormKit
                      type="select"
                      name="searchKariah"
                      :options="filteredKariahOptions"
                      placeholder="Pilih kariah"
                      v-model="formData.searchKariah"
                      input-class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      :disabled="!formData.searchDaerah"
                      @change="validateField('searchKariah')"
                    />
                    <p class="mt-1 text-xs text-gray-500">Pilih kariah untuk menapis hasil carian mengikut lokasi</p>
                  </div>
                </div>
              </div>

              <!-- Contact Information Section -->
              <div class="mb-8">
                <!-- <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Icon name="mdi:phone" size="1.5rem" class="text-blue-600 mr-2" />
                  Maklumat Hubungan
                </h3> -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <!-- Phone Field -->
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center">
                        <Icon name="mdi:phone" size="1.2rem" class="text-blue-600 mr-2" />
                        <label class="text-sm font-medium text-gray-700">No Telefon</label>
                      </div>
                      <div v-if="validationErrors.searchPhone" class="text-xs text-red-500">
                        {{ validationErrors.searchPhone }}
                      </div>
                    </div>
                    <FormKit
                      type="text"
                      name="searchPhone"
                      v-model="formData.searchPhone"
                      placeholder="Contoh: 0123456789"
                      input-class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      @input="debouncedValidateField('searchPhone')"
                    />
                    <p class="mt-1 text-xs text-gray-500">Boleh masukkan sebahagian atau penuh nombor telefon</p>
                  </div>

                  <!-- Address Field -->
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center">
                        <Icon name="mdi:home-map-marker" size="1.2rem" class="text-blue-600 mr-2" />
                        <label class="text-sm font-medium text-gray-700">Alamat</label>
                      </div>
                      <div v-if="validationErrors.searchAddress" class="text-xs text-red-500">
                        {{ validationErrors.searchAddress }}
                      </div>
                    </div>
                    <FormKit
                      type="text"
                      name="searchAddress"
                      v-model="formData.searchAddress"
                      placeholder="Masukkan alamat (sebahagian atau penuh)"
                      input-class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      @input="debouncedValidateField('searchAddress')"
                    />
                    <p class="mt-1 text-xs text-gray-500">Padankan alamat separa dibenarkan</p>
                  </div>
                </div>
              </div>



              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                <rs-button 
                  variant="primary-outline" 
                  @click="resetForm"
                  class="w-full sm:w-auto"
                >
                  <Icon name="mdi:refresh" size="1rem" class="mr-2" />
                  Reset
                </rs-button>

                <rs-button
                  variant="primary"
                  @click="validateAndSearch"
                  :disabled="processing || !isFormValid"
                  class="w-full sm:w-auto"
                >
                  <span v-if="processing" class="flex items-center">
                    <Icon name="eos-icons:loading" class="mr-2" size="1rem" />
                    Mencari...
                  </span>
                  <span v-else class="flex items-center">
                    <Icon name="mdi:magnify" size="1rem" class="mr-2" />
                    Cari
                  </span>
                </rs-button>
              </div>
            </FormKit>
          </div>
          
          <!-- Error Message Display -->
          <div v-if="errorMessage && searchCompleted" class="mt-6">
            <rs-card variant="danger" class="mb-4 shadow-md">
              <template #body>
                <div class="flex items-start">
                  <div class="mr-4 mt-1">
                    <Icon name="mdi:alert-circle" size="2rem" class="text-red-600" />
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-medium text-red-600 mb-2">
                      {{ searchCompleted ? 'Maklumat Tidak Ditemui' : 'Ralat Pengesahan' }}
                    </h3>
                    <p class="text-sm text-red-700">{{ errorMessage }}</p>
                    <div v-if="searchCompleted" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p class="text-xs text-red-600">
                        <Icon name="mdi:information" size="1rem" class="inline mr-1" />
                        Semua maklumat mesti tepat untuk mencari profil dalam sistem
                      </p>
                    </div>
                  </div>
                </div>
              </template>
            </rs-card>
          </div>

          <!-- Loading State -->
          <div v-if="processing" class="mt-8">
            <rs-card variant="info" class="mb-6 shadow-md">
              <template #body>
                <div class="flex items-center justify-center py-12">
                  <div class="text-center">
                    <Icon name="eos-icons:loading" class="animate-spin text-4xl text-blue-600 mb-4" />
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Mencari Profil...</h3>
                    <p class="text-sm text-gray-500">Sila tunggu sebentar</p>
                  </div>
                </div>
              </template>
            </rs-card>
          </div>

          <!-- Search Results Section -->
          <div v-if="searchResults.length > 0 && !processing" class="mt-8">
            <rs-card variant="info" class="mb-6 shadow-md">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <Icon name="mdi:account-group" size="1.5rem" class="text-blue-600" />
                    <h3 class="text-lg font-medium text-gray-900">Paparan Hasil Carian</h3>
                  </div>
                  <div class="flex items-center space-x-4">
                    <div class="text-sm text-gray-500">
                      <span class="font-medium">{{ searchResults.length }}</span> profil ditemui
                      <span v-if="hasSearchCriteria" class="ml-2 text-xs">
                        untuk kriteria carian anda
                      </span>
                      <span v-if="sortField" class="ml-2 text-xs text-blue-600">
                        • Disusun mengikut: {{ getSortFieldLabel(sortField) }} ({{ sortDirection === 'asc' ? 'A-Z' : 'Z-A' }})
                      </span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <rs-button 
                        variant="primary-outline" 
                        size="sm"
                        @click="exportToPDF"
                        class="text-xs"
                      >
                        <Icon name="mdi:file-pdf-box" size="1rem" class="mr-1" />
                        PDF
                      </rs-button>
                      <rs-button 
                        variant="primary-outline" 
                        size="sm"
                        @click="exportToExcel"
                        class="text-xs"
                      >
                        <Icon name="mdi:file-excel" size="1rem" class="mr-1" />
                        Excel
                      </rs-button>
                      <rs-button 
                        variant="primary-outline" 
                        size="sm"
                        @click="printResults"
                        class="text-xs"
                      >
                        <Icon name="mdi:printer" size="1rem" class="mr-1" />
                        Print
                      </rs-button>
                    </div>
                  </div>
                </div>
              </template>
              <template #body>
                <div class="overflow-x-auto">
                  <table class="w-full table-fixed divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="w-1/6 px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <button 
                            @click="handleSort('idType')"
                            :class="[
                              'flex items-center justify-center space-x-1 transition-colors',
                              sortField.value === 'idType' 
                                ? 'text-blue-600 hover:text-blue-700' 
                                : 'hover:text-gray-700'
                            ]"
                          >
                            <span>Jenis Pengenalan ID</span>
                            <Icon :name="getSortIcon('idType')" size="1rem" />
                          </button>
                        </th>
                        <th class="w-1/6 px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <button 
                            @click="handleSort('id')"
                            :class="[
                              'flex items-center justify-center space-x-1 transition-colors',
                              sortField.value === 'id' 
                                ? 'text-blue-600 hover:text-blue-700' 
                                : 'hover:text-gray-700'
                            ]"
                          >
                            <span>Pengenalan ID</span>
                            <Icon :name="getSortIcon('id')" size="1rem" />
                          </button>
                        </th>
                        <th class="w-1/4 px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <button 
                            @click="handleSort('name')"
                            :class="[
                              'flex items-center justify-center space-x-1 transition-colors',
                              sortField.value === 'name' 
                                ? 'text-blue-600 hover:text-blue-700' 
                                : 'hover:text-gray-700'
                            ]"
                          >
                            <span>Nama</span>
                            <Icon :name="getSortIcon('name')" size="1rem" />
                          </button>
                        </th>
                        <th class="w-1/4 px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <button 
                            @click="handleSort('kariah')"
                            :class="[
                              'flex items-center justify-center space-x-1 transition-colors',
                              sortField.value === 'kariah' 
                                ? 'text-blue-600 hover:text-blue-700' 
                                : 'hover:text-gray-700'
                            ]"
                          >
                            <span>Kariah</span>
                            <Icon :name="getSortIcon('kariah')" size="1rem" />
                          </button>
                        </th>
                        <th class="w-1/6 px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <button 
                            @click="handleSort('kategoriAsnaf')"
                            :class="[
                              'flex items-center justify-center space-x-1 transition-colors',
                              sortField.value === 'kategoriAsnaf' 
                                ? 'text-blue-600 hover:text-blue-700' 
                                : 'hover:text-gray-700'
                            ]"
                          >
                            <span>Kategori Asnaf</span>
                            <Icon :name="getSortIcon('kategoriAsnaf')" size="1rem" />
                          </button>
                        </th>
                        <th class="w-1/6 px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tindakan
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="profile in paginatedResults" :key="profile.id" class="hover:bg-gray-50">
                        <td class="px-3 py-4 text-sm text-gray-900 truncate text-center" :title="getSelectedIdTypeLabel(profile.idType)">
                          <div class="flex items-center justify-center space-x-1">
                            <Icon :name="getIdTypeIcon(profile.idType)" size="1rem" class="text-gray-500" />
                            <span>{{ getSelectedIdTypeLabel(profile.idType) }}</span>
                          </div>
                        </td>
                        <td class="px-3 py-4 text-sm text-gray-900 truncate text-center" :title="profile.id">
                          {{ profile.id }}
                        </td>
                        <td class="px-3 py-4 text-sm font-medium text-gray-900 truncate text-center" :title="profile.name">
                          {{ profile.name }}
                        </td>
                        <td class="px-3 py-4 text-sm text-gray-900 truncate text-center" :title="profile.kariah">
                          {{ profile.kariah }}
                        </td>
                        <td class="px-3 py-4 text-center">
                          <span :class="getKategoriAsnafBadge(profile.kategoriAsnaf)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border">
                            {{ profile.kategoriAsnaf }}
                          </span>
                        </td>
                        <td class="flex justify-center gap-2 px-3 py-4 text-sm text-gray-500 text-center">
                          <rs-button 
                            variant="primary" 
                            size="sm"
                            @click="mohonBantuan(profile)"
                            class="text-xs"
                          >
                            <Icon name="mdi:help" size="1rem" class="mr-1" />
                            Mohon Bantuan
                          </rs-button>
                          <rs-button 
                            variant="primary" 
                            size="sm"
                            @click="updateProfile(profile)"
                            class="text-xs"
                          >
                            <Icon name="mdi:pencil" size="1rem" class="mr-1" />
                            Kemaskini Profil
                          </rs-button>
                          <rs-button 
                            variant="primary" 
                            size="sm"
                            @click="viewProfile(profile)"
                            class="text-xs"
                          >
                            <Icon name="mdi:pencil" size="1rem" class="mr-1" />
                            Lihat Profil
                          </rs-button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Pagination Controls -->
                <div v-if="searchResults.length > 0" class="mt-6 flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-500">
                      {{ paginationStart }}-{{ paginationEnd }} daripada {{ searchResults.length }}
                    </span>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <rs-button 
                      variant="primary-outline" 
                      size="sm"
                      :disabled="currentPage === 1"
                      @click="currentPage = currentPage - 1"
                    >
                      <Icon name="mdi:chevron-left" size="1rem" />
                      Sebelum
                    </rs-button>
                    
                    <div class="flex items-center space-x-1">
                      <button 
                        v-for="page in getVisiblePages()" 
                        :key="page"
                        @click="currentPage = page"
                        :class="[
                          'px-3 py-1 text-sm rounded',
                          currentPage === page 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        ]"
                      >
                        {{ page }}
                      </button>
                    </div>
                    
                    <rs-button 
                      variant="primary-outline" 
                      size="sm"
                      :disabled="currentPage === totalPages"
                      @click="currentPage = currentPage + 1"
                    >
                      Seterus
                      <Icon name="mdi:chevron-right" size="1rem" />
                    </rs-button>
                  </div>
                </div>
              </template>
            </rs-card>
          </div>



          <!-- No Results Section -->
          <div v-if="searchCompleted && searchResults.length === 0 && !processing" class="mt-8">
            <rs-card variant="warning" class="mb-6 shadow-md">
              <template #body>
                <div class="text-center py-12">
                  <div class="mb-6">
                    <Icon name="mdi:account-search" size="5rem" class="text-gray-300 mx-auto mb-4" />
                    <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Icon name="mdi:help-circle" size="3rem" class="text-gray-400" />
                    </div>
                  </div>
                  <h4 class="text-xl font-medium text-gray-900 mb-3">Tiada Hasil Carian</h4>
                  <p class="text-gray-600 mb-6 max-w-md mx-auto">
                    Tiada profil ditemui dengan kriteria carian anda. 
                    Cuba ubah maklumat carian atau gunakan kriteria yang lebih umum.
                  </p>
                  
                  <!-- Search Criteria Display -->
                  <div v-if="hasSearchCriteria" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                    <h5 class="text-sm font-medium text-blue-900 mb-2">Kriteria Carian:</h5>
                    <div class="text-sm text-blue-700 space-y-1">
                      <p v-if="formData.searchName">• Nama: "{{ formData.searchName }}"</p>
                      <p v-if="formData.searchDaerah">• Daerah: "{{ daerahOptions.find(d => d.value === formData.searchDaerah)?.label }}"</p>
                      <p v-if="formData.searchKariah">• Kariah: "{{ formData.searchKariah }}"</p>
                      <p v-if="formData.searchAddress">• Alamat: "{{ formData.searchAddress }}"</p>
                      <p v-if="formData.searchBankAccount">• Akaun Bank: "{{ formData.searchBankAccount }}"</p>
                      <p v-if="formData.searchPhone">• Telefon: "{{ formData.searchPhone }}"</p>
                      <p v-if="formData.idNumber">• ID: "{{ formData.idNumber }}"</p>
                    </div>
                  </div>
                  
                  <div class="space-y-4">
                    <h5 class="text-sm font-medium text-gray-700">Cadangan:</h5>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div class="flex items-start space-x-2">
                        <Icon name="mdi:check-circle" size="1rem" class="text-green-500 mt-0.5" />
                        <span>Semak ejaan nama</span>
                      </div>
                      <div class="flex items-start space-x-2">
                        <Icon name="mdi:check-circle" size="1rem" class="text-green-500 mt-0.5" />
                        <span>Cuba nama yang lebih pendek</span>
                      </div>
                      <div class="flex items-start space-x-2">
                        <Icon name="mdi:check-circle" size="1rem" class="text-green-500 mt-0.5" />
                        <span>Pastikan format ID betul</span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template #footer>
                <div class="flex justify-center space-x-4">
                  <rs-button variant="primary-outline" @click="resetForm" class="px-6">
                    <Icon name="mdi:refresh" size="1rem" class="mr-2" />
                    Cuba Lagi
                  </rs-button>
                  <rs-button variant="primary" @click="redirectToApplication" class="px-8">
                    <Icon name="mdi:file-document-plus" size="1rem" class="mr-2" />
                    Isi Borang Permohonan
                  </rs-button>
                </div>
              </template>
            </rs-card>
          </div>
        </template>
      </rs-card>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";

definePageMeta({
  title: "Carian Profil",
});

const processing = ref(false);
const searchCompleted = ref(false);
const searchResults = ref([]);
const selectedProfile = ref(null);
const errorMessage = ref('');

// Pagination
const currentPage = ref(1);
const itemsPerPage = 10; // Fixed at 10 items per page
const totalPages = computed(() => Math.ceil(searchResults.value.length / itemsPerPage));
const paginationStart = computed(() => (currentPage.value - 1) * itemsPerPage + 1);
const paginationEnd = computed(() => Math.min(currentPage.value * itemsPerPage, searchResults.value.length));

// Sorting
const sortField = ref('');
const sortDirection = ref('asc'); // 'asc' or 'desc'

// Computed property for sorted and paginated results
const paginatedResults = computed(() => {
  let sortedResults = [...searchResults.value];
  
  // Apply sorting if sortField is set
  if (sortField.value) {
    sortedResults.sort((a, b) => {
      let aValue = a[sortField.value];
      let bValue = b[sortField.value];
      
      // Handle different data types
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) {
        return sortDirection.value === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection.value === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  
  // Apply pagination
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return sortedResults.slice(start, end);
});
const validationErrors = ref({
  searchName: '',
  searchDaerah: '',
  searchKariah: '',
  searchBankAccount: '',
  searchPhone: '',
  searchAddress: '',
  idType: '',
  idNumber: ''
});


const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/AS/FR/01",
  },
  {
    name: "Asnaf",
    type: "link",
    path: "/BF-PRF/AS/FR/01",
  },
  {
    name: "Carian Profil",
    type: "current",
    path: "/BF-PRF/AS/FR/01",
  },
]);

const idTypeOptions = [
  { label: "MyKad", value: "myKad" },
  { label: "Foreign ID", value: "foreignID" },
];

// Daerah options for Selangor
const daerahOptions = [
  { label: "Gombak", value: "gombak" },
  { label: "Hulu Langat", value: "hulu_langat" },
  { label: "Hulu Selangor", value: "hulu_selangor" },
  { label: "Klang", value: "klang" },
  { label: "Kuala Langat", value: "kuala_langat" },
  { label: "Kuala Selangor", value: "kuala_selangor" },
  { label: "Petaling", value: "petaling" },
  { label: "Sabak Bernam", value: "sabak_bernam" },
  { label: "Sepang", value: "sepang" },
];

// Kariah options organized by daerah
const kariahByDaerah = {
  gombak: [
    { label: "Kariah Masjid Al-Hidayah", value: "Kariah Masjid Al-Hidayah" },
    { label: "Kariah Masjid Al-Ikhlas", value: "Kariah Masjid Al-Ikhlas" },
    { label: "Taman Seri Gombak", value: "Taman Seri Gombak" },
    { label: "Masjid Bandar Utama", value: "Masjid Bandar Utama" },
  ],
  hulu_langat: [
    { label: "Masjid Al-Amin Bangi", value: "Masjid Al-Amin Bangi" },
    { label: "Kariah Masjid Al-Muttaqin", value: "Kariah Masjid Al-Muttaqin" },
    { label: "Kariah Masjid Al-Rahman", value: "Kariah Masjid Al-Rahman" },
  ],
  hulu_selangor: [
    { label: "Batang Kali", value: "Batang Kali" },
    { label: "Kariah Masjid Al-Salam", value: "Kariah Masjid Al-Salam" },
  ],
  klang: [
    { label: "Kariah Masjid Al-Taqwa", value: "Kariah Masjid Al-Taqwa" },
    { label: "Kariah Masjid An-Nur", value: "Kariah Masjid An-Nur" },
    { label: "Masjid Al-Khairiyah", value: "Masjid Al-Khairiyah" },
  ],
  kuala_langat: [
    { label: "Kariah Masjid Ar-Rahman", value: "Kariah Masjid Ar-Rahman" },
    { label: "Kariah Masjid As-Salam", value: "Kariah Masjid As-Salam" },
  ],
  kuala_selangor: [
    { label: "Kariah Masjid At-Taqwa", value: "Kariah Masjid At-Taqwa" },
  ],
  petaling: [
    { label: "Masjid Negeri", value: "Masjid Negeri" },
    { label: "Masjid Sultan Salahuddin Abdul Aziz Shah", value: "Masjid Sultan Salahuddin Abdul Aziz Shah" },
    { label: "Masjid Al-Azim Pandan Indah", value: "Masjid Al-Azim Pandan Indah" },
    { label: "Masjid Wilayah Persekutuan", value: "Masjid Wilayah Persekutuan" },
    { label: "Masjid Damansara Perdana", value: "Masjid Damansara Perdana" },
  ],
  sabak_bernam: [
    { label: "Kariah Masjid Al-Hidayah", value: "Kariah Masjid Al-Hidayah" },
  ],
  sepang: [
    { label: "Kariah Masjid Al-Ikhlas", value: "Kariah Masjid Al-Ikhlas" },
  ],
};

// All kariah options for dropdown (fallback)
const kariahOptions = [
  { label: "Kariah Masjid Al-Hidayah", value: "Kariah Masjid Al-Hidayah" },
  { label: "Kariah Masjid Al-Ikhlas", value: "Kariah Masjid Al-Ikhlas" },
  { label: "Kariah Masjid Al-Muttaqin", value: "Kariah Masjid Al-Muttaqin" },
  { label: "Kariah Masjid Al-Rahman", value: "Kariah Masjid Al-Rahman" },
  { label: "Kariah Masjid Al-Salam", value: "Kariah Masjid Al-Salam" },
  { label: "Kariah Masjid Al-Taqwa", value: "Kariah Masjid Al-Taqwa" },
  { label: "Kariah Masjid An-Nur", value: "Kariah Masjid An-Nur" },
  { label: "Kariah Masjid Ar-Rahman", value: "Kariah Masjid Ar-Rahman" },
  { label: "Kariah Masjid As-Salam", value: "Kariah Masjid As-Salam" },
  { label: "Kariah Masjid At-Taqwa", value: "Kariah Masjid At-Taqwa" },
  { label: "Masjid Negeri", value: "Masjid Negeri" },
  { label: "Masjid Sultan Salahuddin Abdul Aziz Shah", value: "Masjid Sultan Salahuddin Abdul Aziz Shah" },
  { label: "Masjid Al-Azim Pandan Indah", value: "Masjid Al-Azim Pandan Indah" },
  { label: "Masjid Al-Amin Bangi", value: "Masjid Al-Amin Bangi" },
  { label: "Masjid Wilayah Persekutuan", value: "Masjid Wilayah Persekutuan" },
  { label: "Masjid Al-Khairiyah", value: "Masjid Al-Khairiyah" },
  { label: "Taman Seri Gombak", value: "Taman Seri Gombak" },
  { label: "Masjid Damansara Perdana", value: "Masjid Damansara Perdana" },
  { label: "Masjid Bandar Utama", value: "Masjid Bandar Utama" },
  { label: "Batang Kali", value: "Batang Kali" }
];

const formData = ref({
  searchName: "",
  searchDaerah: "",
  searchKariah: "",
  searchBankAccount: "",
  searchPhone: "",
  searchAddress: "",
  idType: "",
  idNumber: "",
});

// Enhanced mock database with proper kariah structure for presentation
const mockDatabase = [
  { 
    id: '123456789', 
    idType: 'myKad',
    name: 'Ali bin Abu', 
    daerah: 'gombak',
    kariah: 'Kariah Masjid Al-Hidayah', 
    bankAccount: '001122334455', 
    kategoriAsnaf: 'Fakir',
    phone: '012-3456789',
    email: 'ali.abu@email.com',
    registrationDate: '15/01/2023'
  },
  { 
    id: '987654321', 
    idType: 'myKad',
    name: 'Fatimah binti Ahmad', 
    daerah: 'gombak',
    kariah: 'Kariah Masjid Al-Ikhlas', 
    bankAccount: '005566778899', 
    kategoriAsnaf: 'Miskin',
    phone: '019-8765432',
    email: 'fatimah.ahmad@email.com',
    registrationDate: '22/03/2023'
  },
  { 
    id: '555666777', 
    idType: 'myKad',
    name: 'Ahmad bin Hassan', 
    daerah: 'hulu_langat',
    kariah: 'Kariah Masjid Al-Muttaqin', 
    bankAccount: '009988776655', 
    kategoriAsnaf: 'Fakir',
    phone: '011-2345678',
    email: 'ahmad.hassan@email.com',
    registrationDate: '08/07/2023'
  },
  { 
    id: '111222333', 
    idType: 'myKad',
    name: 'Siti binti Omar', 
    daerah: 'hulu_langat',
    kariah: 'Kariah Masjid Al-Rahman', 
    bankAccount: '004433221100', 
    kategoriAsnaf: 'Mualaf',
    phone: '016-7890123',
    email: 'siti.omar@email.com',
    registrationDate: '12/11/2023'
  },
  { 
    id: '888999000', 
    idType: 'myKad',
    name: 'Mohammad bin Ismail', 
    daerah: 'hulu_selangor',
    kariah: 'Kariah Masjid Al-Salam', 
    bankAccount: '007788990011', 
    kategoriAsnaf: 'Fakir',
    phone: '013-4567890',
    email: 'mohammad.ismail@email.com',
    registrationDate: '05/02/2023'
  },
  { 
    id: '444555666', 
    idType: 'myKad',
    name: 'Aminah binti Zulkifli', 
    daerah: 'klang',
    kariah: 'Kariah Masjid Al-Taqwa', 
    bankAccount: '002233445566', 
    kategoriAsnaf: 'Miskin',
    phone: '014-5678901',
    email: 'aminah.zulkifli@email.com',
    registrationDate: '18/04/2023'
  },
  { 
    id: '777888999', 
    idType: 'myKad',
    name: 'Hassan bin Abdullah', 
    daerah: 'klang',
    kariah: 'Kariah Masjid An-Nur', 
    bankAccount: '006677889900', 
    kategoriAsnaf: 'Fakir',
    phone: '015-6789012',
    email: 'hassan.abdullah@email.com',
    registrationDate: '30/05/2023'
  },
  { 
    id: '222333444', 
    idType: 'myKad',
    name: 'Noraini binti Kamal', 
    daerah: 'kuala_langat',
    kariah: 'Kariah Masjid Ar-Rahman', 
    bankAccount: '008899001122', 
    kategoriAsnaf: 'Mualaf',
    phone: '017-7890123',
    email: 'noraini.kamal@email.com',
    registrationDate: '14/06/2023'
  },
  { 
    id: '666777888', 
    idType: 'myKad',
    name: 'Ismail bin Rahman', 
    daerah: 'kuala_langat',
    kariah: 'Kariah Masjid As-Salam', 
    bankAccount: '003344556677', 
    kategoriAsnaf: 'Miskin',
    phone: '018-8901234',
    email: 'ismail.rahman@email.com',
    registrationDate: '25/08/2023'
  },
  { 
    id: '333444555', 
    idType: 'myKad',
    name: 'Zainab binti Yusof', 
    daerah: 'kuala_selangor',
    kariah: 'Kariah Masjid At-Taqwa', 
    bankAccount: '004455667788', 
    kategoriAsnaf: 'Fakir',
    phone: '019-9012345',
    email: 'zainab.yusof@email.com',
    registrationDate: '09/09/2023'
  },
  { 
    id: '999000111', 
    idType: 'myKad',
    name: 'Abdul Rahman bin Ali', 
    kariah: 'Masjid Negeri', 
    bankAccount: '001122334455', 
    kategoriAsnaf: 'Miskin',
    phone: '010-0123456',
    email: 'abdul.rahman@email.com',
    registrationDate: '20/10/2023'
  },
];

// Computed property for form validation
const isFormValid = computed(() => {
  // Allow search if at least one field is filled
  const hasSearchName = formData.value.searchName.trim() !== '';
  const hasSearchDaerah = formData.value.searchDaerah !== '';
  const hasSearchKariah = formData.value.searchKariah !== '';
  const hasSearchBankAccount = formData.value.searchBankAccount.trim() !== '';
  const hasSearchPhone = formData.value.searchPhone.trim() !== '';
  const hasSearchAddress = formData.value.searchAddress.trim() !== '';
  const hasIdType = formData.value.idType !== '';
  const hasIdNumber = formData.value.idNumber.trim() !== '';
  
  // At least one field must be filled
  const hasAtLeastOneField = hasSearchName || hasSearchDaerah || hasSearchKariah || hasSearchBankAccount || hasSearchPhone || hasSearchAddress || hasIdType || hasIdNumber;
  
  // Check for critical validation errors (only if they are non-empty strings)
  const hasCriticalErrors = (validationErrors.value.searchName && validationErrors.value.searchName.trim() !== '') || 
                           (validationErrors.value.searchBankAccount && validationErrors.value.searchBankAccount.trim() !== '') || 
                           (validationErrors.value.searchPhone && validationErrors.value.searchPhone.trim() !== '') || 
                           (validationErrors.value.searchAddress && validationErrors.value.searchAddress.trim() !== '') || 
                           (validationErrors.value.idNumber && validationErrors.value.idNumber.trim() !== '');
  
  return hasAtLeastOneField && !hasCriticalErrors;
});

const getPlaceholder = () => {
  switch (formData.value.idType) {
    case "myKad":
      return "Contoh: 123456789012 (12 digit)";
    case "foreignID":
      return "Masukkan Foreign ID";
    default:
      return "Sila pilih jenis ID dahulu";
  }
};

// Handler for daerah changes
const handleDaerahChange = () => {
  // Clear kariah selection when daerah changes
  formData.value.searchKariah = "";
  validationErrors.value.searchKariah = '';
  validationErrors.value.searchDaerah = '';
};

const getSelectedIdTypeLabel = (idType) => {
  const option = idTypeOptions.find(opt => opt.value === idType);
  return option ? option.label : idType;
};

const getKategoriAsnafVariant = (kategori) => {
  const variants = {
    'Fakir': 'text-red-600',
    'Miskin': 'text-orange-600', 
    'Mualaf': 'text-blue-600',
  };
  return variants[kategori] || 'text-gray-600';
};

const getKategoriAsnafBadge = (kategori) => {
  const badges = {
    'Fakir': 'bg-red-100 text-red-800 border-red-200',
    'Miskin': 'bg-orange-100 text-orange-800 border-orange-200', 
    'Mualaf': 'bg-blue-100 text-blue-800 border-blue-200'
  };
  return badges[kategori] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const getIdTypeIcon = (idType) => {
  const icons = {
    'myKad': 'mdi:card-account-details',
    'foreignID': 'mdi:passport'
  };
  return icons[idType] || 'mdi:card-account-details';
};

// Computed properties for search feedback
const hasSearchCriteria = computed(() => {
  return formData.value.searchName.trim() !== '' ||
         formData.value.searchDaerah !== '' ||
         formData.value.searchKariah !== '' ||
         formData.value.searchBankAccount.trim() !== '' ||
         formData.value.searchPhone.trim() !== '' ||
         formData.value.searchAddress.trim() !== '' ||
         formData.value.idNumber.trim() !== '';
});

const searchCriteriaText = computed(() => {
  const criteria = [];
  if (formData.value.searchName.trim()) criteria.push(`Nama: "${formData.value.searchName}"`);
  if (formData.value.searchDaerah) criteria.push(`Daerah: "${daerahOptions.find(d => d.value === formData.value.searchDaerah)?.label}"`);
  if (formData.value.searchKariah) criteria.push(`Kariah: "${formData.value.searchKariah}"`);
  if (formData.value.searchBankAccount.trim()) criteria.push(`Akaun Bank: "${formData.value.searchBankAccount}"`);
  if (formData.value.searchPhone.trim()) criteria.push(`Telefon: "${formData.value.searchPhone}"`);
  if (formData.value.searchAddress.trim()) criteria.push(`Alamat: "${formData.value.searchAddress}"`);
  if (formData.value.idNumber.trim()) criteria.push(`ID: "${formData.value.idNumber}"`);
  return criteria.join(', ');
});

// Computed property for filtered kariah options based on selected daerah
const filteredKariahOptions = computed(() => {
  if (!formData.value.searchDaerah) {
    return [];
  }
  return kariahByDaerah[formData.value.searchDaerah] || [];
});

// Pagination helper function
const getVisiblePages = () => {
  const pages = [];
  const maxVisible = 5;
  const start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages.value, start + maxVisible - 1);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
};

// Sorting function
const handleSort = (field) => {
  if (sortField.value === field) {
    // Toggle direction if same field
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    // New field, default to ascending
    sortField.value = field;
    sortDirection.value = 'asc';
  }
  // Reset to first page when sorting
  currentPage.value = 1;
};

// Get sort icon for table headers
const getSortIcon = (field) => {
  if (sortField.value !== field) {
    return 'mdi:unfold-more-horizontal';
  }
  return sortDirection.value === 'asc' ? 'mdi:chevron-up' : 'mdi:chevron-down';
};

// Get sort field label for display
const getSortFieldLabel = (field) => {
  const labels = {
    'idType': 'Jenis Pengenalan ID',
    'id': 'Pengenalan ID',
    'name': 'Nama',
    'kariah': 'Kariah',
    'kategoriAsnaf': 'Kategori Asnaf'
  };
  return labels[field] || field;
};

// Real-time validation
const validateField = (fieldName) => {
  const value = formData.value[fieldName];
  
  switch (fieldName) {
    case 'searchName':
      if (value.trim() === '') {
        validationErrors.value.searchName = '';
      } else if (value.length > 100) {
        validationErrors.value.searchName = 'Nama terlalu panjang (maksimum 100 aksara)';
      } else {
        validationErrors.value.searchName = '';
      }
      break;
      
    case 'searchDaerah':
      validationErrors.value.searchDaerah = '';
      break;
      
    case 'searchKariah':
      validationErrors.value.searchKariah = '';
      break;
      
    case 'searchBankAccount':
      if (value.trim() === '') {
        validationErrors.value.searchBankAccount = '';
      } else if (!/^\d+$/.test(value.replace(/\s/g, ''))) {
        validationErrors.value.searchBankAccount = 'Nombor akaun bank mesti mengandungi digit sahaja';
      } else if (value.length < 8 || value.length > 20) {
        validationErrors.value.searchBankAccount = 'Nombor akaun bank mesti 8-20 digit';
      } else {
        validationErrors.value.searchBankAccount = '';
      }
      break;
    
    case 'searchPhone':
      if (value.trim() === '') {
        validationErrors.value.searchPhone = '';
      } else if (!/^[0-9\-\s+()]+$/.test(value)) {
        validationErrors.value.searchPhone = 'Nombor telefon hanya boleh mengandungi digit dan - + ( )';
      } else if (value.replace(/[^0-9]/g, '').length < 7) {
        validationErrors.value.searchPhone = 'Nombor telefon terlalu pendek';
      } else {
        validationErrors.value.searchPhone = '';
      }
      break;

    case 'searchAddress':
      if (value.trim() === '') {
        validationErrors.value.searchAddress = '';
      } else if (value.length > 200) {
        validationErrors.value.searchAddress = 'Alamat terlalu panjang (maksimum 200 aksara)';
      } else {
        validationErrors.value.searchAddress = '';
      }
      break;
      
    case 'idType':
      // Clear ID number when ID type changes
      if (value === '') {
        formData.value.idNumber = '';
        validationErrors.value.idNumber = '';
      }
      validationErrors.value.idType = '';
      break;
      
    case 'idNumber':
      if (value.trim() === '') {
        validationErrors.value.idNumber = '';
      } else if (value.length > 20) {
        validationErrors.value.idNumber = 'Pengenalan ID terlalu panjang (maksimum 20 aksara)';
      } else if (formData.value.idType === 'myKad') {
        const cleanValue = value.replace(/\s/g, '');
        if (!/^\d{12}$/.test(cleanValue)) {
          validationErrors.value.idNumber = 'Format MyKad tidak sah (12 digit)';
        } else {
          validationErrors.value.idNumber = '';
        }
      } else if (formData.value.idType === 'foreignID' && value.trim().length < 3) {
        validationErrors.value.idNumber = 'Foreign ID mesti sekurang-kurangnya 3 aksara';
      } else {
        validationErrors.value.idNumber = '';
      }
      break;
  }
};

// Debounced validation to prevent validation on every keystroke
let validationTimeout = null;
const debouncedValidateField = (fieldName) => {
  // Clear previous timeout
  if (validationTimeout) {
    clearTimeout(validationTimeout);
  }
  
  // Set new timeout for validation
  validationTimeout = setTimeout(() => {
    validateField(fieldName);
  }, 500); // Wait 500ms after user stops typing
};

const resetForm = () => {
  formData.value.searchName = "";
  formData.value.searchDaerah = "";
  formData.value.searchKariah = "";
  formData.value.searchBankAccount = "";
  formData.value.searchPhone = "";
  formData.value.searchAddress = "";
  formData.value.idType = "";
  formData.value.idNumber = "";
  searchResults.value = [];
  selectedProfile.value = null;
  searchCompleted.value = false;
  errorMessage.value = "";
  currentPage.value = 1; // Reset pagination
  sortField.value = ''; // Reset sorting
  sortDirection.value = 'asc'; // Reset sorting direction
  validationErrors.value = {
    searchName: '',
    searchDaerah: '',
    searchKariah: '',
    searchBankAccount: '',
    searchPhone: '',
    searchAddress: '',
    idType: '',
    idNumber: ''
  };
};

const validateAndSearch = () => {
  errorMessage.value = ''; // Clear previous errors
  
  // Validate all fields
  validateField('searchName');
  validateField('searchDaerah');
  validateField('searchKariah');
  validateField('searchBankAccount');
  validateField('searchPhone');
  validateField('searchAddress');
  validateField('idType');
  validateField('idNumber');
  
  // Check if at least one field is filled
  const hasSearchName = formData.value.searchName.trim() !== '';
  const hasSearchDaerah = formData.value.searchDaerah !== '';
  const hasSearchKariah = formData.value.searchKariah !== '';
  const hasSearchBankAccount = formData.value.searchBankAccount.trim() !== '';
  const hasSearchPhone = formData.value.searchPhone.trim() !== '';
  const hasSearchAddress = formData.value.searchAddress.trim() !== '';
  const hasIdNumber = formData.value.idNumber.trim() !== '';
  const hasIdType = formData.value.idType !== '';
  
  // At least one field must be filled
  if (!hasSearchName && !hasSearchDaerah && !hasSearchKariah && !hasSearchBankAccount && !hasSearchPhone && !hasSearchAddress && !hasIdNumber && !hasIdType) {
    errorMessage.value = 'Sila isi sekurang-kurangnya satu maklumat untuk carian';
    return;
  }

  // Only check for critical validation errors (not empty field errors for flexible search)
  const criticalErrors = [];
  if (validationErrors.value.searchName) criticalErrors.push(validationErrors.value.searchName);
  if (validationErrors.value.searchBankAccount) criticalErrors.push(validationErrors.value.searchBankAccount);
  if (validationErrors.value.searchPhone) criticalErrors.push(validationErrors.value.searchPhone);
  if (validationErrors.value.searchAddress) criticalErrors.push(validationErrors.value.searchAddress);
  if (validationErrors.value.idNumber) criticalErrors.push(validationErrors.value.idNumber);
  
  if (criticalErrors.length > 0) {
    errorMessage.value = 'Sila betulkan ralat dalam borang';
    return;
  }

  performFlexibleSearch();
};

const performFlexibleSearch = async () => {
  processing.value = true;
  searchCompleted.value = false;
  searchResults.value = [];
  selectedProfile.value = null;
  currentPage.value = 1; // Reset to first page on new search
  sortField.value = ''; // Reset sorting on new search
  sortDirection.value = 'asc'; // Reset sorting direction on new search

  // Simulate API call delay
  setTimeout(() => {
    // Sanitize inputs
    const sanitizeInput = (input) => {
      return input.replace(/[<>]/g, '').trim();
    };
    
    const searchName = sanitizeInput(formData.value.searchName).toLowerCase();
    const searchDaerah = formData.value.searchDaerah;
    const searchKariah = formData.value.searchKariah;
    const searchBankAccount = sanitizeInput(formData.value.searchBankAccount);
    const searchPhone = sanitizeInput(formData.value.searchPhone).toLowerCase();
    const searchAddress = sanitizeInput(formData.value.searchAddress).toLowerCase();
    const idNumber = sanitizeInput(formData.value.idNumber);
    const idType = formData.value.idType;
    
    // Find matches based on any combination of filled fields
    const matches = mockDatabase.filter(profile => {
      let match = true;
      
      // Check name with advanced flexible search (handles complex name patterns)
      if (searchName) {
        const profileName = profile.name.toLowerCase();
        const searchTerms = searchName.toLowerCase().split(/\s*\.\s*/); // Split by dots for pattern matching
        
        // Handle different search patterns
        let nameMatch = false;
        
        if (searchTerms.length === 2) {
          // Pattern: "first . last" or "middle . last" or "last . first"
          const [term1, term2] = searchTerms;
          
          // Check if both terms exist in the name (in any order)
          const nameWords = profileName.split(' ');
          const hasTerm1 = nameWords.some(word => word.includes(term1.trim()));
          const hasTerm2 = nameWords.some(word => word.includes(term2.trim()));
          
          nameMatch = hasTerm1 && hasTerm2;
        } else {
          // Simple search: ALL parts of the name must be found (AND logic)
          const searchWords = searchName.toLowerCase().split(' ').filter(word => word.trim() !== '');
          const nameWords = profileName.split(' ');
          
          // Check if ALL search words are found in the name (AND logic)
          nameMatch = searchWords.every(searchWord => 
            nameWords.some(nameWord => nameWord.includes(searchWord.trim()))
          );
        }
        
        match = match && nameMatch;
      }
      
      // Check daerah (exact match)
      if (searchDaerah) {
        const daerahMatch = profile.daerah === searchDaerah;
        match = match && daerahMatch;
      }
      
      // Check kariah (exact match)
      if (searchKariah) {
        const kariahMatch = profile.kariah === searchKariah;
        match = match && kariahMatch;
      }
      
      // Check bank account (exact match)
      if (searchBankAccount) {
        const bankMatch = profile.bankAccount === searchBankAccount;
        match = match && bankMatch;
      }

      // Check phone (partial match)
      if (searchPhone) {
        const phoneNormalized = (profile.phone || '').toLowerCase();
        const phoneMatch = phoneNormalized.includes(searchPhone.replace(/\s/g, ''));
        match = match && phoneMatch;
      }

      // Check address (partial). Mock does not include address; fallback using name/kariah heuristics
      if (searchAddress) {
        const addressFields = [
          (profile.address || '').toLowerCase(),
          (profile.kariah || '').toLowerCase(),
          (profile.name || '').toLowerCase()
        ];
        const addressMatch = addressFields.some(f => f.includes(searchAddress));
        match = match && addressMatch;
      }
      
      // Check ID number (exact match)
      if (idNumber) {
        const idMatch = profile.id === idNumber;
        match = match && idMatch;
      }
      
      // Check ID type (if specified)
      if (idType) {
        // For now, we'll assume all profiles have MyKad type
        // In real implementation, you'd check the actual ID type
        match = match && true; // Placeholder for ID type check
      }
      
      return match;
    });

    if (matches.length > 0) {
      searchResults.value = matches;
      searchCompleted.value = true;
      processing.value = false;
      return;
    }

    // If no matches found
    errorMessage.value = 'Tiada profil ditemui dengan maklumat yang dimasukkan';
    searchResults.value = [];
    searchCompleted.value = true;
    processing.value = false;
  }, 1000);
};





// Enhanced functionality


const exportToPDF = () => {
  // PDF export implementation
  console.log('Exporting to PDF...');
  // In real implementation, use jsPDF or similar library
  alert('PDF export functionality akan diimplementasi');
};

const exportToExcel = () => {
  // Excel/CSV export implementation
  console.log('Exporting to Excel...');
  // In real implementation, use SheetJS or similar library
  alert('Excel export functionality akan diimplementasi');
};

const printResults = () => {
  // Print-friendly implementation
  console.log('Printing results...');
  window.print();
};

const mohonBantuan = (profile) => {
  // Navigate to new assistance application page with profile data
  navigateTo("/BF-BTN/mohon-bantuan");
};

const updateProfile = (profile) => {
  // Navigate to update profile page with profile data
  navigateTo("/BF-PRF/AS/UP/02");
};

const viewProfile = (profile) => {
  // Navigate to view profile page with profile data in read-only mode
  navigateTo("/BF-PRF/AS/FR/02_readonly");
};

const redirectToApplication = () => {
  // Navigate to new registration page
  navigateTo("/BF-PRF/AS/FR/02");
};

const handleSubmit = (data) => {
  validateAndSearch();
};

// Watch for changes in ID type to clear the ID number field
watch(
  () => formData.value.idType,
  () => {
    formData.value.idNumber = "";
    validateField('idNumber');
  }
);


</script>

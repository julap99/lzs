<!-- 
  RTMF SCREEN: PA-PP-KP-01_01 (Main Listing)
  PURPOSE: Perkhidmatan Penolong Amil - Main listing page
  DESCRIPTION: Main page for viewing and managing Penolong Amil service records
  ROUTE: /BF-PA/PP/KP
-->
<template>
  <div>
    <!-- Page-specific Role Switcher -->
    <div class="bg-gray-100 border-b border-gray-200 px-4 py-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <Icon name="ph:user-circle" class="text-gray-600" size="20" />
          <span class="text-sm font-medium text-gray-700">Peranan Pengguna:</span>
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
            <Icon name="ic:baseline-visibility" class="w-3 h-3 mr-1" />
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

    <!-- Enhanced Header Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <Icon name="ph:gear" class="w-6 h-6 mr-3 text-primary" />
            Penamatan Jawatan
          </h1>
        </div>
        <div class="flex gap-2">
          <!-- Button removed as PP/KP doesn't handle adding new data/services -->
        </div>
      </div>
    </div>

    <!-- Enhanced Data Table -->
    <rs-card>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Senarai Perkhidmatan Penolong Amil</h3>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">{{ filteredRequests.length }} daripada {{ requests.length }} rekod</span>
            <rs-button
              variant="secondary-outline"
              size="sm"
              @click="exportData"
              class="flex items-center"
            >
              <Icon name="ph:download" class="w-4 h-4 mr-1" />
              Muat Turun
            </rs-button>
          </div>
        </div>
      </template>
      <template #body>
        <!-- Status Tabs -->
        <rs-tab v-model="activeStatusTab" class="mt-4">
          <rs-tab-item title="Aktif">
            <div class="p-4">
              <div class="overflow-x-auto rounded-lg border">
                <table class="min-w-full text-sm divide-y">
                  <thead class="bg-gray-50 text-left">
                    <tr>
                      <th class="px-4 py-3 font-medium text-gray-900">No Rujukan</th>
                      <th class="px-4 py-3 font-medium text-gray-900">Nama</th>
                      <th class="px-4 py-3 font-medium text-gray-900">ID Pengenalan</th>
                      <th class="px-4 py-3 font-medium text-gray-900">Kategori</th>
                      <th class="px-4 py-3 font-medium text-gray-900">Sesi</th>
                      <th class="px-4 py-3 font-medium text-gray-900">Daerah</th>
                      <th class="px-4 py-3 font-medium text-gray-900">Institusi</th>
                      <th class="px-4 py-3 font-medium text-gray-900">Status</th>
                      <th class="px-4 py-3 font-medium text-gray-900">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y bg-white">
                    <tr v-for="request in getTabRequests('aktif')" :key="request.id" class="hover:bg-gray-50">
                      <td class="px-4 py-3 text-gray-900">{{ request.noRujukan || request.rujukan }}</td>
                      <td class="px-4 py-3 text-gray-900">{{ request.nama || request.penolongAmil?.nama }}</td>
                      <td class="px-4 py-3 text-gray-900">{{ request.idPengenalan || request.penolongAmil?.noKP }}</td>
                      <td class="px-4 py-3 text-gray-900">{{ request.kategori || request.newKategori }}</td>
                      <td class="px-4 py-3 text-gray-900">{{ request.sesi || request.newSesi }}</td>
                      <td class="px-4 py-3 text-gray-900">{{ request.daerah || request.newDaerah }}</td>
                      <td class="px-4 py-3 text-gray-900">{{ request.institusi || request.newInstitusi }}</td>
                      <td class="px-4 py-3">
                        <rs-badge :variant="getStatusVariant(request.status)">
                          {{ getStatusLabel(request.status) }}
                        </rs-badge>
                      </td>
                      <td class="px-4 py-3">
                        <div class="flex space-x-3">
                          <button
                            @click="viewRequest(request)"
                            title="Lihat"
                            class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                          >
                            <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                          </button>
                          <!-- PYB Institusi specific actions -->
                          <template v-if="currentRole === 'pyb-institusi'">
                            <button
                              v-if="request.status === 'aktif'"
                              @click="terminateService(request)"
                              title="Tamatkan"
                              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Icon name="ic:outline-cancel" class="w-5 h-5 text-danger" />
                            </button>
                            <button
                              @click="sendWarningLetter(request)"
                              title="Surat Amaran"
                              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Icon name="ic:baseline-mail" class="w-5 h-5 text-warning" />
                            </button>
                          </template>
                          
                          <!-- Ketua Divisyen specific actions -->
                          <template v-if="currentRole === 'ketua-divisyen'">
                            <button
                              v-if="request.status === 'aktif' || request.status === 'suspended'"
                              @click="approveService(request)"
                              title="Lulus"
                              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Icon name="ic:baseline-check-circle" class="w-5 h-5 text-success" />
                            </button>
                          </template>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="getTabRequests('aktif').length === 0" class="hover:bg-gray-50">
                      <td class="px-4 py-6 text-center text-gray-500" colspan="9">
                        Tiada rekod Aktif ditemui.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </rs-tab-item>

          <rs-tab-item title="Dalam Pemerhatian">
            <div class="p-4">
              <div class="overflow-x-auto rounded-lg border">
                <table class="min-w-full text-sm divide-y">
                  <thead class="bg-gray-50 text-left">
                    <tr>
                      <th class="px-4 py-3 font-medium text-gray-900">No Rujukan</th>
                      <th class="px-4 py-3 font-medium text-gray-900">Nama</th>
                      <th class="px-4 py-3 font-medium text-gray-900">ID Pengenalan</th>
                      <th class="px-4 py-3 font-medium text-gray-900">Kategori</th>
                      <th class="px-4 py-3 font-medium text-gray-900">Sesi</th>
                      <th class="px-4 py-3 font-medium text-gray-900">Daerah</th>
                      <th class="px-4 py-3 font-medium text-gray-900">Institusi</th>
                      <th class="px-4 py-3 font-medium text-gray-900">Status</th>
                      <th class="px-4 py-3 font-medium text-gray-900">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y bg-white">
                    <tr v-for="request in getTabRequests('suspended')" :key="request.id" class="hover:bg-gray-50">
                      <td class="px-4 py-3 text-gray-900">{{ request.noRujukan || request.rujukan }}</td>
                      <td class="px-4 py-3 text-gray-900">{{ request.nama || request.penolongAmil?.nama }}</td>
                      <td class="px-4 py-3 text-gray-900">{{ request.idPengenalan || request.penolongAmil?.noKP }}</td>
                      <td class="px-4 py-3 text-gray-900">{{ request.kategori || request.newKategori }}</td>
                      <td class="px-4 py-3 text-gray-900">{{ request.sesi || request.newSesi }}</td>
                      <td class="px-4 py-3 text-gray-900">{{ request.daerah || request.newDaerah }}</td>
                      <td class="px-4 py-3 text-gray-900">{{ request.institusi || request.newInstitusi }}</td>
                      <td class="px-4 py-3">
                        <rs-badge :variant="getStatusVariant(request.status)">
                          {{ getStatusLabel(request.status) }}
                        </rs-badge>
                      </td>
                      <td class="px-4 py-3">
                        <div class="flex space-x-3">
                          <button
                            @click="viewRequest(request)"
                            title="Lihat"
                            class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                          >
                            <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                          </button>
                          <!-- PYB Institusi specific actions -->
                          <template v-if="currentRole === 'pyb-institusi'">
                            <button
                              @click="terminateService(request)"
                              title="Tamatkan"
                              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Icon name="ic:outline-cancel" class="w-5 h-5 text-danger" />
                            </button>
                            <button
                              @click="sendWarningLetter(request)"
                              title="Surat Amaran"
                              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Icon name="ic:baseline-mail" class="w-5 h-5 text-warning" />
                            </button>
                          </template>
                          
                          <!-- Ketua Divisyen specific actions -->
                          <template v-if="currentRole === 'ketua-divisyen'">
                            <button
                              @click="approveService(request)"
                              title="Lulus"
                              class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                              <Icon name="ic:baseline-check-circle" class="w-5 h-5 text-success" />
                            </button>
                          </template>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="getTabRequests('suspended').length === 0" class="hover:bg-gray-50">
                      <td class="px-4 py-6 text-center text-gray-500" colspan="9">
                        Tiada rekod Dalam Pemerhatian ditemui.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </rs-tab-item>

          <rs-tab-item title="Telah Ditamatkan">
            <div class="p-4">
              <div class="overflow-x-auto rounded-lg border">
                <table class="min-w-full text-sm divide-y">
                  <thead class="bg-gray-50 text-left">
                    <tr>
                      <th class="px-4 py-3 font-medium text-gray-900">No Rujukan</th>
                      <th class="px-4 py-3 font-medium text-gray-900">Nama</th>
                      <th class="px-4 py-3 font-medium text-gray-900">ID Pengenalan</th>
                      <th class="px-4 py-3 font-medium text-gray-900">Kategori</th>
                      <th class="px-4 py-3 font-medium text-gray-900">Sesi</th>
                      <th class="px-4 py-3 font-medium text-gray-900">Daerah</th>
                      <th class="px-4 py-3 font-medium text-gray-900">Institusi</th>
                      <th class="px-4 py-3 font-medium text-gray-900">Status</th>
                      <th class="px-4 py-3 font-medium text-gray-900">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y bg-white">
                    <tr v-for="request in getTabRequests('terminated')" :key="request.id" class="hover:bg-gray-50">
                      <td class="px-4 py-3 text-gray-900">{{ request.noRujukan || request.rujukan }}</td>
                      <td class="px-4 py-3 text-gray-900">{{ request.nama || request.penolongAmil?.nama }}</td>
                      <td class="px-4 py-3 text-gray-900">{{ request.idPengenalan || request.penolongAmil?.noKP }}</td>
                      <td class="px-4 py-3 text-gray-900">{{ request.kategori || request.newKategori }}</td>
                      <td class="px-4 py-3 text-gray-900">{{ request.sesi || request.newSesi }}</td>
                      <td class="px-4 py-3 text-gray-900">{{ request.daerah || request.newDaerah }}</td>
                      <td class="px-4 py-3 text-gray-900">{{ request.institusi || request.newInstitusi }}</td>
                      <td class="px-4 py-3">
                        <rs-badge :variant="getStatusVariant(request.status)">
                          {{ getStatusLabel(request.status) }}
                        </rs-badge>
                      </td>
                      <td class="px-4 py-3">
                        <div class="flex space-x-3">
                          <button
                            @click="viewRequest(request)"
                            title="Lihat"
                            class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
                          >
                            <Icon name="ic:baseline-visibility" class="w-5 h-5 text-primary" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="getTabRequests('terminated').length === 0" class="hover:bg-gray-50">
                      <td class="px-4 py-6 text-center text-gray-500" colspan="9">
                        Tiada rekod Telah Ditamatkan ditemui.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </rs-tab-item>
        </rs-tab>
      </template>
    </rs-card>

    <!-- Enhanced Notifications -->
    <div v-if="showNotification" class="fixed top-4 right-4 z-50">
      <rs-card class="shadow-lg border-l-4 border-success">
        <template #body>
          <div class="flex items-center">
            <Icon name="ic:baseline-check-circle" class="w-5 h-5 text-success mr-3" />
            <div>
              <div class="font-medium text-gray-900">{{ notificationTitle }}</div>
              <div class="text-sm text-gray-600">{{ notificationMessage }}</div>
            </div>
            <button @click="hideNotification" class="ml-4 text-gray-400 hover:text-gray-600">
              <Icon name="ic:baseline-close" class="w-4 h-4" />
            </button>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Warning Letter Modal -->
    <rs-modal v-model="showWarningModal" title="Hantar Surat Amaran" size="xl">
      <template #header>
        <div class="flex items-center">
          <Icon name="ic:baseline-warning" class="w-5 h-5 text-warning mr-2" />
          <h3 class="text-lg font-semibold text-gray-900">Hantar Surat Amaran</h3>
        </div>
      </template>
      
      <div class="p-6">
        <!-- Request Information Display -->
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <h4 class="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Icon name="ph:info" class="w-4 h-4 mr-2 text-gray-600" />
            Maklumat Penolong Amil
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Nama</label>
              <div class="text-sm text-gray-900 font-medium">{{ currentWarningRequest?.nama || 'N/A' }}</div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">ID Pengenalan</label>
              <div class="text-sm text-gray-900 font-medium">{{ currentWarningRequest?.idPengenalan || 'N/A' }}</div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Kategori</label>
              <div class="text-sm text-gray-900 font-medium">{{ currentWarningRequest?.kategori || 'N/A' }}</div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Sesi</label>
              <div class="text-sm text-gray-900 font-medium">{{ currentWarningRequest?.sesi || 'N/A' }}</div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Daerah</label>
              <div class="text-sm text-gray-900 font-medium">{{ currentWarningRequest?.daerah || 'N/A' }}</div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Institusi</label>
              <div class="text-sm text-gray-900 font-medium">{{ currentWarningRequest?.institusi || 'N/A' }}</div>
            </div>
          </div>
        </div>
        
        <!-- Warning Letter Form -->
        <div class="space-y-6">
          <!-- File Upload Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Muat Naik Minit Mesyuarat
            </label>
            <FormKit
              type="file"
              v-model="warningLetterData.file"
              accept=".pdf,.doc,.docx"
              :classes="{
                input: 'block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary-dark',
                wrapper: 'w-full'
              }"
              validation="required"
              validation-label="Fail surat amaran"
              @change="handleFileChange"
            />
            <p class="mt-1 text-xs text-gray-500">
              Format yang diterima: PDF, DOC, DOCX (Maksimum 5MB)
            </p>
          </div>
          
          <!-- Notes Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Catatan
            </label>
            <FormKit
              type="textarea"
              v-model="warningLetterData.notes"
              placeholder="Masukkan catatan atau arahan tambahan untuk surat amaran ini..."
              :classes="{
                input: 'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm',
                wrapper: 'w-full'
              }"
              rows="6"
              maxlength="500"
              validation="required|length:10,500"
              validation-label="Catatan"
              @input="validateNotes"
            />
            <div class="flex justify-between items-center mt-1">
              <p class="text-xs text-gray-500">
                Minimum 10 aksara, maksimum 500 aksara
              </p>
              <span class="text-xs" :class="getNotesCounterClass()">
                {{ warningLetterData.notes.length }}/500
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="secondary-outline"
            @click="closeWarningModal"
          >
            Batal
          </rs-button>
          <rs-button
            variant="warning"
            @click="submitWarningLetter"
            :disabled="!isFormValid || isSubmitting"
          >
            <Icon v-if="!isSubmitting" name="ph:paper-plane" class="w-4 h-4 mr-2" />
            <Icon v-else name="ph:spinner" class="w-4 h-4 mr-2 animate-spin" />
            {{ isSubmitting ? 'Menghantar...' : 'Hantar Surat Amaran' }}
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Terminate Service Modal -->
    <rs-modal v-model="showTerminateModal" title="Tamatkan Perkhidmatan Penolong Amil" size="2xl">
      <template #header>
        <div class="flex items-center">
          <Icon name="ic:outline-cancel" class="w-6 h-6 text-danger mr-3" />
          <h3 class="text-lg font-semibold text-gray-900">Tamatkan Perkhidmatan Penolong Amil</h3>
        </div>
      </template>
      
      <div class="p-6">
        <!-- Warning Alert -->
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div class="flex items-start">
            <Icon name="ph:warning" class="w-5 h-5 text-red-600 mr-3 mt-0.5" />
            <div>
              <h4 class="font-semibold text-red-900 mb-2">Peringatan Penting</h4>
              <p class="text-sm text-red-800">
                Tindakan ini akan menamatkan perkhidmatan penolong amil secara kekal. 
                Sila pastikan semua prosedur telah diikuti dan dokumentasi lengkap sebelum meneruskan.
              </p>
            </div>
          </div>
        </div>

        <!-- Penolong Amil Full Profile Information -->
        <div class="space-y-6">
          <!-- Personal Information -->
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 class="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <Icon name="ph:user" class="w-4 h-4 mr-2 text-gray-600" />
              Maklumat Peribadi
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Nama Penuh</label>
                <div class="text-sm text-gray-900 font-medium">{{ currentTerminateRequest?.nama || 'N/A' }}</div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Nombor Kad Pengenalan</label>
                <div class="text-sm text-gray-900 font-medium">{{ currentTerminateRequest?.idPengenalan || 'N/A' }}</div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Jantina</label>
                <div class="text-sm text-gray-900">{{ currentTerminateRequest?.jantina || 'N/A' }}</div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Status Perkahwinan</label>
                <div class="text-sm text-gray-900">{{ currentTerminateRequest?.statusPerkahwinan || 'N/A' }}</div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Bangsa</label>
                <div class="text-sm text-gray-900">{{ currentTerminateRequest?.bangsa || 'N/A' }}</div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Agama</label>
                <div class="text-sm text-gray-900">{{ currentTerminateRequest?.agama || 'Islam' }}</div>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 class="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <Icon name="ph:phone" class="w-4 h-4 mr-2 text-gray-600" />
              Maklumat Perhubungan
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Alamat</label>
                <div class="text-sm text-gray-900">{{ currentTerminateRequest?.alamat || 'N/A' }}</div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Negeri</label>
                <div class="text-sm text-gray-900">{{ currentTerminateRequest?.negeri || 'N/A' }}</div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Daerah</label>
                <div class="text-sm text-gray-900">{{ currentTerminateRequest?.daerah || 'N/A' }}</div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Bandar</label>
                <div class="text-sm text-gray-900">{{ currentTerminateRequest?.bandar || 'N/A' }}</div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Poskod</label>
                <div class="text-sm text-gray-900">{{ currentTerminateRequest?.poskod || 'N/A' }}</div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Nombor Telefon</label>
                <div class="text-sm text-gray-900">{{ currentTerminateRequest?.noTelefon || 'N/A' }}</div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Nombor Telefon Bimbit</label>
                <div class="text-sm text-gray-900">{{ currentTerminateRequest?.noTelefonBimbit || 'N/A' }}</div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Alamat E-mel</label>
                <div class="text-sm text-gray-900">{{ currentTerminateRequest?.emel || 'N/A' }}</div>
              </div>
            </div>
          </div>

          <!-- Service Information -->
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 class="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <Icon name="ph:briefcase" class="w-4 h-4 mr-2 text-gray-600" />
              Maklumat Perkhidmatan
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Kategori</label>
                <div class="text-sm text-gray-900 font-medium">{{ currentTerminateRequest?.kategori || 'N/A' }}</div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Sesi</label>
                <div class="text-sm text-gray-900 font-medium">{{ currentTerminateRequest?.sesi || 'N/A' }}</div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Institusi</label>
                <div class="text-sm text-gray-900 font-medium">{{ currentTerminateRequest?.institusi || 'N/A' }}</div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Status Semasa</label>
                <div class="text-sm">
                  <rs-badge variant="success">Aktif</rs-badge>
                </div>
              </div>
            </div>
          </div>

          <!-- Employment & Education Information -->
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 class="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <Icon name="ph:graduation-cap" class="w-4 h-4 mr-2 text-gray-600" />
              Maklumat Pekerjaan & Pendidikan
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Pekerjaan</label>
                <div class="text-sm text-gray-900">{{ currentTerminateRequest?.pekerjaan || 'N/A' }}</div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Nama Majikan</label>
                <div class="text-sm text-gray-900">{{ currentTerminateRequest?.namaMajikan || 'N/A' }}</div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Tahap Pendidikan</label>
                <div class="text-sm text-gray-900">{{ currentTerminateRequest?.tahapPendidikan || 'N/A' }}</div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Institusi Pendidikan</label>
                <div class="text-sm text-gray-900">{{ currentTerminateRequest?.institusiPendidikan || 'N/A' }}</div>
              </div>
            </div>
          </div>

          <!-- Service Performance & Context -->
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 class="text-sm font-semibold text-blue-900 mb-3 flex items-center">
              <Icon name="ph:chart-line" class="w-4 h-4 mr-2 text-blue-600" />
              Maklumat Prestasi & Konteks Perkhidmatan
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-blue-700 mb-1">Tarikh Mula Perkhidmatan</label>
                <div class="text-sm text-blue-900 font-medium">{{ currentTerminateRequest?.tarikhMulaPerkhidmatan || 'N/A' }}</div>
              </div>
              <div>
                <label class="block text-xs font-medium text-blue-700 mb-1">Tempoh Perkhidmatan</label>
                <div class="text-sm text-blue-900 font-medium">{{ currentTerminateRequest?.tempohPerkhidmatan || 'N/A' }}</div>
              </div>
              <div>
                <label class="block text-xs font-medium text-blue-700 mb-1">Jumlah Surat Amaran</label>
                <div class="text-sm">
                  <rs-badge :variant="getWarningCountVariant(currentTerminateRequest?.jumlahSuratAmaran)" size="sm">
                    {{ currentTerminateRequest?.jumlahSuratAmaran || '0' }} surat
                  </rs-badge>
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-blue-700 mb-1">Status Terakhir</label>
                <div class="text-sm">
                  <rs-badge :variant="getStatusVariant(currentTerminateRequest?.statusTerakhir)" size="sm">
                    {{ currentTerminateRequest?.statusTerakhir || 'N/A' }}
                  </rs-badge>
                </div>
              </div>
            </div>
          </div>

          <!-- Warning Letter History -->
          <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 class="text-sm font-semibold text-yellow-900 mb-3 flex items-center">
              <Icon name="ph:warning" class="w-4 h-4 mr-2 text-yellow-600" />
              Sejarah Surat Amaran
            </h4>
            <div class="space-y-2">
              <div v-if="currentTerminateRequest?.jumlahSuratAmaran >= 1" class="flex items-center justify-between p-2 bg-white rounded border border-yellow-200">
                <div>
                  <div class="text-sm font-medium text-gray-900">Surat Amaran #1</div>
                  <div class="text-xs text-gray-600">Tarikh: 15-01-2024 | Sebab: Tidak hadir mesyuarat bulanan tanpa sebab yang munasabah</div>
                </div>
                <rs-badge variant="warning" size="sm">Dihantar</rs-badge>
              </div>
              <div v-if="currentTerminateRequest?.jumlahSuratAmaran >= 2" class="flex items-center justify-between p-2 bg-white rounded border border-yellow-200">
                <div>
                  <div class="text-sm font-medium text-gray-900">Surat Amaran #2</div>
                  <div class="text-xs text-gray-600">Tarikh: 20-02-2024 | Sebab: Gagal mematuhi arahan dan peraturan yang ditetapkan</div>
                </div>
                <rs-badge variant="warning" size="sm">Dihantar</rs-badge>
              </div>
              <div v-if="currentTerminateRequest?.jumlahSuratAmaran >= 3" class="flex items-center justify-between p-2 bg-white rounded border border-yellow-200">
                <div>
                  <div class="text-sm font-medium text-gray-900">Surat Amaran #3</div>
                  <div class="text-xs text-gray-600">Tarikh: 10-03-2024 | Sebab: Pelanggaran berulang terhadap kod etika perkhidmatan</div>
                </div>
                <rs-badge variant="danger" size="sm">Final Warning</rs-badge>
              </div>
              <div v-if="!currentTerminateRequest?.jumlahSuratAmaran || currentTerminateRequest?.jumlahSuratAmaran === '0'" class="p-3 bg-green-50 border border-green-200 rounded text-center">
                <div class="text-sm text-green-800">
                  <Icon name="ph:check-circle" class="w-4 h-4 inline mr-1" />
                  Tiada surat amaran dihantar - Rekod bersih
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Termination Form -->
        <div class="mt-6 space-y-6">
          <h4 class="text-md font-semibold text-gray-900 border-b pb-2">
            Maklumat Penamatan
          </h4>
          
                     <!-- Termination Reason -->
           <div>
             <div v-if="!terminateData.reason" class="mb-2 text-sm text-red-600">
               Sila pilih sebab penamatan perkhidmatan
             </div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Sebab Penamatan Perkhidmatan *
            </label>
                         <FormKit
               type="select"
               v-model="terminateData.reason"
               :options="terminationReasonOptions"
               :classes="{
                 input: 'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm',
                 wrapper: 'w-full'
               }"
               validation="required"
               validation-label="Sebab penamatan"
               @change="validateTerminationReason"
             />
          </div>

                     <!-- Custom Reason -->
           <div v-if="terminateData.reason === 'lain-lain'">
             <div v-if="terminateData.reason === 'lain-lain' && !terminateData.customReason" class="mb-2 text-sm text-red-600">
               Sila nyatakan sebab penamatan yang spesifik
             </div>
             <label class="block text-sm font-medium text-gray-700 mb-2">
               Sebab Lain-lain *
             </label>
             <FormKit
               type="textarea"
               v-model="terminateData.customReason"
               placeholder="Nyatakan sebab penamatan yang spesifik..."
               :classes="{
                 input: 'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm',
                 wrapper: 'w-full'
               }"
               rows="4"
               maxlength="500"
               validation="required|length:10,500"
               validation-label="Sebab penamatan"
               @input="validateCustomReason"
             />
             <div class="flex justify-between items-center mt-1">
               <p class="text-xs text-gray-500">
                 Maksimum 500 aksara
               </p>
               <span class="text-xs text-gray-500">
                 {{ terminateData.customReason.length }}/500
               </span>
             </div>
           </div>

                     <!-- Supporting Documents -->
           <div>
             <div v-if="!terminateData.supportingDocuments" class="mb-2 text-sm text-red-600">
               Sila muat naik minit mesyuarat
             </div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Muat Naik Minit Mesyuarat *
            </label>
                         <FormKit
               type="file"
               v-model="terminateData.supportingDocuments"
               accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
               :classes="{
                 input: 'block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-danger file:text-white hover:file:bg-red-700',
                 wrapper: 'w-full'
               }"
               validation="required"
               validation-label="Minit mesyuarat"
               @change="handleTerminateFileChange"
             />
             <div v-if="terminateFileError" class="mt-1 text-sm text-red-600">
               {{ terminateFileError }}
             </div>
          </div>

          <!-- Additional Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Catatan Tambahan
            </label>
                         <FormKit
               type="textarea"
               v-model="terminateData.additionalNotes"
               placeholder="Masukkan catatan tambahan atau arahan khusus untuk penamatan ini..."
               :classes="{
                 input: 'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm',
                 wrapper: 'w-full'
               }"
               rows="4"
               maxlength="1000"
               @input="validateAdditionalNotes"
             />
            <div class="flex justify-between items-center mt-1">
              <p class="text-xs text-gray-500">
                Maksimum 1000 aksara
              </p>
              <span class="text-xs text-gray-500">
                {{ terminateData.additionalNotes.length }}/1000
              </span>
            </div>
          </div>

                     <!-- Confirmation Checkbox -->
           <div class="bg-red-50 border border-red-200 rounded-lg p-4">
             <div v-if="!terminateData.confirmation" class="mb-2 text-sm text-red-600">
               Sila sahkan bahawa anda bersetuju untuk menamatkan perkhidmatan
             </div>
            <div class="flex items-start">
                             <FormKit
                 type="checkbox"
                 v-model="terminateData.confirmation"
                 :classes="{
                   input: 'mt-1 h-4 w-4 text-danger focus:ring-danger border-gray-300 rounded',
                   wrapper: 'flex items-start'
                 }"
                 validation="required"
                 validation-label="Pengesahan"
                 @change="validateConfirmation"
               />
              <div class="ml-3">
                <label class="text-sm font-medium text-red-900">
                  Saya mengesahkan bahawa saya telah mempertimbangkan semua aspek dan bersetuju untuk menamatkan perkhidmatan penolong amil ini
                </label>
                <p class="text-xs text-red-700 mt-1">
                  Tindakan ini tidak boleh dibatalkan dan akan menamatkan perkhidmatan secara kekal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="secondary-outline"
            @click="closeTerminateModal"
          >
            Batal
          </rs-button>
          <rs-button
            variant="danger"
            @click="submitTermination"
            :disabled="!isTerminateFormValid || isTerminateSubmitting"
          >
            <Icon v-if="!isTerminateSubmitting" name="ph:check" class="w-4 h-4 mr-2" />
            <Icon v-else name="ph:spinner" class="w-4 h-4 mr-2 animate-spin" />
            {{ isTerminateSubmitting ? 'Memproses...' : 'Tamatkan Perkhidmatan' }}
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { formatDate } from "~/utils/dateFormatter";

definePageMeta({
  title: "Perkhidmatan Penolong Amil",
  breadcrumb: [
    {
      name: "BF-PA",
      type: "link",
      path: "/BF-PA",
    },
    {
      name: "PP",
      type: "link",
      path: "/BF-PA/PP",
    },
    {
      name: "Perkhidmatan Penolong Amil",
      type: "current",
      path: "/BF-PA/PP/KP",
    },
  ],
});

// Enhanced reactive data
const breadcrumb = ref([
  {
    name: "BF-PA",
    type: "link",
    path: "/BF-PA",
  },
  {
    name: "PP",
    type: "link",
    path: "/BF-PA/PP",
  },
  {
    name: "Perkhidmatan Penolong Amil",
    type: "current",
    path: "/BF-PA/PP/KP",
  },
]);

// Simplified filters
const filters = ref({
  searchQuery: "",
  status: "",
  kategori: "",
  institusi: "",
  sesi: "",
  daerah: "",
});

// Enhanced pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Status tab dashboard
const activeStatusTab = ref("aktif");

// Status tabs configuration
const statusTabs = [
  { value: "aktif", label: "Aktif" },
  { value: "suspended", label: "Dalam Pemerhatian" },
  { value: "terminated", label: "Telah Ditamatkan" },
];

// Enhanced notifications
const showNotification = ref(false);
const notificationTitle = ref("");
const notificationMessage = ref("");

// Warning Letter Modal State
const showWarningModal = ref(false);
const warningLetterData = ref({
  file: null,
  notes: "",
});
const currentWarningRequest = ref(null);
const fileError = ref("");
const isSubmitting = ref(false);

// Terminate Service Modal State
const showTerminateModal = ref(false);
const terminateData = ref({
  reason: "",
  customReason: "",
  supportingDocuments: null,
  additionalNotes: "",
  confirmation: false,
});
const currentTerminateRequest = ref(null);
const terminateFileError = ref("");
const isTerminateSubmitting = ref(false);

// Enhanced options
const statusOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "Aktif", value: "aktif" },
  { label: "Dalam Pemerhatian", value: "suspended" },
  { label: "Telah Ditamatkan", value: "terminated" },
];

const kategoriOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "Penolong Amil Fitrah", value: "fitrah" },
  { label: "Penolong Amil Padi", value: "padi" },
  { label: "Penolong Amil Kariah", value: "kariah" },
  { label: "Penolong Amil Komuniti", value: "komuniti" },
];

const institusiOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "Masjid Al-Hidayah", value: "masjid_al_hidayah" },
  { label: "Surau Al-Amin", value: "surau_al_amin" },
  { label: "Kompleks Islam", value: "kompleks_islam" },
];

const sesiOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "2023/2024", value: "2023/2024" },
  { label: "2024/2025", value: "2024/2025" },
  { label: "2025/2026", value: "2025/2026" },
];

const daerahOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "Kuala Lumpur", value: "kuala_lumpur" },
  { label: "Selangor", value: "selangor" },
  { label: "Johor", value: "johor" },
  { label: "Pahang", value: "pahang" },
  { label: "Terengganu", value: "terengganu" },
  { label: "Kedah", value: "kedah" },
  { label: "Negeri Sembilan", value: "negeri_sembilan" },
  { label: "Melaka", value: "melaka" },
  { label: "Perak", value: "perak" },
  { label: "Kelantan", value: "kelantan" },
];

const terminationReasonOptions = [
  { label: "Sila pilih...", value: "" },
  { label: "Tidak hadir mesyuarat tanpa sebab yang munasabah", value: "tidak_hadir_mesyuarat" },
  { label: "Gagal mematuhi arahan dan peraturan yang ditetapkan", value: "gagal_mematuhi_arahan" },
  { label: "Pelanggaran berulang terhadap kod etika perkhidmatan", value: "pelanggaran_berulang" },
  { label: "Tidak menunaikan tanggungjawab sebagai Penolong Amil", value: "tidak_menunaikan_tanggungjawab" },
  { label: "Tingkah laku yang tidak sesuai dengan imej institusi", value: "tingkah_laku_tidak_sesuai" },
  { label: "Kemudaratan kepada kepentingan awam dan agama", value: "kemudaratan_kepentingan_awam" },
  { label: "Lain-lain", value: "lain-lain" },
];

// Enhanced mock data with new structure
const requests = ref([
  {
    id: "KP001",
    noRujukan: "KP-2024-001",
    nama: "Ahmad bin Abdullah",
    idPengenalan: "901231012345",
    kategori: "Penolong Amil Kariah",
    sesi: "2024/2025",
    daerah: "Kuala Lumpur",
    institusi: "Surau Al-Amin",
    status: "aktif",
    // Enhanced profile data
    jantina: "Lelaki",
    statusPerkahwinan: "Berkahwin",
    bangsa: "Melayu",
    agama: "Islam",
    alamat: "No. 123, Jalan Utama, Taman Seri Indah, 43000 Kajang, Selangor",
    negeri: "Selangor",
    daerah: "Hulu Langat",
    bandar: "Kajang",
    poskod: "43000",
    noTelefon: "03-8736 1234",
    noTelefonBimbit: "012-345 6789",
    emel: "ahmad.abdullah@email.com",
    pekerjaan: "Pegawai Kerajaan",
    namaMajikan: "Jabatan Agama Islam Selangor",
    tahapPendidikan: "Ijazah Sarjana Muda",
    institusiPendidikan: "Universiti Islam Antarabangsa Malaysia",
    tarikhMulaPerkhidmatan: "15-01-2023",
    tempohPerkhidmatan: "1 tahun 3 bulan",
    jumlahSuratAmaran: "0",
    statusTerakhir: "Aktif"
  },
  {
    id: "KP002",
    noRujukan: "KP-2024-002",
    nama: "Mohd Ali bin Hassan",
    idPengenalan: "850315045678",
    kategori: "Penolong Amil Komuniti",
    sesi: "2024/2025",
    daerah: "Selangor",
    institusi: "Kompleks Islam",
    status: "aktif",
    // Enhanced profile data
    jantina: "Lelaki",
    statusPerkahwinan: "Berkahwin",
    bangsa: "Melayu",
    agama: "Islam",
    alamat: "No. 45, Jalan Masjid, Taman Islam, 40100 Shah Alam, Selangor",
    negeri: "Selangor",
    daerah: "Petaling",
    bandar: "Shah Alam",
    poskod: "40100",
    noTelefon: "03-5510 2345",
    noTelefonBimbit: "013-456 7890",
    emel: "mohd.ali@email.com",
    pekerjaan: "Guru",
    namaMajikan: "Sekolah Menengah Kebangsaan Shah Alam",
    tahapPendidikan: "Ijazah Sarjana Muda",
    institusiPendidikan: "Universiti Malaya",
    tarikhMulaPerkhidmatan: "01-03-2023",
    tempohPerkhidmatan: "1 tahun 1 bulan",
    jumlahSuratAmaran: "0",
    statusTerakhir: "Aktif"
  },
  {
    id: "KP003",
    noRujukan: "KP-2024-003",
    nama: "Fatimah binti Omar",
    idPengenalan: "920512078901",
    kategori: "Penolong Amil Fitrah",
    sesi: "2024/2025",
    daerah: "Perak",
    institusi: "Masjid Al-Hidayah",
    status: "suspended",
    // Enhanced profile data
    jantina: "Perempuan",
    statusPerkahwinan: "Berkahwin",
    bangsa: "Melayu",
    agama: "Islam",
    alamat: "No. 78, Jalan Sultan, Taman Diraja, 30000 Ipoh, Perak",
    negeri: "Perak",
    daerah: "Kinta",
    bandar: "Ipoh",
    poskod: "30000",
    noTelefon: "05-255 1234",
    noTelefonBimbit: "014-567 8901",
    emel: "fatimah.omar@email.com",
    pekerjaan: "Pegawai Bank",
    namaMajikan: "Bank Islam Malaysia Berhad",
    tahapPendidikan: "Diploma",
    institusiPendidikan: "Kolej Islam Sultan Alam Shah",
    tarikhMulaPerkhidmatan: "20-06-2023",
    tempohPerkhidmatan: "9 bulan",
    jumlahSuratAmaran: "1",
    statusTerakhir: "Dalam Pemerhatian"
  },
  {
    id: "KP004",
    noRujukan: "KP-2024-004",
    nama: "Siti Aminah binti Ismail",
    idPengenalan: "880723123456",
    kategori: "Penolong Amil Padi",
    sesi: "2024/2025",
    daerah: "Kedah",
    institusi: "Surau Al-Amin",
    status: "aktif",
    // Enhanced profile data
    jantina: "Perempuan",
    statusPerkahwinan: "Bujang",
    bangsa: "Melayu",
    agama: "Islam",
    alamat: "No. 12, Kampung Padi, Mukim Alor Setar, 05000 Alor Setar, Kedah",
    negeri: "Kedah",
    daerah: "Alor Setar",
    bandar: "Alor Setar",
    poskod: "05000",
    noTelefon: "04-733 4567",
    noTelefonBimbit: "015-678 9012",
    emel: "siti.aminah@email.com",
    pekerjaan: "Pegawai Pertanian",
    namaMajikan: "Lembaga Pertubuhan Peladang",
    tahapPendidikan: "Ijazah Sarjana Muda",
    institusiPendidikan: "Universiti Putra Malaysia",
    tarikhMulaPerkhidmatan: "10-09-2023",
    tempohPerkhidmatan: "7 bulan",
    jumlahSuratAmaran: "0",
    statusTerakhir: "Aktif"
  },
  {
    id: "KP005",
    noRujukan: "KP-2024-005",
    nama: "Zainal bin Ibrahim",
    idPengenalan: "870415234567",
    kategori: "Penolong Amil Kariah",
    sesi: "2024/2025",
    daerah: "Kelantan",
    institusi: "Kompleks Islam",
    status: "terminated",
    // Enhanced profile data
    jantina: "Lelaki",
    statusPerkahwinan: "Berkahwin",
    bangsa: "Melayu",
    agama: "Islam",
    alamat: "No. 56, Jalan Kota Bharu, Taman Islam, 15000 Kota Bharu, Kelantan",
    negeri: "Kelantan",
    daerah: "Kota Bharu",
    bandar: "Kota Bharu",
    poskod: "15000",
    noTelefon: "09-744 5678",
    noTelefonBimbit: "016-789 0123",
    emel: "zainal.ibrahim@email.com",
    pekerjaan: "Peniaga",
    namaMajikan: "Perusahaan Zainal Enterprise",
    tahapPendidikan: "Pendidikan Menengah",
    institusiPendidikan: "Sekolah Menengah Kebangsaan Kota Bharu",
    tarikhMulaPerkhidmatan: "05-01-2023",
    tempohPerkhidmatan: "1 tahun 3 bulan",
    jumlahSuratAmaran: "3",
    statusTerakhir: "Telah Ditamatkan"
  },
  {
    id: "KP006",
    noRujukan: "KP-2024-006",
    nama: "Nurul Huda binti Ahmad",
    idPengenalan: "930625345678",
    kategori: "Penolong Amil Komuniti",
    sesi: "2024/2025",
    daerah: "Terengganu",
    institusi: "Masjid Al-Hidayah",
    status: "aktif",
    // Enhanced profile data
    jantina: "Perempuan",
    statusPerkahwinan: "Berkahwin",
    bangsa: "Melayu",
    agama: "Islam",
    alamat: "No. 89, Jalan Kuala Terengganu, Taman Islam, 20000 Kuala Terengganu, Terengganu",
    negeri: "Terengganu",
    daerah: "Kuala Terengganu",
    bandar: "Kuala Terengganu",
    poskod: "20000",
    noTelefon: "09-622 6789",
    noTelefonBimbit: "017-890 1234",
    emel: "nurul.huda@email.com",
    pekerjaan: "Pegawai Kesihatan",
    namaMajikan: "Hospital Sultanah Nur Zahirah",
    tahapPendidikan: "Ijazah Sarjana",
    institusiPendidikan: "Universiti Sains Malaysia",
    tarikhMulaPerkhidmatan: "15-03-2023",
    tempohPerkhidmatan: "1 tahun 1 bulan",
    jumlahSuratAmaran: "0",
    statusTerakhir: "Aktif"
  },
  {
    id: "KP007",
    noRujukan: "KP-2024-007",
    nama: "Abdul Rahman bin Hassan",
    idPengenalan: "890715456789",
    kategori: "Penolong Amil Fitrah",
    sesi: "2024/2025",
    daerah: "Pahang",
    institusi: "Surau Al-Amin",
    status: "suspended",
    // Enhanced profile data
    jantina: "Lelaki",
    statusPerkahwinan: "Bercerai",
    bangsa: "Melayu",
    agama: "Islam",
    alamat: "No. 34, Jalan Kuantan, Taman Islam, 25000 Kuantan, Pahang",
    negeri: "Pahang",
    daerah: "Kuantan",
    bandar: "Kuantan",
    poskod: "25000",
    noTelefon: "09-516 7890",
    noTelefonBimbit: "018-901 2345",
    emel: "abdul.rahman@email.com",
    pekerjaan: "Pegawai Perhutanan",
    namaMajikan: "Jabatan Perhutanan Negeri Pahang",
    tahapPendidikan: "Ijazah Sarjana Muda",
    institusiPendidikan: "Universiti Teknologi Mara",
    tarikhMulaPerkhidmatan: "01-05-2023",
    tempohPerkhidmatan: "11 bulan",
    jumlahSuratAmaran: "2",
    statusTerakhir: "Dalam Pemerhatian"
  },
  {
    id: "KP008",
    noRujukan: "KP-2024-008",
    nama: "Noraini binti Mohamed",
    idPengenalan: "910318567890",
    kategori: "Penolong Amil Padi",
    sesi: "2024/2025",
    daerah: "Negeri Sembilan",
    institusi: "Kompleks Islam",
    status: "aktif",
    // Enhanced profile data
    jantina: "Perempuan",
    statusPerkahwinan: "Berkahwin",
    bangsa: "Melayu",
    agama: "Islam",
    alamat: "No. 67, Jalan Seremban, Taman Islam, 70000 Seremban, Negeri Sembilan",
    negeri: "Negeri Sembilan",
    daerah: "Seremban",
    bandar: "Seremban",
    poskod: "70000",
    noTelefon: "06-762 8901",
    noTelefonBimbit: "019-012 3456",
    emel: "noraini.mohamed@email.com",
    pekerjaan: "Guru",
    namaMajikan: "Sekolah Rendah Kebangsaan Seremban",
    tahapPendidikan: "Ijazah Sarjana Muda",
    institusiPendidikan: "Universiti Pendidikan Sultan Idris",
    tarikhMulaPerkhidmatan: "20-07-2023",
    tempohPerkhidmatan: "9 bulan",
    jumlahSuratAmaran: "0",
    statusTerakhir: "Aktif"
  },
  {
    id: "KP009",
    noRujukan: "KP-2024-009",
    nama: "Ismail bin Yusof",
    idPengenalan: "860420678901",
    kategori: "Penolong Amil Kariah",
    sesi: "2024/2025",
    daerah: "Melaka",
    institusi: "Masjid Al-Hidayah",
    status: "terminated",
    // Enhanced profile data
    jantina: "Lelaki",
    statusPerkahwinan: "Janda/Duda",
    bangsa: "Melayu",
    agama: "Islam",
    alamat: "No. 23, Jalan Melaka, Taman Islam, 75000 Melaka, Melaka",
    negeri: "Melaka",
    daerah: "Melaka Tengah",
    bandar: "Bandaraya Melaka",
    poskod: "75000",
    noTelefon: "06-283 9012",
    noTelefonBimbit: "011-123 4567",
    emel: "ismail.yusof@email.com",
    pekerjaan: "Pegawai Pelancongan",
    namaMajikan: "Lembaga Pelancongan Melaka",
    tahapPendidikan: "Diploma",
    institusiPendidikan: "Kolej Komuniti Melaka",
    tarikhMulaPerkhidmatan: "10-02-2023",
    tempohPerkhidmatan: "1 tahun 2 bulan",
    jumlahSuratAmaran: "3",
    statusTerakhir: "Telah Ditamatkan"
  },
  {
    id: "KP010",
    noRujukan: "KP-2024-010",
    nama: "Rohana binti Sulaiman",
    idPengenalan: "940712789012",
    kategori: "Penolong Amil Komuniti",
    sesi: "2024/2025",
    daerah: "Johor",
    institusi: "Surau Al-Amin",
    status: "aktif",
    // Enhanced profile data
    jantina: "Perempuan",
    statusPerkahwinan: "Bujang",
    bangsa: "Melayu",
    agama: "Islam",
    alamat: "No. 90, Jalan Johor Bahru, Taman Islam, 80000 Johor Bahru, Johor",
    negeri: "Johor",
    daerah: "Johor Bahru",
    bandar: "Johor Bahru",
    poskod: "80000",
    noTelefon: "07-224 0123",
    noTelefonBimbit: "010-234 5678",
    emel: "rohana.sulaiman@email.com",
    pekerjaan: "Pegawai Undang-undang",
    namaMajikan: "Jabatan Peguam Negara",
    tahapPendidikan: "Ijazah Sarjana",
    institusiPendidikan: "Universiti Teknologi Malaysia",
    tarikhMulaPerkhidmatan: "05-04-2023",
    tempohPerkhidmatan: "1 tahun",
    jumlahSuratAmaran: "0",
    statusTerakhir: "Aktif"
  },
]);

// Enhanced computed properties with role-specific filtering
const filteredRequests = computed(() => {
  let result = [...requests.value];
  
  // Filter by active status tab
  if (activeStatusTab.value && activeStatusTab.value !== "aktif") {
    result = result.filter(request => request.status === activeStatusTab.value);
  }
  
  // Apply search filter
  if (filters.value.searchQuery) {
    const query = filters.value.searchQuery.toLowerCase();
    result = result.filter(request => 
      (request.noRujukan || request.rujukan)?.toLowerCase().includes(query) ||
      (request.nama || request.penolongAmil?.nama)?.toLowerCase().includes(query) ||
      (request.idPengenalan || request.penolongAmil?.noKP)?.includes(query) ||
      (request.kategori || request.newKategori)?.toLowerCase().includes(query) ||
      (request.sesi || request.newSesi)?.toLowerCase().includes(query) ||
      (request.daerah || request.newDaerah)?.toLowerCase().includes(query) ||
      (request.institusi || request.newInstitusi)?.toLowerCase().includes(query)
    );
  }
  
  // Apply status filter
  if (filters.value.status) {
    result = result.filter(request => request.status === filters.value.status);
  }
  
  // Apply kategori filter
  if (filters.value.kategori) {
    result = result.filter(request => 
      (request.kategori || request.newKategori)?.toLowerCase().includes(filters.value.kategori.toLowerCase())
    );
  }
  
  // Apply institusi filter
  if (filters.value.institusi) {
    result = result.filter(request => 
      (request.institusi || request.newInstitusi)?.toLowerCase().includes(filters.value.institusi.toLowerCase())
    );
  }

  // Apply sesi filter
  if (filters.value.sesi) {
    result = result.filter(request => 
      (request.sesi || request.newSesi)?.toLowerCase().includes(filters.value.sesi.toLowerCase())
    );
  }

  // Apply daerah filter
  if (filters.value.daerah) {
    result = result.filter(request => 
      (request.daerah || request.newDaerah)?.toLowerCase().includes(filters.value.daerah.toLowerCase())
    );
  }
  
  return result;
});

const totalPages = computed(() => Math.ceil(filteredRequests.value.length / itemsPerPage.value));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredRequests.value.length));
const paginatedRequests = computed(() => {
  return filteredRequests.value.slice(startIndex.value, endIndex.value);
});

// Form validation computed property
const isFormValid = computed(() => {
  return warningLetterData.value.file && 
         warningLetterData.value.notes && 
         warningLetterData.value.notes.length >= 10 && 
         warningLetterData.value.notes.length <= 500 && 
         !fileError.value;
});

// Termination Form validation computed property
const isTerminateFormValid = computed(() => {
  if (terminateData.value.reason === "lain-lain") {
    return terminateData.value.customReason && 
           terminateData.value.customReason.length >= 10 && 
           terminateData.value.customReason.length <= 500 && 
           terminateData.value.supportingDocuments && 
           terminateData.value.confirmation &&
           !terminateFileError.value;
  } else {
    return terminateData.value.reason && 
           terminateData.value.supportingDocuments && 
           terminateData.value.confirmation &&
           !terminateFileError.value;
  }
});

// Enhanced helper functions
const getStatusVariant = (status) => {
  const variants = {
    aktif: "success",
    terminated: "danger",
    suspended: "warning",
    "Final Warning": "danger",
    "Dalam Pemerhatian": "warning",
    "Telah Ditamatkan": "danger",
  };
  return variants[status] || "disabled";
};

const getStatusLabel = (status) => {
  const labels = {
    aktif: "Aktif",
    terminated: "Telah Ditamatkan",
    suspended: "Dalam Pemerhatian",
  };
  return labels[status] || status;
};

const getWarningCountVariant = (count) => {
  const countNum = parseInt(count) || 0;
  if (countNum === 0) return "success";
  if (countNum === 1) return "warning";
  if (countNum === 2) return "danger";
  return "danger"; // 3 or more
};

// Helper method for status dashboard
const getStatusCount = (status) => {
  return requests.value.filter(request => request.status === status).length;
};

// Helper method for tab requests
const getTabRequests = (status) => {
  let result = [...requests.value];
  
  // Filter by status tab
  if (status) {
    result = result.filter(request => request.status === status);
  }
  
  // Apply search filter
  if (filters.value.searchQuery) {
    const query = filters.value.searchQuery.toLowerCase();
    result = result.filter(request => 
      (request.noRujukan || request.rujukan)?.toLowerCase().includes(query) ||
      (request.nama || request.penolongAmil?.nama)?.toLowerCase().includes(query) ||
      (request.idPengenalan || request.penolongAmil?.noKP)?.includes(query) ||
      (request.kategori || request.newKategori)?.toLowerCase().includes(query) ||
      (request.sesi || request.newSesi)?.toLowerCase().includes(query) ||
      (request.daerah || request.newDaerah)?.toLowerCase().includes(query) ||
      (request.institusi || request.newInstitusi)?.toLowerCase().includes(query)
    );
  }
  
  // Apply status filter
  if (filters.value.status) {
    result = result.filter(request => request.status === filters.value.status);
  }
  
  // Apply kategori filter
  if (filters.value.kategori) {
    result = result.filter(request => 
      (request.kategori || request.newKategori)?.toLowerCase().includes(filters.value.kategori.toLowerCase())
    );
  }
  
  // Apply institusi filter
  if (filters.value.institusi) {
    result = result.filter(request => 
      (request.institusi || request.newInstitusi)?.toLowerCase().includes(filters.value.institusi.toLowerCase())
    );
  }

  // Apply sesi filter
  if (filters.value.sesi) {
    result = result.filter(request => 
      (request.sesi || request.newSesi)?.toLowerCase().includes(filters.value.sesi.toLowerCase())
    );
  }

  // Apply daerah filter
  if (filters.value.daerah) {
    result = result.filter(request => 
      (request.daerah || request.newDaerah)?.toLowerCase().includes(filters.value.daerah.toLowerCase())
    );
  }
  
  return result;
};

// Enhanced methods
const clearFilters = () => {
  filters.value = {
    searchQuery: "",
    status: "",
    kategori: "",
    institusi: "",
    sesi: "",
    daerah: "",
  };
  currentPage.value = 1;
  showNotificationMessage("Penapis telah dikosongkan", "Semua penapis telah dikosongkan dan senarai telah dikemaskini.");
};

const applyFilters = () => {
  currentPage.value = 1;
  showNotificationMessage("Penapis telah digunakan", `${filteredRequests.value.length} rekod ditemui berdasarkan penapis yang dipilih.`);
};

const viewRequest = (request) => {
  // Navigate to role-specific detail page based on current role
  const role = currentRole.value;
  if (role === "pyb-institusi") {
    navigateTo(`/BF-PA/PP/KP/pyb-institusi/detail/${request.noRujukan || request.rujukan}`);
  } else {
    navigateTo(`/BF-PA/PP/KP/${role}/detail/${request.noRujukan || request.rujukan}`);
  }
};

const editRequest = (request) => {
  navigateTo(`/BF-PA/PP/KP/kemaskini/${request.rujukan}`);
};

const exportData = () => {
  // Simulate export functionality
  showNotificationMessage("Muat Turun Berjaya", "Data telah dieksport ke fail Excel.");
};

// PYB Institusi specific actions
const terminateService = (request) => {
  // Populate with comprehensive mock data for presentation
  currentTerminateRequest.value = {
    // Basic request info
    ...request,
    
    // Personal Information
    nama: request.nama || "Ahmad bin Abdullah",
    idPengenalan: request.idPengenalan || "901231012345",
    jantina: "Lelaki",
    statusPerkahwinan: "Berkahwin",
    bangsa: "Melayu",
    agama: "Islam",
    
    // Contact Information
    alamat: "No. 123, Jalan Utama, Taman Seri Indah, 43000 Kajang, Selangor",
    negeri: "Selangor",
    daerah: "Hulu Langat",
    bandar: "Kajang",
    poskod: "43000",
    noTelefon: "03-8736 1234",
    noTelefonBimbit: "012-345 6789",
    emel: "ahmad.abdullah@email.com",
    
    // Service Information
    kategori: request.kategori || "Penolong Amil Kariah",
    sesi: request.sesi || "2024/2025",
    institusi: request.institusi || "Masjid Al-Hidayah",
    
    // Employment & Education
    pekerjaan: "Pegawai Kerajaan",
    namaMajikan: "Jabatan Agama Islam Selangor",
    tahapPendidikan: "Ijazah Sarjana Muda",
    institusiPendidikan: "Universiti Islam Antarabangsa Malaysia",
    
    // Additional context for termination
    tarikhMulaPerkhidmatan: "15-01-2023",
    tempohPerkhidmatan: "1 tahun 3 bulan",
    jumlahSuratAmaran: "3",
    statusTerakhir: "Final Warning"
  };
  
  terminateData.value = {
    reason: "",
    customReason: "",
    supportingDocuments: null,
    additionalNotes: "",
    confirmation: false,
  };
  terminateFileError.value = "";
  showTerminateModal.value = true;
};

// Ketua Divisyen specific actions
const approveService = (request) => {
  const statusText = request.status === 'aktif' ? 'Aktif' : 'Dalam Pemerhatian';
  showNotificationMessage(
    "Perkhidmatan Diluluskan", 
    `Perkhidmatan ${request.noRujukan || request.rujukan} untuk ${request.nama || request.penolongAmil?.nama} dengan status ${statusText} telah diluluskan.`
  );
  
  // In real app, this would update the approval status
  // For now, just show notification
};

const validateNotes = () => {
  // This function can be used for additional validation if needed
  // The FormKit validation will handle the basic validation
};

const validateConfirmation = () => {
  // This function can be used for additional validation if needed
  // The FormKit validation will handle the basic validation
};

const validateTerminationReason = () => {
  // This function can be used for additional validation if needed
  // The FormKit validation will handle the basic validation
};

const validateCustomReason = () => {
  // This function can be used for additional validation if needed
  // The FormKit validation will handle the basic validation
};

const validateAdditionalNotes = () => {
  // This function can be used for additional validation if needed
  // The FormKit validation will handle the basic validation
};

const getNotesCounterClass = () => {
  const length = warningLetterData.value.notes.length;
  if (length < 10) {
    return 'text-red-500';
  } else if (length > 450) {
    return 'text-orange-500';
  } else {
    return 'text-gray-500';
  }
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  fileError.value = "";
  
  if (file) {
    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      fileError.value = "Saiz fail terlalu besar. Maksimum 5MB dibenarkan.";
      warningLetterData.value.file = null;
      event.target.value = "";
      return;
    }
    
    // Check file type
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      fileError.value = "Format fail tidak dibenarkan. Hanya PDF, DOC, dan DOCX dibenarkan.";
      warningLetterData.value.file = null;
      event.target.value = "";
      return;
    }
    
    // File is valid
    warningLetterData.value.file = file;
  }
};

const sendWarningLetter = (request) => {
  // Populate with comprehensive mock data for presentation
  currentWarningRequest.value = {
    // Basic request info
    ...request,
    
    // Personal Information
    nama: request.nama || "Ahmad bin Abdullah",
    idPengenalan: request.idPengenalan || "901231012345",
    jantina: request.jantina || "Lelaki",
    statusPerkahwinan: request.statusPerkahwinan || "Berkahwin",
    bangsa: request.bangsa || "Melayu",
    agama: request.agama || "Islam",
    
    // Contact Information
    alamat: request.alamat || "No. 123, Jalan Utama, Taman Seri Indah, 43000 Kajang, Selangor",
    negeri: request.negeri || "Selangor",
    daerah: request.daerah || "Hulu Langat",
    bandar: request.bandar || "Kajang",
    poskod: request.poskod || "43000",
    noTelefon: request.noTelefon || "03-8736 1234",
    noTelefonBimbit: request.noTelefonBimbit || "012-345 6789",
    emel: request.emel || "ahmad.abdullah@email.com",
    
    // Service Information
    kategori: request.kategori || "Penolong Amil Kariah",
    sesi: request.sesi || "2024/2025",
    institusi: request.institusi || "Masjid Al-Hidayah",
    
    // Employment & Education
    pekerjaan: request.pekerjaan || "Pegawai Kerajaan",
    namaMajikan: request.namaMajikan || "Jabatan Agama Islam Selangor",
    tahapPendidikan: request.tahapPendidikan || "Ijazah Sarjana Muda",
    institusiPendidikan: request.institusiPendidikan || "Universiti Islam Antarabangsa Malaysia",
    
    // Additional context for warning letter
    tarikhMulaPerkhidmatan: request.tarikhMulaPerkhidmatan || "15-01-2023",
    tempohPerkhidmatan: request.tempohPerkhidmatan || "1 tahun 3 bulan",
    jumlahSuratAmaran: request.jumlahSuratAmaran || "0",
    statusTerakhir: request.statusTerakhir || "Aktif"
  };
  
  warningLetterData.value = {
    file: null,
    notes: "",
  };
  fileError.value = "";
  showWarningModal.value = true;
};

const submitWarningLetter = async () => {
  if (warningLetterData.value.file && warningLetterData.value.notes && !fileError.value) {
    isSubmitting.value = true;
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically send the data to your backend
      // For now, we'll just show a success message
      showNotificationMessage(
        "Surat Amaran Dihantar", 
        `Surat amaran telah dihantar kepada ${currentWarningRequest.value?.nama || currentWarningRequest.value?.penolongAmil?.nama} untuk ${currentWarningRequest.value?.noRujukan || currentWarningRequest.value?.rujukan}.`
      );
      
      // Reset modal and close
      closeWarningModal();
    } catch (error) {
      showNotificationMessage(
        "Ralat", 
        "Gagal menghantar surat amaran. Sila cuba lagi."
      );
    } finally {
      isSubmitting.value = false;
    }
  }
};

const closeWarningModal = () => {
  // Check if user has entered data and confirm before closing
  if ((warningLetterData.value.file || warningLetterData.value.notes) && !isSubmitting.value) {
    if (confirm('Anda pasti mahu menutup modal ini? Data yang telah dimasukkan akan hilang.')) {
      resetWarningModal();
    }
  } else {
    resetWarningModal();
  }
};

const resetWarningModal = () => {
  showWarningModal.value = false;
  warningLetterData.value = {
    file: null,
    notes: "",
  };
  currentWarningRequest.value = null;
  fileError.value = "";
  isSubmitting.value = false;
};

const showNotificationMessage = (title, message) => {
  notificationTitle.value = title;
  notificationMessage.value = message;
  showNotification.value = true;
  
  setTimeout(() => {
    hideNotification();
  }, 5000);
};

const hideNotification = () => {
  showNotification.value = false;
};

// Termination methods
const handleTerminateFileChange = (event) => {
  const file = event.target.files[0];
  terminateFileError.value = "";
  
  if (file) {
    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      terminateFileError.value = "Saiz fail terlalu besar. Maksimum 5MB dibenarkan.";
      terminateData.value.supportingDocuments = null;
      event.target.value = "";
      return;
    }
    
    // Check file type
    const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      terminateFileError.value = "Format fail tidak dibenarkan. Hanya PDF, DOC, DOCX, JPG, JPEG, PNG dibenarkan.";
      terminateData.value.supportingDocuments = null;
      event.target.value = "";
      return;
    }
    
    // File is valid
    terminateData.value.supportingDocuments = file;
  }
};

const submitTermination = async () => {
  if (isTerminateFormValid.value) {
    isTerminateSubmitting.value = true;
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the data to your backend
      // For now, we'll just show a success message
      showNotificationMessage(
        "Perkhidmatan Ditamatkan", 
        `Perkhidmatan ${currentTerminateRequest.value?.noRujukan || currentTerminateRequest.value?.rujukan} untuk ${currentTerminateRequest.value?.nama || currentTerminateRequest.value?.penolongAmil?.nama} telah ditamatkan.`
      );
      
      // Reset modal and close
      closeTerminateModal();
    } catch (error) {
      showNotificationMessage(
        "Ralat", 
        "Gagal menamatkan perkhidmatan. Sila cuba lagi."
      );
    } finally {
      isTerminateSubmitting.value = false;
    }
  }
};

const closeTerminateModal = () => {
  // Check if user has entered data and confirm before closing
  if ((terminateData.value.reason || terminateData.value.customReason || terminateData.value.supportingDocuments || terminateData.value.additionalNotes || terminateData.value.confirmation) && !isTerminateSubmitting.value) {
    if (confirm('Anda pasti mahu menutup modal ini? Data yang telah dimasukkan akan hilang.')) {
      resetTerminateModal();
    }
  } else {
    resetTerminateModal();
  }
};

const resetTerminateModal = () => {
  showTerminateModal.value = false;
  terminateData.value = {
    reason: "",
    customReason: "",
    supportingDocuments: null,
    additionalNotes: "",
    confirmation: false,
  };
  currentTerminateRequest.value = null;
  terminateFileError.value = "";
  isTerminateSubmitting.value = false;
};

// Role-based access control - removed canCreateRequest as PP/KP doesn't handle adding new data

const canEditRequest = (request) => {
  // Only allow editing if status is pending or need_more_info
  return request.status === "pending" || request.status === "need_more_info";
};

// Role-based action control
const canPerformAction = (request) => {
  // Only PYB Institusi can perform actions (terminate, warning letter)
  return currentRole.value === "pyb-institusi";
};

// Enhanced helper functions
const getRoleSpecificDescription = (role) => {
  const descriptions = {
    "pt": "Lihat maklumat Perkhidmatan Penolong Amil",
    "eksekutif": "Lihat maklumat Perkhidmatan Penolong Amil",
    "ketua-jabatan": "Lihat maklumat Perkhidmatan Penolong Amil",
    "ketua-divisyen": "Lihat dan meluluskan maklumat Perkhidmatan Penolong Amil",
    "pyb-institusi": "Pengurusan maklumat Perkhidmatan Penolong Amil oleh PYB Institusi",
  };
  return descriptions[role] || "Peranan ini mempunyai kebolehan yang berbeza.";
};

// Role Switcher State
const currentRole = ref("pyb-institusi"); // Default role changed to PYB Institusi
const roleOptions = [
  { label: "PT", value: "pt" },
  { label: "Eksekutif", value: "eksekutif" },
  { label: "Ketua Jabatan", value: "ketua-jabatan" },
  { label: "Ketua Divisyen", value: "ketua-divisyen" },
  { label: "PYB Institusi", value: "pyb-institusi" },
];
const showRoleInfo = ref(false);

const getRoleVariant = (role) => {
  const variants = {
    "pt": "info",
    "eksekutif": "success",
    "ketua-jabatan": "warning",
    "ketua-divisyen": "danger",
    "pyb-institusi": "primary",
  };
  return variants[role] || "default";
};

const getRoleLabel = (role) => {
  const labels = {
    "pt": "PT",
    "eksekutif": "Eksekutif",
    "ketua-jabatan": "Ketua Jabatan",
    "ketua-divisyen": "Ketua Divisyen",
    "pyb-institusi": "PYB Institusi",
  };
  return labels[role] || role;
};

const getRoleDescription = (role) => {
  const descriptions = {
    "pt": "Lihat maklumat Perkhidmatan Penolong Amil",
    "eksekutif": "Lihat maklumat Perkhidmatan Penolong Amil",
    "ketua-jabatan": "Lihat maklumat Perkhidmatan Penolong Amil",
    "ketua-divisyen": "Lihat dan meluluskan maklumat Perkhidmatan Penolong Amil",
    "pyb-institusi": "Pengurusan maklumat Perkhidmatan Penolong Amil oleh PYB Institusi",
  };
  return descriptions[role] || "Peranan ini mempunyai kebolehan yang berbeza.";
};

const getRoleCapabilities = (role) => {
  const capabilities = {
    "pt": ["Lihat Maklumat", "Lihat Status", "Lihat Butiran"],
    "eksekutif": ["Lihat Maklumat", "Lihat Status", "Lihat Butiran"],
    "ketua-jabatan": ["Lihat Maklumat", "Lihat Status", "Lihat Butiran"],
    "ketua-divisyen": ["Lihat Maklumat", "Lihat Status", "Lihat Butiran", "Meluluskan Perkhidmatan"],
    "pyb-institusi": ["Lihat Maklumat", "Terminate Perkhidmatan", "Surat Amaran", "Pengurusan Status"],
  };
  return capabilities[role] || ["Tidak ada kebolehan spesifik."];
};

const handleRoleChange = () => {
  showNotificationMessage("Peranan Berubah", `User sekarang adalah "${getRoleLabel(currentRole.value)}".`);
};

const toggleRoleInfo = () => {
  showRoleInfo.value = !showRoleInfo.value;
};

// Watch for status tab changes to reset pagination
watch(activeStatusTab, () => {
  currentPage.value = 1;
});

// Watch for filter changes to update applied filters
watch(filters, () => {
  // Auto-apply filters after a delay
  clearTimeout(window.filterTimeout);
  window.filterTimeout = setTimeout(() => {
    if (filters.value.searchQuery || filters.value.status || filters.value.kategori || filters.value.institusi || filters.value.sesi || filters.value.daerah) {
      applyFilters();
    }
  }, 500);
}, { deep: true });
</script>

<style scoped>
/* Enhanced styling */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style> 
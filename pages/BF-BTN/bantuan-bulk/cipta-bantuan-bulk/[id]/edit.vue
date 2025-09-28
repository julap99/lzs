<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="space-y-4 mt-4">
      <!-- Maklumat Umum Section -->
      <rs-card>
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="material-symbols:info" class="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Maklumat Umum</h2>
              <p class="text-sm text-gray-500">Maklumat asas bantuan</p>
            </div>
          </div>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Kod BP -->
            <FormKit
              type="text"
              name="kodBP"
              label="Kod BP"
              placeholder="BP-2025-00004"
              disabled
              help="Auto-generate selepas simpan"
              v-model="formData.kodBP"
            />

            <!-- Tajuk -->
            <FormKit
              type="text"
              name="tajuk"
              label="Tajuk"
              placeholder="cth: Wang Saku Fakir Mac 2025"
              validation="required"
              v-model="formData.tajuk"
            />

            <!-- Kategori Asnaf -->
            <FormKit
              type="select"
              name="kategoriAsnaf"
              label="Kategori Asnaf"
              :options="kategoriAsnafOptions"
              placeholder="Pilih kategori asnaf"
              validation="required"
              v-model="formData.kategoriAsnaf"
            />

            <!-- Status -->
            <div class="formkit-field">
              <label class="formkit-label">Status</label>
              <div class="mt-1">
              <rs-badge :variant="getStatusVariant(formData.status)">
                {{ formData.status }}
              </rs-badge>
              </div>
            </div>

            <!-- Jumlah Amaun -->
            <!-- <FormKit
              type="text"
              name="jumlahAmaun"
              label="Jumlah Amaun (RM)"
              v-model="formData.jumlahAmaun"
              disabled
              help="Auto-calculate selepas import Data"
            /> -->

            <!-- Catatan -->
            <FormKit
              type="textarea"
              name="catatan"
              label="Catatan"
              placeholder="cth: Tuntutan wang saku pelajar..."
              validation="required"
              v-model="formData.catatan"
              :classes="{
                input: 'h-24',
                outer: 'md:col-span-2',
              }"
            />
          </div>
        </template>
      </rs-card>

      <!-- Maklumat Bantuan Section -->
      <rs-card>
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon name="material-symbols:handshake" class="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Maklumat Bantuan</h2>
              <p class="text-sm text-gray-500">Konfigurasi bantuan dan produk</p>
            </div>
          </div>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomSelect
                v-model="formData.aid"
                :options="aid"
                label="Aid"
                search-placeholder="Cari aid..."
                :disabled="false"
              />
            <FormKit
                type="select"
                name="aidProduct"
                label="Aid Product"
                v-model="formData.aidProduct"
                :options="aidProductOptions"
                searchable
                :search-attributes="['label']"
                :search-filter="(option, search) => option.label.toLowerCase().includes(search.toLowerCase())"
                validation="required"
                :validation-messages="{
                  required: 'Sila pilih aid product',
                }"
                :disabled="!formData.aid"
              />
            <FormKit
                type="select"
                name="productPackage"
                label="Product Package"
                v-model="formData.productPackage"
                :options="productPackageOptions"
                searchable
                :search-attributes="['label']"
                :search-filter="(option, search) => option.label.toLowerCase().includes(search.toLowerCase())"
                validation="required"
                :validation-messages="{
                  required: 'Sila pilih product package',
                }"
                :disabled="!formData.aidProduct"
              />
            <FormKit
                type="select"
                name="productEntitlement"
                label="Product Entitlement"
                v-model="formData.productEntitlement"
                :options="productEntitlementOptions"
                searchable
                :search-attributes="['label']"
                :search-filter="(option, search) => option.label.toLowerCase().includes(search.toLowerCase())"
                validation="required"
                :validation-messages="{
                  required: 'Sila pilih product Entitlement',
                }"
                :disabled="!formData.productPackage"
            />

            <FormKit
              type="date"
              name="tarikhJangkaanBayaran"
              label="Tarikh Jangkaan Bayaran"
              placeholder="Pilih tarikh jangkaan bayaran"
              validation="required"
              :validation-messages="{
                required: 'Sila pilih tarikh jangkaan bayaran',
              }"
              v-model="formData.tarikhJangkaanBayaran"
            />

            <FormKit
              type="radio"
              name="modeOfPayment"
              label="Mode Of Payment"
              v-model="formData.modeOfPayment"
              :options="[
                { label: 'Tunai', value: 'Tunai' },
                { label: 'Profile', value: 'Profile' },
              ]"
              validation="required"
            />

            <!-- Cawangan (CustomSelect) -->
            <CustomSelect
              v-model="formData.cawangan"
              :options="cawanganOptions"
              label="Cawangan"
              search-placeholder="Cari cawangan..."
              :disabled="false"
              :classes="{
                outer: 'md:col-span-2',
              }"
            />
          </div>
        </template>
      </rs-card>

      <!-- Import Data Section -->
      <rs-card>
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Icon name="material-symbols:upload" class="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Import Data</h2>
              <p class="text-sm text-gray-500">Muat naik data dari fail Excel</p>
            </div>
          </div>
        </template>
        <template #body>
          <div class="space-y-4" :class="{ loading: isLoading }">
            <!-- File Upload -->
            <FormKit
              type="file"
              name="importFile"
              label="Muat Naik Fail"
              accept=".xlsx,.xls"
              help="Format fail: Excel (.xlsx, .xls, .csv)"
              validation="required"
              @change="handleFileUpload"
            />

            <div class="flex items-center gap-2">
              <!-- Import Button -->
            <rs-button
              variant="primary"
              :disabled="!selectedFile || isLoading"
              @click="handleImport"
            >
              <Icon name="material-symbols:upload" class="mr-1" />
              {{ isLoading ? "Sedang Import..." : "Import" }}
            </rs-button>

            <!-- Download Payable To CSV Template -->
            <rs-button
              variant="secondary"
              :disabled="isLoading"
              @click="downloadPayableToTemplate"
            >
              <Icon name="material-symbols:download" class="mr-1" />
              Template Format Excel
            </rs-button>
            </div>

          </div>
        </template>
      </rs-card>

      <!-- Maklumat Bayaran Kepada Section -->
      <rs-card>
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Icon name="material-symbols:payments" class="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">Bayaran Kepada (Payable To)</h2>
                <p class="text-sm text-gray-500">Maklumat pembayaran dan penerima</p>
              </div>
            </div>

            <div class="flex items-center gap-2">

              <rs-button

                variant="primary"
                @click="handleAddPayment"
              >
                <Icon name="material-symbols:add" class="w-4 h-4 mr-1" />
                Tambah
              </rs-button>

              <rs-button
                variant="primary"
                :disabled="selectedPayments.length === 0"
                @click="handleSahkanSelected"
              >
                <Icon name="material-symbols:check-circle" class="w-4 h-4 mr-1" />
                Sahkan ({{ selectedPayments.length }})
              </rs-button>
              </div>
          </div>
        </template>
        <template #body>
          <!-- Payment List -->
          <div
            v-if="paymentList.length === 0"
            class="text-center py-8 text-gray-500"
          >
            Tiada maklumat bayaran. Klik "Tambah" untuk menambah maklumat
            bayaran.
          </div>

          <div v-else class="space-y-3">
            <!-- Custom Table -->
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                <!-- Table Header -->
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kod</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bayaran Kepada</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori Asnaf</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contributor</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amaun</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode Of Payment</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Akaun</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tindakan
                    </th>
                  </tr>
                </thead>
                <!-- Table Body -->
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(payment, index) in cleanPaymentList" :key="payment.kod" 
                      class="hover:bg-gray-50 transition-colors duration-150">
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {{ index + 1 }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ payment.kod }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ payment.bayaranKepada }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ payment.asnaf }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ payment.contributor }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ payment.recipient }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ payment.organization }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {{ formatCurrency(payment.amaun) }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ payment.modeOfPayment || '-' }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ payment.bankName }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ payment.accountNumber || '-' }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap">
                      <div class="flex justify-center">
                        <input
                          type="checkbox"
                          :value="payment.kod"
                          v-model="selectedPayments"
                          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
      </rs-card>


      <!-- Maklumat Data Rosak Section -->
      <rs-card v-if="showImportCards">
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Icon name="material-symbols:warning" class="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">Data Rosak</h2>
                <p class="text-sm text-gray-500">Data yang memerlukan pembetulan</p>
              </div>
            </div>
          </div>
        </template>
        <template #body>
              <div v-if="damagedDataList.length === 0" class="text-center py-8 text-gray-500">
            <div v-if="paymentList.length === 0">
              Tiada maklumat data rosak. Sila import data terlebih dahulu untuk melihat data rosak.
              </div>
            <div v-else>
              Tiada maklumat data rosak. Semua data dalam keadaan baik.
            </div>
          </div>
          <div v-else>
            <!-- Custom HTML table to allow conditional columns/values -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">No</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Penerima</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catatan</th>
                    <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Tindakan</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(row, index) in damagedDataListGrouped" :key="row.id">
                    <td class="px-4 py-2 text-sm text-gray-700">{{ index + 1 }}</td>
                    <td class="px-4 py-2 text-sm">
                      <button
                        v-if="row.jenisMasalah?.includes('Duplikasi')"
                        @click="openDuplicateModalFor(row)"
                        class="text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-200 cursor-pointer"
                      >
                  {{ row.namaPenerima }}
                      </button>
                      <span
                        v-else
                        class="text-gray-700"
                      >
                        {{ row.namaPenerima }}
                      </span>
                    </td>
                    <td class="px-4 py-2 text-sm text-gray-600">
                      <div class="max-w-xs truncate" :title="row.catatan">{{ row.catatan }}</div>
                    </td>
                    <td class="px-4 py-2 text-sm">
                      <div class="relative flex items-center justify-center"
                           @mouseenter="tooltips['edit'+index] = true" @mouseleave="tooltips['edit'+index] = false">
                        <rs-button 
                          variant="info-text" 
                          class="p-1 w-8 h-8"
                          @click="handleKemaskiniDamagedData(row)"
                        >
                          <Icon name="ic:outline-edit" size="18" />
                </rs-button>
                        <transition name="tooltip">
                          <span v-if="tooltips['edit'+index]" class="absolute bottom-full mb-2 right-0 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                            Edit
                          </span>
                        </transition>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
              </div>
        </template>
      </rs-card>



      <!-- Maklumat Senarai Penerima Section -->
      <rs-card v-if="showImportCards">
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Icon name="material-symbols:people" class="w-6 h-6 text-teal-600" />
                </div>
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">Senarai Penerima (Beneficiary List)</h2>
                <p class="text-sm text-gray-500">Senarai penerima bantuan</p>
              </div>
            </div>
          </div>
        </template>
        <template #body>
          <!-- Recipient List -->
          <div
            v-if="recipientList.length === 0"
            class="text-center py-8 text-gray-500"
          >
            Tiada maklumat penerima. Klik "Tambah" untuk menambah maklumat
            penerima.
          </div>

          <div v-else class="space-y-3">
            <rs-table
              :data="recipientList"
              :columns="recipientColumns"
              :pageSize="5"
              :showNoColumn="true"
              :options="{ variant: 'default', hover: true, striped: true }"
              :options-advanced="{ sortable: true, filterable: false }"
              advanced
            >
              <template v-slot:amaun="{ text }">
                {{ formatCurrency(text) }}
              </template>

              <template v-slot:actions="{ row }">
                <div class="flex space-x-2 justify-center">
                  <rs-button variant="info" size="sm" @click="handleEditRecipientModal(row)">
                    <Icon name="material-symbols:visibility" class="w-4 h-4 mr-1" /> Lihat
                  </rs-button>
                  <rs-button variant="danger" size="sm" @click="handleDeleteRecipient(row)">
                    <Icon name="material-symbols:delete" class="w-4 h-4" />
                  </rs-button>
                </div>
              </template>
            </rs-table>
          </div>
        </template>
      </rs-card>

      <!-- Maklumat Dokumen Sokongan Section -->
      <rs-card>
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Icon name="material-symbols:description" class="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Maklumat Dokumen Sokongan</h2>
              <p class="text-sm text-gray-500">Fail dan dokumen berkaitan</p>
            </div>
          </div>
        </template>
        <template #body>
          <div class="space-y-4" :class="{ loading: isLoading }">
            <FormKit
              type="file"
              name="documentFiles"
              label="Muat Naik Fail"
              accept=".pdf,.doc,.docx"
              help="Format fail: PDF, Word (.pdf, .doc, .docx)"
              multiple
              @change="handleDocumentUpload"
            />

            <!-- Display selected files -->
            <div v-if="selectedDocuments.length > 0" class="mt-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Fail yang dipilih:</h4>
              <div class="space-y-2">
                <div 
                  v-for="(file, index) in selectedDocuments" 
                  :key="index"
                  class="flex items-center justify-between p-2 bg-gray-50 rounded border"
                >
                  <div class="flex items-center">
                    <Icon name="material-symbols:description" class="mr-2 text-blue-500" />
                    <span class="text-sm text-gray-700">{{ file.name }}</span>
                    <span class="text-xs text-gray-500 ml-2">({{ formatFileSize(file.size) }})</span>
                  </div>
                  <rs-button
                    variant="danger-text"
                    size="sm"
                    @click="removeFile(index)"
                  >
                    <Icon name="ic:outline-close" size="16" />
                  </rs-button>
                </div>
              </div>
            </div>

            <rs-button
              variant="primary"
              :disabled="!selectedDocuments.length || isLoading"
              @click="handleDocumentImport"
            >
              <Icon name="material-symbols:upload" class="mr-1" />
              {{ isLoading ? "Sedang Muat Naik..." : `Import ${selectedDocuments.length} Fail` }}
            </rs-button>

            <!-- Existing uploaded documents -->
            <div v-if="documentList.length > 0" class="mt-6 space-y-3">
              <h4 class="text-sm font-medium text-gray-700">Dokumen sedia ada:</h4>
              <h4 class="text-sm font-medium text-gray-700">Dokumen yang telah dimuat naik:</h4>
            <div
              v-for="(document, index) in documentList"
                :key="document.id || index"
              class="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
            >
              <div class="flex items-center space-x-3">
                <Icon name="material-symbols:description" class="w-8 h-8 text-blue-500" />
                <div>
                  <p class="font-medium text-gray-900">{{ document.name }}</p>
                  <p class="text-sm text-gray-500">{{ document.size }} • {{ document.uploadDate }}</p>
                </div>
              </div>
                <div class="flex items-center space-x-2">
                  <rs-button variant="info-text" size="sm" :title="'Muat turun'" aria-label="Muat turun">
                    <Icon name="material-symbols:download" class="w-4 h-4" />
              </rs-button>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormKit
                  type="text"
                  name="namaPegawai"
                  label="Nama Pegawai"
                  v-model="formData.namaPegawai"
                  disabled
                  help="Auto-fill selepas simpan"
                />

                <!-- Tarikh Mohon -->
                <FormKit
                  type="text"
                  name="tarikhMohon"
                  label="Tarikh Mohon"
                  v-model="formData.tarikhMohon"
                  disabled
                  help="Auto-fill selepas simpan"
                />
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Action Buttons -->
      <div class="">
        <div class="flex justify-between space-x-4">
          <rs-button variant="secondary" @click="handleKembali">
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
            Kembali
          </rs-button>
          <div class="flex space-x-2">
            <rs-button
            variant="primary"
            @click="handleSave"
            :disabled="isSubmitting"
            >
              <Icon name="ph:floppy-disk" class="w-4 h-4 mr-1" />
            {{ isSubmitting ? "Sedang Simpan..." : "Simpan" }}
            </rs-button>
            <rs-button
              variant="primary"
              @click="handleHantar"
              :disabled="isSubmitting"
            >
              <Icon name="ph:paper-plane-tilt" class="w-4 h-4 mr-1" />
              Hantar
            </rs-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <rs-modal
      v-model="showPaymentModal"
      :title="
        paymentModalMode === 'add'
          ? 'Tambah Maklumat Bayaran'
          : 'Edit Maklumat Bayaran'
      "
      size="lg"
    >
      <div class="space-y-4">
        <!-- Kod BP -->
        <FormKit
          type="text"
          name="kod"
          label="Kod"
          v-model="paymentForm.kod"
          disabled
        />

        <!-- Bayaran Kepada -->
        <FormKit
          type="text"
          name="bayaranKepada"
          label="Bayaran Kepada"
          v-model="paymentForm.bayaranKepada"
          placeholder="Masukkan bayaran kepada"
          validation="required"
        />

        <!-- Asnaf -->
        <FormKit
          type="select"
          name="asnaf"
          label="Asnaf"
          v-model="paymentForm.asnaf"
          :options="kategoriAsnafOptions"
          placeholder="Pilih asnaf"
          validation="required"
        />

        <!-- Contributor -->
        <FormKit
          type="text"
          name="contributor"
          label="Contributor"
          v-model="paymentForm.contributor"
          placeholder="Masukkan contributor"
        />

        <!-- Recipient -->
        <FormKit
          type="text"
          name="recipient"
          label="Recipient"
          v-model="paymentForm.recipient"
          placeholder="Masukkan recipient"
        />

        <!-- Organization -->
        <FormKit
          type="text"
          name="organization"
          label="Organization"
          v-model="paymentForm.organization"
          placeholder="Masukkan organization"
        />

        <!-- Amaun -->
        <FormKit
          type="number"
          name="amaun"
          label="Amaun (RM)"
          v-model="paymentForm.amaun"
          placeholder="0.00"
          step="0.01"
          validation="required|min:0"
        />

        <!-- Tarikh Bayaran -->
        <FormKit
          type="radio"
          name="modeOfPayment"
          label="Mode Of Payment"
          v-model="paymentForm.modeOfPayment"
          :options="[
            { label: 'Tunai', value: 'Tunai' },
            { label: 'Akaun', value: 'Akaun' },
          ]"
          validation="required"
        />

        <!-- ID Permohonan -->
        <FormKit
          type="text"
          name="idPermohonan"
          label="ID Permohonan"
          v-model="paymentForm.idPermohonan"
          placeholder="PRM-2025-00001"
          validation="required"
        />

        <!-- Bank Name -->
        <FormKit
          type="select"
          name="bankName"
          label="Bank"
          v-model="paymentForm.bankName"
          :options="allowedBanks.map(bank => ({ label: bank, value: bank }))"
          placeholder="Pilih bank"
          validation="required"
        />

        <!-- Bank Account -->
        <FormKit
          type="text"
          name="bankAccount"
          label="No. Akaun"
          v-model="paymentForm.bankAccount"
          placeholder="1234-56-789012"
          validation="required"
        />
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <rs-button variant="secondary" @click="handleClosePaymentModal">
            Kembali
          </rs-button>
          <rs-button variant="primary" @click="handleSavePaymentModal">
            {{ paymentModalMode === "add" ? "Tambah" : "Kemaskini" }}
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Recipient Modal -->
    <rs-modal
      v-model="showRecipientModal"
      :title="
        recipientModalMode === 'add'
          ? 'Tambah Maklumat Penerima'
          : 'Edit Maklumat Penerima'
      "
      size="lg"
    >
      <div class="space-y-4">
        <!-- Nama Penuh -->
        <FormKit
          type="text"
          name="namaPenuh"
          label="Nama Penuh"
          v-model="recipientForm.namaPenuh"
          placeholder="Masukkan nama penuh"
          validation="required"
        />

        <!-- Amaun -->
        <FormKit
          type="number"
          name="amaun"
          label="Amaun (RM)"
          v-model="recipientForm.amaun"
          placeholder="0.00"
          step="0.01"
          validation="required|min:0"
        />

        <!-- Agihan Semula -->
        <FormKit
          type="select"
          name="agihanSemula"
          label="Agihan Semula"
          v-model="recipientForm.agihanSemula"
          :options="[
            { label: 'Ya', value: 'Ya' },
            { label: 'Tidak', value: 'Tidak' },
          ]"
          validation="required"
        />

        <!-- Bulk Processing -->
        <FormKit
          type="select"
          name="bulkProcessing"
          label="Bulk Processing"
          v-model="recipientForm.bulkProcessing"
          :options="[
            { label: 'Ya', value: 'Ya' },
            { label: 'Tidak', value: 'Tidak' },
          ]"
          validation="required"
        />

        <!-- Kategori Asnaf -->
        <FormKit
          type="select"
          name="kategoriAsnaf"
          label="Kategori Asnaf"
          v-model="recipientForm.kategoriAsnaf"
          :options="kategoriAsnafOptions"
          placeholder="Pilih kategori asnaf"
          validation="required"
        />

        <!-- Bayaran Kepada -->
        <FormKit
          type="select"
          name="bayaranKepada"
          label="Bayaran Kepada"
          v-model="recipientForm.bayaranKepada"
          :options="[
            { label: 'Individu', value: 'Individu' },
            { label: 'Organisasi', value: 'Organisasi' },
          ]"
          validation="required"
        />

        <!-- Negeri -->
        <FormKit
          type="text"
          name="negeri"
          label="Negeri"
          v-model="recipientForm.negeri"
          placeholder="Masukkan negeri"
          validation="required"
        />

        <!-- Negara -->
        <FormKit
          type="text"
          name="negara"
          label="Negara"
          v-model="recipientForm.negara"
          placeholder="Masukkan negara"
          validation="required"
        />
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <rs-button variant="secondary" @click="handleCloseRecipientModal">
            Batal
          </rs-button>
          <rs-button variant="primary" @click="handleSaveRecipientModal">
            {{ recipientModalMode === "add" ? "Tambah" : "Kemaskini" }}
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- View Details Modal for Damaged Data -->
    <rs-modal 
      v-model="showViewDetailsModal" 
      title="Butiran Data Rosak"
      size="lg"
    >
      <template #body>
        <div v-if="selectedDamagedData" class="space-y-4">
          <!-- Recipient Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="text"
              name="namaPenerima"
              label="Nama Penerima"
              :value="selectedDamagedData.namaPenerima"
              disabled
            />
            <FormKit
              type="text"
              name="idPermohonan"
              label="ID Permohonan"
              :value="selectedDamagedData.idPermohonan || 'Tiada maklumat'"
              disabled
            />
          </div>

          <!-- Notes Section -->
          <FormKit
            type="textarea"
            name="catatan"
            label="Catatan"
            :value="selectedDamagedData.catatan"
            disabled
            :classes="{
              input: 'min-h-[60px]',
            }"
          />

          <!-- Issue Details -->
          <FormKit
            type="text"
            name="jenisMasalah"
            label="Jenis Masalah"
            :value="selectedDamagedData.jenisMasalah || 'Tiada maklumat'"
            disabled
          />

        </div>
      </template>

     <template #footer>
       <div class="flex justify-end space-x-2">
         <rs-button variant="secondary" @click="showViewDetailsModal = false">
           Tutup
         </rs-button>
       </div>
     </template>
   </rs-modal>

   <!-- Kemaskini Modal for Damaged Data -->
   <rs-modal 
     v-model="showKemaskiniModal" 
     title="Kemaskini Data Rosak"
     size="lg"
   >
     <template #body>
       <div v-if="editingPaymentForDefect" class="space-y-4">
         <!-- Form for editing damaged data - showing all payment fields -->
         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <FormKit
             type="text"
             name="kod"
             label="Kod"
             :value="editingPaymentForDefect.kod"
             disabled
             :classes="{
               input: '!py-2',
             }"
           />

           <FormKit
             type="text"
             name="idPermohonan"
             label="ID Permohonan"
             :value="editingPaymentForDefect.idPermohonan"
             disabled
             :classes="{
               input: '!py-2',
             }"
           />
         </div>

         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <FormKit
             type="text"
             name="bayaranKepada"
             label="Bayaran Kepada"
             :value="editingPaymentForDefect.bayaranKepada"
             disabled
             :classes="{
               input: '!py-2',
             }"
           />

           <FormKit
             type="text"
             name="asnaf"
             label="Asnaf"
             :value="editingPaymentForDefect.asnaf"
             disabled
             :classes="{
               input: '!py-2',
             }"
           />
         </div>

         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <FormKit
             type="text"
             name="contributor"
             label="Contributor"
             :value="editingPaymentForDefect.contributor"
             disabled
             :classes="{
               input: '!py-2',
             }"
           />

           <FormKit
             type="text"
             name="recipient"
             label="Recipient"
             :value="editingPaymentForDefect.recipient"
             disabled
             :classes="{
               input: '!py-2',
             }"
           />
         </div>

         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <FormKit
             type="text"
             name="organization"
             label="Organization"
             :value="editingPaymentForDefect.organization"
             disabled
             :classes="{
               input: '!py-2',
             }"
           />

           <FormKit
             type="text"
             name="tarikhBayaran"
             label="Tarikh Bayaran"
             :value="editingPaymentForDefect.tarikhBayaran"
             disabled
             :classes="{
               input: '!py-2',
             }"
           />
         </div>

         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <FormKit
             type="select"
             name="bankName"
             label="Bank"
             :options="allowedBanks.map(bank => ({ label: bank, value: bank }))"
             v-model="editingPaymentForDefect.bankName"
             validation="required"
             :classes="{
               input: '!py-2',
             }"
           />

           <FormKit
             type="text"
             name="bankAccount"
             label="No. Akaun"
             v-model="editingPaymentForDefect.bankAccount"
             validation="required"
             :classes="{
               input: '!py-2',
             }"
           />
         </div>

         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
           <FormKit
             type="text"
             name="amaun"
             label="Amaun"
             v-model="editingPaymentForDefect.amaun"
             validation="required"
             :classes="{
               input: '!py-2',
             }"
           />
         </div>
       </div>
     </template>

     <template #footer>
       <div class="flex justify-end space-x-2">
         <rs-button variant="secondary" @click="() => { showKemaskiniModal = false; editingPaymentForDefect = null; }">
           Batal
         </rs-button>
         <rs-button variant="primary" @click="handleSaveDamagedDataChanges">
           Simpan
         </rs-button>
       </div>
     </template>
   </rs-modal>

   <!-- Duplicate List Modal (Inlined) -->
   <rs-modal
     v-model="showDuplicateModal"
     size="lg"
     :closeable="true"
     role="dialog"
   >
     <template #header>
       <div class="flex items-center justify-between">
         <h3 class="text-lg font-semibold">Senarai Data Duplicate</h3>
       </div>
     </template>

     <template #body>
       <div class="space-y-3">
         <div class="max-w-xs">
           <FormKit
             ref="duplicateSearchRef"
             type="text"
             v-model="duplicateSearch"
             placeholder="Search"
             :classes="{ outer: 'mb-0' }"
             :suffix-icon="'mdi:magnify'"
           />
         </div>

         <div class="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
           <table class="min-w-full bg-white">
             <thead class="bg-gray-50">
               <tr>
                 <th class="px-4 py-2 text-center text-xs font-semibold text-gray-600">No</th>
                 <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">Id Permohonan</th>
                 <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">Aid</th>
                 <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">Aid Product</th>
                 <th class="px-4 py-2 text-right text-xs font-semibold text-gray-600">Jumlah Amaun</th>
                 <th class="px-4 py-2 text-center text-xs font-semibold text-gray-600">Tarikh Mohon</th>
                 <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600">Status Permohonan</th>
                 <th class="px-4 py-2 text-center text-xs font-semibold text-gray-600">Tindakan</th>
               </tr>
             </thead>
             <tbody>
               <tr v-for="(r, i) in filteredDuplicateRows" :key="r.id" class="border-t">
                 <td class="px-4 py-2 text-sm">{{ i + 1 }}</td>
                 <td class="px-4 py-2 text-sm">
                   <button
                     class="text-primary hover:underline"
                     @click="onOpenApplication(r.idPermohonan)"
                   >
                     {{ r.idPermohonan }}
                   </button>
                 </td>
                 <td class="px-4 py-2 text-sm">{{ r.aid }}</td>
                 <td class="px-4 py-2 text-sm">{{ r.aidProduct }}</td>
                 <td class="px-4 py-2 text-sm text-right">{{ fmt(r.jumlahAmaun) }}</td>
                 <td class="px-4 py-2 text-sm text-center">{{ formatMsDate(r.tarikhMohon) }}</td>
                 <td class="px-4 py-2 text-sm">{{ r.status }}</td>
                 <td class="px-4 py-2 text-sm">
                   <div class="flex justify-center">
                     <FormKit
                       type="checkbox"
                       :value="r.idPermohonan"
                       v-model="duplicateSelectedIds"
                     />
                   </div>
                 </td>
               </tr>
               <tr v-if="filteredDuplicateRows.length === 0">
                 <td class="px-4 py-6 text-center text-sm text-gray-500" colspan="8">Tiada data</td>
               </tr>
             </tbody>
           </table>
         </div>
       </div>
     </template>

     <template #footer>
       <div class="flex justify-end gap-2">
         <rs-button variant="secondary" @click="onDuplicateClose">Tutup</rs-button>
         <rs-button variant="primary" :disabled="duplicateSelectedIds.length === 0" @click="onDuplicateConfirm(duplicateSelectedIds)">
           Kemaskini
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";

definePageMeta({
  title: "Edit Bantuan Bulk",
});

// Simple alert function to replace toast
const alert = (type, message) => {
  console.log(`${type.toUpperCase()}: ${message}`);
  // You can replace this with your preferred notification system
  window.alert(message);
};

// Route parameter
const route = useRoute();
const id = route.params.id;

const breadcrumb = ref([
  {
    name: "Bantuan",
    type: "link",
    path: "/BF-BTN/bantuan-bulk",
  },
  {
    name: "Bulk Processing",
    type: "link",
    path: "/BF-BTN/bantuan-bulk/cipta-bantuan-bulk",
  },
  {
    name: `Edit ${id}`,
    type: "current",
    path: `/BF-BTN/bantuan-bulk/cipta-bantuan-bulk/${id}/edit`,
  },
]);

// Mock data based on bantuan ID
const getBantuanData = (id) => {
  const data = {
    'BP-2025-00001': {
      kodBP: 'BP-2025-00001',
      tajuk: 'Wang Saku Fakir Mac 2025',
      kategoriAsnaf: 'fakir',
      status: 'Draf',
      jumlahAmaun: 'RM20,000.00',
      catatan: 'Tuntutan wang saku pelajar untuk bulan Mac 2025. Program ini bertujuan membantu pelajar fakir dalam memenuhi keperluan asas mereka.',
      namaPegawai: 'Ahmad bin Ali',
      tarikhMohon: '01/03/2025',
      aid: 'B314',
      aidProduct: 'Wang Saku',
      productPackage: 'KPIPT (Fakir)',
      productEntitlement: 'Bantuan Wang Saku',
      penyiasat: 'ahmad_hassan',
      cawangan: 'hq',
      tarikhJangkaanBayaran: '2025-05-04'
    },
    'BP-2025-00002': {
      kodBP: 'BP-2025-00002',
      tajuk: 'Wang Saku Fakir Feb 2025',
      kategoriAsnaf: 'fakir',
      status: 'Draf',
      jumlahAmaun: 'RM23,000.00',
      catatan: 'Tuntutan wang saku pelajar untuk bulan Feb 2025. Program ini bertujuan membantu pelajar fakir dalam memenuhi keperluan asas mereka.',
      namaPegawai: 'Ahmad bin Ali',
      tarikhMohon: '01/02/2025',
      aid: 'B314',
      aidProduct: 'Wang Saku',
      productPackage: 'KPIPT (Fakir)',
      productEntitlement: 'Bantuan Wang Saku',
      penyiasat: 'ahmad_hassan',
      cawangan: 'hq',
      tarikhJangkaanBayaran: '2025-05-04'
    },
    'BP-2025-00003': {
      kodBP: 'BP-2025-00003',
      tajuk: 'Wang Saku Miskin Feb 2025',
      kategoriAsnaf: 'miskin',
      status: 'Dalam Proses',
      jumlahAmaun: 'RM28,000.00',
      catatan: 'Tuntutan wang saku pelajar untuk bulan Feb 2025. Program ini bertujuan membantu pelajar miskin dalam memenuhi keperluan asas mereka.',
      namaPegawai: 'Ahmad bin Ali',
      tarikhMohon: '02/02/2025',
      aid: 'B315',
      aidProduct: 'Wang Saku',
      productPackage: 'KPIPT (Miskin)',
      productEntitlement: 'Bantuan Wang Saku',
      penyiasat: 'ahmad_hassan',
      cawangan: 'hq',
      tarikhJangkaanBayaran: '2025-05-04'
    },
    'BP-2025-00004': {
      kodBP: 'BP-2025-00004',
      tajuk: 'Bantuan bencana Feb 2025',
      kategoriAsnaf: 'fakir',
      status: 'Dalam Proses',
      jumlahAmaun: 'RM35,000.00',
      catatan: 'Tuntutan bantuan bencana untuk bulan Feb 2025. Program ini bertujuan membantu mangsa bencana fakir dalam memenuhi keperluan asas mereka.',
      namaPegawai: 'Ahmad bin Ali',
      tarikhMohon: '25/02/2025',
      aid: 'B146',
      aidProduct: 'Bantuan Bencana',
      productPackage: 'BANTUAN BANJIR (FAKIR)',
      productEntitlement: 'Bantuan Banjir',
      penyiasat: 'ahmad_hassan',
      cawangan: 'hq',
      tarikhJangkaanBayaran: '2025-05-04'
    },
    'BP-2025-00005': {
      kodBP: 'BP-2025-00005',
      tajuk: 'Bantuan Pendidikan Mac 2025',
      kategoriAsnaf: 'miskin',
      status: 'Lulus',
      jumlahAmaun: 'RM45,000.00',
      catatan: 'Tuntutan bantuan pendidikan untuk bulan Mac 2025. Program ini bertujuan membantu pelajar miskin dalam memenuhi keperluan asas mereka.',
      namaPegawai: 'Ahmad bin Ali',
      tarikhMohon: '15/03/2025',
      aid: 'B315',
      aidProduct: 'Wang Saku',
      productPackage: 'KPIPT (Miskin)',
      productEntitlement: 'Bantuan Wang Saku',
      penyiasat: 'ahmad_hassan',
      cawangan: 'hq',
      tarikhJangkaanBayaran: '2025-05-04'
    },
    'BP-2025-00006': {
      kodBP: 'BP-2025-00006',
      tajuk: 'Bantuan Kesihatan Feb 2025',
      kategoriAsnaf: 'fakir',
      status: 'Lulus',
      jumlahAmaun: 'RM30,000.00',
      catatan: 'Tuntutan bantuan kesihatan untuk bulan Feb 2025. Program ini bertujuan membantu pesakit fakir dalam memenuhi keperluan asas mereka.',
      namaPegawai: 'Ahmad bin Ali',
      tarikhMohon: '10/02/2025',
      aid: 'B200',
      aidProduct: 'Bantuan Kesihatan',
      productPackage: 'BANTUAN KESIHATAN',
      productEntitlement: 'Bantuan Kesihatan',
      penyiasat: 'ahmad_hassan',
      cawangan: 'hq'
    },
    'BP-2025-00007': {
      kodBP: 'BP-2025-00007',
      tajuk: 'Bantuan Rumah Jan 2025',
      kategoriAsnaf: 'fakir',
      status: 'Ditolak',
      jumlahAmaun: 'RM50,000.00',
      catatan: 'Tuntutan bantuan rumah untuk bulan Jan 2025. Program ini bertujuan membantu keluarga fakir dalam memenuhi keperluan asas mereka.',
      namaPegawai: 'Ahmad bin Ali',
      tarikhMohon: '05/01/2025',
      aid: 'B100',
      aidProduct: 'Bantuan Rumah',
      productPackage: 'BANTUAN RUMAH',
      productEntitlement: 'Bantuan Rumah',
      penyiasat: 'ahmad_hassan',
      cawangan: 'hq',
      tarikhJangkaanBayaran: '2025-05-04'
    },
    'BP-2025-00008': {
      kodBP: 'BP-2025-00008',
      tajuk: 'Bantuan Makanan Feb 2025',
      kategoriAsnaf: 'fakir',
      status: 'Ditolak',
      jumlahAmaun: 'RM15,000.00',
      catatan: 'Tuntutan bantuan makanan untuk bulan Feb 2025. Program ini bertujuan membantu keluarga fakir dalam memenuhi keperluan asas mereka.',
      namaPegawai: 'Ahmad bin Ali',
      tarikhMohon: '20/02/2025',
      aid: 'B150',
      aidProduct: 'Bantuan Makanan',
      productPackage: 'BANTUAN MAKANAN',
      productEntitlement: 'Bantuan Makanan',
      penyiasat: 'ahmad_hassan',
      cawangan: 'hq',
      tarikhJangkaanBayaran: '2025-05-04'
    }
  };
  
  return data[id] || data['BP-2025-00001']; // Default to first record if ID not found
};

// Form data state (populated with data based on ID)
const formData = ref(getBantuanData(id));

// Tooltip state for action buttons
const tooltips = ref({});

// Load the bantuan data from JSON
const bantuanData = ref({});

// Import the bantuan data directly
import bantuanJson from "../tambah/Grouped by Aid Code - Normalized.json";

// Set the bantuan data on component mount
onMounted(() => {
  try {
    bantuanData.value = bantuanJson;
    console.log("Loaded bantuan data:", bantuanData.value);
    console.log("Available aids:", Object.keys(bantuanData.value.bantuan || {}));
  } catch (error) {
    console.error("Error loading bantuan data:", error);
  }
});

// Form Options
const kategoriAsnafOptions = [
  { label: "Fakir", value: "fakir" },
  { label: "Miskin", value: "miskin" },
  { label: "Amil", value: "amil" },
  { label: "Muallaf", value: "muallaf" },
  { label: "Gharimin", value: "gharimin" },
  { label: "Fisabilillah", value: "fisabilillah" },
  { label: "Ibnu Sabil", value: "ibnu_sabil" },
];

const penyiasatOptions = [
  { label: "Ahmad bin Abdullah", value: "ahmad_abdullah" },
  { label: "Siti binti Ali", value: "siti_ali" },
  { label: "Mohamed bin Hassan", value: "mohamed_hassan" },
];

const cawanganOptions = [
  // Gombak
  { label: "Taman Melawati (Gombak)", value: "Taman Melawati" },
  { label: "Bandar Baru Selayang (Gombak)", value: "Bandar Baru Selayang" },
  { label: "UNIVERSITI ISLAM ANTARABANGSA MALAYSIA (UIAM)", value: "UNIVERSITI ISLAM ANTARABANGSA MALAYSIA (UIAM)" },
  // Hulu Langat
  { label: "Kajang (Hulu Langat)", value: "Kajang" },
  { label: "Bandar Baru Bangi (Hulu Langat)", value: "Bandar Baru Bangi" },
  { label: "Bandar Baru Ampang (Hulu Langat)", value: "Bandar Baru Ampang" },
  { label: "UNIVERSITI KEBANGSAAN MALAYSIA (UKM)", value: "UNIVERSITI KEBANGSAAN MALAYSIA (UKM)" },
  { label: "UNIVERSITI TENAGA NASIONAL (UNITEN)", value: "UNIVERSITI TENAGA NASIONAL (UNITEN)" },
  { label: "KOLEJ UNIVERSITI ISLAM ANTARABANGSA SELANGOR (KUIS)", value: "KOLEJ UNIVERSITI ISLAM ANTARABANGSA SELANGOR (KUIS)" },
  { label: "INFRASTRUCTURE UNIVERSITY KUALA LUMPUR (IUKL)", value: "INFRASTRUCTURE UNIVERSITY KUALA LUMPUR (IUKL)" },
  // Kuala Selangor
  { label: "UNIVERSITI SELANGOR (UNISEL)", value: "UNIVERSITI SELANGOR (UNISEL)" },
  { label: "Cawangan Zakat LZS, Kuala Selangor", value: "Cawangan Zakat LZS, Kuala Selangor" },
  // Sabak Bernam
  { label: "Cawangan Zakat LZS, Sungai Besar", value: "Cawangan Zakat LZS, Sungai Besar" },
  // Petaling
  { label: "UNIVERSITI TEKNOLOGI MARA (UiTM)", value: "UNIVERSITI TEKNOLOGI MARA (UiTM)" },
  { label: "UNITAR INTERNATIONAL UNIVERSITY (UNITAR)", value: "UNITAR INTERNATIONAL UNIVERSITY (UNITAR)" },
  { label: "UNIVERSITI PUTRA MALAYSIA (UPM)", value: "UNIVERSITI PUTRA MALAYSIA (UPM)" },
  { label: "MANAGEMENT AND SCIENCE UNIVERSITY (MSU)", value: "MANAGEMENT AND SCIENCE UNIVERSITY (MSU)" },
  { label: "Damansara (Petaling)", value: "Damansara" },
  { label: "Cawangan Ibu Pejabat LZS", value: "Cawangan Ibu Pejabat LZS" },
  // Sepang
  { label: "UNIVERSITI MULTIMEDIA (MMU)", value: "UNIVERSITI MULTIMEDIA (MMU)" },
  { label: "Saujana KLIA", value: "Saujana KLIA" },
  // Kuala Langat
  { label: "Banting", value: "Banting" },
  // Hulu Selangor
  { label: "Kuala Kubu Bharu", value: "Kuala Kubu Bharu" },
  // Klang
  { label: "Kompleks MAIS Klang", value: "Kompleks MAIS Klang" },
];

// Payment Table Configuration
const paymentColumns = [
  { key: "kod", label: "Kod" },
  { key: "idPermohonan", label: "ID Permohonan" },
  { key: "bayaranKepada", label: "Bayaran Kepada" },
  { key: "asnaf", label: "Kategori Asnaf" },
  { key: "contributor", label: "Contributor" },
  { key: "recipient", label: "Recipient" },
  { key: "organization", label: "Organization" },
  { key: "amaun", label: "Amaun" },
  { key: "tarikhBayaran", label: "Tarikh Bayaran" },
  { key: "bankName", label: "Bank" },
  { key: "bankAccount", label: "No. Akaun" },
  {
    key: "checkbox",
    label: "Tindakan",
    sortable: false,
    align: "center",
  },
];

// Recipient Table Configuration
const recipientColumns = [
  { key: "namaPenuh", label: "Nama Penuh" },
  { key: "amaun", label: "Amaun" },
  { key: "agihanSemula", label: "Agihan Semula" },
  { key: "bulkProcessing", label: "Bulk Processing" },
  { key: "kategoriAsnaf", label: "Kategori Asnaf" },
  { key: "bayaranKepada", label: "Bayaran Kepada" },
  { key: "negeri", label: "Negeri" },
  { key: "negara", label: "Negara" },
  {
    key: "actions",
    label: "Tindakan",
    sortable: false,
    align: "center",
  },
];

// State Management
const selectedFile = ref(null);
const selectedDocuments = ref([]);
const documentList = ref([
  { id: 'DOC-001', name: 'Surat Akuan Pemohon.pdf', size: '245 KB', uploadDate: '01/09/2025' },
  { id: 'DOC-002', name: 'Senarai Penerima (Lampiran A).docx', size: '1.2 MB', uploadDate: '01/09/2025' },
]);
const paymentList = ref([]);
const recipientList = ref([]);
const selectedPayments = ref([]);
const confirmedPayments = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const showImportCards = ref(false);

// State for editing
const editingPayment = ref(null);
const editingRecipient = ref(null);

// Modal states
const showPaymentModal = ref(false);
const showRecipientModal = ref(false);
const paymentModalMode = ref("add"); // 'add' or 'edit'
const recipientModalMode = ref("add"); // 'add' or 'edit'

// Form data for modals
const paymentForm = ref({
  kod: "",
  idPermohonan: "",
  bayaranKepada: "",
  asnaf: "",
  contributor: "",
  recipient: "",
  organization: "",
  amaun: 0,
  modeOfPayment: "",
  bankName: "",
  bankAccount: "",
});

const recipientForm = ref({
  id: "",
  namaPenuh: "",
  amaun: 0,
  agihanSemula: "Tidak",
  bulkProcessing: "Tidak",
  kategoriAsnaf: "",
  bayaranKepada: "Individu",
  negeri: "",
  negara: "",
});

// Computed Properties
const currentDate = computed(() => {
  return new Date().toLocaleDateString("ms-MY");
});

const totalAmount = computed(() => {
  return recipientList.value.reduce(
    (sum, recipient) => sum + (parseFloat(recipient.amaun) || 0),
    0
  );
});

// Compute jenis bantuan options from the JSON data
const aid = computed(() => {
  if (!bantuanData.value.bantuan) return [];
  
  const options = Object.entries(bantuanData.value.bantuan).map(([categoryName]) => ({
    label: categoryName,
    value: categoryName,
  }));

  return [
    { label: "-- Pilih --", value: "", disabled: true },
    ...options.sort((a, b) => a.label.localeCompare(b.label))
  ];
});

// Reset dependent selections when parent changes
watch(() => formData.value.aid, () => {
  formData.value.aidProduct = "";
  formData.value.productPackage = "";
  formData.value.productEntitlement = "";
});

watch(() => formData.value.aidProduct, () => {
  formData.value.productPackage = "";
  formData.value.productEntitlement = "";
});

watch(() => formData.value.productPackage, () => {
  formData.value.productEntitlement = "";
});

// Compute aid product options based on selected jenis bantuan
const aidProductOptions = computed(() => {
  if (!formData.value.aid || !bantuanData.value.bantuan) {
    return [{ label: "-- Pilih --", value: "", disabled: true }];
  }

  const aidNode = bantuanData.value.bantuan[formData.value.aid];
  if (!aidNode) return [{ label: "-- Pilih --", value: "", disabled: true }];

  const options = Object.keys(aidNode).map((productName) => ({
    label: productName,
    value: productName,
  }));

  return [
    { label: "-- Pilih --", value: "", disabled: true },
    ...options.sort((a, b) => a.label.localeCompare(b.label))
  ];
});

// Compute product package options based on selected aid product
const productPackageOptions = computed(() => {
  if (!formData.value.aid || !formData.value.aidProduct || !bantuanData.value.bantuan) {
    return [{ label: "-- Pilih --", value: "", disabled: true }];
  }
  
  const aidNode = bantuanData.value.bantuan[formData.value.aid];
  if (!aidNode || !aidNode[formData.value.aidProduct]) {
    return [{ label: "-- Pilih --", value: "", disabled: true }];
  }
  
  const productNode = aidNode[formData.value.aidProduct];
  const options = Object.keys(productNode).map((pkg) => ({ 
    label: pkg, 
    value: pkg 
  }));
  
  return [
    { label: "-- Pilih --", value: "", disabled: true },
    ...options.sort((a, b) => a.label.localeCompare(b.label))
  ];
});

const productEntitlementOptions = computed(() => {
  if (!formData.value.aid || !formData.value.aidProduct || !formData.value.productPackage || !bantuanData.value.bantuan) {
    return [{ label: "-- Pilih --", value: "", disabled: true }];
  }
  
  const aidNode = bantuanData.value.bantuan[formData.value.aid];
  if (!aidNode) {
    return [{ label: "-- Pilih --", value: "", disabled: true }];
  }
  
  const productNode = aidNode[formData.value.aidProduct];
  if (!productNode) {
    return [{ label: "-- Pilih --", value: "", disabled: true }];
  }
  
  const entitlements = productNode[formData.value.productPackage] || [];
  if (!Array.isArray(entitlements) || entitlements.length === 0) {
    return [{ label: "Tiada entitlements", value: "", disabled: true }];
  }
  
  const options = entitlements.map((e) => ({ 
    label: e, 
    value: e 
  }));
  
  return [
    { label: "-- Pilih --", value: "", disabled: true },
    ...options.sort((a, b) => a.label.localeCompare(b.label))
  ];
});

// Watch for changes in payment and recipient lists for debugging
watch(
  paymentList,
  (newValue) => {
    console.log("Payment list changed:", newValue);
  },
  { deep: true }
);

watch(
  recipientList,
  (newValue) => {
    console.log("Recipient list changed:", newValue);
  },
  { deep: true }
);

// Methods
const formatNumber = (number) => {
  return new Intl.NumberFormat("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

const formatCurrency = (n) => {
  // Convert to number and handle invalid values
  const num = parseFloat(n);
  if (isNaN(num) || num === null || num === undefined) {
    return 'RM0.00';
  }
  
  return new Intl.NumberFormat("ms-MY", { 
    style: 'currency', 
    currency: 'MYR',
    minimumFractionDigits: 2 
  }).format(num);
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel"
    ) {
      selectedFile.value = file;
    } else {
      alert("error", "Sila pilih fail Excel yang sah (.xlsx atau .xls)");
      event.target.value = "";
    }
  }
};

const handleDocumentUpload = (event) => {
  const files = Array.from(event.target.files);
  if (files.length > 0) {
    const validFiles = files.filter(file => 
      file.type === "application/pdf" ||
      file.type === "application/msword" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    
    if (validFiles.length === files.length) {
      selectedDocuments.value = validFiles;
    } else {
      alert("error", "Sila pilih fail PDF atau Word yang sah sahaja");
      event.target.value = "";
    }
  }
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Function to remove a file from selected documents
const removeFile = (index) => {
  selectedDocuments.value.splice(index, 1);
};

// Helper function to generate unique ID
const generateUniqueId = (prefix) => {
  return `${prefix}-${Date.now().toString().slice(-6)}-${Math.random()
    .toString(36)
    .slice(-4)}`;
};

// Function to hide import cards
const hideImportCards = () => {
  showImportCards.value = false;
};

const handleImport = async () => {
  try {
    isLoading.value = true;
    showImportCards.value = false; // Reset cards visibility before import

    // Dummy data import (simulasi data dari Excel)
    recipientList.value = [
      {
        id: generateUniqueId("RCP"),
        namaPenuh: "Nur Hazimah Binti Mohd Hafiz",
        amaun: 2400.0,
        agihanSemula: "Tidak",
        bulkProcessing: "BP-2025-00004",
        kategoriAsnaf: "Muallaf",
        bayaranKepada: "Asnaf",
        negeri: "Selangor",
        negara: "Malaysia",
      },
      {
        id: generateUniqueId("RCP"),
        namaPenuh: "Nur safiyya Binti Rosly",
        amaun: 2400.0,
        agihanSemula: "Tidak",
        bulkProcessing: "BP-2025-00004",
        kategoriAsnaf: "Fakir",
        bayaranKepada: "Asnaf",
        negeri: "Selangor",
        negara: "Malaysia",
      },
      {
        id: generateUniqueId("RCP"),
        namaPenuh: "Mohd Nazrin Bin Mokhtar",
        amaun: 2400.0,
        agihanSemula: "Tidak",
        bulkProcessing: "BP-2025-00004",
        kategoriAsnaf: "Non-FM",
        bayaranKepada: "Asnaf",
        negeri: "Selangor",
        negara: "Malaysia",
      },
      {
        id: generateUniqueId("RCP"),
        namaPenuh: "Intan Nadia Binti Mohd Zamri",
        amaun: 2400.0,
        agihanSemula: "Tidak",
        bulkProcessing: "BP-2025-00004",
        kategoriAsnaf: "Miskin",
        bayaranKepada: "Asnaf",
        negeri: "Selangor",
        negara: "Malaysia",
      },
    ];

    paymentList.value = [
      {
        kod: "PT-2025-30371",
        idPermohonan: "PRM-2025-00001",
        bayaranKepada: "recipient",
        asnaf: "Muallaf",
        recipient: "Nur Hazimah Binti Mohd Hafiz",
        organization: "AZMIDA TECHNICAL COLLEGE",
        amaun: 2400,
        modeOfPayment: "Tunai",
        bankName: "Maybank",
        bankAccount: "1623-44-889901",
        checkbox: '',
      },
      {
        kod: "PT-2025-30372",
        idPermohonan: "PRM-2025-00002",           // ← duplicate key
        bayaranKepada: "recipient",
        asnaf: "Fakir",
        recipient: "Nur safiyya Binti Rosly",
        organization: "AZMIDA TECHNICAL COLLEGE",
        amaun: 2400,
        tarikhBayaran: "Akaun",
        bankName: "Maybank",
        bankAccount: "16A3-44-889901",            // ← WRONG (letter)
        checkbox: '',
      },
      {
        kod: "PT-2025-30373",
        idPermohonan: "PRM-2025-00003",
        bayaranKepada: "recipient",
        asnaf: "Non-FM",
        recipient: "Mohd Nazrin Bin Mokhtar",
        organization: "AZMIDA TECHNICAL COLLEGE",
        amaun: 240,                               // ← WRONG amount
        modeOfPayment: "Akaun",
        bankName: "CIMB",
        bankAccount: "7600-11-222222",
        checkbox: '',
      },
      {
        kod: "PT-2025-30374",
        idPermohonan: "PRM-2025-00004",
        bayaranKepada: "recipient",
        asnaf: "Miskin", 
        recipient: "Intan Nadia Binti Mohd Zamri",
        organization: "AZMIDA TECHNICAL COLLEGE",
        amaun: 2400,
        modeOfPayment: "Tunai",
        bankName: "maybnk",                       // ← WRONG spelling
        bankAccount: "7600-11-333333",
        checkbox: '',
      },
      {
        kod: "PT-2025-30375",
        idPermohonan: "PRM-2025-00002",           // ← duplicate of …30372
        bayaranKepada: "recipient",
        asnaf: "Fakir",
        recipient: "Nur safiyya Binti Rosly",
        organization: "AZMIDA TECHNICAL COLLEGE",
        amaun: 2400,
        modeOfPayment: "Akaun",
        bankName: "Maybank",
        bankAccount: "1623-44-889901",
        checkbox: '',
      }
    ];

    // Kemas kini jumlah amaun automatik
    const jumlah = recipientList.value.reduce(
      (sum, item) => sum + (parseFloat(item.amaun) || 0),
      0
    );
    formData.value.jumlahAmaun = formatNumber(jumlah);

    alert("success", "Fail berjaya diimport dan data dimasukkan.");
    showImportCards.value = true;
  } catch (error) {
    console.error("Error importing file:", error);
    alert("error", "Gagal mengimport fail");
  } finally {
    isLoading.value = false;
  }
};

const handleDocumentImport = async () => {
  try {
    isLoading.value = true;
    // Here you would typically:
    // 1. Create FormData and append all files
    const formData = new FormData();
    selectedDocuments.value.forEach((file, index) => {
      formData.append(`documents[${index}]`, file);
    });

    // 2. Make API call to backend
    // const response = await $fetch('/api/bantuan-bulk/upload-documents', {
    //   method: 'POST',
    //   body: formData
    // });

    // 2. Mock: append uploaded files into existing documentList
    const now = new Date();
    const uploadDate = new Intl.DateTimeFormat('ms-MY', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
    selectedDocuments.value.forEach((file, i) => {
      documentList.value.push({
        id: `DOC-${Date.now()}-${i}`,
        name: file.name,
        size: formatFileSize(file.size),
        uploadDate,
      });
    });

    alert("success", `${selectedDocuments.value.length} dokumen berjaya dimuat naik`);
    selectedDocuments.value = []; // Clear selected files after upload
  } catch (error) {
    console.error("Error importing documents:", error);
    alert("error", "Gagal memuat naik dokumen");
  } finally {
    isLoading.value = false;
  }
};

// Payment methods
const handleAddPayment = () => {
  console.log("handleAddPayment called");

  // Reset form and open modal
  paymentForm.value = {
    kod: generateUniqueId("PMT"),
    idPermohonan: `PRM-${Date.now().toString().slice(-6)}`,
    bayaranKepada: "",
    asnaf: formData.value.kategoriAsnaf || "",
    contributor: "",
    recipient: "",
    organization: "",
    amaun: 0,
    modeOfPayment: "",
    bankName: "",
    bankAccount: "",
    checkbox: "",
  };

  paymentModalMode.value = "add";
  showPaymentModal.value = true;
};

const handleEditPaymentModal = (payment) => {
  paymentForm.value = { ...payment };
  paymentModalMode.value = "edit";
  showPaymentModal.value = true;
};

const handleSavePaymentModal = () => {
  console.log("handleSavePaymentModal called");
  console.log("paymentForm.value:", paymentForm.value);
  console.log("paymentModalMode.value:", paymentModalMode.value);
  
  // Validate required fields
  if (!paymentForm.value.bayaranKepada) {
    alert("error", "Sila isi bayaran kepada");
    return;
  }
  if (!paymentForm.value.asnaf) {
    alert("error", "Sila pilih asnaf");
    return;
  }
  if (!paymentForm.value.amaun || paymentForm.value.amaun <= 0) {
    alert("error", "Sila isi amaun yang sah");
    return;
  }
  if (!paymentForm.value.modeOfPayment) {
    alert("error", "Sila pilih mode of payment");
    return;
  }
  if (!paymentForm.value.idPermohonan) {
    alert("error", "Sila isi ID permohonan");
    return;
  }
  if (!paymentForm.value.bankName) {
    alert("error", "Sila pilih bank");
    return;
  }
  if (!paymentForm.value.bankAccount) {
    alert("error", "Sila isi no. akaun");
    return;
  }

  if (paymentModalMode.value === "add") {
    // Add new payment
    paymentList.value.push({ ...paymentForm.value });
    console.log("Payment added to list:", paymentList.value);
    alert("success", "Maklumat bayaran baru ditambah");
  } else {
    // Update existing payment
    const index = paymentList.value.findIndex(
      (p) => p.kod === paymentForm.value.kod
    );
    if (index !== -1) {
      paymentList.value[index] = { ...paymentForm.value };
      alert("success", "Maklumat bayaran berjaya dikemaskini");
    }
  }

  showPaymentModal.value = false;
  
  // Reset form for next use
  paymentForm.value = {
    kod: "",
    idPermohonan: "",
    bayaranKepada: "",
    asnaf: "",
    contributor: "",
    recipient: "",
    organization: "",
    amaun: 0,
    modeOfPayment: "",
    bankName: "",
    bankAccount: "",
    checkbox: "",
  };
};

const handleDeletePayment = async (payment) => {
  try {
    if (confirm("Adakah anda pasti untuk memadam maklumat bayaran ini?")) {
      const index = paymentList.value.findIndex((p) => p.kod === payment.kod);
      if (index !== -1) {
        paymentList.value.splice(index, 1);
        alert("success", "Maklumat bayaran berjaya dipadam");
      }
    }
  } catch (error) {
    console.error("Error deleting payment:", error);
    alert("error", "Gagal memadam maklumat bayaran");
  }
};

const handleClosePaymentModal = () => {
  showPaymentModal.value = false;
};

// Recipient methods
const handleAddRecipient = () => {
  console.log("handleAddRecipient called");

  // Reset form and open modal
  recipientForm.value = {
    id: generateUniqueId("RCP"),
    namaPenuh: "",
    amaun: 0,
    agihanSemula: "Tidak",
    bulkProcessing: "Tidak",
    kategoriAsnaf: formData.value.kategoriAsnaf || "",
    bayaranKepada: "Individu",
    negeri: "",
    negara: "",
  };

  recipientModalMode.value = "add";
  showRecipientModal.value = true;
};

const handleEditRecipientModal = (recipient) => {
  recipientForm.value = { 
    ...recipient,
    negeri: recipient.negeri || "",
    negara: recipient.negara || "",
  };
  recipientModalMode.value = "edit";
  showRecipientModal.value = true;
};

const handleSaveRecipientModal = () => {
  if (recipientModalMode.value === "add") {
    // Add new recipient
    recipientList.value.push({ ...recipientForm.value });
    alert("success", "Maklumat penerima baru ditambah");
  } else {
    // Update existing recipient
    const index = recipientList.value.findIndex(
      (r) => r.id === recipientForm.value.id
    );
    if (index !== -1) {
      recipientList.value[index] = { ...recipientForm.value };
      alert("success", "Maklumat penerima berjaya dikemaskini");
    }
  }

  // Update total amount
  formData.value.jumlahAmaun = formatNumber(totalAmount.value);
  showRecipientModal.value = false;
  
  // Reset form
  recipientForm.value = {
    id: "",
    namaPenuh: "",
    amaun: 0,
    agihanSemula: "Tidak",
    bulkProcessing: "Tidak",
    kategoriAsnaf: "",
    bayaranKepada: "Individu",
    negeri: "",
    negara: "",
  };
};

const handleDeleteRecipient = async (recipient) => {
  try {
    if (confirm("Adakah anda pasti untuk memadam maklumat penerima ini?")) {
      const index = recipientList.value.findIndex(
        (r) => r.id === recipient.id || r.namaPenuh === recipient.namaPenuh
      );
      if (index !== -1) {
        recipientList.value.splice(index, 1);
        // Update total amount
        formData.value.jumlahAmaun = formatNumber(totalAmount.value);
        alert("success", "Maklumat penerima berjaya dipadam");
      }
    }
  } catch (error) {
    console.error("Error deleting recipient:", error);
    alert("error", "Gagal memadam maklumat penerima");
  }
};

const handleCloseRecipientModal = () => {
  showRecipientModal.value = false;
  
  // Reset form
  recipientForm.value = {
    id: "",
    namaPenuh: "",
    amaun: 0,
    agihanSemula: "Tidak",
    bulkProcessing: "Tidak",
    kategoriAsnaf: "",
    bayaranKepada: "Individu",
    negeri: "",
    negara: "",
  };
};

// Constants & helpers for Data Rosak flow
const allowedBanks = ["Maybank", "CIMB", "Bank Islam", "RHB"];
const validAmounts = [1200, 2400];

const normalizeBank = (s) => (s ?? "").trim().toLowerCase();

const isBadAcc = (acc) => {
  if (!acc) return true;
  if (!/^[\d-]+$/.test(acc)) return true;           // only digits & dashes
  const digits = acc.replace(/-/g, "");
  return digits.length < 10 || digits.length > 20;  // 10–20 digits
};

const fmt = (n) =>
  new Intl.NumberFormat("ms-MY", { minimumFractionDigits: 0 }).format(n);

// State Management for Damaged Data
const showViewDetailsModal = ref(false);
const showKemaskiniModal = ref(false);
const selectedDamagedData = ref(null);
const editingPaymentForDefect = ref(null);

// Computed damaged data derived from paymentList
const damagedDataList = computed(() => {
  const rows = paymentList.value;
  if (!rows?.length) return [];

  // count duplicates by idPermohonan
  const counts = rows.reduce((m, p) => {
    m[p.idPermohonan] = (m[p.idPermohonan] || 0) + 1;
    return m;
  }, {});

  const out = [];
  let defectCounter = 1;

  rows.forEach((p, i) => {
    const reasons = [];
    if ((counts[p.idPermohonan] ?? 0) > 1) reasons.push("Duplikasi");
    if (isBadAcc(p.bankAccount)) reasons.push("No Akaun");
    if (!allowedBanks.map(normalizeBank).includes(normalizeBank(p.bankName))) reasons.push("Nama Bank");
    if (!validAmounts.includes(Number(p.amaun))) reasons.push("Amaun");
    
    if (!reasons.length) return;

    const parts = [];
    if (reasons.includes("Duplikasi")) parts.push(`Id Permohonan ${p.idPermohonan} muncul ${counts[p.idPermohonan]}x`);
    if (reasons.includes("No Akaun")) parts.push(`Format akaun tidak sah: ${p.bankAccount}`);
    if (reasons.includes("Nama Bank")) parts.push(`Nama bank tidak dikenali: ${p.bankName}`);
    if (reasons.includes("Amaun")) parts.push(`Amaun ${fmt(p.amaun)} tidak dalam julat demo`);

    out.push({
      no: defectCounter++,
      id: `DEF-${String(defectCounter - 1).padStart(3, "0")}`, // Hidden but needed for logic
      namaPenerima: p.recipient,
      catatan: parts.join(" · "),
      jenisMasalah: reasons.join(", "), // Hidden but needed for logic
      idPermohonan: p.idPermohonan, // Hidden but needed for logic
      pointer: p.kod, // Hidden but needed for logic
      actions: "",
    });
  });

  return out;
});

// Clean payment list: only rows with no defects
const cleanPaymentList = computed(() => {
  const rows = paymentList.value;
  if (!rows?.length) return [];

  const counts = rows.reduce((m, p) => {
    m[p.idPermohonan] = (m[p.idPermohonan] || 0) + 1;
    return m;
  }, {});

  return rows.filter(p => {
    const hasDuplicate = (counts[p.idPermohonan] ?? 0) > 1;
    const hasBadAcc = isBadAcc(p.bankAccount);
    const badBank = !allowedBanks.map(normalizeBank).includes(normalizeBank(p.bankName));
    const badAmount = !validAmounts.includes(Number(p.amaun));
    return !(hasDuplicate || hasBadAcc || badBank || badAmount);
  });
});

// Group duplicates by idPermohonan so only one representative row appears
const damagedDataListGrouped = computed(() => {
  const list = damagedDataList.value;
  if (!list.length) return [];
  const seen = new Set();
  const grouped = [];
  for (const row of list) {
    const key = row.idPermohonan || row.pointer || row.id;
    if ((row.jenisMasalah || '').includes('Duplikasi')) {
      if (seen.has(key)) continue;
      seen.add(key);
      grouped.push(row);
    } else {
      grouped.push(row);
    }
  }
  return grouped;
});

// Methods for Damaged Data
const handleKemaskiniDamagedData = (defectRow) => {
  // Find the payment data by matching the pointer (kod)
  const payment = paymentList.value.find(p => p.kod === defectRow.pointer);
  if (!payment) {
    alert("error", "Maklumat bayaran tidak dijumpai");
    return;
  }
  
  // Populate the editingPaymentForDefect with payment data
  editingPaymentForDefect.value = {
    pointer: payment.kod,
    bayaranKepada: payment.recipient,
    idPermohonan: payment.idPermohonan,
    bankAccount: payment.bankAccount,
    bankName: payment.bankName,
    amaun: Number(payment.amaun),
    // Include other fields for display (read-only)
    kod: payment.kod,
    asnaf: payment.asnaf,
    contributor: payment.contributor,
    recipient: payment.recipient,
    organization: payment.organization,
    tarikhBayaran: payment.tarikhBayaran,
    status: payment.status,
  };
  
  // Open the kemaskini modal
  showKemaskiniModal.value = true;
};

const handleSaveDamagedDataChanges = () => {
  const ed = editingPaymentForDefect.value;
  if (!ed) return;

  // Validations
  if (isBadAcc(ed.bankAccount)) {
    alert("error", "No. akaun bank tidak sah (hanya nombor & tanda '-')");
    return;
  }
  if (!allowedBanks.map(normalizeBank).includes(normalizeBank(ed.bankName))) {
    alert("error", "Sila pilih nama bank yang sah");
    return;
  }

  // Find and update the payment row
  const idx = paymentList.value.findIndex(p => p.kod === ed.pointer);
  if (idx !== -1) {
    // Update only the editable fields
    Object.assign(paymentList.value[idx], {
      bankAccount: ed.bankAccount,
      bankName: ed.bankName,
      amaun: Number(ed.amaun),
    });
    
    alert("success", "Kemaskini berjaya. Rekod ralat akan hilang jika semua isu selesai.");
  } else {
    alert("error", "Maklumat bayaran tidak dijumpai");
    return;
  }
  
  // Close modal and reset form
  showKemaskiniModal.value = false;
  editingPaymentForDefect.value = null;
};

// Duplicate Modal state and handlers
const showDuplicateModal = ref(false);
const duplicateRows = ref([]);
const duplicateSearch = ref('');
const duplicateSelectedIds = ref([]);

const formatMsDate = (d) => {
  try {
    const date = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('ms-MY', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
  } catch {
    return '';
  }
};

const filteredDuplicateRows = computed(() => {
  const q = (duplicateSearch.value || '').toString().toLowerCase();
  if (!q) return duplicateRows.value;
  return duplicateRows.value.filter(r =>
    (r.idPermohonan || '').toString().toLowerCase().includes(q) ||
    (r.aid || '').toString().toLowerCase().includes(q) ||
    (r.aidProduct || '').toString().toLowerCase().includes(q) ||
    (r.status || '').toString().toLowerCase().includes(q) ||
    (r.tarikhMohon ? formatMsDate(r.tarikhMohon) : '').toLowerCase().includes(q)
  );
});

const openDuplicateModalFor = (row) => {
  // Safety check - ensure this is a duplicate issue
  if (!row?.jenisMasalah?.includes("Duplikasi")) {
    // This shouldn't happen due to the disabled button, but just in case
    alert("error", "Fungsi ini hanya untuk isu Duplikasi sahaja");
    return;
  }
  
  // For duplicate issues, build the duplicate group from the single source of truth
  const group = paymentList.value.filter(p => p.idPermohonan === row.idPermohonan);
  duplicateRows.value = group.map((p, idx) => ({
    id: p.kod,
    idPermohonan: p.idPermohonan,
    aid: "B314",
    aidProduct: "Wang Saku",
    jumlahAmaun: p.amaun,
    status: p.status ?? "Dalam Proses",
    tarikhMohon: p.tarikhBayaran,
    no: idx + 1,
  }));
  // Reset selection each time modal opens
  duplicateSelectedIds.value = [];
  showDuplicateModal.value = true;
};

const onDuplicateClose = () => {
  showDuplicateModal.value = false;
};

const onDuplicateConfirm = (ids /* selected ids from the modal: could be idPermohonan or payment kod */) => {
  try {
    const selected = Array.isArray(ids) ? ids : [];
    if (selected.length === 0) {
      showDuplicateModal.value = false;
      return;
    }

    const isIdPermohonanList = selected.every(v => typeof v === 'string' && v.startsWith('PRM-'));

    if (isIdPermohonanList) {
      // Remove all rows that belong to the chosen idPermohonan values
      paymentList.value = paymentList.value.filter(p => !selected.includes(p.idPermohonan));
    } else {
      // Treat selections as payment kod(s). Also support a mixed list just in case.
      const selectedKod = new Set(selected);
      const selectedPermohonan = new Set(
        selected.filter(v => typeof v === 'string' && v.startsWith('PRM-'))
      );

      paymentList.value = paymentList.value.filter(p => {
        const matchKod = selectedKod.has(p.kod);
        const matchPermohonan = selectedPermohonan.has(p.idPermohonan);
        return !(matchKod || matchPermohonan);
      });
    }

    showDuplicateModal.value = false;
    duplicateSelectedIds.value = [];
    alert("success", "Rekod duplikasi telah dipadam & jadual dikemas kini.");
  } catch (e) {
    console.error(e);
    alert("error", "Gagal memadam rekod duplikasi");
  }
};

const onOpenApplication = (idPermohonan) => {
  console.log("Open application:", idPermohonan);
  // navigateTo(`/permohonan/${idPermohonan}`)
};

// Methods
const getStatusVariant = (status) => {
  switch (status) {
    case 'Draf':
      return 'disabled';
    case 'Sedang Diproses':
    case 'Dalam Proses':
      return 'warning';
    case 'Ditolak':
      return 'danger';
    case 'Baru':
      return 'primary';
    case 'Selesai':
      return 'success';
    default:
      return 'secondary';
  }
};

const handleKembali = () => {
  navigateTo('/BF-BTN/bantuan-bulk/cipta-bantuan-bulk');
};

// Download CSV template for Maklumat Bayaran Kepada (Payable To)
const downloadPayableToTemplate = () => {
  try {
    // Use the same column labels as the Payable To table, excluding action columns
    const headers = paymentColumns
      .filter((c) => c.key !== 'checkbox')
      .map((c) => c.label);

    const csvContent = headers.join(',') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'format-maklumat-payable-to.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('Gagal muat turun format CSV:', e);
    alert('error', 'Gagal memuat turun format CSV');
  }
};

const handleSave = async () => {
  try {
    isSubmitting.value = true;
    // Here you would typically:
    // 1. Prepare the data
    const payload = {
      ...formData.value,
      recipients: recipientList.value,
      payments: paymentList.value,
    };

    // 2. Make API call to backend
    // const response = await $fetch('/api/bantuan-bulk', {
    //   method: 'PUT',
    //   body: payload
    // });

    alert("success", "Bulk Processing berjaya disimpan");
    // Navigate back after successful save
    handleKembali();
  } catch (error) {
    console.error("Error saving bulk processing:", error);
    alert("error", "Gagal menyimpan bulk processing");
  } finally {
    isSubmitting.value = false;
  }
};

const handleHantar = async () => {
  try {
    isSubmitting.value = true;
    // Here you would typically make an API call to submit the data
    // const response = await $fetch('/api/bantuan-bulk/submit', {
    //   method: 'POST',
    //   body: formData.value
    // });
    
    alert("success", "Bulk Processing berjaya dihantar");
    // Navigate back after successful submission
    handleKembali();
  } catch (error) {
    console.error("Error submitting bulk processing:", error);
    alert("error", "Gagal menghantar bulk processing");
  } finally {
    isSubmitting.value = false;
  }
};

const handleSahkanSelected = () => {
  confirmedPayments.value = [...selectedPayments.value];
  alert('success', `${confirmedPayments.value.length} bayaran telah disahkan untuk tindakan seterusnya.`);
};

</script>

<style lang="scss" scoped>
.rs-table {
  :deep(th) {
    background-color: #f9fafb;
    color: #4b5563;
    font-weight: 500;
  }
}

.loading {
  opacity: 0.5;
  pointer-events: none;
}

.form-actions {
  position: sticky;
  bottom: 0;
  background-color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 1rem;
  z-index: 10;
}

.tooltip-enter-active, .tooltip-leave-active {
  transition: opacity 0.2s;
}
.tooltip-enter-from, .tooltip-leave-to {
  opacity: 0;
}
</style>
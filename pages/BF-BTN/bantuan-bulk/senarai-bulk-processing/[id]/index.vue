<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="space-y-4 mt-4">
      <!-- Maklumat Umum Section -->
      <rs-card>
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="material-symbols:list" class="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">Maklumat Umum</h2>
                <p class="text-sm text-gray-500">Maklumat asas bantuan</p>
              </div>
            </div>
            <!-- <rs-button variant="primary" @click="navigateTo('senarai-bulk-processing/[id]/edit')">
              <Icon name="ph:paper-plane-tilt" class="mr-1" /> Agih Tugas
            </rs-button> -->
          </div>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Kod BP -->
            <FormKit
              type="text"
              name="kodBP"
              label="Kod BP"
              v-model="formData.kodBP"
              disabled
            />

            <!-- Tajuk -->
            <FormKit
              type="text"
              name="tajuk"
              label="Tajuk"
              v-model="formData.tajuk"
              disabled
            />

            <!-- Kategori Asnaf -->
            <FormKit
              type="text"
              name="kategoriAsnaf"
              label="Kategori Asnaf"
              v-model="formData.kategoriAsnaf"
              disabled
            />

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Status</label
              >
              <rs-badge :variant="getStatusVariant(formData.status)">
                {{ formData.status }}
              </rs-badge>
            </div>

            <!-- Jumlah Amaun -->
            <FormKit
              type="text"
              name="jumlahAmaun"
              label="Jumlah Amaun (RM)"
              v-model="formData.jumlahAmaun"
              disabled
            />

            <!-- Catatan -->
            <FormKit
              type="textarea"
              name="catatan"
              label="Catatan"
              v-model="formData.catatan"
              disabled
              :classes="{
                input: 'h-24',
              }"
            />

            <!-- Nama Pegawai -->
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
                :disabled="true"
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
                :disabled="true"
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
                :disabled="true"
              />
            <!-- Product Entitlement (checkbox list, consistent with index.vue) -->
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Product Entitlement</label>
              <div class="mt-2 space-y-2">
                <div
                  v-for="option in productEntitlementOptions"
                  :key="option.value"
                  class="flex items-center"
                >
                  <input
                    :id="`entitlement-${option.value}`"
                    type="checkbox"
                    :value="option.value"
                    v-model="formData.productEntitlement"
                    :disabled="true"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <label
                    :for="`entitlement-${option.value}`"
                    class="ml-2 text-sm text-gray-700 cursor-pointer"
                  >
                    {{ option.label }}
                  </label>
                </div>
              </div>
            </div>

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
              :disabled="true"
            />

            
            <!-- Mode Of Payment -->
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Mode Of Payment</label>
              <div class="mt-2 space-y-2">
                <div
                  v-for="opt in [
                    { label: 'Tunai', value: 'Tunai' },
                    { label: 'Profile', value: 'Profile' }
                  ]"
                  :key="opt.value"
                  class="flex items-center"
                >
                  <input
                    :id="`mode-${opt.value}`"
                    type="radio"
                    name="modeOfPayment"
                    :value="opt.value"
                    v-model="formData.modeOfPayment"
                    :disabled="true"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label :for="`mode-${opt.value}`" class="ml-2 text-sm text-gray-700 cursor-pointer">
                    {{ opt.label }}
                  </label>
                </div>
              </div>
            </div>

            <!-- Cawangan (CustomSelect) -->
            <CustomSelect
              v-model="formData.cawangan"
              :options="cawanganOptions"
              label="Cawangan"
              search-placeholder="Cari cawangan..."
              :disabled="true"
              :classes="{
                outer: 'md:col-span-2',
              }"
            />
          </div>
        </template>
      </rs-card>

            
      <!-- ===================== Senarai Entitlement Product ===================== -->
      <rs-card class="shadow-sm border-0 bg-white">
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:gift" class="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Senarai Entitlement Product</h2>
              <p class="text-sm text-gray-500">Bantuan yang dipilih berdasarkan checkbox</p>
            </div>
          </div>
        </template>

        <template #body>
          <div class="space-y-4">
            <div v-if="selectedEntitlementProducts.length > 0" class="grid grid-cols-1">
              <div
                v-for="(product, index) in selectedEntitlementProducts"
                :key="product.code"
                class="relative border rounded-lg p-4 transition-all duration-200 hover:shadow-md"
                :class="{
                  'border-green-200 bg-green-50': product.status === 'lengkap',
                  'border-blue-200 bg-blue-50': product.status === 'sedang_edit',
                  'border-gray-200 bg-white': product.status === 'baru',
                }"
              >
                <div class="absolute top-2 right-2">
                  <rs-badge :variant="getProductStatusVariant(product.status)" class="text-xs">
                    {{ getProductStatusText(product.status) }}
                  </rs-badge>
                </div>

                <div class="pr-16">
                  <h3 class="font-semibold text-gray-900 text-sm mb-2">{{ product.name }}</h3>
                  <p class="text-xs text-gray-600 mb-1">{{ product.code }}</p>
                  <p class="text-xs text-gray-600 mb-3">{{ product.category }}</p>
                </div>

                <div class="mt-4 space-y-4" v-if="product.status === 'sedang_edit'">
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
                              accept=".xlsx,.xls,.csv"
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

                            <!-- <div class="flex items-center gap-2">

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
                              </div> -->
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
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Penerima</th>   
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amaun (RM)</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MOP</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Bank</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Akaun Bank</th>
                                    <!-- <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Tindakan
                                    </th> -->
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
                                        {{ payment.recipient }}
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
                                      <!-- <td class="px-4 py-4 whitespace-nowrap">
                                        <div class="flex justify-center">
                                          <input
                                            type="checkbox"
                                            :value="payment.kod"
                                            v-model="selectedPayments"
                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                          />
                                        </div>
                                      </td> -->
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
                                <Icon name="material-symbols:person" class="w-6 h-6 text-teal-600" />
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
                          <!-- Custom Table -->
                          <div class="overflow-x-auto">
                            <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                              <!-- Table Header -->
                              <thead class="bg-gray-50">
                                <tr>
                                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Penuh</th>
                                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amaun (RM)</th>
                                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agihan Semula</th>   
                                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kod BP</th>
                                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori Asnaf</th>
                                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bayaran Kepada</th>
                                  <!-- <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Negeri</th>
                                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Negara</th> -->
                                </tr>
                              </thead>
                              <!-- Table Body -->
                                <tbody class="bg-white divide-y divide-gray-200">
                                  <tr v-for="(payment, index) in recipientList" :key="payment.id" 
                                      class="hover:bg-gray-50 transition-colors duration-150">
                                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                      {{ index + 1 }}
                                    </td>
                                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {{ payment.namaPenuh }}
                                    </td>
                                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {{ formatCurrency(payment.amaun)  }}
                                    </td>                               
                                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {{ payment.agihanSemula }}
                                    </td>                               
                                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                      {{ payment.bulkProcessing }}
                                    </td>
                                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {{ payment.kategoriAsnaf }}
                                    </td>
                                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {{ payment.bayaranKepada }}
                                    </td>
                                    <!-- <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {{ payment.negeri }}
                                    </td>
                                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {{ payment.negara }}
                                    </td>                                -->
                                  </tr>
                                </tbody>
                            </table>
                          </div>
                        </div>
                      </template>
                    </rs-card>
                </div>

                <div class="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                  <div v-if="product.status === 'sedang_edit'" class="flex space-x-2">
                    <rs-button variant="success" size="sm" @click="saveProduct(index)">Simpan</rs-button>
                    <!-- <rs-button variant="secondary" size="sm" @click="cancelEdit(index)">Batal</rs-button> -->
                  </div>
                  <div v-else class="flex space-x-2">
                    <rs-button variant="primary" size="sm" @click="editProduct(index)">Lihat</rs-button>
                    <button @click="removeProduct(index)" class="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded">
                      <Icon name="ph:trash" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="selectedEntitlementProducts.length === 0" class="text-center py-8 text-gray-500">
              <Icon name="ph:gift" class="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p class="text-sm">Tiada entitlement product dipilih. Pilih checkbox di atas untuk menambah.</p>
            </div>
          </div>
        </template>
      </rs-card> 
      <!-- Dokumen Section -->
      <rs-card>
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Icon name="material-symbols:description" class="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Dokumen Sokongan</h2>
              <p class="text-sm text-gray-500">Fail dan dokumen berkaitan</p>
            </div>
          </div>
        </template>
        <template #body>
          <div v-if="documentList.length === 0" class="text-center py-8 text-gray-500">
            Tiada dokumen dimuat naik.
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="(document, index) in documentList"
              :key="index"
              class="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
            >
              <div class="flex items-center space-x-3">
                <Icon name="material-symbols:description" class="w-8 h-8 text-blue-500" />
                <div>
                  <p class="font-medium text-gray-900">{{ document.name }}</p>
                  <p class="text-sm text-gray-500">{{ document.size }} • {{ document.uploadDate }}</p>
                </div>
              </div>
              <rs-button variant="primary-outline" size="sm">
                <Icon name="material-symbols:download" class="w-4 h-4 mr-1" />
                Muat Turun
              </rs-button>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Action Buttons -->
      <div class="form-actions">
        <div class="flex justify-between space-x-4">
          <rs-button
            variant="secondary"
            @click="navigateBack"
          >
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
            Kembali
          </rs-button>
          <div class="flex space-x-2">
            <rs-button
              variant="info"
              @click="editBantuan"
            >
              <Icon name="ph:floppy-disk" class="w-4 h-4 mr-1" />
              Simpan
            </rs-button>
            <rs-button
              variant="primary"
              @click="submitBantuan"
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
          type="date"
          name="tarikhBayaran"
          label="Tarikh Bayaran"
          v-model="paymentForm.tarikhBayaran"
          validation="required"
        />
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <rs-button variant="secondary" @click="handleClosePaymentModal">
            Batal
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
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'

definePageMeta({
  title: 'Lihat Bantuan Bulk',
})

// Route parameter
const route = useRoute()
const id = route.params.id

const breadcrumb = ref([
  {
    name: 'Bantuan',
    type: 'link',
    path: '/BF-BTN/bantuan-bulk',
  },
  {
    name: 'Bulk Processing',
    type: 'link',
    path: '/BF-BTN/bantuan-bulk',
  },
  {
    name: 'Senarai Bulk Processing',
    type: 'link',
    path: '/BF-BTN/bantuan-bulk/senarai-bulk-processing',
  },
  {
    name: `Lihat ${id}`,
    type: 'current',
    path: `/BF-BTN/bantuan-bulk/senarai-bulk-processing/${id}`,
  },
])

/* ---------- DATA / STATE THAT WERE MISSING ---------- */
const bantuanData = ref({ bantuan: {} })
const selectedPayments = ref([])
const selectedDocuments = ref([])
const damagedDataList = ref([]) // kept harmless for showImportCards
const isLoading = ref(false)
const selectedFile = ref(null)

// --- Upload state (one file per entitlement code) ---
const uploadsByEntitlement = reactive({})
const currentImportCode = ref(null)   // which entitlement the selection belongs to
const isReplacing = ref(false)        // UI flag when user clicks "Ganti Fail"

const maxUploads = computed(() => (formData.value.productEntitlement?.length ?? 0))
const totalUploads = computed(() => Object.keys(uploadsByEntitlement).length)

const hasUpload = (code) => Boolean(uploadsByEntitlement[code])

const formatBytes = (bytes) => {
  if (!bytes && bytes !== 0) return '-'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

// Validate extension (.xlsx, .xls, .csv)
function isValidImportFile(file) {
  const okExt = ['.xlsx', '.xls', '.csv']
  const name = file.name.toLowerCase()
  return okExt.some(ext => name.endsWith(ext))
}

/* ---------- MOCK: bantuan by ID ---------- */
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
      aid: '(HQ) BANTUAN BENCANA (FAKIR)',
      aidProduct: 'BANTUAN RIBUT/TANAH RUNTUH(FAKIR)',
      productPackage: 'BANTUAN RIBUT/TANAH RUNTUH - RUMAH SETINGGAN (FAKIR)',
      productEntitlement: ['BANTUAN RIBUT/TANAH RUNTUH - RUMAH SETINGGAN (FAKIR)'],
      penyiasat: 'ahmad_hassan',
      cawangan: 'hq',
      modeOfPayment: 'Tunai',
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
      productEntitlement: ['Bantuan Wang Saku'],
      penyiasat: 'ahmad_hassan',
      cawangan: 'hq',
      modeOfPayment: 'Tunai',
      tarikhJangkaanBayaran: '2025-05-04'
    },
    'BP-2025-00003': {
      kodBP: 'BP-2025-00003',
      tajuk: 'Bantuan RM 600 kepada keluarga yang terkesan banjir di Hulu Langat',
      kategoriAsnaf: 'miskin',
      status: 'Dalam Proses',
      jumlahAmaun: 'RM28,000.00',
      catatan: 'LZS menyediakan bantuan RM 600 kepada keluarga yang terkesan banjir. Permohonan hanya memerlukan dokumen minimum (laporan polis atau pengesahan dari ketua masyarakat) agar bantuan dapat disalurkan segera.',
      namaPegawai: 'Ahmad bin Ali',
      tarikhMohon: '02/02/2025',
      aid: '(HQ) BANTUAN BENCANA (FAKIR)',
      aidProduct: '(HQ) BANTUAN BANJIR (FAKIR)',
      productPackage: '(HQ) BANTUAN BANJIR - RUMAH SENDIRI (FAKIR)',
      productEntitlement: ['(HQ) BANTUAN BANJIR - RUMAH SENDIRI (FAKIR)'],
      penyiasat: 'ahmad_hassan',
      cawangan: 'Kajang',
      modeOfPayment: 'Tunai',
      tarikhJangkaanBayaran: '2025-05-04'
    },
    'BP-2025-00004': {
      kodBP: 'BP-2025-00004',
      tajuk: 'Tuntutan KFAM APRIL 2025 - GURU',
      kategoriAsnaf: 'fakir',
      status: 'Dalam Proses',
      jumlahAmaun: 'RM35,000.00',
      catatan: 'Tuntutan bantuan bencana untuk bulan Feb 2025. Program ini bertujuan membantu mangsa bencana fakir dalam memenuhi keperluan asas mereka.',
      namaPegawai: 'Ahmad bin Ali',
      tarikhMohon: '25/02/2025',
      aid: '(HQ) BANTUAN BENCANA (FAKIR)',
      aidProduct: '(HQ) BANTUAN BANJIR (FAKIR)',
      productPackage: '(HQ) BANTUAN BANJIR - RUMAH SENDIRI (FAKIR)',
      productEntitlement: ['(HQ) BANTUAN BANJIR - RUMAH SENDIRI (FAKIR)'],
      penyiasat: 'ahmad_hassan',
      cawangan: 'Kajang',
      modeOfPayment: 'Tunai',
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
      productEntitlement: ['Bantuan Wang Saku'],
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
      productEntitlement: ['Bantuan Kesihatan',],
      penyiasat: 'ahmad_hassan',
      cawangan: 'hq',
      modeOfPayment: 'Tunai',
      tarikhJangkaanBayaran: '2025-05-04'
    },
    'BP-2025-00007': {
      kodBP: 'BP-2025-00007',
      tajuk: 'Bantuan Rumah Jan 2025',
      kategoriAsnaf: 'fakir',
      status: 'Rework',
      jumlahAmaun: 'RM50,000.00',
      catatan: 'Tuntutan bantuan rumah untuk bulan Jan 2025. Program ini bertujuan membantu keluarga fakir dalam memenuhi keperluan asas mereka.',
      namaPegawai: 'Ahmad bin Ali',
      tarikhMohon: '05/01/2025',
      aid: 'B100',
      aidProduct: 'Bantuan Rumah',
      productPackage: 'BANTUAN RUMAH',
      productEntitlement: ['Bantuan Rumah'],
      penyiasat: 'ahmad_hassan',
      cawangan: 'hq',
      modeOfPayment: 'Tunai',
      tarikhJangkaanBayaran: '2025-05-04'
    },
    'BP-2025-00008': {
      kodBP: 'BP-2025-00008',
      tajuk: 'Bantuan Makanan Feb 2025',
      kategoriAsnaf: 'fakir',
      status: 'Rework',
      jumlahAmaun: 'RM15,000.00',
      catatan: 'Tuntutan bantuan makanan untuk bulan Feb 2025. Program ini bertujuan membantu keluarga fakir dalam memenuhi keperluan asas mereka.',
      namaPegawai: 'Ahmad bin Ali',
      tarikhMohon: '20/02/2025',
      aid: 'B150',
      aidProduct: 'Bantuan Makanan',
      productPackage: 'BANTUAN MAKANAN',
      productEntitlement: ['Bantuan Makanan'],
      penyiasat: 'ahmad_hassan',
      cawangan: 'hq',
      modeOfPayment: 'Tunai',
      tarikhJangkaanBayaran: '2025-05-04'
    }
  };
  
  return data[id] || data['BP-2025-00001']; // Default to first record if ID not found
};

// Form data state (populated with data based on ID)
const formData = ref(getBantuanData(id));
// Ensure productEntitlement is always an array for checkbox v-model
if (!Array.isArray(formData.value.productEntitlement)) {
  formData.value.productEntitlement = formData.value.productEntitlement
    ? [formData.value.productEntitlement]
    : [];
}

// Reset dependent selections when parent changes
watch(() => formData.value.aid, () => {
  formData.value.aidProduct = "";
  formData.value.productPackage = "";
  formData.value.productEntitlement = [];
});

watch(() => formData.value.aidProduct, () => {
  formData.value.productPackage = "";
  formData.value.productEntitlement = [];
});

watch(() => formData.value.productPackage, () => {
  formData.value.productEntitlement = [];
});

/* ---------- JSON: bantuan choices ---------- */
import bantuanJson from "../tambah/Grouped by Aid Code - Normalized.json";

onMounted(() => {
  try {
    bantuanData.value = bantuanJson;
    console.log("Loaded bantuan data:", bantuanData.value);
    console.log("Available aids:", Object.keys(bantuanData.value.bantuan || {}));
  } catch (error) {
    console.error("Error loading bantuan data:", error);
  }
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
  console.log('=== Product Entitlement Debug ===');
  console.log('formData.aid:', formData.value.aid);
  console.log('formData.aidProduct:', formData.value.aidProduct);
  console.log('formData.productPackage:', formData.value.productPackage);
  console.log('bantuanData.bantuan:', bantuanData.value.bantuan);
  
  if (!formData.value.aid || !formData.value.aidProduct || !formData.value.productPackage || !bantuanData.value.bantuan) {
    console.log('Early return: missing required data');
    return [];
  }
  
  const aidNode = bantuanData.value.bantuan[formData.value.aid];
  console.log('aidNode:', aidNode);
  if (!aidNode) {
    console.log('No aidNode found');
    return [];
  }
  
  const productNode = aidNode[formData.value.aidProduct];
  console.log('productNode:', productNode);
  if (!productNode) {
    console.log('No productNode found');
    return [];
  }
  
  const entitlements = productNode[formData.value.productPackage] || [];
  console.log('entitlements:', entitlements);
  if (!Array.isArray(entitlements) || entitlements.length === 0) {
    console.log('No valid entitlements found');
    return [];
  }
  
  const options = entitlements.map((e) => ({ 
    label: e, 
    value: e 
  }));
  console.log('Final options:', options);
  
   return options.sort((a, b) => a.label.localeCompare(b.label));
});

/* ---------- Per-entitlement status ---------- */
const productState = reactive({})
const editingProductIndex = ref(-1)

/* ---------- Build entitlement cards from selections ---------- */
const selectedEntitlementProducts = computed(() => {
  const selected = formData.value?.productEntitlement ?? [];
  if (!Array.isArray(selected) || selected.length === 0) return [];
  
  return selected.map((code, idx) => {
    const stored = productState[code]?.status ?? 'baru';
    return {
      id: `product-${code}`,
      code,
      name: code.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      category: formData.value.aidProduct || '-',
      status: idx === editingProductIndex.value ? 'sedang_edit' : stored,
      // passthrough context (safe)
    paymentList: paymentList.value,
    recipientList: recipientList.value,
    selectedPayments: selectedPayments.value,
    selectedDocuments: selectedDocuments.value,
    showImportCards: showImportCards.value,
    isLoading: isLoading.value,
    formatCurrency: (amount) => new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR'
    }).format(amount || 0),
    formatFileSize: (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    };
  });
});

  // Ensure productState has entries for current selections
  watch(
    () => formData.value.productEntitlement,
    (list) => {
      if (!Array.isArray(list)) return;
      list.forEach((code) => {
        if (!productState[code]) productState[code] = { status: 'baru' };
      });
      // Clean up removed codes
      Object.keys(productState).forEach((code) => {
        if (!list.includes(code)) delete productState[code];
      });
    },
    { immediate: true, deep: true }
  );

  const editProduct = (index) => {
    const card = selectedEntitlementProducts.value[index];
    if (!card) return;
    const code = card.code;
    productState[code] = { ...(productState[code] ?? { status: 'baru' }), status: 'sedang_edit' };
    editingProductIndex.value = index;
  };

  const cancelEdit = (index) => {
    const card = selectedEntitlementProducts.value[index];
    if (!card) return;
    const code = card.code;
    productState[code] = { ...(productState[code] ?? { status: 'baru' }), status: 'baru' };
    editingProductIndex.value = -1;
  };

  const saveProduct = (index) => {
    const card = selectedEntitlementProducts.value[index];
    if (!card) return;
    const code = card.code;
    productState[code] = { ...(productState[code] ?? { status: 'baru' }), status: 'lengkap' };
    editingProductIndex.value = -1;
  };

  const removeProduct = (index) => {
    const list = formData.value?.productEntitlement ?? [];
    const code = selectedEntitlementProducts.value[index]?.code;
    if (!code) return;
    formData.value.productEntitlement = list.filter((c) => c !== code);
    delete productState[code];
  };

/* ---------- Payment/Recipient data ---------- */
const paymentDataByBp = {
  "BP-2025-00003": [
    { kod: "PT-2025-0001", idPermohonan: "", bayaranKepada: "asnaf", asnaf: "Ahmad bin Salleh", recipient: "", organization: "", amaun: 600, modeOfPayment: "EFT",  bankName: "Maybank",         bankAccount: "162345678901", accountNumber: "162345678901", checkbox: "" },
    { kod: "PT-2025-0002", idPermohonan: "", bayaranKepada: "asnaf", asnaf: "Aisyah binti Abdullah", recipient: "", organization: "", amaun: 600, modeOfPayment: "EFT",  bankName: "Bank Islam",      bankAccount: "100299883344", accountNumber: "100299883344", checkbox: "" },
    { kod: "PT-2025-0003", idPermohonan: "", bayaranKepada: "asnaf", asnaf: "Mariam binti Ismail", recipient: "", organization: "", amaun: 600, modeOfPayment: "Tunai", bankName: "-",                bankAccount: "",             accountNumber: "",             checkbox: "" },
    { kod: "PT-2025-0004", idPermohonan: "", bayaranKepada: "asnaf", asnaf: "Lim Chee Hong",       recipient: "", organization: "", amaun: 600, modeOfPayment: "EFT",  bankName: "Public Bank",     bankAccount: "321166772244", accountNumber: "321166772244", checkbox: "" },
    { kod: "PT-2025-0005", idPermohonan: "", bayaranKepada: "asnaf", asnaf: "Suresh a/l Kumar",    recipient: "", organization: "", amaun: 600, modeOfPayment: "EFT",  bankName: "CIMB",            bankAccount: "760099885511", accountNumber: "760099885511", checkbox: "" },
    { kod: "PT-2025-0006", idPermohonan: "", bayaranKepada: "asnaf", asnaf: "Chong Mei Ling",      recipient: "", organization: "", amaun: 600, modeOfPayment: "Tunai", bankName: "-",                bankAccount: "",             accountNumber: "",             checkbox: "" },
    { kod: "PT-2025-0007", idPermohonan: "", bayaranKepada: "asnaf", asnaf: "Roslan bin Omar",     recipient: "", organization: "", amaun: 600, modeOfPayment: "EFT",  bankName: "Bank Rakyat",     bankAccount: "220088997766", accountNumber: "220088997766", checkbox: "" },
    { kod: "PT-2025-0008", idPermohonan: "", bayaranKepada: "asnaf", asnaf: "Nurul Huda bt Rahman",recipient: "", organization: "", amaun: 600, modeOfPayment: "EFT",  bankName: "Maybank",         bankAccount: "170022334455", accountNumber: "170022334455", checkbox: "" },
    { kod: "PT-2025-0009", idPermohonan: "", bayaranKepada: "asnaf", asnaf: "Harun bin Mat",       recipient: "", organization: "", amaun: 600, modeOfPayment: "EFT",  bankName: "Bank Islam",      bankAccount: "110077889900", accountNumber: "110077889900", checkbox: "" },
    { kod: "PT-2025-0010", idPermohonan: "", bayaranKepada: "asnaf", asnaf: "Faridah binti Yusof", recipient: "", organization: "", amaun: 600, modeOfPayment: "Tunai", bankName: "-",                bankAccount: "",             accountNumber: "",             checkbox: "" },
    { kod: "PT-2025-0011", idPermohonan: "", bayaranKepada: "asnaf", asnaf: "Zainal bin Osman",    recipient: "", organization: "", amaun: 600, modeOfPayment: "EFT",  bankName: "CIMB",            bankAccount: "760033221199", accountNumber: "760033221199", checkbox: "" },
    { kod: "PT-2025-0012", idPermohonan: "", bayaranKepada: "asnaf", asnaf: "Fadilah binti Kassim",recipient: "", organization: "", amaun: 600, modeOfPayment: "EFT",  bankName: "RHB",             bankAccount: "210055667788", accountNumber: "210055667788", checkbox: "" },
    { kod: "PT-2025-0013", idPermohonan: "", bayaranKepada: "asnaf", asnaf: "Goh Ah Seng",         recipient: "", organization: "", amaun: 600, modeOfPayment: "EFT",  bankName: "Public Bank",     bankAccount: "321199885577", accountNumber: "321199885577", checkbox: "" },
    { kod: "PT-2025-0014", idPermohonan: "", bayaranKepada: "asnaf", asnaf: "Meena a/p Rajan",     recipient: "", organization: "", amaun: 600, modeOfPayment: "Tunai", bankName: "-",                bankAccount: "",             accountNumber: "",             checkbox: "" },
    { kod: "PT-2025-0015", idPermohonan: "", bayaranKepada: "asnaf", asnaf: "Mohd Firdaus bin Ali",recipient: "", organization: "", amaun: 600, modeOfPayment: "EFT",  bankName: "Maybank",         bankAccount: "162344556677", accountNumber: "162344556677", checkbox: "" },
    { kod: "PT-2025-0016", idPermohonan: "", bayaranKepada: "asnaf", asnaf: "Hanim binti Zulkifli",recipient: "", organization: "", amaun: 600, modeOfPayment: "EFT",  bankName: "Bank Islam",      bankAccount: "100213134455", accountNumber: "100213134455", checkbox: "" },
    { kod: "PT-2025-0017", idPermohonan: "", bayaranKepada: "asnaf", asnaf: "Ravi a/l Chandran",   recipient: "", organization: "", amaun: 600, modeOfPayment: "Tunai", bankName: "-",                bankAccount: "",             accountNumber: "",             checkbox: "" },
    { kod: "PT-2025-0018", idPermohonan: "", bayaranKepada: "asnaf", asnaf: "Tan Siew Lan",        recipient: "", organization: "", amaun: 600, modeOfPayment: "EFT",  bankName: "Hong Leong Bank", bankAccount: "123499885566", accountNumber: "123499885566", checkbox: "" },
    { kod: "PT-2025-0019", idPermohonan: "", bayaranKepada: "asnaf", asnaf: "Safwan bin Hamid",    recipient: "", organization: "", amaun: 600, modeOfPayment: "EFT",  bankName: "Bank Rakyat",     bankAccount: "220011223344", accountNumber: "220011223344", checkbox: "" },
    { kod: "PT-2025-0020", idPermohonan: "", bayaranKepada: "asnaf", asnaf: "Salmah binti Jamil",  recipient: "", organization: "", amaun: 600, modeOfPayment: "Tunai", bankName: "-",                bankAccount: "",             accountNumber: "",             checkbox: "" }
  ],
  "BP-2025-00004": [
  {
    kod: "PT-2025-0021",
    idPermohonan: "",
    bayaranKepada: "recipient",
    asnaf: "",
    recipient: "Ahmad Firdaus bin Muhammad",
    organization: "",
    amaun: 1950.0,
    modeOfPayment: "EFT",
    bankName: "Maybank",
    bankAccount: "162345678901",
    checkbox: ""
  },
  {
    kod: "PT-2025-0022",
    idPermohonan: "",
    bayaranKepada: "recipient",
    asnaf: "",
    recipient: "Che Norhayati binti Che Marzuki",
    organization: "",
    amaun: 1950.0,
    modeOfPayment: "EFT",
    bankName: "Bank Islam",
    bankAccount: "100299883344",
    checkbox: ""
  },
  {
    kod: "PT-2025-0023",
    idPermohonan: "",
    bayaranKepada: "recipient",
    asnaf: "",
    recipient: "Firdaus bin Noah",
    organization: "",
    amaun: 1950.0,
    modeOfPayment: "EFT",
    bankName: "Bank Islam",
    bankAccount: "120299234344",
    checkbox: ""
  },
  {
    kod: "PT-2025-0024",
    idPermohonan: "",
    bayaranKepada: "recipient",
    asnaf: "",
    recipient: "Nur Jannah binti Abd Jamil",
    organization: "",
    amaun: 1950.0,
    modeOfPayment: "EFT",
    bankName: "Public Bank",
    bankAccount: "321166772244",
    checkbox: ""
  },
  {
    kod: "PT-2025-0025",
    idPermohonan: "",
    bayaranKepada: "recipient",
    asnaf: "",
    recipient: "Nor Alia binti Alias",
    organization: "",
    amaun: 1950.0,
    modeOfPayment: "EFT",
    bankName: "CIMB",
    bankAccount: "760099885511",
    checkbox: ""
  }
],
  "BP-2025-01617": [
    {
      kod: "PT-2025-36330",
      idPermohonan: "",
      bayaranKepada: "asnaf",
      asnaf: "WOO MENG LEONG",
      recipient: "",
      organization: "",
      amaun: 250.0,
      modeOfPayment: "Akaun",
      bankName: "-",
      bankAccount: "",
      checkbox: ""
    },
    {
      kod: "PT-2025-36331",
      idPermohonan: "",
      bayaranKepada: "asnaf",
      asnaf: "EUNIKE VALBORG BOLDVIK",
      recipient: "",
      organization: "",
      amaun: 250.0,
      modeOfPayment: "Akaun",
      bankName: "-",
      bankAccount: "",
      checkbox: ""
    },
    {
      kod: "PT-2025-36332",
      idPermohonan: "",
      bayaranKepada: "asnaf",
      asnaf: "JULIE ANN BACLAS EBIO",
      recipient: "",
      organization: "",
      amaun: 550.0,
      modeOfPayment: "Akaun",
      bankName: "-",
      bankAccount: "",
      checkbox: ""
    },
    {
      kod: "PT-2025-36333",
      idPermohonan: "",
      bayaranKepada: "asnaf",
      asnaf: "CHU KEAN HENG",
      recipient: "",
      organization: "",
      amaun: 650.0,
      modeOfPayment: "Akaun",
      bankName: "-",
      bankAccount: "",
      checkbox: ""
    }
  ],
  "BP-2025-01589": [
    {
      kod: "PT-2025-34488",
      idPermohonan: "",
      bayaranKepada: "recipient",
      asnaf: "",
      recipient: "AHMAD FIRDAUS BIN MUHAM...",
      organization: "",
      amaun: 1950.0,
      modeOfPayment: "Akaun",
      bankName: "-",
      bankAccount: "",
      checkbox: ""
    },
    {
      kod: "PT-2025-34489",
      idPermohonan: "",
      bayaranKepada: "recipient",
      asnaf: "",
      recipient: "CHE NORHAYATI BINTI CHE MA...",
      organization: "",
      amaun: 1950.0,
      modeOfPayment: "Akaun",
      bankName: "-",
      bankAccount: "",
      checkbox: ""
    },
    {
      kod: "PT-2025-34490",
      idPermohonan: "",
      bayaranKepada: "recipient",
      asnaf: "",
      recipient: "FIRDAUZ BIN NOH",
      organization: "",
      amaun: 1950.0,
      modeOfPayment: "Akaun",
      bankName: "-",
      bankAccount: "",
      checkbox: ""
    },
    {
      kod: "PT-2025-34491",
      idPermohonan: "",
      bayaranKepada: "recipient",
      asnaf: "",
      recipient: "I.JANNAH BINTI ALI",
      organization: "",
      amaun: 1950.0,
      modeOfPayment: "Akaun",
      bankName: "-",
      bankAccount: "",
      checkbox: ""
    }
  ]
};

const recipientsByBP = {
  "BP-2025-00003": [
    { id: "RCP-BP-2025-00003-001", namaPenuh: "Ahmad bin Salleh",            amaun: 600, agihanSemula: "", bulkProcessing: "BP-2025-00003", kategoriAsnaf: "Fakir", bayaranKepada: "Asnaf", state: "", country: "" },
    { id: "RCP-BP-2025-00003-002", namaPenuh: "Aisyah binti Abdullah",       amaun: 600, agihanSemula: "", bulkProcessing: "BP-2025-00003", kategoriAsnaf: "Fakir", bayaranKepada: "Asnaf", state: "", country: "" },
    { id: "RCP-BP-2025-00003-003", namaPenuh: "Mariam binti Ismail",         amaun: 600, agihanSemula: "", bulkProcessing: "BP-2025-00003", kategoriAsnaf: "Fakir", bayaranKepada: "Asnaf", state: "", country: "" },
    { id: "RCP-BP-2025-00003-004", namaPenuh: "Lim Chee Hong",               amaun: 600, agihanSemula: "", bulkProcessing: "BP-2025-00003", kategoriAsnaf: "Fakir", bayaranKepada: "Asnaf", state: "", country: "" },
    { id: "RCP-BP-2025-00003-005", namaPenuh: "Suresh a/l Kumar",            amaun: 600, agihanSemula: "", bulkProcessing: "BP-2025-00003", kategoriAsnaf: "Fakir", bayaranKepada: "Asnaf", state: "", country: "" },
    { id: "RCP-BP-2025-00003-006", namaPenuh: "Chong Mei Ling",              amaun: 600, agihanSemula: "", bulkProcessing: "BP-2025-00003", kategoriAsnaf: "Fakir", bayaranKepada: "Asnaf", state: "", country: "" },
    { id: "RCP-BP-2025-00003-007", namaPenuh: "Roslan bin Omar",             amaun: 600, agihanSemula: "", bulkProcessing: "BP-2025-00003", kategoriAsnaf: "Fakir", bayaranKepada: "Asnaf", state: "", country: "" },
    { id: "RCP-BP-2025-00003-008", namaPenuh: "Nurul Huda bt Rahman",        amaun: 600, agihanSemula: "", bulkProcessing: "BP-2025-00003", kategoriAsnaf: "Fakir", bayaranKepada: "Asnaf", state: "", country: "" },
    { id: "RCP-BP-2025-00003-009", namaPenuh: "Harun bin Mat",               amaun: 600, agihanSemula: "", bulkProcessing: "BP-2025-00003", kategoriAsnaf: "Fakir", bayaranKepada: "Asnaf", state: "", country: "" },
    { id: "RCP-BP-2025-00003-010", namaPenuh: "Faridah binti Yusof",         amaun: 600, agihanSemula: "", bulkProcessing: "BP-2025-00003", kategoriAsnaf: "Fakir", bayaranKepada: "Asnaf", state: "", country: "" },
    { id: "RCP-BP-2025-00003-011", namaPenuh: "Zainal bin Osman",            amaun: 600, agihanSemula: "", bulkProcessing: "BP-2025-00003", kategoriAsnaf: "Fakir", bayaranKepada: "Asnaf", state: "", country: "" },
    { id: "RCP-BP-2025-00003-012", namaPenuh: "Fadilah binti Kassim",        amaun: 600, agihanSemula: "", bulkProcessing: "BP-2025-00003", kategoriAsnaf: "Fakir", bayaranKepada: "Asnaf", state: "", country: "" },
    { id: "RCP-BP-2025-00003-013", namaPenuh: "Goh Ah Seng",                 amaun: 600, agihanSemula: "", bulkProcessing: "BP-2025-00003", kategoriAsnaf: "Fakir", bayaranKepada: "Asnaf", state: "", country: "" },
    { id: "RCP-BP-2025-00003-014", namaPenuh: "Meena a/p Rajan",             amaun: 600, agihanSemula: "", bulkProcessing: "BP-2025-00003", kategoriAsnaf: "Fakir", bayaranKepada: "Asnaf", state: "", country: "" },
    { id: "RCP-BP-2025-00003-015", namaPenuh: "Mohd Firdaus bin Ali",        amaun: 600, agihanSemula: "", bulkProcessing: "BP-2025-00003", kategoriAsnaf: "Fakir", bayaranKepada: "Asnaf", state: "", country: "" },
    { id: "RCP-BP-2025-00003-016", namaPenuh: "Hanim binti Zulkifli",        amaun: 600, agihanSemula: "", bulkProcessing: "BP-2025-00003", kategoriAsnaf: "Fakir", bayaranKepada: "Asnaf", state: "", country: "" },
    { id: "RCP-BP-2025-00003-017", namaPenuh: "Ravi a/l Chandran",           amaun: 600, agihanSemula: "", bulkProcessing: "BP-2025-00003", kategoriAsnaf: "Fakir", bayaranKepada: "Asnaf", state: "", country: "" },
    { id: "RCP-BP-2025-00003-018", namaPenuh: "Tan Siew Lan",                amaun: 600, agihanSemula: "", bulkProcessing: "BP-2025-00003", kategoriAsnaf: "Fakir", bayaranKepada: "Asnaf", state: "", country: "" },
    { id: "RCP-BP-2025-00003-019", namaPenuh: "Safwan bin Hamid",            amaun: 600, agihanSemula: "", bulkProcessing: "BP-2025-00003", kategoriAsnaf: "Fakir", bayaranKepada: "Asnaf", state: "", country: "" },
    { id: "RCP-BP-2025-00003-020", namaPenuh: "Salmah binti Jamil",          amaun: 600, agihanSemula: "", bulkProcessing: "BP-2025-00003", kategoriAsnaf: "Fakir", bayaranKepada: "Asnaf", state: "", country: "" }
  ],
  "BP-2025-00004":[
  {
    id: "RCP-BP-2025-00004-001",
    namaPenuh: "Ahmad Firdaus bin Muhammad",
    amaun: 1950.0,
    agihanSemula: "",
    bulkProcessing: "BP-2025-00004",
    kategoriAsnaf: "Muallaf",
    bayaranKepada: "Recipient",
    state: "Selangor",
    country: "Malaysia"
  },
  {
    id: "RCP-BP-2025-00004-002",
    namaPenuh: "Che Norhayati binti Che Marzuki",
    amaun: 1950.0,
    agihanSemula: "",
    bulkProcessing: "BP-2025-00004",
    kategoriAsnaf: "Muallaf",
    bayaranKepada: "Recipient",
    state: "Selangor",
    country: "Malaysia"
  },
  {
    id: "RCP-BP-2025-00004-003",
    namaPenuh: "Firdaus bin Noah",
    amaun: 1950.0,
    agihanSemula: "",
    bulkProcessing: "BP-2025-00004",
    kategoriAsnaf: "Muallaf",
    bayaranKepada: "Recipient",
    state: "Selangor",
    country: "Malaysia"
  },
  {
    id: "RCP-BP-2025-00004-004",
    namaPenuh: "Nur Jannah binti Abd Jamil",
    amaun: 1950.0,
    agihanSemula: "",
    bulkProcessing: "BP-2025-00004",
    kategoriAsnaf: "Muallaf",
    bayaranKepada: "Recipient",
    state: "Selangor",
    country: "Malaysia"
  },
  {
    id: "RCP-BP-2025-00004-005",
    namaPenuh: "Nor Alia binti Alias",
    amaun: 1950.0,
    agihanSemula: "",
    bulkProcessing: "BP-2025-00004",
    kategoriAsnaf: "Muallaf",
    bayaranKepada: "Recipient",
    state: "Selangor",
    country: "Malaysia"
  }
],
  "BP-2025-01617": [
    {
      id: "RCP-BP-2025-01617-001",
      namaPenuh: "AARON ALEXANDRE R.JOHN",
      amaun: 360.0,
      agihanSemula: "",
      bulkProcessing: "BP-2025-01617",
      kategoriAsnaf: "Muallaf",
      bayaranKepada: "Asnaf",
      state: "Selangor",
      country: "Malaysia"
    },
    {
      id: "RCP-BP-2025-01617-002",
      namaPenuh: "AISYAH LINY BINTI TEGEK",
      amaun: 650.0,
      agihanSemula: "",
      bulkProcessing: "BP-2025-01617",
      kategoriAsnaf: "Muallaf",
      bayaranKepada: "Asnaf",
      state: "Selangor",
      country: "Malaysia"
    },
    {
      id: "RCP-BP-2025-01617-003",
      namaPenuh: "AJANANI A/P ARUMUGAM",
      amaun: 650.0,
      agihanSemula: "",
      bulkProcessing: "BP-2025-01617",
      kategoriAsnaf: "Muallaf",
      bayaranKepada: "Asnaf",
      state: "Selangor",
      country: "Malaysia"
    },
    {
      id: "RCP-BP-2025-01617-004",
      namaPenuh: "ALYSSA LEONG JIYAN",
      amaun: 300.0,
      agihanSemula: "",
      bulkProcessing: "BP-2025-01617",
      kategoriAsnaf: "Muallaf",
      bayaranKepada: "Asnaf",
      state: "Selangor",
      country: "Malaysia"
    }
  ],
  "BP-2025-01589": [
    {
      id: "RCP-BP-2025-01589-001",
      namaPenuh: "ABDUL RAHIM BIN MOHD ALI",
      amaun: 1950.0,
      agihanSemula: "",
      bulkProcessing: "BP-2025-01589",
      kategoriAsnaf: "Muallaf",
      bayaranKepada: "Recipient",
      state: "Selangor",
      country: "Malaysia"
    },
    {
      id: "RCP-BP-2025-01589-002",
      namaPenuh: "ABDUL RAHIM BIN MOHD ALI",
      amaun: 1950.0,
      agihanSemula: "",
      bulkProcessing: "BP-2025-01589",
      kategoriAsnaf: "Muallaf",
      bayaranKepada: "Recipient",
      state: "Selangor",
      country: "Malaysia"
    },
    {
      id: "RCP-BP-2025-01589-003",
      namaPenuh: "AHMAD FIRDAUS BIN MUHAMMAD",
      amaun: 1950.0,
      agihanSemula: "",
      bulkProcessing: "BP-2025-01589",
      kategoriAsnaf: "Muallaf",
      bayaranKepada: "Recipient",
      state: "Selangor",
      country: "Malaysia"
    },
    {
      id: "RCP-BP-2025-01589-004",
      namaPenuh: "CHE NORHAYATI BINTI CHE MAHMOOD",
      amaun: 1950.0,
      agihanSemula: "",
      bulkProcessing: "BP-2025-01589",
      kategoriAsnaf: "Muallaf",
      bayaranKepada: "Recipient",
      state: "Selangor",
      country: "Malaysia"
    }
  ]
};

const paymentList = ref([...(paymentDataByBp[id] || [])]);
const recipientList = ref([...(recipientsByBP[id] || [])]);

// Normalize account number so template shows correct value
const cleanPaymentList = computed(() =>
  paymentList.value.map(p => ({
    ...p,
    accountNumber: p.accountNumber ?? p.bankAccount ?? ''
  }))
)

const documentList = ref([
  {
    name: "Surat Permohonan Bantuan.csv",
    size: "2.5 MB",
    uploadDate: "15/01/2025"
  },
  {
    name: "Senarai Penerima.xlsx",
    size: "1.2 MB",
    uploadDate: "15/01/2025"
  }
]);

 const documentDataByBp = {
  'BP-2025-00003': [
    
    { id: 'DOC-002', name: 'Senarai Penerima (Lampiran A).docx', size: '1.2 MB', uploadDate: '01/09/2025' },
  ],
  'BP-2025-00004': [
    { id: 'DOC-001', name: 'Surat Akuan Pemohon.pdf', size: '245 KB', uploadDate: '01/09/2025' },
    { id: 'DOC-002', name: 'Senarai Penerima (Lampiran A).docx', size: '1.2 MB', uploadDate: '01/09/2025' },
    { id: 'DOC-003', name: 'Laporan Banjir Hulu Langat.pdf', size: '890 KB', uploadDate: '02/09/2025' },
    { id: 'DOC-004', name: 'Senarai Mangsa Banjir.xlsx', size: '156 KB', uploadDate: '02/09/2025' }
  ],
  'BP-2025-00001': [
    { id: 'DOC-001', name: 'Surat Permohonan Bantuan.pdf', size: '2.5 MB', uploadDate: '15/01/2025' },
    { id: 'DOC-002', name: 'Senarai Penerima.xlsx', size: '1.2 MB', uploadDate: '15/01/2025' },
    { id: 'DOC-003', name: 'Laporan Keperluan Pelajar.pdf', size: '3.1 MB', uploadDate: '16/01/2025' }
  ],
  'BP-2025-00002': [
    { id: 'DOC-001', name: 'Surat Permohonan Bantuan.pdf', size: '2.5 MB', uploadDate: '15/01/2025' },
    { id: 'DOC-002', name: 'Senarai Penerima.xlsx', size: '1.2 MB', uploadDate: '15/01/2025' }
  ],
  'BP-2025-00005': [
    { id: 'DOC-001', name: 'Surat Permohonan Bantuan.pdf', size: '2.5 MB', uploadDate: '15/01/2025' },
    { id: 'DOC-002', name: 'Senarai Penerima.xlsx', size: '1.2 MB', uploadDate: '15/01/2025' },
    { id: 'DOC-003', name: 'Laporan Pendidikan.pdf', size: '4.2 MB', uploadDate: '16/01/2025' },
    { id: 'DOC-004', name: 'Dokumen Sokongan Kesihatan.pdf', size: '1.8 MB', uploadDate: '17/01/2025' }
  ],
  'BP-2025-00006': [
    { id: 'DOC-001', name: 'Surat Permohonan Bantuan.pdf', size: '2.5 MB', uploadDate: '15/01/2025' },
    { id: 'DOC-002', name: 'Senarai Penerima.xlsx', size: '1.2 MB', uploadDate: '15/01/2025' },
    { id: 'DOC-003', name: 'Laporan Kesihatan.pdf', size: '3.7 MB', uploadDate: '16/01/2025' }
  ],
  'BP-2025-00007': [
    { id: 'DOC-001', name: 'Surat Permohonan Bantuan.pdf', size: '2.5 MB', uploadDate: '15/01/2025' },
    { id: 'DOC-002', name: 'Senarai Penerima.xlsx', size: '1.2 MB', uploadDate: '15/01/2025' },
    { id: 'DOC-003', name: 'Laporan Rumah.pdf', size: '5.1 MB', uploadDate: '16/01/2025' },
    { id: 'DOC-004', name: 'Gambar Rumah (Before).jpg', size: '2.3 MB', uploadDate: '16/01/2025' },
    { id: 'DOC-005', name: 'Gambar Rumah (After).jpg', size: '2.1 MB', uploadDate: '16/01/2025' }
  ],
  'BP-2025-00008': [
    { id: 'DOC-001', name: 'Surat Permohonan Bantuan.pdf', size: '2.5 MB', uploadDate: '15/01/2025' },
    { id: 'DOC-002', name: 'Senarai Penerima.xlsx', size: '1.2 MB', uploadDate: '15/01/2025' },
    { id: 'DOC-003', name: 'Laporan Makanan.pdf', size: '1.9 MB', uploadDate: '16/01/2025' }
  ]
};

// “Show import cards” gate used in v-if (safe)
const showImportCards = computed(() =>
  (paymentList.value?.length ?? 0) > 0 ||
  (recipientList.value?.length ?? 0) > 0 ||
  (damagedDataList.value?.length ?? 0) > 0
);

/* ---------- Watchers (after refs exist to avoid TDZ) ---------- */
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
    // Update total amount
    formData.value.jumlahAmaun = formatNumber(totalAmount.value);
  },
  { deep: true }
);

/* ---------- Options ---------- */
const kategoriAsnafOptions = [
  { label: "Fakir", value: "Fakir" },
  { label: "Miskin", value: "Miskin" },
  { label: "Amil", value: "Amil" },
  { label: "Muallaf", value: "Muallaf" },
  { label: "Riqab", value: "Riqab" },
  { label: "Gharimin", value: "Gharimin" },
  { label: "Fi Sabilillah", value: "Fi Sabilillah" },
  { label: "Ibnus Sabil", value: "Ibnus Sabil" },
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

/* ---------- Table meta (kept) ---------- */
const paymentColumns = [
  { key: "kod", label: "Kod" },
  { key: "idPermohonan", label: "ID Permohonan" },
  { key: "bayaranKepada", label: "Bayaran Kepada" },
  { key: "asnaf", label: "Kategori Asnaf" },
  { key: "contributor", label: "Contributor" },
  { key: "recipient", label: "Recipient" },
  { key: "organization", label: "Organization" },
  { key: "amaun", label: "Amaun" },
  { key: "modeOfPayment", label: "MOP" },
  { key: "bankName", label: "Bank" },
  { key: "bankAccount", label: "No. Akaun" },
];

/* ---------- Totals ---------- */
const totalAmount = computed(() => {
  return recipientList.value.reduce(
    (sum, recipient) => sum + (parseFloat(recipient.amaun) || 0),
    0
  );
});

const paymentTotal = computed(() => {
  return paymentList.value.reduce(
    (sum, p) => sum + (parseFloat(p.amaun) || 0),
    0
  );
});

/* ---------- Helpers & actions ---------- */
const formatNumber = (number) => {
  return new Intl.NumberFormat("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

const formatCurrency = (n) => {
  const num = parseFloat(n);
  if (isNaN(num) || num === null || num === undefined) return 'RM0.00';
  return new Intl.NumberFormat("ms-MY", {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 2,
  }).format(num);
};

const navigateBack = () => {
  navigateTo("/BF-BTN/bantuan-bulk/senarai-bulk-processing");
};

const editBantuan = () => {
  navigateTo(`/BF-BTN/bantuan-bulk/senarai-bulk-processing/${id}/edit`);
};

const submitBantuan = () => {
  alert('success', 'Hantar (mock)');
}

const printDetails = () => {
  window.print();
};

const generateUniqueId = (prefix) => {
  return `${prefix}-${Date.now().toString().slice(-6)}-${Math.random()
    .toString(36)
    .slice(-4)}`;
};

/* ---------- Payment methods ---------- */
const showPaymentModal = ref(false);
const paymentModalMode = ref("add");
const paymentForm = ref({});

const handleAddPayment = () => {
  console.log("handleAddPayment called");

  paymentForm.value = {
    kod: generateUniqueId("PMT"),
    bayaranKepada: "",
    asnaf: formData.value.kategoriAsnaf || "",
    contributor: "",
    recipient: "",
    organization: "",
    amaun: 0,
    modeOfPayment: "Akaun",
    tarikhBayaran: ''
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
  if (paymentModalMode.value === "add") {
    paymentList.value.push({ ...paymentForm.value });
    alert("success", "Maklumat bayaran baru ditambah");
  } else {
    const index = paymentList.value.findIndex(
      (p) => p.kod === paymentForm.value.kod
    );
    if (index !== -1) {
      paymentList.value[index] = { ...paymentForm.value };
      alert("success", "Maklumat bayaran berjaya dikemaskini");
    }
  }

  showPaymentModal.value = false;
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

/* ---------- Recipient methods ---------- */
const showRecipientModal = ref(false);
const recipientModalMode = ref("add");
const recipientForm = ref({});

const handleAddRecipient = () => {
  console.log("handleAddRecipient called");

  recipientForm.value = {
    id: generateUniqueId("RCP"),
    namaPenuh: "",
    amaun: 0,
    agihanSemula: "Tidak",
    bulkProcessing: formData.value.kodBP || "",
    kategoriAsnaf: formData.value.kategoriAsnaf || "",
    bayaranKepada: "Individu",
    negeri: "",
    negara: "",
  };

  recipientModalMode.value = "add";
  showRecipientModal.value = true;
};

const handleEditRecipientModal = (recipient) => {
  recipientForm.value = { ...recipient };
  recipientModalMode.value = "edit";
  showRecipientModal.value = true;
};

const handleSaveRecipientModal = () => {
  if (recipientModalMode.value === "add") {
    recipientList.value.push({ ...recipientForm.value });
    alert("success", "Maklumat penerima baru ditambah");
  } else {
    const index = recipientList.value.findIndex(
      (r) => r.id === recipientForm.value.id
    );
    if (index !== -1) {
      recipientList.value[index] = { ...recipientForm.value };
      alert("success", "Maklumat penerima berjaya dikemaskini");
    }
  }

  formData.value.jumlahAmaun = formatNumber(totalAmount.value);
  showRecipientModal.value = false;
};

const handleDeleteRecipient = async (recipient) => {
  try {
    if (confirm("Adakah anda pasti untuk memadam maklumat penerima ini?")) {
      const index = recipientList.value.findIndex(
        (r) => r.id === recipient.id || r.namaPenuh === recipient.namaPenuh
      );
      if (index !== -1) {
        recipientList.value.splice(index, 1);
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
};

/* ---------- Misc helpers ---------- */
const alert = (type, message) => {
  console.log(`${type.toUpperCase()}: ${message}`);
};

const getStatusVariant = (status) => {
  switch (status) {
    case 'Draf':
      return 'disabled';
    case 'Sedang Diproses':
    case 'Dalam Proses':
      return 'warning';
    case 'Ditolak':
      return 'danger';
    case 'Rework':
      return 'danger';
    case 'Baru':
      return 'primary';
    case 'Lulus':
      return 'success';
    case 'Selesai':
      return 'success';
    default:
      return 'secondary';
  }
};

const getProductStatusVariant = (status) => {
  const variants = { lengkap: 'success', sedang_edit: 'primary', baru: 'info' };
  return variants[status] || 'default';
};

const getProductStatusText = (status) => {
  const map = { lengkap: 'Lengkap', sedang_edit: 'Sedang Edit', baru: 'Baru' };
  return map[status] || status;
};

/* ---------- File/Import handlers ---------- */
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const fileName = file.name.toLowerCase();
    const isValidExtension = fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv');
    const isValidMimeType = file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel" ||
      file.type === "text/csv" ||
      file.type === "application/csv" ||
      file.type === "text/plain" ||
      file.type === "";

    if (isValidExtension || isValidMimeType) {
      selectedFile.value = file;
      console.log('File selected:', file.name, 'Type:', file.type);
    } else {
      alert("error", "Sila pilih fail Excel yang sah (.xlsx, .xls, atau .csv)");
      event.target.value = "";
    }
  }
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

function removeUpload(code) {
  delete uploadsByEntitlement[code]
  selectedFile.value = null
  currentImportCode.value = null
  isReplacing.value = false
  alert('success', 'Fail telah dibuang.')
}

function replaceUpload(code) {
  delete uploadsByEntitlement[code]
  isReplacing.value = true
  selectedFile.value = null
  currentImportCode.value = null
}

function downloadPayableToTemplate(code) {
  console.log('Download template for entitlement:', code)
  alert('success', 'Memuat turun template (dummy).')
}
function handleSahkanSelected() {
  alert('success', `Disahkan: ${selectedPayments.value.length} rekod`)
  selectedPayments.value = []
}

/* ---------- Mount log ---------- */
onMounted(async () => {
  try {
    console.log(`Loading bantuan details for ID: ${id}`);
  } catch (error) {
    console.error('Error loading bantuan details:', error);
  }
});

/* ---------- (Kept) Damaged Data placeholders to satisfy old refs ---------- */
const damagedDataColumns = [
  { key: "namaPenerima", label: "Nama Penerima" },
  { key: "catatan", label: "Catatan" },
  {
     key: "actions",
    label: "Tindakan",
    sortable: false,
    align: "center",
  },
];

const handleEditDamagedData = (data) => {
  console.log("Editing damaged data for:", data?.namaPenerima);
};

const handleAddDamagedData = () => {
  const newDamagedData = {
    no: damagedDataList.value.length + 1,
    namaPenerima: "Contoh Penerima",
    catatan: "Contoh catatan untuk data rosak",
  };
  damagedDataList.value.push(newDamagedData);
  alert("success", "Maklumat data rosak berjaya ditambah");
};

const handleDeleteDamagedData = (data) => {
  const index = damagedDataList.value.findIndex(d => d.no === data.no);
  if (index !== -1) {
    damagedDataList.value.splice(index, 1);
    alert("success", "Data rosak berjaya dipadam");
  }
};
</script>

<style lang="scss" scoped>
.form-actions {
  @apply sticky bottom-0 bg-white shadow-lg p-4 z-10;
}

@media print {
  .form-actions {
    @apply hidden;
  }
  
  .rs-card {
    @apply shadow-none border-gray-300;
  }
}
</style>

<template>
  <div class="min-h-screen">
    <div class="">
      <LayoutsBreadcrumb :items="breadcrumb" />

      <!-- Page Header -->
      <div class="mt-6 mb-8">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Sokongan BQ
            </h1>
            <p class="mt-1 text-sm text-gray-600">
              Semak dan nilai maklumat BQ
            </p>
          </div>
          <rs-badge
            v-if="formData.statusLawatan"
            :variant="getStatusVariant(formData.statusLawatan)"
            class="text-sm px-4 py-2"
          >
            {{ getStatusText(formData.statusLawatan) }}
          </rs-badge>
        </div>
      </div>

      <div>
        <rs-card class="mt-4">
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold">Maklumat Pemohon</h2>
              <rs-badge
                v-if="formData.status"
                :variant="getStatusVariant(formData.status)"
              >
                {{ formData.status }}
              </rs-badge>
            </div>
          </template>

          <template #body>
            <FormKit
              type="form"
              :actions="false"
              @submit="handleSubmit"
              v-model="formData"
            >
              <!-- Section 1: Maklumat Pemohon -->
              <rs-fieldset class="mb-6">
                <template #legend>
                  <h3 class="text-lg font-medium">Information</h3>
                </template>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Nama</label
                    >
                    <p class="text-gray-900">{{ formData.nama }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Alamat</label
                    >
                    <p class="text-gray-900">{{ formData.alamat }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Jenis Pengenalan</label
                    >
                    <p class="text-gray-900">{{ formData.jenisPengenalan }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >No Pengenalan</label
                    >
                    <p class="text-gray-900">{{ formData.mykad }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >No Telefon</label
                    >
                    <p class="text-gray-900">{{ formData.noTelefon }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >E-mel</label
                    >
                    <p class="text-gray-900">{{ formData.emel }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Status Keluarga</label
                    >
                    <p class="text-gray-900">{{ formData.statusKeluarga }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Status Individu</label
                    >
                    <p class="text-gray-900">{{ formData.statusIndividu }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Status Multidimensi</label
                    >
                    <p class="text-gray-900">{{ formData.statusMultidimensi }}</p>
                  </div>
                </div>
              </rs-fieldset>
            </FormKit>
          </template>
        </rs-card>

        <!-- Section 1: Maklumat Pemohon (Read-only) -->
        <!-- <rs-card class="shadow-sm border-0 bg-white">
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div
                  class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                >
                  <Icon name="ph:user-circle" class="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  Maklumat Pemohon
                </h2>
                <p class="text-sm text-gray-500">
                  Butiran peribadi dan status pemohon
                </p>
              </div>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Nama</label>
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">{{ formData.nama }}</span>
                </div>
              </div>

              <div class="space-y-1 md:col-span-2">
                <label class="text-sm font-medium text-gray-700">Alamat</label>
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">{{
                    formData.alamat
                  }}</span>
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700"
                  >Jenis Pengenalan</label
                >
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">{{
                    formData.jenisPengenalan
                  }}</span>
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">MyKad</label>
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm font-mono text-gray-900">{{
                    formData.myKad
                  }}</span>
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700"
                  >No Telefon</label
                >
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">{{
                    formData.noTelefon
                  }}</span>
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">E-mel</label>
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">{{ formData.emel }}</span>
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700"
                  >Status Keluarga</label
                >
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">{{
                    formData.statusKeluarga
                  }}</span>
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700"
                  >Status Individu</label
                >
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">{{
                    formData.statusIndividu
                  }}</span>
                </div>
              </div>

              <div class="space-y-1 md:col-span-3">
                <label class="text-sm font-medium text-gray-700"
                  >Status Multidimensi</label
                >
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">{{
                    formData.statusMultidimensi
                  }}</span>
                </div>
              </div>
            </div>
          </template>
        </rs-card> -->
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <!-- Section 2: Dokumen Sokongan (Read-only) -->
        <div class="col-span-1 space-y-6">

          <rs-card class="shadow-sm border-0 bg-white">
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div
                  class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                >
                  <Icon name="ph:user-circle" class="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  Maklumat Bantuan
                </h2>
                <p class="text-sm text-gray-500">
                  Butiran bantuan dan status 
                </p>
              </div>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1">
                <FormKit
                  type="select"
                  name="aid"
                  label="Aid"
                  v-model="formData.aid"
                  :options="aidOptions"
                  @input="handleAidChange"
                  validation="required"
                />
              </div>

              <div class="space-y-1">
                <FormKit
                  type="select"
                  name="aidproduct"
                  label="Aid Product"
                  v-model="formData.aidproduct"
                  :options="filteredAidProductOptions"
                  @input="handleAidProductChange"
                  validation="required"
                  :disabled="!formData.aid"
                />
              </div>

              <div class="space-y-1">
                <FormKit
                  type="select"
                  name="productpackage"
                  label="Product Package"
                  v-model="formData.productpackage"
                  :options="filteredProductPackageOptions"
                  validation="required"
                  :disabled="!formData.aidproduct"
                />
              </div>



              <!-- <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Entitlement Product</label>
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm font-mono text-gray-900">{{
                    formData.entitlementproduct
                  }}</span>
                </div>
              </div> -->

              <div class="space-y-1">
                <FormKit
                  type="select"
                  name="entitlementproduct"
                  label="Entitlement Product"
                  v-model="formData.entitlementproduct"
                  :options="filteredEntitlementProductOptions"
                  validation="required"
                  :disabled="!formData.aidproduct"
                />
              </div>

              <!-- Tarikh Permohonan (Read Only) -->
              <div class="space-y-1 mt-4">
                <label class="text-sm font-medium text-gray-700">Tarikh Permohonan</label>
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">28/8/2025</span>
                </div>
              </div>

              <!-- SLA (Read Only) -->
              <div class="space-y-1 mt-4">
                <label class="text-sm font-medium text-gray-700">SLA</label>
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">3 hari lagi</span>
                </div>
              </div>


              <!-- Toggle Button SEGERA -->
              <div class="mt-6 flex items-center">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="formData.segera" class="sr-only peer">
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                          peer-checked:bg-green-500 peer-checked:after:translate-x-full 
                          after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                          after:bg-white after:border-gray-300 after:border after:rounded-full 
                          after:h-5 after:w-5 after:transition-all"
                  ></div>
                  <span class="ml-3 text-sm font-medium text-gray-700">SEGERA</span>
                </label>
              </div>

              <!-- Toggle Button Kelulusan Khas -->
              <div class="mt-6 flex items-center">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="formData.kelulusankhas" class="sr-only peer">
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                          peer-checked:bg-green-500 peer-checked:after:translate-x-full 
                          after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                          after:bg-white after:border-gray-300 after:border after:rounded-full 
                          after:h-5 after:w-5 after:transition-all"
                  ></div>
                  <span class="ml-3 text-sm font-medium text-gray-700">Kelulusan Khas</span>
                </label>
              </div>

            </div>

            <!-- Nyatakan Sebab (only shown if segera checked) -->
            <div v-if="formData.segera" class="mt-4 space-y-1">
              <label class="text-sm font-medium text-gray-700">Nyatakan Sebab</label>
              <textarea
                v-model="formData.sebabSegera"
                rows="3"
                class="w-full p-3 bg-white border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Nyatakan sebab di sini..."
              ></textarea>
            </div>

            <!-- Situasi Kelulusan Khas -->
        <div v-if="formData.kelulusankhas" class="mt-4 space-y-1">
          <label class="text-sm font-medium text-gray-700">Situasi</label>
          <select
            v-model="formData.situasikelulusankhas"
            class="w-full p-3 bg-white border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option disabled value="">-- Sila pilih situasi --</option>
            <option>Umur, sama ada melebihi atau di bawah umur</option>
            <option>Tempoh masa terikatnya pemohon dengan sesuatu kelayakan bantuan</option>
            <option>Tidak memenuhi syarat minimum permohonan bantuan</option>
            <option>Pendapatan isi rumah yang melebihi jadual kelayakan pendapatan isi rumah yang ditetapkan</option>
            <option>Melebihi kadar Had Kifayah</option>
            <option>Lain-lain permohonan yang tidak memenuhi syarat dan kelayakan dalam GPSKAZ</option>
            <option>Permohonan berulang bagi bantuan yang bersifat sekali kelulusan dalam tempoh masa tertentu</option>
            <option>Jenis bantuan tidak tersenarai di dalam GPSKAZ/ Perkara yang melibatkan kepentingan akidah Islam dan nyawa</option>
          </select>
        </div>
          </template>
        </rs-card>

          <!-- Dokumen Sokongan (Read-only) -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:folder-open"
                      class="w-6 h-6 text-green-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Dokumen Sokongan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Dokumen yang dikemukakan oleh pemohon
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Dokumen
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="(dokumen, index) in dokumenSokongan"
                      :key="index"
                      class="hover:bg-gray-50"
                    >
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {{ dokumen.jenis }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <rs-badge
                          :variant="
                            dokumen.status === 'lengkap' ? 'success' : 'danger'
                          "
                          class="text-sm"
                        >
                          {{
                            dokumen.status === "lengkap"
                              ? "Lengkap"
                              : "Tidak Lengkap"
                          }}
                        </rs-badge>
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm font-medium"
                      >
                        <div class="flex items-center space-x-2">
                          <rs-button
                            variant="primary"
                            @click="previewDocument(dokumen)"
                          >
                            <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                            Preview
                          </rs-button>
                          <rs-button
                            variant="success"
                            @click="downloadDocument(dokumen)"
                          >
                            <Icon name="ph:download" class="w-4 h-4 mr-1" />
                            Muat Turun
                          </rs-button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="dokumenSokongan.length === 0">
                      <td
                        colspan="3"
                        class="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        Tiada dokumen dijumpai.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </rs-card>

          <!-- BQ, Laporan Gambar, Laporan Teknikal in Tabs -->
          <div class="bg-white">
            <!-- Custom Tab Navigation -->
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-8">
                <button
                  @click="activeTab = 'bq'"
                  :class="[
                    activeTab === 'bq'
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
                  ]"
                >
                  BQ
                </button>
                <button
                  @click="activeTab = 'gambar'"
                  :class="[
                    activeTab === 'gambar'
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
                  ]"
                >
                  Laporan Gambar
                </button>
                <button
                  @click="activeTab = 'teknikal'"
                  :class="[
                    activeTab === 'teknikal'
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
                  ]"
                >
                  Laporan Teknikal
                </button>
              </nav>
            </div>

            <!-- Tab Content -->
            <div class="mt-6">
              <!-- Tab: BQ -->
              <div v-if="activeTab === 'bq'">
              <rs-card class="shadow-sm border-0 bg-white">
                <template #header>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <div
                          class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                        >
                          <Icon
                            name="ph:file-text"
                            class="w-6 h-6 text-purple-600"
                          />
                        </div>
                      </div>
                      <div>
                        <h2 class="text-lg font-semibold text-gray-900">BQ</h2>
                        <p class="text-sm text-gray-500">
                          Bill of Quantity untuk kerja-kerja cadangan
                        </p>
                      </div>
                    </div>
                  </div>
                </template>

                <template #body>
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                         <tr>
                           <th
                             class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                           >
                             No BQ
                           </th>
                           <th
                             class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                           >
                             Nama BQ
                           </th>
                           <th
                             class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                           >
                             Jumlah Keseluruhan
                           </th>
                           <th
                             class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                           >
                             Status
                           </th>
                           <th
                             class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                           >
                             Action
                           </th>
                         </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                         <tr v-for="(bq, index) in bqList" :key="index">
                           <td
                             class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                           >
                             {{ bq.noBQ }}
                           </td>
                           <td
                             class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                           >
                             {{ bq.namaBQ }}
                           </td>
                           <td
                             class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                           >
                             {{ bq.jumlahBQ }}
                           </td>
                           <td class="px-6 py-4 whitespace-nowrap">
                             <rs-badge
                               :variant="getBQStatusVariant(bq.status)"
                               class="text-sm"
                             >
                               {{ bq.status }}
                             </rs-badge>
                           </td>
                           <td
                             class="px-6 py-4 whitespace-nowrap text-sm font-medium"
                           >
                             <rs-button variant="primary" @click="editBQ(bq)">
                               Edit
                             </rs-button>
                           </td>
                         </tr>
                         <tr v-if="bqList.length === 0">
                           <td
                             colspan="5"
                             class="px-6 py-4 text-center text-sm text-gray-500"
                           >
                             Tiada BQ dijumpai. Klik butang "Tambah Baru" untuk
                             menambah BQ.
                           </td>
                         </tr>
                      </tbody>
                    </table>
                  </div>
                 </template>
               </rs-card>
              </div>

              <!-- Tab: Laporan Gambar -->
              <div v-if="activeTab === 'gambar'">
              <rs-card class="shadow-sm border-0 bg-white">
                <template #header>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <div
                          class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"
                        >
                          <Icon
                            name="ph:image"
                            class="w-6 h-6 text-orange-600"
                          />
                        </div>
                      </div>
                      <div>
                        <h2 class="text-lg font-semibold text-gray-900">
                          Laporan Gambar
                        </h2>
                        <p class="text-sm text-gray-500">
                          Gambar lokasi dan dokumentasi kerja
                        </p>
                      </div>
                    </div>
                    <rs-button
                      variant="primary-outline"
                      @click="viewLaporanGambar"
                      size="sm"
                    >
                      <Icon name="ph:eye" class="w-4 h-4 mr-2" />
                      Lihat Laporan
                    </rs-button>
                  </div>
                </template>

                <template #body>
                  <div
                    v-if="gambarLokasi.length > 0"
                    class="grid grid-cols-2 md:grid-cols-4 gap-4"
                  >
                    <div
                      v-for="(gambar, index) in gambarLokasi"
                      :key="index"
                      class="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        :src="gambar.url"
                        :alt="gambar.catatan"
                        class="w-full h-full object-cover"
                      />
                      <div
                        class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity"
                      >
                        <div
                          class="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-sm"
                        >
                          {{ gambar.catatan }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center py-8 text-gray-500">
                    <Icon
                      name="ph:image"
                      class="w-12 h-12 mx-auto mb-2 text-gray-400"
                    />
                    <p>Tiada gambar telah dimuat naik untuk siasatan ini.</p>
                  </div>
                 </template>
               </rs-card>
              </div>

              <!-- Tab: Laporan Teknikal -->
              <div v-if="activeTab === 'teknikal'">
              <rs-card class="shadow-sm border-0 bg-white">
                <template #header>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <div
                          class="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center"
                        >
                          <Icon
                            name="ph:file-doc"
                            class="w-6 h-6 text-teal-600"
                          />
                        </div>
                      </div>
                      <div>
                        <h2 class="text-lg font-semibold text-gray-900">
                          Laporan Teknikal
                        </h2>
                        <p class="text-sm text-gray-500">
                          Analisis teknikal dan cadangan kerja
                        </p>
                      </div>
                    </div>
                    <rs-button
                      variant="primary-outline"
                      @click="viewLaporanTeknikal"
                      size="sm"
                    >
                      <Icon name="ph:eye" class="w-4 h-4 mr-2" />
                      Lihat Laporan
                    </rs-button>
                  </div>
                </template>

                <template #body>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-1">
                      <label class="text-sm font-medium text-gray-700"
                        >Latar Belakang</label
                      >
                      <div
                        class="mt-1 p-3 bg-gray-50 rounded-lg border min-h-[100px]"
                      >
                        <span class="text-sm text-gray-900">{{
                          laporanTeknikal.latarBelakang || "Belum diisi"
                        }}</span>
                      </div>
                    </div>

                    <div class="space-y-1">
                      <label class="text-sm font-medium text-gray-700"
                        >Keperluan</label
                      >
                      <div
                        class="mt-1 p-3 bg-gray-50 rounded-lg border min-h-[100px]"
                      >
                        <span class="text-sm text-gray-900">{{
                          laporanTeknikal.keperluan || "Belum diisi"
                        }}</span>
                      </div>
                    </div>

                    <div class="space-y-1">
                      <label class="text-sm font-medium text-gray-700"
                        >Cadangan</label
                      >
                      <div
                        class="mt-1 p-3 bg-gray-50 rounded-lg border min-h-[100px]"
                      >
                        <span class="text-sm text-gray-900">{{
                          laporanTeknikal.cadangan || "Belum diisi"
                        }}</span>
                      </div>
                    </div>

                    <div class="space-y-1">
                      <label class="text-sm font-medium text-gray-700"
                        >Nilai Kerja Dicadangkan</label
                      >
                      <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                        <span class="text-sm font-medium text-gray-900">
                          RM
                          {{
                            laporanTeknikal.nilaiKerja?.toLocaleString() || "0"
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                 </template>
               </rs-card>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: Catatan Lapangan -->
        <div class="col-span-1">

          <!-- Laluan Process  -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="iconamoon:check-circle-2-duotone"
                      class="w-6 h-6 text-yellow-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Laluan Proses
                  </h2>
                  <p class="text-sm text-gray-500">
                    Laluan Proses Permohonan
                  </p>
                </div>
              </div>
            </template>

            

            <template #body>
              
              <div class="space-y-4">
                <!-- Accordion: Laluan Proses Details -->
                <div class="space-y-3">
                  <!-- Permohonan Accordion Item -->
                  <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                      @click="accordionOpen.permohonan = !accordionOpen.permohonan"
                    >
                      <span class="font-medium text-gray-900">Permohonan</span>
                      <Icon
                        :name="accordionOpen.permohonan ? 'ic:round-expand-less' : 'ic:round-expand-more'"
                        class="w-6 h-6 text-gray-500"
                      />
                    </button>
                    <div v-show="accordionOpen.permohonan" class="px-4 pb-4 pt-1">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-600 mb-1">Permohonan Dibuat Oleh</label>
                          <p class="text-gray-900">{{ permohonanDetails.dibuatOleh }}</p>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-600 mb-1">Tarikh Permohonan</label>
                          <p class="text-gray-900">{{ formatDateTime(permohonanDetails.tarikhPermohonan) }}</p>
                        </div>
                        <div class="md:col-span-2">
                          <label class="block text-sm font-medium text-gray-600 mb-1">Sebab Memohon Bantuan</label>
                          <p class="text-gray-900">{{ permohonanDetails.sebabMemohon }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Siasatan Accordion Item -->
                  <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                      @click="accordionOpen.siasatan = !accordionOpen.siasatan"
                    >
                      <span class="font-medium text-gray-900">Siasatan</span>
                      <Icon
                        :name="accordionOpen.siasatan ? 'ic:round-expand-less' : 'ic:round-expand-more'"
                        class="w-6 h-6 text-gray-500"
                      />
                    </button>
                    <div v-show="accordionOpen.siasatan" class="px-4 pb-4 pt-1">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-600 mb-1">Disiasat Oleh</label>
                          <p class="text-gray-900">{{ siasatanDetails.disiasatOleh }}</p>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-600 mb-1">Kaedah Siasatan</label>
                          <p class="text-gray-900">{{ siasatanDetails.kaedahSiasatan }}</p>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-600 mb-1">Status Siasatan</label>
                          <rs-badge :variant="getProcessStatusVariant(siasatanDetails.statusSiasatan)">
                            {{ siasatanDetails.statusSiasatan }}
                          </rs-badge>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-600 mb-1">Tarikh Selesai Siasatan</label>
                          <p class="text-gray-900">{{ formatDateTime(siasatanDetails.tarikhSelesai) }}</p>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-600 mb-1">SLA</label>
                          <p class="text-gray-900">{{ siasatanDetails.sla }}</p>
                        </div>
                        <div class="md:col-span-2">
                          <label class="block text-sm font-medium text-gray-600 mb-1">Catatan Siasatan</label>
                          <p class="text-gray-900">{{ siasatanDetails.catatan }}</p>
                        </div>
                        
                        <!-- Gambar Lokasi/Bukti Visual Section -->
                        <div class="md:col-span-2">
                          <label class="block text-sm font-medium text-gray-600 mb-3">Gambar Lokasi/Bukti Visual</label>
                          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div v-for="(gambar, index) in siasatanDetails.gambarLokasi" :key="index" class="relative">
                              <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                <img 
                                  :src="gambar.url" 
                                  :alt="gambar.catatan"
                                  class="w-full h-full object-cover"
                                />
                              </div>
                              <div class="mt-2">
                                <p class="text-xs text-gray-600 text-center">{{ gambar.catatan }}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- <div class="text-xs text-gray-500">
                  <Icon name="ph:clock" class="w-4 h-4 inline mr-1" />
                  Masa/Tarikh: {{ catatanLapangan.masaTarikh }}
                </div> -->
              </div>
              
            </template>
            
          </rs-card>
          <!-- Catatan Lapangan (C/U/V) -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:notebook" class="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Keputusan Hartanah
                  </h2>
                  <p class="text-sm text-gray-500">
                    Keputusan pihak Hartanah terhadap BQ
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-4">
                <!-- Keputusan Siasatan -->
                <!-- <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Keputusan Siasatan</label
                  >
                  <FormKit
                    type="select"
                    v-model="catatanLapangan.keputusanSiasatan"
                    :options="keputusanSiasatanOptions"
                    placeholder="Pilih keputusan siasatan"
                    required
                  />
                </div> -->

                <!-- Status Sokongan -->
                <!-- <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Keputusan Siasatan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <rs-badge
                      :variant="catatanLapangan.keputusanSiasatan === 'sokong' ? 'success' : 'danger'"
                      class="text-sm"
                    >
                      {{ catatanLapangan.keputusanSiasatan === 'sokong' ? 'Sokong' : 'Tidak Sokong' }}
                    </rs-badge>
                  </div>
                </div> -->

                <!-- Catatan Sokongan -->
                <!-- <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Catatan Siasatan</label
                  >
                  <div
                    class="mt-1 p-3 bg-gray-50 rounded-lg border min-h-[80px]"
                  >
                    <span class="text-sm text-gray-900">{{
                      catatanLapangan.catatanSokongan || "Tiada catatan sokongan."
                    }}</span>
                  </div>
                </div> -->

                <!-- Item Bantuan -->
                <!-- <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Item Bantuan (jika berkaitan)</label
                  >
                  <div
                    class="mt-1 p-3 bg-gray-50 rounded-lg border min-h-[60px]"
                  >
                    <span class="text-sm text-gray-900">{{
                      catatanLapangan.itemBantuan || "Catatan ini akan diletakkan di dalam surat kelulusan bantuan"
                    }}</span>
                    <div class="mt-2 text-xs text-gray-500">
                      <strong>Cth:</strong> Cermin Mata
                    </div>
                  </div>
                </div> -->

                <!-- Tarikh Sokongan -->
                <!-- <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Tarikh Siasatan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <div class="text-sm text-gray-500">
                      <Icon name="ph:clock" class="w-4 h-4 inline mr-1" />
                      {{ catatanLapangan.tarikhSokongan }}
                    </div>
                  </div>
                </div> -->

                <!-- Keputusan Hartanah -->
                <!-- <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Keputusan Hartanah</label
                  >
                  <FormKit
                    type="select"
                    v-model="catatanLapangan.keputusanHartanah"
                    :options="keputusanHartanahOptions"
                    placeholder="Pilih keputusan hartanah"
                    required
                  />
                </div> -->

                <!-- Status Sokongan Hartanah -->
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Status Semakan BQ</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <rs-badge
                      :variant="catatanLapangan.keputusanHartanah === 'sokong' ? 'success' : 'warning'"
                      class="text-sm"
                    >
                      {{ catatanLapangan.keputusanHartanah === 'sokong' ? 'Sokong' : 'Rework' }}
                    </rs-badge>
                  </div>
                </div>

                <!-- Catatan Sokongan Hartanah -->
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Catatan</label
                  >
                  <FormKit
                    type="textarea"
                    v-model="catatanLapangan.catatanSokonganHartanah"
                    placeholder="Boleh mengisi catatan"
                    rows="4"
                  />
                </div>

                <!-- Tarikh Sokongan Hartanah -->
                <!-- <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Tarikh Sokongan Hartanah</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <div class="text-sm text-gray-500">
                      <Icon name="ph:clock" class="w-4 h-4 inline mr-1" />
                      {{ catatanLapangan.tarikhSokonganHartanah }}
                    </div>
                  </div>
                </div> -->
                <div class="text-xs text-gray-500">
                  <Icon name="ph:clock" class="w-4 h-4 inline mr-1" />
                  Masa/Tarikh: {{ catatanLapangan.tarikhSokonganHartanah  }}
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Status Lawatan -->
          <!-- <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:check-circle"
                      class="w-6 h-6 text-yellow-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Status Lawatan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Update status siasatan lapangan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700"
                  >Status Lawatan</label
                >
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <rs-badge
                    :variant="getStatusVariant(formData.statusLawatan)"
                    class="text-sm"
                  >
                    {{ getStatusText(formData.statusLawatan) }}
                  </rs-badge>
                </div>
              </div>
            </template>
          </rs-card> -->

          <!-- Jumlah Bantuan & Catatan Pengesyoran -->
          <!-- <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:currency-circle-dollar"
                      class="w-6 h-6 text-emerald-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Jumlah Bantuan & Pengesyoran
                  </h2>
                  <p class="text-sm text-gray-500">
                    Nilai bantuan berdasarkan BQ dan pengesyoran
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-4">
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Jumlah Bantuan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-lg font-semibold text-gray-900">
                      RM {{ jumlahBantuan.toLocaleString() }}
                    </span>
                    <span class="text-sm text-gray-500 ml-2"
                      >(Diambil dari BQ)</span
                    >
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Catatan Pengesyoran</label
                  >
                  <div
                    class="mt-1 p-3 bg-gray-50 rounded-lg border min-h-[80px]"
                  >
                    <span class="text-sm text-gray-900">{{
                      catatanPengesyoran || "Diambil dari BQ"
                    }}</span>
                  </div>
                </div> -->

                <!-- Post-approval buttons (only shown after approval) -->
                <!-- <div v-if="isApproved" class="space-y-2 pt-4 border-t">
                  <rs-button
                    variant="success-outline"
                    @click="viewArahanKerja"
                    class="w-full !py-2 text-sm"
                  >
                    <Icon name="ph:file-text" class="w-4 h-4 mr-2" />
                    Lihat Arahan Kerja
                  </rs-button>

                  <rs-button
                    variant="info-outline"
                    @click="urusPemantauan"
                    class="w-full !py-2 text-sm"
                  >
                    <Icon name="ph:monitor" class="w-4 h-4 mr-2" />
                    Urus Pemantauan
                  </rs-button>
                </div>
              </div>
            </template>
          </rs-card> -->

          <!-- Action Buttons -->
          <rs-card class="p-4">
            <div class="flex flex-row gap-3">
              <rs-button
                class="w-full"
                variant="secondary"
                @click="handleSimpan"
                :disabled="processing"
                :loading="processing && actionType === 'simpan'"
              >
                Simpan
              </rs-button>
              <rs-button
                class="w-full"
                variant="primary"
                @click="handleHantar"
                
                :loading="processing && actionType === 'hantar'"
              >
                Hantar
              </rs-button>
              <rs-button
                class="w-full"
                variant="danger"
                @click="handleKembali"
              >
                Kembali
              </rs-button>
            </div>
            <div v-if="!isFormComplete" class="mt-2 text-xs text-red-500">
              <Icon name="ph:warning" class="w-4 h-4 inline mr-1" />
              Sila pastikan semua medan diperlukan telah diisi sebelum menghantar.
            </div>
          </rs-card>
        </div>
      </div>
    </div>

    <!-- BQ Modal -->
    <rs-modal v-model="showBQModal" size="xl" :closable="false">
      <template #header>
        <h3 class="text-lg font-semibold">
          {{ editingBQ ? "Edit" : "Tambah" }} BQ
        </h3>
      </template>
      <template #body>
        <!-- BQ form content will be added here -->
        <div class="text-center py-8 text-gray-500">
          <p>
            BQ Form content akan dibangunkan mengikut keperluan dalam
            REQUIREMENTS.md
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button variant="primary-outline" @click="closeBQModal">
            Batal
          </rs-button>
          <rs-button variant="primary" @click="saveBQ"> Simpan </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const processing = ref(false);
const actionType = ref("");

definePageMeta({
  title: "Sokongan Siasatan Lapangan",
});

const breadcrumb = ref([
  {
    name: "Tugasan",
    type: "link",
    path: "/BF-BTN/tugasan",
  },
  {
    name: "Sokongan Siasatan",
    type: "current",
    path: `/BF-BTN/tugasan/bantuan/sokongan/${route.params.id}`,
  },
]);

// Tab state
const activeTab = ref('bq');

// BQ data
const bqList = ref([
  {
    noBQ: "BQ202508647",
    namaBQ: "BQ MOHD ROSLI BIN SAAD",
    jumlahBQ: "RM43,000",
    status: "DALAM PROSES"
  }
]);

const editBQ = (bq) => {
  // Navigate to dedicated BQ drafting/editing page with current id and edit flag
  router.push(
    `/BF-BTN/tugasan/bantuan/sokongan/${route.params.id}/draf-bq?edit=true`
  );
};

// Technical report data
const laporanTeknikal = ref({
  latarBelakang: "Rumah dalam keadaan uzur dan memerlukan baik pulih segera untuk keselamatan keluarga",
  keperluan: "Kerja-kerja baik pulih bumbung bocor dan cat dinding luar",
  cadangan: "Membaik pulih bumbung dan mengecat dinding luar rumah",
  nilaiKerja: 43000
});

// Image data

// Accordion state and mock details
const accordionOpen = reactive({
  permohonan: false,
  siasatan: false,
})

// Mock data for accordion
const permohonanDetails = ref({
  dibuatOleh: "Siti binti Ali",
  tarikhPermohonan: "2025-01-15T10:30:00Z",
  sebabMemohon: "Pemohon telah menceritakan masalah mengenai keadaan rumahnya yang semakin uzur akibat dimakan anai-anai dan keadaan bumbung yang bocor. Dipanjangkan kepada pegawai untuk siasat dan mempertimbangkan permohonan bantuan bina baru rumah"
});

const siasatanDetails = ref({
  disiasatOleh: "Ahmad bin Ali",
  kaedahSiasatan: "Lapangan",
  statusSiasatan: "Sokong",
  tarikhSelesai: "2025-01-20T14:45:00Z",
  sla: "5 hari",
  catatan: "Siasatan telah selesai dan laporan teknikal telah disediakan",
  gambarLokasi: [
    {
      url: "https://www.ukm.my/zakat/wp-content/uploads/2021/04/169461828_4043716242359225_2282346416989438479_n.jpg",
      catatan: ""
    },
    {
      url: "https://assets.nst.com.my/images/articles/lzsel_%282%29_1729555212.jpg",
      catatan: ""
    },
    
  ]
});

// Section 1: Maklumat Pemohon data
const formData = ref({
  nama: "Mohd Rosli bin Saad",
  alamat: "No. 123, Jalan Merdeka, Taman Sejahtera, 50000 Kuala Lumpur",
  jenisPengenalan: "myKad",
  myKad: "880701121234",
  noTelefon: "0123456789",
  emel: "rosli@gmail.com",
  statusKeluarga: "Fakir",
  statusIndividu: "Fakir",
  statusMultidimensi: "Asnaf Tidak Produktif",
  statusLawatan: "belum_selesai",
  aid: "B125 - Bantuan Baikpulih Rumah (Fakir)",
  aidproduct: "Bantuan Baikpulih Rumah Am (Fakir)",
  productpackage: "Baikpulih Rumah (Fakir)",
  entitlementproduct: "Baikpulih Rumah (Fakir)",
});

// Section 2: Dokumen Sokongan
const dokumenSokongan = ref([
  // {
  //   jenis: "Quotation (baik pulih)",
  //   filename: "quotation.pdf",image.png
  //   url: "#",
  //   status: "lengkap",
  // },
  {
    jenis: "Geran Tanah",
    filename: "geran_tanah.pdf",
    url: "#",
    status: "lengkap",
  },
  {
    jenis: "Carian Rasmi Pejabat Tanah",
    filename: "carian_rasmi.pdf",
    url: "#",
    status: "tidak_lengkap",
  },
]);

// Section 3: Draf BQ

const showBQModal = ref(false);
const editingBQ = ref(null);

// Section 4: Laporan Gambar
const gambarLokasi = ref([
  {
    url: "/img/placeholder-image.jpg",
    catatan: "Keadaan semasa rumah",
    masaUpload: new Date().toISOString(),
  },
  {
    url: "/img/placeholder-image.jpg",
    catatan: "Bahagian yang perlu dibaiki",
    masaUpload: new Date().toISOString(),
  },
]);

// Section 5: Laporan Teknikal

// Section 6: Catatan Lapangan
const catatanLapangan = ref({
  keputusanSiasatan: "Sokong",
  catatanSokongan: "",
  itemBantuan: "",
  tarikhSokongan: new Date().toLocaleString("ms-MY"),
  keputusanHartanah: "",
  catatanSokonganHartanah: "",
  tarikhSokonganHartanah: new Date().toLocaleString("ms-MY"),
});

// Section 8: Jumlah Bantuan & Catatan Pengesyoran
const jumlahBantuan = ref(25000);
const catatanPengesyoran = ref("");
const isApproved = ref(false); // This will be true after approval

// Dropdown options
const statusDokumenOptions = ref([
  { label: "Lengkap", value: "lengkap" },
  { label: "Tidak Lengkap", value: "tidak_lengkap" },
]);

const keputusanSiasatanOptions = ref([
  { label: "Sokong", value: "sokong" },
  { label: "Tidak Sokong", value: "tidak_sokong" },
]);

const keputusanHartanahOptions = ref([
  { label: "Sokong", value: "sokong" },
  { label: "Rework", value: "rework" },
]);

// Aid and Aid Product options
const aidOptions = ref([
  { label: "B102 - Bantuan Binaan Rumah (Fakir)", value: "B102 - Bantuan Binaan Rumah (Fakir)" },
  { label: "B125 - Bantuan Baikpulih Rumah (Fakir)", value: "B125 - Bantuan Baikpulih Rumah (Fakir)" },
]);

const aidProductOptions = ref([
  { label: "(HQ) Bantuan Binaan Rumah (Fakir)", value: "(HQ) Bantuan Binaan Rumah (Fakir)" },
  { label: "(HQ) Bantuan Pembelian Rumah Kos Rendah/Sederhana (Fakir)", value: "(HQ) Bantuan Pembelian Rumah Kos Rendah/Sederhana (Fakir)" },
  { label: "Bantuan Baikpulih Rumah Am (Fakir)", value: "Bantuan Baikpulih Rumah Am (Fakir)" },
  { label: "Pemasangan Bekalan Elektrik dan Air Am (Fakir)", value: "Pemasangan Bekalan Elektrik dan Air Am (Fakir)" },
]);

// Product Package options based on Aid Product
const productPackageOptions = ref([
  // For Binaan Rumah
  { label: "(Perolehan) Bina Rumah (Fakir)", value: "(Perolehan) Bina Rumah (Fakir)", aidProduct: "(HQ) Bantuan Binaan Rumah (Fakir)" },
  { label: "(WO) 3 Bilik (Fakir) - Tanggungan 3-6 Orang", value: "(WO) 3 Bilik (Fakir) - Tanggungan 3-6 Orang", aidProduct: "(HQ) Bantuan Binaan Rumah (Fakir)" },
  { label: "Pemantauan dan Pengawasan Tapak Projek (Fakir)", value: "Pemantauan dan Pengawasan Tapak Projek (Fakir)", aidProduct: "(HQ) Bantuan Binaan Rumah (Fakir)" },
  // For Pembelian Rumah
  { label: "(HQ) Ansuran Tertunggak (Fakir)", value: "(HQ) Ansuran Tertunggak (Fakir)", aidProduct: "(HQ) Bantuan Pembelian Rumah Kos Rendah/Sederhana (Fakir)" },
  { label: "(HQ) Baki Akhir (Fakir)", value: "(HQ) Baki Akhir (Fakir)", aidProduct: "(HQ) Bantuan Pembelian Rumah Kos Rendah/Sederhana (Fakir)" },
  { label: "(HQ) Bayaran Deposit Pembelian (Fakir)", value: "(HQ) Bayaran Deposit Pembelian (Fakir)", aidProduct: "(HQ) Bantuan Pembelian Rumah Kos Rendah/Sederhana (Fakir)" },
  { label: "(HQ) Pembelian Rumah PBT (Fakir)", value: "(HQ) Pembelian Rumah PBT (Fakir)", aidProduct: "(HQ) Bantuan Pembelian Rumah Kos Rendah/Sederhana (Fakir)" },
  { label: "(HQ) Separa Pembiayaan (Fakir)", value: "(HQ) Separa Pembiayaan (Fakir)", aidProduct: "(HQ) Bantuan Pembelian Rumah Kos Rendah/Sederhana (Fakir)" },
  // For Baikpulih Rumah
  { label: "Bantuan Baikpulih Rumah Am (Fakir)", value: "Bantuan Baikpulih Rumah Am (Fakir)", aidProduct: "Bantuan Baikpulih Rumah Am (Fakir)" },
  { label: "Pemasangan Bekalan Elektrik dan Air Am (Fakir)", value: "Pemasangan Bekalan Elektrik dan Air Am (Fakir)", aidProduct: "Bantuan Baikpulih Rumah Am (Fakir)" },
]);

// Entitlement Product options based on Aid Product
const entitlementProductOptions = ref([
  // For Binaan Rumah
  { label: "(Perolehan) Bina Rumah (Fakir)", value: "(Perolehan) Bina Rumah (Fakir)", aidProduct: "(HQ) Bantuan Binaan Rumah (Fakir)" },
  { label: "(WO) 3 Bilik (Fakir) - Tanggungan 3-6 Orang", value: "(WO) 3 Bilik (Fakir) - Tanggungan 3-6 Orang", aidProduct: "(HQ) Bantuan Binaan Rumah (Fakir)" },
  { label: "(Perolehan) Pemantauan dan Pengawasan Tapak Projek (Fakir)", value: "(Perolehan) Pemantauan dan Pengawasan Tapak Projek (Fakir)", aidProduct: "(HQ) Bantuan Binaan Rumah (Fakir)" },
  { label: "(WO) Pemantauan dan Pengawasan Tapak Projek (Fakir)", value: "(WO) Pemantauan dan Pengawasan Tapak Projek (Fakir)", aidProduct: "(HQ) Bantuan Binaan Rumah (Fakir)" },
  // For Pembelian Rumah
  { label: "(HQ) Ansuran Tertunggak (Fakir)", value: "(HQ) Ansuran Tertunggak (Fakir)", aidProduct: "(HQ) Bantuan Pembelian Rumah Kos Rendah/Sederhana (Fakir)" },
  { label: "(HQ) Baki Akhir (Fakir)", value: "(HQ) Baki Akhir (Fakir)", aidProduct: "(HQ) Bantuan Pembelian Rumah Kos Rendah/Sederhana (Fakir)" },
  { label: "(HQ) Bayaran Deposit Pembelian (Fakir)", value: "(HQ) Bayaran Deposit Pembelian (Fakir)", aidProduct: "(HQ) Bantuan Pembelian Rumah Kos Rendah/Sederhana (Fakir)" },
  { label: "(Direct) Legal Fee (Fakir)", value: "(Direct) Legal Fee (Fakir)", aidProduct: "(HQ) Bantuan Pembelian Rumah Kos Rendah/Sederhana (Fakir)" },
  { label: "(Direct) Pembayaran Baki 90% (Fakir)", value: "(Direct) Pembayaran Baki 90% (Fakir)", aidProduct: "(HQ) Bantuan Pembelian Rumah Kos Rendah/Sederhana (Fakir)" },
  { label: "(Direct) Pembayaran Pendahuluan 10% (Fakir)", value: "(Direct) Pembayaran Pendahuluan 10% (Fakir)", aidProduct: "(HQ) Bantuan Pembelian Rumah Kos Rendah/Sederhana (Fakir)" },
  { label: "(HQ) Separa Pembiayaan (Fakir)", value: "(HQ) Separa Pembiayaan (Fakir)", aidProduct: "(HQ) Bantuan Pembelian Rumah Kos Rendah/Sederhana (Fakir)" },
  // For Baikpulih Rumah
  { label: "Baikpulih Rumah (Fakir)", value: "Baikpulih Rumah (Fakir)", aidProduct: "Bantuan Baikpulih Rumah Am (Fakir)" },
  { label: "Pemasangan Bekalan Air (Fakir)", value: "Pemasangan Bekalan Air (Fakir)", aidProduct: "Bantuan Baikpulih Rumah Am (Fakir)" },
  { label: "Pemasangan Bekalan Elektrik (Fakir)", value: "Pemasangan Bekalan Elektrik (Fakir)", aidProduct: "Bantuan Baikpulih Rumah Am (Fakir)" },
  { label: "Pemasangan Bekalan Elektrik dan Air (Fakir)", value: "Pemasangan Bekalan Elektrik dan Air (Fakir)", aidProduct: "Bantuan Baikpulih Rumah Am (Fakir)" },
]);

// Computed properties
const isFormComplete = computed(() => {
  return (
    catatanLapangan.value.keputusanSiasatan &&
    catatanLapangan.value.keputusanHartanah &&
    catatanLapangan.value.catatanSokonganHartanah
  );
});

// Filtered aid product options based on selected aid
const filteredAidProductOptions = computed(() => {
  if (!formData.value.aid) return [];
  
  if (formData.value.aid.includes("Binaan Rumah")) {
    return aidProductOptions.value.filter(option => 
      option.value.includes("Binaan Rumah") || option.value.includes("Pembelian Rumah")
    );
  } else if (formData.value.aid.includes("Baikpulih Rumah")) {
    return aidProductOptions.value.filter(option => 
      option.value.includes("Baikpulih Rumah") || option.value.includes("Bekalan Elektrik")
    );
  }
  
  return aidProductOptions.value;
});

// Filtered product package options based on selected aid product
const filteredProductPackageOptions = computed(() => {
  if (!formData.value.aidproduct) return [];
  
  return productPackageOptions.value.filter(option => 
    option.aidProduct === formData.value.aidproduct
  );
});

// Filtered entitlement product options based on selected aid product
const filteredEntitlementProductOptions = computed(() => {
  if (!formData.value.aidproduct) return [];
  
  return entitlementProductOptions.value.filter(option => 
    option.aidProduct === formData.value.aidproduct
  );
});

// Methods
const getStatusVariant = (status) => {
  const variants = {
    baru: "info",
    dalam_semakan: "warning",
    tidak_lengkap: "danger",
    lengkap: "success",
    menunggu_siasatan: "warning",
    lawatan_dijadualkan: "info",
    selesai_lawatan: "success",
  };
  return variants[status?.toLowerCase()] || "default";
};

const getStatusText = (status) => {
  const statusMap = {
    baru: "Baru",
    dalam_semakan: "Dalam Semakan",
    tidak_lengkap: "Tidak Lengkap",
    lengkap: "Lengkap",
    menunggu_siasatan: "Menunggu Siasatan Lapangan",
    lawatan_dijadualkan: "Lawatan Dijadualkan",
    selesai_lawatan: "Selesai Lawatan Lapangan",
  };
  return statusMap[status?.toLowerCase()] || status;
};


const previewDocument = (dokumen) => {
  console.log("Previewing document:", dokumen);
  // Implement document preview functionality
};

const downloadDocument = (dokumen) => {
  console.log("Downloading document:", dokumen);
  // Implement document download functionality
};

// BQ Functions
const openBQForm = () => {
  editingBQ.value = null;
  showBQModal.value = true;
};

const viewBQ = (bq) => {
  // Navigate to view BQ page for checking
  router.push(
    `/BF-BTN/tugasan/bantuan/sokongan/${route.params.id}/draf-bq?view=true`
  );
};

const closeBQModal = () => {
  showBQModal.value = false;
  editingBQ.value = null;
};

const saveBQ = () => {
  // Implement BQ save functionality
  toast.success("BQ telah disimpan");
  closeBQModal();
};

// Navigation Functions
const viewLaporanGambar = () => {
  router.push(
    `/BF-BTN/tugasan/bantuan/sokongan/${route.params.id}/laporan-gambar?view=true`
  );
};

const viewLaporanTeknikal = () => {
  router.push(
    `/BF-BTN/tugasan/bantuan/sokongan/${route.params.id}/laporan-teknikal?view=true`
  );
};

const viewArahanKerja = () => {
  router.push(
    `/BF-BTN/permohonan/senarai-siasatan-lapangan/${route.params.id}/arahan-kerja`
  );
};

const urusPemantauan = () => {
  router.push(
    `/BF-BTN/permohonan/senarai-siasatan-lapangan/${route.params.id}/pemantauan`
  );
};

// Action Button Functions
// Handle aid selection change
const handleAidChange = (value) => {
  formData.value.aid = value;
  // Reset dependent fields when aid changes
  formData.value.aidproduct = "";
  formData.value.productpackage = "";
  formData.value.entitlementproduct = "";
};

// Handle aid product selection change
const handleAidProductChange = (value) => {
  formData.value.aidproduct = value;
  // Reset dependent fields when aid product changes
  formData.value.productpackage = "";
  formData.value.entitlementproduct = "";
};

const handleSimpan = async () => {
  try {
    processing.value = true;
    actionType.value = "simpan";

    // Implement save functionality
    console.log("Saving form data...", catatanLapangan.value);

    toast.success("Data telah disimpan");
  } catch (error) {
    toast.error("Ralat semasa menyimpan data");
    console.error(error);
  } finally {
    processing.value = false;
    actionType.value = "";
  }
};

const handleHantar = async () => {
  try {
    processing.value = true;
    actionType.value = "hantar";

    // Validate form completion
    if (!isFormComplete.value) {
      toast.error("Sila pastikan semua medan diperlukan telah diisi");
      return;
    }

    // Implement submit functionality
    console.log("Submitting form data...", catatanLapangan.value);

    // Check if BQ needs rework based on Keputusan Hartanah
    if (catatanLapangan.value.keputusanHartanah === 'rework') {
      toast.success("Status akan berubah kepada Selesai Semakan dalam BTN-PB-MB-04-BDS-06 Status");
    } else {
      toast.success("Permohonan telah dihantar");
    }

    // Navigate back to list
    setTimeout(() => {
      router.push("/BF-BTN/tugasan");
    }, 1500);
  } catch (error) {
    toast.error("Ralat semasa menghantar permohonan");
    console.error(error);
  } finally {
    processing.value = false;
    actionType.value = "";
  }
};







const handleKembali = () => {
  router.push("/BF-BTN/tugasan");
};

// Fetch application data on mount
onMounted(() => {
  // Implement API call to fetch application data
  // This is mock data for now
  formData.value = {
    nama: "Mohd Rosli bin Saad",
    alamat: "Jalan Rajawali, Kampung Bukit Kuching, 45800 Jeram",
    jenisPengenalan: "myKad",
    mykad: "880701121234",
    noTelefon: "0123456789",
    emel: "rosli@gmail.com",
    statusKeluarga: "Fakir",
    statusIndividu: "Fakir",
    statusMultidimensi: "Asnaf Tidak Produktif",
    statusLawatan: "belum_selesai",
    aid: "B125 - Bantuan Baikpulih Rumah (Fakir)",
    aidproduct: "Bantuan Baikpulih Rumah Am (Fakir)",
    productpackage: "Baikpulih Rumah (Fakir)",
    entitlementproduct: "Baikpulih Rumah (Fakir)",
  };

  // Auto-populate laporan teknikal data
  laporanTeknikal.value = {
    latarBelakang:
      "Berdasarkan profiling, pemohon tinggal di rumah yang memerlukan kerja-kerja baik pulih bumbung dan dinding yang rosak akibat cuaca. Rumah tersebut telah berusia lebih 20 tahun dan memerlukan penyelenggaraan yang mendesak.",
    keperluan:
      "1. Baik pulih bumbung yang bocor\n2. Cat semula dinding luar\n3. Penggantian papan siling yang rosak\n4. Baik pulih longkang di sekeliling rumah",
    cadangan:
      "Dicadangkan agar kerja-kerja baik pulih dilakukan secara berperingkat dengan keutamaan kepada pembaikan bumbung bocor untuk mengelakkan kerosakan yang lebih teruk semasa musim hujan.",
    nilaiKerja: 25000,
  };

  // Auto-calculate jumlah bantuan from BQ (mock calculation)
  jumlahBantuan.value = 25000;
  catatanPengesyoran.value =
    "Cadangan kerja baik pulih bumbung bocor dan cat dinding luar untuk memastikan keselamatan dan keselesaan pemohon.";

  // Sample catatan lapangan data
  catatanLapangan.value = {
    keputusanSiasatan: "sokong",
    catatanSokongan: "Berdasarkan siasatan yang telah dijalankan, pemohon layak menerima bantuan untuk kerja-kerja baik pulih rumah.",
    itemBantuan: "Baik pulih bumbung dan dinding rumah",
    tarikhSokongan: new Date().toLocaleString("ms-MY"),
    keputusanHartanah: "",
    catatanSokonganHartanah: "",
    tarikhSokonganHartanah: new Date().toLocaleString("ms-MY"),
  };
});

// Utility functions
const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('ms-MY', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getProcessStatusVariant = (status) => {
  const variants = {
    'Selesai': 'success',
    'Sokong': 'success',
    'Dalam Proses': 'warning',
    'Tidak Sokong': 'warning',
    'Belum Mula': 'info',
    'Lewat': 'danger'
  };
  return variants[status] || 'default';
};

// BQ functions
const getBQStatusVariant = (status) => {
  const variants = {
    'DALAM PROSES': 'warning',
    'DALAM KELULUSAN': 'warning',
    'DILULUSKAN': 'success',
    'DITOLAK': 'danger',
    'DRAFT': 'info'
  };
  return variants[status] || 'default';
};

</script>

<style lang="scss" scoped>
// Custom animations and transitions
.group:hover .group-hover\:text-blue-600 {
  transition: color 0.2s ease-in-out;
}

// Enhanced focus states
.focus\:ring-2:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

// Table row hover effect
.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

// Document card styling
.border-gray-200 {
  border-color: #e5e7eb;
}

.bg-gray-50 {
  background-color: #f9fafb;
}
</style>

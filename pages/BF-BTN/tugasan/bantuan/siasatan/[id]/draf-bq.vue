<template>
  <div class="">
    <div class="">
      <LayoutsBreadcrumb :items="breadcrumb" />

      <!-- Page Header -->
      <header class="mt-6 mb-8" role="banner">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div class="flex-1">
            <h1
              class="text-3xl font-bold text-gray-900 tracking-tight"
              id="page-title"
            > Siasatan dan Anggaran Kos
             <!-- {{ editingBQ ? "Edit" : "Tambah" }} Draf BQ -->
            </h1> 
            <p class="mt-2 text-sm text-gray-600 max-w-2xl" role="doc-subtitle">
              Senarai kerja-kerja cadangan
            </p>
          </div>
          <rs-button
            variant="primary-outline"
            @click="handleBack"
            class="text-sm px-4 py-2 shrink-0"
            :aria-label="'Kembali ke halaman siasatan untuk ' + route.params.id"
          >
            <Icon
              name="ph:arrow-left"
              class="w-4 h-4 mr-2"
              aria-hidden="true"
            />
            Kembali
          </rs-button>
        </div>
      </header>

      <main class="space-y-6" role="main" aria-labelledby="page-title">
        <!-- BQ Header Information -->
        <section aria-labelledby="bq-header-title">
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0" aria-hidden="true">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:file-text" class="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h2
                    class="text-lg font-semibold text-gray-900"
                    id="bq-header-title"
                  >
                    Maklumat BQ
                  </h2>
                  <p class="text-sm text-gray-500">
                    Maklumat asas untuk dokumen BQ
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <!-- Auto-generated fields (Read-only) -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700"
                    >No BQ</label
                  >
                  <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span class="text-sm font-mono text-gray-900 break-all">{{
                      formData.noBQ
                    }}</span>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700"
                    >No Bantuan</label
                  >
                  <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span class="text-sm font-mono text-gray-900 break-all">{{
                      formData.noBR
                    }}</span>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700"
                    >Nama Pemohon</label
                  >
                  <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span class="text-sm text-gray-900 break-words">{{
                      formData.namaPemohon
                    }}</span>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700"
                    >Tarikh Siasatan</label
                  >
                  <FormKit
                    type="date"
                    v-model="formData.tarikhSiasatan"
                    :classes="{ input: 'text-sm' }"
                  />
                </div>

                <div class="space-y-2 lg:col-span-2">
                  <label class="block text-sm font-medium text-gray-700"
                    >Alamat</label
                  >
                  <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span
                      class="text-sm text-gray-900 break-words leading-relaxed"
                      >{{ formData.alamat }}</span
                    >
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </section>

        <!-- Table Senarai Item Kerja -->
        <section aria-labelledby="item-kerja-title">
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0" aria-hidden="true">
                    <div
                      class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                    >
                      <Icon name="ph:list" class="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h2
                      class="text-lg font-semibold text-gray-900"
                      id="item-kerja-title"
                    >
                      Senarai Item Kerja
                    </h2>
                    <p class="text-sm text-gray-500">
                      Senarai kerja dan anggaran kos
                    </p>
                  </div>
                </div>
                <rs-button
                  variant="primary"
                  @click="addItem"
                  aria-label="Tambah item kerja baru"
                >
                  <Icon
                    name="ph:plus"
                    class="w-4 h-4 mr-2"
                    aria-hidden="true"
                  />
                  Tambah Item
                </rs-button>
              </div>
            </template>

            <template #body>
              <!-- Mobile Card Layout (sm and below) -->
              <div class="block lg:hidden space-y-4">
                <div
                  v-for="(item, index) in formData.itemKerja"
                  :key="index"
                  class="p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div class="flex justify-between items-start mb-3">
                    <span class="text-sm font-medium text-gray-600"
                      >Item {{ index + 1 }}</span
                    >
                    <rs-button
                      variant="danger"
                      size="sm"
                      @click="removeItem(index)"
                      class="!p-2"
                    >
                      <Icon name="ph:trash" class="w-4 h-4" />
                    </rs-button>
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1">
                      <label class="text-xs font-medium text-gray-700"
                        >REF</label
                      >
                      <FormKit
                        type="text"
                        v-model="item.ref"
                        :classes="{ input: 'text-sm !p-2' }"
                        placeholder="REF"
                      />
                    </div>
                    <div class="space-y-1">
                      <label class="text-xs font-medium text-gray-700"
                        >Unit</label
                      >
                      <FormKit
                        type="text"
                        v-model="item.unit"
                        :classes="{ input: 'text-sm !p-2' }"
                        placeholder="Unit"
                      />
                    </div>
                    <div class="space-y-1">
                      <label class="text-xs font-medium text-gray-700"
                        >Kuantiti</label
                      >
                      <FormKit
                        type="number"
                        v-model="item.kuantiti"
                        :classes="{ input: 'text-sm !p-2' }"
                        @input="updateTotals()"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div class="space-y-1">
                      <label class="text-xs font-medium text-gray-700"
                        >Kadar (RM)</label
                      >
                      <FormKit
                        type="number"
                        v-model="item.kadar"
                        :classes="{ input: 'text-sm !p-2' }"
                        @input="updateTotals()"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div class="space-y-1">
                      <label class="text-xs font-medium text-gray-700"
                        >Jumlah (RM)</label
                      >
                      <div class="p-2 bg-gray-50 rounded-lg border border-gray-200">
                        <span class="text-sm font-medium text-gray-900">
                          {{ formatCurrency((Number(item.kuantiti) || 0) * (Number(item.kadar) || 0)) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="mt-3 space-y-2">
                    <label class="text-xs font-medium text-gray-700"
                      >Keterangan Kerja</label
                    >
                    <FormKit
                      type="select"
                      v-model="item.jenisKerja"
                      :classes="{ input: 'text-sm !p-2' }"
                      :options="jenisKerjaOptions"
                      placeholder="Pilih jenis kerja..."
                      @input="handleJenisKerjaChange(item, index)"
                    />
                    <FormKit
                      type="textarea"
                      v-model="item.keteranganKerja"
                      rows="4"
                      :classes="{ input: 'text-sm !p-2' }"
                      placeholder="Masukkan keterangan kerja..."
                    />
                  </div>
                </div>

                <div
                  v-if="formData.itemKerja.length === 0"
                  class="p-8 text-center text-sm text-gray-500 border border-gray-200 rounded-lg"
                >
                  Tiada item kerja. Klik butang "Tambah Item" untuk menambah
                  item kerja.
                </div>
              </div>

              <!-- Desktop Table Layout (lg and above) -->
              <div class="hidden lg:block overflow-x-auto">
                <table
                  class="min-w-full divide-y divide-gray-200"
                  role="table"
                  aria-label="Senarai item kerja untuk BQ"
                >
                  <thead class="bg-gray-50" role="rowgroup">
                    <tr role="row">
                      <th
                        class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
                        scope="col"
                        role="columnheader"
                      >
                        Bil
                      </th>
                      <th
                        class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20"
                        scope="col"
                        role="columnheader"
                      >
                        REF
                      </th>
                      <th
                        class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0"
                        scope="col"
                        role="columnheader"
                      >
                        Keterangan Kerja
                      </th>
                      <th
                        class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20"
                        scope="col"
                        role="columnheader"
                      >
                        Unit
                      </th>
                      <th
                        class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
                        scope="col"
                        role="columnheader"
                      >
                        Kuantiti
                      </th>
                      <th
                        class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
                        scope="col"
                        role="columnheader"
                      >
                        Kadar (RM)
                      </th>
                      <th
                        class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
                        scope="col"
                        role="columnheader"
                      >
                        Jumlah (RM)
                      </th>
                      <th
                        class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20"
                        scope="col"
                        role="columnheader"
                      >
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    class="bg-white divide-y divide-gray-200"
                    role="rowgroup"
                  >
                    <tr
                      v-for="(item, index) in formData.itemKerja"
                      :key="index"
                      class="hover:bg-gray-50 transition-colors"
                      role="row"
                    >
                      <td
                        class="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                        role="gridcell"
                      >
                        {{ index + 1 }}
                      </td>
                      <td class="px-3 py-4" role="gridcell">
                        <FormKit
                          type="text"
                          v-model="item.ref"
                          :classes="{
                            input:
                              'text-sm !p-2 !border-gray-300 focus:!border-blue-500 focus:!ring-blue-500',
                          }"
                          placeholder="REF"
                          :aria-label="`Rujukan untuk item ${index + 1}`"
                        />
                      </td>
                      <td class="px-3 py-4" role="gridcell">
                        <div class="space-y-2">
                          <FormKit
                            type="select"
                            v-model="item.jenisKerja"
                            :classes="{
                              input:
                                'text-sm !p-2 !border-gray-300 focus:!border-blue-500 focus:!ring-blue-500',
                            }"
                            :options="jenisKerjaOptions"
                            placeholder="Pilih jenis kerja..."
                            @input="handleJenisKerjaChange(item, index)"
                            :aria-label="`Jenis kerja untuk item ${index + 1}`"
                          />
                          <FormKit
                            type="textarea"
                            v-model="item.keteranganKerja"
                            rows="4"
                            :classes="{
                              input:
                                'text-sm !p-2 !border-gray-300 focus:!border-blue-500 focus:!ring-blue-500',
                            }"
                            placeholder="Masukkan keterangan kerja..."
                            :aria-label="`Keterangan kerja untuk item ${
                              index + 1
                            }`"
                          />
                        </div>
                      </td>
                      <td class="px-3 py-4" role="gridcell">
                        <FormKit
                          type="text"
                          v-model="item.unit"
                          :classes="{
                            input:
                              'text-sm !p-2 !border-gray-300 focus:!border-blue-500 focus:!ring-blue-500',
                          }"
                          placeholder="Unit"
                          :aria-label="`Unit untuk item ${index + 1}`"
                        />
                      </td>
                      <td class="px-3 py-4" role="gridcell">
                        <FormKit
                          type="number"
                          v-model="item.kuantiti"
                          :classes="{
                            input:
                              'text-sm !p-2 !border-gray-300 focus:!border-blue-500 focus:!ring-blue-500',
                          }"
                          @input="updateTotals()"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          :aria-label="`Kuantiti untuk item ${index + 1}`"
                        />
                      </td>
                      <td class="px-3 py-4" role="gridcell">
                        <FormKit
                          type="number"
                          v-model="item.kadar"
                          :classes="{
                            input:
                              'text-sm !p-2 !border-gray-300 focus:!border-blue-500 focus:!ring-blue-500',
                          }"
                          @input="updateTotals()"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          :aria-label="`Kadar dalam ringgit untuk item ${
                            index + 1
                          }`"
                        />
                      </td>
                      <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-900" role="gridcell">
                        <div class="font-medium">
                          {{ formatCurrency((Number(item.kuantiti) || 0) * (Number(item.kadar) || 0)) }}
                        </div>
                      </td>
                      <td class="px-3 py-4" role="gridcell">
                        <rs-button
                          variant="danger"
                          size="sm"
                          @click="removeItem(index)"
                          class="!p-2"
                          :aria-label="`Padam item ${index + 1}: ${
                            item.keteranganKerja || 'Item kosong'
                          }`"
                        >
                          <Icon
                            name="ph:trash"
                            class="w-4 h-4"
                            aria-hidden="true"
                          />
                        </rs-button>
                      </td>
                    </tr>
                    <tr v-if="formData.itemKerja.length === 0">
                      <td
                        colspan="7"
                        class="px-3 py-8 text-center text-sm text-gray-500"
                      >
                        Tiada item kerja. Klik butang "Tambah Item" untuk
                        menambah item kerja.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Total Section -->
              <div class="mt-6 border-t border-gray-200 pt-6">
                <div class="flex justify-end">
                  <div
                    class="w-full max-w-sm space-y-3 bg-gray-50 p-4 rounded-lg"
                  >
                    <!-- <div
                      class="flex justify-between items-center text-sm text-gray-600"
                    >
                      <span class="font-medium">Subtotal:</span>
                      <span class="font-mono"
                        >RM
                        {{
                          subtotal.toLocaleString("ms-MY", {
                            minimumFractionDigits: 2,
                          })
                        }}</span
                      >
                    </div> -->
                    <div
                      class="flex justify-between items-center text-lg font-bold text-gray-900 border-t border-gray-300 pt-3"
                    >
                      <span>Jumlah Keseluruhan BQ:</span>
                      <span class="font-mono text-blue-600">
                        RM
                        {{
                          formData.jumlahKeseluruhan.toLocaleString("ms-MY", {
                            minimumFractionDigits: 2,
                          })
                        }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </section>

        <!-- Summary & Additional Info -->
        <section aria-labelledby="summary-title">
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0" aria-hidden="true">
                  <div
                    class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:note" class="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h2
                    class="text-lg font-semibold text-gray-900"
                    id="summary-title"
                  >
                    Ringkasan & Maklumat Tambahan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Ringkasan BQ dan maklumat pengesahan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-6">
                                 <!-- Editable Catatan Pengesyoran -->
                 <!-- <div class="space-y-2">
                   <label class="block text-sm font-medium text-gray-700">
                     Ringgit
                     <span class="text-xs text-gray-500 font-normal ml-1">*</span>
                   </label>
                   <FormKit
                     type="textarea"
                     v-model="formData.catatanPengesyoran"
                     rows="4"
                     :classes="{ 
                       input: 'text-sm !p-3 !border-blue-300 focus:!border-blue-500 focus:!ring-blue-500 bg-blue-50/30',
                       wrapper: 'mb-0'
                     }"
                     placeholder="Masukkan catatan pengesyoran untuk dokumen BQ ini..."
                     help="Catatan ini akan dipaparkan dalam dokumen BQ sebagai pengesyoran rasmi."
                   />
                 </div> -->

                <!-- Ringgit Malaysia Word Conversion -->
                <div class="p-4">
                  <p class="text-base font-bold text-gray-900">
                    <strong>Ringgit Malaysia :</strong> {{ numberToWords(formData.jumlahKeseluruhan).toUpperCase() }}
                  </p>
                </div>

                <!-- Recommendation line mirroring the document -->
                <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p class="text-sm text-green-800 font-medium">
                    💡 Disyorkan kerja-kerja baik pulih dengan nilai RM
                    {{
                      formData.jumlahKeseluruhan.toLocaleString("ms-MY", {
                        minimumFractionDigits: 2,
                      })
                    }}.
                  </p>
                </div>

                <!-- Digital Signature Section -->
                <div class="border-t border-gray-200 pt-6">
                  <div class="flex items-center space-x-2 mb-6">
                    <Icon name="ph:signature" class="w-5 h-5 text-blue-600" />
                    <h3 class="text-lg font-semibold text-gray-900">
                      Pengesahan Digital
                    </h3>
                    <div
                      class="ml-auto flex items-center space-x-2 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
                    >
                      <Icon name="ph:user-circle" class="w-4 h-4" />
                      <span class="font-medium">{{
                        getCurrentStageDisplay()
                      }}</span>
                    </div>
                  </div>

                  <!-- Dynamic signature display based on current stage -->
                  <div class="max-w-md">
                    <!-- Disediakan Stage -->
                    <div
                      v-if="currentStage === 'disediakan'"
                      class="space-y-3 p-4 bg-green-50 rounded-lg border-2 border-green-300 relative"
                    >
                      <div
                        class="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        <Icon name="ph:user" class="w-3 h-3 mr-1" />
                        Anda
                      </div>
                      <label class="block text-sm font-medium text-green-700">
                        <Icon
                          name="ph:pencil-simple"
                          class="w-4 h-4 inline mr-1 text-green-600"
                        />
                        Disediakan Oleh
                      </label>
                      <div class="p-3 bg-white rounded border border-green-200">
                        <div class="text-sm font-medium text-gray-900">
                          {{ formData.disediakanOleh }}
                        </div>
                        <div class="text-xs text-gray-500 mt-1">
                          Eksekutif Teknikal Daerah Kuala Selangor<br>
                          Jabatan Pengurusan Operasi Agihan Daerah
                        </div>
                      </div>
                      <div
                        class="text-xs text-green-600 flex items-center font-medium"
                      >
                        <Icon name="ph:calendar" class="w-3 h-3 mr-1" />
                        Tarikh: {{ new Date().toLocaleDateString("ms-MY") }}
                      </div>
                      <!-- <div class="text-xs text-green-600 flex items-center">
                        <Icon name="ph:check-circle" class="w-3 h-3 mr-1" />
                        Status: Aktif
                      </div> -->
                    </div>

                    <!-- Disemak 1 Stage -->
                    <div
                      v-else-if="currentStage === 'disemak1'"
                      class="space-y-3 p-4 bg-blue-50 rounded-lg border-2 border-blue-300 relative"
                    >
                      <div
                        class="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        <Icon name="ph:user" class="w-3 h-3 mr-1" />
                        Anda
                      </div>
                      <label class="block text-sm font-medium text-blue-700">
                        <Icon
                          name="ph:check-circle"
                          class="w-4 h-4 inline mr-1 text-blue-600"
                        />
                        Disemak 1
                      </label>
                      <div class="p-3 bg-white rounded border border-blue-200">
                        <div class="text-sm font-medium text-gray-900">
                          {{ formData.disemak1 || "Menunggu tindakan anda" }}
                        </div>
                        <div class="text-xs text-gray-500 mt-1">
                          Pegawai Penyemak 1
                        </div>
                      </div>
                      <div
                        class="text-xs text-blue-600 flex items-center font-medium"
                      >
                        <Icon name="ph:calendar" class="w-3 h-3 mr-1" />
                        Tarikh:
                        {{
                          formData.tarikhDisemak1 ||
                          new Date().toLocaleDateString("ms-MY")
                        }}
                      </div>
                      <div class="text-xs text-blue-600 flex items-center">
                        <Icon name="ph:clock" class="w-3 h-3 mr-1" />
                        Status: Sedang Disemak
                      </div>
                    </div>

                    <!-- Disemak 2 Stage -->
                    <div
                      v-else-if="currentStage === 'disemak2'"
                      class="space-y-3 p-4 bg-purple-50 rounded-lg border-2 border-purple-300 relative"
                    >
                      <div
                        class="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        <Icon name="ph:user" class="w-3 h-3 mr-1" />
                        Anda
                      </div>
                      <label class="block text-sm font-medium text-purple-700">
                        <Icon
                          name="ph:check-circle"
                          class="w-4 h-4 inline mr-1 text-purple-600"
                        />
                        Disemak 2
                      </label>
                      <div
                        class="p-3 bg-white rounded border border-purple-200"
                      >
                        <div class="text-sm font-medium text-gray-900">
                          {{ formData.disemak2 || "Menunggu tindakan anda" }}
                        </div>
                        <div class="text-xs text-gray-500 mt-1">
                          Pegawai Penyemak 2
                        </div>
                      </div>
                      <div
                        class="text-xs text-purple-600 flex items-center font-medium"
                      >
                        <Icon name="ph:calendar" class="w-3 h-3 mr-1" />
                        Tarikh:
                        {{
                          formData.tarikhDisemak2 ||
                          new Date().toLocaleDateString("ms-MY")
                        }}
                      </div>
                      <div class="text-xs text-purple-600 flex items-center">
                        <Icon name="ph:clock" class="w-3 h-3 mr-1" />
                        Status: Sedang Disemak
                      </div>
                    </div>

                    <!-- Diluluskan Stage -->
                    <div
                      v-else-if="currentStage === 'diluluskan'"
                      class="space-y-3 p-4 bg-emerald-50 rounded-lg border-2 border-emerald-300 relative"
                    >
                      <div
                        class="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        <Icon name="ph:user" class="w-3 h-3 mr-1" />
                        Anda
                      </div>
                      <label class="block text-sm font-medium text-emerald-700">
                        <Icon
                          name="ph:seal-check"
                          class="w-4 h-4 inline mr-1 text-emerald-600"
                        />
                        Diluluskan
                      </label>
                      <div
                        class="p-3 bg-white rounded border border-emerald-200"
                      >
                        <div class="text-sm font-medium text-gray-900">
                          {{ formData.diluluskan || "Menunggu tindakan anda" }}
                        </div>
                        <div class="text-xs text-gray-500 mt-1">
                          Pegawai Pelulus
                        </div>
                      </div>
                      <div
                        class="text-xs text-emerald-600 flex items-center font-medium"
                      >
                        <Icon name="ph:calendar" class="w-3 h-3 mr-1" />
                        Tarikh:
                        {{
                          formData.tarikhDisahkan ||
                          new Date().toLocaleDateString("ms-MY")
                        }}
                      </div>
                      <div class="text-xs text-emerald-600 flex items-center">
                        <Icon name="ph:seal-check" class="w-3 h-3 mr-1" />
                        Status: Sedang Diluluskan
                      </div>
                    </div>
                  </div>

                  <!-- Workflow Information -->
                  <div
                    class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div class="flex items-start space-x-3">
                      <Icon
                        name="ph:info"
                        class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <h4 class="text-sm font-medium text-blue-900 mb-1">
                          Aliran Kerja Pengesahan
                        </h4>
                        <p
                          class="text-sm text-blue-700 leading-relaxed"
                          v-html="getWorkflowStatusMessage()"
                        ></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </section>

        <!-- Action Buttons -->
        <section aria-labelledby="actions-title" class="sr-only">
          <h2 id="actions-title">Tindakan BQ</h2>
        </section>

        <rs-card class="p-4">
          <div class="flex flex-col lg:flex-row gap-3 lg:justify-end">
            <!-- Mobile: Full width buttons -->
            <!-- <rs-button
              variant="primary-outline"
              @click="handleSaveDraft"
              :disabled="processing"
              class="w-full lg:w-auto !py-3 text-sm font-medium order-3 lg:order-1"
            >
              <Icon name="ph:floppy-disk" class="w-5 h-5 mr-2" />
              Simpan Draf
            </rs-button> -->

            <rs-button
              variant="success-outline"
              @click="handleGeneratePDF"
              :disabled="processing"
              class="w-full lg:w-auto !py-3 text-sm font-medium order-2 lg:order-2"
            >
              <Icon name="ph:file-pdf" class="w-5 h-5 mr-2" />
              Jana PDF
            </rs-button>

            <rs-button
              variant="primary"
              @click="handleSaveAndReturn"
              :disabled="processing"
              :loading="processing"
              class="w-full lg:w-auto !py-3 text-sm font-medium order-1 lg:order-3"
            >
              <Icon name="ph:check" class="w-5 h-5 mr-2" />
              Simpan & Kembali
            </rs-button>
          </div>
        </rs-card>
      </main>
    </div>

    <!-- PDF Preview Modal -->
    <div v-if="showPDFModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Preview</h3>
          <button @click="showPDFModal = false" class="text-gray-400 hover:text-gray-600">
            <Icon name="ph:x" class="w-6 h-6" />
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6">
          <!-- Document Header -->
          <div class="text-center mb-6">
            <h1 class="text-xl font-bold text-gray-900 mb-2">BORANG SIASATAN & ANGGARAN KOS</h1>
            <p class="text-sm text-gray-600">LEMBAGA ZAKAT SELANGOR</p>
          </div>

          <!-- Applicant Details -->
          <div class="mb-6 space-y-2">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-medium">Nama Pemohon & Institusi:</span> {{ formData.namaPemohon }}
              </div>
              <div>
                <span class="font-medium">No BR:</span> {{ formData.noBR }}
              </div>
              <div class="col-span-2">
                <span class="font-medium">Alamat:</span> {{ formData.alamat }}
              </div>
              <div>
                <span class="font-medium">Tarikh Siasatan:</span> {{ new Date(formData.tarikhSiasatan).toLocaleDateString("ms-MY") }}
              </div>
            </div>
          </div>

          <!-- Work Items Table -->
          <div class="mb-6">
            <table class="w-full border border-gray-300 text-sm">
              <thead class="bg-gray-100">
                <tr>
                  <th class="border border-gray-300 px-2 py-1 text-left">BIL</th>
                  <th class="border border-gray-300 px-2 py-1 text-left">REF</th>
                  <th class="border border-gray-300 px-2 py-1 text-left">KETERANGAN KERJA</th>
                  <th class="border border-gray-300 px-2 py-1 text-left">UNIT</th>
                  <th class="border border-gray-300 px-2 py-1 text-left">KUANTITI</th>
                  <th class="border border-gray-300 px-2 py-1 text-left">KADAR</th>
                  <th class="border border-gray-300 px-2 py-1 text-left">JUMLAH</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in formData.itemKerja" :key="index">
                  <td class="border border-gray-300 px-2 py-1">{{ index + 1 }}</td>
                  <td class="border border-gray-300 px-2 py-1">{{ item.ref }}</td>
                  <td class="border border-gray-300 px-2 py-1 text-xs">{{ item.keteranganKerja }}</td>
                  <td class="border border-gray-300 px-2 py-1">{{ item.unit }}</td>
                  <td class="border border-gray-300 px-2 py-1 text-right">{{ item.kuantiti }}</td>
                  <td class="border border-gray-300 px-2 py-1 text-right">{{ formatCurrency(item.kadar) }}</td>
                  <td class="border border-gray-300 px-2 py-1 text-right font-medium">{{ formatCurrency((Number(item.kuantiti) || 0) * (Number(item.kadar) || 0)) }}</td>
                </tr>
                <tr class="bg-gray-50">
                  <td colspan="6" class="border border-gray-300 px-2 py-1 font-bold text-right">JUMLAH KESELURUHAN</td>
                  <td class="border border-gray-300 px-2 py-1 text-right font-bold">{{ formatCurrency(formData.jumlahKeseluruhan) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Amount in Words & Recommendation -->
          <div class="mb-6 space-y-3">
            <div class="text-left">
              <p class="text-base font-bold text-gray-900">
                <strong>Ringgit Malaysia :</strong> {{ numberToWords(formData.jumlahKeseluruhan).toUpperCase() }}
              </p>
            </div>
            <div class="text-left">
              <p class="text-sm text-gray-800">
                Disyorkan kerja-kerja baik pulih dengan nilai RM{{ formData.jumlahKeseluruhan.toLocaleString("ms-MY") }}.
              </p>
            </div>
          </div>

          <!-- Signature Section -->
          <div class="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p class="font-medium mb-2">Disediakan Oleh:</p>
              <!-- <div class="border border-gray-300 h-16 mb-2"></div> -->
              <p class="font-medium">{{ formData.disediakanOleh }}</p>
              <p class="text-xs text-gray-600">Eksekutif Teknikal Daerah Kuala Selangor<br>Jabatan Pengurusan Operasi Agihan Daerah</p>
            </div>
            <div>
              <p class="font-medium mb-2">Disemak 1 Oleh:</p>
              <!-- <div class="border border-gray-300 h-16 mb-2"></div> -->
              <p class="font-medium">{{ formData.disemak1 }}</p>
              <p class="text-xs text-gray-600">Eksekutif Pengurusan Projek<br>Jabatan Pengurusan Hartanah</p>
            </div>
            <div>
              <p class="font-medium mb-2">Disemak 2 Oleh:</p>
              <!-- <div class="border border-gray-300 h-16 mb-2"></div> -->
              <p class="font-medium">{{ formData.disemak2 }}</p>
              <p class="text-xs text-gray-600">Ketua<br>Jabatan Pengurusan Hartanah</p>
            </div>
            <div>
              <p class="font-medium mb-2">Disahkan Oleh:</p>
              <!-- <div class="border border-gray-300 h-16 mb-2"></div> -->
              <p class="font-medium">{{ formData.diluluskan }}</p>
              <p class="text-xs text-gray-600">Ketua</p>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <rs-button variant="secondary" @click="showPDFModal = false">
            Tutup
          </rs-button>
          <rs-button variant="primary" @click="generateActualPDF">
            <Icon name="ph:file-pdf" class="w-4 h-4 mr-2" />
            Cetak PDF
          </rs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const processing = ref(false);
const showPDFModal = ref(false);

definePageMeta({
  title: "Draf BQ - Siasatan Lapangan",
});

const breadcrumb = ref([
  {
    name: "Tugasan",
    type: "link",
    path: "/BF-BTN/tugasan",
  },
  {
    name: "Siasatan ke Lapangan",
    type: "link",
    path: "/BF-BTN/tugasan",
  },
  {
    name: "Kemaskini Siasatan",
    type: "current",
    path: `/BF-BTN/tugasan/bantuan/siasatan/${route.params.id}`,
  },
  {
    name: "BQ",
    type: "current",
    path: `/BF-BTN/tugasan/bantuan/siasatan/${route.params.id}/draf-bq`,
  },
]);

// Check if we're editing an existing BQ
const editingBQ = computed(() => route.query.edit === "true");

// Options for pegawai selection
const pegawaiOptions = ref([
  { label: "Ahmad bin Ali - Pegawai Teknikal", value: "ahmad_ali" },
  { label: "Siti binti Hassan - Pegawai Kanan", value: "siti_hassan" },
  { label: "Mohd bin Ibrahim - Ketua Pegawai", value: "mohd_ibrahim" },
]);

const jenisKerjaOptions = ref([
  { label: "Roboh Rumah Kayu", value: "roboh_rumah_kayu" },
  { label: "Bina Semula Bangunan Bilik", value: "bina_semula_bangunan_bilik" },
]);

// Predefined data for each jenis kerja
const jenisKerjaData = {
  roboh_rumah_kayu: {
    keteranganKerja: "Membuka,memecah dan membawa keluar keseluruhan struktur binaan rumah kayu,membuka dan memindahkan meter elektrik TNB,papan agihan termasuk semua pendawaian yang berkaitan, membawa bahan-bahan buangan pembinaan ke lokasi yang ditentukan sehingga sempurna mengikut arahan Pegawai Penguasa.",
    unit: "Pukal",
    kadar: 3000
  },
  bina_semula_bangunan_bilik: {
    keteranganKerja: "Membina tambahan bilik berukuran 20' x 15' termasuk kerja-kerja asas cerucuk bakau atau raft foundation, penapak konkrit bertetulang (pad footing), rasuk tanah konkrit bertetulang, tiang konkrit bertetulang, dinding bata berlepa, rasuk bumbung konkrit bertetulang, lantai konkrit bertetulang, kemasan siling, kemasan cat luar & dalam serta kelengkapan berikut :",
    unit: "Pukal",
    kadar: 40000
  }
};

// Form data with better structure
const formData = ref({
  noBQ: "",
  noBR: "",
  namaPemohon: "",
  alamat: "",
  tarikhSiasatan: "",
  itemKerja: [],
  jumlahKeseluruhan: 0,
  ringgiMalaysiaPerkataan: "",
  catatanPengesyoran: "",
  disediakanOleh: "",
  disemak1: "",
  disemak2: "",
  diluluskan: "",
  tarikhDisemak1: "",
  tarikhDisemak2: "",
  tarikhDisahkan: "",
});

// Current workflow stage - in a real app this would come from the document status
const currentStage = ref("disediakan"); // 'disediakan', 'disemak1', 'disemak2', 'diluluskan'

// Utility functions (moved before computed properties to avoid hoisting issues)
const numberToWords = (amount) => {
  if (!amount || amount === 0) return "TIADA RINGGIT SAHAJA";

  const num = Math.round(amount);
  
  // Convert numbers to Malay words
  const convertToWords = (n) => {
    const ones = ['', 'SATU', 'DUA', 'TIGA', 'EMPAT', 'LIMA', 'ENAM', 'TUJUH', 'LAPAN', 'SEMBILAN'];
    const teens = ['SEPULUH', 'SEBELAS', 'DUA BELAS', 'TIGA BELAS', 'EMPAT BELAS', 'LIMA BELAS', 'ENAM BELAS', 'TUJUH BELAS', 'LAPAN BELAS', 'SEMBILAN BELAS'];
    const tens = ['', '', 'DUA PULUH', 'TIGA PULUH', 'EMPAT PULUH', 'LIMA PULUH', 'ENAM PULUH', 'TUJUH PULUH', 'LAPAN PULUH', 'SEMBILAN PULUH'];
    
    if (n === 0) return '';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) {
      const ten = Math.floor(n / 10);
      const one = n % 10;
      return tens[ten] + (one > 0 ? ' ' + ones[one] : '');
    }
    if (n < 1000) {
      const hundred = Math.floor(n / 100);
      const remainder = n % 100;
      return (hundred === 1 ? 'SERATUS' : ones[hundred] + ' RATUS') + 
             (remainder > 0 ? ' ' + convertToWords(remainder) : '');
    }
    if (n < 1000000) {
      const thousand = Math.floor(n / 1000);
      const remainder = n % 1000;
      return (thousand === 1 ? 'SERIBU' : convertToWords(thousand) + ' RIBU') + 
             (remainder > 0 ? ' ' + convertToWords(remainder) : '');
    }
    if (n < 1000000000) {
      const million = Math.floor(n / 1000000);
      const remainder = n % 1000000;
      return (million === 1 ? 'SEJUTA' : convertToWords(million) + ' JUTA') + 
             (remainder > 0 ? ' ' + convertToWords(remainder) : '');
    }
    return 'NOMBOR TERLALU BESAR';
  };
  
  return convertToWords(num) + ' RINGGIT SAHAJA';
};

const formatCurrency = (amount) => {
  if (!amount || amount === 0) return "RM 0.00";
  return new Intl.NumberFormat('ms-MY', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const generateCatatanPengesyoran = (total = 0) => {
  if (total > 0) {
    return `Cadangan kerja baik pulih dengan anggaran kos sebanyak RM ${total.toLocaleString(
      "ms-MY",
      { minimumFractionDigits: 2 }
    )} adalah berpatutan dan dicadangkan untuk kelulusan.`;
  }
  return "";
};

// Helper functions for dynamic signature display
const getCurrentStageDisplay = () => {
  const stageMap = {
    disediakan: "Anda: Disediakan",
    disemak1: "Anda: Disemak 1",
    disemak2: "Anda: Disemak 2",
    diluluskan: "Anda: Diluluskan",
  };
  return stageMap[currentStage.value] || "Status tidak diketahui";
};

const getWorkflowStatusMessage = () => {
  const messages = {
    disediakan:
      "Dokumen BQ ini sedang dalam peringkat <strong>Disediakan</strong>. Setelah selesai disediakan, dokumen akan dikirim untuk semakan dan kelulusan mengikut hierarki yang ditetapkan.",
    disemak1:
      "Dokumen BQ ini sedang dalam peringkat <strong>Disemak 1</strong>. Sila semak kandungan dokumen dan berikan persetujuan atau komen untuk tindakan lanjut.",
    disemak2:
      "Dokumen BQ ini sedang dalam peringkat <strong>Disemak 2</strong>. Sila semak kandungan dokumen dan berikan persetujuan atau komen untuk tindakan lanjut.",
    diluluskan:
      "Dokumen BQ ini sedang dalam peringkat <strong>Kelulusan</strong>. Sila semak keseluruhan dokumen untuk kelulusan akhir.",
  };
  return messages[currentStage.value] || "Status aliran kerja tidak diketahui.";
};

// Computed properties
const subtotal = computed(() => {
  return formData.value.itemKerja.reduce((total, item) => {
    const kuantiti = Number(item.kuantiti) || 0;
    const kadar = Number(item.kadar) || 0;
    return total + kuantiti * kadar;
  }, 0);
});

// Watch for subtotal changes and auto-update totals
watch(
  subtotal,
  (newValue) => {
    formData.value.jumlahKeseluruhan = newValue;
    formData.value.ringgiMalaysiaPerkataan = numberToWords(newValue);
    // Only auto-generate catatan if it's empty (don't overwrite user input)
    if (!formData.value.catatanPengesyoran || formData.value.catatanPengesyoran.trim() === '') {
      formData.value.catatanPengesyoran = generateCatatanPengesyoran(newValue);
    }
  },
  { immediate: true }
);

// Update totals function (now mainly for manual triggers)
const updateTotals = () => {
  // This will trigger the watcher above
  const currentSubtotal = subtotal.value;
  formData.value.jumlahKeseluruhan = currentSubtotal;
};

// Function to auto-populate data based on jenis kerja selection
const handleJenisKerjaChange = (item, index) => {
  if (item.jenisKerja && jenisKerjaData[item.jenisKerja]) {
    const data = jenisKerjaData[item.jenisKerja];
    item.keteranganKerja = data.keteranganKerja;
    item.unit = data.unit;
    item.kadar = data.kadar;
    // Trigger total update
    updateTotals();
  }
};

// Item management methods
const addItem = () => {
  formData.value.itemKerja.push({
    ref: "CMP",
    keteranganKerja: "",
    jenisKerja: "",
    unit: "",
    kuantiti: 1,
    kadar: 0,
  });
};

const removeItem = (index) => {
  if (index >= 0 && index < formData.value.itemKerja.length) {
    formData.value.itemKerja.splice(index, 1);
  }
};

// Action handlers
const handleSaveDraft = async () => {
  if (processing.value) return;

  try {
    processing.value = true;

    // Validate required fields
    if (!formData.value.tarikhSiasatan) {
      toast.error("Sila pilih tarikh siasatan");
      return;
    }

    if (!formData.value.catatanPengesyoran || formData.value.catatanPengesyoran.trim() === '') {
      toast.error("Sila masukkan catatan pengesyoran");
      return;
    }

    // Implement save draft functionality
    console.log("Saving BQ draft:", formData.value);

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    toast.success("Draf BQ telah disimpan berjaya");
  } catch (error) {
    toast.error("Ralat semasa menyimpan draf BQ");
    console.error("Save draft error:", error);
  } finally {
    processing.value = false;
  }
};

const handleGeneratePDF = async () => {
  if (processing.value) return;

  try {
    processing.value = true;

    // Validate that we have items
    if (formData.value.itemKerja.length === 0) {
      toast.error("Sila tambah sekurang-kurangnya satu item kerja");
      return;
    }

    // Show PDF preview modal
    showPDFModal.value = true;
  } catch (error) {
    toast.error("Ralat semasa membuka pratonton PDF");
    console.error("PDF preview error:", error);
  } finally {
    processing.value = false;
  }
};

const generateActualPDF = async () => {
  try {
    processing.value = true;

    // Implement actual PDF generation functionality
    console.log("Generating actual PDF for BQ:", formData.value);

    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate PDF generation
    toast.success("PDF BQ telah dijana berjaya");
    showPDFModal.value = false;
  } catch (error) {
    toast.error("Ralat semasa menjana PDF BQ");
    console.error("PDF generation error:", error);
  } finally {
    processing.value = false;
  }
};

const handleSaveAndReturn = async () => {
  if (processing.value) return;

  try {
    await handleSaveDraft();
    if (!processing.value) {
      // Only navigate if save was successful
      handleBack();
    }
  } catch (error) {
    console.error("Save and return error:", error);
  }
};

const handleBack = () => {
  router.push(`/BF-BTN/tugasan/bantuan/siasatan/${route.params.id}`);
};

// Generate unique IDs
const generateBQNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `BQ${year}${month}${random}`;
};

const generateBRNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `BR-${year}-${random}`;
};

// Initialize form data
const initializeFormData = () => {
  const today = new Date();
  const currentUser = "Ahmad bin Ali"; // This would come from authentication system

  const baseData = {
    noBQ: generateBQNumber(),
    noBR: generateBRNumber(),
    namaPemohon: "Mohd Rosli Bin Saad",
    alamat: "Jalan Rajawali, Kampung Bukit Kuching, 45800 Jeram",
    tarikhSiasatan: today.toISOString().split("T")[0],
    itemKerja: [],
    jumlahKeseluruhan: 0,
    ringgiMalaysiaPerkataan: "",
    catatanPengesyoran: "",
    disediakanOleh: currentUser,
    disemak1: "",
    disemak2: "",
    diluluskan: "",
    tarikhDisemak1: "",
    tarikhDisemak2: "",
    tarikhDisahkan: "",
  };

  // Add sample data if editing
  if (editingBQ.value) {
    baseData.itemKerja = [
      {
        ref: "CMP",
        keteranganKerja: " Membuka,memecah dan membawa keluar keseluruhan struktur binaan rumah kayu,membuka dan memindahkan meter elektrik TNB,papan agihan termasuk semua pendawaian yang berkaitan, membawa bahan-bahan buangan pembinaan ke lokasi yang ditentukan sehingga sempurna mengikut arahan Pegawai Penguasa.",
        jenisKerja: "roboh_rumah_kayu",
        unit: "Pukal",
        kuantiti: 1,
        kadar: 3000,
      },
      {
        ref: "CMP",
        keteranganKerja: "Membina tambahan bilik berukuran 20' x 15' termasuk kerja-kerja asas cerucuk bakau atau raft foundation, penapak konkrit bertetulang (pad footing), rasuk tanah konkrit bertetulang, tiang konkrit bertetulang, dinding bata berlepa, rasuk bumbung konkrit bertetulang, lantai konkrit bertetulang, kemasan siling, kemasan cat luar & dalam serta kelengkapan berikut :",
        jenisKerja: "bina_semula_bangunan_bilik",
        unit: "Pukal",
        kuantiti: 1,
        kadar: 40000,
      },
             {
         ref: "CMP",
         keteranganKerja: "Bumbung metal deck termasuk struktur jenis sesikat",
        //  jenisKerja: "bina_semula_bangunan_bilik",
        //  unit: "Pukal",
        //  kuantiti: 1,
        //  kadar: 15000,
       },
    ];
  }

  return baseData;
};

// Load existing data on mount
onMounted(async () => {
  try {
    formData.value = initializeFormData();
    // Auto-calculation will be triggered by the watcher
  } catch (error) {
    toast.error("Ralat semasa memuatkan data BQ");
    console.error("Initialization error:", error);
  }
});
</script>

<style lang="scss" scoped>
// Enhanced typography and spacing
.text-3xl {
  letter-spacing: -0.025em;
}

// Improved table styling for better readability
.min-w-full {
  font-size: 0.875rem;

  th {
    font-weight: 600;
    letter-spacing: 0.025em;
  }

  td {
    vertical-align: top;
  }
}

// Enhanced form styling
.formkit-wrapper {
  margin: 0;

  .formkit-input {
    transition: all 0.2s ease-in-out;

    &:focus {
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
}

// Improved number formatting with consistent styling
.currency,
.font-mono {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas,
    "Liberation Mono", Menlo, monospace;
  font-variant-numeric: tabular-nums;
}

// Card hover effects
.rs-card {
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
}

// Icon consistency
.icon {
  flex-shrink: 0;
}

// Responsive button improvements
@media (max-width: 1023px) {
  .rs-button {
    justify-content: center;
    text-align: center;
  }
}

// Focus indicators for better accessibility
button:focus,
.formkit-input:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

// Print styles for PDF generation
@media print {
  .sticky {
    position: static !important;
  }

  .shadow-sm,
  .shadow {
    box-shadow: none !important;
  }

  .bg-gray-50 {
    background-color: #f9fafb !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
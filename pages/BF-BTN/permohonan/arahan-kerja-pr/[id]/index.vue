<template>
  <div class="min-h-screen">
    <div class="  ">
      <LayoutsBreadcrumb :items="breadcrumb" />

      <!-- Page Header -->
      <div class="mt-6 mb-8">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Semakan Dokumen PR (Pegawai Teknikal)
            </h1>
            <p class="mt-1 text-sm text-gray-600">
              Semak dan lengkapkan dokumen PR (Perakuan Rundingan) untuk arahan
              kerja permohonan bantuan
            </p>
          </div>
          <rs-badge
            :variant="getStatusVariant(permohonanData.status)"
            class="text-sm px-4 py-2"
          >
            {{ permohonanData.status }}
          </rs-badge>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Section 1: Maklumat Permohonan (Read-only) -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:file-text" class="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Maklumat Permohonan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Butiran asas permohonan bantuan (Paparan sahaja)
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >ID Permohonan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm font-mono text-gray-900">{{
                      formData.idPermohonan
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Nama Pemohon / Institusi</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      formData.namaPemohon
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Jenis Bantuan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      formData.jenisBantuan
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Status Permohonan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      formData.statusPermohonan
                    }}</span>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Section 2: Dokumen PR -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div
                      class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                    >
                      <Icon name="ph:file-doc" class="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900">
                      Dokumen PR (Perakuan Rundingan)
                    </h2>
                    <p class="text-sm text-gray-500">
                      Akses dokumen PR untuk semakan dan kemaskini
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <rs-badge
                    :variant="getPRStatusVariant(formData.statusPR)"
                    class="text-xs px-3 py-1"
                  >
                    {{ formData.statusPR }}
                  </rs-badge>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-6">
                <!-- PR Document Preview -->
                <div class="border border-gray-200 rounded-lg">
                  <div
                    class="bg-gray-50 p-4 border-b border-gray-200 flex flex-col gap-2"
                  >
                    <div class="flex items-center">
                      <Icon
                        name="ph:file-doc"
                        class="text-blue-600 mr-3"
                        size="24"
                      />
                      <div>
                        <h4 class="font-medium text-gray-900">
                          {{ formData.namaDokumenPR }}
                        </h4>
                        <p class="text-sm text-gray-500">
                          {{ formData.jenisDokumen }}
                        </p>
                      </div>
                    </div>
                    <div class="flex space-x-2">
                      <div class="flex space-x-2">
                        <rs-button
                          variant="primary"
                          @click="previewPR"
                          class="!py-2 !px-4"
                        >
                          <Icon name="ph:eye" class="w-4 h-4 mr-2" />
                          Preview PR
                        </rs-button>

                        <rs-button
                          variant="success"
                          @click="generateArahanKerja"
                          class="!py-2 !px-4"
                        >
                          <Icon name="ph:file-plus" class="w-4 h-4 mr-2" />
                          Jana Arahan Kerja
                        </rs-button>
                      </div>
                    </div>
                  </div>

                  <div class="p-4 bg-white">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span class="font-medium text-gray-700"
                          >Tarikh Dijana:</span
                        >
                        <span class="ml-2 text-gray-900">{{
                          formatDate(formData.tarikhDijana)
                        }}</span>
                      </div>
                      <div>
                        <span class="font-medium text-gray-700"
                          >Tarikh Kemaskini Terakhir:</span
                        >
                        <span class="ml-2 text-gray-900">{{
                          formatDate(formData.tarikhKemaskiniTerakhir)
                        }}</span>
                      </div>
                      <div>
                        <span class="font-medium text-gray-700"
                          >Tarikh Penyerahan:</span
                        >
                        <span class="ml-2 text-gray-900">{{
                          formatDate(formData.tarikhPenyerahan)
                        }}</span>
                      </div>
                      <div>
                        <span class="font-medium text-gray-700">Alamat:</span>
                        <span class="ml-2 text-gray-900">{{
                          formData.alamatPenerima
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- PR Section Status -->
                <!-- <div class="space-y-4">
                  <h3 class="text-sm font-medium text-gray-900">
                    Status Seksyen Dokumen PR
                  </h3>

                  <div class="space-y-3">
                    <div
                      v-for="(section, index) in prSections"
                      :key="index"
                      class="flex items-center justify-between p-3 border rounded-lg"
                      :class="getSectionBorderClass(section.status)"
                    >
                      <div class="flex items-center space-x-3">
                        <div
                          class="w-2 h-2 rounded-full"
                          :class="getSectionStatusColor(section.status)"
                        ></div>
                        <div>
                          <h4 class="text-sm font-medium text-gray-900">
                            {{ section.name }}
                          </h4>
                          <p class="text-xs text-gray-500">
                            {{ section.description }}
                          </p>
                        </div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <rs-badge
                          :variant="getAccessVariant(section.accessText)"
                          class="text-xs px-2 py-1"
                        >
                          {{ section.accessText }}
                        </rs-badge>
                        <rs-badge
                          :variant="getSectionStatusVariant(section.status)"
                          class="text-xs"
                        >
                          {{ section.statusText }}
                        </rs-badge>
                      </div>
                    </div>
                  </div>
                </div> -->

                <!-- Work Items Management Section -->
                <div class="space-y-4">
                  <h3
                    class="text-sm font-medium text-gray-900 flex items-center"
                  >
                    <Icon
                      name="ph:list-checks"
                      class="w-4 h-4 mr-2 text-blue-600"
                    />
                    Jadual Arahan Kerja (dari BQ)
                  </h3>

                  <div
                    class="overflow-hidden border border-gray-200 rounded-lg"
                  >
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th
                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Butiran Kerja
                          </th>
                          <th
                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Kuantiti
                          </th>
                          <th
                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Jumlah (RM)
                          </th>
                          <th
                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status ETD
                          </th>
                          <th
                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Catatan KIV
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr
                          v-for="item in workItems"
                          :key="item.id"
                          class="hover:bg-gray-50"
                        >
                          <td class="px-4 py-3">
                            <div class="text-sm font-medium text-gray-900">
                              {{ item.description }}
                            </div>
                            <div class="text-xs text-gray-500">
                              {{ item.unitPrice }} per unit
                            </div>
                          </td>
                          <td class="px-4 py-3 text-sm text-gray-900">
                            {{ item.quantity }}
                          </td>
                          <td
                            class="px-4 py-3 text-sm font-medium text-gray-900"
                          >
                            {{ item.totalPrice }}
                          </td>
                          <td class="px-4 py-3">
                            <select
                              v-model="item.status"
                              @change="updateWorkItemStatus(item)"
                              class="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option
                                v-for="option in workItemStatusOptions"
                                :key="option.value"
                                :value="option.value"
                              >
                                {{ option.label }}
                              </option>
                            </select>
                            <rs-badge
                              :variant="getWorkItemStatusVariant(item.status)"
                              class="text-xs ml-2"
                            >
                              {{ getWorkItemStatusText(item.status) }}
                            </rs-badge>
                          </td>
                          <td class="px-4 py-3">
                            <textarea
                              v-if="item.status === 'kiv'"
                              v-model="item.kivRemarks"
                              placeholder="Catatan KIV..."
                              rows="2"
                              class="text-xs w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                            <span v-else class="text-xs text-gray-400">-</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Progress Indicators -->
                <div class="space-y-4">
                  <!-- PR Sections Progress -->
                  <div class="space-y-2">
                    <div class="flex justify-between text-sm text-gray-600">
                      <span>Progress Seksyen PR</span>
                      <span
                        >{{ completedSections }} /
                        {{ prSections.length }} Seksyen</span
                      >
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        :style="{
                          width: `${
                            (completedSections / prSections.length) * 100
                          }%`,
                        }"
                      ></div>
                    </div>
                  </div>

                  <!-- Work Items Progress -->
                  <div class="space-y-2">
                    <div class="flex justify-between text-sm text-gray-600">
                      <span>Progress Item Kerja</span>
                      <span
                        >{{ completedWorkItems }} /
                        {{ workItems.length }} Item</span
                      >
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-green-500 h-2 rounded-full transition-all duration-300"
                        :style="{
                          width: `${workItemsProgress}%`,
                        }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Section 3: Catatan BQ dan Rujukan -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:calculator"
                      class="w-6 h-6 text-purple-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Rujukan BQ & Catatan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Maklumat BQ dan catatan untuk PR
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-4">
                <!-- BQ Reference -->
                <div class="space-y-1">
                  <label
                    class="text-sm font-medium text-gray-700 flex items-center"
                  >
                    <Icon
                      name="ph:file-text"
                      class="w-4 h-4 mr-2 text-blue-600"
                    />
                    Rujukan BQ
                  </label>
                  <div
                    class="mt-1 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="text-sm font-medium text-blue-800">
                          {{ formData.bqReference }}
                        </div>
                        <div class="text-xs text-blue-600">
                          Jumlah Anggaran: RM {{ formData.bqAmount }}
                        </div>
                      </div>
                      <rs-button
                        variant="primary-outline"
                        size="sm"
                        @click="viewBQ"
                        class="!py-1 !px-3"
                      >
                        <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                        Lihat BQ
                      </rs-button>
                    </div>
                  </div>
                </div>

                <!-- Work Items from BQ -->
                <div class="space-y-1">
                  <label
                    class="text-sm font-medium text-gray-700 flex items-center"
                  >
                    <Icon
                      name="ph:list-checks"
                      class="w-4 h-4 mr-2 text-green-600"
                    />
                    Item Kerja (dari BQ)
                  </label>
                  <div
                    class="mt-1 p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div class="text-sm text-green-800">
                      <div class="font-medium mb-2">
                        Jadual Arahan Kerja akan dipetakan dari BQ
                      </div>
                      <div class="text-xs text-green-600">
                        {{ formData.workItemsCount }} item kerja tersedia untuk
                        semakan dalam PR
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </div>

        <!-- Sidebar - Section 4: Tindakan ETD -->
        <div class="lg:col-span-1 space-y-6">
          <rs-card class="shadow-sm border-0 bg-white sticky top-6">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:user-gear" class="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Tindakan ETD
                  </h2>
                  <p class="text-sm text-gray-500">
                    Status semakan dan tindakan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <FormKit
                type="form"
                :actions="false"
                @submit="handleSubmit"
                v-model="formData"
              >
                <div class="space-y-6">
                  <!-- Review Status -->
                  <div class="space-y-1">
                    <FormKit
                      type="select"
                      name="statusSemakan"
                      label="Status Semakan PR"
                      :options="statusSemakanOptions"
                      validation="required"
                      :validation-messages="{
                        required: 'Sila pilih status semakan',
                      }"
                      placeholder="Pilih status semakan"
                      :classes="{ outer: 'mb-0' }"
                    />
                  </div>

                  <!-- Technical Notes -->
                  <div class="space-y-1">
                    <FormKit
                      type="textarea"
                      name="catatanTeknikal"
                      label="Catatan Teknikal ETD"
                      placeholder="Masukkan catatan teknikal dan ulasan semakan..."
                      rows="4"
                      :classes="{ outer: 'mb-0' }"
                    />
                  </div>

                  <!-- KIV Items (conditional) -->
                  <div
                    v-if="formData.statusSemakan === 'perlu_tindakan'"
                    class="space-y-1"
                  >
                    <FormKit
                      type="textarea"
                      name="itemKIV"
                      label="Item yang Perlu Tindakan (KIV)"
                      validation="required"
                      :validation-messages="{
                        required: 'Item KIV diperlukan untuk status ini',
                      }"
                      placeholder="Senaraikan item yang perlu tindakan lanjut..."
                      rows="3"
                      :classes="{ outer: 'mb-0' }"
                    />
                  </div>

                  <!-- Status Display -->
                  <div
                    v-if="formData.statusSemakan"
                    class="p-4 rounded-lg border"
                    :class="getStatusDisplayClass()"
                  >
                    <div class="flex items-center space-x-2">
                      <Icon
                        :name="getStatusIcon()"
                        class="w-5 h-5"
                        :class="getStatusIconClass()"
                      />
                      <span
                        class="text-sm font-medium"
                        :class="getStatusTextClass()"
                      >
                        Status: {{ getStatusDisplayText() }}
                      </span>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="space-y-3 pt-4 border-t">
                    <rs-button
                      variant="primary"
                      @click="handleSubmit"
                      :disabled="!isFormValid"
                      class="w-full !py-3 text-sm font-medium"
                    >
                      <Icon name="ph:check-circle" class="w-5 h-5 mr-2" />
                      Simpan Semakan
                    </rs-button>

                    <rs-button
                      variant="secondary"
                      @click="previewPR"
                      class="w-full !py-3 text-sm font-medium"
                    >
                      <Icon name="ph:file-text" class="w-5 h-5 mr-2" />
                      Buka Editor PR
                    </rs-button>

                    <rs-button
                      variant="primary-outline"
                      @click="handleCancel"
                      class="w-full !py-3 text-sm font-medium"
                    >
                      <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
                      Kembali
                    </rs-button>
                  </div>

                  <!-- Validation Status -->
                  <div
                    v-if="!isFormValid"
                    class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                  >
                    <div class="flex">
                      <Icon
                        name="ph:warning"
                        class="w-5 h-5 text-yellow-400 mt-0.5"
                      />
                      <div class="ml-3">
                        <h3 class="text-sm font-medium text-yellow-800">
                          Semakan Diperlukan
                        </h3>
                        <p class="mt-1 text-xs text-yellow-700">
                          Sila lengkapkan status semakan sebelum menyimpan.
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Review Info -->
                  <div class="space-y-3 pt-4 border-t">
                    <div class="space-y-1">
                      <label class="text-sm font-medium text-gray-700"
                        >Pegawai ETD</label
                      >
                      <div
                        class="mt-1 p-2 bg-gray-50 rounded-lg border text-sm text-gray-900"
                      >
                        {{ formData.namaPegawaiETD }}
                      </div>
                    </div>

                    <div class="space-y-1">
                      <label class="text-sm font-medium text-gray-700"
                        >Tarikh Semakan</label
                      >
                      <div
                        class="mt-1 p-2 bg-gray-50 rounded-lg border text-sm text-gray-900"
                      >
                        {{ formatDateTime(new Date()) }}
                      </div>
                    </div>
                  </div>
                </div>
              </FormKit>
            </template>
          </rs-card>

          <!-- PR Status Flow & Audit Log -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:flow-arrow"
                      class="w-6 h-6 text-indigo-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Status & Audit Log
                  </h2>
                  <p class="text-sm text-gray-500">
                    Aliran status dan jejak audit
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-6">
                <!-- PR Status Flow -->
                <div class="space-y-3">
                  <h3 class="text-sm font-medium text-gray-900">
                    Aliran Status PR
                  </h3>
                  <div class="flex items-center space-x-2">
                    <div
                      v-for="(status, index) in prStatusFlow"
                      :key="status.value"
                      class="flex items-center"
                    >
                      <div
                        class="flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium"
                        :class="
                          getPRStatusClass(status.value, formData.statusPR)
                        "
                      >
                        {{ index + 1 }}
                      </div>
                      <div class="ml-2 mr-4">
                        <div
                          class="text-xs font-medium"
                          :class="
                            getPRStatusTextClass(
                              status.value,
                              formData.statusPR
                            )
                          "
                        >
                          {{ status.label }}
                        </div>
                      </div>
                      <Icon
                        v-if="index < prStatusFlow.length - 1"
                        name="ph:arrow-right"
                        class="w-4 h-4 text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                <!-- Current Status Display -->
                <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div class="flex items-center space-x-2">
                    <Icon name="ph:clock" class="w-4 h-4 text-blue-600" />
                    <span class="text-sm font-medium text-blue-800">
                      Status Semasa: {{ getCurrentPRStatusLabel() }}
                    </span>
                  </div>
                  <div
                    v-if="formData.tarikhPenyerahan"
                    class="mt-2 text-xs text-blue-600"
                  >
                    Diserahkan pada:
                    {{ formatDateTime(formData.tarikhPenyerahan) }}
                  </div>
                </div>

                <!-- Audit Log -->
                <div class="space-y-3">
                  <h3 class="text-sm font-medium text-gray-900">Log Audit</h3>
                  <div class="space-y-2 max-h-64 overflow-y-auto">
                    <div
                      v-for="log in auditLog"
                      :key="log.id"
                      class="p-3 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <div class="text-sm font-medium text-gray-900">
                            {{ log.action }}
                          </div>
                          <div class="text-xs text-gray-600 mt-1">
                            {{ log.description }}
                          </div>
                          <div class="flex items-center space-x-2 mt-2">
                            <span class="text-xs text-gray-500">
                              {{ log.user }} ({{ log.userRole }})
                            </span>
                            <span class="text-xs text-gray-400">•</span>
                            <span class="text-xs text-gray-500">
                              {{ formatDateTime(log.timestamp) }}
                            </span>
                          </div>
                        </div>
                        <Icon
                          name="ph:clock-clockwise"
                          class="w-4 h-4 text-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Semakan Disimpan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-6">
          <div class="text-center">
            <div
              class="mx-auto flex items-center justify-center h-16 w-16 rounded-full"
              :class="getSuccessModalIconClass()"
            >
              <Icon :name="getSuccessModalIcon()" class="h-8 w-8" />
            </div>
            <h3 class="mt-4 text-lg font-semibold text-gray-900">
              Semakan PR Disimpan
            </h3>
            <p class="mt-2 text-sm text-gray-600">
              Status semakan dokumen PR telah berjaya disimpan dan direkodkan.
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700"
                >ID Permohonan:</span
              >
              <span class="text-sm font-mono text-gray-900">{{
                formData.idPermohonan
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700"
                >Status Semakan:</span
              >
              <rs-badge
                :variant="getStatusBadgeVariant(formData.statusSemakan)"
                class="text-xs"
              >
                {{ getStatusDisplayText() }}
              </rs-badge>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700"
                >Tarikh Semakan:</span
              >
              <span class="text-sm text-gray-900">{{
                formatDateTime(new Date())
              }}</span>
            </div>
          </div>

          <div
            class="p-4 border rounded-lg"
            :class="getSuccessModalMessageClass()"
          >
            <p class="text-sm flex items-center">
              <Icon
                :name="getSuccessModalIcon()"
                class="w-5 h-5 mr-2 flex-shrink-0"
              />
              {{ getSuccessMessage() }}
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="handleBackToList">
            OK
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- PR Preview Modal -->
    <rs-modal
      v-model="showPRModal"
      title="Preview Dokumen PR"
      size="xl"
      position="center"
    >
      <template #body>
        <div class="space-y-6">
          <div class="text-center p-8 bg-gray-50 rounded-lg">
            <Icon name="ph:file-doc" size="64" class="text-gray-400 mb-4" />
            <p class="text-gray-600 mb-2">
              Editor dokumen PR akan dibuka dalam tab baharu
            </p>
            <p class="text-sm text-gray-500">
              Dalam sistem operasi sebenar, editor PR akan membolehkan:
            </p>
            <ul class="text-sm text-gray-500 mt-2 text-left max-w-md mx-auto">
              <li>• Pengisian maklumat kontraktor</li>
              <li>• Tandatangan digital</li>
              <li>• Jadual arahan kerja (dari BQ)</li>
              <li>• Catatan KIV (jika ada)</li>
              <li>• Pengesahan ETD dan Pemohon</li>
            </ul>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-between">
          <rs-button variant="primary-outline" @click="downloadPR">
            <Icon name="ph:download" class="mr-1" size="16" />
            Muat Turun PR
          </rs-button>
          <rs-button variant="primary" @click="showPRModal = false">
            Tutup
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Arahan Kerja Modal -->
    <rs-modal
      v-model="showArahanKerjaModal"
      title="Jana Dokumen Arahan Kerja"
      size="xl"
      position="center"
    >
      <template #body>
        <div class="space-y-6">
          <!-- Form Preview -->
          <div class="border border-gray-200 rounded-lg p-6 bg-white">
            <div class="text-center mb-6">
              <h2 class="text-lg font-bold text-gray-900">
                ARAHAN KERJA BAGI MEMBINA / BAIK PULIH
              </h2>
              <p class="text-sm text-blue-600 font-medium mt-1">
                MASJID / SURAU / SEKOLAH / SURAU-SEKOLAH / RUMAH / PREMIS /
                KEDAI
              </p>
            </div>

            <!-- Recipient Information -->
            <div class="space-y-3 mb-6">
              <div class="flex">
                <span class="w-32 text-sm font-medium text-gray-700"
                  >Nama Penerima</span
                >
                <span class="text-sm text-gray-900"
                  >: {{ formData.namaPenerima }}</span
                >
              </div>
              <div class="flex">
                <span class="w-32 text-sm font-medium text-gray-700"
                  >Alamat</span
                >
                <span class="text-sm text-gray-900"
                  >: {{ formData.alamatPenerima }}</span
                >
              </div>
            </div>

            <!-- Contractor Acknowledgment Section -->
            <div class="border border-gray-300 rounded-lg p-4 mb-6">
              <h3 class="font-bold text-gray-900 mb-3">
                PENGAKUAN KONTRAKTOR (Diisi oleh kontraktor)
              </h3>
              <div class="bg-gray-50 p-3 rounded text-sm text-gray-700 mb-4">
                <p>
                  Saya..................................no.kp.
                  ..........................................
                </p>
                <p class="mt-2">
                  Kontraktor / Ketua tukang yang telah ditawarkan oleh Lembaga
                  Zakat Selangor MAIS bagi membaik pulih / membina kerja-kerja
                  di atas yang ditawarkan mengaku telah memahami peraturan dan
                  arahan kerja yang dikeluarkan dan akan menjamin memperbaiki
                  semua terhadap apa-apa kerosakan dalam tempoh 3 bulan dari
                  tarikh pengesahan kerja. Saya juga bersedia untuk menerima
                  apa-apa teguran dan ketidakpuasan hati dari mana-mana Pegawai
                  Penguasa atau wakil Lembaga Zakat Selangor sekiranya saya
                  tidak mematuhi arahan kerja yang dikeluarkan.
                </p>
                <p class="mt-4 text-center">Di akui benar,</p>
                <div class="mt-8 text-center">
                  <div class="border-b border-gray-400 w-64 mx-auto mb-2"></div>
                  <p class="text-sm">(T.T KONTRAKTOR & COP)</p>
                </div>
              </div>
            </div>

            <!-- Work Items Table -->
            <div class="border border-gray-300 rounded-lg overflow-hidden">
              <div class="bg-gray-100 p-3 text-center">
                <h3 class="font-bold text-gray-900">UNTUK KEGUNAAN PEJABAT</h3>
              </div>

              <div class="p-4">
                <p class="text-sm text-gray-700 mb-4">
                  <strong
                    >ARAHAN KERJA INI MESTILAH DIPATUHI OLEH KONTRAKTOR</strong
                  >
                  <span class="float-right"
                    >Tarikh semakan: {{ formatDate(new Date()) }}</span
                  >
                </p>

                <table class="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr class="bg-gray-50">
                      <th
                        class="border border-gray-300 p-2 text-left text-sm font-medium"
                      >
                        BIL
                      </th>
                      <th
                        class="border border-gray-300 p-2 text-left text-sm font-medium"
                      >
                        PERKARA
                      </th>
                      <th
                        class="border border-gray-300 p-2 text-left text-sm font-medium"
                      >
                        UNIT
                      </th>
                      <th
                        class="border border-gray-300 p-2 text-left text-sm font-medium"
                      >
                        KUANTITI
                      </th>
                      <th
                        class="border border-gray-300 p-2 text-left text-sm font-medium"
                      >
                        STATUS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in workItems" :key="item.id">
                      <td class="border border-gray-300 p-2 text-sm">
                        {{ index + 1 }}
                      </td>
                      <td class="border border-gray-300 p-2 text-sm">
                        {{ item.description }}
                      </td>
                      <td class="border border-gray-300 p-2 text-sm">
                        {{ item.quantity.split(" ").pop() }}
                      </td>
                      <td class="border border-gray-300 p-2 text-sm">
                        {{ item.quantity.split(" ").slice(0, -2).join(" ") }}
                      </td>
                      <td class="border border-gray-300 p-2">
                        <div class="flex space-x-2">
                          <label class="flex items-center">
                            <input
                              type="checkbox"
                              :checked="item.status === 'lulus'"
                              disabled
                              class="mr-1"
                            />
                            <span class="text-xs">LULUS</span>
                          </label>
                          <label class="flex items-center">
                            <input
                              type="checkbox"
                              :checked="item.status === 'gagal'"
                              disabled
                              class="mr-1"
                            />
                            <span class="text-xs">GAGAL</span>
                          </label>
                        </div>
                        <div
                          v-if="item.status === 'kiv'"
                          class="text-xs text-orange-600 mt-1"
                        >
                          KIV: {{ item.kivRemarks }}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Footer -->
            <div class="mt-6 text-center">
              <p class="text-xs text-gray-500">
                {{ formData.idPermohonan }} - {{ formatDate(new Date()) }}
              </p>
            </div>
          </div>

          <!-- Generation Info -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center space-x-2">
              <Icon name="ph:info" class="w-5 h-5 text-blue-600" />
              <div>
                <h4 class="text-sm font-medium text-blue-800">
                  Maklumat Penjanaan
                </h4>
                <ul class="text-xs text-blue-700 mt-1 space-y-1">
                  <li>• Dokumen akan dijanakan dalam format PDF</li>
                  <li>
                    • Status item kerja akan dipaparkan berdasarkan semakan ETD
                  </li>
                  <li>
                    • Kontraktor perlu mengisi bahagian pengakuan secara manual
                  </li>
                  <li>
                    • Dokumen ini akan menjadi rujukan rasmi untuk pelaksanaan
                    kerja
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-between">
          <div class="flex space-x-2">
            <rs-button variant="primary-outline" @click="printArahanKerja">
              <Icon name="ph:printer" class="mr-1" size="16" />
              Cetak
            </rs-button>
            <rs-button variant="primary-outline" @click="downloadArahanKerja">
              <Icon name="ph:download" class="mr-1" size="16" />
              Muat Turun PDF
            </rs-button>
          </div>
          <rs-button variant="primary" @click="showArahanKerjaModal = false">
            Tutup
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

definePageMeta({
  title: "Semakan Dokumen PR (Pegawai Teknikal)",
});

const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/permohonan/senarai-untuk-disemak",
  },
  {
    name: "Arahan Kerja",
    type: "link",
    path: "/BF-BTN/permohonan/arahan-kerja-pr",
  },
  {
    name: "Semakan Dokumen PR",
    type: "current",
    path: `/BF-BTN/permohonan/arahan-kerja-pr/${route.params.id}`,
  },
]);

// Mock data - would be replaced with API call
const permohonanData = ref({
  status: "Untuk Semakan PR",
});

// Form data
const formData = ref({
  // Section 1: Maklumat Permohonan (Read-only)
  idPermohonan: "NAS-2025-0001",
  namaPemohon: "Masjid Al-Ikhlas / Selangor",
  jenisBantuan: "Bantuan Pembaikan & Penyelenggaraan",
  statusPermohonan: "Untuk Semakan PR",

  // Section 2: PR Document Info
  namaDokumenPR: "ARAHAN KERJA BAGI MASJID AL-IKHLAS",
  jenisDokumen: "Perakuan Rundingan (PR)",
  statusPR: "Dijanakan",
  tarikhDijana: new Date(),
  tarikhKemaskiniTerakhir: new Date(),
  tarikhPenyerahan: null,
  namaPenerima: "Masjid Al-Ikhlas / Selangor",
  alamatPenerima: "No. 123, Jalan ABC, Taman XYZ, 50000 Kuala Lumpur",

  // Section 3: BQ Reference
  bqReference: "BQ-NAS-2025-0001",
  bqAmount: "15,000.00",
  workItemsCount: 8,

  // Section 4: ETD Actions
  statusSemakan: "",
  catatanTeknikal: "",
  itemKIV: "",
  namaPegawaiETD: "Ahmad bin Hassan (ETD)",
});

// Work Items from BQ with status management
const workItems = ref([
  {
    id: 1,
    description: "Pemasangan bumbung baru (zinc)",
    quantity: "50 meter persegi",
    unitPrice: "RM 25.00",
    totalPrice: "RM 1,250.00",
    status: "pending", // pending, lulus, gagal, kiv
    kivRemarks: "",
  },
  {
    id: 2,
    description: "Pengecatan dinding dalam",
    quantity: "200 meter persegi",
    unitPrice: "RM 8.00",
    totalPrice: "RM 1,600.00",
    status: "pending",
    kivRemarks: "",
  },
  {
    id: 3,
    description: "Pembaikan sistem paip air",
    quantity: "1 set",
    unitPrice: "RM 500.00",
    totalPrice: "RM 500.00",
    status: "pending",
    kivRemarks: "",
  },
  {
    id: 4,
    description: "Pemasangan lampu LED",
    quantity: "20 unit",
    unitPrice: "RM 35.00",
    totalPrice: "RM 700.00",
    status: "pending",
    kivRemarks: "",
  },
]);

// PR Sections configuration - Updated to match documentation
const prSections = ref([
  {
    name: "Nama Dokumen",
    description: "Auto-generated template → ARAHAN KERJA BAGI ...",
    status: "completed",
    statusText: "Siap",
    access: "view",
    accessText: "V",
    accessDescription: "Auto-generated template",
  },
  {
    name: "Nama Penerima",
    description: "Auto-filled from applicant or contractor profile",
    status: "completed",
    statusText: "Siap",
    access: "view",
    accessText: "V",
    accessDescription: "Auto-filled dari profil",
  },
  {
    name: "Alamat",
    description: "Auto-filled from applicant / contractor details",
    status: "completed",
    statusText: "Siap",
    access: "view",
    accessText: "V",
    accessDescription: "Auto-filled dari butiran pemohon",
  },
  {
    name: "Pengakuan Kontraktor",
    description: "To be completed by contractor upon receiving the PR",
    status: "pending",
    statusText: "Menunggu",
    access: "edit",
    accessText: "C/U",
    accessDescription: "Diisi oleh Kontraktor",
  },
  {
    name: "Ruangan Tandatangan & Cop",
    description: "To be signed and stamped post contractor confirmation",
    status: "pending",
    statusText: "Menunggu",
    access: "edit",
    accessText: "C/U",
    accessDescription: "Tandatangan & cop kontraktor",
  },
  {
    name: "Jadual Arahan Kerja",
    description:
      "Pre-filled from BQ → ETD can mark item status as Lulus / Gagal",
    status: "in_progress",
    statusText: "Dalam Kemaskini",
    access: "edit",
    accessText: "C/U/V",
    accessDescription: "ETD boleh mark status item",
  },
  {
    name: "Jadual Catatan (jika KIV)",
    description: "Optional → ETD can add remarks if item status is KIV",
    status: "pending",
    statusText: "Opsional",
    access: "edit",
    accessText: "C/U",
    accessDescription: "Catatan KIV oleh ETD",
  },
  {
    name: "Ruangan Pengesahan ETD",
    description: "Digital signature + stamp by Pegawai Teknikal (ETD)",
    status: "pending",
    statusText: "Menunggu",
    access: "edit",
    accessText: "C/U",
    accessDescription: "Tandatangan digital ETD",
  },
  {
    name: "Ruangan Pengesahan Pemohon",
    description: "Digital signature, full name, and IC number of applicant",
    status: "pending",
    statusText: "Menunggu",
    access: "edit",
    accessText: "C/U",
    accessDescription: "Tandatangan digital Pemohon",
  },
]);

// PR Status Flow - Updated to match documentation
const prStatusFlow = [
  { value: "dijanakan", label: "Dijanakan", color: "blue" },
  { value: "diserahkan", label: "Diserahkan", color: "yellow" },
  { value: "diterima", label: "Diterima", color: "green" },
  { value: "completed", label: "Completed", color: "emerald" },
];

// Audit Log - New functionality
const auditLog = ref([
  {
    id: 1,
    action: "PR Generated",
    description: "Dokumen PR dijanakan dari sistem",
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    user: "System Auto",
    userRole: "System",
  },
  {
    id: 2,
    action: "ETD Review Started",
    description: "Pegawai Teknikal mula semakan dokumen PR",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    user: "Ahmad bin Hassan",
    userRole: "Pegawai Teknikal (ETD)",
  },
]);

// Work Item Status Options
const workItemStatusOptions = [
  { label: "Belum Dinilai", value: "pending" },
  { label: "Lulus", value: "lulus" },
  { label: "Gagal", value: "gagal" },
  { label: "KIV (Keep in View)", value: "kiv" },
];

// Configuration data
const statusSemakanOptions = [
  { label: "-- Pilih Status Semakan --", value: "", disabled: true },
  { label: "Siap untuk Pengesahan", value: "siap_pengesahan" },
  { label: "Perlu Tindakan Lanjut", value: "perlu_tindakan" },
  { label: "Menunggu Input Kontraktor", value: "menunggu_kontraktor" },
];

// Modals
const showSuccessModal = ref(false);
const showPRModal = ref(false);
const showArahanKerjaModal = ref(false);

// Computed
const isFormValid = computed(() => {
  return formData.value.statusSemakan !== "";
});

const completedSections = computed(() => {
  return prSections.value.filter((section) => section.status === "completed")
    .length;
});

const completedWorkItems = computed(() => {
  return workItems.value.filter((item) => item.status !== "pending").length;
});

const workItemsProgress = computed(() => {
  return workItems.value.length > 0
    ? (completedWorkItems.value / workItems.value.length) * 100
    : 0;
});

// Methods for status variants and styling
const getStatusVariant = (status) => {
  const variants = {
    "untuk semakan pr": "warning",
    "pr siap": "success",
    "pr dalam kemaskini": "info",
  };
  return variants[status.toLowerCase()] || "default";
};

const getPRStatusVariant = (status) => {
  const variants = {
    "dalam kemaskini": "warning",
    siap: "success",
    "menunggu pengesahan": "info",
  };
  return variants[status.toLowerCase()] || "default";
};

const getSectionBorderClass = (status) => {
  switch (status) {
    case "completed":
      return "border-green-200 bg-green-50";
    case "in_progress":
      return "border-blue-200 bg-blue-50";
    case "pending":
      return "border-gray-200 bg-gray-50";
    default:
      return "border-gray-200";
  }
};

const getSectionStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-500";
    case "in_progress":
      return "bg-blue-500";
    case "pending":
      return "bg-gray-400";
    default:
      return "bg-gray-400";
  }
};

const getSectionStatusVariant = (status) => {
  switch (status) {
    case "completed":
      return "success";
    case "in_progress":
      return "info";
    case "pending":
      return "secondary";
    default:
      return "default";
  }
};

const getSectionIcon = (access) => {
  switch (access) {
    case "edit":
      return "ph:pencil-simple";
    case "view":
      return "ph:eye";
    default:
      return "ph:circle";
  }
};

const getSectionAccessText = (access) => {
  switch (access) {
    case "edit":
      return "Boleh Edit";
    case "view":
      return "Paparan Sahaja";
    default:
      return "Tidak Diketahui";
  }
};

// Access variant for section badges
const getAccessVariant = (accessText) => {
  switch (accessText) {
    case "V":
      return "secondary";
    case "C/U":
      return "warning";
    case "C/U/V":
      return "info";
    default:
      return "default";
  }
};

// Work item status methods
const getWorkItemStatusVariant = (status) => {
  switch (status) {
    case "lulus":
      return "success";
    case "gagal":
      return "danger";
    case "kiv":
      return "warning";
    case "pending":
      return "secondary";
    default:
      return "default";
  }
};

const getWorkItemStatusText = (status) => {
  switch (status) {
    case "lulus":
      return "Lulus";
    case "gagal":
      return "Gagal";
    case "kiv":
      return "KIV";
    case "pending":
      return "Belum Dinilai";
    default:
      return "Tidak Diketahui";
  }
};

const updateWorkItemStatus = (item) => {
  console.log(`Updating work item ${item.id} status to ${item.status}`);

  // Add audit log entry
  auditLog.value.unshift({
    id: auditLog.value.length + 1,
    action: "Work Item Status Updated",
    description: `Status untuk item "${
      item.description
    }" dikemaskini kepada ${getWorkItemStatusText(item.status)}`,
    timestamp: new Date(),
    user: formData.value.namaPegawaiETD.split(" (")[0],
    userRole: "Pegawai Teknikal (ETD)",
  });

  // If status is not KIV, clear KIV remarks
  if (item.status !== "kiv") {
    item.kivRemarks = "";
  }
};

// PR Status Flow methods
const getPRStatusClass = (statusValue, currentStatus) => {
  const statusIndex = prStatusFlow.findIndex((s) => s.value === statusValue);
  const currentIndex = prStatusFlow.findIndex(
    (s) => s.value === currentStatus.toLowerCase()
  );

  if (statusIndex <= currentIndex) {
    return "bg-blue-500 text-white";
  } else {
    return "bg-gray-200 text-gray-500";
  }
};

const getPRStatusTextClass = (statusValue, currentStatus) => {
  const statusIndex = prStatusFlow.findIndex((s) => s.value === statusValue);
  const currentIndex = prStatusFlow.findIndex(
    (s) => s.value === currentStatus.toLowerCase()
  );

  if (statusIndex <= currentIndex) {
    return "text-blue-700";
  } else {
    return "text-gray-500";
  }
};

const getCurrentPRStatusLabel = () => {
  const status = prStatusFlow.find(
    (s) => s.value === formData.value.statusPR.toLowerCase()
  );
  return status ? status.label : formData.value.statusPR;
};

// Status display methods
const getStatusDisplayClass = () => {
  const status = formData.value.statusSemakan;
  switch (status) {
    case "siap_pengesahan":
      return "bg-green-50 border-green-200";
    case "perlu_tindakan":
      return "bg-yellow-50 border-yellow-200";
    case "menunggu_kontraktor":
      return "bg-blue-50 border-blue-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
};

const getStatusIcon = () => {
  const status = formData.value.statusSemakan;
  switch (status) {
    case "siap_pengesahan":
      return "ph:check-circle";
    case "perlu_tindakan":
      return "ph:warning-circle";
    case "menunggu_kontraktor":
      return "ph:clock";
    default:
      return "ph:circle";
  }
};

const getStatusIconClass = () => {
  const status = formData.value.statusSemakan;
  switch (status) {
    case "siap_pengesahan":
      return "text-green-600";
    case "perlu_tindakan":
      return "text-yellow-600";
    case "menunggu_kontraktor":
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
};

const getStatusTextClass = () => {
  const status = formData.value.statusSemakan;
  switch (status) {
    case "siap_pengesahan":
      return "text-green-800";
    case "perlu_tindakan":
      return "text-yellow-800";
    case "menunggu_kontraktor":
      return "text-blue-800";
    default:
      return "text-gray-800";
  }
};

const getStatusDisplayText = () => {
  const status = formData.value.statusSemakan;
  switch (status) {
    case "siap_pengesahan":
      return "Siap untuk Pengesahan";
    case "perlu_tindakan":
      return "Perlu Tindakan Lanjut";
    case "menunggu_kontraktor":
      return "Menunggu Input Kontraktor";
    default:
      return "";
  }
};

const getStatusBadgeVariant = (status) => {
  switch (status) {
    case "siap_pengesahan":
      return "success";
    case "perlu_tindakan":
      return "warning";
    case "menunggu_kontraktor":
      return "info";
    default:
      return "default";
  }
};

// Success modal methods
const getSuccessModalIcon = () => {
  const status = formData.value.statusSemakan;
  switch (status) {
    case "siap_pengesahan":
      return "ph:check-circle";
    case "perlu_tindakan":
      return "ph:warning-circle";
    case "menunggu_kontraktor":
      return "ph:clock";
    default:
      return "ph:check-circle";
  }
};

const getSuccessModalIconClass = () => {
  const status = formData.value.statusSemakan;
  switch (status) {
    case "siap_pengesahan":
      return "bg-green-100 text-green-600";
    case "perlu_tindakan":
      return "bg-yellow-100 text-yellow-600";
    case "menunggu_kontraktor":
      return "bg-blue-100 text-blue-600";
    default:
      return "bg-green-100 text-green-600";
  }
};

const getSuccessModalMessageClass = () => {
  const status = formData.value.statusSemakan;
  switch (status) {
    case "siap_pengesahan":
      return "bg-green-50 border-green-200 text-green-800";
    case "perlu_tindakan":
      return "bg-yellow-50 border-yellow-200 text-yellow-800";
    case "menunggu_kontraktor":
      return "bg-blue-50 border-blue-200 text-blue-800";
    default:
      return "bg-green-50 border-green-200 text-green-800";
  }
};

const getSuccessMessage = () => {
  const status = formData.value.statusSemakan;
  switch (status) {
    case "siap_pengesahan":
      return "Dokumen PR siap untuk proses pengesahan seterusnya.";
    case "perlu_tindakan":
      return "Item KIV telah direkodkan. Dokumen PR menunggu tindakan lanjut.";
    case "menunggu_kontraktor":
      return "Dokumen PR menunggu input daripada kontraktor.";
    default:
      return "Status semakan telah disimpan dan direkodkan dalam sistem.";
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ms-MY");
};

const formatDateTime = (date) => {
  return new Date(date).toLocaleString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Document and action methods
const previewPR = () => {
  showPRModal.value = true;
  console.log("Opening PR document editor");
  // In real implementation, this would open the PR editor
};

const downloadPR = () => {
  console.log("Downloading PR document");
  // Implement PR document download
};

const viewBQ = () => {
  console.log("Opening BQ document viewer");
  // Navigate to BQ viewing page
  // router.push(`/BF-BTN/permohonan/view-bq/${route.params.id}`);
};

const handleSubmit = () => {
  // Validate form
  if (!isFormValid.value) {
    return;
  }

  // Additional validation for KIV items
  if (
    formData.value.statusSemakan === "perlu_tindakan" &&
    !formData.value.itemKIV.trim()
  ) {
    return;
  }

  // Add audit log entry for form submission
  auditLog.value.unshift({
    id: auditLog.value.length + 1,
    action: "PR Review Completed",
    description: `Semakan PR telah lengkap dengan status: ${getStatusDisplayText()}`,
    timestamp: new Date(),
    user: formData.value.namaPegawaiETD.split(" (")[0],
    userRole: "Pegawai Teknikal (ETD)",
  });

  // Update PR status based on review
  if (formData.value.statusSemakan === "siap_pengesahan") {
    formData.value.statusPR = "Diserahkan";
    formData.value.tarikhPenyerahan = new Date();

    // Add status update to audit log
    auditLog.value.unshift({
      id: auditLog.value.length + 1,
      action: "PR Status Updated",
      description:
        "Status PR dikemaskini kepada 'Diserahkan' untuk proses seterusnya",
      timestamp: new Date(),
      user: "System Auto",
      userRole: "System",
    });
  }

  // Implement form submission
  console.log("Submitting PR review:", formData.value);
  console.log("Work items status:", workItems.value);

  // Show success modal
  showSuccessModal.value = true;

  // Here you would typically:
  // 1. Save review data to database
  // 2. Update PR document status
  // 3. Insert audit trail
  // 4. Trigger next workflow step
  // 5. Send notifications
};

const handleCancel = () => {
  router.push("/BF-BTN/permohonan/arahan-kerja-pr");
};

const handleBackToList = () => {
  showSuccessModal.value = false;
  router.push("/BF-BTN/permohonan/arahan-kerja-pr");
};

const generateArahanKerja = () => {
  showArahanKerjaModal.value = true;
  console.log("Generating ARAHAN KERJA form");

  // Add audit log entry
  auditLog.value.unshift({
    id: auditLog.value.length + 1,
    action: "Arahan Kerja Generated",
    description: "Dokumen Arahan Kerja dijanakan dari sistem",
    timestamp: new Date(),
    user: formData.value.namaPegawaiETD.split(" (")[0],
    userRole: "Pegawai Teknikal (ETD)",
  });
};

const downloadArahanKerja = () => {
  console.log("Downloading ARAHAN KERJA document");
  // Implement ARAHAN KERJA document download
  // This would generate a PDF with the work order form structure
};

const printArahanKerja = () => {
  console.log("Printing ARAHAN KERJA document");
  // Implement ARAHAN KERJA document printing
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

// Progress bar animation
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

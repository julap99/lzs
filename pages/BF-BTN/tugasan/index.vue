<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai</h2>
        </div>
      </template>

      <template #body>
        <!-- Main Tabs -->
        <rs-tab variant="primary" type="card">
          <rs-tab-item title="Profiling" active>
            <!-- Profiling Tab Content -->
            <div>
              <h3 class="text-lg font-semibold mb-4 text-gray-800">
                Profiling Data
              </h3>
              <!-- Applications Table -->
              <rs-table
                :data="filteredApplications"
                :columns="columns"
                :pageSize="pageSize"
                :showNoColumn="true"
                :options="{
                  variant: 'default',
                  hover: true,
                  striped: true,
                }"
                :options-advanced="{
                  sortable: true,
                  filterable: false,
                }"
                advanced
              >
                <template v-slot:status="{ text }">
                  <div class="flex flex-col gap-1">
                    <template v-if="text.includes('\n')">
                      <div
                        v-for="(line, index) in text.split('\n')"
                        :key="index"
                        class="text-xs"
                      >
                        {{ line }}
                      </div>
                    </template>
                    <template v-else>
                      <rs-badge :variant="getStatusVariant(text)">
                        {{ text }}
                      </rs-badge>
                    </template>
                  </div>
                </template>

                <template v-slot:tindakan="{ text }">
                  <div class="flex justify-center items-center gap-2">
                    <rs-button
                      variant="primary"
                      class="p-1 flex gap-2"
                      @click="handleReview(text)"
                    >
                      Semak
                    </rs-button>
                  </div>
                </template>
              </rs-table>

              <!-- Pagination -->
              <div class="flex items-center justify-between px-5 mt-4">
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-700">Baris per halaman:</span>
                  <FormKit
                    v-model="pageSize"
                    type="select"
                    :options="[10, 25, 50]"
                    :classes="{
                      wrapper: 'w-20',
                      outer: 'mb-0',
                      input: '!rounded-lg',
                    }"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-700">
                    Menunjukkan {{ paginationStart }} hingga
                    {{ paginationEnd }} daripada {{ totalApplications }} entri
                  </span>
                  <div class="flex gap-1">
                    <rs-button
                      variant="primary-outline"
                      class="!p-1 !w-8 !h-8"
                      :disabled="currentPage === 1"
                      @click="currentPage--"
                    >
                      <Icon name="ic:round-keyboard-arrow-left" />
                    </rs-button>
                    <rs-button
                      variant="primary-outline"
                      class="!p-1 !w-8 !h-8"
                      :disabled="currentPage === totalPages"
                      @click="currentPage++"
                    >
                      <Icon name="ic:round-keyboard-arrow-right" />
                    </rs-button>
                  </div>
                </div>
              </div>
            </div>
          </rs-tab-item>

          <rs-tab-item title="Bantuan">
            <!-- Bantuan Tab Content with Sub-tabs -->
            <div>
              <!-- <h3 class="text-lg font-semibold mb-4 text-gray-800">
                Bantuan Data
              </h3> -->

              <!-- Simulasi Peranan -->
              <div class="mb-4 flex items-center gap-3">
                <label class="text-sm text-gray-700 font-medium"
                  >Simulasi Peranan</label
                >
                <FormKit
                  v-model="selectedRole"
                  type="select"
                  :options="roleOptions"
                  :classes="{
                    wrapper: 'w-56',
                    outer: 'mb-0',
                    input: '!rounded-lg',
                  }"
                  @change="onChangeSimulasiPeranan"
                />
              </div>

              <!-- Sub-tabs for Bantuan -->
              <rs-tab variant="secondary" type="border" class="mb-6">
                <rs-tab-item title="Permohonan" active v-if="permohonanTable">
                  <!-- Permohonan Sub-tab Content -->
                  <div>
                    <h4 class="text-md font-medium mb-3 text-gray-700">
                      Permohonan
                    </h4>
                    <rs-table
                      :data="filteredPermohonanData"
                      :columns="siasatanColumns"
                      :pageSize="pageSize"
                      :showNoColumn="true"
                      :options="{
                        variant: 'default',
                        hover: true,
                        striped: true,
                      }"
                      :options-advanced="{
                        sortable: true,
                        filterable: false,
                      }"
                      advanced
                    >
                      <template v-slot:status="{ text }">
                        <div class="flex flex-col gap-1">
                          <template v-if="text.includes('\n')">
                            <div
                              v-for="(line, index) in text.split('\n')"
                              :key="index"
                              class="text-xs"
                            >
                              {{ line }}
                            </div>
                          </template>
                          <template v-else>
                            <rs-badge :variant="getStatusVariant(text)">
                              {{ text }}
                            </rs-badge>
                          </template>
                        </div>
                      </template>

                      <template v-slot:tindakan="{ text }">
                        <div class="flex justify-center items-center gap-2">
                          <rs-button
                            variant="primary"
                            class="p-1 flex gap-2"
                            @click="handleReview(text)"
                          >
                            Semak
                          </rs-button>
                        </div>
                      </template>
                    </rs-table>

                    <!-- Pagination -->
                    <div class="flex items-center justify-between px-5 mt-4">
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-700"
                          >Baris per halaman:</span
                        >
                        <FormKit
                          v-model="pageSize"
                          type="select"
                          :options="[10, 25, 50]"
                          :classes="{
                            wrapper: 'w-20',
                            outer: 'mb-0',
                            input: '!rounded-lg',
                          }"
                        />
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-700">
                          Menunjukkan {{ paginationStart }} hingga
                          {{ paginationEndPermohonan }} daripada
                          {{ totalPermohonanData }} entri
                        </span>
                        <div class="flex gap-1">
                          <rs-button
                            variant="primary-outline"
                            class="!p-1 !w-8 !h-8"
                            :disabled="currentPage === 1"
                            @click="currentPage--"
                          >
                            <Icon name="ic:round-keyboard-arrow-left" />
                          </rs-button>
                          <rs-button
                            variant="primary-outline"
                            class="!p-1 !w-8 !h-8"
                            :disabled="currentPage === totalPagesPermohonan"
                            @click="currentPage++"
                          >
                            <Icon name="ic:round-keyboard-arrow-right" />
                          </rs-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </rs-tab-item>

                <rs-tab-item title="Semakan" v-if="semakanTable">
                  <!-- Semakan Sub-tab Content -->
                  <div>
                    <h4 class="text-md font-medium mb-3 text-gray-700">
                      Semakan
                    </h4>
                    <rs-table
                      :data="filteredSemakanData"
                      :columns="siasatanColumns"
                      :pageSize="pageSize"
                      :showNoColumn="true"
                      :options="{
                        variant: 'default',
                        hover: true,
                        striped: true,
                      }"
                      :options-advanced="{
                        sortable: true,
                        filterable: false,
                      }"
                      advanced
                    >
                      <template v-slot:status="{ text }">
                        <div class="flex flex-col gap-1">
                          <template v-if="text.includes('\n')">
                            <div
                              v-for="(line, index) in text.split('\n')"
                              :key="index"
                              class="text-xs"
                            >
                              {{ line }}
                            </div>
                          </template>
                          <template v-else>
                            <rs-badge :variant="getStatusVariant(text)">
                              {{ text }}
                            </rs-badge>
                          </template>
                        </div>
                      </template>

                      <template v-slot:tindakan="{ text }">
                        <div class="flex justify-center items-center gap-2">
                          <rs-button
                            variant="primary"
                            class="p-1 flex gap-2"
                            @click="handleReview(text)"
                          >
                            Semak
                          </rs-button>
                        </div>
                      </template>
                    </rs-table>

                    <!-- Pagination -->
                    <div class="flex items-center justify-between px-5 mt-4">
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-700"
                          >Baris per halaman:</span
                        >
                        <FormKit
                          v-model="pageSize"
                          type="select"
                          :options="[10, 25, 50]"
                          :classes="{
                            wrapper: 'w-20',
                            outer: 'mb-0',
                            input: '!rounded-lg',
                          }"
                        />
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-700">
                          Menunjukkan {{ paginationStart }} hingga
                          {{ paginationEndSemakan }} daripada
                          {{ totalSemakanData }} entri
                        </span>
                        <div class="flex gap-1">
                          <rs-button
                            variant="primary-outline"
                            class="!p-1 !w-8 !h-8"
                            :disabled="currentPage === 1"
                            @click="currentPage--"
                          >
                            <Icon name="ic:round-keyboard-arrow-left" />
                          </rs-button>
                          <rs-button
                            variant="primary-outline"
                            class="!p-1 !w-8 !h-8"
                            :disabled="currentPage === totalPagesSemakan"
                            @click="currentPage++"
                          >
                            <Icon name="ic:round-keyboard-arrow-right" />
                          </rs-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </rs-tab-item>

                <rs-tab-item title="Siasatan" v-if="siasatanTable">
                  <!-- Siasatan Sub-tab Content -->
                  <div>
                    <h4 class="text-md font-medium mb-3 text-gray-700">
                      Siasatan
                    </h4>
                    <rs-table
                      :data="filteredSiasatanData"
                      :columns="siasatanColumns"
                      :pageSize="pageSize"
                      :showNoColumn="true"
                      :options="{
                        variant: 'default',
                        hover: true,
                        striped: true,
                      }"
                      :options-advanced="{
                        sortable: true,
                        filterable: false,
                      }"
                      advanced
                    >
                      <template v-slot:status="{ text }">
                        <div class="flex flex-col gap-1">
                          <template v-if="text.includes('\n')">
                            <div
                              v-for="(line, index) in text.split('\n')"
                              :key="index"
                              class="text-xs"
                            >
                              {{ line }}
                            </div>
                          </template>
                          <template v-else>
                            <rs-badge :variant="getStatusVariant(text)">
                              {{ text }}
                            </rs-badge>
                          </template>
                        </div>
                      </template>

                      <template v-slot:tindakan="{ text, row }">
                        <div class="flex justify-center items-center gap-2">
                          <rs-button
                            variant="primary"
                            size="sm"
                            class="p-1 flex gap-2"
                            @click="handleReview(text)"
                          >
                            Semak
                          </rs-button>
                          <rs-button
                            variant="secondary"
                            size="sm"
                            class="p-1 flex gap-2"
                            @click="openAssignModal(row)"
                          >
                            Tugas Kepada
                          </rs-button>
                        </div>
                      </template>
                    </rs-table>

                    <!-- Pagination -->
                    <div class="flex items-center justify-between px-5 mt-4">
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-700"
                          >Baris per halaman:</span
                        >
                        <FormKit
                          v-model="pageSize"
                          type="select"
                          :options="[10, 25, 50]"
                          :classes="{
                            wrapper: 'w-20',
                            outer: 'mb-0',
                            input: '!rounded-lg',
                          }"
                        />
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-700">
                          Menunjukkan {{ paginationStart }} hingga
                          {{ paginationEnd }} daripada
                          {{ totalSiasatanData }} entri
                        </span>
                        <div class="flex gap-1">
                          <rs-button
                            variant="primary-outline"
                            class="!p-1 !w-8 !h-8"
                            :disabled="currentPage === 1"
                            @click="currentPage--"
                          >
                            <Icon name="ic:round-keyboard-arrow-left" />
                          </rs-button>
                          <rs-button
                            variant="primary-outline"
                            class="!p-1 !w-8 !h-8"
                            :disabled="currentPage === totalPages"
                            @click="currentPage++"
                          >
                            <Icon name="ic:round-keyboard-arrow-right" />
                          </rs-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </rs-tab-item>

                <rs-tab-item title="Sokongan" v-if="sokonganTable">
                  <!-- Sokongan Sub-tab Content -->
                  <div>
                    <h4 class="text-md font-medium mb-3 text-gray-700">
                      Sokongan
                    </h4>
                    <rs-table
                      :data="filteredSokonganData"
                      :columns="siasatanColumns"
                      :pageSize="pageSize"
                      :showNoColumn="true"
                      :options="{
                        variant: 'default',
                        hover: true,
                        striped: true,
                      }"
                      :options-advanced="{
                        sortable: true,
                        filterable: false,
                      }"
                      advanced
                    >
                      <template v-slot:status="{ text }">
                        <div class="flex flex-col gap-1">
                          <template v-if="text.includes('\n')">
                            <div
                              v-for="(line, index) in text.split('\n')"
                              :key="index"
                              class="text-xs"
                            >
                              {{ line }}
                            </div>
                          </template>
                          <template v-else>
                            <rs-badge :variant="getStatusVariant(text)">
                              {{ text }}
                            </rs-badge>
                          </template>
                        </div>
                      </template>

                      <template v-slot:tindakan="{ text }">
                        <div class="flex justify-center items-center gap-2">
                          <rs-button
                            variant="primary"
                            class="p-1 flex gap-2"
                            @click="handleReview(text)"
                          >
                            Semak
                          </rs-button>
                        </div>
                      </template>
                    </rs-table>

                    <!-- Pagination -->
                    <div class="flex items-center justify-between px-5 mt-4">
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-700"
                          >Baris per halaman:</span
                        >
                        <FormKit
                          v-model="pageSize"
                          type="select"
                          :options="[10, 25, 50]"
                          :classes="{
                            wrapper: 'w-20',
                            outer: 'mb-0',
                            input: '!rounded-lg',
                          }"
                        />
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-700">
                          Menunjukkan {{ paginationStart }} hingga
                          {{ paginationEndSokongan }} daripada
                          {{ totalSokonganData }} entri
                        </span>
                        <div class="flex gap-1">
                          <rs-button
                            variant="primary-outline"
                            class="!p-1 !w-8 !h-8"
                            :disabled="currentPage === 1"
                            @click="currentPage--"
                          >
                            <Icon name="ic:round-keyboard-arrow-left" />
                          </rs-button>
                          <rs-button
                            variant="primary-outline"
                            class="!p-1 !w-8 !h-8"
                            :disabled="currentPage === totalPagesSokongan"
                            @click="currentPage++"
                          >
                            <Icon name="ic:round-keyboard-arrow-right" />
                          </rs-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </rs-tab-item>

                <rs-tab-item title="Rework" v-if="reworkTable">
                  <!-- Rework Sub-tab Content -->
                  <div>
                    <h4 class="text-md font-medium mb-3 text-gray-700">
                      Rework
                    </h4>
                    <rs-table
                      :data="filteredReworkData"
                      :columns="siasatanColumns"
                      :pageSize="pageSize"
                      :showNoColumn="true"
                      :options="{
                        variant: 'default',
                        hover: true,
                        striped: true,
                      }"
                      :options-advanced="{
                        sortable: true,
                        filterable: false,
                      }"
                      advanced
                    >
                      <template v-slot:status="{ text }">
                        <div class="flex flex-col gap-1">
                          <template v-if="text.includes('\n')">
                            <div
                              v-for="(line, index) in text.split('\n')"
                              :key="index"
                              class="text-xs"
                            >
                              {{ line }}
                            </div>
                          </template>
                          <template v-else>
                            <rs-badge :variant="getStatusVariant(text)">
                              {{ text }}
                            </rs-badge>
                          </template>
                        </div>
                      </template>

                      <template v-slot:tindakan="{ text }">
                        <div class="flex justify-center items-center gap-2">
                          <rs-button
                            variant="primary"
                            class="p-1 flex gap-2"
                            @click="handleReview(text)"
                          >
                            Semak
                          </rs-button>
                        </div>
                      </template>
                    </rs-table>

                    <!-- Pagination -->
                    <div class="flex items-center justify-between px-5 mt-4">
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-700"
                          >Baris per halaman:</span
                        >
                        <FormKit
                          v-model="pageSize"
                          type="select"
                          :options="[10, 25, 50]"
                          :classes="{
                            wrapper: 'w-20',
                            outer: 'mb-0',
                            input: '!rounded-lg',
                          }"
                        />
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-700">
                          Menunjukkan {{ paginationStart }} hingga
                          {{ paginationEndRework }} daripada
                          {{ totalReworkData }} entri
                        </span>
                        <div class="flex gap-1">
                          <rs-button
                            variant="primary-outline"
                            class="!p-1 !w-8 !h-8"
                            :disabled="currentPage === 1"
                            @click="currentPage--"
                          >
                            <Icon name="ic:round-keyboard-arrow-left" />
                          </rs-button>
                          <rs-button
                            variant="primary-outline"
                            class="!p-1 !w-8 !h-8"
                            :disabled="currentPage === totalPagesRework"
                            @click="currentPage++"
                          >
                            <Icon name="ic:round-keyboard-arrow-right" />
                          </rs-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </rs-tab-item>

                <rs-tab-item title="Kelulusan" v-if="kelulusanTable">
                  <!-- Kelulusan Sub-tab Content -->
                  <div>
                    <h4 class="text-md font-medium mb-3 text-gray-700">
                      Kelulusan
                    </h4>
                    <rs-table
                      :data="filteredKelulusanData"
                      :columns="siasatanColumns"
                      :pageSize="pageSize"
                      :showNoColumn="true"
                      :options="{
                        variant: 'default',
                        hover: true,
                        striped: true,
                      }"
                      :options-advanced="{
                        sortable: true,
                        filterable: false,
                      }"
                      advanced
                    >
                      <template v-slot:status="{ text }">
                        <div class="flex flex-col gap-1">
                          <template v-if="text.includes('\n')">
                            <div
                              v-for="(line, index) in text.split('\n')"
                              :key="index"
                              class="text-xs"
                            >
                              {{ line }}
                            </div>
                          </template>
                          <template v-else>
                            <rs-badge :variant="getStatusVariant(text)">
                              {{ text }}
                            </rs-badge>
                          </template>
                        </div>
                      </template>

                      <template v-slot:tindakan="{ text }">
                        <div class="flex justify-center items-center gap-2">
                          <rs-button
                            variant="primary"
                            class="p-1 flex gap-2"
                            @click="handleReview(text)"
                          >
                            Semak
                          </rs-button>
                        </div>
                      </template>
                    </rs-table>

                    <!-- Pagination -->
                    <div class="flex items-center justify-between px-5 mt-4">
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-700"
                          >Baris per halaman:</span
                        >
                        <FormKit
                          v-model="pageSize"
                          type="select"
                          :options="[10, 25, 50]"
                          :classes="{
                            wrapper: 'w-20',
                            outer: 'mb-0',
                            input: '!rounded-lg',
                          }"
                        />
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-700">
                          Menunjukkan {{ paginationStart }} hingga
                          {{ paginationEndKelulusan }} daripada
                          {{ totalKelulusanData }} entri
                        </span>
                        <div class="flex gap-1">
                          <rs-button
                            variant="primary-outline"
                            class="!p-1 !w-8 !h-8"
                            :disabled="currentPage === 1"
                            @click="currentPage--"
                          >
                            <Icon name="ic:round-keyboard-arrow-left" />
                          </rs-button>
                          <rs-button
                            variant="primary-outline"
                            class="!p-1 !w-8 !h-8"
                            :disabled="currentPage === totalPagesKelulusan"
                            @click="currentPage++"
                          >
                            <Icon name="ic:round-keyboard-arrow-right" />
                          </rs-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </rs-tab-item>

                <rs-tab-item title="Selesai" v-if="selesaiTable">
                  <!-- Selesai Sub-tab Content -->
                  <div>
                    <h4 class="text-md font-medium mb-3 text-gray-700">
                      Selesai
                    </h4>
                    <rs-table
                      :data="filteredSelesaiData"
                      :columns="siasatanColumns"
                      :pageSize="pageSize"
                      :showNoColumn="true"
                      :options="{
                        variant: 'default',
                        hover: true,
                        striped: true,
                      }"
                      :options-advanced="{
                        sortable: true,
                        filterable: false,
                      }"
                      advanced
                    >
                      <template v-slot:status="{ text }">
                        <div class="flex flex-col gap-1">
                          <template v-if="text.includes('\n')">
                            <div
                              v-for="(line, index) in text.split('\n')"
                              :key="index"
                              class="text-xs"
                            >
                              {{ line }}
                            </div>
                          </template>
                          <template v-else>
                            <rs-badge :variant="getStatusVariant(text)">
                              {{ text }}
                            </rs-badge>
                          </template>
                        </div>
                      </template>

                      <template v-slot:tindakan="{ text }">
                        <div class="flex justify-center items-center gap-2">
                          <rs-button
                            variant="primary"
                            class="p-1 flex gap-2"
                            @click="handleReview(text)"
                          >
                            Semak
                          </rs-button>
                        </div>
                      </template>
                    </rs-table>

                    <!-- Pagination -->
                    <div class="flex items-center justify-between px-5 mt-4">
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-700"
                          >Baris per halaman:</span
                        >
                        <FormKit
                          v-model="pageSize"
                          type="select"
                          :options="[10, 25, 50]"
                          :classes="{
                            wrapper: 'w-20',
                            outer: 'mb-0',
                            input: '!rounded-lg',
                          }"
                        />
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-700">
                          Menunjukkan {{ paginationStart }} hingga
                          {{ paginationEndSelesai }} daripada
                          {{ totalSelesaiData }} entri
                        </span>
                        <div class="flex gap-1">
                          <rs-button
                            variant="primary-outline"
                            class="!p-1 !w-8 !h-8"
                            :disabled="currentPage === 1"
                            @click="currentPage--"
                          >
                            <Icon name="ic:round-keyboard-arrow-left" />
                          </rs-button>
                          <rs-button
                            variant="primary-outline"
                            class="!p-1 !w-8 !h-8"
                            :disabled="currentPage === totalPagesSelesai"
                            @click="currentPage++"
                          >
                            <Icon name="ic:round-keyboard-arrow-right" />
                          </rs-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </rs-tab-item>
              </rs-tab>
            </div>
          </rs-tab-item>
        </rs-tab>
      </template>
    </rs-card>
  </div>

  <!-- Modal: Tugas Kepada -->
  <div
    v-if="isAssignModalOpen"
    class="fixed inset-0 z-50 z-[9999] flex items-center justify-center"
  >
    <div class="absolute inset-0 bg-black/50" @click="closeAssignModal"></div>
    <div class="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-gray-800">Tugas Kepada</h3>
      </div>
      <div class="space-y-4">
        <FormKit
          v-model="assignForm.jawatan"
          type="select"
          label="Jawatan"
          :options="jawatanOptions"
          :classes="{ outer: 'mb-0' }"
        />
        <FormKit
          v-model="assignForm.kariah"
          type="select"
          label="Kariah"
          :options="kariahOptions"
          :classes="{ outer: 'mb-0' }"
        />
        <FormKit
          v-model="assignForm.namaPegawai"
          type="select"
          label="Nama Pegawai"
          :options="namaPegawaiOptions"
          :classes="{ outer: 'mb-0' }"
        />
      </div>
      <div class="mt-6 flex justify-end gap-2">
        <rs-button variant="secondary-outline" @click="closeAssignModal"
          >Batal</rs-button
        >
        <rs-button variant="primary" @click="submitAssign">Hantar</rs-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Senarai Permohonan untuk Disemak",
});

const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/senarai",
  },
  {
    name: "Senarai",
    type: "current",
    path: "/BF-BTN/senarai",
  },
]);

// Table columns configuration for Profiling tab
const columns = [
  {
    key: "noRujukan",
    label: "No Rujukan Permohonan",
    sortable: true,
  },
  {
    key: "namaPemohon",
    label: "Nama Pemohon",
    sortable: true,
  },
  {
    key: "status",
    label: "Status Permohonan",
    sortable: true,
  },
  {
    key: "tarikhTerima",
    label: "Tarikh Terima Permohonan",
    sortable: true,
  },
  {
    key: "namaPegawai",
    label: "Nama Pegawai",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Aksi",
    sortable: false,
  },
];

// Table columns configuration for Siasatan tab
const siasatanColumns = [
  {
    key: "no",
    label: "No",
    sortable: true,
  },
  {
    key: "pemohon",
    label: "Pemohon",
    sortable: true,
  },
  {
    key: "kariah",
    label: "Kariah",
    sortable: true,
  },
  {
    key: "daerah",
    label: "Daerah",
    sortable: true,
  },
  {
    key: "bilanganBantuan",
    label: "Bilangan Bantuan",
    sortable: true,
  },
  {
    key: "jenistugasan",
    label: "Jenis Tugasan",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
  },

  {
    key: "noRujukan",
    label: "No Bantuan",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
  },
];

// Options for filters
const statusOptions = [
  { label: "Semua Status", value: "" },
  { label: "Baru", value: "baru" },
  { label: "Dalam Semakan", value: "dalam_semakan" },
  { label: "Tidak Lengkap", value: "tidak_lengkap" },
  { label: "Untuk Siasatan", value: "untuk_siasatan" },
];

// State
const searchQuery = ref("");
const filters = ref({
  status: "",
});
const currentPage = ref(1);
const pageSize = ref(10);

// Mock data for Profiling tab - would be replaced with API call
const applications = ref([
  {
    noRujukan: "NAS-2025-0001",
    namaPemohon: "Ahmad bin Abdullah",
    status: "Baru",
    tarikhTerima: "2024-03-20",
    namaPegawai: "Siti binti Ali",
    tindakan: "NAS-2025-0001",
  },
  {
    noRujukan: "NAS-2025-0002",
    namaPemohon: "Mohd bin Ismail",
    status: "Dalam Semakan",
    tarikhTerima: "2024-03-19",
    namaPegawai: "Aminah binti Hassan",
    tindakan: "NAS-2025-0002",
  },
]);

// Mock data for Siasatan tab - would be replaced with API call
const siasatanData = ref([
  {
    pemohon: "Ahmad bin Abdullah (800101-01-1234)",
    kariah: "Masjid Al-Hidayah",
    daerah: "Kuala Lumpur",
    bilanganBantuan: 1,
    status: "Segera - 0\nMelebihi SLA - 0\nPerlu Diproses - 1",
    jenistugasan: "Bantuan",
    noRujukan: "NAS-2025-0001",
    tindakan: "bantuan/siasatan/siasatan-eoad",
  },
  {
    pemohon: "Siti binti Hassan (850505-05-5678)",
    kariah: "Masjid Al-Ikhlas",
    daerah: "Selangor",
    bilanganBantuan: 2,
    status: "Segera - 0\nMelebihi SLA - 0\nPerlu Diproses - 2",
    noRujukan: "NAS-2025-0002",
    tindakan: "bantuan/siasatan/siasatan-eoad",
  },
]);

// Mock data for Permohonan sub-tab (own dataset, same format as Siasatan)
const permohonanData = ref([
  {
    pemohon: "Azman bin Rahim (810202-02-2233)",
    kariah: "Masjid Al-Falah",
    daerah: "Shah Alam",
    bilanganBantuan: 1,
    status: "Segera - 0\nMelebihi SLA - 0\nPerlu Diproses - 1",
    noRujukan: "NAS-2025-0101",
    tindakan: "siasatan-eoad",
  },
  {
    pemohon: "Nur Aina binti Zulkifli (900909-10-4455)",
    kariah: "Masjid Al-Amin",
    daerah: "Petaling",
    bilanganBantuan: 3,
    status: "Segera - 1\nMelebihi SLA - 0\nPerlu Diproses - 2",
    noRujukan: "NAS-2025-0102",
    tindakan: "siasatan-eoad",
  },
]);

// Mock data for Semakan sub-tab (own dataset, same format)
const semakanData = ref([
  {
    pemohon: "Hakim bin Nor (820303-03-3344)",
    kariah: "Masjid Al-Hikmah",
    daerah: "Gombak",
    bilanganBantuan: 1,
    status: "Segera - 0\nMelebihi SLA - 0\nPerlu Diproses - 1",
    noRujukan: "NAS-2025-0201",
    tindakan: "siasatan-eoad",
  },
]);

// Mock data for Sokongan sub-tab (own dataset, same format)
const sokonganData = ref([
  {
    pemohon: "Fairuz binti Halim (860606-06-6677)",
    kariah: "Masjid Al-Muttaqin",
    daerah: "Hulu Langat",
    bilanganBantuan: 2,
    status: "Segera - 0\nMelebihi SLA - 1\nPerlu Diproses - 1",
    noRujukan: "NAS-2025-0301",
    tindakan: "bantuan/sokongan/B106",
    //tindakan: "bantuan/sokongan/B106/draf-bq?view=true",
  },
]);

// Mock data for Kelulusan sub-tab (own dataset, same format)
const kelulusanData = ref([
  {
    pemohon: "Rosnah binti Karim (750707-07-7788)",
    kariah: "Masjid As-Salam",
    daerah: "Sepang",
    bilanganBantuan: 1,
    status: "Segera - 0\nMelebihi SLA - 0\nPerlu Diproses - 1",
    noRujukan: "NAS-2025-0401",
    tindakan: "bantuan/kelulusan/siasatan-eoad",
  },
]);

// Mock data for Selesai sub-tab (own dataset, same format)
const selesaiData = ref([
  {
    pemohon: "Rahim bin Salleh (700101-14-9999)",
    kariah: "Masjid Al-Ansar",
    daerah: "Klang",
    bilanganBantuan: 2,
    status: "Segera - 0\nMelebihi SLA - 0\nPerlu Diproses - 0",
    noRujukan: "NAS-2025-0501",
    tindakan: "siasatan-eoad",
  },
]);

// Mock data for Rework sub-tab (own dataset, same format)
const reworkData = ref([
  {
    pemohon: "Idris bin Musa (830808-08-8888)",
    kariah: "Masjid Al-Huda",
    daerah: "Ampang",
    bilanganBantuan: 1,
    status: "Segera - 0\nMelebihi SLA - 0\nPerlu Diproses - 1",
    noRujukan: "NAS-2025-0601",
    tindakan: "siasatan-eoad",
  },
]);

// Simulasi Peranan (dropdown only, no logic)
const selectedRole = ref("Penyemak");
const roleOptions = [
  { label: "Penyemak", value: "Penyemak" },
  { label: "EOAD", value: "EOAD" },
  { label: "ETD", value: "ETD" },
  { label: "KOAD, KJ, KD", value: "KOAD,KJ,KD" },
];

// Computed properties for Profiling tab
const filteredApplications = computed(() => {
  let result = [...applications.value];

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (app) =>
        app.noRujukan.toLowerCase().includes(query) ||
        app.namaPemohon.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (filters.value.status) {
    result = result.filter((app) => app.status === filters.value.status);
  }

  // Apply pagination
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return result.slice(start, end);
});

const totalApplications = computed(() => {
  return applications.value.length;
});

// Computed properties for Siasatan tab
const filteredSiasatanData = computed(() => {
  let result = [...siasatanData.value];

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (app) =>
        app.noRujukan.toLowerCase().includes(query) ||
        app.pemohon.toLowerCase().includes(query) ||
        app.kariah.toLowerCase().includes(query) ||
        app.daerah.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (filters.value.status) {
    result = result.filter((app) => app.status === filters.value.status);
  }

  // Apply pagination
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return result.slice(start, end);
});

const totalSiasatanData = computed(() => {
  return siasatanData.value.length;
});

const totalPages = computed(() => {
  return Math.ceil(totalSiasatanData.value / pageSize.value);
});

const paginationStart = computed(() => {
  return (currentPage.value - 1) * pageSize.value + 1;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalSiasatanData.value);
});

// Computed properties for Permohonan sub-tab
const filteredPermohonanData = computed(() => {
  let result = [...permohonanData.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (app) =>
        app.noRujukan.toLowerCase().includes(query) ||
        app.pemohon.toLowerCase().includes(query) ||
        app.kariah.toLowerCase().includes(query) ||
        app.daerah.toLowerCase().includes(query)
    );
  }

  if (filters.value.status) {
    result = result.filter((app) => app.status === filters.value.status);
  }

  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return result.slice(start, end);
});

const totalPermohonanData = computed(() => {
  return permohonanData.value.length;
});

const totalPagesPermohonan = computed(() => {
  return Math.ceil(totalPermohonanData.value / pageSize.value);
});

const paginationEndPermohonan = computed(() => {
  return Math.min(
    currentPage.value * pageSize.value,
    totalPermohonanData.value
  );
});

// Computed properties for Semakan sub-tab
const filteredSemakanData = computed(() => {
  let result = [...semakanData.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (app) =>
        app.noRujukan.toLowerCase().includes(query) ||
        app.pemohon.toLowerCase().includes(query) ||
        app.kariah.toLowerCase().includes(query) ||
        app.daerah.toLowerCase().includes(query)
    );
  }

  if (filters.value.status) {
    result = result.filter((app) => app.status === filters.value.status);
  }

  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return result.slice(start, end);
});

const totalSemakanData = computed(() => {
  return semakanData.value.length;
});

const totalPagesSemakan = computed(() => {
  return Math.ceil(totalSemakanData.value / pageSize.value);
});

const paginationEndSemakan = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalSemakanData.value);
});

// Computed properties for Sokongan sub-tab
const filteredSokonganData = computed(() => {
  let result = [...sokonganData.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (app) =>
        app.noRujukan.toLowerCase().includes(query) ||
        app.pemohon.toLowerCase().includes(query) ||
        app.kariah.toLowerCase().includes(query) ||
        app.daerah.toLowerCase().includes(query)
    );
  }

  if (filters.value.status) {
    result = result.filter((app) => app.status === filters.value.status);
  }

  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return result.slice(start, end);
});

const totalSokonganData = computed(() => {
  return sokonganData.value.length;
});

const totalPagesSokongan = computed(() => {
  return Math.ceil(totalSokonganData.value / pageSize.value);
});

const paginationEndSokongan = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalSokonganData.value);
});

// Computed properties for Kelulusan sub-tab
const filteredKelulusanData = computed(() => {
  let result = [...kelulusanData.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (app) =>
        app.noRujukan.toLowerCase().includes(query) ||
        app.pemohon.toLowerCase().includes(query) ||
        app.kariah.toLowerCase().includes(query) ||
        app.daerah.toLowerCase().includes(query)
    );
  }

  if (filters.value.status) {
    result = result.filter((app) => app.status === filters.value.status);
  }

  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return result.slice(start, end);
});

const totalKelulusanData = computed(() => {
  return kelulusanData.value.length;
});

const totalPagesKelulusan = computed(() => {
  return Math.ceil(totalKelulusanData.value / pageSize.value);
});

const paginationEndKelulusan = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalKelulusanData.value);
});

// Computed properties for Selesai sub-tab
const filteredSelesaiData = computed(() => {
  let result = [...selesaiData.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (app) =>
        app.noRujukan.toLowerCase().includes(query) ||
        app.pemohon.toLowerCase().includes(query) ||
        app.kariah.toLowerCase().includes(query) ||
        app.daerah.toLowerCase().includes(query)
    );
  }

  if (filters.value.status) {
    result = result.filter((app) => app.status === filters.value.status);
  }

  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return result.slice(start, end);
});

const totalSelesaiData = computed(() => {
  return selesaiData.value.length;
});

const totalPagesSelesai = computed(() => {
  return Math.ceil(totalSelesaiData.value / pageSize.value);
});

const paginationEndSelesai = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalSelesaiData.value);
});

// Computed properties for Rework sub-tab
const filteredReworkData = computed(() => {
  let result = [...reworkData.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (app) =>
        app.noRujukan.toLowerCase().includes(query) ||
        app.pemohon.toLowerCase().includes(query) ||
        app.kariah.toLowerCase().includes(query) ||
        app.daerah.toLowerCase().includes(query)
    );
  }

  if (filters.value.status) {
    result = result.filter((app) => app.status === filters.value.status);
  }

  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return result.slice(start, end);
});

const totalReworkData = computed(() => {
  return reworkData.value.length;
});

const totalPagesRework = computed(() => {
  return Math.ceil(totalReworkData.value / pageSize.value);
});

const paginationEndRework = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalReworkData.value);
});

// Methods
const handleViewDetails = (noRujukan) => {
  navigateTo(`/BF-BTN/PB/senarai/${noRujukan}`);
};

const handleReview = (noRujukan) => {
  console.log(noRujukan);
  navigateTo(`/BF-BTN/tugasan/${noRujukan}`);
};

const handleAssignTask = (noRujukan) => {
  // Handle task assignment - would be replaced with actual implementation
  console.log(`Assigning task for: ${noRujukan}`);
  // You can add navigation or modal logic here
};

const getStatusVariant = (status) => {
  const variants = {
    baru: "info",
    dalam_semakan: "warning",
    tidak_lengkap: "danger",
    untuk_siasatan: "secondary",
    "dalam siasatan": "warning",
    "selesai siasatan": "success",
    "menunggu siasatan": "info",
  };
  return variants[status.toLowerCase()] || "default";
};

// Assign Modal State & Handlers
const isAssignModalOpen = ref(false);
const assignForm = ref({ jawatan: "", kariah: "", namaPegawai: "" });
const jawatanOptions = [
  { label: "EOAD", value: "EOAD" },
  { label: "ETD", value: "ETD" },
];
const namaPegawaiOptions = [
  { label: "Ali bin Ahmad", value: "Ali bin Ahmad" },
  { label: "Siti binti Zainal", value: "Siti binti Zainal" },
  { label: "Rahman bin Karim", value: "Rahman bin Karim" },
  { label: "Ainun binti Musa", value: "Ainun binti Musa" },
];
const kariahOptions = computed(() => {
  const set = new Set(siasatanData.value.map((r) => r.kariah));
  return Array.from(set).map((k) => ({ label: k, value: k }));
});

const openAssignModal = (row) => {
  isAssignModalOpen.value = true;
  assignForm.value = {
    jawatan: assignForm.value.jawatan || "EOAD",
    kariah: row && row.kariah ? row.kariah : "",
    namaPegawai: assignForm.value.namaPegawai || "Ali bin Ahmad",
  };
};

const closeAssignModal = () => {
  isAssignModalOpen.value = false;
};

const submitAssign = () => {
  console.log("Assign Task:", assignForm.value);
  isAssignModalOpen.value = false;
};

// Initialize table visibility based on default role "Penyemak"
const permohonanTable = ref(true);
const semakanTable = ref(true);
const siasatanTable = ref(true);
const sokonganTable = ref(true);
const reworkTable = ref(true);
const kelulusanTable = ref(true);
const selesaiTable = ref(true);

const onChangeSimulasiPeranan = () => {
  console.log("Jawatan:", selectedRole.value);

  if (selectedRole.value === "Penyemak") {
    permohonanTable.value = true;
    semakanTable.value = true;
    siasatanTable.value = false;
    sokonganTable.value = false;
    reworkTable.value = false;
    kelulusanTable.value = false;
    selesaiTable.value = true;
  } else if (selectedRole.value === "EOAD") {
    permohonanTable.value = false;
    semakanTable.value = false;
    siasatanTable.value = true;
    sokonganTable.value = false;
    reworkTable.value = false;
    kelulusanTable.value = false;
    selesaiTable.value = true;
  } else if (selectedRole.value === "ETD") {
    permohonanTable.value = false;
    semakanTable.value = false;
    siasatanTable.value = true;
    sokonganTable.value = false;
    reworkTable.value = true;
    kelulusanTable.value = false;
    selesaiTable.value = true;
  } else if (selectedRole.value === "KOAD,KJ,KD") {
    permohonanTable.value = false;
    semakanTable.value = false;
    siasatanTable.value = false;
    sokonganTable.value = false;
    reworkTable.value = false;
    kelulusanTable.value = true;
    selesaiTable.value = true;
  } else {
    permohonanTable.value = true;
    semakanTable.value = true;
    siasatanTable.value = true;
    sokonganTable.value = true;
    reworkTable.value = true;
    kelulusanTable.value = true;
    selesaiTable.value = true;
  }
};
</script>

<style lang="scss" scoped></style>

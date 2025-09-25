<!-- 
  RTMF SCREEN: PA-PE-ET-02
  PURPOSE: Maklumat Penerima — Senarai Nama Penolong Amil
  DESCRIPTION: Pemilihan dan pengurusan penerima untuk batch elaun tahunan
  ROUTE: /BF-PA/PE/ET/02
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Icon name="ic:baseline-group" class="mr-3 text-blue-600" size="24" />
            <h2 class="text-lg font-semibold">Maklumat Penerima — Senarai Nama Penolong Amil</h2>
          </div>
          <div class="text-xs text-gray-500">
            Tahun: <b>{{ query.year || '—' }}</b> · Jenis Elaun: <b>{{ typeLabel || '—' }}</b>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Dokumen Sokongan (Wajib) - Dropzone di atas -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Dokumen Sokongan (Wajib)</label>
          <div
            class="relative border border-dashed rounded-md px-3 py-3 text-center cursor-pointer select-none"
            :class="isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'"
            @dragover.prevent="onDragOver"
            @dragleave.prevent="onDragLeave"
            @drop.prevent="onDrop"
            @click="triggerDocInput"
            aria-label="Muat naik dokumen"
          >
            <input ref="docInput" type="file" class="hidden" multiple @change="onDocsSelected" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
            <div class="flex flex-col items-center justify-center gap-1">
              <Icon name="ic:baseline-cloud-upload" class="text-gray-400" size="20" />
              <p class="text-xs text-gray-700">Muat naik dokumen</p>
              <p class="text-[11px] text-gray-500">PDF, JPG, PNG, DOC, DOCX</p>
            </div>
          </div>
          <div class="mt-1">
            <span class="text-xs text-gray-500" v-if="uploadedDocs.length">{{ uploadedDocs.length }} fail dipilih</span>
          </div>
          <ul class="mt-1 text-xs text-gray-700" v-if="uploadedDocs.length">
            <li v-for="(f, idx) in uploadedDocs" :key="idx" class="flex items-center justify-between gap-2 py-0.5 border-b last:border-b-0">
              <span class="truncate max-w-[70%]">{{ f.name }}</span>
              <div class="flex items-center gap-2">
                <span class="text-gray-400">{{ (f.size/1024/1024).toFixed(2) }} MB</span>
                <button class="text-red-600 hover:text-red-700" @click.stop="removeDoc(idx)">Buang</button>
              </div>
            </li>
          </ul>
        </div>


        <!-- 3.1.1 Maklumat Penerima (Jadual Baca Sahaja + Checkbox Pilih untuk calon baharu sahaja) -->
        <div class="space-y-3 mb-6">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold">Senarai Nama — {{ typeLabel || 'Jenis Elaun' }}</h3>
            <p class="text-xs text-gray-500">
              Ditapis kepada: 
              <b>{{ getCategoryFilterText() }}</b>
            </p>
          </div>





          <!-- Simple Selection Info -->
          <div class="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div class="text-sm text-gray-600">
              <span class="font-medium">{{ filteredRows.filter(r => r._checked && !isInRecipients(r.paId)).length }}</span> penerima dipilih untuk ditambah
            </div>
          </div>

          <div class="overflow-x-auto rounded-lg border">
            <table class="min-w-full text-sm divide-y">
              <thead class="bg-gray-50 text-left">
                <tr>
                  <th class="px-4 py-3 font-medium text-gray-900">
                    <FormKit
                      v-model="selectAllCandidates"
                      type="checkbox"
                      :classes="{
                        input: '!w-4 !h-4',
                      }"
                      @change="toggleSelectAllCandidates"
                    />
                  </th>
                  <th class="px-4 py-3 font-medium text-gray-900">Nama</th>
                  <th class="px-4 py-3 font-medium text-gray-900">ID Pengenalan</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Kategori</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Kariah</th>
                  <th v-if="!isAwardType" class="px-4 py-3 font-medium text-gray-900">Senarai Aktiviti Dihadiri</th>
                  <th v-if="!isAwardType" class="px-4 py-3 font-medium text-gray-900">Hadir Aktiviti (kali)</th>
                  <th v-if="!isAwardType" class="px-4 py-3 font-medium text-gray-900">Total Hadir Kali</th>
                </tr>
              </thead>
              <tbody class="divide-y bg-white">
                <tr v-for="row in pagedRows" :key="row.paId" class="hover:bg-gray-50">
                  <td class="px-4 py-3">
                    <template v-if="isInRecipients(row.paId) || row._selected">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Telah Dipilih</span>
                    </template>
                    <template v-else>
                    <FormKit
                      v-model="row._checked"
                      type="checkbox"
                      :classes="{
                        input: '!w-4 !h-4',
                      }"
                    />
                    </template>
                  </td>
                  <td class="px-4 py-3 font-medium text-gray-900">{{ row.name }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ row.ic }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ row.category }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ row.parish }}</td>
                  <td v-if="!isAwardType" class="px-4 py-3">
                    <ul class="list-disc pl-5 space-y-0.5 text-xs leading-tight">
                      <li v-for="a in aggregateActivities(row.activities)" :key="a.name">
                        <button 
                          @click="openActivityDetail(row, a.name)"
                          class="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left"
                        >
                          {{ a.name }}
                        </button>
                      </li>
                      <li v-if="!row.activities || !row.activities.length" class="list-none text-gray-500">
                        Tiada rekod aktiviti.
                      </li>
                    </ul>
                  </td>
                  <td v-if="!isAwardType" class="px-4 py-3">
                    <div>
                      <div v-for="a in aggregateActivities(row.activities)" :key="a.name" class="text-sm">
                        <span class="font-medium">{{ a.count }}</span>
                      </div>
                      <div v-if="!row.activities || !row.activities.length" class="text-gray-500">
                        -
                      </div>
                    </div>
                  </td>
                  <td v-if="!isAwardType" class="px-4 py-3 text-gray-900">
                    {{ totalActivityCount(row.activities) }}
                  </td>
                </tr>
                <tr v-if="!filteredRows.length" class="hover:bg-gray-50">
                  <td class="px-4 py-6 text-center text-gray-500" :colspan="isAwardType ? 5 : 8">
                    Tiada data {{ getCategoryFilterText() }} untuk kombinasi Tahun & Jenis Elaun ini.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Paginasi -->
          <div class="flex items-center justify-between" v-if="total > pageSize">
            <div class="text-sm text-gray-500">
              Menunjukkan {{ startIndex + 1 }}–{{ endIndex }} daripada {{ total }} rekod
            </div>
            <div class="flex items-center gap-2">
              <rs-button
                variant="secondary-outline"
                size="sm"
                :disabled="page === 1"
                @click="page--"
              >
                Sebelum
              </rs-button>
              <div class="text-sm">Halaman {{ page }}</div>
              <rs-button
                variant="secondary-outline"
                size="sm"
                :disabled="endIndex >= total"
                @click="page++"
              >
                Seterusnya
              </rs-button>
            </div>
          </div>
        </div>

        <!-- Butang 2.2: "Pilih" (kira calon baharu sahaja) -->
        <div class="flex items-center justify-end mb-6">
          <rs-button
            variant="primary"
            :disabled="newCheckedCount === 0"
            @click="commitSelected"
          >
            <Icon name="ic:baseline-check" class="mr-2" />
            Kemas Kini Senarai ({{ newCheckedCount }})
          </rs-button>
        </div>

        <!-- Maklumat Penerima (Paparan) - Elaun tetap bila ET-KPAK/ET-KPAF -->
        <div class="rounded-lg border p-4 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold">Maklumat Penerima (Paparan)</h3>
            <div class="text-xs text-gray-500">Status: <b>{{ statusLabel }}</b></div>
          </div>

          

          <div class="overflow-x-auto rounded-lg border">
            <table class="min-w-full text-sm divide-y">
              <thead class="bg-gray-50 text-left">
                <tr>
                  <th class="px-4 py-3 font-medium text-gray-900">Nama</th>
                  <th class="px-4 py-3 font-medium text-gray-900">ID Pengenalan</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Kategori</th>
                  <th class="px-4 py-3 font-medium text-gray-900">
                    <div class="flex items-center gap-2">
                      Elaun (RM)
                    </div>
                  </th>
                  <th v-if="!isAwardType" class="px-4 py-3 font-medium text-gray-900">Catatan</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Tindakan</th>
                </tr>
              </thead>
              <tbody class="divide-y bg-white">
                <tr v-for="(r, index) in recipients" :key="r.paId" 
                    :class="[
                      'hover:bg-gray-50',
                      r._cancelled ? 'bg-red-50 opacity-60' : ''
                    ]">
                  <td class="px-4 py-3 font-medium text-gray-900">
                    <span>{{ r.name }}</span>
                  </td>
                  <td class="px-4 py-3 text-gray-900">
                    <span>{{ r.ic }}</span>
                  </td>
                  <td class="px-4 py-3 text-gray-900">
                    <span>{{ r.category }}</span>
                  </td>
                  <td class="px-4 py-3 w-48">
                    <FormKit
                      v-if="r._isEditing && canEditAllowance()"
                      v-model.number="r.allowance"
                      type="number"
                      :min="editableAllowanceRange.min"
                      :max="editableAllowanceRange.max"
                      step="0.01"
                      placeholder="0.00"
                      :classes="{
                        input: '!py-1 !px-2',
                      }"
                    />
                    <template v-else>
                      <div class="flex items-center gap-2">
                        <span class="font-semibold">{{ r.allowance.toFixed(2) }}</span>
                        <Icon 
                          v-if="r._allowanceNotes" 
                          name="ic:baseline-info" 
                          class="text-blue-500 cursor-help" 
                          size="16"
                          :title="r._allowanceNotes"
                        />
                      </div>
                    </template>
                  </td>
                  <td v-if="!isAwardType" class="px-4 py-3">
                    <div v-if="r._allowanceNotes" class="text-xs text-gray-600 max-w-xs truncate" :title="r._allowanceNotes">
                      {{ r._allowanceNotes }}
                    </div>
                    <span v-else class="text-xs text-gray-400">-</span>
                  </td>
                  <td class="px-4 py-3 text-left">
                    <div class="flex items-center justify-start gap-2">
                      <!-- Edit Button - Only visible when not editing and allowance is editable -->
                      <rs-button
                        variant="secondary-outline"
                        size="sm"
                        @click="() => handleEditAttempt(r) && startEdit(r)"
                        v-if="!r._isEditing && canEditAllowance()"
                      >
                        <Icon name="ic:outline-edit" size="16" />
                      </rs-button>
                      <!-- Save Button - Only visible when editing -->
                      <rs-button
                        variant="success"
                        size="sm"
                        @click="saveRecipient(r)"
                        v-if="r._isEditing"
                      >
                        <Icon name="ic:baseline-check" size="16" />
                      </rs-button>
                      <!-- Cancel Button - Only visible when editing -->
                      <rs-button
                        variant="secondary-outline"
                        size="sm"
                        @click="cancelEdit(r)"
                        v-if="r._isEditing"
                      >
                        <Icon name="ic:baseline-close" size="16" />
                      </rs-button>
                      <!-- Delete Button - Always visible (except for new recipients) -->
                      <rs-button
                        variant="danger"
                        size="sm"
                        @click="removeRecipient(recipients.indexOf(r))"
                        v-if="!r._isNew"
                      >
                        <Icon name="ic:outline-delete" size="16" />
                      </rs-button>
                    </div>
                  </td>
                </tr>
                <tr v-if="recipients.length === 0" class="hover:bg-gray-50">
                  <td class="px-4 py-6 text-center text-gray-500" :colspan="isAwardType ? 5 : 6">
                    Tiada penerima dipilih lagi. Tandakan dan klik 'Pilih'.
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50">
                <tr>
                  <td class="px-4 py-3 text-right font-medium" colspan="4">Jumlah (RM)</td>
                  <td class="px-4 py-3 font-semibold">{{ totalAllowance.toFixed(2) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Footer dengan jumlah -->
          <div class="bg-gray-50 p-3 rounded-lg">
            <div class="flex justify-between items-center">
              <span class="font-medium">Jumlah (RM)</span>
              <span class="font-semibold text-lg">{{ totalAllowance.toFixed(2) }}</span>
            </div>
          </div>

          

          <!-- Tindakan -->
          <div class="flex items-center justify-end gap-2">
            <rs-button
              variant="secondary-outline"
              size="sm"
              @click="goBack"
            >
              Kembali
            </rs-button>
            <rs-button
              variant="secondary-outline"
              size="sm"
              :disabled="saving"
              @click="saveDraft"
            >
              <Icon name="ic:baseline-save" class="mr-2" />
              Simpan draf
            </rs-button>
            <rs-button
              variant="success"
              size="sm"
              :disabled="!canSubmit || saving"
              @click="openSubmitModal"
            >
              <Icon name="ic:baseline-send" class="mr-2" />
              Hantar
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>



    <!-- Submit Confirmation Modal -->
    <div v-if="showSubmitModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Hantar untuk Kelulusan</h3>
          <p class="text-sm text-gray-600 mb-4">Pastikan semua maklumat adalah betul sebelum menghantar untuk kelulusan.</p>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Ulasan Eksekutif</label>
            <FormKit
              v-model="submitNotes"
              type="textarea"
              rows="3"
              placeholder="Masukkan ulasan akhir sebelum menghantar..."
              :classes="{ input: '!py-2' }"
            />
            <p class="text-xs text-gray-600 mt-1">Ulasan ini akan dilihat oleh Ketua Jabatan dan Ketua Divisyen</p>
          </div>
          
          <div class="flex items-center justify-end gap-3 mt-6">
            <rs-button
              variant="secondary-outline"
              size="sm"
              @click="closeSubmitModal"
            >
              Batal
            </rs-button>
            <rs-button
              variant="success"
              size="sm"
              @click="confirmSubmit"
              :disabled="saving"
            >
              <Icon name="ic:baseline-send" class="mr-2" />
              {{ saving ? 'Menghantar...' : 'Hantar' }}
            </rs-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Note: Form-based activities modal removed - moved to AB2 module -->

    <!-- Activity Details Modal -->
    <div v-if="showActivityDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        <div class="p-6 overflow-y-auto">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Butiran Aktiviti: {{ activityDetail.activityName }}</h3>
            <button @click="closeActivityDetail" class="text-gray-400 hover:text-gray-600">
              <Icon name="ic:baseline-close" size="24" />
            </button>
          </div>
          <div class="text-sm text-gray-600 mb-4">PA: <b>{{ activityDetail.paName }}</b> 
            <span class="ml-3">Jumlah kutipan: <b>{{ activityDetail.total }}</b> kali</span>
          </div>
          <div class="overflow-x-auto rounded-lg border">
            <table class="min-w-full text-sm divide-y">
              <thead class="bg-gray-50 text-left">
                <tr>
                  <th class="px-4 py-3 font-medium text-gray-900">ID</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Nama Asnaf</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Kutipan (kali)</th>
                </tr>
              </thead>
              <tbody class="divide-y bg-white">
                <tr v-for="(d, idx) in activityDetail.details" :key="idx" class="hover:bg-gray-50">
                  <td class="px-4 py-2">{{ d.id }}</td>
                  <td class="px-4 py-2">{{ d.name }}</td>
                  <td class="px-4 py-2">{{ d.collected }}</td>
                </tr>
                <tr v-if="!activityDetail.details.length">
                  <td class="px-4 py-6 text-center text-gray-500" colspan="3">Tiada butiran tersedia.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="flex items-center justify-end mt-4">
            <rs-button variant="secondary-outline" size="sm" @click="closeActivityDetail">Tutup</rs-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Special Activity Modal -->
    <div v-if="showSpecialModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col">
        <div class="p-6 overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold">Pembatalan Pembayaran Elaun Khas</h3>
            <button 
              @click="closeSpecialModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <Icon name="ic:baseline-close" size="24" />
            </button>
          </div>
          
          <div class="overflow-x-auto rounded-lg border">
            <table class="min-w-full text-sm divide-y">
              <thead class="bg-gray-50 text-left">
                <tr>
                  <th class="px-4 py-3 font-medium text-gray-900 w-16">Checkbox</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Nama Aktiviti</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Tarikh</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Kadar Elaun</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Catatan</th>
                </tr>
              </thead>
              <tbody class="divide-y bg-white">
                <tr v-for="(item, index) in specialModalData" :key="index" class="hover:bg-gray-50">
                  <td class="px-4 py-3">
                    <FormKit
                      v-model="item._modalChecked"
                      type="checkbox"
                      :classes="{
                        input: '!w-4 !h-4',
                      }"
                    />
                  </td>
                  <td class="px-4 py-3 font-medium text-gray-900">{{ item.namaAktiviti }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.tarikh }}</td>
                  <td class="px-4 py-3 text-gray-900">RM {{ item.kadarElaun.toFixed(2) }}</td>
                  <td class="px-4 py-3">
                    <FormKit
                      v-if="item._modalChecked"
                      v-model="item._modalCatatan"
                      type="textarea"
                      rows="2"
                      placeholder="Masukkan catatan pembatalan..."
                      :classes="{ input: '!py-2 !px-2 text-xs' }"
                    />
                    <input
                      v-else
                      type="text"
                      disabled
                      :value="item._modalCatatan"
                      class="w-full py-2 px-2 text-xs bg-gray-100 text-gray-500 border border-gray-200 rounded"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="flex items-center justify-end gap-3 mt-6">
            <rs-button
              variant="secondary-outline"
              size="sm"
              @click="closeSpecialModal"
            >
              Batal
            </rs-button>
            <rs-button
              variant="primary"
              size="sm"
              @click="applySpecialChanges"
              :disabled="!hasSpecialChanges"
            >
              <Icon name="ic:baseline-check" class="mr-2" />
              Simpan
            </rs-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Award Activities Modal -->
    <div v-if="showAwardModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col">
        <div class="p-6 overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold">Pembatalan Maklumat Anugerah Penolong Amil</h3>
            <button 
              @click="closeAwardModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <Icon name="ic:baseline-close" size="24" />
            </button>
          </div>
          
          <div class="overflow-x-auto rounded-lg border">
            <table class="min-w-full text-sm divide-y">
              <thead class="bg-gray-50 text-left">
                <tr>
                  <th class="px-4 py-3 font-medium text-gray-900 w-16">Checkbox</th>
                  <th class="px-4 py-3 font-medium text-gray-900">No</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Nama Aktiviti</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Tarikh</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Kadar Elaun</th>
                  <th class="px-4 py-3 font-medium text-gray-900">Catatan</th>
                </tr>
              </thead>
              <tbody class="divide-y bg-white">
                <tr v-for="(item, index) in awardModalData" :key="index" class="hover:bg-gray-50">
                  <td class="px-4 py-3">
                    <FormKit
                      v-model="item._modalChecked"
                      type="checkbox"
                      :classes="{
                        input: '!w-4 !h-4',
                      }"
                    />
                  </td>
                  <td class="px-4 py-3 text-gray-900">{{ item.no }}</td>
                  <td class="px-4 py-3 font-medium text-gray-900">{{ item.namaAktiviti }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.tarikh }}</td>
                  <td class="px-4 py-3 w-48">
                    <FormKit
                      v-if="item._modalChecked"
                      v-model.number="item._modalKadarElaun"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      :classes="{
                        input: '!py-1 !px-2',
                      }"
                    />
                    <span v-else class="font-semibold">RM {{ item.kadarElaun.toFixed(2) }}</span>
                  </td>
                  <td class="px-4 py-3">
                    <FormKit
                      v-if="item._modalChecked"
                      v-model="item._modalCatatan"
                      type="textarea"
                      rows="2"
                      placeholder="Masukkan catatan pembatalan..."
                      :classes="{ input: '!py-2 !px-2 text-xs' }"
                    />
                    <input
                      v-else
                      type="text"
                      disabled
                      :value="item._modalCatatan"
                      class="w-full py-2 px-2 text-xs bg-gray-100 text-gray-500 border border-gray-200 rounded"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="flex items-center justify-end gap-3 mt-6">
            <rs-button
              variant="secondary-outline"
              size="sm"
              @click="closeAwardModal"
            >
              Batal
            </rs-button>
            <rs-button
              variant="primary"
              size="sm"
              @click="applyAwardChanges"
              :disabled="!hasAwardChanges"
            >
              <Icon name="ic:baseline-check" class="mr-2" />
              Simpan
            </rs-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch, nextTick } from 'vue';
import { useToast } from 'vue-toastification';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '#components';
import { FormKit } from '@formkit/vue';
import LayoutsBreadcrumb from '~/components/layouts/Breadcrumb.vue';

/*
  CORRELATION WITH ET/01:
  - This page uses static mock data that EXACTLY matches the mock data from ET/01
  - Category filtering is dynamic based on allowance type (ET-KPAK shows KPAK only, etc.)
  - Candidate counts are EXACTLY the same as "Bilangan Penerima" shown in ET/01
  - This ensures PERFECT correlation between the two screens
  - Using static mock data approach (similar to KF module) for simplicity and consistency
  - Counts: ET-KPAK: 7, ET-KPAF: 4, ET-ANUG: 6, ANUG-KPAK: 8, ANUG-PAK: 7, ANUG-KPAF: 5, ANUG-PAF: 8, ANUG-PAP: 3, ANUG-PAKPLUS: 9
*/

definePageMeta({
  title: "Maklumat Penerima — Senarai Nama Penolong Amil",
  description: "Recipient selection and management for annual allowance batches",
});

const toast = useToast();
const router = useRouter();
const route = useRoute();
const goBack = () => router.back();

const breadcrumb = ref([
  {
    name: "Pengurusan Elaun",
    type: "link",
    path: "/BF-PA/PE",
  },
  {
    name: "Elaun Tahunan",
    type: "link",
    path: "/BF-PA/PE/ET",
  },
  {
    name: "Senarai Nama PA",
    type: "current",
    path: "/BF-PA/PE/ET/02",
  },
]);

const query = reactive({
  year: route.query.year ? Number(route.query.year) : '',
  type: route.query.type ? String(route.query.type) : ''
});

const typeOptions = {
  'ET-KPAK': 'Elaun Tahunan KPAK',
  'ET-KPAF': 'Elaun Tahunan KPAF',
  'ET-KHAS': 'Elaun Khas - 48 Aktiviti/Tahun',
  'ANUG-KPAK': 'Ketua Penolong Amil Kariah (KPAK) terbaik',
  'ANUG-PAK': 'Penolong Amil Kariah (PAK) terbaik',
  'ANUG-KPAF': 'Ketua Penolong Amil Fitrah (KPAF) terbaik',
  'ANUG-PAF': 'Penolong Amil Fitrah (PAF) terbaik',
  'ANUG-PAP': 'Penolong Amil Padi (PAP) terbaik',
  'ANUG-PAKPLUS': 'Penolong Amil Komuniti (PAK+) terbaik'
};

const typeLabel = computed(() => typeOptions[query.type] || '');

// Award type flag (hide attendance columns, fix allowances)
const isAwardType = computed(() => String(query.type || '').startsWith('ANUG-'));

/* ====== Kadar elaun tetap ikut jenis elaun ====== */
// Fixed allowances that cannot be edited
const fixedAllowanceByType = { 
  'ET-KPAK': 500, 
  'ET-KPAF': 300, 
  'ET-KHAS': 400,
  // Award types (terbaik)
  'ANUG-KPAK': 750,
  'ANUG-PAK': 600,
  'ANUG-KPAF': 500,
  'ANUG-PAF': 400,
  'ANUG-PAP': 400,
  'ANUG-PAKPLUS': 400
};

// Editable allowances with range validation (none for award types now)
const editableAllowanceByType = {
};

const isFixedAllowance = computed(() => fixedAllowanceByType[query.type] != null);
const isEditableAllowance = computed(() => editableAllowanceByType[query.type] != null);
const fixedAllowanceValue = computed(() => fixedAllowanceByType[query.type] ?? 0);
const editableAllowanceRange = computed(() => editableAllowanceByType[query.type] || { min: 0, max: 0, default: 0 });

// Check if allowance can be edited for a specific recipient
function canEditAllowance() {
  return isEditableAllowance.value;
}

// Function to handle edit attempts on fixed allowance recipients
function handleEditAttempt(recipient) {
  if (!canEditAllowance()) {
    toast.warning(`Elaun untuk jenis ${typeLabel.value} adalah tetap dan tidak boleh diubah`);
    return false;
  }
  return true;
}

// Function to start editing a recipient
function startEdit(recipient) {
  // Only store original allowance since that's the only editable field
  recipient._originalAllowance = Number(recipient.allowance);
  recipient._isEditing = true;
}

// Function to validate budget constraints for editable allowances
function validateBudgetConstraints() {
  if (!isEditableAllowance.value) return true;
  
  const { min, max } = editableAllowanceRange.value;
  const totalMin = recipients.value.length * min;
  const totalMax = recipients.value.length * max;
  
  if (totalAllowance.value < totalMin) {
    toast.error(`Jumlah elaun (RM${totalAllowance.value.toFixed(2)}) adalah di bawah minimum (RM${totalMin.toFixed(2)})`);
    return false;
  }
  
  if (totalAllowance.value > totalMax) {
    toast.error(`Jumlah elaun (RM${totalAllowance.value.toFixed(2)}) adalah melebihi maksimum (RM${totalMax.toFixed(2)})`);
    return false;
  }
  
  return true;
}

/* ====== State ====== */
const candidates = ref([]);
const recipients = ref([]); // penerima sedia ada (draf) + yang baru dipilih
const page = ref(1);
const pageSize = 12;
const saving = ref(false);

// Modal states
const showSubmitModal = ref(false);
const submitNotes = ref('');

// Activity-specific modal states
const showSpecialModal = ref(false);
const showAwardModal = ref(false);
const selectedActivity = ref('');

// Activity-specific modal data
const specialModalData = ref([]);
const awardModalData = ref([]);

// Mandatory document upload state with Dropzone
const uploadedDocs = ref([]);
const docInput = ref(null);
const isDragging = ref(false);

function triggerDocInput() {
  if (docInput.value) docInput.value.click();
}

function filterFiles(files) {
  const allowed = ['pdf','jpg','jpeg','png','doc','docx'];
  return files.filter(f => {
    const ext = String(f.name || '').split('.').pop().toLowerCase();
    return allowed.includes(ext);
  });
}

function addFiles(files) {
  const list = filterFiles(files);
  const existing = new Set(uploadedDocs.value.map(f => `${f.name}|${f.size}`));
  for (const f of list) {
    const key = `${f.name}|${f.size}`;
    if (!existing.has(key)) uploadedDocs.value.push(f);
  }
}

function onDocsSelected(e) {
  const files = Array.from(e?.target?.files || []);
  addFiles(files);
  // reset input to allow selecting same file again
  if (docInput.value) docInput.value.value = '';
}

function onDragOver() { isDragging.value = true; }
function onDragLeave() { isDragging.value = false; }
function onDrop(e) {
  isDragging.value = false;
  const files = Array.from(e?.dataTransfer?.files || []);
  addFiles(files);
}

function removeDoc(idx) {
  uploadedDocs.value.splice(idx, 1);
}

// Activity details state
const showActivityDetailModal = ref(false);
const activityDetail = ref({ activityName: '', paName: '', total: 0, details: [] });

// (Removed) ELAUN KHAS helpers for info panel

// Bulk selection state for Maklumat Penerima section
const selectAllCandidates = ref(false);

// Filtering state removed per request

// Mock data generators for different modal types
// Note: Form-based activities (BANCIAN, KEMASKINI, PERMOHONAN BANTUAN) moved to AB2 module

function generateSpecialModalData() {
  return [
    { namaAktiviti: 'Program Qiamullail', tarikh: '2024-01-15', kadarElaun: 50.00, catatan: 'Program qiamullail bulanan', _modalChecked: false, _modalCatatan: 'Tiada' },
    { namaAktiviti: 'Program Tazkirah', tarikh: '2024-01-20', kadarElaun: 30.00, catatan: 'Tazkirah mingguan', _modalChecked: false, _modalCatatan: 'Tiada' },
    { namaAktiviti: 'Kutipan Zakat Fitrah', tarikh: '2024-03-15', kadarElaun: 25.00, catatan: 'Kutipan zakat fitrah', _modalChecked: false, _modalCatatan: 'Tiada' },
    { namaAktiviti: 'Agihan Bantuan Asnaf', tarikh: '2024-02-10', kadarElaun: 40.00, catatan: 'Agihan bantuan bulanan', _modalChecked: false, _modalCatatan: 'Tiada' },
    { namaAktiviti: 'Program Pendidikan', tarikh: '2024-01-25', kadarElaun: 35.00, catatan: 'Program pendidikan kanak-kanak', _modalChecked: false, _modalCatatan: 'Tiada' },
    { namaAktiviti: 'Kutipan Zakat Harta', tarikh: '2024-02-05', kadarElaun: 45.00, catatan: 'Kutipan zakat harta', _modalChecked: false, _modalCatatan: 'Tiada' },
    { namaAktiviti: 'Program Kesihatan', tarikh: '2024-01-30', kadarElaun: 20.00, catatan: 'Program kesihatan komuniti', _modalChecked: false, _modalCatatan: 'Tiada' },
    { namaAktiviti: 'Majlis Hari Raya', tarikh: '2024-04-10', kadarElaun: 60.00, catatan: 'Majlis hari raya komuniti', _modalChecked: false, _modalCatatan: 'Tiada' }
  ];
}

function generateAwardModalData() {
  return [
    { no: 1, namaAktiviti: 'Ketua Penolong Amil Kariah (KPAK) terbaik', tarikh: '2024-12-31', kadarElaun: 500.00, catatan: 'Anugerah untuk prestasi cemerlang tahun 2024', _modalChecked: false, _modalKadarElaun: 500.00, _modalCatatan: 'Tiada' },
    { no: 2, namaAktiviti: 'Penolong Amil Kariah (PAK) terbaik', tarikh: '2024-12-31', kadarElaun: 400.00, catatan: 'Anugerah untuk komitmen tinggi dalam tugas', _modalChecked: false, _modalKadarElaun: 400.00, _modalCatatan: 'Tiada' },
    { no: 3, namaAktiviti: 'Ketua Penolong Amil Fitrah (KPAF) terbaik', tarikh: '2024-12-31', kadarElaun: 450.00, catatan: 'Anugerah untuk kepimpinan yang berkesan', _modalChecked: false, _modalKadarElaun: 450.00, _modalCatatan: 'Tiada' },
    { no: 4, namaAktiviti: 'Penolong Amil Fitrah (PAF) terbaik', tarikh: '2024-12-31', kadarElaun: 350.00, catatan: 'Anugerah untuk dedikasi dalam kutipan fitrah', _modalChecked: false, _modalKadarElaun: 350.00, _modalCatatan: 'Tiada' },
    { no: 5, namaAktiviti: 'Penolong Amil Padi (PAP) terbaik', tarikh: '2024-12-31', kadarElaun: 300.00, catatan: 'Anugerah untuk kecemerlangan dalam kutipan padi', _modalChecked: false, _modalKadarElaun: 300.00, _modalCatatan: 'Tiada' },
    { no: 6, namaAktiviti: 'Penolong Amil Komuniti (PAK+) terbaik', tarikh: '2024-12-31', kadarElaun: 400.00, catatan: 'Anugerah untuk perkhidmatan komuniti yang cemerlang', _modalChecked: false, _modalKadarElaun: 400.00, _modalCatatan: 'Tiada' }
  ];
}

// Missing category options for editing
const categoryOptions = [
  { label: 'KPAK', value: 'KPAK' },
  { label: 'KPAF', value: 'KPAF' },
  { label: 'PAK', value: 'PAK' },
  { label: 'PAF', value: 'PAF' },
  { label: 'PAP', value: 'PAP' },
  { label: 'PAK+', value: 'PAK+' }
];

/* === Helpers aktiviti (gabung + jumlah count) === */
function aggregateActivities(acts = []) {
  const map = new Map();
  for (const a of acts || []) {
    const name = a?.name?.trim();
    if (!name) continue;
    const c = Number.isFinite(a?.count) ? Number(a.count) : 1;
    map.set(name, (map.get(name) || 0) + c);
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
}

function totalActivityCount(acts = []) {
  return aggregateActivities(acts).reduce((s, a) => s + (Number(a.count) || 0), 0);
}

/* === Simple static mock data (similar to KF module approach) === */
function seedData() {
  // Load candidates based on allowance type
  candidates.value = getMockCandidates(query.year, query.type);
  // Drop placeholder candidates named "Nama PA ..." for all types
  candidates.value = candidates.value.filter(c => c && typeof c.name === 'string' && !/^Nama PA\b/i.test(c.name));
  
  // Load draft recipients from localStorage
  loadDraftRecipients();
  
  // Initialize checkbox states based on recipients list
  nextTick(() => {
    candidates.value.forEach(candidate => {
      candidate._checked = isInRecipients(candidate.paId);
    });
  });
}

// Static mock data for candidates - simple and realistic
function getMockCandidates(year, type) {
  const mockData = {
    'ET-KPAK': [
      { paId: `PA${year}001`, name: 'Ahmad bin Abdullah', ic: '800101011234', category: 'KPAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}002`, name: 'Mohd Zain bin Ismail', ic: '750315085678', category: 'KPAK', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}003`, name: 'Abdul Rahman bin Hassan', ic: '820520149012', category: 'KPAK', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}004`, name: 'Mohd Faiz bin Omar', ic: '780812063456', category: 'KPAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}005`, name: 'Zulkifli bin Ahmad', ic: '790325127890', category: 'KPAK', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}006`, name: 'Ahmad Fadzil bin Ibrahim', ic: '810415032345', category: 'KPAK', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}007`, name: 'Mohd Hafiz bin Zainal', ic: '760628096789', category: 'KPAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false }
    ],
    'ET-KPAF': [
      { paId: `PA${year}001`, name: 'Siti Aminah binti Omar', ic: '820520149012', category: 'KPAF', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}002`, name: 'Nor Azizah binti Ahmad', ic: '830615083456', category: 'KPAF', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}003`, name: 'Fatimah binti Hassan', ic: '810723127890', category: 'KPAF', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}004`, name: 'Aishah binti Ibrahim', ic: '840812062345', category: 'KPAF', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false }
    ],
    'ET-KHAS': [
      { paId: `PA${year}001`, name: 'Ahmad bin Abdullah', ic: '800101011234', category: 'KPAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}002`, name: 'Mohd Zain bin Ismail', ic: '750315085678', category: 'KPAK', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}003`, name: 'Siti Aminah binti Omar', ic: '820520149012', category: 'KPAF', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}004`, name: 'Abdul Rahman bin Hassan', ic: '780812063456', category: 'PAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}005`, name: 'Nor Azizah binti Ahmad', ic: '830615083456', category: 'PAF', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}006`, name: 'Mohd Faiz bin Omar', ic: '790325127890', category: 'PAP', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false }
    ],
    'ANUG-KPAK': [
      { paId: `PA${year}001`, name: 'Ahmad bin Abdullah', ic: '800101011234', category: 'KPAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}002`, name: 'Mohd Zain bin Ismail', ic: '750315085678', category: 'KPAK', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}003`, name: 'Abdul Rahman bin Hassan', ic: '820520149012', category: 'KPAK', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}004`, name: 'Mohd Faiz bin Omar', ic: '780812063456', category: 'KPAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}005`, name: 'Zulkifli bin Ahmad', ic: '790325127890', category: 'KPAK', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}006`, name: 'Ahmad Fadzil bin Ibrahim', ic: '810415032345', category: 'KPAK', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}007`, name: 'Mohd Hafiz bin Zainal', ic: '760628096789', category: 'KPAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}008`, name: 'Abdul Aziz bin Mohd', ic: '830710150123', category: 'KPAK', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false }
    ],
    'ANUG-PAK': [
      { paId: `PA${year}001`, name: 'Abdul Rahman bin Hassan', ic: '780812063456', category: 'PAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}002`, name: 'Ahmad Fadzil bin Ibrahim', ic: '810415032345', category: 'PAK', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}003`, name: 'Mohd Hafiz bin Zainal', ic: '830710150123', category: 'PAK', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}004`, name: 'Mohd Rizal bin Kamal', ic: '840123168901', category: 'PAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}005`, name: 'Ahmad Zulkarnain bin Salleh', ic: '780215102345', category: 'PAK', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}006`, name: 'Abdul Aziz bin Mohd', ic: '770912074567', category: 'PAK', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}007`, name: 'Mohd Faiz bin Omar', ic: '790325127890', category: 'PAK', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false }
    ],
    'ANUG-KPAF': [
      { paId: `PA${year}001`, name: 'Siti Aminah binti Omar', ic: '820520149012', category: 'KPAF', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}002`, name: 'Nor Azizah binti Ahmad', ic: '830615083456', category: 'KPAF', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}003`, name: 'Fatimah binti Hassan', ic: '810723127890', category: 'KPAF', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}004`, name: 'Aishah binti Ibrahim', ic: '840812062345', category: 'KPAF', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}005`, name: 'Khadijah binti Zainal', ic: '800915036789', category: 'KPAF', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false }
    ],
    'ANUG-PAF': [
      { paId: `PA${year}001`, name: 'Nor Azizah binti Ahmad', ic: '830615083456', category: 'PAF', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}002`, name: 'Khadijah binti Zainal', ic: '800915036789', category: 'PAF', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}003`, name: 'Safiyyah binti Salleh', ic: '830330158901', category: 'PAF', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}004`, name: 'Fatimah binti Ahmad', ic: '840920162345', category: 'PAF', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}005`, name: 'Aishah binti Hassan', ic: '820025146789', category: 'PAF', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}006`, name: 'Zainab binti Ibrahim', ic: '830130150123', category: 'PAF', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}007`, name: 'Hafsah binti Zainal', ic: '810235124567', category: 'PAF', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}008`, name: 'Siti Aminah binti Omar', ic: '820520149012', category: 'PAF', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false }
    ],
    'ANUG-PAP': [
      { paId: `PA${year}001`, name: 'Mohd Faiz bin Omar', ic: '790325127890', category: 'PAP', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}002`, name: 'Mohd Hafiz bin Zainal', ic: '830710150123', category: 'PAP', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false }
    ],
    'ANUG-PAKPLUS': [
      { paId: `PA${year}001`, name: 'Fatimah binti Hassan', ic: '810723127890', category: 'PAK+', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}002`, name: 'Zainab binti Mohd', ic: '850110170123', category: 'PAK+', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}003`, name: 'Abdul Rahman bin Hassan', ic: '780812063456', category: 'PAK+', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}004`, name: 'Ahmad Fadzil bin Ibrahim', ic: '810415032345', category: 'PAK+', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}005`, name: 'Mohd Rizal bin Kamal', ic: '840123168901', category: 'PAK+', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}006`, name: 'Ahmad Zulkarnain bin Salleh', ic: '780215102345', category: 'PAK+', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}007`, name: 'Abdul Aziz bin Mohd', ic: '770912074567', category: 'PAK+', parish: 'Kariah Masjid Al-Hidayah', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}008`, name: 'Mohd Faiz bin Omar', ic: '790325127890', category: 'PAK+', parish: 'Kariah Masjid Al-Amin', activities: generateSimpleActivities(), _checked: false },
      { paId: `PA${year}009`, name: 'Zulkifli bin Ahmad', ic: '760628096789', category: 'PAK+', parish: 'Kariah Masjid Sultan Salahuddin', activities: generateSimpleActivities(), _checked: false }
    ]
  };
  
  // Return candidates for the specific type, or empty array if not found
  return mockData[type] || [];
}

// Activity classification system for ET module (Yearly/Special Allowances)
const activityCategories = {
  SPECIAL: [
    'KHAS - 48 AKTIVITI/TAHUN'
  ],
  AWARD: [
    'Ketua Penolong Amil Kariah (KPAK) terbaik',
    'Penolong Amil Kariah (PAK) terbaik',
    'Ketua Penolong Amil Fitrah (KPAF) terbaik',
    'Penolong Amil Fitrah (PAF) terbaik',
    'Penolong Amil Padi (PAP) terbaik',
    'Penolong Amil Komuniti (PAK+) terbaik'
  ]
};

// Enhanced activity generation for ET module (Yearly/Special Allowances only)
function generateSimpleActivities() {
  const isKhas = (query?.type === 'ET-KHAS') || (route?.query?.type === 'ET-KHAS');
  const khasActivities = (() => {
    // Ensure total between 48 and 65
    const total = 48 + Math.floor(Math.random() * 18); // 48..65
    const c1 = Math.max(10, Math.floor(Math.random() * 25));
    const c2 = Math.max(10, Math.floor(Math.random() * 25));
    const c3 = Math.max(0, total - c1 - c2);
    return [
      { name: 'BANCIAN BARU', count: c1, category: 'SPECIAL' },
      { name: 'KEMASKINI', count: c2, category: 'SPECIAL' },
      { name: 'PERMOHONAN BANTUAN', count: c3, category: 'SPECIAL' },
    ];
  })();

  const defaultPool = [
    // Special activity (generic)
    { name: 'KHAS - 48 AKTIVITI/TAHUN', count: 1, category: 'SPECIAL' },
    // Award activities
    { name: 'Ketua Penolong Amil Kariah (KPAK) terbaik', count: 1, category: 'AWARD' },
    { name: 'Penolong Amil Kariah (PAK) terbaik', count: 1, category: 'AWARD' },
    { name: 'Ketua Penolong Amil Fitrah (KPAF) terbaik', count: 1, category: 'AWARD' },
    { name: 'Penolong Amil Fitrah (PAF) terbaik', count: 1, category: 'AWARD' },
    { name: 'Penolong Amil Padi (PAP) terbaik', count: 1, category: 'AWARD' },
    { name: 'Penolong Amil Komuniti (PAK+) terbaik', count: 1, category: 'AWARD' }
  ];

  const activityPool = isKhas ? khasActivities : defaultPool;

  // Randomly select 2-4 activities
  const selectedCount = isKhas ? activityPool.length : Math.floor(Math.random() * 3) + 2; // 2-4 by default
  const shuffled = isKhas ? activityPool : [...activityPool].sort(() => 0.5 - Math.random());
  
  return shuffled.slice(0, selectedCount).map((activity, index) => ({
    id: `A${index + 1}`,
    name: activity.name,
    count: activity.count,
    category: activity.category
  }));
}

// Helper function to get readable category filter text
function getCategoryFilterText() {
  const categoryMapping = {
    'ET-KPAK': ['KPAK'],
    'ET-KPAF': ['KPAF'],
    'ET-KHAS': ['PAK', 'KPAK', 'PAF', 'KPAF', 'PAP', 'PAK+'],
    'ANUG-KPAK': ['KPAK'],         // Anugerah KPAK - only KPAK
    'ANUG-PAK': ['PAK'],           // Anugerah PAK - only PAK
    'ANUG-KPAF': ['KPAF'],         // Anugerah KPAF - only KPAF
    'ANUG-PAF': ['PAF'],           // Anugerah PAF - only PAF
    'ANUG-PAP': ['PAP'],           // Anugerah PAP - only PAP
    'ANUG-PAKPLUS': ['PAK+']       // Anugerah PAK+ - only PAK+
  };
  
  const allowedCategories = categoryMapping[query.type] || ['KPAK'];
  
  if (allowedCategories.length === 1) {
    return `${allowedCategories[0]} sahaja`;
  } else if (allowedCategories.length <= 3) {
    return allowedCategories.join(', ');
  } else {
    return `${allowedCategories.length} kategori (semua)`;
  }
}

/* === Load draft recipients dari localStorage === */
function loadDraftRecipients() {
  try {
    const year = route.query.year;
    const type = route.query.type;
    
    if (year && type) {
      const recipientsKey = `et:recipients:${year}:${type}`;
      
      const savedRecipients = localStorage.getItem(recipientsKey);
      
      if (savedRecipients) {
        const parsed = JSON.parse(savedRecipients);
        // Ensure all loaded recipients have _checked: false and load notes
        recipients.value = parsed.map(r => ({ 
          ...r, 
          _checked: false,
          _allowanceNotes: r._allowanceNotes || ''
        }));

        // Remove any placeholder rows named "Nama PA ..." for all types
        recipients.value = recipients.value.filter(r => r && typeof r.name === 'string' && !/^Nama PA\b/i.test(r.name));

        // For award types (ANUG-*), enforce fixed allowance and keep only positive allowances
        if (isAwardType.value) {
          const fixed = fixedAllowanceValue.value;
          recipients.value = recipients.value
            .filter(r => (Number(r.allowance) || 0) > 0)
            .map(r => ({ ...r, allowance: fixed }));
        }
      }
    }
  } catch (error) {
    // Fallback to empty recipients if loading fails
    recipients.value = [];
  }
}

/* === Dynamic category filtering based on allowance type === */
const baseRows = computed(() => {
  // Define which categories are allowed for each allowance type
  const categoryMapping = {
    'ET-KPAK': ['KPAK'],           // Elaun Tahunan KPAK - only KPAK
    'ET-KPAF': ['KPAF'],           // Elaun Tahunan KPAF - only KPAF  
    'ET-KHAS': ['PAK', 'KPAK', 'PAF', 'KPAF', 'PAP', 'PAK+'], // Elaun Khas - all categories
    'ANUG-KPAK': ['KPAK'],         // Anugerah KPAK - only KPAK
    'ANUG-PAK': ['PAK'],           // Anugerah PAK - only PAK
    'ANUG-KPAF': ['KPAF'],         // Anugerah KPAF - only KPAF
    'ANUG-PAF': ['PAF'],           // Anugerah PAF - only PAF
    'ANUG-PAP': ['PAP'],           // Anugerah PAP - only PAP
    'ANUG-PAKPLUS': ['PAK+']       // Anugerah PAK+ - only PAK+
  };
  
  const allowedCategories = categoryMapping[query.type] || ['KPAK'];
  let rows = candidates.value.filter(r => allowedCategories.includes(r.category));
  // For ELAUN KHAS, only show PAs with >=48 activities in the year
  if (query.type === 'ET-KHAS') {
    rows = rows.filter(r => totalActivityCount(r.activities) >= 48);
  }
  return rows;
});

/* baris yang boleh dipilih (tidak berada dalam recipients sedia ada) */
function isInRecipients(paId) {
  return recipients.value.some(r => r.paId === paId);
}

const filteredRows = computed(() => {
  const rows = baseRows.value;
  return rows;
});

const total = computed(() => filteredRows.value.length);
const startIndex = computed(() => (page.value - 1) * pageSize);
const endIndex = computed(() => Math.min(startIndex.value + pageSize, total.value));
const pagedRows = computed(() => filteredRows.value.slice(startIndex.value, endIndex.value));

/* kira 'select all' hanya atas calon baharu dalam view */
const allVisibleChecked = computed(() => {
  const visibleNew = pagedRows.value.filter(r => !isInRecipients(r.paId));
  return visibleNew.length > 0 && visibleNew.every(r => r._checked);
});

/* bilangan calon baharu yang ditick */
const newCheckedCount = computed(() =>
  filteredRows.value.filter(r => r._checked).length
);

function toggleSelectVisible(checked) {
  const v = checked;
  pagedRows.value.forEach(r => {
    r._checked = v;
  });
}

function commitSelected() {
  // Get all checked items
  const selectedItems = filteredRows.value.filter(r => r._checked);
  
  // Create a map of current recipients
  const map = new Map(recipients.value.map(x => [x.paId, x]));
  
  // Add new recipients
  selectedItems.forEach(s => {
    let allowance = 0;
    
    if (isFixedAllowance.value) {
      // Fixed allowance - cannot be edited
      allowance = fixedAllowanceValue.value;
    } else if (isEditableAllowance.value) {
      // Editable allowance - set to default value within range
      allowance = editableAllowanceRange.value.default;
    }
    
    if (!map.has(s.paId)) {
      map.set(s.paId, { ...s, allowance, _checked: false, _selected: true });
    } else {
      // Mark as selected if already exists
      const existing = map.get(s.paId);
      map.set(s.paId, { ...existing, _selected: true });
    }
  });
  
  // Remove unchecked recipients from the list
  const uncheckedItems = filteredRows.value.filter(r => !r._checked);
  uncheckedItems.forEach(s => {
    // Do not auto-remove; simply ignore if not selected
    if (map.has(s.paId)) {
      const existing = map.get(s.paId);
      map.set(s.paId, { ...existing, _selected: existing?._selected || false });
    }
  });
  
  recipients.value = Array.from(map.values());

  // Clear all checkboxes
  filteredRows.value.forEach(r => (r._checked = false));
  
  // Show success message
  const addedCount = selectedItems.filter(s => !isInRecipients(s.paId)).length;
  if (addedCount > 0) {
    toast.success(`${addedCount} penerima ditambah & ditanda sebagai 'Telah Dipilih'`);
  } else if (selectedItems.length > 0) {
    toast.success(`${selectedItems.length} penerima ditanda sebagai 'Telah Dipilih'`);
  } else {
    toast.info('Tiada perubahan dibuat');
  }
}

/* Jenis elaun bertukar → set elaun tetap */
watch(() => query.type, () => {
  if (isFixedAllowance.value) {
    // Fixed allowance - set to fixed value
    recipients.value.forEach(r => (r.allowance = fixedAllowanceValue.value));
  } else if (isEditableAllowance.value) {
    // Editable allowance - set to default value within range
    recipients.value.forEach(r => (r.allowance = editableAllowanceRange.value.default));
  }
});

const totalAllowance = computed(() => recipients.value.reduce((sum, r) => sum + (Number(r.allowance) || 0), 0));
const canSubmit = computed(() =>
  recipients.value.length > 0 &&
  uploadedDocs.value.length > 0 &&
  recipients.value.every(r => isFinite(r.allowance) && Number(r.allowance) >= 0)
);
const status = ref('DRAF');
const statusLabel = computed(() => status.value === 'MENUNGGU KELULUSAN' ? 'menunggu kelulusan' : status.value.toLowerCase());



// Computed property to show allowance type information
const allowanceTypeInfo = computed(() => {
  if (isFixedAllowance.value) {
    return `Elaun Tetap: RM${fixedAllowanceValue.value.toFixed(2)} (tidak boleh diubah)`;
  } else if (isEditableAllowance.value) {
    const { min, max, default: defaultValue } = editableAllowanceRange.value;
    return `Elaun Boleh Diubah: RM${min.toFixed(2)} - RM${max.toFixed(2)} (default: RM${defaultValue.toFixed(2)})`;
  }
  return 'Elaun: Boleh diubah';
});

/* Simpan draf → persist penerima & status, count, balik ke skrin 1 */
async function saveDraft() {
  saving.value = true;
  try {
    await wait(400);
    status.value = 'DRAF';
    persistRecipients();
    persistCountAndStatusAndBack('DRAF');
    toast.success('Draf berjaya disimpan');
  } finally {
    saving.value = false;
  }
}



/* Modal functions for submit confirmation */
function openSubmitModal() {
  if (!canSubmit.value) return;
  submitNotes.value = ''; // Start with empty notes
  showSubmitModal.value = true;
}

function closeSubmitModal() {
  showSubmitModal.value = false;
  submitNotes.value = '';
}

async function confirmSubmit() {
  // Validate budget constraints first
  if (!validateBudgetConstraints()) {
    return;
  }
  
  saving.value = true;
  try {
    await wait(600);
    status.value = 'MENUNGGU KELULUSAN';
    persistRecipients();
    persistCountAndStatusAndBack('MENUNGGU KELULUSAN');
    
    showSubmitModal.value = false;
    submitNotes.value = '';
    toast.success('Permohonan berjaya dihantar untuk kelulusan');
  } finally {
    saving.value = false;
  }
}

/* Hantar → status MENUNGGU KELULUSAN, persist & balik ke skrin 1 */
async function submitForApproval() {
  if (!canSubmit.value) return;
  
  // Validate budget constraints first
  if (!validateBudgetConstraints()) {
    return;
  }
  
  saving.value = true;
  try {
    await wait(600);
    status.value = 'MENUNGGU KELULUSAN';
    persistRecipients();
    persistCountAndStatusAndBack('MENUNGGU KELULUSAN');
    toast.success('Permohonan berjaya dihantar untuk kelulusan');
  } finally {
    saving.value = false;
  }
}

/* Persist helpers */
function persistRecipients() {
  const year = route.query.year ?? '';
  const type = route.query.type ?? '';
  const key = `et:recipients:${year}:${type}`;
  
  // hanya simpan field penting
  const compact = recipients.value.map(r => ({
    paId: r.paId,
    name: r.name,
    ic: r.ic,
    category: r.category,
    parish: r.parish,
    allowance: Number(r.allowance) || 0,
    _allowanceNotes: r._allowanceNotes || ''
  }));
  
  localStorage.setItem(key, JSON.stringify(compact));
  // Notes are now handled only in the submit modal
}

function persistCountAndStatusAndBack(newStatus) {
  const year = route.query.year ?? '';
  const type = route.query.type ?? '';
  const count = Array.isArray(recipients.value) ? recipients.value.length : 0;
  localStorage.setItem(`et:count:${year}:${type}`, String(count));
  localStorage.setItem(`et:status:${year}:${type}`, newStatus);
  router.push({ path: '/BF-PA/PE/ET', query: { year, type } });
}

/* utils */
function wait(ms) { return new Promise(res => setTimeout(res, ms)); }

/* Load data + draft on first mount or when query changes */
watch(() => [query.year, query.type], () => seedData(), { immediate: true });

// Sync checkbox states with recipients list
watch(() => recipients.value, () => {
  // Update checkbox states based on recipients list
  filteredRows.value.forEach(row => {
    row._checked = isInRecipients(row.paId);
  });
}, { deep: true });

// Enhanced validation functions
function validateDuplicateRecipient(newRecipient) {
  // No duplicate checking needed since only allowance can be edited
  // Name, IC, and category are read-only
  return { valid: true };
}

function validateRecipientData(recipient) {
  const errors = [];
  
  // Only validate allowance since other fields are read-only
  if (recipient.allowance < 0) {
    errors.push('Elaun tidak boleh negatif');
  }
  
  // Range validation for editable allowances
  if (isEditableAllowance.value) {
    const { min, max } = editableAllowanceRange.value;
    if (recipient.allowance < min || recipient.allowance > max) {
      errors.push(`Elaun mestilah antara RM${min.toFixed(2)} hingga RM${max.toFixed(2)}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    message: errors.join('; ')
  };
}



function bulkDeselectAll() {
  filteredRows.value.forEach(r => r._checked = false);
}

function bulkAdjustAllowance(adjustment) {
  const selectedRecipients = filteredRows.value.filter(r => r._checked && !isInRecipients(r.paId));
  
  if (selectedRecipients.length === 0) {
    toast.warning('Tiada penerima dipilih untuk pelarasan elaun');
    return;
  }
  
  selectedRecipients.forEach(r => {
    const newAllowance = Math.max(0, (r.allowance || 0) + adjustment);
    r.allowance = newAllowance;
  });
  
  toast.success(`${selectedRecipients.length} penerima telah diselaraskan elaun`);
}

// Enhanced add recipient function
function addNewRecipient() {
  if (recipients.value.length >= 50) {
    toast.error('Maksimum 50 penerima dibenarkan setiap batch');
    return;
  }
  
  let defaultAllowance = 0;
  if (isFixedAllowance.value) {
    defaultAllowance = fixedAllowanceValue.value;
  } else if (isEditableAllowance.value) {
    defaultAllowance = editableAllowanceRange.value.default;
  }
  
  const newRecipient = {
    paId: `PA-${Date.now()}`,
    name: '',
    ic: '',
    category: '',
    parish: '',
    allowance: defaultAllowance,
    _isNew: true,
    _isEditing: true,
    _checked: false
  };
  
  recipients.value.push(newRecipient);
  
  // Scroll to the new recipient
  nextTick(() => {
    const lastRow = document.querySelector('tbody tr:last-child');
    if (lastRow) {
      lastRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

// Enhanced save recipient function
function saveRecipient(recipient) {
  const validation = validateRecipientData(recipient);
  if (!validation.valid) {
    toast.error(validation.message);
    return;
  }
  
  // Clean up original allowance value
  if (recipient._originalAllowance !== undefined) {
    delete recipient._originalAllowance;
  }
  
  recipient._isEditing = false;
  recipient._isNew = false;
  
  toast.success('Maklumat penerima berjaya disimpan');
}

// Enhanced remove recipient function
function removeRecipient(index) {
  const recipient = recipients.value[index];
  
  if (recipient._isNew) {
    // Remove new recipient immediately
    recipients.value.splice(index, 1);
    toast.success('Penerima baharu telah dibuang');
  } else {
    // Confirm removal for existing recipients
    if (confirm(`Adakah anda pasti mahu membuang ${recipient.name} dari senarai?`)) {
      recipients.value.splice(index, 1);
      toast.success('Penerima telah dibuang dari senarai');
    }
  }
}

// Cancel edit function
function cancelEdit(recipient) {
  // Revert allowance to original value (only field that can be edited)
  if (recipient._originalAllowance !== undefined) {
    recipient.allowance = recipient._originalAllowance;
    delete recipient._originalAllowance;
  }
  recipient._isEditing = false;
  toast.info('Penyuntingan dibatalkan');
}

// Enhanced allowance change modal functions
function openAllowanceModal(activityName) {
  selectedActivity.value = activityName;
  
  // Determine activity category and prepare appropriate data
  if (activityCategories.SPECIAL.includes(activityName)) {
    specialModalData.value = generateSpecialModalData();
    showSpecialModal.value = true;
  } else if (activityCategories.AWARD.includes(activityName)) {
    awardModalData.value = generateAwardModalData();
    showAwardModal.value = true;
  }
}

// Activity details modal logic
function openActivityDetail(row, activityName) {
  // Find the count for this activity
  const agg = aggregateActivities(row.activities).find(a => a.name === activityName);
  const total = agg ? Number(agg.count) || 0 : 0;
  activityDetail.value.activityName = activityName;
  activityDetail.value.paName = row.name;
  activityDetail.value.total = total;
  activityDetail.value.details = generateAsnafDetails(row.paId, activityName, total);
  showActivityDetailModal.value = true;
}

function closeActivityDetail() {
  showActivityDetailModal.value = false;
  activityDetail.value = { activityName: '', paName: '', total: 0, details: [] };
}

// Deterministic mock generator for asnaf names + collected counts
function generateAsnafDetails(paId, activityName, total) {
  const rows = [];
  const rng = mulberry32(hashCode(`${paId}:${activityName}`));
  for (let i = 0; i < total; i++) {
    const idx = i + 1;
    const first = sampleArray(['Ahmad','Muhammad','Siti','Nur','Azlan','Hafiz','Aisyah','Farah','Khairul','Nadia'], rng);
    const last = sampleArray(['Bin Ali','Binti Ahmad','Bin Hassan','Binti Ismail','Bin Rahman','Binti Omar','Bin Zainal','Binti Ibrahim'], rng);
    rows.push({ id: String(idx).padStart(2,'0'), name: `${first} ${last}`, collected: 1 });
  }
  return rows;
}

// Tiny helpers for deterministic RNG
function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return h >>> 0;
}
function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function sampleArray(arr, rng) {
  const i = Math.floor(rng() * arr.length);
  return arr[i];
}

function closeSpecialModal() {
  showSpecialModal.value = false;
  selectedActivity.value = '';
  specialModalData.value = [];
}

function closeAwardModal() {
  showAwardModal.value = false;
  selectedActivity.value = '';
  awardModalData.value = [];
}

function applySpecialChanges() {
  // Apply changes from special modal
  const changedItems = specialModalData.value.filter(r => r._modalChecked);
  if (changedItems.length > 0) {
    // For special activities, we can mark all recipients as having cancelled special activities
    recipients.value.forEach(recipient => {
      recipient._cancelledSpecialActivities = true;
      recipient._cancellationDate = new Date().toISOString().split('T')[0];
      recipient._cancellationReason = 'Aktiviti khas dibatalkan';
    });
    toast.success(`${changedItems.length} aktiviti khas telah diproses`);
  }
  closeSpecialModal();
}

function applyAwardChanges() {
  // Apply changes from award modal
  const changedItems = awardModalData.value.filter(r => r._modalChecked);
  if (changedItems.length > 0) {
    // For award activities, mark recipients as having cancelled awards
    recipients.value.forEach(recipient => {
      recipient._cancelledAwards = true;
      recipient._cancellationDate = new Date().toISOString().split('T')[0];
      recipient._cancellationReason = 'Anugerah dibatalkan';
    });
    toast.success(`${changedItems.length} anugerah telah diproses untuk pembatalan`);
  }
  closeAwardModal();
}

// Computed properties for modal changes
const hasSpecialChanges = computed(() => {
  return specialModalData.value.some(r => r._modalChecked);
});

const hasAwardChanges = computed(() => {
  return awardModalData.value.some(r => r._modalChecked);
});

// filteredRecipients removed per request

// Bulk selection functions for Maklumat Penerima section
function toggleSelectAllCandidates() {
  const shouldSelect = selectAllCandidates.value;
  pagedRows.value.forEach(row => {
    row._checked = shouldSelect;
  });
}

// Watch for changes in individual checkboxes to update select all state
watch(() => filteredRows.value.map(r => r._checked), (newValues) => {
  const totalRows = filteredRows.value.length;
  const checkedRows = newValues.filter(Boolean).length;
  
  if (checkedRows === 0) {
    selectAllCandidates.value = false;
  } else if (checkedRows === totalRows) {
    selectAllCandidates.value = true;
  } else {
    selectAllCandidates.value = false; // Indeterminate state
  }
}, { deep: true });

// Ensure header checkbox drives visible row checkboxes reliably
watch(selectAllCandidates, (val) => {
  pagedRows.value.forEach(row => {
    if (!isInRecipients(row.paId) && !row._selected) {
      row._checked = val;
    }
  });
});
</script>

<style scoped>
</style>  

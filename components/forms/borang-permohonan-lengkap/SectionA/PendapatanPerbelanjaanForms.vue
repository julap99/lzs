<template>
  <FormKit
    type="form"
    @submit="$emit('next-step')"
    :actions="false"
    id="sectionA12"
  >
    <h3 class="text-lg font-semibold mb-4">
      11. Maklumat Pendapatan & Perbelanjaan
    </h3>

    <!-- Income Information -->
    <div class="mb-6">
      <!-- Pendapatan -->
      <h5 class="text-md font-medium mb-2">Pendapatan</h5>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormKit
          type="number"
          name="gaji_elaun_pendapatan"
          label="Gaji / Elaun / Pendapatan Diperoleh (RM)"
          step="0.01"
          min="0"
          validation="required"
          :validation-messages="{
            required: 'Gaji / Elaun / Pendapatan Diperoleh adalah wajib',
          }"
          v-model="formData.gaji_elaun_pendapatan"
        />

        <FormKit
          type="number"
          name="pendapatan_isteri_suami_ibubapa_penjaga"
          label="Pendapatan Isteri/Suami/Ibubapa/Penjaga (RM)"
          step="0.01"
          min="0"
          validation="required"
          :validation-messages="{
            required:
              'Pendapatan Isteri/Suami/Ibubapa/Penjaga adalah wajib',
          }"
          v-model="formData.pendapatan_isteri_suami_ibubapa_penjaga"
        />

        <FormKit
          type="number"
          name="pencen_perkeso"
          label="Pencen / PERKESO (RM)"
          step="0.01"
          min="0"
          validation="required"
          :validation-messages="{
            required: 'Pencen / PERKESO adalah wajib',
          }"
          v-model="formData.pencen_perkeso"
        />

        <FormKit
          type="number"
          name="sumbangan_anak_anak"
          label="Sumbangan Anak-anak (RM)"
          step="0.01"
          min="0"
          validation="required"
          :validation-messages="{
            required: 'Sumbangan Anak-anak adalah wajib',
          }"
          v-model="formData.sumbangan_anak_anak"
        />

        <FormKit
          type="number"
          name="bantuan_jkm"
          label="Bantuan Jabatan Kebajikan Masyarakat (RM)"
          step="0.01"
          min="0"
          validation="required"
          :validation-messages="{
            required: 'Bantuan Jabatan Kebajikan Masyarakat adalah wajib',
          }"
          v-model="formData.bantuan_jkm"
        />

        <FormKit
          type="number"
          name="pendapatan_tanggungan_serumah"
          label="Pendapatan Tanggungan yang Tinggal Serumah (RM)"
          step="0.01"
          min="0"
          validation="required"
          :validation-messages="{
            required:
              'Pendapatan Tanggungan yang Tinggal Serumah adalah wajib',
          }"
          v-model="formData.pendapatan_tanggungan_serumah"
        />

        <FormKit
          type="number"
          name="total_pendapatan"
          label="Total Pendapatan (RM)"
          step="0.01"
          min="0"
          validation="required"
          :validation-messages="{
            required: 'Total Pendapatan adalah wajib',
          }"
          v-model="formData.total_pendapatan"
        />

        <!-- Pendapatan Lain-lain Repeater -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <rs-button
              variant="success"
              size="sm"
              @click="$emit('add-pendapatan-lain-lain')"
              type="button"
            >
              <Icon name="mdi:plus" class="mr-1" size="1rem" />
              Tambah
            </rs-button>
          </div>

          <div
            v-for="(item, index) in formData.pendapatan_lain_lain"
            :key="index"
            class="flex items-end gap-2"
          >
            <div class="flex-1">
              <FormKit
                type="number"
                :name="`pendapatan_lain_lain_${index}`"
                :label="`Pendapatan Lain-lain ${index + 1} (RM)`"
                step="0.01"
                min="0"
                validation="required"
                :validation-messages="{
                  required: 'Pendapatan Lain-lain adalah wajib',
                }"
                v-model="formData.pendapatan_lain_lain[index].amount"
              />
            </div>

            <rs-button
              v-if="formData.pendapatan_lain_lain.length > 1"
              variant="danger"
              size="sm"
              @click="$emit('remove-pendapatan-lain-lain', index)"
              type="button"
              class="mb-1 mt-6"
            >
              <Icon name="mdi:delete" size="1rem" />
            </rs-button>
          </div>
        </div>
      </div>

      <!-- Perbelanjaan -->
      <h5 class="text-md font-medium mt-6 mb-2">Perbelanjaan</h5>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormKit
          type="number"
          name="perbelanjaan_makanan_minuman"
          label="Perbelanjaan Makanan dan Minuman (RM)"
          step="0.01"
          min="0"
          validation="required"
          :validation-messages="{
            required: 'Perbelanjaan Makanan dan Minuman adalah wajib',
          }"
          v-model="formData.perbelanjaan_makanan_minuman"
        />

        <FormKit
          type="number"
          name="sewa_bayaran_pinjaman_perumahan"
          label="Sewa / Bayaran Pinjaman Perumahan (RM)"
          step="0.01"
          min="0"
          validation="required"
          :validation-messages="{
            required: 'Sewa / Bayaran Pinjaman Perumahan adalah wajib',
          }"
          v-model="formData.sewa_bayaran_pinjaman_perumahan"
        />

        <FormKit
          type="number"
          name="perbelanjaan_persekolahan_anak"
          label="Perbelanjaan Persekolahan Anak (RM)"
          step="0.01"
          min="0"
          validation="required"
          :validation-messages="{
            required: 'Perbelanjaan Persekolahan Anak adalah wajib',
          }"
          v-model="formData.perbelanjaan_persekolahan_anak"
        />

        <FormKit
          type="number"
          name="pengangkutan_tambang_bas_sekolah"
          label="Pengangkutan / Tambang Bas Sekolah (RM)"
          step="0.01"
          min="0"
          validation="required"
          :validation-messages="{
            required: 'Pengangkutan / Tambang Bas Sekolah adalah wajib',
          }"
          v-model="formData.pengangkutan_tambang_bas_sekolah"
        />

        <FormKit
          type="number"
          name="bil_utiliti"
          label="Bil Utiliti (RM)"
          step="0.01"
          min="0"
          validation="required"
          :validation-messages="{
            required: 'Bil Utiliti adalah wajib',
          }"
          v-model="formData.bil_utiliti"
        />

        <FormKit
          type="number"
          name="takaful"
          label="Takaful (RM)"
          step="0.01"
          min="0"
          validation="required"
          :validation-messages="{
            required: 'Takaful adalah wajib',
          }"
          v-model="formData.takaful"
        />

        <FormKit
          type="number"
          name="sewa_rumah_tanah_kedai"
          label="Sewa Rumah / Tanah / Kedai (RM)"
          step="0.01"
          min="0"
          validation="required"
          :validation-messages="{
            required: 'Sewa Rumah / Tanah / Kedai adalah wajib',
          }"
          v-model="formData.sewa_rumah_tanah_kedai"
        />
      </div>
    </div>

    <div class="flex justify-between gap-3 mt-6">
      <rs-button
        type="button"
        variant="primary-outline"
        @click="$emit('prev-step')"
        >Kembali</rs-button
      >
      <div class="flex gap-3">
        <rs-button
          type="button"
          variant="secondary"
          @click="$emit('save-step')"
          >Simpan</rs-button
        >
        <rs-button type="button" variant="primary" @click="$emit('next-step')"
          >Maklumat Tanggungan</rs-button
        >
      </div>
    </div>
  </FormKit>
</template>

<script setup>
// Props
const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits([
  'next-step', 
  'prev-step', 
  'save-step', 
  'add-pendapatan-lain-lain',
  'remove-pendapatan-lain-lain'
])
</script>

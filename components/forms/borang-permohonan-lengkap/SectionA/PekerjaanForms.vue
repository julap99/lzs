<template>
  <FormKit
    type="form"
    @submit="$emit('next-step')"
    :actions="false"
    id="sectionA11">
    <h3 class="text-lg font-semibold mb-4">10. Maklumat Pekerjaan</h3>

    <!-- Hidden field for ID type -->
    <FormKit type="hidden" name="jenis_id_pekerjaan" :value="jenisId" />

    <!-- Employment Status -->
    <div class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-black-700"
            >Status Pekerjaan
          </label>
          <FormKit
            type="radio"
            name="status_pekerjaan"
            :options="[
              { label: 'Bekerja', value: 'bekerja' },
              { label: 'Tidak Bekerja', value: 'tidak_bekerja' },
            ]"
            validation="required"
            v-model="formData.status_pekerjaan"
            :validation-messages="{
              required: 'Sila pilih status pekerjaan',
            }"
            :disabled="readOnly" />
        </div>
      </div>
    </div>
    <!-- Employment Details (shown only when working) -->
    <div v-if="formData.status_pekerjaan === 'bekerja'" class="mb-6">
      <h4 class="text-md font-medium mb-3">Butiran Pekerjaan</h4>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormKit
          type="select"
          name="sektor_pekerjaan"
          label="Sektor Pekerjaan"
          placeholder="Pilih sektor pekerjaan"
          :options="[
            'Kerajaan',
            'Swasta',
            'Badan Berkanun',
            'Kerja Sendiri',
            'Lain-lain',
          ]"
          v-model="formData.sektor_pekerjaan"
          :disabled="readOnly" />

        <FormKit
          v-if="showLainLainSektor"
          type="text"
          name="lain_lain_sektor"
          label="Lain-lain Sektor Pekerjaan"
          v-model="formData.lain_lain_sektor"
          :disabled="readOnly" />

        <FormKit
          type="text"
          name="jawatan"
          label="Jawatan"
          v-model="formData.jawatan"
          :disabled="readOnly" />

        <FormKit
          type="select"
          name="status_jawatan"
          label="Status Jawatan"
          placeholder="Pilih status jawatan"
          :options="['Tetap', 'Kontrak', 'Sementara']"
          v-model="formData.status_jawatan"
          :disabled="readOnly" />

        <FormKit
          type="number"
          name="pendapatan_kasar"
          label="Pendapatan Kasar (RM)"
          step="0.01"
          min="0"
          v-model="formData.pendapatan_kasar"
          :disabled="readOnly" />

        <div class="md:col-span-2">
          <FormKit
            type="file"
            name="pengesahan_pendapatan"
            label="Muat naik pengesahan pendapatan / penyata gaji ketua keluarga"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
            validation="max:5|mime:application/pdf,image/jpeg,image/png"
            :validation-messages="{
              max: 'Saiz fail tidak boleh melebihi 5MB',
              mime: 'Format fail tidak dibenarkan',
            }"
            v-model="formData.pengesahan_pendapatan"
            :disabled="readOnly" />
        </div>
      </div>
    </div>

    <div class="flex justify-between gap-3 mt-6" v-if="showFooterButtons">
      <rs-button
        type="button"
        variant="primary-outline"
        @click="$emit('prev-step')"
        :disabled="readOnly"
        >Kembali</rs-button
      >
      <div class="flex gap-3">
        <rs-button
          type="button"
          variant="secondary"
          @click="$emit('save-step')"
          :disabled="readOnly"
          >Simpan</rs-button
        >
        <rs-button
          type="button"
          variant="primary"
          @click="$emit('next-step')"
          :disabled="readOnly"
          >Maklumat Pendapatan & Perbelanjaan</rs-button
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
    required: true,
  },
  jenisId: {
    type: String,
    default: "",
  },
  showLainLainSektor: {
    type: Boolean,
    default: false,
  },
  showFooterButtons: {
    type: Boolean,
    default: true,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(["next-step", "prev-step", "save-step"]);
</script>

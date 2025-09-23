<template>
  <FormKit
    type="form"
    @submit="$emit('next-step')"
    :actions="false"
    id="sectionA10"
  >
    <h3 class="text-lg font-semibold mb-4">9. Maklumat Pemilikan Aset</h3>

    <h4 class="font-medium mb-2">Aset Cair</h4>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormKit
        type="number"
        name="wang_simpanan"
        label="Jumlah wang simpanan (RM)"
        help="sertakan penyata bank"
        step="0.01"
        min="0"
        v-model="formData.wang_simpanan"
      />

      <FormKit
        type="number"
        name="emas"
        label="Emas (gram)"
        step="0.01"
        min="0"
        v-model="formData.emas"
      />

      <FormKit
        type="number"
        name="saham"
        label="Saham (RM)"
        step="0.01"
        min="0"
        v-model="formData.saham"
      />
    </div>

    <h4 class="font-medium mb-2 mt-4">Aset Tidak Cair</h4>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-black-700"
          >Jenis Kenderaan</label
        >
        <FormKit
          type="checkbox"
          name="jenis_kenderaan"
          :options="['Kereta', 'Motosikal', 'Van', 'Lori']"
          v-model="formData.jenis_kenderaan"
        />
      </div>
    </div>
    <FormKit
      v-if="
        formData.jenis_kenderaan && formData.jenis_kenderaan.length > 0
      "
      type="number"
      name="kenderaan_total"
      label="Kenderaan (total unit)"
      min="0"
      validation="required|min:1"
      :validation-messages="{
        required: 'Jumlah unit kenderaan diperlukan',
        min: 'Masukkan sekurang-kurangnya 1 unit',
      }"
      v-model="formData.kenderaan_total"
    />

    <FormKit
      type="number"
      name="rumah_kedai"
      label="Rumah Kedai (unit)"
      min="0"
      v-model="formData.rumah_kedai"
    />

    <FormKit
      type="number"
      name="tanah_sawah"
      label="Tanah/Sawah (ekar)"
      step="0.01"
      min="0"
      v-model="formData.tanah_sawah"
    />

    <FormKit
      type="file"
      name="dokumen_pemilikan"
      label="dokumen pemilikan"
      multiple
      accept=".pdf,.jpg,.jpeg,.png"
      help="Jika ada wang simpanan > 0, rumah kedai > 0, atau tanah/sawah > 0, dokumen adalah wajib"
      :validation="
        Number(formData.wang_simpanan) > 0 ||
        Number(formData.rumah_kedai) > 0 ||
        Number(formData.tanah_sawah) > 0
          ? 'required|max:5|mime:application/pdf,image/jpeg,image/png'
          : 'max:5|mime:application/pdf,image/jpeg,image/png'
      "
      :validation-messages="{
        required: 'Dokumen pemilikan adalah wajib',
        max: 'Saiz fail tidak boleh melebihi 5MB',
        mime: 'Format fail tidak dibenarkan',
      }"
      v-model="formData.dokumen_pemilikan"
    />

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
          >Maklumat Pekerjaan</rs-button
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
const emit = defineEmits(['next-step', 'prev-step', 'save-step'])
</script>

<template>
  <FormKit
    type="form"
    @submit="$emit('next-step')"
    :actions="false"
    id="sectionB8"
  >
    <h3 class="text-lg font-semibold mb-4">8. Maklumat Pemilikan Aset</h3>

    <h4 class="font-medium mb-2">Aset Cair</h4>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormKit
        type="number"
        name="wang_simpanan_tanggungan"
        label="Wang Simpanan (RM)"
        step="0.01"
        min="0"
        v-model="getCurrentTanggungan().wang_simpanan"
      />

      <FormKit
        type="number"
        name="emas_tanggungan"
        label="Emas (RM)"
        step="0.01"
        min="0"
        v-model="getCurrentTanggungan().emas"
      />

      <FormKit
        type="number"
        name="saham_tanggungan"
        label="Saham (RM)"
        step="0.01"
        min="0"
        v-model="getCurrentTanggungan().saham"
      />
    </div>

    <h4 class="font-medium mb-2 mt-6">Aset Tidak Cair</h4>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormKit
        type="text"
        name="kenderaan_tanggungan"
        label="Kenderaan"
        placeholder="Contoh: Proton Saga (2018)"
        v-model="getCurrentTanggungan().kenderaan"
      />

      <FormKit
        type="text"
        name="rumah_tanggungan"
        label="Rumah / Harta Tanah"
        placeholder="Contoh: Teres 2 tingkat, Shah Alam"
        v-model="getCurrentTanggungan().rumah"
      />

      <FormKit
        type="text"
        name="tanah_sawah_tanggungan"
        label="Tanah / Sawah"
        placeholder="Contoh: 1 ekar di Kuala Selangor"
        v-model="getCurrentTanggungan().tanah_sawah"
      />

      <FormKit
        type="file"
        name="dokumen_pemilikan_tanggungan"
        label="Dokumen Sokongan Pemilikan"
        accept=".pdf,.jpg,.jpeg,.png"
        help="Format dibenarkan: PDF, JPG, PNG. Saiz maks: 5MB"
        validation="max:5|mime:application/pdf,image/jpeg,image/png"
        v-model="getCurrentTanggungan().dokumen_pemilikan"
      />
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
          >Maklumat Pinjaman Harta</rs-button
        >
      </div>
    </div>
  </FormKit>
</template>

<script setup>
// Props
const props = defineProps({
  getCurrentTanggungan: {
    type: Function,
    required: true
  }
})

// Emits
const emit = defineEmits(['next-step', 'prev-step', 'save-step'])
</script>

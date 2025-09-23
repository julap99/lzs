<template>
  <FormKit
    type="form"
    @submit="$emit('next-step')"
    :actions="false"
    id="sectionB2"
  >
    <h3 class="text-lg font-semibold mb-4">2. Maklumat Pengislaman</h3>

    <div class="mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Adakah tanggungan seorang Muallaf? -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-black-700"
              >Adakah tanggungan seorang Muallaf?</label
            >
            <div class="md:col-span-2">
              <FormKit
                type="radio"
                name="adakah_muallaf_tanggungan"
                :options="[
                  { label: 'Ya', value: 'Y' },
                  { label: 'Tidak', value: 'N' },
                ]"
                validation="required"
                v-model="getCurrentTanggungan().adakah_muallaf_tanggungan"
              />
            </div>
          </div>
        </div>
        <!-- Muallaf Fields (Conditional) -->
        <div
          v-if="getCurrentTanggungan().adakah_muallaf_tanggungan === 'Y'"
          class="md:col-span-2"
        >
          <h5 class="font-medium mb-3">Maklumat Muallaf</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Tarikh Masuk Islam -->
            <FormKit
              type="date"
              name="tarikh_masuk_islam_tanggungan"
              label="Tarikh Masuk Islam (DD/MM/YYYY) "
              validation="required"
              v-model="
                getCurrentTanggungan().tarikh_masuk_islam_tanggungan
              "
            />

            <!-- Tarikh Masuk Kelas Fardu Ain Muallaf (KFAM) -->
            <FormKit
              type="date"
              name="tarikh_masuk_kfam_tanggungan"
              label="Tarikh Masuk Kelas Fardu Ain Muallaf (KFAM) (DD/MM/YYYY) "
              v-model="
                getCurrentTanggungan().tarikh_masuk_kfam_tanggungan
              "
            />
            <!-- Nama Sebelum Islam (Muallaf) -->
            <FormKit
              type="text"
              name="nama_lain_tanggungan"
              label="Nama Lain (Jika ada) "
              placeholder="Masukkan nama lain"
              validation="required"
              v-model="getCurrentTanggungan().nama_lain_tanggungan"
            />

            <!-- Dokumen Pengislaman -->
            <FormKit
              type="file"
              name="dokumen_pengislaman_tanggungan"
              label="Dokumen Pengislaman "
              help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
              accept=".pdf,.jpg,.jpeg,.png"
              validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
              v-model="getCurrentTanggungan().dokumen_pengislaman_tanggungan"
            />
          </div>
        </div>
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
          >Maklumat perbankan</rs-button
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

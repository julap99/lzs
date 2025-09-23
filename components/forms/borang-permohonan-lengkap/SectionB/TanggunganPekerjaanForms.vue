<template>
  <FormKit
    type="form"
    @submit="$emit('next-step')"
    :actions="false"
    id="sectionB7"
  >
    <!-- VII. Maklumat Pekerjaan Tanggungan -->
    <div class="mb-6">
      <h4 class="font-medium mb-3">7. Maklumat Pekerjaan</h4>

      <!-- 1. Pekerjaan (Wajib) -->
      <div class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-black-700"
              >Pekerjaan</label
            >
            <FormKit
              type="radio"
              name="pekerjaan_status_tanggungan"
              :options="[
                { label: 'Bekerja', value: 'Bekerja' },
                { label: 'Tidak Bekerja', value: 'Tidak Bekerja' },
              ]"
              validation="required"
              validation-label="Status pekerjaan"
              v-model="getCurrentTanggungan().pekerjaan_status"
            />
          </div>
        </div>
      </div>

      <!-- 2. Sumber Pendapatan -->
      <div
        v-if="getCurrentTanggungan().pekerjaan_status === 'Bekerja'"
        class="mb-6"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-black-700"
              >Sumber Pendapatan</label
            >
            <FormKit
              type="checkbox"
              name="sumber_pendapatan_tanggungan"
              :options="[
                { label: 'Pengajian', value: 'Pengajian' },
                { label: 'Sumbangan Keluarga', value: 'Sumbangan Keluarga' },
                { label: 'Individu / Institusi', value: 'Individu / Institusi' },
                { label: 'Sumbangan Agensi', value: 'Sumbangan Agensi' },
                { label: 'Lain-lain', value: 'Lain-lain' },
              ]"
              validation="required|min:1"
              validation-label="Sumber pendapatan"
              validation-messages="{
                required: 'Sila pilih sekurang-kurangnya satu sumber pendapatan',
                min: 'Sila pilih sekurang-kurangnya satu sumber pendapatan'
              }"
              v-model="getCurrentTanggungan().sumber_pendapatan"
            />
          </div>
        </div>

        <!-- 2.1 Lain-lain Sumber Pendapatan -->
        <div
          v-if="
            getCurrentTanggungan().sumber_pendapatan &&
            getCurrentTanggungan().sumber_pendapatan.includes('Lain-lain')
          "
          class="mt-4"
        >
          <FormKit
            type="text"
            name="lain_lain_sumber_pendapatan_tanggungan"
            label="Lain-lain Sumber Pendapatan "
            placeholder="Sila nyatakan sumber pendapatan lain"
            validation="required"
            validation-label="Lain-lain sumber pendapatan"
            v-model="getCurrentTanggungan().lain_lain_sumber_pendapatan"
          />
        </div>
      </div>

      <!-- 3. Butiran Pekerjaan -->
      <div
        v-if="getCurrentTanggungan().pekerjaan_status === 'Bekerja'"
        class="mb-6"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 3.1 Jenis Pekerjaan -->
          <FormKit
            type="text"
            name="jenis_pekerjaan_tanggungan"
            label="Jenis Pekerjaan "
            placeholder="Contoh: Kerani, Jurutera, Guru"
            validation="required"
            validation-label="Jenis pekerjaan"
            v-model="getCurrentTanggungan().jenis_pekerjaan"
          />

          <!-- 3.2 Sektor Pekerjaan -->
          <FormKit
            type="select"
            name="sektor_pekerjaan_tanggungan"
            label="Sektor Pekerjaan "
            placeholder="Pilih sektor pekerjaan"
            :options="[
              { label: 'Kerajaan', value: 'Kerajaan' },
              { label: 'Swasta', value: 'Swasta' },
              { label: 'Badan Berkanun', value: 'Badan Berkanun' },
              { label: 'Kerja Sendiri', value: 'Kerja Sendiri' },
              { label: 'Lain-lain', value: 'Lain-lain' },
            ]"
            validation="required"
            validation-label="Sektor pekerjaan"
            v-model="getCurrentTanggungan().sektor_pekerjaan"
          />

          <!-- 3.3 Jawatan -->
          <FormKit
            type="text"
            name="jawatan_tanggungan"
            label="Jawatan "
            placeholder="Contoh: Pengurus, Penolong Pengurus"
            validation="required"
            validation-label="Jawatan"
            v-model="getCurrentTanggungan().jawatan"
          />

          <!-- 3.4 Status Jawatan -->
          <FormKit
            type="select"
            name="status_jawatan_tanggungan"
            label="Status Jawatan "
            placeholder="Pilih status jawatan"
            :options="[
              { label: 'Tetap', value: 'Tetap' },
              { label: 'Kontrak', value: 'Kontrak' },
              { label: 'Sementara', value: 'Sementara' },
            ]"
            validation="required"
            validation-label="Status jawatan"
            v-model="getCurrentTanggungan().status_jawatan"
          />

          <!-- 3.5 Pendapatan Kasar -->
          <FormKit
            type="number"
            name="pendapatan_kasar_tanggungan"
            label="Pendapatan Kasar (RM) "
            step="0.01"
            min="0"
            validation="required"
            validation-label="Pendapatan kasar"
            v-model="getCurrentTanggungan().pendapatan_kasar"
          />

          <!-- 3.2.1 Lain-lain Sektor Pekerjaan -->
          <div v-if="showLainLainSektorTanggungan" class="md:col-span-2">
            <FormKit
              type="text"
              name="lain_lain_sektor_pekerjaan_tanggungan"
              label="Lain-lain Sektor Pekerjaan "
              placeholder="Sila nyatakan sektor pekerjaan lain"
              validation="required"
              validation-label="Lain-lain sektor pekerjaan"
              v-model="getCurrentTanggungan().lain_lain_sektor_pekerjaan"
            />
          </div>

          <!-- 3.6 Pengesahan Pendapatan -->
          <div class="md:col-span-2">
            <FormKit
              type="file"
              name="pengesahan_pendapatan_tanggungan"
              label="Muat naik pengesahan pendapatan / penyata gaji"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
              validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
              :validation-messages="{
                required: 'Sila muat naik pengesahan pendapatan',
                max: 'Saiz fail tidak boleh melebihi 5MB',
                mime: 'Format fail tidak dibenarkan',
              }"
              v-model="getCurrentTanggungan().pengesahan_pendapatan"
            />
          </div>
        </div>
      </div>

      <!-- 4. Sebab Tidak Bekerja (Jika Tidak Bekerja) -->
      <div
        v-if="getCurrentTanggungan().pekerjaan_status === 'Tidak Bekerja'"
        class="mb-6"
      >
        <h5 class="text-md font-medium mb-4">Sebab Tidak Bekerja</h5>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormKit
            type="select"
            name="sebab_tidak_bekerja_tanggungan"
            label="Sebab Tidak Bekerja"
            :options="[
              { label: 'Pencari Kerja', value: 'Pencari Kerja' },
              { label: 'Pelajar', value: 'Pelajar' },
              { label: 'Suri Rumah', value: 'Suri Rumah' },
              { label: 'Pesara', value: 'Pesara' },
              { label: 'Lain-lain', value: 'Lain-lain' },
            ]"
            validation="required"
            v-model="getCurrentTanggungan().sebab_tidak_bekerja"
            placeholder="Pilih sebab tidak bekerja"
          />

          <!-- Lain-lain Sebab -->
          <div
            v-if="getCurrentTanggungan().sebab_tidak_bekerja === 'Lain-lain'"
          >
            <FormKit
              type="text"
              name="lain_lain_sebab_tidak_bekerja_tanggungan"
              label="Lain-lain Sebab"
              placeholder="Sila nyatakan sebab lain"
              validation="required"
              v-model="getCurrentTanggungan().lain_lain_sebab_tidak_bekerja"
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
          >Maklumat Pemilikan Aset</rs-button
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
  },
  showLainLainSektorTanggungan: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['next-step', 'prev-step', 'save-step'])
</script>

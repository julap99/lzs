<template>
  <FormKit
    type="form"
    @submit="$emit('next-step')"
    :actions="false"
  >
    <h3 class="text-lg font-semibold mb-4">
      B. Maklumat Peribadi Tanggungan {{ currentTanggunganIndex + 1 }}
    </h3>

    <!-- I. Maklumat Peribadi Tanggungan -->
    <div class="mb-6">
      <h4 class="font-medium mb-3">1. Maklumat Peribadi</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Hubungan dengan Pemohon/Asnaf -->
        <FormKit
          type="select"
          name="hubungan_pemohon"
          label="Hubungan dengan Pemohon/Asnaf "
          placeholder="Pilih hubungan"
          :options="[
            'Pasangan Pemohon',
            'Isteri Kedua',
            'Isteri Ketiga',
            'Isteri Keempat',
            'Ipar',
            'Abang',
            'Bapa',
            'Ibu',
            'Kakak',
            'Adik',
            'Anak',
            'Cucu',
            'Bapa Mertua',
            'Ibu Mertua',
            'Lain-lain',
          ]"
          validation="required"
          v-model="getCurrentTanggungan().hubungan_pemohon"
        />

        <!-- Lain-lain Hubungan -->
        <FormKit
          v-if="showLainLainHubungan"
          type="text"
          name="lain_lain_hubungan"
          label="Lain-lain Hubungan "
          placeholder="Nyatakan hubungan lain"
          validation="required"
          v-model="getCurrentTanggungan().lain_lain_hubungan"
        />

        <!-- Dokumen Surat Nikah -->
        <div v-if="showDokumenSuratNikah" class="md:col-span-2">
          <FormKit
            type="file"
            name="dokumen_surat_nikah"
            label="Dokumen Surat Nikah "
            accept=".pdf,.jpg,.jpeg,.png"
            help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
            validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
            v-model="formData.dokumen_surat_nikah"
          />
        </div>

        <!-- Nama Mengikut Dokumen Pengenalan -->
        <FormKit
          type="text"
          name="nama_tanggungan"
          label="Nama Mengikut Dokumen Pengenalan "
          placeholder="Masukkan nama penuh"
          validation="required"
          v-model="getCurrentTanggungan().nama_tanggungan"
        />

        <!-- Jenis Pengenalan -->
        <FormKit
          type="select"
          name="jenis_pengenalan_tanggungan"
          label="Jenis Pengenalan "
          placeholder="Pilih jenis pengenalan"
          :options="[
            { label: 'MyKad', value: 'MyKad' },
            { label: 'ForeignId', value: 'ForeignId' },
          ]"
          validation="required"
          v-model="getCurrentTanggungan().jenis_pengenalan_tanggungan"
        />

        <!-- Pengenalan ID Tanggungan -->
        <FormKit
          type="text"
          name="pengenalan_id_tanggungan"
          label="Pengenalan ID Tanggungan "
          placeholder="Masukkan nombor ID"
          :validation="
            getCurrentTanggungan().jenis_pengenalan_tanggungan === 'MyKad'
              ? 'required|length:12|matches:/^[0-9]{12}$/'
              : 'required'
          "
          :validation-messages="{
            required: 'Pengenalan ID Tanggungan adalah wajib',
            length: 'MyKad mesti 12 digit tanpa tanda sempang',
            matches: 'MyKad mesti mengandungi nombor sahaja (12 digit)',
          }"
          v-model="getCurrentTanggungan().pengenalan_id_tanggungan"
        />

        <!-- Upload Dokumen Nombor ID -->
        <div class="md:col-span-2">
          <FormKit
            type="file"
            name="dokumen_nombor_id"
            label="Upload Dokumen Nombor ID "
            accept=".pdf,.jpg,.jpeg,.png"
            help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
            validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
          />
        </div>

        <!-- Warganegara -->
        <FormKit
          type="select"
          name="warganegara_tanggungan"
          label="Warganegara "
          placeholder="Pilih warganegara"
          :options="[
            { label: 'Malaysia', value: 'Malaysia' },
            { label: 'Lain-lain', value: 'Lain-lain' },
          ]"
          validation="required"
          v-model="getCurrentTanggungan().warganegara_tanggungan"
        />

        <!-- Lain-lain Warganegara -->
        <FormKit
          v-if="showLainLainWarganegara"
          type="file"
          name="lain_lain_warganegara"
          label="Lain-lain Warganegara"
          help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
          accept=".pdf,.jpg,.jpeg,.png"
          validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
          v-model="getCurrentTanggungan().lain_lain_warganegara"
        />

        <!-- Taraf Penduduk Tetap -->
        <div
          v-if="showLainLainWarganegara"
          class="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div class="space-y-2">
            <label class="block text-sm font-medium text-black-700"
              >Taraf Penduduk Tetap</label
            >
            <FormKit
              type="radio"
              name="taraf_penduduk_tetap"
              :options="[
                { label: 'Ya', value: 'ya' },
                { label: 'Tidak', value: 'tidak' },
              ]"
              validation="required"
              v-model="getCurrentTanggungan().taraf_penduduk_tetap"
            />
          </div>
        </div>

        <!-- No Passport Lama -->
        <FormKit
          v-if="showLainLainWarganegara"
          type="text"
          name="no_pasport_lama"
          label="No Passport Lama"
          v-model="getCurrentTanggungan().no_pasport_lama"
        />

        <!-- No Pasport -->
        <FormKit
          v-if="showPassportFields"
          type="text"
          name="no_pasport"
          label="No Pasport "
          placeholder="Masukkan nombor pasport"
          validation="required"
          v-model="getCurrentTanggungan().no_pasport"
        />

        <!-- Tarikh Mula Pasport -->
        <FormKit
          v-if="showPassportFields"
          type="date"
          name="tarikh_mula_pasport"
          label="Tarikh Mula Pasport (DD/MM/YYYY) "
          validation="required"
          v-model="getCurrentTanggungan().tarikh_mula_pasport"
        />

        <!-- Tarikh Tamat Pasport -->
        <FormKit
          v-if="showPassportFields"
          type="date"
          name="tarikh_tamat_pasport"
          label="Tarikh Tamat Pasport (DD/MM/YYYY) "
          validation="required"
          v-model="getCurrentTanggungan().tarikh_tamat_pasport"
        />

        <!-- Passport Expiry Warning -->
        <div v-if="showPassportExpiryWarning" class="md:col-span-2">
          <div class="bg-red-50 border border-red-200 rounded-lg p-3">
            <div class="flex items-center gap-2">
              <i class="fas fa-exclamation-triangle text-red-500"></i>
              <span class="text-sm text-red-700 font-medium">
                Amaran: Pasport telah tamat tempoh. Tanggungan ini akan
                ditandakan sebagai tidak aktif.
              </span>
            </div>
            <p class="text-xs text-red-600 mt-1">
              Sila kemaskini maklumat pasport baru untuk mengaktifkan
              semula tanggungan ini.
            </p>
          </div>
        </div>

        <!-- Tarikh Lahir -->
        <FormKit
          type="date"
          name="tarikh_lahir_tanggungan"
          label="Tarikh Lahir "
          validation="required"
          v-model="getCurrentTanggungan().tarikh_lahir_tanggungan"
        />

        <!-- Umur (Auto-calculated) -->
        <FormKit
          type="text"
          name="umur_tanggungan"
          label="Umur"
          v-model="getCurrentTanggungan().umur_tanggungan"
          readonly
          help="Umur dari data yang telah ditetapkan"
        />

        <!-- Mohon Ketua Keluarga (for adults) -->
        <div
          v-if="
            parseInt(
              calculateAge(getCurrentTanggungan().tarikh_lahir_tanggungan)
            ) < 18
          "
          class="md:col-span-2"
        >
          <label class="block text-sm font-medium text-black-700 mb-4"
            >Mohon Ketua Keluarga?</label
          >
          <FormKit
            type="checkbox"
            name="mohon_ketua_keluarga"
            v-model="getCurrentTanggungan().mohon_ketua_keluarga"
          />
        </div>

        <!-- Special Approval for Adults -->
        <div
          v-if="
            parseInt(
              calculateAge(getCurrentTanggungan().tarikh_lahir_tanggungan)
            ) < 18 && getCurrentTanggungan().mohon_ketua_keluarga
          "
          class="md:col-span-2"
        >
          <div
            class="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
          >
            <div class="flex items-center gap-2 mb-2">
              <i class="fas fa-info-circle text-yellow-500"></i>
              <span class="text-sm text-yellow-700 font-medium">
                Maklumat Kelulusan Khas Diperlukan
              </span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="situasi_kelulusan_khas"
                placeholder="Pilih situasi"
                label="Situasi "
                :options="[
                  { label: 'Profiling', value: 'Profiling' },
                  { label: 'Permohonan Khas', value: 'Permohonan Khas' },
                  { label: 'Lain-lain', value: 'Lain-lain' },
                ]"
                :validation="
                  getCurrentTanggungan().mohon_ketua_keluarga
                    ? 'required'
                    : ''
                "
                :disabled="true"
                v-model="getCurrentTanggungan().situasi_kelulusan_khas"
              />
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-black-700"
                    >Kelulusan Khas</label
                  >
                  <FormKit
                    type="radio"
                    name="kelulusan_khas"
                    :options="[
                      { label: 'Ya', value: 'Y' },
                      { label: 'Tidak', value: 'N' },
                    ]"
                    :validation="
                      getCurrentTanggungan().mohon_ketua_keluarga
                        ? 'required'
                        : ''
                    "
                    :disabled="true"
                    v-model="getCurrentTanggungan().kelulusan_khas"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tempat Lahir -->
        <FormKit
          type="text"
          name="tempat_lahir_tanggungan"
          label="Tempat Lahir"
          placeholder="Masukkan tempat lahir"
          v-model="getCurrentTanggungan().tempat_lahir_tanggungan"
        />

        <!-- Jantina -->
        <FormKit
          type="select"
          name="jantina_tanggungan"
          label="Jantina"
          placeholder="Pilih jantina"
          :options="[
            { label: 'Lelaki', value: 'Lelaki' },
            { label: 'Perempuan', value: 'Perempuan' },
          ]"
          v-model="getCurrentTanggungan().jantina_tanggungan"
        />

        <!-- Agama -->
        <FormKit
          type="select"
          name="agama_tanggungan"
          label="Agama"
          placeholder="Pilih agama"
          :options="[
            { label: 'Islam', value: 'Islam' },
            { label: 'Kristian', value: 'Kristian' },
            { label: 'Buddha', value: 'Buddha' },
            { label: 'Hindu', value: 'Hindu' },
            { label: 'Lain-lain', value: 'Lain-lain' },
          ]"
          v-model="getCurrentTanggungan().agama_tanggungan"
        />

        <!-- Lain-lain Agama -->
        <FormKit
          v-if="showLainLainAgama"
          type="text"
          name="lain_lain_agama"
          label="Lain-lain Agama "
          placeholder="Nyatakan agama lain"
          validation="required"
          v-model="getCurrentTanggungan().lain_lain_agama"
        />

        <!-- Bangsa -->
        <FormKit
          type="select"
          name="bangsa_tanggungan"
          label="Bangsa "
          placeholder="Pilih bangsa"
          :options="[
            { label: 'Orang Asli', value: 'Orang Asli' },
            { label: 'Melayu', value: 'Melayu' },
            { label: 'Cina', value: 'Cina' },
            { label: 'India', value: 'India' },
            { label: 'Kadazan', value: 'Kadazan' },
            { label: 'Iban', value: 'Iban' },
            { label: 'Murut', value: 'Murut' },
            { label: 'Bajau', value: 'Bajau' },
            { label: 'Lain-lain', value: 'Lain-lain' },
          ]"
          validation="required"
          v-model="getCurrentTanggungan().bangsa_tanggungan"
        />

        <!-- Lain-lain Bangsa -->
        <FormKit
          v-if="showLainLainBangsa"
          type="text"
          name="lain_lain_bangsa"
          label="Lain-lain Bangsa "
          placeholder="Nyatakan bangsa lain"
          validation="required"
          v-model="getCurrentTanggungan().lain_lain_bangsa"
        />

        <!-- No Telefon Bimbit -->
        <FormKit
          type="text"
          name="no_telefon_bimbit_tanggungan"
          label="No Telefon Bimbit "
          placeholder="Contoh: 0123456789"
          validation="required|matches:/^(\+?6?01)[0-46-9]-*[0-9]{7,8}$/"
          :validation-messages="{
            required: 'No Telefon Bimbit adalah wajib',
            matches:
              'Format nombor telefon tidak sah. Contoh: 0123456789',
          }"
          v-model="getCurrentTanggungan().no_telefon_bimbit_tanggungan"
        />

        <!-- Emel -->
        <FormKit
          type="email"
          name="emel_tanggungan"
          label="Emel"
          placeholder="Contoh: nama@email.com"
          validation="email"
          :validation-messages="{
            email: 'Format emel tidak sah. Contoh: nama@email.com',
          }"
          v-model="getCurrentTanggungan().emel_tanggungan"
        />

        <!-- Tempoh Menetap di Selangor -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormKit
            type="number"
            name="tempoh_menetap_selangor_tanggungan_nilai"
            label="Tempoh Menetap di Selangor"
            placeholder="0"
            min="0"
            max="120"
            validation="required|min:0|max:120"
            :validation-messages="{
              required: 'Tempoh menetap adalah wajib',
              min: 'Tempoh menetap mesti 0 atau lebih',
              max: 'Tempoh tidak boleh melebihi 120',
            }"
            v-model="
              getCurrentTanggungan().tempoh_menetap_selangor_tanggungan_nilai
            "
          />
          <FormKit
            type="select"
            name="tempoh_menetap_selangor_tanggungan_unit"
            label="Unit Tempoh"
            placeholder="Pilih unit"
            :options="[
              { label: 'Hari', value: 'hari' },
              { label: 'Bulan', value: 'bulan' },
              { label: 'Tahun', value: 'tahun' },
            ]"
            validation="required"
            v-model="
              getCurrentTanggungan().tempoh_menetap_selangor_tanggungan_unit
            "
          />
        </div>

        <!-- Kelulusan Khas -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-black-700"
            >Kelulusan Khas</label
          >
          <FormKit
            type="radio"
            name="kelulusan_khas_tanggungan"
            :options="[
              { label: 'Ya', value: 'Y' },
              { label: 'Tidak', value: 'T' },
            ]"
            v-model="getCurrentTanggungan().kelulusan_khas"
          />
        </div>

        <!-- Status Perkahwinan -->
        <FormKit
          type="select"
          name="status_perkahwinan_tanggungan"
          label="Status Perkahwinan "
          placeholder="Pilih status perkahwinan"
          :options="[
            { label: 'Bujang', value: 'Bujang' },
            { label: 'Berkahwin', value: 'Berkahwin' },
            { label: 'Lain-lain', value: 'Lain-lain' },
          ]"
          validation="required"
          v-model="getCurrentTanggungan().status_perkahwinan_tanggungan"
        />

        <!-- Lain-lain Status Perkahwinan -->
        <FormKit
          v-if="showLainLainStatusPerkahwinan"
          type="text"
          name="lain_lain_status_perkahwinan"
          label="Lain-lain Status Perkahwinan "
          placeholder="Nyatakan status perkahwinan lain"
          validation="required"
          v-model="getCurrentTanggungan().lain_lain_status_perkahwinan"
        />

        <!-- Jumlah Tanggungan (Auto-calculated) -->
        <div class="md:col-span-2">
          <FormKit
            type="text"
            name="jumlah_tanggungan"
            label="Jumlah Tanggungan"
            :value="calculateTotalTanggungan()"
            readonly
            help="Dikira secara automatik berdasarkan maklumat pasangan & tanggungan"
          />
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
          >Maklumat Islam</rs-button
        >
      </div>
    </div>
  </FormKit>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  getCurrentTanggungan: {
    type: Function,
    required: true
  },
  currentTanggunganIndex: {
    type: Number,
    required: true
  },
  formData: {
    type: Object,
    required: true
  },
  // Conditional flags moved into component
  calculateAge: {
    type: Function,
    required: true
  },
  calculateTotalTanggungan: {
    type: Function,
    required: true
  }
})

// Emits
const emit = defineEmits(['next-step', 'prev-step', 'save-step'])

// Local computed flags moved from page
const showLainLainHubungan = computed(() => {
  const current = props.getCurrentTanggungan?.()
  return current?.hubungan_pemohon === 'Lain-lain'
})

const showDokumenSuratNikah = computed(() => {
  const current = props.getCurrentTanggungan?.()
  return current?.hubungan_pemohon === 'Pasangan Pemohon'
})

const showLainLainWarganegara = computed(() => {
  const current = props.getCurrentTanggungan?.()
  return current?.warganegara_tanggungan === 'Lain-lain'
})

const showPassportFields = computed(() => {
  const current = props.getCurrentTanggungan?.()
  return current?.warganegara_tanggungan === 'Lain-lain' && current?.jenis_pengenalan_tanggungan === 'ForeignId'
})

const showLainLainAgama = computed(() => {
  const current = props.getCurrentTanggungan?.()
  return current?.agama_tanggungan === 'Lain-lain'
})

const showLainLainBangsa = computed(() => {
  const current = props.getCurrentTanggungan?.()
  return current?.bangsa_tanggungan === 'Lain-lain'
})

const showLainLainStatusPerkahwinan = computed(() => {
  const current = props.getCurrentTanggungan?.()
  return current?.status_perkahwinan_tanggungan === 'Lain-lain'
})

// Check if passport is expired (non-Malaysian with expiry date in past)
const isPassportExpired = computed(() => {
  const current = props.getCurrentTanggungan?.()
  if (!current?.tarikh_tamat_pasport || current?.warganegara_tanggungan === 'Malaysia') {
    return false
  }
  try {
    const expiryDate = new Date(current.tarikh_tamat_pasport)
    const today = new Date()
    return expiryDate < today
  } catch (error) {
    return false
  }
})

const showPassportExpiryWarning = computed(() => isPassportExpired.value)
</script>

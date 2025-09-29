<template>
  <FormKit
    type="form"
    @submit="$emit('next-step')"
    :actions="false"
    id="sectionA8"
  >
    <h3 class="text-lg font-semibold mb-4">2. Maklumat Alamat</h3>

    <!-- Alamat Section -->
    <div class="mb-6">
      <h4 class="text-md font-medium mb-3">Alamat</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <div :class="getFieldClasses('addressInfo.alamat1')" class="p-2 rounded">
            <FormKit
              type="textarea"
              name="alamat1"
              label="Alamat 1"
              validation="required"
              placeholder="Sila masukkan alamat 1"
              v-model="formData.addressInfo.alamat1"
              :disabled="readOnly"
              :validation-messages="{
                required: 'Alamat 1 adalah wajib',
              }"
            />
          </div>

          <div :class="getFieldClasses('addressInfo.alamat2')" class="p-2 rounded" v-if="formData.addressInfo.alamat1">
            <FormKit
              type="textarea"
              name="alamat2"
              label="Alamat 2"
              placeholder="Sila masukkan alamat 2 (tidak wajib)"
              v-model="formData.addressInfo.alamat2"
              :disabled="readOnly"
            />
          </div>

          <FormKit
            type="textarea"
            name="alamat3"
            label="Alamat 3"
            placeholder="Sila masukkan alamat 3 (tidak wajib)"
            v-model="formData.addressInfo.alamat3"
            v-if="formData.addressInfo.alamat1"
            :disabled="readOnly"
          />
        </div>

        <FormKit
          type="select"
          name="poskod"
          label="Poskod"
          placeholder="Pilih poskod"
          :options="poskodOptions"
          validation="required"
          v-model="formData.addressInfo.poskod"
          :disabled="readOnly"
          :validation-messages="{
            required: 'Poskod adalah wajib',
          }"
        />

        <FormKit
          type="select"
          name="negeri"
          label="Negeri"
          value="Selangor"
          :options="negeriOptions"
          v-model="formData.addressInfo.negeri"
          :disabled="readOnly"
        />

        <div :class="getFieldClasses('addressInfo.daerah')" class="p-2 rounded">
          <FormKit
            type="select"
            name="daerah"
            label="Daerah"
            placeholder="Pilih daerah"
            :options="daerahOptions"
            validation="required"
            v-model="formData.addressInfo.daerah"
            :disabled="readOnly"
            :validation-messages="{
              required: 'Daerah adalah wajib',
            }"
          />
        </div>

        <div :class="getFieldClasses('addressInfo.bandar')" class="p-2 rounded">
          <FormKit
            type="select"
            name="bandar"
            label="Bandar"
            placeholder="Pilih bandar"
            :options="bandarOptions"
            validation="required"
            v-model="formData.addressInfo.bandar"
            :disabled="readOnly"
            :validation-messages="{
              required: 'Bandar adalah wajib',
            }"
          />
        </div>

        <FormKit
          type="select"
          name="kariah"
          label="Kariah"
          placeholder="Pilih kariah"
          :options="kariahOptions"
          validation="required"
          v-model="formData.addressInfo.kariah"
          :disabled="readOnly"
          :validation-messages="{
            required: 'Kariah adalah wajib',
          }"
        />

        <div class="flex gap-2">
          <FormKit
            v-model="formData.addressInfo.geolokasi"
            label="Geolokasi"
            type="text"
            class="flex-1"
            :disabled="readOnly"
          />
          <rs-button
            type="button"
            variant="primary-outline"
            @click="getLocation"
            :disabled="readOnly"
            class="whitespace-nowrap mt-7"
          >
            <i class="fas fa-location-dot mr-2"></i>
            Dapatkan Lokasi
          </rs-button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormKit
            type="number"
            name="tempoh_menetap_selangor_nilai"
            label="Tempoh Menetap di Selangor"
            placeholder="0"
            min="0"
            validation="required|min:0"
            v-model="formData.addressInfo.tempoh_menetap_selangor_nilai"
            :disabled="readOnly"
            :validation-messages="{
              required: 'Tempoh menetap adalah wajib',
              min: 'Tempoh menetap mesti 0 atau lebih',
            }"
          />
          <FormKit
            type="select"
            name="tempoh_menetap_selangor_unit"
            label="Unit Tempoh"
            placeholder="Pilih unit"
            :options="[
              { label: 'Hari', value: 'hari' },
              { label: 'Bulan', value: 'bulan' },
              { label: 'Tahun', value: 'tahun' },
            ]"
            validation="required"
            v-model="formData.addressInfo.tempoh_menetap_selangor_unit"
            :disabled="readOnly"
          />
        </div>

        <!-- Kategori (Musafir/Mukim/Bermastautin) -->
        <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-if="
              ['musafir', 'mukim'].includes(
                formData.addressInfo.kategori_menetap
              )
            "
            class="space-y-2"
          >
            <label class="block text-sm font-medium text-black-700"
              >Kelulusan Khas</label
            >
            <FormKit
              type="radio"
              name="kelulusan_khas"
              :options="[
                { label: 'Ya', value: 'Y' },
                { label: 'Tidak', value: 'T' },
              ]"
              v-model="formData.addressInfo.kelulusan_khas"
              :disabled="readOnly"
            />
          </div>
        </div> -->
      </div>
    </div>

    <!-- Maklumat Tempat Tinggal Section -->
    <div class="mb-6">
      <h4 class="text-md font-medium mb-3">Maklumat Tempat Tinggal</h4>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <FormKit
          type="select"
          name="status_kediaman"
          label="Status kediaman Tempat Tinggal"
          :options="[
            'Milik Sendiri Tidak Berbayar',
            'Milik Sendiri Berbayar',
            'Sewa',
            'Kuarters Majikan',
            'Tumpang Rumah Ibu/Bapa/Mertua',
            'Pusaka',
            'Sumbangan LZS / PPRT / RISDA',
            'Lain-lain',
          ]"
          validation="required"
          v-model="formData.addressInfo.status_kediaman"
          :disabled="readOnly"
          :validation-messages="{
            required: 'Status kediaman adalah wajib',
          }"
        />

        <FormKit
          type="text"
          name="lain_lain_status_kediaman"
          label="Lain-lain Status Kediaman Tempat Tinggal"
          validation="required"
          v-if="formData.addressInfo.status_kediaman === 'Lain-lain'"
          placeholder="Nyatakan status kediaman lain"
          v-model="formData.addressInfo.lain_lain_status_kediaman"
          :disabled="readOnly"
          :validation-messages="{
            required: 'Sila nyatakan status kediaman lain',
          }"
        />

        <FormKit
          type="select"
          name="keadaan_kediaman"
          label="Keadaan Kediaman"
          :options="['Baik', 'Uzur', 'Separa Uzur']"
          validation="required"
          v-model="formData.addressInfo.keadaan_kediaman"
          :disabled="readOnly"
          :validation-messages="{
            required: 'Keadaan kediaman adalah wajib',
          }"
        />
      </div>

      <!-- Kos Tempat Tinggal Section -->
      <div class="mt-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormKit
            type="number"
            name="kadar_bayaran_bulanan"
            label="Kadar Bayaran Bulanan jika Milik Sendiri Berbayar"
            step="0.01"
            min="0"
            placeholder="Isi kadar bayaran bulanan (RM)"
            v-if="
              formData.addressInfo.status_kediaman ===
              'Milik Sendiri Berbayar'
            "
            v-model="formData.addressInfo.kadar_bayaran_bulanan"
            :disabled="readOnly"
          />

          <FormKit
            type="file"
            name=""
            multiple
            label="Lampiran Tambahan"
            v-if="
              formData.addressInfo.status_kediaman ===
              'Milik Sendiri Berbayar'
            "
            :disabled="readOnly"
          />

          <FormKit
            type="number"
            name="kadar_sewa_bulanan"
            label="Kadar Sewa Bulanan jika Sewa"
            step="0.01"
            min="0"
            placeholder="Isi kadar sewa bulanan (RM)"
            v-if="formData.addressInfo.status_kediaman === 'Sewa'"
            v-model="formData.addressInfo.kadar_sewa_bulanan"
            :disabled="readOnly"
          />

          <FormKit
            type="file"
            name="dokumen_perjanjian_sewa"
            label="Dokumen Perjanjian Sewa"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
            validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
            v-if="formData.addressInfo.status_kediaman === 'Sewa'"
            v-model="formData.addressInfo.dokumen_perjanjian_sewa"
            :disabled="readOnly"
            :validation-messages="{
              required:
                'Dokumen perjanjian sewa adalah wajib untuk status sewa',
            }"
          />
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
        <rs-button type="button" variant="primary" @click="$emit('next-step')"
          :disabled="readOnly"
          >Maklumat Pendidikan</rs-button
        >
      </div>
    </div>
  </FormKit>
</template>

<script setup>

import { useToast } from 'vue-toastification';

const toast = useToast();

// Props
const props = defineProps({
  formData: {
    type: Object,
    required: true
  },
  showFooterButtons: {
    type: Boolean,
    default: true
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  comparisonData: {
    type: Object,
    default: null
  },
  isComparison: {
    type: Boolean,
    default: false
  },
  isBefore: {
    type: Boolean,
    default: false
  }
})

const negeriOptions = [
  "Selangor",
  "Wilayah Persekutuan",
  "Perlis",
  "Kedah",
  "Pulau Pinang",
  "Perak",
  "Kelantan",
  "Terengganu",
  "Pahang",
  "Johor",
  "Melaka",
  "Negeri Sembilan",
  "Sabah",
  "Sarawak"
];


const daerahOptions = ["Petaling", "Klang", "Gombak"];
const bandarOptions = ["Shah Alam", "Subang Jaya", "Kota Damansara"];
const poskodOptions = ["40100", "40000", "40460"];
const kariahOptions = ["Seksyen 7", "Seksyen 13", "Bukit Jelutong"];

// Get location function - moved from parent component
const getLocation = () => {
  props.formData.addressInfo.geolokasi = "Lokasi semasa";
  toast.success("Lokasi berjaya diperoleh!");
};

// Comparison logic
const isFieldDifferent = (fieldPath) => {
  if (!props.isComparison || !props.comparisonData) return false;
  
  const currentValue = getNestedValue(props.formData, fieldPath);
  const comparisonValue = getNestedValue(props.comparisonData, fieldPath);
  
  return currentValue !== comparisonValue;
};

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

const getFieldClasses = (fieldPath) => {
  if (!props.isComparison) return '';
  
  const isDifferent = isFieldDifferent(fieldPath);
  if (!isDifferent) return '';
  
  if (props.isBefore) {
    return 'border-l-4 border-red-500 bg-red-50';
  } else {
    return 'border-l-4 border-green-500 bg-green-50';
  }
};

// Emits
const emit = defineEmits(['next-step', 'prev-step', 'save-step'])
</script>
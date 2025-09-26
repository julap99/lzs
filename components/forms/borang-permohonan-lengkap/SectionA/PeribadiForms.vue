<template>
  <FormKit
    type="form"
    :actions="false"
    @submit="$emit('next-step')"
  >
    <h3 class="text-lg font-semibold mb-4">A. Maklumat Peribadi Asnaf</h3>

    <h3 class="text-lg font-semibold mb-4">1. Maklumat Peribadi</h3>

    <!-- Personal Information Section -->
    <div class="mb-6">
      <!-- <h4 class="text-md font-medium mb-3">Maklumat Peribadi</h4> -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormKit
          type="select"
          name="jenis_id"
          label="Jenis ID"
          placeholder="Pilih jenis ID"
          :disabled="readOnly"
          :options="[
            { label: 'MyKad', value: 'mykad' },
            { label: 'Foreign ID', value: 'foreign_id' },
          ]"
          validation="required"
          v-model="formData.jenis_id"
        />

        <FormKit
          type="text"
          name="id_pengenalan"
          label="ID Pengenalan"
          help="Mengikut Dokumen Pengenalan"
          :disabled="readOnly"
          validation="required"
          v-model="formData.no_pengenalan"
        />

        <FormKit
          v-if="formData.jenis_id"
          type="file"
          name="dokumen_id"
          :label="`Upload ${formData.jenis_id}`"
          accept=".pdf,.jpg,.jpeg,.png"
          help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
          validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
          :disabled="readOnly"
          v-model="formData.dokumen_id"
        />

        <FormKit
          type="text"
          name="nama"
          label="Nama"
          help="Mengikut Dokumen Pengenalan"
          :disabled="readOnly"
          validation="required"
          v-model="formData.nama"
          @input="formData.nama = ($event || '').toUpperCase()"
          input-class="uppercase"
        />

        <FormKit
          type="select"
          name="warganegara"
          label="Warganegara"
          placeholder="Pilih Warganegara"
          :disabled="readOnly"
          :options="['Malaysia', 'Lain-lain']"
          validation="required"
          v-model="formData.warganegara"
        />

        <FormKit
          v-if="formData.warganegara === 'Lain-lain'"
          type="file"
          name="lain_warganegara"
          label="Lain-lain Warganegara"
          help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
          accept=".pdf,.jpg,.jpeg,.png"
          validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
          :disabled="readOnly"
          v-model="formData.lain_warganegara"
        />

        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-4"
          v-if="formData.warganegara === 'Lain-lain'"
        >
          <div class="space-y-2">
            <label class="block text-sm font-medium text-black-700"
              >Taraf Penduduk Tetap</label
            >
            <FormKit
              type="radio"
              name="taraf_penduduk"
              :options="[
                { label: 'Ya', value: 'Y' },
                { label: 'Tidak', value: 'N' },
              ]"
              :disabled="readOnly"
              validation="required"
              v-model="formData.taraf_penduduk"
            />
          </div>
        </div>
        <FormKit
          v-if="formData.warganegara === 'Lain-lain'"
          type="text"
          name="nopassportlama"
          label="No Passport Lama"
          :disabled="readOnly"
          v-model="formData.nopassportlama"
        />

        <FormKit
          v-if="
            formData.warganegara === 'Lain-lain' &&
            formData.jenis_id === 'foreign_id'
          "
          type="date"
          name="passportStartDate"
          label="Tarikh mula passport"
          :disabled="readOnly"
          v-model="formData.passportStartDate"
        />
        <FormKit
          v-if="
            formData.warganegara === 'Lain-lain' &&
            formData.jenis_id === 'foreign_id'
          "
          type="date"
          name="passportEndDate"
          label="Tarikh tamat passport"
          :disabled="readOnly"
          v-model="formData.passportEndDate"
        />

        <FormKit
          v-if="
            formData.warganegara === 'Lain-lain' &&
            formData.jenis_id === 'foreign_id'
          "
          type="select"
          name="negara_lain"
          label="Negara Lain"
          :options="getCountries"
          placeholder="Pilih Negara Lain"
          :disabled="readOnly"
          validation="required"
          v-model="formData.negara_lain"
        />
      </div>
    </div>

    <!-- Personal Details Section -->
    <div class="mb-6">
      <h4 class="text-md font-medium mb-3">Butiran Peribadi</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormKit
          type="date"
          name="tarikh_lahir"
          label="Tarikh Lahir"
          help="Format: dd-mm-yyyy"
          :disabled="readOnly"
          validation="required"
          v-model="formData.tarikh_lahir"
        />

        <FormKit
          type="text"
          name="umur"
          label="Umur"
          validation="required"
          v-model="formData.umur"
          :disabled="true"
          help="Auto dikira daripada Tarikh Lahir"
        />

        <div :class="getFieldClasses('tempat_lahir')" class="p-2 rounded">
          <FormKit
            type="text"
            name="tempat_lahir"
            label="Tempat Lahir"
            :disabled="readOnly"
            validation="required"
            v-model="formData.tempat_lahir"
          />
        </div>

        <FormKit
          type="select"
          name="jantina"
          label="Jantina"
          :options="[
            { label: 'Lelaki', value: 'Lelaki' },
            { label: 'Perempuan', value: 'Perempuan' },
          ]"
          placeholder="Pilih Jantina"
          :disabled="readOnly"
          validation="required"
          v-model="formData.jantina"
        />

        <FormKit
          type="select"
          name="agama"
          label="Agama"
          :options="['Islam', 'Kristian', 'Buddha', 'Hindu', 'Lain-lain']"
          placeholder="Pilih Agama"
          :disabled="readOnly"
          validation="required"
          v-model="formData.agama"
        />

        <FormKit
          v-if="formData.agama === 'Lain-lain'"
          type="text"
          name="agama_lain"
          label="Agama Lain"
          :disabled="readOnly"
          validation="required"
          v-model="formData.agama_lain"
        />

        <FormKit
          type="select"
          name="bangsa"
          label="Bangsa"
          :options="['Melayu', 'Cina', 'India', 'Lain-lain']"
          validation="required"
          placeholder="Pilih Bangsa"
          :disabled="readOnly"
          v-model="formData.bangsa"
        />

        <FormKit
          v-if="formData.bangsa === 'Lain-lain'"
          type="text"
          name="bangsa_lain"
          label="Bangsa Lain"
          :disabled="readOnly"
          validation="required"
          v-model="formData.bangsa_lain"
        />

        <div :class="getFieldClasses('no_telefon_bimbit')" class="p-2 rounded">
          <FormKit
            type="number"
            name="no_telefon_bimbit"
            label="No Telefon Bimbit"
            placeholder="Contoh: 0123456789"
            validation="required"
            :validation-messages="{
              required: 'No Telefon Bimbit adalah wajib',
              matches:
                'Format nombor telefon tidak sah. Contoh: 0123456789',
            }"
            :disabled="readOnly"
            v-model="formData.no_telefon_bimbit"
          />
        </div>

        <div :class="getFieldClasses('emel')" class="p-2 rounded">
          <FormKit
            type="email"
            name="emel"
            label="Emel"
            validation="required|email"
            :disabled="readOnly"
            v-model="formData.emel"
          />
        </div>
      </div>
    </div>

    <!-- Marital Status Section -->
    <div class="mb-6" v-if="formData.jantina === 'Lelaki'">
      <h4 class="text-md font-medium mb-3">Status Perkahwinan</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div :class="getFieldClasses('status_perkahwinan')" class="p-2 rounded">
          <FormKit
            type="select"
            name="status_perkahwinan"
            placeholder="Pilih Status Perkahwinan"
            label="Status Perkahwinan"
            :options="[
              'Berkahwin',
              'Bujang',
              'Janda',
              'Ibu Tinggal',
              'Bapa Tinggal',
              'Duda',
              'Balu',
            ]"
            :disabled="readOnly"
            validation="required"
            v-model="formData.status_perkahwinan"
          />
        </div>

        <FormKit
          type="select"
          name="status_poligami"
          placeholder="Pilih Status Poligami"
          label="Status Poligami"
          :options="[
            { label: 'Tidak', value: 'tidak' },
            { label: 'Ya', value: 'ya' },
          ]"
          :disabled="readOnly"
          validation="required"
          v-model="formData.status_poligami"
        />

        <!-- Polygamy Information (Conditional) -->
        <div
          v-if="formData.status_poligami === 'ya'"
          class="md:col-span-2"
        >
          <FormKit
            type="select"
            name="bilangan_isteri"
            label="Bilangan Isteri"
            placeholder="Pilih bilangan isteri"
            validation="required"
            :options="[
              { label: '2', value: 2 },
              { label: '3', value: 3 },
              { label: '4', value: 4 },
            ]"
            :disabled="readOnly"
            v-model="formData.bilangan_isteri"
          />
          <div
            v-for="(isteri, idx) in isteriList"
            :key="idx"
            class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
          >
            <FormKit
              type="text"
              :name="`no_kp_isteri_${idx}`"
              :label="`No Kp Pasangan #${idx + 1}`"
              validation="required"
              :disabled="readOnly"
              v-model="formData.isteri_list[idx].no_kp"
            />
            <FormKit
              type="text"
              :name="`nama_isteri_${idx}`"
              :label="`Nama Pasangan #${idx + 1}`"
              validation="required"
              :disabled="readOnly"
              v-model="formData.isteri_list[idx].nama"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-3 mt-6" v-if="showFooterButtons">
      <rs-button
        type="button"
        variant="secondary"
        @click="$emit('save-step')"
        >Simpan</rs-button
      >
      <rs-button type="button" variant="primary" @click="$emit('next-step')"
        >Maklumat Alamat</rs-button
      >
    </div>
  </FormKit>
</template>

<script setup>
import { ref, watch } from 'vue';

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

// Countries options - moved from parent component
const getCountries = [
  "Malaysia",
  "Indonesia", 
  "Singapura",
  "Brunei",
  "Thailand",
]

// Isteri list management - moved from parent component
const isteriList = ref([]);

// Keep isteriList in sync with bilangan_isteri like in AS/FR/02
watch(
  () => props.formData.bilangan_isteri,
  (newVal) => {
    const count = parseInt(newVal) || 0;
    isteriList.value = Array(count).fill({});
    props.formData.isteri_list = Array(count).fill({ no_kp: "", nama: "" });
  }
);

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
const emit = defineEmits(['next-step', 'save-step'])
</script>

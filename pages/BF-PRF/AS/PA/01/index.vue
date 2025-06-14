<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Penilaian Awal(akan dipaparkan sekiranya saluran bantuan adalah selain bencana)</h2>
        </div>
      </template>

      <template #body>
        <div class="space-y-6">
          <!-- Question 1 -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              1. Adakah tuan/puan mempunyai komitmen dan pembiayaan melibatkan kos yang tinggi?*
            </label>
            <FormKit
              type="radio"
              v-model="formData.komitmenTinggi"
              :options="[
                { label: 'Ya', value: 'Y' },
                { label: 'Tidak', value: 'T' }
              ]"
              validation="required"
              validation-label="Jawapan"
            />
          </div>

          <!-- Question 2 -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              2. Apakah keperluan tuan/puan mendesak sekarang ini?*
            </label>
            <FormKit
              type="checkbox"
              v-model="formData.keperluanMendesak"
              :options="[
                { label: 'Perubatan Kritikal', value: 'perubatan', disabled: isTidakMendesakSelected },
                { label: 'Bencana', value: 'bencana', disabled: isTidakMendesakSelected },
                { label: 'Kematian', value: 'kematian', disabled: isTidakMendesakSelected },
                { label: 'Konflik Keluarga (tiada tempat bergantung)', value: 'konflik', disabled: isTidakMendesakSelected },
                { label: 'Tiada Tempat Tinggal', value: 'tiadaRumah', disabled: isTidakMendesakSelected },
                { label: 'Selain dari di atas', value: 'lain', disabled: isTidakMendesakSelected },
                { label: 'Tidak mendesak', value: 'tidakMendesak' }
              ]"
              validation="required|min:1"
              validation-label="Jawapan"
              validation-messages="{
                required: 'Sila pilih sekurang-kurangnya satu jawapan',
                min: 'Sila pilih sekurang-kurangnya satu jawapan'
              }"
              @input="handleKeperluanChange"
            />

            <!-- Additional input for "Selain dari di atas" -->
            <div v-if="showLainInput" class="mt-4">
              <FormKit
                type="text"
                v-model="formData.lainKeperluan"
                label="Sila nyatakan keperluan lain:"
                validation="required"
                validation-label="Keperluan lain"
                validation-messages="{
                  required: 'Sila nyatakan keperluan lain'
                }"
              />
            </div>
          </div>

          <!-- File Upload Section -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              3. Muat naik dokumen sokongan (PDF, JPG, PNG)*
            </label>
            <FormKit
              type="file"
              v-model="formData.documents"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB setiap fail"
              validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
              validation-label="Dokumen"
              validation-messages="{
                required: 'Sila muat naik sekurang-kurangnya satu dokumen',
                max: 'Saiz fail tidak boleh melebihi 5MB',
                mime: 'Format fail tidak dibenarkan'
              }"
            />
          </div>

          <!-- Next Button -->
          <div class="flex justify-end mt-6">
            <rs-button variant="primary" @click="handleNext">
              Seterusnya
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
  title: "Penilaian Awal",
});

const router = useRouter();

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/AS/PA/01",
  },
  {
    name: "Asnaf",
    type: "link",
    path: "/BF-PRF/AS/PA/01",
  },
  {
    name: "Penilaian Awal",
    type: "current",
    path: "/BF-PRF/AS/PA/01",
  },
]);

const formData = ref({
  komitmenTinggi: '',
  keperluanMendesak: [],
  lainKeperluan: '',
  documents: [],
});

// Computed property to check if "Tidak mendesak" is selected
const isTidakMendesakSelected = computed(() => {
  return formData.value.keperluanMendesak.includes('tidakMendesak');
});

// Computed property to show additional input for "Selain dari di atas"
const showLainInput = computed(() => {
  return formData.value.keperluanMendesak.includes('lain');
});

// Handle checkbox changes
const handleKeperluanChange = (value) => {
  // If "Tidak mendesak" is selected, clear all other selections
  if (value.includes('tidakMendesak')) {
    formData.value.keperluanMendesak = ['tidakMendesak'];
  }
  
  // If "Selain dari di atas" is unselected, clear the additional input
  if (!value.includes('lain')) {
    formData.value.lainKeperluan = '';
  }
};

const handleNext = () => {
  // Here you can add validation if needed
  // if (!formData.value.komitmenTinggi || !formData.value.keperluanMendesak.length) {
  //   alert('Sila lengkapkan semua medan yang diperlukan');
  //   return;
  // }

  // // Additional validation for "Selain dari di atas"
  // if (formData.value.keperluanMendesak.includes('lain') && !formData.value.lainKeperluan) {
  //   alert('Sila nyatakan keperluan lain');
  //   return;
  // }
  
  // Navigate to next page
  router.push('/BF-PRF/AS/FR/03');
};
</script>


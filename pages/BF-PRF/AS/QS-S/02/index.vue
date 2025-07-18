<template>
  <div>
    <!-- Breadcrumb Navigation -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Main Form Card -->
    <rs-card class="mt-4">
      <!-- Form Header -->
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Isi Borang Permohonan Online</h2>
        </div>
      </template>

      <!-- Form Body -->
      <template #body>
        <!-- Form Section -->
        <div class="mb-6">
          <FormKit type="form" :actions="false">
            <!-- Step 1: Penilaian Awal -->
            <div>
              <h3 class="text-lg font-medium mb-4">Penilaian Awal</h3>
              <div class="space-y-6">
                <!-- Question 1 -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    1. Adakah tuan/puan mempunyai komitmen dan pembiayaan melibatkan kos yang tinggi?*
                  </label>
                  <FormKit
                    type="radio"
                    v-model="formData.initialAssessment.komitmenTinggi"
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
                    v-model="formData.initialAssessment.keperluanMendesak"
                    :options="[
                      { label: 'Perubatan Kritikal', value: 'perubatan', disabled: isTidakMendesakSelected },
                      { label: 'Bencana', value: 'bencana', disabled: isTidakMendesakSelected },
                      { label: 'Kematian', value: 'kematian', disabled: isTidakMendesakSelected },
                      { label: 'Konflik Keluarga (tiada tempat bergantung)', value: 'konflik', disabled: isTidakMendesakSelected },
                      { label: 'Tiada Tempat Tinggal', value: 'tiadaRumah', disabled: isTidakMendesakSelected },
                      { label: 'Tunggakan Bil Utiliti', value: 'tunggakanUtiliti', disabled: isTidakMendesakSelected },
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
                      v-model="formData.initialAssessment.lainKeperluan"
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
                    v-model="formData.initialAssessment.documents"
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

                <div class="space-y-2">
                  <FormKit
                    type="textarea"
                    v-model="formData.initialAssessment.additionalNotes"
                    label="Catatan Tambahan"
                    placeholder="Sila masukkan sebarang catatan tambahan yang berkaitan dengan permohonan ini"
                    validation-label="Catatan tambahan"
                    validation-messages="{
                      required: 'Sila masukkan catatan tambahan'
                    }"
                  />
                </div>
              </div>

              <div class="flex justify-end gap-3">
                <rs-button type="button" variant="secondary" @click="handleSave">
                  Simpan
                </rs-button>
                <rs-button 
                  type="submit" 
                  variant="primary" 
                  @click="showSelectionModal = true"
                  :disabled="!isFormSaved"
                >
                  Pilih Jenis Permohonan
                </rs-button>
              </div>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>

    <!-- Selection Modal -->
    <rs-modal
      v-model="showSelectionModal"
      title="Pilih Jenis Permohonan"
      size="lg"
      position="center"
      :overlay-close="false"
      :hide-footer="true"
      dialog-class="max-w-2xl"
    >
      <template #body>
        <div class="text-center p-6">
          <div class="flex justify-center mb-6">
            <div class="bg-blue-100 rounded-full p-4">
              <Icon
                name="material-symbols:help-outline"
                class="text-blue-600"
                size="48"
              />
            </div>
          </div>
          <h3 class="text-xl font-semibold mb-4 text-gray-800">
            Sila pilih jenis permohonan anda
          </h3>
          <p class="text-gray-600 mb-8 text-base">
            Setelah menilai keperluan awal anda, sila pilih jenis permohonan yang sesuai.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              class="border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all duration-300 transform hover:scale-105"
              :class="{ 'border-orange-500 bg-orange-50 shadow-lg': selectedType === 'bencana' }"
              @click="selectType('bencana')"
            >
              <div class="flex flex-col items-center">
                <div class="bg-orange-100 rounded-full p-3 mb-4">
                  <Icon
                    name="material-symbols:warning"
                    class="text-orange-600"
                    size="32"
                  />
                </div>
                <h4 class="font-semibold text-gray-800 mb-3 text-lg">Bencana</h4>
              </div>
            </div>
            
            <div 
              class="border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all duration-300 transform hover:scale-105"
              :class="{ 'border-green-500 bg-green-50 shadow-lg': selectedType === 'lain-lain' }"
              @click="selectType('lain-lain')"
            >
              <div class="flex flex-col items-center">
                <div class="bg-green-100 rounded-full p-3 mb-4">
                  <Icon
                    name="material-symbols:person"
                    class="text-green-600"
                    size="32"
                  />
                </div>
                <h4 class="font-semibold text-gray-800 mb-3 text-lg">Lain-lain</h4>
              </div>
            </div>
          </div>
          
          <!-- <div class="mt-8">
            <rs-button 
              variant="primary" 
              @click="confirmSelection"
              :disabled="!selectedType"
              class="w-full md:w-auto px-8 py-3 text-base font-medium"
              size="lg"
            >
              <Icon name="material-symbols:arrow-forward" class="mr-2" />
              Teruskan
            </rs-button>
          </div> -->
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const toast = useToast();
const router = useRouter();

definePageMeta({
  title: "Isi Permohonan Ringkas",
});

const showSelectionModal = ref(false);
const selectedType = ref('');
const isFormSaved = ref(false);

const breadcrumb = ref([
  {
    name: "Borang Permohonan Perseorangan",
    type: "current",
    path: "/BF-PRF/AS/QS-S/02",
  },
]);

const formData = ref({
  initialAssessment: {
    komitmenTinggi: '',
    keperluanMendesak: [],
    lainKeperluan: '',
    documents: [],
    additionalNotes: '',
  },
});

const isTidakMendesakSelected = computed(() => {
  return formData.value.initialAssessment.keperluanMendesak.includes('tidakMendesak');
});

const showLainInput = computed(() => {
  return formData.value.initialAssessment.keperluanMendesak.includes('lain');
});

const handleKeperluanChange = (value) => {
  if (value.includes('tidakMendesak')) {
    formData.value.initialAssessment.keperluanMendesak = ['tidakMendesak'];
  }
  
  if (!value.includes('lain')) {
    formData.value.initialAssessment.lainKeperluan = '';
  }
};

const handleSave = async () => {
  try {
    console.log("Data form saved:", formData.value.initialAssessment);
    isFormSaved.value = true;
    toast.success("Data berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Data tidak berjaya disimpan");
    console.error("Save error:", error);
  }
};

const selectType = (type) => {
  selectedType.value = type;
  
  // Redirect immediately based on selection
  if (type === 'bencana') {
    router.push('/BF-PRF/AS/QS-S/02/selfbencana');
  } else if (type === 'lain-lain') {
    router.push('/BF-PRF/AS/QS-S/02/selflain');
  }
};

const confirmSelection = () => {
  if (selectedType.value) {
    showSelectionModal.value = false;
    
    if (selectedType.value === 'bencana') {
      router.push('/BF-PRF/AS/QS-S/02/selfbencana');
      return;
    } else if (selectedType.value === 'lain-lain') {
      router.push('/BF-PRF/AS/QS-S/02/selflain');
      return;
    }
  }
};

onMounted(() => {
  showSelectionModal.value = false;
  selectedType.value = '';
  isFormSaved.value = false;
});
</script>

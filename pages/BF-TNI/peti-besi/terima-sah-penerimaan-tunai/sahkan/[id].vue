<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Borang Sahkan Penerimaan</h2>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          @submit="handleSubmit"
          :actions="false"
          class="max-w-2xl mx-auto"
          v-model="formData"
        >
          <div class="grid grid-cols-1 gap-4">
            <!-- Kod Cawangan / Peti Besi -->
            <FormKit
              type="text"
              name="kodCawangan"
              label="Kod Cawangan / Peti Besi"
              :disabled="true"
              :value="instructionData.kodCawangan"
            />

            <!-- Jenis Akaun Peti Besi -->
            <FormKit
              type="text"
              name="jenisAkaun"
              label="Jenis Akaun Peti Besi"
              :disabled="true"
              :value="instructionData.jenisAkaun"
            />

            <!-- Jumlah Tunai (RM) -->
            <FormKit
              type="number"
              name="jumlahTunai"
              label="Jumlah Tunai (RM)"
              validation="required|min:0"
              :validation-messages="{
                required: 'Jumlah tunai adalah wajib',
                min: 'Jumlah tidak boleh negatif',
              }"
              :value="instructionData.jumlahTunai"
            />

            <!-- Tarikh & Masa Penerimaan -->
            <FormKit
              type="datetime-local"
              name="tarikhMasaPenerimaan"
              label="Tarikh & Masa Penerimaan"
              validation="required"
              :validation-messages="{
                required: 'Tarikh dan masa penerimaan adalah wajib',
              }"
              :value="currentDateTime"
            />

            <!-- Nama Penerima -->
            <FormKit
              type="text"
              name="namaPenerima"
              label="Nama Penerima"
              :disabled="true"
              :value="currentUserName"
            />

            <!-- Rujukan Rekod / Surat Arahan -->
            <FormKit
              type="text"
              name="rujukan"
              label="Rujukan Rekod / Surat Arahan"
              :disabled="true"
              :value="instructionData.rujukan"
            />

            <!-- Catatan Tambahan -->
            <FormKit
              type="textarea"
              name="catatanTambahan"
              label="Catatan Tambahan"
              placeholder="Masukkan catatan tambahan jika ada..."
            />

            <!-- Status Terimaan -->
            <FormKit
              type="text"
              name="statusTerimaan"
              label="Status Terimaan"
              :disabled="true"
              value="Diterima"
            />

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-2 mt-6">
              <rs-button variant="secondary" @click="handleCancel">
                Batal
              </rs-button>
              <rs-button
                variant="primary"
                type="submit"
                :loading="isSubmitting"
                @click="handleSubmit"
              >
                Sahkan Penerimaan
              </rs-button>
            </div>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Sahkan Penerimaan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-4">
          <p class="text-gray-600">
            Adakah anda pasti untuk meneruskan dengan pengesahan penerimaan ini?
          </p>
          
          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="font-medium">Kod Cawangan:</span>
              <span>{{ formData.kodCawangan }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Jenis Akaun:</span>
              <span>{{ formData.jenisAkaun }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Jumlah Tunai:</span>
              <span>RM {{ formData.jumlahTunai }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Nama Penerima:</span>
              <span>{{ formData.namaPenerima }}</span>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="primary-outline"
            @click="showConfirmationModal = false"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            :loading="isSubmitting"
            @click="proceedWithSubmission"
          >
            Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  title: "Borang Sahkan Penerimaan",
});

const route = useRoute();
const router = useRouter();
const isSubmitting = ref(false);

const breadcrumb = ref([
  {
    name: "Pentadbiran",
    type: "link",
    path: "/BF-TNI/peti-besi",
  },
  {
    name: "Peti Besi",
    type: "link",
    path: "/BF-TNI/peti-besi",
  },
  {
    name: "Terima & Sahkan Penerimaan Tunai",
    type: "link",
    path: "/BF-TNI/peti-besi/terima-sah-penerimaan-tunai",
  },
  {
    name: "Borang Sahkan Penerimaan",
    type: "current",
    path: route.path,
  },
]);

// Mock data - In real application, this would be fetched from API
const instructionData = ref({
  kodCawangan: "PB001",
  jenisAkaun: "Amil",
  jumlahTunai: 5000,
  rujukan: "KT-04-2024-001"
});

// Current user data - In real application, this would come from auth store
const currentUserName = ref("Ahmad bin Abdullah");
const currentDateTime = ref(new Date().toISOString().slice(0, 16));

// Form data
const formData = ref({
  kodCawangan: "",
  jenisAkaun: "",
  jumlahTunai: 0,
  tarikhMasaPenerimaan: "",
  namaPenerima: "",
  rujukan: "",
  catatanTambahan: "",
  statusTerimaan: "Diterima"
});

const showConfirmationModal = ref(false);
const pendingFormData = ref(null);

// Methods
const handleSubmit = async (formData) => {
  pendingFormData.value = formData;
  showConfirmationModal.value = true;
};

const proceedWithSubmission = async () => {
  try {
    isSubmitting.value = true;
    // TODO: Implement API call to save the data
    console.log("Form submitted:", pendingFormData.value);

    // Show success message
    alert("Penerimaan tunai berjaya disahkan");

    // Close modal
    showConfirmationModal.value = false;

    // Navigate back to list page
    router.push("/BF-TNI/peti-besi/terima-sah-penerimaan-tunai");
  } catch (error) {
    console.error("Error saving data:", error);
    alert("Ralat semasa menyimpan data");
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  router.push("/BF-TNI/peti-besi/terima-sah-penerimaan-tunai");
};

// Initialize form data
onMounted(() => {
  // In real application, fetch instruction data from API using route.params.id
  formData.value = {
    ...formData.value,
    kodCawangan: instructionData.value.kodCawangan,
    jenisAkaun: instructionData.value.jenisAkaun,
    jumlahTunai: instructionData.value.jumlahTunai,
    rujukan: instructionData.value.rujukan,
    namaPenerima: currentUserName.value,
    tarikhMasaPenerimaan: currentDateTime.value
  };
});
</script>

<style lang="scss" scoped></style> 
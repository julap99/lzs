<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">
        Kelulusan Pemulangan Tunai
      </h1>
      <p class="mt-2 text-sm text-gray-600">
        Borang kelulusan permohonan pemulangan tunai
      </p>
    </div>

    <rs-card class="py-5">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Borang Kelulusan (PT-02)</h2>
          <rs-badge variant="warning">
            {{ applicationData?.status || "Menunggu Kelulusan" }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <div class="space-y-8">
          <!-- Header Info Section -->
          <div>
            <h3 class="text-lg font-medium mb-4">Maklumat Permohonan</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1">
                <div class="text-sm text-gray-500">
                  ID Permohonan Pemulangan Tunai
                </div>
                <div class="font-medium">
                  {{ applicationData?.idPermohonan }}
                </div>
              </div>

              <div class="space-y-1">
                <div class="text-sm text-gray-500">Nama & No KP Pemohon</div>
                <div class="font-medium">
                  {{ applicationData?.namaPemohon }}
                </div>
                <div class="text-sm text-gray-600">
                  {{ applicationData?.noKpPemohon }}
                </div>
              </div>

              <div class="space-y-1">
                <div class="text-sm text-gray-500">Lokasi / Unit Peti Besi</div>
                <div class="font-medium">{{ applicationData?.lokasi }}</div>
              </div>

              <div class="space-y-1">
                <div class="text-sm text-gray-500">
                  Tarikh & Masa Permohonan
                </div>
                <div class="font-medium">
                  {{ applicationData?.tarikhPermohonan }}
                </div>
              </div>
            </div>
          </div>

          <!-- Application Details Section -->
          <div>
            <h3 class="text-lg font-medium mb-4">Maklumat Permohonan</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1">
                <div class="text-sm text-gray-500">Jumlah Dipulangkan (RM)</div>
                <div class="font-medium">
                  {{ applicationData?.jumlahDipulangkan }}
                </div>
              </div>

              <div class="space-y-1">
                <div class="text-sm text-gray-500">Tujuan Asal Penggunaan</div>
                <div class="font-medium">{{ applicationData?.tujuanAsal }}</div>
              </div>

              <div class="space-y-1">
                <div class="text-sm text-gray-500">
                  Tarikh & Masa Serahan Fizikal
                </div>
                <div class="font-medium">
                  {{ applicationData?.tarikhSerahan }}
                </div>
              </div>

              <div class="space-y-1">
                <div class="text-sm text-gray-500">Catatan Tambahan</div>
                <div class="font-medium">
                  {{ applicationData?.catatan || "-" }}
                </div>
              </div>
            </div>
          </div>

          <!-- Approval Form Section -->
          <div>
            <h3 class="text-lg font-medium mb-4">Keputusan Pelulus</h3>
            <FormKit
              type="form"
              id="approvalForm"
              :actions="false"
              @submit="showConfirmation"
              v-model="approvalForm"
            >
              <FormKit
                type="radio"
                name="keputusan"
                validation="required"
                :options="[
                  { label: 'Lulus', value: 'lulus' },
                  { label: 'Tolak', value: 'tolak' },
                ]"
                :validation-messages="{
                  required: 'Sila pilih keputusan kelulusan',
                }"
              />

              <FormKit
                type="textarea"
                name="catatan"
                label="Catatan / Ulasan Pelulus (jika ada)"
                placeholder="Masukkan catatan atau ulasan (opsyenal)"
                rows="3"
              />

              <div class="flex justify-end space-x-3 mt-6">
                <rs-button variant="primary-outline" @click="navigateToList">
                  Kembali ke Senarai
                </rs-button>

                <rs-button
                  variant="primary"
                  type="submit"
                  :loading="isSubmitting"
                  @click="showConfirmation"
                >
                  Sahkan Keputusan
                </rs-button>
              </div>
            </FormKit>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal v-model="showModal" title="Sahkan Keputusan" position="center">
      <template #body>
        <p class="text-gray-600">
          Adakah anda pasti untuk {{ approvalForm.keputusan === 'lulus' ? 'meluluskan' : 'menolak' }} permohonan ini?
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <rs-button variant="primary-outline" @click="showModal = false">
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            :loading="isSubmitting"
            @click="handleSubmit"
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
import { useToast } from "vue-toastification";

definePageMeta({
  title: "Kelulusan Pemulangan Tunai",
  description: "Borang kelulusan permohonan pemulangan tunai",
});

const route = useRoute();
const router = useRouter();
const toast = useToast();

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Pemulangan Tunai",
    type: "link",
    path: "/BF-TNI/pemulangan-tunai",
  },
  {
    name: "Kelulusan",
    type: "link",
    path: "/BF-TNI/pemulangan-tunai/kelulusan",
  },
  {
    name: "Borang Kelulusan",
    type: "current",
    path: `/BF-TNI/pemulangan-tunai/kelulusan/${route.params.id}`,
  },
]);

// Application data
const applicationData = ref(null);
const isSubmitting = ref(false);
const approvalForm = ref({
  keputusan: "",
  catatan: "",
});

// Add modal state
const showModal = ref(false);

// Mock data - would be replaced with API call
onMounted(async () => {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    applicationData.value = {
      idPermohonan: "PT-2024-001",
      namaPemohon: "Ahmad bin Abdullah",
      noKpPemohon: "901231-01-2345",
      lokasi: "Cawangan Kuala Lumpur",
      tarikhPermohonan: "2024-03-20 14:30",
      jumlahDipulangkan: "1,500.00",
      tujuanAsal: "Pembayaran Zakat Fitrah",
      tarikhSerahan: "2024-03-20 14:00",
      catatan: "Serahan dibuat di kaunter utama",
      status: "Menunggu Kelulusan",
    };
  } catch (error) {
    toast.error("Ralat semasa memuatkan maklumat permohonan");
  }
});

// Update methods
const showConfirmation = () => {
  showModal.value = true;
};

const handleSubmit = async () => {
  isSubmitting.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Keputusan berjaya dihantar");
    showModal.value = false;
    navigateToList();
  } catch (error) {
    toast.error("Ralat semasa menghantar keputusan");
  } finally {
    isSubmitting.value = false;
  }
};

const navigateToList = () => {
  router.push("/BF-TNI/pemulangan-tunai/kelulusan");
};
</script>

<style lang="scss" scoped>
// Add any custom styles here if needed
</style>

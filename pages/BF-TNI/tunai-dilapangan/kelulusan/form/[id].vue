<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Form Kelulusan Permohonan Tunai Lapangan (TD-02)
          </h2>
        </div>
      </template>

      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSubmit">
          <!-- Section 1: Maklumat Permohonan & Justifikasi -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold mb-4">
              Maklumat Permohonan & Justifikasi
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="text"
                label="ID Permohonan"
                v-model="formData.idPermohonan"
                disabled
              />
              <FormKit
                type="text"
                label="Nama & No KP Pemohon (EOAD)"
                v-model="formData.namaPemohon"
                disabled
              />
              <FormKit
                type="text"
                label="Jumlah Tunai Dimohon (RM)"
                v-model="formData.jumlahTunai"
                disabled
              />
              <FormKit
                type="text"
                label="Baki Peti Besi Semasa"
                v-model="formData.bakiPetiBesi"
                disabled
              />
              <FormKit
                type="text"
                label="Lokasi / Laluan Agihan"
                v-model="formData.lokasiAgihan"
                disabled
              />
              <FormKit
                type="textarea"
                label="Tujuan Bantuan / Catatan Tambahan"
                v-model="formData.tujuanBantuan"
                disabled
                :rows="3"
              />
            </div>

            <!-- Sejarah Kelulusan Terdahulu -->
            <div class="mt-6">
              <h4 class="text-md font-medium mb-2">
                Sejarah Kelulusan Terdahulu
              </h4>
              <rs-table
                :data="sejarahKelulusan"
                :options="{
                  variant: 'default',
                  hover: true,
                }"
              >
                <template v-slot:tarikh="data">
                  {{ formatDate(data.text) }}
                </template>
                <template v-slot:jumlah="data">
                  RM {{ formatNumber(data.text) }}
                </template>
                <template v-slot:status="data">
                  <rs-badge :variant="getStatusVariant(data.text)">
                    {{ data.text }}
                  </rs-badge>
                </template>
              </rs-table>
            </div>
          </div>

          <!-- Section 2: Maklumat Kelulusan -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold mb-4">Maklumat Kelulusan</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="text"
                label="Nama Pegawai Pelulus"
                v-model="formData.namaPelulus"
                disabled
              />
              <FormKit
                type="text"
                label="Tarikh & Masa Kelulusan"
                v-model="formData.tarikhKelulusan"
                disabled
              />

              <div class="">
                <h6 class="text-sm font-semibold mb-2">Status permohonan</h6>
                <FormKit
                  type="radio"
                  v-model="formData.statusPermohonan"
                  :options="[
                    { label: 'Diluluskan', value: 'Diluluskan' },
                    { label: 'Ditolak', value: 'Ditolak' },
                  ]"
                  validation="required"
                  :validation-messages="{
                    required: 'Sila pilih status permohonan',
                  }"
                />
              </div>

              <FormKit
                v-if="formData.statusPermohonan === 'Ditolak'"
                type="textarea"
                label="Sebab Penolakan"
                v-model="formData.sebabPenolakan"
                :rows="3"
                validation="required"
                :validation-messages="{
                  required: 'Sila nyatakan sebab penolakan',
                }"
              />
            </div>
          </div>

          <!-- Section 3: Action Buttons -->
          <div class="flex justify-end space-x-4">
            <rs-button variant="primary-outline" @click="navigateBack">
              Kembali ke Senarai
            </rs-button>
            <rs-button
              v-if="formData.statusPermohonan === 'Diluluskan'"
              variant="primary"
              type="submit"
              :loading="isSubmitting"
              @click="showConfirmModal = true"
            >
              Luluskan
            </rs-button>
            <rs-button
              v-else-if="formData.statusPermohonan === 'Ditolak'"
              variant="danger"
              type="submit"
              :loading="isSubmitting"
              @click="showConfirmModal = true"
            >
              Tolak Permohonan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal v-model="showConfirmModal" title="Pengesahan" size="md" position="center">
      <template #body>
        <div class="text-center">
          <p class="mb-4">
            Adakah anda pasti untuk
            {{
              formData.statusPermohonan === "Diluluskan"
                ? "meluluskan"
                : "menolak"
            }}
            permohonan ini?
          </p>
          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">ID Permohonan:</span>
              <span class="font-medium">{{ formData.idPermohonan }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Jumlah Tunai:</span>
              <span class="font-medium"
                >RM {{ formatNumber(formData.jumlahTunai) }}</span
              >
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Status:</span>
              <span class="font-medium">{{ formData.statusPermohonan }}</span>
            </div>
            <div
              v-if="formData.statusPermohonan === 'Ditolak'"
              class="flex justify-between"
            >
              <span class="text-gray-600">Sebab Penolakan:</span>
              <span class="font-medium">{{ formData.sebabPenolakan }}</span>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center space-x-4">
          <rs-button variant="secondary" @click="showConfirmModal = false">
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="confirmSubmit"
            :disabled="isSubmitting"

          >
            Ya
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
  title: "Form Kelulusan Permohonan Tunai Lapangan",
  middleware: ["auth"],
  requiresAuth: true,
});

const route = useRoute();
const router = useRouter();
const toast = useToast();

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Tunai Dilapangan",
    type: "link",
    path: "/BF-TNI/tunai-dilapangan",
  },
  {
    name: "Kelulusan",
    type: "link",
    path: "/BF-TNI/tunai-dilapangan/kelulusan",
  },
  {
    name: "Form Kelulusan",
    type: "current",
    path: `/BF-TNI/tunai-dilapangan/kelulusan/form/${route.params.id}`,
  },
]);

// Form data
const formData = ref({
  idPermohonan: "",
  namaPemohon: "",
  jumlahTunai: "",
  bakiPetiBesi: "",
  lokasiAgihan: "",
  tujuanBantuan: "",
  namaPelulus: "John Doe", // This should come from your auth system
  tarikhKelulusan: new Date().toLocaleString("ms-MY"),
  statusPermohonan: "",
  sebabPenolakan: "",
});

// Sejarah Kelulusan
const sejarahKelulusan = ref([
  {
    tarikh: new Date().toISOString(),
    jumlah: 3000,
    status: "Diluluskan",
  },
  {
    tarikh: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    jumlah: 2000,
    status: "Diluluskan",
  },
]);

// Modal state
const showConfirmModal = ref(false);
const isSubmitting = ref(false);

// Methods
const handleSubmit = () => {
  showConfirmModal.value = true;
};

const confirmSubmit = async () => {
  try {
    isSubmitting.value = true;
    // Implement your API call here
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call

    toast.success(
      `Permohonan berjaya ${
        formData.value.statusPermohonan === "Diluluskan"
          ? "diluluskan"
          : "ditolak"
      }`
    );
    navigateTo("/BF-TNI/tunai-dilapangan/kelulusan");
  } catch (error) {
    toast.error("Ralat telah berlaku. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
    showConfirmModal.value = false;
  }
};

const navigateBack = () => {
  router.push("/BF-TNI/tunai-dilapangan/kelulusan");
};

// Helper functions
const formatNumber = (number) => {
  return new Intl.NumberFormat("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getStatusVariant = (status) => {
  switch (status) {
    case "Diluluskan":
      return "success";
    case "Ditolak":
      return "danger";
    default:
      return "default";
  }
};

// Fetch data on mount
onMounted(async () => {
  try {
    // Implement your API call here to fetch application details
    // For now, using mock data
    formData.value = {
      ...formData.value,
      idPermohonan: route.params.id,
      namaPemohon: "Ahmad bin Abdullah (880101-01-1234)",
      jumlahTunai: 5000,
      bakiPetiBesi: 15000,
      lokasiAgihan: "Lokasi A",
      tujuanBantuan: "Bantuan kewangan untuk asnaf fakir",
    };
  } catch (error) {
    toast.error("Ralat telah berlaku semasa mengambil data permohonan");
    navigateTo("/BF-TNI/tunai-dilapangan/kelulusan");
  }
});
</script>

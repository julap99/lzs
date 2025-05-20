<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Kelulusan Permohonan Bantuan (Pelulus)
          </h2>
          <rs-badge :variant="getStatusBadgeVariant()">
            {{ applicationData?.status || "Menunggu Kelulusan" }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <FormKit
            type="form"
            id="approvalForm"
            @submit="handleSubmit"
            :actions="false"
            v-model="formData"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Maklumat Pemohon -->
              <div class="md:col-span-2">
                <h3 class="text-lg font-semibold mb-4">Maklumat Pemohon</h3>
              </div>

              <FormKit
                type="text"
                name="namaPemohon"
                label="Nama Pemohon"
                v-model="applicationData.namaPemohon"
                disabled
              />

              <FormKit
                type="text"
                name="noKadPengenalan"
                label="No. Kad Pengenalan"
                v-model="applicationData.noKadPengenalan"
                disabled
              />

              <FormKit
                type="textarea"
                name="alamat"
                label="Alamat & Lokasi Bantuan"
                v-model="applicationData.alamat"
                disabled
                rows="3"
              />

              <FormKit
                type="text"
                name="jenisBantuan"
                label="Jenis Bantuan"
                v-model="applicationData.jenisBantuan"
                disabled
              />

              <FormKit
                type="text"
                name="jumlahBantuan"
                label="Amaun Bantuan Dicadangkan (RM)"
                v-model="applicationData.jumlahBantuan"
                disabled
              />

              <FormKit
                type="text"
                name="tarikhPermohonan"
                label="Tarikh Permohonan"
                v-model="applicationData.tarikhPermohonan"
                disabled
              />

              <!-- Dokumen Sokongan -->
              <div class="md:col-span-2">
                <h4 class="text-md font-semibold mb-2">Dokumen Sokongan</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    v-for="(doc, index) in applicationData.dokumenSokongan"
                    :key="index"
                    class="flex justify-between items-center p-3 bg-white border rounded-md"
                  >
                    <div class="flex items-center">
                      <Icon
                        name="mdi:file-document-outline"
                        size="1.5rem"
                        class="text-blue-600 mr-3"
                      />
                      <div>
                        <p class="font-medium">{{ doc.name }}</p>
                        <p class="text-sm text-gray-500">{{ doc.size }}</p>
                      </div>
                    </div>
                    <rs-button
                      variant="secondary-outline"
                      size="sm"
                      @click="downloadDocument(doc)"
                    >
                      <Icon name="mdi:download" size="1rem" class="mr-1" />
                      Muat Turun
                    </rs-button>
                  </div>
                </div>
              </div>

              <!-- Maklumat Kelulusan -->
              <div class="md:col-span-2">
                <h3 class="text-lg font-semibold mb-4">Maklumat Kelulusan</h3>
              </div>

              <FormKit
                type="select"
                name="status"
                label="Status Kelulusan"
                :options="[
                  { label: 'Lulus', value: 'LULUS' },
                  { label: 'Tidak Lulus', value: 'TIDAK_LULUS' },
                ]"
                validation="required"
                :validation-messages="{
                  required: 'Status kelulusan diperlukan',
                }"
              />

              <FormKit
                type="text"
                name="namaPelulus"
                label="Nama Pelulus"
                :value="userData.nama"
                disabled
              />

              <FormKit
                v-if="formData.status === 'TIDAK_LULUS'"
                type="textarea"
                name="justifikasiPenolakan"
                label="Justifikasi Penolakan"
                placeholder="Masukkan justifikasi penolakan"
                validation="required"
                :validation-messages="{
                  required: 'Justifikasi penolakan diperlukan',
                }"
                rows="4"
                class="md:col-span-2"
              />
            </div>

            <!-- Submit Button -->
            <div class="mt-6 flex justify-end space-x-3">
              <rs-button variant="primary-outline" @click="goBack">
                Kembali
              </rs-button>
              <rs-button
                type="submit"
                variant="primary"
                :loading="isSubmitting"
                @click="showConfirmationModal = true"
              >
                Hantar Kelulusan
              </rs-button>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      title="Pengesahan Kelulusan"
      v-model="showConfirmationModal"
      ok-title="Sahkan"
      cancel-title="Batal"
      position="center"
    >
      <template #body>
        <p class="mb-4">
          Adakah anda pasti untuk
          {{ formData.status === "LULUS" ? "meluluskan" : "menolak" }}
          permohonan ini?
        </p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="font-medium">
            Nama Pemohon: {{ applicationData.namaPemohon }}
          </p>
          <p class="font-medium">
            No. Kad Pengenalan: {{ applicationData.noKadPengenalan }}
          </p>
          <p class="font-medium">
            Jenis Bantuan: {{ applicationData.jenisBantuan }}
          </p>
          <p class="font-medium">
            Jumlah Bantuan: RM {{ applicationData.jumlahBantuan }}
          </p>
          <p class="text-sm text-gray-600 mt-2">
            Pastikan status kelulusan yang dipilih adalah tepat sebelum
            mengesahkan.
          </p>
        </div>
      </template>

      <template #footer>
        <rs-button
          @click="showConfirmationModal = false"
          :disabled="isSubmitting"
          variant="primary-outline"
        >
          Batal
        </rs-button>

        <rs-button @click="handleConfirm()" :disabled="isSubmitting">
          <span v-if="isSubmitting">
            <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
          </span>
          <span v-else>Sahkan</span>
        </rs-button>
      </template>
    </rs-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "vue-toastification";

interface ApplicationData {
  namaPemohon: string;
  noKadPengenalan: string;
  alamat: string;
  jenisBantuan: string;
  jumlahBantuan: string;
  tarikhPermohonan: string;
  status: string;
  dokumenSokongan: Array<{ name: string; url: string; size: string }>;
}

interface UserData {
  nama: string;
}

const router = useRouter();
const route = useRoute();
const toast = useToast();

const breadcrumb = ref([
  {
    name: "Pengurusan Tunai",
    type: "link",
    path: `/BF-PTPC/PC/TD/01`,
  },
  {
    name: "Tunai Dilapangan",
    type: "link",
    path: `/BF-PTPC/PC/TD/01`,
  },
  {
    name: "Kelulusan Permohonan (Pelulus)",
    type: "current",
    path: "/BF-PTPC/PC/TD/03",
  },
]);

const formData = ref({
  status: "",
  justifikasiPenolakan: "",
});

const applicationData = ref<ApplicationData>({
  namaPemohon: "Ahmad bin Abdullah",
  noKadPengenalan: "901231012345",
  alamat: "No. 123, Jalan Contoh, 50000 Kuala Lumpur",
  jenisBantuan: "Bantuan Kewangan",
  jumlahBantuan: "1000.00",
  tarikhPermohonan: "2024-03-20",
  status: "Menunggu Kelulusan",
  dokumenSokongan: [
    {
      name: "Dokumen Sokongan 1.pdf",
      url: "#",
      size: "2.4 MB",
    },
    {
      name: "Gambar 1.jpg",
      url: "#",
      size: "1.8 MB",
    },
  ],
});

const userData = ref<UserData>({
  nama: "Mohd Ali bin Abu",
});

const isSubmitting = ref(false);
const showConfirmationModal = ref(false);

const getStatusBadgeVariant = () => {
  switch (applicationData.value?.status) {
    case "LULUS":
      return "success";
    case "TIDAK_LULUS":
      return "danger";
    case "Menunggu Kelulusan":
      return "warning";
    default:
      return "info";
  }
};

const downloadDocument = (doc: { url: string; name: string }) => {
  // Implement document download logic
  window.open(doc.url, "_blank");
};

const goBack = () => {
  router.push("/BF-PTPC/PC/TD/01");
};

onMounted(async () => {
  // No need to set mock data here anymore
});

const handleSubmit = async (formData: any) => {
  showConfirmationModal.value = true;
};

const handleConfirm = async () => {
  try {
    isSubmitting.value = true;

    // Validate justification if rejected
    if (
      formData.value.status === "TIDAK_LULUS" &&
      !formData.value.justifikasiPenolakan
    ) {
      alert("Sila masukkan justifikasi penolakan");
      return;
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update local status
    if (applicationData.value) {
      applicationData.value.status = formData.value.status;
    }

    // Show success message
    alert("Permohonan berjaya ditolak");

    // Redirect back to list
    navigateTo("/BF-PTPC/PC/TD/04");
  } catch (error) {
    console.error("Error submitting approval:", error);
    alert("Ralat semasa menghantar kelulusan");
  } finally {
    isSubmitting.value = false;
    showConfirmationModal.value = false;
  }
};
</script>

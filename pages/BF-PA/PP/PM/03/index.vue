<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="flex justify-between items-center mt-4">
      <h2 class="text-xl font-semibold">Pengesahan PIC Masjid Baharu</h2>
      <div class="flex space-x-2">
        <rs-badge
          v-if="picData.status === 'Menunggu Kelulusan'"
          variant="warning"
        >
          Menunggu Kelulusan
        </rs-badge>
        <rs-badge v-else-if="picData.status === 'Diluluskan'" variant="success">
          Diluluskan
        </rs-badge>
        <rs-badge v-else-if="picData.status === 'Ditolak'" variant="danger">
          Ditolak
        </rs-badge>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
      <!-- Main Details Card -->
      <div class="md:col-span-2">
        <rs-card>
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="font-medium">Maklumat Permohonan</h3>
              <div class="text-sm text-gray-500">
                ID Permohonan: #{{ picData.id }}
              </div>
            </div>
          </template>

          <template #body>
            <!-- Section: Maklumat Masjid -->
            <div class="border-b pb-4">
              <h4 class="text-lg font-medium mb-4">Maklumat Masjid</h4>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <div class="text-sm text-gray-500">Kod Masjid</div>
                  <div>{{ picData.kodMasjid }}</div>
                </div>

                <div class="space-y-1">
                  <div class="text-sm text-gray-500">Nama Masjid</div>
                  <div>{{ picData.namaMasjid }}</div>
                </div>

                <div class="space-y-1">
                  <div class="text-sm text-gray-500">Negeri</div>
                  <div>{{ getNegeriLabel(picData.negeri) }}</div>
                </div>

                <div class="space-y-1">
                  <div class="text-sm text-gray-500">Daerah</div>
                  <div>{{ picData.daerah }}</div>
                </div>

                <div class="space-y-1 md:col-span-2">
                  <div class="text-sm text-gray-500">Alamat</div>
                  <div>{{ picData.alamat }}</div>
                </div>

                <div class="space-y-1">
                  <div class="text-sm text-gray-500">Poskod</div>
                  <div>{{ picData.poskod }}</div>
                </div>
              </div>
            </div>

            <!-- Section: Maklumat PIC -->
            <div class="border-b py-4">
              <h4 class="text-lg font-medium mb-4">
                Maklumat Pegawai Perhubungan (PIC)
              </h4>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <div class="text-sm text-gray-500">Nama PIC</div>
                  <div>{{ picData.namaPIC }}</div>
                </div>

                <div class="space-y-1">
                  <div class="text-sm text-gray-500">No. Kad Pengenalan</div>
                  <div>{{ formatKP(picData.noKP) }}</div>
                </div>

                <div class="space-y-1">
                  <div class="text-sm text-gray-500">Jawatan</div>
                  <div>{{ picData.jawatan }}</div>
                </div>

                <div class="space-y-1">
                  <div class="text-sm text-gray-500">No. Telefon</div>
                  <div>{{ picData.noTelefon }}</div>
                </div>

                <div class="space-y-1">
                  <div class="text-sm text-gray-500">Emel</div>
                  <div>{{ picData.emel }}</div>
                </div>
              </div>
            </div>

            <!-- Section: Maklumat Pemohon -->
            <div class="pt-4">
              <h4 class="text-lg font-medium mb-4">Maklumat Pemohon</h4>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <div class="text-sm text-gray-500">Nama Pemohon</div>
                  <div>{{ picData.namaPemohon }}</div>
                </div>

                <div class="space-y-1">
                  <div class="text-sm text-gray-500">Jawatan Pemohon</div>
                  <div>{{ picData.jawatanPemohon }}</div>
                </div>

                <div class="space-y-1">
                  <div class="text-sm text-gray-500">Tarikh Permohonan</div>
                  <div>{{ formatDate(picData.tarikhPermohonan) }}</div>
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Approval Form (Shown only when status is Pending) -->
        <rs-card v-if="picData.status === 'Menunggu Kelulusan'" class="mt-4">
          <template #header>
            <h3 class="font-medium">Tindakan Kelulusan</h3>
          </template>

          <template #body>
            <FormKit
              type="form"
              id="approvalForm"
              :actions="false"
              @submit="submitApproval"
              #default="{ value }"
            >
              <FormKit
                type="radio"
                name="decision"
                label="Keputusan"
                :options="[
                  { label: 'Lulus', value: 'approve' },
                  { label: 'Tolak', value: 'reject' },
                ]"
                validation="required"
                validation-visibility="live"
                :validation-messages="{
                  required: 'Sila pilih keputusan',
                }"
              />

              <FormKit
                v-if="value.decision === 'reject'"
                type="textarea"
                name="reasonRejection"
                label="Alasan Penolakan"
                placeholder="Sila nyatakan alasan penolakan"
                validation="required"
                validation-visibility="live"
                :validation-messages="{
                  required: 'Medan ini wajib diisi apabila penolakan',
                }"
                rows="3"
              />

              <FormKit
                type="textarea"
                name="catatan"
                label="Catatan (jika ada)"
                placeholder="Masukkan catatan tambahan (opsyenal)"
                rows="3"
              />

              <div class="flex justify-end space-x-3 pt-4">
                <rs-button variant="primary-outline" @click="navigateToList">
                  Batal
                </rs-button>

                <rs-button
                  :disabled="isSubmitting"
                  :loading="isSubmitting"
                  @click="submitApproval"
                >
                  Hantar
                </rs-button>
              </div>
            </FormKit>
          </template>
        </rs-card>

        <!-- Decision Details (Shown when already decided) -->
        <rs-card v-if="picData.status !== 'Menunggu Kelulusan'" class="mt-4">
          <template #header>
            <h3 class="font-medium">Maklumat Kelulusan</h3>
          </template>

          <template #body>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <div class="text-sm text-gray-500">Keputusan</div>
                  <div>
                    <span
                      v-if="picData.status === 'Diluluskan'"
                      class="text-green-600 font-medium"
                      >Diluluskan</span
                    >
                    <span
                      v-else-if="picData.status === 'Ditolak'"
                      class="text-red-600 font-medium"
                      >Ditolak</span
                    >
                  </div>
                </div>

                <div class="space-y-1">
                  <div class="text-sm text-gray-500">Tarikh Keputusan</div>
                  <div>{{ formatDate(picData.tarikhKeputusan) }}</div>
                </div>

                <div class="space-y-1">
                  <div class="text-sm text-gray-500">Dilulus/Ditolak Oleh</div>
                  <div>{{ picData.namaPelulus }}</div>
                </div>

                <div class="space-y-1">
                  <div class="text-sm text-gray-500">Jawatan</div>
                  <div>{{ picData.jawatanPelulus }}</div>
                </div>
              </div>

              <div v-if="picData.alasanPenolakan" class="space-y-1">
                <div class="text-sm text-gray-500">Alasan Penolakan</div>
                <div
                  class="p-3 bg-red-50 border border-red-200 rounded-md text-red-800"
                >
                  {{ picData.alasanPenolakan }}
                </div>
              </div>

              <div v-if="picData.catatan" class="space-y-1">
                <div class="text-sm text-gray-500">Catatan</div>
                <div class="p-3 bg-gray-50 border border-gray-200 rounded-md">
                  {{ picData.catatan }}
                </div>
              </div>
            </div>
          </template>
        </rs-card>
      </div>

      <!-- Sidebar -->
      <div class="md:col-span-1">
        <!-- Workflow Status Card -->
        <rs-card>
          <template #header>
            <h3 class="font-medium">Status Aliran Kerja</h3>
          </template>

          <template #body>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div
                  class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white"
                >
                  <Icon name="mdi:check" />
                </div>
                <div>
                  <div class="font-medium">Pendaftaran</div>
                  <div class="text-sm text-gray-500">
                    {{ formatDate(picData.tarikhPermohonan) }}
                  </div>
                  <div class="text-sm">Oleh: {{ picData.namaPemohon }}</div>
                </div>
              </div>

              <div class="w-px h-8 bg-gray-300 ml-4"></div>

              <div class="flex items-start space-x-3">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-white"
                  :class="{
                    'bg-green-500': picData.status === 'Diluluskan',
                    'bg-red-500': picData.status === 'Ditolak',
                    'bg-gray-300': picData.status === 'Menunggu Kelulusan',
                  }"
                >
                  <Icon
                    v-if="picData.status === 'Diluluskan'"
                    name="mdi:check"
                  />
                  <Icon
                    v-else-if="picData.status === 'Ditolak'"
                    name="mdi:close"
                  />
                  <Icon v-else name="mdi:clock-outline" />
                </div>
                <div>
                  <div class="font-medium">Kelulusan</div>
                  <div
                    v-if="picData.status !== 'Menunggu Kelulusan'"
                    class="text-sm text-gray-500"
                  >
                    {{ formatDate(picData.tarikhKeputusan) }}
                  </div>
                  <div v-else class="text-sm text-amber-600">
                    Menunggu Kelulusan
                  </div>
                  <div
                    v-if="picData.status !== 'Menunggu Kelulusan'"
                    class="text-sm"
                  >
                    Oleh: {{ picData.namaPelulus }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </rs-card>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      :title="confirmationModalTitle"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <Icon
            :name="confirmationModalIcon"
            :class="confirmationModalIconClass"
            class="text-5xl mb-3"
          />
          <h3 class="text-lg font-medium">{{ confirmationModalHeading }}</h3>
          <p class="mt-2">{{ confirmationModalMessage }}</p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center w-full">
          <rs-button variant="primary" @click="navigateToList">
            Terus ke Senarai PIC Masjid
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";

definePageMeta({
  title: "Pengesahan PIC Masjid",
  description: "Pengesahan dan kelulusan maklumat PIC Masjid baharu",
});

const route = useRoute();
const picId = route.params.id || "PIC-2025-001";

const breadcrumb = ref([
  {
    name: "Pentadbiran Sistem",
    type: "link",
    path: "/BF-PS/PPK/KP",
  },
  {
    name: "Senarai PIC Masjid",
    type: "link",
    path: "/BF-PS/PPK/KP",
  },
  {
    name: "Pengesahan PIC Masjid",
    type: "current",
    path: `/BF-PS/PPK/KP/pic-masjid-pengesahan/${picId}`,
  },
]);

// Mock PIC data (in real app, this would be fetched from API)
const picData = reactive({
  id: picId,
  kodMasjid: "MSJ-KUL-001",
  namaMasjid: "Masjid Jamek Sultan Abdul Aziz",
  negeri: "KUL",
  daerah: "Kuala Lumpur",
  alamat: "Jalan Tun Perak, 50050 Kuala Lumpur",
  poskod: "50050",
  namaPIC: "Ahmad bin Abdullah",
  noKP: "801012025467",
  jawatan: "Imam",
  noTelefon: "0123456789",
  emel: "ahmad@masjid.gov.my",
  status: "Menunggu Kelulusan", // Menunggu Kelulusan, Diluluskan, Ditolak
  namaPemohon: "Aminah binti Hussain",
  jawatanPemohon: "Pegawai Pentadbiran",
  tarikhPermohonan: "15-05-2025T09:30:00",
  tarikhKeputusan: null,
  namaPelulus: null,
  jawatanPelulus: null,
  alasanPenolakan: null,
  catatan: null,
});

// Form submission state
const isSubmitting = ref(false);
const showConfirmationModal = ref(false);
const confirmationModalTitle = ref("");
const confirmationModalHeading = ref("");
const confirmationModalMessage = ref("");
const confirmationModalIcon = ref("");
const confirmationModalIconClass = ref("");

// Options for dropdown selects
const negeriOptions = ref([
  { label: "Selangor", value: "SLG" },
  { label: "Kuala Lumpur", value: "KUL" },
  { label: "Putrajaya", value: "PTJ" },
  { label: "Johor", value: "JHR" },
  { label: "Kedah", value: "KDH" },
  { label: "Kelantan", value: "KTN" },
  { label: "Melaka", value: "MLK" },
  { label: "Negeri Sembilan", value: "NSN" },
  { label: "Pahang", value: "PHG" },
  { label: "Perak", value: "PRK" },
  { label: "Perlis", value: "PLS" },
  { label: "Pulau Pinang", value: "PNG" },
  { label: "Sabah", value: "SBH" },
  { label: "Sarawak", value: "SWK" },
  { label: "Terengganu", value: "TRG" },
]);

// Helper functions
const getNegeriLabel = (value) => {
  const negeri = negeriOptions.value.find((item) => item.value === value);
  return negeri ? negeri.label : value;
};

const formatKP = (kp) => {
  if (!kp || kp.length !== 12) return kp;
  return `${kp.substring(0, 6)}-${kp.substring(6, 8)}-${kp.substring(8)}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ms-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Form submission
const submitApproval = async (formValues) => {
  isSubmitting.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update picData based on form values
    if (formValues.decision === "approve") {
      picData.status = "Diluluskan";
      picData.tarikhKeputusan = new Date().toISOString();
      picData.namaPelulus = "Mohd Razali bin Ibrahim"; // Current user name
      picData.jawatanPelulus = "Ketua Jabatan JPPA";
      picData.catatan = formValues.catatan || null;

      // Set confirmation modal for approval
      confirmationModalTitle.value = "Pengesahan";
      confirmationModalHeading.value = "Permohonan Diluluskan!";
      confirmationModalMessage.value =
        "Permohonan PIC Masjid telah berjaya diluluskan.";
      confirmationModalIcon.value = "mdi:check-circle";
      confirmationModalIconClass.value = "text-green-500";
    } else {
      picData.status = "Ditolak";
      picData.tarikhKeputusan = new Date().toISOString();
      picData.namaPelulus = "Mohd Razali bin Ibrahim"; // Current user name
      picData.jawatanPelulus = "Ketua Jabatan JPPA";
      picData.alasanPenolakan = formValues.reasonRejection;
      picData.catatan = formValues.catatan || null;

      // Set confirmation modal for rejection
      confirmationModalTitle.value = "Pengesahan";
      confirmationModalHeading.value = "Permohonan Ditolak";
      confirmationModalMessage.value = "Permohonan PIC Masjid telah ditolak.";
      confirmationModalIcon.value = "mdi:close-circle";
      confirmationModalIconClass.value = "text-red-500";
    }

    // Show confirmation modal
    showConfirmationModal.value = true;
  } catch (error) {
    console.error("Error submitting approval:", error);
    alert("Ralat berlaku semasa penghantaran kelulusan. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};

// Navigate back to PIC Masjid listing
const navigateToList = () => {
  navigateTo("/BF-PA/PP/PM/01");
};

// Print details
const printDetails = () => {
  window.print();
};
</script>

<style>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>

<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="space-y-6 mt-4">
      <!-- Section 1: Maklumat Tuntutan -->
      <rs-card>
        <template #header>
          <div class="flex items-center">
            <Icon name="material-symbols:info-outline" class="mr-2" />
            Maklumat Tuntutan
          </div>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                ID Permohonan Tuntutan
              </label>
              <div class="text-gray-900">{{ tuntutan.idPermohonan }}</div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                No. GL
              </label>
              <div class="text-gray-900">{{ tuntutan.noGL }}</div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Amaun Tuntutan
              </label>
              <div class="text-gray-900">
                RM {{ formatNumber(tuntutan.amaunTuntutan) }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tarikh Permohonan
              </label>
              <div class="text-gray-900">
                {{ formatDate(tuntutan.tarikhPermohonan) }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Pegawai ETD/EOAD
              </label>
              <div class="text-gray-900">{{ tuntutan.pegawaiETD }}</div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Dokumen Sokongan
              </label>
              <div class="flex items-center space-x-2">
                <a
                  v-for="(doc, index) in tuntutan.dokumenSokongan"
                  :key="index"
                  :href="doc.url"
                  target="_blank"
                  class="text-primary-600 hover:text-primary-800 flex items-center"
                >
                  <Icon
                    name="material-symbols:file-present-outline"
                    class="mr-1"
                  />
                  {{ doc.name }}
                </a>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Section 2: Semakan Maklumat -->
      <rs-card>
        <template #header>
          <div class="flex items-center">
            <Icon name="material-symbols:fact-check-outline" class="mr-2" />
            Semakan Maklumat
          </div>
        </template>
        <template #body>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status GL
              </label>
              <rs-badge
                :variant="tuntutan.statusGL === 'Valid' ? 'success' : 'danger'"
              >
                {{ tuntutan.statusGL }}
              </rs-badge>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Perbandingan Amaun GL vs Tuntutan
              </label>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-4 bg-gray-50 rounded-lg">
                  <div class="text-sm text-gray-500">Amaun GL</div>
                  <div class="text-lg font-semibold">
                    RM {{ formatNumber(tuntutan.amaunGL) }}
                  </div>
                </div>
                <div class="p-4 bg-gray-50 rounded-lg">
                  <div class="text-sm text-gray-500">Amaun Tuntutan</div>
                  <div class="text-lg font-semibold">
                    RM {{ formatNumber(tuntutan.amaunTuntutan) }}
                  </div>
                </div>
                <div class="p-4 bg-gray-50 rounded-lg">
                  <div class="text-sm text-gray-500">Perbezaan</div>
                  <div
                    class="text-lg font-semibold"
                    :class="{
                      'text-danger': tuntutan.amaunTuntutan > tuntutan.amaunGL,
                      'text-success':
                        tuntutan.amaunTuntutan <= tuntutan.amaunGL,
                    }"
                  >
                    RM
                    {{
                      formatNumber(
                        Math.abs(tuntutan.amaunGL - tuntutan.amaunTuntutan)
                      )
                    }}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tarikh & Dokumen Perkhidmatan
              </label>
              <div class="space-y-2">
                <div>Tarikh: {{ formatDate(tuntutan.tarikhPerkhidmatan) }}</div>
                <div class="flex items-center space-x-2">
                  <a
                    v-for="(doc, index) in tuntutan.dokumenPerkhidmatan"
                    :key="index"
                    :href="doc.url"
                    target="_blank"
                    class="text-primary-600 hover:text-primary-800 flex items-center"
                  >
                    <Icon
                      name="material-symbols:file-present-outline"
                      class="mr-1"
                    />
                    {{ doc.name }}
                  </a>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Lampiran Lain
              </label>
              <div class="flex items-center space-x-2">
                <a
                  v-for="(doc, index) in tuntutan.lampiranLain"
                  :key="index"
                  :href="doc.url"
                  target="_blank"
                  class="text-primary-600 hover:text-primary-800 flex items-center"
                >
                  <Icon
                    name="material-symbols:file-present-outline"
                    class="mr-1"
                  />
                  {{ doc.name }}
                </a>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Section 3: Keputusan Kelulusan -->
      <rs-card>
        <template #header>
          <div class="flex items-center">
            <Icon name="material-symbols:approval-outline" class="mr-2" />
            Keputusan Kelulusan
          </div>
        </template>
        <template #body>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Keputusan Kelulusan
              </label>
              <div class="space-x-4">
                <FormKit
                  type="radio"
                  name="keputusan"
                  v-model="form.keputusan"
                  :options="[
                    { label: 'Lulus', value: 'Lulus' },
                    { label: 'Tidak Lulus', value: 'Tidak Lulus' },
                  ]"
                  :validation="[['required']]"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Catatan Semakan
              </label>
              <FormKit
                type="textarea"
                v-model="form.catatan"
                placeholder="Masukkan catatan semakan..."
                validation="required_if:keputusan,Tidak Lulus"
                :validation-messages="{
                  required_if: 'Catatan diperlukan untuk keputusan Tidak Lulus',
                }"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tarikh Kelulusan
                </label>
                <div class="text-gray-900">{{ formatDate(new Date()) }}</div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Pegawai Meluluskan
                </label>
                <div class="text-gray-900">{{ currentUser.name }}</div>
              </div>
            </div>

            <div class="flex justify-end space-x-4 pt-4">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleCancel"
              >
                Batal
              </rs-button>
              <rs-button
                type="submit"
                :variant="form.keputusan === 'Lulus' ? 'primary' : 'danger'"
                :disabled="isSubmitting"
                @click="handleSubmit"
              >
                {{ form.keputusan === "Lulus" ? "Lulus" : "Tidak Lulus" }}
              </rs-button>
            </div>
          </form>
        </template>
      </rs-card>
    </div>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      :title="
        form.keputusan === 'Lulus'
          ? 'Pengesahan Kelulusan'
          : 'Pengesahan Tidak Lulus'
      "
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-4">
          <p class="mb-4">
            Adakah anda pasti untuk
            {{ form.keputusan === "Lulus" ? "meluluskan" : "tidak meluluskan" }}
            tuntutan ini?
          </p>
          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="font-medium">ID Permohonan:</span>
              <span>{{ tuntutan.idPermohonan }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">No. GL:</span>
              <span>{{ tuntutan.noGL }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Amaun Tuntutan:</span>
              <span>RM {{ formatNumber(tuntutan.amaunTuntutan) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Status GL:</span>
              <span>{{ tuntutan.statusGL }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Catatan:</span>
              <span>{{ form.catatan || "-" }}</span>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end space-x-4">
          <rs-button
            variant="secondary"
            @click="showConfirmationModal = false"
            :disabled="isSubmitting"
          >
            Batal
          </rs-button>
          <rs-button
            :variant="form.keputusan === 'Lulus' ? 'primary' : 'danger'"
            @click="handleConfirm"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">
              <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
            </span>
            <span v-else>
              {{
                form.keputusan === "Lulus"
                  ? "Sahkan Lulus"
                  : "Sahkan Tidak Lulus"
              }}
            </span>
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Semakan & Kelulusan Tuntutan",
});

const route = useRoute();

const breadcrumb = ref([
  {
    name: "Tuntutan dengan Siasatan",
    type: "link",
    path: "/BF-BTN/tuntutan-dengan-siasatan",
  },
  {
    name: "Senarai Tuntutan Pelulus",
    type: "link",
    path: "/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-pelulus",
  },
  {
    name: "Semakan & Kelulusan",
    type: "current",
    path: `/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-pelulus/${route.params.id}/semak-kelulusan`,
  },
]);

// Sample data - Replace with actual API call
const tuntutan = ref({
  idPermohonan: "TDS-2024-001",
  noGL: "GL-2024-001",
  amaunTuntutan: 5000.0,
  amaunGL: 6000.0,
  tarikhPermohonan: "2024-03-20T09:30:00",
  pegawaiETD: "Sarah binti Omar",
  statusGL: "Valid",
  tarikhPerkhidmatan: "2024-03-15T00:00:00",
  dokumenSokongan: [
    { name: "Dokumen 1.pdf", url: "#" },
    { name: "Dokumen 2.pdf", url: "#" },
  ],
  dokumenPerkhidmatan: [{ name: "Perkhidmatan 1.pdf", url: "#" }],
  lampiranLain: [{ name: "Lampiran 1.pdf", url: "#" }],
});

// Form state
const form = ref({
  keputusan: "",
  catatan: "",
});

const isSubmitting = ref(false);
const showConfirmationModal = ref(false);

// Mock current user - Replace with actual user data
const currentUser = ref({
  name: "Ahmad bin Ismail",
  role: "Pelulus",
});

// Utility functions
const formatNumber = (value) => {
  return new Intl.NumberFormat("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("ms-MY");
};

// Action handlers
const handleSubmit = async () => {
  showConfirmationModal.value = true;
};

const handleConfirm = async () => {
  try {
    isSubmitting.value = true;

    // TODO: Implement actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show success message
    // useToast().add({
    //   title: 'Berjaya',
    //   description: `Tuntutan telah ${form.value.keputusan.toLowerCase()}`,
    //   type: form.value.keputusan === 'Lulus' ? 'success' : 'info',
    // });

    // Navigate back to list
    navigateTo("/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-pelulus");
  } catch (error) {
    // useToast().add({
    //   title: "Ralat",
    //   description: "Ralat telah berlaku. Sila cuba lagi.",
    //   type: "error",
    // });
  } finally {
    isSubmitting.value = false;
    showConfirmationModal.value = false;
  }
};

const handleCancel = () => {
  navigateTo("/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-pelulus");
};
</script>

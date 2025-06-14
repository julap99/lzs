<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Semak Dokumen & Buat Pengesahan</h2>
          <rs-badge v-if="formData.status" :variant="getStatusVariant(formData.status)">
            {{ formData.status }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleSubmit"
          v-model="formData"
        >
          <!-- Section 1: Maklumat Permohonan -->
          <rs-fieldset class="mb-6">
            <template #legend>
              <h3 class="text-lg font-medium">Maklumat Permohonan</h3>
            </template>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="idPermohonan"
                label="ID Permohonan"
                readonly
              />
              <FormKit
                type="text"
                name="namaPemohon"
                label="Nama Pemohon"
                readonly
              />
              <FormKit
                type="text"
                name="noKpPemohon"
                label="No KP Pemohon"
                readonly
              />
              <FormKit
                type="text"
                name="jenisBantuan"
                label="Jenis Bantuan"
                readonly
              />
              <FormKit
                type="text"
                name="kategoriBantuan"
                label="Kategori Bantuan & Asnaf"
                readonly
              />
            </div>
          </rs-fieldset>

          <!-- Section 2: Dokumen Sokongan -->
          <rs-fieldset class="mb-6">
            <template #legend>
              <h3 class="text-lg font-medium">Dokumen Sokongan</h3>
            </template>

            <div class="space-y-4">
              <div v-for="(doc, index) in documents" :key="index" 
                class="flex items-center justify-between p-4 border rounded-lg transition-colors duration-200"
                :class="{ 
                  'border-red-500 bg-red-50': !doc.isVerified && doc.required,
                  'border-gray-200': doc.isVerified || !doc.required 
                }"
              >
                <div class="flex items-center gap-4 flex-1">
                  <FormKit
                    type="checkbox"
                    :name="`documents.${index}.isVerified`"
                    :validation="doc.required ? 'required' : ''"
                    :validation-messages="{
                      required: 'Dokumen ini perlu disahkan'
                    }"
                    class="!mb-0"
                  />
                  <div class="flex-1">
                    <div class="font-medium">{{ doc.name }}</div>
                    <div class="text-sm text-gray-500">{{ doc.description }}</div>
                  </div>
                  <div class="flex gap-2">
                    <rs-button
                      variant="primary-outline"
                      size="sm"
                      @click="viewDocument(doc)"
                      :disabled="!doc.url"
                    >
                      <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                      Lihat
                    </rs-button>
                    <rs-button
                      variant="primary-outline"
                      size="sm"
                      @click="downloadDocument(doc)"
                      :disabled="!doc.url"
                    >
                      <Icon name="ph:download" class="w-4 h-4 mr-1" />
                      Muat Turun
                    </rs-button>
                  </div>
                </div>
              </div>
            </div>
          </rs-fieldset>

          <!-- Section 3: Catatan & Status Dokumen -->
          <rs-fieldset class="mb-6">
            <template #legend>
              <h3 class="text-lg font-medium">Catatan & Status Dokumen</h3>
            </template>

            <div class="grid grid-cols-1 gap-4">
              <FormKit
                type="textarea"
                name="catatanStatus"
                label="Catatan Status Dokumen"
                placeholder="Masukkan catatan status dokumen..."
                rows="4"
              />
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="text"
                  name="tarikhSemakan"
                  label="Tarikh & Masa Semakan"
                  readonly
                />
                <FormKit
                  type="text"
                  name="namaPegawai"
                  label="Nama Pegawai EOAD"
                  readonly
                />
              </div>
            </div>
          </rs-fieldset>

          <!-- Section 4: Action Buttons -->
          <div class="flex justify-end gap-4 mt-6">
            <rs-button
              variant="primary-outline"
              @click="handleCancel"
            >
              Batal / Kembali
            </rs-button>
            <rs-button
              variant="warning"
              @click="showNeedReviewConfirm = true"
              :disabled="processing"
            >
              Perlu Semakan Semula Dokumen
            </rs-button>
            <rs-button
              variant="primary"
              @click="showVerifyConfirm = true"
              :disabled="processing"
            >
              Disahkan - Siap untuk Siasatan Lapangan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Need Review Confirmation Modal -->
    <rs-modal
      v-model="showNeedReviewConfirm"
      title="Pengesahan Semakan Semula"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-4">
          <div class="text-center">
            <Icon
              name="ph:warning-circle"
              class="mx-auto text-warning"
              size="3rem"
            />
            <h3 class="mt-4 text-lg font-medium text-gray-900">
              Sahkan Semakan Semula
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              Adakah anda pasti untuk menandakan permohonan ini perlu disemak semula?
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="font-medium">ID Permohonan:</span>
              <span>{{ formData.idPermohonan }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Nama Pemohon:</span>
              <span>{{ formData.namaPemohon }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Status Semasa:</span>
              <span>{{ formData.status }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Status Selepas:</span>
              <span class="text-warning">Untuk Siasatan</span>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="primary-outline"
            @click="showNeedReviewConfirm = false"
            :disabled="processing"
          >
            Batal
          </rs-button>
          <rs-button
            variant="warning"
            @click="handleNeedReview"
            :loading="processing"
          >
            Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Verify Confirmation Modal -->
    <rs-modal
      v-model="showVerifyConfirm"
      title="Pengesahan Dokumen"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-4">
          <div class="text-center">
            <Icon
              name="ph:warning-circle"
              class="mx-auto text-warning"
              size="3rem"
            />
            <h3 class="mt-4 text-lg font-medium text-gray-900">
              Sahkan Dokumen
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              Adakah anda pasti untuk mengesahkan semua dokumen dan menandakan permohonan ini siap untuk siasatan lapangan?
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="font-medium">ID Permohonan:</span>
              <span>{{ formData.idPermohonan }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Nama Pemohon:</span>
              <span>{{ formData.namaPemohon }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Status Semasa:</span>
              <span>{{ formData.status }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Status Selepas:</span>
              <span class="text-success">Siap untuk Siasatan Lapangan</span>
            </div>
          </div>

          <div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p class="text-sm text-yellow-800 flex items-center">
              <Icon name="ph:warning" class="w-5 h-5 mr-2 flex-shrink-0" />
              Pastikan semua dokumen yang diperlukan telah disahkan sebelum meneruskan.
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="primary-outline"
            @click="showVerifyConfirm = false"
            :disabled="processing"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="handleVerify"
            :loading="processing"
          >
            Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const processing = ref(false);

definePageMeta({
  title: 'Semak Dokumen & Buat Pengesahan',
});

const breadcrumb = ref([
  {
    name: 'Permohonan Bantuan',
    type: 'link',
    path: '/BF-BTN/PB/senarai',
  },
  {
    name: 'Untuk Siasatan',
    type: 'link',
    path: '/BF-BTN/PB/senarai-siasatan',
  },
  {
    name: 'Semak Dokumen',
    type: 'current',
    path: `/BF-BTN/PB/senarai-siasatan/${route.params.id}`,
  },
]);

// Form data
const formData = ref({
  idPermohonan: '',
  namaPemohon: '',
  noKpPemohon: '',
  jenisBantuan: '',
  kategoriBantuan: '',
  status: 'untuk_siasatan',
  catatanStatus: '',
  tarikhSemakan: '',
  namaPegawai: '',
  documents: [],
});

// Document list
const documents = ref([
  {
    name: 'Surat Kelulusan',
    description: 'Surat kelulusan rasmi dari pihak berkuasa',
    required: true,
    isVerified: false,
    url: '#',
  },
  {
    name: 'Sebutharga / Invois',
    description: 'Dokumen rasmi yang menunjukkan nilai bantuan',
    required: true,
    isVerified: false,
    url: '#',
  },
  {
    name: 'Gambar Premis / Lokasi',
    description: 'Gambar lokasi atau premis yang berkaitan dengan permohonan',
    required: true,
    isVerified: false,
    url: '#',
  },
  {
    name: 'Salinan Pemilikan',
    description: 'Dokumen yang mengesahkan pemilikan atau hak',
    required: true,
    isVerified: false,
    url: '#',
  },
]);

// Add confirmation dialog refs
const showNeedReviewConfirm = ref(false);
const showVerifyConfirm = ref(false);

// Methods
const getStatusVariant = (status) => {
  const variants = {
    untuk_siasatan: 'warning',
    siap_siasatan_lapangan: 'success',
  };
  return variants[status.toLowerCase()] || 'default';
};

const viewDocument = (doc) => {
  // Implement document viewing logic
  console.log('Viewing document:', doc);
};

const downloadDocument = (doc) => {
  // Implement document download logic
  console.log('Downloading document:', doc);
};

const handleCancel = () => {
  router.push('/BF-BTN/PB/senarai-siasatan');
};

const handleNeedReview = async () => {
  try {
    processing.value = true;
    // Implement API call to update status
    formData.value.status = 'untuk_siasatan';
    toast.success('Status permohonan telah dikemaskini');
    router.push('/BF-BTN/PB/senarai-siasatan');
  } catch (error) {
    toast.error('Ralat semasa mengemaskini status');
    console.error(error);
  } finally {
    processing.value = false;
    showNeedReviewConfirm.value = false;
  }
};

const handleVerify = async () => {
  try {
    processing.value = true;
    // Implement API call to update status
    formData.value.status = 'siap_siasatan_lapangan';
    toast.success('Dokumen telah disahkan');
    router.push('/BF-BTN/PB/senarai-siasatan');
  } catch (error) {
    toast.error('Ralat semasa mengesahkan dokumen');
    console.error(error);
  } finally {
    processing.value = false;
    showVerifyConfirm.value = false;
  }
};

// Fetch application data on mount
onMounted(async () => {
  try {
    // Implement API call to fetch application data
    // This is mock data for now
    formData.value = {
      ...formData.value,
      idPermohonan: route.params.id,
      namaPemohon: 'Ahmad bin Abdullah',
      noKpPemohon: '880101-12-1234',
      jenisBantuan: 'Bantuan Kewangan',
      kategoriBantuan: 'Fakir',
      tarikhSemakan: new Date().toLocaleString(),
      namaPegawai: 'Siti binti Ali',
    };
  } catch (error) {
    toast.error('Ralat semasa memuatkan data permohonan');
    console.error(error);
  }
});
</script>

<style lang="scss" scoped>
.rs-fieldset {
  @apply border border-gray-200 rounded-lg p-4;
}
</style> 
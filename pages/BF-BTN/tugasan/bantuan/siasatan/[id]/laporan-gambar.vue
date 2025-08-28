<template>
  <div class="min-h-screen">
    <div class="">
      <LayoutsBreadcrumb :items="breadcrumb" />

      <!-- Page Header -->
      <div class="mt-6 mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Laporan Gambar
            </h1>
            <p class="mt-1 text-sm text-gray-600">
              Muat naik gambar lokasi dan dokumentasi siasatan lapangan
            </p>
          </div>
          <rs-button
            variant="primary-outline"
            @click="handleBack"
            class="text-sm"
          >
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-2" />
            Kembali
          </rs-button>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Upload Section -->
        <rs-card class="shadow-sm border-0 bg-white">
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Icon name="ph:upload" class="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  Muat Naik Gambar Lokasi
                </h2>
                <p class="text-sm text-gray-500">
                  Gambar dokumentasi siasatan lapangan
                </p>
              </div>
            </div>
          </template>

          <template #body>
            <div class="space-y-6">
              <!-- File Upload -->
              <div>
                <FormKit
                  type="file"
                  label="Pilih Gambar"
                  multiple
                  accept="image/*"
                  @change="handleFileChange"
                  help="Format yang diterima: JPG, PNG, GIF. Maksimum 5MB setiap file."
                />
              </div>

              <!-- Upload Queue -->
              <div v-if="uploadQueue.length > 0" class="space-y-3">
                <h3 class="text-sm font-medium text-gray-900">Senarai Fail untuk Dimuat Naik:</h3>
                <div class="space-y-2">
                  <div
                    v-for="(file, index) in uploadQueue"
                    :key="index"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <div class="flex items-center space-x-3">
                      <Icon name="ph:image" class="w-5 h-5 text-gray-400" />
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
                        <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                      </div>
                    </div>
                    <rs-button
                      size="xs"
                      variant="danger-outline"
                      @click="removeFromQueue(index)"
                    >
                      <Icon name="ph:trash" class="w-4 h-4" />
                    </rs-button>
                  </div>
                </div>
                
                <div class="flex justify-end">
                  <rs-button
                    variant="primary"
                    @click="uploadFiles"
                    :loading="uploading"
                    :disabled="uploading"
                  >
                    <Icon name="ph:upload" class="w-4 h-4 mr-2" />
                    Muat Naik Semua
                  </rs-button>
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Uploaded Images Gallery -->
        <rs-card class="shadow-sm border-0 bg-white">
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon name="ph:images" class="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  Gambar Yang Dimuat Naik
                </h2>
                <p class="text-sm text-gray-500">
                  Senarai gambar lokasi dengan catatan
                </p>
              </div>
            </div>
          </template>

          <template #body>
            <div v-if="uploadedImages.length > 0" class="space-y-6">
              <div
                v-for="(image, index) in uploadedImages"
                :key="index"
                class="border border-gray-200 rounded-lg p-4"
              >
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <!-- Image Preview -->
                  <div class="space-y-2">
                    <div class="aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <img
                        :src="image.url"
                        :alt="image.catatan"
                        class="w-full h-full object-cover cursor-pointer"
                        @click="previewImage(image)"
                      />
                    </div>
                    <div class="flex space-x-2">
                      <rs-button
                        size="xs"
                        variant="primary-outline"
                        @click="previewImage(image)"
                      >
                        <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                        Preview
                      </rs-button>
                      <rs-button
                        size="xs"
                        variant="danger-outline"
                        @click="deleteImage(index)"
                      >
                        <Icon name="ph:trash" class="w-4 h-4 mr-1" />
                        Padam
                      </rs-button>
                    </div>
                  </div>

                  <!-- Image Details -->
                  <div class="lg:col-span-2 space-y-4">
                    <FormKit
                      type="textarea"
                      label="Catatan Gambar"
                      v-model="image.catatan"
                      rows="3"
                      placeholder="Masukkan catatan untuk gambar ini..."
                      @input="updateImage(index, 'catatan', $event)"
                    />
                    
                    <div class="text-xs text-gray-500">
                      <Icon name="ph:clock" class="w-4 h-4 inline mr-1" />
                      Masa Upload: {{ formatDateTime(image.masaUpload) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-8 text-gray-500">
              <Icon name="ph:image" class="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Tiada gambar dimuat naik. Sila muat naik gambar menggunakan bahagian di atas.</p>
            </div>
          </template>
        </rs-card>

        <!-- Action Buttons -->
        <rs-card class="shadow-sm border-0 bg-white">
          <template #body>
            <div class="flex flex-col sm:flex-row gap-3 justify-end">
              <rs-button
                variant="primary-outline"
                @click="handleSave"
                :disabled="processing"
                class="!py-3 text-sm font-medium"
              >
                <Icon name="ph:floppy-disk" class="w-5 h-5 mr-2" />
                Simpan
              </rs-button>

              <rs-button
                variant="primary"
                @click="handleSaveAndReturn"
                :disabled="processing"
                :loading="processing"
                class="!py-3 text-sm font-medium"
              >
                <Icon name="ph:check" class="w-5 h-5 mr-2" />
                Simpan & Kembali
              </rs-button>
            </div>
          </template>
        </rs-card>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <rs-modal v-model="showPreviewModal" size="lg">
      <template #header>
        <h3 class="text-lg font-semibold">Preview Gambar</h3>
      </template>
      <template #body>
        <div v-if="previewingImage" class="space-y-4">
          <div class="aspect-video rounded-lg overflow-hidden border border-gray-200">
            <img
              :src="previewingImage.url"
              :alt="previewingImage.catatan"
              class="w-full h-full object-contain"
            />
          </div>
          <div class="text-sm text-gray-600">
            <strong>Catatan:</strong> {{ previewingImage.catatan || 'Tiada catatan' }}
          </div>
          <div class="text-xs text-gray-500">
            <strong>Masa Upload:</strong> {{ formatDateTime(previewingImage.masaUpload) }}
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <rs-button variant="primary-outline" @click="showPreviewModal = false">
            Tutup
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

const route = useRoute();
const router = useRouter();
const toast = useToast();
const processing = ref(false);
const uploading = ref(false);

definePageMeta({
  title: "Laporan Gambar - Siasatan Lapangan",
});

const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/permohonan/senarai",
  },
  {
    name: "Siasatan ke Lapangan",
    type: "link",
    path: "/BF-BTN/permohonan/senarai-siasatan-lapangan",
  },
  {
    name: "Kemaskini Siasatan",
    type: "link",
    path: `/BF-BTN/permohonan/senarai-siasatan-lapangan/${route.params.id}`,
  },
  {
    name: "Laporan Gambar",
    type: "current",
    path: `/BF-BTN/permohonan/senarai-siasatan-lapangan/${route.params.id}/laporan-gambar`,
  },
]);

// State
const uploadQueue = ref([]);
const uploadedImages = ref([]);
const showPreviewModal = ref(false);
const previewingImage = ref(null);

// Methods
const handleFileChange = (files) => {
  if (files && files.length > 0) {
    const validFiles = Array.from(files).filter(file => {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`Fail ${file.name} terlalu besar. Maksimum 5MB.`);
        return false;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`Fail ${file.name} bukan format gambar yang sah.`);
        return false;
      }
      
      return true;
    });
    
    uploadQueue.value = [...uploadQueue.value, ...validFiles];
  }
};

const removeFromQueue = (index) => {
  uploadQueue.value.splice(index, 1);
};

const uploadFiles = async () => {
  if (uploadQueue.value.length === 0) return;
  
  try {
    uploading.value = true;
    
    for (const file of uploadQueue.value) {
      // Simulate upload - in real app, this would be an API call
      const uploadedImage = {
        url: URL.createObjectURL(file),
        catatan: "",
        masaUpload: new Date().toISOString(),
        filename: file.name,
      };
      
      uploadedImages.value.push(uploadedImage);
    }
    
    uploadQueue.value = [];
    toast.success(`${uploadQueue.value.length} gambar berjaya dimuat naik`);
  } catch (error) {
    toast.error("Ralat semasa memuat naik gambar");
    console.error(error);
  } finally {
    uploading.value = false;
  }
};

const updateImage = (index, field, value) => {
  uploadedImages.value[index][field] = value;
};

const deleteImage = (index) => {
  uploadedImages.value.splice(index, 1);
  toast.success("Gambar telah dipadam");
};

const previewImage = (image) => {
  previewingImage.value = image;
  showPreviewModal.value = true;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('ms-MY');
};

const handleSave = async () => {
  try {
    processing.value = true;
    
    // Implement save functionality
    console.log("Saving images:", uploadedImages.value);
    
    toast.success("Laporan gambar telah disimpan");
  } catch (error) {
    toast.error("Ralat semasa menyimpan laporan gambar");
    console.error(error);
  } finally {
    processing.value = false;
  }
};

const handleSaveAndReturn = async () => {
  try {
    await handleSave();
    handleBack();
  } catch (error) {
    console.error(error);
  }
};

const handleBack = () => {
  router.push(`/BF-BTN/tugasan/bantuan/siasatan/${route.params.id}`);
};

// Load existing data on mount
onMounted(async () => {
  try {
    // Load existing uploaded images from API
    // This is mock data for now
    uploadedImages.value = [
      {
        url: "/img/placeholder-image.jpg",
        catatan: "Keadaan semasa rumah pemohon",
        masaUpload: new Date().toISOString(),
        filename: "rumah_depan.jpg",
      },
      {
        url: "/img/placeholder-image.jpg",
        catatan: "Bahagian bumbung yang rosak",
        masaUpload: new Date().toISOString(),
        filename: "bumbung_rosak.jpg",
      },
    ];
  } catch (error) {
    toast.error("Ralat semasa memuatkan data gambar");
    console.error(error);
  }
});
</script>

<style lang="scss" scoped>
// Custom styling for image gallery
.aspect-square {
  aspect-ratio: 1 / 1;
}

.aspect-video {
  aspect-ratio: 16 / 9;
}

// Hover effects for images
.cursor-pointer:hover {
  opacity: 0.8;
  transition: opacity 0.2s ease-in-out;
}
</style>
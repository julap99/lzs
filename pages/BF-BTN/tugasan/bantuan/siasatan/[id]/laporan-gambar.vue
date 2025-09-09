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
              Muat naik gambar lokasi dan dokumentasi siasatan
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
                  Senarai Gambar
                </h2>
                <p class="text-sm text-gray-500">
                  Gambar lokasi yang telah dimuat naik berserta catatan
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
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <!-- Image Preview or Upload -->
                  <div class="space-y-2">
                    <div v-if="image.url || image.previewUrl" class="aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <img
                        :src="image.url || image.previewUrl"
                        :alt="image.catatan"
                        class="w-full h-full object-cover cursor-pointer"
                        @click="previewImage(image)"
                      />
                    </div>
                    <div v-else class="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <div class="text-center">
                        <Icon name="ph:image" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p class="text-sm text-gray-500">Pilih Gambar</p>
                      </div>
                    </div>
                    
                    <!-- File Upload for New Images -->
                    <div v-if="!image.url && !image.previewUrl" class="mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        @change="(event) => handleImageUpload(event.target.files, index)"
                        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p class="text-xs text-gray-500 mt-1">Format: JPG, PNG, GIF. Maksimum 5MB</p>
                    </div>
                    
                    <div class="flex space-x-2">
                      <rs-button
                        v-if="image.url || image.previewUrl"
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
                      validation="required"
                      :validation-messages="{
                        required: 'Catatan gambar diperlukan'
                      }"
                    />
                    
                    <div v-if="image.filename" class="text-xs text-gray-500">
                      <Icon name="ph:clock" class="w-4 h-4 inline mr-1" />
                      Masa Upload: {{ formatDateTime(image.masaUpload) }}
                    </div>
                  </div>

                  <!-- Empty space to maintain grid alignment -->
                  <div class="flex items-end justify-end">
                    <!-- Empty space -->
                  </div>
                </div>
              </div>
            </div>

            <!-- Add Image Button Section -->
            <div v-if="uploadedImages.length > 0" class="mt-6 flex justify-end">
              <rs-button
                variant="primary-outline"
                @click="addNewImageRow"
              >
                <Icon name="ph:plus" class="w-4 h-4 mr-2" />
                Tambah Gambar
              </rs-button>
            </div>
            
            <div v-else class="text-center py-8 text-gray-500">
              <Icon name="ph:image" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p class="text-sm mb-4">Tiada gambar dimuat naik</p>
              <rs-button
                variant="primary-outline"
                @click="addNewImageRow"
              >
                <Icon name="ph:plus" class="w-4 h-4 mr-2" />
                Tambah Gambar
              </rs-button>
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

const addNewImageRow = () => {
  uploadedImages.value.push({
    url: "",
    previewUrl: "",
    selectedFile: null,
    catatan: "",
    masaUpload: new Date().toISOString(),
    filename: "",
  });
};

const handleImageUpload = (files, index) => {
  console.log("handleImageUpload called with files:", files, "index:", index);
  
  if (files && files.length > 0) {
    const file = files[0];
    console.log("Selected file:", file.name, "type:", file.type, "size:", file.size);
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`Fail ${file.name} terlalu besar. Maksimum 5MB.`);
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(`Fail ${file.name} bukan format gambar yang sah.`);
      return;
    }
    
    // For prototype: Use the provided image URL as preview
    const prototypeImageUrl = "https://scontent.fkul15-1.fna.fbcdn.net/v/t1.6435-9/33329554_977230942444481_7069764250821984256_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=aaBrdlbl59IQ7kNvwE6jMmQ&_nc_oc=AdnbrTw2Rn9tldpzOVKpBgphwK7rWl48XtKzEpTttB8OBlHPTwZvKR5ukqM4LVmFHy1eTiNuSePyz9M_cjo3bW9V&_nc_zt=23&_nc_ht=scontent.fkul15-1.fna&_nc_gid=BKm2aBWiZlWNrZ3-_j4TQg&oh=00_AfaErw9xQ-ns0-Ifu8lFSXBFYlylqSNc5de16qOPcEeluw&oe=68E2A1A0";
    
    console.log("Setting previewUrl for index", index);
    
    // Update the image object with preview
    uploadedImages.value[index] = {
      ...uploadedImages.value[index],
      previewUrl: prototypeImageUrl,
      filename: file.name,
      masaUpload: new Date().toISOString(),
    };
    
    console.log("Updated uploadedImages:", uploadedImages.value[index]);
    
    // Simulate upload process (in real app, this would be an API call)
    setTimeout(() => {
      uploadedImages.value[index] = {
        ...uploadedImages.value[index],
        url: prototypeImageUrl, // Use prototype image as final URL
        previewUrl: null, // Clear preview URL
      };
      console.log("Upload completed for index", index);
      toast.success("Gambar berjaya dimuat naik");
    }, 1000); // 1 second delay to show the upload process
  }
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

const validateImages = () => {
  // Check if there are any images without catatan
  const imagesWithoutCatatan = uploadedImages.value.filter(image => 
    image.url && (!image.catatan || image.catatan.trim() === '')
  );
  
  if (imagesWithoutCatatan.length > 0) {
    toast.error(` ${imagesWithoutCatatan.length} catatan gambar belum diisi`);
    return false;
  }
  
  return true;F
};

const handleSave = async () => {
  try {
    processing.value = true;
    
    // Validate all images have catatan
    if (!validateImages()) {
      return;
    }
    
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
    // Validate all images have catatan before proceeding
    if (!validateImages()) {
      return;
    }
    
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
        url: "https://scontent.fkul10-1.fna.fbcdn.net/v/t1.6435-9/33382272_977231325777776_3291633360509599744_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=tsi5WpsPCREQ7kNvwEe3GJk&_nc_oc=Adl4_F7yjD2xX6siXLa_NANICn4Cak1Wmni5VBa7XhbSYIByOReFS3wwQc7n0JHnBqz05IBIajWiWh8LE9coTq0L&_nc_zt=23&_nc_ht=scontent.fkul10-1.fna&_nc_gid=4p3_JCn3HWweiLZBezB58w&oh=00_AfZFYLhw-KRbw3goXGgJkj7ewaf54KBCnG0_XXcl4y3TWQ&oe=68E1A4D7",
        catatan: "Keadaan dinding papan rumah",
        masaUpload: new Date().toISOString(),
        filename: "rumah_depan.jpg",
      },
      {
        url: "https://scontent.fkul15-1.fna.fbcdn.net/v/t39.30808-6/309943384_196941696025849_726196766864978484_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=IyNAhW7CUkgQ7kNvwHTA3nK&_nc_oc=AdmN3PYsmtpYr9gnvcQLzYd-zejr8nOaNfL2SkYiGIJsfKhvEWLi_gLtezJSzXrXrSpit_KvkUj1zjOCHOKl8Y4n&_nc_zt=23&_nc_ht=scontent.fkul15-1.fna&_nc_gid=aY79tE8vuTPag6wRgWP07g&oh=00_AfZvZmX3DPqOBnADSlF0Occy0BA6qGPavBKb7ME7Qre1eQ&oe=68C01482",
        catatan: "Pandangan depan rumah",
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
<template>
  <div>
    <!-- Page screen: TNI-KO-KT-10 -->
    <!-- Actor: CC/EPOAD -->
    <!-- Roles: CC/EPOAD -->
    
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Borang Rekod Serahan Tunai</h2>
        </div>
      </template>

      <template #body>
        <!-- Maklumat Serahan -->
        <rs-fieldset label="Maklumat Serahan Tunai" class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ID Permohonan</label>
              <p class="text-gray-900 font-medium">{{ deliveryData.id }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Pegawai Kewangan</label>
              <p class="text-gray-900">{{ deliveryData.namaPegawaiKewangan }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Serahan</label>
              <p class="text-gray-900 font-medium text-lg">RM {{ formatNumber(deliveryData.jumlah) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh & Masa Serahan</label>
              <p class="text-gray-900">{{ formatDateTime(deliveryData.tarikhMasaSerahan) }}</p>
            </div>
          </div>
        </rs-fieldset>

        <!-- Borang Rekod Serahan -->
        <FormKit
          type="form"
          @submit="handleSubmit"
          :actions="false"
          class="max-w-2xl mx-auto"
          v-model="formData"
        >
          <div class="grid grid-cols-1 gap-4">
            <!-- Nama Penerima -->
            <FormKit
              type="text"
              name="namaPenerima"
              label="Nama Penerima"
              placeholder="Masukkan nama penerima"
              validation="required"
              :validation-messages="{
                required: 'Nama penerima adalah wajib',
              }"
            />

            <!-- Tandatangan Digital -->
            <FormKit
              type="text"
              name="tandatanganDigital"
              label="Tandatangan Digital"
              placeholder="Masukkan tandatangan digital (mock)"
              validation="required"
              :validation-messages="{
                required: 'Tandatangan digital adalah wajib',
              }"
            />

            <!-- Gambar Bukti Serahan -->
            <FormKit
              type="file"
              name="gambarBuktiSerahan"
              label="Gambar Bukti Serahan"
              accept="image/*"
              validation="required"
              :validation-messages="{
                required: 'Gambar bukti serahan adalah wajib',
              }"
            />

            <!-- Catatan -->
            <FormKit
              type="textarea"
              name="catatan"
              label="Catatan"
              placeholder="Masukkan catatan serahan..."
              validation="required"
              :validation-messages="{
                required: 'Catatan adalah wajib',
              }"
              rows="4"
            />

            <!-- Pengesahan -->
            <FormKit
              type="checkbox"
              name="pengesahan"
              label="Saya mengesahkan bahawa serahan tunai telah diterima dengan lengkap dan betul"
              validation="required"
              :validation-messages="{
                required: 'Pengesahan adalah wajib',
              }"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 mt-6">
            <rs-button
              variant="secondary"
              @click="handleCancel"
            >
              Batal
            </rs-button>
            <rs-button
              type="submit"
              variant="primary"
              :loading="isSubmitting"
            >
              <Icon name="ph:check" class="mr-1" />
              Sahkan Serahan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  title: "Borang Rekod Serahan Tunai",
});

const route = useRoute();
const router = useRouter();
const isSubmitting = ref(false);

// State
const deliveryData = ref(null);
const formData = ref({
  namaPenerima: "",
  tandatanganDigital: "",
  gambarBuktiSerahan: null,
  catatan: "",
  pengesahan: false,
});

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Pentadbiran",
    type: "link",
    path: "/BF-TNI",
  },
  {
    name: "Tambah Nilai Tunai",
    type: "link",
    path: "/BF-TNI/tambah-nilai-tunai",
  },
  {
    name: "Rekod Serahan Tunai",
    type: "current",
    path: `/BF-TNI/tambah-nilai-tunai/rekod-serahan/${route.params.id}`,
  },
]);

// Load delivery data
onMounted(async () => {
  await loadDeliveryData();
});

const loadDeliveryData = async () => {
  try {
    // Mock data - replace with API call
    deliveryData.value = {
      id: route.params.id,
      namaPegawaiKewangan: "Ahmad bin Abdullah",
      jumlah: 25000,
      tarikhMasaSerahan: "2024-03-20T10:30:00",
      lokasi: "Cawangan Melaka",
      kaedah: "Tunai",
    };
    
    console.log("TNI-KO-KT-10: Borang Rekod Serahan Tunai - Memuatkan data untuk ID:", route.params.id);
  } catch (error) {
    console.error("Error loading delivery data:", error);
  }
};

// Helper functions
const formatNumber = (number) => {
  return new Intl.NumberFormat('ms-MY').format(number);
};

const formatDateTime = (dateTime) => {
  return new Date(dateTime).toLocaleString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Action handlers
const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    
    console.log("TNI-KO-KT-10: Borang Rekod Serahan Tunai - Data serahan:");
    console.log("Nama Penerima:", formData.value.namaPenerima);
    console.log("Tandatangan Digital:", formData.value.tandatanganDigital);
    console.log("Gambar Bukti Serahan:", formData.value.gambarBuktiSerahan);
    console.log("Catatan:", formData.value.catatan);
    console.log("Pengesahan:", formData.value.pengesahan);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("TNI-KO-KT-10: Borang Rekod Serahan Tunai - Status diset kepada 'Sah & Siap'");
    
    // Navigate to final status screen
    router.push(`/BF-TNI/tambah-nilai-tunai/status-tamat/${route.params.id}`);
    
  } catch (error) {
    console.error("Error submitting delivery record:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  router.push("/BF-TNI/tambah-nilai-tunai/mohon-tambah-nilai-tunai");
};
</script> 
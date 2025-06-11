<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Keluarkan Tunai</h2>
        </div>
      </template>

      <template #body>
        <!-- Info Details Section -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-medium mb-4">Maklumat Peti Besi</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Lokasi / Akaun Peti Besi</p>
              <p class="font-medium">{{ safeBoxInfo.lokasi }} ({{ safeBoxInfo.idAkaun }})</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Status Buka Operasi</p>
              <p class="font-medium">
                <rs-badge variant="success">Aktif</rs-badge>
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Baki Semasa Peti Besi</p>
              <p class="font-medium">RM {{ formatNumber(safeBoxInfo.bakiSemasa) }}</p>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <FormKit
          type="form"
          :actions="false"
          @submit="handleSubmit"
          v-model="formData"
        >
          <!-- Jumlah Tunai Dikeluarkan -->
          <FormKit
            type="number"
            name="jumlahTunai"
            label="Jumlah Tunai Dikeluarkan (RM)"
            validation="required|number|min:0|max"
            validation-label="Jumlah Tunai"
            :validation-messages="{
              required: 'Sila masukkan jumlah tunai',
              number: 'Sila masukkan nilai yang sah',
              min: 'Nilai tidak boleh negatif',
              max: 'Jumlah melebihi baki semasa'
            }"
            :validation-rules="{
              max: (value) => value <= safeBoxInfo.bakiSemasa
            }"
          />

          <!-- Tujuan Pengeluaran Tunai -->
          <FormKit
            type="text"
            name="tujuan"
            label="Tujuan Pengeluaran Tunai"
            validation="required"
            validation-label="Tujuan Pengeluaran"
            :validation-messages="{
              required: 'Sila masukkan tujuan pengeluaran'
            }"
          />

          <!-- Tarikh & Masa Pengeluaran -->
          <FormKit
            type="datetime-local"
            name="tarikhMasa"
            label="Tarikh & Masa Pengeluaran"
            :value="currentDateTime"
            validation="required"
            validation-label="Tarikh & Masa Pengeluaran"
          />

          <!-- Nama PIC Penerima Tunai -->
          <FormKit
            type="text"
            name="namaPIC"
            label="Nama PIC Penerima Tunai"
            validation="required"
            validation-label="Nama PIC"
            :validation-messages="{
              required: 'Sila masukkan nama PIC penerima'
            }"
          />

          <!-- Catatan Tambahan -->
          <FormKit
            type="textarea"
            name="catatan"
            label="Catatan Tambahan (jika ada)"
            rows="3"
          />

          <!-- Baki Peti Besi Selepas Pengeluaran -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Baki Peti Besi Selepas Pengeluaran
            </label>
            <p class="text-lg font-semibold">
              RM {{ formatNumber(remainingBalance) }}
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-2 mt-6">
            <rs-button variant="primary-outline" @click="handleCancel">
              Batal
            </rs-button>
            <rs-button variant="primary" type="submit" @click="handleSubmit">
              Simpan Rekod Pengeluaran
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Sahkan Pengeluaran Tunai"
      size="md"
      position="center"
    >
      <template #body>
        <p>Anda pasti ingin mengeluarkan tunai sebanyak <strong>RM {{ formatNumber(formData.jumlahTunai) }}</strong>?</p>
        <p class="mt-2">Baki selepas pengeluaran: <strong>RM {{ formatNumber(remainingBalance) }}</strong></p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="primary-outline" @click="showConfirmationModal = false">
            Batal
          </rs-button>
          <rs-button variant="primary" @click="handleConfirm">
            Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Keluarkan Tunai",
});

const route = useRoute();
const router = useRouter();

const breadcrumb = ref([
  {
    name: "Pentadbiran",
    type: "link",
    path: "/BF-TNI/opening-akaun",
  },
  {
    name: "Buka Operasi",
    type: "link",
    path: "/BF-TNI/opening-akaun/buka-operasi",
  },
  {
    name: "Keluarkan Tunai",
    type: "current",
    path: `/BF-TNI/opening-akaun/buka-operasi/keluarkan-tunai/${route.params.id}`,
  },
]);

// Current user info
const currentDateTime = computed(() => {
  return new Date().toISOString().slice(0, 16);
});

// Safe box info
const safeBoxInfo = ref({
  idAkaun: "PB001",
  lokasi: "Cawangan Kuala Lumpur",
  bakiSemasa: 10000,
});

// Form data
const formData = ref({
  jumlahTunai: 0,
  tujuan: "",
  tarikhMasa: currentDateTime.value,
  namaPIC: "",
  catatan: "",
});

// Computed remaining balance
const remainingBalance = computed(() => {
  return safeBoxInfo.value.bakiSemasa - (formData.value.jumlahTunai || 0);
});

// Modal control
const showConfirmationModal = ref(false);

// Methods
const handleSubmit = async (formData) => {
  showConfirmationModal.value = true;
};

const handleCancel = () => {
  router.back();
};

const handleConfirm = async () => {
  showConfirmationModal.value = false;
  // Save the withdrawal record and update safe box balance
  router.push("/BF-TNI/opening-akaun/buka-operasi");
};

// Helper functions
const formatNumber = (number) => {
  return new Intl.NumberFormat("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};
</script>

<style lang="scss" scoped></style> 
<<<<<<< HEAD
<template>
  <div>
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Section 1: Penerangan Ringkas -->
    <rs-card>
      <template #header>Semak Status Permohonan</template>
      <template #body>
        <div class="mb-4 text-gray-700">
          Sila masukkan Nombor Pengenalan dan ID Permohonan untuk menyemak status permohonan anda. Anda tidak perlu log masuk. Sila pastikan maklumat yang dimasukkan adalah betul.
        </div>

        <!-- Section 2: Form dgn FormKit -->
        <FormKit
          type="form"
          submit-label="Semak Status"
          :actions="false"
          @submit="handleSubmit"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <!-- Nombor Pengenalan -->
            <FormKit
              type="text"
              name="idNo"
              label="Nombor Pengenalan"
              validation="required|matches:/^[A-Za-z0-9\-\s]+$/"
              validation-label="Nombor Pengenalan"
              placeholder="Cth: 900101-14-5678 / ORG-12345 / S1234567A"
              v-model="form.idNo"
            />

            <!-- ID Permohonan -->
            <FormKit
              type="text"
              name="appId"
              label="ID Permohonan"
              validation="required"
              validation-label="ID Permohonan"
              placeholder="Cth: NAS-APP-2025-00123"
              v-model="form.appId"
            />
          </div>

          <!-- Section 3: Action Button -->
          <div class="flex space-x-2">
            <rs-button
              variant="primary"
              @click="submitForm"
              :loading="loading"
            >
              Semak Status
            </rs-button>
            <rs-button variant="secondary" @click="handleReset">
              Reset
            </rs-button>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="mt-4 text-red-600 font-medium">
            {{ errorMessage }}
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    const router = useRouter();
    const route = useRoute();

    definePageMeta({
    title: "Semak Status Permohonan",
    });

    // Breadcrumb
    const breadcrumb = ref([
    {
        name: "Semak Status",
        type: "current",
        path: "/status-tracking",
    },
    ]);

    // Form Data
    const form = ref({
    idNo: "",
    appId: "",
    });

    // Loading State
    const loading = ref(false);

    // Error Message
    const errorMessage = ref("");

    // Counter utk simulate click behavior
    const clickCount = ref(0);

    // Programmatic submit (trigger FormKit form submit)
    const submitForm = () => {
    clickCount.value++;

    // Simulate 1st click → profile
    if (clickCount.value === 1) {
        router.push("/BF-DP/Portal/profile");
    }
    // Simulate 2nd click → bantuan
    else if (clickCount.value === 2) {
        router.push("/BF-DP/Portal/bantuan");
    }
    // Optional → kalau click 3rd time → reset balik ke 1
    else {
        clickCount.value = 0;
        errorMessage.value = "Simulasi reset: sila klik Semak Status sekali lagi.";
    }
    };

    // Handle Reset
    const handleReset = () => {
    form.value.idNo = "";
    form.value.appId = "";
    errorMessage.value = "";
    clickCount.value = 0;
    };
</script>
<style lang="scss" scoped>
// Optional custom styles
</style>
=======
<template>
  <div>
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Section 1: Penerangan Ringkas -->
    <rs-card>
      <template #header>Semak Status Permohonan</template>
      <template #body>
        <div class="mb-4 text-gray-700">
          Sila masukkan Nombor Pengenalan dan ID Permohonan untuk menyemak status permohonan anda. Anda tidak perlu log masuk. Sila pastikan maklumat yang dimasukkan adalah betul.
        </div>

        <!-- Section 2: Form dgn FormKit -->
        <FormKit
          type="form"
          submit-label="Semak Status"
          :actions="false"
          @submit="handleSubmit"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <!-- Nombor Pengenalan -->
            <FormKit
              type="text"
              name="idNo"
              label="Nombor Pengenalan"
              validation="required|matches:/^[A-Za-z0-9\-\s]+$/"
              validation-label="Nombor Pengenalan"
              placeholder="Cth: 900101-14-5678 / ORG-12345 / S1234567A"
              v-model="form.idNo"
            />

            <!-- ID Permohonan -->
            <FormKit
              type="text"
              name="appId"
              label="ID Permohonan"
              validation="required"
              validation-label="ID Permohonan"
              placeholder="Cth: NAS-APP-2025-00123"
              v-model="form.appId"
            />
          </div>

          <!-- Section 3: Action Button -->
          <div class="flex space-x-2">
            <rs-button
              variant="primary"
              @click="submitForm"
              :loading="loading"
            >
              Semak Status
            </rs-button>
            <rs-button variant="secondary" @click="handleReset">
              Reset
            </rs-button>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="mt-4 text-red-600 font-medium">
            {{ errorMessage }}
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
    import { ref } from "vue";
    const router = useRouter();
    const route = useRoute();

    definePageMeta({
    title: "Semak Status Permohonan",
    });

    // Breadcrumb
    const breadcrumb = ref([
    {
        name: "Semak Status",
        type: "current",
        path: "/status-tracking",
    },
    ]);

    // Form Data
    const form = ref({
    idNo: "",
    appId: "",
    });

    // Loading State
    const loading = ref(false);

    // Error Message
    const errorMessage = ref("");

    // Counter utk simulate click behavior
    const clickCount = ref(0);

    // Programmatic submit (trigger FormKit form submit)
    const submitForm = () => {
    clickCount.value++;

    // Simulate 1st click → profile
    if (clickCount.value === 1) {
        router.push("/BF-DP/Portal/profile");
    }
    // Simulate 2nd click → bantuan
    else if (clickCount.value === 2) {
        router.push("/BF-DP/Portal/bantuan");
    }
    // Optional → kalau click 3rd time → reset balik ke 1
    else {
        clickCount.value = 0;
        errorMessage.value = "Simulasi reset: sila klik Semak Status sekali lagi.";
    }
    };

    // Handle Reset
    const handleReset = () => {
    form.value.idNo = "";
    form.value.appId = "";
    errorMessage.value = "";
    clickCount.value = 0;
    };
</script>
<style lang="scss" scoped>
// Optional custom styles
</style>
>>>>>>> 3dcc227fdaa7aaa5e054a6ffebfa8addde014eae

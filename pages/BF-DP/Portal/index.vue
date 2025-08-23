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
          ref="formRef"
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

          <!-- Error Message -->
          <div v-if="errorMessage" class="mt-4 text-red-600 font-medium">
            {{ errorMessage }}
          </div>
        </FormKit>
        <!-- Section 3: Action Button -->
          <div class="flex space-x-2">
            <rs-button
              variant="primary"
              @click="submitForm"
              :loading="loading"
            >
              Semak Status
            </rs-button>
            <rs-button variant="secondary" type="button" @click="handleReset">
              Reset
            </rs-button>
          </div>
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
    statusType: "", // add this
    });

    // Loading State
    const loading = ref(false);

    // Error Message
    const errorMessage = ref("");

    // Counter utk simulate click behavior
    const clickCount = ref(0);

    // Handle Reset
    const handleReset = () => {
    form.value.idNo = "";
    form.value.appId = "";
    errorMessage.value = "";
    clickCount.value = 0;
    };

    const idMapping: Record<string, string> = {
      "NAS-PRF-2025-002": "profile",
      "NAS-BTN-2025-001": "bantuan",
      "NAS-BTN-2025-003": "aduan",
    };

    const submitForm = () => {
    const type = idMapping[form.value.appId];

      if (!type) {
        errorMessage.value = "ID Permohonan tidak sah atau tiada mapping.";
        return;
      }

      switch (type) {
        case "aduan":
          navigateTo(`/BF-DP/Portal/aduan/01`);
          break;
        case "bantuan":
          navigateTo(`/BF-DP/Portal/bantuan/01`);
          break;
        case "profile":
          navigateTo(`/BF-DP/Portal/profile/01`);
          break;
        default:
          errorMessage.value = "Jenis status tidak sah.";
      }
    };
</script>
<style lang="scss" scoped>
// Optional custom styles
</style>

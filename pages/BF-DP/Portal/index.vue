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
          @submit="submitForm"
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

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <!-- Status Type -->
            <FormKit
              type="select"
              name="statusType"
              label="Jenis Status"
              placeholder="Pilih Jenis Status"
              v-model="form.statusType"
            >
              <option value="aduan">Aduan</option>
              <option value="bantuan">Bantuan</option>
              <option value="profile">Profile</option>
            </FormKit>
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

    definePageMeta({
    title: "Semak Status Permohonan",
    });

    // Breadcrumb
    const breadcrumb = ref([
    {
        name: "Semak Status",
        type: "current",
        path: "/BF-DP/Portal/",
    },
    ]);

    // Form Data
    const form = ref({
    idNo: "",
    appId: "",
    statusType: "",
    });

    // Loading State
    const loading = ref(false);

    // Error Message
    const errorMessage = ref("");

    // Handle Reset
    const handleReset = (): void => {
    form.value.idNo = "";
    form.value.appId = "";
    form.value.statusType = "";
    errorMessage.value = "";
    };

    const submitForm = (): void => {
      const type = form.value.statusType;
      if (["aduan", "bantuan", "profile"].includes(type)) {
        // Fix TypeScript navigation issue by using explicit route paths
        if (type === "aduan") {
          navigateTo("/BF-DP/Portal/aduan");
        } else if (type === "bantuan") {
          navigateTo("/BF-DP/Portal/bantuan");
        } else if (type === "profile") {
          navigateTo("/BF-DP/Portal/profile");
        }
      } else {
        errorMessage.value = "Sila pilih salah satu jenis status.";
      }
    };

</script>
<style lang="scss" scoped>
// Optional custom styles
</style>

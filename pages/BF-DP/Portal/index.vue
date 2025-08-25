<template>
  <div>
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Role Simulator - For Demo/Presentation Only -->
    <!-- This allows switching between different user roles to demonstrate role-based views -->
    <!-- In production, this would be replaced with actual user authentication and role management -->
    <div class="mb-4 flex items-center space-x-4">
      <label class="font-medium text-gray-700">Pilih Role:</label>
      <select v-model="selectedRole" class="border rounded p-1">
        <option value="pengguna-luar">Pengguna Luar</option>
        <option value="pengguna-dalam">Pengguna Dalam</option>
      </select>
    </div>

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

          <!-- Kategori Semakan - Only visible to Pengguna Dalam -->
          <div v-if="selectedRole === 'pengguna-dalam'" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <FormKit
              type="select"
              name="statusType"
              label="Kategori Semakan"
              placeholder="Pilih Kategori Semakan"
              v-model="form.statusType"
            >
              <option value="aduan">Status Aduan</option>
              <option value="bantuan">Status Bantuan</option>
              <option value="profile">Status Pendaftaran Profil</option>
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

    // Role Simulator - For Demo/Presentation Only
    const selectedRole = ref("pengguna-luar"); // default role

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
      // For Pengguna Luar, automatically determine status type based on search
      // For Pengguna Dalam, use the selected status type
      let type = form.value.statusType;
      
      if (selectedRole.value === 'pengguna-luar') {
        // External users get basic search - automatically determine category based on search
        // In production, this would query the database and determine the appropriate category
        // For demo purposes, we'll implement basic logic to determine the category
        
        // Simple logic: if ID starts with 'ADN', show aduan; if 'NAS-BTN', show bantuan; else show profile
        if (form.value.appId.startsWith('ADN')) {
          navigateTo("/BF-DP/Portal/aduan");
        } else if (form.value.appId.startsWith('NAS-BTN')) {
          navigateTo("/BF-DP/Portal/bantuan");
        } else if (form.value.appId.startsWith('NAS-PRF')) {
          navigateTo("/BF-DP/Portal/profile");
        } else {
          // Default fallback - you can customize this logic
          navigateTo("/BF-DP/Portal/aduan");
        }
        return;
      }
      
      // Internal users must select a category
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
        errorMessage.value = "Sila pilih salah satu kategori semakan.";
      }
    };

</script>
<style lang="scss" scoped>
// Optional custom styles
</style>

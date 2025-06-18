<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Carian Profil Third-Party</h2>
        </div>
      </template>

      <template #body>
        <!-- Form Section -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-4">Maklumat Carian</h3>
          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="select"
                name="kategori"
                label="Kategori Profil"
                validation="required"
                :options="kategoriOptions"
                placeholder="Pilih kategori"
                v-model="formData.kategori"
                :validation-messages="{ required: 'Kategori adalah wajib' }"
              />
              <FormKit
                type="text"
                name="noId"
                label="Nombor Pengenalan / Kod Vendor"
                validation="required"
                v-model="formData.noId"
                :placeholder="getPlaceholder()"
                :validation-messages="{ required: 'Nombor ID adalah wajib' }"
              />
            </div>

            <div class="mt-6 flex justify-end gap-4">
              <rs-button variant="primary-outline" @click="resetForm">Reset</rs-button>
              <rs-button variant="primary" :disabled="processing" @click="validateAndSearch">
                <span v-if="processing">
                  <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
                </span>
                <span v-else>Cari</span>
              </rs-button>
            </div>
          </FormKit>
        </div>

        <!-- Result Section -->
        <div v-if="searchCompleted" class="mt-6">
          <rs-card :variant="profileExists ? 'success' : 'warning'" class="mb-4">
            <template #body>
              <div class="flex items-center">
                <div class="mr-4">
                  <Icon
                    :name="profileExists ? 'mdi:check-circle' : 'mdi:alert-circle'"
                    size="2rem"
                    :class="profileExists ? 'text-green-600' : 'text-amber-600'"
                  />
                </div>
                <div>
                  <h3 class="text-lg font-medium">
                    {{ profileExists ? "Profil Ditemui" : "Profil Tidak Ditemui" }}
                  </h3>
                  <p class="text-sm mt-1">
                    {{
                      profileExists
                        ? "Profil telah wujud dalam sistem. Anda boleh teruskan ke kemaskini."
                        : "Profil belum wujud. Anda perlu meneruskan ke proses pendaftaran baharu."
                    }}
                  </p>
                </div>
              </div>
            </template>
            <template #footer>
              <div class="flex justify-end">
                <rs-button variant="primary" @click="navigateNext">
                  {{ profileExists ? "Kemaskini Profil" : "Pendaftaran Baharu" }}
                </rs-button>
              </div>
            </template>
          </rs-card>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

definePageMeta({ title: "Carian Profil Third-Party" });

const router = useRouter();
const processing = ref(false);
const searchCompleted = ref(false);
const profileExists = ref(false);

const breadcrumb = ref([
  { name: "Profil Third-Party", type: "link", path: "/BF-PRF/TP/PP/01" },
  { name: "Carian Profil", type: "current", path: "/BF-PRF/TP/PP/01" },
]);

const kategoriOptions = [
  { label: "Recipient (Individu)", value: "recipient" },
  { label: "Vendor (Syarikat/Entiti)", value: "vendor" },
];

const formData = ref({ kategori: "", noId: "" });

const getPlaceholder = () => {
  switch (formData.value.kategori) {
    case "recipient": return "Contoh: 880101121234";
    case "vendor": return "Contoh: VD123456";
    default: return "Sila pilih kategori dahulu";
  }
};

const resetForm = () => {
  formData.value.kategori = "";
  formData.value.noId = "";
  searchCompleted.value = false;
};

const validateAndSearch = () => {
  if (!formData.value.kategori || !formData.value.noId) return;
  performSearch();
};

const performSearch = () => {
  processing.value = true;
  searchCompleted.value = false;

  setTimeout(() => {
    processing.value = false;
    profileExists.value = Math.random() >= 0.5;
    searchCompleted.value = true;
  }, 1000);
};

const navigateNext = () => {
  if (profileExists.value) {
    router.push("/BF-PRF/TP/PP/03");
  } else {
    router.push("/BF-PRF/TP/PP/02");
  }
};

watch(
  () => formData.value.kategori,
  () => { formData.value.noId = ""; }
);
</script>

<style scoped></style>

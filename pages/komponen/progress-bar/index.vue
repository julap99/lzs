<script setup>
definePageMeta({
  title: "Progress Bar",
});

const showCode1 = ref(false);

const tooltips = ref({});

const copyCode = (codeId) => {
  const codeElement = document.getElementById(codeId);
  if (codeElement) {
    navigator.clipboard
      .writeText(codeElement.textContent)
      .then(() => {
        console.log("Kod disalin ke papan klip");
        showTooltip(codeId, "Kod disalin!");
      })
      .catch((err) => {
        console.error("Gagal menyalin kod: ", err);
        showTooltip(codeId, "Gagal menyalin kod");
      });
  }
};

const showTooltip = (codeId, message) => {
  tooltips.value[codeId] = message;
  setTimeout(() => {
    tooltips.value[codeId] = null;
  }, 2000); // Hide tooltip after 2 seconds
};
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header> Default </template>
      <template #body>
        <p class="mb-4">
          Gunakan komponen <code>rs-progress-bar</code> untuk membuat bar
          kemajuan. Terdapat prop untuk menukar warna, saiz, maksimum,
          menunjukkan nilai, dan nilai.
        </p>
        <rs-progress-bar
          label="Primary Progress"
          :value="11"
          :max="100"
          variant="primary"
          size="md"
          :show-value="true"
        ></rs-progress-bar>
        <rs-progress-bar
          label="Secondary Progress"
          :value="43"
          :max="100"
          variant="secondary"
          size="md"
          :show-value="true"
        ></rs-progress-bar>
        <rs-progress-bar
          label="Success Progress"
          :value="45"
          :max="100"
          variant="success"
          size="md"
          :show-value="true"
        ></rs-progress-bar>
        <rs-progress-bar
          label="Danger Progress"
          :value="90"
          :max="100"
          variant="danger"
          size="md"
          :show-value="true"
        ></rs-progress-bar>
        <rs-progress-bar
          label="Warning Progress"
          :value="36"
          :max="100"
          variant="warning"
          size="md"
          :show-value="true"
        ></rs-progress-bar>
        <rs-progress-bar
          label="Info Progress"
          :value="25"
          :max="100"
          variant="info"
          size="md"
          :show-value="true"
        ></rs-progress-bar>
        <div class="flex justify-end">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="showCode1 ? (showCode1 = false) : (showCode1 = true)"
          >
            Tunjukkan Kod
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div class="relative" v-show="showCode1" v-highlight>
              <button
                @click="copyCode('code1')"
                class="absolute top-4 right-2 text-sm bg-gray-300 hover:bg-gray-300 py-1 px-3 rounded z-10"
              >
                Salin Kod
              </button>
              <transition name="tooltip">
                <span
                  v-if="tooltips['code1']"
                  class="absolute top-0 right-0 mt-12 mr-2 bg-black text-white text-xs rounded py-1 px-2 z-10"
                >
                  {{ tooltips["code1"] }}
                </span>
              </transition>
              <NuxtScrollbar style="max-height: 300px">
                <pre id="code1" class="language-html shadow-none">
                  <code>
                    &lt;template&gt; 
                      &lt;rs-progress-bar 
                          label="Primary Progress"
                          :value="11"
                          :max="100"
                          variant="primary|secondary|success|danger|warning|info"
                          size="md|sm|lg"
                          :show-value="true|false"
                      &gt;&lt;/rs-progress-bar&gt;
                    &lt;/template&gt;

                    &lt;script setup&gt;&lt;/script&gt;
                  </code>
                </pre>
              </NuxtScrollbar>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Lencana",
});

const showCode = ref(false);
const showCode2 = ref(false);

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
      <template #header>
        <h5>Lencana Biasa</h5>
      </template>
      <template #body>
        <p class="mb-2">
          Gunakan <code>rs-badge</code> untuk menunjukkan lencana.
        </p>
        <div class="grid grid-cols-3 md:grid-cols-6 gap-4 gap-y-0">
          <rs-badge variant="primary" class="mb-4"> Primary </rs-badge>
          <rs-badge variant="info" class="mb-4"> Info </rs-badge>
          <rs-badge variant="success" class="mb-4"> Success </rs-badge>
          <rs-badge variant="warning" class="mb-4"> Warning </rs-badge>
          <rs-badge variant="danger" class="mb-4"> Danger </rs-badge>
        </div>
        <div class="flex justify-end">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="showCode ? (showCode = false) : (showCode = true)"
          >
            Tunjukkan Kod
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div v-show="showCode" v-highlight>
              <div class="relative">
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
                        &lt;rs-badge variant="primary"&gt;Primary&lt;/rs-badge&gt;
                        &lt;rs-badge variant="info"&gt;Info&lt;/rs-badge&gt;
                        &lt;rs-badge variant="success"&gt;Success&lt;/rs-badge&gt;
                        &lt;rs-badge variant="warning"&gt;Warning&lt;/rs-badge&gt;
                        &lt;rs-badge variant="danger"&gt;Danger&lt;/rs-badge&gt;
                      &lt;/template&gt;
                      &lt;script setup&gt;&lt;/script&gt;
                    </code>
                  </pre>
                </NuxtScrollbar>
              </div>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <!-- Badges with Icon -->
    <rs-card>
      <template #header>
        <h5>Lencana dengan Ikon</h5>
      </template>
      <template #body>
        <p class="mb-2">
          Sertakan props <code>icon</code> kepada <code>rs-badge</code> untuk
          menunjukkan lencana dengan ikon.
        </p>
        <div class="grid grid-cols-3 md:grid-cols-6 gap-4 gap-y-0">
          <rs-badge
            variant="primary"
            icon="material-symbols:star-outline-rounded"
            class="mb-4"
          >
            Primary
          </rs-badge>
          <rs-badge
            variant="info"
            icon="material-symbols:star-outline-rounded"
            class="mb-4"
          >
            Info
          </rs-badge>
          <rs-badge
            variant="success"
            icon="material-symbols:star-outline-rounded"
            class="mb-4"
          >
            Success
          </rs-badge>
          <rs-badge
            variant="warning"
            icon="material-symbols:star-outline-rounded"
            class="mb-4"
          >
            Warning
          </rs-badge>
          <rs-badge
            variant="danger"
            icon="material-symbols:star-outline-rounded"
            class="mb-4"
          >
            Danger
          </rs-badge>
        </div>
        <div class="flex justify-end">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="showCode2 ? (showCode2 = false) : (showCode2 = true)"
          >
            Tunjukkan Kod
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div v-show="showCode2" v-highlight>
              <div class="relative">
                <button
                  @click="copyCode('code2')"
                  class="absolute top-4 right-2 text-sm bg-gray-300 hover:bg-gray-300 py-1 px-3 rounded z-10"
                >
                  Salin Kod
                </button>
                <transition name="tooltip">
                  <span
                    v-if="tooltips['code2']"
                    class="absolute top-0 right-0 mt-12 mr-2 bg-black text-white text-xs rounded py-1 px-2 z-10"
                  >
                    {{ tooltips["code2"] }}
                  </span>
                </transition>
                <NuxtScrollbar style="max-height: 300px">
                  <pre id="code2" class="language-html shadow-none">
                    <code>
                      &lt;template&gt; 
                        &lt;rs-badge variant="primary" icon="material-symbols:star-outline-rounded"&gt;Primary&lt;/rs-badge&gt;
                        &lt;rs-badge variant="info" icon="material-symbols:star-outline-rounded"&gt;Info&lt;/rs-badge&gt;
                        &lt;rs-badge variant="success" icon="material-symbols:star-outline-rounded"&gt;Success&lt;/rs-badge&gt;
                        &lt;rs-badge variant="warning" icon="material-symbols:star-outline-rounded"&gt;Warning&lt;/rs-badge&gt;
                        &lt;rs-badge variant="danger" icon="material-symbols:star-outline-rounded"&gt;Danger&lt;/rs-badge&gt;
                      &lt;/template&gt;
                      &lt;script setup&gt;&lt;/script&gt;
                    </code>
                  </pre>
                </NuxtScrollbar>
              </div>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>
  </div>
</template>

<style scoped>
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

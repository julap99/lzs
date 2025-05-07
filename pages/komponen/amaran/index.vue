<script setup>
definePageMeta({
  title: "Amaran",
});

const showCode = ref(false);
const showCode2 = ref(false);
const autoDismiss = ref(false);
const timer = ref(1000);

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

const resetAlert = () => {
  autoDismiss.value = true;
};
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <h5>Amaran Biasa</h5>
      </template>
      <template #body>
        <p class="mb-2">
          Gunakan <code>rs-alert</code> untuk menunjukkan amaran.
        </p>
        <rs-alert
          variant="primary"
          icon="iconamoon:information-circle"
          class="mb-4"
        >
          Hai, ini adalah amaran primary!
        </rs-alert>
        <rs-alert
          variant="info"
          icon="iconamoon:information-circle"
          class="mb-4"
        >
          Hai, ini adalah amaran info!
        </rs-alert>
        <rs-alert
          variant="success"
          icon="iconamoon:information-circle"
          class="mb-4"
        >
          Hai, ini adalah amaran success!
        </rs-alert>
        <rs-alert
          variant="warning"
          icon="iconamoon:information-circle"
          class="mb-4"
        >
          Hai, ini adalah amaran warning!
        </rs-alert>
        <rs-alert
          variant="danger"
          icon="iconamoon:information-circle"
          class="mb-4"
        >
          Hai, ini adalah amaran danger!
        </rs-alert>
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
                        &lt;rs-alert variant="primary" icon="iconamoon:information-circle"&gt;Hai, ini adalah amaran primary!&lt;/rs-alert&gt;
                        &lt;rs-alert variant="info" icon="iconamoon:information-circle"&gt;Hai, ini adalah amaran info!&lt;/rs-alert&gt;
                        &lt;rs-alert variant="success" icon="iconamoon:information-circle"&gt;Hai, ini adalah amaran success!&lt;/rs-alert&gt;
                        &lt;rs-alert variant="warning" icon="iconamoon:information-circle"&gt;Hai, ini adalah amaran warning!&lt;/rs-alert&gt;
                        &lt;rs-alert variant="danger" icon="iconamoon:information-circle"&gt;Hai, ini adalah amaran danger!&lt;/rs-alert&gt;
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

    <rs-card>
      <template #header>
        <h5>Pemberhentian Automatik</h5>
      </template>
      <template #body>
        <p class="mb-2">
          Gunakan prop <code>auto-dismiss</code> untuk memberhentikan amaran
          secara automatik. Pemasa lalai adalah 1000ms. Anda boleh menukar
          pemasa dengan memberikan nilai kepada prop <code>timer</code>.
        </p>
        <rs-alert v-if="!autoDismiss" variant="primary" class="mb-4"
          >Hai, ini adalah amaran yang tidak diberhentikan secara
          automatik!</rs-alert
        >
        <rs-alert
          v-else
          variant="primary"
          class="mb-4"
          auto-dismiss
          :timer="timer"
          >Hai, ini adalah amaran yang diberhentikan secara automatik!</rs-alert
        >
        <div class="flex items-center gap-x-2">
          <FormKit
            type="number"
            name="timer"
            value="1000"
            step="100"
            v-model="timer"
            :classes="{
              outer: 'mb-0',
              inner: '!mb-0',
            }"
          />
          <rs-button @click="resetAlert"> Tetapkan Pemasa</rs-button>
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
                        &lt;rs-alert auto-dismiss :timer="1000"&gt;Hai, ini adalah amaran yang diberhentikan secara automatik!&lt;/rs-alert&gt;
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

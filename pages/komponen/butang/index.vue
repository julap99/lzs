<script setup>
definePageMeta({
  title: "Butang",
  breadcrumb: [
    {
      name: "Komponen",
      type: "current",
    },
  ],
});

const showCode1 = ref(false);
const showCode2 = ref(false);
const showCode3 = ref(false);
const showCode4 = ref(false);

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
          Gunakan <code>rs-button</code> untuk menunjukkan lencana.
        </p>
        <div class="flex flex-wrap items-center justify-start gap-x-6">
          <rs-button> Butang </rs-button>
        </div>
        <div class="flex justify-end">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg my-2"
            @click="showCode1 ? (showCode1 = false) : (showCode1 = true)"
          >
            Tunjukkan Kod
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div v-show="showCode1" v-highlight>
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
                        &lt;rs-button&gt;Butang&lt;/rs-button&gt;
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
      <template #header> Variasi </template>
      <template #body>
        <p class="mb-4">
          Variasi butang menggunakan prop <code>variant</code> untuk menukar
          warna butang. Terdapat 6 variasi: <code>primary</code>,
          <code>info</code>, <code>success</code>, <code>warning</code> dan
          <code>danger</code>.
        </p>

        <div class="flex flex-wrap items-center justify-start gap-x-6">
          <rs-button variant="primary"> Primary </rs-button>
          <rs-button variant="secondary"> Secondary </rs-button>
          <rs-button variant="info"> Info </rs-button>
          <rs-button variant="success"> Success </rs-button>
          <rs-button variant="warning"> Warning </rs-button>
          <rs-button variant="danger"> Danger </rs-button>
        </div>

        <div class="flex justify-end">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg my-2"
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
                        &lt;rs-button variant="primary"&gt;Primary&lt;/rs-button&gt;
                        &lt;rs-button variant="secondary"&gt;Secondary&lt;/rs-button&gt;
                        &lt;rs-button variant="info"&gt;Info&lt;/rs-button&gt;
                        &lt;rs-button variant="success"&gt;Success&lt;/rs-button&gt;
                        &lt;rs-button variant="warning"&gt;Warning&lt;/rs-button&gt;
                        &lt;rs-button variant="danger"&gt;Danger&lt;/rs-button&gt;
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
      <template #header> Jenis Variasi </template>
      <template #body>
        <p class="mb-4">
          Jenis variasi butang menggunakan prop <code>variant</code> untuk
          menukar bentuk butang. Terdapat 3 jenis variasi: <code>fill</code>,
          <code>outline</code> dan <code>text</code>. <code>fill</code> adalah
          default. <code>outline</code> digunakan untuk membuat butang dengan
          sempadan. <code>text</code> digunakan untuk membuat butang tanpa
          sempadan dan latar belakang.
        </p>

        <!-- Fill Button -->
        <div class="my-6">
          <div
            class="font-semibold text-lg bg-[rgb(var(--bg-1))] w-full mb-4 pl-2"
          >
            Fill
          </div>
          <div class="flex flex-wrap items-center justify-start gap-x-6">
            <rs-button variant="primary"> Primary </rs-button>
            <rs-button variant="secondary"> Secondary </rs-button>
            <rs-button variant="info"> Info </rs-button>
            <rs-button variant="success"> Success </rs-button>
            <rs-button variant="warning"> Warning </rs-button>
            <rs-button variant="danger"> Danger </rs-button>
          </div>
        </div>

        <!-- Outline Button -->
        <div class="my-6">
          <div
            class="font-semibold text-lg bg-[rgb(var(--bg-1))] w-full mb-4 pl-2"
          >
            Outline
          </div>
          <div class="flex flex-wrap items-center justify-start gap-x-6">
            <rs-button variant="primary-outline"> Primary </rs-button>
            <rs-button variant="secondary-outline"> Secondary </rs-button>
            <rs-button variant="info-outline"> Info </rs-button>
            <rs-button variant="success-outline"> Success </rs-button>
            <rs-button variant="warning-outline"> Warning </rs-button>
            <rs-button variant="danger-outline"> Danger </rs-button>
          </div>
        </div>

        <!-- Text Button -->
        <div class="my-6">
          <div
            class="font-semibold text-lg bg-[rgb(var(--bg-1))] w-full mb-4 pl-2"
          >
            Text
          </div>
          <div class="flex flex-wrap items-center justify-start gap-x-6">
            <rs-button variant="primary-text"> Primary </rs-button>
            <rs-button variant="secondary-text"> Secondary </rs-button>
            <rs-button variant="info-text"> Info </rs-button>
            <rs-button variant="success-text"> Success </rs-button>
            <rs-button variant="warning-text"> Warning </rs-button>
            <rs-button variant="danger-text"> Danger </rs-button>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg my-2"
            @click="showCode3 ? (showCode3 = false) : (showCode3 = true)"
          >
            Tunjukkan Kod
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div v-show="showCode3" v-highlight>
              <div class="relative">
                <button
                  @click="copyCode('code3')"
                  class="absolute top-4 right-2 text-sm bg-gray-300 hover:bg-gray-300 py-1 px-3 rounded z-10"
                >
                  Salin Kod
                </button>
                <transition name="tooltip">
                  <span
                    v-if="tooltips['code3']"
                    class="absolute top-0 right-0 mt-12 mr-2 bg-black text-white text-xs rounded py-1 px-2 z-10"
                  >
                    {{ tooltips["code3"] }}
                  </span>
                </transition>

                <NuxtScrollbar style="max-height: 300px">
                  <pre id="code3" class="language-html shadow-none">
                    <code>
                      &lt;template&gt; 
                        &lt;!-- Fill Button --&gt;
                        &lt;rs-button variant="primary"&gt;Primary&lt;/rs-button&gt;
                        &lt;rs-button variant="secondary"&gt;Secondary&lt;/rs-button&gt;
                        &lt;rs-button variant="info"&gt;Info&lt;/rs-button&gt;
                        &lt;rs-button variant="success"&gt;Success&lt;/rs-button&gt;
                        &lt;rs-button variant="warning"&gt;Warning&lt;/rs-button&gt;
                        &lt;rs-button variant="danger"&gt;Danger&lt;/rs-button&gt;
                    
                        &lt;!-- Outline Button --&gt;
                        &lt;rs-button variant="primary-outline"&gt;Primary&lt;/rs-button&gt;
                        &lt;rs-button variant="secondary-outline"&gt;Secondary&lt;/rs-button&gt;
                        &lt;rs-button variant="info-outline"&gt;Info&lt;/rs-button&gt;
                        &lt;rs-button variant="success-outline"&gt;Success&lt;/rs-button&gt;
                        &lt;rs-button variant="warning-outline"&gt;Warning&lt;/rs-button&gt;
                        &lt;rs-button variant="danger-outline"&gt;Danger&lt;/rs-button&gt;
                    
                        &lt;!-- Text Button --&gt;
                        &lt;rs-button variant="primary-text"&gt;Primary&lt;/rs-button&gt;
                        &lt;rs-button variant="secondary-text"&gt;Secondary&lt;/rs-button&gt;
                        &lt;rs-button variant="info-text"&gt;Info&lt;/rs-button&gt;
                        &lt;rs-button variant="success-text"&gt;Success&lt;/rs-button&gt;
                        &lt;rs-button variant="warning-text"&gt;Warning&lt;/rs-button&gt;
                        &lt;rs-button variant="danger-text"&gt;Danger&lt;/rs-button&gt;
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
      <template #header> Saiz </template>
      <template #body>
        <p class="mb-4">
          Saiz butang menggunakan prop <code>size</code> untuk menukar saiz
          butang. Terdapat 3 saiz: <code>small</code>, <code>medium</code> dan
          <code>large</code>.
        </p>

        <div class="flex flex-wrap items-center justify-start gap-x-6">
          <rs-button size="sm"> Kecil </rs-button>
          <rs-button size="md"> Sederhana </rs-button>
          <rs-button size="lg"> Besar </rs-button>
        </div>
        <div class="flex justify-end">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg my-2"
            @click="showCode4 ? (showCode4 = false) : (showCode4 = true)"
          >
            Tunjukkan Kod
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div v-show="showCode4" v-highlight>
              <div class="relative">
                <button
                  @click="copyCode('code4')"
                  class="absolute top-4 right-2 text-sm bg-gray-300 hover:bg-gray-300 py-1 px-3 rounded z-10"
                >
                  Salin Kod
                </button>
                <transition name="tooltip">
                  <span
                    v-if="tooltips['code4']"
                    class="absolute top-0 right-0 mt-12 mr-2 bg-black text-white text-xs rounded py-1 px-2 z-10"
                  >
                    {{ tooltips["code4"] }}
                  </span>
                </transition>

                <NuxtScrollbar style="max-height: 300px">
                  <pre id="code4" class="language-html shadow-none">
                    <code>
                      &lt;template&gt; 
                        &lt;rs-button size="sm"&gt;Kecil&lt;/rs-button&gt;
                        &lt;rs-button size="md"&gt;Sederhana&lt;/rs-button&gt;
                        &lt;rs-button size="lg"&gt;Besar&lt;/rs-button&gt;
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

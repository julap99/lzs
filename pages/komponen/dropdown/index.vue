<script setup>
definePageMeta({
  title: "Dropdown",
});

const showCode1 = ref(false);
const showCode2 = ref(false);
const showCode3 = ref(false);
const showCode4 = ref(false);
const showCode5 = ref(false);
const tooltips = ref({});

const dropdownItems = [
  {
    label: "Item 1 - Application",
    route: { name: "dashboard" },
  },
  {
    label: "Item 2 - Dashboard",
    route: { name: "dashboard" },
  },
  {
    label: "Item 3 - Items",
    route: { name: "dashboard" },
  },
];

const copyCode = (codeId) => {
  const codeElement = document.getElementById(codeId);
  if (codeElement) {
    navigator.clipboard
      .writeText(codeElement.textContent)
      .then(() => {
        showTooltip(codeId, "Kod disalin!");
      })
      .catch(() => {
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
      <template #header> Dropdown Biasa </template>
      <template #body>
        <p class="mb-2">
          Gunakan <code>rs-dropdown</code> untuk menunjukkan dropdown.
        </p>
        <div class="flex flex-wrap items-center justify-start gap-x-6">
          <rs-dropdown title="Biasa" class="mb-2">
            <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
          </rs-dropdown>

          <rs-dropdown title="Divider" class="mb-2">
            <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
            <rs-dropdown-item divider> Pilihan 3 </rs-dropdown-item>
          </rs-dropdown>
        </div>

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
            <div class="z-0" v-show="showCode1" v-highlight>
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
                        &lt;rs-dropdown title="Biasa"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
                        &lt;rs-dropdown title="Divider"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item divider&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
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
          Variasi dropdown menggunakan prop <code>variant</code> untuk menukar
          warna butang.
        </p>
        <div class="flex flex-wrap items-center justify-start gap-x-6">
          <rs-dropdown title="Primary" variant="primary" class="mb-2">
            <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
          </rs-dropdown>
          <rs-dropdown title="Info" variant="info" class="mb-2">
            <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
          </rs-dropdown>
          <rs-dropdown title="Success" variant="success" class="mb-2">
            <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
          </rs-dropdown>
          <rs-dropdown title="Warning" variant="warning" class="mb-2">
            <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
          </rs-dropdown>
          <rs-dropdown title="Danger" variant="danger" class="mb-2">
            <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
          </rs-dropdown>
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
            <div class="z-0" v-show="showCode2" v-highlight>
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
                        &lt;rs-dropdown title="Primary" variant="primary"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
                        &lt;rs-dropdown title="Info" variant="info"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
                        &lt;rs-dropdown title="Success" variant="success"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
                        &lt;rs-dropdown title="Warning" variant="warning"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
                        &lt;rs-dropdown title="Danger" variant="danger"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
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
          Variasi dropdown menggunakan prop <code>variant</code> untuk menukar
          warna butang.
        </p>

        <!-- Fill Button -->
        <div class="my-6">
          <div
            class="font-semibold text-lg bg-[rgb(var(--bg-1))] w-full mb-4 pl-2"
          >
            Fill
          </div>
          <div class="flex flex-wrap items-center justify-start gap-x-6">
            <rs-dropdown title="Primary" variant="primary" class="mb-2">
              <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
            </rs-dropdown>
            <rs-dropdown title="Info" variant="info" class="mb-2">
              <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
            </rs-dropdown>
            <rs-dropdown title="Success" variant="success" class="mb-2">
              <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
            </rs-dropdown>
            <rs-dropdown title="Warning" variant="warning" class="mb-2">
              <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
            </rs-dropdown>
            <rs-dropdown title="Danger" variant="danger" class="mb-2">
              <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
            </rs-dropdown>
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
            <rs-dropdown title="Primary" variant="primary-outline" class="mb-2">
              <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
            </rs-dropdown>
            <rs-dropdown title="Info" variant="info-outline" class="mb-2">
              <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
            </rs-dropdown>
            <rs-dropdown title="Success" variant="success-outline" class="mb-2">
              <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
            </rs-dropdown>
            <rs-dropdown title="Warning" variant="warning-outline" class="mb-2">
              <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
            </rs-dropdown>
            <rs-dropdown title="Danger" variant="danger-outline" class="mb-2">
              <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
            </rs-dropdown>
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
            <rs-dropdown title="Primary" variant="primary-text" class="mb-2">
              <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
            </rs-dropdown>
            <rs-dropdown title="Info" variant="info-text" class="mb-2">
              <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
            </rs-dropdown>
            <rs-dropdown title="Success" variant="success-text" class="mb-2">
              <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
            </rs-dropdown>
            <rs-dropdown title="Warning" variant="warning-text" class="mb-2">
              <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
            </rs-dropdown>
            <rs-dropdown title="Danger" variant="danger-text" class="mb-2">
              <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
              <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
            </rs-dropdown>
          </div>
        </div>
        <div class="flex justify-end">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="showCode3 ? (showCode3 = false) : (showCode3 = true)"
          >
            Tunjukkan Kod
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div class="z-0" v-show="showCode3" v-highlight>
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
                        &lt;!-- Fill Dropdown --&gt;
                        &lt;rs-dropdown title="Primary" variant="primary"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
                        &lt;rs-dropdown title="Info" variant="info"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
                        &lt;rs-dropdown title="Success" variant="success"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
                        &lt;rs-dropdown title="Warning" variant="warning"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
                        &lt;rs-dropdown title="Danger" variant="danger"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;

                        &lt;!-- Outline Dropdown --&gt;
                        &lt;rs-dropdown title="Primary" variant="primary-outline"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
                        &lt;rs-dropdown title="Info" variant="info-outline"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
                        &lt;rs-dropdown title="Success" variant="success-outline"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
                        &lt;rs-dropdown title="Warning" variant="warning-outline"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
                        &lt;rs-dropdown title="Danger" variant="danger-outline"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;

                        &lt;!-- Text Dropdown --&gt;
                        &lt;rs-dropdown title="Primary" variant="primary-text"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
                        &lt;rs-dropdown title="Info" variant="info-text"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
                        &lt;rs-dropdown title="Success" variant="success-text"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
                        &lt;rs-dropdown title="Warning" variant="warning-text"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
                        &lt;rs-dropdown title="Danger" variant="danger-text"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
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
      <template #header> Kedudukan </template>
      <template #body>
        <p class="mb-4">
          Kedudukan dropdown menggunakan prop <code>position</code> untuk
          menukar kedudukan item dropdown.
        </p>
        <div class="flex flex-wrap items-center justify-start gap-x-6">
          <rs-dropdown title="Bawah" class="mb-2">
            <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
          </rs-dropdown>
          <rs-dropdown title="Atas" position="top" class="mb-2">
            <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
          </rs-dropdown>
          <rs-dropdown title="Kiri" position="left" class="mb-2">
            <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
          </rs-dropdown>
          <rs-dropdown title="Kanan" position="right" class="mb-2">
            <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
          </rs-dropdown>
        </div>
        <div class="flex justify-end">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="showCode4 ? (showCode4 = false) : (showCode4 = true)"
          >
            Tunjukkan Kod
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div class="z-0" v-show="showCode4" v-highlight>
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
                        &lt;rs-dropdown title="Bawah"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
                        &lt;rs-dropdown title="Atas" position="top"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
                        &lt;rs-dropdown title="Kiri" position="left"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
                        &lt;rs-dropdown title="Kanan" position="right"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
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
          Saiz dropdown menggunakan prop <code>size</code> untuk menukar saiz
          butang dropdown.
        </p>
        <div class="flex flex-wrap items-center justify-start gap-x-6">
          <rs-dropdown title="Kecil" size="sm" class="mb-2">
            <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
          </rs-dropdown>
          <rs-dropdown title="Sederhana" size="md" class="mb-2">
            <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
          </rs-dropdown>
          <rs-dropdown title="Besar" size="lg" class="mb-2">
            <rs-dropdown-item> Pilihan 1 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 2 </rs-dropdown-item>
            <rs-dropdown-item> Pilihan 3 </rs-dropdown-item>
          </rs-dropdown>
        </div>
        <div class="flex justify-end">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="showCode5 ? (showCode5 = false) : (showCode5 = true)"
          >
            Tunjukkan Kod
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div class="z-0" v-show="showCode5" v-highlight>
              <div class="relative">
                <button
                  @click="copyCode('code5')"
                  class="absolute top-4 right-2 text-sm bg-gray-300 hover:bg-gray-300 py-1 px-3 rounded z-10"
                >
                  Salin Kod
                </button>
                <transition name="tooltip">
                  <span
                    v-if="tooltips['code5']"
                    class="absolute top-0 right-0 mt-12 mr-2 bg-black text-white text-xs rounded py-1 px-2 z-10"
                  >
                    {{ tooltips["code5"] }}
                  </span>
                </transition>

                <NuxtScrollbar style="max-height: 300px">
                  <pre id="code5" class="language-html shadow-none">
                    <code>
                      &lt;template&gt;
                        &lt;rs-dropdown title="Kecil" size="sm"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
                        &lt;rs-dropdown title="Sederhana" size="md"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
                        &lt;rs-dropdown title="Besar" size="lg"&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 1 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 2 &lt;/rs-dropdown-item&gt;
                          &lt;rs-dropdown-item&gt; Pilihan 3 &lt;/rs-dropdown-item&gt;
                        &lt;/rs-dropdown&gt;
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

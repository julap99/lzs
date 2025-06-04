<script setup>
definePageMeta({
  title: "Borang",
  breadcrumb: [
    {
      name: "Komponen",
      type: "current",
    },
  ],
});

const showCode = reactive({});
const tooltips = reactive({});

const toggleCode = (section) => {
  showCode[section] = !showCode[section];
};

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
  tooltips[codeId] = message;
  setTimeout(() => {
    tooltips[codeId] = null;
  }, 2000);
};

const formData = reactive({
  name: "",
  email: "",
  password: "",
  date: "",
  time: "",
  number: 0,
  textarea: "",
  select: "",
  checkbox: [],
  radio: "",
  range: 50,
  file: null,
  toggle: false,
  singleCheckbox: false,
});

const options = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
];
</script>

<template>
  <div>
    <LayoutsBreadcrumb />

    <!-- Text Input -->
    <rs-card>
      <template #header>Text Input</template>
      <template #body>
        <p class="mb-4">
          Gunakan <code>text</code> sebagai jenis input untuk teks biasa.
        </p>
        <FormKit
          type="text"
          name="name"
          label="Nama"
          placeholder="Masukkan nama anda"
          v-model="formData.name"
        />
        <div class="flex justify-end mt-4">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="toggleCode('text')"
          >
            {{ showCode.text ? "Sembunyi Kod" : "Tunjuk Kod" }}
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div v-show="showCode.text" class="relative" v-highlight>
              <button
                @click="copyCode('codeText')"
                class="absolute top-4 right-2 text-sm bg-gray-300 hover:bg-gray-400 py-1 px-3 rounded z-10"
              >
                Salin Kod
              </button>
              <span
                v-if="tooltips['codeText']"
                class="absolute top-4 right-20 bg-black text-white text-xs rounded py-1 px-2 z-20"
              >
                {{ tooltips["codeText"] }}
              </span>
              <NuxtScrollbar style="max-height: 300px">
                <pre id="codeText" class="language-html shadow-none">
                  <code>
                    &lt;FormKit
                        type="text"
                        name="name"
                        label="Nama"
                        placeholder="Masukkan nama anda"
                        v-model="formData.name"
                      /&gt;
                  </code>
                </pre>
              </NuxtScrollbar>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <!-- Email Input -->
    <rs-card>
      <template #header>Email Input</template>
      <template #body>
        <p class="mb-4">
          Gunakan <code>email</code> sebagai jenis input untuk alamat email.
        </p>
        <FormKit
          type="email"
          name="email"
          label="Alamat Email"
          placeholder="nama@contoh.com"
          v-model="formData.email"
        />
        <div class="flex justify-end mt-4">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="toggleCode('email')"
          >
            {{ showCode.email ? "Sembunyi Kod" : "Tunjuk Kod" }}
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div v-show="showCode.email" class="relative" v-highlight>
              <button
                @click="copyCode('codeEmail')"
                class="absolute top-4 right-2 text-sm bg-gray-300 hover:bg-gray-400 py-1 px-3 rounded z-10"
              >
                Salin Kod
              </button>
              <span
                v-if="tooltips['codeEmail']"
                class="absolute top-4 right-20 bg-black text-white text-xs rounded py-1 px-2 z-20"
              >
                {{ tooltips["codeEmail"] }}
              </span>
              <NuxtScrollbar style="max-height: 300px">
                <pre id="codeEmail" class="language-html shadow-none">
                  <code>
                      &lt;FormKit
                        type="email"
                        name="email"
                        label="Alamat Email"
                        placeholder="nama@contoh.com"
                        v-model="formData.email"
                      /&gt;
                  </code>
                </pre>
              </NuxtScrollbar>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <!-- Password Input -->
    <rs-card>
      <template #header>Password Input</template>
      <template #body>
        <p class="mb-4">
          Gunakan <code>password</code> sebagai jenis input untuk kata laluan.
        </p>
        <FormKit
          type="password"
          name="password"
          label="Kata Laluan"
          placeholder="Masukkan kata laluan"
          v-model="formData.password"
        />
        <div class="flex justify-end mt-4">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="toggleCode('password')"
          >
            {{ showCode.password ? "Sembunyi Kod" : "Tunjuk Kod" }}
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div v-show="showCode.password" class="relative" v-highlight>
              <button
                @click="copyCode('codePassword')"
                class="absolute top-4 right-2 text-sm bg-gray-300 hover:bg-gray-400 py-1 px-3 rounded z-10"
              >
                Salin Kod
              </button>
              <span
                v-if="tooltips['codePassword']"
                class="absolute top-4 right-20 bg-black text-white text-xs rounded py-1 px-2 z-20"
              >
                {{ tooltips["codePassword"] }}
              </span>
              <NuxtScrollbar style="max-height: 300px">
                <pre id="codePassword" class="language-html shadow-none">
                  <code>
                      &lt;FormKit
                        type="password"
                        name="password"
                        label="Kata Laluan"
                        placeholder="Masukkan kata laluan"
                        v-model="formData.password"
                      /&gt;
                  </code>
                </pre>
              </NuxtScrollbar>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <!-- Date Input -->
    <rs-card>
      <template #header>Date Input</template>
      <template #body>
        <p class="mb-4">
          Gunakan <code>date</code> sebagai jenis input untuk memilih tarikh.
        </p>
        <FormKit
          type="date"
          name="date"
          label="Pilih Tarikh"
          v-model="formData.date"
        />
        <div class="flex justify-end mt-4">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="toggleCode('date')"
          >
            {{ showCode.date ? "Sembunyi Kod" : "Tunjuk Kod" }}
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div v-show="showCode.date" class="relative" v-highlight>
              <button
                @click="copyCode('codeDate')"
                class="absolute top-4 right-2 text-sm bg-gray-300 hover:bg-gray-400 py-1 px-3 rounded z-10"
              >
                Salin Kod
              </button>
              <span
                v-if="tooltips['codeDate']"
                class="absolute top-4 right-20 bg-black text-white text-xs rounded py-1 px-2 z-20"
              >
                {{ tooltips["codeDate"] }}
              </span>
              <NuxtScrollbar style="max-height: 300px">
                <pre id="codeDate" class="language-html shadow-none">
                  <code>
                      &lt;FormKit
                        type="date"
                        name="date"
                        label="Pilih Tarikh"
                        v-model="formData.date"
                      /&gt;
                  </code>
                </pre>
              </NuxtScrollbar>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <!-- Time Input -->
    <rs-card>
      <template #header>Time Input</template>
      <template #body>
        <p class="mb-4">
          Gunakan <code>time</code> sebagai jenis input untuk memilih masa.
        </p>
        <FormKit
          type="time"
          name="time"
          label="Pilih Masa"
          v-model="formData.time"
        />
        <div class="flex justify-end mt-4">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="toggleCode('time')"
          >
            {{ showCode.time ? "Sembunyi Kod" : "Tunjuk Kod" }}
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div v-show="showCode.time" class="relative" v-highlight>
              <button
                @click="copyCode('codeTime')"
                class="absolute top-4 right-2 text-sm bg-gray-300 hover:bg-gray-400 py-1 px-3 rounded z-10"
              >
                Salin Kod
              </button>
              <span
                v-if="tooltips['codeTime']"
                class="absolute top-4 right-20 bg-black text-white text-xs rounded py-1 px-2 z-20"
              >
                {{ tooltips["codeTime"] }}
              </span>
              <NuxtScrollbar style="max-height: 300px">
                <pre id="codeTime" class="language-html shadow-none">
                  <code>
                      &lt;FormKit
                        type="time"
                        name="time"
                        label="Pilih Masa"
                        v-model="formData.time"
                      /&gt;
                  </code>
                </pre>
              </NuxtScrollbar>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <!-- Number Input -->
    <rs-card>
      <template #header>Number Input</template>
      <template #body>
        <p class="mb-4">
          Gunakan <code>number</code> sebagai jenis input untuk nombor.
        </p>
        <FormKit
          type="number"
          name="number"
          label="Nombor"
          v-model="formData.number"
        />
        <div class="flex justify-end mt-4">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="toggleCode('number')"
          >
            {{ showCode.number ? "Sembunyi Kod" : "Tunjuk Kod" }}
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div v-show="showCode.number" class="relative" v-highlight>
              <button
                @click="copyCode('codeNumber')"
                class="absolute top-4 right-2 text-sm bg-gray-300 hover:bg-gray-400 py-1 px-3 rounded z-10"
              >
                Salin Kod
              </button>
              <span
                v-if="tooltips['codeNumber']"
                class="absolute top-4 right-20 bg-black text-white text-xs rounded py-1 px-2 z-20"
              >
                {{ tooltips["codeNumber"] }}
              </span>
              <NuxtScrollbar style="max-height: 300px">
                <pre id="codeNumber" class="language-html shadow-none">
                  <code>
                      &lt;FormKit
                        type="number"
                        name="number"
                        label="Nombor"
                        v-model="formData.number"
                      /&gt;
                  </code>
                </pre>
              </NuxtScrollbar>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <!-- Textarea Input -->
    <rs-card>
      <template #header>Textarea Input</template>
      <template #body>
        <p class="mb-4">
          Gunakan <code>textarea</code> sebagai jenis input untuk teks panjang.
        </p>
        <FormKit
          type="textarea"
          name="textarea"
          label="Textarea"
          placeholder="Masukkan teks panjang di sini"
          v-model="formData.textarea"
        />
        <div class="flex justify-end mt-4">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="toggleCode('textarea')"
          >
            {{ showCode.textarea ? "Sembunyi Kod" : "Tunjuk Kod" }}
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div v-show="showCode.textarea" class="relative" v-highlight>
              <button
                @click="copyCode('codeTextarea')"
                class="absolute top-4 right-2 text-sm bg-gray-300 hover:bg-gray-400 py-1 px-3 rounded z-10"
              >
                Salin Kod
              </button>
              <span
                v-if="tooltips['codeTextarea']"
                class="absolute top-4 right-20 bg-black text-white text-xs rounded py-1 px-2 z-20"
              >
                {{ tooltips["codeTextarea"] }}
              </span>
              <NuxtScrollbar style="max-height: 300px">
                <pre id="codeTextarea" class="language-html shadow-none">
                  <code>
                      &lt;FormKit
                        type="textarea"
                        name="textarea"
                        label="Textarea"
                        placeholder="Masukkan teks panjang di sini"
                        v-model="formData.textarea"
                      /&gt;
                  </code>
                </pre>
              </NuxtScrollbar>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <!-- Select Input -->
    <rs-card>
      <template #header>Select Input</template>
      <template #body>
        <p class="mb-4">
          Gunakan <code>select</code> sebagai jenis input untuk pilihan dari
          senarai.
        </p>
        <FormKit
          type="select"
          name="select"
          label="Pilih Satu"
          placeholder="Pilih satu pilihan"
          :options="options"
          v-model="formData.select"
        />
        <div class="flex justify-end mt-4">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="toggleCode('select')"
          >
            {{ showCode.select ? "Sembunyi Kod" : "Tunjuk Kod" }}
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div v-show="showCode.select" class="relative" v-highlight>
              <button
                @click="copyCode('codeSelect')"
                class="absolute top-4 right-2 text-sm bg-gray-300 hover:bg-gray-400 py-1 px-3 rounded z-10"
              >
                Salin Kod
              </button>
              <span
                v-if="tooltips['codeSelect']"
                class="absolute top-4 right-20 bg-black text-white text-xs rounded py-1 px-2 z-20"
              >
                {{ tooltips["codeSelect"] }}
              </span>
              <NuxtScrollbar style="max-height: 300px">
                <pre id="codeSelect" class="language-html shadow-none">
                  <code>
                      &lt;FormKit
                      type="select"
                      name="select"
                      label="Pilih Satu"
                      placeholder="Pilih satu pilihan"
                      :options="options"
                      v-model="formData.select"
                      /&gt;

                      // In script setup:
                      const options = [
                          { label: 'Option 1', value: '1' },
                          { label: 'Option 2', value: '2' },
                          { label: 'Option 3', value: '3' },
                      ];
                  </code>
                </pre>
              </NuxtScrollbar>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <!-- Checkbox Input -->
    <rs-card>
      <template #header>Checkbox Input</template>
      <template #body>
        <p class="mb-4">
          Gunakan <code>checkbox</code> sebagai jenis input untuk pilihan
          berbilang.
        </p>

        <div class="space-y-4">
          <FormKit
            type="checkbox"
            name="checkbox"
            :options="[
              { label: 'Pilihan oweasds', value: '1' },
              { label: 'Pilihan asdasdakscj', value: '2' },
              { label: 'Pilihan 1uo3oanbdfojsnd', value: '3' },
            ]"
            v-model="formData.checkbox"
          />

          <div class="mt-4">
            <p class="text-sm text-gray-600 mb-2">
              Nilai dipilih (berbilang): {{ formData.checkbox }}
            </p>
          </div>
        </div>

        <div class="flex justify-end mt-4">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="toggleCode('checkbox')"
          >
            {{ showCode.checkbox ? "Sembunyi Kod" : "Tunjuk Kod" }}
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div v-show="showCode.checkbox" class="relative" v-highlight>
              <button
                @click="copyCode('codeCheckbox')"
                class="absolute top-4 right-2 text-sm bg-gray-300 hover:bg-gray-400 py-1 px-3 rounded z-10"
              >
                Salin Kod
              </button>
              <span
                v-if="tooltips['codeCheckbox']"
                class="absolute top-4 right-20 bg-black text-white text-xs rounded py-1 px-2 z-20"
              >
                {{ tooltips["codeCheckbox"] }}
              </span>
              <NuxtScrollbar style="max-height: 300px">
                <pre id="codeCheckbox" class="language-html shadow-none">
                  <code>
                      &lt;!-- Checkbox berbilang dengan pilihan --&gt;
                      &lt;FormKit
                        type="checkbox"
                        name="checkbox"
                        label="Pilihan"
                        :options="[
                          { label: 'Pilihan 1', value: '1' },
                          { label: 'Pilihan 2', value: '2' },
                          { label: 'Pilihan 3', value: '3' },
                        ]"
                        v-model="formData.checkbox"
                        class="custom-checkbox-group"
                      /&gt;
                      
                      &lt;!-- Checkbox tunggal --&gt;
                      &lt;FormKit
                        type="checkbox"
                        name="singleCheckbox"
                        label="Saya setuju dengan terma dan syarat"
                        v-model="formData.singleCheckbox"
                        class="custom-checkbox-group"
                      /&gt;
                  </code>
                </pre>
              </NuxtScrollbar>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <!-- Radio Input -->
    <rs-card>
      <template #header>Radio Input</template>
      <template #body>
        <p class="mb-4">
          Gunakan <code>radio</code> sebagai jenis input untuk pilihan tunggal.
        </p>
        <FormKit
          type="radio"
          name="radio"
          :options="options"
          v-model="formData.radio"
        />
        <div class="mt-4">
          <p class="text-sm text-gray-600 mb-2">
            Nilai dipilih: {{ formData.radio }}
          </p>
        </div>
        <div class="flex justify-end mt-4">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="toggleCode('radio')"
          >
            {{ showCode.radio ? "Sembunyi Kod" : "Tunjuk Kod" }}
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div v-show="showCode.radio" class="relative" v-highlight>
              <button
                @click="copyCode('codeRadio')"
                class="absolute top-4 right-2 text-sm bg-gray-300 hover:bg-gray-400 py-1 px-3 rounded z-10"
              >
                Salin Kod
              </button>
              <span
                v-if="tooltips['codeRadio']"
                class="absolute top-4 right-20 bg-black text-white text-xs rounded py-1 px-2 z-20"
              >
                {{ tooltips["codeRadio"] }}
              </span>
              <NuxtScrollbar style="max-height: 300px">
                <pre id="codeRadio" class="language-html shadow-none">
                  <code>
                      &lt;FormKit
                      type="radio"
                      name="radio"
                      label="Pilihan"
                      :options="options"
                      v-model="formData.radio"
                      /&gt;

                      // In script setup:
                      const options = [
                          { label: 'Option 1', value: '1' },
                          { label: 'Option 2', value: '2' },
                          { label: 'Option 3', value: '3' },
                      ];
                  </code>
                </pre>
              </NuxtScrollbar>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <!-- Range Input -->
    <rs-card>
      <template #header>Range Input</template>
      <template #body>
        <p class="mb-4">
          Gunakan <code>range</code> sebagai jenis input untuk memilih nilai
          dalam julat tertentu.
        </p>
        <FormKit
          type="range"
          name="range"
          label="Julat"
          min="0"
          max="100"
          step="1"
          v-model="formData.range"
        />
        <div class="flex justify-end mt-4">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="toggleCode('range')"
          >
            {{ showCode.range ? "Sembunyi Kod" : "Tunjuk Kod" }}
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div v-show="showCode.range" class="relative" v-highlight>
              <button
                @click="copyCode('codeRange')"
                class="absolute top-4 right-2 text-sm bg-gray-300 hover:bg-gray-400 py-1 px-3 rounded z-10"
              >
                Salin Kod
              </button>
              <span
                v-if="tooltips['codeRange']"
                class="absolute top-4 right-20 bg-black text-white text-xs rounded py-1 px-2 z-20"
              >
                {{ tooltips["codeRange"] }}
              </span>
              <NuxtScrollbar style="max-height: 300px">
                <pre id="codeRange" class="language-html shadow-none">
                  <code>
                      &lt;FormKit
                      type="range"
                      name="range"
                      label="Julat"
                      min="0"
                      max="100"
                      step="1"
                      v-model="formData.range"
                      /&gt;
                  </code>
                </pre>
              </NuxtScrollbar>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <!-- File Input -->
    <rs-card>
      <template #header>Fail Input</template>
      <template #body>
        <p class="mb-4">
          Gunakan <code>file</code> sebagai jenis input untuk memuat naik fail.
        </p>
        <FormKit
          type="file"
          name="file"
          label="Muat Naik Fail"
          accept="image/*"
          v-model="formData.file"
        />
        <div class="flex justify-end mt-4">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="toggleCode('file')"
          >
            {{ showCode.file ? "Sembunyi Kod" : "Tunjuk Kod" }}
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div v-show="showCode.file" class="relative" v-highlight>
              <button
                @click="copyCode('codeFile')"
                class="absolute top-4 right-2 text-sm bg-gray-300 hover:bg-gray-400 py-1 px-3 rounded z-10"
              >
                Salin Kod
              </button>
              <span
                v-if="tooltips['codeFile']"
                class="absolute top-4 right-20 bg-black text-white text-xs rounded py-1 px-2 z-20"
              >
                {{ tooltips["codeFile"] }}
              </span>
              <NuxtScrollbar style="max-height: 300px">
                <pre id="codeFile" class="language-html shadow-none">
                  <code>
                      &lt;FormKit
                      type="file"
                      name="file"
                      label="Muat Naik Fail"
                      accept="image/*"
                      v-model="formData.file"
                      /&gt;
                  </code>
                </pre>
              </NuxtScrollbar>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <!-- Toggle Input -->
    <rs-card>
      <template #header>Toggle Input</template>
      <template #body>
        <p class="mb-4">
          Gunakan <code>toggle</code> sebagai jenis input untuk suis on/off.
        </p>
        <FormKit
          type="toggle"
          name="toggle"
          label="Toggle"
          onLabel="Hidup"
          offLabel="Mati"
          v-model="formData.toggle"
        />
        <div class="flex justify-end mt-4">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="toggleCode('toggle')"
          >
            {{ showCode.toggle ? "Sembunyi Kod" : "Tunjuk Kod" }}
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div v-show="showCode.toggle" class="relative" v-highlight>
              <button
                @click="copyCode('codeToggle')"
                class="absolute top-4 right-2 text-sm bg-gray-300 hover:bg-gray-400 py-1 px-3 rounded z-10"
              >
                Salin Kod
              </button>
              <span
                v-if="tooltips['codeToggle']"
                class="absolute top-4 right-20 bg-black text-white text-xs rounded py-1 px-2 z-20"
              >
                {{ tooltips["codeToggle"] }}
              </span>
              <NuxtScrollbar style="max-height: 300px">
                <pre id="codeToggle" class="language-html shadow-none">
                  <code>
                      &lt;FormKit
                      type="toggle"
                      name="toggle"
                      label="Toggle"
                      onLabel="Hidup"
                      offLabel="Mati"
                      v-model="formData.toggle"
                      /&gt;
                  </code>
                </pre>
              </NuxtScrollbar>
            </div>
          </transition>
        </ClientOnly>
      </template>
    </rs-card>

    <!-- Validation Input -->
    <rs-card>
      <template #header>Validasi Input</template>
      <template #body>
        <p class="mb-4">
          Gunakan <code>validation</code> untuk menambah validasi pada input.
          Beberapa contoh validasi termasuk <code>required</code>,
          <code>email</code>, <code>min</code>, <code>max</code>, dan banyak
          lagi. Anda boleh lihat dengan lebih terperinci di
          <a
            href="https://formkit.com/essentials/validation"
            class="text-info underline"
            >input validasi</a
          >
        </p>
        <FormKit
          type="text"
          name="name"
          label="Nama"
          placeholder="Masukkan nama anda"
          v-model="formData.name"
          validation="required|min:3|max:20"
          :validation-messages="{
            required: 'Nama diperlukan',
            min: 'Nama terlalu pendek',
            max: 'Nama terlalu panjang',
          }"
        />
        <FormKit
          type="email"
          name="email"
          label="Alamat Email"
          placeholder="nama@contoh.com"
          v-model="formData.email"
          validation="required|email"
          :validation-messages="{
            required: 'Email diperlukan',
            email: 'Format email tidak sah',
          }"
        />
        <FormKit
          type="number"
          name="age"
          label="Umur"
          placeholder="Masukkan umur anda"
          v-model="formData.age"
          validation="required|min:18|max:60"
          :validation-messages="{
            required: 'Umur diperlukan',
            min: 'Umur minimum adalah 18',
            max: 'Umur maksimum adalah 60',
          }"
        />
        <div class="flex justify-end mt-4">
          <button
            class="text-sm border border-slate-200 py-1 px-3 rounded-lg"
            @click="toggleCode('validation')"
          >
            {{ showCode.validation ? "Sembunyi Kod" : "Tunjuk Kod" }}
          </button>
        </div>
        <ClientOnly>
          <transition name="fade">
            <div v-show="showCode.validation" class="relative" v-highlight>
              <button
                @click="copyCode('codeValidation')"
                class="absolute top-4 right-2 text-sm bg-gray-300 hover:bg-gray-400 py-1 px-3 rounded z-10"
              >
                Salin Kod
              </button>
              <span
                v-if="tooltips['codeValidation']"
                class="absolute top-4 right-20 bg-black text-white text-xs rounded py-1 px-2 z-20"
              >
                {{ tooltips["codeValidation"] }}
              </span>
              <NuxtScrollbar style="max-height: 300px">
                <pre id="codeValidation" class="language-html shadow-none">
              <code>
                  &lt;FormKit
                    type="text"
                    name="name"
                    label="Nama"
                    placeholder="Masukkan nama anda"
                    v-model="formData.name"
                    validation="required|min:3|max:20"
                    :validation-messages="{ required: 'Nama diperlukan', min: 'Nama terlalu pendek', max: 'Nama terlalu panjang' }"
                  /&gt;

                  &lt;FormKit
                    type="email"
                    name="email"
                    label="Alamat Email"
                    placeholder="nama@contoh.com"
                    v-model="formData.email"
                    validation="required|email"
                    :validation-messages="{ required: 'Email diperlukan', email: 'Format email tidak sah' }"
                  /&gt;

                  &lt;FormKit
                    type="number"
                    name="age"
                    label="Umur"
                    placeholder="Masukkan umur anda"
                    v-model="formData.age"
                    validation="required|min:18|max:60"
                    :validation-messages="{ required: 'Umur diperlukan', min: 'Umur minimum adalah 18', max: 'Umur maksimum adalah 60' }"
                  /&gt;
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-leave-to,
.fade-enter-from {
  opacity: 0;
}

/* Custom Checkbox Styling */
:deep(.custom-checkbox-group) {
  .formkit-options {
    @apply space-y-3;
  }

  .formkit-option {
    @apply flex items-center hover:text-primary transition-colors duration-200;
  }

  .formkit-inner {
    @apply relative flex items-center justify-center h-5 w-5 mr-3 rounded-md 
           border-2 border-gray-300 bg-white transition-all duration-200 
           focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 
           hover:border-primary/60;
  }

  input[type="checkbox"] {
    @apply absolute opacity-0 h-0 w-0;
  }

  input[type="checkbox"]:checked + .formkit-inner {
    @apply bg-primary border-primary;
  }

  input[type="checkbox"]:checked + .formkit-inner::after {
    content: "";
    @apply absolute block w-1.5 h-3 border-solid border-white border-r-2 border-b-2 transform rotate-45 -translate-y-px;
  }

  input[type="checkbox"]:focus + .formkit-inner {
    @apply ring-2 ring-primary/30;
  }

  input[type="checkbox"]:disabled + .formkit-inner {
    @apply opacity-50 cursor-not-allowed;
  }

  input[type="checkbox"]:disabled ~ .formkit-label {
    @apply opacity-50 cursor-not-allowed;
  }

  .formkit-label {
    @apply text-sm font-medium cursor-pointer select-none;
  }
}
</style>

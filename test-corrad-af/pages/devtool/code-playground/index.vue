<script setup>
import { parse } from "@vue/compiler-sfc";
import { watchDebounced } from "@vueuse/core";
import {
  RsAlert,
  RsBadge,
  RsButton,
  RsCard,
  RsCodeMirror,
  RsCollapse,
  RsCollapseItem,
  RsDropdown,
  RsDropdownItem,
  RsFieldset,
  RsModal,
  RsProgressBar,
  RsTab,
  RsTabItem,
  RsTable,
  RsWizard,
} from "./index.js";

// Import pinia store
import { useThemeStore } from "~/stores/theme";

definePageMeta({
  title: "AI SFC Playground",
  description: "AI SFC Playground page",
  layout: "empty",
  middleware: ["auth"],
  requiresAuth: true,
});

const CODE_STORAGE_KEY = "playground-code";

const code = ref(
  localStorage.getItem(CODE_STORAGE_KEY) ||
    `<template>
  <rs-card>
    <template #header>SFC Playground Demo</template>
    <template #body>
      <div class="space-y-4">
        <rs-alert variant="info">{{ msg }}</rs-alert>
        <rs-button @click="count++">Clicked {{ count }} times</rs-button>
        <rs-badge>{{ count > 5 ? 'High' : 'Low' }}</rs-badge>
      </div>
    </template>
  </rs-card>
</template>

<script setup>
const msg = 'Hello from SFC Playground';
const count = ref(0);
<\/script>`
);

const compiledCode = ref(null);
const componentKey = ref(0);
const compilationError = ref(null);

const previewSizes = [
  { name: "Mobile", width: "320px", icon: "ph:device-mobile-camera" },
  { name: "Tablet", width: "768px", icon: "ph:device-tablet-camera" },
  { name: "Desktop", width: "1024px", icon: "ph:desktop" },
  { name: "Full", width: "100%", icon: "material-symbols:fullscreen" },
];

const currentPreviewSize = ref(previewSizes[3]); // Default to Full

// Theme-related code
const themeStore = useThemeStore();
const editorTheme = ref({
  label: themeStore.codeTheme,
  value: themeStore.codeTheme,
});
const dropdownThemes = ref([]);

// Get all themes
const themes = codemirrorThemes();

// map the themes to the dropdown
dropdownThemes.value = themes.map((theme) => {
  return {
    label: theme.name,
    value: theme.name,
  };
});

// watch for changes in the theme
watch(editorTheme, (theme) => {
  themeStore.setCodeTheme(theme.value);
});

const compileCode = async (newCode) => {
  try {
    const { descriptor, errors } = parse(newCode);
    if (errors && errors.length > 0) {
      compilationError.value = {
        message: errors[0].message,
        location: errors[0].loc,
      };
      return;
    }

    if (descriptor.template && descriptor.scriptSetup) {
      const template = descriptor.template.content;
      const scriptSetup = descriptor.scriptSetup.content;

      // Dynamically import FormKit components
      const {
        FormKit,
        FormKitSchema,
        FormKitSchemaNode,
        FormKitSchemaCondition,
        FormKitSchemaValidation,
      } = await import("@formkit/vue");

      const component = defineComponent({
        components: {
          RsAlert,
          RsBadge,
          RsButton,
          RsCard,
          RsCodeMirror,
          RsCollapse,
          RsCollapseItem,
          RsDropdown,
          RsDropdownItem,
          RsFieldset,
          RsModal,
          RsProgressBar,
          RsTab,
          RsTabItem,
          RsTable,
          RsWizard,
          FormKit,
          FormKitSchema,
          FormKitSchemaNode,
          FormKitSchemaCondition,
          FormKitSchemaValidation,
        },
        template,
        setup() {
          const setupContext = reactive({});

          try {
            // Extract top-level declarations
            const declarations =
              scriptSetup.match(/const\s+(\w+)\s*=\s*([^;]+)/g) || [];
            declarations.forEach((decl) => {
              const [, varName, varValue] = decl.match(
                /const\s+(\w+)\s*=\s*(.+)/
              );
              if (
                varValue.trim().startsWith("'") ||
                varValue.trim().startsWith('"')
              ) {
                // It's a string literal, use it directly
                setupContext[varName] = varValue.trim().slice(1, -1);
              } else if (varValue.trim().startsWith("ref(")) {
                // It's already a ref, use ref
                setupContext[varName] = ref(null);
              } else {
                // For other cases, wrap in ref
                setupContext[varName] = ref(null);
              }
            });

            const setupFunction = new Function(
              "ctx",
              "ref",
              "reactive",
              "computed",
              "watch",
              "onMounted",
              "onUnmounted",
              "useFetch",
              "fetch",
              "useAsyncData",
              "useNuxtApp",
              "useRuntimeConfig",
              "useRoute",
              "useRouter",
              "useState",
              "FormKit",
              "FormKitSchema",
              "FormKitSchemaNode",
              "FormKitSchemaCondition",
              "FormKitSchemaValidation",
              `
              with (ctx) {
                ${scriptSetup}
              }
              return ctx;
              `
            );

            const result = setupFunction(
              setupContext,
              ref,
              reactive,
              computed,
              watch,
              onMounted,
              onUnmounted,
              useFetch,
              fetch,
              useAsyncData,
              useNuxtApp,
              useRuntimeConfig,
              useRoute,
              useRouter,
              useState,
              FormKit,
              FormKitSchema,
              FormKitSchemaNode,
              FormKitSchemaCondition,
              FormKitSchemaValidation
            );

            // Merge the result back into setupContext
            Object.assign(setupContext, result);

            return setupContext;
          } catch (error) {
            console.error("Error in setup function:", error);
            compilationError.value = {
              message: `Error in setup function: ${error.message}`,
              location: { start: 0, end: 0 },
            };
            // Return an empty object to prevent breaking the component
            return {};
          }
        },
      });

      compiledCode.value = markRaw(component);
      componentKey.value++;
      compilationError.value = null;
    } else {
      compiledCode.value = null;
      compilationError.value = {
        message: "Invalid SFC format.",
        location: { start: 0, end: 0 },
      };
    }
  } catch (error) {
    console.error("Compilation error:", error);
    compiledCode.value = null;
    compilationError.value = {
      message: `Compilation error: ${error.message}`,
      location: { start: 0, end: 0 },
    };
  }
};

watchDebounced(
  code,
  async (newCode) => {
    await compileCode(newCode);
  },
  { debounce: 300, immediate: true }
);

const handleFormatCode = () => {
  // Recompile the code after formatting
  setTimeout(() => compileCode(code.value), 100);
};

onMounted(async () => {
  await compileCode(code.value);
});

const defaultCode = `<template>
  <rs-card>
    <template #header>SFC Playground Demo</template>
    <template #body>
      <div class="space-y-4">
        <rs-alert variant="info">{{ msg }}</rs-alert>
        <rs-button @click="count++">Clicked {{ count }} times</rs-button>
        <rs-badge>{{ count > 5 ? 'High' : 'Low' }}</rs-badge>
      </div>
    </template>
  </rs-card>
</template>

<script setup>
const msg = 'Hello from SFC Playground';
const count = ref(0);
<\/script>`;

const resetCode = () => {
  code.value = defaultCode;
  localStorage.setItem(CODE_STORAGE_KEY, defaultCode);
  compileCode(code.value);
};

// Add a watch effect to save code changes to localStorage
watch(
  code,
  (newCode) => {
    localStorage.setItem(CODE_STORAGE_KEY, newCode);
  },
  { deep: true }
);
</script>
<template>
  <div class="flex flex-col h-screen bg-gray-900">
    <!-- Header -->
    <header
      class="bg-gray-800 p-2 flex flex-wrap items-center justify-between text-white"
    >
      <div class="flex items-center mb-2 sm:mb-0 gap-4">
        <Icon
          @click="navigateTo('/')"
          name="ph:arrow-circle-left-duotone"
          class="cursor-pointer"
        />
        <img
          src="@/assets/img/logo/logo-word-white.svg"
          alt="Vue Logo"
          class="h-8 block mr-2"
        />
      </div>
      <div class="flex flex-wrap items-center space-x-2">
        <rs-button @click="resetCode" class="mr-2">
          <Icon name="material-symbols:refresh" class="mr-2" />
          Reset Code
        </rs-button>
        <h1 class="text-lg font-semibold">Code Playground</h1>
      </div>
    </header>

    <!-- Main content -->
    <div class="flex flex-col sm:flex-row flex-1 overflow-hidden">
      <!-- Editor section -->
      <div
        class="w-full sm:w-1/2 flex flex-col border-b sm:border-b-0 sm:border-r border-gray-900"
      >
        <div class="flex-grow overflow-hidden">
          <rs-code-mirror
            v-model="code"
            mode="javascript"
            class="h-full"
            @format-code="handleFormatCode"
          />
        </div>
      </div>

      <!-- Preview section -->
      <div class="w-full sm:w-1/2 bg-white overflow-auto flex flex-col">
        <div
          class="bg-gray-800 p-2 flex justify-between items-center text-white"
        >
          <h2 class="text-sm font-semibold">Preview</h2>
          <div class="flex space-x-2">
            <rs-button
              v-for="size in previewSizes"
              :key="size.name"
              @click="currentPreviewSize = size"
              :class="{
                'bg-blue-600': currentPreviewSize === size,
                'bg-gray-600': currentPreviewSize !== size,
              }"
              class="px-2 py-1 text-xs rounded"
            >
              <Icon v-if="size.icon" :name="size.icon" class="!w-5 !h-5 mr-2" />
              {{ size.name }}
            </rs-button>
          </div>
        </div>
        <div class="flex-grow overflow-auto p-4 flex justify-center">
          <div
            :style="{
              width: currentPreviewSize.width,
              height: '100%',
              overflow: 'auto',
            }"
            class="border border-gray-300 transition-all duration-300 ease-in-out"
          >
            <component
              :key="componentKey"
              v-if="compiledCode && !compilationError"
              :is="compiledCode"
            />
            <div v-else-if="compilationError?.message">
              <div class="flex justify-center items-center p-5">
                <div class="text-center">
                  <Icon name="ph:warning" class="text-6xl" />
                  <p class="text-lg font-semibold mt-4">
                    Something went wrong. Please refer the error in the editor.
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="text-gray-500">Waiting for code changes...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.device-frame {
  background-color: #f0f0f0;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 640px) {
  .device-frame {
    padding: 8px;
    border-radius: 8px;
  }
}

:deep(.cm-editor) {
  height: 100%;
}
</style>

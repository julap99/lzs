<script setup>
// import pinia store
import { useThemeStore } from "~/stores/theme";

definePageMeta({
  title: "API Code Editor",
  middleware: ["auth"],
  requiresAuth: true,
});

const { $swal, $router } = useNuxtApp();
const route = useRoute();
const router = useRouter();

const fileCode = ref("");
const fileCodeConstant = ref("");
const componentKey = ref(0);

const hasError = ref(false);
const error = ref("");

const themeStore = useThemeStore();
const editorTheme = ref({
  label: themeStore.codeTheme,
  value: themeStore.codeTheme,
});
const dropdownThemes = ref([]);

const linterError = ref(false);
const linterErrorText = ref("");
const linterErrorColumn = ref(0);
const linterErrorLine = ref(0);

// Add new ref for loading state
const isLinterChecking = ref(false);

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
  forceRerender();
});

// Call API to get the code
const { data } = await useFetch("/api/devtool/api/file-code", {
  initialCache: false,
  method: "GET",
  query: {
    path: route.query?.path,
  },
});

if (data.value.statusCode === 200) {
  fileCode.value = data.value.data;
  fileCodeConstant.value = data.value.data;
} else {
  $swal
    .fire({
      title: "Error",
      text: "The API you are trying to edit is not found. Please choose a API to edit.",
      icon: "error",
      confirmButtonText: "Ok",
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        await $router.push("/devtool/api-editor");
      }
    });
}

async function formatCode() {
  // Call API to get the code
  const { data } = await useFetch("/api/devtool/api/prettier-format", {
    initialCache: false,
    method: "POST",
    body: JSON.stringify({
      code: fileCode.value,
    }),
  });
  forceRerender();

  if (data.value.statusCode === 200) {
    fileCode.value = data.value.data;
  }
}

async function checkLinterVue() {
  isLinterChecking.value = true;
  try {
    // Call API to get the code
    const { data } = await useFetch("/api/devtool/api/linter", {
      initialCache: false,
      method: "POST",
      body: JSON.stringify({
        code: fileCode.value,
      }),
    });

    if (data.value.statusCode === 200) {
      linterError.value = false;
      linterErrorText.value = "";
      linterErrorColumn.value = 0;
      linterErrorLine.value = 0;
    } else if (data.value.statusCode === 400) {
      linterError.value = true;
      linterErrorText.value = data.value.data.message;
      linterErrorColumn.value = data.value.data.column;
      linterErrorLine.value = data.value.data.line;
    }
  } finally {
    isLinterChecking.value = false;
  }
}

const forceRerender = () => {
  componentKey.value += 1;
};

const keyPress = (key) => {
  console.log(key);
  const event = new KeyboardEvent("keydown", {
    key: key,
    ctrlKey: true,
  });
  console.log(event);
  document.dispatchEvent(event);
};

const saveCode = async () => {
  // Check Linter Vue
  await checkLinterVue();

  if (linterError.value) {
    $swal.fire({
      title: "Error",
      text: "There is an error in your code. Please fix it before saving.",
      icon: "error",
      confirmButtonText: "Ok",
    });
    return;
  }

  const { data } = await useFetch("/api/devtool/api/save", {
    initialCache: false,
    method: "POST",
    body: {
      path: route.query?.path,
      code: fileCode.value,
      type: "update",
    },
  });
  if (data.value.statusCode === 200) {
    $swal.fire({
      title: "Success",
      text: "The code has been saved successfully.",
      icon: "success",
      confirmButtonText: "Ok",
      timer: 1000,
    });
    setTimeout(() => {
      $router.go();
    }, 1000);
  }
};
</script>

<template>
  <div>
    <LayoutsBreadcrumb />

    <rs-alert v-if="hasError" class="mb-4" variant="danger">{{
      error
    }}</rs-alert>
    <rs-card>
      <rs-tab fill>
        <rs-tab-item title="Editor">
          <div class="flex justify-end gap-2 mb-4">
            <rs-button
              class="!p-2"
              @click="saveCode"
              :disabled="isLinterChecking"
            >
              <div class="flex items-center">
                <Icon
                  v-if="!isLinterChecking"
                  name="material-symbols:save-outline-rounded"
                  size="20px"
                  class="mr-1"
                />
                <Icon
                  v-else
                  name="eos-icons:loading"
                  size="20px"
                  class="mr-1 animate-spin"
                />
                {{ isLinterChecking ? "Checking..." : "Save API" }}
              </div>
            </rs-button>
          </div>
          <Transition>
            <rs-alert v-if="linterError" variant="danger" class="mb-4">
              <div class="flex gap-2">
                <Icon
                  name="material-symbols:error-outline-rounded"
                  size="20px"
                />
                <div>
                  <div class="font-bold">ESLint Error</div>
                  <div class="text-sm">
                    {{ linterErrorText }}
                  </div>
                  <div class="text-xs mt-2">
                    Line: {{ linterErrorLine }} Column: {{ linterErrorColumn }}
                  </div>
                </div>
              </div>
            </rs-alert>
          </Transition>

          <rs-code-mirror
            :key="componentKey"
            v-model="fileCode"
            mode="javascript"
          />
        </rs-tab-item>
        <rs-tab-item title="API Tester">
          <rs-api-tester :url="route.query?.path" />
        </rs-tab-item>
      </rs-tab>
    </rs-card>
  </div>
</template>

<style lang="scss" scoped></style>

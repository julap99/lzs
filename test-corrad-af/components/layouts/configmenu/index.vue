<script setup>
import { useThemeStore } from "~/stores/theme";

const colorMode = useColorMode();
const themeStore = useThemeStore();

const hideConfigMenu = ref(true);
const rgbColor = ref({});

const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

const setThemeColor = (type, color) => {
  themeStore.setThemeColor(type, color);

  // Remove Color form type string
  const colorType = type.replace("Color", "").toLowerCase();
  document.documentElement.style.setProperty(
    `--color-${colorType}`,
    hexToRgb(color)
  );
};

function setColorMode() {
  if (colorMode.preference == "light") {
    colorMode.preference = "dark";

    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
  } else {
    colorMode.preference = "light";

    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  }
}

const setThemeGlobal = () => {
  rgbColor.value.primary = themeStore.primaryColor;
  rgbColor.value.secondary = themeStore.secondaryColor;
  rgbColor.value.info = themeStore.infoColor;
  rgbColor.value.success = themeStore.successColor;
  rgbColor.value.warning = themeStore.warningColor;
  rgbColor.value.danger = themeStore.dangerColor;

  document.documentElement.style.setProperty(
    "--color-primary",
    hexToRgb(themeStore.primaryColor)
  );
  document.documentElement.style.setProperty(
    "--color-secondary",
    hexToRgb(themeStore.secondaryColor)
  );
  document.documentElement.style.setProperty(
    "--color-info",
    hexToRgb(themeStore.infoColor)
  );
  document.documentElement.style.setProperty(
    "--color-success",
    hexToRgb(themeStore.successColor)
  );
  document.documentElement.style.setProperty(
    "--color-warning",
    hexToRgb(themeStore.warningColor)
  );
  document.documentElement.style.setProperty(
    "--color-danger",
    hexToRgb(themeStore.dangerColor)
  );
};

onMounted(() => {
  setThemeGlobal();
});

const resetTheme = () => {
  themeStore.resetThemeColor();
  setThemeGlobal();
};
</script>

<template>
  <div>
    <div
      :class="{
        'right-[-300px]': hideConfigMenu,
      }"
      class="h-full w-[300px] bg-white dark:bg-slate-800 fixed top-0 right-0 z-20 shadow-md shadow-slate-200 dark:shadow-slate-900 duration-300"
    >
      <div
        @click="hideConfigMenu = !hideConfigMenu"
        class="py-3 px-4 bg-primary text-white rounded-l-lg absolute bottom-1 left-[-53px] cursor-pointer hover:bg-primary/90 hidden md:block"
      >
        <Icon name="fluent:paint-brush-16-regular" size="22px" />
      </div>
      <div class="p-4 flex font-normal border-b">
        <p class="flex-1">
          <span class="font-bold text-base text-gray-600 dark:text-white"
            >Theme Customizer</span
          >
          <br />
          <span class="text-sm text-gray-500 dark:text-gray-300">
            Customize Theme Real Time
          </span>
        </p>
        <div class="flex justify-center items-center">
          <Icon
            @click="hideConfigMenu = !hideConfigMenu"
            class="cursor-pointer"
            name="material-symbols:close-rounded"
          />
        </div>
      </div>
      <div class="p-4">
        <p class="text-sm mb-3 font-bold">Color Mode</p>
        <FormKit
          v-model="colorMode.value"
          type="radio"
          label="Theme"
          :options="[
            {
              label: 'Light',
              value: 'light',
            },
            {
              label: 'Dark',
              value: 'dark',
            },
          ]"
          :classes="{
            fieldset: 'border-0 !p-0',
            legend: '!font-medium !text-sm mb-0',
            options: '!flex !flex-row gap-4 mt-2',
            input: '!rounded-full',
          }"
          @change="setColorMode"
        />
        <div class="flex justify-between">
          <p class="text-sm mb-3 font-bold">Theming</p>
          <a
            @click="resetTheme"
            class="underline text-blue-600 cursor-pointer hover:text-blue-400"
            >Reset</a
          >
        </div>

        <div class="grid grid-cols-2">
          <FormKit
            type="color"
            v-model="rgbColor.primary"
            label="Primary"
            :classes="{
              label: '!font-medium !text-sm mb-0',
              outer: '!mb-0',
            }"
            @input="setThemeColor('primaryColor', rgbColor.primary)"
          />

          <FormKit
            type="color"
            v-model="rgbColor.secondary"
            label="Secondary"
            :classes="{
              label: '!font-medium !text-sm mb-0',
              outer: '!mb-0',
            }"
            @input="setThemeColor('secondaryColor', rgbColor.secondary)"
          />

          <FormKit
            type="color"
            v-model="rgbColor.info"
            label="Info"
            :classes="{
              label: '!font-medium !text-sm mb-0',
              outer: '!mb-0',
            }"
            @input="setThemeColor('infoColor', rgbColor.info)"
          />

          <FormKit
            type="color"
            v-model="rgbColor.success"
            label="Success"
            :classes="{
              label: '!font-medium !text-sm mb-0',
              outer: '!mb-0',
            }"
            @input="setThemeColor('successColor', rgbColor.success)"
          />

          <FormKit
            type="color"
            v-model="rgbColor.warning"
            label="Warning"
            :classes="{
              label: '!font-medium !text-sm mb-0',
              outer: '!mb-0',
            }"
            @input="setThemeColor('warningColor', rgbColor.warning)"
          />

          <FormKit
            type="color"
            v-model="rgbColor.danger"
            label="Danger"
            :classes="{
              label: '!font-medium !text-sm mb-0',
              outer: '!mb-0',
            }"
            @input="setThemeColor('dangerColor', rgbColor.danger)"
          />
        </div>
        <hr class="my-4" />
        <p class="text-sm mb-3 font-bold">Preview</p>
        <rs-button variant="primary" class="w-full mb-4 cursor-default">
          Primary Color
        </rs-button>
        <rs-button variant="secondary" class="w-full mb-4 cursor-default">
          Secondary Color
        </rs-button>
        <rs-button variant="info" class="w-full mb-4 cursor-default">
          Info Color
        </rs-button>
        <rs-button variant="success" class="w-full mb-4 cursor-default">
          Success Color
        </rs-button>
        <rs-button variant="warning" class="w-full mb-4 cursor-default">
          Warning Color
        </rs-button>
        <rs-button variant="danger" class="w-full mb-4 cursor-default">
          Danger Color
        </rs-button>
      </div>
    </div>
  </div>
</template>

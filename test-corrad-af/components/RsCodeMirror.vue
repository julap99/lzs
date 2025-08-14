<script setup>
import { useThemeStore } from "~/stores/theme";

import { vue } from "@codemirror/lang-vue";
import { javascript } from "@codemirror/lang-javascript";

import { oneDark } from "@codemirror/theme-one-dark";
import { amy, ayuLight, barf, clouds, cobalt, dracula } from "thememirror";

const props = defineProps({
  options: {
    type: Object,
    default: () => ({}),
  },
  mode: {
    type: String,
    default: "vue",
  },
  height: {
    type: String,
    default: "70vh",
  },
  modelValue: {
    type: String,
    default: "",
  },
  theme: {
    type: String,
    default: "oneDark",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update:modelValue"]);

const themeStore = useThemeStore();
const editorTheme = ref(themeStore.codeTheme);

const dropdownThemes = ref([
  {
    label: "default",
    value: "clouds",
  },
  {
    label: "oneDark",
    value: "oneDark",
  },
  {
    label: "amy",
    value: "amy",
  },
  {
    label: "ayu",
    value: "ayuLight",
  },
  {
    label: "barf",
    value: "barf",
  },
  {
    label: "cobalt",
    value: "cobalt",
  },
  {
    label: "dracula",
    value: "dracula",
  },
]);

const value = ref(props.modelValue);
const extensions = ref([]);
if (props.mode == "vue") {
  extensions.value = [vue(), oneDark];
} else {
  extensions.value = [javascript(), oneDark];
}

const totalLines = ref(0);
const totalLength = ref(0);

// Codemirror EditorView instance ref
const view = shallowRef();
const handleReady = (payload) => {
  view.value = payload.view;
  totalLines.value = view.value.state.doc.lines;
  totalLength.value = view.value.state.doc.length;
};

watch(
  () => editorTheme.value,
  (themeVal) => {
    // themeStore.setCodeTheme(newValue.value);

    if (props.mode == "vue") {
      extensions.value = [
        vue(),
        themeVal === "oneDark"
          ? oneDark
          : themeVal === "amy"
          ? amy
          : themeVal === "ayuLight"
          ? ayuLight
          : themeVal === "barf"
          ? barf
          : themeVal === "cobalt"
          ? cobalt
          : themeVal === "dracula"
          ? dracula
          : clouds,
      ];
    } else {
      extensions.value = [
        javascript(),
        themeVal === "oneDark"
          ? oneDark
          : themeVal === "amy"
          ? amy
          : themeVal === "ayuLight"
          ? ayuLight
          : themeVal === "barf"
          ? barf
          : themeVal === "cobalt"
          ? cobalt
          : themeVal === "dracula"
          ? dracula
          : clouds,
      ];
    }
  }
);

// Status is available at all times via Codemirror EditorView
const getCodemirrorStates = () => {
  const state = view.value.state;
  const ranges = state.selection.ranges;
  const selected = ranges.reduce((r, range) => r + range.to - range.from, 0);
  const cursor = ranges[0].anchor;
  const length = state.doc.length;
  const lines = state.doc.lines;

  console.log("state", view.value.state);
};

const onChange = (value) => {
  // console.log("onChange", value);
  emits("update:modelValue", value);
  totalLines.value = view.value.state.doc.lines;
  totalLength.value = view.value.state.doc.length;
};

const onFocus = (value) => {
  // console.log("onFocus", value);
};

const onBlur = (value) => {
  // console.log("onBlur", value);
};

const onUpdate = (value) => {
  // console.log("onUpdate", value);
};

function numberComma(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
</script>

<template>
  <div
    class="flex justify-between items-center gap-2 p-2 bg-[#282C34] text-[#abb2bf]"
  >
    <div class="flex items-center gap-2">
      Theme:
      <FormKit
        v-model="editorTheme"
        type="select"
        placeholder="Select Themes"
        :options="dropdownThemes"
        :classes="{
          input:
            '!bg-[#282C34] !text-[#abb2bf] !border-[#abb2bf] hover:cursor-pointer h-6 w-[100px]',
          inner: ' !rounded-none !mb-0',
          outer: '!mb-0',
        }"
      />
    </div>
    <!-- <rs-button
      class="!p-2"
      variant="primary-outline"
      @click="getCodemirrorStates"
    >
      Get state</rs-button
    > -->
  </div>
  <client-only>
    <CodeMirror
      v-model="value"
      placeholder="Code goes here..."
      :style="{ height: height }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      :disabled="disabled"
      @ready="handleReady"
      @change="onChange($event)"
      @focus="onFocus($event)"
      @blur="onBlur($event)"
      @update="onUpdate($event)"
    />
  </client-only>
  <div
    class="footer flex justify-end items-center gap-2 p-2 bg-[#282C34] text-[#abb2bf]"
  >
    <span class="">Lines: {{ numberComma(totalLines) }}</span>
    <span class="">Length: {{ numberComma(totalLength) }}</span>
  </div>
</template>

<style lang="scss" scoped></style>

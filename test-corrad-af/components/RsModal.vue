<script setup>
const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "md",
  },
  dialogClass: {
    type: String,
    default: "",
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String,
    default: "top",
  },
  hideOverlay: {
    type: Boolean,
    default: false,
  },
  okOnly: {
    type: Boolean,
    default: false,
  },
  okTitle: {
    type: String,
    default: "OK",
  },
  cancelOnly: {
    type: Boolean,
    default: false,
  },
  cancelTitle: {
    type: String,
    default: "Cancel",
  },
  okCallback: {
    type: Function,
    default: () => {},
  },
  cancelCallback: {
    type: Function,
    default: () => {},
  },
  hideFooter: {
    type: Boolean,
    default: false,
  },
  overlayClose: {
    type: Boolean,
    default: true,
  },
  height: {
    type: String,
    default: "70vh",
  },
});

const closeModal = () => {
  emits("update:modelValue", false);
};

const validateCancelCallback = () => {
  if (props.cancelCallback == "() => {}") closeModal();
  else props.cancelCallback();
};

watch(
  () => props.modelValue,
  (val) => {
    if (val) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }
);
</script>

<template>
  <Teleport to="body">
    <transition-group name="fade">
      <div
        v-if="modelValue"
        @click.self="overlayClose ? closeModal() : ''"
        class="modal"
        style="z-index: 1000"
        :class="{
          'modal-top': position == 'top',
          'modal-center': position == 'center',
          'modal-end': position == 'bottom',
          'modal-hide-overlay': hideOverlay,
        }"
      >
        <div
          v-show="modelValue"
          class="modal-dialog"
          :class="dialogClass"
          :style="{
            width: size == 'sm' ? '300px' : size == 'md' ? '500px' : '800px',
          }"
        >
          <div class="modal-content">
            <div class="modal-header">
              <h4 v-if="!$slots.header">
                {{ title }}
              </h4>
              <slot name="header"></slot>
              <Icon
                @click="closeModal"
                class="hover:text-gray-800 cursor-pointer"
                name="ic:round-close"
              ></Icon>
            </div>
            <div class="modal-body">
              <NuxtScrollbar
                :style="{
                  'max-height': height,
                }"
              >
                <slot name="body"></slot>
                <slot v-if="!$slots.body"></slot>
              </NuxtScrollbar>
            </div>
            <div v-if="!hideFooter" class="modal-footer">
              <slot name="footer"></slot>
              <rs-button
                v-if="!$slots.footer && !okOnly"
                @click="validateCancelCallback"
                variant="primary-text"
              >
                {{ cancelTitle }}</rs-button
              >
              <rs-button
                v-if="!$slots.footer && !cancelOnly"
                @click="okCallback"
                >{{ okTitle }}</rs-button
              >
            </div>
          </div>
        </div>
      </div>
    </transition-group>
  </Teleport>
</template>

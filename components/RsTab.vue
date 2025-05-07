<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: "primary",
  },
  type: {
    type: String,
    default: "default",
  },
  vertical: {
    type: Boolean,
    default: false,
  },
  fill: {
    type: Boolean,
    default: false,
  },
  justify: {
    type: String,
    default: "left",
  },
});

// Slots
const slots = useSlots();

const tabs = ref(slots.default().map((tab) => tab.props));
const selectedTitle = ref(tabs.value[0]["title"]);

tabs.value.forEach((tab) => {
  if (typeof tab.active !== "undefined") {
    selectedTitle.value = tab.title;
  }
});

provide("selectedTitle", selectedTitle);
</script>

<template>
  <client-only>
    <div
      class="tab"
      :class="{
        vertical: vertical,
        'tab-card': type === 'card' && !vertical,
        'card-vertical': type === 'card' && vertical,
        'card-primary': type === 'card' && variant === 'primary',
        'card-secondary': type === 'card' && variant === 'secondary',
        'card-success': type === 'card' && variant === 'success',
        'card-danger': type === 'card' && variant === 'danger',
        'card-warning': type === 'card' && variant === 'warning',
        'card-info': type === 'card' && variant === 'info',
      }"
    >
      <ul
        class="tab-nav"
        :class="{
          'tab-nav-card': type === 'card' && !vertical,
          'tab-nav-card card-vertical': type === 'card' && vertical,
          vertical: vertical,
          'vertical-fill': vertical && fill,
        }"
      >
        <li
          class="tab-item"
          :class="{
            fill: fill,
            border: type === 'border',
            'border-horizontal': type === 'border' && !vertical,
            'border-horizontal-active':
              selectedTitle === val.title && type === 'border' && !vertical,
            'border-vertical': type === 'border' && vertical,
            'border-vertical-active':
              selectedTitle === val.title && type === 'border' && vertical,

            // Variant Color for Border Type
            'border-hover-primary': type === 'border' && variant == 'primary',
            'border-hover-secondary':
              type === 'border' && variant == 'secondary',
            'border-hover-info': type === 'border' && variant == 'info',
            'border-hover-success': type === 'border' && variant == 'success',
            'border-hover-warning': type === 'border' && variant == 'warning',
            'border-hover-danger': type === 'border' && variant == 'danger',

            // Variant Color for Border Type Active
            'border-active-primary':
              selectedTitle === val.title &&
              type === 'border' &&
              variant == 'primary',
            'border-active-secondary':
              selectedTitle === val.title &&
              type === 'border' &&
              variant == 'secondary',
            'border-active-info':
              selectedTitle === val.title &&
              type === 'border' &&
              variant == 'info',
            'border-active-success':
              selectedTitle === val.title &&
              type === 'border' &&
              variant == 'success',
            'border-active-warning':
              selectedTitle === val.title &&
              type === 'border' &&
              variant == 'warning',
            'border-active-danger':
              selectedTitle === val.title &&
              type === 'border' &&
              variant == 'danger',
          }"
          role="presentation"
          v-for="(val, index) in tabs"
          :key="index"
          @click="selectedTitle = val.title"
        >
          <a
            class="tab-item-link"
            :class="{
              default: type === 'default' && !vertical,
              'default-vertical': type === 'default' && vertical,
              'default-active':
                selectedTitle === val.title && type === 'default' && !vertical,
              'default-vertical-active':
                selectedTitle === val.title && type === 'default' && vertical,

              // Variant hover for default type
              'default-hover-primary':
                type === 'default' && variant == 'primary',
              'default-hover-secondary':
                type === 'default' && variant == 'secondary',
              'default-hover-info': type === 'default' && variant == 'info',
              'default-hover-success':
                type === 'default' && variant == 'success',
              'default-hover-warning':
                type === 'default' && variant == 'warning',
              'default-hover-danger': type === 'default' && variant == 'danger',

              // Variant Color for default type Active
              'default-primary':
                selectedTitle === val.title &&
                type === 'default' &&
                variant == 'primary',
              'default-secondary':
                selectedTitle === val.title &&
                type === 'default' &&
                variant == 'secondary',
              'default-info':
                selectedTitle === val.title &&
                type === 'default' &&
                variant == 'info',
              'default-success':
                selectedTitle === val.title &&
                type === 'default' &&
                variant == 'success',
              'default-warning':
                selectedTitle === val.title &&
                type === 'default' &&
                variant == 'warning',
              'default-danger':
                selectedTitle === val.title &&
                type === 'default' &&
                variant == 'danger',

              'link-card': type === 'card' && !vertical,
              'link-card-vertical': type === 'card' && vertical,

              // Variant Color for card type
              'link-card-primary': type === 'card' && variant == 'primary',
              'link-card-secondary': type === 'card' && variant == 'secondary',
              'link-card-info': type === 'card' && variant == 'info',
              'link-card-success': type === 'card' && variant == 'success',
              'link-card-warning': type === 'card' && variant == 'warning',
              'link-card-danger': type === 'card' && variant == 'danger',

              // Variant Color for card type Active
              'link-card-primary-active':
                selectedTitle === val.title &&
                type === 'card' &&
                variant == 'primary',
              'link-card-secondary-active':
                selectedTitle === val.title &&
                type === 'card' &&
                variant == 'secondary',
              'link-card-info-active':
                selectedTitle === val.title &&
                type === 'card' &&
                variant == 'info',
              'link-card-success-active':
                selectedTitle === val.title &&
                type === 'card' &&
                variant == 'success',
              'link-card-warning-active':
                selectedTitle === val.title &&
                type === 'card' &&
                variant == 'warning',
              'link-card-danger-active':
                selectedTitle === val.title &&
                type === 'card' &&
                variant == 'danger',

              'link-justify-left': justify == 'left',
              'link-justify-center': justify == 'center',
              'link-justify-right': justify == 'right',
            }"
            >{{ val.title }}</a
          >
        </li>
      </ul>
      <div
        class="tab-content"
        :class="{
          'content-vertical': vertical && !fill,
          'content-vertical-fill': vertical && fill,
          'content-border': type === 'border' && !vertical,
          'content-border-vertical': type === 'border' && vertical,
          'content-border-primary': type === 'border' && variant === 'primary',
          'content-border-secondary':
            type === 'border' && variant === 'secondary',
          'content-border-info': type === 'border' && variant === 'info',
          'content-border-success': type === 'border' && variant === 'success',
          'content-border-warning': type === 'border' && variant === 'warning',
          'content-border-danger': type === 'border' && variant === 'danger',
        }"
      >
        <slot></slot>
      </div>
    </div>
  </client-only>
</template>

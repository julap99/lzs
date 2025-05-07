<script setup>
import { getNode, createMessage } from "@formkit/core";

const props = defineProps({
  type: {
    type: String,
    default: "top",
  },
  steps: {
    type: Array,
    default: () => ["Default"],
  },
  currentStep: {
    type: String,
    default: "",
  },
  form: {
    type: Boolean,
    default: false,
  },
  formSubmit: {
    type: Function,
    default: () => {},
  },
  formAction: {
    type: Boolean,
    default: true,
  },
  formStepRequired: {
    type: Boolean,
    default: true,
  },
  formStepBack: {
    type: Boolean,
    default: false,
  },
  formNavigate: {
    type: Boolean,
    default: true,
  },
  formErrorCounter: {
    type: Boolean,
    default: true,
  },
});

const step = reactive({});
const activeStep = ref(props.currentStep);
const stepNames = ref(props.steps);
const visitedSteps = ref([]);

const toLowerCase = (str) => str.toLowerCase().replace(/\s/g, "");
const stepIndex = (stepName) => stepNames.value.indexOf(stepName);

watch(activeStep, (newStep, oldStep) => {
  if (oldStep && !visitedSteps.value.includes(oldStep)) {
    visitedSteps.value.push(oldStep);
  }

  // NEW: trigger showing validation on fields
  // within all visited steps
  visitedSteps.value.forEach((step) => {
    const node = getNode(step);
    if (node != undefined)
      node.walk((n) => {
        n.store.set(
          createMessage({
            key: "submitted",
            value: true,
            visible: false,
          })
        );
      });
  });
});

const nextStep = (stepName) => {
  const stepNames = Object.keys(step);
  const currentIndex = stepNames.indexOf(activeStep.value);
  const nextIndex = stepNames.indexOf(stepName);

  if (props.formStepRequired) {
    if (!props.formStepBack) {
      if (nextIndex > currentIndex) {
        if (step[activeStep.value].valid) {
          activeStep.value = stepName;
        } else {
          const node = getNode(activeStep.value);
          if (node)
            node.walk((n) => {
              n.store.set(
                createMessage({
                  key: "submitted",
                  value: true,
                  visible: false,
                })
              );
            });
        }
      }
    } else {
      if (step[activeStep.value].valid || currentIndex > nextIndex) {
        activeStep.value = stepName;
      } else {
        const node = getNode(activeStep.value);
        if (node)
          node.walk((n) => {
            n.store.set(
              createMessage({
                key: "submitted",
                value: true,
                visible: false,
              })
            );
          });
      }
    }
  } else {
    activeStep.value = stepName;
  }
};

const setStep = (delta) => {
  const stepNames = Object.keys(step);
  const currentIndex = stepNames.indexOf(activeStep.value);
  nextStep(stepNames[currentIndex + delta]);
};

const stepPlugin = (node) => {
  if (node.props.type == "group") {
    // builds an object of the top-level groups
    step[node.name] = step[node.name] || {};

    node.on("created", () => {
      // use 'on created' to ensure context object is available
      step[node.name].valid = toRef(node.context.state, "valid");
    });

    // listen for changes in error count and store it
    node.on("count:errors", ({ payload: count }) => {
      step[node.name].errorCount = count;
    });

    // listen for changes in count of blocking validations messages
    node.on("count:blocking", ({ payload: count }) => {
      step[node.name].blockingCount = count;
    });

    // set the active tab to the 1st tab
    if (activeStep.value === "") {
      activeStep.value = node.name;
    }

    // Stop plugin inheritance to descendant nodes
    return false;
  }
};

const checkStepValidity = (stepName) => {
  if (step[stepName]) {
    return (
      (step[stepName].errorCount > 0 || step[stepName].blockingCount > 0) &&
      visitedSteps.value.includes(stepName)
    );
  }
};
</script>

<template>
  <FormKit
    type="form"
    :plugins="[stepPlugin]"
    :actions="formAction ? true : false"
    @submit="formSubmit ? formSubmit() : ''"
    :form-class="{ 'top-form': type == 'top', 'left-form': type == 'left' }"
  >
    <ul :class="{ 'top-steps': type == 'top', 'left-steps': type == 'left' }">
      <li
        v-for="(stepName, index) in stepNames"
        :key="index"
        :class="['step', { 'has-errors': checkStepValidity(stepName) }]"
        @click="nextStep(stepName)"
        :data-step-active="activeStep === stepName"
        :data-step-completed="stepIndex(stepName) < stepIndex(activeStep)"
      >
        <div class="counter">{{ index + 1 }}.</div>
        {{ stepName }}
        <span
          v-show="formErrorCounter"
          v-if="checkStepValidity(stepName)"
          class="step--errors"
          v-text="step[stepName].errorCount + step[stepName].blockingCount"
        />
        <div class="progress"></div>
      </li>
    </ul>

    <div class="form-wizard">
      <section
        v-for="(stepName, index) in stepNames"
        :key="index"
        v-show="activeStep === stepName"
      >
        <FormKit type="group" :id="stepName" :name="stepName">
          <slot
            :name="stepName === 'Default' ? 'default' : toLowerCase(stepName)"
          >
          </slot>
        </FormKit>
      </section>
    </div>
    <div v-if="formNavigate" class="flex justify-between">
      <FormKit
        type="button"
        :disabled="stepIndex(activeStep) == 0"
        @click="setStep(-1)"
        v-text="'Previous step'"
      />
      <FormKit
        type="button"
        :disabled="stepIndex(activeStep) == stepNames.length - 1"
        class="next"
        @click="setStep(1)"
        v-text="'Next step'"
      />
    </div>
  </FormKit>
</template>

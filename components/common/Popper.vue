<script lang="ts" setup>
import { createPopper } from '@popperjs/core';
import type { Placement } from '@popperjs/core';

const props = withDefaults(
  defineProps<{
    placement?: Placement;
    offset?: [number, number];
    zIndex?: number | string;
  }>(),
  {
    placement: 'bottom-start',
    offset: () => [0, 10],
    zIndex: 1090,
  }
);

const referenceRef = ref<HTMLElement>();
const popperRef = ref<HTMLElement>();
const popperInstance = ref<ReturnType<typeof createPopper> | null>();

const createPopperInstance = () => {
  popperInstance.value = createPopper(referenceRef.value!, popperRef.value!, {
    placement: props.placement,
    modifiers: [{ name: 'offset', options: { offset: props.offset } }],
  });
};
const destroyPopperInstance = () => {
  popperInstance.value?.destroy();
  popperInstance.value = null;
};
const updatePopperOptions = () => {
  popperInstance.value?.setOptions({
    placement: props.placement,
    strategy: 'fixed',
    modifiers: [{ name: 'offset', options: { offset: props.offset } }],
  });
};
const updatePosition = () => popperInstance.value?.update();

onMounted(createPopperInstance);
onBeforeUnmount(destroyPopperInstance);
watch([() => props.placement, () => props.offset], updatePopperOptions);

defineExpose({ updatePosition });
</script>

<template>
  <div class="inline" ref="referenceRef">
    <slot />
    <Teleport to="body">
      <div class="inline w-0 h-0" ref="popperRef" :style="{ zIndex }">
        <slot name="popper" class="pointer-events-auto" />
      </div>
    </Teleport>
  </div>
</template>

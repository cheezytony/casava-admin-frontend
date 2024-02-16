<script lang="ts" setup>
import type { Placement } from '@popperjs/core';
import type { DropdownProvision } from '~/types';

export interface DropdownItem {
  disabled?: boolean;
  href?: string;
  isDivider?: boolean;
  key?: string;
  title: string;
  value?: string;
  onClick?: VoidFunction;
}

const emit = defineEmits<{
  (e: 'open'): void;
  (e: 'close'): void;
}>();
const props = withDefaults(
  defineProps<{
    items?: Array<DropdownItem>;
    placement?: Placement;
  }>(),
  {
    items: () => [],
    placement: 'bottom-start',
  }
);

const menuRef = ref<HTMLElement>();
const triggerRef = ref<HTMLElement>();

const isOpen = ref(false);
const open = () => {
  isOpen.value = true;
  emit('open');
  nextTick(updateItemsRendered);
};
const close = () => {
  isOpen.value = false;
  emit('close');
};
const toggle = () => {
  isOpen.value ? close() : open();
};

const index = ref<number | null>(null);
const itemsRendered = ref(0);
const updateItemsRendered = () => {
  itemsRendered.value = menuRef.value!.querySelectorAll('[data-ui-type=dropdown-item]').length || 0;
};
const maxItems = computed(() => itemsRendered.value);
const next = () => {
  updateItemsRendered();
  if (index.value === null) {
    index.value = 0;
  } else {
    index.value = (index.value + 1) % maxItems.value;
  }
};
const prev = () => {
  updateItemsRendered();
  if (index.value === null) {
    index.value = maxItems.value - 1;
  } else {
    index.value = (index.value - 1 + maxItems.value) % maxItems.value;
  }
};
const select = () => {
  if (index.value === null) return;
  const items = menuRef.value!.querySelectorAll<HTMLButtonElement | HTMLAnchorElement>('[data-ui-type=dropdown-item]');
  items[index.value]?.click();
};

const handleTriggerClick = () => toggle();
const handleItemClick = (item: DropdownItem) => {
  close();
  item.onClick?.();
};
const handleOutsideClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const inTrigger = target
    .closest('[data-ui-type="dropdown"]')
    ?.isSameNode(triggerRef.value!);

  const inMenu = target
    .closest('[data-ui-type="dropdown-menu"]')
    ?.isSameNode(menuRef.value!);

  if (!inTrigger && !inMenu) {
    close();
  }
};
const handleInputKeydown = (event: KeyboardEvent) => {
  if (event.key.match(/(Arrow(Down|Up))|Escape|Enter|\s/)) {
    event.preventDefault();
  }

  switch (event.key) {
    case 'ArrowDown':
      isOpen.value ? next() : open();
      break;
    case 'ArrowUp':
      isOpen.value ? prev() : open();
      break;
    case 'Escape':
      close();
      break;
    case 'Enter':
    case ' ': {
      isOpen.value ? select() : open();
      break;
    }
  }
};

onMounted(() => {
  window.addEventListener('click', handleOutsideClick);
});
onUnmounted(() => {
  window.removeEventListener('click', handleOutsideClick);
});

provide<DropdownProvision>('dropdown', { isOpen, index, next, prev });
</script>

<template>
  <ClientOnly>
    <Popper :placement="placement" z-index="1099">
      <template #default>
        <div
          class="inline outline-none"
          data-ui-type="dropdown"
          tabindex="0"
          ref="triggerRef"
          @click="handleTriggerClick"
          @keydown="handleInputKeydown"
        >
          <slot :is-open="isOpen" />
        </div>
      </template>
      <template #popper>
        <div
          ref="menuRef"
          class="bg-white duration-300 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 min-w-[12rem]"
          :class="{
            'opacity-0 pointer-events-none invisible translate-y-4': !isOpen,
          }"
          data-ui-type="dropdown-menu"
        >
          <slot
            v-if="$slots.items"
            name="items"
            :index="index"
            :close="close"
          />
          <ul v-else-if="items.length" class="flex flex-col">
            <template v-for="(item, itemIndex) in items" :key="itemIndex">
              <!-- <hr v-if="item.isDivider" class="my-1" /> -->
              <li @click="handleItemClick(item)">
                <slot
                  v-if="$slots.item"
                  v-bind="{
                    item,
                    itemIndex,
                    index,
                    isSelected: itemIndex === index,
                    close,
                  }"
                  name="item"
                />
                <DropdownItem :href="item.href" v-else>
                  <div class="flex items-center gap-2">
                    <span class>{{ item.title }}</span>
                  </div>
                </DropdownItem>
              </li>
            </template>
          </ul>
        </div>
      </template>
    </Popper>
  </ClientOnly>
</template>

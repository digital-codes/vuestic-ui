<template>
  <component
    ref="rootElement"
    class="va-sidebar__item va-sidebar-item"
    :tabindex="$props.disabled ? -1 : 0"
    :class="{
      'va-sidebar-item--active': $props.active,
      'va-sidebar-item--disabled': $props.disabled,
    }"
    :style="computedStyle"
    :is="tagComputed"
    v-bind="linkAttributesComputed"
    v-on="keyboardFocusListeners"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { computed, toRef } from 'vue'

import {
  applyColors,
  useElementRef,
  useColors,
  useKeyboardOnlyFocus,
  useHover,
  useRouterLink,
  useRouterLinkProps,
  useTextColor,
} from '../../../composables'
import { useSidebarItem } from '../hooks/useSidebar'
import { useComponentPresetProp } from '../../../composables/useComponentPreset'

defineOptions({
  name: 'VaSidebarItem',
})

const props = defineProps({
  ...useRouterLinkProps,
  ...useComponentPresetProp,
  active: { type: Boolean, default: false },
  textColor: { type: String, default: undefined },
  activeColor: { type: String, default: 'primary' },
  hoverColor: { type: String, default: undefined },
  hoverOpacity: { type: [Number, String], default: 0.2 },
  borderColor: { type: String, default: undefined },
  disabled: { type: Boolean, default: false },
})

const rootElement = useElementRef()
const sidebar = useSidebarItem()

const { isHovered } = useHover(rootElement, toRef(props, 'disabled'))
const { getColor, getHoverColor, getFocusColor } = useColors()
const { hasKeyboardFocus, keyboardFocusListeners } = useKeyboardOnlyFocus()

const backgroundColorComputed = computed(() => {
  if (props.active && !isHovered.value && !hasKeyboardFocus.value) {
    return getColor(props.activeColor)
  }

  if (hasKeyboardFocus.value) {
    return getFocusColor(getColor(props.hoverColor || props.activeColor))
  }

  return '#ffffff00'
})

const textBackground = computed(() => applyColors(getColor(sidebar?.color), backgroundColorComputed.value))
const { textColorComputed } = useTextColor(textBackground)

const computedStyle = computed(() => {
  const style: Record<string, string> = { color: textColorComputed.value }

  if (props.disabled) {
    return style
  }

  if (isHovered.value || props.active || hasKeyboardFocus.value) {
    style.backgroundColor = backgroundColorComputed.value
  }

  if (props.active) {
    const mergedProps = { ...sidebar, ...props }
    style.borderColor = getColor(mergedProps.borderColor || mergedProps.activeColor)
  }

  if (hasKeyboardFocus.value) {
    style.backgroundColor = getFocusColor(getColor(props.hoverColor || props.activeColor))
  }

  if (isHovered.value) {
    style.backgroundColor = getHoverColor(
      getColor(props.hoverColor || props.activeColor), Number(props.hoverOpacity),
    )
  }

  return style
})

const { tagComputed, linkAttributesComputed } = useRouterLink(props)
</script>

<style lang="scss">
@import "../variables";
@import "../../../styles/resources";

.va-sidebar-item {
  border-left: var(--va-sidebar-item-active-border-size) solid transparent;
  padding-right: var(--va-sidebar-item-active-border-size);
  display: inline-block;
  width: 100%;
  font-family: var(--va-font-family);
  transition: var(--va-sidebar-item-transition);
  box-sizing: border-box;
  color: currentColor;
  cursor: pointer;

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @include keyboard-focus-outline("inherit", 2px, -2px);
}
</style>

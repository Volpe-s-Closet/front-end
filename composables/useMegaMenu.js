// Shared state for the MegaMenu system.
// Triggers register themselves so a single overlay panel can render the
// active menu's content. This enables smooth morphing between menus.

const menus = ref([])
const activeId = ref(null)
const previousId = ref(null)
const hoveredSubcategoryId = ref(null)

let openTimer = null
let closeTimer = null

const OPEN_DELAY = 80
const CLOSE_DELAY = 200

export const useMegaMenu = () => {
  const registerMenu = (menu) => {
    const existing = menus.value.find(m => m.id === menu.id)
    if (existing) {
      Object.assign(existing, menu)
    } else {
      menus.value.push(menu)
    }
  }

  const unregisterMenu = (id) => {
    menus.value = menus.value.filter(m => m.id !== id)
    if (activeId.value === id) activeId.value = null
    if (previousId.value === id) previousId.value = null
  }

  const requestOpen = (id) => {
    clearTimeout(closeTimer)
    closeTimer = null
    if (activeId.value === id) return

    if (activeId.value !== null) {
      // Already open, switch immediately for a smooth morph
      previousId.value = activeId.value
      activeId.value = id
      hoveredSubcategoryId.value = null
      return
    }

    // Cold open: wait for hover intent
    clearTimeout(openTimer)
    openTimer = setTimeout(() => {
      previousId.value = null
      activeId.value = id
      hoveredSubcategoryId.value = null
      openTimer = null
    }, OPEN_DELAY)
  }

  const cancelPending = () => {
    clearTimeout(openTimer)
    clearTimeout(closeTimer)
    openTimer = null
    closeTimer = null
  }

  const requestClose = () => {
    clearTimeout(openTimer)
    openTimer = null
    clearTimeout(closeTimer)
    closeTimer = setTimeout(() => {
      activeId.value = null
      previousId.value = null
      hoveredSubcategoryId.value = null
      closeTimer = null
    }, CLOSE_DELAY)
  }

  const closeNow = () => {
    cancelPending()
    activeId.value = null
    previousId.value = null
    hoveredSubcategoryId.value = null
  }

  const setHoveredSubcategory = (id) => {
    hoveredSubcategoryId.value = id
  }

  const activeMenu = computed(() =>
    menus.value.find(m => m.id === activeId.value) || null
  )

  const isSwitching = computed(() => previousId.value !== null)

  return {
    menus,
    activeId,
    previousId,
    activeMenu,
    isSwitching,
    hoveredSubcategoryId,
    registerMenu,
    unregisterMenu,
    requestOpen,
    requestClose,
    cancelPending,
    closeNow,
    setHoveredSubcategory
  }
}

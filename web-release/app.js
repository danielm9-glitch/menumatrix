const storageKey = "restaurant-menu-matrix-items";
const menuSeedKey = "restaurant-menu-matrix-seed";
const currentMenuSeed = "mott32-las-vegas-five";
const usersStorageKey = "restaurant-menu-matrix-users";
const currentUserKey = "restaurant-menu-matrix-current-user";
const designStorageKey = "restaurant-menu-matrix-design";
const menusStorageKey = "restaurant-menu-matrix-restaurant-menus";
const authFlowKey = "restaurant-menu-matrix-auth-flow";
const currentAuthFlow = "login-first-menus";
const firebaseMenuDocumentId = "main";
const primaryAdminUsername = "admin";
const cloudOcrEndpoint = window.MENU_MATRIX_OCR_ENDPOINT || "";
const menuFullnessTarget = 12;
const legacyMott32HeroImage = "https://www.nicepng.com/png/detail/809-8099031_mott32-las-vegas-mott-32-logo.png";
const defaultHeroImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 260'%3E%3Crect width='640' height='260' fill='%23f7f1e6'/%3E%3Ctext x='320' y='116' text-anchor='middle' font-family='Georgia%2C serif' font-size='84' font-weight='700' fill='%2319211d'%3EMOTT 32%3C/text%3E%3Ctext x='320' y='168' text-anchor='middle' font-family='Arial%2C sans-serif' font-size='22' letter-spacing='8' fill='%2366716b'%3ELAS VEGAS%3C/text%3E%3C/svg%3E";
const defaultDesign = {
  ink: "#19211d",
  leaf: "#2f7d56",
  gold: "#d99d2b",
  aqua: "#317c8e",
  page: "#f8f2e8",
  panel: "#fbfaf6",
  heroImage: defaultHeroImage
};
const categories = ["starters", "mains", "drinks"];
const defaultUsers = [
  {
    username: "admin",
    password: "menu123",
    role: "admin",
    permissions: [...categories]
  }
];

const defaultMenuItems = [
  {
    id: "peking-duck",
    name: "Apple Wood Roasted 42 Days Peking Duck",
    description: "Signature Mott 32 cut, carved for crisp skin and tender meat",
    category: "mains",
    diet: "NA",
    style: "",
    heat: 0,
    allergens: ["Soy", "Wheat"],
    details: "One of Mott 32's signature dishes. Teach the team to mention the apple wood roast, 42-day duck, crisp skin, and classic tableside-style presentation.",
    image: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=800&q=80",
    price: 108
  },
  {
    id: "soup-dumplings",
    name: "Traditional Iberico Pork Shanghainese Soup Dumplings",
    description: "Four delicate xiao long bao with savory pork broth",
    category: "starters",
    diet: "NA",
    style: "",
    heat: 1,
    allergens: ["Wheat", "Soy"],
    details: "A dim sum staple. Coach staff to warn guests the dumplings contain hot broth and should be eaten carefully with the soup spoon.",
    image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80",
    price: 13
  },
  {
    id: "bbq-pork-bun",
    name: "Crispy Sugar Coated BBQ Iberico Pork Bun",
    description: "Three baked buns with sweet-savory barbecue pork filling",
    category: "starters",
    diet: "NA",
    style: "",
    heat: 0,
    allergens: ["Wheat", "Soy"],
    details: "This is a baked dim sum item with a crisp sugar-coated exterior and rich Iberico pork barbecue center. Good for guests who like sweet and savory.",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    price: 13
  },
  {
    id: "smoked-black-cod",
    name: "Signature Smoked Black Cod",
    description: "Smoky, silky black cod with a rich Cantonese-style glaze",
    category: "mains",
    diet: "NA",
    style: "sea",
    heat: 0,
    allergens: ["Fish", "Soy"],
    details: "A polished seafood signature. Describe it as delicate, smoky, slightly sweet, and very soft in texture.",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    price: 42
  },
  {
    id: "lobster-fried-rice",
    name: "Signature Maine Lobster Fried Rice",
    description: "King oyster mushrooms and edamame folded into lobster fried rice",
    category: "mains",
    diet: "NA",
    style: "sea",
    heat: 0,
    allergens: ["Shellfish", "Egg", "Soy"],
    details: "A premium rice and noodle section dish. Highlight the lobster, mushroom, and edamame; confirm shellfish allergy before recommending.",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    price: 68
  }
];

const allergyOptions = ["Dairy", "Egg", "Fish", "Sesame", "Shellfish", "Soy", "Wheat"];
const defaultRestaurantMenuId = "mott32-las-vegas";

if (localStorage.getItem(authFlowKey) !== currentAuthFlow) {
  localStorage.removeItem(currentUserKey);
  localStorage.setItem(authFlowKey, currentAuthFlow);
}

let restaurantMenus = loadRestaurantMenus();
const initialRestaurantMenu = restaurantMenus[0];
let menuItems = initialRestaurantMenu?.items || [];
let users = loadUsers();
let designSettings = initialRestaurantMenu?.designSettings || { ...defaultDesign };

const state = {
  category: "all",
  query: "",
  allergies: new Set(),
  openItems: new Set(),
  currentUser: loadCurrentUser(),
  editing: false,
  screen: loadCurrentUser() ? "menus" : "login",
  activeRestaurantMenu: initialRestaurantMenu?.id || defaultRestaurantMenuId,
  dashboardTab: "users",
  dashboardReturnScreen: "menus"
};

const cloudSync = {
  applying: false,
  applyingUsers: false,
  client: null,
  docId: "",
  ref: null,
  saveTimer: null,
  unsubscribe: null,
  usersRef: null,
  usersSaveTimer: null,
  usersUnsubscribe: null
};

let deleteSliderDragging = false;
let deleteSliderProgress = 0;
let accountDeleteSliderDragging = false;
let accountDeleteSliderProgress = 0;
let accountDeletionBusy = false;

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const menuGrid = document.querySelector("#menuGrid");
const template = document.querySelector("#menuRowTemplate");
const searchInput = document.querySelector("#searchInput");
const allergyChips = document.querySelector("#allergyChips");
const tabs = [...document.querySelectorAll(".tab")];
const drawerOpenButton = document.querySelector("#drawerOpenButton");
const drawerCloseButton = document.querySelector("#drawerCloseButton");
const drawerOverlay = document.querySelector("#drawerOverlay");
const adminDrawer = document.querySelector("#adminDrawer");
const authPage = document.querySelector("#authPage");
const registerPage = document.querySelector("#registerPage");
const menusPage = document.querySelector("#menusPage");
const adminLoginForm = document.querySelector("#adminLoginForm");
const passwordSetupForm = document.querySelector("#passwordSetupForm");
const adminControls = document.querySelector("#adminControls");
const adminUsername = document.querySelector("#adminUsername");
const adminPassword = document.querySelector("#adminPassword");
const resendVerificationButton = document.querySelector("#resendVerificationButton");
const selfRegisterForm = document.querySelector("#selfRegisterForm");
const registerUsername = document.querySelector("#registerUsername");
const registerEmail = document.querySelector("#registerEmail");
const registerPassword = document.querySelector("#registerPassword");
const registerMessage = document.querySelector("#registerMessage");
const registerLinkButton = document.querySelector("#registerLinkButton");
const loginLinkButton = document.querySelector("#loginLinkButton");
const restaurantList = document.querySelector("#restaurantList");
const menusLogoutButton = document.querySelector("#menusLogoutButton");
const backToMenusButton = document.querySelector("#backToMenusButton");
const createMenuButton = document.querySelector("#createMenuButton");
const adminHomeSummary = document.querySelector("#adminHomeSummary");
const adminHomeDashboardButton = document.querySelector("#adminHomeDashboardButton");
const adminHomeMetrics = document.querySelector("#adminHomeMetrics");
const adminHomeHighlights = document.querySelector("#adminHomeHighlights");
const homeSummaryKicker = document.querySelector("#homeSummaryKicker");
const homeSummaryTitle = document.querySelector("#homeSummaryTitle");
const menusDirectoryKicker = document.querySelector("#menusDirectoryKicker");
const menusDirectoryTitle = document.querySelector("#menusDirectoryTitle");
const syncStatus = document.querySelector("#syncStatus");
const setupPassword = document.querySelector("#setupPassword");
const setupMessage = document.querySelector("#setupMessage");
const inviteIntro = document.querySelector("#inviteIntro");
const loginMessage = document.querySelector("#loginMessage");
const adminStatus = document.querySelector("#adminStatus");
const editModeButton = document.querySelector("#editModeButton");
const quickMenuActions = document.querySelector("#quickMenuActions");
const quickEditModeButton = document.querySelector("#quickEditModeButton");
const quickScanMenuButton = document.querySelector("#quickScanMenuButton");
const quickPdfBuilderButton = document.querySelector("#quickPdfBuilderButton");
const pdfBuilderButton = document.querySelector("#pdfBuilderButton");
const addItemButton = document.querySelector("#addItemButton");
const deleteMenuButton = document.querySelector("#deleteMenuButton");
const scanMenuButton = document.querySelector("#scanMenuButton");
const manageUsersButton = document.querySelector("#manageUsersButton");
const designButton = document.querySelector("#designButton");
const logoutButton = document.querySelector("#logoutButton");
const menuPage = document.querySelector("#menuPage");
const usersPage = document.querySelector("#usersPage");
const pdfPage = document.querySelector("#pdfPage");
const dashboardKicker = document.querySelector("#dashboardKicker");
const dashboardTitle = document.querySelector("#dashboardTitle");
const accountProfileSummary = document.querySelector("#accountProfileSummary");
const accountEmailForm = document.querySelector("#accountEmailForm");
const accountEmailInput = document.querySelector("#accountEmailInput");
const accountVerifyEmailButton = document.querySelector("#accountVerifyEmailButton");
const accountEmailMessage = document.querySelector("#accountEmailMessage");
const accountPasswordForm = document.querySelector("#accountPasswordForm");
const accountPasswordInput = document.querySelector("#accountPasswordInput");
const accountPasswordResetButton = document.querySelector("#accountPasswordResetButton");
const accountPasswordMessage = document.querySelector("#accountPasswordMessage");
const accountRestaurantForm = document.querySelector("#accountRestaurantForm");
const accountMenuSelect = document.querySelector("#accountMenuSelect");
const accountRestaurantName = document.querySelector("#accountRestaurantName");
const accountRestaurantMessage = document.querySelector("#accountRestaurantMessage");
const accountRestaurantLinks = document.querySelector("#accountRestaurantLinks");
const deleteAccountButton = document.querySelector("#deleteAccountButton");
const accountDeleteStatus = document.querySelector("#accountDeleteStatus");
const deleteAccountDialog = document.querySelector("#deleteAccountDialog");
const closeDeleteAccountButton = document.querySelector("#closeDeleteAccountButton");
const cancelDeleteAccountButton = document.querySelector("#cancelDeleteAccountButton");
const continueDeleteAccountButton = document.querySelector("#continueDeleteAccountButton");
const deleteAccountName = document.querySelector("#deleteAccountName");
const deleteAccountQuestion = document.querySelector("#deleteAccountQuestion");
const deleteAccountWarning = document.querySelector("#deleteAccountWarning");
const deleteAccountSlideStep = document.querySelector("#deleteAccountSlideStep");
const deleteAccountSlider = document.querySelector("#deleteAccountSlider");
const deleteAccountSliderThumb = document.querySelector("#deleteAccountSliderThumb");
const deleteAccountSliderText = document.querySelector("#deleteAccountSliderText");
const deleteAccountMessage = document.querySelector("#deleteAccountMessage");
const backToMenuButton = document.querySelector("#backToMenuButton");
const backFromPdfButton = document.querySelector("#backFromPdfButton");
const pdfItemList = document.querySelector("#pdfItemList");
const pdfIncludePhotos = document.querySelector("#pdfIncludePhotos");
const pdfIncludePrices = document.querySelector("#pdfIncludePrices");
const pdfIncludeAllergens = document.querySelector("#pdfIncludeAllergens");
const pdfIncludeNotes = document.querySelector("#pdfIncludeNotes");
const selectAllPdfButton = document.querySelector("#selectAllPdfButton");
const clearPdfButton = document.querySelector("#clearPdfButton");
const generatePdfButton = document.querySelector("#generatePdfButton");
const pdfMessage = document.querySelector("#pdfMessage");
const createUserToggle = document.querySelector("#createUserToggle");
const createUserPanel = document.querySelector("#createUserPanel");
const createUserSubmit = document.querySelector("#createUserSubmit");
const createMethod = document.querySelector("#createMethod");
const methodTabs = [...document.querySelectorAll(".method-tab")];
const userForm = document.querySelector("#userForm");
const newUsername = document.querySelector("#newUsername");
const newEmail = document.querySelector("#newEmail");
const newEmailLabel = document.querySelector("#newEmailLabel");
const newPassword = document.querySelector("#newPassword");
const newPasswordLabel = document.querySelector("#newPasswordLabel");
const userMessage = document.querySelector("#userMessage");
const userList = document.querySelector("#userList");
const itemDialog = document.querySelector("#itemDialog");
const itemForm = document.querySelector("#itemForm");
const closeDialogButton = document.querySelector("#closeDialogButton");
const deleteItemButton = document.querySelector("#deleteItemButton");
const dialogTitle = document.querySelector("#dialogTitle");
const itemId = document.querySelector("#itemId");
const itemName = document.querySelector("#itemName");
const itemDescription = document.querySelector("#itemDescription");
const itemDetails = document.querySelector("#itemDetails");
const itemImage = document.querySelector("#itemImage");
const itemImageFile = document.querySelector("#itemImageFile");
const itemCategory = document.querySelector("#itemCategory");
const itemDiet = document.querySelector("#itemDiet");
const itemHeat = document.querySelector("#itemHeat");
const itemPrice = document.querySelector("#itemPrice");
const itemAllergens = document.querySelector("#itemAllergens");
const saveItemButton = document.querySelector("#saveItemButton");
const itemUploadPreview = document.querySelector("#itemUploadPreview");
const itemPreviewImage = document.querySelector("#itemPreviewImage");
const itemUploadProgress = document.querySelector("#itemUploadProgress");
const itemUploadStatus = document.querySelector("#itemUploadStatus");
const scanDialog = document.querySelector("#scanDialog");
const closeScanButton = document.querySelector("#closeScanButton");
const scanImageFile = document.querySelector("#scanImageFile");
const runScanButton = document.querySelector("#runScanButton");
const scanText = document.querySelector("#scanText");
const scanCategory = document.querySelector("#scanCategory");
const scanMessage = document.querySelector("#scanMessage");
const clearScanButton = document.querySelector("#clearScanButton");
const createScannedItemButton = document.querySelector("#createScannedItemButton");
const heroImage = document.querySelector("#heroImage");
const editHeroButton = document.querySelector("#editHeroButton");
const currentMenuTitle = document.querySelector("#currentMenuTitle");
const topAddItemButton = document.querySelector("#topAddItemButton");
const renameMenuButton = document.querySelector("#renameMenuButton");
const renameMenuDialog = document.querySelector("#renameMenuDialog");
const renameMenuForm = document.querySelector("#renameMenuForm");
const closeRenameMenuButton = document.querySelector("#closeRenameMenuButton");
const menuNameInput = document.querySelector("#menuNameInput");
const deleteMenuDialog = document.querySelector("#deleteMenuDialog");
const closeDeleteMenuButton = document.querySelector("#closeDeleteMenuButton");
const cancelDeleteMenuButton = document.querySelector("#cancelDeleteMenuButton");
const continueDeleteMenuButton = document.querySelector("#continueDeleteMenuButton");
const deleteMenuName = document.querySelector("#deleteMenuName");
const deleteMenuQuestion = document.querySelector("#deleteMenuQuestion");
const deleteMenuWarning = document.querySelector("#deleteMenuWarning");
const deleteMenuSlideStep = document.querySelector("#deleteMenuSlideStep");
const deleteMenuSlider = document.querySelector("#deleteMenuSlider");
const deleteMenuSliderThumb = document.querySelector("#deleteMenuSliderThumb");
const deleteMenuSliderText = document.querySelector("#deleteMenuSliderText");
const deleteMenuMessage = document.querySelector("#deleteMenuMessage");
const designDialog = document.querySelector("#designDialog");
const designForm = document.querySelector("#designForm");
const closeDesignButton = document.querySelector("#closeDesignButton");
const resetDesignButton = document.querySelector("#resetDesignButton");
const saveDesignButton = document.querySelector("#saveDesignButton");
const colorInk = document.querySelector("#colorInk");
const colorLeaf = document.querySelector("#colorLeaf");
const colorGold = document.querySelector("#colorGold");
const colorAqua = document.querySelector("#colorAqua");
const colorPage = document.querySelector("#colorPage");
const colorPanel = document.querySelector("#colorPanel");
const heroImageUrl = document.querySelector("#heroImageUrl");
const heroImageFile = document.querySelector("#heroImageFile");
const heroUploadPreview = document.querySelector("#heroUploadPreview");
const heroPreviewImage = document.querySelector("#heroPreviewImage");
const heroUploadProgress = document.querySelector("#heroUploadProgress");
const heroUploadStatus = document.querySelector("#heroUploadStatus");
const dashboardTabs = [...document.querySelectorAll(".dashboard-tab")];
const dashboardPanels = [...document.querySelectorAll(".dashboard-panel")];
const dashboardAuthSummary = document.querySelector("#dashboardAuthSummary");
const dashboardPaymentsSummary = document.querySelector("#dashboardPaymentsSummary");
const dashboardRestaurantList = document.querySelector("#dashboardRestaurantList");
const dashboardMenuList = document.querySelector("#dashboardMenuList");
const dashboardCustomizationSummary = document.querySelector("#dashboardCustomizationSummary");
const dashboardCustomizationButton = document.querySelector("#dashboardCustomizationButton");

function loadMenuItems() {
  if (localStorage.getItem(menuSeedKey) !== currentMenuSeed) {
    localStorage.setItem(menuSeedKey, currentMenuSeed);
    localStorage.setItem(storageKey, JSON.stringify(defaultMenuItems));
    return defaultMenuItems.map(normalizeMenuItem);
  }

  const savedItems = localStorage.getItem(storageKey);
  if (!savedItems) return defaultMenuItems.map(normalizeMenuItem);

  try {
    const parsed = JSON.parse(savedItems);
    return Array.isArray(parsed) ? parsed.map(normalizeMenuItem) : defaultMenuItems.map(normalizeMenuItem);
  } catch {
    return defaultMenuItems.map(normalizeMenuItem);
  }
}

function loadRestaurantMenus(user = null) {
  const savedMenus = localStorage.getItem(getRestaurantMenusStorageKey(user));

  if (savedMenus) {
    try {
      const parsed = JSON.parse(savedMenus);
      if (Array.isArray(parsed) && parsed.length) {
        return parsed.map(normalizeRestaurantMenu);
      }
    } catch {
      // Fall through to the legacy single-menu data.
    }
  }

  if (isOwnerWorkspace(user)) return [];

  const defaultMenu = createDefaultRestaurantMenu();
  localStorage.setItem(getRestaurantMenusStorageKey(user), JSON.stringify([sanitizeRestaurantMenuForStorage(defaultMenu)]));
  return [defaultMenu];
}

function createDefaultRestaurantMenu() {
  return {
    id: defaultRestaurantMenuId,
    name: "Mott 32 Las Vegas",
    restaurantName: "Mott 32 Las Vegas",
    owner: primaryAdminUsername,
    label: "Chinese menu training",
    categories: ["Starters", "Mains", "Drinks"],
    items: loadMenuItems(),
    designSettings: loadDesignSettings()
  };
}

function normalizeRestaurantMenu(menu, index = 0) {
  const isDefaultMenu = menu.id === defaultRestaurantMenuId || (!menu.id && index === 0);
  const design = menu.designSettings || (isDefaultMenu ? loadDesignSettings() : { ...defaultDesign, heroImage: "" });
  const items = Array.isArray(menu.items) ? menu.items : isDefaultMenu ? loadMenuItems() : [];
  const normalizedDesign = normalizeDesignSettings(design);

  if ((isDefaultMenu && !normalizedDesign.heroImage) || shouldUseBuiltInMott32Hero(menu, normalizedDesign.heroImage)) {
    normalizedDesign.heroImage = defaultHeroImage;
  }

  return {
    id: menu.id || `menu-${Date.now()}-${index}`,
    name: menu.name || (isDefaultMenu ? "Mott 32 Las Vegas" : `Blank Menu ${index + 1}`),
    restaurantName: menu.restaurantName || menu.restaurant || (isDefaultMenu ? "Mott 32 Las Vegas" : ""),
    owner: menu.owner || primaryAdminUsername,
    label: menu.label || (isDefaultMenu ? "Chinese menu training" : "Blank menu"),
    categories: Array.isArray(menu.categories) && menu.categories.length ? menu.categories : ["Starters", "Mains", "Drinks"],
    items: items.map(normalizeMenuItem),
    stats: normalizeMenuStats(menu.stats),
    designSettings: normalizedDesign
  };
}

function isMott32Menu(menu) {
  const normalizedName = String(menu?.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  return menu?.id === defaultRestaurantMenuId || normalizedName.includes("mott32");
}

function shouldUseBuiltInMott32Hero(menu, heroImageValue) {
  return isMott32Menu(menu) && (!heroImageValue || heroImageValue === legacyMott32HeroImage);
}

function normalizeMenuStats(stats = {}) {
  return {
    clicks: Math.max(0, Number(stats.clicks) || 0),
    lastOpenedAt: typeof stats.lastOpenedAt === "string" ? stats.lastOpenedAt : ""
  };
}

function normalizeDesignSettings(settings = {}) {
  return {
    ...defaultDesign,
    ...settings,
    heroImage: typeof settings.heroImage === "string" ? settings.heroImage : defaultHeroImage
  };
}

function normalizeMenuItem(item) {
  const defaultMatch = defaultMenuItems.find((defaultItem) => defaultItem.id === item.id);

  return {
    ...item,
    details: item.details || defaultMatch?.details || "Key ingredients, flavor notes, and service talking points can go here.",
    image: item.image || defaultMatch?.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
  };
}

function saveMenuItems() {
  localStorage.setItem(storageKey, JSON.stringify(menuItems));
  persistActiveRestaurantMenuData();
  if (restaurantList) renderRestaurantList();
}

function loadDesignSettings() {
  const savedDesign = localStorage.getItem(designStorageKey);
  if (!savedDesign) return { ...defaultDesign };

  try {
    return { ...defaultDesign, ...JSON.parse(savedDesign) };
  } catch {
    return { ...defaultDesign };
  }
}

function saveDesignSettings() {
  localStorage.setItem(designStorageKey, JSON.stringify(designSettings));
  persistActiveRestaurantMenuData();
}

function getActiveRestaurantMenu() {
  const visibleMenus = getVisibleRestaurantMenus();
  return visibleMenus.find((menu) => menu.id === state.activeRestaurantMenu) || visibleMenus[0] || null;
}

function syncActiveRestaurantMenuData() {
  const activeMenu = getActiveRestaurantMenu();
  if (!activeMenu) {
    menuItems = [];
    designSettings = { ...defaultDesign, heroImage: "" };
    localStorage.setItem(storageKey, JSON.stringify(menuItems));
    localStorage.setItem(designStorageKey, JSON.stringify(designSettings));
    return;
  }

  menuItems = activeMenu.items.map(normalizeMenuItem);
  designSettings = normalizeDesignSettings(activeMenu.designSettings);
  if (shouldUseBuiltInMott32Hero(activeMenu, designSettings.heroImage)) {
    designSettings.heroImage = defaultHeroImage;
    activeMenu.designSettings = normalizeDesignSettings({
      ...activeMenu.designSettings,
      heroImage: defaultHeroImage
    });
    saveRestaurantMenus();
  }
  localStorage.setItem(storageKey, JSON.stringify(menuItems));
  localStorage.setItem(designStorageKey, JSON.stringify(designSettings));
}

function persistActiveRestaurantMenuData() {
  const activeMenu = getActiveRestaurantMenu();
  if (!activeMenu) return;

  activeMenu.items = menuItems.map(normalizeMenuItem);
  activeMenu.designSettings = normalizeDesignSettings(designSettings);
  saveRestaurantMenus();
}

function saveRestaurantMenus({ sync = true } = {}) {
  localStorage.setItem(getRestaurantMenusStorageKey(), JSON.stringify(restaurantMenus.map(sanitizeRestaurantMenuForStorage)));
  if (sync) scheduleCloudSave();
}

function applyDesignSettings() {
  document.documentElement.style.setProperty("--ink", designSettings.ink);
  document.documentElement.style.setProperty("--leaf", designSettings.leaf);
  document.documentElement.style.setProperty("--gold", designSettings.gold);
  document.documentElement.style.setProperty("--aqua", designSettings.aqua);
  document.documentElement.style.setProperty("--page-bg", designSettings.page);
  document.documentElement.style.setProperty("--panel-bg", designSettings.panel);
  const hasHeroImage = Boolean(designSettings.heroImage);
  heroImage.hidden = !hasHeroImage;
  heroImage.closest(".logo-hero")?.classList.toggle("is-empty", !hasHeroImage);
  if (hasHeroImage) {
    heroImage.src = designSettings.heroImage;
  } else {
    heroImage.removeAttribute("src");
  }
  renderRestaurantList();
}

function syncDesignForm() {
  colorInk.value = designSettings.ink;
  colorLeaf.value = designSettings.leaf;
  colorGold.value = designSettings.gold;
  colorAqua.value = designSettings.aqua;
  colorPage.value = designSettings.page;
  colorPanel.value = designSettings.panel;
  heroImageUrl.value = designSettings.heroImage;
  heroImageFile.value = "";
  resetUploadPreview({
    preview: heroUploadPreview,
    image: heroPreviewImage,
    progress: heroUploadProgress,
    status: heroUploadStatus,
    imageUrl: designSettings.heroImage,
    message: designSettings.heroImage ? "Current header image. Choose a file to replace it." : "No header image selected yet."
  });
}

function resetUploadPreview({ preview, image, progress, status, imageUrl = "", message = "Select an image to preview it." }) {
  if (!preview || !image || !progress || !status) return;

  preview.hidden = !imageUrl;
  progress.value = imageUrl ? 100 : 0;
  progress.hidden = !imageUrl;
  status.textContent = message;
  if (imageUrl) {
    image.src = imageUrl;
  } else {
    image.removeAttribute("src");
  }
}

function setUploadProgress({ preview, progress, status, percent, message }) {
  if (!preview || !progress || !status) return;

  preview.hidden = false;
  progress.hidden = false;
  progress.value = Math.max(0, Math.min(100, percent));
  status.textContent = message;
}

function setUploadBusy(button, busy) {
  if (!button) return;
  button.disabled = busy;
}

async function prepareUploadedImage(file, { maxWidth = 1200, quality = 0.82, preview, image, progress, status, button }) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Choose an image file.");
  }

  setUploadBusy(button, true);
  setUploadProgress({ preview, progress, status, percent: 4, message: "Reading image..." });

  try {
    const originalDataUrl = await readImageFile(file, (percent) => {
      setUploadProgress({
        preview,
        progress,
        status,
        percent: Math.round(percent * 0.45),
        message: "Reading image..."
      });
    });
    setUploadProgress({ preview, progress, status, percent: 56, message: "Preparing preview..." });

    const compressedDataUrl = await compressImageDataUrl(originalDataUrl, { maxWidth, quality });
    if (image) image.src = compressedDataUrl;
    setUploadProgress({ preview, progress, status, percent: 100, message: "Ready to save." });
    return compressedDataUrl;
  } catch (error) {
    setUploadProgress({
      preview,
      progress,
      status,
      percent: 0,
      message: error?.message || "Could not read that image."
    });
    throw error;
  } finally {
    setUploadBusy(button, false);
  }
}

function compressImageDataUrl(dataUrl, { maxWidth, quality }) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => {
      const scale = Math.min(1, maxWidth / image.width);
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    });
    image.addEventListener("error", () => reject(new Error("Could not preview that image.")));
    image.src = dataUrl;
  });
}

function loadUsers() {
  const savedUsers = localStorage.getItem(usersStorageKey);
  if (!savedUsers) return ensureDefaultAdmin(defaultUsers);

  try {
    const parsed = JSON.parse(savedUsers);
    if (!Array.isArray(parsed) || !parsed.length) return ensureDefaultAdmin(defaultUsers);
    return ensureDefaultAdmin(parsed);
  } catch {
    return ensureDefaultAdmin(defaultUsers);
  }
}

function normalizeUser(user = {}) {
  const username = String(user.username || "").trim();
  const status = ["active", "pending", "unverified", "deleted"].includes(user.status) ? user.status : "active";
  return {
    username,
    email: user.email || "",
    password: user.role === "owner" ? "" : user.password || "",
    role: ["admin", "owner", "editor"].includes(user.role) ? user.role : "editor",
    permissions: Array.isArray(user.permissions) && user.permissions.length ? user.permissions.filter((permission) => categories.includes(permission)) : [],
    status,
    firebaseUid: user.firebaseUid || "",
    createdAt: user.createdAt || "",
    updatedAt: user.updatedAt || "",
    deletedAt: user.deletedAt || ""
  };
}

function sanitizeUserForCloud(user) {
  const normalized = normalizeUser(user);
  return {
    username: normalized.username,
    email: normalized.email,
    password: normalized.password,
    role: normalized.role,
    permissions: normalized.permissions,
    status: normalized.status,
    firebaseUid: normalized.firebaseUid,
    createdAt: normalized.createdAt,
    updatedAt: normalized.updatedAt,
    deletedAt: normalized.deletedAt
  };
}

function isDeletedUser(user) {
  return user?.status === "deleted";
}

function getVisibleUsers() {
  return users.filter((user) => !isDeletedUser(user));
}

function findUserByIdentity(identity, { includeDeleted = false } = {}) {
  const normalizedIdentity = String(identity || "").trim().toLowerCase();
  if (!normalizedIdentity) return null;

  return (
    users.find((user) => {
      if (!includeDeleted && isDeletedUser(user)) return false;
      return user.username.toLowerCase() === normalizedIdentity || (user.email || "").toLowerCase() === normalizedIdentity;
    }) || null
  );
}

function findUserByEmail(email, { includeDeleted = false } = {}) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) return null;

  return (
    users.find((user) => {
      if (!includeDeleted && isDeletedUser(user)) return false;
      return (user.email || "").toLowerCase() === normalizedEmail;
    }) || null
  );
}

function getUserUpdatedTime(user) {
  return Date.parse(user?.updatedAt || user?.deletedAt || user?.createdAt || "") || 0;
}

function mergeUserCandidate(userMap, user) {
  if (!user.username) return;

  const key = user.username.toLowerCase();
  const existing = userMap.get(key);
  if (!existing || getUserUpdatedTime(user) >= getUserUpdatedTime(existing)) {
    userMap.set(key, user);
  }
}

function ensureDefaultAdmin(userList) {
  const normalizedUsers = userList
    .map(normalizeUser)
    .filter((user) => user.username);
  const hasAdmin = normalizedUsers.some((user) => user.username === primaryAdminUsername && user.role === "admin");
  return hasAdmin ? normalizedUsers : [...defaultUsers.map(normalizeUser), ...normalizedUsers];
}

function saveUsers({ sync = true } = {}) {
  users = ensureDefaultAdmin(users);
  localStorage.setItem(usersStorageKey, JSON.stringify(users));
  if (sync) scheduleCloudUsersSave();
}

function loadCurrentUser() {
  const username = localStorage.getItem(currentUserKey);
  if (!username) return null;
  return users.find((user) => user.username === username && !isDeletedUser(user)) ? username : null;
}

function getInviteUsername() {
  const params = new URLSearchParams(window.location.search);
  return params.get("invite");
}

function getInvitedUser() {
  const username = getInviteUsername();
  if (!username) return null;
  return users.find((user) => user.username === username && user.status === "pending" && !isDeletedUser(user)) || null;
}

function getActiveUser() {
  return users.find((user) => user.username === state.currentUser && !isDeletedUser(user)) || null;
}

function isAdmin() {
  return getActiveUser()?.role === "admin";
}

function getMenuOwner(menu) {
  return menu?.owner || primaryAdminUsername;
}

function getWorkspaceOwner(user = getActiveUser()) {
  if (!user) return primaryAdminUsername;
  return user.role === "owner" ? user.username : primaryAdminUsername;
}

function getWorkspaceDocumentId(user = getActiveUser()) {
  const owner = getWorkspaceOwner(user);
  if (owner === primaryAdminUsername) return firebaseMenuDocumentId;
  return `user-${owner.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "menu"}`;
}

function getRestaurantMenusStorageKey(user = getActiveUser()) {
  const docId = getWorkspaceDocumentId(user);
  return docId === firebaseMenuDocumentId ? menusStorageKey : `${menusStorageKey}-${docId}`;
}

function isOwnerWorkspace(user = getActiveUser()) {
  return Boolean(user && user.role === "owner");
}

function getVisibleRestaurantMenus() {
  const user = getActiveUser();
  if (!user) return [];
  if (isAdmin()) return restaurantMenus;

  return restaurantMenus.filter((menu) => {
    const owner = getMenuOwner(menu);
    return owner === user.username || (user.role === "editor" && owner === primaryAdminUsername);
  });
}

function getMenuStats(menu) {
  return normalizeMenuStats(menu?.stats);
}

function getMenuFullnessScore(menu) {
  const items = Array.isArray(menu?.items) ? menu.items : [];
  const usedCategories = new Set(items.map((item) => item.category).filter(Boolean));
  return items.length * 10 + usedCategories.size * 3;
}

function getMenuFullnessPercent(menu) {
  const items = Array.isArray(menu?.items) ? menu.items : [];
  const usedCategories = new Set(items.map((item) => item.category).filter(Boolean));
  const itemProgress = Math.min(1, items.length / menuFullnessTarget);
  const categoryProgress = categories.length ? Math.min(1, usedCategories.size / categories.length) : 0;
  return Math.round((itemProgress * 0.8 + categoryProgress * 0.2) * 100);
}

function getSortedRestaurantMenus(menus) {
  if (!isAdmin()) return menus;

  return [...menus].sort((a, b) => {
    const clickDifference = getMenuStats(b).clicks - getMenuStats(a).clicks;
    if (clickDifference) return clickDifference;

    const fullnessDifference = getMenuFullnessScore(b) - getMenuFullnessScore(a);
    if (fullnessDifference) return fullnessDifference;

    return a.name.localeCompare(b.name);
  });
}

function recordMenuOpen(menuId) {
  const menu = restaurantMenus.find((candidate) => candidate.id === menuId);
  if (!menu) return;

  menu.stats = normalizeMenuStats(menu.stats);
  menu.stats.clicks += 1;
  menu.stats.lastOpenedAt = new Date().toISOString();
  saveRestaurantMenus();
}

function ownsMenu(menu) {
  const user = getActiveUser();
  return Boolean(user && menu && getMenuOwner(menu) === user.username);
}

function ownsActiveMenu() {
  return ownsMenu(getActiveRestaurantMenu());
}

function getEditableCategories() {
  const user = getActiveUser();
  if (!user) return [];
  if (ownsActiveMenu()) return [...categories];
  return isAdmin() ? [...categories] : user.permissions || [];
}

function canEditCategory(category) {
  return getEditableCategories().includes(category);
}

function canEditAnyCategory() {
  return getEditableCategories().length > 0;
}

function setSyncStatus(message, tone = "") {
  if (!syncStatus) return;

  syncStatus.textContent = message;
  syncStatus.classList.toggle("connected", tone === "connected");
  syncStatus.classList.toggle("error", tone === "error");
}

function waitForFirebaseClient() {
  if (window.menuMatrixFirebase) {
    return Promise.resolve(window.menuMatrixFirebase);
  }

  return new Promise((resolve) => {
    const timeout = window.setTimeout(() => resolve(window.menuMatrixFirebase || null), 5000);
    window.addEventListener(
      "menuMatrixFirebaseReady",
      () => {
        window.clearTimeout(timeout);
        resolve(window.menuMatrixFirebase || null);
      },
      { once: true }
    );
  });
}

async function getFirebaseAuth() {
  const client = await waitForFirebaseClient();
  if (!client?.enabled || !client.auth) return null;
  await client.authReady;
  return client.auth;
}

async function getSignedInFirebaseUser() {
  const auth = await getFirebaseAuth();
  if (!auth?.currentUser || auth.currentUser.isAnonymous) return null;
  await auth.currentUser.reload();
  return auth.currentUser;
}

async function restoreAnonymousAuth() {
  const client = await waitForFirebaseClient();
  if (!client?.enabled || !client.auth) return;

  try {
    if (!client.auth.currentUser) {
      await client.auth.signInAnonymously();
    }
  } catch {
    // The UI already reports Firebase connection issues through sync status.
  }
}

function getAuthErrorMessage(error) {
  const code = error?.code || "";
  if (code === "auth/email-already-in-use") return "That email is already registered to another Firebase account.";
  if (code === "auth/invalid-email") return "Enter a valid email address.";
  if (code === "auth/weak-password") return "Use at least 6 characters for the password.";
  if (code === "auth/requires-recent-login") return "For security, log out and log back in, then try this again.";
  if (code === "auth/unauthorized-continue-uri") {
    return "Firebase needs this domain added under Authentication > Settings > Authorized domains.";
  }
  if (code === "auth/wrong-password" || code === "auth/user-not-found" || code === "auth/invalid-credential") {
    return "Invalid login.";
  }
  if (code === "auth/operation-not-allowed") {
    return "Enable Email/Password sign-in in Firebase Authentication first.";
  }
  if (code === "auth/too-many-requests") {
    return "Firebase temporarily blocked this device because of too many login or email attempts. Stop trying for a while, then try again later.";
  }
  if (code === "auth/network-request-failed") return "Network error. Try again in a moment.";
  return error?.message || "Authentication failed.";
}

function getVerificationActionSettings() {
  return {
    url: `${window.location.origin}${window.location.pathname}`
  };
}

async function sendVerificationEmail(firebaseUser) {
  try {
    await firebaseUser.sendEmailVerification(getVerificationActionSettings());
    return "current-domain";
  } catch (error) {
    if (error?.code !== "auth/unauthorized-continue-uri") throw error;
    await firebaseUser.sendEmailVerification();
    return "firebase-default";
  }
}

async function sendPasswordResetForExistingEmail(auth, email) {
  try {
    await auth.sendPasswordResetEmail(email, getVerificationActionSettings());
    return "current-domain";
  } catch (error) {
    if (error?.code !== "auth/unauthorized-continue-uri") throw error;
    await auth.sendPasswordResetEmail(email);
    return "firebase-default";
  }
}

function setResendVerificationVisible(isVisible) {
  resendVerificationButton.hidden = !isVisible;
}

async function initializeCloudSync() {
  const client = await waitForFirebaseClient();

  if (!client?.enabled || !client.db) {
    setSyncStatus("Local mode - Firebase not connected", "error");
    return;
  }

  setSyncStatus("Connecting to Firebase...");
  await client.authReady;
  cloudSync.client = client;
  connectCloudUsers();
  connectCloudWorkspaceForCurrentUser();
}

function connectCloudUsers() {
  const client = cloudSync.client;
  if (!client?.db || cloudSync.usersRef) return;

  cloudSync.usersRef = client.db.collection("app").doc("users");
  cloudSync.usersUnsubscribe = cloudSync.usersRef.onSnapshot(
    (snapshot) => {
      if (!snapshot.exists) {
        uploadCloudUsersSnapshot("initial");
        return;
      }

      applyCloudUsersSnapshot(snapshot.data());
    },
    () => {
      setSyncStatus("Firebase user sync needs Firestore rules", "error");
    }
  );
}

function applyCloudUsersSnapshot(data) {
  if (!data || !Array.isArray(data.users)) return;

  cloudSync.applyingUsers = true;
  try {
    const merged = new Map();
    ensureDefaultAdmin(defaultUsers).forEach((user) => mergeUserCandidate(merged, user));
    data.users.map(normalizeUser).forEach((user) => {
      mergeUserCandidate(merged, user);
    });
    users.map(normalizeUser).forEach((user) => {
      mergeUserCandidate(merged, user);
    });
    users = [...merged.values()].sort(sortUsersByPrivileges);
    saveUsers({ sync: false });
    renderAdminState();
  } finally {
    cloudSync.applyingUsers = false;
  }
}

function scheduleCloudUsersSave() {
  if (!cloudSync.usersRef || cloudSync.applyingUsers) return;

  window.clearTimeout(cloudSync.usersSaveTimer);
  cloudSync.usersSaveTimer = window.setTimeout(() => uploadCloudUsersSnapshot("update"), 700);
}

async function uploadCloudUsersSnapshot(reason) {
  if (!cloudSync.usersRef || cloudSync.applyingUsers) return;

  try {
    await cloudSync.usersRef.set(
      {
        users: ensureDefaultAdmin(users).map(sanitizeUserForCloud),
        source: reason,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch {
    setSyncStatus("Firebase user save failed - check rules/Auth", "error");
  }
}

function connectCloudWorkspaceForCurrentUser() {
  const client = cloudSync.client;
  if (!client?.db) return;

  const nextDocId = getWorkspaceDocumentId();
  if (cloudSync.docId === nextDocId && cloudSync.ref) return;

  if (cloudSync.unsubscribe) {
    cloudSync.unsubscribe();
    cloudSync.unsubscribe = null;
  }

  cloudSync.docId = nextDocId;
  cloudSync.ref = client.db.collection("menus").doc(nextDocId);
  setSyncStatus("Connecting to Firebase...");
  cloudSync.unsubscribe = cloudSync.ref.onSnapshot(
    (snapshot) => {
      if (!snapshot.exists) {
        if (restaurantMenus.length) {
          setSyncStatus("Creating Firebase menu copy...");
          uploadCloudSnapshot("initial");
        } else {
          setSyncStatus("Synced with Firebase", "connected");
          renderAdminState();
        }
        return;
      }

      applyCloudSnapshot(snapshot.data());
    },
    () => {
      setSyncStatus("Firebase needs Firestore/Auth setup", "error");
    }
  );
}

function applyCloudSnapshot(data) {
  if (!data) return;

  cloudSync.applying = true;

  try {
    const workspaceOwner = getWorkspaceOwner();
    if (Array.isArray(data.menus) && data.menus.length) {
      restaurantMenus = data.menus.map((menu, index) =>
        normalizeRestaurantMenu({ ...menu, owner: menu.owner || workspaceOwner }, index)
      );
      const visibleMenus = getVisibleRestaurantMenus();
      if (!visibleMenus.some((menu) => menu.id === state.activeRestaurantMenu)) {
        state.activeRestaurantMenu = visibleMenus[0]?.id || "";
      }
      saveRestaurantMenus({ sync: false });
      syncActiveRestaurantMenuData();
    } else if (isOwnerWorkspace()) {
      restaurantMenus = [];
      state.activeRestaurantMenu = "";
      saveRestaurantMenus({ sync: false });
      syncActiveRestaurantMenuData();
    } else {
      const legacyMenu = normalizeRestaurantMenu({
        ...createDefaultRestaurantMenu(),
        owner: workspaceOwner,
        items: Array.isArray(data.menuItems) ? data.menuItems : defaultMenuItems,
        designSettings: data.designSettings && typeof data.designSettings === "object" ? data.designSettings : defaultDesign
      });
      restaurantMenus = [legacyMenu];
      const visibleMenus = getVisibleRestaurantMenus();
      state.activeRestaurantMenu = visibleMenus[0]?.id || "";
      saveRestaurantMenus({ sync: false });
      syncActiveRestaurantMenuData();
    }

    setSyncStatus("Synced with Firebase", "connected");
    applyDesignSettings();
    renderAdminState();
    renderAllergyChips();
    renderMenu();
  } finally {
    cloudSync.applying = false;
  }
}

function scheduleCloudSave() {
  if (!cloudSync.ref || cloudSync.applying) return;

  window.clearTimeout(cloudSync.saveTimer);
  setSyncStatus("Saving to Firebase...");
  cloudSync.saveTimer = window.setTimeout(() => uploadCloudSnapshot("update"), 600);
}

async function uploadCloudSnapshot(reason) {
  if (!cloudSync.ref || cloudSync.applying) return;

  try {
    await cloudSync.ref.set(
      {
        menus: restaurantMenus.map(sanitizeRestaurantMenuForStorage),
        source: reason,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
    setSyncStatus("Synced with Firebase", "connected");
  } catch {
    setSyncStatus("Firebase save failed - check rules/Auth", "error");
  }
}

function sanitizeMenuItemForCloud(item) {
  return {
    id: item.id || `item-${Date.now()}`,
    name: item.name || "",
    description: item.description || "",
    category: categories.includes(item.category) ? item.category : "starters",
    diet: item.diet || "NA",
    style: item.style || "",
    heat: Number(item.heat) || 0,
    allergens: Array.isArray(item.allergens) ? item.allergens : [],
    details: item.details || "",
    image: item.image || "",
    price: Number(item.price) || 0
  };
}

function sanitizeRestaurantMenuForStorage(menu) {
  return {
    id: menu.id || `menu-${Date.now()}`,
    name: menu.name || "Untitled Menu",
    restaurantName: menu.restaurantName || "",
    owner: menu.owner || primaryAdminUsername,
    label: menu.label || "Menu training",
    categories: Array.isArray(menu.categories) && menu.categories.length ? menu.categories : ["Starters", "Mains", "Drinks"],
    items: Array.isArray(menu.items) ? menu.items.map(sanitizeMenuItemForCloud) : [],
    stats: normalizeMenuStats(menu.stats),
    designSettings: sanitizeDesignSettings(menu.designSettings || defaultDesign)
  };
}

function sanitizeDesignSettings(settings) {
  return {
    ink: settings.ink || defaultDesign.ink,
    leaf: settings.leaf || defaultDesign.leaf,
    gold: settings.gold || defaultDesign.gold,
    aqua: settings.aqua || defaultDesign.aqua,
    page: settings.page || defaultDesign.page,
    panel: settings.panel || defaultDesign.panel,
    heroImage: typeof settings.heroImage === "string" ? settings.heroImage : defaultHeroImage
  };
}

function showScreen(screen) {
  state.screen = screen;
  renderAdminState();
}

function normalizeScreen(activeUser, invitedUser) {
  if (invitedUser && !activeUser) {
    state.screen = "login";
    return;
  }

  if (!activeUser && state.screen !== "register") {
    state.screen = "login";
    return;
  }

  if (activeUser && ["login", "register"].includes(state.screen)) {
    state.screen = "menus";
  }

  if (activeUser && state.screen === "menu" && !getActiveRestaurantMenu()) {
    state.screen = "menus";
  }

  if (state.screen === "users" && !activeUser) {
    state.screen = "login";
  }
}

function renderRestaurantList() {
  restaurantList.replaceChildren();

  const visibleMenus = getSortedRestaurantMenus(getVisibleRestaurantMenus());

  if (!visibleMenus.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state restaurant-empty";
    empty.textContent = "No menus yet. Create a blank menu to start a restaurant.";
    restaurantList.append(empty);
    return;
  }

  visibleMenus.forEach((menu) => {
    const button = document.createElement("button");
    button.className = "restaurant-card";
    button.classList.toggle("is-active", menu.id === state.activeRestaurantMenu);
    button.type = "button";
    button.addEventListener("click", () => openRestaurantMenu(menu.id));

    const image = menu.designSettings?.heroImage ? document.createElement("img") : document.createElement("span");
    if (menu.designSettings?.heroImage) {
      image.src = menu.designSettings.heroImage;
      image.alt = `${menu.name} logo`;
    } else {
      image.className = "restaurant-card-placeholder";
      image.setAttribute("aria-hidden", "true");
    }

    const info = document.createElement("span");
    info.className = "restaurant-card-copy";
    const name = document.createElement("strong");
    const details = document.createElement("span");
    name.textContent = menu.name;
    details.textContent = `${menu.restaurantName ? `${menu.restaurantName} - ` : ""}${menu.label} - ${menu.items.length} items`;
    info.append(name, details);

    if (isAdmin()) {
      const stats = document.createElement("span");
      stats.className = "restaurant-card-stats";
      stats.textContent = `${getMenuStats(menu).clicks} clicks - ${getMenuFullnessPercent(menu)}% full`;
      info.append(stats);
    }

    button.append(image, info);
    restaurantList.append(button);
  });
}

function renderAdminHomeSummary() {
  const activeUser = getActiveUser();
  const visibleMenus = getVisibleRestaurantMenus();
  const isAdminUser = isAdmin();
  const showHomeAnalytics = Boolean(activeUser);
  menusPage.classList.toggle("is-admin-home", showHomeAnalytics);
  adminHomeSummary.hidden = !showHomeAnalytics;
  menusDirectoryKicker.textContent = isAdminUser ? "Sorted by activity" : "Created menus";
  menusDirectoryTitle.textContent = isAdminUser ? "Menus by clicks and fullness" : "Your menus";

  if (!showHomeAnalytics) {
    adminHomeMetrics.replaceChildren();
    adminHomeHighlights.replaceChildren();
    return;
  }

  homeSummaryKicker.textContent = isAdminUser ? "Admin dashboard" : "Menu analytics";
  homeSummaryTitle.textContent = isAdminUser ? "Quick summary" : "Your summary";
  adminHomeDashboardButton.hidden = !isAdminUser;

  const menus = isAdminUser ? restaurantMenus : visibleMenus;
  const sortedByClicks = [...menus].sort((a, b) => {
    const clickDifference = getMenuStats(b).clicks - getMenuStats(a).clicks;
    if (clickDifference) return clickDifference;

    const fullnessDifference = getMenuFullnessScore(b) - getMenuFullnessScore(a);
    if (fullnessDifference) return fullnessDifference;

    return a.name.localeCompare(b.name);
  });
  const sortedByFullness = [...menus].sort((a, b) => {
    const fullnessDifference = getMenuFullnessScore(b) - getMenuFullnessScore(a);
    if (fullnessDifference) return fullnessDifference;
    return getMenuStats(b).clicks - getMenuStats(a).clicks;
  });
  const totalItems = menus.reduce((sum, menu) => sum + menu.items.length, 0);
  const totalClicks = menus.reduce((sum, menu) => sum + getMenuStats(menu).clicks, 0);

  if (isAdminUser) {
    const activeAccounts = getVisibleUsers().filter((user) => user.status !== "pending").length;
    adminHomeMetrics.replaceChildren(
      createDashboardMetric("Menus", String(menus.length), "Created restaurants"),
      createDashboardMetric("Items", String(totalItems), "Across every menu"),
      createDashboardMetric("Clicks", String(totalClicks), "Menu opens tracked"),
      createDashboardMetric("Users", String(activeAccounts), "Active accounts")
    );
  } else {
    const linkedMenus = menus.filter((menu) => menu.restaurantName).length;
    const averageFullness = menus.length
      ? Math.round(menus.reduce((sum, menu) => sum + getMenuFullnessPercent(menu), 0) / menus.length)
      : 0;
    adminHomeMetrics.replaceChildren(
      createDashboardMetric("Menus", String(menus.length), "Created by you"),
      createDashboardMetric("Items", String(totalItems), "Across your menus"),
      createDashboardMetric("Linked", String(linkedMenus), "Menus tied to restaurants"),
      createDashboardMetric("Fullness", `${averageFullness}%`, menus.length ? "Average completion" : "Create a menu to start")
    );
  }

  adminHomeHighlights.replaceChildren(
    createAdminHomeHighlight({
      label: "Most clicked",
      menu: sortedByClicks[0],
      badge: sortedByClicks[0] ? `${getMenuStats(sortedByClicks[0]).clicks} clicks` : "",
      emptyText: isAdminUser ? "No menus have been clicked yet." : "Create a blank menu to start tracking menu opens."
    }),
    createAdminHomeHighlight({
      label: "Fullest menu",
      menu: sortedByFullness[0],
      badge: sortedByFullness[0] ? `${getMenuFullnessPercent(sortedByFullness[0])}% full` : "",
      emptyText: isAdminUser ? "No menus have items yet." : "Add items to a menu to track completion."
    })
  );
}

function createAdminHomeHighlight({ label, menu, badge, emptyText }) {
  if (!menu) {
    const empty = document.createElement("p");
    empty.className = "empty-state restaurant-empty";
    empty.textContent = emptyText;
    return empty;
  }

  const button = document.createElement("button");
  button.className = "admin-home-highlight";
  button.type = "button";
  button.addEventListener("click", () => openRestaurantMenu(menu.id));

  const copy = document.createElement("span");
  const labelElement = document.createElement("small");
  const titleElement = document.createElement("strong");
  const metaElement = document.createElement("span");
  labelElement.textContent = label;
  titleElement.textContent = menu.name;
  const menuContext = isAdmin()
    ? `Owner: ${getMenuOwner(menu)}`
    : menu.restaurantName
      ? `Restaurant: ${menu.restaurantName}`
      : "No restaurant linked";
  metaElement.textContent = `${menu.items.length} items - ${menuContext}`;
  copy.append(labelElement, titleElement, metaElement);

  const badgeElement = document.createElement("span");
  badgeElement.className = "dashboard-badge";
  badgeElement.textContent = badge;

  button.append(copy, badgeElement);
  return button;
}

function renderActiveMenuHeader() {
  const activeMenu = getActiveRestaurantMenu();
  const canEditMenu = Boolean(activeMenu) && canEditAnyCategory();
  const canUsePdf = Boolean(activeMenu && getActiveUser());
  currentMenuTitle.textContent = activeMenu?.name || "No menu selected";
  topAddItemButton.hidden = !canEditMenu;
  renameMenuButton.hidden = !state.editing || !canEditMenu;
  quickEditModeButton.textContent = state.editing ? "Done editing" : "Edit menu";
  quickEditModeButton.classList.toggle("is-active", state.editing);
  quickEditModeButton.hidden = !canEditMenu;
  quickScanMenuButton.hidden = !canEditMenu;
  quickPdfBuilderButton.hidden = !canUsePdf;
  quickMenuActions.hidden = quickEditModeButton.hidden && quickScanMenuButton.hidden && quickPdfBuilderButton.hidden;
}

function openRestaurantMenu(menuId) {
  if (!getVisibleRestaurantMenus().some((menu) => menu.id === menuId)) return;

  recordMenuOpen(menuId);
  state.activeRestaurantMenu = menuId;
  state.category = "all";
  state.query = "";
  state.openItems.clear();
  state.allergies.clear();
  searchInput.value = "";
  tabs.forEach((button) => button.classList.toggle("is-active", button.dataset.category === "all"));
  syncActiveRestaurantMenuData();
  applyDesignSettings();
  renderAllergyChips();
  showScreen("menu");
}

function openRenameMenuDialog() {
  const activeMenu = getActiveRestaurantMenu();
  if (!activeMenu || !state.editing || !canEditAnyCategory()) return;

  menuNameInput.value = activeMenu.name;
  renameMenuDialog.showModal();
  menuNameInput.focus();
  menuNameInput.select();
}

function closeRenameMenuDialog() {
  renameMenuDialog.close();
  renameMenuForm.reset();
}

function saveMenuName(event) {
  event.preventDefault();

  const activeMenu = getActiveRestaurantMenu();
  const name = menuNameInput.value.trim();
  if (!activeMenu || !name || !state.editing || !canEditAnyCategory()) return;

  activeMenu.name = name;
  if (activeMenu.label === "Blank menu") {
    activeMenu.label = "Menu training";
  }
  saveRestaurantMenus();
  renderActiveMenuHeader();
  renderRestaurantList();
  closeRenameMenuDialog();
}

function canDeleteActiveMenu() {
  return state.editing && Boolean(getActiveRestaurantMenu()) && (isAdmin() || ownsActiveMenu());
}

function updateDeleteMenuButton() {
  deleteMenuButton.hidden = !canDeleteActiveMenu();
}

function resetDeleteMenuSlider() {
  deleteSliderDragging = false;
  setDeleteMenuSliderProgress(0);
  deleteMenuMessage.textContent = "";
}

function setDeleteMenuSliderProgress(value) {
  deleteSliderProgress = Math.max(0, Math.min(100, value));
  const maxOffset = Math.max(0, deleteMenuSlider.clientWidth - deleteMenuSliderThumb.offsetWidth - 10);

  deleteMenuSlider.style.setProperty("--confirm-progress", `${deleteSliderProgress}%`);
  deleteMenuSlider.setAttribute("aria-valuenow", String(Math.round(deleteSliderProgress)));
  deleteMenuSliderThumb.style.transform = `translateX(${(maxOffset * deleteSliderProgress) / 100}px)`;
  deleteMenuSliderThumb.textContent = deleteSliderProgress >= 92 ? "Release" : "Grab";
  deleteMenuSliderText.textContent = deleteSliderProgress >= 92 ? "Release to delete" : "Slide to delete";
}

function getDeleteMenuSliderValue(event) {
  const rect = deleteMenuSlider.getBoundingClientRect();
  const position = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
  return (position / rect.width) * 100;
}

function openDeleteMenuDialog() {
  const activeMenu = getActiveRestaurantMenu();
  if (!canDeleteActiveMenu() || !activeMenu) return;

  deleteMenuName.textContent = activeMenu.name;
  deleteMenuQuestion.hidden = false;
  deleteMenuSlideStep.hidden = true;
  continueDeleteMenuButton.disabled = restaurantMenus.length <= 1;
  deleteMenuWarning.textContent =
    restaurantMenus.length <= 1 ? "Create another menu before deleting this one." : "";
  resetDeleteMenuSlider();
  if (restaurantMenus.length > 1) {
    deleteMenuWarning.textContent = "This cannot be undone.";
  }
  deleteMenuDialog.showModal();
}

function closeDeleteMenuDialog() {
  deleteMenuDialog.close();
  deleteMenuQuestion.hidden = false;
  deleteMenuSlideStep.hidden = true;
  resetDeleteMenuSlider();
}

function showDeleteMenuSlider() {
  if (restaurantMenus.length <= 1) {
    deleteMenuWarning.textContent = "Create another menu before deleting this one.";
    return;
  }

  deleteMenuQuestion.hidden = true;
  deleteMenuSlideStep.hidden = false;
  resetDeleteMenuSlider();
  window.requestAnimationFrame(() => deleteMenuSlider.focus());
}

function deleteActiveRestaurantMenu() {
  const activeMenu = getActiveRestaurantMenu();
  if (!activeMenu || restaurantMenus.length <= 1 || deleteSliderProgress < 92) return;

  restaurantMenus = restaurantMenus.filter((menu) => menu.id !== activeMenu.id);
  state.activeRestaurantMenu = getVisibleRestaurantMenus()[0]?.id || "";
  state.category = "all";
  state.query = "";
  state.openItems.clear();
  state.allergies.clear();
  searchInput.value = "";
  tabs.forEach((button) => button.classList.toggle("is-active", button.dataset.category === "all"));
  state.editing = false;

  syncActiveRestaurantMenuData();
  saveRestaurantMenus();
  closeDeleteMenuDialog();
  closeDrawer();
  applyDesignSettings();
  renderAllergyChips();
  showScreen("menus");
}

function handleDeleteSliderPointerDown(event) {
  if (deleteMenuSlideStep.hidden) return;

  deleteSliderDragging = true;
  deleteMenuSlider.setPointerCapture?.(event.pointerId);
  setDeleteMenuSliderProgress(getDeleteMenuSliderValue(event));
}

function handleDeleteSliderPointerMove(event) {
  if (!deleteSliderDragging) return;

  setDeleteMenuSliderProgress(getDeleteMenuSliderValue(event));
}

function handleDeleteSliderPointerUp(event) {
  if (!deleteSliderDragging) return;

  deleteSliderDragging = false;
  setDeleteMenuSliderProgress(getDeleteMenuSliderValue(event));

  if (deleteSliderProgress >= 92) {
    deleteActiveRestaurantMenu();
    return;
  }

  setDeleteMenuSliderProgress(0);
}

function handleDeleteSliderKeydown(event) {
  if (deleteMenuSlideStep.hidden) return;

  if (event.key === "ArrowRight" || event.key === "ArrowUp") {
    event.preventDefault();
    setDeleteMenuSliderProgress(deleteSliderProgress + 10);
  }

  if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
    event.preventDefault();
    setDeleteMenuSliderProgress(deleteSliderProgress - 10);
  }

  if (event.key === "Home") {
    event.preventDefault();
    setDeleteMenuSliderProgress(0);
  }

  if (event.key === "End") {
    event.preventDefault();
    setDeleteMenuSliderProgress(100);
  }

  if ((event.key === "Enter" || event.key === " ") && deleteSliderProgress >= 92) {
    event.preventDefault();
    deleteActiveRestaurantMenu();
  }
}

function createBlankRestaurantMenu() {
  const activeUser = getActiveUser();
  if (!activeUser) return;

  const blankCount = restaurantMenus.filter((menu) => menu.id.startsWith("blank-menu-")).length + 1;
  const blankMenu = normalizeRestaurantMenu({
    id: `blank-menu-${Date.now()}`,
    name: `Blank Menu ${blankCount}`,
    restaurantName: "",
    owner: activeUser.username,
    label: "Blank menu",
    categories: ["Starters", "Mains", "Drinks"],
    items: [],
    stats: normalizeMenuStats(),
    designSettings: {
      ...designSettings,
      heroImage: ""
    }
  }, restaurantMenus.length);

  restaurantMenus = [blankMenu, ...restaurantMenus];
  state.activeRestaurantMenu = blankMenu.id;
  menuItems = [];
  designSettings = blankMenu.designSettings;
  saveRestaurantMenus();
  applyDesignSettings();
  renderRestaurantList();
  showScreen("menu");
}

function getVisibleItems() {
  const query = state.query.trim().toLowerCase();

  return menuItems.filter((item) => {
    const matchesCategory = state.category === "all" || item.category === state.category;
    const matchesQuery = [item.name, item.description, item.diet, item.category, ...item.allergens]
      .join(" ")
      .toLowerCase()
      .includes(query);
    const avoidsAllergies = !item.allergens.some((allergen) => state.allergies.has(allergen));

    return matchesCategory && matchesQuery && avoidsAllergies;
  });
}

function renderHeat(level) {
  if (level === 0) return "Mild";
  return ["Mild", "Low", "Med", "Hot"][level] || "Hot";
}

function renderMenu() {
  const items = getVisibleItems();
  menuGrid.replaceChildren();

  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = menuItems.length ? "No matching dishes." : "No menu items yet.";
    menuGrid.append(empty);
    return;
  }

  items.forEach((item) => {
    const row = template.content.firstElementChild.cloneNode(true);
    row.classList.toggle("is-open", state.openItems.has(item.id));
    row.querySelector("h3").textContent = item.name;
    row.querySelector(".item-cell > p").textContent = item.description;

    const itemToggle = row.querySelector(".item-toggle");
    itemToggle.setAttribute("aria-expanded", String(state.openItems.has(item.id)));
    itemToggle.addEventListener("click", () => toggleItemDetails(item.id));

    const rowEditButton = row.querySelector(".row-edit-button");
    const canEditItem = state.editing && canEditCategory(item.category);
    rowEditButton.hidden = !canEditItem;
    rowEditButton.addEventListener("click", () => openItemDialog(item.id));

    const allergenList = row.querySelector(".allergen-list");
    const allergens = item.allergens.length ? item.allergens : ["No major allergens"];
    allergens.forEach((allergen) => {
      const tag = document.createElement("span");
      tag.className = `allergen-tag${item.allergens.length ? "" : " none"}`;
      tag.textContent = allergen;
      allergenList.append(tag);
    });

    const pill = row.querySelector(".diet-pill");
    pill.textContent = item.diet;
    if (item.style) pill.classList.add(item.style);

    const heat = row.querySelector(".heat-meter");
    heat.textContent = renderHeat(item.heat);
    heat.setAttribute("aria-label", `${item.heat} out of 3 heat level`);

    const button = row.querySelector(".price-button");
    button.textContent = formatter.format(item.price);
    button.classList.toggle("editing", canEditItem);
    button.classList.toggle("locked", state.editing && !canEditItem);
    button.setAttribute("aria-label", canEditItem ? `Edit ${item.name}` : `${item.name} costs ${formatter.format(item.price)}`);
    button.addEventListener("click", () => {
      if (canEditItem) {
        openItemDialog(item.id);
      }
    });

    const itemDetails = row.querySelector(".item-details");
    const image = itemDetails.querySelector("img");
    itemDetails.hidden = !state.openItems.has(item.id);
    image.src = item.image;
    image.alt = item.name;
    itemDetails.querySelector(".detail-copy").textContent = item.details;

    menuGrid.append(row);
  });
}

function toggleItemDetails(id) {
  if (state.openItems.has(id)) {
    state.openItems.delete(id);
  } else {
    state.openItems.add(id);
  }

  renderMenu();
}

function renderAllergyChips() {
  allergyChips.replaceChildren();

  allergyOptions.forEach((allergen) => {
    const chip = document.createElement("button");
    chip.className = "allergy-chip";
    chip.type = "button";
    chip.textContent = allergen;
    chip.classList.toggle("is-active", state.allergies.has(allergen));
    chip.setAttribute("aria-pressed", String(state.allergies.has(allergen)));
    chip.addEventListener("click", () => toggleAllergy(allergen));
    allergyChips.append(chip);
  });
}

function toggleAllergy(allergen) {
  if (state.allergies.has(allergen)) {
    state.allergies.delete(allergen);
  } else {
    state.allergies.add(allergen);
  }

  renderAllergyChips();
  renderMenu();
}

function setEditMode(isEditing) {
  if (!canEditAnyCategory()) return;

  state.editing = isEditing;
  editModeButton.textContent = isEditing ? "Done" : "Edit";
  editModeButton.classList.toggle("is-active", isEditing);
  addItemButton.hidden = !isEditing || !canEditAnyCategory();
  updateDeleteMenuButton();
  renderActiveMenuHeader();
  renderMenu();
}

function openItemDialog(id) {
  const item = menuItems.find((menuItem) => menuItem.id === id);
  const isNew = !item;
  const editableCategories = getEditableCategories();
  if (!editableCategories.length) return;
  if (item && !canEditCategory(item.category)) return;

  const currentItem =
    item ||
    {
      id: `item-${Date.now()}`,
      name: "",
      description: "",
      category: editableCategories[0],
      diet: "V",
      style: "",
      heat: 0,
      allergens: [],
      details: "",
      image: "",
      price: 0
    };

  dialogTitle.textContent = isNew ? "Add item" : "Edit item";
  itemId.value = currentItem.id;
  itemName.value = currentItem.name;
  itemDescription.value = currentItem.description;
  itemDetails.value = currentItem.details;
  itemImage.value = currentItem.image;
  itemImageFile.value = "";
  resetUploadPreview({
    preview: itemUploadPreview,
    image: itemPreviewImage,
    progress: itemUploadProgress,
    status: itemUploadStatus,
    imageUrl: currentItem.image,
    message: currentItem.image ? "Current item photo. Choose a file to replace it." : "No item photo selected yet."
  });
  itemCategory.value = currentItem.category;
  [...itemCategory.options].forEach((option) => {
    option.disabled = !canEditCategory(option.value);
  });
  itemDiet.value = currentItem.diet;
  itemHeat.value = currentItem.heat;
  itemPrice.value = currentItem.price;
  itemAllergens.value = currentItem.allergens.join(", ");
  deleteItemButton.hidden = isNew;
  itemDialog.showModal();
}

function openDrawer() {
  if (!getActiveUser()) return;

  drawerOverlay.hidden = false;
  adminDrawer.classList.add("is-open");
  adminDrawer.setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  drawerOverlay.hidden = true;
  adminDrawer.classList.remove("is-open");
  adminDrawer.setAttribute("aria-hidden", "true");
}

function openUsersPage(tabName = "") {
  if (!getActiveUser()) return;

  closeDrawer();
  state.dashboardReturnScreen = state.screen === "menu" ? "menu" : "menus";
  showScreen("users");
  const adminTab = tabName || (state.dashboardTab && state.dashboardTab !== "account" ? state.dashboardTab : "users");
  showDashboardTab(isAdmin() ? adminTab : "account");
  refreshAccountEmailStatus();
  renderDashboard();
  if (isAdmin()) renderUserList();
}

function closeUsersPage() {
  accountEmailMessage.textContent = "";
  accountPasswordMessage.textContent = "";
  accountRestaurantMessage.textContent = "";
  showScreen(state.dashboardReturnScreen || "menus");
}

function getLinkableRestaurantMenus() {
  if (isAdmin()) return restaurantMenus;
  return getVisibleRestaurantMenus().filter((menu) => ownsMenu(menu));
}

function renderAccountDashboard() {
  const activeUser = getActiveUser();
  if (!activeUser || !usersPage) return;

  const visibleMenus = getVisibleRestaurantMenus();
  const linkableMenus = getLinkableRestaurantMenus();
  const linkedMenus = visibleMenus.filter((menu) => menu.restaurantName);
  deleteAccountButton.disabled = !canDeleteOwnAccount(activeUser);
  if (!canDeleteOwnAccount(activeUser) && !accountDeleteStatus.textContent) {
    accountDeleteStatus.textContent = "The primary admin account cannot be deleted here.";
  } else if (canDeleteOwnAccount(activeUser) && accountDeleteStatus.textContent === "The primary admin account cannot be deleted here.") {
    accountDeleteStatus.textContent = "";
  }
  const emailStatus =
    activeUser.role === "owner"
      ? activeUser.status === "active"
        ? "Verified"
        : activeUser.status === "unverified"
          ? "Needs verification"
          : activeUser.status
      : "Local account";

  accountProfileSummary.replaceChildren(
    createDashboardMetric("Signed in as", activeUser.username, getPrivilegeLabel(activeUser)),
    createDashboardMetric("Email", activeUser.email || "Not set", emailStatus),
    createDashboardMetric("Menus", String(visibleMenus.length), "Visible in your workspace"),
    createDashboardMetric("Linked restaurants", String(linkedMenus.length), "Menus assigned to a restaurant")
  );

  if (document.activeElement !== accountEmailInput) {
    accountEmailInput.value = activeUser.email || "";
  }

  const previousMenuId = accountMenuSelect.value;
  accountMenuSelect.replaceChildren();

  if (!linkableMenus.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Create a menu first";
    accountMenuSelect.append(option);
    accountMenuSelect.disabled = true;
    accountRestaurantName.disabled = true;
  } else {
    linkableMenus.forEach((menu) => {
      const option = document.createElement("option");
      option.value = menu.id;
      option.textContent = menu.name;
      accountMenuSelect.append(option);
    });
    accountMenuSelect.disabled = false;
    accountRestaurantName.disabled = false;
    accountMenuSelect.value = linkableMenus.some((menu) => menu.id === previousMenuId) ? previousMenuId : linkableMenus[0].id;
  }

  syncSelectedRestaurantName();
  renderAccountRestaurantLinks();
}

function renderAccountRestaurantLinks() {
  accountRestaurantLinks.replaceChildren();
  const visibleMenus = getVisibleRestaurantMenus();

  if (!visibleMenus.length) {
    accountRestaurantLinks.append(createDashboardEmpty("No menus have been created yet."));
    return;
  }

  visibleMenus.forEach((menu) => {
    accountRestaurantLinks.append(
      createDashboardListRow({
        title: menu.name,
        meta: menu.restaurantName ? `Linked restaurant: ${menu.restaurantName}` : "Not linked to a restaurant yet",
        badge: `${menu.items.length} items`,
        onClick: () => openRestaurantMenu(menu.id)
      })
    );
  });
}

function syncSelectedRestaurantName() {
  const menu = getLinkableRestaurantMenus().find((candidate) => candidate.id === accountMenuSelect.value);
  if (!menu) {
    accountRestaurantName.value = "";
    return;
  }

  if (document.activeElement !== accountRestaurantName) {
    accountRestaurantName.value = menu.restaurantName || "";
  }
}

function getActiveUserIndex() {
  const activeUser = getActiveUser();
  if (!activeUser) return -1;
  return users.findIndex((user) => user.username === activeUser.username);
}

function updateActiveUserProfile(updates) {
  const userIndex = getActiveUserIndex();
  if (userIndex < 0) return null;

  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  saveUsers();
  return users[userIndex];
}

async function refreshAccountEmailStatus() {
  const activeUser = getActiveUser();
  if (!activeUser || activeUser.role !== "owner") return;

  const firebaseUser = await getSignedInFirebaseUser();
  if (!firebaseUser || !firebaseUser.email) return;

  const updatedUser = updateActiveUserProfile({
    email: firebaseUser.email,
    firebaseUid: firebaseUser.uid,
    status: firebaseUser.emailVerified ? "active" : "unverified"
  });

  if (updatedUser) renderAdminState();
}

async function changeAccountEmail(event) {
  event.preventDefault();

  const activeUser = getActiveUser();
  const email = accountEmailInput.value.trim().toLowerCase();
  if (!activeUser || !email) return;

  accountEmailMessage.textContent = "Updating email...";

  if (activeUser.role !== "owner" && !activeUser.firebaseUid) {
    updateActiveUserProfile({ email });
    accountEmailMessage.textContent = "Email updated.";
    renderAdminState();
    return;
  }

  try {
    const firebaseUser = await getSignedInFirebaseUser();
    if (!firebaseUser) {
      accountEmailMessage.textContent = "Log out and log back in with this account before changing email.";
      return;
    }

    if ((firebaseUser.email || "").toLowerCase() !== email) {
      await firebaseUser.updateEmail(email);
      await firebaseUser.reload();
    }

    updateActiveUserProfile({
      email: firebaseUser.email || email,
      firebaseUid: firebaseUser.uid,
      status: firebaseUser.emailVerified ? "active" : "unverified"
    });

    if (!firebaseUser.emailVerified) {
      await sendVerificationEmail(firebaseUser);
      accountEmailMessage.textContent = "Email updated. Verification email sent. Check inbox and spam.";
    } else {
      accountEmailMessage.textContent = "Email updated.";
    }
    renderAdminState();
  } catch (error) {
    accountEmailMessage.textContent = getAuthErrorMessage(error);
  }
}

async function verifyAccountEmail() {
  const activeUser = getActiveUser();
  if (!activeUser) return;

  accountEmailMessage.textContent = "Checking email status...";

  if (activeUser.role !== "owner" && !activeUser.firebaseUid) {
    accountEmailMessage.textContent = "This local account does not need Firebase email verification.";
    return;
  }

  try {
    const firebaseUser = await getSignedInFirebaseUser();
    if (!firebaseUser) {
      accountEmailMessage.textContent = "Log out and log back in with this account before verifying email.";
      return;
    }

    await firebaseUser.reload();
    if (firebaseUser.emailVerified) {
      updateActiveUserProfile({
        email: firebaseUser.email || activeUser.email,
        firebaseUid: firebaseUser.uid,
        status: "active"
      });
      accountEmailMessage.textContent = "Email is verified.";
      renderAdminState();
      return;
    }

    await sendVerificationEmail(firebaseUser);
    accountEmailMessage.textContent = "Verification email sent. Check inbox and spam.";
  } catch (error) {
    accountEmailMessage.textContent = getAuthErrorMessage(error);
  }
}

async function changeAccountPassword(event) {
  event.preventDefault();

  const activeUser = getActiveUser();
  const password = accountPasswordInput.value;
  if (!activeUser || !password) return;

  accountPasswordMessage.textContent = "Updating password...";

  if (activeUser.role !== "owner" && !activeUser.firebaseUid) {
    updateActiveUserProfile({ password });
    accountPasswordInput.value = "";
    accountPasswordMessage.textContent = "Password updated.";
    renderAdminState();
    return;
  }

  try {
    const firebaseUser = await getSignedInFirebaseUser();
    if (!firebaseUser) {
      accountPasswordMessage.textContent = "Log out and log back in with this account before changing password.";
      return;
    }

    await firebaseUser.updatePassword(password);
    accountPasswordInput.value = "";
    accountPasswordMessage.textContent = "Password updated.";
  } catch (error) {
    accountPasswordMessage.textContent = getAuthErrorMessage(error);
  }
}

async function sendAccountPasswordReset() {
  const activeUser = getActiveUser();
  const email = (accountEmailInput.value.trim() || activeUser?.email || "").toLowerCase();
  if (!activeUser || !email) {
    accountPasswordMessage.textContent = "Add an email first.";
    return;
  }

  accountPasswordMessage.textContent = "Sending reset email...";

  try {
    const auth = await getFirebaseAuth();
    if (!auth) {
      accountPasswordMessage.textContent = "Firebase Auth is not connected.";
      return;
    }
    await sendPasswordResetForExistingEmail(auth, email);
    accountPasswordMessage.textContent = "Password reset email sent. Check inbox and spam.";
  } catch (error) {
    accountPasswordMessage.textContent = getAuthErrorMessage(error);
  }
}

function linkMenuToRestaurant(event) {
  event.preventDefault();

  const menuId = accountMenuSelect.value;
  const restaurantName = accountRestaurantName.value.trim();
  const menu = getLinkableRestaurantMenus().find((candidate) => candidate.id === menuId);
  if (!menu || !restaurantName) {
    accountRestaurantMessage.textContent = "Choose a menu and enter a restaurant name.";
    return;
  }

  menu.restaurantName = restaurantName;
  if (menu.label === "Blank menu") {
    menu.label = "Menu training";
  }

  saveRestaurantMenus();
  accountRestaurantMessage.textContent = `${menu.name} is linked to ${restaurantName}.`;
  renderAccountDashboard();
  renderRestaurantList();
}

function canDeleteOwnAccount(user = getActiveUser()) {
  return Boolean(user && user.role !== "admin");
}

function resetDeleteAccountSlider() {
  accountDeleteSliderDragging = false;
  setDeleteAccountSliderProgress(0);
  deleteAccountMessage.textContent = "";
}

function setDeleteAccountSliderProgress(value) {
  accountDeleteSliderProgress = Math.max(0, Math.min(100, value));
  const maxOffset = Math.max(0, deleteAccountSlider.clientWidth - deleteAccountSliderThumb.offsetWidth - 10);

  deleteAccountSlider.style.setProperty("--confirm-progress", `${accountDeleteSliderProgress}%`);
  deleteAccountSlider.setAttribute("aria-valuenow", String(Math.round(accountDeleteSliderProgress)));
  deleteAccountSliderThumb.style.transform = `translateX(${(maxOffset * accountDeleteSliderProgress) / 100}px)`;
  deleteAccountSliderThumb.textContent = accountDeleteSliderProgress >= 92 ? "Release" : "Grab";
  deleteAccountSliderText.textContent = accountDeleteSliderProgress >= 92 ? "Release to delete" : "Slide to delete";
}

function getDeleteAccountSliderValue(event) {
  const rect = deleteAccountSlider.getBoundingClientRect();
  const position = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
  return (position / rect.width) * 100;
}

function openDeleteAccountDialog() {
  const activeUser = getActiveUser();
  if (!activeUser) return;

  if (!canDeleteOwnAccount(activeUser)) {
    accountDeleteStatus.textContent = "The primary admin account cannot be deleted here.";
    return;
  }

  deleteAccountName.textContent = activeUser.username;
  deleteAccountQuestion.hidden = false;
  deleteAccountSlideStep.hidden = true;
  deleteAccountWarning.textContent = "This cannot be undone.";
  accountDeleteStatus.textContent = "";
  resetDeleteAccountSlider();
  deleteAccountDialog.showModal();
}

function closeDeleteAccountDialog() {
  if (accountDeletionBusy) return;

  deleteAccountDialog.close();
  deleteAccountQuestion.hidden = false;
  deleteAccountSlideStep.hidden = true;
  resetDeleteAccountSlider();
}

function showDeleteAccountSlider() {
  deleteAccountQuestion.hidden = true;
  deleteAccountSlideStep.hidden = false;
  resetDeleteAccountSlider();
  window.requestAnimationFrame(() => deleteAccountSlider.focus());
}

async function deleteOwnerWorkspaceData(user) {
  const workspaceStorageKey = getRestaurantMenusStorageKey(user);
  const workspaceDocId = getWorkspaceDocumentId(user);
  localStorage.removeItem(workspaceStorageKey);

  if (isOwnerWorkspace(user) && workspaceDocId !== firebaseMenuDocumentId && cloudSync.client?.db) {
    await cloudSync.client.db.collection("menus").doc(workspaceDocId).delete();
  }
}

async function markUserDeletedAfterSelfDelete(user) {
  const userIndex = users.findIndex((savedUser) => savedUser.username === user.username);
  if (userIndex >= 0) {
    users[userIndex] = {
      username: user.username,
      email: "",
      password: "",
      role: user.role,
      permissions: [],
      status: "deleted",
      firebaseUid: "",
      createdAt: user.createdAt || "",
      updatedAt: new Date().toISOString(),
      deletedAt: new Date().toISOString()
    };
  }

  saveUsers();
  await uploadCloudUsersSnapshot("account-delete");
}

function finishSelfAccountDeletion() {
  state.currentUser = null;
  state.screen = "login";
  state.editing = false;
  localStorage.removeItem(currentUserKey);
  restaurantMenus = loadRestaurantMenus(null);
  state.activeRestaurantMenu = restaurantMenus[0]?.id || defaultRestaurantMenuId;
  syncActiveRestaurantMenuData();
  applyDesignSettings();
  closeDrawer();
  deleteAccountDialog.close();
  accountDeletionBusy = false;
  renderAdminState();
}

async function deleteOwnAccount() {
  if (accountDeletionBusy || accountDeleteSliderProgress < 92) return;

  const activeUser = getActiveUser();
  if (!activeUser || !canDeleteOwnAccount(activeUser)) return;

  accountDeletionBusy = true;
  deleteAccountMessage.textContent = "Deleting account...";

  try {
    if (activeUser.role === "owner" || activeUser.firebaseUid) {
      const firebaseUser = await getSignedInFirebaseUser();
      if (!firebaseUser) {
        deleteAccountMessage.textContent = "Log out and log back in with this account before deleting it.";
        accountDeletionBusy = false;
        return;
      }

      if (activeUser.firebaseUid && firebaseUser.uid !== activeUser.firebaseUid) {
        deleteAccountMessage.textContent = "The signed-in Firebase account does not match this dashboard user.";
        accountDeletionBusy = false;
        return;
      }

      await firebaseUser.delete();
      await restoreAnonymousAuth();
    }

    await deleteOwnerWorkspaceData(activeUser);
    await markUserDeletedAfterSelfDelete(activeUser);
    finishSelfAccountDeletion();
  } catch (error) {
    accountDeletionBusy = false;
    deleteAccountMessage.textContent = getAuthErrorMessage(error);
  }
}

function handleDeleteAccountSliderPointerDown(event) {
  if (deleteAccountSlideStep.hidden || accountDeletionBusy) return;

  accountDeleteSliderDragging = true;
  deleteAccountSlider.setPointerCapture?.(event.pointerId);
  setDeleteAccountSliderProgress(getDeleteAccountSliderValue(event));
}

function handleDeleteAccountSliderPointerMove(event) {
  if (!accountDeleteSliderDragging || accountDeletionBusy) return;

  setDeleteAccountSliderProgress(getDeleteAccountSliderValue(event));
}

function handleDeleteAccountSliderPointerUp(event) {
  if (!accountDeleteSliderDragging || accountDeletionBusy) return;

  accountDeleteSliderDragging = false;
  setDeleteAccountSliderProgress(getDeleteAccountSliderValue(event));

  if (accountDeleteSliderProgress >= 92) {
    deleteOwnAccount();
    return;
  }

  setDeleteAccountSliderProgress(0);
}

function handleDeleteAccountSliderKeydown(event) {
  if (deleteAccountSlideStep.hidden || accountDeletionBusy) return;

  if (event.key === "ArrowRight" || event.key === "ArrowUp") {
    event.preventDefault();
    setDeleteAccountSliderProgress(accountDeleteSliderProgress + 10);
  }

  if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
    event.preventDefault();
    setDeleteAccountSliderProgress(accountDeleteSliderProgress - 10);
  }

  if (event.key === "Home") {
    event.preventDefault();
    setDeleteAccountSliderProgress(0);
  }

  if (event.key === "End") {
    event.preventDefault();
    setDeleteAccountSliderProgress(100);
  }

  if ((event.key === "Enter" || event.key === " ") && accountDeleteSliderProgress >= 92) {
    event.preventDefault();
    deleteOwnAccount();
  }
}

function showDashboardTab(tabName) {
  if (!isAdmin() && tabName !== "account") {
    tabName = "account";
  }

  state.dashboardTab = tabName;

  dashboardTabs.forEach((tab) => {
    tab.hidden = !isAdmin() && tab.dataset.dashboardTab !== "account";
    const isActive = tab.dataset.dashboardTab === tabName;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  dashboardPanels.forEach((panel) => {
    panel.hidden = panel.dataset.dashboardPanel !== tabName;
  });

  renderDashboard();
}

function renderDashboard() {
  const activeUser = getActiveUser();
  if (!activeUser) return;

  dashboardKicker.textContent = isAdmin() ? "Admin" : "Account";
  dashboardTitle.textContent = "Dashboard";
  dashboardTabs.forEach((tab) => {
    tab.hidden = !isAdmin() && tab.dataset.dashboardTab !== "account";
  });

  renderAccountDashboard();
  if (!isAdmin()) return;
  renderDashboardAuthSummary();
  renderDashboardPaymentsSummary();
  renderDashboardCustomizationSummary();
  renderDashboardRestaurants();
  renderDashboardMenus();
}

function createDashboardMetric(label, value, note = "") {
  const card = document.createElement("article");
  card.className = "dashboard-metric";

  const labelElement = document.createElement("span");
  labelElement.textContent = label;

  const valueElement = document.createElement("strong");
  valueElement.textContent = value;

  card.append(labelElement, valueElement);

  if (note) {
    const noteElement = document.createElement("small");
    noteElement.textContent = note;
    card.append(noteElement);
  }

  return card;
}

function renderDashboardAuthSummary() {
  const visibleUsers = getVisibleUsers();
  dashboardAuthSummary.replaceChildren(
    createDashboardMetric("Total accounts", String(visibleUsers.length), "Local app accounts"),
    createDashboardMetric(
      "Verified owners",
      String(visibleUsers.filter((user) => user.role === "owner" && user.status === "active").length),
      "Email verified restaurant owners"
    ),
    createDashboardMetric(
      "Need attention",
      String(visibleUsers.filter((user) => ["pending", "unverified"].includes(user.status)).length),
      "Pending invites or unverified emails"
    ),
    createDashboardMetric("Admins", String(visibleUsers.filter((user) => user.role === "admin").length), "Full access")
  );
}

function renderDashboardPaymentsSummary() {
  dashboardPaymentsSummary.replaceChildren(
    createDashboardMetric("Payment status", "Not connected", "No live charges"),
    createDashboardMetric("Provider", "None", "Stripe can be added later"),
    createDashboardMetric("Plans", "0", "No subscription plans yet")
  );
}

function renderDashboardCustomizationSummary() {
  if (!dashboardCustomizationSummary) return;

  dashboardCustomizationSummary.replaceChildren(
    createCustomizationSwatch("Accent", designSettings.leaf),
    createCustomizationSwatch("Price", designSettings.gold),
    createCustomizationSwatch("Edit", designSettings.aqua),
    createDashboardMetric("Header image", designSettings.heroImage ? "Set" : "Blank", "Current menu banner")
  );
}

function createCustomizationSwatch(label, color) {
  const card = createDashboardMetric(label, color, "Theme color");
  card.classList.add("theme-swatch-card");
  card.style.setProperty("--swatch-color", color);
  return card;
}

function renderDashboardRestaurants() {
  dashboardRestaurantList.replaceChildren();

  if (!restaurantMenus.length) {
    dashboardRestaurantList.append(createDashboardEmpty("No restaurants have been created yet."));
    return;
  }

  restaurantMenus.forEach((menu) => {
    dashboardRestaurantList.append(
      createDashboardListRow({
        title: menu.name,
        meta: `${menu.restaurantName ? `${menu.restaurantName} - ` : ""}${menu.label} - ${menu.items.length} items`,
        badge: `Owner: ${getMenuOwner(menu)}`,
        onClick: () => openRestaurantMenu(menu.id)
      })
    );
  });
}

function renderDashboardMenus() {
  dashboardMenuList.replaceChildren();

  if (!restaurantMenus.length) {
    dashboardMenuList.append(createDashboardEmpty("No menus have been created yet."));
    return;
  }

  restaurantMenus.forEach((menu) => {
    const itemCategories = categories
      .map((category) => `${getCategoryLabel(category)}: ${menu.items.filter((item) => item.category === category).length}`)
      .join(" / ");

    dashboardMenuList.append(
      createDashboardListRow({
        title: menu.name,
        meta: `${menu.restaurantName ? `${menu.restaurantName} - ` : ""}${itemCategories}`,
        badge: `${menu.items.length} items`,
        onClick: () => openRestaurantMenu(menu.id)
      })
    );
  });
}

function createDashboardEmpty(message) {
  const empty = document.createElement("p");
  empty.className = "empty-state restaurant-empty";
  empty.textContent = message;
  return empty;
}

function createDashboardListRow({ title, meta, badge, onClick }) {
  const row = document.createElement("button");
  row.className = "dashboard-list-row";
  row.type = "button";
  row.addEventListener("click", onClick);

  const copy = document.createElement("span");
  const titleElement = document.createElement("strong");
  const metaElement = document.createElement("small");
  titleElement.textContent = title;
  metaElement.textContent = meta;
  copy.append(titleElement, metaElement);

  const badgeElement = document.createElement("span");
  badgeElement.className = "dashboard-badge";
  badgeElement.textContent = badge;

  row.append(copy, badgeElement);
  return row;
}

function openPdfPage() {
  const activeUser = getActiveUser();
  if (!activeUser) return;

  closeDrawer();
  showScreen("pdf");
  renderPdfItemList();
}

function closePdfPage() {
  showScreen("menu");
}

function toggleCreateUserPanel() {
  createUserPanel.hidden = !createUserPanel.hidden;
  createUserToggle.setAttribute("aria-expanded", String(!createUserPanel.hidden));
  createUserToggle.querySelector(".expand-marker").textContent = createUserPanel.hidden ? "+" : "-";
}

function setCreateMethod(method) {
  const isInvite = method === "invite";
  createMethod.value = method;
  newEmailLabel.hidden = !isInvite;
  newEmail.required = isInvite;
  newPasswordLabel.hidden = isInvite;
  newPassword.required = !isInvite;
  createUserSubmit.textContent = isInvite ? "Send invite" : "Create user";
  methodTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.method === method));
  userMessage.textContent = "";
}

function openDesignDialog() {
  if (!isAdmin()) return;
  syncDesignForm();
  designDialog.showModal();
}

function closeDesignDialog() {
  designDialog.close();
}

function saveDesign(event) {
  event.preventDefault();
  if (!isAdmin()) return;

  const activeMenu = getActiveRestaurantMenu();
  const requestedHeroImage = heroImageUrl.value.trim();
  const heroImageValue = shouldUseBuiltInMott32Hero(activeMenu, requestedHeroImage) ? defaultHeroImage : requestedHeroImage;
  designSettings = {
    ...designSettings,
    ink: colorInk.value,
    leaf: colorLeaf.value,
    gold: colorGold.value,
    aqua: colorAqua.value,
    page: colorPage.value,
    panel: colorPanel.value,
    heroImage: heroImageValue
  };

  saveDesignSettings();
  applyDesignSettings();
  closeDesignDialog();
}

function resetDesign() {
  if (!isAdmin()) return;
  designSettings = { ...defaultDesign };
  saveDesignSettings();
  applyDesignSettings();
  syncDesignForm();
}

function renderPdfItemList() {
  pdfItemList.replaceChildren();
  pdfMessage.textContent = "";

  categories.forEach((category) => {
    const items = menuItems.filter((item) => item.category === category);
    if (!items.length) return;

    const group = document.createElement("section");
    group.className = "pdf-category";

    const header = document.createElement("div");
    header.className = "pdf-category-header";

    const label = document.createElement("label");
    label.className = "pdf-category-select";

    const categoryInput = document.createElement("input");
    categoryInput.type = "checkbox";
    categoryInput.checked = true;
    categoryInput.dataset.category = category;

    const title = document.createElement("span");
    title.innerHTML = `<strong>${escapeHtml(getCategoryLabel(category))}</strong><small>${items.length} items</small>`;
    label.append(categoryInput, title);

    const toggle = document.createElement("button");
    toggle.className = "small-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", `Show ${getCategoryLabel(category)} items`);
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "⌄";

    header.append(label, toggle);
    group.append(header);

    const itemPanel = document.createElement("div");
    itemPanel.className = "pdf-category-items";
    itemPanel.hidden = true;

    items.forEach((item) => {
      const itemLabel = document.createElement("label");
      itemLabel.className = "pdf-item-row";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = "pdf-item";
      input.value = item.id;
      input.dataset.category = category;
      input.checked = true;

      const info = document.createElement("span");
      info.innerHTML = `<strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.description)}</small>`;

      itemLabel.append(input, info);
      itemPanel.append(itemLabel);
    });

    categoryInput.addEventListener("change", () => {
      itemPanel.querySelectorAll("input[name='pdf-item']").forEach((input) => {
        input.checked = categoryInput.checked;
      });
    });

    itemPanel.addEventListener("change", () => {
      const itemInputs = [...itemPanel.querySelectorAll("input[name='pdf-item']")];
      categoryInput.checked = itemInputs.every((input) => input.checked);
      categoryInput.indeterminate = itemInputs.some((input) => input.checked) && !categoryInput.checked;
    });

    toggle.addEventListener("click", () => {
      itemPanel.hidden = !itemPanel.hidden;
      toggle.classList.toggle("is-open", !itemPanel.hidden);
      toggle.setAttribute("aria-expanded", String(!itemPanel.hidden));
    });

    group.append(itemPanel);
    pdfItemList.append(group);
  });
}

function setPdfSelection(isSelected) {
  pdfItemList.querySelectorAll("input[name='pdf-item']").forEach((input) => {
    input.checked = isSelected;
  });
}

function generatePdf() {
  const selectedIds = [...pdfItemList.querySelectorAll("input[name='pdf-item']:checked")].map((input) => input.value);
  const selectedItems = menuItems.filter((item) => selectedIds.includes(item.id));

  if (!selectedItems.length) {
    pdfMessage.textContent = "Select at least one item.";
    return;
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    pdfMessage.textContent = "Allow popups to create the PDF page.";
    return;
  }

  printWindow.document.write(getPrintableHtml(selectedItems));
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 300);
}

function getPrintableHtml(items) {
  const groupedItems = categories
    .map((category) => ({
      category,
      items: items.filter((item) => item.category === category)
    }))
    .filter((group) => group.items.length);

  const itemMarkup = groupedItems
    .map(
      (group) => `
        <section class="category">
          <h2>${escapeHtml(getCategoryLabel(group.category))}</h2>
          ${group.items.map(getPrintableItemMarkup).join("")}
        </section>
      `
    )
    .join("");

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Menu Matrix PDF</title>
        <style>
          @page { margin: 0.55in; }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            color: ${designSettings.ink};
            font-family: Arial, sans-serif;
            line-height: 1.35;
          }
          header {
            display: flex;
            align-items: center;
            gap: 18px;
            border-bottom: 2px solid ${designSettings.leaf};
            padding-bottom: 16px;
            margin-bottom: 20px;
          }
          header img {
            width: 110px;
            max-height: 72px;
            object-fit: contain;
          }
          h1 {
            margin: 0;
            font-size: 28px;
          }
          h2 {
            margin: 22px 0 10px;
            color: ${designSettings.leaf};
            font-size: 18px;
            text-transform: uppercase;
          }
          .item {
            display: grid;
            grid-template-columns: ${pdfIncludePhotos.checked ? "92px 1fr" : "1fr"};
            gap: 14px;
            border-bottom: 1px solid #ddd8cc;
            padding: 12px 0;
            break-inside: avoid;
          }
          .item img {
            width: 92px;
            height: 92px;
            border-radius: 8px;
            object-fit: cover;
          }
          h3 {
            margin: 0 0 4px;
            font-size: 16px;
          }
          .price {
            color: ${designSettings.gold};
            font-weight: 700;
          }
          p {
            margin: 4px 0;
            font-size: 12px;
          }
          .meta {
            color: #5e6862;
            font-size: 11px;
            font-weight: 700;
          }
        </style>
      </head>
      <body>
        <header>
          <img src="${escapeAttribute(designSettings.heroImage)}" alt="Restaurant logo" />
          <div>
            <h1>Menu Matrix</h1>
            <p>Selected menu items</p>
          </div>
        </header>
        ${itemMarkup}
      </body>
    </html>
  `;
}

function getPrintableItemMarkup(item) {
  const photo = pdfIncludePhotos.checked ? `<img src="${escapeAttribute(item.image)}" alt="" />` : "";
  const price = pdfIncludePrices.checked ? ` <span class="price">${formatter.format(item.price)}</span>` : "";
  const allergens = pdfIncludeAllergens.checked
    ? `<p class="meta">Allergens: ${escapeHtml(item.allergens.length ? item.allergens.join(", ") : "No major allergens")}</p>`
    : "";
  const notes = pdfIncludeNotes.checked ? `<p>${escapeHtml(item.details)}</p>` : "";

  return `
    <article class="item">
      ${photo}
      <div>
        <h3>${escapeHtml(item.name)}${price}</h3>
        <p>${escapeHtml(item.description)}</p>
        ${allergens}
        ${notes}
      </div>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function renderAdminState() {
  const activeUser = getActiveUser();
  const invitedUser = getInvitedUser();
  normalizeScreen(activeUser, invitedUser);
  const showingInviteSetup = Boolean(invitedUser) && !activeUser;

  authPage.hidden = Boolean(activeUser) || state.screen === "register";
  registerPage.hidden = Boolean(activeUser) || showingInviteSetup || state.screen !== "register";
  menusPage.hidden = !activeUser || state.screen !== "menus";
  menuPage.hidden = !activeUser || state.screen !== "menu";
  usersPage.hidden = !activeUser || state.screen !== "users";
  pdfPage.hidden = !activeUser || state.screen !== "pdf";

  adminLoginForm.hidden = Boolean(activeUser) || showingInviteSetup;
  passwordSetupForm.hidden = !showingInviteSetup;
  registerLinkButton.hidden = showingInviteSetup;
  adminControls.hidden = !activeUser;
  pdfBuilderButton.hidden = !activeUser;
  scanMenuButton.hidden = !canEditAnyCategory();
  manageUsersButton.hidden = !activeUser;
  designButton.hidden = true;
  editHeroButton.hidden = !isAdmin();
  loginMessage.textContent = "";
  setupMessage.textContent = "";
  if (invitedUser) {
    inviteIntro.textContent = `Create a password for ${invitedUser.username}`;
  }
  adminStatus.textContent = activeUser
    ? `Signed in as ${activeUser.username}${isAdmin() ? " (admin)" : ""}`
    : "Signed out";

  editModeButton.textContent = state.editing ? "Done" : "Edit menu";
  editModeButton.classList.toggle("is-active", state.editing);
  editModeButton.hidden = !canEditAnyCategory();
  addItemButton.hidden = !state.editing || !canEditAnyCategory();
  updateDeleteMenuButton();

  if (!activeUser || !canEditAnyCategory()) {
    state.editing = false;
    editModeButton.textContent = "Edit menu";
    editModeButton.classList.remove("is-active");
    addItemButton.hidden = true;
    updateDeleteMenuButton();
  }

  renderRestaurantList();
  renderAdminHomeSummary();
  renderActiveMenuHeader();
  renderAccountDashboard();
  renderDashboard();
  if (isAdmin()) renderUserList();
  renderMenu();
}

function getUsernameFromEmail(email) {
  return email.split("@")[0].replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "") || `user-${Date.now()}`;
}

function upsertFirebaseOwner(firebaseUser, fallbackUsername = "") {
  const email = (firebaseUser.email || "").toLowerCase();
  const existingIndex = users.findIndex((user) => {
    return user.firebaseUid === firebaseUser.uid || (user.email || "").toLowerCase() === email;
  });
  const username =
    existingIndex >= 0
      ? users[existingIndex].username
      : firebaseUser.displayName || fallbackUsername || getUsernameFromEmail(email);
  const nextUser = {
    ...(existingIndex >= 0 ? users[existingIndex] : {}),
    username,
    email,
    password: "",
    role: existingIndex >= 0 && users[existingIndex].role !== "owner" ? users[existingIndex].role : "owner",
    permissions: existingIndex >= 0 && users[existingIndex].permissions?.length ? users[existingIndex].permissions : [...categories],
    status: "active",
    firebaseUid: firebaseUser.uid,
    createdAt: existingIndex >= 0 ? users[existingIndex].createdAt || "" : new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    users[existingIndex] = nextUser;
  } else {
    users.push(nextUser);
  }

  saveUsers();
  return nextUser;
}

async function loginWithFirebaseAccount(identity, password) {
  const auth = await getFirebaseAuth();
  if (!auth) {
    loginMessage.textContent = "Firebase Auth is not connected.";
    return false;
  }

  const existingUser = findUserByIdentity(identity, { includeDeleted: true });
  if (isDeletedUser(existingUser)) {
    loginMessage.textContent = "This account was removed by an admin. Register it again to restore access.";
    return true;
  }

  const email = identity.includes("@") ? identity : existingUser?.email || "";
  if (!email) return false;

  try {
    const credential = await auth.signInWithEmailAndPassword(email, password);
    await credential.user.reload();

    if (!credential.user.emailVerified && existingUser?.status !== "active") {
      loginMessage.textContent =
        "Verify your email first. Check your inbox and spam folder. Use resend only after waiting a few minutes.";
      setResendVerificationVisible(true);
      await auth.signOut();
      await restoreAnonymousAuth();
      return true;
    }

    const user = upsertFirebaseOwner(credential.user, existingUser?.username || getUsernameFromEmail(email));
    state.currentUser = user.username;
    state.screen = "menus";
    localStorage.setItem(currentUserKey, user.username);
    activateWorkspaceForCurrentUser();
    adminLoginForm.reset();
    setResendVerificationVisible(false);
    renderAdminState();
    return true;
  } catch (error) {
    loginMessage.textContent = getAuthErrorMessage(error);
    await restoreAnonymousAuth();
    return true;
  }
}

async function resendVerificationFromLogin() {
  const auth = await getFirebaseAuth();
  if (!auth) {
    loginMessage.textContent = "Firebase Auth is not connected.";
    return;
  }

  const identity = adminUsername.value.trim().toLowerCase();
  const password = adminPassword.value;
  const existingUser = findUserByIdentity(identity, { includeDeleted: true });
  if (isDeletedUser(existingUser)) {
    loginMessage.textContent = "This account was removed by an admin. Register it again to restore access.";
    resendVerificationButton.disabled = false;
    return;
  }

  const email = identity.includes("@") ? identity : existingUser?.email || "";

  if (!email || !password) {
    loginMessage.textContent = "Enter the account email and password, then resend verification.";
    return;
  }

  resendVerificationButton.disabled = true;
  loginMessage.textContent = "Sending verification email...";

  try {
    const credential = await auth.signInWithEmailAndPassword(email, password);
    await credential.user.reload();

    if (credential.user.emailVerified) {
      const user = upsertFirebaseOwner(credential.user, existingUser?.username || getUsernameFromEmail(email));
      state.currentUser = user.username;
      state.screen = "menus";
      localStorage.setItem(currentUserKey, user.username);
      setResendVerificationVisible(false);
      activateWorkspaceForCurrentUser();
      adminLoginForm.reset();
      renderAdminState();
      return;
    }

    const verificationMode = await sendVerificationEmail(credential.user);
    loginMessage.textContent =
      verificationMode === "firebase-default"
        ? "Verification email sent with Firebase's default link. Check inbox and spam."
        : "Verification email sent. Check inbox and spam.";
    await auth.signOut();
    await restoreAnonymousAuth();
  } catch (error) {
    loginMessage.textContent = getAuthErrorMessage(error);
    await restoreAnonymousAuth();
  } finally {
    resendVerificationButton.disabled = false;
  }
}

async function loginAdmin(event) {
  event.preventDefault();

  const identity = adminUsername.value.trim().toLowerCase();
  const password = adminPassword.value;
  setResendVerificationVisible(false);
  const user = getVisibleUsers().find((savedUser) => {
    const username = savedUser.username.toLowerCase();
    const email = (savedUser.email || "").toLowerCase();
    return (
      savedUser.role !== "owner" &&
      (username === identity || email === identity) &&
      savedUser.password === password &&
      savedUser.status !== "pending"
    );
  });

  if (!user) {
    loginMessage.textContent = "Checking Firebase account...";
    const handledByFirebase = await loginWithFirebaseAccount(identity, password);
    if (!handledByFirebase) {
      loginMessage.textContent = "Invalid login.";
    }
    return;
  }

  state.currentUser = user.username;
  state.screen = "menus";
  localStorage.setItem(currentUserKey, user.username);
  activateWorkspaceForCurrentUser();
  adminLoginForm.reset();
  renderAdminState();
}

function openRegisterPage() {
  loginMessage.textContent = "";
  adminLoginForm.reset();
  setResendVerificationVisible(false);
  state.screen = "register";
  renderAdminState();
  registerUsername.focus();
}

function openLoginPage() {
  registerMessage.textContent = "";
  selfRegisterForm.reset();
  setResendVerificationVisible(false);
  state.screen = "login";
  renderAdminState();
  adminUsername.focus();
}

function activateWorkspaceForCurrentUser() {
  restaurantMenus = loadRestaurantMenus(getActiveUser());
  resetMenuViewForCurrentUser();
  connectCloudWorkspaceForCurrentUser();
}

function resetMenuViewForCurrentUser() {
  const visibleMenus = getVisibleRestaurantMenus();
  state.activeRestaurantMenu = visibleMenus[0]?.id || "";
  state.category = "all";
  state.query = "";
  state.openItems.clear();
  state.allergies.clear();
  searchInput.value = "";
  tabs.forEach((button) => button.classList.toggle("is-active", button.dataset.category === "all"));
  syncActiveRestaurantMenuData();
  applyDesignSettings();
  renderAllergyChips();
}

async function registerAccount(event) {
  event.preventDefault();

  const username = registerUsername.value.trim();
  const email = registerEmail.value.trim();
  const password = registerPassword.value;
  const normalizedUsername = username.toLowerCase();
  const normalizedEmail = email.toLowerCase();
  const reusableDeletedIndex = users.findIndex((user) => {
    return (
      isDeletedUser(user) &&
      (user.username.toLowerCase() === normalizedUsername || (user.email || "").toLowerCase() === normalizedEmail)
    );
  });
  const userExists = users.some((user) => {
    if (isDeletedUser(user)) return false;
    return user.username.toLowerCase() === normalizedUsername || (user.email || "").toLowerCase() === normalizedEmail;
  });

  if (userExists) {
    registerMessage.textContent = "That username or email is already registered.";
    return;
  }

  registerMessage.textContent = "Creating account...";
  let auth = null;

  try {
    auth = await getFirebaseAuth();
    if (!auth) {
      registerMessage.textContent = "Firebase Auth is not connected.";
      return;
    }

    const credential = await auth.createUserWithEmailAndPassword(email, password);
    await credential.user.updateProfile({ displayName: username });

    const user = {
      username,
      email,
      password: "",
      role: "owner",
      permissions: [...categories],
      status: "unverified",
      firebaseUid: credential.user.uid,
      createdAt: reusableDeletedIndex >= 0 ? users[reusableDeletedIndex].createdAt || "" : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: ""
    };

    if (reusableDeletedIndex >= 0) {
      users[reusableDeletedIndex] = user;
    } else {
      users.push(user);
    }
    saveUsers();
    let verificationMode = "";
    try {
      verificationMode = await sendVerificationEmail(credential.user);
    } catch (verificationError) {
      await auth.signOut();
      await restoreAnonymousAuth();
      selfRegisterForm.reset();
      if (verificationError?.code === "auth/too-many-requests") {
        registerMessage.textContent =
          "Account created, but Firebase temporarily blocked verification emails from this device. Wait a while, then log in and use Resend verification.";
      } else {
        registerMessage.textContent =
          `Account created, but the verification email could not be sent: ${getAuthErrorMessage(verificationError)}`;
      }
      return;
    }
    await auth.signOut();
    await restoreAnonymousAuth();
    selfRegisterForm.reset();
    registerMessage.textContent =
      verificationMode === "firebase-default"
        ? "Verification email sent with Firebase's default link. Add your domain in Firebase Auth settings when you can."
        : "Verification email sent. Open it, then log in.";
    return;
  } catch (error) {
    if (error?.code === "auth/email-already-in-use") {
      const existingIndex = users.findIndex((user) => (user.email || "").toLowerCase() === normalizedEmail);
      const usernameConflict = users.some((user, index) => {
        return index !== existingIndex && !isDeletedUser(user) && user.username.toLowerCase() === normalizedUsername;
      });

      if (usernameConflict) {
        registerMessage.textContent = "That username is already registered. Choose a different username.";
        await restoreAnonymousAuth();
        return;
      }

      const recoveredUser = {
        ...(existingIndex >= 0 ? users[existingIndex] : {}),
        username,
        email,
        password: "",
        role: "owner",
        permissions: [...categories],
        status: "unverified",
        firebaseUid: existingIndex >= 0 ? users[existingIndex].firebaseUid || "" : "",
        createdAt: existingIndex >= 0 ? users[existingIndex].createdAt || "" : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: ""
      };

      if (existingIndex >= 0) {
        users[existingIndex] = recoveredUser;
      } else {
        users.push(recoveredUser);
      }
      saveUsers();
      renderUserList();
      try {
        const resetMode = await sendPasswordResetForExistingEmail(auth, email);
        selfRegisterForm.reset();
        registerMessage.textContent =
          resetMode === "firebase-default"
            ? "That email was still in Firebase, so I restored the account and sent a password reset with Firebase's default link. Check inbox and spam."
            : "That email was still in Firebase, so I restored the account and sent a password reset. Check inbox and spam, then log in.";
      } catch (resetError) {
        registerMessage.textContent =
          `That email was still in Firebase, so I restored the account. Password reset could not be sent yet: ${getAuthErrorMessage(resetError)}`;
      }
      await restoreAnonymousAuth();
      return;
    }
    registerMessage.textContent = getAuthErrorMessage(error);
    await restoreAnonymousAuth();
    return;
  }
}

function setupInvitedPassword(event) {
  event.preventDefault();

  const invitedUser = getInvitedUser();
  if (!invitedUser) {
    setupMessage.textContent = "Invite not found.";
    return;
  }

  const userIndex = users.findIndex((user) => user.username === invitedUser.username);
  users[userIndex] = {
    ...users[userIndex],
    password: setupPassword.value,
    status: "active",
    updatedAt: new Date().toISOString()
  };

  saveUsers();
  state.currentUser = users[userIndex].username;
  state.screen = "menus";
  localStorage.setItem(currentUserKey, users[userIndex].username);
  activateWorkspaceForCurrentUser();
  passwordSetupForm.reset();
  window.history.replaceState({}, "", window.location.pathname);
  renderAdminState();
}

async function logoutAdmin() {
  state.currentUser = null;
  state.screen = "login";
  localStorage.removeItem(currentUserKey);
  const auth = await getFirebaseAuth();
  if (auth?.currentUser && !auth.currentUser.isAnonymous) {
    await auth.signOut();
    await restoreAnonymousAuth();
  }
  closeDrawer();
  setEditMode(false);
  adminLoginForm.reset();
  renderAdminState();
}

function renderUserList() {
  userList.replaceChildren();

  [...getVisibleUsers()].sort(sortUsersByPrivileges).forEach((user) => {
    const row = document.createElement("div");
    row.className = "user-row";

    const summary = document.createElement("button");
    summary.className = "user-summary";
    summary.type = "button";

    const info = document.createElement("div");
    const name = document.createElement("strong");
    const access = document.createElement("span");
    name.textContent = user.username;
    const statusNote =
      user.status === "pending" ? " - invite pending" : user.status === "unverified" ? " - email unverified" : "";
    access.textContent = `${getPrivilegeLabel(user)}${statusNote}`;
    info.append(name, access);
    summary.append(info);

    const marker = document.createElement("span");
    marker.className = "expand-marker";
    marker.textContent = "+";
    summary.append(marker);
    row.append(summary);

    const details = document.createElement("form");
    details.className = "user-edit-panel";
    details.hidden = true;
    details.append(createEmailLabel(user), createPasswordLabel(user), createPermissionFieldset(user));

    if (user.role !== "admin") {
      const actions = document.createElement("div");
      actions.className = "user-actions";

      const saveButton = document.createElement("button");
      saveButton.className = "save-button";
      saveButton.type = "submit";
      saveButton.textContent = "Save changes";

      const removeButton = document.createElement("button");
      removeButton.className = "small-danger";
      removeButton.type = "button";
      removeButton.textContent = "Remove";
      removeButton.addEventListener("click", () => removeUser(user.username));

      actions.append(saveButton);
      if (user.role === "owner" && user.status === "unverified") {
        const activateButton = document.createElement("button");
        activateButton.className = "small-success";
        activateButton.type = "button";
        activateButton.textContent = "Activate account";
        activateButton.addEventListener("click", () => activateUser(user.username));
        actions.append(activateButton);
      }
      actions.append(removeButton);
      details.append(actions);
      details.addEventListener("submit", (event) => updateUser(event, user.username));
    } else {
      const note = document.createElement("p");
      note.className = "user-note";
      note.textContent = "The primary admin account always keeps full access.";
      details.append(note);
    }

    summary.addEventListener("click", () => {
      details.hidden = !details.hidden;
      marker.textContent = details.hidden ? "+" : "-";
    });

    row.append(details);
    userList.append(row);
  });
}

function sortUsersByPrivileges(a, b) {
  const rankA = getPrivilegeRank(a);
  const rankB = getPrivilegeRank(b);
  if (rankA !== rankB) return rankB - rankA;
  return a.username.localeCompare(b.username);
}

function getPrivilegeRank(user) {
  if (user.role === "admin") return categories.length + 1;
  if (user.role === "owner") return categories.length;
  return (user.permissions || []).length;
}

function getPrivilegeLabel(user) {
  if (user.role === "admin") return "All sections";
  if (user.role === "owner") return "Own menus";
  return (user.permissions || []).map(getCategoryLabel).join(", ") || "No edit access";
}

function getCategoryLabel(category) {
  return {
    starters: "Starters",
    mains: "Mains",
    drinks: "Drinks"
  }[category] || category;
}

function createPasswordLabel(user) {
  const label = document.createElement("label");
  label.textContent = "Password";

  const input = document.createElement("input");
  input.name = "password";
  input.type = "password";
  input.value = user.password;
  input.disabled = user.role === "admin";
  label.append(input);
  return label;
}

function createEmailLabel(user) {
  const label = document.createElement("label");
  label.textContent = "Email";

  const input = document.createElement("input");
  input.name = "email";
  input.type = "email";
  input.value = user.email || "";
  input.disabled = user.role === "admin";
  label.append(input);
  return label;
}

function createPermissionFieldset(user) {
  const fieldset = document.createElement("fieldset");
  fieldset.className = "permission-group";

  const legend = document.createElement("legend");
  legend.textContent = "Can modify";
  fieldset.append(legend);

  categories.forEach((category) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "permissions";
    input.value = category;
    input.checked = user.role === "admin" || (user.permissions || []).includes(category);
    input.disabled = user.role === "admin";
    label.append(input, document.createTextNode(` ${getCategoryLabel(category)}`));
    fieldset.append(label);
  });

  return fieldset;
}

function saveUser(event) {
  event.preventDefault();
  if (!isAdmin()) return;

  const username = newUsername.value.trim();
  const email = newEmail.value.trim();
  const isInvite = createMethod.value === "invite";
  const permissions = [...userForm.querySelectorAll("input[name='permissions']:checked")].map((input) => input.value);

  if (!permissions.length) {
    userMessage.textContent = "Choose at least one section.";
    return;
  }

  if (!isInvite && !newPassword.value) {
    userMessage.textContent = "Enter a password.";
    return;
  }

  const existingIndex = users.findIndex((user) => user.username === username);
  const user = {
    username,
    email: isInvite ? email : "",
    password: isInvite ? "" : newPassword.value,
    role: "editor",
    permissions,
    status: isInvite ? "pending" : "active",
    createdAt: existingIndex >= 0 ? users[existingIndex].createdAt || "" : new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (existingIndex >= 0 && users[existingIndex].role === "admin") {
    userMessage.textContent = "The admin account cannot be changed here.";
    return;
  }

  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }

  saveUsers();
  userForm.reset();
  if (isInvite) {
    sendInviteEmail(user);
    userMessage.textContent = "Invite created. Your email app should open.";
  } else {
    userMessage.textContent = "User created.";
  }
  setCreateMethod(createMethod.value);
  renderUserList();
}

function sendInviteEmail(user) {
  const inviteUrl = `${window.location.origin}${window.location.pathname}?invite=${encodeURIComponent(user.username)}`;
  const subject = encodeURIComponent("Create your Menu Matrix password");
  const body = encodeURIComponent(
    `Hi ${user.username},\n\nYou've been invited to edit Menu Matrix sections: ${getPrivilegeLabel(user)}.\n\nCreate your password here:\n${inviteUrl}\n\nUsername: ${user.username}`
  );
  window.location.href = `mailto:${encodeURIComponent(user.email)}?subject=${subject}&body=${body}`;
}

function removeUser(username) {
  if (!isAdmin()) return;

  const userIndex = users.findIndex((user) => user.username === username);
  if (userIndex < 0 || users[userIndex].role === "admin") return;

  const user = users[userIndex];
  if (user.role === "owner" && (user.email || user.firebaseUid)) {
    users[userIndex] = {
      ...user,
      status: "deleted",
      password: "",
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    userMessage.textContent =
      "Account removed from the dashboard. If that email registers again, the app will restore it and send a password reset.";
  } else {
    users = users.filter((savedUser) => savedUser.username !== username || savedUser.role === "admin");
    userMessage.textContent = "User removed.";
  }

  saveUsers();
  renderUserList();
}

function activateUser(username) {
  if (!isAdmin()) return;

  const userIndex = users.findIndex((user) => user.username === username);
  if (userIndex < 0 || users[userIndex].role === "admin") return;

  users[userIndex] = {
    ...users[userIndex],
    status: "active",
    updatedAt: new Date().toISOString()
  };

  saveUsers();
  userMessage.textContent = `${users[userIndex].username} can now log in with email and password.`;
  renderUserList();
}

function updateUser(event, username) {
  event.preventDefault();
  if (!isAdmin()) return;

  const userIndex = users.findIndex((user) => user.username === username);
  if (userIndex < 0 || users[userIndex].role === "admin") return;

  const form = event.currentTarget;
  const permissions = [...form.querySelectorAll("input[name='permissions']:checked")].map((input) => input.value);

  if (!permissions.length) {
    userMessage.textContent = "Choose at least one section.";
    return;
  }

  users[userIndex] = {
    ...users[userIndex],
    email: form.elements.email.value,
    password: form.elements.password.value,
    permissions,
    updatedAt: new Date().toISOString()
  };

  saveUsers();
  userMessage.textContent = "User updated.";
  renderUserList();
}

function closeItemDialog() {
  itemDialog.close();
  itemForm.reset();
}

function openScanDialog() {
  const editableCategories = getEditableCategories();
  if (!editableCategories.length) return;

  scanText.value = "";
  scanImageFile.value = "";
  scanMessage.textContent = "";
  [...scanCategory.options].forEach((option) => {
    option.disabled = !canEditCategory(option.value);
  });
  scanCategory.value = editableCategories[0];
  scanDialog.showModal();
}

function closeScanDialog() {
  scanDialog.close();
}

function clearScan() {
  scanText.value = "";
  scanImageFile.value = "";
  scanMessage.textContent = "";
}

async function runMenuPhotoScan() {
  const file = scanImageFile.files?.[0];
  if (!file) {
    scanMessage.textContent = "Choose or take a photo first.";
    return;
  }

  if (!window.Tesseract) {
    scanMessage.textContent = "OCR did not load. Check internet connection and try again.";
    return;
  }

  runScanButton.disabled = true;
  scanMessage.textContent = "Preparing photo...";

  try {
    const result = cloudOcrEndpoint ? await scanWithCloudOcr(file) : await scanWithBrowserOcr(file);
    scanText.value = result.text;
    scanMessage.textContent = scanText.value
      ? "Text scanned. Review it, then create a draft."
      : "No usable text found. Try cropping closer to one item.";
  } catch {
    scanMessage.textContent = cloudOcrEndpoint
      ? "Cloud scan failed. Check the function URL or Firebase setup."
      : "Could not scan this photo.";
  } finally {
    runScanButton.disabled = false;
  }
}

async function scanWithCloudOcr(file) {
  scanMessage.textContent = "Uploading photo for cloud scan...";
  const imageData = await readImageFile(file);
  const response = await fetch(cloudOcrEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      imageData,
      category: scanCategory.value
    })
  });

  if (!response.ok) {
    throw new Error("Cloud OCR failed.");
  }

  return response.json();
}

async function scanWithBrowserOcr(file) {
  if (!window.Tesseract) {
    throw new Error("Browser OCR did not load.");
  }

  const preparedImage = await prepareImageForOcr(file);
  scanMessage.textContent = "Scanning photo in browser...";
  const result = await window.Tesseract.recognize(preparedImage, "eng", {
    logger: (event) => {
      if (event.status === "recognizing text") {
        scanMessage.textContent = `Scanning photo... ${Math.round(event.progress * 100)}%`;
      }
    },
    tessedit_pageseg_mode: "6",
    tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$.,&'()-/ "
  });

  return {
    text: cleanOcrText(result.data.text)
  };
}

function prepareImageForOcr(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      image.src = reader.result;
    });
    reader.addEventListener("error", () => reject(reader.error));

    image.addEventListener("load", () => {
      const maxWidth = 1600;
      const scale = Math.min(1, maxWidth / image.width);
      const width = Math.round(image.width * scale);
      const height = Math.round(image.height * scale);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;
      context.drawImage(image, 0, 0, width, height);

      const imageData = context.getImageData(0, 0, width, height);
      for (let index = 0; index < imageData.data.length; index += 4) {
        const red = imageData.data[index];
        const green = imageData.data[index + 1];
        const blue = imageData.data[index + 2];
        const gray = red * 0.299 + green * 0.587 + blue * 0.114;
        const contrast = gray > 150 ? 255 : 0;
        imageData.data[index] = contrast;
        imageData.data[index + 1] = contrast;
        imageData.data[index + 2] = contrast;
      }
      context.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    });
    image.addEventListener("error", reject);
    reader.readAsDataURL(file);
  });
}

function cleanOcrText(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/[^A-Za-z0-9$.,&'()\-\/ ]+/g, " ").replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 2)
    .filter((line) => /[A-Za-z]{3,}/.test(line) || /\$\s*\d+/.test(line))
    .slice(0, 6)
    .join("\n");
}

function createScannedItemDraft() {
  if (!scanText.value.trim()) {
    scanMessage.textContent = "Add or scan text first.";
    return;
  }

  const draft = parseScannedItem(scanText.value, scanCategory.value);
  closeScanDialog();
  openItemDialogWithDraft(draft);
}

function parseScannedItem(text, category) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const meaningfulLines = lines.filter((line) => /[A-Za-z]{3,}/.test(line));
  const fullText = meaningfulLines.join(" ");
  const priceMatch = fullText.match(/\$\s*(\d+(?:\.\d{1,2})?)/) || fullText.match(/\b(\d{1,3}(?:\.\d{2})?)\s*$/);
  const price = priceMatch ? Number(priceMatch[1]) : 0;
  const name = cleanScannedLine(meaningfulLines[0] || "New Menu Item");
  const description = cleanScannedLine(meaningfulLines.slice(1).join(" ").replace(priceMatch?.[0] || "", "")) || "Review scanned menu text and update this description.";

  return {
    id: `item-${Date.now()}`,
    name,
    description,
    category,
    diet: "NA",
    style: getStyleForItem(category, 0),
    heat: 0,
    allergens: [],
    details: description,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    price: Number.isFinite(price) ? price : 0
  };
}

function cleanScannedLine(line) {
  return line.replace(/\s+/g, " ").replace(/\$\s*\d+(?:\.\d{1,2})?/g, "").trim();
}

function openItemDialogWithDraft(currentItem) {
  dialogTitle.textContent = "Add item";
  itemId.value = currentItem.id;
  itemName.value = currentItem.name;
  itemDescription.value = currentItem.description;
  itemDetails.value = currentItem.details;
  itemImage.value = currentItem.image;
  itemImageFile.value = "";
  resetUploadPreview({
    preview: itemUploadPreview,
    image: itemPreviewImage,
    progress: itemUploadProgress,
    status: itemUploadStatus,
    imageUrl: currentItem.image,
    message: currentItem.image ? "Current item photo. Choose a file to replace it." : "No item photo selected yet."
  });
  itemCategory.value = currentItem.category;
  [...itemCategory.options].forEach((option) => {
    option.disabled = !canEditCategory(option.value);
  });
  itemDiet.value = currentItem.diet;
  itemHeat.value = currentItem.heat;
  itemPrice.value = currentItem.price;
  itemAllergens.value = currentItem.allergens.join(", ");
  deleteItemButton.hidden = true;
  itemDialog.showModal();
}

function readImageFile(file, onProgress = null) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("progress", (event) => {
      if (!onProgress || !event.lengthComputable) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    });
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

async function updateItemImageFromFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    itemImage.value = await prepareUploadedImage(file, {
      maxWidth: 900,
      quality: 0.82,
      preview: itemUploadPreview,
      image: itemPreviewImage,
      progress: itemUploadProgress,
      status: itemUploadStatus,
      button: saveItemButton
    });
  } catch {
    itemImage.value = "";
  }
}

async function updateHeroImageFromFile(event) {
  const file = event.target.files?.[0];
  if (!file || !isAdmin()) return;
  try {
    heroImageUrl.value = await prepareUploadedImage(file, {
      maxWidth: 1100,
      quality: 0.84,
      preview: heroUploadPreview,
      image: heroPreviewImage,
      progress: heroUploadProgress,
      status: heroUploadStatus,
      button: saveDesignButton
    });
  } catch {
    heroImageUrl.value = designSettings.heroImage;
  }
}

function getStyleForItem(category, heat) {
  if (category === "drinks") return "sea";
  if (heat > 1) return "fire";
  return "";
}

function getFormItem() {
  const heat = Math.max(0, Math.min(3, Number(itemHeat.value)));
  const category = itemCategory.value;
  const allergens = itemAllergens.value
    .split(",")
    .map((allergen) => allergen.trim())
    .filter(Boolean);

  return {
    id: itemId.value,
    name: itemName.value.trim(),
    description: itemDescription.value.trim(),
    details: itemDetails.value.trim() || "Key ingredients, flavor notes, and service talking points can go here.",
    image: itemImage.value.trim() || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    category,
    diet: itemDiet.value,
    style: getStyleForItem(category, heat),
    heat,
    allergens,
    price: Math.max(0, Number(itemPrice.value))
  };
}

function saveItem(event) {
  event.preventDefault();

  const item = getFormItem();
  const itemIndex = menuItems.findIndex((menuItem) => menuItem.id === item.id);
  const previousItem = menuItems[itemIndex];

  if (!canEditCategory(item.category) || (previousItem && !canEditCategory(previousItem.category))) {
    return;
  }

  if (itemIndex >= 0) {
    menuItems[itemIndex] = item;
  } else {
    menuItems = [item, ...menuItems];
  }

  saveMenuItems();
  closeItemDialog();
  renderAllergyChips();
  renderMenu();
}

function deleteItem() {
  const id = itemId.value;
  const item = menuItems.find((menuItem) => menuItem.id === id);
  if (!item || !canEditCategory(item.category)) return;

  menuItems = menuItems.filter((item) => item.id !== id);
  saveMenuItems();
  closeItemDialog();
  renderMenu();
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    state.category = tab.dataset.category;
    tabs.forEach((button) => button.classList.toggle("is-active", button === tab));
    renderMenu();
  });
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderMenu();
});

editModeButton.addEventListener("click", () => {
  setEditMode(!state.editing);
});
quickEditModeButton.addEventListener("click", () => {
  setEditMode(!state.editing);
});

addItemButton.addEventListener("click", () => {
  openItemDialog();
});
topAddItemButton.addEventListener("click", () => {
  openItemDialog();
});

deleteMenuButton.addEventListener("click", openDeleteMenuDialog);
closeDeleteMenuButton.addEventListener("click", closeDeleteMenuDialog);
cancelDeleteMenuButton.addEventListener("click", closeDeleteMenuDialog);
continueDeleteMenuButton.addEventListener("click", showDeleteMenuSlider);
deleteMenuSlider.addEventListener("pointerdown", handleDeleteSliderPointerDown);
deleteMenuSlider.addEventListener("pointermove", handleDeleteSliderPointerMove);
deleteMenuSlider.addEventListener("pointerup", handleDeleteSliderPointerUp);
deleteMenuSlider.addEventListener("pointercancel", () => {
  deleteSliderDragging = false;
  setDeleteMenuSliderProgress(0);
});
deleteMenuSlider.addEventListener("keydown", handleDeleteSliderKeydown);
scanMenuButton.addEventListener("click", openScanDialog);
quickScanMenuButton.addEventListener("click", openScanDialog);
closeScanButton.addEventListener("click", closeScanDialog);
clearScanButton.addEventListener("click", clearScan);
runScanButton.addEventListener("click", runMenuPhotoScan);
createScannedItemButton.addEventListener("click", createScannedItemDraft);
pdfBuilderButton.addEventListener("click", openPdfPage);
quickPdfBuilderButton.addEventListener("click", openPdfPage);
backFromPdfButton.addEventListener("click", closePdfPage);
selectAllPdfButton.addEventListener("click", () => setPdfSelection(true));
clearPdfButton.addEventListener("click", () => setPdfSelection(false));
generatePdfButton.addEventListener("click", generatePdf);
createUserToggle.addEventListener("click", toggleCreateUserPanel);
methodTabs.forEach((tab) => {
  tab.addEventListener("click", () => setCreateMethod(tab.dataset.method));
});
dashboardTabs.forEach((tab) => {
  tab.addEventListener("click", () => showDashboardTab(tab.dataset.dashboardTab));
});
manageUsersButton.addEventListener("click", () => openUsersPage());
accountEmailForm.addEventListener("submit", changeAccountEmail);
accountVerifyEmailButton.addEventListener("click", verifyAccountEmail);
accountPasswordForm.addEventListener("submit", changeAccountPassword);
accountPasswordResetButton.addEventListener("click", sendAccountPasswordReset);
accountRestaurantForm.addEventListener("submit", linkMenuToRestaurant);
accountMenuSelect.addEventListener("change", syncSelectedRestaurantName);
deleteAccountButton.addEventListener("click", openDeleteAccountDialog);
closeDeleteAccountButton.addEventListener("click", closeDeleteAccountDialog);
cancelDeleteAccountButton.addEventListener("click", closeDeleteAccountDialog);
continueDeleteAccountButton.addEventListener("click", showDeleteAccountSlider);
deleteAccountSlider.addEventListener("pointerdown", handleDeleteAccountSliderPointerDown);
deleteAccountSlider.addEventListener("pointermove", handleDeleteAccountSliderPointerMove);
deleteAccountSlider.addEventListener("pointerup", handleDeleteAccountSliderPointerUp);
deleteAccountSlider.addEventListener("pointercancel", () => {
  accountDeleteSliderDragging = false;
  setDeleteAccountSliderProgress(0);
});
deleteAccountSlider.addEventListener("keydown", handleDeleteAccountSliderKeydown);
designButton.addEventListener("click", openDesignDialog);
adminHomeDashboardButton.addEventListener("click", () => openUsersPage());
dashboardCustomizationButton.addEventListener("click", openDesignDialog);
editHeroButton.addEventListener("click", openDesignDialog);
renameMenuButton.addEventListener("click", openRenameMenuDialog);
closeRenameMenuButton.addEventListener("click", closeRenameMenuDialog);
renameMenuForm.addEventListener("submit", saveMenuName);
backToMenuButton.addEventListener("click", closeUsersPage);
drawerOpenButton.addEventListener("click", openDrawer);
drawerCloseButton.addEventListener("click", closeDrawer);
drawerOverlay.addEventListener("click", closeDrawer);
adminLoginForm.addEventListener("submit", loginAdmin);
resendVerificationButton.addEventListener("click", resendVerificationFromLogin);
passwordSetupForm.addEventListener("submit", setupInvitedPassword);
logoutButton.addEventListener("click", logoutAdmin);
menusLogoutButton.addEventListener("click", logoutAdmin);
createMenuButton.addEventListener("click", createBlankRestaurantMenu);
backToMenusButton.addEventListener("click", () => {
  closeDrawer();
  setEditMode(false);
  showScreen("menus");
});
registerLinkButton.addEventListener("click", openRegisterPage);
loginLinkButton.addEventListener("click", openLoginPage);
selfRegisterForm.addEventListener("submit", registerAccount);
userForm.addEventListener("submit", saveUser);
itemImageFile.addEventListener("change", updateItemImageFromFile);
heroImageFile.addEventListener("change", updateHeroImageFromFile);
designForm.addEventListener("submit", saveDesign);
closeDesignButton.addEventListener("click", closeDesignDialog);
resetDesignButton.addEventListener("click", resetDesign);
closeDialogButton.addEventListener("click", closeItemDialog);
deleteItemButton.addEventListener("click", deleteItem);
itemForm.addEventListener("submit", saveItem);

if (getActiveUser()) {
  activateWorkspaceForCurrentUser();
} else {
  applyDesignSettings();
  renderAdminState();
  renderAllergyChips();
  renderMenu();
}
initializeCloudSync();

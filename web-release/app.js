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
const defaultHeroImage = "https://www.nicepng.com/png/detail/809-8099031_mott32-las-vegas-mott-32-logo.png";
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
  activeRestaurantMenu: initialRestaurantMenu?.id || defaultRestaurantMenuId
};

const cloudSync = {
  applying: false,
  client: null,
  docId: "",
  ref: null,
  saveTimer: null,
  unsubscribe: null
};

let deleteSliderDragging = false;
let deleteSliderProgress = 0;

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
const syncStatus = document.querySelector("#syncStatus");
const setupPassword = document.querySelector("#setupPassword");
const setupMessage = document.querySelector("#setupMessage");
const inviteIntro = document.querySelector("#inviteIntro");
const loginMessage = document.querySelector("#loginMessage");
const adminStatus = document.querySelector("#adminStatus");
const editModeButton = document.querySelector("#editModeButton");
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
const colorInk = document.querySelector("#colorInk");
const colorLeaf = document.querySelector("#colorLeaf");
const colorGold = document.querySelector("#colorGold");
const colorAqua = document.querySelector("#colorAqua");
const colorPage = document.querySelector("#colorPage");
const colorPanel = document.querySelector("#colorPanel");
const heroImageUrl = document.querySelector("#heroImageUrl");
const heroImageFile = document.querySelector("#heroImageFile");

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

  return {
    id: menu.id || `menu-${Date.now()}-${index}`,
    name: menu.name || (isDefaultMenu ? "Mott 32 Las Vegas" : `Blank Menu ${index + 1}`),
    owner: menu.owner || primaryAdminUsername,
    label: menu.label || (isDefaultMenu ? "Chinese menu training" : "Blank menu"),
    categories: Array.isArray(menu.categories) && menu.categories.length ? menu.categories : ["Starters", "Mains", "Drinks"],
    items: items.map(normalizeMenuItem),
    designSettings: normalizeDesignSettings(design)
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
}

function loadUsers() {
  const savedUsers = localStorage.getItem(usersStorageKey);
  if (!savedUsers) return [...defaultUsers];

  try {
    const parsed = JSON.parse(savedUsers);
    if (!Array.isArray(parsed) || !parsed.length) return [...defaultUsers];

    const hasAdmin = parsed.some((user) => user.username === "admin" && user.role === "admin");
    return hasAdmin ? parsed : [...defaultUsers, ...parsed];
  } catch {
    return [...defaultUsers];
  }
}

function saveUsers() {
  localStorage.setItem(usersStorageKey, JSON.stringify(users));
  scheduleCloudSave();
}

function loadCurrentUser() {
  const username = localStorage.getItem(currentUserKey);
  if (!username) return null;
  return users.find((user) => user.username === username) ? username : null;
}

function getInviteUsername() {
  const params = new URLSearchParams(window.location.search);
  return params.get("invite");
}

function getInvitedUser() {
  const username = getInviteUsername();
  if (!username) return null;
  return users.find((user) => user.username === username && user.status === "pending") || null;
}

function getActiveUser() {
  return users.find((user) => user.username === state.currentUser) || null;
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
  if (code === "auth/email-already-in-use") return "That email is already registered. Log in instead.";
  if (code === "auth/invalid-email") return "Enter a valid email address.";
  if (code === "auth/weak-password") return "Use at least 6 characters for the password.";
  if (code === "auth/wrong-password" || code === "auth/user-not-found" || code === "auth/invalid-credential") {
    return "Invalid login.";
  }
  if (code === "auth/operation-not-allowed") {
    return "Enable Email/Password sign-in in Firebase Authentication first.";
  }
  if (code === "auth/network-request-failed") return "Network error. Try again in a moment.";
  return error?.message || "Authentication failed.";
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
  connectCloudWorkspaceForCurrentUser();
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
    owner: menu.owner || primaryAdminUsername,
    label: menu.label || "Menu training",
    categories: Array.isArray(menu.categories) && menu.categories.length ? menu.categories : ["Starters", "Mains", "Drinks"],
    items: Array.isArray(menu.items) ? menu.items.map(sanitizeMenuItemForCloud) : [],
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

  if (state.screen === "users" && !isAdmin()) {
    state.screen = "menus";
  }
}

function renderRestaurantList() {
  restaurantList.replaceChildren();

  const visibleMenus = getVisibleRestaurantMenus();

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
    const name = document.createElement("strong");
    const details = document.createElement("span");
    name.textContent = menu.name;
    details.textContent = `${menu.label} - ${menu.items.length} items`;
    info.append(name, details);

    button.append(image, info);
    restaurantList.append(button);
  });
}

function renderActiveMenuHeader() {
  const activeMenu = getActiveRestaurantMenu();
  currentMenuTitle.textContent = activeMenu?.name || "No menu selected";
  renameMenuButton.hidden = !state.editing || !canEditAnyCategory() || !activeMenu;
}

function openRestaurantMenu(menuId) {
  if (!getVisibleRestaurantMenus().some((menu) => menu.id === menuId)) return;

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
    owner: activeUser.username,
    label: "Blank menu",
    categories: ["Starters", "Mains", "Drinks"],
    items: [],
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

function openUsersPage() {
  if (!isAdmin()) return;

  closeDrawer();
  showScreen("users");
  renderUserList();
}

function closeUsersPage() {
  showScreen("menu");
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

  designSettings = {
    ...designSettings,
    ink: colorInk.value,
    leaf: colorLeaf.value,
    gold: colorGold.value,
    aqua: colorAqua.value,
    page: colorPage.value,
    panel: colorPanel.value,
    heroImage: heroImageUrl.value.trim()
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
  usersPage.hidden = !activeUser || state.screen !== "users" || !isAdmin();
  pdfPage.hidden = !activeUser || state.screen !== "pdf";

  adminLoginForm.hidden = Boolean(activeUser) || showingInviteSetup;
  passwordSetupForm.hidden = !showingInviteSetup;
  registerLinkButton.hidden = showingInviteSetup;
  adminControls.hidden = !activeUser;
  pdfBuilderButton.hidden = !activeUser;
  scanMenuButton.hidden = !canEditAnyCategory();
  manageUsersButton.hidden = !isAdmin();
  designButton.hidden = !isAdmin();
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
  renderActiveMenuHeader();
  renderUserList();
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
    firebaseUid: firebaseUser.uid
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

  const existingUser = users.find((user) => {
    return user.username.toLowerCase() === identity || (user.email || "").toLowerCase() === identity;
  });
  const email = identity.includes("@") ? identity : existingUser?.email || "";
  if (!email) return false;

  try {
    const credential = await auth.signInWithEmailAndPassword(email, password);
    await credential.user.reload();

    if (!credential.user.emailVerified) {
      await credential.user.sendEmailVerification({
        url: `${window.location.origin}${window.location.pathname}`
      });
      loginMessage.textContent = "Verify your email first. I sent the verification email again.";
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
    renderAdminState();
    return true;
  } catch (error) {
    loginMessage.textContent = getAuthErrorMessage(error);
    await restoreAnonymousAuth();
    return true;
  }
}

async function loginAdmin(event) {
  event.preventDefault();

  const identity = adminUsername.value.trim().toLowerCase();
  const password = adminPassword.value;
  const user = users.find((savedUser) => {
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
  state.screen = "register";
  renderAdminState();
  registerUsername.focus();
}

function openLoginPage() {
  registerMessage.textContent = "";
  selfRegisterForm.reset();
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
  const userExists = users.some((user) => {
    return user.username.toLowerCase() === normalizedUsername || (user.email || "").toLowerCase() === normalizedEmail;
  });

  if (userExists) {
    registerMessage.textContent = "That username or email is already registered.";
    return;
  }

  registerMessage.textContent = "Creating account...";

  try {
    const auth = await getFirebaseAuth();
    if (!auth) {
      registerMessage.textContent = "Firebase Auth is not connected.";
      return;
    }

    const credential = await auth.createUserWithEmailAndPassword(email, password);
    await credential.user.updateProfile({ displayName: username });
    await credential.user.sendEmailVerification({
      url: `${window.location.origin}${window.location.pathname}`
    });

    const user = {
      username,
      email,
      password: "",
      role: "owner",
      permissions: [...categories],
      status: "unverified",
      firebaseUid: credential.user.uid
    };

    users.push(user);
    saveUsers();
    await auth.signOut();
    await restoreAnonymousAuth();
    selfRegisterForm.reset();
    registerMessage.textContent = "Verification email sent. Open it, then log in.";
    return;
  } catch (error) {
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
    status: "active"
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

  [...users].sort(sortUsersByPrivileges).forEach((user) => {
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

      actions.append(saveButton, removeButton);
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
    status: isInvite ? "pending" : "active"
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
  users = users.filter((user) => user.username !== username || user.role === "admin");
  saveUsers();
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
    permissions
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

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

async function updateItemImageFromFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  itemImage.value = await readImageFile(file);
}

async function updateHeroImageFromFile(event) {
  const file = event.target.files?.[0];
  if (!file || !isAdmin()) return;
  const dataUrl = await readImageFile(file);
  heroImageUrl.value = dataUrl;
  designSettings = {
    ...designSettings,
    heroImage: dataUrl
  };
  saveDesignSettings();
  applyDesignSettings();
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

addItemButton.addEventListener("click", () => {
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
closeScanButton.addEventListener("click", closeScanDialog);
clearScanButton.addEventListener("click", clearScan);
runScanButton.addEventListener("click", runMenuPhotoScan);
createScannedItemButton.addEventListener("click", createScannedItemDraft);
pdfBuilderButton.addEventListener("click", openPdfPage);
backFromPdfButton.addEventListener("click", closePdfPage);
selectAllPdfButton.addEventListener("click", () => setPdfSelection(true));
clearPdfButton.addEventListener("click", () => setPdfSelection(false));
generatePdfButton.addEventListener("click", generatePdf);
createUserToggle.addEventListener("click", toggleCreateUserPanel);
methodTabs.forEach((tab) => {
  tab.addEventListener("click", () => setCreateMethod(tab.dataset.method));
});
manageUsersButton.addEventListener("click", openUsersPage);
designButton.addEventListener("click", openDesignDialog);
editHeroButton.addEventListener("click", openDesignDialog);
renameMenuButton.addEventListener("click", openRenameMenuDialog);
closeRenameMenuButton.addEventListener("click", closeRenameMenuDialog);
renameMenuForm.addEventListener("submit", saveMenuName);
backToMenuButton.addEventListener("click", closeUsersPage);
drawerOpenButton.addEventListener("click", openDrawer);
drawerCloseButton.addEventListener("click", closeDrawer);
drawerOverlay.addEventListener("click", closeDrawer);
adminLoginForm.addEventListener("submit", loginAdmin);
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

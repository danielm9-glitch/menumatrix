const firebaseConfig = {
  apiKey: "AIzaSyASyuErU2lppEUs7K4wp-vCC5MiyA886mE",
  projectId: "menumatrix-36116"
};

const menuDocumentPath = "menus/main";
const legacyRestaurantDocumentPath = "restaurants/mott32-las-vegas";

const defaultHeroImage = "https://www.nicepng.com/png/detail/809-8099031_mott32-las-vegas-mott-32-logo.png";
const defaultDesign = {
  ink: "#18231f",
  leaf: "#24745a",
  gold: "#c47a2c",
  aqua: "#2f8b96",
  page: "#f4efe5",
  panel: "#fffaf2",
  heroImage: defaultHeroImage
};

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

const defaultMenus = [
  {
    id: "mott32-las-vegas",
    name: "Mott 32 Las Vegas",
    restaurantId: "restaurant-mott32-las-vegas",
    restaurantName: "Mott 32 Las Vegas",
    owner: "admin",
    label: "Chinese menu training",
    categories: ["Starters", "Mains", "Drinks"],
    items: defaultMenuItems,
    designSettings: defaultDesign
  }
];

const defaultRestaurants = [
  {
    id: "restaurant-mott32-las-vegas",
    name: "Mott 32 Las Vegas",
    owner: "admin",
    location: "Las Vegas",
    cuisine: "Chinese fine dining",
    notes: "Default training workspace.",
    createdAt: "",
    updatedAt: ""
  }
];

function toFirestoreValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(toFirestoreValue) } };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (typeof value === "object") {
    return {
      mapValue: {
        fields: Object.fromEntries(
          Object.entries(value).map(([key, nestedValue]) => [key, toFirestoreValue(nestedValue)])
        )
      }
    };
  }
  return { stringValue: String(value) };
}

function fromFirestoreValue(value) {
  if (!value) return null;
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("nullValue" in value) return null;
  if ("arrayValue" in value) return (value.arrayValue.values || []).map(fromFirestoreValue);
  if ("mapValue" in value) {
    return Object.fromEntries(
      Object.entries(value.mapValue.fields || {}).map(([key, nestedValue]) => [key, fromFirestoreValue(nestedValue)])
    );
  }
  return null;
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }
  if (!response.ok) {
    const message = typeof body === "object" ? body?.error?.message || JSON.stringify(body) : body;
    throw new Error(message || `HTTP ${response.status}`);
  }
  return body;
}

async function getAnonymousIdToken() {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`;
  const result = await requestJson(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ returnSecureToken: true })
  });
  return result.idToken;
}

async function getCurrentDocument(idToken, documentPath) {
  const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/${documentPath}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${idToken}` }
  });

  if (response.status === 404) return null;
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(body?.error?.message || `HTTP ${response.status}`);
  }
  return body;
}

function getMenusForSync(existingDocument) {
  const fields = existingDocument?.fields || null;
  if (!fields) return defaultMenus;

  const existing = Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, fromFirestoreValue(value)])
  );

  if (Array.isArray(existing.menus) && existing.menus.length) {
    return existing.menus.map((menu) => ({
      ...menu,
      owner: menu.owner || "admin"
    }));
  }

  if (Array.isArray(existing.menuItems) || existing.designSettings) {
    return [
      {
        ...defaultMenus[0],
        owner: "admin",
        items: Array.isArray(existing.menuItems) ? existing.menuItems : defaultMenuItems,
        designSettings: existing.designSettings || defaultDesign
      }
    ];
  }

  return defaultMenus;
}

function getRestaurantsForSync(existingDocument, menus) {
  const fields = existingDocument?.fields || null;
  if (fields?.restaurants) {
    const existing = fromFirestoreValue(fields.restaurants);
    if (Array.isArray(existing)) return existing;
  }

  const restaurants = new Map(defaultRestaurants.map((restaurant) => [restaurant.id, restaurant]));
  menus.forEach((menu) => {
    if (!menu.restaurantId && !menu.restaurantName) return;
    const id = menu.restaurantId || `restaurant-${String(menu.restaurantName || menu.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
    if (!restaurants.has(id)) {
      restaurants.set(id, {
        id,
        name: menu.restaurantName || menu.name || "Restaurant",
        owner: menu.owner || "admin",
        location: "",
        cuisine: "",
        notes: "",
        createdAt: "",
        updatedAt: ""
      });
    }
  });
  return [...restaurants.values()];
}

async function patchMenuDocument(idToken, menus, restaurants) {
  const fields = {
    menus: toFirestoreValue(menus),
    restaurants: toFirestoreValue(restaurants),
    source: toFirestoreValue("manual-codex-sync"),
    schemaVersion: toFirestoreValue(2),
    updatedAt: toFirestoreValue(new Date().toISOString())
  };

  const params = new URLSearchParams();
  Object.keys(fields).forEach((field) => params.append("updateMask.fieldPaths", field));

  const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/${menuDocumentPath}?${params}`;
  return requestJson(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ fields })
  });
}

async function main() {
  const idToken = await getAnonymousIdToken();
  const existingDocument = await getCurrentDocument(idToken, menuDocumentPath);
  const legacyDocument = existingDocument ? null : await getCurrentDocument(idToken, legacyRestaurantDocumentPath);
  const migratedFromLegacy = !existingDocument && Boolean(legacyDocument);
  const menus = getMenusForSync(existingDocument || legacyDocument);
  const restaurants = getRestaurantsForSync(existingDocument || legacyDocument, menus);
  await patchMenuDocument(idToken, menus, restaurants);
  console.log(
    `Synced ${restaurants.length} restaurant(s) and ${menus.length} menu(s) to Firestore document ${menuDocumentPath}.` +
      (migratedFromLegacy ? ` Migrated data from ${legacyRestaurantDocumentPath}.` : "")
  );
}

main().catch((error) => {
  console.error(`Firebase sync failed: ${error.message}`);
  process.exitCode = 1;
});

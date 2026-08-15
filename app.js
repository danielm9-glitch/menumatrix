const storageKey = "restaurant-menu-matrix-items";
const menuSeedKey = "restaurant-menu-matrix-seed";
const currentMenuSeed = "mott32-dinner-menu-matrix-details-history-v1";
const usersStorageKey = "restaurant-menu-matrix-users";
const currentUserKey = "restaurant-menu-matrix-current-user";
const designStorageKey = "restaurant-menu-matrix-design";
const menusStorageKey = "restaurant-menu-matrix-restaurant-menus";
const categoriesStorageKey = "restaurant-menu-matrix-categories";
const savedShareCodesStorageKey = "restaurant-menu-matrix-saved-share-codes";
const authFlowKey = "restaurant-menu-matrix-auth-flow";
const currentAuthFlow = "login-first-menus";
const firebaseMenuDocumentId = "main";
const primaryAdminUsername = "admin";
const cloudOcrEndpoint = window.MENU_MATRIX_OCR_ENDPOINT || "";
const menuFullnessTarget = 12;
const quizResultsLimit = 150;
const sharedQuizResultsPullInterval = 3000;
const menuStatsEventLimit = 80;
const itemStatsEventLimit = 40;
const legacyMott32HeroImage = "https://www.nicepng.com/png/detail/809-8099031_mott32-las-vegas-mott-32-logo.png";
const defaultHeroImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 260'%3E%3Crect width='640' height='260' fill='%23f7f1e6'/%3E%3Ctext x='320' y='116' text-anchor='middle' font-family='Georgia%2C serif' font-size='84' font-weight='700' fill='%2319211d'%3EMOTT 32%3C/text%3E%3Ctext x='320' y='168' text-anchor='middle' font-family='Arial%2C sans-serif' font-size='22' letter-spacing='8' fill='%2366716b'%3ELAS VEGAS%3C/text%3E%3C/svg%3E";
const defaultFrontMediaUrl = "assets/login-background.mp4";
const maxInlineVideoUploadSize = 850000;
const itemPhotoCloudUploadsEnabled = window.MENU_MATRIX_ENABLE_STORAGE_UPLOADS !== false;
const defaultDesign = {
  ink: "#19211d",
  leaf: "#2f7d56",
  gold: "#d99d2b",
  aqua: "#317c8e",
  page: "#f8f2e8",
  panel: "#fbfaf6",
  heroImage: defaultHeroImage,
  itemPhotoSize: 96,
  frontMediaType: "video",
  frontMediaUrl: defaultFrontMediaUrl,
  frontMediaPhoneSize: 100,
  frontMediaWebSize: 100,
  frontMediaBlur: 6.5,
  frontVideoLength: 0,
  menuAnimationIntensity: 30
};
const defaultCategories = ["bbq", "steamed-dim-sum", "baked-fried", "starters", "soups", "birds-nest", "abalone", "market-seafood", "fresh-seafood", "clay-pot", "meat", "vegetables", "rice-noodles", "desserts", "out-of-menu"];
let categories = loadCategories();
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
    "id": "apple-wood-roasted-42-days-peking-duck-signature-mott-32-cut",
    "name": "Apple Wood Roasted 42 Days Peking Duck, Signature Mott 32 Cut",
    "description": "Peking duck aged exactly 42 days. Roasted in an oven for 60 minutes and smoked by apple wood. Before the duck is presented and carved tableside, the accompaniments are presented to the guest: duck sauce, peanut sauce, sesame sauce, cane sugar, scallions, and cucumber The duck sauce is mixed with peanut & sesame sauce tableside.",
    "category": "bbq",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Egg",
      "Peanut",
      "Nut",
      "Onion"
    ],
    "details": "Section: BBQ. Ingredients: Duck Maltose Vinegar Egg. Portion: 6 lb / duck. Accompaniments: Duck sauce mixed with sesame & peanut sauce (Duck sauce: sweet bean sauce, honey, chicken powder, sesame oil, Chinese yellow wine, sugar) Cane sugar Cucumber & scallion.",
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80",
    "price": 128.0
  },
  {
    "id": "peking-style-spicy-crispy-duck-rack",
    "name": "Peking Style Spicy Crispy Duck Rack",
    "description": "The remainder of duck from the whole Peking duck can be wok fried with chili and garlic.",
    "category": "bbq",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Gluten",
      "Sesame",
      "Soy",
      "Onion",
      "Garlic",
      "Capsaicin"
    ],
    "details": "Section: BBQ. Ingredients: Chopped duck Soy sauce Spring onion Chilis Garlic.",
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80",
    "price": 22.0
  },
  {
    "id": "barbecue-pluma-iberico-pork-yellow-mountain-honey",
    "name": "Barbecue Pluma Iberico Pork, Yellow Mountain Honey",
    "description": "Pluma iberico marinated pork is roasted, then coated with honey",
    "category": "bbq",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Egg",
      "Fish",
      "Shellfish",
      "Pork",
      "Onion",
      "Garlic",
      "Coriander",
      "Potato"
    ],
    "details": "Section: BBQ. Ingredients:. Acorn fed, free range Ib\u00e9rico pork pluma Hoisin sauce Minced shallot Ground bean sauce Coriander Oyster sauce Potato starch Sugar Maltose Chicken powder Ketchup Egg Minced garlic. Portion: 12-14 pcs.",
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80",
    "price": 48.0
  },
  {
    "id": "minced-duck-fried-rice",
    "name": "Minced Duck Fried Rice",
    "description": "Crispy fried rice with minced duck, asparagus and green onion",
    "category": "bbq",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Egg",
      "Soy",
      "Onion"
    ],
    "details": "Section: BBQ. Ingredients: Minced Duck, crispy asparagus, egg, green onion Minced Duck, crispy rice, asparagus, egg, green onion. Portion: rice,. Price not listed in PDF; confirm current market price before service.",
    "image": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80",
    "price": 0
  },
  {
    "id": "traditional-iberico-pork-shanghainese-soup-dumplings",
    "name": "Traditional Iberico Pork Shanghainese Soup Dumplings",
    "description": "Steamed dumpling filled with hot soup and Iberico pork.",
    "category": "steamed-dim-sum",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Gluten",
      "Wheat",
      "Sesame",
      "Soy",
      "Pork",
      "Onion",
      "Gelatine"
    ],
    "details": "Section: Steamed Dim Sum. Ingredients: Iberico pork *All Pork belly Dark soy sauce *High gluten flour Chinese yellow wine Scallion Sesame oil Ginger Unflavored gelatine Salt Chicken powder Sugar. Portion: - purpose flour 4 pcs. Accompaniments: Dark rice vinegar(from Shanghai) with shredded ginger.",
    "image": "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80",
    "price": 13.0
  },
  {
    "id": "hot-sour-iberico-pork-shanghainese-soup-dumplings",
    "name": "Hot & Sour Iberico Pork Shanghainese Soup Dumplings",
    "description": "Steamed dumpling filled with hot & sour and Iberico pork. Color-Orange from the carrot.",
    "category": "steamed-dim-sum",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Gluten",
      "Sesame",
      "Soy",
      "Pork",
      "Onion",
      "Capsaicin",
      "Carrot",
      "Gelatine"
    ],
    "details": "Section: Steamed Dim Sum. Ingredients: Iberico pork All Pork belly Dark soy sauce High Chinese yellow wine Carrot Scallion Sesame oil Ginger Unflavored gelatine Salt Chili powder Chili Chicken powder Ground white powder Sugar Chili bean sauce Dark vinegar. Portion: - purpose flour 4 pcs gluten flour. Accompaniments: Dark rice vinegar(from Shanghai) with shredded ginger.",
    "image": "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80",
    "price": 14.0
  },
  {
    "id": "soft-quail-egg-iberico-pork-black-truffle-siu-mai",
    "name": "Soft Quail Egg, Iberico Pork, Black Truffle Siu Mai",
    "description": "Steamed Siu Mai filled with soft quail egg, pork, shrimp and a little mushroom. Topped with black truffle.",
    "category": "steamed-dim-sum",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Egg",
      "Fish",
      "Shellfish",
      "Sesame",
      "Mushroom",
      "Pork",
      "Potato"
    ],
    "details": "Section: Steamed Dim Sum. Ingredients: Black truffle All Sesame oil Quail egg Iberico pork Potato starch Shrimp Shiitake mushroom Sugar Chicken powder. Portion: - purpose flour 2 pcs.",
    "image": "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80",
    "price": 14.0
  },
  {
    "id": "crispy-sugar-coated-bbq-iberico-pork-bun",
    "name": "Crispy Sugar Coated BBQ Iberico Pork Bun",
    "description": "Baked sugar-coated bun filled with BBQ pork.",
    "category": "baked-fried",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Dairy",
      "Egg",
      "Fish",
      "Shellfish",
      "Sesame",
      "Soy",
      "Pork",
      "Onion",
      "Pepper",
      "Potato",
      "Gelatine"
    ],
    "details": "Section: Baked & Fried. Ingredients: Iberico pork Ground white Butter pepper Sugar Milk Unflavored gelatine Potato starch All Sugar Corn starch Egg white Chicken powder Shallot Dark soy sauce Onion Light soy sauce Ginger Oyster sauce Sesame oil. Portion: 3 pcs powder - purpose flour.",
    "image": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    "price": 13.0
  },
  {
    "id": "shredded-peking-duck-mushroom-spring-roll",
    "name": "Shredded Peking Duck, Mushroom Spring Roll",
    "description": "Deep fried spring roll filled with shredded peking duck, carrot, shiitake mushroom.",
    "category": "baked-fried",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Wheat",
      "Mushroom",
      "Potato",
      "Carrot"
    ],
    "details": "Section: Baked & Fried. Ingredients: Shredded duck High gluten flour Mushroom Potato starch Carrot Chicken powder Salt Sugar. Portion: 3 rolls cut into 6 small pcs. Accompaniments: Worcestershire sauce.",
    "image": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    "price": 14.0
  },
  {
    "id": "vegan-shanghainese-soup-dumplings-minced-pork-tofu",
    "name": "Vegan Shanghainese Soup Dumplings, Minced \"Pork\", Tofu",
    "description": "Steam Vegan soup dumpling, Vegan \u2018pork\u2019",
    "category": "baked-fried",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Sesame"
    ],
    "details": "Section: Baked & Fried. Ingredients: Bean Flowers. Portion: 4 pcs. Accompaniments: Ginger vinegar. Price not listed in PDF; confirm current market price before service.",
    "image": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    "price": 0
  },
  {
    "id": "garoupa-chopped-chili-prawn-vegetable-dumpling",
    "name": "Garoupa, Chopped Chili, Prawn, Vegetable Dumpling",
    "description": "Steam Dumpling fill with fish, shrimp, vegetable. Top with chili",
    "category": "baked-fried",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Fish",
      "Seafood",
      "Shellfish",
      "Sesame",
      "Nut",
      "Potato"
    ],
    "details": "Section: Baked & Fried. Ingredients: Fish Potato starch Shrimp Vegetable (choy sum) Scallop. Portion: 4pcs.",
    "image": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    "price": 22.0
  },
  {
    "id": "scallop-dumplings-spinach-prawn-caviar",
    "name": "Scallop Dumplings Spinach, Prawn, Caviar",
    "description": "Steam Dumpling with Shrimp slices scallop, top with Caviar",
    "category": "baked-fried",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Wheat",
      "Fish",
      "Seafood",
      "Shellfish",
      "Sesame",
      "Pork",
      "Potato"
    ],
    "details": "Section: Baked & Fried. Ingredients: Shrimp Wheat starch Scallop Potato starch Caviar Color from Spinach Lard. Portion: 3 pcs.",
    "image": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    "price": 24.0
  },
  {
    "id": "wild-mushroom-spring-roll",
    "name": "Wild Mushroom Spring Roll",
    "description": "Deep Fried spring roll with Mushroom, carrot, cabbage.",
    "category": "baked-fried",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Wheat",
      "Mushroom",
      "Potato",
      "Carrot"
    ],
    "details": "Section: Baked & Fried. Ingredients: Mushroom High gluten flour Carrot Potato starch Cabbage. Portion: 3 pcs.",
    "image": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    "price": 13.0
  },
  {
    "id": "marinated-cucumber-and-garlic",
    "name": "Marinated Cucumber and Garlic",
    "description": "Diced cucumber marinated in vinegar and sesame oil.",
    "category": "starters",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Gluten",
      "Sesame",
      "Soy",
      "Garlic",
      "Capsaicin"
    ],
    "details": "Section: Starters. Ingredients: Cucumber Minced garlic Dark vinegar Sesame oil Sugar Soy sauce Chili oil.",
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    "price": 9.0
  },
  {
    "id": "sesame-prawn-toast-autumn-sauce",
    "name": "Sesame Prawn Toast, Autumn Sauce",
    "description": "Shrimp paste with white toast deep fried",
    "category": "starters",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Gluten",
      "Fish",
      "Shellfish",
      "Sesame",
      "Garlic",
      "Capsaicin",
      "Cilantro"
    ],
    "details": "Section: Starters. Ingredients: Shrimp Paste Toast Cilantro Chili bean sauce Ketchup (in the sauce) Garlic(in the sauce) Gluten(in the sauce) Sesame. Portion: 4 pcs.",
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    "price": 18.0
  },
  {
    "id": "shredded-peking-duck-salad-beetroot-crispy-taro-citrus-truffle-d",
    "name": "Shredded Peking Duck Salad, Beetroot,Crispy Taro,Citrus Truffle Dressing",
    "description": "Mixed green salad tossed in yuzu vinegar and black truffle oil, topped with shredded duck.",
    "category": "starters",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Sesame",
      "Nut",
      "Garlic",
      "Citrus"
    ],
    "details": "Section: Starters. Ingredients: Mixed green Pickle Garlic Shredded duck Taro Truffle oil Japanese waf u salad dressing(sesame, citrus).",
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    "price": 24.0
  },
  {
    "id": "cold-free-range-chicken-coriander-black-truffle",
    "name": "Cold Free Range Chicken, Coriander, Black Truffle",
    "description": "Poached free range chicken tossed with truffle sauce, truffle oil, deep fried sliced shallot and coriander.",
    "category": "starters",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Mushroom",
      "Onion",
      "Cilantro",
      "Coriander"
    ],
    "details": "Section: Starters. Ingredients: Poached chicken Cilantro Chicken powder Truffle oil Truffle paste Deep fried sliced shallot.",
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    "price": 20.0
  },
  {
    "id": "jellyfish-black-fungus-black-vinegar",
    "name": "Jellyfish, Black Fungus, Black Vinegar",
    "description": "Black vinegar marinated Jellyfish with Wood-ear mushroom and cucumber",
    "category": "starters",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Fish",
      "Seafood",
      "Mushroom",
      "Cilantro"
    ],
    "details": "Section: Starters. Ingredients: Jellyfish Cucumber Wood-ear Fungus Black vinegar Cilantro.",
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    "price": 28.0
  },
  {
    "id": "crispy-air-dried-angus-beef-szechuan-peppercorn-sesame",
    "name": "Crispy Air-Dried Angus Beef, Szechuan Peppercorn, Sesame",
    "description": "Deep fried air-dried angus beef with Szechuan numbing syrup with sesame seed",
    "category": "starters",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Gluten",
      "Sesame",
      "Soy",
      "Pepper",
      "Capsaicin"
    ],
    "details": "Section: Starters. Ingredients: Angus beef Szechuan peppercorn Sugar Sesame seed Soy.",
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    "price": 18.0
  },
  {
    "id": "crispy-sea-bass-salt-and-pepper",
    "name": "Crispy sea Bass, Salt and Pepper",
    "description": "Deep fried sea bass with salt and pepper",
    "category": "starters",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Seafood",
      "Sesame",
      "Garlic",
      "Pepper",
      "Potato"
    ],
    "details": "Section: Starters. Ingredients: Sea bass Pepper Potato starch Garlic Sesame.",
    "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    "price": 30.0
  },
  {
    "id": "buddha-jumps-over-the-wall",
    "name": "Buddha Jumps Over the Wall",
    "description": "Double boiled soup with abalone, Japanese sea cucumber, fish maw, bamboo pith, sea conch, conpoy.",
    "category": "soups",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Fish",
      "Shellfish",
      "Mushroom",
      "Pork"
    ],
    "details": "Section: Soups. Ingredients: Japanese s ea cucumber Abalone Bamboo pith Sea conch fish maw Black chicken *Dry Scallops. Portion: Per Person.",
    "image": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    "price": 198.0
  },
  {
    "id": "hot-sour-soup-assorted-seafood",
    "name": "Hot & Sour Soup, Assorted Seafood",
    "description": "Diced seafood, shredded Chinese fungus and bamboo pith. Creamy soup.",
    "category": "soups",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Gluten",
      "Egg",
      "Fish",
      "Shellfish",
      "Mushroom",
      "Capsaicin",
      "Pepper"
    ],
    "details": "Section: Soups. Ingredients: Fish Scallop Vinegar Shrimp Chili Chili bean sauce Shredded black fungus Shredded bamboo shoot Shredded shiitake mushroom Shredded bamboo pith White Pepper. Portion: Per Person.",
    "image": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    "price": 14.0
  },
  {
    "id": "double-boiled-pearl-meat-soup-silky-fowl-matsutake-mushroom",
    "name": "Double Boiled Pearl Meat Soup, Silky Fowl, Matsutake Mushroom",
    "description": "Double boiled silky fowl soup with pearl meat, snow fungus and matsutake mushrooms.",
    "category": "soups",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Fish",
      "Shellfish",
      "Mushroom",
      "Pork"
    ],
    "details": "Section: Soups. Ingredients: Silky fowl Pearl meat Pork Matsutake mushroom Snow fungus Black chicken Dry Conch. Portion: Per Person.",
    "image": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    "price": 35.0
  },
  {
    "id": "fish-maw-double-boiled-fish-bone-broth-bamboo-pith",
    "name": "Fish Maw, Double Boiled Fish Bone Broth, Bamboo Pith",
    "description": "Fish maw, bamboo pith, sea conch",
    "category": "soups",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Fish",
      "Shellfish",
      "Mushroom",
      "Pork"
    ],
    "details": "Section: Soups. Ingredients:. Fish maw Sea conch Black chicken Bamboo pith Pork. Portion: Per Person.",
    "image": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    "price": 68.0
  },
  {
    "id": "shrimp-wonton-soup",
    "name": "Shrimp Wonton Soup",
    "description": "Review menu matrix for description.",
    "category": "soups",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Fish",
      "Mushroom",
      "Pork",
      "Onion",
      "Shellfish"
    ],
    "details": "Section: Soups. Ingredients: Shrimp wonton Pork Spring onion Chicken broth Shrimp roe Shiitake Mushroom Fish(in broth). Portion: 4 pcs.",
    "image": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    "price": 12.0
  },
  {
    "id": "morel-assorted-mushroom-asparagus-soup",
    "name": "Morel, Assorted Mushroom, Asparagus Soup",
    "description": "Review menu matrix for description.",
    "category": "soups",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Mushroom",
      "Carrot"
    ],
    "details": "Section: Soups. Ingredients: Carrot Asparagus Morel mushroom Tofu Gluten. Portion: Per Person.",
    "image": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    "price": 16.0
  },
  {
    "id": "double-boiled-birds-nest-supreme-soup",
    "name": "Double Boiled, Birds Nest, Supreme Soup",
    "description": "Double boiled bird's nest supreme soup.",
    "category": "birds-nest",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Pork"
    ],
    "details": "Section: Birds Nest. Ingredients: Bird's nest Chicken & Pork soup Choy Sum. Portion: Per person.",
    "image": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    "price": 88.0
  },
  {
    "id": "birds-nest-soup-chicken-broth-yunnan-ham",
    "name": "Birds Nest Soup, Chicken Broth, Yunnan Ham",
    "description": "Double boiled bird's nest supreme soup with Yunnan ham, garnished with choy sum.",
    "category": "birds-nest",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Soy",
      "Pork"
    ],
    "details": "Section: Birds Nest. Ingredients: Bird's nest Chicken & Pork soup Choy sum / Chinese broccoli Soy Sauce. Portion: Per person.",
    "image": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    "price": 88.0
  },
  {
    "id": "braised-whole-japanese-dried-abalone-oyster-sauce-38g-dried",
    "name": "Braised Whole Japanese Dried Abalone, Oyster Sauce (38g dried)",
    "description": "Braised Japanese dried abalone served in oyster sauce.",
    "category": "abalone",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Fish",
      "Shellfish",
      "Pork"
    ],
    "details": "Section: Abalone. Ingredients: Abalone Oyster sauce Broccoli. Portion: 16-Head abalone (38 g).",
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    "price": 398.0
  },
  {
    "id": "braised-whole-japanese-dried-abalone-oyster-sauce-24g-dried",
    "name": "Braised Whole Japanese Dried Abalone, Oyster Sauce (24g dried)",
    "description": "Braised Japanese dried abalone served in oyster sauce.",
    "category": "abalone",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Fish",
      "Shellfish",
      "Pork"
    ],
    "details": "Section: Abalone. Ingredients: Abalone Oyster sauce Broccoli. Portion: 20-Head abalone (24 g).",
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    "price": 260.0
  },
  {
    "id": "whole-south-african-abalone-oyster-sauce-100g-dried",
    "name": "Whole South African Abalone, Oyster Sauce (100g dried)",
    "description": "Braised South African dried abalone served in oyster sauce.",
    "category": "abalone",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Fish",
      "Shellfish",
      "Pork"
    ],
    "details": "Section: Abalone. Ingredients: Abalone Oyster sauce Broccoli. Portion: 6-Head dried abalone (100 g).",
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    "price": 228.0
  },
  {
    "id": "braised-south-african-abalone-oyster-sauce-30g-dried",
    "name": "Braised South African Abalone, Oyster Sauce (30g dried)",
    "description": "Braised South African dried abalone served in oyster sauce.",
    "category": "abalone",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Fish",
      "Shellfish",
      "Pork"
    ],
    "details": "Section: Abalone. Ingredients: Abalone Oyster sauce Broccoli. Portion: 20-Head abalone (30 g).",
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    "price": 98.0
  },
  {
    "id": "braised-whole-japanese-sea-cucumber-oyster-sauce",
    "name": "Braised Whole Japanese Sea Cucumber, Oyster Sauce",
    "description": "Braised whole Japanese sea cucumber in oyster sauce, topped with shrimp roe.",
    "category": "abalone",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Fish",
      "Shellfish",
      "Pork",
      "Onion"
    ],
    "details": "Section: Abalone. Ingredients: Sea cucumber Oyster sauce Shrimp roe Leek Sugar Snap Pea. Portion: 50-Head (12 g).",
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    "price": 68.0
  },
  {
    "id": "whole-leopard-coral-garoupa-steamed-with-ginger",
    "name": "Whole Leopard Coral Garoupa, Steamed with Ginger",
    "description": "Steamed whole Garoupa with ginger and spring onion, served with soy sauce. SOURCED FROM AUSTRALIA",
    "category": "market-seafood",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Gluten",
      "Soy",
      "Onion",
      "Cilantro"
    ],
    "details": "Section: Market Seafood. Ingredients: Leopard Coral Garoupa Shredded ginger Spring onion. Accompaniments: Soy Sauce. Price not listed in PDF; confirm current market price before service.",
    "image": "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80",
    "price": 0
  },
  {
    "id": "wok-fried-maine-lobster-ginger-scallion",
    "name": "Wok Fried Maine Lobster, Ginger & Scallion",
    "description": "Wok fried whole lobster with scallion and ginger.",
    "category": "market-seafood",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Fish",
      "Shellfish",
      "Onion"
    ],
    "details": "Section: Market Seafood. Ingredients: Maine lobster Scallion Ginger. Portion: 1.5 lb / pc.",
    "image": "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80",
    "price": 58.0
  },
  {
    "id": "signature-lobster-ma-po-tofu",
    "name": "Signature Lobster Ma Po Tofu",
    "description": "Whole lobster with Ma Po Tofu. (Boston Lobster)",
    "category": "market-seafood",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Gluten",
      "Fish",
      "Shellfish",
      "Sesame",
      "Soy",
      "Onion",
      "Garlic",
      "Capsaicin",
      "Pepper"
    ],
    "details": "Section: Market Seafood. Ingredients: Maine lobster Minced garlic Red bell pepper Chili bean sauce Spring onion Chili oil Sesame Soy Sauce. Portion: 1.5 lb / pc.",
    "image": "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80",
    "price": 68.0
  },
  {
    "id": "fresh-whole-crab-golden-garlic-chili",
    "name": "Fresh Whole Crab, Golden Garlic, Chili",
    "description": "Wok fried whole crab with garlic and chili",
    "category": "market-seafood",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Gluten",
      "Fish",
      "Shellfish",
      "Sesame",
      "Onion",
      "Garlic",
      "Capsaicin"
    ],
    "details": "Section: Market Seafood. Ingredients: Dungeness crab Fried garlic Shallot Dried chili Minced garlic Chili Spring onion Black Bean. Portion: 2 lbs.",
    "image": "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80",
    "price": 78.0
  },
  {
    "id": "whole-alaskan-king-crab-2-ways-crab-body-fried-with-golden-garli",
    "name": "Whole Alaskan King Crab 2 ways Crab Body Fried with Golden Garlic & Chili / Salt & Pepper Crab Legs Steamed with Egg White & Hwa Tiao / Minced Garlic & Bean Vermicelli",
    "description": "Review menu matrix for description.",
    "category": "market-seafood",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Egg",
      "Fish",
      "Shellfish",
      "Sesame",
      "Garlic",
      "Capsaicin"
    ],
    "details": "Section: Market Seafood. Ingredients: Alaskan King Crab. Price not listed in PDF; confirm current market price before service.",
    "image": "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80",
    "price": 0
  },
  {
    "id": "whole-marble-goby-deep-fried-steamed-with-soy-sauce",
    "name": "Whole Marble Goby (Deep Fried / Steamed with Soy Sauce)",
    "description": "It can be deep fried with garlic / Scallions SOURCED FROM VIETNAM",
    "category": "market-seafood",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Gluten",
      "Soy",
      "Garlic",
      "Cilantro"
    ],
    "details": "Section: Market Seafood. Ingredients: Marble Goby. Portion: **It's a suggested dish by the chef, giving more choice to the guest when they are looking for a live fish..",
    "image": "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80",
    "price": 148.0
  },
  {
    "id": "australian-lobster-steam-with-garlic-ginger-scallion-salt-pepper",
    "name": "Australian Lobster (Steam with Garlic, Ginger scallion, Salt & Pepper)",
    "description": "Steam Whole Australian Lobster with Ginger Scallion Or Work Fried Ginger scallion Or Light breaded Deep Fried with Salt & Pepper Garlic Plain Steam with Soy sauce no garlic",
    "category": "market-seafood",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Soy",
      "Garlic",
      "Potato",
      "Onion"
    ],
    "details": "Section: Market Seafood. Ingredients: Garlic Scallion Soy Gluten Ginger Potato starch. Portion: Allergy depend on the style of cooking. Price not listed in PDF; confirm current market price before service.",
    "image": "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80",
    "price": 0
  },
  {
    "id": "santa-barbara-prawns-poached-steam-with-garlic-salt-pepper",
    "name": "Santa Barbara Prawns (Poached/ Steam with Garlic/ Salt & Pepper)",
    "description": "Steam with garlic (butterfly style) Poached served with soy on the side Deep fried with garlic, salt & pepper",
    "category": "market-seafood",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Sesame",
      "Soy",
      "Garlic",
      "Pepper",
      "Onion"
    ],
    "details": "Section: Market Seafood. Ingredients: Garlic, soy, scallion Soy Salt, pepper, sesame,. Price not listed in PDF; confirm current market price before service.",
    "image": "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80",
    "price": 0
  },
  {
    "id": "signature-smoked-black-cod",
    "name": "Signature Smoked Black Cod",
    "description": "Marinated black cod, deep fried, then flavor Chinese 5 spice",
    "category": "fresh-seafood",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Soy"
    ],
    "details": "Section: Fresh Seafood. Ingredients: marinate d again for e (soy sauce, rice sugar,).. Portion: Black cod xtra Soy sauce Sugar Chinese 5 spice Vinegar Egg. Accompaniments: 8 pcs Gluten (soy sauce batter) 5 spice (star anise Cinnamon Geranium leaves) Vinegar Egg.",
    "image": "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80",
    "price": 42.0
  },
  {
    "id": "poached-mandarin-fish-fillet-szechuan-pepper-broth",
    "name": "Poached Mandarin Fish Fillet Szechuan Pepper Broth",
    "description": "Poach mandarin fish fillet with S zechuan Szechuan",
    "category": "fresh-seafood",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Pepper",
      "Capsaicin"
    ],
    "details": "Section: Fresh Seafood. Ingredients: chili broth, topped with peppercorn oil.. Portion: Mandarin fish fillet Chinese celery Potato vermicelli Bean sprout Pickled cabbage Dried chili Enoki Mushrooms Szechuan peppercorn Minced garlic Szechuan Peppercorn Oil Celery. Accompaniments: Mushroom (enoki mushroom) Capsa icin Garlic Potato.",
    "image": "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80",
    "price": 42.0
  },
  {
    "id": "grilled-black-cod-sauce",
    "name": "Grilled Black Cod Sauce",
    "description": ", Sweet Miso Pan fr serve",
    "category": "fresh-seafood",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [],
    "details": "Section: Fresh Seafood. Ingredients: ied Black Cod, then bake d with miso sauce on the side.. Portion: d, Black Cod Soy sauce Japanese soy bean paste Mirin Honey. Accompaniments: 2 pcs Gluten (soy sauce miso sauce) Honey.",
    "image": "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80",
    "price": 48.0
  },
  {
    "id": "crispy-pacific-ocean-prawn-salty-egg",
    "name": "Crispy Pacific Ocean Prawn, Salty Egg",
    "description": "Breaded and deep stir - Topped with deep fried",
    "category": "fresh-seafood",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Egg"
    ],
    "details": "Section: Fresh Seafood. Ingredients: - fried prawns fried wi th salty egg paste. Kale. Portion: Prawn Salty egg yolk paste B utter Sesame(garnish). Accompaniments: 6 pcs Gluten (batter) Shellfish Egg Dairy Sesame(garnish).",
    "image": "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80",
    "price": 38.0
  },
  {
    "id": "wok-fried-sliced-scallop-mixed-fungus-black-truffle-paste",
    "name": "Wok Fried Sliced Scallop, Mixed Fungus, Black Truffle Paste",
    "description": "Wok fried truffle sauce, asparagus.",
    "category": "fresh-seafood",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Shellfish"
    ],
    "details": "Section: Fresh Seafood. Ingredients: sliced scallops with. Portion: Scallop Sliced truffle Truffle paste Truffle Oil Asparagus bell pepper Minced garlic Spring onion Mushroom. Accompaniments: 5-6 pcs of Shellfish scallop Mushroom (mushroom & truffle) Onion Garlic.",
    "image": "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80",
    "price": 48.0
  },
  {
    "id": "king-prawn-black-pepper-garlic-soya-sauce",
    "name": "King Prawn, Black Pepper, Garlic, Soya Sauce",
    "description": "Wok fried king prawn with black pepper and fresh peppercorn, served in a clay pot.",
    "category": "clay-pot",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Gluten",
      "Fish",
      "Shellfish",
      "Soy",
      "Onion",
      "Garlic"
    ],
    "details": "Section: Clay Pot. Portion: Prawns Spring onion Sliced garlic F resh peppercorn Ground black pepper Soy sauce.",
    "image": "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=800&q=80",
    "price": 38.0
  },
  {
    "id": "alaskan-king-crab-casserole-crab-roe-vermicelli",
    "name": "Alaskan King Crab Casserole, Crab Roe, Vermicelli",
    "description": "Wok fried Alaskan king crab meat, fish roe and shrimp roe with bean vermicelli. Served in a clay pot.",
    "category": "clay-pot",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Fish",
      "Seafood",
      "Shellfish",
      "Mushroom",
      "Cilantro"
    ],
    "details": "Section: Clay Pot. Ingredients: flying. Portion: Green bean vermicelli King Crab meat Enoki mushroom Flying fish roe Shrimp roe Diced coriander *Spring Onion.",
    "image": "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=800&q=80",
    "price": 45.0
  },
  {
    "id": "japanese-wagyu-beef-a5-grilled-leeks-homemade-black-bean-paste-g",
    "name": "Japanese Wagyu Beef A5+, Grilled Leeks, Homemade Black Bean Paste, Garlic Chips",
    "description": "Review menu matrix for description.",
    "category": "meat",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Mushroom",
      "Garlic",
      "Onion"
    ],
    "details": "Section: Meat. Ingredients: Grade A5 Japanese wag yu beef served with grilled leeks in a homemade black bean paste and white mushroom, sweet beans and garnished with garlic chips.. Portion: A5 Japanese wagyu Scallion Snap Peas Chili bean sauce Fried Garlic Chips Leek.",
    "image": "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80",
    "price": 188.0
  },
  {
    "id": "stir-fried-australian-wagyu-m6-sirloin-shiitake-mushrooms-baby-l",
    "name": "Stir Fried Australian Wagyu M6+ Sirloin, Shiitake Mushrooms, Baby Leeks, Chili",
    "description": "Review menu matrix for description.",
    "category": "meat",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Mushroom",
      "Pepper",
      "Onion"
    ],
    "details": "Section: Meat. Ingredients: Wok fried, cubed Australian wagyu M9+ sirloin with assorted mushrooms, asparagus, shallot and shishito pepper.. Portion: Australian wagyu M Asparagus Chili bean sauce, chili shallot shishito pepper Minced garlic Minced chili Ground black pepper Soy sauce.",
    "image": "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80",
    "price": 68.0
  },
  {
    "id": "crispy-triple-cooked-wagyu-beef-short-rib",
    "name": "Crispy Triple Cooked Wagyu Beef Short Rib",
    "description": "Review menu matrix for description.",
    "category": "meat",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Sesame",
      "Onion",
      "Pepper"
    ],
    "details": "Section: Meat. Ingredients: Triple cooked (1st: pan-fried, 2nd: braised, last: baked) beef rib, served in a Chinese gravy. Topped with sesame, onion, red pepper.. Portion: Beef Short rib Diced onion Chinese Chopped dried chili Ginger Sesame Sugar Soy sauce Chicken powder Garlic..",
    "image": "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80",
    "price": 88.0
  },
  {
    "id": "wok-fried-angus-beef-broccoli",
    "name": "Wok Fried Angus Beef, Broccoli",
    "description": "Review menu matrix for description.",
    "category": "meat",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [],
    "details": "Section: Meat. Ingredients: Wok fried broccoli with sliced angus beef. Portion: Broccoli Angus beef Chicken powder Dried chilis Shiitake Mushroom Soy Sauce Sugar Oyster Sauce Garlic.",
    "image": "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80",
    "price": 32.0
  },
  {
    "id": "free-range-chicken-dried-chillies-szechuan-red-peppercorns",
    "name": "Free Range Chicken, Dried Chillies, Szechuan Red Peppercorns",
    "description": "Review menu matrix for description.",
    "category": "meat",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Nut",
      "Pepper",
      "Capsaicin"
    ],
    "details": "Section: Meat. Ingredients: Wok fried free range chicken mixed with dried chilli, Szechuan red peppercorn and cashew nuts.. Portion: Chicken thigh Dried chili Dried Szechuan peppercorn Sliced garlic Diced spring onion Cashew nut Peppercorn oil.",
    "image": "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80",
    "price": 32.0
  },
  {
    "id": "general-tso-s-chicken",
    "name": "General Tso's Chicken",
    "description": "Review menu matrix for description.",
    "category": "meat",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [],
    "details": "Section: Meat. Ingredients: Wok fried chicken with spicy & sweet sauce.. Portion: Chicken (white meat breaded) Sugar Chili Vinegar Dried chili Flour.",
    "image": "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80",
    "price": 28.0
  },
  {
    "id": "bamboo-charcoal-grilled-lamb-rack-black-pepper",
    "name": "Bamboo Charcoal Grilled Lamb rack, Black Pepper",
    "description": "Review menu matrix for description.",
    "category": "meat",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [],
    "details": "Section: Meat. Ingredients: Grilled lamb rack black paper with edible bamboo charcoal. Portion: Lam rack Black pepper Soy Garlic Flour Ketchup.",
    "image": "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80",
    "price": 68.0
  },
  {
    "id": "free-range-chicken-thai-basil-three-cup-sauce",
    "name": "Free Range Chicken, Thai Basil, Three Cup Sauce",
    "description": "Review menu matrix for description.",
    "category": "meat",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Sesame",
      "Soy"
    ],
    "details": "Section: Meat. Ingredients: Free Range chicken in three cup sauce(Soy, Sesame oil, cooking wine) with Thai basil. Portion: Free Range chicken Three cup sauce Thai basil.",
    "image": "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80",
    "price": 30.0
  },
  {
    "id": "crispy-vegan-chicken-szechuan-red-peppercorns-sauteed-dried-chil",
    "name": "Crispy Vegan Chicken, Szechuan Red Peppercorns, Sauteed Dried Chili, Cashew Nuts",
    "description": "Review menu matrix for description.",
    "category": "meat",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Nut",
      "Pepper",
      "Capsaicin"
    ],
    "details": "Section: Meat. Ingredients: Wok fried Vegan chicken mixed with dried chilli, Szechuan red peppercorn and cashew nuts.. Portion: Dried chili Dried Szechuan peppercorn Sliced garlic Diced spring onion Cashew nut Peppercorn oil Tofu. Price not listed in PDF; confirm current market price before service.",
    "image": "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80",
    "price": 0
  },
  {
    "id": "sauteed-asparagus-jicama",
    "name": "Sauteed Asparagus, Jicama",
    "description": ", Ginkgo Nuts Saut\u00e9ed asparagus, black fungus.",
    "category": "vegetables",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Nut",
      "Mushroom"
    ],
    "details": "Section: Vegetables. Ingredients: Jicama, Ginkgo nuts and. Portion: Asparagus Jicama Ginkgo nut Black fungus.",
    "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    "price": 20.0
  },
  {
    "id": "braised-eggplant-minced-pork-chili-peppers",
    "name": "Braised Eggplant, Minced Pork, Chili Peppers",
    "description": "Braised eggplant stir fried with minced pork, salty fish paste. Topped with spring onion.",
    "category": "vegetables",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Gluten",
      "Fish",
      "Seafood",
      "Soy",
      "Pork",
      "Garlic",
      "Capsaicin"
    ],
    "details": "Section: Vegetables. Portion: Eggplant Minced pork Salty fish paste Minced garlic Diced ginger Red bell pepper Chili bean sauce Chiu hou sauce (made by soy bean, sesame, light soy sauce).",
    "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    "price": 20.0
  },
  {
    "id": "wok-fried-chinese-broccoli-minced-pork",
    "name": "Wok Fried Chinese Broccoli, Minced Pork",
    "description": ", Minced Wok fried Chinese broccoli served in a sizzling clay pot.",
    "category": "vegetables",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Fish",
      "Shellfish",
      "Pork",
      "Garlic",
      "Pepper"
    ],
    "details": "Section: Vegetables. Ingredients: with minced pork. Portion: Chinese broccoli Minced garlic Minced pork.",
    "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    "price": 20.0
  },
  {
    "id": "sauteed-string-beans-diced-australian-wagyu-beef-preserved-olive",
    "name": "Sauteed String Beans, Diced Australian Wagyu Beef, Preserved Olive Leaf",
    "description": "Saut\u00e9ed string beans with diced wagyu beef, topped with sliced red bell pepper.",
    "category": "vegetables",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Gluten",
      "Soy",
      "Garlic",
      "Capsaicin",
      "Onion"
    ],
    "details": "Section: Vegetables. Portion: String bean Diced wagyu beef Minced garlic Minced shallot Diced dried chili Preserved Olive.",
    "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    "price": 22.0
  },
  {
    "id": "braised-tofu-morel-mushrooms",
    "name": "Braised Tofu, Morel Mushrooms",
    "description": "Mushrooms Braised bean curd garnished with choy sum.",
    "category": "vegetables",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Fish",
      "Shellfish",
      "Mushroom"
    ],
    "details": "Section: Vegetables. Ingredients: with n, Shitak e mushroom,. Portion: Tofu Morel mushroom Choy sum Edamame Oyster sauce.",
    "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    "price": 28.0
  },
  {
    "id": "wok-fried-baby-napa-cabbage-baby-beans-xo-sauce",
    "name": "Wok Fried Baby Napa Cabbage, Baby Beans, XO Sauce",
    "description": "Wok fried baby cabbage with pork oil and XO sauce, then topped with honey beans.",
    "category": "vegetables",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Fish",
      "Shellfish",
      "Onion",
      "Garlic"
    ],
    "details": "Section: Vegetables. Portion: Baby napa cabbage XO sauce (made by dried scallops, shrimp, chili peppers, onions, garlic) Honey bean Lard Pork Sakura Shrimp.",
    "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    "price": 20.0
  },
  {
    "id": "wok-fried-baby-bok-choy-garlic",
    "name": "Wok Fried Baby Bok Choy, Garlic",
    "description": "with Garlic Wok-fried baby bok choy with garlic",
    "category": "vegetables",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Garlic"
    ],
    "details": "Section: Vegetables. Portion: Baby Bok Choy Garlic.",
    "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    "price": 22.0
  },
  {
    "id": "wok-fried-snow-pea-tips-minced-garlic",
    "name": "Wok-Fried Snow Pea Tips, Minced Garlic",
    "description": "Wok-fired snow pea tips with garlic",
    "category": "vegetables",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Garlic"
    ],
    "details": "Section: Vegetables. Portion: Snow pea tips Garlic.",
    "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    "price": 30.0
  },
  {
    "id": "signature-maine-lobster-fried-rice-king-oyster-mushrooms-edamame",
    "name": "Signature Maine Lobster Fried Rice, King Oyster Mushrooms, Edamame",
    "description": "Fried rice with mushroom s, edamame. Served in a clay pot.",
    "category": "rice-noodles",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Mushroom"
    ],
    "details": "Section: Rice & Noodles. Ingredients: Boston lobster, assorted. Portion: Maine lobster assorted Edamame Lobster oil Spring onion White rice Minced garlic Diced ginger Diced coriander Diced Chinese celery. Accompaniments: Gluten (oyster sauce), s Mushroom Shellfish (lobster & oyster sauce) Onion Ginger Cilantro Garlic.",
    "image": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    "price": 68.0
  },
  {
    "id": "fried-rice-diced-prawn-iberico-pork-asparagus-in-yeung-chow-styl",
    "name": "Fried Rice, Diced Prawn, Iberico Pork, Asparagus in Yeung Chow Style",
    "description": "Fried rice with diced prawn, diced char siu, egg and asparagus",
    "category": "rice-noodles",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [],
    "details": "Section: Rice & Noodles. Portion: Diced BBQ iberico pork Diced prawn Asparagus Egg Soy sauce White rice Chicken powder. Accompaniments: Gluten(soy sauce, BBQ pork) Pork Shellfish Egg (chicken powder).",
    "image": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    "price": 24.0
  },
  {
    "id": "alaskan-crabmeat-fried-rice-flying-fish-roe",
    "name": "Alaskan Crabmeat Fried Rice, Flying Fish Roe",
    "description": "Fried rice with Alaskan crabmeat, scallops, egg white onion. Topped with flying fish roe.",
    "category": "rice-noodles",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Fish"
    ],
    "details": "Section: Rice & Noodles. Ingredients: dry, asparagus, spring. Portion: Alaskan crab meat Dry scallop Egg Spring onion Flying White rice Ginger Asparagus Soy sauce. Accompaniments: Shellfish, Gluten(soy sauce) Egg Onion.",
    "image": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    "price": 32.0
  },
  {
    "id": "scallops-prawns-crispy-rice-in-fish-soup",
    "name": "Scallops, Prawns, Crispy Rice in Fish Soup",
    "description": "Fish soup served with scallop, spring onion, crispy rice, coriander, celery and",
    "category": "rice-noodles",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Shellfish"
    ],
    "details": "Section: Rice & Noodles. Ingredients: shrimp.. Portion: Diced scallop Diced fish Diced prawn Chinese celery Coriander Mushroom. Accompaniments: Shellfish, Sesame, Onion Cilantro Mushroom.",
    "image": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    "price": 32.0
  },
  {
    "id": "stir-fried-shanghainese-noodle-prawn-beef-pork-vegetables",
    "name": "Stir Fried Shanghainese Noodle (Prawn/Beef/Pork/Vegetables)",
    "description": "Stir Fried Shanghainese sauce and either Prawn/Beef/Pork/Vegetables. / \u96dc\u83dc)",
    "category": "rice-noodles",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Soy"
    ],
    "details": "Section: Rice & Noodles. Ingredients: Noodle with soy. Portion: Shanghainese noodle Soy sauce Prawn/Beef/Pork/Vegetables Scallion M ushroom Oyster Sauce Choy Sum Carrot. Accompaniments: Gluten Pork (optional) Shellfish (optional) Onion (scallion) mushroom.",
    "image": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    "price": 24.0
  },
  {
    "id": "wok-fried-flat-rice-noodles-us-black-angus-beef-bean-sprouts",
    "name": "Wok Fried Flat Rice Noodles, US Black Angus Beef, Bean Sprouts",
    "description": "Wok fried flat rice noodle, with sliced Angus beef, onion, bean sprouts.",
    "category": "rice-noodles",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [],
    "details": "Section: Rice & Noodles. Portion: Sliced beef Shredded spring onion Shredded onion Bean sprout Flat rice noodle Soy sauce Oyster Sauce. Accompaniments: Gluten(soy sauce) Onion Shellfish (Oyster Sauce) Chives.",
    "image": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    "price": 28.0
  },
  {
    "id": "fried-rice-seasonal-vegetables",
    "name": "Fried Rice, Seasonal Vegetables",
    "description": "Review menu matrix for description.",
    "category": "rice-noodles",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [],
    "details": "Section: Rice & Noodles. Portion: Corn Diced tomato Diced king oyster mushroom Diced White rice. Accompaniments: Mushroom Gluten Corn Tomato. Price not listed in PDF; confirm current market price before service.",
    "image": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    "price": 0
  },
  {
    "id": "alaskan-crabmeat-fried-rice-bjork-caviar-30g",
    "name": "Alaskan Crabmeat Fried Rice, Bjork Caviar(30g)",
    "description": "Alaskan crabmeat fried rice with egg and Bjork Caviar on the side 3 0 g \uff09",
    "category": "rice-noodles",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [],
    "details": "Section: Rice & Noodles. Portion: Crabmeat Egg white Spring onion Asparagus. Accompaniments: Shellfish Egg Onion.",
    "image": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    "price": 138.0
  },
  {
    "id": "sweetened-beancurd-cream-mango-soup-pomelo",
    "name": "Sweetened Beancurd Cream, Mango Soup, Pomelo",
    "description": "Sweetened bean curd cream in fresh mango soup with sago.",
    "category": "desserts",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Dairy",
      "Soy"
    ],
    "details": "Section: Dessert. Ingredients: Mango puree Milk Cream Sugar Grapefruit Pomelo Soy milk Corn starch. Portion: Per person.",
    "image": "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80",
    "price": 12.0
  },
  {
    "id": "double-boiled-imperial-birds-nest-soup-rock-sugar",
    "name": "Double Boiled Imperial Birds Nest Soup, Rock Sugar",
    "description": "Double boiled bird's nest soup with rock sugar.",
    "category": "desserts",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [],
    "details": "Section: Dessert. Ingredients: Bird's nest Rock sugar. Portion: Per person.",
    "image": "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80",
    "price": 88.0
  },
  {
    "id": "double-boiled-imperial-birds-nest-soup-almond-cream",
    "name": "Double Boiled Imperial Birds Nest Soup, Almond Cream",
    "description": "Double boiled bird's nest soup almond cream.",
    "category": "desserts",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Nut",
      "Almond",
      "Dairy"
    ],
    "details": "Section: Dessert. Ingredients: with Bird's nest Almond. Portion: cream.",
    "image": "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80",
    "price": 88.0
  },
  {
    "id": "double-boiled-egg-white-black-sesame",
    "name": "Double Boiled Egg White, Black Sesame",
    "description": "Double Boiled Egg White, stuffed in black sesame paste.",
    "category": "desserts",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Wheat",
      "Dairy",
      "Egg",
      "Sesame"
    ],
    "details": "Section: Dessert. Ingredients: Egg white Milk Sugar Black sesame paste.",
    "image": "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80",
    "price": 12.0
  },
  {
    "id": "rose-valrhona-white-chocolate-panna-cotta-lychee-sorbet-raspberr",
    "name": "Rose & Valrhona White Chocolate Panna Cotta, Lychee Sorbet, Raspberries",
    "description": "Panna Cotta is a custard topped with a scoop of lychee sorbet meringue. Garnished with Frozen raspberries, osmanthus flakes, rose pedals flakes and short bread crumbles.",
    "category": "desserts",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Dairy",
      "Egg",
      "Raspberry",
      "Gelatine"
    ],
    "details": "Section: Dessert. Ingredients: Panna Cotta (and crispy Gelatine, Eggs) Meringue (egg whites, Osmanthus, Rose petal) Lychee Sorbet (lychee puree) Frozen Raspberry Osmanthus Rose pedal flakes Shortbread starch, sugar). Portion: White Chocolate, Milk, flakes Crumble (butter, flour, corn.",
    "image": "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80",
    "price": 20.0
  },
  {
    "id": "pomelo-grapefruit-honeycomb-coconut-ice-cream",
    "name": "Pomelo, Grapefruit & Honeycomb, Coconut Ice Cream",
    "description": "Review menu matrix for description.",
    "category": "desserts",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Wheat",
      "Dairy",
      "Nut",
      "Honey"
    ],
    "details": "Section: Dessert. Ingredients: Coconut Dried Milk Pomelo Flowers Crumble (butter, flour, corn starch, sugar) Honey Comb (sugar, Honey).",
    "image": "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80",
    "price": 20.0
  },
  {
    "id": "almond-chocolate-oolong-tea-xiao-long-bao",
    "name": "Almond & Chocolate, Oolong Tea Xiao Long Bao",
    "description": "Oolong tea Chocolate Xiao long bao filled with Dark Chocolate and Almond",
    "category": "desserts",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Dairy",
      "Almond"
    ],
    "details": "Section: Dessert. Ingredients: Milk Chocolate Almond.",
    "image": "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80",
    "price": 20.0
  },
  {
    "id": "wild-mushroom-and-water-chestnut-dumplings",
    "name": "Wild Mushroom and Water Chestnut Dumplings",
    "description": "Shiitake mushroom King oyster mushroom Black fungus Jicama Carrot",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Mushroom",
      "Potato"
    ],
    "details": "Section: Out Of Menu. Ingredients: Potato starch Corn starch. Portion: 3 pcs.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 13.0
  },
  {
    "id": "stir-fried-cubed-australian-m6-wagyu-beef-in-lettuce-cup-mustard",
    "name": "Stir Fried Cubed Australian M6 Wagyu Beef in Lettuce Cup, Mustard Oil",
    "description": "6 Stir fried dice d Australian M Wagyu beef served in a lettuce cup topped with mustard oil and crispy ginger.",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Gluten",
      "Nut",
      "Onion",
      "Capsaicin",
      "Shellfish"
    ],
    "details": "Section: Out Of Menu. Ingredients: 6 Diced Australian M 6 Wagyu beef Diced cucumber Ginkgo nut Mustard oil Scallion Oyster Sauce. Portion: 6 pcs.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 22.0
  },
  {
    "id": "crispy-squid-baby-corn-salt-and-pepper",
    "name": "Crispy Squid, Baby Corn, Salt and Pepper",
    "description": "Deep fried squid and baby corn with fried crispy garlic, onion, dry chili pepper",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Gluten",
      "Wheat",
      "Sesame",
      "Onion",
      "Garlic",
      "Capsaicin",
      "Pepper"
    ],
    "details": "Section: Out Of Menu. Ingredients: Squid Garlic Baby corn Salt Pepper Flour.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 16.0
  },
  {
    "id": "jasmine-smoked-pork-rib",
    "name": "Jasmine Smoked Pork Rib",
    "description": "Roasted pork rib, smoked with jasmine flower, topped with peanut.",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Egg",
      "Fish",
      "Shellfish",
      "Peanut",
      "Nut",
      "Pork",
      "Onion",
      "Garlic",
      "Coriander",
      "Potato"
    ],
    "details": "Section: Out Of Menu. Ingredients: Pork rib Hoisin sauce Minced shallot Ground bean sauce Coriander Oyster sauce Potato starch Sugar Maltose Chicken powder Ketchup Egg Minced garlic Peanut. Portion: 4 pcs.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 24.0
  },
  {
    "id": "assorted-wild-mushroom-in-lettuce-cup-black-truffle-sauce",
    "name": "Assorted Wild Mushroom in Lettuce Cup, Black Truffle Sauce",
    "description": "Stir fried assorted mushroom, ginkgo nuts and truffle sauce served in a lettuce cup.",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Nut",
      "Mushroom",
      "Onion",
      "Pepper"
    ],
    "details": "Section: Out Of Menu. Ingredients: Diced Jicama Diced bamboo shoot Spring onion Ginkgo nut Diced shiitake mushroom Diced red bell pepper. Portion: 6 pcs.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 20.0
  },
  {
    "id": "crispy-szechuan-chicken",
    "name": "Crispy Szechuan Chicken",
    "description": "Lightly breaded diced chicken breast, wok tossed with spicy Szechuan sauce",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Gluten",
      "Wheat",
      "Capsaicin"
    ],
    "details": "Section: Out Of Menu. Ingredients: Cucumber on bottom Chili sauce Flour.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 18.0
  },
  {
    "id": "scallops-pumpkin",
    "name": "Scallops, Pumpkin",
    "description": "Scallops, pumpkin soup, Sugar Snap Pea",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Dairy",
      "Fish",
      "Shellfish"
    ],
    "details": "Section: Out Of Menu. Ingredients: Scallop Shrimp fish Sugar Snap Pea Pumpkin Heavy Cream. Portion: Per Person.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 16.0
  },
  {
    "id": "braised-whole-dried-fish-maw-abalone-sauce",
    "name": "Braised Whole Dried Fish Maw, Abalone Sauce",
    "description": "Braised fish maw steak, oyster sauce",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Fish",
      "Shellfish",
      "Pork"
    ],
    "details": "Section: Out Of Menu. Ingredients: Fish maw Oyster sauce. Price not listed in PDF; confirm current market price before service.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 0.0
  },
  {
    "id": "steamed-fillet-of-leopard-coral-garoupa-sea-salt-ginger",
    "name": "Steamed Fillet of Leopard Coral Garoupa, Sea Salt & Ginger",
    "description": "Steamed Garoupa fillet with sea salt and ginger, no sauce needed.",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Onion"
    ],
    "details": "Section: Out Of Menu. Ingredients: Fillet of Leopard Coral Garoupa Sea salt Minced ginger Spring onion. Price not listed in PDF; confirm current market price before service.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 0
  },
  {
    "id": "baked-alaskan-king-crab-legs-pumpkin-salty-egg",
    "name": "Baked Alaskan King Crab Legs, Pumpkin, Salty Egg",
    "description": "Baked crab leg with salty egg yolk paste and crispy kale",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Dairy",
      "Egg",
      "Fish",
      "Shellfish",
      "Onion"
    ],
    "details": "Section: Out Of Menu. Ingredients: Alaskan crab legs. Diced onion Minced pumpkin Chicken powder Butter Salty egg yolk paste. Portion: 4 pcs.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 68.0
  },
  {
    "id": "kung-po-prawn-sweetcorn-water-chestnut-cake",
    "name": "Kung Po Prawn, Sweetcorn & Water Chestnut Cake",
    "description": "Stir fried prawns with sweet, spicy & sour sauce, then place on pan fried sweetcorn & water chestnut cake after completion.",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Gluten",
      "Fish",
      "Shellfish",
      "Soy",
      "Peanut",
      "Nut",
      "Onion",
      "Capsaicin",
      "Pepper"
    ],
    "details": "Section: Out Of Menu. Ingredients: Prawn Soy sauce Corn Peppercorn oil Water chestnut Chili Szechuan peppercorn Vinegar Sugar Spring onion Peanuts. Portion: 8 pcs (4 prawns cut in half).",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 38.0
  },
  {
    "id": "crispy-free-range-yellow-chicken",
    "name": "Crispy Free Range Yellow Chicken",
    "description": "Deep fried chicken, topped with sea salt, garnished with lime wedge and crispy shredded",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Lime"
    ],
    "details": "Section: Out Of Menu. Ingredients: Whole / half chicken Sea salt ginger. Crispy shredded ginger Lime.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 58.0
  },
  {
    "id": "sweet-sour-pork-dragon-fruit-aged-black-vinegar",
    "name": "Sweet & Sour Pork, Dragon Fruit, Aged Black Vinegar",
    "description": "Deep fried pork black vinegar sauce. Garnished with 6 pieces of dragon fruit and bell pepper.",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Gluten",
      "Egg",
      "Soy",
      "Pork",
      "Pepper"
    ],
    "details": "Section: Out Of Menu. Ingredients: cooked in aged Pork Dragon fruit Dark vinegar Bell pepper Egg Sugar Corn Starch Soy Sauce.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 28.0
  },
  {
    "id": "crispy-egg-noodles-bamboo-pith-mushrooms-green-vegetables",
    "name": "Crispy Egg Noodles, Bamboo Pith, Mushrooms, Green Vegetables",
    "description": "Deep fried egg noodle, cut into round shape. Garnished with 4 pieces of choy sum and bamboo pith. Served with the assorted mushroom sauce(king oyster mushroom, shiitake mushroom, button mushroom, yellow fungus, elm fungus, carrot).",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Egg",
      "Fish",
      "Shellfish",
      "Mushroom",
      "Carrot"
    ],
    "details": "Section: Out Of Menu. Ingredients: Egg noodle Bamboo pith Choy sum Carrot King oyster mushroom Shiitake mushroom Bu Yellow fungus Elm fungus Chicken powder. Portion: tt on mushroom.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 26.0
  },
  {
    "id": "minced-duck-lettuce-cup",
    "name": "Minced Duck Lettuce Cup",
    "description": "Minced duck Diced bamboo shoot Diced lettuce. Diced mushroom",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Fish",
      "Shellfish",
      "Sesame",
      "Soy",
      "Mushroom",
      "Onion"
    ],
    "details": "Section: Out Of Menu. Ingredients: 6 cups Jicama.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 18.0
  },
  {
    "id": "fresh-mango-coconut-glutinous-rice-roll",
    "name": "Fresh Mango, Coconut, Glutinous Rice Roll",
    "description": "Glutenous rice roll wrapped with fresh mango, cream,",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Dairy"
    ],
    "details": "Section: Out Of Menu. Ingredients: Diced mango Mango puree Mango oil Unflavored gela Sugar Cream. Portion: ti n e.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 12.0
  },
  {
    "id": "fondant-au-chocolat-matcha",
    "name": "Fondant au Chocolat, Matcha",
    "description": "Review menu matrix for description.",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Wheat",
      "Egg",
      "Dairy"
    ],
    "details": "Section: Out Of Menu. Ingredients: Butter White Chocolate Matcha Powder Egg Flour Crumble, Corn Starch Milk Sugar Green Tea Ice Cream Gold Flake.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 16.0
  },
  {
    "id": "free-range-chicken-dried-shallots-black-bean-sauce",
    "name": "Free Range Chicken, Dried Shallots, Black Bean Sauce",
    "description": "Wok fried free range chicken with shallot and black bean sauce. Served in a clay pot.",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Sesame",
      "Soy",
      "Onion",
      "Garlic",
      "Pepper"
    ],
    "details": "Section: Out Of Menu. Ingredients: Chicken Shallot Spring onion Sliced ginger Black bean sauce Chiu hou sauce (made by soy bean, sesame, light soy sauce). Portion: (Dark Meat) *Bell Pepper.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 28.0
  },
  {
    "id": "wok-fried-maine-lobster-black-truffle-egg-white",
    "name": "Wok Fried Maine Lobster, Black Truffle, Egg White",
    "description": "Wok fried African lobster with egg white, topped with sliced black truffle.",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Dairy",
      "Egg",
      "Fish",
      "Shellfish",
      "Mushroom"
    ],
    "details": "Section: Out Of Menu. Ingredients: Maine lobster Egg white Sliced black truffle Truffle oil Sliced asparagus Milk. Portion: 1.5 lb / pc.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 88.0
  },
  {
    "id": "wok-fried-broccoli-ginkgo",
    "name": "Wok Fried Broccoli, Ginkgo",
    "description": "Wok fried broccoli with gin",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Nut",
      "Garlic"
    ],
    "details": "Section: Out Of Menu. Ingredients: kg o nuts.. Portion: Broccoli Ginkgo nut Garlic.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 16.0
  },
  {
    "id": "crispy-baby-octopus-salt-and-pepper",
    "name": "Crispy Baby Octopus, Salt and Pepper",
    "description": "Deep fried, lightly breaded mini octopus, wok fried with salt and pepper",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Gluten",
      "Wheat",
      "Seafood",
      "Sesame",
      "Garlic",
      "Capsaicin"
    ],
    "details": "Section: Out Of Menu. Ingredients: Baby octopus Garlic Salt Chili Flour.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 18.0
  },
  {
    "id": "crispy-shredded-mushrooms-french-green-bean-sesame",
    "name": "Crispy Shredded Mushrooms, French Green Bean, Sesame",
    "description": "Light breaded deep fired mushroom with French green bean sweet and sour sauce, top with sesame seed",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Gluten",
      "Sesame",
      "Mushroom",
      "Potato"
    ],
    "details": "Section: Out Of Menu. Ingredients: Mushroom Potato starch Sesame seed Vinegar.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 30.0
  },
  {
    "id": "sweet-sour-pork-dragon-fruit-aged-black-vinegar-2",
    "name": "Sweet & Sour Pork, Dragon Fruit, Aged Black Vinegar",
    "description": "Deep Fried Pork with Black Vinegar Sweet & Sour sauce Dragon Fruit",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Gluten",
      "Pork"
    ],
    "details": "Section: Out Of Menu. Ingredients: Pork Vinegar Dragon Fruit Gluten.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 38.0
  },
  {
    "id": "sauteed-shredded-vegan-pork-wood-ear-fungus-carrot-bamboo-shoot-",
    "name": "Sauteed Shredded Vegan Pork, Wood Ear Fungus, Carrot, Bamboo Shoot, Chives, Chili Bean Sauce",
    "description": "Review menu matrix for description.",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 1,
    "allergens": [
      "Mushroom",
      "Pork"
    ],
    "details": "Section: Out Of Menu. Ingredients: Stir fried Vegan pork with wood ear mushroom bamboo shoot. Portion: \u201cpork\u201d Wood ear mushroom Carrot Bamboo shoot Chives.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 28.0
  },
  {
    "id": "wok-fried-flat-rice-noodle-sliced-vegan-beef-bean-sprouts",
    "name": "Wok Fried Flat Rice Noodle, Sliced Vegan Beef, Bean Sprouts",
    "description": "Wok-fired flat rice noodle with vegan beef, bean sprout Green onion, Chive",
    "category": "out-of-menu",
    "diet": "NA",
    "style": "",
    "heat": 0,
    "allergens": [
      "Gluten",
      "Soy",
      "Onion"
    ],
    "details": "Section: Out Of Menu. Ingredients: Flat rice Vegan \u201cbeef\u201d Bean Sprout Chive Green Onion Soy Onion. Portion: noodle.",
    "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    "price": 28.0
  }
];

const allergyOptions = ["Capsaicin", "Dairy", "Egg", "Fish", "Garlic", "Gluten", "Mushroom", "Nut", "Onion", "Peanut", "Pork", "Seafood", "Sesame", "Shellfish", "Soy", "Wheat"];
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
  ingredients: new Set(),
  openItems: new Set(),
  revealedMenuRows: new Set(),
  currentUser: loadCurrentUser(),
  sharedMenu: null,
  sharedCode: "",
  sharedMenuUpdatedAt: "",
  demoMode: false,
  editing: false,
  localItemEditTimes: {},
  localDeletedItemTimes: {},
  photoSlides: {},
  photoLightbox: {
    itemId: "",
    itemName: "",
    images: [],
    index: 0
  },
  screen: loadCurrentUser() ? "menus" : "login",
  activeRestaurantMenu: initialRestaurantMenu?.id || defaultRestaurantMenuId,
  dashboardTab: "users",
  dashboardReturnScreen: "menus",
  flashcardMode: "mixed",
  flashcard: null,
  quizSession: null,
  quiz: null,
  quizScore: {
    correct: 0,
    total: 0
  }
};

const cloudSync = {
  applying: false,
  applyingUsers: false,
  client: null,
  docId: "",
  ref: null,
  saveTimer: null,
  sharedCode: "",
  sharedUnsubscribe: null,
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
let pdfImportDraftItems = [];
let rowSwipeState = null;
let menuRevealObserver = null;
let menuRevealSequence = 0;
let sharedQuizResultsPulling = false;
let sharedQuizResultsPulledAt = 0;

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const flashcardModes = ["mixed", "allergies", "ingredients"];
const ingredientVocabulary = [
  "Abalone",
  "Almond",
  "Asparagus",
  "Beef",
  "Black cod",
  "Broccoli",
  "Cashew",
  "Chicken",
  "Chili",
  "Chocolate",
  "Coconut",
  "Crab",
  "Cucumber",
  "Duck",
  "Egg",
  "Garlic",
  "Ginger",
  "Honey",
  "Iberico pork",
  "Lobster",
  "Maltose",
  "Mango",
  "Mushroom",
  "Noodle",
  "Oyster sauce",
  "Peanut",
  "Pork",
  "Prawn",
  "Rice",
  "Scallion",
  "Scallop",
  "Sea cucumber",
  "Sesame",
  "Shrimp",
  "Soy sauce",
  "Spring onion",
  "Tofu",
  "Truffle",
  "Vinegar",
  "Wagyu"
];

function formatMenuPrice(price) {
  const value = Number(price);
  return value > 0 ? formatter.format(value) : "MP";
}

const menuGrid = document.querySelector("#menuGrid");
const template = document.querySelector("#menuRowTemplate");
const searchInput = document.querySelector("#searchInput");
const allergyChips = document.querySelector("#allergyChips");
const ingredientChips = document.querySelector("#ingredientChips");
const allergyFilterCount = document.querySelector("#allergyFilterCount");
const ingredientFilterCount = document.querySelector("#ingredientFilterCount");
const categoryTabs = document.querySelector("#categoryTabs");
let tabs = [...document.querySelectorAll(".tab")];
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
const demoMenuButton = document.querySelector("#demoMenuButton");
const registerLinkButton = document.querySelector("#registerLinkButton");
const loginLinkButton = document.querySelector("#loginLinkButton");
const showCodeLoginButton = document.querySelector("#showCodeLoginButton");
const codeLoginForm = document.querySelector("#codeLoginForm");
const shareCodeInput = document.querySelector("#shareCodeInput");
const savedShareCodes = document.querySelector("#savedShareCodes");
const codeLoginMessage = document.querySelector("#codeLoginMessage");
const restaurantList = document.querySelector("#restaurantList");
const menusHomeLink = document.querySelector("#menusHomeLink");
const menuHomeLink = document.querySelector("#menuHomeLink");
const menusUserStatus = document.querySelector("#menusUserStatus");
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
const backToTopButton = document.querySelector("#backToTopButton");
const photoLightboxDialog = document.querySelector("#photoLightboxDialog");
const closePhotoLightboxButton = document.querySelector("#closePhotoLightboxButton");
const photoLightboxPreviousButton = document.querySelector("#photoLightboxPreviousButton");
const photoLightboxNextButton = document.querySelector("#photoLightboxNextButton");
const photoLightboxImage = document.querySelector("#photoLightboxImage");
const photoLightboxCaption = document.querySelector("#photoLightboxCaption");
const setupPassword = document.querySelector("#setupPassword");
const setupMessage = document.querySelector("#setupMessage");
const inviteIntro = document.querySelector("#inviteIntro");
const loginMessage = document.querySelector("#loginMessage");
const adminStatus = document.querySelector("#adminStatus");
const editModeButton = document.querySelector("#editModeButton");
const quickMenuActions = document.querySelector("#quickMenuActions");
const quickEditModeButton = document.querySelector("#quickEditModeButton");
const quickCustomizationButton = document.querySelector("#quickCustomizationButton");
const quickScanMenuButton = document.querySelector("#quickScanMenuButton");
const quickImportPdfButton = document.querySelector("#quickImportPdfButton");
const quickPdfBuilderButton = document.querySelector("#quickPdfBuilderButton");
const quickCategoryButton = document.querySelector("#quickCategoryButton");
const quickShareMenuButton = document.querySelector("#quickShareMenuButton");
const quickFlashcardButton = document.querySelector("#quickFlashcardButton");
const quickQuizButton = document.querySelector("#quickQuizButton");
const pdfBuilderButton = document.querySelector("#pdfBuilderButton");
const addItemButton = document.querySelector("#addItemButton");
const deleteMenuButton = document.querySelector("#deleteMenuButton");
const scanMenuButton = document.querySelector("#scanMenuButton");
const importPdfButton = document.querySelector("#importPdfButton");
const categoryManagerButton = document.querySelector("#categoryManagerButton");
const shareMenuButton = document.querySelector("#shareMenuButton");
const manageUsersButton = document.querySelector("#manageUsersButton");
const designButton = document.querySelector("#designButton");
const logoutButton = document.querySelector("#logoutButton");
const menuPage = document.querySelector("#menuPage");
const usersPage = document.querySelector("#usersPage");
const pdfPage = document.querySelector("#pdfPage");
const flashcardPage = document.querySelector("#flashcardPage");
const quizPage = document.querySelector("#quizPage");
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
const newUserPermissionsSlot = document.querySelector("#newUserPermissionsSlot");
const newUserMenuAccessSlot = document.querySelector("#newUserMenuAccessSlot");
const userMessage = document.querySelector("#userMessage");
const userList = document.querySelector("#userList");
const authBackgroundImage = document.querySelector("#authBackgroundImage");
const authBackgroundVideo = document.querySelector("#authBackgroundVideo");
const registerBackgroundImage = document.querySelector("#registerBackgroundImage");
const registerBackgroundVideo = document.querySelector("#registerBackgroundVideo");
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
const itemIngredients = document.querySelector("#itemIngredients");
const saveItemButton = document.querySelector("#saveItemButton");
const itemUploadPreview = document.querySelector("#itemUploadPreview");
const itemPreviewList = document.querySelector("#itemPreviewList");
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
const pdfImportDialog = document.querySelector("#pdfImportDialog");
const closePdfImportButton = document.querySelector("#closePdfImportButton");
const pdfImportFile = document.querySelector("#pdfImportFile");
const pdfImportMode = document.querySelector("#pdfImportMode");
const pdfImportCategory = document.querySelector("#pdfImportCategory");
const extractPdfButton = document.querySelector("#extractPdfButton");
const pdfImportText = document.querySelector("#pdfImportText");
const pdfImportPreview = document.querySelector("#pdfImportPreview");
const pdfImportMessage = document.querySelector("#pdfImportMessage");
const clearPdfImportButton = document.querySelector("#clearPdfImportButton");
const importPdfItemsButton = document.querySelector("#importPdfItemsButton");
const categoryDialog = document.querySelector("#categoryDialog");
const categoryForm = document.querySelector("#categoryForm");
const closeCategoryButton = document.querySelector("#closeCategoryButton");
const newCategoryName = document.querySelector("#newCategoryName");
const categoryList = document.querySelector("#categoryList");
const categoryMessage = document.querySelector("#categoryMessage");
const shareMenuDialog = document.querySelector("#shareMenuDialog");
const closeShareMenuButton = document.querySelector("#closeShareMenuButton");
const shareCodeValue = document.querySelector("#shareCodeValue");
const copyShareCodeButton = document.querySelector("#copyShareCodeButton");
const refreshShareCodeButton = document.querySelector("#refreshShareCodeButton");
const customShareCodeInput = document.querySelector("#customShareCodeInput");
const useCustomShareCodeButton = document.querySelector("#useCustomShareCodeButton");
const saveShareCodeButton = document.querySelector("#saveShareCodeButton");
const shareMenuMessage = document.querySelector("#shareMenuMessage");
const heroImage = document.querySelector("#heroImage");
const editHeroButton = document.querySelector("#editHeroButton");
const currentMenuTitle = document.querySelector("#currentMenuTitle");
const topAddItemButton = document.querySelector("#topAddItemButton");
const renameMenuButton = document.querySelector("#renameMenuButton");
const demoGuidePanel = document.querySelector("#demoGuidePanel");
const demoCreateAccountButton = document.querySelector("#demoCreateAccountButton");
const demoExitButton = document.querySelector("#demoExitButton");
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
const frontMediaType = document.querySelector("#frontMediaType");
const frontMediaUrl = document.querySelector("#frontMediaUrl");
const frontMediaFile = document.querySelector("#frontMediaFile");
const frontMediaPhoneSize = document.querySelector("#frontMediaPhoneSize");
const frontMediaPhoneSizeValue = document.querySelector("#frontMediaPhoneSizeValue");
const frontMediaWebSize = document.querySelector("#frontMediaWebSize");
const frontMediaWebSizeValue = document.querySelector("#frontMediaWebSizeValue");
const frontMediaBlur = document.querySelector("#frontMediaBlur");
const frontMediaBlurValue = document.querySelector("#frontMediaBlurValue");
const itemPhotoSize = document.querySelector("#itemPhotoSize");
const itemPhotoSizeValue = document.querySelector("#itemPhotoSizeValue");
const menuAnimationIntensity = document.querySelector("#menuAnimationIntensity");
const menuAnimationIntensityValue = document.querySelector("#menuAnimationIntensityValue");
const dashboardMenuAnimationIntensity = document.querySelector("#dashboardMenuAnimationIntensity");
const dashboardMenuAnimationIntensityValue = document.querySelector("#dashboardMenuAnimationIntensityValue");
const frontVideoLength = document.querySelector("#frontVideoLength");
const frontMediaPreview = document.querySelector("#frontMediaPreview");
const frontMediaPreviewFrame = document.querySelector("#frontMediaPreviewFrame");
const frontMediaUploadProgress = document.querySelector("#frontMediaUploadProgress");
const frontMediaUploadStatus = document.querySelector("#frontMediaUploadStatus");
const dashboardTabs = [...document.querySelectorAll(".dashboard-tab")];
const dashboardPanels = [...document.querySelectorAll(".dashboard-panel")];
const dashboardAuthSummary = document.querySelector("#dashboardAuthSummary");
const dashboardPaymentsSummary = document.querySelector("#dashboardPaymentsSummary");
const dashboardRestaurantList = document.querySelector("#dashboardRestaurantList");
const dashboardMenuList = document.querySelector("#dashboardMenuList");
const dashboardStatsSummary = document.querySelector("#dashboardStatsSummary");
const dashboardStatsList = document.querySelector("#dashboardStatsList");
const dashboardCustomizationSummary = document.querySelector("#dashboardCustomizationSummary");
const dashboardCustomizationButton = document.querySelector("#dashboardCustomizationButton");
const backFromFlashcardsButton = document.querySelector("#backFromFlashcardsButton");
const flashcardShuffleButton = document.querySelector("#flashcardShuffleButton");
const flashcardModeButton = document.querySelector("#flashcardModeButton");
const flashcardNextButton = document.querySelector("#flashcardNextButton");
const flashcardFlipButton = document.querySelector("#flashcardFlipButton");
const flashcardType = document.querySelector("#flashcardType");
const flashcardPrompt = document.querySelector("#flashcardPrompt");
const flashcardHint = document.querySelector("#flashcardHint");
const flashcardAnswer = document.querySelector("#flashcardAnswer");
const backFromQuizButton = document.querySelector("#backFromQuizButton");
const quizSetupPanel = document.querySelector("#quizSetupPanel");
const quizSetupForm = document.querySelector("#quizSetupForm");
const quizTakerName = document.querySelector("#quizTakerName");
const quizScorePanel = document.querySelector("#quizScorePanel");
const quizCard = document.querySelector("#quizCard");
const quizScore = document.querySelector("#quizScore");
const quizNewQuestionButton = document.querySelector("#quizNewQuestionButton");
const quizType = document.querySelector("#quizType");
const quizQuestion = document.querySelector("#quizQuestion");
const quizOptions = document.querySelector("#quizOptions");
const quizCheckButton = document.querySelector("#quizCheckButton");
const quizResetButton = document.querySelector("#quizResetButton");
const quizMessage = document.querySelector("#quizMessage");
const quizResultPanel = document.querySelector("#quizResultPanel");
const quizResultTitle = document.querySelector("#quizResultTitle");
const quizResultSummary = document.querySelector("#quizResultSummary");
const quizStartOverButton = document.querySelector("#quizStartOverButton");

function normalizeCategoryValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getUniqueCategories(values = []) {
  return getUniqueCategoryValues(values);
}

function getUniqueCategoryValues(values = []) {
  const unique = [];
  values.forEach((value) => {
    const normalized = normalizeCategoryValue(value);
    if (normalized && !unique.includes(normalized)) unique.push(normalized);
  });
  return unique;
}

function loadCategories() {
  const savedCategories = localStorage.getItem(categoriesStorageKey);
  if (!savedCategories) return getUniqueCategories(defaultCategories);

  try {
    const parsed = JSON.parse(savedCategories);
    return Array.isArray(parsed) ? getUniqueCategories(parsed) : getUniqueCategories(defaultCategories);
  } catch {
    return getUniqueCategories(defaultCategories);
  }
}

function saveCategories({ sync = true } = {}) {
  categories = getUniqueCategories(categories);
  localStorage.setItem(categoriesStorageKey, JSON.stringify(categories));
  if (sync) scheduleCloudSave();
}

function mergeCategories(values = [], options = {}) {
  const before = categories.join("|");
  categories = getUniqueCategories(values);
  const changed = categories.join("|") !== before;
  if (changed) saveCategories(options);
  return changed;
}

function renderCategoryTabs() {
  if (!categoryTabs) return;

  categoryTabs.replaceChildren();
  const allTab = createCategoryTab("all", "All");
  categoryTabs.append(allTab);
  categories.forEach((category) => {
    categoryTabs.append(createCategoryTab(category, getCategoryLabel(category)));
  });
  tabs = [...categoryTabs.querySelectorAll(".tab")];
  setActiveCategoryTab();
}

function createCategoryTab(category, label) {
  const button = document.createElement("button");
  button.className = "tab";
  button.type = "button";
  button.dataset.category = category;
  button.textContent = label;
  button.addEventListener("click", () => {
    state.category = category;
    setActiveCategoryTab();
    renderMenu();
  });
  return button;
}

function setActiveCategoryTab() {
  if (!categories.includes(state.category) && state.category !== "all") {
    state.category = "all";
  }
  tabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.category === state.category);
  });
}

function renderCategorySelect(select, { includeAuto = false, editableOnly = false, selectedValue = "" } = {}) {
  if (!select) return;

  const allowedCategories = editableOnly ? getEditableCategories() : categories;
  select.replaceChildren();

  if (includeAuto) {
    const auto = document.createElement("option");
    auto.value = "auto";
    auto.textContent = "Auto detect";
    select.append(auto);
  }

  allowedCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = getCategoryLabel(category);
    select.append(option);
  });

  if (selectedValue && [...select.options].some((option) => option.value === selectedValue)) {
    select.value = selectedValue;
  } else if (includeAuto) {
    select.value = "auto";
  } else if (allowedCategories.length) {
    select.value = allowedCategories[0];
  }
}

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
    categories: [...categories],
    items: clearDefaultStockImagesForMenuItems(applyMott32HistoryFactsToItems(loadMenuItems())),
    designSettings: loadDesignSettings()
  };
}

function createDemoSvgImage(title, background = "#19211d", accent = "#d99d2b", subtitle = "Menu training") {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
      <rect width="640" height="360" fill="${background}"/>
      <circle cx="512" cy="82" r="98" fill="${accent}" opacity="0.22"/>
      <circle cx="108" cy="294" r="132" fill="#ffffff" opacity="0.08"/>
      <rect x="62" y="72" width="516" height="216" rx="30" fill="#fffdfa" opacity="0.92"/>
      <text x="320" y="166" text-anchor="middle" font-family="Georgia, serif" font-size="42" font-weight="700" fill="#19211d">${title}</text>
      <text x="320" y="210" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="4" fill="#66716b">${subtitle}</text>
    </svg>
  `;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function createDemoRestaurantMenu() {
  const demoItems = [
    {
      id: "demo-peking-duck",
      name: "Signature Peking Duck",
      description: "A training item with price, photo slides, allergens, accompaniments, and service notes.",
      category: "bbq",
      diet: "SIGN",
      heat: 0,
      allergens: ["Gluten", "Egg", "Peanut", "Sesame"],
      ingredients: ["Duck", "Maltose", "Cucumber", "Scallion", "Sesame sauce", "Peanut sauce"],
      details: "Tutorial: tap the item name to open this panel. Photos can be swiped, ingredients are separated from allergens, and prices stay visible in the matrix.",
      images: [
        createDemoSvgImage("Duck Plating", "#2f3b35", "#d99d2b", "Swipe photos"),
        createDemoSvgImage("Sauce Setup", "#21343b", "#317c8e", "Details view")
      ],
      price: 128
    },
    {
      id: "demo-soup-dumplings",
      name: "Hot & Sour Soup Dumplings",
      description: "Use this item to test heat level, ingredient finder, and allergy filtering.",
      category: "steamed-dim-sum",
      diet: "DIM",
      heat: 2,
      allergens: ["Gluten", "Soy", "Pork", "Sesame"],
      ingredients: ["Iberico pork", "Ginger", "Chili", "Vinegar", "Gelatine"],
      details: "Tutorial: select Pork or Gluten in Allergy check to see how the menu hides items guests should avoid.",
      images: [createDemoSvgImage("Soup Dumplings", "#53342f", "#d99d2b", "Allergy filter demo")],
      price: 14
    },
    {
      id: "demo-lobster-noodle",
      name: "Lobster Longevity Noodles",
      description: "A seafood example for search, category browsing, and quiz practice.",
      category: "rice-noodles",
      diet: "SEA",
      heat: 1,
      allergens: ["Shellfish", "Gluten", "Soy", "Garlic"],
      ingredients: ["Lobster", "Noodle", "Garlic", "Scallion", "Soy sauce"],
      details: "Tutorial: search for lobster, noodle, garlic, or soy to see how staff can find answers quickly during training.",
      images: [createDemoSvgImage("Lobster Noodles", "#243845", "#317c8e", "Search demo")],
      price: 58
    },
    {
      id: "demo-vegetable-tofu",
      name: "Crispy Tofu & Seasonal Vegetables",
      description: "A vegetarian-style example that shows ingredient notes without major seafood or pork allergens.",
      category: "vegetables",
      diet: "VEG",
      heat: 0,
      allergens: ["Soy", "Gluten"],
      ingredients: ["Tofu", "Broccoli", "Mushroom", "Ginger", "Soy sauce"],
      details: "Tutorial: Ingredient finder helps trainees locate items that contain a specific ingredient, not just avoid allergens.",
      images: [createDemoSvgImage("Tofu Vegetables", "#2f4a3d", "#89b86d", "Ingredient demo")],
      price: 28
    },
    {
      id: "demo-mango-dessert",
      name: "Mango Almond Cloud",
      description: "A dessert example for flash cards and single-answer quiz questions.",
      category: "desserts",
      diet: "SWT",
      heat: 0,
      allergens: ["Dairy", "Nut"],
      ingredients: ["Mango", "Almond", "Cream", "Coconut"],
      details: "Tutorial: open Flash cards or Quiz above to practice ingredients and allergy answers from this demo menu.",
      images: [createDemoSvgImage("Mango Dessert", "#59412e", "#f2c766", "Quiz demo")],
      price: 16
    }
  ];

  return normalizeRestaurantMenu({
    id: "demo-menu-matrix",
    name: "Menu Matrix Demo",
    restaurantName: "Demo Kitchen",
    owner: "demo",
    label: "Tutorial menu",
    categories: ["bbq", "steamed-dim-sum", "rice-noodles", "vegetables", "desserts"],
    items: demoItems,
    designSettings: {
      ...defaultDesign,
      heroImage: createDemoSvgImage("Menu Matrix Demo", "#19211d", "#d99d2b", "Tap, filter, study")
    }
  });
}

function normalizeRestaurantMenu(menu, index = 0) {
  const isDefaultMenu = menu.id === defaultRestaurantMenuId || (!menu.id && index === 0);
  const id = menu.id || `menu-${Date.now()}-${index}`;
  const name = menu.name || (isDefaultMenu ? "Mott 32 Las Vegas" : `Blank Menu ${index + 1}`);
  const menuIsMott32 = isMott32Menu({ id, name });
  const design = menu.designSettings || (isDefaultMenu ? loadDesignSettings() : { ...defaultDesign, heroImage: "" });
  const items = Array.isArray(menu.items) ? menu.items : isDefaultMenu ? loadMenuItems() : [];
  const normalizedItems = menuIsMott32
    ? clearDefaultStockImagesForMenuItems(applyMott32HistoryFactsToItems(items))
    : items.map(normalizeMenuItem);
  const normalizedDesign = normalizeDesignSettings(design);

  if ((isDefaultMenu && !normalizedDesign.heroImage) || shouldUseBuiltInMott32Hero(menu, normalizedDesign.heroImage)) {
    normalizedDesign.heroImage = defaultHeroImage;
  }

  return {
    id,
    name,
    restaurantName: menu.restaurantName || menu.restaurant || (isDefaultMenu ? "Mott 32 Las Vegas" : ""),
    owner: menu.owner || primaryAdminUsername,
    label: menu.label || (isDefaultMenu ? "Chinese menu training" : "Blank menu"),
    shareCode: typeof menu.shareCode === "string" ? menu.shareCode : "",
    categories: getUniqueCategories(menu.categories || categories),
    items: normalizedItems,
    stats: normalizeMenuStats(menu.stats),
    quizResults: normalizeQuizResults(menu.quizResults),
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

function normalizeStatsEvents(events = [], fallbackTimestamp = "", limit = menuStatsEventLimit) {
  const eventList = Array.isArray(events) ? events : [];
  const normalized = eventList
    .map((event) => (typeof event === "string" ? event : event?.at || event?.timestamp || ""))
    .filter((event) => !Number.isNaN(Date.parse(event)));

  if (!normalized.length && typeof fallbackTimestamp === "string" && !Number.isNaN(Date.parse(fallbackTimestamp))) {
    normalized.push(fallbackTimestamp);
  }

  return [...new Set(normalized)]
    .sort((a, b) => Date.parse(b) - Date.parse(a))
    .slice(0, limit);
}

function normalizeItemClickStats(itemClicks = {}) {
  const source = itemClicks && typeof itemClicks === "object" ? itemClicks : {};
  return Object.fromEntries(
    Object.entries(source)
      .map(([itemId, stat]) => {
        const sourceStat = stat && typeof stat === "object" ? stat : {};
        const clicks = Math.max(0, Number(sourceStat.clicks) || 0);
        const lastOpenedAt = typeof sourceStat.lastOpenedAt === "string" ? sourceStat.lastOpenedAt : "";
        const recentOpens = normalizeStatsEvents(
          sourceStat.recentOpens || sourceStat.openEvents || sourceStat.timestamps,
          lastOpenedAt,
          itemStatsEventLimit
        );
        return [
          String(itemId),
          {
            clicks,
            lastOpenedAt: recentOpens[0] || lastOpenedAt,
            recentOpens,
            itemName: String(sourceStat.itemName || sourceStat.name || "")
          }
        ];
      })
      .filter(([itemId, stat]) => itemId && stat.clicks > 0)
  );
}

function normalizeMenuStats(stats = {}) {
  const source = stats && typeof stats === "object" ? stats : {};
  const clicks = Math.max(0, Number(source.clicks) || 0);
  const lastOpenedAt = typeof source.lastOpenedAt === "string" ? source.lastOpenedAt : "";
  const recentOpens = normalizeStatsEvents(source.recentOpens || source.openEvents || source.timestamps, lastOpenedAt);

  return {
    clicks,
    lastOpenedAt: recentOpens[0] || lastOpenedAt,
    recentOpens,
    itemClicks: normalizeItemClickStats(source.itemClicks || source.itemStats || source.items)
  };
}

function normalizeQuizResult(result = {}) {
  const total = Math.max(0, Number(result.total) || Number(result.questionLimit) || 0);
  const score = Math.max(0, Math.min(total || Number(result.score) || 0, Number(result.score) || 0));
  const takenAt = typeof result.takenAt === "string" && result.takenAt ? result.takenAt : new Date().toISOString();
  const questionLimit = Math.max(5, Number(result.questionLimit) || total || 5);
  return {
    id: result.id || `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    takerName: String(result.takerName || "Guest").trim() || "Guest",
    menuId: String(result.menuId || ""),
    menuName: String(result.menuName || ""),
    restaurantName: String(result.restaurantName || ""),
    owner: String(result.owner || ""),
    shareCode: normalizeShareCode(result.shareCode || ""),
    takenAt,
    finishedAt: typeof result.finishedAt === "string" && result.finishedAt ? result.finishedAt : takenAt,
    questionLimit,
    score,
    total,
    percent: total ? Math.round((score / total) * 100) : 0,
    source: String(result.source || "app")
  };
}

function mergeQuizResults(currentResults = [], incomingResults = []) {
  const merged = new Map();
  [...currentResults, ...incomingResults].forEach((result) => {
    const normalized = normalizeQuizResult(result);
    if (normalized.id) merged.set(normalized.id, normalized);
  });
  return [...merged.values()]
    .sort((a, b) => Date.parse(b.finishedAt || b.takenAt || "") - Date.parse(a.finishedAt || a.takenAt || ""))
    .slice(0, quizResultsLimit);
}

function normalizeQuizResults(results = []) {
  return Array.isArray(results) ? mergeQuizResults([], results) : [];
}

function getTimestampMs(value) {
  if (typeof value !== "string" || !value) return 0;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function getMenuItemUpdatedAtMs(item = {}) {
  return getTimestampMs(item.updatedAt || item.modifiedAt || item.createdAt || "");
}

function markLocalItemEdit(item) {
  if (!item?.id) return;
  const timestamp = getMenuItemUpdatedAtMs(item) || Date.now();
  state.localItemEditTimes[item.id] = timestamp;
  delete state.localDeletedItemTimes[item.id];
}

function markLocalItemDelete(itemId) {
  if (!itemId) return;
  state.localDeletedItemTimes[itemId] = Date.now();
  delete state.localItemEditTimes[itemId];
}

function getMenuAnimationIntensity(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return defaultDesign.menuAnimationIntensity;
  return Math.max(0, Math.min(100, Math.round(parsed)));
}

function formatMenuAnimationIntensity(value) {
  const intensity = getMenuAnimationIntensity(value);
  return intensity <= 0 ? "Off" : `${intensity}%`;
}

function normalizeDesignSettings(settings = {}) {
  const frontMediaType = settings.frontMediaType === "image" ? "image" : "video";
  const frontMediaUrl =
    typeof settings.frontMediaUrl === "string" && settings.frontMediaUrl.trim()
      ? settings.frontMediaUrl.trim()
      : defaultFrontMediaUrl;
  const legacyFrontMediaSize = Number(settings.frontMediaSize);
  const fallbackFrontMediaSize = Number.isFinite(legacyFrontMediaSize) ? legacyFrontMediaSize : 100;
  const frontMediaPhoneSize = Math.max(
    80,
    Math.min(160, Number(settings.frontMediaPhoneSize) || fallbackFrontMediaSize || defaultDesign.frontMediaPhoneSize)
  );
  const frontMediaWebSize = Math.max(
    80,
    Math.min(180, Number(settings.frontMediaWebSize) || fallbackFrontMediaSize || defaultDesign.frontMediaWebSize)
  );
  const itemPhotoSize = Math.max(72, Math.min(180, Number(settings.itemPhotoSize) || defaultDesign.itemPhotoSize));
  const parsedFrontMediaBlur = Number(settings.frontMediaBlur);
  const frontMediaBlur = Number.isFinite(parsedFrontMediaBlur)
    ? Math.max(0, Math.min(18, parsedFrontMediaBlur))
    : defaultDesign.frontMediaBlur;
  const frontVideoLength = Math.max(0, Math.min(120, Number(settings.frontVideoLength) || 0));
  const menuAnimationIntensity = getMenuAnimationIntensity(settings.menuAnimationIntensity);

  return {
    ...defaultDesign,
    ...settings,
    heroImage: typeof settings.heroImage === "string" ? settings.heroImage : defaultHeroImage,
    itemPhotoSize,
    frontMediaType,
    frontMediaUrl,
    frontMediaPhoneSize,
    frontMediaWebSize,
    frontMediaBlur,
    frontVideoLength,
    menuAnimationIntensity
  };
}

function normalizeText(value = "") {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function joinReadableList(values = []) {
  const list = values.filter(Boolean);
  if (list.length <= 1) return list[0] || "";
  if (list.length === 2) return `${list[0]} and ${list[1]}`;
  return `${list.slice(0, -1).join(", ")}, and ${list[list.length - 1]}`;
}

function findDishKeyword(source, entries) {
  return entries.find((entry) => entry.test.test(source));
}

function getDishIngredientSignals(item = {}) {
  const source = normalizeText(`${item.name || ""} ${getItemIngredientText(item)} ${(item.ingredients || []).join(" ")}`).toLowerCase();
  const entries = [
    { test: /peking duck|duck rack|shredded duck|duck/, label: "duck" },
    { test: /iberico|pork belly|pork|char siu|bbq pork/, label: "Iberico pork" },
    { test: /lobster|maine lobster|australian lobster/, label: "lobster" },
    { test: /king crab|dungeness crab|crab/, label: "crab" },
    { test: /abalone/, label: "abalone" },
    { test: /sea cucumber/, label: "sea cucumber" },
    { test: /fish maw/, label: "fish maw" },
    { test: /bird.?s nest/, label: "bird's nest" },
    { test: /black cod|cod/, label: "black cod" },
    { test: /mandarin fish|garoupa|grouper|marble goby|sea bass|fish/, label: "fish" },
    { test: /prawn|shrimp|wonton/, label: "shrimp" },
    { test: /scallop/, label: "scallop" },
    { test: /wagyu|angus beef|beef/, label: "beef" },
    { test: /lamb/, label: "lamb" },
    { test: /silky fowl|free range chicken|chicken/, label: "chicken" },
    { test: /jellyfish/, label: "jellyfish" },
    { test: /matsutake|morel|truffle|mushroom|fungus/, label: "mushroom" },
    { test: /tofu|bean curd/, label: "tofu" },
    { test: /eggplant|aubergine/, label: "eggplant" },
    { test: /asparagus/, label: "asparagus" },
    { test: /cucumber/, label: "cucumber" },
    { test: /rice/, label: "rice" },
    { test: /noodle|rice noodle/, label: "noodles" },
    { test: /mango/, label: "mango" },
    { test: /sago/, label: "sago" },
    { test: /sesame/, label: "sesame" },
    { test: /almond/, label: "almond" },
    { test: /coconut/, label: "coconut" },
    { test: /quail egg|egg/, label: "egg" },
    { test: /caviar/, label: "caviar" }
  ];

  const matches = entries.filter((entry) => entry.test.test(source)).map((entry) => entry.label);
  return uniqueValues(matches).slice(0, 4);
}

function getDishTechniqueSignal(item = {}) {
  const source = normalizeText(`${item.name || ""} ${item.description || ""} ${item.details || ""}`).toLowerCase();
  const entries = [
    {
      test: /apple wood|smoked/,
      label: "smoked",
      fact: "Smoke is a memory cue: it adds aroma before the guest even focuses on the sauce."
    },
    {
      test: /roasted|roast|barbecue|bbq/,
      label: "roasted",
      fact: "Roasting turns surface glaze into color, aroma, and texture, so shine matters as much as seasoning."
    },
    {
      test: /double boil|double boiled/,
      label: "double-boiled",
      fact: "Double-boiling is gentle on luxury ingredients because the soup stays protected while flavor extracts slowly."
    },
    {
      test: /braised/,
      label: "braised",
      fact: "Braising is a texture technique: time and sauce turn firm luxury ingredients tender without losing structure."
    },
    {
      test: /wok fried|wok-fried|stir fried|stir-fried|fried rice|fried noodle/,
      label: "wok-fried",
      fact: "The training cue is wok hei, the smoky aroma created by high heat, oil, motion, and timing."
    },
    {
      test: /steamed|steam/,
      label: "steamed",
      fact: "Steaming puts freshness on display because there is very little to hide behind if timing is off."
    },
    {
      test: /deep fried|deep-fried|crispy|fried/,
      label: "fried",
      fact: "Crisp dishes are about contrast: the outside should be lively while the inside still tastes like the main ingredient."
    },
    {
      test: /poached/,
      label: "poached",
      fact: "Poaching is a quiet technique; the liquid seasons gently while keeping the protein delicate."
    },
    {
      test: /grilled/,
      label: "grilled",
      fact: "Grilling gives a dish a direct-heat aroma, which can make a simple sauce feel more layered."
    },
    {
      test: /marinated|cold|salad/,
      label: "chilled or marinated",
      fact: "Cold starters rely on seasoning balance and texture because they do not have steam or heat to carry aroma."
    },
    {
      test: /baked|bun|pastry/,
      label: "baked",
      fact: "Baked dim sum adds fragrance and texture to a tea-house spread that might otherwise be mostly steamed."
    },
    {
      test: /clay pot|claypot|casserole/,
      label: "clay-pot cooked",
      fact: "Clay pots hold heat after leaving the stove, so the dish keeps cooking and perfuming the table."
    }
  ];
  return findDishKeyword(source, entries);
}

function getDishSpecialHook(item = {}) {
  const name = normalizeText(item.name);
  const source = normalizeText(`${item.name || ""} ${item.description || ""}`).toLowerCase();
  const abaloneSize = name.match(/\(([^)]*g dried[^)]*)\)/i)?.[1];

  if (/42 days/.test(source)) {
    return {
      feature: "the 42-day duck and apple-wood roast cue",
      history: `${name} makes the age and roast style part of the story, turning a Beijing banquet classic into a signature training item.`,
      fact: "The number is useful for staff: 42 days gives guests a concrete detail to remember before the duck is carved or served."
    };
  }
  if (/duck rack/.test(source)) {
    return {
      feature: "the second-life duck rack course",
      history: `${name} continues the Peking duck ritual by using the carved rack instead of treating it as an afterthought.`,
      fact: "A duck rack course teaches whole-animal service: the prized roast becomes more than one dish."
    };
  }
  if (/yellow mountain|huangshan/.test(source)) {
    return {
      feature: "Yellow Mountain honey over Iberico pork",
      history: `${name} blends Cantonese barbecue thinking with a Chinese honey cue and Spanish Iberico pork richness.`,
      fact: "Honey is not only sweetness here; it helps build the glossy lacquer that guests expect from polished Cantonese roast meats."
    };
  }
  if (/quail egg/.test(source)) {
    return {
      feature: "the soft quail egg center",
      history: `${name} personalizes siu mai by hiding a small luxury detail inside a familiar open-topped dumpling.`,
      fact: "The quail egg makes the bite feel staged: first the wrapper and filling, then a richer center."
    };
  }
  if (/black truffle|truffle/.test(source)) {
    return {
      feature: "black truffle aroma",
      history: `${name} shows the modern Mott32 style: classic Chinese structure with a luxury aromatic ingredient layered on top.`,
      fact: "Truffle works best as aroma, so it is a server cue before it is a flavor cue."
    };
  }
  if (/caviar/.test(source)) {
    return {
      feature: "caviar as a modern banquet garnish",
      history: `${name} pushes seafood dumpling service into fine-dining territory by adding a caviar finish to a dim sum format.`,
      fact: "Caviar gives a quick pop of salinity, which makes scallop and prawn taste sweeter by contrast."
    };
  }
  if (/fish maw/.test(source)) {
    return {
      feature: "fish maw texture",
      history: `${name} belongs to the Chinese luxury-soup world, where dried seafood is valued for texture as much as flavor.`,
      fact: "Fish maw is the dried swim bladder of fish; its prized quality is a soft, gelatinous texture that absorbs broth."
    };
  }
  if (/bird.?s nest/.test(source)) {
    return {
      feature: "bird's nest delicacy",
      history: `${name} focuses on one of Chinese banquet cuisine's most famous luxury soup ingredients.`,
      fact: "Bird's nest is valued for delicate texture, so aggressive seasoning would miss the point."
    };
  }
  if (abaloneSize) {
    return {
      feature: `${abaloneSize} abalone sizing`,
      history: `${name} makes the abalone size part of the service story, which matters because dried abalone is graded and discussed like a luxury product.`,
      fact: `${abaloneSize} is not decoration in the name; it is a buying and service cue for portion, rarity, and perceived value.`
    };
  }
  if (/sea cucumber/.test(source)) {
    return {
      feature: "sea cucumber texture",
      history: `${name} follows Chinese banquet logic where texture-rich seafoods are paired with glossy sauces and careful braising.`,
      fact: "Sea cucumber is subtle in flavor, so the sauce and texture carry the guest experience."
    };
  }
  if (/mapo|ma po/.test(source)) {
    return {
      feature: "lobster with mapo tofu",
      history: `${name} turns a Chengdu tofu classic into a luxury seafood dish by pairing mala sauce with lobster.`,
      fact: "Mapo's lesson is mala: numbing Sichuan pepper plus chili heat. Lobster makes that familiar profile feel celebratory."
    };
  }
  if (/golden garlic|garlic.*chili|chili.*garlic/.test(source)) {
    return {
      feature: "golden garlic and chili",
      history: `${name} uses a Cantonese seafood approach where aromatics become the headline alongside the shellfish.`,
      fact: "Golden garlic is a texture cue as much as a flavor cue: it should smell toasted, not burnt."
    };
  }
  if (/ginger.*scallion|scallion.*ginger/.test(source)) {
    return {
      feature: "ginger and scallion",
      history: `${name} leans on one of Cantonese seafood cooking's cleanest pairings: ginger for lift and scallion for freshness.`,
      fact: "Ginger-scallion is popular because it flatters seafood without covering up sweetness."
    };
  }
  if (/jellyfish/.test(source)) {
    return {
      feature: "jellyfish crunch",
      history: `${name} fits the Chinese cold-appetizer tradition, where texture wakes up the palate before hot courses arrive.`,
      fact: "Jellyfish is valued less for strong flavor and more for its crisp, snappy bite."
    };
  }
  if (/black vinegar/.test(source)) {
    return {
      feature: "black vinegar sharpness",
      history: `${name} uses black vinegar as a Chinese souring note, giving the dish depth beyond simple acidity.`,
      fact: "Black vinegar tastes darker and rounder than plain vinegar, with a malty aroma that helps rich ingredients feel lighter."
    };
  }
  if (/szechuan|sichuan|peppercorn/.test(source)) {
    return {
      feature: "Sichuan peppercorn numbness",
      history: `${name} brings a Sichuan-style mala cue into the Mott32 menu, using peppercorn aroma as the memorable hook.`,
      fact: "Sichuan peppercorn is not chili heat; it creates a tingling sensation that changes how the next bite tastes."
    };
  }
  if (/matsutake/.test(source)) {
    return {
      feature: "matsutake mushroom aroma",
      history: `${name} treats mushroom as a luxury aromatic ingredient rather than just a garnish.`,
      fact: "Matsutake is prized for fragrance, so gentle soup service helps protect its aroma."
    };
  }
  if (/mango|pomelo|sago/.test(source)) {
    return {
      feature: "mango, pomelo, and sago texture",
      history: `${name} belongs to the modern Hong Kong dessert style that favors fruit, chill, and texture after a rich meal.`,
      fact: "The fun is in the contrast: mango is creamy, pomelo pops, and sago gives tiny pearls of chew."
    };
  }
  if (/vegan|plant based|tofu/.test(source)) {
    return {
      feature: "plant-based texture",
      history: `${name} uses Chinese vegetarian logic: sauce, filling, and texture make a meatless item feel complete.`,
      fact: "A good vegan version works when the texture has a clear job, not when it simply imitates meat."
    };
  }

  return null;
}

function personalizeOriginTeaser(teaser, itemName) {
  const name = itemName || "This item";
  return normalizeText(teaser)
    .replace(/^Origin note: This item/i, `Origin note: ${name}`)
    .replace(/^Origin note: This dish/i, `Origin note: ${name}`)
    .replace(/^Origin note: This dessert/i, `Origin note: ${name}`)
    .replace(/^Origin note: Chinese egg tarts/i, `Origin note: ${name}`)
    .replace(/^Origin note: Mango sago/i, `Origin note: ${name}`)
    .replace(/^Origin note: Abalone/i, `Origin note: ${name}`)
    .replace(/^Origin note: Sweet-and-sour cooking/i, `Origin note: ${name}`)
    .replace(/^Origin note: Clay-pot dishes/i, `Origin note: ${name}`)
    .replace(/^Origin note: Spring rolls/i, `Origin note: ${name}`);
}

function buildPersonalizedDishCopy(item, profile) {
  const name = normalizeText(item.name) || "This item";
  const categoryLabel = getCategoryLabel(normalizeCategoryValue(item.category)).toLowerCase();
  const ingredients = getDishIngredientSignals(item);
  const ingredientPhrase = joinReadableList(ingredients.slice(0, 3));
  const technique = getDishTechniqueSignal(item);
  const hook = getDishSpecialHook(item);
  const featurePhrase =
    hook?.feature ||
    [technique?.label, ingredientPhrase ? `with ${ingredientPhrase}` : "", `in the ${categoryLabel} section`]
      .filter(Boolean)
      .join(" ");
  const itemHistory =
    hook?.history ||
    `${name} personalizes that tradition through ${featurePhrase}, so the server story can connect origin, technique, and the guest-facing name.`;
  const itemFact =
    hook?.fact ||
    technique?.fact ||
    (ingredientPhrase
      ? `The quick memory hook is ${ingredientPhrase}: it tells the guest what to focus on before the sauce or garnish.`
      : profile.fact);

  return {
    description: `${personalizeOriginTeaser(profile.teaser, name)} Mott 32's version highlights ${featurePhrase}.`,
    details: `Dish history: ${profile.history} ${itemHistory} Fun fact: ${itemFact}`
  };
}

function getDishHistoryProfile(item = {}) {
  const name = normalizeText(item.name);
  const lowerName = name.toLowerCase();
  const category = normalizeCategoryValue(item.category);
  const categoryLabel = getCategoryLabel(category).toLowerCase();
  const haystack = `${lowerName} ${category} ${categoryLabel}`;

  const profiles = [
    {
      test: /peking duck|roast duck|duck/,
      teaser: "Origin note: This dish connects to Beijing imperial roast-duck traditions, where crisp skin, table carving, pancakes, and condiments became part of the ceremony.",
      history: "Peking duck grew from Chinese court roasting traditions and became closely associated with Beijing banquet dining during the Ming and Qing eras.",
      fact: "The classic presentation is not only flavor-driven; the carving, pancakes, cucumber, scallion, and sauce turn the dish into a tableside ritual."
    },
    {
      test: /soup dumpling|xiao long|shanghainese/,
      teaser: "Origin note: This item follows the Shanghai-area soup dumpling tradition, famous for thin wrappers that hold broth made from melted aspic.",
      history: "Xiao long bao is strongly tied to Nanxiang near Shanghai, where smaller, delicate steamed buns with jellied stock became a local specialty.",
      fact: "The soup is sealed inside as gelatin-rich stock; steaming melts it into broth, which is why the dumpling must be handled gently."
    },
    {
      test: /siu mai|shumai|sui mai/,
      teaser: "Origin note: Siu mai traveled from northern Chinese dumpling traditions into Cantonese dim sum, where it became a tea-house classic.",
      history: "Siu mai has roots in northern Chinese open-topped dumplings and later became one of the signature items of Cantonese dim sum service.",
      fact: "In Cantonese dim sum culture, siu mai is often grouped with har gow, char siu bao, and egg tarts as classic tea-house staples."
    },
    {
      test: /har gow|shrimp dumpling|prawn dumpling|crystal/,
      teaser: "Origin note: Crystal shrimp dumplings come from Cantonese yum cha culture, especially the Pearl River Delta love of fresh seafood.",
      history: "Har gow is associated with Guangzhou tea houses in the early twentieth century, where translucent wrappers showed off fresh shrimp.",
      fact: "The wrapper is part of the skill: it should be thin and clear enough to show the filling but strong enough to hold the steam."
    },
    {
      test: /spring roll/,
      teaser: "Origin note: Spring rolls trace back to springtime Chinese festival foods, when thin wrappers carried seasonal vegetables.",
      history: "Spring rolls developed from older spring pancakes and seasonal wrapped foods connected to the arrival of spring.",
      fact: "The name points to the season; crisp rolls became especially symbolic around Lunar New Year because they resemble gold bars."
    },
    {
      test: /char siu|barbecue|bbq|iberico pork|pluma|pork belly|roasted pork/,
      teaser: "Origin note: This item draws from Cantonese siu mei barbecue culture, the roasted-meat tradition often displayed in Hong Kong and Guangdong shops.",
      history: "Char siu and related Cantonese roast meats belong to siu mei, a family of glazed, roasted meats from Guangdong cooking.",
      fact: "Char siu literally refers to fork-roasting: strips of seasoned meat were traditionally skewered before roasting."
    },
    {
      test: /dim sum|dumpling|bao|bun|turnip cake|taro|sesame prawn|shrimp toast|steamed|baked/,
      teaser: "Origin note: This dish fits Cantonese dim sum culture, where small plates grew around yum cha tea-house gatherings.",
      history: "Dim sum developed through tea-house culture, especially in southern China, where small bites were served with tea and conversation.",
      fact: "Yum cha means drinking tea; the food became part of a social rhythm as much as a meal."
    },
    {
      test: /bird.?s nest|hasma/,
      teaser: "Origin note: This dish sits in the Chinese luxury-soup tradition, where rare ingredients are treated gently to preserve texture and aroma.",
      history: "Bird's nest soup has long been prized in Chinese banquet and tonic traditions, especially from the Ming-era luxury-food imagination onward.",
      fact: "Double steaming is used for rare ingredients because the covered vessel protects the liquid and captures the ingredient's delicate essence."
    },
    {
      test: /double boil|double boiled|fish maw|hot sour|hot & sour|soup|broth/,
      teaser: "Origin note: This dish belongs to the Cantonese slow-soup tradition, where gentle cooking highlights clarity, texture, and nourishment.",
      history: "Cantonese kitchens are known for slow soups and double-boiling techniques that use time, not aggressive heat, to draw out flavor.",
      fact: "In double boiling, the soup vessel sits inside steam or water, keeping the liquid from reducing while expensive ingredients cook gently."
    },
    {
      test: /abalone/,
      teaser: "Origin note: Abalone has a long place in Chinese banquet dining as a luxury seafood linked with prosperity and status.",
      history: "In Chinese fine dining, abalone became a prized banquet ingredient because of its rarity, texture, and association with wealth.",
      fact: "The Cantonese name for abalone sounds close to ideas of assurance and abundance, which helps explain its festive popularity."
    },
    {
      test: /mapo|ma po/,
      teaser: "Origin note: Mapo tofu comes from Sichuan cooking, famous for the numbing-hot balance of chili bean paste and Sichuan peppercorn.",
      history: "Mapo tofu is tied to Chengdu in the late Qing dynasty and to the story of Chen Mapo, whose tofu dish became a Sichuan icon.",
      fact: "The classic flavor is mala: ma for numbing Sichuan peppercorn and la for chili heat."
    },
    {
      test: /lobster|crab|grouper|\bfish\b|garoupa|goby|bass|scallop|prawn|shrimp|clam|seafood|cod/,
      teaser: "Origin note: This item reflects Cantonese live-seafood cooking, where freshness, precise heat, and light sauces are used to protect natural sweetness.",
      history: "Coastal Guangdong and Hong Kong cooking built a strong live-seafood culture around steaming, wok-frying, and sauces that respect the main ingredient.",
      fact: "For seafood, Cantonese chefs often treat texture as the proof of skill: overcooking can erase the sweetness the dish is meant to showcase."
    },
    {
      test: /clay pot|claypot|casserole/,
      teaser: "Origin note: Clay-pot dishes come from southern Chinese comfort cooking, where the vessel traps heat and builds a savory crust or concentrated sauce.",
      history: "Clay-pot cooking is common in Guangdong and Hong Kong, where rice, meats, and sauces are finished in heat-retaining earthenware.",
      fact: "The best-known clay-pot rice develops a crisp bottom layer, similar in spirit to tahdig or paella socarrat."
    },
    {
      test: /wok|fried rice|noodle|rice noodle|lo mein|flat rice|hor fun/,
      teaser: "Origin note: This item is rooted in wok cooking, where speed, high heat, and timing create the prized Cantonese aroma called wok hei.",
      history: "Wok-fried rice and noodles grew from practical Chinese cooking: cooked grains or noodles are refreshed quickly with sauces, aromatics, and heat.",
      fact: "Wok hei means the breath of the wok, a smoky aroma created by intense heat, motion, oil, and precise timing."
    },
    {
      test: /mapo|ma po/,
      teaser: "Origin note: Mapo tofu comes from Sichuan cooking, famous for the numbing-hot balance of chili bean paste and Sichuan peppercorn.",
      history: "Mapo tofu is tied to Chengdu in the late Qing dynasty and to the story of Chen Mapo, whose tofu dish became a Sichuan icon.",
      fact: "The classic flavor is mala: ma for numbing Sichuan peppercorn and la for chili heat."
    },
    {
      test: /kung pao|gong bao/,
      teaser: "Origin note: Kung pao flavors are linked to Qing-dynasty Sichuan cooking and the official Ding Baozhen, whose title was Gong Bao.",
      history: "Kung pao dishes are associated with Ding Baozhen, a Qing official whose honorary title, Gong Bao, gave the dish its name.",
      fact: "The recognizable profile balances dried chili, nutty richness, sweetness, vinegar, and a light numbing edge."
    },
    {
      test: /cucumber|jellyfish|salad|cold/,
      teaser: "Origin note: This dish fits the Chinese cold-appetizer tradition, where refreshing texture and sharp seasoning wake up the palate before richer courses.",
      history: "Cold dishes, often called liangcai, are common openers in Chinese meals because they balance temperature, crunch, vinegar, spice, or aromatics.",
      fact: "A good cold starter is not just a salad; it sets the rhythm before steamed, roasted, and wok-fried dishes arrive."
    },
    {
      test: /sweet.*sour|black vinegar|vinegar/,
      teaser: "Origin note: Sweet-and-sour cooking shows the Chinese banquet love of contrast: bright vinegar, sweetness, crisp texture, and glossy sauce.",
      history: "Sweet-and-sour flavors appear across Chinese regional cooking, with Cantonese and Hong Kong styles helping popularize glossy banquet versions abroad.",
      fact: "Black vinegar adds depth beyond sharpness; it brings malt-like aroma and a darker, rounder finish."
    },
    {
      test: /egg tart|custard tart/,
      teaser: "Origin note: Chinese egg tarts show Hong Kong and Guangdong adapting European custard pastry into dim sum and bakery culture.",
      history: "Custard tarts entered southern Chinese foodways through contact with British and Portuguese pastry traditions, then became a Hong Kong tea-house favorite.",
      fact: "Hong Kong-style tarts tend to be smooth and glossy, while Macau-style tarts are usually more caramelized on top."
    },
    {
      test: /mango|sago|pomelo/,
      teaser: "Origin note: Mango sago is a modern Hong Kong dessert, created for a tropical, refreshing finish rather than an ancient banquet ritual.",
      history: "Mango pomelo sago is widely credited to Hong Kong restaurant innovation in the 1980s and spread through Cantonese dessert shops.",
      fact: "Its appeal is texture: mango cream, pomelo pop, coconut richness, and tiny sago pearls all hit differently in one spoon."
    },
    {
      test: /almond|sesame|red bean|green bean|tong sui|coconut|snow swallow|sweet soup/,
      teaser: "Origin note: This dessert belongs to the Cantonese tong sui tradition, where sweet soups are served warm or chilled after a meal.",
      history: "Tong sui, literally sugar water, is a Cantonese dessert category built around sweet broths, beans, nuts, seeds, and seasonal textures.",
      fact: "Many tong sui desserts are valued as much for mouthfeel and soothing warmth as for sweetness."
    },
    {
      test: /tofu|bean curd|vegan|vegetarian|mushroom|eggplant|vegetable|greens|asparagus|gai lan|pea shoot/,
      teaser: "Origin note: This dish connects to Chinese vegetable and Buddhist-influenced vegetarian traditions, where texture and sauce make simple ingredients feel complete.",
      history: "Chinese vegetable cooking often treats greens, tofu, mushrooms, and aromatics as central dishes rather than side notes.",
      fact: "Texture is the hidden lesson: crisp greens, silky tofu, and springy mushrooms each need a different heat strategy."
    },
    {
      test: /cucumber|jellyfish|salad|starter|cold/,
      teaser: "Origin note: This dish fits the Chinese cold-appetizer tradition, where refreshing texture and sharp seasoning wake up the palate before richer courses.",
      history: "Cold dishes, often called liangcai, are common openers in Chinese meals because they balance temperature, crunch, vinegar, spice, or aromatics.",
      fact: "A good cold starter is not just a salad; it sets the rhythm before steamed, roasted, and wok-fried dishes arrive."
    },
    {
      test: /beef|wagyu|lamb|pork|chicken|meat/,
      teaser: "Origin note: This dish reflects modern Chinese banquet cooking, where regional sauces and wok techniques are applied to premium proteins.",
      history: "Chinese banquet meat dishes often blend older regional sauces with newer luxury ingredients, especially in modern fine-dining restaurants.",
      fact: "For wok-fried meats, the sauce should cling without drowning the protein; gloss and aroma are part of the craft."
    }
  ];

  const categoryProfiles = {
    "steamed-dim-sum": {
      teaser: "Origin note: This item comes from the Cantonese dim sum world, where tea, steam baskets, and shared small plates define the experience.",
      history: "Steamed dim sum grew around yum cha service, turning small bites into a social way to study texture, filling, and technique.",
      fact: "The bamboo steamer is part cooking tool, part serving vessel, keeping dumplings warm while they are shared."
    },
    "baked-fried": {
      teaser: "Origin note: This item reflects the crisp side of dim sum, where pastry, frying, and fillings add contrast to steamed baskets.",
      history: "Baked and fried dim sum expanded tea-house menus with textures that could contrast soft steamed dumplings.",
      fact: "The best examples stay crisp without feeling heavy, which is why timing matters so much."
    },
    soups: {
      teaser: "Origin note: This item belongs to the Cantonese soup tradition, where slow extraction and delicate texture matter more than heavy seasoning.",
      history: "Cantonese soup culture prizes clarity, nourishment, and long simmering or double-boiling.",
      fact: "Soup often works as a quiet luxury course: simple-looking, but time-intensive."
    },
    desserts: {
      teaser: "Origin note: This dessert follows Cantonese sweet-course thinking, where texture, temperature, and refreshment are as important as sugar.",
      history: "Cantonese dessert culture ranges from old tong sui sweet soups to modern Hong Kong chilled creations.",
      fact: "Many Chinese desserts aim for a gentle finish instead of the heavy sweetness common in Western plated desserts."
    }
  };

  const profile = profiles.find((entry) => entry.test.test(haystack)) || categoryProfiles[category] || {
    teaser: `Origin note: ${name || "This dish"} reflects modern Chinese fine dining, where regional techniques are adapted for a polished menu-training experience.`,
    history: "This dish is best understood through its technique and category rather than a single fixed origin story.",
    fact: "A useful training angle is to connect the item to its cooking method, main ingredient, and service style."
  };

  return buildPersonalizedDishCopy(item, profile);
}

function isGeneratedDishHistoryCopy(value = "") {
  const text = normalizeText(value).toLowerCase();
  return text.startsWith("origin note:") || text.startsWith("dish history:");
}

function shouldRestoreMott32Description(item, defaultMatch) {
  if (!defaultMatch) return false;
  const description = normalizeText(item.description);
  if (!description) return true;
  if (isGeneratedDishHistoryCopy(description)) return true;
  return false;
}

function shouldReplaceMott32Details(item, defaultMatch) {
  const details = normalizeText(item.details);
  if (!details) return true;
  if (isGeneratedDishHistoryCopy(details)) return true;
  if (defaultMatch && details === normalizeText(defaultMatch.details)) return true;
  return /^section:/i.test(details) || /review menu matrix/i.test(details) || /ingredients:/i.test(details);
}

function applyMott32HistoryFacts(item = {}) {
  const normalizedItem = normalizeMenuItem(item);
  const defaultMatch = defaultMenuItems.find((defaultItem) => defaultItem.id === normalizedItem.id);
  const description = shouldRestoreMott32Description(normalizedItem, defaultMatch)
    ? defaultMatch.description
    : normalizedItem.description;
  const historyFacts = getDishHistoryProfile({ ...normalizedItem, description });

  return {
    ...normalizedItem,
    description,
    details: shouldReplaceMott32Details(normalizedItem, defaultMatch)
      ? historyFacts.details
      : normalizedItem.details
  };
}

function applyMott32HistoryFactsToItems(items = []) {
  return items.map(applyMott32HistoryFacts);
}

function normalizeMenuItem(item) {
  const defaultMatch = defaultMenuItems.find((defaultItem) => defaultItem.id === item.id);
  const category = normalizeCategoryValue(item.category);
  const images = getItemImages(item);

  return {
    ...item,
    category: categories.includes(category) ? category : categories[0] || "starters",
    details: item.details || defaultMatch?.details || "Dish history, origin notes, and fun facts can go here.",
    ingredients: normalizeIngredientList(item.ingredients || defaultMatch?.ingredients || []),
    image: images[0] || "",
    images,
    updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : ""
  };
}

function normalizeIngredientList(values = []) {
  const list = Array.isArray(values) ? values : [values];
  return uniqueValues(
    list.flatMap((value) =>
      String(value || "")
        .split(/[,;\n]/)
        .map((ingredient) => ingredient.trim())
    )
  );
}

function normalizeItemImageList(images = []) {
  const seen = new Set();
  return images
    .flatMap((image) => String(image || "").split(/\r?\n/))
    .map((image) => image.trim())
    .filter((image) => {
      if (!image || seen.has(image)) return false;
      seen.add(image);
      return true;
    });
}

function getItemImages(item = {}) {
  const savedImages = Array.isArray(item.images) ? item.images : [];
  return normalizeItemImageList([...savedImages, item.image]);
}

function isDefaultStockItemImage(imageUrl) {
  const source = String(imageUrl || "").trim();
  if (!source) return false;

  if (!isDefaultStockItemImage.urls) {
    isDefaultStockItemImage.urls = new Set(
      defaultMenuItems
        .map((item) => String(item.image || "").trim())
        .filter(Boolean)
    );
    isDefaultStockItemImage.urls.add("https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80");
  }

  return isDefaultStockItemImage.urls.has(source);
}

function clearDefaultStockImagesForMenuItems(items = []) {
  return items.map((item) => {
    const images = getItemImages(item).filter((image) => !isDefaultStockItemImage(image));
    return {
      ...item,
      image: images[0] || "",
      images
    };
  });
}

function saveMenuItems() {
  localStorage.setItem(storageKey, JSON.stringify(menuItems));
  persistActiveRestaurantMenuData();
  if (restaurantList) renderRestaurantList();
}

function loadDesignSettings() {
  const savedDesign = localStorage.getItem(designStorageKey);
  if (!savedDesign) return normalizeDesignSettings(defaultDesign);

  try {
    return normalizeDesignSettings(JSON.parse(savedDesign));
  } catch {
    return normalizeDesignSettings(defaultDesign);
  }
}

function saveDesignSettings() {
  designSettings = normalizeDesignSettings(designSettings);
  localStorage.setItem(designStorageKey, JSON.stringify(designSettings));
  persistActiveRestaurantMenuData();
}

function getActiveRestaurantMenu() {
  if (state.sharedMenu) return state.sharedMenu;

  const visibleMenus = getVisibleRestaurantMenus();
  return visibleMenus.find((menu) => menu.id === state.activeRestaurantMenu) || visibleMenus[0] || null;
}

function syncActiveRestaurantMenuData() {
  const activeMenu = getActiveRestaurantMenu();
  if (state.sharedMenu) {
    menuItems = activeMenu?.items?.map(normalizeMenuItem) || [];
    designSettings = normalizeDesignSettings(activeMenu?.designSettings || { ...defaultDesign, heroImage: "" });
    localStorage.setItem(storageKey, JSON.stringify(menuItems));
    localStorage.setItem(designStorageKey, JSON.stringify(designSettings));
    return;
  }

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
  if (state.sharedMenu) return;

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

function applyMenuAnimationIntensity(value) {
  const intensity = getMenuAnimationIntensity(value);
  const factor = intensity / 100;
  const revealY = Math.round(factor * 30);
  const revealScale = (1 - factor * 0.03).toFixed(3);
  const startOpacity = (1 - factor * 0.16).toFixed(2);
  const duration = Math.round(340 + factor * 500);

  document.documentElement.style.setProperty("--menu-row-reveal-y", `${revealY}px`);
  document.documentElement.style.setProperty("--menu-row-reveal-scale", revealScale);
  document.documentElement.style.setProperty("--menu-row-start-opacity", startOpacity);
  document.documentElement.style.setProperty("--menu-row-reveal-duration", `${duration}ms`);
}

function applyDesignSettings() {
  designSettings = normalizeDesignSettings(designSettings);
  document.documentElement.style.setProperty("--ink", designSettings.ink);
  document.documentElement.style.setProperty("--leaf", designSettings.leaf);
  document.documentElement.style.setProperty("--gold", designSettings.gold);
  document.documentElement.style.setProperty("--aqua", designSettings.aqua);
  document.documentElement.style.setProperty("--page-bg", designSettings.page);
  document.documentElement.style.setProperty("--panel-bg", designSettings.panel);
  document.documentElement.style.setProperty("--item-photo-size", `${designSettings.itemPhotoSize}px`);
  document.documentElement.style.setProperty("--front-media-phone-size", `${designSettings.frontMediaPhoneSize}%`);
  document.documentElement.style.setProperty("--front-media-web-size", `${designSettings.frontMediaWebSize}%`);
  document.documentElement.style.setProperty("--front-media-blur", `${designSettings.frontMediaBlur}px`);
  applyMenuAnimationIntensity(designSettings.menuAnimationIntensity);
  const hasHeroImage = Boolean(designSettings.heroImage);
  heroImage.hidden = !hasHeroImage;
  heroImage.closest(".logo-hero")?.classList.toggle("is-empty", !hasHeroImage);
  if (hasHeroImage) {
    heroImage.src = designSettings.heroImage;
  } else {
    heroImage.removeAttribute("src");
  }
  applyFrontMediaSettings();
  renderRestaurantList();
}

function applyFrontMediaSettings() {
  const mediaUrl = designSettings.frontMediaUrl || defaultFrontMediaUrl;
  const mediaType = designSettings.frontMediaType === "image" ? "image" : "video";
  const authPairs = [
    { image: authBackgroundImage, video: authBackgroundVideo },
    { image: registerBackgroundImage, video: registerBackgroundVideo }
  ];

  authPairs.forEach(({ image, video }) => {
    if (!image || !video) return;
    image.hidden = mediaType !== "image";
    video.hidden = mediaType !== "video";

    if (mediaType === "image") {
      image.src = mediaUrl;
      pauseFrontVideo(video);
      return;
    }

    image.removeAttribute("src");
    setFrontVideoSource(video, mediaUrl);
  });
}

function setFrontVideoSource(video, mediaUrl) {
  if (video.dataset.mediaUrl !== mediaUrl) {
    video.dataset.mediaUrl = mediaUrl;
    video.src = mediaUrl;
    video.load();
  }

  video.dataset.loopLength = String(designSettings.frontVideoLength || 0);
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.play?.().catch(() => {});
}

function pauseFrontVideo(video) {
  video.pause?.();
  video.removeAttribute("src");
  video.dataset.mediaUrl = "";
}

function handleFrontVideoTimeUpdate(event) {
  const video = event.currentTarget;
  const loopLength = Number(video.dataset.loopLength) || 0;
  if (!loopLength || video.currentTime < loopLength) return;
  video.currentTime = 0;
  video.play?.().catch(() => {});
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
  itemPhotoSize.value = String(designSettings.itemPhotoSize);
  itemPhotoSizeValue.textContent = `${designSettings.itemPhotoSize}px`;
  menuAnimationIntensity.value = String(designSettings.menuAnimationIntensity);
  menuAnimationIntensityValue.textContent = formatMenuAnimationIntensity(designSettings.menuAnimationIntensity);
  frontMediaType.value = designSettings.frontMediaType;
  frontMediaUrl.value = designSettings.frontMediaUrl;
  frontMediaFile.value = "";
  frontMediaPhoneSize.value = String(designSettings.frontMediaPhoneSize);
  frontMediaPhoneSizeValue.textContent = `${designSettings.frontMediaPhoneSize}%`;
  frontMediaWebSize.value = String(designSettings.frontMediaWebSize);
  frontMediaWebSizeValue.textContent = `${designSettings.frontMediaWebSize}%`;
  frontMediaBlur.value = String(designSettings.frontMediaBlur);
  frontMediaBlurValue.textContent = `${designSettings.frontMediaBlur}px`;
  frontVideoLength.value = String(designSettings.frontVideoLength);
  resetUploadPreview({
    preview: heroUploadPreview,
    image: heroPreviewImage,
    progress: heroUploadProgress,
    status: heroUploadStatus,
    imageUrl: designSettings.heroImage,
    message: designSettings.heroImage ? "Current header image. Choose a file to replace it." : "No header image selected yet."
  });
  renderFrontMediaPreview(
    designSettings.frontMediaUrl,
    designSettings.frontMediaType,
    designSettings.frontMediaUrl ? "Current front page media. Upload a file or paste a URL to replace it." : "No front page media selected yet."
  );
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

function renderFrontMediaPreview(mediaUrl = "", mediaType = "video", message = "Select a front image or video to preview it.") {
  if (!frontMediaPreview || !frontMediaPreviewFrame || !frontMediaUploadProgress || !frontMediaUploadStatus) return;

  const normalizedType = mediaType === "image" ? "image" : "video";
  frontMediaPreviewFrame.replaceChildren();
  frontMediaPreview.hidden = !mediaUrl;
  frontMediaUploadProgress.value = mediaUrl ? 100 : 0;
  frontMediaUploadProgress.hidden = !mediaUrl;
  frontMediaUploadStatus.textContent = message;

  if (!mediaUrl) return;

  const media = document.createElement(normalizedType === "image" ? "img" : "video");
  media.src = mediaUrl;
  if (normalizedType === "video") {
    media.muted = true;
    media.loop = true;
    media.playsInline = true;
    media.autoplay = true;
  } else {
    media.alt = "";
  }
  frontMediaPreviewFrame.append(media);
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
        percent: 6 + Math.round(percent * 0.24),
        message: "Reading image..."
      });
    });
    setUploadProgress({ preview, progress, status, percent: 54, message: "Compressing image..." });

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

function getCloudStorageClient() {
  return cloudSync.client?.storage || window.menuMatrixFirebase?.storage || null;
}

function canUploadItemPhotosToCloud() {
  const storage = getCloudStorageClient();
  return Boolean(itemPhotoCloudUploadsEnabled && storage?.ref && getActiveUser());
}

function isInlineItemPhotoUrl(imageUrl) {
  return /^data:image\//i.test(String(imageUrl || "").trim());
}

function getInlineItemPhotoUrls(item) {
  return getItemImages(item).filter(isInlineItemPhotoUrl);
}

function getSafeStorageSegment(value, fallback = "file") {
  const segment = String(value || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return segment || fallback;
}

function getFileExtensionFromType(contentType = "") {
  if (/png/i.test(contentType)) return "png";
  if (/webp/i.test(contentType)) return "webp";
  if (/gif/i.test(contentType)) return "gif";
  return "jpg";
}

function dataUrlToBlob(dataUrl) {
  const match = String(dataUrl || "").match(/^data:([^;,]+)?(;base64)?,(.*)$/);
  if (!match) throw new Error("Could not prepare image upload.");

  const contentType = match[1] || "image/jpeg";
  const isBase64 = Boolean(match[2]);
  const source = match[3] || "";
  const binary = isBase64 ? atob(source) : decodeURIComponent(source);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: contentType });
}

async function uploadItemPhotoToCloud(dataUrl, { itemId, file, index, total, onProgress, menuId = "" }) {
  const storage = getCloudStorageClient();
  if (!storage?.ref) throw new Error("Firebase Storage is not ready.");

  const blob = dataUrlToBlob(dataUrl);
  const activeMenuId = menuId || state.activeRestaurantMenu || getActiveRestaurantMenu()?.id || defaultRestaurantMenuId;
  const workspaceId = getWorkspaceDocumentId();
  const uploadId =
    window.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const fileBase = getSafeStorageSegment((file?.name || `photo-${index + 1}`).replace(/\.[^.]+$/, ""), "photo");
  const extension = getFileExtensionFromType(blob.type);
  const path = [
    "item-photos",
    getSafeStorageSegment(workspaceId, "workspace"),
    getSafeStorageSegment(activeMenuId, "menu"),
    getSafeStorageSegment(itemId, "item"),
    `${Date.now()}-${index + 1}-${fileBase}-${uploadId}.${extension}`
  ].join("/");

  const task = storage.ref().child(path).put(blob, {
    contentType: blob.type || "image/jpeg",
    customMetadata: {
      menuId: activeMenuId,
      owner: getActiveUser()?.username || "",
      originalName: file?.name || `photo-${index + 1}`,
      totalPhotos: String(total || 1)
    }
  });

  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snapshot) => {
        if (!snapshot.totalBytes) return;
        onProgress?.(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
      },
      reject,
      async () => {
        try {
          resolve(await task.snapshot.ref.getDownloadURL());
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

async function migrateInlineItemPhotosToCloud() {
  if (!canUploadItemPhotosToCloud()) return 0;

  let migratedCount = 0;
  let changed = false;

  for (const menu of restaurantMenus) {
    if (!Array.isArray(menu.items)) continue;

    const migratedItems = [];
    for (const item of menu.items) {
      const itemImages = getItemImages(item);
      if (!itemImages.some(isInlineItemPhotoUrl)) {
        migratedItems.push(item);
        continue;
      }

      const nextImages = [];
      let itemChanged = false;

      for (const [index, imageUrl] of itemImages.entries()) {
        if (!isInlineItemPhotoUrl(imageUrl)) {
          nextImages.push(imageUrl);
          continue;
        }

        try {
          const cloudUrl = await withTimeout(
            uploadItemPhotoToCloud(imageUrl, {
              itemId: item.id || `item-${Date.now()}`,
              file: { name: `migrated-photo-${index + 1}.jpg` },
              index,
              total: itemImages.length,
              menuId: menu.id
            }),
              60000,
              "Photo migration took too long."
          );
          nextImages.push(cloudUrl);
          migratedCount += 1;
          itemChanged = true;
        } catch (error) {
          console.warn("Could not migrate item photo to Firebase Storage.", error);
          nextImages.push(imageUrl);
        }
      }

      if (!itemChanged) {
        migratedItems.push(item);
        continue;
      }

      changed = true;
      const normalizedImages = normalizeItemImageList(nextImages);
      migratedItems.push({
        ...item,
        image: normalizedImages[0] || "",
        images: normalizedImages,
        updatedAt: new Date().toISOString()
      });
    }

    menu.items = migratedItems;
  }

  if (changed) {
    syncActiveRestaurantMenuData();
    localStorage.setItem(getRestaurantMenusStorageKey(), JSON.stringify(restaurantMenus.map(sanitizeRestaurantMenuForStorage)));
  }

  return migratedCount;
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

function normalizeAssignedMenuIds(values = []) {
  return uniqueValues(values.map((value) => String(value || "").trim()));
}

function normalizeUser(user = {}) {
  const username = String(user.username || "").trim();
  const status = ["active", "pending", "unverified", "deleted"].includes(user.status) ? user.status : "active";
  const explicitMenuIds = Array.isArray(user.menuIds)
    ? normalizeAssignedMenuIds(user.menuIds)
    : Array.isArray(user.assignedMenuIds)
      ? normalizeAssignedMenuIds(user.assignedMenuIds)
      : null;
  return {
    username,
    email: user.email || "",
    password: user.role === "owner" ? "" : user.password || "",
    role: ["admin", "owner", "editor"].includes(user.role) ? user.role : "editor",
    permissions:
      Array.isArray(user.permissions) && user.permissions.length
        ? getUniqueCategoryValues(user.permissions.map(normalizeCategoryValue)).filter((permission) => categories.includes(permission))
        : [],
    menuIds: explicitMenuIds,
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
    menuIds: normalized.menuIds,
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

function getAssignedMenuIds(user) {
  return Array.isArray(user?.menuIds) ? normalizeAssignedMenuIds(user.menuIds) : null;
}

function canUserAccessMenu(user, menu) {
  if (!user || !menu) return false;
  if (user.role === "admin") return true;

  const owner = getMenuOwner(menu);
  if (owner === user.username) return true;
  if (user.role !== "editor" || owner !== primaryAdminUsername) return false;

  const assignedMenuIds = getAssignedMenuIds(user);
  return assignedMenuIds === null ? true : assignedMenuIds.includes(menu.id);
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
  return restaurantMenus.filter((menu) => canUserAccessMenu(user, menu));
}

function loadSavedShareCodes() {
  const savedCodes = localStorage.getItem(savedShareCodesStorageKey);
  if (!savedCodes) return [];

  try {
    const parsed = JSON.parse(savedCodes);
    return Array.isArray(parsed)
      ? parsed
          .filter((entry) => entry?.code)
          .map((entry) => ({
            ...entry,
            code: normalizeShareCode(entry.code),
            pendingQuizResults: normalizeQuizResults(entry.pendingQuizResults)
          }))
      : [];
  } catch {
    return [];
  }
}

function getSavedShareCodeEntry(code) {
  const normalizedCode = normalizeShareCode(code);
  return loadSavedShareCodes().find((entry) => normalizeShareCode(entry.code) === normalizedCode) || null;
}

function saveSharedCodeLocally(code, menuName = "Shared menu", menuSnapshot = null, metadata = {}) {
  const normalizedCode = normalizeShareCode(code);
  if (!normalizedCode) return;

  const currentCodes = loadSavedShareCodes().filter((entry) => normalizeShareCode(entry.code) !== normalizedCode);
  const previousEntry = getSavedShareCodeEntry(normalizedCode);
  const metadataCategories = Array.isArray(metadata.categories) && metadata.categories.length ? metadata.categories : null;
  const sharedCategories = getUniqueCategories(metadataCategories || menuSnapshot?.categories || categories);
  const sanitizedMenu = menuSnapshot ? sanitizeRestaurantMenuForStorage(menuSnapshot) : null;
  const pendingQuizResults = normalizeQuizResults([
    ...(previousEntry?.pendingQuizResults || []),
    ...(metadata.pendingQuizResults || [])
  ]);
  const nextCodes = [
    {
      code: normalizedCode,
      menuName: menuName || sanitizedMenu?.name || "Shared menu",
      menuId: metadata.menuId || sanitizedMenu?.id || "",
      owner: metadata.owner || sanitizedMenu?.owner || "",
      categories: sharedCategories,
      menu: sanitizedMenu,
      updatedAt: metadata.updatedAt || "",
      pendingQuizResults,
      pendingSavedAt: pendingQuizResults.length ? previousEntry?.pendingSavedAt || metadata.pendingSavedAt || new Date().toISOString() : "",
      savedAt: new Date().toISOString()
    },
    ...currentCodes
  ].slice(0, 12);
  saveShareCodeEntries(nextCodes);
}

function saveShareCodeEntries(entries = []) {
  localStorage.setItem(
    savedShareCodesStorageKey,
    JSON.stringify(entries.filter((entry) => normalizeShareCode(entry.code)).slice(0, 12))
  );
  renderSavedShareCodes();
}

function savePendingSharedQuizResult(code, result) {
  const normalizedCode = normalizeShareCode(code);
  const normalizedResult = normalizeQuizResult(result);
  if (!normalizedCode || !normalizedResult.id) return;

  const currentCodes = loadSavedShareCodes();
  const existingIndex = currentCodes.findIndex((entry) => normalizeShareCode(entry.code) === normalizedCode);
  const existingEntry = existingIndex >= 0 ? currentCodes[existingIndex] : {};
  const pendingQuizResults = mergeQuizResults(existingEntry.pendingQuizResults || [], [normalizedResult]);
  const nextEntry = {
    ...existingEntry,
    code: normalizedCode,
    menuName: existingEntry.menuName || state.sharedMenu?.name || normalizedResult.menuName || "Shared menu",
    menuId: existingEntry.menuId || state.sharedMenu?.id || normalizedResult.menuId || "",
    owner: existingEntry.owner || state.sharedMenu?.owner || normalizedResult.owner || "",
    categories: existingEntry.categories || state.sharedMenu?.categories || categories,
    menu: existingEntry.menu || (state.sharedMenu ? sanitizeRestaurantMenuForStorage(state.sharedMenu) : null),
    pendingQuizResults,
    pendingSavedAt: new Date().toISOString(),
    savedAt: existingEntry.savedAt || new Date().toISOString()
  };

  const nextCodes = existingIndex >= 0
    ? currentCodes.map((entry, index) => (index === existingIndex ? nextEntry : entry))
    : [nextEntry, ...currentCodes];
  saveShareCodeEntries(nextCodes);
}

function clearPendingSharedQuizResults(code, syncedResults = []) {
  const normalizedCode = normalizeShareCode(code);
  if (!normalizedCode) return;

  const syncedIds = new Set(normalizeQuizResults(syncedResults).map((result) => result.id));
  const nextCodes = loadSavedShareCodes().map((entry) => {
    if (normalizeShareCode(entry.code) !== normalizedCode) return entry;
    const pendingQuizResults = normalizeQuizResults(entry.pendingQuizResults).filter((result) => !syncedIds.has(result.id));
    return {
      ...entry,
      pendingQuizResults,
      pendingSavedAt: pendingQuizResults.length ? entry.pendingSavedAt || "" : ""
    };
  });
  saveShareCodeEntries(nextCodes);
}

async function flushPendingSharedQuizResults(code) {
  const normalizedCode = normalizeShareCode(code);
  const pendingQuizResults = normalizeQuizResults(getSavedShareCodeEntry(normalizedCode)?.pendingQuizResults);
  if (!normalizedCode || !pendingQuizResults.length) return 0;

  const saved = await saveQuizResultsToShare(normalizedCode, pendingQuizResults);
  if (saved) {
    clearPendingSharedQuizResults(normalizedCode, pendingQuizResults);
    return pendingQuizResults.length;
  }
  return 0;
}

function renderSavedShareCodes() {
  if (!savedShareCodes) return;

  savedShareCodes.replaceChildren();
  const codes = loadSavedShareCodes();
  if (!codes.length) return;

  codes.forEach((entry) => {
    const button = document.createElement("button");
    button.className = "saved-share-code-button";
    button.type = "button";
    button.textContent = `${entry.menuName || "Shared menu"} - ${normalizeShareCode(entry.code)}`;
    button.addEventListener("click", () => {
      shareCodeInput.value = normalizeShareCode(entry.code);
      loadSharedMenuFromCode(entry.code);
    });
    savedShareCodes.append(button);
  });
}

function normalizeShareCode(code) {
  return String(code || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function getShareCodeValidationMessage(code) {
  const normalizedCode = normalizeShareCode(code);
  if (!normalizedCode) return "Enter a share code.";
  if (normalizedCode.length < 4) return "Use at least 4 letters or numbers.";
  if (normalizedCode.length > 24) return "Use 24 letters or numbers or fewer.";
  return "";
}

function generateShareCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(8);
  window.crypto?.getRandomValues?.(bytes);
  return [...bytes].map((byte) => alphabet[byte % alphabet.length]).join("");
}

function canShareActiveMenu() {
  return Boolean(getActiveUser() && getActiveRestaurantMenu() && (isAdmin() || ownsActiveMenu()));
}

function getFirebaseDb() {
  return cloudSync.client?.db || window.menuMatrixFirebase?.db || null;
}

function getShareCollection() {
  return getFirebaseDb()?.collection("menuShares") || null;
}

function getShareDocument(code) {
  const collection = getShareCollection();
  const normalizedCode = normalizeShareCode(code);
  return collection && normalizedCode ? collection.doc(normalizedCode) : null;
}

function createSharedMenuSnapshotPayload(code, data = {}) {
  const normalizedCode = normalizeShareCode(code || data.code);
  const sharedMenuData = data.menu && typeof data.menu === "object" ? data.menu : {};
  const quizResults = getShareQuizResults(data);
  const sharedCategories = Array.isArray(data.categories) && data.categories.length
    ? data.categories
    : Array.isArray(sharedMenuData.categories)
      ? sharedMenuData.categories
      : [];

  return {
    code: normalizedCode,
    updatedAt: data.updatedAt || "",
    owner: data.owner || sharedMenuData.owner || "",
    menuId: data.menuId || sharedMenuData.id || "",
    categories: sharedCategories,
    menu: {
      ...sharedMenuData,
      id: data.menuId || sharedMenuData.id || `shared-${normalizedCode}`,
      name: data.menuName || sharedMenuData.name || "Shared menu",
      shareCode: normalizedCode,
      quizResults
    }
  };
}

function getShareQuizResults(data = {}) {
  const sharedMenuData = data.menu && typeof data.menu === "object" ? data.menu : {};
  return mergeQuizResults(data.quizResults || [], sharedMenuData.quizResults || []);
}

function createShareQuizResultsPayload(data = {}, nextResults = []) {
  const sharedMenuData = data.menu && typeof data.menu === "object" ? data.menu : null;
  const payload = {
    quizResults: nextResults,
    latestQuizResult: nextResults[0] || null,
    quizAttemptCount: nextResults.length,
    quizResultsUpdatedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (sharedMenuData) {
    payload.menu = {
      ...sharedMenuData,
      quizResults: nextResults
    };
  }

  return payload;
}

function clearSharedMenuSubscription() {
  if (cloudSync.sharedUnsubscribe) {
    cloudSync.sharedUnsubscribe();
    cloudSync.sharedUnsubscribe = null;
  }
  cloudSync.sharedCode = "";
}

function subscribeToSharedMenuUpdates(code) {
  const normalizedCode = normalizeShareCode(code);
  if (!normalizedCode || state.demoMode) return;
  if (cloudSync.sharedCode === normalizedCode && cloudSync.sharedUnsubscribe) return;

  const doc = getShareDocument(normalizedCode);
  if (!doc?.onSnapshot) return;

  clearSharedMenuSubscription();
  cloudSync.sharedCode = normalizedCode;
  cloudSync.sharedUnsubscribe = doc.onSnapshot(
    (snapshot) => {
      if (!snapshot.exists || state.sharedCode !== normalizedCode) return;

      const data = snapshot.data() || {};
      const incomingUpdatedAt = data.updatedAt || "";
      if (incomingUpdatedAt && state.sharedMenuUpdatedAt === incomingUpdatedAt) return;

      openSharedMenuSnapshot(createSharedMenuSnapshotPayload(normalizedCode, data), {
        preserveView: true,
        subscribe: false
      });
    },
    () => {
      clearSharedMenuSubscription();
    }
  );
}

async function ensureSharedFirebaseAccess() {
  const client = await waitForFirebaseClient();
  if (!client?.enabled || !client.db) return null;

  cloudSync.client = cloudSync.client || client;
  await waitForFirebaseAuthReady(client, 7000);

  if (client.auth && !client.auth.currentUser) {
    await withTimeout(client.auth.signInAnonymously(), 9000, "Firebase sign-in timed out.");
  }

  return client;
}

async function validateShareCodeAvailability(code) {
  const activeMenu = getActiveRestaurantMenu();
  const activeUser = getActiveUser();
  const doc = getShareDocument(normalizedCode);
  if (!activeMenu || !activeUser || !doc) {
    throw new Error("Firebase share storage is not ready.");
  }

  const snapshot = await doc.get();
  if (!snapshot.exists) return;

  const data = snapshot.data();
  const existingMenuId = data.menuId || data.menu?.id || "";
  const existingOwner = data.owner || data.menu?.owner || "";
  const isSameMenu = existingMenuId === activeMenu.id && existingOwner === activeUser.username;
  if (!isSameMenu) {
    throw new Error("That code is already being used by another shared menu.");
  }
}

function openSharedMenuSnapshot(
  { code, menu, categories: sharedCategories = [], updatedAt = "", owner = "", menuId = "" },
  { preserveView = false, subscribe = true } = {}
) {
  const normalizedCode = normalizeShareCode(code);
  const previousScreen = state.screen;
  const previousCategory = state.category;
  const previousQuery = state.query;
  const previousOpenItems = new Set(state.openItems);
  const previousAllergies = new Set(state.allergies);
  const previousIngredients = new Set(state.ingredients);
  const previousScrollY = window.scrollY;
  const incomingCategories =
    Array.isArray(sharedCategories) && sharedCategories.length
      ? sharedCategories
      : Array.isArray(menu?.categories) && menu.categories.length
        ? menu.categories
        : categories;

  if (incomingCategories.length) {
    mergeCategories(incomingCategories, { sync: false });
  }

  const sharedMenu = normalizeRestaurantMenu({
    ...(menu || {}),
    id: menu?.id || `shared-${normalizedCode}`,
    name: menu?.name || "Shared menu",
    shareCode: normalizedCode
  });

  state.sharedMenu = sharedMenu;
  state.sharedCode = normalizedCode;
  state.sharedMenuUpdatedAt = updatedAt || "";
  state.demoMode = false;
  state.currentUser = null;
  state.editing = false;

  if (preserveView) {
    const availableItemIds = new Set(sharedMenu.items.map((item) => item.id));
    state.screen = ["shared", "flashcards", "quiz"].includes(previousScreen) ? previousScreen : "shared";
    state.category = previousCategory === "all" || categories.includes(previousCategory) ? previousCategory : "all";
    state.query = previousQuery;
    state.openItems = new Set([...previousOpenItems].filter((itemId) => availableItemIds.has(itemId)));
    state.allergies = previousAllergies;
    state.ingredients = previousIngredients;
    searchInput.value = previousQuery;
  } else {
    state.screen = "shared";
    state.category = "all";
    state.query = "";
    state.openItems.clear();
    state.allergies.clear();
    state.ingredients.clear();
    searchInput.value = "";
  }

  saveSharedCodeLocally(normalizedCode, sharedMenu.name, sharedMenu, {
    categories: incomingCategories,
    updatedAt,
    owner,
    menuId
  });
  syncActiveRestaurantMenuData();
  applyDesignSettings();
  renderAllergyChips();
  showScreen(state.screen);
  if (preserveView) {
    window.requestAnimationFrame(() => window.scrollTo(0, previousScrollY));
  }
  if (subscribe) subscribeToSharedMenuUpdates(normalizedCode);
}

function openDemoMenu() {
  closeDrawer();
  clearSharedMenuSubscription();
  const demoMenu = createDemoRestaurantMenu();
  state.sharedMenu = demoMenu;
  state.sharedCode = "";
  state.sharedMenuUpdatedAt = "";
  state.demoMode = true;
  state.currentUser = null;
  state.screen = "shared";
  state.editing = false;
  state.category = "all";
  state.query = "";
  state.openItems.clear();
  state.allergies.clear();
  state.ingredients.clear();
  searchInput.value = "";
  codeLoginForm.hidden = true;
  codeLoginMessage.textContent = "";
  syncActiveRestaurantMenuData();
  applyDesignSettings();
  renderAllergyChips();
  showScreen("shared");
  scrollToPageTop();
}

async function publishMenuShare(code) {
  const activeMenu = getActiveRestaurantMenu();
  const activeUser = getActiveUser();
  const doc = getShareDocument(code);
  if (!activeMenu || !activeUser || !doc) {
    throw new Error("Firebase share storage is not ready.");
  }

  const normalizedCode = normalizeShareCode(code);
  const existingSnapshot = await doc.get().catch(() => null);
  const existingData = existingSnapshot?.exists ? existingSnapshot.data() || {} : {};
  const quizResults = mergeQuizResults(getShareQuizResults(existingData), activeMenu.quizResults || []);
  activeMenu.quizResults = quizResults;

  await doc.set(
    {
      code: normalizedCode,
      owner: activeUser.username,
      menuId: activeMenu.id,
      menuName: activeMenu.name,
      categories,
      quizResults,
      menu: sanitizeRestaurantMenuForStorage({ ...activeMenu, shareCode: normalizedCode, quizResults }),
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );

  activeMenu.shareCode = normalizedCode;
  saveRestaurantMenus();
}

async function syncSharedMenuSnapshots() {
  const sharedMenus = restaurantMenus.filter((menu) => normalizeShareCode(menu.shareCode));
  if (!sharedMenus.length || !getShareCollection() || !getActiveUser()) return;

  let changed = false;
  await Promise.all(
    sharedMenus.map(async (menu) => {
      const doc = getShareDocument(menu.shareCode);
      const existingSnapshot = await doc.get().catch(() => null);
      const existingData = existingSnapshot?.exists ? existingSnapshot.data() || {} : {};
      const quizResults = mergeQuizResults(getShareQuizResults(existingData), menu.quizResults || []);

      if (!areQuizResultListsEqual(menu.quizResults || [], quizResults)) {
        menu.quizResults = quizResults;
        changed = true;
      }

      await doc.set(
        {
          code: normalizeShareCode(menu.shareCode),
          owner: getActiveUser().username,
          menuId: menu.id,
          menuName: menu.name,
          categories,
          quizResults,
          menu: sanitizeRestaurantMenuForStorage({ ...menu, quizResults }, { allowInlineImages: false }),
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
    })
  );

  if (changed) {
    localStorage.setItem(getRestaurantMenusStorageKey(), JSON.stringify(restaurantMenus.map(sanitizeRestaurantMenuForStorage)));
  }
}

async function loadSharedMenuFromCode(code) {
  const normalizedCode = normalizeShareCode(code);
  const submitButton = codeLoginForm?.querySelector('button[type="submit"]');
  if (!normalizedCode) {
    codeLoginMessage.textContent = "Enter a share code.";
    return;
  }

  codeLoginMessage.textContent = "Loading shared menu...";
  if (submitButton) submitButton.disabled = true;

  try {
    await ensureSharedFirebaseAccess();
  } catch {
    const savedEntry = getSavedShareCodeEntry(normalizedCode);
    if (savedEntry?.menu) {
      openSharedMenuSnapshot(savedEntry, { subscribe: false });
      if (submitButton) submitButton.disabled = false;
      return;
    }
    codeLoginMessage.textContent = "Could not connect to Firebase on this device. Check your connection and try again.";
    if (submitButton) submitButton.disabled = false;
    return;
  }

  const doc = getShareDocument(normalizedCode);
  if (!doc) {
    const savedEntry = getSavedShareCodeEntry(normalizedCode);
    if (savedEntry?.menu) {
      openSharedMenuSnapshot(savedEntry, { subscribe: false });
      if (submitButton) submitButton.disabled = false;
      return;
    }
    codeLoginMessage.textContent = "Firebase is not ready on this device. Close and reopen the page, then try again.";
    if (submitButton) submitButton.disabled = false;
    return;
  }

  try {
    const snapshot = await withTimeout(doc.get(), 12000, "Shared menu lookup timed out.");
    if (!snapshot.exists) {
      const savedEntry = getSavedShareCodeEntry(normalizedCode);
      if (savedEntry?.menu) {
        openSharedMenuSnapshot(savedEntry, { subscribe: false });
        if (submitButton) submitButton.disabled = false;
        return;
      }
      codeLoginMessage.textContent = "That code was not found.";
      return;
    }

    openSharedMenuSnapshot(createSharedMenuSnapshotPayload(normalizedCode, snapshot.data() || {}));
    flushPendingSharedQuizResults(normalizedCode).catch(() => {});
  } catch (error) {
    const savedEntry = getSavedShareCodeEntry(normalizedCode);
    if (savedEntry?.menu) {
      openSharedMenuSnapshot(savedEntry, { subscribe: false });
      return;
    }
    codeLoginMessage.textContent =
      error?.message === "Shared menu lookup timed out."
        ? "The menu took too long to load. Check your connection and try again."
        : "Could not load that code. Check the code and try again.";
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
}

function getMenuStats(menu) {
  return normalizeMenuStats(menu?.stats);
}

function getMenuItemClickRows(menu) {
  const stats = getMenuStats(menu);
  const items = Array.isArray(menu?.items) ? menu.items : [];
  const itemById = new Map(items.map((item) => [item.id, item]));

  return Object.entries(stats.itemClicks)
    .map(([itemId, itemStat]) => {
      const item = itemById.get(itemId);
      const name = item?.name || itemStat.itemName || "Deleted item";
      return {
        itemId,
        name,
        category: item ? getCategoryLabel(item.category) : "No longer on menu",
        clicks: Math.max(0, Number(itemStat.clicks) || 0),
        lastOpenedAt: itemStat.lastOpenedAt || itemStat.recentOpens?.[0] || "",
        recentOpens: normalizeStatsEvents(itemStat.recentOpens, itemStat.lastOpenedAt, itemStatsEventLimit)
      };
    })
    .filter((row) => row.clicks > 0)
    .sort((a, b) => {
      const clickDifference = b.clicks - a.clicks;
      if (clickDifference) return clickDifference;
      return Date.parse(b.lastOpenedAt || "") - Date.parse(a.lastOpenedAt || "");
    });
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

  const openedAt = new Date().toISOString();
  menu.stats = normalizeMenuStats(menu.stats);
  menu.stats.clicks += 1;
  menu.stats.lastOpenedAt = openedAt;
  menu.stats.recentOpens = [openedAt, ...menu.stats.recentOpens].slice(0, menuStatsEventLimit);
  saveRestaurantMenus();
}

function recordMenuItemOpen(itemId) {
  if (state.sharedMenu || !itemId) return;

  const menu = getActiveRestaurantMenu();
  if (!menu) return;

  const item = menuItems.find((candidate) => candidate.id === itemId) || menu.items?.find((candidate) => candidate.id === itemId);
  const openedAt = new Date().toISOString();
  menu.stats = normalizeMenuStats(menu.stats);
  const current = normalizeItemClickStats(menu.stats.itemClicks)[itemId] || {
    clicks: 0,
    lastOpenedAt: "",
    recentOpens: [],
    itemName: item?.name || ""
  };

  menu.stats.itemClicks[itemId] = {
    ...current,
    clicks: current.clicks + 1,
    lastOpenedAt: openedAt,
    recentOpens: [openedAt, ...current.recentOpens].slice(0, itemStatsEventLimit),
    itemName: item?.name || current.itemName || ""
  };

  saveRestaurantMenus();
}

function ownsMenu(menu) {
  const user = getActiveUser();
  return Boolean(user && menu && getMenuOwner(menu) === user.username);
}

function ownsActiveMenu() {
  return ownsMenu(getActiveRestaurantMenu());
}

function canManageCategories() {
  return Boolean(getActiveUser() && getActiveRestaurantMenu() && (isAdmin() || ownsActiveMenu()));
}

function getEditableCategories() {
  const user = getActiveUser();
  if (!user) return [];
  if (ownsActiveMenu()) return [...categories];
  if (isAdmin()) return [...categories];
  if (!canUserAccessMenu(user, getActiveRestaurantMenu())) return [];
  return user.permissions || [];
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

function withTimeout(promise, timeoutMs, message = "Request timed out.") {
  let timeoutId = null;
  const timeout = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  return Promise.race([Promise.resolve(promise), timeout]).finally(() => {
    window.clearTimeout(timeoutId);
  });
}

async function waitForFirebaseAuthReady(client, timeoutMs = 8000) {
  if (!client?.authReady) return client?.auth?.currentUser || null;

  try {
    return await withTimeout(client.authReady, timeoutMs, "Firebase took too long to connect.");
  } catch {
    return client.auth?.currentUser || null;
  }
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
  await waitForFirebaseAuthReady(client);
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
      await withTimeout(client.auth.signInAnonymously(), 9000, "Anonymous Firebase sign-in timed out.");
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
  if (error?.message?.includes("timed out")) return "Firebase took too long to respond. Check the connection and try again.";
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
  cloudSync.client = client;
  await waitForFirebaseAuthReady(client, 8000);
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

function mergeCloudItemsWithLocal(cloudItems = [], localItems = []) {
  const localById = new Map(localItems.map((item) => [item.id, normalizeMenuItem(item)]));
  const seenIds = new Set();
  let hasLocalPreserves = false;

  const items = cloudItems
    .map(normalizeMenuItem)
    .flatMap((cloudItem) => {
      seenIds.add(cloudItem.id);
      const localItem = localById.get(cloudItem.id);
      const cloudUpdatedAt = getMenuItemUpdatedAtMs(cloudItem);
      const localUpdatedAt = Math.max(getMenuItemUpdatedAtMs(localItem), Number(state.localItemEditTimes[cloudItem.id]) || 0);
      const localDeletedAt = Number(state.localDeletedItemTimes[cloudItem.id]) || 0;

      if (localDeletedAt > cloudUpdatedAt) {
        hasLocalPreserves = true;
        return [];
      }

      const localInlineImages = localItem ? getInlineItemPhotoUrls(localItem) : [];
      if (localInlineImages.length) {
        const images = normalizeItemImageList([...getItemImages(cloudItem), ...getItemImages(localItem)]);
        hasLocalPreserves = true;
        return [
          {
            ...cloudItem,
            image: images[0] || "",
            images,
            updatedAt: localItem.updatedAt || cloudItem.updatedAt || new Date().toISOString()
          }
        ];
      }

      if (localItem && localUpdatedAt > cloudUpdatedAt) {
        hasLocalPreserves = true;
        return [localItem];
      }

      if (localItem && getItemImages(localItem).length && !getItemImages(cloudItem).length && localUpdatedAt >= cloudUpdatedAt) {
        const images = getItemImages(localItem);
        hasLocalPreserves = true;
        return [
          {
            ...cloudItem,
            image: images[0] || "",
            images,
            updatedAt: localItem.updatedAt || cloudItem.updatedAt || new Date().toISOString()
          }
        ];
      }

      if (localUpdatedAt && cloudUpdatedAt >= localUpdatedAt) {
        delete state.localItemEditTimes[cloudItem.id];
      }
      if (localDeletedAt && cloudUpdatedAt >= localDeletedAt) {
        delete state.localDeletedItemTimes[cloudItem.id];
      }

      return [cloudItem];
    });

  localById.forEach((localItem, itemId) => {
    if (seenIds.has(itemId)) return;
    const localUpdatedAt = Math.max(getMenuItemUpdatedAtMs(localItem), Number(state.localItemEditTimes[itemId]) || 0);
    const localDeletedAt = Number(state.localDeletedItemTimes[itemId]) || 0;
    if (!localUpdatedAt || localDeletedAt > localUpdatedAt) return;

    hasLocalPreserves = true;
    items.push(localItem);
  });

  return { items, hasLocalPreserves };
}

function mergeCloudMenusWithLocal(cloudMenus = [], workspaceOwner = primaryAdminUsername) {
  const localById = new Map(restaurantMenus.map((menu) => [menu.id, menu]));
  let hasLocalPreserves = false;

  const menus = cloudMenus.map((menu, index) => {
    const cloudMenu = normalizeRestaurantMenu({ ...menu, owner: menu.owner || workspaceOwner }, index);
    const localMenu = localById.get(cloudMenu.id);
    if (!localMenu) return cloudMenu;

    const mergedItems = mergeCloudItemsWithLocal(cloudMenu.items, localMenu.items || []);
    if (mergedItems.hasLocalPreserves) hasLocalPreserves = true;

    return {
      ...cloudMenu,
      items: mergedItems.items
    };
  });

  localById.forEach((localMenu, menuId) => {
    if (menus.some((menu) => menu.id === menuId)) return;
    const hasEditedItems = (localMenu.items || []).some((item) => {
      const itemId = item.id;
      return getMenuItemUpdatedAtMs(item) || Number(state.localItemEditTimes[itemId]) || getItemImages(item).length;
    });
    if (!hasEditedItems) return;

    hasLocalPreserves = true;
    menus.push(normalizeRestaurantMenu(localMenu, menus.length));
  });

  return { menus, hasLocalPreserves };
}

function applyCloudSnapshot(data) {
  if (!data) return;

  cloudSync.applying = true;
  const menuWasVisible = !menuPage.hidden && (state.screen === "menu" || state.screen === "shared");
  let shouldResaveLocalPreserves = false;

  try {
    const workspaceOwner = getWorkspaceOwner();
    if (Array.isArray(data.categories)) {
      mergeCategories(data.categories, { sync: false });
    }
    if (Array.isArray(data.menus) && data.menus.length) {
      const mergedSnapshot = mergeCloudMenusWithLocal(data.menus, workspaceOwner);
      restaurantMenus = mergedSnapshot.menus;
      shouldResaveLocalPreserves = mergedSnapshot.hasLocalPreserves;
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
    renderMenu({ preserveScroll: menuWasVisible });
  } finally {
    cloudSync.applying = false;
    if (shouldResaveLocalPreserves) scheduleCloudSave();
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
    const migratedPhotoCount = await migrateInlineItemPhotosToCloud();
    if (migratedPhotoCount) {
      setSyncStatus(`Uploaded ${migratedPhotoCount} photo${migratedPhotoCount === 1 ? "" : "s"} to Firebase...`);
    }

    await cloudSync.ref.set(
      {
        categories,
        menus: restaurantMenus.map((menu) => sanitizeRestaurantMenuForStorage(menu, { allowInlineImages: false })),
        source: reason,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
    await syncSharedMenuSnapshots();
    setSyncStatus("Synced with Firebase", "connected");
  } catch {
    setSyncStatus("Firebase save failed - check rules/Auth", "error");
  }
}

function sanitizeMenuItemForCloud(item, { allowInlineImages = true } = {}) {
  const category = normalizeCategoryValue(item.category);
  const images = getItemImages(item).filter((image) => allowInlineImages || !isInlineItemPhotoUrl(image));
  return {
    id: item.id || `item-${Date.now()}`,
    name: item.name || "",
    description: item.description || "",
    category: categories.includes(category) ? category : categories[0] || "starters",
    diet: item.diet || "NA",
    style: item.style || "",
    heat: Number(item.heat) || 0,
    allergens: Array.isArray(item.allergens) ? item.allergens : [],
    ingredients: normalizeIngredientList(item.ingredients || []),
    details: item.details || "",
    image: images[0] || "",
    images,
    createdAt: typeof item.createdAt === "string" ? item.createdAt : "",
    updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : "",
    price: Number(item.price) || 0
  };
}

function sanitizeRestaurantMenuForStorage(menu, options = {}) {
  return {
    id: menu.id || `menu-${Date.now()}`,
    name: menu.name || "Untitled Menu",
    restaurantName: menu.restaurantName || "",
    owner: menu.owner || primaryAdminUsername,
    label: menu.label || "Menu training",
    shareCode: typeof menu.shareCode === "string" ? menu.shareCode : "",
    categories: getUniqueCategories(menu.categories || categories),
    items: Array.isArray(menu.items) ? menu.items.map((item) => sanitizeMenuItemForCloud(item, options)) : [],
    stats: normalizeMenuStats(menu.stats),
    quizResults: normalizeQuizResults(menu.quizResults),
    designSettings: sanitizeDesignSettings(menu.designSettings || defaultDesign)
  };
}

function sanitizeDesignSettings(settings) {
  const normalized = normalizeDesignSettings(settings);
  return {
    ink: normalized.ink || defaultDesign.ink,
    leaf: normalized.leaf || defaultDesign.leaf,
    gold: normalized.gold || defaultDesign.gold,
    aqua: normalized.aqua || defaultDesign.aqua,
    page: normalized.page || defaultDesign.page,
    panel: normalized.panel || defaultDesign.panel,
    heroImage: typeof normalized.heroImage === "string" ? normalized.heroImage : defaultHeroImage,
    itemPhotoSize: normalized.itemPhotoSize,
    frontMediaType: normalized.frontMediaType,
    frontMediaUrl: normalized.frontMediaUrl,
    frontMediaPhoneSize: normalized.frontMediaPhoneSize,
    frontMediaWebSize: normalized.frontMediaWebSize,
    frontMediaBlur: normalized.frontMediaBlur,
    frontVideoLength: normalized.frontVideoLength,
    menuAnimationIntensity: normalized.menuAnimationIntensity
  };
}

function showScreen(screen) {
  state.screen = screen;
  renderAdminState();
  window.requestAnimationFrame(updateBackToTopButton);
}

function updateBackToTopButton() {
  if (!backToTopButton) return;

  const pageIsLong = document.documentElement.scrollHeight > window.innerHeight + 260;
  backToTopButton.hidden = !(pageIsLong && window.scrollY > 360);
}

function scrollToPageTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function goToFrontPage(event) {
  event?.preventDefault();
  closeDrawer();

  if (state.sharedMenu && !getActiveUser()) {
    exitSharedMenu();
    scrollToPageTop();
    return;
  }

  if (getActiveUser()) {
    setEditMode(false);
    showScreen("menus");
    scrollToPageTop();
    return;
  }

  state.screen = "login";
  showScreen("login");
  scrollToPageTop();
}

function normalizeScreen(activeUser, invitedUser) {
  if (state.sharedMenu && ["shared", "flashcards", "quiz"].includes(state.screen)) {
    return;
  }

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

  if (activeUser && ["menu", "pdf", "flashcards", "quiz"].includes(state.screen) && !getActiveRestaurantMenu()) {
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
  adminHomeDashboardButton.hidden = false;
  adminHomeDashboardButton.textContent = isAdminUser ? "Open dashboard" : "Dashboard";

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
  const canManageMenuCategories = canManageCategories();
  const canShareMenu = canShareActiveMenu();
  const canUseStudyTools = canStudyActiveMenu();
  const canCustomizeMenu = Boolean(activeMenu) && isAdmin();
  const isSharedView = state.screen === "shared";
  const isDemoView = isSharedView && state.demoMode;
  currentMenuTitle.textContent = activeMenu?.name || "No menu selected";
  backToMenusButton.textContent = isDemoView ? "Exit demo" : isSharedView ? "Exit" : "Menus";
  drawerOpenButton.hidden = isSharedView || !getActiveUser();
  demoGuidePanel.hidden = !isDemoView;
  topAddItemButton.hidden = !canEditMenu;
  renameMenuButton.hidden = !state.editing || !canEditMenu;
  quickEditModeButton.textContent = state.editing ? "Done editing" : "Edit menu";
  quickEditModeButton.classList.toggle("is-active", state.editing);
  quickEditModeButton.hidden = !canEditMenu;
  quickCustomizationButton.hidden = !canCustomizeMenu;
  quickScanMenuButton.hidden = !canEditMenu;
  quickImportPdfButton.hidden = !canEditMenu;
  quickPdfBuilderButton.hidden = !canUsePdf;
  quickCategoryButton.hidden = !canManageMenuCategories;
  quickShareMenuButton.hidden = !canShareMenu;
  quickFlashcardButton.hidden = !canUseStudyTools;
  quickQuizButton.hidden = !canUseStudyTools;
  quickMenuActions.hidden =
    quickEditModeButton.hidden &&
    quickCustomizationButton.hidden &&
    quickScanMenuButton.hidden &&
    quickImportPdfButton.hidden &&
    quickPdfBuilderButton.hidden &&
    quickCategoryButton.hidden &&
    quickShareMenuButton.hidden &&
    quickFlashcardButton.hidden &&
    quickQuizButton.hidden;
}

function openRestaurantMenu(menuId) {
  if (!getVisibleRestaurantMenus().some((menu) => menu.id === menuId)) return;

  recordMenuOpen(menuId);
  state.activeRestaurantMenu = menuId;
  state.category = "all";
  state.query = "";
  state.openItems.clear();
  state.allergies.clear();
  state.ingredients.clear();
  searchInput.value = "";
  setActiveCategoryTab();
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
  state.ingredients.clear();
  searchInput.value = "";
  setActiveCategoryTab();
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
    categories: [...categories],
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
  const selectedIngredients = [...state.ingredients];

  return menuItems.filter((item) => {
    const ingredientText = getItemIngredientText(item);
    const ingredientTerms = getItemIngredientTerms(item);
    const ingredientSource = `${ingredientText} ${ingredientTerms.join(" ")}`.toLowerCase();
    const matchesCategory = state.category === "all" || item.category === state.category;
    const matchesQuery = [item.name, item.description, item.diet, item.category, ...item.allergens, ingredientText, ...ingredientTerms]
      .join(" ")
      .toLowerCase()
      .includes(query);
    const avoidsAllergies = !item.allergens.some((allergen) => state.allergies.has(allergen));
    const matchesIngredients =
      !selectedIngredients.length || selectedIngredients.every((ingredient) => ingredientSource.includes(ingredient.toLowerCase()));

    return matchesCategory && matchesQuery && avoidsAllergies && matchesIngredients;
  });
}

function renderHeat(level) {
  if (level === 0) return "Mild";
  return ["Mild", "Low", "Med", "Hot"][level] || "Hot";
}

function getMenuRowById(itemId) {
  if (!menuGrid || !itemId) return null;
  return [...menuGrid.querySelectorAll(".menu-row")].find((row) => row.dataset.itemId === itemId) || null;
}

function getFirstVisibleMenuRow() {
  if (!menuGrid) return null;

  return (
    [...menuGrid.querySelectorAll(".menu-row")].find((row) => {
      const rect = row.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    }) || null
  );
}

function captureMenuScrollSnapshot(anchorItemId = "") {
  const anchorRow = getMenuRowById(anchorItemId) || getFirstVisibleMenuRow();
  return {
    itemId: anchorRow?.dataset.itemId || "",
    itemTop: anchorRow?.getBoundingClientRect().top || 0,
    scrollX: window.scrollX,
    scrollY: window.scrollY
  };
}

function restoreMenuScrollSnapshot(snapshot) {
  if (!snapshot) return;

  const restore = () => {
    const anchorRow = getMenuRowById(snapshot.itemId);
    const nextScrollY = anchorRow ? window.scrollY + anchorRow.getBoundingClientRect().top - snapshot.itemTop : snapshot.scrollY;
    window.scrollTo({
      left: snapshot.scrollX,
      top: Math.max(0, nextScrollY),
      behavior: "auto"
    });
    updateBackToTopButton();
  };

  window.requestAnimationFrame(() => {
    restore();
    window.setTimeout(restore, 80);
  });
}

function prefersReducedMenuMotion() {
  return Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
}

function shouldUseMenuRevealObserver() {
  if (prefersReducedMenuMotion()) return false;
  if (getMenuAnimationIntensity(designSettings.menuAnimationIntensity) <= 0) return false;
  if (window.matchMedia?.("(hover: none), (pointer: coarse)")?.matches) return false;
  if (window.Capacitor?.isNativePlatform?.()) return false;
  return true;
}

function getMenuRevealKey(itemId) {
  const menuId = state.sharedMenu?.id || state.activeRestaurantMenu || "default-menu";
  return `${menuId}:${itemId}`;
}

function prepareMenuRevealObserver() {
  menuRevealObserver?.disconnect();
  menuRevealObserver = null;
  menuRevealSequence = 0;

  if (!("IntersectionObserver" in window) || !shouldUseMenuRevealObserver()) return;

  menuRevealObserver = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        .forEach((entry) => {
          const row = entry.target;
          const revealKey = row.dataset.revealKey || getMenuRevealKey(row.dataset.itemId);
          const intensityFactor = getMenuAnimationIntensity(designSettings.menuAnimationIntensity) / 100;
          const delayStep = Math.round(48 * intensityFactor);
          const delay = Math.min(240, (menuRevealSequence % 6) * delayStep);
          menuRevealSequence += 1;
          state.revealedMenuRows.add(revealKey);
          row.style.setProperty("--row-reveal-delay", `${delay}ms`);
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
              row.classList.add("is-visible");
              window.setTimeout(() => {
                row.style.setProperty("--row-reveal-delay", "0ms");
              }, delay + 920);
            });
          });
          menuRevealObserver?.unobserve(row);
        });
    },
    {
      root: null,
      rootMargin: "0px 0px -18% 0px",
      threshold: 0.16
    }
  );
}

function observeMenuRowReveal(row) {
  if (!row) return;

  const revealKey = row.dataset.revealKey || getMenuRevealKey(row.dataset.itemId);
  if (!menuRevealObserver || state.revealedMenuRows.has(revealKey)) {
    state.revealedMenuRows.add(revealKey);
    row.classList.add("is-visible");
    row.style.setProperty("--row-reveal-delay", "0ms");
    return;
  }

  menuRevealObserver.observe(row);
}

function clearItemDetailsMotionStyles(itemDetails) {
  itemDetails.style.removeProperty("max-height");
  itemDetails.style.removeProperty("opacity");
  itemDetails.style.removeProperty("padding-top");
  itemDetails.style.removeProperty("transform");
}

function animateItemDetails(itemDetails, isOpen) {
  if (!itemDetails) return;

  window.clearTimeout(itemDetails._menuDetailsTimer);
  if (prefersReducedMenuMotion()) {
    itemDetails.hidden = !isOpen;
    clearItemDetailsMotionStyles(itemDetails);
    updateBackToTopButton();
    return;
  }

  if (isOpen) {
    itemDetails.hidden = false;
    const openPadding = getComputedStyle(itemDetails).paddingTop || "10px";
    itemDetails.style.maxHeight = "0px";
    itemDetails.style.opacity = "0";
    itemDetails.style.paddingTop = "0px";
    itemDetails.style.transform = "translateY(-6px)";
    itemDetails.offsetHeight;

    window.requestAnimationFrame(() => {
      itemDetails.style.paddingTop = openPadding;
      itemDetails.style.maxHeight = `${itemDetails.scrollHeight}px`;
      itemDetails.style.opacity = "1";
      itemDetails.style.transform = "translateY(0)";
    });

    itemDetails._menuDetailsTimer = window.setTimeout(() => {
      clearItemDetailsMotionStyles(itemDetails);
      updateBackToTopButton();
    }, 320);
    return;
  }

  const currentPadding = getComputedStyle(itemDetails).paddingTop || "10px";
  itemDetails.hidden = false;
  itemDetails.style.maxHeight = `${itemDetails.scrollHeight}px`;
  itemDetails.style.opacity = "1";
  itemDetails.style.paddingTop = currentPadding;
  itemDetails.style.transform = "translateY(0)";
  itemDetails.offsetHeight;

  window.requestAnimationFrame(() => {
    itemDetails.style.maxHeight = "0px";
    itemDetails.style.opacity = "0";
    itemDetails.style.paddingTop = "0px";
    itemDetails.style.transform = "translateY(-6px)";
  });

  itemDetails._menuDetailsTimer = window.setTimeout(() => {
    itemDetails.hidden = true;
    clearItemDetailsMotionStyles(itemDetails);
    updateBackToTopButton();
  }, 300);
}

function renderMenu({ preserveScroll = false, anchorItemId = "", scrollSnapshot = null } = {}) {
  const menuScrollSnapshot = scrollSnapshot || (preserveScroll ? captureMenuScrollSnapshot(anchorItemId) : null);
  renderIngredientChips();
  const items = getVisibleItems();
  menuGrid.replaceChildren();
  prepareMenuRevealObserver();

  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = menuItems.length ? "No matching dishes." : "No menu items yet.";
    menuGrid.append(empty);
    restoreMenuScrollSnapshot(menuScrollSnapshot);
    return;
  }

  items.forEach((item) => {
    const row = template.content.firstElementChild.cloneNode(true);
    row.dataset.itemId = item.id;
    row.dataset.revealKey = getMenuRevealKey(item.id);
    row.classList.toggle("is-open", state.openItems.has(item.id));
    row.querySelector("h3").textContent = item.name;
    row.querySelector(".item-cell > p").textContent = item.description;

    const itemToggle = row.querySelector(".item-toggle");
    itemToggle.setAttribute("aria-expanded", String(state.openItems.has(item.id)));
    itemToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleItemDetails(item.id);
    });

    const rowEditButton = row.querySelector(".row-edit-button");
    const canEditItem = state.editing && canEditCategory(item.category);
    const canSwipeItem = !state.sharedMenu && canEditCategory(item.category);
    rowEditButton.hidden = !canEditItem;
    rowEditButton.addEventListener("click", (event) => {
      event.stopPropagation();
      openItemDialog(item.id);
    });
    attachRowTapHandler(row, item);
    if (canSwipeItem) {
      row.classList.add("is-swipe-enabled");
      attachRowSwipeHandlers(row, item);
    }

    const allergenList = row.querySelector(".allergen-list");
    const allergens = item.allergens.length ? item.allergens : ["No major allergens"];
    allergens.forEach((allergen) => {
      const tag = document.createElement("span");
      tag.className = `allergen-tag${item.allergens.length ? "" : " none"}`;
      tag.textContent = allergen;
      allergenList.append(tag);
    });

    const ingredientList = row.querySelector(".ingredient-list");
    const ingredients = getItemIngredientTerms(item).slice(0, 6);
    const ingredientLabels = ingredients.length ? ingredients : ["No ingredient notes"];
    ingredientLabels.forEach((ingredient) => {
      const tag = document.createElement("span");
      tag.className = `ingredient-tag${ingredients.length ? "" : " none"}`;
      tag.textContent = ingredient;
      ingredientList.append(tag);
    });

    const pill = row.querySelector(".diet-pill");
    pill.textContent = item.diet;
    if (item.style) pill.classList.add(item.style);

    const heat = row.querySelector(".heat-meter");
    heat.textContent = renderHeat(item.heat);
    heat.setAttribute("aria-label", `${item.heat} out of 3 heat level`);

    const button = row.querySelector(".price-button");
    const priceLabel = formatMenuPrice(item.price);
    button.textContent = priceLabel;
    button.classList.toggle("editing", canEditItem);
    button.classList.toggle("locked", state.editing && !canEditItem);
    button.setAttribute("aria-label", canEditItem ? `Edit ${item.name}` : `${item.name} costs ${priceLabel}`);
    button.addEventListener("click", (event) => {
      if (canEditItem) {
        event.stopPropagation();
        openItemDialog(item.id);
      }
    });

    const itemDetails = row.querySelector(".item-details");
    const gallery = itemDetails.querySelector(".item-photo-gallery");
    const itemImages = getItemImages(item);
    const hasItemImage = itemImages.length > 0;
    itemDetails.hidden = !state.openItems.has(item.id);
    itemDetails.classList.toggle("no-photo", !hasItemImage);
    gallery.hidden = !hasItemImage;
    gallery.classList.toggle("single", itemImages.length === 1);
    renderItemPhotoGallery(gallery, itemImages, item.name, item.id);
    itemDetails.querySelector(".detail-copy").textContent = item.details;

    menuGrid.append(row);
    observeMenuRowReveal(row);
  });

  restoreMenuScrollSnapshot(menuScrollSnapshot);
}

function renderItemPhotoGallery(gallery, images, itemName, itemId) {
  gallery.replaceChildren();
  if (!images.length) return;

  const slideIndex = getItemPhotoSlideIndex(itemId, images.length);
  gallery.dataset.itemId = itemId;
  gallery.classList.toggle("has-controls", images.length > 1);
  gallery.setAttribute("role", "group");
  gallery.setAttribute("aria-label", `${itemName} photos`);

  const viewport = document.createElement("div");
  viewport.className = "item-photo-viewport";

  const track = document.createElement("div");
  track.className = "item-photo-track";
  track.style.transform = `translateX(-${slideIndex * 100}%)`;

  images.forEach((imageUrl, index) => {
    const slide = document.createElement("div");
    slide.className = "item-photo-slide";
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = `${itemName} photo ${index + 1}`;
    image.draggable = false;
    image.addEventListener("dragstart", (event) => event.preventDefault());
    slide.append(image);
    track.append(slide);
  });

  viewport.append(track);
  gallery.append(viewport);
  attachPhotoSwipeHandlers(gallery, itemId, images, itemName);

  if (images.length > 1) {
    const previousButton = createPhotoNavButton("previous", itemId, images.length, itemName);
    const nextButton = createPhotoNavButton("next", itemId, images.length, itemName);
    const dots = createPhotoDots(images.length, slideIndex);
    const counter = document.createElement("span");
    counter.className = "photo-slide-counter";
    counter.textContent = `${slideIndex + 1}/${images.length}`;

    gallery.append(previousButton, nextButton, dots, counter);
  }
}

function updateMenuRowExpandedState(itemId, isOpen) {
  const row = getMenuRowById(itemId);
  if (!row) return false;

  const itemToggle = row.querySelector(".item-toggle");
  const itemDetails = row.querySelector(".item-details");
  row.classList.toggle("is-open", isOpen);
  itemToggle?.setAttribute("aria-expanded", String(isOpen));
  animateItemDetails(itemDetails, isOpen);

  window.requestAnimationFrame(updateBackToTopButton);
  return true;
}

function getItemPhotoSlideIndex(itemId, imageCount) {
  const fallbackIndex = 0;
  const currentIndex = Number(state.photoSlides[itemId]);
  const safeIndex = Number.isFinite(currentIndex) ? currentIndex : fallbackIndex;
  const clampedIndex = Math.max(0, Math.min(imageCount - 1, safeIndex));
  state.photoSlides[itemId] = clampedIndex;
  return clampedIndex;
}

function setItemPhotoSlide(itemId, imageCount, requestedIndex) {
  if (imageCount <= 1) return;
  const nextIndex = (requestedIndex + imageCount) % imageCount;
  state.photoSlides[itemId] = nextIndex;

  const row = getMenuRowById(itemId);
  const gallery = row?.querySelector(".item-photo-gallery");
  const track = gallery?.querySelector(".item-photo-track");
  if (!gallery || !track) {
    renderMenu({ preserveScroll: true, anchorItemId: itemId });
    return;
  }

  track.style.transform = `translateX(-${nextIndex * 100}%)`;
  gallery.querySelectorAll(".photo-slide-dot").forEach((dot, index) => {
    dot.classList.toggle("is-active", index === nextIndex);
  });

  const counter = gallery.querySelector(".photo-slide-counter");
  if (counter) counter.textContent = `${nextIndex + 1}/${imageCount}`;
}

function createPhotoDots(imageCount, activeIndex) {
  const dots = document.createElement("div");
  dots.className = "photo-slide-dots";
  dots.setAttribute("aria-hidden", "true");

  for (let index = 0; index < imageCount; index += 1) {
    const dot = document.createElement("span");
    dot.className = "photo-slide-dot";
    dot.classList.toggle("is-active", index === activeIndex);
    dots.append(dot);
  }

  return dots;
}

function createPhotoNavButton(direction, itemId, imageCount, itemName) {
  const button = document.createElement("button");
  const isNext = direction === "next";
  button.className = `photo-nav-button ${isNext ? "next" : "previous"}`;
  button.type = "button";
  button.textContent = isNext ? ">" : "<";
  button.setAttribute("aria-label", `${isNext ? "Next" : "Previous"} ${itemName} photo`);
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const activeIndex = getItemPhotoSlideIndex(itemId, imageCount);
    setItemPhotoSlide(itemId, imageCount, activeIndex + (isNext ? 1 : -1));
  });
  return button;
}

function openPhotoLightbox(images, itemName, itemId, requestedIndex = 0) {
  if (!photoLightboxDialog || !photoLightboxImage || !photoLightboxCaption) return;

  const imageList = Array.isArray(images) ? normalizeItemImageList(images) : normalizeItemImageList([images]);
  if (!imageList.length) return;

  state.photoLightbox = {
    itemId: itemId || "",
    itemName: normalizeText(itemName) || "Item",
    images: imageList,
    index: Math.max(0, Math.min(imageList.length - 1, Number(requestedIndex) || 0))
  };
  renderPhotoLightbox();
  if (!photoLightboxDialog.open) photoLightboxDialog.showModal();
}

function renderPhotoLightbox() {
  const { itemId, itemName, images, index } = state.photoLightbox;
  const imageUrl = images[index];
  if (!photoLightboxImage || !photoLightboxCaption || !imageUrl) return;

  const caption = `${itemName} photo ${index + 1} of ${images.length}`;
  photoLightboxImage.src = imageUrl;
  photoLightboxImage.alt = caption;
  photoLightboxCaption.textContent = caption;
  if (photoLightboxPreviousButton) {
    photoLightboxPreviousButton.hidden = images.length <= 1;
    photoLightboxPreviousButton.disabled = images.length <= 1;
  }
  if (photoLightboxNextButton) {
    photoLightboxNextButton.hidden = images.length <= 1;
    photoLightboxNextButton.disabled = images.length <= 1;
  }
  if (itemId) setItemPhotoSlide(itemId, images.length, index);
}

function movePhotoLightbox(direction) {
  const { images, index } = state.photoLightbox;
  if (!images.length || images.length <= 1) return;

  state.photoLightbox.index = (index + direction + images.length) % images.length;
  renderPhotoLightbox();
}

function resetPhotoLightboxState() {
  photoLightboxImage?.removeAttribute("src");
  if (photoLightboxCaption) photoLightboxCaption.textContent = "";
  state.photoLightbox = {
    itemId: "",
    itemName: "",
    images: [],
    index: 0
  };
}

function closePhotoLightbox() {
  if (!photoLightboxDialog) return;
  if (photoLightboxDialog.open) photoLightboxDialog.close();
  resetPhotoLightboxState();
}

function handlePhotoLightboxKeydown(event) {
  if (!photoLightboxDialog?.open) return;

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    movePhotoLightbox(-1);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    movePhotoLightbox(1);
  } else if (event.key === "Escape") {
    closePhotoLightbox();
  }
}

function attachPhotoSwipeHandlers(gallery, itemId, images, itemName) {
  const imageCount = images.length;
  let startX = 0;
  let startY = 0;
  let isSwiping = false;
  let hasDragged = false;

  gallery.addEventListener("click", (event) => event.stopPropagation());
  gallery.addEventListener("dragstart", (event) => event.preventDefault());
  gallery.addEventListener("pointerdown", (event) => {
    event.stopPropagation();
    if (event.button !== undefined && event.button !== 0) return;
    startX = event.clientX;
    startY = event.clientY;
    isSwiping = true;
    hasDragged = false;
    gallery.classList.add("is-dragging");
    gallery.setPointerCapture?.(event.pointerId);
  });
  gallery.addEventListener("pointermove", (event) => {
    if (!isSwiping) return;
    event.stopPropagation();
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) hasDragged = true;
    if (Math.abs(deltaX) > Math.abs(deltaY)) event.preventDefault();
  });
  gallery.addEventListener("pointerup", (event) => {
    if (!isSwiping) return;
    event.stopPropagation();
    gallery.classList.remove("is-dragging");
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    isSwiping = false;
    const activeIndex = getItemPhotoSlideIndex(itemId, imageCount);
    if (!hasDragged || (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8)) {
      openPhotoLightbox(images, itemName, itemId, activeIndex);
      return;
    }
  });
  gallery.addEventListener("pointercancel", () => {
    isSwiping = false;
    gallery.classList.remove("is-dragging");
  });
}

function attachRowTapHandler(row, item) {
  row.addEventListener("click", (event) => {
    if (row.dataset.suppressClick === "true") {
      event.preventDefault();
      delete row.dataset.suppressClick;
      return;
    }

    if (event.target.closest(".row-edit-button")) return;
    if (event.target.closest("input, textarea, select, a")) return;
    toggleItemDetails(item.id);
  });
}

function attachRowSwipeHandlers(row, item) {
  row.addEventListener("pointerdown", (event) => handleRowSwipeStart(event, row, item));
  row.addEventListener("pointermove", handleRowSwipeMove);
  row.addEventListener("pointerup", handleRowSwipeEnd);
  row.addEventListener("pointercancel", cancelRowSwipe);
}

function handleRowSwipeStart(event, row, item) {
  if (event.button !== undefined && event.button !== 0) return;
  const interactiveTarget = event.target.closest("button, input, textarea, select, a");
  if (interactiveTarget && !interactiveTarget.classList.contains("item-toggle")) return;

  rowSwipeState = {
    row,
    item,
    startX: event.clientX,
    startY: event.clientY,
    currentX: event.clientX,
    active: false
  };
  row.setPointerCapture?.(event.pointerId);
}

function handleRowSwipeMove(event) {
  if (!rowSwipeState) return;

  const deltaX = event.clientX - rowSwipeState.startX;
  const deltaY = event.clientY - rowSwipeState.startY;
  if (!rowSwipeState.active && Math.abs(deltaX) < 14) return;
  if (!rowSwipeState.active && Math.abs(deltaY) > Math.abs(deltaX)) {
    cancelRowSwipe();
    return;
  }

  event.preventDefault();
  rowSwipeState.active = true;
  rowSwipeState.currentX = event.clientX;
  updateRowSwipeVisual(deltaX);
}

function handleRowSwipeEnd(event) {
  if (!rowSwipeState) return;

  const deltaX = event.clientX - rowSwipeState.startX;
  const { row, item } = rowSwipeState;
  const wasSwipeGesture = rowSwipeState.active || Math.abs(deltaX) > 12;
  cancelRowSwipe();
  if (wasSwipeGesture) suppressNextRowClick(row);

  if (Math.abs(deltaX) < 82) return;

  row.classList.add(deltaX > 0 ? "swipe-commit-edit" : "swipe-commit-delete");
  window.setTimeout(() => row.classList.remove("swipe-commit-edit", "swipe-commit-delete"), 260);

  if (deltaX > 0) {
    openItemDialog(item.id);
    return;
  }

  requestDeleteMenuItem(item.id);
}

function suppressNextRowClick(row) {
  row.dataset.suppressClick = "true";
  window.setTimeout(() => {
    if (row.dataset.suppressClick === "true") delete row.dataset.suppressClick;
  }, 240);
}

function cancelRowSwipe() {
  if (!rowSwipeState) return;

  rowSwipeState.row.style.removeProperty("--swipe-offset");
  rowSwipeState.row.dataset.swipeAction = "";
  rowSwipeState.row.classList.remove("is-swiping", "swipe-edit-ready", "swipe-delete-ready");
  rowSwipeState = null;
}

function updateRowSwipeVisual(deltaX) {
  const offset = Math.max(-104, Math.min(104, deltaX));
  const { row } = rowSwipeState;

  row.style.setProperty("--swipe-offset", `${offset}px`);
  row.dataset.swipeAction = offset >= 0 ? "Edit" : "Delete";
  row.classList.add("is-swiping");
  row.classList.toggle("swipe-edit-ready", offset > 72);
  row.classList.toggle("swipe-delete-ready", offset < -72);
}

function toggleItemDetails(id) {
  const willOpen = !state.openItems.has(id);
  if (!willOpen) {
    state.openItems.delete(id);
  } else {
    state.openItems.add(id);
    recordMenuItemOpen(id);
  }

  const isOpen = state.openItems.has(id);
  if (!updateMenuRowExpandedState(id, isOpen)) {
    renderMenu({ preserveScroll: true, anchorItemId: id });
  }
}

function renderAllergyChips() {
  allergyChips.replaceChildren();
  if (allergyFilterCount) {
    allergyFilterCount.textContent = state.allergies.size ? `${state.allergies.size} selected` : "0 selected";
  }

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
  renderMenu({ preserveScroll: true });
}

function setEditMode(isEditing) {
  if (!canEditAnyCategory()) return;

  state.editing = isEditing;
  editModeButton.textContent = isEditing ? "Done" : "Edit";
  editModeButton.classList.toggle("is-active", isEditing);
  addItemButton.hidden = !isEditing || !canEditAnyCategory();
  updateDeleteMenuButton();
  renderActiveMenuHeader();
  renderMenu({ preserveScroll: true });
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
      ingredients: [],
      details: "",
      image: "",
      images: [],
      price: 0
    };
  const currentImages = getItemImages(currentItem);

  renderCategorySelect(itemCategory, { editableOnly: true, selectedValue: currentItem.category });
  dialogTitle.textContent = isNew ? "Add item" : "Edit item";
  itemId.value = currentItem.id;
  itemName.value = currentItem.name;
  itemDescription.value = currentItem.description;
  itemDetails.value = currentItem.details;
  setItemImageField(currentImages, currentImages.length ? "Current item photos. Add more URLs or upload more photos." : "No item photos selected yet.");
  itemImageFile.value = "";
  itemCategory.value = currentItem.category;
  itemDiet.value = currentItem.diet;
  itemHeat.value = currentItem.heat;
  itemPrice.value = currentItem.price;
  itemAllergens.value = currentItem.allergens.join(", ");
  itemIngredients.value = getItemIngredientTerms(currentItem).join(", ");
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
  const regularTab = tabName === "stats" || state.dashboardTab === "stats" ? "stats" : "account";
  showDashboardTab(isAdmin() ? adminTab : regularTab);
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
  if (tabName === "quiz-results") tabName = "stats";

  if (!canAccessDashboardTab(tabName)) {
    tabName = "account";
  }

  state.dashboardTab = tabName;

  dashboardTabs.forEach((tab) => {
    tab.hidden = !canAccessDashboardTab(tab.dataset.dashboardTab);
    const isActive = tab.dataset.dashboardTab === tabName;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  dashboardPanels.forEach((panel) => {
    panel.hidden = panel.dataset.dashboardPanel !== tabName;
  });

  renderDashboard();
}

function canAccessDashboardTab(tabName) {
  return isAdmin() || tabName === "account" || tabName === "stats";
}

function renderDashboard() {
  const activeUser = getActiveUser();
  if (!activeUser) return;

  dashboardKicker.textContent = isAdmin() ? "Admin" : "Account";
  dashboardTitle.textContent = "Dashboard";
  dashboardTabs.forEach((tab) => {
    tab.hidden = !canAccessDashboardTab(tab.dataset.dashboardTab);
  });

  renderAccountDashboard();
  renderDashboardStats();
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
    createDashboardMetric("Header image", designSettings.heroImage ? "Set" : "Blank", "Current menu banner"),
    createDashboardMetric("Item photos", `${designSettings.itemPhotoSize}px`, "Expanded slideshow size"),
    createDashboardMetric("Animation", formatMenuAnimationIntensity(designSettings.menuAnimationIntensity), "Menu row reveal intensity"),
    createDashboardMetric(
      "Front media",
      designSettings.frontMediaType === "image" ? "Image" : "Video",
      `Phone ${designSettings.frontMediaPhoneSize}%, web ${designSettings.frontMediaWebSize}%, ${designSettings.frontMediaBlur}px blur`
    )
  );

  syncDashboardAnimationControl();
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

function getDashboardStatMenus() {
  return isAdmin() ? restaurantMenus : getVisibleRestaurantMenus();
}

function getAllQuizResults(menus = restaurantMenus) {
  return menus
    .flatMap((menu) =>
      normalizeQuizResults(menu.quizResults).map((result) => ({
        ...result,
        menuId: result.menuId || menu.id,
        menuName: result.menuName || menu.name,
        restaurantName: result.restaurantName || menu.restaurantName,
        owner: result.owner || getMenuOwner(menu),
        shareCode: result.shareCode || normalizeShareCode(menu.shareCode)
      }))
    )
    .sort((a, b) => Date.parse(b.finishedAt || b.takenAt || "") - Date.parse(a.finishedAt || a.takenAt || ""));
}

function getMenuQuizResults(menu) {
  return normalizeQuizResults(menu?.quizResults).map((result) => ({
    ...result,
    menuId: result.menuId || menu.id,
    menuName: result.menuName || menu.name,
    restaurantName: result.restaurantName || menu.restaurantName,
    owner: result.owner || getMenuOwner(menu),
    shareCode: result.shareCode || normalizeShareCode(menu.shareCode)
  }));
}

function getQuizStats(results = []) {
  const average = results.length
    ? Math.round(results.reduce((sum, result) => sum + result.percent, 0) / results.length)
    : 0;
  const highest = results.reduce((best, result) => Math.max(best, result.percent), 0);
  return {
    average,
    highest,
    latest: results[0] || null
  };
}

function renderDashboardStats() {
  if (!dashboardStatsSummary || !dashboardStatsList) return;

  pullSharedQuizResultsForDashboard();
  const statMenus = getDashboardStatMenus();
  const results = getAllQuizResults(statMenus);
  const statsByMenu = statMenus.map((menu) => ({
    menu,
    stats: getMenuStats(menu),
    itemRows: getMenuItemClickRows(menu),
    quizResults: getMenuQuizResults(menu)
  }));
  const totalMenuClicks = statsByMenu.reduce((sum, entry) => sum + entry.stats.clicks, 0);
  const totalItemClicks = statsByMenu.reduce(
    (sum, entry) => sum + entry.itemRows.reduce((itemSum, item) => itemSum + item.clicks, 0),
    0
  );
  const allItemRows = statsByMenu.flatMap((entry) => entry.itemRows.map((item) => ({ ...item, menuName: entry.menu.name })));
  const topItem = allItemRows.sort((a, b) => b.clicks - a.clicks)[0];
  const quizStats = getQuizStats(results);

  dashboardStatsSummary.replaceChildren(
    createDashboardMetric("Menus", String(statMenus.length), isAdmin() ? "Tracked restaurant menus" : "Menus visible to you"),
    createDashboardMetric("Menu opens", String(totalMenuClicks), "Every menu launch from now forward"),
    createDashboardMetric("Item opens", String(totalItemClicks), "Dish expansions tracked from now forward"),
    createDashboardMetric("Quiz attempts", String(results.length), results.length ? `${quizStats.average}% average score` : "No completed quizzes yet"),
    createDashboardMetric("Top item", topItem ? topItem.name : "None yet", topItem ? `${topItem.clicks} opens - ${topItem.menuName}` : "Open dishes to build item stats"),
    createDashboardMetric("Latest quiz", quizStats.latest ? quizStats.latest.takerName : "None yet", quizStats.latest ? formatQuizDate(quizStats.latest.finishedAt || quizStats.latest.takenAt) : "No quiz has been taken")
  );

  dashboardStatsList.replaceChildren();
  if (!statMenus.length) {
    dashboardStatsList.append(createDashboardEmpty("No menus have been created yet."));
    return;
  }

  statsByMenu
    .sort((a, b) => {
      const clickDifference = b.stats.clicks - a.stats.clicks;
      if (clickDifference) return clickDifference;
      const quizDifference = b.quizResults.length - a.quizResults.length;
      if (quizDifference) return quizDifference;
      return b.menu.items.length - a.menu.items.length;
    })
    .forEach((entry, index) => {
      dashboardStatsList.append(createMenuStatsCard(entry, index === 0));
    });
}

function createMenuStatsCard({ menu, stats, itemRows, quizResults }, open = false) {
  const details = document.createElement("details");
  details.className = "stats-menu-card";
  details.open = open;

  const summary = document.createElement("summary");
  summary.className = "stats-menu-summary";

  const title = document.createElement("span");
  title.className = "stats-menu-title";
  const strong = document.createElement("strong");
  strong.textContent = menu.name;
  const small = document.createElement("small");
  small.textContent = `${menu.restaurantName || "No restaurant linked"} - Owner: ${getMenuOwner(menu)} - ${menu.items.length} items`;
  title.append(strong, small);

  const meta = document.createElement("span");
  meta.className = "stats-menu-meta";
  [
    `${stats.clicks} menu opens`,
    `${itemRows.reduce((sum, item) => sum + item.clicks, 0)} item opens`,
    `${quizResults.length} quizzes`
  ].forEach((label) => {
    const pill = document.createElement("span");
    pill.textContent = label;
    meta.append(pill);
  });

  const marker = document.createElement("span");
  marker.className = "stats-menu-marker";
  marker.setAttribute("aria-hidden", "true");

  summary.append(title, meta, marker);

  const quizStats = getQuizStats(quizResults);
  const topItem = itemRows[0];
  const body = document.createElement("div");
  body.className = "stats-menu-body";
  body.append(
    createStatsMetricStrip([
      ["Last menu open", stats.lastOpenedAt ? formatQuizDate(stats.lastOpenedAt) : "No timestamp"],
      ["Most opened item", topItem ? `${topItem.name} (${topItem.clicks})` : "No item opens"],
      ["Quiz average", quizResults.length ? `${quizStats.average}%` : "No quizzes"],
      ["Best quiz", quizResults.length ? `${quizStats.highest}%` : "No quizzes"]
    ]),
    createStatsTable(
      "Recent menu opens",
      ["#", "Timestamp"],
      stats.recentOpens.slice(0, 10).map((timestamp, index) => [String(index + 1), formatQuizDate(timestamp)]),
      stats.clicks
        ? "Older menu opens were counted before timestamp history was added."
        : "No menu opens have been tracked yet."
    ),
    createStatsTable(
      "Most opened items",
      ["Item", "Category", "Opens", "Last opened"],
      itemRows.slice(0, 10).map((item) => [
        item.name,
        item.category,
        String(item.clicks),
        item.lastOpenedAt ? formatQuizDate(item.lastOpenedAt) : "No timestamp"
      ]),
      "No item opens yet. Expanding a dish will start tracking item stats."
    ),
    createStatsTable(
      "Quiz results",
      ["Name", "Score", "Questions", "Taken"],
      quizResults.slice(0, 10).map((result) => [
        result.takerName,
        `${result.score}/${result.total} (${result.percent}%)`,
        String(result.questionLimit || result.total),
        `${formatQuizDate(result.finishedAt || result.takenAt)} - ${result.source === "shared-code" ? "Shared code" : "Logged in"}`
      ]),
      "No quiz results for this menu yet."
    )
  );

  details.append(summary, body);
  return details;
}

function createStatsMetricStrip(metrics = []) {
  const strip = document.createElement("div");
  strip.className = "stats-metric-strip";
  metrics.forEach(([label, value]) => {
    const card = document.createElement("span");
    const labelElement = document.createElement("small");
    const valueElement = document.createElement("strong");
    labelElement.textContent = label;
    valueElement.textContent = value;
    card.append(labelElement, valueElement);
    strip.append(card);
  });
  return strip;
}

function createStatsTable(title, columns, rows, emptyText) {
  const section = document.createElement("section");
  section.className = "stats-table-card";

  const heading = document.createElement("div");
  heading.className = "section-heading";
  const kicker = document.createElement("p");
  kicker.className = "kicker";
  kicker.textContent = "Details";
  const strong = document.createElement("strong");
  strong.textContent = title;
  heading.append(kicker, strong);

  if (!rows.length) {
    const empty = createDashboardEmpty(emptyText);
    section.append(heading, empty);
    return section;
  }

  const scroll = document.createElement("div");
  scroll.className = "stats-table-scroll";
  const table = document.createElement("table");
  table.className = "stats-table";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  columns.forEach((column) => {
    const th = document.createElement("th");
    th.textContent = column;
    headerRow.append(th);
  });
  thead.append(headerRow);

  const tbody = document.createElement("tbody");
  rows.forEach((row) => {
    const tr = document.createElement("tr");
    row.forEach((cell) => {
      const td = document.createElement("td");
      td.textContent = cell;
      tr.append(td);
    });
    tbody.append(tr);
  });

  table.append(thead, tbody);
  scroll.append(table);
  section.append(heading, scroll);
  return section;
}

async function getSharedQuizDocumentsForDashboard(statMenus = []) {
  const collection = getShareCollection();
  if (!collection) return [];

  const documents = [];
  const seenCodes = new Set();
  const addDocument = (code, snapshot) => {
    const normalizedCode = normalizeShareCode(code || snapshot?.id);
    if (!normalizedCode || seenCodes.has(normalizedCode) || !snapshot?.exists) return;
    seenCodes.add(normalizedCode);
    documents.push({
      code: normalizedCode,
      data: snapshot.data() || {}
    });
  };

  try {
    const snapshot = await withTimeout(collection.get(), 10000, "Shared quiz lookup timed out.");
    snapshot.forEach((documentSnapshot) => addDocument(documentSnapshot.id, documentSnapshot));
    return documents;
  } catch {
    const directCodes = uniqueValues(statMenus.map((menu) => normalizeShareCode(menu.shareCode)).filter(Boolean));
    await Promise.all(
      directCodes.map(async (code) => {
        const snapshot = await getShareDocument(code)?.get().catch(() => null);
        addDocument(code, snapshot);
      })
    );
    return documents;
  }
}

function findMenuForSharedQuizData(data = {}, shareCode = "", statMenus = []) {
  const normalizedCode = normalizeShareCode(shareCode || data.code);
  const menuId = data.menuId || data.menu?.id || "";
  return statMenus.find((menu) => {
    return menu.id === menuId || normalizeShareCode(menu.shareCode) === normalizedCode;
  }) || null;
}

async function pullSharedQuizResultsForDashboard() {
  const now = Date.now();
  if (sharedQuizResultsPulling || now - sharedQuizResultsPulledAt < sharedQuizResultsPullInterval) return;
  if (!getActiveUser() || !getShareCollection()) return;

  const statMenus = getDashboardStatMenus();
  if (!statMenus.length) return;

  sharedQuizResultsPulling = true;
  sharedQuizResultsPulledAt = now;

  try {
    let changed = false;
    const sharedDocuments = await getSharedQuizDocumentsForDashboard(statMenus);
    sharedDocuments.forEach(({ code, data }) => {
      const menu = findMenuForSharedQuizData(data, code, statMenus);
      if (!menu) return;

      if (code && normalizeShareCode(menu.shareCode) !== code) {
        menu.shareCode = code;
        changed = true;
      }

      const sharedResults = getShareQuizResults(data)
        .filter((result) => {
          return (
            !result.menuId ||
            result.menuId === menu.id ||
            normalizeShareCode(result.shareCode) === code
          );
        })
        .map((result) => ({
          ...result,
          menuId: menu.id,
          menuName: result.menuName || menu.name,
          restaurantName: result.restaurantName || menu.restaurantName,
          owner: result.owner || getMenuOwner(menu),
          shareCode: code || normalizeShareCode(menu.shareCode)
        }));

      const merged = mergeQuizResults(menu.quizResults || [], sharedResults);
      if (!areQuizResultListsEqual(menu.quizResults || [], merged)) {
        menu.quizResults = merged;
        changed = true;
      }
    });

    if (changed) {
      saveRestaurantMenus();
      renderDashboardStats();
    }
  } catch {
    // Results already saved locally; Firebase sync status handles broader connection failures.
  } finally {
    sharedQuizResultsPulling = false;
  }
}

function areQuizResultListsEqual(first = [], second = []) {
  const firstIds = normalizeQuizResults(first).map((result) => result.id).join("|");
  const secondIds = normalizeQuizResults(second).map((result) => result.id).join("|");
  return firstIds === secondIds;
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
  const willOpen = createUserPanel.hidden;
  createUserPanel.hidden = !willOpen;
  createUserToggle.setAttribute("aria-expanded", String(!createUserPanel.hidden));
  createUserToggle.querySelector(".expand-marker").textContent = createUserPanel.hidden ? "+" : "-";
  if (willOpen) renderNewUserAccessControls();
}

function renderNewUserAccessControls({ reset = false } = {}) {
  if (!newUserPermissionsSlot || !newUserMenuAccessSlot) return;

  const permissions = reset ? [] : getSelectedPermissions(userForm);
  const menuIds = reset ? [] : getSelectedMenuIds(userForm);
  newUserPermissionsSlot.replaceChildren(createPermissionFieldset({ role: "editor", permissions }));
  newUserMenuAccessSlot.replaceChildren(createMenuAccessFieldset({ role: "editor", menuIds }));
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
  applyDesignSettings();
  designDialog.close();
}

function saveDesign(event) {
  event.preventDefault();
  if (!isAdmin()) return;

  const activeMenu = getActiveRestaurantMenu();
  const requestedHeroImage = heroImageUrl.value.trim();
  const heroImageValue = shouldUseBuiltInMott32Hero(activeMenu, requestedHeroImage) ? defaultHeroImage : requestedHeroImage;
  const requestedFrontMedia = frontMediaUrl.value.trim() || defaultFrontMediaUrl;
  designSettings = {
    ...designSettings,
    ink: colorInk.value,
    leaf: colorLeaf.value,
    gold: colorGold.value,
    aqua: colorAqua.value,
    page: colorPage.value,
    panel: colorPanel.value,
    heroImage: heroImageValue,
    itemPhotoSize: Number(itemPhotoSize.value) || defaultDesign.itemPhotoSize,
    frontMediaType: frontMediaType.value === "image" ? "image" : "video",
    frontMediaUrl: requestedFrontMedia,
    frontMediaPhoneSize: Number(frontMediaPhoneSize.value) || defaultDesign.frontMediaPhoneSize,
    frontMediaWebSize: Number(frontMediaWebSize.value) || defaultDesign.frontMediaWebSize,
    frontMediaBlur: Number(frontMediaBlur.value),
    frontVideoLength: Number(frontVideoLength.value) || 0,
    menuAnimationIntensity: getMenuAnimationIntensity(menuAnimationIntensity.value)
  };

  saveDesignSettings();
  applyDesignSettings();
  renderDashboardCustomizationSummary();
  closeDesignDialog();
}

function resetDesign() {
  if (!isAdmin()) return;
  designSettings = normalizeDesignSettings(defaultDesign);
  saveDesignSettings();
  applyDesignSettings();
  syncDesignForm();
  renderDashboardCustomizationSummary();
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
  const activeMenu = getActiveRestaurantMenu();
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
          @page { margin: 0.45in; }
          * { box-sizing: border-box; }
          :root {
            --ink: ${designSettings.ink};
            --muted: #66716b;
            --line: #ded9cd;
            --leaf: ${designSettings.leaf};
            --gold: ${designSettings.gold};
            --aqua: ${designSettings.aqua};
            --paper: ${designSettings.panel};
            --page: ${designSettings.page};
          }
          body {
            margin: 0;
            background: var(--page);
            color: var(--ink);
            font-family: Inter, Arial, sans-serif;
            line-height: 1.35;
          }
          header {
            display: grid;
            grid-template-columns: 120px minmax(0, 1fr);
            align-items: center;
            gap: 20px;
            margin-bottom: 18px;
            border: 1px solid var(--line);
            border-radius: 10px;
            padding: 16px;
            background: #fffdfa;
            break-inside: avoid;
          }
          .hero-logo {
            display: grid;
            width: 120px;
            height: 82px;
            place-items: center;
            overflow: hidden;
            border-radius: 8px;
            background: #f4f1ea;
          }
          .hero-logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          .kicker {
            margin: 0 0 4px;
            color: var(--leaf);
            font-size: 10px;
            font-weight: 900;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }
          h1 {
            margin: 0;
            font-size: 28px;
            line-height: 1;
          }
          .subtitle {
            margin: 8px 0 0;
            color: var(--muted);
            font-size: 12px;
            font-weight: 700;
          }
          .category {
            margin-top: 16px;
          }
          h2 {
            margin: 0 0 8px;
            border-radius: 8px;
            padding: 9px 12px;
            background: var(--ink);
            color: white;
            font-size: 13px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          .item {
            display: grid;
            grid-template-columns: ${pdfIncludePhotos.checked ? "118px minmax(0, 1fr)" : "1fr"};
            gap: 14px;
            margin-bottom: 10px;
            border: 1px solid var(--line);
            border-radius: 10px;
            padding: 12px;
            background: #fffdfa;
            break-inside: avoid;
          }
          .photo-box {
            display: grid;
            width: 118px;
            min-height: 118px;
            place-items: center;
            overflow: hidden;
            border: 1px solid #eee6d8;
            border-radius: 8px;
            background: #f4f1ea;
            color: var(--muted);
            font-size: 10px;
            font-weight: 900;
            text-align: center;
            text-transform: uppercase;
          }
          .photo-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .item-main {
            min-width: 0;
          }
          .item-head {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            gap: 12px;
            align-items: start;
            margin-bottom: 6px;
          }
          h3 {
            margin: 0;
            font-size: 16px;
            line-height: 1.15;
          }
          .price {
            border: 1px solid rgba(217, 157, 43, 0.32);
            border-radius: 999px;
            padding: 4px 9px;
            background: #fff6dd;
            color: var(--gold);
            font-size: 12px;
            font-weight: 900;
            white-space: nowrap;
          }
          p {
            margin: 4px 0;
            font-size: 12px;
          }
          .description {
            color: var(--ink);
            font-size: 12px;
          }
          .detail-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
            margin-top: 10px;
          }
          .detail-block {
            border: 1px solid #eee6d8;
            border-radius: 8px;
            padding: 8px;
            background: #fbfaf6;
          }
          .meta {
            margin: 0 0 6px;
            color: var(--muted);
            font-size: 9px;
            font-weight: 900;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          .chip-list {
            display: flex;
            gap: 5px;
            flex-wrap: wrap;
          }
          .chip {
            border-radius: 999px;
            padding: 4px 7px;
            font-size: 10px;
            font-weight: 800;
          }
          .allergy-chip {
            border: 1px solid rgba(201, 79, 61, 0.24);
            background: #fbebe8;
            color: #b54233;
          }
          .ingredient-chip {
            border: 1px solid rgba(49, 124, 142, 0.24);
            background: #eaf4f6;
            color: var(--aqua);
          }
          .item-notes {
            margin-top: 10px;
            border-top: 1px solid #eee6d8;
            padding-top: 8px;
            color: var(--muted);
            font-size: 11px;
          }
          @media print {
            body {
              background: white;
            }
            .item,
            header,
            h2 {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <header>
          <div class="hero-logo">
            ${designSettings.heroImage ? `<img src="${escapeAttribute(designSettings.heroImage)}" alt="Restaurant logo" />` : "Logo"}
          </div>
          <div>
            <p class="kicker">Menu Matrix Export</p>
            <h1>${escapeHtml(activeMenu?.name || "Selected Menu")}</h1>
            <p class="subtitle">${escapeHtml(activeMenu?.restaurantName || "Selected menu items")} - ${items.length} item${items.length === 1 ? "" : "s"}</p>
          </div>
        </header>
        ${itemMarkup}
      </body>
    </html>
  `;
}

function getPrintableItemMarkup(item) {
  const firstPhoto = getItemImages(item)[0] || "";
  const photo = pdfIncludePhotos.checked
    ? `<div class="photo-box">${firstPhoto ? `<img src="${escapeAttribute(firstPhoto)}" alt="" />` : "No photo"}</div>`
    : "";
  const price = pdfIncludePrices.checked ? `<span class="price">${formatMenuPrice(item.price)}</span>` : "";
  const allergens = getItemAllergens(item);
  const ingredients = getItemIngredientTerms(item).slice(0, 12);
  const allergenMarkup = pdfIncludeAllergens.checked
    ? `
      <section class="detail-block">
        <p class="meta">Allergies</p>
        <div class="chip-list">
          ${(allergens.length ? allergens : ["No major allergens"]).map((allergen) => `<span class="chip allergy-chip">${escapeHtml(allergen)}</span>`).join("")}
        </div>
      </section>
    `
    : "";
  const ingredientMarkup = `
    <section class="detail-block">
      <p class="meta">Ingredients</p>
      <div class="chip-list">
        ${(ingredients.length ? ingredients : ["No ingredient notes"]).map((ingredient) => `<span class="chip ingredient-chip">${escapeHtml(ingredient)}</span>`).join("")}
      </div>
    </section>
  `;
  const notes = pdfIncludeNotes.checked ? `<p class="item-notes">${escapeHtml(item.details)}</p>` : "";

  return `
    <article class="item">
      ${photo}
      <div class="item-main">
        <div class="item-head">
          <h3>${escapeHtml(item.name)}</h3>
          ${price}
        </div>
        <p class="description">${escapeHtml(item.description)}</p>
        <div class="detail-grid">
          ${ingredientMarkup}
          ${allergenMarkup}
        </div>
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

function canStudyActiveMenu() {
  return Boolean((getActiveUser() || state.sharedMenu) && getActiveRestaurantMenu() && menuItems.length);
}

function randomItem(values) {
  if (!values.length) return null;
  return values[Math.floor(Math.random() * values.length)];
}

function shuffleValues(values) {
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function uniqueValues(values) {
  const seen = new Set();
  const unique = [];
  values.forEach((value) => {
    const label = String(value || "").trim();
    const key = label.toLowerCase();
    if (label && !seen.has(key)) {
      seen.add(key);
      unique.push(label);
    }
  });
  return unique;
}

function normalizeQuizQuestion(question) {
  if (!question || !Array.isArray(question.options) || !Array.isArray(question.answers)) return null;

  const seenOptions = new Set();
  const options = question.options
    .map((option) => ({
      label: String(option?.label || option?.value || "").trim(),
      value: String(option?.value || "").trim()
    }))
    .filter((option) => {
      const key = option.value.toLowerCase();
      if (!option.label || !option.value || seenOptions.has(key)) return false;
      seenOptions.add(key);
      return true;
    });
  const optionValues = new Set(options.map((option) => option.value));
  const answers = uniqueValues(question.answers.map((answer) => String(answer || "").trim()))
    .filter((answer) => optionValues.has(answer));

  if (!options.length || !answers.length) return null;

  return {
    ...question,
    options,
    answers,
    multiple: Boolean(question.multiple || answers.length > 1),
    selected: Array.isArray(question.selected) ? question.selected.filter((value) => optionValues.has(value)) : []
  };
}

function getItemAllergens(item) {
  return uniqueValues(Array.isArray(item?.allergens) ? item.allergens : []);
}

function getItemExplicitIngredients(item) {
  return normalizeIngredientList(item?.ingredients || []);
}

function getItemIngredientText(item) {
  const explicitIngredients = getItemExplicitIngredients(item);
  if (explicitIngredients.length) return explicitIngredients.join(", ");

  const details = String(item?.details || "");
  const ingredientMatch = details.match(/Ingredients:\s*(.*?)(?:\.\s*(?:Portion|Accompaniments|Price not listed|Section):|$)/i);
  const rawText = ingredientMatch?.[1] || details || item?.description || "";
  return rawText
    .replace(/\bSection:\s*[^.]+\./gi, "")
    .replace(/\bIngredients:\s*/gi, "")
    .replace(/\bPortion:\s*.*$/i, "")
    .replace(/\bAccompaniments:\s*.*$/i, "")
    .replace(/\bPrice not listed.*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function inferIngredientTermsFromText(text) {
  const source = String(text || "").toLowerCase();
  const vocabularyMatches = ingredientVocabulary.filter((term) => source.includes(term.toLowerCase()));
  if (vocabularyMatches.length) return uniqueValues(vocabularyMatches);

  return uniqueValues(
    source
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 4)
      .slice(0, 8)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  );
}

function getItemIngredientTerms(item) {
  const explicitIngredients = getItemExplicitIngredients(item);
  if (explicitIngredients.length) return explicitIngredients;

  return inferIngredientTermsFromText(`${getItemIngredientText(item)} ${item?.description || ""}`);
}

function getStudyItemsWithAllergens() {
  return menuItems.filter((item) => getItemAllergens(item).length);
}

function getStudyItemsWithIngredients() {
  return menuItems.filter((item) => getItemIngredientTerms(item).length || getItemIngredientText(item));
}

function getAllStudyAllergens() {
  return uniqueValues(menuItems.flatMap(getItemAllergens));
}

function getAllStudyIngredientTerms() {
  return uniqueValues(menuItems.flatMap(getItemIngredientTerms));
}

function openFlashcardPage() {
  if (!canStudyActiveMenu()) return;

  closeDrawer();
  state.flashcard = null;
  showScreen("flashcards");
  nextFlashcard();
}

function closeFlashcardPage() {
  showScreen(state.sharedMenu && !getActiveUser() ? "shared" : "menu");
}

function nextFlashcard() {
  if (!canStudyActiveMenu()) return;

  const mode =
    state.flashcardMode === "mixed"
      ? randomItem(["allergies", "ingredients"])
      : state.flashcardMode;
  const deck = mode === "allergies" ? getStudyItemsWithAllergens() : getStudyItemsWithIngredients();
  const item = randomItem(deck.length ? deck : menuItems);
  if (!item) return;

  state.flashcard = {
    itemId: item.id,
    mode,
    revealed: false
  };
  renderFlashcard();
}

function toggleFlashcardMode() {
  const currentIndex = flashcardModes.indexOf(state.flashcardMode);
  state.flashcardMode = flashcardModes[(currentIndex + 1) % flashcardModes.length];
  nextFlashcard();
}

function flipFlashcard() {
  if (!state.flashcard) return;
  state.flashcard.revealed = !state.flashcard.revealed;
  renderFlashcard();
}

function renderFlashcard() {
  if (!flashcardPage || state.screen !== "flashcards") return;

  const modeLabel = {
    mixed: "Mixed",
    allergies: "Allergies",
    ingredients: "Ingredients"
  }[state.flashcardMode];
  flashcardModeButton.textContent = modeLabel;

  const item = menuItems.find((candidate) => candidate.id === state.flashcard?.itemId);
  if (!item) {
    flashcardType.textContent = "Menu item";
    flashcardPrompt.textContent = "Choose a card to start.";
    flashcardHint.textContent = "Cards can ask for ingredients or allergy notes.";
    flashcardAnswer.hidden = true;
    flashcardAnswer.textContent = "";
    flashcardFlipButton.textContent = "Show answer";
    return;
  }

  const isAllergyCard = state.flashcard.mode === "allergies";
  const allergens = getItemAllergens(item);
  const ingredientText = getItemIngredientText(item);
  flashcardType.textContent = isAllergyCard ? "Allergy card" : "Ingredient card";
  flashcardPrompt.textContent = item.name;
  flashcardHint.textContent = isAllergyCard
    ? "Name the listed allergy notes before flipping."
    : "Name the main ingredients before flipping.";
  flashcardAnswer.hidden = !state.flashcard.revealed;
  flashcardAnswer.textContent = isAllergyCard
    ? allergens.join(", ") || "No major allergens listed."
    : ingredientText || "No ingredient notes listed.";
  flashcardFlipButton.textContent = state.flashcard.revealed ? "Hide answer" : "Show answer";
}

function openQuizPage() {
  if (!canStudyActiveMenu()) return;

  closeDrawer();
  const activeUser = getActiveUser();
  state.quizSession = null;
  state.quiz = null;
  state.quizScore = {
    correct: 0,
    total: 0
  };
  quizSetupForm?.reset();
  if (quizTakerName && activeUser?.username) quizTakerName.value = activeUser.username;
  showScreen("quiz");
  renderQuiz();
}

function closeQuizPage() {
  showScreen(state.sharedMenu && !getActiveUser() ? "shared" : "menu");
}

function getSelectedQuizQuestionCount() {
  const selected = quizSetupForm?.querySelector("input[name='quizQuestionCount']:checked");
  return Math.max(5, Number(selected?.value) || 5);
}

function startQuizSession(event) {
  event.preventDefault();
  if (!canStudyActiveMenu()) return;

  const activeMenu = getActiveRestaurantMenu();
  const takerName = quizTakerName.value.trim();
  if (!takerName) {
    quizTakerName.focus();
    return;
  }

  const questionLimit = getSelectedQuizQuestionCount();
  state.quizScore = {
    correct: 0,
    total: 0
  };
  state.quizSession = {
    id: `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    takerName,
    questionLimit,
    startedAt: new Date().toISOString(),
    finishedAt: "",
    menuId: activeMenu?.id || "",
    menuName: activeMenu?.name || "Shared menu",
    restaurantName: activeMenu?.restaurantName || "",
    owner: getMenuOwner(activeMenu),
    shareCode: normalizeShareCode(activeMenu?.shareCode || state.sharedCode || ""),
    completed: false,
    saved: false,
    saveMessage: ""
  };
  state.quiz = null;
  nextQuizQuestion();
}

function createQuizQuestion() {
  const availableBuilders = [
    createAllergenYesNoQuestion,
    createIngredientYesNoQuestion,
    createAllergenMultiQuestion,
    createItemByAllergenQuestion,
    createItemByIngredientQuestion
  ];
  const shuffledBuilders = shuffleValues(availableBuilders);

  for (const builder of shuffledBuilders) {
    const question = normalizeQuizQuestion(builder());
    if (question) return question;
  }

  return null;
}

function createAllergenYesNoQuestion() {
  const item = randomItem(menuItems);
  const allAllergens = getAllStudyAllergens();
  if (!item || !allAllergens.length) return null;

  const itemAllergens = getItemAllergens(item);
  const shouldUseCorrect = itemAllergens.length && Math.random() > 0.45;
  const allergen = shouldUseCorrect
    ? randomItem(itemAllergens)
    : randomItem(allAllergens.filter((candidate) => !itemAllergens.includes(candidate))) || randomItem(allAllergens);
  const answer = itemAllergens.includes(allergen) ? "yes" : "no";

  return {
    typeLabel: "Allergy check",
    prompt: `Does ${item.name} list ${allergen} as an allergy note?`,
    multiple: false,
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" }
    ],
    answers: [answer],
    explanation: `${item.name}: ${itemAllergens.join(", ") || "No major allergens listed."}`
  };
}

function createIngredientYesNoQuestion() {
  const item = randomItem(menuItems);
  const allTerms = getAllStudyIngredientTerms();
  if (!item || !allTerms.length) return null;

  const itemTerms = getItemIngredientTerms(item);
  const shouldUseCorrect = itemTerms.length && Math.random() > 0.45;
  const term = shouldUseCorrect
    ? randomItem(itemTerms)
    : randomItem(allTerms.filter((candidate) => !itemTerms.includes(candidate))) || randomItem(allTerms);
  const answer = itemTerms.includes(term) ? "yes" : "no";

  return {
    typeLabel: "Ingredient check",
    prompt: `Do the menu notes for ${item.name} mention ${term}?`,
    multiple: false,
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" }
    ],
    answers: [answer],
    explanation: `${item.name}: ${getItemIngredientText(item) || "No ingredient notes listed."}`
  };
}

function createAllergenMultiQuestion() {
  const item = randomItem(getStudyItemsWithAllergens());
  const allAllergens = getAllStudyAllergens();
  if (!item || allAllergens.length < 3) return null;

  const correct = shuffleValues(getItemAllergens(item)).slice(0, 3);
  const distractors = shuffleValues(allAllergens.filter((allergen) => !correct.includes(allergen))).slice(0, Math.max(2, 5 - correct.length));
  const options = shuffleValues([...correct, ...distractors]).map((value) => ({ label: value, value }));

  return {
    typeLabel: "Multi select",
    prompt: `Select every allergy note listed for ${item.name}.`,
    multiple: true,
    options,
    answers: correct,
    explanation: `${item.name}: ${getItemAllergens(item).join(", ")}`
  };
}

function createItemByAllergenQuestion() {
  const allAllergens = getAllStudyAllergens();
  const allergen = randomItem(allAllergens);
  if (!allergen) return null;

  const correctItems = menuItems.filter((item) => getItemAllergens(item).includes(allergen));
  return createItemMatchQuestion({
    term: allergen,
    correctItems,
    distractorItems: menuItems.filter((item) => !getItemAllergens(item).includes(allergen)),
    singularPrompt: (value) => `Which item lists ${value} as an allergy note?`,
    multiplePrompt: (value) => `Select every item below that lists ${value} as an allergy note.`,
    typeLabel: "Find allergy item",
    explanationLabel: (value) => `list ${value}`
  });
}

function createItemByIngredientQuestion() {
  const allTerms = getAllStudyIngredientTerms();
  const term = randomItem(allTerms);
  if (!term) return null;

  const correctItems = menuItems.filter((item) => getItemIngredientTerms(item).includes(term));
  return createItemMatchQuestion({
    term,
    correctItems,
    distractorItems: menuItems.filter((item) => !getItemIngredientTerms(item).includes(term)),
    singularPrompt: (value) => `Which item mentions ${value} in its menu notes?`,
    multiplePrompt: (value) => `Select every item below that mentions ${value} in its menu notes.`,
    typeLabel: "Find ingredient item",
    explanationLabel: (value) => `mention ${value}`
  });
}

function createItemMatchQuestion({ term, correctItems = [], distractorItems = [], singularPrompt, multiplePrompt, typeLabel, explanationLabel }) {
  const correctPool = shuffleValues(correctItems).filter((item) => item?.id);
  if (!correctPool.length) return null;

  const maxCorrectOptions = Math.min(3, correctPool.length);
  const correctCount = correctPool.length > 1
    ? Math.max(2, Math.min(maxCorrectOptions, 2 + Math.floor(Math.random() * maxCorrectOptions)))
    : 1;
  const selectedCorrect = correctPool.slice(0, correctCount);
  const correctIds = new Set(correctItems.map((item) => item.id));
  const distractors = shuffleValues(distractorItems.filter((item) => item?.id && !correctIds.has(item.id)))
    .slice(0, Math.max(2, 5 - selectedCorrect.length));
  if (distractors.length < 2) return null;

  const options = shuffleValues([...selectedCorrect, ...distractors]).map((item) => ({ label: item.name, value: item.id }));
  const answers = selectedCorrect.map((item) => item.id);
  const isMultiple = answers.length > 1;
  const answerNames = selectedCorrect.map((item) => item.name).join(", ");
  const explanationAction = typeof explanationLabel === "function" ? explanationLabel(term) : `match ${term}`;

  return {
    typeLabel: isMultiple ? "Select items" : typeLabel,
    prompt: isMultiple ? multiplePrompt(term) : singularPrompt(term),
    multiple: isMultiple,
    options,
    answers,
    explanation: isMultiple
      ? `Correct options in this question: ${answerNames}.`
      : `${answerNames} ${explanationAction}.`
  };
}

function nextQuizQuestion() {
  if (!canStudyActiveMenu()) return;
  if (!state.quizSession || state.quizSession.completed) {
    renderQuiz();
    return;
  }
  if (state.quiz && !state.quiz.answered) return;
  if (state.quizScore.total >= state.quizSession.questionLimit) {
    finishQuizSession();
    return;
  }

  state.quiz = createQuizQuestion();
  if (state.quiz) {
    state.quiz.questionNumber = state.quizScore.total + 1;
  }
  renderQuiz();
}

function renderQuiz() {
  if (!quizPage || state.screen !== "quiz") return;

  const hasSession = Boolean(state.quizSession);
  const isComplete = Boolean(state.quizSession?.completed);
  quizSetupPanel.hidden = hasSession;
  quizScorePanel.hidden = !hasSession;
  quizCard.hidden = !hasSession;
  quizResultPanel.hidden = !isComplete;
  quizScore.textContent = hasSession
    ? `${state.quizScore.correct} / ${state.quizScore.total} answered`
    : "0 / 0";
  quizOptions.replaceChildren();

  if (!hasSession) {
    quizType.textContent = "Ready";
    quizQuestion.textContent = "Enter your name to start.";
    quizMessage.textContent = "";
    quizCheckButton.disabled = true;
    quizNewQuestionButton.disabled = true;
    return;
  }

  if (!state.quiz) {
    quizType.textContent = "Randomized";
    quizQuestion.textContent = "Start a quiz question.";
    quizMessage.textContent = "No quiz data is ready for this menu yet.";
    quizCheckButton.disabled = true;
    quizNewQuestionButton.disabled = true;
    return;
  }

  quizType.textContent = `Question ${Math.min(state.quiz.questionNumber || state.quizScore.total + 1, state.quizSession.questionLimit)} of ${state.quizSession.questionLimit} - ${state.quiz.typeLabel}`;
  quizQuestion.textContent = state.quiz.prompt;
  quizMessage.textContent = isComplete
    ? state.quizSession.saveMessage || "Quiz complete."
    : state.quiz.answered
      ? state.quiz.message
      : state.quiz.multiple
        ? "Select all that apply."
        : "";
  const inputType = state.quiz.multiple ? "checkbox" : "radio";

  state.quiz.options.forEach((option) => {
    const label = document.createElement("label");
    label.className = "quiz-option";
    if (state.quiz.answered && state.quiz.answers.includes(option.value)) {
      label.classList.add("is-correct");
    }
    if (state.quiz.answered && state.quiz.selected.includes(option.value) && !state.quiz.answers.includes(option.value)) {
      label.classList.add("is-wrong");
    }

    const input = document.createElement("input");
    input.type = inputType;
    input.name = "quiz-option";
    input.value = option.value;
    input.disabled = state.quiz.answered;
    input.checked = state.quiz.selected?.includes(option.value) || false;
    label.append(input, document.createTextNode(option.label));
    quizOptions.append(label);
  });

  quizCheckButton.disabled = state.quiz.answered || isComplete;
  quizNewQuestionButton.disabled = !state.quiz.answered || isComplete || state.quizScore.total >= state.quizSession.questionLimit;
  quizNewQuestionButton.textContent =
    state.quizScore.total >= state.quizSession.questionLimit ? "Quiz complete" : "Next question";
  quizResetButton.textContent = "Restart quiz";
  renderQuizResult();
}

function checkQuizAnswer() {
  if (!state.quizSession || !state.quiz || state.quiz.answered || state.quizSession.completed) return;

  const selected = [...quizOptions.querySelectorAll("input:checked")].map((input) => input.value);
  if (!selected.length) {
    quizMessage.textContent = "Choose an answer first.";
    return;
  }

  const expected = [...state.quiz.answers].sort();
  const actual = [...selected].sort();
  const isCorrect = expected.length === actual.length && expected.every((value, index) => value === actual[index]);
  state.quiz.answered = true;
  state.quiz.selected = selected;
  state.quiz.message = isCorrect ? `Correct. ${state.quiz.explanation}` : `Not quite. ${state.quiz.explanation}`;
  state.quizScore.total += 1;
  if (isCorrect) state.quizScore.correct += 1;
  if (state.quizScore.total >= state.quizSession.questionLimit) {
    finishQuizSession();
    return;
  }
  renderQuiz();
}

function resetQuizScore() {
  state.quizSession = null;
  state.quiz = null;
  state.quizScore = {
    correct: 0,
    total: 0
  };
  quizSetupForm?.reset();
  const activeUser = getActiveUser();
  if (quizTakerName && activeUser?.username) quizTakerName.value = activeUser.username;
  quizMessage.textContent = "";
  renderQuiz();
}

function getCurrentQuizResult() {
  if (!state.quizSession) return null;

  return normalizeQuizResult({
    id: state.quizSession.id,
    takerName: state.quizSession.takerName,
    menuId: state.quizSession.menuId,
    menuName: state.quizSession.menuName,
    restaurantName: state.quizSession.restaurantName,
    owner: state.quizSession.owner,
    shareCode: state.quizSession.shareCode,
    takenAt: state.quizSession.startedAt,
    finishedAt: state.quizSession.finishedAt || new Date().toISOString(),
    questionLimit: state.quizSession.questionLimit,
    score: state.quizScore.correct,
    total: state.quizScore.total,
    source: state.sharedMenu ? "shared-code" : "logged-in"
  });
}

function finishQuizSession() {
  if (!state.quizSession || state.quizSession.completed) return;

  state.quizSession.completed = true;
  state.quizSession.finishedAt = new Date().toISOString();
  state.quizSession.saveMessage = "Quiz complete. Saving result...";
  const result = getCurrentQuizResult();
  renderQuiz();
  saveQuizResult(result);
}

function renderQuizResult() {
  if (!quizResultPanel || !state.quizSession?.completed) return;

  const result = getCurrentQuizResult();
  if (!result) return;

  quizResultTitle.textContent = `${result.takerName}: ${result.score} / ${result.total}`;
  quizResultSummary.replaceChildren(
    createDashboardMetric("Score", `${result.percent}%`, `${result.score} correct out of ${result.total}`),
    createDashboardMetric("Questions", String(result.total), `${result.menuName || "Menu quiz"}`),
    createDashboardMetric("Taken", formatQuizDate(result.takenAt), result.finishedAt ? `Finished ${formatQuizDate(result.finishedAt)}` : ""),
    createDashboardMetric("Saved", state.quizSession.saveMessage || "Result ready", "Visible in the admin dashboard")
  );
}

function addQuizResultToMenu(result) {
  if (!result || state.sharedMenu) return false;

  const menu = restaurantMenus.find((candidate) => candidate.id === result.menuId) || getActiveRestaurantMenu();
  if (!menu) return false;

  menu.quizResults = mergeQuizResults(menu.quizResults || [], [result]);
  saveRestaurantMenus();
  renderDashboard();
  return true;
}

async function saveQuizResult(result) {
  if (!result || !state.quizSession) return;

  try {
    const savedToMenu = addQuizResultToMenu(result);
    let savedToShare = false;
    if (result.shareCode) {
      savedToShare = await saveQuizResultToShare(result.shareCode, result);
      if (savedToShare) {
        clearPendingSharedQuizResults(result.shareCode, [result]);
        flushPendingSharedQuizResults(result.shareCode).catch(() => {});
      }
    }
    if (result.shareCode && state.sharedMenu && !savedToShare) {
      throw new Error("Shared quiz result did not sync.");
    }
    state.quizSession.saved = true;
    state.quizSession.saveMessage = savedToMenu || savedToShare
      ? "Quiz complete. Result saved."
      : "Quiz complete. Result saved on this device.";
  } catch {
    if (result.shareCode) {
      savePendingSharedQuizResult(result.shareCode, result);
      state.quizSession.saveMessage = "Quiz complete. Saved on this device; it will sync when Firebase is reachable.";
    } else {
      state.quizSession.saveMessage = "Quiz complete. Result could not sync yet.";
    }
  }

  renderQuiz();
}

async function saveQuizResultToShare(code, result) {
  return saveQuizResultsToShare(code, [result]);
}

async function saveQuizResultsToShare(code, results = []) {
  const normalizedCode = normalizeShareCode(code);
  const incomingResults = normalizeQuizResults(results);
  if (!normalizedCode || !incomingResults.length) return false;

  await ensureSharedFirebaseAccess();
  const doc = getShareDocument(code);
  if (!doc) throw new Error("Firebase share storage is not ready.");

  const db = getFirebaseDb();
  if (db?.runTransaction) {
    await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(doc);
      if (!snapshot.exists) throw new Error("Share code not found.");

      const data = snapshot.data() || {};
      const nextResults = mergeQuizResults(getShareQuizResults(data), incomingResults);
      transaction.set(doc, createShareQuizResultsPayload(data, nextResults), { merge: true });
    });
    return true;
  }

  const snapshot = await doc.get();
  if (!snapshot.exists) throw new Error("Share code not found.");

  const data = snapshot.data() || {};
  const nextResults = mergeQuizResults(getShareQuizResults(data), incomingResults);
  await doc.set(createShareQuizResultsPayload(data, nextResults), { merge: true });
  return true;
}

function formatQuizDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unknown";
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function renderAdminState() {
  const menuWasVisible = !menuPage.hidden && (state.screen === "menu" || state.screen === "shared");
  const activeUser = getActiveUser();
  const invitedUser = getInvitedUser();
  normalizeScreen(activeUser, invitedUser);
  renderCategoryTabs();
  const showingInviteSetup = Boolean(invitedUser) && !activeUser;

  const showingSharedMenu = state.screen === "shared" && Boolean(state.sharedMenu);
  const showingSharedTraining = Boolean(state.sharedMenu) && ["flashcards", "quiz"].includes(state.screen);
  authPage.hidden = Boolean(activeUser) || state.screen === "register" || showingSharedMenu || showingSharedTraining;
  registerPage.hidden = Boolean(activeUser) || showingInviteSetup || state.screen !== "register";
  menusPage.hidden = !activeUser || state.screen !== "menus";
  menuPage.hidden = !(activeUser && state.screen === "menu") && !showingSharedMenu;
  usersPage.hidden = !activeUser || state.screen !== "users";
  pdfPage.hidden = !activeUser || state.screen !== "pdf";
  flashcardPage.hidden = state.screen !== "flashcards" || (!activeUser && !state.sharedMenu);
  quizPage.hidden = state.screen !== "quiz" || (!activeUser && !state.sharedMenu);

  adminLoginForm.hidden = Boolean(activeUser) || showingInviteSetup;
  passwordSetupForm.hidden = !showingInviteSetup;
  demoMenuButton.hidden = showingInviteSetup;
  registerLinkButton.hidden = showingInviteSetup;
  showCodeLoginButton.hidden = showingInviteSetup;
  if (showingInviteSetup) codeLoginForm.hidden = true;
  adminControls.hidden = !activeUser;
  pdfBuilderButton.hidden = !activeUser;
  scanMenuButton.hidden = !canEditAnyCategory();
  importPdfButton.hidden = !canEditAnyCategory();
  categoryManagerButton.hidden = !canManageCategories();
  shareMenuButton.hidden = !canShareActiveMenu();
  manageUsersButton.hidden = !activeUser;
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
  menusUserStatus.hidden = !activeUser;
  menusUserStatus.textContent = activeUser
    ? `Logged in: ${activeUser.username}${isAdmin() ? " (admin)" : ""}`
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
  renderSavedShareCodes();
  renderAccountDashboard();
  renderDashboard();
  if (isAdmin()) {
    renderUserList();
    if (!createUserPanel.hidden) renderNewUserAccessControls();
  }
  renderMenu({ preserveScroll: menuWasVisible });
  renderFlashcard();
  renderQuiz();
  window.requestAnimationFrame(updateBackToTopButton);
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
    const credential = await withTimeout(
      auth.signInWithEmailAndPassword(email, password),
      15000,
      "Firebase login timed out."
    );
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

  const submitButton = adminLoginForm?.querySelector('button[type="submit"]');
  const identity = adminUsername.value.trim().toLowerCase();
  const password = adminPassword.value;
  setResendVerificationVisible(false);
  if (submitButton) submitButton.disabled = true;

  try {
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
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
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

function openRegisterFromDemo() {
  exitSharedMenu();
  openRegisterPage();
}

function toggleCodeLoginPanel() {
  codeLoginForm.hidden = !codeLoginForm.hidden;
  codeLoginMessage.textContent = "";
  renderSavedShareCodes();
  if (!codeLoginForm.hidden) {
    shareCodeInput.focus();
  }
}

async function handleCodeLogin(event) {
  event.preventDefault();
  await loadSharedMenuFromCode(shareCodeInput.value);
}

function openShareMenuDialog() {
  if (!canShareActiveMenu()) return;

  closeDrawer();
  const activeMenu = getActiveRestaurantMenu();
  const code = normalizeShareCode(activeMenu.shareCode) || generateShareCode();
  setShareCodeDisplay(code);
  customShareCodeInput.value = "";
  shareMenuMessage.textContent = activeMenu.shareCode
    ? "This menu already has a saved share code."
    : "Save this code before sharing it.";
  shareMenuDialog.showModal();
}

function closeShareMenuDialog() {
  shareMenuDialog.close();
}

function setShareCodeDisplay(code) {
  shareCodeValue.textContent = normalizeShareCode(code) || "No code yet";
}

function refreshShareCode() {
  customShareCodeInput.value = "";
  setShareCodeDisplay(generateShareCode());
  shareMenuMessage.textContent = "New code ready. Save it before sharing.";
}

function useCustomShareCode() {
  const code = normalizeShareCode(customShareCodeInput.value);
  const validationMessage = getShareCodeValidationMessage(code);
  if (validationMessage) {
    shareMenuMessage.textContent = validationMessage;
    return;
  }

  customShareCodeInput.value = code;
  setShareCodeDisplay(code);
  shareMenuMessage.textContent = "Custom code ready. Save it before sharing.";
}

async function saveShareCode() {
  const code = normalizeShareCode(shareCodeValue.textContent);
  const validationMessage = getShareCodeValidationMessage(code);
  if (validationMessage || !canShareActiveMenu()) {
    shareMenuMessage.textContent = validationMessage || "Open one of your menus before sharing.";
    return;
  }

  saveShareCodeButton.disabled = true;
  shareMenuMessage.textContent = "Saving share code...";
  try {
    await validateShareCodeAvailability(code);
    await publishMenuShare(code);
    shareMenuMessage.textContent = `Share code saved: ${code}`;
    renderActiveMenuHeader();
  } catch (error) {
    shareMenuMessage.textContent = error?.message || "Could not save the share code. Check Firebase connection.";
  } finally {
    saveShareCodeButton.disabled = false;
  }
}

async function copyShareCode() {
  const code = normalizeShareCode(shareCodeValue.textContent);
  if (!code) return;

  try {
    await navigator.clipboard.writeText(code);
    shareMenuMessage.textContent = "Code copied.";
  } catch {
    shareMenuMessage.textContent = `Code: ${code}`;
  }
}

function exitSharedMenu() {
  clearSharedMenuSubscription();
  state.sharedMenu = null;
  state.sharedCode = "";
  state.sharedMenuUpdatedAt = "";
  state.demoMode = false;
  state.screen = getActiveUser() ? "menus" : "login";
  state.category = "all";
  state.query = "";
  state.openItems.clear();
  state.allergies.clear();
  state.ingredients.clear();
  searchInput.value = "";
  restaurantMenus = loadRestaurantMenus(getActiveUser());
  state.activeRestaurantMenu = getVisibleRestaurantMenus()[0]?.id || "";
  syncActiveRestaurantMenuData();
  applyDesignSettings();
  renderAllergyChips();
  renderAdminState();
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
  state.ingredients.clear();
  searchInput.value = "";
  setActiveCategoryTab();
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
  clearSharedMenuSubscription();
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
    details.append(createEmailLabel(user), createPasswordLabel(user), createPermissionFieldset(user), createMenuAccessFieldset(user));

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
  const sections = (user.permissions || []).map(getCategoryLabel).join(", ") || "No edit access";
  return `${sections} - ${getMenuAccessLabel(user)}`;
}

function getCategoryLabel(category) {
  const knownLabel = {
    abalone: "Abalone",
    "baked-fried": "Baked & Fried",
    bbq: "BBQ",
    "birds-nest": "Bird's Nest",
    "clay-pot": "Clay Pot",
    desserts: "Desserts",
    drinks: "Drinks",
    entrees: "Entrees",
    "fresh-seafood": "Fresh Seafood",
    mains: "Mains",
    "market-seafood": "Market Seafood",
    meat: "Meat",
    "out-of-menu": "Out of Menu",
    "rice-noodles": "Rice & Noodles",
    "steamed-dim-sum": "Steamed Dim Sum",
    starters: "Starters",
    soups: "Soups",
    vegetables: "Vegetables",
    "dim-sum": "Dim Sum"
  }[category];
  if (knownLabel) return knownLabel;
  return String(category || "")
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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

function createAccessAccordion(title, detail, content, { open = false } = {}) {
  const details = document.createElement("details");
  details.className = "permission-accordion";
  details.open = open;

  const summary = document.createElement("summary");
  summary.className = "access-summary";

  const copy = document.createElement("span");
  const heading = document.createElement("strong");
  const meta = document.createElement("small");
  heading.textContent = title;
  meta.textContent = detail;
  copy.append(heading, meta);

  const chevron = document.createElement("span");
  chevron.className = "access-chevron";
  chevron.textContent = ">";

  summary.append(copy, chevron);
  details.append(summary, content);
  return details;
}

function createPermissionFieldset(user, options = {}) {
  const fieldset = document.createElement("fieldset");
  fieldset.className = "permission-group";

  const legend = document.createElement("legend");
  legend.textContent = "Categories";
  fieldset.append(legend);

  const fullCategoryAccess = user.role === "admin" || user.role === "owner";
  categories.forEach((category) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "permissions";
    input.value = category;
    input.checked = fullCategoryAccess || (user.permissions || []).includes(category);
    input.disabled = fullCategoryAccess;
    label.append(input, document.createTextNode(` ${getCategoryLabel(category)}`));
    fieldset.append(label);
  });

  const selectedCount = fullCategoryAccess ? categories.length : (user.permissions || []).filter((category) => categories.includes(category)).length;
  const detail = fullCategoryAccess
    ? "Full category access"
    : selectedCount
      ? `${selectedCount} categor${selectedCount === 1 ? "y" : "ies"} selected`
      : "No categories selected";
  return createAccessAccordion("Can modify", detail, fieldset, options);
}

function createMenuAccessFieldset(user, options = {}) {
  const fieldset = document.createElement("fieldset");
  fieldset.className = "permission-group";

  const legend = document.createElement("legend");
  legend.textContent = "Menus";
  fieldset.append(legend);

  if (user.role === "owner") {
    const note = document.createElement("p");
    note.className = "permission-note";
    note.textContent = "Owners manage the menus created inside their own workspace.";
    fieldset.append(note);
    return createAccessAccordion("Menu access", getMenuAccessLabel(user), fieldset, options);
  }

  if (!restaurantMenus.length) {
    const note = document.createElement("p");
    note.className = "permission-note";
    note.textContent = "No menus have been created yet.";
    fieldset.append(note);
    return createAccessAccordion("Menu access", "No menus available", fieldset, options);
  }

  const assignedMenuIds = getAssignedMenuIds(user);
  const hasFullMenuAccess = user.role === "admin" || assignedMenuIds === null;
  restaurantMenus.forEach((menu) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "menuAccess";
    input.value = menu.id;
    input.checked = hasFullMenuAccess || assignedMenuIds.includes(menu.id);
    input.disabled = user.role === "admin";
    label.append(input, document.createTextNode(` ${menu.name || "Untitled menu"}`));
    fieldset.append(label);
  });

  return createAccessAccordion("Menu access", getMenuAccessLabel(user), fieldset, options);
}

function getMenuAccessLabel(user) {
  if (user.role === "admin") return "All menus";
  if (user.role === "owner") return "Own menu workspace";

  const assignedMenuIds = getAssignedMenuIds(user);
  if (assignedMenuIds === null) return "All admin menus";
  if (!assignedMenuIds.length) return "No menus selected";

  const visibleCount = assignedMenuIds.filter((menuId) => restaurantMenus.some((menu) => menu.id === menuId)).length;
  const count = visibleCount || assignedMenuIds.length;
  return `${count} menu${count === 1 ? "" : "s"} selected`;
}

function getSelectedPermissions(container) {
  return [...container.querySelectorAll("input[name='permissions']:checked")].map((input) => input.value);
}

function getSelectedMenuIds(container) {
  return [...container.querySelectorAll("input[name='menuAccess']:checked")].map((input) => input.value);
}

function saveUser(event) {
  event.preventDefault();
  if (!isAdmin()) return;

  const username = newUsername.value.trim();
  const email = newEmail.value.trim();
  const isInvite = createMethod.value === "invite";
  const permissions = getSelectedPermissions(userForm);
  const menuIds = getSelectedMenuIds(userForm);

  if (!permissions.length) {
    userMessage.textContent = "Choose at least one section.";
    return;
  }

  if (restaurantMenus.length && !menuIds.length) {
    userMessage.textContent = "Choose at least one menu this user can access.";
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
    menuIds,
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
  renderNewUserAccessControls({ reset: true });
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
  const permissions = getSelectedPermissions(form);
  const menuIds = getSelectedMenuIds(form);

  if (!permissions.length) {
    userMessage.textContent = "Choose at least one section.";
    return;
  }

  if (users[userIndex].role === "editor" && restaurantMenus.length && !menuIds.length) {
    userMessage.textContent = "Choose at least one menu this user can access.";
    return;
  }

  const updatedUser = {
    ...users[userIndex],
    email: form.elements.email.value,
    password: form.elements.password.value,
    permissions,
    updatedAt: new Date().toISOString()
  };
  if (users[userIndex].role === "editor") updatedUser.menuIds = menuIds;
  if (users[userIndex].role === "owner") updatedUser.menuIds = null;
  users[userIndex] = updatedUser;

  saveUsers();
  userMessage.textContent = "User updated.";
  renderUserList();
}

function openCategoryDialog() {
  if (!canManageCategories()) return;

  closeDrawer();
  categoryMessage.textContent = "";
  newCategoryName.value = "";
  renderCategoryList();
  categoryDialog.showModal();
  newCategoryName.focus();
}

function closeCategoryDialog() {
  categoryDialog.close();
  categoryForm.reset();
}

function renderCategoryList() {
  categoryList.replaceChildren();

  categories.forEach((category) => {
    const activeMenuItemCount = menuItems.filter((item) => item.category === category).length;
    const totalItemCount = restaurantMenus.reduce(
      (total, menu) => total + (Array.isArray(menu.items) ? menu.items.filter((item) => item.category === category).length : 0),
      0
    );
    const row = document.createElement("div");
    row.className = "category-list-row";

    const fields = document.createElement("div");
    fields.className = "category-edit-fields";
    const input = document.createElement("input");
    input.className = "category-name-input";
    input.value = getCategoryLabel(category);
    input.setAttribute("aria-label", `Edit ${getCategoryLabel(category)} category name`);
    input.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      renameCategory(category, input.value);
    });

    const meta = document.createElement("span");
    meta.className = "category-row-meta";
    const detail = document.createElement("small");
    detail.textContent = `${activeMenuItemCount} items in this menu`;
    if (totalItemCount !== activeMenuItemCount) detail.textContent += ` - ${totalItemCount} total`;

    const badge = document.createElement("span");
    badge.className = "category-key";
    badge.textContent = category;

    meta.append(detail, badge);
    fields.append(input, meta);

    const actions = document.createElement("div");
    actions.className = "category-row-actions";

    const saveButton = document.createElement("button");
    saveButton.className = "small-success";
    saveButton.type = "button";
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", () => renameCategory(category, input.value));

    const deleteButton = document.createElement("button");
    deleteButton.className = "small-danger";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.title = totalItemCount ? "Move or rename items before deleting this category." : "Delete category";
    deleteButton.addEventListener("click", () => deleteCategory(category));

    actions.append(saveButton, deleteButton);
    row.append(fields, actions);
    categoryList.append(row);
  });
}

function refreshCategoryManagementUi(message) {
  const menuScrollSnapshot = captureMenuScrollSnapshot();
  saveCategories();
  saveRestaurantMenus();
  saveUsers();
  syncActiveRestaurantMenuData();
  renderCategoryTabs();
  renderCategoryList();
  renderAllergyChips();
  renderIngredientChips();
  renderMenu({ scrollSnapshot: menuScrollSnapshot });
  renderRestaurantList();
  renderUserList();
  renderActiveMenuHeader();
  if (!createUserPanel.hidden) renderNewUserAccessControls();
  if (message) categoryMessage.textContent = message;
}

function addCategory(event) {
  event.preventDefault();
  if (!canManageCategories()) return;

  const category = normalizeCategoryValue(newCategoryName.value);
  if (!category) {
    categoryMessage.textContent = "Enter a category name.";
    return;
  }

  if (categories.includes(category)) {
    categoryMessage.textContent = `${getCategoryLabel(category)} already exists.`;
    newCategoryName.select();
    return;
  }

  categories = getUniqueCategories([...categories, category]);
  restaurantMenus = restaurantMenus.map((menu) => ({
    ...menu,
    categories: getUniqueCategories([...(menu.categories || []), category])
  }));
  users = users.map((user) => {
    if (user.role !== "admin" && user.role !== "owner") return user;
    return {
      ...user,
      permissions: getUniqueCategories([...(user.permissions || []), category])
    };
  });

  saveCategories();
  saveRestaurantMenus();
  saveUsers();
  const menuScrollSnapshot = captureMenuScrollSnapshot();
  renderCategoryTabs();
  renderCategoryList();
  renderAllergyChips();
  renderMenu({ scrollSnapshot: menuScrollSnapshot });
  renderUserList();
  if (!createUserPanel.hidden) renderNewUserAccessControls();
  newCategoryName.value = "";
  categoryMessage.textContent = `${getCategoryLabel(category)} added.`;
}

function renameCategory(category, value) {
  if (!canManageCategories()) return;

  const nextCategory = normalizeCategoryValue(value);
  if (!nextCategory) {
    categoryMessage.textContent = "Enter a category name.";
    return;
  }

  if (nextCategory === category) {
    categoryMessage.textContent = `${getCategoryLabel(category)} is already up to date.`;
    return;
  }

  if (categories.includes(nextCategory)) {
    categoryMessage.textContent = `${getCategoryLabel(nextCategory)} already exists.`;
    return;
  }

  categories = getUniqueCategories(categories.map((savedCategory) => (savedCategory === category ? nextCategory : savedCategory)));
  restaurantMenus = restaurantMenus.map((menu) => {
    const items = Array.isArray(menu.items)
      ? menu.items.map((item) => (item.category === category ? { ...item, category: nextCategory } : item))
      : [];
    const menuCategories = getUniqueCategories(
      [...(menu.categories || categories).map((savedCategory) => (savedCategory === category ? nextCategory : savedCategory)), ...items.map((item) => item.category)]
    );
    return {
      ...menu,
      categories: menuCategories,
      items
    };
  });
  users = users.map((user) => ({
    ...user,
    permissions: Array.isArray(user.permissions)
      ? getUniqueCategories(user.permissions.map((permission) => (permission === category ? nextCategory : permission)))
      : user.permissions
  }));
  if (state.category === category) state.category = nextCategory;

  refreshCategoryManagementUi(`${getCategoryLabel(category)} renamed to ${getCategoryLabel(nextCategory)}.`);
}

function deleteCategory(category) {
  if (!canManageCategories()) return;

  const label = getCategoryLabel(category);
  const totalItemCount = restaurantMenus.reduce(
    (total, menu) => total + (Array.isArray(menu.items) ? menu.items.filter((item) => item.category === category).length : 0),
    0
  );

  if (totalItemCount) {
    categoryMessage.textContent = `${label} has ${totalItemCount} menu item${totalItemCount === 1 ? "" : "s"}. Rename it or move those items before deleting.`;
    return;
  }

  if (categories.length <= 1) {
    categoryMessage.textContent = "Keep at least one category.";
    return;
  }

  if (!window.confirm(`Delete ${label}? This removes it from category tabs and user permissions.`)) return;

  categories = categories.filter((savedCategory) => savedCategory !== category);
  restaurantMenus = restaurantMenus.map((menu) => ({
    ...menu,
    categories: getUniqueCategories((menu.categories || []).filter((savedCategory) => savedCategory !== category))
  }));
  users = users.map((user) => ({
    ...user,
    permissions: Array.isArray(user.permissions) ? user.permissions.filter((permission) => permission !== category) : user.permissions
  }));
  if (state.category === category) state.category = "all";

  refreshCategoryManagementUi(`${label} deleted.`);
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
  renderCategorySelect(scanCategory, { editableOnly: true });
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

function openPdfImportDialog() {
  if (!canEditAnyCategory()) return;

  closeDrawer();
  clearPdfImport();
  renderCategorySelect(pdfImportCategory, { includeAuto: true, editableOnly: true, selectedValue: "auto" });
  pdfImportMode.value = "add";
  pdfImportDialog.showModal();
}

function closePdfImportDialog() {
  pdfImportDialog.close();
}

function clearPdfImport() {
  pdfImportDraftItems = [];
  pdfImportFile.value = "";
  pdfImportText.value = "";
  pdfImportPreview.replaceChildren();
  pdfImportMessage.textContent = "";
}

async function extractPdfImportText() {
  const file = pdfImportFile.files?.[0];
  if (!file) {
    pdfImportMessage.textContent = "Choose a PDF file first.";
    return;
  }

  if (!window.pdfjsLib) {
    pdfImportMessage.textContent = "PDF reader did not load. Check internet connection and try again.";
    return;
  }

  extractPdfButton.disabled = true;
  importPdfItemsButton.disabled = true;
  pdfImportMessage.textContent = "Reading PDF...";

  try {
    const text = await readPdfText(file);
    pdfImportText.value = text;
    updatePdfImportPreview();
    pdfImportMessage.textContent = pdfImportDraftItems.length
      ? `Found ${pdfImportDraftItems.length} possible menu items. Review, then import.`
      : "No menu items found yet. Edit the text and try importing.";
  } catch {
    pdfImportMessage.textContent = "Could not read that PDF. Try another file or copy/paste the menu text.";
  } finally {
    extractPdfButton.disabled = false;
    importPdfItemsButton.disabled = false;
  }
}

async function readPdfText(file) {
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await window.pdfjsLib.getDocument({ data }).promise;
  const pageTexts = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    pdfImportMessage.textContent = `Reading PDF page ${pageNumber} of ${pdf.numPages}...`;
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pageTexts.push(getPdfPageText(content.items));
  }

  return pageTexts.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function getPdfPageText(items) {
  const rows = [];
  items
    .map((item) => ({
      text: String(item.str || "").trim(),
      x: item.transform?.[4] || 0,
      y: Math.round(item.transform?.[5] || 0)
    }))
    .filter((item) => item.text)
    .sort((a, b) => b.y - a.y || a.x - b.x)
    .forEach((item) => {
      const row = rows.find((candidate) => Math.abs(candidate.y - item.y) <= 4);
      if (row) {
        row.items.push(item);
      } else {
        rows.push({ y: item.y, items: [item] });
      }
    });

  return rows
    .map((row) =>
      row.items
        .sort((a, b) => a.x - b.x)
        .map((item) => item.text)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter(Boolean)
    .join("\n");
}

function updatePdfImportPreview() {
  pdfImportDraftItems = parseImportedMenuItems(pdfImportText.value);
  pdfImportPreview.replaceChildren();

  if (!pdfImportDraftItems.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state restaurant-empty";
    empty.textContent = "No preview items yet.";
    pdfImportPreview.append(empty);
    return;
  }

  pdfImportDraftItems.forEach((item) => {
    const row = document.createElement("div");
    row.className = "pdf-import-row";

    const copy = document.createElement("span");
    const title = document.createElement("strong");
    const detail = document.createElement("small");
    title.textContent = item.name;
    detail.textContent = `${getCategoryLabel(item.category)} - ${item.description}`;
    copy.append(title, detail);

    const badge = document.createElement("span");
    badge.className = "dashboard-badge";
    badge.textContent = item.price ? formatter.format(item.price) : "No price";

    row.append(copy, badge);
    pdfImportPreview.append(row);
  });
}

function parseImportedMenuItems(text) {
  const editableCategories = getEditableCategories();
  const selectedCategory = pdfImportCategory.value;
  const defaultCategory =
    selectedCategory && selectedCategory !== "auto" && editableCategories.includes(selectedCategory)
      ? selectedCategory
      : editableCategories[0];
  let currentCategory = defaultCategory;
  const lines = getImportLines(text);
  const items = [];
  let pendingLines = [];

  lines.forEach((line) => {
    const headingCategory = selectedCategory === "auto" ? getCategoryFromHeading(line) : "";
    if (headingCategory && editableCategories.includes(headingCategory)) {
      currentCategory = headingCategory;
      pendingLines = [];
      return;
    }

    if (isImportNoiseLine(line)) return;

    const price = getLinePrice(line);
    const lineWithoutPrice = cleanImportedLine(line.replace(/\$\s*\d+(?:\.\d{1,2})?/g, "").replace(/\b\d{1,3}(?:\.\d{2})\b\s*$/g, ""));

    if (price !== null) {
      const parts = [...pendingLines, lineWithoutPrice].filter(Boolean);
      const item = createImportedMenuItem(parts, currentCategory, price, items.length);
      if (item) items.push(item);
      pendingLines = [];
      return;
    }

    pendingLines.push(line);
    if (pendingLines.length > 3) {
      const item = createImportedMenuItem(pendingLines.splice(0, 2), currentCategory, 0, items.length);
      if (item) items.push(item);
    }
  });

  if (pendingLines.length) {
    const chunks = items.length ? [pendingLines] : chunkImportLines(pendingLines);
    chunks.forEach((chunk) => {
      const item = createImportedMenuItem(chunk, currentCategory, 0, items.length);
      if (item) items.push(item);
    });
  }

  return items.filter((item) => canEditCategory(item.category)).slice(0, 80);
}

function getImportLines(text) {
  return text
    .split(/\r?\n/)
    .map(cleanImportedLine)
    .filter((line) => line.length > 2)
    .filter((line) => /[A-Za-z]{2,}/.test(line));
}

function cleanImportedLine(line) {
  return String(line || "")
    .replace(/[•·]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isImportNoiseLine(line) {
  const normalized = line.toLowerCase();
  return /^(menu|price|description|item|items|page \d+|subtotal|total)$/.test(normalized);
}

function getLinePrice(line) {
  const match = line.match(/\$\s*(\d+(?:\.\d{1,2})?)/) || line.match(/\b(\d{1,3}(?:\.\d{2})?)\b\s*$/);
  if (!match) return null;
  const price = Number(match[1]);
  return Number.isFinite(price) && price < 10000 ? price : null;
}

function getCategoryFromHeading(line) {
  const normalized = normalizeCategoryValue(line.replace(/\b(menu|items|section)\b/gi, ""));
  if (!normalized) return "";
  return categories.find((category) => {
    const label = normalizeCategoryValue(getCategoryLabel(category));
    return normalized === category || normalized === label || normalized.includes(category) || normalized.includes(label);
  }) || "";
}

function chunkImportLines(lines) {
  const chunks = [];
  for (let index = 0; index < lines.length; index += 2) {
    chunks.push(lines.slice(index, index + 2));
  }
  return chunks;
}

function createImportedMenuItem(parts, fallbackCategory, price, index) {
  const cleanedParts = parts.map(cleanImportedLine).filter((part) => part && !isImportNoiseLine(part));
  if (!cleanedParts.length) return null;

  const fullText = cleanedParts.join(" ");
  const category = inferImportedCategory(fullText, fallbackCategory);
  const name = cleanImportedLine(cleanedParts[0]).slice(0, 90) || "Imported Menu Item";
  const description = cleanImportedLine(cleanedParts.slice(1).join(" ")) || "Imported from PDF. Review details before publishing.";
  const heat = /spicy|chili|chilli|szechuan|sichuan|hot/i.test(fullText) ? 2 : 0;

  return {
    id: `pdf-${Date.now()}-${index}-${normalizeCategoryValue(name).slice(0, 24)}`,
    name,
    description,
    category,
    diet: getImportedDiet(fullText),
    style: getStyleForItem(category, heat),
    heat,
    allergens: getImportedAllergens(fullText),
    ingredients: inferIngredientTermsFromText(fullText),
    details: description,
    image: "",
    images: [],
    price
  };
}

function inferImportedCategory(text, fallbackCategory) {
  if (pdfImportCategory.value !== "auto") return fallbackCategory;

  const normalized = text.toLowerCase();
  const guesses = [
    { category: "desserts", words: ["dessert", "cake", "ice cream", "sweet", "pudding", "tart"] },
    { category: "soups", words: ["soup", "broth", "consomme"] },
    { category: "dim-sum", words: ["dumpling", "bao", "bun", "siu mai", "har gow", "dim sum"] },
    { category: "drinks", words: ["cocktail", "wine", "beer", "tea", "coffee", "mocktail", "soda", "juice"] },
    { category: "entrees", words: ["chicken", "beef", "pork", "fish", "lobster", "duck", "rice", "noodle"] }
  ];
  const guess = guesses.find((entry) => categories.includes(entry.category) && entry.words.some((word) => normalized.includes(word)));
  return guess?.category && canEditCategory(guess.category) ? guess.category : fallbackCategory;
}

function getImportedDiet(text) {
  if (/vegan/i.test(text)) return "VG";
  if (/vegetarian/i.test(text)) return "V";
  if (/gluten.?free/i.test(text)) return "GF";
  return "NA";
}

function getImportedAllergens(text) {
  const allergenChecks = [
    ["Shellfish", /shrimp|prawn|lobster|crab|shellfish/i],
    ["Fish", /fish|cod|salmon|tuna|sea bass/i],
    ["Egg", /\begg\b/i],
    ["Dairy", /milk|cream|cheese|butter|dairy/i],
    ["Sesame", /sesame/i],
    ["Soy", /soy|tofu|miso/i],
    ["Wheat", /wheat|noodle|dumpling|bun|bao|flour/i]
  ];
  return allergenChecks.filter(([, pattern]) => pattern.test(text)).map(([allergen]) => allergen);
}

function importPdfItems() {
  if (!canEditAnyCategory()) return;

  updatePdfImportPreview();
  if (!pdfImportDraftItems.length) {
    pdfImportMessage.textContent = "No items ready to import.";
    return;
  }

  const menuScrollSnapshot = captureMenuScrollSnapshot();
  if (pdfImportMode.value === "replace") {
    menuItems = menuItems.filter((item) => !canEditCategory(item.category));
  }

  menuItems = [...menuItems, ...pdfImportDraftItems.map(normalizeMenuItem)];
  saveMenuItems();
  renderAllergyChips();
  renderMenu({ scrollSnapshot: menuScrollSnapshot });
  renderPdfItemList();
  pdfImportMessage.textContent = `${pdfImportDraftItems.length} items imported.`;
  closePdfImportDialog();
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
    ingredients: inferIngredientTermsFromText(fullText),
    details: description,
    image: "",
    images: [],
    price: Number.isFinite(price) ? price : 0
  };
}

function cleanScannedLine(line) {
  return line.replace(/\s+/g, " ").replace(/\$\s*\d+(?:\.\d{1,2})?/g, "").trim();
}

function openItemDialogWithDraft(currentItem) {
  const currentImages = getItemImages(currentItem);
  renderCategorySelect(itemCategory, { editableOnly: true, selectedValue: currentItem.category });
  dialogTitle.textContent = "Add item";
  itemId.value = currentItem.id;
  itemName.value = currentItem.name;
  itemDescription.value = currentItem.description;
  itemDetails.value = currentItem.details;
  setItemImageField(currentImages, currentImages.length ? "Current item photos. Add more URLs or upload more photos." : "No item photos selected yet.");
  itemImageFile.value = "";
  itemCategory.value = currentItem.category;
  itemDiet.value = currentItem.diet;
  itemHeat.value = currentItem.heat;
  itemPrice.value = currentItem.price;
  itemAllergens.value = currentItem.allergens.join(", ");
  itemIngredients.value = getItemIngredientTerms(currentItem).join(", ");
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

function getItemImageFieldValues() {
  return normalizeItemImageList(itemImage.value.split(/\r?\n/));
}

function setItemImageField(images, message = "") {
  const normalizedImages = normalizeItemImageList(images);
  itemImage.value = normalizedImages.join("\n");
  renderItemPhotoPreview(normalizedImages, message);
}

function renderItemPhotoPreview(images = getItemImageFieldValues(), message = "") {
  if (!itemUploadPreview || !itemPreviewList || !itemUploadProgress || !itemUploadStatus) return;

  itemPreviewList.replaceChildren();
  itemUploadPreview.hidden = images.length === 0;
  itemUploadProgress.value = images.length ? 100 : 0;
  itemUploadProgress.hidden = images.length === 0;
  itemUploadStatus.textContent =
    message || (images.length ? `${images.length} photo${images.length === 1 ? "" : "s"} ready.` : "No item photos selected yet.");

  images.forEach((imageUrl, index) => {
    const card = document.createElement("div");
    card.className = "photo-preview-card";

    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = `Item photo ${index + 1}`;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "x";
    removeButton.setAttribute("aria-label", `Remove photo ${index + 1}`);
    removeButton.addEventListener("click", () => {
      const nextImages = getItemImageFieldValues().filter((_, imageIndex) => imageIndex !== index);
      setItemImageField(nextImages);
      itemImageFile.value = "";
    });

    card.append(image, removeButton);
    itemPreviewList.append(card);
  });
}

async function updateItemImageFromFile(event) {
  const files = [...(event.target.files || [])];
  if (!files.length) return;
  const uploadedImages = [];
  const totalFiles = files.length;
  const itemDraftId = itemId.value || `item-${Date.now()}`;
  itemId.value = itemDraftId;
  const useCloudStorage = canUploadItemPhotosToCloud();
  let usedLocalFallback = !useCloudStorage;

  setUploadBusy(saveItemButton, true);
  try {
    for (const [index, file] of files.entries()) {
      const fileLabel = totalFiles > 1 ? ` ${index + 1} of ${totalFiles}` : "";
      const compressedImage = await prepareUploadedImage(file, {
        maxWidth: useCloudStorage ? 1400 : 640,
        quality: useCloudStorage ? 0.78 : 0.58,
        preview: itemUploadPreview,
        image: null,
        progress: itemUploadProgress,
        status: itemUploadStatus,
        button: null
      });

      if (useCloudStorage) {
        try {
          setUploadProgress({
            preview: itemUploadPreview,
            progress: itemUploadProgress,
            status: itemUploadStatus,
            percent: 62,
            message: `Uploading photo${fileLabel}...`
          });
          const cloudUrl = await withTimeout(
            uploadItemPhotoToCloud(compressedImage, {
              itemId: itemDraftId,
              file,
              index,
              total: totalFiles,
              onProgress: (percent) => {
                setUploadProgress({
                  preview: itemUploadPreview,
                  progress: itemUploadProgress,
                  status: itemUploadStatus,
                  percent: 62 + Math.round(percent * 0.36),
                  message: `Uploading photo${fileLabel}...`
                });
              }
            }),
            60000,
            "Photo upload took too long."
          );
          uploadedImages.push(cloudUrl);
        } catch (uploadError) {
          console.warn("Item photo cloud upload failed; using compact local copy.", uploadError);
          const fallbackImage = await compressImageDataUrl(compressedImage, { maxWidth: 640, quality: 0.58 });
          uploadedImages.push(fallbackImage);
          usedLocalFallback = true;
          setUploadProgress({
            preview: itemUploadPreview,
            progress: itemUploadProgress,
            status: itemUploadStatus,
            percent: 100,
            message: "Cloud upload is unavailable. Photo ready as a smaller copy."
          });
        }
      } else {
        uploadedImages.push(compressedImage);
      }
    }

    const nextImages = normalizeItemImageList([...getItemImageFieldValues(), ...uploadedImages]);
    const storageNote = usedLocalFallback
      ? "Firebase Storage was unavailable; this local copy may not sync to other devices."
      : "Uploaded to Firebase and ready to save.";
    setItemImageField(
      nextImages,
      `${storageNote} Added ${uploadedImages.length} photo${uploadedImages.length === 1 ? "" : "s"}. ${nextImages.length} total.`
    );
    itemImageFile.value = "";
  } catch (error) {
    renderItemPhotoPreview(getItemImageFieldValues(), error?.message || "Could not upload one of those images.");
  } finally {
    setUploadBusy(saveItemButton, false);
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

function inferFrontMediaTypeFromUrl(url) {
  if (/^data:image\//i.test(url)) return "image";
  if (/^data:video\//i.test(url)) return "video";
  if (/\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(url)) return "video";
  return /\.(png|jpe?g|webp|gif|avif|svg)(?:[?#].*)?$/i.test(url) ? "image" : "video";
}

function updateFrontMediaPhoneSizeLabel() {
  frontMediaPhoneSizeValue.textContent = `${frontMediaPhoneSize.value}%`;
  document.documentElement.style.setProperty("--front-media-phone-size", `${frontMediaPhoneSize.value}%`);
}

function updateFrontMediaWebSizeLabel() {
  frontMediaWebSizeValue.textContent = `${frontMediaWebSize.value}%`;
  document.documentElement.style.setProperty("--front-media-web-size", `${frontMediaWebSize.value}%`);
}

function updateItemPhotoSizeLabel() {
  itemPhotoSizeValue.textContent = `${itemPhotoSize.value}px`;
  document.documentElement.style.setProperty("--item-photo-size", `${itemPhotoSize.value}px`);
}

function syncDashboardAnimationControl() {
  if (!dashboardMenuAnimationIntensity || !dashboardMenuAnimationIntensityValue) return;
  dashboardMenuAnimationIntensity.value = String(designSettings.menuAnimationIntensity);
  dashboardMenuAnimationIntensityValue.textContent = formatMenuAnimationIntensity(designSettings.menuAnimationIntensity);
}

function updateMenuAnimationIntensityLabel(source = menuAnimationIntensity) {
  const intensity = getMenuAnimationIntensity(source?.value);
  if (menuAnimationIntensity && menuAnimationIntensity !== source) {
    menuAnimationIntensity.value = String(intensity);
  }
  if (dashboardMenuAnimationIntensity && dashboardMenuAnimationIntensity !== source) {
    dashboardMenuAnimationIntensity.value = String(intensity);
  }
  if (menuAnimationIntensityValue) {
    menuAnimationIntensityValue.textContent = formatMenuAnimationIntensity(intensity);
  }
  if (dashboardMenuAnimationIntensityValue) {
    dashboardMenuAnimationIntensityValue.textContent = formatMenuAnimationIntensity(intensity);
  }
  applyMenuAnimationIntensity(intensity);
  return intensity;
}

function saveDashboardMenuAnimationIntensity() {
  if (!isAdmin() || !dashboardMenuAnimationIntensity) return;
  const intensity = updateMenuAnimationIntensityLabel(dashboardMenuAnimationIntensity);
  designSettings = normalizeDesignSettings({
    ...designSettings,
    menuAnimationIntensity: intensity
  });
  saveDesignSettings();
  renderDashboardCustomizationSummary();
}

function updateFrontMediaBlurLabel() {
  const blur = Number(frontMediaBlur.value) || 0;
  frontMediaBlurValue.textContent = `${blur}px`;
  document.documentElement.style.setProperty("--front-media-blur", `${blur}px`);
}

function previewFrontMediaFromFields() {
  const mediaUrl = frontMediaUrl.value.trim();
  const mediaType = frontMediaType.value;
  renderFrontMediaPreview(
    mediaUrl,
    mediaType,
    mediaUrl ? "Ready to save front page media." : "No front page media selected yet."
  );
}

async function updateFrontMediaFromFile(event) {
  const file = event.target.files?.[0];
  if (!file || !isAdmin()) return;

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  if (!isImage && !isVideo) {
    renderFrontMediaPreview(frontMediaUrl.value.trim(), frontMediaType.value, "Choose an image or MP4/WebM video.");
    return;
  }

  if (isVideo && file.size > maxInlineVideoUploadSize) {
    frontMediaUploadProgress.hidden = false;
    frontMediaUploadProgress.value = 0;
    frontMediaPreview.hidden = false;
    frontMediaPreviewFrame.replaceChildren();
    frontMediaUploadStatus.textContent =
      "This video is too large to save directly. Host the MP4 and paste its URL so Firebase stays synced.";
    frontMediaFile.value = "";
    return;
  }

  try {
    if (isImage) {
      const imageUrl = await prepareUploadedImage(file, {
        maxWidth: 1400,
        quality: 0.84,
        preview: frontMediaPreview,
        image: null,
        progress: frontMediaUploadProgress,
        status: frontMediaUploadStatus,
        button: saveDesignButton
      });
      frontMediaType.value = "image";
      frontMediaUrl.value = imageUrl;
      renderFrontMediaPreview(imageUrl, "image", "Front image ready to save.");
      return;
    }

    setUploadBusy(saveDesignButton, true);
    setUploadProgress({
      preview: frontMediaPreview,
      progress: frontMediaUploadProgress,
      status: frontMediaUploadStatus,
      percent: 6,
      message: "Reading video..."
    });
    const videoUrl = await readImageFile(file, (percent) => {
      setUploadProgress({
        preview: frontMediaPreview,
        progress: frontMediaUploadProgress,
        status: frontMediaUploadStatus,
        percent,
        message: "Reading video..."
      });
    });
    frontMediaType.value = "video";
    frontMediaUrl.value = videoUrl;
    renderFrontMediaPreview(videoUrl, "video", "Front video ready to save.");
  } catch (error) {
    renderFrontMediaPreview(frontMediaUrl.value.trim(), frontMediaType.value, error?.message || "Could not read that media file.");
  } finally {
    setUploadBusy(saveDesignButton, false);
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
  const images = getItemImageFieldValues();
  const updatedAt = new Date().toISOString();
  const allergens = itemAllergens.value
    .split(",")
    .map((allergen) => allergen.trim())
    .filter(Boolean);
  const ingredients = normalizeIngredientList(itemIngredients.value);

  return {
    id: itemId.value,
    name: itemName.value.trim(),
    description: itemDescription.value.trim(),
    details: itemDetails.value.trim() || "Key ingredients, flavor notes, and service talking points can go here.",
    image: images[0] || "",
    images,
    updatedAt,
    category,
    diet: itemDiet.value,
    style: getStyleForItem(category, heat),
    heat,
    allergens,
    ingredients,
    price: Math.max(0, Number(itemPrice.value))
  };
}

function saveItem(event) {
  event.preventDefault();

  const item = getFormItem();
  const itemIndex = menuItems.findIndex((menuItem) => menuItem.id === item.id);
  const previousItem = menuItems[itemIndex];
  const menuScrollSnapshot = captureMenuScrollSnapshot(item.id);

  if (!canEditCategory(item.category) || (previousItem && !canEditCategory(previousItem.category))) {
    return;
  }

  if (itemIndex >= 0) {
    menuItems[itemIndex] = {
      ...item,
      createdAt: previousItem?.createdAt || item.updatedAt
    };
  } else {
    menuItems = [
      {
        ...item,
        createdAt: item.updatedAt
      },
      ...menuItems
    ];
  }

  markLocalItemEdit(item);
  saveMenuItems();
  closeItemDialog();
  renderAllergyChips();
  renderMenu({ scrollSnapshot: menuScrollSnapshot });
}

function getIngredientFilterOptions() {
  return uniqueValues(menuItems.flatMap((item) => getItemIngredientTerms(item))).sort((a, b) => a.localeCompare(b));
}

function renderIngredientChips() {
  if (!ingredientChips) return;

  ingredientChips.replaceChildren();
  const options = getIngredientFilterOptions();
  state.ingredients.forEach((ingredient) => {
    if (!options.includes(ingredient)) state.ingredients.delete(ingredient);
  });
  if (ingredientFilterCount) {
    ingredientFilterCount.textContent = state.ingredients.size ? `${state.ingredients.size} selected` : "0 selected";
  }
  if (!options.length) {
    const empty = document.createElement("span");
    empty.className = "empty-filter-note";
    empty.textContent = "No ingredients listed yet.";
    ingredientChips.append(empty);
    return;
  }

  options.forEach((ingredient) => {
    const chip = document.createElement("button");
    chip.className = "ingredient-chip";
    chip.type = "button";
    chip.textContent = ingredient;
    chip.classList.toggle("is-active", state.ingredients.has(ingredient));
    chip.setAttribute("aria-pressed", String(state.ingredients.has(ingredient)));
    chip.addEventListener("click", () => toggleIngredient(ingredient));
    ingredientChips.append(chip);
  });
}

function toggleIngredient(ingredient) {
  if (state.ingredients.has(ingredient)) {
    state.ingredients.delete(ingredient);
  } else {
    state.ingredients.add(ingredient);
  }

  renderIngredientChips();
  renderMenu({ preserveScroll: true });
}

function deleteMenuItemById(id) {
  const item = menuItems.find((menuItem) => menuItem.id === id);
  if (!item || !canEditCategory(item.category) || state.sharedMenu) return false;
  const menuScrollSnapshot = captureMenuScrollSnapshot(id);

  markLocalItemDelete(id);
  menuItems = menuItems.filter((item) => item.id !== id);
  saveMenuItems();
  state.openItems.delete(id);
  renderAllergyChips();
  renderMenu({ scrollSnapshot: menuScrollSnapshot });
  return true;
}

function requestDeleteMenuItem(id) {
  const item = menuItems.find((menuItem) => menuItem.id === id);
  if (!item || !canEditCategory(item.category) || state.sharedMenu) return;

  const confirmed = window.confirm(`Delete ${item.name}?`);
  if (!confirmed) return;

  deleteMenuItemById(id);
}

function deleteItem() {
  const deleted = deleteMenuItemById(itemId.value);
  if (deleted) closeItemDialog();
}

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderMenu({ preserveScroll: true });
});

editModeButton.addEventListener("click", () => {
  setEditMode(!state.editing);
});
quickEditModeButton.addEventListener("click", () => {
  setEditMode(!state.editing);
});
quickCustomizationButton.addEventListener("click", openDesignDialog);

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
importPdfButton.addEventListener("click", openPdfImportDialog);
quickImportPdfButton.addEventListener("click", openPdfImportDialog);
closePdfImportButton.addEventListener("click", closePdfImportDialog);
clearPdfImportButton.addEventListener("click", clearPdfImport);
extractPdfButton.addEventListener("click", extractPdfImportText);
pdfImportText.addEventListener("input", updatePdfImportPreview);
pdfImportCategory.addEventListener("change", updatePdfImportPreview);
importPdfItemsButton.addEventListener("click", importPdfItems);
categoryManagerButton.addEventListener("click", openCategoryDialog);
quickCategoryButton.addEventListener("click", openCategoryDialog);
closeCategoryButton.addEventListener("click", closeCategoryDialog);
categoryForm.addEventListener("submit", addCategory);
shareMenuButton.addEventListener("click", openShareMenuDialog);
quickShareMenuButton.addEventListener("click", openShareMenuDialog);
closeShareMenuButton.addEventListener("click", closeShareMenuDialog);
refreshShareCodeButton.addEventListener("click", refreshShareCode);
useCustomShareCodeButton.addEventListener("click", useCustomShareCode);
customShareCodeInput.addEventListener("input", () => {
  customShareCodeInput.value = normalizeShareCode(customShareCodeInput.value);
});
saveShareCodeButton.addEventListener("click", saveShareCode);
copyShareCodeButton.addEventListener("click", copyShareCode);
pdfBuilderButton.addEventListener("click", openPdfPage);
quickPdfBuilderButton.addEventListener("click", openPdfPage);
backFromPdfButton.addEventListener("click", closePdfPage);
selectAllPdfButton.addEventListener("click", () => setPdfSelection(true));
clearPdfButton.addEventListener("click", () => setPdfSelection(false));
generatePdfButton.addEventListener("click", generatePdf);
quickFlashcardButton.addEventListener("click", openFlashcardPage);
backFromFlashcardsButton.addEventListener("click", closeFlashcardPage);
flashcardShuffleButton.addEventListener("click", nextFlashcard);
flashcardModeButton.addEventListener("click", toggleFlashcardMode);
flashcardNextButton.addEventListener("click", nextFlashcard);
flashcardFlipButton.addEventListener("click", flipFlashcard);
quickQuizButton.addEventListener("click", openQuizPage);
backFromQuizButton.addEventListener("click", closeQuizPage);
quizSetupForm.addEventListener("submit", startQuizSession);
quizNewQuestionButton.addEventListener("click", nextQuizQuestion);
quizCheckButton.addEventListener("click", checkQuizAnswer);
quizResetButton.addEventListener("click", resetQuizScore);
quizStartOverButton.addEventListener("click", resetQuizScore);
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
menusHomeLink.addEventListener("click", goToFrontPage);
menuHomeLink.addEventListener("click", goToFrontPage);
backToMenusButton.addEventListener("click", () => {
  if (state.screen === "shared") {
    exitSharedMenu();
    return;
  }

  closeDrawer();
  setEditMode(false);
  showScreen("menus");
});
demoMenuButton.addEventListener("click", openDemoMenu);
demoCreateAccountButton.addEventListener("click", openRegisterFromDemo);
demoExitButton.addEventListener("click", exitSharedMenu);
registerLinkButton.addEventListener("click", openRegisterPage);
loginLinkButton.addEventListener("click", openLoginPage);
showCodeLoginButton.addEventListener("click", toggleCodeLoginPanel);
codeLoginForm.addEventListener("submit", handleCodeLogin);
selfRegisterForm.addEventListener("submit", registerAccount);
userForm.addEventListener("submit", saveUser);
itemImage.addEventListener("input", () => renderItemPhotoPreview(getItemImageFieldValues()));
itemImageFile.addEventListener("change", updateItemImageFromFile);
heroImageFile.addEventListener("change", updateHeroImageFromFile);
frontMediaType.addEventListener("change", previewFrontMediaFromFields);
frontMediaUrl.addEventListener("input", () => {
  if (frontMediaUrl.value.trim()) frontMediaType.value = inferFrontMediaTypeFromUrl(frontMediaUrl.value.trim());
  previewFrontMediaFromFields();
});
frontMediaFile.addEventListener("change", updateFrontMediaFromFile);
itemPhotoSize.addEventListener("input", updateItemPhotoSizeLabel);
menuAnimationIntensity.addEventListener("input", () => updateMenuAnimationIntensityLabel(menuAnimationIntensity));
frontMediaPhoneSize.addEventListener("input", updateFrontMediaPhoneSizeLabel);
frontMediaWebSize.addEventListener("input", updateFrontMediaWebSizeLabel);
frontMediaBlur.addEventListener("input", updateFrontMediaBlurLabel);
dashboardMenuAnimationIntensity.addEventListener("input", () => updateMenuAnimationIntensityLabel(dashboardMenuAnimationIntensity));
dashboardMenuAnimationIntensity.addEventListener("change", saveDashboardMenuAnimationIntensity);
authBackgroundVideo.addEventListener("timeupdate", handleFrontVideoTimeUpdate);
registerBackgroundVideo.addEventListener("timeupdate", handleFrontVideoTimeUpdate);
designForm.addEventListener("submit", saveDesign);
closeDesignButton.addEventListener("click", closeDesignDialog);
resetDesignButton.addEventListener("click", resetDesign);
closeDialogButton.addEventListener("click", closeItemDialog);
deleteItemButton.addEventListener("click", deleteItem);
itemForm.addEventListener("submit", saveItem);
closePhotoLightboxButton?.addEventListener("click", closePhotoLightbox);
photoLightboxPreviousButton?.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  movePhotoLightbox(-1);
});
photoLightboxNextButton?.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  movePhotoLightbox(1);
});
photoLightboxPreviousButton?.addEventListener("pointerdown", (event) => event.stopPropagation());
photoLightboxNextButton?.addEventListener("pointerdown", (event) => event.stopPropagation());
photoLightboxDialog?.addEventListener("click", (event) => {
  if (event.target === photoLightboxDialog) closePhotoLightbox();
});
photoLightboxDialog?.addEventListener("close", resetPhotoLightboxState);
window.addEventListener("keydown", handlePhotoLightboxKeydown);
backToTopButton.addEventListener("click", scrollToPageTop);
window.addEventListener("scroll", updateBackToTopButton, { passive: true });
window.addEventListener("resize", updateBackToTopButton);

renderCategoryTabs();

if (getActiveUser()) {
  activateWorkspaceForCurrentUser();
} else {
  applyDesignSettings();
  renderAdminState();
  renderAllergyChips();
  renderMenu();
}
initializeCloudSync();

const brandToggle = document.querySelector(".brand-toggle");
const siteNav = document.querySelector(".site-nav");
const siteHeader = document.querySelector(".site-header");
const mobileQuery = window.matchMedia("(max-width: 640px)");
const cartCountEls = document.querySelectorAll("[data-cart-count]");

const LANG_STORAGE_KEY = "expressionism_artery_lang";
const trackedTextNodes = new Set();
const originalTextByNode = new WeakMap();
const translatedTextCache = new Map();
const originalDocTitle = document.title;
const descMeta = document.querySelector('meta[name="description"]');
const originalMetaDescription = descMeta ? descMeta.getAttribute("content") || "" : "";

let currentLang = localStorage.getItem(LANG_STORAGE_KEY) === "ar" ? "ar" : "en";
let appliedLang = null;
let isApplyingLanguage = false;
let dynamicTextObserver = null;

const AR_TEXT_MAP = {
  "Home": "الرئيسية",
  "Shop": "المتجر",
  "Contact": "تواصل",
  "Cart": "السلة",
  "Visit Shop": "زيارة المتجر",
  "Blending Art and Accessories": "دمج الفن والإكسسوارات",
  "Wear a painting...": "ارتدِ لوحة فنية...",
  "Handmade Quality": "جودة يدوية",
  "Varied Aesthetics": "أنماط متنوعة",
  "Affordable Prices": "أسعار مناسبة",
  "Growing Collection": "مجموعة متجددة",
  "Find Cosmic Artery Online": "اعثر على Cosmic Artery عبر الإنترنت",
  "Message, follow, or subscribe using any platform below.": "راسلنا أو تابعنا أو اشترك عبر المنصات التالية.",
  "Shop Art by Type": "تسوق الفن حسب النوع",
  "Sort Accessories by Type": "فرز الإكسسوارات حسب النوع",
  "Sort Art Prints by Type": "فرز الطبعات الفنية حسب النوع",
  "Sort Commissions by Type": "فرز الطلبات حسب النوع",
  "All Art": "كل الأعمال الفنية",
  "All Accessories": "كل الإكسسوارات",
  "All Art Prints": "كل الطبعات الفنية",
  "All Commissions": "كل الطلبات",
  "Islamic": "إسلامي",
  "Anime": "أنمي",
  "Expressionism": "تعبيري",
  "Impressionism": "انطباعي",
  "Keychains": "سلاسل مفاتيح",
  "Bracelets": "أساور",
  "Earrings": "أقراط",
  "Portraits": "بورتريه",
  "Digital": "رقمي",
  "Custom": "مخصص",
  "Art": "فن",
  "Accessories": "إكسسوارات",
  "Art Prints": "طبعات فنية",
  "Custom Commissions": "طلبات مخصصة",
  "Browse Handmade Items": "تصفح المنتجات اليدوية",
  "Add to Cart": "أضف إلى السلة",
  "Click to Choose": "انقر للاختيار",
  "Added": "تمت الإضافة",
  "Hide Item": "\u0625\u062e\u0641\u0627\u0621 \u0627\u0644\u0639\u0646\u0635\u0631",
  "Unhide Item": "\u0625\u0638\u0647\u0627\u0631 \u0627\u0644\u0639\u0646\u0635\u0631",
  "Your Items": "منتجاتك",
  "Adjust quantities, remove items, or continue to checkout once ready.": "عدّل الكميات أو احذف العناصر أو تابع إتمام الطلب عند الجاهزية.",
  "Items:": "العناصر:",
  "Total:": "الإجمالي:",
  "Clear Cart": "إفراغ السلة",
  "Checkout via WhatsApp": "إتمام الطلب عبر واتساب",
  "Cart is Empty": "السلة فارغة",
  "Remove": "حذف",
  "Your cart is empty. Add products from the shop.": "سلتك فارغة. أضف منتجات من المتجر.",
  "Cart": "السلة",
  "Checkout (Soon)": "إتمام الطلب (قريبًا)",
  "Find Cosmic Artery Online": "اعثر على Cosmic Artery عبر الإنترنت",
  "WhatsApp": "واتساب",
  "Instagram": "إنستغرام",
  "Facebook": "فيسبوك",
  "TikTok": "تيك توك",
  "YouTube": "يوتيوب",
  "Open WhatsApp": "افتح واتساب",
  "Visit Instagram": "زيارة إنستغرام",
  "Visit Facebook": "زيارة فيسبوك",
  "Visit TikTok": "زيارة تيك توك",
  "Visit YouTube": "زيارة يوتيوب",
  "Cart - Mini Art Print": "السلة - طبعة فنية مصغرة"
};

const AR_TEXT_EXTRA_MAP = {
  "Cosmic Artery is a small, 1 person project dedicated to giving you handmade and human drawn pieces to either decorate your home with or yourself.":
    "Cosmic Artery مشروع صغير لشخص واحد مخصص لتقديم قطع يدوية ومرسومة يدويًا لتزيين منزلك أو إطلالتك.",
  "All pieces are 100% drawn by me, a human, with guaranteed zero AI involvement.":
    "جميع القطع مرسومة مني أنا شخصيًا بنسبة 100%، بدون أي تدخل للذكاء الاصطناعي.",
  "Every item is created and decorated with exuisite detail to give you the hughest quality.":
    "كل قطعة يتم صنعها وتزيينها بتفاصيل دقيقة لتقديم أعلى جودة ممكنة.",
  "Every item is created and decorated with exquisite detail to give you the highest quality.":
    "كل قطعة يتم صنعها وتزيينها بتفاصيل دقيقة لتقديم أعلى جودة ممكنة.",
  "From the religious to the anime, we offer a wide variety of aesthetics so you are guaranteed to find your match.":
    "من الطابع الديني إلى الأنمي، نوفر أنماطًا متعددة لتجدي ما يناسب ذوقك.",
  "Each item has been priced with care to insure everyone can afford it at least 1 piece because art shouldn't be a luxury.":
    "تم تسعير كل قطعة بعناية حتى يتمكن الجميع من اقتناء قطعة واحدة على الأقل لأن الفن لا يجب أن يكون رفاهية.",
  "Each item has been priced with care to ensure everyone can afford at least one piece, because art shouldn't be a luxury.":
    "تم تسعير كل قطعة بعناية حتى يتمكن الجميع من اقتناء قطعة واحدة على الأقل لأن الفن لا يجب أن يكون رفاهية.",
  "New art prints and accessories will be added as the shop expands.":
    "ستُضاف طبعات فنية وإكسسوارات جديدة مع توسع المتجر.",
  "Explore Art, Accessories, Art Prints, and Custom Commissions, each with dedicated type filters.":
    "استعرضي الفن والإكسسوارات والطبعات الفنية والطلبات المخصصة، مع فلاتر نوع خاصة لكل قسم.",
  "Direct chat for order questions and custom requests.": "دردشة مباشرة لأسئلة الطلبات والطلبات المخصصة.",
  "Behind the scenes, previews, and product drops.": "لقطات خلف الكواليس، معاينات، وإطلاقات المنتجات.",
  "Announcements, updates, and page messages.": "إعلانات وتحديثات ورسائل الصفحة.",
  "Short videos featuring process clips and finished pieces.": "فيديوهات قصيرة تعرض مراحل العمل والقطع النهائية.",
  "Long-form content, art sessions, and collection showcases.": "محتوى طويل، جلسات فنية، وعروض للمجموعات.",
  "Hand drawn acrylic art nouveau inspired painting with silver metalic accents.":
    "لوحة أكريليك مرسومة يدويًا مستوحاة من الآرت نوفو مع لمسات فضية معدنية.",
  "Hand drawn acrylic art nouveau inspired painting with gold metallic accents.":
    "لوحة أكريليك مرسومة يدويًا مستوحاة من الآرت نوفو مع لمسات ذهبية معدنية.",
  "Hand drawn mixed media painting with green glitter accents.":
    "لوحة وسائط متعددة مرسومة يدويًا مع لمسات جليتر خضراء.",
  "Hand drawn watercolor realism painting with gold accents, acrylic on canvas.":
    "لوحة واقعية بالألوان المائية مرسومة يدويًا مع لمسات ذهبية وأكريليك على قماش.",
  "Colorful acrylic Jinx blink art, acrylic on A4 paper.":
    "لوحة أكريليك ملوّنة بأسلوب Jinx blink على ورق A4.",
  "Colorful Jinx blink art, acrylic on A4 paper.":
    "لوحة Jinx blink ملوّنة بأكريليك على ورق A4.",
  "Colorful anime girl with metallic and glittery accents, watercolor on A4 paper.":
    "رسم أنمي ملوّن مع لمسات معدنية وجليتر بألوان مائية على ورق A4.",
  "Pair of acrylic paintings with gold accents.": "زوج من لوحات الأكريليك مع لمسات ذهبية.",
  "Negative space painting, watercolor on A4 paper.": "لوحة بأسلوب المساحة السلبية بالألوان المائية على ورق A4.",
  "Atmospheric warm painting, Acrylic on A4 paper.": "لوحة دافئة الأجواء بأكريليك على ورق A4.",
  "Atmospheric warm painting, acrylic on A4 paper.": "لوحة دافئة الأجواء بأكريليك على ورق A4.",
  "Bold bright painting, Acrylic on A4 paper.": "لوحة جريئة ومشرقة بأكريليك على ورق A4.",
  "Bold, bright painting, acrylic on A4 paper.": "لوحة جريئة ومشرقة بأكريليك على ورق A4.",
  "Soft stylized realism painting, Acrylic on A4 paper.": "لوحة واقعية مبسطة وناعمة بأكريليك على ورق A4.",
  "Soft, stylized realism painting, acrylic on A4 paper.": "لوحة واقعية مبسطة وناعمة بأكريليك على ورق A4.",
  "Starry night and Sunflowers painted on small wooden rectangular keychain.":
    "لوحة لليلة مرصعة بالنجوم وعباد الشمس على سلسلة مفاتيح خشبية مستطيلة صغيرة.",
  "Cute and soft bunny painted on small wooden rectangular keychain with a heart clasp.":
    "أرنب لطيف مرسوم على سلسلة مفاتيح خشبية مستطيلة صغيرة مع مشبك على شكل قلب.",
  "Lightweight acrylic accessory with celestial charm.":
    "إكسسوار أكريليك خفيف مع لمسة سماوية.",
  "Hand-strung stretchy bracelet with a heart shaped wooden heart pond painting.":
    "سوار مطاطي مشغول يدويًا مع قلب خشبي مرسوم عليه مشهد بركة.",
  "Hand-strung stretchy bracelet with a wooden heart galaxy painting.":
    "سوار مطاطي مشغول يدويًا مع قلب خشبي مرسوم عليه مجرة.",
  "Hand-strung bracelet with a cat eye heart and metallic golden accents painting on a wooden heart.":
    "سوار مشغول يدويًا مع قلب عين القطة ولوحة على قلب خشبي بلمسات ذهبية معدنية.",
  "Hand-strung bracelet with a cat eye heart and metallic silver accents painted on a wooden heart.":
    "سوار مشغول يدويًا مع قلب عين القطة ولوحة على قلب خشبي بلمسات فضية معدنية.",
  "Lightweight drop earrings with silver-tone moon charms.":
    "أقراط متدلية خفيفة مع تعليقات قمرية بلون فضي.",
  "All artwork pieces available as mini A5 prints.":
    "جميع الأعمال الفنية متوفرة كطبعات مصغرة بحجم A5.",
  "Detailed Graphite portrait of your reference.": "بورتريه جرافيت تفصيلي اعتمادًا على الصورة المرجعية الخاصة بك.",
  "Custom digital artwork for profiles, banners, or printable pieces.":
    "أعمال فنية رقمية مخصصة للصور الشخصية أو البنرات أو القطع القابلة للطباعة.",
  "Fully Customizable accessories based on your exact request.":
    "إكسسوارات قابلة للتخصيص بالكامل حسب طلبك بالتفصيل.",
  "Fully customizable accessories based on your exact request.":
    "إكسسوارات قابلة للتخصيص بالكامل حسب طلبك بالتفصيل.",
  "Order Notes (Optional)": "ملاحظات الطلب (اختياري)",
  "Add size details, personalization, or delivery notes...": "أضيفي تفاصيل المقاس أو التخصيص أو ملاحظات التسليم...",
  "Manage mode is on. Hidden items are visible only to you.": "\u0648\u0636\u0639 \u0627\u0644\u0625\u062f\u0627\u0631\u0629 \u0645\u0641\u0639\u0644. \u0627\u0644\u0639\u0646\u0627\u0635\u0631 \u0627\u0644\u0645\u062e\u0641\u064a\u0629 \u062a\u0638\u0647\u0631 \u0644\u0643 \u0641\u0642\u0637.",
  "No products are listed in this filter yet.": "لا توجد منتجات مدرجة في هذا الفلتر حتى الآن.",
  "Starter brand assets are live and can be replaced with your final logo files anytime.":
    "عناصر الهوية المبدئية مفعلة الآن ويمكن استبدالها بملفات شعارك النهائية في أي وقت.",
  "All Sections": "كل الأقسام",
  "Toggle navigation menu": "تبديل قائمة التنقل",
  "Shop controls": "عناصر تحكم المتجر",
  "Shop category tabs": "تبويبات فئات المتجر",
  "Art style filters": "فلاتر أنماط الفن",
  "Accessories type filters": "فلاتر أنواع الإكسسوارات",
  "Art print type filters": "فلاتر أنواع الطبعات الفنية",
  "Commission type filters": "فلاتر أنواع الطلبات",
  "Close image preview": "إغلاق معاينة الصورة",
  "Product image fullscreen preview": "معاينة صورة المنتج بملء الشاشة",
  "Previous image": "الصورة السابقة",
  "Next image": "الصورة التالية",
  "Product image preview": "معاينة صورة المنتج",
  "© 2026 Cosmic Artery. All rights reserved.": "© 2026 Cosmic Artery. جميع الحقوق محفوظة.",
  "Â© 2026 Cosmic Artery. All rights reserved.": "© 2026 Cosmic Artery. جميع الحقوق محفوظة."
};

const AR_TITLE_MAP = {
  "Cosmic Artery | Home": "Cosmic Artery | الرئيسية",
  "Cosmic Artery | Shop": "Cosmic Artery | المتجر",
  "Expressionism Artery | Shop": "Expressionism Artery | المتجر",
  "Cosmic Artery | Contact": "Cosmic Artery | تواصل",
  "Cosmic Artery | Cart": "Cosmic Artery | السلة",
  "Expressionism Artery | Cart": "Expressionism Artery | السلة"
};

const AR_META_MAP = {
  "Cosmic Artery creates handcrafted art and accessories inspired by the stars.": "Cosmic Artery تقدم أعمالًا فنية وإكسسوارات مصنوعة يدويًا بإلهام نجمي.",
  "Shop handcrafted Expressionism art and accessories from Expressionism Artery.": "تسوق الأعمال التعبيرية والإكسسوارات المصنوعة يدويًا من Expressionism Artery.",
  "Connect with Cosmic Artery on social platforms and messaging.": "تواصل مع Cosmic Artery عبر المنصات الاجتماعية والتراسل.",
  "Review items in your Expressionism Artery cart.": "راجع العناصر الموجودة في سلة Expressionism Artery."
};

const AR_DYNAMIC_RULES = [
  {
    test: /^(\$[0-9]+(?:\.[0-9]{2})?) each$/,
    translate: (match) => `${match[1]} لكل قطعة`
  },
  {
    test: /^From \$([0-9]+(?:\.[0-9]{2})?)$/,
    translate: (match) => `ابتداءً من $${match[1]}`
  },
  {
    test: /^Add (.+) Mini Print to Cart$/,
    translate: (match) => `أضف طبعة مصغرة لـ ${match[1]} إلى السلة`
  },
  {
    test: /^(.+) - Mini Art Print$/,
    translate: (match) => `${match[1]} - طبعة فنية مصغرة`
  },
  {
    test: /^(.+) - Commission Example$/,
    translate: (match) => `${match[1]} - مثال على طلب`
  },
  {
    test: /^View (.+) image fullscreen$/,
    translate: (match) => `عرض صورة ${match[1]} بملء الشاشة`
  },
  {
    test: /^(.+) image fullscreen$/,
    translate: (match) => `صورة ${match[1]} بملء الشاشة`
  },
  {
    test: /^(.+) preview image$/,
    translate: (match) => `معاينة ${match[1]}`
  },
  {
    test: /^(.+) mini art print preview$/i,
    translate: (match) => `معاينة طبعة فنية مصغرة لـ ${match[1]}`
  },
  {
    test: /^(.+) commission example$/i,
    translate: (match) => `${match[1]} مثال طلب`
  },
  {
    test: /^(.+) Commission Example ([0-9]+)$/,
    translate: (match) => `${match[1]} مثال طلب ${match[2]}`
  }
];

const ATTRIBUTE_NAMES = ["aria-label", "title", "placeholder", "alt"];
const ATTRIBUTE_SELECTOR = ATTRIBUTE_NAMES.map((attr) => `[${attr}]`).join(",");
const trackedAttributeElements = new Set();
const originalAttrsByElement = new WeakMap();

const updateCartCount = () => {
  if (!window.CartStore || cartCountEls.length === 0) {
    return;
  }

  const count = window.CartStore.getCartCount();
  cartCountEls.forEach((el) => {
    el.textContent = String(count);
    el.hidden = count <= 0;
  });
};

const normalizeTextKey = (value) => String(value || "").replace(/\s+/g, " ").trim();

const getStaticTranslation = (value) => {
  const normalized = normalizeTextKey(value);
  if (!normalized) {
    return null;
  }
  return AR_TEXT_MAP[normalized] || AR_TEXT_EXTRA_MAP[normalized] || null;
};

const translateNormalizedValue = (normalized) => {
  const staticTranslation = getStaticTranslation(normalized);
  if (staticTranslation) {
    return staticTranslation;
  }

  for (const rule of AR_DYNAMIC_RULES) {
    const match = normalized.match(rule.test);
    if (match) {
      return rule.translate(match);
    }
  }

  return null;
};

const translateTextContent = (value) => {
  const original = String(value || "");
  if (translatedTextCache.has(original)) {
    return translatedTextCache.get(original);
  }

  const leading = original.match(/^\s*/)?.[0] || "";
  const trailing = original.match(/\s*$/)?.[0] || "";
  const normalized = normalizeTextKey(original);
  if (!normalized) {
    translatedTextCache.set(original, original);
    return original;
  }

  const directTranslation = translateNormalizedValue(normalized);
  if (directTranslation) {
    const translated = `${leading}${directTranslation}${trailing}`;
    translatedTextCache.set(original, translated);
    return translated;
  }

  const segmented = normalized.split(/\s*[\u00B7\u2022]\s*/);
  if (segmented.length > 1) {
    let changed = false;
    const translatedSegments = segmented.map((segment) => {
      const translated = translateNormalizedValue(segment);
      if (translated) {
        changed = true;
        return translated;
      }
      return segment;
    });
    if (changed) {
      const translated = `${leading}${translatedSegments.join(" \u00B7 ")}${trailing}`;
      translatedTextCache.set(original, translated);
      return translated;
    }
  }

  translatedTextCache.set(original, original);
  return original;
};

const shouldTrackTextNode = (node) => {
  if (!node || !node.nodeValue || !node.nodeValue.trim()) {
    return false;
  }
  const parent = node.parentElement;
  if (!parent) {
    return false;
  }
  return !parent.closest("script, style, noscript");
};

const registerTextNode = (node) => {
  if (!shouldTrackTextNode(node)) {
    return;
  }
  if (!trackedTextNodes.has(node)) {
    trackedTextNodes.add(node);
    originalTextByNode.set(node, node.nodeValue);
  }
};

const collectInitialTextNodes = () => {
  if (!document.body) {
    return;
  }
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    registerTextNode(node);
    node = walker.nextNode();
  }
};

const registerAttributeElement = (element) => {
  if (!(element instanceof Element) || trackedAttributeElements.has(element)) {
    return;
  }

  const originalAttrs = {};
  let hasTrackedAttribute = false;
  ATTRIBUTE_NAMES.forEach((attr) => {
    if (element.hasAttribute(attr)) {
      originalAttrs[attr] = element.getAttribute(attr) || "";
      hasTrackedAttribute = true;
    }
  });

  if (!hasTrackedAttribute) {
    return;
  }
  trackedAttributeElements.add(element);
  originalAttrsByElement.set(element, originalAttrs);
};

const collectInitialAttributeElements = () => {
  if (!document.body) {
    return;
  }
  document.querySelectorAll(ATTRIBUTE_SELECTOR).forEach(registerAttributeElement);
};

const applyArabicToElementAttributes = (element) => {
  const originalAttrs = originalAttrsByElement.get(element);
  if (!originalAttrs) {
    return;
  }
  Object.entries(originalAttrs).forEach(([attr, value]) => {
    const translated = translateTextContent(value);
    if (element.getAttribute(attr) !== translated) {
      element.setAttribute(attr, translated);
    }
  });
};

const applyArabicToTrackedAttributes = () => {
  trackedAttributeElements.forEach((element) => {
    if (!element.isConnected) {
      return;
    }
    applyArabicToElementAttributes(element);
  });
};

const restoreTrackedAttributes = () => {
  trackedAttributeElements.forEach((element) => {
    if (!element.isConnected) {
      return;
    }
    const originalAttrs = originalAttrsByElement.get(element);
    if (!originalAttrs) {
      return;
    }
    Object.entries(originalAttrs).forEach(([attr, value]) => {
      if (element.getAttribute(attr) !== value) {
        element.setAttribute(attr, value);
      }
    });
  });
};

const trackAndTranslateAttributesInSubtree = (root) => {
  if (!(root instanceof Element)) {
    return;
  }
  if (root.matches(ATTRIBUTE_SELECTOR)) {
    registerAttributeElement(root);
    applyArabicToElementAttributes(root);
  }
  root.querySelectorAll(ATTRIBUTE_SELECTOR).forEach((element) => {
    registerAttributeElement(element);
    applyArabicToElementAttributes(element);
  });
};

const applyArabic = () => {
  isApplyingLanguage = true;
  collectInitialTextNodes();
  collectInitialAttributeElements();
  document.documentElement.lang = "ar";
  document.documentElement.dir = "rtl";
  document.body.classList.add("lang-ar");

  trackedTextNodes.forEach((node) => {
    if (!node.isConnected) {
      return;
    }
    const source = originalTextByNode.get(node);
    if (typeof source !== "string") {
      return;
    }
    const translated = translateTextContent(source);
    if (node.nodeValue !== translated) {
      node.nodeValue = translated;
    }
  });
  applyArabicToTrackedAttributes();

  document.title = AR_TITLE_MAP[originalDocTitle] || originalDocTitle;
  if (descMeta) {
    descMeta.setAttribute("content", AR_META_MAP[originalMetaDescription] || originalMetaDescription);
  }
  isApplyingLanguage = false;
};

const applyEnglish = () => {
  isApplyingLanguage = true;
  document.documentElement.lang = "en";
  document.documentElement.dir = "ltr";
  document.body.classList.remove("lang-ar");
  restoreTrackedAttributes();

  trackedTextNodes.forEach((node) => {
    if (!node.isConnected) {
      return;
    }
    const source = originalTextByNode.get(node);
    if (typeof source === "string") {
      if (node.nodeValue !== source) {
        node.nodeValue = source;
      }
    }
  });

  document.title = originalDocTitle;
  if (descMeta) {
    descMeta.setAttribute("content", originalMetaDescription);
  }
  isApplyingLanguage = false;
};

const applyLanguage = (lang) => {
  const nextLang = lang === "ar" ? "ar" : "en";
  currentLang = nextLang;
  if (appliedLang === nextLang) {
    return;
  }
  if (nextLang === "ar") {
    applyArabic();
    observeDynamicText();
  } else {
    stopDynamicTextObservation();
    applyEnglish();
  }
  appliedLang = nextLang;
};

const createLanguageToggle = () => {
  const existing = document.querySelector(".floating-lang");
  if (existing) {
    return existing;
  }
  const button = document.createElement("button");
  button.type = "button";
  button.className = "floating-lang";
  button.addEventListener("click", () => {
    const nextLang = currentLang === "ar" ? "en" : "ar";
    localStorage.setItem(LANG_STORAGE_KEY, nextLang);
    applyLanguage(nextLang);
    button.textContent = nextLang === "ar" ? "EN" : "\u0627\u0644\u0639\u0631\u0628\u064a\u0629";
  });
  document.body.appendChild(button);
  return button;
};

const observeDynamicText = () => {
  if (!document.body || dynamicTextObserver) {
    return;
  }

  dynamicTextObserver = new MutationObserver((mutations) => {
    if (currentLang !== "ar" || isApplyingLanguage) {
      return;
    }

    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((added) => {
        if (added.nodeType === Node.TEXT_NODE) {
          registerTextNode(added);
          const source = originalTextByNode.get(added);
          if (typeof source === "string") {
            const translated = translateTextContent(source);
            if (added.nodeValue !== translated) {
              added.nodeValue = translated;
            }
          }
          return;
        }

        if (added.nodeType === Node.ELEMENT_NODE) {
          trackAndTranslateAttributesInSubtree(added);
          const walker = document.createTreeWalker(added, NodeFilter.SHOW_TEXT);
          let node = walker.nextNode();
          while (node) {
            registerTextNode(node);
            const source = originalTextByNode.get(node);
            if (typeof source === "string") {
              const translated = translateTextContent(source);
              if (node.nodeValue !== translated) {
                node.nodeValue = translated;
              }
            }
            node = walker.nextNode();
          }
        }
      });
    });
  });

  dynamicTextObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
};

const stopDynamicTextObservation = () => {
  if (!dynamicTextObserver) {
    return;
  }
  dynamicTextObserver.disconnect();
  dynamicTextObserver = null;
};

const languageToggleBtn = createLanguageToggle();
applyLanguage(currentLang);
languageToggleBtn.textContent = currentLang === "ar" ? "EN" : "\u0627\u0644\u0639\u0631\u0628\u064a\u0629";

updateCartCount();
window.addEventListener("cart:updated", updateCartCount);

if (brandToggle && siteNav) {
  const setOpen = (open) => {
    brandToggle.setAttribute("aria-expanded", String(open));
    siteNav.classList.toggle("is-open", open);
  };

  const syncMode = () => {
    if (mobileQuery.matches) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  syncMode();

  if (typeof mobileQuery.addEventListener === "function") {
    mobileQuery.addEventListener("change", syncMode);
  } else {
    mobileQuery.addListener(syncMode);
  }

  brandToggle.addEventListener("click", () => {
    if (!mobileQuery.matches) {
      return;
    }
    const isOpen = brandToggle.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
  });

  document.addEventListener("click", (event) => {
    if (!mobileQuery.matches) {
      return;
    }
    if (siteHeader && !siteHeader.contains(event.target)) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!mobileQuery.matches) {
      return;
    }
    if (event.key === "Escape") {
      setOpen(false);
    }
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileQuery.matches) {
        setOpen(false);
      }
    });
  });
}



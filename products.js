const products = [
  {
    id: "home-chair",
    name: "Bouclé Lounge Chair",
    brand: "Atelier Nord",
    price: 890,
    rating: 4.9,
    reviewCount: 48,
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&h=600&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=150&h=150&q=80"
    ],
    description: "A sculptural lounge chair upholstered in a premium, textured bouclé fabric. Featuring pillow-soft contours, generous proportions, and low-slung seating designed for ultimate comfort and relaxation.",
    category: "Home",
    details: {
      "Material": "80% Wool, 20% Acrylic Bouclé, Solid Oak Frame",
      "Dimensions": "84cm W x 80cm D x 72cm H",
      "Origin": "Denmark"
    },
    isHero: true,
    isFeatured: true
  },
  {
    id: "beauty-mist",
    name: "Rose Botanica Facial Mist",
    brand: "Soma Hydration",
    price: 34,
    rating: 4.8,
    reviewCount: 112,
    image: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=600&h=600&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=150&h=150&q=80"
    ],
    description: "An ultra-fine revitalizing mist crafted from hand-harvested organic rose hydrosol. Refreshes skin, tightens pores, and provides an instant burst of clean, dewy moisture at home or on the go.",
    category: "Beauty",
    details: {
      "Volume": "100ml / 3.4 fl. oz",
      "Skin Type": "Suitable for all skin types, including sensitive skin",
      "Key Ingredient": "100% Organic Damask Rose Hydrosol"
    },
    isHero: true,
    isFeatured: true
  },
  {
    id: "women-bag",
    name: "Saddle Crossbody Bag",
    brand: "Loom & Hide",
    price: 240,
    rating: 4.7,
    reviewCount: 84,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&h=600&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1598532187886-f4a568b2d164?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=150&h=150&q=80"
    ],
    description: "A compact crossbody bag crafted from vegetable-tanned Italian leather. Its classic saddle silhouette features a hidden magnetic closure, internal slip pockets, and an adjustable shoulder strap.",
    category: "Women",
    details: {
      "Material": "100% Full-Grain Italian Leather, Solid Brass Hardware",
      "Dimensions": "20cm W x 18cm H x 6cm D",
      "Strap Drop": "50cm - 60cm (Adjustable)"
    },
    isHero: true,
    isFeatured: true
  },
  {
    id: "men-sweater",
    name: "Cashmere Crewneck Sweater",
    brand: "Outline Studio",
    price: 180,
    rating: 4.9,
    reviewCount: 62,
    image: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&w=600&h=600&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1610410091850-c8f93617be3a?auto=format&fit=crop&w=150&h=150&q=80"
    ],
    description: "An essential crewneck knit from exceptionally soft Grade-A cashmere. Features a refined, relaxed silhouette with ribbed neck, cuffs, and hem. Breathable, warm, and built to last.",
    category: "Men",
    details: {
      "Material": "100% Mongolian Cashmere (12 Gauge)",
      "Fit": "True to size, relaxed fit",
      "Care": "Hand wash cold, dry flat"
    },
    isHero: true,
    isFeatured: true
  },
  {
    id: "home-vase",
    name: "Bespoke Ceramic Vase",
    brand: "Forma",
    price: 65,
    rating: 4.6,
    reviewCount: 37,
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&h=600&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=150&h=150&q=80"
    ],
    description: "An elegant, wheel-thrown vase with a textured sand glaze. Beautiful with simple floral stems or as a standalone sculptural piece on a white marble mantelpiece.",
    category: "Home",
    details: {
      "Material": "Glazed Stoneware Clay",
      "Dimensions": "22cm H x 12cm Diameter",
      "Finish": "Matte Speckled Sand"
    }
  },
  {
    id: "home-table",
    name: "Monolithic Marble Coffee Table",
    brand: "Stoneworks",
    price: 1250,
    rating: 5.0,
    reviewCount: 15,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&h=600&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=150&h=150&q=80"
    ],
    description: "A premium block coffee table carved from solid white Carrara marble. Showcasing beautiful organic gray veining with a honed silk finish, it makes a commanding centerpiece.",
    category: "Home",
    details: {
      "Material": "100% Solid Carrara Marble",
      "Dimensions": "90cm W x 90cm D x 30cm H",
      "Weight": "72 kg"
    }
  },
  {
    id: "beauty-oil",
    name: "Nourishing Hair Elixir",
    brand: "Soma Hydration",
    price: 42,
    rating: 4.8,
    reviewCount: 96,
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=600&h=600&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=150&h=150&q=80"
    ],
    description: "A lightweight blend of cold-pressed argan, jojoba, and plum seed oils that deeply hydrates, tames frizz, and adds a brilliant, non-greasy luster to all hair textures.",
    category: "Beauty",
    details: {
      "Volume": "50ml / 1.7 fl. oz",
      "Ingredients": "Organic Argan Oil, Jojoba Oil, Plum Seed Oil, Vitamin E",
      "Usage": "Apply 2-3 drops to damp or dry hair from mid-lengths to ends"
    }
  },
  {
    id: "beauty-incense",
    name: "Sandalwood Incense Set",
    brand: "Quiet Hours",
    price: 28,
    rating: 4.5,
    reviewCount: 53,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&h=600&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=150&h=150&q=80"
    ],
    description: "Thirty sticks of pure, clean-burning Mysore sandalwood incense paired with a minimal hand-carved soapstone holder. Fills the room with a warm, grounding woody aroma.",
    category: "Beauty",
    details: {
      "Includes": "30 Incense Sticks, Soapstone Holder Plate",
      "Burn Time": "Approx. 25 minutes per stick",
      "Composition": "Natural sandalwood powder, tree resins"
    }
  },
  {
    id: "women-trench",
    name: "Organic Linen Trench Coat",
    brand: "Loom & Hide",
    price: 310,
    rating: 4.9,
    reviewCount: 29,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&h=600&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=150&h=150&q=80"
    ],
    description: "An unstructured, double-breasted trench coat tailored from mid-weight organic linen. Features deep welt pockets, a removable belt, and a relaxed, elegant drape.",
    category: "Women",
    details: {
      "Material": "100% Organic Linen",
      "Color": "Oatmeal",
      "Care": "Dry clean recommended"
    }
  },
  {
    id: "women-dress",
    name: "Silk Wrap Slip Dress",
    brand: "Maison Slip",
    price: 195,
    rating: 4.7,
    reviewCount: 42,
    image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=600&h=600&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=150&h=150&q=80"
    ],
    description: "A bias-cut wrap dress in luxurious sand-washed silk. Drapes gracefully along the body and features delicate adjustable spaghetti straps and a soft V-neckline.",
    category: "Women",
    details: {
      "Material": "100% Mulberry Silk (19mm)",
      "Fit": "True to size, bias-cut",
      "Length": "Midi"
    }
  },
  {
    id: "men-sneakers",
    name: "Minimalist Leather Sneakers",
    brand: "Outline Studio",
    price: 160,
    rating: 4.8,
    reviewCount: 77,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&h=600&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=150&h=150&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=150&h=150&q=80"
    ],
    description: "Pristine white leather sneakers featuring a clean low-profile design. Built with Italian calfskin leather and stitch-reinforced margom rubber soles for unmatched longevity.",
    category: "Men",
    details: {
      "Material": "100% Italian Calfskin Leather, Margom Rubber Sole",
      "Details": "Debossed serial number gold detailing",
      "Origin": "Made in Italy"
    }
  },
  {
    id: "men-trousers",
    name: "Tailored Wool Trousers",
    brand: "Forma Men",
    price: 145,
    rating: 4.6,
    reviewCount: 33,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&h=600&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=150&h=150&q=80"
    ],
    description: "Slim-fit trousers crafted from lightweight, temperature-regulating merino wool. Features a flat front, side slant pockets, and a button-through back pocket.",
    category: "Men",
    details: {
      "Material": "98% Merino Wool, 2% Elastane",
      "Color": "Taupe Grey",
      "Inseam": "32 inches"
    }
  },
  {
    id: "baby-romper",
    name: "Organic Cotton Knit Romper",
    brand: "Petit Ground",
    price: 38,
    rating: 4.9,
    reviewCount: 22,
    image: "https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=600&h=600&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=150&h=150&q=80"
    ],
    description: "A super-soft knit romper made of organic combed cotton. Features an easy button closure along the front and legs for quick changes, and a comfortable ribbed neck and leg holes.",
    category: "Baby & Toddler",
    details: {
      "Material": "100% GOTS Certified Organic Cotton",
      "Color": "Sage Green",
      "Care": "Machine wash cold, tumble dry low"
    }
  },
  {
    id: "baby-rings",
    name: "Wooden Stacking Rings",
    brand: "Petit Ground",
    price: 24,
    rating: 4.8,
    reviewCount: 45,
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&h=600&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=150&h=150&q=80"
    ],
    description: "A classic Montessori developmental toy crafted from solid maple and birch wood, stained with non-toxic, water-based food-grade oils. Perfect for motor skill coordination.",
    category: "Baby & Toddler",
    details: {
      "Material": "Solid Maple and Birch, Natural Oils",
      "Safety": "US and EU Toy Safety Certified (EN-71)",
      "Age": "Recommended for ages 12 months and up"
    }
  },
  {
    id: "baby-blanket",
    name: "Merino Wool Baby Blanket",
    brand: "Loom & Hide",
    price: 78,
    rating: 5.0,
    reviewCount: 19,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&h=600&q=80",
    thumbnails: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=150&h=150&q=80"
    ],
    description: "An heirloom-quality knit blanket woven from the finest extra-fine Australian merino wool. Extremely soft, breathable, and naturally temperature-regulating for baby's sound sleep.",
    category: "Baby & Toddler",
    details: {
      "Material": "100% Extra-Fine Merino Wool",
      "Dimensions": "80cm x 100cm",
      "Origin": "Woven in Australia"
    }
  }
];

// Export if in node environment, else declare globally for browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { products };
} else {
  window.products = products;
}

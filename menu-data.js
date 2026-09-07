/**
 * The Velvet Hour Café - Official Menu & Cafe Configuration
 * Location: Badowala Dunga Road, Bhauwala, Dehradun
 * Contact / WhatsApp: +91 7017690400
 */

const MENU_DATA = {
  cafeInfo: {
    name: 'The Velvet Hour Café',
    tagline: 'Delight in Every Bite • Badowala Dunga Road, Dehradun',
    whatsappNumber: '7017690400',
    internationalNumber: '917017690400',
    address: 'Badowala Dunga Road, Bhauwala, Dehradun, Uttarakhand',
    landmark: 'Near Bhauwala Main Road',
    deliveryPerk: 'Free Delivery within a 1 km area',
    freeDeliveryRadiusKm: 1,
    deliveryFeeBeyond: 30,
    hours: 'Monday – Sunday: 10:00 AM – 10:30 PM',
    rating: 5.0,
    ratingStars: '⭐⭐⭐⭐⭐',
    googleKgmid: '/g/11ylmb12cr',
    googleSearchUrl: 'https://www.google.com/search?kgmid=%2Fg%2F11ylmb12cr&q=The+Velvet+Hour+Cafe',
    googleMapsDirectionsUrl: 'https://www.google.com/maps/search/?api=1&query=The+Velvet+Hour+Cafe+Badowala+Dunga+Road+Bhauwala+Dehradun'
  },
  
  reviews: [
    {
      author: 'Rohit Sharma',
      rating: 5,
      date: 'Recent Visit',
      badge: 'Verified Customer',
      comment: 'Best momos and chowmein in Bhauwala! The spicy red chutney with steamed paneer momos is unmatched. Super fast delivery.'
    },
    {
      author: 'Priya Negi',
      rating: 5,
      date: 'Dine-in Guest',
      badge: 'Local Guide',
      comment: 'Cozy vibes on Badowala Dunga Road. Kadak adrak chai and crispy fried momos are a must try during evenings!'
    },
    {
      author: 'Aman Verma',
      rating: 5,
      date: 'Bulk Order Customer',
      badge: 'Party Order',
      comment: 'Ordered chicken and mutton bulk kg dishes for our gathering. Incredible taste, fresh spices, and delivered right on time.'
    }
  ],

  categories: [
    { id: 'all', name: 'Full Menu', icon: '✨' },
    { id: 'momos', name: 'Momos Specials', icon: '🥟' },
    { id: 'chowmein-rice', name: 'Noodles & Rice', icon: '🍜' },
    { id: 'snacks-chaat', name: 'Starters & Chaat', icon: '🌶️' },
    { id: 'maggie-soup', name: 'Maggie & Soups', icon: '🍲' },
    { id: 'beverages', name: 'Chai & Coffee', icon: '☕' },
    { id: 'bulk-orders', name: 'Special Bulk (Per Kg)', icon: '🍗' }
  ],

  items: [
    // --- 1 & 2: CHOWMEIN ---
    {
      sNo: 1,
      id: 'veg-chowmein',
      name: 'Veg Chowmein',
      category: 'chowmein-rice',
      type: 'portioned',
      halfPrice: 30,
      fullPrice: 50,
      notes: 'Street-style wok-tossed noodles',
      description: 'Wok-tossed noodles cooked with shredded cabbage, crunchy carrots, capsicum, onions, soy sauce, and aromatic desi spices.',
      image: 'images/veg_chowmein.jpg',
      isVeg: true,
      badge: 'Bestseller'
    },
    {
      sNo: 2,
      id: 'egg-chowmein',
      name: 'Egg Chowmein',
      category: 'chowmein-rice',
      type: 'portioned',
      halfPrice: 50,
      fullPrice: 70,
      notes: 'Wok-tossed with scrambled egg bhurji',
      description: 'Spicy Hakka-style noodles tossed on high heat with fluffy scrambled farm eggs, fresh vegetables, and savory Indo-Chinese sauces.',
      image: 'images/egg_chowmein.jpg',
      isVeg: false,
      badge: 'Popular'
    },

    // --- 3, 4, 5, 6, 7: MOMOS ---
    {
      sNo: 3,
      id: 'veg-momo',
      name: 'Veg Momo',
      category: 'momos',
      type: 'portioned',
      halfPrice: 30,
      fullPrice: 50,
      notes: 'Steamed with spicy red garlic dip & mayo',
      description: 'Hand-folded soft dumplings packed with finely minced fresh garden vegetables and mild herbs. Freshly steamed to order.',
      image: 'images/veg_momo.jpg',
      isVeg: true,
      badge: 'Classic'
    },
    {
      sNo: 4,
      id: 'paneer-momo',
      name: 'Paneer Momo',
      category: 'momos',
      type: 'portioned',
      halfPrice: 50,
      fullPrice: 80,
      notes: 'Steamed with rich paneer filling',
      description: 'Delicate steamed dumplings generously stuffed with spiced fresh cottage cheese (malai paneer), coriander, and mild seasonings.',
      image: 'images/paneer_momo.jpg',
      isVeg: true,
      badge: "Chef's Pick"
    },
    {
      sNo: 5,
      id: 'fried-veg-momo',
      name: 'Fried Veg Momo',
      category: 'momos',
      type: 'portioned',
      halfPrice: 40,
      fullPrice: 60,
      notes: 'Crispy deep-fried golden crust',
      description: 'Crispy golden fried vegetable dumplings with an irresistible crunch on the outside and juicy, savory vegetable filling inside.',
      image: 'images/fried_momo.jpg',
      isVeg: true,
      badge: 'Crispy Hit'
    },
    {
      sNo: 6,
      id: 'fried-paneer-momo',
      name: 'Fried Paneer Momo',
      category: 'momos',
      type: 'portioned',
      halfPrice: 60,
      fullPrice: 90,
      notes: 'Golden fried with malai paneer stuffing',
      description: 'Deep-fried to golden perfection, loaded with rich spiced paneer filling. Served hot with signature spicy momo chutney.',
      image: 'images/fried_paneer_momo.jpg',
      isVeg: true,
      badge: 'Popular'
    },
    {
      sNo: 7,
      id: 'chicken-momo',
      name: 'Chicken Momo',
      category: 'momos',
      type: 'portioned',
      halfPrice: 60,
      fullPrice: 120,
      notes: 'Steamed juicy minced chicken',
      description: 'Classic Himalayan-style dumplings packed with succulent minced chicken, onions, ginger, and aromatic ground spices.',
      image: 'images/chicken_momo.jpg',
      isVeg: false,
      badge: 'Must Try'
    },

    // --- 8 & 9: MAGGIE ---
    {
      sNo: 8,
      id: 'maggie',
      name: 'Maggie',
      category: 'maggie-soup',
      type: 'fixed',
      price: 40,
      notes: 'Standard single portion classic masala',
      description: 'Classic 2-minute masala Maggi cooked just right with butter, fresh chopped onions, green chillies, and aromatic Maggi tastemaker.',
      image: 'images/maggie.jpg',
      isVeg: true,
      badge: 'All-Time Favorite'
    },
    {
      sNo: 9,
      id: 'egg-maggie',
      name: 'Egg Maggie',
      category: 'maggie-soup',
      type: 'fixed',
      price: 70,
      notes: 'Masala Maggi enriched with scrambled egg',
      description: 'Rich masala Maggi cooked with extra seasonings and a fluffy scrambled egg mixed in for an indulgent, hearty bowl.',
      image: 'images/egg_maggie.jpg',
      isVeg: false,
      badge: 'Must Try'
    },

    // --- 10: VEG SOUP ---
    {
      sNo: 10,
      id: 'veg-soup',
      name: 'Veg Soup',
      category: 'maggie-soup',
      type: 'fixed',
      price: 30,
      notes: 'Per bowl hot & nourishing',
      description: 'Steaming hot, comforting vegetable soup simmered with shredded cabbage, carrots, sweet corn, garlic, and cracked black pepper.',
      image: 'images/veg_soup.jpg',
      isVeg: true,
      badge: 'Warm & Healthy'
    },

    // --- 11 & 12: BEVERAGES ---
    {
      sNo: 11,
      id: 'chai',
      name: 'Chai',
      category: 'beverages',
      type: 'fixed',
      price: 20,
      notes: 'Kadak ginger & cardamom tea',
      description: 'Freshly brewed strong Indian milk tea infused with crushed fresh ginger (adrak) and fragrant green cardamom (elaichi).',
      image: 'images/kadak_chai.jpg',
      isVeg: true,
      badge: 'Desi Kadak'
    },
    {
      sNo: 12,
      id: 'coffee',
      name: 'Coffee',
      category: 'beverages',
      type: 'fixed',
      price: 30,
      notes: 'Frothy hot brewed cafe coffee',
      description: 'Rich, smooth, frothy beaten coffee made with rich roast beans and creamy hot milk, finished with cocoa dusting.',
      image: 'images/coffee.jpg',
      isVeg: true,
      badge: 'Aromatic'
    },

    // --- 13 & 14: CHAATS ---
    {
      sNo: 13,
      id: 'peanut-chaat',
      name: 'Peanut Chaat',
      category: 'snacks-chaat',
      type: 'fixed',
      price: 50,
      notes: 'Tangy, spicy roasted peanut snack',
      description: 'Crunchy roasted peanuts tossed with finely diced red onions, juicy tomatoes, fresh green chillies, chaat masala, and fresh lemon juice.',
      image: 'images/peanut_chaat.jpg',
      isVeg: true,
      badge: 'Tangy Snack'
    },
    {
      sNo: 14,
      id: 'chana-chaat',
      name: 'Chana Chaat',
      category: 'snacks-chaat',
      type: 'fixed',
      price: 50,
      notes: 'Wholesome spiced black chana mix',
      description: 'Protein-packed tender boiled black chickpeas tossed with chopped onions, tomatoes, fresh cilantro, roasted cumin, and zesty lemon.',
      image: 'images/chana_chaat.jpg',
      isVeg: true,
      badge: 'Healthy & Tasty'
    },

    // --- 15 & 16: SPRING ROLL & VEG KABAB ---
    {
      sNo: 15,
      id: 'spring-roll',
      name: 'Spring Roll',
      category: 'chowmein-rice',
      type: 'portioned',
      halfPrice: 30,
      fullPrice: 60,
      notes: 'Crispy rolled wrappers with noodle & veg filling',
      description: 'Thin crispy golden fried rolls stuffed with seasoned spiced noodles and crunchy julienned vegetables. Served with sweet chilli dip.',
      image: 'images/spring_roll.jpg',
      isVeg: true,
      badge: 'Crispy Favorite'
    },
    {
      sNo: 16,
      id: 'veg-kabab',
      name: 'Veg Kabab',
      category: 'snacks-chaat',
      type: 'portioned',
      halfPrice: 30,
      fullPrice: 50,
      notes: 'Spiced vegetable patties grilled crisp',
      description: 'Savory and aromatic pan-crisped vegetarian patties prepared with mashed potatoes, greens, crushed peanuts, and secret herbs.',
      image: 'images/veg_kabab.jpg',
      isVeg: true,
      badge: 'Snack Hit'
    },

    // --- 17 & 18: CHILLI MOMO & CHILLI PANEER ---
    {
      sNo: 17,
      id: 'chilli-momo',
      name: 'Chilli Momo',
      category: 'momos',
      type: 'fixed',
      price: 120,
      notes: 'Wok-tossed in spicy schezwan & chilli gravy',
      description: 'Crispy fried dumplings tossed in a sizzling fiery Indo-Chinese sauce with crunchy bell peppers, sliced onions, and green chillies.',
      image: 'images/chilli_momo.jpg',
      isVeg: true,
      badge: 'Spicy Delight'
    },
    {
      sNo: 18,
      id: 'chilli-paneer',
      name: 'Chilli Paneer',
      category: 'snacks-chaat',
      type: 'fixed',
      price: 150,
      notes: 'Diced paneer in spicy chilli garlic gravy',
      description: 'Succulent cubes of malai paneer lightly fried and simmered in a dark, glossy soy-chilli gravy with capsicum and diced onions.',
      image: 'images/chilli_paneer.jpg',
      isVeg: true,
      badge: 'Special'
    },

    // --- 19: FRIED RICE ---
    {
      sNo: 19,
      id: 'fried-rice',
      name: 'Fried Rice',
      category: 'chowmein-rice',
      type: 'portioned',
      halfPrice: 60,
      fullPrice: 100,
      notes: 'Aromatic basmati rice tossed with veggies',
      description: 'Steamed long-grain rice wok-tossed with finely chopped vegetables, spring onions, cracked black pepper, and light soy seasoning.',
      image: 'images/fried_rice.jpg',
      isVeg: true,
      badge: 'Comfort Food'
    },

    // --- 20 & 21: BULK PER KG ---
    {
      sNo: 20,
      id: 'chicken-bulk',
      name: 'Chicken',
      category: 'bulk-orders',
      type: 'bulk_kg',
      pricePerKg: 250,
      minKg: 1,
      stepKg: 0.5,
      notes: 'Per kg (Order Only)',
      description: 'Fresh, succulent chicken dish prepared special on-order per kilogram. Ideal for gatherings, parties, and family feasts.',
      image: 'images/chicken_dish.jpg',
      isVeg: false,
      badge: 'Bulk Order Only'
    },
    {
      sNo: 21,
      id: 'mutton-bulk',
      name: 'Mutton',
      category: 'bulk-orders',
      type: 'bulk_kg',
      pricePerKg: 350,
      minKg: 1,
      stepKg: 0.5,
      notes: 'Per kg (Order Only)',
      description: 'Tender, premium quality slow-cooked mutton prepared on advance order. Rich, flavorful, and cooked with authentic Dehradun spices.',
      image: 'images/mutton_dish.jpg',
      isVeg: false,
      badge: 'Bulk Order Only'
    }
  ]
};

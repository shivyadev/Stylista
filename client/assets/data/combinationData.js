// First, let's create a sample JSON file structure for dynamic combinations
// combinationsData.js
export const clothingItems = {
  // Items organized by type
  tops: [
    {
      id: "top-1",
      type: "Blazer",
      image: {
        uri: "http://assets.myntassets.com/v1/images/style/properties/ce35dbfe74af74ea9c9a25b0c3d5995b_images.jpg",
      },
      color: "Navy Blue",
      material: "Wool Blend",
      brand: "Arrow",
      style: ["Formal", "Semi-formal"],
    },
    {
      id: "top-2",
      type: "Blazer",
      image: {
        uri: "http://assets.myntassets.com/v1/images/style/properties/b9f4bd6c8d2130f2dff55251b41d1d62_images.jpg",
      },
      color: "Light Grey",
      material: "Linen Blend",
      brand: "Van Heusen",
      style: ["Semi-formal", "Casual"],
    },
    {
      id: "top-3",
      type: "Blazer",
      image: {
        uri: "http://assets.myntassets.com/v1/images/style/properties/ce35dbfe74af74ea9c9a25b0c3d5995b_images.jpg",
      },
      color: "Charcoal",
      material: "Premium Wool",
      brand: "Blackberrys",
      style: ["Formal", "Premium"],
    },
  ],
  bottoms: [
    {
      id: "bottom-1",
      type: "Pants",
      image: {
        uri: "http://assets.myntassets.com/v1/images/style/properties/9eb119d3dd0976d16ecc5f15f81d9cd7_images.jpg",
      },
      color: "Dark Grey",
      material: "Cotton",
      brand: "Louis Philippe",
      style: ["Formal", "Semi-formal"],
    },
    {
      id: "bottom-2",
      type: "Pant",
      image: {
        uri: "http://assets.myntassets.com/v1/images/style/properties/c0e5f6af4050842c42ea60d73e4e6f2b_images.jpg",
      },
      color: "Beige",
      material: "Cotton Blend",
      brand: "Allen Solly",
      style: ["Semi-formal", "Casual"],
    },
    {
      id: "bottom-3",
      type: "Pant",
      image: {
        uri: "http://assets.myntassets.com/v1/images/style/properties/9eb119d3dd0976d16ecc5f15f81d9cd7_images.jpg",
      },
      color: "Black",
      material: "Wool Blend",
      brand: "Park Avenue",
      style: ["Formal", "Premium"],
    },
  ],
  footwear: [
    {
      id: "shoe-1",
      type: "Shoes",
      image: {
        uri: "http://assets.myntassets.com/v1/images/style/properties/253b5bb72db493adf8566e20aa2d944c_images.jpg",
      },
      color: "Black",
      material: "Leather",
      brand: "Hush Puppies",
      style: ["Formal", "Semi-formal"],
    },
    {
      id: "shoe-2",
      type: "Shoes",
      image: {
        uri: "http://assets.myntassets.com/v1/images/style/properties/8ad35a71d39ef0432055771175ca3adc_images.jpg",
      },
      color: "Brown",
      material: "Suede",
      brand: "Clarks",
      style: ["Semi-formal", "Casual"],
    },
    {
      id: "shoe-3",
      type: "Shoes",
      image: {
        uri: "http://assets.myntassets.com/v1/images/style/properties/253b5bb72db493adf8566e20aa2d944c_images.jpg",
      },
      color: "Black",
      material: "Premium Leather",
      brand: "Ruosh",
      style: ["Formal", "Premium"],
    },
  ],
  accessories: [
    {
      id: "acc-1",
      type: "Watch",
      image: {
        uri: "http://assets.myntassets.com/v1/images/style/properties/25de793ebfeae19ad56eb89d39a482da_images.jpg",
      },
      color: "Silver",
      material: "Stainless Steel",
      brand: "Fossil",
      style: ["Formal", "Semi-formal", "Casual"],
    },
    {
      id: "acc-2",
      type: "Watch",
      image: {
        uri: "http://assets.myntassets.com/v1/images/style/properties/25de793ebfeae19ad56eb89d39a482da_images.jpg",
      },
      color: "Silver",
      material: "Stainless Steel",
      brand: "Fossil",
      style: ["Semi-formal", "Casual"],
    },
    {
      id: "acc-3",
      type: "Watch",
      image: {
        uri: "http://assets.myntassets.com/v1/images/style/properties/25de793ebfeae19ad56eb89d39a482da_images.jpg",
      },
      color: "Gold",
      material: "Metal",
      brand: "Titan",
      style: ["Formal", "Premium"],
    },
  ],
};

// Helper function to generate recommendations based on user upload
export const generateCombinations = (userUpload) => {
  // Determine style suggestions based on user uploaded item
  // This is where you would implement your style matching logic
  // For now, let's use a simple color-based approach

  const suggestedStyles = getSuggestedStyles(userUpload);
  const combinations = [];

  // Generate 3 combinations
  for (let i = 0; i < 3; i++) {
    // Pick a style from suggested styles or default to a random one
    const style =
      suggestedStyles[i % suggestedStyles.length] ||
      ["Formal", "Semi-formal", "Casual", "Premium"][
        Math.floor(Math.random() * 4)
      ];

    // Generate a combination based on the style and user upload
    const combination = createCombination(userUpload, style, i + 1);
    combinations.push(combination);
  }

  return combinations;
};

// Helper function to suggest styles based on user upload
const getSuggestedStyles = (userUpload) => {
  // Basic style suggestion based on color
  // This can be expanded with more sophisticated logic
  const colorStyleMap = {
    Blue: ["Formal", "Semi-formal"],
    "Light Blue": ["Semi-formal", "Casual"],
    "Royal Blue": ["Formal", "Premium"],
    "Navy Blue": ["Formal", "Premium"],
    White: ["Formal", "Casual"],
    Black: ["Formal", "Premium"],
    Grey: ["Formal", "Semi-formal"],
    Red: ["Casual", "Premium"],
    Green: ["Casual", "Semi-formal"],
  };

  // Default to a mix of styles if we can't determine
  return colorStyleMap[userUpload.color] || ["Formal", "Semi-formal", "Casual"];
};

// Create a single combination based on style and user upload
const createCombination = (userUpload, style, index) => {
  const comboId = `${userUpload.id}-combo-${index}`;
  const items = [];

  // Add the user uploaded item to the combination
  items.push(userUpload);

  // Add complementary items based on style
  // Skip the category of the user uploaded item
  const userCategory = getCategoryFromType(userUpload.type);

  // Add one item from each remaining category based on style
  Object.keys(clothingItems).forEach((category) => {
    if (category !== userCategory) {
      // Find matching items for this style
      const matchingItems = clothingItems[category].filter((item) =>
        item.style.includes(style)
      );

      if (matchingItems.length > 0) {
        // Random selection from matching items
        const randomItem =
          matchingItems[Math.floor(Math.random() * matchingItems.length)];
        items.push(randomItem);
      }
    }
  });

  return {
    id: comboId,
    name: `${style} Combination ${index}`,
    style: style,
    items: items,
    uploadId: userUpload.id, // Reference to which upload this belongs to
  };
};

// Helper to determine category from item type
const getCategoryFromType = (type) => {
  const typeCategories = {
    SHIRT: "tops",
    Blazer: "tops",
    Jacket: "tops",
    "T-shirt": "tops",
    Pants: "bottoms",
    Pant: "bottoms",
    Jeans: "bottoms",
    Shorts: "bottoms",
    Shoes: "footwear",
    Sneakers: "footwear",
    Boots: "footwear",
    Watch: "accessories",
    Belt: "accessories",
    Tie: "accessories",
  };

  return typeCategories[type] || "other";
};

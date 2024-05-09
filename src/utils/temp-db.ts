export const tempLists = [
  {
    id: "list-1",
    name: "List 1",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel labore, dolores iste in sunt architecto incidunt iusto quasi magnam id. Nisi nostrum eum odio dolores delectus tempore quod voluptas rerum.",
  },
  {
    id: "list-2",
    name: "List 2 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta, earum doloribus. Perspiciatis maxime commodi accusamus",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel labore, dolores iste in sunt architecto incidunt iusto quasi magnam id. Nisi nostrum eum odio dolores delectus tempore quod voluptas rerum.",
  },
  {
    id: "list-3",
    name: "List 3",
  },
];

export const tempFoods = [
  {
    id: "food-1",
    list_id: "list-1",
    name: "Apples",
    quantity: 99,
    price: 1.29,
    price_unit: "per pound",
    market: "Trader Joe's",
    expiration: "2024-05-13",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel labore, dolores iste in sunt architecto incidunt iusto quasi magnam id. Nisi nostrum eum odio dolores delectus tempore quod voluptas rerum.",
  },
  {
    id: "food-2",
    list_id: "list-1",
    name: "Pears Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta, earum doloribus. Perspiciatis maxime commodi accusamus",
    quantity: 24,
  },
  {
    id: "food-3",
    list_id: "list-1",
    name: "Chips",
    quantity: 2,
    price: 3.99,
    price_unit: "each",
  },
  {
    id: "food-4",
    list_id: "list-2",
    name: "Mangoes",
    quantity: 3,
    price: 1.29,
    price_unit: "per pound",
    market: "Trader Joe's",
    expiration: "2024-04-21",
  },
  {
    id: "food-5",
    list_id: "list-2",
    name: "Bread",
    quantity: 10,
  },
  {
    id: "food-6",
    list_id: "list-2",
    name: "Pickles Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta, earum doloribus. Perspiciatis maxime commodi accusamus",
    quantity: 2,
    price: 3.99,
    price_unit: "each",
  },
  {
    id: "food-7",
    list_id: "list-3",
    name: "Blueberries",
    quantity: 8,
    price: 1.29,
    price_unit: "each",
    market: "Trader Joe's",
    expiration: "2025-06-21",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel labore, dolores iste in sunt architecto incidunt iusto quasi magnam id. Nisi nostrum eum odio dolores delectus tempore quod voluptas rerum.",
  },
  {
    id: "food-8",
    list_id: "list-3",
    name: "Pears",
    quantity: 0,
  },
  {
    id: "food-9",
    list_id: "list-3",
    name: "Milk Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta, earum doloribus. Perspiciatis maxime commodi accusamus",
    quantity: 4,
    price: 3.99,
    price_unit: "per ounce",
  },
];

export const getTempList = (listId: string) =>
  tempLists.filter(({ id }) => id === listId)[0];

export const getTempFoods = (listId: string) =>
  tempFoods.filter(({ list_id }) => list_id === listId);

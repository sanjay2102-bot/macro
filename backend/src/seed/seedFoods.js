require("dotenv").config();

const connectDb = require("../config/db");
const Food = require("../models/Food");
const MessMeal = require("../models/MessMeal");
const foods = require("./indianFoods");

async function run() {
  await connectDb();

  await Food.bulkWrite(
    foods.map((food) => ({
      replaceOne: {
        filter: { name: food.name, source: "system" },
        replacement: food,
        upsert: true
      }
    }))
  );

  const created = await Food.find({ source: "system" });
  const byName = Object.fromEntries(created.map((food) => [food.name, food]));

  const item = (name, quantity = 1) => ({ food: byName[name]._id, quantity });
  const meal = (dayOfWeek, mealType, title, description, items) => ({
    dayOfWeek,
    mealType,
    name: `${title}`,
    description,
    items,
    tags: ["srm", "mess", dayOfWeek, mealType],
    hostelRegion: "south"
  });

  const weeklyMeals = [
    meal("sunday", "breakfast", "Sunday Breakfast", "Bread, butter, jam, idly, chutney, sambar, boiled egg, banana, milk, coffee", [
      item("Bread butter jam"),
      item("Idli"),
      item("Sambar"),
      item("Boiled egg"),
      item("Banana"),
      item("Milk")
    ]),
    meal("sunday", "lunch", "Sunday Lunch", "Chapathi, chicken masala, paneer butter masala, white rice, dal, tomato rasam, butter milk, fryums, pickle", [
      item("Chapati / roti", 2),
      item("Chicken masala"),
      item("Paneer butter masala", 0.5),
      item("Cooked white rice", 1.5),
      item("Plain dal"),
      item("Rasam"),
      item("Fryums"),
      item("Pickle")
    ]),
    meal("sunday", "snack", "Sunday Snacks", "Sweet corn, tea or juice", [item("Sweet corn"), item("Tea")]),
    meal("sunday", "dinner", "Sunday Dinner", "Ghee chapathi, veg chettinad khurma, dal tadka, white rice, rasam, poriyal, fryums, pickle, veg salad, special fruit, milk, ice cream", [
      item("Chapati / roti", 2),
      item("Mixed veg sabzi"),
      item("Plain dal"),
      item("Cooked white rice"),
      item("Rasam"),
      item("Poriyal"),
      item("Special fruit"),
      item("Milk"),
      item("Ice cream")
    ]),

    meal("monday", "breakfast", "Monday Breakfast", "Bread, butter, jam, upma, coconut chutney, poha, mint chutney, boiled egg, sprouts salad, banana, milk, coffee", [
      item("Bread butter jam"),
      item("Upma"),
      item("Poha", 0.75),
      item("Boiled egg"),
      item("Banana"),
      item("Milk")
    ]),
    meal("monday", "lunch", "Monday Lunch", "Sweet, variety rice, white rice, dal fry, veg subji, sambar, pepper rasam, butter milk, fryums, pickle", [
      item("Veg pulao"),
      item("Cooked white rice"),
      item("Plain dal"),
      item("Mixed veg sabzi"),
      item("Sambar"),
      item("Rasam"),
      item("Fryums")
    ]),
    meal("monday", "snack", "Monday Snacks", "Pav bhaji, tea", [item("Pav bhaji"), item("Tea")]),
    meal("monday", "dinner", "Monday Dinner", "Butter chapathi, aloo mutter masala, white rice, dal sambar, subji, rasam, fryums, pickle, veg salad, special fruit, milk", [
      item("Chapati / roti", 2),
      item("Aloo mutter masala"),
      item("Cooked white rice"),
      item("Sambar"),
      item("Mixed veg sabzi"),
      item("Rasam"),
      item("Special fruit"),
      item("Milk")
    ]),

    meal("tuesday", "breakfast", "Tuesday Breakfast", "Bread, butter, jam, pongal, sambar, coconut chutney, boiled egg, banana, milk, coffee", [
      item("Bread butter jam"),
      item("Pongal"),
      item("Sambar"),
      item("Boiled egg"),
      item("Banana"),
      item("Milk")
    ]),
    meal("tuesday", "lunch", "Tuesday Lunch", "Jeera pulao, white rice, masala sambar, subji, poriyal, sambar garlic rasam, butter milk, fryums, pickle", [
      item("Jeera pulao"),
      item("Cooked white rice"),
      item("Sambar"),
      item("Mixed veg sabzi"),
      item("Poriyal"),
      item("Rasam"),
      item("Fryums")
    ]),
    meal("tuesday", "snack", "Tuesday Snacks", "Sundal, tea", [item("Sundal"), item("Tea")]),
    meal("tuesday", "dinner", "Tuesday Dinner", "Chapathi, veg manchurian, fried rice, white rice, tomato dal, rasam, poriyal, fryums, pickle, veg salad, special fruits, milk", [
      item("Chapati / roti", 2),
      item("Veg manchurian"),
      item("Fried rice"),
      item("Yellow dal"),
      item("Rasam"),
      item("Poriyal"),
      item("Special fruit"),
      item("Milk")
    ]),

    meal("wednesday", "breakfast", "Wednesday Breakfast", "Bread, butter, jam, idly, sambar, kara chutney, boiled egg, banana, milk, coffee", [
      item("Bread butter jam"),
      item("Idli"),
      item("Sambar"),
      item("Boiled egg"),
      item("Banana"),
      item("Milk")
    ]),
    meal("wednesday", "lunch", "Wednesday Lunch", "Veg pulao, white rice, dal fry, potato poriyal, more kuzhambu, subji, rasam, butter milk, fryums, pickle", [
      item("Veg pulao"),
      item("Cooked white rice"),
      item("Plain dal"),
      item("Aloo sabzi"),
      item("Mixed veg sabzi"),
      item("Rasam"),
      item("Fryums")
    ]),
    meal("wednesday", "snack", "Wednesday Snacks", "Veg puff, tea", [item("Veg puff"), item("Tea")]),
    meal("wednesday", "dinner", "Wednesday Dinner", "Chapathi, chicken masala, paneer masala, yellow dal, white rice, rasam, fryums, pickle, veg salad, special fruits, milk", [
      item("Chapati / roti", 2),
      item("Chicken masala"),
      item("Paneer curry", 0.5),
      item("Yellow dal"),
      item("Cooked white rice"),
      item("Rasam"),
      item("Special fruit"),
      item("Milk")
    ]),

    meal("thursday", "breakfast", "Thursday Breakfast", "Bread, butter, jam, semiya kichadi, coconut chutney, boiled egg, sprouts salad, banana, milk, coffee", [
      item("Bread butter jam"),
      item("Upma"),
      item("Boiled egg"),
      item("Banana"),
      item("Milk")
    ]),
    meal("thursday", "lunch", "Thursday Lunch", "Bagara pulao, white rice, mysore dal, subji, kara kuzhambu, rasam, koottu, butter milk, fryums, pickle", [
      item("Bagara pulao"),
      item("Cooked white rice"),
      item("Plain dal"),
      item("Mixed veg sabzi"),
      item("Rasam"),
      item("Fryums")
    ]),
    meal("thursday", "snack", "Thursday Snacks", "Biscuit, tea", [item("Biscuit"), item("Tea")]),
    meal("thursday", "dinner", "Thursday Dinner", "Malabar paratha, chenna masala, white rice, tomato dal, poriyal, rasam, fryums, pickle, veg salad, special fruit, milk, ice cream", [
      item("Malabar paratha", 2),
      item("Chenna masala"),
      item("Cooked white rice"),
      item("Yellow dal"),
      item("Poriyal"),
      item("Rasam"),
      item("Special fruit"),
      item("Milk"),
      item("Ice cream")
    ]),

    meal("friday", "breakfast", "Friday Breakfast", "Bread, butter, jam, pongal, sambar, chutney, boiled egg, banana, milk, coffee", [
      item("Bread butter jam"),
      item("Pongal"),
      item("Sambar"),
      item("Boiled egg"),
      item("Banana"),
      item("Milk")
    ]),
    meal("friday", "lunch", "Friday Lunch", "Sweet, veg biryani, onion raitha, curd rice, white rice, dal, subji, rasam, potato chips, pickle", [
      item("Veg biryani"),
      item("Curd rice"),
      item("Cooked white rice"),
      item("Plain dal"),
      item("Mixed veg sabzi"),
      item("Rasam"),
      item("Fryums")
    ]),
    meal("friday", "snack", "Friday Snacks", "Sweet bun, tea", [item("Sweet bun"), item("Tea")]),
    meal("friday", "dinner", "Friday Dinner", "Ghee chapathi, mutter paneer masala, white rice, veg dal, rasam, poriyal, fryums, pickle, veg salad, special fruit, milk", [
      item("Chapati / roti", 2),
      item("Mutter paneer masala"),
      item("Cooked white rice"),
      item("Plain dal"),
      item("Rasam"),
      item("Poriyal"),
      item("Special fruit"),
      item("Milk")
    ]),

    meal("saturday", "breakfast", "Saturday Breakfast", "Bread, butter, jam, semiya kichadi, chutney, boiled egg, banana, milk, coffee", [
      item("Bread butter jam"),
      item("Upma"),
      item("Boiled egg"),
      item("Banana"),
      item("Milk")
    ]),
    meal("saturday", "lunch", "Saturday Lunch", "Corn pulao, white rice, dal tadka, sambar, koottu, subji, rasam, butter milk, fryums, pickle", [
      item("Corn pulao"),
      item("Cooked white rice"),
      item("Plain dal"),
      item("Sambar"),
      item("Mixed veg sabzi"),
      item("Rasam"),
      item("Fryums")
    ]),
    meal("saturday", "snack", "Saturday Snacks", "Tea, cake", [item("Tea"), item("Cake")]),
    meal("saturday", "dinner", "Saturday Dinner", "Punjabi paratha, rajma paneer masala, white rice, veg dal, rasam, subji, fryums, pickle, veg salad, special fruit, milk", [
      item("Punjabi paratha", 2),
      item("Rajma paneer masala"),
      item("Cooked white rice"),
      item("Plain dal"),
      item("Rasam"),
      item("Mixed veg sabzi"),
      item("Special fruit"),
      item("Milk")
    ])
  ];

  await MessMeal.bulkWrite(
    weeklyMeals.map((messMeal) => ({
      replaceOne: {
        filter: {
          dayOfWeek: messMeal.dayOfWeek,
          mealType: messMeal.mealType,
          name: messMeal.name
        },
        replacement: messMeal,
        upsert: true
      }
    }))
  );

  console.log(`Seeded ${created.length} foods and ${weeklyMeals.length} SRM mess meals`);
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

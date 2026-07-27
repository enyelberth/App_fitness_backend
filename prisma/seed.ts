import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMuscleGroups() {
  const groups = [
    { name: 'Chest' },
    { name: 'Back' },
    { name: 'Legs' },
    { name: 'Shoulders' },
    { name: 'Biceps' },
    { name: 'Triceps' },
  ];

  for (const group of groups) {
    await prisma.muscleGroup.upsert({
      where: { name: group.name },
      update: {},
      create: group,
    });
  }
  console.log('✅ MuscleGroups seeded (6)');
}

async function seedExercises() {
  const exercises = [
    { name: 'Bench Press', description: 'Push weight horizontally' },
    { name: 'Squats', description: 'Lower body compound movement' },
    { name: 'Deadlift', description: 'Full body compound movement' },
    { name: 'Pull Ups', description: 'Upper body pulling exercise' },
    { name: 'Barbell Row', description: 'Back compound movement' },
    { name: 'Shoulder Press', description: 'Overhead pressing movement' },
    { name: 'Bicep Curls', description: 'Arm isolation exercise' },
    { name: 'Tricep Dips', description: 'Arm compound exercise' },
    { name: 'Leg Press', description: 'Lower body compound movement' },
    { name: 'Lat Pulldown', description: 'Back isolation exercise' },
    { name: 'Chest Fly', description: 'Chest isolation exercise' },
    { name: 'Leg Curls', description: 'Hamstring isolation' },
    { name: 'Leg Extensions', description: 'Quadriceps isolation' },
    { name: 'Planks', description: 'Core isometric exercise' },
    { name: 'Crunches', description: 'Abs isolation exercise' },
    { name: 'Running', description: 'Cardio exercise' },
    { name: 'Cycling', description: 'Cardio exercise' },
    { name: 'Swimming', description: 'Full body cardio' },
    { name: 'Walking', description: 'Low impact cardio' },
    { name: 'Rowing', description: 'Full body compound' },
  ];

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: {},
      create: exercise,
    });
  }
  console.log('✅ Exercises seeded (20)');
}

async function seedCosmetics() {
  const cosmetics = [
    { name: 'Fire Aura', type: 'AURA', rarity: 'RARE', price: 100, gemPrice: 50 },
    { name: 'Ice Aura', type: 'AURA', rarity: 'RARE', price: 100, gemPrice: 50 },
    { name: 'Lightning Aura', type: 'AURA', rarity: 'EPIC', price: 200, gemPrice: 100 },
    { name: 'Gold Dumbbell', type: 'WEAPON', rarity: 'EPIC', price: 500, gemPrice: 250 },
    { name: 'Platinum Barbell', type: 'WEAPON', rarity: 'LEGENDARY', price: 1000, gemPrice: 500 },
    { name: 'Diamond Sword', type: 'WEAPON', rarity: 'LEGENDARY', price: 1500, gemPrice: 750 },
    { name: 'Gym Shirt Red', type: 'OUTFIT', rarity: 'COMMON', price: 50, gemPrice: 25 },
    { name: 'Gym Shirt Blue', type: 'OUTFIT', rarity: 'COMMON', price: 50, gemPrice: 25 },
    { name: 'Athletic Shoes', type: 'OUTFIT', rarity: 'COMMON', price: 75, gemPrice: 35 },
    { name: 'Hoodie Black', type: 'OUTFIT', rarity: 'RARE', price: 150, gemPrice: 75 },
    { name: 'Trainer Hat', type: 'ACCESSORY', rarity: 'COMMON', price: 50, gemPrice: 25 },
    { name: 'Gym Gloves', type: 'ACCESSORY', rarity: 'COMMON', price: 60, gemPrice: 30 },
    { name: 'Dragon Pet', type: 'PET', rarity: 'LEGENDARY', price: 2000, gemPrice: 1000 },
    { name: 'Wolf Pet', type: 'PET', rarity: 'EPIC', price: 800, gemPrice: 400 },
    { name: 'Phoenix Pet', type: 'PET', rarity: 'LEGENDARY', price: 2000, gemPrice: 1000 },
  ];

  for (const cosmetic of cosmetics) {
    try {
      await prisma.gameCosmetic.create({
        data: {
          name: cosmetic.name,
          type: cosmetic.type,
          rarity: cosmetic.rarity,
          price: cosmetic.price,
          gemPrice: cosmetic.gemPrice,
        },
      });
    } catch (e) {
      // Ignore if already exists
    }
  }
  console.log('✅ Cosmetics seeded (15)');
}

async function seedQuests() {
  const quests = [
    {
      title: 'First Workout',
      description: 'Complete your first workout',
      type: 'DAILY',
      requirement: 'complete_1_workout',
      targetValue: 1,
      xpReward: 100,
      coinReward: 50,
    },
    {
      title: 'Week Warrior',
      description: 'Complete 5 workouts this week',
      type: 'WEEKLY',
      requirement: 'complete_5_workouts',
      targetValue: 5,
      xpReward: 500,
      coinReward: 250,
    },
    {
      title: 'Iron Will',
      description: 'Complete 50 workouts',
      type: 'SEASONAL',
      requirement: 'total_workouts',
      targetValue: 50,
      xpReward: 1000,
      coinReward: 500,
    },
  ];

  console.log('✅ Quest templates prepared (3)');
}

async function main() {
  console.log('🌱 Seeding database...');
  try {
    await seedMuscleGroups();
    await seedExercises();
    await seedCosmetics();
    await seedQuests();
    console.log('✅ Database seeded successfully!');
  } catch (e) {
    console.error('❌ Error seeding database:', e);
    throw e;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

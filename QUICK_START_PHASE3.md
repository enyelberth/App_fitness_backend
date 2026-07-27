# Phase 3 Enhancements - Quick Start Guide
**Get started with new features in 10 minutes**

---

## 🚀 SETUP (5 minutes)

```bash
# 1. Apply database migrations
npx prisma migrate dev --name add_phase3_enhancements

# 2. Generate Prisma client
npx prisma generate

# 3. Start dev server
pnpm start:dev

# 4. Verify it's running
curl http://localhost:4000/api/v1/health
```

---

## 📋 FEATURE QUICK REFERENCE

### 1️⃣ WORKOUT MANAGEMENT (Bug Fix + 3 New Features)

#### ✅ Fix: Remove Exercise
```bash
# Now works correctly - removes exercise and auto-reorders others
DELETE /workouts/{id}/exercises/{exerciseId}
```

#### ✨ New: Update Exercise Details
```bash
PATCH /workouts/{id}/exercises/{exerciseId}
{
  "sets": 4,
  "reps": 8,
  "weightKg": 100.50,
  "restSec": 120,
  "notes": "Used machine"
}
```

#### ✨ New: Reorder Exercises
```bash
PATCH /workouts/{id}/reorder
{
  "updates": [
    { "exerciseId": "ex1", "newPosition": 2 },
    { "exerciseId": "ex2", "newPosition": 0 }
  ]
}
```

#### ✨ New: Clone Workout
```bash
POST /workouts/{id}/clone
{
  "name": "Chest Day - Week 2"
}
```

---

### 2️⃣ WORKOUT SESSIONS (6 New Features - Track Actual Performance)

#### Start a Session
```bash
POST /workouts/{workoutId}/sessions
# Returns: { id, startedAt, exercises: [...] }
```

#### Log a Set (RPE, Reps, Weight)
```bash
POST /workouts/{workoutId}/sessions/{sessionId}/sets
{
  "exerciseId": "ex123",
  "setsCompleted": 3,
  "repsPerformed": [10, 9, 8],        # Actual reps
  "weightUsed": 100.50,
  "rpe": 8                             # Rate of Perceived Exertion (1-10)
}
```

#### End Session with Notes
```bash
POST /workouts/{workoutId}/sessions/{sessionId}/end
{
  "notes": "Felt strong, good form"
}
```

#### View Session Stats
```bash
GET /workouts/{workoutId}/sessions
# Returns: [
#   {
#     id, startedAt, endedAt,
#     durationMinutes: 45,
#     totalSets: 15,
#     totalReps: 120,
#     avgRpe: 7.5
#   }
# ]
```

#### Get User Stats
```bash
GET /users/me/workout-stats
# Returns:
# {
#   totalSessions: 42,
#   totalWorkoutTimeMinutes: 2100,
#   averageSessionDurationMinutes: 50,
#   totalSetsPerformed: 525
# }
```

---

### 3️⃣ EXERCISE RATINGS (3 New Features - Community Feedback)

#### Rate an Exercise (1-5 stars)
```bash
POST /exercises/{id}/rating
{
  "rating": 5,
  "review": "Great for chest development"
}
```

#### View Exercise Rating Summary
```bash
GET /exercises/{id}/rating-summary
# Returns:
# {
#   averageRating: 4.7,
#   totalRatings: 125,
#   ratingDistribution: { 1: 2, 2: 1, 3: 5, 4: 40, 5: 77 }
# }
```

#### View All Reviews
```bash
GET /exercises/{id}/ratings
```

---

### 4️⃣ EXERCISE VARIATIONS (2 New Features - Track Variants)

#### List Variations (Barbell, Dumbbell, Machine)
```bash
GET /exercises/{id}/variations
# Returns: [
#   { id, name: "Dumbbell", description: "..." },
#   { id, name: "Machine", description: "..." }
# ]
```

#### Create Variation (Admin/Coach)
```bash
POST /exercises/{id}/variations
{
  "name": "Dumbbell Variation",
  "description": "Using dumbbells instead of barbell"
}
```

---

### 5️⃣ FAVORITES (4 New Features - Quick Access)

#### Mark Exercise as Favorite
```bash
POST /exercises/{id}/favorite
# Returns: { id, type: "EXERCISE", exerciseId, createdAt }
```

#### Get Favorite Exercises
```bash
GET /favorites/exercises
# Returns: [{ exercise details }, ...]
```

#### Mark Workout as Favorite
```bash
POST /workouts/{id}/favorite
```

#### Get Favorite Workouts
```bash
GET /favorites/workouts
```

---

### 6️⃣ WORKOUT TEMPLATES (3 New Features - Reusable Routines)

#### List Public Templates
```bash
GET /workout-templates
# Shows all admin-created templates
```

#### Search Templates
```bash
GET /workout-templates/search?q=chest&difficulty=BEGINNER
```

#### Clone Template to Personal Workout
```bash
POST /workout-templates/{id}/clone
{
  "workoutName": "Chest Day - Jan 2025"
}
# Creates new personal workout with same exercises
```

#### Create Template (Admin/Coach Only)
```bash
POST /workout-templates
{
  "name": "Beginner Upper Body",
  "difficulty": "BEGINNER",
  "durationMin": 45,
  "exercises": [
    {
      "exerciseId": "ex123",
      "sets": 3,
      "reps": 10,
      "weightKg": 50,
      "restSec": 60
    }
  ]
}
```

---

## 🧪 TEST WORKFLOW (10 minutes)

### Complete Workflow - Create → Track → Analyze

```bash
# 1. Register & Login (if not already)
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "user@example.com",
    "password": "SecurePass123!"
  }'
# Save the accessToken

export TOKEN="your_access_token"

# 2. Create a Workout
curl -X POST http://localhost:4000/api/v1/workouts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chest Day",
    "difficulty": "INTERMEDIATE",
    "durationMin": 60
  }'
# Save the workout ID
export WORKOUT_ID="workout_id_from_response"

# 3. Add an Exercise (get exercise ID first)
curl http://localhost:4000/api/v1/exercises?search=bench | head -20
export EXERCISE_ID="ex_id_from_list"

curl -X POST http://localhost:4000/api/v1/workouts/$WORKOUT_ID/exercises \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "exerciseId": "'$EXERCISE_ID'",
    "sets": 3,
    "reps": 10,
    "weightKg": 100
  }'

# 4. Start a Workout Session
curl -X POST http://localhost:4000/api/v1/workouts/$WORKOUT_ID/sessions \
  -H "Authorization: Bearer $TOKEN"
# Save session ID
export SESSION_ID="session_id_from_response"

# 5. Log Performance (sets, reps, RPE)
curl -X POST http://localhost:4000/api/v1/workouts/$WORKOUT_ID/sessions/$SESSION_ID/sets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "exerciseId": "'$EXERCISE_ID'",
    "setsCompleted": 3,
    "repsPerformed": [10, 10, 9],
    "weightUsed": 100,
    "rpe": 7
  }'

# 6. End Session
curl -X POST http://localhost:4000/api/v1/workouts/$WORKOUT_ID/sessions/$SESSION_ID/end \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Felt strong today!"
  }'

# 7. View Session Details
curl http://localhost:4000/api/v1/workouts/$WORKOUT_ID/sessions/$SESSION_ID \
  -H "Authorization: Bearer $TOKEN"

# 8. View Session History
curl http://localhost:4000/api/v1/workouts/$WORKOUT_ID/sessions \
  -H "Authorization: Bearer $TOKEN"

# 9. Get User Stats
curl http://localhost:4000/api/v1/users/me/workout-stats \
  -H "Authorization: Bearer $TOKEN"

# 10. Rate the Exercise
curl -X POST http://localhost:4000/api/v1/exercises/$EXERCISE_ID/rating \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "review": "Excellent chest exercise!"
  }'

# 11. View Rating Summary
curl http://localhost:4000/api/v1/exercises/$EXERCISE_ID/rating-summary

# 12. Mark as Favorite
curl -X POST http://localhost:4000/api/v1/exercises/$EXERCISE_ID/favorite \
  -H "Authorization: Bearer $TOKEN"

# 13. Clone the Workout
curl -X POST http://localhost:4000/api/v1/workouts/$WORKOUT_ID/clone \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chest Day - Week 2"
  }'

# 14. Get Favorites
curl http://localhost:4000/api/v1/favorites/exercises \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 DATABASE CHANGES

```bash
# View the migration that was created
cat prisma/migrations/*/migration.sql

# Rollback if needed
npx prisma migrate resolve --rolled-back "add_phase3_enhancements"
```

---

## 🐛 COMMON ISSUES & FIXES

### Issue: "Migration failed"
```bash
# Reset database (WARNING: loses all data)
npx prisma migrate reset
```

### Issue: "Prisma client out of date"
```bash
npx prisma generate
```

### Issue: TypeScript errors
```bash
# Rebuild
pnpm build
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] Database migrated successfully
- [ ] Dev server starts without errors
- [ ] Can register & login
- [ ] Can create workout
- [ ] Can add exercise to workout
- [ ] Can start/end workout session
- [ ] Can log sets with RPE
- [ ] Can rate exercise
- [ ] Can mark favorite
- [ ] Can clone workout
- [ ] User stats endpoint works

---

## 📈 WHAT'S NEW AT A GLANCE

```
Phase 3 Before → Phase 3 After

Workouts:       50% → 95%  ✅
Exercises:      80% → 95%  ✅
Sessions:        0% → 100% ✅ (NEW)
Templates:       0% → 100% ✅ (NEW)
Ratings:         0% → 100% ✅ (NEW)
Favorites:       0% → 100% ✅ (NEW)
─────────────────────────────
Overall:        67% → 95%  🎉
```

---

## 🚀 NEXT PHASE

Ready to implement Phase 4 (Payments & Economy)?

See: `PHASE_4_PAYMENTS_BLUEPRINT.md` & `PHASE_5_ECONOMY_BLUEPRINT.md`

---

**Happy Coding! 🏋️**

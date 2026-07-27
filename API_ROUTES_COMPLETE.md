# 📚 API ROUTES - FITQUEST BACKEND COMPLETO

**110+ endpoints totales**

---

## 🔐 AUTH MODULE (8 endpoints)

### Authentication & Token Management
```
POST   /auth/register
       Body: { email, username, password }
       Response: { accessToken, refreshToken, user }

POST   /auth/login
       Body: { email, password }
       Response: { accessToken, refreshToken, user }

POST   /auth/refresh
       Body: { refreshToken }
       Response: { accessToken }

GET    /auth/me
       Headers: Authorization: Bearer {token}
       Response: { user }

POST   /auth/forgot-password
       Body: { email }
       Response: { message, resetToken sent to email }

POST   /auth/reset-password
       Body: { resetToken, newPassword }
       Response: { message, success }

POST   /auth/verify-email
       Body: { verificationToken }
       Response: { message, emailVerified }

POST   /auth/generate-verification-token
       Body: { email }
       Response: { message, token sent to email }
```

---

## 👤 USERS MODULE (5 endpoints)

### User Profile Management
```
GET    /users/me
       Headers: Authorization: Bearer {token}
       Response: { id, email, username, profile, roles }

PATCH  /users/me
       Body: { firstName, lastName, bio, avatar }
       Response: { user updated }

PATCH  /users/me/password
       Body: { oldPassword, newPassword }
       Response: { message, success }

DELETE /users/me
       Headers: Authorization: Bearer {token}
       Response: { message, account soft deleted }

GET    /users/:id/public
       Response: { username, bio, avatar, stats }
```

---

## 🏋️ FITNESS MODULE (46+ endpoints)

### Workouts
```
POST   /fitness/workouts
       Body: { name, exercises[], difficulty, duration }
       Response: { workout }

GET    /fitness/workouts
       Query: { page, limit, difficulty }
       Response: { workouts[] }

GET    /fitness/workouts/:id
       Response: { workout details }

PATCH  /fitness/workouts/:id
       Body: { name, exercises[], difficulty }
       Response: { workout updated }

DELETE /fitness/workouts/:id
       Response: { message, success }

POST   /fitness/workouts/:id/complete
       Body: { duration, notes }
       Response: { xpEarned, levelUp }
```

### Exercises
```
GET    /fitness/exercises
       Query: { page, limit, muscleGroup }
       Response: { exercises[] }

GET    /fitness/exercises/:id
       Response: { exercise details }

POST   /fitness/exercises
       Body: { name, description, muscleGroup, equipment }
       Response: { exercise created }

GET    /fitness/exercises (search)
       Query: { q }
       Response: { exercises[] }
```

### Exercise Variations
```
GET    /fitness/exercises/:id/variations
       Response: { variations[] }

POST   /fitness/exercises/:id/variations
       Body: { name, description, difficulty }
       Response: { variation created }

PATCH  /fitness/exercises/:id/variations/:vid
       Body: { name, description }
       Response: { variation updated }

DELETE /fitness/exercises/:id/variations/:vid
       Response: { message, success }
```

### Muscle Groups
```
GET    /fitness/muscle-groups
       Response: { muscleGroups[] }

GET    /fitness/muscle-groups/:id
       Response: { muscleGroup details }

GET    /fitness/muscle-groups/:id/exercises
       Response: { exercises[] }

POST   /fitness/muscle-groups/seed
       Response: { message, muscleGroups created }
```

### Sessions
```
POST   /fitness/sessions
       Body: { workoutId }
       Response: { session created }

GET    /fitness/sessions
       Response: { sessions[] }

GET    /fitness/sessions/current
       Response: { currentSession }

GET    /fitness/sessions/:id
       Response: { session details }

POST   /fitness/sessions/:id/sets
       Body: { exerciseId, reps, weight, duration }
       Response: { set added }

POST   /fitness/sessions/:id/complete
       Body: { notes }
       Response: { sessionCompleted, xpEarned }
```

### Favorites
```
POST   /fitness/favorites/exercises/:id
       Response: { message, favorited }

DELETE /fitness/favorites/exercises/:id
       Response: { message, unfavorited }

GET    /fitness/favorites/exercises
       Response: { favorites[] }

GET    /fitness/favorites/workouts
       Response: { favorites[] }
```

### Templates
```
POST   /fitness/templates
       Body: { name, exercises[] }
       Response: { template created }

GET    /fitness/templates
       Response: { templates[] }

GET    /fitness/templates/:id
       Response: { template details }

POST   /fitness/templates/:id/use
       Response: { newWorkout created from template }

DELETE /fitness/templates/:id
       Response: { message, success }
```

### Analytics
```
GET    /fitness/analytics/history
       Response: { workouts[], totalVolume, avgDuration }

GET    /fitness/analytics/weekly
       Response: { sessions, volume, avgDuration, daysActive }

GET    /fitness/analytics/monthly
       Response: { sessions, volume, avgPerWeek, consistency }

GET    /fitness/analytics/body-progress
       Response: { current, initial, change }

GET    /fitness/analytics/muscle-groups
       Response: { muscleStats[] }
```

### Sharing
```
POST   /fitness/workouts/:id/share
       Body: { targetUserId }
       Response: { shared }

GET    /fitness/workouts/shared-with-me
       Response: { sharedWorkouts[] }

GET    /fitness/workouts/public/:userId
       Response: { publicWorkouts[] }

GET    /fitness/workouts/:id/details
       Response: { workoutDetails }
```

### Progression
```
GET    /fitness/progression/exercise/:id/history
       Response: { history[] }

GET    /fitness/progression/exercise/:id/next-weight
       Response: { suggestion, reason }

GET    /fitness/progression/workout/:id/difficulty-adjustment
       Response: { action, newDifficulty }
```

### Stats
```
GET    /fitness/stats/progress
       Response: { totalWorkouts, totalVolume, streak }

GET    /fitness/stats/exercises/:id
       Response: { exerciseStats }

GET    /fitness/stats/top-exercises
       Response: { topExercises[] }

GET    /fitness/stats/personal-records
       Response: { prs[] }
```

---

## 🎮 GAME MODULE (57+ endpoints)

### Character
```
POST   /game/characters
       Body: { class, name }
       Response: { character created }

GET    /game/characters
       Response: { characters[] }

GET    /game/characters/:id
       Response: { character details }

PATCH  /game/characters/:id
       Body: { name, class }
       Response: { character updated }

DELETE /game/characters/:id
       Response: { message, success }
```

### Quests
```
GET    /game/quests
       Query: { type: DAILY|WEEKLY|SEASONAL }
       Response: { quests[] }

GET    /game/quests/active
       Response: { activeQuests[] }

GET    /game/quests/:id
       Response: { quest details }

POST   /game/quests/:id/complete
       Body: { progress }
       Response: { xpReward, coinReward }
```

### Cosmetics
```
GET    /game/cosmetics
       Query: { type, rarity }
       Response: { cosmetics[] }

POST   /game/cosmetics
       Body: { name, type, rarity }
       Response: { cosmetic created }

GET    /game/cosmetics/:id
       Response: { cosmetic details }

POST   /game/cosmetics/:id/purchase
       Body: { currency: COINS|GEMS }
       Response: { purchased, inventory updated }

POST   /game/cosmetics/:id/equip
       Response: { equipped }
```

### Leaderboard
```
GET    /leaderboard/global
       Query: { page, limit }
       Response: { leaderboard[] }

GET    /leaderboard/my-rank
       Response: { rank, score, position }

GET    /leaderboard/character-stats/:id
       Response: { characterStats }
```

### Achievements
```
GET    /achievements/list
       Response: { achievements[] }

GET    /achievements/my-achievements
       Response: { myAchievements[] }
```

### Guilds
```
POST   /game/guilds
       Body: { name, description }
       Response: { guild created }

GET    /game/guilds/:id
       Response: { guild details }

GET    /game/guilds
       Response: { guilds[] }

POST   /game/guilds/:id/join
       Response: { joined }

DELETE /game/guilds/:id/leave
       Response: { left }

GET    /game/guilds/:id/members
       Response: { members[] }

GET    /game/guilds/:id/leaderboard
       Response: { leaderboard[] }

POST   /game/guilds/:id/deposit
       Body: { amount, currency }
       Response: { deposited }

POST   /game/guilds/:id/withdraw
       Body: { amount, currency }
       Response: { withdrawn }
```

### Skill Tree
```
GET    /game/skills/tree
       Query: { class }
       Response: { skills[], unlockedSkills[] }

POST   /game/skills/:id/unlock
       Body: { skillId }
       Response: { unlocked, costDeducted }

GET    /game/prestige/info
       Response: { prestigeLevel, requirements }

POST   /game/prestige/reset
       Body: { confirm }
       Response: { reset, levelBonuses applied }
```

### PvP Battles
```
POST   /game/battles/challenge/:opponentId
       Body: {}
       Response: { battle created, opponentNotified }

POST   /game/battles/:battleId/accept
       Response: { battleStarted }

POST   /game/battles/:battleId/result
       Body: { winnerId, coinReward }
       Response: { resultRecorded }

GET    /game/battles/history
       Response: { battles[] }

GET    /game/battles/stats
       Response: { wins, losses, winRate, rank }

GET    /game/battles/pending
       Response: { pendingChallenges[] }
```

### Daily Streaks
```
GET    /game/streak/my-streak
       Response: { currentStreak, longestStreak, lastWorkout }

POST   /game/streak/checkin
       Response: { newStreak, rewards }

GET    /game/streak/rewards
       Response: { rewards[] }

GET    /game/streak/leaderboard
       Response: { leaderboard[] }
```

### Seasonal Events
```
GET    /game/events/current
       Response: { currentEvent }

GET    /game/events/list
       Response: { events[] }

GET    /game/events/upcoming
       Response: { upcomingEvents[] }

GET    /game/events/:eventId/leaderboard
       Response: { leaderboard[] }

GET    /game/events/:eventId/progress
       Response: { userProgress, rank, rewards }

POST   /game/events/:eventId/participate
       Response: { participated }

POST   /game/events/:eventId/claim-reward
       Body: { reward }
       Response: { claimed, inventory updated }
```

### Tournaments
```
GET    /game/tournaments/list
       Query: { status }
       Response: { tournaments[] }

GET    /game/tournaments/:id
       Response: { tournament details }

POST   /game/tournaments/:id/register
       Response: { registered }

GET    /game/tournaments/:id/bracket
       Response: { bracket[] }

GET    /game/tournaments/:id/leaderboard
       Response: { leaderboard[] }

GET    /game/tournaments/my-tournaments
       Response: { registered[], completed[] }

POST   /game/tournaments/:id/claim-reward
       Response: { claimed, reward }
```

### Matchmaking
```
POST   /game/matchmaking/queue/join
       Response: { matched, opponentInfo OR waitingMessage }

DELETE /game/matchmaking/queue/leave
       Response: { leftQueue }

GET    /game/matchmaking/queue/status
       Response: { inQueue, position, estimatedTime }

GET    /game/matchmaking/stats
       Response: { playersInQueue, activeMatches, avgTime }

GET    /game/matchmaking/leaderboard/ranked
       Response: { leaderboard[] }

GET    /game/matchmaking/ranked/my-stats
       Response: { rating, rank, wins, losses, history[] }

GET    /game/matchmaking/player/rating
       Response: { rating, rank, stats }
```

---

## 💳 PAYMENTS MODULE (13+ endpoints)

### Payment (Existing)
```
POST   /payments/checkout
       Body: { amount, productId }
       Response: { checkout session }

GET    /payments/status/:orderId
       Response: { paymentStatus }

POST   /payments/webhooks
       Body: { event data }
       Response: { received }
```

### Stripe Integration
```
POST   /payments/stripe/checkout/session
       Body: { productId, amount, currency }
       Response: { session url }

POST   /payments/stripe/payment-intent/create
       Body: { amount, currency, description }
       Response: { clientSecret, intentId }

GET    /payments/stripe/payment-intent/:intentId
       Response: { intent details }

POST   /payments/stripe/payment-intent/confirm
       Body: { intentId, paymentMethodId }
       Response: { status, success }

POST   /payments/stripe/refund
       Body: { intentId, amount }
       Response: { refundId, status }

POST   /payments/stripe/webhook
       Headers: { stripe-signature }
       Body: { event }
       Response: { received }

GET    /payments/stripe/payment-methods
       Response: { paymentMethods[] }

POST   /payments/stripe/payment-methods/:methodId/delete
       Response: { deleted }

POST   /payments/stripe/payment-methods/:methodId/update
       Body: { expMonth, expYear }
       Response: { updated }

GET    /payments/stripe/connect/info
       Response: { connectStatus, payoutSchedule }

POST   /payments/stripe/transfer
       Body: { amount, destination, currency }
       Response: { transferId, status }
```

---

## 💰 ECONOMY MODULE (8+ endpoints)

### Wallet
```
GET    /economy/wallet
       Response: { coins, gems, balance }

POST   /economy/wallet/transaction
       Body: { amount, type, description }
       Response: { transaction, newBalance }

GET    /economy/wallet/transactions
       Query: { page, limit }
       Response: { transactions[] }
```

### Marketplace
```
GET    /economy/marketplace/listings
       Query: { page, limit, type }
       Response: { listings[] }

POST   /economy/marketplace/sell/:cosmeticId
       Body: { price }
       Response: { listing created }

GET    /economy/marketplace/listings/:id
       Response: { listing details }

POST   /economy/marketplace/buy/:listingId
       Response: { purchased, coins deducted }

GET    /economy/marketplace/my-sales
       Response: { mySales[] }
```

### Purchase History
```
GET    /economy/purchases
       Response: { purchases[] }

GET    /economy/purchases/:id
       Response: { purchase details }
```

---

## 👥 SOCIAL MODULE (5 endpoints)

### Following
```
POST   /social/follow/:userId
       Response: { followed }

DELETE /social/follow/:userId
       Response: { unfollowed }

GET    /social/followers/:userId
       Response: { followers[] }

GET    /social/following/:userId
       Response: { following[] }

GET    /social/recommended
       Response: { recommendedUsers[] }
```

---

## 🛡️ ADMIN MODULE (6 endpoints) - @Roles('ADMIN')

### Statistics
```
GET    /admin/stats/system
       Response: { totalUsers, totalWorkouts, totalXP }

GET    /admin/stats/dashboard
       Response: { metrics, charts }

GET    /admin/stats/user/:userId
       Response: { userStats }
```

### User Management
```
GET    /admin/users
       Query: { page, limit, search }
       Response: { users[] }

DELETE /admin/users/:userId
       Response: { deleted soft }

POST   /admin/users/:userId/promote-admin
       Response: { promoted }
```

---

## 🔔 NOTIFICATIONS MODULE (5 endpoints)

### Notifications
```
GET    /notifications
       Response: { notifications[] }

GET    /notifications/unread-count
       Response: { unreadCount }

POST   /notifications/:id/read
       Response: { marked read }

POST   /notifications/read-all
       Response: { all marked read }

DELETE /notifications/:id
       Response: { deleted }
```

---

## 📊 SUMMARY

```
Auth:           8 endpoints ✅
Users:          5 endpoints ✅
Fitness:        46+ endpoints ✅
Game:           57+ endpoints ✅
Payments:       13+ endpoints ✅
Economy:        8+ endpoints ✅
Social:         5 endpoints ✅
Admin:          6 endpoints ✅
Notifications:  5 endpoints ✅

────────────────────────────
TOTAL:          110+ endpoints ✅
```

---

## 🔑 Authentication

All endpoints (except @Public marked) require:
```
Headers: Authorization: Bearer {accessToken}
```

---

## 📘 Response Format

Success:
```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Success"
}
```

Error:
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "BadRequestException"
}
```

---

**Complete FitQuest Backend API Documentation**

Generated: Julio 26, 2025  
Status: MVP 100% ✅


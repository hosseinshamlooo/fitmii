# 🏋️‍♂️ **FitMii**

**Your Avatar. Your Goals. Level Up Your Real Life.**

FitMii is a gamified fitness tracker where **you create an avatar that matches your real body** — then watch it evolve as you train. Set goals, pick inspirational physiques, get AI coaching tips, and share your transformation with a supportive community.

---

## 🎯 **Why FitMii?**

- Traditional fitness apps = boring stats.
- FitMii = you see yourself **transform** in real-time.
- Motivation = visual, social, gamified.

---

## ✨ **Core Features**

✅ **Custom Avatar**

- Create an avatar that matches your current height, weight, body fat % and muscle tone.
- Customize hair, skin tone, tattoos, facial hair.
- Compare **Current You** vs **Goal You** side by side.

✅ **Progress Tracking**

- Log workouts, weight, body fat, measurements.
- Avatar morphs to reflect your real progress.
- Visual progress bars show % match to your goal physique.

✅ **Inspiration & AI Coaching**

- Choose inspirational physiques: generic archetypes or community templates.
- Get AI-generated workout & meal suggestions to close the gap.
- Weekly check-ins to adjust targets, get reminders & stay on track.

✅ **Gamified Loop**

- Earn XP for every log.
- Keep streaks alive to unlock avatar cosmetics (gear, clothes).
- Compare progress with friends — who’s closer to their goal?

✅ **Social**

- Share your transformation cards.
- Compete in friendly challenges: “Who gets closest to X physique in 60 days?”
- Like, comment, and motivate others.

---

## 🎨 **Visual Vibe**

- **Theme:** Fresh, clean, modern — like Duolingo + Sims + Strava.
- **Typography:** Montserrat (headings), Inter (body), Share Tech Mono (stats).
- **Color Palette:**
  - Background: `#FFFFFF`
  - Primary: `#007AFF` (blue)
  - Accent: `#00C781` (green)
  - Text: `#222222`
  - Error: `#FF3B30`

---

## 🗂️ **MVP Feature Set**

| Feature                   | Description                       |
| ------------------------- | --------------------------------- |
| ✅ Custom Avatar          | Basic body + face customization   |
| ✅ Static Goal Archetypes | 4–6 preset physique templates     |
| ✅ Manual Workout Log     | Log sets & reps manually          |
| ✅ XP & Streaks           | Streak-based habit tracking       |
| ✅ Progress Tracker       | Input weight, body fat, see morph |
| ✅ Transformation Gallery | Save/share progress               |
| ✅ Weekly AI Check-In     | Basic static plan                 |
| ✅ Basic Groups           | Join a squad, compare progress    |

---

## 📱 **Screens**

1️⃣ **Onboarding:** Create your avatar  
2️⃣ **Dashboard:** XP, streaks, next workout  
3️⃣ **Log Workout:** Tick off sets/reps  
4️⃣ **Progress:** Stats + morph slider  
5️⃣ **Compare:** Current vs Goal  
6️⃣ **Social:** Top transformations  
7️⃣ **Profile:** Streaks, badges, share

---

## ⚙️ **Tech Stack**

| Element                | Details                                              |
| ---------------------- | ---------------------------------------------------- |
| **Frontend**           | React Native (or Expo)                               |
| **Backend**            | Appwrite (Auth, Database, Functions)                 |
| **Avatar**             | Ready Player Me integration _(or custom SVG layers)_ |
| **Push Notifications** | Appwrite Cloud Functions + FCM                       |
| **Storage**            | Appwrite Storage (for images & progress pics)        |
| **Deployment**         | Android (Café Bazaar), optional PWA for iOS          |

---

## 🏗️ **Development Setup**

1. **Clone the Repo**
   ```bash
   git clone https://github.com/yourusername/fitmii.git
   cd fitmii
   ```

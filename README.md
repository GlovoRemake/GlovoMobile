# 📱 Glovo Mobile

> Мобільний застосунок **клієнта** платформи доставки GlovoRemake (iOS / Android), побудований на **Expo** та **React Native**.

![Expo](https://img.shields.io/badge/Expo-57-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![NativeWind](https://img.shields.io/badge/NativeWind-4-38BDF8)

## 📖 Про проєкт

Застосунок для замовників: перегляд закладів, оформлення замовлення, відстеження доставки на карті. Працює з [GlovoAPI](https://github.com/GlovoRemake/GlovoAPI).

<!-- TODO: перелік реальних екранів -->

## ✨ Можливості

<!-- TODO: залиште лише реалізоване -->
- 🔐 Авторизація (`expo-auth-session`, токени в `expo-secure-store`)
- 🏪 Каталог закладів і меню
- 🛒 Кошик та оформлення замовлення
- 📍 Геолокація та карта (`react-native-maps`, `expo-location`)
- ⚡ Статус замовлення в реальному часі (SignalR)
- 🖼️ Завантаження зображень (`expo-image-picker`)

## 🧰 Технологічний стек

| Категорія | Технології |
|---|---|
| Платформа | Expo SDK 57, React Native 0.86, React 19 |
| Навігація | Expo Router (file-based routing), React Navigation |
| Стилі | NativeWind 4 (Tailwind), `@rn-primitives`, `@gorhom/bottom-sheet` |
| Стан | Redux Toolkit |
| Форми | React Hook Form |
| Real-time | `@microsoft/signalr` |
| Анімації | Reanimated 4, Gesture Handler |
| Налагодження | `react-native-network-logger` |
| Мова | TypeScript |

## 🚀 Швидкий старт

### Вимоги

- Node.js 20+
- Android Studio (емулятор) та/або Xcode (iOS-симулятор, лише macOS)
- Запущений [GlovoAPI](https://github.com/GlovoRemake/GlovoAPI)

### Встановлення

```bash
git clone https://github.com/GlovoRemake/GlovoMobile.git
cd GlovoMobile

npm install
cp .env.example .env     # заповніть значення
```

### Запуск

```bash
npm start            # Expo dev server
npm run android      # збірка та запуск на Android
npm run ios          # збірка та запуск на iOS
npm run web          # веб-версія
npm run lint         # перевірка коду
```

> Проєкт використовує `expo-dev-client` та нативні модулі (карти, геолокація), тому основний шлях — **development build** (`npm run android` / `npm run ios`), а не Expo Go.

## ⚙️ Конфігурація

Змінні задаються в `.env` (див. `.env.example`).

| Змінна | Опис |
|---|---|
| `EXPO_PUBLIC_...` | Адреса GlovoAPI <!-- TODO: реальна назва --> |

> Змінні `EXPO_PUBLIC_*` потрапляють у клієнтський бандл — не зберігайте в них секрети.

## 🗂️ Структура

```
├── app/           # Екрани (Expo Router)
├── components/    # UI-компоненти
├── hooks/         # Кастомні хуки
├── lib/           # Допоміжні бібліотеки
├── store/         # Redux store
├── types/         # TypeScript-типи
├── utils/         # Утиліти
├── assets/images/ # Зображення
└── scripts/       # Службові скрипти
```

## 🔗 Екосистема GlovoRemake

| Репозиторій | Призначення |
|---|---|
| [GlovoAPI](https://github.com/GlovoRemake/GlovoAPI) | Backend (ASP.NET Core, .NET 10) |
| [GlovoPartnersFrontend](https://github.com/GlovoRemake/GlovoPartnersFrontend) | Кабінет партнера |
| [GlovoAdmin](https://github.com/GlovoRemake/GlovoAdmin) | Адмін-панель |
| **GlovoMobile** | Застосунок клієнта (цей репозиторій) |
| [GlovoRidersMobile](https://github.com/GlovoRemake/GlovoRidersMobile) | Застосунок кур'єра |

## 🤝 Внесок

1. Fork → гілка `feature/...`
2. `npm run lint` без помилок
3. Pull Request

## 📄 Ліцензія

<!-- TODO: додайте LICENSE -->

> ℹ️ Навчальний / фан-проєкт, **не пов'язаний із Glovo**.

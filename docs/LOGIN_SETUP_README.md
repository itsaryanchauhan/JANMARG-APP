# Login/Signup App with Expo and React Native Reanimated

This project implements a beautiful animated login and signup interface using Expo Router, React Native Reanimated, and NativeWind (Tailwind CSS for React Native).

## Features

- ✨ Smooth entrance animations using React Native Reanimated
- 🎨 Beautiful UI styled with NativeWind (Tailwind CSS)
- 📱 Clean navigation between Login and Signup screens
- 🌙 Animated hanging lamps with different timings
- 📋 Form inputs with proper styling and placeholders
- 🔄 Easy navigation between screens

## Project Structure

```
app/
├── _layout.tsx          # Root layout with Stack navigation (headers hidden)
├── index.tsx           # Redirects to login screen
├── login.tsx           # Login screen with animations
└── signup.tsx          # Signup screen with animations

assets/
└── images/
    ├── background.webp   # Background image placeholder
    └── light.webp        # Hanging lamp image placeholder
```

## Implemented Setup

### 1. Dependencies Installed

- `nativewind` - Tailwind CSS for React Native
- `tailwindcss@3.3.2` - Compatible version of Tailwind CSS
- `@react-navigation/native-stack` - Stack navigation (already had most React Navigation packages)

### 2. Configuration Files

- `tailwind.config.js` - Configured to scan app and screens directories
- `babel.config.js` - Added nativewind/babel plugin before react-native-reanimated

### 3. Routing Setup

- Using Expo Router for navigation
- Stack layout with hidden headers
- Login and Signup screens with proper routing

### 4. UI Implementation

- Login screen with email/password inputs
- Signup screen with username/email/password inputs
- Animated entrance effects for all elements
- Progressive delays for staggered animations
- Proper navigation between screens

## How to Run

1. Make sure you have Expo CLI installed:

   ```bash
   npm install -g @expo/cli
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Use Expo Go app on your phone or run on simulator:
   - Scan QR code with Expo Go (Android) or Camera (iOS)
   - Or press 'i' for iOS simulator
   - Or press 'a' for Android emulator

## Animation Details

The app uses React Native Reanimated's layout animations:

- **FadeInUp**: Used for lamp images and title
- **FadeInDown**: Used for form elements (inputs, buttons, links)
- **Springify**: Adds spring physics to animations
- **Progressive delays**: Creates staggered entrance effects

### Animation Timing

- Lamps: 200ms and 400ms delays
- Title: No delay (appears first)
- Email input: 200ms delay
- Password input: 400ms delay
- Login/Signup button: 600ms delay
- Navigation link: 800ms delay

## Styling

Using NativeWind classes for rapid development:

- `bg-white h-full w-full` - Full screen white background
- `bg-black/5` - Semi-transparent input backgrounds
- `bg-sky-400` - Blue button backgrounds
- `text-white font-bold` - White bold text
- `rounded-2xl` - Rounded corners
- `p-5 mx-5` - Padding and margins

## Assets Needed

Replace the placeholder images in `assets/images/` with:

- `background.webp` - A beautiful gradient or landscape background
- `light.webp` - A hanging lamp or light fixture image

## Next Steps

1. Replace placeholder images with actual design assets
2. Add proper form validation
3. Implement authentication logic
4. Add loading states
5. Connect to backend API
6. Add forgot password functionality
7. Implement proper error handling

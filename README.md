# JANMARG - Community Civic Reporting App 🏙️

**JANMARG** is a comprehensive community-driven civic reporting mobile application built with React Native and Expo. The app empowers citizens to report civic issues, track their resolution status, and collaborate with their community to improve local infrastructure and services.

![JANMARG Logo](./assets/images/JANMARG.png)

## 🌟 Features

### 📱 Core Functionality

- **Report Creation**: Submit detailed civic issue reports with photos, location, and descriptions
- **Community Reports**: View and interact with reports from other community members
- **Map Integration**: Visual representation of reports on interactive maps using Leaflet and OpenStreetMap
- **Real-time Updates**: Track the status of reported issues from submission to resolution
- **User Authentication**: Secure login and signup system with animated UI
- **Onboarding Experience**: Interactive walkthrough for new users with swipeable screens

### 🏗️ Issue Categories

- Broken streetlights
- Road damage and potholes
- Water pipeline issues
- Garbage collection problems
- Traffic congestion
- Overflowing drains
- Bridge damage
- And more civic infrastructure issues

### 🎨 User Experience

- **Intuitive Navigation**: Bottom tab navigation with smooth transitions
- **Animated UI**: Beautiful animations powered by React Native Reanimated
- **Responsive Design**: Tailwind CSS styling with NativeWind for consistent UI
- **Multi-language Support**: Built-in language context for localization
- **Photo Capture**: Integrated camera functionality for issue documentation

## 🛠️ Tech Stack

### Frontend Framework

- **React** 19.1.0 - JavaScript library for user interfaces
- **React Native** 0.81.4 - Cross-platform mobile development
- **Expo** ~54.0.9 - Development platform and tooling
- **TypeScript** ~5.9.2 - Type-safe development

### Navigation & Routing

- **Expo Router** - File-based routing system
- **React Navigation** - Bottom tabs and native stack navigation

### Styling & Animation

- **NativeWind** - Tailwind CSS for React Native
- **React Native Reanimated** - High-performance animations
- **React Native Gesture Handler** - Touch and gesture system

### Maps & Location

- **Leaflet** - Interactive maps via WebView integration
- **OpenStreetMap** - Open-source map tiles and data
- **Expo Location** - Location services and GPS
- **React Native WebView** - Web-based map rendering

### Camera & Media

- **Expo Camera** - Camera functionality
- **Expo Image Picker** - Photo selection from gallery
- **Expo Image** - Optimized image component

### Additional Libraries

- **React Native Super Grid** - Grid layouts for data display
- **React Native Swiper** - Swipeable onboarding and carousel components
- **React Native WebView** - Web content and map integration
- **React Native Worklets** - High-performance JavaScript worklets

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/itsaryanchauhan/JANMARG-APP.git
   cd JANMARG-APP
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   - Configure any additional environment variables as needed
   - No API keys required for OpenStreetMap integration

4. **Start the development server**
   ```bash
   npx expo start
   ```

### Development Options

Choose your preferred development environment:

- **📱 Physical Device**: Scan QR code with Expo Go app
- **🤖 Android Emulator**: Press `a` in terminal or run `npm run android`
- **🍎 iOS Simulator**: Press `i` in terminal or run `npm run ios`
- **🌐 Web Browser**: Press `w` in terminal or run `npm run web`

## 📁 Project Structure

```
├── app/                          # Main application screens
│   ├── screens/                  # Individual screen components
│   │   ├── CreateReportScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── MyReportsScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── SearchScreen.tsx
│   ├── _layout.tsx              # Root layout configuration
│   ├── home.tsx                 # Home screen
│   ├── index.tsx                # Entry point
│   ├── login.tsx                # Login screen
│   ├── onboarding.tsx           # Onboarding flow
│   └── signup.tsx               # Signup screen
├── components/                   # Reusable UI components
│   ├── CreateReportModal.tsx
│   ├── ReportDetailModal.tsx
│   └── ReportMapView.tsx
├── context/                      # React Context providers
│   ├── CommunityReportsContext.tsx
│   ├── LanguageContext.tsx
│   └── ReportsContext.tsx
├── data/                        # Data layer and mock data
│   └── mock/
│       ├── communityReports.ts
│       ├── personalReports.ts
│       └── index.ts
├── navigation/                   # Navigation configuration
│   └── tabs.tsx
├── utils/                       # Utility functions
│   └── logger.ts
├── assets/                      # Static assets
│   ├── images/                  # App images and icons
│   └── icons/                   # Icon assets
└── android/                     # Android-specific configuration
```

## 🎯 Usage

### Creating Reports

1. Open the app and navigate to "Create Report"
2. Fill in the issue details (title, description, category)
3. Take or select a photo of the issue
4. Set the location (automatic or manual)
5. Submit the report for community and authority review

### Viewing Community Reports

1. Browse reports on the Home screen
2. Use the map view to see location-based reports
3. Filter reports by category, status, or area
4. Upvote important issues to increase visibility

### Tracking Progress

1. View your submitted reports in "My Reports"
2. Check status updates and timeline progress
3. Receive notifications on report status changes

## 🔧 Development Scripts

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web

# Lint code
npm run lint

# Reset project (removes example code)
npm run reset-project
```

## 🤝 Contributing

We welcome contributions to JANMARG! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Write tests for new features
- Ensure code passes linting checks
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Aryan Chauhan** - Lead Developer - [@itsaryanchauhan](https://github.com/itsaryanchauhan)

## 📞 Support

For support, issues, or feature requests:

- Create an issue on GitHub
- Contact the development team
- Check the documentation in the `/docs` folder

## 🙏 Acknowledgments

- Expo team for the excellent development platform
- React Native community for continuous improvements
- All contributors who help make JANMARG better
- Local communities who inspire civic engagement

---

Made with ❤️ for better communities and civic engagement.

# Instructions to Remove Camera Permission (Alternative Solution)

If your app doesn't actually need camera access, you can remove it by:

1. Remove from app.json permissions array:

   - "android.permission.CAMERA"
   - "android.permission.RECORD_AUDIO"

2. Remove from plugins:

   - The entire "expo-camera" plugin section

3. Update your image picker to only access gallery:
   - Keep only "expo-image-picker"
   - Remove camera functionality from CreateReportModal.tsx

This would eliminate the privacy policy requirement entirely.

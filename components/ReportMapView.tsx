import React from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

interface Location {
  latitude: number;
  longitude: number;
  address: string;
  area: string;
}

interface ReportMapViewProps {
  location: Location;
  title?: string;
  style?: any;
}

const ReportMapView: React.FC<ReportMapViewProps> = ({
  location,
  title,
  style,
}) => {
  const generateMapHTML = () => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
            body { margin: 0; padding: 0; }
            #map { height: 100vh; width: 100%; }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            var map = L.map('map').setView([${location.latitude}, ${
      location.longitude
    }], 16);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            
            var marker = L.marker([${location.latitude}, ${
      location.longitude
    }]).addTo(map);
            marker.bindPopup('${title || location.address}');
            
            // Disable interactions to match the original behavior
            map.dragging.disable();
            map.touchZoom.disable();
            map.doubleClickZoom.disable();
            map.scrollWheelZoom.disable();
            map.boxZoom.disable();
            map.keyboard.disable();
        </script>
    </body>
    </html>
    `;
  };

  return (
    <View style={[styles.container, style]}>
      <WebView
        source={{ html: generateMapHTML() }}
        style={styles.map}
        scrollEnabled={false}
        scalesPageToFit={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  map: {
    flex: 1,
  },
});

export default ReportMapView;

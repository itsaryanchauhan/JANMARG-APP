import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

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
  const region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.005, // Small delta for precise view
    longitudeDelta: 0.005,
  };

  return (
    <View style={[styles.container, style]}>
      <MapView
        style={styles.map}
        region={region}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={true}
        mapType="standard"
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title={title || location.address}
          description={location.area}
          pinColor="#2E6A56"
        />
      </MapView>
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

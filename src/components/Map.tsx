import "leaflet/dist/leaflet.css";

import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon, Map as LeafletMap } from "leaflet";

import {
  MapContainer,
  MapContainerProps,
  TileLayer,
  TileLayerProps,
} from "react-leaflet";
import { CSSProperties, PropsWithChildren, Ref } from "react";

// From https://stackoverflow.com/a/65549235
const markerIcon = new Icon({ iconUrl: markerIconPng, iconSize: [25, 41] });

type MapProps = {
  mapContainerProps?: Exclude<MapContainerProps, "style">;
  mapContainerStyles?: CSSProperties;
  tileLayerProps?: Partial<TileLayerProps>;
  mapRef?: Ref<LeafletMap>; // to enable external access of underlying Map instance
};

function Map({
  mapContainerProps,
  mapContainerStyles,
  tileLayerProps,
  mapRef,
  children,
}: PropsWithChildren<MapProps>) {
  return (
    <MapContainer
      style={{ height: "500px", borderRadius: "10px", ...mapContainerStyles }}
      scrollWheelZoom={false}
      {...mapContainerProps}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        {...tileLayerProps}
      />
      {children}
    </MapContainer>
  );
}

export default Map;
export { markerIcon };

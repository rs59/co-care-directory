import "leaflet/dist/leaflet.css";

import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon, LeafletEventHandlerFnMap, Map as LeafletMap } from "leaflet";

import {
  MapContainer,
  MapContainerProps,
  TileLayer,
  TileLayerProps,
  useMapEvents,
} from "react-leaflet";
import { CSSProperties, PropsWithChildren, Ref } from "react";

import mapMarkerPng from "../images/map-marker.png";
import mapMarkerActivePng from "../images/map-marker-active.png";

const markerIcon = new Icon({ iconUrl: mapMarkerPng });
const markerActiveIcon = new Icon({ iconUrl: mapMarkerActivePng });
// From https://stackoverflow.com/a/65549235

function MapEvents({
  eventHandlers,
}: {
  eventHandlers: LeafletEventHandlerFnMap;
}) {
  useMapEvents(eventHandlers);
  return null;
}

type MapProps = {
  mapContainerProps?: Exclude<MapContainerProps, "style">;
  mapContainerStyles?: CSSProperties;
  tileLayerProps?: Partial<TileLayerProps>;
  mapRef?: Ref<LeafletMap>; // to enable external access of underlying Map instance
  eventHandlers?: LeafletEventHandlerFnMap;
};

function Map({
  mapContainerProps,
  mapContainerStyles,
  tileLayerProps,
  mapRef,
  eventHandlers = {},
  children,
}: PropsWithChildren<MapProps>) {
  return (
    <MapContainer
      style={{ height: "500px", borderRadius: "10px", ...mapContainerStyles }}
      scrollWheelZoom={false}
      {...mapContainerProps}
      ref={mapRef}
    >
      <MapEvents eventHandlers={eventHandlers} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        {...tileLayerProps}
      />
      {children}
    </MapContainer>
  );
}

export default Map;
export { markerIcon, markerActiveIcon };

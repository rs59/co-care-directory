import {
  LatLngBounds,
  LeafletMouseEventHandlerFn,
  Map as LeafletMap,
} from "leaflet";
import { Ref, PropsWithChildren } from "react";
import Map from "../Map";

export type ResultsMapProps = {
  bounds: LatLngBounds;
  mapRef?: Ref<LeafletMap>;
  isMobile?: boolean;
  onClick?: LeafletMouseEventHandlerFn;
};

function ResultsMap({
  bounds,
  mapRef,
  isMobile = false,
  onClick,
  children,
}: PropsWithChildren<ResultsMapProps>) {
  return (
    <Map
      mapContainerProps={{
        bounds,
        boundsOptions: { padding: [10, 10] },
        zoomSnap: 0.5,
        zoomDelta: 0.5,
      }}
      mapContainerStyles={{
        height: isMobile ? "300px" : "100vh",
      }}
      mapRef={mapRef}
      eventHandlers={{ click: onClick }}
    >
      {children}
    </Map>
  );
}

export default ResultsMap;

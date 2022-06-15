import 'leaflet/dist/leaflet.css';

import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon, LatLngLiteral} from 'leaflet'

import { MapContainer, MapContainerProps, Marker, Popup, TileLayer, TileLayerProps } from "react-leaflet";

function Map({ mapContainerProps, tileLayerProps, markerData } :
  { 
    mapContainerProps: MapContainerProps,
    tileLayerProps : TileLayerProps,
    markerData: { [key: string]: LatLngLiteral}
  }
) {

  return (
    <MapContainer style={{ height: '500px' }} zoom={7} {...mapContainerProps}>
      <TileLayer {...tileLayerProps} />
      {Object.entries(markerData).map(([zip, latlng]) =>
        // From https://stackoverflow.com/a/65549235
        <Marker icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41]})} position={latlng} key={zip}>
          <Popup>
            Center for {zip}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  )
}

export default Map;
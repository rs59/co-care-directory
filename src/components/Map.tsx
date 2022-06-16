import 'leaflet/dist/leaflet.css';

import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'

import { MapContainer, MapContainerProps, TileLayer, TileLayerProps } from "react-leaflet";
import { PropsWithChildren } from 'react';

// From https://stackoverflow.com/a/65549235
const markerIcon = new Icon({iconUrl: markerIconPng, iconSize: [25, 41]});

type TileMapProps = {
  mapContainerProps: MapContainerProps,
  tileLayerProps : TileLayerProps,
}

function TileMap({ mapContainerProps, tileLayerProps, children } : PropsWithChildren<TileMapProps>) {

  return (
    <MapContainer style={{ height: '500px' }} scrollWheelZoom={false} zoom={7} {...mapContainerProps}>
      <TileLayer {...tileLayerProps} />
      {children}
    </MapContainer>
  )
}

export default TileMap;
export { markerIcon }
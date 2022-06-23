import { GridContainer } from "@trussworks/react-uswds";
import { LatLngLiteral } from "leaflet";
import { Marker, Popup } from "react-leaflet";

import TileMap, { markerIcon } from "../components/Map";
import zipToLatLong from "../data/colorado_zip_latlong.json";
import { useTranslation } from "react-i18next";

function MapDemo() {
  const { t } = useTranslation();
  const CO_CENTER: LatLngLiteral = { lat: 39.113014, lng: -105.358887 };
  return (
    <GridContainer>
      <h1>{t("pages.mapdemo.heading")}</h1>
      <p>{t("pages.mapdemo.description")}</p>
      <TileMap
        tileLayerProps={{
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        }}
        mapContainerProps={{ center: CO_CENTER }}
      >
        {Object.entries(zipToLatLong).map(([zip, latlng]) => (
          <Marker icon={markerIcon} position={latlng} key={zip}>
            <Popup>Center for {zip}</Popup>
          </Marker>
        ))}
      </TileMap>

      <h2>Google Maps</h2>
      <TileMap
        tileLayerProps={{
          url: "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
          subdomains: ["mt0", "mt1", "mt2", "mt3"],
        }}
        mapContainerProps={{ center: CO_CENTER }}
      >
        {Object.entries(zipToLatLong).map(([zip, latlng]) => (
          <Marker icon={markerIcon} position={latlng} key={zip}>
            <Popup>Center for {zip}</Popup>
          </Marker>
        ))}
      </TileMap>
    </GridContainer>
  );
}

export default MapDemo;

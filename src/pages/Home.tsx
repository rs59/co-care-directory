import { Button, Grid, GridContainer, } from "@trussworks/react-uswds";
import Map from '../components/Map';
import zipToLatLong from "../data/colorado_zip_latlong.json";
import { LatLngLiteral } from "leaflet";
import { useTranslation } from "react-i18next";

function Home() {
  const { t, i18n } = useTranslation();
  const CO_CENTER: LatLngLiteral = { lat: 39.113014, lng: -105.358887 };
  return (
    <GridContainer>
      <Grid row >
        <Grid col={2}><p>Current language: {i18n.language}</p></Grid>
        <Grid>
          <Button
            type="button"
            onClick={() => {
              if (i18n.language === 'en') i18n.changeLanguage('es');
              else i18n.changeLanguage('en');
            }
            }>Change language
          </Button>
        </Grid>
      </Grid>

      <h1>{t('home.heading')}</h1>
      <p>{t('home.description')}</p>
      <h2>Open Street Maps</h2>
      <Map
        tileLayerProps={{ url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }}
        mapContainerProps={{ center: CO_CENTER }}
        markerData={zipToLatLong}
      />

      <h2>Google Maps</h2>
      <Map
        tileLayerProps={{ url: "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }}
        mapContainerProps={{ center: CO_CENTER }}
        markerData={zipToLatLong}
      />

    </GridContainer>
  )
}

export default Home;
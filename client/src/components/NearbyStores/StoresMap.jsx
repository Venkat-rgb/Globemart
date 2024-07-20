import { memo } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Polyline,
  Tooltip,
} from "react-leaflet";

const StoresMap = ({ userCoordinates, storeInfo }) => {
  const userPositions = [userCoordinates?.latitude, userCoordinates?.longitude];

  // Storing userCoordinates and storeCoordinates in array
  const polyLine = storeInfo && [userPositions, storeInfo?.coordinates];

  //   <MapContainer
  //   center={[userCoordinates?.latitude, userCoordinates?.longitude]}
  //   zoom={13}
  //   scrollWheelZoom={true}
  //   style={{ height: matches ? "40vh" : "90vh", width: "100%" }}
  //   zoomAnimation={true}
  // >

  // Displaying Map
  return (
    <MapContainer
      center={[userCoordinates?.latitude, userCoordinates?.longitude]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
      zoomAnimation={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* If user selects particular store then only we display polyLine on map */}
      {polyLine && (
        <Polyline
          pathOptions={{ color: "black", opacity: 0.7, weight: 6 }}
          positions={polyLine}
        >
          <Tooltip sticky className="font-inter font-semibold">
            {storeInfo?.distance} KM
          </Tooltip>
        </Polyline>
      )}

      {/* Default Marker of user's location */}
      <Marker
        position={[userCoordinates?.latitude, userCoordinates?.longitude]}
      >
        <Tooltip permanent className="font-inter font-semibold">
          Your Location!
        </Tooltip>
      </Marker>

      {/* Displaying store marker only when user selects particular store */}
      {polyLine && (
        <Marker
          position={[storeInfo?.coordinates[0], storeInfo?.coordinates[1]]}
        >
          <Tooltip permanent className="font-inter font-semibold">
            {storeInfo?.name}
          </Tooltip>
        </Marker>
      )}
    </MapContainer>
  );
};

export default memo(StoresMap);

import { memo, useMemo } from "react";
import { MapContainer, TileLayer, Polyline, Tooltip } from "react-leaflet";
import StoreMarkers from "./StoreMarkers";

const StoresMap = ({ userCoordinates, storeInfo }) => {
  // Memoizing userLocation
  const userPositions = useMemo(
    () => [userCoordinates?.latitude, userCoordinates?.longitude],
    [userCoordinates?.latitude, userCoordinates?.longitude]
  );

  // Memoizing storeLocation
  const storeLocation = useMemo(
    () => [storeInfo?.coordinates[0], storeInfo?.coordinates[1]],
    [storeInfo?.coordinates[0], storeInfo?.coordinates[1]]
  );

  // Storing userCoordinates and storeCoordinates in array
  const polyLine = storeInfo && [userPositions, storeInfo?.coordinates];

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

      {/* Displaying the user location and store location markers */}
      <StoreMarkers
        userLocationCoordinates={userPositions}
        storeLocationCoordinates={storeLocation}
        storeName={storeInfo?.storeName}
      />
    </MapContainer>
  );
};

export default memo(StoresMap);

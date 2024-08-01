import { memo, useEffect } from "react";
import { Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";

const StoreMarkers = ({
  userLocationCoordinates,
  storeLocationCoordinates,
  storeName,
}) => {
  // Initializing map instance
  const map = useMap();

  // Handling the case where latitude and longitude and can be 0,0 (or) undefined, undefined
  const handleEquatorCondition =
    storeLocationCoordinates[0] !== null &&
    storeLocationCoordinates[0] !== undefined &&
    storeLocationCoordinates[1] !== null &&
    storeLocationCoordinates[1] !== undefined;

  // Centering the map in such a way that both markers are visible
  // We want to fit the bounds only when store location changes
  useEffect(() => {
    // Fitting the markers on map even if the latitude and longitude is (0, 0) which is Equator
    if (handleEquatorCondition) {
      const requiredLocationToGo = L.latLngBounds([
        userLocationCoordinates,
        storeLocationCoordinates,
      ]);

      // Making the map to fit these 2 marker locations
      map.fitBounds(requiredLocationToGo);
    }
  }, [storeLocationCoordinates[0], storeLocationCoordinates[1]]);

  return (
    <>
      {/* Default Marker of user's location */}
      <Marker position={userLocationCoordinates}>
        <Tooltip permanent className="font-inter font-semibold">
          Your Location!
        </Tooltip>
      </Marker>

      {/* Displaying store marker only when user selects particular store */}
      {handleEquatorCondition && (
        <Marker position={storeLocationCoordinates}>
          <Tooltip permanent className="font-inter font-semibold">
            {storeName}
          </Tooltip>
        </Marker>
      )}
    </>
  );
};

export default memo(StoreMarkers);

import React, { useContext, useCallback } from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-elements";
import Map from "../components/Map";
import { SafeAreaView, withNavigationFocus } from "react-navigation";
import useLocation from "../hooks/useLocation";
// import "../_mockLocation";
import TrackFrom from "../components/TrackForm";

import { Context as LocationContext } from "../context/LocationContext";

const TrackCreateScreen = ({ isFocused }) => {
  const { state:{recording}, addLocation } = useContext(LocationContext);
  const callback = useCallback(
    location => {
      addLocation(location, recording);
    },
    [recording]
  );
  const [err] = useLocation(isFocused || recording, callback);

  return (
    <SafeAreaView forceInset={{ top: "always" }}>
      <Text h2>Create a Track</Text>
      <Map />
      {err ? <Text>Please enable location services</Text> : null}
      <TrackFrom></TrackFrom>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({});
export default withNavigationFocus(TrackCreateScreen);

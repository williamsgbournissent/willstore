import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../global/colors";
import { Feather } from "@expo/vector-icons";

const DefaultImage = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      <Feather name="image" size={50} color={colors.mediumGray} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
});

export default DefaultImage;

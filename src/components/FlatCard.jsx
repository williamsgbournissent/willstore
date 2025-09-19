import { StyleSheet, View, Dimensions } from "react-native";
import { colors } from "../global/colors";

const { width } = Dimensions.get("window");

const FlatCard = ({ children, style }) => {
  return <View style={{ ...styles.container, ...style }}>{children}</View>;
};

export default FlatCard;

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: colors.white,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    width: width - 32,
    minHeight: 100,
    elevation: 4,
    shadowColor: colors.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
});

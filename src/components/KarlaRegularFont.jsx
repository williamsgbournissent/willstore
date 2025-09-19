import { Text } from "react-native";

const KarlaRegularText = ({ children, style }) => {
  return (
    <Text style={{ fontFamily: "Karla-Regular", ...style }}>{children}</Text>
  );
};

export default KarlaRegularText;

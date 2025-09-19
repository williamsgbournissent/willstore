import { StyleSheet, Text, View, Pressable } from "react-native";
import { colors } from "../global/colors";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import { clearSession } from "../db";
import { clearUser } from "../store/slices/userSlice";
import { useDispatch } from "react-redux";

const Header = ({ title, subtitle }) => {
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();

  const dispatch = useDispatch();

  const handleClearSession = async () => {
    try {
      dispatch(clearUser());
      await clearSession();
    } catch {
      console.log("Hubo un error al limpiar la sesión");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.iconsContainer}>
        <View>
          {canGoBack && (
            <Pressable onPress={() => navigation.goBack()}>
              <Icon name="arrow-left-circle" size={32} color={colors.white} />
            </Pressable>
          )}
        </View>
        <Pressable style={styles.logout} onPress={handleClearSession}>
          <Icon name="log-out" size={32} color={colors.white} />
        </Pressable>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    height: 160,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    color: colors.white,
    fontFamily: "PressStart2P-Regular",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.lightGray,
    textAlign: "center",
    fontFamily: "Karla-Regular",
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 10,
  },
  logout: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 5,
  },
});

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Dimensions,
  Switch,
  ActivityIndicator,
  Alert,
} from "react-native";
import { colors } from "../../global/colors";
import { useEffect, useState } from "react";
import { useLoginMutation } from "../../services/authApi";
import { useDispatch } from "react-redux";
import { setUserEmail, setLocalId } from "../../store/slices/userSlice";
import { saveSession, clearSession } from "../../db";

const textInputWidth = Dimensions.get("window").width * 0.7;

const LoginScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [persistSession, setPersistSession] = useState(false);
  const [triggerLogin, result] = useLoginMutation();

  const dispatch = useDispatch();

  const onsubmit = () => {
    // Validación básica
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    console.log("Intentando iniciar sesión con:", { email, password });
    triggerLogin({ email, password });
  };

  useEffect(() => {
    const handleLoginResult = async () => {
      console.log("Estado de login:", result.status);

      if (result.isSuccess) {
        try {
          console.log("Login exitoso con datos:", result.data);

          if (persistSession) {
            console.log("Guardando sesión...");
            await saveSession(result.data.localId, result.data.email);
          } else {
            console.log("Limpiando sesión anterior...");
            await clearSession();
          }

          dispatch(setUserEmail(result.data.email));
          dispatch(setLocalId(result.data.localId));
        } catch (error) {
          console.log("Error al guardar sesión:", error);
          Alert.alert("Error", "Hubo un problema al iniciar sesión");
        }
      } else if (result.isError) {
        console.log("Error de login:", result.error);
        Alert.alert("Error", "Credenciales incorrectas");
      }
    };

    if (result.status === "fulfilled" || result.isError) {
      handleLoginResult();
    }
  }, [result]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Willstore</Text>
      <Text style={styles.subTitle}>Inicia sesión</Text>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholderTextColor={colors.mediumGray}
          placeholder="Email"
          style={styles.textInput}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholderTextColor={colors.mediumGray}
          placeholder="Contraseña"
          style={styles.textInput}
          secureTextEntry
        />
      </View>

      {result.isError && (
        <Text style={styles.error}>
          {result.error?.data?.error?.message === "EMAIL_NOT_FOUND" ||
          result.error?.data?.error?.message === "INVALID_PASSWORD"
            ? "Email o contraseña incorrectos"
            : "Error al iniciar sesión"}
        </Text>
      )}

      <View style={styles.footTextContainer}>
        <Text style={styles.whiteText}>¿No tienes una cuenta?</Text>
        <Pressable onPress={() => navigation.navigate("Signup")}>
          <Text
            style={{
              ...styles.whiteText,
              ...styles.underLineText,
            }}
          >
            Crea una
          </Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.btn}
        onPress={onsubmit}
        disabled={result.isLoading}
      >
        {result.isLoading ? (
          <ActivityIndicator color={colors.darkGray} />
        ) : (
          <Text style={styles.btnText}>Iniciar sesión</Text>
        )}
      </Pressable>
      <View style={styles.rememberMe}>
        <Text style={{ color: colors.white }}>¿Mantener sesión iniciada?</Text>
        <Switch
          onValueChange={() => setPersistSession(!persistSession)}
          value={persistSession}
          trackColor={{ false: "#767577", true: colors.accent }}
        />
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  title: {
    color: colors.white,
    fontFamily: "PressStart2P",
    fontSize: 28,
    marginBottom: 10,
  },
  subTitle: {
    fontFamily: "Karla-Bold",
    fontSize: 18,
    color: colors.lightGray,
    letterSpacing: 1,
  },
  inputContainer: {
    gap: 16,
    margin: 16,
    marginTop: 48,
    alignItems: "center",
  },
  textInput: {
    padding: 12,
    paddingLeft: 16,
    borderRadius: 8,
    backgroundColor: colors.secondary,
    width: textInputWidth,
    color: colors.white,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  footTextContainer: {
    flexDirection: "row",
    gap: 8,
  },
  whiteText: {
    color: colors.white,
  },
  underLineText: {
    textDecorationLine: "underline",
    color: colors.accent,
  },
  strongText: {
    fontWeight: "900",
    fontSize: 16,
  },
  btn: {
    padding: 14,
    paddingHorizontal: 32,
    backgroundColor: colors.accent,
    borderRadius: 8,
    marginTop: 32,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  btnText: {
    color: colors.darkGray,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  error: {
    padding: 16,
    backgroundColor: colors.error,
    borderRadius: 8,
    color: colors.white,
  },
  rememberMe: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
  },
});

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Dimensions,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../global/colors";
import { useState, useEffect } from "react";
import { useSignupMutation } from "../../services/authApi";
import { saveSession } from "../../db";
import { useDispatch } from "react-redux";
import { setUserEmail, setLocalId } from "../../store/slices/userSlice";

const textInputWidth = Dimensions.get("window").width * 0.7;

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [triggerSignup, result] = useSignupMutation();

  const dispatch = useDispatch();

  const onSubmit = () => {
    // Reset error
    setError("");

    // Basic validations
    if (!email.includes("@") || !email.includes(".")) {
      setError("Por favor ingresa un email válido");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // All validations passed, proceed with signup
    triggerSignup({ email, password });
  };

  // Handle signup result
  useEffect(() => {
    const handleSignupResult = async () => {
      if (result.isSuccess) {
        console.log("Registro exitoso:", result.data);
        try {
          // Save session in SQLite database
          await saveSession(result.data.localId, email);

          // Update Redux state
          dispatch(setUserEmail(email));
          dispatch(setLocalId(result.data.localId));

          // Show success message
          Alert.alert(
            "¡Registro exitoso!",
            "Tu cuenta ha sido creada correctamente",
            [{ text: "OK" }]
          );
        } catch (err) {
          console.log("Error guardando sesión:", err);
          Alert.alert(
            "Error",
            "Tu cuenta fue creada pero hubo un problema al iniciar sesión automáticamente"
          );
        }
      }
    };

    if (result.isSuccess) {
      handleSignupResult();
    }
  }, [result.isSuccess]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Willstore</Text>
        <Text style={styles.subTitle}>Crear cuenta</Text>

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
          <TextInput
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
            placeholderTextColor={colors.mediumGray}
            placeholder="Confirmar contraseña"
            style={styles.textInput}
            secureTextEntry
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {result.isError && (
          <Text style={styles.error}>
            {result.error.data?.error?.message === "EMAIL_EXISTS"
              ? "El email ya está registrado"
              : "Ocurrió un error durante el registro"}
          </Text>
        )}

        <View style={styles.footTextContainer}>
          <Text style={styles.whiteText}>¿Ya tienes una cuenta?</Text>
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text style={{ ...styles.whiteText, ...styles.underLineText }}>
              Inicia sesión
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.btn}
          onPress={onSubmit}
          disabled={result.isLoading}
        >
          {result.isLoading ? (
            <ActivityIndicator color={colors.darkGray} />
          ) : (
            <Text style={styles.btnText}>Crear cuenta</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    padding: 20,
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
    marginBottom: 20,
  },
  inputContainer: {
    gap: 16,
    margin: 16,
    alignItems: "center",
    width: "100%",
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
    marginTop: 20,
  },
  whiteText: {
    color: colors.white,
  },
  underLineText: {
    textDecorationLine: "underline",
    color: colors.accent,
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
    minWidth: textInputWidth * 0.7,
    alignItems: "center",
  },
  btnText: {
    color: colors.darkGray,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  error: {
    padding: 12,
    backgroundColor: colors.error,
    borderRadius: 8,
    color: colors.white,
    marginTop: 10,
    width: textInputWidth,
    textAlign: "center",
  },
});

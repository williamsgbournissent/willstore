import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Pressable,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useDispatch } from "react-redux";
import { setCategorySelected } from "../../store/slices/shopSlice";
import { useGetCategoriesQuery } from "../../services/shopApi";
import { colors } from "../../global/colors";
import Icon from "react-native-vector-icons/Feather";

const { width } = Dimensions.get("window");

const CategoriesScreen = ({ navigation }) => {
  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useGetCategoriesQuery();

  const dispatch = useDispatch();

  const handleSelectCategory = (category) => {
    dispatch(setCategorySelected(category));
    navigation.navigate("Productos");
  };

  // Nuevas imágenes de alta calidad para categorías
  const categoryImages = {
    Televisores:
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-4.0.3&q=80&w=2070&auto=format&fit=crop",
    Smartphones:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&q=80&w=2127&auto=format&fit=crop",
    Notebooks:
      "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?ixlib=rb-4.0.3&q=80&w=2074&auto=format&fit=crop",
    Electrodomésticos:
      "https://images.unsplash.com/photo-1630459065585-25f678e779a5?ixlib=rb-4.0.3&q=80&w=2070&auto=format&fit=crop",
    Audio:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-4.0.3&q=80&w=2065&auto=format&fit=crop",
    Gaming:
      "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?ixlib=rb-4.0.3&q=80&w=2071&auto=format&fit=crop",
  };

  // Íconos para categorías
  const categoryIcons = {
    Televisores: "monitor",
    Smartphones: "smartphone",
    Notebooks: "laptop",
    Electrodomésticos: "home",
    Audio: "headphones",
    Gaming: "controller",
  };

  const renderCategoryItem = ({ item }) => {
    return (
      <Pressable
        style={styles.categoryItem}
        onPress={() => handleSelectCategory(item.title)}
        android_ripple={{ color: "rgba(0,0,0,0.1)" }}
      >
        <ImageBackground
          source={{ uri: categoryImages[item.title] || item.image }}
          style={styles.categoryBackground}
          imageStyle={styles.categoryBackgroundImage}
          onError={(e) =>
            console.log(
              "Error cargando imagen:",
              e.nativeEvent.error,
              "URL:",
              categoryImages[item.title] || item.image
            )
          }
        >
          <View style={styles.categoryContent}>
            <View style={styles.iconContainer}>
              <Icon
                name={categoryIcons[item.title] || "box"}
                size={28}
                color={colors.white}
              />
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Icon name="chevron-right" size={24} color={colors.white} />
          </View>
        </ImageBackground>
      </Pressable>
    );
  };

  if (isLoading) {
    console.log("Cargando categorías...");
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loaderText}>Cargando categorías...</Text>
      </View>
    );
  }

  if (error) {
    console.log("Error al cargar categorías:", error);
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={50} color={colors.error} />
        <Text style={styles.errorText}>
          Ocurrió un error al cargar las categorías
        </Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  console.log("Categories data:", categories);

  return (
    <View style={styles.container}>
      <FlatList
        data={categories || []}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  list: {
    padding: 8,
  },
  categoryItem: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  categoryBackground: {
    height: 120,
    width: width - 32,
    justifyContent: "center",
  },
  categoryBackgroundImage: {
    opacity: 0.8,
    borderRadius: 12,
  },
  categoryContent: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20,
    height: "100%",
  },
  iconContainer: {
    backgroundColor: colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "Karla-Bold",
    fontSize: 20,
    color: colors.white,
    flex: 1,
    marginLeft: 16,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.lightGray,
  },
  loaderText: {
    marginTop: 16,
    fontFamily: "Karla-Regular",
    color: colors.primary,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.lightGray,
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontFamily: "Karla-Regular",
    color: colors.darkGray,
    fontSize: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: colors.white,
    fontFamily: "Karla-Bold",
  },
});

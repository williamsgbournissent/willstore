import {
  View,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import Search from "../../components/Search";
import { useSelector, useDispatch } from "react-redux";
import { setProductSelected } from "../../store/slices/shopSlice";
import { colors } from "../../global/colors";
import Icon from "react-native-vector-icons/Feather";
import productsData from "../../data/products.json";

const { width } = Dimensions.get("window");
const cardWidth = width / 2 - 24;

const ProductsScreen = ({ navigation, route }) => {
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productsFilteredByCategory, setProductsFilteredByCategory] = useState(
    []
  );

  const category = useSelector((state) => state.shopReducer.categorySelected);

  const dispatch = useDispatch();

  const handleSelectProduct = (product) => {
    dispatch(setProductSelected(product));
    navigation.navigate("Producto");
  };

  // Nuevas imágenes de alta calidad para productos por categoría
  const productImages = {
    televisores: {
      default:
        "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?q=80&w=1974&auto=format&fit=crop",
    },
    smartphones: {
      default:
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2127&auto=format&fit=crop",
    },
    notebooks: {
      default:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop",
    },
    electrodomésticos: {
      default:
        "https://images.unsplash.com/photo-1583241475880-083f84372725?q=80&w=1780&auto=format&fit=crop",
    },
    audio: {
      default:
        "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?q=80&w=1964&auto=format&fit=crop",
    },
    gaming: {
      default:
        "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=2071&auto=format&fit=crop",
    },
  };

  const renderProductsItem = ({ item }) => {
    // Seleccionar una imagen mejorada o usar la del producto
    const productImage =
      productImages[category.toLowerCase()]?.default || item.images?.[0];

    return (
      <Pressable
        style={styles.productCard}
        onPress={() => handleSelectProduct(item)}
        android_ripple={{ color: "rgba(0,0,0,0.05)" }}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: productImage }}
            style={styles.productImage}
            resizeMode="cover"
          />
          {item.discountPercentage > 0 && (
            <View style={styles.discountTag}>
              <Text style={styles.discountText}>
                {Math.round(item.discountPercentage)}% OFF
              </Text>
            </View>
          )}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
          {item.rating >= 4.5 && (
            <View style={styles.ratingContainer}>
              <Icon name="star" size={12} color={colors.accent} />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          )}
          <View style={styles.stockContainer}>
            {item.stock > 0 ? (
              <Text style={styles.stockText}>Disponible</Text>
            ) : (
              <Text style={[styles.stockText, styles.outOfStock]}>Agotado</Text>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  useEffect(() => {
    // Simular tiempo de carga
    setIsLoading(true);

    try {
      // Convertir el objeto de productos a un array
      const productsArray = Object.values(productsData);

      // Filtrar productos por categoría
      const filtered = productsArray.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );

      setProductsFilteredByCategory(filtered);
      setError(null);
    } catch (err) {
      setError("Error al cargar los productos");
      console.error(err);
    } finally {
      // Simular tiempo de carga de red
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [category]);

  useEffect(() => {
    if (!productsFilteredByCategory) return;

    if (keyword) {
      const productsFilteredByKeyword = productsFilteredByCategory.filter(
        (product) => product.title.toLowerCase().includes(keyword.toLowerCase())
      );
      setProductsFiltered(productsFilteredByKeyword);
    } else {
      setProductsFiltered(productsFilteredByCategory);
    }
  }, [category, keyword, productsFilteredByCategory]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loaderText}>Cargando productos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={50} color={colors.error} />
        <Text style={styles.errorText}>
          Ocurrió un error al cargar los productos
        </Text>
        <Pressable
          style={styles.retryButton}
          onPress={() => {
            // Volver a cargar los productos
            setIsLoading(true);
            try {
              const productsArray = Object.values(productsData);
              const filtered = productsArray.filter(
                (product) =>
                  product.category.toLowerCase() === category.toLowerCase()
              );
              setProductsFilteredByCategory(filtered);
              setError(null);
            } catch (err) {
              setError("Error al cargar los productos");
            } finally {
              setTimeout(() => {
                setIsLoading(false);
              }, 500);
            }
          }}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Search setKeyword={setKeyword} />
      {productsFiltered?.length > 0 ? (
        <FlatList
          data={productsFiltered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductsItem}
          numColumns={2}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.noProductsContainer}>
          <Icon name="box" size={50} color={colors.mediumGray} />
          <Text style={styles.noProductsText}>
            No hay productos disponibles
          </Text>
        </View>
      )}
    </View>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  productsList: {
    padding: 12,
  },
  productCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    margin: 6,
    width: cardWidth,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  discountTag: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: "Karla-Bold",
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontFamily: "Karla-Bold",
    fontSize: 14,
    marginBottom: 6,
    height: 40,
  },
  productPrice: {
    fontFamily: "Karla-Bold",
    fontSize: 16,
    color: colors.primary,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  ratingText: {
    fontFamily: "Karla-Regular",
    fontSize: 12,
    color: colors.darkGray,
    marginLeft: 4,
  },
  stockContainer: {
    marginTop: 4,
  },
  stockText: {
    fontFamily: "Karla-Regular",
    fontSize: 12,
    color: colors.success,
  },
  outOfStock: {
    color: colors.error,
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
  noProductsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noProductsText: {
    fontFamily: "Karla-Regular",
    fontSize: 16,
    color: colors.darkGray,
    marginTop: 16,
    textAlign: "center",
  },
});

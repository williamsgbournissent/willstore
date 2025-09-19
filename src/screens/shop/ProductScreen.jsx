import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { colors } from "../../global/colors";
import { useSelector, useDispatch } from "react-redux";
import { addItemTocart } from "../../store/slices/cartSlice";
import { Feather } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useGetProductsByCategoryQuery } from "../../services/shopApi";

const ProductScreen = () => {
  const product = useSelector((state) => state.shopReducer.productSelected);
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Imagen predeterminada de alta calidad para productos
  const defaultImage =
    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=2068&auto=format&fit=crop";

  useEffect(() => {
    // Si hay una imagen principal, úsala, de lo contrario usa la primera imagen disponible
    if (product) {
      setSelectedImage(
        product.mainImage || product.images?.[0] || defaultImage
      );
      setIsLoading(false);
    }
  }, [product]);

  const increaseQuantity = () => {
    if (quantity < (product.stock || 10)) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    dispatch(addItemTocart({ product: product, quantity: quantity }));
    // Feedback para el usuario
    alert(
      `${quantity} ${quantity > 1 ? "unidades" : "unidad"} de ${
        product.title
      } agregado al carrito`
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.productContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: selectedImage }}
          style={styles.productImage}
          resizeMode="contain"
        />
        {product.discountPercentage > 0 && (
          <View style={styles.discount}>
            <Text style={styles.discountText}>
              -{Math.round(product.discountPercentage)}%
            </Text>
          </View>
        )}
      </View>

      {product.images && product.images.length > 1 && (
        <FlatList
          data={product.images}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.thumbnailsContainer}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.thumbnailWrapper,
                selectedImage === item && styles.selectedThumbnail,
              ]}
              onPress={() => setSelectedImage(item)}
            >
              <Image
                source={{ uri: item }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            </Pressable>
          )}
        />
      )}

      <View style={styles.infoContainer}>
        <View style={styles.brandContainer}>
          <Text style={styles.textBrand}>{product.brand || "Willstore"}</Text>
          <View style={styles.ratingContainer}>
            <Feather name="star" size={16} color={colors.accent} />
            <Text style={styles.ratingText}>{product.rating || "4.5"}</Text>
          </View>
        </View>

        <Text style={styles.textTitle}>{product.title}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${product.price?.toFixed(2)}</Text>
          {product.discountPercentage > 0 && (
            <Text style={styles.originalPrice}>
              $
              {(product.price * (1 + product.discountPercentage / 100)).toFixed(
                2
              )}
            </Text>
          )}
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.longDescription}>
          {product.description ||
            product.longDescription ||
            "Sin descripción disponible"}
        </Text>

        {product.tags && (
          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>Características</Text>
            <View style={styles.tags}>
              {product.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.stockInfo}>
          <Feather
            name={product.stock > 0 ? "check-circle" : "x-circle"}
            size={20}
            color={product.stock > 0 ? colors.success : colors.error}
          />
          <Text
            style={[
              styles.stockText,
              { color: product.stock > 0 ? colors.success : colors.error },
            ]}
          >
            {product.stock > 0
              ? `${product.stock} unidades disponibles`
              : "Sin stock"}
          </Text>
        </View>

        <View style={styles.quantityContainer}>
          <Text style={styles.sectionTitle}>Cantidad:</Text>
          <View style={styles.quantityControls}>
            <Pressable
              style={[
                styles.quantityButton,
                quantity <= 1 && styles.disabledButton,
              ]}
              onPress={decreaseQuantity}
              disabled={quantity <= 1}
            >
              <Feather
                name="minus"
                size={20}
                color={quantity <= 1 ? colors.mediumGray : colors.darkGray}
              />
            </Pressable>
            <Text style={styles.quantityText}>{quantity}</Text>
            <Pressable
              style={[
                styles.quantityButton,
                quantity >= (product.stock || 10) && styles.disabledButton,
              ]}
              onPress={increaseQuantity}
              disabled={quantity >= (product.stock || 10)}
            >
              <Feather
                name="plus"
                size={20}
                color={
                  quantity >= (product.stock || 10)
                    ? colors.mediumGray
                    : colors.darkGray
                }
              />
            </Pressable>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            { opacity: pressed ? 0.9 : 1 },
            styles.addToCartButton,
            product.stock <= 0 && styles.disabledCartButton,
          ]}
          onPress={handleAddToCart}
          disabled={product.stock <= 0}
        >
          <Feather
            name="shopping-cart"
            size={22}
            color={colors.white}
            style={styles.cartIcon}
          />
          <Text style={styles.textAddToCart}>
            {product.stock > 0 ? "Agregar al carrito" : "Sin stock"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  productContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    backgroundColor: colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 300,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  discount: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: colors.error,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  discountText: {
    color: colors.white,
    fontFamily: "Karla-Bold",
    fontSize: 14,
  },
  thumbnailsContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  thumbnailWrapper: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.lightGray,
    overflow: "hidden",
  },
  selectedThumbnail: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    padding: 16,
  },
  brandContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  textBrand: {
    color: colors.primary,
    fontFamily: "Karla-Bold",
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontFamily: "Karla-Regular",
    color: colors.darkGray,
  },
  textTitle: {
    fontSize: 22,
    fontFamily: "Karla-Bold",
    marginBottom: 12,
    color: colors.darkGray,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontFamily: "Karla-Bold",
    color: colors.primary,
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 18,
    fontFamily: "Karla-Regular",
    color: colors.mediumGray,
    textDecorationLine: "line-through",
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Karla-Bold",
    color: colors.darkGray,
    marginBottom: 8,
  },
  longDescription: {
    fontSize: 15,
    fontFamily: "Karla-Regular",
    lineHeight: 22,
    color: colors.darkGray,
    marginBottom: 16,
  },
  tagsSection: {
    marginVertical: 16,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  tag: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontFamily: "Karla-Regular",
    color: colors.darkGray,
  },
  stockInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  stockText: {
    marginLeft: 8,
    fontFamily: "Karla-Regular",
    fontSize: 14,
  },
  quantityContainer: {
    marginVertical: 16,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  quantityText: {
    fontFamily: "Karla-Bold",
    fontSize: 18,
    color: colors.darkGray,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  addToCartButton: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledCartButton: {
    backgroundColor: colors.mediumGray,
  },
  cartIcon: {
    marginRight: 10,
  },
  textAddToCart: {
    color: colors.white,
    fontFamily: "Karla-Bold",
    fontSize: 18,
  },
});

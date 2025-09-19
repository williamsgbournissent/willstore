import { StyleSheet, TextInput, View, Pressable, Keyboard } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { colors } from "../global/colors";
import { useState } from "react";

const Search = ({ setKeyword }) => {
  const [searchText, setSearchText] = useState("");

  const handleClearSearch = () => {
    setSearchText("");
    setKeyword("");
    Keyboard.dismiss();
  };

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <Icon
          style={styles.searchIcon}
          name="search"
          size={20}
          color={colors.primary}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto"
          placeholderTextColor={colors.mediumGray}
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            setKeyword(text);
          }}
        />
        {searchText.length > 0 && (
          <Pressable onPress={handleClearSearch} style={styles.clearButton}>
            <Icon name="x" size={16} color={colors.mediumGray} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.lightGray,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 46,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Karla-Regular",
    color: colors.darkGray,
    paddingLeft: 8,
    fontSize: 15,
  },
  searchIcon: {
    marginRight: 4,
  },
  clearButton: {
    padding: 6,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
  },
});

import React from "react";
import { Pressable, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { useMenu } from "./useMenu";
import { styles } from "./styles";
import { colors, commonColors } from "@theme/colors";
import { SVGS } from "@assets";
import { MenuCategoryType } from "@appTypes";
import { horizontalScale } from "@utils/scale/scale";
import { ArrowIcon } from "@assets/svgXML";
import { GlobalContext } from "../../../../contexts/global.provider";
import {
  AppLoader,
  AppTextInput,
  Header,
  MenuItemList,
  MenuSubCategoryList,
  RNText,
  RNView,
} from "@components";

const { Backlogo, SearchIcon, CartIcon } = SVGS;

const MenuScreen = () => {
  const contextData = React.useContext(GlobalContext);
  const isRTL = Boolean(contextData?.isRTL);
  const {
    t,
    loading,
    categories,
    items,
    menuItemsWithQuantity,
    totalAddedItems,
    selectedFilter,
    selectedCategory,
    handleBack,
    handleSearch,
    handleOnToggleFilter,
    handleCategorySelection,
    handleAddItem,
    handleRemoveItem,
    handleGoToOrderSummary,
  } = useMenu();

  const renderFoodTypeSwitch = () => {
    const isNonVeg = selectedFilter?.key !== MenuCategoryType.VEG;

    return (
      <RNView style={styles.toggleContainer}>
        <RNText
          style={[
            styles.toggleLabel,
            { color: isNonVeg ? commonColors.red : commonColors.green },
          ]}
        >
          {selectedFilter?.name}
        </RNText>

        <Switch
          value={isNonVeg}
          onValueChange={(value) => handleOnToggleFilter(value)}
          trackColor={{
            false: commonColors.green,
            true: commonColors.red,
          }}
          thumbColor={colors.white}
          ios_backgroundColor={commonColors.green}
          style={styles.toggleSwitch}
        />
      </RNView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {loading && <AppLoader />}

      <Header
        title={t("waiter.menu.foodMenu")}
        leftAction={{
          icon: <Backlogo />,
          onPress: handleBack,
          accessibilityLabel: t("common.back"),
          containerStyle: styles.headerAction,
        }}
        rightSlot={renderFoodTypeSwitch()}
        containerStyle={styles.headerContainer}
        contentStyle={styles.headerContent}
      />

      <RNView style={styles.content}>
        <RNView style={styles.topViewContainer}>
          <AppTextInput
            placeholder={t("waiter.menu.searchPlaceholder")}
            value={""}
            onChangeText={handleSearch}
            leftAccessory={<SearchIcon />}
            containerStyle={styles.searchInputContainer}
            inputContainerStyle={styles.searchInputInner}
            placeholderColor={colors.gray500}
          />
          <MenuSubCategoryList
            data={categories}
            selectedCategory={selectedCategory}
            onSelect={handleCategorySelection}
          />
        </RNView>

        {items.length === 0 && !loading ? (
          <RNView style={styles.emptyContainer}>
            <RNText style={styles.emptyText}>
              {t("waiter.menu.noFoodItemsAvailable")}
            </RNText>
          </RNView>
        ) : (
          <MenuItemList
            data={menuItemsWithQuantity}
            onAdd={handleAddItem}
            onRemove={handleRemoveItem}
          />
        )}

        {totalAddedItems > 0 && (
          <Pressable
            style={styles.floatingBtnContainer}
            onPress={handleGoToOrderSummary}
          >
            <RNView style={styles.leftContainer}>
              <RNView style={styles.floatingCartIconContainer}>
                <CartIcon />
              </RNView>

              <RNText style={styles.itemCount}>
                {totalAddedItems}{" "}
                {totalAddedItems === 1
                  ? t("waiter.menu.item")
                  : t("waiter.menu.items")}
              </RNText>
            </RNView>

            <SvgXml
              xml={ArrowIcon()}
              width={horizontalScale(10)}
              height={horizontalScale(10)}
              style={{ transform: [{ rotate: isRTL ? "180deg" : "0deg" }] }}
            />
          </Pressable>
        )}
      </RNView>
    </SafeAreaView>
  );
};

export default MenuScreen;

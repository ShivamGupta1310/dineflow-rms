import React, { useCallback, useEffect, useMemo } from "react";
import { Header } from "@components/common";
import { RNView } from "@components/rn-view/rn-view.component";
import styles from "./styles";
import { SVGS, TableSVG, EditIcon } from "@assets";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, ScrollView } from "react-native";
import { colors } from "@theme/colors";
import { moderateScale, scaledSize, verticalScale } from "@utils/scale/scale";
import { RNText } from "@components/rn-text/rn-text.component";
import { MenuItemWithQuantity } from "@appTypes";
import { SvgXml } from "react-native-svg";
import { Date_Format } from "@utils/constants";
import { formatDate } from "@utils";
import OrderItemCard from "@components/OrderItemCard";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { showToast } from "@utils/toastHelper";
import {
  OrderConfirmedRouteProp,
  WaiterStackNavigationProp,
} from "@navigation/types";
import { AppDispatch } from "@store";
import { clearOrder } from "@store/slices/waiterOrderSlice";

const {
  Backlogo,
  DineSetupLogo,
  QuotationMark,
  UserIcon,
  ClockIcon,
  PhoneIcon,
  SuccessConfirmIcons,
} = SVGS;

const OrderConfirmedScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<WaiterStackNavigationProp>();
  const route = useRoute<OrderConfirmedRouteProp>();
  const dispatch = useDispatch<AppDispatch>();

  const {
    fullName = "",
    mobileNumber = "",
    orderNumber = "",
    orderItems = [],
    placedAt = "",
    tableNumber = "",
  } = route.params;

  const formattedOrderTime = useMemo(() => {
    if (!placedAt) {
      return "";
    }

    return formatDate(placedAt, Date_Format.TIME_12_HOUR);
  }, [placedAt]);

  useEffect(() => {
    dispatch(clearOrder());
  }, [dispatch]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleEditOrder = useCallback(() => {
    showToast("info", t("common.comingSoon"));
  }, [t]);

  const itemSaparatorComponent = () => <RNView style={styles.divider} />;

  const renderItem = ({ item }: { item: MenuItemWithQuantity }) => (
    <OrderItemCard
      itemName={item.name}
      imageUrl={item.image_url}
      trailingComponent={
        <RNText style={styles.itemsNameText}>
          {t("waiter.order.quantityLabel", { count: item.quantity })}
        </RNText>
      }
      imageStyle={{ width: verticalScale(40), height: verticalScale(40) }}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <Header
        leftAction={{
          icon: <Backlogo />,
          onPress: handleBack,
          accessibilityLabel: t("common.back"),
          containerStyle: styles.headerAction,
        }}
        rightActions={[
          {
            icon: <SvgXml xml={EditIcon} />,
            onPress: handleEditOrder,
            accessibilityLabel: t("common.back"),
            containerStyle: styles.headerAction,
          },
        ]}
        containerStyle={styles.headerContainer}
        contentStyle={styles.headerContent}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <RNView style={styles.container}>
          <RNView style={styles.orderConfirmContent}>
            <SuccessConfirmIcons
              style={styles.successIcon}
              height={verticalScale(60)}
              width={verticalScale(60)}
            />

            <RNView style={styles.highlightedInfoContainer}>
              <RNText style={styles.textOrderConfirmed}>
                {t("waiter.order.orderConfirmed")}
              </RNText>

              <RNView style={styles.infoContainer}>
                <RNView style={styles.highlightedInfoRow}>
                  <RNText
                    style={styles.highlightedInfoText}
                  >{`#${orderNumber}`}</RNText>
                  <RNView style={styles.infoDivider} />

                  <TableSVG
                    color={colors.black}
                    height={scaledSize(14)}
                    width={scaledSize(14)}
                  />
                  <RNText style={styles.highlightedInfoText}>
                    {tableNumber}
                  </RNText>

                  <RNView style={styles.infoDivider} />

                  <ClockIcon height={scaledSize(14)} width={scaledSize(14)} />
                  <RNText style={styles.highlightedInfoText}>
                    {formattedOrderTime}
                  </RNText>
                </RNView>

                <RNView style={styles.highlightedInfoRow}>
                  <UserIcon height={scaledSize(14)} width={scaledSize(14)} />
                  <RNText style={styles.highlightedInfoText}>{fullName}</RNText>

                  <RNView style={styles.infoDivider} />

                  <PhoneIcon height={scaledSize(14)} width={scaledSize(14)} />
                  <RNText style={styles.highlightedInfoText}>
                    {mobileNumber}
                  </RNText>
                </RNView>
              </RNView>
            </RNView>

            <RNView style={styles.cardContainerView}>
              <RNText style={styles.textCardHeading}>
                {t("waiter.order.items")}
              </RNText>
              <FlatList
                data={orderItems}
                renderItem={renderItem}
                ItemSeparatorComponent={itemSaparatorComponent}
                scrollEnabled={false}
              />
            </RNView>
          </RNView>

          <RNView>
            <RNView style={styles.quoteSection}>
              <RNView style={styles.quoteMark}>
                <QuotationMark />
              </RNView>
              <RNText style={styles.quoteText}>
                {t("waiter.order.thankYouQuote")}
              </RNText>
            </RNView>

            <RNView style={styles.logoSection}>
              <DineSetupLogo
                width={moderateScale(157)}
                height={moderateScale(150)}
              />
            </RNView>
          </RNView>
        </RNView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderConfirmedScreen;

import React from "react";
import { FlatList, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EatingSVG, SVGS } from "@assets";
import { AppLoader, Header, OrderListSheet, RNText, RNView } from "@components";
import withCustomAlert, {
  CustomAlertController,
} from "../../../../hoc/withCustomAlert";
import styles from "./styles";
import { useDashbaord } from "./useDashbaord";
import { Common_Values, TableGridItemStatus } from "@utils/constants";
import { statusTheme } from "@utils";
import { SvgXml } from "react-native-svg";
import { colors } from "@theme/colors";
import { moderateScale } from "@utils/scale/scale";

const { BlueCalendarIcon, LogoutIcon } = SVGS;
const ICON_SIZE = moderateScale(20);

const DashboardScreen: React.FC<CustomAlertController> = ({
  showAlert,
  hideAlert,
}) => {
  const {
    t,
    isLoading,
    dashboardLoader,
    headerTitle,
    headerSubtitle,
    avatarSource,
    dashboardData,
    activeTables,
    orderSheetVisible,
    selectedTable,
    orders,
    setOrderSheetVisible,
    handleTablePress,
    handleLogout,
    handleViewAllPress,
    navigateToMenuScreen,
    navigateToGenerateBillScreen,
  } = useDashbaord({ showAlert, hideAlert });
  return (
    <RNView style={styles.safeArea}>
      {isLoading || dashboardLoader ? <AppLoader /> : null}

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <Header
          leftSlot={
            <RNView style={styles.headerAvatarWrap}>
              <Image
                source={avatarSource}
                style={styles.headerAvatar}
                resizeMode="cover"
              />
            </RNView>
          }
          title={headerTitle}
          subtitle={headerSubtitle}
          rightSlot={
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [
                styles.logoutButton,
                pressed && styles.logoutButtonPressed,
              ]}
            >
              <RNView style={styles.logoutIconWrap}>
                <LogoutIcon />
              </RNView>
              <RNText style={styles.logoutText}>{t("auth.logout")}</RNText>
            </Pressable>
          }
          containerStyle={styles.headerContainer}
          titleStyle={styles.headerTitle}
          subtitleStyle={styles.headerSubtitle}
        />

        <RNView style={styles.content}>
          <RNView style={styles.reservationCard}>
            <RNView style={styles.reservationHeaderRow}>
              <RNView>
                <RNText style={styles.reservationTitle}>
                  {t("waiter.dashboard.todayReservation")}
                </RNText>
                <RNText style={styles.reservationCount}>
                  {dashboardData?.reservations?.count ??
                    Common_Values.EMPTY_PLACEHOLDER}
                </RNText>
              </RNView>
              <BlueCalendarIcon />
            </RNView>

            <RNView style={styles.statsRow}>
              <RNView style={styles.statCard}>
                <RNText style={styles.statTitle}>
                  {t("waiter.dashboard.activeOrders")}
                </RNText>

                <RNView style={styles.statFooter}>
                  <RNText style={styles.statValue}>
                    {dashboardData?.orders?.active ??
                      Common_Values.EMPTY_PLACEHOLDER}
                  </RNText>
                  <RNView style={styles.statIconWrap}>
                    <SvgXml xml={EatingSVG(colors.statusAvailable)} />
                  </RNView>
                </RNView>
              </RNView>

              <RNView style={[styles.statCard, styles.statCardPending]}>
                <RNText style={styles.statTitle}>
                  {t("waiter.dashboard.pendingOrders")}
                </RNText>

                <RNView style={styles.statFooter}>
                  <RNText style={styles.statValue}>
                    {dashboardData?.orders?.pending ??
                      Common_Values.EMPTY_PLACEHOLDER}
                  </RNText>
                  <RNView style={styles.statIconWrap}>
                    <SvgXml xml={EatingSVG(colors.primary)} />
                  </RNView>
                </RNView>
              </RNView>
            </RNView>
          </RNView>

          <RNView style={styles.activeTablesCard}>
            <RNView style={styles.sectionHeader}>
              <RNText style={styles.sectionTitle}>
                {t("waiter.dashboard.activeTables")}
              </RNText>
              <Pressable onPress={handleViewAllPress}>
                <RNText style={styles.viewAllText}>
                  {t("waiter.dashboard.viewAll")}
                </RNText>
              </Pressable>
            </RNView>

            <FlatList
              horizontal
              data={activeTables}
              keyExtractor={(item) => item.table_id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.activeTablesRow}
              renderItem={({ item, index }) => {
                const isLast = index === activeTables.length - 1;
                const normalizedStatus =
                  item.status.toLowerCase() as TableGridItemStatus;

                const theme =
                  statusTheme[normalizedStatus] ??
                  statusTheme[TableGridItemStatus.AVAILABLE];

                return (
                  <Pressable
                    testID={`active-table-card-${item.table_id}`}
                    onPress={() => handleTablePress(item)}
                    style={[
                      theme,
                      styles.activeTableCard,
                      isLast && styles.activeTableCardLast,
                    ]}
                  >
                    <RNView style={styles.activeTableIconWrap}>
                      <SvgXml
                        xml={EatingSVG()}
                        height={ICON_SIZE}
                        width={ICON_SIZE}
                      />
                    </RNView>
                    <RNText style={styles.activeTableLabel}>
                      {item.table_number ?? Common_Values.EMPTY_PLACEHOLDER}
                    </RNText>
                  </Pressable>
                );
              }}
            />
          </RNView>
        </RNView>
      </SafeAreaView>

      <OrderListSheet
        visible={orderSheetVisible}
        setOrderSheetVisible={setOrderSheetVisible}
        tableNumber={selectedTable?.table_number}
        orders={orders}
        handleAddItemClick={navigateToMenuScreen}
        handleGenerateBillClick={navigateToGenerateBillScreen}
      />
    </RNView>
  );
};

export default withCustomAlert(DashboardScreen);

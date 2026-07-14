import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ListRenderItemInfo,
} from "react-native";
import { useWaiterList, Staff } from "./useWaiterList";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppButton, AppHeader, AppLoader, RNText, RNView } from "@components";
import withCustomAlert, {
  CustomAlertController,
} from "../../../hoc/withCustomAlert";
import { isAndroid } from "@theme/theme";

// ── Waiter Card ──────────────────────────────────────────────────────────────
interface WaiterCardProps {
  staff: Staff | null;
  isSelected: boolean;
  onPress: (id: number) => void;
  fullName: string;
}

const WaiterCard: React.FC<WaiterCardProps> = ({
  staff,
  isSelected,
  onPress,
  fullName,
}) => {
  if (!staff) {
    return <View style={[styles.card, styles.cardEmpty]} />;
  }
  return (
    <TouchableOpacity
      testID={`waiter-card-${staff.staff_id}`}
      activeOpacity={0.75}
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={() => onPress(staff.staff_id)}
    >
      <View style={styles.avatarWrapper}>
        <Image
          source={{ uri: staff.avatar }}
          style={styles.avatar}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {fullName}
      </Text>
    </TouchableOpacity>
  );
};

// ── Main Screen ───────────────────────────────────────────────────────────────
export const WaiterListScreen: React.FC<CustomAlertController> = ({
  showAlert,
  hideAlert,
}) => {
  const {
    t,
    loading,
    unlinkLoading,
    isRTL,
    staffList,
    selectedId,
    NUM_COLUMNS,
    getFullName,
    handleSelect,
    handleContinue,
    handleUnlink,
    handleBackPress,
  } = useWaiterList({ showAlert, hideAlert });

  const renderItem = ({ item }: ListRenderItemInfo<Staff | null>) => {
    if (!item) {
      return <View style={[styles.card, styles.cardEmpty]} />;
    }
    return (
      <WaiterCard
        staff={item}
        isSelected={selectedId === item.staff_id}
        onPress={handleSelect}
        fullName={getFullName(item)}
      />
    );
  };

  const keyExtractor = (item: Staff | null, index: number) =>
    item ? String(item.staff_id) : `empty-${index}`;
  const showEmptyState = !loading && staffList.length === 0;

  return (
    <SafeAreaView
      testID="waiter-selection-container"
      style={styles.safeArea}
      edges={["top", "bottom"]}
    >
      <RNView style={[styles.container, isRTL && styles.containerRtl]}>
        {unlinkLoading ? <AppLoader /> : null}
        <AppHeader
          onGoBack={isAndroid ? handleBackPress : undefined}
          isLogo={true}
        />
        <RNText style={styles.description}>
          {t("waiter.headerDescription")}
        </RNText>
        {showEmptyState ? (
          <View
            style={[
              styles.emptyStateContainer,
              isRTL && styles.emptyStateContainerRtl,
            ]}
          >
            <Text
              style={[
                styles.emptyStateTitle,
                isRTL && styles.emptyStateTitleRtl,
              ]}
            >
              {t("waiter.waiterList.noActiveWaitersTitle")}
            </Text>
            <Text
              style={[
                styles.emptyStateSubtitle,
                isRTL && styles.emptyStateSubtitleRtl,
              ]}
            >
              {t("waiter.waiterList.noActiveWaitersSubtitle")}
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              data={staffList}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              numColumns={NUM_COLUMNS}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
            <View style={styles.bottomBar}>
              <AppButton
                title={t("auth.login.continue")}
                onPress={handleContinue}
                loading={loading}
                disabled={selectedId === null}
                variant="outlined"
                style={[
                  styles.continueButton,
                  selectedId !== null && styles.continueButtonActive,
                ]}
                testID="waiter-selection-continue"
              />
              <TouchableOpacity onPress={handleUnlink} activeOpacity={0.6}>
                <Text
                  style={[styles.unlinkText, isRTL && styles.unlinkTextRtl]}
                >
                  {t("waiter.waiterList.unlinkWaiter")}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </RNView>
    </SafeAreaView>
  );
};

export default withCustomAlert(WaiterListScreen);

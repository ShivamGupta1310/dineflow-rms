import React, { memo, ReactNode } from "react";
import { Image, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { IMAGES } from "@assets";
import { RNText, RNView } from "@components";
import { RootState } from "@store";
import styles from "./styles";

export interface DashboardHeaderProps {
  onPressProfile?: () => void;
  rightContainer?: ReactNode;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onPressProfile,
  rightContainer,
}) => {
  const { t } = useTranslation();

  const userDetails = useSelector((state: RootState) => state.auth.user);

  const firstName = userDetails?.first_name ?? "";
  const avatarSource = userDetails?.avatar
    ? { uri: userDetails.avatar }
    : IMAGES.userAvatar;

  return (
    <RNView style={styles.container}>
      <RNView style={styles.leftContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.profileImageContainer}
          onPress={onPressProfile}
          disabled={!onPressProfile}
          testID="owner-header-profile-button"
        >
          <Image
            source={avatarSource}
            style={styles.profileImage}
            resizeMode="cover"
            testID="owner-header-profile-image"
          />
        </TouchableOpacity>

        <RNView style={styles.textContainer}>
          <RNText style={styles.greetingText}>
            {`${t("owner.dashboard.header.greeting")} ${firstName}`}
          </RNText>

          <RNText style={styles.designationText}>
            {t("owner.dashboard.header.role")}
          </RNText>
        </RNView>
      </RNView>

      {rightContainer ? (
        <RNView style={styles.headerRightContainer}>{rightContainer}</RNView>
      ) : null}
    </RNView>
  );
};

export default memo(DashboardHeader);

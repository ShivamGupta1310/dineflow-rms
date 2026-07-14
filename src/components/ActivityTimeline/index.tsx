import React, { useMemo } from "react";
import { RNText, RNView } from "@components";
import { ReservationActivity } from "@store/slices/reservationSlice";
import styles from "./styles";
import { formatDisplayDate, toSuperscriptOrdinal } from "@utils";
import { Common_Values, Date_Format } from "@utils/constants";
import { GlobalContext } from "../../contexts/global.provider";

interface ActivityTimelineProps {
  activities: ReservationActivity[];
}

interface TimelineItem extends ReservationActivity {
  title: string;
  subtitle?: string;
}

const formatActivityTitle = (value?: string) => {
  if (!value) {
    return "";
  }

  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getTimelineKey = (activity: ReservationActivity, index: number) => {
  return `${activity.activity_type}-${activity.created_at}-${index}`;
};

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  const contextData = React.useContext(GlobalContext);
  const isRTL = Boolean(contextData?.isRTL);
  const timelineItems = useMemo<TimelineItem[]>(() => {
    return activities.map((activity) => ({
      ...activity,
      title: formatActivityTitle(activity.activity_type),
      subtitle: activity.created_at,
    }));
  }, [activities]);

  if (!timelineItems.length) {
    return null;
  }
  const { EMPTY_PLACEHOLDER } = Common_Values;

  return (
    <RNView style={styles.container}>
      {timelineItems.map((activity, index) => {
        const isLastItem = index === timelineItems.length - 1;

        return (
          <RNView
            key={getTimelineKey(activity, index)}
            style={[styles.itemRow]}
          >
            <RNView
              style={[
                styles.railMainContainer,
                !isRTL ? styles.railContainer : styles.railContainerRtl,
              ]}
            >
              <RNView style={styles.dot} />

              {!isLastItem && <RNView style={styles.line} />}
            </RNView>

            <RNView
              style={[
                styles.contentContainer,
                !isLastItem && styles.contentSpace,
              ]}
            >
              <RNText style={[styles.activityTitle]}>
                {activity.activity_message || activity.title}
              </RNText>

              {!!activity.subtitle && (
                <RNText style={[styles.activitySubtitle]}>
                  {activity.subtitle
                    ? `${toSuperscriptOrdinal(
                        formatDisplayDate(
                          activity.subtitle,
                          Date_Format.Do_MMM_YY,
                          null,
                          Date_Format.TIME_12_HOUR,
                          true,
                        ),
                      )}`
                    : EMPTY_PLACEHOLDER}
                </RNText>
              )}
            </RNView>
          </RNView>
        );
      })}
    </RNView>
  );
};

export default ActivityTimeline;

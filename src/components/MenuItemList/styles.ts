import { colors } from '@theme/colors';
import { typography } from '@theme/theme';
import { horizontalScale, moderateScale, verticalScale } from '@utils/scale/scale';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: verticalScale(20),
    },
    flatlist: {
        gap: horizontalScale(10),
    },
    card: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: moderateScale(12),
        overflow: 'hidden',
        boxShadow: `0px 0px 20px 0px ${colors.menuCardShadow}`,
    },
    image: {
        width: horizontalScale(120),
        height: horizontalScale(120),
        borderRadius: moderateScale(12),
        resizeMode: 'cover',
        overflow: 'hidden',
    },
    itemIconWrap: {
        width: horizontalScale(120),
        height: horizontalScale(120),
        borderRadius: horizontalScale(12),
        backgroundColor: colors.lightPink,
        overflow: "hidden",
    },
    centerIcon: {
        width: horizontalScale(120),
        height: horizontalScale(120),
        borderRadius: horizontalScale(12),
        backgroundColor: colors.lightPink,
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        flex: 1,
        padding: horizontalScale(12),
        justifyContent: 'space-between'
    },
    title: {
        ...typography.medium_16,
        color: colors.primaryText,
    },
    description: {
        ...typography.regular_12,
        marginTop: verticalScale(2),
        color: colors.descriptionText
    },
    bottomRow: {
        marginTop: verticalScale(16),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        ...typography.medium_16,
        color: colors.primaryText,
    },
    footer: {
        height: verticalScale(70)
    }
});
import { StyleSheet } from "react-native";

import { colors } from "@theme/colors";
import { horizontalScale, verticalScale } from "@utils/scale/scale";
import { typography } from "@theme/theme";

export default StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(12),
    backgroundColor: colors.white,
    width:'100%',
    minHeight: verticalScale(157)
  },
  capacityContainer: {
    flexDirection: "row",
    marginTop: verticalScale(6),
    marginBottom: verticalScale(12),
    alignItems: "center",
  },
  capacity: {
    ...typography.regular_14,
    color: colors.primaryText,
    lineHeight: verticalScale(18),
    marginLeft: horizontalScale(2),
  },
  tableTimeContainer: {
    height: verticalScale(48),
    backgroundColor: colors.white,
    width: "94%",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 10,
  },
  tableNumber: {
    ...typography.medium_14,
    color: colors.primaryText,
    lineHeight: verticalScale(23),
    alignSelf:'flex-start'
  },
  bill: {
    ...typography.regular_14,
    color: colors.primaryText,
  },
  centerView:{
    alignItems:'center'
  },
  topView:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    width:'100%'
  }
});

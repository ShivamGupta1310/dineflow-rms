import React from "react";
import { SvgXml } from "react-native-svg";

interface TableSVGProps
  extends Omit<React.ComponentProps<typeof SvgXml>, "xml"> {
  color?: string;
}

export const TableSVG = ({
  color = "#F25800",
  width = 24,
  height = 24,
  ...props
}: TableSVGProps) =>
  React.createElement(SvgXml, {
    xml: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.2656 19.7344V21.1406H2.10938V19.7344C2.10938 15.8511 5.30428 12.7031 9.1875 12.7031C13.0708 12.7031 16.2656 15.8511 16.2656 19.7344Z" fill="none" stroke="${color}" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M0.703125 21.1406H23.2969" stroke="${color}" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23.2969 12.7031C23.2969 14.2564 22.0377 15.5156 20.4844 15.5156C18.9311 15.5156 17.6719 14.2564 17.6719 12.7031V8.48438H23.2969V12.7031Z" fill="none" stroke="${color}" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20.4844 21.1406V15.5156" stroke="${color}" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.1875 11.2969V12.7031" stroke="${color}" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.375 9.89062C6.375 9.11395 7.00462 8.48438 7.78125 8.48438H13.4531C14.2297 8.48438 14.8594 7.8548 14.8594 7.07812C14.8594 6.30145 14.2297 5.67188 13.4531 5.67188H10.5937C9.81712 5.67188 9.1875 5.0423 9.1875 4.26562V2.85938" stroke="${color}" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    width,
    height,
    ...props,
  });

export const CallIcon = (color: string = "#000000") => `
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_499_7456" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
<path d="M0 0H16V16H0V0Z" fill="white" style="fill:white;fill-opacity:1;"/>
</mask>
<g mask="url(#mask0_499_7456)">
<path d="M6.31256 9.78119C7.83537 11.3011 9.75006 11.7809 9.75006 11.7809L11.4292 10.038C12.0006 9.46776 12.6563 9.59369 13.5001 10.0309L14.3898 10.5307C14.9946 10.8704 15.3765 11.5085 15.3751 12.2022C15.375 12.2076 15.375 12.213 15.375 12.2184C15.371 12.7446 15.1563 13.3434 14.6251 13.8747C13.3285 15.1713 11.5528 15.3873 10.0938 15.3745C7.63178 15.3527 5.43134 13.7748 3.81256 12.1559C2.19378 10.5372 0.646812 8.368 0.625062 5.90594C0.612156 4.44688 0.818125 2.67126 2.11466 1.37469C2.64591 0.843444 3.24475 0.628756 3.77091 0.624787C3.77634 0.624756 3.78175 0.624725 3.78716 0.624725C4.48084 0.623288 5.11891 1.00513 5.45862 1.60994L5.95841 2.49969C6.33341 3.28094 6.52162 3.99922 5.95137 4.57057L4.27091 6.31244C4.27091 6.31244 4.79269 8.25838 6.31256 9.78119Z" stroke=${color} style="stroke:#2B72FE;stroke:color(display-p3 0.1686 0.4471 0.9961);stroke-opacity:1;" stroke-miterlimit="10" stroke-linecap="round"/>
<path d="M15.375 7.49969C15.375 3.70273 12.297 0.624694 8.5 0.624694" stroke=${color} style="stroke:#2B72FE;stroke:color(display-p3 0.1686 0.4471 0.9961);stroke-opacity:1;" stroke-miterlimit="10"/>
<path d="M10.375 7.49969C10.375 6.46416 9.53553 5.62469 8.5 5.62469" stroke=${color} style="stroke:#2B72FE;stroke:color(display-p3 0.1686 0.4471 0.9961);stroke-opacity:1;" stroke-miterlimit="10"/>
<path d="M12.875 7.49969C12.875 5.08344 10.9162 3.12469 8.5 3.12469" stroke=${color} style="stroke:#2B72FE;stroke:color(display-p3 0.1686 0.4471 0.9961);stroke-opacity:1;" stroke-miterlimit="10"/>
</g>
</svg>

`;

export const CalendarIcon = `
<svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.654381 4.94258H11.3487M8.66389 7.28583H8.66945M6.00156 7.28583H6.00712M3.3332 7.28583H3.33876M8.66389 9.61773H8.66945M6.00156 9.61773H6.00712M3.3332 9.61773H3.33876M8.4251 0.5V2.47447M3.57806 0.5V2.47447M8.54159 1.44752H3.46121C1.6992 1.44752 0.598633 2.42908 0.598633 4.23334V9.66312C0.598633 11.4957 1.6992 12.5 3.46121 12.5H8.53603C10.3036 12.5 11.3986 11.5128 11.3986 9.70851V4.23334C11.4042 2.42908 10.3092 1.44752 8.54159 1.44752Z" stroke="#151B1E" style="stroke:#151B1E;stroke:color(display-p3 0.0824 0.1059 0.1176);stroke-opacity:1;" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

export const ConfirmIcon = `
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_499_7442" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
<path d="M16 0H0V16H16V0Z" fill="white" style="fill:white;fill-opacity:1;"/>
</mask>
<g mask="url(#mask0_499_7442)">
<path d="M11.0942 5.90356L6.9013 10.0965L4.90527 8.1005" stroke="#0E9D0E" style="stroke:#0E9D0E;stroke:color(display-p3 0.0533 0.6154 0.0533);stroke-opacity:1;" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.375 8C15.375 12.0731 12.0731 15.375 8 15.375C3.92691 15.375 0.625 12.0731 0.625 8C0.625 3.92691 3.92691 0.625002 8 0.625002C12.0731 0.625002 15.375 3.92691 15.375 8Z" stroke="#0E9D0E" style="stroke:#0E9D0E;stroke:color(display-p3 0.0533 0.6154 0.0533);stroke-opacity:1;" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>
`;

export const ReservedIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
<mask id="mask0_499_7553" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
<path d="M0 1.90735e-06H16V16H0V1.90735e-06Z" fill="white" style="fill:white;fill-opacity:1;"/>
</mask>
<g mask="url(#mask0_499_7553)">
<path d="M10.8437 14.0938V13.1562C10.8437 10.5674 8.71384 8.46875 6.125 8.46875C3.53619 8.46875 1.40625 10.5674 1.40625 13.1562V14.0938" stroke="#F25800" style="stroke:#F25800;stroke:color(display-p3 0.9490 0.3451 0.0000);stroke-opacity:1;" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M0.46875 14.0938H15.5312" stroke="#F25800" style="stroke:#F25800;stroke:color(display-p3 0.9490 0.3451 0.0000);stroke-opacity:1;" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.5312 8.46875C15.5312 9.50428 14.6918 10.3438 13.6562 10.3438C12.6207 10.3438 11.7812 9.50428 11.7812 8.46875V5.65625H15.5312V8.46875Z" stroke="#F25800" style="stroke:#F25800;stroke:color(display-p3 0.9490 0.3451 0.0000);stroke-opacity:1;" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.6562 14.0938V10.3438" stroke="#F25800" style="stroke:#F25800;stroke:color(display-p3 0.9490 0.3451 0.0000);stroke-opacity:1;" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.125 7.53125V8.46875" stroke="#F25800" style="stroke:#F25800;stroke:color(display-p3 0.9490 0.3451 0.0000);stroke-opacity:1;" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4.25 6.59375C4.25 6.07597 4.66975 5.65625 5.1875 5.65625H8.96875C9.4865 5.65625 9.90625 5.23653 9.90625 4.71875C9.90625 4.20097 9.4865 3.78125 8.96875 3.78125H7.0625C6.54475 3.78125 6.125 3.36153 6.125 2.84375V1.90625" stroke="#F25800" style="stroke:#F25800;stroke:color(display-p3 0.9490 0.3451 0.0000);stroke-opacity:1;" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>
`;

export const SearchIcon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_499_5340)">
<path d="M6.87283 13.1214C3.422 13.1214 0.624559 10.3239 0.624559 6.87308C0.624559 3.42226 3.422 0.624817 6.87283 0.624817C10.3236 0.624817 13.1211 3.42226 13.1211 6.87308C13.1211 10.3239 10.3236 13.1214 6.87283 13.1214Z" stroke="#151B1E" style="stroke:#151B1E;stroke:color(display-p3 0.0824 0.1059 0.1176);stroke-opacity:1;" stroke-miterlimit="10"/>
<path d="M15.5581 15.5582L11.2912 11.2913" stroke="#151B1E" style="stroke:#151B1E;stroke:color(display-p3 0.0824 0.1059 0.1176);stroke-opacity:1;" stroke-miterlimit="10"/>
</g>
<defs>
<clipPath id="clip0_499_5340">
<rect width="16" height="16" fill="white" style="fill:white;fill-opacity:1;" transform="matrix(-1 0 0 1 16 0)"/>
</clipPath>
</defs>
</svg>
`;

export const ShareIcon = (
  color: string = "#151B1E",
) => `<svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.1011 6.81045H12.7594C13.864 6.81045 14.7594 7.70588 14.7594 8.81045V18.6C14.7594 19.7045 13.864 20.6 12.7594 20.6H2.6001C1.49553 20.6 0.600098 19.7045 0.600098 18.6V8.81045C0.600098 7.70588 1.49553 6.81045 2.6001 6.81045H3.46611M7.6509 13.021V0.599976M4.12458 4.28418L7.6509 0.599976L11.493 4.28418" stroke="${color}" style="stroke:${color};stroke:color(display-p3 0.9490 0.3451 0.0000);stroke-opacity:1;" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

export const ThankYouBGIcon =
  () => `<svg width="46" height="60" viewBox="0 0 46 60" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M46.0002 26.1647C46.0002 42.2548 32.1311 55.117 26.9487 59.3718C25.8628 60.2521 24.2834 60.2032 23.2716 59.2496L23.1236 59.1273C21.9637 58.0514 21.939 56.2663 23.0495 55.1415C26.6032 51.6447 30.9465 44.9691 30.9465 39.3693C30.9465 34.7722 17.0527 34.4787 17.0527 21.861C17.0527 14.4029 23.8639 8.24072 30.9465 8.24072C39.7813 8.24072 46.0002 16.2613 46.0002 26.1647Z" fill="#FFF4EF" style="fill:#FFF4EF;fill:color(display-p3 1.0000 0.9562 0.9356);fill-opacity:1;"/>
<path d="M28.0837 17.386C28.0837 32.987 14.6341 45.458 9.59979 49.5661C8.53863 50.422 7.00858 50.3731 6.02146 49.4683L5.89807 49.3461C4.76287 48.319 4.7382 46.5584 5.82404 45.4825C9.27897 42.0835 13.4743 35.6035 13.4743 30.1749C13.4743 25.7245 0 25.4311 0 13.2046C0 5.96653 6.58906 0 13.4743 0C22.0376 0 28.0837 7.77604 28.0837 17.386Z" fill="#FFF4EF" style="fill:#FFF4EF;fill:color(display-p3 1.0000 0.9562 0.9356);fill-opacity:1;"/>
</svg>
`;

export const EatingSVG = (
  color: string = "#151B1E",
) => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
<mask id="mask0_963_516" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
<path d="M0 1.90735e-06H24V24H0V1.90735e-06Z" fill="white" style="fill:white;fill-opacity:1;"/>
</mask>
<g mask="url(#mask0_963_516)">
<path d="M16.2656 21.1407V19.7344C16.2656 15.8511 13.0708 12.7032 9.1875 12.7032C5.30428 12.7032 2.10938 15.8511 2.10938 19.7344V21.1407" stroke="${color}" style="stroke:${color};stroke:color(display-p3 0.1216 0.7373 0.2627);stroke-opacity:1;" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M0.703125 21.1407H23.2969" stroke="${color}" style="stroke:${color};stroke:color(display-p3 0.1216 0.7373 0.2627);stroke-opacity:1;" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23.2969 12.7031C23.2969 14.2564 22.0377 15.5156 20.4844 15.5156C18.9311 15.5156 17.6719 14.2564 17.6719 12.7031V8.48438H23.2969V12.7031Z" stroke="${color}" style="stroke:${color};stroke:color(display-p3 0.1216 0.7373 0.2627);stroke-opacity:1;" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20.4844 21.1406V15.5156" stroke="${color}" style="stroke:${color};stroke:color(display-p3 0.1216 0.7373 0.2627);stroke-opacity:1;" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.1875 11.2969V12.7031" stroke="${color}" style="stroke:${color};stroke:color(display-p3 0.1216 0.7373 0.2627);stroke-opacity:1;" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.375 9.89062C6.375 9.11395 7.00462 8.48438 7.78125 8.48438H13.4531C14.2297 8.48438 14.8594 7.8548 14.8594 7.07812C14.8594 6.30145 14.2297 5.67188 13.4531 5.67188H10.5937C9.81712 5.67188 9.1875 5.0423 9.1875 4.26562V2.85938" stroke="${color}" style="stroke:${color};stroke:color(display-p3 0.1216 0.7373 0.2627);stroke-opacity:1;" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>
`;

export const MenuActiveIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1218_501)">
<path d="M3.42505 2.87251C3.47132 2.86951 3.51533 2.85878 3.5624 2.85878H18.3285V0.702464C18.3285 0.491661 18.2337 0.29253 18.0716 0.158605C17.9082 0.025382 17.6967 -0.0267914 17.488 0.0130535L3.42505 2.87251Z" fill="#F25800" style="fill:#F25800;fill:color(display-p3 0.9490 0.3451 0.0000);fill-opacity:1;"/>
<path d="M12.0001 10.5934C10.3027 10.5934 8.88131 11.8033 8.55444 13.406H15.4458C15.119 11.8033 13.6976 10.5934 12.0001 10.5934Z" fill="#F25800" style="fill:#F25800;fill:color(display-p3 0.9490 0.3451 0.0000);fill-opacity:1;"/>
<path d="M21.1409 4.96822C21.1409 4.57957 20.8264 4.26508 20.4378 4.26508H3.56228C3.17362 4.26508 2.85913 4.57957 2.85913 4.96822V23.2969C2.85913 23.6855 3.17362 24 3.56228 24H20.4378C20.8264 24 21.1409 23.6855 21.1409 23.2969V4.96822ZM16.2189 20.4374H7.78115C7.3925 20.4374 7.078 20.1229 7.078 19.7343C7.078 19.3456 7.3925 19.0311 7.78115 19.0311H16.2189C16.6075 19.0311 16.922 19.3456 16.922 19.7343C16.922 20.1229 16.6075 20.4374 16.2189 20.4374ZM16.2189 17.6248H7.78115C7.3925 17.6248 7.078 17.3103 7.078 16.9217C7.078 16.533 7.3925 16.2186 7.78115 16.2186H16.2189C16.6075 16.2186 16.922 16.533 16.922 16.9217C16.922 17.3103 16.6075 17.6248 16.2189 17.6248ZM17.6252 14.8123C17.3763 14.8123 6.23273 14.8123 6.37486 14.8123C5.98621 14.8123 5.67171 14.4978 5.67171 14.1091C5.67171 13.7205 5.98621 13.406 6.37486 13.406H7.14907C7.46038 11.2587 9.14957 9.56947 11.2969 9.25816V8.48395C11.2969 8.0953 11.6114 7.7808 12 7.7808C12.3887 7.7808 12.7032 8.0953 12.7032 8.48395V9.25816C14.8504 9.56947 16.5397 11.2587 16.851 13.406H17.6252C18.0138 13.406 18.3283 13.7205 18.3283 14.1091C18.3283 14.4978 18.0138 14.8123 17.6252 14.8123Z" fill="#F25800" style="fill:#F25800;fill:color(display-p3 0.9490 0.3451 0.0000);fill-opacity:1;"/>
</g>
<defs>
<clipPath id="clip0_1218_501">
<rect width="24" height="24" fill="white" style="fill:white;fill-opacity:1;"/>
</clipPath>
</defs>
</svg>
`;

export const MenuInactiveIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_963_871" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
<path d="M0 0H24V24H0V0Z" fill="white" style="fill:white;fill-opacity:1;"/>
</mask>
<g mask="url(#mask0_963_871)">
<path d="M20.4375 23.2969H3.5625V3.5625H20.4375V23.2969Z" stroke="#151B1E" style="stroke:#151B1E;stroke:color(display-p3 0.0824 0.1059 0.1176);stroke-opacity:1;" stroke-width="1.3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.625 3.5625V0.703123L3.5625 3.5625" stroke="#151B1E" style="stroke:#151B1E;stroke:color(display-p3 0.0824 0.1059 0.1176);stroke-opacity:1;" stroke-width="1.3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.2188 13.4062H7.78125C7.78125 11.0763 9.67003 9.1875 12 9.1875C14.33 9.1875 16.2188 11.0763 16.2188 13.4062Z" stroke="#151B1E" style="stroke:#151B1E;stroke:color(display-p3 0.0824 0.1059 0.1176);stroke-opacity:1;" stroke-width="1.3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6.375 13.4062H17.625" stroke="#151B1E" style="stroke:#151B1E;stroke:color(display-p3 0.0824 0.1059 0.1176);stroke-opacity:1;" stroke-width="1.3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 7.78125V9.1875" stroke="#151B1E" style="stroke:#151B1E;stroke:color(display-p3 0.0824 0.1059 0.1176);stroke-opacity:1;" stroke-width="1.3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.78125 16.2187H16.2188" stroke="#151B1E" style="stroke:#151B1E;stroke:color(display-p3 0.0824 0.1059 0.1176);stroke-opacity:1;" stroke-width="1.3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.78125 19.0312H16.2188" stroke="#151B1E" style="stroke:#151B1E;stroke:color(display-p3 0.0824 0.1059 0.1176);stroke-opacity:1;" stroke-width="1.3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>
`;

export const AddIcon = (
  color: string = "#FFFFFF",
) => `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<line x1="5.89307" y1="0.75" x2="5.89307" y2="11.25" stroke="${color}" style="stroke:${color};stroke-opacity:1;" stroke-width="1.5" stroke-linecap="round"/>
<line x1="0.75" y1="6.10715" x2="11.25" y2="6.10715" stroke="${color}" style="stroke:${color};stroke-opacity:1;" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

export const MinusIcon = (
  color: string = "#FFFFFF",
) => `<svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.600098 5H10.6001" stroke="${color}" style="stroke:${color};stroke-opacity:1;" stroke-width="1.2" stroke-linecap="round"/>
</svg>`;

export const ArrowIcon = (
  color: string = "#FFFFFF",
) => `<svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.600098 0.599976L5.6001 5.59998L0.600098 10.6" stroke=${color} style="stroke:${color};stroke-opacity:1;" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export const FoodPlaceholderIcon = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1661_859)">
<mask id="mask0_1661_859" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40">
<path d="M0 3.8147e-06H40V40H0V3.8147e-06Z" fill="white" style="fill:white;fill-opacity:1;"/>
</mask>
<g mask="url(#mask0_1661_859)">
<path d="M24.6094 13.0469H1.17188V8.35938H24.6094V13.0469Z" stroke="#151B1E" style="stroke:#151B1E;stroke:color(display-p3 0.0824 0.1059 0.1176);stroke-opacity:1;" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.8906 8.35941L17.5781 1.17191H22.2656" stroke="#151B1E" style="stroke:#151B1E;stroke:color(display-p3 0.0824 0.1059 0.1176);stroke-opacity:1;" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M38.8281 24.7656H13.8281C13.8281 21.3138 16.6263 18.5156 20.0781 18.5156H32.5781C36.0299 18.5156 38.8281 21.3138 38.8281 24.7656Z" stroke="#151B1E" style="stroke:#151B1E;stroke:color(display-p3 0.0824 0.1059 0.1176);stroke-opacity:1;" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.8281 34.1406H38.8281C38.8281 36.7294 36.7294 38.8281 34.1406 38.8281H18.5156C15.9268 38.8281 13.8281 36.7294 13.8281 34.1406Z" stroke="#151B1E" style="stroke:#151B1E;stroke:color(display-p3 0.0824 0.1059 0.1176);stroke-opacity:1;" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M34.9219 34.1406H17.7344C16.44 34.1406 15.3906 33.0912 15.3906 31.7969C15.3906 30.5024 16.44 29.4531 17.7344 29.4531H34.9219C36.2162 29.4531 37.2656 30.5024 37.2656 31.7969C37.2656 33.0912 36.2162 34.1406 34.9219 34.1406Z" stroke="#151B1E" style="stroke:#151B1E;stroke:color(display-p3 0.0824 0.1059 0.1176);stroke-opacity:1;" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M34.9219 29.4531H17.7344C16.44 29.4531 15.3906 28.4037 15.3906 27.1094C15.3906 25.8149 16.44 24.7656 17.7344 24.7656H34.9219C36.2162 24.7656 37.2656 25.8149 37.2656 27.1094C37.2656 28.4037 36.2162 29.4531 34.9219 29.4531Z" stroke="#151B1E" style="stroke:#151B1E;stroke:color(display-p3 0.0824 0.1059 0.1176);stroke-opacity:1;" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M22.7155 18.5157L23.0469 13.0469H2.73438L4.29687 38.8282H18.5156" stroke="#151B1E" style="stroke:#151B1E;stroke:color(display-p3 0.0824 0.1059 0.1176);stroke-opacity:1;" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4.68734 20.3125C4.16336 20.3125 3.66 20.3998 3.18945 20.5583L3.73687 29.5909C4.04391 29.6541 4.36172 29.6875 4.68734 29.6875C7.27617 29.6875 9.37484 27.5888 9.37484 25C9.37484 22.4112 7.27617 20.3125 4.68734 20.3125Z" stroke="#151B1E" style="stroke:#151B1E;stroke:color(display-p3 0.0824 0.1059 0.1176);stroke-opacity:1;" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</g>
<defs>
<clipPath id="clip0_1661_859">
<rect width="40" height="40" fill="white" style="fill:white;fill-opacity:1;"/>
</clipPath>
</defs>
</svg>`;

export const CookingSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
<mask id="mask0_1227_2898" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
<path d="M0 1.90735e-06H20V20H0V1.90735e-06Z" fill="white" style="fill:white;fill-opacity:1;"/>
</mask>
<g mask="url(#mask0_1227_2898)">
<path d="M14.7266 19.414H5.27344C3.97902 19.414 2.92969 18.3647 2.92969 17.0703V8.78903H17.0703V17.0703C17.0703 18.3647 16.021 19.414 14.7266 19.414Z" stroke="#F59E0B" style="stroke:#F59E0B;stroke:color(display-p3 0.9608 0.6196 0.0431);stroke-opacity:1;" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.92969 12.3047C1.63527 12.3047 0.585938 11.2554 0.585938 9.96094C0.585938 9.31375 1.11062 8.78906 1.75781 8.78906H2.92969" stroke="#F59E0B" style="stroke:#F59E0B;stroke:color(display-p3 0.9608 0.6196 0.0431);stroke-opacity:1;" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.0703 12.3047C18.3647 12.3047 19.4141 11.2554 19.4141 9.96094C19.4141 9.31375 18.8894 8.78906 18.2422 8.78906H17.0703" stroke="#F59E0B" style="stroke:#F59E0B;stroke:color(display-p3 0.9608 0.6196 0.0431);stroke-opacity:1;" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.75904 4.24014L7.51404 3.70792C7.10807 2.82604 7.49385 1.78206 8.37572 1.37608C9.25756 0.970143 10.3015 1.35592 10.7075 2.23776L10.9525 2.77003" stroke="#F59E0B" style="stroke:#F59E0B;stroke:color(display-p3 0.9608 0.6196 0.0431);stroke-opacity:1;" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.96875 6.44531L15.7427 0.585938" stroke="#F59E0B" style="stroke:#F59E0B;stroke:color(display-p3 0.9608 0.6196 0.0431);stroke-opacity:1;" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.6583 3.13074C15.6583 3.13074 14.8297 3.13074 14.4154 3.54508C14.001 3.95938 14.001 4.78801 14.001 4.78801C14.001 4.78801 14.001 5.61668 13.5867 6.03098C13.1724 6.44531 12.3438 6.44531 12.3438 6.44531" stroke="#F59E0B" style="stroke:#F59E0B;stroke:color(display-p3 0.9608 0.6196 0.0431);stroke-opacity:1;" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19.1739 3.13074C19.1739 3.13074 18.3453 3.13074 17.931 3.54508C17.5166 3.95938 17.5166 4.78801 17.5166 4.78801C17.5166 4.78801 17.5166 5.61668 17.1023 6.03098C16.688 6.44531 15.8594 6.44531 15.8594 6.44531" stroke="#F59E0B" style="stroke:#F59E0B;stroke:color(display-p3 0.9608 0.6196 0.0431);stroke-opacity:1;" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>`;

export const ServedSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
<mask id="mask0_1546_58436" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
<path d="M0 1.90735e-06H20V20H0V1.90735e-06Z" fill="white" style="fill:white;fill-opacity:1;"/>
</mask>
<g mask="url(#mask0_1546_58436)">
<path d="M9.99982 0.585945C10.6927 0.585945 11.255 1.14837 11.255 1.84118C11.255 2.53391 10.6927 3.09637 9.99982 3.09637C9.30725 3.09637 8.74463 2.53391 8.74463 1.84118C8.74463 1.14837 9.30725 0.585945 9.99982 0.585945Z" stroke="#9735EB" style="stroke:#9735EB;stroke:color(display-p3 0.5922 0.2078 0.9216);stroke-opacity:1;" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.159 11.2552H1.84131C1.84131 6.75218 5.4974 3.09632 10.0001 3.09632C14.5032 3.09632 18.159 6.75218 18.159 11.2552Z" stroke="#9735EB" style="stroke:#9735EB;stroke:color(display-p3 0.5922 0.2078 0.9216);stroke-opacity:1;" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M0.585938 11.2552H19.4141" stroke="#9735EB" style="stroke:#9735EB;stroke:color(display-p3 0.5922 0.2078 0.9216);stroke-opacity:1;" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M0.585938 16.9036L3.09637 14.3932V14.3926C3.09637 13.5605 3.42711 12.7625 4.01547 12.1741C4.60387 11.5857 5.40187 11.2552 6.23375 11.2552H8.11719C8.45012 11.2552 8.76957 11.3874 9.00492 11.6228C9.24027 11.8582 9.37238 12.1775 9.37238 12.5104C9.37238 12.8433 9.24027 13.1626 9.00492 13.398C8.76957 13.6333 8.45012 13.7656 8.11719 13.7656H6.23437H10.6276C10.6276 13.7656 11.8649 12.7758 12.7856 12.0393C13.4201 11.5317 14.2084 11.2552 15.0208 11.2552H15.0211C15.3952 11.2552 15.7284 11.4914 15.8521 11.8443C15.9757 12.1971 15.8634 12.5897 15.5712 12.8233C13.7298 14.2964 11.2552 16.2761 11.2552 16.2761L5.60676 16.9036L3.09637 19.4141L0.585938 16.9036Z" stroke="#9735EB" style="stroke:#9735EB;stroke:color(display-p3 0.5922 0.2078 0.9216);stroke-opacity:1;" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>`;

export const RefreshIcon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1445_15628)">
<path d="M0.698724 9.04328C0.383536 6.82522 1.07897 4.49119 2.7851 2.78509C5.66519 -0.0950313 10.3348 -0.0950313 13.2149 2.78509C13.3829 2.95306 13.5411 3.12716 13.6894 3.30659M15.3013 6.95697C15.6164 9.17494 14.9209 11.5089 13.2149 13.2149C10.3348 16.095 5.6652 16.095 2.78507 13.2149C2.61707 13.0469 2.45892 12.8729 2.31054 12.6934M13.7364 1.22062V3.30659H11.6505M2.2636 14.7794V12.6934H4.34954" stroke="#F25800" style="stroke:#F25800;stroke:color(display-p3 0.9490 0.3451 0.0000);stroke-opacity:1;" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_1445_15628">
</svg>`

export const EditIcon = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1546_65069)">
<path d="M14.5278 3.26247L12.738 1.47271C12.4094 1.14407 11.8736 1.14384 11.5452 1.4722L2.41992 10.5975L5.403 13.5806L14.5283 4.45531C14.8567 4.12695 14.8564 3.59111 14.5278 3.26247Z" stroke="#F25800" style="stroke:#F25800;stroke:color(display-p3 0.9490 0.3451 0.0000);stroke-opacity:1;" stroke-miterlimit="22.926" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.22754 14.7737L2.4208 10.5973L5.40388 13.5804L1.22754 14.7737Z" stroke="#F25800" style="stroke:#F25800;stroke:color(display-p3 0.9490 0.3451 0.0000);stroke-opacity:1;" stroke-miterlimit="22.926" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.3356 5.64868L10.3525 2.66558" stroke="#F25800" style="stroke:#F25800;stroke:color(display-p3 0.9490 0.3451 0.0000);stroke-opacity:1;" stroke-miterlimit="22.926" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_1546_65069">
<rect width="16" height="16" fill="white" style="fill:white;fill-opacity:1;"/>
</clipPath>
</defs>
</svg>
`;

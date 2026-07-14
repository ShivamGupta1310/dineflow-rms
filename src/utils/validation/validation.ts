import { REGEX } from '@utils/validation/regex';

export const checkPhoneNumber = (phone: string): boolean => REGEX.PHONE.test(phone);

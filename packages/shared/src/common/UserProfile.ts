import { CountryCode, DateString, ShortString, SmallPositiveNumber } from ".";

export type UserProfile = {
  firstName: ShortString | null;
  lastName: ShortString | null;
  secondLastName: ShortString | null;
  birthDate: DateString | null;
  nationality: CountryCode | null;
  idNumber: ShortString | null; // TODO - validate ID format!
  email: ShortString | null; // TODO - validate email format!
  phoneNumber: ShortString | null; // TODO - validate phone format!
};

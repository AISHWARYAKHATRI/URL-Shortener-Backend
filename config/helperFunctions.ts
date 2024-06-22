import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";

export const generateToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};

export const generateOTP = () => {
  const otp = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  return otp;
};

export const AddMinutesToDate = (date: Date, minutes: number) => {
  return new Date(date.getTime() + minutes * 60000);
};

// Define the types for the parameters used in functions
type DateInput =
  | Date
  | number
  | string
  | number[]
  | { year: number; month: number; date: number };

export const dates = {
  convert: function (d: DateInput): Date {
    // Converts the date in d to a date-object
    return d instanceof Date
      ? d
      : Array.isArray(d)
      ? new Date(d[0], d[1], d[2])
      : typeof d === "number"
      ? new Date(d)
      : typeof d === "string"
      ? new Date(d)
      : typeof d === "object"
      ? new Date(d.year, d.month, d.date)
      : new Date(NaN); // Return an invalid date object for NaN case
  },
  compare: function (a: DateInput, b: DateInput): number {
    // Compare two dates and returns:
    // -1 if a < b
    //  0 if a = b
    //  1 if a > b
    // NaN if a or b is an illegal date
    return isFinite((a = this.convert(a).valueOf())) &&
      isFinite((b = this.convert(b).valueOf()))
      ? ((a > b) as any) - ((a < b) as any)
      : NaN;
  },
  inRange: function (d: DateInput, start: DateInput, end: DateInput): any {
    // Checks if date in d is between dates in start and end.
    // Returns a boolean or NaN:
    // true if d is between start and end (inclusive)
    // false if d is before start or after end
    // NaN if one or more of the dates is illegal.
    return isFinite((d = this.convert(d).valueOf())) &&
      isFinite((start = this.convert(start).valueOf())) &&
      isFinite((end = this.convert(end).valueOf()))
      ? start <= d && d <= end
      : NaN;
  },
};

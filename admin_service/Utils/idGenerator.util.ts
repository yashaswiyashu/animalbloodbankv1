import { PraniCodeMap } from '../models/PraniCodeMap'; // mongoose model

type DecodedPraniAadhar = {
  species?: string;
  breed?: string;
  state?: string;
  age: number;
  pinCodeLast3: string;
  timeStampLast5: string;
  checksum: string;
  isValid: boolean;
};


const getOrCreateCode = async (
  type: 'species' | 'breed' | 'state',
  name: string
): Promise<number> => {
  const existing = await PraniCodeMap.findOne({ type, name });
  if (existing) return existing.code;

  const code = name
    .slice(0, 2)
    .toUpperCase()
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0) % 100;

  const newMap = new PraniCodeMap({ type, name, code });
  await newMap.save();
  return code;
};

const getChecksumChar = (numericID: string): string => {
  const sum = numericID
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  return String.fromCharCode(65 + (sum % 26)); // returns A-Z
};

export const generatePraniAadhar = async (
  species: string,
  breed: string,
  age: number,
  pin_code: string,
  state: string
): Promise<string> => {
  const speciesCode = (await getOrCreateCode('species', species)).toString().padStart(2, '0');
  const breedCode = (await getOrCreateCode('breed', breed)).toString().padStart(2, '0');
  const stateCode = (await getOrCreateCode('state', state)).toString().padStart(2, '0');
  const ageCode = age.toString().padStart(2, '0');
  const pinPart = pin_code.slice(-3);
  const timeStamp = Date.now().toString().slice(-5);

  const numericID = `${speciesCode}${breedCode}${ageCode}${pinPart}${stateCode}${timeStamp}`;
  const checksum = getChecksumChar(numericID);

  return `${numericID}${checksum}`;
};


export const decodePraniAadhar = async (praniAadharNumber: string): Promise<DecodedPraniAadhar | null> => {
  if (!/^\d{16}[A-Z]$/.test(praniAadharNumber)) return null;

  const speciesCode = praniAadharNumber.slice(0, 2);
  const breedCode = praniAadharNumber.slice(2, 4);
  const age = parseInt(praniAadharNumber.slice(4, 6));
  const pinCodeLast3 = praniAadharNumber.slice(6, 9);
  const stateCode = praniAadharNumber.slice(9, 11);
  const timeStampLast5 = praniAadharNumber.slice(11, 16);
  const checksum = praniAadharNumber.slice(16);

  const numericID = praniAadharNumber.slice(0, 16);
  const expectedChecksum = String.fromCharCode(
    65 + (numericID.split('').reduce((acc, d) => acc + parseInt(d), 0) % 26)
  );

  const [speciesMap, breedMap, stateMap] = await Promise.all([
    PraniCodeMap.findOne({ type: 'species', code: parseInt(speciesCode) }),
    PraniCodeMap.findOne({ type: 'breed', code: parseInt(breedCode) }),
    PraniCodeMap.findOne({ type: 'state', code: parseInt(stateCode) }),
  ]);

  return {
    species: speciesMap?.name,
    breed: breedMap?.name,
    state: stateMap?.name,
    age,
    pinCodeLast3,
    timeStampLast5,
    checksum,
    isValid: checksum === expectedChecksum,
  };
};

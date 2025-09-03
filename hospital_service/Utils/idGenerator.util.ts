import { v4 as uuidv4 } from 'uuid';

export const generatePraniAadhar = (
  species: string,
  breed: string,
  age: number,
  location: string
): string => {
  const speciesCode = species.slice(0, 2).toUpperCase();
  const breedCode = breed.slice(0, 2).toUpperCase();
  const locCode = location.slice(0, 3).toUpperCase();
  const timeStamp = Date.now().toString().slice(-6);
  const uniqueSuffix = uuidv4().split('-')[0]; // short unique hash

  return `PA${speciesCode}${breedCode}${age}${locCode}${timeStamp}${uniqueSuffix}`;
};

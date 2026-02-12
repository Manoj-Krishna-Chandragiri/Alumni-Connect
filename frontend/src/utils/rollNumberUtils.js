/**
 * Roll Number Utility Functions
 * Format: YYBQXABC## (10 digits)
 * - YY: College start year (2 digits)
 * - BQ: Constant
 * - X: 1 for regular, 5 for lateral entry
 * - A: Constant
 * - BC: Branch code (2 digits)
 * - ##: Student number (2 digits or A0-Z9 for overflow)
 */

// Branch codes mapping
export const BRANCH_CODES = {
  '61': 'AIML',
  '47': 'CIC',
  '01': 'CIV',
  '05': 'CSE',
  '42': 'CSM',
  '49': 'CSO',
  '04': 'ECE',
  '02': 'EEE',
  '12': 'IT',
  '03': 'MEC',
  '54': 'AID',
};

// Reverse mapping
export const BRANCH_CODE_REVERSE = Object.entries(BRANCH_CODES).reduce(
  (acc, [code, name]) => ({ ...acc, [name]: code }),
  {}
);

// Full branch names
export const BRANCH_FULL_NAMES = {
  CSE: 'Computer Science & Engineering',
  CSM: 'CSE with Artificial Intelligence & Machine Learning',
  AID: 'Artificial Intelligence & Data Science',
  AIML: 'Artificial Intelligence & Machine Learning',
  CSO: 'CSE with Internet of Things',
  CIC: 'CSE with IoT and Cyber Security including Blockchain Technology',
  ECE: 'Electronics & Communication Engineering',
  EEE: 'Electrical & Electronics Engineering',
  IT: 'Information Technology',
  CIV: 'Civil Engineering',
  MEC: 'Mechanical Engineering',
};

export const ENTRY_TYPES = {
  '1': 'Regular',
  '5': 'Lateral Entry',
};

/**
 * Validate roll number format
 * @param {string} rollNumber - Roll number to validate
 * @returns {{ isValid: boolean, error: string|null }}
 */
export const validateRollNumber = (rollNumber) => {
  if (!rollNumber) {
    return { isValid: false, error: 'Roll number is required' };
  }

  const cleaned = rollNumber.trim().toUpperCase();

  // Check length
  if (cleaned.length !== 10) {
    return { isValid: false, error: 'Roll number must be exactly 10 characters' };
  }

  // Check pattern: YYBQXABC##
  const pattern = /^(\d{2})(BQ)([15])(A)(\d{2})([0-9A-Z]{2})$/;
  const match = cleaned.match(pattern);

  if (!match) {
    return {
      isValid: false,
      error: 'Invalid roll number format. Expected: YYBQXABC## (e.g., 22BQ1A4225)',
    };
  }

  const [, year, , entryType, , branchCode, studentNum] = match;

  // Validate year
  const currentYear = new Date().getFullYear() % 100;
  const yearInt = parseInt(year, 10);
  if (yearInt > currentYear + 1 || yearInt < currentYear - 10) {
    return {
      isValid: false,
      error: `Invalid year '${year}'. Should be between ${currentYear - 10} and ${
        currentYear + 1
      }`,
    };
  }

  // Validate branch code
  if (!BRANCH_CODES[branchCode]) {
    return {
      isValid: false,
      error: `Invalid branch code '${branchCode}'. Valid codes: ${Object.keys(BRANCH_CODES).join(
        ', '
      )}`,
    };
  }

  // Validate student number format
  if (
    !(studentNum[0].match(/[0-9A-Z]/) && studentNum[1].match(/[0-9]/))
  ) {
    return { isValid: false, error: `Invalid student number '${studentNum}'` };
  }

  return { isValid: true, error: null };
};

/**
 * Calculate actual student number from string
 * @param {string} studentNumStr - Student number string (e.g., '25', 'A1')
 * @returns {number} - Actual student number
 */
export const calculateStudentNumber = (studentNumStr) => {
  if (/^\d{2}$/.test(studentNumStr)) {
    return parseInt(studentNumStr, 10);
  }

  // First character is letter (overflow indicator)
  const letter = studentNumStr[0];
  const digit = parseInt(studentNumStr[1], 10);

  // A=100, B=110, C=120, ..., Z=360
  const letterValue = (letter.charCodeAt(0) - 'A'.charCodeAt(0)) * 10;

  return 100 + letterValue + digit;
};

/**
 * Parse roll number and extract information
 * @param {string} rollNumber - Roll number to parse
 * @returns {Object|null} - Parsed information or null if invalid
 */
export const parseRollNumber = (rollNumber) => {
  const { isValid } = validateRollNumber(rollNumber);
  if (!isValid) {
    return null;
  }

  const cleaned = rollNumber.trim().toUpperCase();

  const year = cleaned.substring(0, 2);
  const entryType = cleaned[4];
  const branchCode = cleaned.substring(6, 8);
  const studentNum = cleaned.substring(8, 10);

  const actualStudentNum = calculateStudentNumber(studentNum);
  const branchShort = BRANCH_CODES[branchCode] || 'Unknown';

  return {
    rollNumber: cleaned,
    year: `20${year}`,
    yearShort: year,
    entryType: ENTRY_TYPES[entryType] || 'Unknown',
    entryTypeCode: entryType,
    branchCode,
    branchShort,
    branchFull: BRANCH_FULL_NAMES[branchShort] || branchShort,
    studentNumber: studentNum,
    actualStudentNumber: actualStudentNum,
    isLateralEntry: entryType === '5',
    isRegular: entryType === '1',
  };
};

/**
 * Format roll number display
 * @param {string} rollNumber - Roll number
 * @returns {string} - Formatted display string
 */
export const formatRollNumberDisplay = (rollNumber) => {
  const info = parseRollNumber(rollNumber);
  if (!info) return rollNumber;

  return `${info.rollNumber} (${info.branchShort} - ${info.year})`;
};

/**
 * Get branch code from short name
 * @param {string} branchShort - Branch short name (CSE, CSM, etc.)
 * @returns {string|null} - Branch code or null
 */
export const getBranchCode = (branchShort) => {
  return BRANCH_CODE_REVERSE[branchShort.toUpperCase()] || null;
};

/**
 * Generate roll number from components
 * @param {number|string} year - Year (2022, 2023, etc.) or ('22', '23')
 * @param {string} entryType - '1' for regular, '5' for lateral
 * @param {string} branchShort - Branch short name (CSE, CSM, etc.)
 * @param {number} studentNumber - Student number (1-999+)
 * @returns {string|null} - Generated roll number or null if invalid
 */
export const generateRollNumber = (year, entryType, branchShort, studentNumber) => {
  // Convert year
  const yearStr = typeof year === 'number' ? String(year).slice(-2) : String(year);

  // Get branch code
  const branchCode = getBranchCode(branchShort);
  if (!branchCode) return null;

  // Convert student number to string format
  let studentStr;
  if (studentNumber < 100) {
    studentStr = String(studentNumber).padStart(2, '0');
  } else {
    // Calculate overflow format (A0-Z9)
    const overflow = studentNumber - 100;
    const letterIndex = Math.floor(overflow / 10);
    const digit = overflow % 10;
    if (letterIndex > 25) return null; // Z is max
    const letter = String.fromCharCode('A'.charCodeAt(0) + letterIndex);
    studentStr = `${letter}${digit}`;
  }

  return `${yearStr}BQ${entryType}A${branchCode}${studentStr}`;
};

/**
 * Get batch year from roll number
 * @param {string} rollNumber - Roll number
 * @returns {string|null} - Batch year or null
 */
export const getBatchYear = (rollNumber) => {
  const info = parseRollNumber(rollNumber);
  return info ? info.year : null;
};

/**
 * Get department from roll number
 * @param {string} rollNumber - Roll number
 * @returns {string|null} - Department short name or null
 */
export const getDepartment = (rollNumber) => {
  const info = parseRollNumber(rollNumber);
  return info ? info.branchShort : null;
};

/**
 * Check if two roll numbers are from same batch
 * @param {string} rollNumber1 - First roll number
 * @param {string} rollNumber2 - Second roll number
 * @returns {boolean} - True if same batch
 */
export const isSameBatch = (rollNumber1, rollNumber2) => {
  const year1 = getBatchYear(rollNumber1);
  const year2 = getBatchYear(rollNumber2);
  return year1 && year2 ? year1 === year2 : false;
};

/**
 * Check if two roll numbers are from same department
 * @param {string} rollNumber1 - First roll number
 * @param {string} rollNumber2 - Second roll number
 * @returns {boolean} - True if same department
 */
export const isSameDepartment = (rollNumber1, rollNumber2) => {
  const dept1 = getDepartment(rollNumber1);
  const dept2 = getDepartment(rollNumber2);
  return dept1 && dept2 ? dept1 === dept2 : false;
};

/**
 * Get all branch options for select dropdown
 * @returns {Array} - Array of {value, label} objects
 */
export const getBranchOptions = () => {
  return Object.entries(BRANCH_CODES).map(([code, short]) => ({
    value: short,
    code,
    label: `${short} - ${BRANCH_FULL_NAMES[short]}`,
  }));
};

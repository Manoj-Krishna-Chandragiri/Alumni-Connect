/**
 * Parse roll number to extract joining year, department, graduation year, etc.
 * 
 * VVITU Roll Number Format: YYBQEXBB##
 * YY - Joining year (last 2 digits, e.g., 22 = 2022)
 * BQ - Batch code (2 letters)
 * E  - Entry type (1 = Regular 4-year BTech, 5 = Lateral 3-year after Diploma)
 * X  - Section (A, B, C, etc.)
 * BB - 2-digit branch/department code (42, 05, 12, etc.)
 * ## - Student number (01, 02, etc.)
 * 
 * Examples:
 * - 22BQ1A4201 → 2022, Regular (1A), CSM (42), Student 01
 * - 19BQ5A0508 → 2019, Lateral (5A), CSE (05), Student 08
 * - 16BQ1A4102 → 2016, Regular (1A), CSE (41 or 05), Student 02
 */

// Department codes mapping for VVITU (Vasireddy Venkatadri International Technological University)
const DEPARTMENT_CODES = {
  '01': 'Civil Engineering',
  '02': 'Electrical & Electronics Engineering',
  '03': 'Mechanical Engineering',
  '04': 'Electronics & Communication Engineering',
  '05': 'Computer Science & Engineering',
  '12': 'Information Technology',
  '42': 'CSE with Artificial Intelligence & Machine Learning',
  '47': 'CSE with IoT and Cyber Security including Blockchain Technology',
  '49': 'CSE with Internet of Things',
  '54': 'Artificial Intelligence & Data Science',
  '61': 'Artificial Intelligence & Machine Learning',
  // Short codes
  'CIV': 'Civil Engineering',
  'EEE': 'Electrical & Electronics Engineering',
  'MEC': 'Mechanical Engineering',
  'ECE': 'Electronics & Communication Engineering',
  'CSE': 'Computer Science & Engineering',
  'IT': 'Information Technology',
  'CSM': 'CSE with Artificial Intelligence & Machine Learning',
  'CIC': 'CSE with IoT and Cyber Security including Blockchain Technology',
  'CSO': 'CSE with Internet of Things',
  'AID': 'Artificial Intelligence & Data Science',
  'AIML': 'Artificial Intelligence & Machine Learning',
};

export const parseRollNumber = (rollNumber) => {
  if (!rollNumber || typeof rollNumber !== 'string') {
    return null;
  }

  const cleaned = rollNumber.trim().toUpperCase();
  
  // Basic validation - should be at least 6 characters
  if (cleaned.length < 6) {
    return null;
  }

  try {
    const result = {
      originalRollNumber: rollNumber,
      joiningYear: null,
      entryType: null,
      entryTypeLabel: null,
      courseDuration: null,
      section: null,
      departmentCode: null,
      department: null,
      batchCode: null,
      studentNumber: null,
      passoutYear: null,
      error: null,
    };

    // Extract joining year (first 2 digits)
    const yearMatch = cleaned.match(/^(\d{2})/);
    if (yearMatch) {
      const yearSuffix = parseInt(yearMatch[1]);
      result.joiningYear = 2000 + yearSuffix;
    }

    // Extract batch code (next 2 letters after year)
    const batchMatch = cleaned.match(/^\d{2}([A-Z]{2})/);
    if (batchMatch) {
      result.batchCode = batchMatch[1];
    }

    // Extract entry type and section (digit + letter after batch code)
    // 1A = Regular 4-year, 5A = Lateral 3-year
    const entryMatch = cleaned.match(/^\d{2}[A-Z]{2}(\d)([A-Z])/);
    if (entryMatch) {
      const entryNum = parseInt(entryMatch[1]);
      result.entryType = entryNum;
      result.section = entryMatch[2];
      
      // Set entry type label and course duration
      if (entryNum === 1) {
        result.entryTypeLabel = 'Regular';
        result.courseDuration = 4;
      } else if (entryNum === 5) {
        result.entryTypeLabel = 'Lateral Entry';
        result.courseDuration = 3;
      } else {
        result.entryTypeLabel = `Entry Type ${entryNum}`;
        result.courseDuration = 4; // Default to 4 years
      }
      
      // Calculate passout year based on joining year and course duration
      if (result.joiningYear && result.courseDuration) {
        result.passoutYear = result.joiningYear + result.courseDuration;
      }
    }

    // Extract department/branch code (2 digits after section)
    // Format: YYBQYXA##N... where ## is the 2-digit department code
    const deptMatch = cleaned.match(/^\d{2}[A-Z]{2}\d[A-Z](\d{2})/);
    if (deptMatch) {
      const code = deptMatch[1];
      result.departmentCode = code;
      result.department = DEPARTMENT_CODES[code] || `Branch ${code}`;
    }

    // Extract student number (remaining digits after department code)
    const studentMatch = cleaned.match(/^\d{2}[A-Z]{2}\d[A-Z]\d{2}(\d+)$/);
    if (studentMatch) {
      result.studentNumber = studentMatch[1];
    }

    return result;
  } catch (error) {
    return {
      originalRollNumber: rollNumber,
      error: 'Failed to parse roll number',
    };
  }
};

/**
 * Format parsed roll number into readable string
 */
export const formatRollNumberInfo = (parsedData) => {
  if (!parsedData || parsedData.error) {
    return null;
  }

  const parts = [];
  
  if (parsedData.joiningYear) {
    parts.push(`Year: ${parsedData.joiningYear}`);
  }
  
  if (parsedData.entryTypeLabel) {
    parts.push(`Entry: ${parsedData.entryTypeLabel}`);
  }
  
  if (parsedData.department) {
    parts.push(`Branch: ${parsedData.department}`);
  }
  
  if (parsedData.studentNumber) {
    parts.push(`Student #: ${parsedData.studentNumber}`);
  }

  return parts.join('\n');
};

export default parseRollNumber;

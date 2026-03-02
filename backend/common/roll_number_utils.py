"""
Roll Number Utility Functions
Format: YYBQXABC## (10 digits)
- YY: College start year (2 digits)
- BQ: Constant
- X: 1 for regular (4-year BTech), 5 for lateral entry (3-year after Diploma)
- A: Constant
- BC: Branch code (2 digits)
- ##: Student number (2 digits or A0-Z9 for overflow)
"""

import re
from datetime import datetime

# Branch codes mapping
BRANCH_CODES = {
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
}

# Reverse mapping
BRANCH_CODE_REVERSE = {v: k for k, v in BRANCH_CODES.items()}

# Full branch names
BRANCH_FULL_NAMES = {
    'CSE': 'Computer Science & Engineering',
    'CSM': 'CSE with Artificial Intelligence & Machine Learning',
    'AID': 'Artificial Intelligence & Data Science',
    'AIML': 'Artificial Intelligence & Machine Learning',
    'CSO': 'CSE with Internet of Things',
    'CIC': 'CSE with IoT and Cyber Security including Blockchain Technology',
    'ECE': 'Electronics & Communication Engineering',
    'EEE': 'Electrical & Electronics Engineering',
    'IT': 'Information Technology',
    'CIV': 'Civil Engineering',
    'MEC': 'Mechanical Engineering',
}

ENTRY_TYPES = {
    '1': 'Regular',
    '5': 'Lateral Entry',
}


def validate_roll_number(roll_number):
    """
    Validate roll number format
    Returns: (is_valid, error_message)
    """
    if not roll_number:
        return False, "Roll number is required"
    
    roll_number = roll_number.strip().upper()
    
    # Check length (should be 10 characters)
    if len(roll_number) != 10:
        return False, "Roll number must be exactly 10 characters"
    
    # Check pattern: YYBQXABC##
    pattern = r'^(\d{2})(BQ)([15])(A)(\d{2})([0-9A-Z]{2})$'
    match = re.match(pattern, roll_number)
    
    if not match:
        return False, "Invalid roll number format. Expected: YYBQXABC## (e.g., 22BQ1A4225)"
    
    year, bq, entry_type, a, branch_code, student_num = match.groups()
    
    # Validate year (should be reasonable)
    current_year = datetime.now().year % 100
    year_int = int(year)
    if year_int > current_year + 1 or year_int < current_year - 10:
        return False, f"Invalid year '{year}'. Should be between {current_year - 10} and {current_year + 1}"
    
    # Validate branch code
    if branch_code not in BRANCH_CODES:
        return False, f"Invalid branch code '{branch_code}'. Valid codes: {', '.join(BRANCH_CODES.keys())}"
    
    # Validate student number format
    # First character: digit or A-Z
    # Second character: digit
    if not (student_num[0].isdigit() or student_num[0].isalpha()) or not student_num[1].isdigit():
        return False, f"Invalid student number '{student_num}'"
    
    return True, None


def parse_roll_number(roll_number):
    """
    Parse roll number and extract information
    Returns: dict with parsed information or None if invalid
    """
    is_valid, error = validate_roll_number(roll_number)
    if not is_valid:
        return None
    
    roll_number = roll_number.strip().upper()
    
    year = roll_number[0:2]
    entry_type = roll_number[4]
    branch_code = roll_number[6:8]
    student_num = roll_number[8:10]
    
    # Calculate actual student number
    actual_student_num = calculate_student_number(student_num)
    
    # Get branch short name
    branch_short = BRANCH_CODES.get(branch_code, 'Unknown')
    
    return {
        'roll_number': roll_number,
        'year': f"20{year}",
        'year_short': year,
        'entry_type': ENTRY_TYPES.get(entry_type, 'Unknown'),
        'entry_type_code': entry_type,
        'branch_code': branch_code,
        'branch_short': branch_short,
        'branch_full': BRANCH_FULL_NAMES.get(branch_short, branch_short),
        'student_number': student_num,
        'actual_student_number': actual_student_num,
        'is_lateral_entry': entry_type == '5',
        'is_regular': entry_type == '1',
        'course_duration': 3 if entry_type == '5' else 4,
    }


def calculate_student_number(student_num_str):
    """
    Calculate actual student number from string
    Examples: 
    - '25' -> 25
    - 'A1' -> 101 (100 + 1)
    - 'B5' -> 115 (100 + 10 + 5)
    - 'Z9' -> 269 (100 + 260 - 10 + 9)
    """
    if student_num_str.isdigit():
        return int(student_num_str)
    
    # First character is letter (overflow indicator)
    letter = student_num_str[0]
    digit = int(student_num_str[1])
    
    # A=100, B=110, C=120, ..., Z=360
    letter_value = (ord(letter) - ord('A')) * 10
    
    return 100 + letter_value + digit


def get_branch_code(branch_short):
    """Get branch code from short name"""
    return BRANCH_CODE_REVERSE.get(branch_short.upper())


def generate_roll_number(year, entry_type, branch_short, student_number):
    """
    Generate roll number from components
    Args:
        year: int (2022, 2023, etc.) or str ('22', '23')
        entry_type: str ('1' for regular, '5' for lateral)
        branch_short: str (CSE, CSM, etc.)
        student_number: int (1-999+)
    Returns: str (roll number) or None if invalid
    """
    # Convert year
    if isinstance(year, int):
        year_str = str(year)[-2:]
    else:
        year_str = str(year)
    
    # Get branch code
    branch_code = get_branch_code(branch_short)
    if not branch_code:
        return None
    
    # Convert student number to string format
    if student_number < 100:
        student_str = f"{student_number:02d}"
    else:
        # Calculate overflow format (A0-Z9)
        overflow = student_number - 100
        letter_index = overflow // 10
        digit = overflow % 10
        if letter_index > 25:  # Z is max
            return None
        letter = chr(ord('A') + letter_index)
        student_str = f"{letter}{digit}"
    
    return f"{year_str}BQ{entry_type}A{branch_code}{student_str}"


def encrypt_roll_number(roll_number):
    """
    Basic encryption for roll number (can be enhanced)
    """
    # Simple base64 encoding for now
    import base64
    return base64.b64encode(roll_number.encode()).decode()


def decrypt_roll_number(encrypted):
    """
    Decrypt roll number
    """
    import base64
    try:
        return base64.b64decode(encrypted.encode()).decode()
    except:
        return None


def get_batch_year(roll_number):
    """Get batch year from roll number"""
    info = parse_roll_number(roll_number)
    return info['year'] if info else None


def get_department(roll_number):
    """Get department from roll number"""
    info = parse_roll_number(roll_number)
    return info['branch_short'] if info else None


def is_same_batch(roll_number1, roll_number2):
    """Check if two roll numbers are from same batch"""
    year1 = get_batch_year(roll_number1)
    year2 = get_batch_year(roll_number2)
    return year1 == year2 if year1 and year2 else False


def is_same_department(roll_number1, roll_number2):
    """Check if two roll numbers are from same department"""
    dept1 = get_department(roll_number1)
    dept2 = get_department(roll_number2)
    return dept1 == dept2 if dept1 and dept2 else False


def calculate_passout_year(roll_number):
    """
    Calculate passout year from roll number.
    B.Tech regular (entry_type='1'): joining year + 4 years
    Lateral entry (entry_type='5'): joining year + 3 years
    
    Example: 22BQ1A4225 -> 2022 + 4 = 2026
    Example: 22BQ5A4225 -> 2022 + 3 = 2025
    
    Returns: int (passout year) or None if invalid roll number
    """
    info = parse_roll_number(roll_number)
    if not info:
        return None
    
    joining_year = int(info['year'])
    
    if info['is_lateral_entry']:
        # Lateral entry: joining year + 3 years
        return joining_year + 3
    else:
        # Regular B.Tech: joining year + 4 years
        return joining_year + 4


def get_passout_date(roll_number):
    """
    Get the passout date (March 31st of passout year) from roll number.
    
    Returns: datetime object or None if invalid roll number
    """
    passout_year = calculate_passout_year(roll_number)
    if not passout_year:
        return None
    
    # Passout date is March 31st of the passout year
    from datetime import datetime
    return datetime(passout_year, 3, 31)


def is_alumni(roll_number):
    """
    Determine if a person is alumni based on their roll number.
    If passout date (March 31st of passout year) < current date, they are alumni.
    Otherwise, they are a current student.
    
    Returns: bool (True if alumni, False if current student) or None if invalid roll number
    """
    passout_date = get_passout_date(roll_number)
    if not passout_date:
        return None
    
    from datetime import datetime
    current_date = datetime.now()
    
    return current_date > passout_date


def get_academic_status(roll_number):
    """
    Get detailed academic status information from roll number.
    
    Returns: dict with status info or None if invalid
    """
    info = parse_roll_number(roll_number)
    if not info:
        return None
    
    passout_year = calculate_passout_year(roll_number)
    passout_date = get_passout_date(roll_number)
    is_alumni_status = is_alumni(roll_number)
    
    from datetime import datetime
    current_date = datetime.now()
    joining_year = int(info['year'])
    
    # Calculate years since joining
    years_since_joining = current_date.year - joining_year
    if current_date.month < 7:  # Academic year typically starts in July
        years_since_joining -= 1
    
    # Determine current year of study (1-4 for regular, 1-3 for lateral)
    if is_alumni_status:
        current_year_of_study = None
        status = 'alumni'
    else:
        max_years = 3 if info['is_lateral_entry'] else 4
        current_year_of_study = min(max(years_since_joining, 1), max_years)
        status = 'student'
    
    return {
        'roll_number': roll_number,
        'joining_year': joining_year,
        'passout_year': passout_year,
        'passout_date': passout_date.strftime('%Y-%m-%d'),
        'is_alumni': is_alumni_status,
        'status': status,
        'current_year_of_study': current_year_of_study,
        'is_lateral_entry': info['is_lateral_entry'],
        'department': info['branch_short'],
    }

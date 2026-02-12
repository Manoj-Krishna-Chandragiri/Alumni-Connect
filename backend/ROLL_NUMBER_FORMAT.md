# Roll Number Format Documentation

## Overview
The Alumni Connect platform uses a standardized 10-digit roll number format to uniquely identify students and alumni.

## Format Structure

```
YY BQ X A BC ##
```

### Format Breakdown

| Position | Length | Field | Description | Example |
|----------|--------|-------|-------------|---------|
| 1-2 | 2 | YY | College joining year (last 2 digits) | 22 (for 2022) |
| 3-4 | 2 | BQ | Constant identifier | BQ |
| 5 | 1 | X | Entry type | 1 (Regular), 5 (Lateral) |
| 6 | 1 | A | Constant identifier | A |
| 7-8 | 2 | BC | Branch code | 42 (CSM) |
| 9-10 | 2 | ## | Student number | 25, A1, B9 |

## Branch Codes

| Code | Short Name | Full Name |
|------|-----------|-----------|
| 01 | CIV | Civil Engineering |
| 02 | EEE | Electrical & Electronics Engineering |
| 03 | MEC | Mechanical Engineering |
| 04 | ECE | Electronics & Communication Engineering |
| 05 | CSE | Computer Science & Engineering |
| 12 | IT | Information Technology |
| 42 | CSM | CSE with Artificial Intelligence & Machine Learning |
| 47 | CIC | CSE with IoT and Cyber Security including Blockchain Technology |
| 49 | CSO | CSE with Internet of Things |
| 54 | AID | Artificial Intelligence & Data Science |
| 61 | AIML | Artificial Intelligence & Machine Learning |

## Entry Types

- **1** = Regular Entry (Direct admission)
- **5** = Lateral Entry (Join in 2nd year)

## Student Number Format

The student number (last 2 digits) supports up to 369 students per branch per year:

- **00-99**: Students 1-99 (e.g., "25" = 25th student)
- **A0-A9**: Students 100-109 (e.g., "A1" = 101st student)
- **B0-B9**: Students 110-119 (e.g., "B5" = 115th student)
- **...**
- **Z0-Z9**: Students 360-369 (e.g., "Z9" = 369th student)

Student numbers are assigned alphabetically by name within each branch.

## Examples

### Example 1: Regular Student
```
22BQ1A4225
```
- **22**: Joined in 2022
- **BQ**: Constant
- **1**: Regular entry
- **A**: Constant
- **42**: CSM (CSE with AI & ML)
- **25**: 25th student in department (alphabetical order)

**Interpretation**: Regular student who joined CSM branch in 2022, 25th student alphabetically.

### Example 2: Lateral Entry Student
```
23BQ5A05A1
```
- **23**: Joined in 2023
- **BQ**: Constant
- **5**: Lateral entry
- **A**: Constant
- **05**: CSE branch
- **A1**: 101st student in department (alphabetical order)

**Interpretation**: Lateral entry student who joined CSE branch in 2023, 101st student alphabetically.

### Example 3: Student Beyond 99
```
24BQ1A61C3
```
- **24**: Joined in 2024
- **BQ**: Constant
- **1**: Regular entry
- **A**: Constant
- **61**: AIML branch
- **C3**: 123rd student (100 + 20 + 3)

**Interpretation**: Regular student who joined AIML branch in 2024, 123rd student alphabetically.

## Validation Rules

1. **Length**: Must be exactly 10 characters
2. **Year**: Should be within reasonable range (current year ± 10 years)
3. **Constants**: Must have "BQ" at positions 3-4 and "A" at position 6
4. **Entry Type**: Must be either "1" or "5"
5. **Branch Code**: Must match one of the valid branch codes
6. **Student Number**: 
   - First character: 0-9 or A-Z
   - Second character: 0-9

## Usage in Code

### Python (Backend)
```python
from common.roll_number_utils import validate_roll_number, parse_roll_number

# Validate
is_valid, error = validate_roll_number("22BQ1A4225")

# Parse
info = parse_roll_number("22BQ1A4225")
# Returns: {
#   'roll_number': '22BQ1A4225',
#   'year': '2022',
#   'entry_type': 'Regular',
#   'branch_short': 'CSM',
#   'branch_full': 'CSE with Artificial Intelligence & Machine Learning',
#   'actual_student_number': 25,
#   'is_lateral_entry': False,
#   'is_regular': True
# }
```

### JavaScript (Frontend)
```javascript
import { validateRollNumber, parseRollNumber } from '@/utils/rollNumberUtils';

// Validate
const { isValid, error } = validateRollNumber('22BQ1A4225');

// Parse
const info = parseRollNumber('22BQ1A4225');
// Returns same structure as Python
```

## Security Considerations

1. **Encryption**: Roll numbers can be encrypted for storage using the provided utility functions
2. **Validation**: Always validate roll numbers on both frontend and backend
3. **Uniqueness**: Enforce database-level uniqueness constraints
4. **Information Exposure**: Roll numbers reveal branch and year information - consider this in public-facing features

## Database Schema

Roll numbers should be stored as:
- **Type**: String/CharField
- **Length**: 10 characters
- **Index**: Unique index for fast lookups
- **Case**: Uppercase (normalized)

Example Django model:
```python
roll_number = models.CharField(
    max_length=10,
    unique=True,
    db_index=True,
    help_text="Format: YYBQXABC## (e.g., 22BQ1A4225)"
)
```

## API Endpoints

### Validate Roll Number
```
POST /api/accounts/validate-roll-number/
Content-Type: application/json

{
  "roll_number": "22BQ1A4225"
}

Response:
{
  "success": true,
  "data": {
    "is_valid": true,
    "already_exists": false,
    "info": { ... }
  }
}
```

## Common Use Cases

1. **Registration**: Validate and parse roll number during user registration
2. **Batch Filtering**: Filter students/alumni by joining year using first 2 digits
3. **Department Filtering**: Filter by branch using digits 7-8
4. **Analytics**: Extract statistics by year, branch, entry type
5. **Recommendations**: Match students with alumni from same branch/year
6. **Sorting**: Sort students by roll number for alphabetical order within branch

## Migration Notes

If migrating from old system:
1. Validate all existing roll numbers against new format
2. Update any that don't match (with approval)
3. Maintain backwards compatibility with old formats temporarily
4. Add validation to prevent new invalid entries
5. Document any exceptions or special cases

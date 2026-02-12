# Passout Year Calculation Logic

## Overview
This document describes the automatic passout year calculation logic implemented in the Alumni Connect system. The system now automatically calculates graduation/passout years from roll numbers and determines whether a person is an alumni or current student.

## Roll Number Format
Roll numbers follow the format: **YYBQXABC##**
- **YY**: Joining year (2 digits, e.g., "22" = 2022)
- **BQ**: Constant identifier
- **X**: Entry type (1 = Regular, 5 = Lateral Entry)
- **A**: Constant
- **BC**: Branch/Department code (2 digits)
- **##**: Student number

### Examples:
- `22BQ1A4225` = Joined 2022, Regular entry, CSE branch, Student #25
- `22BQ5A4235` = Joined 2022, Lateral entry, CSE branch, Student #35
- `19BQ1A0501` = Joined 2019, Regular entry, Civil Engineering, Student #01

## Passout Year Calculation Rules

### Rule 1: Regular B.Tech Students
**Formula**: `Passout Year = Joining Year + 4 years`

**Examples**:
- Roll No: `22BQ1A4225` → Joined: 2022 → Passout: 2026
- Roll No: `20BQ1A0501` → Joined: 2020 → Passout: 2024
- Roll No: `18BQ1A1201` → Joined: 2018 → Passout: 2022

### Rule 2: Lateral Entry Students
**Formula**: `Passout Year = Joining Year + 3 years`

**Examples**:
- Roll No: `22BQ5A4225` → Joined: 2022 → Passout: 2025 (lateral entry)
- Roll No: `21BQ5A0501` → Joined: 2021 → Passout: 2024 (lateral entry)

## Alumni Status Determination

### Passout Date
The official passout date is **March 31st** of the passout year.

### Alumni vs Student Logic
```
IF current_date > March 31st of passout_year:
    Status = "Alumni"
ELSE:
    Status = "Current Student"
```

### Examples (as of February 2026):

| Roll Number | Joining | Entry Type | Passout Year | Passout Date | Status |
|-------------|---------|------------|--------------|--------------|--------|
| 22BQ1A4225  | 2022    | Regular    | 2026         | March 31, 2026 | **Student** (not yet passed out) |
| 21BQ1A0501  | 2021    | Regular    | 2025         | March 31, 2025 | **Alumni** (passed out) |
| 20BQ1A0501  | 2020    | Regular    | 2024         | March 31, 2024 | **Alumni** (passed out) |
| 22BQ5A4235  | 2022    | Lateral    | 2025         | March 31, 2025 | **Alumni** (passed out) |
| 23BQ1A0501  | 2023    | Regular    | 2027         | March 31, 2027 | **Student** (not yet passed out) |

## Implementation Details

### 1. Backend Functions (`common/roll_number_utils.py`)

#### `calculate_passout_year(roll_number)`
Calculates the passout year from a roll number.

```python
from common.roll_number_utils import calculate_passout_year

passout_year = calculate_passout_year('22BQ1A4225')
# Returns: 2026
```

#### `get_passout_date(roll_number)`
Returns the exact passout date (March 31st of passout year).

```python
from common.roll_number_utils import get_passout_date

passout_date = get_passout_date('22BQ1A4225')
# Returns: datetime(2026, 3, 31)
```

#### `is_alumni(roll_number)`
Determines if a person is an alumni based on current date vs passout date.

```python
from common.roll_number_utils import is_alumni

is_alumni_status = is_alumni('22BQ1A4225')
# Returns: False (as of Feb 2026, not yet passed out)

is_alumni_status = is_alumni('20BQ1A0501')
# Returns: True (passed out in 2024)
```

#### `get_academic_status(roll_number)`
Returns comprehensive academic status information.

```python
from common.roll_number_utils import get_academic_status

status = get_academic_status('22BQ1A4225')
# Returns: {
#     'roll_number': '22BQ1A4225',
#     'joining_year': 2022,
#     'passout_year': 2026,
#     'passout_date': '2026-03-31',
#     'is_alumni': False,
#     'status': 'student',
#     'current_year_of_study': 3,
#     'is_lateral_entry': False,
#     'department': 'CSE'
# }
```

### 2. MongoDB Models Auto-Calculation

#### StudentProfile
When a StudentProfile is saved, the following fields are auto-calculated from `roll_no`:
- `joined_year` - Extracted from roll number
- `completion_year` - Calculated using passout year logic
- `current_year` - Calculated based on years since joining

#### AlumniProfile
When an AlumniProfile is saved without a `graduation_year`:
- `graduation_year` - Auto-calculated from `roll_no`

### 3. API Views

#### Registration
During user registration, if a roll number is provided:
- For students: `completion_year` and `joined_year` are auto-calculated
- For alumni: `graduation_year` is auto-calculated if not provided

#### Profile Updates
When updating profiles:
- If `rollNumber` is updated, graduation/completion years are recalculated automatically
- Manual graduation year inputs are overridden by calculated values when roll number is present

### 4. Utility API Endpoint

**Endpoint**: `POST /api/utils/roll-number/`

#### Validate Roll Number
```bash
POST /api/utils/roll-number/
{
  "action": "validate",
  "roll_number": "22BQ1A4225"
}

Response:
{
  "success": true,
  "data": {
    "valid": true,
    "error": null,
    "roll_number": "22BQ1A4225"
  }
}
```

#### Parse Roll Number
```bash
POST /api/utils/roll-number/
{
  "action": "parse",
  "roll_number": "22BQ1A4225"
}

Response:
{
  "success": true,
  "data": {
    "roll_number": "22BQ1A4225",
    "year": "2022",
    "year_short": "22",
    "entry_type": "Regular",
    "entry_type_code": "1",
    "branch_code": "42",
    "branch_short": "CSM",
    "branch_full": "CSE with Artificial Intelligence & Machine Learning",
    "student_number": "25",
    "actual_student_number": 25,
    "is_lateral_entry": false,
    "is_regular": true
  }
}
```

#### Get Academic Status
```bash
POST /api/utils/roll-number/
{
  "action": "status",
  "roll_number": "22BQ1A4225"
}

Response:
{
  "success": true,
  "data": {
    "roll_number": "22BQ1A4225",
    "joining_year": 2022,
    "passout_year": 2026,
    "passout_date": "2026-03-31",
    "is_alumni": false,
    "status": "student",
    "current_year_of_study": 3,
    "is_lateral_entry": false,
    "department": "CSM"
  }
}
```

## Usage in Frontend

### Check if User is Alumni
```javascript
import axios from 'axios';

async function checkAlumniStatus(rollNumber) {
  const response = await axios.post('/api/utils/roll-number/', {
    action: 'status',
    roll_number: rollNumber
  });
  
  const { is_alumni, passout_year, status } = response.data.data;
  
  if (is_alumni) {
    console.log(`Alumni - Graduated in ${passout_year}`);
  } else {
    console.log(`Current Student - Will graduate in ${passout_year}`);
  }
  
  return is_alumni;
}
```

### Auto-fill Graduation Year
```javascript
async function getGraduationYear(rollNumber) {
  const response = await axios.post('/api/utils/roll-number/', {
    action: 'status',
    roll_number: rollNumber
  });
  
  return response.data.data.passout_year;
}
```

## Database Migration

### Updating Existing Records
If you have existing student/alumni records without proper graduation years, run:

```bash
cd backend
python scripts/update_graduation_years.py
```

This script will:
1. Find all profiles with roll numbers
2. Calculate passout/graduation years from roll numbers
3. Update the database records
4. Generate a report of changes

## Seed Data Updates

The seed data script (`backend/scripts/seed_data.py`) now:
- Uses proper roll number format
- Auto-calculates graduation years
- Prints calculated values for verification

Run seed data:
```bash
cd backend
python scripts/seed_data.py
```

## Testing

### Test Roll Numbers
Use these test roll numbers for different scenarios:

**Current Students (as of Feb 2026)**:
- `22BQ1A0501` - Regular, CSE, Year 3, Passout 2026
- `23BQ1A0501` - Regular, CSE, Year 2, Passout 2027
- `24BQ5A0501` - Lateral, CSE, Year 1, Passout 2027

**Alumni (as of Feb 2026)**:
- `20BQ1A0501` - Regular, CSE, Graduated 2024
- `19BQ1A0501` - Regular, CSE, Graduated 2023
- `21BQ5A0501` - Lateral, CSE, Graduated 2024

### Manual Testing
```python
# In Django shell or Python script
from common.roll_number_utils import *

# Test various roll numbers
test_rolls = ['22BQ1A4225', '20BQ1A0501', '21BQ5A0501']

for roll in test_rolls:
    status = get_academic_status(roll)
    print(f"Roll: {roll}")
    print(f"  Passout: {status['passout_year']}")
    print(f"  Status: {status['status']}")
    print(f"  Is Alumni: {status['is_alumni']}")
    print()
```

## Benefits

1. **Consistency**: All graduation years calculated using same logic
2. **Automation**: No manual entry of graduation years needed
3. **Accuracy**: Reduces human error in data entry
4. **Flexibility**: Easy to modify logic if rules change
5. **Real-time**: Alumni status determined dynamically based on current date
6. **Standardization**: Works across entire codebase (backend, frontend, database)

## Future Enhancements

1. **Custom Academic Calendars**: Support for different academic year start/end dates
2. **Course Duration Variations**: Support for 3-year, 5-year programs
3. **Gap Years**: Handle cases where students take breaks
4. **Early/Late Graduation**: Support for students who graduate early or late
5. **Batch Management**: Automatic batch assignment based on joining year

## Support

For questions or issues with the passout year logic, contact the development team or refer to:
- `backend/common/roll_number_utils.py` - Core logic implementation
- `backend/common/models.py` - Model auto-calculation
- `backend/api/views.py` - API implementation

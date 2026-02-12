"""
Test script for passout year calculation logic.
Run with: python test_passout_logic.py
"""
import os
import sys
from datetime import datetime

# Add the backend directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

import django
django.setup()

from common.roll_number_utils import (
    validate_roll_number, parse_roll_number,
    calculate_passout_year, get_passout_date,
    is_alumni, get_academic_status
)


def print_header(title):
    """Print a formatted header."""
    print("\n" + "=" * 80)
    print(f"  {title}")
    print("=" * 80)


def test_roll_numbers():
    """Test various roll numbers."""
    print_header("PASSOUT YEAR CALCULATION TESTS")
    
    # Test cases: (roll_number, description)
    test_cases = [
        ('22BQ1A4225', '2022 Regular Entry, CSE (should be current student, passout 2026)'),
        ('22BQ5A4225', '2022 Lateral Entry, CSE (should be alumni, passout 2025)'),
        ('20BQ1A0501', '2020 Regular Entry, Civil (should be alumni, passout 2024)'),
        ('19BQ1A0501', '2019 Regular Entry, Civil (should be alumni, passout 2023)'),
        ('23BQ1A0501', '2023 Regular Entry, Civil (should be current student, passout 2027)'),
        ('21BQ5A0501', '2021 Lateral Entry, Civil (should be alumni, passout 2024)'),
    ]
    
    current_date = datetime.now().strftime('%Y-%m-%d')
    print(f"\nCurrent Date: {current_date}\n")
    print("-" * 80)
    
    for roll_no, description in test_cases:
        print(f"\n📋 Test Case: {roll_no}")
        print(f"Description: {description}")
        print("-" * 80)
        
        # Validate
        is_valid, error = validate_roll_number(roll_no)
        print(f"✓ Valid: {is_valid}")
        if not is_valid:
            print(f"  Error: {error}")
            continue
        
        # Parse
        info = parse_roll_number(roll_no)
        if info:
            print(f"✓ Parsed Info:")
            print(f"  - Joining Year: {info['year']}")
            print(f"  - Entry Type: {info['entry_type']} ({info['entry_type_code']})")
            print(f"  - Department: {info['branch_short']} ({info['branch_full']})")
            print(f"  - Student Number: {info['student_number']}")
        
        # Calculate passout year
        passout_year = calculate_passout_year(roll_no)
        print(f"✓ Passout Year: {passout_year}")
        
        # Get passout date
        passout_date = get_passout_date(roll_no)
        print(f"✓ Passout Date: {passout_date.strftime('%B %d, %Y') if passout_date else 'N/A'}")
        
        # Check alumni status
        is_alumni_status = is_alumni(roll_no)
        print(f"✓ Is Alumni: {is_alumni_status}")
        
        # Get full status
        status = get_academic_status(roll_no)
        if status:
            print(f"✓ Status: {status['status'].upper()}")
            if status['current_year_of_study']:
                print(f"  - Current Year of Study: {status['current_year_of_study']}")
            print(f"  - Is Lateral Entry: {status['is_lateral_entry']}")
    
    print("\n" + "=" * 80)


def test_edge_cases():
    """Test edge cases."""
    print_header("EDGE CASE TESTS")
    
    edge_cases = [
        ('', 'Empty string'),
        ('INVALID', 'Invalid format'),
        ('22BQ1A99XX', 'Invalid student number'),
        ('99BQ1A4225', 'Invalid year (future)'),
        ('10BQ1A4225', 'Old year (2010)'),
    ]
    
    print()
    for roll_no, description in edge_cases:
        print(f"\n📋 Test: {description}")
        print(f"Roll Number: '{roll_no}'")
        print("-" * 80)
        
        is_valid, error = validate_roll_number(roll_no)
        if is_valid:
            print(f"✓ Valid: {is_valid}")
            status = get_academic_status(roll_no)
            if status:
                print(f"  Passout Year: {status['passout_year']}")
                print(f"  Status: {status['status']}")
        else:
            print(f"✗ Invalid: {error}")
    
    print("\n" + "=" * 80)


def test_academic_year_boundary():
    """Test roll numbers around academic year boundaries."""
    print_header("ACADEMIC YEAR BOUNDARY TESTS")
    
    # Roll numbers that will graduate in current year
    current_year = datetime.now().year
    boundary_year = current_year - 4  # For regular entry
    
    print(f"\nCurrent Year: {current_year}")
    print(f"Testing roll numbers from {boundary_year} (should have passed out in {boundary_year + 4})")
    print()
    
    # Generate test roll number for boundary year
    year_short = str(boundary_year)[-2:]
    test_roll = f"{year_short}BQ1A0501"
    
    print(f"Test Roll Number: {test_roll}")
    print("-" * 80)
    
    status = get_academic_status(test_roll)
    if status:
        print(f"Joining Year: {status['joining_year']}")
        print(f"Passout Year: {status['passout_year']}")
        print(f"Passout Date: {status['passout_date']}")
        print(f"Is Alumni: {status['is_alumni']}")
        print(f"Status: {status['status'].upper()}")
        
        if status['passout_year'] == current_year:
            current_month = datetime.now().month
            if current_month <= 3:
                print(f"\n⚠️ Special Case: Passout year is current year ({current_year})")
                print(f"   Current month: {datetime.now().strftime('%B')}")
                if status['is_alumni']:
                    print(f"   Status: Already crossed March 31, {current_year} → ALUMNI")
                else:
                    print(f"   Status: Not yet March 31, {current_year} → STUDENT")
    
    print("\n" + "=" * 80)


def print_summary_table():
    """Print a summary table of different scenarios."""
    print_header("SUMMARY TABLE")
    
    test_rolls = [
        '22BQ1A0501',  # Regular, passout 2026
        '22BQ5A0501',  # Lateral, passout 2025  
        '20BQ1A0501',  # Regular, passout 2024 (alumni)
        '19BQ1A0501',  # Regular, passout 2023 (alumni)
        '23BQ1A0501',  # Regular, passout 2027
    ]
    
    print()
    print(f"{'Roll Number':<15} {'Joined':<10} {'Entry':<12} {'Passout':<10} {'Status':<10} {'Alumni?':<10}")
    print("-" * 80)
    
    for roll in test_rolls:
        status = get_academic_status(roll)
        if status:
            print(
                f"{status['roll_number']:<15} "
                f"{status['joining_year']:<10} "
                f"{'Lateral' if status['is_lateral_entry'] else 'Regular':<12} "
                f"{status['passout_year']:<10} "
                f"{status['status'].capitalize():<10} "
                f"{'Yes' if status['is_alumni'] else 'No':<10}"
            )
    
    print("\n" + "=" * 80)


def main():
    """Main test function."""
    print("\n")
    print("*" * 80)
    print("*" + " " * 78 + "*")
    print("*" + "  ALUMNI CONNECT - PASSOUT YEAR CALCULATION LOGIC TEST SUITE".center(78) + "*")
    print("*" + " " * 78 + "*")
    print("*" * 80)
    
    # Run all tests
    test_roll_numbers()
    test_edge_cases()
    test_academic_year_boundary()
    print_summary_table()
    
    print("\n")
    print("*" * 80)
    print("*" + "  ALL TESTS COMPLETED".center(78) + "*")
    print("*" * 80)
    print()


if __name__ == '__main__':
    main()

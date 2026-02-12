"""
Update existing records with calculated graduation/completion years.
Run with: python update_graduation_years.py
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

from common.models import StudentProfile, AlumniProfile
from common.roll_number_utils import (
    calculate_passout_year, parse_roll_number, get_academic_status
)


def update_student_profiles():
    """Update all student profiles with calculated years."""
    print("\n" + "=" * 80)
    print("  UPDATING STUDENT PROFILES")
    print("=" * 80 + "\n")
    
    students = StudentProfile.objects.all()
    total = students.count()
    updated = 0
    skipped = 0
    errors = 0
    
    print(f"Found {total} student profiles\n")
    
    for student in students:
        try:
            if not student.roll_no:
                print(f"⚠️  Skipped: {student.user.email} (no roll number)")
                skipped += 1
                continue
            
            # Calculate values
            info = parse_roll_number(student.roll_no)
            completion_year = calculate_passout_year(student.roll_no)
            status = get_academic_status(student.roll_no)
            
            if not info or not completion_year or not status:
                print(f"❌ Error: {student.user.email} - Invalid roll number: {student.roll_no}")
                errors += 1
                continue
            
            # Store old values
            old_completion = student.completion_year
            old_joined = student.joined_year
            old_current_year = student.current_year
            
            # Update values
            student.completion_year = completion_year
            student.joined_year = int(info['year'])
            if status['current_year_of_study']:
                student.current_year = status['current_year_of_study']
            
            # Save
            student.save()
            
            # Print update
            print(f"✓ Updated: {student.user.email}")
            print(f"  Roll Number: {student.roll_no}")
            print(f"  Joined Year: {old_joined} → {student.joined_year}")
            print(f"  Completion Year: {old_completion} → {student.completion_year}")
            print(f"  Current Year: {old_current_year} → {student.current_year}")
            print(f"  Status: {status['status']}")
            print()
            
            updated += 1
            
        except Exception as e:
            print(f"❌ Error updating {student.user.email}: {str(e)}")
            errors += 1
    
    print("-" * 80)
    print(f"Student Profiles Summary:")
    print(f"  Total: {total}")
    print(f"  Updated: {updated}")
    print(f"  Skipped: {skipped}")
    print(f"  Errors: {errors}")
    print("=" * 80)
    
    return updated, skipped, errors


def update_alumni_profiles():
    """Update all alumni profiles with calculated graduation years."""
    print("\n" + "=" * 80)
    print("  UPDATING ALUMNI PROFILES")
    print("=" * 80 + "\n")
    
    alumni = AlumniProfile.objects.all()
    total = alumni.count()
    updated = 0
    skipped = 0
    errors = 0
    
    print(f"Found {total} alumni profiles\n")
    
    for alum in alumni:
        try:
            if not alum.roll_no:
                print(f"⚠️  Skipped: {alum.user.email} (no roll number)")
                skipped += 1
                continue
            
            # Calculate graduation year
            calculated_grad_year = calculate_passout_year(alum.roll_no)
            status = get_academic_status(alum.roll_no)
            
            if not calculated_grad_year or not status:
                print(f"❌ Error: {alum.user.email} - Invalid roll number: {alum.roll_no}")
                errors += 1
                continue
            
            # Store old value
            old_grad_year = alum.graduation_year
            
            # Update if different or missing
            if not alum.graduation_year or alum.graduation_year != calculated_grad_year:
                alum.graduation_year = calculated_grad_year
                alum.save()
                
                print(f"✓ Updated: {alum.user.email}")
                print(f"  Roll Number: {alum.roll_no}")
                print(f"  Graduation Year: {old_grad_year} → {alum.graduation_year}")
                print(f"  Status: {status['status']}")
                print(f"  Is Alumni: {status['is_alumni']}")
                print()
                
                updated += 1
            else:
                print(f"→ No change: {alum.user.email} (already correct: {alum.graduation_year})")
                skipped += 1
            
        except Exception as e:
            print(f"❌ Error updating {alum.user.email}: {str(e)}")
            errors += 1
    
    print("-" * 80)
    print(f"Alumni Profiles Summary:")
    print(f"  Total: {total}")
    print(f"  Updated: {updated}")
    print(f"  Skipped: {skipped}")
    print(f"  Errors: {errors}")
    print("=" * 80)
    
    return updated, skipped, errors


def generate_report():
    """Generate a report of all profiles with their calculated values."""
    print("\n" + "=" * 80)
    print("  GENERATING REPORT")
    print("=" * 80 + "\n")
    
    report_file = 'graduation_year_update_report.txt'
    
    with open(report_file, 'w') as f:
        f.write("ALUMNI CONNECT - GRADUATION YEAR UPDATE REPORT\n")
        f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("=" * 80 + "\n\n")
        
        # Students
        f.write("STUDENT PROFILES\n")
        f.write("-" * 80 + "\n")
        f.write(f"{'Email':<35} {'Roll No':<15} {'Joined':<10} {'Passout':<10} {'Status':<10}\n")
        f.write("-" * 80 + "\n")
        
        students = StudentProfile.objects.all()
        for student in students:
            if student.roll_no:
                status = get_academic_status(student.roll_no)
                if status:
                    f.write(
                        f"{student.user.email:<35} "
                        f"{student.roll_no:<15} "
                        f"{status['joining_year']:<10} "
                        f"{status['passout_year']:<10} "
                        f"{status['status']:<10}\n"
                    )
        
        f.write("\n\n")
        
        # Alumni
        f.write("ALUMNI PROFILES\n")
        f.write("-" * 80 + "\n")
        f.write(f"{'Email':<35} {'Roll No':<15} {'Joined':<10} {'Graduated':<10} {'Status':<10}\n")
        f.write("-" * 80 + "\n")
        
        alumni = AlumniProfile.objects.all()
        for alum in alumni:
            if alum.roll_no:
                status = get_academic_status(alum.roll_no)
                if status:
                    f.write(
                        f"{alum.user.email:<35} "
                        f"{alum.roll_no:<15} "
                        f"{status['joining_year']:<10} "
                        f"{status['passout_year']:<10} "
                        f"{status['status']:<10}\n"
                    )
        
        f.write("\n" + "=" * 80 + "\n")
    
    print(f"✓ Report generated: {report_file}")
    print("=" * 80)


def main():
    """Main function."""
    print("\n")
    print("*" * 80)
    print("*" + " " * 78 + "*")
    print("*" + "  ALUMNI CONNECT - DATABASE UPDATE SCRIPT".center(78) + "*")
    print("*" + "  Update Graduation/Completion Years from Roll Numbers".center(78) + "*")
    print("*" + " " * 78 + "*")
    print("*" * 80)
    
    # Confirm before proceeding
    print("\n⚠️  This script will update existing database records.")
    print("   Make sure you have a backup of your database before proceeding.\n")
    
    response = input("Do you want to continue? (yes/no): ").lower().strip()
    
    if response != 'yes':
        print("\n❌ Update cancelled.")
        return
    
    # Update profiles
    student_stats = update_student_profiles()
    alumni_stats = update_alumni_profiles()
    
    # Generate report
    generate_report()
    
    # Final summary
    print("\n\n")
    print("*" * 80)
    print("*" + "  UPDATE COMPLETE".center(78) + "*")
    print("*" * 80)
    print("\nSummary:")
    print(f"  Students - Updated: {student_stats[0]}, Skipped: {student_stats[1]}, Errors: {student_stats[2]}")
    print(f"  Alumni   - Updated: {alumni_stats[0]}, Skipped: {alumni_stats[1]}, Errors: {alumni_stats[2]}")
    print(f"  Total Updated: {student_stats[0] + alumni_stats[0]}")
    print("\n" + "*" * 80 + "\n")


if __name__ == '__main__':
    main()

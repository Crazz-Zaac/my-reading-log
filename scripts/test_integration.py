#!/usr/bin/env python3
"""
Test script for Google Sheets integration

This script helps test the Google Sheets to Reading Log integration
without running the full GitHub Actions workflow.

Usage:
    python scripts/test_integration.py --sheet-id YOUR_SHEET_ID
"""

import argparse
import sys
import os

# Add the scripts directory to the path so we can import our module
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fetch_google_sheets import fetch_sheet_data, convert_row_to_entry, generate_js_file

def test_sheet_access(sheet_id: str, api_key: str = None):
    """Test if we can access the Google Sheet."""
    print("🔍 Testing Google Sheet access...")
    
    try:
        rows = fetch_sheet_data(sheet_id, "Sheet1!A:Z", api_key)
        
        if not rows:
            print("❌ No data found in sheet")
            return False
        
        print(f"✅ Successfully accessed sheet with {len(rows)} rows")
        
        # Show first few rows for verification
        print("\n📋 First few rows:")
        for i, row in enumerate(rows[:3]):
            print(f"  Row {i+1}: {row[:5]}...")  # Show first 5 columns
        
        return True
        
    except Exception as e:
        print(f"❌ Failed to access sheet: {e}")
        return False

def test_data_conversion(sheet_id: str, api_key: str = None):
    """Test the data conversion process."""
    print("\n🔄 Testing data conversion...")
    
    try:
        rows = fetch_sheet_data(sheet_id, "Sheet1!A:Z", api_key)
        
        if len(rows) < 2:
            print("❌ Need at least 2 rows (header + data)")
            return False
        
        headers = [header.lower().replace(' ', '_') for header in rows[0]]
        data_rows = rows[1:]
        
        print(f"📊 Found columns: {', '.join(headers)}")
        
        # Test converting first data row
        if data_rows:
            test_row = data_rows[0]
            entry = convert_row_to_entry(headers, test_row)
            
            print(f"\n📝 Sample converted entry:")
            print(f"  ID: {entry.get('id', 'N/A')}")
            print(f"  Title: {entry.get('title', 'N/A')}")
            print(f"  Author: {entry.get('author', 'N/A')}")
            print(f"  Type: {entry.get('type', 'N/A')}")
            print(f"  Status: {entry.get('status', 'N/A')}")
            print(f"  Tags: {entry.get('tags', [])}")
            
            print("✅ Data conversion successful")
            return True
        else:
            print("❌ No data rows to convert")
            return False
            
    except Exception as e:
        print(f"❌ Data conversion failed: {e}")
        return False

def test_file_generation(sheet_id: str, api_key: str = None):
    """Test generating the JavaScript file."""
    print("\n📁 Testing file generation...")
    
    try:
        rows = fetch_sheet_data(sheet_id, "Sheet1!A:Z", api_key)
        
        if len(rows) < 2:
            print("❌ Need at least 2 rows (header + data)")
            return False
        
        headers = [header.lower().replace(' ', '_') for header in rows[0]]
        data_rows = rows[1:]
        
        # Convert all rows
        entries = []
        for row in data_rows:
            if any(cell.strip() for cell in row):  # Skip empty rows
                entry = convert_row_to_entry(headers, row)
                entries.append(entry)
        
        # Generate test file
        test_output = "test_output.js"
        generate_js_file(entries, test_output)
        
        # Verify file was created
        if os.path.exists(test_output):
            file_size = os.path.getsize(test_output)
            print(f"✅ Generated test file: {test_output} ({file_size} bytes)")
            
            # Clean up test file
            os.remove(test_output)
            print("🧹 Cleaned up test file")
            
            return True
        else:
            print("❌ Test file was not created")
            return False
            
    except Exception as e:
        print(f"❌ File generation failed: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Test Google Sheets integration')
    parser.add_argument('--sheet-id', required=True, help='Google Sheet ID to test')
    parser.add_argument('--api-key', help='Google Sheets API key (optional)')
    
    args = parser.parse_args()
    
    print("🧪 Testing Google Sheets Integration")
    print("=" * 50)
    
    # Test 1: Sheet access
    if not test_sheet_access(args.sheet_id, args.api_key):
        print("\n❌ Sheet access test failed. Please check:")
        print("  1. Sheet ID is correct")
        print("  2. Sheet is publicly accessible OR API key is valid")
        print("  3. Sheet contains data")
        sys.exit(1)
    
    # Test 2: Data conversion
    if not test_data_conversion(args.sheet_id, args.api_key):
        print("\n❌ Data conversion test failed. Please check:")
        print("  1. First row contains column headers")
        print("  2. Data rows contain valid information")
        print("  3. Required columns (title, author) are present")
        sys.exit(1)
    
    # Test 3: File generation
    if not test_file_generation(args.sheet_id, args.api_key):
        print("\n❌ File generation test failed. Please check:")
        print("  1. Write permissions in current directory")
        print("  2. Data format is valid")
        sys.exit(1)
    
    print("\n🎉 All tests passed!")
    print("\n✅ Your Google Sheets integration is ready to use!")
    print("\nNext steps:")
    print("  1. Set up GitHub repository secrets")
    print("  2. Configure the GitHub Actions workflow")
    print("  3. Test the automated workflow")
    print("\nSee GOOGLE_FORMS_SETUP.md for detailed instructions.")

if __name__ == '__main__':
    main()


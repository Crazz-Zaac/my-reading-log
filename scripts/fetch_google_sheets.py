#!/usr/bin/env python3
"""
Google Sheets to Reading Log Data Converter

This script fetches data from a Google Sheet and converts it to the JSON format
used by the Personal Reading Log application.

Requirements:
1. Google Sheet must be publicly accessible or use API key authentication
2. Sheet should have columns matching the reading log data structure
3. First row should contain headers

Usage:
    python fetch_google_sheets.py --sheet-id YOUR_SHEET_ID --output-file src/data/readingData.js

Environment Variables:
    GOOGLE_SHEETS_API_KEY: Your Google Sheets API key (optional for public sheets)
    GOOGLE_SHEET_ID: Default sheet ID to use
    GOOGLE_SHEET_RANGE: Default range to fetch (default: Sheet1!A:Z)
"""

import argparse
import json
import os
import sys
import requests
from datetime import datetime
from typing import Dict, List, Any, Optional

# Column mapping from Google Sheets to reading log format
COLUMN_MAPPING = {
    'id': 'id',
    'title': 'title', 
    'author': 'author',
    'link': 'link',
    'type': 'type',
    'platform': 'platform',
    'language': 'language',
    'tags': 'tags',
    'status': 'status',
    'rating': 'rating',
    'rating_description': 'ratingDescription',
    'key_insights': 'keyInsights',
    'quotes': 'quotes',
    'impact': 'impact',
    'length': 'length',
    'difficulty': 'difficulty',
    'related_to': 'relatedTo',
    'personal_reflection': 'personalReflection',
    'citation_format': 'citationFormat',
    'date_added': 'dateAdded',
    'date_read': 'dateRead'
}

def fetch_sheet_data(sheet_id: str, range_name: str = "Sheet1!A:Z", api_key: Optional[str] = None) -> List[List[str]]:
    """
    Fetch data from Google Sheets using the Sheets API.
    
    Args:
        sheet_id: The Google Sheet ID
        range_name: The range to fetch (A1 notation)
        api_key: Google Sheets API key (optional for public sheets)
    
    Returns:
        List of rows, where each row is a list of cell values
    """
    # Try public CSV export first (simpler approach)
    csv_url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv&gid=0"
    
    try:
        response = requests.get(csv_url)
        if response.status_code == 200:
            # Parse CSV data
            import csv
            import io
            
            csv_data = []
            reader = csv.reader(io.StringIO(response.text))
            for row in reader:
                csv_data.append(row)
            
            print(f"✓ Successfully fetched {len(csv_data)} rows from public CSV export")
            return csv_data
            
    except Exception as e:
        print(f"⚠ CSV export failed: {e}")
    
    # Fallback to Sheets API
    if not api_key:
        api_key = os.getenv('GOOGLE_SHEETS_API_KEY')
        
    if not api_key:
        print("❌ No API key provided and CSV export failed. Please:")
        print("   1. Make your Google Sheet publicly viewable, OR")
        print("   2. Set GOOGLE_SHEETS_API_KEY environment variable")
        sys.exit(1)
    
    api_url = f"https://sheets.googleapis.com/v4/spreadsheets/{sheet_id}/values/{range_name}"
    params = {'key': api_key}
    
    try:
        response = requests.get(api_url, params=params)
        response.raise_for_status()
        
        data = response.json()
        values = data.get('values', [])
        
        print(f"✓ Successfully fetched {len(values)} rows from Sheets API")
        return values
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to fetch data from Sheets API: {e}")
        sys.exit(1)

def parse_tags(tags_str: str) -> List[str]:
    """Parse tags from string format (comma-separated)."""
    if not tags_str:
        return []
    return [tag.strip() for tag in tags_str.split(',') if tag.strip()]

def parse_quotes(quotes_str: str) -> List[str]:
    """Parse quotes from string format (pipe-separated)."""
    if not quotes_str:
        return []
    return [quote.strip() for quote in quotes_str.split('|') if quote.strip()]

def parse_related_to(related_str: str) -> List[str]:
    """Parse related IDs from string format (comma-separated)."""
    if not related_str:
        return []
    return [id.strip() for id in related_str.split(',') if id.strip()]

def convert_row_to_entry(headers: List[str], row: List[str]) -> Dict[str, Any]:
    """
    Convert a spreadsheet row to a reading log entry.
    
    Args:
        headers: List of column headers
        row: List of cell values for this row
    
    Returns:
        Dictionary representing a reading log entry
    """
    # Create a mapping from headers to values
    row_data = {}
    for i, header in enumerate(headers):
        value = row[i] if i < len(row) else ""
        row_data[header.lower().replace(' ', '_')] = value.strip()
    
    # Convert to reading log format
    entry = {}
    
    for sheet_col, log_field in COLUMN_MAPPING.items():
        value = row_data.get(sheet_col, "")
        
        if not value:
            # Set defaults for required fields
            if log_field == 'id':
                # Generate ID from title if not provided
                title = row_data.get('title', '')
                entry[log_field] = title.lower().replace(' ', '_').replace('-', '_')[:50] if title else f"entry_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            elif log_field == 'tags':
                entry[log_field] = []
            elif log_field == 'quotes':
                entry[log_field] = []
            elif log_field == 'relatedTo':
                entry[log_field] = []
            elif log_field in ['rating', 'impact']:
                entry[log_field] = None
            elif log_field == 'language':
                entry[log_field] = 'en'
            elif log_field == 'status':
                entry[log_field] = 'to-read'
            else:
                entry[log_field] = value
        else:
            # Process specific field types
            if log_field == 'tags':
                entry[log_field] = parse_tags(value)
            elif log_field == 'quotes':
                entry[log_field] = parse_quotes(value)
            elif log_field == 'relatedTo':
                entry[log_field] = parse_related_to(value)
            elif log_field in ['rating', 'impact']:
                try:
                    entry[log_field] = int(float(value)) if value else None
                except ValueError:
                    entry[log_field] = None
            else:
                entry[log_field] = value
    
    return entry

def generate_js_file(entries: List[Dict[str, Any]], output_file: str):
    """
    Generate the JavaScript data file for the reading log.
    
    Args:
        entries: List of reading log entries
        output_file: Path to output JavaScript file
    """
    js_content = f'''// Auto-generated from Google Sheets on {datetime.now().isoformat()}
// Do not edit this file manually - changes will be overwritten

export const allSampleData = {json.dumps(entries, indent=2, ensure_ascii=False)};

export const getReadingStats = (data) => {{
  const readItems = data.filter(item => item.status === 'read').length;
  const inProgress = data.filter(item => item.status === 'in-progress').length;
  const toRead = data.filter(item => item.status === 'to-read').length;
  
  const ratedItems = data.filter(item => item.rating !== null);
  const averageRating = ratedItems.length > 0 
    ? (ratedItems.reduce((sum, item) => sum + item.rating, 0) / ratedItems.length).toFixed(1)
    : 0;
    
  const impactItems = data.filter(item => item.impact !== null);
  const averageImpact = impactItems.length > 0
    ? (impactItems.reduce((sum, item) => sum + item.impact, 0) / impactItems.length).toFixed(1)
    : 0;

  return {{
    totalItems: data.length,
    readItems,
    inProgress,
    toRead,
    averageRating: parseFloat(averageRating),
    averageImpact: parseFloat(averageImpact)
  }};
}};

export const getTagFrequency = (data) => {{
  const tagCounts = {{}};
  data.forEach(item => {{
    item.tags.forEach(tag => {{
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }});
  }});
  return tagCounts;
}};
'''
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"✓ Generated {output_file} with {len(entries)} entries")

def main():
    parser = argparse.ArgumentParser(description='Fetch Google Sheets data and convert to reading log format')
    parser.add_argument('--sheet-id', required=True, help='Google Sheet ID')
    parser.add_argument('--range', default='Sheet1!A:Z', help='Sheet range to fetch (default: Sheet1!A:Z)')
    parser.add_argument('--output-file', default='src/data/readingData.js', help='Output JavaScript file')
    parser.add_argument('--api-key', help='Google Sheets API key (optional)')
    
    args = parser.parse_args()
    
    print(f"🔄 Fetching data from Google Sheet: {args.sheet_id}")
    
    # Fetch data from Google Sheets
    rows = fetch_sheet_data(args.sheet_id, args.range, args.api_key)
    
    if not rows:
        print("❌ No data found in the sheet")
        sys.exit(1)
    
    # First row should be headers
    headers = [header.lower().replace(' ', '_') for header in rows[0]]
    data_rows = rows[1:]
    
    print(f"📊 Found columns: {', '.join(headers)}")
    print(f"📝 Processing {len(data_rows)} data rows...")
    
    # Convert rows to reading log entries
    entries = []
    for i, row in enumerate(data_rows, 1):
        if not any(cell.strip() for cell in row):  # Skip empty rows
            continue
            
        try:
            entry = convert_row_to_entry(headers, row)
            entries.append(entry)
        except Exception as e:
            print(f"⚠ Warning: Failed to process row {i}: {e}")
    
    if not entries:
        print("❌ No valid entries found")
        sys.exit(1)
    
    # Generate JavaScript file
    generate_js_file(entries, args.output_file)
    
    print(f"✅ Successfully converted {len(entries)} entries!")
    print(f"📁 Output saved to: {args.output_file}")

if __name__ == '__main__':
    main()


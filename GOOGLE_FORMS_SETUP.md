# Google Forms to Reading Log Integration Guide

This guide will help you set up an automated workflow where you can submit new reading entries via Google Forms, which automatically updates your reading log website.

## Overview

The workflow consists of:
1. **Google Form** → Collects new reading entries
2. **Google Sheets** → Stores form responses automatically
3. **GitHub Actions** → Fetches sheet data and updates your website
4. **Your Website** → Displays updated reading log

## Step 1: Create Google Form

### 1.1 Create a New Google Form

1. Go to [Google Forms](https://forms.google.com)
2. Click "Create a new form" or use this template link: [Reading Log Form Template](https://forms.gle/template-link)
3. Name your form "Personal Reading Log Entry"

### 1.2 Add Form Fields

Create the following fields in your Google Form:

#### Required Fields:
- **Title** (Short answer, Required)
- **Author** (Short answer, Required)
- **Type** (Multiple choice, Required)
  - Options: Book, Article, Video, Podcast, LinkedIn Post
- **Status** (Multiple choice, Required)
  - Options: To Read, In Progress, Read

#### Optional Fields:
- **Link** (Short answer) - URL to the content
- **Platform** (Short answer) - e.g., "Medium", "YouTube", "LinkedIn"
- **Language** (Short answer) - Default: "en"
- **Tags** (Short answer) - Comma-separated tags
- **Rating** (Linear scale 1-5)
- **Rating Description** (Short answer)
- **Key Insights** (Paragraph)
- **Quotes** (Paragraph) - Separate multiple quotes with "|"
- **Impact** (Linear scale 1-5) - Personal impact score
- **Length** (Multiple choice)
  - Options: Short, Medium, Long
- **Difficulty** (Multiple choice)
  - Options: Beginner, Intermediate, Advanced
- **Related To** (Short answer) - IDs of related entries (comma-separated)
- **Personal Reflection** (Paragraph)
- **Citation Format** (Paragraph) - Properly formatted citation
- **Date Read** (Date) - Leave blank if not read yet

### 1.3 Form Settings

1. Click the Settings gear icon
2. Under "Responses":
   - ✅ Collect email addresses (optional)
   - ✅ Limit to 1 response (uncheck if you want multiple submissions)
3. Under "Presentation":
   - ✅ Show progress bar
   - ✅ Shuffle question order (uncheck)

## Step 2: Connect Form to Google Sheets

### 2.1 Create Response Sheet

1. In your Google Form, click the "Responses" tab
2. Click the Google Sheets icon (green spreadsheet icon)
3. Choose "Create a new spreadsheet"
4. Name it "Reading Log Responses"
5. Click "Create"

### 2.2 Customize Sheet Headers

The form will automatically create column headers. You may want to rename them to match the expected format:

| Form Field | Recommended Header |
|------------|-------------------|
| Title | title |
| Author | author |
| Type | type |
| Status | status |
| Link | link |
| Platform | platform |
| Language | language |
| Tags | tags |
| Rating | rating |
| Rating Description | rating_description |
| Key Insights | key_insights |
| Quotes | quotes |
| Impact | impact |
| Length | length |
| Difficulty | difficulty |
| Related To | related_to |
| Personal Reflection | personal_reflection |
| Citation Format | citation_format |
| Date Read | date_read |

### 2.3 Make Sheet Public (Option 1 - Simpler)

1. In Google Sheets, click "Share" button
2. Click "Change to anyone with the link"
3. Set permission to "Viewer"
4. Copy the sheet ID from the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`

### 2.4 Use API Key (Option 2 - More Secure)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Sheets API
4. Create credentials (API Key)
5. Restrict the API key to Google Sheets API only
6. Copy the API key for later use

Tutorial here: [Google Sheets API Setup by MIT App Inventor](https://ai2.appinventor.mit.edu/reference/other/googlesheets-api-setup.html)

## Step 3: Set Up GitHub Actions

### 3.1 Add Repository Secrets

1. Go to your GitHub repository
2. Click Settings → Secrets and variables → Actions
3. Add the following secrets:

**Required:**
- `GOOGLE_SHEET_ID`: Your Google Sheet ID (from the URL)

**Optional (if using API key):**
- `GOOGLE_SHEETS_API_KEY`: Your Google Sheets API key

### 3.2 GitHub Actions Workflow

The workflow file `.github/workflows/update-reading-data.yml` is already created. It will:

1. Run on a schedule (daily at 6 AM UTC)
2. Run manually when triggered
3. Fetch data from your Google Sheet
4. Convert it to the reading log format
5. Commit changes and redeploy the site

## Step 4: Test the Integration

### 4.1 Submit Test Entry

1. Fill out your Google Form with a test entry
2. Check that it appears in your Google Sheet
3. Manually trigger the GitHub Action:
   - Go to Actions tab in your repository
   - Click "Update Reading Data from Google Sheets"
   - Click "Run workflow"

### 4.2 Verify Update

1. Check that the workflow completes successfully
2. Verify that your website shows the new entry
3. Check the commit history for the automated update

## Step 5: Usage Instructions

### Adding New Entries

1. **Fill out the Google Form** with your reading entry
2. **Wait for automatic update** (runs daily) OR **manually trigger** the GitHub Action
3. **Check your website** for the new entry

### Editing Existing Entries

1. **Edit the Google Sheet directly** (not the form)
2. **Trigger the GitHub Action** to update the website
3. **Verify changes** on your website

### Managing the Data

- **Form responses** are automatically added to the sheet
- **Manual edits** can be made directly in the sheet
- **Duplicate entries** should be removed manually
- **Data validation** is handled by the conversion script

## Troubleshooting

### Common Issues

**Form not connecting to sheet:**
- Check that the form is properly linked to the sheet
- Verify sheet permissions

**GitHub Action failing:**
- Check that secrets are properly set
- Verify sheet ID is correct
- Ensure sheet is publicly accessible or API key is valid

**Data not converting properly:**
- Check column headers match expected format
- Verify data types (numbers for rating/impact)
- Check for special characters in tags/quotes

**Website not updating:**
- Verify GitHub Pages is enabled
- Check deployment status in Actions tab
- Clear browser cache

### Getting Help

1. Check the GitHub Actions logs for error messages
2. Verify your Google Sheet structure matches the expected format
3. Test the Python script locally if needed
4. Check that all required fields are present

## Advanced Customization

### Custom Field Mapping

Edit `scripts/fetch_google_sheets.py` to modify the `COLUMN_MAPPING` dictionary if you want different field names.

### Validation Rules

Add custom validation logic in the `convert_row_to_entry` function to ensure data quality.

### Multiple Sheets

Modify the script to fetch from multiple sheets or ranges if you want to organize your data differently.

### Backup Strategy

Consider setting up automatic backups of your Google Sheet to prevent data loss.

## Security Considerations

- **Public sheets**: Anyone with the link can view your reading data
- **API keys**: Store securely in GitHub Secrets, never commit to code
- **Form access**: Consider limiting form access to specific users if needed
- **Data privacy**: Be mindful of what personal information you include

## Example Form URL

Once you've created your form, you can bookmark it for easy access:
`https://forms.gle/YOUR_FORM_ID`

You can also embed it in other websites or share the link with others if you want collaborative reading logs.

---

This integration allows you to easily add new reading entries from anywhere (mobile, desktop) while maintaining an automated, professional reading log website!


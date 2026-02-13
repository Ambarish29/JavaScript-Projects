# Complete Setup Guide - Copilot Studio Dataverse Integration

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Dataverse Setup](#dataverse-setup)
3. [Copilot Studio Configuration](#copilot-studio-configuration)
4. [Power Automate Flow Setup](#power-automate-flow-setup)
5. [Adaptive Card Integration](#adaptive-card-integration)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before starting, ensure you have:
- ✅ Microsoft 365 account
- ✅ Power Platform environment access
- ✅ Copilot Studio license
- ✅ Dataverse database
- ✅ Basic understanding of Power Automate

## 1. Dataverse Setup

### Step 1.1: Create HR Links Table

1. Navigate to **Power Apps** (make.powerapps.com)
2. Go to **Tables** → **New table**
3. Configure table:
   - **Display name:** HR Links
   - **Plural name:** HR Links
   - **Primary column:** Title

### Step 1.2: Add Custom Columns

Add these columns to your table:

| Column Name | Display Name | Type | Required | Description |
|------------|-------------|------|----------|-------------|
| cr123_title | Title | Text | Yes | HR resource title |
| cr123_url | URL | Text | Yes | Link URL |
| cr123_link | Link Text | Text | Yes | Display text for link |
| cr123_description | Description | Text (Multi-line) | No | Resource description |

**Note:** Replace `cr123` with your environment's publisher prefix.

### Step 1.3: Import Sample Data

Use the Power Apps data import feature to add sample data:

```csv
cr123_title,cr123_url,cr123_link,cr123_description
Reward Statement,https://hr.company.com/rewards,View Reward Statement,Access your annual reward statement and bonus information
Pay Slip,https://hr.company.com/payslip,View Pay Slip,Download your monthly pay slip
Leave Balance,https://hr.company.com/leave,Check Leave Balance,View your current leave balance and history
Performance Review,https://hr.company.com/performance,View Performance Review,Access your performance review and feedback
Benefits Enrollment,https://hr.company.com/benefits,Enroll in Benefits,Manage your health and insurance benefits
Training Portal,https://hr.company.com/training,Access Training,Browse and enroll in training courses
Employee Handbook,https://hr.company.com/handbook,View Handbook,Read company policies and procedures
Time Sheet,https://hr.company.com/timesheet,Submit Time Sheet,Log your working hours and submit timesheet
```

**To import:**
1. Save the above data as `hr-links-data.csv`
2. In Power Apps, select your table
3. Click **Get data** → **Get data from Excel**
4. Upload the CSV file
5. Map columns correctly
6. Import

### Step 1.4: Set Permissions

1. Go to **Security roles**
2. Ensure users have **Read** permission on the HR Links table
3. For Copilot/Service accounts, grant appropriate access

## 2. Copilot Studio Configuration

### Step 2.1: Create New Copilot

1. Navigate to **Copilot Studio** (copilotstudio.microsoft.com)
2. Click **Create** → **New copilot**
3. Name: "HR Assistant"
4. Description: "Helps employees find HR resources"

### Step 2.2: Create Topic

1. Go to **Topics** → **Add a topic**
2. Name: "Get HR Link"
3. Add trigger phrases:
   - "I need HR help"
   - "Get HR link"
   - "Find HR resource"
   - "Show me HR information"

### Step 2.3: Add Question Node

1. Add **Ask a question** node
2. Configure:
   - **Message:** "What HR resource are you looking for? (e.g., reward statement, pay slip, leave balance)"
   - **Identify:** User's entire response
   - **Save as:** `Topic.UserQuery`

### Step 2.4: Create Variable

1. Go to **Variables** tab
2. Create these variables:
   - `UserQuery` (String) - User's input
   - `HRLinkResult` (Object) - Result from Power Automate
   - `ShowCard` (Boolean) - Whether to display card

## 3. Power Automate Flow Setup

### Step 3.1: Create New Flow

1. In Copilot Studio topic, add **Call an action** node
2. Click **Create a flow**
3. This opens Power Automate

### Step 3.2: Configure Flow Trigger

1. Trigger: **When Copilot Studio calls a flow**
2. Add input:
   - **Input name:** UserQuery
   - **Type:** Text
   - **Description:** "User's search query"

### Step 3.3: Add Dataverse Query

1. Add **Dataverse - List rows** action
2. Configure:
   - **Table name:** HR Links (select your table)
   - **Filter rows:** 
   ```
   contains(cr123_title,'@{triggerBody()['text']}') or contains(cr123_description,'@{triggerBody()['text']}')
   ```
   - **Select columns:** `cr123_title,cr123_url,cr123_link,cr123_description`
   - **Row count:** 1

**Note:** The filter uses OData query syntax. Adjust column names based on your prefix.

### Step 3.4: Add Condition

1. Add **Condition** action
2. Configure:
   - **Value:** `length(outputs('List_rows')?['body/value'])`
   - **is greater than:** `0`

### Step 3.5: Configure Success Response

In the **If yes** branch:

1. Add **Initialize variable** action:
   - **Name:** FirstResult
   - **Type:** Object
   - **Value:** 
   ```json
   first(outputs('List_rows')?['body/value'])
   ```

2. Add **Compose** action:
   - **Inputs:**
   ```json
   {
     "success": true,
     "data": {
       "title": "@{variables('FirstResult')?['cr123_title']}",
       "url": "@{variables('FirstResult')?['cr123_url']}",
       "linkText": "@{variables('FirstResult')?['cr123_link']}",
       "description": "@{variables('FirstResult')?['cr123_description']}"
     }
   }
   ```

3. Add **Return value(s) to Copilot Studio**:
   - **Output name:** HRLinkJSON
   - **Output type:** Text
   - **Output value:** `@{outputs('Compose')}`

### Step 3.6: Configure Failure Response

In the **If no** branch:

1. Add **Compose** action:
   - **Inputs:**
   ```json
   {
     "success": false,
     "message": "No matching HR resource found. Try: reward statement, pay slip, leave balance, training, benefits"
   }
   ```

2. Add **Return value(s) to Copilot Studio**:
   - **Output name:** HRLinkJSON
   - **Output type:** Text
   - **Output value:** `@{outputs('Compose_2')}`

### Step 3.7: Save and Test Flow

1. **Name the flow:** "Get HR Link from Dataverse"
2. Click **Save**
3. Test with sample input: "reward"
4. Verify JSON output is correct

## 4. Adaptive Card Integration

### Step 4.1: Parse Flow Response

Back in Copilot Studio topic:

1. After the **Call action** node
2. Add **Parse value** node
3. Configure:
   - **Value to parse:** `Topic.HRLinkResult`
   - **Data type:** JSON
   - **Save as:** `Topic.ParsedResult`

### Step 4.2: Add Condition Node

1. Add **Condition** node
2. Configure:
   - **Variable:** `Topic.ParsedResult.success`
   - **Condition:** is equal to
   - **Value:** `true`

### Step 4.3: Display Adaptive Card (Success Path)

In the **If yes** branch:

1. Add **Show a message** node
2. Click **+ Add** → **Adaptive Card**
3. Copy content from `adaptive-cards/hr-link-card-simple.json`
4. Replace variables:
   ```json
   {
     "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
     "type": "AdaptiveCard",
     "version": "1.5",
     "body": [
       {
         "type": "TextBlock",
         "text": "Topic.ParsedResult.data.title",
         "weight": "Bolder",
         "size": "Large",
         "wrap": true,
         "color": "Accent"
       },
       {
         "type": "TextBlock",
         "text": "Topic.ParsedResult.data.description",
         "wrap": true,
         "spacing": "Small"
       },
       {
         "type": "ActionSet",
         "actions": [
           {
             "type": "Action.OpenUrl",
             "title": "Topic.ParsedResult.data.linkText",
             "url": "Topic.ParsedResult.data.url",
             "style": "positive"
           }
         ]
       }
     ]
   }
   ```

5. Note: In Copilot Studio, use the variable picker to insert dynamic values

### Step 4.4: Display Error Message (Failure Path)

In the **If no** branch:

1. Add **Show a message** node
2. Configure:
   - **Message:** `Topic.ParsedResult.message`

3. Add **Show a message** node with suggestions:
   - **Message:** "Would you like to try one of these?"
   - **Options:**
     - "Reward Statement"
     - "Pay Slip"
     - "Leave Balance"
     - "Training Portal"

## 5. Testing

### Test Case 1: Successful Query

1. Open **Test your copilot** panel
2. Type: "Get my reward statement"
3. Expected result:
   - Question asking what you're looking for
   - You respond: "reward statement"
   - Adaptive Card displays with:
     - Title: "Reward Statement"
     - Description visible
     - Clickable "View Reward Statement" button

### Test Case 2: Different Queries

Test these variations:
- "I need my pay slip" → Should find Pay Slip
- "Where's my leave balance?" → Should find Leave Balance
- "Show training" → Should find Training Portal
- "benefits information" → Should find Benefits Enrollment

### Test Case 3: No Match

1. Type: "Show me something random"
2. Expected result:
   - Error message: "No matching HR resource found..."
   - Suggestions provided

### Test Case 4: Partial Matching

1. Type: "reward"
2. Expected result:
   - Should match "Reward Statement"
   - Card displays correctly

## 6. Advanced Configuration

### Option A: Add Search Analytics

Track which HR links are accessed most:

1. Add **Dataverse - Add a new row** after successful match
2. Table: Create "HR Link Analytics" table
3. Columns: UserId, LinkTitle, Timestamp, Query

### Option B: Multiple Results

Modify flow to return top 3 matches:

1. Change Row count to 3
2. Return array of results
3. Display multiple cards or list

### Option C: Fuzzy Matching

Improve search with better keyword extraction:

1. Add **Compose** action to extract keywords
2. Use expression: `split(toLower(triggerBody()['text']),' ')`
3. Build dynamic filter with multiple OR conditions

## 7. Troubleshooting

### Issue: Flow Returns Empty

**Solution:**
- Check Dataverse connection permissions
- Verify column names match (check prefix)
- Test filter query directly in Dataverse
- Ensure data exists in table

### Issue: Adaptive Card Not Displaying

**Solution:**
- Validate JSON syntax
- Check variable references are correct
- Use plain message node first to verify data
- Review Copilot Studio error logs

### Issue: Wrong Results Returned

**Solution:**
- Improve filter logic with more specific matching
- Add keyword extraction logic
- Rank results by relevance
- Test with more sample data

### Issue: Slow Response

**Solution:**
- Add indexes on searchable columns
- Reduce number of records queried
- Cache common results
- Optimize filter expressions

## 8. Deployment Checklist

Before production deployment:

- [ ] Test with 100+ records in Dataverse
- [ ] Verify all HR links are valid URLs
- [ ] Test with various user queries
- [ ] Set up error handling
- [ ] Configure analytics/logging
- [ ] Document for end users
- [ ] Train users on how to ask questions
- [ ] Set up monitoring
- [ ] Plan for table updates

## Next Steps

1. **Expand functionality:**
   - Add more HR resources
   - Implement favorites
   - Add feedback mechanism

2. **Enhance user experience:**
   - Add rich media to cards
   - Implement conversation memory
   - Add follow-up suggestions

3. **Monitor and improve:**
   - Track usage analytics
   - Collect user feedback
   - Refine search algorithm
   - Update content regularly

## Support Resources

- [Microsoft Copilot Studio Documentation](https://learn.microsoft.com/copilot-studio/)
- [Dataverse Documentation](https://learn.microsoft.com/power-apps/maker/data-platform/)
- [Adaptive Cards Designer](https://adaptivecards.io/designer/)
- [Power Automate Documentation](https://learn.microsoft.com/power-automate/)

---

**Need Help?**
- Review the example code in `/scripts` folder
- Check the prompt instructions in `/prompts` folder
- Examine adaptive card templates in `/adaptive-cards` folder
- Refer to example queries in `example-queries.md`

# Copilot Studio Prompt Tool Instructions

## Purpose
This prompt tool retrieves HR-related links from a Dataverse table based on natural language queries and returns them in a structured JSON format.

## Prompt Configuration for Copilot Studio

### 1. Prompt Tool Name
`GetHRLinkFromDataverse`

### 2. Description
"Searches the HR Links Dataverse table to find and return relevant HR resources based on user queries."

### 3. Input Configuration

**Input Variable Name:** `UserQuery`
- **Type:** String
- **Required:** Yes
- **Description:** "The user's natural language question or request (e.g., 'Get my reward statement', 'Show leave balance')"
- **Sample Values:**
  - "Get my reward statement"
  - "Show me my pay slip"
  - "Where can I check my leave balance?"
  - "I need to access training portal"

### 4. Output Configuration

**Output Variable Name:** `HRLinkResult`
- **Type:** Object
- **Description:** "Structured JSON containing the HR link information"

**Output Schema:**
```json
{
  "success": true,
  "data": {
    "title": "string",
    "url": "string",
    "linkText": "string",
    "description": "string"
  }
}
```

### 5. Prompt Instructions

```
You are an HR assistant that helps employees find HR-related resources.

TASK:
Analyze the user's query and extract the key information they're looking for.

USER QUERY: {UserQuery}

DATAVERSE TABLE: cr123_hrlinks
COLUMNS:
- cr123_title (Title of the HR resource)
- cr123_url (URL link)
- cr123_link (Link display text)
- cr123_description (Description)

INSTRUCTIONS:
1. Extract key terms from the user query (e.g., "reward", "payslip", "leave", "training", "benefits")
2. Search the Dataverse table where cr123_title or cr123_description contains these key terms
3. Return ONLY the most relevant single record
4. Format the response as JSON

SEARCH LOGIC:
- Use case-insensitive search
- Match on partial words in title or description
- Prioritize exact title matches
- If multiple matches, return the most relevant one

EXAMPLE QUERIES AND RESPONSES:

Query: "Get my reward statement"
Response:
{
  "success": true,
  "data": {
    "title": "Reward Statement",
    "url": "https://hr.company.com/rewards",
    "linkText": "View Reward Statement",
    "description": "Access your annual reward statement and bonus information"
  }
}

Query: "Where is my pay slip?"
Response:
{
  "success": true,
  "data": {
    "title": "Pay Slip",
    "url": "https://hr.company.com/payslip",
    "linkText": "View Pay Slip",
    "description": "Download your monthly pay slip"
  }
}

If no match found:
{
  "success": false,
  "message": "No matching HR resource found. Available categories: Rewards, Pay, Leave, Training, Benefits, Performance"
}

RETURN FORMAT:
Always return valid JSON. Do not include any explanatory text outside the JSON structure.
```

### 6. Connection to Dataverse

#### Option A: Using Microsoft Dataverse Connector

1. In Copilot Studio, add a **Power Automate Flow** action
2. Create a new flow with these steps:
   - **Trigger:** When Copilot Studio calls the flow
   - **Input:** UserQuery (String)
   - **Action:** List rows from Dataverse
     - **Table:** Your HR Links table (e.g., cr123_hrlinks)
     - **Filter Query:** `contains(cr123_title, '{UserQuery}') or contains(cr123_description, '{UserQuery}')`
     - **Top Count:** 1
   - **Action:** Parse JSON to extract fields
   - **Response:** Return to Copilot Studio
     - Title: `cr123_title`
     - URL: `cr123_url`
     - LinkText: `cr123_link`
     - Description: `cr123_description`

#### Option B: Using Custom API/JavaScript

1. Host the `dataverse-query.js` script as an Azure Function or API endpoint
2. Configure API authentication (Azure AD)
3. In Copilot Studio:
   - Add **HTTP Request** action
   - **Method:** POST
   - **URL:** Your API endpoint
   - **Body:** `{"query": "{UserQuery}"}`
   - **Headers:** Authorization token
   - **Parse Response:** JSON output

### 7. Testing the Prompt

Test with these queries:
- ✅ "Get my reward statement"
- ✅ "Show me pay slip"
- ✅ "Leave balance"
- ✅ "I need training portal"
- ✅ "Where can I find benefits?"
- ✅ "Performance review"

Expected behavior:
- Each query should return exactly one relevant HR link
- Response should be valid JSON
- URL should be properly formatted
- Success flag should indicate if a match was found

### 8. Error Handling

Add these error conditions:
- **No match found:** Return success: false with helpful message
- **Multiple matches:** Return the most relevant one
- **Dataverse connection error:** Return error message
- **Invalid query:** Suggest rephrasing

### 9. Integration with Topics

In your Copilot Studio topic:
1. **User says:** Trigger phrases like "I need HR link", "Get HR resource"
2. **Call action:** GetHRLinkFromDataverse prompt tool
3. **Condition:** Check if HRLinkResult.success is true
4. **If success:**
   - Display Adaptive Card (see adaptive-cards/hr-link-card.json)
   - Show clickable link
5. **If failure:**
   - Show error message
   - Suggest alternatives

### 10. Variables to Set

- `Topic.UserQuery` = User's input
- `Topic.HRLink` = Result from prompt tool
- `Topic.CardPayload` = Formatted Adaptive Card JSON

## Next Steps

1. Create the Dataverse table with proper columns
2. Configure the prompt tool in Copilot Studio
3. Set up the connection (Power Automate or API)
4. Add the topic with Adaptive Card display
5. Test with various user queries
6. Deploy to your environment

## Support

For detailed implementation, see:
- [Setup Guide](../docs/setup-guide.md)
- [Example Queries](../docs/example-queries.md)
- [Adaptive Card Template](../adaptive-cards/hr-link-card.json)

# Copilot Studio Topic Configuration

This document shows the exact configuration to use in Copilot Studio.

## Topic: Get HR Link

### Basic Information
- **Name:** Get HR Link
- **Description:** Helps users find HR resources by natural language query
- **Category:** HR Support

### Trigger Phrases
Add these trigger phrases to activate this topic:
- I need HR help
- Get HR link
- Find HR resource
- Show me HR information
- I'm looking for an HR link
- Where can I find HR resources
- Help me find HR info

### Topic Flow

```
1. Trigger Message (System)
   └─> "I'll help you find the HR resource you need."

2. Question Node
   ├─ Message: "What HR resource are you looking for?"
   ├─ Examples shown to user:
   │   • "You can ask for things like:"
   │   • "- Reward statement"
   │   • "- Pay slip"
   │   • "- Leave balance"
   │   • "- Training portal"
   ├─ Identify: User's entire response
   └─ Save response as: Topic.UserQuery

3. Call an Action (Power Automate)
   ├─ Flow: "Get HR Link from Dataverse"
   ├─ Input: Topic.UserQuery
   └─ Output: Topic.FlowResponse

4. Parse JSON
   ├─ Value: Topic.FlowResponse.HRLinkJSON
   ├─ Type: JSON
   └─ Save as: Topic.HRResult

5. Condition Node
   ├─ Variable: Topic.HRResult.success
   ├─ Operator: is equal to
   └─ Value: true

6a. If Yes - Show Adaptive Card
    ├─ Message: "Here's what I found:"
    └─ Adaptive Card:
        {
          "type": "AdaptiveCard",
          "version": "1.5",
          "body": [
            {
              "type": "Container",
              "style": "emphasis",
              "items": [
                {
                  "type": "TextBlock",
                  "text": "[Topic.HRResult.data.title]",
                  "weight": "Bolder",
                  "size": "Large",
                  "color": "Accent"
                }
              ]
            },
            {
              "type": "TextBlock",
              "text": "[Topic.HRResult.data.description]",
              "wrap": true,
              "spacing": "Medium"
            },
            {
              "type": "ActionSet",
              "actions": [
                {
                  "type": "Action.OpenUrl",
                  "title": "[Topic.HRResult.data.linkText]",
                  "url": "[Topic.HRResult.data.url]",
                  "style": "positive"
                }
              ]
            }
          ]
        }
    
    └─> Follow-up Question:
        "Was this helpful?" (Yes/No buttons)

6b. If No - Show Error Message
    ├─ Message: "[Topic.HRResult.message]"
    └─> Quick Replies:
        • Reward Statement
        • Pay Slip
        • Leave Balance
        • Training Portal
        • Benefits
        (Each redirects back to step 3 with that term)

7. End of Topic
   └─> "Is there anything else I can help you with?"
```

## Variable Definitions

### Topic Variables
| Variable Name | Type | Description |
|--------------|------|-------------|
| `UserQuery` | String | User's natural language query |
| `FlowResponse` | Object | Raw response from Power Automate |
| `HRResult` | Object | Parsed JSON result |

### Example Variable Values

**After successful query:**
```json
{
  "UserQuery": "Get my reward statement",
  "HRResult": {
    "success": true,
    "data": {
      "title": "Reward Statement",
      "url": "https://hr.company.com/rewards",
      "linkText": "View Reward Statement",
      "description": "Access your annual reward statement"
    }
  }
}
```

**After failed query:**
```json
{
  "UserQuery": "xyz random",
  "HRResult": {
    "success": false,
    "message": "No matching HR resource found..."
  }
}
```

## Adaptive Card - Full Template

This is the complete Adaptive Card template to paste into Copilot Studio:

```json
{
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "type": "AdaptiveCard",
  "version": "1.5",
  "body": [
    {
      "type": "Container",
      "style": "emphasis",
      "bleed": true,
      "items": [
        {
          "type": "ColumnSet",
          "columns": [
            {
              "type": "Column",
              "width": "auto",
              "items": [
                {
                  "type": "TextBlock",
                  "text": "🔗",
                  "size": "ExtraLarge"
                }
              ]
            },
            {
              "type": "Column",
              "width": "stretch",
              "items": [
                {
                  "type": "TextBlock",
                  "text": "${Topic.HRResult.data.title}",
                  "weight": "Bolder",
                  "size": "Large",
                  "color": "Accent"
                },
                {
                  "type": "TextBlock",
                  "text": "HR Resource",
                  "size": "Small",
                  "isSubtle": true,
                  "spacing": "None"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "TextBlock",
      "text": "${Topic.HRResult.data.description}",
      "wrap": true,
      "spacing": "Medium"
    },
    {
      "type": "Container",
      "separator": true,
      "spacing": "Medium",
      "items": [
        {
          "type": "ActionSet",
          "actions": [
            {
              "type": "Action.OpenUrl",
              "title": "🔗 ${Topic.HRResult.data.linkText}",
              "url": "${Topic.HRResult.data.url}",
              "style": "positive"
            }
          ]
        }
      ]
    },
    {
      "type": "TextBlock",
      "text": "💡 Click the button above to access this resource",
      "size": "Small",
      "isSubtle": true,
      "horizontalAlignment": "Center",
      "spacing": "Small"
    }
  ]
}
```

**Note:** In Copilot Studio:
- Use the **Power Fx** variable syntax: `${Topic.HRResult.data.title}`
- Or use the **variable picker** to insert variables dynamically

## Quick Reply Buttons (Error Scenario)

When no match is found, show these quick reply options:

```javascript
// Quick Reply Configuration
[
  {
    "text": "Reward Statement",
    "value": "reward statement"
  },
  {
    "text": "Pay Slip", 
    "value": "pay slip"
  },
  {
    "text": "Leave Balance",
    "value": "leave balance"
  },
  {
    "text": "Training Portal",
    "value": "training portal"
  },
  {
    "text": "Benefits",
    "value": "benefits"
  }
]
```

Each button click should:
1. Set `Topic.UserQuery` to the button value
2. Redirect to the "Call an Action" node
3. Process the query with the predefined term

## Advanced: Analytics Tracking

Add analytics to track usage:

**After successful match, add:**
```
Variable Action: Set Variable
├─ Variable: Global.AnalyticsEvent
└─ Value: {
     "event": "hr_link_found",
     "query": Topic.UserQuery,
     "result": Topic.HRResult.data.title,
     "timestamp": utcNow()
   }
```

## Testing Checklist

Test these scenarios in the Test panel:

- [ ] "Get my reward statement" → Shows Reward Statement card
- [ ] "show payslip" → Shows Pay Slip card (case insensitive)
- [ ] "I need leave balance" → Shows Leave Balance card
- [ ] "random xyz" → Shows error message with suggestions
- [ ] Click quick reply button → Processes correctly
- [ ] Click "Open Link" in card → Opens URL in new tab
- [ ] Ask follow-up question → Context maintained

## Common Issues and Fixes

### Issue: Variables not populating in Adaptive Card
**Fix:** Ensure you're using correct syntax:
- Copilot Studio v2: `${Topic.VariableName}`
- Old syntax: `{x.VariableName}`

### Issue: Flow returns error
**Fix:** 
1. Check Power Automate run history
2. Verify Dataverse connection
3. Test filter query manually in Dataverse

### Issue: Card not rendering
**Fix:**
1. Validate JSON syntax at adaptivecards.io/designer
2. Check all required properties are present
3. Ensure Adaptive Card version is supported (use 1.5)

### Issue: Wrong result returned
**Fix:**
1. Improve keyword matching in Power Automate
2. Add more specific filters
3. Test with actual Dataverse data

## Next Steps

1. **Deploy to Production:**
   - Test thoroughly in development
   - Create production Dataverse table
   - Clone topic to production environment
   - Test with real users

2. **Add More Topics:**
   - "Show all HR links" - displays multiple
   - "HR help menu" - categorized list
   - "Frequently accessed" - popular links

3. **Enhance Functionality:**
   - Add personalization (role-based links)
   - Track user preferences
   - Implement feedback collection
   - Add multi-language support

## Support Resources

- [Copilot Studio Documentation](https://learn.microsoft.com/copilot-studio/)
- [Adaptive Cards Schema](https://adaptivecards.io/explorer/)
- [Power Automate Expressions](https://learn.microsoft.com/power-automate/use-expressions-in-conditions)
- [Dataverse Web API](https://learn.microsoft.com/power-apps/developer/data-platform/webapi/overview)

---

**Last Updated:** February 2026  
**Version:** 1.0  
**Tested on:** Copilot Studio (Latest)

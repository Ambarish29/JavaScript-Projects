# Troubleshooting Guide

This guide helps you resolve common issues when implementing the Copilot Studio Dataverse integration.

## Table of Contents
- [Setup Issues](#setup-issues)
- [Dataverse Problems](#dataverse-problems)
- [Power Automate Flow Issues](#power-automate-flow-issues)
- [Copilot Studio Issues](#copilot-studio-issues)
- [Adaptive Card Problems](#adaptive-card-problems)
- [Performance Issues](#performance-issues)
- [Testing Issues](#testing-issues)

---

## Setup Issues

### ❌ "Cannot access Power Platform environment"

**Symptoms:**
- Cannot create Dataverse table
- Power Automate not accessible

**Solutions:**
1. Verify you have appropriate licenses
2. Check you're in the correct environment
3. Ensure admin has granted permissions
4. Try switching environments in Power Platform admin center

**How to verify:**
```
1. Go to admin.powerplatform.microsoft.com
2. Check "Environments" section
3. Verify your role (System Administrator or Environment Maker)
```

---

### ❌ "Copilot Studio not available"

**Symptoms:**
- Cannot access copilotstudio.microsoft.com
- License error messages

**Solutions:**
1. Verify Copilot Studio license assignment
2. Check in correct tenant
3. Contact admin to assign license
4. Try incognito/private browser mode

**License Check:**
```
1. Go to portal.azure.com
2. Navigate to Azure Active Directory → Users
3. Select your user → Licenses
4. Verify "Power Virtual Agents" or "Copilot Studio" license
```

---

## Dataverse Problems

### ❌ "Table creation fails"

**Symptoms:**
- Error when creating new table
- "Insufficient permissions" message

**Solutions:**
1. Check you have "Environment Maker" role
2. Ensure database exists in environment
3. Try using default publisher
4. Check storage capacity

**Steps:**
```
1. Power Apps → Settings → Advanced settings
2. Security → Security Roles
3. Verify "Environment Maker" role assigned
4. If not, contact administrator
```

---

### ❌ "Cannot import CSV data"

**Symptoms:**
- Import fails
- Data not appearing in table

**Solutions:**
1. Verify column names match exactly
2. Check for special characters in data
3. Ensure CSV is UTF-8 encoded
4. Try importing smaller batches

**CSV Format:**
```csv
Title,URL,Link Text,Description
"Reward Statement","https://hr.company.com/rewards","View Reward","Description here"
```

**Note:** Use quotes if data contains commas

---

### ❌ "Query returns no results"

**Symptoms:**
- Power Automate flow returns empty
- No matches found for valid queries

**Solutions:**
1. Verify data exists in table
2. Check column names in filter (case-sensitive)
3. Test filter directly in Dataverse
4. Ensure contains() function syntax is correct

**Test Filter Directly:**
```
1. Power Apps → Tables → Your HR Links table
2. Click "Edit filters"
3. Test: contains(cr123_title, 'reward')
4. Verify results appear
```

**Correct Filter Syntax:**
```
contains(cr123_title,'reward') or contains(cr123_description,'reward')
```

**Common Mistakes:**
```
❌ Contains(title,'reward')          // Wrong: Capital C
❌ contains(Title,'reward')          // Wrong: Capital T
❌ contains(title, 'reward')         // Wrong: space after comma
✅ contains(cr123_title,'reward')    // Correct: include prefix, no space
```

---

## Power Automate Flow Issues

### ❌ "Flow fails to run"

**Symptoms:**
- Error when calling flow from Copilot
- "Flow not found" error

**Solutions:**
1. Verify flow is turned ON
2. Check flow is shared with Copilot
3. Ensure trigger is "When Copilot Studio calls this flow"
4. Test flow manually first

**Manual Test:**
```
1. Open flow in Power Automate
2. Click "Test" → "Manually"
3. Enter test input: {"text": "reward"}
4. Verify it runs successfully
```

---

### ❌ "Flow returns error: 'Cannot read property'"

**Symptoms:**
- Flow runs but fails at parse step
- Error mentions undefined property

**Solutions:**
1. Check column names match your Dataverse schema
2. Verify prefix (cr123_ vs your actual prefix)
3. Ensure "first()" function is used correctly
4. Add null checks

**Debug Steps:**
```
1. In flow, add "Compose" action after Dataverse query
2. Input: outputs('List_rows')?['body/value']
3. Run flow and check output
4. Verify structure matches your expectations
```

**Find Your Prefix:**
```
1. Power Apps → Tables → Your table
2. Click on any column
3. Note the prefix (e.g., cr123_title)
4. Use this prefix in all column references
```

---

### ❌ "Response not returning to Copilot"

**Symptoms:**
- Flow succeeds but Copilot gets no response
- Timeout errors

**Solutions:**
1. Verify "Return value(s) to Copilot Studio" action exists
2. Check response variable name matches
3. Ensure response is in correct format (string)
4. Check for flow timeout (increase if needed)

**Correct Return Format:**
```json
{
  "name": "HRLinkJSON",
  "type": "Text",
  "value": "@{outputs('Compose_Success')}"
}
```

---

### ❌ "Dataverse connection fails"

**Symptoms:**
- "Connection not configured" error
- Authentication failures

**Solutions:**
1. Remove and re-add Dataverse connection
2. Verify permissions on Dataverse
3. Check if connection needs re-authentication
4. Use service account for production

**Re-create Connection:**
```
1. Power Automate → Connections
2. Find "Microsoft Dataverse"
3. Click "..." → Delete
4. Create new connection
5. Re-open flow and reconnect
```

---

## Copilot Studio Issues

### ❌ "Variables not populating in Adaptive Card"

**Symptoms:**
- Card displays but shows ${variable} instead of values
- Blank fields in card

**Solutions:**
1. Use correct Power Fx syntax: `${Topic.VariableName}`
2. Verify variable name is exact match
3. Check variable is in scope
4. Use variable picker instead of typing

**Variable Syntax:**
```
❌ {Topic.HRResult.data.title}         // Old syntax
❌ $Topic.HRResult.data.title          // Missing brackets
❌ ${topic.hrresult.data.title}        // Wrong case
✅ ${Topic.HRResult.data.title}        // Correct
```

**Using Variable Picker:**
```
1. In Adaptive Card JSON editor
2. Place cursor where you want variable
3. Click "Insert variable" (fx icon)
4. Select variable from tree
```

---

### ❌ "Topic not triggering"

**Symptoms:**
- User message doesn't activate topic
- Goes to fallback instead

**Solutions:**
1. Add more trigger phrases
2. Make phrases more specific
3. Check topic is enabled
4. Verify topic priority/order

**Good Trigger Phrases:**
```
✅ "I need HR help"
✅ "Get HR link"
✅ "Find HR resource"
✅ "Show me HR information"
```

**Too Generic:**
```
❌ "help"          // Too broad
❌ "info"          // Too vague
```

---

### ❌ "Parse JSON fails"

**Symptoms:**
- Error: "Invalid JSON format"
- Topic stops after flow call

**Solutions:**
1. Verify flow returns valid JSON string
2. Check for escaped quotes
3. Test JSON in online validator
4. Ensure flow response is Text type, not Object

**Debug Parse:**
```
1. Before parse node, add "Send a message"
2. Message: Topic.FlowResponse.HRLinkJSON
3. Test and copy the output
4. Validate at jsonlint.com
5. Fix any JSON errors in flow
```

---

## Adaptive Card Problems

### ❌ "Card not rendering"

**Symptoms:**
- Message shows but no card appears
- "Unsupported card" error

**Solutions:**
1. Validate JSON at adaptivecards.io/designer
2. Check Adaptive Card version (use 1.5)
3. Verify required properties present
4. Remove unsupported elements

**Required Properties:**
```json
{
  "type": "AdaptiveCard",           // Required
  "version": "1.5",                 // Required
  "$schema": "http://...",          // Required
  "body": [ /* items */ ]           // Required
}
```

**Test Card:**
```
1. Go to adaptivecards.io/designer
2. Paste your card JSON
3. Replace ${variables} with sample text
4. Verify it renders correctly
5. Fix any errors shown
```

---

### ❌ "Link not clickable"

**Symptoms:**
- Button shows but doesn't open URL
- Click does nothing

**Solutions:**
1. Verify Action.OpenUrl is used
2. Check URL is properly formatted
3. Ensure URL variable has http:// or https://
4. Test with hardcoded URL first

**Correct Action:**
```json
{
  "type": "Action.OpenUrl",
  "title": "Click Here",
  "url": "https://example.com",      // Must start with http(s)
  "style": "positive"
}
```

**Common Mistakes:**
```
❌ "url": "www.example.com"           // Missing protocol
❌ "url": "/relative/path"            // Relative URLs not supported
✅ "url": "https://www.example.com"   // Correct
```

---

### ❌ "Card looks different than expected"

**Symptoms:**
- Styling not matching design
- Layout issues

**Solutions:**
1. Different platforms render differently (Teams vs Web)
2. Test in actual deployment platform
3. Use containers for consistent spacing
4. Avoid complex nested structures

**Platform Differences:**
```
Teams:     May not show all colors
Web Chat:  Full support
Mobile:    Simplified rendering
```

---

## Performance Issues

### ❌ "Slow response time (>5 seconds)"

**Symptoms:**
- User waits long time for response
- Timeout errors

**Solutions:**
1. Add index on searchable Dataverse columns
2. Reduce number of rows queried
3. Optimize filter expression
4. Use caching for common queries

**Add Index:**
```
1. Power Apps → Tables → Your table
2. Select column (e.g., cr123_title)
3. Advanced options → Searchable: Yes
4. Save
```

**Optimize Filter:**
```
Before: contains(cr123_title,'text') or contains(cr123_description,'text') or contains(cr123_link,'text')
After:  contains(cr123_title,'text') or contains(cr123_description,'text')
```

---

### ❌ "High resource usage"

**Symptoms:**
- Flow runs slowly with many records
- Dataverse throttling

**Solutions:**
1. Limit query results (Top 1 instead of Top 10)
2. Add row count limit in flow
3. Implement query caching
4. Use selective columns ($select)

**Efficient Query:**
```
Filter: contains(cr123_title,'reward')
Select: cr123_title,cr123_url,cr123_link,cr123_description
Top: 1
```

---

## Testing Issues

### ❌ "Test panel not working"

**Symptoms:**
- Cannot open test bot
- Test responses not showing

**Solutions:**
1. Refresh browser
2. Clear cache
3. Try different browser
4. Check console for errors

**Browser Console:**
```
1. Press F12 (Windows) or Cmd+Option+I (Mac)
2. Go to Console tab
3. Look for red errors
4. Screenshot and report if persistent
```

---

### ❌ "Test works but production doesn't"

**Symptoms:**
- Test environment works fine
- Published bot has issues

**Solutions:**
1. Verify all flows are shared with everyone
2. Check Dataverse permissions in production
3. Ensure connections are not personal
4. Re-publish the bot

**Share Flow:**
```
1. Power Automate → My flows
2. Select flow → Share
3. Add "Everyone in organization"
4. Grant "User" permission
```

---

## Error Codes Reference

| Error Code | Meaning | Solution |
|-----------|---------|----------|
| 403 | Forbidden | Check permissions |
| 404 | Not Found | Verify resource exists |
| 500 | Server Error | Retry, check logs |
| 504 | Timeout | Optimize query, increase timeout |

---

## Getting Help

### Information to Collect

When reporting issues, gather:
1. Error message (exact text)
2. Screenshot of error
3. Flow run history
4. Dataverse query results
5. Browser console errors

### Where to Get Support

1. **Check this guide first**
2. **Review setup-guide.md** for configuration
3. **Test with demo/demo-query.js** to verify logic
4. **Check Microsoft docs** for platform issues
5. **Review GitHub issues** in repository

---

## Preventive Checklist

Before deploying to production:

- [ ] Test with 100+ records
- [ ] Verify all URLs are valid
- [ ] Test 10+ different queries
- [ ] Check error handling works
- [ ] Validate adaptive card renders correctly
- [ ] Test on target platform (Teams/Web)
- [ ] Verify permissions are correct
- [ ] Document any custom changes
- [ ] Train end users
- [ ] Set up monitoring

---

## Quick Diagnostic Steps

**When something doesn't work:**

1. ✅ Check the logs (Flow run history, browser console)
2. ✅ Test each component individually
3. ✅ Verify data exists and is correct
4. ✅ Check permissions and connections
5. ✅ Test with simple/hardcoded values first
6. ✅ Compare with working example
7. ✅ Read error messages carefully
8. ✅ Search this troubleshooting guide

---

**Still stuck?** Review the complete [Setup Guide](setup-guide.md) or run the [demo script](../demo/demo-query.js) to see working examples.

# Example Queries and Expected Results

This document provides sample user queries and their expected responses when using the HR Links Copilot.

## Basic Queries

### Query 1: Reward Statement
**User Input:**
- "Get my reward statement"
- "Show reward statement"
- "I need my rewards"
- "Where can I see my rewards?"

**Expected Match:**
```json
{
  "success": true,
  "data": {
    "title": "Reward Statement",
    "url": "https://hr.company.com/rewards",
    "linkText": "View Reward Statement",
    "description": "Access your annual reward statement and bonus information"
  }
}
```

**Display:** Adaptive Card with clickable "View Reward Statement" button

---

### Query 2: Pay Slip
**User Input:**
- "Show me my pay slip"
- "I need my payslip"
- "Where's my salary slip?"
- "Get pay information"

**Expected Match:**
```json
{
  "success": true,
  "data": {
    "title": "Pay Slip",
    "url": "https://hr.company.com/payslip",
    "linkText": "View Pay Slip",
    "description": "Download your monthly pay slip"
  }
}
```

---

### Query 3: Leave Balance
**User Input:**
- "Check my leave balance"
- "How many leaves do I have?"
- "Show my vacation days"
- "Leave information"

**Expected Match:**
```json
{
  "success": true,
  "data": {
    "title": "Leave Balance",
    "url": "https://hr.company.com/leave",
    "linkText": "Check Leave Balance",
    "description": "View your current leave balance and history"
  }
}
```

---

### Query 4: Performance Review
**User Input:**
- "Show my performance review"
- "I need performance feedback"
- "Where can I see my appraisal?"
- "Performance information"

**Expected Match:**
```json
{
  "success": true,
  "data": {
    "title": "Performance Review",
    "url": "https://hr.company.com/performance",
    "linkText": "View Performance Review",
    "description": "Access your performance review and feedback"
  }
}
```

---

### Query 5: Benefits
**User Input:**
- "Show me benefits"
- "I want to enroll in benefits"
- "Health insurance information"
- "Benefits enrollment"

**Expected Match:**
```json
{
  "success": true,
  "data": {
    "title": "Benefits Enrollment",
    "url": "https://hr.company.com/benefits",
    "linkText": "Enroll in Benefits",
    "description": "Manage your health and insurance benefits"
  }
}
```

---

### Query 6: Training
**User Input:**
- "Access training portal"
- "I need training courses"
- "Show me learning resources"
- "Where can I find training?"

**Expected Match:**
```json
{
  "success": true,
  "data": {
    "title": "Training Portal",
    "url": "https://hr.company.com/training",
    "linkText": "Access Training",
    "description": "Browse and enroll in training courses"
  }
}
```

---

## Advanced Queries

### Query 7: Partial Match
**User Input:**
- "reward" (single word)
- "training" (single word)
- "benefits" (single word)

**Expected:** Should match the most relevant item based on the keyword

---

### Query 8: Multiple Keywords
**User Input:**
- "I need my annual reward and bonus"
- "Show training and development"

**Expected:** Should match based on primary keyword (e.g., "reward" or "training")

---

### Query 9: Question Format
**User Input:**
- "Where can I check my leave?"
- "How do I access my pay slip?"
- "What is the link for training?"

**Expected:** Should extract keywords and match appropriately

---

## Edge Cases

### Query 10: No Match
**User Input:**
- "Show me office cafeteria menu"
- "I need parking information"
- "Random query xyz"

**Expected Response:**
```json
{
  "success": false,
  "message": "No matching HR resource found. Available categories: Rewards, Pay, Leave, Training, Benefits, Performance"
}
```

**Display:** Error message with suggestions

---

### Query 11: Ambiguous Query
**User Input:**
- "Show me information"
- "I need help"
- "HR stuff"

**Expected:** Copilot should ask clarifying question or show top HR resources

---

### Query 12: Very Long Query
**User Input:**
- "Hi, I am looking for my reward statement that shows my annual bonus and compensation details for this year, can you help me find it?"

**Expected:** Should extract "reward" keyword and match to Reward Statement

---

## Testing Matrix

| Input Type | Example | Expected Behavior |
|-----------|---------|-------------------|
| Direct match | "reward statement" | ✅ Exact match |
| Partial word | "reward" | ✅ Match Reward Statement |
| Question format | "Where is my pay slip?" | ✅ Extract "pay slip" |
| Multiple keywords | "leave balance check" | ✅ Match Leave Balance |
| Misspelling | "rewrd" | ⚠️ May not match (consider fuzzy search) |
| Case variation | "REWARD STATEMENT" | ✅ Case-insensitive match |
| Special characters | "pay-slip" | ✅ Should handle hyphens |
| Very short | "pay" | ✅ Match Pay Slip |
| No match | "xyz123" | ✅ Show error message |

---

## Response Time Expectations

- **Query processing:** < 1 second
- **Dataverse lookup:** < 2 seconds
- **Card rendering:** < 1 second
- **Total user experience:** < 4 seconds end-to-end

---

## User Experience Guidelines

### Good Queries
✅ "Get my reward statement"
✅ "Show pay slip"
✅ "I need leave information"
✅ "Training portal"

### Queries That Need Improvement
⚠️ "Show me stuff" (too vague)
⚠️ "Help" (too generic)
⚠️ "Things" (no context)

### How to Guide Users

**Provide examples in welcome message:**
"You can ask me things like:
- 'Show my reward statement'
- 'Where is my pay slip?'
- 'Check leave balance'
- 'Access training portal'"

**In error messages, suggest alternatives:**
"I couldn't find that. Try asking about:
- Reward Statement
- Pay Slip
- Leave Balance
- Training Portal
- Benefits
- Performance Review"

---

## Conversation Flow Examples

### Example 1: Complete Success Flow
```
User: "Hi"
Bot: "Hello! I can help you find HR resources. What are you looking for?"
User: "I need my reward statement"
Bot: [Displays Adaptive Card with Reward Statement link]
Bot: "Here's the link to your Reward Statement. Is there anything else I can help you with?"
```

### Example 2: Clarification Flow
```
User: "I need HR help"
Bot: "I'd be happy to help! What HR resource do you need?"
User: "not sure"
Bot: "Here are some popular HR resources:
     - Reward Statement
     - Pay Slip
     - Leave Balance
     - Training Portal
     Which one would you like?"
User: "Training"
Bot: [Displays Adaptive Card with Training Portal link]
```

### Example 3: No Match Flow
```
User: "Show me parking pass"
Bot: "I couldn't find information about parking pass in the HR resources."
Bot: "Here are the HR resources I can help you with:
     - Reward Statement
     - Pay Slip
     - Leave Balance
     - Performance Review
     - Benefits Enrollment
     - Training Portal
     Would you like to access any of these?"
```

---

## Testing Checklist

Use this checklist when testing your implementation:

- [ ] Test all 8 basic HR resources
- [ ] Test with single keywords
- [ ] Test with full questions
- [ ] Test with multiple keywords
- [ ] Test with very long queries
- [ ] Test with no match scenarios
- [ ] Test Adaptive Card clickability
- [ ] Test URLs open correctly
- [ ] Test response time is acceptable
- [ ] Test error messages are helpful
- [ ] Test case insensitivity
- [ ] Test with special characters
- [ ] Test conversation context
- [ ] Test multiple queries in sequence

---

## Analytics to Track

Monitor these metrics for improvement:

1. **Most searched terms:** Which HR resources are accessed most?
2. **Failed queries:** What queries return no results?
3. **Response time:** How fast are results returned?
4. **User satisfaction:** Add feedback buttons to Adaptive Cards
5. **Click-through rate:** Do users click the links provided?

---

## Continuous Improvement

Based on usage data:

1. **Add more HR resources** if users search for items not in the table
2. **Improve search terms** if certain queries consistently fail
3. **Update descriptions** to be more helpful
4. **Add synonyms** to improve matching (e.g., "salary slip" = "pay slip")
5. **Implement fuzzy matching** for common misspellings

---

**Last Updated:** February 2026
**Version:** 1.0

# Quick Start Guide

This is a simplified guide to get you started quickly with the Copilot Studio Dataverse integration.

## 🚀 Quick Setup (5 Steps)

### Step 1: Create Dataverse Table (5 minutes)
1. Go to [Power Apps](https://make.powerapps.com)
2. Create new table: **HR Links**
3. Add columns:
   - `Title` (Text)
   - `URL` (Text)
   - `Link Text` (Text)
   - `Description` (Multi-line text)
4. Add sample data (see sample-data.csv)

### Step 2: Create Power Automate Flow (10 minutes)
1. In Copilot Studio, create a new flow
2. Trigger: "When Copilot Studio calls this flow"
3. Add input: `UserQuery` (Text)
4. Add action: "List rows from Dataverse"
   - Filter: `contains(title,'UserQuery') or contains(description,'UserQuery')`
5. Return result as JSON (see docs/power-automate-flow.md)

### Step 3: Configure Copilot Studio (10 minutes)
1. Create new copilot: "HR Assistant"
2. Create topic: "Get HR Link"
3. Add question: "What HR resource do you need?"
4. Call your Power Automate flow
5. Display result in Adaptive Card

### Step 4: Add Adaptive Card (5 minutes)
1. In topic, add "Show a message" node
2. Select "Adaptive Card"
3. Use template from `adaptive-cards/hr-link-card-simple.json`
4. Map variables:
   - Title → `HRLink.title`
   - URL → `HRLink.url`
   - Link Text → `HRLink.linkText`

### Step 5: Test! (2 minutes)
1. Open Test panel
2. Type: "Get my reward statement"
3. Verify Adaptive Card displays with clickable link

## 📁 Project Files

```
copilot-studio-dataverse-integration/
├── README.md                           # Overview & features
├── QUICKSTART.md                       # This file
├── package.json                        # Node.js config
├── scripts/
│   ├── dataverse-query.js             # Query logic (sample)
│   └── response-formatter.js          # JSON formatter
├── prompts/
│   └── copilot-prompt-instructions.md # Detailed Copilot config
├── adaptive-cards/
│   ├── hr-link-card.json              # Rich card template
│   └── hr-link-card-simple.json       # Simple card template
├── docs/
│   ├── setup-guide.md                 # Complete step-by-step guide
│   ├── example-queries.md             # Sample queries & responses
│   └── power-automate-flow.md         # Flow configuration
└── demo/
    └── demo-query.js                  # Test script
```

## 🧪 Test the Sample Code

```bash
# Navigate to project directory
cd copilot-studio-dataverse-integration

# Run demo
node demo/demo-query.js
```

This will show you:
- How queries are processed
- JSON response format
- Adaptive Card structure
- Sample HR links

## 📝 Sample User Queries

Try these in your copilot:
- "Get my reward statement"
- "Show me my pay slip"
- "Where can I check my leave balance?"
- "I need the training portal"
- "Benefits information"

## 🎯 Expected Result

When a user asks **"Get my reward statement"**, they see:

```
┌─────────────────────────────────────┐
│  🔗 HR Resource Found               │
├─────────────────────────────────────┤
│  Reward Statement                   │
│                                      │
│  Access your annual reward          │
│  statement and bonus information    │
│                                      │
│  [🔗 View Reward Statement]         │
│  (clickable button)                 │
└─────────────────────────────────────┘
```

## 💡 Key Concepts

1. **Natural Language Processing**: Extracts keywords from user query
2. **Dataverse Query**: Searches HR Links table
3. **JSON Response**: Returns structured data
4. **Adaptive Card**: Displays user-friendly interface
5. **Clickable Link**: Opens URL in new window

## 🔧 Customization

### Add More HR Links
Edit your Dataverse table directly or import CSV data.

### Customize Adaptive Card
Edit JSON templates in `adaptive-cards/` folder.

### Improve Search
Modify filter logic in Power Automate flow.

### Track Usage
Add analytics to your flow (see setup-guide.md).

## 📚 Full Documentation

For detailed instructions, see:
- [Complete Setup Guide](docs/setup-guide.md) - Step-by-step walkthrough
- [Prompt Instructions](prompts/copilot-prompt-instructions.md) - Copilot configuration
- [Example Queries](docs/example-queries.md) - Test cases
- [Power Automate Flow](docs/power-automate-flow.md) - Flow details

## 🆘 Need Help?

**Common Issues:**

**Q: Adaptive Card not showing**
A: Check JSON syntax and variable mappings

**Q: No results found**
A: Verify Dataverse table has data and column names match

**Q: Flow fails**
A: Check Dataverse connection permissions

**Q: Wrong result returned**
A: Improve filter query in Power Automate

## ✅ Success Checklist

- [ ] Dataverse table created with sample data
- [ ] Power Automate flow configured and tested
- [ ] Copilot Studio topic created
- [ ] Adaptive Card displays correctly
- [ ] Links are clickable and open correct URLs
- [ ] Tested with multiple queries
- [ ] Error handling works for no matches

## 🎓 Next Steps

After basic setup works:
1. Add more HR resources (100+ records)
2. Implement fuzzy matching for misspellings
3. Add user feedback mechanism
4. Track analytics (most searched terms)
5. Expand to multiple categories
6. Add personalization based on user role

## 📞 Support

This project is part of the JavaScript-Projects repository.
For issues or questions, refer to the repository documentation.

---

**Ready to build?** Start with [Setup Guide](docs/setup-guide.md)!

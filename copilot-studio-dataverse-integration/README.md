# Copilot Studio Dataverse Integration - HR Links Solution

## Overview
This project provides an end-to-end solution for integrating Microsoft Copilot Studio with Dataverse to retrieve HR-related links and display them in a user-friendly format using Adaptive Cards.

## Problem Statement
Create a prompt tool that:
1. Reads data from a Dataverse table containing HR links (100+ records)
2. Finds specific items based on user queries (e.g., "Get my reward statement")
3. Returns results in JSON format
4. Displays clickable links in Adaptive Cards

## Solution Architecture

### Components
1. **Dataverse Table Structure** - HR Links table with Title, URL, and Link columns
2. **Prompt Tool** - Natural language query processor
3. **API Integration** - JavaScript code to query Dataverse
4. **JSON Response Formatter** - Structures data for Adaptive Cards
5. **Adaptive Card Template** - User-friendly display format

## Quick Start

### Prerequisites
- Microsoft Copilot Studio access
- Dataverse environment with HR Links table
- Power Platform environment

### Directory Structure
```
copilot-studio-dataverse-integration/
├── README.md (this file)
├── scripts/
│   ├── dataverse-query.js       # JavaScript for querying Dataverse
│   └── response-formatter.js    # Formats data to JSON
├── prompts/
│   └── copilot-prompt-instructions.md  # Prompt tool configuration
├── adaptive-cards/
│   └── hr-link-card.json        # Adaptive Card template
└── docs/
    ├── setup-guide.md           # Complete setup instructions
    └── example-queries.md       # Sample user queries
```

## Features
- ✅ Natural language query understanding
- ✅ Fuzzy matching for HR link titles
- ✅ JSON response format
- ✅ Clickable hyperlinks in Adaptive Cards
- ✅ User-friendly interface
- ✅ Support for 100+ records

## Usage Example

**User Query:** "Get my reward statement"

**System Response:** 
```json
{
  "title": "Reward Statement",
  "url": "https://hr.company.com/rewards",
  "description": "Access your annual reward statement"
}
```

**Displayed as:** Interactive Adaptive Card with clickable link

## Documentation
- [Complete Setup Guide](docs/setup-guide.md) - Step-by-step implementation
- [Prompt Instructions](prompts/copilot-prompt-instructions.md) - Copilot Studio configuration
- [Example Queries](docs/example-queries.md) - Sample interactions

## Technologies Used
- Microsoft Copilot Studio
- Microsoft Dataverse
- Power Automate (optional)
- Adaptive Cards
- JavaScript/Node.js

## Author
Created for the JavaScript-Projects repository to demonstrate Copilot Studio integration patterns.

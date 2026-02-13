# Architecture Diagram

## System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         END USER                                 │
│  Types: "Get my reward statement"                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Natural Language Query
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   MICROSOFT COPILOT STUDIO                       │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Topic: Get HR Link                                      │   │
│  │  • Captures user query                                   │   │
│  │  • Calls Power Automate flow                             │   │
│  │  • Displays Adaptive Card response                       │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ UserQuery parameter
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    POWER AUTOMATE FLOW                           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  1. Receive UserQuery from Copilot                       │  │
│  │  2. Extract keywords (e.g., "reward")                    │  │
│  │  3. Query Dataverse with filter                          │  │
│  │  4. Format result as JSON                                │  │
│  │  5. Return to Copilot Studio                             │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ OData Query
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MICROSOFT DATAVERSE                           │
│                                                                   │
│  Table: HR Links (100+ records)                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Column         │ Value                                 │    │
│  │─────────────────┼───────────────────────────────────────│    │
│  │  Title          │ "Reward Statement"                   │    │
│  │  URL            │ "https://hr.company.com/rewards"     │    │
│  │  Link Text      │ "View Reward Statement"              │    │
│  │  Description    │ "Access your annual reward..."       │    │
│  └────────────────────────────────────────────────────────┘    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Query Result
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        JSON RESPONSE                             │
│                                                                   │
│  {                                                                │
│    "success": true,                                               │
│    "data": {                                                      │
│      "title": "Reward Statement",                                │
│      "url": "https://hr.company.com/rewards",                    │
│      "linkText": "View Reward Statement",                        │
│      "description": "Access your annual reward statement..."     │
│    }                                                              │
│  }                                                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Formatted Response
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ADAPTIVE CARD                               │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  🔗 Reward Statement                                     │  │
│  │                                                           │  │
│  │  Access your annual reward statement and bonus           │  │
│  │  information                                              │  │
│  │                                                           │  │
│  │  [ View Reward Statement ] ← Clickable Button            │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ User clicks button
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      HR RESOURCE PAGE                            │
│              https://hr.company.com/rewards                      │
│                   (Opens in new tab)                             │
└─────────────────────────────────────────────────────────────────┘
```

## Component Interaction

```
┌──────────────┐    Query     ┌───────────────┐   Search    ┌────────────┐
│   Copilot    │──────────────▶│Power Automate │────────────▶│ Dataverse  │
│   Studio     │              │     Flow       │             │   Table    │
└──────────────┘              └───────────────┘             └────────────┘
       ▲                              │                             │
       │                              │                             │
       │        Adaptive Card         │         Record Data        │
       └──────────────────────────────┴─────────────────────────────┘
```

## Data Flow

```
User Input: "Get my reward statement"
     ↓
Keyword Extraction: ["reward", "statement"]
     ↓
Dataverse Filter: contains(title, "reward") OR contains(description, "reward")
     ↓
Query Result: 1 matching record
     ↓
JSON Format: { success: true, data: {...} }
     ↓
Adaptive Card: Visual representation with clickable link
     ↓
User Action: Clicks "View Reward Statement"
     ↓
Browser Opens: https://hr.company.com/rewards
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    MICROSOFT POWER PLATFORM                  │
│                                                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────┐  │
│  │ Copilot Studio  │  │ Power Automate  │  │ Dataverse  │  │
│  │  • NLP          │  │  • Integration  │  │  • Storage │  │
│  │  • Topics       │  │  • Logic        │  │  • Query   │  │
│  │  • UI           │  │  • Connectors   │  │  • API     │  │
│  └─────────────────┘  └─────────────────┘  └────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      ADAPTIVE CARDS                          │
│  • JSON Schema v1.5                                          │
│  • Cross-platform UI                                         │
│  • Interactive elements                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    JAVASCRIPT/NODE.JS                        │
│  • Sample code for testing                                   │
│  • Query logic demonstration                                 │
│  • Response formatting                                       │
└─────────────────────────────────────────────────────────────┘
```

## Security Flow

```
User Request
     ↓
Azure AD Authentication
     ↓
Copilot Studio (Authenticated Session)
     ↓
Power Automate (Service Account)
     ↓
Dataverse (Role-Based Access Control)
     ↓
Filtered Data (User-specific if needed)
     ↓
Response to User
```

## Scalability Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  LOAD BALANCER                                                │
└────────────┬─────────────────────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌─────────┐      ┌─────────┐
│Copilot  │      │Copilot  │  Multiple Instances
│Instance │      │Instance │
│   #1    │      │   #2    │
└────┬────┘      └────┬────┘
     │                │
     └────────┬───────┘
              │
              ▼
     ┌─────────────────┐
     │ Power Automate  │   Flow Execution
     │   (Parallel)    │
     └────────┬────────┘
              │
              ▼
     ┌─────────────────┐
     │   Dataverse     │   Indexed Tables
     │   (Optimized)   │   Cached Queries
     └─────────────────┘
```

## Error Handling Flow

```
User Query
     ↓
  ┌──────────────┐
  │ Input Valid? │───No──▶ Show error message
  └──┬───────────┘
     │ Yes
     ▼
  ┌──────────────────┐
  │Dataverse Online? │───No──▶ Retry with fallback
  └──┬───────────────┘
     │ Yes
     ▼
  ┌──────────────┐
  │Match Found?  │───No──▶ Show "No results" + suggestions
  └──┬───────────┘
     │ Yes
     ▼
  ┌──────────────┐
  │Display Card  │
  └──────────────┘
```

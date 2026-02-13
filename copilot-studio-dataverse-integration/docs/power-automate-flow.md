# Power Automate Flow Configuration

## Flow Overview

This document provides the complete Power Automate flow configuration in a format that can be imported or recreated.

## Flow Structure

```
Trigger: When Copilot Studio calls this flow
  ↓
Input: UserQuery (Text)
  ↓
Action: List rows from Dataverse
  - Table: HR Links
  - Filter: contains(title, UserQuery) OR contains(description, UserQuery)
  - Top Count: 1
  ↓
Condition: Check if results exist
  ├─ Yes → Format success response → Return to Copilot
  └─ No → Format error response → Return to Copilot
```

## Detailed Configuration

### 1. Trigger: Power Apps (V2) or Copilot Studio

```json
{
  "inputs": {
    "schema": {
      "type": "object",
      "properties": {
        "text": {
          "type": "string",
          "description": "UserQuery"
        }
      },
      "required": ["text"]
    }
  }
}
```

### 2. List Rows from Dataverse

**Action:** Microsoft Dataverse - List rows

**Configuration:**
- **Table name:** `cr123_hrlinks` (replace with your table name)
- **Filter Query:**
  ```
  contains(cr123_title,'@{triggerBody()?['text']}') or contains(cr123_description,'@{triggerBody()?['text']}')
  ```
- **Select columns:** 
  ```
  cr123_title,cr123_url,cr123_link,cr123_description
  ```
- **Row count:** `1`

### 3. Condition: Check Results

**Expression:**
```
length(outputs('List_rows_from_Dataverse')?['body/value'])
```

**Comparison:** is greater than `0`

### 4. If Yes Branch (Success)

#### 4a. Initialize Variable - FirstResult

- **Name:** `FirstResult`
- **Type:** `Object`
- **Value:** 
  ```
  first(outputs('List_rows_from_Dataverse')?['body/value'])
  ```

#### 4b. Compose - Success Response

**Inputs:**
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

#### 4c. Return Value to Copilot

**Outputs:**
- **Name:** `HRLinkJSON`
- **Type:** `Text`
- **Value:** `@{outputs('Compose_Success')}`

### 5. If No Branch (No Results)

#### 5a. Compose - Error Response

**Inputs:**
```json
{
  "success": false,
  "message": "No matching HR resource found. Try: reward statement, pay slip, leave balance, training, benefits, performance review"
}
```

#### 5b. Return Value to Copilot

**Outputs:**
- **Name:** `HRLinkJSON`
- **Type:** `Text`
- **Value:** `@{outputs('Compose_Error')}`

## Complete Flow JSON (Export)

Save this as a `.json` file to import into Power Automate:

```json
{
  "properties": {
    "definition": {
      "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
      "contentVersion": "1.0.0.0",
      "triggers": {
        "manual": {
          "type": "Request",
          "kind": "PowerAppV2",
          "inputs": {
            "schema": {
              "type": "object",
              "properties": {
                "text": {
                  "type": "string",
                  "description": "UserQuery"
                }
              },
              "required": ["text"]
            }
          }
        }
      },
      "actions": {
        "List_rows": {
          "type": "OpenApiConnection",
          "inputs": {
            "host": {
              "connectionName": "shared_commondataserviceforapps",
              "operationId": "ListRecords",
              "apiId": "/providers/Microsoft.PowerApps/apis/shared_commondataserviceforapps"
            },
            "parameters": {
              "entityName": "cr123_hrlinks",
              "$filter": "contains(cr123_title,'@{triggerBody()?['text']}') or contains(cr123_description,'@{triggerBody()?['text']}')",
              "$select": "cr123_title,cr123_url,cr123_link,cr123_description",
              "$top": 1
            }
          }
        },
        "Condition": {
          "type": "If",
          "expression": {
            "greater": [
              "@length(outputs('List_rows')?['body/value'])",
              0
            ]
          },
          "actions": {
            "Initialize_FirstResult": {
              "type": "InitializeVariable",
              "inputs": {
                "variables": [
                  {
                    "name": "FirstResult",
                    "type": "object",
                    "value": "@first(outputs('List_rows')?['body/value'])"
                  }
                ]
              }
            },
            "Compose_Success": {
              "type": "Compose",
              "inputs": {
                "success": true,
                "data": {
                  "title": "@{variables('FirstResult')?['cr123_title']}",
                  "url": "@{variables('FirstResult')?['cr123_url']}",
                  "linkText": "@{variables('FirstResult')?['cr123_link']}",
                  "description": "@{variables('FirstResult')?['cr123_description']}"
                }
              }
            },
            "Return_Success": {
              "type": "Response",
              "kind": "PowerAppV2",
              "inputs": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "HRLinkJSON": {
                      "type": "string"
                    }
                  }
                },
                "body": {
                  "HRLinkJSON": "@{outputs('Compose_Success')}"
                }
              }
            }
          },
          "else": {
            "actions": {
              "Compose_Error": {
                "type": "Compose",
                "inputs": {
                  "success": false,
                  "message": "No matching HR resource found. Try: reward statement, pay slip, leave balance, training, benefits, performance review"
                }
              },
              "Return_Error": {
                "type": "Response",
                "kind": "PowerAppV2",
                "inputs": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "HRLinkJSON": {
                        "type": "string"
                      }
                    }
                  },
                  "body": {
                    "HRLinkJSON": "@{outputs('Compose_Error')}"
                  }
                }
              }
            }
          },
          "runAfter": {
            "List_rows": ["Succeeded"]
          }
        }
      }
    }
  }
}
```

## Testing the Flow

### Test Input 1: Successful Match
```json
{
  "text": "reward"
}
```

**Expected Output:**
```json
{
  "HRLinkJSON": "{\"success\":true,\"data\":{\"title\":\"Reward Statement\",\"url\":\"https://hr.company.com/rewards\",\"linkText\":\"View Reward Statement\",\"description\":\"Access your annual reward statement\"}}"
}
```

### Test Input 2: No Match
```json
{
  "text": "xyz123random"
}
```

**Expected Output:**
```json
{
  "HRLinkJSON": "{\"success\":false,\"message\":\"No matching HR resource found...\"}"
}
```

## Optimization Tips

1. **Add Caching:** Store recent results to reduce Dataverse calls
2. **Batch Queries:** If supporting multiple results, adjust top count
3. **Error Handling:** Add try-catch blocks for connection failures
4. **Logging:** Add actions to log queries for analytics
5. **Performance:** Index searchable columns in Dataverse

## Security Considerations

1. **Authentication:** Ensure proper service account permissions
2. **Data Access:** Restrict Dataverse table access to authorized users
3. **Input Validation:** Sanitize user input to prevent injection
4. **Rate Limiting:** Configure throttling to prevent abuse
5. **Audit Trail:** Enable logging for compliance

## Troubleshooting

**Common Issues:**

1. **"Cannot read property"** → Check column names match your Dataverse schema
2. **"Unauthorized"** → Verify Dataverse connection permissions
3. **Empty results** → Test filter query directly in Dataverse
4. **Timeout** → Optimize query or increase timeout settings
5. **JSON parse error** → Validate JSON structure in compose actions

## Next Steps

1. Import or recreate this flow in Power Automate
2. Test with sample data
3. Connect to Copilot Studio topic
4. Deploy to production environment
5. Monitor usage and performance

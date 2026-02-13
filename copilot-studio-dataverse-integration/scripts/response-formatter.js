/**
 * Response Formatter Module
 * Formats HR link data into JSON for Adaptive Cards
 */

/**
 * Format HR link data for Copilot Studio response
 * @param {Object} hrLink - HR link data from Dataverse
 * @returns {Object} - Formatted JSON response
 */
function formatForCopilot(hrLink) {
  if (!hrLink) {
    return {
      type: "error",
      message: "No HR link found matching your query."
    };
  }
  
  return {
    type: "hrlink",
    title: hrLink.title,
    url: hrLink.url,
    linkText: hrLink.link || "Click here",
    description: hrLink.description || "",
    timestamp: new Date().toISOString()
  };
}

/**
 * Format HR link data for Adaptive Card
 * @param {Object} hrLink - HR link data
 * @returns {Object} - Adaptive Card JSON
 */
function formatAsAdaptiveCard(hrLink) {
  if (!hrLink) {
    return createErrorCard("No matching HR link found.");
  }
  
  return {
    type: "AdaptiveCard",
    version: "1.5",
    body: [
      {
        type: "TextBlock",
        text: hrLink.title,
        weight: "Bolder",
        size: "Large",
        wrap: true,
        color: "Accent"
      },
      {
        type: "TextBlock",
        text: hrLink.description || "Click the link below to access this resource",
        wrap: true,
        spacing: "Small",
        isSubtle: true
      },
      {
        type: "ActionSet",
        actions: [
          {
            type: "Action.OpenUrl",
            title: hrLink.link || "Open Link",
            url: hrLink.url,
            style: "positive"
          }
        ]
      }
    ],
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
  };
}

/**
 * Create error Adaptive Card
 * @param {string} errorMessage - Error message to display
 * @returns {Object} - Error Adaptive Card
 */
function createErrorCard(errorMessage) {
  return {
    type: "AdaptiveCard",
    version: "1.5",
    body: [
      {
        type: "TextBlock",
        text: "⚠️ Not Found",
        weight: "Bolder",
        size: "Large",
        color: "Warning"
      },
      {
        type: "TextBlock",
        text: errorMessage,
        wrap: true
      },
      {
        type: "TextBlock",
        text: "Try asking about: Reward Statement, Pay Slip, Leave Balance, Benefits, or Training",
        wrap: true,
        isSubtle: true,
        size: "Small"
      }
    ],
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
  };
}

/**
 * Format multiple HR links for display
 * @param {Array} hrLinks - Array of HR link objects
 * @returns {Object} - Adaptive Card with multiple items
 */
function formatMultipleLinks(hrLinks) {
  if (!hrLinks || hrLinks.length === 0) {
    return createErrorCard("No HR links found.");
  }
  
  const body = [
    {
      type: "TextBlock",
      text: "HR Resources",
      weight: "Bolder",
      size: "Large",
      color: "Accent"
    },
    {
      type: "TextBlock",
      text: `Found ${hrLinks.length} resources`,
      isSubtle: true,
      spacing: "Small"
    }
  ];
  
  // Add each link as a container
  hrLinks.forEach((link, index) => {
    body.push({
      type: "Container",
      separator: index > 0,
      spacing: "Medium",
      items: [
        {
          type: "TextBlock",
          text: link.title,
          weight: "Bolder",
          size: "Medium"
        },
        {
          type: "TextBlock",
          text: link.description || "",
          wrap: true,
          isSubtle: true,
          size: "Small"
        },
        {
          type: "ActionSet",
          actions: [
            {
              type: "Action.OpenUrl",
              title: link.link || "Open",
              url: link.url
            }
          ]
        }
      ]
    });
  });
  
  return {
    type: "AdaptiveCard",
    version: "1.5",
    body: body,
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
  };
}

/**
 * Format response for Power Automate flow
 * @param {Object} hrLink - HR link data
 * @returns {Object} - Power Automate compatible response
 */
function formatForPowerAutomate(hrLink) {
  if (!hrLink) {
    return {
      statusCode: 404,
      body: {
        error: "Not found",
        message: "No matching HR link found"
      }
    };
  }
  
  return {
    statusCode: 200,
    body: {
      title: hrLink.title,
      url: hrLink.url,
      linkText: hrLink.link,
      description: hrLink.description,
      adaptiveCard: formatAsAdaptiveCard(hrLink)
    }
  };
}

/**
 * Complete formatter that combines query result and card generation
 * @param {Object} queryResult - Result from processUserQuery
 * @returns {Object} - Complete formatted response
 */
function formatCompleteResponse(queryResult) {
  if (!queryResult.success) {
    return {
      success: false,
      message: queryResult.message,
      card: createErrorCard(queryResult.message)
    };
  }
  
  return {
    success: true,
    data: formatForCopilot(queryResult.data),
    card: formatAsAdaptiveCard(queryResult.data),
    raw: queryResult.data
  };
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatForCopilot,
    formatAsAdaptiveCard,
    createErrorCard,
    formatMultipleLinks,
    formatForPowerAutomate,
    formatCompleteResponse
  };
}

// Example usage
if (require.main === module) {
  const sampleHRLink = {
    title: "Reward Statement",
    url: "https://hr.company.com/rewards",
    link: "View Reward Statement",
    description: "Access your annual reward statement and bonus information"
  };
  
  console.log('Copilot Format:');
  console.log(JSON.stringify(formatForCopilot(sampleHRLink), null, 2));
  
  console.log('\nAdaptive Card Format:');
  console.log(JSON.stringify(formatAsAdaptiveCard(sampleHRLink), null, 2));
}

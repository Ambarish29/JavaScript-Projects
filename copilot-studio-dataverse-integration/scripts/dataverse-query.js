/**
 * Dataverse Query Module
 * Queries HR Links table from Dataverse based on user input
 */

/**
 * Sample Dataverse HR Links data structure
 */
const sampleHRLinks = [
  {
    title: "Reward Statement",
    url: "https://hr.company.com/rewards",
    link: "View Reward Statement",
    description: "Access your annual reward statement and bonus information"
  },
  {
    title: "Pay Slip",
    url: "https://hr.company.com/payslip",
    link: "View Pay Slip",
    description: "Download your monthly pay slip"
  },
  {
    title: "Leave Balance",
    url: "https://hr.company.com/leave",
    link: "Check Leave Balance",
    description: "View your current leave balance and history"
  },
  {
    title: "Performance Review",
    url: "https://hr.company.com/performance",
    link: "View Performance Review",
    description: "Access your performance review and feedback"
  },
  {
    title: "Benefits Enrollment",
    url: "https://hr.company.com/benefits",
    link: "Enroll in Benefits",
    description: "Manage your health and insurance benefits"
  },
  {
    title: "Training Portal",
    url: "https://hr.company.com/training",
    link: "Access Training",
    description: "Browse and enroll in training courses"
  },
  {
    title: "Employee Handbook",
    url: "https://hr.company.com/handbook",
    link: "View Handbook",
    description: "Read company policies and procedures"
  },
  {
    title: "Time Sheet",
    url: "https://hr.company.com/timesheet",
    link: "Submit Time Sheet",
    description: "Log your working hours and submit timesheet"
  }
];

/**
 * Search HR Links based on user query
 * @param {string} userQuery - Natural language query from user
 * @returns {Object|null} - Matching HR link or null
 */
function searchHRLink(userQuery) {
  const query = userQuery.toLowerCase();
  
  // Find matching item based on keywords
  const match = sampleHRLinks.find(item => {
    const titleLower = item.title.toLowerCase();
    const descLower = item.description.toLowerCase();
    
    // Check if any word in the query matches title or description
    return query.split(' ').some(word => 
      word.length > 2 && (titleLower.includes(word) || descLower.includes(word))
    );
  });
  
  return match || null;
}

/**
 * Query Dataverse using Web API (for actual implementation)
 * This function shows how to query Dataverse in a real scenario
 * 
 * @param {string} tableName - Dataverse table name (e.g., 'cr123_hrlinks')
 * @param {string} searchTerm - Search term from user query
 * @param {string} accessToken - Azure AD access token
 * @returns {Promise<Object>} - Query results
 */
async function queryDataverse(tableName, searchTerm, accessToken) {
  const dataverseUrl = process.env.DATAVERSE_URL || 'https://org.crm.dynamics.com';
  const apiVersion = 'v9.2';
  
  // Build OData query with filter
  const filter = `contains(cr123_title, '${searchTerm}')`;
  const select = 'cr123_title,cr123_url,cr123_link,cr123_description';
  const url = `${dataverseUrl}/api/data/${apiVersion}/${tableName}?$filter=${filter}&$select=${select}&$top=1`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'OData-MaxVersion': '4.0',
        'OData-Version': '4.0',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Dataverse API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Return first matching record
    if (data.value && data.value.length > 0) {
      const record = data.value[0];
      return {
        title: record.cr123_title,
        url: record.cr123_url,
        link: record.cr123_link,
        description: record.cr123_description
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error querying Dataverse:', error);
    throw error;
  }
}

/**
 * Extract keywords from user query for better matching
 * @param {string} query - User query
 * @returns {Array<string>} - Extracted keywords
 */
function extractKeywords(query) {
  // Remove common words (stop words)
  const stopWords = ['my', 'the', 'get', 'show', 'find', 'view', 'access', 'i', 'want', 'need'];
  const words = query.toLowerCase().split(/\s+/);
  
  return words.filter(word => 
    word.length > 2 && !stopWords.includes(word)
  );
}

/**
 * Main function to process user query and return HR link
 * @param {string} userQuery - User's natural language query
 * @param {boolean} useDataverse - Whether to query actual Dataverse (default: false)
 * @returns {Promise<Object>} - HR link information
 */
async function processUserQuery(userQuery, useDataverse = false) {
  try {
    let result;
    
    if (useDataverse) {
      // Extract main keyword for Dataverse query
      const keywords = extractKeywords(userQuery);
      const searchTerm = keywords[0] || userQuery;
      
      // Get access token (implement your authentication logic)
      const accessToken = process.env.DATAVERSE_TOKEN;
      
      if (!accessToken) {
        throw new Error('Dataverse access token not found');
      }
      
      result = await queryDataverse('cr123_hrlinks', searchTerm, accessToken);
    } else {
      // Use local search for demo/testing
      result = searchHRLink(userQuery);
    }
    
    if (!result) {
      return {
        success: false,
        message: "No matching HR link found. Please try rephrasing your query.",
        suggestions: sampleHRLinks.slice(0, 3).map(item => item.title)
      };
    }
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      message: `Error processing query: ${error.message}`
    };
  }
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    searchHRLink,
    queryDataverse,
    extractKeywords,
    processUserQuery,
    sampleHRLinks
  };
}

// Example usage
if (require.main === module) {
  // Test the function
  const testQuery = "Get my reward statement";
  processUserQuery(testQuery, false).then(result => {
    console.log('Query:', testQuery);
    console.log('Result:', JSON.stringify(result, null, 2));
  });
}

/**
 * Demo Script - Complete End-to-End Example
 * This demonstrates the full flow from user query to Adaptive Card display
 */

// Import modules
const { processUserQuery, sampleHRLinks } = require('../scripts/dataverse-query');
const { formatCompleteResponse } = require('../scripts/response-formatter');

/**
 * Simulate a complete user interaction
 */
async function demonstrateCompleteFlow() {
  console.log('='.repeat(70));
  console.log('COPILOT STUDIO DATAVERSE INTEGRATION - COMPLETE DEMO');
  console.log('='.repeat(70));
  console.log();

  // Test queries
  const testQueries = [
    "Get my reward statement",
    "Show me my pay slip",
    "I need leave balance",
    "Where is training portal?",
    "Some random query that won't match"
  ];

  for (const query of testQueries) {
    console.log('-'.repeat(70));
    console.log(`USER QUERY: "${query}"`);
    console.log('-'.repeat(70));

    // Step 1: Process the query
    const queryResult = await processUserQuery(query, false);
    
    // Step 2: Format the response
    const formattedResponse = formatCompleteResponse(queryResult);
    
    // Step 3: Display results
    if (formattedResponse.success) {
      console.log('✅ SUCCESS: Match found!');
      console.log();
      console.log('📋 Data for Copilot:');
      console.log(JSON.stringify(formattedResponse.data, null, 2));
      console.log();
      console.log('🎴 Adaptive Card JSON:');
      console.log(JSON.stringify(formattedResponse.card, null, 2));
      console.log();
      console.log('🔗 User would see a clickable card with:');
      console.log(`   Title: ${formattedResponse.raw.title}`);
      console.log(`   Description: ${formattedResponse.raw.description}`);
      console.log(`   Button: "${formattedResponse.raw.link}"`);
      console.log(`   URL: ${formattedResponse.raw.url}`);
    } else {
      console.log('❌ NO MATCH: Query did not match any HR resource');
      console.log();
      console.log('📋 Error Response:');
      console.log(JSON.stringify(formattedResponse, null, 2));
    }
    
    console.log();
  }

  console.log('='.repeat(70));
  console.log('AVAILABLE HR RESOURCES IN DATABASE');
  console.log('='.repeat(70));
  console.log();
  
  sampleHRLinks.forEach((link, index) => {
    console.log(`${index + 1}. ${link.title}`);
    console.log(`   URL: ${link.url}`);
    console.log(`   Description: ${link.description}`);
    console.log();
  });
}

/**
 * Demo: Show just the Adaptive Card format
 */
function demonstrateAdaptiveCard() {
  const { formatAsAdaptiveCard } = require('../scripts/response-formatter');
  
  const sampleData = {
    title: "Reward Statement",
    url: "https://hr.company.com/rewards",
    link: "View Reward Statement",
    description: "Access your annual reward statement and bonus information"
  };

  console.log('='.repeat(70));
  console.log('ADAPTIVE CARD EXAMPLE');
  console.log('='.repeat(70));
  console.log();
  console.log('This JSON would be sent to Copilot Studio to display:');
  console.log();
  console.log(JSON.stringify(formatAsAdaptiveCard(sampleData), null, 2));
  console.log();
}

/**
 * Demo: Show the Power Automate response format
 */
function demonstratePowerAutomateFormat() {
  const { formatForPowerAutomate } = require('../scripts/response-formatter');
  
  const sampleData = {
    title: "Pay Slip",
    url: "https://hr.company.com/payslip",
    link: "View Pay Slip",
    description: "Download your monthly pay slip"
  };

  console.log('='.repeat(70));
  console.log('POWER AUTOMATE RESPONSE FORMAT');
  console.log('='.repeat(70));
  console.log();
  console.log('This is what Power Automate flow would return:');
  console.log();
  console.log(JSON.stringify(formatForPowerAutomate(sampleData), null, 2));
  console.log();
}

// Run the demos
if (require.main === module) {
  (async () => {
    await demonstrateCompleteFlow();
    console.log();
    demonstrateAdaptiveCard();
    console.log();
    demonstratePowerAutomateFormat();
    
    console.log('='.repeat(70));
    console.log('DEMO COMPLETE');
    console.log('='.repeat(70));
    console.log();
    console.log('Next steps:');
    console.log('1. Review the setup guide: docs/setup-guide.md');
    console.log('2. Configure Copilot Studio: prompts/copilot-prompt-instructions.md');
    console.log('3. Set up Dataverse table with your HR links');
    console.log('4. Create Power Automate flow');
    console.log('5. Test with real users');
    console.log();
  })();
}

module.exports = {
  demonstrateCompleteFlow,
  demonstrateAdaptiveCard,
  demonstratePowerAutomateFormat
};

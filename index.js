const { getAllPatients, submitAssessment } = require('./apiClient');
const { analyzePatients } = require('./patientAnalyzer');

async function main() {
  try {
    // 1. Fetch all patient data from the API
    const allPatients = await getAllPatients();
    console.log(`Successfully fetched ${allPatients.length} patients.`);

    // 2. Analyze patients to generate alert lists
    const { highRiskPatients, feverPatients, dataQualityIssues } = analyzePatients(allPatients);

    console.log(highRiskPatients);
    console.log(feverPatients);
    console.log(dataQualityIssues);

    // 3. Submit the assessment results
    const submissionResult = await submitAssessment(highRiskPatients, feverPatients, dataQualityIssues);

  } catch (error) {
    console.error('Error: ', error.message);
  }
}

main();
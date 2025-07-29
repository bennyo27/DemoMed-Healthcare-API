const axios = require('axios');

const API_KEY = 'ak_34a746a5e3373d42dff4d58b85a42a16f459d18fdea85a15';
const BASE_URL = 'https://assessment.ksensetech.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'x-api-key': API_KEY }
});

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, retries = 5, delayDuration = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      if (error.response && (error.response.status === 429 || error.response.status >= 500)) {
        console.log(`Attempt ${i + 1} failed with status ${error.response.status}. Retrying in ${delayDuration}ms...`);
        await delay(delayDuration);
        delayDuration *= 2;
      } else {
        throw error;
      }
    }
  }
  throw new Error(`Failed to fetch data`);
}

async function getAllPatients() {
  let allPatients = [];
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    console.log(`Fetching page ${page}...`);
    const data = await fetchWithRetry(`/patients?page=${page}&limit=20`);
    if (data && data.data) {
      allPatients = allPatients.concat(data.data);
      hasNext = data.pagination.hasNext;
      page++;
    } else {
      hasNext = false;
    }
  }
  return allPatients;
}

async function submitAssessment(highRiskPatients, feverPatients, dataQualityIssues) {
  const payload = {
    high_risk_patients: highRiskPatients,
    fever_patients: feverPatients,
    data_quality_issues: dataQualityIssues
  };

  try {
    console.log('\nSubmitting assessment...');
    const response = await api.post('/submit-assessment', payload);
    return response.data;
  } catch (error) {
    console.error('Error submitting assessment:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = { getAllPatients, submitAssessment };
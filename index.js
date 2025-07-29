
const axios = require('axios');
const { calculateTotalRisk } = require('./riskScorer');

// Wasn't sure if this should be here or in a config file for the assessment
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

async function main() {
  try {
    const allPatients = await getAllPatients();

    allPatients.forEach(patient => {
      const totalRisk = calculateTotalRisk(patient);
    });

  } catch (error) {
    console.error('Error: ', error.message);
  }
}

main();

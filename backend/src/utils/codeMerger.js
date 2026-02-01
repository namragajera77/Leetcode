/**
 * Code Merger Utility
 * 
 * This module merges user's solution code with platform-generated wrapper code
 * to create a complete executable program for Judge0 submission.
 */

const { generateWrapper, parseFunctionSignature } = require('./codeWrapperGenerator');

/**
 * Merge user code with wrapper for Judge0 submission
 * @param {string} userCode - User's solution function/class
 * @param {string} language - Programming language
 * @param {Object} functionMetadata - Function signature from problem
 * @param {string} testInput - Test case input
 * @returns {string} - Complete merged code ready for Judge0
 */
const mergeCodeWithWrapper = (userCode, language, functionMetadata, testInput) => {
  try {
    // Get function signature for the specific language
    const langKey = language.toLowerCase() === 'c++' ? 'cpp' : language.toLowerCase();
    const functionSignature = functionMetadata.functionSignature[langKey];
    
    if (!functionSignature) {
      throw new Error(`Function signature not found for language: ${language}`);
    }
    
    // Parse the signature to extract metadata (pass language for special handling)
    const parsedMetadata = parseFunctionSignature(functionSignature, langKey);
    
    // Generate wrapper with user code
    const completeCode = generateWrapper(language, userCode, parsedMetadata, testInput);
    
    return completeCode;
  } catch (error) {
    console.error('Error merging code:', error);
    throw error;
  }
};

/**
 * Prepare submissions for Judge0 batch processing
 * @param {string} userCode - User's solution code
 * @param {string} language - Programming language
 * @param {Array} testCases - Array of test case objects { input, output }
 * @param {Object} functionMetadata - Function metadata from problem
 * @param {number} languageId - Judge0 language ID
 * @returns {Array} - Array of Judge0 submission objects
 */
const prepareSubmissions = (userCode, language, testCases, functionMetadata, languageId) => {
  return testCases.map((testCase) => {
    // Merge user code with wrapper for this test case
    const completeCode = mergeCodeWithWrapper(
      userCode,
      language,
      functionMetadata,
      testCase.input
    );
    
    return {
      source_code: completeCode,
      language_id: languageId,
      stdin: testCase.input,
      expected_output: testCase.output
    };
  });
};

/**
 * Validate user code structure (basic checks)
 * @param {string} userCode - User's code
 * @param {string} language - Programming language
 * @returns {Object} - { isValid: boolean, error: string }
 */
const validateUserCode = (userCode, language) => {
  if (!userCode || userCode.trim().length === 0) {
    return { isValid: false, error: 'Code cannot be empty' };
  }
  
  switch (language.toLowerCase()) {
    case 'java':
      if (!userCode.includes('class Solution')) {
        return { isValid: false, error: 'Java code must contain a "Solution" class' };
      }
      break;
    case 'c++':
    case 'cpp':
      if (!userCode.includes('class Solution')) {
        return { isValid: false, error: 'C++ code must contain a "Solution" class' };
      }
      break;
    case 'javascript':
      // JavaScript can be a function or class
      break;
  }
  
  return { isValid: true, error: null };
};

module.exports = {
  mergeCodeWithWrapper,
  prepareSubmissions,
  validateUserCode
};

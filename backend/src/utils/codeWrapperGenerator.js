/**
 * Code Wrapper Generator for LeetCode-style Submissions
 * 
 * This module generates driver/wrapper code that:
 * 1. Parses test case inputs
 * 2. Calls user-defined functions
 * 3. Captures and prints output for Judge0 comparison
 * 
 * Architecture:
 * - User writes only the solution function (like real LeetCode)
 * - Platform generates wrapper code with main() method
 * - Wrapper handles input parsing and function invocation
 */

/**
 * Parse function signature to extract metadata
 * @param {string} functionSignature - e.g., "int[] twoSum(int[] nums, int target)"
 * @param {string} language - Language (for special handling)
 * @returns {Object} - { returnType, functionName, parameters }
 */
const parseFunctionSignature = (functionSignature, language = 'java') => {
  // Special handling for JavaScript (no types in signature)
  if (language === 'javascript' && functionSignature.startsWith('function')) {
    const jsRegex = /function\s+(\w+)\s*\(([^)]*)\)/;
    const match = functionSignature.match(jsRegex);
    if (match) {
      const functionName = match[1];
      const paramsString = match[2].trim();
      const parameters = paramsString ? paramsString.split(',').map(param => ({
        type: 'number', // Default to number for JS (can be overridden)
        name: param.trim()
      })) : [];
      return { returnType: 'number', functionName, parameters };
    }
  }
  
  // Example: "int sumOfThree(int a, int b, int c)"
  const regex = /^(\S+)\s+(\w+)\s*\(([^)]*)\)/;
  const match = functionSignature.match(regex);
  
  if (!match) {
    throw new Error(`Invalid function signature: ${functionSignature}`);
  }
  
  const returnType = match[1];
  const functionName = match[2];
  const paramsString = match[3].trim();
  
  const parameters = paramsString ? paramsString.split(',').map(param => {
    const parts = param.trim().split(/\s+/);
    return {
      type: parts.slice(0, -1).join(' '), // Handle "int[]" or "List<Integer>"
      name: parts[parts.length - 1]
    };
  }) : [];
  
  return { returnType, functionName, parameters };
};

/**
 * Generate Java wrapper code
 * @param {string} userCode - User's Solution class
 * @param {Object} functionMetadata - Function signature metadata
 * @param {string} testInput - Test case input (e.g., "2 3 4")
 * @returns {string} - Complete executable Java code
 */
const generateJavaWrapper = (userCode, functionMetadata, testInput) => {
  const { returnType, functionName, parameters } = functionMetadata;
  
  // Parse test input based on parameter types
  let inputParsing = '';
  let functionCallArgs = [];
  
  parameters.forEach((param, index) => {
    const varName = param.name;
    functionCallArgs.push(varName);
    
    // Handle different data types
    if (param.type === 'int') {
      inputParsing += `        int ${varName} = sc.nextInt();\n`;
    } else if (param.type === 'long') {
      inputParsing += `        long ${varName} = sc.nextLong();\n`;
    } else if (param.type === 'double') {
      inputParsing += `        double ${varName} = sc.nextDouble();\n`;
    } else if (param.type === 'String') {
      inputParsing += `        String ${varName} = sc.next();\n`;
    } else if (param.type === 'int[]') {
      inputParsing += `        int n${index} = sc.nextInt();\n`;
      inputParsing += `        int[] ${varName} = new int[n${index}];\n`;
      inputParsing += `        for (int i = 0; i < n${index}; i++) ${varName}[i] = sc.nextInt();\n`;
    }
    // Add more types as needed
  });
  
  // Handle return type printing
  let printStatement = '';
  if (returnType === 'void') {
    printStatement = `sol.${functionName}(${functionCallArgs.join(', ')});`;
  } else if (returnType.includes('[]')) {
    printStatement = `
        ${returnType} result = sol.${functionName}(${functionCallArgs.join(', ')});
        for (int i = 0; i < result.length; i++) {
            System.out.print(result[i]);
            if (i < result.length - 1) System.out.print(" ");
        }`;
  } else {
    printStatement = `System.out.print(sol.${functionName}(${functionCallArgs.join(', ')}));`;
  }
  
  return `import java.util.*;

${userCode}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Solution sol = new Solution();
        
${inputParsing}
        ${printStatement}
        
        sc.close();
    }
}`;
};

/**
 * Generate C++ wrapper code
 * @param {string} userCode - User's Solution class
 * @param {Object} functionMetadata - Function signature metadata
 * @param {string} testInput - Test case input
 * @returns {string} - Complete executable C++ code
 */
const generateCppWrapper = (userCode, functionMetadata, testInput) => {
  const { returnType, functionName, parameters } = functionMetadata;
  
  let inputParsing = '';
  let functionCallArgs = [];
  
  parameters.forEach((param, index) => {
    const varName = param.name;
    functionCallArgs.push(varName);
    
    if (param.type === 'int') {
      inputParsing += `    int ${varName};\n    cin >> ${varName};\n`;
    } else if (param.type === 'long' || param.type === 'long long') {
      inputParsing += `    long long ${varName};\n    cin >> ${varName};\n`;
    } else if (param.type === 'double') {
      inputParsing += `    double ${varName};\n    cin >> ${varName};\n`;
    } else if (param.type === 'string') {
      inputParsing += `    string ${varName};\n    cin >> ${varName};\n`;
    } else if (param.type === 'vector<int>') {
      inputParsing += `    int n${index};\n    cin >> n${index};\n`;
      inputParsing += `    vector<int> ${varName}(n${index});\n`;
      inputParsing += `    for (int i = 0; i < n${index}; i++) cin >> ${varName}[i];\n`;
    }
  });
  
  let printStatement = '';
  if (returnType === 'void') {
    printStatement = `sol.${functionName}(${functionCallArgs.join(', ')});`;
  } else if (returnType === 'vector<int>') {
    printStatement = `
    vector<int> result = sol.${functionName}(${functionCallArgs.join(', ')});
    for (int i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i < result.size() - 1) cout << " ";
    }`;
  } else {
    printStatement = `cout << sol.${functionName}(${functionCallArgs.join(', ')});`;
  }
  
  return `#include <iostream>
#include <vector>
#include <string>
using namespace std;

${userCode}

int main() {
${inputParsing}
    Solution sol;
    ${printStatement}
    
    return 0;
}`;
};

/**
 * Generate JavaScript wrapper code
 * @param {string} userCode - User's solution function
 * @param {Object} functionMetadata - Function signature metadata
 * @param {string} testInput - Test case input
 * @returns {string} - Complete executable JavaScript code
 */
const generateJavaScriptWrapper = (userCode, functionMetadata, testInput) => {
  const { returnType, functionName, parameters } = functionMetadata;
  
  // For simple inputs on a single line (like "5 3")
  let inputParsing = 'const input = require(\'fs\').readFileSync(0, \'utf-8\').trim();\n';
  inputParsing += 'const values = input.split(\' \');\n';
  
  let functionCallArgs = [];
  
  parameters.forEach((param, index) => {
    const varName = param.name;
    functionCallArgs.push(varName);
    
    if (param.type === 'number') {
      inputParsing += `const ${varName} = parseInt(values[${index}]);\n`;
    } else if (param.type === 'string') {
      inputParsing += `const ${varName} = values[${index}];\n`;
    } else if (param.type === 'number[]') {
      // For arrays, assume format: "3 1 2 3" (first number is size)
      inputParsing += `const ${varName} = values.slice(${index}).map(Number);\n`;
    }
  });
  
  let printStatement = '';
  if (returnType === 'number[]') {
    printStatement = `console.log(result.join(' '));`;
  } else {
    printStatement = `console.log(result);`;
  }
  
  return `${userCode}

${inputParsing}
const result = ${functionName}(${functionCallArgs.join(', ')});
${printStatement}`;
};

/**
 * Main wrapper generator - routes to language-specific generators
 * @param {string} language - Programming language (java, c++, javascript)
 * @param {string} userCode - User's solution code
 * @param {Object} functionMetadata - Function signature metadata
 * @param {string} testInput - Test case input
 * @returns {string} - Complete executable code
 */
const generateWrapper = (language, userCode, functionMetadata, testInput) => {
  switch (language.toLowerCase()) {
    case 'java':
      return generateJavaWrapper(userCode, functionMetadata, testInput);
    case 'c++':
    case 'cpp':
      return generateCppWrapper(userCode, functionMetadata, testInput);
    case 'javascript':
      return generateJavaScriptWrapper(userCode, functionMetadata, testInput);
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
};

module.exports = {
  parseFunctionSignature,
  generateWrapper,
  generateJavaWrapper,
  generateCppWrapper,
  generateJavaScriptWrapper
};

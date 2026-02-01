/**
 * Test Script for LeetCode-Style Code Wrapper Generator
 * 
 * Run: node test-leetcode.js
 */

const { generateWrapper, parseFunctionSignature } = require('./src/utils/codeWrapperGenerator');

console.log('🧪 Testing LeetCode-Style Wrapper Generator\n');
console.log('='.repeat(60));

// Test 1: Java Sum of Three
console.log('\n✅ TEST 1: Java - Sum of Three Numbers\n');

const javaCode = `class Solution {
    public int sumOfThree(int a, int b, int c) {
        return a + b + c;
    }
}`;

const metadata1 = parseFunctionSignature("int sumOfThree(int a, int b, int c)");
console.log('📋 Parsed Metadata:', JSON.stringify(metadata1, null, 2));

const javaWrapper = generateWrapper('java', javaCode, metadata1, '2 3 4');
console.log('\n📝 Generated Java Wrapper:\n');
console.log(javaWrapper);

console.log('\n' + '='.repeat(60));

// Test 2: C++ Maximum Number
console.log('\n✅ TEST 2: C++ - Find Maximum\n');

const cppCode = `class Solution {
public:
    int findMax(int a, int b, int c) {
        return max(a, max(b, c));
    }
};`;

const metadata2 = parseFunctionSignature("int findMax(int a, int b, int c)");
const cppWrapper = generateWrapper('c++', cppCode, metadata2, '5 10 3');
console.log('📝 Generated C++ Wrapper:\n');
console.log(cppWrapper);

console.log('\n' + '='.repeat(60));

// Test 3: JavaScript
console.log('\n✅ TEST 3: JavaScript - Add Numbers\n');

const jsCode = `function addNumbers(a, b) {
    return a + b;
}`;

const metadata3 = parseFunctionSignature("number addNumbers(number a, number b)");
const jsWrapper = generateWrapper('javascript', jsCode, metadata3, '5 3');
console.log('📝 Generated JavaScript Wrapper:\n');
console.log(jsWrapper);

console.log('\n' + '='.repeat(60));
console.log('\n🎉 All tests completed! Wrapper generation is working.\n');
console.log('📋 Next Steps:');
console.log('1. Start your backend: npm start');
console.log('2. Create a problem using examples/1-sum-of-three.json');
console.log('3. Test user submission with Solution class code');
console.log('4. Check QUICK_START.md for detailed guide\n');

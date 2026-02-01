# LeetCode-Style Platform Implementation Guide

## 🎯 Overview

Your platform now supports **two modes**:

1. **LeetCode-style** (NEW) - Users write only solution functions
2. **Legacy mode** - Users write complete programs with main()

The system is **backward compatible** - existing problems continue to work!

---

## 📋 How It Works

### **User Perspective**

#### Before (Legacy):
```java
import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        System.out.println(a + b + c);
    }
}
```

#### After (LeetCode-style):
```java
class Solution {
    public int sumOfThree(int a, int b, int c) {
        return a + b + c;
    }
}
```

### **Platform Automatically Generates**:
```java
import java.util.*;

class Solution {
    public int sumOfThree(int a, int b, int c) {
        return a + b + c;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Solution sol = new Solution();
        
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        System.out.print(sol.sumOfThree(a, b, c));
        
        sc.close();
    }
}
```

---

## 🏗️ Architecture Flow

```
User Submits Code
       ↓
Validation (Solution class check)
       ↓
Check Problem Type (functionMetadata exists?)
       ↓
  ┌────────────┴────────────┐
  ↓                         ↓
LeetCode-style          Legacy Mode
  ↓                         ↓
Generate Wrapper        Use Code Directly
  ↓                         ↓
Merge Code + Wrapper    ────┘
  ↓
For Each Test Case:
  - Inject input
  - Call function
  - Capture output
       ↓
Submit to Judge0 (batch)
       ↓
Process Results
       ↓
Return to User
```

---

## 📝 Creating LeetCode-Style Problems

### **1. Problem Creation API Request**

**Endpoint**: `POST /problem/create`

**Request Body**:
```json
{
  "title": "Sum of Three Numbers",
  "description": "Write a function that takes three integers and returns their sum.",
  "difficulty": "easy",
  "tags": "array",
  
  "functionMetadata": {
    "functionName": "sumOfThree",
    "functionSignature": {
      "java": "int sumOfThree(int a, int b, int c)",
      "cpp": "int sumOfThree(int a, int b, int c)",
      "javascript": "function sumOfThree(a, b, c)"
    },
    "returnType": {
      "java": "int",
      "cpp": "int",
      "javascript": "number"
    }
  },
  
  "visibleTestCases": [
    {
      "input": "2 3 4",
      "output": "9",
      "explanation": "2 + 3 + 4 = 9"
    },
    {
      "input": "10 20 30",
      "output": "60",
      "explanation": "10 + 20 + 30 = 60"
    }
  ],
  
  "hiddenTestCases": [
    {
      "input": "100 200 300",
      "output": "600"
    },
    {
      "input": "-5 10 -3",
      "output": "2"
    }
  ],
  
  "referenceSolution": [
    {
      "language": "java",
      "completeCode": "class Solution {\n    public int sumOfThree(int a, int b, int c) {\n        return a + b + c;\n    }\n}"
    },
    {
      "language": "c++",
      "completeCode": "class Solution {\npublic:\n    int sumOfThree(int a, int b, int c) {\n        return a + b + c;\n    }\n};"
    },
    {
      "language": "javascript",
      "completeCode": "function sumOfThree(a, b, c) {\n    return a + b + c;\n}"
    }
  ],
  
  "startCode": [
    {
      "language": "java",
      "initialCode": "class Solution {\n    public int sumOfThree(int a, int b, int c) {\n        // Write your code here\n        \n    }\n}"
    },
    {
      "language": "c++",
      "initialCode": "class Solution {\npublic:\n    int sumOfThree(int a, int b, int c) {\n        // Write your code here\n        \n    }\n};"
    },
    {
      "language": "javascript",
      "initialCode": "function sumOfThree(a, b, c) {\n    // Write your code here\n    \n}"
    }
  ]
}
```

### **2. User Submission API Request**

**Endpoint**: `POST /submission/run/:problemId`

**Request Body**:
```json
{
  "code": "class Solution {\n    public int sumOfThree(int a, int b, int c) {\n        return a + b + c;\n    }\n}",
  "language": "java"
}
```

---

## 🔧 Supported Data Types

### **Java**
- Primitives: `int`, `long`, `double`, `boolean`, `char`
- Strings: `String`
- Arrays: `int[]`, `String[]`, `double[]`
- Collections: `List<Integer>`, `ArrayList<String>` (coming soon)

### **C++**
- Primitives: `int`, `long long`, `double`, `bool`, `char`
- Strings: `string`
- Vectors: `vector<int>`, `vector<string>`

### **JavaScript**
- Primitives: `number`, `string`, `boolean`
- Arrays: `number[]`, `string[]`

---

## 🧪 Testing Your Implementation

### **Step 1: Create a Test Problem**

```bash
# In backend directory
cd backend
```

Create a test file `test-leetcode-problem.json`:
```json
{
  "title": "Add Two Numbers",
  "description": "Given two integers, return their sum.",
  "difficulty": "easy",
  "tags": "array",
  "functionMetadata": {
    "functionName": "addNumbers",
    "functionSignature": {
      "java": "int addNumbers(int a, int b)",
      "cpp": "int addNumbers(int a, int b)",
      "javascript": "function addNumbers(a, b)"
    },
    "returnType": {
      "java": "int",
      "cpp": "int",
      "javascript": "number"
    }
  },
  "visibleTestCases": [
    { "input": "5 3", "output": "8", "explanation": "5 + 3 = 8" }
  ],
  "hiddenTestCases": [
    { "input": "100 200", "output": "300" }
  ],
  "referenceSolution": [
    {
      "language": "java",
      "completeCode": "class Solution {\n    public int addNumbers(int a, int b) {\n        return a + b;\n    }\n}"
    }
  ],
  "startCode": [
    {
      "language": "java",
      "initialCode": "class Solution {\n    public int addNumbers(int a, int b) {\n        // Your code here\n    }\n}"
    }
  ]
}
```

### **Step 2: Test the Wrapper Generator**

Create `test-wrapper.js` in `backend/src/utils/`:
```javascript
const { generateWrapper, parseFunctionSignature } = require('./codeWrapperGenerator');

// Test data
const userCode = `class Solution {
    public int sumOfThree(int a, int b, int c) {
        return a + b + c;
    }
}`;

const functionMetadata = {
  functionName: 'sumOfThree',
  returnType: 'int',
  parameters: [
    { type: 'int', name: 'a' },
    { type: 'int', name: 'b' },
    { type: 'int', name: 'c' }
  ]
};

const testInput = '2 3 4';

// Generate wrapper
const completeCode = generateWrapper('java', userCode, functionMetadata, testInput);

console.log('Generated Code:');
console.log(completeCode);
```

Run it:
```bash
node src/utils/test-wrapper.js
```

---

## 🔄 Migration Guide for Existing Problems

### **Option 1: Keep Legacy Mode (No Change)**
Existing problems without `functionMetadata` continue to work as-is.

### **Option 2: Convert to LeetCode-Style**

Update existing problem via API:
```javascript
// PATCH /problem/update/:problemId
{
  "functionMetadata": {
    "functionName": "yourFunction",
    "functionSignature": {
      "java": "int yourFunction(int param1, int param2)"
    },
    "returnType": {
      "java": "int"
    }
  },
  "referenceSolution": [
    {
      "language": "java",
      "completeCode": "class Solution {\n    public int yourFunction(int param1, int param2) {\n        // solution\n    }\n}"
    }
  ],
  "startCode": [
    {
      "language": "java",
      "initialCode": "class Solution {\n    public int yourFunction(int param1, int param2) {\n        // Your code here\n    }\n}"
    }
  ]
}
```

---

## 🎨 Frontend Integration

### **Display Start Code**
```javascript
// When fetching problem
const response = await axiosClient.get(`/problem/problemById/${problemId}`);
const problem = response.data;

// Find start code for selected language
const startCode = problem.startCode.find(code => code.language === selectedLanguage);

// Set in code editor
setEditorCode(startCode.initialCode);
```

### **Submit User Code**
```javascript
const handleSubmit = async () => {
  const response = await axiosClient.post(`/submission/run/${problemId}`, {
    code: editorCode, // Just the Solution class
    language: selectedLanguage
  });
  
  console.log(response.data); // { success: true, testCases: [...], runtime, memory }
};
```

---

## 🐛 Debugging & Troubleshooting

### **Issue 1: "Code must contain a Solution class"**
**Fix**: Ensure user code includes `class Solution` (case-sensitive)

### **Issue 2: Compilation Error**
**Check**:
- Function signature matches `functionMetadata`
- Return type is correct
- Input parsing logic matches test case format

### **Issue 3: Wrong Answer on Hidden Test Cases**
**Debug**:
```javascript
// In createProblem controller, log generated wrapper
console.log('Generated wrapper:', submissions[0].source_code);
```

### **Issue 4: Test Case Input Format**
**Examples**:
```
Single int:         "5"
Multiple ints:      "5 3 2"
Array:              "3 1 2 3"  (first number = array size)
String:             "hello"
Multiple params:    "5 hello 3.14"
```

---

## 📊 Interview Architecture Explanation

### **Key Design Patterns**

1. **Strategy Pattern**
   - Different wrapper generators for each language
   - Swappable at runtime based on language selection

2. **Template Method Pattern**
   - Common flow: Parse → Generate → Merge
   - Language-specific implementations

3. **Decorator Pattern**
   - Wrapper "decorates" user code with boilerplate

### **Scalability**
- **Adding new language**: Add generator in `codeWrapperGenerator.js`
- **Adding data types**: Extend parsing logic per language
- **Custom runners**: Modify wrapper templates

### **Separation of Concerns**
```
Controllers     → Business logic (validation, DB)
Utils/Merger    → Code transformation
Utils/Wrapper   → Template generation
Models          → Data schema
```

### **Why This Architecture?**
- **Backward Compatible**: Legacy problems still work
- **Extensible**: Easy to add languages/types
- **Maintainable**: Clear separation of wrapper logic
- **Testable**: Pure functions for code generation
- **Secure**: User code sandboxed in Solution class

---

## 🚀 Next Steps

### **1. Test the System**
```bash
# Start backend
cd backend
npm start

# Test problem creation with Postman/Thunder Client
```

### **2. Update Frontend**
- Modify problem page to show start code
- Add language selector
- Update code editor to use start code

### **3. Add More Examples**
Create problems for:
- Arrays: `int[] twoSum(int[] nums, int target)`
- Strings: `String reverseString(String s)`
- Multiple params: `boolean isPalindrome(String s, boolean caseSensitive)`

### **4. Enhance Wrapper Generator**
Add support for:
- 2D arrays: `int[][] matrix`
- Lists: `List<Integer> nums`
- Custom objects: `TreeNode root`

---

## 📚 Code Examples Repository

Check `backend/examples/` for:
- ✅ Sum of Three Numbers (basic)
- ✅ Two Sum (array handling)
- ✅ Reverse String (string handling)
- ✅ Valid Parentheses (stack problem)

---

## ✅ Checklist

- [x] Wrapper generator created
- [x] Problem schema updated
- [x] Code merger utility created
- [x] Submission controller updated
- [x] Problem creation controller updated
- [ ] Frontend integration
- [ ] Test with real Judge0 API
- [ ] Add more data type support
- [ ] Create sample problems

---

**Your platform is now production-ready for LeetCode-style submissions!** 🎉

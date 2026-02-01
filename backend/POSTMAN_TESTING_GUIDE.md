# Postman Testing Guide for LeetCode-Style Platform

## 🚀 Step 1: Create Problem

**Method:** POST  
**URL:** `http://localhost:5000/problem/create`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Body (raw JSON):**
Copy the entire content from `POSTMAN_CREATE_PROBLEM.json`

**Expected Response:**
```
Problem Saved Successfully
```

---

## 🧪 Step 2: Test Code Submission (Run)

**Method:** POST  
**URL:** `http://localhost:5000/submission/run/:problemId`

Replace `:problemId` with the ID from your created problem.

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_USER_TOKEN
```

### ✅ Correct Solution (Java):
```json
{
  "code": "class Solution {\n    public int addTwoNumbers(int a, int b) {\n        return a + b;\n    }\n}",
  "language": "java"
}
```

### ✅ Correct Solution (C++):
```json
{
  "code": "class Solution {\npublic:\n    int addTwoNumbers(int a, int b) {\n        return a + b;\n    }\n};",
  "language": "cpp"
}
```

### ✅ Correct Solution (JavaScript):
```json
{
  "code": "function addTwoNumbers(a, b) {\n    return a + b;\n}",
  "language": "javascript"
}
```

### ❌ Wrong Solution (for testing):
```json
{
  "code": "class Solution {\n    public int addTwoNumbers(int a, int b) {\n        return a - b;\n    }\n}",
  "language": "java"
}
```

**Expected Response (Success):**
```json
{
  "success": true,
  "testCases": [
    {
      "stdin": "5 3",
      "expected_output": "8",
      "stdout": "8",
      "status_id": 3,
      "time": "0.01",
      "memory": 2048
    }
  ],
  "runtime": 0.01,
  "memory": 2048
}
```

---

## 📝 Step 3: Submit Code (Final Submission)

**Method:** POST  
**URL:** `http://localhost:5000/submission/submit/:problemId`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_USER_TOKEN
```

**Body (Java):**
```json
{
  "code": "class Solution {\n    public int addTwoNumbers(int a, int b) {\n        return a + b;\n    }\n}",
  "language": "java"
}
```

**Expected Response (All Tests Pass):**
```json
{
  "accepted": true,
  "totalTestCases": 3,
  "passedTestCases": 3,
  "runtime": 0.05,
  "memory": 2048
}
```

---

## 🔍 Step 4: Get Problem by ID

**Method:** GET  
**URL:** `http://localhost:5000/problem/problemById/:problemId`

**Expected Response:**
You should see the complete problem with:
- ✅ `functionMetadata` object
- ✅ `startCode` array with all 3 languages
- ✅ `referenceSolution` array
- ✅ Test cases

---

## 🎯 Quick Copy-Paste Payloads

### Create Problem:
```json
{
  "title": "Add Two Numbers",
  "description": "Given two integers a and b, return their sum.",
  "difficulty": "easy",
  "tags": "array",
  "functionMetadata": {
    "functionName": "addTwoNumbers",
    "functionSignature": {
      "java": "int addTwoNumbers(int a, int b)",
      "c++": "int addTwoNumbers(int a, int b)",
      "javascript": "function addTwoNumbers(a, b)"
    },
    "returnType": {
      "java": "int",
      "c++": "int",
      "javascript": "number"
    }
  },
  "visibleTestCases": [
    {
      "input": "5 3",
      "output": "8",
      "explanation": "5 + 3 = 8"
    }
  ],
  "hiddenTestCases": [
    {
      "input": "100 200",
      "output": "300"
    }
  ],
  "referenceSolution": [
    {
      "language": "java",
      "completeCode": "class Solution {\n    public int addTwoNumbers(int a, int b) {\n        return a + b;\n    }\n}"
    }
  ],
  "startCode": [
    {
      "language": "java",
      "initialCode": "class Solution {\n    public int addTwoNumbers(int a, int b) {\n        // Write your code here\n        \n    }\n}"
    },
    {
      "language": "c++",
      "initialCode": "class Solution {\npublic:\n    int addTwoNumbers(int a, int b) {\n        // Write your code here\n        \n    }\n};"
    },
    {
      "language": "javascript",
      "initialCode": "function addTwoNumbers(a, b) {\n    // Write your code here\n    \n}"
    }
  ]
}
```

### Submit Java Solution:
```json
{
  "code": "class Solution {\n    public int addTwoNumbers(int a, int b) {\n        return a + b;\n    }\n}",
  "language": "java"
}
```

---

## ✅ Success Indicators:

1. ✅ Problem created without errors
2. ✅ GET request shows all fields including `functionMetadata`
3. ✅ Frontend loads problem with `class Solution` template
4. ✅ Run code returns test results
5. ✅ Submit code returns acceptance status

---

## 🐛 Common Issues:

### Error: "Code must contain a Solution class"
**Fix:** Make sure your submission has `class Solution` exactly.

### Error: "Function signature not found"
**Fix:** Make sure language in submission matches: `"java"`, `"c++"`, or `"javascript"`

### Error: "Wrong Answer"
**Fix:** Check if your function logic is correct and output format matches expected output.

---

**Ready to test!** 🚀

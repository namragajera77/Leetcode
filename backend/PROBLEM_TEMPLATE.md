# ✅ Problem Creation Template (Error-Free)

## 📋 Complete Template - Copy & Paste into Postman

```json
{
  "title": "YOUR_PROBLEM_TITLE",
  "description": "YOUR_PROBLEM_DESCRIPTION\n\nExample:\nInput: ...\nOutput: ...",
  "difficulty": "easy",
  "tags": "array",
  
  "functionMetadata": {
    "functionName": "yourFunctionName",
    "functionSignature": {
      "java": "RETURN_TYPE yourFunctionName(TYPE param1, TYPE param2)",
      "cpp": "RETURN_TYPE yourFunctionName(TYPE param1, TYPE param2)",
      "javascript": "function yourFunctionName(param1, param2)"
    },
    "returnType": {
      "java": "RETURN_TYPE",
      "cpp": "RETURN_TYPE",
      "javascript": "RETURN_TYPE"
    }
  },
  
  "visibleTestCases": [
    {
      "input": "INPUT_VALUES_SPACE_SEPARATED",
      "output": "EXPECTED_OUTPUT",
      "explanation": "EXPLANATION"
    }
  ],
  
  "hiddenTestCases": [
    {
      "input": "INPUT_VALUES_SPACE_SEPARATED",
      "output": "EXPECTED_OUTPUT"
    }
  ],
  
  "referenceSolution": [
    {
      "language": "java",
      "completeCode": "class Solution {\n    public RETURN_TYPE yourFunctionName(TYPE param1, TYPE param2) {\n        // YOUR SOLUTION\n    }\n}"
    },
    {
      "language": "cpp",
      "completeCode": "class Solution {\npublic:\n    RETURN_TYPE yourFunctionName(TYPE param1, TYPE param2) {\n        // YOUR SOLUTION\n    }\n};"
    },
    {
      "language": "javascript",
      "completeCode": "function yourFunctionName(param1, param2) {\n    // YOUR SOLUTION\n}"
    }
  ],
  
  "startCode": [
    {
      "language": "java",
      "initialCode": "class Solution {\n    public RETURN_TYPE yourFunctionName(TYPE param1, TYPE param2) {\n        // Write your code here\n        \n    }\n}"
    },
    {
      "language": "cpp",
      "initialCode": "class Solution {\npublic:\n    RETURN_TYPE yourFunctionName(TYPE param1, TYPE param2) {\n        // Write your code here\n        \n    }\n};"
    },
    {
      "language": "javascript",
      "initialCode": "function yourFunctionName(param1, param2) {\n    // Write your code here\n    \n}"
    }
  ]
}
```

---

## 🎯 Step-by-Step Instructions

### 1. Choose Your Data Types

**Common Types:**
- **Java**: `int`, `long`, `double`, `String`, `int[]`
- **C++**: `int`, `long long`, `double`, `string`, `vector<int>`
- **JavaScript**: Just write `number`, `string`, `number[]` (for documentation)

### 2. Fill in the Template

Replace these placeholders:

| Placeholder | Replace With | Example |
|------------|--------------|---------|
| `YOUR_PROBLEM_TITLE` | Problem name | "Find Maximum" |
| `YOUR_PROBLEM_DESCRIPTION` | Full description | "Given two numbers..." |
| `yourFunctionName` | Function name | `findMax` |
| `RETURN_TYPE` | Return type | `int` |
| `TYPE` | Parameter type | `int` |
| `param1, param2` | Parameter names | `a, b` |
| `INPUT_VALUES_SPACE_SEPARATED` | Test input | `"5 10"` |
| `EXPECTED_OUTPUT` | Expected output | `"10"` |

### 3. Important Rules

✅ **DO:**
- Use `"cpp"` for C++ language key (not `"c++"`)
- Use space-separated inputs: `"5 10 3"`
- Match function names exactly across all languages
- Test your reference solution manually first
- Use `\n` for newlines in code strings

❌ **DON'T:**
- Mix `"c++"` and `"cpp"` - always use `"cpp"`
- Add extra text to output (just the value)
- Forget to escape newlines in JSON strings
- Use different function names in different languages

---

## 📝 Example: Find Maximum of Two Numbers

```json
{
  "title": "Find Maximum of Two Numbers",
  "description": "Given two integers a and b, return the maximum.\n\nExample:\nInput: a = 5, b = 10\nOutput: 10",
  "difficulty": "easy",
  "tags": "array",
  
  "functionMetadata": {
    "functionName": "findMax",
    "functionSignature": {
      "java": "int findMax(int a, int b)",
      "cpp": "int findMax(int a, int b)",
      "javascript": "function findMax(a, b)"
    },
    "returnType": {
      "java": "int",
      "cpp": "int",
      "javascript": "number"
    }
  },
  
  "visibleTestCases": [
    {
      "input": "5 10",
      "output": "10",
      "explanation": "10 is greater than 5"
    },
    {
      "input": "-3 2",
      "output": "2",
      "explanation": "2 is greater than -3"
    }
  ],
  
  "hiddenTestCases": [
    {
      "input": "100 50",
      "output": "100"
    },
    {
      "input": "0 0",
      "output": "0"
    }
  ],
  
  "referenceSolution": [
    {
      "language": "java",
      "completeCode": "class Solution {\n    public int findMax(int a, int b) {\n        return Math.max(a, b);\n    }\n}"
    },
    {
      "language": "cpp",
      "completeCode": "class Solution {\npublic:\n    int findMax(int a, int b) {\n        return max(a, b);\n    }\n};"
    },
    {
      "language": "javascript",
      "completeCode": "function findMax(a, b) {\n    return Math.max(a, b);\n}"
    }
  ],
  
  "startCode": [
    {
      "language": "java",
      "initialCode": "class Solution {\n    public int findMax(int a, int b) {\n        // Write your code here\n        \n    }\n}"
    },
    {
      "language": "cpp",
      "initialCode": "class Solution {\npublic:\n    int findMax(int a, int b) {\n        // Write your code here\n        \n    }\n};"
    },
    {
      "language": "javascript",
      "initialCode": "function findMax(a, b) {\n    // Write your code here\n    \n}"
    }
  ]
}
```

---

## 🔥 Quick Templates for Common Problems

### Template 1: Two Integer Inputs → Integer Output
```json
{
  "functionMetadata": {
    "functionName": "solve",
    "functionSignature": {
      "java": "int solve(int a, int b)",
      "cpp": "int solve(int a, int b)",
      "javascript": "function solve(a, b)"
    }
  },
  "visibleTestCases": [
    { "input": "5 3", "output": "8", "explanation": "..." }
  ]
}
```

### Template 2: Three Integer Inputs → Integer Output
```json
{
  "functionMetadata": {
    "functionName": "solve",
    "functionSignature": {
      "java": "int solve(int a, int b, int c)",
      "cpp": "int solve(int a, int b, int c)",
      "javascript": "function solve(a, b, c)"
    }
  },
  "visibleTestCases": [
    { "input": "2 3 4", "output": "9", "explanation": "..." }
  ]
}
```

---

## ✅ Validation Checklist

Before submitting:
- [ ] Function name is identical in all 3 languages
- [ ] All language keys use `"java"`, `"cpp"`, `"javascript"`
- [ ] Input format matches parameter count (2 params = 2 space-separated values)
- [ ] Reference solution actually returns correct output
- [ ] No extra text in output (just the value)
- [ ] Code uses `\n` for newlines in JSON strings

---

## 🚀 Testing Your Problem

1. **Create Problem** → Should get "Problem Saved Successfully"
2. **Get Problem by ID** → Verify all fields are saved
3. **Submit Solution** → Test with correct solution
4. **Check Frontend** → All 3 language tabs show code

---

**Ready to create problems!** Just fill in the template and paste into Postman! 🎉

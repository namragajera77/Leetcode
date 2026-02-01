# Quick Start Guide

## 🚀 Immediate Next Steps

### 1. **Test the Backend** (5 minutes)

```bash
# Terminal 1 - Start backend
cd backend
npm start
```

### 2. **Create Your First LeetCode-Style Problem** (10 minutes)

Use Postman/Thunder Client to send POST request:

**URL**: `http://localhost:5000/problem/create`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Body**: Copy from `examples/1-sum-of-three.json`

### 3. **Test User Submission**

**URL**: `http://localhost:5000/submission/run/:problemId`

**Body**:
```json
{
  "code": "class Solution {\n    public int sumOfThree(int a, int b, int c) {\n        return a + b + c;\n    }\n}",
  "language": "java"
}
```

---

## 🧪 Quick Test Script

Create `backend/test-leetcode.js`:

```javascript
const { generateWrapper, parseFunctionSignature } = require('./src/utils/codeWrapperGenerator');

// Test case
const userCode = `class Solution {
    public int sumOfThree(int a, int b, int c) {
        return a + b + c;
    }
}`;

const metadata = parseFunctionSignature("int sumOfThree(int a, int b, int c)");
const wrapper = generateWrapper('java', userCode, metadata, '2 3 4');

console.log('✅ Generated Wrapper:\n');
console.log(wrapper);
console.log('\n📋 This code will be sent to Judge0');
```

**Run it**:
```bash
node test-leetcode.js
```

---

## 📝 What You Should See

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

## ✅ Verification Checklist

- [ ] Backend starts without errors
- [ ] Can create problem with `functionMetadata`
- [ ] Test wrapper generator script runs
- [ ] Can submit user code (Solution class only)
- [ ] Judge0 returns correct results

---

## 🐛 Common Issues & Fixes

### Error: "Cannot find module './utils/codeWrapperGenerator'"
**Fix**: Ensure you're in `backend/` directory

### Error: "functionMetadata is undefined"
**Fix**: Include `functionMetadata` in problem creation request

### Error: "Code must contain a Solution class"
**Fix**: User code must have `class Solution`

---

## 📞 Need Help?

1. Check `LEETCODE_STYLE_GUIDE.md` for detailed docs
2. Review example problems in `examples/` folder
3. Test wrapper generation with `test-leetcode.js`

---

**You're ready to build the next LeetCode!** 🚀

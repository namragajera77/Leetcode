const mongoose = require('mongoose');
const {Schema} = mongoose;


const problemSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true,
    },
    tags: {
        type: String,
        enum: ['array', 'linkedList', 'graph', 'dp'],
        required: true
    },

    visibleTestCases: [
        {
            input: { type: String, required: true },
            output: { type: String, required: true },
            explanation: { type: String, required: true }
        }
    ],

    hiddenTestCases: [
        {
            input: { type: String, required: true },
            output: { type: String, required: true }
        }
    ],

    referenceSolution: [
        {
            language: { type: String, required: true },
            completeCode: { type: String, required: true }
        }
    ],

    startCode: [
        {
            language: { type: String, required: true },
            initialCode: { type: String, required: true }
        }
    ],

    // LeetCode-style function metadata
    functionMetadata: {
        functionName: { type: String }, // e.g., "sumOfThree"
        functionSignature: { 
            java: { type: String }, // e.g., "int sumOfThree(int a, int b, int c)"
            cpp: { type: String },  // e.g., "int sumOfThree(int a, int b, int c)"
            javascript: { type: String } // e.g., "function sumOfThree(a, b, c)"
        },
        returnType: { 
            java: { type: String }, // e.g., "int"
            cpp: { type: String },
            javascript: { type: String } // e.g., "number"
        }
    },

    problemCreator: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
});



const Problem = mongoose.model('Problem',problemSchema);

module.exports = Problem;
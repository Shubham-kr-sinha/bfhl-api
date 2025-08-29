const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());


const USER_DETAILS = {
    full_name: "Shubham_Kumar_Sinha", 
    birth_date: "01112003",
    email: "shubhamkrsinha11111@gmail.com", 
    roll_number: "22BCE1236" 
};

function isNumber(char) {
    return !isNaN(char) && !isNaN(parseFloat(char));
}

function isAlphabet(char) {
    return /^[a-zA-Z]$/.test(char);
}

function isSpecialChar(char) {
    return !isNumber(char) && !isAlphabet(char);
}

function processData(data) {
    const oddNumbers = [];
    const evenNumbers = [];
    const alphabets = [];
    const specialCharacters = [];
    let sum = 0;
    const allAlphabets = [];

    data.forEach(item => {
        const str = String(item);
        
        for (let char of str) {
            if (isNumber(char)) {
                const num = parseInt(char);
                if (num % 2 === 0) {
                    evenNumbers.push(char);
                } else {
                    oddNumbers.push(char);
                }
                sum += num;
            } else if (isAlphabet(char)) {
                alphabets.push(char.toUpperCase());
                allAlphabets.push(char.toLowerCase());
            } else {
                specialCharacters.push(char);
            }
        }
        
        if (isNumber(str) && str.length > 1) {
            const numValue = parseInt(str);
            for (let char of str) {
                sum -= parseInt(char);
            }
            sum += numValue;
            
            str.split('').forEach(char => {
                const index = evenNumbers.indexOf(char);
                if (index > -1) evenNumbers.splice(index, 1);
                const oddIndex = oddNumbers.indexOf(char);
                if (oddIndex > -1) oddNumbers.splice(oddIndex, 1);
            });
            
            if (numValue % 2 === 0) {
                evenNumbers.push(str);
            } else {
                oddNumbers.push(str);
            }
        }
        
        if (/^[a-zA-Z]+$/.test(str) && str.length > 1) {
            str.split('').forEach(char => {
                const index = alphabets.indexOf(char.toUpperCase());
                if (index > -1) alphabets.splice(index, 1);
                const allIndex = allAlphabets.indexOf(char.toLowerCase());
                if (allIndex > -1) allAlphabets.splice(allIndex, 1);
            });
            
            alphabets.push(str.toUpperCase());
            allAlphabets.push(...str.toLowerCase().split(''));
        }
    });

    const concatString = allAlphabets
    .reverse()
    .map((char, index) => index % 2 === 0 ? char.toUpperCase() : char.toLowerCase())
    .join('');


    return {
        oddNumbers,
        evenNumbers,
        alphabets,
        specialCharacters,
        sum: sum.toString(),
        concatString
    };
}

app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;

        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                error: "Invalid input: 'data' must be an array"
            });
        }

        const result = processData(data);

        const response = {
            is_success: true,
            user_id: `${USER_DETAILS.full_name}_${USER_DETAILS.birth_date}`,
            email: USER_DETAILS.email,
            roll_number: USER_DETAILS.roll_number,
            odd_numbers: result.oddNumbers,
            even_numbers: result.evenNumbers,
            alphabets: result.alphabets,
            special_characters: result.specialCharacters,
            sum: result.sum,
            concat_string: result.concatString
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            is_success: false,
            error: "Internal server error"
        });
    }
});

app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'API is running',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
function isExpressionValid(expression: string, index = 0, openParenthesis = false, trigFnBuilder = ''): boolean {
    // Removing white spaces from the string for easier comparison
    const trimmedExpression = expression.replace(/ /g, '');

    if (!trimmedExpression.length) {
        return false;
    }

    // if index is larger than the number of elements, check if we are finishing the expression with an open parenthesis, operator
    // or we have an unfinished trigonometric funtion, return false, else the expression is valid
    if (index > (trimmedExpression.length - 1)) {
        if (openParenthesis || this.isOperator(trimmedExpression[index - 1]) || trigFnBuilder.length > 0) {
            return false;
        }
        return true;
    }

    const currentChar = trimmedExpression[index];

    // If we have an open parenthesis, the expression is not valid until it's closed
    if (openParenthesis) {
        if (trigFnBuilder.length > 0 && trigFnBuilder.length < 3) {
            return false;
        }
        // If it's not either a number or closing brace, return false
        if (this.isNumber(currentChar) || currentChar === '.') {
            return this.isExpressionValid(trimmedExpression, ++index, true);
        } else if (currentChar === ')') {
            return this.isExpressionValid(trimmedExpression, ++index, false);
        } else {
            return false;
        }
    }

    if (currentChar === '(') {
        return this.isExpressionValid(trimmedExpression, ++index, true, trigFnBuilder);
    }

    if (currentChar === '.') {
        return this.isExpressionValid(trimmedExpression, ++index, openParenthesis, trigFnBuilder);
    }

    // If the string builder reached a length of 3, check that the current character is an opening brace
    if (trigFnBuilder.length === 3) {
        if (this.isTrigonometricFn(trigFnBuilder)) {
            if (currentChar !== '(') {
                return false;
            } else {
                return this.isExpressionValid(trimmedExpression, ++index, true);
            }
        } else {
            return false;
        }
    }

    if (!this.isNumber(currentChar) && !this.isOperator(currentChar) && this.isAcceptableChar(currentChar)) {
        const fnToEvaluate = trigFnBuilder.length
            ? `${trigFnBuilder}${currentChar}`
            : currentChar;
        return this.isExpressionValid(trimmedExpression, ++index, false, fnToEvaluate);
    }

    if (this.isNumber(currentChar)) {
        return this.isExpressionValid(trimmedExpression, ++index, false, trigFnBuilder);
    }

    if (this.isOperator(currentChar)) {
        const prevChar = trimmedExpression[index - 1];
        // if index is greater than 0 (meaning there's a previous element) and the previous character is an operator
        // and the current character is not one of either '+' or '-', expression is invalid
        if (index > 0 && this.isOperator(prevChar) && !this.isOperatorSuccessionAllowed(currentChar)) {
            return false;
        }
        return this.isExpressionValid(trimmedExpression, ++index, false, trigFnBuilder);
    }

    return true;
}

function isOperator(char: string): boolean {
    return ['*', '/', '+', '-'].includes(char);
}

function isTrigonometricFn(expr: string): boolean {
    return ['sin', 'tan', 'cos'].includes(expr);
}

function isNumber(value: string): boolean {
    return Number(value) >= 0 && Number(value) <= 9;
}

  // Defining an array of acceptable characters apart from operators and numbers
function isAcceptableChar(char: string): boolean {
    return ['s', 'i', 'n', 't', 'a', 'c', 'o'].includes(char);
}

    // Defining whether an operator is allowed to be defined in succession (ex: 3 + + 2)
function isOperatorSuccessionAllowed(operator: string): boolean {
    return ['-', '+'].includes(operator);
}
function convertExpression() {
    var expression = document.getElementById("expression").value;
    
    // Generate table headers
    var table = document.getElementById("truthTable");
    table.innerHTML = "";

    // Validate the expression
    if (expression === "") {
        table.innerHTML = "";
        return;
    }

    // Replace user-defined operations with JavaScript logical operators
    expression = expression.replace(/and/g, "&&");
    expression = expression.replace(/or/g, "||");
    expression = expression.replace(/\*+/g, "&&");
    expression = expression.replace(/\++/g, "||");

    // Find unique variables used in the expression
    var variables = expression.match(/[a-zA-Z]+/g);
    variables = Array.from(new Set(variables));

    

    var tableHeader = table.createTHead();
    var headerRow = tableHeader.insertRow();

    // Add variables as header cells
    for (var i = 0; i < variables.length; i++) {
        var headerCell = document.createElement("th");
        headerCell.innerHTML = variables[i];
        headerRow.appendChild(headerCell);
    }

    // Add expression as header cell
    var expressionHeader = document.createElement("th");
    expressionHeader.innerHTML = expression.replaceAll(/&&/g, "&and;").replace(/\|\|/g, "&or;").replace(/!/g, "&not;");
    expressionHeader.innerHTML = expressionHeader.innerHTML.replaceAll("&and;", "&and;").replace("&or;", "&or;").replace(/!/g, "&not;");
    headerRow.appendChild(expressionHeader);

    // Add minterms and maxterms as header cells
    var mintermsHeader = document.createElement("th");
    mintermsHeader.innerHTML = "Minterms";
    headerRow.appendChild(mintermsHeader);

    var maxtermsHeader = document.createElement("th");
    maxtermsHeader.innerHTML = "Maxterms";
    headerRow.appendChild(maxtermsHeader);

    // Generate truth table rows
    var rowCount = Math.pow(2, variables.length);
    for (var i = 0; i < rowCount; i++) {
        var row = table.insertRow();

        // Add variable values as cells
        for (var j = variables.length - 1; j >= 0; j--) {
            var cell = row.insertCell();
            var value = (i >> j) & 1;
            cell.innerHTML = value;
        }

        // Add expression result as cell
        var result = evaluateExpression(expression, variables, i);
        var resultCell = row.insertCell();
        resultCell.innerHTML = result;

        // Add minterms and maxterms as cells
        var mintermsCell = row.insertCell();
        mintermsCell.innerHTML = getMinterms(expression, variables, i);

        var maxtermsCell = row.insertCell();
        maxtermsCell.innerHTML = getMaxterms(expression, variables, i);
    }       
}

function evaluateExpression(expression, variables, row) {
    for (var i = 0; i < variables.length; i++) {
        expression = expression.replace(new RegExp(variables[i], 'g'), ((row >> (variables.length - i - 1)) & 1));
    }

    return +eval(expression);
}

function getMinterms(expression, variables, row) {
    var minterms = [];

    for (var i = 0; i < variables.length; i++) {
        expression = expression.replace(new RegExp(variables[i], 'g'), (row >> (variables.length - i - 1)) % 2);
    }

    if (evaluateExpression(expression, variables, row)) {
        var minterm = "";
        for (var i = 0; i < variables.length; i++) {
            if ((row >> (variables.length - i - 1)) % 2 === 1) {
                minterm += variables[i];
            } else {
                minterm +=  variables[i] + "'";
            }
        }
        minterms.push(minterm);
    }

    return minterms.join(", ");
}

function getMaxterms(expression, variables, row) {
    var maxterms = [];

    for (var i = 0; i < variables.length; i++) {
        expression = expression.replace(new RegExp(variables[i], 'g'), (row >> (variables.length - i - 1)) % 2);
    }

    if (!evaluateExpression(expression, variables, row)) {
        var maxterm = "";
        for (var i = 0; i < variables.length; i++) {
            if ((row >> (variables.length - i - 1)) % 2 === 0) {
                maxterm += variables[i];
            } else {
                maxterm +=  variables[i] + "'" ;
            }
            if(i !== variables.length-1){
                maxterm += "+"    
            }
        }
        maxterms.push(maxterm);
    }

    return maxterms.join(", ");
}

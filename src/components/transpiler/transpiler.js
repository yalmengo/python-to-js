/* Funciones Auxiliares */

// Contar el total de líneas en el código de entrada
function getTotalLines(tokens){
    let lines = 1;
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].value === '\n') lines++
    }
    return lines;
}

// Devuelve las líneas de código en un arreglo bidimensional
function getLines(tokens, total_lines){
    let lines = [];
    let list = [];
    let index = 0;
    for (let j = 0; j < total_lines; j++) {
        for (index; index < tokens.length; index++) {
            list.push(tokens[index].value);
            if (tokens[index].value === '\n'){
                index++;
                break
            }
        }
        lines.push(list);
        list = []
    }
    return lines
}

// Devuelve un arreglo para medir el nivel de sangría de cada línea
function getTabs(lines){
    let tabs = [];
    let aux = 0;
    for (let i = 0; i < lines.length; i++) {
        aux = 0;
        for (let j = 0; j < lines[i].length; j++) {
            if (lines[i][j] === "  ") {
                aux++
            }
        }
        tabs.push(aux);
    }
    tabs.push(aux);
    tabs.push(0);
    return tabs
}

// Inserta nuevas líneas de cierre de bloque
function insertNewLines(lines, tabs){
    let close_block = [];
    let lvl = 0;
    for (let i = 0; i < tabs.length; i++) {
        if (tabs[i] > tabs[i+1]){
            lvl = Math.abs(tabs[i+1] - tabs[i]);
            for (let j = 0; j < lvl; j++) {
                close_block.push("  ".repeat(j));
                close_block.push("}");
                close_block.push("\n");
                lines.splice(i+1 , 0, close_block);
                close_block = []
            }
        }
    }
    return lines
}

// Adapta la sintaxis de los bucles especificados a la nueva sintaxis
function updateLoopSyntax(lines) {
    let loops = ["if", "elif", "while"];
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines[i].length; j++) {
            for (let k = 0; k < loops.length; k++) {
                if (lines[i][j] === loops[k]){
                    lines[i].splice(j+2 , 0, "(");
                    lines[i].splice(lines[i].length-2 , 0, ")");
                }
            }
        }
    }
    return lines;
}

// Realiza sustituciones literales en el código entrante
function literalChanges(lines) {
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines[i].length; j++) {
            if (lines[i][j] === "def") lines[i][j] = "function";
            if (lines[i][j] === "print") lines[i][j] = "console.log";
            if (lines[i][j] === "elif") lines[i][j] = "else if";
            if (lines[i][j] === ":") lines[i][j] = "{";
            if (lines[i][j] === "True") lines[i][j] = "true";
            if (lines[i][j] === "False") lines[i][j] = "false";
            if (lines[i][j] === "except") lines[i][j] = "catch";
            if (lines[i][j] === "==") lines[i][j] = "===";
            if (lines[i][j] === "!=") lines[i][j] = "!==";
            if (lines[i][j].startsWith("#")){
                let comment = lines[i][j].split("#");
                lines[i][j] = "//" + comment[1]
            }
        }
    }
    return lines
}

// Convierte un arreglo bidimensional en una cadena ordenada
function arrToStr(lines){
    let out = '';
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines[i].length; j++) {
            out += lines[i][j]
        }
    }
    return out
}

module.exports = function toJavascript(pyTokens) {
    let total_lines = getTotalLines(pyTokens);
    let lines = getLines(pyTokens, total_lines);
    let tabs = getTabs(lines);
    // Análisis de líneas
    lines = insertNewLines(lines, tabs);
    lines = updateLoopSyntax(lines);
    // Sustitución literal
    lines = literalChanges(lines);
    return arrToStr(lines)
};
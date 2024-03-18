const Swal = require('sweetalert2');
const fs = require("fs");
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const pyScan = require("../components/scanner/python_analyzer");
const pyParser = require("../components/parser/python_parser");
const pythonShell = require('../components/shell/python');
const transpile = require('../components/transpiler/transpiler');

/* Ventana de CodeMirror */
// Python
const myPythonCode = CodeMirror(document.getElementById("python-code"), {
    mode:  "python",
    lineNumbers: true,
    theme: "nord"
});
// Javascript
const myJsCode = CodeMirror(document.getElementById("kotlin-code"), {
    mode:  "javascript",
    lineNumbers: true,
    theme: "nord"
});


/* Análisis Léxico/Sintáctico */
async function callTranspiler() {
    let py_code = myPythonCode.getValue();
    // Léxico
    let tokens = pyScan(py_code);
    // Sintáctico
    let ast = await pyParser(tokens, false, false);
    let syntax_errors = ast[0];
    if (!syntax_errors){
        let outCode = transpile(tokens);
        setJsValue(outCode);
    } else {
        Swal.fire({
            type: 'error',
            title: '¡Oops...',
            text: ast[1]
        })
    }
}



/* Ejecución de Shells */
async function runPython() {
    let code = myPythonCode.getValue();
    pythonShell(code);
}

async function runJS() {
    const code = await exec('node OutCode.js', {cwd: 'examples'});
    return {code}
}


/* Establecer texto del editor */
function setJsValue(text){
    myJsCode.setValue(text);
}

function setpyvalue(text){
 myPythonCode.setValue(text);
}



/* Flecha para Seleccionar Lenguaje */
var band=0;
function arrow(){
    if(band===0){
        document.getElementById('icon').style.transform = 'rotateZ(-180deg)';
        band=1;
    }else{
        document.getElementById('icon').style.transform = 'rotateZ(0deg)';
        band=0;
    }
}

function select_scanner(){
    // Cambiar 1 a 0 cuando todo esté listo
    if(band===0){
        callTranspiler();
    }
}
function runCode(){
    if(band===1){
        runPython()
    }else{
        runJS().then(function (e) {
            document.getElementById("shell-area").value = e.code["stdout"];
        });
    }
}

/* Importar archivos py o kt */
function importpy(){
    let file = document.getElementById('imp_py').files[0];
    document.getElementById('imp_py').value = "";
    let reader = new FileReader();
    reader.readAsText(file,'UTF-8');
    reader.onload = readerEvent => {
        let content = readerEvent.target.result;
        setpyvalue(content);
    }
}

function exportJs() {
    let js_code = myJsCode.getValue();
    fs.writeFile("examples/OutCode.js", js_code, (err) =>{
        if (err) throw err;
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500
        });

        Toast.fire({
            type: 'success',
            title: '¡Archivo Exportado!'
        })
    });
}

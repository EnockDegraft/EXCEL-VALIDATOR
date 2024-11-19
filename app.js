const darkMode = document.getElementById("dark-mode");
const body = document.getElementById("body")
darkMode.addEventListener("click", () => body.classList.add("bg-dark text-white"));


document.getElementById('validateBtn').addEventListener('click', () => {
    let fileInput = document.getElementById('fileInput');
    if (!fileInput.files[0]) {
        const error_msg_inp = document.getElementById('error_msg_inp');
        const errorMsg = document.getElementById('error_msg');

        error_msg_inp.classList.remove('d-none')
        errorMsg.value = "Please upload a file."
        return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const errors = validateExcelData(jsonData);
        displayValidationResults(errors);
    };
    reader.readAsArrayBuffer(fileInput.files[0]);
});


function validateExcelData(data) {

   

//   Check for file uploaded
    const fileInput = document.getElementById('fileInput');
if (!fileInput.files[0]) {
    console.log('No file selected.');

} else {
    console.log('File uploaded:', fileInput.files[0].name);
}

// Check if file can be read // 
const reader = new FileReader();
reader.onload = (event) => {
    console.log('File read successfully.');
    const data = new Uint8Array(event.target.result);
    console.log('File content (binary):', data);
};
reader.readAsArrayBuffer(fileInput.files[0]);

reader.onload = (event) => {
    const data = new Uint8Array(event.target.result);
    try {
        const workbook = XLSX.read(data, { type: 'array' });
        console.log('Workbook:', workbook);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        console.log('Sheet Name:', sheetName);
        console.log('Sheet Data:', sheet);

        const jsonData = XLSX.utils.sheet_to_json(sheet);
        console.log('Parsed Data:', jsonData);
    } catch (error) {
        console.error('Error reading Excel file:', error.message);
    }
};



    const errors = [];
    data.forEach((row, index) => {
        const rowIndex = index + 2; // Row 1 is header, start from row 2.

        // Field Validations
        if (!row["Bank"] || typeof row["Bank"] !== "string") {
            errors.push(`Row ${rowIndex}: "Bank" must contain text.`);
        }
        if (!row["CLIENT CODE"] || !Number.isInteger(row["CLIENT CODE"])) {
            errors.push(`Row ${rowIndex}: "CLIENT CODE" must contain a unique number.`);
        }
        if (!row["Mobile Number"] || !/^\d{10}$/.test(row["Mobile Number"])) {
            errors.push(`Row ${rowIndex}: "Mobile Number" must be a 10-digit number.`);
        }
        if (!["Male", "Female"].includes(row["Gender"])) {
            errors.push(`Row ${rowIndex}: "Gender" must be "Male" or "Female".`);
        }
        if (!row["Document ID"] || !/^GHA-\d{9}-\d{1}$/.test(row["Document ID"])) {
            errors.push(`Row ${rowIndex}: "Document ID" must match the format "GHA-000000000-0".`);
        }
        if (!row["Date of Birth"] || !/^\d{2}\d{2}\d{4}$/.test(row["Date of Birth"])) {
            errors.push(`Row ${rowIndex}: "Date of Birth" must be in "ddmmyyyy" format.`);
        }
        if (!row["Address"] || !/^[A-Z]{2}-\d{4}-\d{4}$/.test(row["Address"])) {
            errors.push(`Row ${rowIndex}: "Address" must match the format "XX-0000-0000".`);
        }
        if (!row["PRODUCT CODE"] || !/^\d{2}$/.test(row["PRODUCT CODE"])) {
            errors.push(`Row ${rowIndex}: "PRODUCT CODE" must be a 2-digit number.`);
        }
        if (row["Email"] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row["Email"])) {
            errors.push(`Row ${rowIndex}: "Email" is not valid.`);
        }
    });
    return errors;
}

function displayValidationResults(errors) {
    const resultsDiv = document.getElementById('validationResults');
    resultsDiv.innerHTML = "";
    if (errors.length === 0) {
        resultsDiv.innerHTML = '<div class="alert alert-success">No errors found in the file.</div>';
    } else {
        const errorList = errors.map(err => `<li>${err}</li>`).join('');
        resultsDiv.innerHTML = `
            <div class="alert alert-danger">
                <h5>Validation Errors:</h5>
                <ul>${errorList}</ul>
            </div>
        `;
    }
}



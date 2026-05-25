const mammoth = require("mammoth");

mammoth.extractRawText({path: "C:\\Users\\User\\Downloads\\Endosos FFC\\Carta_30_Agroplantulas_JA.docx"})
    .then(function(result){
        var text = result.value; 
        console.log(text);
    })
    .done();

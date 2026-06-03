const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('src/app');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/numero_control/g, 'controlNumber')
                   .replace(/estado/g, 'status')
                   .replace(/actividad/g, 'categoriaId')
                   .replace(/tipo_venta/g, 'categoriaId')
                   .replace(/nombre/g, 'companyName')
                   .replace(/direccion/g, 'address')
                   .replace(/fecha/g, 'issueDate')
                   .replace(/apellidos/g, 'representante')
                   .replace(/titulo/g, 'representante');
  fs.writeFileSync(file, content);
});

console.log('Fix applied to all files.');

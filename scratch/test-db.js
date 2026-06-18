import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env manually
const envPath = path.resolve('.env');
const envConfig = dotenvParse(fs.readFileSync(envPath, 'utf8'));

function dotenvParse(content) {
  const obj = {};
  content.split('\n').forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] || '';
      if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.replace(/\\n/gm, '\n');
      }
      obj[match[1]] = value.trim().replace(/(^['"]|['"]$)/g, '');
    }
  });
  return obj;
}

const supabaseUrl = envConfig.VITE_SUPABASE_URL || '';
const supabaseAnonKey = envConfig.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
  console.log('Verificando conexión...');
  // 1. Check if we can read from 'productos'
  const { data: products, error: pError } = await supabase.from('productos').select('*').limit(1);
  if (pError) {
    console.error('Error al leer productos:', pError);
  } else {
    console.log('Conexión exitosa. Productos leídos:', products);
  }

  // 2. Check if table 'categorias' exists
  const { data: cats, error: cError } = await supabase.from('categorias').select('*');
  if (cError) {
    console.error('La tabla "categorias" no existe o arrojó error:', cError.message);
  } else {
    console.log('La tabla "categorias" existe y contiene:', cats);
  }
}

checkSchema();

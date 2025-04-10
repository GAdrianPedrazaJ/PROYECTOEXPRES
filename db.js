const { Client } = require('pg');

// Datos de conexión con Supabase
const client = new Client({
    host: 'aws-0-us-east-2.pooler.supabase.com', 
    port: 5432,                                  
    user: 'postgres.pvexvntdyknjpjqdzpjr',        
    password: 'Janpedr@1110',                   
    database: 'postgres',                        
    ssl: {
        rejectUnauthorized: false                
    }
});

client.connect((error) => {
    if (error) {
        console.log('Error conectando con la base de datos:', error);
        return;
    } else {
        console.log('Conectado con la base de datos');
    }
});

module.exports = client;

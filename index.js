
//trabajo realizado por javier adrian pedraza garcia



const express = require('express');
const client = require('./db'); 
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/api/prueba', (req, res) => {
    res.send('API funcionando correctamente');
});

app.get('/api/prueba2', (req, res) => {
    res.status(200).json({
        message: 'API funciona bien',
        port: PORT,
        status: 'exitoso'
    });
});


app.post('/api/guardar', async (req, res) => {
    const { cedula, nombre, edad, profesion } = req.body;
    const query = 'INSERT INTO persona (cedula, nombre, edad, profesion) VALUES ($1, $2, $3, $4)';

    try {
        await client.query(query, [cedula, nombre, edad, profesion]);
        res.status(201).json({ 
            message: "Usuario creado exitosamente", 
            cedula, nombre, edad, profesion 
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creando el usuario',
            error: error.message
        });
    }
});


app.get('/api/obtener', async (req, res) => {
    const query = 'SELECT * FROM persona';

    try {
        const result = await client.query(query);
        res.status(200).json({
            success: true,
            message: "Datos de la tabla",
            data: result.rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al recuperar datos",
            details: error.message
        });
    }
});


app.delete('/api/eliminar/:cedula', async (req, res) => {
    const { cedula } = req.params; // cedula es string automáticamente

    const query = 'DELETE FROM persona WHERE cedula = $1';

    try {
        const result = await client.query(query, [cedula]); // pasa como string

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: `No existe el registro con la cédula: ${cedula}`,
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Dato eliminado de la tabla",
                data: result,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el registro",
            details: error.message,
        });
    }
});

app.put('/api/actualizar/:cedula', async (req, res) => {
    const { cedula } = req.params;
    const { nombre, edad, profesion } = req.body;

    const query = `
        UPDATE persona 
        SET  nombre = $1, edad = $2, profesion = $3 
        WHERE cedula = $4
    `;

    try {
        const result = await client.query(query, [nombre, edad, profesion, cedula]);

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: `No se encontró ningún registro con la cédula: ${cedula}`,
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Usuario actualizado exitosamente",
                data: { cedula, nombre, edad, profesion },
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el usuario",
            error: error.message,
        });
    }
});




app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

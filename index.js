import pg from 'pg';

const { Pool } = pg;

// Configuración de la conexión a PostgreSQL
const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'always_music',
    password: 'postgres',
    port: 5432
};

const pool = new Pool(config);

// Crear nuevo estudiante
const nuevoEstudiante = async (rut, nombre, curso, nivel) => {
    const client = await pool.connect();
    try {
        const result = await client.query('INSERT INTO ESTUDIANTES (RUT, NOMBRE, CURSO, NIVEL) VALUES ($1, $2, $3, $4)', [rut, nombre, curso, nivel]);
        console.log('Estudiante registrado correctamente:', result.rowCount);
    } catch (err) {
        console.error('Error al registrar estudiante:', err.message);
    } finally {
        client.release();
    }
};

// Consulta estudiante por rut

const consultaPorRut = async (rut) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM ESTUDIANTES WHERE RUT = $1', [rut]);
        if (result.rows.length === 0) {
            console.log('No existe un estudiante con el RUT seleccionado');
        } else {
            console.log('Estudiante encontrado:', result.rows[0]);
        }
    } catch (err) {
        console.error('Error al obtener estudiante por RUT:', err.message);
    } finally {
        client.release();
    }
};

// Consulta que devuelve todos los estudiantes

const consultarLista = async () => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM ESTUDIANTES');
        console.log('Estudiantes registrados:', result.rows);
    } catch (err) {
        console.error('Error al obtener todos los estudiantes:', err.message);
    } finally {
        client.release();
    }
};

// Actualizar información del estudiante

const actualizarEstudiante = async (rut, nombre, curso, nivel) => {
    const client = await pool.connect();
    try {
        const result = await client.query('UPDATE ESTUDIANTES SET NOMBRE = $1, CURSO = $2, NIVEL = $3 WHERE RUT = $4', [nombre, curso, nivel, rut]);
        if (result.rowCount === 0) {
            console.log('Estudiante no encontrado para actualizar');
        } else {
            console.log('Estudiante actualizado correctamente');
        }
    } catch (err) {
        console.error('Error al actualizar estudiante:', err.message);
    } finally {
        client.release();
    }
};

// Eliminar un estudiante según su rut

const eliminarEstudiante = async (rut) => {
    const client = await pool.connect();
    try {
        const result = await client.query('DELETE FROM ESTUDIANTES WHERE RUT = $1', [rut]);
        if (result.rowCount === 0) {
            console.log('Estudiante no encontrado para eliminar');
        } else {
            console.log('Estudiante eliminado correctamente');
        }
    } catch (err) {
        console.error('Error al eliminar estudiante:', err.message);
    } finally {
        client.release();
    }
};

// Ejecución de los comandos

const ejecutarComando = async (argv) => {
    const comando = argv[2];

    switch (comando) {
        case 'nuevo':
            const rut = argv[3];
            const nombre = argv[4];
            const curso = argv[5];
            const nivel = argv[6];
            if (rut && nombre && curso && nivel) {
                await nuevoEstudiante(rut, nombre, curso, nivel);
            } else {
                console.error('Faltan argumentos para registrar estudiante');
            }
            break;
        case 'rut':
            const rutConsulta = argv[3];
            if (rutConsulta) {
                await consultaPorRut(rutConsulta);
            } else {
                console.error('Debe proporcionar un RUT para consultar estudiante');
            }
            break;
        case 'consulta':
            await consultarLista();
            break;
        case 'editar':
            const rutActualizar = argv[3];
            const nombreActualizar = argv[4];
            const cursoActualizar = argv[5];
            const nivelActualizar = argv[6];
            if (rutActualizar && nombreActualizar && cursoActualizar && nivelActualizar) {
                await actualizarEstudiante(rutActualizar, nombreActualizar, cursoActualizar, nivelActualizar);
            } else {
                console.error('Faltan argumentos para actualizar estudiante');
            }
            break;
        case 'eliminar':
            const rutEliminar = argv[3];
            if (rutEliminar) {
                await eliminarEstudiante(rutEliminar);
            } else {
                console.error('Debe proporcionar un RUT para eliminar estudiante');
            }
            break;
        default:
            console.error('Comando no reconocido');
            break;
    }
};



ejecutarComando(process.argv);
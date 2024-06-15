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
        const query = {
            text: 'INSERT INTO ESTUDIANTES (RUT, NOMBRE, CURSO, NIVEL) VALUES ($1, $2, $3, $4)',
            values: [rut, nombre, curso, nivel]
        };
        const result = await client.query(query);
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
        const query = {
            text: 'SELECT * FROM ESTUDIANTES WHERE RUT = $1',
            values: [rut]
        };
        const result = await client.query(query);
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
        const query = {
            text: 'SELECT * FROM ESTUDIANTES'
        };
        const result = await client.query(query);
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
        const query = {
            text: 'UPDATE ESTUDIANTES SET NOMBRE = $1, CURSO = $2, NIVEL = $3 WHERE RUT = $4',
            values: [nombre, curso, nivel, rut]
        };
        const result = await client.query(query);
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
        const query = {
            text: 'DELETE FROM ESTUDIANTES WHERE RUT = $1',
            values: [rut]
        };
        const result = await client.query(query);
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
    try {
        const comando = argv[2];

        switch (comando) {
            case 'nuevo':
                const [rut, nombre, curso, nivel] = argv.slice(3);
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
                const [rutActualizar, nombreActualizar, cursoActualizar, nivelActualizar] = argv.slice(3);
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
    } catch (err) {
        console.error('Error al ejecutar el comando:', err.message);
    }
};

ejecutarComando(process.argv);

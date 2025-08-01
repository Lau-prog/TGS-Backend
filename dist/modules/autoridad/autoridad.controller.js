import { orm } from '../../shared/db/orm.js';
import { Autoridad } from './autoridad.entity.js';
import { Zona } from '../zona/zona.entity.js';
async function crear(req, res) {
    const em = orm.em.fork();
    try {
        const { dni, nombre, rango, zonaId } = res.locals.validated.body;
        if (!nombre || !dni || rango === undefined || zonaId === undefined) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }
        const existeDNI = await em.findOne(Autoridad, { dni });
        if (existeDNI) {
            return res.status(409).json({ error: 'Ya existe una autoridad con ese DNI' });
        }
        const existeZona = await em.count(Zona, { id: zonaId });
        if (!existeZona) {
            return res.status(404).json({ error: 'Zona no encontrada' });
        }
        const autoridad = em.create(Autoridad, {
            dni,
            nombre,
            rango,
            zona: em.getReference(Zona, zonaId)
        });
        await em.persistAndFlush(autoridad);
        return res.status(201).json({
            message: 'Autoridad creada exitosamente',
            data: autoridad.toDTO()
        });
    }
    catch (error) {
        console.error('Error creando autoridad:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}
async function listar(req, res) {
    const em = orm.em.fork();
    try {
        const autoridades = await em.find(Autoridad, {}, { populate: ['zona'] });
        return res.status(200).json({
            message: `Se ${autoridades.length === 1 ? 'encontró' : 'encontraron'} ${autoridades.length} autoridad${autoridades.length !== 1 ? 'es' : ''}`,
            data: autoridades.map(a => a.toDTO())
        });
    }
    catch (error) {
        console.error('Error al listar autoridades:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}
async function obtenerPorDni(req, res) {
    const em = orm.em.fork();
    const dni = req.params.dni;
    try {
        const autoridad = await em.findOne(Autoridad, { dni }, { populate: ['zona'] });
        if (!autoridad) {
            return res.status(404).json({ error: 'Autoridad no encontrada' });
        }
        return res.json(autoridad.toDTO());
    }
    catch (error) {
        console.error('Error obteniendo autoridad:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}
async function putUpdate(req, res) {
    const em = orm.em.fork();
    const dni = req.params.dni;
    try {
        const autoridad = await em.findOne(Autoridad, { dni }, { populate: ['zona'] });
        if (!autoridad) {
            return res.status(404).json({ error: 'Autoridad no encontrada' });
        }
        const { nombre, rango, zonaId } = res.locals.validated.body;
        if (!nombre || rango === undefined || zonaId === undefined) {
            return res.status(400).json({ message: 'Faltan datos obligatorios para actualizar' });
        }
        const existeZona = await em.count(Zona, { id: zonaId });
        if (!existeZona) {
            return res.status(404).json({ error: 'Zona no encontrada' });
        }
        autoridad.nombre = nombre;
        autoridad.rango = rango;
        autoridad.zona = em.getReference(Zona, zonaId);
        await em.flush();
        return res.status(200).json({
            message: 'Autoridad actualizada correctamente',
            data: autoridad.toDTO()
        });
    }
    catch (error) {
        console.error('Error actualizando autoridad:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}
async function patchUpdate(req, res) {
    const em = orm.em.fork();
    const dni = req.params.dni;
    try {
        const autoridad = await em.findOne(Autoridad, { dni }, { populate: ['zona'] });
        if (!autoridad) {
            return res.status(404).json({ error: 'Autoridad no encontrada' });
        }
        const updates = res.locals.validated.body;
        if (updates.zonaId !== undefined) {
            const existeZona = await em.count(Zona, { id: updates.zonaId });
            if (!existeZona) {
                return res.status(404).json({ error: 'Zona no encontrada' });
            }
            autoridad.zona = em.getReference(Zona, updates.zonaId);
            delete updates.zonaId;
        }
        if (updates.nombre !== undefined)
            autoridad.nombre = updates.nombre;
        if (updates.rango !== undefined)
            autoridad.rango = updates.rango;
        await em.flush();
        return res.status(200).json({
            message: 'Autoridad modificada parcialmente con éxito',
            data: autoridad.toDTO()
        });
    }
    catch (error) {
        console.error('Error en patchUpdate autoridad:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}
async function eliminar(req, res) {
    const em = orm.em.fork();
    const dni = req.params.dni;
    try {
        const autoridad = await em.findOne(Autoridad, { dni });
        if (!autoridad) {
            return res.status(404).json({ error: 'Autoridad no encontrada' });
        }
        await em.removeAndFlush(autoridad);
        return res.status(200).json({
            message: `${autoridad.nombre}, DNI ${autoridad.dni} eliminado/a exitosamente de la lista de autoridades`,
        });
    }
    catch (error) {
        console.error('Error eliminando autoridad:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}
export { crear, listar, obtenerPorDni, putUpdate, patchUpdate, eliminar };
//# sourceMappingURL=autoridad.controller.js.map
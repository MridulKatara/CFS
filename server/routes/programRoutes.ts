import { Elysia } from 'elysia';
import {
    getAllPrograms,
    getProgramById,
    createProgram,
    updateProgram,
    deleteProgram
} from '../controllers/programController';

const programRoutes = new Elysia({ prefix: '/programs' })
    .get('/', getAllPrograms)
    .get('/:id', getProgramById)
    .post('/', createProgram)
    .put('/:id', updateProgram)
    .delete('/:id', deleteProgram);

export default programRoutes; 
import { Elysia } from 'elysia';
import mongoose from 'mongoose';
import {
    getAllPrograms,
    getProgramById,
    createProgram,
    updateProgram,
    deleteProgram,
    getEnrolledPrograms
} from '../controllers/programController';
import Program from '../models/Program';
import AllProgram from '../models/AllPrograms';
import { authMiddleware } from "../middleware/auth";

const app = new Elysia({ prefix: '/programs' });

app
    .get('/', async () => {
        try {
            const programs = await Program.find({});
            return { success: true, data: programs };
        } catch (error) {
            return { success: false, message: "Failed to fetch programs" };
        }
    })
    .get('/:id', async ({ params }) => {
        try {
            console.log("Looking for program with ID:", params.id);
            
            // Try to find the program in AllProgram collection first
            let program = await AllProgram.findById(params.id);
            
            // If not found in AllProgram, try in Program collection
            if (!program) {
                program = await Program.findById(params.id);
            }
            
            console.log("Program found:", !!program);
            
            if (!program) {
                return {
                    success: false,
                    message: "Program not found",
                    status: 404
                };
            }
            
            return { success: true, data: program };
        } catch (error) {
            console.error("Error finding program:", error);
            return { 
                success: false, 
                message: `Error finding program: ${error instanceof Error ? error.message : 'Unknown error'}`,
                status: 500
            };
        }
    })
    .post('/', createProgram)
    .put('/:id', updateProgram)
    .delete('/:id', deleteProgram)
    .use(authMiddleware)
    .get('/my-programs', getEnrolledPrograms)
    .get('/allprograms', getAllPrograms);

export default app; 
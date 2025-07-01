import { Elysia } from 'elysia';
import mongoose from 'mongoose';
import {
    getAllPrograms,
    getProgramById,
    createProgram,
    updateProgram,
    deleteProgram
} from '../controllers/programController';
import { Program } from '../models/Program';

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
            // Log the ID for debugging
            console.log("Looking for program with ID:", params.id);
            
            // Check if ID is valid ObjectId format
            if (!mongoose.Types.ObjectId.isValid(params.id)) {
                console.log("Invalid ObjectId format");
                return {
                    success: false,
                    message: "Invalid program ID format",
                    status: 400
                };
            }

            // Try to find the program
            const program = await Program.findById(params.id);
            console.log("Program found:", !!program);
            
            if (!program) {
                // Try a raw query to debug
                console.log("Trying raw query...");
                const rawProgram = await Program.findOne({_id: params.id});
                console.log("Raw query result:", !!rawProgram);
                
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
    .delete('/:id', deleteProgram);

export default app; 
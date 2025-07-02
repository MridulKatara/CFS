import { Elysia } from 'elysia';
import AllProgram from '../models/AllPrograms';

const allProgramRoutes = new Elysia({ prefix: '/allprograms' });

allProgramRoutes.get('/', async () => {
    try {
        const programs = await AllProgram.find({});
        console.log("Fetched programs from allprograms:", programs);
        return programs;
    } catch (error) {
        console.error("Error fetching allprograms:", error);
        return { success: false, message: "Failed to fetch all programs" };
    }
});

export default allProgramRoutes;

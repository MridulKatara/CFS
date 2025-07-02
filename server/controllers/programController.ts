import  Program  from '../models/Program';
import AllProgram from '../models/AllPrograms';


type CtxWithSet = {
    set: { status: number };
    params?: Record<string, string>;
    body?: any;
};

// Get all programs
export const getAllPrograms = async (req, res) => {
    console.log("Getting all programs");
    try {
        const programs = await AllProgram.find({});
        console.log("Programs:", programs);
        res.status(200).json(programs);
    } catch (error) {
        console.error("Error fetching programs:", error);
        console.log("Error:", error);
        res.status(500).json({ message: "Failed to fetch all programs", error: error.message });
    }
};

// Get a program by ID
export const getProgramById = async ({ params, set }: CtxWithSet) => {
    try {
        const program = await Program.findOne({ programId: params?.id }).lean();
        if (!program) {
            set.status = 404;
            return { message: 'Program not found' };
        }
        return program;
    } catch (error) {
        set.status = 500;
        return { message: 'Server error', error };
    }
};

// Create a new program
export const createProgram = async ({ body, set }: CtxWithSet) => {
    try {
        const newProgram = new Program(body);
        await newProgram.save();
        set.status = 201;
        return newProgram;
    } catch (error) {
        set.status = 400;
        return { message: 'Error creating program', error };
    }
};

// Update a program
export const updateProgram = async ({ params, body, set }: CtxWithSet) => {
    try {
        const updated = await Program.findOneAndUpdate(
            { programId: params?.id },
            body,
            { new: true }
        );
        if (!updated) {
            set.status = 404;
            return { message: 'Program not found' };
        }
        return updated;
    } catch (error) {
        set.status = 400;
        return { message: 'Error updating program', error };
    }
};

// Delete a program
export const deleteProgram = async ({ params, set }: CtxWithSet) => {
    try {
        const deleted = await Program.findOneAndDelete({ programId: params?.id });
        if (!deleted) {
            set.status = 404;
            return { message: 'Program not found' };
        }
        return { message: 'Program deleted' };
    } catch (error) {
        set.status = 400;
        return { message: 'Error deleting program', error };
    }
};

export const getEnrolledPrograms = async (req, res) => {
    try {
        // Get user ID from the authenticated request
        const userId = req.user.id;
        
        // Find all programs where the user is enrolled
        // This assumes you have a MyProgram model that stores enrollment data
        const enrolledPrograms = await req.context.db.MyProgram.find({ userId });
        
        res.status(200).json({ 
            programs: enrolledPrograms 
        });
    } catch (error) {
        console.error("Error fetching enrolled programs:", error);
        res.status(500).json({ message: "Failed to fetch enrolled programs", error: error.message });
    }
}; 
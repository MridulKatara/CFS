import  Program  from '../models/Program';
import AllProgram from '../models/AllPrograms';
import MyProgram from '../models/MyProgram';


type CtxWithSet = {
    set: { status: number };
    params?: Record<string, string>;
    body?: any;
};

// Get all programs
export const getAllPrograms = async ({ set }: CtxWithSet) => {
    console.log("Getting all programs");
    try {
        const programs = await AllProgram.find({});
        console.log("Programs:", programs);
        return { success: true, data: programs };
    } catch (error) {
        console.error("Error fetching programs:", error);
        set.status = 500;
        return { success: false, message: "Failed to fetch all programs", error: error.message };
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

// ADMIN: Get a program by ID from AllPrograms
export const getAdminProgramById = async ({ params, set }: CtxWithSet) => {
    try {
        const program = await AllProgram.findById(params?.id).lean();
        if (!program) {
            set.status = 404;
            return { success: false, message: 'Program not found' };
        }
        return { success: true, data: program };
    } catch (error) {
        set.status = 500;
        return { success: false, message: 'Server error', error };
    }
};

// ADMIN: Create a new program
export const createProgram = async ({ body, set }: CtxWithSet) => {
    try {
        // Generate a programId if not provided
        if (!body.programId) {
            body.programId = 'PRG' + Date.now().toString().substring(6);
        }
        
        // Validate required fields
        if (!body.programName) {
            set.status = 400;
            return { success: false, message: 'Program name is required' };
        }
        
        const newProgram = new AllProgram({
            ...body,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        await newProgram.save();
        set.status = 201;
        return { success: true, data: newProgram };
    } catch (error) {
        console.error("Error creating program:", error);
        set.status = 400;
        return { success: false, message: 'Error creating program', error };
    }
};

// ADMIN: Update a program
export const updateProgram = async ({ params, body, set }: CtxWithSet) => {
    try {
        const updated = await AllProgram.findByIdAndUpdate(
            params?.id,
            { 
                ...body,
                updatedAt: new Date()
            },
            { new: true }
        );
        
        if (!updated) {
            set.status = 404;
            return { success: false, message: 'Program not found' };
        }
        
        return { success: true, data: updated };
    } catch (error) {
        console.error("Error updating program:", error);
        set.status = 400;
        return { success: false, message: 'Error updating program', error };
    }
};

// ADMIN: Delete a program
export const deleteProgram = async ({ params, set }: CtxWithSet) => {
    try {
        const deleted = await AllProgram.findByIdAndDelete(params?.id);
        
        if (!deleted) {
            set.status = 404;
            return { success: false, message: 'Program not found' };
        }
        
        return { success: true, message: 'Program deleted successfully' };
    } catch (error) {
        console.error("Error deleting program:", error);
        set.status = 400;
        return { success: false, message: 'Error deleting program', error };
    }
};

// ADMIN: Add a tool to program toolkit
export const addToolToProgram = async ({ params, body, set }: CtxWithSet) => {
    try {
        if (!body.name || !body.logoUrl) {
            set.status = 400;
            return { success: false, message: 'Tool name and logo URL are required' };
        }
        
        const program = await AllProgram.findById(params?.id);
        
        if (!program) {
            set.status = 404;
            return { success: false, message: 'Program not found' };
        }
        
        program.toolkit = program.toolkit || [];
        program.toolkit.push({
            name: body.name,
            logoUrl: body.logoUrl
        });
        program.updatedAt = new Date();
        
        await program.save();
        
        return { success: true, data: program };
    } catch (error) {
        console.error("Error adding tool:", error);
        set.status = 400;
        return { success: false, message: 'Error adding tool', error };
    }
};

// ADMIN: Remove a tool from program toolkit
export const removeToolFromProgram = async ({ params, set }: CtxWithSet) => {
    try {
        if (!params?.id || !params?.toolId) {
            set.status = 400;
            return { success: false, message: 'Program ID and Tool ID are required' };
        }
        
        const program = await AllProgram.findById(params.id);
        
        if (!program) {
            set.status = 404;
            return { success: false, message: 'Program not found' };
        }
        
        if (!program.toolkit) {
            set.status = 404;
            return { success: false, message: 'Toolkit not found' };
        }
        
        // Convert toolkit to normal array for filtering
        const updatedToolkit = program.toolkit.filter(
            (tool: any) => tool._id.toString() !== params.toolId
        );
        
        program.toolkit = updatedToolkit as any;
        program.updatedAt = new Date();
        
        await program.save();
        
        return { success: true, data: program };
    } catch (error) {
        console.error("Error removing tool:", error);
        set.status = 400;
        return { success: false, message: 'Error removing tool', error };
    }
};

// ADMIN: Add a fact to program
export const addFactToProgram = async ({ params, body, set }: CtxWithSet) => {
    try {
        if (!body.content) {
            set.status = 400;
            return { success: false, message: 'Fact content is required' };
        }
        
        const program = await AllProgram.findById(params?.id);
        
        if (!program) {
            set.status = 404;
            return { success: false, message: 'Program not found' };
        }
        
        program.facts = program.facts || [];
        program.facts.push({
            content: body.content,
            imageUrl: body.imageUrl,
            highlight: body.highlight
        });
        program.updatedAt = new Date();
        
        await program.save();
        
        return { success: true, data: program };
    } catch (error) {
        console.error("Error adding fact:", error);
        set.status = 400;
        return { success: false, message: 'Error adding fact', error };
    }
};

// ADMIN: Remove a fact from program
export const removeFactFromProgram = async ({ params, set }: CtxWithSet) => {
    try {
        if (!params?.id || !params?.factId) {
            set.status = 400;
            return { success: false, message: 'Program ID and Fact ID are required' };
        }
        
        const program = await AllProgram.findById(params.id);
        
        if (!program) {
            set.status = 404;
            return { success: false, message: 'Program not found' };
        }
        
        if (!program.facts) {
            set.status = 404;
            return { success: false, message: 'Facts not found' };
        }
        
        // Convert facts to normal array for filtering
        const updatedFacts = program.facts.filter(
            (fact: any) => fact._id.toString() !== params.factId
        );
        
        program.facts = updatedFacts as any;
        program.updatedAt = new Date();
        
        await program.save();
        
        return { success: true, data: program };
    } catch (error) {
        console.error("Error removing fact:", error);
        set.status = 400;
        return { success: false, message: 'Error removing fact', error };
    }
};

export const getEnrolledPrograms = async ({ user, set }: CtxWithSet & { user: any }) => {
    try {
        // Get user ID from the authenticated request
        const userId = user.id;
        
        // Find all programs where the user is enrolled
        // This assumes you have a MyProgram model that stores enrollment data
        const enrolledPrograms = await MyProgram.find({ userId });
        
        return { 
            success: true,
            programs: enrolledPrograms 
        };
    } catch (error) {
        console.error("Error fetching enrolled programs:", error);
        set.status = 500;
        return { success: false, message: "Failed to fetch enrolled programs", error: error.message };
    }
}; 
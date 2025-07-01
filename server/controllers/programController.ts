import { Program } from '../models/Program';


type CtxWithSet = {
    set: { status: number };
    params?: Record<string, string>;
    body?: any;
};

// Get all programs
export const getAllPrograms = async ({ set }: CtxWithSet) => {
    try {
        const programs = await Program.find().lean();
        return programs;
    } catch (error) {
        set.status = 500;
        return { message: 'Server error', error };
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
import University from '../models/University';

// Get all universities
export const getAllUniversities = async () => {
  try {
    const universities = await University.find({}).sort({ name: 1 });
    return universities;
  } catch (error) {
    console.error('Error fetching universities:', error);
    throw new Error('Failed to fetch universities');
  }
};

// Add a new university
export const addUniversity = async ({ body }: { body: { name: string } }) => {
  try {
    const { name } = body;
    
    if (!name) {
      throw new Error('University name is required');
    }
    
    // Check if university already exists
    const existingUniversity = await University.findOne({ name });
    if (existingUniversity) {
      throw new Error('University already exists');
    }
    
    const university = new University({ name });
    await university.save();
    
    return university;
  } catch (error) {
    console.error('Error adding university:', error);
    throw error;
  }
};

// Update university
export const updateUniversity = async ({ params, body }: { params: { id: string }, body: { name: string } }) => {
  try {
    const { id } = params;
    const { name } = body;
    
    if (!name) {
      throw new Error('University name is required');
    }
    
    // Check if university exists with new name
    const existingUniversity = await University.findOne({ name, _id: { $ne: id } });
    if (existingUniversity) {
      throw new Error('University with this name already exists');
    }
    
    const university = await University.findByIdAndUpdate(
      id, 
      { name }, 
      { new: true }
    );
    
    if (!university) {
      throw new Error('University not found');
    }
    
    return university;
  } catch (error) {
    console.error('Error updating university:', error);
    throw error;
  }
};

// Delete university
export const deleteUniversity = async ({ params }: { params: { id: string } }) => {
  try {
    const { id } = params;
    
    const university = await University.findByIdAndDelete(id);
    
    if (!university) {
      throw new Error('University not found');
    }
    
    return { message: 'University deleted successfully' };
  } catch (error) {
    console.error('Error deleting university:', error);
    throw error;
  }
}; 
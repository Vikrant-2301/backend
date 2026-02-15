const VotingProject = require('../model/votingProjectModel');
const Vote = require('../model/voteModel');
const mongoose = require('mongoose');

// Get all projects with current vote counts
// Get all projects with current vote counts
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await VotingProject.find().sort({ title: 1 });

        // Check if user has voted (if logged in)
        let userVotedProjectIds = [];
        if (req.user) {
            const votes = await Vote.find({ user: req.user.id });
            userVotedProjectIds = votes.map(v => v.project.toString());
        }

        res.status(200).json({
            projects,
            userVotedProjectIds
        });
    } catch (error) {
        console.error('Error fetching voting projects:', error);
        res.status(500).json({ message: 'Server error fetching projects' });
    }
};

// Cast a vote
exports.castVote = async (req, res) => {
    const { projectId } = req.body;
    const userId = req.user.id; // From authMiddleware

    if (!projectId) {
        return res.status(400).json({ message: 'Project ID is required' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Check if user already voted for THIS project
        const existingVote = await Vote.findOne({ user: userId, project: projectId }).session(session);
        if (existingVote) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'You have already voted for this project.' });
        }

        // 2. Check if project exists
        const project = await VotingProject.findById(projectId).session(session);
        if (!project) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Project not found.' });
        }

        // 3. Create Vote record
        const newVote = new Vote({
            user: userId,
            project: projectId
        });
        await newVote.save({ session });

        // 4. Increment project vote count
        project.voteCount += 1;
        await project.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: 'Vote cast successfully!',
            projectId: project._id,
            voteCount: project.voteCount
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error casting vote:', error);
        res.status(500).json({ message: 'Server error casting vote' });
    }
};


// Admin: Reset all votes (Optional, for testing)
exports.resetVotes = async (req, res) => {
    try {
        await Vote.deleteMany({});
        await VotingProject.updateMany({}, { voteCount: 0 });
        res.status(200).json({ message: 'All votes reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting votes' });
    }
};

// Admin: Create a new project
exports.createProject = async (req, res) => {
    console.log('[VotingController] createProject called with body:', req.body);
    try {
        const { title, description, college, students, images, uniqueId } = req.body;

        // Basic validation
        if (!title || !description || !college || !students) {
            console.log('[VotingController] Missing fields');
            return res.status(400).json({ message: 'All fields are required' });
        }

        let imageList = [];
        if (Array.isArray(images)) {
            imageList = images;
        } else if (typeof images === 'string') {
            try {
                // Try to parse if it's a JSON string
                imageList = JSON.parse(images);
                if (!Array.isArray(imageList)) imageList = [images];
            } catch (e) {
                // If not JSON, treat as comma-separated or single URL
                imageList = images.split(',').map(s => s.trim());
            }
        }

        const newProject = new VotingProject({
            title,
            description,
            college,
            students: Array.isArray(students) ? students : students.split(',').map(s => s.trim()),
            images: imageList.filter(img => img && typeof img === 'string'), // Filter out invalid entries
            uniqueId: uniqueId || undefined // Only set if provided
        });

        await newProject.save();
        console.log('[VotingController] Project created successfully');
        res.status(201).json({ message: 'Project created successfully', project: newProject });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
};

// Admin: Delete a project
exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await VotingProject.findByIdAndDelete(id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Also delete associated votes
        await Vote.deleteMany({ project: id });

        res.status(200).json({ message: 'Project and associated votes deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error deleting project' });
    }
};

// Admin: Get all votes with details
exports.getAllVotes = async (req, res) => {
    try {
        const votes = await Vote.find()
            .populate('user', 'firstName lastName email')
            .populate('project', 'title college')
            .sort({ createdAt: -1 });

        res.status(200).json({ votes });
    } catch (error) {
        console.error('Error fetching votes:', error);
        res.status(500).json({ message: 'Error fetching votes' });
    }
};

// Admin: Update a project
exports.updateVotingProject = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Handle uniqueId (ensure empty string becomes undefined/null to avoid uniqueness conflict if sparse)
        if (updates.uniqueId === "") {
            updates.uniqueId = undefined; // Or use $unset if needed, but undefined usually works with saving logic or just set to null
            // Actually with findByIdAndUpdate, we might need to be careful.
            // If we want to remove it, we should probably use $unset.
            // But for now, let's assume if they send empty string they mean "remove it" or "no id".
            // Simplest is to set to null if sparse index allows.
            updates.uniqueId = null;
        }

        // Handle students array/string conversion
        if (updates.students && typeof updates.students === 'string') {
            updates.students = updates.students.split(',').map(s => s.trim());
        }

        // Handle images if needed (though usually array is sent)
        if (updates.images && Array.isArray(updates.images)) {
            updates.images = updates.images.filter(img => img && typeof img === 'string');
        } else if (updates.images && typeof updates.images === 'string') {
            updates.images = updates.images.split(',').map(s => s.trim());
        }

        const project = await VotingProject.findByIdAndUpdate(id, updates, { new: true });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ message: 'Project updated successfully', project });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Error updating project' });
    }
};

// Admin: Add Manual Votes
exports.addManualVotes = async (req, res) => {
    try {
        const { id } = req.params;
        const { count } = req.body;

        if (!count || isNaN(count)) {
            return res.status(400).json({ message: 'Invalid vote count' });
        }

        const project = await VotingProject.findByIdAndUpdate(
            id,
            { $inc: { voteCount: parseInt(count) } },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ message: 'Votes added successfully', project });
    } catch (error) {
        console.error('Error adding votes:', error);
        res.status(500).json({ message: 'Error adding votes' });
    }
};

// Admin: Get Voting Stats
exports.getVotingStats = async (req, res) => {
    try {
        // Total Votes should be sum of all voteCounts (including manual votes)
        const projectVotes = await VotingProject.find().sort({ voteCount: -1 });

        const totalVotes = projectVotes.reduce((sum, p) => sum + (p.voteCount || 0), 0);

        const mostVoted = projectVotes[0] || null;
        const leastVoted = projectVotes[projectVotes.length - 1] || null;

        res.status(200).json({
            totalVotes, // Now reflects manual + user votes
            mostVoted,
            leastVoted,
            projectVotes
        });
    } catch (error) {
        console.error('Error fetching voting stats:', error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

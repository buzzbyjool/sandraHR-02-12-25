import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const sampleData = {
  candidates: [
    {
      id: 'c1',
      name: 'John Doe',
      position: 'Software Engineer',
      company: 'Tech Corp',
      email: 'john.doe@example.com',
      phone: '+1 234 567 890',
      location: 'San Francisco, CA',
      status: 'In Progress',
      stage: 'screening',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      rating: 4.5,
      createdAt: new Date().toISOString()
    },
    // Add more sample candidates as needed
  ],
  jobs: [
    {
      id: 'j1',
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      status: 'Active',
      description: 'We are looking for a Senior Software Engineer...',
      requirements: ['5+ years experience', 'React expertise', 'Node.js'],
      createdAt: new Date().toISOString()
    },
    // Add more sample jobs as needed
  ]
};

export async function initializeFirestoreData() {
  try {
    const batch = writeBatch(db);

    // Initialize candidates
    sampleData.candidates.forEach((candidate) => {
      const ref = doc(collection(db, 'candidates'), candidate.id);
      batch.set(ref, candidate);
    });

    // Initialize jobs
    sampleData.jobs.forEach((job) => {
      const ref = doc(collection(db, 'jobs'), job.id);
      batch.set(ref, job);
    });

    await batch.commit();
    console.log('Sample data initialized successfully');
  } catch (error) {
    console.error('Error initializing data:', error);
    throw error;
  }
}
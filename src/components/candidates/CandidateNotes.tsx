import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCandidateNotes } from '../../hooks/useCandidateNotes';

interface CandidateNotesProps {
  candidateId: string;
}

export default function CandidateNotes({ candidateId }: CandidateNotesProps) {
  const { currentUser } = useAuth();
  const { notes, addNote } = useCandidateNotes(candidateId);
  const [newNote, setNewNote] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !currentUser) return;

    try {
      await addNote({
        content: newNote,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || 'Unknown',
        createdAt: new Date().toISOString()
      });
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h3 className="font-medium text-gray-900">Notes & Feedback</h3>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {notes.map((note, index) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-4 rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">{note.authorName}</span>
              <span className="text-sm text-gray-500">
                {new Date(note.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-600 whitespace-pre-wrap">{note.content}</p>
          </motion.div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
        <div className="relative">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={3}
          />
          <button
            type="submit"
            disabled={!newNote.trim()}
            className="absolute right-2 bottom-2 p-2 text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
import React from 'react';
import { motion } from 'framer-motion';

const emotions = [
  { emoji: "😢", color: "bg-red-400", label: "Terrible" },
  { emoji: "😕", color: "bg-orange-400", label: "Not great" },
  { emoji: "😐", color: "bg-yellow-400", label: "Okay" },
  { emoji: "🙂", color: "bg-green-400", label: "Good" },
  { emoji: "😊", color: "bg-emerald-400", label: "Great" },
];

export const CheckInSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl bg-white p-8 shadow-lg"
    >
      <h3 className="text-2xl font-semibold text-black">Check-in</h3>
      <p className="mt-2 text-lg text-[#33292c]">How are you feeling today?</p>
      
      <div className="mt-6 flex justify-between gap-4">
        {emotions.map((emotion) => (
          <motion.button
            key={emotion.label}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="group flex flex-col items-center"
          >
            <div className={`h-12 w-12 rounded-full ${emotion.color} flex items-center justify-center text-2xl transition-transform group-hover:scale-110`}>
              {emotion.emoji}
            </div>
            <span className="mt-2 text-sm text-[#33292c] group-hover:text-accent-teal">
              {emotion.label}
            </span>
          </motion.button>
        ))}
      </div>

      <div className="mt-8">
        <label htmlFor="gratitude" className="block text-lg font-medium text-black">
          What's something you're grateful for today?
        </label>
        <textarea
          id="gratitude"
          rows={3}
          className="mt-2 w-full rounded-xl bg-[#f6efef] p-4 text-black placeholder-[#81635d] focus:outline-none focus:ring-2 focus:ring-accent-teal"
          placeholder="Write something you appreciate..."
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-6 w-full rounded-xl bg-accent-teal py-4 text-lg font-semibold text-primary transition-colors hover:bg-accent-teal/90"
      >
        Next
      </motion.button>
    </motion.div>
  );
};

export default CheckInSection;

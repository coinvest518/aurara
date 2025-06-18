import React from 'react';

const moods = [
  { key: 'happy', label: 'Happy', emoji: '😊', color: 'bg-emerald-400' },
  { key: 'motivated', label: 'Motivated', emoji: '🙂', color: 'bg-green-400' },
  { key: 'stressed', label: 'Stressed', emoji: '😕', color: 'bg-orange-400' },
  { key: 'sad', label: 'Sad', emoji: '😢', color: 'bg-red-400' },
  { key: 'tired', label: 'Tired', emoji: '😐', color: 'bg-yellow-400' },
] as const;

export interface MoodOption {
  key: typeof moods[number]['key'];
  label: string;
  emoji: string;
  color: string;
}

interface MoodTrackerProps {
  selectedMood: MoodOption['key'];
  onSelectMood: (mood: MoodOption['key']) => void;
}

export const MoodTracker: React.FC<MoodTrackerProps> = ({ selectedMood, onSelectMood }) => (
  <div className="flex justify-between gap-4 w-full max-w-md mx-auto py-2">
    {moods.map((mood) => (
      <button
        key={mood.key}
        className={`group flex flex-col items-center focus:outline-none`}
        onClick={() => onSelectMood(mood.key)}
        type="button"
      >
        <div className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl transition-transform border-2 ${mood.color} ${selectedMood === mood.key ? 'scale-110 border-black shadow-lg' : 'border-transparent opacity-80 group-hover:opacity-100'}`}>
          {mood.emoji}
        </div>
        <span className={`mt-2 text-sm ${selectedMood === mood.key ? 'text-black font-bold' : 'text-slate-400 group-hover:text-black'}`}>{mood.label}</span>
      </button>
    ))}
  </div>
);

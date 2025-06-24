"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Star, Clock, Users } from "lucide-react";

interface TherapyPersona {
  id: string;
  name: string;
  title: string;
  specialty: string;
  experience: string;
  rating: number;
  sessions: number;
  image: string;
  description: string;
  approach: string[];
  availability: string;
}

const therapyPersonas: TherapyPersona[] = [
  {
    id: "1",
    name: "Charlie",
    title: "Licensed Clinical Psychologist",
    specialty: "Anxiety & Depression",
    experience: "8 years",
    rating: 4.9,
    sessions: 1200,
    image: "/assets/avatars/charlie.png",
    description:
      "Specializing in cognitive behavioral therapy with a warm, empathetic approach. I help clients develop practical coping strategies for anxiety and depression.",
    approach: ["CBT", "Mindfulness", "Solution-Focused"],
    availability: "24/7 Available",
  },
  {
    id: "2",
    name: "Sarah",
    title: "Marriage & Family Therapist",
    specialty: "Couples & Family Therapy",
    experience: "12 years",
    rating: 4.8,
    sessions: 2100,
    image: "/assets/avatars/AI%20Interviewer.png",
    description:
      "Helping couples and families build stronger relationships through evidence-based therapeutic techniques and compassionate guidance.",
    approach: ["EFT", "Gottman Method", "Family Systems"],
    availability: "24/7 Available",
  },
  {
    id: "3",
    name: "Lovinka",
    title: "Trauma Specialist",
    specialty: "PTSD & Trauma Recovery",
    experience: "10 years",
    rating: 4.9,
    sessions: 1800,
    image: "/assets/avatars/History%20Teacher.png",
    description:
      "Specialized in trauma-informed care using EMDR and somatic approaches to help clients heal from traumatic experiences.",
    approach: ["EMDR", "Somatic Therapy", "CPT"],
    availability: "24/7 Available",
  },
  {
    id: "4",
    name: "Danny",
    title: "Addiction Counselor",
    specialty: "Substance Abuse & Recovery",
    experience: "15 years",
    rating: 4.7,
    sessions: 2500,
    image: "/assets/avatars/danny.png",
    description:
      "Supporting individuals on their recovery journey with personalized treatment plans and ongoing support for lasting sobriety.",
    approach: ["12-Step", "Motivational Interviewing", "Relapse Prevention"],
    availability: "24/7 Available",
  },
  {
    id: "5",
    name: "Kiki",
    title: "Child Psychologist",
    specialty: "Child & Adolescent Therapy",
    experience: "9 years",
    rating: 4.8,
    sessions: 1400,
    image: "/assets/avatars/Kiki.png",
    description:
      "Creating a safe, playful environment where children and teens can express themselves and develop healthy coping skills.",
    approach: ["Play Therapy", "Art Therapy", "CBT for Kids"],
    availability: "24/7 Available",
  },
];

interface CompanionCarouselProps {
  onClose: () => void;
}

export default function CompanionCarousel({ onClose }: CompanionCarouselProps) {
  const [selectedPersona, setSelectedPersona] = useState<TherapyPersona | null>(null);

  return (
    <div className="w-full py-8">
      {/* Close button for the main carousel modal */}
      <button
        className="absolute top-4 right-4 z-50 bg-white/90 hover:bg-white rounded-full p-2 text-gray-700 shadow"
        onClick={onClose}
        aria-label="Close"
        style={{ position: 'fixed' }}
      >
        <X className="w-5 h-5" />
      </button>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Choose Your Therapy Specialist</h2>
        <p className="text-muted-foreground">Find the right therapist for your unique needs</p>
      </div>
      {/* Horizontal Scrolling Carousel */}
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto pb-4 px-4 scrollbar-hide">
          {therapyPersonas.map((persona, index) => (
            <motion.div
              key={persona.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-80 cursor-pointer"
              onClick={() => setSelectedPersona(persona)}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="bg-white rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img
                    src={persona.image}
                    alt={persona.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-white/90 text-yellow-600 border border-yellow-200">
                      <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {persona.rating}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-1">{persona.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{persona.title}</p>
                  <div className="mb-4">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 mb-2">
                      {persona.specialty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {persona.experience}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {persona.sessions}+ sessions
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <button className="px-3 py-1 rounded bg-accent-teal text-white font-semibold hover:bg-accent-teal/90 text-xs">View Profile</button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Modal Popup */}
      <AnimatePresence>
        {selectedPersona && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={onClose} // Use onClose to close the modal
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedPersona.image}
                  alt={selectedPersona.name}
                  className="w-full h-64 object-cover rounded-t-xl"
                />
                <button
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 text-gray-700"
                  onClick={onClose} // Use onClose to close the modal
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{selectedPersona.name}</h2>
                    <p className="text-muted-foreground mb-2">{selectedPersona.title}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                        {selectedPersona.rating} rating
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {selectedPersona.sessions}+ sessions
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {selectedPersona.experience} experience
                      </div>
                    </div>
                  </div>
                  <button className="rounded-full p-2 text-gray-400 hover:text-red-500" aria-label="Favorite">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
                <div className="mb-6">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 mb-4">
                    {selectedPersona.specialty}
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{selectedPersona.description}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-2">Therapeutic Approaches</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPersona.approach.map((approach) => (
                        <span key={approach} className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-accent-teal/10 text-accent-teal border border-accent-teal/20">
                          {approach}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Availability</h3>
                    <p className="text-muted-foreground">{selectedPersona.availability}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Inline style for scrollbar-hide utility */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

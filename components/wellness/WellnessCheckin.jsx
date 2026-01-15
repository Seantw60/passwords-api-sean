import { useState } from 'react';
import { useAuth } from '../../App';
import { Heart, Activity, FileText, TrendingUp } from 'lucide-react';

export function WellnessCheckin() {
  const { user } = useAuth();
  const [mood, setMood] = useState('');
  const [stress, setStress] = useState(5);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const moods = [
    { id: 'excellent', label: 'Excellent', emoji: '😄' },
    { id: 'good', label: 'Good', emoji: '🙂' },
    { id: 'okay', label: 'Okay', emoji: '😐' },
    { id: 'low', label: 'Low', emoji: '😔' },
    { id: 'difficult', label: 'Difficult', emoji: '😞' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setMood('');
      setStress(5);
      setNotes('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6" />
            <h1 className="text-3xl font-bold text-neutral-900">Wellness Check-In</h1>
          </div>
          <p className="text-neutral-600">
            Track your mental and emotional well-being. All entries are private and visible only to you.
          </p>
          <div className="mt-4 p-4 bg-neutral-100 border-2 border-neutral-300">
            <p className="text-sm text-neutral-700">
              <strong>Privacy Notice:</strong> Your wellness data is completely private. Only you can see your entries.
              Aggregated, anonymized trends may be shown to administrators for overall team wellness insights.
            </p>
          </div>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            {/* Mood Selector */}
            <div className="bg-white border-2 border-neutral-300 p-8 mb-6">
              <h2 className="font-bold text-xl mb-6">How are you feeling today?</h2>
              <div className="grid grid-cols-5 gap-4">
                {moods.map((moodOption) => (
                  <button
                    key={moodOption.id}
                    type="button"
                    onClick={() => setMood(moodOption.id)}
                    className={`p-6 border-2 transition-colors ${
                      mood === moodOption.id
                        ? 'border-neutral-900 bg-neutral-100'
                        : 'border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="text-4xl mb-2">{moodOption.emoji}</div>
                    <div className="font-medium">{moodOption.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stress Level */}
            <div className="bg-white border-2 border-neutral-300 p-8 mb-6">
              <h2 className="font-bold text-xl mb-6">Stress Level</h2>
              <div className="mb-6">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={stress}
                  onChange={(e) => setStress(parseInt(e.target.value))}
                  className="w-full h-2 bg-neutral-300 appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-neutral-600 mt-2">
                  <span>1 (Low)</span>
                  <span className="font-bold text-xl">{stress}</span>
                  <span>10 (High)</span>
                </div>
              </div>
              <div className="grid grid-cols-10 gap-2">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-8 ${
                      i < stress ? 'bg-neutral-900' : 'bg-neutral-200'
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white border-2 border-neutral-300 p-8 mb-6">
              <h2 className="font-bold text-xl mb-6">Additional Notes (Optional)</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share any thoughts, concerns, or reflections about your day..."
                className="w-full px-4 py-3 border-2 border-neutral-300 focus:border-neutral-500 focus:outline-none min-h-[150px]"
              />
              <p className="text-sm text-neutral-600 mt-2">
                These notes are private and only visible to you.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!mood}
              className="px-8 py-4 bg-neutral-900 text-white font-medium hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Check-In
            </button>
          </form>
        ) : (
          <div className="bg-white border-2 border-neutral-300 p-12 text-center">
            <div className="w-16 h-16 bg-neutral-300 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-4">Check-In Recorded</h2>
            <p className="text-neutral-600">
              Thank you for taking the time to check in. Your wellness matters.
            </p>
          </div>
        )}

        {/* Personal History */}
        <div className="mt-8 bg-white border-2 border-neutral-300 p-8">
          <h2 className="font-bold text-xl mb-6">Your Wellness History</h2>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-neutral-50 border-2 border-neutral-300">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5 text-neutral-500" />
                <span className="text-sm text-neutral-600">Total Check-Ins</span>
              </div>
              <div className="text-3xl font-bold">24</div>
            </div>
            <div className="p-6 bg-neutral-50 border-2 border-neutral-300">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-5 h-5 text-neutral-500" />
                <span className="text-sm text-neutral-600">Avg Mood</span>
              </div>
              <div className="text-3xl font-bold">Good 🙂</div>
            </div>
            <div className="p-6 bg-neutral-50 border-2 border-neutral-300">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-neutral-500" />
                <span className="text-sm text-neutral-600">Avg Stress</span>
              </div>
              <div className="text-3xl font-bold">4.8/10</div>
            </div>
          </div>

          {/* Recent Entries */}
          <h3 className="font-medium mb-4">Recent Entries</h3>
          <div className="space-y-4">
            {[
              { date: '2026-01-13', mood: '🙂 Good', stress: 4 },
              { date: '2026-01-12', mood: '😄 Excellent', stress: 3 },
              { date: '2026-01-11', mood: '😐 Okay', stress: 6 },
              { date: '2026-01-10', mood: '🙂 Good', stress: 5 },
            ].map((entry, i) => (
              <div key={i} className="p-4 bg-neutral-50 border-2 border-neutral-300 flex items-center justify-between">
                <div>
                  <div className="font-medium">{entry.date}</div>
                  <div className="text-sm text-neutral-600 mt-1">Mood: {entry.mood}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-neutral-600">Stress Level</div>
                  <div className="font-bold">{entry.stress}/10</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Trends (if admin) */}
        {user?.role === 'admin' && (
          <div className="mt-8 bg-white border-2 border-neutral-300 p-8">
            <h2 className="font-bold text-xl mb-4">Team Wellness Trends (Admin View)</h2>
            <p className="text-sm text-neutral-600 mb-6">
              Anonymized aggregated data from all team members
            </p>
            <div className="grid grid-cols-3 gap-6">
              <div className="p-6 bg-neutral-50 border-2 border-neutral-300">
                <div className="text-sm text-neutral-600 mb-2">Participation Rate</div>
                <div className="text-3xl font-bold">78%</div>
              </div>
              <div className="p-6 bg-neutral-50 border-2 border-neutral-300">
                <div className="text-sm text-neutral-600 mb-2">Team Avg Mood</div>
                <div className="text-3xl font-bold">Good 🙂</div>
              </div>
              <div className="p-6 bg-neutral-50 border-2 border-neutral-300">
                <div className="text-sm text-neutral-600 mb-2">Team Avg Stress</div>
                <div className="text-3xl font-bold">5.2/10</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

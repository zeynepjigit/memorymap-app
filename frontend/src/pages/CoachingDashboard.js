import React, { useState, useEffect } from 'react';
import { analyticsEvents } from '../services/analytics';

const CoachingDashboard = () => {
  const [coachingData, setCoachingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    fetchCoachingData();
    analyticsEvents.pageView('coaching_dashboard');
  }, [timeRange]);

  const fetchCoachingData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      // Mock veri - gerçek implementasyonda backend'den çekilecek
      setTimeout(() => {
        setCoachingData({
          overview: {
            totalSessions: 24,
            questionsAnswered: 156,
            averageResponseLength: 87,
            streakDays: 12,
            lastSessionDate: '2024-01-15'
          },
          progress: {
            selfAwareness: 78,
            emotionalIntelligence: 65,
            goalClarity: 82,
            resilience: 71,
            overallGrowth: 74
          },
          recentQuestions: [
            {
              id: 1,
              question: "What patterns do you notice in your emotional responses this week?",
              response: "I've noticed I tend to feel more anxious on Monday mornings...",
              date: '2024-01-15',
              category: 'emotional_awareness'
            },
            {
              id: 2,
              question: "How did you handle the challenging situation you wrote about?",
              response: "I took a step back and tried to see it from different perspectives...",
              date: '2024-01-14',
              category: 'problem_solving'
            },
            {
              id: 3,
              question: "What are you most grateful for in your recent experiences?",
              response: "I'm grateful for the support of my family and friends...",
              date: '2024-01-13',
              category: 'gratitude'
            }
          ],
          insights: [
            {
              type: 'strength',
              title: 'Strong Self-Reflection',
              description: 'You consistently provide thoughtful, detailed responses to reflective questions.',
              impact: 'This shows high emotional intelligence and self-awareness.'
            },
            {
              type: 'growth',
              title: 'Improving Resilience',
              description: 'Your responses show increasing ability to bounce back from challenges.',
              impact: 'You\'re developing stronger coping mechanisms over time.'
            },
            {
              type: 'opportunity',
              title: 'Goal Setting Focus',
              description: 'Consider spending more time on forward-looking, goal-oriented questions.',
              impact: 'This could help translate insights into actionable plans.'
            }
          ],
          categoryBreakdown: {
            'emotional_awareness': 35,
            'problem_solving': 28,
            'gratitude': 22,
            'goal_setting': 18,
            'relationships': 25,
            'personal_growth': 28
          },
          weeklyActivity: [
            { week: 'Week 1', questions: 8, responses: 8 },
            { week: 'Week 2', questions: 12, responses: 11 },
            { week: 'Week 3', questions: 10, responses: 10 },
            { week: 'Week 4', questions: 15, responses: 14 }
          ]
        });
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching coaching data:', error);
      setLoading(false);
    }
  };

  const getProgressColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    return '#dc3545';
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'strength': return '💪';
      case 'growth': return '📈';
      case 'opportunity': return '🎯';
      default: return '💡';
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading your coaching insights...</div>
      </div>
    );
  }

  if (!coachingData) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h2>🤖 Start Your Coaching Journey</h2>
          <p>Begin answering reflective questions to see your personal growth insights here.</p>
          <button className="btn btn-primary">
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 className="page-title">🧠 Coaching Analytics</h1>
          <p className="page-subtitle">Track your personal growth and self-reflection journey</p>
        </div>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(parseInt(e.target.value))}
          className="form-control"
          style={{ width: 'auto' }}
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 3 months</option>
          <option value={365}>Last year</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="card">
        <h2>📊 Overview</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>
              {coachingData.overview.totalSessions}
            </div>
            <div>Coaching Sessions</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
              {coachingData.overview.questionsAnswered}
            </div>
            <div>Questions Answered</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107' }}>
              {coachingData.overview.averageResponseLength}
            </div>
            <div>Avg. Response Length</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e91e63' }}>
              {coachingData.overview.streakDays}
            </div>
            <div>Day Streak</div>
          </div>
        </div>
      </div>

      {/* Progress Tracking */}
      <div className="card">
        <h2>📈 Personal Growth Progress</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {Object.entries(coachingData.progress).map(([area, score]) => (
            <div key={area} style={{ textAlign: 'center' }}>
              <h4 style={{ textTransform: 'capitalize', marginBottom: '10px' }}>
                {area.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              <div style={{ 
                width: '100px', 
                height: '100px', 
                borderRadius: '50%', 
                background: `conic-gradient(${getProgressColor(score)} ${score * 3.6}deg, #e9ecef 0deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {score}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="card">
        <h2>💡 AI Insights</h2>
        <div style={{ display: 'grid', gap: '15px' }}>
          {coachingData.insights.map((insight, index) => (
            <div key={index} style={{ 
              padding: '15px', 
              border: '1px solid #e9ecef', 
              borderRadius: '8px',
              backgroundColor: '#f8f9fa'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '24px', marginRight: '10px' }}>
                  {getInsightIcon(insight.type)}
                </span>
                <h4 style={{ margin: 0 }}>{insight.title}</h4>
              </div>
              <p style={{ margin: '5px 0', color: '#666' }}>{insight.description}</p>
              <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', color: '#28a745' }}>
                💡 {insight.impact}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Questions */}
      <div className="card">
        <h2>🤔 Recent Reflective Questions</h2>
        <div style={{ display: 'grid', gap: '15px' }}>
          {coachingData.recentQuestions.map(question => (
            <div key={question.id} style={{ 
              padding: '15px', 
              border: '1px solid #e9ecef', 
              borderRadius: '8px' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ 
                  backgroundColor: '#007bff', 
                  color: 'white', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px' 
                }}>
                  {question.category.replace('_', ' ')}
                </span>
                <span style={{ color: '#666', fontSize: '14px' }}>{question.date}</span>
              </div>
              <h4 style={{ marginBottom: '10px' }}>{question.question}</h4>
              <p style={{ 
                color: '#666', 
                fontStyle: 'italic',
                backgroundColor: '#f8f9fa',
                padding: '10px',
                borderRadius: '4px',
                borderLeft: '4px solid #007bff'
              }}>
                "{question.response.substring(0, 100)}..."
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card">
          <h2>📋 Question Categories</h2>
          <div style={{ display: 'grid', gap: '10px' }}>
            {Object.entries(coachingData.categoryBreakdown).map(([category, count]) => (
              <div key={category} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ textTransform: 'capitalize' }}>
                  {category.replace('_', ' ')}
                </span>
                <span style={{ 
                  backgroundColor: '#007bff', 
                  color: 'white', 
                  padding: '2px 8px', 
                  borderRadius: '12px',
                  fontSize: '12px'
                }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>📅 Weekly Activity</h2>
          <div style={{ display: 'grid', gap: '10px' }}>
            {coachingData.weeklyActivity.map(week => (
              <div key={week.week} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{week.week}</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    {week.responses}/{week.questions} answered
                  </span>
                  <div style={{ 
                    width: '50px', 
                    height: '8px', 
                    backgroundColor: '#e9ecef', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${(week.responses / week.questions) * 100}%`, 
                      height: '100%', 
                      backgroundColor: '#28a745' 
                    }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="card">
        <h2>🎯 Next Steps</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary">
            📝 Answer New Questions
          </button>
          <button className="btn btn-secondary">
            📊 View Detailed Report
          </button>
          <button className="btn btn-secondary">
            🎯 Set Growth Goals
          </button>
          <button className="btn btn-secondary">
            📧 Share Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoachingDashboard; 
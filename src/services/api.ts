const BASE_URL = 'https://learning-platform-1euu.onrender.com/api/v1/student/games';
const GAME_ID = 10;

export interface BackendQuestion {
  id: number;
  question: string;
  options: any[];
  correctAnswer: string;
  points: number;
  timeLimit: number;
  order: number;
  hint?: string;
  imageUrl?: string;
}

export interface SubmitAnswerPayload {
  questionId: number;
  selectedAnswer: string;
  timeTaken: number;
}

export const fetchQuestions = async (lessonId: string, token: string): Promise<BackendQuestion[]> => {
  const response = await fetch(`${BASE_URL}/${GAME_ID}/questions?lessonId=${lessonId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch questions');
  }

  const data = await response.json();
  if (data.success && data.data && data.data.questions) {
    return data.data.questions;
  }
  return [];
};

export const startSession = async (lessonId: string, token: string): Promise<string> => {
  const response = await fetch(`${BASE_URL}/${GAME_ID}/sessions?lessonId=${lessonId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to start session');
  }

  const data = await response.json();
  if (data.success && data.data && data.data.id) {
    return data.data.id;
  }
  throw new Error('Invalid session response');
};

export const submitAnswers = async (sessionId: string, token: string, answers: SubmitAnswerPayload[]): Promise<void> => {
  // Ensure we send at least a dummy answer if array is empty (backend validation requirement)
  const payload = answers.length > 0 ? answers : [{ questionId: 0, selectedAnswer: 'N/A', timeTaken: 0 }];

  const response = await fetch(`${BASE_URL}/sessions/${sessionId}/submit-answers`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ answers: payload })
  });

  if (!response.ok) {
    throw new Error('Failed to submit answers');
  }
};

export const completeSession = async (sessionId: string, token: string): Promise<any> => {
  const response = await fetch(`${BASE_URL}/sessions/${sessionId}/complete`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to complete session');
  }

  const data = await response.json();
  if (data.success && data.data) {
    return data.data;
  }
  throw new Error('Invalid complete session response');
};

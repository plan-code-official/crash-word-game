const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://learning-platform-1euu.onrender.com';
const BASE_URL = `${API_URL}/api/v1`;
const GAME_ID = 10;

let latestToken: string | null = null;
let isNonStudentAuth = false;
let refreshPromise: Promise<string | null> | null = null;

export const getIsNonStudentAuth = (): boolean => isNonStudentAuth;

export const refreshAccessToken = async (): Promise<string | null> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      let isStudentSuccess = false;
      let refreshRes = await fetch(`${BASE_URL}/student/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: "{}"
      });

      if (refreshRes.ok) {
        isStudentSuccess = true;
      } else {
        refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: "{}"
        });
      }

      if (refreshRes.ok) {
        // If /auth/refresh succeeded without error (not student endpoint)
        isNonStudentAuth = !isStudentSuccess;

        const refreshData = await refreshRes.json();
        const newToken = refreshData?.data?.accessToken || refreshData?.data?.token || refreshData?.accessToken || refreshData?.token;
        if (newToken) {
          console.log(`Token refreshed successfully (${isNonStudentAuth ? 'non-student/supervisor' : 'student'}).`);
          latestToken = newToken;

          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.has('token')) urlParams.set('token', newToken);
          if (urlParams.has('accesstoken')) urlParams.set('accesstoken', newToken);
          const newUrl = window.location.pathname + '?' + urlParams.toString();
          window.history.replaceState(null, '', newUrl);

          return newToken;
        }
      } else {
        console.error("Token refresh failed on both endpoints with status", refreshRes.status);
      }
    } catch (err) {
      console.error("Error during token refresh", err);
    } finally {
      refreshPromise = null;
    }
    return null;
  })();

  return refreshPromise;
};

const apiFetch = async (url: string, options: RequestInit = {}, initialToken: string | null = null) => {
  if (!latestToken && initialToken) {
    latestToken = initialToken;
  }
  if (!latestToken && !initialToken) {
    await refreshAccessToken();
  }

  const currentToken = latestToken || initialToken;
  const fetchOptions = { ...options };
  if (currentToken) {
    fetchOptions.headers = { ...(fetchOptions.headers || {}), Authorization: `Bearer ${currentToken}` };
  }

  let res = await fetch(url, fetchOptions);

  if (res.status === 401) {
    console.warn("401 Unauthorized encountered. Attempting to refresh token...");
    const newToken = await refreshAccessToken();
    if (newToken) {
      fetchOptions.headers = { ...(fetchOptions.headers || {}), Authorization: `Bearer ${newToken}` };
      res = await fetch(url, fetchOptions);
    }
  }
  
  return res;
};

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
  audioUrl?: string | null;
}

export interface SubmitAnswerPayload {
  questionId: number;
  selectedAnswer: string;
  timeTaken: number;
}

export const fetchQuestions = async (lessonId: string, token: string): Promise<BackendQuestion[]> => {
  const response = await apiFetch(`${BASE_URL}/student/games/${GAME_ID}/questions?lessonId=${lessonId}`, {}, token);
  
  if (!response.ok) {
    throw new Error('Failed to fetch questions');
  }

  const data = await response.json();
  if (data.success && data.data && data.data.questions) {
    return data.data.questions;
  }
  return [];
};

export const startSession = async (lessonId: string, token: string): Promise<{ sessionId: string, coins: number }> => {
  const response = await apiFetch(`${BASE_URL}/student/games/${GAME_ID}/sessions?lessonId=${lessonId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }, token);

  if (!response.ok) {
    throw new Error('Failed to start session');
  }

  const data = await response.json();
  if (data.success && data.data && data.data.id) {
    return {
      sessionId: data.data.id,
      coins: typeof data.data.coins === 'number' ? data.data.coins : 0
    };
  }
  throw new Error('Invalid session response');
};

export const submitAnswers = async (sessionId: string, token: string, answers: SubmitAnswerPayload[]): Promise<void> => {
  // Ensure we send at least a dummy answer if array is empty (backend validation requirement)
  const payload = answers.length > 0 ? answers : [{ questionId: 0, selectedAnswer: 'N/A', timeTaken: 0 }];

  const response = await apiFetch(`${BASE_URL}/student/games/sessions/${sessionId}/submit-answers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ answers: payload })
  }, token);

  if (!response.ok) {
    throw new Error('Failed to submit answers');
  }
};

export const completeSession = async (sessionId: string, token: string, coinsUsed: number = 0): Promise<any> => {
  const response = await apiFetch(`${BASE_URL}/student/games/sessions/${sessionId}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ coinsUsed })
  }, token);

  if (!response.ok) {
    throw new Error('Failed to complete session');
  }

  const data = await response.json();
  if (data.success && data.data) {
    return data.data;
  }
  throw new Error('Invalid complete session response');
};

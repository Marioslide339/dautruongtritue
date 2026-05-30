import { Question } from './questions';

// MỚI: Google Sheets API URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwMlQ5dwnfC-01-WoShMLi4gAT9A2go6JU5gcP6mARVZuVb_GD35dEqiAw-8L0Yc7oS/exec";

export const submitToGlobalLeaderboard = async (payload: any): Promise<string | null> => {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "save_score",
        data: payload
      })
    });
    const result = await response.json();
    if (result.status === "success") {
      return "SUCCESS_ID";
    } else {
      console.error("Sheets Error:", result.error);
      return null;
    }
  } catch (error) {
    console.error("Lỗi gửi điểm lên Google Sheets: ", error);
    return null;
  }
};

export const getGlobalLeaderboard = async (): Promise<any[]> => {
  try {
    const response = await fetch(SCRIPT_URL);
    if (!response.ok) throw new Error("Network error");
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
  } catch (error) {
    console.error("Lỗi lấy điểm từ Google Sheets: ", error);
    return [];
  }
};

export const uploadQuestionToFirebase = async (questionData: Partial<Question>): Promise<string | null> => {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "save_question",
        data: questionData
      })
    });
    const result = await response.json();
    if (result.status === "success") {
      return "SUCCESS_ID";
    } else {
      console.error("Sheets Error:", result.error);
      return null;
    }
  } catch (error) {
    console.error("Lỗi gửi câu hỏi lên Google Sheets: ", error);
    return null;
  }
};

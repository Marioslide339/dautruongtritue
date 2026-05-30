import { Question } from './questions';

// MỚI: Google Sheets API URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwMlQ5dwnfC-01-WoShMLi4gAT9A2go6JU5gcP6mARVZuVb_GD35dEqiAw-8L0Yc7oS/exec";

export const submitToGlobalLeaderboard = async (payload: any): Promise<string | null> => {
  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", // Bỏ qua lỗi CORS redirect của Google Apps Script
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "save_score",
        data: payload
      })
    });
    // Với no-cors, response luôn là opaque, không đọc được body. Mặc định coi như thành công.
    return "SUCCESS_ID";
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
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: "save_question",
        data: questionData
      })
    });
    return "SUCCESS_ID";
  } catch (error) {
    console.error("Lỗi gửi câu hỏi lên Google Sheets: ", error);
    return null;
  }
};

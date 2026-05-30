export interface Question {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
  category: string;
  explanation: string;
}

export interface UserSession {
  fullName: string;
  className: string;
  schoolName: string;
  score: number; // number of correct answers
  totalQuestions: number;
  timeSpent: number; // in seconds
  timestamp: string;
  isSubmittedToSheet: boolean;
}

export interface LeaderboardEntry {
  id: string;
  fullName: string;
  className: string;
  schoolName: string;
  score: number;
  timeSpent: number;
  timestamp: string;
}

export const CATEGORIES = {
  THUOC_LA: "Tác hại của Thuốc lá 🚬",
  RUOU_BIA: "Tác hại của Rượu bia 🍺",
  MA_TUY: "Hiểm họa Ma túy 🚫",
  KY_NANG: "Kỹ năng Phòng tránh 🛡️"
};

export const QUESTIONS_BANK: Question[] = [
  // --- THUỐC LÁ ---
  {
    id: 1,
    question: "Khói thuốc lá có chứa chất gì làm hại phổi của chúng ta?",
    options: ["Vitamin C", "Chất độc (như Ni-cô-tin)", "Đường ngọt", "Nước tinh khiết"],
    answerIndex: 1,
    category: CATEGORIES.THUOC_LA,
    explanation: "Khói thuốc lá chứa hàng nghìn chất độc hại, đặc biệt là Ni-cô-tin làm hỏng phổi và gây nghiện."
  },
  {
    id: 2,
    question: "Khi thấy người lớn hút thuốc lá gần mình, em nên làm gì?",
    options: ["Đứng lại gần để ngửi", "Khuyên người lớn đừng hút hoặc đi ra chỗ khác", "Xin hút thử", "Không quan tâm"],
    answerIndex: 1,
    category: CATEGORIES.THUOC_LA,
    explanation: "Hít phải khói thuốc lá của người khác (hút thuốc thụ động) cũng rất có hại. Em nên đi ra chỗ khác và khuyên người lớn bỏ thuốc nhé!"
  },
  {
    id: 3,
    question: "Hút thuốc lá sẽ làm cho răng của chúng ta trở nên như thế nào?",
    options: ["Trắng sáng và thơm tho", "Ố vàng và hơi thở có mùi hôi", "Răng sẽ mọc nhanh hơn", "Không bị ảnh hưởng gì"],
    answerIndex: 1,
    category: CATEGORIES.THUOC_LA,
    explanation: "Chất bẩn trong khói thuốc lá sẽ bám vào răng làm răng bị ố vàng, dễ sâu răng và khiến hơi thở rất hôi."
  },
  {
    id: 4,
    question: "Thuốc lá điện tử có an toàn cho trẻ em không?",
    options: ["Có, vì nó có mùi thơm trái cây", "Có, vì nó không có khói thật", "Không, nó chứa rất nhiều hóa chất độc hại gây bệnh", "Nó giúp các bé học giỏi hơn"],
    answerIndex: 2,
    category: CATEGORIES.THUOC_LA,
    explanation: "Thuốc lá điện tử chứa rất nhiều hóa chất độc hại làm hỏng não bộ và phổi của trẻ em, dù nó có mùi thơm dễ đánh lừa."
  },
  
  // --- RƯỢU BIA ---
  {
    id: 5,
    question: "Uống rượu bia sẽ làm cho bộ não của chúng ta bị làm sao?",
    options: ["Thông minh hơn", "Tính toán nhanh hơn", "Hoạt động chậm lại, không làm chủ được bản thân", "Giúp ngủ ngon hơn mãi mãi"],
    answerIndex: 2,
    category: CATEGORIES.RUOU_BIA,
    explanation: "Chất cồn trong rượu bia đi vào não bộ khiến con người bị say xỉn, mất kiểm soát và không nhận thức được hành động của mình."
  },
  {
    id: 6,
    question: "Tại sao trẻ em lại tuyệt đối KHÔNG ĐƯỢC uống rượu bia?",
    options: ["Vì rượu bia làm cản trở sự phát triển của cơ thể và não bộ", "Vì rượu bia rất đắt tiền", "Vì rượu bia chỉ dành cho người già", "Vì uống vào sẽ mọc râu"],
    answerIndex: 0,
    category: CATEGORIES.RUOU_BIA,
    explanation: "Cơ thể trẻ em đang lớn, uống rượu bia sẽ làm hỏng não, dạ dày và các cơ quan, khiến cơ thể chậm phát triển."
  },
  {
    id: 7,
    question: "Người uống nhiều rượu bia rồi lái xe trên đường sẽ có nguy cơ gì?",
    options: ["Lái xe nhanh và an toàn hơn", "Gây tai nạn giao thông nguy hiểm", "Được mọi người khen ngợi", "Xe sẽ tự động đi về nhà"],
    answerIndex: 1,
    category: CATEGORIES.RUOU_BIA,
    explanation: "Người say xỉn không thể nhìn rõ đường và phản xạ rất chậm, cực kỳ dễ gây ra tai nạn giao thông thương tâm."
  },
  {
    id: 8,
    question: "Khi có người ép em uống thử một ngụm bia, em nên phản ứng thế nào?",
    options: ["Uống thử một ít cho biết", "Từ chối dứt khoát: 'Cháu là trẻ em, cháu không uống đâu ạ!'", "Mang đi cất đi", "Giận dỗi bỏ khóc"],
    answerIndex: 1,
    category: CATEGORIES.RUOU_BIA,
    explanation: "Em hãy thật dũng cảm và lịch sự từ chối dứt khoát nhé. Rượu bia là chất độc với cơ thể trẻ em!"
  },

  // --- MA TÚY ---
  {
    id: 9,
    question: "Ma túy là gì?",
    options: ["Là một loại thuốc bổ giúp thông minh", "Là một loại bánh kẹo ngọt", "Là chất cực độc, gây nghiện và phá hủy hoàn toàn cuộc sống con người", "Là một loại nước giải khát"],
    answerIndex: 2,
    category: CATEGORIES.MA_TUY,
    explanation: "Ma túy là một chất độc kinh khủng. Ai dính vào ma túy sẽ bị nghiện, hỏng cơ thể, mất trí nhớ và phá hoại gia đình."
  },
  {
    id: 10,
    question: "Nếu có người lạ mặt rủ em ăn thử một viên kẹo có màu sắc sặc sỡ nhưng em chưa từng thấy bao giờ, em sẽ làm gì?",
    options: ["Xin và ăn ngay", "Cất vào túi mang về nhà ăn", "Tuyệt đối không nhận, chạy đi báo ngay cho bố mẹ hoặc thầy cô", "Mời bạn bè cùng ăn"],
    answerIndex: 2,
    category: CATEGORIES.MA_TUY,
    explanation: "Ma túy hiện nay được giấu tinh vi dưới hình thức kẹo ngọt. Tuyệt đối không nhận đồ ăn uống từ người lạ nhé!"
  },
  {
    id: 11,
    question: "Bạn bè kể về một loại tem giấy ngậm vào miệng sẽ thấy ảo giác vui vẻ. Em nghĩ loại tem giấy đó là gì?",
    options: ["Đồ chơi ảo thuật", "Một dạng ma túy cực kỳ nguy hiểm (Ma túy tem giấy)", "Kẹo ngậm ho", "Thuốc bổ não"],
    answerIndex: 1,
    category: CATEGORIES.MA_TUY,
    explanation: "Đó là một loại ma túy cực độc có tên là 'Tem giấy' hoặc 'Bùa lưỡi'. Nó gây ảo giác và làm hỏng não bộ người dùng ngay lập tức."
  },

  // --- KỸ NĂNG PHÒNG TRÁNH ---
  {
    id: 12,
    question: "Số điện thoại nào là Tổng đài Quốc gia bảo vệ trẻ em, em có thể gọi để cầu cứu khi gặp nguy hiểm?",
    options: ["111", "113", "114", "115"],
    answerIndex: 0,
    category: CATEGORIES.KY_NANG,
    explanation: "111 là số Tổng đài điện thoại quốc gia bảo vệ trẻ em, gọi hoàn toàn miễn phí nhé!"
  },
  {
    id: 13,
    question: "Theo em, cách tốt nhất để bảo vệ mình khỏi thuốc lá, ma túy, rượu bia là gì?",
    options: ["Thử một lần cho biết rồi bỏ", "Hiểu biết về tác hại của chúng và tránh xa ngay từ đầu", "Chơi thân với người nghiện để khuyên họ", "Chỉ uống/hút khi buồn"],
    answerIndex: 1,
    category: CATEGORIES.KY_NANG,
    explanation: "Phòng bệnh hơn chữa bệnh. Hiểu rõ sự đáng sợ của chúng và kiên quyết nói 'KHÔNG' ngay từ đầu là cách tốt nhất bảo vệ bản thân."
  },
  {
    id: 14,
    question: "Khi cảm thấy buồn bã hoặc lo lắng về việc học tập, em nên làm gì thay vì tìm đến những thứ có hại?",
    options: ["Tâm sự với bố mẹ, thầy cô hoặc người em tin tưởng", "Giấu kín trong lòng", "Đi theo người lạ mặt", "Bỏ học đi chơi"],
    answerIndex: 0,
    category: CATEGORIES.KY_NANG,
    explanation: "Bố mẹ và thầy cô luôn sẵn sàng lắng nghe và yêu thương em. Đừng ngần ngại chia sẻ để được giúp đỡ nhé."
  },
  {
    id: 15,
    question: "Để có một cơ thể khỏe mạnh và trí não thông minh, chúng ta nên xây dựng thói quen nào?",
    options: ["Chơi điện tử suốt ngày", "Ăn nhiều bánh kẹo, đồ ngọt", "Ăn uống đủ chất, tập thể dục thường xuyên, ngủ đủ giấc", "Uống nước tăng lực"],
    answerIndex: 2,
    category: CATEGORIES.KY_NANG,
    explanation: "Sống lành mạnh, chăm tập thể thao và ngủ đủ giấc sẽ giúp các em lớn lên thật khỏe mạnh và trở thành người có ích!"
  }
];

// Helper to shuffle questions and pick N
export function getRandomQuestions(count: number = 15): Question[] {
  // Clone array
  const temp = [...QUESTIONS_BANK];
  // Fisher-Yates Shuffle
  for (let i = temp.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [temp[i], temp[j]] = [temp[j], temp[i]];
  }
  return temp.slice(0, count);
}

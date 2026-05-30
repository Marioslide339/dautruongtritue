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
  TOAN: "Toán học 🔢",
  TIENG_VIET: "Tiếng Việt 📝",
  KHOA_HOC: "Khoa học & Tự nhiên 🌿",
  DIA_LY_LICH_SU: "Lịch sử & Địa lý 🗺️",
  DO_VUI: "Đố vui trí tuệ 💡"
};

export const QUESTIONS_BANK: Question[] = [
  // --- TOÁN HỌC (10 CÂU) ---
  {
    id: 1,
    question: "Kết quả của phép tính: 8 + 7 + 5 là bao nhiêu?",
    options: ["15", "18", "20", "22"],
    answerIndex: 2,
    category: CATEGORIES.TOAN,
    explanation: "Ta có: 8 + 7 = 15, sau đó 15 + 5 = 20. Phép tính rất đơn giản đúng không nào!"
  },
  {
    id: 2,
    question: "Số lớn nhất có hai chữ số khác nhau là số nào?",
    options: ["99", "98", "89", "90"],
    answerIndex: 1,
    category: CATEGORIES.TOAN,
    explanation: "99 là số lớn nhất có hai chữ số, nhưng hai chữ số giống nhau. Vì vậy, số lớn nhất có hai chữ số ĐỒNG THỜI KHÁC NHAU là 98!"
  },
  {
    id: 3,
    question: "Một hình vuông có độ dài cạnh là 5cm. Chu vi của hình vuông đó là bao nhiêu?",
    options: ["20cm", "25cm", "15cm", "10cm"],
    answerIndex: 0,
    category: CATEGORIES.TOAN,
    explanation: "Chu vi hình vuông bằng độ dài một cạnh nhân với 4. Ta có: 5 x 4 = 20cm."
  },
  {
    id: 4,
    question: "Nếu hôm nay là thứ Bảy, thì 3 ngày sau sẽ là thứ mấy?",
    options: ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Chủ Nhật"],
    answerIndex: 1,
    category: CATEGORIES.TOAN,
    explanation: "Bắt đầu từ thứ Bảy: 1 ngày sau là Chủ Nhật, 2 ngày sau là thứ Hai, và 3 ngày sau chính là thứ Ba nhé!"
  },
  {
    id: 5,
    question: "Tìm x biết: x - 12 = 25?",
    options: ["x = 13", "x = 37", "x = 27", "x = 35"],
    answerIndex: 1,
    category: CATEGORIES.TOAN,
    explanation: "Muốn tìm số bị trừ, ta lấy hiệu cộng với số trừ: x = 25 + 12 = 37."
  },
  {
    id: 6,
    question: "Đàn gà nhà bé Mai có 15 con gà trống và 20 con gà mái. Hỏi nhà Mai có tất cả bao nhiêu con gà?",
    options: ["25 con", "30 con", "35 con", "40 con"],
    answerIndex: 2,
    category: CATEGORIES.TOAN,
    explanation: "Chúng mình thực hiện phép cộng: 15 + 20 = 35 con gà tất cả."
  },
  {
    id: 7,
    question: "Số gồm 4 chục và 8 đơn vị được viết là gì?",
    options: ["408", "84", "48", "40"],
    answerIndex: 2,
    category: CATEGORIES.TOAN,
    explanation: "Số gồm 4 chục (40) và 8 đơn vị ghép lại chính là số 48."
  },
  {
    id: 8,
    question: "Hình nào dưới đây có 3 cạnh và 3 góc?",
    options: ["Hình vuông", "Hình chữ nhật", "Hình tam giác", "Hình tròn"],
    answerIndex: 2,
    category: CATEGORIES.TOAN,
    explanation: "Hình có 3 cạnh và 3 góc chính đầy đủ các tính chất của một Hình tam giác đó các em!"
  },
  {
    id: 9,
    question: "Có 24 chiếc kẹo đem chia đều cho 4 bạn. Hỏi mỗi bạn nhận được bao nhiêu chiếc kẹo?",
    options: ["4 cái", "5 cái", "6 cái", "8 cái"],
    answerIndex: 2,
    category: CATEGORIES.TOAN,
    explanation: "Chương trình bảng cửu chương: 24 chia cho 4 được kết quả là 6 chiếc kẹo."
  },
  {
    id: 10,
    question: "Lan có 10 nghìn đồng, Lan mua một cái bút chì giá 3 nghìn đồng. Hỏi Lan còn lại bao nhiêu tiền?",
    options: ["5 nghìn đồng", "7 nghìn đồng", "6 nghìn đồng", "8 nghìn đồng"],
    answerIndex: 1,
    category: CATEGORIES.TOAN,
    explanation: "Phép trừ đơn giản: 10 - 3 = 7 nghìn đồng."
  },

  // --- TIẾNG VIỆT (10 CÂU) ---
  {
    id: 11,
    question: "Từ nào trái nghĩa với từ 'ngoan ngoãn'?",
    options: ["Hiền lành", "Học giỏi", "Nghịch ngợm", "Chăm chỉ"],
    answerIndex: 2,
    category: CATEGORIES.TIENG_VIET,
    explanation: "Nghịch ngợm hoặc bướng bỉnh là hành động trái ngược hoàn toàn so với 'ngoan ngoãn'."
  },
  {
    id: 12,
    question: "Tìm tiếng còn thiếu để hoàn thành câu ca dao sau: 'Bầu ơi thương lấy bí cùng, Tuy rằng khác ... nhưng chung một giàn.'",
    options: ["loài", "giống", "nhà", "hoa"],
    answerIndex: 1,
    category: CATEGORIES.TIENG_VIET,
    explanation: "Câu hoàn chỉnh là: 'Tuy rằng khác giống nhưng chung một giàn' khuyên răn chúng ta yêu thương đồng bào."
  },
  {
    id: 13,
    question: "Trong câu: 'Chú chim sẻ đang hót líu lo trên cành cây.', từ nào là từ chỉ hoạt động?",
    options: ["Chú chim sẻ", "hót", "líu lo", "trên cành cây"],
    answerIndex: 1,
    category: CATEGORIES.TIENG_VIET,
    explanation: "'Hót' chính là từ chỉ hoạt động của chú chim sẻ."
  },
  {
    id: 14,
    question: "Từ nào sau đây viết ĐÚNG chính tả?",
    options: ["Suất sắc", "Xuất sắc", "Sức xắc", "Xấc xược"],
    answerIndex: 1,
    category: CATEGORIES.TIENG_VIET,
    explanation: "Từ viết đúng chính tả tiếng Việt là 'Xuất sắc' (tài giỏi vượt trội)."
  },
  {
    id: 15,
    question: "Thành ngữ nào dưới đây khuyên học sinh phải cần cù, kiên trì thì mới gặt hái kết quả?",
    options: ["Ăn quả nhớ kẻ trồng cây", "Có công mài sắt, có ngày nên kim", "Đi một ngày đàng, học một sàng khôn", "Lá lành đùm lá rách"],
    answerIndex: 1,
    category: CATEGORIES.TIENG_VIET,
    explanation: "'Có công mài sắt, có ngày nên kim' khuyên chúng ta vững lòng kiên trì vượt khó để thành công."
  },
  {
    id: 16,
    question: "Nhóm từ nào sau đây gồm các từ chỉ tình cảm gia đình?",
    options: ["Yêu thương, hiếu thảo, quý mến", "Đỏ rực, vàng óng, xanh mát", "Chạy nhảy, nô đùa, bơi lội", "Nhà cửa, bàn ghế, sách vở"],
    answerIndex: 0,
    category: CATEGORIES.TIENG_VIET,
    explanation: "Các từ 'Yêu thương, hiếu thảo, quý mến' thể hiện tình cảm ấm áp thân thương trong nhà."
  },
  {
    id: 17,
    question: "Trong các từ sau, từ nào là từ đồng nghĩa với từ 'chăm chỉ'?",
    options: ["Lười biếng", "Cần cù", "Thanh lịch", "Nhanh nhẹn"],
    answerIndex: 1,
    category: CATEGORIES.TIENG_VIET,
    explanation: "'Cần cù' có nghĩa giống hệt hoặc đồng nghĩa với 'chăm chỉ'."
  },
  {
    id: 18,
    question: "Bộ phận in đậm trong câu sau trả lời cho câu hỏi nào: 'Dưới bóng mát cây đa, **các bạn nhỏ đang chơi nhảy dây**.'",
    options: ["Ở đâu?", "Làm gì?", "Khi nào?", "Như thế nào?"],
    answerIndex: 1,
    category: CATEGORIES.TIENG_VIET,
    explanation: "'Các bạn nhỏ đang chơi nhảy dây' chỉ hoạt động, trả lời cho câu hỏi 'Làm gì?'."
  },
  {
    id: 19,
    question: "Từ nào mô tả tiếng cười nhỏ, liên tục, thể hiện sự thích thú dễ thương?",
    options: ["Hơ hớ", "Khà khà", "Khúc khích", "Oang oang"],
    answerIndex: 2,
    category: CATEGORIES.TIENG_VIET,
    explanation: "Cười 'khúc khích' là từ láy tượng thanh tả tiếng cười thầm ấm áp, vui tai của các bạn nhỏ."
  },
  {
    id: 20,
    question: "Điền từ chỉ loài chim thích hợp: 'Nhanh như ...'",
    options: ["Cắt", "Khướu", "Quạ", "Vẹt"],
    answerIndex: 0,
    category: CATEGORIES.TIENG_VIET,
    explanation: "Thành ngữ dân gian ta có câu: 'Nhanh như cắt' chỉ động tác vô cùng mau lẹ."
  },

  // --- KHOA HỌC & TỰ NHIÊN (10 CÂU) ---
  {
    id: 21,
    question: "Cây xanh tạo ra chất dinh dưỡng và oxi nhờ quá trình nào dưới ánh sáng Mặt Trời?",
    options: ["Hô hấp", "Quang hợp", "Rụng lá", "Thoát hơi nước"],
    answerIndex: 1,
    category: CATEGORIES.KHOA_HOC,
    explanation: "Cây xanh tận dụng chất diệp lục, CO2 nước dưới ánh nắng Mặt Trời để thực hiện quá trình quang hợp."
  },
  {
    id: 22,
    question: "Loài động vật nào được gọi là 'chúa tể rừng xanh'?",
    options: ["Voi", "Hổ (Sư tử)", "Khỉ", "Gấu"],
    answerIndex: 1,
    category: CATEGORIES.KHOA_HOC,
    explanation: "Nhờ sức mạnh phi thường và bản năng săn mồi dũng mãnh, Hổ hoặc Sư tử được coi là chúa tể rừng xanh."
  },
  {
    id: 23,
    question: "Để bảo vệ răng miệng luôn chắc khỏe, chúng ta nên đánh răng ít nhất mấy lần một ngày?",
    options: ["Mỗi tuần một lần", "Một lần vào buổi trưa", "Ít nhất 2 lần (sau khi thức dậy và trước khi đi ngủ)", "Chỉ khi nào thấy răng bẩn"],
    answerIndex: 2,
    category: CATEGORIES.KHOA_HOC,
    explanation: "Nên đánh răng ít nhất 2 lần/ngày (sáng lúc thức dậy và tối trước khi đi ngủ) để loại bỏ mảng bám hại răng."
  },
  {
    id: 24,
    question: "Trái Đất quay xung quanh thiên thể nào trong hệ Mặt Trời?",
    options: ["Mặt Trăng", "Mặt Trời", "Sao Hỏa", "Sao Kim"],
    answerIndex: 1,
    category: CATEGORIES.KHOA_HOC,
    explanation: "Trái Đất là một hành tinh quay quanh ngôi sao trung tâm chính là Mặt Trời."
  },
  {
    id: 25,
    question: "Bộ phận nào trên cơ thể người chịu trách nhiệm bơm máu đi nuôi toàn bộ cơ tim và cơ thể?",
    options: ["Lá phổi", "Trái tim", "Dạ dày", "Đôi mắt"],
    answerIndex: 1,
    category: CATEGORIES.KHOA_HOC,
    explanation: "Trái tim co bóp nhịp nhàng như chiếc máy bơm tự động đưa máu và dinh dưỡng đi khắp cơ thể."
  },
  {
    id: 26,
    question: "Loài động vật nào dưới đây đẻ TRỨNG?",
    options: ["Cá voi", "Khỉ đuôi dài", "Chim bồ câu", "Con mèo"],
    answerIndex: 2,
    category: CATEGORIES.KHOA_HOC,
    explanation: "Cá voi, khỉ và mèo là thú đẻ con. Chim bồ câu thuộc loài chim đẻ trứng lót ổ."
  },
  {
    id: 27,
    question: "Chất gì tồn tại ở cả ba thể: Rắn (băng đá), Lỏng (nước sinh hoạt) và Khí (hơi nước)?",
    options: ["Sắt", "Cát", "Nước", "Dầu ăn"],
    answerIndex: 2,
    category: CATEGORIES.KHOA_HOC,
    explanation: "Nước rất kỳ diệu, đóng băng ở thể rắn, chảy ào ạt thể lỏng và bay hơi thành thể khí ở nhiệt độ cao."
  },
  {
    id: 28,
    question: "Tại sao chúng ta cần ăn nhiều rau xanh và trái cây mỗi ngày?",
    options: ["Vì trái cây nhiều màu sắc đẹp", "Để cung cấp đầy đủ vitamin và chất xơ cứu cánh hệ tiêu hóa", "Để thay thế hoàn toàn nước uống", "Vì rau xanh không chứa năng lượng"],
    answerIndex: 1,
    category: CATEGORIES.KHOA_HOC,
    explanation: "Rau xanh quả chín chứa lượng vitamin dồi dào, tăng đề kháng và hỗ trợ cơ thể phát triển khỏe khoắn."
  },
  {
    id: 29,
    question: "Bình thường, Mặt Trời mọc ở hướng nào và lặn ở hướng nào?",
    options: ["Mọc hướng Tây, lặn hướng Đông", "Mọc hướng Đông, lặn hướng Tây", "Mọc hướng Bắc, lặn hướng Nam", "Mọc hướng Nam, lặn hướng Bắc"],
    answerIndex: 1,
    category: CATEGORIES.KHOA_HOC,
    explanation: "Do chiều tự quay của Trái Đất, ta luôn thấy Mặt Trời mọc ở phương Đông rực rỡ và lặn dần ở phương Tây."
  },
  {
    id: 30,
    question: "Con vật nào có lớp vỏ cứng bên ngoài, di chuyển cực kỳ chậm chạp và có thể thu đầu chân vào vỏ dưỡng sức?",
    options: ["Con thỏ", "Con rùa", "Con sóc", "Con cá vàng"],
    answerIndex: 1,
    category: CATEGORIES.KHOA_HOC,
    explanation: "Đó chính là bạn rùa hiền lành, bền bỉ và sở hữu chiếc mai kiên cố."
  },

  // --- LỊCH SỬ & ĐỊA LÝ (10 CÂU) ---
  {
    id: 31,
    question: "Thủ đô của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam là thành phố nào?",
    options: ["Thành phố Hồ Sài Gòn", "Đà Nẵng", "Cần Thơ", "Hà Nội"],
    answerIndex: 3,
    category: CATEGORIES.DIA_LY_LICH_SU,
    explanation: "Thành phố Hà Nội nghìn năm văn hiến là thủ đô yêu quý của đất nước ta."
  },
  {
    id: 32,
    question: "Vị vua đầu tiên của nước ta, người lập nên nhà nước Văn Lang cổ xưa nhất là ai?",
    options: ["Hùng Vương", "An Dương Vương", "Ngô Quyền", "Đinh Bộ Lĩnh"],
    answerIndex: 0,
    category: CATEGORIES.DIA_LY_LICH_SU,
    explanation: "Các vua Hùng có công dựng nên quốc gia đầu tiên tên Văn Lang giàu bản sắc."
  },
  {
    id: 33,
    question: "Lá quốc kỳ của nước Việt Nam thân yêu có màu gì và họa tiết gì ở trung tâm?",
    options: ["Nền xanh lá trung tâm hình tròn", "Nền đỏ rực rỡ và có ngôi sao vàng năm cánh ở giữa", "Nền trắng sọc vàng hai đầu", "Nền đỏ có hình chim hạc"],
    answerIndex: 1,
    category: CATEGORIES.DIA_LY_LICH_SU,
    explanation: "Quốc kỳ Việt Nam là lá cờ đỏ sao vàng năm cánh tỏa sáng tượng trưng cho hào khí dân tộc."
  },
  {
    id: 34,
    question: "Hồ Gươm (Hồ Hoàn Kiếm) gắn liền với truyền thuyết trả gươm báu cho Rùa Vàng của vị anh hùng nào?",
    options: ["Trần Hưng Đạo", "Lê Lợi", "Quang Trung", "Hai Bà Trưng"],
    answerIndex: 1,
    category: CATEGORIES.DIA_LY_LICH_SU,
    explanation: "Vận động Lê Lợi nhận gươm Thuận Thiên đánh giặc Minh, sau khi thái bình đã hoàn gươm cho cụ Rùa tại Hồ Gươm."
  },
  {
    id: 35,
    question: "Đất nước Việt Nam hình chữ gì trên bản đồ thế giới?",
    options: ["Chữ A", "Chữ L", "Chữ S", "Chữ C"],
    answerIndex: 2,
    category: CATEGORIES.DIA_LY_LICH_SU,
    explanation: "Bản đồ dải đất liền Việt Nam uốn lượn mềm mại tựa như dáng hình chữ S thân thương."
  },
  {
    id: 36,
    question: "Địa danh nào ở Việt Nam được mệnh danh là 'Thành phố ngàn hoa', có khí hậu quanh năm mát mẻ?",
    options: ["Nha Trang", "Đà Lạt", "Vũng Tàu", "Hải Phòng"],
    answerIndex: 1,
    category: CATEGORIES.DIA_LY_LICH_SU,
    explanation: "Thành phố Đà Lạt mộng mơ trên cao nguyên Lâm Viên nức tiếng với khí hậu trong lành và muôn trùng cánh hoa khoe sắc."
  },
  {
    id: 37,
    question: "Nước Việt Nam có biên giới đất liền giáp với các quốc gia nào?",
    options: ["Trung Quốc, Lào, Campuchia", "Thái Lan, Myanmar, Lào", "Malaysia, Singapore, Indonesia", "Hàn Quốc, Nhật Bản, Trung Quốc"],
    answerIndex: 0,
    category: CATEGORIES.DIA_LY_LICH_SU,
    explanation: "Việt Nam có chung đường biên giới đất liền với Trung Quốc (phía Bắc), Lào và Campuchia (phía Tây)."
  },
  {
    id: 38,
    question: "Ai là người lãnh đạo quân dân ta chiến thắng oanh liệt trên dòng sông Bạch Đằng năm 938, kết thúc nghìn năm Bắc thuộc?",
    options: ["Lý Thường Kiệt", "Trần Quốc Toản", "Ngô Quyền", " Đinh Lễ"],
    answerIndex: 2,
    category: CATEGORIES.DIA_LY_LICH_SU,
    explanation: "Ngô Quyền đã vạch ra thế trận cắm cọc gỗ đầu nhọn thần kỳ trên sông Bạch Đằng, đè bẹp xích chiến thuyền quân Nam Hán."
  },
  {
    id: 39,
    question: "Sông Mê Kông chảy vào Việt Nam đổ ra biển Đông bằng mấy cửa sông lớn (nên có tên gọi sông Cửu Long)?",
    options: ["3 cửa", "5 cửa", "9 cửa", "12 cửa"],
    answerIndex: 2,
    category: CATEGORIES.DIA_LY_LICH_SU,
    explanation: "Sông đổ ra biển thông qua chín cửa rộng lớn, ví như chín con rồng vàng uốn khúc nên gọi là Sông Cửu Long."
  },
  {
    id: 40,
    question: "Ngôi chùa cổ kính độc đáo được xây trên một cột đá duy nhất giữa hồ sen ở thủ đô Hà Nội có tên là gì?",
    options: ["Chùa Hương", "Chùa Một Cột", "Chùa Bái Đính", "Chùa Yên Tử"],
    answerIndex: 1,
    category: CATEGORIES.DIA_LY_LICH_SU,
    explanation: "Chùa Một Cột (Liên Hoa Đài) là kiến trúc tâm linh vô giá biểu trưng cho văn hóa Hà Nội."
  },

  // --- ĐỐ VUI TRÍ TUỆ (10 CÂU) ---
  {
    id: 41,
    question: "Con gì có tai dài, đuôi ngắn, chạy nhanh vút và rất thích nhai cà rốt?",
    options: ["Con chó con", "Con sóc nâu", "Con thỏ", "Con chuột túi"],
    answerIndex: 2,
    category: CATEGORIES.DO_VUI,
    explanation: "Chắc chắn là chú thỏ trắng nhanh nhẹn rồi!"
  },
  {
    id: 42,
    question: "Cái gì mà bạn có thể giữ bằng tay trái nhưng không bao giờ giữ được bằng tay phải của mình?",
    options: ["Cái bút chì", "Móng tay", "Khuỷu tay phải", "Điện thoại di động"],
    answerIndex: 2,
    category: CATEGORIES.DO_VUI,
    explanation: "Đúng thế! Tay phải làm sao có thể sờ hay cầm lấy khuỷu tay của chính cánh tay phải đó chứ."
  },
  {
    id: 43,
    question: "Quả gì da sần sùi, có múi thơm ngào ngạt, được mọi người gọi là 'nữ hoàng quả đón mùa thu'?",
    options: ["Quả bưởi", "Quả mít", "Quả sầu riêng", "Quả na (mãng cầu ta)"],
    answerIndex: 0,
    category: CATEGORIES.DO_VUI,
    explanation: "Đó là Quả bưởi - loại quả thanh mát trọn vẹn dâng cúng rằm Trung thu sắp về."
  },
  {
    id: 44,
    question: "Con mèo của bạn có 3 con mèo con, tên lần lượt là Nhất, Nhị, Tam. Hỏi con mèo mẹ tên là gì?",
    options: ["Tên là Tứ", "Tên là Mẹ mèo", "Tên là Con mèo", "Hiện chưa biết tên"],
    answerIndex: 2,
    category: CATEGORIES.DO_VUI,
    explanation: "Dữ liệu đề bài đã nêu ngay từ đầu: 'Con mèo của bạn...' nên tên loài của nó là Con mèo!"
  },
  {
    id: 45,
    question: "Con cá nào có chiếc vòi phun nước khổng lồ lên bầu trời và bơi giỏi nhất đại dương?",
    options: ["Cá mập", "Cá voi", "Cá chép", "Cá ngựa"],
    answerIndex: 1,
    category: CATEGORIES.DO_VUI,
    explanation: "Cá voi (đặc biệt là cá voi xanh) khổng lồ hít thở khí trời và phun cột nước cao cực kỳ ấn tượng."
  },
  {
    id: 46,
    question: "Bạn có 3 quả táo. Bạn lấy đi 2 quả táo. Hỏi bạn lúc này có bao nhiêu quả táo trong tay?",
    options: ["1 quả", "2 quả", "3 quả", "4 quả"],
    answerIndex: 1,
    category: CATEGORIES.DO_VUI,
    explanation: "Khi bạn lấy đi 2 quả táo từ bàn, thì trong tay bạn đang cầm đúng 2 quả táo đó!"
  },
  {
    id: 47,
    question: "Cái gì có thể đi khắp thế giới nhưng chỉ nằm yên một góc nhỏ trên phong bì thư?",
    options: ["Con tem", "Tấm bưu thiếp", "Bản đồ", "Quả địa cầu"],
    answerIndex: 0,
    category: CATEGORIES.DO_VUI,
    explanation: "Chính là Con tem bé nhỏ, có nó lá thư mới vượt nghìn dặm khơi đi muôn nơi."
  },
  {
    id: 48,
    question: "Nắng lửa mùa hè hoa đỏ tươi / Trưa hè rộn rã tiếng ve cười / Là hoa gì?",
    options: ["Hoa mai", "Hoa phượng", "Hoa đào", "Hoa cúc"],
    answerIndex: 1,
    category: CATEGORIES.DO_VUI,
    explanation: "Hoa phượng đỏ rực sân trường gắn liền với mùa hè, ve kêu và mùa chia tay bồi hồi của học trò."
  },
  {
    id: 49,
    question: "Thứ gì mà dù có chia sẻ hay bớt đi nhưng nó lại nhân đôi hạnh phúc, giúp bạn bè kết nối thân mật hơn?",
    options: ["Tiền bạc", "Đồ chơi riêng", "Nụ cười & lòng tử tế", "Chiếc ô tô đồ chơi"],
    answerIndex: 2,
    category: CATEGORIES.DO_VUI,
    explanation: "Nụ cười thân ái và lòng tử tế chia sẻ đi sẽ lan tỏa niềm vui đến mọi người mà không hề mất mát hao mòn."
  },
  {
    id: 50,
    question: "Nếu có một chú ốc sên bò lên cột cao 10m. Mỗi ngày bò lên 3m, đêm ngủ say lại tuột xuống 2m. Hỏi sau bao nhiêu ngày chú ốc sên chạm đỉnh?",
    options: ["10 ngày", "9 ngày", "8 ngày", "7 ngày"],
    answerIndex: 2,
    category: CATEGORIES.DO_VUI,
    explanation: "Mỗi ngày sên thực chất tiến 1m (3m - 2m). Sau 7 ngày tiến được 7m. Sang ngày thứ 8, sên bò lên 3m là chạm đỉnh 10m luôn và không bị tuột xuống nữa! Vậy mất đúng 8 ngày!"
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

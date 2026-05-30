import React, { useState } from 'react';
import { Copy, Check, Info, FileText, ChevronDown, ChevronUp, Layers } from 'lucide-react';

export default function AppsScriptGuide() {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const appsScriptCode = `function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Thiết lập tiêu đề cột nếu Trang tính còn trống
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Thời gian gửi", "Họ tên", "Lớp", "Trường", "Số câu đúng", "Tổng thời gian làm bài (giây)"]);
  }
  
  try {
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
      data.fullName,
      data.className,
      data.schoolName,
      data.score,
      data.timeSpent
    ]);
    
    // Trả về phản hồi CORS thành công
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "Đồng bộ điểm số lên Google Sheets thành công!" 
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
    });
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: err.toString() 
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
    });
  }
}

function doGet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = [];
  var lastRow = sheet.getLastRow();
  
  try {
    if (lastRow > 1) {
      var range = sheet.getRange(2, 1, lastRow - 1, 6);
      var values = range.getValues();
      for (var i = 0; i < values.length; i++) {
        data.push({
          timestamp: values[i][0],
          fullName: values[i][1],
          className: values[i][2],
          schoolName: values[i][3],
          score: parseInt(values[i][4]) || 0,
          timeSpent: parseInt(values[i][5]) || 0
        });
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      data: data 
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
    });
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: err.toString() 
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
    });
  }
}

// Hỗ trợ xử lý yêu cầu OPTIONS (CORS Pre-flight)
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="apps-script-guide" className="border border-yellow-200 bg-yellow-50/70 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left font-semibold text-yellow-800 hover:bg-yellow-100/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-yellow-600" />
          <span>🛠️ Hướng dẫn kết nối Google Sheets tự động</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-yellow-600" /> : <ChevronDown className="w-5 h-5 text-yellow-600" />}
      </button>

      {isOpen && (
        <div className="p-5 border-t border-yellow-100 text-sm text-gray-700 leading-relaxed space-y-4">
          <div className="space-y-2">
            <h4 className="font-bold text-gray-800 flex items-center gap-1.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-yellow-200 text-yellow-800 text-xs">1</span>
              Tạo Google Spreadsheet mới
            </h4>
            <p className="pl-6 text-gray-600">
              Truy cập <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-yellow-700 underline font-medium hover:text-yellow-800">sheets.new</a> để tạo một bảng tính trống mới.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-gray-800 flex items-center gap-1.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-yellow-200 text-yellow-800 text-xs">2</span>
              Mở Trình duyệt tập lệnh (Google Apps Script)
            </h4>
            <p className="pl-6 text-gray-600">
              Trên thanh công cụ, nhấn vào <strong>Mở rộng (Extensions)</strong> &gt; <strong>Apps Script</strong>.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-gray-800 flex items-center gap-1.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-yellow-200 text-yellow-800 text-xs">3</span>
              Dán đoạn mã dưới đây vào
            </h4>
            <p className="pl-6 text-gray-600 mb-2">
              Xóa sạch mã mặc định trong tệp <code>Code.gs</code> và dán đoạn mã này vào:
            </p>

            <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-950 font-mono text-xs text-gray-200 max-h-60 overflow-y-auto shadow-inner pl-6">
              <button 
                onClick={copyToClipboard}
                className="absolute right-3 top-3 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white p-2 rounded-lg transition-colors flex items-center gap-1 border border-gray-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Đã sao chép!" : "Sao chép mã"}</span>
              </button>
              <pre className="p-4 select-all text-left">{appsScriptCode}</pre>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-gray-800 flex items-center gap-1.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-yellow-200 text-yellow-800 text-xs">4</span>
              Triển khai làm Ứng dụng Web (Web App)
            </h4>
            <ul className="pl-6 list-disc text-gray-600 space-y-1">
              <li>Nhấp vào nút <strong>Triển khai (Deploy)</strong> ở góc phải trên &gt; <strong>Tùy chọn triển khai mới (New deployment)</strong>.</li>
              <li>Chọn loại cấu hình là <strong>Ứng dụng web (Web app)</strong>.</li>
              <li>Thay đổi <strong>Người có quyền truy cập (Who has access)</strong> thành <strong>Mới người (Anyone)</strong> (Đây là bước rất quan trọng để ứng dụng gửi được điểm số).</li>
              <li>Nhấn <strong>Triển khai</strong>, sau đó cấp quyền truy cập tài khoản khi bảng điều khiển yêu cầu.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-gray-800 flex items-center gap-1.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-yellow-200 text-yellow-800 text-xs">5</span>
              Liên kết URL Ứng dụng Web vào Quiz App
            </h4>
            <p className="pl-6 text-gray-600">
              Sao chép <strong>URL Ứng dụng Web (Web app URL)</strong> nhận được ở bước trên, dán trực tiếp vào ô cấu hình ở phần <strong>Bảng xếp hạng</strong> phía bên dưới màn hình này để kết nối Đồng bộ hóa tự động!
            </p>
          </div>

          <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl flex gap-2 text-cyan-800">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-cyan-600" />
            <p className="text-xs">
              <strong>Mẹo nhỏ:</strong> Nếu chưa kết nối Google Sheets, ứng dụng vẫn tự động ghi nhớ toàn bộ điểm học tập trên máy tính của bạn thông qua Bộ nhớ cục bộ (Local Storage).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

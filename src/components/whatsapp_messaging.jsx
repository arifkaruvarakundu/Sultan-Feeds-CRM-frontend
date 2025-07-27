// import React, { useEffect, useState, useRef } from "react";

// const WhatsAppMessaging = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const wsRef = useRef(null);
//   const toNumber = "919745674674"; // ✅ Replace with real number

//   // 📡 Setup WebSocket connection
//   useEffect(() => {
//     const ws = new WebSocket("ws://localhost:8000/ws");
//     wsRef.current = ws;

//     ws.onopen = () => console.log("🟢 WebSocket connected");
//     ws.onclose = () => console.log("🔴 WebSocket disconnected");
//     ws.onerror = (e) => console.error("WebSocket error:", e);

//     ws.onmessage = (event) => {
//       const messageData = JSON.parse(event.data);
//       console.log("📥 Incoming:", messageData);
//       setMessages((prev) => [...prev, { text: messageData.body, from: "them" }]);
//     };

//     return () => ws.close();
//   }, []);

//   // 📤 Send message
//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const msg = input;
//     setMessages((prev) => [...prev, { text: msg, from: "me" }]);
//     setInput("");

//     try {
//       const response = await fetch("http://localhost:8000/send-message", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           to_number: toNumber,
//           message: msg,
//         }),
//       });

//       const data = await response.json();
//       console.log("✅ Sent:", data);
//     } catch (err) {
//       console.error("❌ Error sending message:", err);
//     }
//   };

//   // ⏎ Send on Enter
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") sendMessage();
//   };

//   return (
//     <div className="flex flex-col max-w-md mx-auto mt-10 border rounded shadow-lg h-[600px]">
//       <div className="bg-green-600 text-white px-4 py-3 rounded-t">
//         <h2 className="text-lg font-semibold">📨 WhatsApp Chat</h2>
//       </div>

//       <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-gray-50">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${
//               msg.from === "me"
//                 ? "ml-auto bg-green-500 text-white"
//                 : "mr-auto bg-gray-200 text-gray-900"
//             }`}
//           >
//             {msg.text}
//           </div>
//         ))}
//       </div>

//       <div className="flex p-2 border-t bg-white">
//         <input
//           type="text"
//           className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none"
//           placeholder="Type a message"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyPress}
//         />
//         <button
//           onClick={sendMessage}
//           className="ml-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default WhatsAppMessaging;


import React, { useEffect, useState, useRef } from "react";
import { Check, CheckCheck } from "lucide-react"; // optional, or replace with inline SVGs

const WhatsAppMessaging = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const wsRef = useRef(null);
  const toNumber = "919745674674";

  // 🧠 Track message IDs to update status
  const messageIdMap = useRef({}); // local map of sent messages

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");
    wsRef.current = ws;

    ws.onopen = () => console.log("🟢 WebSocket connected");
    ws.onclose = () => console.log("🔴 WebSocket disconnected");
    ws.onerror = (e) => console.error("WebSocket error:", e);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const value = data?.entry?.[0]?.changes?.[0]?.value;

      if (value?.messages) {
        const msg = value.messages[0];
        const text = msg?.text?.body || "[no text]";
        const from = msg?.from;
        const timestamp = msg?.timestamp;

        setMessages((prev) => [
          ...prev,
          {
            text,
            from: "them",
            timestamp,
            raw: msg,
          },
        ]);
      } else if (value?.statuses) {
        const status = value.statuses[0];
        const { id, status: statusType, timestamp } = status;

        // Update message status based on ID
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === id
              ? { ...msg, status: statusType, timestamp }
              : msg
          )
        );
      } else {
        // Fallback for unknown events
        setMessages((prev) => [
          ...prev,
          {
            text: "[Unrecognized webhook event]",
            from: "system",
            raw: data,
          },
        ]);
      }
    };

    return () => ws.close();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const tempId = `temp-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        text: input,
        from: "me",
        timestamp: Date.now() / 1000,
        status: "sent", // default
      },
    ]);

    const msgToSend = input;
    setInput("");

    try {
      const res = await fetch("http://localhost:8000/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to_number: toNumber, message: msgToSend }),
      });

      const data = await res.json();
      const messageId = data?.messages?.[0]?.id;

      if (messageId) {
        messageIdMap.current[tempId] = messageId;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId ? { ...msg, id: messageId } : msg
          )
        );
      }

      console.log("✅ Sent:", data);
    } catch (err) {
      console.error("❌ Error sending:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const renderStatusIcon = (status) => {
    if (status === "read")
      return <CheckCheck size={14} className="text-blue-500 ml-1 inline" />;
    if (status === "delivered")
      return <CheckCheck size={14} className="text-gray-500 ml-1 inline" />;
    if (status === "sent")
      return <Check size={14} className="text-gray-500 ml-1 inline" />;
    return null;
  };

  return (
    <div className="flex flex-col max-w-md mx-auto mt-10 border rounded shadow-lg h-[600px]">
      <div className="bg-green-600 text-white px-4 py-3 rounded-t">
        <h2 className="text-lg font-semibold">📨 WhatsApp Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[75%] px-3 py-2 rounded-lg text-sm relative ${
              msg.from === "me"
                ? "ml-auto bg-green-500 text-white"
                : msg.from === "them"
                ? "mr-auto bg-gray-200 text-gray-900"
                : "mx-auto bg-yellow-100 text-black"
            }`}
          >
            <div>{msg.text}</div>
            <div className="text-xs text-white/70 mt-1 flex justify-end items-center gap-1">
              {msg.timestamp &&
                new Date(msg.timestamp * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              {msg.from === "me" && renderStatusIcon(msg.status)}
            </div>
          </div>
        ))}
      </div>

      <div className="flex p-2 border-t bg-white">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none"
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default WhatsAppMessaging;

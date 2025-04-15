// import React, { useState, useRef, useEffect } from "react";
// import { PostUtils } from "@services/utils/post-utils.service";
// import AddPost from "@components/posts/post-modal/post-add/AddPost";
// import AddPost1 from "@components/posts/post-modal/post-add/AddPost1";
// import { useDispatch, useSelector } from "react-redux";

// export default function QuestionFormModal() {
//   const [isModalOpen, setIsModalOpen] = useState(true);
//   const [activeTab, setActiveTab] = useState("question");
//   const [question, setQuestion] = useState("");
  
//   const modalRef = useRef(null);
//     const dispatch = useDispatch();

  
//    const closePostModal = () => {
//       PostUtils.closePostModal(dispatch);
//     };


//   // Ngăn cuộn khi modal mở
//   useEffect(() => {
//     if (isModalOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }

//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [isModalOpen]);

//   return (
//     <>
      
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div
//             className="w-full max-w-3xl bg-white rounded-lg shadow-lg animate-fade-in"
//           >
//             {/* Header */}
//             <div className="p-4 flex items-center justify-between">
//               <div className="text-lg font-bold">Create</div>
//               <button
//                 className="text-gray-500 hover:text-gray-700"
//                 onClick={() => closePostModal()}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <line x1="18" y1="6" x2="6" y2="18" />
//                   <line x1="6" y1="6" x2="18" y2="18" />
//                 </svg>
//               </button>
//             </div>

//             {/* Tabs */}
//             <div className="flex border-b">
//               <button
//                 className={`flex-1 py-4 text-center font-medium ${
//                   activeTab === "question"
//                     ? "text-black border-b-2 border-blue-500"
//                     : "text-gray-500"
//                 }`}
//                 onClick={() => setActiveTab("question")}
//               >
//                 Add Question
//               </button>
//               <button
//                 className={`flex-1 py-4 text-center font-medium ${
//                   activeTab === "post"
//                     ? "text-black border-b-2 border-blue-500"
//                     : "text-gray-500"
//                 }`}
//                 onClick={() => setActiveTab("post")}
//               >
//                 Create Post
//               </button>
//             </div>

//             {/* Nội dung form */}
//             <div className="p-4">
//               {/* Tiêu đề theo tab */}
//               <h2 className="text-xl font-semibold mb-4">
//                 {activeTab === "question" ? "Add Question" : "Create Post"}
//               </h2>

//               <div className="flex items-center gap-2 mb-4">
//                 {/* (có thể thêm avatar, dropdown quyền riêng tư ở đây) */}
//               </div>

//               {/* Nội dung khác nhau cho từng tab */}
//               {activeTab === "question" ? (
//                 <div className="mt-2">
//                   <input
//                     type="text"
//                     placeholder='Start your question with "What", "How", "Why", etc.'
//                     className="w-full p-2 text-lg border rounded-md outline-none"
//                     value={question}
//                     onChange={(e) => setQuestion(e.target.value)}
//                   />
//                 </div>
//               ) : (
//                 <div className="mt-2">
//                   <textarea
//                     placeholder="What's on your mind?"
//                     className="w-full p-2 text-lg border rounded-md outline-none min-h-[100px]"
//                   ></textarea>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
      
//     </>
//   );
// }
// import React, { useState, useRef, useEffect } from "react";
// import { PostUtils } from "@services/utils/post-utils.service";
// import AddPost from "@components/posts/post-modal/post-add/AddPost";
// import AddPost1 from "@components/posts/post-modal/post-add/AddPost1";
// import { useDispatch, useSelector } from "react-redux";

// export default function QuestionFormModal() {
//   const [isModalOpen, setIsModalOpen] = useState(true);
//   const [activeTab, setActiveTab] = useState("question");
//   const [question, setQuestion] = useState("");
  
//   const modalRef = useRef(null);
//     const dispatch = useDispatch();

  
//    const closePostModal = () => {
//       PostUtils.closePostModal(dispatch);
//     };


//   // Ngăn cuộn khi modal mở
//   useEffect(() => {
//     if (isModalOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }

//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [isModalOpen]);

//   return (
//     <>
      
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div
//             className="w-full max-w-3xl bg-white rounded-lg shadow-lg animate-fade-in"
//           >
//             {/* Header */}
//             <div className="p-4 flex items-center justify-between">
//               <div className="text-lg font-bold">Create</div>
//               <button
//                 className="text-gray-500 hover:text-gray-700"
//                 onClick={() => closePostModal()}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <line x1="18" y1="6" x2="6" y2="18" />
//                   <line x1="6" y1="6" x2="18" y2="18" />
//                 </svg>
//               </button>
//             </div>

//             {/* Tabs */}
//             <div className="flex border-b">
//               <button
//                 className={`flex-1 py-4 text-center font-medium ${
//                   activeTab === "question"
//                     ? "text-black border-b-2 border-blue-500"
//                     : "text-gray-500"
//                 }`}
//                 onClick={() => setActiveTab("question")}
//               >
//                 Add Question
//               </button>
//               <button
//                 className={`flex-1 py-4 text-center font-medium ${
//                   activeTab === "post"
//                     ? "text-black border-b-2 border-blue-500"
//                     : "text-gray-500"
//                 }`}
//                 onClick={() => setActiveTab("post")}
//               >
//                 Create Post
//               </button>
//             </div>

//             {/* Nội dung form */}
//             <div className="p-4">
//               {/* Tiêu đề theo tab */}
//               <h2 className="text-xl font-semibold mb-4">
//                 {activeTab === "question" ? "Add Question" : "Create Post"}
//               </h2>

//               <div className="flex items-center gap-2 mb-4">
//                 {/* (có thể thêm avatar, dropdown quyền riêng tư ở đây) */}
//               </div>

//               {/* Nội dung khác nhau cho từng tab */}
//               {activeTab === "question" ? (
//                 <div className="mt-2">
//                   <input
//                     type="text"
//                     placeholder='Start your question with "What", "How", "Why", etc.'
//                     className="w-full p-2 text-lg border rounded-md outline-none"
//                     value={question}
//                     onChange={(e) => setQuestion(e.target.value)}
//                   />
//                 </div>
//               ) : (
//                 <div className="mt-2">
//                   <textarea
//                     placeholder="What's on your mind?"
//                     className="w-full p-2 text-lg border rounded-md outline-none min-h-[100px]"
//                   ></textarea>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
      
//     </>
//   );
// }
import AddPost from "@components/posts/post-modal/post-add/AddPost";
import AddQuestion from "@components/posts/post-modal/post-add/AddQuestion";
import { useSelector } from "react-redux";

export default function ModalManager() {
  const { modalType } = useSelector((state) => state.modal);

  return (
    <>
      {modalType === "createpost" && <AddPost />}
      {modalType === "createquestion" && <AddQuestion />}
    </>
  );
}

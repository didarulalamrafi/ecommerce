// "use client";

// import { useState, useMemo } from "react";
// import { ChevronDown, Search } from "lucide-react";

// interface FAQItem {
//   id: string;
//   question: string;
//   answer: string;
// }

// interface FAQCategory {
//   category: string;
//   items: FAQItem[];
// }

// interface FlattenedFAQ extends FAQItem {
//   category: string;
// }

// const FAQSection = (): JSX.Element => {
//   const [expandedId, setExpandedId] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [activeCategory, setActiveCategory] = useState<string>("all");

//   const faqData: FAQCategory[] = [
//     {
//       category: "পণ্য",
//       items: [
//         {
//           id: "prod-1",
//           question: "আমি সঠিক সাইজ কীভাবে খুঁজে পাব?",
//           answer:
//             "আমরা প্রতিটি পণ্য বিভাগের জন্য বিস্তারিত সাইজ চার্ট প্রদান করি। আপনি পণ্য পৃষ্ঠায় সাইজ গাইড খুঁজে পেতে পারেন অথবা ব্যক্তিগত সুপারিশের জন্য আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করতে পারেন।",
//         },
//         {
//           id: "prod-2",
//           question: "আপনার পণ্যগুলি প্রকৃত কি?",
//           answer:
//             "হ্যাঁ, আমাদের সমস্ত পণ্য ১০০% প্রকৃত। আমরা অনুমোদিত নির্মাতাদের থেকে সরাসরি সংগ্রহ করি এবং শিপিংয়ের আগে প্রতিটি আইটেম যাচাই করি।",
//         },
//         {
//           id: "prod-3",
//           question: "আপনি বন্ধ করা পণ্য বিক্রয় করেন?",
//           answer:
//             'মাঝে মধ্যে আমাদের কাছে বন্ধ করা পণ্যের সীমিত স্টক থাকে। আমাদের "ক্লিয়ারেন্স" বিভাগ চেক করুন অথবা পণ্য সতর্কতায় সাবস্ক্রাইব করুন।',
//         },
//         {
//           id: "prod-4",
//           question: "ইনভেন্টরি কত বার আপডেট হয়?",
//           answer:
//             "আমাদের ইনভেন্টরি রিয়েল-টাইমে আপডেট হয়। যদি একটি আইটেম স্টকে থাকে, এটি চেকআউটের সময় আপনার জন্য সংরক্ষিত থাকবে।",
//         },
//       ],
//     },
//     {
//       category: "অর্ডারিং",
//       items: [
//         {
//           id: "order-1",
//           question: "ডেলিভারিতে কত সময় লাগে?",
//           answer:
//             "স্ট্যান্ডার্ড ডেলিভারি ৫-৭ ব্যবসায়িক দিন সময় নেয়। এক্সপ্রেস ডেলিভারি (২-৩ দিন) চেকআউটে উপলব্ধ। ডেলিভারি সময় আপনার অবস্থানের উপর ভিত্তি করে পরিবর্তিত হতে পারে।",
//         },
//         {
//           id: "order-2",
//           question: "অর্ডার দেওয়ার পর আমি এটি পরিবর্তন করতে পারি?",
//           answer:
//             "অর্ডারগুলি প্লেসমেন্টের ১ ঘন্টার মধ্যে পরিবর্তন করা যায়। এর পরে, আপনাকে বাতিল করে নতুন অর্ডার দিতে হবে। পরিবর্তনের প্রয়োজন হলে অবিলম্বে সাপোর্টে যোগাযোগ করুন।",
//         },
//         {
//           id: "order-3",
//           question: "আপনি আন্তর্জাতিক শিপিং অফার করেন?",
//           answer:
//             "হ্যাঁ, আমরা ৫০+ দেশে পাঠাই। শিপিং খরচ এবং ডেলিভারি সময় অবস্থানের উপর নির্ভর করে। আন্তর্জাতিক অর্ডারগুলি কাস্টমস শুল্কের অধীন হতে পারে।",
//         },
//         {
//           id: "order-4",
//           question: "আপনি কী পেমেন্ট পদ্ধতি গ্রহণ করেন?",
//           answer:
//             "আমরা সমস্ত প্রধান ক্রেডিট কার্ড (ভিসা, মাস্টারকার্ড, আমেক্স), পেপ্যাল, অ্যাপল পে, গুগল পে এবং নির্বাচিত অঞ্চলে ব্যাংক ট্রান্সফার গ্রহণ করি।",
//         },
//         {
//           id: "order-5",
//           question: "আমি অ্যাকাউন্ট ছাড়াই অর্ডার করতে পারি?",
//           answer:
//             "হ্যাঁ, আপনি গেস্ট হিসাবে চেকআউট করতে পারেন। তবে অ্যাকাউন্ট তৈরি করা আপনাকে অর্ডার ট্র্যাক করতে, প্রিয়গুলি সংরক্ষণ করতে এবং রিটার্ন সহজে পরিচালনা করতে সাহায্য করে।",
//         },
//       ],
//     },
//     {
//       category: "অ্যাকাউন্ট ও সাপোর্ট",
//       items: [
//         {
//           id: "acc-1",
//           question: "আমি আমার পাসওয়ার্ড কীভাবে রিসেট করব?",
//           answer:
//             'লগইন পৃষ্ঠায় "পাসওয়ার্ড ভুলে গেছেন" ক্লিক করুন এবং আপনার ইমেল প্রবেশ করুন। আমরা কয়েক মিনিটের মধ্যে আপনাকে পাসওয়ার্ড রিসেট লিঙ্ক পাঠাব।',
//         },
//         {
//           id: "acc-2",
//           question: "আমি আমার অর্ডার কীভাবে ট্র্যাক করব?",
//           answer:
//             "আপনি আপনার অ্যাকাউন্ট ড্যাশবোর্ড থেকে বা ইমেলের মাধ্যমে পাঠানো ট্র্যাকিং লিঙ্ক ব্যবহার করে আপনার অর্ডার ট্র্যাক করতে পারেন। ডেলিভারি জুড়ে রিয়েল-টাইম আপডেট প্রদান করা হয়।",
//         },
//         {
//           id: "acc-3",
//           question: "আপনার রিটার্ন নীতি কী?",
//           answer:
//             "আমরা বেশিরভাগ আইটেমের জন্য ৩০ দিনের রিটার্ন অফার করি। পণ্যগুলি অব্যবহৃত এবং মূল প্যাকেজিংয়ে থাকতে হবে। আপনার অ্যাকাউন্ট থেকে রিটার্ন শুরু করুন অথবা সাপোর্টে যোগাযোগ করুন।",
//         },
//         {
//           id: "acc-4",
//           question: "রিফান্ড কত সময় নেয়?",
//           answer:
//             "আমরা আপনার ফেরত আইটেম পাওয়ার পর ৫-৭ ব্যবসায়িক দিনের মধ্যে রিফান্ড প্রক্রিয়া করি। এটি আপনার অ্যাকাউন্টে প্রদর্শিত হতে অতিরিক্ত ২-৩ ব্যবসায়িক দিন সময় লাগতে পারে।",
//         },
//         {
//           id: "acc-5",
//           question: "আমি গ্রাহক সাপোর্টের সাথে কীভাবে যোগাযোগ করব?",
//           answer:
//             "আমাদের সাথে ইমেলের মাধ্যমে যোগাযোগ করুন support@example.com, লাইভ চ্যাট (সকাল ৯টা - সন্ধ্যা ৬টা উপলব্ধ), বা ফোনে ১-৮০০-১২৩-৪৫৬৭। আমরা ২৪ ঘন্টার মধ্যে প্রশ্নের উত্তর দিই।",
//         },
//       ],
//     },
//   ];

//   // Flatten and filter FAQs based on search and category
//   const filteredFaqs = useMemo<FlattenedFAQ[]>(() => {
//     return faqData
//       .filter(
//         (cat) => activeCategory === "all" || cat.category === activeCategory,
//       )
//       .flatMap((cat) =>
//         cat.items.map((item) => ({
//           ...item,
//           category: cat.category,
//         })),
//       )
//       .filter(
//         (item) =>
//           item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           item.answer.toLowerCase().includes(searchTerm.toLowerCase()),
//       );
//   }, [searchTerm, activeCategory]);

//   const toggleExpand = (id: string): void => {
//     setExpandedId(expandedId === id ? null : id);
//   };

//   const categories: string[] = ["all", ...faqData.map((cat) => cat.category)];

//   return (
//     <section className="w-full max-w-4xl mx-auto px-4 py-12">
//       {/* Header */}
//       <div className="mb-12 text-center">
//         <h1 className="text-4xl font-bold text-gray-900 mb-3">
//           সাধারণ প্রশ্ন এবং উত্তর
//         </h1>
//         <p className="text-lg text-gray-600">
//           আমাদের পণ্য, অর্ডার এবং অ্যাকাউন্ট সম্পর্কে সাধারণ প্রশ্নের উত্তর
//           খুঁজুন।
//         </p>
//       </div>

//       {/* Search Bar */}
//       <div className="mb-8 relative">
//         <Search
//           className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//           size={20}
//         />
//         <input
//           type="text"
//           placeholder="প্রশ্ন খুঁজুন..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         />
//       </div>

//       {/* Category Tabs */}
//       <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
//         {categories.map((category) => (
//           <button
//             key={category}
//             onClick={() => {
//               setActiveCategory(category);
//               setSearchTerm("");
//             }}
//             className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
//               activeCategory === category
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//             }`}
//           >
//             {category.charAt(0).toUpperCase() + category.slice(1)}
//           </button>
//         ))}
//       </div>

//       {/* FAQ Items */}
//       <div className="space-y-3">
//         {filteredFaqs.length > 0 ? (
//           filteredFaqs.map((item) => (
//             <div
//               key={item.id}
//               className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
//             >
//               <button
//                 onClick={() => toggleExpand(item.id)}
//                 className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
//               >
//                 <span className="font-semibold text-gray-900 text-lg">
//                   {item.question}
//                 </span>
//                 <ChevronDown
//                   size={24}
//                   className={`text-gray-500 flex-shrink-0 transition-transform ${
//                     expandedId === item.id ? "transform rotate-180" : ""
//                   }`}
//                 />
//               </button>

//               {/* Expanded Answer */}
//               {expandedId === item.id && (
//                 <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
//                   <p className="text-gray-700 leading-relaxed">{item.answer}</p>
//                   <span className="inline-block mt-3 text-sm text-blue-600 font-medium">
//                     {item.category}
//                   </span>
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-12">
//             <p className="text-gray-600 text-lg">
//               "{searchTerm}" এর জন্য কোনো ফলাফল পাওয়া যায়নি। অন্য একটি শব্দ
//               চেষ্টা করুন।
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Still Need Help */}
//       <div className="mt-12 p-6 bg-blue-50 rounded-lg text-center">
//         <h3 className="font-bold text-gray-900 mb-2">
//           এখনও সাহায্যের প্রয়োজন?
//         </h3>
//         <p className="text-gray-700 mb-4">
//           আপনি যা খুঁজছেন তা খুঁজে পাচ্ছেন না? আমাদের সাপোর্ট টিম আপনাকে সাহায্য
//           করতে এখানে আছে।
//         </p>
//         <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
//           সাপোর্টে যোগাযোগ করুন
//         </button>
//       </div>
//     </section>
//   );
// };

// export default FAQSection;

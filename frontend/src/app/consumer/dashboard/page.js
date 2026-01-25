"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ConsumerLayout from "@/components/consumer/ConsumerLayout";
import { useAuth } from "@/context/AuthContext";
import { graphqlRequest } from "@/lib/apollo-client";
import { LIST_PRODUCTS } from "@/lib/graphql/consumer";
import {
  ScanLine,
  Shield,
  History,
  Award,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Calendar,
  Leaf,
  Share2,
  ExternalLink,
  Loader2,
  Navigation,
  Sprout,
  Truck,
  Store,
  X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { useRef } from "react";
// --- Magnified Map Card Component ---
const MagnifiedMapCard = ({ product, onClose }) => {
  if (!product) return null;

  const journeySteps = [
     { icon: Sprout, label: "Harvest", date: "Jan 20", location: "Farm" },
     { icon: Shield, label: "Verified", date: "Jan 21", location: " QC Lab" },
     { icon: Truck, label: "Transit", date: "Jan 22", location: "Logistics" },
     { icon: Store, label: "Retail", date: "Jan 24", location: "Store" },
  ];

  return (
    <motion.div 
       className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12 pointer-events-auto"
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
    >
       {/* Backdrop */}
       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

       <motion.div 
          layoutId={`product-card-${product.id}`}
          className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden relative z-10 flex flex-col max-h-[85vh] sm:max-h-[800px]"
       >
          {/* Header Image Area */}
          <div className="h-48 bg-slate-50 relative shrink-0 overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-600/10" />
             
             {/* Decorative Circles */}
             <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-500/10 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4" />

             <div className="absolute top-6 right-6 z-20">
                <button 
                  className="bg-white/80 backdrop-blur-md p-3 rounded-full hover:bg-white text-slate-500 hover:text-slate-900 transition-all shadow-sm active:scale-95" 
                  onClick={onClose}
                >
                   <X size={20} strokeWidth={2.5} />
                </button>
             </div>
             
             <div className="absolute -bottom-12 left-10 z-10">
                <div className="w-28 h-28 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center justify-center text-6xl border-4 border-white transform rotate-3">
                   {/* Emoji placeholder */}
                   🌿 
                </div> 
             </div>
          </div>

          <div className="pt-16 px-6 sm:px-10 pb-8 bg-white overflow-y-auto custom-scrollbar flex-1">
             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
                <div>
                   <h2 className="text-3xl font-black text-slate-900 leading-tight mb-2">{product.title}</h2>
                   <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg flex items-center gap-1">
                         <Leaf size={14} className="text-emerald-500"/> {product.farmer?.name}
                      </span>
                      {product.isOrganic && (
                         <span className="text-xs font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                            <CheckCircle2 size={12}/> Organic Verified
                         </span>
                      )}
                   </div>
                </div>
                <div className="text-left sm:text-right">
                   <p className="text-4xl font-black text-slate-900 tracking-tight">₹{product.pricePerKg}</p>
                   <p className="text-xs font-bold text-emerald-600 mt-1 uppercase tracking-wider">Available Now</p>
                </div>
             </div>

             {/* MAP STRUCTURE - REVISED ALIGNMENT */}
             <div className="bg-slate-50/80 rounded-[2rem] p-6 sm:p-8 mb-8 relative border border-slate-100">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Product Journey Timeline</h3>
                
                {/* Line Layer - Perfectly Aligned */}
                <div className="absolute top-[5rem] bottom-12 left-[3rem] sm:left-[3.5rem] w-0.5 bg-slate-200 -translate-x-1/2 rounded-full" />
                
                {/* Animated Line Fill */}
                <motion.div 
                    className="absolute top-[5rem] left-[3rem] sm:left-[3.5rem] w-0.5 bg-emerald-500 origin-top -translate-x-1/2 rounded-full"
                    initial={{ height: 0 }}
                    animate={{ height: "75%" }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                />

                <div className="space-y-6 relative z-10">
                   {journeySteps.map((step, idx) => (
                      <motion.div 
                        key={idx}
                        className="flex items-center gap-5 sm:gap-6"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.2 }}
                      >
                         {/* Dot Column - Fixed Width for Alignment */}
                         <div className="w-12 sm:w-16 flex justify-center shrink-0">
                             <motion.div 
                                className="w-5 h-5 rounded-full bg-white border-[3px] border-slate-200 relative z-10 shadow-sm"
                                initial={{ scale: 0.5, borderColor: "#e2e8f0" }}
                                animate={{ scale: 1, borderColor: "#10b981", backgroundColor: "#fff" }}
                                transition={{ delay: idx * 0.2 + 0.1, duration: 0.4, type: "spring" }}
                             >
                                <div className="absolute inset-0 m-auto w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                             </motion.div>
                         </div>

                         {/* Content Card */}
                         <div className="flex-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-emerald-200 hover:shadow-lg transition-all group cursor-default">
                            <div className="flex items-center gap-4">
                               <div className={`p-3 rounded-2xl bg-slate-50 text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-all`}>
                                  <step.icon size={20} strokeWidth={2} />
                               </div>
                               <div>
                                  <h4 className="font-bold text-base text-slate-900 leading-tight">{step.label}</h4>
                                  <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
                                    <MapPin size={10} /> {step.location}
                                  </p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 group-hover:bg-white transition-colors self-start sm:self-auto">{step.date}</span>
                         </div>
                      </motion.div>
                   ))}
                </div>
             </div>

             <Link href={`/consumer/scan?qr=${product.qrCode}`} className="block w-full">
                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-base shadow-xl shadow-slate-900/10 hover:bg-slate-800 hover:shadow-2xl hover:shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                   View Full Verification Certificate <ArrowRight size={20} />
                </button>
             </Link>
          </div>
       </motion.div>
    </motion.div>
  );
};


export default function ConsumerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scannedProducts, setScannedProducts] = useState([]);
   
  useEffect(() => {
    fetchProducts();
    loadScannedHistory();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await graphqlRequest(LIST_PRODUCTS, { filters: {} });
      if (data?.listProducts) {
        setProducts(data.listProducts);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadScannedHistory = () => {
    const history = JSON.parse(
      localStorage.getItem("farmchain_scan_history") || "[]",
    );
    setScannedProducts(history.slice(0, 5));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getFirstName = (name) => {
    if (!name) return "Consumer";
    return name.split(" ")[0];
  };

  const getProductEmoji = (category) => {
    const emojiMap = {
      vegetables: "🥬",
      fruits: "🍎",
      grains: "🌾",
      dairy: "🥛",
      tomatoes: "🍅",
      lettuce: "🥬",
      peppers: "🫑",
      cucumber: "🥒",
    };
    const key = category?.toLowerCase() || "";
    for (const [k, v] of Object.entries(emojiMap)) {
      if (key.includes(k)) return v;
    }
    return "🌿";
  };

  const stats = [
    {
      label: "Products Available",
      value: products.length.toString(),
      icon: ScanLine,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Organic Products",
      value: products.filter((p) => p.isOrganic).length.toString(),
      icon: Shield,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Farmers",
      value: [...new Set(products.map((p) => p.farmer?.id))]
        .filter(Boolean)
        .length.toString(),
      icon: Leaf,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Scanned by You",
      value: scannedProducts.length.toString(),
      icon: Share2,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <ConsumerLayout>
      <div className="space-y-8">
        <motion.div
          className="relative overflow-hidden bg-[#0f172a] rounded-3xl p-8 md:p-10 text-white shadow-2xl shadow-blue-900/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                {getGreeting()}, {getFirstName(user?.name)}! 👋
              </h1>
              <p className="text-blue-100/80 text-lg max-w-xl">
                Verify the authenticity of your food products with blockchain.
              </p>
            </div>
            <Link href="/consumer/scan">
              <motion.button
                className="px-6 py-3.5 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ScanLine className="w-5 h-5" />
                Scan New Product
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* --- Available Products & Map Section --- */}
        <div className="flex flex-col gap-6">
           <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Available Products</h2>
                  <p className="text-sm text-slate-500">From verified farms near you</p>
                </div>
                <Link href="/consumer/verified" className="text-blue-600 hover:text-blue-700 font-bold text-sm">View All</Link>
              </div>

              {loading ? (
                 <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-slate-400"/></div>
              ) : products.length === 0 ? (
                 <div className="p-10 text-center bg-slate-50 rounded-2xl border border-slate-200">
                    <p className="text-slate-500">No products available at the moment.</p>
                 </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.slice(0, 8).map((product, index) => (
                    <motion.div
                      key={product.id}
                      className="bg-white rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden hover:shadow-[0_20px_50px_-12px_rgba(37,99,235,0.15)] hover:border-blue-500/30 transition-all duration-300 group flex flex-col h-full"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                        <div className="relative h-40 bg-slate-50 overflow-hidden shrink-0">
                            {/* Background Pattern */}
                             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                             
                            {/* Emoji Hero */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                 <span className="text-7xl drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-500 filter group-hover:brightness-110">
                                     {getProductEmoji(product.category)}
                                 </span>
                            </div>

                            {/* Badge Overlay */}
                            <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                                {product.isOrganic && (
                                     <div className="px-2 py-1 bg-emerald-500/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-sm flex items-center gap-1">
                                        <Leaf size={10} strokeWidth={3} /> Organic
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <div className="mb-auto">
                              <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                                {product.title}
                              </h3>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1">
                                <Leaf size={12} className="text-emerald-500" /> {product.farmer?.name}
                              </p>
                              
                              <div className="flex items-center gap-2 mb-4">
                                   <span className="text-2xl font-black text-slate-900 tracking-tight">₹{product.pricePerKg}</span>
                                   <span className="text-[10px] font-bold text-slate-400 uppercase">/ kg</span>
                              </div>
                          </div>

                          <Link href={`/consumer/scan?qr=${product.qrCode}`} className="block">
                            <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-900/10 hover:bg-blue-600 hover:shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                <ScanLine className="w-4 h-4" />
                                Trace
                            </button>
                          </Link>
                        </div>
                    </motion.div>
                  ))}
                </div>
              )}
           </div>
        </div>

        {/* MAGNIFIED CARD OVERLAY REMOVED */}
         
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div
                className={`p-3 rounded-xl ${stat.bg} ${stat.color} inline-flex mb-4`}
              >
                <stat.icon className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">
                {loading ? "-" : stat.value}
              </h3>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Scan Product",
              desc: "Verify authenticity",
              icon: ScanLine,
              color: "blue",
              href: "/consumer/scan",
            },
            {
              title: "View History",
              desc: "See scanned products",
              icon: History,
              color: "indigo",
              href: "/consumer/journey",
            },
            {
              title: "Verified Products",
              desc: "Browse trusted items",
              icon: Award,
              color: "violet",
              href: "/consumer/verified",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            >
              <Link href={item.href}>
                <div className="relative overflow-hidden bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-200 p-6 rounded-3xl transition-all group cursor-pointer shadow-sm hover:shadow-md">
                  <div className="flex items-center gap-4 relative z-10">
                    <div
                      className={`p-4 rounded-2xl bg-${item.color}-50 text-${item.color}-600 group-hover:scale-110 transition-transform`}
                    >
                      <item.icon className="w-8 h-8" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </ConsumerLayout>
  );
}

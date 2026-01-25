"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ConsumerLayout from "@/components/consumer/ConsumerLayout";
import { graphqlRequest } from "@/lib/apollo-client";
import { LIST_PRODUCTS } from "@/lib/graphql/consumer";
import Link from "next/link";
import {
  Shield,
  CheckCircle2,
  Leaf,
  MapPin,
  Star,
  Loader2,
  Filter,
  ScanLine,
} from "lucide-react";

export default function Verified() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchProducts();
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

  const filteredProducts = products.filter((p) => {
    if (filter === "all") return true;
    if (filter === "organic") return p.isOrganic;
    return true;
  });

  return (
    <ConsumerLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">
                Verified Products
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
              Trusted Farm Products
            </h1>
            <p className="text-lg text-slate-600">
              All products verified on blockchain for authenticity
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => setFilter("organic")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                  filter === "organic"
                    ? "bg-green-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Leaf className="w-4 h-4" />
                Organic Only
              </button>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin relative z-10" />
            </div>
            <span className="mt-6 text-lg font-medium text-slate-500 animate-pulse">
              Verifying products on blockchain...
            </span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            className="bg-white/50 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-100 p-16 text-center max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 bg-slate-50/80 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              No Verified Products Yet
            </h3>
            <p className="text-slate-500 leading-relaxed">
              {filter === "organic"
                ? "No organic-certified products are currently listed in the marketplace."
                : "Check back soon for new farm-fresh, blockchain-verified listings."}
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="bg-white rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden hover:shadow-[0_20px_50px_-12px_rgba(37,99,235,0.15)] hover:border-blue-500/30 transition-all duration-300 group flex flex-col h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative h-48 bg-slate-50 overflow-hidden shrink-0">
                    {/* Background Pattern */}
                     <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
                     
                    {/* Emoji Hero */}
                    <div className="absolute inset-0 flex items-center justify-center">
                         <span className="text-8xl drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-500 filter group-hover:brightness-110">
                             {getProductEmoji(product.category)}
                         </span>
                    </div>

                    {/* Badge Overlay */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                        <div className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider text-emerald-600 shadow-sm border border-emerald-100 flex items-center gap-1.5">
                            <CheckCircle2 size={12} strokeWidth={3} /> Verified
                        </div>
                        {product.isOrganic && (
                             <div className="px-3 py-1 bg-emerald-500/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-sm flex items-center gap-1.5">
                                <Leaf size={12} strokeWidth={3} /> Organic
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <div className="mb-auto">
                      <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                              <span className="text-xs">👤</span>
                          </div>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                              {product.farmer?.name || "Verified Farmer"}
                          </span>
                      </div>

                      <h3 className="text-2xl font-bold text-slate-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                        {product.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-6">
                           <span className="text-3xl font-black text-slate-900 tracking-tight">₹{product.pricePerKg}</span>
                           <span className="text-sm font-medium text-slate-400">/ kg</span>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm py-3 border-t border-slate-100">
                          <span className="text-slate-500 font-medium">Availability</span>
                          <span className="font-bold text-slate-800">{product.availableQty} kg</span>
                      </div>

                      <Link href={`/consumer/scan?qr=${product.qrCode}`} className="block">
                        <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-900/10 hover:bg-blue-600 hover:shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group-hover/btn:gap-3">
                            <ScanLine className="w-5 h-5" />
                            Trace Journey
                        </button>
                      </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length > 0 && (
          <motion.div
            className="mt-12 p-1 rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-90 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
              <div className="bg-white/95 backdrop-blur-xl rounded-[1.3rem] px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl">⛓️</div>
                      <div>
                          <h3 className="font-bold text-slate-800">100% Blockchain Verified</h3>
                          <p className="text-sm text-slate-500">Authenticity guaranteed by Ethereum Smart Contracts. No fakes allowed.</p>
                      </div>
                  </div>
                  <div className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-mono text-slate-500">
                        Contract: 0x39d6...b1fc1
                  </div>
              </div>
          </motion.div>
        )}
      </div>
    </ConsumerLayout>
  );
}

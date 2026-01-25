'use client';
import { useState, useEffect } from 'react';
import FarmerLayout from '@/components/farmer/FarmerLayout';
import { graphqlRequest } from '@/lib/apollo-client';
import { MY_PRODUCTS_QUERY } from '@/lib/graphql/product';
import { 
    TrendingUp, 
    Package, 
    DollarSign, 
    Loader2, 
    ArrowUpDown,
    AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Earnings() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = highest first

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await graphqlRequest(MY_PRODUCTS_QUERY);
                setProducts(data?.myProducts || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Calculate totals
    const totalSold = products.reduce((sum, p) => sum + (p.soldQuantity || 0), 0);
    const totalEarnings = products.reduce((sum, p) => sum + ((p.soldQuantity || 0) * (p.pricePerKg || 0)), 0);
    const activeProducts = products.filter(p => p.status === 'active').length;

    // Sort products by quantity sold
    const sortedProducts = [...products].sort((a, b) => {
        const aQty = a.soldQuantity || 0;
        const bQty = b.soldQuantity || 0;
        return sortOrder === 'desc' ? bQty - aQty : aQty - bQty;
    });

    const toggleSort = () => {
        setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    };

    return (
        <FarmerLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Earnings Report</h1>
                    <p className="text-slate-500 mt-1">Track your sales and revenue by product</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-100 rounded-xl">
                                <DollarSign className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Total Revenue</p>
                                <p className="text-2xl font-bold text-slate-900">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `$${totalEarnings.toFixed(2)}`}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Total Sold</p>
                                <p className="text-2xl font-bold text-slate-900">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${totalSold.toFixed(1)} kg`}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-violet-100 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-violet-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Active Products</p>
                                <p className="text-2xl font-bold text-slate-900">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : activeProducts}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Sales Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-xl font-bold text-slate-900">Sales by Product</h2>
                        <p className="text-sm text-slate-500 mt-1">All products sorted by quantity sold</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-16">
                            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                        </div>
                    ) : sortedProducts.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            #
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            Product Name
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            Price/kg
                                        </th>
                                        <th 
                                            className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-emerald-600 transition"
                                            onClick={toggleSort}
                                        >
                                            <div className="flex items-center gap-2">
                                                Quantity Sold
                                                <ArrowUpDown className="w-4 h-4" />
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            Revenue
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {sortedProducts.map((product, index) => {
                                        const soldQty = product.soldQuantity || 0;
                                        const revenue = soldQty * (product.pricePerKg || 0);
                                        
                                        return (
                                            <motion.tr
                                                key={product.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.05 * index }}
                                                className="hover:bg-slate-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-slate-400 font-medium">{index + 1}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        {product.photos?.[0] ? (
                                                            <img 
                                                                src={product.photos[0]} 
                                                                alt={product.title}
                                                                className="w-10 h-10 rounded-lg object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                                                <Package className="w-5 h-5 text-slate-400" />
                                                            </div>
                                                        )}
                                                        <span className="font-semibold text-slate-900">{product.title}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-slate-600">{product.category || '-'}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="font-medium text-slate-700">${product.pricePerKg?.toFixed(2) || '0.00'}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`font-bold ${soldQty > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                            {soldQty.toFixed(1)} kg
                                                        </span>
                                                        {soldQty > 0 && (
                                                            <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                                <div 
                                                                    className="h-full bg-emerald-500 rounded-full"
                                                                    style={{ width: `${Math.min(100, (soldQty / (product.totalQuantity || 1)) * 100)}%` }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`font-bold ${revenue > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                        ${revenue.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                                        product.status === 'active' 
                                                            ? 'bg-emerald-100 text-emerald-700' 
                                                            : product.status === 'sold_out'
                                                            ? 'bg-orange-100 text-orange-700'
                                                            : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${
                                                            product.status === 'active' 
                                                                ? 'bg-emerald-600' 
                                                                : product.status === 'sold_out'
                                                                ? 'bg-orange-600'
                                                                : 'bg-slate-500'
                                                        }`}></span>
                                                        {product.status?.charAt(0).toUpperCase() + product.status?.slice(1).replace('_', ' ') || 'Unknown'}
                                                    </span>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
                            <p className="text-slate-500 font-medium">No products found</p>
                            <p className="text-slate-400 text-sm mt-1">Create products to track your earnings</p>
                        </div>
                    )}

                    {/* Summary Footer */}
                    {sortedProducts.length > 0 && (
                        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-medium">
                                    {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} total
                                </span>
                                <div className="flex items-center gap-8">
                                    <div>
                                        <span className="text-slate-500 text-sm">Total Sold: </span>
                                        <span className="font-bold text-slate-900">{totalSold.toFixed(1)} kg</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 text-sm">Total Revenue: </span>
                                        <span className="font-bold text-emerald-600">${totalEarnings.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </FarmerLayout>
    );
}

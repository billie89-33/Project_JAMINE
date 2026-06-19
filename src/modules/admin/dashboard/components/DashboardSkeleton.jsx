
/**
 * 🦴 DashboardSkeleton
 * ตัวอย่างหน้าจอจำลอง (Skeleton) ระหว่างรอโหลดข้อมูล Dashboard
 */
const DashboardSkeleton = () => {
    return (
        <div className="max-w-[1600px] mx-auto animate-pulse">
            
            {/* 1. Header Skeleton */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="h-4 w-32 bg-slate-200 rounded-full mb-3"></div>
                    <div className="h-10 w-64 bg-slate-200 rounded-2xl mb-2"></div>
                    <div className="h-4 w-80 bg-slate-100 rounded-full"></div>
                </div>
                <div className="h-12 w-40 bg-slate-200 rounded-2xl"></div>
            </div>
            
            {/* 2. Stat Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white rounded-[32px] p-8 h-44 shadow-sm border border-slate-50 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100"></div>
                            <div className="w-12 h-5 bg-slate-100 rounded-full"></div>
                        </div>
                        <div>
                            <div className="h-3 w-20 bg-slate-100 rounded-full mb-3"></div>
                            <div className="h-8 w-32 bg-slate-200 rounded-xl"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Charts Row Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
                <div className="lg:col-span-2 bg-white rounded-[40px] p-8 h-[500px] shadow-sm border border-slate-50">
                    <div className="flex justify-between items-center mb-12">
                        <div className="h-8 w-48 bg-slate-200 rounded-xl"></div>
                        <div className="h-10 w-60 bg-slate-100 rounded-2xl"></div>
                    </div>
                    <div className="w-full h-64 bg-slate-50 rounded-3xl"></div>
                </div>
                <div className="lg:col-span-1 bg-white rounded-[40px] p-8 h-[500px] shadow-sm border border-slate-50">
                    <div className="h-8 w-40 bg-slate-200 rounded-xl mb-8"></div>
                    <div className="w-48 h-48 rounded-full bg-slate-50 mx-auto mb-10"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-slate-100"></div>
                                    <div className="h-4 w-24 bg-slate-100 rounded-full"></div>
                                </div>
                                <div className="h-6 w-12 bg-slate-100 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. Bottom Lists Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {[1, 2].map(i => (
                    <div key={i} className="bg-white rounded-[40px] p-8 h-[400px] shadow-sm border border-slate-50">
                        <div className="flex justify-between items-center mb-10">
                            <div className="h-8 w-40 bg-slate-200 rounded-xl"></div>
                            <div className="h-8 w-20 bg-slate-100 rounded-xl"></div>
                        </div>
                        <div className="space-y-6">
                            {[1, 2, 3].map(j => (
                                <div key={j} className="flex items-center justify-between p-2">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 w-32 bg-slate-200 rounded-full"></div>
                                            <div className="h-3 w-20 bg-slate-100 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="h-6 w-16 bg-slate-100 rounded-lg"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardSkeleton;

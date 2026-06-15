import { motion } from 'framer-motion';

export const BarChart = ({ data, title, color = "bg-primary-500" }) => {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg mb-6">{title}</h3>
            <div className="flex items-end gap-2 h-64">
                {data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="relative w-full flex justify-center">
                            <span className="absolute bottom-full mb-2 text-xs font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.value}
                            </span>
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(item.value / maxValue) * 100}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                className={`w-full max-w-[40px] ${color} rounded-t-lg opacity-80 hover:opacity-100 transition-opacity`}
                            />
                        </div>
                        <span className="text-xs text-gray-400 font-medium truncate w-full text-center">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const DonutChart = ({ data, title }) => {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    let currentAngle = 0;

    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg mb-6">{title}</h3>
            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative w-48 h-48">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                        {data.map((item, index) => {
                            const percentage = (item.value / total) * 100;
                            const angle = (percentage / 100) * 360;
                            const radius = 40;
                            const circumference = 2 * Math.PI * radius;
                            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                            const strokeDashoffset = 0; // We rotate the circle segment instead of offsetting

                            const segment = (
                                <circle
                                    key={index}
                                    cx="50"
                                    cy="50"
                                    r={radius}
                                    fill="transparent"
                                    stroke={item.color}
                                    strokeWidth="20"
                                    strokeDasharray={strokeDasharray}
                                    strokeDashoffset={strokeDashoffset}
                                    transform={`rotate(${currentAngle} 50 50)`}
                                    className="hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                                />
                            );
                            currentAngle += angle;
                            return segment;
                        })}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-black text-gray-900">{total}</span>
                        <span className="text-xs text-gray-500 uppercase font-bold">Total</span>
                    </div>
                </div>
                <div className="flex-1 space-y-3">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }} />
                                <span className="text-sm font-medium text-gray-600">{item.label}</span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

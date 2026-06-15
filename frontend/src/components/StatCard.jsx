const StatCard = ({ icon, label, value, color }) => (
    <div className={`p-6 rounded-3xl ${color} flex items-center gap-6 shadow-sm`}>
        <div className="p-4 bg-white rounded-2xl shadow-sm">{icon}</div>
        <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-3xl font-black text-gray-900">{value}</p>
        </div>
    </div>
);

export default StatCard;

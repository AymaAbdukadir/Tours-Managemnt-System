import { motion } from 'framer-motion';

const SectionHeader = ({ title, subtitle }) => (
    <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 leading-tight">{title}</h2>
        {subtitle && <p className="text-gray-500 text-lg">{subtitle}</p>}
        <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            className="h-1.5 w-20 bg-primary-600 rounded-full mt-4 origin-left"
        />
    </div>
);

export default SectionHeader;

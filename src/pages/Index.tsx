
import { MainLayout } from "@/components/layout/MainLayout";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { motion } from "framer-motion";

export default function Index() {
  return (
    <MainLayout>
      <motion.div 
        className="max-w-7xl mx-auto px-4 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Dashboard />
      </motion.div>
    </MainLayout>
  );
}

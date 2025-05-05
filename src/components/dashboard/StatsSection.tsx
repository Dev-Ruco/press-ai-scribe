
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, Legend
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Activity, Clock, PieChart as PieChartIcon } from "lucide-react";

// Mock data until we have real data
const generateMockWeeklyActivity = () => {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const today = new Date().getDay();
  
  return days.map((day, index) => ({
    name: day,
    artigos: Math.floor(Math.random() * 5),
    transcrições: Math.floor(Math.random() * 3),
    // Set future days to have no data
    active: index <= today
  })).filter(day => day.active);
};

const mockArticleTypes = [
  { name: "Notícia", value: 40 },
  { name: "Reportagem", value: 25 },
  { name: "Entrevista", value: 15 },
  { name: "Análise", value: 20 }
];

const mockTimeData = [
  { name: "Jan", tempo: 12 },
  { name: "Fev", tempo: 11 },
  { name: "Mar", tempo: 10 },
  { name: "Abr", tempo: 8 },
  { name: "Mai", tempo: 7 },
  { name: "Jun", tempo: 6 },
  { name: "Jul", tempo: 5 }
];

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function StatsSection() {
  const { user } = useAuth();
  const [weeklyActivity, setWeeklyActivity] = useState(generateMockWeeklyActivity());
  const [articleTypes, setArticleTypes] = useState(mockArticleTypes);
  const [timeData, setTimeData] = useState(mockTimeData);
  
  useEffect(() => {
    if (user) {
      // In a real implementation, we would fetch actual data here
      // For now, we'll use mock data
      
      // Fetch weekly activity data from Supabase
      // fetchWeeklyActivityData();
      
      // Fetch article types distribution
      // fetchArticleTypesData();
      
      // Fetch average generation time trend
      // fetchGenerationTimeData();
    }
  }, [user]);
  
  // In a real implementation, we would have these functions
  // to fetch data from Supabase
  const fetchWeeklyActivityData = async () => {
    // Implementation would go here
  };
  
  const fetchArticleTypesData = async () => {
    // Implementation would go here
  };
  
  const fetchGenerationTimeData = async () => {
    // Implementation would go here
  };
  
  if (!user) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-xl font-semibold mb-4">Estatísticas</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <Card className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-gray-50 pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-gray-700" />
              <span>Atividade Semanal</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={weeklyActivity}
                margin={{
                  top: 5,
                  right: 30,
                  left: 0,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="artigos" fill="#8884d8" name="Artigos" />
                <Bar dataKey="transcrições" fill="#82ca9d" name="Transcrições" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Average Article Generation Time */}
        <Card className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-gray-50 pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-700" />
              <span>Tempo Médio (min)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={timeData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 0,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} min`, 'Tempo']} />
                <Line 
                  type="monotone" 
                  dataKey="tempo" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                  name="Tempo médio"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Article Types Distribution */}
        <Card className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-gray-50 pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-gray-700" />
              <span>Uso por Tipo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart width={400} height={300}>
                <Pie
                  data={articleTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {articleTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentagem']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

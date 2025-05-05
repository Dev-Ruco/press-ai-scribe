
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, Legend
} from "recharts";
import { motion } from "framer-motion";
import { Activity, Clock, PieChart as PieChartIcon, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

// Monochromatic color scheme - using only blacks, whites, and grays
const COLORS = ['#000000', '#333333', '#666666', '#999999'];

export function StatsSection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [articleTypes, setArticleTypes] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [hasData, setHasData] = useState(false);
  
  useEffect(() => {
    if (user) {
      // Simulate fetching data - in a real app, this would be actual data fetching
      
      // For demo purposes, we're randomly determining if we have data or not
      const hasRealData = Math.random() > 0.5; // 50% chance of having data
      
      if (hasRealData) {
        setWeeklyActivity(generateMockWeeklyActivity());
        setArticleTypes(mockArticleTypes);
        setTimeData(mockTimeData);
        setHasData(true);
      } else {
        setWeeklyActivity([]);
        setArticleTypes([]);
        setTimeData([]);
        setHasData(false);
      }
    }
  }, [user]);
  
  if (!user) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mb-8"
    >
      <h2 className="text-xl font-semibold mb-4 text-primary-dark">Estatísticas</h2>
      
      {hasData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Activity Chart */}
          <Card className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            <CardHeader className="bg-gray-50 pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-primary-dark">
                <Activity className="h-5 w-5 text-primary" />
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
                  <XAxis dataKey="name" stroke="#1E1E1E" />
                  <YAxis allowDecimals={false} stroke="#1E1E1E" />
                  <Tooltip contentStyle={{ backgroundColor: 'white', borderColor: '#A0A0A0' }} />
                  <Legend />
                  <Bar dataKey="artigos" fill="#000000" name="Artigos" />
                  <Bar dataKey="transcrições" fill="#666666" name="Transcrições" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Average Article Generation Time */}
          <Card className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            <CardHeader className="bg-gray-50 pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-primary-dark">
                <Clock className="h-5 w-5 text-primary" />
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
                  <XAxis dataKey="name" stroke="#1E1E1E" />
                  <YAxis stroke="#1E1E1E" />
                  <Tooltip formatter={(value) => [`${value} min`, 'Tempo']} contentStyle={{ backgroundColor: 'white', borderColor: '#A0A0A0' }} />
                  <Line 
                    type="monotone" 
                    dataKey="tempo" 
                    stroke="#000000" 
                    activeDot={{ r: 8 }} 
                    name="Tempo médio"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Article Types Distribution */}
          <Card className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            <CardHeader className="bg-gray-50 pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-primary-dark">
                <PieChartIcon className="h-5 w-5 text-primary" />
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
                    fill="#000000"
                    dataKey="value"
                  >
                    {articleTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentagem']} contentStyle={{ backgroundColor: 'white', borderColor: '#A0A0A0' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Empty state for Weekly Activity */}
          <Card className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            <CardHeader className="bg-gray-50 pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-primary-dark">
                <Activity className="h-5 w-5 text-primary" />
                <span>Atividade Semanal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 h-64 flex flex-col justify-center items-center text-center">
              <p className="text-gray-500 mb-4">Estatísticas serão apresentadas assim que houver atividade.</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/new-article")}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Criar Primeiro Artigo</span>
              </Button>
            </CardContent>
          </Card>
          
          {/* Empty state for Time Chart */}
          <Card className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            <CardHeader className="bg-gray-50 pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-primary-dark">
                <Clock className="h-5 w-5 text-primary" />
                <span>Tempo Médio (min)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 h-64 flex flex-col justify-center items-center text-center">
              <p className="text-gray-500">Dados de tempo médio aparecerão após a criação de artigos.</p>
            </CardContent>
          </Card>
          
          {/* Empty state for Pie Chart */}
          <Card className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            <CardHeader className="bg-gray-50 pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-primary-dark">
                <PieChartIcon className="h-5 w-5 text-primary" />
                <span>Uso por Tipo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 h-64 flex flex-col justify-center items-center text-center">
              <p className="text-gray-500">Distribução por tipo de artigo será exibida conforme você cria conteúdo.</p>
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  );
}
